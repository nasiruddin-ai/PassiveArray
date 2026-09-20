// Netlify Function for the Creator Tools generators: answers POST /creator-tools/api/ai
//   body: { action: "hashtags" | "bio" | "ideas" | "advisor", inputs: {...} }
//
// This is an optional upgrade. Every generator works in the browser without it.
// When ANTHROPIC_API_KEY is set in the Netlify environment variables, the
// generators are written by Claude instead of the built-in templates. Without
// the key this function answers { ok: false, code: "no_key" } and the page
// falls back to the built-in generator silently.

const json = (code, body) =>
  new Response(JSON.stringify(body), { status: code, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

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

export default async (req) => {
  if (req.method !== "POST") return json(405, { ok: false, error: "Use POST." });
  const apiKey = Netlify.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json(200, { ok: false, code: "no_key" });

  let body;
  try {
    body = await req.json();
  } catch (_) {
    return json(400, { ok: false, error: "Body must be JSON." });
  }
  const spec = SCHEMAS[body.action];
  if (!spec) return json(400, { ok: false, error: "Unknown action." });

  const inputs = {};
  for (const [k, v] of Object.entries(body.inputs || {})) inputs[k] = String(v).slice(0, 300);

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
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
        ". Content must be safe for a general audience and must not include anything hateful, sexual or misleading.",
      messages: [{ role: "user", content: spec.task + "\n\nInputs:\n" + JSON.stringify(inputs, null, 2) }],
    });

    if (response.stop_reason === "refusal") return json(200, { ok: false, code: "refused" });
    const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    return json(200, { ok: true, result: extractJson(text), model: response.model });
  } catch (err) {
    // Any failure falls back to the built-in generator in the browser.
    return json(200, { ok: false, code: "ai_error", error: err && err.message ? err.message : String(err) });
  }
};

export const config = {
  path: "/creator-tools/api/ai",
};
