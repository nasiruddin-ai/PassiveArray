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
        <input id="c-name" type="text" name="name" autocomplete="name" placeholder="Type your name (optional)">
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
    <p>If you are already logged into a Google account, some pages may show Google's one-tap prompt offering to sign you up with that account. Dismissing it does nothing, and Google applies its own cooldown before showing it again. We receive your email address only if you accept.</p>
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

// One component, two entry points: /login/ and /signup/. The JS in site.js
// asks /api/auth?action=health and hides whichever methods are not set up, so
// the page never shows a button that cannot work.
function authPage(mode) {
  const signup = mode === "signup";
  const body = `
  ${head(signup ? "Create account" : "Sign in", signup ? "Create your free account" : "Sign in", signup
    ? "Free, and optional. Every tool on this site works without an account."
    : "Use Google, a password, or a link emailed to you.")}
  <div class="two-col">
    <div class="card form-card" data-auth data-auth-mode="${signup ? "signup" : "signin"}">

      <div class="authmsg" data-auth-off hidden>
        <h3>Accounts are not switched on yet</h3>
        <p class="muted">Every calculator, checker and generator works without one. Try the <a href="../creator-tools/">tools</a>.</p>
      </div>

      <div data-auth-body hidden>
        <div data-google-wrap hidden>
          <div class="gbtn" data-google-button></div>
          <div class="orline"><span>or</span></div>
        </div>

        <form data-auth-form novalidate>
          <label for="a-email">Email</label>
          <input id="a-email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required>

          <div data-password-wrap hidden>
            <label for="a-password">Password</label>
            <div class="pwfield">
              <input id="a-password" type="password" name="password" placeholder="At least 10 characters">
              <button type="button" class="pwshow" data-pw-show aria-label="Show password">Show</button>
            </div>
            <span class="fmsg" data-pw-hint hidden>At least 10 characters. Longer beats complicated.</span>
          </div>

          <input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
          <button type="submit" class="btn wide" data-auth-submit>${signup ? "Create my account" : "Sign in"}</button>
          <span class="fmsg" data-msg></span>
        </form>

        <div class="authalt">
          <button type="button" class="link" data-want-link hidden>Email me a sign-in link instead</button>
          <button type="button" class="link" data-want-password hidden>Use a password instead</button>
        </div>

        <p class="authswap">
          <span data-swap-signin${signup ? "" : " hidden"}>Already have an account? <a href="../login/">Sign in</a></span>
          <span data-swap-signup${signup ? " hidden" : ""}>New here? <a href="../signup/">Create an account</a></span>
        </p>
      </div>

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
      <h3 style="margin-bottom:10px">You do not need an account</h3>
      <p class="muted" style="font-size:.95rem;line-height:1.6">Every calculator, checker and generator on this site works without signing in, and always will. An account holds your email address and whether you want the weekly report. Nothing else.</p>
      <h3 style="margin:20px 0 10px">Three ways in</h3>
      <ul class="plain">
        <li><b>Google.</b> Fastest. We receive your email address and nothing else, and never get access to your Google account.</li>
        <li><b>Password.</b> Stored only as a scrypt hash, which cannot be reversed into your password.</li>
        <li><b>Email link.</b> No password at all. The link stays valid for 20 minutes, so treat it like a key.</li>
      </ul>
      <p style="margin-top:16px"><a href="../creator-tools/">Go straight to the tools</a></p>
    </div>
  </div>`;
  return site.shell({
    title: signup ? "Create account" : "Sign in",
    ogTitle: signup ? "Create a free Passive Array account" : "Sign in to Passive Array",
    description: signup
      ? "Create a free account with Google, a password or an email link. Every tool on the site works without one."
      : "Sign in with Google, a password, or a link emailed to you.",
    path: signup ? "/signup/" : "/login/",
    active: "",
    head: '<meta name="robots" content="noindex">',
    body,
  });
}

