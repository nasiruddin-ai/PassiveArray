module.exports = {
  cover: {
    kicker: "Engagement",
    title: "The best time to post on *Instagram*",
    sub: "Instagram's answer: when your audience is most active. Insights shows when.",
    size: 60,
    visual: { type: "stats", items: [
      { big: "100", label: "followers needed before Insights shows follower trends", note: "Instagram Help, \"About Instagram insights\"" },
      { big: "90 days", label: "the longest time frame you can choose in Insights", note: "Preset or custom, per Instagram Help" },
    ] },
  },
  figures: [
    {
      file: "instagram-ranking-and-timing.webp", type: "picks",
      title: "Where *timing* shows up in ranking",
      sub: "Instagram has no single algorithm. Each part ranks in its own way.",
      picks: [
        { name: "Feed", tagline: "people you follow", points: ["When the post was shared", "How quickly people react"] },
        { name: "Following", tagline: "chronological", points: ["Last 30 days of posts", "Ordered by time"] },
        { name: "Stories", tagline: "people you follow", points: ["Viewing and engagement history", "Closeness to the author"] },
        { name: "Reels", tagline: "mostly non-followers", points: ["Your activity and history", "Information about the reel"] },
      ],
      note: "Source: Instagram, \"Instagram ranking explained\", Adam Mosseri, 31 May 2023.",
    },
    {
      file: "find-instagram-most-active-times.webp", type: "flow",
      title: "Find your followers' *most active times*",
      sub: "Needs a public account and at least 100 followers.",
      steps: [
        { title: "Profile", text: "Tap your profile picture in the bottom right." },
        { title: "Dashboard", text: "Tap Professional dashboard, or Your dashboard on a personal account." },
        { title: "Insights", text: "Open Insights and tap into the overview metrics." },
        { title: "Total followers", text: "Find \"Times they're most active on Instagram\"." },
      ],
      note: "Source: Instagram Help Center, \"About Instagram dashboards\" and \"About Instagram insights\".",
    },
  ],
};
