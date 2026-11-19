// Long-form guide for /creator-tools/video-file-size-calculator/. Matches COMPUTE["video-file-size-calculator"]:
// size = (video + audio bitrate) x seconds / 8; limits from YouTube Help 71673 (256 GB or 12 hours, 15 minutes unverified).
module.exports = {
  seoTitle: "Video File Size Calculator: Size from Bitrate and Length | Passive Array",
  seoDescription: "Free video file size calculator. Get the size of any video in MB and GB from its bitrate and length, and check it against YouTube's 256 GB and 12-hour limit.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to calculate a video's file size",
      ordered: true,
      list: [
        "Enter the video bitrate in Mbps, from your editor's export settings.",
        "Choose the audio bitrate, and type the length as minutes:seconds or hours:minutes:seconds.",
        "Read the size, the size per minute and hour, and whether the file fits YouTube's upload limits.",
      ],
      p: ["The formula: <b>size in bytes = (video bitrate + audio bitrate) x seconds / 8</b>. Ten minutes at 8 Mbps video and 384 kbps stereo audio is 8.384 million bits a second x 600 / 8 = about 629 MB."],
    },
    {
      h: "Why the size looks different in Windows",
      p: [
        "The calculator, like storage makers and YouTube, counts 1 GB as 1,000,000,000 bytes. Windows counts a gigabyte as 1,073,741,824 bytes, so the same file shows about 7% smaller in File Explorer. Both figures are shown.",
        "Real files also vary a little from the estimate, because most exports use a variable bitrate and the container adds a small amount.",
      ],
    },
    {
      h: "YouTube's upload limits",
      table: {
        head: ["Limit", "From YouTube Help"],
        rows: [
          ["Largest file", "\"The maximum file size you can upload is 256 GB or 12 hours, whichever is less.\""],
          ["Default length", "\"By default, you can upload videos that are up to 15 minutes long.\""],
          ["Longer videos", "\"Verified accounts can upload videos longer than 15 minutes.\""],
          ["Files over 20 GB", "Use an up-to-date browser"],
        ],
      },
      p: ["If a file is over 256 GB, YouTube Help suggests compressing it in video editing software with the H.264 codec. Lowering the bitrate toward YouTube's recommendation, shown in the <a href=\"../video-bitrate-calculator/\">bitrate calculator</a>, is the simplest way to do that."],
    },
    {
      h: "Sizes at YouTube's recommended bitrates",
      p: ["The result table shows the size of your video at YouTube's recommended SDR bitrates for 4K, 1440p, 1080p and 720p, so you can see what moving up or down a resolution costs in storage and upload time. For the shape of the frame, use the <a href=\"../aspect-ratio-calculator/\">aspect ratio calculator</a>."],
    },
  ],
  faq: [
    ["How big is a 10-minute 1080p video?", "At YouTube's recommended 8 Mbps for 1080p and 384 kbps stereo audio, about 629 MB. Your file will differ with the bitrate your editor uses."],
    ["How big is a 1-hour 4K video?", "At YouTube's recommended 35 to 45 Mbps for 4K at standard frame rates, roughly 16 to 20 GB plus audio. At 60 fps it is larger."],
    ["What is the largest video I can upload to YouTube?", "YouTube Help: 256 GB or 12 hours, whichever is less. Videos longer than 15 minutes need a verified account."],
    ["Why is my exported file a different size from the calculator?", "Because most encoders use a variable bitrate that changes with the footage, the container adds a little, and Windows shows sizes in binary units, about 7% smaller."],
    ["How do I make a video file smaller?", "Lower the bitrate, the resolution or the frame rate. YouTube Help suggests the H.264 codec to compress a file while keeping quality for YouTube."],
  ],
};
