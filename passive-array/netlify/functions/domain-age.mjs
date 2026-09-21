// Netlify Function for the Domain Age Checker: answers /domain-age-checker/api/age
// Reuses the same logic as the local tool (domain-age-checker/lib/age.js).

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { configure, handleAgeRequest } = require("../../domain-age-checker/lib/age.js");

configure({ timeoutMs: 4000 }); // stay well inside the 10-second function limit

export default async (req) => {
  const url = new URL(req.url);
  const { code, body } = await handleAgeRequest(url.searchParams.get("domain"));
  return new Response(JSON.stringify(body), {
    status: code,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
};

export const config = {
  path: "/domain-age-checker/api/age",
};
