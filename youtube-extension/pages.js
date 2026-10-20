// Pages for the Passive Array for YouTube browser extension, built into
//   dist/youtube-extension/index.html           landing page
//   dist/youtube-extension/privacy/index.html   privacy policy (linked from the Chrome Web Store listing)
// Uses the site's shared shell (header, footer, stylesheet) from build-tools.js.

const site = require("../creator-tools/build-tools.js");
const { esc, ICON } = site;

const NAME = "Passive Array for YouTube";
const STORE_URL = "https://chromewebstore.google.com/detail/passive-array-youtube-seo/folfdjnhhipokaandmpdaimjcfcgebep";
const EFFECTIVE = "October 7, 2026";

const CHROME_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="vertical-align:middle;margin-right:8px"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M21.17 8H12" stroke="currentColor" stroke-width="2"/><path d="M3.95 6.06L8.54 14" stroke="currentColor" stroke-width="2"/><path d="M10.88 21.94L15.46 14" stroke="currentColor" stroke-width="2"/></svg>`;

const STYLE = `<style>
  /* Hero & Trust Badges */
  .ext-hero { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 40px; align-items: center; padding: 48px 0 36px; }
  .ext-pill { display: inline-flex; align-items: center; gap: 8px; font-size: .8rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--deep); background: var(--soft); padding: 6px 14px; border-radius: 999px; margin-bottom: 14px; border: 1px solid rgba(42,157,143,.2); }
  .ext-pill .star { color: #F59E0B; }
  .ext-hero h1 { font-size: clamp(2.2rem, 4.2vw, 3.2rem); line-height: 1.15; margin: 0 0 16px; letter-spacing: -.02em; }
  .ext-hero h1 mark { background: transparent; color: var(--teal); }
  .ext-hero p.lead { font-size: 1.15rem; line-height: 1.6; color: var(--muted); max-width: 48ch; margin: 0 0 24px; }
  .ext-ctas { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin-bottom: 20px; }
  .ext-ctas .btn.primary { background: linear-gradient(135deg, #2A9D8F, #1F7F73); color: #fff; font-size: 1.05rem; padding: 14px 24px; font-weight: 600; border-radius: 12px; display: inline-flex; align-items: center; box-shadow: 0 8px 24px rgba(42,157,143,.3); transition: transform .15s ease, box-shadow .15s ease; text-decoration: none; }
  .ext-ctas .btn.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(42,157,143,.4); }
  .ext-compat { display: flex; align-items: center; gap: 10px; font-size: .85rem; color: var(--muted); }
  .ext-compat-icons { display: inline-flex; gap: 6px; font-weight: 600; color: var(--text); }

  /* Hero Showcase Visual */
  .ext-hero-visual { position: relative; }
  .ext-browser-window { background: var(--card); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); position: relative; }
  .ext-browser-bar { background: var(--bg); padding: 10px 14px; border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 8px; }
  .ext-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .ext-dot.r { background: #FF5F56; } .ext-dot.y { background: #FFBD2E; } .ext-dot.g { background: #27C93F; }
  .ext-browser-bar .url { background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 3px 12px; font-size: .75rem; color: var(--muted); flex: 1; text-align: center; }
  .ext-browser-window img { width: 100%; height: auto; display: block; }
  
  /* Floating Feature Overlays */
  .float-badge { position: absolute; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 10px 14px; box-shadow: 0 12px 30px rgba(0,0,0,.15); font-size: .82rem; backdrop-filter: blur(8px); display: flex; align-items: center; gap: 10px; z-index: 2; animation: floatAnim 4s ease-in-out infinite; }
  .float-badge.fb-1 { top: -14px; right: -14px; animation-delay: 0s; }
  .float-badge.fb-2 { bottom: -16px; left: -14px; animation-delay: 2s; }
  .float-badge .badge-icon { width: 34px; height: 34px; border-radius: 8px; display: grid; place-items: center; font-size: 1.1rem; }
  .float-badge.fb-1 .badge-icon { background: var(--soft); color: var(--teal); }
  .float-badge.fb-2 .badge-icon { background: #EEF0FA; color: var(--indigo); }
  .float-badge b { display: block; font-size: .95rem; color: var(--text); }
  .float-badge span { color: var(--muted); font-size: .75rem; }

  @keyframes floatAnim {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  /* 4 Value Pillars */
  .ext-pillars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 48px 0 64px; }
  .ext-pillar-card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 22px 20px; transition: transform .2s ease; }
  .ext-pillar-card:hover { transform: translateY(-3px); }
  .ext-pillar-num { font-size: 1.8rem; font-weight: 700; color: var(--teal); margin-bottom: 4px; line-height: 1; }
  .ext-pillar-title { font-weight: 600; font-size: 1.05rem; margin-bottom: 6px; }
  .ext-pillar-desc { font-size: .85rem; color: var(--muted); line-height: 1.5; margin: 0; }

  /* Feature Showcase Sections (Alternating) */
  .ext-showcase-section { padding: 48px 0; border-top: 1px solid var(--line); }
  .ext-showcase-row { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
  .ext-showcase-row.reverse { direction: rtl; }
  .ext-showcase-row.reverse > * { direction: ltr; }
  .ext-showcase-content h3 { font-size: 1.8rem; line-height: 1.25; margin: 0 0 14px; }
  .ext-showcase-content p { font-size: 1.02rem; line-height: 1.65; color: var(--muted); margin: 0 0 20px; }
  .ext-feature-list { list-style: none; padding: 0; margin: 0 0 24px; display: grid; gap: 12px; }
  .ext-feature-list li { display: flex; align-items: flex-start; gap: 10px; font-size: .95rem; line-height: 1.5; }
  .ext-feature-list li svg { flex-shrink: 0; margin-top: 2px; color: var(--teal); }
  .ext-feature-list li strong { color: var(--text); }

  /* Studio Tag Recommender Mockup Card */
  .studio-mock { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 20px; font-family: inherit; }
  .studio-mock-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; margin-bottom: 14px; border-bottom: 1px solid var(--line); }
  .studio-mock-title { font-size: .9rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
  .studio-tag-box { border: 1.5px dashed var(--line); border-radius: 8px; padding: 12px; background: var(--bg); margin-bottom: 14px; }
  .studio-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .studio-chip { background: var(--card); border: 1px solid var(--line); border-radius: 999px; padding: 5px 12px; font-size: .8rem; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; }
  .studio-chip .freq { background: var(--soft); color: var(--deep); font-size: .7rem; font-weight: 700; border-radius: 999px; padding: 2px 6px; }
  .studio-chip.add-all { background: var(--teal); color: #fff; border-color: var(--teal); cursor: pointer; }

  /* Comparison Matrix */
  .ext-cmp-section { padding: 56px 0; border-top: 1px solid var(--line); }
  .ext-cmp-head { text-align: center; max-width: 60ch; margin: 0 auto 36px; }
  .ext-cmp-head h2 { font-size: 2.2rem; margin: 0 0 10px; }
  .ext-cmp-head p { color: var(--muted); font-size: 1.05rem; margin: 0; }
  .ext-table-wrap { overflow-x: auto; background: var(--card); border: 1px solid var(--line); border-radius: 16px; box-shadow: var(--shadow); }
  .ext-table { width: 100%; border-collapse: collapse; text-align: left; font-size: .95rem; }
  .ext-table th, .ext-table td { padding: 16px 20px; border-bottom: 1px solid var(--line); }
  .ext-table th { background: var(--bg); font-weight: 600; font-size: .9rem; color: var(--text); }
  .ext-table th.highlight, .ext-table td.highlight { background: rgba(42,157,143,.06); font-weight: 600; }
  .ext-table td.highlight { color: var(--deep); }
  .ext-table tbody tr:last-child td { border-bottom: none; }
  .badge-yes { display: inline-flex; align-items: center; gap: 6px; color: var(--good); font-weight: 600; }
  .badge-no { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); }
  .badge-paid { display: inline-flex; align-items: center; gap: 6px; color: #B42318; font-weight: 600; }

  /* How It Works Workflow */
  .ext-flow-section { padding: 56px 0; border-top: 1px solid var(--line); }
  .ext-flow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 32px; }
  .ext-flow-card { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 28px 24px; position: relative; }
  .ext-flow-step { width: 36px; height: 36px; border-radius: 50%; background: var(--deep); color: #fff; font-weight: 700; display: grid; place-items: center; margin-bottom: 16px; }
  .ext-flow-card h4 { font-size: 1.15rem; margin: 0 0 8px; }
  .ext-flow-card p { font-size: .9rem; color: var(--muted); line-height: 1.55; margin: 0; }

  /* FAQ Accordion */
  .ext-faq-section { padding: 56px 0; border-top: 1px solid var(--line); }
  .ext-faq-grid { display: grid; gap: 12px; max-width: 860px; margin: 32px auto 0; }
  .ext-faq-item { background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; transition: border-color .2s; }
  .ext-faq-item[open] { border-color: var(--teal); }
  .ext-faq-item summary { padding: 18px 22px; font-weight: 600; font-size: 1.05rem; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
  .ext-faq-item summary::-webkit-details-marker { display: none; }
  .ext-faq-item summary::after { content: "+"; font-size: 1.3rem; color: var(--teal); font-weight: 400; transition: transform .2s ease; }
  .ext-faq-item[open] summary::after { content: "−"; transform: rotate(180deg); }
  .ext-faq-item .faq-ans { padding: 0 22px 20px; font-size: .95rem; line-height: 1.65; color: var(--muted); }

  /* Final High-Conversion CTA */
  .ext-final-cta { margin: 64px 0 24px; padding: 54px 32px; border-radius: 20px; background: linear-gradient(135deg, #1F2A44 0%, #162438 100%); color: #fff; text-align: center; border: 1px solid rgba(255,255,255,.1); box-shadow: 0 20px 40px rgba(0,0,0,.25); position: relative; overflow: hidden; }
  .ext-final-cta::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(42,157,143,.15) 0%, transparent 60%); pointer-events: none; }
  .ext-final-cta h2 { font-size: clamp(2rem, 3.5vw, 2.7rem); margin: 0 0 14px; position: relative; }
  .ext-final-cta p { font-size: 1.1rem; color: #C9D1E0; max-width: 52ch; margin: 0 auto 28px; position: relative; }
  .ext-final-cta .ext-ctas { justify-content: center; position: relative; margin-bottom: 14px; }
  .ext-final-cta .ext-compat { justify-content: center; color: #A5AFC2; position: relative; }

  @media (max-width: 960px) {
    .ext-hero { grid-template-columns: 1fr; padding-top: 24px; gap: 32px; }
    .ext-pillars { grid-template-columns: repeat(2, 1fr); }
    .ext-showcase-row, .ext-showcase-row.reverse { grid-template-columns: 1fr; gap: 24px; direction: ltr; }
    .ext-flow-grid { grid-template-columns: 1fr; }
    .float-badge { display: none; }
  }
  @media (max-width: 600px) {
    .ext-pillars { grid-template-columns: 1fr; }
    .ext-final-cta { padding: 36px 20px; }
  }
</style>`;

