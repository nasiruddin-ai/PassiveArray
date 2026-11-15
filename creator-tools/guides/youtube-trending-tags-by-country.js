// Guide and FAQ for /creator-tools/youtube-trending-tags-by-country/. Merged into tools.js by build-tools.js.
// Matches getTrending in lib/youtube.js (videos.list chart=mostPopular, up to 200 videos, cached 6 hours)
// and COMPUTE["youtube-trending-tags-by-country"] in public/shared.js (each tag counted once per video).
module.exports = {
  seoTitle: "YouTube Trending Tags by Country: Live Tags & Hashtags | Passive Array",
  seoDescription: "See the tags and hashtags used by YouTube's trending videos in 40 countries, counted live from YouTube's own chart. Filter by category, copy the top tags, download CSV.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "What this tool shows",
      p: ["YouTube keeps a chart of the most popular videos in each country. This tool reads that chart live from the official YouTube Data API and counts what the videos on it have in common:"],
      list: [
        "<b>Top tags</b>: the tags uploaders typed into YouTube Studio, counted once per video, with the total views of the videos that use each one.",
        "<b>Top hashtags</b>: the #hashtags in titles and descriptions, counted the same way.",
        "<b>Categories on the chart</b>: how many trending videos are music, gaming, entertainment and so on.",
        "<b>The trending videos themselves</b>, in chart order, with views and age, plus a CSV of the whole chart.",
      ],
      after: ["Pick a category to narrow it down. Gaming in Brazil and Education in India trend on very different tags."],
    },
    {
      h: "How to use trending tags without wasting your time",
      p: ["Tags are the least important part of a video's metadata. YouTube's own help page says tags play a minimal role in helping viewers find a video and are mainly useful for words people often misspell. So use this tool for what it is good at:"],
      ordered: true,
      list: [
        "<b>Spot topics, not magic words.</b> When the same tag appears on many trending videos, it names a topic people are watching right now. That is a video idea, not a tag to paste.",
        "<b>Read the hashtags.</b> Hashtags show above the title and are clickable, so the ones trending creators use tell you which hashtag pages are active.",
        "<b>Compare countries.</b> The same category can trend on different topics in neighbouring countries, which is useful if you make videos in more than one language.",
        "<b>Spend your effort on titles and thumbnails.</b> They decide whether people click, which matters far more than tags.",
      ],
      after: ["For tags on your own video, use the <a href=\"../youtube-tag-generator/\">YouTube tag generator</a>. To see the tags on one specific video, use the <a href=\"../youtube-tag-extractor/\">tag extractor</a>."],
    },
    {
      h: "Where the data comes from",
      list: [
        "The chart is YouTube's own most popular chart for the country, read through the official API, up to 200 videos for all categories and up to 200 for a single category.",
        "It refreshes every six hours, and the page shows the date it was read.",
        "Not every category has a chart in every country. If one is missing, the tool says so.",
        "Many uploaders leave the tag box empty. The tool shows what share of trending videos have tags at all.",
      ],
    },
  ],
  faq: [
    ["What are the trending YouTube tags right now?", "Pick a country above. The tool reads YouTube's current most popular chart for it and lists the tags used by two or more of those videos, most used first."],
    ["Do tags help a YouTube video trend?", "Barely. YouTube says tags play a minimal role in discovery. Videos trend because people click and keep watching. Treat trending tags as a list of topics people are watching, not as words that will push your video up."],
    ["Can I see trending tags for a specific category?", "Yes. Choose a category such as Gaming, Music or Education. Some categories have no chart in some countries; the tool tells you when that happens."],
    ["How often is the data updated?", "Every six hours. The result shows the date and time YouTube's chart was read."],
    ["Is this the same as YouTube's Trending page?", "It is YouTube's own most popular chart for the country, read through the official YouTube Data API. YouTube's apps may show a slightly different selection."],
    ["Is it free?", "Yes. No account and no sign-up."],
  ],
};
