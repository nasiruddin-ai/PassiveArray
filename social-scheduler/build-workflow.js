// Generates n8n/render-workflow.json for import into n8n.
// Embeds the system prompt, the four templates, and the fill logic so the workflow is self-contained.
// Usage: node build-workflow.js
//
// After import, set these in n8n:
//   1. Google Sheets credential + your sheet ID on the two Sheets nodes (search for YOUR_SHEET_ID).
//   2. "Anthropic API Key" header-auth credential (header name x-api-key) on the Claude node.
//   3. "HCTI" basic-auth credential on the Render Image node (user id + api key from htmlcsstoimage.com),
//      or point that node at your own HTML-to-image endpoint.
//   4. Slack incoming webhook URL on the Notify Reviewer node, or delete that node.

const fs = require("fs");
const path = require("path");

const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, "prompts", "caption-system-prompt.md"), "utf8");
const TEMPLATES = {};
for (const name of ["announcement", "tip", "quote", "carousel"]) {
  TEMPLATES[name] = fs.readFileSync(path.join(__dirname, "templates", `${name}.html`), "utf8");
}

// Everything a client needs. In the SaaS version this comes from the brand_kits table.
const BRAND_KIT = {
  brand_name: "Upgrowth",
  handle: "@upgrowth.io",
  logo_url: "",
  primary: "#0F172A",
  secondary: "#1E3A8A",
  accent: "#38BDF8",
  ink: "#FFFFFF",
  font: "Inter",
  footer: "upgrowth.io",
  tone: "confident, plain",
  audience: "small agency owners and freelance marketers",
  industry: "SEO and marketing tools",
  banned_words: ["revolutionary", "game-changer", "unlock"],
  cta_default: "Try it free",
};

// Shared helpers pasted into both Code nodes. Kept as a string so the workflow has no external dependency.
const FILL_HELPERS = `
const EYEBROW_BY_TEMPLATE = { announcement: "New", tip: "Quick tip", quote: "", carousel: "Swipe" };
function escapeHtml(v) {
  return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function render(html, values) {
  return html.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => key.endsWith("_html") ? (values[key] ?? "") : escapeHtml(values[key]));
}
function baseValues(brand) {
  const logoHtml = brand.logo_url
    ? '<img src="' + escapeHtml(brand.logo_url) + '" alt="">'
    : '<span>' + escapeHtml(brand.brand_name.slice(0, 1)) + '</span>';
  return { ...brand, logo_html: logoHtml };
}
function fillPost(templates, templateName, brand, copy) {
  const base = baseValues(brand);
  const eyebrow = EYEBROW_BY_TEMPLATE[templateName] ?? "";
  if (templateName !== "carousel") {
    const html = templates[templateName];
    if (!html) throw new Error("Unknown template: " + templateName);
    return [render(html, { ...base, eyebrow, headline: copy.headline, body: copy.body, cta: copy.cta })];
  }
  const slides = Array.isArray(copy.slides) ? copy.slides.filter(Boolean) : [];
  if (slides.length < 2) throw new Error("Carousel needs at least 2 slides");
  const cover = render(templates.announcement, { ...base, eyebrow, headline: copy.headline, body: copy.body, cta: copy.cta });
  const inner = slides.map((text, i) => {
    const dotsHtml = slides.map((_, j) => '<i' + (j === i ? ' class="on"' : '') + '></i>').join("");
    return render(templates.carousel, { ...base, slide_index: i + 1, slide_total: slides.length, slide_text: text, dots_html: dotsHtml });
  });
  return [cover, ...inner];
}
`;

const BUILD_REQUEST_CODE = `
const SYSTEM_PROMPT = ${JSON.stringify(SYSTEM_PROMPT)};
const BRAND_KIT = ${JSON.stringify(BRAND_KIT)};

const row = $input.first().json;
const platform = String(row.platform || "instagram").trim().toLowerCase();
const template = String(row.template || "announcement").trim().toLowerCase();

const userMessage = {
  brand: {
    name: BRAND_KIT.brand_name,
    handle: BRAND_KIT.handle,
    tone: BRAND_KIT.tone,
    audience: BRAND_KIT.audience,
    industry: BRAND_KIT.industry,
    banned_words: BRAND_KIT.banned_words,
    cta_default: BRAND_KIT.cta_default,
  },
  platform,
  template,
  row: {
    id: row.id,
    title: row.title || "",
    context: row.context || "",
    image_url: row.image_url || "",
    scheduled_at: row.scheduled_at || "",
  },
};

return [{
  json: {
    row, platform, template,
    body: {
      model: "claude-opus-5",
      max_tokens: 4096,
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: JSON.stringify(userMessage, null, 2) }],
    },
  },
}];
`;

