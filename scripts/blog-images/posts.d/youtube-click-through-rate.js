module.exports = {
  cover: {
    kicker: "Engagement",
    title: "What is a *good* CTR on YouTube?",
    sub: "YouTube gives one range and no targets. Compare with your own videos.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "2%-10%", label: "impressions CTR for half of all channels and videos", note: "YouTube Help, impressions and click-through-rate FAQs" },
      { big: "1 sec", label: "and 50% visible before an impression counts", note: "YouTube Help, thumbnail impressions" },
    ] },
  },
  figures: [
    {
      file: "where-impressions-count.webp", type: "picks",
      title: "Where a thumbnail *impression* counts",
      sub: "Shown for more than 1 second, with at least 50% of the thumbnail visible.",
      picks: [
        { name: "Counted", tagline: "inside YouTube", points: ["YouTube Search", "Homepage and feeds", "Up Next recommendations", "Playlists"] },
        { name: "Not counted", tagline: "outside the metric", points: ["External websites and embeds", "Cards and end screens", "Email or notifications", "The YouTube mobile website"] },
      ],
      note: "Source: YouTube Help, \"Check your YouTube thumbnail impressions and watch time\".",
    },
    {
      file: "youtube-ab-test-steps.webp", type: "flow",
      title: "How a YouTube Studio A/B test runs",
      sub: "The winner is chosen on watch time share, not click-through rate.",
      steps: [
        { title: "Upload", text: "Up to 3 titles, thumbnails or both, on a computer in YouTube Studio." },
        { title: "Show", text: "All variations are shown to viewers at the same time." },
        { title: "Compare", text: "Watch time share is measured. A test can take up to 2 weeks." },
        { title: "Result", text: "Winner, Performed Same or Inconclusive." },
      ],
      note: "Source: YouTube Help, \"A/B test titles & thumbnails\".",
    },
  ],
};
