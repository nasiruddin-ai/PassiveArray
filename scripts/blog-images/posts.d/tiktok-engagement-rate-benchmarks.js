module.exports = {
  cover: {
    kicker: "Engagement",
    title: "TikTok engagement *by size*",
    sub: "Why TikTok rates run higher than Instagram, and how to grade an account fairly.",
    size: 64,
    visual: { type: "shot", src: "tiktok-engagement-rate-benchmarks--er-calc.png", label: "TikTok Engagement Rate Calculator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:left top" },
  },
  figures: [
    {
      file: "tiktok-engagement-by-tier.webp", type: "bars",
      title: "Typical TikTok engagement *by tier*",
      sub: "(likes + comments + shares) / followers x 100, averaged over the last 10 to 12 videos.",
      bars: [
        { label: "Nano, under 10K", value: 12, display: "12%", hi: true },
        { label: "Micro, 10K to 100K", value: 8, display: "8%" },
        { label: "Mid, 100K to 500K", value: 6, display: "6%" },
        { label: "Macro, 500K to 1M", value: 5, display: "5%" },
        { label: "Mega, over 1M", value: 4, display: "4%" },
      ],
      note: "Passive Array's own benchmarks, used by our TikTok tools. Not a TikTok figure.",
    },
    {
      file: "tiktok-vs-instagram-engagement.webp", type: "bars",
      title: "TikTok *vs* Instagram, smallest and largest tiers",
      sub: "Typical engagement by followers. Never grade a TikTok rate on an Instagram benchmark.",
      bars: [
        { label: "TikTok nano, under 10K", value: 12, display: "12%", hi: true },
        { label: "Instagram nano, under 10K", value: 4.0, display: "4.0%" },
        { label: "TikTok mega, over 1M", value: 4, display: "4%", hi: true },
        { label: "Instagram mega, over 1M", value: 0.8, display: "0.8%" },
      ],
      note: "Passive Array's own benchmarks for TikTok and Instagram tiers, used by our tools.",
    },
  ],
};
