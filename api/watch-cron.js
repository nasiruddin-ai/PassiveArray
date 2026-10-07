// Daily watchlist job. Scheduled in vercel.json (crons). Snapshots every watched
// channel (1 quota unit per 50 channels), and on Mondays sends the weekly
// watchlist email to Pro members who have it switched on, through the same
// Apps Script webhook that delivers sign-in links (kind: "digest").
//
// Manual trigger: GET /api/watch-cron?key=<CRON_SECRET>   (?digest=1 forces the email)

const store = require("../lib/store.js");
const users = require("../lib/users.js");
const youtube = require("../creator-tools/lib/youtube.js");
const watch = require("../lib/watch.js");
const pro = require("../lib/pro.js");
const { siteUrl } = require("../lib/session.js");

async function sendDigest(record) {
  const url = process.env.SUBSCRIBE_WEBHOOK_URL || "";
  if (!url) return false;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record), signal: ctrl.signal, redirect: "follow" });
    return r.ok;
  } catch (_) {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const secret = process.env.CRON_SECRET || "";
  const given = (req.headers.authorization || "").replace(/^Bearer\s+/i, "") || (req.query && req.query.key) || "";
  if (secret && given !== secret) return res.status(401).send(JSON.stringify({ ok: false, error: "Unauthorized" }));
  if (!store.enabled()) return res.status(503).send(JSON.stringify({ ok: false, code: "no_store", error: "Store not configured." }));
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (!apiKey) return res.status(503).send(JSON.stringify({ ok: false, code: "no_key", error: "YOUTUBE_API_KEY is not set." }));
  youtube.configure({ apiKey, timeoutMs: 8000 });

  const lock = await store.cmd(["SET", "watch:lock", String(Date.now()), "NX", "EX", String(6 * 3600)]).catch(() => "OK");
  if (lock !== "OK") return res.status(200).send(JSON.stringify({ ok: false, code: "locked", error: "The watchlist job already ran in the last 6 hours." }));

  const started = Date.now();
  const summary = { startedAt: new Date(started).toISOString() };
  try {
    Object.assign(summary, await watch.snapshotAllWatched());

    const monday = new Date().getUTCDay() === 1;
    const force = !!(req.query && req.query.digest);
    summary.digests = { attempted: 0, sent: 0, skipped: "not Monday" };
    if (monday || force) {
      summary.digests.skipped = process.env.SUBSCRIBE_WEBHOOK_URL ? "" : "SUBSCRIBE_WEBHOOK_URL not set";
      const keys = await store.scanKeys("u:*", 2000);
      const site = siteUrl(req);
      for (const key of keys) {
        if (Date.now() - started > 50000) { summary.digests.skipped = "time limit, continue next run"; break; }
        const user = await store.getJson(key);
        if (!user || !pro.isPro(user) || user.weekly === false || !Array.isArray(user.watch) || !user.watch.length) continue;
        summary.digests.attempted++;
        const digest = await watch.buildDigest(user, site);
        if (!digest) continue;
        const ok = await sendDigest({ kind: "digest", email: user.email, subject: digest.subject, html: digest.html, message: digest.text, source: "watch-cron", receivedAt: new Date().toISOString() });
        if (ok) summary.digests.sent++;
      }
    }
    summary.ms = Date.now() - started;
    await store.setJson("watch:status", summary, 30 * 86400);
    res.status(200).send(JSON.stringify({ ok: true, ...summary }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ ok: false, error: e.message }));
  }
};
