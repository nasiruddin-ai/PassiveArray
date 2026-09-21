// Vercel Function for the Plagiarism Checker. vercel.json rewrites
//   /plagiarism-checker/api/status | compare | check | fetch-url  ->  /api/plagiarism?action=...
// Same logic as netlify/functions/plagiarism.mjs, via plagiarism-checker/lib/plagiarism.js.
// Keys come from the GOOGLE_API_KEY and GOOGLE_CX environment variables, falling
// back to plagiarism-checker/config.json.

const { configure, handleRequest } = require("../plagiarism-checker/lib/plagiarism.js");

function send(res, code, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(code).send(JSON.stringify(body));
}

module.exports = async (req, res) => {
  configure({
    googleApiKey: process.env.GOOGLE_API_KEY,
    googleCx: process.env.GOOGLE_CX,
    maxQueriesPerCheck: Number(process.env.MAX_QUERIES_PER_CHECK) || 20,
  });

  const action = (req.query || {}).action; // status | compare | check | fetch-url
  if (action === "status") return send(res, ...Object.values(await handleRequest("status")));
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Use POST." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return send(res, 400, { ok: false, error: "Body must be JSON" }); }
  }
  const { code, body: out } = await handleRequest(action, body || {});
  send(res, code, out);
};
