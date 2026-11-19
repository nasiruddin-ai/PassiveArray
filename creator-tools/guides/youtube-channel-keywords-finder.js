// Long-form guide for /creator-tools/youtube-channel-keywords-finder/. Matches
// COMPUTE["youtube-channel-keywords-finder"]: brandingSettings.channel.keywords via channels.list (action "channel").
module.exports = {
  seoTitle: "YouTube Channel Keywords Finder: See Any Channel's Keywords | Passive Array",
  seoDescription: "Free YouTube channel keywords finder. See the hidden channel keywords any YouTube channel set in its settings, plus its YouTube topics, ready to copy.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to see a channel's keywords",
      ordered: true,
      list: [
        "Paste the channel's link or @handle. A plain name also works but has to be searched for and can match the wrong channel.",
        "Read the keyword list and the topics YouTube assigns to the channel.",
        "Copy the list to compare with your own channel settings.",
      ],
    },
    {
      h: "What channel keywords are",
      p: [
        "Channel keywords are words and phrases a channel owner types into the channel settings in YouTube Studio. They describe what the whole channel is about, separately from the tags on each video, and viewers never see them on the channel page.",
        "They are part of the channel's public settings in the YouTube Data API, which is how this tool reads them. Nothing private is involved.",
      ],
    },
    {
      h: "Keywords versus topics",
      table: {
        head: ["", "Channel keywords", "Topics"],
        rows: [
          ["Who sets them", "The channel owner", "YouTube"],
          ["Where they come from", "Typed into the channel settings", "YouTube's own classification of the channel"],
          ["What they tell you", "How the owner wants the channel to be understood", "How YouTube actually understands it"],
        ],
      },
      p: ["When the two disagree, the topics are the better guide to which audience YouTube is matching the channel with."],
    },
    {
      h: "How to use them for competitor research",
      list: [
        "Look up the three or four channels closest to yours. The <a href=\"../youtube-lookalike-finder/\">lookalike finder</a> and <a href=\"../youtube-channel-comparison/\">channel comparison</a> help pick them.",
        "Note phrases several of them use. Those describe the niche the way creators in it see it.",
        "Use the descriptive words, not other channels' names. A keyword list full of rival brand names does not describe your channel.",
        "Then check how individual videos are tagged with the <a href=\"../youtube-tag-extractor/\">tag extractor</a>.",
      ],
    },
  ],
  faq: [
    ["Where do I add keywords to my own channel?", "In YouTube Studio, in your channel's settings, under the basic information for the channel. Separate phrases with commas; put multi-word phrases in quotes if you want them kept together."],
    ["Do channel keywords help a channel rank?", "YouTube does not say how much weight they carry. They are one of the few places you describe the whole channel, so fill them in accurately, but expect titles, descriptions and viewer behaviour to matter far more."],
    ["Why does a big channel have no keywords?", "Many channels never fill in this setting. Large channels often rank on their name and audience alone. An empty list is common and not a mistake on this tool's side."],
    ["Is it allowed to look at another channel's keywords?", "Yes. They are part of every channel's public data in the official YouTube Data API. This tool only reads them; it changes nothing."],
  ],
};
