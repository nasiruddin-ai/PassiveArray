// Home page interactions (markup from creator-tools/home-v2.js). Hooks are data-hp attributes.
(function () {
  var root = document.querySelector('[data-hp="root"]');
  if (!root) return;
  var one = function (name) { return root.querySelector('[data-hp="' + name + '"]'); };
  var all = function (name) { return Array.prototype.slice.call(root.querySelectorAll('[data-hp="' + name + '"]')); };
  var base = root.getAttribute("data-root") || "";

  /* hero checker: the mode sets which tool the form opens; a bare name becomes an @handle,
     because a plain-name lookup falls back to YouTube search, which has a small daily quota. */
  var form = one("checker");
  if (form) {
    var input = form.querySelector("input"), cta = one("cta");
    all("mode").forEach(function (b) {
      b.addEventListener("click", function () {
        all("mode").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        form.setAttribute("action", b.getAttribute("data-action"));
        cta.textContent = b.getAttribute("data-cta");
        input.focus();
      });
    });
    form.addEventListener("submit", function () {
      var v = input.value.trim();
      if (v && !/^https?:\/\//i.test(v) && !/youtube\.com|youtu\.be/i.test(v)) input.value = "@" + v.replace(/^@+/, "").replace(/\s+/g, "");
    });
  }

  /* monetization example tabs */
  var tabs = all("tab"), cards = all("signal");
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x, j) { x.setAttribute("aria-selected", String(i === j)); });
      cards.forEach(function (c, j) { c.hidden = i !== j; });
    });
  });
  root.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-channel]");
    if (!a) return;
    e.preventDefault();
    location.href = a.getAttribute("href") + "?channel=" + encodeURIComponent(a.getAttribute("data-channel"));
  });

  /* MCP preview: replay reveals the lines one by one; copy puts the server URL on the clipboard */
  var term = one("term"), replay = one("replay"), copy = one("copy");
  if (term && replay) {
    var timer;
    replay.addEventListener("click", function () {
      var kids = Array.prototype.slice.call(term.children);
      clearTimeout(timer);
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { kids.forEach(function (k) { k.style.visibility = ""; }); return; }
      kids.forEach(function (k) { k.style.visibility = "hidden"; });
      var i = 0;
      (function step() { kids[i++].style.visibility = ""; if (i < kids.length) timer = setTimeout(step, 420); })();
    });
  }
  if (copy) {
    copy.addEventListener("click", function () {
      var url = copy.getAttribute("data-url"), label = "Copy server URL";
      var done = function (text) { copy.textContent = text; setTimeout(function () { copy.textContent = label; }, 2400); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { done("Copied"); }, function () { done(url); });
      else done(url);
    });
  }

  /* tool directory: search, platform and job filters; the counts on each pill follow the other filters */
  var grid = one("grid");
  if (grid) {
    var tools = all("tool"), q = one("q"), count = one("count"), empty = one("empty"), more = one("more");
    var total = tools.length, FIRST = 12;
    var state = { q: "", plat: "all", intent: "all", all: false };
    var match = function (t, skip) {
      if (skip !== "plat" && state.plat !== "all" && t.getAttribute("data-p") !== state.plat) return false;
      if (skip !== "intent" && state.intent !== "all" && t.getAttribute("data-i") !== state.intent) return false;
      var text = t.getAttribute("data-t"), words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      return words.every(function (w) { return text.indexOf(w) >= 0; });
    };
    var render = function () {
      var filtered = !!state.q.trim() || state.plat !== "all" || state.intent !== "all", shown = 0, hits = 0;
      tools.forEach(function (t) {
        var ok = match(t);
        if (ok) hits++;
        var show = ok && (filtered || state.all || hits <= FIRST);
        t.hidden = !show;
        if (show) shown++;
      });
      ["plat", "intent"].forEach(function (key) {
        all(key).forEach(function (b) {
          var v = b.getAttribute("data-v");
          b.setAttribute("aria-pressed", String(state[key] === v));
          var n = tools.filter(function (t) { return match(t, key) && (v === "all" || t.getAttribute(key === "plat" ? "data-p" : "data-i") === v); }).length;
          b.querySelector("small").textContent = n;
        });
      });
      empty.hidden = hits > 0;
      count.textContent = filtered ? hits + " of " + total + " tools match" : "Showing " + shown + " of " + total + " tools";
      more.hidden = filtered || total <= FIRST;
      more.textContent = state.all ? "Show fewer" : "Show all " + total + " tools";
    };
    ["plat", "intent"].forEach(function (key) {
      all(key).forEach(function (b) { b.addEventListener("click", function () { state[key] = b.getAttribute("data-v"); render(); }); });
    });
    q.addEventListener("input", function () { state.q = q.value; render(); });
    more.addEventListener("click", function () { state.all = !state.all; render(); });
    one("reset").addEventListener("click", function () { state.q = ""; q.value = ""; state.plat = "all"; state.intent = "all"; render(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); }
    });
  }

  /* outlier table: four long-form videos from the stored daily feed (no YouTube quota is used) */
  var panel = one("outliers");
  if (panel && window.fetch) {
    var fmt = function (n) { return n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M" : n >= 1e3 ? Math.round(n / 1e3) + "K" : String(n); };
    fetch(base + "research/api/outliers").then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.items) return;
      var rows = j.items.filter(function (x) { return x.multiplier >= 3 && x.multiplier <= 100 && !x.isShort && !x.hiddenSubscribers; })
        .sort(function (a, b) { return b.multiplier - a.multiplier; }).slice(0, 4);
      if (rows.length < 2) return;
      var body = one("out-rows");
      rows.forEach(function (x) {
        var tr = document.createElement("tr");
        var cell = function (cls, text) { var td = document.createElement("td"); if (cls) td.className = cls; td.textContent = text; tr.appendChild(td); return td; };
        var first = cell("", x.title.length > 80 ? x.title.slice(0, 78) + "..." : x.title);
        var small = document.createElement("small"); small.textContent = x.channelTitle; first.appendChild(small);
        cell("hp-r", fmt(x.views)); cell("hp-r", fmt(x.subscribers)); cell("hp-r hp-x", Math.round(x.multiplier) + "x");
        body.appendChild(tr);
      });
      one("out-count").textContent = (j.total || j.items.length) + " videos in the feed";
      var d = j.updatedAt ? new Date(j.updatedAt) : null;
      one("out-date").textContent = (d && !isNaN(d) ? "Feed updated " + d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) + ". " : "") + '"x usual" is views divided by the channel\'s median views.';
      panel.hidden = false;
    }).catch(function () {});
  }
})();
