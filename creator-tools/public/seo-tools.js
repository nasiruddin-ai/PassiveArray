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
})();
