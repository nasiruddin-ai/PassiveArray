// Long-form guide for /open-graph-preview/.
module.exports = {
  seoTitle: "Free Open Graph & Social Card Preview Tool | Passive Array",
  seoDescription: "Preview how your link looks on Facebook, LinkedIn, X (Twitter), and WhatsApp, fetch live og: tags from any URL, and generate clean social meta tags.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "Recommended Open Graph image & text sizes",
      p: [
        "Social platforms read Open Graph (og:) and Twitter Card meta tags to build link previews. If those tags are missing or the image is too small, feeds show a broken or text-only link, which cuts click-through rate.",
      ],
      table: {
        head: ["Tag", "Recommended spec", "Notes"],
        rows: [
          ["og:title", "40–60 characters", "Long titles get truncated on mobile feeds"],
          ["og:description", "110–150 characters", "Summarizes the click value in 1–2 sentences"],
          ["og:image", "1200 × 630 px (1.91:1)", "Use absolute https:// URL; keep under 5 MB"],
          ["twitter:card", "summary_large_image", "Shows a full-width banner card on X"],
        ],
      },
    },
  ],
  faq: [
    ["Why does Facebook or LinkedIn still show my old preview image?", "Social platforms cache Open Graph tags aggressively. After updating your tags, run your URL through Facebook Sharing Debugger or LinkedIn Post Inspector to force a fresh scrape."],
    ["Does WhatsApp use Open Graph tags?", "Yes. WhatsApp reads og:title, og:description, and og:image. Keep your og:image under 300 KB if possible so WhatsApp loads the thumbnail reliably on mobile connections."],
  ],
};
