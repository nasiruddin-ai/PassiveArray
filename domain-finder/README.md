# Domain Finder

A small tool that takes your name ideas and tells you which domains are free to
register right now, with direct links to buy them. No programming knowledge is
needed to run it.

## How to run it

1. Open this folder.
2. Double-click **Start.bat**.
3. A black window opens and your browser opens to `http://localhost:3200`.
4. Type a name idea (for example `squareko`), tick the endings you care about,
   and press **Find available domains**.

To stop the tool, close the black window.

It runs on port 3200, so it can run at the same time as the Domain Age Checker
(port 3000) and the Plagiarism Checker (port 3100).

## What you can do on the page

- **Several ideas at once**: put one name per line, or separate them with commas.
- **Exact domains**: anything with a dot (like `myshop.io`) is checked exactly as typed.
- **Endings**: `.com`, `.net`, `.org`, `.io`, `.co`, `.ai`, `.app`, `.dev` are ticked
  by default. Tick more, or type extra endings in the box (for example `pk` or `co.in`).
- **Variations**: tick the box to also try `getname`, `tryname`, `myname`, `usename`,
  `nameapp`, `namehq`, `namehub`, `namelabs`, `namely`.
- **Show only available** hides the taken ones.
- **Copy available list** copies the free names to your clipboard.
- **Buy it at** links open Namecheap, Porkbun, or GoDaddy with the name already
  filled in. Prices are shown there.

## What the statuses mean

| Status | Meaning |
|---|---|
| Available | The registry has no record for this name. It should be free to register. |
| Probably available | No name servers were found, but neither RDAP nor WHOIS could confirm it for this ending. Check at the registrar. |
| Taken | Someone already owns it. |
| Could not check | The registry was slow, rate-limited the tool, or was unreachable. Try that name again in a minute. |

A registrar may still refuse a name that shows as Available, for example if the
registry marks it as premium or reserved. The registrar link will tell you.

## What is in this folder

| File | What it does |
|---|---|
| `public/index.html` | The page you see in the browser. Change text, endings, or registrar links here. |
| `lib/check.js` | The checking logic (DNS, RDAP, WHOIS). Shared by the local server and the Netlify version. |
| `server.js` | The small local server. Serves the page and answers `/api/check`. |
| `Start.bat` | Starts the tool locally. Double-click it. |
| `README.md` | This file. |

## Where the data comes from

Each domain is checked in up to three steps:

1. **DNS.** If the domain has name servers, it is definitely registered and the
   tool stops there. This is instant.
2. **RDAP.** The public registry lookup system that replaced WHOIS. The tool asks
   the registry that owns the ending (found from IANA's official list) and falls
   back to `rdap.org`. A "not found" answer means nobody owns the name.
   Works for `.com`, `.net`, `.org`, `.ai`, `.app`, `.dev`, `.in`, `.co.uk` and most others.
3. **WHOIS.** Some endings have no RDAP (`.io`, `.co`, `.me`, `.us`, `.de`, `.pk`).
   For those the tool asks IANA which WHOIS server handles the ending, then asks
   that server directly.

All three are free and need no account or API key. The tool checks four domains
at a time and remembers answers for ten minutes, so registries do not block it.
Searches are capped at 300 domains at a time for the same reason.

If you check a lot of `.io` or `.co` names in a row, the WHOIS server may start
refusing for a few minutes. Those names show "Could not check". Wait and retry.

## Changing things

- **Default endings**: edit the `DEFAULT_TLDS` and `EXTRA_TLDS` lists near the top
  of the script in `public/index.html`.
- **Variations**: edit `PREFIXES` and `SUFFIXES` in the same place.
- **Registrar links**: edit the `REGISTRARS` list. Add your affiliate link there
  if you have one.
- **Port**: change `3200` in `server.js` and `Start.bat`.

## Putting it on Netlify

This tool is deployed together with the other Squareko tools from the parent
folder. See the README in the parent folder for the steps. On the site it lives
at `/domain-finder/`, and its backend is `netlify/functions/domain-finder-check.mjs`
in the parent folder, which reuses `lib/check.js` from here.

Things to know about the hosted version:

- A Netlify Function must answer within 10 seconds, so the hosted version
  waits at most 4 seconds per registry lookup (the local tool waits 12).
  A slow registry shows "Could not check" instead of hanging. Check it again.
- Each function instance keeps its own 10-minute cache, so repeated checks
  are not always instant like they are locally.

## Other hosts

Any host that runs Node.js will also work (Render, Railway, Fly.io, a VPS).
Upload the folder, run `node server.js`, and point your domain at it. Or move
`lib/check.js` into an n8n webhook and let `public/index.html` call that
instead of `/api/check`.
