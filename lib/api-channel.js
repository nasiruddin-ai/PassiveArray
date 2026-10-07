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
    return json(res, 200, await insights(user));
  } catch (e) {
    return json(res, e.status && e.status < 500 ? e.status : 502, { ok: false, code: e.code || "error", error: e.message || "Something went wrong." });
  }
};
