// Vercel Function for keyword research. vercel.json rewrites
//   /research/api/suggest | keyword | recent  ->  /api/research?action=...
// Logic lives in lib/research.js. Needs YOUTUBE_API_KEY for the keyword action;
// suggest works without any key. Results and the daily quota counter are kept in
// the key-value store when KV_REST_API_URL / KV_REST_API_TOKEN are set.

const youtube = require("../creator-tools/lib/youtube.js");
const research = require("../lib/research.js");

module.exports = async (req, res) => {
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || "";
  youtube.configure({ apiKey, timeoutMs: 8000 });
  const params = req.query || {};
  const ip = String(req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "").split(",")[0].trim();
  const { code, body } = await research.handleRequest(params.action, params, { apiKey, ip });
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", code === 200 ? "public, max-age=300" : "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(code).send(JSON.stringify(body));
};
