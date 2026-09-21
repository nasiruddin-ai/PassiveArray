// Vercel Function for the Creator Tools Twitch lookups.
// Reached as /creator-tools/api/twitch through the rewrite in vercel.json.
// Needs TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET environment variables.

const { configure, handleRequest } = require("../creator-tools/lib/twitch.js");

module.exports = async (req, res) => {
  configure({ clientId: process.env.TWITCH_CLIENT_ID || "", clientSecret: process.env.TWITCH_CLIENT_SECRET || "", timeoutMs: 8000 });
  const params = req.query || {};
  const { code, body } = await handleRequest(params.action, params);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", code === 200 ? "public, max-age=120" : "no-store");
  res.status(code).send(JSON.stringify(body));
};
