// Long-form guide for /creator-tools/twitch-channel-comparison/. Merged into tools.js by build-tools.js.
// Matches COMPUTE["twitch-channel-comparison"] and compareTable() in public/shared.js and getChannel() in lib/twitch.js:
// 2 or 3 channels, at least 2 must load; leader in green on followers, live viewers, average VOD views and
// followers per year (no leader on ties, account age or status). Server cache 30 minutes.
module.exports = {
  seoTitle: "Compare Twitch Channels: Free Side-by-Side Stats | Passive Array",
  seoDescription: "Compare two or three Twitch streamers side by side for free. See followers, live viewers, average VOD views, growth pace and account age in one table.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this Twitch channel comparison shows",
      p: ["Enter two or three Twitch usernames or twitch.tv links. Each channel is looked up through Twitch's official Helix API and placed in one table with these rows:"],
      table: {
        head: ["Row", "What it is", "Leader marked?"],
        rows: [
          ["Followers", "Twitch's total follower count", "Yes"],
          ["Live viewers now", "Current viewers, or \"offline\"", "Yes"],
          ["Average VOD views", "Average views on the last 10 videos", "Yes"],
          ["Followers per year", "Followers / account age in years", "Yes"],
          ["Account age (years)", "Time since the Twitch account was created", "No"],
          ["Status", "Partner, Affiliate or regular", "No"],
        ],
      },
      after: [
        "The highest value on each marked row is shown in green. If two channels tie for the top, neither is marked. Account age and status are shown for context only, because older or Partner does not mean better.",
      ],
    },
    {
      h: "How to compare Twitch streamers",
      ordered: true,
      list: [
        "Type the first two usernames. The third box is optional.",
        "Press the button. No Twitch account is needed.",
        "Read across each row to see who leads, then read down each column to see the whole picture for one channel.",
      ],
      after: [
        "At least two channels must load for a comparison. If one name is misspelled or the channel does not exist, the others still show, with a note naming the one that did not load. Results are kept for up to 30 minutes so the site stays within Twitch's rate limits.",
        "Pick channels that are close to each other. Comparing a new streamer with one of the biggest names on Twitch tells you very little, because every row will go the same way. Two or three channels of a similar size, in the same category, show where the real differences are: one may have more followers, while another keeps more viewers live or gets more views on its videos. That gap is usually what you can learn from.",
      ],
    },
    {
      h: "Which Twitch numbers matter most when comparing channels?",
      p: ["It depends on why you are comparing. Use the rows that answer your question:"],
      table: {
        head: ["You want to know...", "Look at", "Be careful of"],
        rows: [
          ["Who reaches the most people live", "Live viewers now", "It is one moment. Check at the times each channel usually streams"],
          ["Whose audience watches after the stream", "Average VOD views", "Channels that do not save broadcasts show zero"],
          ["Who is growing fastest", "Followers per year", "It uses account age, not streaming age"],
          ["Who has the biggest audience overall", "Followers", "Followers pile up over years and rarely drop"],
        ],
      },
      after: [
        "Live viewers are the hardest to compare fairly. A channel that is offline shows \"offline\" and cannot lead that row, however big its streams usually are. For a fair read, run the comparison while all of them are live, or run it on several days.",
      ],
    },
    {
      h: "Who uses a Twitch channel comparison?",
      list: [
        "<b>Streamers</b> comparing themselves with channels their size in the same category, to see whether the gap is followers, live audience or VOD views.",
        "<b>Brands and agencies</b> shortlisting creators for a campaign. Live viewers and VOD views say more about reach than followers do. Our <a href=\"../../blog/how-to-vet-an-influencer-before-you-pay/\">checklist for vetting a creator</a> covers what to ask next.",
        "<b>Teams and collaborators</b> checking whether a raid, co-stream or event partner reaches a similar audience.",
      ],
      after: [
        "A channel with many more followers than its rivals but far fewer live viewers and VOD views deserves a closer look. It can mean an audience that has drifted away, or followers that were not real. See <a href=\"../../blog/how-to-spot-fake-followers/\">how to spot fake followers</a>.",
      ],
    },
    {
      h: "What the comparison cannot show",
      list: [
        "<b>Subscribers, bits and earnings.</b> Twitch keeps them private, so no outside tool can compare them.",
        "<b>Viewer history.</b> Twitch's API gives current viewers only. The tool does not store past streams.",
        "<b>Chat activity and watch time.</b> These are not in the public data at all.",
        "<b>What the last 10 videos are.</b> They can be past broadcasts, highlights or uploads, so one channel's average may cover full streams and another's short clips.",
      ],
      after: [
        "For one channel in more detail, including its list of recent videos, use the <a href=\"../twitch-follower-count-checker/\">Twitch follower count checker</a>. If the creators also post on YouTube, compare that side with <a href=\"../youtube-channel-comparison/\">compare YouTube channels</a>.",
      ],
    },
  ],
  faq: [
    ["Is this Twitch channel comparison tool free?", "Yes. No sign-up and no Twitch account needed. Compare as many sets of channels as you like, within Twitch's rate limits."],
    ["How many Twitch channels can I compare at once?", "Two or three. At least two must load for the table to appear."],
    ["Why does a channel show as offline?", "Live viewers only exist while a channel is streaming. If it is not live when you check, or went live in the last few minutes, it shows offline. Results are kept for up to 30 minutes."],
    ["What does the green highlight mean?", "It marks the highest value on that row. Account age and status are never marked, and when two channels tie for the top, neither is marked."],
    ["Can I compare Twitch subscriber counts?", "No. Paid subscriber numbers are private to each streamer. The tool compares followers, which Twitch does make public."],
    ["What is followers per year?", "Total followers divided by the account's age in years. It lets a two-year-old channel and a ten-year-old channel be compared on pace rather than total. It counts from account creation, not the first stream."],
    ["Why is one channel's average VOD views zero?", "It probably has no saved videos. Some streamers turn off saved broadcasts, and Twitch removes past broadcasts after a while. It does not mean nobody watches live."],
    ["Where does the data come from?", "Twitch's official Helix API. Nothing is estimated: every number is what Twitch reports, or simple arithmetic on top of it, as shown above."],
  ],
};
