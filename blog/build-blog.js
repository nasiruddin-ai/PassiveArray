// Builds the blog from blog/posts/*.md into dist/blog/.
//   dist/blog/index.html                     list of articles, grouped by category
//   dist/blog/<slug>/index.html              one page per article
//   dist/blog/category/<cat>/index.html      one page per category
//
// Front matter at the top of each post:
//   ---
//   title: ...
//   description: ...          one sentence, shows on cards and in search results
//   date: 2026-09-01
//   category: Earnings        must match a label in CATEGORIES below
//   keyword: how much does youtube pay for 1000 views    the search this answers
//   tools: slug-one, slug-two creator-tool slugs to show at the end, optional
//   updated: 2026-09-20       optional
//   ---
// Markdown supported: ## and ### headings, paragraphs, - and 1. lists, **bold**,
// *italic*, `code`, [links](url), > quotes, | tables |, --- rules.

const fs = require("fs");
const path = require("path");
const site = require("../creator-tools/build-tools.js");

const POSTS_DIR = path.join(__dirname, "posts");
const { esc } = site;

/* ------------------------------------------------------------------ categories
   Each one is a group of people we want to reach, not just a topic. The blurb is
   what the category page leads with; the meta line is its search description. */
const CATEGORIES = [
  {
    slug: "earnings", label: "Earnings",
    who: "Creators working out what their views are actually worth",
    blurb: "What platforms pay, how RPM and CPM differ, and why every honest answer is a range. Each article shows the formula and links to the calculator that runs it on your numbers.",
    meta: "How much YouTube, Instagram and TikTok pay creators, with the formulas behind every estimate and free calculators to run your own numbers.",
    tools: ["youtube-money-calculator", "instagram-money-calculator", "tiktok-money-calculator"],
  },
  {
    slug: "sponsorships", label: "Sponsorships",
    who: "Creators pricing a brand deal, and brands setting a budget",
    blurb: "What to charge for an integration, a reel or a TikTok, how usage rights and exclusivity change the number, and what belongs in a media kit.",
    meta: "How much to charge for sponsored videos, posts and reels, how brands price creators, and how to build a media kit that holds up.",
    tools: ["youtube-sponsorship-price-calculator", "instagram-pricing-calculator", "tiktok-pricing-calculator"],
  },
  {
    slug: "engagement", label: "Engagement",
    who: "Anyone judging whether an audience is real and awake",
    blurb: "The benchmarks behind every grade on this site: what a good rate looks like at each account size, on each platform, and why the numbers differ so much between them.",
    meta: "Engagement rate benchmarks by follower count for YouTube, Instagram and TikTok, the formulas, and free calculators for each.",
    tools: ["youtube-engagement-rate-calculator", "instagram-engagement-rate-calculator", "tiktok-engagement-rate-calculator"],
  },
  {
    slug: "youtube-seo", label: "YouTube SEO",
    who: "YouTube creators who want the next video to get found",
    blurb: "Tags, keywords, titles and what actually moves a video in search and suggested. Free methods only, with the tool or extension that does each job.",
    meta: "Free YouTube SEO guides: keyword research, tags, titles and what really affects ranking, with free tools and a Chrome extension.",
    tools: ["youtube-channel-quality-checker", "youtube-subscriber-count-checker"],
  },
  {
    slug: "growth", label: "Growth",
    who: "Creators tracking their own channel week to week",
    blurb: "The numbers worth watching, what they mean at your size, and how to read a channel honestly, including your own.",
    meta: "How to read channel statistics honestly: views per subscriber, upload consistency, audience quality and the numbers that predict growth.",
    tools: ["youtube-subscriber-count-checker", "youtube-channel-quality-checker", "youtube-channel-comparison"],
  },
  {
    slug: "for-brands", label: "For brands",
    who: "Brands and agencies about to pay a creator",
    blurb: "How to check an audience is real, what to ask for before money changes hands, and how to compare a shortlist without guessing.",
    meta: "How brands vet creators: spotting fake followers, checking audience quality, comparing a shortlist and pricing a deal fairly.",
    tools: ["instagram-fake-follower-checker", "tiktok-fake-follower-checker", "youtube-channel-comparison"],
  },
];
const CAT_BY_LABEL = new Map(CATEGORIES.map((c) => [c.label.toLowerCase(), c]));

