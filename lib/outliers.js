// Outlier videos: uploads that did far better than their channel normally does.
//
//   multiplier = views of the video / median views of the channel's other recent uploads
//
// A daily job (api/research-cron.js) walks the channel index that keyword
// research fills (idx:channels in the store), pulls each channel's last 10
// uploads, and keeps every video from the last 90 days with a multiplier of 3
// or more. It also writes one snapshot per channel per day, which the growth
// rankings will read later. Everything is measured from the YouTube Data API.
//
// Quota per channel: playlistItems 1 + videos 1, plus channels.list at 1 per 50.
// 250 channels a day is about 520 units of the 10,000 daily allowance.

const youtube = require("../creator-tools/lib/youtube.js");
const store = require("./store.js");

const FEED_KEY = "outliers:latest";
const STATUS_KEY = "outliers:status";
const CURSOR_KEY = "outliers:cursor";
const LOCK_KEY = "outliers:lock";
const MIN_MULTIPLIER = 3;
const MIN_VIEWS = 1000;
const MAX_AGE_DAYS = 90;
const SEED_KEYWORDS = ["tech review", "home workout", "easy recipes", "gaming", "personal finance", "travel vlog", "study tips", "small business", "podcast", "productivity", "makeup tutorial", "car review"];

const mem = new Map();
async function kvGet(key) {
  if (store.enabled()) { try { return await store.getJson(key); } catch (_) { /* fall through */ } }
  return mem.has(key) ? mem.get(key) : null;
}
async function kvSet(key, value, ttl) {
  mem.set(key, value);
  if (store.enabled()) { try { await store.setJson(key, value, ttl); } catch (e) { console.error("outliers: store write failed: " + e.message); } }
}
async function channelIndex() {
  if (store.enabled()) { try { return (await store.cmd(["SMEMBERS", "idx:channels"])) || []; } catch (_) { return []; } }
  return mem.get("idx:channels") || [];
}
async function addToIndex(ids) {
  if (!ids.length) return;
  if (store.enabled()) { try { await store.cmd(["SADD", "idx:channels", ...ids]); return; } catch (_) { /* fall through */ } }
  mem.set("idx:channels", [...new Set([...(mem.get("idx:channels") || []), ...ids])]);
}

