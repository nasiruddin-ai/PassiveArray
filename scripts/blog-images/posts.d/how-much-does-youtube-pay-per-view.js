module.exports = {
  cover: {
    kicker: "Earnings",
    title: "What YouTube pays *per view*",
    sub: "RPM, CPM, the formula and a realistic range you can check on any channel.",
    size: 64,
    visual: { type: "stats", items: [
      { big: "$200", label: "a month at 400,000 views and $0.50 RPM", note: "Example from this article, low end of our default range" },
      { big: "$1,600", label: "the same views at $4.00 RPM", note: "Example, high end. Some niches run past $10 RPM" },
    ] },
  },
  figures: [
    {
      file: "cpm-vs-rpm.webp", type: "flow",
      title: "From CPM to RPM",
      sub: "A channel can have a $10 CPM and a $3 RPM at the same time.",
      steps: [
        { title: "CPM", text: "What an advertiser pays YouTube for 1,000 ad impressions." },
        { title: "YouTube keeps 45%", text: "On long-form videos, YouTube keeps 45% of ad revenue." },
        { title: "Views with no ad", text: "Not every view shows an ad, but every view counts." },
        { title: "RPM", text: "What the creator receives per 1,000 video views. The number that matters." },
      ],
      note: "Example: the $10 CPM and $3 RPM pair is illustrative. 45% is YouTube's share on long-form ads.",
    },
    { file: "money-calculator-estimate.webp", type: "shot", src: "how-much-does-youtube-pay-per-view--money-calculator.png" },
  ],
};
