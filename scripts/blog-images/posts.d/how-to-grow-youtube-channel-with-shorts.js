module.exports = {
  cover: {
    kicker: "Shorts",
    title: "Grow your channel with *Shorts*",
    sub: "How Shorts views count, what to fix, and how to turn swipes into subscribers.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "3 min", label: "the longest a Short can be", note: "Square or vertical, per YouTube Help on Shorts" },
      { big: "<1%", label: "regular viewers on some Shorts-heavy channels", note: "YouTube Help, new, casual and regular viewers" },
    ] },
  },
  figures: [
    {
      file: "shorts-viewer-to-subscriber-path.webp", type: "flow",
      title: "From a swipe to a subscriber who stays",
      sub: "Shorts bring reach. These steps give a Shorts viewer somewhere to go next.",
      steps: [
        { title: "One topic", text: "Every Short makes sense for the same viewer.", you: "Two unrelated subjects? Use two channels." },
        { title: "Related video", text: "Link each Short to a long video, Short or live stream from your channel.", you: "Studio > Content > the Short > Related video." },
        { title: "Series", text: "A numbered series gives viewers a reason to check for more.", you: "Put each series in a playlist." },
        { title: "Channel page", text: "Viewers who tap your name see your best work first.", you: "Set a trailer and a Start here playlist." },
      ],
      note: "Source: YouTube Help, \"Add a related video to your YouTube Shorts\" and \"Understand new, casual, & regular viewers\".",
    },
    { file: "youtube-hashtag-generator-budget-recipes.webp", type: "shot", src: "how-to-grow-youtube-channel-with-shorts--hashtags.png", maxHeight: 660 },
    {
      file: "30-day-shorts-plan.webp", type: "timeline",
      title: "A 30-day Shorts plan",
      sub: "Audit, find the pattern, make more of it, then bridge to long-form.",
      events: [
        { dot: "1", when: "Days 1 to 3", what: "Audit your last 20 Shorts: views, stayed to watch, subscribers" },
        { dot: "2", when: "Days 4 to 7", what: "Write down what your top five share" },
        { dot: "3", when: "Days 8 to 21", what: "Make 10 to 15 Shorts that follow the rule, each with a related video" },
        { dot: "4", when: "Days 22 to 28", what: "Make one long video that expands your best Short" },
        { dot: "5", when: "Days 29 to 30", what: "Compare stayed to watch and subscribers per Short" },
      ],
      note: "Our suggested routine, not a YouTube rule.",
    },
  ],
};
