// The signed-in dashboard at /app/: a sidebar app in the style of vidIQ's web app,
// but every panel is fed by things this site really has. Data loads client-side
// from the existing APIs (auth, watch, research, creator-tools) in app.js.
//
// Deliberately absent: anything we cannot do honestly yet (thumbnail AI, clipping,
// a posting calendar, video generation). Panels link to real tools and real feeds.

const fs = require("fs");
const path = require("path");
const site = require("../creator-tools/build-tools.js");
const { esc } = site;

const NAV = [
  ["feed", "Feed", "home"],
  ["optimize", "Optimize", "sparkle"],
  ["race", "Race to monetization", "trophy"],
  ["research", "Research", "search"],
  ["watchlist", "Watchlist", "eye"],
  ["ideas", "Daily ideas", "bulb"],
  ["competitors", "Competitors", "compare"],
  ["create", "Create", "pen"],
  ["learn", "Learn", "book"],
];

const ICONS = {
  home: `<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>`,
  sparkle: `<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>`,
  trophy: `<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/>`,
  search: `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`,
  eye: `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>`,
  bulb: `<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z"/>`,
  compare: `<rect x="3" y="10" width="5" height="10" rx="1"/><rect x="10" y="4" width="5" height="16" rx="1"/><rect x="17" y="13" width="4" height="7" rx="1"/>`,
  pen: `<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>`,
  book: `<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h8"/>`,
  rocket: `<path d="M5 15 3 21l6-2M14 4c3 0 6 3 6 6l-8 8-6-6z"/><circle cx="14" cy="10" r="1.5"/>`,
  chrome: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8.5h8.2M8.9 13.7 4.8 6.6M15.1 13.8l-4.2 7.1"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
  grid: `<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>`,
};
const ic = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

const MARK = `<svg viewBox="0 0 120 120" aria-hidden="true" width="30" height="30"><defs><linearGradient id="appmark" gradientUnits="userSpaceOnUse" x1="7" y1="7" x2="113" y2="113"><stop offset="0" stop-color="#2A9D8F"/><stop offset="1" stop-color="#5B6ABF"/></linearGradient></defs>${[0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === 2 && c === 2 ? `<circle cx="98" cy="98" r="15" fill="#8FD3C7"/>` : `<rect x="${7 + c * 38}" y="${7 + r * 38}" width="30" height="30" rx="7" fill="url(#appmark)"/>`)).join("")).join("")}</svg>`;

