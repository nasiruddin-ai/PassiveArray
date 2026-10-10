// Guide and FAQ for /creator-tools/tiktok-audit/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["tiktok-audit"], ttFakeScore() and letter() in public/shared.js:
// engagement 30 (full at 9% by views), reach 25 (full at views = 50% of followers), authenticity 25 x (100 - suspicion) / 100,
// growth 10 (full at +8% in 30 days, zero at -2%, 5 if no figure), consistency 10 (3+/week 10, 1+ 6, under 1 3, 0 none).
module.exports = {
  seoTitle: "TikTok Account Audit: Free Audience Quality Score | Passive Array",
  seoDescription: "Audit any TikTok account with a 0 to 100 audience quality score covering engagement, reach, authenticity and growth. Free, no sign-up, every point shown.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What the TikTok audit scores",
      p: [
        "TikTok has no free public API for these numbers, so you type in what the profile shows: followers, total likes, and average views, likes, comments and shares from the last 12 videos. Add the follower count from 30 days ago and how many videos a week the account posts. The audit adds up four parts:",
      ],
      table: {
        head: ["Part", "Points", "Full marks at"],
        rows: [
          ["Engagement: (likes + comments + shares) / views", "30", "9% or more"],
          ["Reach: average views / followers", "25", "50% or more"],
          ["Authenticity: 100 minus the fake follower suspicion score", "25", "No red flags"],
          ["Growth in 30 days", "10", "+8% or more"],
          ["Consistency: videos a week", "10", "3 or more"],
        ],
      },
      after: [
        "Engagement and reach grow in a straight line up to their cap. Growth scores zero at a 2% loss or worse. If you leave the 30-day figure blank, growth gets 5 of 10. Consistency gives 6 points for 1 to 3 videos a week and 3 for fewer. Grades: A from 85, B from 70, C from 55, D from 40, F below.",
      ],
    },
    {
      h: "A worked example",
      p: [
        "An account has 100,000 followers and 2.5 million total likes. Its videos average 30,000 views, 1,600 likes, 40 comments and 160 shares. It grew 3% in 30 days and posts twice a week.",
      ],
      list: [
        "<b>Engagement:</b> 1,800 / 30,000 is 6%, two thirds of 9%, so 20 of 30.",
        "<b>Reach:</b> views are 30% of followers, 60% of the target, so 15 of 25.",
        "<b>Authenticity:</b> no flags, so 25 of 25.",
        "<b>Growth:</b> +3% is halfway from -2% to +8%, so 5 of 10. <b>Consistency:</b> 2 a week, so 6 of 10.",
      ],
      after: [
        "Total: 71, a B. The quickest gains are reach and posting a third video each week. The authenticity flags come from the <a href=\"../tiktok-fake-follower-checker/\">TikTok fake follower estimator</a>, and any that fire are listed under the score.",
      ],
    },
    {
      h: "Limits of a public-number audit",
      p: [
        "The audit cannot see watch time, audience countries or who the followers are. One viral video in the last 12 can lift engagement and reach. Before a deal, ask the creator for analytics screenshots. To weigh two creators against each other, use <a href=\"../tiktok-account-comparison/\">compare TikTok accounts</a>. For how typical rates change with account size, see <a href=\"../../blog/tiktok-engagement-rate-benchmarks/\">TikTok engagement rate benchmarks</a>.",
      ],
    },
  ],
  faq: [
    ["What is a good TikTok audit score?", "70 or more (grade B) means the account is strong on most parts. 85 or more is an A. Under 40 means several parts are weak. The bars show which."],
    ["Why does growth count for only 10 points?", "Growth can be bought or come from one lucky video. Engagement, reach and authenticity say more about what a brand gets, so they carry 80 of the 100 points."],
    ["Where do I find the follower count from 30 days ago?", "For your own account, check the follower figures in your TikTok analytics. For someone else's, note the count today and check again later. If you leave it blank, the audit gives a neutral 5 of 10 for growth."],
    ["Is this TikTok audit free?", "Yes. It is free with no sign-up. The maths runs in your browser and nothing is stored."],
  ],
};
