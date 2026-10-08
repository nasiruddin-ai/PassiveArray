// Long-form guide for /creator-tools/youtube-title-generator/. Merged into tools.js by build-tools.js.
module.exports = {
  seoTitle: "YouTube Title Generator: 10 Free Title Ideas | Passive Array",
  seoDescription: "Free YouTube title generator, no sign-up. Type your topic and get ten titles across different angles, each checked against the 60 characters shown in search.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube title generator gives you",
      p: ["Type what your video is about, and optionally a few related keywords. You get ten titles, each with:"],
      list: [
        "<b>A different angle.</b> The ten are spread across how-to, mistakes, list, comparison, question, story, contrarian and beginner, so you are choosing between real options rather than ten versions of one sentence.",
        "<b>A character count</b>, flagged when it runs past 60 characters, roughly where YouTube starts cutting titles off in search and on phones.",
        "<b>Your keyword near the front</b>, where it helps both search and the viewer deciding in half a second.",
      ],
      after: [
        "When the AI writer is on, it follows the same rules: under 60 characters, no clickbait the video cannot deliver, no words in capitals, and at most one emoji across the set. When it is off, proven title patterns are filled with your topic. Neither invents facts about you, such as results, numbers of clients or years of experience.",
        "Copy all ten with one click, or pick your favourite and score it with the <a href=\"../youtube-title-analyzer/\">YouTube title analyzer</a>.",
      ],
    },
    {
      h: "How to write a good YouTube title",
      ordered: true,
      list: [
        "<b>Lead with the phrase people search.</b> If your video answers \"how to edit videos on iPhone\", those words belong at the start, not after a clever opener.",
        "<b>Make one clear promise.</b> A viewer should know what they get from the title alone: a fix, a list, a verdict, a story.",
        "<b>Keep the important part inside 60 characters.</b> Anything after that may be hidden in search and on mobile.",
        "<b>Add a specific detail.</b> A number, a timeframe or a named tool beats a vague adjective.",
        "<b>Write it to match the thumbnail.</b> The two are read together. They should add to each other, not repeat the same words.",
        "<b>Deliver what it promises.</b> A title that overpromises gets the click and loses the viewer in the first thirty seconds, which hurts the video far more than a modest title would.",
      ],
      after: ["Not sure what phrase to lead with? Find one first with the <a href=\"../youtube-keyword-generator/\">keyword generator</a>, then come back here."],
    },
    {
      h: "How long should a YouTube title be?",
      p: ["YouTube lets you write up to 100 characters, but far fewer are shown in most places. Exact cut-off points move with screen size and layout, so treat these as working guidance rather than fixed rules:"],
      table: {
        head: ["Length", "What happens", "Verdict"],
        rows: [
          ["Under 30 characters", "Fully visible, but often too vague to show a clear promise", "Usually room left unused"],
          ["30 to 60 characters", "Fully visible in search and on most phones", "The safe range for most videos"],
          ["61 to 70 characters", "The end may be cut off on mobile", "Fine if the key words come first"],
          ["Over 70 characters", "Usually truncated in search and suggestions", "Only if the start works on its own"],
          ["100 characters", "YouTube's hard limit", "You cannot save anything longer"],
        ],
      },
      after: ["The rule that matters more than length: put the words that sell the video in the first 60 characters, so a cut-off never hides them."],
    },
    {
      h: "Good vs weak YouTube title examples",
      p: ["The difference is rarely clever wording. It is usually a missing keyword, a vague promise, or the important words arriving too late."],
      table: {
        head: ["Weak title", "Stronger title", "What changed"],
        rows: [
          ["My Morning Routine", "My 5am Morning Routine as a Teacher", "A specific, curious detail"],
          ["You WON'T BELIEVE This Camera Trick!!!", "This Camera Setting Fixes Blurry Photos", "A clear promise instead of shouting"],
          ["Vlog #47: Trying Some New Recipes This Week", "3 Easy Weeknight Dinners Under 20 Minutes", "Searchable words and a number up front"],
          ["Everything You Need to Know About Sourdough Bread Baking for Absolute Beginners", "Sourdough for Beginners: Your First Loaf", "Keyword first, under 60 characters"],
        ],
      },
      after: ["Your channel name and episode numbers mean nothing to someone who has never seen you. Save them for the description."],
    },
    {
      h: "Does the title affect how a video ranks?",
      p: [
        "Yes, more than any other text you write. The title tells YouTube what the video is about, and it is the main thing people read before deciding whether to click. YouTube then watches what happens next: whether people choose your video when it is shown, and whether they keep watching. A title that wins the click and keeps its promise is the strongest signal you control.",
        "The rest of the text supports it. Repeat the main phrase in the first two lines of the description with the <a href=\"../youtube-description-generator/\">description generator</a>. Add tags last with the <a href=\"../youtube-tag-generator/\">tag generator</a>, because YouTube says tags play only a minimal role, as we explain in <a href=\"../../blog/do-youtube-tags-still-matter/\">do YouTube tags still matter</a>.",
        "To see which titles are working in your niche right now, browse the <a href=\"../../research/outliers/\">outlier feed</a>: videos doing several times their channel's usual views. Study the pattern, not the wording.",
      ],
    },
  ],
  faq: [
    ["Is this YouTube title generator free?", "Yes. No sign-up and no account. Generate as many sets as you like and copy them straight into YouTube Studio."],
    ["How many characters can a YouTube title have?", "Up to 100 characters. Aim for about 60 or fewer, because longer titles are often cut off in search results and on phones."],
    ["Should my keyword be at the start of the title?", "Usually, yes. Words near the front carry more weight for search, and they are what a viewer reads first. If a natural sentence needs the keyword in the middle, keep it inside the first 60 characters."],
    ["Can I change a YouTube title after publishing?", "Yes, at any time in YouTube Studio. Many creators retitle a video that is getting impressions but few clicks. Give each version a week or two before judging it, and change one thing at a time."],
    ["Are clickbait titles bad for YouTube?", "Curiosity is fine. Clickbait that the video does not deliver is not: viewers leave early, and YouTube shows the video to fewer people after that. This generator is told never to promise what the video cannot back up."],
    ["Should I use capital letters or emoji in titles?", "Sparingly. One capitalised word for emphasis can work, but whole titles in capitals read as shouting and tend to lower trust. The generator avoids words in capitals and uses at most one emoji across the set."],
    ["Will the AI make up facts about my channel?", "No. Neither the AI nor the built-in patterns invent numbers, results or credentials. If a title needs a figure only you know, add it yourself before you publish."],
    ["What should I do after picking a title?", "Score it with the title analyzer, write the description around the same phrase, and make sure the thumbnail adds something the title does not say."],
  ],
};
