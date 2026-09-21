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
- The video downloader from the Squareko workspace is not included: it needs ffmpeg and yt-dlp binaries that Netlify cannot run.
