/* Creator Tools front end. One file for every tool page.
   window.TOOL (set by the page) says which tool this is. COMPUTE[slug] does the maths
   and returns a result object that render() turns into HTML. */
(function () {
  "use strict";

  var T = window.TOOL;
  var form = document.getElementById("form");
  var results = document.getElementById("results");
  var statusEl = document.getElementById("status");
  var goBtn = document.getElementById("go");

  /* ----------------------------------------------------------- helpers */
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function num(v) {
    var x = parseFloat(String(v == null ? "" : v).replace(/[,\s]/g, ""));
    return isFinite(x) ? x : 0;
  }
  function fmt(n, d) {
    if (n == null || !isFinite(n)) return "n/a";
    return Number(n).toLocaleString("en-US", { maximumFractionDigits: d == null ? 0 : d });
  }
  function compact(n) {
    if (n == null || !isFinite(n)) return "n/a";
    var a = Math.abs(n);
    if (a >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
    if (a >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
    if (a >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return fmt(n);
  }
  function pct(n, d) {
    return isFinite(n) ? fmt(n, d == null ? 2 : d) + "%" : "n/a";
  }
  function money(n) {
    if (!isFinite(n)) return "n/a";
    if (n >= 1000) return "$" + fmt(Math.round(n));
    if (n >= 100) return "$" + fmt(n, 0);
    return "$" + fmt(n, 2);
  }
  function range(lo, hi) {
    return money(lo) + " to " + money(hi);
  }
  function clamp(x, lo, hi) {
    return Math.max(lo, Math.min(hi, x));
  }
  function years(iso) {
    if (!iso) return 0;
    return (Date.now() - new Date(iso).getTime()) / (365.25 * 86400000);
  }
  function dateStr(iso) {
    if (!iso) return "n/a";
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  function safeDiv(a, b) {
    return b > 0 ? a / b : 0;
  }
  function grade(ratio) {
    // ratio = value / typical value for the tier
    if (ratio < 0.5) return { label: "Low", cls: "bad" };
    if (ratio < 0.85) return { label: "Below average", cls: "warn" };
    if (ratio < 1.25) return { label: "Average", cls: "" };
    if (ratio < 1.6) return { label: "Good", cls: "good" };
    return { label: "Excellent", cls: "good" };
  }
  function letter(score) {
    return score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : score >= 40 ? "D" : "F";
  }
  function pill(g) {
    return '<span class="pill ' + g.cls + '">' + esc(g.label) + "</span>";
  }

  /* Benchmarks. Typical engagement rate by follower tier, percent. */
  var IG_TIERS = [
    { max: 1e4, name: "Nano (under 10K)", avg: 4.0 },
    { max: 1e5, name: "Micro (10K to 100K)", avg: 2.0 },
    { max: 5e5, name: "Mid (100K to 500K)", avg: 1.4 },
    { max: 1e6, name: "Macro (500K to 1M)", avg: 1.1 },
    { max: Infinity, name: "Mega (over 1M)", avg: 0.8 },
  ];
  var TT_TIERS = [
    { max: 1e4, name: "Nano (under 10K)", avg: 12 },
    { max: 1e5, name: "Micro (10K to 100K)", avg: 8 },
    { max: 5e5, name: "Mid (100K to 500K)", avg: 6 },
    { max: 1e6, name: "Macro (500K to 1M)", avg: 5 },
    { max: Infinity, name: "Mega (over 1M)", avg: 4 },
  ];
  function tier(list, followers) {
    for (var i = 0; i < list.length; i++) if (followers < list[i].max) return list[i];
    return list[list.length - 1];
  }
  function igER(f, likes, comments) {
    return safeDiv(likes + comments, f) * 100;
  }
  function ratioLabel(r) {
    if (r >= 10) return { label: "Established creator", cls: "good" };
    if (r >= 2) return { label: "Growing account", cls: "" };
    if (r >= 1) return { label: "Balanced", cls: "" };
    return { label: "Follow-back pattern", cls: "warn" };
  }

  /* ----------------------------------------------------------- renderers */
  function render(out) {
    if (!out) return;
    if (out.error) {
      results.innerHTML = "<div class=\"error\">" + esc(out.error) + "</div>" + (out.note ? "<p class=\"note\">" + out.note + "</p>" : "");
      return;
    }
    var h = "";
    if (out.profile || out.hero) {
      h += "<div class=\"herocard\">";
      if (out.profile) {
        var p = out.profile;
        h += "<div class=\"profile\">" + (p.img ? "<img src=\"" + esc(p.img) + "\" alt=\"\">" : "") +
          "<div><div class=\"t\">" + (p.url ? "<a href=\"" + esc(p.url) + "\" target=\"_blank\" rel=\"noopener\">" + esc(p.title) + "</a>" : esc(p.title)) + "</div><div class=\"m\">" + esc(p.meta || "") + "</div></div>" +
          (p.url ? "<a class=\"open\" href=\"" + esc(p.url) + "\" target=\"_blank\" rel=\"noopener\">Open on " + esc(T.platform) + "</a>" : "") + "</div>";
      }
      if (out.hero) {
        h += "<div><div class=\"k\">" + esc(String(out.hero.label).toUpperCase()) + "</div><div class=\"v\">" + out.hero.value + "</div>" + (out.hero.note ? "<div class=\"n\">" + out.hero.note + "</div>" : "") + "</div>";
      }
      h += "<div class=\"hactions\"><button type=\"button\" class=\"btn\" id=\"copylink\">Copy link to this result</button></div></div>";
    }
    if (out.bars) {
      h += "<div class=\"card bars\">" + out.bars.map(function (b) {
        return "<div class=\"barrow\"><div class=\"top\"><span class=\"name\">" + esc(b.label) + "</span><span class=\"val\">" + esc(b.text) + "</span></div><div class=\"bar\"><i style=\"width:" + clamp(b.value, 0, 100) + "%\"></i></div></div>";
      }).join("") + "</div>";
    }
    if (out.rows) {
      h += "<div class=\"tiles\">" + out.rows.map(function (r) {
        return "<div class=\"tile\"><span class=\"name\">" + esc(r.name) + (r.sub ? "<small>" + esc(r.sub) + "</small>" : "") + "</span><span class=\"val " + (r.cls || "") + "\">" + r.value + "</span></div>";
      }).join("") + "</div>";
    }
    if (out.table) {
      var t = out.table;
      h += "<div class=\"card\"><div class=\"tablewrap\"><table><thead><tr>" + t.head.map(function (c, i) { return "<th" + (i && t.numeric ? " class=\"num\"" : "") + ">" + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>";
      t.rows.forEach(function (r) {
        h += "<tr>" + r.map(function (c, i) {
          var cls = [];
          if (i && t.numeric) cls.push("num");
          if (c && typeof c === "object") { if (c.lead) cls.push("lead"); return "<td" + (cls.length ? " class=\"" + cls.join(" ") + "\"" : "") + ">" + c.html + "</td>"; }
          return "<td" + (cls.length ? " class=\"" + cls.join(" ") + "\"" : "") + ">" + c + "</td>";
        }).join("") + "</tr>";
      });
      h += "</tbody></table></div></div>";
    }
    if (out.tags) {
      h += "<div class=\"card\"><div class=\"tags\">" + out.tags.map(function (t) { return "<span class=\"tag " + esc(t.size || "") + "\">" + esc(t.tag) + "</span>"; }).join("") + "</div></div>";
    }
    if (out.ideas) {
      h += "<div class=\"ideas\">" + out.ideas.map(function (i) {
        return "<div class=\"idea\"><b>" + esc(i.title) + "</b>" + (i.hook ? "<span>Hook: “" + esc(i.hook) + "”</span>" : "") + (i.format ? "<span><span class=\"pill\">" + esc(i.format) + "</span></span>" : "") + (i.why ? "<span>" + esc(i.why) + "</span>" : "") + "</div>";
      }).join("") + "</div>";
    }
    if (out.list) {
      h += "<div class=\"card\"><ol class=\"list\">" + out.list.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ol></div>";
    }
    if (out.copy) {
      h += "<div class=\"card\"><div class=\"copybox\" id=\"copybox\">" + esc(out.copy) + "</div><div class=\"actions\"><button type=\"button\" class=\"btn ghost\" id=\"copybtn\">Copy</button></div></div>";
    }
    if (out.note) h += "<p class=\"note\">" + out.note + "</p>";
    results.innerHTML = h;
    var cb = document.getElementById("copybtn");
    if (cb) cb.addEventListener("click", function () {
      navigator.clipboard.writeText(out.copy).then(function () { cb.textContent = "Copied"; setTimeout(function () { cb.textContent = "Copy"; }, 1500); });
    });
    var cl = document.getElementById("copylink");
    if (cl) cl.addEventListener("click", function () {
      var u = new URL(location.origin + location.pathname);
      var v = values();
      Object.keys(v).forEach(function (k) { if (String(v[k]).trim() !== "") u.searchParams.set(k, v[k]); });
      navigator.clipboard.writeText(u.toString()).then(function () { cl.textContent = "Link copied"; setTimeout(function () { cl.textContent = "Copy link to this result"; }, 1800); });
    });
    if (results.getBoundingClientRect().top > window.innerHeight * 0.6) results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function compareTable(items, metrics) {
    var head = ["Metric"].concat(items.map(function (i) { return i.name; }));
    var rows = metrics.map(function (m) {
      var vals = items.map(function (i) { return m.get(i); });
      var best = -1;
      if (m.lead !== false) {
        var valid = vals.map(function (v, idx) { return { v: v, idx: idx }; }).filter(function (x) { return isFinite(x.v) && x.v != null; });
        if (valid.length > 1) {
          var pick = valid.reduce(function (a, b) { return (m.lower ? b.v < a.v : b.v > a.v) ? b : a; });
          var ties = valid.filter(function (x) { return x.v === pick.v; }).length;
          if (ties === 1) best = pick.idx;
        }
      }
      return [m.name].concat(vals.map(function (v, idx) { return { html: m.fmt ? m.fmt(v) : fmt(v), lead: idx === best }; }));
    });
    return { head: head, rows: rows, numeric: true };
  }

  /* ----------------------------------------------------------- YouTube */
  function ytProfile(ch) {
    return { img: ch.thumbnail, title: ch.title, url: ch.url, meta: [ch.handle, ch.country, ch.publishedAt ? "since " + new Date(ch.publishedAt).getFullYear() : ""].filter(Boolean).join(" · ") };
  }
  function ytER(ch) {
    var r = ch.recent;
    return { byView: safeDiv(r.avgLikes + r.avgComments, r.avgViews) * 100, bySub: safeDiv(r.avgLikes + r.avgComments, ch.subscribers) * 100 };
  }
  function ytGradeView(er) {
    if (er < 1) return { label: "Low", cls: "bad" };
    if (er < 2) return { label: "Below average", cls: "warn" };
    if (er < 4) return { label: "Average", cls: "" };
    if (er < 6) return { label: "Good", cls: "good" };
    return { label: "Excellent", cls: "good" };
  }
  function ytRecentTable(ch) {
    return {
      head: ["Recent video", "Published", "Views", "Likes", "Comments"],
      numeric: true,
      rows: ch.recent.videos.slice(0, 10).map(function (v) {
        return ['<a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.title) + "</a>", dateStr(v.publishedAt), fmt(v.views), fmt(v.likes), fmt(v.comments)];
      }),
    };
  }
  function ytMonthlyViews(ch) {
    var r = ch.recent;
    if (r.last30Count >= 2) return { views: r.last30Views, basis: r.last30Count + " videos uploaded in the last 30 days" };
    var est = r.avgViews * Math.max(r.uploadsPerMonth, 1);
    return { views: est, basis: "average views x " + fmt(Math.max(r.uploadsPerMonth, 1), 1) + " uploads a month" };
  }
  function channelTable(channels) {
    return {
      head: ["Channel", "Country", "Subscribers", "Total views", "Videos", "Views per video"],
      numeric: true,
      rows: channels.map(function (c) {
        return ['<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.title) + "</a>" + (c.handle ? '<br><small style="color:var(--muted)">' + esc(c.handle) + "</small>" : ""), c.country || "", fmt(c.subscribers), compact(c.views), fmt(c.videos), compact(safeDiv(c.views, c.videos))];
      }),
    };
  }

  var COMPUTE = {};

  COMPUTE["youtube-subscriber-count-checker"] = function (v, d) {
    var ch = d.channel, r = ch.recent;
    return {
      profile: ytProfile(ch),
      hero: { label: "Subscribers", value: ch.hiddenSubscribers ? "Hidden by channel" : fmt(ch.subscribers) },
      rows: [
        { name: "Total views", value: fmt(ch.views) },
        { name: "Videos", value: fmt(ch.videos) },
        { name: "Average views", sub: "last " + r.count + " uploads", value: fmt(r.avgViews) },
        { name: "Average likes", value: fmt(r.avgLikes) },
        { name: "Average comments", value: fmt(r.avgComments) },
        { name: "Views per subscriber", sub: "average views / subscribers", value: pct(safeDiv(r.avgViews, ch.subscribers) * 100, 1) },
        { name: "Uploads per month", value: fmt(r.uploadsPerMonth, 1) },
        { name: "Channel created", value: dateStr(ch.publishedAt) },
      ],
      table: ytRecentTable(ch),
    };
  };

  COMPUTE["youtube-engagement-rate-calculator"] = function (v, d) {
    var ch = d.channel, r = ch.recent, er = ytER(ch), g = ytGradeView(er.byView);
    return {
      profile: ytProfile(ch),
      hero: { label: "Engagement rate by views", value: pct(er.byView) + " " + pill(g), note: "(likes + comments) / views on the last " + r.count + " uploads" },
      rows: [
        { name: "Engagement rate by subscribers", value: pct(er.bySub) },
        { name: "Like rate per view", value: pct(safeDiv(r.avgLikes, r.avgViews) * 100) },
        { name: "Comment rate per view", value: pct(safeDiv(r.avgComments, r.avgViews) * 100, 3) },
        { name: "Average views", value: fmt(r.avgViews) },
        { name: "Average likes", value: fmt(r.avgLikes) },
        { name: "Average comments", value: fmt(r.avgComments) },
        { name: "Subscribers", value: fmt(ch.subscribers) },
      ],
      note: "Benchmarks by views: under 1% low, 1 to 2% below average, 2 to 4% average, 4 to 6% good, above 6% excellent.",
    };
  };

  COMPUTE["youtube-money-calculator"] = function (v, d) {
    var ch = d.channel, r = ch.recent, mv = ytMonthlyViews(ch);
    var lo = num(v.rpmLow), hi = num(v.rpmHigh);
    if (hi < lo) { var t = lo; lo = hi; hi = t; }
    var mLo = (mv.views / 1000) * lo, mHi = (mv.views / 1000) * hi;
    var out = {
      profile: ytProfile(ch),
      hero: { label: "Estimated monthly earnings", value: range(mLo, mHi), note: "Based on " + compact(mv.views) + " monthly views (" + mv.basis + ")" },
      rows: [
        { name: "Estimated yearly earnings", value: range(mLo * 12, mHi * 12) },
        { name: "Estimated earnings per video", sub: "at " + fmt(r.avgViews) + " average views", value: range((r.avgViews / 1000) * lo, (r.avgViews / 1000) * hi) },
        { name: "Estimated monthly views", value: fmt(mv.views) },
        { name: "RPM range used", value: money(lo) + " to " + money(hi) + " per 1,000 views" },
        { name: "Uploads per month", value: fmt(r.uploadsPerMonth, 1) },
      ],
      note: "RPM is what a creator keeps per 1,000 views after YouTube's share. Sponsorships, memberships and merchandise are not included.",
    };
    if (r.shortsShare >= 0.5) out.note = '<span class="warn">Over half of recent uploads are Shorts.</span> Shorts pay around $0.05 to $0.10 per 1,000 views, so the real figure is likely far lower. ' + out.note;
    return out;
  };

  COMPUTE["youtube-sponsorship-price-calculator"] = function (v, d) {
    var ch = d.channel, r = ch.recent, er = ytER(ch);
    var lo = num(v.cpmLow), hi = num(v.cpmHigh);
    if (hi < lo) { var t = lo; lo = hi; hi = t; }
    var adj = er.byView > 4 ? 1.2 : er.byView < 1.5 ? 0.8 : 1;
    var base = r.avgViews / 1000;
    var iLo = base * lo * adj, iHi = base * hi * adj;
    return {
      profile: ytProfile(ch),
      hero: { label: "60-second integration", value: range(iLo, iHi), note: fmt(r.avgViews) + " average views x " + money(lo) + " to " + money(hi) + " CPM" + (adj !== 1 ? ", engagement adjustment " + adj + "x" : "") },
      rows: [
        { name: "Dedicated video", sub: "1.75x an integration", value: range(iLo * 1.75, iHi * 1.75) },
        { name: "Shorts mention", sub: "0.25x an integration", value: range(iLo * 0.25, iHi * 0.25) },
        { name: "Engagement rate by views", value: pct(er.byView) + " " + pill(ytGradeView(er.byView)) },
        { name: "Average views", sub: "last " + r.count + " uploads", value: fmt(r.avgViews) },
        { name: "Subscribers", value: fmt(ch.subscribers) },
      ],
      note: "Brands pay for views, so a channel with fewer subscribers but higher average views earns more per deal. Add 20 to 50% for exclusivity or usage rights.",
    };
  };

  COMPUTE["youtube-channel-comparison"] = function (v, d) {
    var chans = d.channels.filter(function (c) { return !c.error; });
    var errs = d.channels.filter(function (c) { return c.error; });
    if (chans.length < 2) return { error: "Could not load two channels. " + errs.map(function (e) { return e.input + ": " + e.error; }).join(" ") };
    var items = chans.map(function (c) { return { name: c.title, ch: c }; });
    var table = compareTable(items, [
      { name: "Subscribers", get: function (i) { return i.ch.subscribers; }, fmt: compact },
      { name: "Total views", get: function (i) { return i.ch.views; }, fmt: compact },
      { name: "Videos", get: function (i) { return i.ch.videos; } },
      { name: "Average views (last 10)", get: function (i) { return i.ch.recent.avgViews; }, fmt: compact },
      { name: "Views per subscriber", get: function (i) { return safeDiv(i.ch.recent.avgViews, i.ch.subscribers) * 100; }, fmt: function (x) { return pct(x, 1); } },
      { name: "Engagement by views", get: function (i) { return ytER(i.ch).byView; }, fmt: pct },
      { name: "Average comments", get: function (i) { return i.ch.recent.avgComments; } },
      { name: "Uploads per month", get: function (i) { return i.ch.recent.uploadsPerMonth; }, fmt: function (x) { return fmt(x, 1); } },
      { name: "Channel age (years)", get: function (i) { return years(i.ch.publishedAt); }, fmt: function (x) { return fmt(x, 1); }, lead: false },
    ]);
    return { table: table, note: (errs.length ? "Not loaded: " + errs.map(function (e) { return esc(e.input); }).join(", ") + ". " : "") + "The leader on each row is shown in green." };
  };

  COMPUTE["youtube-channel-quality-checker"] = function (v, d) {
    var ch = d.channel, r = ch.recent, er = ytER(ch);
    var eng = clamp(er.byView / 4, 0, 1) * 35;
    var reach = clamp(safeDiv(r.avgViews, ch.subscribers) / 0.3, 0, 1) * 25;
    var cons = clamp(r.uploadsPerMonth / 4, 0, 1) * 20;
    var size = clamp(Math.log10(Math.max(ch.subscribers, 1)) / 6, 0, 1) * 12 + clamp(years(ch.publishedAt) / 4, 0, 1) * 8;
    var score = Math.round(eng + reach + cons + size);
    return {
      profile: ytProfile(ch),
      hero: { label: "Channel quality score", value: score + " / 100 " + pill({ label: "Grade " + letter(score), cls: score >= 70 ? "good" : score >= 55 ? "" : score >= 40 ? "warn" : "bad" }) },
      bars: [
        { label: "Engagement (" + pct(er.byView) + " by views)", value: (eng / 35) * 100, text: Math.round(eng) + " / 35" },
        { label: "Reach (" + pct(safeDiv(r.avgViews, ch.subscribers) * 100, 1) + " of subscribers watch)", value: (reach / 25) * 100, text: Math.round(reach) + " / 25" },
        { label: "Consistency (" + fmt(r.uploadsPerMonth, 1) + " uploads a month)", value: (cons / 20) * 100, text: Math.round(cons) + " / 20" },
        { label: "Audience (" + compact(ch.subscribers) + " subscribers, " + fmt(years(ch.publishedAt), 1) + " years)", value: (size / 20) * 100, text: Math.round(size) + " / 20" },
      ],
      note: "Full marks need 4% engagement by views, 30% of subscribers watching each upload, 4 or more uploads a month, and a mature audience.",
    };
  };

  COMPUTE["find-youtube-influencers-by-niche"] = COMPUTE["search-youtube-influencers-by-location"] = function (v, d) {
    if (!d.channels.length) return { error: "No channels matched. Try a broader keyword or a wider subscriber range.", note: "Country filters only match channels that set a country on their About page." };
    return { hero: { label: "Channels found", value: fmt(d.channels.length) }, table: channelTable(d.channels), note: "Sorted by subscribers. Click a channel to open it on YouTube." };
  };

  COMPUTE["youtube-lookalike-finder"] = function (v, d) {
    if (!d.channels.length) return { error: "No similar channels found. The seed channel may have no topics or keywords set." };
    return { profile: ytProfile(d.seed), hero: { label: "Similar channels", value: fmt(d.channels.length), note: "Matched on: " + esc(d.query) }, table: channelTable(d.channels), note: "Sorted by closeness in audience size to the seed channel." };
  };

  /* ----------------------------------------------------------- Twitch */
  function twProfile(c) {
    return { img: c.profileImage, title: c.displayName, url: c.url, meta: [c.broadcasterType !== "none" ? c.broadcasterType : "", c.game, "since " + new Date(c.createdAt).getFullYear()].filter(Boolean).join(" · ") };
  }
  COMPUTE["twitch-follower-count-checker"] = function (v, d) {
    var c = d.channel;
    return {
      profile: twProfile(c),
      hero: { label: "Followers", value: c.followers == null ? "Not available" : fmt(c.followers) },
      rows: [
        { name: "Live now", value: c.live ? '<span class="good">Live</span> · ' + fmt(c.live.viewers) + " viewers · " + esc(c.live.game || "") : "Offline" },
        { name: "Last category", value: esc(c.game || "n/a") },
        { name: "Average VOD views", sub: "last " + c.recent.count + " videos", value: fmt(c.recent.avgViews) },
        { name: "Followers per year", value: c.followersPerYear == null ? "n/a" : fmt(c.followersPerYear) },
        { name: "Account created", value: dateStr(c.createdAt) + " (" + fmt(c.accountYears, 1) + " years)" },
        { name: "Status", value: esc(c.broadcasterType === "none" ? "Regular" : c.broadcasterType) },
      ],
      table: c.recent.videos.length ? { head: ["Recent video", "Published", "Views"], numeric: true, rows: c.recent.videos.map(function (x) { return ['<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.title) + "</a>", dateStr(x.publishedAt), fmt(x.views)]; }) } : null,
    };
  };
  COMPUTE["twitch-channel-comparison"] = function (v, d) {
    var chans = d.channels.filter(function (c) { return !c.error; });
    var errs = d.channels.filter(function (c) { return c.error; });
    if (chans.length < 2) return { error: "Could not load two channels. " + errs.map(function (e) { return e.input + ": " + e.error; }).join(" ") };
    var items = chans.map(function (c) { return { name: c.displayName, c: c }; });
    return {
      table: compareTable(items, [
        { name: "Followers", get: function (i) { return i.c.followers; }, fmt: compact },
        { name: "Live viewers now", get: function (i) { return i.c.live ? i.c.live.viewers : 0; }, fmt: function (x) { return x ? fmt(x) : "offline"; } },
        { name: "Average VOD views", get: function (i) { return i.c.recent.avgViews; } },
        { name: "Followers per year", get: function (i) { return i.c.followersPerYear; } },
        { name: "Account age (years)", get: function (i) { return i.c.accountYears; }, fmt: function (x) { return fmt(x, 1); }, lead: false },
        { name: "Status", get: function (i) { return i.c.broadcasterType; }, fmt: function (x) { return esc(x === "none" ? "regular" : x); }, lead: false },
      ]),
      note: (errs.length ? "Not loaded: " + errs.map(function (e) { return esc(e.input); }).join(", ") + ". " : "") + "The leader on each row is shown in green.",
    };
  };

  /* ----------------------------------------------------------- Instagram */
  COMPUTE["instagram-engagement-rate-calculator"] = function (v) {
    var f = num(v.followers), l = num(v.likes), c = num(v.comments), t = tier(IG_TIERS, f), er = igER(f, l, c), g = grade(er / t.avg);
    return {
      hero: { label: "Engagement rate", value: pct(er) + " " + pill(g), note: "(" + fmt(l) + " likes + " + fmt(c) + " comments) / " + fmt(f) + " followers" },
      rows: [
        { name: "Tier", value: t.name },
        { name: "Typical rate for this tier", value: pct(t.avg, 1) },
        { name: "Like rate", value: pct(safeDiv(l, f) * 100) },
        { name: "Comment rate", value: pct(safeDiv(c, f) * 100, 3) },
        { name: "Comments per 100 likes", value: fmt(safeDiv(c, l) * 100, 1) },
      ],
      note: "Excellent is 1.6x the tier average or more. Low is under half of it.",
    };
  };

  COMPUTE["instagram-engagement-rate-benchmark"] = function (v) {
    var f = num(v.followers), er = num(v.er), t = tier(IG_TIERS, f), g = grade(er / t.avg);
    return {
      hero: { label: "Your rate vs the " + t.name + " tier", value: pct(er) + " " + pill(g), note: "Tier average " + pct(t.avg, 1) },
      table: {
        head: ["Tier", "Low", "Average", "Good", "Excellent"],
        numeric: true,
        rows: IG_TIERS.map(function (x) {
          var mark = x === t ? { html: "<b>" + esc(x.name) + "</b>", lead: true } : esc(x.name);
          return [mark, "under " + pct(x.avg * 0.5, 1), pct(x.avg, 1), pct(x.avg * 1.25, 1) + "+", pct(x.avg * 1.6, 1) + "+"];
        }),
      },
      note: "Typical rates fall as accounts grow because a smaller share of a large audience sees each post.",
    };
  };

  COMPUTE["instagram-follower-to-following-ratio"] = COMPUTE["x-follower-to-following-ratio"] = function (v) {
    var f = num(v.followers), g = num(v.following), r = safeDiv(f, g), lab = ratioLabel(r);
    return {
      hero: { label: "Follower to following ratio", value: (g > 0 ? fmt(r, 2) + " : 1" : "n/a") + " " + pill(lab) },
      rows: [
        { name: "Followers", value: fmt(f) },
        { name: "Following", value: fmt(g) },
        { name: "Followers per person followed", value: g > 0 ? fmt(r, 2) : "n/a" },
        { name: "Reading", value: r >= 10 ? "People follow this account for its content." : r >= 2 ? "Healthy for an account still growing." : r >= 1 ? "Normal for a personal account." : "Follows more than it is followed. Common for new accounts or follow-for-follow growth." },
      ],
    };
  };

  COMPUTE["instagram-likes-to-followers-ratio"] = function (v) {
    var f = num(v.followers), l = num(v.likes), rate = safeDiv(l, f) * 100, t = tier(IG_TIERS, f), g = grade(rate / (t.avg * 0.92));
    return {
      hero: { label: "Like rate", value: pct(rate) + " " + pill(g), note: fmt(l) + " likes per post / " + fmt(f) + " followers" },
      rows: [
        { name: "Tier", value: t.name },
        { name: "Typical like rate for this tier", value: pct(t.avg * 0.92, 1) },
        { name: "Followers per like", value: l > 0 ? fmt(f / l, 1) : "n/a" },
      ],
      note: "Likes are usually about 92% of total engagement, so the like benchmark is slightly below the engagement benchmark.",
    };
  };

  function igPrice(f, er) {
    var t = tier(IG_TIERS, f), mult = clamp(safeDiv(er, t.avg) || 1, 0.6, 1.6);
    return { mid: (f / 1000) * 10 * mult, mult: mult, tier: t };
  }
  COMPUTE["instagram-money-calculator"] = function (v) {
    var f = num(v.followers), er = num(v.er), n = num(v.postsPerMonth), p = igPrice(f, er);
    return {
      hero: { label: "Estimated earnings per sponsored post", value: range(p.mid * 0.7, p.mid * 1.3), note: fmt(f) + " followers, " + pct(er, 1) + " engagement (" + fmt(p.mult, 2) + "x tier adjustment)" },
      rows: [
        { name: "Per month", sub: fmt(n) + " sponsored posts", value: range(p.mid * 0.7 * n, p.mid * 1.3 * n) },
        { name: "Per year", value: range(p.mid * 0.7 * n * 12, p.mid * 1.3 * n * 12) },
        { name: "Tier", value: p.tier.name },
        { name: "Typical engagement for tier", value: pct(p.tier.avg, 1) },
      ],
      note: "Base rate is $10 per 1,000 followers per post, moved up or down by engagement. Niche, audience country and usage rights change the real number.",
    };
  };
  COMPUTE["instagram-pricing-calculator"] = function (v) {
    var f = num(v.followers), er = num(v.er), p = igPrice(f, er);
    var r = function (m) { return range(p.mid * m * 0.7, p.mid * m * 1.3); };
    return {
      hero: { label: "Feed post", value: r(1), note: fmt(f) + " followers, " + pct(er, 1) + " engagement" },
      rows: [
        { name: "Reel", sub: "1.3x a post", value: r(1.3) },
        { name: "Single story", sub: "0.4x a post", value: r(0.4) },
        { name: "Story set of 3", sub: "1x a post", value: r(1) },
        { name: "Post + reel + 3 stories bundle", sub: "2.8x with a 15% bundle discount", value: r(2.8 * 0.85) },
        { name: "Tier", value: p.tier.name },
      ],
      note: "Add 20 to 50% for exclusivity, whitelisting or usage beyond 30 days. Ranges are 30% either side of the midpoint.",
    };
  };
  COMPUTE["instagram-emv-calculator"] = function (v) {
    var imp = num(v.impressions), l = num(v.likes), c = num(v.comments), s = num(v.shares), sv = num(v.saves), cl = num(v.clicks);
    var eng = l * 0.1 + c * 0.5 + s * 1.5 + sv * 0.4 + cl * 0.6;
    var mid = (imp / 1000) * 6 + eng, lo = (imp / 1000) * 4 + eng, hi = (imp / 1000) * 10 + eng;
    return {
      hero: { label: "Earned media value", value: money(mid), note: "Range " + range(lo, hi) + " depending on the CPM assumed for impressions" },
      rows: [
        { name: "Impressions", sub: "$6 per 1,000", value: money((imp / 1000) * 6) },
        { name: "Likes", sub: "$0.10 each", value: money(l * 0.1) },
        { name: "Comments", sub: "$0.50 each", value: money(c * 0.5) },
        { name: "Shares", sub: "$1.50 each", value: money(s * 1.5) },
        { name: "Saves", sub: "$0.40 each", value: money(sv * 0.4) },
        { name: "Link clicks", sub: "$0.60 each", value: money(cl * 0.6) },
      ],
      note: "Weights reflect what the same actions cost through Instagram ads. Use identical weights across campaigns so the comparison holds.",
    };
  };

  function igFakeScore(f, g, posts, l, c) {
    var t = tier(IG_TIERS, f), er = igER(f, l, c), flags = [], score = 0;
    var add = function (pts, why) { score += pts; flags.push({ pts: pts, why: why }); };
    if (f >= 1000 && er < t.avg * 0.4) add(35, "Engagement " + pct(er) + " is under 40% of the " + pct(t.avg, 1) + " typical for this size.");
    else if (f >= 1000 && er < t.avg * 0.7) add(15, "Engagement " + pct(er) + " is below the " + pct(t.avg, 1) + " typical for this size.");
    if (l > 0 && safeDiv(c, l) < 0.003) add(15, "Comments are under 0.3% of likes, a pattern seen with bought likes.");
    if (l > 0 && safeDiv(c, l) > 0.2 && f > 5000) add(5, "Comments are unusually high relative to likes. Check for spam or bot comments.");
    if (g > f && f > 10000) add(15, "Follows more accounts than follow it, at a size where that is unusual.");
    else if (g > f * 2) add(10, "Following is more than double the follower count.");
    if (posts < 20 && f > 20000) add(15, "Only " + fmt(posts) + " posts for " + compact(f) + " followers.");
    if (f >= 1000 && er > t.avg * 3 && safeDiv(c, l) < 0.005) add(10, "Very high like rate with almost no comments suggests purchased likes.");
    return { score: clamp(score, 0, 100), flags: flags, er: er, tier: t };
  }
  function fakeBand(score) {
    if (score < 20) return { label: "0 to 10% fake", read: "Healthy", cls: "good" };
    if (score < 45) return { label: "10 to 25% fake", read: "Some concerns", cls: "warn" };
    if (score < 70) return { label: "25 to 45% fake", read: "Suspicious", cls: "bad" };
    return { label: "45%+ fake", read: "Very suspicious", cls: "bad" };
  }
  function fakeOut(res, extraRows) {
    var b = fakeBand(res.score);
    return {
      hero: { label: "Estimated fake followers", value: b.label + " " + pill({ label: b.read, cls: b.cls }), note: "Suspicion score " + res.score + " / 100" },
      rows: [{ name: "Engagement rate", value: pct(res.er) }, { name: "Typical for this tier", value: pct(res.tier.avg, 1) }].concat(extraRows || []),
      list: res.flags.length ? res.flags.map(function (x) { return esc(x.why) + ' <span class="pill warn">+' + x.pts + "</span>"; }) : ["No red flags in the numbers provided."],
      note: "An estimate from public numbers. A definitive answer needs a follower-list audit.",
    };
  }
  COMPUTE["instagram-fake-follower-checker"] = function (v) {
    var res = igFakeScore(num(v.followers), num(v.following), num(v.posts), num(v.likes), num(v.comments));
    return fakeOut(res, [{ name: "Follower to following ratio", value: fmt(safeDiv(num(v.followers), num(v.following)), 1) + " : 1" }]);
  };

  COMPUTE["instagram-audit"] = function (v) {
    var f = num(v.followers), g = num(v.following), posts = num(v.posts), l = num(v.likes), c = num(v.comments), fb = num(v.followersBefore), ppw = num(v.postsPerWeek);
    var fake = igFakeScore(f, g, posts, l, c);
    var eng = clamp(fake.er / (fake.tier.avg * 1.25), 0, 1) * 35;
    var auth = ((100 - fake.score) / 100) * 25;
    var growth = fb > 0 ? ((f - fb) / fb) * 100 : 0;
    var gr = fb > 0 ? clamp((growth + 2) / 7, 0, 1) * 20 : 10;
    var cons = ppw >= 3 && ppw <= 7 ? 20 : ppw > 7 ? 16 : ppw >= 1 ? 12 : ppw > 0 ? 6 : 0;
    var score = Math.round(eng + auth + gr + cons);
    return {
      hero: { label: "Audience quality score", value: score + " / 100 " + pill({ label: "Grade " + letter(score), cls: score >= 70 ? "good" : score >= 55 ? "" : score >= 40 ? "warn" : "bad" }) },
      bars: [
        { label: "Engagement (" + pct(fake.er) + ", tier average " + pct(fake.tier.avg, 1) + ")", value: (eng / 35) * 100, text: Math.round(eng) + " / 35" },
        { label: "Authenticity (suspicion score " + fake.score + ")", value: (auth / 25) * 100, text: Math.round(auth) + " / 25" },
        { label: "Growth (" + (fb > 0 ? (growth >= 0 ? "+" : "") + fmt(growth, 1) + "% in 30 days" : "no 30-day figure given") + ")", value: (gr / 20) * 100, text: Math.round(gr) + " / 20" },
        { label: "Consistency (" + fmt(ppw, 1) + " posts a week)", value: (cons / 20) * 100, text: cons + " / 20" },
      ],
      list: fake.flags.map(function (x) { return esc(x.why); }),
      note: "Full marks: engagement at 1.25x the tier average, no authenticity flags, 5%+ growth in 30 days, 3 to 7 posts a week.",
    };
  };

  function manualCompare(v, prefixes, fields, metrics, nameField) {
    var items = [];
    prefixes.forEach(function (p, i) {
      var any = fields.some(function (f) { return String(v[p + f] || "").trim() !== ""; });
      if (i < 2 || any) {
        var o = { name: String(v[p + (nameField || "name")] || "").trim() || "Account " + "ABC"[i] };
        fields.forEach(function (f) { o[f] = num(v[p + f]); });
        items.push(o);
      }
    });
    return { table: compareTable(items, metrics), note: "The leader on each row is shown in green." };
  }
  COMPUTE["instagram-account-comparison"] = function (v) {
    return manualCompare(v, ["a_", "b_", "c_"], ["followers", "following", "posts", "likes", "comments"], [
      { name: "Followers", get: function (i) { return i.followers; }, fmt: compact },
      { name: "Following", get: function (i) { return i.following; }, lead: false },
      { name: "Posts", get: function (i) { return i.posts; } },
      { name: "Follower to following ratio", get: function (i) { return safeDiv(i.followers, i.following); }, fmt: function (x) { return fmt(x, 1); } },
      { name: "Average likes", get: function (i) { return i.likes; } },
      { name: "Average comments", get: function (i) { return i.comments; } },
      { name: "Engagement rate", get: function (i) { return igER(i.followers, i.likes, i.comments); }, fmt: pct },
      { name: "Like rate", get: function (i) { return safeDiv(i.likes, i.followers) * 100; }, fmt: pct },
      { name: "Comments per 100 likes", get: function (i) { return safeDiv(i.comments, i.likes) * 100; }, fmt: function (x) { return fmt(x, 1); } },
    ]);
  };

  COMPUTE["instagram-caption-analyzer"] = function (v) {
    var cap = String(v.caption || "");
    var chars = cap.length, words = (cap.match(/\S+/g) || []).length;
    var tags = cap.match(/#[\p{L}\p{N}_]+/gu) || [], mentions = cap.match(/@[\w.]+/g) || [];
    var emoji = (cap.match(/\p{Extended_Pictographic}/gu) || []).length;
    var lines = cap.split(/\n/).length;
    var firstLine = cap.split(/\n/)[0] || "";
    var cta = /\b(comment|tag|share|save|link in bio|link below|dm|message|click|shop|book|sign up|download|follow|drop|tell me|let me know|swipe|read more|join)\b/i.test(cap);
    var question = /\?/.test(cap);
    var sentences = cap.replace(/#[\w]+/g, "").split(/[.!?\n]+/).filter(function (s) { return s.trim().split(/\s+/).length > 1; });
    var avgSent = sentences.length ? words / sentences.length : words;
    var avgWord = words ? cap.replace(/[#@]\S+/g, "").replace(/[^\p{L}\p{N}\s]/gu, "").split(/\s+/).filter(Boolean).reduce(function (a, w) { return a + w.length; }, 0) / words : 0;
    var read = avgSent <= 12 && avgWord <= 5 ? { label: "Easy to read", cls: "good" } : avgSent <= 20 ? { label: "Medium", cls: "" } : { label: "Hard to read", cls: "warn" };
    var tips = [];
    if (chars > 2200) tips.push('<span class="bad">Over the 2,200 character limit by ' + fmt(chars - 2200) + ". Instagram will refuse it.</span>");
    if (firstLine.length > 125) tips.push("The first line is " + firstLine.length + " characters. Only about 125 show before \"more\", so put the hook in the first 125.");
    if (!cta) tips.push("No call to action found. Ask readers to comment, save or tap the link.");
    if (!question) tips.push("No question. Posts that ask something get more comments.");
    if (tags.length > 30) tips.push('<span class="bad">' + tags.length + " hashtags. Instagram allows 30.</span>");
    else if (tags.length > 10) tips.push(tags.length + " hashtags is more than most accounts need. 3 to 5 relevant tags usually perform better.");
    else if (tags.length === 0) tips.push("No hashtags. Add 3 to 5 specific ones so the post is discoverable.");
    if (lines < 3 && words > 40) tips.push("Add line breaks. Walls of text get skipped.");
    if (emoji > 10) tips.push(emoji + " emoji is a lot. Keep them to a few per paragraph.");
    if (!tips.length) tips.push('<span class="good">This caption follows every rule checked here.</span>');
    return {
      hero: { label: "Characters", value: fmt(chars) + " / 2,200 " + pill(chars > 2200 ? { label: "Too long", cls: "bad" } : chars > 1500 ? { label: "Long", cls: "warn" } : { label: "OK", cls: "good" }) },
      rows: [
        { name: "Words", value: fmt(words) },
        { name: "First line", sub: "shown before \"more\"", value: firstLine.length + " / 125 characters", cls: firstLine.length > 125 ? "warn" : "" },
        { name: "Hashtags", value: tags.length + " / 30", cls: tags.length > 30 ? "bad" : "" },
        { name: "Mentions", value: fmt(mentions.length) },
        { name: "Emoji", value: fmt(emoji) },
        { name: "Line breaks", value: fmt(lines - 1) },
        { name: "Call to action", value: cta ? '<span class="good">Yes</span>' : '<span class="warn">No</span>' },
        { name: "Question", value: question ? '<span class="good">Yes</span>' : '<span class="warn">No</span>' },
        { name: "Readability", value: pill(read) + " " + fmt(avgSent, 1) + " words per sentence" },
      ],
      list: tips,
    };
  };

  /* ----------------------------------------------------------- TikTok */
  function ttGradeViews(er) {
    if (er < 3) return { label: "Low", cls: "bad" };
    if (er < 5) return { label: "Below average", cls: "warn" };
    if (er < 9) return { label: "Average", cls: "" };
    if (er < 12) return { label: "Good", cls: "good" };
    return { label: "Excellent", cls: "good" };
  }
  COMPUTE["tiktok-engagement-rate-calculator"] = function (v) {
    var f = num(v.followers), vw = num(v.views), l = num(v.likes), c = num(v.comments), s = num(v.shares);
    var erV = safeDiv(l + c + s, vw) * 100, erF = safeDiv(l + c + s, f) * 100, t = tier(TT_TIERS, f);
    return {
      hero: { label: "Engagement rate by views", value: pct(erV) + " " + pill(ttGradeViews(erV)), note: "(" + fmt(l) + " likes + " + fmt(c) + " comments + " + fmt(s) + " shares) / " + fmt(vw) + " views" },
      rows: [
        { name: "Engagement rate by followers", value: pct(erF) + " " + pill(grade(erF / t.avg)) },
        { name: "Typical by followers for " + t.name, value: pct(t.avg, 0) },
        { name: "Views per follower", value: pct(safeDiv(vw, f) * 100, 0) },
        { name: "Like rate by views", value: pct(safeDiv(l, vw) * 100) },
        { name: "Share rate by views", value: pct(safeDiv(s, vw) * 100, 3) },
      ],
      note: "By views: under 3% low, 3 to 5% below average, 5 to 9% average, 9 to 12% good, over 12% excellent.",
    };
  };
  COMPUTE["tiktok-likes-to-followers-ratio"] = function (v) {
    var f = num(v.followers), tl = num(v.totalLikes), r = safeDiv(tl, f);
    var g = r >= 40 ? { label: "Viral history", cls: "good" } : r >= 10 ? { label: "Healthy", cls: "good" } : r >= 5 ? { label: "Average", cls: "" } : { label: "Low", cls: "warn" };
    return {
      hero: { label: "Likes per follower", value: fmt(r, 1) + " " + pill(g), note: fmt(tl) + " total likes / " + fmt(f) + " followers" },
      rows: [
        { name: "Healthy range", value: "10 to 40 likes per follower" },
        { name: "Reading", value: r >= 40 ? "One or more videos went viral far beyond the follower base." : r >= 10 ? "Followers watch and like consistently." : r >= 5 ? "Normal for a newer or slower-posting account." : "Followers are not engaging with videos. Check the fake follower estimator." },
      ],
    };
  };
  COMPUTE["tiktok-money-calculator"] = function (v) {
    var mv = num(v.monthlyViews), q = clamp(num(v.qualifiedShare), 0, 100) / 100, av = num(v.avgViews);
    var qv = mv * q, lo = (qv / 1000) * 0.4, hi = (qv / 1000) * 1.0;
    return {
      hero: { label: "Creator Rewards per month", value: range(lo, hi), note: compact(qv) + " qualified views (" + fmt(q * 100, 0) + "% of " + compact(mv) + ") at $0.40 to $1.00 per 1,000" },
      rows: [
        { name: "Creator Rewards per year", value: range(lo * 12, hi * 12) },
        { name: "Sponsored video", sub: fmt(av) + " average views x $10 to $20 per 1,000", value: range((av / 1000) * 10, (av / 1000) * 20) },
        { name: "Views that do not qualify", sub: "videos under 1 minute", value: compact(mv - qv) },
      ],
      note: "Creator Rewards needs 10,000 followers and 100,000 views in 30 days, and pays only on videos over one minute. Live gifts and TikTok Shop are not included.",
    };
  };
  COMPUTE["tiktok-pricing-calculator"] = function (v) {
    var av = num(v.avgViews), er = num(v.er), adj = clamp(er / 7, 0.7, 1.4);
    var lo = (av / 1000) * 10 * adj, hi = (av / 1000) * 20 * adj;
    return {
      hero: { label: "Sponsored video", value: range(lo, hi), note: fmt(av) + " average views, engagement adjustment " + fmt(adj, 2) + "x" },
      rows: [
        { name: "Series of 3 videos", sub: "2.5x a single video", value: range(lo * 2.5, hi * 2.5) },
        { name: "With Spark Ads rights", sub: "+40%", value: range(lo * 1.4, hi * 1.4) },
        { name: "Engagement rate by views", value: pct(er, 1) + " " + pill(ttGradeViews(er)) },
        { name: "Followers", value: fmt(num(v.followers)) },
      ],
      note: "Views drive TikTok pricing more than followers. A creator averaging 100K views can charge more than one with 500K followers and 20K views.",
    };
  };
  function ttFakeScore(f, tl, vw, l, c) {
    var flags = [], score = 0, add = function (p, w) { score += p; flags.push({ pts: p, why: w }); };
    var vpf = safeDiv(vw, f);
    if (f >= 1000 && vpf < 0.05) add(35, "Average views are only " + pct(vpf * 100, 1) + " of followers. Real followers watch.");
    else if (f >= 1000 && vpf < 0.15) add(15, "Average views are " + pct(vpf * 100, 1) + " of followers, below the 15 to 50% typical range.");
    if (f >= 1000 && safeDiv(tl, f) < 3) add(20, "Total likes are under 3 per follower.");
    if (l > 0 && safeDiv(c, l) < 0.005) add(15, "Comments are under 0.5% of likes.");
    if (vw > 0 && safeDiv(l, vw) < 0.02) add(10, "Like rate by views is under 2%.");
    if (vw > 0 && safeDiv(l, vw) > 0.4) add(10, "Like rate by views above 40% is abnormal and points to bought likes.");
    return { score: clamp(score, 0, 100), flags: flags, er: safeDiv(l + c, f) * 100, tier: tier(TT_TIERS, f) };
  }
  COMPUTE["tiktok-fake-follower-checker"] = function (v) {
    var res = ttFakeScore(num(v.followers), num(v.totalLikes), num(v.views), num(v.likes), num(v.comments));
    return fakeOut(res, [{ name: "Views per follower", value: pct(safeDiv(num(v.views), num(v.followers)) * 100, 0) }, { name: "Likes per follower (total)", value: fmt(safeDiv(num(v.totalLikes), num(v.followers)), 1) }]);
  };
  COMPUTE["tiktok-audit"] = function (v) {
    var f = num(v.followers), tl = num(v.totalLikes), vw = num(v.views), l = num(v.likes), c = num(v.comments), s = num(v.shares), fb = num(v.followersBefore), vpw = num(v.videosPerWeek);
    var erV = safeDiv(l + c + s, vw) * 100, fake = ttFakeScore(f, tl, vw, l, c);
    var eng = clamp(erV / 9, 0, 1) * 30, reach = clamp(safeDiv(vw, f) / 0.5, 0, 1) * 25, auth = ((100 - fake.score) / 100) * 25;
    var growth = fb > 0 ? ((f - fb) / fb) * 100 : 0;
    var gr = (fb > 0 ? clamp((growth + 2) / 10, 0, 1) : 0.5) * 10;
    var cons = vpw >= 3 ? 10 : vpw >= 1 ? 6 : vpw > 0 ? 3 : 0;
    var score = Math.round(eng + reach + auth + gr + cons);
    return {
      hero: { label: "Audience quality score", value: score + " / 100 " + pill({ label: "Grade " + letter(score), cls: score >= 70 ? "good" : score >= 55 ? "" : score >= 40 ? "warn" : "bad" }) },
      bars: [
        { label: "Engagement (" + pct(erV, 1) + " by views)", value: (eng / 30) * 100, text: Math.round(eng) + " / 30" },
        { label: "Reach (" + pct(safeDiv(vw, f) * 100, 0) + " views per follower)", value: (reach / 25) * 100, text: Math.round(reach) + " / 25" },
        { label: "Authenticity (suspicion score " + fake.score + ")", value: (auth / 25) * 100, text: Math.round(auth) + " / 25" },
        { label: "Growth (" + (fb > 0 ? (growth >= 0 ? "+" : "") + fmt(growth, 1) + "% in 30 days" : "no figure") + ") and consistency (" + fmt(vpw, 1) + " videos a week)", value: ((gr + cons) / 20) * 100, text: Math.round(gr + cons) + " / 20" },
      ],
      list: fake.flags.map(function (x) { return esc(x.why); }),
      note: "Full marks: 9% engagement by views, views equal to half the follower count, no authenticity flags, 8%+ growth in 30 days, 3+ videos a week.",
    };
  };
  COMPUTE["tiktok-account-comparison"] = function (v) {
    return manualCompare(v, ["a_", "b_", "c_"], ["followers", "totalLikes", "views", "likes", "comments", "shares"], [
      { name: "Followers", get: function (i) { return i.followers; }, fmt: compact },
      { name: "Total likes", get: function (i) { return i.totalLikes; }, fmt: compact },
      { name: "Likes per follower", get: function (i) { return safeDiv(i.totalLikes, i.followers); }, fmt: function (x) { return fmt(x, 1); } },
      { name: "Average views", get: function (i) { return i.views; }, fmt: compact },
      { name: "Views per follower", get: function (i) { return safeDiv(i.views, i.followers) * 100; }, fmt: function (x) { return pct(x, 0); } },
      { name: "Engagement by views", get: function (i) { return safeDiv(i.likes + i.comments + i.shares, i.views) * 100; }, fmt: pct },
      { name: "Share rate", get: function (i) { return safeDiv(i.shares, i.views) * 100; }, fmt: function (x) { return pct(x, 3); } },
    ]);
  };

  /* ----------------------------------------------------------- X */
  COMPUTE["x-account-comparison"] = function (v) {
    return manualCompare(v, ["a_", "b_", "c_"], ["followers", "following", "posts", "likes", "reposts", "replies"], [
      { name: "Followers", get: function (i) { return i.followers; }, fmt: compact },
      { name: "Following", get: function (i) { return i.following; }, lead: false },
      { name: "Follower to following ratio", get: function (i) { return safeDiv(i.followers, i.following); }, fmt: function (x) { return fmt(x, 1); } },
      { name: "Posts", get: function (i) { return i.posts; }, lead: false },
      { name: "Engagement rate", get: function (i) { return safeDiv(i.likes + i.reposts + i.replies, i.followers) * 100; }, fmt: pct },
      { name: "Reposts per 1,000 followers", get: function (i) { return safeDiv(i.reposts, i.followers) * 1000; }, fmt: function (x) { return fmt(x, 2); } },
      { name: "Replies per 100 likes", get: function (i) { return safeDiv(i.replies, i.likes) * 100; }, fmt: function (x) { return fmt(x, 1); } },
    ]);
  };

  /* ----------------------------------------------------------- Generators (built in; AI upgrade optional) */
  var POOLS = {
    beauty: { broad: ["beauty", "makeup", "skincare"], mid: ["beautytips", "makeuplover", "skincareroutine", "glowup", "makeuptutorial", "beautyblogger"], niche: ["cleanbeautyproducts", "skincareover30", "drugstoremakeuplook", "beautycommunityuk"] },
    fashion: { broad: ["fashion", "style", "ootd"], mid: ["outfitinspo", "streetstyle", "fashionblogger", "styleinspo", "whatiwore", "fashiondaily"], niche: ["capsulewardrobeideas", "thriftedoutfitoftheday", "petitefashionfinds", "modestfashionstyle"] },
    fitness: { broad: ["fitness", "workout", "gym"], mid: ["fitnessmotivation", "homeworkout", "gymlife", "fitfam", "trainingday", "fitnessjourney"], niche: ["homeworkoutnoequipment", "beginnerstrengthtraining", "postpartumfitnessjourney", "runningforbeginners"] },
    food: { broad: ["food", "foodie", "recipe"], mid: ["homecooking", "easyrecipes", "foodphotography", "healthyfood", "mealprep", "foodblogger"], niche: ["15minutedinners", "veganmealprepideas", "budgetfriendlyrecipes", "airfryerrecipeseasy"] },
    travel: { broad: ["travel", "wanderlust", "travelgram"], mid: ["travelphotography", "traveltips", "exploremore", "roadtrip", "travelblogger", "beautifuldestinations"], niche: ["solofemaletraveltips", "budgettraveleurope", "hiddengemstravel", "weekendgetawayideas"] },
    tech: { broad: ["tech", "technology", "gadgets"], mid: ["techtips", "techreview", "newtech", "smartphone", "techlover", "techtok"], niche: ["budgetsmartphonereview", "homeofficesetupideas", "productivityappsformac", "aitoolsforsmallbusiness"] },
    gaming: { broad: ["gaming", "gamer", "videogames"], mid: ["gamingcommunity", "gamingsetup", "pcgaming", "twitchstreamer", "gamingclips", "indiegames"], niche: ["cozygamesrecommendations", "retrogamingcollection", "indiegamedevlog", "budgetgamingpcbuild"] },
    business: { broad: ["business", "entrepreneur", "smallbusiness"], mid: ["businesstips", "entrepreneurlife", "smallbusinessowner", "startuplife", "businessgrowth", "founder"], niche: ["servicebusinessgrowth", "solopreneurtips", "smallbusinessmarketingtips", "clientattractiontips"] },
    finance: { broad: ["finance", "money", "investing"], mid: ["personalfinance", "moneytips", "financialfreedom", "budgeting", "investingforbeginners", "wealthbuilding"], niche: ["debtfreejourneytips", "indexfundinvesting", "sidehustleincome", "moneysavingchallenge"] },
    education: { broad: ["education", "learning", "study"], mid: ["studytips", "studygram", "learnsomethingnew", "onlinelearning", "teachersofinstagram", "studymotivation"], niche: ["examrevisiontips", "languagelearningdaily", "homeschoolideas", "studywithmelive"] },
    parenting: { broad: ["parenting", "momlife", "family"], mid: ["parentingtips", "toddlerlife", "motherhood", "dadlife", "newmom", "parentinghacks"], niche: ["gentleparentingtips", "toddleractivitiesathome", "newbornsleeptips", "workingmomlife"] },
    pets: { broad: ["pets", "dog", "cat"], mid: ["dogsofinstagram", "catsofinstagram", "petlovers", "puppylove", "doglife", "rescuedog"], niche: ["dogtrainingtipsforbeginners", "seniordogcare", "catenrichmentideas", "adoptdontshopdogs"] },
    photography: { broad: ["photography", "photo", "photooftheday"], mid: ["photographer", "portraitphotography", "naturephotography", "streetphotography", "photographylovers", "shotoniphone"], niche: ["goldenhourportraits", "filmphotography35mm", "lightroompresetsfree", "beginnerphotographytips"] },
    art: { broad: ["art", "artist", "artwork"], mid: ["artoftheday", "illustration", "drawing", "digitalart", "artistsoninstagram", "sketchbook"], niche: ["procreateillustration", "watercolorforbeginners", "characterdesignsketch", "smallartistsupport"] },
    music: { broad: ["music", "musician", "newmusic"], mid: ["singer", "songwriter", "musicproducer", "livemusic", "indiemusic", "musiclover"], niche: ["bedroomproducerlife", "acousticcoversong", "unsignedartistmusic", "musicproductiontips"] },
    comedy: { broad: ["comedy", "funny", "humor"], mid: ["funnyvideos", "comedyreels", "relatable", "memes", "sketchcomedy", "standupcomedy"], niche: ["relatablemomhumor", "officehumorreels", "desicomedyvideos", "britishhumour"] },
    lifestyle: { broad: ["lifestyle", "life", "daily"], mid: ["lifestyleblogger", "dailyinspiration", "selfcare", "slowliving", "mindfulness", "routine"], niche: ["morningroutineideas", "cozyhomeaesthetic", "intentionallivingtips", "sundayresetroutine"] },
    health: { broad: ["health", "wellness", "healthy"], mid: ["healthylifestyle", "wellnessjourney", "mentalhealth", "nutrition", "selfcaretips", "holistichealth"], niche: ["guthealthtips", "anxietyreliefpractices", "hormonebalancenaturally", "sleephygienetips"] },
    "real estate": { broad: ["realestate", "realtor", "home"], mid: ["realestateagent", "househunting", "dreamhome", "homesforsale", "realestatetips", "property"], niche: ["firsttimehomebuyertips", "luxurylistings", "realestateinvestingtips", "hometourreels"] },
    "web design": { broad: ["webdesign", "website", "design"], mid: ["webdesigner", "uxdesign", "smallbusinesswebsite", "websitedesign", "webdevelopment", "designinspiration"], niche: ["squarespacedesigner", "squarespacewebsite", "seoforsmallbusiness", "websitetipsforcoaches"] },
  };
  var SUFFIX_MID = ["tips", "ideas", "inspo", "daily", "life", "community"];
  var SUFFIX_NICHE = ["forbeginners", "routine", "tipsandtricks", "athome", "2026goals", "thatwork"];

  function hashtagsLocal(v) {
    var topic = String(v.topic || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
    var words = topic.split(/\s+/).filter(function (w) { return w.length > 2 && !/^(the|and|for|with|your|how|from|this|that)$/.test(w); });
    var joined = words.join("");
    var count = parseInt(v.count, 10) || 20;
    var pool = POOLS[v.niche] || POOLS.lifestyle;
    var seen = {}, out = [];
    var push = function (tag, size) {
      tag = "#" + tag.replace(/^#/, "").replace(/[^a-z0-9_]/g, "");
      if (tag.length < 3 || tag.length > 40 || seen[tag] || out.length >= count) return;
      seen[tag] = 1;
      out.push({ tag: tag, size: size });
    };
    var nBroad = Math.max(2, Math.round(count * 0.2)), nNiche = Math.max(3, Math.round(count * 0.3)), nMid = count - nBroad - nNiche;
    var broad = [], mid = [], niche = [];
    pool.broad.forEach(function (t) { broad.push(t); });
    if (words[0]) broad.push(words[0]);
    if (joined) mid.push(joined);
    words.forEach(function (w) { mid.push(w + SUFFIX_MID[0]); });
    pool.mid.forEach(function (t) { mid.push(t); });
    words.forEach(function (w, i) { mid.push(w + SUFFIX_MID[(i + 1) % SUFFIX_MID.length]); });
    if (joined) SUFFIX_NICHE.forEach(function (s) { niche.push(joined + s); });
    pool.niche.forEach(function (t) { niche.push(t); });
    if (words.length > 1) niche.push(words.slice(0, 2).join("") + "ideas", words[words.length - 1] + "forbeginners");
    broad.slice(0, nBroad).forEach(function (t) { push(t, "broad"); });
    mid.slice(0, nMid).forEach(function (t) { push(t, "mid"); });
    niche.slice(0, nNiche).forEach(function (t) { push(t, "niche"); });
    var i = 0;
    while (out.length < count && i < mid.length + niche.length) { var pickT = i < mid.length ? mid[i] : niche[i - mid.length]; push(pickT, i < mid.length ? "mid" : "niche"); i++; }
    return { tags: out };
  }
  function hashtagsOut(res, fromAI) {
    var tags = res.tags || [];
    return {
      hero: { label: "Hashtag set", value: tags.length + " tags", note: tags.filter(function (t) { return t.size === "broad"; }).length + " broad for discovery, " + tags.filter(function (t) { return t.size === "mid"; }).length + " medium, " + tags.filter(function (t) { return t.size === "niche"; }).length + " niche where you can rank" },
      tags: tags,
      copy: tags.map(function (t) { return t.tag; }).join(" "),
      note: (fromAI ? "Written by AI for your topic. " : "Built from your topic and a curated pool for the niche. ") + "Orange tags are broad, blue medium, green niche. Rotate sets between posts.",
    };
  }

  var BIO_TEMPLATES = {
    friendly: [
      "{what} for {audience} 🙂\nHelping you look good online, minus the stress\n👇 {cta}",
      "Hi, I'm {name}. I make {what}.\nBuilt for {audience} who want it done right.\n{cta} ⬇️",
      "{what} | {audience}\nReal results, friendly process\n📩 {cta}",
      "Making {what} simple for {audience}\nTips every week, no jargon\n👉 {cta}",
      "{name} • {what}\nFor {audience} ready to grow\n{cta} 👇",
    ],
    professional: [
      "{what} for {audience}.\nStrategy first, design second.\n{cta}",
      "{name} | {what}\nTrusted by {audience}.\n{cta}",
      "Helping {audience} with {what}.\nClear process. Measurable results.\n{cta}",
      "{what}\nSpecialists serving {audience}\n{cta}",
      "{name}\n{what}, built for {audience}.\n{cta}",
    ],
    bold: [
      "{what} that actually converts.\nFor {audience} done with average.\n{cta} 👇",
      "Stop losing clients to a weak online presence.\n{what} for {audience}.\n{cta}",
      "{name}. {what}. No fluff.\nBuilt for {audience}.\n{cta}",
      "{audience}: your competitors are online. Are you?\n{what}\n{cta}",
      "Big results for {audience}.\n{what}\n{cta} ⬇️",
    ],
    playful: [
      "{what} ✨ for {audience} 🎯\nCoffee-fuelled, deadline-friendly ☕\n{cta} 👇",
      "Turning {audience} into online stars 🌟\n{what}\n{cta}",
      "{name} 👋 {what}\nSerious results, unserious energy\n{cta} ⬇️",
      "Making {what} fun for {audience} 🎉\nSwipe through the feed for proof\n{cta}",
      "{what} for {audience} • zero jargon 🙅\n{cta} 👇",
    ],
    minimal: [
      "{what}\n{audience}\n{cta}",
      "{name}\n{what} for {audience}\n{cta}",
      "{what} — {audience}\n{cta}",
      "{name} · {what}\n{cta}",
      "{what}\nfor {audience}\n↓ {cta}",
    ],
  };
  function fill(t, v) {
    return t.replace(/{(\w+)}/g, function (_, k) { return String(v[k] || "").trim(); }).replace(/[ \t]+\n/g, "\n").trim();
  }
  function bioLocal(v) {
    var list = BIO_TEMPLATES[v.tone] || BIO_TEMPLATES.friendly;
    var vals = { name: v.name || "", what: v.what || "", audience: v.audience || "", cta: v.cta || "Link below" };
    return { bios: list.map(function (t) { return fill(t, vals); }) };
  }
  function bioOut(res, fromAI) {
    var bios = res.bios || [];
    return {
      hero: { label: "Bio options", value: bios.length, note: "Instagram allows 150 characters. Counts are shown under each option." },
      list: bios.map(function (b) { return '<div class="copybox">' + esc(b) + '</div><small class="' + (b.length > 150 ? "bad" : "good") + '">' + b.length + " / 150 characters</small>"; }),
      note: fromAI ? "Written by AI from your inputs." : "Built from templates that follow the structure that converts: what, who for, personality, call to action.",
    };
  }

  var IDEA_PATTERNS = [
    ["{n} mistakes {a} make with {x}", "Most {a} get number 3 wrong.", "carousel"],
    ["Before and after: a {x} makeover", "Same {a}, very different result.", "reel"],
    ["{n} {x} myths, busted", "You have probably believed at least one.", "carousel"],
    ["A day behind the scenes of {x}", "Nobody shows you this part.", "reel"],
    ["The {x} checklist every {a} needs", "Save this before you start.", "carousel"],
    ["What {a} ask me most about {x}", "The same question, every single week.", "post"],
    ["{x} in 60 seconds", "Everything you need, nothing you do not.", "reel"],
    ["{n} tools I use for {x} (all free)", "Number 2 saves me hours.", "carousel"],
    ["The one {x} change that doubled results for a client", "It took 20 minutes.", "post"],
    ["Rate my {x}: send yours and I will review it", "First 10 get a reply.", "story"],
    ["This or that: {x} edition", "Vote in the poll.", "story"],
    ["What I would do differently if I started {x} today", "Skip the year I wasted.", "reel"],
    ["{n} signs your {x} is costing you clients", "If you nodded at two, read on.", "carousel"],
    ["Client story: how {x} changed things for a {a}", "From invisible to booked out.", "post"],
    ["{x} trends for {a} this year", "One of these is already fading.", "carousel"],
    ["Answering a hater about {x}", "Someone said this does not work. Here is why they are wrong.", "reel"],
    ["The {x} glossary for {a}", "Words your provider uses that nobody explains.", "carousel"],
    ["Quick win: fix this one {x} problem today", "Takes five minutes, works every time.", "reel"],
    ["My {x} process, step by step", "Steal it.", "carousel"],
    ["Ask me anything about {x}", "Question box is open until tonight.", "story"],
    ["Unpopular opinion about {x}", "Ready for the comments on this one.", "post"],
    ["How much does {x} cost? An honest breakdown", "Numbers most people hide.", "carousel"],
    ["{x} for {a} on a small budget", "Where to spend and where to save.", "post"],
    ["Things I wish {a} knew about {x}", "Would have saved them thousands.", "reel"],
    ["Screen record: fixing a real {x} problem live", "No script, no cuts.", "reel"],
    ["Poll: which {x} option would you pick?", "Results tomorrow.", "story"],
    ["The {x} red flags to look for before you hire anyone", "Number 4 is the expensive one.", "carousel"],
    ["Weekly {x} tip for {a}", "Small habit, big difference.", "post"],
    ["What {x} looked like 10 years ago vs now", "The change is wild.", "reel"],
    ["Reply to a comment: '{x} is a waste of money'", "Let me show you the maths.", "reel"],
  ];
  function pick(arr, n, seed) {
    var a = arr.slice(), out = [], s = seed || 1;
    while (out.length < n && a.length) { s = (s * 9301 + 49297) % 233280; out.push(a.splice(Math.floor((s / 233280) * a.length), 1)[0]); }
    return out;
  }
  function seedOf(str) {
    var h = 7; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000; return h + 1;
  }
  function ideasLocal(v) {
    var x = String(v.niche || "your niche").trim(), a = String(v.audience || "your audience").trim(), f = v.format || "mixed";
    var pool = f === "mixed" ? IDEA_PATTERNS : IDEA_PATTERNS.filter(function (p) { return p[2] === f; });
    if (pool.length < 12) pool = pool.concat(IDEA_PATTERNS.filter(function (p) { return p[2] !== f; }));
    var chosen = pick(pool, 12, seedOf(x + a + f));
    var nums = [3, 5, 7];
    return { ideas: chosen.map(function (p, i) {
      var n = nums[i % 3];
      var sub = function (s) { return s.replace(/{x}/g, x).replace(/{a}/g, a).replace(/{n}/g, n); };
      return { title: sub(p[0]), hook: sub(p[1]), format: f === "mixed" ? p[2] : f };
    }) };
  }
  function ideasOut(res, fromAI) {
    return { hero: { label: "Content ideas", value: (res.ideas || []).length }, ideas: res.ideas || [], note: fromAI ? "Written by AI for your niche and audience." : "Built from proven content patterns filled with your niche and audience. Run it again with a different format for more." };
  }

  function advisorLocal(v) {
    var f = num(v.followers), er = num(v.er), ppw = num(v.postsPerWeek), reels = num(v.reelsShare), spw = num(v.storiesPerWeek), goal = v.goal || "followers";
    var t = tier(IG_TIERS, f), acts = [];
    var add = function (p, title, why, metric) { acts.push({ p: p, title: title, why: why, metric: metric }); };
    if (reels < 40 && (goal === "followers" || goal === "brand")) add(90, "Move to at least 50% reels", "Reels reach non-followers. Only " + fmt(reels, 0) + "% of your posts are reels, and follower growth comes almost entirely from reach beyond your audience.", "Accounts reached, non-followers share");
    if (ppw < 3) add(85, "Post 3 to 5 times a week", "You post " + fmt(ppw, 1) + " times a week. Below 3, the algorithm has too little to distribute and your audience forgets you.", "Posts per week, reach per post");
    if (er < t.avg * 0.85) add(80, "Fix engagement before chasing reach", "Your " + pct(er, 1) + " engagement is below the " + pct(t.avg, 1) + " typical for " + t.name + ". Reach amplifies engagement, so low engagement gets less reach. End every caption with a question and reply to every comment within the hour.", "Engagement rate, comments per post");
    if (spw < 5) add(70, "Post stories daily", "Stories keep you in front of existing followers, which is where DMs and sales come from. You post " + fmt(spw, 0) + " a week. Aim for 1 to 3 a day with a poll or question box at least twice a week.", "Story views, replies, sticker taps");
    if (goal === "leads") add(88, "Add one lead post per week with a clear next step", "Followers do not become leads without being asked. One post a week should end with 'DM me X' or 'link in bio', and the bio link should go to one page, not a link tree.", "Profile visits, link taps, DMs");
    if (goal === "leads" || goal === "brand") add(60, "Turn your best comments and DMs into a 'proof' highlight", "Brands and clients check highlights before they message. Screenshots of results and kind words do the selling for you.", "Profile visits to DM ratio");
    if (goal === "brand" && f < 10000) add(75, "Build a one-page media kit now", "Brands work with accounts from about 3,000 followers if the engagement is strong. Put engagement rate, audience location and past collaborations in one PDF and pin a 'work with me' post.", "Inbound brand DMs");
    if (goal === "engagement") add(82, "Reply to every comment and spend 20 minutes a day commenting on niche accounts", "Engagement is a two-way habit. Accounts that comment on 10 to 20 niche posts a day see their own comments rise within weeks.", "Comments per post, saves");
    if (er >= t.avg * 1.25 && f < 10000) add(65, "Collaborate with 2 to 3 accounts your size each month", "Your engagement is above average, so collab posts will introduce you to audiences that respond. Use the Collab feature so the post appears on both profiles.", "Followers gained per collab");
    if (goal === "followers") add(55, "Pin your three best-performing posts", "New visitors decide in seconds. Pinned posts that show your best work convert profile visits into follows.", "Follows per profile visit");
    add(40, "Review insights every Sunday", "Note the top 3 posts by reach and saves, then make two more like each. Consistency in what works beats novelty.", "Reach and saves by post type");
    acts.sort(function (a, b) { return b.p - a.p; });
    return { actions: acts.slice(0, 5) };
  }
  function advisorOut(res, fromAI) {
    var acts = res.actions || [];
    return {
      hero: { label: "Priority actions", value: acts.length },
      ideas: acts.map(function (a, i) { return { title: (i + 1) + ". " + a.title, why: a.why + (a.metric ? " Watch: " + a.metric + "." : "") }; }),
      note: fromAI ? "Written by AI from your numbers." : "Built from rules that compare your numbers with what works for accounts of your size and goal.",
    };
  }

  var LOCAL = { hashtags: hashtagsLocal, bio: bioLocal, ideas: ideasLocal, advisor: advisorLocal };
  var OUT = { hashtags: hashtagsOut, bio: bioOut, ideas: ideasOut, advisor: advisorOut };
  ["instagram-hashtag-generator", "instagram-bio-generator", "instagram-content-ideas-generator", "instagram-growth-advisor"].forEach(function (slug) {
    COMPUTE[slug] = function (v, d) {
      var fromAI = !!(d && d.ok && d.result);
      var res = fromAI ? d.result : LOCAL[T.action](v);
      return OUT[T.action](res, fromAI);
    };
  });

  /* ----------------------------------------------------------- form plumbing */
  function values() {
    var v = {};
    Array.prototype.forEach.call(form.elements, function (el) { if (el.name) v[el.name] = el.value; });
    return v;
  }
  function validate() {
    var ok = true, first = null;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      el.classList.remove("invalid");
      var empty = String(el.value || "").trim() === "";
      var bad = el.required && empty;
      if (!bad && el.type === "number" && !empty) {
        var x = parseFloat(el.value);
        if (!isFinite(x) || (el.min !== "" && x < parseFloat(el.min)) || (el.max !== "" && x > parseFloat(el.max))) bad = true;
      }
      if (bad) { el.classList.add("invalid"); ok = false; first = first || el; }
    });
    if (first) first.focus();
    return ok;
  }
  function setStatus(msg) { statusEl.textContent = msg || ""; }

  function apiUrl(name) { return "../api/" + name; }

  function callApi(v) {
    if (T.api === "ai") {
      return fetch(apiUrl("ai"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: T.action, inputs: v }) })
        .then(function (r) { return r.json(); })
        .catch(function () { return { ok: false, code: "offline" }; });
    }
    var u = new URL(apiUrl(T.api), location.href);
    u.searchParams.set("action", T.action);
    Object.keys(v).forEach(function (k) { if (String(v[k]).trim() !== "") u.searchParams.set(k, v[k]); });
    return fetch(u).then(function (r) { return r.json(); }).catch(function () { return { ok: false, code: "offline", error: "Could not reach the server. Check your connection and try again." }; });
  }

  function apiErrorNote(d) {
    if (d.code === "no_key") return "The site owner has not added the " + (T.api === "twitch" ? "Twitch Client ID and Secret" : "YouTube API key") + " yet. See creator-tools/README.md for the two-minute setup.";
    if (d.code === "quota") return "The free daily quota resets at midnight Pacific time.";
    return "";
  }

  function run(e) {
    if (e) e.preventDefault();
    if (!validate()) { setStatus("Fill in the highlighted fields."); return; }
    setStatus("");
    var v = values();
    var compute = COMPUTE[T.slug];
    if (!compute) { render({ error: "This tool has no calculator yet." }); return; }
    if (!T.api) { try { render(compute(v, null)); } catch (err) { render({ error: "Could not calculate: " + err.message }); } return; }
    goBtn.disabled = true;
    setStatus(T.api === "ai" ? "Generating..." : "Fetching live data...");
    callApi(v).then(function (d) {
      goBtn.disabled = false;
      setStatus("");
      if (T.api === "ai") { render(compute(v, d)); return; }
      if (!d || !d.ok) { render({ error: (d && d.error) || "Something went wrong.", note: d ? apiErrorNote(d) : "" }); return; }
      try { render(compute(v, d)); } catch (err) { render({ error: "Could not read the data: " + err.message }); }
    });
  }

  window.__COMPUTE = COMPUTE; // exposed for tests
  form.addEventListener("submit", run);
  document.getElementById("reset").addEventListener("click", function () {
    form.reset();
    results.innerHTML = "";
    setStatus("");
    Array.prototype.forEach.call(form.elements, function (el) { el.classList.remove("invalid"); });
  });

  // Support links like ?channel=@handle that pre-fill and run.
  var qs = new URLSearchParams(location.search);
  var prefilled = false;
  qs.forEach(function (val, key) { var el = form.elements[key]; if (el) { el.value = val; prefilled = true; } });
  if (prefilled && qs.get("run") !== "0") run();
})();
