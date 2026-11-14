// Long-form guide for /hreflang-tag-generator/.
module.exports = {
  seoTitle: "Free Hreflang & Canonical Tag Generator | Passive Array",
  seoDescription: "Build valid HTML hreflang alternate tags, self-referencing canonicals, and XML sitemap xhtml:link blocks for multilingual websites in seconds.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "Why hreflang tags matter for global SEO",
      p: [
        "Hreflang tags tell Google and other search engines which language or regional version of a page to show to each searcher. Without them, search engines may rank the wrong country version or treat translated/regional pages as duplicates.",
        "Always pair hreflang tags with a self-referencing canonical tag on each language version so every localized URL is indexed independently.",
      ],
      table: {
        head: ["Code format", "Meaning", "Example"],
        rows: [
          ["x-default", "Fallback page for unmatched languages", "https://example.com/"],
          ["en", "All English speakers globally", "https://example.com/en/"],
          ["en-GB", "English speakers in the United Kingdom", "https://example.com/uk/"],
          ["es-MX", "Spanish speakers in Mexico", "https://example.com/mx/"],
        ],
      },
    },
    {
      h: "3 rules to avoid hreflang errors in Search Console",
      ordered: true,
      list: [
        "Use absolute URLs (always include https://, never relative paths like /es/).",
        "Make return links bidirectional: if page A links to page B, page B must link back to page A and to itself.",
        "Use ISO 639-1 two-letter language codes and optional ISO 3166-1 Alpha-2 region codes (e.g. en-US, not en-UK).",
      ],
    },
  ],
  faq: [
    ["Should I put hreflang in HTML <head> or in my XML sitemap?", "Either works equally well for Google. HTML <head> tags are easiest for small sites, while XML sitemaps keep HTML lightweight on large multi-language sites."],
    ["What is x-default in hreflang?", "x-default specifies the fallback URL shown when a user's browser language does not match any of your listed hreflang rules."],
    ["Can I point all hreflang tags to one canonical URL?", "No. Each language/region URL should have a self-referencing canonical pointing to itself, not to the English version."],
  ],
};
