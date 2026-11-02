module.exports = {
  cover: {
    kicker: "Engagement",
    title: "Instagram engagement *by follower count*",
    sub: "Typical rates for nano to mega accounts, and how the grade is worked out.",
    size: 58,
    visual: { type: "stats", items: [
      { big: "4.0%", label: "typical for nano accounts, under 10K", note: "Passive Array benchmark used in our tools" },
      { big: "0.8%", label: "typical for mega accounts, over 1M", note: "Passive Array benchmark used in our tools" },
    ] },
  },
  figures: [
    {
      file: "instagram-engagement-by-tier.webp", type: "bars",
      title: "Typical Instagram engagement *by tier*",
      sub: "(likes + comments) / followers x 100. The typical rate falls as accounts grow.",
      bars: [
        { label: "Nano, under 10K", value: 4.0, display: "4.0%", hi: true },
        { label: "Micro, 10K to 100K", value: 2.0, display: "2.0%" },
        { label: "Mid, 100K to 500K", value: 1.4, display: "1.4%" },
        { label: "Macro, 500K to 1M", value: 1.1, display: "1.1%" },
        { label: "Mega, over 1M", value: 0.8, display: "0.8%" },
      ],
      note: "Passive Array's own benchmarks, used by our Instagram tools. Not an Instagram figure.",
    },
    { file: "instagram-engagement-rate-calculator-micro.webp", type: "shot", src: "instagram-engagement-rate-by-follower-count--er-calc.png" },
  ],
};
