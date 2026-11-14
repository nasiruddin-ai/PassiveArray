/* Passive Array SEO web tools: SERP snippet preview, meta tag checker, schema markup generator. */
(function () {
  "use strict";
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function $(root, sel) { return root.querySelector(sel); }

  /* ================================================================ SERP snippet preview */
  var serp = document.querySelector('[data-seo="serp"]');
  if (serp) (function () {
    // Google measures in pixels. Desktop title 600 px at 20 px Arial; description 920 px desktop, 680 px mobile at 14 px Arial.
    var LIM = { title: 600, descDesktop: 920, descMobile: 680 };
    var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
    function width(text, size) { ctx.font = size + "px Arial"; return ctx.measureText(text).width; }
    function cut(text, size, max) {
      if (width(text, size) <= max) return { text: text, cut: false };
      var lo = 0, hi = text.length, ell = width(" ...", size);
      while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (width(text.slice(0, mid), size) + ell <= max) lo = mid; else hi = mid - 1; }
      var s = text.slice(0, lo), sp = s.lastIndexOf(" ");
      if (sp > lo * 0.6) s = s.slice(0, sp);
      return { text: s.replace(/[\s,.;:–-]+$/, "") + " ...", cut: true };
    }
    function bold(text, kw) {
      var h = esc(text);
      if (!kw) return h;
      var words = kw.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 2; });
      if (!words.length) return h;
      var re = new RegExp("\\b(" + words.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")\\b", "gi");
      return h.replace(re, "<b>$1</b>");
    }
    function crumb(url) {
      var u; try { u = new URL(/^https?:\/\//i.test(url) ? url : "https://" + (url || "example.com")); } catch (e) { u = new URL("https://example.com"); }
      var host = u.hostname.replace(/^www\./, "");
      var parts = u.pathname.split("/").filter(Boolean).map(decodeURIComponent);
      return { site: host.split(".")[0].replace(/^./, function (c) { return c.toUpperCase(); }), path: u.protocol + "//" + u.hostname + (parts.length ? " › " + parts.join(" › ") : "") };
    }
    function meter(el, w, max, chars, minChars) {
      var pct = Math.min(100, (w / max) * 100), cls = w > max ? "bad" : chars < minChars ? "warn" : "";
      el.className = "seo-meter " + cls;
      el.innerHTML = '<span>' + chars + " characters · " + Math.round(w) + " / " + max + " px</span><span class=\"bar\"><i style=\"width:" + pct + '%"></i></span>';
    }
    function render() {
      var url = serp.elements.url.value.trim(), title = serp.elements.title.value.trim(), desc = serp.elements.desc.value.trim(), kw = serp.elements.kw.value.trim();
      var c = crumb(url);
      var tCut = cut(title || "Your page title appears here", 20, LIM.title);
      var dD = cut(desc || "Your meta description appears here. Write one or two sentences that tell searchers what they get and why to click.", 14, LIM.descDesktop);
      var dM = cut(desc || "Your meta description appears here.", 14, LIM.descMobile);
      var tpl = function (d, mobile) {
        return '<div class="crumb"><span class="fav">' + esc(c.site.charAt(0)) + '</span><div><div class="site">' + esc(c.site) + '</div><div class="path">' + esc(c.path) + '</div></div></div><div class="t">' + esc(mobile ? title || "Your page title appears here" : tCut.text) + '</div><div class="d">' + bold(d.text, kw) + "</div>";
      };
      $(document, '[data-serp="desktop"]').innerHTML = tpl(dD, false);
      // Mobile titles wrap onto a second line instead of being cut as early, so show them whole up to the pixel limit.
      $(document, '[data-serp="mobile"]').innerHTML = tpl(dM, true).replace(esc(title || "Your page title appears here"), esc(cut(title || "Your page title appears here", 18, 690).text));
      var tw = width(title, 20), dw = width(desc, 14);
      meter($(serp, '[data-meter="title"]'), tw, LIM.title, title.length, 30);
      meter($(serp, '[data-meter="desc"]'), dw, LIM.descDesktop, desc.length, 70);
      var checks = [];
      var add = function (s, t) { checks.push('<li class="' + s + '"><i></i><span>' + t + "</span></li>"); };
      if (!title) add("fail", "No title yet. Every page needs a unique title.");
      else if (title.length < 30) add("warn", "Title is short. Use the space to add the main keyword or a benefit.");
      else if (tw > LIM.title) add("fail", "Title is " + Math.round(tw) + " px wide, so Google cuts it at about " + LIM.title + " px. Move the important words to the front.");
      else add("pass", "Title fits on desktop (" + Math.round(tw) + " of " + LIM.title + " px).");
      if (!desc) add("warn", "No meta description. Google will pick text from the page instead.");
      else if (desc.length < 70) add("warn", "Description is short. Aim for about 120 to 160 characters.");
      else if (dw > LIM.descDesktop) add("warn", "Description is cut on desktop. Keep the key point in the first 120 characters.");
      else if (dw > LIM.descMobile) add("info", "Description fits on desktop but is cut on mobile after about " + LIM.descMobile + " px.");
      else add("pass", "Description fits on desktop and mobile.");
      if (kw) {
        var k = kw.toLowerCase();
        add(title.toLowerCase().indexOf(k) >= 0 ? "pass" : "warn", title.toLowerCase().indexOf(k) >= 0 ? "Focus keyword is in the title" + (title.toLowerCase().indexOf(k) < 20 ? ", near the start." : ". Moving it nearer the start can help.") : "Focus keyword is not in the title.");
        add(desc.toLowerCase().indexOf(k) >= 0 ? "pass" : "warn", desc.toLowerCase().indexOf(k) >= 0 ? "Focus keyword is in the description, so Google can bold it." : "Focus keyword is not in the description.");
      }
      if (title && desc && title.toLowerCase() === desc.toLowerCase()) add("warn", "Title and description are identical. Make the description add something.");
      add("info", "Google rewrites many titles and descriptions. A clear, accurate one is the most likely to be kept.");
      $(document, "[data-checks]").innerHTML = checks.join("");
    }
    serp.addEventListener("input", render);
    $(serp, "[data-fetch]").addEventListener("click", function () {
      var msg = $(serp, "[data-msg]"), url = serp.elements.url.value.trim();
      if (!url) { msg.textContent = "Type a URL first."; msg.className = "fmsg bad"; return; }
      msg.textContent = "Fetching the live title and description…"; msg.className = "fmsg";
      fetch("/api/meta?url=" + encodeURIComponent(url)).then(function (r) { return r.json(); }).catch(function () { return { ok: false, error: "Could not reach the server." }; }).then(function (d) {
        if (!d.ok || !d.page) { msg.textContent = d.error || "Could not read that page."; msg.className = "fmsg bad"; return; }
        serp.elements.title.value = d.page.title || ""; serp.elements.desc.value = d.page.description || ""; serp.elements.url.value = d.url;
        msg.textContent = "Loaded from the live page. Edit to test new versions."; msg.className = "fmsg good"; render();
      });
    });
    var q = new URLSearchParams(location.search);
    ["url", "title", "desc", "kw"].forEach(function (k) { if (q.get(k)) serp.elements[k].value = q.get(k); });
    render();
  })();

  /* ================================================================ Meta tag checker */
  var meta = document.querySelector('[data-seo="meta"]');
  if (meta) (function () {
    var out = document.querySelector("[data-result]");
    function run(e) {
      if (e) e.preventDefault();
      var url = meta.elements.url.value.trim(), msg = $(meta, "[data-msg]");
      if (!url) { msg.textContent = "Paste a page URL."; msg.className = "fmsg bad"; return; }
      msg.textContent = "Fetching the page…"; msg.className = "fmsg"; out.innerHTML = "";
      try { var u = new URL(location.href); u.searchParams.set("url", url); history.replaceState(null, "", u.toString()); } catch (x) {}
      fetch("/api/meta?url=" + encodeURIComponent(url)).then(function (r) { return r.json(); }).catch(function () { return { ok: false, error: "Could not reach the server." }; }).then(function (d) {
        if (!d.ok) { msg.textContent = d.error || "Could not check that page."; msg.className = "fmsg bad"; return; }
        if (d.notHtml) { msg.textContent = d.error; msg.className = "fmsg bad"; return; }
        msg.textContent = ""; var c = d.checks;
        var count = function (s) { return c.filter(function (x) { return x.status === s; }).length; };
        var groups = [];
        c.forEach(function (x) { if (groups.indexOf(x.group) < 0) groups.push(x.group); });
        var chain = d.chain.length > 1 ? '<p class="mt-chain">Redirects: ' + d.chain.map(function (h) { return esc(h.status + " " + h.url); }).join(" → ") + "</p>" : "";
        out.innerHTML = '<section class="card"><div class="seo-head-row"><h2 class="seo-h">' + esc(d.url) + '</h2><div class="seo-actions"><a class="btn ghost" href="../serp-snippet-preview/?url=' + encodeURIComponent(d.url) + "&title=" + encodeURIComponent(d.page.title || "") + "&desc=" + encodeURIComponent(d.page.description || "") + '">Preview in Google</a></div></div>' + chain +
          '<div class="mt-summary"><span class="pass">' + count("pass") + ' passed</span><span class="warn">' + count("warn") + ' warnings</span><span class="fail">' + count("fail") + " failed</span></div>" +
          groups.map(function (g) {
            return '<div class="mt-group"><h3>' + esc(g) + "</h3>" + c.filter(function (x) { return x.group === g; }).map(function (x) {
              return '<div class="mt-row ' + x.status + '"><i></i><b class="n">' + esc(x.name) + '</b><div class="v">' + esc(x.value) + (x.fix ? '<div class="fix">' + esc(x.fix) + "</div>" : "") + "</div></div>";
            }).join("") + "</div>";
          }).join("") + '<p class="note">Read from the HTML the server returned in ' + d.ms + " ms. Content added by JavaScript after the page loads is not seen here.</p></section>";
      });
    }
    meta.addEventListener("submit", run);
    var q = new URLSearchParams(location.search).get("url");
    if (q) { meta.elements.url.value = q; run(); }
  })();

  /* ================================================================ Schema markup generator */
  var sg = document.querySelector('[data-seo="schema"]');
  if (sg) (function () {
    var F = function (id, label, opts) { return Object.assign({ id: id, label: label }, opts || {}); };
    var TYPES = {
      FAQPage: { fields: [], repeat: { key: "faq", label: "Question", min: 1, fields: [F("q", "Question", { req: true, full: true }), F("a", "Answer", { req: true, full: true, area: true })] } },
      LocalBusiness: { fields: [F("name", "Business name", { req: true }), F("subtype", "Business type", { ph: "LocalBusiness, Dentist, Restaurant, Plumber…" }), F("url", "Website URL"), F("telephone", "Phone"), F("image", "Image or logo URL", { req: true }), F("priceRange", "Price range", { ph: "$$" }), F("street", "Street address", { req: true, full: true }), F("city", "City", { req: true }), F("region", "Region or state"), F("postal", "Postcode"), F("country", "Country code", { ph: "BD, US, GB…" }), F("hours", "Opening hours", { ph: "Mo-Fr 09:00-18:00", full: true }), F("lat", "Latitude (optional)"), F("lng", "Longitude (optional)")] },
      Article: { fields: [F("headline", "Headline", { req: true, full: true }), F("author", "Author name", { req: true }), F("authorUrl", "Author page URL"), F("datePublished", "Date published", { req: true, ph: "2026-10-11" }), F("dateModified", "Date modified", { ph: "2026-10-11" }), F("image", "Image URL", { req: true, full: true }), F("publisher", "Publisher name"), F("publisherLogo", "Publisher logo URL"), F("url", "Article URL", { full: true })] },
      Product: { fields: [F("name", "Product name", { req: true }), F("brand", "Brand"), F("image", "Image URL", { req: true, full: true }), F("description", "Description", { full: true, area: true }), F("sku", "SKU"), F("price", "Price", { req: true, ph: "29.99" }), F("currency", "Currency", { req: true, ph: "USD" }), F("availability", "Availability", { select: ["InStock", "OutOfStock", "PreOrder", "BackOrder", "LimitedAvailability"] }), F("url", "Product page URL"), F("rating", "Average rating (optional)", { ph: "4.6" }), F("reviews", "Number of reviews (optional)", { ph: "128" })] },
      Organization: { fields: [F("name", "Organization name", { req: true }), F("url", "Website URL", { req: true }), F("logo", "Logo URL", { full: true }), F("email", "Email"), F("telephone", "Phone"), F("sameAs", "Profiles, one per line", { full: true, area: true, ph: "https://www.linkedin.com/company/…\nhttps://www.facebook.com/…" })] },
      Person: { fields: [F("name", "Full name", { req: true }), F("jobTitle", "Job title"), F("url", "Website or profile page"), F("image", "Photo URL"), F("worksFor", "Works for (organization)"), F("sameAs", "Profiles, one per line", { full: true, area: true, ph: "https://www.linkedin.com/in/…" })] },
      BreadcrumbList: { fields: [], repeat: { key: "crumbs", label: "Breadcrumb", min: 2, fields: [F("name", "Name", { req: true }), F("item", "URL", { req: true })] } },
    };
    var typeSel = $(sg, "[data-type]"), box = $(sg, "[data-fields]"), outEl = document.querySelector("[data-out]"), missEl = $(sg, "[data-missing]");
    var state = {};
    function fieldHtml(f, val, prefix) {
      var id = (prefix || "sg") + "-" + f.id, cls = (f.full ? "full" : "");
      var input = f.select ? "<select id=\"" + id + "\" data-f=\"" + f.id + "\">" + f.select.map(function (o) { return "<option" + (o === val ? " selected" : "") + ">" + o + "</option>"; }).join("") + "</select>"
        : f.area ? "<textarea id=\"" + id + "\" data-f=\"" + f.id + "\" rows=\"3\" placeholder=\"" + esc(f.ph || "") + "\">" + esc(val || "") + "</textarea>"
        : "<input id=\"" + id + "\" data-f=\"" + f.id + "\" type=\"text\" value=\"" + esc(val || "") + "\" placeholder=\"" + esc(f.ph || "") + "\" autocomplete=\"off\">";
      return "<div class=\"" + cls + "\"><label for=\"" + id + "\" class=\"" + (f.req ? "req" : "") + "\">" + esc(f.label) + "</label>" + input + "</div>";
    }
    function draw() {
      var t = TYPES[typeSel.value], s = state[typeSel.value] = state[typeSel.value] || { v: {}, rows: [] };
      if (t.repeat && s.rows.length < t.repeat.min) while (s.rows.length < t.repeat.min) s.rows.push({});
      var h = t.fields.map(function (f) { return fieldHtml(f, s.v[f.id]); }).join("");
      if (t.repeat) {
        h += s.rows.map(function (row, i) {
          return "<div class=\"sg-rep\" data-row=\"" + i + "\"><b>" + t.repeat.label + " " + (i + 1) + "</b>" + (s.rows.length > t.repeat.min ? "<button type=\"button\" class=\"rm\" data-rm=\"" + i + "\">Remove</button>" : "") + t.repeat.fields.map(function (f) { return fieldHtml(f, row[f.id], "sg" + i); }).join("") + "</div>";
        }).join("") + "<div class=\"full\"><button type=\"button\" class=\"btn ghost sg-add\" data-add>Add " + t.repeat.label.toLowerCase() + "</button></div>";
      }
      box.innerHTML = h;
      gen();
    }
    function collect() {
      var s = state[typeSel.value];
      box.querySelectorAll("[data-f]").forEach(function (el) {
        var row = el.closest("[data-row]");
        if (row) s.rows[+row.getAttribute("data-row")][el.getAttribute("data-f")] = el.value.trim();
        else s.v[el.getAttribute("data-f")] = el.value.trim();
      });
      return s;
    }
    function lines(v) { return String(v || "").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean); }
    function clean(o) { Object.keys(o).forEach(function (k) { if (o[k] === "" || o[k] == null || (Array.isArray(o[k]) && !o[k].length)) delete o[k]; else if (typeof o[k] === "object" && !Array.isArray(o[k])) { clean(o[k]); if (Object.keys(o[k]).length <= 1 && o[k]["@type"]) delete o[k]; } }); return o; }
    function gen() {
      var type = typeSel.value, t = TYPES[type], s = collect(), v = s.v, o;
      var missing = t.fields.filter(function (f) { return f.req && !v[f.id]; }).map(function (f) { return f.label; });
      if (t.repeat) s.rows.forEach(function (r, i) { t.repeat.fields.forEach(function (f) { if (f.req && !r[f.id]) missing.push(t.repeat.label + " " + (i + 1) + ": " + f.label); }); });
      if (type === "FAQPage") o = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.rows.filter(function (r) { return r.q; }).map(function (r) { return { "@type": "Question", name: r.q, acceptedAnswer: { "@type": "Answer", text: r.a || "" } }; }) };
      else if (type === "BreadcrumbList") o = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: s.rows.filter(function (r) { return r.name; }).map(function (r, i) { return { "@type": "ListItem", position: i + 1, name: r.name, item: r.item || "" }; }) };
      else if (type === "LocalBusiness") o = { "@context": "https://schema.org", "@type": v.subtype || "LocalBusiness", name: v.name, image: v.image, url: v.url, telephone: v.telephone, priceRange: v.priceRange,
        address: { "@type": "PostalAddress", streetAddress: v.street, addressLocality: v.city, addressRegion: v.region, postalCode: v.postal, addressCountry: v.country },
        geo: v.lat && v.lng ? { "@type": "GeoCoordinates", latitude: v.lat, longitude: v.lng } : "", openingHours: v.hours ? lines(v.hours.replace(/,\s*/g, "\n")) : "" };
      else if (type === "Article") o = { "@context": "https://schema.org", "@type": "Article", headline: v.headline, image: v.image ? [v.image] : "", datePublished: v.datePublished, dateModified: v.dateModified || v.datePublished,
        author: { "@type": "Person", name: v.author, url: v.authorUrl }, publisher: v.publisher ? { "@type": "Organization", name: v.publisher, logo: v.publisherLogo ? { "@type": "ImageObject", url: v.publisherLogo } : "" } : "", mainEntityOfPage: v.url };
      else if (type === "Product") {
        o = { "@context": "https://schema.org", "@type": "Product", name: v.name, image: v.image ? [v.image] : "", description: v.description, sku: v.sku, brand: v.brand ? { "@type": "Brand", name: v.brand } : "",
          offers: { "@type": "Offer", url: v.url, price: v.price, priceCurrency: v.currency, availability: "https://schema.org/" + (v.availability || "InStock") } };
        if (v.rating && v.reviews) o.aggregateRating = { "@type": "AggregateRating", ratingValue: v.rating, reviewCount: v.reviews };
      } else if (type === "Organization") o = { "@context": "https://schema.org", "@type": "Organization", name: v.name, url: v.url, logo: v.logo, email: v.email, telephone: v.telephone, sameAs: lines(v.sameAs) };
      else if (type === "Person") o = { "@context": "https://schema.org", "@type": "Person", name: v.name, jobTitle: v.jobTitle, url: v.url, image: v.image, worksFor: v.worksFor ? { "@type": "Organization", name: v.worksFor } : "", sameAs: lines(v.sameAs) };
      clean(o);
      outEl.textContent = '<script type="application/ld+json">\n' + JSON.stringify(o, null, 2) + "\n</script>";
      var notes = [];
      if (missing.length) notes.push("Required for rich results: " + missing.join(", ") + ".");
      if (type === "Product" && v.rating) notes.push("Only add a rating if real reviews are shown on the page.");
      if (type === "FAQPage") notes.push("Google shows FAQ rich results mainly for authoritative government and health sites; the markup is still valid.");
      missEl.textContent = notes.join(" ");
      missEl.className = "fmsg" + (missing.length ? " bad" : "");
    }
    typeSel.addEventListener("change", draw);
    box.addEventListener("input", gen);
    box.addEventListener("click", function (e) {
      var s = state[typeSel.value];
      if (e.target.closest("[data-add]")) { collect(); s.rows.push({}); draw(); }
      var rm = e.target.closest("[data-rm]");
      if (rm) { collect(); s.rows.splice(+rm.getAttribute("data-rm"), 1); draw(); }
    });
    document.querySelector("[data-copy]").addEventListener("click", function (e) {
      var b = e.currentTarget;
      navigator.clipboard.writeText(outEl.textContent).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy code"; }, 1500); });
    });
    var q = new URLSearchParams(location.search).get("type");
    if (q && TYPES[q]) typeSel.value = q;
    draw();
  })();

  /* ================================================================ Robots.txt generator & tester */
  var rt = document.querySelector('[data-seo="robots"]');
  if (rt) (function () {
    var PRESETS = {
      standard: { blocks: [{ ua: "*", allow: "/\n", disallow: "/api/\n/admin/\n/private/", delay: "" }], sitemaps: "https://example.com/sitemap.xml" },
      wordpress: { blocks: [{ ua: "*", allow: "/wp-admin/admin-ajax.php", disallow: "/wp-admin/\n/wp-includes/\n/?s=\n/search/", delay: "" }], sitemaps: "https://example.com/sitemap_index.xml" },
      nextjs: { blocks: [{ ua: "*", allow: "/", disallow: "/api/\n/_next/static/", delay: "" }], sitemaps: "https://example.com/sitemap.xml" },
      shopify: { blocks: [{ ua: "*", allow: "/", disallow: "/admin\n/cart\n/orders\n/checkout\n/account\n/*?*oseid=", delay: "" }], sitemaps: "https://example.com/sitemap.xml" },
      "block-ai": {
        blocks: [
          { ua: "*", allow: "/", disallow: "/admin/\n/api/", delay: "" },
          { ua: "GPTBot", allow: "", disallow: "/", delay: "" },
          { ua: "CCBot", allow: "", disallow: "/", delay: "" },
          { ua: "ClaudeBot", allow: "", disallow: "/", delay: "" },
          { ua: "Google-Extended", allow: "", disallow: "/", delay: "" }
        ],
        sitemaps: "https://example.com/sitemap.xml"
      }
    };
    var blocksEl = $(rt, "[data-blocks]"), smEl = $(rt, "[data-sitemaps]"), outEl = document.querySelector("[data-out]");
    var testPathEl = document.querySelector("[data-test-path]"), testUaEl = document.querySelector("[data-test-ua]"), testResEl = document.querySelector("[data-test-result]");
    var state = JSON.parse(JSON.stringify(PRESETS.wordpress));

    function lines(v) { return String(v || "").split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean); }
    function drawBlocks() {
      blocksEl.innerHTML = state.blocks.map(function (b, i) {
        return '<div class="sg-rep" data-rblock="' + i + '"><b>Rule block ' + (i + 1) + '</b>' +
          (state.blocks.length > 1 ? '<button type="button" class="rm" data-rm-block="' + i + '">Remove</button>' : "") +
          '<div class="sg-fields">' +
          '<div><label>User-agent</label><input type="text" data-rf="ua" value="' + esc(b.ua) + '" placeholder="* or Googlebot"></div>' +
          '<div><label>Crawl-delay (optional, seconds)</label><input type="text" data-rf="delay" value="' + esc(b.delay) + '" placeholder="e.g. 5"></div>' +
          '<div><label>Disallow paths (one per line)</label><textarea rows="3" data-rf="disallow" placeholder="/admin/">' + esc(b.disallow) + '</textarea></div>' +
          '<div><label>Allow paths (one per line)</label><textarea rows="3" data-rf="allow" placeholder="/">' + esc(b.allow) + '</textarea></div>' +
          '</div></div>';
      }).join("");
      smEl.value = state.sitemaps;
      render();
    }
    function syncState() {
      blocksEl.querySelectorAll("[data-rblock]").forEach(function (el) {
        var idx = +el.getAttribute("data-rblock");
        state.blocks[idx] = {
          ua: el.querySelector('[data-rf="ua"]').value.trim() || "*",
          delay: el.querySelector('[data-rf="delay"]').value.trim(),
          disallow: el.querySelector('[data-rf="disallow"]').value,
          allow: el.querySelector('[data-rf="allow"]').value,
        };
      });
      state.sitemaps = smEl.value;
    }
    function matchRule(pattern, path) {
      if (!pattern) return false;
      var rxStr = "^" + pattern.replace(/[.+?^{}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$");
      try { return new RegExp(rxStr).test(path); } catch (e) { return path.indexOf(pattern) === 0; }
    }
    function testUrl() {
      var raw = testPathEl.value.trim() || "/";
      var ua = (testUaEl.value.trim() || "*").toLowerCase();
      var path = raw;
      if (/^https?:\/\//i.test(raw)) {
        try { var u = new URL(raw); path = u.pathname + u.search; } catch (e) {}
      } else if (path.charAt(0) !== "/") path = "/" + path;

      var specific = state.blocks.filter(function (b) { var bua = (b.ua || "*").toLowerCase(); return bua !== "*" && ua.indexOf(bua) >= 0; });
      var matchedBlocks = specific.length ? specific : state.blocks.filter(function (b) { return (b.ua || "*") === "*"; });
      if (!matchedBlocks.length) {
        testResEl.innerHTML = '<span class="seo-badge ok">Allowed</span><span>No matching User-agent block found for <code>' + esc(testUaEl.value || "*") + '</code>; default is Allow.</span>';
        return;
      }
      var best = null;
      matchedBlocks.forEach(function (b) {
        lines(b.allow).forEach(function (p) {
          if (matchRule(p, path)) {
            if (!best || p.length > best.len || (p.length === best.len && best.type === "Disallow")) best = { type: "Allow", pat: p, ua: b.ua, len: p.length };
          }
        });
        lines(b.disallow).forEach(function (p) {
          if (matchRule(p, path)) {
            if (!best || p.length > best.len) best = { type: "Disallow", pat: p, ua: b.ua, len: p.length };
          }
        });
      });
      if (!best || best.type === "Allow") {
        testResEl.innerHTML = '<span class="seo-badge ok">Allowed</span><span><code>' + esc(path) + '</code> is crawlable' + (best ? ' (matched <code>Allow: ' + esc(best.pat) + '</code> in <code>User-agent: ' + esc(best.ua) + '</code>)' : ' (no Disallow rule matched)') + '.</span>';
      } else {
        testResEl.innerHTML = '<span class="seo-badge bad">Blocked</span><span><code>' + esc(path) + '</code> is blocked by <code>Disallow: ' + esc(best.pat) + '</code> under <code>User-agent: ' + esc(best.ua) + '</code>.</span>';
      }
    }
    function render() {
      syncState();
      var out = state.blocks.map(function (b) {
        var rows = ["User-agent: " + (b.ua || "*")];
        lines(b.allow).forEach(function (p) { rows.push("Allow: " + p); });
        var dis = lines(b.disallow);
        if (dis.length) dis.forEach(function (p) { rows.push("Disallow: " + p); });
        else if (!lines(b.allow).length) rows.push("Disallow:");
        if (b.delay && /^\d+$/.test(b.delay)) rows.push("Crawl-delay: " + b.delay);
        return rows.join("\n");
      }).join("\n\n");
      var sms = lines(state.sitemaps);
      if (sms.length) out += "\n\n" + sms.map(function (s) { return "Sitemap: " + s; }).join("\n");
      outEl.textContent = out + "\n";
      testUrl();
    }
    rt.addEventListener("input", render);
    testPathEl.addEventListener("input", testUrl);
    testUaEl.addEventListener("input", testUrl);
    rt.addEventListener("click", function (e) {
      var p = e.target.closest("[data-preset]");
      if (p) {
        rt.querySelectorAll("[data-preset]").forEach(function (x) { x.classList.remove("active"); });
        p.classList.add("active");
        state = JSON.parse(JSON.stringify(PRESETS[p.getAttribute("data-preset")]));
        drawBlocks();
      }
      if (e.target.closest("[data-add-block]")) {
        syncState();
        state.blocks.push({ ua: "Googlebot", allow: "", disallow: "", delay: "" });
        drawBlocks();
      }
      var rm = e.target.closest("[data-rm-block]");
      if (rm) {
        syncState();
        state.blocks.splice(+rm.getAttribute("data-rm-block"), 1);
        drawBlocks();
      }
    });
    document.querySelector("[data-copy]").addEventListener("click", function (e) {
      var b = e.currentTarget;
      navigator.clipboard.writeText(outEl.textContent).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy code"; }, 1500); });
    });
    document.querySelector("[data-download]").addEventListener("click", function () {
      var blob = new Blob([outEl.textContent], { type: "text/plain" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "robots.txt"; a.click(); URL.revokeObjectURL(a.href);
    });
    drawBlocks();
  })();

  /* ================================================================ XML sitemap generator & validator */
  var sm = document.querySelector('[data-seo="sitemap"]');
  if (sm) (function () {
    var urlsEl = $(sm, "[data-urls]"), modEl = $(sm, "[data-lastmod]"), freqEl = $(sm, "[data-freq]"), prioEl = $(sm, "[data-prio]");
    var statsEl = $(sm, "[data-stats]"), checksEl = document.querySelector("[data-checks]"), outEl = document.querySelector("[data-out]");
    function xmlEsc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
    function parseLines() {
      return urlsEl.value.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    }
    function render() {
      var raw = parseLines(), seen = {}, valid = [], invalid = [], dupes = 0, hosts = {};
      raw.forEach(function (u) {
        try {
          var parsed = new URL(u);
          if (!/^https?:$/i.test(parsed.protocol)) { invalid.push(u); return; }
          hosts[parsed.hostname] = true;
          if (seen[parsed.href]) { dupes++; return; }
          seen[parsed.href] = true;
          valid.push(parsed);
        } catch (e) { invalid.push(u); }
      });
      var today = new Date().toISOString().slice(0, 10);
      var mod = modEl.value, freq = freqEl.value, prio = prioEl.value;
      var xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
      valid.forEach(function (u) {
        xml.push("  <url>");
        xml.push("    <loc>" + xmlEsc(u.href) + "</loc>");
        if (mod === "today") xml.push("    <lastmod>" + today + "</lastmod>");
        if (freq !== "none") xml.push("    <changefreq>" + freq + "</changefreq>");
        if (prio !== "none") xml.push("    <priority>" + (prio === "auto" ? (u.pathname === "/" || u.pathname === "" ? "1.0" : "0.8") : prio) + "</priority>");
        xml.push("  </url>");
      });
      xml.push("</urlset>");
      var text = xml.join("\n") + "\n";
      outEl.textContent = text;
      var kb = (new Blob([text]).size / 1024).toFixed(1);
      statsEl.innerHTML = '<div class="seo-stat"><b>' + valid.length + '</b><span>Valid URLs</span></div>' +
        '<div class="seo-stat"><b>' + dupes + '</b><span>Duplicates skipped</span></div>' +
        '<div class="seo-stat"><b>' + invalid.length + '</b><span>Invalid URLs</span></div>' +
        '<div class="seo-stat"><b>' + kb + ' KB</b><span>XML file size</span></div>';
      var checks = [];
      var add = function (s, t) { checks.push('<li class="' + s + '"><i></i><span>' + t + "</span></li>"); };
      if (!valid.length) add("fail", "Add at least one valid https:// URL.");
      else add("pass", valid.length + " valid URL" + (valid.length === 1 ? "" : "s") + " included.");
      if (invalid.length) add("fail", invalid.length + " invalid URL(s) ignored (must start with https:// or http://): " + esc(invalid.slice(0, 3).join(", ")));
      if (dupes) add("warn", dupes + " duplicate URL(s) removed automatically from the XML.");
      if (Object.keys(hosts).length > 1) add("warn", "Multiple hostnames detected (" + esc(Object.keys(hosts).join(", ")) + "). A single sitemap should only contain URLs from one domain.");
      if (valid.some(function (u) { return u.protocol === "http:"; })) add("warn", "Some URLs use http:// instead of https://.");
      if (valid.length > 50000) add("fail", "Sitemaps are capped at 50,000 URLs. Split into multiple files with a sitemap index.");
      checksEl.innerHTML = checks.join("");
    }
    sm.addEventListener("input", render);
    sm.addEventListener("change", render);
    $(sm, "[data-dedupe]").addEventListener("click", function () {
      var seen = {}, clean = [];
      parseLines().forEach(function (u) { if (!seen[u]) { seen[u] = true; clean.push(u); } });
      clean.sort();
      urlsEl.value = clean.join("\n");
      render();
    });
    document.querySelector("[data-copy]").addEventListener("click", function (e) {
      var b = e.currentTarget;
      navigator.clipboard.writeText(outEl.textContent).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy XML"; }, 1500); });
    });
    document.querySelector("[data-download]").addEventListener("click", function () {
      var blob = new Blob([outEl.textContent], { type: "application/xml" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "sitemap.xml"; a.click(); URL.revokeObjectURL(a.href);
    });
    render();
  })();

  /* ================================================================ Hreflang & canonical generator */
  var hl = document.querySelector('[data-seo="hreflang"]');
  if (hl) (function () {
    var LANGS = [
      ["x-default", "x-default (Fallback / Global)"],
      ["en", "en (English)"], ["en-US", "en-US (English - US)"], ["en-GB", "en-GB (English - UK)"],
      ["es", "es (Spanish)"], ["es-MX", "es-MX (Spanish - Mexico)"], ["fr", "fr (French)"],
      ["de", "de (German)"], ["pt", "pt (Portuguese)"], ["pt-BR", "pt-BR (Portuguese - Brazil)"],
      ["ar", "ar (Arabic)"], ["hi", "hi (Hindi)"], ["bn", "bn (Bengali)"],
      ["ja", "ja (Japanese)"], ["ko", "ko (Korean)"], ["zh-Hans", "zh-Hans (Chinese Simplified)"],
      ["it", "it (Italian)"], ["nl", "nl (Dutch)"], ["tr", "tr (Turkish)"], ["id", "id (Indonesian)"]
    ];
    var rowsEl = $(hl, "[data-hl-rows]"), canonEl = $(hl, "[data-canon]"), outEl = document.querySelector("[data-out]"), checksEl = document.querySelector("[data-checks]");
    var fmt = "html";
    var rows = [
      { lang: "x-default", url: "https://example.com/" },
      { lang: "en", url: "https://example.com/en/" },
      { lang: "es", url: "https://example.com/es/" }
    ];
    function draw() {
      rowsEl.innerHTML = rows.map(function (r, i) {
        var opts = LANGS.map(function (l) { return '<option value="' + l[0] + '"' + (r.lang === l[0] ? " selected" : "") + ">" + esc(l[1]) + "</option>"; }).join("");
        return '<div class="sg-rep" data-hrow="' + i + '"><b>Version ' + (i + 1) + '</b>' +
          (rows.length > 1 ? '<button type="button" class="rm" data-rm-hl="' + i + '">Remove</button>' : "") +
          '<div class="sg-fields"><div><label>Language / Region</label><select data-hf="lang">' + opts + '</select></div>' +
          '<div><label>Page URL</label><input type="text" data-hf="url" value="' + esc(r.url) + '" placeholder="https://example.com/es/"></div></div></div>';
      }).join("");
      render();
    }
    function sync() {
      rowsEl.querySelectorAll("[data-hrow]").forEach(function (el) {
        var idx = +el.getAttribute("data-hrow");
        rows[idx] = {
          lang: el.querySelector('[data-hf="lang"]').value,
          url: el.querySelector('[data-hf="url"]').value.trim()
        };
      });
    }
    function render() {
      sync();
      var validRows = rows.filter(function (r) { return r.url; });
      var canon = canonEl.value.trim();
      var lines = [];
      if (fmt === "html") {
        if (canon) lines.push('<link rel="canonical" href="' + esc(canon) + '" />');
        validRows.forEach(function (r) {
          lines.push('<link rel="alternate" hreflang="' + esc(r.lang) + '" href="' + esc(r.url) + '" />');
        });
      } else {
        lines.push("<url>");
        lines.push("  <loc>" + esc(canon || (validRows[0] && validRows[0].url) || "https://example.com/") + "</loc>");
        validRows.forEach(function (r) {
          lines.push('  <xhtml:link rel="alternate" hreflang="' + esc(r.lang) + '" href="' + esc(r.url) + '" />');
        });
        lines.push("</url>");
      }
      outEl.textContent = lines.join("\n");
      var checks = [], seenLang = {}, hasXdef = false, badUrl = 0;
      var add = function (s, t) { checks.push('<li class="' + s + '"><i></i><span>' + t + "</span></li>"); };
      validRows.forEach(function (r) {
        if (r.lang === "x-default") hasXdef = true;
        seenLang[r.lang] = (seenLang[r.lang] || 0) + 1;
        if (!/^https?:\/\//i.test(r.url)) badUrl++;
      });
      if (!validRows.length) add("fail", "Add at least one language URL.");
      else add("pass", validRows.length + " hreflang alternate tag(s) generated.");
      if (!hasXdef) add("warn", "No x-default fallback tag set. Google recommends x-default for unmatched languages/regions.");
      else add("pass", "x-default fallback tag is included.");
      if (Object.keys(seenLang).some(function (k) { return seenLang[k] > 1; })) add("fail", "Duplicate hreflang code detected. Each language/region code should appear only once per page.");
      if (badUrl) add("fail", badUrl + " URL(s) missing https:// or http://. Hreflang URLs must be absolute.");
      if (canon && validRows.length && !validRows.some(function (r) { return r.url === canon; })) add("warn", "Canonical URL does not match any of the hreflang URLs above. Make sure the canonical is self-referencing.");
      checksEl.innerHTML = checks.join("");
    }
    hl.addEventListener("input", render);
    hl.addEventListener("change", render);
    hl.addEventListener("click", function (e) {
      if (e.target.closest("[data-add-hl]")) { sync(); rows.push({ lang: "fr", url: "https://example.com/fr/" }); draw(); }
      var rm = e.target.closest("[data-rm-hl]");
      if (rm) { sync(); rows.splice(+rm.getAttribute("data-rm-hl"), 1); draw(); }
      var f = e.target.closest("[data-fmt]");
      if (f) {
        hl.querySelectorAll("[data-fmt]").forEach(function (b) { b.classList.remove("active"); });
        f.classList.add("active");
        fmt = f.getAttribute("data-fmt");
        render();
      }
    });
    document.querySelector("[data-copy]").addEventListener("click", function (e) {
      var b = e.currentTarget;
      navigator.clipboard.writeText(outEl.textContent).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy code"; }, 1500); });
    });
    draw();
  })();

  /* ================================================================ 301 Redirect rule generator */
  var rd = document.querySelector('[data-seo="redirect"]');
  if (rd) (function () {
    var pairsEl = $(rd, "[data-pairs]"), codeEl = $(rd, "[data-code]"), outEl = document.querySelector("[data-out]"), checksEl = document.querySelector("[data-checks]");
    var plat = "vercel";
    function normPath(p) {
      if (/^https?:\/\//i.test(p)) { try { return new URL(p).pathname; } catch (e) {} }
      return p.charAt(0) === "/" ? p : "/" + p;
    }
    function render() {
      var code = codeEl.value, isPerm = code === "301";
      var rawLines = pairsEl.value.split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean);
      var rules = [], badLines = [], loops = 0, dupes = 0, seenSrc = {};
      rawLines.forEach(function (l) {
        var m = l.split(/\s*->\s*|\s*,\s*|\t+|\s{2,}|\s+/);
        if (m.length < 2 || !m[0] || !m[1]) { badLines.push(l); return; }
        var src = normPath(m[0]), dst = m[1];
        if (!/^https?:\/\//i.test(dst) && dst.charAt(0) !== "/") dst = "/" + dst;
        if (src === dst) loops++;
        if (seenSrc[src]) dupes++;
        seenSrc[src] = true;
        rules.push({ src: src, dst: dst });
      });

      var out = "";
      if (plat === "vercel") {
        out = JSON.stringify({
          redirects: rules.map(function (r) {
            return { source: r.src, destination: r.dst, permanent: isPerm };
          })
        }, null, 2);
      } else if (plat === "htaccess") {
        out = rules.map(function (r) {
          return "Redirect " + code + " " + r.src + " " + r.dst;
        }).join("\n");
      } else if (plat === "netlify") {
        out = rules.map(function (r) {
          return r.src + "  " + r.dst + "  " + code + "!";
        }).join("\n");
      } else if (plat === "nginx") {
        var flag = isPerm ? "permanent" : "redirect";
        out = rules.map(function (r) {
          var escSrc = r.src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          return "rewrite ^" + escSrc + "$ " + r.dst + " " + flag + ";";
        }).join("\n");
      }
      outEl.textContent = out;

      var checks = [];
      var add = function (s, t) { checks.push('<li class="' + s + '"><i></i><span>' + t + "</span></li>"); };
      if (!rules.length) add("fail", "Enter at least one old -> new path pair.");
      else add("pass", rules.length + " " + code + " redirect rule(s) generated for " + plat + ".");
      if (badLines.length) add("warn", badLines.length + " line(s) could not be parsed (use: /old-path/ -> /new-path/).");
      if (loops) add("fail", loops + " self-redirect loop(s) detected where source equals destination.");
      if (dupes) add("warn", dupes + " duplicate source path(s) found. Remove duplicates to avoid conflicts.");
      checksEl.innerHTML = checks.join("");
    }
    rd.addEventListener("input", render);
    rd.addEventListener("change", render);
    rd.addEventListener("click", function (e) {
      var p = e.target.closest("[data-plat]");
      if (p) {
        rd.querySelectorAll("[data-plat]").forEach(function (x) { x.classList.remove("active"); });
        p.classList.add("active");
        plat = p.getAttribute("data-plat");
        render();
      }
    });
    document.querySelector("[data-copy]").addEventListener("click", function (e) {
      var b = e.currentTarget;
      navigator.clipboard.writeText(outEl.textContent).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy rules"; }, 1500); });
    });
    document.querySelector("[data-download]").addEventListener("click", function () {
      var names = { vercel: "vercel.json", htaccess: ".htaccess", netlify: "_redirects", nginx: "redirects.conf" };
      var blob = new Blob([outEl.textContent], { type: "text/plain" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = names[plat] || "redirects.txt"; a.click(); URL.revokeObjectURL(a.href);
    });
    render();
  })();

  /* ================================================================ Open Graph & social card preview */
  var og = document.querySelector('[data-seo="og"]');
  if (og) (function () {
    var fbEl = document.querySelector("[data-og-fb]"), twEl = document.querySelector("[data-og-tw]"), outEl = document.querySelector("[data-out]");
    function hostOf(u) {
      try { return new URL(/^https?:\/\//i.test(u) ? u : "https://" + u).hostname.replace(/^www\./, ""); } catch (e) { return "example.com"; }
    }
    function render() {
      var url = og.elements.url.value.trim() || "https://example.com/";
      var title = og.elements.title.value.trim() || "Your Page Title";
      var desc = og.elements.desc.value.trim() || "Your page description will appear here when shared on social feeds.";
      var img = og.elements.image.value.trim();
      var site = og.elements.site.value.trim() || hostOf(url);
      var card = og.elements.card.value;
      var host = hostOf(url).toUpperCase();

      var imgBox = img
        ? '<div style="aspect-ratio:1.91/1;background:#e5e7eb;overflow:hidden"><img src="' + esc(img) + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.style.display=\'none\'"></div>'
        : '<div style="aspect-ratio:1.91/1;background:var(--soft);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:.85rem">1200 × 630 og:image preview</div>';

      fbEl.innerHTML = '<div style="border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--bg)">' + imgBox +
        '<div style="padding:12px 14px;border-top:1px solid var(--line)">' +
        '<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em">' + esc(host) + '</div>' +
        '<div style="font-weight:700;font-size:15px;line-height:1.3;margin:4px 0">' + esc(title.slice(0, 90)) + '</div>' +
        '<div style="font-size:13px;color:var(--muted);line-height:1.4">' + esc(desc.slice(0, 140)) + '</div>' +
        '</div></div>';

      if (card === "summary") {
        twEl.innerHTML = '<div style="display:flex;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--bg)">' +
          '<div style="width:110px;flex:none;background:var(--soft);display:flex;align-items:center;justify-content:center;overflow:hidden">' +
          (img ? '<img src="' + esc(img) + '" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'">' : '<span style="font-size:11px;color:var(--muted)">1:1</span>') +
          '</div><div style="padding:12px 14px;min-width:0">' +
          '<div style="font-size:12px;color:var(--muted)">' + esc(hostOf(url)) + '</div>' +
          '<div style="font-weight:700;font-size:14px;line-height:1.3;margin:3px 0">' + esc(title.slice(0, 70)) + '</div>' +
          '<div style="font-size:12px;color:var(--muted);line-height:1.35">' + esc(desc.slice(0, 110)) + '</div></div></div>';
      } else {
        twEl.innerHTML = '<div style="border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--bg)">' + imgBox +
          '<div style="padding:10px 14px">' +
          '<div style="font-weight:700;font-size:14px;line-height:1.3">' + esc(title.slice(0, 70)) + '</div>' +
          '<div style="font-size:12px;color:var(--muted);margin-top:2px">' + esc(hostOf(url)) + '</div>' +
          '</div></div>';
      }

      var tags = [
        '<meta property="og:type" content="website" />',
        '<meta property="og:url" content="' + esc(url) + '" />',
        '<meta property="og:title" content="' + esc(title) + '" />',
        '<meta property="og:description" content="' + esc(desc) + '" />',
      ];
      if (site) tags.push('<meta property="og:site_name" content="' + esc(site) + '" />');
      if (img) tags.push('<meta property="og:image" content="' + esc(img) + '" />');
      tags.push('<meta name="twitter:card" content="' + esc(card) + '" />');
      tags.push('<meta name="twitter:title" content="' + esc(title) + '" />');
      tags.push('<meta name="twitter:description" content="' + esc(desc) + '" />');
      if (img) tags.push('<meta name="twitter:image" content="' + esc(img) + '" />');
      outEl.textContent = tags.join("\n");
    }
    og.addEventListener("input", render);
    og.addEventListener("change", render);
    $(og, "[data-fetch]").addEventListener("click", function () {
      var msg = $(og, "[data-msg]"), url = og.elements.url.value.trim();
      if (!url) { msg.textContent = "Enter a URL first."; msg.className = "fmsg bad"; return; }
      msg.textContent = "Fetching live Open Graph tags…"; msg.className = "fmsg";
      fetch("/api/meta?url=" + encodeURIComponent(url)).then(function (r) { return r.json(); }).catch(function () { return { ok: false, error: "Could not reach the server." }; }).then(function (d) {
        if (!d.ok || !d.page) { msg.textContent = d.error || "Could not read that page."; msg.className = "fmsg bad"; return; }
        og.elements.url.value = d.url || url;
        og.elements.title.value = d.page.ogTitle || d.page.title || "";
        og.elements.desc.value = d.page.ogDescription || d.page.description || "";
        if (d.page.ogImage) og.elements.image.value = d.page.ogImage;
        msg.textContent = "Loaded live meta tags."; msg.className = "fmsg good"; render();
      });
    });
    document.querySelector("[data-copy]").addEventListener("click", function (e) {
      var b = e.currentTarget;
      navigator.clipboard.writeText(outEl.textContent).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy HTML tags"; }, 1500); });
    });
    render();
  })();

  /* ================================================================ Keyword density checker */
  var kd = document.querySelector('[data-seo="density"]');
  if (kd) (function () {
    var STOP = { the:1,be:1,to:1,of:1,and:1,a:1,in:1,that:1,have:1,i:1,it:1,"for":1,not:1,on:1,with:1,he:1,as:1,you:1,"do":1,at:1,"this":1,but:1,his:1,by:1,from:1,they:1,we:1,say:1,her:1,she:1,or:1,an:1,will:1,my:1,one:1,all:1,would:1,there:1,their:1,what:1,so:1,up:1,out:1,"if":1,about:1,who:1,get:1,which:1,go:1,me:1,when:1,make:1,can:1,like:1,time:1,no:1,just:1,him:1,know:1,take:1,into:1,year:1,your:1,good:1,some:1,could:1,them:1,see:1,other:1,than:1,then:1,now:1,look:1,only:1,come:1,its:1,over:1,think:1,also:1,back:1,after:1,use:1,two:1,how:1,our:1,work:1,first:1,well:1,way:1,even:1,"new":1,want:1,because:1,any:1,these:1,give:1,day:1,most:1,us:1,is:1,are:1,was:1,were:1,has:1,had:1 };
    var textEl = $(kd, "[data-text]"), targetEl = $(kd, "[data-target]"), stopEl = $(kd, "[data-stop]");
    var statsEl = $(kd, "[data-stats]"), targetResEl = $(kd, "[data-target-res]"), tableEl = document.querySelector("[data-table]");
    var nVal = 1;
    function render() {
      var raw = textEl.value;
      var words = (raw.toLowerCase().match(/[a-z0-9']+/g) || []).filter(function (w) { return w.length > 1 || /\d/.test(w); });
      var total = words.length;
      var uniq = {};
      words.forEach(function (w) { uniq[w] = true; });
      var mins = Math.max(1, Math.ceil(total / 200));
      statsEl.innerHTML = '<div class="seo-stat"><b>' + total + '</b><span>Total words</span></div>' +
        '<div class="seo-stat"><b>' + Object.keys(uniq).length + '</b><span>Unique words</span></div>' +
        '<div class="seo-stat"><b>' + raw.length + '</b><span>Characters</span></div>' +
        '<div class="seo-stat"><b>' + (total ? mins + " min" : "0 min") + '</b><span>Reading time</span></div>';

      var tKw = targetEl.value.trim().toLowerCase();
      if (tKw && total) {
        var rx = new RegExp("\\b" + tKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
        var hits = (raw.match(rx) || []).length;
        var kwWords = tKw.split(/\s+/).length;
        var dens = ((hits * kwWords) / total) * 100;
        var cls = dens > 3.5 ? "warn" : hits === 0 ? "bad" : "ok";
        var lbl = dens > 3.5 ? "High (>3.5%)" : hits === 0 ? "Missing" : "Natural";
        targetResEl.style.display = "flex";
        targetResEl.innerHTML = '<span class="seo-badge ' + cls + '">' + lbl + '</span><span>Target keyword <b>"' + esc(tKw) + '"</b> appears <b>' + hits + '</b> time(s) (<b>' + dens.toFixed(2) + '%</b> density). Aim for ~0.5%–2.5% natural usage.</span>';
      } else {
        targetResEl.style.display = "none";
      }

      var useStop = stopEl.checked;
      var counts = {};
      for (var i = 0; i <= words.length - nVal; i++) {
        var slice = words.slice(i, i + nVal);
        if (useStop && slice.every(function (w) { return STOP[w]; })) continue;
        if (nVal === 1 && useStop && STOP[slice[0]]) continue;
        var phrase = slice.join(" ");
        counts[phrase] = (counts[phrase] || 0) + 1;
      }
      var list = Object.keys(counts).map(function (k) { return { p: k, c: counts[k] }; })
        .sort(function (a, b) { return b.c - a.c || a.p.localeCompare(b.p); })
        .slice(0, 20);

      if (!list.length) {
        tableEl.innerHTML = '<p class="muted">Paste more text to see keyword frequency.</p>';
        return;
      }
      tableEl.innerHTML = '<table class="seo-tbl"><thead><tr><th>Phrase</th><th>Count</th><th>Density</th><th>Status</th></tr></thead><tbody>' +
        list.map(function (r) {
          var d = total ? ((r.c * nVal) / total) * 100 : 0;
          var badge = d > 3.5 ? '<span class="seo-badge warn">High</span>' : '<span class="seo-badge ok">OK</span>';
          return '<tr><td><b>' + esc(r.p) + '</b></td><td>' + r.c + '</td><td>' + d.toFixed(2) + '%</td><td>' + badge + '</td></tr>';
        }).join("") + '</tbody></table>';
    }
    kd.addEventListener("input", render);
    kd.addEventListener("change", render);
    document.querySelectorAll("[data-n]").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll("[data-n]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        nVal = +b.getAttribute("data-n");
        render();
      });
    });
    render();
  })();

  /* ================================================================ Heading structure & readability checker */
  var hd = document.querySelector('[data-seo="headings"]');
  if (hd) (function () {
    var inputEl = $(hd, "[data-input]"), statsEl = $(hd, "[data-stats]"), checksEl = document.querySelector("[data-checks]"), treeEl = document.querySelector("[data-tree]");
    function syllables(w) {
      w = w.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
      var m = w.match(/[aeiouy]{1,2}/g);
      return m ? Math.max(1, m.length) : 1;
    }
    function extractHeadings(raw) {
      var list = [];
      var isHtml = /<h[1-6]\b/i.test(raw);
      if (isHtml) {
        var doc = new DOMParser().parseFromString(raw, "text/html");
        doc.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(function (el) {
          list.push({ level: +el.tagName.slice(1), text: el.textContent.trim() });
        });
        return { headings: list, plain: (doc.body && doc.body.textContent) || raw };
      }
      var lines = raw.split(/\r?\n/);
      var plainLines = [];
      lines.forEach(function (l) {
        var m = l.match(/^(#{1,6})\s+(.+?)\s*#*$/);
        if (m) list.push({ level: m[1].length, text: m[2].trim() });
        else plainLines.push(l);
      });
      return { headings: list, plain: plainLines.join(" ") };
    }
    function render() {
      var raw = inputEl.value;
      var parsed = extractHeadings(raw);
      var hs = parsed.headings;
      var plain = parsed.plain.replace(/[#*_`>\[\]()]/g, " ");
      var words = plain.match(/[a-zA-Z0-9']+/g) || [];
      var sents = plain.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
      var syl = 0;
      words.forEach(function (w) { syl += syllables(w); });
      var wCount = words.length, sCount = Math.max(1, sents.length);
      var flesch = wCount ? Math.round(206.835 - 1.015 * (wCount / sCount) - 84.6 * (syl / wCount)) : 0;
      flesch = Math.max(0, Math.min(100, flesch));
      var avgSent = wCount ? (wCount / sCount).toFixed(1) : "0";

      statsEl.innerHTML = '<div class="seo-stat"><b>' + hs.length + '</b><span>Headings found</span></div>' +
        '<div class="seo-stat"><b>' + wCount + '</b><span>Body words</span></div>' +
        '<div class="seo-stat"><b>' + avgSent + '</b><span>Words / sentence</span></div>' +
        '<div class="seo-stat"><b>' + (wCount ? flesch + "/100" : "—") + '</b><span>Flesch Reading Ease</span></div>';

      var checks = [], add = function (s, t) { checks.push('<li class="' + s + '"><i></i><span>' + t + "</span></li>"); };
      var h1s = hs.filter(function (h) { return h.level === 1; });
      if (!hs.length) add("fail", "No headings detected. Add an H1 and H2 subheadings to structure your page.");
      else {
        if (h1s.length === 0) add("fail", "Missing H1 heading. Every page should have one clear H1.");
        else if (h1s.length === 1) add("pass", "Exactly one H1 heading found.");
        else add("warn", h1s.length + " H1 headings found. Using a single H1 is cleaner for accessibility and SEO.");
        var skips = [];
        for (var i = 1; i < hs.length; i++) {
          if (hs[i].level > hs[i - 1].level + 1) skips.push("H" + hs[i - 1].level + " → H" + hs[i].level);
        }
        if (skips.length) add("warn", "Skipped heading level(s): " + esc(skips.join(", ")) + ". Avoid jumping levels (e.g. H2 directly to H4).");
        else add("pass", "Heading hierarchy is sequential with no skipped levels.");
      }
      if (wCount) {
        if (flesch >= 60) add("pass", "Readability is easy to scan (Flesch " + flesch + "/100).");
        else if (flesch >= 40) add("info", "Moderate reading difficulty (Flesch " + flesch + "/100). Shorter sentences can boost engagement.");
        else add("warn", "Dense writing (Flesch " + flesch + "/100). Break up long sentences and add subheadings.");
      }
      checksEl.innerHTML = checks.join("");

      if (!hs.length) {
        treeEl.innerHTML = '<p class="muted">No H1–H6 headings found yet.</p>';
      } else {
        treeEl.innerHTML = hs.map(function (h) {
          var indent = (h.level - 1) * 20;
          return '<div style="padding:7px 0 7px ' + indent + 'px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:10px">' +
            '<span class="seo-badge ' + (h.level === 1 ? "ok" : "warn") + '">H' + h.level + '</span>' +
            '<span>' + esc(h.text || "(empty heading)") + '</span></div>';
        }).join("");
      }
    }
    inputEl.addEventListener("input", render);
    render();
  })();

  /* ================================================================ SEO URL slug & UTM builder */
  var utm = document.querySelector('[data-seo="utm"]');
  if (utm) (function () {
    var STOP = { a:1,an:1,the:1,and:1,or:1,but:1,to:1,of:1,"in":1,"for":1,on:1,with:1,at:1,by:1,from:1,is:1,are:1 };
    var PRESETS = {
      youtube: { src: "youtube", med: "video_description", camp: "channel_growth", cont: "pinned_link" },
      facebook: { src: "facebook", med: "social", camp: "reels_promo", cont: "bio_link" },
      newsletter: { src: "newsletter", med: "email", camp: "weekly_digest", cont: "cta_button" },
      twitter: { src: "twitter", med: "social", camp: "thread_launch", cont: "reply_link" }
    };
    var baseEl = $(utm, "[data-base]"), titleEl = $(utm, "[data-title]"), stopEl = $(utm, "[data-rmstop]");
    var srcEl = $(utm, "[data-src]"), medEl = $(utm, "[data-med]"), campEl = $(utm, "[data-camp]"), contEl = $(utm, "[data-cont]");
    var slugOut = document.querySelector("[data-slug-out]"), outEl = document.querySelector("[data-out]");

    function slugify(txt, rmStop) {
      var words = txt.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, " ").trim().split(/[\s-]+/).filter(Boolean);
      if (rmStop && words.length > 2) words = words.filter(function (w) { return !STOP[w]; });
      return words.join("-").replace(/-+/g, "-");
    }
    function render() {
      var rawBase = baseEl.value.trim() || "https://example.com/";
      var title = titleEl.value.trim();
      var slug = slugify(title || "your-clean-seo-slug", stopEl.checked);
      slugOut.textContent = "/" + slug + "/";

      var target = rawBase;
      if (title) target = rawBase.replace(/\/+$/, "") + "/" + slug + "/";
      try {
        var u = new URL(/^https?:\/\//i.test(target) ? target : "https://" + target);
        if (srcEl.value.trim()) u.searchParams.set("utm_source", srcEl.value.trim().toLowerCase().replace(/\s+/g, "_"));
        if (medEl.value.trim()) u.searchParams.set("utm_medium", medEl.value.trim().toLowerCase().replace(/\s+/g, "_"));
        if (campEl.value.trim()) u.searchParams.set("utm_campaign", campEl.value.trim().toLowerCase().replace(/\s+/g, "_"));
        if (contEl.value.trim()) u.searchParams.set("utm_content", contEl.value.trim().toLowerCase().replace(/\s+/g, "_"));
        outEl.textContent = u.toString();
      } catch (e) {
        outEl.textContent = "Enter a valid destination URL starting with https://";
      }
    }
    utm.addEventListener("input", render);
    utm.addEventListener("change", render);
    utm.addEventListener("click", function (e) {
      var p = e.target.closest("[data-up]");
      if (p) {
        utm.querySelectorAll("[data-up]").forEach(function (x) { x.classList.remove("active"); });
        p.classList.add("active");
        var d = PRESETS[p.getAttribute("data-up")];
        srcEl.value = d.src; medEl.value = d.med; campEl.value = d.camp; contEl.value = d.cont;
        render();
      }
    });
    document.querySelector("[data-copy-slug]").addEventListener("click", function (e) {
      var b = e.currentTarget;
      navigator.clipboard.writeText(slugOut.textContent).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy slug"; }, 1500); });
    });
    document.querySelector("[data-copy]").addEventListener("click", function (e) {
      var b = e.currentTarget;
      navigator.clipboard.writeText(outEl.textContent).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy UTM URL"; }, 1500); });
    });
    render();
  })();
})();
