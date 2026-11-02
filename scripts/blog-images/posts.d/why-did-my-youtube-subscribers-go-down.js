module.exports = {
  cover: {
    kicker: "Growth",
    title: "Why your subscribers *went down*",
    sub: "The five causes of a drop, and how to check which one hit your channel.",
    size: 62,
    visual: { type: "shot", src: "why-did-my-youtube-subscribers-go-down--tracker.png", label: "YouTube Channel Growth Tracker", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "rounding-step-drop-example.webp", type: "picks",
      title: "Example: a drop that is mostly rounding",
      sub: "Monday to Tuesday, as the public sees it and as Studio sees it.",
      picks: [
        { name: "Public count", tagline: "what viewers and stats sites see", points: ["100K on Monday", "99.9K on Tuesday", "Looks like 100 subscribers lost"] },
        { name: "Exact count in Studio", tagline: "owner only", points: ["100,004 on Monday", "99,996 on Tuesday", "Really 8 subscribers lost"] },
      ],
      note: "Example numbers. Rounding steps: YouTube Help; the API rounds down to three significant figures.",
    },
    {
      file: "find-why-subscribers-dropped.webp", type: "flow",
      title: "Find which reason hit your channel",
      sub: "Four checks in YouTube Studio, in this order. About ten minutes.",
      steps: [
        { title: "Real size", text: "Compare See live count on the Realtime card with your public count.", you: "Tiny exact drop: a rounding step." },
        { title: "Alerts", text: "Check the notifications bell, Important notifications and Known issues cards.", you: "Spam alert: a cleanup." },
        { title: "Day and size", text: "In Advanced mode, look at subscribers gained and lost by day.", you: "One sharp day: cleanup or one video." },
        { title: "Views", text: "Did views and watch time hold while subscribers fell?", you: "Views fell too: a real loss." },
      ],
      note: "Based on YouTube Help, \"Check your recent subscribers\" and \"Check your YouTube subscriber count\".",
    },
  ],
};