const CSS = `
.app { --rail: 272px; display: grid; grid-template-columns: var(--rail) minmax(0, 1fr); min-height: 100vh; background: var(--bg); color: var(--text); }
.app * { box-sizing: border-box; }
.rail { position: sticky; top: 0; height: 100vh; overflow: auto; display: flex; flex-direction: column; gap: 6px; padding: 18px 14px; background: var(--card); border-right: 1px solid var(--line); }
.rail-brand { display: flex; align-items: center; justify-content: space-between; padding: 2px 8px 14px; }
.rail-brand a { display: flex; align-items: center; gap: 10px; font-weight: 600; color: var(--text); }
.rail-brand .iconbtn { width: 36px; height: 36px; }
.rail a.nav-item, .rail button.nav-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 11px 14px; border-radius: 12px; color: var(--text); font: inherit; font-size: .95rem; font-weight: 500; background: none; border: 0; cursor: pointer; text-align: left; }
.rail .nav-item:hover { background: var(--soft); color: var(--text); }
.rail .nav-item.on { background: var(--soft); color: var(--deep); font-weight: 600; }
:root[data-theme="dark"] .rail .nav-item.on { color: var(--mint); }
.rail .nav-item svg { flex: none; opacity: .85; }
.rail .nav-item .cnt { margin-left: auto; font-size: .72rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: var(--soft); color: var(--deep); }
.rail .upgrade { color: var(--indigo); font-weight: 600; }
.rail .upgrade.pro { color: var(--deep); }
.rail .rail-btn { display: flex; align-items: center; justify-content: center; gap: 8px; height: 42px; border-radius: 12px; border: 1px solid var(--line); background: var(--bg); color: var(--text); font: inherit; font-weight: 600; font-size: .9rem; margin: 4px 6px 0; }
.rail .rail-btn:hover { border-color: var(--teal); color: var(--text); }
.rail .rail-h { font-size: .78rem; font-weight: 600; color: var(--muted); padding: 16px 14px 4px; }
.rail .rail-list { display: flex; flex-direction: column; gap: 2px; }
.rail .rail-list a { display: flex; align-items: center; gap: 10px; padding: 8px 14px; border-radius: 10px; color: var(--text); font-size: .88rem; }
.rail .rail-list a img { width: 24px; height: 24px; border-radius: 50%; }
.rail .rail-list a:hover { background: var(--soft); }
.rail .rail-empty { padding: 6px 14px; font-size: .85rem; color: var(--muted); }
.rail-foot { margin-top: auto; display: flex; align-items: center; gap: 10px; padding: 14px 10px 4px; border-top: 1px solid var(--line); font-size: .85rem; }
.rail-foot .who { min-width: 0; flex: 1; }
.rail-foot .who b { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
.rail-foot .who span { color: var(--muted); font-size: .78rem; }
.rail-foot .plan { font-size: .72rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: var(--soft); color: var(--deep); }
.rail-foot .plan.pro { background: var(--teal); color: #fff; }
.main { min-width: 0; padding: 22px 28px 60px; }
.topbar { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
.topbar h1 { font-size: 1.5rem; letter-spacing: -.02em; }
.topbar .spacer { flex: 1; }
.topbar .menubtn { display: none; }
.topbar .asearch { display: flex; align-items: center; gap: 8px; height: 42px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--line); background: var(--card); color: var(--muted); width: 340px; max-width: 100%; }
.topbar .asearch input { flex: 1; min-width: 0; border: 0; background: transparent; color: var(--text); font: inherit; outline: 0; }
.panel[hidden] { display: none; }
.pgrid { display: grid; gap: 16px; grid-template-columns: repeat(12, minmax(0, 1fr)); }
.pgrid > * { grid-column: span 12; }
.span6 { grid-column: span 6 !important; } .span4 { grid-column: span 4 !important; } .span8 { grid-column: span 8 !important; } .span3 { grid-column: span 3 !important; }
.acard { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 20px 22px; }
.acard h2 { font-size: 1.08rem; margin-bottom: 4px; }
.acard .sub { font-size: .88rem; color: var(--muted); }
.acard-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.acard-head a { font-size: .85rem; font-weight: 600; }
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 10px; }
.kpi { background: var(--soft); border-radius: 12px; padding: 12px 14px; }
.kpi b { display: block; font-size: 1.45rem; font-weight: 600; letter-spacing: -.02em; line-height: 1.1; }
.kpi span { font-size: .78rem; color: var(--muted); }
.kpi.good b { color: var(--good); } .kpi.warn b { color: var(--warn); } .kpi.bad b { color: var(--bad); }
.prog { height: 10px; border-radius: 999px; background: var(--soft); overflow: hidden; margin: 8px 0 4px; }
.prog i { display: block; height: 100%; background: linear-gradient(90deg, var(--teal), var(--indigo)); border-radius: 999px; }
.prog-row { display: flex; justify-content: space-between; font-size: .85rem; color: var(--muted); }
.prog-row b { color: var(--text); }
.verdict { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; font-weight: 700; font-size: .85rem; background: var(--soft); color: var(--deep); }
.verdict.good { background: rgba(42,157,143,.16); color: var(--good); } .verdict.warn { background: rgba(183,121,31,.16); color: var(--warn); } .verdict.bad { background: rgba(192,57,43,.14); color: var(--bad); }
.sigs { list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 8px; }
.sigs li { display: flex; gap: 10px; align-items: flex-start; font-size: .9rem; }
.sigs li i { flex: none; width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; background: var(--muted); }
.sigs li.good i { background: var(--good); } .sigs li.warn i { background: var(--warn); } .sigs li.bad i { background: var(--bad); }
.sigs li span { color: var(--muted); }
.aform { display: flex; gap: 8px; flex-wrap: wrap; }
.aform input { flex: 1 1 220px; height: 44px; border-radius: 12px; border: 1px solid var(--line); background: var(--bg); color: var(--text); padding: 0 14px; font: inherit; }
.aform .btn { height: 44px; }
.movers { display: flex; flex-direction: column; }
.mover { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--line); font-size: .92rem; }
.mover:last-child { border-bottom: 0; }
.mover img { width: 36px; height: 36px; border-radius: 50%; }
.mover .t { flex: 1; min-width: 0; }
.mover .t b { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mover .t span { font-size: .8rem; color: var(--muted); }
.mover .d { text-align: right; white-space: nowrap; font-weight: 600; }
.mover .d.up { color: var(--good); } .mover .d.down { color: var(--bad); } .mover .d.flat { color: var(--muted); font-weight: 500; }
.ogrid-mini { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; }
.omini { display: block; border-radius: 14px; overflow: hidden; background: var(--bg); border: 1px solid var(--line); color: var(--text); }
.omini:hover { border-color: var(--teal); color: var(--text); }
.omini .th { position: relative; aspect-ratio: 16/9; background: var(--soft); }
.omini .th img { width: 100%; height: 100%; object-fit: cover; display: block; }
.omini .th .x { position: absolute; left: 8px; top: 8px; font-size: .72rem; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: var(--ink); color: #fff; }
.omini .th .x.hot { background: var(--teal); }
.omini .b { padding: 10px 12px; }
.omini .b .t { font-size: .85rem; font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.omini .b .m { font-size: .76rem; color: var(--muted); margin-top: 4px; }
.tlist { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; }
.tlist a { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; border-radius: 14px; background: var(--bg); border: 1px solid var(--line); color: var(--text); }
.tlist a:hover { border-color: var(--teal); color: var(--text); }
.tlist a b { font-size: .95rem; }
.tlist a span { font-size: .8rem; color: var(--muted); line-height: 1.45; }
.tlist a .pl { font-size: .7rem; font-weight: 700; letter-spacing: .04em; color: var(--deep); }
.idea { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--line); }
.idea:last-child { border-bottom: 0; }
.idea img { width: 96px; aspect-ratio: 16/9; object-fit: cover; border-radius: 8px; flex: none; }
.idea .t { flex: 1; min-width: 0; }
.idea .t b { display: block; font-size: .92rem; line-height: 1.3; }
.idea .t span { display: block; font-size: .8rem; color: var(--muted); margin-top: 3px; }
.idea .acts { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.idea .acts a { font-size: .8rem; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: var(--soft); color: var(--deep); }
.chips-row { display: flex; flex-wrap: wrap; gap: 8px; }
.chips-row a { font-size: .85rem; padding: 6px 12px; border-radius: 999px; background: var(--soft); color: var(--deep); font-weight: 500; }
.notice { padding: 14px 16px; border-radius: 14px; background: var(--soft); color: var(--text); font-size: .92rem; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.notice .btn { height: 38px; font-size: .88rem; }
.notice[hidden] { display: none; }
.empty { color: var(--muted); font-size: .9rem; padding: 10px 0; }
.wltable { width: 100%; font-size: .9rem; }
.pro-card { background: linear-gradient(135deg, var(--ink), #2B3A6B); color: #fff; border: 0; }
.pro-card h2, .pro-card .sub { color: #fff; } .pro-card .sub { opacity: .8; }
.pro-card ul { margin: 12px 0 16px; padding-left: 18px; font-size: .92rem; line-height: 1.6; opacity: .95; }
.pro-card .btn.mint { color: #1F2A44; }
.pro-card .fmsg { color: #DDE4F0; }
.scrim { display: none; }
@media (max-width: 1100px) { .span6, .span4, .span8, .span3 { grid-column: span 12 !important; } }
@media (max-width: 900px) {
  .app { grid-template-columns: 1fr; }
  .rail { position: fixed; inset: 0 auto 0 0; width: min(300px, 86vw); z-index: 60; transform: translateX(-104%); transition: transform .2s; box-shadow: 0 0 60px rgba(0,0,0,.35); }
  .app.rail-open .rail { transform: none; }
  .scrim { display: block; position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 50; opacity: 0; pointer-events: none; transition: opacity .2s; }
  .app.rail-open .scrim { opacity: 1; pointer-events: auto; }
  .main { padding: 16px 16px 48px; }
  .topbar .menubtn { display: inline-flex; }
  .topbar .asearch { display: none; }
}
`;

