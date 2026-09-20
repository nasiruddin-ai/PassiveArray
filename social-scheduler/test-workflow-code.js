// Runs the two Code-node scripts embedded in n8n/render-workflow.json outside n8n,
// with stubbed $input / $() helpers, to catch syntax and logic errors before import.
// Usage: node test-workflow-code.js

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const wf = JSON.parse(fs.readFileSync(path.join(__dirname, "n8n", "render-workflow.json"), "utf8"));
const code = name => wf.nodes.find(n => n.name === name).parameters.jsCode;

function runNode(js, inputItem, nodeOutputs = {}) {
  const sandbox = {
    $input: { first: () => ({ json: inputItem }), all: () => [{ json: inputItem }] },
    $: name => ({ first: () => ({ json: nodeOutputs[name] }) }),
    console,
  };
  const fn = vm.runInNewContext(`(function () { ${js} })`, sandbox);
  return fn();
}

const cases = [
  ["announcement", "example-output.json"],
  ["tip", "example-output-tip.json"],
  ["quote", "example-output-quote.json"],
  ["carousel", "example-output-carousel.json"],
];

let failed = 0;
for (const [template, file] of cases) {
  const row = { id: "row-1", title: "SEO ROI calculator is live", context: "New free calculator.", platform: "instagram", template, status: "draft" };
  const built = runNode(code("Build LLM Request"), row)[0].json;

  const copy = JSON.parse(fs.readFileSync(path.join(__dirname, "prompts", file), "utf8"));
  const claudeResponse = { stop_reason: "end_turn", content: [{ type: "text", text: "```json\n" + JSON.stringify(copy) + "\n```" }] };
  const parsed = runNode(code("Parse and Validate Copy"), claudeResponse, { "Build LLM Request": built })[0].json;

  const expectedPages = template === "carousel" ? copy.slides.length + 1 : 1;
  const ok = parsed.valid && parsed.pages.length === expectedPages && built.body.system.length > 500 && built.body.model === "claude-opus-5";
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${template}: valid=${parsed.valid} pages=${parsed.pages.length} errors=${JSON.stringify(parsed.errors)}`);
}

// Negative case: an over-long headline must be rejected, not rendered.
{
  const row = { id: "row-2", title: "x", context: "y", platform: "x", template: "announcement" };
  const built = runNode(code("Build LLM Request"), row)[0].json;
  const bad = { headline: "one two three four five six seven eight nine ten", body: "", cta: "Go", caption: "c", hashtags: ["#a", "#b", "#c"], slides: [], alt_text: "", confidence: 0.9, notes: "" };
  const parsed = runNode(code("Parse and Validate Copy"), { stop_reason: "end_turn", content: [{ type: "text", text: JSON.stringify(bad) }] }, { "Build LLM Request": built })[0].json;
  const ok = !parsed.valid && parsed.pages.length === 0;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} rejects long headline: errors=${JSON.stringify(parsed.errors)}`);
}

// Refusal case: must route to review, not crash.
{
  const row = { id: "row-3", title: "x", context: "y", platform: "x", template: "tip" };
  const built = runNode(code("Build LLM Request"), row)[0].json;
  const parsed = runNode(code("Parse and Validate Copy"), { stop_reason: "refusal", stop_details: { type: "refusal", explanation: "policy" }, content: [] }, { "Build LLM Request": built })[0].json;
  const ok = !parsed.valid && parsed.errors[0].startsWith("Model declined");
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} handles refusal: errors=${JSON.stringify(parsed.errors)}`);
}

process.exit(failed ? 1 : 0);
