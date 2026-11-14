// Long-form guide for /redirect-generator/.
module.exports = {
  seoTitle: "Free 301 Redirect Generator (Vercel, .htaccess, Nginx) | Passive Array",
  seoDescription: "Generate clean 301 and 302 redirect rules for vercel.json, Apache .htaccess, Netlify _redirects, and Nginx from a list of old and new URLs in seconds.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "When to use 301 vs 302 redirects",
      p: [
        "Whenever you change a URL slug, merge duplicate articles, or migrate a site, a 301 Permanent Redirect tells Google to transfer indexing signals and link equity to the new URL.",
        "Use a 302 Temporary Redirect only for short-term A/B tests, seasonal promos, or maintenance pages where the old URL will return.",
      ],
      table: {
        head: ["Platform", "Where the rules go", "Syntax note"],
        rows: [
          ["Vercel", "vercel.json (root)", "JSON redirects array with permanent: true"],
          ["Apache", ".htaccess (root)", "Redirect 301 /old/ /new/"],
          ["Netlify", "_redirects (publish dir)", "/old/ /new/ 301!"],
          ["Nginx", "server { } block", "rewrite ^/old/$ /new/ permanent;"],
        ],
      },
    },
    {
      h: "Best practices to preserve SEO traffic during redirects",
      ordered: true,
      list: [
        "Redirect directly to the final destination—avoid multi-hop chains (A → B → C).",
        "Update internal links and your XML sitemap so they point straight to the new URLs.",
        "Avoid redirecting every old URL to the homepage; always match each old page to its closest equivalent topic.",
      ],
    },
  ],
  faq: [
    ["Do 301 redirects pass PageRank in 2026?", "Yes. Google has confirmed that 301 and 302 redirects do not lose PageRank, though pointing old URLs to irrelevant pages (like the homepage) is treated as a soft 404."],
    ["How long should I keep 301 redirects active?", "Keep them active for at least 1 year—and ideally permanently—so bookmarks, backlinks, and crawlers never hit a 404."],
    ["Can I paste full https:// URLs as the old path?", "Yes, this generator automatically extracts the path from full source URLs for Vercel, .htaccess, Netlify, and Nginx rules."],
  ],
};
