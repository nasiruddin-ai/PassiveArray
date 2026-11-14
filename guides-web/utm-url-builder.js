// Long-form guide for /utm-url-builder/.
module.exports = {
  seoTitle: "Free SEO URL Slug Cleaner & UTM Link Builder | Passive Array",
  seoDescription: "Turn any headline into a clean, Google-friendly URL slug and build properly encoded UTM campaign links for YouTube, social posts, and newsletters.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How clean URL slugs and UTM parameters work together",
      p: [
        "Short, descriptive URL slugs (like /youtube-seo-tips/ instead of /2026/11/14/10-best-ways-to-grow-your-channel/) are easier for users to read and remember.",
        "When you share that clean URL on YouTube descriptions, newsletters, or paid ads, adding UTM parameters lets Google Analytics 4 attribute every click and conversion accurately—without changing your canonical URL.",
      ],
    },
  ],
  faq: [
    ["Do UTM parameters hurt SEO or cause duplicate content?", "No, as long as your page has a self-referencing <link rel=\"canonical\"> tag pointing to the clean URL without UTM parameters."],
    ["Should I use UTM links on internal links inside my own website?", "Never. Using UTM tags on internal links overwrites the visitor's original traffic source in Google Analytics."],
  ],
};
