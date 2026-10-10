// Guide and FAQ for /creator-tools/instagram-likes-to-followers-ratio/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["instagram-likes-to-followers-ratio"], IG_TIERS, tier() and grade() in public/shared.js:
// like rate = likes / followers x 100; benchmark = tier engagement average x 0.92; grade bands 0.5 / 0.85 / 1.25 / 1.6.
module.exports = {
  seoTitle: "Instagram Likes to Followers Ratio Calculator | Passive Array",
  seoDescription: "Find what share of an Instagram account's followers like a typical post, graded against accounts of the same size. Free, no sign-up, from two numbers.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to work out the Instagram likes to followers ratio",
      p: [
        "You need two numbers: the follower count and the average likes per post. Instagram has no free public API for these, so you type them in. For the average, add up the likes on the last 12 posts and divide by 12. Skip any post that was boosted with ads.",
        "The tool then works out <b>like rate = average likes / followers x 100</b>. An account with 40,000 followers averaging 1,200 likes has a like rate of 3%. It also shows followers per like, which is the same thing turned around: 33.3 followers for every like.",
      ],
    },
    {
      h: "What is a good likes to followers ratio on Instagram?",
      p: [
        "It depends on account size. Bigger accounts get a smaller share of their audience to like each post, so the tool compares you only with accounts in your own tier. The benchmark is the tier's typical engagement rate times 0.92, because likes usually make up about 92% of likes plus comments.",
      ],
      table: {
        head: ["Tier", "Followers", "Typical like rate"],
        rows: [
          ["Nano", "Under 10K", "3.7%"],
          ["Micro", "10K to 100K", "1.8%"],
          ["Mid", "100K to 500K", "1.3%"],
          ["Macro", "500K to 1M", "1.0%"],
          ["Mega", "Over 1M", "0.7%"],
        ],
      },
      after: [
        "Your grade comes from how your rate compares with that typical figure. Under half of it is <b>Low</b>. Half to 85% is <b>Below average</b>. 85% to 125% is <b>Average</b>. 125% to 160% is <b>Good</b>, and anything above is <b>Excellent</b>.",
        "These are Passive Array's working benchmarks, not figures Instagram publishes. The full reasoning is in <a href=\"../../blog/instagram-engagement-rate-by-follower-count/\">Instagram engagement rate by follower count</a>.",
      ],
    },
    {
      h: "When to use like rate instead of engagement rate",
      p: [
        "Like rate is the quick check. Use it when you only have likes to go on, or when comments are turned off. When you have comments too, the <a href=\"../instagram-engagement-rate-calculator/\">engagement rate calculator</a> gives a fuller picture, and the <a href=\"../instagram-engagement-rate-benchmark/\">engagement rate benchmark</a> shows every tier at once.",
        "A very high like rate with almost no comments is worth a second look. It can mean bought likes. Our guide on <a href=\"../../blog/how-to-spot-fake-followers/\">spotting fake followers</a> covers that pattern.",
      ],
    },
  ],
  faq: [
    ["What is a good like rate for 10,000 followers?", "At exactly 10,000 followers an account moves into the micro tier, where the typical like rate is about 1.8%, or roughly 180 likes per post. Around 2.3% or more grades as Good."],
    ["Why is my like rate lower now that I have more followers?", "That is normal. As an account grows, a smaller share of the audience sees and likes each post. That is why the tool grades you against your own tier, not one fixed number."],
    ["What if the account hides its like counts?", "Then you cannot see the likes, and the ratio cannot be worked out from outside. If it is a creator you want to work with, ask for a screenshot of their post insights."],
    ["Does this include reels?", "It uses whatever average you type in. If an account mixes reels and photos, average the last 12 posts of any kind, or work out each type on its own to compare them."],
    ["Is the likes to followers ratio calculator free?", "Yes. No sign-up, no limits, and the numbers you type stay in your browser."],
  ],
};
