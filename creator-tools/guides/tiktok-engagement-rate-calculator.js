// Guide and FAQ for /creator-tools/tiktok-engagement-rate-calculator/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["tiktok-engagement-rate-calculator"], ttGradeViews(), grade() and TT_TIERS in public/shared.js:
// by views = (likes + comments + shares) / views; grades under 3 low, 3-5 below avg, 5-9 average, 9-12 good, 12+ excellent.
// By followers is graded against the tier average (12 / 8 / 6 / 5 / 4) with grade(): 0.5, 0.85, 1.25, 1.6.
module.exports = {
  seoTitle: "TikTok Engagement Rate Calculator: By Views | Passive Array",
  seoDescription: "Work out a TikTok engagement rate by views and by followers from likes, comments and shares. Free, no sign-up, graded against typical rates for account size.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this TikTok engagement rate calculator shows",
      p: [
        "TikTok has no free public API for these numbers, so the calculator works from figures you type in. Open the profile, look at the last 12 videos, and enter the follower count plus average views, likes, comments and shares per video. You get:",
      ],
      list: [
        "<b>Engagement rate by views</b>, the headline number, with a grade from Low to Excellent.",
        "<b>Engagement rate by followers</b>, graded against the typical rate for the account's size.",
        "<b>Views per follower</b>, which shows how far each video reaches compared with the follower count.",
        "<b>Like rate by views</b> and <b>share rate by views</b>, so you can see which action carries the rate.",
      ],
      after: ["Nothing is stored and no login is needed. You can check any public account, including your own."],
    },
    {
      h: "How is TikTok engagement rate calculated?",
      p: [
        "The calculator uses two formulas. Both count likes, comments and shares equally:",
        "<b>By views = (likes + comments + shares) / views x 100</b>",
        "<b>By followers = (likes + comments + shares) / followers x 100</b>",
        "The headline is the rate by views. On TikTok most views come from the For You page, often from people who do not follow the creator. Dividing by followers can make a small account with one big video look amazing, or a large account with quiet followers look weak. Views are the fairer base.",
        "The rate by followers is still shown, because many brand briefs ask for it. Some agencies weight shares double; this tool does not.",
      ],
    },
    {
      h: "What is a good engagement rate on TikTok?",
      p: ["For the rate by views, the calculator grades every account on the same scale:"],
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
      after: [
        "The rate by followers is graded differently, because it falls as accounts grow. The tool compares it with a typical rate for each follower tier:",
      ],
    },
    {
      h: "Typical TikTok engagement by follower count",
      table: {
        head: ["Tier", "Followers", "Typical rate by followers"],
        rows: [
          ["Nano", "Under 10K", "12%"],
          ["Micro", "10K to 100K", "8%"],
          ["Mid", "100K to 500K", "6%"],
          ["Macro", "500K to 1M", "5%"],
          ["Mega", "Over 1M", "4%"],
        ],
      },
      after: [
        "Your rate is divided by the typical rate for your tier. Under half of it is Low. Up to 85% is Below average. Up to 125% is Average. Up to 160% is Good. Above that is Excellent.",
        "Here is a worked example using the placeholder numbers in the form. An account with 50,000 followers averages 30,000 views, 2,500 likes, 60 comments and 90 shares. That is 2,650 actions. By views, 2,650 / 30,000 is 8.83%, which grades Average. By followers, 2,650 / 50,000 is 5.3%. The micro tier typical is 8%, so 5.3% is about two thirds of it, which grades Below average. Views per follower is 60%.",
        "Same account, two different verdicts. That is normal on TikTok, and it is why both numbers are shown. Our <a href=\"../../blog/tiktok-engagement-rate-benchmarks/\">TikTok engagement rate benchmarks</a> explain why small accounts post such high rates.",
      ],
    },
    {
      h: "How to get accurate numbers, and what to do next",
      ordered: true,
      list: [
        "<b>Use the last 12 videos.</b> Fewer, and one viral clip can skew the average. Skip pinned videos, which are often old hits.",
        "<b>Add up and divide yourself.</b> TikTok shows views, likes, comments and shares on each video. Average each one across the 12.",
        "<b>If it is your account, use TikTok Studio.</b> Your own analytics show exact figures, so you can skip the rounding on large counts like 1.2M.",
        "<b>Look at the share rate.</b> Shares spread a video to new viewers. A low share rate with a high like rate means people enjoy it but do not pass it on.",
      ],
      after: [
        "A rate that looks too good, or too low, is worth a second check. The <a href=\"../tiktok-fake-follower-checker/\">TikTok fake follower estimator</a> tests whether views and comments match the follower count. The <a href=\"../tiktok-audit/\">TikTok account audit</a> turns engagement, reach and growth into one score. If you are pricing a deal, take the rate by views straight into the <a href=\"../tiktok-pricing-calculator/\">TikTok pricing calculator</a>.",
      ],
    },
  ],
  faq: [
    ["What is a good engagement rate on TikTok?", "By views, 5% to 9% is average on this tool's scale, 9% to 12% is good and over 12% is excellent. By followers it depends on size: around 12% is typical under 10K followers, falling to about 4% above 1 million."],
    ["Should I measure TikTok engagement by views or by followers?", "By views, for most decisions. TikTok shows videos to non-followers, so views are the real audience. Use the rate by followers when a brand asks for it, or when you compare with Instagram, which is usually measured that way."],
    ["Why is my TikTok engagement rate higher than on Instagram?", "TikTok gives every video a test audience beyond your followers, and the like button is on screen for the whole video. Rates by followers run several times higher than Instagram's, so the two cannot be graded on the same scale."],
    ["Does the calculator count saves or views as engagement?", "No. It counts likes, comments and shares. Saves are not included, because they are not shown on every video. Views are the base the rate is divided by."],
    ["Can I check someone else's TikTok engagement rate?", "Yes. Every number the tool needs is public on the profile and on each video. You type them in, so it works for any public account."],
    ["Why do the two rates give different grades?", "They answer different questions. By views asks how people react to what they see. By followers asks how the reaction compares with the audience size. An account whose videos reach fewer people than it has followers will grade lower by followers."],
    ["How do I increase my TikTok engagement rate?", "Give viewers a reason to act: ask a specific question for comments, and make videos people want to send to a friend for shares. Then measure again on your next 12 videos and compare."],
    ["Is this TikTok engagement rate calculator free?", "Yes. It is free with no sign-up and no limit. The maths runs in your browser."],
  ],
};
