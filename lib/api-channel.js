// Handler for /api/channel (served through api/pro.js). The signed-in person's own channel.
//   GET                      insights for the saved channel: live stats, last 10 uploads, 7/30-day change
//   POST ?action=set {channel}   save (and validate) the channel, then the same payload
//   POST ?action=clear           forget it
//
// Saving a channel also adds it to the daily snapshot set (watch:all), so growth
// columns start filling from the next run. Cost: the shared channel lookup (3 units,
// cached 6 hours by the tools API) and nothing else.

const { currentSession, json, parseBody } = require("./session.js");
const store = require("./store.js");
const users = require("./users.js");
const youtube = require("../creator-tools/lib/youtube.js");
const watch = require("./watch.js");
const pro = require("./pro.js");

const dateOf = (t) => new Date(t).toISOString().slice(0, 10);

/* Change since the oldest snapshot we hold (up to 30 days back), so a newly tracked
   channel shows real movement before a full 7-day window exists. */
async function sinceFirstSnapshot(ch) {
  const now = Date.now();
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const res = await store.pipeline(days.map((d) => ["GET", "snap:" + ch.id + ":" + dateOf(now - d * 86400000)])).catch(() => []);
  let oldest = null;
  days.forEach((d, i) => { const r = res[i]; if (r && r.result) { try { oldest = { d, snap: JSON.parse(r.result) }; } catch (_) {} } });
  if (!oldest) return null;
  const s = oldest.snap;
  return { from: dateOf(now - oldest.d * 86400000), days: oldest.d, subs: ch.subscribers - s.s, views: ch.views - s.v, videos: ch.videos - s.n };
}

async function insights(user) {
  if (!user.channel) return { ok: true, channel: null, plan: pro.planName(user) };
  const r = await youtube.handleRequest("channel", { channel: user.channel });
  if (!r.body.ok) return { ok: false, code: r.body.code || "not_found", error: r.body.error || "Channel not found.", saved: user.channel };
  const ch = r.body.channel;
  const day = dateOf(Date.now());
  if (user.channelId !== ch.id) {
    user.channelId = ch.id;
    user.channelSince = user.channelSince || day;
    await users.save(user);
  }
  await store.pipeline([
    ["SADD", "watch:all", ch.id],
    ["SET", "chan:" + ch.id, JSON.stringify({ title: ch.title, handle: ch.handle, url: ch.url, thumbnail: ch.thumbnail, subscribers: ch.subscribers, hiddenSubscribers: ch.hiddenSubscribers, views: ch.views, videos: ch.videos, seenAt: day }), "EX", String(60 * 86400)],
    ["SET", "snap:" + ch.id + ":" + day, JSON.stringify({ s: ch.subscribers, v: ch.views, n: ch.videos }), "NX", "EX", String(45 * 86400)],
  ]).catch(() => {});
  const changes = (await watch.changesFor([ch.id]).catch(() => ({})))[ch.id] || {};
  const recent = ch.recent || {};
  const videos = (recent.videos || []).slice().sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const avg = recent.avgViews || 0;
  const now = Date.now();
  const uploads = videos.map((v) => {
    const days = Math.max(1, Math.round((now - new Date(v.publishedAt).getTime()) / 86400000));
    return { ...v, days, viewsPerDay: Math.round(v.views / days), xAvg: avg ? Math.round((v.views / avg) * 100) / 100 : 0, er: v.views ? Math.round(((v.likes + v.comments) / v.views) * 10000) / 100 : 0, short: v.seconds > 0 && v.seconds <= 60 };
  });
  const best = uploads.slice().sort((a, b) => b.views - a.views)[0] || null;
  const gaps = [];
  for (let i = 0; i + 1 < videos.length; i++) gaps.push((new Date(videos[i].publishedAt) - new Date(videos[i + 1].publishedAt)) / 86400000);
  const engagement = recent.avgViews ? ((recent.avgLikes + recent.avgComments) / recent.avgViews) * 100 : 0;
  return {
    ok: true,
    plan: pro.planName(user),
    saved: user.channel,
    since: user.channelSince || day,
    channel: { id: ch.id, title: ch.title, handle: ch.handle, url: ch.url, thumbnail: ch.thumbnail, country: ch.country, publishedAt: ch.publishedAt, subscribers: ch.subscribers, hiddenSubscribers: ch.hiddenSubscribers, views: ch.views, videos: ch.videos, keywords: ch.keywords || [], topics: ch.topics || [] },
    summary: {
      avgViews: Math.round(recent.avgViews || 0), avgLikes: Math.round(recent.avgLikes || 0), avgComments: Math.round(recent.avgComments || 0),
      engagement: Math.round(engagement * 100) / 100,
      viewsPerSub: ch.subscribers ? Math.round((recent.avgViews / ch.subscribers) * 1000) / 10 : null,
      uploadsPerMonth: recent.uploadsPerMonth || 0, last30Count: recent.last30Count || 0, last30Views: recent.last30Views || 0,
      shortsShare: Math.round((recent.shortsShare || 0) * 100), avgGapDays: gaps.length ? Math.round((gaps.reduce((a, b) => a + b, 0) / gaps.length) * 10) / 10 : null,
      viewsPerVideo: ch.videos ? Math.round(ch.views / ch.videos) : null,
    },
    uploads, best,
    d7: changes.d7 || null, d30: changes.d30 || null,
    sinceStart: await sinceFirstSnapshot(ch),
    uploads7: uploads.filter((u) => u.days <= 7).length,
    fullWeekOn: dateOf(new Date((user.channelSince ? new Date(user.channelSince).getTime() : now) + 7 * 86400000)),
  };
}

