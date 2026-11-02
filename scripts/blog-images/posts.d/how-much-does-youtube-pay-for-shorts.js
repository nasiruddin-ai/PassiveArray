module.exports = {
  cover: {
    kicker: "Shorts",
    title: "What YouTube pays for *Shorts*",
    sub: "Why Shorts earn a fraction of long-form per view, and what to do about it.",
    size: 62,
    visual: { type: "vs", sides: [
      { name: "Long-form", tagline: "55% to the creator", points: ["Ads run on your video", "Revenue attributed to it", "Mid-rolls on longer videos"] },
      { name: "Shorts", tagline: "45% to the creator", points: ["Ads run between Shorts", "Revenue pooled and shared", "Music costs come out first"] },
    ] },
  },
  figures: [
    {
      file: "why-shorts-pay-less-per-view.webp", type: "flow",
      title: "Why a Shorts view pays so much less",
      sub: "Three things compound, usually by an order of magnitude or more.",
      steps: [
        { title: "Lower ad load", text: "Scrolling Shorts shows far fewer ads per video than a ten-minute video with mid-rolls." },
        { title: "Music first", text: "Licensed tracks send part of the pool to rights holders before creators are paid." },
        { title: "Huge denominator", text: "Your 45% is of your share of an enormous total of Shorts views." },
      ],
      note: "Based on YouTube's published Shorts revenue sharing: creators receive 45% of revenue allocated to their Shorts.",
    },
    {
      file: "shorts-as-top-of-funnel.webp", type: "flow",
      title: "Shorts are the funnel, long-form the business",
      sub: "A viral Short is an audience acquisition event, not a payday.",
      steps: [
        { title: "Get discovered", text: "Use Shorts to reach people who have never heard of you." },
        { title: "Point somewhere", text: "Give every Short a clear reason to watch something longer." },
        { title: "Earn on long-form", text: "Keep the long-form catalogue worth arriving at, and price sponsorships separately." },
      ],
      note: "Strategy from this article.",
    },
  ],
};
