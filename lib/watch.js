// Watched channels: the first Pro feature.
//
// A signed-in person saves YouTube channels. A daily job snapshots every watched
// channel (1 quota unit per 50 channels) so the account page can show 7-day and
// 30-day change, and Pro members get a weekly email with the movers.
//
// Store keys:
//   u:<email>            user record, gains  watch: [{ id, title, handle, thumbnail, addedAt }]
//   watch:all            SET of every channel id anyone watches
//   chan:<id>            latest channel meta and stats  { title, url, thumbnail, subscribers, views, videos, seenAt }
//   snap:<id>:<date>     daily snapshot { s: subscribers, v: views, n: videos }  (shared with lib/outliers.js)

const store = require("./store.js");
const users = require("./users.js");
const youtube = require("../creator-tools/lib/youtube.js");
const pro = require("./pro.js");

const DAY = 86400000;
const dateOf = (t) => new Date(t).toISOString().slice(0, 10);

/* ------------------------------------------------------------------ snapshots */
async function snapshotIds(ids) {
  let units = 0, written = 0;
  const day = dateOf(Date.now());
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    let d;
    try { d = await youtube.yt("channels", { part: "snippet,statistics", id: batch.join(",") }); units += 1; } catch (e) { continue; }
    const cmds = [];
    for (const item of d.items || []) {
      const st = item.statistics || {}, sn = item.snippet || {};
      const meta = {
        title: sn.title,
        handle: sn.customUrl || "",
        url: "https://www.youtube.com/" + (sn.customUrl || "channel/" + item.id),
        thumbnail: ((sn.thumbnails || {}).default || {}).url || "",
        subscribers: youtube.n(st.subscriberCount),
        hiddenSubscribers: !!st.hiddenSubscriberCount,
        views: youtube.n(st.viewCount),
        videos: youtube.n(st.videoCount),
        seenAt: day,
      };
      cmds.push(["SET", "chan:" + item.id, JSON.stringify(meta), "EX", String(60 * 86400)]);
      cmds.push(["SET", "snap:" + item.id + ":" + day, JSON.stringify({ s: meta.subscribers, v: meta.views, n: meta.videos }), "EX", String(45 * 86400)]);
      written++;
    }
    if (cmds.length) await store.pipeline(cmds);
  }
  return { units, written };
}

async function snapshotAllWatched() {
  const ids = await store.smembers("watch:all");
  if (!ids.length) return { units: 0, written: 0, channels: 0 };
  const r = await snapshotIds(ids);
  return { ...r, channels: ids.length };
}

/* ------------------------------------------------------------------ change over time */
// Finds the snapshot closest to `daysAgo` (within +/- 3 days) using one pipeline per channel set.
async function changesFor(ids) {
  if (!ids.length) return {};
  const now = Date.now();
  const wanted = [];
  for (const id of ids) {
    wanted.push(["GET", "chan:" + id]);
    for (const back of [0, 1, 7, 8, 6, 30, 31, 29]) wanted.push(["GET", "snap:" + id + ":" + dateOf(now - back * DAY)]);
  }
  const results = await store.pipeline(wanted);
  const out = {};
  let k = 0;
  for (const id of ids) {
    const parse = (r) => { try { return r && r.result ? JSON.parse(r.result) : null; } catch (_) { return null; } };
    const meta = parse(results[k++]);
    const snaps = {};
    for (const back of [0, 1, 7, 8, 6, 30, 31, 29]) snaps[back] = parse(results[k++]);
    const today = snaps[0] || snaps[1] || (meta ? { s: meta.subscribers, v: meta.views, n: meta.videos } : null);
    const week = snaps[7] || snaps[8] || snaps[6];
    const month = snaps[30] || snaps[31] || snaps[29];
    const delta = (a, b, key) => (a && b && typeof a[key] === "number" && typeof b[key] === "number" ? a[key] - b[key] : null);
    out[id] = {
      meta,
      today,
      d7: today && week ? { subs: delta(today, week, "s"), views: delta(today, week, "v"), videos: delta(today, week, "n") } : null,
      d30: today && month ? { subs: delta(today, month, "s"), views: delta(today, month, "v"), videos: delta(today, month, "n") } : null,
    };
  }
  return out;
}

/* ------------------------------------------------------------------ per-user list */
async function list(email) {
  const user = (await users.get(email)) || users.blank(email);
  const watch = Array.isArray(user.watch) ? user.watch : [];
  const changes = await changesFor(watch.map((w) => w.id));
  return {
    pro: pro.isPro(user),
    plan: pro.planName(user),
    limit: pro.watchLimit(user),
    channels: watch.map((w) => {
      const c = changes[w.id] || {};
      return {
        id: w.id, title: (c.meta && c.meta.title) || w.title, handle: (c.meta && c.meta.handle) || w.handle || "",
        url: (c.meta && c.meta.url) || "https://www.youtube.com/channel/" + w.id, thumbnail: (c.meta && c.meta.thumbnail) || w.thumbnail || "",
        addedAt: w.addedAt, subscribers: c.today ? c.today.s : null, views: c.today ? c.today.v : null, videos: c.today ? c.today.n : null,
        d7: c.d7, d30: c.d30, seenAt: c.meta ? c.meta.seenAt : null,
      };
    }),
  };
}

