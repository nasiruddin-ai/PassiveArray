// Company pages: /about/, /contact/, /privacy/, /terms/. Built by build.js.

const site = require("../creator-tools/build-tools.js");
const { esc, BRAND, SITE } = site;
const EFFECTIVE = "22 September 2026";

function head(crumb, title, lead) {
  return `<div class="page-head">
    <div class="crumbs"><a href="../">Home</a> / ${esc(crumb)}</div>
    <h1>${esc(title)}</h1>
    ${lead ? `<p class="lead">${esc(lead)}</p>` : ""}
  </div>`;
}

function aboutPage() {
  const live = site.tools.filter((t) => t.api === "youtube" || t.api === "twitch").length;
  const body = `
  ${head("About", "Numbers creators can trust, free", "Passive Array is an independent set of free tools for creators, brands and agencies. No accounts, no ads, no number hidden behind a sign-up.")}
  <div class="stats-row">
    <div><b>${site.tools.length}</b><span>creator tools</span></div>
    <div><b>${live}</b><span>with live API data</span></div>
    <div><b>${site.WEB_TOOLS.length}</b><span>web tools</span></div>
    <div><b>1</b><span>Chrome extension</span></div>
  </div>
  <div class="two-col">
    <div class="card prose">
      <h2 style="margin-top:0">Why this exists</h2>
      <p>Most creator-stats sites show you a teaser and then ask for an email, a card or a login before the useful number appears. The number itself is often a guess dressed up as a fact: "earnings" with no formula, "fake followers" with no explanation.</p>
      <p>Passive Array does the opposite. The result loads first. Every estimate is a range, and the formula sits one tap below it. Live data comes from the official YouTube and Twitch APIs, not from scraped copies that go stale.</p>
      <h2>What "honest numbers" means here</h2>
      <ul>
        <li><strong>Ranges, not fake precision.</strong> Earnings and sponsorship prices always show a low and a high, with the assumption that drives each end.</li>
        <li><strong>The same scale everywhere.</strong> The engagement grade on a video page in the extension is the same scale as the calculator on this site, so numbers are comparable.</li>
        <li><strong>No invented facts.</strong> The AI generators only work from what you type. They never make up follower counts, awards or client names.</li>
        <li><strong>Clear about limits.</strong> Instagram, TikTok and X have no free public API, so those tools work from numbers you type in, and say so.</li>
      </ul>
      <h2>How it stays free</h2>
      <p>The site runs on free hosting tiers and free API allowances, and it is deliberately light. There are no ads and nothing is sold. If paid features arrive later, such as saved reports or alerts, the tools on this site stay free.</p>
      <h2>Who it is for</h2>
      <p>Creators checking their own growth, brands vetting a creator before a deal, agencies building a shortlist, and anyone curious what a channel is really doing. If that is you, <a href="../contact/">tell us what is missing</a>.</p>
    </div>
    <div>
      <div class="card">
        <h3>Start here</h3>
        <p class="muted" style="margin:6px 0 14px;font-size:.9rem">The three most used tools.</p>
        <div style="display:grid;gap:8px">
          <a class="btn ghost" href="../creator-tools/youtube-subscriber-count-checker/">Check a YouTube channel</a>
          <a class="btn ghost" href="../creator-tools/instagram-engagement-rate-calculator/">Instagram engagement rate</a>
          <a class="btn ghost" href="../creator-tools/youtube-money-calculator/">YouTube money calculator</a>
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>On YouTube itself</h3>
        <p class="muted" style="margin:6px 0 14px;font-size:.9rem">The Chrome extension puts engagement rate, hidden tags and a keyword score on every video, channel and search page.</p>
        <a class="btn" href="../youtube-extension/">See the extension</a>
      </div>
    </div>
  </div>`;
  return site.shell({ title: "About", ogTitle: "About Passive Array", description: "Passive Array is an independent set of free creator tools: live data from official APIs, ranges instead of fake precision, nothing behind a sign-up.", path: "/about/", active: "about", body });
}

