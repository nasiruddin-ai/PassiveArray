/* Passive Array site chrome: theme toggle, mobile menu, universal search routing,
   directory filters, the newsletter and contact forms, and sign-in.
   Loaded on every page. Tool pages also load shared.js for the calculators. */
(function () {
  "use strict";
  var root = document.documentElement;
  var ROOT = (document.body && document.body.getAttribute("data-root")) || "";
  var SUBSCRIBE_URL = "/api/subscribe";

  /* Theme */
  function setTheme(t) {
    t = t === "light" ? "light" : "dark";
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("pa-theme", t); } catch (e) { /* private mode */ }
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"); });
  });
  setTheme(root.getAttribute("data-theme") || "dark"); // dark is the default; the head script sets it before paint

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

  /* Tools mega-menu. Opens on hover with a pointer, on click or keyboard
     otherwise, and closes on Escape or a click elsewhere. */
  document.querySelectorAll("[data-mega]").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("data-mega"));
    if (!panel) return;
    var closeTimer = null;
    function open(yes) {
      clearTimeout(closeTimer);
      panel.hidden = !yes;
      btn.setAttribute("aria-expanded", yes ? "true" : "false");
    }
    btn.addEventListener("click", function (e) { e.stopPropagation(); open(panel.hidden); });
    btn.addEventListener("mouseenter", function () { if (window.matchMedia("(hover: hover)").matches) open(true); });
    [btn, panel].forEach(function (el) {
      el.addEventListener("mouseleave", function () {
        if (!window.matchMedia("(hover: hover)").matches) return;
        closeTimer = setTimeout(function () { open(false); }, 180);
      });
      el.addEventListener("mouseenter", function () { clearTimeout(closeTimer); });
    });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) open(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") open(false); });
    panel.addEventListener("focusout", function () {
      setTimeout(function () { if (!panel.contains(document.activeElement) && document.activeElement !== btn) open(false); }, 0);
    });
  });

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
  /* Home page tool finder: search + intent chips + show all. */
  var finder = document.querySelector("[data-home-tools]");
  if (finder) {
    var fCards = Array.prototype.slice.call(finder.querySelectorAll("[data-tool-grid] .tcard"));
    var fEmpty = finder.querySelector("[data-tool-empty]");
    var fMore = finder.querySelector("[data-tool-more]");
    var fState = { intent: "all", q: "", all: false };
    function fApply() {
      var shown = 0, filtering = fState.intent !== "all" || !!fState.q;
      fCards.forEach(function (c, i) {
        var ok = (fState.intent === "all" || c.dataset.intent === fState.intent) && (!fState.q || c.dataset.text.indexOf(fState.q) !== -1);
        if (ok && !filtering && !fState.all && i >= 12) ok = false;
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (fEmpty) fEmpty.hidden = shown > 0;
      if (fMore) fMore.parentNode.hidden = filtering || fState.all;
    }
    finder.querySelectorAll("[data-intent-filter]").forEach(function (b) {
      b.addEventListener("click", function () {
        fState.intent = b.dataset.intentFilter;
        finder.querySelectorAll("[data-intent-filter]").forEach(function (x) { x.classList.toggle("on", x === b); });
        fApply();
      });
    });
    var fQ = finder.querySelector("[data-tool-search]");
    if (fQ) fQ.addEventListener("input", function () { fState.q = fQ.value.trim().toLowerCase(); fApply(); });
    if (fMore) fMore.addEventListener("click", function () { fState.all = true; fApply(); });
  }
  document.querySelectorAll(".lp-try").forEach(function (b) {
    b.addEventListener("click", function () { var i = document.getElementById("lp-monet-channel"); if (i) { i.value = b.dataset.fill; i.focus(); } });
  });

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

  /* "Sign up free" buttons anywhere on the site go to the real sign-up page. */
  document.querySelectorAll("button[data-signup]").forEach(function (b) {
    b.addEventListener("click", function () { location.href = ROOT + "signup/"; });
  });

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
            form.reset();
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
  /* Three ways in: Google, a password, or a link emailed to you. Whichever is
     used, the server sets one signed HttpOnly cookie. This script cannot read
     that cookie; the localStorage marker below only decides what the header
     shows, and the server stays the only authority. */

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
      a.textContent = email ? "Dashboard" : "Log in";
      a.setAttribute("href", ROOT + (email ? "app/" : "login/"));
    });
    document.querySelectorAll("[data-signup-link], button[data-signup]").forEach(function (b) {
      b.style.display = email ? "none" : "";
    });
  }
  paintHeader();
  var proCta = document.querySelector("[data-pro-cta]");
  if (proCta && !markedEmail()) {
    proCta.textContent = "Sign in to go Pro";
    proCta.setAttribute("href", ROOT + "login/?next=%2Faccount%2F");
  }

  /* Show / hide a password field. */
  document.querySelectorAll("[data-pw-show]").forEach(function (b) {
    b.addEventListener("click", function () {
      var input = b.parentNode.querySelector("input");
      if (!input) return;
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      b.textContent = show ? "Hide" : "Show";
      b.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  /* ---------------------------------------------------- sign in / sign up */
  var authCard = document.querySelector("[data-auth]");
  if (authCard) {
    var signupMode = authCard.getAttribute("data-auth-mode") === "signup";
    var offBox = authCard.querySelector("[data-auth-off]");
    var mainBox = authCard.querySelector("[data-auth-body]");
    var form = authCard.querySelector("[data-auth-form]");
    var emailInput = form.elements.email;
    var pwWrap = authCard.querySelector("[data-password-wrap]");
    var pwInput = authCard.querySelector("#a-password");
    var pwHint = authCard.querySelector("[data-pw-hint]");
    var submit = authCard.querySelector("[data-auth-submit]");
    var msg = authCard.querySelector("[data-msg]");
    var wantLink = authCard.querySelector("[data-want-link]");
    var wantPassword = authCard.querySelector("[data-want-password]");
    var googleWrap = authCard.querySelector("[data-google-wrap]");
    var googleSlot = authCard.querySelector("[data-google-button]");
    var sentBox = authCard.querySelector("[data-login-sent]");
    var workingBox = authCard.querySelector("[data-login-working]");
    var againBtn = authCard.querySelector("[data-login-again]");

    var usePassword = false;   // false means "email me a link"
    var methods = { link: false, google: false, password: false };

    function panel(which) {
      mainBox.hidden = which !== "form";
      sentBox.hidden = which !== "sent";
      workingBox.hidden = which !== "working";
      if (offBox) offBox.hidden = which !== "off";
    }
    function say(text, cls) {
      msg.textContent = text || "";
      msg.className = "fmsg" + (cls ? " " + cls : "");
    }
    function paintMode() {
      pwWrap.hidden = !usePassword;
      if (pwHint) pwHint.hidden = !(usePassword && signupMode);
      pwInput.setAttribute("autocomplete", signupMode ? "new-password" : "current-password");
      submit.textContent = usePassword
        ? (signupMode ? "Create my account" : "Sign in")
        : "Email me a sign-in link";
      if (wantLink) wantLink.hidden = !usePassword || !methods.link;
      if (wantPassword) wantPassword.hidden = usePassword || !methods.password;
      say("");
    }

    if (wantLink) wantLink.addEventListener("click", function () { usePassword = false; paintMode(); emailInput.focus(); });
    if (wantPassword) wantPassword.addEventListener("click", function () { usePassword = true; paintMode(); pwInput.focus(); });
    if (againBtn) againBtn.addEventListener("click", function () { panel("form"); form.reset(); say(""); });

    function afterSignIn(res) {
      marker(res.email);
      var next = new URLSearchParams(location.search).get("next");
      var safe = next && next.charAt(0) === "/" && next.charAt(1) !== "/" ? next : null;
      location.replace(safe || (ROOT + "app/"));
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (emailInput.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { say("Enter a valid email address.", "bad"); return; }
      if (usePassword && (pwInput.value || "").length < 1) { say("Enter your password.", "bad"); return; }

      submit.disabled = true;
      say("Working…");

      var action = usePassword ? (signupMode ? "register" : "password") : "request";
      var payload = { email: email, source: location.pathname, website: form.elements.website.value };
      if (usePassword) payload.password = pwInput.value;

      authCall(action, payload).then(function (res) {
        submit.disabled = false;
        if (!res || !res.ok) {
          say((res && res.error) || "Something went wrong. Please try again.", "bad");
          // Nudge an existing account towards the right page.
          if (res && res.code === "exists" && signupMode) {
            usePassword = true;
            wantPassword.hidden = true;
          }
          return;
        }
        if (action === "request") { panel("sent"); return; }
        afterSignIn(res);
      });
    });

    /* Google Identity Services, loaded only when a client ID is configured. */
    function startGoogle(clientId) {
      var s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client?hl=en";
      s.async = true;
      s.onload = function () {
        if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          locale: "en", // the rest of the site is English, so keep the button English too
          callback: function (response) {
            panel("working");
            authCall("google", { credential: response.credential, source: location.pathname }).then(function (res) {
              if (res && res.ok) afterSignIn(res);
              else { panel("form"); say((res && res.error) || "That Google sign-in did not work.", "bad"); }
            });
          },
        });
        window.google.accounts.id.renderButton(googleSlot, {
          locale: "en",
          theme: document.documentElement.getAttribute("data-theme") === "dark" ? "filled_black" : "outline",
          size: "large",
          width: Math.min(360, Math.max(240, googleSlot.clientWidth || 320)),
          text: signupMode ? "signup_with" : "signin_with",
          shape: "rectangular",
        });
        googleWrap.hidden = false;
      };
      s.onerror = function () { googleWrap.hidden = true; };
      document.head.appendChild(s);
    }

    /* Work out what this deployment actually supports before showing anything. */
    authCall("health").then(function (res) {
      if (!res || !res.enabled) { panel("off"); return; }
      methods = res.methods || methods;
      if (pwInput && res.minPassword) pwInput.setAttribute("placeholder", "At least " + res.minPassword + " characters");
      if (!methods.link && !methods.google && !methods.password) { panel("off"); return; }

      usePassword = methods.password;   // prefer a password when it is available
      panel("form");
      paintMode();
      if (methods.google && res.googleClientId) startGoogle(res.googleClientId);

      /* Arriving from an emailed link. */
      var token = new URLSearchParams(location.search).get("token");
      if (token) {
        panel("working");
        authCall("verify", { token: token }).then(function (r2) {
          if (r2 && r2.ok) { afterSignIn(r2); return; }
          panel("form");
          paintMode();
          say((r2 && r2.error) || "That sign-in link did not work. Ask for a new one.", "bad");
          history.replaceState(null, "", location.pathname);
        });
      }
    });
  }


  /* ------------------------------------------------- analytics consent */
  /* Tag Manager is loaded with every storage type denied, in the head script.
     Nothing is stored and no identifier is sent until somebody accepts here.
     If analytics is not configured at all, none of this runs. */
  var CONSENT_KEY = "pa-consent";
  function consentChoice() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(granted) {
    try { localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied"); } catch (e) { /* private mode */ }
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  }

  var consentBar = null;
  function showConsent() {
    if (consentBar) { consentBar.hidden = false; return; }
    consentBar = document.createElement("div");
    consentBar.className = "consent";
    consentBar.setAttribute("role", "dialog");
    consentBar.setAttribute("aria-label", "Analytics choice");
    consentBar.innerHTML =
      '<p>We would like to count which tools get used, with Google Analytics. It is <b>off right now</b>: ' +
      'nothing is stored unless you accept. No ads, and nothing is ever sold. ' +
      '<a href="' + ROOT + 'privacy/">How this works</a>.</p>' +
      '<div class="consent-actions">' +
        '<button type="button" class="btn ghost" data-consent-no>No thanks</button>' +
        '<button type="button" class="btn mint" data-consent-yes>Accept</button>' +
      '</div>';
    document.body.appendChild(consentBar);
    consentBar.querySelector("[data-consent-yes]").addEventListener("click", function () { setConsent(true); consentBar.hidden = true; });
    consentBar.querySelector("[data-consent-no]").addEventListener("click", function () { setConsent(false); consentBar.hidden = true; });
    setTimeout(function () { consentBar.classList.add("show"); }, 40);
  }

  if (window.PA_ANALYTICS) {
    document.querySelectorAll("[data-consent-open]").forEach(function (b) {
      b.hidden = false;
      b.addEventListener("click", function (e) { e.preventDefault(); showConsent(); });
    });
    if (!consentChoice()) showConsent();
  }

  /* ----------------------------------------- Google sign-up, everywhere */
  /* Renders Google's button into any [data-google-slot] (header, Tools menu,
     mobile menu) and shows Google One Tap on ordinary pages, so a visitor who
     is already logged into Google can join with one click without leaving
     the page. Each new sign-in is forwarded to the sign-up sheet as a lead.
     Skipped when: Google is not configured, the visitor is already signed in,
     or the page is the sign-in / sign-up page (those render their own). */

  var HEALTH_KEY = "pa-auth-health";
  function authHealth() {
    try {
      var cached = JSON.parse(sessionStorage.getItem(HEALTH_KEY) || "null");
      if (cached && cached.until > Date.now()) return Promise.resolve(cached.data);
    } catch (e) { /* ignore */ }
    return authCall("health").then(function (res) {
      try { sessionStorage.setItem(HEALTH_KEY, JSON.stringify({ until: Date.now() + 3600000, data: res })); } catch (e) { /* ignore */ }
      return res;
    });
  }

  function toast(text) {
    var t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("show"); }, 20);
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 400); }, 4200);
  }

  function loadGsi(cb) {
    if (window.google && window.google.accounts && window.google.accounts.id) return cb();
    var s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client?hl=en";
    s.async = true;
    s.onload = cb;
    document.head.appendChild(s);
  }

  var slots = document.querySelectorAll("[data-google-slot]");
  var onAuthPage = !!document.querySelector("[data-auth]");
  // The header button and One Tap are not needed for the first paint. Wait for a scroll, tap or key
  // press so the 100 KB Google client and its frames do not slow the page load.
  function afterInteraction(fn) {
    var done = false;
    var go = function () { if (done) return; done = true; fn(); };
    ["scroll", "pointerdown", "keydown", "touchstart"].forEach(function (e) { addEventListener(e, go, { once: true, passive: true }); });
  }
  if (slots.length && !onAuthPage && !markedEmail()) afterInteraction(function () {
    authHealth().then(function (res) {
      if (!res || !res.enabled || !res.methods || !res.methods.google || !res.googleClientId) return;
      loadGsi(function () {
        var g = window.google.accounts.id;
        g.initialize({
          client_id: res.googleClientId,
          locale: "en",
          itp_support: true,
          cancel_on_tap_outside: true,
          callback: function (response) {
            authCall("google", { credential: response.credential, source: location.pathname }).then(function (r) {
              if (!r || !r.ok) { toast((r && r.error) || "That Google sign-in did not work."); return; }
              marker(r.email);
              paintHeader();
              document.querySelectorAll("[data-google-slot]").forEach(function (s) { s.hidden = true; });
              document.documentElement.classList.remove("has-google");
              toast(r.isNew ? "Welcome. You are signed up as " + r.email + "." : "Signed in as " + r.email + ".");
            });
          },
        });
        slots.forEach(function (slot) {
          var dark = document.documentElement.getAttribute("data-theme") === "dark";
          g.renderButton(slot, {
            locale: "en",
            theme: dark ? "filled_black" : "outline",
            size: slot.getAttribute("data-google-size") || "medium",
            shape: "pill",
            text: "signup_with",
            width: parseInt(slot.getAttribute("data-google-width"), 10) || 190,
          });
          slot.hidden = false;
        });
        document.documentElement.classList.add("has-google");
        // One Tap: only on regular pages, and Google applies its own cooldown once dismissed.
        if (!document.querySelector("[data-account]")) g.prompt();
      });
    });
  });

  /* ------------------------------------------------------------- account */
  var account = document.querySelector("[data-account]");
  if (account) {
    var loading = document.querySelector("[data-account-loading]");
    var signedOut = document.querySelector("[data-account-out]");
    var prefBox = account.querySelector("[data-pref-weekly]");
    var prefMsg = account.querySelector("[data-pref-msg]");
    var delMsg = account.querySelector("[data-delete-msg]");
    var setpwWrap = account.querySelector("[data-setpw-wrap]");
    var setpwForm = account.querySelector("[data-setpw-form]");
    var setpwMsg = account.querySelector("[data-setpw-msg]");
    var setpwTitle = account.querySelector("[data-setpw-title]");

    function showAccount(state) {
      if (loading) loading.hidden = state !== "loading";
      account.hidden = state !== "in";
      if (signedOut) signedOut.hidden = state !== "out";
    }

    authCall("me").then(function (res) {
      if (!res || !res.ok) {
        marker(null);
        paintHeader();
        showAccount("out");
        return;
      }
      marker(res.email);
      paintHeader();
      account.querySelector("[data-account-email]").textContent = res.email;
      account.querySelector("[data-account-since]").textContent = res.since
        ? new Date(res.since).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "–";

      var ways = [];
      if (res.google) ways.push("Google");
      if (res.hasPassword) ways.push("Password");
      ways.push("Email link");
      account.querySelector("[data-account-methods]").textContent = ways.join(", ");

      if (prefBox) prefBox.checked = res.weekly !== false;

      var planEl = account.querySelector("[data-account-plan]");
      if (planEl) planEl.textContent = res.pro ? "Pro" : "Free";
      var planFree = account.querySelector("[data-plan-free]");
      var planPro = account.querySelector("[data-plan-pro]");
      if (planFree) planFree.hidden = !!res.pro;
      if (planPro) planPro.hidden = !res.pro;
      isPro = !!res.pro;
      if (location.search.indexOf("upgraded=1") >= 0 && !res.pro) {
        // The checkout sends people back before the webhook has always landed; try again shortly.
        setTimeout(function () {
          authCall("me").then(function (r2) {
            if (r2 && r2.ok && r2.pro) location.replace(location.pathname);
          });
        }, 4000);
      }
      loadWatch();

      if (setpwWrap) {
        setpwWrap.hidden = false;
        if (setpwTitle) setpwTitle.textContent = res.hasPassword ? "Change your password" : "Add a password";
      }
      showAccount("in");
    });

    if (setpwForm) {
      setpwForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var value = setpwForm.elements.password.value || "";
        setpwMsg.textContent = "Saving…";
        setpwMsg.className = "fmsg";
        authCall("set-password", { password: value }).then(function (res) {
          if (res && res.ok) {
            setpwMsg.textContent = "Saved. You can sign in with that password from now on.";
            setpwMsg.className = "fmsg good";
            setpwForm.reset();
            if (setpwTitle) setpwTitle.textContent = "Change your password";
          } else {
            setpwMsg.textContent = (res && res.error) || "Could not save that.";
            setpwMsg.className = "fmsg bad";
          }
        });
      });
    }

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

    /* ---- plan: upgrade / portal ---- */
    var isPro = false;
    function billingCall(action, body) {
      return fetch("/api/billing?action=" + action, { method: "POST", credentials: "same-origin", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) })
        .then(function (r) { return r.json(); })
        .catch(function () { return { ok: false, error: "Could not reach the server." }; });
    }
    account.querySelectorAll("[data-upgrade]").forEach(function (b) {
      b.addEventListener("click", function () {
        var msg = account.querySelector("[data-plan-msg]");
        b.disabled = true;
        msg.textContent = "Opening checkout…";
        msg.className = "fmsg";
        billingCall("checkout", { plan: b.getAttribute("data-upgrade") }).then(function (res) {
          if (res && res.ok && res.url) { location.href = res.url; return; }
          b.disabled = false;
          msg.textContent = (res && res.error) || "Could not open checkout.";
          msg.className = "fmsg " + (res && res.code === "not_open" ? "" : "bad");
        });
      });
    });
    var portalBtn = account.querySelector("[data-portal]");
    if (portalBtn) {
      portalBtn.addEventListener("click", function () {
        var msg = account.querySelector("[data-plan-msg-pro]");
        portalBtn.disabled = true;
        msg.textContent = "Opening billing…";
        billingCall("portal").then(function (res) {
          if (res && res.ok && res.url) { location.href = res.url; return; }
          portalBtn.disabled = false;
          msg.textContent = (res && res.error) || "Could not open billing.";
          msg.className = "fmsg bad";
        });
      });
    }

    /* ---- account tabs ---- */
    var accTabs = account.querySelectorAll("[data-acc-tab]");
    function showTab(name) {
      accTabs.forEach(function (b) { var on = b.getAttribute("data-acc-tab") === name; b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
      account.querySelectorAll("[data-acc-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-acc-panel") !== name; });
      if (name === "mcp") loadMcp();
    }
    accTabs.forEach(function (b) {
      b.addEventListener("click", function () {
        var name = b.getAttribute("data-acc-tab");
        try { history.replaceState(null, "", name === "main" ? location.pathname + location.search : "#" + name); } catch (e) { /* ignore */ }
        showTab(name);
      });
    });

    /* ---- MCP ---- */
    var mcpWrap = account.querySelector("[data-mcp]");
    var mcpData = null, mcpLoaded = false, mcpNewKey = "", mcpClient = "claude";
    var MCP_URL = "https://passivearray.com/mcp";
    function mcpCall(action, body) {
      var opts = { method: body ? "POST" : "GET", credentials: "same-origin", cache: "no-store" };
      if (body) { opts.headers = { "Content-Type": "application/json" }; opts.body = JSON.stringify(body); }
      return fetch("/api/mcp-account" + (action ? "?action=" + action : ""), opts)
        .then(function (r) { return r.json(); })
        .catch(function () { return { ok: false, error: "Could not reach the server." }; });
    }
    function mEsc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
    function mWhen(iso) {
      if (!iso) return "Never";
      var d = new Date(iso), s = (Date.now() - d.getTime()) / 1000;
      if (s < 60) return "Just now";
      if (s < 3600) return Math.round(s / 60) + " min ago";
      if (s < 86400) return Math.round(s / 3600) + " h ago";
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    function snippet(text, label) {
      return "<div class=\"mcp-snip\"><pre><code>" + mEsc(text) + "</code></pre><button type=\"button\" class=\"btn ghost\" data-mcp-copy=\"" + mEsc(text) + "\">" + (label || "Copy") + "</button></div>";
    }
    var CLIENTS = [
      ["claude", "Claude"], ["chatgpt", "ChatGPT"], ["claude-code", "Claude Code"], ["cursor", "Cursor"],
      ["vscode", "VS Code"], ["gemini", "Gemini CLI"], ["other", "Other clients"],
    ];
    function guideHtml(client) {
      var key = mcpNewKey || "YOUR_KEY";
      var urlKey = MCP_URL + "?key=" + key;
      var keyHint = mcpNewKey ? "<p class=\"mcp-ok\">Your new key is already filled in below.</p>" : "<p class=\"muted\">Replace <code>YOUR_KEY</code> with a key from the API keys section below.</p>";
      var urlWarn = "<p class=\"muted mcp-small\">The key is part of this URL, so treat the URL like a password. Revoke the key below if it ever leaks.</p>";
      if (client === "claude") return keyHint +
        "<ol><li>In Claude on the web or the desktop app, open <b>Settings → Connectors</b>.</li><li>Choose <b>Add custom connector</b> and name it <b>Passive Array</b>.</li><li>Paste this as the remote MCP server URL and press <b>Add</b>:</li></ol>" +
        snippet(urlKey, "Copy URL") + "<ol start=\"4\"><li>In a chat, open the tools menu and switch Passive Array on. Then ask, for example: <i>How fast is @mkbhd growing this month?</i></li></ol>" + urlWarn;
      if (client === "chatgpt") return keyHint +
        "<ol><li>In ChatGPT, open <b>Settings → Apps &amp; Connectors → Advanced settings</b> and turn on <b>Developer mode</b>. It is only offered on some ChatGPT plans.</li><li>Back in Apps &amp; Connectors, choose <b>Create</b>, name it <b>Passive Array</b> and paste this as the MCP server URL:</li></ol>" +
        snippet(urlKey, "Copy URL") + "<ol start=\"3\"><li>Set authentication to <b>No authentication</b> (the key is already in the URL), accept the prompt and save.</li><li>Pick Passive Array from the tools menu in a new chat.</li></ol>" + urlWarn;
      if (client === "claude-code") return keyHint + "<p>Run this in a terminal, then start Claude Code and type <code>/mcp</code> to check it is connected:</p>" +
        snippet("claude mcp add --transport http passive-array " + MCP_URL + " --header \"Authorization: Bearer " + key + "\"");
      if (client === "cursor") return keyHint + "<p>Open <b>Cursor Settings → MCP → Add new MCP server</b>, or put this in <code>~/.cursor/mcp.json</code> (all projects) or <code>.cursor/mcp.json</code> (one project):</p>" +
        snippet(JSON.stringify({ mcpServers: { "passive-array": { url: MCP_URL, headers: { Authorization: "Bearer " + key } } } }, null, 2));
      if (client === "vscode") return keyHint + "<p>Put this in <code>.vscode/mcp.json</code> in your project, or run <b>MCP: Add Server</b> from the Command Palette and choose HTTP. Then use it from Copilot Chat in agent mode:</p>" +
        snippet(JSON.stringify({ servers: { "passive-array": { type: "http", url: MCP_URL, headers: { Authorization: "Bearer " + key } } } }, null, 2));
      if (client === "gemini") return keyHint + "<p>Add this to <code>~/.gemini/settings.json</code>, restart Gemini CLI and run <code>/mcp</code> to check it:</p>" +
        snippet(JSON.stringify({ mcpServers: { "passive-array": { httpUrl: MCP_URL, headers: { Authorization: "Bearer " + key } } } }, null, 2));
      return keyHint + "<p>Any client that supports remote MCP servers over HTTP (streamable HTTP transport) works. Use this server URL:</p>" + snippet(MCP_URL, "Copy URL") +
        "<p>and send your key in a header:</p>" + snippet("Authorization: Bearer " + key) +
        "<p>If the client only takes a URL, put the key in it instead:</p>" + snippet(urlKey, "Copy URL") + urlWarn;
    }
    function paintGuide() {
      if (!mcpWrap) return;
      var bar = mcpWrap.querySelector("[data-mcp-clients]");
      bar.innerHTML = CLIENTS.map(function (c) { return "<button type=\"button\" role=\"tab\" class=\"mcp-client" + (c[0] === mcpClient ? " on" : "") + "\" aria-selected=\"" + (c[0] === mcpClient) + "\" data-mcp-client=\"" + c[0] + "\">" + mEsc(c[1]) + "</button>"; }).join("");
      mcpWrap.querySelector("[data-mcp-guide]").innerHTML = guideHtml(mcpClient);
    }
    function paintMcp(d) {
      if (!mcpWrap || !d) return;
      mcpData = d;
      var keysEl = mcpWrap.querySelector("[data-mcp-keys]");
      keysEl.innerHTML = d.keys.length
        ? "<div class=\"tablewrap\"><table class=\"mcp-table\"><thead><tr><th>Name</th><th>Key</th><th>Created</th><th>Last used</th><th></th></tr></thead><tbody>" +
          d.keys.map(function (k) { return "<tr><td><b>" + mEsc(k.name) + "</b></td><td><code class=\"mcp-code\">" + mEsc(k.prefix) + "…</code></td><td>" + mEsc(mWhen(k.created)) + "</td><td>" + mEsc(mWhen(k.lastUsed)) + "</td><td class=\"num\"><button type=\"button\" class=\"btn ghost danger mcp-revoke\" data-mcp-revoke=\"" + mEsc(k.id) + "\">Revoke</button></td></tr>"; }).join("") +
          "</tbody></table></div><p class=\"muted mcp-small\">" + d.keys.length + " of " + d.maxKeys + " keys.</p>"
        : "<div class=\"mcp-empty\">No API keys yet. Generate one to get started.</div>";
      var u = d.usage, pct = u.limit ? Math.max(0, Math.min(100, (u.remaining / u.limit) * 100)) : 0;
      var reset = new Date(u.resetsAt);
      mcpWrap.querySelector("[data-mcp-usage]").innerHTML =
        "<div class=\"mcp-meter\"><div class=\"mcp-meter-top\"><span>Credits remaining today</span><b>" + u.remaining.toLocaleString("en-US") + " / " + u.limit.toLocaleString("en-US") + "</b></div><div class=\"mcp-bar\"><i style=\"width:" + pct.toFixed(1) + "%\"></i></div></div>" +
        "<p class=\"muted mcp-small\">" + mEsc(u.plan) + " plan: " + u.limit.toLocaleString("en-US") + " credits a day, reset at 00:00 UTC (" + mEsc(reset.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })) + " your time). Failed calls cost nothing." +
        (u.plan === "Pro" ? "" : " <a href=\"#\" data-mcp-pro>Pro raises it to " + d.credits.pro.toLocaleString("en-US") + " a day.</a>") + "</p>";
      var rows = mcpWrap.querySelector("[data-mcp-activity]");
      rows.innerHTML = d.activity.length
        ? d.activity.map(function (a) { return "<tr><td><code class=\"mcp-code\">" + mEsc(a.tool) + "</code></td><td>" + mEsc(a.arg || "") + "</td><td>" + mEsc(mWhen(a.at)) + "</td><td>" + (a.ok ? "<span class=\"pill good\">OK</span>" : "<span class=\"pill bad\" title=\"" + mEsc(a.error || "") + "\">Failed</span>") + "</td><td class=\"num\">" + a.credits + "</td></tr>"; }).join("")
        : "<tr><td colspan=\"5\" class=\"muted\">No activity yet. Calls from your assistants show up here.</td></tr>";
      mcpWrap.querySelector("[data-mcp-tools]").innerHTML = d.tools.map(function (t) {
        return "<div class=\"mcp-tool\"><div class=\"mcp-tool-top\"><b>" + mEsc(t.title) + "</b><span class=\"pill\">" + t.credits + " credit" + (t.credits === 1 ? "" : "s") + "</span></div><code class=\"mcp-code\">" + mEsc(t.name) + "</code><p>" + mEsc(t.description) + "</p></div>";
      }).join("");
    }
    function loadMcp() {
      if (!mcpWrap) return;
      paintGuide();
      if (mcpLoaded) return;
      mcpLoaded = true;
      mcpCall("").then(function (d) {
        if (d && d.ok) paintMcp(d);
        else mcpWrap.querySelector("[data-mcp-usage]").innerHTML = "<p class=\"fmsg bad\">" + mEsc((d && d.error) || "Could not load MCP details.") + "</p>";
      });
    }
    if (mcpWrap) {
      mcpWrap.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var cl = t.closest("[data-mcp-client]");
        if (cl) { mcpClient = cl.getAttribute("data-mcp-client"); paintGuide(); return; }
        var cp = t.closest("[data-mcp-copy]");
        if (cp) {
          navigator.clipboard.writeText(cp.getAttribute("data-mcp-copy")).then(function () { var was = cp.textContent; cp.textContent = "Copied"; setTimeout(function () { cp.textContent = was; }, 1500); });
          return;
        }
        if (t.closest("[data-mcp-copykey]")) {
          var b = t.closest("[data-mcp-copykey]");
          navigator.clipboard.writeText(mcpNewKey).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1500); });
          return;
        }
        if (t.closest("[data-mcp-pro]")) { e.preventDefault(); showTab("main"); var up = account.querySelector("[data-upgrade]"); if (up) up.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
        var rv = t.closest("[data-mcp-revoke]");
        if (rv) {
          if (!confirm("Revoke this key? Any assistant using it stops working at once.")) return;
          rv.disabled = true;
          mcpCall("revoke", { id: rv.getAttribute("data-mcp-revoke") }).then(function (d) {
            if (d && d.ok) paintMcp(d); else { rv.disabled = false; alert((d && d.error) || "Could not revoke the key."); }
          });
        }
      });
      var mcpForm = mcpWrap.querySelector("[data-mcp-form]");
      var mcpMsg = mcpWrap.querySelector("[data-mcp-msg]");
      mcpForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = mcpForm.querySelector("button");
        btn.disabled = true;
        mcpMsg.textContent = "";
        mcpCall("create", { name: mcpForm.elements.name.value }).then(function (d) {
          btn.disabled = false;
          if (!d || !d.ok) { mcpMsg.className = "fmsg bad"; mcpMsg.textContent = (d && d.error) || "Could not create a key."; return; }
          mcpNewKey = d.created.key;
          mcpForm.reset();
          var rev = mcpWrap.querySelector("[data-mcp-reveal]");
          rev.hidden = false;
          rev.querySelector("[data-mcp-newkey]").textContent = mcpNewKey;
          mcpMsg.className = "fmsg good";
          mcpMsg.textContent = "Key created. The setup guide above now uses it.";
          paintMcp(d);
          paintGuide();
        });
      });
    }
    if (location.hash === "#mcp") showTab("mcp");

    /* ---- watchlist ---- */
    var watchWrap = account.querySelector("[data-watch]");
    var watchData = null;
    function watchCall(action, body) {
      var opts = { method: body ? "POST" : "GET", credentials: "same-origin", cache: "no-store" };
      if (body) { opts.headers = { "Content-Type": "application/json" }; opts.body = JSON.stringify(body); }
      return fetch("/api/watch?action=" + action, opts)
        .then(function (r) { return r.json(); })
        .catch(function () { return { ok: false, error: "Could not reach the server." }; });
    }
    function compact(n) {
      if (n == null || !isFinite(n)) return "–";
      var a = Math.abs(n);
      if (a >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
      if (a >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
      if (a >= 1e4) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
      return Number(n).toLocaleString("en-US");
    }
    function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
    function delta(d, key, base) {
      if (!d || d[key] == null) return "<span class=\"flat\" title=\"Needs more daily snapshots\">–</span>";
      var v = d[key];
      var pct = base && base - v ? " <small>(" + (v >= 0 ? "+" : "") + ((v / (base - v)) * 100).toFixed(1) + "%)</small>" : "";
      return "<span class=\"" + (v > 0 ? "up" : v < 0 ? "down" : "flat") + "\">" + (v > 0 ? "+" : "") + compact(v) + pct + "</span>";
    }
    function paintWatch(d) {
      if (!watchWrap || !d) return;
      watchData = d;
      var rows = account.querySelector("[data-watch-rows]");
      var table = account.querySelector("[data-watch-table]");
      var empty = account.querySelector("[data-watch-empty]");
      var foot = account.querySelector("[data-watch-foot]");
      var lim = account.querySelector("[data-watch-limit]");
      var note = account.querySelector("[data-watch-note]");
      var exportBtn = account.querySelector("[data-watch-export]");
      if (lim) lim.textContent = d.channels.length + " of " + d.limit + " on the " + d.plan + " plan." + (d.pro ? "" : " Pro watches 100 and emails you every Monday.");
      var has = d.channels.length > 0;
      if (table) table.hidden = !has;
      if (empty) empty.hidden = has;
      if (foot) foot.hidden = !has;
      if (rows) rows.innerHTML = d.channels.map(function (c) {
        return "<tr data-id=\"" + esc(c.id) + "\"><td><div class=\"ch\">" + (c.thumbnail ? "<img src=\"" + esc(c.thumbnail) + "\" alt=\"\">" : "") + "<div><a href=\"" + esc(c.url) + "\" target=\"_blank\" rel=\"noopener\">" + esc(c.title) + "</a><small>" + esc(c.handle || "") + (c.seenAt ? " · updated " + esc(c.seenAt) : "") + "</small></div></div></td>" +
          "<td class=\"num\">" + compact(c.subscribers) + "</td>" +
          "<td class=\"num\">" + delta(c.d7, "subs", c.subscribers) + "</td>" +
          "<td class=\"num\">" + delta(c.d30, "subs", c.subscribers) + "</td>" +
          "<td class=\"num\">" + delta(c.d7, "views") + "</td>" +
          "<td class=\"num\">" + delta(c.d7, "videos") + "</td>" +
          "<td class=\"num\"><button type=\"button\" class=\"x\" data-unwatch=\"" + esc(c.id) + "\" aria-label=\"Stop watching " + esc(c.title) + "\" title=\"Stop watching\">×</button></td></tr>";
      }).join("");
      if (note) note.textContent = d.pro ? "Snapshots run daily at 05:45 UTC. Your Monday email lists every channel here." : "Free accounts see the table; CSV export and the Monday email are Pro.";
      if (exportBtn) exportBtn.innerHTML = d.pro ? "Export CSV" : "Export CSV <span class=\"pro-tag\">PRO</span>";
      account.querySelectorAll("[data-unwatch]").forEach(function (b) {
        b.addEventListener("click", function () {
          b.disabled = true;
          watchCall("remove", { id: b.getAttribute("data-unwatch") }).then(function (res) {
            if (res && res.ok) paintWatch(res); else b.disabled = false;
          });
        });
      });
    }
    function loadWatch() {
      if (!watchWrap) return;
      var pending = new URLSearchParams(location.search).get("watch");
      if (pending) {
        history.replaceState(null, "", location.pathname);
        var msg0 = account.querySelector("[data-watch-msg]");
        if (msg0) { msg0.textContent = "Adding " + pending + " to your watchlist…"; msg0.className = "fmsg"; }
        watchCall("add", { channel: pending }).then(function (res) {
          if (res && res.ok) { paintWatch(res); if (msg0) { msg0.textContent = "Watching " + res.channel.title + "."; msg0.className = "fmsg good"; } }
          else { loadWatch(); if (msg0) { msg0.textContent = (res && res.error) || "Could not add that."; msg0.className = "fmsg bad"; } }
        });
        return;
      }
      watchCall("list").then(function (res) {
        var msg = account.querySelector("[data-watch-msg]");
        if (res && res.ok) { paintWatch(res); return; }
        if (res && res.code === "no_store") { watchWrap.hidden = true; return; }
        if (msg) { msg.textContent = (res && res.error) || "Could not load your watchlist."; msg.className = "fmsg bad"; }
      });
    }
    var watchForm = account.querySelector("[data-watch-form]");
    if (watchForm) {
      watchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = watchForm.elements.channel;
        var value = (input.value || "").trim();
        var msg = account.querySelector("[data-watch-msg]");
        if (!value) { input.focus(); return; }
        var btn = watchForm.querySelector("button");
        btn.disabled = true;
        msg.textContent = "Looking up the channel…";
        msg.className = "fmsg";
        watchCall("add", { channel: value }).then(function (res) {
          btn.disabled = false;
          if (res && res.ok) {
            input.value = "";
            msg.textContent = res.already ? "Already on your list." : "Watching " + res.channel.title + ".";
            msg.className = "fmsg good";
            paintWatch(res);
          } else {
            msg.innerHTML = esc((res && res.error) || "Could not add that.") + (res && res.code === "limit" && !isPro ? " <a href=\"#\" data-scroll-pro>See Pro</a>" : "");
            msg.className = "fmsg bad";
            var sp = msg.querySelector("[data-scroll-pro]");
            if (sp) sp.addEventListener("click", function (ev) { ev.preventDefault(); var pf = account.querySelector("[data-plan-free]"); if (pf) pf.scrollIntoView({ behavior: "smooth", block: "center" }); });
          }
        });
      });
    }
    var exportBtn2 = account.querySelector("[data-watch-export]");
    if (exportBtn2) {
      exportBtn2.addEventListener("click", function () {
        if (!watchData) return;
        if (!watchData.pro) { var pf = account.querySelector("[data-plan-free]"); if (pf) pf.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
        var head = ["Channel", "Handle", "URL", "Subscribers", "Subs 7d", "Subs 30d", "Views", "Views 7d", "Views 30d", "Videos", "Uploads 7d", "Updated"];
        var lines = [head.join(",")].concat(watchData.channels.map(function (c) {
          return [c.title, c.handle, c.url, c.subscribers, c.d7 ? c.d7.subs : "", c.d30 ? c.d30.subs : "", c.views, c.d7 ? c.d7.views : "", c.d30 ? c.d30.views : "", c.videos, c.d7 ? c.d7.videos : "", c.seenAt].map(function (v) {
            v = v == null ? "" : String(v);
            return /[",\n]/.test(v) ? "\"" + v.replace(/"/g, "\"\"") + "\"" : v;
          }).join(",");
        }));
        var blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "passive-array-watchlist-" + new Date().toISOString().slice(0, 10) + ".csv";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
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
        if (!window.confirm("Delete your account, your email address and your preferences? This signs you out and cannot be undone. The tools keep working without an account.")) return;
        delBtn.disabled = true;
        delMsg.textContent = "Deleting…";
        delMsg.className = "fmsg";
        authCall("delete", {}).then(function (res) {
          if (res && res.ok) {
            marker(null);
            delMsg.textContent = "Done. Your account has been removed and you have been signed out.";
            delMsg.className = "fmsg good";
            setTimeout(function () { location.href = ROOT; }, 2500);
          } else {
            delBtn.disabled = false;
            delMsg.textContent = (res && res.error) || "Could not delete that.";
            delMsg.className = "fmsg bad";
          }
        });
      });
    }
  }
})();
