// Handler for /api/mcp-account (served through api/pro.js). The MCP tab on the account page.
//   GET                          keys, today's credits, recent activity, the tool list
//   POST ?action=create {name}   new API key; the full key is returned this once only
//   POST ?action=revoke {id}     switch a key off immediately

const { currentSession, json, parseBody } = require("./session.js");
const store = require("./store.js");
const users = require("./users.js");
const mcp = require("./mcp.js");

async function state(user) {
  return {
    ok: true,
    endpoint: "https://passivearray.com/mcp",
    keys: await mcp.keyDetails(user),
    maxKeys: mcp.MAX_KEYS,
    usage: await mcp.usageFor(user),
    credits: { free: mcp.FREE_CREDITS, pro: mcp.PRO_CREDITS },
    activity: await mcp.activity(user.email),
    tools: mcp.toolSummary(),
  };
}

module.exports = async (req, res) => {
  const s = currentSession(req);
  if (!s) return json(res, 401, { ok: false, code: "signin", error: "Sign in to manage MCP keys." });
  if (!store.enabled()) return json(res, 503, { ok: false, code: "no_store", error: "MCP keys are not switched on yet on this deployment." });
  try {
    let user = (await users.get(s.e)) || users.blank(s.e);
    if (req.method === "POST") {
      const body = parseBody(req);
      if (body === null) return json(res, 400, { ok: false, error: "Body must be JSON." });
      const action = (req.query && req.query.action) || "";
      if (action === "create") {
        const { limited } = await store.hitLimit("mcpkeys:" + s.e, 10, 3600);
        if (limited) return json(res, 429, { ok: false, error: "Too many new keys this hour. Try again later." });
        const made = await mcp.createKey(s.e, body.name);
        user = await users.get(s.e);
        return json(res, 200, { ...(await state(user)), created: { key: made.key, id: made.record.id, name: made.record.name } });
      }
      if (action === "revoke") {
        await mcp.revokeKey(s.e, String(body.id || ""));
        user = (await users.get(s.e)) || user;
        return json(res, 200, await state(user));
      }
      return json(res, 400, { ok: false, error: "Unknown action." });
    }
    return json(res, 200, await state(user));
  } catch (e) {
    return json(res, e.status && e.status < 500 ? e.status : 502, { ok: false, code: e.code || "error", error: e.message || "Something went wrong." });
  }
};
