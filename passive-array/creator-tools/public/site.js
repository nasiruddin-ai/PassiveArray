/* Passive Array site chrome: theme toggle, universal search routing, directory filters.
   Loaded on every page. Tool pages also load shared.js for the calculators. */
(function () {
  "use strict";
  var root = document.documentElement;
  var ROOT = (document.body && document.body.getAttribute("data-root")) || "";

  /* Theme */
  function setTheme(t) {
    if (t) root.setAttribute("data-theme", t); else root.removeAttribute("data-theme");
    try { if (t) localStorage.setItem("pa-theme", t); else localStorage.removeItem("pa-theme"); } catch (e) { /* private mode */ }
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { setTheme(root.getAttribute("data-theme") === "dark" ? "" : "dark"); });
  });
  if (root.getAttribute("data-theme") === "dark") setTheme("dark");

  /* Universal search: a link or handle goes to the right live checker. */
  function route(raw) {
    var v = String(raw || "").trim();
    if (!v) return null;
    if (/twitch\.tv\//i.test(v) || /^twitch:/i.test(v)) {
      var login = v.replace(/^twitch:/i, "").replace(/^.*twitch\.tv\//i, "").split(/[/?#]/)[0];
      return ROOT + "creator-tools/twitch-follower-count-checker/?login=" + encodeURIComponent(login);
    }
    return ROOT + "creator-tools/youtube-subscriber-count-checker/?channel=" + encodeURIComponent(v);
  }
  document.querySelectorAll("form[data-search]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = f.querySelector("input");
      var to = route(input && input.value);
      if (to) location.href = to; else if (input) input.focus();
    });
  });

  /* Directory filters */
  var dir = document.querySelector("[data-directory]");
  if (dir) {
    var state = { intent: "all", platform: "all", q: "" };
    var cards = Array.prototype.slice.call(dir.querySelectorAll("a.card[data-intent]"));
    var groups = Array.prototype.slice.call(dir.querySelectorAll(".group"));
    var empty = dir.querySelector(".empty");
    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (state.intent === "all" || c.dataset.intent === state.intent) &&
          (state.platform === "all" || c.dataset.platform === state.platform) &&
          (!state.q || c.textContent.toLowerCase().indexOf(state.q) !== -1);
        c.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      groups.forEach(function (g) {
        var any = Array.prototype.some.call(g.querySelectorAll("a.card"), function (c) { return c.style.display !== "none"; });
        g.style.display = any ? "" : "none";
      });
      if (empty) empty.style.display = shown ? "none" : "";
      var count = dir.querySelector("[data-count]");
      if (count) count.textContent = shown;
    }
    dir.querySelectorAll(".fbtn").forEach(function (b) {
      b.addEventListener("click", function () {
        var key = b.dataset.filter, val = b.dataset.value;
        state[key] = val;
        dir.querySelectorAll('.fbtn[data-filter="' + key + '"]').forEach(function (x) { x.classList.toggle("on", x === b); });
        apply();
      });
    });
    var q = dir.querySelector("input[type=search]");
    if (q) q.addEventListener("input", function () { state.q = q.value.trim().toLowerCase(); apply(); });
    // Deep links: /creator-tools/#YouTube or #create
    var hash = decodeURIComponent(location.hash.replace("#", ""));
    if (hash) {
      var btn = dir.querySelector('.fbtn[data-value="' + hash + '"]');
      if (btn) btn.click();
    }
  }
})();