async function add(email, channelInput) {
  const user = (await users.get(email)) || users.blank(email);
  const watch = Array.isArray(user.watch) ? user.watch : [];
  const limit = pro.watchLimit(user);
  if (watch.length >= limit) {
    const err = new Error(pro.isPro(user) ? "You are watching the maximum of " + limit + " channels." : "Free accounts can watch " + limit + " channels. Pro watches up to " + pro.PRO_WATCH + " with weekly alerts.");
    err.code = "limit"; err.status = 402; throw err;
  }
  const r = await youtube.handleRequest("channel", { channel: channelInput });
  if (!r.body.ok) { const err = new Error(r.body.error || "Channel not found."); err.code = r.body.code || "not_found"; err.status = r.code; throw err; }
  const ch = r.body.channel;
  if (watch.some((w) => w.id === ch.id)) return { already: true, channel: ch };
  watch.push({ id: ch.id, title: ch.title, handle: ch.handle, thumbnail: ch.thumbnail, addedAt: new Date().toISOString() });
  user.watch = watch;
  await users.save(user);
  const day = dateOf(Date.now());
  await store.pipeline([
    ["SADD", "watch:all", ch.id],
    ["SET", "chan:" + ch.id, JSON.stringify({ title: ch.title, handle: ch.handle, url: ch.url, thumbnail: ch.thumbnail, subscribers: ch.subscribers, hiddenSubscribers: ch.hiddenSubscribers, views: ch.views, videos: ch.videos, seenAt: day }), "EX", String(60 * 86400)],
    ["SET", "snap:" + ch.id + ":" + day, JSON.stringify({ s: ch.subscribers, v: ch.views, n: ch.videos }), "EX", String(45 * 86400)],
  ]);
  return { already: false, channel: ch };
}

async function remove(email, id) {
  const user = await users.get(email);
  if (!user || !Array.isArray(user.watch)) return false;
  const before = user.watch.length;
  user.watch = user.watch.filter((w) => w.id !== id);
  if (user.watch.length === before) return false;
  await users.save(user);
  return true;
}

/* ------------------------------------------------------------------ weekly digest */
function fmt(n) { return n == null ? "n/a" : Number(n).toLocaleString("en-US"); }
function signed(n) { return n == null ? "n/a" : (n >= 0 ? "+" : "") + fmt(n); }
function pctChange(delta, base) { return delta == null || !base ? "" : " (" + (delta >= 0 ? "+" : "") + ((delta / base) * 100).toFixed(1) + "%)"; }

async function buildDigest(user, siteUrl) {
  const data = await list(user.email);
  if (!data.channels.length) return null;
  const rows = data.channels.slice().sort((a, b) => ((b.d7 && b.d7.subs) || 0) - ((a.d7 && a.d7.subs) || 0));
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const line = (c) => {
    const subs7 = c.d7 ? signed(c.d7.subs) + pctChange(c.d7.subs, c.subscribers - (c.d7.subs || 0)) : "no 7-day data yet";
    const views7 = c.d7 ? signed(c.d7.views) : "n/a";
    const vids7 = c.d7 ? signed(c.d7.videos) : "n/a";
    return `<tr><td style="padding:8px 10px;border-bottom:1px solid #E3E8EE"><a href="${esc(c.url)}" style="color:#1F7F73;text-decoration:none;font-weight:600">${esc(c.title)}</a><br><span style="color:#5A6478;font-size:12px">${fmt(c.subscribers)} subscribers</span></td><td style="padding:8px 10px;border-bottom:1px solid #E3E8EE;text-align:right;white-space:nowrap">${esc(subs7)}</td><td style="padding:8px 10px;border-bottom:1px solid #E3E8EE;text-align:right;white-space:nowrap">${esc(views7)}</td><td style="padding:8px 10px;border-bottom:1px solid #E3E8EE;text-align:right">${esc(vids7)}</td></tr>`;
  };
  const top = rows.find((c) => c.d7 && c.d7.subs != null);
  const subject = top ? `Watchlist: ${top.title} ${signed(top.d7.subs)} subscribers this week` : "Your Passive Array watchlist this week";
  const html = `<div style="font-family:Poppins,Segoe UI,sans-serif;color:#1F2A44;max-width:640px;margin:0 auto">
<h2 style="margin:0 0 6px">Your watchlist, last 7 days</h2>
<p style="margin:0 0 18px;color:#5A6478">Measured from the YouTube Data API, snapshotted daily. ${rows.length} channel${rows.length === 1 ? "" : "s"}.</p>
<table style="border-collapse:collapse;width:100%;font-size:14px"><thead><tr style="color:#5A6478;font-size:12px;text-align:left"><th style="padding:8px 10px">Channel</th><th style="padding:8px 10px;text-align:right">Subscribers</th><th style="padding:8px 10px;text-align:right">Views</th><th style="padding:8px 10px;text-align:right">Uploads</th></tr></thead><tbody>${rows.map(line).join("")}</tbody></table>
<p style="margin:18px 0 0;font-size:13px;color:#5A6478">Manage your watchlist at <a href="${esc(siteUrl)}/account/" style="color:#1F7F73">${esc(siteUrl.replace(/^https?:\/\//, ""))}/account/</a>. You get this because you are a Passive Array Pro member; turn it off under Weekly report on your account page.</p>
</div>`;
  const text = rows.map((c) => `${c.title}: ${c.d7 ? signed(c.d7.subs) + " subs, " + signed(c.d7.views) + " views, " + signed(c.d7.videos) + " uploads" : "no 7-day data yet"}`).join("\n");
  return { subject, html, text, channels: rows.length };
}

module.exports = { list, add, remove, snapshotIds, snapshotAllWatched, changesFor, buildDigest };
