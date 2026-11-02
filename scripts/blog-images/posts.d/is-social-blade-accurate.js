module.exports = {
  cover: {
    kicker: "Earnings",
    title: "Is *Social Blade* accurate?",
    sub: "Its stats come from YouTube. Its earnings are a wide estimate. Here is why.",
    size: 66,
    visual: { type: "stats", items: [
      { big: "$0.25-$4", label: "per 1,000 views: Social Blade's default range", note: "Social Blade help pages, as indexed 1 November 2026" },
      { big: "3", label: "significant figures: how public subscriber counts are rounded", note: "YouTube Data API, channels resource" },
    ] },
  },
  figures: [
    {
      file: "how-social-blade-estimates-earnings.webp", type: "flow",
      title: "How Social Blade estimates earnings",
      sub: "The method as Social Blade documents it. It sees views, nothing else.",
      steps: [
        { title: "Daily views", text: "The increase in the channel's total views from one day to the next.", you: "Includes Shorts, Live and long-form together." },
        { title: "Divide by 1,000", text: "Turns daily views into thousands of views.", you: "Assumes every view is monetized." },
        { title: "x $0.25 and x $4.00", text: "A fixed low and high value per 1,000 views, the same for every channel.", you: "Cannot see niche, country or Partner status." },
        { title: "Show a range", text: "The result is shown as a daily, monthly and yearly range.", you: "\"Just that, estimated\", in Social Blade's words." },
      ],
      note: "Source: Social Blade, \"How are estimated earnings calculated?\" and its YouTube money calculator, as indexed 1 November 2026.",
    },
    {
      file: "same-views-different-income.webp", type: "picks",
      title: "Example: same views, very different income",
      sub: "Three made-up channels with 50,000 views a day. Social Blade gives all three about $375 to $6,000 a month.",
      picks: [
        { name: "A: personal finance", tagline: "long-form, mostly US, monetized", points: ["High advertiser demand, mid-roll ads", "Can be above the $6,000 top of the range"] },
        { name: "B: comedy Shorts", tagline: "global audience, monetized", points: ["Most views paid from the shared Shorts pool", "Likely near or below the $375 bottom"] },
        { name: "C: gaming", tagline: "long-form, not in the Partner Program", points: ["No ads served for the channel", "$0 from ads"] },
        { name: "What the formula sees", tagline: "for all three", points: ["50,000 views x $0.25 to $4.00 per 1,000", "Nothing about niche, format or status"] },
      ],
      note: "Example channels, not real data. Range from Social Blade's documented $0.25 to $4.00 per 1,000 views.",
    },
    { file: "subscriber-count-checker-public-numbers.webp", type: "shot", src: "is-social-blade-accurate--subscriber-checker.png", maxHeight: 425 },
  ],
};
