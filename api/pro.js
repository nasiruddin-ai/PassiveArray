// Vercel Function: one function for the whole Pro plan, because the Hobby plan
// allows 12 serverless functions per deployment and each file under api/ is one.
// vercel.json rewrites the public paths here:
//   /api/watch          -> /api/pro?fn=watch            lib/api-watch.js
//   /api/watch-cron     -> /api/pro?fn=watch-cron       lib/api-watch-cron.js   (daily cron)
//   /api/billing        -> /api/pro?fn=billing          lib/api-billing.js
//   /api/stripe-webhook -> /api/pro?fn=stripe-webhook   lib/api-stripe-webhook.js
//
// Body parsing is off so Stripe's signature can be checked over the exact bytes
// it sent; the raw body is read once here and parsed as JSON for the others.

module.exports.config = { api: { bodyParser: false } };

const HANDLERS = {
  "watch": () => require("../lib/api-watch.js"),
  "watch-cron": () => require("../lib/api-watch-cron.js"),
  "billing": () => require("../lib/api-billing.js"),
  "stripe-webhook": () => require("../lib/api-stripe-webhook.js"),
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
    if (fn !== "stripe-webhook") {
      if (!raw) req.body = {};
      else {
        try { req.body = JSON.parse(raw); } catch (_) { req.body = "\u0000invalid"; } // lib/session.parseBody returns null for unparseable strings
      }
    }
  }
  return load()(req, res);
};
