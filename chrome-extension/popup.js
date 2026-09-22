/*
 * Passive Array for YouTube, popup.
 * Keywords tab: keyword report via background.js (YouTube results page + tools-site stats).
 * AI writer tab: titles, description and tags. Written by Claude through the tools site
 * when ANTHROPIC_API_KEY is set there; otherwise built-in templates so it always works.
 */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var state = { tab: "keywords", q: "", topic: "", notes: "", related: "", page: null };

  /* ------------------------------------------------------------ helpers */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function compact(n) {
    if (n == null || isNaN(n)) return "–";
    n = Number(n);
    if (n >= 1e9) return (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + "K";
    return String(Math.round(n));
  }
  function fmt(n) { return n == null || isNaN(n) ? "–" : Number(n).toLocaleString("en-US"); }
  function plural(n, w) { return n + " " + w + (n === 1 ? "" : "s"); }
  function ago(days) {
    if (days < 30) return plural(days, "day");
    if (days < 365) return plural(Math.round(days / 30.4), "month");
    return plural(Math.round(days / 365 * 10) / 10, "year");
  }
  function duration(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + String(s).padStart(2, "0");
  }
  function titleCase(s) {
    return s.replace(/\b([a-z])/g, function (m) { return m.toUpperCase(); });
  }
  function send(msg) {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage(msg, function (res) {
          if (chrome.runtime.lastError || !res) resolve({ ok: false, error: "Extension was updated. Close and reopen this popup." });
          else resolve(res);
        });
      } catch (e) { resolve({ ok: false, error: e.message }); }
    });
  }
  function copyBtn(text, label) {
    var b = el("button", "btn small", label || "Copy");
    b.addEventListener("click", function () {
      navigator.clipboard.writeText(text).then(function () {
        b.textContent = "Copied";
        setTimeout(function () { b.textContent = label || "Copy"; }, 1500);
      });
    });
    return b;
  }
  function saveState() {
    chrome.storage.local.set({ popupState: { tab: state.tab, q: $("kw").value, topic: $("topic").value, notes: $("notes").value, related: $("related").value } });
  }

  /* --------------------------------------------------------------- tabs */

  function showTab(name) {
    state.tab = name;
    document.querySelectorAll("nav button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === name); });
    document.querySelectorAll("section").forEach(function (s) { s.classList.toggle("on", s.id === "tab-" + name); });
    saveState();
  }
  document.querySelectorAll("nav button").forEach(function (b) {
    b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); });
  });

  /* ------------------------------------------------------------ keywords */

  function grade(score) {
    if (score >= 70) return { label: "Great topic", cls: "good", text: "Strong interest and room for new videos. Worth making." };
    if (score >= 50) return { label: "Good", cls: "good", text: "Decent interest. A specific angle or a long-tail version can win here." };
    if (score >= 30) return { label: "Fair", cls: "", text: "Either low interest or big channels own it. Try a narrower keyword from the list below." };
    return { label: "Hard", cls: "warn", text: "Big channels dominate or few people search this. Pick a more specific keyword." };
  }

  function scoreTile(label, value, invert) {
    var t = el("div", "score");
    t.appendChild(el("div", "l", label));
    t.appendChild(el("div", "v", String(value)));
    var bar = el("div", "bar");
    var i = el("i");
    i.style.width = value + "%";
    if (invert) i.style.background = "linear-gradient(90deg, #B7791F, #C0392B)";
    bar.appendChild(i);
    t.appendChild(bar);
    return t;
  }
  function tile(label, value, sub) {
    var t = el("div", "tile");
    t.appendChild(el("div", "l", label));
    t.appendChild(el("div", "v", value));
    if (sub) t.appendChild(el("div", "s", sub));
    return t;
  }

  function renderKeyword(r, suggestions) {
    var out = $("kw-out");
    out.textContent = "";
    var g = grade(r.scores.overall);
    var s = r.summary;

    var scores = el("div", "scores");
    var hero = el("div", "score hero");
    var left = el("div");
    left.appendChild(el("div", "l", "Overall score"));
    left.appendChild(el("div", "v", r.scores.overall + " / 100"));
    left.appendChild(el("div", "verdict", g.text));
    hero.appendChild(left);
    hero.appendChild(el("span", "pill", g.label));
    scores.appendChild(hero);
    scores.appendChild(scoreTile("Interest", r.scores.interest));
    scores.appendChild(scoreTile("Competition", r.scores.competition, true));
    var est = el("div", "score");
    est.appendChild(el("div", "l", "Results on YouTube"));
    est.appendChild(el("div", "v", compact(r.estimatedResults)));
    scores.appendChild(est);
    out.appendChild(scores);

    var grid = el("div", "grid");
    grid.appendChild(tile("Median views/day", compact(s.medianViewsPerDay), "across top " + r.count));
    grid.appendChild(tile("Median channel", compact(s.medianSubscribers) + " subs", s.bigChannels + " over 1M"));
    grid.appendChild(tile("Small channels", s.smallChannels + " of " + r.count, "under 100K subs ranking"));
    grid.appendChild(tile("Fresh videos", s.freshVideos + " of " + r.count, "under 1 year old"));
    grid.appendChild(tile("Beat their subs", s.outperforming + " of " + r.count, "views above channel size"));
    grid.appendChild(tile("Typical length", duration(s.avgSeconds), s.noTags + " without tags"));
    out.appendChild(grid);

    if (suggestions && suggestions.length) {
      var h = el("h4");
      h.appendChild(el("span", null, "People also search"));
      h.appendChild(copyBtn(suggestions.join(", "), "Copy all"));
      out.appendChild(h);
      var chips = el("div", "chips");
      suggestions.forEach(function (sg) {
        var c = el("button", "chip", sg);
        c.title = "Analyze this keyword";
        c.addEventListener("click", function () { $("kw").value = sg; analyze(); });
        chips.appendChild(c);
      });
      out.appendChild(chips);
      $("related").value = $("related").value || suggestions.slice(0, 6).join(", ");
    }

    var h2 = el("h4");
    h2.appendChild(el("span", null, "Top results"));
    var open = el("a", "link", "Open on YouTube");
    open.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(r.q);
    open.target = "_blank";
    h2.appendChild(open);
    out.appendChild(h2);
    var list = el("div", "results");
    r.videos.forEach(function (v) {
      var a = el("a", "res");
      a.href = "https://www.youtube.com/watch?v=" + v.id;
      a.target = "_blank";
      a.appendChild(el("span", "rank", "#" + v.rank));
      var mid = el("div");
      var t = el("div", "t", v.title);
      t.title = v.title;
      if (v.subscribers && v.subscribers < 100000 && v.views > v.subscribers) t.appendChild(el("span", "tag", "small channel"));
      if (v.live) t.appendChild(el("span", "tag warn", "live"));
      mid.appendChild(t);
      mid.appendChild(el("div", "m", v.channel + " · " + (v.hiddenSubscribers ? "subs hidden" : compact(v.subscribers) + " subs") + " · " + ago(v.days) + " ago · " + duration(v.seconds)));
      a.appendChild(mid);
      var n = el("div", "n");
      n.appendChild(el("b", null, compact(v.views)));
      n.appendChild(document.createTextNode(compact(Math.round(v.viewsPerDay)) + "/day"));
      a.appendChild(n);
      list.appendChild(a);
    });
    out.appendChild(list);

    var use = el("p", "hint");
    var useBtn = el("button", "link", "Write titles, description and tags for this keyword");
    useBtn.addEventListener("click", function () { $("topic").value = r.q; showTab("writer"); });
    use.appendChild(useBtn);
    out.appendChild(use);
  }

  var analyzing = false;
  function analyze() {
    var q = $("kw").value.trim();
    var hint = $("kw-hint");
    if (!q) { hint.textContent = "Type a keyword first."; hint.className = "hint bad"; return; }
    if (analyzing) return;
    analyzing = true;
    $("analyze").disabled = true;
    $("kw-out").textContent = "";
    hint.className = "hint";
    hint.textContent = "";
    hint.appendChild(el("span", "spin"));
    hint.appendChild(document.createTextNode("Reading YouTube's top results for “" + q + "”…"));
    saveState();
    Promise.all([send({ type: "keyword", q: q }), send({ type: "suggest", q: q })]).then(function (res) {
      analyzing = false;
      $("analyze").disabled = false;
      var r = res[0], sg = res[1];
      if (!r.ok) {
        hint.textContent = r.error || "Something went wrong.";
        hint.className = "hint bad";
        if (r.code === "action") hint.textContent = "The tools site does not have the videos action yet. Push the passive-array repo, then try again.";
        return;
      }
      hint.textContent = "Scores come from the top " + r.count + " results, not real search volume. Cached 12 hours.";
      hint.className = "hint";
      renderKeyword(r, sg.ok ? sg.suggestions : []);
    });
  }
  $("analyze").addEventListener("click", analyze);
  $("kw").addEventListener("keydown", function (e) { if (e.key === "Enter") analyze(); });

  /* ----------------------------------------------------------- AI writer */

  /* Built-in templates. Used when the tools site has no Anthropic key. No invented facts, only the inputs. */
  var TEMPLATES = {
    yt_titles: function (topic, related) {
      var k = titleCase(topic), year = new Date().getFullYear();
      var alt = related[0] ? titleCase(related[0]) : "the Alternatives";
      return {
        titles: [
          { title: "How to " + k + " (Step by Step for Beginners)", angle: "how-to" },
          { title: k + ": 7 Mistakes Everyone Makes", angle: "mistakes" },
          { title: k + " Explained in Under 10 Minutes", angle: "beginner" },
          { title: "I Tried " + k + " for 30 Days", angle: "story" },
          { title: "The Truth About " + k + " Nobody Tells You", angle: "contrarian" },
          { title: k + " vs " + alt + ": Which Is Better?", angle: "comparison" },
          { title: "Stop Doing This With " + k, angle: "mistakes" },
          { title: k + " Tips That Actually Work in " + year, angle: "list" },
          { title: "Is " + k + " Worth It? Honest Answer", angle: "question" },
          { title: k + " for Beginners: Everything You Need", angle: "beginner" }
        ]
      };
    },
    yt_description: function (topic, related, notes) {
      var k = topic.toLowerCase(), K = titleCase(topic);
      var hashtags = [k].concat(related.slice(0, 3)).map(function (t) { return "#" + t.replace(/[^a-z0-9]+/gi, "").toLowerCase(); }).filter(function (t, i, a) { return t.length > 1 && a.indexOf(t) === i; });
      var body = notes.trim() ? notes.trim() : "[Write 2 to 3 sentences on what the video covers and who it is for.]";
      return {
        description:
          K + ": everything you need to know, explained simply.\n" +
          "In this video I walk through " + k + " step by step so you can do it yourself.\n\n" +
          body + "\n\n" +
          "Timestamps\n00:00 Intro\n00:45 What " + k + " is\n03:10 Step by step\n07:30 Common mistakes\n10:00 Final tips\n\n" +
          "Links\n[Your website]\n[Free resource mentioned in the video]\n\n" +
          (related.length ? "Related: " + related.slice(0, 4).join(", ") + "\n" : "") +
          hashtags.join(" ")
      };
    },
    yt_tags: function (topic, related) {
      var k = topic.toLowerCase(), year = new Date().getFullYear();
      var words = k.split(/\s+/);
      var list = [k, k + " tutorial", "how to " + k, k + " for beginners", k + " tips", k + " " + year, k + " explained", "best " + k, k + " guide", k + " mistakes", "learn " + k]
        .concat(related.map(function (r) { return r.toLowerCase(); }))
        .concat(words.length > 1 ? [words[0], words[words.length - 1], words.slice(0, 2).join(" ")] : []);
      var seen = {}, out = [], total = 0;
      list.forEach(function (t) {
        t = t.trim();
        if (!t || seen[t] || t.length > 30) return;
        if (total + t.length + 1 > 480) return;
        seen[t] = true; out.push(t); total += t.length + 1;
      });
      return { tags: out };
    }
  };

  function renderTitles(list, note) {
    var out = $("ai-out");
    out.textContent = "";
    var head = el("div", "out-head");
    head.appendChild(el("span", null, "10 titles"));
    head.appendChild(copyBtn(list.map(function (t) { return t.title; }).join("\n"), "Copy all"));
    out.appendChild(head);
    var box = el("div", "list");
    list.forEach(function (t) {
      var item = el("div", "item");
      item.appendChild(el("span", "txt", t.title));
      item.appendChild(el("span", "len" + (t.title.length > 60 ? " bad" : ""), t.title.length + " ch"));
      item.appendChild(copyBtn(t.title));
      box.appendChild(item);
    });
    out.appendChild(box);
    out.appendChild(el("p", "hint", note + " Titles over 60 characters get cut off in search."));
  }
  function renderDescription(text, note) {
    var out = $("ai-out");
    out.textContent = "";
    var head = el("div", "out-head");
    head.appendChild(el("span", null, "Description · " + fmt(text.length) + " of 5,000 chars"));
    head.appendChild(copyBtn(text, "Copy"));
    out.appendChild(head);
    out.appendChild(el("pre", null, text));
    out.appendChild(el("p", "hint", note + " Replace everything in [square brackets] before you publish."));
  }
  function renderTags(tags, note) {
    var out = $("ai-out");
    out.textContent = "";
    var joined = tags.join(", ");
    var head = el("div", "out-head");
    head.appendChild(el("span", null, tags.length + " tags · " + joined.length + " of 500 chars"));
    head.appendChild(copyBtn(joined, "Copy all"));
    out.appendChild(head);
    var chips = el("div", "chips");
    tags.forEach(function (t) { chips.appendChild(el("span", "chip", t)); });
    out.appendChild(chips);
    out.appendChild(el("p", "hint", note + " Paste the copied list into the Tags box in YouTube Studio."));
  }

  var generating = false;
  function generate(action) {
    var topic = $("topic").value.trim();
    var hint = $("ai-hint");
    if (!topic) { hint.textContent = "Type the video topic first."; hint.className = "hint bad"; return; }
    if (generating) return;
    generating = true;
    var notes = $("notes").value.trim();
    var related = $("related").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 8);
    document.querySelectorAll("[data-gen]").forEach(function (b) { b.disabled = true; });
    hint.className = "hint";
    hint.textContent = "";
    hint.appendChild(el("span", "spin"));
    hint.appendChild(document.createTextNode("Writing…"));
    $("ai-out").textContent = "";
    saveState();

    send({ type: "ai", action: action, inputs: { topic: topic, notes: notes, related: related.join(", ") } }).then(function (res) {
      generating = false;
      document.querySelectorAll("[data-gen]").forEach(function (b) { b.disabled = false; });
      var note, result;
      if (res.ok && res.result) {
        result = res.result;
        note = "Written by Claude.";
        hint.textContent = "";
      } else {
        result = TEMPLATES[action](topic, related, notes);
        note = "Built-in template.";
        hint.textContent = res.code === "no_key"
          ? "Built-in template. Add ANTHROPIC_API_KEY on the tools site for AI-written versions."
          : "Built-in template (AI unavailable: " + (res.error || res.code || "unknown") + ").";
      }
      if (action === "yt_titles") renderTitles((result.titles || []).slice(0, 10), note);
      else if (action === "yt_description") renderDescription(String(result.description || ""), note);
      else renderTags((result.tags || []).map(String), note);
    });
  }
  document.querySelectorAll("[data-gen]").forEach(function (b) {
    b.addEventListener("click", function () { generate(b.getAttribute("data-gen")); });
  });

  /* --------------------------------------------------------- page prefill */

  function askPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs && tabs[0];
      if (!tab || !tab.url || tab.url.indexOf("https://www.youtube.com/") !== 0) {
        $("page-note").textContent = "Open a YouTube tab to prefill from the page.";
        return;
      }
      chrome.tabs.sendMessage(tab.id, { type: "pageInfo" }, function (info) {
        if (chrome.runtime.lastError || !info) { $("page-note").textContent = "Reload the YouTube tab to prefill."; return; }
        state.page = info;
        var note = $("page-note");
        if (info.page === "search" && info.query) {
          note.textContent = "";
          var b = el("button", "link", "Use search: " + info.query);
          b.addEventListener("click", function () { $("kw").value = info.query; showTab("keywords"); analyze(); });
          note.appendChild(b);
          if (!$("kw").value) $("kw").value = info.query;
        } else if (info.page === "video" && info.title) {
          note.textContent = "";
          var b2 = el("button", "link", "Use this video's title and tags");
          b2.addEventListener("click", function () {
            $("topic").value = info.title;
            if (info.tags && info.tags.length) $("related").value = info.tags.slice(0, 8).join(", ");
            showTab("writer");
          });
          note.appendChild(b2);
        } else {
          note.textContent = "Search something on YouTube to analyze it here.";
        }
      });
    });
  }

  /* ---------------------------------------------------------------- init */

  var box = $("enabled");
  chrome.storage.sync.get({ panelEnabled: true }, function (v) { box.checked = v.panelEnabled !== false; });
  box.addEventListener("change", function () { chrome.storage.sync.set({ panelEnabled: box.checked }); });

  chrome.storage.local.get("popupState", function (v) {
    var s = v.popupState || {};
    if (s.q) $("kw").value = s.q;
    if (s.topic) $("topic").value = s.topic;
    if (s.notes) $("notes").value = s.notes;
    if (s.related) $("related").value = s.related;
    showTab(s.tab === "writer" ? "writer" : "keywords");
    askPage();
  });
  ["kw", "topic", "notes", "related"].forEach(function (id) { $(id).addEventListener("change", saveState); });
})();
