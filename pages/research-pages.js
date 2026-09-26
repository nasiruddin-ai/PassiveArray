// Research section: /research/ (keyword research). Built by build.js.
// Future tabs (outlier videos, Shorts, channels, thumbnails) are built on the
// same index that this page starts filling; see lib/research.js.

const fs = require("fs");
const path = require("path");
const site = require("../creator-tools/build-tools.js");
const { esc, ICON } = site;

function researchPage() {
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="../">Home</a> / Research</div>
    <h1>YouTube keyword research, measured</h1>
    <p class="lead">Type a phrase. See what YouTube autocompletes around it, who ranks for it today and how beatable they are. Every number on this page is measured from YouTube, never modelled.</p>
    <div class="meta"><span><b>FREE</b> no account</span><span><b>LIVE</b> YouTube Data API</span><span><b>HONEST</b> no invented search volume</span></div>
  </div>

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
      <h2>Coming next in Research</h2>
      <a href="../creator-tools/youtube-channel-quality-checker/">Outlier videos: uploads doing 5x to 100x their channel's normal <b>Soon</b></a>
      <a href="../creator-tools/find-youtube-influencers-by-niche/">Fast-growing channels by niche <b>Soon</b></a>
      <a href="../creator-tools/youtube-lookalike-finder/">Thumbnail study grid for any keyword <b>Soon</b></a>
      <a href="../youtube-extension/">The same keyword score inside YouTube search <b>Extension</b></a>
    </section>
  </div>`;

  return site.shell({
    title: "YouTube Keyword Research",
    ogTitle: "Free YouTube keyword research with measured numbers | Passive Array",
    description: "Free YouTube keyword research: real autocomplete suggestions, competing videos, the top 10 and how beatable they are. Measured from YouTube, never modelled. No account.",
    path: "/research/",
    active: "research",
    body,
    scripts: `<script src="../creator-tools/research.js"></script>`,
    jsonld: {
      "@context": "https://schema.org", "@type": "WebApplication", name: "YouTube Keyword Research", url: site.SITE + "/research/",
      description: "Free YouTube keyword research with measured numbers.", applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, provider: { "@type": "Organization", name: site.BRAND, url: site.SITE },
    },
  });
}

function buildInto(dist) {
  const dir = path.join(dist, "research");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), researchPage());
  return ["/research/"];
}

module.exports = { researchPage, buildInto };
