/*
 * Passive Array for YouTube, week 2.
 *  - Video pages:   stats panel read from the page itself (no API).
 *  - Channel pages: channel panel from the Passive Array tools site API.
 *  - Search results: a score row under every result, from the same API.
 * The API key never ships in the extension; background.js talks to the site.
 */
(function () {
  "use strict";

  var VIDEO_PANEL = "pa-yt-panel";
  var CHANNEL_PANEL = "pa-yt-channel";
  var TOOLS_URL = "https://passivearray.vercel.app/creator-tools/";
  var enabled = true;

  /* ------------------------------------------------------------ helpers */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fmt(n, d) {
    if (n == null || isNaN(n)) return "–";
    return Number(n).toLocaleString("en-US", { maximumFractionDigits: d || 0 });
  }
  function compact(n) {
    if (n == null || isNaN(n)) return "–";
    n = Number(n);
    if (n >= 1e9) return (n / 1e9).toFixed(n >= 1e10 ? 0 : 1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + "K";
    return fmt(n);
  }
  function pct(n, d) {
    if (n == null || isNaN(n)) return "–";
    return Number(n).toFixed(d == null ? 2 : d) + "%";
  }
  function safeDiv(a, b) { return b ? a / b : 0; }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  /* Accepts "1,234", "1.2M", "12K subscribers", "like this video along with 4,567 other people". */
  function parseCount(text) {
    if (text == null) return null;
    var m = String(text).replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*([KMB])?/i);
    if (!m) return null;
    var n = parseFloat(m[1]);
    var s = (m[2] || "").toUpperCase();
    if (s === "K") n *= 1e3; else if (s === "M") n *= 1e6; else if (s === "B") n *= 1e9;
    return Math.round(n);
  }
  /* Same thresholds as the creator-tools engagement calculator. */
  function grade(er) {
    if (er < 1) return { label: "Low", cls: "bad" };
    if (er < 2) return { label: "Below average", cls: "warn" };
    if (er < 4) return { label: "Average", cls: "" };
    if (er < 6) return { label: "Good", cls: "good" };
    return { label: "Excellent", cls: "good" };
  }
  function duration(sec) {
    sec = Number(sec) || 0;
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0");
  }
  function daysSince(dateStr) {
    if (!dateStr) return null;
    var t = new Date(dateStr).getTime();
    if (isNaN(t)) return null;
    return Math.max(1, Math.round((Date.now() - t) / 86400000));
  }
  function dateStr(s) {
    if (!s) return "–";
    var d = new Date(s);
    return isNaN(d) ? "–" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  function ago(dateStr) {
    var d = daysSince(dateStr);
    if (d == null) return "";
    if (d < 30) return plural(d, "day") + " ago";
    if (d < 365) return plural(Math.round(d / 30.4), "month") + " ago";
    return plural(Math.round(d / 365 * 10) / 10, "year") + " ago";
  }

  /* Pull the JSON object that follows a marker like "ytInitialData =" out of raw HTML. */
  function extractObject(html, marker) {
    var i = html.indexOf(marker);
    if (i < 0) return null;
    i = html.indexOf("{", i);
    if (i < 0) return null;
    var depth = 0, inStr = false, esc = false;
    for (var j = i; j < html.length; j++) {
      var c = html.charAt(j);
      if (inStr) {
        if (esc) esc = false;
        else if (c === "\\") esc = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') inStr = true;
      else if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          try { return JSON.parse(html.slice(i, j + 1)); } catch (e) { return null; }
        }
      }
    }
    return null;
  }

  /* Depth-first search of a big nested object. pred(key, value) returns true to stop. */
  function find(obj, pred, depth) {
    depth = depth || 0;
    if (!obj || typeof obj !== "object" || depth > 40) return undefined;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i], v = obj[k];
      if (pred(k, v)) return v;
      if (v && typeof v === "object") {
        var r = find(v, pred, depth + 1);
        if (r !== undefined) return r;
      }
    }
    return undefined;
  }
  function findText(obj, keyName) {
    var v = find(obj, function (k) { return k === keyName; });
    if (!v) return null;
    if (typeof v === "string") return v;
    if (v.simpleText) return v.simpleText;
    if (v.runs) return v.runs.map(function (r) { return r.text; }).join("");
    return null;
  }

  /* Ask background.js to call the tools site. Resolves with the JSON body. */
  function api(action, params) {
    return new Promise(function (resolve) {
      try {
        chrome.runtime.sendMessage({ type: "api", action: action, params: params }, function (res) {
          if (chrome.runtime.lastError || !res) resolve({ ok: false, code: "ext", error: "Extension was updated. Reload this tab." });
          else resolve(res);
        });
      } catch (e) {
        resolve({ ok: false, code: "ext", error: "Extension was updated. Reload this tab." });
      }
    });
  }

  /* Shared bits of every panel. */
  function panelHeader(panel, idText, onRefresh) {
    var h = el("div", "pa-head");
    var brand = el("div", "pa-brand");
    var img = el("img");
    img.src = chrome.runtime.getURL("icons/mark.svg");
    img.alt = "";
    brand.appendChild(img);
    brand.appendChild(el("span", null, "Passive Array"));
    h.appendChild(brand);
    var right = el("div", "pa-head-right");
    if (idText) right.appendChild(el("code", "pa-id", idText));
    if (onRefresh) {
      var btn = el("button", "pa-btn pa-refresh", "Refresh");
      btn.type = "button";
      btn.title = "Fetch fresh numbers";
      btn.addEventListener("click", onRefresh);
      right.appendChild(btn);
    }
    h.appendChild(right);
    panel.appendChild(h);
  }
  function tile(label, value, sub) {
    var t = el("div", "pa-tile");
    t.appendChild(el("div", "pa-tile-label", label));
    t.appendChild(el("div", "pa-tile-value", value));
    if (sub) t.appendChild(el("div", "pa-tile-sub", sub));
    return t;
  }
  function row(name, value) {
    var r = el("div", "pa-row");
    r.appendChild(el("span", "pa-row-name", name));
    r.appendChild(el("span", "pa-row-value", value));
    return r;
  }
  function copyButton(text, label) {
    var b = el("button", "pa-btn", label);
    b.type = "button";
    b.addEventListener("click", function () {
      navigator.clipboard.writeText(text).then(function () {
        b.textContent = "Copied";
        setTimeout(function () { b.textContent = label; }, 1500);
      });
    });
    return b;
  }
  function chips(list, onClick) {
    var box = el("div", "pa-chips");
    list.forEach(function (t) {
      var chip = el("button", "pa-chip", t);
      chip.type = "button";
      chip.title = "Search YouTube for this";
      chip.addEventListener("click", function () { onClick(t); });
      box.appendChild(chip);
    });
    return box;
  }
  function searchFor(term) {
    location.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(term);
  }
  function footer(panel, note) {
    var foot = el("div", "pa-foot");
    var a = el("a", null, "More creator tools");
    a.href = TOOLS_URL;
    a.target = "_blank";
    a.rel = "noopener";
    foot.appendChild(a);
    foot.appendChild(el("span", "pa-muted", note));
    panel.appendChild(foot);
  }
  function errorText(res) {
    if (res && res.error) return res.error;
    return "Something went wrong.";
  }

  /* ============================================================ VIDEO */

  var video = { shownId: null, loadingId: null, cache: {}, domTimer: null };

  function getVideoId() {
    if (location.pathname !== "/watch") return null;
    return new URLSearchParams(location.search).get("v");
  }

  async function fetchVideoData(id) {
    var res = await fetch("https://www.youtube.com/watch?v=" + encodeURIComponent(id) + "&hl=en", { credentials: "same-origin" });
    var html = await res.text();
    var pr = extractObject(html, "ytInitialPlayerResponse =") || {};
    var data = extractObject(html, "ytInitialData =") || {};
    var vd = pr.videoDetails || {};
    var mf = (pr.microformat && pr.microformat.playerMicroformatRenderer) || {};
    var lb = mf.liveBroadcastDetails || {};

    var likeText = find(data, function (k, v) {
      return typeof v === "string" && /^like this video along with [\d,.KMB]+ other people$/i.test(v);
    });
    if (!likeText) likeText = find(data, function (k, v) {
      return k === "accessibilityText" && typeof v === "string" && /^[\d,.]+[KMB]? likes?$/i.test(v);
    });

    var commentText = null;
    var panels = data.engagementPanels || [];
    for (var i = 0; i < panels.length; i++) {
      var p = panels[i].engagementPanelSectionListRenderer;
      if (p && /comments/i.test(p.targetId || "") && p.header) {
        commentText = findText(p.header, "contextualInfo");
        break;
      }
    }

    var subsText = findText(data, "subscriberCountText");
    var desc = vd.shortDescription || "";
    var seconds = Number(vd.lengthSeconds) || 0;

    var ps = pr.playabilityStatus || {};
    if (!vd.videoId && ps.status === "ERROR") {
      throw new Error(ps.reason || "This video is unavailable.");
    }

    return {
      id: id,
      title: vd.title || document.title.replace(/ - YouTube$/, ""),
      channel: vd.author || findText(data, "ownerChannelName") || "",
      channelId: vd.channelId || "",
      views: parseCount(vd.viewCount),
      likes: parseCount(likeText),
      comments: parseCount(commentText),
      subscribers: parseCount(subsText),
      subsHidden: !!subsText && !/\d/.test(subsText),
      published: mf.publishDate || mf.uploadDate || null,
      lengthSeconds: seconds,
      category: mf.category || "",
      liveNow: !!lb.isLiveNow || (!!vd.isLive && !lb.endTimestamp),
      wasLive: !!vd.isLiveContent && !lb.isLiveNow,
      liveStart: lb.startTimestamp || null,
      isShort: seconds > 0 && seconds <= 60 && !vd.isLiveContent,
      tags: Array.isArray(vd.keywords) ? vd.keywords : [],
      description: desc,
      hashtags: (desc.match(/#[\p{L}\p{N}_]+/gu) || []).length,
      links: (desc.match(/https?:\/\/\S+/g) || []).length,
      fetchedAt: Date.now()
    };
  }

  /* Likes and comments also render in the page a moment after load. Use them to fill gaps. */
  function readFromDom(d) {
    if (d.likes == null) {
      var btn = document.querySelector("like-button-view-model button, #segmented-like-button button, ytd-toggle-button-renderer button");
      var label = btn && btn.getAttribute("aria-label");
      if (label && /\d/.test(label)) d.likes = parseCount(label);
    }
    if (d.comments == null) {
      var c = document.querySelector("ytd-comments-header-renderer #count yt-formatted-string, ytd-comments-header-renderer #count");
      if (c && /\d/.test(c.textContent)) d.comments = parseCount(c.textContent);
    }
    if (d.subscribers == null) {
      var s = document.querySelector("#owner-sub-count");
      if (s && /\d/.test(s.textContent)) d.subscribers = parseCount(s.textContent);
    }
    return d;
  }

  function videoMount() {
    return document.querySelector("#secondary-inner") || document.querySelector("#secondary") || document.querySelector("#below") || null;
  }
  function ensureVideoPanel() {
    var panel = document.getElementById(VIDEO_PANEL);
    var host = videoMount();
    if (!host) return null;
    if (!panel) { panel = el("div", "pa-panel"); panel.id = VIDEO_PANEL; }
    if (panel.parentNode !== host) host.insertBefore(panel, host.firstChild);
    return panel;
  }
  function removeVideoPanel() {
    var panel = document.getElementById(VIDEO_PANEL);
    if (panel) panel.remove();
    video.shownId = null;
  }
  function videoRefresh() {
    delete video.cache[getVideoId()];
    video.shownId = null;
    updateVideo(true);
  }
  function renderVideoNote(id, msg, bad) {
    var panel = ensureVideoPanel();
    if (!panel) return;
    panel.textContent = "";
    panelHeader(panel, id, videoRefresh);
    panel.appendChild(el("div", "pa-note" + (bad ? " pa-bad" : ""), msg));
  }

  function renderVideo(d) {
    var panel = ensureVideoPanel();
    if (!panel) return;
    panel.textContent = "";
    panelHeader(panel, d.id, videoRefresh);

    var er = safeDiv((d.likes || 0) + (d.comments || 0), d.views) * 100;
    var g = grade(er);
    var age = daysSince(d.liveNow ? d.liveStart : d.published);

    var hero = el("div", "pa-hero");
    if (d.liveNow) {
      hero.appendChild(el("div", "pa-hero-label", "Live now"));
      var lv = el("div", "pa-hero-value", compact(d.views) + " watching");
      lv.appendChild(el("span", "pa-pill live", "LIVE"));
      hero.appendChild(lv);
      hero.appendChild(el("div", "pa-hero-note", (d.liveStart ? "started " + ago(d.liveStart) + " · " : "") + "engagement is not comparable while a stream runs"));
    } else {
      hero.appendChild(el("div", "pa-hero-label", "Engagement rate by views"));
      var hv = el("div", "pa-hero-value", d.views ? pct(er) : "–");
      if (d.views) hv.appendChild(el("span", "pa-pill " + g.cls, g.label));
      if (d.isShort) hv.appendChild(el("span", "pa-pill", "Short"));
      if (d.wasLive) hv.appendChild(el("span", "pa-pill", "Was live"));
      hero.appendChild(hv);
      hero.appendChild(el("div", "pa-hero-note", "(likes + comments) / views" + (d.likes == null ? " · likes not loaded yet, press Refresh" : "") + (d.isShort ? " · Shorts usually run 2 to 3x higher than long videos" : "")));
    }
    panel.appendChild(hero);

    var grid = el("div", "pa-grid");
    grid.appendChild(tile(d.liveNow ? "Watching" : "Views", compact(d.views), fmt(d.views)));
    grid.appendChild(tile("Likes", compact(d.likes), d.likes != null && d.views ? pct(safeDiv(d.likes, d.views) * 100) + " of views" : "hidden or loading"));
    grid.appendChild(tile("Comments", compact(d.comments), d.comments != null && d.views ? pct(safeDiv(d.comments, d.views) * 100, 3) + " of views" : "off or loading"));
    grid.appendChild(tile("Subscribers", d.subsHidden ? "Hidden" : compact(d.subscribers), d.subscribers && !d.liveNow ? pct(safeDiv(d.views, d.subscribers) * 100, 0) + " views per sub" : d.channel));
    if (d.liveNow) grid.appendChild(tile("Started", d.liveStart ? dateStr(d.liveStart) : "–", d.liveStart ? new Date(d.liveStart).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : ""));
    else grid.appendChild(tile("Views per day", age ? compact(Math.round(d.views / age)) : "–", age ? "over " + plural(age, "day") : ""));
    grid.appendChild(tile("Published", dateStr(d.published), d.category || ""));
    panel.appendChild(grid);

    var details = el("div", "pa-rows");
    details.appendChild(row("Length", d.liveNow ? "Live" : duration(d.lengthSeconds) + (d.isShort ? " · Short" : d.lengthSeconds >= 480 ? " · mid-roll ads possible" : "")));
    details.appendChild(row("Title length", d.title.length + " chars" + (d.title.length > 70 ? " · long, may be cut in search" : d.title.length < 30 ? " · short" : "")));
    details.appendChild(row("Description", fmt(d.description.length) + " chars · " + plural(d.hashtags, "hashtag") + " · " + plural(d.links, "link")));
    details.appendChild(row("Tags", d.tags.length + (d.tags.length ? " · " + fmt(d.tags.join(",").length) + " chars of 500" : " · none set")));
    panel.appendChild(details);

    var tagsBox = el("div", "pa-tags");
    var th = el("div", "pa-section-head");
    th.appendChild(el("span", null, "Tags"));
    if (d.tags.length) th.appendChild(copyButton(d.tags.join(", "), "Copy all"));
    tagsBox.appendChild(th);
    if (d.tags.length) tagsBox.appendChild(chips(d.tags, searchFor));
    else tagsBox.appendChild(el("div", "pa-note", "This video has no tags. Tags are a small ranking signal and help with misspellings."));
    panel.appendChild(tagsBox);

    footer(panel, "Numbers come from this page and can lag YouTube Studio by hours.");
  }

  function updateVideo(force) {
    var id = getVideoId();
    if (!id) { removeVideoPanel(); return; }
    if (!force && id === video.shownId && document.getElementById(VIDEO_PANEL)) { ensureVideoPanel(); return; }
    if (id === video.loadingId && !force) return;

    if (video.cache[id] && !force) {
      video.shownId = id;
      renderVideo(readFromDom(video.cache[id]));
      return;
    }

    video.loadingId = id;
    renderVideoNote(id, "Reading video data…");
    fetchVideoData(id).then(function (d) {
      if (video.loadingId !== id) return;
      video.loadingId = null;
      video.cache[id] = d;
      video.shownId = id;
      renderVideo(readFromDom(d));
      clearInterval(video.domTimer);
      var tries = 0;
      video.domTimer = setInterval(function () {
        tries++;
        if (getVideoId() !== id || tries > 10) { clearInterval(video.domTimer); return; }
        var before = [d.likes, d.comments, d.subscribers].join("|");
        readFromDom(d);
        if ([d.likes, d.comments, d.subscribers].join("|") !== before) renderVideo(d);
        if (d.likes != null && d.comments != null && d.subscribers != null) clearInterval(video.domTimer);
      }, 2000);
    }).catch(function (err) {
      if (video.loadingId !== id) return;
      video.loadingId = null;
      renderVideoNote(id, "Could not read this video's data. " + (err && err.message ? err.message : ""), true);
    });
  }

  /* ========================================================== CHANNEL */

  var channel = { shownKey: null, loadingKey: null };

  /* Returns something the tools site can resolve (a channel URL), or null when not on a channel page. */
  function getChannelKey() {
    var parts = location.pathname.split("/").filter(Boolean);
    if (!parts.length) return null;
    var first = parts[0];
    if (first.charAt(0) === "@") return "https://www.youtube.com/" + first;
    if ((first === "channel" || first === "c" || first === "user") && parts[1]) return "https://www.youtube.com/" + first + "/" + parts[1];
    return null;
  }
  function channelMount() {
    var hdr = document.querySelector("ytd-browse[role='main'] #page-header, ytd-browse #page-header, ytd-browse ytd-tabbed-page-header");
    if (hdr) return { host: hdr.parentNode, before: hdr.nextSibling };
    var primary = document.querySelector("ytd-browse #primary, ytd-browse #contents");
    if (primary) return { host: primary, before: primary.firstChild };
    return null;
  }
  function ensureChannelPanel() {
    var panel = document.getElementById(CHANNEL_PANEL);
    var m = channelMount();
    if (!m) return null;
    if (!panel) { panel = el("div", "pa-panel pa-channel"); panel.id = CHANNEL_PANEL; }
    if (panel.parentNode !== m.host) m.host.insertBefore(panel, m.before);
    return panel;
  }
  function removeChannelPanel() {
    var panel = document.getElementById(CHANNEL_PANEL);
    if (panel) panel.remove();
    channel.shownKey = null;
  }
  function channelRefresh() {
    channel.shownKey = null;
    updateChannel(true);
  }
  function renderChannelNote(label, msg, bad) {
    var panel = ensureChannelPanel();
    if (!panel) return;
    panel.textContent = "";
    panelHeader(panel, label, channelRefresh);
    panel.appendChild(el("div", "pa-note" + (bad ? " pa-bad" : ""), msg));
  }

  function renderChannel(ch) {
    var panel = ensureChannelPanel();
    if (!panel) return;
    panel.textContent = "";
    panelHeader(panel, ch.handle || ch.id, channelRefresh);

    var r = ch.recent || { count: 0, videos: [] };
    var er = safeDiv(r.avgLikes + r.avgComments, r.avgViews) * 100;
    var g = grade(er);
    var viewsPerSub = safeDiv(r.avgViews, ch.subscribers) * 100;

    var body = el("div", "pa-channel-body");

    var left = el("div", "pa-channel-main");
    var hero = el("div", "pa-hero");
    hero.appendChild(el("div", "pa-hero-label", "Engagement rate, last " + plural(r.count, "upload")));
    var hv = el("div", "pa-hero-value", r.count ? pct(er) : "–");
    if (r.count) hv.appendChild(el("span", "pa-pill " + g.cls, g.label));
    hero.appendChild(hv);
    hero.appendChild(el("div", "pa-hero-note", "(avg likes + avg comments) / avg views · " + compact(r.avgViews) + " avg views · " + compact(r.avgLikes) + " avg likes · " + compact(r.avgComments) + " avg comments"));
    left.appendChild(hero);

    var grid = el("div", "pa-grid");
    grid.appendChild(tile("Subscribers", ch.hiddenSubscribers ? "Hidden" : compact(ch.subscribers), ch.hiddenSubscribers ? "" : fmt(ch.subscribers)));
    grid.appendChild(tile("Total views", compact(ch.views), fmt(safeDiv(ch.views, ch.videos)) + " per video"));
    grid.appendChild(tile("Videos", fmt(ch.videos), r.uploadsPerMonth ? r.uploadsPerMonth + " per month lately" : ""));
    grid.appendChild(tile("Views per sub", ch.subscribers ? pct(viewsPerSub, 0) : "–", viewsPerSub >= 30 ? "strong, subs really watch" : viewsPerSub >= 10 ? "normal" : ch.subscribers ? "low, many inactive subs" : ""));
    grid.appendChild(tile("Last 30 days", plural(r.last30Count || 0, "upload"), compact(r.last30Views || 0) + " views"));
    grid.appendChild(tile("Shorts share", pct((r.shortsShare || 0) * 100, 0), "of recent uploads"));
    left.appendChild(grid);

    var details = el("div", "pa-rows");
    details.appendChild(row("Channel created", dateStr(ch.publishedAt) + (ch.publishedAt ? " · " + ago(ch.publishedAt) : "")));
    details.appendChild(row("Country", ch.country || "not set"));
    details.appendChild(row("Views per day (lifetime)", compact(safeDiv(ch.views, daysSince(ch.publishedAt) || 1))));
    if (ch.topics && ch.topics.length) details.appendChild(row("Topics", ch.topics.slice(0, 3).join(", ")));
    left.appendChild(details);

    if (ch.keywords && ch.keywords.length) {
      var kw = el("div", "pa-tags");
      var kh = el("div", "pa-section-head");
      kh.appendChild(el("span", null, "Channel keywords"));
      kh.appendChild(copyButton(ch.keywords.join(", "), "Copy all"));
      kw.appendChild(kh);
      kw.appendChild(chips(ch.keywords, searchFor));
      left.appendChild(kw);
    }
    body.appendChild(left);

    if (r.videos && r.videos.length) {
      var side = el("div", "pa-channel-side");
      var sh = el("div", "pa-section-head");
      sh.appendChild(el("span", null, "Recent uploads"));
      side.appendChild(sh);
      var list = el("div", "pa-recent");
      r.videos.slice(0, 10).forEach(function (v) {
        var item = el("a", "pa-recent-item");
        item.href = v.url;
        var ratio = safeDiv(v.views, r.avgViews);
        var t = el("span", "pa-recent-title", v.title);
        t.title = v.title;
        item.appendChild(t);
        var meta = el("span", "pa-recent-meta");
        meta.appendChild(el("b", null, compact(v.views)));
        meta.appendChild(el("span", "pa-muted", " · " + ago(v.publishedAt) + " · " + (v.seconds <= 60 ? "Short" : duration(v.seconds))));
        if (r.avgViews) meta.appendChild(el("span", "pa-mini " + (ratio >= 1.5 ? "good" : ratio < 0.5 ? "bad" : ""), ratio.toFixed(1) + "x avg"));
        item.appendChild(meta);
        list.appendChild(item);
      });
      side.appendChild(list);
      body.appendChild(side);
    }
    panel.appendChild(body);

    footer(panel, "From the YouTube Data API via passivearray.vercel.app. Cached for 6 hours.");
  }

  function updateChannel(force) {
    var key = getChannelKey();
    if (!key) { removeChannelPanel(); return; }
    if (!force && key === channel.shownKey && document.getElementById(CHANNEL_PANEL)) { ensureChannelPanel(); return; }
    if (key === channel.loadingKey && !force) return;
    if (!channelMount()) return; // header not rendered yet, the watchdog retries

    channel.loadingKey = key;
    var label = key.replace("https://www.youtube.com/", "");
    renderChannelNote(label, "Loading channel stats…");
    api("channel", { channel: key }).then(function (res) {
      if (channel.loadingKey !== key) return;
      channel.loadingKey = null;
      if (!res.ok) { renderChannelNote(label, errorText(res), true); return; }
      channel.shownKey = key;
      renderChannel(res.channel);
    });
  }

  /* =========================================================== SEARCH */

  var search = { stats: {}, pending: {}, timer: null, observer: null };

  function isSearchPage() { return location.pathname === "/results"; }

  function resultVideoId(node) {
    var a = node.querySelector("a#video-title[href], a#thumbnail[href]");
    if (!a) return null;
    var m = a.getAttribute("href").match(/[?&]v=([\w-]{11})/);
    return m ? m[1] : null;
  }

  function badge(text, cls, title) {
    var b = el("span", "pa-badge " + (cls || ""), text);
    if (title) b.title = title;
    return b;
  }

  function renderBadges(node, s) {
    var old = node.querySelector(".pa-badges");
    if (old) old.remove();
    var rowEl = el("div", "pa-badges");
    var age = daysSince(s.publishedAt);
    var er = safeDiv(s.likes + s.comments, s.views) * 100;
    var g = grade(er);
    var ratio = safeDiv(s.views, s.subscribers);

    if (s.live) rowEl.appendChild(badge("LIVE", "live"));
    else if (s.seconds > 0 && s.seconds <= 60) rowEl.appendChild(badge("Short", ""));

    rowEl.appendChild(badge(compact(Math.round(safeDiv(s.views, age || 1))) + "/day", "", "Average views per day since upload"));
    rowEl.appendChild(badge("ER " + pct(er, 1), g.cls, "Engagement rate: (likes + comments) / views. " + g.label + "."));
    rowEl.appendChild(badge(s.hiddenSubscribers ? "subs hidden" : compact(s.subscribers) + " subs", "", "Channel subscribers"));
    if (s.subscribers && !s.live) {
      var rTitle = "This video's views divided by the channel's subscribers. Above 1x means the topic pulled in far more than the channel's own audience.";
      rowEl.appendChild(badge(ratio.toFixed(ratio >= 10 ? 0 : 1) + "x subs", ratio >= 1 ? "good" : ratio < 0.1 ? "bad" : "", rTitle));
      if (ratio >= 1 && s.subscribers < 100000) rowEl.appendChild(badge("Small channel ranking", "opp", "A channel under 100K subs is ranking here with more views than subscribers. Good sign that the topic is open."));
    }
    rowEl.appendChild(badge(plural(s.tags, "tag"), s.tags === 0 ? "warn" : "", "Number of tags set on the video"));

    var host = node.querySelector("#meta") || node.querySelector(".text-wrapper") || node.querySelector("#dismissible") || node;
    host.appendChild(rowEl);
    node.setAttribute("data-pa-done", "1");
  }

  function scanResults() {
    if (!isSearchPage() || !enabled) return;
    var nodes = document.querySelectorAll("ytd-video-renderer:not([data-pa-done])");
    var need = [];
    nodes.forEach(function (node) {
      var id = resultVideoId(node);
      if (!id) return;
      if (search.stats[id]) renderBadges(node, search.stats[id]);
      else if (!search.pending[id]) { search.pending[id] = true; need.push(id); }
    });
    if (!need.length) return;
    for (var i = 0; i < need.length; i += 50) fetchStats(need.slice(i, i + 50));
  }

  function fetchStats(ids) {
    api("videos", { ids: ids.join(",") }).then(function (res) {
      ids.forEach(function (id) { delete search.pending[id]; });
      if (!res.ok) { showSearchError(errorText(res)); return; }
      (res.videos || []).forEach(function (v) { search.stats[v.id] = v; });
      document.querySelectorAll("ytd-video-renderer:not([data-pa-done])").forEach(function (node) {
        var id = resultVideoId(node);
        if (id && search.stats[id]) renderBadges(node, search.stats[id]);
      });
    });
  }

  function showSearchError(msg) {
    var old = document.getElementById("pa-search-error");
    if (old) old.remove();
    var host = document.querySelector("ytd-search #contents, ytd-section-list-renderer #contents");
    if (!host) return;
    var box = el("div", "pa-panel pa-inline-note");
    box.id = "pa-search-error";
    panelHeader(box, null, null);
    box.appendChild(el("div", "pa-note pa-bad", msg));
    host.insertBefore(box, host.firstChild);
  }

  function startSearch() {
    if (search.observer) return;
    search.observer = new MutationObserver(function () {
      clearTimeout(search.timer);
      search.timer = setTimeout(scanResults, 400);
    });
    search.observer.observe(document.body, { childList: true, subtree: true });
    scanResults();
  }
  function stopSearch() {
    if (search.observer) { search.observer.disconnect(); search.observer = null; }
    clearTimeout(search.timer);
    var e = document.getElementById("pa-search-error");
    if (e) e.remove();
    document.querySelectorAll(".pa-badges").forEach(function (n) { n.remove(); });
    document.querySelectorAll("[data-pa-done]").forEach(function (n) { n.removeAttribute("data-pa-done"); });
  }

  /* ============================================================ ROUTER */

  function route() {
    if (!enabled) { removeVideoPanel(); removeChannelPanel(); stopSearch(); return; }
    updateVideo();
    updateChannel();
    if (isSearchPage()) startSearch(); else stopSearch();
  }

  /* YouTube is a single-page app: this event fires on every in-app navigation. */
  document.addEventListener("yt-navigate-finish", function () { setTimeout(route, 300); });
  /* Watchdog: catches missed events and YouTube re-rendering the sidebar under us. */
  var lastHref = location.href;
  setInterval(function () {
    if (location.href !== lastHref) { lastHref = location.href; route(); return; }
    if (!enabled) return;
    if (getVideoId() && !document.getElementById(VIDEO_PANEL) && videoMount()) { video.shownId = null; updateVideo(); }
    if (getChannelKey() && !document.getElementById(CHANNEL_PANEL) && channelMount()) { channel.shownKey = null; updateChannel(); }
  }, 1000);

  /* The popup asks what page this tab is on, to prefill its keyword and AI writer inputs. */
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (!msg || msg.type !== "pageInfo") return false;
    var vid = getVideoId();
    if (vid) {
      var d = video.cache[vid] || {};
      sendResponse({ page: "video", id: vid, title: d.title || document.title.replace(/ - YouTube$/, ""), tags: d.tags || [], channel: d.channel || "", description: d.description || "" });
    } else if (isSearchPage()) {
      sendResponse({ page: "search", query: new URLSearchParams(location.search).get("search_query") || "" });
    } else if (getChannelKey()) {
      sendResponse({ page: "channel", key: getChannelKey() });
    } else {
      sendResponse({ page: "other" });
    }
    return false;
  });

  chrome.storage.sync.get({ panelEnabled: true }, function (v) {
    enabled = v.panelEnabled !== false;
    route();
  });
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === "sync" && changes.panelEnabled) {
      enabled = changes.panelEnabled.newValue !== false;
      video.shownId = null;
      channel.shownKey = null;
      route();
    }
  });
})();