const loginPage = () => authPage("signin");
const signupPage = () => authPage("signup");

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
          <div class="arow"><span>Sign-in methods</span><b data-account-methods>–</b></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:18px;flex-wrap:wrap">
          <button type="button" class="btn ghost" data-logout>Sign out</button>
          <a class="btn ghost" href="../creator-tools/">Open the tools</a>
        </div>

        <div data-setpw-wrap hidden>
          <h3 style="margin:24px 0 6px" data-setpw-title>Add a password</h3>
          <p class="muted" style="font-size:.92rem;margin-bottom:12px">Optional. It gives you a second way in if you lose access to your email.</p>
          <form data-setpw-form novalidate>
            <label for="sp-password">New password</label>
            <div class="pwfield">
              <input id="sp-password" type="password" name="password" placeholder="At least 10 characters" autocomplete="new-password">
              <button type="button" class="pwshow" data-pw-show aria-label="Show password">Show</button>
            </div>
            <button type="submit" class="btn ghost" style="margin-top:12px">Save password</button>
            <span class="fmsg" data-setpw-msg></span>
          </form>
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

/* ------------------------------------------------------------ comparisons
   These pages exist because "vidiq alternative" and "tubebuddy alternative"
   are real searches, and because someone deciding between us deserves a
   straight answer including the parts where the other product wins. A
   comparison that only lists the competitor's faults is not persuasive and
   does not deserve to rank. */

const CHECKED = "September 2026";

