/* enhelp.kz — «Мой кабинет». Подключение в блоке T123 на закрытой странице:
   <div id="enhCabinet"></div>
   <script>window.ENH_CABINET = { api: "ССЫЛКА_EXEC", projectId: "9204211" };</script>
   <script src="https://liuta123.github.io/enhelp-audio/cabinet-app.js"></script> */
(function () {
  var mount = document.getElementById("enhCabinet");
  if (!mount || mount.dataset.ready) return;
  mount.dataset.ready = "1";
  var C = window.ENH_CABINET || {};
  var PID = C.projectId || "9204211", API = C.api || "";

  var KEYS = "BACCACBD BCDCCCCC CCBCBACB CCBCCBCC BBABBCAC CBBCBBBD BCDBCDCA BCBCDCBC ABDADADB BCBBDBDB BCCCBBBB BBCADBAC CDACDBBC CABDCBDC BDCCBCBA BCBBBBBB CCBCCBCA AAAAABDA CCBDABAD BDDCABBB BAAAABDC ABBCAACD ABCBADBC CCDABCBC CCDCBCCC DCBCBDDC DABDDAAA ABCBABBC ADBBDDDC CABBADDC BCADBCDB CBDDAAAA ACDDAABA ADDAAABB CABADAAD DCACABAC CABABBAA ABDDCDBC CDDDBABC BADABCBD".split(" ");
  var KNOWN = {
    "Грамматика английского языка": ["Сборник", "Правила в таблицах и тесты к ним."],
    "Подборка видеоуроков по грамматике": ["Видео", "Короткие видеоразборы тем грамматики."],
    "Подборка видеоуроков по ТГО": ["Видео", "Видеоуроки по ТГО."],
    "ТГО дополнение": ["ТГО", "Дополнительные материалы по ТГО."]
  };
  var MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

  var css = [
    ".enh-cab-wrap{--bg:#f4f7fb;--surface:#fff;--ink:#1f1b22;--ink-2:#4a586e;--ink-3:#7d889a;--line:#e4e7ee;--line-2:#cfd6e2;--tile:#eef1f6;--accent:#7b2232;background:var(--bg);color:var(--ink);width:100%}",
    ".enh-cab{max-width:880px;margin:0 auto;padding-block:36px 56px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;gap:18px;font:15px/1.5 'Open Sans',Arial,sans-serif;box-sizing:border-box}",
    ".enh-cab *,.enh-cab *::before,.enh-cab *::after{box-sizing:border-box}",
    ".enh-cab [hidden]{display:none!important}",
    ".enh-cab a{color:inherit}",
    ".enh-cab :focus-visible{outline:2px solid var(--ink);outline-offset:2px}",
    ".enh-cab-eyebrow{margin:0;color:var(--accent);font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700}",
    ".enh-cab h1{margin:0;font:700 34px/1.15 Georgia,'Times New Roman',serif;text-wrap:balance}",
    ".enh-cab-lead{margin:0;color:var(--ink-2);max-width:62ch}",
    ".enh-cab-hello{display:grid;gap:8px}",
    ".enh-cab-card{background:var(--surface);border:1px solid var(--line);border-radius:16px}",
    ".enh-cab-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}",
    ".enh-cab-m{padding:20px;display:grid;gap:10px;align-content:start;min-width:0}",
    ".enh-cab-m.is-big{grid-column:1/-1;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px 24px}",
    ".enh-cab-k{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);font-weight:700}",
    ".enh-cab-m h3{margin:0;font:700 20px/1.2 Georgia,'Times New Roman',serif}",
    ".enh-cab-m p{margin:0;color:var(--ink-2);font-size:14px}",
    ".enh-cab-until{font-size:13px;color:var(--ink-3)}",
    ".enh-cab-until.is-soon{color:var(--accent);font-weight:600}",
    ".enh-cab-bar{height:6px;background:var(--tile);border-radius:3px;overflow:hidden}",
    ".enh-cab-bar i{display:block;height:100%;background:var(--ink-2);border-radius:3px;width:0}",
    ".enh-cab-row{display:flex;justify-content:space-between;gap:12px;font-size:13px;color:var(--ink-2);font-variant-numeric:tabular-nums}",
    ".enh-cab-go{justify-self:start;display:inline-block;background:var(--ink);color:#fff!important;border-radius:10px;padding:11px 18px;font-weight:600;font-size:14px;text-decoration:none;white-space:nowrap}",
    ".enh-cab-go:hover{background:#3a3440}",
    ".enh-cab-go.is-ghost{background:#fff;color:var(--ink)!important;border:1px solid var(--line-2)}",
    ".enh-cab-go.is-ghost:hover{background:var(--bg)}",
    ".enh-cab-topics{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}",
    ".enh-cab-topics a{display:inline-block;border:1px solid var(--line-2);border-radius:999px;padding:5px 11px;font-size:13px;text-decoration:none;background:#fff}",
    ".enh-cab-topics a:hover{border-color:var(--ink-2)}",
    ".enh-cab-more{border:0;background:none;padding:5px 4px;font:inherit;font-size:13px;color:var(--ink-2);text-decoration:underline;cursor:pointer}",
    ".enh-cab-side{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}",
    ".enh-cab-side .enh-cab-card{padding:18px 20px;display:grid;gap:8px;align-content:start}",
    ".enh-cab-side h4{margin:0;font:700 17px Georgia,'Times New Roman',serif}",
    ".enh-cab-side p{margin:0;color:var(--ink-2);font-size:14px}",
    ".enh-cab-empty{padding:24px;display:grid;gap:10px;justify-items:start}",
    "@media (max-width:640px){.enh-cab{padding-block:20px 40px;gap:14px}.enh-cab h1{font-size:27px}.enh-cab-grid,.enh-cab-side{grid-template-columns:minmax(0,1fr)}.enh-cab-m.is-big{grid-template-columns:minmax(0,1fr)}}"
  ].join("\n");
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function href(link) { link = String(link || ""); return /^https?:\/\//.test(link) ? link : "/" + link.replace(/^\/+/, ""); }
  function profile() { try { return JSON.parse(localStorage.getItem("tilda_members_profile" + PID) || "null"); } catch (e) { return null; } }
  function until(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || "");
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return { text: "Доступ до " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear(), soon: d - new Date() < 14 * 864e5 };
  }

  var p = profile();
  var root = document.createElement("div");
  root.className = "enh-cab-wrap";
  mount.appendChild(root);

  if (!p || !p.login) {
    root.innerHTML = '<div class="enh-cab"><div class="enh-cab-card enh-cab-empty"><h1>Личный кабинет</h1><p class="enh-cab-lead">Войдите, чтобы увидеть свои материалы.</p><a class="enh-cab-go" href="/members/login">Войти</a></div></div>';
    return;
  }

  var email = String(p.login).trim().toLowerCase();
  var first = String(p.name || "").trim().split(/\s+/)[0];
  var groups = Object.keys(p.groups || {}).map(function (k) { return p.groups[k]; })
    .filter(function (g) { return g && g.name; })
    .sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
  var pagesOf = function (g) { var ps = g.pages || []; return (Array.isArray(ps) ? ps : Object.keys(ps).map(function (k) { return ps[k]; })).filter(function (x) { return x && x.link; }); };
  var listening = null, others = [];
  groups.forEach(function (g) {
    var ps = pagesOf(g);
    if (!listening && ps.some(function (x) { return String(x.link).replace(/^\//, "") === "listening"; })) listening = g;
    else others.push(g);
  });

  var html = '<div class="enh-cab">' +
    '<div class="enh-cab-hello"><p class="enh-cab-eyebrow">Личный кабинет · enhelp.kz</p>' +
    "<h1>Здравствуйте" + (first ? ", " + esc(first) : "") + "!</h1>" +
    '<p class="enh-cab-lead">' + (groups.length ? "Здесь все материалы, к которым у вас есть доступ." : "Материалы появятся здесь после оформления заказа. Информация по заказу обновляется в рабочее время в течение 1–2 часов после оплаты.") + "</p></div>";

  html += '<div class="enh-cab-grid">';
  if (listening) {
    var u = until(listening.expired);
    html += '<section class="enh-cab-card enh-cab-m is-big" aria-label="Listening"><div style="display:grid;gap:10px;min-width:0">' +
      '<span class="enh-cab-k">Аудирование · 40 записей</span><h3>Listening 2026</h3>' +
      '<p id="enhCabLsn">Аудио к сборнику тестов: плеер, вопросы с проверкой и тексты записей.</p>' +
      '<div class="enh-cab-row"><span id="enhCabSolved">Решено: 0 из 40</span><span id="enhCabAvg"></span></div>' +
      '<div class="enh-cab-bar"><i id="enhCabBar"></i></div>' +
      (u ? '<span class="enh-cab-until' + (u.soon ? " is-soon" : "") + '">' + u.text + "</span>" : "") +
      '</div><a class="enh-cab-go" id="enhCabGo" href="/listening">Открыть</a></section>';
  }
  others.forEach(function (g, gi) {
    var ps = pagesOf(g), meta = KNOWN[g.name] || ["Материалы", ""], u = until(g.expired);
    html += '<section class="enh-cab-card enh-cab-m"><span class="enh-cab-k">' + esc(meta[0]) + "</span><h3>" + esc(g.name) + "</h3>" +
      (meta[1] ? "<p>" + esc(meta[1]) + "</p>" : "");
    if (ps.length > 1) {
      html += '<ul class="enh-cab-topics" data-g="' + gi + '">' + ps.map(function (x, i) {
        return "<li" + (i >= 8 ? " hidden" : "") + '><a href="' + esc(href(x.link)) + '">' + esc(x.title || x.link) + "</a></li>";
      }).join("") + (ps.length > 8 ? '<li><button type="button" class="enh-cab-more">Все темы (' + ps.length + ")</button></li>" : "") + "</ul>";
    } else if (ps.length === 1) {
      html += '<a class="enh-cab-go is-ghost" href="' + esc(href(ps[0].link)) + '">Открыть</a>';
    }
    if (u) html += '<span class="enh-cab-until' + (u.soon ? " is-soon" : "") + '">' + u.text + "</span>";
    html += "</section>";
  });
  html += "</div>";

  html += '<div class="enh-cab-side">' +
    '<div class="enh-cab-card"><h4>Правила доступа</h4><p>Доступ к материалам персональный и предоставляется только вам. Вход допускается не более чем с трёх разных устройств. Передавать логин и пароль третьим лицам запрещено.</p></div>' +
    '<div class="enh-cab-card"><h4>Нужна помощь?</h4><p>Вопросы по заказу и материалам — пишите в WhatsApp или Telegram, кнопки в шапке сайта. Ответы на частые вопросы — в разделе <a href="/faq">FAQ</a>.</p></div>' +
    "</div></div>";
  root.innerHTML = html;

  Array.prototype.forEach.call(root.querySelectorAll(".enh-cab-more"), function (b) {
    b.addEventListener("click", function () {
      var ul = b.closest("ul");
      Array.prototype.forEach.call(ul.querySelectorAll("li[hidden]"), function (li) { li.hidden = false; });
      b.parentNode.remove();
    });
  });

  /* Прогресс Listening: из таблицы по email, иначе из этого браузера */
  function showProgress(res) {
    var solved = 0, sum = 0, done = {};
    Object.keys(res || {}).forEach(function (n) {
      var a = String(res[n]), k = KEYS[+n - 1];
      if (!k || !/^[ABCD-]{8}$/.test(a)) return;
      var r = 0; for (var i = 0; i < 8; i++) if (a[i] === k[i]) r++;
      solved++; sum += r; done[+n] = 1;
    });
    var el = function (id) { return document.getElementById(id); };
    if (!el("enhCabSolved")) return;
    el("enhCabSolved").textContent = "Решено: " + solved + " из 40";
    el("enhCabAvg").textContent = solved ? "в среднем " + (sum / solved).toFixed(1).replace(".", ",") + " из 8" : "";
    el("enhCabBar").style.width = (solved / 40 * 100) + "%";
    var next = 0; for (var t = 1; t <= 40; t++) if (!done[t]) { next = t; break; }
    if (solved && next) { el("enhCabLsn").textContent = "Дальше по порядку: Text " + next + "."; el("enhCabGo").textContent = "Продолжить"; }
    else if (solved && !next) { el("enhCabLsn").textContent = "Все 40 текстов решены. Можно повторить самые трудные."; }
  }
  if (listening) {
    var local = null;
    try {
      var s = JSON.parse(localStorage.getItem("enhelp-listening-2026:" + email) || "null");
      if (s && s.chk && s.ans) {
        local = {};
        Object.keys(s.chk).forEach(function (i) { if (s.chk[i] && s.ans[i]) local[+i + 1] = s.ans[i].map(function (x) { return x == null ? "-" : "ABCD"[x]; }).join(""); });
      }
    } catch (e) {}
    if (local) showProgress(local);
    if (API) fetch(API + (API.indexOf("?") > -1 ? "&" : "?") + "email=" + encodeURIComponent(email))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) return;
        if (d.status && d.status !== "ok" && window.enhGuard) window.enhGuard.apply({ status: d.status });
        showProgress(d.results || {});
      }).catch(function () {});
  }

  /* Отступ от закреплённой шапки сайта */
  function fit() {
    root.style.paddingTop = "";
    var bottom = 0;
    [0.1, 0.5, 0.9].forEach(function (fx) {
      var els = document.elementsFromPoint ? document.elementsFromPoint(window.innerWidth * fx, 2) : [];
      for (var i = 0; i < els.length; i++) for (var n = els[i]; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
        if (n === root || root.contains(n) || n.contains(root)) break;
        var pos = getComputedStyle(n).position;
        if (pos === "fixed" || pos === "sticky" || pos === "absolute") {
          var r = n.getBoundingClientRect();
          if (r.top <= 2 && r.height > 10 && r.height < 260) bottom = Math.max(bottom, r.bottom);
          break;
        }
      }
    });
    if (!bottom) return;
    var inner = root.firstElementChild;
    var top = inner.getBoundingClientRect().top + window.scrollY + parseFloat(getComputedStyle(inner).paddingTop || 0);
    var need = Math.ceil(bottom + 16 - top);
    if (need > 0) root.style.paddingTop = need + "px";
  }
  fit(); setTimeout(fit, 600); setTimeout(fit, 2000);
  window.addEventListener("load", fit);
  window.addEventListener("resize", function () { clearTimeout(fit.t); fit.t = setTimeout(fit, 200); });
})();
