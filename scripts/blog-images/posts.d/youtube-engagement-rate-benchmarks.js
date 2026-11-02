module.exports = {
  cover: {
    kicker: "Engagement",
    title: "What is a *good* YouTube engagement rate?",
    sub: "The by-views scale our tools use, and what moves a channel up it.",
    size: 58,
    visual: { type: "stats", items: [
      { big: "4% to 6%", label: "of views is graded Good", note: "Passive Array's scale: (likes + comments) / views" },
      { big: "Above 6%", label: "is graded Excellent", note: "Passive Array's scale, not a YouTube figure" },
    ] },
  },
  figures: [
    {
      file: "youtube-engagement-scale.webp", type: "bars",
      title: "Passive Array's *YouTube engagement scale*",
      sub: "Engagement by views: (likes + comments) / views x 100. Bar lengths are illustrative.",
      bars: [
        { label: "Low", value: 1, display: "Under 1%" },
        { label: "Below average", value: 2, display: "1% to 2%" },
        { label: "Average", value: 4, display: "2% to 4%" },
        { label: "Good", value: 6, display: "4% to 6%", hi: true },
        { label: "Excellent", value: 8, display: "Above 6%", hi: true },
      ],
      note: "Passive Array's own grading scale, used on every YouTube tool on this site. Not a YouTube benchmark.",
    },
    { file: "youtube-engagement-rate-calculator.webp", type: "shot", src: "youtube-engagement-rate-benchmarks--yt-er.png" },
  ],
};
