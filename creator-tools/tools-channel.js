// Tools added 24 Nov 2026 after comparing our list with TubeBuddy's plan table: the features
// there that need no write access to a channel. Tag sorter and the demonetization checker run in
// the browser; the others read public data (channels, playlistItems, videos). None uses search.

const CHANNEL = {
  id: "channel",
  label: "Channel link or @handle",
  type: "text",
  placeholder: "e.g. @mkbhd or a channel link",
  hint: "A link or @handle is exact. A plain name has to be searched for and may pick the wrong channel",
};

module.exports = [
  {
    slug: "youtube-tag-sorter",
    name: "YouTube Tag Sorter",
    platform: "YouTube",
    intent: "rank",
    buttonLabel: "Sort tags",
    short: "Clean a tag list: remove duplicates, sort it, and trim it to fit YouTube's 500-character limit.",
    intro: "Paste your tags, separated by commas or one per line. The sorter removes duplicates, puts them in the order you choose, counts the characters the way YouTube does, and drops the tags that would push the list past 500 characters.",
    inputs: [
      { id: "tags", label: "Tags", type: "textarea", rows: 7, placeholder: "budget travel, europe travel, travel tips", example: "budget travel, Europe travel, travel tips, budget travel, how to travel cheap, backpacking europe, cheap flights, travel hacks, europe on a budget, travel vlog" },
      { id: "order", label: "Order", type: "select", value: "kept", options: [["kept", "As entered, duplicates removed"], ["specific", "Most specific first (longest)"], ["short", "Shortest first"], ["az", "A to Z"]] },
    ],
    how: [
      "Duplicates are matched without regard to capital letters, and the first spelling is kept.",
      "Characters are counted as the YouTube Data API documents: commas between tags count, and a tag that contains a space is counted with a pair of quotation marks around it.",
      "When the list is over 500 characters, tags are dropped from the end of your chosen order, so put the ones that matter first.",
    ],
    next: ["youtube-tag-generator", "youtube-tag-extractor", "youtube-video-seo-checker"],
  },
  {
    slug: "youtube-milestone-calculator",
    name: "YouTube Milestone Calculator",
    platform: "YouTube",
    api: "youtube",
    action: "history",
    intent: "check",
    buttonLabel: "Show milestones",
    howTitle: "How the dates are worked out",
    short: "See a channel's next subscriber milestones, how far away they are, and when it reaches them at its measured pace.",
    intro: "Enter a channel. You get its next subscriber milestones, how many subscribers each one is away, and an estimated date for each based on the channel's recorded daily growth, or on a daily figure you type in.",
    inputs: [
      CHANNEL,
      { id: "rate", label: "Subscribers gained per day", type: "number", min: 0, optional: true, placeholder: "Optional", hint: "Leave empty to use the channel's recorded growth. New channels on our list need a few days of history first" },
    ],
    how: [
      "The current subscriber count is read from the YouTube Data API. YouTube rounds public counts, so a milestone can be passed slightly before the public number shows it.",
      "Daily growth comes from Passive Array's own recorded history for the channel: the change between the first and latest recorded day, divided by the days between them.",
      "Estimated date = subscribers still needed / subscribers gained per day. It assumes the pace stays the same, which it rarely does for long.",
    ],
    next: ["youtube-channel-growth-tracker", "youtube-subscriber-count-checker", "youtube-monetization-checker"],
  },
  {
    slug: "youtube-channel-video-exporter",
    name: "YouTube Channel Video Exporter",
    platform: "YouTube",
    api: "youtube",
    action: "channelvideos",
    intent: "check",
    buttonLabel: "List videos",
    downloadNeedsAccount: true,
    howTitle: "What is exported",
    short: "Export a channel's videos to CSV: titles, links, dates, views, likes, comments, lengths, tags and descriptions.",
    intro: "Enter any channel and choose how many of its newest videos to read. You get a table of them with their public numbers, and a CSV with every title, description and tag list: a backup of your own channel's metadata, or a research sheet on someone else's.",
    inputs: [
      CHANNEL,
      { id: "max", label: "How many videos", type: "select", value: "50", options: [["50", "Newest 50"], ["100", "Newest 100"], ["200", "Newest 200"]] },
    ],
    how: [
      "Videos are read from the channel's public uploads list in the YouTube Data API, newest first, up to 200.",
      "The CSV has one row per video: title, link, publish date, length in seconds, views, likes, comments, tags and description.",
      "Only public data is read. Private and unlisted videos, and anything in YouTube Studio, are not included.",
    ],
    next: ["youtube-upload-schedule-checker", "youtube-tag-extractor", "youtube-channel-comparison"],
  },
  {
    slug: "youtube-upload-schedule-checker",
    name: "YouTube Upload Schedule Checker",
    platform: "YouTube",
    api: "youtube",
    action: "channelvideos",
    params: { max: 100 },
    intent: "check",
    buttonLabel: "Check schedule",
    howTitle: "How the schedule is read",
    short: "See which days and hours any channel publishes on, how often it uploads, and its split of Shorts and long videos.",
    intro: "Enter a channel. The checker reads the publish times of its newest 100 uploads and shows the days of the week and hours it publishes on, in your time zone, plus uploads per week and the share that are Shorts.",
    inputs: [CHANNEL],
    how: [
      "Publish times come from the YouTube Data API and are shown in your browser's time zone.",
      "For a scheduled or premiered video, the time is when it went public, not when the file was uploaded.",
      "Videos of 3 minutes or less are counted as Shorts-length. YouTube does not label Shorts in its public data, so this is a length test, not a certainty.",
    ],
    next: ["youtube-channel-video-exporter", "youtube-channel-growth-tracker", "youtube-channel-comparison"],
  },
  {
    slug: "youtube-demonetization-checker",
    name: "YouTube Demonetization Checker",
    platform: "YouTube",
    intent: "rank",
    buttonLabel: "Check wording",
    howTitle: "What this check can and cannot tell you",
    short: "Scan a title, description and tags for words in the categories YouTube's advertiser-friendly guidelines name.",
    intro: "Paste your title, and the description and tags if you have them. The checker flags words that fall under the categories in YouTube's advertiser-friendly content guidelines, so you can decide whether to reword before you publish.",
    inputs: [
      { id: "title", label: "Title", type: "text", placeholder: "Paste the title", example: "I Survived the Most Dangerous Road (Insane Crash Footage)" },
      { id: "description", label: "Description", type: "textarea", rows: 5, optional: true, placeholder: "Optional" },
      { id: "tags", label: "Tags", type: "text", optional: true, placeholder: "Optional, comma separated" },
    ],
    how: [
      "YouTube Help says its advertiser-friendly policies apply to every part of your content: the video, thumbnail, title, description and tags. This tool reads the three text parts.",
      "Each flagged word is listed with the guideline category it falls under. The word lists are ours; YouTube does not publish one.",
      "A flag is a prompt to look again, not a verdict. YouTube judges context, and the video and thumbnail matter as much as the words. YouTube's systems make the decision, and YouTube Help says you can request human review of it.",
    ],
    next: ["youtube-title-analyzer", "youtube-video-seo-checker", "youtube-monetization-checker"],
  },
];
