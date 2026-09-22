// Builds the blog from blog/posts/*.md into dist/blog/.
//   dist/blog/index.html          list of articles
//   dist/blog/<slug>/index.html   one page per article
// Front matter at the top of each post:
//   ---
//   title: ...
//   description: ...          (one sentence, shows on cards and in search results)
//   date: 2026-09-01
//   category: YouTube         (YouTube, Instagram, TikTok, Twitch, Brands, Guides)
//   tools: slug-one, slug-two (creator-tool slugs to show at the end, optional)
//   ---
// Markdown supported: ## and ### headings, paragraphs, - and 1. lists, **bold**,
// *italic*, `code`, [links](url), > quotes, | tables |, --- rules.

const fs = require("fs");
const path = require("path");
const site = require("../creator-tools/build-tools.js");

const POSTS_DIR = path.join(__dirname, "posts");
const { esc } = site;

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
        // continuation lines indented by two or more spaces
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
  const body = m[2].trim();
  const words = body.split(/\s+/).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.title,
    description: meta.description,
    date: meta.date,
    updated: meta.updated || meta.date,
    category: meta.category,
    tools: (meta.tools || "").split(",").map((s) => s.trim()).filter(Boolean),
    minutes: Math.max(1, Math.round(words / 220)),
    html: markdown(body),
  };
}

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")).map(parse).sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ------------------------------------------------------------------ pages */
function toolCards(slugs, root) {
  const list = slugs.map((s) => site.tools.find((t) => t.slug === s)).filter(Boolean);
  if (!list.length) return "";
  return `<section class="tools-used"><h2>Try it on your own numbers</h2><div class="grid c3">${list.map((t) => `<a class="card" href="${root}creator-tools/${t.slug}/"><span class="tagline"><span class="plat ${t.platform}">${t.platform.toUpperCase()}</span></span><h3>${esc(t.name)}</h3><p>${esc(t.short)}</p></a>`).join("")}</div></section>`;
}

function postPage(p, prev, next) {
  const root = "../../";
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="${root}">Home</a> / <a href="../">Blog</a> / ${esc(p.category)}</div>
    <h1>${esc(p.title)}</h1>
    <p class="lead">${esc(p.description)}</p>
    <div class="meta"><b>${esc(p.category.toUpperCase())}</b><span>${site.fmtDate(p.date)}</span><span>${p.minutes} min read</span>${p.updated !== p.date ? `<span>Updated ${site.fmtDate(p.updated)}</span>` : ""}</div>
  </div>
  <article class="prose">
${p.html}
  </article>
  ${toolCards(p.tools, root)}
  <div class="cta-band">
    <div><h3>Get the weekly creator report</h3><p>Benchmarks, rate changes and new tools, one email a week.</p></div>
    <button type="button" class="btn mint" data-signup>Sign up free</button>
  </div>
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
      author: { "@type": "Organization", name: site.BRAND, url: site.SITE + "/" },
      publisher: { "@type": "Organization", name: site.BRAND, url: site.SITE + "/" },
      mainEntityOfPage: site.SITE + `/blog/${p.slug}/`,
    },
  });
}

function indexPage(posts) {
  const root = "../";
  const cats = [...new Set(posts.map((p) => p.category))];
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="${root}">Home</a> / Blog</div>
    <h1>Creator numbers, explained</h1>
    <p class="lead">Benchmarks, formulas and honest ranges behind engagement rates, earnings and sponsorship prices. Every article links to the tool that does the math.</p>
    <div class="meta">${cats.map((c) => `<b>${esc(c.toUpperCase())}</b>`).join("")}</div>
  </div>
  <div class="grid c3">${posts.map((p) => site.postCard(p, root)).join("")}</div>
  <div class="cta-band">
    <div><h3>New articles land in the weekly report first</h3><p>One email a week. Unsubscribe any time.</p></div>
    <button type="button" class="btn mint" data-signup>Sign up free</button>
  </div>`;
  return site.shell({
    title: "Blog",
    ogTitle: "Passive Array blog: creator numbers, explained",
    description: "Benchmarks and formulas behind engagement rates, YouTube earnings, sponsorship prices and fake-follower checks, with the free tool for each.",
    path: "/blog/",
    active: "blog",
    body,
  });
}

function buildInto(outDir, posts) {
  posts = posts || loadPosts();
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), indexPage(posts));
  posts.forEach((p, i) => {
    const dir = path.join(outDir, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), postPage(p, posts[i - 1], posts[i + 1]));
  });
  return posts.length;
}

module.exports = { loadPosts, buildInto, markdown };
