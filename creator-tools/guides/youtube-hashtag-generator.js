// Guide and FAQ for /creator-tools/youtube-hashtag-generator/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["youtube-hashtag-generator"] in public/shared.js: words from the topic, lowercased and stripped
// to a-z0-9; specific tier (joined, joined+tips, joined+current year, first two words, last word+tutorial), mid tier
// (last word, first word, first+guide, last+howto), broad tier (youtube, tutorial, howto, creator, shorts, learn, tips),
// filled in that order to 5/8/12/15, duplicates removed. Pattern-based in the browser: no AI, no live data.
// Worked example output checked in node for "home coffee brewing".
module.exports = {
  seoTitle: "YouTube Hashtag Generator: Free Hashtags in Order | Passive Array",
  seoDescription: "Free YouTube hashtag generator. Type your topic and get 5 to 15 copy-ready hashtags, specific ones first so the right three show with your title. No sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube hashtag generator builds",
      p: ["Type what your video is about, choose how many you want, 5, 8, 12 or 15, and you get a set of hashtags in a deliberate order:"],
      list: [
        "<b>Specific hashtags first.</b> Your whole topic as one tag, plus versions with <b>tips</b>, the current year, the first two words, and the last word with <b>tutorial</b>.",
        "<b>Mid-range hashtags next.</b> The single main words of your topic, plus <b>guide</b> and <b>howto</b> versions.",
        "<b>Broad hashtags last</b>, such as #youtube, #tutorial and #howto, only when you ask for a longer list.",
      ],
      after: [
        "The result also shows which three will appear with your title, the total character count, and YouTube's limit. One button copies the whole set.",
        "Be clear about how it works. The hashtags are built from your own words by a fixed pattern, right in your browser. There is no AI and no live data, so the tool does not know how popular any hashtag is. If a topic has repeated words, duplicates are removed and you may get one or two fewer than you asked for.",
      ],
    },
    {
      h: "How YouTube hashtags work",
      p: ["As of October 2026, these are the rules in YouTube's help pages. They change from time to time, so check YouTube Help before you rely on one:"],
      list: [
        "You add hashtags in the <b>description</b>, or in the <b>title</b>.",
        "If the title has no hashtags, YouTube shows <b>the first three hashtags from the description</b> with the title. That is why order matters.",
        "Clicking a hashtag opens a page of other videos using it, so a hashtag is a small doorway, not a ranking boost.",
        "A video with <b>more than 60 hashtags</b> has all of its hashtags ignored, according to YouTube's help page.",
        "Hashtags cannot contain spaces, and a hashtag that has nothing to do with the video can break YouTube's policy on misleading metadata.",
      ],
      after: ["The generator puts the specific hashtags first because a narrow tag brings a viewer who wants exactly your video, while a broad one competes with millions of others for the same click."],
    },
    {
      h: "A worked example, and what to delete",
      p: ["Type <b>home coffee brewing</b> and ask for 8. You get:"],
      table: {
        head: ["Order", "Hashtag", "Tier"],
        rows: [
          ["1", "#homecoffeebrewing", "Specific"],
          ["2", "#homecoffeebrewingtips", "Specific"],
          ["3", "#homecoffeebrewing2026", "Specific"],
          ["4", "#homecoffee", "Specific"],
          ["5", "#brewingtutorial", "Specific"],
          ["6", "#brewing", "Mid"],
          ["7", "#home", "Mid"],
          ["8", "#homeguide", "Mid"],
        ],
      },
      after: [
        "The first three are the ones shown with your title. That is a reasonable start, but read the list before you paste it. Here, <b>#home</b> and <b>#homeguide</b> say nothing about coffee and should go. You might swap in a tag you know your audience uses, such as the brewing method you show.",
        "Longer lists, 15 here, include <b>#shorts</b>. Delete it if the video is not a Short. In general, cut any tag that would surprise someone who clicked it.",
      ],
    },
    {
      h: "How to add hashtags to a YouTube video",
      ordered: true,
      list: [
        "Type your topic, pick how many hashtags you want, and press <b>Generate</b>.",
        "Delete any that do not describe the video, and reorder so your three best come first.",
        "Press <b>Copy</b>.",
        "In YouTube Studio, open the video's <b>Details</b> and paste the hashtags at the end of the description.",
        "Press <b>Save</b>. You can change hashtags at any time after publishing.",
      ],
      after: ["Three to eight well-chosen hashtags are plenty for most videos. You never need to go near the 60 limit."],
    },
    {
      h: "YouTube hashtags vs tags: what is the difference?",
      table: {
        head: ["", "Hashtags", "Tags"],
        rows: [
          ["Where they go", "In the description or title", "In the Tags box under Show more in YouTube Studio"],
          ["Who sees them", "Viewers; up to three show with the title", "Hidden from viewers on the watch page"],
          ["Limit", "Over 60 and all are ignored", "500 characters in total"],
          ["What they do", "Link to a page of videos with the same hashtag", "Mainly help YouTube with misspellings of your subject"],
        ],
      },
      after: [
        "Neither will rescue a weak title or thumbnail. Those, and how long people keep watching, decide where a video ranks. For tags, use the <a href=\"../youtube-tag-generator/\">YouTube tag generator</a> and read <a href=\"../../blog/do-youtube-tags-still-matter/\">do YouTube tags still matter</a>. For the description that holds your hashtags, the <a href=\"../youtube-description-generator/\">description generator</a> writes one around your keyword, and the <a href=\"../youtube-keyword-generator/\">keyword generator</a> helps you pick the phrase to build everything on.",
      ],
    },
  ],
  faq: [
    ["How many hashtags should I use on YouTube?", "Three to eight is plenty for most videos. Only three show with your title, and as of October 2026 YouTube ignores every hashtag on a video that has more than 60."],
    ["Where do hashtags go on a YouTube video?", "In the description, usually at the end, or in the title. If the title has none, YouTube shows the first three from the description with the title."],
    ["Do hashtags help YouTube videos get more views?", "A little. They let viewers browsing a hashtag find your video. They are a small signal compared with your title, thumbnail and how long people watch."],
    ["Why are the specific hashtags first?", "Because the first three are the ones viewers see. A specific tag brings people looking for exactly your topic, while a broad tag like #youtube competes with millions of videos."],
    ["Does this generator know which hashtags are popular?", "No. It builds hashtags from your words using a fixed pattern and has no live data. Check a hashtag by clicking it on YouTube and seeing what videos it leads to."],
    ["Should I use #shorts on a long video?", "No. Use #shorts only on Shorts. The generator adds it only to its longer lists, so delete it if it does not apply."],
    ["Are hashtags the same as YouTube tags?", "No. Hashtags are visible and clickable; tags are hidden in YouTube Studio and mostly help with misspellings. Use the <a href=\"../youtube-tag-generator/\">tag generator</a> for those."],
    ["Is the YouTube hashtag generator free?", "Yes. It runs in your browser, with no sign-up and no limit."],
  ],
};
