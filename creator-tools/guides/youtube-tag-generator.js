// Long-form guide for /creator-tools/youtube-tag-generator/. Merged into tools.js by build-tools.js.
module.exports = {
  seoTitle: "YouTube Tag Generator: Free Tags for Your Video | Passive Array",
  seoDescription: "Free YouTube tag generator, no sign-up. Type your topic and get a copy-ready tag list under the 500-character limit, plus an honest take on what tags still do.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube tag generator gives you",
      p: ["Type what your video is about and you get a tag list you can paste straight into YouTube Studio. It is built the way tags still help, not the way they were used ten years ago:"],
      list: [
        "<b>The exact keyword</b>, spelled the way people type it into search.",
        "<b>Long-tail variations</b> of two to four words, such as the keyword plus <b>tutorial</b>, <b>for beginners</b> or <b>explained</b>.",
        "<b>Realistic misspellings</b> when the AI writer is on and your subject has them, because that is the one job YouTube says tags do well. Invented misspellings are never added.",
        "<b>Broad category terms</b> that tell YouTube what kind of video this is.",
        "<b>Your related keywords</b>, if you add any in the optional box.",
      ],
      after: ["The list is joined with commas and stops before 480 characters, so it always fits YouTube's 500-character limit with room for a later edit. The result shows how many of the 500 characters you used."],
    },
    {
      h: "How to add tags to a YouTube video",
      ordered: true,
      list: [
        "Type your topic in the box above, add a few related keywords if you have them, and press <b>Generate</b>.",
        "Read the list and delete anything that does not describe your video. A tag that is true for a different video is worse than no tag.",
        "Press <b>Copy</b>.",
        "In YouTube Studio, open the video, go to <b>Details</b>, and click <b>Show more</b> at the bottom of the page.",
        "Paste into the <b>Tags</b> box. YouTube splits the list at each comma and turns every phrase into a tag.",
        "Press <b>Save</b>.",
      ],
      after: ["You can add or change tags at any time after a video is published. Editing them does not reset its views or its place in search."],
    },
    {
      h: "Do YouTube tags still help with ranking?",
      p: [
        "A little, and less than most tag tools suggest. YouTube's own help page says tags can be useful if your video's subject is commonly misspelled, and that otherwise they play a <b>minimal role</b> in helping viewers find your video. That is the official position, and years of creator testing agree with it.",
        "What actually decides where a video ranks is the title, the thumbnail, the first lines of the description, the words spoken in the video, and above all how viewers behave once they click: whether they stay, and whether they watch something else after. We cover this in more detail in <a href=\"../../blog/do-youtube-tags-still-matter/\">do YouTube tags still matter</a>.",
        "So treat tags as a five-minute job, not a ranking strategy. This tool exists to make that five minutes one click.",
      ],
      table: {
        head: ["Tags are good for", "Tags will not"],
        rows: [
          ["Catching common misspellings of your subject", "Rank a video with a weak title"],
          ["Brand and product names people spell several ways", "Rescue a video people leave in the first thirty seconds"],
          ["Terms in a second language your audience searches in", "Make up for a thumbnail nobody clicks"],
          ["Giving YouTube a hint when the title and transcript are thin", "Help if they describe a different video"],
        ],
      },
    },
    {
      h: "How many tags should a YouTube video have?",
      p: [
        "There is no ideal number. The real limit is length: <b>500 characters</b> for the whole tag field, commas included. In practice that is about 20 to 30 short tags, and this generator aims for that range.",
        "More is not better. Ten accurate tags beat thirty loose ones, and stuffing the field with popular terms that have nothing to do with your video can break YouTube's policy on misleading metadata. If a tag would surprise a viewer who clicked on it, delete it.",
        "A sensible order is the main keyword first, then its long-tail variations, then names and spellings, then one or two broad category terms. Stop around 480 characters so a later edit does not push you over the limit.",
      ],
    },
    {
      h: "Better ways to choose tags for your video",
      ordered: true,
      list: [
        "<b>See what top videos use.</b> Tags are hidden from viewers but still sit in the page. Our guide on <a href=\"../../blog/how-to-find-youtube-video-tags/\">how to find any video's tags</a> shows three free ways to read them.",
        "<b>Get suggestions inside YouTube Studio.</b> The free <a href=\"../../youtube-extension/\">Passive Array extension</a> adds a panel under the Tags box, with tags ranked by how many of the top-ranking videos for your title actually use them.",
        "<b>Start from a real search phrase.</b> Use the <a href=\"../youtube-keyword-generator/\">keyword generator</a> to find the exact phrase your video answers, then generate tags from that phrase.",
        "<b>Put the effort where it counts.</b> Write the title with the <a href=\"../youtube-title-generator/\">title generator</a> and the first two lines with the <a href=\"../youtube-description-generator/\">description generator</a>. Those carry far more weight than any tag.",
      ],
      after: ["Hashtags are a different field. They go in the description, and only the first three show above your title. Build those with the <a href=\"../youtube-hashtag-generator/\">YouTube hashtag generator</a>."],
    },
  ],
  faq: [
    ["Is this YouTube tag generator free?", "Yes. There is no sign-up and no account, and every list can be copied straight into YouTube Studio."],
    ["What is the character limit for YouTube tags?", "500 characters for the whole tag field, including the commas between tags. This tool stops before 480, so you always have room to add one or two of your own."],
    ["Do YouTube tags help with SEO?", "Only a little. YouTube says tags play a minimal role in discovery and mainly help when your subject is commonly misspelled. Your title, thumbnail, description and how long viewers watch matter far more."],
    ["How many tags should I use on a YouTube video?", "Use as many accurate tags as fit, which is usually 20 to 30 short ones inside the 500-character limit. Accuracy matters more than count; delete anything that does not describe this exact video."],
    ["Should I copy tags from a popular video?", "You can read them as research, but copying them wholesale is close to useless. Their tags describe their video. Look for phrases several top videos share, then use those words in your title and description, where they do more work."],
    ["Are YouTube tags the same as hashtags?", "No. Tags are hidden in the Tags box in YouTube Studio. Hashtags are written in the title or description, are visible to viewers, and only the first three from the description appear above the title."],
    ["Can I change tags after I publish a video?", "Yes. Open the video in YouTube Studio, edit the Tags box under Show more, and save. Changing tags does not reset views or comments."],
    ["Is this tag generator using AI?", "The list is written by AI from your topic when AI writing is available, and built from your topic plus the variations people commonly type when it is not. Either way it never adds tags that have nothing to do with what you typed."],
  ],
};
