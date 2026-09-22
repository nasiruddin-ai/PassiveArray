// Pages for the Passive Array for YouTube browser extension, built into
//   dist/youtube-extension/index.html           landing page
//   dist/youtube-extension/privacy/index.html   privacy policy (linked from the Chrome Web Store listing)
// Uses the same header, footer and stylesheet as the rest of the site.

const { header, footer, esc, SITE } = require("../creator-tools/build-tools.js");

const NAME = "Passive Array for YouTube";
// Paste the Chrome Web Store link here once the listing is live. Until then the
// landing page shows the "load unpacked" steps instead of an install button.
const STORE_URL = "";
const EFFECTIVE = "22 September 2026";

function shell({ title, description, root, path, body, active }) {
  const canonical = SITE + path;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | Passive Array</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)} | Passive Array">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/og-image-1200x630.png">
<link rel="icon" href="${root}favicon.ico" sizes="48x48">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${root}apple-touch-icon.png">
<meta name="theme-color" content="#1F2A44">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${root}creator-tools/shared.css">
<script>try{var t=localStorage.getItem("pa-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>
<style>
  .ext-hero { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 32px; align-items: center; padding: 40px 0 28px; }
  .ext-hero h1 { font-size: 2.4rem; margin-bottom: 12px; }
  .ext-hero p.lead { font-size: 1.1rem; color: var(--muted); max-width: 40ch; }
  .ext-cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; align-items: center; }
  .ext-cta .note { font-size: .85rem; color: var(--muted); }
  .ext-mock { border: 1px solid var(--line); border-radius: 14px; background: var(--card); padding: 14px; font-size: .85rem; box-shadow: 0 10px 40px rgba(31,42,68,.08); }
  .ext-mock .hero { background: linear-gradient(135deg, #2A9D8F, #5B6ABF); color: #fff; border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; }
  .ext-mock .hero .l { font-size: .7rem; text-transform: uppercase; letter-spacing: .04em; opacity: .85; }
  .ext-mock .hero .v { font-size: 1.7rem; font-weight: 600; }
  .ext-mock .g { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .ext-mock .t { background: var(--bg); border-radius: 8px; padding: 7px 9px; }
  .ext-mock .t .l { font-size: .7rem; color: var(--muted); }
  .ext-mock .t .v { font-weight: 600; }
  .ext-mock .chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
  .ext-mock .chips span { border: 1px solid var(--line); border-radius: 999px; padding: 3px 8px; font-size: .75rem; }
  .steps { counter-reset: s; display: grid; gap: 10px; }
  .steps li { list-style: none; position: relative; padding-left: 40px; }
  .steps li::before { counter-increment: s; content: counter(s); position: absolute; left: 0; top: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--deep); color: #fff; display: grid; place-items: center; font-weight: 600; font-size: .85rem; }
  .prose h2 { font-size: 1.3rem; margin: 28px 0 10px; }
  .prose h3 { font-size: 1.05rem; margin: 18px 0 6px; }
  .prose p, .prose li { color: var(--text); line-height: 1.6; }
  .prose ul { padding-left: 20px; }
  .prose table { width: 100%; border-collapse: collapse; font-size: .92rem; margin: 10px 0; }
  .prose th, .prose td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
  .prose th { color: var(--muted); font-weight: 500; }
  @media (max-width: 860px) { .ext-hero { grid-template-columns: 1fr; padding-top: 20px; } .ext-hero h1 { font-size: 1.9rem; } }
</style>
</head>
<body>
${header(root, active, false)}
<main class="wrap">
${body}
</main>
${footer(root, "The extension is free and needs no account. Numbers come from YouTube's public data and the official YouTube Data API.")}
<script src="${root}creator-tools/site.js"></script>
</body>
</html>`;
}

function installBlock(root) {
  if (STORE_URL) {
    return `<div class="ext-cta"><a class="btn" href="${STORE_URL}" rel="noopener">Add to Chrome, it's free</a><span class="note">Works in Chrome, Edge and Brave. No account.</span></div>`;
  }
  return `<div class="ext-cta"><a class="btn" href="#install">Install steps</a><span class="note">Chrome Web Store listing is on its way. Until then it installs in one minute by hand.</span></div>`;
}

function landingPage() {
  const root = "../";
  const body = `
  <section class="ext-hero">
    <div>
      <div class="crumbs"><a href="${root}">Home</a> / Browser extension</div>
      <h1>See what a YouTube video is really doing</h1>
      <p class="lead">Engagement rate, hidden tags, views per day and a keyword score, right on the YouTube page. Free, no sign-up, no ads.</p>
      ${installBlock(root)}
    </div>
    <div class="ext-mock" aria-hidden="true">
      <div class="hero"><div class="l">Engagement rate by views</div><div class="v">4.82% <span style="font-size:.7rem;background:#8FD3C7;color:#0E2E29;border-radius:999px;padding:3px 8px;vertical-align:middle">Good</span></div></div>
      <div class="g">
        <div class="t"><div class="l">Views</div><div class="v">128K</div></div>
        <div class="t"><div class="l">Likes</div><div class="v">5.9K</div></div>
        <div class="t"><div class="l">Comments</div><div class="v">312</div></div>
        <div class="t"><div class="l">Subscribers</div><div class="v">41K</div></div>
        <div class="t"><div class="l">Views per day</div><div class="v">1.4K</div></div>
        <div class="t"><div class="l">Published</div><div class="v">Jun 3, 2026</div></div>
      </div>
      <div class="chips"><span>squarespace seo</span><span>seo tutorial</span><span>website tips</span><span>small business</span><span>+12 tags</span></div>
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>What it adds to YouTube</h2></div>
    <div class="grid c3">
      <div class="card"><h3>Video panel</h3><p>Engagement rate with a grade, views per day, likes and comments as a share of views, and the video's hidden tags with one-click copy. Reads the page itself, no key needed.</p></div>
      <div class="card"><h3>Channel panel</h3><p>Engagement across the last 10 uploads, views per subscriber, uploads per month, Shorts share, channel keywords, and which recent videos beat the channel's average.</p></div>
      <div class="card"><h3>Search scores</h3><p>Under every result: views per day, engagement grade, channel size and a views-to-subs ratio. Small channels that are ranking get flagged, the sign of an open topic.</p></div>
      <div class="card"><h3>Keyword tool</h3><p>Type a topic and get an overall score, interest, competition, "people also search" ideas and the top 20 results with the numbers that matter. Cached so it stays fast.</p></div>
      <div class="card"><h3>Title, description and tag writer</h3><p>Ten title angles with character counts, a description with timestamps and links placeholders, and a tag list under 500 characters. Never invents facts.</p></div>
      <div class="card"><h3>Honest by design</h3><p>Scores are estimates from the top results, and the extension says so. No "search volume" made up from thin air, no upsell, no login wall.</p></div>
    </div>
  </section>

  <section class="section" id="install">
    <div class="section-head"><h2>Install</h2></div>
    <div class="card">
      ${STORE_URL ? `<p>Click <a href="${STORE_URL}" rel="noopener">Add to Chrome</a> on the Chrome Web Store. Works in Edge and Brave too.</p>` : `
      <p>The Chrome Web Store listing is being reviewed. Until it is live, install the folder by hand (one minute):</p>
      <ol class="steps">
        <li>Download the extension zip from the link your Passive Array contact sent you and unzip it anywhere on your PC.</li>
        <li>Open Chrome and type <code>chrome://extensions</code> in the address bar. In Edge use <code>edge://extensions</code>.</li>
        <li>Turn on <b>Developer mode</b> (switch in the top right).</li>
        <li>Click <b>Load unpacked</b> and choose the unzipped folder.</li>
        <li>Open any YouTube video. The panel appears in the sidebar. Click the extension icon for the keyword tool.</li>
      </ol>`}
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Questions</h2></div>
    <div class="grid c2">
      <div class="card"><h3>Is it really free?</h3><p>Yes. The YouTube numbers come from the official YouTube Data API on a free allowance, and the video panel does not use the API at all.</p></div>
      <div class="card"><h3>Do I need an account?</h3><p>No. Nothing to sign up for, nothing to log in to, and the extension never sees your Google account.</p></div>
      <div class="card"><h3>What does it send anywhere?</h3><p>Only the video ID, channel link or keyword you are looking at, to passivearray.vercel.app, so the API key can stay on the server. Details in the <a href="privacy/">privacy policy</a>.</p></div>
      <div class="card"><h3>Are the scores real search volume?</h3><p>No. They are estimates built from the top 20 results: how much they are watched, how big the channels are, how fresh they are. The tool says this on every report.</p></div>
    </div>
  </section>`;
  return shell({ title: NAME, description: "Free Chrome extension: engagement rate, hidden tags, views per day, channel insights, search scores and a keyword tool, right on YouTube. No account.", root, path: "/youtube-extension/", body, active: "" });
}

function privacyPage() {
  const root = "../../";
  const body = `
  <div class="tool-head" style="padding-top:28px">
    <div>
      <div class="crumbs"><a href="${root}">Home</a> / <a href="../">Browser extension</a> / Privacy policy</div>
      <h1>Privacy policy</h1>
      <p class="intro">For the ${esc(NAME)} browser extension. Effective ${EFFECTIVE}.</p>
    </div>
  </div>

  <div class="card prose">
    <h2 style="margin-top:0">The short version</h2>
    <ul>
      <li>The extension has no accounts and does not know who you are.</li>
      <li>It reads the YouTube page you are on to show numbers about that video, channel or search.</li>
      <li>It sends the video ID, channel link or keyword you are looking at to our server (passivearray.vercel.app) so the YouTube API key can stay on the server instead of inside the extension.</li>
      <li>It does not collect your browsing history, does not use analytics or tracking, does not show ads, and does not sell or share data with anyone.</li>
    </ul>

    <h2>What the extension reads</h2>
    <p>The extension only runs on pages under <code>www.youtube.com</code>. On those pages it reads:</p>
    <ul>
      <li><b>Video pages:</b> the video ID in the address bar and the public data YouTube already sent to the page (title, view count, likes, comments, tags, description, publish date, channel name and subscriber count).</li>
      <li><b>Channel pages:</b> the channel handle or ID in the address bar.</li>
      <li><b>Search pages:</b> the search words in the address bar and the video IDs of the results shown.</li>
      <li><b>The popup:</b> the keyword or topic and notes you type in.</li>
    </ul>

    <h2>What is sent, and where</h2>
    <table>
      <tr><th>Sent to</th><th>What</th><th>Why</th></tr>
      <tr><td>passivearray.vercel.app (our server, hosted on Vercel)</td><td>Channel links, lists of video IDs, keywords, and the topic, notes and related keywords you type into the AI writer</td><td>To look up public statistics through the YouTube Data API and, if the AI writer is switched on server-side, to write titles, descriptions and tags</td></tr>
      <tr><td>www.youtube.com</td><td>A request for the video or search page you are already looking at</td><td>To read the public data embedded in that page. Sent with your normal YouTube cookies, the same as your browser does</td></tr>
      <tr><td>suggestqueries.google.com</td><td>The keyword you typed</td><td>To show YouTube's own "people also search" suggestions</td></tr>
    </table>
    <p>Nothing else is sent anywhere. No page you visit outside YouTube is read, and no personal details, account information, passwords or payment data are ever collected.</p>

    <h2>What is stored</h2>
    <ul>
      <li><b>On your device</b> (Chrome's extension storage): cached lookups for up to 24 hours so repeated views are instant, your on/off preference, and the last keyword, topic and notes you typed in the popup. Uninstalling the extension deletes all of it.</li>
      <li><b>On our server:</b> lookups are cached in memory for up to 6 hours and are not tied to you. Vercel, our hosting provider, keeps standard request logs (IP address, time, URL requested) for a short period for security and debugging, under <a href="https://vercel.com/legal/privacy-policy" rel="noopener">Vercel's privacy policy</a>. We do not build profiles from these logs.</li>
    </ul>

    <h2>Third-party services</h2>
    <p>This extension uses <b>YouTube API Services</b>. By using it you also agree to the <a href="https://www.youtube.com/t/terms" rel="noopener">YouTube Terms of Service</a>, and Google's handling of data is described in the <a href="https://policies.google.com/privacy" rel="noopener">Google Privacy Policy</a>. The extension does not access your YouTube account and never requests authorised data; it only reads public statistics.</p>
    <p>When the AI writer is enabled on our server, the topic, notes and related keywords you type are sent to Anthropic's Claude API to write the text, under <a href="https://www.anthropic.com/legal/privacy" rel="noopener">Anthropic's privacy policy</a>. Anthropic does not train on API inputs. Nothing about you other than that text is included.</p>

    <h2>Browser permissions, in plain words</h2>
    <table>
      <tr><th>Permission</th><th>Used for</th></tr>
      <tr><td>Read data on www.youtube.com</td><td>Showing the panels on video, channel and search pages</td></tr>
      <tr><td>Connect to passivearray.vercel.app</td><td>Looking up statistics through our server</td></tr>
      <tr><td>Connect to suggestqueries.google.com</td><td>Keyword suggestions</td></tr>
      <tr><td>Storage</td><td>Caching answers and remembering your settings on your device</td></tr>
      <tr><td>Active tab</td><td>Letting the popup see which YouTube page is open, only while the popup is open</td></tr>
    </table>

    <h2>Your choices</h2>
    <ul>
      <li>Turn the panels off with the switch in the popup. The extension then reads nothing from YouTube pages.</li>
      <li>Remove the extension at any time from <code>chrome://extensions</code>. This deletes all locally stored data.</li>
      <li>Do not type anything into the AI writer that you would not want sent to our server.</li>
    </ul>

    <h2>Children</h2>
    <p>The extension is not directed at children under 13 and collects no personal information from anyone.</p>

    <h2>Changes</h2>
    <p>If this policy changes, the new version is published at this address with a new effective date. Changes that would send more data than described here will also be noted in the extension's update notes on the Chrome Web Store.</p>

    <h2>Contact</h2>
    <p>Passive Array is built by Squareko. Questions about this policy: use the contact form at <a href="https://squareko.com" rel="noopener">squareko.com</a>.</p>
  </div>`;
  return shell({ title: "Privacy policy, " + NAME, description: "What the Passive Array for YouTube extension reads, sends and stores. No accounts, no tracking, no ads.", root, path: "/youtube-extension/privacy/", body, active: "" });
}

module.exports = { landingPage, privacyPage, NAME, STORE_URL };
