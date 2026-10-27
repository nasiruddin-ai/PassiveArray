// Vercel Function for the Creator Tools YouTube lookups.
// Reached as /creator-tools/api/youtube through the rewrite in vercel.json.
// Same logic as netlify/functions/creator-youtube.mjs, via creator-tools/lib/youtube.js.
// Needs the YOUTUBE_API_KEY environment variable (GOOGLE_API_KEY works if that
// project has the YouTube Data API v3 enabled).

const { configure, handleRequest } = require("../creator-tools/lib/youtube.js");

module.exports = async (req, res) => {
  const apiKey = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || "";
  configure({ apiKey, timeoutMs: 8000 });
  const params = req.query || {};
  // Growth history needs the store, so it is handled outside the store-free tools library.
  // Without a key the tools library answers with its usual "no_key" message.
  const { code, body } = params.action === "history" && apiKey
    ? await require("../lib/growth.js").youtubeHistory(params)
    : await handleRequest(params.action, params);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", code === 200 ? "public, max-age=600" : "no-store");
  // Public read-only data; lets the Passive Array browser extension call this from youtube.com.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(code).send(JSON.stringify(body));
};
