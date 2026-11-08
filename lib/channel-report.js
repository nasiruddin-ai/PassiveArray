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
    ? `${c.title} — your Passive Array channel snapshot`
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
    ? `<p style="margin:18px 0 0"><b>Best recent upload:</b> ${esc(p.best.title)} — ${fmt(p.best.views)} views${p.best.xAvg ? ` (${p.best.xAvg}× your average)` : ""}.</p>`
    : "";
  const mile = ms
    ? `<p style="margin:10px 0 0"><b>Next milestone:</b> ${fmt(ms.left)} more to ${esc(ms.label)}.</p>`
    : "";
  const tipHtml = list.map((t) =>
    `<div style="border-left:3px solid #1F7F73;padding:4px 0 4px 12px;margin:0 0 14px"><div style="font-weight:600">${esc(t.title)}</div><div style="color:#3B4660;font-size:14px;margin-top:2px">${esc(t.text)}</div></div>`
  ).join("");

  const intro = first
    ? `Here is where <b>${esc(c.title)}</b> (${esc(c.handle || "")}) stands today based on public YouTube Data API numbers. Once a week you will receive a short update with your 7-day change.`
    : `Here is how <b>${esc(c.title)}</b> (${esc(c.handle || "")}) did over the last 7 days.`;

  const unsub = opts && opts.unsubscribeUrl
    ? ` · <a href="${esc(opts.unsubscribeUrl)}" style="color:#5A6478">Unsubscribe</a>`
    : "";

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1F2A44;max-width:600px;line-height:1.6;font-size:15px">
<div style="font-size:18px;font-weight:700;margin:0 0 4px">${esc(c.title)}</div>
<div style="color:#5A6478;font-size:13px;margin:0 0 14px">${esc(c.handle || "")}</div>
<p style="margin:0 0 14px">${intro}</p>
${stats}
${best}
${mile}
<h3 style="margin:22px 0 10px;font-size:16px">Notes from your recent numbers</h3>
${tipHtml}
<p style="margin:20px 0 0"><a href="${esc(site)}/app/#channel" style="display:inline-block;background:#1F7F73;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Open your channel dashboard</a></p>
<p style="margin:22px 0 0;font-size:12px;color:#5A6478">Sent to your verified Passive Array account for ${esc(c.handle || c.title)} (${esc(site)}).${unsub}</p>
</div>`;

  const text = [
    first ? `${c.title} — your Passive Array channel snapshot` : `${c.title}, last 7 days`,
    "",
    `Subscribers: ${hidden ? "hidden" : fmt(c.subscribers)}${changeNote("subs") ? " (" + changeNote("subs") + ")" : ""}`,
    `Total views: ${fmt(c.views)}${changeNote("views") ? " (" + changeNote("views") + ")" : ""}`,
    `Videos: ${fmt(c.videos)}`,
    `Average views on recent videos: ${fmt(sm.avgViews)}`,
    p.best ? `Best recent video: ${p.best.title} (${fmt(p.best.views)} views)` : "",
    ms ? `Next milestone: ${fmt(ms.left)} more to ${ms.label}` : "",
    "",
    "Notes from your recent numbers:",
    ...list.map((t) => `- ${t.title}: ${t.text}`),
    "",
    `Open your channel dashboard: ${site}/app/#channel`,
    opts && opts.unsubscribeUrl ? `Unsubscribe: ${opts.unsubscribeUrl}` : "",
  ].filter((l) => l !== null).join("\n");

  return { subject, html, text };
}

/* The one-off email for people who signed up before channel linking existed. */
function buildNudge({ site, addUrl, unsubscribeUrl }) {
  site = String(site || "").replace(/\/$/, "");
  const subject = "Your Passive Array account: add your YouTube channel";
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1F2A44;max-width:600px;line-height:1.6;font-size:15px">
<p style="margin:0 0 12px">Hi,</p>
<p style="margin:0 0 14px">Add your YouTube channel on your Passive Array dashboard and we will send you a snapshot of where it stands, plus a short weekly update.</p>
<p style="margin:18px 0"><a href="${esc(addUrl)}" style="display:inline-block;padding:10px 18px;border-radius:8px;font-weight:600;text-decoration:none;background:#1F7F73;color:#ffffff">Open my dashboard</a></p>
<p style="margin:22px 0 0;font-size:12px;color:#5A6478">Sent to your Passive Array account.${unsubscribeUrl ? ` · <a href="${esc(unsubscribeUrl)}" style="color:#5A6478">Unsubscribe</a>` : ""}</p>
</div>`;
  const text = `${subject}\n\nOpen your dashboard: ${addUrl}\n\nUnsubscribe: ${unsubscribeUrl || ""}`;
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
    ? `Welcome to Passive Array, ${chTitle}`
    : "Welcome to Passive Array";

  const extCard = `<div style="border:1px solid #CBE7E2;background:#F3FAF8;border-radius:10px;padding:16px;margin:16px 0">
<div style="font-size:16px;font-weight:700;margin:0 0 6px;color:#1F2A44">Passive Array for YouTube (Chrome Extension)</div>
<p style="margin:0 0 12px;color:#3B4660;font-size:14px">See engagement rate, views per day, hidden tags and search outlier scores directly on YouTube, plus tag suggestions inside YouTube Studio when you upload.</p>
<a href="${esc(extUrl)}" style="display:inline-block;background:#1F7F73;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Get the Chrome extension →</a>
</div>`;

  if (channelReport && channelReport.ok && channelReport.channel) {
    const inner = buildReport(channelReport, { site, first: true, unsubscribeUrl });
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1F2A44;max-width:600px;line-height:1.6;font-size:15px">
<p style="margin:0 0 10px">Hi there,</p>
<p style="margin:0 0 12px;color:#3B4660">Welcome to <strong>Passive Array</strong>. Your email is verified and your account is ready. Here is the Chrome extension for YouTube and YouTube Studio, followed by today's snapshot for <strong>${esc(chTitle)}</strong>:</p>
${extCard}
<hr style="border:0;border-top:1px solid #E3E8EE;margin:20px 0">
</div>` + inner.html;
    const text = `Hi there,\n\nWelcome to Passive Array! Your email is verified and your account is ready.\n\nGet the Chrome extension for YouTube: ${extUrl}\n\n---\n\n` + inner.text;
    return { subject, html, text };
  }

  const unsub = unsubscribeUrl ? ` · <a href="${esc(unsubscribeUrl)}" style="color:#5A6478">Unsubscribe</a>` : "";
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1F2A44;max-width:600px;line-height:1.6;font-size:15px">
<p style="margin:0 0 10px">Hi there,</p>
<p style="margin:0 0 12px;color:#3B4660">Welcome to <strong>Passive Array</strong>. Your email is verified and your account is ready.</p>
${extCard}
<p style="margin:16px 0 0"><a href="${esc(site)}/app/" style="color:#1F7F73;font-weight:600">Open your dashboard →</a></p>
<p style="margin:22px 0 0;font-size:12px;color:#5A6478">Sent to your verified Passive Array account.${unsub}</p>
</div>`;
  const text = `Hi there,\n\nWelcome to Passive Array! Your email is verified and your account is ready.\n\nGet the Chrome extension: ${extUrl}\nOpen your dashboard: ${site}/app/\n${unsubscribeUrl ? "\nUnsubscribe: " + unsubscribeUrl : ""}`;
  return { subject, html, text };
}

module.exports = { buildReport, buildNudge, buildWelcome, nextMilestone };
