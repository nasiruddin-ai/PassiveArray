// The MCP endpoint, https://passivearray.com/mcp (served through api/pro.js?fn=mcp).
//
// Streamable HTTP transport, stateless: every request is a JSON-RPC message POSTed to this
// URL and answered with a single JSON response (no session, no server-sent events).
// Methods: initialize, ping, tools/list, tools/call; notifications are acknowledged with 202.
//
// Authentication: an API key from the account page, sent as "Authorization: Bearer pa_..."
// or as ?key=pa_... in the URL (for clients such as Claude and ChatGPT whose custom
// connector form only takes a URL). Connecting and listing tools work without a key so
// clients can show what is available; calling a tool needs one.

const store = require("./store.js");
const mcp = require("./mcp.js");

const SUPPORTED = ["2025-06-18", "2025-03-26", "2024-11-05"];
const SERVER = { name: "passive-array", title: "Passive Array", version: "1.0.0" };
const INSTRUCTIONS = "Passive Array gives measured YouTube and Twitch data from the official APIs: channel stats, daily growth history, monetization signals, comments, keyword research with real ranking data, outlier videos and earnings estimates. Subscriber counts from YouTube are rounded to three significant figures. Earnings and monetization results are estimates and say so. There is no search-volume data. Each call costs Passive Array credits; the result says how many remain today.";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID");
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id, MCP-Protocol-Version");
}

function send(res, code, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(code).send(body == null ? "" : JSON.stringify(body));
}

const rpcError = (id, code, message, data) => ({ jsonrpc: "2.0", id: id == null ? null : id, error: { code, message, ...(data ? { data } : {}) } });
const rpcResult = (id, result) => ({ jsonrpc: "2.0", id, result });

function keyFrom(req) {
  const h = String((req.headers && (req.headers.authorization || req.headers.Authorization)) || "");
  const m = /^Bearer\s+(\S+)/i.exec(h);
  if (m) return m[1];
  const alt = req.headers && (req.headers["x-api-key"] || req.headers["x-passive-array-key"]);
  if (alt) return String(alt);
  return String((req.query && req.query.key) || "");
}

async function handleMessage(msg, req, state) {
  if (!msg || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") {
    return msg && msg.id != null ? rpcError(msg.id, -32600, "Invalid request.") : null;
  }
  const isNotification = msg.id === undefined;
  if (isNotification) return null; // notifications/initialized, cancelled, etc.
  const id = msg.id;
  const params = msg.params || {};

  if (msg.method === "initialize") {
    const asked = params.protocolVersion;
    return rpcResult(id, {
      protocolVersion: SUPPORTED.includes(asked) ? asked : SUPPORTED[0],
      capabilities: { tools: { listChanged: false } },
      serverInfo: SERVER,
      instructions: INSTRUCTIONS,
    });
  }
  if (msg.method === "ping") return rpcResult(id, {});
  if (msg.method === "tools/list") return rpcResult(id, { tools: mcp.publicTools() });
  if (msg.method === "resources/list") return rpcResult(id, { resources: [] });
  if (msg.method === "prompts/list") return rpcResult(id, { prompts: [] });
  if (msg.method === "tools/call") {
    const name = String(params.name || "");
    if (!state.ctx) {
      if (state.ctx === undefined) state.ctx = state.key ? await mcp.resolveKey(state.key) : null;
    }
    if (!state.ctx) {
      const text = state.key
        ? "This Passive Array API key is not valid. It may have been revoked. Create a new one at https://passivearray.com/account/#mcp and update your connection."
        : "Add your Passive Array API key to use this tool. Create one free at https://passivearray.com/account/#mcp, then connect with https://passivearray.com/mcp?key=YOUR_KEY or the header Authorization: Bearer YOUR_KEY.";
      return rpcResult(id, { content: [{ type: "text", text }], isError: true });
    }
    const r = await mcp.callTool(state.ctx, name, params.arguments || {});
    if (r.unknown) return rpcError(id, -32602, r.message);
    if (!r.ok) return rpcResult(id, { content: [{ type: "text", text: r.message }], isError: true });
    const payload = { ...r.result, credits: { used: r.credits, remainingToday: r.remaining } };
    return rpcResult(id, { content: [{ type: "text", text: JSON.stringify(payload, null, 1) }], structuredContent: payload, isError: false });
  }
  return rpcError(id, -32601, "Method not found: " + msg.method);
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  if (req.method === "GET") {
    // A person opening the URL in a browser gets the setup page, not a JSON error.
    if (/text\/html/.test(String(req.headers.accept || ""))) {
      res.setHeader("Location", "/account/#mcp");
      res.setHeader("Cache-Control", "no-store");
      res.status(302).send("");
      return;
    }
    // No server-initiated stream on a stateless server.
    res.setHeader("Allow", "POST, OPTIONS");
    return send(res, 405, rpcError(null, -32000, "This MCP server answers POST requests only. Connect an MCP client to https://passivearray.com/mcp. Setup: https://passivearray.com/account/#mcp"));
  }
  if (req.method === "DELETE") { res.setHeader("Allow", "POST, OPTIONS"); return send(res, 405, null); }
  if (req.method !== "POST") return send(res, 405, rpcError(null, -32000, "Use POST."));
  if (!store.enabled()) return send(res, 503, rpcError(null, -32000, "The MCP server is not switched on for this deployment."));

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return send(res, 400, rpcError(null, -32700, "Parse error.")); }
  }
  if (body == null || (typeof body === "object" && !Array.isArray(body) && !Object.keys(body).length)) return send(res, 400, rpcError(null, -32600, "Empty request."));

  // Per-address limit in front of everything, so a bad client cannot hammer the store.
  const ip = String((req.headers && (req.headers["x-forwarded-for"] || "")) || "").split(",")[0].trim() || "unknown";
  const { limited } = await store.hitLimit("mcpip:" + ip, 120, 60);
  if (limited) return send(res, 429, rpcError(Array.isArray(body) ? null : body.id, -32000, "Too many requests. Slow down."));

  const state = { key: keyFrom(req), ctx: undefined };
  const proto = req.headers && req.headers["mcp-protocol-version"];
  if (proto) res.setHeader("MCP-Protocol-Version", String(proto));
  try {
    if (Array.isArray(body)) {
      const out = [];
      for (const m of body.slice(0, 20)) { const r = await handleMessage(m, req, state); if (r) out.push(r); }
      return out.length ? send(res, 200, out) : send(res, 202, null);
    }
    const r = await handleMessage(body, req, state);
    return r ? send(res, 200, r) : send(res, 202, null);
  } catch (e) {
    console.error("mcp endpoint: " + e.stack);
    return send(res, 500, rpcError(Array.isArray(body) ? null : body.id, -32603, "Internal error."));
  }
};