/* ------------------------------------------------------------------ markdown */
function inline(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, href) => `<a href="${href}"${/^https?:/.test(href) ? ' rel="noopener"' : ""}>${text}</a>`);
  return s;
}
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function markdown(src) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  const para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para.length = 0; } };
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (!t) { flush(); i++; continue; }
    let m;
    if ((m = /^(#{2,4})\s+(.+)$/.exec(t))) {
      flush();
      const lvl = m[1].length;
      out.push(`<h${lvl} id="${slugify(m[2])}">${inline(m[2])}</h${lvl}>`);
      i++; continue;
    }
    if (/^---+$/.test(t)) { flush(); out.push("<hr>"); i++; continue; }
    if (t.startsWith("> ")) {
      flush();
      const q = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) { q.push(lines[i].trim().slice(2)); i++; }
      out.push(`<blockquote><p>${inline(q.join(" "))}</p></blockquote>`);
      continue;
    }
    if (t.startsWith("|")) {
      flush();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(lines[i].trim()); i++; }
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(rows[1] && /^\|?\s*:?-+/.test(rows[1]) ? 2 : 1);
      out.push(`<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }
    if (/^([-*]|\d+\.)\s+/.test(t)) {
      flush();
      const ordered = /^\d+\./.test(t);
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].trim().replace(/^([-*]|\d+\.)\s+/, ""));
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) { items[items.length - 1] += " " + lines[i].trim(); i++; }
      }
      out.push(`<${ordered ? "ol" : "ul"}>${items.map((x) => `<li>${inline(x)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`);
      continue;
    }
    para.push(t);
    i++;
  }
  flush();
  return out.join("\n");
}

/* ------------------------------------------------------------------ posts */
function parse(file) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8").replace(/\r\n/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) throw new Error("No front matter in " + file);
  const meta = {};
  m[1].split("\n").forEach((l) => { const k = l.indexOf(":"); if (k > 0) meta[l.slice(0, k).trim()] = l.slice(k + 1).trim(); });
  for (const k of ["title", "description", "date", "category"]) if (!meta[k]) throw new Error(file + " is missing " + k);
  const cat = CAT_BY_LABEL.get(meta.category.toLowerCase());
  if (!cat) throw new Error(file + ' has unknown category "' + meta.category + '". Use one of: ' + CATEGORIES.map((c) => c.label).join(", "));
  const body = m[2].trim();
  const words = body.split(/\s+/).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.title,
    description: meta.description,
    date: meta.date,
    updated: meta.updated || meta.date,
    category: cat,
    keyword: meta.keyword || "",
    tools: (meta.tools || "").split(",").map((s) => s.trim()).filter(Boolean),
    minutes: Math.max(1, Math.round(words / 220)),
    html: markdown(body),
  };
}

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")).map(parse).sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ------------------------------------------------------------------ pieces */
function card(p, root) {
  return `<a class="card post" href="${root}blog/${p.slug}/"><span class="tagline"><span class="plat" style="color:var(--deep)">${esc(p.category.label.toUpperCase())}</span><span class="muted" style="font-size:.78rem">${p.minutes} min read</span></span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><span class="pdate">${site.fmtDate(p.date)}</span></a>`;
}

function catNav(activeSlug, root, counts) {
  return `<nav class="catnav">
    <a href="${root}blog/"${activeSlug ? "" : ' class="on"'}>All articles</a>
    ${CATEGORIES.map((c) => `<a href="${root}blog/category/${c.slug}/"${activeSlug === c.slug ? ' class="on"' : ""}>${esc(c.label)}<span>${counts[c.slug] || 0}</span></a>`).join("")}
  </nav>`;
}

function toolCards(slugs, root, heading) {
  const list = slugs.map((s) => site.tools.find((t) => t.slug === s)).filter(Boolean);
  if (!list.length) return "";
  return `<section class="tools-used"><h2>${esc(heading || "Try it on your own numbers")}</h2><div class="grid c3">${list.map((t) => `<a class="card" href="${root}creator-tools/${t.slug}/"><span class="tagline"><span class="plat ${t.platform}">${t.platform.toUpperCase()}</span></span><h3>${esc(t.name)}</h3><p>${esc(t.short)}</p></a>`).join("")}</div></section>`;
}

const signupBand = (title, text) => `<div class="cta-band"><div><h3>${esc(title)}</h3><p>${esc(text)}</p></div><button type="button" class="btn mint" data-signup>Sign up free</button></div>`;

