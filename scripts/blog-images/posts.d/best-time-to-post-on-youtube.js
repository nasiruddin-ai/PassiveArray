module.exports = {
  cover: {
    kicker: "Growth",
    title: "The best *time* to post on YouTube",
    sub: "Where Studio shows when your viewers are online, and how to test a publish time.",
    size: 62,
    visual: { type: "stats", items: [
      { big: "1-2 hours", label: "before your viewers' busiest block is when to publish", note: "Our method, using Studio's audience heat map" },
      { big: "28 days", label: "of data behind \"When your viewers are on YouTube\"", note: "Studio, Analytics, Audience tab, in your local time" },
    ] },
  },
  figures: [
    {
      file: "how-to-pick-a-publish-time.webp", type: "flow",
      title: "How to pick your *publish time*",
      sub: "Start from YouTube Studio: Analytics, Audience, \"When your viewers are on YouTube\".",
      steps: [
        { title: "Find the peak", text: "Find the darkest block on the heat map." },
        { title: "Go earlier", text: "Publish one to two hours before it starts, so YouTube can process and test the video." },
        { title: "Schedule it", text: "Use scheduled publishing in Studio so it goes live without you." },
        { title: "Repeat it", text: "Pick a day and time you can keep. Then test another after 4 to 6 videos." },
      ],
    },
  ],
};
