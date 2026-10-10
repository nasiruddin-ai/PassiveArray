// Guide and FAQ for /creator-tools/tiktok-likes-to-followers-ratio/. Merged into tools.js by build-tools.js.
// Numbers match COMPUTE["tiktok-likes-to-followers-ratio"] in public/shared.js:
// ratio = total likes / followers; 40+ viral history, 10-40 healthy, 5-10 average, under 5 low.
module.exports = {
  seoTitle: "TikTok Likes to Followers Ratio Calculator | Passive Array",
  seoDescription: "Divide a TikTok profile's total likes by its followers to see if the account earns its audience. Free, no sign-up, with a plain reading of the ratio.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What the TikTok likes to followers ratio tells you",
      p: [
        "Every TikTok profile shows two numbers at the top: followers and total likes across all videos. Divide one by the other and you get likes per follower:",
        "<b>Ratio = total likes / followers</b>",
        "TikTok has no free public API for this, so you type both numbers in from the profile. An account that grew by posting videos people like collects many likes for each follower. An account whose followers arrived some other way, such as being bought, has few.",
      ],
      table: {
        head: ["Likes per follower", "Label", "What it usually means"],
        rows: [
          ["40 or more", "Viral history", "One or more videos went viral far beyond the follower base"],
          ["10 to 40", "Healthy", "Followers watch and like consistently"],
          ["5 to 10", "Average", "Normal for a newer or slower-posting account"],
          ["Under 5", "Low", "Followers are not engaging with videos"],
        ],
      },
      after: ["Example: 50,000 followers and 1.2 million total likes is 24 likes per follower, in the healthy range."],
    },
    {
      h: "When the ratio misleads",
      list: [
        "<b>It adds up the whole history.</b> Total likes build up over the life of the account. An account that was popular years ago keeps a high ratio even if its recent videos get little.",
        "<b>New accounts read low.</b> With only a few videos, there has not been time to build up likes. Judge them on recent videos instead.",
        "<b>Viral hits read high.</b> One video with millions of likes can push the ratio far above 40. That is real, but it tells you little about the next video.",
      ],
      after: [
        "So use the ratio as a quick first check, then look at recent videos. The <a href=\"../tiktok-engagement-rate-calculator/\">TikTok engagement rate calculator</a> measures the last 12 videos by views. If the ratio is under 5, run the <a href=\"../tiktok-fake-follower-checker/\">fake follower estimator</a>, which adds points when total likes fall under 3 per follower. Our <a href=\"../../blog/how-to-spot-fake-followers/\">guide to spotting fake followers</a> explains the other signs.",
      ],
    },
  ],
  faq: [
    ["What is a good likes to followers ratio on TikTok?", "10 to 40 likes per follower is the healthy range on this tool. Over 40 usually means at least one viral video. Under 5 suggests followers who do not engage."],
    ["Where do I find total likes on TikTok?", "On the profile page, next to Following and Followers. It is the total of likes across every video the account has posted."],
    ["Why does my account have more likes than followers?", "That is normal. TikTok shows videos to people who do not follow you, and many of them like without following. Most active accounts have far more likes than followers."],
    ["Does a low ratio mean fake followers?", "Not on its own. It can also mean a new account, an account that posts rarely, or followers who arrived from one video. Treat it as a reason to look closer."],
    ["Is this calculator free?", "Yes. It is free with no sign-up, and the maths runs in your browser."],
  ],
};
