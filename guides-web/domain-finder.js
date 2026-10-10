// Long-form guide for /domain-finder/.
// Every behaviour described here matches domain-finder/public/index.html and domain-finder/lib/check.js.
module.exports = {
  seoTitle: "Domain Name Finder: Check Availability Free | Passive Array",
  seoDescription: "Check which domain names are free to register. Type your ideas, pick endings like .com, .io or .ai and get live answers from DNS, RDAP and WHOIS. No sign-up.",
  guideUpdated: "October 2026",
  guide: [
    {
      h: "What this domain finder does",
      p: ["Type one or more name ideas and the tool checks every combination with the endings you pick. Results arrive one by one, and the free names float to the top when the search finishes."],
      list: [
        "<b>Eight endings are ticked by default:</b> .com, .net, .org, .io, .co, .ai, .app and .dev.",
        "<b>Sixteen more are one click away,</b> including .xyz, .me, .in, .co.uk, .us, .ca, .store, .shop and .studio. You can also type any other ending, such as pk or co.in.",
        "<b>Variations are optional.</b> Tick the box and each idea is also tried with get, try, my and use in front, and app, hq, hub, labs and ly on the end.",
        "<b>Full domains are checked exactly.</b> Type myshop.io and only myshop.io is checked.",
        "<b>Up to 300 domains per search.</b> The counter under the form shows how many your list adds up to before you start.",
      ],
      after: ["Each free name gets links to Namecheap, Porkbun and GoDaddy so you can see the price and register it. The tool itself does not sell, reserve or register anything."],
    },
    {
      h: "How does it know if a domain is available?",
      p: ["It asks the same public systems registrars use, cheapest check first:"],
      ordered: true,
      list: [
        "<b>DNS.</b> If the name has live name servers, someone owns it. The answer is Taken, with no need to ask further.",
        "<b>RDAP.</b> This is the registry lookup system that replaced WHOIS. The tool finds the right registry from the list IANA publishes. If the registry says it has no record, the name is free.",
        "<b>WHOIS.</b> Some endings still have no RDAP service. For those, the tool asks the classic WHOIS server that IANA lists for that ending and reads its reply.",
      ],
      after: ["Answers are kept for 10 minutes, so checking the same name twice in a row does not hit the registry again. Four checks run at a time so no registry is flooded. If a registry is slow or busy, that one name shows Could not check rather than a guess."],
    },
    {
      h: "What the four results mean",
      table: {
        head: ["Result", "What it means", "What to do"],
        rows: [
          ["Available", "The registry confirmed it has no record for the name.", "Check the price at a registrar and register it if you want it."],
          ["Probably available", "No name servers were found, but the registry did not answer.", "Confirm at a registrar before you rely on it."],
          ["Taken", "Name servers exist, or the registry has a record. The registrar name is shown when it is published.", "Try a variation, or look up how long it has been owned."],
          ["Could not check", "The registry timed out, rate-limited the lookup, or gave a reply the tool did not understand.", "Wait a minute and search that one name again."],
        ],
      },
      after: ["Click Show only available to hide the rest, and Copy available list to put every free name on your clipboard. Names that are only probably available are marked as such in the copied list."],
    },
    {
      h: "Why an available domain might still cost more or be blocked",
      p: [
        "Available means the registry has no record of anyone owning the name. It does not tell you the price, and it does not promise the registry will sell it at the standard rate.",
        "Some registries keep short or dictionary-word names as <b>premium</b>, priced far above a normal registration. Others hold back <b>reserved</b> names they never sell to the public. Neither shows up in a plain availability lookup, which is why the tool sends you to the registrar's own page for the final price.",
        "A name can also be registered by someone else between your search and your purchase. If you find one you like, do not wait days to buy it.",
      ],
    },
    {
      h: "How to choose a domain name that works",
      list: [
        "<b>Say it out loud.</b> If you have to spell it for someone, it will be mistyped. Avoid hyphens and numbers for the same reason.",
        "<b>Keep it short.</b> Shorter names fit on a logo, a business card and a phone screen.",
        "<b>Prefer .com if it is free,</b> because people type it by habit. If it is taken, pick an ending that suits what you do: .io and .dev for software, .shop or .store for retail, a country ending for a local business.",
        "<b>Use the variations box</b> when the plain name is gone. A prefix like get or try often frees up the .com.",
        "<b>Check the name is not someone's trademark</b> before you build a brand on it.",
      ],
      after: [
        "If the name you want is taken, the <a href=\"/domain-age-checker/\">domain age checker</a> shows when it was registered and when it expires, which tells you whether it is an active business or a parked name. Once your site is live, the <a href=\"/seo-roi-calculator/\">SEO ROI calculator</a> helps you work out what search traffic to it could be worth.",
      ],
    },
  ],
  faq: [
    ["Is this domain finder free?", "Yes. There is no sign-up and no paid tier for it. You can check up to 300 domains in one search."],
    ["Does searching for a domain let someone else grab it first?", "The tool does not register, reserve or resell names. Lookups go to DNS, RDAP and WHOIS servers, the same public systems every registrar uses. Still, if you find a name you want, register it soon, because anyone can buy it."],
    ["Does it show domain prices?", "No. Registries do not publish prices through RDAP or WHOIS. Each free name links to Namecheap, Porkbun and GoDaddy, where you see the real price, including any premium pricing."],
    ["What is the difference between RDAP and WHOIS?", "Both answer the question \"who holds this domain?\". WHOIS is the older system and returns plain text in a different layout for every registry. RDAP is its replacement and returns structured data. The tool uses RDAP where a registry offers it and falls back to WHOIS where it does not."],
    ["Can I check country endings like .pk, .co.uk or .co.in?", "Yes. .co.uk is in the list, and you can type any other ending in the box below the buttons. Whether a result comes back depends on that country's registry offering RDAP or WHOIS. If it offers neither, you will see Could not check, or Probably available when DNS shows no name servers."],
    ["Why do some names say Could not check?", "The registry took too long, rate-limited the request, or replied in a way the tool could not read. Wait a minute and search that single name again. Smaller searches are less likely to be rate-limited."],
    ["What does Probably available mean?", "The name has no name servers, which usually means it is not registered, but the registry could not confirm it. Treat it as a lead, not an answer, and confirm at a registrar."],
  ],
};
