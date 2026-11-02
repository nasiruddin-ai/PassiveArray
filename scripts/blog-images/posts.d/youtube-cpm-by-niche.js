module.exports = {
  cover: {
    kicker: "Earnings",
    title: "Why *finance* pays more than gaming",
    sub: "Which niches advertisers pay most for, and how to find your own real CPM.",
    size: 64,
    visual: { type: "vs", sides: [
      { name: "High band", tagline: "high customer value", points: ["Personal finance", "B2B software", "Insurance and legal"] },
      { name: "Low band", tagline: "cheap products, few bidders", points: ["Gaming", "Music", "Entertainment"] },
    ] },
  },
  figures: [
    {
      file: "youtube-cpm-niche-bands.webp", type: "picks",
      title: "Niches by CPM band",
      sub: "An editorial read from public creator reports, not measured data. YouTube publishes no table.",
      picks: [
        { name: "High", tagline: "strong buying intent", points: ["Personal finance and investing, B2B software", "Insurance and legal explainers, real estate"] },
        { name: "Middle", tagline: "lower value per customer", points: ["Tech reviews, software tutorials, AI tools", "Careers, home improvement, parenting, nutrition"] },
        { name: "Low", tagline: "huge audiences, cheap products", points: ["Gaming, music, travel, cooking", "Fitness, entertainment, film commentary"] },
        { name: "Kids' content", tagline: "below all three", points: ["Made-for-kids videos cannot show personalized ads", "Contextual ads pay much less"] },
      ],
      note: "Bands match the Passive Array YouTube niche finder. Audience country often outweighs niche.",
    },
    {
      file: "find-your-real-cpm.webp", type: "flow",
      title: "How to find your real CPM by topic",
      sub: "Your own numbers beat any chart.",
      steps: [
        { title: "Open Revenue", text: "YouTube Studio, then Analytics, then Revenue, then Advanced mode." },
        { title: "CPM by video", text: "Look at playback-based CPM for each video." },
        { title: "Group by topic", text: "Compare topics. One may earn two or three times the rest.", you: "Make more of the topic that pays" },
      ],
      note: "Needs a monetized channel. Not monetized yet? Check which commercial angles people search for.",
    },
  ],
};
