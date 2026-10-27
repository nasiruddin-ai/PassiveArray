// Public growth history for the YouTube Channel Growth Tracker and the Twitch Follower Tracker.
//
// Anyone can look up a channel without signing in. The first lookup adds the channel to a
// daily tracking set; the watchlist cron (lib/api-watch-cron.js) then records one point a
// day. History therefore starts the day a channel is first tracked. Nothing is backfilled
// or modelled.
//
// Store keys:
//   hist:yt:<channelId>     HASH  YYYY-MM-DD -> "subscribers,views,videos"      (kept 400 days)
//   hist:tw:<broadcasterId> HASH  YYYY-MM-DD -> "followers"; field "meta" -> JSON (kept 400 days)
//   track:yt / track:tw     SET   ids snapshotted daily (capped, see MAX_TRACKED)
// YouTube reads also merge snap:<id>:<date> keys (45 days) written by the watchlist and the
// outlier job, so a channel already in those sets shows history on its very first lookup.

const store = require("./store.js");

const DAY = 86400000;
const KEEP_SECONDS = 400 * 86400;
const MAX_TRACKED = { yt: Number(process.env.TRACK_MAX_YT) || 2500, tw: Number(process.env.TRACK_MAX_TW) || 1500 };
const dateOf = (t) => new Date(t).toISOString().slice(0, 10);

function encode(platform, p) {
  return platform === "yt" ? [p.s, p.v, p.n].map((x) => Math.round(Number(x) || 0)).join(",") : String(Math.round(Number(p.f) || 0));
}
function decode(platform, raw) {
  const a = String(raw).split(",").map(Number);
  return platform === "yt" ? { s: a[0], v: a[1], n: a[2] } : { f: a[0] };
}

/** Records today's point (once per day) and adds the id to the daily set if there is room. */
async function record(platform, id, point, meta) {
  if (!store.enabled()) return { tracked: false, stored: false };
  const key = "hist:" + platform + ":" + id;
  const day = dateOf(Date.now());
  const cmds = [["HSETNX", key, day, encode(platform, point)], ["EXPIRE", key, String(KEEP_SECONDS)], ["SISMEMBER", "track:" + platform, id], ["SCARD", "track:" + platform]];
  if (meta) cmds.push(["HSET", key, "meta", JSON.stringify(meta)]);
  const r = await store.pipeline(cmds);
  let tracked = !!(r[2] && r[2].result);
  if (!tracked && (r[3] && r[3].result) < MAX_TRACKED[platform]) {
    await store.cmd(["SADD", "track:" + platform, id]);
    tracked = true;
  }
  return { tracked, stored: true };
}

/** Writes the daily point for many ids at once (used by the cron). Overwrites today's value. */
async function recordMany(platform, points) {
  if (!store.enabled() || !points.length) return 0;
  const day = dateOf(Date.now());
  const cmds = [];
  for (const { id, point } of points) {
    cmds.push(["HSET", "hist:" + platform + ":" + id, day, encode(platform, point)]);
    cmds.push(["EXPIRE", "hist:" + platform + ":" + id, String(KEEP_SECONDS)]);
  }
  for (let i = 0; i < cmds.length; i += 400) await store.pipeline(cmds.slice(i, i + 400));
  return points.length;
}

async function trackedIds(platform) {
  return store.smembers("track:" + platform);
}

/** Every stored point, oldest first: [{ d: "YYYY-MM-DD", s, v, n }] or [{ d, f }]. */
async function read(platform, id) {
  if (!store.enabled()) return { series: [], meta: null };
  const key = "hist:" + platform + ":" + id;
  const cmds = [["HGETALL", key]];
  const now = Date.now();
  const snapDays = platform === "yt" ? Array.from({ length: 46 }, (_, i) => dateOf(now - i * DAY)) : [];
  for (const d of snapDays) cmds.push(["GET", "snap:" + id + ":" + d]);
  const r = await store.pipeline(cmds);
  const byDay = new Map();
  let meta = null;
  snapDays.forEach((d, i) => {
    const x = r[i + 1];
    if (x && x.result) { try { const s = JSON.parse(x.result); byDay.set(d, { s: s.s, v: s.v, n: s.n }); } catch (_) { /* skip */ } }
  });
  const flat = (r[0] && r[0].result) || [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const f = flat[i], v = flat[i + 1];
    if (f === "meta") { try { meta = JSON.parse(v); } catch (_) { /* skip */ } continue; }
    if (/^\d{4}-\d{2}-\d{2}$/.test(f)) byDay.set(f, decode(platform, v)); // the hash wins over a snap on the same day
  }
  const series = [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([d, p]) => ({ d, ...p }));
  return { series, meta };
}

/** Change between the latest point and the stored point closest to `days` earlier (within 2 days). */
function changeOver(series, days, key) {
  if (series.length < 2) return null;
  const last = series[series.length - 1];
  const target = new Date(last.d).getTime() - days * DAY;
  // The stored point closest to the target date, allowed to be at most 2 days off.
  let best = null, bestGap = Infinity;
  for (const p of series) {
    const gap = Math.abs(new Date(p.d).getTime() - target);
    if (gap < bestGap) { best = p; bestGap = gap; }
  }
  if (!best || best === last || bestGap > 2 * DAY) return null;
  const span = Math.round((new Date(last.d) - new Date(best.d)) / DAY);
  return { from: best.d, days: span, delta: last[key] - best[key] };
}

module.exports = { record, recordMany, read, trackedIds, changeOver, dateOf, MAX_TRACKED };
