// Long-form guide for /creator-tools/youtube-thumbnail-downloader/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["youtube-thumbnail-downloader"] and videoIdFrom() in public/shared.js: five sizes from
// https://i.ytimg.com/vi/<id>/<name>.jpg (maxresdefault 1280x720, sddefault 640x480, hqdefault 480x360,
// mqdefault 320x180, default 120x90). No API call; the ID is read from the link in the browser.
module.exports = {
  seoTitle: "YouTube Thumbnail Downloader: Every Size, Free | Passive Array",
  seoDescription: "Free YouTube thumbnail downloader, no sign-up. Paste a video link to preview and save its thumbnail in all five sizes YouTube stores, up to 1280 x 720.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "How to download a YouTube thumbnail",
      ordered: true,
      list: [
        "Copy the video link. Watch links, youtu.be short links, Shorts links, embed links and live links all work, and so does the 11-character video ID on its own.",
        "Paste it into the box above and press the button. No login is needed.",
        "You get a table of every size, each with a preview. Right-click a preview and choose \"Save image as\", or click <b>Open full size</b> and save it from the new tab.",
      ],
      after: [
        "Nothing is uploaded and no API is used. The tool reads the video ID from your link and works out the public addresses where YouTube already stores the images. That is why it is instant, and why it works on any public video.",
      ],
    },
    {
      h: "What YouTube thumbnail sizes can you download?",
      p: ["YouTube keeps five fixed versions of every thumbnail. The tool shows all five:"],
      table: {
        head: ["Size", "File name", "Dimensions", "Availability"],
        rows: [
          ["Maximum", "maxresdefault.jpg", "1280 x 720", "Only if the creator uploaded a thumbnail this large"],
          ["Standard", "sddefault.jpg", "640 x 480", "Almost always"],
          ["High", "hqdefault.jpg", "480 x 360", "Always"],
          ["Medium", "mqdefault.jpg", "320 x 180", "Always"],
          ["Small", "default.jpg", "120 x 90", "Always"],
        ],
      },
      after: [
        "Each one lives at an address like <b>i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg</b>. The Maximum and Medium sizes are widescreen. Standard, High and Small are the older 4:3 shape, so a normal widescreen thumbnail shows black bars above and below in those sizes.",
      ],
    },
    {
      h: "Why is the HD thumbnail missing for some videos?",
      p: [
        "The 1280 x 720 version only exists when the video has a thumbnail that large. Older videos, and videos whose thumbnail was uploaded at a smaller size, stop at 640 x 480 or below. When a size does not exist, its preview shows \"Not available for this video\" or a small grey placeholder instead of the image.",
        "If the Maximum size is missing, use Standard (640 x 480) for the sharpest picture, keeping in mind it may have black bars. For a quick look at how the thumbnail reads at the size viewers see in a feed, Medium (320 x 180) is the most realistic.",
      ],
    },
    {
      h: "Can you use someone else's YouTube thumbnail?",
      p: [
        "Thumbnails belong to the creators who made them. Downloading one to study it is fine: comparing designs, checking how text reads at small sizes, or keeping a swipe file of what works in your niche. Re-uploading it as your own thumbnail, or putting it in your own video, ad or product, is not. That can be copyright infringement, and YouTube can remove content that copies someone else's work.",
        "If you want to show another channel's thumbnail, for example in a review or a breakdown of your niche, ask the creator or check whether your use is allowed where you live. When in doubt, link to the video instead. This is general information, not legal advice.",
      ],
    },
    {
      h: "How to use competitor thumbnails to improve your own",
      p: ["Studying thumbnails is one of the fastest ways to learn what earns clicks in your niche. Download a few top performers and compare them side by side:"],
      list: [
        "<b>Shrink them.</b> Look at the Medium size. If you cannot read the text or tell what is happening, viewers on phones cannot either.",
        "<b>Count the elements.</b> Strong thumbnails usually have one subject, one idea and very few words.",
        "<b>Read them with the title.</b> The two should add to each other, not repeat the same words. Score your own title with the <a href=\"../youtube-title-analyzer/\">title analyzer</a>.",
        "<b>Check the channel behind it.</b> A great thumbnail on a huge channel proves less than a decent one on a small channel that broke out. Look the channel up with the <a href=\"../youtube-subscriber-count-checker/\">subscriber count checker</a> or the <a href=\"../youtube-channel-quality-checker/\">channel quality checker</a>.",
      ],
      after: ["To find videos doing far better than their channel's usual, browse the <a href=\"../../research/outliers/\">outlier feed</a>. Study the pattern, then design your own."],
    },
  ],
  faq: [
    ["Is this YouTube thumbnail downloader free?", "Yes. No sign-up, no account and no limit. It runs in your browser and calls no API."],
    ["How do I get the HD version of a YouTube thumbnail?", "Use the Maximum size (1280 x 720). If it shows as not available, the video was never given a thumbnail that large, and Standard (640 x 480) is the biggest version that exists."],
    ["Does it work with YouTube Shorts?", "Yes. Paste the Shorts link and the tool reads the video ID from it like any other link."],
    ["Why do some thumbnails have black bars?", "The Standard, High and Small sizes use the older 4:3 shape. A widescreen thumbnail is fitted inside that shape, which leaves bars above and below. The Maximum and Medium sizes are widescreen."],
    ["Can I use a downloaded thumbnail on my own video?", "No. Thumbnails belong to their creators. Use them for reference and study, not as your own artwork. Make your own thumbnail and use others only for ideas."],
    ["Do I need the YouTube API or an account?", "No. YouTube stores every thumbnail at a public address based on the video ID. The tool works those addresses out and shows you the images directly."],
    ["Can I download thumbnails from private or deleted videos?", "Usually not. The tool can only show images that YouTube still serves publicly. If a preview does not load, that size is not available for that video."],
    ["What size should my own YouTube thumbnail be?", "As of October 2026, YouTube recommends 1280 x 720 pixels. Uploading at that size means your video gets the Maximum version too. Check the current limits in YouTube Studio before you upload."],
  ],
};
