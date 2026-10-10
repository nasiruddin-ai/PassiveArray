// Guide and FAQ for /creator-tools/tiktok-pricing-calculator/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["tiktok-pricing-calculator"] and ttGradeViews() in public/shared.js:
// price = average views / 1,000 x $10 to $20 x adj, adj = clamp(er / 7, 0.7, 1.4); series of 3 = 2.5x; Spark Ads rights = +40%.
module.exports = {
  seoTitle: "TikTok Pricing Calculator: Sponsored Post Rates | Passive Array",
  seoDescription: "Work out what to charge for a sponsored TikTok from average views and engagement. Free, no sign-up, with prices for a 3-video series and Spark Ads rights.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this TikTok influencer pricing calculator gives you",
      p: [
        "Enter three numbers from the creator's profile: followers, average views per video and engagement rate by views. TikTok has no free public API for these, so you type them in. The calculator returns:",
      ],
      list: [
        "<b>Sponsored video</b>, a fair price range for one branded TikTok.",
        "<b>Series of 3 videos</b>, priced at 2.5 times a single video.",
        "<b>With Spark Ads rights</b>, the single video price plus 40%, for when the brand wants to boost the creator's post as an ad.",
        "<b>Engagement grade</b>, from Low to Excellent, which also sets the price adjustment.",
      ],
      after: ["It works for both sides. Creators can use it to set a rate card. Brands can use it to check whether a quote is in a sensible range."],
    },
    {
      h: "How much should you charge for a sponsored TikTok?",
      p: [
        "The calculator starts from views, then adjusts for engagement:",
        "<b>Price = average views / 1,000 x $10 to $20 x engagement adjustment</b>",
        "The adjustment is your engagement rate by views divided by 7%, kept between <b>0.7x and 1.4x</b>. So 7% engagement leaves the price as it is. At 4.9% or below the price is cut by 30%. At 9.8% or above it rises by 40%, and engagement above that adds nothing more.",
        "Here is a creator averaging 40,000 views a video at three engagement levels:",
      ],
      table: {
        head: ["Engagement by views", "Adjustment", "One video", "Series of 3", "With Spark Ads"],
        rows: [
          ["3.5% (Below average)", "0.7x", "$280 to $560", "$700 to $1,400", "$392 to $784"],
          ["7% (Average)", "1.0x", "$400 to $800", "$1,000 to $2,000", "$560 to $1,120"],
          ["12% (Good)", "1.4x", "$560 to $1,120", "$1,400 to $2,800", "$784 to $1,568"],
        ],
      },
      after: ["Same reach, double the price from bottom to top. Engagement is the main thing a creator can change in the short term."],
    },
    {
      h: "Why views matter more than followers on TikTok",
      p: [
        "Followers are shown in the results but do not change the price. On TikTok the For You page decides who sees each video, so the follower count says little about how many people a sponsored post will reach.",
        "A creator averaging 100,000 views can fairly charge more than one with 500,000 followers and 20,000 views. The first prices at $1,000 to $2,000 before the engagement adjustment. The second prices at $200 to $400.",
        "Use typical views, not the best ones. Average the last 12 videos and leave out a single viral hit. A brand pays for what the next video is likely to do, and an inflated average leads to an awkward conversation after the campaign. Our <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">guide to vetting a creator</a> covers what brands check first.",
      ],
    },
    {
      h: "Engagement grades used in the price",
      p: ["The engagement rate by views is (likes + comments + shares) / views x 100. The calculator grades it like this:"],
      table: {
        head: ["Engagement by views", "Grade"],
        rows: [
          ["Under 3%", "Low"],
          ["3% to 5%", "Below average"],
          ["5% to 9%", "Average"],
          ["9% to 12%", "Good"],
          ["Over 12%", "Excellent"],
        ],
      },
      after: ["Do not know the rate? Work it out first with the <a href=\"../tiktok-engagement-rate-calculator/\">TikTok engagement rate calculator</a>, then copy the rate by views across."],
    },
    {
      h: "What the price does not include",
      list: [
        "<b>Usage rights.</b> Spark Ads rights are priced at +40% here. If the brand wants the video for its own ads or channels beyond that, or for a long period, add more.",
        "<b>Exclusivity.</b> A clause that stops the creator working with competitors has a cost. Agree it separately.",
        "<b>Production.</b> The range assumes a normal creator-made video. Travel, props, extra people or a script the brand writes all add time.",
        "<b>Niche.</b> The $10 to $20 per 1,000 views band is a general one. Creators whose audience is hard to reach, or close to buying, can ask for more.",
      ],
      after: [
        "Before you sign, check the audience is real. A large follower count with low views is the classic sign of bought followers, and the <a href=\"../tiktok-fake-follower-checker/\">TikTok fake follower estimator</a> tests for it. The <a href=\"../tiktok-money-calculator/\">TikTok money calculator</a> shows how the deal compares with what the creator earns from views. Pricing Instagram too? See <a href=\"../../blog/how-much-to-charge-for-a-sponsored-instagram-post/\">how much to charge for a sponsored Instagram post</a>.",
      ],
    },
  ],
  faq: [
    ["How much do TikTok influencers charge per post?", "With this calculator, one sponsored video costs $10 to $20 per 1,000 average views, adjusted from 0.7x to 1.4x by engagement. A creator averaging 40,000 views at 7% engagement prices at $400 to $800."],
    ["How much does a TikTok creator with 100K followers charge?", "It depends on views, not followers. If a 100K account averages 30,000 views at 7% engagement by views, the range is $300 to $600. If it averages 150,000 views, the range is $1,500 to $3,000."],
    ["What are Spark Ads rights?", "Spark Ads let a brand pay to promote the creator's own post, so it runs as an ad from the creator's account. The creator gives the brand an authorisation code. The calculator adds 40% to the single video price for those rights."],
    ["Why is a series of 3 videos not 3 times the price?", "A bundle saves the creator time on briefing and approvals, so a discount is normal. The calculator prices 3 videos at 2.5 times one video, which is about 17% off per video."],
    ["Does a higher engagement rate always raise the price?", "Up to a point. The adjustment tops out at 1.4x, which you reach at 9.8% engagement by views. Above that, the price is set by views alone."],
    ["Should brands pay by followers or by views on TikTok?", "By views. Followers do not decide who sees a video on TikTok. Ask the creator for recent video views from their analytics if the public averages look uneven."],
    ["Is this TikTok pricing calculator free?", "Yes. It is free with no sign-up and no limit. The maths runs in your browser and nothing is stored."],
  ],
};
