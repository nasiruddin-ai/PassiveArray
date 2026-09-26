# Passive Array

Free tools for creators and brands. One repository, one Netlify site.

- **35 creator tools** at `/creator-tools/`: live YouTube and Twitch checks, Instagram, TikTok and X calculators, fake-follower estimators, comparisons and content generators.
- **5 web tools**: domain finder, domain age checker, plagiarism checker, JPG to PDF, SEO ROI calculator.
- **Brand kit** in `passive-array-brand/`: logo, favicons, social images, brand guide.

## Deploy on Netlify

1. Push this folder to a GitHub repository.
2. In Netlify: **Add new project**, **Import an existing project**, pick the repository.
3. Netlify reads `netlify.toml`: build command `node build.js`, publish folder `dist`. Leave them and click Deploy.
4. **Project configuration**, **Environment variables**, add:

| Variable | Needed for | Where to get it |
|---|---|---|
| `YOUTUBE_API_KEY` | The 9 live YouTube tools | Google Cloud, YouTube Data API v3, free. Steps in `creator-tools/README.md` |
| `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` | The 2 live Twitch tools | dev.twitch.tv/console, free |
| `GOOGLE_API_KEY`, `GOOGLE_CX` | Plagiarism checker web search | Google Programmable Search, see `plagiarism-checker/README.md` |
| `ANTHROPIC_API_KEY` | Optional. AI-written hashtags, bios, ideas, growth plan | console.anthropic.com, paid. Without it the generators use built-in templates |

5. Trigger a deploy after adding variables. Every later push to `main` redeploys automatically.

## Deploy on Vercel instead

The repository also works on Vercel. Import it, keep the detected settings
(`vercel.json` sets the build command and the `dist` output folder), add the same
environment variables under Settings, Environment Variables, and deploy. The
API routes run as Vercel Functions from the `api/` folder; `vercel.json` maps the
tool URLs onto them, so the pages need no changes.

## Research section

`/research/` is YouTube keyword research built only from measured sources:
YouTube autocomplete (free, no quota) plus the top 10 results for the phrase
from the Data API. It shows competing videos, the top 10 with live views and
channel sizes, an opportunity score with its formula, and every phrase
YouTube autocompletes around the keyword. It never shows a search volume
figure, because nobody outside Google has one for YouTube.

Code: `lib/research.js` (logic), `api/research.js` and
`netlify/functions/research.mjs` (routes), `pages/research-pages.js` (page),
`creator-tools/public/research.js` (browser side).

### Quota and the key-value store

One keyword analysis costs 102 YouTube quota units; a free key has 10,000 a
day. Results are cached for 7 days and a daily guard stops fresh analyses at
`RESEARCH_DAILY_UNITS` (default 8,000), so the other live tools keep working.
Without a store the cache lives only in each function instance and the guard
resets whenever Vercel starts a new one, so add the store before promoting
the page:

1. In Vercel open the project, **Storage**, **Create Database**, choose
   **Upstash** (Redis), free plan, and connect it to the project. Vercel adds
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. Alternatively
   create a database at upstash.com and add `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN` yourself.
2. Redeploy. Cached keywords then survive across instances, the quota counter
   is shared, and every analysed keyword starts filling `idx:channels`, the
   channel index the upcoming outlier and growth feeds are built from.

The same store already powers sign-ups and rate limits (`lib/store.js`).

### Outlier videos and Shorts

`/research/outliers/` and `/research/shorts/` list uploads from the last 90
days that did 3x or more what their channel's other recent uploads did
(`views / median views of the channel's other last-10 uploads`). Filters by
topic, minimum multiplier, age and sort, plus a thumbnail-grid view.

The feed is built by a daily job, `api/research-cron.js`, scheduled in
`vercel.json` (`crons`, 05:15 UTC, the once-a-day cadence the free plan
allows). It walks the channel index (`idx:channels`), scans up to
`OUTLIER_CHANNELS_PER_RUN` channels (default 250) within
`OUTLIER_UNITS_PER_RUN` quota units (default 3,000), writes the feed to
`outliers:latest` and one snapshot per channel per day (`snap:<id>:<date>`)
for the growth rankings. On an empty index it first seeds a dozen broad
niches. A store lock stops it running more than once every 6 hours.

