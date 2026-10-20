// Pages for the Passive Array for YouTube browser extension, built into
//   dist/youtube-extension/index.html           landing page
//   dist/youtube-extension/privacy/index.html   privacy policy (linked from the Chrome Web Store listing)
// Uses the site's shared shell (header, footer, stylesheet) from build-tools.js.

const site = require("../creator-tools/build-tools.js");
const { esc, ICON } = site;

const NAME = "Passive Array for YouTube";
const STORE_URL = "https://chromewebstore.google.com/detail/passive-array-youtube-seo/folfdjnhhipokaandmpdaimjcfcgebep";
const EFFECTIVE = "October 7, 2026";

const CHROME_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="flex-shrink:0"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M21.17 8H12" stroke="currentColor" stroke-width="2"/><path d="M3.95 6.06L8.54 14" stroke="currentColor" stroke-width="2"/><path d="M10.88 21.94L15.46 14" stroke="currentColor" stroke-width="2"/></svg>`;

const STYLE = `<style>
  /* Reset and Scope Isolation to prevent clashes with shared.css */
  .pa-ext-wrap {
    --text-primary: #0F172A;
    --text-secondary: #334155;
    --text-muted: #64748B;
    --bg-surface: #FFFFFF;
    --bg-subtle: #F8FAFC;
    --border-color: #E2E8F0;
    --accent-teal: #0D9488;
    --accent-teal-soft: #F0FDFA;
    --accent-indigo: #4F46E5;
    --accent-indigo-soft: #EEF2FF;
    --btn-primary: #0F172A;
    --btn-primary-hover: #1E293B;
    --card-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04);
    --card-shadow-lg: 0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 8px 10px -4px rgba(15, 23, 42, 0.04);
  }

  :root[data-theme="dark"] .pa-ext-wrap {
    --text-primary: #F8FAFC;
    --text-secondary: #CBD5E1;
    --text-muted: #94A3B8;
    --bg-surface: #1E293B;
    --bg-subtle: #0F172A;
    --border-color: #334155;
    --accent-teal: #2DD4BF;
    --accent-teal-soft: rgba(45, 212, 191, 0.12);
    --accent-indigo: #818CF8;
    --accent-indigo-soft: rgba(129, 140, 248, 0.12);
    --btn-primary: #2563EB;
    --btn-primary-hover: #1D4ED8;
    --card-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4);
    --card-shadow-lg: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
  }

  /* Breadcrumb Navigation */
  .pa-ext-crumbs {
    font-size: 0.88rem;
    color: var(--text-muted);
    margin-bottom: 20px;
    font-weight: 500;
  }
  .pa-ext-crumbs a {
    color: var(--accent-teal);
    text-decoration: none;
  }
  .pa-ext-crumbs a:hover {
    text-decoration: underline;
  }

  /* Hero Section */
  .pa-ext-hero {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 48px;
    align-items: center;
    padding: 24px 0 60px;
  }
  
  .pa-ext-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent-teal);
    background: var(--accent-teal-soft);
    padding: 6px 14px;
    border-radius: 9999px;
    margin-bottom: 18px;
    border: 1px solid rgba(13, 148, 136, 0.2);
  }
  .pa-ext-pill .stars {
    color: #F59E0B;
    letter-spacing: 2px;
  }

  .pa-ext-hero h1 {
    font-size: clamp(2.3rem, 4.4vw, 3.4rem);
    line-height: 1.15;
    margin: 0 0 20px;
    letter-spacing: -0.03em;
    color: var(--text-primary);
    font-weight: 700;
  }
  .pa-ext-hero h1 mark {
    background: linear-gradient(135deg, #0D9488 0%, #4F46E5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding: 0;
  }
  :root[data-theme="dark"] .pa-ext-hero h1 mark {
    background: linear-gradient(135deg, #2DD4BF 0%, #A5B4FC 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pa-ext-hero p.lead {
    font-size: 1.12rem;
    line-height: 1.65;
    color: var(--text-secondary);
    max-width: 48ch;
    margin: 0 0 28px;
    font-weight: 400;
  }

  /* CTA Buttons */
  .pa-ext-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    margin-bottom: 24px;
  }
  .pa-ext-btn-main {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--btn-primary);
    color: #FFFFFF !important;
    font-size: 1.05rem;
    padding: 15px 28px;
    font-weight: 600;
    border-radius: 12px;
    text-decoration: none;
    box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.25);
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }
  .pa-ext-btn-main:hover {
    transform: translateY(-2px);
    background: var(--btn-primary-hover);
    box-shadow: 0 12px 25px -4px rgba(15, 23, 42, 0.35);
  }
  .pa-ext-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--bg-surface);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    font-size: 1.05rem;
    padding: 15px 24px;
    font-weight: 600;
    border-radius: 12px;
    text-decoration: none;
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }
  .pa-ext-btn-ghost:hover {
    border-color: var(--accent-teal);
    background: var(--bg-subtle);
  }

  .pa-ext-compat {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .pa-ext-compat strong {
    color: var(--text-secondary);
  }

  /* Hero Visual Browser Frame */
  .pa-ext-hero-visual {
    position: relative;
  }
  .pa-ext-browser {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: var(--card-shadow-lg);
  }
  .pa-ext-browser-bar {
    background: var(--bg-subtle);
    padding: 10px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pa-ext-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    display: inline-block;
  }
  .pa-ext-dot.r { background: #EF4444; }
  .pa-ext-dot.y { background: #F59E0B; }
  .pa-ext-dot.g { background: #10B981; }
  .pa-ext-browser-bar .address {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 3px 14px;
    font-size: 0.75rem;
    color: var(--text-muted);
    flex: 1;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pa-ext-browser img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* Floating Metric Callouts */
  .pa-ext-float {
    position: absolute;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    padding: 10px 16px;
    box-shadow: var(--card-shadow-lg);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 2;
    animation: paFloat 5s ease-in-out infinite;
  }
  .pa-ext-float.pos-1 {
    top: -16px;
    right: -16px;
  }
  .pa-ext-float.pos-2 {
    bottom: -16px;
    left: -16px;
    animation-delay: 2.5s;
  }
  .pa-ext-float .icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .pa-ext-float.pos-1 .icon-wrap {
    background: var(--accent-teal-soft);
    color: var(--accent-teal);
  }
  .pa-ext-float.pos-2 .icon-wrap {
    background: var(--accent-indigo-soft);
    color: var(--accent-indigo);
  }
  .pa-ext-float b {
    display: block;
    font-size: 0.95rem;
    color: var(--text-primary);
  }
  .pa-ext-float span {
    color: var(--text-muted);
    font-size: 0.78rem;
  }

  @keyframes paFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }

  /* 4 Value Pillars */
  .pa-ext-pillars {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 40px 0 70px;
  }
  .pa-ext-pillar {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--card-shadow);
    transition: transform 0.2s ease, border-color 0.2s ease;
  }
  .pa-ext-pillar:hover {
    transform: translateY(-3px);
    border-color: var(--accent-teal);
  }
  .pa-ext-pillar-num {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--accent-teal);
    margin-bottom: 6px;
    line-height: 1;
  }
  .pa-ext-pillar-title {
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  .pa-ext-pillar-desc {
    font-size: 0.88rem;
    color: var(--text-secondary);
    line-height: 1.55;
    margin: 0;
  }

  /* Feature Showcases */
  .pa-ext-showcase {
    padding: 64px 0;
    border-top: 1px solid var(--border-color);
  }
  .pa-ext-showcase-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: center;
  }
  .pa-ext-showcase-row.flip {
    direction: rtl;
  }
  .pa-ext-showcase-row.flip > * {
    direction: ltr;
  }
  .pa-ext-showcase-info h3 {
    font-size: clamp(1.6rem, 2.8vw, 2.2rem);
    line-height: 1.25;
    color: var(--text-primary);
    margin: 0 0 16px;
    font-weight: 700;
  }
  .pa-ext-showcase-info p {
    font-size: 1.05rem;
    line-height: 1.65;
    color: var(--text-secondary);
    margin: 0 0 24px;
  }
  .pa-ext-checklist {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 14px;
  }
  .pa-ext-checklist li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--text-secondary);
  }
  .pa-ext-checklist li svg {
    color: var(--accent-teal);
    flex-shrink: 0;
    margin-top: 3px;
  }
  .pa-ext-checklist li strong {
    color: var(--text-primary);
  }

  /* Studio Tag Recommender Mockup Card */
  .pa-ext-studio-mock {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--card-shadow-lg);
  }
  .pa-ext-studio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 14px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
  }
  .pa-ext-studio-header b {
    font-size: 0.95rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pa-ext-studio-badge {
    background: var(--accent-teal-soft);
    color: var(--accent-teal);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 9999px;
  }
  .pa-ext-studio-field {
    border: 1.5px dashed var(--border-color);
    border-radius: 10px;
    padding: 16px;
    background: var(--bg-subtle);
    margin-bottom: 16px;
  }
  .pa-ext-studio-field-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 10px;
    font-weight: 500;
  }
  .pa-ext-studio-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .pa-ext-studio-chip {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 9999px;
    padding: 6px 14px;
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--text-primary);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .pa-ext-studio-chip .count {
    background: var(--accent-teal-soft);
    color: var(--accent-teal);
    font-size: 0.72rem;
    font-weight: 700;
    border-radius: 9999px;
    padding: 2px 7px;
  }
  .pa-ext-studio-chip.action {
    background: var(--accent-teal);
    color: #FFFFFF;
    border-color: var(--accent-teal);
    cursor: default;
  }

  /* Comparison Section */
  .pa-ext-comparison {
    padding: 64px 0;
    border-top: 1px solid var(--border-color);
  }
  .pa-ext-center-head {
    text-align: center;
    max-width: 62ch;
    margin: 0 auto 40px;
  }
  .pa-ext-center-head h2 {
    font-size: clamp(1.8rem, 3.2vw, 2.5rem);
    color: var(--text-primary);
    margin: 0 0 12px;
    font-weight: 700;
  }
  .pa-ext-center-head p {
    color: var(--text-secondary);
    font-size: 1.05rem;
    line-height: 1.6;
    margin: 0;
  }

  .pa-ext-table-wrap {
    overflow-x: auto;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 18px;
    box-shadow: var(--card-shadow);
  }
  .pa-ext-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.95rem;
  }
  .pa-ext-table th, .pa-ext-table td {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border-color);
  }
  .pa-ext-table th {
    background: var(--bg-subtle);
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-primary);
  }
  .pa-ext-table th.featured, .pa-ext-table td.featured {
    background: var(--accent-teal-soft);
  }
  .pa-ext-table td.featured {
    color: var(--accent-teal);
    font-weight: 600;
  }
  .pa-ext-table tbody tr:last-child td {
    border-bottom: none;
  }
  .pa-check { color: #10B981; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }
  .pa-cross { color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px; }
  .pa-locked { color: #E11D48; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }

  /* 3-Step Setup Workflow */
  .pa-ext-workflow {
    padding: 64px 0;
    border-top: 1px solid var(--border-color);
  }
  .pa-ext-workflow-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 36px;
  }
  .pa-ext-workflow-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 30px 24px;
    box-shadow: var(--card-shadow);
  }
  .pa-ext-workflow-step {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--btn-primary);
    color: #FFFFFF;
    font-weight: 700;
    display: grid;
    place-items: center;
    margin-bottom: 18px;
    font-size: 1rem;
  }
  .pa-ext-workflow-card h4 {
    font-size: 1.15rem;
    color: var(--text-primary);
    margin: 0 0 10px;
    font-weight: 600;
  }
  .pa-ext-workflow-card p {
    font-size: 0.92rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
  }

  /* FAQ Accordion */
  .pa-ext-faq {
    padding: 64px 0;
    border-top: 1px solid var(--border-color);
  }
  .pa-ext-faq-grid {
    display: grid;
    gap: 14px;
    max-width: 860px;
    margin: 36px auto 0;
  }
  .pa-ext-faq-item {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .pa-ext-faq-item[open] {
    border-color: var(--accent-teal);
    box-shadow: var(--card-shadow);
  }
  .pa-ext-faq-item summary {
    padding: 20px 24px;
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--text-primary);
    cursor: pointer;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pa-ext-faq-item summary::-webkit-details-marker {
    display: none;
  }
  .pa-ext-faq-item summary::after {
    content: "+";
    font-size: 1.4rem;
    color: var(--accent-teal);
    font-weight: 400;
    transition: transform 0.2s ease;
  }
  .pa-ext-faq-item[open] summary::after {
    content: "−";
  }
  .pa-ext-faq-item .answer {
    padding: 0 24px 22px;
    font-size: 0.96rem;
    line-height: 1.65;
    color: var(--text-secondary);
  }

  /* Final High-Conversion CTA */
  .pa-ext-cta-box {
    margin: 70px 0 30px;
    padding: 56px 36px;
    border-radius: 24px;
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    color: #FFFFFF;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: var(--card-shadow-lg);
    position: relative;
    overflow: hidden;
  }
  .pa-ext-cta-box h2 {
    font-size: clamp(2rem, 3.6vw, 2.8rem);
    color: #FFFFFF;
    margin: 0 0 16px;
    font-weight: 700;
  }
  .pa-ext-cta-box p {
    font-size: 1.12rem;
    color: #CBD5E1;
    max-width: 54ch;
    margin: 0 auto 32px;
    line-height: 1.6;
  }
  .pa-ext-cta-box .pa-ext-ctas {
    justify-content: center;
    margin-bottom: 16px;
  }
  .pa-ext-cta-box .pa-ext-compat {
    justify-content: center;
    color: #94A3B8;
  }
  .pa-ext-cta-box .pa-ext-btn-main {
    background: var(--accent-teal);
    box-shadow: 0 8px 24px rgba(13, 148, 136, 0.4);
  }
  .pa-ext-cta-box .pa-ext-btn-main:hover {
    background: #0f766e;
    box-shadow: 0 12px 28px rgba(13, 148, 136, 0.5);
  }

  /* Responsive Adjustments */
  @media (max-width: 960px) {
    .pa-ext-hero {
      grid-template-columns: 1fr;
      padding-top: 16px;
      gap: 36px;
    }
    .pa-ext-pillars {
      grid-template-columns: repeat(2, 1fr);
    }
    .pa-ext-showcase-row, .pa-ext-showcase-row.flip {
      grid-template-columns: 1fr;
      gap: 32px;
      direction: ltr;
    }
    .pa-ext-workflow-grid {
      grid-template-columns: 1fr;
    }
    .pa-ext-float {
      display: none;
    }
  }
  @media (max-width: 600px) {
    .pa-ext-pillars {
      grid-template-columns: 1fr;
    }
    .pa-ext-cta-box {
      padding: 40px 20px;
    }
  }
</style>`;

