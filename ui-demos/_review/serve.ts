/**
 * The Kernel Panic UI review site.
 *
 *   bun ui-demos/_review/serve.ts        ->  http://localhost:4180/kernel-panic-ui
 *
 * Static root is the REPO ROOT, not ui-demos/. That is load bearing: the
 * desktop resolves game art through `../../kernel-panic-site/app/public`, so
 * anything rooted deeper serves 404s for every portrait and still.
 *
 * Demo pages are served untouched except for one injected line pair before
 * </body> that pulls in the review deck. No demo file carries review chrome,
 * so each page stays openable on its own and the desktop keeps embedding the
 * studies verbatim.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { join, normalize, resolve } from "node:path";
import {
  load,
  save,
  validate,
  resolveVariations,
  demoByPath,
  STATUSES,
  REPO_ROOT,
  UI_DEMOS,
  type Manifest,
  type Status,
} from "./manifest";
import { renderIndex } from "./index-page";

const PORT = Number(process.env.PORT ?? 4180);
const BASE = "/kernel-panic-ui";
const REVIEW = join(UI_DEMOS, "_review");

/* fail loudly at startup: a typo in the manifest should not become a blank
 * section three clicks later */
const startupErrors = validate(load());
if (startupErrors.length) {
  console.error("manifest.json is invalid:");
  for (const e of startupErrors) console.error("  " + e);
  process.exit(1);
}

const NO_STORE = { "cache-control": "no-store" };

const html = (body: string, status = 200) =>
  new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8", ...NO_STORE } });

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...NO_STORE },
  });

/** api/manifest hands out variations already resolved, so the deck stays dumb. */
function resolved(m: Manifest) {
  return {
    version: m.version,
    demos: m.demos.map((d) => ({ ...d, variations: resolveVariations(m, d) })),
  };
}

/** NOTES.md and RULINGS.md read in the browser rather than downloading.
 * Neutral chrome like the index, and for the same two reasons: this is the
 * tool around the demos, and kp.css would pin the page at overflow:hidden. */
function renderMarkdown(fsPath: string, title: string): Response {
  const text = readFileSync(fsPath, "utf8");
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return html(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<link rel="stylesheet" href="${BASE}/index.css" />
<style>
  body { padding: 26px 24px 64px; }
  .doc { max-width: 900px; margin: 0 auto; }
  .doc > .btn { display: inline-block; margin-bottom: 18px; }
  h1 { font-size: 14px; font-weight: 600; color: var(--fg-mid); margin: 0 0 14px;
       font-family: var(--mono); overflow-wrap: anywhere; }
  pre { font-family: var(--mono); font-size: 13px; line-height: 1.65;
        white-space: pre-wrap; overflow-wrap: anywhere; margin: 0; }
</style>
</head>
<body>
<div class="doc">
  <a class="btn" href="${BASE}">&#8592; Index</a>
  <h1>${title}</h1>
  <pre>${esc}</pre>
</div>
</body>
</html>`);
}

/** the one edit made to a demo page, and only in flight */
function injectDeck(source: string, demoId: string): string {
  const tag =
    `\n<link rel="stylesheet" href="${BASE}/deck.css" />` +
    `\n<script src="${BASE}/deck.js" data-demo="${demoId}"></script>\n`;
  return source.includes("</body>")
    ? source.replace(/<\/body>/i, `${tag}</body>`)
    : source + tag;
}

function staticFile(pathname: string): Response {
  const target = resolve(REPO_ROOT, "." + normalize(pathname));
  if (!target.startsWith(REPO_ROOT)) return new Response("nope", { status: 403 });

  let fsPath = target;
  if (existsSync(fsPath) && statSync(fsPath).isDirectory()) fsPath = join(fsPath, "index.html");
  if (!existsSync(fsPath)) return new Response("not found: " + pathname, { status: 404 });

  if (fsPath.endsWith(".md")) {
    return renderMarkdown(fsPath, fsPath.slice(REPO_ROOT.length + 1));
  }

  if (fsPath.endsWith(".html")) {
    const demo = demoByPath(load(), pathname);
    const source = readFileSync(fsPath, "utf8");
    return html(demo ? injectDeck(source, demo.id) : source);
  }

  return new Response(Bun.file(fsPath));
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const p = decodeURIComponent(url.pathname);

    if (p === "/") return Response.redirect(BASE, 302);
    if (p === BASE || p === `${BASE}/`) return html(renderIndex(load()));

    if (p === `${BASE}/index.css`) return new Response(Bun.file(join(REVIEW, "index.css")));
    if (p === `${BASE}/deck.css`) return new Response(Bun.file(join(REVIEW, "deck.css")));
    if (p === `${BASE}/deck.js`) return new Response(Bun.file(join(REVIEW, "deck.js")));

    if (p === `${BASE}/api/manifest`) return json(resolved(load()));

    if (p === `${BASE}/api/verdict`) {
      if (req.method !== "POST") return json({ error: "POST only" }, 405);
      const body = (await req.json()) as { id?: string; status?: Status; note?: string | null };
      if (!body.status || !STATUSES.includes(body.status)) return json({ error: "bad status" }, 400);

      const m = load();
      const demo = m.demos.find((d) => d.id === body.id);
      if (!demo) return json({ error: `unknown demo "${body.id}"` }, 404);

      demo.status = body.status;
      demo.note = body.note?.trim() || null;
      demo.history.push({
        status: demo.status,
        date: new Date().toISOString().slice(0, 10),
        note: demo.note,
      });
      save(m);
      console.log(`  ${demo.id} -> ${demo.status}${demo.note ? `  (${demo.note})` : ""}`);
      return json({ ok: true, demo });
    }

    return staticFile(p);
  },
});

const m = load();
const count = (s: Status) => m.demos.filter((d) => d.status === s).length;
console.log(`\n  KERNEL PANIC // UI REVIEW   http://localhost:${PORT}${BASE}`);
console.log(
  `  ${count("awaiting")} awaiting, ${count("approved")} approved, ` +
    `${count("complete")} complete, ${count("archived")} archived\n`,
);
