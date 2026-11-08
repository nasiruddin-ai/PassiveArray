// Vercel Function: one function for the whole Pro plan, because the Hobby plan
// allows 12 serverless functions per deployment and each file under api/ is one.
// vercel.json rewrites the public paths here:
//   /api/watch          -> /api/pro?fn=watch            lib/api-watch.js
//   /api/watch-cron     -> /api/pro?fn=watch-cron       lib/api-watch-cron.js   (daily cron)
//   /api/billing        -> /api/pro?fn=billing          lib/api-billing.js
//   /api/billing-webhook -> /api/pro?fn=billing-webhook lib/api-billing-webhook.js (Lemon Squeezy)
//   /api/channel        -> /api/pro?fn=channel          lib/api-channel.js      (your own channel)
//   /mcp                -> /api/pro?fn=mcp              lib/api-mcp.js          (MCP server for AI assistants)
//   /api/mcp-account    -> /api/pro?fn=mcp-account      lib/api-mcp-account.js  (MCP keys, credits, activity)
//
// Body parsing is off so the billing webhook signature can be checked over the exact bytes
// it sent; the raw body is read once here and parsed as JSON for the others.

module.exports.config = { api: { bodyParser: false } };

const HANDLERS = {
  "watch": () => require("../lib/api-watch.js"),
  "watch-cron": () => require("../lib/api-watch-cron.js"),
  "billing": () => require("../lib/api-billing.js"),
  "billing-webhook": () => require("../lib/api-billing-webhook.js"),
  "channel": () => require("../lib/api-channel.js"),
  "mcp": () => require("../lib/api-mcp.js"),
  "mcp-account": () => require("../lib/api-mcp-account.js"),
  "meta": () => require("../lib/api-meta.js"),
  "domain-age": () => async (req, res) => {
    const { configure, handleAgeRequest } = require("../domain-age-checker/lib/age.js");
    configure({ timeoutMs: 4000 });
    const { code, body } = await handleAgeRequest((req.query || {}).domain);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.status(code).send(JSON.stringify(body));
  },
  "domain-finder-check": () => async (req, res) => {
    const { configure, handleCheckRequest } = require("../domain-finder/lib/check.js");
    configure({ timeoutMs: 4000 });
    const { code, body } = await handleCheckRequest((req.query || {}).domain);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.status(code).send(JSON.stringify(body));
  },
  "plagiarism": () => async (req, res) => {
    const { configure, handleRequest } = require("../plagiarism-checker/lib/plagiarism.js");
    const send = (code, body) => {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      return res.status(code).send(JSON.stringify(body));
    };
    configure({
      googleApiKey: process.env.GOOGLE_API_KEY,
      googleCx: process.env.GOOGLE_CX,
      maxQueriesPerCheck: Number(process.env.MAX_QUERIES_PER_CHECK) || 20,
    });
    const action = (req.query || {}).action;
    if (action === "status") {
      const r = await handleRequest("status");
      return send(r.code, r.body);
    }
    if (req.method !== "POST") return send(405, { ok: false, error: "Use POST." });
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (_) { return send(400, { ok: false, error: "Body must be JSON" }); }
    }
    const { code, body: out } = await handleRequest(action, body || {});
    return send(code, out);
  },
};

function readRaw(req) {
  return new Promise((resolve, reject) => {
    if (typeof req.rawBody === "string") return resolve(req.rawBody);
    if (typeof req.body === "string") return resolve(req.body);
    if (req.body && Buffer.isBuffer(req.body)) return resolve(req.body.toString("utf8"));
    if (req.body && typeof req.body === "object") return resolve(JSON.stringify(req.body)); // already parsed (local dev server)
    if (typeof req.on !== "function") return resolve("");
    let data = "";
    req.on("data", (c) => { data += c; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  const fn = String((req.query && req.query.fn) || "").toLowerCase();
  const load = HANDLERS[fn];
  if (!load) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(404).send(JSON.stringify({ ok: false, error: "Unknown function." }));
  }
  if (req.method === "POST" || req.method === "PUT") {
    const raw = await readRaw(req);
    req.rawBody = raw;
    if (fn !== "billing-webhook") {
      if (!raw) req.body = {};
      else {
        try { req.body = JSON.parse(raw); } catch (_) { req.body = "\u0000invalid"; } // lib/session.parseBody returns null for unparseable strings
      }
    }
  }
  return load()(req, res);
};