function contactPage() {
  const body = `
  ${head("Contact", "Get in touch", "Questions, a tool idea, a wrong number, a partnership. Write here and you get a reply by email.")}
  <div class="two-col">
    <div class="card form-card">
      <form data-subscribe data-kind="contact" novalidate>
        <label for="c-name">Your name</label>
        <input id="c-name" type="text" name="name" autocomplete="name" placeholder="Optional">
        <label for="c-email">Email</label>
        <input id="c-email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required>
        <label for="c-topic">Topic</label>
        <select id="c-topic" name="platform">
          <option>Question about a tool</option>
          <option>A number looks wrong</option>
          <option>Tool idea</option>
          <option>Chrome extension</option>
          <option>Partnership or press</option>
          <option>Something else</option>
        </select>
        <label for="c-msg">Message</label>
        <textarea id="c-msg" name="message" required placeholder="Include the tool name and the channel or numbers you used, so we can reproduce it."></textarea>
        <input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
        <button type="submit" class="btn">Send message</button>
        <span class="fmsg" data-msg>We reply by email, usually within two working days.</span>
      </form>
    </div>
    <div class="card faq">
      <h3 style="margin-bottom:8px">Before you write</h3>
      <details><summary>A YouTube or Twitch tool says "not set up" or "quota used up"</summary><p>The live tools run on a free API allowance that resets at midnight Pacific time. If it is used up, try again after that. If it says not set up, the site key is missing and we already know.</p></details>
      <details><summary>The subscriber count is different from what YouTube shows</summary><p>YouTube's public API rounds subscriber counts to three significant figures, so 1,234,567 shows as 1.23M. Views and video counts are exact.</p></details>
      <details><summary>Can you add a tool for Instagram or TikTok that looks up an account?</summary><p>Not without breaking those platforms' terms. They have no free public API, so our Instagram, TikTok and X tools work from numbers you type in.</p></details>
      <details><summary>Is my data stored when I use a tool?</summary><p>No accounts, no tracking. The channel or numbers you enter are used to compute the result and are not kept. Details in the <a href="../privacy/">privacy policy</a>.</p></details>
      <details><summary>Can I embed or link to a tool?</summary><p>Link freely. Every tool has a stable address and most accept the channel in the URL, for example <code>?channel=@handle</code>.</p></details>
    </div>
  </div>`;
  return site.shell({ title: "Contact", ogTitle: "Contact Passive Array", description: "Ask a question, report a wrong number or suggest a tool. Replies by email, usually within two working days.", path: "/contact/", active: "", body });
}

