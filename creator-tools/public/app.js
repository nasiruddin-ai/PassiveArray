/* Passive Array dashboard (/app/). Fills each sidebar panel from the site's own APIs:
   /api/auth (who), /api/watch (watchlist), /research/api/* (outliers, recent keywords),
   /creator-tools/api/youtube (monetization check for your channel), /api/billing (Pro). */
(function () {
  "use strict";
  var app = document.querySelector("[data-app]");
  if (!app) return;
  var ROOT = document.body.getAttribute("data-root") || "../";
  var TOOLS = window.PA_TOOLS || [];
  var POSTS = window.PA_POSTS || [];
  var me = null, watch = null, outliers = null, shorts = null, recentKw = null, monet = null, mine = null;

  /* ------------------------------------------------------------ utils */
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function compact(n) {
    if (n == null || !isFinite(n)) return "–";
    var a = Math.abs(n);
    if (a >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
    if (a >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
    if (a >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return Number(n).toLocaleString("en-US");
  }
  function signed(n) { return n == null ? "–" : (n > 0 ? "+" : "") + compact(n); }
  function ago(days) { return days < 1 ? "today" : days < 30 ? days + "d ago" : Math.round(days / 30) + "mo ago"; }
  function get(url) { return fetch(url, { credentials: "same-origin", cache: "no-store" }).then(function (r) { return r.json(); }).catch(function () { return { ok: false, error: "Could not reach the server." }; }); }
  function post(url, body) { return fetch(url, { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) }).then(function (r) { return r.json(); }).catch(function () { return { ok: false, error: "Could not reach the server." }; }); }
  function toolUrl(slug) { return ROOT + "creator-tools/" + slug + "/"; }
  function byIntent(intent) { return TOOLS.filter(function (t) { return t.intent === intent; }); }
  function bySlugs(res) { return TOOLS.filter(function (t) { return res.test(t.slug); }); }
  function toolCards(list, limit) {
    if (!list.length) return "<p class=\"empty\">Nothing here yet.</p>";
    return "<div class=\"tlist\">" + list.slice(0, limit || 99).map(function (t) {
      return "<a href=\"" + toolUrl(t.slug) + "\" data-recent=\"" + esc(t.slug) + "\"><span class=\"pl\">" + esc(t.platform.toUpperCase()) + (t.api === "youtube" || t.api === "twitch" ? " · LIVE" : "") + "</span><b>" + esc(t.name) + "</b><span>" + esc(t.short) + "</span></a>";
    }).join("") + "</div>";
  }
  function card(title, sub, body, opts) {
    opts = opts || {};
    return "<div class=\"acard" + (opts.cls ? " " + opts.cls : "") + "\"" + (opts.span ? " style=\"grid-column:span " + opts.span + "\"" : "") + ">" +
      "<div class=\"acard-head\"><div><h2>" + title + "</h2>" + (sub ? "<div class=\"sub\">" + sub + "</div>" : "") + "</div>" + (opts.link ? "<a href=\"" + opts.link[0] + "\">" + esc(opts.link[1]) + "</a>" : "") + "</div>" + body + "</div>";
  }
  function omini(i) {
    var mult = i.multiplier >= 100 ? ">100x" : i.multiplier + "x";
    return "<a class=\"omini\" href=\"" + esc(i.url) + "\" target=\"_blank\" rel=\"noopener\"><div class=\"th\"><img loading=\"lazy\" src=\"" + esc(i.thumbnail) + "\" alt=\"\"><span class=\"x" + (i.multiplier >= 10 ? " hot" : "") + "\">" + mult + "</span></div><div class=\"b\"><div class=\"t\">" + esc(i.title) + "</div><div class=\"m\">" + esc(i.channelTitle) + " · " + compact(i.views) + " views · " + ago(i.ageDays) + "</div></div></a>";
  }

  /* --------------------------------------------------------- recents */
  var RECENT_KEY = "pa-recent-tools";
  function recents() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch (e) { return []; } }
  function noteRecent(slug) {
    var list = recents().filter(function (s) { return s !== slug; });
    list.unshift(slug);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6))); } catch (e) { /* private mode */ }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-recent]");
    if (a) noteRecent(a.getAttribute("data-recent"));
  });
  function paintRecents() {
    var box = document.querySelector("[data-rail-recent]");
    var list = recents().map(function (s) { return TOOLS.find(function (t) { return t.slug === s; }); }).filter(Boolean);
    box.innerHTML = list.length ? list.map(function (t) { return "<a href=\"" + toolUrl(t.slug) + "\">" + esc(t.name) + "</a>"; }).join("") : "<div class=\"rail-empty\">Tools you open show up here.</div>";
  }

  /* ---------------------------------------------------------- panels */
  var P = {};
  function body(id) { return document.querySelector("[data-panel-body=\"" + id + "\"]"); }

  function onboardingCard() {
    return "<div class=\"acard onboard\" style=\"grid-column:span 12\"><div class=\"onboard-in\"><div><span class=\"k\">STEP 1 OF 1</span><h2>Add your YouTube channel</h2><p class=\"sub\">One time. The dashboard then shows your channel insights, your progress to monetization and how each upload does against your own average. Public data only, nothing to connect or authorise.</p>" +
      "<form class=\"aform\" data-set-channel style=\"margin-top:14px\"><input type=\"text\" name=\"channel\" placeholder=\"@yourhandle, channel link or name\" autocomplete=\"off\" required><button class=\"btn\" type=\"submit\">Add my channel</button></form><span class=\"fmsg\" data-set-channel-msg></span>" +
      "<p class=\"sub\" style=\"margin-top:10px\">Not a creator yet? Try it with <button type=\"button\" class=\"lp-try\" data-fill-channel=\"@mkbhd\">@mkbhd</button> and change it later.</p></div>" +
      "<div class=\"onboard-art\" aria-hidden=\"true\"><div class=\"kpis\"><div class=\"kpi\"><b>Subs</b><span>7-day change</span></div><div class=\"kpi\"><b>Views</b><span>last 30 days</span></div><div class=\"kpi\"><b>x avg</b><span>per upload</span></div><div class=\"kpi\"><b>Verdict</b><span>monetization</span></div></div></div></div></div>";
  }
  function channelCard(full) {
    if (!me || !me.ok) return card("Your channel", "Sign in to track progress to monetization.", "<a class=\"btn\" href=\"" + ROOT + "login/?next=%2Fapp%2F\">Sign in free</a>", { span: full ? 12 : 6 });
    if (!me.channel) return onboardingCard();
    if (!monet) return card("Your channel", esc(me.channel), "<p class=\"empty\">Checking the public signals…</p>", { span: full ? 12 : 6 });
    if (!monet.ok) return card("Your channel", esc(me.channel), "<p class=\"empty\">" + esc(monet.error || "Could not read that channel.") + "</p><form class=\"aform\" data-set-channel><input type=\"text\" name=\"channel\" placeholder=\"@yourhandle or channel link\" required><button class=\"btn ghost\" type=\"submit\">Change channel</button></form>", { span: full ? 12 : 6 });
    var ch = monet.channel, subs = ch.subscribers || 0, v = monet.verdict || {};
    var target = subs >= 1000 ? 1000 : 1000, pctSubs = Math.min(100, Math.round((subs / target) * 100));
    var uploads90 = (monet.signals || []).filter(function (s) { return /90 days/i.test(s.label || s.name || ""); })[0];
    var kpis = "<div class=\"kpis\">" +
      "<div class=\"kpi" + (subs >= 1000 ? " good" : "") + "\"><b>" + compact(subs) + "</b><span>Subscribers · goal 1,000</span></div>" +
      "<div class=\"kpi\"><b>" + compact(ch.views) + "</b><span>Total views</span></div>" +
      "<div class=\"kpi\"><b>" + compact(ch.videos) + "</b><span>Videos</span></div>" +
      "<div class=\"kpi\"><b>" + (ch.recent && ch.recent.avgViews != null ? compact(ch.recent.avgViews) : "–") + "</b><span>Avg views, last 10</span></div></div>";
    var prog = "<div class=\"prog\"><i style=\"width:" + pctSubs + "%\"></i></div><div class=\"prog-row\"><span>" + (subs >= 1000 ? "Subscriber threshold reached" : compact(1000 - subs) + " subscribers to go") + "</span><b>" + pctSubs + "%</b></div>";
    var SIG = { pass: "good", mixed: "warn", fail: "bad" };
    var sigs = "<ul class=\"sigs\">" + (monet.signals || []).map(function (s) { return "<li class=\"" + (SIG[s.status] || s.cls || "") + "\"><i></i><div><b>" + esc(s.label || s.name) + "</b> <span>" + esc(s.detail || s.value || "") + "</span></div></li>"; }).join("") + "</ul>";
    var head = "<div style=\"display:flex;align-items:center;gap:12px;margin-bottom:12px\">" + (ch.thumbnail ? "<img src=\"" + esc(ch.thumbnail) + "\" alt=\"\" style=\"width:44px;height:44px;border-radius:50%\">" : "") + "<div><b>" + esc(ch.title) + "</b><div class=\"sub\">" + esc(ch.handle || "") + "</div></div><span class=\"verdict " + esc(v.cls || "") + "\" style=\"margin-left:auto\">" + esc(v.label || "") + (v.confidence != null ? " · " + v.confidence + "%" : "") + "</span></div>";
    var foot = "<p class=\"sub\" style=\"margin-top:12px\">Watch hours are not public, so this tracks the public half of the rules: subscribers, uploads in 90 days, made-for-kids and ad placements. <a href=\"" + toolUrl("youtube-monetization-checker") + "?channel=" + encodeURIComponent(me.channel) + "\">Full check</a> · <a href=\"#\" data-change-channel>Change channel</a></p>";
    return card("Race to monetization", "Public signals, refreshed when you open the dashboard.", head + kpis + prog + (full ? sigs : "") + foot, { span: full ? 12 : 6 });
  }

  function moversCard() {
    if (!me || !me.ok) return card("Watchlist", "Channels you follow, with 7-day change.", "<p class=\"empty\">Sign in to start a watchlist. Free accounts watch 3 channels; Pro watches 100.</p>", { span: 6, link: [ROOT + "login/?next=%2Fapp%2F", "Sign in"] });
    if (!watch) return card("Watchlist", "", "<p class=\"empty\">Loading…</p>", { span: 6 });
    if (!watch.ok) return card("Watchlist", "", "<p class=\"empty\">" + esc(watch.error || "Could not load.") + "</p>", { span: 6 });
    if (!watch.channels.length) return card("Watchlist", "Nothing watched yet.", "<form class=\"aform\" data-watch-add><input type=\"text\" name=\"channel\" placeholder=\"@handle or channel link\" required><button class=\"btn\" type=\"submit\">Watch</button></form><span class=\"fmsg\" data-watch-msg></span>", { span: 6 });
    var rows = watch.channels.slice().sort(function (a, b) { return ((b.d7 && b.d7.subs) || 0) - ((a.d7 && a.d7.subs) || 0); }).slice(0, 6);
    return card("Watchlist movers", watch.channels.length + " of " + watch.limit + " channels · 7-day change", "<div class=\"movers\">" + rows.map(function (c) {
      var d = c.d7 ? c.d7.subs : null;
      return "<div class=\"mover\">" + (c.thumbnail ? "<img src=\"" + esc(c.thumbnail) + "\" alt=\"\">" : "") + "<div class=\"t\"><b>" + esc(c.title) + "</b><span>" + compact(c.subscribers) + " subscribers</span></div><div class=\"d " + (d > 0 ? "up" : d < 0 ? "down" : "flat") + "\">" + (d == null ? "no 7-day data yet" : signed(d) + " subs") + "</div></div>";
    }).join("") + "</div>", { span: 6, link: ["#watchlist", "Manage"] });
  }

  function outliersCard(items, title, link, limit) {
    if (!items) return card(title, "", "<p class=\"empty\">Loading…</p>");
    if (!items.length) return card(title, "", "<p class=\"empty\">The daily scan has not filled this yet. Research a few keywords to seed the index.</p>", { link: link });
    return card(title, "Views against the channel's own median. Refreshed daily.", "<div class=\"ogrid-mini\">" + items.slice(0, limit || 6).map(omini).join("") + "</div>", { link: link });
  }

  P.feed = function () {
    var quick = [["youtube-monetization-checker", "Monetization check"], ["youtube-keyword-generator", "Keyword ideas"], ["youtube-title-analyzer", "Score a title"], ["youtube-tag-generator", "Tags for a video"], ["youtube-channel-quality-checker", "Channel quality"], ["youtube-money-calculator", "Earnings estimate"]];
    var quickHtml = "<div class=\"chips-row\">" + quick.map(function (q) { return "<a href=\"" + toolUrl(q[0]) + "\" data-recent=\"" + q[0] + "\">" + esc(q[1]) + "</a>"; }).join("") + "</div>";
    var needsChannel = me && me.ok && !me.channel;
    return (needsChannel ? onboardingCard() : channelCard(false)) + (needsChannel ? "" : moversCard()) +
      card("Quick actions", "The tools most people open first.", quickHtml) +
      outliersCard(outliers && outliers.items, "Breaking out this week", [ROOT + "research/outliers/", "Full feed"], 6);
  };
  function delta(d, key, base) {
    if (!d || d[key] == null) return "<span class=\"flat\" title=\"Snapshots started today; change appears after a few days\">–</span>";
    var v = d[key], pct = base && base - v ? " <small>(" + (v >= 0 ? "+" : "") + ((v / (base - v)) * 100).toFixed(1) + "%)</small>" : "";
    return "<span class=\"" + (v > 0 ? "up" : v < 0 ? "down" : "flat") + "\">" + signed(v) + pct + "</span>";
  }
  P.channel = function () {
    if (!me || !me.ok) return card("My channel", "Sign in, add your channel, and this page fills with insights.", "<a class=\"btn\" href=\"" + ROOT + "login/?next=%2Fapp%2F%23channel\">Sign in free</a>");
    if (!me.channel) return onboardingCard();
    if (!mine) return card("My channel", esc(me.channel), "<p class=\"empty\">Loading your channel…</p>");
    if (!mine.ok) return card("My channel", esc(me.channel), "<p class=\"empty\">" + esc(mine.error || "Could not read that channel.") + "</p><form class=\"aform\" data-set-channel><input type=\"text\" name=\"channel\" placeholder=\"@yourhandle or channel link\" required><button class=\"btn ghost\" type=\"submit\">Change channel</button></form><span class=\"fmsg\" data-set-channel-msg></span>");
    var c = mine.channel, sm = mine.summary, v = monet && monet.ok ? monet.verdict : null;
    var head = "<div class=\"chan-head\">" + (c.thumbnail ? "<img src=\"" + esc(c.thumbnail) + "\" alt=\"\">" : "") + "<div class=\"t\"><h2>" + esc(c.title) + "</h2><div class=\"sub\">" + esc(c.handle || "") + (c.country ? " · " + esc(c.country) : "") + (c.publishedAt ? " · since " + new Date(c.publishedAt).getFullYear() : "") + " · tracked since " + esc(mine.since) + "</div></div>" +
      (v ? "<a class=\"verdict " + esc(v.cls || "") + "\" href=\"#race\">" + esc(v.label) + (v.confidence != null ? " · " + v.confidence + "%" : "") + "</a>" : "") +
      "<div class=\"chan-acts\"><a class=\"btn ghost\" href=\"" + esc(c.url) + "\" target=\"_blank\" rel=\"noopener\">Open on YouTube</a><a class=\"btn ghost\" href=\"" + toolUrl("youtube-channel-quality-checker") + "?channel=" + encodeURIComponent(me.channel) + "\" data-recent=\"youtube-channel-quality-checker\">Quality score</a><button type=\"button\" class=\"btn ghost\" data-change-channel>Change</button></div></div>";
    var kpis = "<div class=\"kpis\">" +
      "<div class=\"kpi\"><b>" + (c.hiddenSubscribers ? "hidden" : compact(c.subscribers)) + "</b><span>Subscribers · 7d " + delta(mine.d7, "subs", c.subscribers) + "</span></div>" +
      "<div class=\"kpi\"><b>" + compact(c.views) + "</b><span>Total views · 7d " + delta(mine.d7, "views") + "</span></div>" +
      "<div class=\"kpi\"><b>" + compact(c.videos) + "</b><span>Videos · 30d " + delta(mine.d30, "videos") + "</span></div>" +
      "<div class=\"kpi\"><b>" + compact(sm.avgViews) + "</b><span>Avg views, last 10 uploads</span></div>" +
      "<div class=\"kpi" + (sm.engagement >= 4 ? " good" : sm.engagement < 1 ? " bad" : "") + "\"><b>" + sm.engagement + "%</b><span>Engagement, likes+comments / views</span></div>" +
      "<div class=\"kpi\"><b>" + (sm.viewsPerSub == null ? "–" : sm.viewsPerSub + "%") + "</b><span>Avg views per subscriber</span></div>" +
      "<div class=\"kpi\"><b>" + sm.uploadsPerMonth + "</b><span>Uploads a month" + (sm.avgGapDays ? " · every " + sm.avgGapDays + " days" : "") + "</span></div>" +
      "<div class=\"kpi\"><b>" + sm.last30Count + "</b><span>Uploads in 30 days · " + compact(sm.last30Views) + " views</span></div>" +
      "<div class=\"kpi\"><b>" + sm.shortsShare + "%</b><span>Shorts share of recent uploads</span></div>" +
      "<div class=\"kpi\"><b>" + (sm.viewsPerVideo == null ? "–" : compact(sm.viewsPerVideo)) + "</b><span>Lifetime views per video</span></div></div>";
    var rows = mine.uploads.map(function (u) {
      var x = u.xAvg, cls = x >= 1.5 ? "up" : x < 0.5 ? "down" : "flat";
      return "<tr><td><a href=\"" + esc(u.url) + "\" target=\"_blank\" rel=\"noopener\" class=\"vt\">" + esc(u.title) + "</a><small>" + ago(u.days) + (u.short ? " · Short" : "") + "</small></td><td class=\"num\">" + compact(u.views) + "</td><td class=\"num\">" + compact(u.viewsPerDay) + "</td><td class=\"num\">" + u.er + "%</td><td class=\"num\"><span class=\"" + cls + "\">" + x + "x</span></td></tr>";
    }).join("");
    var table = mine.uploads.length ? "<div class=\"tablewrap\"><table class=\"wltable uploads\"><thead><tr><th>Upload</th><th class=\"num\">Views</th><th class=\"num\">Views/day</th><th class=\"num\">Engagement</th><th class=\"num\">vs your avg</th></tr></thead><tbody>" + rows + "</tbody></table></div>" : "<p class=\"empty\">No public uploads found.</p>";
    var best = mine.best ? card("Best recent upload", "Highest views of the last 10.", "<a class=\"vt\" href=\"" + esc(mine.best.url) + "\" target=\"_blank\" rel=\"noopener\" style=\"font-weight:600\">" + esc(mine.best.title) + "</a><div class=\"kpis\" style=\"margin-top:12px\"><div class=\"kpi\"><b>" + compact(mine.best.views) + "</b><span>Views · " + mine.best.xAvg + "x your average</span></div><div class=\"kpi\"><b>" + mine.best.er + "%</b><span>Engagement</span></div></div><div class=\"chips-row\" style=\"margin-top:12px\"><a href=\"" + toolUrl("youtube-title-generator") + "?topic=" + encodeURIComponent(mine.best.title.slice(0, 80)) + "\" data-recent=\"youtube-title-generator\">More titles like this</a><a href=\"" + toolUrl("youtube-tag-generator") + "?topic=" + encodeURIComponent(mine.best.title.slice(0, 80)) + "\" data-recent=\"youtube-tag-generator\">Tags for a follow-up</a></div>", { span: 6 }) : "";
    var kw = c.keywords && c.keywords.length ? card("Channel keywords", "Set in your Studio, read from the public channel record.", "<div class=\"chips-row\">" + c.keywords.slice(0, 20).map(function (k) { return "<a href=\"" + ROOT + "research/?q=" + encodeURIComponent(k) + "\">" + esc(k) + "</a>"; }).join("") + "</div>", { span: 6 }) : card("Channel keywords", "", "<p class=\"empty\">No channel keywords set. Add some in YouTube Studio, Settings, Channel, Basic info. They help YouTube understand the channel.</p>", { span: 6 });
    return "<div class=\"acard\" style=\"grid-column:span 12\">" + head + kpis + "<p class=\"sub\" style=\"margin-top:12px\">Live from the YouTube Data API. Subscriber counts are rounded by YouTube to three figures. Daily snapshots run at 05:45 UTC, so 7-day and 30-day change appears after the first week.</p></div>" +
      card("Last 10 uploads against your own average", "Which uploads beat your usual numbers. Anything above 1.5x is worth repeating.", table) + best + kw;
  };
  P.optimize = function () {
    return card("Before you publish", "Title, tags and description, scored and generated. The extension suggests tags inside YouTube Studio too.", toolCards(bySlugs(/title|tag|description|hashtag|thumbnail|keyword|niche/).filter(function (t) { return t.platform === "YouTube"; }))) +
      card("Tag suggestions in Studio", "Install the free extension and a Suggested tags panel appears under the Tags box when you upload.", "<a class=\"btn\" href=\"" + ROOT + "youtube-extension/\">Get the extension</a>");
  };
  P.race = function () {
    return channelCard(true) +
      card("The public half of the rules", "What YouTube requires and what can be measured from outside.", "<ul class=\"sigs\"><li class=\"good\"><i></i><div><b>1,000 subscribers</b> <span>public, tracked above</span></div></li><li class=\"good\"><i></i><div><b>3 public uploads in the last 90 days</b> <span>public, tracked above</span></div></li><li class=\"warn\"><i></i><div><b>4,000 watch hours or 10M Shorts views</b> <span>private to you; check YouTube Studio, Analytics, Audience</span></div></li><li class=\"good\"><i></i><div><b>No active Community Guidelines strikes</b> <span>private; visible in Studio</span></div></li></ul>", { span: 6 }) +
      card("Grow faster", "Tools that help with the parts you control.", toolCards(bySlugs(/keyword|title-analyzer|tag-generator|outlier|channel-quality|engagement-rate-calculator/).filter(function (t) { return t.platform === "YouTube"; }), 6), { span: 6 });
  };
  P.research = function () {
    var kw = recentKw && recentKw.keywords && recentKw.keywords.length ? "<div class=\"chips-row\">" + recentKw.keywords.slice(0, 16).map(function (k) { var q = typeof k === "string" ? k : k.q || k.keyword || k.text; return "<a href=\"" + ROOT + "research/?q=" + encodeURIComponent(q) + "\">" + esc(q) + "</a>"; }).join("") + "</div>" : "<p class=\"empty\">Keywords researched on the site appear here.</p>";
    return card("Keyword research", "Measured from the top results: views per day, channel sizes, freshness. Never a modelled search volume.", "<form class=\"aform\" action=\"" + ROOT + "research/\" method=\"get\"><input type=\"text\" name=\"q\" placeholder=\"Type a topic, e.g. budget camera\" required><button class=\"btn\" type=\"submit\">Research</button></form><div style=\"margin-top:14px\">" + kw + "</div>", { span: 12 }) +
      outliersCard(outliers && outliers.items, "Outlier videos", [ROOT + "research/outliers/", "All outliers"], 8) +
      outliersCard(shorts && shorts.items, "Shorts that broke out", [ROOT + "research/shorts/", "All Shorts"], 8);
  };
  P.watchlist = function () {
    if (!me || !me.ok) return card("Watchlist", "Follow channels and see 7-day and 30-day change.", "<a class=\"btn\" href=\"" + ROOT + "login/?next=%2Fapp%2F\">Sign in free</a>");
    if (!watch) return card("Watchlist", "", "<p class=\"empty\">Loading…</p>");
    if (!watch.ok) return card("Watchlist", "", "<p class=\"empty\">" + esc(watch.error) + "</p>");
    var rows = watch.channels.map(function (c) {
      var d = function (x, k) { return !x || x[k] == null ? "<span class=\"flat\">–</span>" : "<span class=\"" + (x[k] > 0 ? "up" : x[k] < 0 ? "down" : "flat") + "\">" + signed(x[k]) + "</span>"; };
      return "<tr><td><div class=\"ch\">" + (c.thumbnail ? "<img src=\"" + esc(c.thumbnail) + "\" alt=\"\">" : "") + "<div><a href=\"" + esc(c.url) + "\" target=\"_blank\" rel=\"noopener\">" + esc(c.title) + "</a><small>" + esc(c.handle || "") + "</small></div></div></td><td class=\"num\">" + compact(c.subscribers) + "</td><td class=\"num\">" + d(c.d7, "subs") + "</td><td class=\"num\">" + d(c.d30, "subs") + "</td><td class=\"num\">" + d(c.d7, "views") + "</td><td class=\"num\"><a href=\"" + toolUrl("youtube-channel-quality-checker") + "?channel=" + encodeURIComponent(c.handle || c.id) + "\">Check</a></td><td class=\"num\"><button type=\"button\" class=\"x\" data-unwatch=\"" + esc(c.id) + "\" title=\"Stop watching\">×</button></td></tr>";
    }).join("");
    var table = watch.channels.length ? "<div class=\"tablewrap\"><table class=\"wltable\"><thead><tr><th>Channel</th><th class=\"num\">Subscribers</th><th class=\"num\">7 days</th><th class=\"num\">30 days</th><th class=\"num\">Views, 7d</th><th></th><th></th></tr></thead><tbody>" + rows + "</tbody></table></div>" : "<p class=\"empty\">Nothing watched yet. Add a channel, or press Watch this channel on any YouTube tool result.</p>";
    return card("Watchlist", watch.channels.length + " of " + watch.limit + " on the " + watch.plan + " plan. Snapshots run daily at 05:45 UTC.", "<form class=\"aform\" data-watch-add style=\"margin-bottom:14px\"><input type=\"text\" name=\"channel\" placeholder=\"@handle, channel link or name\" required><button class=\"btn\" type=\"submit\">Watch</button></form><span class=\"fmsg\" data-watch-msg></span>" + table, { link: [ROOT + "account/", "Export and settings"] });
  };
  P.ideas = function () {
    var items = outliers && outliers.items ? outliers.items.slice(0, 12) : null;
    var list = !items ? "<p class=\"empty\">Loading…</p>" : !items.length ? "<p class=\"empty\">No outliers yet. The daily scan fills this.</p>" : items.map(function (i) {
      var topic = i.title.replace(/[|#"“”!?:]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
      return "<div class=\"idea\"><img loading=\"lazy\" src=\"" + esc(i.thumbnail) + "\" alt=\"\"><div class=\"t\"><b>" + esc(i.title) + "</b><span>" + esc(i.channelTitle) + " did <b>" + (i.multiplier >= 100 ? ">100" : i.multiplier) + "x</b> its usual views (" + compact(i.views) + " vs " + compact(i.median) + "), " + ago(i.ageDays) + ".</span><div class=\"acts\"><a href=\"" + toolUrl("youtube-title-generator") + "?topic=" + encodeURIComponent(topic) + "\" data-recent=\"youtube-title-generator\">Titles on this topic</a><a href=\"" + ROOT + "research/?q=" + encodeURIComponent(topic.split(" ").slice(0, 4).join(" ")) + "\">Research the keyword</a><a href=\"" + esc(i.url) + "\" target=\"_blank\" rel=\"noopener\">Watch</a></div></div></div>";
    }).join("");
    return card("Ideas from what broke out", "Not invented: every row is a real video that beat its channel's median by 3x or more in the last 90 days. Steal the angle, not the video.", list, { link: [ROOT + "research/outliers/", "Outlier feed"] });
  };
  P.competitors = function () {
    var watched = watch && watch.ok && watch.channels.length >= 2 ? "<div class=\"chips-row\" style=\"margin-bottom:14px\">" + watch.channels.slice(0, 6).map(function (c) { return "<a href=\"" + toolUrl("youtube-channel-comparison") + "?a=" + encodeURIComponent(me.channel || watch.channels[0].handle) + "&b=" + encodeURIComponent(c.handle || c.id) + "\">You vs " + esc(c.title) + "</a>"; }).join("") + "</div>" : "<p class=\"sub\" style=\"margin-bottom:14px\">Watch two or more channels and one-click comparisons appear here.</p>";
    return card("Compare channels", "Side by side, leader marked on every row.", watched + toolCards(byIntent("compare").concat(bySlugs(/influencer|lookalike|find-youtube/)), 8));
  };
  P.create = function () { return card("Generators", "Titles, descriptions, scripts, ideas and hashtags. They work only from what you type and never invent facts.", toolCards(byIntent("create"))); };
  P.learn = function () {
    var posts = POSTS.length ? "<div class=\"tlist\">" + POSTS.map(function (p) { return "<a href=\"" + ROOT + "blog/" + esc(p.slug) + "/\"><span class=\"pl\">" + esc((p.category || "").toUpperCase()) + "</span><b>" + esc(p.title) + "</b>" + (p.minutes ? "<span>" + p.minutes + " min read</span>" : "") + "</a>"; }).join("") + "</div>" : "<p class=\"empty\">Articles arrive here.</p>";
    return card("Learn", "Short, honest reads about growing on YouTube.", posts, { link: [ROOT + "blog/", "All articles"] });
  };
  P.upgrade = function () {
    var pro = me && me.ok && me.pro;
    var inner = pro ? "<p class=\"sub\">You are on Pro. Thank you, it pays the hosting and keeps the ads off.</p><button type=\"button\" class=\"btn mint\" data-portal style=\"margin-top:12px\">Manage billing</button><span class=\"fmsg\" data-plan-msg></span>" :
      "<ul><li>Watch up to 100 channels with daily snapshots</li><li>The Monday email: every channel on your list, sorted by who moved</li><li>CSV export of your watchlist and the outlier and Shorts feeds</li><li>Every tool stays free for everyone, including you</li></ul><div style=\"display:flex;gap:8px;flex-wrap:wrap\"><button type=\"button\" class=\"btn mint\" data-upgrade=\"monthly\">$9 a month</button><button type=\"button\" class=\"btn ghost\" data-upgrade=\"yearly\" style=\"color:#fff;border-color:rgba(255,255,255,.3);background:transparent\">$79 a year</button></div><span class=\"fmsg\" data-plan-msg></span>" + (!me || !me.ok ? "<p class=\"sub\" style=\"margin-top:10px\"><a href=\"" + ROOT + "login/?next=%2Fapp%2F\" style=\"color:#fff\">Sign in first</a>, then upgrade from here.</p>" : "");
    return card(pro ? "Passive Array Pro" : "Upgrade to Pro", pro ? "" : "$9 a month or $79 a year. Cancel in two clicks.", inner, { cls: "pro-card", span: 6 }) +
      card("What stays free", "Everything that is free today stays free. Pro only covers what costs money to run.", "<ul class=\"sigs\"><li class=\"good\"><i></i><div><b>All " + TOOLS.length + " tools</b> <span>no credit limit</span></div></li><li class=\"good\"><i></i><div><b>Research feeds</b> <span>keywords, outliers, Shorts</span></div></li><li class=\"good\"><i></i><div><b>The Chrome extension</b> <span>including Studio tag suggestions</span></div></li><li class=\"good\"><i></i><div><b>3 watched channels</b> <span>on a free account</span></div></li></ul><a href=\"" + ROOT + "pricing/\" style=\"display:inline-block;margin-top:12px;font-weight:600\">Pricing page</a>", { span: 6 });
  };

  /* ---------------------------------------------------------- router */
  var TITLES = { feed: "Feed", channel: "My channel", optimize: "Optimize", race: "Race to monetization", research: "Research", watchlist: "Watchlist", ideas: "Daily ideas", competitors: "Competitors", create: "Create", learn: "Learn", upgrade: "Upgrade" };
  var current = "feed";
  function show(id) {
    if (!P[id]) id = "feed";
    current = id;
    document.querySelectorAll("[data-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== id; });
    document.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-nav") === id); });
    document.querySelector("[data-title]").textContent = TITLES[id] || id;
    render(id);
    app.classList.remove("rail-open");
    window.scrollTo({ top: 0 });
  }
  function render(id) {
    var el = body(id || current);
    if (!el) return;
    el.innerHTML = P[id || current]();
    wire(el);
  }
  function rerender() { render(current); paintRail(); }
  window.addEventListener("hashchange", function () { show(location.hash.replace("#", "") || "feed"); });

  /* ---------------------------------------------------------- wiring */
  function wire(el) {
    var setCh = el.querySelector("[data-set-channel]");
    if (setCh) setCh.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = setCh.elements.channel.value.trim();
      if (!v) return;
      var msg = el.querySelector("[data-set-channel-msg]");
      if (msg) msg.textContent = "Saving…";
      post("/api/channel?action=set", { channel: v }).then(function (r) {
        if (!r.ok) { if (msg) { msg.textContent = r.error || "Could not save."; msg.className = "fmsg bad"; } return; }
        me.channel = v; mine = r; monet = null; rerender(); loadMonet();
        if (current === "feed") location.hash = "channel";
      });
    });
    el.querySelectorAll("[data-fill-channel]").forEach(function (b) {
      b.addEventListener("click", function () { var i = el.querySelector("[data-set-channel] input"); if (i) { i.value = b.getAttribute("data-fill-channel"); i.focus(); } });
    });
    var chg = el.querySelector("[data-change-channel]");
    if (chg) chg.addEventListener("click", function (e) { e.preventDefault(); post("/api/channel?action=clear").then(function () { me.channel = ""; mine = null; monet = null; rerender(); }); });
    var add = el.querySelector("[data-watch-add]");
    if (add) add.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = add.elements.channel.value.trim();
      var msg = el.querySelector("[data-watch-msg]");
      if (!v) return;
      if (msg) { msg.textContent = "Looking up the channel…"; msg.className = "fmsg"; }
      post("/api/watch?action=add", { channel: v }).then(function (r) {
        if (r.ok) { watch = r; rerender(); }
        else if (msg) { msg.innerHTML = esc(r.error || "Could not add that.") + (r.code === "limit" ? " <a href=\"#upgrade\">See Pro</a>" : ""); msg.className = "fmsg bad"; }
      });
    });
    el.querySelectorAll("[data-unwatch]").forEach(function (b) {
      b.addEventListener("click", function () { b.disabled = true; post("/api/watch?action=remove", { id: b.getAttribute("data-unwatch") }).then(function (r) { if (r.ok) { watch = r; rerender(); } else b.disabled = false; }); });
    });
    el.querySelectorAll("[data-upgrade]").forEach(function (b) {
      b.addEventListener("click", function () {
        var msg = el.querySelector("[data-plan-msg]");
        if (!me || !me.ok) { location.href = ROOT + "login/?next=%2Fapp%2F%23upgrade"; return; }
        b.disabled = true; if (msg) msg.textContent = "Opening checkout…";
        post("/api/billing?action=checkout", { plan: b.getAttribute("data-upgrade") }).then(function (r) {
          if (r.ok && r.url) { location.href = r.url; return; }
          b.disabled = false; if (msg) msg.textContent = r.error || "Could not open checkout.";
        });
      });
    });
    var portal = el.querySelector("[data-portal]");
    if (portal) portal.addEventListener("click", function () {
      portal.disabled = true;
      post("/api/billing?action=portal").then(function (r) { if (r.ok && r.url) location.href = r.url; else { portal.disabled = false; el.querySelector("[data-plan-msg]").textContent = r.error || "Could not open billing."; } });
    });
  }

  /* ------------------------------------------------------------- rail */
  function paintRail() {
    var email = document.querySelector("[data-who-email]"), sub = document.querySelector("[data-who-sub]"), plan = document.querySelector("[data-who-plan]");
    var up = document.querySelector("[data-upgrade-link]");
    if (me && me.ok) {
      email.textContent = me.email;
      sub.innerHTML = "<a href=\"" + ROOT + "account/\">Account</a> · <a href=\"#\" data-logout>Sign out</a>";
      plan.hidden = false; plan.textContent = me.pro ? "Pro" : "Free"; plan.className = "plan" + (me.pro ? " pro" : "");
      up.querySelector("span").textContent = me.pro ? "Pro member" : "Upgrade to Pro"; up.classList.toggle("pro", !!me.pro);
      var lo = sub.querySelector("[data-logout]");
      if (lo) lo.addEventListener("click", function (e) { e.preventDefault(); post("/api/auth?action=logout").then(function () { try { localStorage.removeItem("pa-user"); } catch (x) {} location.href = ROOT; }); });
    }
    document.querySelector("[data-signed-out]").hidden = !!(me && me.ok);
    var rw = document.querySelector("[data-rail-watch]");
    if (watch && watch.ok && watch.channels.length) rw.innerHTML = watch.channels.slice(0, 8).map(function (c) { return "<a href=\"" + toolUrl("youtube-channel-quality-checker") + "?channel=" + encodeURIComponent(c.handle || c.id) + "\">" + (c.thumbnail ? "<img src=\"" + esc(c.thumbnail) + "\" alt=\"\">" : "") + "<span>" + esc(c.title) + "</span></a>"; }).join("") + "<a href=\"#watchlist\">" + (watch.channels.length > 8 ? "All " + watch.channels.length : "Manage") + "</a>";
    else if (me && me.ok) rw.innerHTML = "<div class=\"rail-empty\">No channels yet. <a href=\"#watchlist\">Add one</a>.</div>";
    var cnt = document.querySelector("[data-nav-count=\"watchlist\"]");
    if (cnt) { cnt.hidden = !(watch && watch.ok && watch.channels.length); cnt.textContent = watch && watch.ok ? watch.channels.length : ""; }
    paintRecents();
  }
  document.querySelector("[data-rail-toggle]").addEventListener("click", function () { app.classList.toggle("rail-open"); });
  document.querySelector("[data-scrim]").addEventListener("click", function () { app.classList.remove("rail-open"); });
  var search = document.querySelector("[data-app-search]");
  if (search) search.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = search.querySelector("input").value.trim();
    if (v) location.href = toolUrl("youtube-channel-quality-checker") + "?channel=" + encodeURIComponent(v);
  });

  /* ------------------------------------------------------------- data */
  function loadMonet() {
    if (!me || !me.ok || !me.channel) return;
    get(ROOT + "creator-tools/api/youtube?action=monetization&channel=" + encodeURIComponent(me.channel)).then(function (r) { monet = r; if (current === "feed" || current === "race") render(current); });
  }
  show(location.hash.replace("#", "") || "feed");
  get("/api/auth?action=me").then(function (r) {
    me = r;
    paintRail();
    render(current);
    if (me && me.ok) {
      get("/api/watch?action=list").then(function (w) { watch = w; paintRail(); render(current); });
      loadMonet();
      if (me.channel) get("/api/channel").then(function (r) { mine = r; if (current === "channel" || current === "feed") render(current); });
      else if (!location.hash || location.hash === "#feed") { /* first visit after sign-in: the feed shows the add-channel step */ }
    }
  });
  get(ROOT + "research/api/outliers?type=videos&days=7&sort=multiplier&limit=12").then(function (r) { outliers = r && r.ok ? r : { ok: true, items: [] }; render(current); });
  get(ROOT + "research/api/outliers?type=shorts&days=30&sort=multiplier&limit=8").then(function (r) { shorts = r && r.ok ? r : { ok: true, items: [] }; if (current === "research") render(current); });
  get(ROOT + "research/api/recent").then(function (r) { recentKw = r; if (current === "research") render(current); });
})();
