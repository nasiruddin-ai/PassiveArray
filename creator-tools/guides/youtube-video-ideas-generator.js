// Long-form guide for /creator-tools/youtube-video-ideas-generator/. Merged into tools.js by build-tools.js.
// Matches the yt_ideas prompt in api/creator-ai.js (12 ideas, hook under 15 words, format respected)
// and ytIdeasLocal() in public/shared.js (12 patterns from the shared idea pool, seeded from niche + audience,
// so the same inputs give the same set; the format box only sets the label in built-in mode).
module.exports = {
  seoTitle: "YouTube Video Ideas Generator: 12 Free Ideas | Passive Array",
  seoDescription: "Free YouTube video ideas generator, no sign-up. Type your niche and audience to get twelve specific video ideas, each with an opening hook and a format.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube video ideas generator gives you",
      p: ["Type what your channel is about and who watches it, then pick a format: a mix, long-form only, or Shorts only. You get twelve ideas. Each one has:"],
      list: [
        "<b>A title you could publish</b>, not a vague category like \"tips\" or \"vlogs\".",
        "<b>A hook</b>: the first line you would say on camera, written to hold viewers through the opening seconds.",
        "<b>A format</b>, Shorts or Long-form, so you know what kind of video each idea wants.",
      ],
      after: [
        "Copy all twelve with one click. Each line comes out as the title followed by its hook, ready for a notes app or a content calendar.",
      ],
    },
    {
      h: "Where the ideas come from",
      p: [
        "When the AI writer is on, it writes twelve ideas for your exact niche and audience. It is told to make every title specific enough to film tomorrow, to keep each hook under 15 words, to vary the angle across how-to, mistakes, comparison, story, test and contrarian, and to respect your format choice. Like every generator on this site, it is told never to invent facts.",
        "When the AI writer is off, twelve proven content patterns are filled with your niche and audience. The set is picked from your inputs, so the same niche and audience always give the same twelve. To see a different set, change the wording, for example \"home espresso\" instead of \"coffee at home\". In this mode the format box sets the label on each idea rather than changing which ideas you get.",
        "Some patterns assume you have something to show, such as a client story or a before and after. Only film those if you have the real story. An idea is a prompt, not a claim you have to make.",
      ],
    },
    {
      h: "How to pick the right video idea",
      p: ["Twelve ideas is a shortlist, not a schedule. Run each one past these checks before you film it:"],
      ordered: true,
      list: [
        "<b>Can you deliver on the title?</b> If the video cannot back up the promise, viewers leave early, and that does more harm than a modest title.",
        "<b>Is anyone searching for it?</b> Put the core phrase into the <a href=\"../youtube-keyword-generator/\">keyword generator</a>, then search it on YouTube and look at who ranks. Channels your size getting good views is a good sign.",
        "<b>Does the hook work out loud?</b> Say it to camera. If it sounds like an advert, rewrite it in the words you would use with a friend.",
        "<b>Does it suit the format?</b> One quick point fits a Short. Anything with steps, a comparison or a story usually needs long-form.",
        "<b>Would your current viewers want it?</b> Ideas that pull a different audience can grow a channel, but too many confuse it.",
      ],
    },
    {
      h: "Shorts or long-form: which format should an idea be?",
      p: ["The generator labels every idea. If you are unsure whether the label fits, use this as a rough guide:"],
      table: {
        head: ["The idea is...", "Better as", "Why"],
        rows: [
          ["One tip, one fix, one myth", "Shorts", "It lands in under a minute with no setup"],
          ["A step-by-step how-to", "Long-form", "Viewers need time to follow along"],
          ["A comparison or test", "Long-form", "The proof is what makes it believable"],
          ["A reaction, before and after, or quick reveal", "Shorts", "It works on the visual alone"],
          ["A story or a lesson learned", "Either", "Short as a teaser, long as the full account"],
        ],
      },
      after: ["Many channels do both: a Short that makes one point, and a long video that covers the whole topic. If your Shorts get views, they can point people to the long version."],
    },
    {
      h: "What to do once you have picked an idea",
      ordered: true,
      list: [
        "Turn the idea into a few title options with the <a href=\"../youtube-title-generator/\">title generator</a>, and keep the strongest one under 60 characters.",
        "Plan the video with the <a href=\"../youtube-script-outline-generator/\">script outline generator</a>. Use the hook from this tool as your starting point for the opening.",
        "After filming, write the description with the <a href=\"../youtube-description-generator/\">description generator</a>.",
        "Still unsure what your channel should cover at all? Start a step earlier with the <a href=\"../youtube-niche-finder/\">niche finder</a>.",
      ],
      after: ["To see what is working in your niche right now, browse the <a href=\"../../research/outliers/\">outlier feed</a>: videos doing several times their channel's usual views. Borrow the pattern, never the video."],
    },
  ],
  faq: [
    ["Is this YouTube video ideas generator free?", "Yes. No sign-up and no account. Generate as many sets as you like."],
    ["Why do I get the same ideas every time?", "In built-in mode, the twelve ideas are picked from your niche and audience, so the same words give the same set. Change the wording of either box to get a different twelve. When the AI writer is on, each run is written fresh."],
    ["Can I use these as Shorts ideas?", "Yes. Set the format to Shorts only. With the AI writer on, all twelve are written as Shorts. In built-in mode, the format sets the label, so check that each idea really fits under a minute."],
    ["Will the AI make up results or stories for me?", "No. It is told never to invent facts. Some ideas suggest a story or a before and after. Only make those if you have the real thing to show."],
    ["How do I know if an idea will get views?", "No tool can promise that. Search the core phrase on YouTube, look at who ranks and how many views they get, and check the idea in the keyword generator. Smaller channels ranking well is the best sign you have a chance."],
    ["What makes a good YouTube hook?", "It opens on the problem or the result, never on a greeting. It tells the viewer why to keep watching in one sentence. Each idea here comes with one; say it out loud and adjust it to sound like you."],
    ["How many ideas should I film?", "Pick two or three that pass the checks above. Making a few well beats making all twelve quickly."],
    ["Does this work for any niche?", "Yes. It works from whatever niche and audience you type. The more specific you are, the more specific the ideas."],
  ],
};
