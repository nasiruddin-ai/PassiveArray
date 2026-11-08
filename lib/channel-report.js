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

/* The one-off email for people who signed up before the channel step existed.
   guess = { title, handle, id } from their watchlist, or null to just ask. */
function buildNudge({ site, guess, confirmUrl, addUrl, unsubscribeUrl }) {
  site = String(site || "").replace(/\/$/, "");
  const subject = guess ? `Is ${guess.title} your channel?` : "Which YouTube channel is yours?";
  const btn = (href, label, solid) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 18px;border-radius:8px;font-weight:600;text-decoration:none;${solid ? "background:#1F7F73;color:#fff" : "border:1px solid #1F7F73;color:#1F7F73"}">${esc(label)}</a>`;
  const body = guess
    ? `<p>You are watching <b>${esc(guess.title)}</b>${guess.handle ? " (" + esc(guess.handle) + ")" : ""} on Passive Array. If it is your own channel, confirm it and we will email you a free snapshot of where it stands, then a short growth report each week.</p>
<p style="margin:18px 0">${btn(confirmUrl, "Yes, that's my channel", true)}${btn(addUrl, "No, add a different one", false)}</p>`
    : `<p>Tell us which YouTube channel is yours and we will email you a free snapshot of where it stands, with three specific things to try next, then a short growth report each week.</p>
<p style="margin:18px 0">${btn(addUrl, "Add my channel", true)}</p>`;
  const html = `<div style="font-family:Poppins,Segoe UI,Arial,sans-serif;color:#1F2A44;max-width:640px;margin:0 auto;line-height:1.5">
<h2 style="margin:0 0 10px">${esc(subject)}</h2>
${body}
<p style="font-size:13px;color:#5A6478">It takes one click, uses public channel data only, and nothing needs to be connected or authorised.</p>
<p style="margin:22px 0 0;font-size:12px;color:#5A6478">You get this because you have a Passive Array account.${unsubscribeUrl ? ` <a href="${esc(unsubscribeUrl)}" style="color:#5A6478">Unsubscribe</a>.` : ""}</p>
</div>`;
  const text = guess
    ? `Is ${guess.title} your channel?\n\nYes, that's my channel: ${confirmUrl}\nNo, add a different one: ${addUrl}\n\nUnsubscribe: ${unsubscribeUrl || ""}`
    : `Which YouTube channel is yours?\n\nAdd my channel: ${addUrl}\n\nUnsubscribe: ${unsubscribeUrl || ""}`;
  return { subject, html, text };
}

module.exports = { buildReport, buildNudge, nextMilestone };
