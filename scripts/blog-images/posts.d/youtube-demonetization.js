module.exports = {
  cover: {
    kicker: "Earnings",
    title: "YouTube *demonetization*, explained",
    sub: "Limited ads on one video, or a whole channel out: causes and fixes for each.",
    size: 62,
    visual: { type: "stats", items: [
      { big: "21 days", label: "to appeal a Partner Program suspension", note: "7 days if you were warned of a scheduled suspension" },
      { big: "90 days", label: "after suspension before you can reapply", note: "If the appeal is rejected" },
    ] },
  },
  figures: [
    {
      file: "video-vs-channel-demonetization.webp", type: "picks",
      title: "The two kinds of demonetization",
      sub: "Different causes, different fixes.",
      picks: [
        { name: "One video", tagline: "yellow or red icon", points: ["Fails advertiser-friendly guidelines", "No effect on your channel's standing", "Appeal for a human review"] },
        { name: "Whole channel", tagline: "out of the program", points: ["Policy breaks, reused or inauthentic content", "Or no uploads or posts for six months", "Appeal, fix the cause, or reapply"] },
      ],
      note: "Source: YouTube Help, advertiser-friendly content guidelines and channel monetization policies.",
    },
    {
      file: "channel-demonetization-recovery-timeline.webp", type: "timeline",
      title: "Recovering a demonetized channel",
      sub: "The deadlines after a Partner Program suspension.",
      events: [
        { dot: "1", when: "Day 0", what: "Suspension. The email and Studio notice name the policy" },
        { dot: "2", when: "Within 21 days", what: "Appeal with a short unlisted video (7 days if warned in advance)" },
        { dot: "3", when: "Within 14 days", what: "YouTube says it responds to the appeal" },
        { dot: "4", when: "After 90 days", what: "If rejected, fix the cause and reapply" },
      ],
      note: "Source: YouTube Help, YouTube Partner Program suspensions and appeals.",
    },
  ],
};
