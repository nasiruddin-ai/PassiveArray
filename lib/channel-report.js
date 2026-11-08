// Personal growth email for a creator's own channel.
//
// Built from the payload lib/api-channel.js insights() returns, so every number is
// measured from the YouTube Data API at send time (nothing older than the 6-hour
// tools cache), which keeps the email inside the API's 30-day storage rule.
//
//   buildReport(payload, { site, first, unsubscribeUrl })  -> { subject, html, text } | null
//
// first = true  is the welcome snapshot sent the moment someone adds their channel.
// first = false is the recurring weekly report sent by the daily cron.

const fmt = (n) => (n == null || !isFinite(n) ? "n/a" : Math.round(n).toLocaleString("en-US"));
const signed = (n) => (n == null ? "n/a" : (n >= 0 ? "+" : "") + fmt(n));
const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const MILESTONES = [
  [100, "100 subscribers"],
  [500, "500 subscribers"],
  [1000, "1,000 subscribers, the first YouTube Partner Program threshold"],
  [10000, "10,000 subscribers"],
  [100000, "100,000 subscribers and the Silver Creator Award"],
  [1000000, "1,000,000 subscribers and the Gold Creator Award"],
];

function nextMilestone(subs) {
  if (subs == null) return null;
  const m = MILESTONES.find(([n]) => subs < n);
  return m ? { target: m[0], label: m[1], left: m[0] - subs } : null;
}

/* Up to 3 suggestions, each tied to a number in the payload and a tool that helps. */
function tips(p, site) {
  const out = [];
  const tool = (slug) => site + "/creator-tools/" + slug + "/";
  const uploads = p.uploads || [];
  const last = uploads[0];
  const sm = p.summary || {};
  const best = p.best;

  if (last && last.days > 14) {
    out.push({
      title: `It has been ${last.days} days since your last upload`,
      text: "Channels that upload on a steady rhythm give the algorithm more chances to test them. Pick a schedule you can keep, even if it is one video every two weeks.",
      link: [tool("youtube-video-ideas-generator"), "Get video ideas"],
    });
  }
  if (best && best.xAvg >= 2 && uploads.length >= 3) {
    out.push({
      title: `"${best.title}" did ${best.xAvg}× your recent average`,
      text: "That topic is working for your audience. A follow-up, a part 2 or a different angle on the same subject is the cheapest growth you can get.",
      link: [best.url, "Look at the video"],
    });
  }
  if (sm.viewsPerSub != null && sm.viewsPerSub < 5 && p.channel && p.channel.subscribers >= 500) {
    out.push({
      title: `Your recent videos reach about ${sm.viewsPerSub}% of your subscribers`,
      text: "When views lag behind subscribers, the title and thumbnail are usually what decides the click. Test your next title before you publish.",
      link: [tool("youtube-title-analyzer"), "Score a title"],
    });
  }
  if (out.length < 3 && sm.uploadsPerMonth > 0 && sm.uploadsPerMonth < 2) {
    out.push({
      title: `You upload about ${sm.uploadsPerMonth} time${sm.uploadsPerMonth === 1 ? "" : "s"} a month`,
      text: "Short-form clips cut from your long videos are a low-effort way to add uploads and reach new viewers between main videos.",
      link: [tool("youtube-video-ideas-generator"), "Get video ideas"],
    });
  }
  if (out.length < 3) {
    out.push({
      title: "Make search work for your next video",
      text: "Pick a phrase people actually search for, with competition a channel your size can beat, and put it in the title.",
      link: [site + "/research/", "Research a keyword"],
    });
  }
  return out.slice(0, 3);
}