function privacyPage() {
  const body = `
  ${head("Privacy policy", "Privacy policy", "What this site collects, what it does not, and where the data you type goes. Effective " + EFFECTIVE + ".")}
  <div class="card prose">
    <h2 style="margin-top:0">The short version</h2>
    <ul>
      <li>No accounts are needed to use any tool, and there are no advertising or analytics trackers on this site.</li>
      <li>What you type into a tool is used to compute the result and is not stored.</li>
      <li>If you sign up or subscribe, your email is forwarded to our mailing tool so we can send what you asked for.</li>
      <li>Nothing is sold or shared with anyone for marketing.</li>
    </ul>

    <h2>What happens when you use a tool</h2>
    <p><strong>Live YouTube and Twitch tools.</strong> The channel link or handle you enter is sent to our server, which asks the official YouTube Data API or Twitch API for that channel's public statistics and returns them to you. Results are cached on the server for up to six hours so repeated lookups are fast and the free API allowance lasts. The cache is keyed by channel, not by you.</p>
    <p><strong>Calculators.</strong> Instagram, TikTok and X calculators run entirely in your browser. The numbers you type never leave your device.</p>
    <p><strong>AI generators.</strong> Hashtag, bio, idea and growth-plan generators work from built-in templates in your browser. When AI writing is switched on server-side, the text you typed is sent to Anthropic's Claude API to write the result, under <a href="https://www.anthropic.com/legal/privacy" rel="noopener">Anthropic's privacy policy</a>. Anthropic does not train on API inputs. Nothing about you other than that text is included.</p>
    <p><strong>Web tools.</strong> The domain finder and domain age checker send the domain names you enter to our server for lookup. The plagiarism checker sends sentences from your text to a web search API to find matches. The JPG to PDF converter and the SEO ROI calculator run entirely in your browser.</p>

    <h2>Sign-up, newsletter and contact forms</h2>
    <p>When you sign up, subscribe or send a message, we receive your email address, the platform or topic you picked, your message if any, and the page you sent it from. It is forwarded to the mailing and inbox tool we use to send the newsletter and reply to you. You can unsubscribe from any email with one click, or <a href="../contact/">ask us</a> to delete your address.</p>

    <h2>Signing in</h2>
    <p>An account is optional and holds nothing but your email address and whether you want the weekly report. Every tool works without one.</p>
    <p>Sign-in is passwordless, so there is no password to store or lose. You enter your email, we email you a link, and clicking it signs you in. The link is valid for 20 minutes; anyone who can read that email in that window can use it, so treat it like a key.</p>
    <p>Being signed in sets one cookie, <code>pa_session</code>, which holds your email address and an expiry date, signed so it cannot be altered. It is marked HttpOnly and Secure, so scripts on the page cannot read it and it only travels over HTTPS. It lasts 30 days, and signing out clears it immediately. It is not used for tracking or advertising.</p>
    <p>You can delete your email address and preference at any time from the <a href="../account/">account page</a>, which also signs you out.</p>

    <h2>Cookies and local storage</h2>
    <p>Apart from the sign-in cookie described above, the site sets no cookies. It uses your browser's local storage for three things only: light or dark theme, whether you have already signed up (so the button changes), and your email address when signed in (so the header can show the right link without asking the server on every page). All three stay in your browser.</p>

    <h2>Hosting and logs</h2>
    <p>The site and its server functions run on Vercel. Vercel keeps standard request logs (IP address, time, address requested) for a short period for security and debugging, under <a href="https://vercel.com/legal/privacy-policy" rel="noopener">Vercel's privacy policy</a>. We do not build profiles from these logs.</p>

    <h2>Third-party services</h2>
    <p>This site uses <strong>YouTube API Services</strong>. By using the YouTube tools you also agree to the <a href="https://www.youtube.com/t/terms" rel="noopener">YouTube Terms of Service</a>, and Google's handling of data is described in the <a href="https://policies.google.com/privacy" rel="noopener">Google Privacy Policy</a>. The tools read public statistics only and never access your Google account. Twitch data comes from the <a href="https://www.twitch.tv/p/legal/privacy-notice/" rel="noopener">Twitch API</a> on the same basis. Fonts are loaded from Google Fonts.</p>

    <h2>The Chrome extension</h2>
    <p>Passive Array for YouTube has its own <a href="../youtube-extension/privacy/">privacy policy</a>, which describes what the extension reads on YouTube pages and what it sends to this site.</p>

    <h2>Children</h2>
    <p>The site is not directed at children under 13 and collects no personal information from anyone beyond what you choose to type into a form.</p>

    <h2>Changes</h2>
    <p>If this policy changes, the new version is published at this address with a new effective date.</p>

    <h2>Contact</h2>
    <p>Questions about privacy: use the <a href="../contact/">contact form</a>.</p>
  </div>`;
  return site.shell({ title: "Privacy policy", ogTitle: "Passive Array privacy policy", description: "No accounts, no trackers. What you type into a tool is used for the result and not stored. Where sign-up emails go.", path: "/privacy/", active: "", narrow: true, body });
}

