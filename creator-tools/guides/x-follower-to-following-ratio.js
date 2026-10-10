// Guide and FAQ for /creator-tools/x-follower-to-following-ratio/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["x-follower-to-following-ratio"] (shared with Instagram) and ratioLabel() in public/shared.js:
// ratio = followers / following; 10+ established creator, 2-10 growing account, 1-2 balanced, under 1 follow-back pattern.
module.exports = {
  seoTitle: "X Follower to Following Ratio Calculator, Free | Passive Array",
  seoDescription: "Work out the follower to following ratio of any X (Twitter) account and see what it signals. Free, no sign-up: enter two numbers for a plain reading.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What is a good follower to following ratio on X?",
      p: [
        "The ratio is followers divided by the number of accounts followed:",
        "<b>Ratio = followers / following</b>",
        "X has no free public API for these counts, so you type in the two numbers shown on the profile. The calculator gives the ratio, a label and a one-line reading:",
      ],
      table: {
        head: ["Ratio", "Label", "Reading"],
        rows: [
          ["10 or more", "Established creator", "People follow this account for its content"],
          ["2 to 10", "Growing account", "Healthy for an account still growing"],
          ["1 to 2", "Balanced", "Normal for a personal account"],
          ["Under 1", "Follow-back pattern", "Follows more than it is followed; common for new accounts or follow-for-follow growth"],
        ],
      },
      after: [
        "Example: 18,000 followers and 900 following is a ratio of 20 : 1, an established creator. If following is 0, there is nothing to divide by and the ratio shows n/a and the reading says the account follows no one.",
      ],
    },
    {
      h: "How to use the ratio, and its limits",
      p: [
        "The ratio is a quick first impression, not a quality score. A low ratio is normal for someone who follows lots of people to learn from them. A high ratio can come from bought followers just as easily as from great posts.",
        "So pair it with engagement. Average the likes, reposts and replies on recent posts, then put the account next to others in <a href=\"../x-account-comparison/\">compare X accounts</a>, which also shows engagement rate and reposts per 1,000 followers. Checking Instagram as well? The <a href=\"../instagram-follower-to-following-ratio/\">Instagram follower to following ratio</a> uses the same bands. Our <a href=\"../../blog/how-to-spot-fake-followers/\">guide to spotting fake followers</a> covers the warning signs that numbers alone can show.",
        "The calculator is free with no sign-up, and the maths runs in your browser, so nothing you enter is stored.",
      ],
    },
  ],
  faq: [
    ["How do I calculate my follower to following ratio on X?", "Divide your followers by the number of accounts you follow. 5,000 followers and 1,000 following is a ratio of 5, which this tool labels a growing account."],
    ["Is a ratio under 1 bad on X?", "Not always. New accounts and people who follow widely to read their feed often sit under 1. It becomes a warning sign on large accounts, where it suggests follow-for-follow growth."],
    ["Does the follower to following ratio affect reach on X?", "X does not publish how its ranking uses this ratio. Treat it as a signal people read when they look at a profile, not as a ranking rule."],
    ["Should I unfollow accounts to improve my ratio?", "Only accounts you no longer want in your feed. Mass unfollowing lifts the number but not the quality of your audience, and people who check engagement will notice."],
    ["Does a high ratio mean an account is influential?", "Not by itself. It shows that many people chose to follow the account, but not whether they still read or react to its posts. Check average likes, reposts and replies on recent posts before you judge influence."],
  ],
};