function n(v) { return youtube.n(v); }
function median(arr) {
  if (!arr.length) return 0;
  const s = arr.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function ageDays(iso) { return Math.max(0, (Date.now() - new Date(iso).getTime()) / 86400000); }
function today() { return new Date().toISOString().slice(0, 10); }

/* ------------------------------------------------------------------ one channel */
async function scanChannel(ch, quota) {
  // ch: { id, title, url, thumbnail, subscribers, hiddenSubscribers, views, videos, topics, uploadsPlaylist }
  if (!ch.uploadsPlaylist) return [];
  const pl = await youtube.yt("playlistItems", { part: "contentDetails", playlistId: ch.uploadsPlaylist, maxResults: 10 }).catch(() => ({ items: [] }));
  quota.units += 1;
  const ids = (pl.items || []).map((i) => i.contentDetails && i.contentDetails.videoId).filter(Boolean);
  if (ids.length < 4) return [];
  const vd = await youtube.yt("videos", { part: "snippet,statistics,contentDetails", id: ids.join(",") });
  quota.units += 1;
  const vids = (vd.items || []).map((v) => ({
    id: v.id,
    title: v.snippet.title,
    url: "https://www.youtube.com/watch?v=" + v.id,
    thumbnail: ((v.snippet.thumbnails || {}).medium || (v.snippet.thumbnails || {}).default || {}).url || "",
    publishedAt: v.snippet.publishedAt,
    views: n(v.statistics && v.statistics.viewCount),
    likes: n(v.statistics && v.statistics.likeCount),
    comments: n(v.statistics && v.statistics.commentCount),
    seconds: youtube.isoDurationToSeconds(v.contentDetails && v.contentDetails.duration),
    live: v.snippet.liveBroadcastContent === "live",
  })).filter((v) => !v.live);

  const out = [];
  for (const v of vids) {
    const others = vids.filter((o) => o.id !== v.id).map((o) => o.views);
    const med = median(others);
    const age = ageDays(v.publishedAt);
    if (age > MAX_AGE_DAYS || v.views < MIN_VIEWS || med <= 0) continue;
    const multiplier = v.views / med;
    if (multiplier < MIN_MULTIPLIER) continue;
    out.push({
      id: v.id, title: v.title, url: v.url, thumbnail: v.thumbnail, publishedAt: v.publishedAt, ageDays: Math.round(age),
      views: v.views, likes: v.likes, comments: v.comments, seconds: v.seconds, isShort: v.seconds > 0 && v.seconds <= 60,
      median: Math.round(med), multiplier: Math.round(multiplier * 10) / 10,
      channelId: ch.id, channelTitle: ch.title, channelUrl: ch.url, channelThumb: ch.thumbnail,
      subscribers: ch.subscribers, hiddenSubscribers: !!ch.hiddenSubscribers, topics: (ch.topics || []).slice(0, 3),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ the daily job */
async function runJob({ maxChannels = 250, deadlineMs = 45000, budgetUnits = 3000 } = {}) {
  const started = Date.now();
  const quota = { units: 0 };
  const summary = { startedAt: new Date(started).toISOString(), scanned: 0, outliers: 0, seeded: 0, units: 0, indexSize: 0, done: false, errors: 0 };

  let ids = await channelIndex();
  if (ids.length < 150 && !(await kvGet("outliers:seeded"))) {
    // First run on an empty index: seed with a few broad niches so the feed is not empty.
    // Spend at most half the budget on seeding so the same run also scans channels.
    for (const q of SEED_KEYWORDS) {
      if (quota.units + 100 > budgetUnits * 0.5) break;
      const s = await youtube.yt("search", { part: "snippet", type: "video", q, maxResults: 25, order: "viewCount", publishedAfter: new Date(Date.now() - 30 * 86400000).toISOString() }).catch(() => ({ items: [] }));
      quota.units += 100;
      const found = [...new Set((s.items || []).map((i) => i.snippet && i.snippet.channelId).filter(Boolean))];
      await addToIndex(found);
      summary.seeded += found.length;
    }
    await kvSet("outliers:seeded", { at: new Date().toISOString() }, 30 * 86400);
    ids = await channelIndex();
  }
  summary.indexSize = ids.length;
  ids.sort();

  // Continue from where the last run stopped so every channel gets a turn.
  const cursor = (await kvGet(CURSOR_KEY)) || { pos: 0 };
  let pos = cursor.pos >= ids.length ? 0 : cursor.pos;
  const slice = ids.slice(pos, pos + maxChannels);
  if (slice.length < maxChannels && ids.length > slice.length) slice.push(...ids.slice(0, maxChannels - slice.length));

  const previous = (await kvGet(FEED_KEY)) || { items: [] };
  const byVideo = new Map(previous.items.filter((i) => ageDays(i.publishedAt) <= MAX_AGE_DAYS).map((i) => [i.id, i]));
  const scannedChannels = new Set();

  for (let i = 0; i < slice.length; i += 50) {
    if (Date.now() - started > deadlineMs || quota.units > budgetUnits) break;
    const batch = slice.slice(i, i + 50);
    let channels = [];
    try {
      const d = await youtube.yt("channels", { part: "snippet,statistics,contentDetails,topicDetails", id: batch.join(",") });
      quota.units += 1;
      channels = (d.items || []).map((item) => ({
        id: item.id,
        title: item.snippet.title,
        url: "https://www.youtube.com/" + (item.snippet.customUrl || "channel/" + item.id),
        thumbnail: ((item.snippet.thumbnails || {}).default || {}).url || "",
        subscribers: n(item.statistics && item.statistics.subscriberCount),
        hiddenSubscribers: !!(item.statistics && item.statistics.hiddenSubscriberCount),
        views: n(item.statistics && item.statistics.viewCount),
        videos: n(item.statistics && item.statistics.videoCount),
        topics: ((item.topicDetails || {}).topicCategories || []).map((u) => decodeURIComponent(u.split("/").pop()).replace(/_/g, " ").replace(/\s*\(.*?\)\s*/g, "")),
        uploadsPlaylist: item.contentDetails && item.contentDetails.relatedPlaylists && item.contentDetails.relatedPlaylists.uploads,
      }));
    } catch (e) { summary.errors++; continue; }

    // Daily snapshot per channel, for growth rankings later.
    const day = today();
    for (const ch of channels) {
      await kvSet("snap:" + ch.id + ":" + day, { s: ch.subscribers, v: ch.views, n: ch.videos }, 45 * 86400);
      await kvSet("chan:" + ch.id, { title: ch.title, url: ch.url, thumbnail: ch.thumbnail, topics: ch.topics, subscribers: ch.subscribers, seenAt: day }, 60 * 86400);
    }

    // Scan uploads with limited concurrency.
    for (let j = 0; j < channels.length; j += 8) {
      if (Date.now() - started > deadlineMs || quota.units > budgetUnits) break;
      const group = channels.slice(j, j + 8);
      const results = await Promise.all(group.map((ch) => scanChannel(ch, quota).catch(() => { summary.errors++; return []; })));
      results.forEach((list, k) => {
        scannedChannels.add(group[k].id);
        for (const item of list) byVideo.set(item.id, item);
      });
    }
  }

  summary.scanned = scannedChannels.size;
  summary.units = quota.units;
  const items = [...byVideo.values()].filter((i) => i.multiplier >= MIN_MULTIPLIER).sort((a, b) => b.multiplier - a.multiplier).slice(0, 400);
  summary.outliers = items.length;
  const nextPos = pos + slice.length >= ids.length ? 0 : pos + slice.length;
  summary.done = Date.now() - started <= deadlineMs;
  await kvSet(FEED_KEY, { updatedAt: new Date().toISOString(), items }, 4 * 86400);
  await kvSet(CURSOR_KEY, { pos: nextPos, at: new Date().toISOString() }, 30 * 86400);
  await kvSet(STATUS_KEY, { ...summary, finishedAt: new Date().toISOString(), ms: Date.now() - started }, 30 * 86400);
  return summary;
}

/* ------------------------------------------------------------------ reading */
async function getFeed({ type = "videos", topic = "", minX = 0, days = 90, sort = "multiplier", limit = 60 } = {}) {
  const feed = (await kvGet(FEED_KEY)) || { updatedAt: null, items: [] };
  let items = feed.items.filter((i) => (type === "shorts" ? i.isShort : type === "videos" ? !i.isShort : true));
  if (topic) items = items.filter((i) => (i.topics || []).some((t) => t.toLowerCase() === topic.toLowerCase()));
  if (minX) items = items.filter((i) => i.multiplier >= Number(minX));
  if (days) items = items.filter((i) => i.ageDays <= Number(days));
  if (sort === "views") items.sort((a, b) => b.views - a.views);
  else if (sort === "newest") items.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  else items.sort((a, b) => b.multiplier - a.multiplier);
  // At most two videos per channel, so one prolific channel cannot fill the page.
  const perChannel = new Map();
  items = items.filter((i) => {
    const c = (perChannel.get(i.channelId) || 0) + 1;
    perChannel.set(i.channelId, c);
    return c <= 2;
  });
  const topics = {};
  for (const i of feed.items) for (const t of i.topics || []) topics[t] = (topics[t] || 0) + 1;
  return {
    updatedAt: feed.updatedAt,
    total: items.length,
    items: items.slice(0, Math.min(Number(limit) || 60, 200)),
    topics: Object.entries(topics).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([name, count]) => ({ name, count })),
  };
}

async function status() {
  const st = (await kvGet(STATUS_KEY)) || null;
  const ids = await channelIndex();
  return { lastRun: st, indexSize: ids.length, storeEnabled: store.enabled() };
}

async function acquireLock(seconds) {
  if (!store.enabled()) return true;
  try {
    const r = await store.cmd(["SET", LOCK_KEY, String(Date.now()), "NX", "EX", String(seconds)]);
    return r === "OK";
  } catch (_) { return true; }
}

module.exports = { runJob, getFeed, status, acquireLock, MIN_MULTIPLIER, SEED_KEYWORDS };
