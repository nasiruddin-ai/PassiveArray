// Netlify Function for the Domain Finder: answers /domain-finder/api/check
// Reuses the same logic as the local tool (domain-finder/lib/check.js).

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { configure, handleCheckRequest } = require("../../domain-finder/lib/check.js");

// Netlify gives a function about 10 seconds to answer, so wait less per lookup
// than the local tool does. A slow registry becomes "Could not check".
configure({ timeoutMs: 4000 });

export default async (req) => {
  const url = new URL(req.url);
  const { code, body } = await handleCheckRequest(url.searchParams.get("domain"));
  return new Response(JSON.stringify(body), {
    status: code,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
};

export const config = {
  path: "/domain-finder/api/check",
};
