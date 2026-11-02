module.exports = {
  cover: {
    kicker: "Earnings",
    title: "How Instagram creators *get paid*",
    sub: "Brand deals, subscriptions, gifts, badges and bonuses, and who qualifies.",
    size: 62,
    visual: { type: "shot", src: "how-do-instagram-creators-make-money--money-calculator.png", label: "Instagram Money Calculator", tag: "Example numbers", style: "height:400px;object-fit:cover;object-position:left top" },
  },
  figures: [
    { file: "instagram-money-calculator-estimate.webp", type: "shot", src: "how-do-instagram-creators-make-money--money-calculator.png" },
    {
      file: "instagram-sponsored-post-example.webp", type: "flow",
      title: "Example: pricing a sponsored post",
      sub: "60,000 followers, 2.5% engagement, 4 deals a month. An example, not a real account.",
      steps: [
        { title: "Find the tier", text: "Micro: 10K to 100K followers, typical engagement rate 2.0%.", you: "Tier sets the benchmark" },
        { title: "Adjust", text: "2.5% / 2.0% = 1.25x the base rate of $10 per 1,000 followers.", you: "60 x $10 x 1.25 = $750" },
        { title: "Range per post", text: "The calculator shows a range around the adjusted price.", you: "$525 to $975 per post" },
        { title: "Per month", text: "At 4 sponsored posts a month.", you: "$2,100 to $3,900 a month" },
      ],
      note: "Example from the article, using the Passive Array calculators' method. An estimate, not a quote.",
    },
    {
      file: "instagram-payouts-at-a-glance.webp", type: "picks",
      title: "Instagram's own payouts at a glance",
      sub: "Each has its own rules, and most are limited by country.",
      picks: [
        { name: "Gifts on reels", tagline: "viewers send Stars", points: ["$0.01 per Star, paid monthly", "18+, professional account, 500 followers"] },
        { name: "Subscriptions", tagline: "you set the monthly price", points: ["Instagram's share currently 0%", "Apple and Google in-app fees: 30%"] },
        { name: "Badges", tagline: "during Live", points: ["Viewers buy badges to show support", "Eligibility shown in your Professional dashboard"] },
        { name: "Bonuses", tagline: "invitation only", points: ["Pay for performance of reels and posts", "Tests in selected countries, limited periods"] },
      ],
      note: "Source: Instagram Help Center (Gifts, Subscriptions, payouts) and Meta Newsroom.",
    },
  ],
};
