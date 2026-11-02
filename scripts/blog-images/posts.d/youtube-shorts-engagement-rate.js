module.exports = {
  cover: {
    kicker: "Engagement",
    title: "What is a *good* Shorts engagement rate?",
    sub: "The formula, the 2025 view-count change and the Studio metrics that matter more.",
    size: 58,
    visual: { type: "shot", src: "youtube-shorts-engagement-rate--yt-er.png", label: "YouTube Engagement Rate Calculator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:left top" },
  },
  figures: [
    {
      file: "youtube-shorts-view-count-changes.webp", type: "timeline",
      title: "How YouTube counts a *Shorts view*",
      sub: "Views sit at the bottom of the fraction, so each change moved the engagement rate.",
      events: [
        { dot: "1", when: "Before 31 March 2025", what: "The earlier metric, now kept in YouTube Analytics as Engaged views" },
        { dot: "2", when: "31 March 2025", what: "A Shorts view counts every start or replay, with no minimum watch time" },
        { dot: "3", when: "24 August 2026", what: "Views count the moment a video starts to play, across all formats" },
      ],
      note: "Source: YouTube Help, \"Get started creating YouTube Shorts\" and \"How engagement metrics are counted\".",
    },
    {
      file: "shorts-engagement-rate-denominators.webp", type: "picks",
      title: "Views or *engaged views*?",
      sub: "The same likes and comments give a different rate. Keep the two apart.",
      picks: [
        { name: "Views", tagline: "public", points: ["Anyone can see them", "Compare channels and grade on Passive Array's scale"] },
        { name: "Engaged views", tagline: "owner only", points: ["Visible in YouTube Studio", "Compare your own Shorts with each other", "Never grade it on the public scale"] },
      ],
      note: "Source: YouTube Help, \"Understand your YouTube content performance\" (engaged views).",
    },
  ],
};
