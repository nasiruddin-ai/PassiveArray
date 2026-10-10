// Guide and FAQ for /creator-tools/instagram-account-comparison/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["instagram-account-comparison"], manualCompare(), compareTable() and igER() in public/shared.js:
// highest value leads on every row except Following (no leader); ties mark no leader; Account C appears only when filled in.
module.exports = {
  seoTitle: "Compare Instagram Accounts Side by Side | Passive Array",
  seoDescription: "Compare two or three Instagram accounts side by side on followers, ratio, engagement rate, like rate and comments. Free, no sign-up, from numbers you type.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to compare Instagram accounts",
      ordered: true,
      list: [
        "Open each profile and note the followers, following and post count shown under the name.",
        "Work out the average likes and average comments over the last 12 posts. Leave out any post that was clearly boosted.",
        "Type the numbers in for Account A and Account B. Add Account C only if you need it; it appears in the table once you fill in any of its fields.",
        "Add each @username so the columns are labelled. If you leave it blank, the column is called Account A, B or C.",
      ],
      after: ["Instagram has no free public API for these numbers, so the tool cannot fetch them. It compares exactly what you enter, and nothing leaves your browser."],
    },
    {
      h: "What the comparison table shows",
      table: {
        head: ["Row", "How it is worked out"],
        rows: [
          ["Followers, following, posts", "As typed"],
          ["Follower to following ratio", "Followers / following"],
          ["Average likes, average comments", "As typed"],
          ["Engagement rate", "(Average likes + average comments) / followers x 100"],
          ["Like rate", "Average likes / followers x 100"],
          ["Comments per 100 likes", "Average comments / average likes x 100"],
        ],
      },
      after: [
        "On each row the highest value is shown in green as the leader. Following is the exception: it gets no leader, because following more people is not better or worse on its own. If two accounts tie for the top, no leader is marked on that row.",
        "There is no overall winner. A brand that wants reach may care most about followers, while one that wants conversation may care most about comments per 100 likes.",
      ],
    },
    {
      h: "How to read the result fairly",
      list: [
        "<b>Compare like with like.</b> Engagement rate falls as accounts grow, so a 50,000-follower account will usually trail a 5,000-follower one. Check each against its own tier with the <a href=\"../instagram-engagement-rate-benchmark/\">engagement rate benchmark</a>.",
        "<b>Watch comments per 100 likes.</b> Very few comments for the likes can point to bought likes. Run a doubtful account through the <a href=\"../instagram-fake-follower-checker/\">fake follower checker</a>.",
        "<b>Use the same window for everyone.</b> Averages over the last 12 posts for one account and the last 3 for another are not comparable.",
      ],
      after: ["For a single account in more depth, the <a href=\"../instagram-audit/\">Instagram audit</a> scores it from 0 to 100."],
    },
  ],
  faq: [
    ["Can I compare more than three Instagram accounts?", "Not in one table. Compare three, note the leader on the rows that matter to you, then swap the weaker accounts out."],
    ["Why doesn't the tool fetch the numbers for me?", "Instagram does not offer a free public API for follower counts and post stats. Rather than scrape profiles, the tool works from numbers you copy in."],
    ["Which row matters most when choosing an influencer?", "Usually engagement rate, checked against the account's size. Followers alone tell you little. For pricing, the <a href=\"../instagram-pricing-calculator/\">Instagram pricing calculator</a> turns followers and engagement into a rate."],
    ["Is comments per 100 likes the same as comment rate?", "Yes. It is the number of comments for every 100 likes. A higher figure means more of the people who liked a post also wrote something."],
    ["Is the Instagram account comparison tool free?", "Yes. No sign-up and no limits."],
  ],
};
