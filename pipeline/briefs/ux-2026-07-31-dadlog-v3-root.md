# Brief: ux-2026-07-31-dadlog-v3

Goal: rebuild DAD.LOG as a STANDALONE STUDY at
`ui-demos/dadlog-v3/index.html`, to the KP/OS v3 instrument-panel system.
`ui-demos/RULINGS.md` IS the spec; `ui-demos/loadout-eva/` is the reference
implementation. The main game code (`kernel-panic-site/`) is OUT OF SCOPE
this cycle. The user reviews the study first; integration is a later
`/kp-ui integrate` invocation.

USER DIRECTIVE (verbatim): "redesign dad.log to match the new design spec."

PROCESS: this is a redesign of an EXISTING window, so per `RULINGS.md`
"Process" it is PURE UI. No loremaster gate, no tutorial gate, no detours
into game code. Gate-shaped concerns get noted in the demo's `NOTES.md` and
mentioned once in the report.

(This file previously carried `ux-2026-07-31-darknet-v3`, which never
produced a proposal item or a demo, and before that
`ux-2026-07-31-repair-log-v3`, likewise. Both are superseded, not lost:
nothing downstream of either exists. DARKNET.LNK is still queued in
`RULINGS.md` law 11 and that brief's law-by-law analysis is in git.)

## What is being replaced

`ui-demos/dadlog/` (cycle `ux-2026-07-29-dadlog`, integrated 2026-07-29 as
`windows/dadlog.tsx` plus the journal artifact fields, `DADLOG_CHROME`, the
`segmentMount`/`segmentDamaged` presets and the five attachment scans;
`frameW: 1150`). Read the shipped component for STRUCTURE and state flow
only; its look is the thing being replaced. Its `NOTES.md` carries the
design history.

Current anatomy: a volume header strip, a doctype tab strip, a 260px file
index rail, a document viewer with a 322px attachment column, BANK 1/2 hex
furniture on its own row, and a PREV/NEXT/FILE foot. Measured over the three
run states it stands 889 to 976px tall, and the height MOVES with the run
state, which is the thing the v3 ceiling exists to stop.

## The v3 laws this surface has to answer

1. **THE ALARM IS THE DAMAGED SEGMENT (law 1).** An archive reader has
   exactly one thing that is wrong, and `--r-warn` gets it and nothing else.
   Ambient red is `--r-hazard` and never moves.
2. **A READING SURFACE STILL NEEDS ONE FOCAL ELEMENT (law 2).** The
   recovered document's title, at 2.2x or better over body.
3. **PAGING DISCIPLINE (law 8) IS THE CONSTRAINT.** Long documents, a hard
   ~700px ceiling, and no internal scrollbars, ever.
4. **EQUAL-FOOTPRINT EMPTY STATES (law 4).** A day-1 volume with two files
   and a finished volume with ten must be the same shape.
5. **IMAGERY AT 1:1 (law 5).** The attachment scans get re-cut at the cell
   size and offered in ink-tint, true 1-bit and full-colour treatments.

## Variations the study offers

SCHEME (NERV / TOKYO NIGHT), SCAN (INK TINT / TRUE 1-BIT / FULL COLOUR),
CRT (FLAT / OFF), VIEWPORT (16:9 / 21:9 / laptop 1280x800), RUN STATE
(MID RUN / FIRST OPEN / OPENED), plus REPLAY RECOVERY.

## Art budget: 12 credits, spent 0

The six attachment cells are re-cut from the ALREADY COMMISSIONED raws under
`pipeline/art/done/` (the five dadlog scans) and `ui-demos/_shared/art/raw/`
(the solder bench), so no generation was needed. Twelve derived files:
`fine` 1-bit at the new 240x320 cell size via `pipeline/tools/dither.py`, and
a full-colour re-dither via the new `pipeline/tools/colourise.py`.

## Copy

Every player-facing line carries over verbatim from `journal.ts`
(`JOURNAL_ENTRIES` and `DADLOG_CHROME`). No new copy, so no copy orders. No
em or en dashes.
