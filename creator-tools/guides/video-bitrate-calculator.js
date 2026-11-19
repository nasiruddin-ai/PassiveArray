// Long-form guide for /creator-tools/video-bitrate-calculator/. Matches COMPUTE["video-bitrate-calculator"]:
// YouTube Help 1722171 bitrate tables (SDR/HDR, standard/high frame rate); average bitrate = size x 8 / seconds.
module.exports = {
  seoTitle: "Video Bitrate Calculator with YouTube's Recommended Bitrates | Passive Array",
  seoDescription: "Free video bitrate calculator. See YouTube's recommended upload bitrate for 4K, 1440p, 1080p and 720p in SDR or HDR, and work out any file's real bitrate.",
  guideUpdated: "November 2026",
  guide: [
    {
      h: "How to use the bitrate calculator",
      ordered: true,
      list: [
        "Pick the resolution, the frame rate and SDR or HDR.",
        "Read YouTube's recommended video bitrate for that combination, and the file size each minute takes.",
        "To check a file you already exported, add its size and length. The calculator works out its average bitrate and compares it with YouTube's figure.",
      ],
    },
    {
      h: "YouTube's recommended upload bitrates",
      p: ["From YouTube Help's recommended upload encoding settings. Standard frame rate is 24, 25 or 30 fps; high frame rate is 48, 50 or 60 fps."],
      table: {
        head: ["Resolution", "SDR, standard", "SDR, high", "HDR, standard", "HDR, high"],
        rows: [
          ["8K", "80 to 160 Mbps", "120 to 240 Mbps", "100 to 200 Mbps", "150 to 300 Mbps"],
          ["2160p (4K)", "35 to 45 Mbps", "53 to 68 Mbps", "44 to 56 Mbps", "66 to 85 Mbps"],
          ["1440p (2K)", "16 Mbps", "24 Mbps", "20 Mbps", "30 Mbps"],
          ["1080p", "8 Mbps", "12 Mbps", "10 Mbps", "15 Mbps"],
          ["720p", "5 Mbps", "7.5 Mbps", "6.5 Mbps", "9.5 Mbps"],
          ["480p", "2.5 Mbps", "4 Mbps", "Not supported", "Not supported"],
          ["360p", "1 Mbps", "1.5 Mbps", "Not supported", "Not supported"],
        ],
      },
      p: ["For audio, YouTube Help recommends 128 kbps for mono, 384 kbps for stereo and 512 kbps for 5.1. The full settings, including container, codecs and colour space, are in our guide to <a href=\"../../blog/youtube-upload-settings/\">YouTube's recommended upload settings</a>."],
    },
    {
      h: "How a file's bitrate is worked out",
      p: [
        "Average bitrate = file size in bits / length in seconds. A 1.2 GB file that runs 10 minutes is 1,200,000,000 x 8 / 600 = 16 Mbps.",
        "That figure includes the audio and the container, so it reads a little higher than the video bitrate your editor shows. Most exports use a variable bitrate, so some scenes run higher and some lower than the average.",
      ],
    },
    {
      h: "Choosing a bitrate",
      list: [
        "<b>Upload in the frame rate you recorded.</b> YouTube Help says content should be encoded and uploaded in the same frame rate it was recorded.",
        "<b>Match the resolution and frame rate row.</b> 60 fps needs the high frame rate column, which is about 1.5 times the standard one.",
        "<b>Check the file size.</b> Bitrate decides how big the file is. The <a href=\"../video-file-size-calculator/\">file size calculator</a> shows whether a long video fits YouTube's 256 GB limit.",
      ],
    },
  ],
  faq: [
    ["What bitrate should I use for YouTube 1080p?", "YouTube Help recommends 8 Mbps for 1080p SDR at 24, 25 or 30 fps, and 12 Mbps at 48, 50 or 60 fps. For HDR it is 10 and 15 Mbps."],
    ["What bitrate does YouTube recommend for 4K?", "35 to 45 Mbps for 2160p SDR at standard frame rates and 53 to 68 Mbps at high frame rates. For HDR, 44 to 56 Mbps and 66 to 85 Mbps."],
    ["How do I find a video's bitrate?", "Divide the file size in bits by its length in seconds. Enter the size and length in the calculator and it does this for you, in Mbps."],
    ["Can I upload HDR at 480p?", "No. YouTube Help lists HDR uploads at 480p and 360p as not supported."],
    ["Is a higher bitrate always better for YouTube?", "YouTube Help gives these figures as recommendations for uploads, not limits. A higher bitrate makes a bigger file that takes longer to upload, so the recommended figure is a sensible target."],
  ],
};