function termsPage() {
  const body = `
  ${head("Terms of use", "Terms of use", "Plain-language terms for using Passive Array. Effective " + EFFECTIVE + ".")}
  <div class="card prose">
    <h2 style="margin-top:0">1. What you are agreeing to</h2>
    <p>By using ${esc(BRAND)} (${esc(SITE)}) or the Passive Array for YouTube browser extension, you agree to these terms. If you do not agree, do not use them.</p>

    <h2>2. The tools are free, and estimates are estimates</h2>
    <p>All tools on this site are free to use. Earnings, sponsorship prices, engagement grades, fake-follower estimates and keyword scores are calculated from public numbers and typical industry rates using the formulas shown on each page. They are a starting point for your own judgment, not a guarantee, a valuation or professional advice. Do not make financial, contractual or hiring decisions on these numbers alone.</p>

    <h2>3. Data sources</h2>
    <p>Live figures come from the official YouTube Data API and Twitch API and can lag the platforms' own pages. Subscriber counts from YouTube are rounded by YouTube. Instagram, TikTok and X tools use numbers you enter, and the results are only as accurate as those inputs.</p>

    <h2>4. Acceptable use</h2>
    <ul>
      <li>Do not use the tools to harass, defame or make claims about a person or channel that the numbers do not support.</li>
      <li>Do not scrape, mirror or automate requests against the site or its API in a way that degrades it for others. Reasonable personal or business use, including linking to results, is welcome.</li>
      <li>Do not try to circumvent rate limits or access the underlying API keys.</li>
    </ul>

    <h2>5. YouTube API Services</h2>
    <p>The YouTube tools and the browser extension use YouTube API Services. Your use of them is also subject to the <a href="https://www.youtube.com/t/terms" rel="noopener">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" rel="noopener">Google Privacy Policy</a>.</p>

    <h2>6. AI-generated text</h2>
    <p>Hashtags, bios, ideas, titles, descriptions and tags produced by the generators are suggestions. Check them before you publish. You own what you publish and are responsible for it.</p>

    <h2>7. No warranty, limited liability</h2>
    <p>The site and extension are provided as they are, without warranties of any kind. To the extent the law allows, ${esc(BRAND)} is not liable for any loss arising from use of, or reliance on, the tools or their output.</p>

    <h2>8. Changes and availability</h2>
    <p>Tools may change, be removed or be unavailable at times, for example when a free API allowance is used up for the day. These terms may be updated; the current version is always at this address.</p>

    <h2>9. Contact</h2>
    <p>Questions about these terms: use the <a href="../contact/">contact form</a>.</p>
  </div>`;
  return site.shell({ title: "Terms of use", ogTitle: "Passive Array terms of use", description: "Free tools, estimates are estimates, acceptable use, YouTube API terms, no warranty.", path: "/terms/", active: "", narrow: true, body });
}

function loginPage() {
  const body = `
  ${head("Sign in", "Sign in", "No password to remember. We email you a link that signs you in.")}
  <div class="two-col">
    <div class="card form-card" data-login>
      <form data-login-form novalidate>
        <label for="l-email">Your email</label>
        <input id="l-email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required>
        <input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
        <button type="submit" class="btn wide">Email me a sign-in link</button>
        <span class="fmsg" data-msg>We email you a link. It stays valid for 20 minutes.</span>
      </form>
      <div class="login-done" data-login-sent hidden>
        <h3>Check your inbox</h3>
        <p class="muted">A sign-in link is on its way to that address. It expires in 20 minutes. Look in spam if it has not arrived within a minute.</p>
        <button type="button" class="btn ghost" data-login-again>Use a different address</button>
      </div>
      <div class="login-done" data-login-working hidden>
        <h3>Signing you in…</h3>
        <p class="muted">One moment.</p>
      </div>
    </div>
    <div class="card">
      <h3 style="margin-bottom:10px">Why there is no password</h3>
      <p class="muted" style="font-size:.95rem;line-height:1.6">Passwords get reused, leaked and forgotten. We do not store any, so there are none to lose. You ask for a link, we email it, and clicking it signs you in for 30 days on that device. Treat the link like a key: anyone who reads that email within 20 minutes can use it.</p>
      <h3 style="margin:20px 0 10px">You do not need an account</h3>
      <p class="muted" style="font-size:.95rem;line-height:1.6">Every calculator, checker and generator on this site works without signing in, and always will. An account only holds your email preferences.</p>
      <p style="margin-top:16px"><a href="../creator-tools/">Go straight to the tools</a></p>
    </div>
  </div>`;
  return site.shell({ title: "Sign in", ogTitle: "Sign in to Passive Array", description: "Passwordless sign-in. We email you a link. Every tool on the site works without an account.", path: "/login/", active: "", head: '<meta name="robots" content="noindex">', body });
}

