/*
 * Passive Array for YouTube, background service worker.
 * The content script and popup cannot call other websites, so they ask this
 * worker. The YouTube API key lives on the Passive Array tools site, never
 * inside the extension. Answers are cached in chrome.storage.local so the
 * free API quota lasts.
 *
 * Messages:
 *   { type: "api",     action, params }   GET  tools-site YouTube API (channel, videos)
 *   { type: "suggest", q }                YouTube autocomplete, no key, no quota
 *   { type: "keyword", q }                keyword report: results page + stats + score
 *   { type: "ai",      action, inputs }   POST tools-site AI writer (yt_titles, yt_description, yt_tags)
 */
var API = "https://passivearray.vercel.app/creator-tools/api/youtube";
var AI_API = "https://passivearray.vercel.app/creator-tools/api/ai";
var SUGGEST = "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=en&q=";
var TTL = {
  channel: 6 * 60 * 60 * 1000,
  videos: 60 * 60 * 1000,
  suggest: 24 * 60 * 60 * 1000,
  keyword: 12 * 60 * 60 * 1000,
  "default": 30 * 60 * 1000
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (!msg || !msg.type) return false;
  var job;
  if (msg.type === "api") job = apiCall(msg.action, msg.params || {});
  else if (msg.type === "suggest") job = suggest(msg.q);
  else if (msg.type === "keyword") job = keyword(msg.q);
  else if (msg.type === "ai") job = aiCall(msg.action, msg.inputs || {});
  else return false;
  job.then(sendResponse, function (e) {
    sendResponse({ ok: false, code: "network", error: "Could not reach the network. " + (e && e.message ? e.message : "") });
  });
  return true; // keep the channel open for the async answer
});

/* ------------------------------------------------------------- cache */

async function remember(key, ttl, make) {
  var stored = await chrome.storage.local.get(key);
  var hit = stored[key];
  if (hit && hit.until > Date.now()) return hit.body;
  var body = await make();
  if (body && body.ok) {
    var entry = {};
    entry[key] = { until: Date.now() + ttl, body: body };
    await chrome.storage.local.set(entry);
  }
  return body;
}

async function prune() {
  var all = await chrome.storage.local.get(null);
  var now = Date.now(), dead = [];
  Object.keys(all).forEach(function (k) {
    if ((k.indexOf("api:") === 0 || k.indexOf("kw:") === 0 || k.indexOf("sg:") === 0) && (!all[k] || !all[k].until || all[k].until < now)) dead.push(k);
  });
  if (dead.length) await chrome.storage.local.remove(dead);
}
chrome.runtime.onInstalled.addListener(prune);
chrome.runtime.onStartup.addListener(prune);

/* ------------------------------------------------------ tools site API */

function apiCall(action, params) {
  var qs = new URLSearchParams(Object.assign({ action: action }, params)).toString();
  return remember("api:" + qs, TTL[action] || TTL["default"], async function () {
    var res = await fetch(API + "?" + qs, { cache: "no-store" });
    return res.json().catch(function () { return { ok: false, code: "bad_response", error: "The tools site sent an unreadable answer." }; });
  });
}

async function aiCall(action, inputs) {
  var res = await fetch(AI_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: action, inputs: inputs })
  });
  return res.json().catch(function () { return { ok: false, code: "bad_response", error: "The tools site sent an unreadable answer." }; });
}

/* --------------------------------------------------------- autocomplete */

function suggest(q) {
  q = String(q || "").trim().toLowerCase();
  if (!q) return Promise.resolve({ ok: true, suggestions: [] });
  return remember("sg:" + q, TTL.suggest, async function () {
    var res = await fetch(SUGGEST + encodeURIComponent(q));
    var data = await res.json();
    var list = Array.isArray(data) && Array.isArray(data[1]) ? data[1] : [];
    return { ok: true, suggestions: list.map(String).filter(function (s) { return s && s !== q; }).slice(0, 10) };
  });
}

/* ------------------------------------------------------ keyword report */

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

