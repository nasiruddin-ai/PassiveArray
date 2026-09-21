// Netlify Function for the Creator Tools YouTube lookups: answers /creator-tools/api/youtube
//   ?action=channel&channel=@handle
//   ?action=compare&a=..&b=..&c=..
//   ?action=search&q=..&country=..&minSubs=..&maxSubs=..
//   ?action=lookalike&channel=..
// Reuses creator-tools/lib/youtube.js. The key comes from the YOUTUBE_API_KEY
// environment variable, or GOOGLE_API_KEY if that project also has the
// YouTube Data API v3 enabled.

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { configure, handleRequest } = require("../../creator-tools/lib/youtube.js");

export default async (req) => {
  configure({ apiKey: Netlify.env.get("YOUTUBE_API_KEY") || Netlify.env.get("GOOGLE_API_KEY") || "", timeoutMs: 8000 });
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const { code, body } = await handleRequest(params.action, params);
  return new Response(JSON.stringify(body), {
    status: code,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Channel data changes slowly; let Netlify's CDN reuse an answer for 10 minutes.
      "Cache-Control": code === 200 ? "public, max-age=600" : "no-store",
    },
  });
};

export const config = {
  path: "/creator-tools/api/youtube",
};
