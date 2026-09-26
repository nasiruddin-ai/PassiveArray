// Keyword research for YouTube, built only from sources we can measure:
//   - YouTube search autocomplete (free, no quota): what people actually type.
//   - YouTube Data API search + video + channel stats: who ranks for the phrase
//     today and how strong they are.
//
// We never publish a "search volume" number. Nobody outside Google has one for
// YouTube, so every such figure elsewhere is a model. What we show instead is
// measured: autocomplete rank, competing videos, the views and channel sizes
// of the top 10, how fresh they are, and an opportunity score with its formula.
//
// Quota: one keyword analysis costs 102 units (search 100, videos 1, channels 1).
// A free key has 10,000 a day, so results are cached for 7 days and a daily
// guard stops research once RESEARCH_DAILY_UNITS is spent, leaving room for the
// other live tools. Cache and counters live in the key-value store (lib/store.js)
// when it is configured, else in this process's memory.

const youtube = require("../creator-tools/lib/youtube.js");
const store = require("./store.js");
const outliers = require("./outliers.js");

const SUGGEST = "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=en&q=";
const KEYWORD_TTL = 7 * 24 * 3600; // seconds
const SUGGEST_TTL = 24 * 3600;
const DAILY_UNITS = Number(process.env.RESEARCH_DAILY_UNITS) || 8000;
const ANALYSIS_UNITS = 102;
const EXPANDERS = "abcdefghijklmnopqrstuvwxyz".split("").concat(["how to", "best", "for beginners", "vs", "tutorial", "review", "2026"]);

const mem = new Map();
async function cacheGet(key) {
  if (store.enabled()) {
    try { const v = await store.getJson(key); if (v != null) return v; } catch (e) { /* fall through to memory */ }
  }
  const hit = mem.get(key);
  return hit && hit.until > Date.now() ? hit.value : null;
}
async function cacheSet(key, value, ttl) {
  mem.set(key, { value, until: Date.now() + ttl * 1000 });
  if (store.enabled()) {
    try { await store.setJson(key, value, ttl); } catch (e) { console.error("research: cache write failed: " + e.message); }
  }
}

function cleanKeyword(q) {
  return String(q || "").toLowerCase().replace(/[‘’“”]/g, "'").replace(/\s+/g, " ").trim().slice(0, 80);
}

/* ------------------------------------------------------------------ autocomplete */
async function suggestOnce(q) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(SUGGEST + encodeURIComponent(q), { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) && Array.isArray(data[1]) ? data[1].map((s) => cleanKeyword(s)).filter(Boolean) : [];
  } catch (_) {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// Base suggestions for the phrase plus expansions (phrase + a letter or modifier).
async function suggestions(q) {
  const key = "sug:" + q;
  const hit = await cacheGet(key);
  if (hit) return hit;

  const base = await suggestOnce(q);
  const counts = new Map();
  const batches = [];
  for (let i = 0; i < EXPANDERS.length; i += 9) batches.push(EXPANDERS.slice(i, i + 9));
  for (const batch of batches) {
    const results = await Promise.all(batch.map((x) => suggestOnce(/^(how to|best)$/.test(x) ? x + " " + q : q + " " + x)));
    results.forEach((list, idx) => {
      for (const phrase of list) {
        if (phrase === q || base.includes(phrase)) continue;
        const e = counts.get(phrase) || { phrase, count: 0, via: [] };
        e.count++;
        if (e.via.length < 4) e.via.push(batch[idx]);
        counts.set(phrase, e);
      }
    });
  }
  const expanded = [...counts.values()].sort((a, b) => b.count - a.count || a.phrase.length - b.phrase.length).slice(0, 60);
  const out = { keyword: q, base: base.map((phrase, i) => ({ phrase, rank: i + 1 })), expanded, fetchedAt: new Date().toISOString() };
  await cacheSet(key, out, SUGGEST_TTL);
  return out;
}

/* ------------------------------------------------------------------ quota guard */
function pacificDate() {
  // YouTube quota resets at midnight Pacific. Close enough without a timezone library.
  return new Date(Date.now() - 7 * 3600 * 1000).toISOString().slice(0, 10);
}
async function quotaSpent() {
  const key = "yt:quota:" + pacificDate();
  if (store.enabled()) {
    try { return Number(await store.cmd(["GET", key])) || 0; } catch (_) { return 0; }
  }
  const hit = mem.get(key);
  return hit ? hit.value : 0;
}
async function quotaAdd(units) {
  const key = "yt:quota:" + pacificDate();
  if (store.enabled()) {
    try {
      const total = await store.cmd(["INCRBY", key, String(units)]);
      if (total === units) await store.cmd(["EXPIRE", key, String(36 * 3600)]);
      return total;
    } catch (_) { /* fall through */ }
  }
  const hit = mem.get(key);
  const total = (hit ? hit.value : 0) + units;
  mem.set(key, { value: total, until: Date.now() + 36 * 3600 * 1000 });
  return total;
}

/* ------------------------------------------------------------------ keyword analysis */
function ageDays(iso) {
  return Math.max(0, (Date.now() - new Date(iso).getTime()) / 86400000);
}
function median(arr) {
  if (!arr.length) return 0;
  const s = arr.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}
function logScale(x, lo, hi) {
  // 0..1 as x moves from lo to hi on a log scale
  if (x <= lo) return 0;
  if (x >= hi) return 1;
  return (Math.log10(x) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo));
}

