// Vercel Function: /api/watch   (needs a signed-in session)
//   GET   ?action=list                      watched channels with 7-day and 30-day change
//   POST  ?action=add     { channel }       add a channel (link, @handle or name)
//   POST  ?action=remove  { id }            remove one
//
// Free accounts watch up to 3 channels; Pro up to 100 with the weekly email.

const { currentSession, json, parseBody } = require("../lib/session.js");
const store = require("../lib/store.js");
const youtube = require("../creator-tools/lib/youtube.js");
const watch = require("../lib/watch.js");

module.exports = async (req, res) => {
  const action = (req.query && req.query.action) || "list";
  const s = currentSession(req);
  if (!s) return json(res, 401, { ok: false, code: "signin", error: "Sign in to watch channels." });
  if (!store.enabled()) return json(res, 503, { ok: false, code: "no_store", error: "Watchlists are not switched on yet on this deployment." });
  youtube.configure({ apiKey: process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || "", timeoutMs: 8000 });

  try {
    if (action === "list") return json(res, 200, { ok: true, ...(await watch.list(s.e)) });
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });
    const body = parseBody(req);
    if (body === null) return json(res, 400, { ok: false, error: "Body must be JSON." });
    if (action === "add") {
      const { limited } = await store.hitLimit("watch:add:" + s.e, 30, 3600);
      if (limited) return json(res, 429, { ok: false, code: "rate", error: "Too many additions. Wait a few minutes." });
      const r = await watch.add(s.e, String(body.channel || "").trim());
      return json(res, 200, { ok: true, already: r.already, channel: { id: r.channel.id, title: r.channel.title, handle: r.channel.handle }, ...(await watch.list(s.e)) });
    }
    if (action === "remove") {
      const removed = await watch.remove(s.e, String(body.id || ""));
      return json(res, 200, { ok: true, removed, ...(await watch.list(s.e)) });
    }
    return json(res, 404, { ok: false, error: "Unknown action." });
  } catch (e) {
    return json(res, e.status && e.status < 500 ? e.status : 502, { ok: false, code: e.code || "error", error: e.message || "Something went wrong." });
  }
};
