// Guide and FAQ for /creator-tools/youtube-blocked-words-list/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["youtube-blocked-words-list"] in public/shared.js: seven phrase sets (scams, crypto,
// links, adult, sub4sub, bot, swear words) switched on by level (light < recommended < strict), plus the
// user's own words, minus anything in "Leave these out", de-duplicated, joined with ", ". Browser only.
// YouTube facts checked 2 November 2026 on support.google.com/youtube answers 16622701 (Studio path:
// Settings > Community moderation > Content controls > Blocked words, comma-separated; "Link text" holds
// comments with hashtags and URLs) and 9483359 (comments "containing or closely matching" are held, Held
// tab, up to 60 days, also blocks live chat). YouTube publishes no length limit for the list.
module.exports = {
  seoTitle: "YouTube Blocked Words List: Free Copy-Paste Generator | Passive Array",
  seoDescription: "Free YouTube blocked words list for comments. Pick light, recommended or strict, add your own words, copy and paste into YouTube Studio. Stops scams and spam.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What this YouTube blocked words list catches",
      p: ["Choose how strict you want to be and the generator joins the right phrase sets into one comma-separated list, ready to paste into YouTube Studio:"],
      table: {
        head: ["Set", "Included in", "What it stops"],
        rows: [
          ["Scams and fake support", "Light, Recommended, Strict", "\"Message me on WhatsApp\", fake prize winners, account recovery and hacker scams"],
          ["Crypto and investment spam", "Light, Recommended, Strict", "Fake investment managers, guaranteed-profit and airdrop comments"],
          ["Fake links and freebies", "Light, Recommended, Strict", "Shortened links, free Robux, V-Bucks and gift card bait, \"check my profile\""],
          ["Adult and dating spam", "Recommended, Strict", "OnlyFans and dating bots"],
          ["Sub4sub and self-promotion", "Recommended, Strict", "\"Sub for sub\", \"check out my channel\", buy-subscribers offers"],
          ["Bot and copy-paste spam", "Recommended, Strict", "\"Don't read my name\", \"look at my pfp\" and similar bot lines"],
          ["Swear words", "Strict only", "Common English profanity"],
        ],
      },
      after: [
        "You can add your own words, such as a scammer's fake name or a site that keeps appearing, and remove any phrase from our list that you want to allow. The result shows how many phrases each set added, a copy button, a .txt download and the exact steps for YouTube Studio.",
        "There is deliberately no list of slurs. We do not publish them on this site, and YouTube's own hold settings for potentially inappropriate comments are built to catch hateful language that a word list would miss.",
      ],
    },
    {
      h: "Why phrases and not single words",
      p: ["YouTube holds any comment that contains or closely matches a term on your list. A single everyday word therefore catches far more than you want: block \"free\" and you hold \"thanks, this saved me a free afternoon\". Block \"link\" and you hold every viewer asking where the link to your tutorial is."],
      after: [
        "Spam comes in recognisable phrases. Scammers write \"message me on WhatsApp\", \"you have been selected\" or \"thanks to my portfolio manager\" because the script works for them. Matching those phrases catches the scam and leaves your real viewers alone.",
        "Even so, read your Held tab for the first few weeks. Every channel's audience is different, and the \"Leave these out\" box is there for any phrase that catches real comments on yours.",
      ],
    },
    {
      h: "How to add blocked words in YouTube Studio",
      ordered: true,
      list: [
        "Build your list above and press <b>Copy</b>.",
        "On a computer, sign in to <b>YouTube Studio</b> and click <b>Settings</b>.",
        "Click <b>Community moderation</b>, then <b>Content controls</b>.",
        "Paste the list into <b>Blocked words</b>. Words and phrases are separated by commas, which is how the generator writes them.",
        "Click <b>Save</b>.",
        "Optional: turn on <b>Link text</b> to hold comments and viewer posts that contain hashtags and URLs.",
      ],
      after: [
        "In the YouTube Studio app, tap your profile picture, then <b>Settings</b>, and under Community tap <b>Content controls</b> to find the same Blocked words option.",
        "Comments that match go to the <b>Held</b> tab on your Comments page, where you can approve them. YouTube keeps held comments for up to 60 days. The same list also blocks matching messages in your live chat and viewer posts in your Community.",
      ],
    },
    {
      h: "What blocked words cannot do",
      list: [
        "<b>They match text, not meaning.</b> A scammer who writes \"wh@tsapp\" or splits a word with spaces can slip through. Update the list when you see a new pattern.",
        "<b>They hold, they do not delete.</b> That protects real viewers who trip a phrase by accident, but it means someone has to check the Held tab.",
        "<b>They only work on your channel.</b> The list does nothing about spam on other creators' videos, and nothing about spam already posted before you saved it.",
        "<b>YouTube publishes no length limit</b> for the Blocked words box that we could find. The generator shows the character count so you can see the size of what you paste.",
      ],
      after: [
        "Spam bots often aim at videos that are getting attention, so a sudden wave is a sign a video is doing well. To see what is actually in your comments, export them with the <a href=\"../youtube-comment-exporter/\">YouTube comment exporter</a> and look for repeated phrases to add to your list. If you run a giveaway, the <a href=\"../youtube-comment-picker/\">comment picker</a> keeps one entry per person, so spam accounts cannot flood the draw.",
      ],
    },
  ],
  faq: [
    ["Where do I put blocked words on YouTube?", "In YouTube Studio on a computer: Settings, then Community moderation, then Content controls, then Blocked words. Paste the comma-separated list and click Save."],
    ["Is there a YouTube blocked words list I can copy and paste?", "Yes. Choose Light, Recommended or Strict above, press Build my list, then Copy. You can also download it as a .txt file to keep a copy."],
    ["Does YouTube delete comments with blocked words?", "No. YouTube holds them in the Held tab on your Comments page for up to 60 days, so you can approve any that were real."],
    ["Do blocked words work on live chat?", "Yes. According to YouTube Help, live chat messages containing or closely matching your blocked terms are blocked too, and the list also applies to viewer posts in your Community."],
    ["Should I block single words like \"free\" or \"link\"?", "Usually not. YouTube matches anything containing or closely matching the term, so single common words hold many real comments. Phrases like \"free robux\" or \"link in my bio\" catch the spam without the side effects."],
    ["How do I stop sub4sub comments?", "Use the Recommended or Strict list, which includes sub4sub, sub for sub, check out my channel and similar phrases. Comments asking for subscribe-for-subscribe exchanges also go against YouTube's fake engagement rules, so there is no reason to approve them."],
    ["Why are some real comments being held?", "A blocked phrase appears in them. Open the Held tab, approve the comment, and add that phrase to \"Leave these out\" before you build your next list."],
    ["Can I block links in YouTube comments?", "Yes. In the same Content controls page, turn on Link text to hold comments and viewer posts that contain hashtags and URLs. Our list also holds common shortened-link domains even with that setting off."],
  ],
};