/* ------------------------------------------------------------------ ideas matched to the channel
   Relevance comes from the channel itself: its Studio keywords, its topics, the words that
   recur in its recent titles, and any focus keywords the person typed. Outliers from the index
   are scored against that profile; the keyword research for the top terms shows what ranks
   right now and, as a side effect, adds those channels to the daily outlier scan so the
   feed gets more relevant for this niche over time. */
const research = require("./research.js");
const outliers = require("./outliers.js");
const STOP = new Set("the a an and or of to in on for with is are at by from how this that my your you i we it its be vs what why when where who will can get new best top video videos youtube shorts short part episode ep full official ft feat live".split(" "));
const words = (s) => String(s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length >= 3 && !STOP.has(w) && !/^\d+$/.test(w));

function profileTerms(user, ch) {
  const phrases = new Map(); // phrase -> weight
  const add = (p, w) => { p = String(p || "").toLowerCase().trim(); if (p.length >= 3) phrases.set(p, Math.max(phrases.get(p) || 0, w)); };
  (Array.isArray(user.focus) ? user.focus : []).forEach((k) => add(k, 4));
  (ch.keywords || []).forEach((k) => add(k, 3));
  const tf = new Map();
  for (const v of (ch.recent && ch.recent.videos) || []) for (const w of new Set(words(v.title))) tf.set(w, (tf.get(w) || 0) + 1);
  for (const w of words(ch.title)) tf.set(w, (tf.get(w) || 0) + 2);
  const titleWords = [...tf.entries()].filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 25);
  const single = new Map();
  for (const [p, w] of phrases) for (const t of words(p)) single.set(t, Math.max(single.get(t) || 0, w / 2));
  for (const [w, c] of titleWords) single.set(w, Math.max(single.get(w) || 0, Math.min(c, 4) * 0.6));
  const topics = new Set((ch.topics || []).map((t) => String(t).toLowerCase()));
  const focusTerms = (Array.isArray(user.focus) && user.focus.length ? user.focus : (ch.keywords || []).filter((k) => words(k).length <= 3).slice(0, 3));
  return { phrases, single, topics, focusTerms: focusTerms.slice(0, 3), titleWords: titleWords.slice(0, 8).map(([w]) => w) };
}

function scoreItem(item, prof) {
  const title = String(item.title || "").toLowerCase();
  let score = 0; const hits = new Set();
  for (const [p, w] of prof.phrases) if (p.length >= 4 && title.includes(p)) { score += w; hits.add(p); }
  for (const w of new Set(words(title))) if (prof.single.has(w)) { score += prof.single.get(w); hits.add(w); }
  for (const t of item.topics || []) if (prof.topics.has(String(t).toLowerCase())) { score += 1.5; hits.add(t); }
  return { score: Math.round(score * 10) / 10, hits: [...hits].slice(0, 4) };
}