function scoreKeyword(m) {
  // Every part is measured from the top 10 results, never modelled.
  const competition = Math.round(35 * (1 - logScale(m.competing, 10000, 5000000)));   // fewer competing videos is better
  const incumbents = Math.round(30 * m.smallChannelShare);                             // small channels ranking means room to rank
  const demand = Math.round(20 * logScale(m.avgViews, 1000, 1000000));                // people watch results for this phrase
  const freshness = Math.round(15 * m.freshShare);                                     // recent videos rank, so new ones can too
  const value = Math.max(0, Math.min(100, competition + incumbents + demand + freshness));
  const label = value >= 70 ? "Strong opportunity" : value >= 50 ? "Good opportunity" : value >= 30 ? "Competitive" : "Saturated";
  return { value, label, parts: { competition, incumbents, demand, freshness } };
}

async function analyzeKeyword(q, { force = false } = {}) {
  const key = "kw:" + q;
  if (!force) {
    const hit = await cacheGet(key);
    if (hit) return { ...hit, cached: true };
  }
  const spent = await quotaSpent();
  if (spent + ANALYSIS_UNITS > DAILY_UNITS) {
    throw Object.assign(new Error("Today's research quota is used up. Cached keywords still work; fresh ones return after midnight Pacific time."), { code: "quota_guard", status: 429 });
  }

  const s = await youtube.yt("search", { part: "snippet", type: "video", q, maxResults: 10, order: "relevance", safeSearch: "none" });
  await quotaAdd(100);
  const ids = (s.items || []).map((i) => i.id && i.id.videoId).filter(Boolean);
  const competing = youtube.n(s.pageInfo && s.pageInfo.totalResults);
  if (!ids.length) {
    const empty = { keyword: q, checkedAt: new Date().toISOString(), competing, top: [], metrics: null, score: null, note: "YouTube returned no videos for this phrase." };
    await cacheSet(key, empty, 24 * 3600);
    return empty;
  }

  const vd = await youtube.yt("videos", { part: "snippet,statistics,contentDetails", id: ids.join(",") });
  await quotaAdd(1);
  const channelIds = [...new Set((vd.items || []).map((v) => v.snippet && v.snippet.channelId).filter(Boolean))];
  const channels = await youtube.statsForIds(channelIds).catch(() => []);
  await quotaAdd(1);
  const byId = new Map(channels.map((c) => [c.id, c]));

  const top = (vd.items || []).map((v, i) => {
    const c = byId.get(v.snippet.channelId) || {};
    const views = youtube.n(v.statistics && v.statistics.viewCount);
    const seconds = youtube.isoDurationToSeconds(v.contentDetails && v.contentDetails.duration);
    return {
      rank: ids.indexOf(v.id) + 1 || i + 1,
      id: v.id,
      title: v.snippet.title,
      url: "https://www.youtube.com/watch?v=" + v.id,
      thumbnail: (v.snippet.thumbnails && (v.snippet.thumbnails.medium || v.snippet.thumbnails.default) || {}).url || "",
      channelId: v.snippet.channelId,
      channelTitle: v.snippet.channelTitle,
      channelUrl: c.url || "https://www.youtube.com/channel/" + v.snippet.channelId,
      subscribers: c.subscribers || 0,
      hiddenSubscribers: !!c.hiddenSubscribers,
      views,
      likes: youtube.n(v.statistics && v.statistics.likeCount),
      comments: youtube.n(v.statistics && v.statistics.commentCount),
      publishedAt: v.snippet.publishedAt,
      ageDays: Math.round(ageDays(v.snippet.publishedAt)),
      seconds,
      isShort: seconds > 0 && seconds <= 60,
      viewsPerSub: c.subscribers ? views / c.subscribers : null,
    };
  }).sort((a, b) => a.rank - b.rank);

  const views = top.map((t) => t.views);
  const subs = top.filter((t) => !t.hiddenSubscribers).map((t) => t.subscribers);
  const metrics = {
    competing,
    avgViews: Math.round(avg(views)),
    medianViews: Math.round(median(views)),
    avgSubs: Math.round(avg(subs)),
    medianSubs: Math.round(median(subs)),
    smallChannelShare: subs.length ? subs.filter((x) => x < 100000).length / subs.length : 0,
    freshShare: top.filter((t) => t.ageDays <= 365).length / top.length,
    shortsShare: top.filter((t) => t.isShort).length / top.length,
    avgAgeDays: Math.round(avg(top.map((t) => t.ageDays))),
    engagement: avg(top.filter((t) => t.views > 0).map((t) => ((t.likes + t.comments) / t.views) * 100)),
  };
  const score = scoreKeyword(metrics);
  const result = { keyword: q, checkedAt: new Date().toISOString(), competing, top, metrics, score, source: "YouTube Data API, top 10 results by relevance" };
  await cacheSet(key, result, KEYWORD_TTL);

  // Groundwork for the outlier and channel feeds: remember what we have seen.
  if (store.enabled()) {
    try {
      if (channelIds.length) await store.cmd(["SADD", "idx:channels", ...channelIds]);
      await store.cmd(["LPUSH", "recent:kw", q]);
      await store.cmd(["LTRIM", "recent:kw", "0", "199"]);
    } catch (_) { /* best effort */ }
  }
  return result;
}

