// Public documentation page for the Passive Array MCP server.
// Built to dist/mcp-docs/index.html. vercel.json serves it at https://passivearray.com/mcp
// when a browser asks for HTML; MCP clients (POST, or GET with text/event-stream) still reach
// the server function. The tool table is read from lib/mcp.js, so it always matches the server.
const site = require("../creator-tools/build-tools.js");
const mcp = require("../lib/mcp.js");
const { esc } = site;

const URL = "https://passivearray.com/mcp";
const KEY_PAGE = "/account/#mcp";
// Bump when the page text changes; the sitemap uses it as lastmod.
const UPDATED = "2026-11-18";

const firstSentence = (s) => { const m = /^(.+?[.!?])(\s|$)/.exec(String(s)); return m ? m[1] : String(s); };
const code = (text) => `<div class="md-snip"><pre><code>${esc(text)}</code></pre><button type="button" class="btn ghost md-copy" data-copy="${esc(text)}">Copy</button></div>`;

const CLIENTS = [
  ["claude", "Claude (web and desktop)", `<ol><li>Open <b>Settings → Connectors</b> and choose <b>Add custom connector</b>.</li><li>Name it <b>Passive Array</b> and paste this as the remote MCP server URL, with your key in place of <code>YOUR_KEY</code>:</li></ol>${code(URL + "?key=YOUR_KEY")}<ol start="3"><li>In a chat, open the tools menu and switch Passive Array on.</li></ol>`],
  ["chatgpt", "ChatGPT", `<ol><li>Open <b>Settings → Apps &amp; Connectors → Advanced settings</b> and turn on <b>Developer mode</b>. It is only offered on some ChatGPT plans.</li><li>Back in Apps &amp; Connectors, choose <b>Create</b>, name it <b>Passive Array</b> and paste:</li></ol>${code(URL + "?key=YOUR_KEY")}<ol start="3"><li>Set authentication to <b>No authentication</b>, because the key is already in the URL, then save.</li></ol>`],
  ["claude-code", "Claude Code", `<p>Run this in a terminal, then type <code>/mcp</code> in Claude Code to check the connection:</p>${code(`claude mcp add --transport http passive-array ${URL} --header "Authorization: Bearer YOUR_KEY"`)}`],
  ["cursor", "Cursor", `<p>Use <b>Cursor Settings → MCP → Add new MCP server</b>, or put this in <code>~/.cursor/mcp.json</code> (all projects) or <code>.cursor/mcp.json</code> (one project):</p>${code(JSON.stringify({ mcpServers: { "passive-array": { url: URL, headers: { Authorization: "Bearer YOUR_KEY" } } } }, null, 2))}`],
  ["vscode", "VS Code (Copilot agent mode)", `<p>Put this in <code>.vscode/mcp.json</code>, or run <b>MCP: Add Server</b> from the Command Palette and choose HTTP:</p>${code(JSON.stringify({ servers: { "passive-array": { type: "http", url: URL, headers: { Authorization: "Bearer YOUR_KEY" } } } }, null, 2))}`],
  ["gemini", "Gemini CLI", `<p>Add this to <code>~/.gemini/settings.json</code>, restart Gemini CLI and run <code>/mcp</code>:</p>${code(JSON.stringify({ mcpServers: { "passive-array": { httpUrl: URL, headers: { Authorization: "Bearer YOUR_KEY" } } } }, null, 2))}`],
  ["other", "Any other MCP client", `<p>Any client that supports remote MCP servers over streamable HTTP works. Send the key as a header:</p>${code("Authorization: Bearer YOUR_KEY")}<p>If the client only takes a URL, put the key in the URL instead: <code>${esc(URL)}?key=YOUR_KEY</code>. Treat that URL like a password.</p>`],
];

const FAQ = [
  ["Is the Passive Array MCP server free?", `Yes. A free account gets ${mcp.FREE_CREDITS} credits a day, enough for dozens of channel lookups. Pro ($9 a month) raises that to ${mcp.PRO_CREDITS.toLocaleString("en-US")} credits a day. Only successful calls use credits.`],
  ["Do I need to connect my YouTube channel?", "No. Every tool reads public data from the official YouTube Data API and Twitch Helix API. The server never asks for your YouTube or Google login and cannot change anything on a channel."],
  ["Does it support OAuth?", "Not yet. It uses an API key, sent as an Authorization: Bearer header or as ?key= in the URL for clients that only accept a URL."],
  ["When do credits reset?", "Every day at 00:00 UTC. When an account runs out, the tool returns a message saying so instead of data."],
  ["Is my API key safe?", `Passive Array stores only a SHA-256 hash of each key, never the key itself. Anyone with the key can use your credits, so keep it private and revoke it on the account page if it leaks. You can have up to ${mcp.MAX_KEYS} keys.`],
  ["Why does keyword research or channel search sometimes say the quota is used up?", "Those two tools use YouTube search, which has a small daily allowance shared by everyone. On a busy day they can return a quota message until the next day. The other tools are not affected."],
  ["Is it listed in the official MCP Registry?", "Yes, as com.passivearray/mcp in the official MCP Registry at registry.modelcontextprotocol.io."],
];

