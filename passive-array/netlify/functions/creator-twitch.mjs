// Netlify Function for the Creator Tools Twitch lookups: answers /creator-tools/api/twitch
//   ?action=channel&login=name
//   ?action=compare&a=..&b=..&c=..
// Reuses creator-tools/lib/twitch.js. Needs TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET
// environment variables from a Twitch developer application.

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { configure, handleRequest } = require("../../creator-tools/lib/twitch.js");

export default async (req) => {
  configure({ clientId: Netlify.env.get("TWITCH_CLIENT_ID") || "", clientSecret: Netlify.env.get("TWITCH_CLIENT_SECRET") || "", timeoutMs: 8000 });
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const { code, body } = await handleRequest(params.action, params);
  return new Response(JSON.stringify(body), {
    status: code,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": code === 200 ? "public, max-age=120" : "no-store" },
  });
};

export const config = {
  path: "/creator-tools/api/twitch",
};
