// Vercel Function for the Domain Finder: /domain-finder/api/check (rewritten in vercel.json).
// Same logic as netlify/functions/domain-finder-check.mjs, via domain-finder/lib/check.js.

const { configure, handleCheckRequest } = require("../domain-finder/lib/check.js");

configure({ timeoutMs: 4000 }); // a slow registry becomes "Could not check" instead of a timeout

module.exports = async (req, res) => {
  const { code, body } = await handleCheckRequest((req.query || {}).domain);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(code).send(JSON.stringify(body));
};
