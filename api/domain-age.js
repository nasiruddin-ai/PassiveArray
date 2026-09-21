// Vercel Function for the Domain Age Checker: /domain-age-checker/api/age (rewritten in vercel.json).
// Same logic as netlify/functions/domain-age.mjs, via domain-age-checker/lib/age.js.

const { configure, handleAgeRequest } = require("../domain-age-checker/lib/age.js");

configure({ timeoutMs: 4000 }); // stay well inside the 10-second function limit

module.exports = async (req, res) => {
  const { code, body } = await handleAgeRequest((req.query || {}).domain);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(code).send(JSON.stringify(body));
};
