// Long-form guide for /creator-tools/youtube-tag-sorter/. Matches COMPUTE["youtube-tag-sorter"]:
// dedupe (case-insensitive), sort, trim to 500 characters counted as the YouTube Data API documents.
module.exports = {
  seoTitle: "YouTube Tag Sorter: Remove Duplicates, Fit 500 Characters | Passive Array",
  seoDescription: "Free YouTube tag sorter. Paste a tag list to remove duplicates, sort it, count characters the way YouTube does and trim it to the 500-character limit.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to sort and clean YouTube tags",
      ordered: true,
      list: [
        "Paste your tags, separated by commas or one per line.",
        "Choose an order: as entered, most specific first, shortest first, or A to Z.",
        "Copy the cleaned list and paste it into the Tags box in YouTube Studio.",
      ],
    },
    {
      h: "How YouTube counts the 500 characters",
      p: ["The YouTube Data API documents the rule, and it is not a plain letter count."],
      table: {
        head: ["What", "How it counts"],
        rows: [
          ["Each tag", "Its own characters"],
          ["Commas between tags", "One character each"],
          ["A tag with a space in it", "Two extra characters, as if it were wrapped in quotation marks"],
          ["The whole list", "500 characters at most"],
        ],
      },
    },
    {
      h: "Which order to choose",
      list: [
        "<b>Most specific first</b> keeps your long, exact phrases when the list has to be trimmed, and drops the short broad ones.",
        "<b>As entered</b> trusts the order you wrote, so put the tags that matter first.",
        "<b>A to Z</b> is for tidying a list you keep in a spreadsheet.",
      ],
      p: ["The order of tags is not documented by YouTube as a ranking factor. Ordering matters here only because it decides which tags are dropped when the list is too long."],
    },
    {
      h: "How much tags matter",
      p: [
        "YouTube Help is plain about it: tags can be useful if the content of your video is commonly misspelled, and otherwise play a minimal role in helping viewers find your video. Your title, thumbnail and description matter more.",
        "To build a list from scratch, use the <a href=\"../youtube-tag-generator/\">tag generator</a>. To see the tags on any published video, use the <a href=\"../youtube-tag-extractor/\">tag extractor</a>.",
      ],
    },
  ],
  faq: [
    ["How many tags can a YouTube video have?", "There is no fixed number. The limit is 500 characters for the whole list, counting commas, with two extra characters for any tag that contains a space."],
    ["Does the order of YouTube tags matter?", "YouTube does not document tag order as a ranking factor. In this tool the order decides which tags are kept when the list is over 500 characters."],
    ["Should I remove duplicate tags?", "Yes. A repeated tag uses characters and adds nothing. The sorter treats Travel and travel as the same tag and keeps the first spelling."],
    ["Are tags the same as hashtags?", "No. Tags are hidden and go in the Tags box. Hashtags start with # and go in the title or description, where viewers can see and click them."],
  ],
};
