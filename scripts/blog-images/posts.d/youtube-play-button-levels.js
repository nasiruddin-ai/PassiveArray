module.exports = {
  cover: {
    kicker: "Creator Awards",
    title: "Every YouTube *play button* level",
    sub: "The subscribers you need for each award, and how you claim one.",
    size: 62,
    visual: { type: "stats", items: [
      { big: "100K", label: "subscribers for the Silver award", note: "The first plaque; nothing at 1,000 or 10,000" },
      { big: "1M", label: "subscribers for the Gold award", note: "Offered after YouTube reviews the channel" },
    ] },
  },
  figures: [
    {
      file: "youtube-play-button-levels-ladder.webp", type: "timeline",
      title: "The play button ladder",
      sub: "Each award is given once per channel, after a review.",
      events: [
        { dot: "S", when: "100,000", what: "Silver Creator Award" },
        { dot: "G", when: "1,000,000", what: "Gold Creator Award" },
        { dot: "D", when: "10,000,000", what: "Diamond Creator Award" },
        { dot: "C", when: "50,000,000", what: "Custom Creator Award" },
        { dot: "R", when: "100,000,000", what: "Red Diamond Creator Award" },
      ],
      note: "Source: YouTube Creator Awards help page. Subscriber milestones.",
    },
    {
      file: "how-to-claim-a-youtube-play-button.webp", type: "flow",
      title: "How you get the plaque",
      sub: "Reaching the number is not the whole requirement.",
      steps: [
        { title: "Cross the milestone", text: "The channel reaches 100,000, 1 million or a higher level." },
        { title: "YouTube reviews it", text: "Good standing: no recent strikes, no signs of fake subscribers." },
        { title: "Redeem in Studio", text: "The award is offered in YouTube Studio; enter a delivery address." },
        { title: "Plaque arrives", text: "It can take weeks, and longer in some countries." },
      ],
      note: "Source: YouTube Creator Awards help page.",
    },
  ],
};
