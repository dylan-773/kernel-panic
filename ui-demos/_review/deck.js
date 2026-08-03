/**
 * The review deck, injected by the review server into every demo page.
 *
 * It never ships with a demo: the html files stay standalone-openable and
 * byte-identical to what the desktop embeds. Three jobs:
 *   1. navigation and identity (where am I, what cycle, what status)
 *   2. the verdict: approve, or send back with a note
 *   3. the switches - manifest-declared variations, and on the desktop, the
 *      picker that mounts any submission as a window
 *
 * The desktop embeds studies in same-origin iframes, so the very first thing
 * this does is bail when it is not the top document. Otherwise every window
 * on the desktop would grow its own deck.
 */
(function () {
  if (window.top !== window.self) return;

  var BASE = "/kernel-panic-ui";
  var self = document.currentScript;
  var demoId = self && self.dataset.demo;
  if (!demoId) return;

  var manifest = null;
  var demo = null;

  fetch(BASE + "/api/manifest")
    .then(function (r) { return r.json(); })
    .then(function (m) {
      manifest = m;
      demo = m.demos.filter(function (d) { return d.id === demoId; })[0];
      if (demo) build();
    })
    .catch(function () { /* served without the review server: no deck, no harm */ });

  /* ---------------- applying a variation or hook ---------------- */

  function resolvePath(path) {
    var parts = path.split(".");
    var obj = window;
    for (var i = 0; i < parts.length - 1; i++) {
      obj = obj && obj[parts[i]];
      if (!obj) return null;
    }
    var fn = obj && obj[parts[parts.length - 1]];
    return typeof fn === "function" ? fn.bind(obj) : null;
  }

  function apply(action) {
    if (!action) return false;
    if (action.click) {
      /* ordered fallback: the first selector that matches wins, which is how
       * "the currently selected scenario, else the first one" is expressed */
      for (var i = 0; i < action.click.length; i++) {
        var elx = document.querySelector(action.click[i]);
        if (elx) { elx.click(); return true; }
      }
      return false;
    }
    if (action.attr) {
      var t = action.attr.sel === "html" ? document.documentElement : document.querySelector(action.attr.sel);
      if (!t) return false;
      t.setAttribute(action.attr.name, action.attr.value);
      return true;
    }
    if (action.call) {
      var fn = resolvePath(action.call);
      if (!fn) return false;
      fn.apply(null, action.args || []);
      return true;
    }
    return false;
  }

  /* ---------------- dom helpers ---------------- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function sect(label) {
    var s = el("div", "kp-deck-sect");
    if (label) s.appendChild(el("label", "", label));
    return s;
  }

  /* ---------------- build ---------------- */

  function build() {
    document.documentElement.classList.add("kp-deck-on");

    var deck = el("aside", "kp-deck");
    deck.id = "kp-deck";

    var bar = el("div", "kp-deck-bar");
    bar.appendChild(el("b", "", "REVIEW"));
    var mini = el("span", "kp-deck-mini", demo.title);
    bar.appendChild(mini);
    var caret = el("i", "", "-");
    bar.appendChild(caret);
    deck.appendChild(bar);

    var body = el("div", "kp-deck-body");
    deck.appendChild(body);

    /* identity + nav */
    var back = el("a", "kp-deck-back", "◀ INDEX");
    back.href = BASE;
    body.appendChild(back);
    body.appendChild(el("div", "kp-deck-title", demo.title));
    body.appendChild(el("div", "kp-deck-meta", demo.cycle));

    var chip = el("span", "kp-deck-chip s-" + demo.status, demo.status.toUpperCase());
    var chipWrap = el("div");
    chipWrap.appendChild(chip);
    body.appendChild(chipWrap);

    /* variations */
    (demo.variations || []).forEach(function (v) {
      var s = sect(v.label);
      var row = el("div", "kp-deck-row");
      v.options.forEach(function (o) {
        var b = el("button", v.default === o.id ? "on" : "", o.label);
        b.addEventListener("click", function () {
          var ok = apply(o.apply);
          if (v.default !== undefined && v.default !== null) {
            /* latched group: only mark it selected if the page took it */
            if (ok) {
              row.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); });
              b.classList.add("on");
            }
          }
        });
        row.appendChild(b);
      });
      s.appendChild(row);
      body.appendChild(s);
    });

    /* desktop: the picker on the host, a jump link everywhere else */
    if (demo.id === "kpos-desktop") {
      body.appendChild(mountPicker());
    } else if (demo.desktop && demo.desktop.mountable) {
      var s2 = sect("DESKTOP");
      var jump = el("button", "", "PREVIEW ON DESKTOP");
      jump.style.width = "100%";
      jump.addEventListener("click", function () {
        location.href = "/ui-demos/kpos-desktop/index.html?mount=" + demo.id;
      });
      s2.appendChild(jump);
      body.appendChild(s2);
    }

    /* verdict */
    body.appendChild(verdict(chip));

    document.body.appendChild(deck);

    var collapsed = localStorage.getItem("kp-deck-collapsed") === "1";
    if (collapsed) deck.classList.add("collapsed");
    caret.textContent = collapsed ? "+" : "-";
    bar.addEventListener("click", function () {
      var now = deck.classList.toggle("collapsed");
      caret.textContent = now ? "+" : "-";
      localStorage.setItem("kp-deck-collapsed", now ? "1" : "0");
    });
  }

  /* ---------------- the submissions picker (desktop only) ---------------- */

  function mountPicker() {
    var s = sect("SUBMISSIONS");
    var slot = el("div");
    s.appendChild(slot);

    var mountable = manifest.demos.filter(function (d) {
      return d.desktop && d.desktop.mountable;
    });

    function render() {
      slot.textContent = "";
      mountable.forEach(function (d) {
        var lab = el("label", "kp-deck-mount");
        var cb = el("input");
        cb.type = "checkbox";
        cb.checked = window.kpDesktop.list().indexOf(d.id) !== -1;
        cb.addEventListener("change", function () {
          if (cb.checked) {
            window.kpDesktop.mount(d.id);
            window.kpDesktop.open(d.id);
          } else {
            window.kpDesktop.unmount(d.id);
          }
        });
        lab.appendChild(cb);
        lab.appendChild(el("span", "", d.title));
        lab.appendChild(el("span", "tag", d.status.toUpperCase()));
        slot.appendChild(lab);
      });
    }

    /* the host only exists once the desktop is built, which is several
     * seconds and two clicks (boot, then login) after this script runs */
    if (window.kpDesktop) {
      render();
    } else {
      slot.appendChild(el("div", "kp-deck-say", "waiting for the desktop to boot..."));
      var poll = setInterval(function () {
        if (!window.kpDesktop) return;
        clearInterval(poll);
        render();
      }, 300);
    }

    return s;
  }

  /* ---------------- the verdict ---------------- */

  function verdict(chip) {
    var s = sect("VERDICT");

    var note = el("textarea");
    note.placeholder = "note (required to send back)";
    note.value = demo.note || "";
    s.appendChild(note);

    var say = el("div", "kp-deck-say");

    function send(status) {
      if (status === "awaiting" && !note.value.trim()) {
        say.className = "kp-deck-say err";
        say.textContent = "say what needs to change";
        return;
      }
      say.className = "kp-deck-say";
      say.textContent = "saving...";
      fetch(BASE + "/api/verdict", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: demo.id, status: status, note: note.value.trim() || null }),
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.j.error || "write failed");
          demo.status = res.j.demo.status;
          demo.note = res.j.demo.note;
          chip.className = "kp-deck-chip s-" + demo.status;
          chip.textContent = demo.status.toUpperCase();
          say.className = "kp-deck-say ok";
          say.textContent = status === "approved" ? "approved. it will integrate next." : "sent back.";
        })
        .catch(function (e) {
          say.className = "kp-deck-say err";
          say.textContent = String(e.message || e);
        });
    }

    var go = el("button", "go", "APPROVE");
    go.addEventListener("click", function () { send("approved"); });
    var bk = el("button", "back", "REQUEST CHANGES");
    bk.addEventListener("click", function () { send("awaiting"); });

    var r1 = el("div", "kp-deck-row");
    r1.appendChild(go);
    var r2 = el("div", "kp-deck-row");
    r2.appendChild(bk);
    s.appendChild(r1);
    s.appendChild(r2);
    s.appendChild(say);
    return s;
  }
})();