function page() {
  const tools = mcp.toolSummary();
  const totalTools = tools.length;
  const rows = tools.map((t) => `<tr><td><b>${esc(t.title)}</b><br><code>${esc(t.name)}</code></td><td>${esc(firstSentence(t.description))}</td><td class="md-num">${t.credits}</td></tr>`).join("");
  const facts = [
    ["Server URL", `<code>${esc(URL)}</code>`],
    ["Transport", "Streamable HTTP (remote, nothing to install)"],
    ["Authentication", `Free API key, sent as <code>Authorization: Bearer pa_...</code> or <code>?key=pa_...</code>`],
    ["Tools", `${totalTools}, all read-only`],
    ["Free plan", `${mcp.FREE_CREDITS} credits a day, resets 00:00 UTC`],
    ["Pro plan", `${mcp.PRO_CREDITS.toLocaleString("en-US")} credits a day, $9 a month`],
    ["Data sources", "YouTube Data API and Twitch Helix API, plus Passive Array's own daily tracking"],
    ["Registry name", "<code>com.passivearray/mcp</code>"],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

  const body = `<style>
.md-hero{padding:48px 0 28px;max-width:52rem}
.md-hero .eyebrow{display:inline-block;font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--deep);margin-bottom:12px}
:root[data-theme="dark"] .md-hero .eyebrow{color:var(--mint)}
.md-hero h1{font-size:clamp(1.9rem,4vw,2.8rem);line-height:1.12;margin:0 0 14px}
.md-hero p{color:var(--muted);font-size:1.08rem;max-width:44rem}
.md-endpoint{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:22px}
.md-endpoint code{font-size:1.02rem;padding:10px 14px;border:1px solid var(--line);border-radius:10px;background:var(--card)}
.md-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.md-facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border:1px solid var(--line);border-radius:14px;background:var(--card);overflow:hidden;margin:8px 0 40px}
.md-facts div{padding:16px 18px;border-left:1px solid var(--line);border-top:1px solid var(--line)}
.md-facts div:nth-child(4n+1){border-left:0}.md-facts div:nth-child(-n+4){border-top:0}
.md-facts dt{font-size:.78rem;color:var(--muted);margin-bottom:4px}.md-facts dd{margin:0;font-weight:500;overflow-wrap:anywhere}
.md-sec{margin:0 0 44px}.md-sec>h2{font-size:1.5rem;margin:0 0 10px}.md-sec>p{color:var(--muted);max-width:46rem}
.md-steps{counter-reset:s;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:16px}
.md-steps li{list-style:none;border:1px solid var(--line);border-radius:14px;background:var(--card);padding:18px}
.md-steps li b{display:block;margin-bottom:6px}
.md-steps li::before{counter-increment:s;content:counter(s);display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--soft);color:var(--deep);font-weight:600;font-size:.85rem;margin-bottom:10px}
.md-clients{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}
.md-client{border:1px solid var(--line);border-radius:14px;background:var(--card);padding:18px 20px;min-width:0}
.md-client:last-child:nth-child(odd){grid-column:1/-1}
.md-client h3{font-size:1.05rem;margin:0 0 8px}.md-client ol{padding-left:20px;margin:8px 0}.md-client p{margin:8px 0}
.md-snip{position:relative;margin:10px 0}.md-snip pre{margin:0;padding:12px 14px;padding-right:76px;border-radius:10px;background:var(--bg);border:1px solid var(--line);overflow-x:auto;font-size:.82rem;line-height:1.5}
.md-snip .md-copy{position:absolute;top:8px;right:8px;min-height:30px;padding:0 10px;font-size:.8rem}
.md-num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.md-table td{vertical-align:top}.md-table code{font-size:.8rem;color:var(--muted)}
.md-faq details{border-bottom:1px solid var(--line);padding:4px 0}.md-faq summary{cursor:pointer;font-weight:600;padding:12px 0}.md-faq p{color:var(--muted);margin:0 0 14px}
.md-prompts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.md-prompts span{border:1px solid var(--line);border-radius:999px;padding:7px 12px;background:var(--card);font-size:.9rem}
@media (max-width:860px){.md-facts{grid-template-columns:repeat(2,minmax(0,1fr))}.md-facts div:nth-child(4n+1){border-left:1px solid var(--line)}.md-facts div:nth-child(-n+4){border-top:1px solid var(--line)}.md-facts div:nth-child(odd){border-left:0}.md-facts div:nth-child(-n+2){border-top:0}.md-steps,.md-clients{grid-template-columns:minmax(0,1fr)}}
</style>
<section class="md-hero">
  <span class="eyebrow">MCP server</span>
  <h1>Passive Array MCP server: live YouTube and Twitch data for AI assistants</h1>
  <p>Connect Claude, ChatGPT, Cursor, VS Code or any MCP client to Passive Array, then ask about any channel. ${totalTools} read-only tools return measured data from the official YouTube and Twitch APIs: channel stats, growth history, monetization signals, comment audits, keyword research and outlier videos.</p>
  <div class="md-endpoint"><code>${esc(URL)}</code><button type="button" class="btn ghost md-copy" data-copy="${esc(URL)}">Copy server URL</button></div>
  <div class="md-actions"><a class="btn" href="${KEY_PAGE}">Get a free API key</a><a class="btn ghost" href="#connect">Connection guides</a></div>
</section>

<dl class="md-facts">${facts}</dl>

<section class="md-sec" id="start">
  <h2>Get started in three steps</h2>
  <ol class="md-steps">
    <li><b>Create a free account</b>Sign up on Passive Array. No card needed.</li>
    <li><b>Make an API key</b>On the <a href="${KEY_PAGE}">account page</a>, create a key. It starts with <code>pa_</code> and is shown once.</li>
    <li><b>Add the server to your client</b>Use the server URL above with your key, following the guide for your client below.</li>
  </ol>
</section>

<section class="md-sec" id="connect">
  <h2>Connect your AI client</h2>
  <p>Replace <code>YOUR_KEY</code> with your key. The account page fills it in for you when you create one.</p>
  <div class="md-clients">${CLIENTS.map(([id, name, html]) => `<div class="md-client" id="${id}"><h3>${esc(name)}</h3>${html}</div>`).join("")}</div>
</section>

<section class="md-sec" id="tools">
  <h2>The ${totalTools} tools</h2>
  <p>Every tool is read-only and works on public data. The credits column is what one successful call costs.</p>
  <div class="tablewrap"><table class="md-table"><thead><tr><th>Tool</th><th>What it returns</th><th class="md-num">Credits</th></tr></thead><tbody>${rows}</tbody></table></div>
</section>

<section class="md-sec" id="examples">
  <h2>Things to ask</h2>
  <div class="md-prompts"><span>How fast is @mkbhd growing this month?</span><span>Is @veritasium monetized, and how sure are you?</span><span>Compare @mrbeast and @t-series on views per video</span><span>Audit the comment section of my channel</span><span>Which videos are outperforming their channel this week?</span><span>Keyword research for "budget travel"</span></div>
</section>

<section class="md-sec md-faq" id="faq">
  <h2>Questions</h2>
  ${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
</section>
<script>
document.addEventListener("click", function (e) {
  var b = e.target.closest && e.target.closest("[data-copy]");
  if (!b) return;
  var t = b.getAttribute("data-copy"), label = b.textContent;
  var done = function (msg) { b.textContent = msg; setTimeout(function () { b.textContent = label; }, 2000); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done("Copied"); }, function () { done("Select and copy"); });
  else done("Select and copy");
});
</script>`;

  const jsonld = [
    site.webPageLd("Passive Array MCP server", URL, `Remote MCP server with ${totalTools} read-only tools for live YouTube and Twitch data.`),
    site.faqLd(FAQ),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.SITE + "/" },
        { "@type": "ListItem", position: 2, name: "MCP Server", item: URL },
      ],
    },
  ];
  return site.shell({
    title: "Passive Array MCP Server: YouTube & Twitch Data for AI",
    description: `Connect Claude, ChatGPT, Cursor or VS Code to live YouTube and Twitch data. ${totalTools} read-only MCP tools, free API key, ${mcp.FREE_CREDITS} credits a day.`,
    path: "/mcp",
    body,
    jsonld,
  });
}

module.exports = { page, UPDATED };
