// Guide and FAQ for /creator-tools/instagram-follower-to-following-ratio/. Merged into tools.js by build-tools.js.
// Labels match ratioLabel() and COMPUTE["instagram-follower-to-following-ratio"] in public/shared.js:
// ratio = followers / following; 10+ Established creator, 2 to 10 Growing account, 1 to 2 Balanced, under 1 Follow-back pattern.
module.exports = {
  seoTitle: "Instagram Follower to Following Ratio Calculator | Passive Array",
  seoDescription: "Work out any Instagram account's follower to following ratio and what it says about how the account grew. Free, no sign-up, from two numbers you type in.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to calculate the Instagram follower to following ratio",
      p: [
        "Open the profile and copy the two numbers under the name: <b>Followers</b> and <b>Following</b>. Type them in above. Instagram has no free public API for these figures, so the tool works only from what you enter. Nothing is looked up and nothing is stored.",
        "The formula is one division: <b>ratio = followers / following</b>. An account with 12,000 followers that follows 600 people has a ratio of 20 : 1. It gets 20 followers for every account it follows.",
        "If the following count is 0, there is nothing to divide by, so the ratio shows n/a and the reading says the account follows no one.",
      ],
    },
    {
      h: "What is a good follower to following ratio?",
      p: ["The tool puts every result into one of four bands:"],
      table: {
        head: ["Ratio", "Label", "What it usually means"],
        rows: [
          ["10 or more", "Established creator", "People follow the account for its content, not because it followed them first."],
          ["2 to under 10", "Growing account", "Healthy for an account still building an audience."],
          ["1 to under 2", "Balanced", "Normal for a personal account that follows friends back."],
          ["Under 1", "Follow-back pattern", "Follows more accounts than follow it. Common for new accounts and for follow-for-follow growth."],
        ],
      },
      after: [
        "There is no single \"good\" ratio. A personal account at 1 : 1 is perfectly normal. The ratio matters most when you are judging a creator for a brand deal, where a low ratio on a large account is worth a closer look.",
      ],
    },
    {
      h: "What the ratio cannot tell you",
      list: [
        "<b>It is not proof of fake followers.</b> Bought followers do not follow anyone back, so they can push the ratio up, not down. Use the <a href=\"../instagram-fake-follower-checker/\">fake follower checker</a> for a fuller check, and read <a href=\"../../blog/how-to-spot-fake-followers/\">how to spot fake followers</a>.",
        "<b>It says nothing about engagement.</b> An account with a ratio of 50 can still have an audience that never likes or comments. Pair it with the <a href=\"../instagram-engagement-rate-calculator/\">engagement rate calculator</a>.",
        "<b>Accounts unfollow in waves.</b> Someone who followed thousands of accounts to grow, then unfollowed them, can show a high ratio today. Watch for a high ratio alongside very low likes.",
      ],
      after: ["To see the ratio next to engagement and like rate for several accounts at once, use <a href=\"../instagram-account-comparison/\">compare Instagram accounts</a>."],
    },
  ],
  faq: [
    ["What does a follower to following ratio under 1 mean?", "The account follows more people than follow it. That is normal for a new account. On an account with tens of thousands of followers, it often points to follow-for-follow growth, where accounts follow others hoping to be followed back."],
    ["Does following a lot of people hurt my Instagram account?", "The ratio itself is not something Instagram publishes as a ranking signal, so we do not claim it is. It matters more to people: brands and visitors read a low ratio as a sign the audience was traded rather than earned."],
    ["Can I check someone else's ratio?", "Yes. Both numbers are public on any profile you can view. Type them in and the tool does the rest. It does not log in to Instagram or contact the account."],
    ["Does this tool work for X (Twitter) too?", "The same formula and bands are used on the <a href=\"../x-follower-to-following-ratio/\">X follower to following ratio</a> tool."],
    ["Is the follower to following ratio calculator free?", "Yes. No sign-up and no limits. The calculation runs in your browser."],
  ],
};
