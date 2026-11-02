module.exports = {
  cover: {
    kicker: "Growth",
    title: "Why live sub counts *lag*",
    sub: "Where to see your exact count, and why every other count is rounded.",
    size: 66,
    visual: { type: "shot", src: "youtube-live-subscriber-count--checker.png", label: "YouTube Subscriber Count Checker", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "see-your-live-subscriber-count.webp", type: "flow",
      title: "See your exact live count in Studio",
      sub: "Only for channels you own or manage. Everyone else sees the rounded public count.",
      steps: [
        { title: "YouTube Studio", text: "Sign in at studio.youtube.com with the account that manages the channel." },
        { title: "Analytics", text: "Click Analytics in the left menu and stay on the Overview tab." },
        { title: "Realtime card", text: "Find the Realtime card on the right of the Overview tab." },
        { title: "See live count", text: "Click it for the exact, near-real-time subscriber count." },
      ],
      note: "Source: YouTube Help, \"Check your YouTube subscriber count\".",
    },
    {
      file: "how-live-counters-estimate.webp", type: "flow",
      title: "How a live counter fills the gaps",
      sub: "Counters for other people's channels start from the same rounded API number as everyone else.",
      steps: [
        { title: "Read", text: "Read the rounded public count now and again later." },
        { title: "Average", text: "Work out an average growth rate per hour from recent changes." },
        { title: "Animate", text: "Spread that rate between real updates and tick the last digits." },
        { title: "Correct", text: "When YouTube's rounded figure changes, snap to it, sometimes with a jump." },
      ],
      note: "How most live counters work, as described in this guide. The API rounds to three significant figures.",
    },
    {
      file: "one-channel-four-numbers.webp", type: "picks",
      title: "Example: one channel, four numbers",
      sub: "A channel with 1,234,567 real subscribers, gaining about 500 a day.",
      picks: [
        { name: "YouTube Studio", tagline: "owner only", points: ["1,234,567, near real time"] },
        { name: "Channel page", tagline: "public", points: ["1.23M"] },
        { name: "YouTube Data API", tagline: "every outside tool", points: ["1,230,000"] },
        { name: "A live counter site", tagline: "estimate", points: ["Something like 1,234,210, ticking up"] },
      ],
      note: "Example numbers. Rounding rules: YouTube Help and the YouTube Data API reference.",
    },
  ],
};