async function recentKeywords(limit = 30) {
  if (!store.enabled()) return [];
  try {
    const list = await store.cmd(["LRANGE", "recent:kw", "0", "199"]);
    return [...new Set(list || [])].slice(0, limit);
  } catch (_) {
    return [];
  }
}

/* ------------------------------------------------------------------ HTTP layer */
function errorBody(e) {
  const code = e.code || "api";
  const messages = {
    no_key: "The YouTube API key is not set up on this site yet.",
    quota: "Today's free YouTube API quota is used up. Try again after midnight Pacific time.",
    bad_key: "The YouTube API key was rejected. Check that the YouTube Data API v3 is enabled for it.",
    rate_limited: "Too many checks from this connection. Please wait a few minutes.",
  };
  return { ok: false, code, error: messages[code] || e.message || "Something went wrong." };
}

async function handleRequest(action, params = {}, ctx = {}) {
  const q = cleanKeyword(params.q);
  try {
    if (action === "suggest") {
      if (!q) return { code: 400, body: { ok: false, code: "input", error: "Type a keyword." } };
      return { code: 200, body: { ok: true, ...(await suggestions(q)) } };
    }
    if (action === "recent") return { code: 200, body: { ok: true, keywords: await recentKeywords() } };
    if (action === "outliers") return { code: 200, body: { ok: true, ...(await outliers.getFeed(params)) } };
    if (action === "status") return { code: 200, body: { ok: true, ...(await outliers.status()) } };
    if (action === "keyword") {
      if (!q) return { code: 400, body: { ok: false, code: "input", error: "Type a keyword." } };
      if (!ctx.apiKey) return { code: 503, body: errorBody({ code: "no_key" }) };
      if (ctx.ip) {
        const { limited } = await store.hitLimit("research:ip:" + ctx.ip, 40, 3600);
        if (limited) return { code: 429, body: errorBody({ code: "rate_limited" }) };
      }
      const [analysis, sug] = await Promise.all([analyzeKeyword(q), suggestions(q)]);
      return { code: 200, body: { ok: true, analysis, suggestions: sug, storeEnabled: store.enabled() } };
    }
    return { code: 404, body: { ok: false, code: "action", error: "Unknown action." } };
  } catch (e) {
    return { code: e.status && e.status < 500 ? e.status : 502, body: errorBody(e) };
  }
}

module.exports = { handleRequest, analyzeKeyword, suggestions, scoreKeyword, cleanKeyword, recentKeywords };
