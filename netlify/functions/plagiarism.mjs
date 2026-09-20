// Netlify Function for the Plagiarism Checker: answers
//   GET  /plagiarism-checker/api/status
//   POST /plagiarism-checker/api/compare
//   POST /plagiarism-checker/api/check
//   POST /plagiarism-checker/api/fetch-url
// Reuses the same logic as the local tool (plagiarism-checker/lib/plagiarism.js).
//
// The Google key is read from Netlify environment variables GOOGLE_API_KEY and
// GOOGLE_CX (Project configuration > Environment variables). If those are not
// set, values from plagiarism-checker/config.json are used instead.

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { configure, handleRequest } = require("../../plagiarism-checker/lib/plagiarism.js");

const json = (code, body) =>
  new Response(JSON.stringify(body), {
    status: code,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export default async (req) => {
  configure({
    googleApiKey: Netlify.env.get("GOOGLE_API_KEY"),
    googleCx: Netlify.env.get("GOOGLE_CX"),
    // A function must finish in 10 seconds, so check fewer sentences per run than locally.
    maxQueriesPerCheck: Number(Netlify.env.get("MAX_QUERIES_PER_CHECK")) || 20,
  });

  const action = new URL(req.url).pathname.split("/").pop(); // status | compare | check | fetch-url

  if (action === "status") return json(...Object.values(await handleRequest("status")));
  if (req.method !== "POST") return json(405, { ok: false, error: "Use POST." });

  let body = {};
  try {
    body = await req.json();
  } catch (_) {
    return json(400, { ok: false, error: "Body must be JSON" });
  }
  const { code, body: out } = await handleRequest(action, body);
  return json(code, out);
};

export const config = {
  path: ["/plagiarism-checker/api/status", "/plagiarism-checker/api/compare", "/plagiarism-checker/api/check", "/plagiarism-checker/api/fetch-url"],
};
