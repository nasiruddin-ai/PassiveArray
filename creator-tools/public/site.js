/* Passive Array site chrome: theme toggle, mobile menu, universal search routing,
   directory filters, sign-up modal and the subscribe / contact forms.
   Loaded on every page. Tool pages also load shared.js for the calculators. */
(function () {
  "use strict";
  var root = document.documentElement;
  var ROOT = (document.body && document.body.getAttribute("data-root")) || "";
  var SUBSCRIBE_URL = "/api/subscribe";

  /* Theme */
  function setTheme(t) {
    if (t) root.setAttribute("data-theme", t); else root.removeAttribute("data-theme");
    try { if (t) localStorage.setItem("pa-theme", t); else localStorage.removeItem("pa-theme"); } catch (e) { /* private mode */ }
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { setTheme(root.getAttribute("data-theme") === "dark" ? "" : "dark"); });
  });
  if (root.getAttribute("data-theme") === "dark") setTheme("dark");

  /* Mobile menu */
  var menuBtn = document.querySelector("[data-menu]");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Universal search: a link or handle goes to the right live checker. */
  function route(raw) {
    var v = String(raw || "").trim();
    if (!v) return null;
    if (/twitch\.tv\//i.test(v) || /^twitch:/i.test(v)) {
      var login = v.replace(/^twitch:/i, "").replace(/^.*twitch\.tv\//i, "").split(/[/?#]/)[0];
      return ROOT + "creator-tools/twitch-follower-count-checker/?login=" + encodeURIComponent(login);
    }
    return ROOT + "creator-tools/youtube-subscriber-count-checker/?channel=" + encodeURIComponent(v);
  }
  document.querySelectorAll("form[data-search]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = f.querySelector("input");
      var to = route(input && input.value);
      if (to) location.href = to; else if (input) input.focus();
    });
  });

  /* Directory filters */
  var dir = document.querySelector("[data-directory]");
  if (dir) {
    var state = { intent: "all", platform: "all", q: "" };
    var cards = Array.prototype.slice.call(dir.querySelectorAll("a.card[data-intent]"));
    var groups = Array.prototype.slice.call(dir.querySelectorAll(".group"));
    var empty = dir.querySelector(".empty");
    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (state.intent === "all" || c.dataset.intent === state.intent) &&
          (state.platform === "all" || c.dataset.platform === state.platform) &&
          (!state.q || c.textContent.toLowerCase().indexOf(state.q) !== -1);
        c.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      groups.forEach(function (g) {
        var any = Array.prototype.some.call(g.querySelectorAll("a.card"), function (c) { return c.style.display !== "none"; });
        g.style.display = any ? "" : "none";
      });
      if (empty) empty.style.display = shown ? "none" : "";
      var count = dir.querySelector("[data-count]");
      if (count) count.textContent = shown;
    }
    dir.querySelectorAll(".fbtn").forEach(function (b) {
      b.addEventListener("click", function () {
        var key = b.dataset.filter, val = b.dataset.value;
        state[key] = val;
        dir.querySelectorAll('.fbtn[data-filter="' + key + '"]').forEach(function (x) { x.classList.toggle("on", x === b); });
        apply();
      });
    });
    var q = dir.querySelector("input[type=search]");
    if (q) q.addEventListener("input", function () { state.q = q.value.trim().toLowerCase(); apply(); });
    // Deep links: /creator-tools/#YouTube or #create
    var hash = decodeURIComponent(location.hash.replace("#", ""));
    if (hash) {
      var btn = dir.querySelector('.fbtn[data-value="' + hash + '"]');
      if (btn) btn.click();
    }
  }

  /* Sign-up modal. Built here so every page gets it without touching templates. */
  var signed = false;
  try { signed = localStorage.getItem("pa-signed") === "1"; } catch (e) { /* ignore */ }
  function showSigned() {
    document.querySelectorAll("[data-signup]").forEach(function (b) { b.textContent = "You're on the list"; b.classList.add("done"); });
  }
  function markSigned() {
    signed = true;
    try { localStorage.setItem("pa-signed", "1"); } catch (e) { /* ignore */ }
    showSigned();
  }
  if (signed) showSigned();

  var modal = null;
  function buildModal() {
    var m = document.createElement("div");
    m.className = "modal";
    m.hidden = true;
    m.innerHTML =
      '<div class="modal-back" data-close></div>' +
      '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="su-title">' +
        '<button type="button" class="iconbtn modal-x" data-close aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<span class="k">FREE ACCOUNT</span>' +
        '<h2 id="su-title">Sign up free</h2>' +
        '<p class="muted">Saved reports, channel alerts and a weekly digest are next. Sign up now and you get them first, plus the weekly creator report. The tools stay free with or without an account.</p>' +
        '<form data-subscribe data-kind="signup" novalidate>' +
          '<label for="su-email">Email</label>' +
          '<input id="su-email" type="email" name="email" placeholder="you@example.com" required autocomplete="email">' +
          '<label for="su-platform">You mostly work on</label>' +
          '<select id="su-platform" name="platform"><option>YouTube</option><option>Instagram</option><option>TikTok</option><option>Twitch</option><option>X</option><option>Several platforms</option><option>I run a brand or agency</option></select>' +
          '<input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">' +
          '<button type="submit" class="btn wide">Create my free account</button>' +
          '<span class="fmsg" data-msg>No spam. One click to unsubscribe.</span>' +
        '</form>' +
      '</div>';
    document.body.appendChild(m);
    m.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", closeModal); });
    wireForm(m.querySelector("form[data-subscribe]"));
    return m;
  }
  function openModal() {
    if (!modal) modal = buildModal();
    modal.hidden = false;
    document.body.classList.add("modal-open");
    var input = modal.querySelector("input[type=email]");
    if (input) setTimeout(function () { input.focus(); }, 30);
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  document.querySelectorAll("[data-signup]").forEach(function (b) { b.addEventListener("click", openModal); });

  /* Subscribe, newsletter and contact forms all post to the same endpoint. */
  function wireForm(form) {
    if (!form || form.getAttribute("data-wired")) return;
    form.setAttribute("data-wired", "1");
    var msg = form.querySelector("[data-msg]");
    var btn = form.querySelector("button[type=submit]");
    var idle = msg ? msg.textContent : "";
    function say(text, cls) {
      if (!msg) return;
      msg.textContent = text;
      msg.className = "fmsg" + (cls ? " " + cls : "");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name) data[el.name] = el.value; });
      data.kind = form.getAttribute("data-kind") || "signup";
      data.source = location.pathname;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email || "").trim())) { say("Enter a valid email address.", "bad"); return; }
      if (data.kind === "contact" && !String(data.message || "").trim()) { say("Write a message first.", "bad"); return; }
      if (btn) btn.disabled = true;
      say("Sending…");
      fetch(SUBSCRIBE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (btn) btn.disabled = false;
          if (res && res.ok) {
            var done = data.kind === "contact" ? "Thanks, your message is in. We reply by email, usually within two working days." :
              data.kind === "newsletter" ? "You're subscribed. The next report lands in your inbox this week." :
              "You're in. Watch your inbox for the first report.";
            say(done, "good");
            if (data.kind !== "contact") markSigned();
            form.reset();
            if (data.kind === "signup") setTimeout(closeModal, 1800);
          } else {
            say((res && res.error) || "Something went wrong. Please try again.", res && res.code === "no_backend" ? "" : "bad");
          }
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          say("Could not reach the server. Check your connection and try again.", "bad");
        });
    });
    form.addEventListener("input", function () { if (msg && msg.classList.contains("bad")) say(idle); });
  }
  document.querySelectorAll("form[data-subscribe]").forEach(wireForm);

  /* ------------------------------------------------------------- accounts */
  /* Sign-in is passwordless: a link is emailed and exchanged for a session
     cookie. The cookie is HttpOnly so this script cannot read it. A plain
     localStorage marker is kept purely so the header can show the right thing
     without a request on every page; the server is still the only authority. */

  var AUTH = "/api/auth";
  var MARK = "pa-user";

  function authCall(action, body) {
    var opts = { method: body ? "POST" : "GET", credentials: "same-origin", cache: "no-store" };
    if (body) {
      opts.headers = { "Content-Type": "application/json" };
      opts.body = JSON.stringify(body);
    }
    return fetch(AUTH + "?action=" + action, opts)
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: "Could not reach the server. Check your connection and try again." }; });
  }
  function marker(email) {
    try {
      if (email) localStorage.setItem(MARK, email); else localStorage.removeItem(MARK);
    } catch (e) { /* private mode */ }
  }
  function markedEmail() {
    try { return localStorage.getItem(MARK); } catch (e) { return null; }
  }

  /* Header: swap the log-in link for an account link when signed in. */
  function paintHeader() {
    var email = markedEmail();
    document.querySelectorAll("[data-login-link]").forEach(function (a) {
      a.textContent = email ? "Account" : "Log in";
      a.setAttribute("href", ROOT + (email ? "account/" : "login/"));
    });
    document.querySelectorAll("[data-signup]").forEach(function (b) {
      b.style.display = email ? "none" : "";
    });
  }
  paintHeader();

  /* Sign-in page */
  var loginBox = document.querySelector("[data-login]");
  if (loginBox) {
    var form = loginBox.querySelector("[data-login-form]");
    var sent = loginBox.querySelector("[data-login-sent]");
    var working = loginBox.querySelector("[data-login-working]");
    var msg = form.querySelector("[data-msg]");
    var idleText = msg.textContent;
    var again = loginBox.querySelector("[data-login-again]");

    function showOnly(which) {
      form.hidden = which !== "form";
      sent.hidden = which !== "sent";
      working.hidden = which !== "working";
    }
    function fail(text) {
      showOnly("form");
      msg.textContent = text;
      msg.className = "fmsg bad";
    }

    again.addEventListener("click", function () {
      showOnly("form");
      msg.textContent = idleText;
      msg.className = "fmsg";
      form.reset();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (form.elements.email.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { fail("Enter a valid email address."); return; }
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      msg.textContent = "Sending…";
      msg.className = "fmsg";
      authCall("request", { email: email, website: form.elements.website.value, source: location.pathname }).then(function (res) {
        btn.disabled = false;
        if (res && res.ok) showOnly("sent");
        else fail((res && res.error) || "Something went wrong. Please try again.");
      });
    });

    /* Arriving from the emailed link. */
    var token = new URLSearchParams(location.search).get("token");
    if (token) {
      showOnly("working");
      authCall("verify", { token: token }).then(function (res) {
        if (res && res.ok) {
          marker(res.email);
          location.replace(ROOT + "account/");
        } else {
          fail((res && res.error) || "That sign-in link did not work. Ask for a new one.");
          history.replaceState(null, "", location.pathname);
        }
      });
    }
  }

  /* Account page */
  var account = document.querySelector("[data-account]");
  if (account) {
    var loading = document.querySelector("[data-account-loading]");
    var signedOut = document.querySelector("[data-account-out]");
    var prefBox = account.querySelector("[data-pref-weekly]");
    var prefMsg = account.querySelector("[data-pref-msg]");
    var delMsg = account.querySelector("[data-delete-msg]");

    function showAccount(state) {
      if (loading) loading.hidden = state !== "loading";
      account.hidden = state !== "in";
      if (signedOut) signedOut.hidden = state !== "out";
    }

    authCall("me").then(function (res) {
      if (res && res.ok) {
        marker(res.email);
        paintHeader();
        account.querySelector("[data-account-email]").textContent = res.email;
        var since = account.querySelector("[data-account-since]");
        since.textContent = res.since
          ? new Date(res.since).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
          : "–";
        showAccount("in");
      } else {
        marker(null);
        paintHeader();
        showAccount("out");
      }
    });

    if (prefBox) {
      prefBox.addEventListener("change", function () {
        prefMsg.textContent = "Saving…";
        prefMsg.className = "fmsg";
        authCall("preferences", { weekly: prefBox.checked }).then(function (res) {
          if (res && res.ok) {
            prefMsg.textContent = res.weekly ? "Saved. You will get the weekly report." : "Saved. You are off the weekly report.";
            prefMsg.className = "fmsg good";
          } else {
            prefBox.checked = !prefBox.checked;
            prefMsg.textContent = (res && res.error) || "Could not save that.";
            prefMsg.className = "fmsg bad";
          }
        });
      });
    }

    var outBtn = account.querySelector("[data-logout]");
    if (outBtn) {
      outBtn.addEventListener("click", function () {
        outBtn.disabled = true;
        authCall("logout", {}).then(function () {
          marker(null);
          location.href = ROOT;
        });
      });
    }

    var delBtn = account.querySelector("[data-delete]");
    if (delBtn) {
      delBtn.addEventListener("click", function () {
        if (!window.confirm("Delete your email address and preferences? This signs you out and cannot be undone. The tools keep working without an account.")) return;
        delBtn.disabled = true;
        delMsg.textContent = "Sending the request…";
        delMsg.className = "fmsg";
        authCall("delete", {}).then(function (res) {
          if (res && res.ok) {
            marker(null);
            delMsg.textContent = "Done. Your data is scheduled for removal and you have been signed out.";
            delMsg.className = "fmsg good";
            setTimeout(function () { location.href = ROOT; }, 2500);
          } else {
            delBtn.disabled = false;
            delMsg.textContent = (res && res.error) || "Could not record that.";
            delMsg.className = "fmsg bad";
          }
        });
      });
    }
  }
})();
