// Guide and FAQ for /creator-tools/instagram-pricing-calculator/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["instagram-pricing-calculator"] and igPrice() in public/shared.js:
// post mid = followers / 1,000 x $10 x clamp(ER / tier avg, 0.6, 1.6); reel 1.3x, story 0.4x, story set of 3 1x,
// post + reel + 3 stories bundle 2.8 x 0.85 = 2.38x; each range 0.7x to 1.3x of its midpoint.
module.exports = {
  seoTitle: "Instagram Pricing Calculator: Post, Reel, Story | Passive Array",
  seoDescription: "How much to charge for an Instagram post, reel or story. Enter followers and engagement rate for a fair price range for each format. Free, no sign-up needed.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this Instagram influencer pricing calculator gives you",
      p: ["Enter the account's followers and engagement rate. You get a price range for each Instagram format, so neither side has to convert numbers during a call:"],
      table: {
        head: ["Format", "Price relative to a feed post"],
        rows: [
          ["Feed post", "1x, the baseline"],
          ["Reel", "1.3x"],
          ["Single story", "0.4x"],
          ["Story set of 3", "1x"],
          ["Post + reel + 3 stories bundle", "2.38x (2.8x with a 15% bundle discount)"],
        ],
      },
      after: ["It works for both sides of a deal: a creator writing a rate card, or a brand checking whether a quote is fair. Instagram has no free public API for these numbers, so you type them in. Nothing is stored."],
    },
    {
      h: "How much to charge for a sponsored Instagram post",
      p: [
        "The feed post price is the anchor for every other format. It starts from a rate per 1,000 followers and moves with engagement:",
        "<b>Feed post = followers / 1,000 x $10 x engagement adjustment</b>",
        "The engagement adjustment is your rate divided by the typical rate for your size: 4.0% under 10K followers, 2.0% to 100K, 1.4% to 500K, 1.1% to 1M and 0.8% above. It is capped between 0.6x and 1.6x, so engagement can lower the base price by up to 40% or raise it by up to 60%. Every range on the page is 30% either side of its midpoint.",
      ],
    },
    {
      h: "Worked example: 150,000 followers at 1.8% engagement",
      p: ["The account is in the mid tier, where 1.4% is typical. 1.8 / 1.4 is about 1.29x, so the feed post midpoint is 150 x $10 x 1.29, about $1,929."],
      table: {
        head: ["Format", "Price range"],
        rows: [
          ["Feed post", "$1,350 to $2,507"],
          ["Reel", "$1,755 to $3,259"],
          ["Single story", "$540 to $1,003"],
          ["Story set of 3", "$1,350 to $2,507"],
          ["Post + reel + 3 stories bundle", "$3,213 to $5,967"],
        ],
      },
      after: [
        "A creator would usually open near the top of the range and settle somewhere in the middle. A brand would start near the bottom. The range is the zone where a deal is reasonable for both.",
        "Why the multipliers? A reel is shown to people beyond your followers, so it tends to reach more people than a feed post. A single story disappears after 24 hours. A set of three stories tells a fuller story and is priced like one feed post. Our article on <a href=\"../../blog/how-much-to-charge-for-a-sponsored-instagram-post/\">how much to charge for a sponsored Instagram post or reel</a> explains the format differences in more detail.",
      ],
    },
    {
      h: "What to add on top of the calculated price",
      p: ["The calculator prices the content only. These are separate line items. Quote them separately or you give them away:"],
      list: [
        "<b>Usage rights</b> beyond 30 days, when the brand wants to reuse your content on its own channels or in ads. Add 20% to 50%.",
        "<b>Whitelisting</b>, when the brand runs ads from your handle. Add 20% to 50%.",
        "<b>Exclusivity</b>, when you agree not to work with competitors for a period. Add 20% to 50%, more for long periods.",
        "<b>Extra revisions, rush turnaround or raw files.</b> Agree a price before you start, not after.",
      ],
      after: ["Price these from the midpoint of the format they apply to, and write the period and channels into the contract."],
    },
    {
      h: "Finding the inputs, and checking the account first",
      ordered: true,
      list: [
        "<b>Followers:</b> on the profile.",
        "<b>Engagement rate:</b> average the likes and comments on the last 12 posts, divide by followers and multiply by 100. The <a href=\"../instagram-engagement-rate-calculator/\">engagement rate calculator</a> does it for you. If it is your own professional account, the Professional dashboard and each post's insights show the counts, even hidden likes. As of October 2026 that is where they sit; check the app if menus have moved.",
        "<b>Before a brand pays:</b> run the account through the <a href=\"../instagram-fake-follower-checker/\">fake follower estimator</a>. A price built on a rate inflated by bought likes is a price for attention that does not exist. The <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">brand's vetting checklist</a> covers the rest.",
      ],
      after: ["Want the monthly view instead of a rate card? The <a href=\"../instagram-money-calculator/\">Instagram money calculator</a> uses the same per-post formula and multiplies it by the number of deals a month."],
    },
  ],
  faq: [
    ["How much should I charge for an Instagram post with 10K followers?", "At the typical 2.0% engagement for that size, the calculator suggests $70 to $130 for a feed post, $91 to $169 for a reel and $28 to $52 for a single story. Higher engagement raises all three."],
    ["How much do brands pay for a reel?", "The calculator prices a reel at 1.3 times a feed post, because reels are shown beyond your followers. For a 50,000-follower account at a typical 2.0% rate, that is $455 to $845."],
    ["Should stories cost less than posts?", "A single story is priced at 0.4 times a feed post because it disappears after 24 hours. A set of three is priced the same as one post."],
    ["Is $10 per 1,000 followers the right rate?", "It is a common starting point, not a rule. The calculator adjusts it for engagement. Niche, audience country and how much work the brief needs can push the real number up or down."],
    ["What about usage rights and exclusivity?", "They are not in the calculated price. Add 20% to 50% for exclusivity, whitelisting or usage beyond 30 days, and put the terms in writing."],
    ["Should I offer a bundle discount?", "The calculator shows one option: a feed post, a reel and three stories at a 15% discount, 2.38 times a feed post in total. A bundle gives the brand a reason to book more than one format."],
    ["Does this work for TikTok?", "No. TikTok engagement runs on a different scale. Use the <a href=\"../tiktok-pricing-calculator/\">TikTok pricing calculator</a>."],
    ["Is the Instagram pricing calculator free?", "Yes. No sign-up, no login and no limit."],
  ],
};
