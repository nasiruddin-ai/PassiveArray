// Long-form guide for /creator-tools/youtube-demonetization-checker/. Matches COMPUTE["youtube-demonetization-checker"]:
// word lists grouped by the categories in YouTube's advertiser-friendly content guidelines (YouTube Help 6162278).
module.exports = {
  seoTitle: "YouTube Demonetization Checker: Scan Titles for Risky Words | Passive Array",
  seoDescription: "Free YouTube demonetization checker. Scan a title, description and tags for words in the categories of YouTube's advertiser-friendly content guidelines.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to check a title before you publish",
      ordered: true,
      list: [
        "Paste your title. Add the description and tags if you have them.",
        "Read the flagged words and the guideline category each falls under.",
        "Decide whether to reword. A flag is a prompt to look again, not a verdict.",
      ],
    },
    {
      h: "The guideline categories",
      p: ["YouTube's advertiser-friendly content guidelines list these categories. YouTube Help says the policies apply to all portions of your content: the video, thumbnail, title, description and tags."],
      list: [
        "Inappropriate language",
        "Violence",
        "Adult content",
        "Shocking content",
        "Harmful acts and unreliable content",
        "Hateful and derogatory content",
        "Recreational drugs and drug-related content",
        "Firearms-related content",
        "Controversial issues",
        "Sensitive events",
        "Enabling dishonest behavior",
        "Inappropriate content for kids and families",
        "Incendiary and demeaning",
        "Tobacco-related content",
      ],
    },
    {
      h: "What this tool can and cannot do",
      table: {
        head: ["It does", "It does not"],
        rows: [
          ["Read the words in your title, description and tags", "Watch the video or look at the thumbnail"],
          ["Match them against word lists we wrote for each category", "Use a YouTube list; YouTube does not publish one"],
          ["Show which category each word falls under", "Judge context, which YouTube's guidelines weigh heavily"],
        ],
      },
      p: ["So a clean result does not promise full ads, and a flagged word does not mean limited ads. It catches wording you may not have noticed."],
    },
    {
      h: "If a video gets limited ads",
      p: [
        "YouTube's systems make the decision, and YouTube Help says you can request human review of decisions made by its automated systems. When you upload, answer the self-certification questions in YouTube Studio accurately.",
        "Our guide to <a href=\"../../blog/youtube-demonetization/\">YouTube demonetization</a> explains the icons and the review. To check whether a whole channel is monetized, use the <a href=\"../youtube-monetization-checker/\">monetization checker</a>.",
      ],
    },
  ],
  faq: [
    ["What words get you demonetized on YouTube?", "YouTube does not publish a word list. Its advertiser-friendly guidelines describe categories, such as inappropriate language, violence and adult content, and judge context. This tool flags words we associate with those categories."],
    ["Does profanity in a title demonetize a video?", "YouTube's guidelines treat the title and thumbnail specifically when they describe profanity, with stronger words treated more strictly. Rewording the title is the simplest fix."],
    ["Do tags and descriptions affect monetization?", "YouTube Help says its advertiser-friendly policies apply to all portions of your content, and names the title, description and tags alongside the video and thumbnail."],
    ["If nothing is flagged, will my video get full ads?", "Not necessarily. This tool reads only the words. The video and thumbnail are judged too, and the decision is YouTube's."],
  ],
};
