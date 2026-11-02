module.exports = {
  cover: {
    kicker: "Earnings",
    title: "Why is my *RPM* low?",
    sub: "Nine reasons, how to check each one, and the four you can change.",
    size: 68,
    visual: { type: "stats", items: [
      { big: "$0.50", label: "low end of the usual long-form RPM range", note: "Per 1,000 views; our money calculator's default range" },
      { big: "$4.00", label: "high end; finance and B2B channels run above it", note: "A figure in the lower half is a position, not a fault" },
    ] },
  },
  figures: [
    {
      file: "cpm-to-rpm.webp", type: "flow",
      title: "Why RPM is always lower than CPM",
      sub: "CPM is what advertisers pay. RPM is what reaches you, per 1,000 views.",
      steps: [
        { title: "CPM", text: "What advertisers paid per 1,000 ad impressions, counting only views that showed an ad." },
        { title: "YouTube's share", text: "YouTube keeps its share of the revenue before anything reaches you." },
        { title: "RPM", text: "Your revenue per 1,000 views, divided by every view, including ones with no ad." },
      ],
      note: "Source: YouTube's definitions of RPM and CPM.",
    },
    {
      file: "rpm-what-you-can-change.webp", type: "picks",
      title: "The four RPM levers you control",
      sub: "Country, season and no-ad views mostly are not yours to move. These are.",
      picks: [
        { name: "Topic selection", tagline: "within your niche", points: ["Lean toward subjects advertisers value"] },
        { name: "Video length", tagline: "8 minutes or more", points: ["Only where the content supports it; padding costs retention"] },
        { name: "Advertiser-friendliness", tagline: "avoid yellow icons", points: ["Especially in the first minute of the video"] },
        { name: "Original audio on Shorts", tagline: "keep the pool", points: ["Licensed tracks send part of the Shorts pool to rights holders"] },
      ],
      note: "Summarised from this article.",
    },
  ],
};
