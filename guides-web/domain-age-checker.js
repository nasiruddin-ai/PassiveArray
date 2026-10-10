// Long-form guide for /domain-age-checker/.
// Every behaviour described here matches domain-age-checker/index.html and domain-age-checker/lib/age.js.
module.exports = {
  seoTitle: "Domain Age Checker: When Was a Domain Registered? | Passive Array",
  seoDescription: "Find out how old any domain is. Free domain age checker: registration date, expiry date, registrar and status codes, read live from the public RDAP registry.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this domain age checker shows",
      p: ["Type a domain and you get its age, worked out from the registration date the registry publishes:"],
      list: [
        "<b>Age</b> in years, months and days, plus the total number of days since registration.",
        "<b>Registered on</b>, the date the current registration was created.",
        "<b>Expires on</b>, the date the registration runs out unless it is renewed.",
        "<b>Last updated</b>, the last time the registry record changed.",
        "<b>Registrar</b>, the company the domain is registered through.",
        "<b>Status</b>, the registry's status codes for the domain.",
      ],
      after: ["Any field the registry does not publish is shown as Not published, rather than left blank or guessed."],
    },
    {
      h: "How the checker finds a domain's registration date",
      ordered: true,
      list: [
        "It cleans what you typed. A full address such as https://www.example.com/page becomes example.com. An email address is reduced to its domain.",
        "It asks RDAP, the public registry lookup system that replaced WHOIS, for that domain. It tries rdap.org first, then the registry that IANA lists for the ending.",
        "If you entered a subdomain such as blog.example.com, it drops one level at a time until it reaches the domain the registry actually holds, and tells you it did so.",
        "It reads the registration, expiration and last-changed events from the record, and calculates the age from the registration date.",
      ],
      after: ["Nothing is estimated. If the registry does not publish a date, the tool says so."],
    },
    {
      h: "Why some domains show no age",
      p: ["Three things cause an empty result:"],
      list: [
        "<b>The registry does not publish RDAP data,</b> or publishes it without a registration date. This is most common with some country-code endings.",
        "<b>The domain is not registered.</b> The registry has no record, so there is no date to read.",
        "<b>The registry is rate-limiting lookups.</b> The tool tells you when this happens. Wait a minute and try again.",
      ],
      after: ["One more thing to know: the date shown is when the <b>current</b> registration began. If a domain expired, was deleted and was later registered again by someone else, the registry shows the newer date. The domain name may have existed years earlier under a different owner."],
    },
    {
      h: "Does domain age matter for SEO?",
      p: [
        "Less than many people think. Google representatives have said publicly that domain age on its own is not a ranking factor. An old domain does not rank because it is old.",
        "What older domains often have is history: links from other sites, pages that have earned trust, a brand people search for. Those things help. A domain bought last week with a long registration date and none of that history gets no head start.",
        "So when you look at a domain's age for SEO reasons, use it as a clue, not a score. If you are buying an expired or second-hand domain, also check what it was used for before. A domain with a past full of spam can be a liability, whatever its age.",
      ],
    },
    {
      h: "When to check a domain's age and status",
      p: ["A quick lookup is worth doing in a few situations:"],
      list: [
        "<b>Before you buy from an online shop you have never heard of.</b> A shop whose domain was registered a few weeks ago is not proof of a scam, but it is a reason to look harder.",
        "<b>Before you buy a domain on the aftermarket,</b> to confirm the age the seller claims.",
        "<b>To track your own renewal date.</b> The expiry date shows when you need to renew, whatever your registrar's emails say.",
        "<b>To size up a competitor</b> and see how long they have been around.",
        "<b>To read the status codes,</b> which say whether a domain is locked, switched off or about to be released. The common ones are below.",
      ],
      table: {
        head: ["Status code", "What it means"],
        rows: [
          ["active or ok", "Normal. No restrictions are set."],
          ["client transfer prohibited", "The registrar has locked the domain against transfer. Most well-kept domains have this."],
          ["client delete prohibited / client update prohibited", "Extra locks against deletion or changes, set by the registrar."],
          ["redemption period", "The domain expired and was deleted. The old owner can still restore it for a short time."],
          ["pending delete", "The domain is about to be released and may soon be available to register."],
          ["server hold or client hold", "The domain is registered but switched off, so it does not resolve."],
        ],
      },
      after: ["Looking for a new name instead? The <a href=\"/domain-finder/\">domain finder</a> checks which names are free across dozens of endings at once."],
    },
  ],
  faq: [
    ["How do I find out how old a domain is?", "Type the domain into the box above and click Check age. The tool reads the registration date from the public RDAP registry and shows the age in years, months and days."],
    ["Is this the same as a WHOIS lookup?", "It answers the same question. RDAP is the system that replaced WHOIS for most endings, and it returns the same registration, expiry and registrar details in a structured form. This tool shows the fields that matter for age and status."],
    ["Why does it say the registry does not publish the registration date?", "Some registries, mostly for country-code endings, publish a record without a creation date, or offer no RDAP service at all. The tool cannot show a date the registry does not share."],
    ["Does it show who owns the domain?", "No. It shows the registrar, not the owner. Most owner details are hidden by privacy rules and privacy services, and the tool does not try to work around that."],
    ["Can I check a subdomain?", "Yes. Type blog.example.com and the tool looks up example.com, because subdomains are not registered separately. A note tells you which domain the data belongs to."],
    ["Is an older domain better for SEO?", "Not on its own. Google has said age itself is not a ranking factor. Older domains often rank well because they have links, content and a brand behind them, not because of the date."],
    ["Is the domain age checker free?", "Yes, with no sign-up. If you run many checks quickly, the registry may rate-limit you for a minute."],
  ],
};