function landingPage() {
  const root = "../";
  const body = `
  <!-- 1. Hero Section -->
  <section class="ext-hero">
    <div>
      <div class="crumbs"><a href="${root}">Home</a> / Browser extension</div>
      <div class="ext-pill">
        <span class="star">★★★★★</span> Approved on Chrome Web Store · Free Forever
      </div>
      <h1>Supercharge your <mark>YouTube research</mark> without the $49/mo paywall</h1>
      <p class="lead">Engagement rate, hidden competitor tags, views per day, search outlier scores, and smart YouTube Studio tag suggestions directly on YouTube. Fast, lightweight, and zero account required.</p>
      
      <div class="ext-ctas">
        <a class="btn primary" href="${STORE_URL}" rel="noopener">
          ${CHROME_ICON} Add to Chrome — It's Free
        </a>
        <a class="btn ghost" href="#features">See all features ↓</a>
      </div>

      <div class="ext-compat">
        <span>Compatible with:</span>
        <span class="ext-compat-icons">Chrome · Edge · Brave · Opera</span>
      </div>
    </div>

    <!-- Visual Hero Preview -->
    <div class="ext-hero-visual">
      <div class="float-badge fb-1">
        <div class="badge-icon">⚡</div>
        <div><b>4.82% Engagement</b><span>Above YouTube Average</span></div>
      </div>
      <div class="float-badge fb-2">
        <div class="badge-icon">🏷️</div>
        <div><b>16 Hidden Tags</b><span>1-Click Copy Ready</span></div>
      </div>

      <div class="ext-browser-window">
        <div class="ext-browser-bar">
          <span class="ext-dot r"></span><span class="ext-dot y"></span><span class="ext-dot g"></span>
          <div class="url">youtube.com/watch?v=dQw4w9WgXcQ · Passive Array Overlay</div>
        </div>
        <img src="screenshot-1-video.png" alt="Passive Array for YouTube video watch page panel" width="1280" height="800" loading="eager" />
      </div>
    </div>
  </section>

  <!-- 2. Value Pillars (Quick Trust Stats) -->
  <div class="ext-pillars">
    <div class="ext-pillar-card">
      <div class="ext-pillar-num">0</div>
      <div class="ext-pillar-title">No Account Needed</div>
      <p class="ext-pillar-desc">Never asks for your Google login or channel access. Pure privacy by design.</p>
    </div>
    <div class="ext-pillar-card">
      <div class="ext-pillar-num">100%</div>
      <div class="ext-pillar-title">Free Forever</div>
      <p class="ext-pillar-desc">No blurred metrics, no teaser limits, and no paid plan upgrades inside the extension.</p>
    </div>
    <div class="ext-pillar-card">
      <div class="ext-pillar-num">&lt;10ms</div>
      <div class="ext-pillar-title">Zero Browser Lag</div>
      <p class="ext-pillar-desc">Built strictly on modern Chrome Manifest V3. No heavy trackers or memory bloat.</p>
    </div>
    <div class="ext-pillar-card">
      <div class="ext-pillar-num">Honest</div>
      <div class="ext-pillar-title">Real Formulas</div>
      <p class="ext-pillar-desc">True engagement and velocity formulas instead of fabricated "search volume" estimates.</p>
    </div>
  </div>

  <!-- 3. In-Depth Feature Showcases with Screenshots -->
  <div id="features">
    <!-- Showcase 1: Video Watch Page -->
    <section class="ext-showcase-section">
      <div class="ext-showcase-row">
        <div class="ext-showcase-content">
          <div class="ext-pill">Watch Page Intelligence</div>
          <h3>See what any video is really achieving in seconds</h3>
          <p>YouTube hides crucial data like competitor tags and true engagement velocity. Passive Array unpacks it all directly into the video sidebar without leaving the page.</p>
          <ul class="ext-feature-list">
            <li>${ICON.check} <div><strong>Accurate Engagement Rate:</strong> Calculated from total likes and comments divided by view count, rated on an objective creator benchmark.</div></li>
            <li>${ICON.check} <div><strong>Views Per Day (Velocity):</strong> Know immediately if a video went viral yesterday or has been accumulating views for three years.</div></li>
            <li>${ICON.check} <div><strong>Hidden Competitor Tags:</strong> View every tag the creator used with one-click copy to paste directly into your own video research.</div></li>
            <li>${ICON.check} <div><strong>Channel Comparison:</strong> See if this upload is beating or trailing the channel's usual performance average.</div></li>
          </ul>
        </div>
        <div class="ext-browser-window">
          <div class="ext-browser-bar">
            <span class="ext-dot r"></span><span class="ext-dot y"></span><span class="ext-dot g"></span>
            <div class="url">Video Insights & Tags Extractor</div>
          </div>
          <img src="screenshot-1-video.png" alt="Video intelligence sidebar in Passive Array" width="1280" height="800" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- Showcase 2: YouTube Studio Tags Copilot -->
    <section class="ext-showcase-section">
      <div class="ext-showcase-row reverse">
        <div class="ext-showcase-content">
          <div class="ext-pill">YouTube Studio Copilot</div>
          <h3>Smart tag suggestions right when you upload</h3>
          <p>Stop guessing what tags to add. When you enter a title in YouTube Studio, Passive Array automatically analyzes the top 20 ranking videos and presents the most effective tags.</p>
          <ul class="ext-feature-list">
            <li>${ICON.check} <div><strong>Ranked By Real Competitor Data:</strong> Tags are ordered by how many top-ranking videos actually use them.</div></li>
            <li>${ICON.check} <div><strong>1-Click Add Top 10:</strong> Populate your video's tag box in a single click without exceeding YouTube's 500-character limit.</div></li>
            <li>${ICON.check} <div><strong>Safe & Local:</strong> Operates strictly in your browser. It never alters descriptions, titles, or visibility settings.</div></li>
          </ul>
        </div>
        <div class="studio-mock">
          <div class="studio-mock-head">
            <span class="studio-mock-title">⚡ Passive Array · Studio Tag Suggestions</span>
            <span style="font-size:.75rem;color:var(--muted)">YouTube Studio Integration</span>
          </div>
          <div class="studio-tag-box">
            <div style="font-size:.78rem;color:var(--muted);margin-bottom:6px">Suggested from top 20 videos ranking for your title:</div>
            <div class="studio-chips">
              <span class="studio-chip">youtube seo <span class="freq">18/20</span></span>
              <span class="studio-chip">how to rank youtube videos <span class="freq">15/20</span></span>
              <span class="studio-chip">youtube algorithm 2026 <span class="freq">14/20</span></span>
              <span class="studio-chip">video tags tutorial <span class="freq">11/20</span></span>
              <span class="studio-chip">get more views <span class="freq">9/20</span></span>
              <span class="studio-chip add-all">+ Add Top 10 Tags</span>
            </div>
          </div>
          <div style="font-size:.78rem;color:var(--muted);display:flex;justify-content:space-between">
            <span>Character counter: 382 / 500</span>
            <span style="color:var(--good);font-weight:600">✓ Optimized</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Showcase 3: Search Outlier Radar -->
    <section class="ext-showcase-section">
      <div class="ext-showcase-row">
        <div class="ext-showcase-content">
          <div class="ext-pill">Search Outlier Radar</div>
          <h3>Spot open niches and low-competition topics</h3>
          <p>Under every result on YouTube search pages, Passive Array overlays crucial channel ratios so you can identify breakout topics before anyone else.</p>
          <ul class="ext-feature-list">
            <li>${ICON.check} <div><strong>Outlier Highlighting:</strong> Green flags appear when a small channel ranks above massive creators—the surefire sign of an open, high-demand topic.</div></li>
            <li>${ICON.check} <div><strong>Views-to-Subscribers Ratio:</strong> See if a video gained 500k views on a channel with only 5k subscribers.</div></li>
            <li>${ICON.check} <div><strong>Fast Scanning:</strong> Review the whole first page of YouTube search without opening tabs or waiting on heavy tools.</div></li>
          </ul>
        </div>
        <div class="ext-browser-window">
          <div class="ext-browser-bar">
            <span class="ext-dot r"></span><span class="ext-dot y"></span><span class="ext-dot g"></span>
            <div class="url">YouTube Search Results with Passive Array Scores</div>
          </div>
          <img src="screenshot-4-search.png" alt="Search result scores overlay" width="1280" height="800" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- Showcase 4: Channel Health & Monetization -->
    <section class="ext-showcase-section">
      <div class="ext-showcase-row reverse">
        <div class="ext-showcase-content">
          <div class="ext-pill">Channel Deep Dive</div>
          <h3>Check monetization and creator consistency</h3>
          <p>Audit any creator's channel with one click. Get instant clarity on their monetization indicators, average views per subscriber, and recent upload pace.</p>
          <ul class="ext-feature-list">
            <li>${ICON.check} <div><strong>Monetization Confidence:</strong> Verifies ad placements and threshold requirements directly from the channel page.</div></li>
            <li>${ICON.check} <div><strong>Shorts vs Long-form Balance:</strong> Understand whether a creator's audience comes from viral Shorts or high-retention long-form videos.</div></li>
            <li>${ICON.check} <div><strong>Channel Keywords:</strong> Inspect hidden channel-level keywords and topic authority tags.</div></li>
          </ul>
        </div>
        <div class="ext-browser-window">
          <div class="ext-browser-bar">
            <span class="ext-dot r"></span><span class="ext-dot y"></span><span class="ext-dot g"></span>
            <div class="url">Channel Monetization & Analytics Audit</div>
          </div>
          <img src="screenshot-3-monetization.png" alt="Channel monetization checker screenshot" width="1280" height="800" loading="lazy" />
        </div>
      </div>
    </section>
  </div>

  <!-- 4. Comparison Table: Passive Array vs vidIQ vs TubeBuddy -->
  <section class="ext-cmp-section">
    <div class="ext-cmp-head">
      <div class="ext-pill">Transparent Comparison</div>
      <h2>How does it compare to vidIQ &amp; TubeBuddy?</h2>
      <p>Most extension tools lock basic competitor research behind steep monthly subscriptions. Here is how Passive Array delivers pure creator utility for free.</p>
    </div>

    <div class="ext-table-wrap">
      <table class="ext-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th class="highlight">Passive Array for YouTube</th>
            <th>vidIQ (Free Plan)</th>
            <th>TubeBuddy (Free Plan)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Account or Sign-up</strong></td>
            <td class="highlight"><span class="badge-yes">✓ None (100% Private)</span></td>
            <td><span class="badge-no">✕ Mandatory Account</span></td>
            <td><span class="badge-no">✕ Mandatory Account</span></td>
          </tr>
          <tr>
            <td><strong>Full Hidden Tag Extractor</strong></td>
            <td class="highlight"><span class="badge-yes">✓ Unlimited, 1-Click Copy</span></td>
            <td><span class="badge-paid">Limited to 3 tags</span></td>
            <td><span class="badge-paid">Limited to 3 tags</span></td>
          </tr>
          <tr>
            <td><strong>Studio Tag Suggestions</strong></td>
            <td class="highlight"><span class="badge-yes">✓ Included Free</span></td>
            <td><span class="badge-paid">Requires Pro ($39/mo)</span></td>
            <td><span class="badge-paid">Requires Pro ($49/mo)</span></td>
          </tr>
          <tr>
            <td><strong>Search Outlier Radar</strong></td>
            <td class="highlight"><span class="badge-yes">✓ Live on every result</span></td>
            <td><span class="badge-paid">Paywalled</span></td>
            <td><span class="badge-paid">Paywalled</span></td>
          </tr>
          <tr>
            <td><strong>Monetization Confidence Check</strong></td>
            <td class="highlight"><span class="badge-yes">✓ Included Free</span></td>
            <td><span class="badge-no">✕ Not Available</span></td>
            <td><span class="badge-no">✕ Not Available</span></td>
          </tr>
          <tr>
            <td><strong>Browser Speed Impact</strong></td>
            <td class="highlight"><span class="badge-yes">✓ Ultralight Manifest V3</span></td>
            <td><span class="badge-no">Heavy background scripts</span></td>
            <td><span class="badge-no">Heavy background scripts</span></td>
          </tr>
          <tr>
            <td><strong>Upsell Banners &amp; Ads</strong></td>
            <td class="highlight"><span class="badge-yes">✓ Zero ads or popups</span></td>
            <td><span class="badge-no">Frequent upgrade prompts</span></td>
            <td><span class="badge-no">Frequent upgrade prompts</span></td>
          </tr>
          <tr>
            <td><strong>Cost</strong></td>
            <td class="highlight"><span class="badge-yes">$0 Free Forever</span></td>
            <td><span class="badge-paid">$39 – $99 / mo</span></td>
            <td><span class="badge-paid">$49 – $149 / mo</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- 5. How It Works (3 Steps) -->
  <section class="ext-flow-section">
    <div style="text-align:center;max-width:56ch;margin:0 auto 10px">
      <div class="ext-pill">Quick Setup</div>
      <h2 style="font-size:2.2rem;margin:0 0 10px">Up and running in 10 seconds</h2>
      <p style="color:var(--muted)">No accounts to create, no verification emails to wait for, and no payment info.</p>
    </div>

    <div class="ext-flow-grid">
      <div class="ext-flow-card">
        <div class="ext-flow-step">1</div>
        <h4>Add from Chrome Store</h4>
        <p>Click "Add to Chrome" on the official Chrome Web Store. The extension installs instantly in Chrome, Edge, or Brave.</p>
      </div>
      <div class="ext-flow-card">
        <div class="ext-flow-step">2</div>
        <h4>Browse YouTube Normally</h4>
        <p>Open any video, channel, or search query. The Passive Array panel overlays automatically with live metrics and competitor tags.</p>
      </div>
      <div class="ext-flow-card">
        <div class="ext-flow-step">3</div>
        <h4>Optimize in Studio</h4>
        <p>When uploading a video in YouTube Studio, smart tag recommendations appear directly under the Tags field with 1-click addition.</p>
      </div>
    </div>
  </section>

  <!-- 6. Frequently Asked Questions -->
  <section class="ext-faq-section">
    <div style="text-align:center;max-width:54ch;margin:0 auto">
      <div class="ext-pill">Got Questions?</div>
      <h2 style="font-size:2.2rem;margin:0 0 8px">Frequently Asked Questions</h2>
      <p style="color:var(--muted)">Everything you need to know about privacy, performance, and safety.</p>
    </div>

    <div class="ext-faq-grid">
      <details class="ext-faq-item" open>
        <summary>Does the extension need access to my YouTube channel or Google account?</summary>
        <div class="faq-ans">
          No. Unlike vidIQ or TubeBuddy, Passive Array never asks for OAuth login, channel permissions, or Google account access. It only reads the public statistics already visible on the YouTube page you are viewing.
        </div>
      </details>
      <details class="ext-faq-item">
        <summary>Will it slow down YouTube or my computer?</summary>
        <div class="faq-ans">
          Not at all. The extension is built strictly on Google's modern Chrome Manifest V3 standard. It has no continuous tracking background scripts, no third-party ad networks, and caches lookups locally on your device so repeat views load in under 1 millisecond.
        </div>
      </details>
      <details class="ext-faq-item">
        <summary>How does the YouTube Studio tag suggestion feature work?</summary>
        <div class="faq-ans">
          When you enter a title for your video in YouTube Studio, the extension analyzes what the top 20 videos ranking for that phrase use. It ranks the tags by real competitor frequency and lets you insert the best tags in 1 click, right up to YouTube's 500-character limit.
        </div>
      </details>
      <details class="ext-faq-item">
        <summary>Does it work in Microsoft Edge, Brave, and Opera?</summary>
        <div class="faq-ans">
          Yes! Any Chromium-based browser (including Microsoft Edge, Brave, Opera, and Vivaldi) can install this extension directly from the Chrome Web Store link with a single click.
        </div>
      </details>
      <details class="ext-faq-item">
        <summary>Why is it 100% free?</summary>
        <div class="faq-ans">
          Passive Array was built on the philosophy that essential creator utility should be open and accessible to all creators. We provide our companion web tools for free and fund site infrastructure through optional pro tracking for agencies.
        </div>
      </details>
      <details class="ext-faq-item">
        <summary>Where can I read the extension's privacy policy?</summary>
        <div class="faq-ans">
          You can read our complete, plain-English privacy policy right here: <a href="privacy/">Extension Privacy Policy</a>. It details exactly what the extension reads, what it caches, and how it protects your privacy.
        </div>
      </details>
    </div>
  </section>

  <!-- 7. High-Conversion Final CTA Banner -->
  <div class="ext-final-cta">
    <div class="ext-pill" style="background:rgba(42,157,143,.25);color:#8FD3C7;border-color:rgba(143,211,199,.3)">
      ★ 5.0 Rating on Chrome Web Store
    </div>
    <h2>Take the guesswork out of YouTube SEO today</h2>
    <p>Join smart creators uncovering hidden competitor tags, calculating engagement velocity, and optimizing Studio tags in one click.</p>
    
    <div class="ext-ctas">
      <a class="btn primary" href="${STORE_URL}" rel="noopener">
        ${CHROME_ICON} Add to Chrome — It's 100% Free
      </a>
    </div>

    <div class="ext-compat">
      <span>Works on Chrome, Edge &amp; Brave · No credit card · Install in 10 seconds</span>
    </div>
  </div>`;

  return site.shell({
    title: "Free YouTube Chrome Extension: SEO, Tags & Stats",
    ogTitle: "Passive Array: Free YouTube SEO & Tag Extension",
    description: "Free Chrome extension for creators: hidden competitor tags, engagement rate, views per day, search outlier scores, and YouTube Studio tag suggestions. No account required.",
    path: "/youtube-extension/",
    active: "extension",
    head: STYLE,
    body
  });
}