function cmpTable(rows, them) {
  return `<div class="tablewrap"><table class="cmp">
    <thead><tr><th>What you want to do</th><th class="us">Passive Array</th><th>${esc(them)}</th></tr></thead>
    <tbody>${rows.map((r) => `<tr><td>${esc(r[0])}</td><td class="us">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody>
  </table></div>`;
}

function comparePage(opts) {
  const n = site.tools.length;
  const body = `
  <div class="page-head">
    <div class="crumbs"><a href="../../">Home</a> / <a href="../">Compare</a> / ${esc(opts.them)}</div>
    <h1>${esc(opts.h1)}</h1>
    <p class="lead">${esc(opts.lead)}</p>
    <div class="meta"><b>CHECKED</b><span>${CHECKED}, from ${esc(opts.them)}'s own public pages</span></div>
  </div>

  <div class="card compare-strip">${cmpTable(opts.rows, opts.them)}
    <p class="note">${esc(opts.tableNote)}</p>
  </div>

  <div class="two-col" style="margin-top:28px">
    <div class="card prose">
      <h2 style="margin-top:0">The short answer</h2>
      ${opts.shortAnswer}

      <h2>Where ${esc(opts.them)} genuinely wins</h2>
      <p>These are not concessions for the sake of looking fair. They are things we cannot do, and if you need them, ${esc(opts.them)} is the better buy.</p>
      <ul>${opts.theyWin.map((x) => `<li>${x}</li>`).join("")}</ul>

      <h2>Where we win</h2>
      <ul>${opts.weWin.map((x) => `<li>${x}</li>`).join("")}</ul>

      <h2>Who should use which</h2>
      ${opts.whoShould}
    </div>
    <div>
      <div class="card">
        <h3 style="margin-bottom:10px">Try the overlap first</h3>
        <p class="muted" style="font-size:.92rem;margin-bottom:14px">These do the same job as the ${esc(opts.them)} features people use most, and they need no account.</p>
        <div style="display:grid;gap:8px">
          ${opts.tryTools.map((s) => {
            const t = site.tools.find((x) => x.slug === s);
            return t ? `<a class="btn ghost" href="../../creator-tools/${t.slug}/">${esc(t.name.replace(/^YouTube /, ""))}</a>` : "";
          }).join("")}
        </div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3 style="margin-bottom:10px">On YouTube itself</h3>
        <p class="muted" style="font-size:.92rem;margin-bottom:14px">Both of them are best known for their browser extension. Ours is free and shows engagement rate, hidden tags and a keyword score on every video and search page.</p>
        <a class="btn" href="../../youtube-extension/">See the extension</a>
      </div>
    </div>
  </div>

  <div class="cta-band">
    <div><h3>Nothing to sign up for. Pick a tool and get an answer.</h3><p>${n} tools, no account, no card, no trial that expires.</p></div>
    <a class="btn mint" href="../../creator-tools/">Browse all ${n} tools</a>
  </div>`;

  return site.shell({
    title: opts.title,
    ogTitle: opts.h1,
    description: opts.description,
    path: opts.path,
    active: "compare",
    body,
    jsonld: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: opts.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
    head: opts.faqHtml ? "" : "",
  });
}

function vidiqPage() {
  const n = site.tools.length;
  return comparePage({
    them: "vidIQ",
    path: "/compare/vidiq-alternative/",
    title: "Free vidIQ Alternative",
    h1: "A free vidIQ alternative, with no account and no credit limit",
    lead: "vidIQ is a good product. This page is about the one thing it will not do, which is let you use it properly without signing up and, past a point, without paying.",
    description: `Passive Array is a free vidIQ alternative: ${n} tools for keywords, titles, tags and earnings, with no account, no AI credit limit and no trial.`,
    tableNote: `Checked ${CHECKED} against vidIQ's own pricing and tools pages. vidIQ's paid tiers do considerably more than this table shows; the comparison is deliberately limited to what you can do without paying, because that is what people searching for an alternative are asking about.`,
    rows: [
      ["Use it without creating an account", "Yes, nothing is gated", "No, sign-up required first"],
      ["Generate titles, descriptions and tags", "Unlimited", "Limited by a monthly AI credit allowance"],
      ["Keyword research", "Unlimited", "Limited on the free plan"],
      ["Score a title before publishing", "Yes, with every check shown", "Yes, on the paid tiers"],
      ["Channel statistics from the official API", "Yes", "Yes"],
      ["Browser extension", "Free", "Free, with paid features inside it"],
      ["Instagram, TikTok and Twitch tools", "Included", "YouTube and Instagram"],
      ["See the formula behind a number", "On every page", "No"],
      ["Cost to lift the limits", "There are no limits to lift", "From roughly $17 a month"],
    ],
    shortAnswer: `<p>If you want keyword ideas, a title scored properly, tags inside the character limit, a description laid out for the two lines that matter, and an honest earnings range, everything here does that for nothing and asks for no email address.</p>
      <p>If you want vidIQ's coaching, its publishing and scheduling, or its daily personalised ideas tuned to your own channel's analytics, you need vidIQ. Those depend on a connection to your YouTube account that we deliberately do not ask for.</p>`,
    theyWin: [
      "<strong>Access to your own private analytics.</strong> Connect your channel and vidIQ can see watch time, click-through rate and traffic sources. We never ask for that access, so we can only ever work from public data.",
      "<strong>Daily personalised ideas and coaching.</strong> Their suggestions are tuned to your channel's own history. Ours are tuned to your topic.",
      "<strong>Publishing and scheduling.</strong> They can upload and manage videos for you. We are a set of calculators and generators, not a publishing tool.",
      "<strong>Tracking over time.</strong> They store your numbers and chart the trend. We store nothing, which is a privacy feature and a tracking limitation at the same time.",
      "<strong>Thumbnail generation.</strong> They will make you an image. We will not, because doing it well needs paid image generation.",
    ],
    weWin: [
      "<strong>No account, ever.</strong> No email, no Google sign-in, no card. Open a tool and use it.",
      "<strong>No credit limit.</strong> Generate a hundred titles today and a hundred tomorrow. There is no allowance to run down.",
      "<strong>The formula is on the page.</strong> Every estimate shows how it was calculated and what assumption drives each end of the range.",
      "<strong>No invented search volume.</strong> Nobody outside Google has YouTube's volume data. We show what the top results are actually doing instead of a modelled number presented as fact.",
      "<strong>More platforms.</strong> Instagram, TikTok, Twitch and X tools are included rather than being a different product.",
    ],
    whoShould: `<p><strong>Use Passive Array if</strong> you are deciding what to make, writing the title and description, checking a channel before a deal, or sanity-checking an earnings claim. Also if you simply do not want another subscription or another account.</p>
      <p><strong>Use vidIQ if</strong> you want software that watches your own channel continuously, tells you what to do next based on your own retention data, and publishes for you. That is a different job and worth paying for if you need it.</p>
      <p><strong>Plenty of people use both</strong>, which is entirely sensible. Ours costs nothing to keep in a browser tab.</p>`,
    tryTools: ["youtube-keyword-generator", "youtube-title-generator", "youtube-title-analyzer", "youtube-tag-generator", "youtube-money-calculator"],
    faq: [
      ["Is Passive Array really a free vidIQ alternative?", "For the research, title, tag, description and earnings jobs, yes, with no account and no credit allowance. It does not replace vidIQ's access to your own private channel analytics or its publishing features, because those require connecting your YouTube account."],
      ["Does Passive Array have a browser extension like vidIQ?", "Yes, and it is free. It shows engagement rate, hidden tags, views per day and a keyword score on YouTube's video, channel and search pages."],
      ["Do I need to sign up to use Passive Array?", "No. Every tool works without an account. An account is optional and only stores your email address and whether you want the weekly report."],
      ["Why does Passive Array not show search volume like vidIQ does?", "Because no tool outside Google has YouTube's search volume data. Any figure you see is modelled, usually from web search data. We show measured signals from the actual top results instead."],
    ],
  });
}

function tubebuddyPage() {
  const n = site.tools.length;
  return comparePage({
    them: "TubeBuddy",
    path: "/compare/tubebuddy-alternative/",
    title: "Free TubeBuddy Alternative",
    h1: "A free TubeBuddy alternative that does not need a Google sign-in",
    lead: "TubeBuddy is built around connecting to your YouTube account, which is exactly what makes it powerful and exactly what some people would rather not do. This is what you can get without that.",
    description: `Passive Array is a free TubeBuddy alternative: ${n} tools for keywords, tags, titles and earnings, with no Google sign-in and no paid tier.`,
    tableNote: `Checked ${CHECKED} against TubeBuddy's own features and pricing pages. TubeBuddy's paid plans include bulk channel management features that have no equivalent here by design, because they require write access to your YouTube account.`,
    rows: [
      ["Use it without signing in with Google", "Yes", "No, Google sign-in required"],
      ["Keyword research", "Unlimited", "Limited on the free plan"],
      ["Tag generation inside the 500-character limit", "Unlimited", "Limited on the free plan"],
      ["Title scoring before you publish", "Yes, every check shown", "Yes, on paid tiers"],
      ["Thumbnail A/B testing", "No", "Yes, a genuine strength"],
      ["Bulk edits across your videos", "No", "Yes, on paid tiers"],
      ["Instagram, TikTok and Twitch tools", "Included", "YouTube only"],
      ["See the formula behind a number", "On every page", "No"],
      ["Cost to lift the limits", "There are no limits to lift", "Paid monthly or annual plans"],
    ],
    shortAnswer: `<p>TubeBuddy's best features change things inside your YouTube account: testing two thumbnails against each other, editing end screens across a back catalogue, bulk-updating descriptions. All of that needs permission to write to your channel.</p>
      <p>We never ask for that permission, so we cannot do any of it. What we can do is everything that happens before you hit publish, and everything you would want to know about a channel that is not yours.</p>`,
    theyWin: [
      "<strong>Thumbnail A/B testing.</strong> Genuinely the best reason to pay for TubeBuddy. Running two thumbnails against each other on live traffic is the only reliable way to know which works, and it requires account access we do not have.",
      "<strong>Bulk editing.</strong> Updating end screens, cards or descriptions across hundreds of videos at once. If you have a large back catalogue this alone justifies the subscription.",
      "<strong>Your own channel's private analytics.</strong> Retention curves, click-through rate and traffic sources are invisible from outside. TubeBuddy can read them; nobody without your permission can.",
      "<strong>Published, tracked history.</strong> They keep your numbers over time and show the trend. We hold nothing, so every look is a fresh snapshot.",
    ],
    weWin: [
      "<strong>No Google sign-in.</strong> Nothing here touches your YouTube account, so there is no permission to grant and nothing to revoke later.",
      "<strong>Nothing is limited.</strong> No credit allowance, no locked buttons, no upgrade prompt in the middle of a task.",
      "<strong>Research any channel, not just your own.</strong> Comparison, quality scoring and engagement benchmarks work on anyone's public channel.",
      "<strong>The formula is shown.</strong> Every number says how it was produced, so you can argue with it rather than trust it blindly.",
      "<strong>Four platforms, not one.</strong> Instagram, TikTok, Twitch and X tools are included.",
    ],
    whoShould: `<p><strong>Use Passive Array if</strong> you are researching a topic, writing titles and tags, checking someone else's channel, or pricing a sponsorship. Also if you would rather not grant write access to your channel to any third party.</p>
      <p><strong>Use TubeBuddy if</strong> you want to test thumbnails properly or manage a large back catalogue. Nothing free replaces those, including us.</p>
      <p><strong>Using both is reasonable.</strong> Plan and write here, publish and test there.</p>`,
    tryTools: ["youtube-keyword-generator", "youtube-tag-generator", "youtube-title-analyzer", "youtube-channel-quality-checker", "youtube-thumbnail-downloader"],
    faq: [
      ["Is there a free TubeBuddy alternative?", "For keyword research, tags, titles, descriptions, channel checks and earnings estimates, Passive Array does those without an account or a paid tier. It does not replace thumbnail A/B testing or bulk editing, which require write access to your YouTube account."],
      ["Does Passive Array need access to my YouTube account?", "No. It reads only public data through the official YouTube API, so there is no permission to grant and nothing to revoke."],
      ["Can Passive Array A/B test thumbnails?", "No. Testing thumbnails against live traffic requires permission to change your video, which we do not ask for. TubeBuddy is the right tool for that."],
      ["Is Passive Array's extension like TubeBuddy's?", "It covers the research side: engagement rate, hidden tags, views per day and keyword scoring on video, channel and search pages. It does not edit your channel."],
    ],
  });
}

function compareHubPage() {
  const n = site.tools.length;
  const card = (href, name, text) => `<a class="card" href="${href}"><span class="tagline"><span class="plat" style="color:var(--deep)">COMPARISON</span></span><h3>${esc(name)}</h3><p>${esc(text)}</p></a>`;
  const body = `
  ${head("Compare", "How Passive Array compares", "Straight comparisons with the tools people weigh us against, including the parts where they are better. Checked " + CHECKED + ".")}
  <div class="grid c2">
    ${card("vidiq-alternative/", "Passive Array vs vidIQ", "What you get without the monthly AI credit allowance, and the three things vidIQ does that we cannot.")}
    ${card("tubebuddy-alternative/", "Passive Array vs TubeBuddy", "What you get without a Google sign-in, and why thumbnail A/B testing is still worth paying for.")}
  </div>

  <div class="card compare-strip" style="margin-top:24px">
    <h2 style="padding:14px 14px 0;font-size:1.25rem">The one-line version</h2>
    <div class="tablewrap"><table class="cmp">
      <thead><tr><th></th><th class="us">Passive Array</th><th>vidIQ</th><th>TubeBuddy</th></tr></thead>
      <tbody>
        <tr><td>Account needed</td><td class="us">No</td><td>Yes</td><td>Yes, Google</td></tr>
        <tr><td>Free tier limits</td><td class="us">None</td><td>Monthly AI credits</td><td>Feature limits</td></tr>
        <tr><td>Reads your private analytics</td><td class="us">No, by design</td><td>Yes, if connected</td><td>Yes, if connected</td></tr>
        <tr><td>Edits your channel</td><td class="us">No, by design</td><td>Yes</td><td>Yes</td></tr>
        <tr><td>Platforms covered</td><td class="us">YouTube, Instagram, TikTok, Twitch, X</td><td>YouTube, Instagram</td><td>YouTube</td></tr>
        <tr><td>Shows the formula</td><td class="us">Always</td><td>No</td><td>No</td></tr>
        <tr><td>Price</td><td class="us">Free</td><td>Free tier, paid from about $17/mo</td><td>Free tier, paid plans</td></tr>
      </tbody>
    </table></div>
    <p class="note">Both are capable products and neither is a scam. The honest summary is that they are subscriptions with a sample attached, and we are a free toolset with a narrower job. If you need software that watches and edits your own channel, pay them. If you need answers before you publish, you do not need to pay anyone.</p>
  </div>

  <div class="cta-band">
    <div><h3>Decide by using it, not by reading about it</h3><p>${n} tools, no account, no card.</p></div>
    <a class="btn mint" href="../creator-tools/">Browse all ${n} tools</a>
  </div>`;
  return site.shell({
    title: "Compare",
    ogTitle: "Passive Array compared with vidIQ and TubeBuddy",
    description: "Honest comparisons of Passive Array with vidIQ and TubeBuddy, including what they do better. No account needed for any Passive Array tool.",
    path: "/compare/",
    active: "compare",
    body,
  });
}

/* ---------------------------------------------------------------- pricing */
function pricingPage() {
  const n = site.tools.length;
  const live = site.tools.filter((t) => t.api === "youtube" || t.api === "twitch").length;
  const body = `
  ${head("Pricing", "Pricing", "There is one plan. It is free, and it is the whole thing.")}
  <div class="grid c2" style="align-items:start">
    <div class="card" style="border-color:var(--teal);border-width:2px">
      <span class="k" style="font-size:.76rem;font-weight:700;letter-spacing:.06em;color:var(--deep)">EVERYTHING</span>
      <div style="font-size:3rem;font-weight:600;letter-spacing:-.03em;line-height:1.1;margin:8px 0 4px">$0</div>
      <p class="muted" style="margin-bottom:18px">Not a trial. Not a freemium tier. The price.</p>
      <ul class="plain">
        <li><b>All ${n} tools</b>, with no feature locked</li>
        <li><b>${live} tools with live data</b> from the official YouTube and Twitch APIs</li>
        <li><b>Unlimited generations.</b> No credit allowance to run down</li>
        <li><b>The Chrome extension</b>, free as well</li>
        <li><b>No account required.</b> No email, no card, no Google sign-in</li>
        <li><b>No ads</b> between you and the answer</li>
      </ul>
      <a class="btn wide" href="../creator-tools/" style="margin-top:20px">Start using them</a>
    </div>
    <div class="card prose">
      <h2 style="margin-top:0">How it can be free</h2>
      <p>Because it is cheap to run. The site is static pages served from a free hosting tier. The live lookups use the free allowances YouTube and Twitch give every developer. There is no database of scraped profiles to maintain and no sales team.</p>
      <p>The expensive parts of a product like vidIQ are the parts we deliberately do not build: storing your history, watching your channel continuously, and holding write access to your account. Those need real infrastructure, and that is what a subscription pays for.</p>

      <h2>What we would charge for, if ever</h2>
      <p>If paid features arrive, they will be things that cost real money to run: saved reports, alerts when a channel you track moves, and exports. Everything on this site today stays free when that happens. We would rather say that now and be held to it.</p>

      <h2>What we do not do</h2>
      <ul>
        <li>No ads, and no affiliate links dressed up as recommendations.</li>
        <li>No selling or sharing of anything you type in. Most tools never send it anywhere.</li>
        <li>No email wall in front of a result.</li>
      </ul>

      <h2>If you want to help</h2>
      <p>Tell someone. Or <a href="../contact/">report a number that looks wrong</a>, which is genuinely more useful than money at this stage.</p>
    </div>
  </div>

  <div class="card compare-strip" style="margin-top:28px">
    <h2 style="padding:14px 14px 0;font-size:1.25rem">Compared with the paid options</h2>
    <div class="tablewrap"><table class="cmp">
      <thead><tr><th></th><th class="us">Passive Array</th><th>vidIQ</th><th>TubeBuddy</th></tr></thead>
      <tbody>
        <tr><td>Entry price</td><td class="us">Free</td><td>Free tier, then about $17/mo</td><td>Free tier, then paid plans</td></tr>
        <tr><td>Free tier limits</td><td class="us">None</td><td>Monthly AI credit allowance</td><td>Feature limits</td></tr>
        <tr><td>Account required to start</td><td class="us">No</td><td>Yes</td><td>Yes</td></tr>
      </tbody>
    </table></div>
    <p class="note">Checked ${CHECKED} from both companies' public pricing pages. Prices change; <a href="../contact/">tell us</a> if this is stale. Full detail on the <a href="../compare/">comparison pages</a>.</p>
  </div>`;
  return site.shell({
    title: "Pricing",
    ogTitle: "Passive Array pricing: free, with no tier above it",
    description: `All ${n} Passive Array tools are free with no account, no credit limit and no paid tier. Here is how that works and what we would ever charge for.`,
    path: "/pricing/",
    active: "pricing",
    body,
    jsonld: {
      "@context": "https://schema.org", "@type": "Product", name: "Passive Array",
      description: `${n} free tools for creators and brands.`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock", url: SITE + "/pricing/" },
    },
  });
}

/* -------------------------------------------------------------------- FAQ */
const FAQ_SECTIONS = [
  ["About the tools", [
    ["Is Passive Array really free?", "Yes, and there is no trial to expire. Every tool works without an account, without a card and without a credit limit. The site runs on free hosting and free API allowances, which is why it can stay that way."],
    ["Do I need an account?", "No. Nothing is behind a sign-in. An account is optional and holds your email address and whether you want the weekly report, nothing else."],
    ["Will the tools I use today start costing money?", "No. If paid features ever arrive they will be new things that cost real money to run, such as saved reports and alerts. What is on the site today stays free."],
    ["Is there a catch, like ads or selling my data?", "There are no ads and nothing you type is sold or shared. Most tools never send your input anywhere at all; the ones that do say so on the page."],
  ]],
  ["Where the numbers come from", [
    ["How accurate are the earnings figures?", "They are ranges, not payslips. Revenue per thousand views swings with niche, audience country and Shorts share, so any single figure would be misleading. We show the range and the assumption behind each end, and you can change the assumptions."],
    ["Why does the subscriber count not match YouTube exactly?", "YouTube rounds public subscriber counts to three significant figures in its API, so 1,234,567 reaches every third-party tool as 1.23M. Views and video counts are exact."],
    ["Why do you not show search volume for keywords?", "Because nobody outside Google has YouTube's search volume. Every tool showing one is modelling it, then presenting the guess with a precision it has not earned. We show what the top results are actually doing, which is measured."],
    ["Why are the Instagram and TikTok tools based on numbers I type in?", "Neither platform offers a free public API for follower and engagement data, and scraping them breaks their terms. Rather than build on something that would break or get us blocked, those tools ask you for the numbers and are honest about it."],
    ["What does the quality score actually measure?", "Engagement rate against the benchmark for that channel size, views per subscriber, upload consistency and channel age, combined into a score out of 100. The page lists each part and its weight."],
  ]],
  ["Using the tools", [
    ["A tool says the quota is used up. What now?", "The live YouTube and Twitch tools run on a free daily allowance that resets at midnight Pacific time. Everything that does not need live data keeps working."],
    ["Can I link to a result?", "Yes. Most tools accept the input in the address, for example adding ?channel=@handle, and every result page has a copy-link button."],
    ["Is there a browser extension?", "Yes, and it is free. It puts engagement rate, hidden tags, views per day and a keyword score on YouTube's video, channel and search pages."],
    ["Do the AI generators make things up?", "They are instructed not to, and they only work from what you type. If an input is empty they write a [placeholder] in square brackets rather than inventing a fact, a number or a testimonial."],
  ]],
  ["Compared with other tools", [
    ["How is this different from vidIQ?", "vidIQ is a subscription with a free sample attached: a monthly AI credit allowance and a sign-up before you see anything. Here nothing is gated. vidIQ does things we cannot, such as reading your own private analytics and publishing for you. The full comparison is on its own page."],
    ["How is this different from TubeBuddy?", "TubeBuddy connects to your YouTube account and can change things inside it, including running thumbnail A/B tests, which is genuinely worth paying for. We never ask for that access, so we cover everything that happens before you publish."],
    ["Should I use Passive Array instead of paying for one of them?", "For research, titles, tags, descriptions, channel checks and pricing, yes. If you need thumbnail testing, bulk editing or coaching tuned to your own retention data, pay for the tool that does it. Plenty of people use both."],
  ]],
];

function faqPage() {
  const all = FAQ_SECTIONS.flatMap(([, qs]) => qs);
  const body = `
  ${head("FAQ", "Questions and straight answers", "Including the awkward ones about where the numbers come from and what we cannot do.")}
  ${FAQ_SECTIONS.map(([title, qs]) => `
    <h2 style="margin:32px 0 12px;font-size:1.3rem">${esc(title)}</h2>
    <div class="card faq">${qs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
  `).join("")}
  <div class="cta-band">
    <div><h3>Not answered here?</h3><p>Ask directly. Replies come by email, usually within two working days.</p></div>
    <a class="btn mint" href="../contact/">Ask a question</a>
  </div>`;
  return site.shell({
    title: "FAQ",
    ogTitle: "Passive Array FAQ",
    description: "Is it really free, where do the numbers come from, why is there no search volume, and how it compares with vidIQ and TubeBuddy.",
    path: "/faq/",
    active: "",
    narrow: true,
    body,
    jsonld: {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: all.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  });
}

// Keys are site paths, so a key may contain slashes for a nested page.
const PAGES = {
  about: aboutPage,
  contact: contactPage,
  pricing: pricingPage,
  faq: faqPage,
  compare: compareHubPage,
  "compare/vidiq-alternative": vidiqPage,
  "compare/tubebuddy-alternative": tubebuddyPage,
  privacy: privacyPage,
  terms: termsPage,
  login: loginPage,
  signup: signupPage,
  account: accountPage,
};

// Pages that carry a noindex tag: they are functional, not content, so they
// stay out of the sitemap and out of robots.
const NOINDEX = ["login", "signup", "account"];

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