function buildReport(p, opts) {
  if (!p || !p.ok || !p.channel) return null;
  const site = String((opts && opts.site) || "").replace(/\/$/, "");
  const first = !!(opts && opts.first);
  const c = p.channel;
  const sm = p.summary || {};
  const hidden = !!c.hiddenSubscribers;
  const ms = hidden ? null : nextMilestone(c.subscribers);
  const d = p.d7 || p.sinceStart || null;
  const list = tips(p, site);

  const subject = first
    ? `Your free channel snapshot: ${c.title}`
    : d && d.subs != null
      ? `${c.title} this week: ${signed(d.subs)} subscribers, ${signed(d.views)} views`
      : `${c.title}: your weekly growth report`;

  const stat = (label, value, note) =>
    `<td style="padding:12px;border:1px solid #E3E8EE;border-radius:8px;vertical-align:top;width:25%"><div style="font-size:12px;color:#5A6478">${esc(label)}</div><div style="font-size:20px;font-weight:700;margin-top:2px">${esc(value)}</div>${note ? `<div style="font-size:12px;color:#5A6478;margin-top:2px">${esc(note)}</div>` : ""}</td>`;

  const changeNote = (key) => (d && d[key] != null ? signed(d[key]) + (p.d7 ? " in 7 days" : " since " + d.from) : "");
  const stats = `<table role="presentation" style="border-collapse:separate;border-spacing:6px;width:100%;margin:0 -6px"><tr>
${stat("Subscribers", hidden ? "hidden" : fmt(c.subscribers), changeNote("subs"))}
${stat("Total views", fmt(c.views), changeNote("views"))}
${stat("Videos", fmt(c.videos), changeNote("videos"))}
${stat("Avg views, recent", fmt(sm.avgViews), sm.uploadsPerMonth ? sm.uploadsPerMonth + " uploads/month" : "")}
</tr></table>`;

  const best = p.best
    ? `<p style="margin:18px 0 0"><b>Best recent video:</b> <a href="${esc(p.best.url)}" style="color:#1F7F73">${esc(p.best.title)}</a>, ${fmt(p.best.views)} views${p.best.xAvg ? ` (${p.best.xAvg}× your average)` : ""}.</p>`
    : "";
  const mile = ms
    ? `<p style="margin:10px 0 0"><b>Next milestone:</b> ${fmt(ms.left)} more to ${esc(ms.label)}.</p>`
    : "";
  const tipHtml = list.map((t) =>
    `<div style="border-left:3px solid #1F7F73;padding:4px 0 4px 12px;margin:0 0 14px"><div style="font-weight:600">${esc(t.title)}</div><div style="color:#3B4660;font-size:14px;margin-top:2px">${esc(t.text)}</div><a href="${esc(t.link[0])}" style="color:#1F7F73;font-size:14px;font-weight:600">${esc(t.link[1])} →</a></div>`
  ).join("");

  const intro = first
    ? `Thanks for adding your channel. Here is where <b>${esc(c.title)}</b> stands today. From next week you will get a short report like this with your real 7-day change.`
    : `Here is how <b>${esc(c.title)}</b> did over the last 7 days.`;

  const unsub = opts && opts.unsubscribeUrl
    ? ` <a href="${esc(opts.unsubscribeUrl)}" style="color:#5A6478">Unsubscribe from these emails</a>.`
    : "";

  const html = `<div style="font-family:Poppins,Segoe UI,Arial,sans-serif;color:#1F2A44;max-width:640px;margin:0 auto;line-height:1.5">
<table role="presentation" style="border-collapse:collapse;margin:0 0 14px"><tr>${c.thumbnail ? `<td style="padding-right:12px"><img src="${esc(c.thumbnail)}" width="48" height="48" alt="" style="border-radius:50%;display:block"></td>` : ""}<td><div style="font-size:18px;font-weight:700">${esc(c.title)}</div><div style="color:#5A6478;font-size:13px">${esc(c.handle || "")}</div></td></tr></table>
<p style="margin:0 0 14px">${intro}</p>
${stats}
${best}
${mile}
<h3 style="margin:24px 0 10px;font-size:16px">${list.length} thing${list.length === 1 ? "" : "s"} to try next</h3>
${tipHtml}
<p style="margin:20px 0 0"><a href="${esc(site)}/app/#channel" style="display:inline-block;background:#1F7F73;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Open your channel dashboard</a></p>
<p style="margin:22px 0 0;font-size:12px;color:#5A6478">Public statistics from the YouTube Data API, measured when this email was sent. You get this because you added ${esc(c.handle || c.title)} to your Passive Array account. Change or remove the channel on your <a href="${esc(site)}/app/#channel" style="color:#5A6478">dashboard</a>.${unsub}</p>
</div>`;

  const text = [
    first ? `Your free channel snapshot: ${c.title}` : `${c.title}, last 7 days`,
    "",
    `Subscribers: ${hidden ? "hidden" : fmt(c.subscribers)}${changeNote("subs") ? " (" + changeNote("subs") + ")" : ""}`,
    `Total views: ${fmt(c.views)}${changeNote("views") ? " (" + changeNote("views") + ")" : ""}`,
    `Videos: ${fmt(c.videos)}`,
    `Average views on recent videos: ${fmt(sm.avgViews)}`,
    p.best ? `Best recent video: ${p.best.title} (${fmt(p.best.views)} views)` : "",
    ms ? `Next milestone: ${fmt(ms.left)} more to ${ms.label}` : "",
    "",
    "Things to try next:",
    ...list.map((t) => `- ${t.title}: ${t.text} ${t.link[0]}`),
    "",
    `Dashboard: ${site}/app/#channel`,
    opts && opts.unsubscribeUrl ? `Unsubscribe: ${opts.unsubscribeUrl}` : "",
  ].filter((l) => l !== null).join("\n");

  return { subject, html, text };
}

