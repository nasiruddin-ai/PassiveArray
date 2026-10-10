// Guide and FAQ for /creator-tools/tiktok-fake-follower-checker/. Merged into tools.js by build-tools.js.
// Numbers match ttFakeScore(), fakeOut() and fakeBand() in public/shared.js:
// views/followers < 5% +35, else < 15% +15 (both need 1,000+ followers); total likes/follower < 3 +20 (1,000+ followers);
// comments < 0.5% of likes +15; likes < 2% of views +10; likes > 40% of views +10. Bands: <20, <45, <70, 70+.
// Shares are collected by the shared form but not used in the score.
module.exports = {
  seoTitle: "TikTok Fake Follower Checker: Free Estimate | Passive Array",
  seoDescription: "Check a TikTok account for fake followers from its public numbers. Free, no sign-up: get a suspicion score out of 100 with every red flag explained.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this TikTok fake follower checker does",
      p: [
        "Bought followers do not watch videos. So the checker asks one question: do the views and engagement match the follower count? TikTok has no free public API for this data, so you type in the numbers from the profile:",
      ],
      list: [
        "<b>Followers</b> and <b>total likes</b>, both shown at the top of every profile.",
        "<b>Average views, likes and comments per video</b>, from the last 12 videos.",
      ],
      after: [
        "You get an estimated share of fake followers, a suspicion score out of 100, every red flag that added to it, and supporting figures: the engagement rate, the typical rate for the account's size, views per follower and total likes per follower.",
        "The form also asks for shares, because it is shared with other TikTok tools. Shares do not change the suspicion score.",
      ],
    },
    {
      h: "How the suspicion score is worked out",
      p: ["Each warning sign adds points. The score is the total, capped at 100."],
      table: {
        head: ["Red flag", "Points"],
        rows: [
          ["Average views under 5% of followers", "+35"],
          ["Average views 5% to 15% of followers (instead of the flag above)", "+15"],
          ["Total likes under 3 per follower", "+20"],
          ["Comments under 0.5% of likes", "+15"],
          ["Likes under 2% of views", "+10"],
          ["Likes over 40% of views", "+10"],
        ],
      },
      after: [
        "The view and total-likes checks only apply to accounts with 1,000 followers or more. Below that, the numbers are too small to judge.",
        "Low views carry the most weight because it is the strongest signal on TikTok. Real followers see at least some of an account's videos. When average views are a tiny fraction of followers, most of those followers are not there. Comments under 0.5% of likes point to bought likes, since likes are cheap to buy and comments are not. A like rate above 40% of views is abnormal for real viewers and points the same way.",
      ],
    },
    {
      h: "How to read the result",
      table: {
        head: ["Suspicion score", "Estimated fake followers", "Read as"],
        rows: [
          ["Under 20", "0 to 10%", "Healthy"],
          ["20 to 44", "10 to 25%", "Some concerns"],
          ["45 to 69", "25 to 45%", "Suspicious"],
          ["70 and up", "45% or more", "Very suspicious"],
        ],
      },
      after: [
        "Healthy does not mean zero. Every public account picks up some bot followers it never asked for.",
        "Here is an example. An account has 200,000 followers and 400,000 total likes. Its last 12 videos average 6,000 views, 600 likes and 2 comments. Views are 3% of followers (+35). Total likes are 2 per follower (+20). Comments are 0.33% of likes (+15). The like rate of 10% of views is normal, so it adds nothing. The score is 70: Very suspicious, an estimated 45% or more fake.",
        "Now the form's placeholder numbers: 50,000 followers, 1.2 million total likes, 30,000 average views, 2,500 likes and 60 comments. Views are 60% of followers, there are 24 likes per follower, and comments are 2.4% of likes. No flags, so the score is 0: Healthy.",
      ],
    },
    {
      h: "Why a real account can still score badly",
      p: ["The checker sees only a few public numbers. Some honest accounts trip the flags:"],
      list: [
        "<b>An account that has gone quiet.</b> Followers gathered years ago drift away, so views fall well below the follower count without any purchase.",
        "<b>A single viral video.</b> One hit can bring a wave of followers who never watch again. Views then lag behind followers.",
        "<b>A change of topic.</b> When a creator switches niche, much of the old audience stops watching.",
        "<b>Very few comments by style.</b> Some formats, such as music or ambient clips, get likes but few comments.",
      ],
      after: ["So a high score is a reason to look closer, not proof. The full picture of the signals, on TikTok and Instagram, is in our guide on <a href=\"../../blog/how-to-spot-fake-followers/\">how to spot fake followers</a>."],
    },
    {
      h: "What to do after you check an account",
      ordered: true,
      list: [
        "<b>Under 20:</b> move on to fit and price. The <a href=\"../tiktok-pricing-calculator/\">TikTok pricing calculator</a> gives a fair range from views.",
        "<b>20 to 44:</b> ask the creator for a screenshot of their analytics, including recent video views and audience countries. Honest creators share these without fuss.",
        "<b>45 or more:</b> open a few dozen recent followers. Empty profiles, no videos and random-string usernames confirm what the numbers suggest. If you still go ahead, price on real views and add a performance clause.",
        "<b>Check again later.</b> Note the follower count and look again in a week. A jump of thousands with no viral video to explain it is a warning sign.",
      ],
      after: ["For a wider view, the <a href=\"../tiktok-audit/\">TikTok account audit</a> uses this same suspicion score as its authenticity part, alongside engagement, reach and growth. Checking an Instagram account instead? Use the <a href=\"../instagram-fake-follower-checker/\">Instagram fake follower checker</a>."],
    },
  ],
  faq: [
    ["How can I tell if a TikTok account has fake followers?", "Compare average views with followers. If videos reach under 5% of the follower count, most followers are probably not real or not active. Few total likes per follower and very few comments compared with likes add to the case."],
    ["Is this TikTok fake follower checker accurate?", "It is an estimate from public numbers, not a count. It catches the patterns bought followers usually leave, but only a review of the follower list can confirm them. Use it to decide which accounts need a closer look."],
    ["What is a normal views to followers ratio on TikTok?", "The checker treats 15% to 50% of followers as the typical range for average views. Under 15% adds a small flag and under 5% adds the biggest one. Many healthy accounts sit above 50%, because the For You page reaches non-followers."],
    ["What does a suspicion score of 45 mean?", "It falls in the Suspicious band, an estimated 25% to 45% fake followers. At least two warning signs are present. Ask for analytics before you agree a deal."],
    ["Can an account with real followers get a high score?", "Yes. An account that has stopped growing, changed topic or had one viral hit can show low views for its size. The score flags the pattern, not the cause."],
    ["Does the checker see the follower list?", "No. TikTok has no free public API for follower lists, so the tool works only from the numbers you type in. Nothing is stored."],
    ["Do I need the creator's login or permission?", "No. Every number the checker uses is shown on the public profile and on each video."],
    ["Is the TikTok fake follower checker free?", "Yes. It is free with no sign-up and no limit."],
  ],
};
