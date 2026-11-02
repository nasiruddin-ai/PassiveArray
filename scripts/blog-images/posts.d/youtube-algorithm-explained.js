module.exports = {
  cover: {
    kicker: "Algorithm",
    title: "The YouTube *algorithm*, explained",
    sub: "How Home, Up next, Search and Shorts choose videos, in YouTube's own words.",
    size: 62,
    visual: { type: "stats", items: [
      { big: "80B+", label: "signals YouTube says its recommendations learn from", note: "YouTube Help, \"How YouTube recommendations work\"" },
      { big: "39 of 93", label: "breakout videos came from channels under 100K subscribers", note: "Passive Array outliers feed, 29 October 2026" },
    ] },
  },
  figures: [
    {
      file: "youtube-recommendation-surfaces.webp", type: "picks",
      title: "How each *surface* picks videos",
      sub: "YouTube treats each place a view comes from differently.",
      picks: [
        { name: "Home", tagline: "personalized", points: ["Relies mainly on the viewer's watch history"] },
        { name: "Up next", tagline: "suggested videos", points: ["Based on the video being watched", "Same-subject videos can pick up its traffic"] },
        { name: "Search", tagline: "query match", points: ["Relevance, engagement and quality"] },
        { name: "Shorts feed", tagline: "in-feed behaviour", points: ["What viewers watch and skip in the feed"] },
      ],
      note: "Source: YouTube Help, \"How YouTube recommendations work\" and \"How YouTube search works\".",
    },
    {
      file: "how-youtube-measures-satisfaction.webp", type: "flow",
      title: "How YouTube measures *satisfaction*",
      sub: "Each signal was added because the one before it could mislead.",
      steps: [
        { title: "Clicks", text: "Came first, but a video can earn a click and still disappoint." },
        { title: "Watch time", text: "Added next, but not all watch time is valuable." },
        { title: "Surveys", text: "Viewers rate videos 1 to 5 stars. Only 4 or 5 counts as valued watchtime." },
        { title: "Predictions", text: "Models predict survey answers for every video, since not everyone is asked." },
      ],
      note: "Source: Cristos Goodrow, YouTube Official Blog, 15 September 2021.",
    },
  ],
};