async function ideasFor(user, ch) {
  const prof = profileTerms(user, ch);
  const feed = await outliers.getFeed({ type: "all", days: 90, sort: "multiplier", limit: 200 }).catch(() => ({ items: [] }));
  const scored = feed.items.map((i) => ({ ...i, ...scoreItem(i, prof) })).filter((i) => i.score >= 2 && i.channelId !== ch.id)
    .sort((a, b) => b.score - a.score || b.multiplier - a.multiplier).slice(0, 12);
  const ranking = [], keywords = [];
  for (const term of prof.focusTerms) {
    try {
      const a = await research.analyzeKeyword(term);
      keywords.push({ keyword: term, score: a.score ? a.score.value : null, label: a.score ? a.score.label : null, competing: a.competing, cached: !!a.cached });
      for (const t of a.top || []) ranking.push({ ...t, keyword: term, viewsPerDay: Math.round(t.views / Math.max(1, t.ageDays)), mine: t.channelId === ch.id });
    } catch (e) {
      keywords.push({ keyword: term, error: e.code === "quota_guard" ? "quota" : "error" });
    }
  }
  const seen = new Set();
  const rank = ranking.filter((v) => !seen.has(v.id) && seen.add(v.id)).sort((a, b) => b.viewsPerDay - a.viewsPerDay).slice(0, 12);
  return {
    ok: true,
    basedOn: { focus: prof.focusTerms, keywords: (ch.keywords || []).slice(0, 10), topics: ch.topics || [], titleWords: prof.titleWords, custom: Array.isArray(user.focus) && user.focus.length > 0 },
    outliers: scored, scanned: feed.items.length, updatedAt: feed.updatedAt || null,
    ranking: rank, keywords,
  };
}

module.exports = async (req, res) => {
  const s = currentSession(req);
  if (!s) return json(res, 401, { ok: false, code: "signin", error: "Sign in to add your channel." });
  if (!store.enabled()) return json(res, 503, { ok: false, code: "no_store", error: "Channel tracking is not switched on yet on this deployment." });
  youtube.configure({ apiKey: process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || "", timeoutMs: 8000 });
  const action = (req.query && req.query.action) || "get";
  try {
    const user = (await users.get(s.e)) || users.blank(s.e);
    if (req.method === "POST") {
      const body = parseBody(req);
      if (body === null) return json(res, 400, { ok: false, error: "Body must be JSON." });
      if (action === "clear") { user.channel = ""; user.channelId = ""; await users.save(user); return json(res, 200, { ok: true, channel: null }); }
      if (action === "focus") {
        const raw = Array.isArray(body.keywords) ? body.keywords : String(body.keywords || "").split(/[,\n]/);
        user.focus = [...new Set(raw.map((k) => String(k || "").trim().toLowerCase().slice(0, 40)).filter((k) => k.length >= 2))].slice(0, 6);
        await users.save(user);
      }
      if (action === "set") {
        const channel = String(body.channel || "").trim().slice(0, 80);
        if (!channel) return json(res, 400, { ok: false, error: "Type your @handle or channel link." });
        const probe = await youtube.handleRequest("channel", { channel });
        if (!probe.body.ok) return json(res, probe.code, { ok: false, code: probe.body.code || "not_found", error: probe.body.error || "Channel not found." });
        user.channel = channel;
        user.channelId = probe.body.channel.id;
        user.channelSince = user.channelSince || dateOf(Date.now());
        await users.save(user);
      }
    }
    if (action === "ideas" || action === "focus") {
      if (!user.channel) return json(res, 200, { ok: true, outliers: [], ranking: [], keywords: [], basedOn: null });
      const r = await youtube.handleRequest("channel", { channel: user.channel });
      if (!r.body.ok) return json(res, r.code, { ok: false, code: r.body.code || "not_found", error: r.body.error || "Channel not found." });
      return json(res, 200, await ideasFor(user, r.body.channel));
    }
    return json(res, 200, await insights(user));
  } catch (e) {
    return json(res, e.status && e.status < 500 ? e.status : 502, { ok: false, code: e.code || "error", error: e.message || "Something went wrong." });
  }
};
