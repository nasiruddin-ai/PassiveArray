// Daily outlier job. Scheduled by the "crons" entry in vercel.json (once a day,
// which is what the free plan allows). Can also be triggered by hand:
//   GET /api/research-cron?key=<CRON_SECRET>
// Vercel's scheduler sends "Authorization: Bearer <CRON_SECRET>" when that
// environment variable is set. A store lock stops it running more than once
// every 6 hours, so an accidental double trigger cannot burn the quota.

const youtube = require("../creator-tools/lib/youtube.js");
const outliers = require("../lib/outliers.js");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const secret = process.env.CRON_SECRET || "";
  const given = (req.headers.authorization || "").replace(/^Bearer\s+/i, "") || (req.query && req.query.key) || "";
  if (secret && given !== secret) return res.status(401).send(JSON.stringify({ ok: false, error: "Unauthorized" }));

  const apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (!apiKey) return res.status(503).send(JSON.stringify({ ok: false, code: "no_key", error: "YOUTUBE_API_KEY is not set." }));
  youtube.configure({ apiKey, timeoutMs: 8000 });

  if (!(await outliers.acquireLock(6 * 3600))) {
    return res.status(200).send(JSON.stringify({ ok: false, code: "locked", error: "The outlier job already ran in the last 6 hours." }));
  }
  try {
    const summary = await outliers.runJob({
      maxChannels: Number(process.env.OUTLIER_CHANNELS_PER_RUN) || 250,
      budgetUnits: Number(process.env.OUTLIER_UNITS_PER_RUN) || 3000,
      deadlineMs: 45000,
    });
    res.status(200).send(JSON.stringify({ ok: true, ...summary }));
  } catch (e) {
    res.status(500).send(JSON.stringify({ ok: false, error: e.message }));
  }
};
