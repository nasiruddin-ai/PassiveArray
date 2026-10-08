// Guide and FAQ for /creator-tools/youtube-title-analyzer/. Merged into the tool by build-tools.js.
// Every band, weight and penalty below matches analyzeTitle() and titleGrade() in public/shared.js.
module.exports = {
  buttonLabel: "Score title",
  seoTitle: "YouTube Title Analyzer: Score Your Title Free | Passive Array",
  seoDescription: "Score a YouTube title out of 100 on length, keyword position, click appeal and trust. Free and private, with a plain fix for every weak spot it finds.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube title analyzer checks",
      p: ["Paste a title and, if you like, the keyword you want it to rank for. The analyzer scores up to four parts out of 100 each, then weights them into one score:"],
      table: {
        head: ["Part", "Weight with a keyword", "Weight without one"],
        rows: [
          ["Length", "25%", "38%"],
          ["Keyword position", "25%", "Not scored"],
          ["Click appeal", "30%", "42%"],
          ["Trust", "20%", "20%"],
        ],
      },
      after: [
        "The total maps to a grade: <b>Strong</b> at 80 or more, <b>Good</b> from 62, <b>Needs work</b> from 45, and <b>Weak</b> below that. Every part is shown on its own bar with a reason, and each weak point comes with a tip.",
        "It all runs in your browser. Your title is never sent to our server or stored.",
      ],
    },
    {
      h: "How long should a YouTube title be?",
      p: ["YouTube allows up to 100 characters, but long titles get cut off in search results and on phones. The exact cut-off varies by device and layout, so the analyzer works to 60 characters as a safe limit:"],
      table: {
        head: ["Title length", "Length score", "Why"],
        rows: [
          ["Under 25 characters", "45", "Room left unused that could say more"],
          ["25 to 39", "78", "A little short"],
          ["40 to 60", "100", "Ideal: specific and fully visible"],
          ["61 to 70", "62", "The end will be cut off in places"],
          ["Over 70", "28", "A good part is hidden where most people look"],
        ],
      },
      after: ["When a title runs past 60 characters, the result box shows only the first 60, which is roughly what a viewer sees. If the promise of the video is not in that part, move it forward."],
    },
    {
      h: "Where to put your keyword in a YouTube title",
      p: ["Add your main keyword in the second box and the analyzer checks whether it appears, and where:"],
      list: [
        "<b>In the first third of the title:</b> 100. This is where both search and a scanning viewer look first.",
        "<b>In the middle third:</b> 72.",
        "<b>In the last third:</b> 48. It is also the part most likely to be cut off.",
        "<b>Missing:</b> 0. Search cannot match a phrase that is not there.",
      ],
      after: [
        "The match is for the exact phrase, ignoring capitals. If your keyword is \"squarespace seo\", a title containing \"SEO for Squarespace\" will not match. That is on purpose: people search the words in a set order, and the title that uses their order is the clearest match.",
        "Not sure which phrase to target? The <a href=\"../youtube-keyword-generator/\">keyword generator</a> builds ideas from a seed word, and our guide to <a href=\"../../blog/free-youtube-keyword-research/\">free YouTube keyword research</a> shows how to judge demand without paid tools.",
      ],
    },
    {
      h: "What makes a YouTube title clickable, and what costs trust",
      p: ["<b>Click appeal</b> starts at zero and adds points for things that give a viewer a reason to click, up to 100:"],
      list: [
        "<b>A number</b>, such as a count, a price or a year: 30 points.",
        "<b>A bracket</b>, like (2026) or [Full Guide]: 15 points.",
        "<b>Strong words</b> such as how, why, best, mistakes, tested, explained or vs: 12 points each, up to 30.",
        "<b>Emotional words</b> such as brutal, regret, warning, avoid or worth: 8 points each, up to 15.",
        "<b>A question</b>, either ending in a question mark or starting with how, what, why, is, does or similar: 12 points.",
      ],
      after: [
        "<b>Trust</b> works the other way. It starts at 100 and loses points for habits that read as clickbait: two or more words in capitals (minus 35), stacked punctuation like !! or ... (minus 25), worn-out phrases like \"you won't believe\" (minus 30), and more than 14 words (minus 15). One word in capitals for emphasis costs nothing.",
        "These are signals, not a promise. The analyzer cannot see your thumbnail, your niche or your audience. A score of 90 does not guarantee clicks, but a title that fails several checks is usually worth another draft.",
      ],
    },
    {
      h: "How to write a better YouTube title, step by step",
      ordered: true,
      list: [
        "<b>Start from the search.</b> Pick one phrase people actually type and put it near the front.",
        "<b>Write five versions, not one.</b> The <a href=\"../youtube-title-generator/\">title generator</a> gives you a spread of angles to start from.",
        "<b>Score each one here</b> and keep the two strongest. Fix any tip it raises, then score again.",
        "<b>Check it against your thumbnail.</b> The two should work together. Repeating the title word for word in the thumbnail wastes the space.",
        "<b>Finish the metadata.</b> Build tags with the <a href=\"../youtube-tag-generator/\">tag generator</a>. Our post on <a href=\"../../blog/do-youtube-tags-still-matter/\">whether YouTube tags still matter</a> explains how small their role is.",
        "<b>Watch the click-through rate.</b> After publishing, YouTube Studio shows the impressions click-through rate for each video. That number, not this score, is the final verdict.",
      ],
    },
  ],
  faq: [
    ["What is a good YouTube title score?", "80 or more is graded Strong and 62 or more is Good. Below 45 is Weak. The bars matter more than the total, because they show which part to fix."],
    ["How many characters can a YouTube title have?", "YouTube allows up to 100 characters. Aim to keep the important part within the first 60, because longer titles are cut off in search results and on mobile."],
    ["Does the keyword have to match exactly?", "Yes, as a phrase, ignoring capitals. \"squarespace seo\" matches \"Squarespace SEO tips\" but not \"SEO for Squarespace\". Use the word order people actually search."],
    ["Should I put numbers in my YouTube titles?", "A number is the single biggest boost to the click appeal score, at 30 points. Use one when it is true and specific, such as the number of steps or the year, not as decoration."],
    ["Are capital letters bad in a YouTube title?", "One word in all capitals for emphasis is fine and costs nothing. Two or more lose 35 trust points, because a title in capitals reads as shouting. Any all-capital word of three letters or more counts, including acronyms like SEO or DIY, so keep them to one where you can."],
    ["Will a high score get my video more views?", "No score can promise that. The analyzer checks length, keyword position and wording against common patterns. Views also depend on the thumbnail, the topic and how well the video keeps people watching."],
    ["Is the title analyzer free, and is my title saved?", "It is free with no sign-up and no limit. It runs entirely in your browser, so your title is never sent to our server or stored."],
  ],
};
