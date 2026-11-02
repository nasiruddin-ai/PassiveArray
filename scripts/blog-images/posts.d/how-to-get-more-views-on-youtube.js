module.exports = {
  cover: {
    kicker: "Growth",
    title: "Get more *views* on YouTube",
    sub: "Find which of three problems is costing you views, then 12 fixes for each.",
    size: 66,
    visual: { type: "shot", src: "how-to-get-more-views-on-youtube--title-analyzer.png", label: "YouTube Title Analyzer", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:top" },
  },
  figures: [
    {
      file: "not-shown-not-clicked-not-watched.webp", type: "flow",
      title: "Find the *problem* first",
      sub: "Check your last 5 to 10 long-form videos in YouTube Studio, under Analytics, then Content.",
      steps: [
        { title: "Not shown", text: "Few impressions on every video.", you: "Problem 3: fixes 8 to 12, starting with search." },
        { title: "Not clicked", text: "Plenty of impressions, CTR well below your other videos.", you: "Problem 1: fixes 1 to 4, title and thumbnail." },
        { title: "Not watched", text: "Decent CTR, most viewers gone in the first 30 seconds.", you: "Problem 2: fixes 5 to 7, the opening." },
      ],
      note: "Metrics as defined in YouTube Help. The grouping of fixes is this guide's.",
    },
    { file: "title-analyzer-results.webp", type: "shot", src: "how-to-get-more-views-on-youtube--title-analyzer.png", maxHeight: 672 },
    {
      file: "30-day-views-plan.webp", type: "timeline",
      title: "A *30-day* plan for more views",
      sub: "Our suggested routine, not a YouTube rule.",
      events: [
        { dot: "1", when: "Days 1-3", what: "Diagnose your last ten videos" },
        { dot: "2", when: "Days 4-7", what: "New titles and thumbnails for your best three old videos" },
        { dot: "3", when: "Days 8-14", what: "Plan four videos from real searches" },
        { dot: "4", when: "Days 15-28", what: "Publish and link them to older videos" },
        { dot: "5", when: "Days 29-30", what: "Compare first-week results with your usual" },
      ],
    },
  ],
};
