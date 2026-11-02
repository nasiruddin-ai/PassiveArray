module.exports = {
  cover: {
    kicker: "Growth",
    title: "Grow a channel people *return* to",
    sub: "Positioning, series, community and honest checkpoints for the first 1,000.",
    size: 62,
    visual: { type: "shot", src: "how-to-grow-a-youtube-channel--growth-tracker.png", label: "YouTube Channel Growth Tracker", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "new-casual-regular-viewers.webp", type: "flow",
      title: "New, casual and regular viewers",
      sub: "YouTube splits your monthly audience into three groups. Growth means moving people right.",
      steps: [
        { title: "New viewers", text: "Watched your content for the first time, or not for over a year.", you: "Shows whether your reach is growing." },
        { title: "Casual viewers", text: "Watched at least once a month for 1 to 5 months in the past year.", you: "People who like some of your videos." },
        { title: "Regular viewers", text: "Watched at least once a month for more than 6 months in the past year.", you: "Your core audience. Can be under 1%." },
      ],
      note: "Source: YouTube Help, \"Understand new, casual, & regular viewers\".",
    },
    {
      file: "youtube-channel-growth-checkpoints.webp", type: "timeline",
      title: "Checkpoints for a growing channel",
      sub: "At each point, ask one question. A no tells you what to work on next.",
      events: [
        { dot: "10", when: "10 videos", what: "Did one video get noticeably more views than the rest?" },
        { dot: "25", when: "25 videos", what: "Do your best videos have something in common?" },
        { dot: "50", when: "50 videos", what: "Are casual and regular viewers growing month on month?" },
        { dot: "12m", when: "12 months", what: "Are views per new video rising?" },
      ],
      note: "Our suggested checkpoints, not a YouTube rule.",
    },
  ],
};
