module.exports = {
  cover: {
    kicker: "Analytics",
    title: "YouTube Analytics, *explained*",
    sub: "What every Studio tab shows, the metrics that matter and 5 numbers to check weekly.",
    size: 66,
    visual: { type: "stats", items: [
      { big: "2-10%", label: "impressions CTR for half of all channels and videos", note: "Per YouTube Help, \"Impressions and click-through rate\"" },
      { big: "28 days", label: "the default date range in Studio Analytics", note: "Change it at the top right of any report" },
    ] },
  },
  figures: [
    {
      file: "retention-graph-shapes.webp", type: "picks",
      title: "Four *retention graph* shapes",
      sub: "What each shape in the Engagement tab usually means.",
      picks: [
        { name: "Steep early drop", tagline: "first 30 seconds", points: ["The opening did not match what the title and thumbnail promised"] },
        { name: "Slow, steady decline", tagline: "normal", points: ["Every video loses viewers over time"] },
        { name: "Sudden dip mid-video", tagline: "lost people", points: ["A slow section, an ad read or an off-topic tangent"] },
        { name: "A spike", tagline: "rewatched or skipped to", points: ["Often the part viewers actually came for"] },
      ],
      note: "Based on the retention graph in YouTube Studio's Engagement tab.",
    },
    {
      file: "shown-clicked-watched.webp", type: "flow",
      title: "Read the metrics in *order*",
      sub: "Follow the path a viewer takes: the first weak step is where to fix.",
      steps: [
        { title: "Shown", text: "Impressions: how often YouTube showed your thumbnail.", you: "Low? Clearer topic, titles matched to real searches." },
        { title: "Clicked", text: "Impressions CTR: the share of impressions that became views.", you: "Low? Sharper promise, simpler thumbnail, Test & compare." },
        { title: "Watched", text: "Average view duration and the retention graph.", you: "Early drop? Deliver the promise in the first 30 seconds." },
      ],
      note: "Metric definitions: YouTube Help. Fixes: this guide's diagnosis table.",
    },
  ],
};
