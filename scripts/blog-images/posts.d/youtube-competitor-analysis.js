module.exports = {
  cover: {
    kicker: "Growth",
    title: "YouTube *competitor* analysis",
    sub: "A seven-step method using public data and your own YouTube Studio.",
    size: 62,
    visual: { type: "vs", sides: [
      { name: "Anyone can see", tagline: "public data", points: ["Subscribers, rounded", "Views, likes, comments", "Titles, tags, keywords"] },
      { name: "Owner only", tagline: "YouTube Studio", points: ["Watch time", "Click-through rate", "Revenue"] },
    ] },
  },
  figures: [
    {
      file: "youtube-competitor-analysis-steps.webp", type: "timeline",
      title: "The seven steps",
      sub: "From finding the right channels to a list of video ideas.",
      events: [
        { dot: "1", when: "Define", what: "Same audience, size and format" },
        { dot: "2", when: "Studio", what: "Channels your audience watches" },
        { dot: "3", when: "Numbers", what: "Average views, uploads per month" },
        { dot: "4", when: "Outliers", what: "Far above usual views" },
        { dot: "5", when: "Packaging", what: "Titles, thumbnails, tags" },
        { dot: "6", when: "Comments", what: "Questions nobody answered" },
        { dot: "7", when: "Plan", what: "Gaps into video ideas" },
      ],
      note: "Our method. Steps 2 and 4 use reports described in YouTube Help.",
    },
    {
      file: "studio-competitor-reports.webp", type: "picks",
      title: "What Studio shows about your viewers",
      sub: "Reports on what your audience watches outside your channel.",
      picks: [
        { name: "Channels that your audience watches", tagline: "Audience tab, 28 days", points: ["Channels your viewers consistently watched", "Ideas for collaborations"] },
        { name: "What your audience watches", tagline: "Audience tab, 7 days", points: ["Videos, Shorts, live streams, podcasts", "Ideas for topics and titles"] },
        { name: "Breakout videos", tagline: "Trends tab", points: ["Well-performing videos", "From creators similar to you"] },
        { name: "Research", tagline: "rolling out from July 2026", points: ["Watched by my viewers filter", "Outlier Score filter"] },
      ],
      note: "Source: YouTube Help, \"Understand your YouTube audience\", \"Explore trends on YouTube\" and \"Research content & find trends\".",
    },
  ],
};
