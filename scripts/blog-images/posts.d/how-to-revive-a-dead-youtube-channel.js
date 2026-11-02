module.exports = {
  cover: {
    kicker: "Growth",
    title: "Bring a dead channel *back*",
    sub: "Diagnose it in an hour, choose restart or pivot, and follow a 90-day plan.",
    size: 64,
    visual: { type: "shot", src: "how-to-revive-a-dead-youtube-channel--quality.png", label: "YouTube Channel Quality Checker", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:left top" },
  },
  figures: [
    {
      file: "restart-pivot-or-new-channel.webp", type: "picks",
      title: "Restart, pivot or start fresh?",
      sub: "Choose from what the diagnosis found.",
      picks: [
        { name: "Restart", tagline: "same channel", points: ["Same topic, still searched, you still enjoy it", "Old videos and regulars are an asset"] },
        { name: "Pivot", tagline: "same channel", points: ["Your topic cooled but a related one is alive", "Some of your audience will follow"] },
        { name: "New channel", tagline: "fresh start", points: ["No overlap with the old audience", "A mixed channel confuses viewers and recommendations"] },
        { name: "Fix first", tagline: "or a new channel", points: ["Strikes, reused content history or bought subscribers", "A clean channel is easier than repairing one"] },
      ],
      note: "Our decision guide, based on YouTube Help on channel performance.",
    },
    {
      file: "90-day-comeback-plan.webp", type: "timeline",
      title: "A 90-day comeback plan",
      sub: "Fix what you have, return with a series, then rebuild the returning audience.",
      events: [
        { dot: "1", when: "Days 1 to 14", what: "Update the channel page, refresh stalled titles and thumbnails, add end screens" },
        { dot: "2", when: "Days 15 to 45", what: "Return with a 4 to 6 video series, starting with a real search" },
        { dot: "3", when: "Days 46 to 90", what: "Posts, a premiere, Shorts that point to the series, replies to comments" },
        { dot: "4", when: "Every month", what: "Compare views per new video, returning viewers and subscribers gained" },
      ],
      note: "Our suggestion, built on what YouTube Help says about breaks, series and old videos.",
    },
  ],
};
