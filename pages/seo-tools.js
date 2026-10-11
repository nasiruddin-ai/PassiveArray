// Three SEO web tools built on the site's own design system (fast, same header and footer):
//   /serp-snippet-preview/     browser only
//   /meta-tag-checker/         /api/meta (lib/api-meta.js through api/pro.js)
//   /schema-markup-generator/  browser only
// Logic lives in creator-tools/public/seo-tools.js. Guides come from guides-web/<slug>.js.

const fs = require("fs");
const path = require("path");
const site = require("../creator-tools/build-tools.js");
const { esc, SITE } = site;

const TOOLS = {
  "serp-snippet-preview": {
    name: "SERP Snippet Preview",
    lead: "See how your title and meta description look in Google on desktop and mobile, measured in pixels the way Google cuts them.",
    meta: ["BROWSER ONLY", "nothing you type is sent anywhere"],
    body: `
    <form class="card inputcard seo-form" data-seo="serp" novalidate>
      <label for="sp-url">Page URL</label>
      <div class="seo-row"><input id="sp-url" name="url" type="text" placeholder="https://example.com/blog/your-page/" autocomplete="off"><button type="button" class="btn ghost" data-fetch>Fetch from URL</button></div>
      <label for="sp-title">Title</label>
      <input id="sp-title" name="title" type="text" placeholder="Your page title, around 50 to 60 characters" autocomplete="off">
      <div class="seo-meter" data-meter="title"></div>
      <label for="sp-desc">Meta description</label>
      <textarea id="sp-desc" name="desc" rows="3" placeholder="A one or two sentence summary that makes people want to click, around 120 to 160 characters"></textarea>
      <div class="seo-meter" data-meter="desc"></div>
      <label for="sp-kw">Focus keyword <span class="muted">(optional, shown in bold like Google does)</span></label>
      <input id="sp-kw" name="kw" type="text" placeholder="e.g. youtube money calculator" autocomplete="off">
      <span class="fmsg" data-msg></span>
    </form>
    <div class="seo-previews">
      <section class="card"><h2 class="seo-h">Desktop result</h2><div class="serp serp-desktop" data-serp="desktop"></div></section>
      <section class="card"><h2 class="seo-h">Mobile result</h2><div class="serp serp-mobile" data-serp="mobile"></div></section>
    </div>
    <section class="card"><h2 class="seo-h">Checks</h2><ul class="seo-checks" data-checks></ul></section>`,
  },
  "meta-tag-checker": {
    name: "Meta Tag Checker",
    lead: "Paste any page URL and check its title, description, robots, canonical, headings, Open Graph, structured data and more, each with a plain fix.",
    meta: ["LIVE", "fetched from the page right now"],
    body: `
    <form class="card inputcard seo-form" data-seo="meta" novalidate>
      <label for="mt-url">Page URL</label>
      <div class="seo-row"><input id="mt-url" name="url" type="text" placeholder="https://example.com/page/" autocomplete="off" required><button type="submit" class="btn">Check page</button></div>
      <span class="fmsg" data-msg></span>
    </form>
    <div data-result></div>`,
  },
  "schema-markup-generator": {
    name: "Schema Markup Generator",
    lead: "Build valid JSON-LD structured data for FAQs, local businesses, articles, products, organisations, people and breadcrumbs, ready to paste.",
    meta: ["BROWSER ONLY", "nothing you type is sent anywhere"],
    body: `
    <div class="card inputcard seo-form" data-seo="schema">
      <label for="sg-type">Schema type</label>
      <select id="sg-type" data-type>
        <option value="FAQPage">FAQ page</option>
        <option value="LocalBusiness">Local business</option>
        <option value="Article">Article or blog post</option>
        <option value="Product">Product</option>
        <option value="Organization">Organization</option>
        <option value="Person">Person</option>
        <option value="BreadcrumbList">Breadcrumb list</option>
      </select>
      <div class="sg-fields" data-fields></div>
      <span class="fmsg" data-missing></span>
    </div>
    <section class="card">
      <div class="seo-head-row"><h2 class="seo-h">Your JSON-LD</h2><div class="seo-actions"><button type="button" class="btn" data-copy>Copy code</button><a class="btn ghost" href="https://search.google.com/test/rich-results" target="_blank" rel="noopener">Rich Results Test</a></div></div>
      <pre class="sg-out" data-out></pre>
      <p class="note">Paste it inside the &lt;head&gt; or anywhere in the &lt;body&gt; of the page it describes. The markup must match what visitors can see on that page.</p>
    </section>`,
  },
};

