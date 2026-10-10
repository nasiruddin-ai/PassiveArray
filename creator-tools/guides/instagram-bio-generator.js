// Guide and FAQ for /creator-tools/instagram-bio-generator/. Merged into tools.js by build-tools.js.
// Matches action "bio" in api/creator-ai.js (5 bios, 150 characters, at most two emoji, none for minimal,
// never invent facts) and bioLocal()/bioOut()/BIO_TEMPLATES in public/shared.js (5 templates per tone, count shown per bio).
module.exports = {
  seoTitle: "Instagram Bio Generator: 5 Bios Under 150 Chars | Passive Array",
  seoDescription: "Write an Instagram bio that says what you do, who it is for and what to tap next. Free, no sign-up: five options in your tone, each with a character count.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to write an Instagram bio with this generator",
      ordered: true,
      list: [
        "Type your name or brand, what you do in a few words, and who it is for.",
        "Write the one action you want visitors to take, such as \"Book a free call\". The default is \"Link below\".",
        "Pick a tone: friendly, professional, bold, playful or minimal.",
        "Press the button and you get five bios. Each shows its length out of 150 characters, in green if it fits and red if it does not.",
      ],
      after: [
        "When the site's AI writer is switched on, the bios are written fresh from your inputs, with no more than two emoji each and none in the minimal tone. It is told to use only what you typed and never to invent facts, client counts, awards or testimonials. When the AI is not available, five ready-made templates for your tone are filled in instead. The note under the results tells you which one you got.",
      ],
    },
    {
      h: "What makes a good Instagram bio?",
      p: ["Every option follows the same order, because a visitor decides whether to follow in a few seconds:"],
      list: [
        "<b>What you do</b>, in plain words a stranger understands.",
        "<b>Who it is for</b>, so the right people recognise themselves.",
        "<b>Proof or personality</b>, one short line that sets you apart.",
        "<b>The call to action</b> on the last line, pointing to your link.",
      ],
      after: [
        "Instagram limits the bio to 150 characters, as of October 2026. Check the count in the app after you paste, because line breaks and emoji are counted there too.",
      ],
    },
    {
      h: "Check every bio before you use it",
      p: [
        "Treat the results as drafts. Some templates include lines such as \"Trusted by...\" or \"Real results\". Keep a line like that only if it is true for you, and swap it for something specific if you can. A real detail, such as the city you work in or the type of client you serve, beats a vague claim.",
        "Once the bio is live, the rest of the profile has to back it up. The <a href=\"../instagram-content-ideas-generator/\">content ideas generator</a> helps you fill the grid with posts for the same audience, and the <a href=\"../instagram-caption-analyzer/\">caption analyzer</a> checks each caption before it goes out.",
      ],
    },
  ],
  faq: [
    ["How many characters can an Instagram bio have?", "150, as of October 2026. The generator shows a count under each option so you can see which ones fit. Confirm in the app, since emoji and line breaks are counted there."],
    ["Will the generator make up facts about me?", "It should not. The AI is told to use only what you type and to write around anything you leave empty. The templates only fill in your own words. Still, read every bio and remove any line that is not true for you."],
    ["Can I get different bios if I do not like these?", "Try another tone, or change how you describe what you do and who it is for. The templates give the same five results for the same inputs; the AI version varies more."],
    ["Is my information stored?", "Your inputs are sent to the site's server only to write the bios, and to the AI model when it is switched on. Passive Array does not ask for an account."],
    ["Is the Instagram bio generator free?", "Yes. There is no sign-up."],
  ],
};