function accountPage() {
  const body = `
  ${head("Account", "Your account", "Your email preferences and your data. Nothing else is stored.")}
  <div data-account hidden>
    <div class="two-col">
      <div class="card">
        <h3 style="margin-bottom:14px">Signed in</h3>
        <div class="pa-rows">
          <div class="arow"><span>Email</span><b data-account-email>–</b></div>
          <div class="arow"><span>Member since</span><b data-account-since>–</b></div>
          <div class="arow"><span>Password</span><b>None. We sign you in by email.</b></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:18px;flex-wrap:wrap">
          <button type="button" class="btn ghost" data-logout>Sign out</button>
          <a class="btn ghost" href="../creator-tools/">Open the tools</a>
        </div>
      </div>
      <div class="card">
        <h3 style="margin-bottom:6px">Weekly creator report</h3>
        <p class="muted" style="font-size:.92rem;margin-bottom:14px">Benchmarks, rate changes and new tools. One email a week.</p>
        <label class="pref"><input type="checkbox" data-pref-weekly><span>Send me the weekly report</span></label>
        <span class="fmsg" data-pref-msg></span>
        <h3 style="margin:24px 0 6px">Your data</h3>
        <p class="muted" style="font-size:.92rem;margin-bottom:14px">We hold your email address and your preference above. Nothing you type into a tool is stored. See the <a href="../privacy/">privacy policy</a>.</p>
        <button type="button" class="btn ghost danger" data-delete>Delete my data</button>
        <span class="fmsg" data-delete-msg></span>
      </div>
    </div>
  </div>
  <div class="card" data-account-out hidden>
    <h3 style="margin-bottom:8px">You are not signed in</h3>
    <p class="muted" style="margin-bottom:16px">Sign in by email to manage your preferences. The tools do not need it.</p>
    <a class="btn" href="../login/">Go to sign in</a>
  </div>
  <div class="card" data-account-loading>
    <p class="muted">Checking your session…</p>
  </div>`;
  return site.shell({ title: "Account", ogTitle: "Your Passive Array account", description: "Manage your email preferences and your data.", path: "/account/", active: "", head: '<meta name="robots" content="noindex">', body });
}

const PAGES = { about: aboutPage, contact: contactPage, privacy: privacyPage, terms: termsPage, login: loginPage, account: accountPage };

// Pages that carry a noindex tag: they are functional, not content, so they
// stay out of the sitemap and out of robots.
const NOINDEX = ["login", "account"];

function buildInto(dist) {
  const fs = require("fs");
  const path = require("path");
  for (const [slug, make] of Object.entries(PAGES)) {
    const dir = path.join(dist, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), make());
  }
  return {
    all: Object.keys(PAGES).map((s) => `/${s}/`),
    indexable: Object.keys(PAGES).filter((s) => !NOINDEX.includes(s)).map((s) => `/${s}/`),
    noindex: NOINDEX.map((s) => `/${s}/`),
  };
}

module.exports = { buildInto, PAGES, NOINDEX };
