// Long-form guide for /creator-tools/twitch-follower-count-checker/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["twitch-follower-count-checker"] in public/shared.js and getChannel() in lib/twitch.js:
// Helix users + channels/followers (total) + streams + videos (first 10, sort time, all types) + channels.
// Followers per year = followers / account age in years (minimum 0.1). Server cache 30 minutes.
module.exports = {
  seoTitle: "Twitch Follower Count Checker: Free, Live Data | Passive Array",
  seoDescription: "Check any Twitch streamer's follower count for free, no sign-up. See live status, current viewers, average VOD views and account age from the official API.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this Twitch follower count checker shows",
      p: ["Type a Twitch username or paste a twitch.tv link. The data comes from Twitch's official Helix API. You get:"],
      list: [
        "<b>Followers</b>: the channel's total follower count, as Twitch reports it.",
        "<b>Live now</b>: whether the channel is streaming, and if so, the current viewer count and the category.",
        "<b>Last category</b>: the game or category set on the channel.",
        "<b>Average VOD views</b>: the average views on the channel's 10 most recent videos.",
        "<b>Followers per year</b>: followers divided by the account's age in years.",
        "<b>Account created</b>: the date the Twitch account was made, and its age in years.",
        "<b>Status</b>: Partner, Affiliate, or Regular.",
      ],
      after: ["Below that is a table of the recent videos with their publish dates and views, each linking to the video on Twitch."],
    },
    {
      h: "How to check someone's Twitch follower count",
      ordered: true,
      list: [
        "Copy the streamer's username, or their full twitch.tv link. An @ at the start is fine.",
        "Paste it into the box above and press the button. You do not need a Twitch account.",
        "Read the follower count at the top, then the rows underneath for live status and recent video views.",
      ],
      after: [
        "Results are kept for up to 30 minutes so the site stays within Twitch's rate limits. That means a channel that has just gone live, or just gained a burst of followers, may take a little while to show it.",
      ],
    },
    {
      h: "What each Twitch number tells you",
      table: {
        head: ["Number", "How it is worked out", "What it is good for"],
        rows: [
          ["Followers", "Twitch's own follower total", "Overall size of the audience that has opted in"],
          ["Live viewers", "Current viewer count, only while live", "A snapshot of this stream right now"],
          ["Average VOD views", "Total views on the last 10 videos / number of videos", "How much people watch after the stream ends"],
          ["Followers per year", "Followers / account age in years", "Growth pace, so old and new accounts compare fairly"],
          ["Status", "Twitch's broadcaster type", "Whether the channel is a Partner or Affiliate"],
        ],
      },
      after: [
        "Followers per year uses the account's age, not how long the person has been streaming. An account made years before its first stream will show a slower pace than the channel really grew at.",
      ],
    },
    {
      h: "Why follower count is not the whole story",
      p: [
        "Followers add up over a channel's whole life and rarely fall much, so a big number can hide a channel whose viewers have moved on. For a brand or a fellow streamer, these matter more:",
      ],
      list: [
        "<b>Live viewers.</b> They are what sponsors and raids actually reach. But one check only shows one moment. Look at several streams before you judge.",
        "<b>Average VOD views.</b> They show whether people come back to the content after the stream. The figure covers whatever the last 10 videos are, which can be past broadcasts, highlights or uploads.",
        "<b>Recent activity.</b> Check the dates in the recent video table. A large follower count with no videos for months says the channel has gone quiet.",
      ],
      after: [
        "A channel with many followers but very low live viewers and VOD views is worth a closer look. It can mean an older audience that has drifted away, or followers that were bought. Our guide on <a href=\"../../blog/how-to-spot-fake-followers/\">spotting fake followers</a> and our <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">checklist for vetting a creator</a> cover what else to check.",
      ],
    },
    {
      h: "What this tool cannot see",
      p: ["Twitch's public API does not share everything. The checker uses only what it does share, so keep these limits in mind:"],
      list: [
        "<b>Subscriber counts, bits and earnings</b> are private to the streamer. No outside tool can see them.",
        "<b>Past viewer numbers</b> are not kept. Live viewers appear only while the channel is streaming at the moment you check.",
        "<b>Channels with no saved videos</b> show an average of zero. Some streamers turn off saved broadcasts, and Twitch only keeps past broadcasts for a limited time, so a zero does not always mean nobody watches.",
        "<b>The follower count may say \"Not available\"</b> if Twitch does not return it for that channel at that moment. Try again later.",
      ],
      after: [
        "To put two or three streamers side by side, use <a href=\"../twitch-channel-comparison/\">compare Twitch channels</a>. If the creator also posts on YouTube, check that side with the <a href=\"../youtube-subscriber-count-checker/\">YouTube subscriber count checker</a>.",
      ],
    },
  ],
  faq: [
    ["Is this Twitch follower count checker free?", "Yes. No sign-up and no Twitch account needed. Use it on any public channel."],
    ["Where does the follower count come from?", "From Twitch's official Helix API, the same data Twitch shares with approved apps. Results are kept for up to 30 minutes, so very recent changes can take a little while to appear."],
    ["Can I see a streamer's subscriber count?", "No. Twitch keeps paid subscriber numbers private, so no outside tool can show them. This checker shows followers, which is a different, free action."],
    ["Can I see how many viewers a streamer usually gets?", "Only partly. The tool shows live viewers if the channel is streaming when you check, plus average views on recent videos. It does not keep a history of past streams."],
    ["What does Partner or Affiliate mean?", "They are Twitch's two monetization levels. Affiliate is the first step and Partner the higher one. The tool shows whichever Twitch reports for the channel, or Regular if neither. Check Twitch's creator pages for the current requirements, as of October 2026."],
    ["Why are the average VOD views zero?", "The channel may have no saved videos. Some streamers turn off saved broadcasts, and Twitch removes past broadcasts after a while. It does not always mean nobody watches the live streams."],
    ["How is followers per year worked out?", "Total followers divided by the account's age in years. It is a rough growth pace. It uses the account's creation date, not the date of the first stream."],
    ["Can I track a Twitch channel's follower growth over time?", "Not with this page. Each check is a snapshot. Note the count each week, or compare a few channels at once with the Twitch channel comparison tool."],
  ],
};