const PARSE_VALIDATE_CODE = `
const TEMPLATES = ${JSON.stringify(TEMPLATES)};
const BRAND_KIT = ${JSON.stringify(BRAND_KIT)};
${FILL_HELPERS}

const resp = $input.first().json;
const prev = $("Build LLM Request").first().json;
const errors = [];
let copy = null;

if (resp.stop_reason === "refusal") {
  errors.push("Model declined the request: " + ((resp.stop_details && resp.stop_details.explanation) || "no reason given"));
} else {
  const text = (resp.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
  const cleaned = text.replace(/^\\s*\`\`\`(?:json)?\\s*/i, "").replace(/\\s*\`\`\`\\s*$/, "");
  try { copy = JSON.parse(cleaned); } catch (e) { errors.push("Response was not valid JSON"); }
}

const words = s => String(s || "").trim().split(/\\s+/).filter(Boolean).length;

if (copy) {
  const maxHeadlineWords = prev.template === "quote" ? 12 : 8;
  if (words(copy.headline) > maxHeadlineWords) errors.push("headline over " + maxHeadlineWords + " words");
  if (String(copy.body || "").length > 90) errors.push("body over 90 characters");
  if (words(copy.cta) > 4) errors.push("cta over 4 words");
  if (!Array.isArray(copy.hashtags) || copy.hashtags.length < 3 || copy.hashtags.length > 5) errors.push("need 3 to 5 hashtags");
  if (prev.template === "carousel") {
    const n = Array.isArray(copy.slides) ? copy.slides.length : 0;
    if (n < 3 || n > 6) errors.push("carousel needs 3 to 6 slides");
    if ((copy.slides || []).some(s => String(s).length > 70)) errors.push("a slide is over 70 characters");
  }
  if (typeof copy.confidence === "number" && copy.confidence < 0.5) errors.push("low confidence: " + copy.confidence);
}

let pages = [];
if (copy && errors.length === 0) {
  try { pages = fillPost(TEMPLATES, prev.template, BRAND_KIT, copy); } catch (e) { errors.push(e.message); }
}

return [{
  json: {
    row: prev.row,
    platform: prev.platform,
    template: prev.template,
    copy,
    pages,
    valid: errors.length === 0,
    errors,
  },
}];
`;

const SHEET = {
  documentId: { __rl: true, mode: "id", value: "YOUR_SHEET_ID" },
  sheetName: { __rl: true, mode: "name", value: "Posts" },
};

const SHEET_COLUMNS = ["id", "image_url", "caption", "hashtags", "alt_text", "status", "notes"];
const schema = SHEET_COLUMNS.map(id => ({
  id, displayName: id, required: false, defaultMatch: false, display: true, type: "string", canBeUsedToMatch: true,
}));

function sheetsUpdate(name, position, values) {
  return {
    parameters: {
      operation: "update",
      ...SHEET,
      columns: { mappingMode: "defineBelow", value: values, matchingColumns: ["id"], schema },
      options: {},
    },
    name,
    type: "n8n-nodes-base.googleSheets",
    typeVersion: 4.5,
    position,
  };
}

