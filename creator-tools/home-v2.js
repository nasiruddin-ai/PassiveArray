// Home page body (everything between the site header and footer), server-rendered.
//   main(ctx)  -> HTML string
//   css()      -> home-v2.css with every class prefixed "hp-", written to dist/creator-tools/home.css
// Class names are written plain here and in home-v2.css, then prefixed in one place, so the page
// cannot collide with shared.css. Scripts hook on data-hp attributes only (public/home.js).
// Every figure is either computed from the tool and post lists or dated and sourced below.
const fs = require("fs");
const path = require("path");

const PREFIX = "hp-";
const prefixHtml = (html) => html.replace(/class="([^"]+)"/g, (m, c) => `class="${c.trim().split(/\s+/).map((x) => PREFIX + x).join(" ")}"`);
function css() {
  const src = fs.readFileSync(path.join(__dirname, "home-v2.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const fonts = `@font-face{font-family:"Geist";src:url("/fonts/geist-var.woff2") format("woff2");font-weight:400 700;font-style:normal;font-display:swap}
@font-face{font-family:"Geist Mono";src:url("/fonts/geist-mono-var.woff2") format("woff2");font-weight:400 600;font-style:normal;font-display:swap}
`;
  return fonts + src.replace(/\.(?=[A-Za-z_])([\w-]+)/g, "." + PREFIX + "$1");
}

/* ---- dated data. Update the date with the numbers. ---- */
// #1 channel per country from the live top-channels-by-country tool.
const BOARD = { date: "15 November 2026", rows: [
  ["United States", "MrBeast", 526000000], ["India", "T-Series", 316000000], ["South Korea", "KIMPRO", 135000000],
  ["Argentina", "Alejo Igoa", 126000000], ["Japan", "PewDiePie", 109000000], ["Mexico", "Fede Vigevani", 81600000],
] };
// Results of the live monetization check, read from the public API. Ad placements cannot be read
// server-side, so that row is honest about needing the extension.
const SIGNALS = { date: "18 November 2026", cards: [
  { handle: "@mkbhd", title: "Marques Brownlee", subs: "21.4M", topic: "Technology", verdict: "Meets every threshold, likely monetized", confidence: 65 },
  { handle: "@veritasium", title: "Veritasium", subs: "21.4M", topic: "Knowledge", verdict: "Meets every threshold, likely monetized", confidence: 65 },
].map((c) => ({ ...c, rows: [["1,000+ subscribers", "Yes · " + c.subs, 1], ["3 uploads in the last 90 days", "Yes · 10 of 10", 1], ["4,000 watch hours", "Yes · estimated", 1], ["Not made for kids", "Yes", 1], ["Ads on recent uploads", "Needs the extension", 0]] })) };
// A real audit of @YouTubeCreators.
const AUDIT = { handle: "@YouTubeCreators", score: 38, grade: "Neglected",
  rows: [["Comments read", "956 across 10 videos"], ["Channel reply rate", "0%"], ["Questions with no reply", "34"], ["Comments per 1,000 views", "5.7, full marks"], ["Scam spam visible", "None"]],
  summary: "Big audience, healthy conversation, but nobody from the channel is answering. Start with the 34 open questions, most liked first.",
  stamp: "A real audit of @YouTubeCreators, run on 2 November 2026. The score changes as new comments come in." };
// Figures from YouTube Help, each quoted in the linked guide.
const FACTS = [
  ["1,000", "subscribers", "Needed to join the Partner Program for ad revenue, with one of the two watch thresholds.", "youtube-monetization-requirements", "Monetization requirements"],
  ["4,000", "public watch hours", "In the last 12 months. The other route is 10 million public Shorts views in 90 days.", "youtube-monetization-requirements", "Monetization requirements"],
  ["55%", "of long-form ad revenue", "The creator's published share of ad revenue on watch-page videos.", "ways-to-make-money-on-youtube", "Ways to make money"],
  ["45%", "of Shorts revenue", "Your share of the Shorts revenue allocated to you from the creator pool.", "how-much-does-youtube-pay-for-shorts", "What Shorts pay"],
  ["70%", "of fan funding", "Memberships, Super Chat, Super Stickers and Super Thanks, after taxes and fees.", "youtube-channel-memberships", "Channel memberships"],
  ["3 min", "maximum Short length", "Square or vertical videos up to three minutes are classed as Shorts.", "how-long-can-youtube-shorts-be", "How long a Short can be"],
  ["2%-10%", "impressions CTR", "The range YouTube gives for half of all channels and videos.", "youtube-click-through-rate", "Click-through rate"],
  ["$100", "payment threshold", "Your AdSense for YouTube balance must reach it before a payment is issued.", "how-does-youtube-pay-you", "How YouTube pays you"],
];
const JOBS = [
  ["Rank", "YouTube keyword research", "Turn one topic into long-tail keyword ideas, then see what the videos ranking for them actually get.", "Measured from the top results. Never a modelled search volume.", ["youtube-keyword-generator", "youtube-trending-tags-by-country", "youtube-hashtag-generator"]],
  ["Optimize", "YouTube tag and title generator", "Copy-ready tags, the hidden tags a competitor used, and a score for your title before you publish.", "Tag lists fit YouTube's 500-character limit.", ["youtube-tag-generator", "youtube-tag-extractor", "youtube-title-analyzer"]],
  ["Earn", "YouTube monetization and money calculator", "Check whether a channel is monetized and estimate what its views earn, as a range with the formula shown.", "Default RPM range: $0.50 to $4.00. Change it to match your niche.", ["youtube-monetization-checker", "youtube-money-calculator", "youtube-channel-value-calculator"]],
  ["Audit", "YouTube channel stats and audit", "Subscribers, views and upload pace for any channel, a 0 to 100 quality score, and side-by-side comparison.", "Averages come from the channel's last 10 uploads.", ["youtube-subscriber-count-checker", "youtube-channel-quality-checker", "youtube-channel-comparison"]],
  ["Community", "YouTube comment analytics", "Reply rate, unanswered questions, regulars and spam across a channel's latest videos, with CSV export.", "Comment health scored from 0 to 100.", ["youtube-comment-audit", "youtube-comment-analyzer", "youtube-comment-exporter"]],
  ["Sponsor", "YouTube influencer and sponsorship pricing", "Find channels by niche, price an integration and put a value on the views a campaign earned.", "Top channels ranked in 40 countries.", ["find-youtube-influencers-by-niche", "youtube-sponsorship-price-calculator", "top-youtube-channels-by-country"]],
];
const CMP = [
  ["Keyword research", "Free", "Limited", "Limited"],
  ["Tag and title generation", "Free, unlimited", "AI credits", "Limited"],
  ["Monetization check", "Free", "No", "No"],
  ["Channel audit and engagement", "Free", "Free", "Free"],
  ["Instagram, TikTok and Twitch", "Included", "Instagram only", "No"],
  ["Works without an account", "Yes", "No", "No"],
  ["Formula shown on the page", "Always", "No", "No"],
  ["Paid plan", "$9/mo, watchlist and exports only", "From $16.58/mo billed yearly", "Paid plans"],
];
const FIRST = ["youtube-monetization-checker", "youtube-keyword-generator", "youtube-tag-generator", "youtube-channel-quality-checker", "youtube-money-calculator", "youtube-title-analyzer",
  "youtube-subscriber-count-checker", "youtube-comment-audit", "youtube-sponsorship-price-calculator", "instagram-engagement-rate-calculator", "tiktok-fake-follower-checker", "twitch-channel-comparison"];
const POPULAR = ["youtube-tag-generator", "youtube-money-calculator", "youtube-monetization-checker", "youtube-keyword-generator", "youtube-title-generator", "youtube-description-generator",
  "youtube-hashtag-generator", "youtube-thumbnail-tester", "youtube-engagement-rate-calculator", "youtube-subscriber-count-checker", "youtube-channel-growth-tracker", "youtube-comment-audit"];
const MODES = [["monetization", "youtube-monetization-checker", "Check channel"], ["subscribers + views", "youtube-subscriber-count-checker", "Look up stats"], ["channel audit", "youtube-channel-quality-checker", "Audit channel"], ["comment audit", "youtube-comment-audit", "Audit comments"]];
const INTENT_ORDER = ["rank", "check", "estimate", "create", "fake", "compare", "find"];
const PLAT_ORDER = ["YouTube", "Instagram", "TikTok", "Twitch", "X"];
const short = (n) => (n >= 1e6 ? (n / 1e6).toFixed(n >= 1e8 ? 0 : 1).replace(/\.0$/, "") + "M" : n >= 1e3 ? Math.round(n / 1e3) + "K" : String(n));

function main({ tools, posts, esc, intentOf, INTENTS, isLive, faq, guides, root = "" }) {
  const bySlug = (s) => { const t = tools.find((x) => x.slug === s); if (!t) throw new Error("home-v2: tool does not exist: " + s); return t; };
  const postBySlug = (s) => posts.find((p) => p.slug === s);
  const turl = (s) => `${root}creator-tools/${s}/`;
  const liveCount = tools.filter(isLive).length;
  const plats = PLAT_ORDER.filter((p) => tools.some((t) => t.platform === p));
  const extra = [...new Set(tools.map((t) => t.platform))].filter((p) => !plats.includes(p));
  if (extra.length) throw new Error("home-v2: platform without a slot: " + extra.join(", "));
  const platCount = (p) => tools.filter((t) => t.platform === p).length;
  const intents = INTENT_ORDER.filter((k) => tools.some((t) => intentOf(t) === k));
  const maxPlat = Math.max(...plats.map(platCount));
  const maxSubs = Math.max(...BOARD.rows.map((r) => r[2]));
  const ordered = FIRST.map(bySlug).concat(tools.filter((t) => !FIRST.includes(t.slug)));
  const live = '<span class="live">LIVE</span>';

  const board = BOARD.rows.map(([country, channel, subs], i) => `<li><span class="rk">${String(i + 1).padStart(2, "0")}</span><span class="who"><b>${esc(channel)}</b><span>${esc(country)}</span></span><span class="num">${short(subs)}</span><span class="bar"><i style="width:${Math.round((subs / maxSubs) * 100)}%"></i></span></li>`).join("");
  const stats = [[tools.length, "Free Creator Tools"], [liveCount, "On Live API Data"], [posts.length, "Guides with sources"], [plats.length, "Platforms covered"], ["100%", "Free to Use"], ["0", "Ads, Ever"]]
    .map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join("");
  const jobs = JOBS.map(([tag, title, text, fact, slugs]) => `<div class="box job"><span class="eyebrow">${tag}</span><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="fact">${esc(fact)}</div><ul class="push">${slugs.map(bySlug).map((t) => `<li><a href="${turl(t.slug)}">${esc(t.name)}<span>${isLive(t) ? "LIVE" : ""}</span></a></li>`).join("")}</ul></div>`).join("");
  const signal = SIGNALS.cards.map((c, i) => `<div class="signal" data-hp="signal"${i ? " hidden" : ""}>
        <div class="signal-head"><div><b>${esc(c.title)}</b><small>${esc(c.handle)} &middot; ${c.subs} subscribers &middot; ${esc(c.topic)}</small></div><span class="badge ${c.confidence >= 80 ? "good" : "amber"}">${c.confidence}% confidence</span></div>
        <div class="verdict"><small>Verdict from public signals</small><strong>${esc(c.verdict)}</strong><div class="meter" role="img" aria-label="${c.confidence} percent confidence"><i style="width:${c.confidence}%"></i></div></div>
        <ul class="rows">${c.rows.map(([l, v, ok]) => `<li${ok ? "" : ' class="unknown"'}><span>${esc(l)}</span><span>${esc(v)}</span></li>`).join("")}</ul>
        <div class="panel-foot"><span>Checked ${SIGNALS.date} from the public API.</span><a class="link" href="${turl("youtube-monetization-checker")}" data-channel="${esc(c.handle)}">Run it live</a></div>
      </div>`).join("");
  const facts = FACTS.filter((f) => postBySlug(f[3])).map(([n, label, text, slug, guide]) => `<a href="${root}blog/${slug}/"><b>${n}</b><strong>${esc(label)}</strong><span>${esc(text)}</span><em>Guide: ${esc(guide)}</em></a>`).join("");
  const toolCard = (t, i) => `<a class="tool" href="${turl(t.slug)}" data-hp="tool" data-p="${esc(t.platform)}" data-i="${intentOf(t)}" data-t="${esc((t.name + " " + t.short + " " + t.platform + " " + INTENTS[intentOf(t)].label).toLowerCase())}"${i >= 12 ? " hidden" : ""}><span class="tool-top"><span class="plat ${esc(t.platform)}">${esc(t.platform)}</span>${isLive(t) ? live : ""}</span><h3>${esc(t.name)}</h3><p>${esc(t.short)}</p></a>`;
  const pill = (kind, value, label, n, on) => `<button type="button" data-hp="${kind}" data-v="${esc(value)}" aria-pressed="${on ? "true" : "false"}">${esc(label)}<small>${n}</small></button>`;
  const cmpCell = (v, us) => `<td class="${[us ? "us" : "", /^(Free|Included|Yes|Always)/.test(v) ? "yes" : v === "No" ? "no" : ""].filter(Boolean).join(" ") || "c"}">${esc(v)}</td>`;
  const latestPosts = posts.slice(0, 6);
  const latestSlugs = new Set(latestPosts.map((p) => p.slug));
  const guideLinks = guides.map(postBySlug).filter((p) => p && !latestSlugs.has(p.slug)).slice(0, 8);
  const otherTools = plats.filter((p) => p !== "YouTube").flatMap((p) => tools.filter((t) => t.platform === p).slice(0, 2));

  const html = `<div class="root" data-hp="root" data-root="${root}">

<section class="hero">
  <div class="in">
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="badge accent">Free vidIQ and TubeBuddy alternative</span>
        <h1>Free YouTube SEO <em>&amp; Creator Tools</em></h1>
        <p class="lede">Check if a channel is monetized, research YouTube keywords, generate tags and titles, and estimate channel earnings. Live data from the official YouTube and Twitch APIs, with no sign-up.</p>
        <form class="checker" action="${turl(MODES[0][1])}" method="get" data-hp="checker">
          <div class="modes" role="group" aria-label="What to check">${MODES.map(([label, slug, cta], i) => `<button type="button" data-hp="mode" data-action="${turl(slug)}" data-cta="${cta}" aria-pressed="${i ? "false" : "true"}">${label}</button>`).join("")}</div>
          <div class="checker-row">
            <label for="hp-handle"><span aria-hidden="true">@</span><input id="hp-handle" name="channel" type="text" autocomplete="off" spellcheck="false" placeholder="mkbhd or a channel link" aria-describedby="hp-note" required></label>
            <button type="submit" class="btn"><span data-hp="cta">Check channel</span><span class="arrow" aria-hidden="true"></span></button>
          </div>
          <p class="checker-note" id="hp-note">Type a handle or paste a channel link. Free, no sign-up.</p>
        </form>
        <div class="quick">
          <a href="${root}youtube-extension/">Free Chrome Extension</a>
          <a href="${root}app/">Creator Dashboard</a>
          <a href="${root}youtube-seo-service/">Done-For-You YouTube SEO</a>
        </div>
        <div class="trust"><span class="badge">No sign-up</span><span class="badge">Free Chrome extension</span><span class="badge">Works in Claude &amp; ChatGPT</span><span class="badge">Every formula shown</span></div>
      </div>
      <div class="panel board">
        <div class="panel-head"><h2>Most subscribed YouTube channel, by country</h2><span class="badge good">Live API</span></div>
        <ol>${board}</ol>
        <div class="panel-foot"><span>Subscribers on ${BOARD.date}. Country is the one on the channel's About page.</span><a class="link" href="${turl("top-youtube-channels-by-country")}">See all 40 countries</a></div>
      </div>
    </div>
    <div class="stats">${stats}</div>
  </div>
</section>

<section class="sec">
  <div class="in">
    <div class="head">
      <div><span class="eyebrow">What you can do</span><h2>Free YouTube SEO tools for keywords, tags, titles and channel audits</h2></div>
      <p>Six jobs creators and brands come here for. Each one opens a free tool that shows its formula, and the tools marked LIVE read the official API while you wait.</p>
    </div>
    <div class="cols-3">${jobs}</div>
  </div>
</section>

<section class="sec">
  <div class="in cols-2">
    <div class="copy">
      <span class="eyebrow">YouTube monetization checker</span>
      <h2>See if a YouTube channel is monetized, with the signals behind the verdict</h2>
      <p>Paste any channel. You get a verdict with a confidence score, and every Partner Program signal behind it is listed.</p>
      <ul class="checks">
        <li>Eligibility signals from public data: subscribers, uploads in 90 days, made for kids</li>
        <li>Ad placements read from the channel's recent uploads</li>
        <li>The full ad check runs in your own browser with the free Chrome extension</li>
      </ul>
      <div class="cta-row">
        <a class="btn" href="${turl("youtube-monetization-checker")}">Run a live check</a>
        <a class="btn ghost" href="${root}youtube-extension/">Install Chrome Extension</a>
      </div>
    </div>
    <div class="panel">
      <div class="tabs" role="tablist" aria-label="Example channels">${SIGNALS.cards.map((c, i) => `<button type="button" role="tab" data-hp="tab" aria-selected="${i ? "false" : "true"}">${esc(c.handle)}</button>`).join("")}</div>
      ${signal}
    </div>
  </div>
</section>

<section class="sec">
  <div class="in cols-2">
    <div class="term" aria-label="Example assistant conversation">
      <div class="term-bar"><i></i><i></i><i></i><span>passivearray.com/mcp</span></div>
      <div class="term-body" data-hp="term">
        <div class="prompt">you&nbsp; <b>Audit the comment section of ${AUDIT.handle}</b></div>
        <div class="call">&rarr; audit_channel_comments &middot; Passive Array</div>
        <div class="score"><b>${AUDIT.score}</b><span>/100</span><em>${AUDIT.grade}</em></div>
        <dl>${AUDIT.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
        <div class="say">${esc(AUDIT.summary)}</div>
        <div class="stamp">${esc(AUDIT.stamp)}</div>
      </div>
      <div class="term-actions"><button type="button" data-hp="replay">Replay</button><button type="button" data-hp="copy" data-url="https://passivearray.com/mcp">Copy server URL</button></div>
    </div>
    <div class="copy">
      <span class="eyebrow">New &middot; YouTube analytics MCP server</span>
      <h2>Ask Claude or ChatGPT about any YouTube channel</h2>
      <p>Connect Claude, ChatGPT, Cursor or VS Code to Passive Array, then just ask. Your assistant pulls live channel stats, growth history, comment analysis and keyword research while you chat.</p>
      <ul class="checks">
        <li>13 tools your assistant can call, from channel stats to the full comment audit</li>
        <li>50 free credits a day with a free account, 1,000 on Pro</li>
        <li>Same data and rules as the tools on this site, so the answers match</li>
      </ul>
      <div class="cta-row">
        <a class="btn" href="${root}account/#mcp">Get your free MCP key</a>
        <a class="btn ghost" href="${root}mcp">How to connect</a>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="in">
    <div class="head">
      <div><span class="eyebrow">YouTube Partner Program numbers</span><h2>The YouTube monetization requirements and revenue shares creators search for</h2></div>
      <p>Eight figures that decide what a channel can earn. Each one links to the guide that quotes YouTube's own wording and shows how to apply it.</p>
    </div>
    <div class="facts">${facts}</div>
    <p class="source">Source: YouTube Help, quoted in the linked guides. Checked November 2026. Thresholds for new Partner Program applicants rise from 1 February 2027.</p>
  </div>
</section>

<section class="sec" id="tools">
  <div class="in">
    <div class="head">
      <div><span class="eyebrow">Tool directory</span><h2>All ${tools.length} free creator tools for ${plats.slice(0, -1).join(", ")} and ${plats.slice(-1)}</h2></div>
      <p>${liveCount} of the ${tools.length} read live API data. The rest work from numbers you type in, and say so on the page. Type to search, or filter by platform and job.</p>
    </div>
    <div class="dir-top">
      <div class="dir-tools">
        <label class="search" for="hp-q"><span aria-hidden="true">/</span><input id="hp-q" type="search" placeholder="Search tools: tags, money, audit, shorts" autocomplete="off" data-hp="q"><kbd>/</kbd></label>
        <div class="pills" role="group" aria-label="Platform">${pill("plat", "all", "All platforms", tools.length, true)}${plats.map((p) => pill("plat", p, p, platCount(p))).join("")}</div>
        <div class="pills" role="group" aria-label="What you want to do">${pill("intent", "all", "All", tools.length, true)}${intents.map((k) => pill("intent", k, INTENTS[k].label, tools.filter((t) => intentOf(t) === k).length)).join("")}</div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Tools by platform</h3><span class="badge">${tools.length} tools</span></div>
        <div class="mix">${plats.map((p) => `<div><span>${p}</span><span class="track"><i style="width:${Math.round((platCount(p) / maxPlat) * 100)}%"></i></span><b>${platCount(p)}</b></div>`).join("")}</div>
      </div>
    </div>
    <p class="count" data-hp="count" aria-live="polite">Showing 12 of ${tools.length} tools</p>
    <div class="grid" data-hp="grid" data-total="${tools.length}">${ordered.slice(0, 12).map(toolCard).join("")}</div>
    <script type="application/json" data-hp="more-tools">${JSON.stringify(ordered.slice(12).map((t, i) => toolCard(t, i + 12))).replace(/</g, "\\u003c")}</script>
    <div class="empty" data-hp="empty" hidden>Nothing matches. Try another word, or <button type="button" class="btn ghost sm" data-hp="reset">clear the filters</button></div>
    <div class="dir-foot"><button type="button" class="btn ghost" data-hp="more">Show all ${tools.length} tools</button><a class="link" href="${root}creator-tools/">Open the full tool directory</a></div>
  </div>
</section>

<section class="sec">
  <div class="in">
    <div class="head">
      <div><span class="eyebrow">YouTube research</span><h2>YouTube keyword research and outlier videos, measured every day</h2></div>
      <p>Four things the site does beyond single tools. The table shows videos from the current outlier feed, with how far each one beat its channel's usual views.</p>
    </div>
    <div class="pillars">
      <a href="${root}research/"><span class="n">01</span><h3>Keyword research that is measured</h3><p>What the top results actually do for a keyword: views per day, channel sizes, freshness. Never a modelled search volume.</p></a>
      <a href="${root}research/outliers/"><span class="n">02</span><h3>Outlier videos, refreshed daily</h3><p>Videos and Shorts doing 3x to 100x what their channel normally does, from the last 90 days.</p></a>
      <a href="${turl("youtube-channel-quality-checker")}"><span class="n">03</span><h3>Channel checks on live data</h3><p>Monetization signals, engagement rate, views per subscriber and a quality score, straight from the YouTube and Twitch APIs.</p></a>
      <a href="${root}app/"><span class="n">04</span><h3>Watch channels over time</h3><p>Save channels to a watchlist and see 7-day and 30-day change. Pro adds a Monday email of who moved and CSV export.</p></a>
    </div>
    <div class="panel" data-hp="outliers" hidden>
      <div class="panel-head"><h3>From the YouTube outlier feed</h3><span class="badge good" data-hp="out-count"></span></div>
      <div class="tablewrap"><table><thead><tr><th scope="col">Video</th><th scope="col" class="r">Views</th><th scope="col" class="r">Subscribers</th><th scope="col" class="r">x usual</th></tr></thead><tbody data-hp="out-rows"></tbody></table></div>
      <div class="panel-foot"><span data-hp="out-date"></span><a class="link" href="${root}research/outliers/">Open the full outlier feed</a></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="in">
    <div class="ext">
      <div>
        <span class="eyebrow">Free Chrome extension &middot; No sign-up</span>
        <h2>A free YouTube Chrome extension for tags, engagement rate and monetization</h2>
        <p>Stop switching tabs while researching competitors. The extension adds a sidebar to YouTube video, channel and search pages.</p>
        <div class="cta-row">
          <a class="btn" href="${root}youtube-extension/">Install Free Chrome Extension</a>
          <a class="btn ghost" href="${turl("youtube-tag-generator")}">Try Tag Generator Online</a>
        </div>
      </div>
      <ul>
        <li><b>Engagement rate and velocity</b><span>Compare any video against the channel's usual views</span></li>
        <li><b>Monetization and SEO audit</b><span>Ad signals, title score and description structure</span></li>
        <li><b>Hidden competitor tags</b><span>Inspect and copy tags from top-ranking videos in one click</span></li>
      </ul>
    </div>
    <div class="head" style="margin-top:72px">
      <div><span class="eyebrow">Two ways to go further</span><h2>YouTube channel tracking, or a done-for-you YouTube SEO service</h2></div>
      <p>The tools stay free. These are the two paid options, for creators who want daily tracking or hands-on help.</p>
    </div>
    <div class="cols-2">
      <div class="box plan">
        <span class="badge accent">Automated tracking</span>
        <h3>Creator Dashboard &amp; Pro Watchlist</h3>
        <div class="price">$9 <small>a month, or a free tier with 3 channels</small></div>
        <p>Connect your channel, track monetization progress and benchmark against competitors.</p>
        <ul class="checks">
          <li>Track up to 100 channels daily with 7-day and 30-day subscriber and view change</li>
          <li>Monday email ranking which competitors grew fastest</li>
          <li>CSV exports of watchlists, outlier feeds and viral Shorts</li>
          <li>1,000 MCP credits a day for Claude, ChatGPT and Cursor</li>
        </ul>
        <div class="cta-row push"><a class="btn" href="${root}app/">Open Creator Dashboard</a><a class="btn ghost" href="${root}pricing/">See Pro pricing</a></div>
      </div>
      <div class="box plan">
        <span class="badge">Done-for-you service &middot; By Nasir Uddin</span>
        <h3>Done-For-You YouTube SEO Service</h3>
        <div class="price"><small>Founder-led, priced per package</small></div>
        <p>Founder Nasir Uddin audits your channel and optimizes your videos for search and suggested reach.</p>
        <ul class="checks">
          <li>Full channel audit: your last 20 uploads, keyword gaps, title and thumbnail fixes</li>
          <li>Monthly video SEO: keyword research, titles, chapters and 500-character tag sets</li>
          <li>Channel setup and relaunch: positioning, playlists and a 30-day content roadmap</li>
          <li>Works through the YouTube Studio Editor role, in any market</li>
        </ul>
        <div class="cta-row push"><a class="btn" href="${root}youtube-seo-service/">View YouTube SEO packages</a><a class="btn ghost" href="${root}founder/">Meet Nasir Uddin</a></div>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="in">
    <div class="head">
      <div><span class="eyebrow">vidIQ and TubeBuddy alternative</span><h2>Passive Array compared with vidIQ and TubeBuddy</h2></div>
      <p>What you can do without paying anyone. Checked November 2026 from their own public pages.</p>
    </div>
    <div class="panel"><div class="tablewrap"><table class="cmp">
      <thead><tr><th scope="col">Feature</th><th scope="col" class="us">Passive Array<small>Free, Pro optional</small></th><th scope="col"><a href="${root}compare/vidiq-alternative/">vidIQ alternative</a><small>Free tier, then paid</small></th><th scope="col"><a href="${root}compare/tubebuddy-alternative/">TubeBuddy alternative</a><small>Free tier, then paid</small></th></tr></thead>
      <tbody>${CMP.map(([f, a, b, c]) => `<tr><th scope="row">${esc(f)}</th>${cmpCell(a, true)}${cmpCell(b)}${cmpCell(c)}</tr>`).join("")}</tbody>
    </table></div></div>
    <p class="fair">Both are capable products with real depth on their paid tiers, and both do things we cannot: read your private analytics, publish for you, and test thumbnails on live traffic. <a class="link" href="${root}compare/">The full comparison says where they win.</a></p>
  </div>
</section>

${posts.length ? `<section class="sec">
  <div class="in">
    <div class="head">
      <div><span class="eyebrow">Creator blog</span><h2>YouTube SEO guides and creator earnings, explained with sources</h2></div>
      <p>${posts.length} guides on monetization, earnings, YouTube SEO and sponsorship pricing. Each one quotes the official page it relies on and links the tool that runs the numbers. <a class="link" href="${root}blog/">All articles</a> &middot; <a class="link" href="${root}rss.xml">RSS feed</a></p>
    </div>
    <div class="cols-3">${latestPosts.map((p) => `<a class="box post" href="${root}blog/${p.slug}/"><span class="post-top"><span>${esc(p.category.label || p.category)}</span><span>${p.minutes} min read</span></span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></a>`).join("")}</div>
    <div class="guides">${guideLinks.map((p) => `<a href="${root}blog/${p.slug}/"><span>${esc(p.title)}</span><span class="arrow" aria-hidden="true"></span></a>`).join("")}</div>
  </div>
</section>` : ""}

<section class="sec">
  <div class="in">
    <div class="head">
      <div><span class="eyebrow">FAQ</span><h2>Questions about free YouTube SEO tools</h2></div>
      <p>Short answers on price, accounts, where the numbers come from and why there is no search volume figure. <a class="link" href="${root}faq/">All YouTube tool questions</a></p>
    </div>
    <div class="faq-grid">
      <div class="faq">${faq.map(([q, a], i) => `<details${i ? "" : " open"}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
      <div class="box popular">
        <h3>Popular free YouTube tools</h3>
        <div class="chips">${POPULAR.map(bySlug).map((t) => `<a href="${turl(t.slug)}">${esc(t.name)}</a>`).join("")}</div>
        <h3>Other platforms</h3>
        <div class="chips">${otherTools.map((t) => `<a href="${turl(t.slug)}">${esc(t.name)}</a>`).join("")}</div>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="in final">
    <div><h2>Start growing your YouTube channel today</h2><p>Use all ${tools.length} creator tools free with no sign-up, or work with Nasir Uddin on hands-on YouTube SEO.</p></div>
    <div class="cta-row"><a class="btn" href="#tools">Try free tools</a><a class="btn ghost" href="${root}youtube-seo-service/">Done-For-You YouTube SEO</a></div>
  </div>
</section>

</div>`;
  return prefixHtml(html);
}

module.exports = { main, css };
