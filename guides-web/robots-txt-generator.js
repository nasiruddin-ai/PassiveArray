// Long-form guide for /robots-txt-generator/.
module.exports = {
  seoTitle: "Free Robots.txt Generator & URL Tester | Passive Array",
  seoDescription: "Generate a valid robots.txt file for Googlebot and AI crawlers, add Sitemap URLs and Disallow rules, and test any URL path instantly in your browser.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What this robots.txt generator builds",
      p: [
        "Pick a preset for WordPress, Next.js, Shopify, or AI crawler blocking, customize your User-agent rules and Sitemap URLs, and copy or download your ready-to-upload robots.txt file.",
        "Before deploying, use the built-in URL Path Tester to verify whether a specific path (like /wp-admin/ or /wp-admin/admin-ajax.php) is allowed or blocked for Googlebot or any other crawler.",
      ],
      table: {
        head: ["Directive", "What it tells crawlers", "Common example"],
        rows: [
          ["User-agent", "Which crawler the rules apply to (* means all bots)", "User-agent: Googlebot"],
          ["Disallow", "URL paths crawlers should not request", "Disallow: /admin/"],
          ["Allow", "Exceptions inside a disallowed folder", "Allow: /wp-admin/admin-ajax.php"],
          ["Crawl-delay", "Seconds to wait between requests (ignored by Googlebot, used by Bing/others)", "Crawl-delay: 5"],
          ["Sitemap", "Full URL to your XML sitemap index or file", "Sitemap: https://example.com/sitemap.xml"],
        ],
      },
    },
    {
      h: "How to deploy robots.txt safely",
      ordered: true,
      list: [
        "Download the generated file as robots.txt (all lowercase).",
        "Upload it to the root directory of your domain so it loads at https://yourdomain.com/robots.txt.",
        "Verify it in Google Search Console under Settings → robots.txt.",
        "Never use robots.txt to hide sensitive pages from Google index—use a noindex meta tag or password protection instead, because blocked URLs can still appear in search results without a snippet if other sites link to them.",
      ],
    },
  ],
  faq: [
    ["Where should I put my robots.txt file?", "It must live at the root of your host, e.g. https://example.com/robots.txt. Placing it in a subfolder like /blog/robots.txt has no effect."],
    ["Does robots.txt stop Google from indexing a page?", "No. robots.txt blocks crawling, not indexing. If other pages link to a disallowed URL, Google can still index the URL. Use a noindex meta tag or X-Robots-Tag header to keep a page out of search results."],
    ["How do I block AI crawlers like GPTBot without hurting Google SEO?", "Keep User-agent: * allowing your public pages, and add separate blocks for User-agent: GPTBot, CCBot, or ClaudeBot with Disallow: /."],
    ["Is this robots.txt generator free?", "Yes, 100% free and runs locally in your browser without sending your URLs or rules to any server."],
  ],
};
