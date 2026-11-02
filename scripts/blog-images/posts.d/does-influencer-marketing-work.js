module.exports = {
  cover: {
    kicker: "For brands",
    title: "Does influencer marketing *work*?",
    sub: "What 2025 and 2026 reports say, and how to measure your own deal.",
    size: 62,
    visual: { type: "stats", items: [
      { big: "62%", label: "of enterprise marketers increasing influencer budgets in 2026", note: "Linqia, 2026 State of Influencer Marketing" },
      { big: "79%", label: "struggle to measure ROI", note: "Same Linqia 2026 survey, over 200 enterprise marketers" },
    ] },
  },
  figures: [
    {
      file: "example-youtube-integration-measured.webp", type: "flow",
      title: "Example: measuring a $1,200 integration",
      sub: "One YouTube integration, 30 days after posting. Each result answers a different goal.",
      steps: [
        { title: "48,000 views", text: "$1,200 / 48,000 x 1,000", you: "Effective CPM: $25" },
        { title: "600 clicks", text: "$1,200 / 600", you: "Cost per click: $2.00" },
        { title: "30 sales", text: "$1,200 / 30, at a $60 average order", you: "Cost per sale: $40" },
        { title: "$1,080 profit", text: "60% gross margin on $1,800 revenue, against $1,200 cost", you: "ROI on first orders: -10%" },
      ],
      note: "Example numbers from this guide, not a benchmark. If 30% of buyers order once more, ROI becomes about +17%.",
    },
    { file: "emv-calculator-reel-example.webp", type: "shot", src: "does-influencer-marketing-work--emv.png" },
  ],
};
