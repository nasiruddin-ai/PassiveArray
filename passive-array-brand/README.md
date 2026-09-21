# Passive Array brand kit

Logo, colours, fonts and ready-made social images for **Passive Array**, the
brand the tools site will live under.

Open `brand-guide.html` in a browser for the full guide with every asset shown.

## What is here

| Folder or file | What it holds |
|---|---|
| `logo/` | The logo as SVG: horizontal, stacked, on-dark versions, the mark alone, single-colour marks, app icon. Text is converted to outlines, so no font is needed to open them. |
| `favicon/` | `favicon.ico`, `favicon.svg`, PNG icons from 16 to 512 px, `apple-touch-icon.png`, `site.webmanifest`, and `head-snippet.html` with the tags to paste into a page head. |
| `social/` | `profile-1080.png` (profile picture), `og-image-1200x630.png` (link preview), X and LinkedIn covers, large logo PNGs for slides and documents. |
| `fonts/` | Poppins SemiBold and Medium with their Open Font License. Body font is Inter from Google Fonts. |
| `brand-guide.html` | Colours with hex codes, type scale, logo rules, voice. |
| `make-brand.js` | Generates everything above. Run `node make-brand.js` after changing colours, the tagline or the mark. Needs the `opentype.js` package: run `npm install opentype.js` in this folder once if `node_modules` is missing. |

## The idea in one line

A 3 by 3 array of calm teal-to-indigo tiles with one mint circle: the single
active node in a passive array. Quiet, precise, trustworthy.

## Colours

| Name | Hex | Use |
|---|---|---|
| Deep Ink | `#1F2A44` | Text, dark backgrounds |
| Array Teal | `#2A9D8F` | Brand colour, "Array" in the wordmark, large headings |
| Deep Teal | `#1F7F73` | Buttons and links with white text |
| Soft Indigo | `#5B6ABF` | Gradient end, secondary accents |
| Mint Glow | `#8FD3C7` | Highlight, the active node, accents on dark |
| Cloud | `#F4F7F9` | Page backgrounds |

## Using the favicon on the tools site

1. Copy every file in `favicon/` and `social/og-image-1200x630.png` to the
   folder that is published as the site root.
2. Paste the contents of `favicon/head-snippet.html` inside `<head>` of each page.

## Using the logo on social profiles

- Profile picture everywhere: `social/profile-1080.png`
- X header: `social/cover-x-1500x500.png`
- LinkedIn page cover: `social/cover-linkedin-1584x396.png`
- Link previews: upload `social/og-image-1200x630.png` or reference it from the site head.
