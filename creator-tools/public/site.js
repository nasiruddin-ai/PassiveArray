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
      a.textContent = email ? "Account" : "Log in";
      a.setAttribute("href", ROOT + (email ? "account/" : "login/"));
    });
    document.querySelectorAll("[data-signup-link], button[data-signup]").forEach(function (b) {
      b.style.display = email ? "none" : "";
    });
  }
  paintHeader();

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
      location.replace(safe || (ROOT + "account/"));
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
      s.src = "https://accounts.google.com/gsi/client";
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
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = cb;
    document.head.appendChild(s);
  }

  var slots = document.querySelectorAll("[data-google-slot]");
  var onAuthPage = !!document.querySelector("[data-auth]");
  if (slots.length && !onAuthPage && !markedEmail()) {
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
  }

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
