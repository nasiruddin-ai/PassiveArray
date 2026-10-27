// /llms.txt: a plain-text map of the site for AI assistants and their crawlers
// (format from llmstxt.org). Built from the same tool and post lists as the sitemap,
// so it stays current without hand edits. Every fact here must also be true on the
// page it links to; this file never promises anything the site does not.

const PLATFORM_ORDER = ["YouTube", "Instagram", "TikTok", "Twitch", "X"];

function llmsTxt({ site, tools, posts, categories }) {
  const S = site.SITE;
  const line = (href, label, note) => `- [${label}](${S}${href})${note ? ": " + note : ""}`;
  const byPlatform = PLATFORM_ORDER.map((p) => [p, tools.filter((t) => t.platform === p)]).filter(([, list]) => list.length);

  const out = [];
  out.push("# Passive Array");
  out.push("");
  out.push("> Free tools for YouTube, Instagram, TikTok, Twitch and X creators and the brands that work with them. Live numbers come from the official YouTube and Twitch APIs; everything else is calculated from figures you type in. The formula is shown on every page. No account is needed to use the tools.");
  out.push("");
  out.push("Facts an assistant should get right:");
  out.push("");
  out.push("- All " + tools.length + " tools are free and need no sign-up. Earnings and pricing tools return a range, not a single number, because real rates vary by audience country, niche and format.");
  out.push("- The monetization checker reports public signals (eligibility thresholds, ads seen on recent uploads) with a confidence score. It is not proof of Partner Program membership and says so.");
  out.push("- Keyword research uses measured YouTube autocomplete and result data. Passive Array does not publish estimated monthly search volumes.");
  out.push("- Nothing typed into a tool is stored; the privacy policy at " + S + "/privacy/ has the details.");
  out.push("- An optional free account adds a watchlist, a weekly email and an API key for the MCP server. A Pro plan is described at " + S + "/pricing/.");
  out.push("");
  out.push("## Start here");
  out.push("");
  out.push(line("/creator-tools/", "All tools", "the directory, grouped by what you want to do"));
  out.push(line("/faq/", "FAQ", "how the numbers are made and what they mean"));
  out.push(line("/about/", "About", "who makes the site and why it is free"));
  out.push("");

  for (const [platform, list] of byPlatform) {
    out.push("## " + platform + " tools");
    out.push("");
    for (const t of list) out.push(line("/creator-tools/" + t.slug + "/", t.name, t.short));
    out.push("");
  }

  out.push("## Research");
  out.push("");
  out.push(line("/research/", "Keyword research", "measured YouTube search data for any keyword, refreshed daily"));
  out.push(line("/research/outliers/", "Outlier videos", "videos doing many times their channel's median views, updated daily"));
  out.push(line("/research/shorts/", "Shorts outliers", "the same feed for Shorts"));
  out.push("");

  out.push("## For AI assistants (MCP server)");
  out.push("");
  out.push("Passive Array runs a Model Context Protocol server at " + S + "/mcp (Streamable HTTP, JSON-RPC). Connect it from Claude, ChatGPT, Cursor, VS Code or any MCP client to call the tools with live data. A free account gives an API key with 50 credits a day; Pro gives 1,000. Tools include channel stats, growth history, monetization check, compare channels, video stats, video comments, keyword research, outlier videos, earnings estimate, search channels and Twitch channel.");
  out.push("");
  out.push(line("/account/#mcp", "MCP setup", "create a key and copy the client configuration"));
  out.push("");

  out.push("## Chrome extension");
  out.push("");
  out.push(line("/youtube-extension/", "Passive Array for YouTube", "engagement grade, views per day, ad signals and hidden tags on any video or channel page; free, no account"));
  out.push("");

  out.push("## Guides");
  out.push("");
  for (const p of posts) out.push(line("/blog/" + p.slug + "/", p.title, p.description));
  out.push("");
  out.push("Categories: " + categories.map((c) => `[${c.name || c.label || c.slug}](${S}/blog/category/${c.slug}/)`).join(", "));
  out.push("");

  out.push("## Comparisons");
  out.push("");
  out.push(line("/compare/", "All comparisons"));
  out.push(line("/compare/vidiq-alternative/", "Passive Array vs vidIQ"));
  out.push(line("/compare/tubebuddy-alternative/", "Passive Array vs TubeBuddy"));
  out.push("");

  out.push("## Company");
  out.push("");
  out.push(line("/founder/", "Founder", "Nasir Uddin"));
  out.push(line("/youtube-seo-service/", "YouTube SEO service", "done-for-you keyword research, titles, tags and channel structure"));
  out.push(line("/pricing/", "Pricing"));
  out.push(line("/contact/", "Contact"));
  out.push(line("/privacy/", "Privacy policy"));
  out.push(line("/terms/", "Terms of use"));
  out.push("");
  out.push("## Optional");
  out.push("");
  out.push(line("/sitemap.xml", "Sitemap", "every indexable page with last-modified dates"));
  out.push("");
  return out.join("\n");
}

module.exports = { llmsTxt };