/* Collect every value stored under a given key, anywhere in a nested object. */
function collect(obj, keyName, out, depth) {
  depth = depth || 0;
  out = out || [];
  if (!obj || typeof obj !== "object" || depth > 40) return out;
  Object.keys(obj).forEach(function (k) {
    var v = obj[k];
    if (k === keyName && v) out.push(v);
    else if (v && typeof v === "object") collect(v, keyName, out, depth + 1);
  });
  return out;
}

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function median(arr) {
  var a = arr.filter(function (x) { return x != null && !isNaN(x); }).sort(function (x, y) { return x - y; });
  if (!a.length) return 0;
  var m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
/* Map a value on a log scale between lo and hi to 0..100. */
function logScore(v, lo, hi) {
  if (!v || v <= 0) return 0;
  return clamp(((Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * 100, 0, 100);
}

function keyword(q) {
  q = String(q || "").trim();
  if (!q) return Promise.resolve({ ok: false, code: "input", error: "Type a keyword first." });
  return remember("kw:" + q.toLowerCase(), TTL.keyword, async function () {
    /* 1. YouTube's own results page, same as a viewer would see. No API quota. */
    var res = await fetch("https://www.youtube.com/results?search_query=" + encodeURIComponent(q) + "&hl=en", { credentials: "include" });
    var html = await res.text();
    var data = extractObject(html, "ytInitialData =");
    if (!data) return { ok: false, code: "parse", error: "Could not read YouTube's results page. Open youtube.com once, then try again." };
    var estimated = Number(data.estimatedResults || 0);
    var seen = {}, ids = [];
    collect(data, "videoRenderer").forEach(function (r) {
      if (r.videoId && !seen[r.videoId]) { seen[r.videoId] = true; ids.push(r.videoId); }
    });
    ids = ids.slice(0, 20);
    if (!ids.length) return { ok: false, code: "empty", error: "No videos found for this keyword." };

    /* 2. Stats for those videos through the tools site (2 quota units). */
    var stats = await apiCall("videos", { ids: ids.join(",") });
    if (!stats.ok) return stats;
    var byId = {};
    (stats.videos || []).forEach(function (v) { byId[v.id] = v; });
    var now = Date.now();
    var videos = ids.map(function (id, i) {
      var v = byId[id];
      if (!v) return null;
      var days = Math.max(1, Math.round((now - new Date(v.publishedAt).getTime()) / 86400000));
      return {
        rank: i + 1, id: v.id, title: v.title, channel: v.channelTitle, channelId: v.channelId,
        views: v.views, likes: v.likes, comments: v.comments, subscribers: v.subscribers,
        hiddenSubscribers: v.hiddenSubscribers, seconds: v.seconds, live: v.live, tags: v.tags,
        publishedAt: v.publishedAt, days: days, viewsPerDay: v.views / days
      };
    }).filter(Boolean);
    if (!videos.length) return { ok: false, code: "empty", error: "No stats came back for the top results." };

    /* 3. Scores. Estimates from the top results, not real search volume. */
    var vpd = videos.map(function (v) { return v.viewsPerDay; });
    var subs = videos.filter(function (v) { return !v.hiddenSubscribers; }).map(function (v) { return v.subscribers; });
    var medVpd = median(vpd), medSubs = median(subs);
    var big = videos.filter(function (v) { return v.subscribers >= 1000000; }).length;
    var small = videos.filter(function (v) { return !v.hiddenSubscribers && v.subscribers < 100000; }).length;
    var fresh = videos.filter(function (v) { return v.days <= 365; }).length;
    var outperform = videos.filter(function (v) { return v.subscribers && v.views > v.subscribers; }).length;
    var n = videos.length;

    /* Interest: how much the top results get watched, plus how much is published on it. */
    var interest = Math.round(0.7 * logScore(medVpd, 1, 20000) + 0.3 * logScore(estimated, 100, 50000000));
    /* Competition: size of the channels ranking, share of 1M+ channels, and how stale the results are. */
    var competition = Math.round(0.35 * logScore(medSubs, 1000, 10000000) + 0.5 * (big / n) * 100 + 0.15 * (1 - fresh / n) * 100);
    /* Overall: weighted geometric mean that leans on room to rank, plus a bonus when small channels already rank. */
    var overall = Math.round(Math.pow(Math.max(interest, 1), 0.4) * Math.pow(Math.max(100 - competition, 1), 0.6) + (small / n) * 10);
    if (big / n >= 0.7) overall = Math.min(overall, 45); // big channels own the page, a newcomer will not rank
    overall = clamp(overall, 0, 100);
    var avgSeconds = videos.reduce(function (a, v) { return a + v.seconds; }, 0) / n;
    var noTags = videos.filter(function (v) { return v.tags === 0; }).length;

    return {
      ok: true,
      q: q,
      estimatedResults: estimated,
      count: n,
      scores: { overall: overall, interest: interest, competition: competition },
      summary: {
        medianViewsPerDay: Math.round(medVpd),
        medianSubscribers: Math.round(medSubs),
        smallChannels: small,
        bigChannels: big,
        freshVideos: fresh,
        outperforming: outperform,
        avgSeconds: Math.round(avgSeconds),
        noTags: noTags,
        medianViews: Math.round(median(videos.map(function (v) { return v.views; })))
      },
      videos: videos,
      fetchedAt: now
    };
  });
}
