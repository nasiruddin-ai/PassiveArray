// Long-form guide for /creator-tools/youtube-embed-code-generator/. Matches COMPUTE["youtube-embed-code-generator"]:
// iframe with start, end, autoplay, mute, loop (+playlist), cc_load_policy, controls; youtube-nocookie.com option. Browser only.
module.exports = {
  seoTitle: "YouTube Embed Code Generator: Start Time, Autoplay, Loop | Passive Array",
  seoDescription: "Free YouTube embed code generator. Get iframe code with start and end times, autoplay, mute, loop, captions and privacy-enhanced mode, plus a responsive version.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to embed a YouTube video",
      ordered: true,
      list: [
        "Paste the video's link.",
        "Choose a start and stop time if you only want part of it, and the player options you need.",
        "Pick a fixed size or Responsive, copy the embed code and paste it into your page's HTML.",
      ],
      p: ["The preview plays exactly what the code will show, so you can check the start time and options before you publish."],
    },
    {
      h: "The options",
      table: {
        head: ["Option", "Parameter", "What it does"],
        rows: [
          ["Start at", "start", "Begins playback at that second"],
          ["Stop at", "end", "Stops playback at that second"],
          ["Autoplay", "autoplay=1", "Starts playing when the page loads; browsers usually require it to be muted"],
          ["Start muted", "mute=1", "Starts without sound"],
          ["Loop", "loop=1 with playlist=ID", "Plays the video again when it ends; a single video needs the playlist parameter too, which the tool adds"],
          ["Captions on", "cc_load_policy=1", "Shows captions by default, where the video has them"],
          ["Hide controls", "controls=0", "Removes the player controls"],
          ["Privacy-enhanced mode", "youtube-nocookie.com", "Uses YouTube's privacy-enhanced domain"],
        ],
      },
    },
    {
      h: "Responsive or fixed size",
      p: [
        "A fixed size like 560 x 315 can overflow on phones. The responsive code wraps the player in a box that keeps a 16:9 shape and fills the width of whatever it sits in, which suits most modern sites and page builders.",
        "Squarespace, WordPress and Wix all accept the code in an HTML or embed block.",
      ],
    },
    {
      h: "When the video will not play",
      list: [
        "The owner turned off embedding. The preview shows an error; only the owner can change it.",
        "The video is private, or age-restricted, which cannot be played in an embed.",
        "Autoplay with sound is blocked by the browser. Turn on Start muted.",
      ],
      p: ["For a plain link that starts at a moment instead of an embed, use the <a href=\"../youtube-timestamp-link-generator/\">timestamp link generator</a>."],
    },
  ],
  faq: [
    ["How do I make an embedded YouTube video start at a certain time?", "Type the time in Start at, for example 1:30. The tool converts it to seconds and adds start=90 to the embed code."],
    ["Why does autoplay not work?", "Most browsers block videos that start playing with sound. Turn on Start muted together with Autoplay and it will start on its own."],
    ["What is privacy-enhanced mode?", "An embed from youtube-nocookie.com. YouTube says that in this mode it does not store information about visitors to your site unless they play the video."],
    ["Can I embed a YouTube Short?", "Yes. Paste the Shorts link; the tool uses the video's ID, so the Short plays in the standard embedded player."],
  ],
};
