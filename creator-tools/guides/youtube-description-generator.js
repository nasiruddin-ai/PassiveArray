// Long-form guide for /creator-tools/youtube-description-generator/. Merged into tools.js by build-tools.js.
// Matches the yt_description prompt in api/creator-ai.js and ytDescriptionLocal()/ytDescriptionOut() in public/shared.js:
// 5,000 character limit shown, first two lines checked, AI writes 4 to 6 placeholder chapters and 3 to 5 hashtags,
// the built-in template writes 5 chapters, placeholder links and hashtags from the topic plus up to 3 related keywords.
module.exports = {
  seoTitle: "YouTube Description Generator With Timestamps | Passive Array",
  seoDescription: "Free YouTube description generator, no sign-up. Get a keyword-led opening, chapter timestamps, links and hashtags, with [placeholders] instead of made-up facts.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube description generator writes",
      p: ["Type your topic. Add a few bullet points on what the video covers and some related keywords if you have them. You get one description, laid out in this order:"],
      list: [
        "<b>Two opening lines</b> that repeat your main keyword. These are the lines viewers see before they tap \"more\".",
        "<b>A short paragraph</b> on what the viewer will learn, taken from your notes.",
        "<b>A Timestamps section</b> with placeholder chapters in the form 00:00 Chapter name.",
        "<b>A Links section</b> with lines like [Your website] for you to fill in.",
        "<b>Hashtags</b> on the last line.",
      ],
      after: [
        "Under the text you see the character count against YouTube's 5,000 limit, a preview of the first two lines, and how many timestamps and hashtags the description contains. Copy it with one click and paste it into YouTube Studio.",
      ],
    },
    {
      h: "Does it make anything up?",
      p: [
        "No. When the AI writer is on, it is told to use only what your notes say and to write anything unknown as a placeholder in square brackets. It will not invent your results, your client count, your sponsors or your links.",
        "When the AI writer is off, a fixed template is filled with your topic instead. It writes five sample chapters (Intro, what the topic is, step by step, common mistakes, final tips), placeholder links, and hashtags built from your topic plus up to three of your related keywords. If you leave the notes empty, it leaves a bracketed prompt for you to write two or three sentences yourself.",
        "Either way, the output is a draft. Replace every [square bracket] and set every timestamp to a real moment in your video before you publish.",
      ],
    },
    {
      h: "How to write a good YouTube description",
      ordered: true,
      list: [
        "<b>Put the main phrase in the first line.</b> Use the words people search, the same ones that lead your title. The <a href=\"../youtube-keyword-generator/\">keyword generator</a> helps you pick them.",
        "<b>Make the first two lines a reason to watch.</b> In search and under the player, that is often all that shows. Do not spend them on \"Hi everyone\" or a list of your socials.",
        "<b>Say what the viewer will learn, plainly.</b> Two or three sentences in your own words. This also tells YouTube what the video is about.",
        "<b>Add real chapter timestamps.</b> They help viewers skip to what they need and can show up as chapters on the progress bar.",
        "<b>Put links after the summary, not before it.</b> Your website, a free resource, the next video. One clear next step beats ten links.",
        "<b>End with a few hashtags.</b> Three to five specific ones is plenty. Build a set with the <a href=\"../youtube-hashtag-generator/\">hashtag generator</a>.",
      ],
    },
    {
      h: "How to add timestamps and chapters to a YouTube video",
      p: [
        "Chapters come from the timestamps in your description. As of October 2026, YouTube's rules are: the first timestamp must be 00:00, you need at least three timestamps in ascending order, and each chapter must be at least 10 seconds long. Confirm the current rules in YouTube Studio help, because they can change.",
        "The generator's timestamps are placeholders, not your real chapters. Here is how the template's sample list compares with what you should end up with:",
      ],
      table: {
        head: ["Template line", "What to replace it with"],
        rows: [
          ["00:00 Intro", "Keep 00:00, but name it after what happens, such as \"The problem\""],
          ["00:45 What the topic is", "The real second the explanation starts"],
          ["03:10 Step by step", "One line per step if the steps are long"],
          ["07:30 Common mistakes", "Delete it if your video has no such section"],
          ["10:00 Final tips", "The time your closing section actually begins"],
        ],
      },
      after: ["Name chapters with words people search, not inside jokes. A chapter called \"How to fix blurry photos\" can help viewers find that exact moment."],
    },
    {
      h: "How long should a YouTube description be?",
      p: [
        "YouTube allows up to 5,000 characters. You rarely need that many. What matters is that the first two lines work on their own and that the rest is useful to someone who opens it.",
        "A description built by this tool is usually a few hundred characters before you add your own notes and links. That is fine. A longer description only helps if the extra text is real: a fuller summary, chapter names, the resources you mention. Stuffing it with repeated keywords does not help, and YouTube's spam policies cover misleading metadata, so keep every line honest.",
        "The description supports the title rather than replacing it. Write the title first with the <a href=\"../youtube-title-generator/\">title generator</a>, then add tags last with the <a href=\"../youtube-tag-generator/\">tag generator</a>. Tags play a small role, as we explain in <a href=\"../../blog/do-youtube-tags-still-matter/\">do YouTube tags still matter</a>.",
      ],
    },
  ],
  faq: [
    ["Is this YouTube description generator free?", "Yes. No sign-up and no account. Generate as many descriptions as you like and copy them straight into YouTube Studio."],
    ["What is the character limit for a YouTube description?", "5,000 characters. The tool shows how many you have used. Only the first two lines or so show before viewers tap \"more\", so put the important part there."],
    ["Will the AI invent facts about me or my video?", "No. It is told to use only what your notes say and to write anything unknown as a [placeholder]. The built-in template does the same. Replace every bracket before you publish."],
    ["Should I put keywords in my YouTube description?", "Yes, naturally. Use your main phrase in the first line and related phrases where they describe the video. Repeating a keyword over and over does not help and can count as misleading metadata."],
    ["Do timestamps in the description really create chapters?", "Yes, when they follow YouTube's format: the first one at 00:00, at least three in order, and each chapter at least 10 seconds long (as of October 2026). The generated timestamps are samples, so set them to your real chapters."],
    ["How many hashtags should a YouTube description have?", "A few specific ones. The AI writes three to five. The built-in template makes one from your topic and one from each of up to three related keywords. More rarely helps."],
    ["Can I edit a description after the video is live?", "Yes, at any time in YouTube Studio. Updating an old description with chapters, a clearer opening or a link to a newer video is a quick improvement."],
    ["What should I fill in the notes box?", "Three to five bullet points in your own words on what the video covers. The more specific they are, the better the summary paragraph. If you leave it empty, the tool leaves a placeholder for you to write that part."],
  ],
};