/* ------------------------------------------------------------------ pages */
function postPage(p, prev, next, related) {
  const root = "../../";
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="${root}">Home</a> / <a href="../">Blog</a> / <a href="../category/${p.category.slug}/">${esc(p.category.label)}</a></div>
    <h1>${esc(p.title)}</h1>
    <p class="lead">${esc(p.description)}</p>
    <div class="meta"><b>${esc(p.category.label.toUpperCase())}</b><span>${site.fmtDate(p.date)}</span><span>${p.minutes} min read</span>${p.updated !== p.date ? `<span>Updated ${site.fmtDate(p.updated)}</span>` : ""}</div>
  </div>
  <article class="prose">
${p.html}
  </article>
  ${toolCards(p.tools, root)}
  ${related.length ? `<section class="tools-used"><h2>More in ${esc(p.category.label)}</h2><div class="grid c3">${related.map((r) => card(r, root)).join("")}</div></section>` : ""}
  ${signupBand("Get the weekly creator report", "Benchmarks, rate changes and new tools, one email a week.")}
  <nav class="post-nav">
    ${prev ? `<a href="../${prev.slug}/"><span>Newer</span>${esc(prev.title)}</a>` : "<span></span>"}
    ${next ? `<a href="../${next.slug}/" style="text-align:right"><span>Older</span>${esc(next.title)}</a>` : ""}
  </nav>`;
  return site.shell({
    title: p.title,
    description: p.description,
    path: `/blog/${p.slug}/`,
    active: "blog",
    narrow: true,
    body,
    jsonld: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated,
      articleSection: p.category.label,
      author: { "@type": "Organization", name: site.BRAND, url: site.SITE + "/" },
      publisher: { "@type": "Organization", name: site.BRAND, url: site.SITE + "/" },
      mainEntityOfPage: site.SITE + `/blog/${p.slug}/`,
    },
  });
}

function categoryPage(cat, posts, counts) {
  const root = "../../../";
  const mine = posts.filter((p) => p.category.slug === cat.slug);
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="${root}">Home</a> / <a href="${root}blog/">Blog</a> / ${esc(cat.label)}</div>
    <h1>${esc(cat.label)}</h1>
    <p class="lead">${esc(cat.blurb)}</p>
    <div class="meta"><b>FOR</b><span>${esc(cat.who)}</span></div>
  </div>
  ${catNav(cat.slug, root, counts)}
  <div class="grid c3">${mine.map((p) => card(p, root)).join("")}</div>
  ${toolCards(cat.tools, root, "The tools behind these articles")}
  ${signupBand("New " + cat.label.toLowerCase() + " articles, once a week", "One email a week with the new benchmarks and tools. Unsubscribe any time.")}`;
  return site.shell({
    title: cat.label + " articles",
    ogTitle: cat.label + " guides for creators",
    description: cat.meta,
    path: `/blog/category/${cat.slug}/`,
    active: "blog",
    body,
  });
}

function indexPage(posts, counts) {
  const root = "../";
  const [lead, ...rest] = posts;
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="${root}">Home</a> / Blog</div>
    <h1>Creator numbers, explained</h1>
    <p class="lead">Benchmarks, formulas and honest ranges behind engagement rates, earnings and sponsorship prices. Every article shows its working and links to the free tool that does the math.</p>
  </div>
  ${catNav("", root, counts)}
  <div class="grid c3">${posts.map((p) => card(p, root)).join("")}</div>
  <section class="tools-used">
    <h2>Browse by what you need</h2>
    <div class="grid c3">${CATEGORIES.map((c) => `<a class="card" href="${root}blog/category/${c.slug}/"><span class="tagline"><span class="plat" style="color:var(--deep)">${esc(c.label.toUpperCase())}</span><span class="muted" style="font-size:.78rem">${counts[c.slug] || 0} article${(counts[c.slug] || 0) === 1 ? "" : "s"}</span></span><h3>${esc(c.who)}</h3><p>${esc(c.blurb)}</p></a>`).join("")}</div>
  </section>
  ${signupBand("New articles land in the weekly report first", "One email a week. Unsubscribe any time.")}`;
  return site.shell({
    title: "Blog",
    ogTitle: "Passive Array blog: creator numbers, explained",
    description: "Benchmarks and formulas behind engagement rates, YouTube earnings, sponsorship prices and fake-follower checks, with the free tool for each.",
    path: "/blog/",
    active: "blog",
    body,
  });
}

/* ------------------------------------------------------------------ build */
function buildInto(outDir, posts) {
  posts = posts || loadPosts();
  const counts = {};
  posts.forEach((p) => { counts[p.category.slug] = (counts[p.category.slug] || 0) + 1; });

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), indexPage(posts, counts));

  posts.forEach((p, i) => {
    const dir = path.join(outDir, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    const related = posts.filter((r) => r.category.slug === p.category.slug && r.slug !== p.slug).slice(0, 3);
    fs.writeFileSync(path.join(dir, "index.html"), postPage(p, posts[i - 1], posts[i + 1], related));
  });

  for (const cat of CATEGORIES) {
    const dir = path.join(outDir, "category", cat.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), categoryPage(cat, posts, counts));
  }

  return { posts: posts.length, categories: CATEGORIES.length };
}

module.exports = { loadPosts, buildInto, markdown, CATEGORIES };
