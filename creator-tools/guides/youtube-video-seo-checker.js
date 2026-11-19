// Long-form guide for /creator-tools/youtube-video-seo-checker/. Matches COMPUTE["youtube-video-seo-checker"]
// in public/shared.js: weighted checklist over title (title analyzer), description, keyword placement, chapters,
// hashtags, tags, uploaded captions and language, read from videos.list (action "videodetails").
module.exports = {
  seoTitle: "YouTube Video SEO Checker: Free Score for Any Video | Passive Array",
  seoDescription: "Free YouTube video SEO checker. Paste any video to score its title, description, tags, hashtags, chapters and captions against YouTube's own rules, with fixes.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to check a video's SEO",
      ordered: true,
      list: [
        "Paste the video's link. Your own video or a competitor's both work, because everything checked is public.",
        "Add the keyword you want the video to be found for. It is optional, but without it the checker cannot test keyword placement.",
        "Read the score, then the list of fixes. Each line names the setting to change in YouTube Studio.",
      ],
    },
    {
      h: "What the score covers",
      p: ["YouTube says search ranks videos on three things: relevance, engagement and quality. Only relevance is in your metadata, so this checker scores what you write and set, and says nothing it cannot see, such as watch time or click-through rate."],
      table: {
        head: ["Check", "What passes", "Why it matters"],
        rows: [
          ["Title", "A strong score on the title analyzer, under 100 characters", "The title is the main relevance signal and what earns the click"],
          ["Description", "A real description; 1,000+ characters scores best", "Descriptions can run to 5,000 characters and help YouTube understand the topic"],
          ["Keyword placement", "Keyword in the title and in the first two lines of the description", "The first lines show above \"...more\" in search and on the watch page"],
          ["Chapters", "Timestamps starting at 0:00, at least three, each 10 seconds or longer", "YouTube's own rules for chapters; chapters can appear in search results"],
          ["Hashtags", "A few, never more than 60", "Over 60 and YouTube ignores all of them; the first three can show above the title"],
          ["Tags", "Within the 500-character limit", "YouTube says tags play a minimal role, mainly for misspellings, so they carry little weight here"],
          ["Captions", "Uploaded captions", "Accurate captions help viewers and give YouTube a full transcript"],
          ["Language", "Video language set", "Tells YouTube which audience and search results the video is for"],
        ],
      },
    },
    {
      h: "How to read the result",
      list: [
        "<b>80 or above</b>: the metadata is doing its job. Improve the thumbnail and the first 30 seconds next.",
        "<b>60 to 79</b>: one or two fixes, usually the description or chapters, will lift it.",
        "<b>Below 60</b>: start with the title and the first two lines of the description.",
      ],
      p: ["The score is Passive Array's checklist, not a number YouTube uses. A video can score 100 and still struggle if viewers leave early, because engagement is weighed separately."],
    },
    {
      h: "Use it on competitors",
      p: ["Check the three videos ranking above yours for the same search. If their descriptions are longer, carry chapters or put the keyword earlier, that is the gap to close. The <a href=\"../youtube-tag-extractor/\">tag extractor</a> shows their tags, and the <a href=\"../youtube-title-analyzer/\">title analyzer</a> scores title ideas before you publish."],
    },
  ],
  faq: [
    ["Does this tool use my YouTube account?", "No. It reads a video's public details from the YouTube Data API, the same information anyone can see. Nothing is changed on the video and no sign-in is needed."],
    ["Can a video rank with a low score?", "Yes. The score covers metadata only. YouTube also weighs engagement and quality, so a video people watch to the end can outrank a perfectly tagged one."],
    ["How long should a YouTube description be?", "YouTube allows up to 5,000 characters. There is no official ideal length; this checker rewards 1,000 characters or more because a fuller description gives YouTube more to understand the topic, as long as it is written for viewers."],
    ["Why does it say my chapters will not show?", "YouTube only shows chapters when the first timestamp is 0:00, there are at least three, they are in order, and each chapter is at least 10 seconds long. The checker tests the same rules."],
    ["Do tags still matter for YouTube SEO?", "Very little. YouTube says tags play a minimal role in discovery and are mostly useful for common misspellings, which is why they carry a small weight in the score."],
  ],
};
