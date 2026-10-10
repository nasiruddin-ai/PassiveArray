// Guide and FAQ for /creator-tools/instagram-hashtag-generator/. Merged into tools.js by build-tools.js.
// Matches hashtagsLocal() / hashtagsOut() in public/shared.js and the "hashtags" prompt in api/creator-ai.js:
// set size 10, 15 (default) or 20; broad = max(2, round(count x 0.2)), niche = max(3, round(count x 0.3)), mid = rest;
// "Your 5" = 1 broad + 2 medium + 2 niche, topped up from the rest if a size is short; copy button copies only the 5;
// the remaining tags are spares. 20 niche pools (unknown niche falls back to lifestyle); AI only with a server key.
// Instagram's 5-hashtag limit (caption and comments together) took effect December 2025.
module.exports = {
  seoTitle: "Instagram Hashtag Generator: Your Best 5 Tags | Passive Array",
  seoDescription: "Instagram now allows 5 hashtags per post. Get a balanced five for your topic, 1 broad, 2 medium and 2 niche, plus spare tags to rotate. Free, no sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this Instagram hashtag generator gives you",
      p: [
        "Type the post topic, pick a niche from the list of 20 and choose how many spares you want. The result leads with <b>Your 5 for this post</b>: one broad tag, two medium and two niche. The copy button copies only those five, ready to paste into your caption.",
        "Under them you get spare tags, colour-coded by size. They are not for this post. They are for your next posts, so you can rotate tags instead of pasting the same five every time.",
      ],
      table: {
        head: ["Option", "Whole set", "Broad", "Medium", "Niche"],
        rows: [
          ["5 to use + 5 spare", "10", "2", "5", "3"],
          ["5 to use + 10 spare (default)", "15", "3", "7", "5"],
          ["5 to use + 15 spare", "20", "4", "10", "6"],
        ],
      },
      after: ["The counts are for the whole set, your five included. If a size runs short, the five are topped up from the other tags, and the line above the tags shows the actual split."],
    },
    {
      h: "How many hashtags can you use on Instagram?",
      p: [
        "Five. Since December 2025, Instagram allows at most 5 hashtags on a post or Reel, and it counts the caption and the comments together. Extra tags are blocked or removed, so the old habit of adding more in the first comment no longer works.",
        "That is the rule as of October 2026. Instagram changes its limits from time to time, so if the app stops you at a different number, follow the app.",
        "With only five slots, every tag has to describe the post. The <a href=\"../instagram-caption-analyzer/\">caption analyzer</a> counts the hashtags in a caption before you post, so you can check you are within the limit.",
      ],
    },
    {
      h: "How to choose your five hashtags",
      p: ["The generator's default five follow one simple shape. Here is what each slot does, with fitness as the example:"],
      table: {
        head: ["Slot", "Example (fitness)", "What it does"],
        rows: [
          ["1 broad", "#fitness", "Huge and fast-moving. Tells Instagram the general topic. A post rarely stays visible there for long."],
          ["2 medium", "#homeworkout, #fitnessjourney", "Busy enough to bring new viewers, quiet enough to stay visible for a while."],
          ["2 niche", "#beginnerstrengthtraining, #runningforbeginners", "Small and specific. Fewer viewers, but the ones who search them are exactly your audience."],
        ],
      },
      after: [
        "Swap a tag out if it does not describe this exact post. A spare of the same size is usually the best replacement. Smaller accounts tend to get the most from the medium and niche slots, so if you change the shape, trade the broad tag for another specific one rather than the other way round.",
      ],
    },
    {
      h: "How the hashtags are built",
      ordered: true,
      list: [
        "<b>Your topic words.</b> Short filler words such as \"the\", \"and\" and \"how\" are dropped. The rest become tags on their own, joined together, and with common endings such as tips, ideas, forbeginners and routine.",
        "<b>A curated pool for the niche.</b> Each of the 20 niches, from beauty to web design, has its own list of broad, medium and niche tags.",
        "<b>The mix.</b> The whole set is about 20% broad, 50% medium and 30% niche, with duplicates removed. Then the five are picked from it: one broad, two medium, two niche.",
      ],
      after: [
        "When the site has an AI key set up, AI writes the set instead. It is told that Instagram allows only 5 tags, so it keeps them specific to the topic. The note under the result says which version you got.",
        "Neither version checks live post counts. Instagram has no free public API for hashtag data, so the sizes are a guide, not a measurement. Tap a tag in the app to see how busy it is before you rely on it.",
      ],
    },
    {
      h: "Why rotating your spare hashtags helps",
      list: [
        "<b>Each post gets tags that fit it.</b> Posts on the same theme still differ. Picking from spares lets you match the five to each post instead of reusing one block.",
        "<b>You learn which tags work.</b> Change one or two tags at a time and compare. On a professional account, each post's insights show how people found it. As of October 2026 you open them with <b>View insights</b> under the post.",
        "<b>You avoid a copy-paste pattern.</b> The same five tags on every post look automated and tell Instagram nothing new about each post.",
        "<b>Make the topic specific.</b> \"Morning skincare routine for oily skin\" gives better tags and better spares than \"skincare\".",
      ],
      after: ["Short of post ideas to tag? The <a href=\"../instagram-content-ideas-generator/\">Instagram content ideas generator</a> gives you twelve, and the <a href=\"../instagram-engagement-rate-calculator/\">engagement rate calculator</a> shows whether the posts are landing."],
    },
  ],
  faq: [
    ["How many hashtags are allowed on Instagram?", "Five per post or Reel, since December 2025, with the caption and comments counted together. Extra tags are blocked or removed. Check the app if the limit changes again."],
    ["Can I put more hashtags in the first comment?", "No. Instagram counts hashtags in the caption and the comments together, so the 5-tag limit covers both."],
    ["Which five hashtags should I use?", "A balanced five works for most posts: one broad tag for the topic, two medium tags and two niche tags that describe the post exactly. That is the set the generator copies for you."],
    ["What are the spare hashtags for?", "Later posts. Swap them in so each post gets the five that fit it best, and so you can see which tags bring viewers."],
    ["Do hashtags still work on Instagram?", "They help Instagram understand what a post is about and let people browse a topic, but content and engagement matter more for reach. With only five slots, choose tags that describe the post exactly."],
    ["Are these hashtags banned or restricted?", "The generator does not check. Instagram restricts some tags from time to time. Tap a tag in the app before using it; if recent posts do not show, use a spare instead."],
    ["Is the generator AI?", "It can be. When the site has an AI key set up, the tags are written by AI. Otherwise it builds them from your topic and a curated list for your niche. The note under the result tells you which."],
    ["Is the Instagram hashtag generator free?", "Yes. No sign-up, no login and no limit."],
  ],
};