const CSS = `<style>
.seo-form label{display:block;font-weight:600;font-size:.9rem;margin:14px 0 6px}
.seo-form label:first-child{margin-top:0}
.seo-form input,.seo-form textarea,.seo-form select{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;background:var(--bg);color:var(--text);font:inherit;padding:11px 14px}
.seo-form textarea{resize:vertical}
.seo-row{display:flex;gap:8px}.seo-row input{flex:1;min-width:0}.seo-row .btn{flex:none;height:auto}
.seo-meter{display:flex;align-items:center;gap:10px;margin-top:6px;font-size:.8rem;color:var(--muted)}
.seo-meter .bar{flex:1;height:6px;border-radius:999px;background:var(--soft);overflow:hidden}
.seo-meter .bar i{display:block;height:100%;border-radius:999px;background:var(--teal)}
.seo-meter.warn .bar i{background:#D9A23A}.seo-meter.bad .bar i{background:var(--bad)}
.seo-previews{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:16px;margin-top:16px}
.seo-h{font-size:1.05rem;margin-bottom:12px}
.serp{background:#fff;color:#202124;border-radius:12px;padding:16px;font-family:Arial,sans-serif;border:1px solid #dadce0}
.serp .crumb{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.serp .fav{width:26px;height:26px;border-radius:50%;background:#f1f3f4;display:flex;align-items:center;justify-content:center;font-size:12px;color:#5f6368;flex:none}
.serp .site{font-size:14px;color:#202124;line-height:1.2}.serp .path{font-size:12px;color:#4d5156;line-height:1.3;word-break:break-all}
.serp .t{font-size:20px;line-height:1.3;color:#1a0dab;margin:4px 0 4px}
.serp .d{font-size:14px;line-height:1.58;color:#4d5156}
.serp .d b{color:#5f6368}
.serp-mobile{max-width:380px}.serp-mobile .t{font-size:18px}
.seo-checks{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.seo-checks li{display:flex;gap:10px;align-items:flex-start;font-size:.92rem}
.seo-checks li i{flex:none;width:10px;height:10px;border-radius:50%;margin-top:6px}
.seo-checks .pass i{background:var(--good)}.seo-checks .warn i{background:#D9A23A}.seo-checks .fail i{background:var(--bad)}.seo-checks .info i{background:var(--muted)}
.mt-summary{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}
.mt-summary span{padding:8px 14px;border-radius:999px;font-weight:600;font-size:.88rem;background:var(--soft)}
.mt-summary .pass{color:var(--good)}.mt-summary .warn{color:#B7791F}.mt-summary .fail{color:var(--bad)}
:root[data-theme="dark"] .mt-summary .warn{color:#F0C36D}
.mt-group{margin-top:16px}.mt-group h3{font-size:1rem;margin-bottom:10px}
.mt-row.pass,.mt-row.warn,.mt-row.fail,.mt-row.info{color:var(--text)}
.mt-row{display:grid;grid-template-columns:20px 170px minmax(0,1fr);gap:10px;padding:10px 0;border-top:1px solid var(--line);font-size:.92rem}
.mt-row i{width:10px;height:10px;border-radius:50%;margin-top:6px}
.mt-row.pass i{background:var(--good)}.mt-row.warn i{background:#D9A23A}.mt-row.fail i{background:var(--bad)}.mt-row.info i{background:var(--muted)}
.mt-row .v{word-break:break-word}.mt-row .fix{color:var(--muted);font-size:.85rem;margin-top:3px}
.mt-chain{font-size:.85rem;color:var(--muted);word-break:break-all}
.sg-fields{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}
.sg-fields .full{grid-column:1/-1}
.sg-fields .req::after{content:" *";color:var(--bad)}
.sg-rep{grid-column:1/-1;border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-top:14px}
.sg-rep .rm{float:right;background:none;border:0;color:var(--muted);cursor:pointer;font-size:.85rem}
.sg-add{margin-top:12px}
.seo-head-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.seo-head-row .seo-h{margin:0}.seo-actions{display:flex;gap:8px;flex-wrap:wrap}
.sg-out{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:16px;font:13px/1.5 ui-monospace,Consolas,monospace;white-space:pre-wrap;word-break:break-word;max-height:520px;overflow:auto;color:var(--text)}
@media(max-width:860px){.seo-previews,.sg-fields{grid-template-columns:1fr}.mt-row{grid-template-columns:20px minmax(0,1fr)}.mt-row .n{grid-column:2}.mt-row .v{grid-column:2}}
@media(max-width:560px){.seo-row{flex-direction:column}}
</style>`;

function page(slug) {
  const t = TOOLS[slug];
  const gFile = path.join(__dirname, "..", "guides-web", slug + ".js");
  const g = fs.existsSync(gFile) ? require(gFile) : null;
  const others = Object.entries(TOOLS).filter(([s]) => s !== slug).map(([s, o]) => `<a href="../${s}/">${esc(o.name)}</a>`);
  const body = `${CSS}
  <div class="tool-head">
    <div>
      <div class="crumbs"><a href="../">Home</a> / <a href="../#web-tools">Web tools</a> / ${esc(t.name)}</div>
      <div class="h1row"><h1>${esc(t.name)}</h1><span class="badge X">SEO</span></div>
      <p class="intro">${esc(t.lead)}</p>
    </div>
    <div class="siblings">${others.join("")}</div>
  </div>
  ${t.body}
  ${g ? site.guideHtml(g) : ""}
  <section class="card related-posts"><h2>More free SEO tools</h2><div class="rp-list">${others.join("")}<a href="../domain-age-checker/">Domain Age Checker</a><a href="../research/">YouTube Keyword Research</a></div></section>`;
  const app = { "@context": "https://schema.org", "@type": "WebApplication", name: t.name, url: SITE + "/" + slug + "/", description: (g && g.seoDescription) || t.lead, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: { "@type": "Organization", name: site.BRAND, url: SITE } };
  return site.shell({
    title: g && g.seoTitle ? g.seoTitle.replace(/ \| Passive Array$/, "") : t.name,
    ogTitle: (g && g.seoTitle) || t.name,
    description: (g && g.seoDescription) || t.lead,
    path: "/" + slug + "/",
    active: "tools",
    body,
    scripts: `<script src="../creator-tools/seo-tools.js"></script>`,
    jsonld: g && g.faq && g.faq.length ? [app, site.faqLd(g.faq)] : app,
  });
}

function buildInto(dist) {
  for (const slug of Object.keys(TOOLS)) {
    fs.mkdirSync(path.join(dist, slug), { recursive: true });
    fs.writeFileSync(path.join(dist, slug, "index.html"), page(slug));
  }
  return Object.keys(TOOLS).map((s) => "/" + s + "/");
}

module.exports = { buildInto, TOOLS };
