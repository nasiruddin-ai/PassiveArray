module.exports = {
  cover: {
    kicker: "Channel stats",
    title: "Check any YouTube channel's *stats*",
    sub: "Which numbers are public, which are rounded or hidden, and how to read them.",
    size: 58,
    visual: { type: "shot", src: "how-to-check-any-youtube-channel-stats--subscriber-checker.png", label: "YouTube Subscriber Count Checker", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "public-vs-private-channel-data.webp", type: "picks",
      title: "Public data vs *Studio only*",
      sub: "What anyone can read about a channel, and what only its owner can see.",
      picks: [
        { name: "Public for any channel", tagline: "YouTube Data API", points: ["Subscribers, rounded to 3 significant figures", "Exact total views and video count", "Per-video views, likes and comments", "Creation date, length, publish date, tags"] },
        { name: "Only in YouTube Studio", tagline: "owner only", points: ["Watch time and average view duration", "Thumbnail click-through rate", "Traffic sources and demographics", "Actual RPM and revenue"] },
      ],
      note: "Source: YouTube Data API channel and video fields. Any outside earnings figure is an estimate.",
    },
    { file: "subscriber-count-checker-youtube-creators.webp", type: "shot", src: "how-to-check-any-youtube-channel-stats--subscriber-checker.png", maxHeight: 860 },
  ],
};
