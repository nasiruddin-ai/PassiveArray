module.exports = {
  cover: {
    kicker: "Earnings",
    title: "What *1,000 views* pays",
    sub: "The formula, a realistic range and what decides where your channel lands.",
    size: 66,
    visual: { type: "shot", src: "how-much-does-youtube-pay-for-1000-views--money-calculator.png", label: "YouTube Money Calculator", tag: "Free, no account", style: "" },
  },
  figures: [
    {
      file: "youtube-1000-views-range.webp", type: "flow",
      title: "1,000 views, from formula to range",
      sub: "Earnings = (views / 1,000) x RPM, at our calculator's default RPM range.",
      steps: [
        { title: "Low end: $0.50", text: "Music, kids' content and entertainment, or audiences outside the top ad markets.", you: "1,000 views = $0.50 (estimate)" },
        { title: "High end: $4.00", text: "Education, how-to and lifestyle with a mostly English-speaking audience.", you: "1,000 views = $4 (estimate)" },
        { title: "Above the range", text: "Finance and B2B channels regularly run above $4. Raise the high RPM.", you: "Check your real RPM in Studio" },
      ],
      note: "Estimates using the YouTube money calculator's default RPM range of $0.50 to $4.00.",
    },
    {
      file: "what-decides-youtube-rpm.webp", type: "picks",
      title: "What decides where you land",
      sub: "Why the same 1,000 views pay so differently between channels.",
      picks: [
        { name: "Niche", tagline: "advertiser demand", points: ["Business software, insurance and investing beat music videos"] },
        { name: "Audience country", tagline: "where budgets are", points: ["Ad budgets are concentrated in a handful of markets"] },
        { name: "Length and Shorts", tagline: "ads per view", points: ["Over 8 minutes can carry mid-rolls", "Shorts pay a small fraction"] },
        { name: "Ad blockers and skips", tagline: "no paid impression", points: ["Already priced into RPM, which is why RPM is the honest number"] },
      ],
      note: "Summarised from this article.",
    },
  ],
};
