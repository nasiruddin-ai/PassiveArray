module.exports = {
  cover: {
    kicker: "Views",
    title: "How YouTube *counts* views",
    sub: "What counts as a view since August 2026, and which views YouTube throws away.",
    size: 66,
    visual: { type: "stats", items: [
      { big: "Aug 2026", label: "a view counts the moment a video starts to play", note: "Since 24 August 2026, in long-form, Shorts and live" },
      { big: "Engaged", label: "views and watch hours still decide Partner Program pay", note: "Eligibility uses qualified views" },
    ] },
  },
  figures: [
    {
      file: "count-first-review-later.webp", type: "flow",
      title: "Count first, *review* later",
      sub: "Why a view count can rise and then fall.",
      steps: [
        { title: "Playback starts", text: "The view is counted the moment the video starts to play." },
        { title: "Review", text: "YouTube checks for bots, refresh loops, bought views and forced playback." },
        { title: "Removal", text: "Views that fail are discarded, sometimes days later, and the count drops." },
      ],
      note: "Based on YouTube's description of views and this guide's list of views YouTube removes.",
    },
    {
      file: "youtube-view-counting-timeline.webp", type: "timeline",
      title: "How view counting *changed*",
      sub: "Public counts got easier to earn. What you are paid on did not change.",
      events: [
        { dot: "1", when: "March 2025", what: "Shorts count a view on every start or replay" },
        { dot: "2", when: "24 August 2026", what: "Every format counts a view when playback starts" },
        { dot: "$", when: "Still today", what: "Partner Program earnings use engaged views and engaged watch hours" },
      ],
      note: "Dates as stated by YouTube and described in this guide.",
    },
  ],
};
