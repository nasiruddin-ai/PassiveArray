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
  "robots-txt-generator": {
    name: "Robots.txt Generator & Tester",
    lead: "Build a valid robots.txt file for Googlebot and AI crawlers, add Allow/Disallow rules and Sitemap URLs, and test any URL path before you publish.",
    meta: ["BROWSER ONLY", "nothing you type is sent anywhere"],
    body: `
    <div class="card inputcard seo-form" data-seo="robots">
      <div class="seo-head-row" style="margin-bottom:8px"><b>Quick presets</b><span class="muted" style="font-size:.82rem">Click to load a template</span></div>
      <div class="seo-chips" data-presets>
        <button type="button" class="seo-chip" data-preset="standard">Standard Site</button>
        <button type="button" class="seo-chip" data-preset="wordpress">WordPress</button>
        <button type="button" class="seo-chip" data-preset="nextjs">Next.js / Vercel</button>
        <button type="button" class="seo-chip" data-preset="shopify">Shopify</button>
        <button type="button" class="seo-chip" data-preset="block-ai">Block AI Crawlers</button>
      </div>
      <div data-blocks></div>
      <button type="button" class="btn ghost sg-add" data-add-block>+ Add User-agent block</button>
      <label for="rt-sitemaps">Sitemap URLs <span class="muted">(one per line)</span></label>
      <textarea id="rt-sitemaps" data-sitemaps rows="2" placeholder="https://example.com/sitemap.xml"></textarea>
    </div>
    <section class="card" style="margin-top:16px">
      <h2 class="seo-h">Live URL Path Tester</h2>
      <div class="seo-row">
        <input type="text" data-test-path value="/wp-admin/" placeholder="/blog/my-post/ or https://example.com/admin/" aria-label="URL or path to test">
        <input type="text" data-test-ua value="Googlebot" placeholder="User-agent (e.g. Googlebot)" style="max-width:200px" aria-label="User-agent to test">
      </div>
      <div class="seo-verdict" data-test-result></div>
    </section>
    <section class="card" style="margin-top:16px">
      <div class="seo-head-row"><h2 class="seo-h">Generated robots.txt</h2><div class="seo-actions"><button type="button" class="btn" data-copy>Copy code</button><button type="button" class="btn ghost" data-download>Download robots.txt</button></div></div>
      <pre class="sg-out" data-out></pre>
      <p class="note">Upload this file to the root of your domain (<code>https://yourdomain.com/robots.txt</code>).</p>
    </section>`,
  },
  "xml-sitemap-generator": {
    name: "XML Sitemap Generator & Validator",
    lead: "Paste your page URLs to build a clean, Google-ready sitemap.xml with lastmod, changefreq and priority, and catch broken or duplicate URLs.",
    meta: ["BROWSER ONLY", "nothing you type is sent anywhere"],
    body: `
    <div class="card inputcard seo-form" data-seo="sitemap">
      <label for="sm-urls">Page URLs <span class="muted">(one full https:// URL per line)</span></label>
      <textarea id="sm-urls" data-urls rows="7" placeholder="https://example.com/\nhttps://example.com/about/\nhttps://example.com/blog/">https://example.com/
https://example.com/pricing/
https://example.com/blog/
https://example.com/contact/</textarea>
      <div class="sg-fields">
        <div>
          <label for="sm-mod">Last modified (lastmod)</label>
          <select id="sm-mod" data-lastmod>
            <option value="today">Today's date</option>
            <option value="none">Omit &lt;lastmod&gt;</option>
          </select>
        </div>
        <div>
          <label for="sm-freq">Change frequency</label>
          <select id="sm-freq" data-freq>
            <option value="weekly">weekly</option>
            <option value="daily">daily</option>
            <option value="monthly">monthly</option>
            <option value="yearly">yearly</option>
            <option value="none">Omit &lt;changefreq&gt;</option>
          </select>
        </div>
        <div>
          <label for="sm-prio">Default priority</label>
          <select id="sm-prio" data-prio>
            <option value="auto">Auto (1.0 for homepage, 0.8 for others)</option>
            <option value="0.8">0.8</option>
            <option value="0.5">0.5</option>
            <option value="none">Omit &lt;priority&gt;</option>
          </select>
        </div>
        <div style="display:flex;align-items:flex-end">
          <button type="button" class="btn ghost" data-dedupe style="width:100%">Remove duplicates &amp; sort</button>
        </div>
      </div>
      <div class="seo-stats" data-stats></div>
    </div>
    <section class="card" style="margin-top:16px">
      <h2 class="seo-h">Validation checks</h2>
      <ul class="seo-checks" data-checks></ul>
    </section>
    <section class="card" style="margin-top:16px">
      <div class="seo-head-row"><h2 class="seo-h">Generated sitemap.xml</h2><div class="seo-actions"><button type="button" class="btn" data-copy>Copy XML</button><button type="button" class="btn ghost" data-download>Download sitemap.xml</button></div></div>
      <pre class="sg-out" data-out></pre>
      <p class="note">Submit <code>https://yourdomain.com/sitemap.xml</code> in Google Search Console and reference it in your <code>robots.txt</code>.</p>
    </section>`,
  },
  "hreflang-tag-generator": {
    name: "Hreflang & Canonical Tag Generator",
    lead: "Generate valid HTML hreflang alternate tags, self-referencing canonical links, and XML sitemap xhtml:link blocks for multilingual and global websites.",
    meta: ["BROWSER ONLY", "nothing you type is sent anywhere"],
    body: `
    <div class="card inputcard seo-form" data-seo="hreflang">
      <div class="sg-fields">
        <div class="full">
          <label for="hl-canon">Canonical URL for this page <span class="muted">(optional, recommended self-referencing)</span></label>
          <input id="hl-canon" type="text" data-canon value="https://example.com/" placeholder="https://example.com/en/page/">
        </div>
      </div>
      <div data-hl-rows></div>
      <button type="button" class="btn ghost sg-add" data-add-hl>+ Add language / region URL</button>
      <div class="seo-chips" style="margin-top:16px;margin-bottom:0" data-hl-fmt>
        <button type="button" class="seo-chip active" data-fmt="html">HTML &lt;head&gt; Tags</button>
        <button type="button" class="seo-chip" data-fmt="xml">XML Sitemap Tags</button>
      </div>
    </div>
    <section class="card" style="margin-top:16px">
      <h2 class="seo-h">Validation checks</h2>
      <ul class="seo-checks" data-checks></ul>
    </section>
    <section class="card" style="margin-top:16px">
      <div class="seo-head-row"><h2 class="seo-h">Generated Tags</h2><div class="seo-actions"><button type="button" class="btn" data-copy>Copy code</button></div></div>
      <pre class="sg-out" data-out></pre>
      <p class="note">Remember: hreflang tags must be bidirectional (every translated page must link back to all other versions, including itself).</p>
    </section>`,
  },
  "redirect-generator": {
    name: "301 Redirect Rule Generator",
    lead: "Convert a list of old and new URLs into ready-to-deploy 301 or 302 redirect rules for Vercel (vercel.json), Apache (.htaccess), Netlify, and Nginx.",
    meta: ["BROWSER ONLY", "nothing you type is sent anywhere"],
    body: `
    <div class="card inputcard seo-form" data-seo="redirect">
      <div class="seo-head-row" style="margin-bottom:8px"><b>Target server / platform</b></div>
      <div class="seo-chips" data-plat-chips>
        <button type="button" class="seo-chip active" data-plat="vercel">Vercel (vercel.json)</button>
        <button type="button" class="seo-chip" data-plat="htaccess">Apache (.htaccess)</button>
        <button type="button" class="seo-chip" data-plat="netlify">Netlify (_redirects)</button>
        <button type="button" class="seo-chip" data-plat="nginx">Nginx</button>
      </div>
      <div class="sg-fields">
        <div>
          <label for="rd-code">Redirect type</label>
          <select id="rd-code" data-code>
            <option value="301">301 Permanent (recommended for SEO)</option>
            <option value="302">302 Temporary</option>
          </select>
        </div>
        <div>
          <label for="rd-sep">Input separator supported</label>
          <input id="rd-sep" type="text" value="-> , space, or comma (one pair per line)" disabled>
        </div>
        <div class="full">
          <label for="rd-pairs">Old path &rarr; New path <span class="muted">(one redirect per line)</span></label>
          <textarea id="rd-pairs" data-pairs rows="6" placeholder="/old-page/ -> /new-page/">/old-blog-post/ -> /blog/new-post/
/services.html -> /youtube-seo-service/
/pricing-old/ -> https://example.com/pricing/</textarea>
        </div>
      </div>
    </div>
    <section class="card" style="margin-top:16px">
      <h2 class="seo-h">Validation checks</h2>
      <ul class="seo-checks" data-checks></ul>
    </section>
    <section class="card" style="margin-top:16px">
      <div class="seo-head-row"><h2 class="seo-h">Generated Redirect Rules</h2><div class="seo-actions"><button type="button" class="btn" data-copy>Copy rules</button><button type="button" class="btn ghost" data-download>Download file</button></div></div>
      <pre class="sg-out" data-out></pre>
      <p class="note">Test your redirects after deploying to confirm they return a single 301/302 hop with no redirect chains or loops.</p>
    </section>`,
  },
  "open-graph-preview": {
    name: "Open Graph & Social Card Preview",
    lead: "Preview how your link looks when shared on Facebook, LinkedIn, X (Twitter), and WhatsApp, and generate clean og: and twitter: meta tags.",
    meta: ["BROWSER ONLY", "or fetch any live URL"],
    body: `
    <form class="card inputcard seo-form" data-seo="og" novalidate>
      <label for="og-url">Page URL</label>
      <div class="seo-row"><input id="og-url" name="url" type="text" value="https://passivearray.com/youtube-seo-service/" placeholder="https://example.com/your-article/"><button type="button" class="btn ghost" data-fetch>Fetch from URL</button></div>
      <div class="sg-fields">
        <div>
          <label for="og-title">og:title</label>
          <input id="og-title" name="title" type="text" value="YouTube SEO Service for Global Channels | Passive Array" placeholder="Compelling social headline (40-60 chars)">
        </div>
        <div>
          <label for="og-site">og:site_name</label>
          <input id="og-site" name="site" type="text" value="Passive Array" placeholder="Your brand name">
        </div>
        <div class="full">
          <label for="og-desc">og:description</label>
          <textarea id="og-desc" name="desc" rows="2" placeholder="1-2 sentences shown below your title on social feeds">Grow your YouTube channel globally with technical SEO, outlier research, and multilingual metadata optimization.</textarea>
        </div>
        <div>
          <label for="og-img">og:image URL <span class="muted">(recommended 1200×630 px)</span></label>
          <input id="og-img" name="image" type="text" value="https://passivearray.com/og-image.png" placeholder="https://example.com/cover-1200x630.png">
        </div>
        <div>
          <label for="og-card">twitter:card type</label>
          <select id="og-card" name="card">
            <option value="summary_large_image">summary_large_image (Large banner)</option>
            <option value="summary">summary (Square thumbnail)</option>
          </select>
        </div>
      </div>
      <span class="fmsg" data-msg></span>
    </form>
    <div class="seo-previews" style="margin-top:16px">
      <section class="card"><h2 class="seo-h">Facebook / LinkedIn Preview</h2><div data-og-fb></div></section>
      <section class="card"><h2 class="seo-h">X (Twitter) Preview</h2><div data-og-tw></div></section>
    </div>
    <section class="card" style="margin-top:16px">
      <div class="seo-head-row"><h2 class="seo-h">Generated Open Graph &amp; Twitter Meta Tags</h2><div class="seo-actions"><button type="button" class="btn" data-copy>Copy HTML tags</button></div></div>
      <pre class="sg-out" data-out></pre>
    </section>`,
  },
  "keyword-density-checker": {
    name: "Keyword Density Checker",
    lead: "Paste your article, landing page copy, or script to analyze word count, reading time, and top 1-word, 2-word, and 3-word keyword density.",
    meta: ["BROWSER ONLY", "nothing you type is sent anywhere"],
    body: `
    <div class="card inputcard seo-form" data-seo="density">
      <div class="sg-fields">
        <div>
          <label for="kd-target">Target keyword <span class="muted">(optional)</span></label>
          <input id="kd-target" type="text" data-target placeholder="e.g. youtube seo">
        </div>
        <div style="display:flex;align-items:flex-end;gap:10px;padding-bottom:6px">
          <label style="display:flex;align-items:center;gap:8px;margin:0;cursor:pointer;font-weight:500"><input type="checkbox" data-stop checked style="width:auto"> Ignore common stop words (the, and, is...)</label>
        </div>
        <div class="full">
          <label for="kd-text">Paste your text</label>
          <textarea id="kd-text" data-text rows="7" placeholder="Paste your blog post, product description, or script here...">YouTube SEO helps creators rank videos higher in YouTube search and Google search. Good YouTube SEO starts with keyword research, clear titles, and strong click-through rates. When your video answers the viewer's question quickly, watch time improves and YouTube recommends your video to more viewers globally.</textarea>
        </div>
      </div>
      <div class="seo-stats" data-stats></div>
      <div class="seo-verdict" data-target-res style="display:none"></div>
    </div>
    <section class="card" style="margin-top:16px">
      <div class="seo-head-row">
        <h2 class="seo-h">Top Keywords &amp; Phrases</h2>
        <div class="seo-chips" style="margin:0" data-ngrams>
          <button type="button" class="seo-chip active" data-n="1">1-Word</button>
          <button type="button" class="seo-chip" data-n="2">2-Word</button>
          <button type="button" class="seo-chip" data-n="3">3-Word</button>
        </div>
      </div>
      <div data-table></div>
    </section>`,
  },
  "heading-analyzer": {
    name: "Heading Structure & Readability Checker",
    lead: "Paste HTML or Markdown to inspect your H1–H6 heading hierarchy, catch skipped heading levels or multiple H1s, and check Flesch readability.",
    meta: ["BROWSER ONLY", "nothing you type is sent anywhere"],
    body: `
    <div class="card inputcard seo-form" data-seo="headings">
      <label for="hd-input">Paste HTML or Markdown draft</label>
      <textarea id="hd-input" data-input rows="8" placeholder="<h1>Main Title</h1>\n<p>Intro paragraph...</p>\n<h2>Section</h2>"># How to Rank YouTube Videos Globally
Most creators only optimize for English keywords, leaving huge search volume untapped.

## Step 1: Research Multilingual Search Intent
Translate your core topics and check local competition before recording.

### Choosing Target Languages
Spanish, Portuguese, Hindi, and Arabic often have lower competition than English.

## Step 2: Optimize Titles and Descriptions
Keep your primary keyword near the front of the title and write natural descriptions.</textarea>
      <div class="seo-stats" data-stats></div>
    </div>
    <section class="card" style="margin-top:16px">
      <h2 class="seo-h">Structure Checks</h2>
      <ul class="seo-checks" data-checks></ul>
    </section>
    <section class="card" style="margin-top:16px">
      <h2 class="seo-h">Heading Outline (H1–H6)</h2>
      <div data-tree></div>
    </section>`,
  },
  "utm-url-builder": {
    name: "SEO URL Slug & UTM Builder",
    lead: "Convert any headline into a clean, SEO-friendly URL slug and build properly encoded UTM tracking links for YouTube descriptions, social posts, and ads.",
    meta: ["BROWSER ONLY", "nothing you type is sent anywhere"],
    body: `
    <div class="card inputcard seo-form" data-seo="utm">
      <div class="seo-head-row" style="margin-bottom:8px"><b>Quick campaign presets</b></div>
      <div class="seo-chips" data-utm-presets>
        <button type="button" class="seo-chip active" data-up="youtube">YouTube Description</button>
        <button type="button" class="seo-chip" data-up="facebook">Facebook Post</button>
        <button type="button" class="seo-chip" data-up="newsletter">Email Newsletter</button>
        <button type="button" class="seo-chip" data-up="twitter">X / Twitter</button>
      </div>
      <div class="sg-fields">
        <div>
          <label for="ut-base">Destination base URL</label>
          <input id="ut-base" type="text" data-base value="https://passivearray.com/youtube-seo-service/" placeholder="https://example.com/">
        </div>
        <div>
          <label for="ut-title">Article / Page title for slug <span class="muted">(optional)</span></label>
          <input id="ut-title" type="text" data-title placeholder="e.g. 10 Best Ways to Grow a YouTube Channel in 2026">
        </div>
        <div class="full" style="margin-top:6px">
          <label style="display:inline-flex;align-items:center;gap:8px;margin:0;cursor:pointer;font-weight:500"><input type="checkbox" data-rmstop checked style="width:auto"> Remove filler stop words from slug (a, the, to, of, in, for...)</label>
        </div>
        <div>
          <label for="ut-src" class="req">utm_source</label>
          <input id="ut-src" type="text" data-src value="youtube" placeholder="youtube, facebook, newsletter">
        </div>
        <div>
          <label for="ut-med" class="req">utm_medium</label>
          <input id="ut-med" type="text" data-med value="video_description" placeholder="social, email, cpc">
        </div>
        <div>
          <label for="ut-camp" class="req">utm_campaign</label>
          <input id="ut-camp" type="text" data-camp value="global_seo_launch" placeholder="spring_sale, launch_2026">
        </div>
        <div>
          <label for="ut-cont">utm_content <span class="muted">(optional)</span></label>
          <input id="ut-cont" type="text" data-cont value="pinned_comment" placeholder="hero_cta, pinned_comment">
        </div>
      </div>
    </div>
    <section class="card" style="margin-top:16px">
      <div class="seo-head-row"><h2 class="seo-h">Clean SEO Slug</h2><div class="seo-actions"><button type="button" class="btn ghost" data-copy-slug>Copy slug</button></div></div>
      <pre class="sg-out" data-slug-out style="margin-bottom:16px"></pre>
      <div class="seo-head-row"><h2 class="seo-h">Final Campaign URL</h2><div class="seo-actions"><button type="button" class="btn" data-copy>Copy UTM URL</button></div></div>
      <pre class="sg-out" data-out></pre>
      <p class="note">Use lowercase UTM values consistently so Google Analytics 4 groups your traffic cleanly without splitting rows.</p>
    </section>`,
  },
};

