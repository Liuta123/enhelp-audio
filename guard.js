/* enhelp.kz — учёт устройств на закрытых страницах личного кабинета.
   Подключается в шапке кабинета (блок T123):
   <script>window.ENH_GUARD = { api: "ССЫЛКА_EXEC", projectId: "9204211" };</script>
   <script src="https://АДРЕС_GITHUB/guard.js" defer></script> */
(function () {
  var C = window.ENH_GUARD || {};
  var API = C.api, PID = C.projectId || "9204211";
  var EVERY_MIN = C.everyMin != null ? +C.everyMin : 30; /* как часто отмечать вход с одного устройства, минут */

  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function readEmail() {
    var raw = ls("tilda_members_profile" + PID);
    if (!raw) return "";
    try {
      var p = JSON.parse(raw), cand = [p && p.login, p && p.email, p && p.data && p.data.login, p && p.data && p.data.email];
      for (var i = 0; i < cand.length; i++) if (typeof cand[i] === "string" && EMAIL_RE.test(cand[i].trim())) return cand[i].trim().toLowerCase();
      var m = raw.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
      return m ? m[0].toLowerCase() : "";
    } catch (e) { return ""; }
  }

  function deviceInfo() {
    var ua = navigator.userAgent || "";
    var os = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "iPad"
      : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "Другое";
    var br = /YaBrowser/.test(ua) ? "Яндекс Браузер" : /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera"
      : /Firefox|FxiOS/.test(ua) ? "Firefox" : /Chrome|CriOS/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : "Браузер";
    var s = window.screen || {};
    var w = Math.min(s.width || 0, s.height || 0), h = Math.max(s.width || 0, s.height || 0);
    var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    /* Признаки, которые не меняются при очистке браузера или в режиме инкогнито */
    var sig = [os, br, w + "x" + h, window.devicePixelRatio || 1, tz, navigator.language || "", navigator.hardwareConcurrency || "", navigator.maxTouchPoints || 0].join("|");
    var x = 2166136261;
    for (var i = 0; i < sig.length; i++) { x ^= sig.charCodeAt(i); x = Math.imul(x, 16777619) >>> 0; }
    return { id: os.slice(0, 3) + "-" + x.toString(36), label: os + " · " + br + " · " + w + "×" + h };
  }

  var email = readEmail(), dev = deviceInfo();
  window.enhUser = { email: email, device: dev.id, label: dev.label };
  if (!email || !API) return;

  var KEY = "enh-guard-" + email;
  function cached() { try { return JSON.parse(ls(KEY) || "null"); } catch (e) { return null; } }

  function css(el, s) { el.setAttribute("style", s); return el; }
  function showBlocked() {
    if (document.getElementById("enhBlocked")) return;
    Array.prototype.forEach.call(document.querySelectorAll("audio,video"), function (m) { try { m.pause(); } catch (e) {} });
    var o = css(document.createElement("div"), "position:fixed;inset:0;z-index:2147483000;background:#f4f7fb;display:grid;place-items:center;padding:24px;font-family:'Open Sans',Arial,sans-serif;color:#1f1b22");
    o.id = "enhBlocked";
    o.innerHTML = '<div style="max-width:460px;background:#fff;border:1px solid #e4e7ee;border-radius:16px;padding:28px;display:grid;gap:12px">' +
      '<div style="font:700 24px/1.2 Georgia,serif">Доступ приостановлен</div>' +
      '<div style="color:#4a586e;font-size:15px;line-height:1.55">В ваш кабинет входили с большого числа устройств, в том числе после предупреждения на почту. По правилам доступ рассчитан на одного студента и не более чем на 3 устройства.</div>' +
      '<div style="color:#4a586e;font-size:15px;line-height:1.55">Если это ошибка, напишите нам в WhatsApp или Telegram — проверим и восстановим доступ.</div>' +
      '<a href="/" style="justify-self:start;margin-top:4px;background:#1f1b22;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">На главную enhelp.kz</a></div>';
    document.body.appendChild(o);
    document.documentElement.style.overflow = "hidden";
  }
  function showWarned(n) {
    if (document.getElementById("enhWarned")) return;
    try { if (sessionStorage.getItem("enh-warn-closed")) return; } catch (e) {}
    var b = css(document.createElement("div"), "position:fixed;left:12px;right:12px;bottom:12px;z-index:2147482000;max-width:640px;margin:0 auto;background:#fff;border:1px solid #cfd6e2;border-radius:12px;box-shadow:0 8px 24px rgba(31,27,34,.12);padding:14px 16px;display:flex;gap:12px;align-items:flex-start;font:14px/1.5 'Open Sans',Arial,sans-serif;color:#1f1b22");
    b.id = "enhWarned";
    b.innerHTML = '<div style="flex:1;min-width:0"><b>Вход с ' + (n || "нескольких") + ' устройств за неделю.</b> Доступ рассчитан на одного студента и не более чем на 3 устройства. При новых входах с других устройств доступ будет приостановлен.</div>' +
      '<button type="button" aria-label="Закрыть" style="border:0;background:none;font-size:20px;line-height:1;cursor:pointer;color:#4a586e;padding:0 2px">×</button>';
    b.querySelector("button").onclick = function () { b.remove(); try { sessionStorage.setItem("enh-warn-closed", "1"); } catch (e) {} };
    document.body.appendChild(b);
  }
  function apply(st) {
    if (!st) return;
    if (st.status === "blocked") showBlocked();
    else if (st.status === "warned") showWarned(st.devices);
  }
  function onReady(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }
  window.enhGuard = { apply: function (st) { onReady(function () { apply(st); }); } };

  var c = cached();
  onReady(function () { apply(c); });
  if (c && c.device === dev.id && Date.now() - c.at < EVERY_MIN * 60000 && c.status !== "blocked") return;

  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "visit", email: email, device: dev.id, label: dev.label, page: location.pathname })
  }).then(function (r) { return r.json(); }).then(function (st) {
    if (!st || !st.ok) return;
    ls(KEY, JSON.stringify({ status: st.status, devices: st.devices, device: dev.id, at: Date.now() }));
    if (st.status === "ok") { var o = document.getElementById("enhBlocked"); if (o) { o.remove(); document.documentElement.style.overflow = ""; } }
    onReady(function () { apply(st); });
  }).catch(function () {});
})();
