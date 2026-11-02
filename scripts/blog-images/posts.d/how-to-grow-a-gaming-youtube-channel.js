module.exports = {
  cover: {
    kicker: "Gaming",
    title: "Grow a *gaming* YouTube channel",
    sub: "Which games, search vs browse videos, Shorts, live streams and the rules.",
    size: 64,
    visual: { type: "vs", sides: [
      { name: "New releases", tagline: "Spike at launch", points: ["Win on speed", "Clear, specific guides", "Weeks to months"] },
      { name: "Evergreen", tagline: "Steady for years", points: ["Win on depth", "Series and style", "Years of shelf life"] },
    ] },
  },
  figures: [
    {
      file: "gaming-search-vs-browse-videos.webp", type: "picks",
      title: "Search videos vs browse videos",
      sub: "Know which one each video is built for.",
      picks: [
        { name: "Search videos", tagline: "answer a typed question", points: ["Best loadout, how to beat a boss, beginner tips", "Exact phrase near the start of the title", "Answer early, add chapters", "Most reliable views for a small channel"] },
        { name: "Browse videos", tagline: "clicked from Home feeds", points: ["Challenges, tier lists, rankings, story videos", "Live or die on title and thumbnail", "No graphic game violence in the thumbnail", "Work once YouTube knows your viewers"] },
      ],
      note: "Based on YouTube Help on search and YouTube's advertiser-friendly guidelines for gaming.",
    },
    {
      file: "gaming-channel-60-day-plan.webp", type: "timeline",
      title: "A 60-day plan for a new gaming channel",
      sub: "Choose a lane, publish search videos, try live, then review.",
      events: [
        { dot: "1", when: "Days 1 to 5", what: "Choose one game family and what you add to it" },
        { dot: "2", when: "Days 6 to 10", what: "List 20 search questions and five browse ideas" },
        { dot: "3", when: "Days 11 to 40", what: "One long video a week with chapters, plus Shorts" },
        { dot: "4", when: "Days 41 to 50", what: "Stream on a fixed slot; cut a highlight from each" },
        { dot: "5", when: "Days 51 to 60", what: "Compare traffic sources, CTR and early retention" },
      ],
      note: "Our suggestion for a first two months, not a YouTube rule.",
    },
  ],
};
