// Calculators and generators added 19 Nov 2026 (topic research, batch 2): CPM, RPM, chapters,
// bitrate, file size, aspect ratio and username ideas. All run in the browser with no API call.
// Figures come from YouTube Help (answers 9314357, 72902, 9884579, 1722171, 6375112, 71673) and
// TikTok Support "Changing your username"; tools.js concatenates this list.

const MODE = (id, label, options, value) => ({ id, label, type: "select", value, options });
const RESOLUTIONS = [["2160p", "2160p (4K)"], ["1440p", "1440p (2K)"], ["1080p", "1080p (Full HD)"], ["720p", "720p (HD)"], ["480p", "480p"], ["360p", "360p"], ["8k", "8K"]];

const USERNAME_INPUTS = [
  { id: "name", label: "Your name or brand", type: "text", placeholder: "e.g. Maya, or Bean Club" },
  { id: "topic", label: "What you post about", type: "text", placeholder: "Optional, e.g. coffee, travel, fitness", optional: true },
  {
    id: "style", label: "Style", type: "select", value: "simple",
    options: [["simple", "Simple, your name first"], ["creator", "Creator, name plus topic"], ["brand", "Brand, sounds like a business"], ["fun", "Fun, easy to remember"]],
  },
];

module.exports = [
  {
    slug: "youtube-cpm-calculator",
    name: "YouTube CPM Calculator",
    platform: "YouTube",
    intent: "estimate",
    buttonLabel: "Calculate",
    short: "Work out CPM, ad cost or impressions from the other two, plus playback-based CPM and the creator's 55% share.",
    intro: "Pick what you want to find and fill in the other two numbers. The calculator gives the CPM, what the ads cost or how many impressions a budget buys, and, for ads on a long YouTube video, what the creator receives at YouTube's 55% share.",
    inputs: [
      MODE("mode", "What do you want to find?", [["cpm", "CPM, from ad cost and impressions"], ["cost", "Ad cost, from CPM and impressions"], ["impressions", "Impressions, from budget and CPM"]], "cpm"),
      { id: "cost", label: "Ad cost or budget ($)", type: "number", value: 7, min: 0, optional: true, hint: "Not needed when you are finding the cost" },
      { id: "impressions", label: "Ad impressions", type: "number", value: 2000, min: 0, optional: true, hint: "Not needed when you are finding impressions" },
      { id: "cpm", label: "CPM ($ per 1,000 impressions)", type: "number", min: 0, optional: true, placeholder: "e.g. 3.50", hint: "Not needed when you are finding the CPM" },
      { id: "playbacks", label: "Monetized playbacks", type: "number", value: 1500, min: 0, optional: true, hint: "Optional. Views that showed at least one ad, for playback-based CPM" },
    ],
    how: [
      "CPM = ad cost / ad impressions x 1,000. Cost and impressions are the same formula turned around.",
      "Playback-based CPM = ad cost / monetized playbacks x 1,000. It is higher than CPM when some views show more than one ad. The starting numbers are YouTube Help's own worked example: $7, 2,000 impressions, 1,500 playbacks.",
      "YouTube Help says partners receive 55% of net revenue from ads on their long-form videos. The creator figure applies that share to the ad cost, so treat it as an upper estimate.",
    ],
    next: ["youtube-rpm-calculator", "youtube-money-calculator", "youtube-sponsorship-price-calculator"],
  },
  {
    slug: "youtube-rpm-calculator",
    name: "YouTube RPM Calculator",
    platform: "YouTube",
    intent: "estimate",
    buttonLabel: "Calculate",
    short: "Work out your YouTube RPM from revenue and views, your earnings from an RPM, or the views you need for a target income.",
    intro: "Pick what you want to find and fill in the other two numbers from YouTube Studio. You get your RPM, what you earn per view and per thousand, million and more views, or how many views a month a target income needs.",
    inputs: [
      MODE("mode", "What do you want to find?", [["rpm", "RPM, from revenue and views"], ["earnings", "Earnings, from RPM and views"], ["views", "Views needed, from a target and RPM"]], "rpm"),
      { id: "revenue", label: "Revenue or target income ($)", type: "number", min: 0, optional: true, placeholder: "e.g. 250", hint: "Your estimated revenue in YouTube Studio, or the income you are aiming for" },
      { id: "views", label: "Views", type: "number", min: 0, optional: true, placeholder: "e.g. 100000", hint: "Views in the same period as the revenue" },
      { id: "rpm", label: "RPM ($ per 1,000 views)", type: "number", min: 0, optional: true, placeholder: "e.g. 2.50", hint: "From YouTube Studio's revenue report" },
    ],
    how: [
      "RPM = revenue / views x 1,000. Earnings and views needed are the same formula turned around.",
      "YouTube Help defines RPM as what you earned per 1,000 views after YouTube's revenue share, counting all views, including those with no ad, and revenue from ads, memberships, Premium, Super Chat and Super Stickers.",
      "Use your own RPM from YouTube Studio. RPM varies widely with niche, audience country, video length and the time of year.",
    ],
    next: ["youtube-cpm-calculator", "youtube-money-calculator", "youtube-monetization-checker"],
  },
  {
    slug: "youtube-chapters-checker",
    name: "YouTube Chapters Checker",
    platform: "YouTube",
    intent: "rank",
    buttonLabel: "Check chapters",
    short: "Paste a description or timestamp list and see whether YouTube will turn it into chapters, with each problem pointed out.",
    intro: "Paste your video description, or just the list of timestamps and titles. The checker applies YouTube's chapter rules, lists every chapter with its length, flags anything that would stop chapters from showing, and gives you a clean list to copy back.",
    inputs: [
      { id: "text", label: "Description or timestamps", type: "textarea", rows: 9, placeholder: "00:00 Intro\n01:10 Flights\n04:30 Where to sleep\n09:05 Food" },
      { id: "length", label: "Video length", type: "text", placeholder: "Optional, e.g. 12:40", optional: true, hint: "Lets the checker measure the last chapter and catch times past the end" },
    ],
    how: [
      "Rules from YouTube Help: the first timestamp starts with 00:00, there are at least three timestamps in ascending order, and every chapter is at least 10 seconds long.",
      "The checker reads every line that starts or ends with a time like 1:30 or 1:02:15. Other lines in the description are ignored, as they are by YouTube.",
      "It runs in your browser. Nothing you paste is sent anywhere.",
    ],
    next: ["youtube-video-seo-checker", "youtube-timestamp-link-generator", "youtube-description-generator"],
  },
  {
    slug: "video-bitrate-calculator",
    name: "Video Bitrate Calculator",
    platform: "YouTube",
    intent: "check",
    buttonLabel: "Calculate bitrate",
    short: "YouTube's recommended upload bitrate for any resolution and frame rate, or the real bitrate of a file from its size and length.",
    intro: "Choose a resolution, frame rate and SDR or HDR to see the bitrate YouTube recommends. Add a file's size and length to work out its actual average bitrate and compare it with the recommendation.",
    inputs: [
      { id: "res", label: "Resolution", type: "select", value: "1080p", options: RESOLUTIONS },
      { id: "fps", label: "Frame rate", type: "select", value: "std", options: [["std", "24, 25 or 30 fps"], ["high", "48, 50 or 60 fps"]] },
      { id: "range", label: "Dynamic range", type: "select", value: "sdr", options: [["sdr", "SDR (standard)"], ["hdr", "HDR"]] },
      { id: "size", label: "File size", type: "number", min: 0, optional: true, placeholder: "Optional, e.g. 1.2", hint: "To check a file you already have" },
      { id: "unit", label: "Size unit", type: "select", value: "GB", options: [["GB", "GB"], ["MB", "MB"]] },
      { id: "duration", label: "Video length", type: "text", optional: true, placeholder: "Optional, e.g. 10:30 or 1:02:15" },
    ],
    how: [
      "Recommended bitrates are YouTube Help's tables for SDR and HDR uploads, at standard (24, 25, 30) and high (48, 50, 60) frame rates.",
      "Average bitrate = file size in bits / length in seconds. It includes the audio track, so it reads slightly higher than the video bitrate alone.",
      "YouTube Help calls these figures recommendations for uploads. They are not upper or lower limits.",
    ],
    next: ["video-file-size-calculator", "aspect-ratio-calculator", "youtube-thumbnail-tester"],
  },
  {
    slug: "video-file-size-calculator",
    name: "Video File Size Calculator",
    platform: "YouTube",
    intent: "check",
    buttonLabel: "Calculate file size",
    short: "How big a video file will be from its bitrate and length, checked against YouTube's 256 GB and 12-hour upload limit.",
    intro: "Enter the video bitrate, audio bitrate and length. You get the file size in MB and GB, how much space each minute takes, the sizes at YouTube's recommended bitrates, and whether the file fits YouTube's upload limits.",
    inputs: [
      { id: "vbr", label: "Video bitrate (Mbps)", type: "number", value: 8, min: 0, step: 0.1, hint: "YouTube recommends 8 Mbps for 1080p at 24 to 30 fps" },
      { id: "abr", label: "Audio bitrate", type: "select", value: "384", options: [["384", "384 kbps, stereo (YouTube's recommendation)"], ["128", "128 kbps, mono (YouTube's recommendation)"], ["512", "512 kbps, 5.1 (YouTube's recommendation)"], ["192", "192 kbps"], ["320", "320 kbps"], ["0", "No audio"]] },
      { id: "duration", label: "Video length", type: "text", value: "10:00", placeholder: "e.g. 10:00 or 1:02:15", hint: "Minutes:seconds or hours:minutes:seconds" },
    ],
    how: [
      "File size = (video bitrate + audio bitrate) x length in seconds / 8. The container adds a small amount on top.",
      "Sizes use 1 GB = 1,000 MB, as storage makers and YouTube do. Windows reports sizes in binary units, so the same file shows about 7% smaller there; both are shown.",
      "YouTube Help: the largest upload is 256 GB or 12 hours, whichever is less, and unverified accounts can upload videos up to 15 minutes long.",
    ],
    next: ["video-bitrate-calculator", "aspect-ratio-calculator", "youtube-playlist-length-calculator"],
  },
  {
    slug: "aspect-ratio-calculator",
    name: "Aspect Ratio Calculator",
    platform: "YouTube",
    intent: "check",
    buttonLabel: "Calculate",
    short: "Find the aspect ratio of any size, resize it without stretching, and see which YouTube, Shorts and Instagram formats it fits.",
    intro: "Enter a width and height to get the aspect ratio. Add a new width or a new height to get the matching other side, so an image or video scales without stretching. The result shows the standard sizes for that ratio and where it fits on YouTube and Instagram.",
    inputs: [
      { id: "w", label: "Width (pixels)", type: "number", value: 1920, min: 1 },
      { id: "h", label: "Height (pixels)", type: "number", value: 1080, min: 1 },
      { id: "nw", label: "New width", type: "number", min: 1, optional: true, placeholder: "Optional, e.g. 1280" },
      { id: "nh", label: "New height", type: "number", min: 1, optional: true, placeholder: "Optional, e.g. 720" },
    ],
    how: [
      "The ratio is width and height divided by their greatest common divisor, so 1920 x 1080 becomes 16:9.",
      "New height = new width x height / width, and the other way round. Results are rounded to whole pixels, and to even numbers for video, which most encoders need.",
      "Platform fit uses YouTube Help (16:9 is standard on a computer; the player adapts to vertical and square) and Instagram Help (Reels between 1.91:1 and 9:16).",
    ],
    next: ["video-bitrate-calculator", "video-file-size-calculator", "youtube-thumbnail-tester"],
  },
  {
    slug: "instagram-username-generator",
    name: "Instagram Username Generator",
    platform: "Instagram",
    intent: "create",
    buttonLabel: "Generate usernames",
    short: "Thirty Instagram username ideas from your name and topic, using only letters, numbers, periods and underscores.",
    intro: "Type your name or brand and, if you like, what you post about. You get thirty username ideas built only from the characters Instagram usernames use, short enough to fit TikTok's rules too, so you can try to claim the same name on both.",
    inputs: USERNAME_INPUTS,
    how: [
      "Ideas use only letters, numbers, periods and underscores. Instagram Help suggests adding periods, numbers, underscores or abbreviations when the name you want is taken.",
      "Every idea is 24 characters or fewer and does not end with a period, so it also meets TikTok's username rules.",
      "We cannot see whether a name is free. Open instagram.com/thename to check before you change your username.",
    ],
    next: ["instagram-bio-generator", "tiktok-username-generator", "youtube-channel-name-generator"],
  },
  {
    slug: "tiktok-username-generator",
    name: "TikTok Username Generator",
    platform: "TikTok",
    intent: "create",
    buttonLabel: "Generate usernames",
    short: "Thirty TikTok username ideas that meet TikTok's rules: 2 to 24 characters, letters, numbers, underscores and periods.",
    intro: "Type your name or brand and, if you like, what you post about. You get thirty TikTok username ideas, each checked against the rules TikTok Support publishes, ready to copy.",
    inputs: USERNAME_INPUTS,
    how: [
      "TikTok Support: a username must contain 2 to 24 characters, can only contain letters, numbers, underscores and periods, and periods cannot be added to the end.",
      "Your username is your @ and profile link. Your nickname is the display name, which you can change separately.",
      "TikTok lets you change your username once every 30 days, and changing it also changes your profile link. Pick carefully.",
    ],
    next: ["instagram-username-generator", "tiktok-engagement-rate-calculator", "youtube-channel-name-generator"],
  },
];
