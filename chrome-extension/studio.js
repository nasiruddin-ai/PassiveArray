/*
 * Passive Array for YouTube: tag suggestions inside YouTube Studio.
 * Runs on studio.youtube.com. When the upload or edit form shows its Tags box,
 * a panel appears under it with suggested tags you can add with one click.
 *
 * Where the suggestions come from (all measured, nothing invented):
 *   1. Tags that the top 20 videos ranking on YouTube for your title actually use,
 *      ranked by how many of those videos share each tag  (background: type "tags")
 *   2. YouTube's own autocomplete for your title and your existing tags  (type "suggest")
 *   3. Phrases taken from your title itself
 * The API key never ships in the extension; background.js talks to the tools site.
 */
(function () {
  "use strict";

  var PANEL_ID = "pa-studio-tags";
  var TOOLS_URL = "https://passivearray.vercel.app/creator-tools/youtube-tag-generator/";
  var LIMIT = 500;           // YouTube's total tag length limit
  var enabled = true;
  var state = { key: null, loading: false, suggestions: [], panel: null, error: "" };

  /* ------------------------------------------------------------ helpers */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function send(msg) {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage(msg, function (res) {
          if (chrome.runtime.lastError || !res) resolve({ ok: false, code: "ext", error: "Extension was updated. Reload this tab." });
          else resolve(res);
        });
      } catch (e) {
        resolve({ ok: false, code: "ext", error: "Extension was updated. Reload this tab." });
      }
    });
  }
  function norm(s) { return String(s || "").toLowerCase().replace(/\s+/g, " ").trim(); }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* ------------------------------------------------------- Studio DOM */
  /* The Tags box: a chip bar inside the "Tags" form container. Selectors are kept loose
     because Studio renames things; we look for the chip bar first, then its text input. */
  function tagsContainer() {
    var c = document.querySelector("#tags-container") ||
      document.querySelector("ytcp-form-input-container#tags-container") ||
      document.querySelector("ytcp-free-text-chip-bar")?.closest("ytcp-form-input-container") ||
      document.querySelector("ytcp-free-text-chip-bar");
    return c || null;
  }
  function chipBar(c) { return (c && (c.querySelector("ytcp-free-text-chip-bar") || c.querySelector("ytcp-chip-bar"))) || (c && c.tagName === "YTCP-FREE-TEXT-CHIP-BAR" ? c : null); }
  function tagInput(c) {
    var bar = chipBar(c) || c;
    return bar.querySelector("input#text-input") || bar.querySelector("#text-input input") || bar.querySelector("input[type=text]") || bar.querySelector("input");
  }
  function currentTags(c) {
    var bar = chipBar(c) || c;
    var out = [];
    bar.querySelectorAll("ytcp-chip").forEach(function (chip) {
      var t = chip.querySelector("#chip-text, .chip-text, #text") || chip;
      var txt = norm(t.textContent).replace(/\s*(close|cancel|×)$/i, "");
      if (txt) out.push(txt);
    });
    return out;
  }
  function tagsLength(tags) { return tags.join(",").length; }
  function readTitle() {
    var box = document.querySelector("#title-textarea #textbox, ytcp-social-suggestions-textbox#title-textarea #textbox, #title-wrapper #textbox, ytcp-video-title #textbox, #textbox[aria-label*='title' i]");
    if (box) return norm(box.textContent || box.value);
    var inp = document.querySelector("textarea#title, input#title, #title-textarea textarea");
    return inp ? norm(inp.value) : "";
  }
  function readDescription() {
    var box = document.querySelector("#description-textarea #textbox, #description-wrapper #textbox, #textbox[aria-label*='description' i]");
    return box ? norm(box.textContent || box.value).slice(0, 600) : "";
  }

  /* Add one tag the way a person would: type it into the chip bar and press Enter. */
  function nativeSet(input, value) {
    var proto = Object.getPrototypeOf(input);
    var desc = Object.getOwnPropertyDescriptor(proto, "value") || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    if (desc && desc.set) desc.set.call(input, value); else input.value = value;
  }
  function addTag(tag) {
    var c = tagsContainer();
    var input = c && tagInput(c);
    if (!input) return Promise.resolve({ ok: false, error: "Could not find the Tags box." });
    var before = currentTags(c);
    if (before.indexOf(norm(tag)) >= 0) return Promise.resolve({ ok: true, already: true });
    if (tagsLength(before.concat([tag])) > LIMIT) return Promise.resolve({ ok: false, error: "That would pass YouTube's 500-character tag limit." });
    input.focus();
    nativeSet(input, tag);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true }));
    return new Promise(function (resolve) {
      setTimeout(function () {
        if (currentTags(c).indexOf(norm(tag)) >= 0) return resolve({ ok: true });
        /* Fallback: Studio also splits on commas typed into the box. */
        nativeSet(input, tag + ",");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        setTimeout(function () {
          var ok = currentTags(c).indexOf(norm(tag)) >= 0;
          if (!ok) { nativeSet(input, ""); input.dispatchEvent(new Event("input", { bubbles: true })); }
          resolve({ ok: ok, error: ok ? "" : "Studio did not accept the tag. Click into the Tags box once and try again." });
        }, 150);
      }, 150);
    });
  }

  /* ------------------------------------------------------ suggestions */
  var STOP = { the: 1, a: 1, an: 1, and: 1, or: 1, of: 1, to: 1, in: 1, on: 1, for: 1, with: 1, is: 1, are: 1, at: 1, by: 1, from: 1, how: 1, this: 1, that: 1, my: 1, your: 1, you: 1, i: 1, we: 1, it: 1, its: 1, be: 1, vs: 1, "|": 1, "-": 1, "–": 1, "&": 1 };
  function titlePhrases(title) {
    var words = title.replace(/[|()\[\]#"“”!?.:;,]/g, " ").split(/\s+/).filter(Boolean);
    var out = {};
    if (words.length >= 2 && words.length <= 7) out[words.join(" ")] = 1;
    for (var n = 2; n <= 3; n++) {
      for (var i = 0; i + n <= words.length; i++) {
        var slice = words.slice(i, i + n);
        if (STOP[slice[0]] || STOP[slice[slice.length - 1]]) continue;
        if (slice.some(function (w) { return w.length > 25; })) continue;
        out[slice.join(" ")] = 1;
      }
    }
    words.forEach(function (w) { if (w.length >= 4 && !STOP[w] && !/^\d+$/.test(w)) out[w] = 1; });
    return Object.keys(out);
  }
  function tooLong(t) { return t.length > 30 || t.split(" ").length > 6; }

  function buildKey() {
    var c = tagsContainer();
    return c ? readTitle() + "|" + currentTags(c).slice(0, 5).join(",") : null;
  }

  function gather() {
    var c = tagsContainer();
    if (!c) return;
    var title = readTitle();
    var existing = currentTags(c);
    var key = title + "|" + existing.slice(0, 5).join(",");
    if (key === state.key && !state.error) return;
    state.key = key;
    if (!title && !existing.length) {
      state.suggestions = [];
      state.error = "";
      render(c, "Type a title first. Suggestions come from what ranks for it.");
      return;
    }
    state.loading = true;
    render(c);
    var seeds = [];
    if (title) seeds.push(title.slice(0, 80));
    existing.slice(0, 3).forEach(function (t) { if (seeds.indexOf(t) < 0) seeds.push(t); });
    var jobs = [];
    if (title) jobs.push(send({ type: "tags", q: title.slice(0, 80) }));
    seeds.slice(0, 4).forEach(function (s) { jobs.push(send({ type: "suggest", q: s })); });
    Promise.all(jobs).then(function (results) {
      if (state.key !== key) return; // the title changed while we waited
      var score = {}, why = {}, titleWords = {};
      title.split(/\s+/).forEach(function (w) { if (w.length >= 3 && !STOP[w]) titleWords[w] = 1; });
      function bump(tag, pts, reason) {
        tag = norm(tag).replace(/^#/, "");
        if (!tag || tag.length < 2 || tooLong(tag)) return;
        if (existing.indexOf(tag) >= 0) return;
        score[tag] = (score[tag] || 0) + pts;
        if (!why[tag] || pts > why[tag].pts) why[tag] = { pts: pts, text: reason };
      }
      var i = 0;
      var tagRes = title ? results[i++] : null;
      if (tagRes && tagRes.ok && tagRes.tags) {
        tagRes.tags.forEach(function (t) {
          bump(t.tag, 10 + t.count * 6, "Used by " + t.count + " of the top " + tagRes.count + " videos ranking for your title");
        });
      }
      /* Autocomplete seeded by the title counts more than autocomplete seeded by an existing tag:
         "easy garden" as a tag pulls in "easy garden painting", which is not this video. */
      var seedIdx = 0;
      for (; i < results.length; i++, seedIdx++) {
        var r = results[i];
        var fromTitle = !!title && seedIdx === 0;
        if (r && r.ok && r.suggestions) r.suggestions.forEach(function (s, idx) {
          bump(s, (fromTitle ? 14 : 7) - Math.min(idx, 6), fromTitle ? "YouTube autocomplete for your title, people search this" : "YouTube autocomplete for one of your tags");
        });
      }
      titlePhrases(title).forEach(function (p) { bump(p, p.indexOf(" ") > 0 ? 6 : 2, "From your title"); });
      Object.keys(score).forEach(function (tag) {
        var overlap = tag.split(" ").filter(function (w) { return titleWords[w]; }).length;
        score[tag] += overlap * 3; // relevance to this video, not just popularity
      });
      state.suggestions = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; }).slice(0, 40).map(function (t) { return { tag: t, why: why[t].text, pts: score[t] }; });
      state.loading = false;
      state.error = (tagRes && !tagRes.ok && tagRes.code !== "input") ? (tagRes.error || "") : "";
      render(c);
    });
  }
  var gatherSoon = debounce(gather, 900);

  /* ------------------------------------------------------------ panel */
  function ensurePanel(c) {
    var p = document.getElementById(PANEL_ID);
    if (p && c.contains(p) === false && p.parentNode !== c.parentNode) { p.remove(); p = null; }
    if (!p) {
      p = el("div", "pa-panel pa-studio");
      p.id = PANEL_ID;
      if (c.parentNode) c.parentNode.insertBefore(p, c.nextSibling);
    }
    return p;
  }
  function render(c, note) {
    var p = ensurePanel(c);
    p.innerHTML = "";
    var existing = currentTags(c);
    var used = tagsLength(existing);

    var head = el("div", "pa-head");
    var brand = el("div", "pa-brand");
    var img = el("img"); img.src = chrome.runtime.getURL("icons/mark.svg"); img.alt = "";
    brand.appendChild(img);
    brand.appendChild(el("span", null, "Suggested tags"));
    head.appendChild(brand);
    var right = el("div", "pa-head-right");
    var count = el("span", "pa-id", used + "/" + LIMIT + " used · " + existing.length + " tags");
    right.appendChild(count);
    var refresh = el("button", "pa-btn", "Refresh"); refresh.type = "button";
    refresh.addEventListener("click", function () { state.key = null; gather(); });
    right.appendChild(refresh);
    head.appendChild(right);
    p.appendChild(head);

    if (note) { p.appendChild(el("div", "pa-note", note)); footer(p); return; }
    if (state.loading) { p.appendChild(el("div", "pa-note", "Reading what ranks for your title…")); footer(p); return; }
    if (state.error) p.appendChild(el("div", "pa-note pa-bad", state.error + " Showing autocomplete and title phrases only."));

    var list = state.suggestions.filter(function (s) { return existing.indexOf(s.tag) < 0; });
    if (!list.length) { p.appendChild(el("div", "pa-note", "No new suggestions. Change the title or add a tag and press Refresh.")); footer(p); return; }

    var box = el("div", "pa-chips pa-tagchips");
    list.forEach(function (s) {
      var chip = el("button", "pa-chip", s.tag);
      chip.type = "button";
      chip.title = s.why + ". Click to add.";
      chip.addEventListener("click", function () {
        chip.disabled = true;
        addTag(s.tag).then(function (r) {
          if (r.ok) { chip.remove(); render(c); }
          else { chip.disabled = false; flash(p, r.error); }
        });
      });
      box.appendChild(chip);
    });
    p.appendChild(box);

    var actions = el("div", "pa-actions");
    var addTop = el("button", "pa-btn pa-primary", "Add top 10"); addTop.type = "button";
    addTop.addEventListener("click", function () {
      addTop.disabled = true;
      var queue = list.slice(0, 10).map(function (s) { return s.tag; });
      (function next() {
        var t = queue.shift();
        if (!t) { render(c); return; }
        addTag(t).then(function (r) { if (r.ok || r.already) next(); else { flash(p, r.error); render(c); } });
      })();
    });
    actions.appendChild(addTop);
    var copy = el("button", "pa-btn", "Copy all"); copy.type = "button";
    copy.addEventListener("click", function () {
      navigator.clipboard.writeText(list.map(function (s) { return s.tag; }).join(", ")).then(function () { copy.textContent = "Copied"; setTimeout(function () { copy.textContent = "Copy all"; }, 1500); });
    });
    actions.appendChild(copy);
    actions.appendChild(el("span", "pa-muted", "Ranked by how many top-ranking videos use the tag, then autocomplete. Hover a tag to see why."));
    p.appendChild(actions);
    footer(p);
  }
  function flash(p, msg) {
    var n = el("div", "pa-note pa-bad", msg || "Could not add that tag.");
    p.appendChild(n);
    setTimeout(function () { n.remove(); }, 3500);
  }
  function footer(p) {
    var foot = el("div", "pa-foot");
    var a = el("a", null, "Tag generator on Passive Array");
    a.href = TOOLS_URL; a.target = "_blank"; a.rel = "noopener";
    foot.appendChild(a);
    foot.appendChild(el("span", "pa-muted", "Tags matter less than title and thumbnail. YouTube says so itself."));
    p.appendChild(foot);
  }
  function removePanel() { var p = document.getElementById(PANEL_ID); if (p) p.remove(); }

  /* ----------------------------------------------------------- wiring */
  var wired = null;
  function tick() {
    if (!enabled) { removePanel(); return; }
    var c = tagsContainer();
    if (!c) { state.key = null; wired = null; return; }
    if (!document.getElementById(PANEL_ID)) render(c, "Waiting for a title…");
    if (wired !== c) {
      wired = c;
      c.addEventListener("input", gatherSoon, true);
      c.addEventListener("click", function () { setTimeout(function () { var p = document.getElementById(PANEL_ID); if (p && !state.loading) render(c); }, 200); }, true);
      var t = document.querySelector("#title-textarea, #title-wrapper, ytcp-video-title");
      if (t) t.addEventListener("input", gatherSoon, true);
    }
    var key = buildKey();
    if (key !== state.key) gatherSoon();
  }
  setInterval(tick, 1000);
  new MutationObserver(debounce(tick, 300)).observe(document.documentElement, { childList: true, subtree: true });

  chrome.storage.sync.get({ panelEnabled: true }, function (v) {
    enabled = v.panelEnabled !== false;
    tick();
  });
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === "sync" && changes.panelEnabled) { enabled = changes.panelEnabled.newValue !== false; state.key = null; tick(); }
  });
})();
