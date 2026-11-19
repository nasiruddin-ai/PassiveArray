module.exports = {
  cover: {
    kicker: "YouTube SEO",
    title: "YouTube *banner* size",
    sub: "One image for TV, computer and phone. Only the safe area is always seen.",
    size: 66,
    visual: { type: "stats", items: [
      { big: "2560 x 1440", label: "pixels, the recommended size", note: "Minimum 2048 x 1152 at 16:9, per YouTube Help" },
      { big: "1235 x 338", label: "pixel safe area for text and logos", note: "At the minimum size. File 6 MB or smaller" },
    ] },
  },
  figures: [
    {
      file: "banner-size-safe-area-widths.webp", type: "bars",
      title: "Banner width vs *safe area* width",
      sub: "Width in pixels. Text and logos belong in the safe area.",
      bars: [
        { label: "Recommended banner", value: 2560, display: "2560 px" },
        { label: "Minimum banner", value: 2048, display: "2048 px" },
        { label: "Safe area, recommended size", value: 1544, display: "~1544 px", hi: true },
        { label: "Safe area, minimum size", value: 1235, display: "1235 px", hi: true },
      ],
      note: "Source: YouTube Help, \"Manage your channel branding\". ~1544 px is our arithmetic (1235 x 1.25).",
    },
    {
      file: "youtube-banner-upload-steps.webp", type: "flow",
      title: "Change your banner in YouTube Studio",
      sub: "On a computer, the only route where Help describes adjusting the crop.",
      steps: [
        { title: "Sign in", text: "Open YouTube Studio on a computer." },
        { title: "Profile", text: "From the left menu, select Customization, then Profile." },
        { title: "Crop", text: "Click CHANGE, pick an image, select a preview and change the crop.", you: "Check every preview for cut-off text." },
        { title: "Publish", text: "Click DONE, then PUBLISH." },
      ],
      note: "Source: YouTube Help, \"Manage your channel branding\" (computer).",
    },
  ],
};
