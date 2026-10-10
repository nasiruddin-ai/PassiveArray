// Guide and FAQ for /creator-tools/instagram-content-ideas-generator/. Merged into tools.js by build-tools.js.
// Matches action "ideas" in api/creator-ai.js (12 ideas, hook under 12 words, format respected, never invent facts)
// and ideasLocal()/IDEA_PATTERNS in public/shared.js (30 patterns, 12 picked by a seed from niche + audience + format).
module.exports = {
  seoTitle: "Instagram Content Ideas Generator: 12 Post Ideas | Passive Array",
  seoDescription: "Get 12 Instagram post ideas for your niche and audience, each with a hook line and a format: reel, carousel, story or post. Free, no sign-up needed.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to get Instagram content ideas for your niche",
      ordered: true,
      list: [
        "Type your niche, for example \"web design\" or \"home baking\".",
        "Describe your audience, for example \"small business owners\".",
        "Choose a format: mixed, reels, carousels, stories or single posts.",
        "Press the button. You get 12 ideas, each with a title, a hook line and a format.",
      ],
      after: [
        "The hook is the line that stops the scroll. Use it as the first line of the caption, or as the text on screen in the first second of a reel. Before you post, run the caption through the <a href=\"../instagram-caption-analyzer/\">caption analyzer</a> to check the hook fits in the first 125 characters.",
      ],
    },
    {
      h: "Where the ideas come from",
      p: [
        "When the site's AI writer is switched on, it writes 12 ideas specific to your niche and audience, with hooks under 12 words. It respects the format you chose and, for mixed, spreads ideas across reels, carousels, posts and stories. It is told to use only what you typed and never to invent facts or numbers.",
        "When the AI is not available, the tool picks 12 from 30 built-in patterns, such as mistakes, myths, before and after, checklists, behind the scenes and polls, and fills them with your niche and audience. The same inputs always give the same 12, so change the format or reword the niche to see others. The note under the results tells you which version you got.",
      ],
    },
    {
      h: "Turn the ideas into posts you can stand behind",
      list: [
        "<b>Make every claim true.</b> Some pattern hooks mention results, such as a change that doubled results for a client. Use those only if you have a real example, or rewrite the hook.",
        "<b>Match the idea to the format.</b> Step-by-step and list ideas suit carousels. Quick wins and before and after suit reels. Polls and question boxes belong in stories.",
        "<b>Plan the week, not the day.</b> Pick three ideas, batch them, and post them on the days you can keep up. The <a href=\"../instagram-growth-advisor/\">growth advisor</a> suggests how often to post for your goal.",
      ],
      after: ["Add a matching tag set with the <a href=\"../instagram-hashtag-generator/\">hashtag generator</a>."],
    },
  ],
  faq: [
    ["What should I post on Instagram when I have no ideas?", "Start with the questions your audience asks you most. Then try a mistakes list, a myth busted, or a before and after from your own work. The generator gives you 12 starting points in one go."],
    ["Are these ideas based on what is trending right now?", "No. The tool does not read Instagram data or trends. It turns proven content patterns, or the AI's suggestions, into ideas for your niche."],
    ["Why do I get the same ideas every time?", "Without the AI, the picks are fixed for the same niche, audience and format. Change any of the three for a new set."],
    ["Can I ask for reels only?", "Yes. Choose Reels as the format. Without the AI, the built-in patterns run short for a single format, so some ideas in the 12 come from patterns written for other formats and may need adapting."],
    ["Is the Instagram content ideas generator free?", "Yes. There is no sign-up."],
  ],
};