Optional: set `CRON_SECRET` so only Vercel's scheduler (and you, with
`/api/research-cron?key=...`) can trigger the job. Logic: `lib/outliers.js`.

## How it is built

```
build.js                 Builds dist/: home page, web tool pages, creator tools, brand files
netlify.toml             Netlify settings and function packaging
netlify/functions/       API routes on Netlify (YouTube, Twitch, AI, domain and plagiarism lookups)
api/                     The same routes for Vercel; vercel.json rewrites the tool URLs to them
creator-tools/           tools.js (the list of tools), build-tools.js (page generator), public/ (CSS and JS), lib/ (API helpers)
passive-array-brand/     Logo SVGs, favicons, social images, brand-guide.html, make-brand.js
domain-finder/ ...       The web tools, each with its own README and a Start.bat for local use
```

Run locally without Netlify:

```
node build.js            # builds dist/ so you can open dist/index.html
creator-tools/Start.bat  # local server for the creator tools with live API routes
```

## Adding a creator tool

1. Add an entry to `creator-tools/tools.js`.
2. Add `COMPUTE["your-slug"]` in `creator-tools/public/shared.js`.
3. Run `node build.js`.

Details in `creator-tools/README.md`. The brand guide is `passive-array-brand/brand-guide.html`.

## Notes

- Never commit API keys. Local keys go in `creator-tools/config.json`, which git ignores.
- The video downloader from the original workspace is not included: it needs ffmpeg and yt-dlp binaries that Netlify cannot run.

## Site structure (beyond the tools)

| Path | Source | Notes |
|---|---|---|
| `/blog/` and `/blog/<slug>/` | `blog/posts/*.md`, built by `blog/build-blog.js` | Add an article by adding a Markdown file with the front matter shown at the top of `build-blog.js`. Newest first. |
| `/about/`, `/contact/`, `/privacy/`, `/terms/` | `pages/site-pages.js` | Company pages. |
| `/youtube-extension/` and `/youtube-extension/privacy/` | `youtube-extension/pages.js` | Landing page and privacy policy for the Chrome extension. |
| `chrome-extension/` | The extension source itself | See `chrome-extension/README.md` and `STORE-LISTING.md`. Not part of the website build. |
| `/sitemap.xml`, `/robots.txt` | generated by `build.js` | Every tool, article and page. |
| `/api/subscribe` | `api/subscribe.js` | Receives sign-ups, newsletter and contact forms. |

## Sign-up, newsletter and contact forms

The "Sign up free" button, the footer newsletter box and the contact page all
POST to `/api/subscribe`, which forwards each entry as JSON to a destination
you own. Nothing is stored on the site itself.

**Until a destination is set, the forms say "Sign-up is not open yet."** The
buttons and the modal work; there is simply nowhere to put the email. Check
the current state at any time:

```
https://passivearray.vercel.app/api/subscribe?health=1
```

It answers `"configured": true` or `false`. It never reveals the destination.

### Option A: Google Sheet (recommended, about five minutes)

Always reachable, free, and needs no account beyond the Google one you have.

1. Create a new Google Sheet. Name it something like "Passive Array sign-ups".
2. In that sheet choose **Extensions**, **Apps Script**. A code editor opens.
3. Delete whatever is in `Code.gs`, then paste the whole contents of
   `setup/google-sheet-receiver.gs` from this repository. Click the save icon.
4. Click **Deploy**, **New deployment**. Press the gear next to "Select type"
   and choose **Web app**.
5. Set **Execute as** to **Me**, and **Who has access** to **Anyone**. This is
   required: Vercel calls it as an anonymous visitor. The URL is unguessable
   and the script only ever appends rows.
6. Click **Deploy**. Google asks you to authorise the script the first time.
   Approve it. On the "Google hasn't verified this app" screen choose
   **Advanced**, then **Go to (your project name)**. It is your own script.
7. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy.../exec`.
8. Paste that URL into a browser. It should answer
   `{"ok":true,"service":"Passive Array sign-up receiver"}`. If it asks you to
   log in, "Who has access" is not set to Anyone.
9. In Vercel open the project, **Settings**, **Environment Variables**. Add
   `SUBSCRIBE_WEBHOOK_URL` with that URL. Apply it to Production.
10. Go to **Deployments** and **Redeploy** the latest one. Environment
    variables only reach a deployment when it is built.
11. Open `/api/subscribe?health=1`. It should now say `"configured": true`.
12. Sign up on the site with your own email. A row appears in the sheet within
    a second or two, with the header row created automatically.

Contact-form messages also email you, so you see them the same day. Delete the
`MailApp.sendEmail` block in the script if you would rather they only appear
in the sheet.

### Option B: n8n

Use this if your n8n is reachable from the internet. A self-hosted n8n on your
own PC is not: Vercel cannot call `localhost`. n8n Cloud, or a self-hosted
instance behind a public domain or a tunnel, works fine.

1. New workflow, add a **Webhook** node. Method POST, path `passive-array`.
2. Copy the **Production URL**, not the Test URL. The test URL only listens
   while you have the editor open.
3. Add a **Google Sheets** node (append row) or whatever storage you prefer,
   mapping the fields below.
4. Add a **Respond to Webhook** node returning any 200 response.
5. **Activate** the workflow. An inactive workflow rejects production calls.
6. Set `SUBSCRIBE_WEBHOOK_URL` in Vercel to the Production URL and redeploy.

### What gets sent

Any service that accepts a JSON POST works. The body is:

```
{ "kind": "signup", "email": "someone@example.com", "name": "", "platform": "YouTube",
  "message": "", "source": "/blog/", "receivedAt": "2026-09-22T10:00:00.000Z" }
```

`kind` is `signup` from the button, `newsletter` from the footer box, or
`contact` from the contact page. Emails arrive lowercased and trimmed. A
hidden honeypot field blocks the common bots before anything is forwarded.

### If a sign-up fails

The visitor sees "Could not save that right now." The reason is written to the
Vercel function logs: open the project, **Logs**, and filter for `subscribe`.
The usual causes are an inactive n8n workflow, an Apps Script deployment whose
access is not set to Anyone, or a URL that was saved without redeploying.

## Accounts and sign-in

Sign-in is passwordless. There are no passwords stored and no user database:
a link is signed with a secret, emailed, and exchanged for a session cookie.
The account page holds the person's email address and one preference, nothing
more, and every tool on the site works without an account.

### Turning it on

1. Set up the sign-up destination first (the section above). The same Apps
   Script delivers the sign-in emails, so no extra service is needed.
2. Generate a secret:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. In Vercel add the environment variable `AUTH_SECRET` with that value, and
   `SITE_URL` set to `https://passivearray.vercel.app` so the links point at
   the right place. Then **Redeploy**.
4. Check it: `https://passivearray.vercel.app/api/auth?action=health` should
   answer `"enabled": true, "canEmail": true`.
5. Go to `/login/`, enter your own email, and click the link that arrives.

Changing `AUTH_SECRET` later signs everybody out, which is also how you would
respond if you ever thought it had leaked.

### How it works

| Step | What happens |
|---|---|
| Ask for a link | `/api/auth?action=request` signs `{email, expiry}` with `AUTH_SECRET` and sends it to the webhook as `kind: "login"` |
| Email | The Apps Script sees that kind and emails the link. It is never written to the sheet |
| Click the link | `/login/` posts the token to `?action=verify`, which checks the signature and expiry |
| Session | A signed cookie `pa_session` is set: HttpOnly, Secure, SameSite=Lax, 30 days |
| Every page | The header reads a localStorage marker so it can show "Account" without a request. The server is still the only authority |

### Deliberate limits

- **Links are valid for 20 minutes, not single-use.** Marking a link as spent
  needs somewhere to record it, and there is no database here by design. The
  short window is the mitigation. Do not describe the link as one-time in any
  copy, because it is not.
- **No rate limiting on link requests.** Anyone can ask for a link to any
  address; only the inbox owner can use it. If this is ever abused, put the
  endpoint behind Vercel's firewall rules or add a counter in the sheet.
- **Free Gmail sends about 100 emails a day** through Apps Script. Fine for
  launch, not for scale. Move to a sending service if you outgrow it.
- **`/login/` and `/account/` carry a noindex tag** and are excluded from the
  sitemap and blocked in robots.txt.

### Google sign-in

