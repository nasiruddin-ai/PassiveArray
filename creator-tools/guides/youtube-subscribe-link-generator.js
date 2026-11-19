// Long-form guide for /creator-tools/youtube-subscribe-link-generator/. Matches
// COMPUTE["youtube-subscribe-link-generator"]: appends ?sub_confirmation=1 to an @handle, /channel/, /c/ or /user/ path. Runs in the browser.
module.exports = {
  seoTitle: "YouTube Subscribe Link Generator: Auto Subscribe Prompt | Passive Array",
  seoDescription: "Free YouTube subscribe link generator. Make a link that opens your channel with the subscribe prompt showing, plus HTML button, Markdown and text versions.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to make a YouTube subscribe link",
      ordered: true,
      list: [
        "Paste your channel link or type your @handle.",
        "Press Make subscribe link.",
        "Copy the plain link, the HTML button or the Markdown version, and use Test it to check the prompt appears.",
      ],
    },
    {
      h: "How it works",
      p: [
        "The link is your normal channel address with <code>?sub_confirmation=1</code> on the end, for example <code>youtube.com/@yourchannel?sub_confirmation=1</code>. When a signed-in viewer opens it, YouTube shows the subscribe confirmation straight away, so subscribing takes one tap.",
        "Viewers who are not signed in see your channel and are asked to sign in first.",
      ],
    },
    {
      h: "Where to use it",
      table: {
        head: ["Place", "Format to copy"],
        rows: [
          ["Video descriptions and pinned comments", "Text for a description"],
          ["Your website or blog", "HTML button or HTML link"],
          ["Email newsletter", "Subscribe link"],
          ["GitHub, Notion, Discord, forums", "Markdown"],
          ["Instagram or TikTok bio", "Subscribe link"],
        ],
      },
      p: ["Ask for the subscribe after you have delivered something useful. A link in front of viewers who already like the video converts far better than one at the top of a description."],
    },
    {
      h: "Which channel address to use",
      list: [
        "<b>@handle</b>: short and readable, and the one viewers recognise.",
        "<b>/channel/UC...</b>: never changes, even if you change your handle. Find yours with the <a href=\"../youtube-channel-id-finder/\">channel ID finder</a>.",
        "<b>/c/ or /user/</b>: older custom addresses still work if your channel has one.",
      ],
    },
  ],
  faq: [
    ["Does the subscribe link subscribe people automatically?", "No. It opens the subscribe confirmation; the viewer still has to confirm. Nothing subscribes anyone without their choice."],
    ["Does it work on phones?", "Yes in a mobile browser. If the link opens in the YouTube app instead, the app may show the channel without the prompt, which is still one tap from subscribing."],
    ["Will the link break if I change my handle?", "A link with your old @handle can stop working after a change. Use the /channel/UC... version if you want a link that lasts."],
    ["Is this link allowed by YouTube?", "Yes. It is a normal channel link with a parameter YouTube itself reads. It does not offer anything in exchange for subscribing, which is what YouTube's policies forbid."],
  ],
};