function landingPage() {
  const root = "../";
  const body = `
  <div class="pa-ext-wrap">
    <!-- Breadcrumbs -->
    <div class="pa-ext-crumbs">
      <a href="${root}">Home</a> / Browser extension
    </div>

    <!-- 1. Hero Section -->
    <section class="pa-ext-hero">
      <div>
        <div class="pa-ext-pill">
          <span class="stars">★★★★★</span> Official Chrome Web Store · 100% Free
        </div>
        <h1>Supercharge your <mark>YouTube research</mark> without the $49/mo paywall</h1>
        <p class="lead">Engagement rate, hidden competitor tags, views per day velocity, search outlier scores, and smart Studio tag suggestions. Fast, lightweight, and zero account required.</p>
        
        <div class="pa-ext-ctas">
          <a class="pa-ext-btn-main" href="${STORE_URL}" rel="noopener">
            ${CHROME_ICON} Add to Chrome — It's Free
          </a>
          <a class="pa-ext-btn-ghost" href="#features">
            See all features ↓
          </a>
        </div>

        <div class="pa-ext-compat">
          <span>Works seamlessly on:</span>
          <strong>Chrome · Edge · Brave · Opera</strong>
        </div>
      </div>

      <!-- Hero Visual Showcase -->
      <div class="pa-ext-hero-visual">
        <div class="pa-ext-float pos-1">
          <div class="icon-wrap">⚡</div>
          <div><b>4.82% Engagement</b><span>Above YouTube Average</span></div>
        </div>
        <div class="pa-ext-float pos-2">
          <div class="icon-wrap">🏷️</div>
          <div><b>16 Hidden Tags</b><span>1-Click Copy Ready</span></div>
        </div>

        <div class="pa-ext-browser">
          <div class="pa-ext-browser-bar">
            <span class="pa-ext-dot r"></span><span class="pa-ext-dot y"></span><span class="pa-ext-dot g"></span>
            <div class="address">youtube.com/watch?v=... · Passive Array Sidebar Overlay</div>
          </div>
          <img src="screenshot-1-video.png" alt="Passive Array for YouTube video watch page panel" width="1280" height="800" loading="eager" />
        </div>
      </div>
    </section>

    <!-- 2. Value Pillars -->
    <div class="pa-ext-pillars">
      <div class="pa-ext-pillar">
        <div class="pa-ext-pillar-num">0</div>
        <div class="pa-ext-pillar-title">No Account Needed</div>
        <p class="pa-ext-pillar-desc">Never asks for your Google login or channel permissions. Pure privacy by design.</p>
      </div>
      <div class="pa-ext-pillar">
        <div class="pa-ext-pillar-num">100%</div>
        <div class="pa-ext-pillar-title">Free Forever</div>
        <p class="pa-ext-pillar-desc">No blurred metrics, no teaser limits, and zero upselling popups inside your workflow.</p>
      </div>
      <div class="pa-ext-pillar">
        <div class="pa-ext-pillar-num">&lt;10ms</div>
        <div class="pa-ext-pillar-title">Zero Browser Lag</div>
        <p class="pa-ext-pillar-desc">Built strictly on modern Chrome Manifest V3. No background trackers or memory bloat.</p>
      </div>
      <div class="pa-ext-pillar">
        <div class="pa-ext-pillar-num">Honest</div>
        <div class="pa-ext-pillar-title">Real Formulas</div>
        <p class="pa-ext-pillar-desc">Transparent math based on actual public metrics instead of made-up "search volume" estimates.</p>
      </div>
    </div>

    <!-- 3. In-Depth Feature Showcases with Screenshots -->
    <div id="features">
      <!-- Showcase 1: Video Watch Page -->
      <section class="pa-ext-showcase">
        <div class="pa-ext-showcase-row">
          <div class="pa-ext-showcase-info">
            <div class="pa-ext-pill">Watch Page Intelligence</div>
            <h3>See what any video is really achieving in seconds</h3>
            <p>YouTube hides crucial data like competitor tags and true engagement velocity. Passive Array unpacks it all directly into the video sidebar without leaving the page.</p>
            <ul class="pa-ext-checklist">
              <li>${ICON.check} <div><strong>Accurate Engagement Rate:</strong> Calculated from total likes and comments divided by views, rated on an objective creator benchmark.</div></li>
              <li>${ICON.check} <div><strong>Views Per Day (Velocity):</strong> Know immediately if a video went viral yesterday or has been accumulating views slowly for years.</div></li>
              <li>${ICON.check} <div><strong>Hidden Competitor Tags:</strong> View every tag the creator used with one-click copy to paste directly into your research.</div></li>
              <li>${ICON.check} <div><strong>Channel Comparison:</strong> See if this upload is beating or trailing the channel's usual performance average.</div></li>
            </ul>
          </div>
          <div class="pa-ext-browser">
            <div class="pa-ext-browser-bar">
              <span class="pa-ext-dot r"></span><span class="pa-ext-dot y"></span><span class="pa-ext-dot g"></span>
              <div class="address">Video Insights & Tags Extractor</div>
            </div>
            <img src="screenshot-1-video.png" alt="Video intelligence sidebar in Passive Array" width="1280" height="800" loading="lazy" />
          </div>
        </div>
      </section>

      <!-- Showcase 2: YouTube Studio Tags Copilot -->
      <section class="pa-ext-showcase">
        <div class="pa-ext-showcase-row flip">
          <div class="pa-ext-showcase-info">
            <div class="pa-ext-pill">YouTube Studio Copilot</div>
            <h3>Smart tag suggestions right when you upload</h3>
            <p>Stop guessing what tags to add. When you enter a title in YouTube Studio, Passive Array automatically analyzes top-ranking competitor videos and presents the most effective tags.</p>
            <ul class="pa-ext-checklist">
              <li>${ICON.check} <div><strong>Ranked By Real Competitor Data:</strong> Tags are ordered by how many top-ranking videos actually use them.</div></li>
              <li>${ICON.check} <div><strong>1-Click Add Top 10:</strong> Populate your video's tag box in a single click without exceeding YouTube's 500-character limit.</div></li>
              <li>${ICON.check} <div><strong>Safe & Local:</strong> Operates strictly in your browser. It never alters your titles, descriptions, or channel settings.</div></li>
            </ul>
          </div>
          <div class="pa-ext-studio-mock">
            <div class="pa-ext-studio-header">
              <b>⚡ Passive Array · Studio Tag Suggestions</b>
              <span class="pa-ext-studio-badge">YouTube Studio Integration</span>
            </div>
            <div class="pa-ext-studio-field">
              <div class="pa-ext-studio-field-label">Suggested from top 20 videos ranking for your title:</div>
              <div class="pa-ext-studio-chips">
                <span class="pa-ext-studio-chip">youtube seo <span class="count">18/20</span></span>
                <span class="pa-ext-studio-chip">how to rank youtube videos <span class="count">15/20</span></span>
                <span class="pa-ext-studio-chip">youtube algorithm 2026 <span class="count">14/20</span></span>
                <span class="pa-ext-studio-chip">video tags tutorial <span class="count">11/20</span></span>
                <span class="pa-ext-studio-chip">get more views <span class="count">9/20</span></span>
                <span class="pa-ext-studio-chip action">+ Add Top 10 Tags</span>
              </div>
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);display:flex;justify-content:space-between">
              <span>Character counter: 382 / 500</span>
              <span style="color:#10B981;font-weight:600">✓ Under YouTube Limit</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Showcase 3: Search Outlier Radar -->
      <section class="pa-ext-showcase">
        <div class="pa-ext-showcase-row">
          <div class="pa-ext-showcase-info">
            <div class="pa-ext-pill">Search Outlier Radar</div>
            <h3>Spot open niches and low-competition topics</h3>
            <p>Under every result on YouTube search pages, Passive Array overlays crucial channel ratios so you can identify breakout topics before anyone else.</p>
            <ul class="pa-ext-checklist">
              <li>${ICON.check} <div><strong>Outlier Highlighting:</strong> Green flags appear when a small channel ranks above massive creators—the sign of an open, high-demand topic.</div></li>
              <li>${ICON.check} <div><strong>Views-to-Subscribers Ratio:</strong> See if a video gained 500k views on a channel with only 5k subscribers.</div></li>
              <li>${ICON.check} <div><strong>Fast Scanning:</strong> Review the whole first page of YouTube search without opening tabs or waiting on heavy tools.</div></li>
            </ul>
          </div>
          <div class="pa-ext-browser">
            <div class="pa-ext-browser-bar">
              <span class="pa-ext-dot r"></span><span class="pa-ext-dot y"></span><span class="pa-ext-dot g"></span>
              <div class="address">YouTube Search Results with Passive Array Scores</div>
            </div>
            <img src="screenshot-4-search.png" alt="Search result scores overlay" width="1280" height="800" loading="lazy" />
          </div>
        </div>
      </section>

      <!-- Showcase 4: Channel Health & Monetization -->
      <section class="pa-ext-showcase">
        <div class="pa-ext-showcase-row flip">
          <div class="pa-ext-showcase-info">
            <div class="pa-ext-pill">Channel Deep Dive</div>
            <h3>Check monetization and creator consistency</h3>
            <p>Audit any creator's channel with one click. Get instant clarity on their monetization indicators, average views per subscriber, and recent upload pace.</p>
            <ul class="pa-ext-checklist">
              <li>${ICON.check} <div><strong>Monetization Confidence:</strong> Verifies ad placements and threshold requirements directly from public channel data.</div></li>
              <li>${ICON.check} <div><strong>Shorts vs Long-form Balance:</strong> Understand whether a creator's audience comes from viral Shorts or high-retention long-form videos.</div></li>
              <li>${ICON.check} <div><strong>Channel Keywords:</strong> Inspect hidden channel-level keywords and topic authority tags.</div></li>
            </ul>
          </div>
          <div class="pa-ext-browser">
            <div class="pa-ext-browser-bar">
              <span class="pa-ext-dot r"></span><span class="pa-ext-dot y"></span><span class="pa-ext-dot g"></span>
              <div class="address">Channel Monetization & Analytics Audit</div>
            </div>
            <img src="screenshot-3-monetization.png" alt="Channel monetization checker screenshot" width="1280" height="800" loading="lazy" />
          </div>
        </div>
      </section>
    </div>

    <!-- 4. Comparison Table: Passive Array vs vidIQ vs TubeBuddy -->
    <section class="pa-ext-comparison">
      <div class="pa-ext-center-head">
        <div class="pa-ext-pill">Honest Comparison</div>
        <h2>How does it compare to vidIQ &amp; TubeBuddy?</h2>
        <p>Most extension tools lock basic competitor research behind steep monthly subscriptions. Here is how Passive Array delivers pure creator utility for free.</p>
      </div>

      <div class="pa-ext-table-wrap">
        <table class="pa-ext-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th class="featured">Passive Array for YouTube</th>
              <th>vidIQ (Free Plan)</th>
              <th>TubeBuddy (Free Plan)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Account or Sign-up</strong></td>
              <td class="featured"><span class="pa-check">✓ None (100% Private)</span></td>
              <td><span class="pa-cross">✕ Mandatory Sign-up</span></td>
              <td><span class="pa-cross">✕ Mandatory Sign-up</span></td>
            </tr>
            <tr>
              <td><strong>Full Hidden Tag Extractor</strong></td>
              <td class="featured"><span class="pa-check">✓ Unlimited, 1-Click Copy</span></td>
              <td><span class="pa-locked">Limited to 3 tags</span></td>
              <td><span class="pa-locked">Limited to 3 tags</span></td>
            </tr>
            <tr>
              <td><strong>Studio Tag Suggestions</strong></td>
              <td class="featured"><span class="pa-check">✓ Included Free</span></td>
              <td><span class="pa-locked">Requires Pro ($39/mo)</span></td>
              <td><span class="pa-locked">Requires Pro ($49/mo)</span></td>
            </tr>
            <tr>
              <td><strong>Search Outlier Radar</strong></td>
              <td class="featured"><span class="pa-check">✓ Live on every result</span></td>
              <td><span class="pa-locked">Paywalled</span></td>
              <td><span class="pa-locked">Paywalled</span></td>
            </tr>
            <tr>
              <td><strong>Monetization Confidence Check</strong></td>
              <td class="featured"><span class="pa-check">✓ Included Free</span></td>
              <td><span class="pa-cross">✕ Not Available</span></td>
              <td><span class="pa-cross">✕ Not Available</span></td>
            </tr>
            <tr>
              <td><strong>Browser Speed Impact</strong></td>
              <td class="featured"><span class="pa-check">✓ Ultralight Manifest V3</span></td>
              <td><span class="pa-cross">Heavy background scripts</span></td>
              <td><span class="pa-cross">Heavy background scripts</span></td>
            </tr>
            <tr>
              <td><strong>Upsell Banners &amp; Ads</strong></td>
              <td class="featured"><span class="pa-check">✓ Zero ads or popups</span></td>
              <td><span class="pa-cross">Frequent upgrade prompts</span></td>
              <td><span class="pa-cross">Frequent upgrade prompts</span></td>
            </tr>
            <tr>
              <td><strong>Pricing</strong></td>
              <td class="featured"><span class="pa-check">$0 Free Forever</span></td>
              <td><span class="pa-locked">$39 – $99 / mo</span></td>
              <td><span class="pa-locked">$49 – $149 / mo</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 5. Setup Workflow -->
    <section class="pa-ext-workflow">
      <div class="pa-ext-center-head">
        <div class="pa-ext-pill">Quick Setup</div>
        <h2>Up and running in 10 seconds</h2>
        <p>No accounts to create, no verification emails to wait for, and no credit card.</p>
      </div>

      <div class="pa-ext-workflow-grid">
        <div class="pa-ext-workflow-card">
          <div class="pa-ext-workflow-step">1</div>
          <h4>Add from Chrome Store</h4>
          <p>Click "Add to Chrome" on the official Chrome Web Store. The extension installs instantly in Chrome, Edge, Brave, or Opera.</p>
        </div>
        <div class="pa-ext-workflow-card">
          <div class="pa-ext-workflow-step">2</div>
          <h4>Browse YouTube Normally</h4>
          <p>Open any video, channel, or search query. The Passive Array panel overlays automatically with live metrics and competitor tags.</p>
        </div>
        <div class="pa-ext-workflow-card">
          <div class="pa-ext-workflow-step">3</div>
          <h4>Optimize in Studio</h4>
          <p>When uploading a video in YouTube Studio, smart tag recommendations appear directly under the Tags field with 1-click addition.</p>
        </div>
      </div>
    </section>

    <!-- 6. FAQ Accordion -->
    <section class="pa-ext-faq">
      <div class="pa-ext-center-head">
        <div class="pa-ext-pill">Common Questions</div>
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know about privacy, performance, and safety.</p>
      </div>

      <div class="pa-ext-faq-grid">
        <details class="pa-ext-faq-item" open>
          <summary>Does the extension need access to my YouTube channel or Google account?</summary>
          <div class="answer">
            No. Unlike vidIQ or TubeBuddy, Passive Array never asks for OAuth login, channel permissions, or Google account access. It only reads the public statistics already visible on the YouTube page you are viewing.
          </div>
        </details>
        <details class="pa-ext-faq-item">
          <summary>Will it slow down YouTube or my computer?</summary>
          <div class="answer">
            Not at all. The extension is built strictly on Google's modern Chrome Manifest V3 standard. It has no continuous tracking background scripts, no third-party ad networks, and caches lookups locally on your device so repeat views load in under 1 millisecond.
          </div>
        </details>
        <details class="pa-ext-faq-item">
          <summary>How does the YouTube Studio tag suggestion feature work?</summary>
          <div class="answer">
            When you enter a title for your video in YouTube Studio, the extension analyzes what the top 20 videos ranking for that phrase use. It ranks the tags by real competitor frequency and lets you insert the best tags in 1 click, right up to YouTube's 500-character limit.
          </div>
        </details>
        <details class="pa-ext-faq-item">
          <summary>Does it work in Microsoft Edge, Brave, and Opera?</summary>
          <div class="answer">
            Yes! Any Chromium-based browser (including Microsoft Edge, Brave, Opera, and Vivaldi) can install this extension directly from the Chrome Web Store link with a single click.
          </div>
        </details>
        <details class="pa-ext-faq-item">
          <summary>Why is it 100% free?</summary>
          <div class="answer">
            Passive Array was built on the philosophy that essential creator utility should be open and accessible to all creators. We provide our companion web tools for free and fund site infrastructure through optional pro tracking for agencies.
          </div>
        </details>
        <details class="pa-ext-faq-item">
          <summary>Where can I read the extension's privacy policy?</summary>
          <div class="answer">
            You can read our complete, plain-English privacy policy right here: <a href="privacy/">Extension Privacy Policy</a>. It details exactly what the extension reads, what it caches, and how it protects your privacy.
          </div>
        </details>
      </div>
    </section>

    <!-- 7. Final High-Conversion CTA Banner -->
    <div class="pa-ext-cta-box">
      <h2>Take the guesswork out of YouTube SEO today</h2>
      <p>Join smart creators uncovering hidden competitor tags, calculating engagement velocity, and optimizing Studio tags in one click.</p>
      
      <div class="pa-ext-ctas">
        <a class="pa-ext-btn-main" href="${STORE_URL}" rel="noopener">
          ${CHROME_ICON} Add to Chrome — It's 100% Free
        </a>
      </div>

      <div class="pa-ext-compat">
        <span>Works on Chrome, Edge &amp; Brave · No credit card · Install in 10 seconds</span>
      </div>
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
