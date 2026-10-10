// Guide and FAQ for /creator-tools/instagram-caption-analyzer/. Merged into tools.js by build-tools.js.
// Every check matches COMPUTE["instagram-caption-analyzer"] in public/shared.js: 2,200 limit (Long over 1,500),
// first line 125, hashtags: tip at 0, warning over 5 (Instagram limit since December 2025), line-break tip when under 3 lines and over 40 words, emoji over 10,
// readability Easy at 12 words per sentence and 5 letters per word or fewer, Medium up to 20, Hard above.
module.exports = {
  seoTitle: "Instagram Caption Analyzer: Length, Hashtags, CTA | Passive Array",
  seoDescription: "Paste an Instagram caption to check its length, first line, hashtags, emoji, call to action and readability before you post. Free, no sign-up, in your browser.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What the Instagram caption analyzer checks",
      p: ["Paste the caption exactly as you will post it, hashtags included. The analyzer runs in your browser and checks:"],
      table: {
        head: ["Check", "What it looks for"],
        rows: [
          ["Length", "Characters out of 2,200. Over 1,500 is marked Long; over 2,200 is Too long."],
          ["First line", "Characters before the first line break, out of 125. Only about that much shows before \"more\"."],
          ["Hashtags", "Counts every #tag, shown out of 5. A warning above 5; a tip to add 3 to 5 when there are none."],
          ["Mentions and emoji", "Counts @mentions and emoji. More than 10 emoji earns a tip."],
          ["Call to action", "Words such as comment, save, share, tag, DM, link in bio, book, shop, swipe, join, follow."],
          ["Question", "Whether the caption contains a question mark anywhere."],
          ["Line breaks", "If the caption is over 40 words in fewer than 3 lines, it suggests breaking it up."],
          ["Readability", "Easy at 12 words per sentence or fewer with short words, Medium up to 20, Hard above."],
        ],
      },
      after: ["Every rule that fails becomes a tip under the results. When nothing fails, you see a single line saying the caption passes every check."],
    },
    {
      h: "How long should an Instagram caption be?",
      p: [
        "Instagram allows captions of up to 2,200 characters, as of October 2026. Long captions are fine for teaching posts, as long as the first line earns the tap on \"more\". Everything after roughly the first 125 characters is hidden in the feed, so the hook has to sit in that space.",
        "Short captions work well for reels, where the video does the talking. Either way, write the first line first, then decide how much you need after it.",
      ],
    },
    {
      h: "How to fix a caption the analyzer flags",
      list: [
        "<b>No call to action:</b> end with one clear ask, such as \"Save this for later\" or \"Tell me in the comments\". Note the checker matches whole words, so \"comment\" counts but \"comments\" on its own does not.",
        "<b>No question:</b> ask something your audience can answer in a few words. It gives people an easy reason to comment.",
        "<b>More than 5 hashtags:</b> since December 2025, Instagram allows at most 5 hashtags per post or reel, counting the caption and comments together. Keep the 5 that describe the post best. The <a href=\"../instagram-hashtag-generator/\">hashtag generator</a> suggests tags you can choose from.",
        "<b>Hard to read:</b> split long sentences in two. Hashtags count toward the word total, so a long block of tags can also drag the score down.",
      ],
      after: ["The analyzer only sees the caption you paste. If you plan to add hashtags in a comment, they count toward the same limit of 5. Limits change from time to time, so confirm them in the Instagram app before you post."],
    },
  ],
  faq: [
    ["How many hashtags can I use on Instagram?", "Since December 2025, Instagram allows at most 5 hashtags per post or reel, with the caption and comments counted together. The analyzer shows your count out of 5 and warns above that. If there are none, it suggests adding 3 to 5 specific ones. Confirm the current limit in the app, since Instagram changes these rules from time to time."],
    ["Does the caption analyzer save what I paste?", "No. The checks run in your browser. The caption is not sent to a server."],
    ["Why does my caption show emoji I did not expect?", "Some emoji are built from several symbols joined together, such as skin tones or family emoji. Those can count as more than one."],
    ["Will a better score get my post more reach?", "No tool can promise that. The checks cover habits that make a caption easier to read and easier to reply to. Reach depends on much more, including the post itself."],
    ["Can I use it for TikTok or Facebook captions?", "You can paste any text, but the limits it checks, 2,200 characters and 125 before \"more\", are Instagram's. Other platforms use different limits."],
  ],
};
