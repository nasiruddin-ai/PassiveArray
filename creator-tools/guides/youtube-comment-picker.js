// Guide and FAQ for /creator-tools/youtube-comment-picker/. Merged into tools.js by build-tools.js.
// Facts checked against getComments in creator-tools/lib/youtube.js and the picker in public/shared.js
// (crypto.getRandomValues with rejection sampling, earliest comment per author, owner excluded by channel id).
module.exports = {
  seoTitle: "YouTube Comment Picker: Free Random Giveaway Winner | Passive Array",
  seoDescription: "Pick a random winner from YouTube comments for your giveaway. One entry per person, keyword filter, several winners, owner excluded. Free, no sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to pick a random YouTube comment winner",
      ordered: true,
      list: [
        "Paste the link of the giveaway video or Short.",
        "Set how many winners you need, up to 20.",
        "Optional: add a word or hashtag every entry must contain, if that was a rule of your giveaway.",
        "Keep <b>one entry per person</b> on unless your rules said every comment counts.",
        "Press <b>Draw winner</b>. Use <b>Draw again</b> if a winner does not respond or breaks a rule.",
      ],
    },
    {
      h: "How the draw stays fair",
      list: [
        "<b>Equal odds.</b> Winners are drawn in your browser with crypto.getRandomValues, the cryptographic random generator built into every modern browser, with no bias toward any position in the list.",
        "<b>One entry per person.</b> When this is on, each commenter's earliest matching comment is kept and the rest are dropped, so commenting fifty times does not give fifty chances.",
        "<b>No self-wins.</b> Comments posted by the channel that owns the video are left out unless you allow them.",
        "<b>A record of the draw.</b> Download the list of eligible entries as a CSV and keep it with the date and time shown under the winners.",
      ],
    },
    {
      h: "Can you pick a random subscriber instead?",
      p: [
        "No tool can do this honestly. YouTube does not let anyone outside a channel list its subscribers: the API only shows subscribers who chose to make their subscriptions public, and only to the channel owner. Sites that claim to pick a random subscriber are really picking from comments or from something else.",
        "The common fix is to make commenting the entry rule, for example “subscribe and comment your favourite video to enter”, and draw from the comments here. You cannot verify a winner is subscribed, so ask them to confirm when you contact them.",
      ],
    },
    {
      h: "Giveaway checklist",
      list: [
        "Write the rules in the description: how to enter, the closing date, who can take part and what the prize is.",
        "Follow <a href=\"https://support.google.com/youtube/answer/1620498\" target=\"_blank\" rel=\"noopener\">YouTube's contest policies</a> and your local laws. YouTube requires the rules to be visible and the creator to run the contest, not YouTube.",
        "Close entries before drawing, so the comment list does not change while you pick.",
        "Open the winner's comment from the result to check it is still public before you announce.",
      ],
    },
  ],
  faq: [
    ["Is the YouTube comment picker free?", "Yes. It is free with no sign-up and no limit on how many times you draw."],
    ["How many comments can it read?", "Up to 2,000 top-level comments per draw, plus replies if you include them. On a bigger giveaway, close entries before that many come in so everyone gets a fair chance."],
    ["Is the winner really random?", "Yes. Each eligible entry has equal odds, using the browser's cryptographic random generator rather than Math.random."],
    ["Why can't a certain commenter win?", "Comments held for review or flagged as spam by YouTube are not returned by its API, so they cannot be drawn. A commenter can also be filtered out by your keyword rule or by the one-entry-per-person rule."],
    ["Can I pick several winners at once?", "Yes, up to 20. No person can win twice in the same draw."],
  ],
};