const CSS = `<style>
.seo-form label{display:block;font-weight:600;font-size:.9rem;margin:14px 0 6px}
.seo-form label:first-child{margin-top:0}
.seo-form input,.seo-form textarea,.seo-form select{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;background:var(--bg);color:var(--text);font:inherit;padding:11px 14px}
.seo-form textarea{resize:vertical}
.seo-row{display:flex;gap:8px}.seo-row input,.seo-row select{flex:1;min-width:0}.seo-row .btn{flex:none;height:auto}
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
.seo-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.seo-chip{border:1px solid var(--line);background:var(--bg);color:var(--text);border-radius:999px;padding:6px 13px;font-size:.83rem;font-weight:600;cursor:pointer;transition:.15s}
.seo-chip:hover,.seo-chip.active{border-color:var(--teal);background:var(--soft);color:var(--teal)}
.seo-verdict{margin-top:12px;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--bg);font-size:.92rem;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.seo-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.03em}
.seo-badge.ok{background:rgba(16,185,129,.14);color:var(--good)}
.seo-badge.bad{background:rgba(239,68,68,.14);color:var(--bad)}
.seo-badge.warn{background:rgba(217,162,58,.16);color:#B7791F}
:root[data-theme="dark"] .seo-badge.warn{color:#F0C36D}
.seo-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:14px}
.seo-stat{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.seo-stat b{display:block;font-size:1.35rem;line-height:1.15}
.seo-stat span{font-size:.8rem;color:var(--muted)}
.seo-tbl{width:100%;border-collapse:collapse;font-size:.9rem;margin-top:10px}
.seo-tbl th,.seo-tbl td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line)}
.seo-tbl th{font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
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