function privacyPage() {
  const root = "../../";
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="${root}">Home</a> / <a href="../">Browser extension</a> / Privacy policy</div>
    <h1>Privacy policy</h1>
    <p class="lead">For the ${esc(NAME)} browser extension. Effective ${EFFECTIVE}. The website has its own <a href="${root}privacy/">privacy policy</a>.</p>
  </div>

  <div class="card prose">
    <h2 style="margin-top:0">The short version</h2>
    <ul>
      <li>The extension has no accounts and does not know who you are.</li>
      <li>It reads the YouTube page you are on to show numbers about that video, channel or search.</li>
      <li>It sends the video ID, channel link or keyword you are looking at to our server (this site) so the YouTube API key can stay on the server instead of inside the extension.</li>
      <li>It does not collect your browsing history, does not use analytics or tracking, does not show ads, and does not sell or share data with anyone.</li>
    </ul>

    <h2>What the extension reads</h2>
    <p>The extension only runs on pages under <code>www.youtube.com</code> and <code>studio.youtube.com</code>. On those pages it reads:</p>
    <ul>
      <li><b>Video pages:</b> the video ID in the address bar and the public data YouTube already sent to the page (title, view count, likes, comments, tags, description, publish date, channel name and subscriber count).</li>
      <li><b>Channel pages:</b> the channel handle or ID in the address bar.</li>
      <li><b>Search pages:</b> the search words in the address bar and the video IDs of the results shown.</li>
      <li><b>YouTube Studio, upload and edit forms:</b> the title and the tags you have typed into the form, so it can suggest tags. It does not read your analytics, revenue, comments or anything else in Studio, and it never changes the form except for the tags you click to add.</li>
      <li><b>The popup:</b> the keyword or topic and notes you type in.</li>
    </ul>

    <h2>What is sent, and where</h2>
    <table>
      <tr><th>Sent to</th><th>What</th><th>Why</th></tr>
      <tr><td>This site's server (hosted on Vercel)</td><td>Channel links, lists of video IDs (including the IDs of videos ranking for a Studio video title), keywords, and the topic, notes and related keywords you type into the AI writer</td><td>To look up public statistics through the YouTube Data API and, if the AI writer is switched on server-side, to write titles, descriptions and tags</td></tr>
      <tr><td>www.youtube.com</td><td>A request for the video or search page you are already looking at, or for the search results page for the video title you typed in Studio</td><td>To read the public data embedded in that page. Sent with your normal YouTube cookies, the same as your browser does</td></tr>
      <tr><td>suggestqueries.google.com</td><td>The keyword you typed, or in Studio your video title and up to three of your tags</td><td>To show YouTube's own "people also search" suggestions</td></tr>
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
      <tr><td>Read data on studio.youtube.com</td><td>Showing the Suggested tags panel under the Tags box when you upload or edit a video</td></tr>
      <tr><td>Connect to this site</td><td>Looking up statistics through our server</td></tr>
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
    <p>Questions about this policy: use the <a href="${root}contact/">contact form</a>.</p>
  </div>`;
  return site.shell({ title: "Privacy policy, " + NAME, ogTitle: "Privacy policy, " + NAME, description: "What the Passive Array for YouTube extension reads, sends and stores. No accounts, no tracking, no ads.", path: "/youtube-extension/privacy/", active: "extension", narrow: true, body });
}

module.exports = { landingPage, privacyPage, NAME, STORE_URL };
