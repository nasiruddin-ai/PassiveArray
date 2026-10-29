// Long-form guide for /creator-tools/youtube-thumbnail-tester/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["youtube-thumbnail-tester"] in public/shared.js: dimension, 16:9, 2 MB and format checks,
// plus contrast (luminance standard deviation) and clutter (edge share) on a 168px-wide copy. Runs in the browser.
module.exports = {
  seoTitle: "YouTube Thumbnail Tester: Preview at Real Feed Sizes | Passive Array",
  seoDescription: "Free YouTube thumbnail tester. See your thumbnail in the phone feed and suggested videos, light and dark, and check size, 16:9 ratio, the 2 MB limit and clutter.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to test a YouTube thumbnail",
      ordered: true,
      list: [
        "Choose your thumbnail image. JPG, PNG and GIF work, ideally exported at 1280 x 720.",
        "Add the title you plan to use, and your channel name if you want the preview to look exact. Both are optional.",
        "Press the button. You get a list of checks, each marked Good, Check or Fix, and previews at the sizes viewers see.",
      ],
      after: ["The image never leaves your browser. Nothing is uploaded or stored, so you can test unreleased designs safely."],
    },
    {
      h: "What each check means",
      table: {
        head: ["Check", "What passes", "Why it matters"],
        rows: [
          ["Dimensions", "1280 x 720 or larger", "YouTube serves thumbnails up to 1280 x 720. Smaller images look soft; under 640 wide is refused."],
          ["Aspect ratio", "16:9", "Anything else gets bars or cropping."],
          ["File size", "Under 2 MB", "YouTube refuses larger thumbnail files."],
          ["Format", "JPG, PNG or GIF", "The formats YouTube lists for thumbnails."],
          ["Contrast at small size", "Strong light and dark areas", "Mid-tone images disappear in a feed."],
          ["Clutter at small size", "Few hard edges at 168 pixels", "Lots of small detail and text turns into noise when shrunk."],
          ["Bottom-right corner", "Clear", "YouTube draws the video length over this corner."],
        ],
      },
      after: ["Contrast and clutter are rules of thumb measured on the pixels, not a prediction of click-through rate. A thumbnail can pass every check and still not suit the video. Use them to catch problems, then judge the previews yourself."],
    },
    {
      h: "Why test at small sizes",
      p: [
        "You design a thumbnail at 1280 pixels wide, but viewers see it at a fraction of that: about 360 pixels in the phone home feed, and around 168 in the suggested videos beside a playing video on desktop. Text and detail that look clear on your screen often cannot be read at those sizes.",
        "The previews show both, in light and dark mode, so you can see whether the thumbnail still says what it needs to. For the full rules, read <a href=\"../../blog/youtube-thumbnail-size/\">YouTube thumbnail size</a>, and for design patterns, <a href=\"../../blog/youtube-thumbnail-examples/\">YouTube thumbnail examples</a>.",
      ],
    },
  ],
  faq: [
    ["What is the best size for a YouTube thumbnail?", "1280 x 720 pixels, 16:9, under 2 MB, as JPG, PNG or GIF. That is what YouTube's help pages recommend as of October 2026."],
    ["Is my image uploaded?", "No. The checks and previews run in your browser. The image is never sent to our server."],
    ["Can it predict my click-through rate?", "No tool can. Click-through rate depends on the audience, the title, the topic and what sits around your video. The tester catches technical and readability problems, which are the ones you can fix before publishing."],
    ["Does it work for Shorts?", "Shorts use a frame from the video as their cover, chosen in the YouTube app, so this tester is built for regular 16:9 thumbnails."],
    ["How do I compare with competitors?", "Download their thumbnails with the <a href=\"../youtube-thumbnail-downloader/\">thumbnail downloader</a> and run them through this tester to see how they hold up at feed size."],
  ],
};
