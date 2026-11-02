// Guide and FAQ for /creator-tools/youtube-comment-search/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["youtube-comment-search"] in public/shared.js: comments from getComments (official
// commentThreads.list, up to 2,000 top-level, up to 5 replies each, order relevance or time), filtered in
// the browser by a case-insensitive substring on text and/or author (leading @ ignored), optional replies.
// Comment History fact: support.google.com/youtube/answer/6000976 (checked 2 November 2026).
module.exports = {
  seoTitle: "YouTube Comment Search: Find Comments by Keyword or User | Passive Array",
  seoDescription: "Search YouTube comments on any video by keyword, phrase, hashtag or username. Free, no sign-up. See every match with a direct link and download them as CSV.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What this YouTube comment search does",
      p: ["YouTube has no search box for comments. Scrolling a video with thousands of them to find one question, one name or one mention of your product takes forever. Paste the video link, type what you are looking for, and this tool reads the comments through YouTube's official API and shows every match."],
      list: [
        "<b>Search by keyword or phrase:</b> a product name, a question word like \"how\", a timestamp, an emoji or a hashtag.",
        "<b>Search by username:</b> type the name with or without the @ to see everything one person wrote on that video.",
        "<b>Both at once</b> is the default, so a name finds comments by that person and comments that mention them.",
      ],
      after: ["Matches are highlighted, each one links straight to the comment on YouTube, and you can download them all as a CSV for Excel or Google Sheets."],
    },
    {
      h: "How to search comments on a YouTube video",
      ordered: true,
      list: [
        "Copy the video's link from the address bar or the Share button. Shorts links work too.",
        "Paste it above and type the word, phrase or username to find.",
        "Choose where to search: text and usernames, text only, or usernames only.",
        "Choose whether to include replies, and whether to read top comments or the newest first.",
        "Press <b>Search comments</b>. Click any match to open it on YouTube, or download the list.",
      ],
      after: ["The search ignores capital letters. Shorter search terms find more: \"refund\" matches \"refunds\" and \"refunded\", while \"refund policy\" only matches that exact phrase."],
    },
    {
      h: "What it can and cannot find",
      table: {
        head: ["It can", "It cannot"],
        rows: [
          ["Search up to 2,000 comments on one video, plus up to 5 replies to each", "Search every comment on a video with hundreds of thousands of them"],
          ["Find everything one username wrote on that video", "Find one person's comments across all of YouTube"],
          ["Find comments that mention a word, link, hashtag or emoji", "Find comments that are held for review, flagged as likely spam or deleted"],
          ["Read top comments or the newest first", "Read replies beyond the first 5 in a long thread"],
        ],
      },
      after: [
        "These limits come from YouTube's API, not from the tool. On a very busy video, run the search twice, once with top comments and once with newest first, to cover two different slices.",
        "Looking for a comment <b>you</b> wrote? YouTube keeps that list for you: open <b>Comment History</b> in your YouTube account, which shows the public comments you have left across YouTube, and click one to jump to the video.",
      ],
    },
    {
      h: "Ways creators and brands use it",
      list: [
        "<b>Find questions to answer:</b> search \"how\", \"why\" or \"?\" and reply to the ones still waiting. A reply is a reason for that viewer to come back.",
        "<b>Check a giveaway:</b> search the giveaway keyword to see how many people entered, then draw fairly with the <a href=\"../youtube-comment-picker/\">YouTube comment picker</a>.",
        "<b>Spot spam patterns:</b> search \"telegram\" or \"whatsapp\" to see if scammers are working your comments, then block the phrases with the <a href=\"../youtube-blocked-words-list/\">blocked words list generator</a>.",
        "<b>Track a sponsor or product mention:</b> brands can see how viewers reacted to an integration before booking the next one.",
        "<b>Keep everything:</b> to save the full comment section rather than the matches, use the <a href=\"../youtube-comment-exporter/\">YouTube comment exporter</a>.",
      ],
    },
  ],
  faq: [
    ["Can you search YouTube comments?", "Not on YouTube itself. Paste the video link here, type a word or a username, and every matching comment we can read is listed with a link to it."],
    ["How do I search YouTube comments by user?", "Choose \"Usernames only\" and type the name, with or without the @. You see everything that person wrote on that video. No tool can search one person's comments across all of YouTube."],
    ["How do I find a specific comment on a YouTube video?", "Search a word you remember from it. Short, distinctive words work best. If the video is very busy, search once with top comments and once with newest first."],
    ["How do I find a comment I made on YouTube?", "Open Comment History in your YouTube account. It lists the public comments you have left across YouTube, and clicking one takes you to the video."],
    ["Why can't I find a comment I know is there?", "It may be held for review, flagged as spam, deleted, or a reply deep in a long thread. The YouTube API does not return those, and on huge videos the comment may be beyond the 2,000 we read."],
    ["Is this YouTube comment search free?", "Yes. No account, no extension and no sign-up. It reads public comments only and posts nothing."],
    ["Can I search comments on Shorts?", "Yes. Paste the Shorts link the same way as a normal video."],
  ],
};
