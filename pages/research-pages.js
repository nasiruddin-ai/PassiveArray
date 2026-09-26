// Research section: /research/ (keywords), /research/outliers/ (videos doing far
// better than their channel normally does), /research/shorts/ (the same for
// Shorts). Built by build.js. Data comes from lib/research.js and lib/outliers.js.

const fs = require("fs");
const path = require("path");
const site = require("../creator-tools/build-tools.js");
const { esc, ICON } = site;

const TABS = [
  ["keywords", "Keywords", "research/"],
  ["outliers", "Outlier videos", "research/outliers/"],
  ["shorts", "Shorts", "research/shorts/"],
];

function tabs(active, root) {
  return `<nav class="rtabs" aria-label="Research sections">${TABS.map(([key, label, href]) => `<a href="${root}${href}"${key === active ? ' class="on"' : ""}>${esc(label)}</a>`).join("")}<a href="${root}research/outliers/?view=thumbs">Thumbnails</a><a href="${root}creator-tools/find-youtube-influencers-by-niche/">Channels <span class="soon">GROWTH SOON</span></a></nav>`;
}

function keywordsPage() {
  const root = "../";
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="${root}">Home</a> / Research</div>
    <h1>YouTube keyword research, measured</h1>
    <p class="lead">Type a phrase. See what YouTube autocompletes around it, who ranks for it today and how beatable they are. Every number on this page is measured from YouTube, never modelled.</p>
    <div class="meta"><span><b>FREE</b> no account</span><span><b>LIVE</b> YouTube Data API</span><span><b>HONEST</b> no invented search volume</span></div>
  </div>
  ${tabs("keywords", root)}

  <form class="bigsearch" id="kwform" role="search" style="margin:0 0 10px">
    ${ICON.search}
    <label for="kw" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0">Keyword</label>
    <input id="kw" type="text" placeholder="e.g. home workout for beginners" autocomplete="off" maxlength="80">
    <button type="submit" class="btn" id="kwgo">Research ${ICON.arrow}</button>
  </form>
  <div class="tryline" style="justify-content:flex-start;margin:0 0 18px">
    <span>Try:</span>
    <a href="?q=home%20workout" data-kw="home workout">home workout</a>
    <a href="?q=squarespace%20tutorial" data-kw="squarespace tutorial">squarespace tutorial</a>
    <a href="?q=how%20to%20start%20a%20podcast" data-kw="how to start a podcast">how to start a podcast</a>
    <span class="status" id="kwstatus" style="margin-left:auto"></span>
  </div>

  <div class="results" id="kwresults"></div>

  <section class="section" id="saved-section" hidden>
    <div class="section-head"><h2>Your saved keywords</h2><span class="sub">Stored in this browser only</span></div>
    <div class="card"><div class="tablewrap"><table id="savedtable"><thead><tr><th>Keyword</th><th class="num">Score</th><th class="num">Competing videos</th><th class="num">Top-10 avg views</th><th>Checked</th><th></th></tr></thead><tbody></tbody></table></div></div>
  </section>

  <div class="two" id="howblock">
    <section class="card how">
      <h2 style="margin-bottom:12px">How the numbers are made</h2>
      <ol>
        <li><b>Suggestions</b> come from YouTube's own autocomplete: the phrase itself, then the phrase followed by each letter and a few modifiers. Rank is the position YouTube shows them in. Count is how many prefixes produced the same phrase.</li>
        <li><b>Competing videos</b> is YouTube's own estimate of results for the phrase. It is rounded and capped, but it separates a thousand-video niche from a million-video one.</li>
        <li><b>Top 10</b> are the ten videos YouTube ranks first by relevance right now, with live view counts and channel sizes from the API.</li>
        <li><b>Opportunity score</b> out of 100: competition 35 (fewer videos is better), weak incumbents 30 (share of top-10 channels under 100K subscribers), demand 20 (average views of the top 10), freshness 15 (share published in the last year).</li>
        <li><b>Why no search volume?</b> Nobody outside Google has YouTube search volume. Other tools model it and show it as a fact. We show only what we can measure.</li>
      </ol>
    </section>
    <section class="card next">
      <h2>More research</h2>
      <a href="${root}research/outliers/">Videos doing 3x to 100x their channel's normal, updated daily <b>Outliers</b></a>
      <a href="${root}research/shorts/">The same feed, Shorts only <b>Shorts</b></a>
      <a href="${root}research/outliers/?view=thumbs">Study the thumbnails that broke out <b>Thumbnails</b></a>
      <a href="${root}youtube-extension/">The same keyword score inside YouTube search <b>Extension</b></a>
    </section>
  </div>`;

  return site.shell({
    title: "YouTube Keyword Research",
    ogTitle: "Free YouTube keyword research with measured numbers | Passive Array",
    description: "Free YouTube keyword research: real autocomplete suggestions, competing videos, the top 10 and how beatable they are. Measured from YouTube, never modelled. No account.",
    path: "/research/",
    active: "research",
    body,
    scripts: `<script src="${root}creator-tools/research.js"></script>`,
    jsonld: webApp("YouTube Keyword Research", "/research/", "Free YouTube keyword research with measured numbers."),
  });
}

function outliersPage(kind) {
  const root = "../../";
  const shorts = kind === "shorts";
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="${root}">Home</a> / <a href="${root}research/">Research</a> / ${shorts ? "Shorts" : "Outlier videos"}</div>
    <h1>${shorts ? "Shorts that broke out" : "Outlier videos"}</h1>
    <p class="lead">${shorts ? "Shorts from the last 90 days that did 3x to 100x what their channel's other uploads did." : "Videos from the last 90 days that did 3x to 100x what their channel's other uploads did. Not the biggest videos, the biggest surprises."} Measured from the YouTube API and refreshed daily.</p>
    <div class="meta"><span><b>DAILY</b> updated by a scheduled job</span><span><b>MEASURED</b> views / channel median</span><span id="ostatus"></span></div>
  </div>
  ${tabs(kind, root)}

  <div class="ofilters" id="ofilters" data-kind="${kind}">
    <select id="otopic" aria-label="Topic"><option value="">All topics</option></select>
    <select id="omin" aria-label="Minimum multiplier"><option value="3">3x and above</option><option value="5">5x and above</option><option value="10">10x and above</option><option value="25">25x and above</option></select>
    <select id="odays" aria-label="Published within"><option value="90">Last 90 days</option><option value="30">Last 30 days</option><option value="7">Last 7 days</option></select>
    <select id="osort" aria-label="Sort"><option value="multiplier">Biggest multiplier</option><option value="views">Most views</option><option value="newest">Newest</option></select>
    <button type="button" class="fbtn" id="oview" data-on="cards">Thumbnail grid</button>
  </div>
  <p class="ostat" id="ocount"></p>
  <div class="ogrid" id="ogrid"></div>

  <div class="two">
    <section class="card how">
      <h2 style="margin-bottom:12px">How this works</h2>
      <ol>
        <li>Every keyword researched on this site adds the channels that rank for it to an index. A daily job walks that index and pulls each channel's last 10 uploads from the YouTube Data API.</li>
        <li>For every upload from the last 90 days, the multiplier is its views divided by the median views of the channel's other recent uploads. A 20x video did twenty times what that channel normally does.</li>
        <li>Videos with a multiplier of 3 or more and at least 1,000 views make the feed. Live streams are skipped. ${shorts ? "This page keeps only uploads of 60 seconds or less." : "Shorts have their own page."}</li>
        <li>Topics come from YouTube's own channel categories. The feed grows as more keywords are researched, so a niche you care about gets richer the more you use the keyword tool.</li>
      </ol>
    </section>
    <section class="card next">
      <h2>Do something with it</h2>
      <a href="${root}research/">Research the keyword behind a breakout <b>Keywords</b></a>
      <a href="${root}creator-tools/youtube-channel-quality-checker/">Grade the channel that had the outlier <b>Check</b></a>
      <a href="${root}creator-tools/youtube-sponsorship-price-calculator/">What a sponsor should pay that channel now <b>Price</b></a>
      <a href="${root}creator-tools/youtube-lookalike-finder/">Find channels like it <b>Lookalikes</b></a>
    </section>
  </div>`;

  return site.shell({
    title: shorts ? "YouTube Shorts Outliers" : "YouTube Outlier Videos",
    ogTitle: (shorts ? "Shorts that broke out" : "YouTube outlier videos") + ", measured daily | Passive Array",
    description: shorts ? "Shorts from the last 90 days that did 3x to 100x their channel's normal views. Measured from the YouTube API, refreshed daily, free." : "Videos from the last 90 days that did 3x to 100x their channel's normal views, by topic. Measured from the YouTube API, refreshed daily, free.",
    path: shorts ? "/research/shorts/" : "/research/outliers/",
    active: "research",
    body,
    scripts: `<script src="${root}creator-tools/research.js"></script>`,
    jsonld: webApp(shorts ? "YouTube Shorts Outliers" : "YouTube Outlier Videos", shorts ? "/research/shorts/" : "/research/outliers/", "Videos that did far better than their channel normally does, updated daily."),
  });
}

function webApp(name, p, description) {
  return {
    "@context": "https://schema.org", "@type": "WebApplication", name, url: site.SITE + p, description,
    applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: { "@type": "Organization", name: site.BRAND, url: site.SITE },
  };
}

function buildInto(dist) {
  const write = (rel, html) => { const dir = path.join(dist, rel); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, "index.html"), html); };
  write("research", keywordsPage());
  write(path.join("research", "outliers"), outliersPage("outliers"));
  write(path.join("research", "shorts"), outliersPage("shorts"));
  return ["/research/", "/research/outliers/", "/research/shorts/"];
}

module.exports = { keywordsPage, outliersPage, buildInto };
