// Long-form guide for /creator-tools/youtube-channel-name-generator/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["youtube-channel-name-generator"] in public/shared.js: built in the browser, no AI, up to 20 names,
// role words and prefixes from NAME_ROLES / NAME_PREFIX per style, names over 20 characters flagged "Gets cut off".
module.exports = {
  seoTitle: "YouTube Channel Name Generator: 20 Free Ideas | Passive Array",
  seoDescription: "Free YouTube channel name generator, no sign-up. Type your subject and pick a style to get up to 20 name ideas, with long names flagged before you commit.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this YouTube channel name generator gives you",
      p: ["Type what the channel is about, optionally add your name or a word you like, and pick a style. You get up to 20 names, each with:"],
      list: [
        "<b>A character count.</b>",
        "<b>A mobile check.</b> Anything over 20 characters is marked \"Gets cut off\", because long names are often shortened next to a video on a phone.",
      ],
      after: [
        "Copy the whole list with one click. The names are built in your browser from naming patterns, not by AI, so the same subject and style always give the same list. Change the wording or the style to see new ones.",
      ],
    },
    {
      h: "Which channel name style should you pick?",
      p: ["Each style adds a different set of words to your subject. With \"home coffee\" as the subject, you would see names like these:"],
      table: {
        head: ["Style", "Words it adds", "Example"],
        rows: [
          ["Descriptive", "Hub, Lab, Works, Studio, Guide, School, Notes, Daily, Weekly, Report", "Home Coffee Lab"],
          ["Personal", "Talks, Tries, Tests, Builds, Makes, Explains, Reviews", "Home Coffee Tests"],
          ["Authority", "Institute, Authority, Academy, Journal, Collective, Standard, Society, Bureau", "Home Coffee Journal"],
          ["Playful", "Gang, Club, Corner, Nest, Pals, Crew, Shack, Den, Cave, Squad", "Home Coffee Club"],
        ],
      },
      after: [
        "Every style also adds short prefixes such as \"The\" or \"Hey\", two one-word compounds such as CoffeeHome, and, when there is room in the 20, a few fixed patterns like \"Everyday Home Coffee\" and \"Home Coffee Made Simple\". If you add your name, you also get personal versions such as \"Sam Does Home Coffee\".",
        "<b>Descriptive</b> is the safest choice when people search for your subject. <b>Personal</b> suits channels where you are the reason people watch. <b>Authority</b> fits teaching and review channels. <b>Playful</b> is easiest to remember, but says less about the topic.",
      ],
    },
    {
      h: "How to choose a good YouTube channel name",
      ordered: true,
      list: [
        "<b>Keep it short.</b> Aim for 20 characters or fewer so it shows in full on phones. The tool flags anything longer.",
        "<b>Make it easy to say and spell.</b> If someone hears it once, can they type it into search? Avoid odd spellings and numbers that could be written two ways.",
        "<b>Leave room to grow.</b> A name tied to one product or one year can feel dated later. Some of the generated names include the current year, so think twice before picking those.",
        "<b>Check it is not someone else's brand.</b> Search the name on YouTube and on the web. A name close to an established channel or company confuses viewers and can cause trouble.",
        "<b>Say it out loud.</b> Read it as you would in an intro. If it feels awkward, it will feel awkward every video.",
      ],
    },
    {
      h: "How to check if a YouTube name or handle is taken",
      p: [
        "This tool cannot check availability. It has no access to YouTube's handle list. Before you commit, do two quick checks yourself:",
      ],
      list: [
        "Open <b>youtube.com/@yourname</b> in your browser. If a channel loads, that handle is taken.",
        "Search the name in YouTube search and on the web to see whether anyone already uses it as a brand.",
      ],
      after: [
        "Your channel has a name and a handle, and they are different things. Handles must be unique; channel names do not. That means you can often keep the name you want even if you need a small variation for the handle. You set and change both in YouTube Studio. As of October 2026, YouTube limits how often you can change them, so confirm the current rules in Studio before you rename.",
      ],
    },
    {
      h: "What to do after you pick a name",
      p: [
        "A name works best when the channel behind it is clear. If you are still deciding what to cover, use the <a href=\"../youtube-niche-finder/\">niche finder</a> before you settle on a name, so the two match.",
        "Once the name is set, plan your first uploads with the <a href=\"../youtube-video-ideas-generator/\">video ideas generator</a>, and find the phrases your audience searches with the <a href=\"../youtube-keyword-generator/\">keyword generator</a>. Your name gets you remembered; your videos get you found.",
      ],
    },
  ],
  faq: [
    ["Is this YouTube channel name generator free?", "Yes. No sign-up and no account. It runs in your browser."],
    ["Can this tool tell me if a channel name is available?", "No. It cannot see YouTube's handle list. Open youtube.com/@thename to check the handle, and search the name to make sure nobody uses it as a brand."],
    ["How long should a YouTube channel name be?", "Short enough to show in full on a phone. This tool flags anything over 20 characters as likely to be cut off."],
    ["Should my channel name include keywords?", "It can help people see what you cover, which is why the descriptive style is built around your subject. But your titles and descriptions matter far more for search than your name does. A memorable name is worth more than one stuffed with keywords."],
    ["Should I use my real name for my YouTube channel?", "If you are the reason people watch, a personal name travels with you to any topic. If you might sell or hand over the channel one day, a topic name is easier to pass on."],
    ["Can I change my YouTube channel name later?", "Yes, in YouTube Studio. As of October 2026 there are limits on how often you can change your name and handle, so check the current rules in Studio first."],
    ["Why do I get the same names every time?", "The names are built from fixed patterns, not AI, so the same subject and style give the same list. Try a different style, add a word about you, or phrase the subject differently."],
    ["Is a channel name the same as a handle?", "No. The handle is your unique @address. The name is what shows on your channel and videos, and it does not have to be unique."],
  ],
};
