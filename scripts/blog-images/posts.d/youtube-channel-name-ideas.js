module.exports = {
  cover: {
    kicker: "Growth",
    title: "Pick a channel name that *lasts*",
    sub: "Eight naming patterns, YouTube's handle rules and the trademark traps.",
    size: 62,
    visual: { type: "shot", src: "youtube-channel-name-ideas--names.png", label: "YouTube Channel Name Generator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "channel-name-vs-handle.webp", type: "picks",
      title: "Channel name *vs* handle",
      sub: "Every channel has both. They follow different rules.",
      picks: [
        { name: "Channel name", tagline: "e.g. Priya Cooks Fast", points: ["Shows at the top of your channel and under your videos", "Does not have to be unique", "Spaces allowed", "Change it twice within 14 days"] },
        { name: "Handle", tagline: "e.g. @priyacooksfast", points: ["Shows in your URL, mentions, comments and Shorts", "Must be unique: one channel per handle", "No spaces", "Change it twice within 14 days"] },
      ],
      note: "Source: YouTube Help, \"YouTube handles overview\" and \"Manage your YouTube channel's profile\".",
    },
    {
      file: "changing-your-youtube-handle.webp", type: "timeline",
      title: "What happens when you change your handle",
      sub: "You can change it twice within 14 days. The old one does not stay yours for long.",
      events: [
        { dot: "1", when: "You change it", what: "You pick a new handle in Studio and publish" },
        { dot: "2", when: "Next 14 days", what: "YouTube holds the old handle; both links work" },
        { dot: "3", when: "After 14 days", what: "The old handle becomes available to anyone" },
        { dot: "!", when: "Later", what: "Old links on merch or in descriptions can break or point elsewhere" },
      ],
      note: "Source: YouTube Help, \"Change, view, or hide your handle\".",
    },
  ],
};
