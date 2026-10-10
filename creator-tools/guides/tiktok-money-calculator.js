// Guide and FAQ for /creator-tools/tiktok-money-calculator/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["tiktok-money-calculator"] in public/shared.js:
// qualified views = monthly views x share over 1 minute (default 60%); Creator Rewards $0.40 to $1.00 per 1,000 qualified views;
// yearly = x12; sponsored video = average views / 1,000 x $10 to $20. Eligibility note: 10,000 followers, 100,000 views in 30 days.
module.exports = {
  seoTitle: "TikTok Money Calculator: How Much TikTok Pays | Passive Array",
  seoDescription: "Estimate how much a TikTok account earns from Creator Rewards and sponsored videos. Free, no sign-up: enter monthly views to get a monthly and yearly range.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this TikTok money calculator estimates",
      p: [
        "TikTok has no free public API for earnings or views, so the calculator works from four numbers you type in: followers, total views per month, the share of those views on videos over one minute, and average views per video. It returns two income lines, each as a range:",
      ],
      list: [
        "<b>Creator Rewards per month</b>, from qualified views, plus the same range times 12 for a year.",
        "<b>Sponsored video</b>, a fair price band for one branded video, based on average views.",
        "<b>Views that do not qualify</b>, the monthly views on videos under one minute, which earn nothing from Creator Rewards in this estimate.",
      ],
      after: ["Live gifts, TikTok Shop commissions, subscriptions and affiliate income are not included. For many creators those add up to more than Creator Rewards, so treat the result as a floor."],
    },
    {
      h: "How much does TikTok pay per 1,000 views?",
      p: [
        "As of October 2026, TikTok's main payout for video views is the Creator Rewards Program. It pays on <b>qualified views</b> only, and the rate per view is not published and changes from account to account. The calculator assumes a range of <b>$0.40 to $1.00 per 1,000 qualified views</b>. The formula is:",
        "<b>Creator Rewards = monthly views x share over 1 minute / 1,000 x $0.40 to $1.00</b>",
        "Here is how that works out with the form's default of 60% of views on videos over one minute:",
      ],
      table: {
        head: ["Monthly views", "Qualified views (60%)", "Per month", "Per year"],
        rows: [
          ["100,000", "60,000", "$24 to $60", "$288 to $720"],
          ["500,000", "300,000", "$120 to $300", "$1,440 to $3,600"],
          ["2,000,000", "1,200,000", "$480 to $1,200", "$5,760 to $14,400"],
          ["10,000,000", "6,000,000", "$2,400 to $6,000", "$28,800 to $72,000"],
        ],
      },
      after: ["The range is wide on purpose. The rate moves with factors TikTok does not fully publish, such as where viewers are. Only your own Creator Rewards dashboard shows your real rate."],
    },
    {
      h: "Who can earn from TikTok Creator Rewards?",
      p: [
        "As of October 2026, the calculator assumes the commonly stated requirements: <b>10,000 followers</b>, <b>100,000 views in the last 30 days</b>, and pay only on <b>videos over one minute long</b>. TikTok also sets age and country rules. These change often, so confirm the current terms in the TikTok app under the creator tools before you rely on any figure.",
        "The one-minute rule is why the form asks what share of your views come from longer videos. If most of your views are on 30-second clips, the qualified share is low and so is the estimate, even with millions of views. Set the share to match your own content. If you only post short clips, set it to 0 and the Creator Rewards line will read $0.",
        "The calculator does not check eligibility. It works out what the views would pay if the account qualifies.",
      ],
    },
    {
      h: "How much do brands pay for a sponsored TikTok?",
      p: [
        "The second line prices one sponsored video from <b>average views per video</b>, not followers:",
        "<b>Sponsored video = average views / 1,000 x $10 to $20</b>",
        "So an account averaging 40,000 views gets a band of $400 to $800 per video. A creator averaging 100,000 views lands at $1,000 to $2,000, whatever the follower count.",
        "Views lead because TikTok's For You page decides reach. A creator with a big following whose videos now reach few people is worth less to a brand than a smaller creator whose videos travel. This is also why one sponsored video often pays more than a month of Creator Rewards for mid-sized accounts.",
        "For a full negotiation, with an engagement adjustment, a 3-video series and Spark Ads rights, use the <a href=\"../tiktok-pricing-calculator/\">TikTok pricing calculator</a>.",
      ],
    },
    {
      h: "How to get the most accurate estimate",
      ordered: true,
      list: [
        "<b>Use real monthly views.</b> If it is your account, take the 30-day video views from TikTok Studio. For someone else's account, add up views on the videos posted in the last 30 days.",
        "<b>Set the qualified share honestly.</b> Count how many of the month's views were on videos over one minute. The 60% default is only a starting point.",
        "<b>Use typical views for sponsorships.</b> Average the last 12 videos and leave out a one-off viral hit, which a brand will not expect to repeat.",
        "<b>Check the account first.</b> If views look low for the follower count, run the <a href=\"../tiktok-fake-follower-checker/\">fake follower estimator</a> or the <a href=\"../tiktok-audit/\">TikTok account audit</a> before quoting a price.",
      ],
      after: ["Comparing platforms? The <a href=\"../youtube-money-calculator/\">YouTube money calculator</a> and the <a href=\"../instagram-money-calculator/\">Instagram money calculator</a> use the same range-based approach."],
    },
  ],
  faq: [
    ["How much does TikTok pay for 1 million views?", "With the calculator's assumptions, 1 million views pay $400 to $1,000 if every view is on a video over one minute. At the default 60% qualified share, that drops to $240 to $600. Views on shorter videos earn nothing from Creator Rewards."],
    ["How much does TikTok pay per view?", "Fractions of a cent. The calculator assumes $0.40 to $1.00 per 1,000 qualified views, which is $0.0004 to $0.001 per view. TikTok does not publish a fixed rate."],
    ["How many followers do you need to get paid on TikTok?", "As of October 2026, the calculator assumes 10,000 followers and 100,000 views in the last 30 days for Creator Rewards. Rules change, so confirm in the TikTok app. Sponsorships have no follower minimum, though brands look at views."],
    ["Is the TikTok Creator Fund still running?", "This tool estimates Creator Rewards, the program TikTok uses for view payouts as of October 2026. Check the creator tools in the app for what is open in your country."],
    ["Does the calculator include TikTok Live gifts or TikTok Shop?", "No. It covers Creator Rewards and one sponsored video only. Gifts, Shop commissions, subscriptions and affiliate links are left out because they depend on things the public numbers cannot show."],
    ["Why are my qualified views lower than my total views?", "Only videos over one minute count. The form's qualified share tells the tool what part of your views came from those longer videos. Shorter videos still help you grow, but they add nothing to this estimate."],
    ["Can I see how much any TikToker makes?", "You can estimate it from public views. No outside tool can see real payouts, and this one cannot confirm the account is in Creator Rewards. Treat the result as a bracket."],
    ["Is the TikTok money calculator free?", "Yes. It is free with no sign-up and no limit. The maths runs in your browser."],
  ],
};
