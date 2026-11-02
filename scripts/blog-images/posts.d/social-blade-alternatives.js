module.exports = {
  cover: {
    kicker: "Comparison",
    title: "Free *Social Blade* alternatives",
    sub: "What each one does better, and where Social Blade still wins.",
    size: 64,
    visual: { type: "vs", sides: [
      { name: "Social Blade", tagline: "Years of history", points: ["Daily snapshots since 2010", "Five jobs on one site", "Fixed earnings range"] },
      { name: "Alternatives", tagline: "Better at one job each", points: ["Exact data in Studio", "No-account checks", "Tracking from today"] },
    ] },
  },
  figures: [
    {
      file: "which-social-blade-alternative.webp", type: "picks",
      title: "Which one fits the job?",
      sub: "Pick by what you used Social Blade for.",
      picks: [
        { name: "YouTube Studio", tagline: "your own channel", points: ["Exact subscribers and real earnings", "Only shows your own channel"] },
        { name: "Passive Array", tagline: "free, no account", points: ["Any channel's numbers right now", "Daily tracking from today, with a CSV"] },
        { name: "vidIQ or ViewStats", tagline: "competitors and outliers", points: ["Find breakout videos in a niche", "Watch what competitors post"] },
        { name: "Social Blade", tagline: "past years", points: ["See how a channel grew years ago", "History no one can rebuild later"] },
      ],
      note: "Based on each company's own website, checked 1 November 2026.",
    },
    { file: "growth-tracker-mrbeast.webp", type: "shot", src: "social-blade-alternatives--tracker.png", maxHeight: 1365 },
  ],
};
