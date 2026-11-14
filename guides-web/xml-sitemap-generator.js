// Long-form guide for /xml-sitemap-generator/.
module.exports = {
  seoTitle: "Free XML Sitemap Generator & Validator | Passive Array",
  seoDescription: "Generate a valid sitemap.xml file from your URL list with lastmod, changefreq and priority tags, catch duplicate or broken URLs, and download instantly.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What makes a valid XML sitemap",
      p: [
        "An XML sitemap lists the canonical URLs you want search engines to discover and crawl. Every URL must include the full protocol (https://), stay on the same hostname, and avoid duplicates or redirected URLs.",
        "Google ignores <priority> and <changefreq> for ranking, but reads <lastmod> when it reflects a real content update.",
      ],
      table: {
        head: ["Rule", "Requirement", "Why it matters"],
        rows: [
          ["Protocol & host", "Full https:// URL on one domain", "Cross-domain URLs are rejected unless verified"],
          ["Max URLs per file", "50,000 URLs", "Larger sites need a sitemap index file"],
          ["Max file size", "50 MB uncompressed", "Split oversized sitemaps before uploading"],
          ["Canonical only", "No 301 redirects or noindex pages", "Saves crawl budget and avoids GSC warnings"],
        ],
      },
    },
    {
      h: "How to submit your sitemap to Google",
      ordered: true,
      list: [
        "Download the generated sitemap.xml file and upload it to your site's root directory (https://yourdomain.com/sitemap.xml).",
        "Add Sitemap: https://yourdomain.com/sitemap.xml to your robots.txt file.",
        "Open Google Search Console → Sitemaps, paste sitemap.xml, and click Submit.",
      ],
    },
  ],
  faq: [
    ["Should I include noindex or redirected URLs in sitemap.xml?", "No. Only include canonical, indexable 200-OK URLs. Putting noindex or 301 URLs in your sitemap sends mixed signals to Googlebot."],
    ["Does XML sitemap priority affect Google rankings?", "No. Google has confirmed it ignores <priority> and <changefreq>, though other search engines may still read them."],
    ["Is there a URL limit for this generator?", "Because it runs in your browser, you can paste thousands of URLs with zero server limits. The official Sitemaps protocol caps a single file at 50,000 URLs."],
  ],
};
