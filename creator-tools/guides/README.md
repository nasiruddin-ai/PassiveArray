# Tool page guides

One file per tool, named `<slug>.js`, exporting
`{ seoTitle, seoDescription, guideUpdated, guide: [...sections], faq: [[q, a], ...] }`.
`build-tools.js` merges each file into the matching tool from `tools.js` at build time.

Section shape: `{ h, p: [html], list: [html], ordered: true|false, table: { head, rows }, after: [html] }`.
Rules: write for people first; each related phrase appears where it answers a real
question; no keyword lists; no invented numbers or search volumes; links are relative
to the tool page (`../other-tool/`, `../../research/`). The FAQ is printed on the page
and also emitted as FAQPage structured data.
