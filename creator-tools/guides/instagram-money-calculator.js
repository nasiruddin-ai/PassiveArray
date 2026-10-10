// Guide and FAQ for /creator-tools/instagram-money-calculator/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["instagram-money-calculator"] and igPrice() in public/shared.js:
// mid = followers / 1,000 x $10 x mult, mult = clamp(ER / tier average, 0.6, 1.6) (1 when ER is blank or 0);
// per post 0.7x to 1.3x mid; per month x sponsored posts; per year x 12.
module.exports = {
  seoTitle: "Instagram Money Calculator: Earnings Per Post | Passive Array",
  seoDescription: "Estimate how much an Instagram creator earns per sponsored post, per month and per year from followers and engagement rate. Free, no sign-up, every step shown.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this Instagram money calculator estimates",
      p: ["Instagram does not pay creators per follower or per view in the way YouTube ads do. For most creators the main income is brand deals, so this calculator estimates sponsored post earnings. Enter followers, engagement rate and how many sponsored posts the account runs a month. You get:"],
      list: [
        "<b>Estimated earnings per sponsored post</b>, as a range.",
        "<b>Per month</b>, the per-post range times the number of sponsored posts.",
        "<b>Per year</b>, the monthly range times 12.",
        "<b>The tier and its typical engagement rate</b>, plus the engagement adjustment that was applied.",
      ],
      after: ["Instagram has no free public API for follower or engagement numbers, so you type them in. Nothing is fetched and nothing is stored."],
    },
    {
      h: "How much do Instagram influencers make per post?",
      p: [
        "The calculator starts from a common industry rule of thumb, then adjusts it for engagement:",
        "<b>Base price = followers / 1,000 x $10</b>",
        "That base is multiplied by how the engagement rate compares with the typical rate for the account's size. An account exactly at its tier's typical rate gets 1x. Above it, the price rises, up to a cap of 1.6x. Below it, the price falls, down to a floor of 0.6x. The range shown is 30% either side of the adjusted figure.",
      ],
      table: {
        head: ["Account", "Engagement", "Adjustment", "Per sponsored post"],
        rows: [
          ["5,000 followers", "4.0% (nano typical)", "1x", "$35 to $65"],
          ["50,000 followers", "2.0% (micro typical)", "1x", "$350 to $650"],
          ["50,000 followers", "1.0%", "0.6x (floor)", "$210 to $390"],
          ["50,000 followers", "4.0%", "1.6x (cap)", "$560 to $1,040"],
          ["300,000 followers", "1.4% (mid typical)", "1x", "$2,100 to $3,900"],
          ["2,000,000 followers", "0.8% (mega typical)", "1x", "$14,000 to $26,000"],
        ],
      },
      after: ["The same 50,000-follower account can be worth anything from $210 to $1,040 a post depending on engagement. That is why the rate matters more than the follower count in a negotiation."],
    },
    {
      h: "Worked example: monthly and yearly Instagram income",
      p: [
        "Take a creator with 60,000 followers, a 2.5% engagement rate and 4 sponsored posts a month.",
      ],
      ordered: true,
      list: [
        "Tier: micro (10K to 100K), typical rate 2.0%.",
        "Adjustment: 2.5 / 2.0 = 1.25x.",
        "Adjusted price: 60 x $10 x 1.25 = $750 a post.",
        "Range: $525 to $975 per sponsored post.",
        "Per month at 4 posts: $2,100 to $3,900. Per year: $25,200 to $46,800.",
      ],
      after: [
        "The monthly figure is only as good as the posts-per-month number. Four paid posts every month is a busy schedule for a 60,000-follower account. If you are planning, use the number of deals you have actually closed in recent months, not the number you hope for.",
      ],
    },
    {
      h: "Where to find followers and engagement in the Instagram app",
      list: [
        "<b>Followers</b> are on the profile of any account.",
        "<b>Engagement rate</b> is not shown as one figure in the app. Average the likes and comments on the last 12 posts and divide by followers, or let the <a href=\"../instagram-engagement-rate-calculator/\">engagement rate calculator</a> do it.",
        "<b>For your own account</b>, a professional (creator or business) account gives you the Professional dashboard and per-post insights, where you can see likes and comments even if they are hidden from others. As of October 2026 these sit under the profile's dashboard and each post's <b>View insights</b> link. Check the app if they have moved.",
      ],
      after: ["Brands increasingly ask for reach and audience country, which only you can see in Insights. Our <a href=\"../../blog/how-to-make-a-creator-media-kit/\">media kit guide</a> shows which numbers to put in front of them."],
    },
    {
      h: "What the calculator leaves out",
      p: ["This is an estimate of sponsored post income only, at a standard rate. Real earnings move for reasons the formula cannot see:"],
      list: [
        "<b>Format.</b> Reels and story sets are priced differently from a feed post. The <a href=\"../instagram-pricing-calculator/\">Instagram pricing calculator</a> splits the price by format.",
        "<b>Niche and audience country.</b> Finance, tech and business audiences, and audiences in large ad markets, can command more.",
        "<b>Usage rights and exclusivity.</b> A brand that wants to run your content as an ad, or stop you working with competitors, should pay extra. The pricing calculator suggests 20% to 50% on top.",
        "<b>Other income.</b> Affiliate links, your own products, subscriptions and any payouts Instagram runs are not included. Instagram's own bonus and subscription programmes change and are not open in every country, so check what is available in your app.",
      ],
      after: ["Our article on <a href=\"../../blog/how-much-to-charge-for-a-sponsored-instagram-post/\">how much to charge for a sponsored Instagram post</a> covers the negotiation side in more depth."],
    },
  ],
  faq: [
    ["How much money do you make on Instagram with 10,000 followers?", "At the typical 2.0% engagement for that size, the calculator estimates $70 to $130 per sponsored post. With higher engagement it can rise to $112 to $208, the 1.6x cap. Monthly income depends on how many deals you close."],
    ["How much does Instagram pay for 1 million followers?", "Instagram itself does not pay per follower. At the typical 0.8% engagement for that size, a sponsored post estimates at $7,000 to $13,000 using this calculator's formula. Real deals at that size vary widely."],
    ["Does Instagram pay you for views or likes?", "Not as a standard rate the way YouTube shares ad revenue. Instagram has run bonus, gift and subscription programmes, but they change and are not open everywhere. As of October 2026, check the monetization section of your Professional dashboard to see what is available to you."],
    ["Why does engagement change the estimate so much?", "A brand pays for attention. The calculator moves the price between 0.6x and 1.6x of the base depending on how the engagement rate compares with the typical rate for the account's size."],
    ["What if I leave the engagement rate blank?", "The calculator then uses no adjustment, 1x, so you see the plain $10 per 1,000 followers base with the 30% range around it."],
    ["Can I use this to check what another creator earns?", "You can estimate it from their public numbers, but nobody outside the deal knows the real fee. Treat the result as a bracket, not a payslip."],
    ["Is this the same as the Instagram pricing calculator?", "They share the same per-post formula. This tool turns it into monthly and yearly income. The <a href=\"../instagram-pricing-calculator/\">pricing calculator</a> breaks the price out by feed post, reel and stories."],
    ["Is the Instagram money calculator free?", "Yes. No sign-up, no login and no limit."],
  ],
};
