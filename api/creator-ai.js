// Vercel Function for the Creator Tools generators: POST /creator-tools/api/ai
//   body: { action: "hashtags" | "bio" | "ideas" | "advisor", inputs: {...} }
//
// Optional upgrade. Every generator works in the browser without it. When
// ANTHROPIC_API_KEY is set, the generators are written by Claude; otherwise
// this answers { ok: false, code: "no_key" } and the page uses its built-in
// templates. Mirrors netlify/functions/creator-ai.mjs.

const SCHEMAS = {
  hashtags: {
    task: "Write an Instagram hashtag set for the post topic and niche. Mix sizes: about 20% broad (millions of posts), 50% medium (100K to 1M posts), 30% niche (under 100K posts) where the account can rank. All lowercase, no spaces, real hashtags people use.",
    shape: '{"tags":[{"tag":"#example","size":"broad|mid|niche"}]}',
  },
  bio: {
    task: "Write 5 Instagram bios, each 150 characters or fewer including line breaks. Structure: what they do, who it is for, a touch of personality or proof, then the call to action on the last line. Match the requested tone. Use at most two emoji per bio, none for the minimal tone.",
    shape: '{"bios":["bio text with \\n line breaks"]}',
  },
  ideas: {
    task: "Write 12 concrete Instagram content ideas for the niche and audience. Each has a specific title (not generic), a hook line under 12 words that would be the first caption line or on-screen text, and a format. Respect the requested format; for mixed, vary across reel, carousel, post and story.",
    shape: '{"ideas":[{"title":"...","hook":"...","format":"reel|carousel|post|story"}]}',
  },
  advisor: {
    task: "Act as an Instagram growth strategist. From the account numbers and goal, give the 3 to 5 changes most likely to move the goal metric, in priority order. Each has a short imperative title, a 2 to 3 sentence reason that references the account's actual numbers and the benchmarks for its size, and the metric to watch. Be specific and practical, no filler.",
    shape: '{"actions":[{"title":"...","why":"...","metric":"..."}]}',
  },
};

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in the model reply.");
  return JSON.parse(text.slice(start, end + 1));
}

function send(res, code, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(code).send(JSON.stringify(body));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Use POST." });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return send(res, 200, { ok: false, code: "no_key" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { return send(res, 400, { ok: false, error: "Body must be JSON." }); }
  }
  body = body || {};
  const spec = SCHEMAS[body.action];
  if (!spec) return send(res, 400, { ok: false, error: "Unknown action." });

  const inputs = {};
  for (const [k, v] of Object.entries(body.inputs || {})) inputs[k] = String(v).slice(0, 300);

  try {
    const mod = require("@anthropic-ai/sdk");
    const Anthropic = mod.default || mod;
    const client = new Anthropic({ apiKey });
    const response = await client.beta.messages.create({
      model: "claude-opus-5",
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system:
        "You write social media assets for a free web tool. Reply with JSON only, no markdown fences, no commentary, exactly this shape: " +
        spec.shape +
        ". Content must be safe for a general audience and must not include anything hateful, sexual or misleading. " +
        "Never invent facts, numbers, client counts, awards or testimonials. Use only what the inputs say; if an input is empty, write around it instead of making something up.",
      messages: [{ role: "user", content: spec.task + "\n\nInputs:\n" + JSON.stringify(inputs, null, 2) }],
    });

    if (response.stop_reason === "refusal") return send(res, 200, { ok: false, code: "refused" });
    const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    return send(res, 200, { ok: true, result: extractJson(text), model: response.model });
  } catch (err) {
    return send(res, 200, { ok: false, code: "ai_error", error: err && err.message ? err.message : String(err) });
  }
};