/* The one-off email for people who signed up before Google channel verification existed. */
function buildNudge({ site, addUrl, unsubscribeUrl }) {
  site = String(site || "").replace(/\/$/, "");
  const subject = "Verify your YouTube channel for your free growth snapshot";
  const btn = (href, label) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 18px;border-radius:8px;font-weight:600;text-decoration:none;background:#1F7F73;color:#fff">${esc(label)}</a>`;
  const html = `<div style="font-family:Poppins,Segoe UI,Arial,sans-serif;color:#1F2A44;max-width:640px;margin:0 auto;line-height:1.5">
<h2 style="margin:0 0 10px">${esc(subject)}</h2>
<p>Verify your YouTube channel with Google on your Passive Array dashboard and we will email you a free snapshot of where it stands, with three specific things to try next, then a short growth report each week.</p>
<p style="margin:18px 0">${btn(addUrl, "Verify my YouTube channel")}</p>
<p style="font-size:13px;color:#5A6478">Read-only verification so only the real owner can connect a channel. Want to check competitors instead? Use Watchlist or the public tools.</p>
<p style="margin:22px 0 0;font-size:12px;color:#5A6478">You get this because you have a Passive Array account.${unsubscribeUrl ? ` <a href="${esc(unsubscribeUrl)}" style="color:#5A6478">Unsubscribe</a>.` : ""}</p>
</div>`;
  const text = `${subject}\n\nVerify your channel: ${addUrl}\n\nUnsubscribe: ${unsubscribeUrl || ""}`;
  return { subject, html, text };
}

/* Sent once when a new account finishes email/Google verification at sign-up.
   Greets them, invites them to install the Chrome extension, and includes their
   channel snapshot if they entered a channel at sign-up. */
function buildWelcome({ site, channelReport, unsubscribeUrl }) {
  site = String(site || "").replace(/\/$/, "");
  const extUrl = site + "/youtube-extension/";
  const chTitle = channelReport && channelReport.channel ? channelReport.channel.title : "";
  const subject = chTitle
    ? `Welcome to Passive Array — here is your ${chTitle} snapshot + our Chrome extension`
    : "Welcome to Passive Array — install the free YouTube Chrome extension";

  const extCard = `<div style="border:1px solid #CBE7E2;background:#F3FAF8;border-radius:10px;padding:16px;margin:16px 0">
<div style="font-size:12px;font-weight:700;color:#1F7F73;letter-spacing:.04em">STEP 1 · FREE CHROME EXTENSION</div>
<div style="font-size:17px;font-weight:700;margin:4px 0 6px">Install Passive Array for YouTube</div>
<p style="margin:0 0 12px;color:#3B4660;font-size:14px">See live tag, title and outlier data right on YouTube watch pages, plus one-click tag suggestions inside YouTube Studio when you upload.</p>
<a href="${esc(extUrl)}" style="display:inline-block;background:#1F7F73;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Install the Chrome extension →</a>
</div>`;

  if (channelReport && channelReport.ok && channelReport.channel) {
    const inner = buildReport(channelReport, { site, first: true, unsubscribeUrl });
    const html = `<div style="font-family:Poppins,Segoe UI,Arial,sans-serif;color:#1F2A44;max-width:640px;margin:0 auto;line-height:1.5">
<h2 style="margin:0 0 6px">Welcome to Passive Array</h2>
<p style="margin:0 0 12px;color:#3B4660">Your email is verified and your account is ready. First, grab the free Chrome extension so you have our tools inside YouTube and YouTube Studio:</p>
${extCard}
<hr style="border:0;border-top:1px solid #E3E8EE;margin:22px 0">
</div>` + inner.html;
    const text = `Welcome to Passive Array!\n\nInstall the free Chrome extension: ${extUrl}\n\n---\n\n` + inner.text;
    return { subject, html, text };
  }

  const unsub = unsubscribeUrl ? ` <a href="${esc(unsubscribeUrl)}" style="color:#5A6478">Unsubscribe</a>.` : "";
  const html = `<div style="font-family:Poppins,Segoe UI,Arial,sans-serif;color:#1F2A44;max-width:640px;margin:0 auto;line-height:1.5">
<h2 style="margin:0 0 6px">Welcome to Passive Array</h2>
<p style="margin:0 0 12px;color:#3B4660">Your email is verified and your free account is ready.</p>
${extCard}
<p style="margin:16px 0 0"><a href="${esc(site)}/app/" style="color:#1F7F73;font-weight:600">Open your dashboard →</a> · <a href="${esc(site)}/creator-tools/" style="color:#1F7F73;font-weight:600">All 60+ free tools →</a></p>
<p style="margin:22px 0 0;font-size:12px;color:#5A6478">You received this because you created an account on Passive Array.${unsub}</p>
</div>`;
  const text = `Welcome to Passive Array!\n\nYour email is verified and your free account is ready.\n\nInstall the free Chrome extension: ${extUrl}\nOpen your dashboard: ${site}/app/\nAll free tools: ${site}/creator-tools/\n${unsubscribeUrl ? "\nUnsubscribe: " + unsubscribeUrl : ""}`;
  return { subject, html, text };
}

module.exports = { buildReport, buildNudge, buildWelcome, nextMilestone };
