// Guide and FAQ for /creator-tools/tiktok-account-comparison/. Merged into tools.js by build-tools.js.
// Metrics match COMPUTE["tiktok-account-comparison"], manualCompare() and compareTable() in public/shared.js.
// Every row marks a leader (highest value); ties get no leader. Account C is optional.
module.exports = {
  seoTitle: "Compare TikTok Accounts Side by Side, Free | Passive Array",
  seoDescription: "Compare two or three TikTok accounts on views per follower, engagement by views, share rate and likes per follower. Free, no sign-up, leader marked per row.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to compare TikTok accounts",
      ordered: true,
      list: [
        "Open each profile. Note followers and total likes from the top of the page.",
        "Average views, likes, comments and shares across each account's last 12 videos. TikTok has no free public API for these, so you type them in.",
        "Fill in Account A and Account B. Account C is optional; leave it empty to compare two.",
        "Press compare. The highest value on each row is shown in green. If two accounts tie for the top, no leader is marked.",
      ],
    },
    {
      h: "What each row in the comparison means",
      table: {
        head: ["Row", "How it is worked out", "Why it matters"],
        rows: [
          ["Followers", "As entered", "Audience size, but not reach"],
          ["Total likes", "As entered", "Lifetime popularity of all videos"],
          ["Likes per follower", "Total likes / followers", "Whether the audience was earned by content"],
          ["Average views", "As entered", "What a typical video reaches"],
          ["Views per follower", "Average views / followers x 100", "How far videos travel compared with the follower count"],
          ["Engagement by views", "(likes + comments + shares) / views x 100", "How strongly viewers react"],
          ["Share rate", "Shares / views x 100", "How often viewers pass videos on"],
        ],
      },
      after: [
        "Higher is marked as better on every row, including followers. Do not pick on followers alone. On TikTok the For You page decides reach, so views per follower and engagement by views usually tell you more about what a sponsored video will do.",
      ],
    },
    {
      h: "Reading the result for a brand deal",
      p: [
        "An account that leads on views per follower and engagement is reaching and moving people, even if it is smaller. An account with the most followers but the lowest views per follower deserves a closer look with the <a href=\"../tiktok-fake-follower-checker/\">fake follower estimator</a>. To score one account in depth, run the <a href=\"../tiktok-audit/\">TikTok account audit</a>. To turn average views into a price, use the <a href=\"../tiktok-pricing-calculator/\">TikTok pricing calculator</a>. Our <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">guide to vetting a creator</a> covers what else to check.",
      ],
    },
  ],
  faq: [
    ["Can I compare more than three TikTok accounts?", "Not in one go. The tool takes two or three. To shortlist more, compare in groups of three and carry the leaders forward."],
    ["Which number matters most when comparing TikTok creators?", "For sponsorships, average views and engagement by views. They show what a typical video reaches and how people react. Followers matter less on TikTok than on Instagram."],
    ["Why is the share rate shown with three decimals?", "Shares are usually a small fraction of views, so small differences matter. Three decimals keep two close accounts from looking identical."],
    ["Does the tool save the accounts I compare?", "No. The maths runs in your browser and nothing is stored. Note your numbers if you want to compare again later."],
    ["Is comparing TikTok accounts free?", "Yes. It is free with no sign-up and no limit."],
  ],
};
