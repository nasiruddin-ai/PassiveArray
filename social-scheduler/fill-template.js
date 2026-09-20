// Fills a template with brand kit values and LLM output.
//
// Local test:
//   node fill-template.js announcement prompts/example-output.json out
//   node fill-template.js carousel prompts/example-output-carousel.json out
// Writes one HTML file per image into the out directory (a carousel produces cover + one file per slide).
//
// In n8n, paste fillPost() and its helpers into a Code node and pass the template strings from previous nodes.

const fs = require("fs");
const path = require("path");

const BRAND_KIT = {
  brand_name: "Upgrowth",
  handle: "@upgrowth.io",
  logo_url: "",                 // leave empty to fall back to the first letter of the brand name
  primary: "#0F172A",
  secondary: "#1E3A8A",
  accent: "#38BDF8",
  ink: "#FFFFFF",
  font: "Inter",
  footer: "upgrowth.io",
};

const EYEBROW_BY_TEMPLATE = {
  announcement: "New",
  tip: "Quick tip",
  quote: "",
  carousel: "Swipe",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function render(templateHtml, values) {
  return templateHtml.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key.endsWith("_html")) return values[key] ?? ""; // already safe HTML
    return escapeHtml(values[key]);
  });
}

function baseValues(brand) {
  const logoHtml = brand.logo_url
    ? `<img src="${escapeHtml(brand.logo_url)}" alt="">`
    : `<span>${escapeHtml(brand.brand_name.slice(0, 1))}</span>`;
  return { ...brand, logo_html: logoHtml };
}

// Returns an array of HTML strings, one per image to render.
// templates: { announcement, tip, quote, carousel } as HTML strings.
function fillPost(templates, templateName, brand, copy) {
  const base = baseValues(brand);
  const eyebrow = EYEBROW_BY_TEMPLATE[templateName] ?? "";

  if (templateName !== "carousel") {
    const html = templates[templateName];
    if (!html) throw new Error(`Unknown template: ${templateName}`);
    return [render(html, { ...base, eyebrow, headline: copy.headline, body: copy.body, cta: copy.cta })];
  }

  // Carousel: cover uses the announcement layout, then one inner slide per entry in copy.slides.
  const slides = Array.isArray(copy.slides) ? copy.slides.filter(Boolean) : [];
  if (slides.length < 2) throw new Error("Carousel needs at least 2 slides");
  const total = slides.length;

  const cover = render(templates.announcement, {
    ...base, eyebrow, headline: copy.headline, body: copy.body, cta: copy.cta,
  });

  const inner = slides.map((text, i) => {
    const index = i + 1;
    const dotsHtml = slides.map((_, j) => `<i${j === i ? ' class="on"' : ""}></i>`).join("");
    return render(templates.carousel, {
      ...base, slide_index: index, slide_total: total, slide_text: text, dots_html: dotsHtml,
    });
  });

  return [cover, ...inner];
}

// Local test entry point. n8n ignores this block.
if (require.main === module) {
  const [templateName = "announcement", copyPath = "prompts/example-output.json", outDir = "out"] = process.argv.slice(2);
  const templatesDir = path.join(__dirname, "templates");
  const templates = {};
  for (const name of ["announcement", "tip", "quote", "carousel"]) {
    templates[name] = fs.readFileSync(path.join(templatesDir, `${name}.html`), "utf8");
  }
  const copy = JSON.parse(fs.readFileSync(path.join(__dirname, copyPath), "utf8"));
  const pages = fillPost(templates, templateName, BRAND_KIT, copy);

  const dest = path.resolve(__dirname, outDir);
  fs.mkdirSync(dest, { recursive: true });
  pages.forEach((html, i) => {
    const file = path.join(dest, `${templateName}-${i + 1}.html`);
    fs.writeFileSync(file, html, "utf8");
    console.log(file);
  });
}

module.exports = { fillPost, render, escapeHtml };
