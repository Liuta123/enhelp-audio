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
  var TXT = {
    blockTitle: "Аккаунт заблокирован",
    blockText: "В ваш аккаунт входили более чем с трёх разных устройств, в том числе после предупреждения. Доступ к материалам личного кабинета персональный, поэтому аккаунт заблокирован.",
    blockHelp: "Если вы считаете, что это ошибка, напишите нам в WhatsApp или Telegram.",
    blockBtn: "На главную enhelp.kz",
    warnTitle: "Предупреждение",
    warnText: "В ваш аккаунт входили с нескольких разных устройств. Напоминаем: доступ к материалам личного кабинета персональный, вход допускается не более чем с трёх разных устройств, передавать логин и пароль третьим лицам запрещено.",
    warnText2: "Если вход с новых устройств продолжится, аккаунт будет заблокирован и вы потеряете доступ.",
    warnBtn: "Понятно"
  };
  var FONT = "font-family:'Open Sans',Arial,sans-serif;color:#1f1b22";
  var CARD = "max-width:460px;width:100%;box-sizing:border-box;background:#fff;border:1px solid #e4e7ee;border-radius:16px;padding:28px;display:grid;gap:12px";
  var P = "margin:0;color:#4a586e;font-size:15px;line-height:1.55";
  var H = "margin:0;font:700 24px/1.2 Georgia,'Times New Roman',serif;color:#1f1b22";
  var BTN = "justify-self:start;margin-top:4px;background:#1f1b22;color:#fff;text-decoration:none;border:0;cursor:pointer;padding:12px 22px;border-radius:10px;font:600 15px 'Open Sans',Arial,sans-serif";

  function showBlocked() {
    if (document.getElementById("enhBlocked")) return;
    var w = document.getElementById("enhWarned"); if (w) w.remove();
    Array.prototype.forEach.call(document.querySelectorAll("audio,video"), function (m) { try { m.pause(); } catch (e) {} });
    var o = css(document.createElement("div"), "position:fixed;inset:0;z-index:2147483000;background:#f4f7fb;display:grid;place-items:center;padding:24px;" + FONT);
    o.id = "enhBlocked";
    o.innerHTML = '<div role="alertdialog" aria-modal="true" style="' + CARD + '"><p style="' + H + '">' + TXT.blockTitle + '</p><p style="' + P + '">' + TXT.blockText + '</p><p style="' + P + '">' + TXT.blockHelp + '</p><a href="/" style="' + BTN + '">' + TXT.blockBtn + "</a></div>";
    document.body.appendChild(o);
    document.documentElement.style.overflow = "hidden";
  }
  function showWarned() {
    if (document.getElementById("enhWarned") || document.getElementById("enhBlocked")) return;
    try { if (sessionStorage.getItem("enh-warn-seen")) return; } catch (e) {}
    var o = css(document.createElement("div"), "position:fixed;inset:0;z-index:2147482000;background:rgba(31,27,34,.45);display:grid;place-items:center;padding:24px;" + FONT);
    o.id = "enhWarned";
    o.innerHTML = '<div role="alertdialog" aria-modal="true" style="' + CARD + '"><p style="' + H + '">' + TXT.warnTitle + '</p><p style="' + P + '">' + TXT.warnText + '</p><p style="' + P + ';color:#1f1b22;font-weight:600">' + TXT.warnText2 + '</p><button type="button" style="' + BTN + '">' + TXT.warnBtn + "</button></div>";
    o.querySelector("button").onclick = function () { o.remove(); try { sessionStorage.setItem("enh-warn-seen", "1"); } catch (e) {} };
    document.body.appendChild(o);
    o.querySelector("button").focus();
  }
  function apply(st) {
    if (!st) return;
    if (st.status === "blocked") showBlocked();
    else if (st.status === "warned") showWarned();
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
