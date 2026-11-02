module.exports = {
  cover: {
    kicker: "Growth",
    title: "Views per *subscriber*",
    sub: "How to work it out, what is healthy at each size and when a low figure is fine.",
    size: 68,
    visual: { type: "stats", items: [
      { big: "30%+", label: "strong: subscribers genuinely turn up for uploads", note: "Band used by Passive Array's channel tools" },
      { big: "10-30%", label: "normal for most active channels", note: "Under 10%: many subscribers inactive, or views come from elsewhere" },
    ] },
  },
  figures: [
    {
      file: "views-per-subscriber-calculation.webp", type: "flow",
      title: "Example: working it *out*",
      sub: "Use the last ten uploads, leaving out anything that went unusually viral.",
      steps: [
        { title: "Average views", text: "Average views on recent uploads.", you: "Example: 8,000" },
        { title: "Divide", text: "Divide by the channel's subscribers.", you: "Example: 40,000" },
        { title: "x 100", text: "Multiply by 100 for a percentage.", you: "Example: 20%, normal" },
      ],
      note: "Example numbers from this guide.",
    },
    {
      file: "views-per-subscriber-with-engagement.webp", type: "picks",
      title: "Read it with *engagement rate*",
      sub: "Views per subscriber asks whether people show up. Engagement rate (ER) asks whether they reacted.",
      picks: [
        { name: "Both healthy", tagline: "real audience", points: ["People show up and react"] },
        { name: "Both weak", tagline: "warning sign", points: ["At a size where that is unusual, the fake-audience fingerprint"] },
        { name: "High views, low ER", tagline: "search-driven", points: ["Visitors arrive with a question and leave with an answer"] },
        { name: "Low views, high ER", tagline: "loyal core", points: ["A small loyal core in a large dormant list, a good base to grow from"] },
      ],
    },
    { file: "subscriber-count-checker-views-per-subscriber.webp", type: "shot", src: "views-per-subscriber--subscriber-checker.png", maxHeight: 576 },
  ],
};