1. Open the [Google Cloud console](https://console.cloud.google.com/apis/credentials)
   and pick the same project that holds your YouTube API key.
2. **Create credentials**, **OAuth client ID**. If it asks you to configure the
   consent screen first, do that: **External**, fill in the app name, your
   support email and the developer email, and save. You do not need to submit
   it for verification to sign in yourself, and sign-in with basic profile
   scopes does not require review.
3. Application type **Web application**. Under **Authorised JavaScript
   origins** add both of these, exactly, with no trailing slash:

```
https://passivearray.vercel.app
http://localhost:8099
```

4. Leave **Authorised redirect URIs** empty. The button uses the ID token
   flow, which does not redirect.
5. Copy the **Client ID**. It ends in `.apps.googleusercontent.com`.
6. In Vercel add the environment variable `GOOGLE_CLIENT_ID` with that value,
   then **Redeploy**.

The client secret is not used anywhere and does not need to go into Vercel.

### Password accounts

Passwords need somewhere to keep the hashes, so this is the one part that
needs a store. Vercel KV is the shortest path because it wires itself up.

1. In Vercel open the project, then **Storage**, then **Create** and pick a KV
   or Upstash Redis store. Connect it to this project.
2. Vercel sets `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you. If you use
   Upstash directly instead, set `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN`; either pair works.
3. **Redeploy**, then check `/api/auth?action=health`. `methods.password`
   should be `true`.

What is stored per person: the email address, the date they joined, whether
they want the weekly report, and a scrypt hash of the password. The password
itself is never stored, never logged and never leaves the auth function.

Passwords must be at least 10 characters, are checked against the handful of
most-guessed strings, and cannot contain the local part of the email address.
Sign-in attempts are rate limited per address and per connection.

### What each method needs

| Method | Needs | Works without a store |
|---|---|---|
| Email link | `AUTH_SECRET` + `SUBSCRIBE_WEBHOOK_URL` | Yes |
| Google | `AUTH_SECRET` + `GOOGLE_CLIENT_ID` | Yes |
| Password | `AUTH_SECRET` + KV or Upstash | No |

Any method that is not configured is hidden from the sign-in page rather than
shown and then failing. `/api/auth?action=health` reports the current state.

## Analytics

Google Analytics 4 runs on every page, with the measurement id
`G-ZPSB0F8VM4` set in `creator-tools/build-tools.js`. A measurement id is
public, so it lives in the code rather than an environment variable; set
`GA4_ID` to override it, or to an empty string to switch analytics off
entirely. Setting `GTM_ID` additionally loads a Tag Manager container.

### Consent, and why it is built this way

The site tells people there are no advertising trackers and that nothing is
stored without permission. Analytics is wired so that stays true:

- **Consent Mode v2 is declared before any Google script loads**, with
  `analytics_storage`, `ad_storage`, `ad_user_data` and
  `ad_personalization` all `denied`. Google sees that before the tag fires,
  so no analytics cookie is written and no advertising identifier is sent.
  Until someone accepts, GA4 sends cookieless pings only.
- **A banner asks once.** Accepting calls `gtag(consent,update,...)` and
  remembers the answer in `localStorage` under `pa-consent`. Declining, or
  ignoring it, leaves everything denied. A stored acceptance is re-applied
  before the tag fires, so a returning visitor is measured from the first page.
- **The choice is reversible** through the "Cookie choices" link in the footer.
- **Advertising storage is never granted**, even on accept, because the site
  does not run ads and should not be building advertising audiences.

If you later add a tag that sets cookies, make it wait for
`analytics_storage`, or the consent promise stops being true.

### Where the code lives

| Piece | File |
|---|---|
| Measurement id, consent defaults, GA4 and GTM snippets | `creator-tools/build-tools.js` (`GA4_ID`, `CONSENT_HEAD`, `ANALYTICS_HEAD`) |
| Injection into the five standalone web tools | `build.js` (`withSiteChrome`) |
| Placeholder on tool pages | `creator-tools/template.html` (`{{gtmbody}}`) |
| Banner and consent updates | `creator-tools/public/site.js` |
| Wording that changes with the setting | `pages/site-pages.js` (`ANALYTICS_ON`) |

The privacy policy rewrites itself from `ANALYTICS_ON`: with analytics off it
says there are no analytics trackers, and with it on it gains an Analytics
section describing the cookie, the consent default and how to withdraw.
