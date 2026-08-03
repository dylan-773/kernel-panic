/**
 * The review index at /kernel-panic-ui, rendered from the manifest.
 *
 * Deliberately design-neutral: this page is the tool that frames the demos,
 * so it loads none of ui-demos/_shared/kp.css. Beyond taste, that stylesheet
 * sets `body { overflow: hidden }` for the fixed-viewport demo pages, which
 * made a long index unscrollable.
 */

import type { Demo, Manifest, Status } from "./manifest";

const SECTIONS: Array<{ status: Status; heading: string; blurb: string }> = [
  { status: "awaiting", heading: "Awaiting review", blurb: "Nothing is waiting on you." },
  { status: "approved", heading: "Approved, queued for integration", blurb: "No demo is queued." },
  { status: "complete", heading: "Integrated", blurb: "Nothing integrated yet." },
  { status: "archived", heading: "Archived", blurb: "Nothing archived." },
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function card(d: Demo): string {
  const href = `/ui-demos/${d.dir}/${d.entry}`;
  const mountable = d.desktop?.mountable === true;
  const last = d.history[d.history.length - 1];

  /* the reviewer's own words outrank the integration record: a demo sent
   * back with a note is the one case where the card has to explain itself */
  const noteBlock = d.note
    ? `<div class="note"><b>${d.status === "awaiting" ? "Changes requested" : "Note"}</b>${esc(d.note)}</div>`
    : "";

  const meta = [
    `<span>${esc(d.cycle)}</span>`,
    last ? `<span>${esc(last.date)} &middot; ${esc(last.status)}</span>` : "",
    d.spec ? `<span>${esc(d.spec.file)} &middot; ${esc(d.spec.item)}</span>` : "",
  ]
    .filter(Boolean)
    .join("\n        ");

  /* data-find is the haystack the filter box matches against */
  const find = esc(`${d.id} ${d.title} ${d.cycle} ${d.summary} ${d.note ?? ""}`.toLowerCase());

  return `
    <article class="card s-${d.status}" data-find="${find}">
      <div class="card-head">
        <h3>${esc(d.title)}</h3>
        <span class="chip st-${d.status}">${d.status}</span>
      </div>
      <p class="summary">${esc(d.summary)}</p>
      <div class="meta">
        ${meta}
      </div>
      ${noteBlock}
      <div class="card-foot">
        <a class="btn primary" href="${href}">Open</a>
        ${mountable ? `<a class="btn" href="/ui-demos/kpos-desktop/index.html?mount=${d.id}">On desktop</a>` : ""}
        ${d.notes ? `<a class="btn" href="/ui-demos/${d.dir}/${d.notes}">Notes</a>` : ""}
      </div>
    </article>`;
}

function section(m: Manifest, spec: (typeof SECTIONS)[number]): string {
  const demos = m.demos.filter((d) => d.status === spec.status);
  const empty = demos.length === 0;
  return `
    <section class="sect" data-status="${spec.status}">
      <div class="sect-head">
        <h2>${spec.heading}</h2>
        <span class="count">${demos.length}</span>
      </div>
      ${empty ? `<p class="empty-line">${spec.blurb}</p>` : `<div class="list">${demos.map(card).join("\n")}</div>`}
    </section>`;
}

export function renderIndex(m: Manifest): string {
  const awaiting = m.demos.filter((d) => d.status === "awaiting").length;
  const approved = m.demos.filter((d) => d.status === "approved").length;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Kernel Panic UI review</title>
<link rel="stylesheet" href="/kernel-panic-ui/index.css" />
</head>
<body>
<div class="wrap">
  <div class="top">
    <h1>Kernel Panic UI review</h1>
    <div class="tagline">${awaiting} awaiting, ${approved} approved and queued for integration</div>
  </div>

  <div class="tools">
    <input id="filter" type="search" placeholder="Filter by title, cycle, or note" autocomplete="off" />
    <span class="hint">Approve or send back from the deck on any demo page.</span>
  </div>

  <p class="no-hits" id="nohits" hidden>No demo matches that filter.</p>

  ${SECTIONS.map((s) => section(m, s)).join("\n")}

  <p class="foot-note">
    Approved demos integrate with <code>/kp-ui integrate the approved UI demos</code>; nothing else is touched.
    Status lives in <code>ui-demos/manifest.json</code>.<br />
    Design laws: <a href="/ui-demos/RULINGS.md">RULINGS.md</a>
  </p>
</div>
<script>
  (function () {
    var box = document.getElementById("filter");
    var nohits = document.getElementById("nohits");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
    var sects = Array.prototype.slice.call(document.querySelectorAll(".sect"));

    box.addEventListener("input", function () {
      var q = box.value.trim().toLowerCase();
      var total = 0;
      cards.forEach(function (c) {
        var hit = !q || c.dataset.find.indexOf(q) !== -1;
        c.hidden = !hit;
        if (hit) total++;
      });
      /* with a filter on, a section with no surviving card is noise: hide it
       * whole rather than leaving a heading over an empty box */
      sects.forEach(function (s) {
        if (!q) { s.hidden = false; return; }
        s.hidden = !s.querySelector(".card:not([hidden])");
      });
      nohits.hidden = !q || total > 0;
    });
  })();
</script>
</body>
</html>`;
}