function appPage(posts = []) {
  const root = "../";
  const tools = site.tools.map((t) => ({ slug: t.slug, name: t.name, platform: t.platform, api: t.api, short: t.short, intent: site.intentOf(t) }));
  const latest = posts.slice(0, 6).map((p) => ({
    slug: p.slug, title: p.title, date: p.date,
    category: p.category && typeof p.category === "object" ? (p.category.label || p.category.name || p.category.slug || "") : (p.category || ""),
    minutes: p.minutes || p.readingTime || p.readMinutes || p.reading || null,
  }));
  const nav = NAV.map(([id, label, icon]) => `<a class="nav-item" href="#${id}" data-nav="${id}">${ic(icon)}<span>${esc(label)}</span><span class="cnt" data-nav-count="${id}" hidden></span></a>`).join("");
  const panels = NAV.map(([id, label]) => `<section class="panel" data-panel="${id}" hidden><div class="pgrid" data-panel-body="${id}"></div></section>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard | ${site.BRAND}</title>
<meta name="description" content="Your Passive Array dashboard: watchlist, monetization progress, research feeds and every tool in one place.">
<meta name="robots" content="noindex">
<link rel="canonical" href="${site.SITE}/app/">
${site.VERIFY_TAG}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${root}creator-tools/shared.css">
<style>${CSS}</style>
<script>try{var t=localStorage.getItem("pa-theme");document.documentElement.setAttribute("data-theme",t||"dark");}catch(e){}</script>
<script>window.PA_TOOLS=${JSON.stringify(tools)};window.PA_POSTS=${JSON.stringify(latest)};</script>
</head>
<body data-root="${root}" class="app-body">
<div class="app" data-app>
  <aside class="rail" aria-label="Dashboard navigation">
    <div class="rail-brand">
      <a href="${root}">${MARK}<span>Passive <b style="color:var(--teal)">Array</b></span></a>
      <button type="button" class="iconbtn" data-theme-toggle aria-label="Switch theme">${site.ICON.moon}</button>
    </div>
    <nav class="rail-nav">${nav}</nav>
    <a class="nav-item upgrade" href="#upgrade" data-nav="upgrade" data-upgrade-link>${ic("rocket")}<span>Upgrade to Pro</span></a>
    <a class="rail-btn" href="${root}youtube-extension/">${ic("chrome")} Install extension</a>
    <a class="rail-btn" href="${root}creator-tools/">${ic("grid")} All ${site.tools.length} tools</a>
    <div class="rail-h">Watchlist</div>
    <div class="rail-list" data-rail-watch><div class="rail-empty">Sign in to watch channels.</div></div>
    <div class="rail-h">Recent tools</div>
    <div class="rail-list" data-rail-recent><div class="rail-empty">Tools you open show up here.</div></div>
    <div class="rail-foot">
      ${ic("user", 22)}
      <div class="who"><b data-who-email>Not signed in</b><span data-who-sub><a href="${root}login/?next=%2Fapp%2F">Sign in</a></span></div>
      <span class="plan" data-who-plan hidden>Free</span>
    </div>
  </aside>
  <div class="scrim" data-scrim></div>
  <main class="main">
    <div class="topbar">
      <button type="button" class="iconbtn menubtn" data-rail-toggle aria-label="Open menu">${ic("menu", 20)}</button>
      <h1 data-title>Feed</h1>
      <span class="spacer"></span>
      <form class="asearch" data-app-search role="search">${site.ICON.search}<input type="text" placeholder="Check a channel: @handle or link" aria-label="Check a channel"></form>
    </div>
    <div data-signed-out hidden class="notice" style="margin-bottom:16px">You are browsing the dashboard signed out. Research and tools work; the watchlist and your channel card need a free account. <a class="btn" href="${root}login/?next=%2Fapp%2F">Sign in</a></div>
    ${panels}
    <section class="panel" data-panel="upgrade" hidden><div class="pgrid" data-panel-body="upgrade"></div></section>
  </main>
</div>
<script src="${root}creator-tools/site.js"></script>
<script src="${root}creator-tools/app.js"></script>
</body>
</html>`;
}

function buildInto(DIST, posts) {
  fs.mkdirSync(path.join(DIST, "app"), { recursive: true });
  fs.writeFileSync(path.join(DIST, "app", "index.html"), appPage(posts));
  return ["/app/"];
}

module.exports = { appPage, buildInto };
