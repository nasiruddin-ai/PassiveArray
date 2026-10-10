// Guide and FAQ for /creator-tools/instagram-audit/. Merged into tools.js by build-tools.js.
// Weights match COMPUTE["instagram-audit"], igFakeScore() and letter() in public/shared.js:
// engagement 35 = clamp(ER / (tier avg x 1.25), 0, 1); authenticity 25 = (100 - suspicion score) / 100;
// growth 20 = clamp((growth% + 2) / 7, 0, 1), 10 points when no 30-day figure; consistency 20 at 3-7 posts/week,
// 16 above 7, 12 at 1 to under 3, 6 above 0 and under 1, 0 at none. Grades A 85, B 70, C 55, D 40.
module.exports = {
  seoTitle: "Instagram Audit: Free Account Health Score | Passive Array",
  seoDescription: "Audit any Instagram account for free. Get a 0-100 audience quality score from engagement, authenticity, growth and posting pace, with every point explained.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this Instagram account audit scores",
      p: ["The audit gives one audience quality score out of 100, made from four parts. Each part has a bar on the result showing the raw figure behind it, so you can see exactly where points were lost."],
      table: {
        head: ["Part", "Points", "What is measured", "Full marks at"],
        rows: [
          ["Engagement", "35", "(average likes + comments) / followers, against the typical rate for the account's size", "1.25 times the tier's typical rate"],
          ["Authenticity", "25", "The suspicion score from the fake follower checks, turned around", "No red flags"],
          ["Growth", "20", "Follower change over the last 30 days", "5% or more"],
          ["Consistency", "20", "Posts per week", "3 to 7 a week"],
        ],
      },
      after: [
        "Instagram has no free public API for these numbers, so the audit works from what you type: the five profile numbers, the follower count 30 days ago and how often the account posts. It is useful for your own account, and for a brand checking a creator before a deal.",
      ],
    },
    {
      h: "How each part of the score is worked out",
      list: [
        "<b>Engagement.</b> Typical rates by size are 4.0% under 10K followers, 2.0% to 100K, 1.4% to 500K, 1.1% to 1M and 0.8% above. Points rise in a straight line up to 1.25 times the typical rate, which is the line between Average and Good on the <a href=\"../instagram-engagement-rate-benchmark/\">engagement benchmark</a>.",
        "<b>Authenticity.</b> The <a href=\"../instagram-fake-follower-checker/\">fake follower estimator</a> gives a suspicion score from 0 to 100. The audit gives the matching share of 25 points: a suspicion score of 0 earns all 25, a score of 40 earns 15. Each flag that fired is listed under the bars.",
        "<b>Growth.</b> Growth of 5% or more in 30 days earns all 20 points. Points fall in a straight line to zero at a 2% loss. Flat growth, 0%, earns about 6 points. If you leave the 30-day figure blank, the part scores a neutral 10.",
        "<b>Consistency.</b> 3 to 7 posts a week earns 20. More than 7 earns 16. 1 to under 3 earns 12. Under 1 a week earns 6. None earns 0.",
      ],
      table: {
        head: ["Score", "Grade"],
        rows: [["85 to 100", "A"], ["70 to 84", "B"], ["55 to 69", "C"], ["40 to 54", "D"], ["Under 40", "F"]],
      },
    },
    {
      h: "Worked example: a 25,000-follower account",
      p: ["The account follows 800 people, has 340 posts, and its recent posts average 400 likes and 10 comments. It had 24,000 followers 30 days ago and posts twice a week."],
      ordered: true,
      list: [
        "<b>Engagement:</b> 410 / 25,000 = 1.64%. Full marks need 1.25 x 2.0% = 2.5%. 1.64 / 2.5 of 35 is about 23 points.",
        "<b>Authenticity:</b> engagement is above 70% of typical, comments are 2.4% of likes, following is low, posts are plenty. No flags, so 25 points.",
        "<b>Growth:</b> 24,000 to 25,000 is about +4.2%. That earns about 18 of 20.",
        "<b>Consistency:</b> 2 posts a week earns 12 of 20.",
      ],
      after: [
        "Total: 78, a B. The quickest gains are posting one more time a week, which would add 8 points, and lifting engagement toward 2.5%. Our article on <a href=\"../../blog/instagram-engagement-rate-by-follower-count/\">engagement rate by follower count</a> covers what tends to move the rate.",
      ],
    },
    {
      h: "Where to find each number in the Instagram app",
      list: [
        "<b>Followers, following and posts:</b> at the top of the profile.",
        "<b>Average likes and comments:</b> add up the counts on the last 12 posts and divide by the number of posts. On your own professional account, each post's <b>View insights</b> shows them, including likes you have hidden.",
        "<b>Followers 30 days ago:</b> for your own account, the Professional dashboard shows follower change over recent periods in Insights. For someone else's account, use a figure you noted a month ago, or a third-party tracker if it covers the account.",
        "<b>Posts per week:</b> count the posts in the last four weeks on the profile grid and divide by four. Count reels and carousels; skip stories.",
      ],
      after: ["As of October 2026 these figures sit in the places above. Instagram moves menus from time to time, so check the app if a label has changed."],
    },
    {
      h: "What the audit cannot see",
      list: [
        "<b>Reach, saves, shares and audience location.</b> They drive how Instagram shows posts, but only the owner sees them. A brand should ask for an insights screenshot alongside the score.",
        "<b>Content quality and fit.</b> A high score says the audience is real and active. It does not say the audience matches your product.",
        "<b>Sources of growth.</b> A giveaway can push growth to full marks and then hurt engagement for weeks. Read the growth bar next to the engagement bar.",
      ],
      after: ["To put two or three accounts side by side, use <a href=\"../instagram-account-comparison/\">compare Instagram accounts</a>. For a ranked action plan from your numbers, try the <a href=\"../instagram-growth-advisor/\">Instagram growth advisor</a>."],
    },
  ],
  faq: [
    ["How do I audit my Instagram account for free?", "Type your followers, following, posts, average likes and comments, your follower count 30 days ago and your posts per week into the audit. You get a score out of 100 with four bars showing where you gained and lost points. No login is needed."],
    ["What is a good Instagram audit score?", "70 or more is a B, which means most parts are healthy. 85 or more is an A. Under 40 is an F and usually means weak engagement plus one or more fake follower flags."],
    ["Is this the score Instagram uses?", "No. Instagram does not publish an account score. This is Passive Array's own formula built from public numbers, and every weight is shown on this page."],
    ["How often should I post to get full consistency points?", "3 to 7 posts a week. Posting more than 7 still earns 16 of 20. The audit counts feed posts, reels and carousels, not stories."],
    ["What if I do not know the follower count from 30 days ago?", "Leave it blank. Growth then scores a neutral 10 of 20 so the total is not skewed. Note today's count and run the audit again in a month for a real figure."],
    ["Does losing followers score zero for growth?", "Not quite. Points fall to zero at a 2% loss over 30 days. A small dip, under 2%, still earns a few points, and flat growth earns about 6."],
    ["Can a brand use this to vet an influencer?", "Yes, as a first pass. Pair it with the checklist in <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">how to vet a creator before you pay</a>, and ask the creator for reach and audience screenshots."],
    ["Is the Instagram audit tool free?", "Yes. No sign-up, no login and no limit. Nothing you enter is stored."],
  ],
};
