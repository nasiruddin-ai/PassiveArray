// API side of the two public trackers, reached through the existing tool functions:
//   /creator-tools/api/youtube?action=history&channel=<link|@handle|name>
//   /creator-tools/api/twitch?action=history&login=<username>
// Each lookup returns the live numbers plus every daily point stored for that channel,
// and records today's point. See lib/history.js for storage and limits.

const history = require("./history.js");
const store = require("./store.js");
const youtube = require("../creator-tools/lib/youtube.js");
const twitch = require("../creator-tools/lib/twitch.js");

function changes(series, key) {
  const out = {};
  for (const days of [1, 7, 30, 90, 365]) out["d" + days] = history.changeOver(series, days, key);
  return out;
}

function withToday(series, point) {
  const today = history.dateOf(Date.now());
  const last = series[series.length - 1];
  if (last && last.d === today) return series;
  return series.concat([{ d: today, ...point }]);
}

async function youtubeHistory(params) {
  let ch;
  try { ch = await youtube.getChannel(params.channel); } catch (e) { return { code: e.status && e.status < 500 ? e.status : 502, body: youtube.errorBody(e) }; }
  const point = { s: ch.subscribers, v: ch.views, n: ch.videos };
  let rec = { tracked: false, stored: false }, series = [];
  try {
    rec = await history.record("yt", ch.id, point);
    series = (await history.read("yt", ch.id)).series;
  } catch (e) {
    console.error("history (yt): " + e.message);
  }
  series = withToday(series, point);
  const { videos, ...recent } = ch.recent || {};
  return {
    code: 200,
    body: {
      ok: true,
      channel: { ...ch, recent },
      series,
      changes: { subs: changes(series, "s"), views: changes(series, "v"), videos: changes(series, "n") },
      tracking: { since: series[0].d, points: series.length, tracked: rec.tracked, storeOn: store.enabled() },
      checkedAt: new Date().toISOString(),
    },
  };
}

async function twitchHistory(params) {
  if (!twitch.configured()) return { code: 503, body: twitch.errorBody({ code: "no_key" }) };
  let ch;
  try { ch = await twitch.getChannel(params.login); } catch (e) { return { code: e.status && e.status < 500 ? e.status : 502, body: twitch.errorBody(e) }; }
  if (ch.followers == null) return { code: 502, body: { ok: false, code: "api", error: "Twitch did not return a follower total for this channel right now. Try again in a minute." } };
  const point = { f: ch.followers };
  let rec = { tracked: false, stored: false }, series = [];
  try {
    rec = await history.record("tw", ch.id, point, { login: ch.login, name: ch.displayName, image: ch.profileImage });
    series = (await history.read("tw", ch.id)).series;
  } catch (e) {
    console.error("history (tw): " + e.message);
  }
  series = withToday(series, point);
  return {
    code: 200,
    body: {
      ok: true,
      channel: ch,
      series,
      changes: { followers: changes(series, "f") },
      tracking: { since: series[0].d, points: series.length, tracked: rec.tracked, storeOn: store.enabled() },
      checkedAt: new Date().toISOString(),
    },
  };
}

/* Daily job for the Twitch side: one follower lookup per tracked broadcaster. */
async function snapshotTwitch(deadline) {
  if (!twitch.configured()) return { twitch: "not configured" };
  const ids = await history.trackedIds("tw");
  const points = [];
  let errors = 0;
  for (let i = 0; i < ids.length; i += 10) {
    if (Date.now() > deadline) break;
    const group = ids.slice(i, i + 10);
    const res = await Promise.all(group.map((id) => twitch.helix("channels/followers", { broadcaster_id: id, first: 1 }).then((d) => ({ id, total: d.total })).catch(() => null)));
    for (const r of res) {
      if (r && typeof r.total === "number") points.push({ id: r.id, point: { f: r.total } });
      else errors++;
    }
  }
  await history.recordMany("tw", points);
  return { twitchTracked: ids.length, twitchWritten: points.length, twitchErrors: errors };
}

module.exports = { youtubeHistory, twitchHistory, snapshotTwitch };
