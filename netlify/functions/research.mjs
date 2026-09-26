// Netlify Function for keyword research: answers
//   /research/api/suggest?q=..   /research/api/keyword?q=..   /research/api/recent
// Same logic as api/research.js (Vercel), via lib/research.js.

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const youtube = require("../../creator-tools/lib/youtube.js");
const research = require("../../lib/research.js");

export default async (req, context) => {
  const apiKey = Netlify.env.get("YOUTUBE_API_KEY") || Netlify.env.get("GOOGLE_API_KEY") || "";
  youtube.configure({ apiKey, timeoutMs: 8000 });
  const url = new URL(req.url);
  const action = url.pathname.split("/").pop();
  const params = Object.fromEntries(url.searchParams.entries());
  const ip = (context && context.ip) || req.headers.get("x-forwarded-for") || "";
  const { code, body } = await research.handleRequest(action, params, { apiKey, ip: String(ip).split(",")[0].trim() });
  return new Response(JSON.stringify(body), {
    status: code,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": code === 200 ? "public, max-age=300" : "no-store", "Access-Control-Allow-Origin": "*" },
  });
};

export const config = {
  path: ["/research/api/suggest", "/research/api/keyword", "/research/api/recent"],
};
