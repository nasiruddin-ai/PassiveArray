module.exports = {
  cover: {
    kicker: "Earnings",
    title: "How and when *YouTube* pays you",
    sub: "AdSense for YouTube, the payment threshold, the dates and tax withholding.",
    size: 62,
    visual: { type: "stats", items: [
      { big: "$100", label: "payment threshold for USD accounts", note: "Or the local equivalent, such as £60 or €70" },
      { big: "21st-26th", label: "of the month: when payment is issued", note: "For last month's finalized earnings, via AdSense for YouTube" },
    ] },
  },
  figures: [
    {
      file: "youtube-payout-setup-steps.webp", type: "flow",
      title: "From joining to getting paid",
      sub: "Each step has to be done before AdSense for YouTube releases money.",
      steps: [
        { title: "Join and link AdSense", text: "Join the Partner Program and link or create an AdSense for YouTube account." },
        { title: "Verify identity", text: "At a $10 balance, AdSense asks you to verify your identity and address." },
        { title: "Add tax info", text: "Submit US tax info, or Google can withhold up to 24% of worldwide earnings." },
        { title: "Monthly cycle", text: "Finalized early next month, paid on the 21st to 26th once you reach $100." },
      ],
      note: "Source: AdSense for YouTube payment and US tax withholding rules.",
    },
    {
      file: "youtube-payout-timeline.webp", type: "timeline",
      title: "When YouTube pays you for a month's earnings",
      sub: "Earnings from one month are paid during the next one, if you have reached the threshold.",
      events: [
        { dot: "1", when: "Month ends", what: "Your estimated earnings stop growing for that month" },
        { dot: "2", when: "7th to 12th", what: "Last month's earnings are finalized and added to your balance" },
        { dot: "3", when: "20th", what: "Cut-off: your balance must reach the payment threshold ($100 for USD accounts)" },
        { dot: "$", when: "21st to 26th", what: "Payment issued; \"Payment pending\" shows in AdSense for YouTube" },
      ],
      note: "Source: YouTube Help, \"AdSense for YouTube payment process\" and payment thresholds. Weekends and holidays can move a date.",
    },
  ],
};
