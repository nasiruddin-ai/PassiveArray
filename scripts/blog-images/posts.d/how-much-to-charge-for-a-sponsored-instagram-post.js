module.exports = {
  cover: {
    kicker: "Sponsorships",
    title: "What to charge for a *sponsored* Instagram post",
    sub: "Rate per 1,000 followers, adjusted for engagement, priced per format.",
    size: 54,
    visual: { type: "shot", src: "how-much-to-charge-for-a-sponsored-instagram-post--pricing.png", label: "Instagram Pricing Calculator", tag: "Free, no account", style: "height:400px;object-fit:cover;object-position:left top" },
  },
  figures: [
    {
      file: "instagram-sponsored-post-price-steps.webp", type: "flow",
      title: "From follower count to a quote",
      sub: "The base price is the starting point, not the answer.",
      steps: [
        { title: "Base price", text: "Followers / 1,000 x $10 for a feed post. 50,000 followers starts at $500." },
        { title: "Engagement", text: "A multiplier from your rate compared with the typical rate for your tier." },
        { title: "Format", text: "A reel is worth more than a feed post, a story frame less." },
        { title: "Extras", text: "Usage rights, exclusivity, whitelisting, revisions and rush, each quoted separately." },
      ],
      note: "Starting rate and adjustments from the Passive Array Instagram pricing calculator.",
    },
    {
      file: "instagram-sponsorship-extra-charges.webp", type: "picks",
      title: "Charge for these *separately*",
      sub: "Bundled into one number, they disappear the moment a brand asks for a discount.",
      picks: [
        { name: "Usage rights", tagline: "most often missed", points: ["Typically 20% to 50% extra for a defined period and channels"] },
        { name: "Exclusivity", tagline: "future income", points: ["No competing brands for three or six months has a real cost"] },
        { name: "Whitelisting", tagline: "your handle", points: ["Ads run from your account borrow your credibility"] },
        { name: "Revisions and rush", tagline: "your time", points: ["Two rounds included, more billed; two days' notice is a premium"] },
      ],
    },
  ],
};
