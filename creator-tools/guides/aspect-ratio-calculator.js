// Long-form guide for /creator-tools/aspect-ratio-calculator/. Matches COMPUTE["aspect-ratio-calculator"]:
// gcd-reduced ratio, resize keeping the ratio, platform fit from YouTube Help 6375112/1722171 and Instagram Help (Reels 1.91:1 to 9:16).
module.exports = {
  seoTitle: "Aspect Ratio Calculator: 16:9, 9:16 and Resize Without Stretching | Passive Array",
  seoDescription: "Free aspect ratio calculator. Find the ratio of any width and height, resize without stretching, and see YouTube's 16:9 resolutions and Shorts and Reels sizes.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to use the aspect ratio calculator",
      ordered: true,
      list: [
        "Enter the width and height in pixels, for example 1920 and 1080.",
        "Read the ratio. 1920 x 1080 is 16:9; 1080 x 1920 is 9:16.",
        "To resize, type a new width or a new height. The calculator gives the other side so the picture keeps its shape.",
      ],
      p: ["The ratio is found by dividing both sides by their greatest common divisor. To resize, multiply the new width by height / width, or the new height by width / height."],
    },
    {
      h: "Common aspect ratios",
      table: {
        head: ["Ratio", "Shape", "Typical use"],
        rows: [
          ["16:9", "Landscape", "YouTube videos; the standard on a computer, per YouTube Help"],
          ["9:16", "Vertical", "Shorts, Reels and Stories, full screen on a phone"],
          ["1:1", "Square", "Square feed posts"],
          ["4:5", "Vertical", "Portrait feed posts"],
          ["4:3", "Landscape", "Older TV and some cameras"],
          ["21:9", "Wide", "Cinematic footage"],
        ],
      },
    },
    {
      h: "YouTube's 16:9 resolutions",
      p: ["YouTube Help lists these resolutions for the default 16:9 aspect ratio:"],
      table: {
        head: ["Name", "Width x height"],
        rows: [["4320p (8K)", "7680 x 4320"], ["2160p (4K)", "3840 x 2160"], ["1440p (2K)", "2560 x 1440"], ["1080p (HD)", "1920 x 1080"], ["720p (HD)", "1280 x 720"], ["480p (SD)", "854 x 480"], ["360p (SD)", "640 x 360"], ["240p (SD)", "426 x 240"]],
      },
    },
    {
      h: "Vertical and other shapes",
      list: [
        "<b>YouTube:</b> the player adapts itself to vertical and square videos. YouTube Help says to avoid adding padding or black bars to the video, because that stops the player from fitting the video to the screen.",
        "<b>Instagram Reels:</b> Instagram Help says you can upload a reel with an aspect ratio between 1.91:1 and 9:16. See our <a href=\"../../blog/instagram-story-size/\">Instagram Story and Reel size guide</a>.",
        "<b>Thumbnails:</b> a thumbnail is a 16:9 image too. Preview one at real sizes with the <a href=\"../youtube-thumbnail-tester/\">thumbnail tester</a>.",
      ],
    },
  ],
  faq: [
    ["What aspect ratio is 1920 x 1080?", "16:9. Both sides divide by 120: 1920 / 120 = 16 and 1080 / 120 = 9."],
    ["How do I calculate the height for a 16:9 width?", "Multiply the width by 9 and divide by 16. For 1280 pixels wide that is 720 pixels high."],
    ["What is the aspect ratio for YouTube Shorts?", "Shorts are vertical. 9:16, for example 1080 x 1920, fills a phone screen. YouTube's player adapts to vertical video, so you do not need to add bars."],
    ["Why is 854 x 480 not exactly 16:9?", "Because 480 x 16 / 9 is 853.33, which is not a whole number. 854 is the nearest even width, and it is the size YouTube Help lists for 480p."],
    ["Why round video sizes to even numbers?", "Most video encoders need even widths and heights, so the calculator rounds the side it works out to an even number of pixels."],
  ],
};
