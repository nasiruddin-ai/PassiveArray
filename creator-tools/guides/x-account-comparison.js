// Guide and FAQ for /creator-tools/x-account-comparison/. Merged into tools.js by build-tools.js.
// Metrics match COMPUTE["x-account-comparison"], manualCompare() and compareTable() in public/shared.js.
// Following and Posts rows mark no leader (lead: false); every other row marks the highest value; ties get none.
module.exports = {
  seoTitle: "Compare X (Twitter) Accounts Side by Side, Free | Passive Array",
  seoDescription: "Compare two or three X (Twitter) accounts on followers, ratio, engagement rate and reposts per 1,000 followers. Free, no sign-up, leader marked per row.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to compare X accounts",
      ordered: true,
      list: [
        "Open each profile and note followers, following and the post count.",
        "Look at recent posts and average the likes, reposts and replies. Skip pinned posts and one-off viral hits. X has no free public API for these numbers, so you type them in.",
        "Fill in Account A and Account B. Account C is optional.",
        "Press compare. The leader on each row is shown in green.",
      ],
    },
    {
      h: "What each row means",
      table: {
        head: ["Row", "How it is worked out", "Leader marked?"],
        rows: [
          ["Followers", "As entered", "Yes, highest"],
          ["Following", "As entered", "No"],
          ["Follower to following ratio", "Followers / following", "Yes, highest"],
          ["Posts", "As entered", "No"],
          ["Engagement rate", "(likes + reposts + replies) / followers x 100", "Yes, highest"],
          ["Reposts per 1,000 followers", "Reposts / followers x 1,000", "Yes, highest"],
          ["Replies per 100 likes", "Replies / likes x 100", "Yes, highest"],
        ],
      },
      after: [
        "Following and post counts get no leader, because more is not better or worse on its own. When two accounts tie for the top of a row, no leader is marked.",
        "Reposts get their own row because reposting is how a post reaches people beyond the account's followers on X. Replies per 100 likes shows whether readers talk back or just tap like.",
      ],
    },
    {
      h: "Reading the comparison",
      p: [
        "The biggest account will usually lead on followers and lose on engagement rate, because the rate is divided by followers. That is normal. Look for the account that leads on engagement rate and reposts per 1,000 followers: its posts move people. A high follower to following ratio with weak engagement deserves a closer look, and our <a href=\"../../blog/how-to-spot-fake-followers/\">guide to spotting fake followers</a> explains why. For the ratio alone, with a plain reading, use the <a href=\"../x-follower-to-following-ratio/\">X follower to following ratio</a> tool. Comparing creators across platforms? Try <a href=\"../tiktok-account-comparison/\">compare TikTok accounts</a> or <a href=\"../instagram-account-comparison/\">compare Instagram accounts</a>.",
      ],
    },
  ],
  faq: [
    ["How is engagement rate calculated on X?", "This tool adds average likes, reposts and replies per post, divides by followers and multiplies by 100. Views are not part of this formula."],
    ["Why does the bigger account have a lower engagement rate?", "The rate is divided by followers. As an account grows, a smaller share of its followers sees and reacts to each post, so the rate usually falls."],
    ["Where do I find average likes, reposts and replies on X?", "Each post shows its counts underneath. Add up the counts on an account's recent posts, leaving out pinned posts and replies to others, then divide each total by the number of posts. Use the same number of posts for every account you compare."],
    ["Can I compare more than three X accounts?", "Not at once. Compare in groups of three and carry the leaders forward."],
    ["Is comparing X accounts free, and is anything stored?", "It is free with no sign-up and no limit. The maths runs in your browser and nothing is saved."],
  ],
};
