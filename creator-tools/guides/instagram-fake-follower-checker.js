// Guide and FAQ for /creator-tools/instagram-fake-follower-checker/. Merged into tools.js by build-tools.js.
// Points match igFakeScore() and fakeBand() in public/shared.js:
// ER < 40% of tier avg (1,000+ followers) +35, else < 70% +15; comments < 0.3% of likes +15;
// comments > 20% of likes on 5,000+ followers +5; following > followers on 10,000+ followers +15,
// else following > 2x followers +10; under 20 posts with 20,000+ followers +15;
// ER > 3x tier avg with comments < 0.5% of likes +10. Score capped 0-100.
// Bands: < 20 "0 to 10% fake", < 45 "10 to 25%", < 70 "25 to 45%", else "45%+".
module.exports = {
  seoTitle: "Instagram Fake Follower Checker: Free Estimate | Passive Array",
  seoDescription: "Check an Instagram account for fake followers from the numbers on its profile. Get a suspicion score, an estimated fake share and the red flags behind it. Free.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How this Instagram fake follower checker works",
      p: [
        "You type five numbers you can see on any public profile: followers, following, posts, and average likes and comments on recent posts. The checker compares them with what a real audience of that size normally produces and adds points for each pattern that bought followers or likes tend to leave behind.",
        "The result is a <b>suspicion score from 0 to 100</b>, an <b>estimated fake follower share</b>, the account's engagement rate next to the typical rate for its size, its follower to following ratio, and a list of every red flag with the points it added.",
        "Instagram has no free public API that lets an outside site read an account's follower list. So no free web tool can inspect every follower. This one is honest about that: it is an estimate from public numbers, not a follower-by-follower audit.",
      ],
    },
    {
      h: "The red flags it checks, and how many points each adds",
      table: {
        head: ["Signal", "Points"],
        rows: [
          ["Engagement under 40% of the typical rate for the account's size (1,000+ followers)", "35"],
          ["Engagement under 70% of the typical rate (when the flag above does not apply)", "15"],
          ["Comments under 0.3% of likes", "15"],
          ["Comments over 20% of likes, on an account with more than 5,000 followers", "5"],
          ["Follows more accounts than follow it, with more than 10,000 followers", "15"],
          ["Following more than double the follower count (when the flag above does not apply)", "10"],
          ["Fewer than 20 posts with more than 20,000 followers", "15"],
          ["Engagement over 3 times typical with comments under 0.5% of likes", "10"],
        ],
      },
      after: [
        "The typical rates come from the same tiers as the <a href=\"../instagram-engagement-rate-benchmark/\">engagement benchmark</a>: 4.0% under 10K followers, 2.0% to 100K, 1.4% to 500K, 1.1% to 1M and 0.8% above. Low engagement is weighted most because bought followers do not like or comment. High comments relative to likes is a small flag, because it can mean spam or bot comments rather than a fake audience.",
      ],
    },
    {
      h: "What the suspicion score means",
      table: {
        head: ["Score", "Estimated fake followers", "Reading"],
        rows: [
          ["0 to 19", "0 to 10%", "Healthy"],
          ["20 to 44", "10 to 25%", "Some concerns"],
          ["45 to 69", "25 to 45%", "Suspicious"],
          ["70 to 100", "45% or more", "Very suspicious"],
        ],
      },
      after: [
        "Example: an account with 80,000 followers, 95,000 following, 15 posts, and posts averaging 500 likes and 1 comment. Its engagement rate is about 0.63%, under 40% of the 2.0% typical for its size (35 points). Comments are 0.2% of likes (15). It follows more than follow it at over 10,000 followers (15). And it has under 20 posts for over 20,000 followers (15). Total 80: very suspicious, an estimated 45% or more fake.",
        "Every account has some inactive or bot followers. A Healthy result does not mean zero; it means the numbers look like a real audience.",
      ],
    },
    {
      h: "How to check fake followers on Instagram by hand",
      p: ["The score tells you where to look. These checks, done in the Instagram app, confirm it:"],
      ordered: true,
      list: [
        "<b>Open the follower list</b> from the profile and scroll through a few dozen recent followers. Empty profiles, no posts, no profile picture and random-string usernames are the usual signs.",
        "<b>Read twenty comments</b> on recent posts. Generic emoji and \"nice post\" from empty accounts point to pods or bots. Real audiences ask questions and refer to earlier posts.",
        "<b>Check growth over time.</b> Note the follower count today and again in a week. A jump of thousands with no viral post to explain it is a warning sign. Passive Array does not store lookups, so write the number down.",
        "<b>Ask the creator</b> for screenshots of their insights: reach on recent posts and audience countries. These come from the Professional dashboard on creator and business accounts, and only the owner can see them.",
      ],
      after: ["Our article on <a href=\"../../blog/how-to-spot-fake-followers/\">how to spot fake followers</a> walks through all seven signals, and <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">how to vet a creator before you pay</a> turns them into a ten-minute checklist."],
    },
    {
      h: "Where to find the numbers, and the checker's limits",
      list: [
        "<b>Followers, following and posts</b> are at the top of every profile. Large counts are rounded, so use the closest figure you can.",
        "<b>Average likes and comments</b>: open the last 12 posts, add up each count and divide by the number of posts. Leave out ads and giveaways.",
        "<b>Hidden likes</b>: if the account hides like counts, you cannot fill in that field honestly. Ask for an insights screenshot instead of guessing.",
        "<b>Accounts under 1,000 followers</b> never get the engagement flags, because rates on very small accounts swing too much to judge.",
        "<b>A clean score is not proof.</b> Engagement pods and bought comments can produce numbers that look normal. Pair the score with the manual checks above.",
      ],
      after: ["For a fuller picture of the same account, the <a href=\"../instagram-audit/\">Instagram account audit</a> turns this suspicion score into an authenticity score and adds engagement, growth and posting pace."],
    },
  ],
  faq: [
    ["How can I check if an Instagram account has fake followers for free?", "Type the numbers from the profile into this checker: followers, following, posts and average likes and comments. It scores them for the patterns bought followers leave. Then open the follower list and read some comments to confirm."],
    ["How accurate is this fake follower checker?", "It is an estimate from public numbers. It catches the common patterns, such as engagement far below the account's size or likes with almost no comments. It cannot inspect individual followers, so treat a high score as a reason to look closer, not as proof."],
    ["What percentage of fake followers is normal?", "Most accounts have some inactive or bot followers. The checker reads a score under 20 as an estimated 0 to 10% fake, which it labels Healthy."],
    ["Why is low engagement a sign of fake followers?", "Bought followers do not like or comment. The more of them an account has, the further its engagement rate falls below the typical rate for its size. Under 40% of typical adds the most points."],
    ["Can you see who bought Instagram followers?", "Not directly. No outside tool can see purchases. You can only see the patterns in the numbers and the follower list that purchases tend to leave."],
    ["Does Instagram remove fake followers?", "Instagram does remove accounts it identifies as fake, which is why some accounts see sudden drops. When and how it does this is not public."],
    ["Does it work for TikTok?", "Use the <a href=\"../tiktok-fake-follower-checker/\">TikTok fake follower checker</a>, which uses TikTok's own engagement tiers."],
    ["Is the Instagram fake follower checker free?", "Yes. No sign-up and no login. You never need to share a password, and nothing you enter is stored."],
  ],
};