const nodes = [
  {
    parameters: { rule: { interval: [{ field: "minutes", minutesInterval: 15 }] } },
    name: "Every 15 Minutes",
    type: "n8n-nodes-base.scheduleTrigger",
    typeVersion: 1.2,
    position: [0, 300],
  },
  {
    parameters: { resource: "sheet", operation: "read", ...SHEET, options: {} },
    name: "Read Posts Sheet",
    type: "n8n-nodes-base.googleSheets",
    typeVersion: 4.5,
    position: [220, 300],
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: false, leftValue: "", typeValidation: "loose" },
        conditions: [
          { id: "c1", leftValue: "={{ $json.status || '' }}", rightValue: "draft", operator: { type: "string", operation: "equals" } },
          { id: "c2", leftValue: "={{ $json.status || '' }}", rightValue: "", operator: { type: "string", operation: "empty", singleValue: true } },
        ],
        combinator: "or",
      },
      options: {},
    },
    name: "Only Draft Rows",
    type: "n8n-nodes-base.filter",
    typeVersion: 2,
    position: [440, 300],
  },
  {
    parameters: { batchSize: 1, options: {} },
    name: "Loop Over Rows",
    type: "n8n-nodes-base.splitInBatches",
    typeVersion: 3,
    position: [660, 300],
  },
  {
    parameters: { jsCode: BUILD_REQUEST_CODE.trim() },
    name: "Build LLM Request",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [900, 400],
  },
  {
    parameters: {
      method: "POST",
      url: "https://api.anthropic.com/v1/messages",
      authentication: "genericCredentialType",
      genericAuthType: "httpHeaderAuth",
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: "anthropic-version", value: "2023-06-01" },
          { name: "anthropic-beta", value: "server-side-fallback-2026-07-01" },
        ],
      },
      sendBody: true,
      specifyBody: "json",
      jsonBody: "={{ JSON.stringify($json.body) }}",
      options: { timeout: 120000 },
    },
    name: "Claude Write Copy",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [1120, 400],
  },
  {
    parameters: { jsCode: PARSE_VALIDATE_CODE.trim() },
    name: "Parse and Validate Copy",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [1340, 400],
  },
  {
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "loose" },
        conditions: [
          { id: "v1", leftValue: "={{ $json.valid }}", rightValue: "", operator: { type: "boolean", operation: "true", singleValue: true } },
        ],
        combinator: "and",
      },
      options: {},
    },
    name: "Copy Valid?",
    type: "n8n-nodes-base.if",
    typeVersion: 2,
    position: [1560, 400],
  },
  sheetsUpdate("Mark Needs Review", [1800, 600], {
    id: "={{ $json.row.id }}",
    status: "needs_review",
    notes: "={{ $json.errors.join('; ') }}",
  }),
  {
    parameters: { fieldToSplitOut: "pages", include: "noOtherFields", options: { destinationFieldName: "html" } },
    name: "One Item Per Page",
    type: "n8n-nodes-base.splitOut",
    typeVersion: 1,
    position: [1800, 300],
  },
  {
    parameters: {
      method: "POST",
      url: "https://hcti.io/v1/image",
      authentication: "genericCredentialType",
      genericAuthType: "httpBasicAuth",
      sendBody: true,
      specifyBody: "json",
      jsonBody: "={{ JSON.stringify({ html: $json.html, viewport_width: 1080, viewport_height: 1080, device_scale: 1, google_fonts: 'Inter' }) }}",
      options: { timeout: 60000 },
    },
    name: "Render Image",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [2020, 300],
  },
  {
    parameters: { aggregate: "individualFields", fieldsToAggregate: { fieldToAggregate: [{ fieldToAggregate: "url" }] }, options: {} },
    name: "Collect Image URLs",
    type: "n8n-nodes-base.aggregate",
    typeVersion: 1,
    position: [2240, 300],
  },
  sheetsUpdate("Write Back Row", [2460, 300], {
    id: "={{ $('Parse and Validate Copy').first().json.row.id }}",
    image_url: "={{ ($json.url || []).join(',') }}",
    caption: "={{ $('Parse and Validate Copy').first().json.copy.caption }}",
    hashtags: "={{ ($('Parse and Validate Copy').first().json.copy.hashtags || []).join(' ') }}",
    alt_text: "={{ $('Parse and Validate Copy').first().json.copy.alt_text }}",
    status: "rendered",
    notes: "={{ $('Parse and Validate Copy').first().json.copy.notes || '' }}",
  }),
  {
    parameters: {
      method: "POST",
      url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
      sendBody: true,
      specifyBody: "json",
      jsonBody: "={{ JSON.stringify({ text: 'Ready for review: ' + $('Parse and Validate Copy').first().json.row.title + '\\n' + ($('Collect Image URLs').first().json.url || []).join('\\n') + '\\n\\n' + $('Parse and Validate Copy').first().json.copy.caption }) }}",
      options: {},
    },
    name: "Notify Reviewer",
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [2680, 300],
  },
];

const connections = {
  "Every 15 Minutes": { main: [[{ node: "Read Posts Sheet", type: "main", index: 0 }]] },
  "Read Posts Sheet": { main: [[{ node: "Only Draft Rows", type: "main", index: 0 }]] },
  "Only Draft Rows": { main: [[{ node: "Loop Over Rows", type: "main", index: 0 }]] },
  // Output 0 of the loop is "done", output 1 is the per-item branch.
  "Loop Over Rows": { main: [[], [{ node: "Build LLM Request", type: "main", index: 0 }]] },
  "Build LLM Request": { main: [[{ node: "Claude Write Copy", type: "main", index: 0 }]] },
  "Claude Write Copy": { main: [[{ node: "Parse and Validate Copy", type: "main", index: 0 }]] },
  "Parse and Validate Copy": { main: [[{ node: "Copy Valid?", type: "main", index: 0 }]] },
  "Copy Valid?": {
    main: [
      [{ node: "One Item Per Page", type: "main", index: 0 }],
      [{ node: "Mark Needs Review", type: "main", index: 0 }],
    ],
  },
  "Mark Needs Review": { main: [[{ node: "Loop Over Rows", type: "main", index: 0 }]] },
  "One Item Per Page": { main: [[{ node: "Render Image", type: "main", index: 0 }]] },
  "Render Image": { main: [[{ node: "Collect Image URLs", type: "main", index: 0 }]] },
  "Collect Image URLs": { main: [[{ node: "Write Back Row", type: "main", index: 0 }]] },
  "Write Back Row": { main: [[{ node: "Notify Reviewer", type: "main", index: 0 }]] },
  "Notify Reviewer": { main: [[{ node: "Loop Over Rows", type: "main", index: 0 }]] },
};

const workflow = {
  name: "Social Scheduler - Render",
  nodes,
  connections,
  settings: { executionOrder: "v1" },
};

const outDir = path.join(__dirname, "n8n");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "render-workflow.json");
fs.writeFileSync(outFile, JSON.stringify(workflow, null, 2), "utf8");
console.log(outFile);
