module.exports = {
  cover: {
    kicker: "Growth",
    title: "Can you *hide* your sub count?",
    sub: "What YouTube changed, what you can still make private, and what to do instead.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "July 2022", label: "YouTube removed the option to hide subscriber counts", note: "Team YouTube, Help Community post, 30 June 2022" },
      { big: "1,000+", label: "subscribers: the public count is already shortened", note: "YouTube Help, subscriber counts" },
    ] },
  },
  figures: [
    {
      file: "what-you-can-make-private-on-youtube.webp", type: "picks",
      title: "What you can still keep private",
      sub: "Based on YouTube's current Help pages.",
      picks: [
        { name: "Subscriber count", tagline: "no", points: ["Not since 29 July 2022, except by hiding the whole channel"] },
        { name: "Exact count", tagline: "already private", points: ["The public sees a shortened count; the exact one is only in Studio"] },
        { name: "Your subscriptions", tagline: "yes, by default", points: ["Settings > Privacy > Keep all my subscriptions private"] },
        { name: "Whole channel", tagline: "yes, reversibly", points: ["Hides name, videos, likes, subscriptions and subscribers"] },
      ],
      note: "Sources: YouTube Help pages on subscriber counts, privacy settings and hiding your channel.",
    },
    {
      file: "youtube-subscriber-count-changes-timeline.webp", type: "timeline",
      title: "How public subscriber counts changed",
      sub: "YouTube first shortened counts, then removed the option to hide them.",
      events: [
        { dot: "1", when: "10 Sep 2019", what: "API counts rounded down to three significant figures" },
        { dot: "2", when: "30 Jun 2022", what: "Team YouTube announces the change to reduce impersonation" },
        { dot: "3", when: "29 Jul 2022", what: "Channels can no longer hide their subscriber counts" },
        { dot: "4", when: "2026", what: "Every public channel shows a count, approximate above 1,000" },
      ],
      note: "Sources: YouTube Data API revision history; Team YouTube, YouTube Help Community, 30 June 2022.",
    },
  ],
};
