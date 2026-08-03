# ui-demos

Every UI submission for Kernel Panic, and the site the user reviews them on.

UI does not go straight into the game. A `/kp-ui` cycle ends here: the
Orchestrator builds the approved spec as a standalone demo, registers it at
`status: awaiting`, and stops. The user approves it or sends it back. Only then
does `/kp-ui integrate the approved UI demos` touch `kernel-panic-site/`.

```
bun ui-demos/_review/serve.ts     ->  http://localhost:4180/kernel-panic-ui
```

The index lists every demo under AWAITING REVIEW, APPROVED, COMPLETE and
ARCHIVED. Open one and a review deck rides along in the corner: back to the
index, the demo's status, APPROVE and REQUEST CHANGES, the variation switches
the spec asked for, and a jump to see it on the desktop. The deck is injected
by the server, never written into a demo file, so every page stays openable on
its own and the desktop keeps embedding the studies verbatim.

The static root is the REPO ROOT, not `ui-demos/`. That is load bearing: the
desktop resolves game art through `../../kernel-panic-site/app/public`.

## Layout

```
manifest.json     the durable record: status, cycle, variations, desktop config
RULINGS.md        the KP/OS v2 system laws every surface obeys
_shared/          kp.css, system.css, ui.ts, glyph.ts, sound.ts, shared art
_review/          the review site: serve.ts, index page, deck
<demo>/           index.html, NOTES.md, its own art/ and any *.ts + dist/
```

One folder per demo. `manifest.json` is NEVER cleared between cycles, unlike
everything in `pipeline/`: a demo's review status has to outlive the working
state that produced it.

## Writing a demo

A demo is a standalone page in the KP/OS idiom. It links `../_shared/kp.css`
and `../_shared/system.css`, keeps its own art under `<demo>/art/`, and inlines
the rest. Where behavior, numbers, or sound must not drift from the shipped
game, import them directly from `kernel-panic-site/app/src/game/` and build:

```
cd ui-demos/<demo>
bun build main.ts --outfile dist/main.js --format iife --target browser
```

Then add the manifest entry (`status: "awaiting"`, a one-line `summary`, the
`variations` the spec asked for, and a `desktop` block if the page carries
`.term-bar` chrome). The schema lives in `_review/manifest.ts`.

## The desktop is the harness

`kpos-desktop/` is both a demo and the place to see the others in context. It
reads the manifest and can mount any `.term-bar` study as a real window,
embedded verbatim in a same-origin iframe. The manifest decides what it opens
with; `?mount=<id>` adds any other submission, which is what the index's
ON DESKTOP button and the deck's SUBMISSIONS picker use. Per-demo option
forcing (LOADOUT.CFG on FINE dither, SOLDER.BAY's first-open rack reveal) is
declared in the manifest as selector clicks, not written into the shell.

## Demos

Run the review site for the current status of each. Today:
`kpos-desktop`, `inbox`, `loadout`, `solder`, `repair-log`, `customer-rec`,
`dadlog`, `darknet`, `dive` are all integrated into the app; `craft-station`
is archived (round 1, on the rejected pre-v2 palette).
