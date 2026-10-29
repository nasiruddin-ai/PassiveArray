// Long-form guide for /creator-tools/youtube-timestamp-link-generator/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["youtube-timestamp-link-generator"] in public/shared.js: watch link with &t=<s>s,
// youtu.be link with ?t=<s>, embed with ?start=<s>. Shorts links are refused. Runs in the browser.
module.exports = {
  seoTitle: "YouTube Timestamp Link Generator: Start at Any Time | Passive Array",
  seoDescription: "Free YouTube timestamp link generator. Make a link that starts a video at any moment, plus the short link and embed code. Works with 1:30, 1:02:15 or seconds.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to link to a time in a YouTube video",
      ordered: true,
      list: [
        "Paste the video's link. Watch links, youtu.be links and the 11-character ID all work.",
        "Type the start time as 1:30, 1:02:15, 90 or 1m30s.",
        "Copy the watch link, the short link or the embed code. Use <b>Test the link</b> to check it opens at the right moment.",
      ],
    },
    {
      h: "The three formats",
      table: {
        head: ["Format", "Example", "Use it for"],
        rows: [
          ["Watch link", "youtube.com/watch?v=ID&t=90s", "Messages, emails, documents"],
          ["Short link", "youtu.be/ID?t=90", "Social posts and anywhere characters count"],
          ["Embed code", "youtube.com/embed/ID?start=90", "Putting the video on a website"],
        ],
      },
    },
    {
      h: "Timestamps in comments and descriptions",
      p: [
        "In a comment, type a time such as 4:32 and YouTube makes it a clickable link to that moment in the same video.",
        "In your own description, a list of times that starts at 0:00, with at least three entries and each section at least 10 seconds long, becomes chapters on the progress bar. The full how-to is in <a href=\"../../blog/youtube-timestamp-link/\">how to link to a specific time in a YouTube video</a>.",
      ],
    },
  ],
  faq: [
    ["Does it work on Shorts?", "No. Shorts loop and do not support start times, so the tool asks for a regular video link."],
    ["Why does my link start from the beginning?", "Usually the time was written as t=1:30, which YouTube does not read. Use seconds or the 1m30s form. This tool writes it correctly for you."],
    ["Can I set an end time?", "Embeds support an end parameter, but regular watch links do not. This tool sets start times only."],
    ["Is anything sent to a server?", "No. The links are built in your browser from the video ID."],
  ],
};
