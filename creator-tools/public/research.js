/* Research page: keyword analysis, autocomplete suggestions, saved keywords.
   Talks to ../research/api/keyword (rewritten to the research function). */
(function () {
  "use strict";
  var form = document.getElementById("kwform");
  if (!form) return;
  var input = document.getElementById("kw");
  var go = document.getElementById("kwgo");
  var results = document.getElementById("kwresults");
  var statusEl = document.getElementById("kwstatus");
  var savedSection = document.getElementById("saved-section");
  var savedBody = document.querySelector("#savedtable tbody");
  var SAVED_KEY = "pa-saved-keywords";
  var current = null;

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function fmt(n, d) { return n == null || !isFinite(n) ? "n/a" : Number(n).toLocaleString("en-US", { maximumFractionDigits: d == null ? 0 : d }); }
  function compact(n) {
    if (n == null || !isFinite(n)) return "n/a";
    var a = Math.abs(n);
    if (a >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
    if (a >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
    if (a >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return fmt(n);
  }
  function pct(x, d) { return isFinite(x) ? fmt(x * 100, d == null ? 0 : d) + "%" : "n/a"; }
  function ago(days) { return days < 1 ? "today" : days < 30 ? days + "d ago" : days < 365 ? Math.round(days / 30) + "mo ago" : (days / 365).toFixed(1) + "y ago"; }
  function scoreCls(v) { return v >= 70 ? "good" : v >= 50 ? "" : v >= 30 ? "warn" : "bad"; }
  function setStatus(t) { statusEl.textContent = t || ""; }

  /* ---------------------------------------------------------------- saved keywords */
  function loadSaved() { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch (e) { return []; } }
  function storeSaved(list) { try { localStorage.setItem(SAVED_KEY, JSON.stringify(list.slice(0, 200))); } catch (e) { /* private mode */ } }
  function isSaved(k) { return loadSaved().some(function (s) { return s.keyword === k; }); }
  function toggleSave(a) {
    var list = loadSaved();
    var idx = list.findIndex(function (s) { return s.keyword === a.keyword; });
    if (idx >= 0) list.splice(idx, 1);
    else list.unshift({ keyword: a.keyword, score: a.score ? a.score.value : null, competing: a.competing, avgViews: a.metrics ? a.metrics.avgViews : null, checkedAt: a.checkedAt });
    storeSaved(list);
    renderSaved();
    return idx < 0;
  }
  function renderSaved() {
    var list = loadSaved();
    savedSection.hidden = !list.length;
    savedBody.innerHTML = list.map(function (s) {
      return "<tr><td><a href=\"?q=" + encodeURIComponent(s.keyword) + "\" data-kw=\"" + esc(s.keyword) + "\">" + esc(s.keyword) + "</a></td>" +
        "<td class=\"num\">" + (s.score == null ? "n/a" : "<span class=\"pill " + scoreCls(s.score) + "\">" + s.score + "</span>") + "</td>" +
        "<td class=\"num\">" + compact(s.competing) + "</td><td class=\"num\">" + compact(s.avgViews) + "</td>" +
        "<td>" + (s.checkedAt ? new Date(s.checkedAt).toLocaleDateString() : "") + "</td>" +
        "<td class=\"num\"><button type=\"button\" class=\"btn ghost\" style=\"height:32px;padding:0 10px;font-size:.8rem\" data-unsave=\"" + esc(s.keyword) + "\">Remove</button></td></tr>";
    }).join("");
  }
  savedBody.addEventListener("click", function (e) {
    var b = e.target.closest("[data-unsave]");
    if (!b) return;
    storeSaved(loadSaved().filter(function (s) { return s.keyword !== b.dataset.unsave; }));
    renderSaved();
    if (current && current.keyword === b.dataset.unsave) { var sb = document.getElementById("savebtn"); if (sb) sb.textContent = "Save keyword"; }
  });

  /* ---------------------------------------------------------------- rendering */
  function chips(list, kind) {
    return list.map(function (s) {
      var label = kind === "base" ? "<span class=\"kw-rank\">" + s.rank + "</span>" : "<span class=\"kw-rank\">" + s.count + "×</span>";
      return "<button type=\"button\" class=\"tag kw-tag\" data-kw=\"" + esc(s.phrase) + "\" title=\"Research this phrase\">" + label + esc(s.phrase) + "</button>";
    }).join("");
  }

  function render(data) {
    var a = data.analysis, sug = data.suggestions;
    current = a;
    var h = "";
    if (a.score) {
      var sc = a.score;
      h += "<div class=\"herocard\"><div><div class=\"k\">OPPORTUNITY SCORE FOR “" + esc(a.keyword).toUpperCase() + "”</div>" +
        "<div class=\"v\">" + sc.value + " / 100 <span class=\"pill " + scoreCls(sc.value) + "\">" + esc(sc.label) + "</span></div>" +
        "<div class=\"n\">Competition " + sc.parts.competition + "/35 · Weak incumbents " + sc.parts.incumbents + "/30 · Demand " + sc.parts.demand + "/20 · Freshness " + sc.parts.freshness + "/15" +
        (a.cached ? " · checked " + new Date(a.checkedAt).toLocaleDateString() + ", refreshed weekly" : " · checked just now") + "</div></div>" +
        "<div class=\"hactions\"><button type=\"button\" class=\"btn mint\" id=\"savebtn\">" + (isSaved(a.keyword) ? "Saved" : "Save keyword") + "</button><button type=\"button\" class=\"btn\" id=\"copylink\">Copy link to this result</button></div></div>";
      var m = a.metrics;
      h += "<div class=\"tiles\">" +
        tile("Competing videos", compact(m.competing), "YouTube's own estimate") +
        tile("Top-10 average views", compact(m.avgViews), "median " + compact(m.medianViews)) +
        tile("Top-10 average channel size", compact(m.avgSubs) + " subs", "median " + compact(m.medianSubs)) +
        tile("Small channels in top 10", pct(m.smallChannelShare), "under 100K subscribers", m.smallChannelShare >= 0.4 ? "good" : "") +
        tile("Published in the last year", pct(m.freshShare), "avg age " + ago(m.avgAgeDays), m.freshShare >= 0.5 ? "good" : "") +
        tile("Shorts in top 10", pct(m.shortsShare), "under 60 seconds") +
        tile("Engagement of top 10", fmt(m.engagement, 2) + "%", "(likes + comments) / views") +
        "</div>";
      h += "<div class=\"card\"><div class=\"section-head\" style=\"margin-bottom:10px\"><h2 style=\"font-size:1.1rem\">Who ranks today</h2><span class=\"sub\">Top 10 by relevance, live</span></div><div class=\"tablewrap\"><table><thead><tr><th>#</th><th>Video</th><th>Channel</th><th class=\"num\">Views</th><th class=\"num\">Subscribers</th><th class=\"num\">Views per sub</th><th>Age</th></tr></thead><tbody>" +
        a.top.map(function (t) {
          var vps = t.viewsPerSub == null ? "n/a" : (t.viewsPerSub >= 1 ? t.viewsPerSub.toFixed(1) + "×" : pct(t.viewsPerSub, 0));
          return "<tr><td>" + t.rank + "</td><td><a href=\"" + esc(t.url) + "\" target=\"_blank\" rel=\"noopener\">" + esc(t.title) + "</a>" + (t.isShort ? " <span class=\"pill\" style=\"font-size:.7rem\">Short</span>" : "") + "</td>" +
            "<td><a href=\"" + esc(t.channelUrl) + "\" target=\"_blank\" rel=\"noopener\">" + esc(t.channelTitle) + "</a></td><td class=\"num\">" + compact(t.views) + "</td>" +
            "<td class=\"num\">" + (t.hiddenSubscribers ? "hidden" : compact(t.subscribers)) + "</td><td class=\"num" + (t.viewsPerSub != null && t.viewsPerSub >= 1 ? " lead" : "") + "\">" + vps + "</td><td>" + ago(t.ageDays) + "</td></tr>";
        }).join("") + "</tbody></table></div><p class=\"note\" style=\"margin-top:10px\">Views per sub above 1× means a video reached far beyond its own channel, a sign the phrase itself brings traffic.</p></div>";
    } else {
      h += "<div class=\"card\"><b>" + esc(a.keyword) + "</b>: " + esc(a.note || "No ranking videos found.") + "</div>";
    }
    if (sug) {
      h += "<div class=\"card\"><div class=\"section-head\" style=\"margin-bottom:10px\"><h2 style=\"font-size:1.1rem\">What YouTube autocompletes</h2><span class=\"sub\">Click any phrase to research it</span></div>" +
        (sug.base.length ? "<p class=\"note\" style=\"margin-bottom:8px\">Suggestions for the phrase itself, in YouTube's order:</p><div class=\"tags\">" + chips(sug.base, "base") + "</div>" : "<p class=\"note\">YouTube returned no direct suggestions for this phrase.</p>") +
        (sug.expanded.length ? "<p class=\"note\" style=\"margin:14px 0 8px\">Longer phrases found by adding a letter or modifier. The number is how many prefixes produced the phrase:</p><div class=\"tags\">" + chips(sug.expanded, "expanded") + "</div>" : "") +
        "</div>";
    }
    results.innerHTML = h;
    var sb = document.getElementById("savebtn");
    if (sb) sb.addEventListener("click", function () { sb.textContent = toggleSave(a) ? "Saved" : "Save keyword"; });
    var cl = document.getElementById("copylink");
    if (cl) cl.addEventListener("click", function () {
      var u = location.origin + location.pathname + "?q=" + encodeURIComponent(a.keyword);
      navigator.clipboard.writeText(u).then(function () { cl.textContent = "Link copied"; setTimeout(function () { cl.textContent = "Copy link to this result"; }, 1800); });
    });
    document.title = a.keyword + " | YouTube keyword research | Passive Array";
    if (results.getBoundingClientRect().top > window.innerHeight * 0.6) results.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function tile(name, val, sub, cls) {
    return "<div class=\"tile\"><span class=\"name\">" + esc(name) + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span><span class=\"val " + (cls || "") + "\">" + esc(val) + "</span></div>";
  }

  /* ---------------------------------------------------------------- fetching */
  function research(q, push) {
    q = String(q || "").trim();
    if (!q) { input.focus(); return; }
    input.value = q;
    go.disabled = true;
    setStatus("Checking YouTube…");
    results.innerHTML = "";
    if (push) { try { history.pushState(null, "", "?q=" + encodeURIComponent(q)); } catch (e) { /* file:// */ } }
    fetch("api/keyword?q=" + encodeURIComponent(q))
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: "Could not reach the server. Check your connection and try again." }; })
      .then(function (d) {
        go.disabled = false;
        setStatus("");
        if (!d || !d.ok) {
          var hint = d && d.code === "no_key" ? " The site owner needs to add a YouTube API key." : d && d.code === "quota_guard" ? " Saved and recently checked keywords still open instantly." : "";
          results.innerHTML = "<div class=\"error\">" + esc((d && d.error) || "Something went wrong.") + esc(hint) + "</div>";
          return;
        }
        render(d);
      });
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); research(input.value, true); });
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-kw]");
    if (!el) return;
    e.preventDefault();
    research(el.dataset.kw, true);
  });
  window.addEventListener("popstate", function () {
    var q = new URLSearchParams(location.search).get("q");
    if (q) research(q, false); else { results.innerHTML = ""; input.value = ""; }
  });

  renderSaved();
  var initial = new URLSearchParams(location.search).get("q");
  if (initial) research(initial, false);
})();
