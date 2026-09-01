# LEDGER.LOG v3 (instrument panel)

Cycle `ux-2026-08-31-ledger-v3`, spec item `ledger-v3-instrument-panel`
(`pipeline/proposals/ux-agent.json`). Replaces the look of the shipped
`windows/ledger.tsx`. With manual-v3 this closes the RULINGS.md law-11
queue: no pre-v3 window remains. Pure UI cycle: no gates.

## What it is

The shop's statement, printed fresh on every open: THIS RUN and LIFETIME
as two slash-row rails beside two focal cells (CREDITS, MOST LETHAL), the
print furniture kept at the foot. Every string transcribed verbatim from
the CURRENT `ledger.tsx` and its imported constants; nothing reworded.

## Glance order

1. The CREDITS numeral, VT323 at `clamp(64px, 22cqi, 108px)` in the one
   corner-bracketed cell. Measured 3.7x the masthead at 16:9.
2. The masthead `LEDGER No.N` + the BACK ROOM chip (dashed/dim SEALED,
   `--r-ok` inverse OPEN; a boolean, never hero weight).
3. The rails: `--r-note` labels, `--r-line` values; NEURAL STRAIN carries
   the surface's ONE alarm.
4. The MOST LETHAL dossier cell, `--r-aux` ink tint.
5. Ambient: the hazard-stripe RUN // LIFETIME divider and the print foot
   (dot matrix, seeded hex, bench brand).

All eight roles are owned on this surface (unlike MANUAL.TXT, which
disclaimed warn/aux): strain is a real risk readout and the dossier photo
is a real second signal class.

## What it decides

- **Table-shaped needs no pager.** The row count is fixed by the component
  (6 + 6 rows, two cells), so unlike MANUAL's catalog nothing can outgrow
  the frame; the equal-footprint discipline lands on RUN STATES instead.
- **Four states, one height.** DAY 1 OPENER / MID RUN / DAY 9 STRAINED /
  NO ACTIVE RUN all measure exactly 694px at every supported viewport
  (target 700). NO ACTIVE RUN prints the full statement with the house
  `--` placeholder in every row and a unit-less `--` hero, never the
  shipped collapsed `ACTIVE RUN: none` row. The empty MOST LETHAL state
  is a dashed hole at the identical footprint (a nbsp pins the tag's line
  box so absent matches present to the pixel).
- **The alarm has one owner, enforced twice.** The strain band class rides
  the strain ROW alone (a first build put it on the rail and the warn
  inverse flooded every value: caught on the CDP walk, scoped down), on
  the exact shipped thresholds (risk <= 35, nominal > 70, the
  STRAIN_ALARM_AT / RISK_BAND pair), blinking via loadout-eva's composited
  difference plate. Ambient hazard chrome never animates. See the
  `strain-risk-band-constant` suggestion: the 35 is hand-typed in three
  app files and should be exported once at integration.
- **The law-5 fix.** The shipped cell serves an 880x880-attributed img
  CSS-squashed to 170px (ledger.tsx:155 / styles.css:5107). Here the
  native print (Juno 304, Dex 880) sits in a fixed 172x172 crop window at
  1:1 (140x140 in the sub-700 tiling fallback), framed on the face per
  customer. Dex at 1:1 is an extreme closeup by nature: the honest cost of
  a 5x-resolution source in a fixed window; reframe offsets are one
  number each if the review wants a different framing.
- **FULL COLOUR is not offered** (INK TINT / TRUE 1-BIT only): no
  colourised card portraits exist and this cycle's art budget is zero. A
  colour pass is an art order away if wanted.
- **One frame width (760px) at all three viewports**: LEDGER stays the
  small table-shaped window; the desk absorbs the difference (FREE DESK
  readout proves the tiling win).

## Measured (CDP, reduced-motion, CRT off)

- Window height 694px in all 4 states x 3 viewports; no clipping outside
  the intentional crop window; hero/masthead 3.72x; both schemes resolve
  all eight roles distinctly; no border-radius outside the tube; no
  em/en dash; img attrs = natural size = CSS size (the law-5 check).
- Alarm bands verified per state, band class on exactly one element; the
  risk blink runs `lg-risk-blink` under normal motion and collapses under
  reduced motion with the print sound unaffected.
- The print beat fires once per mount / REPLAY PRINT and never on a
  run-state switch; the masthead retypes only when the ledger number
  changes.

## What it still owes

- Review verdicts: the Dex extreme-closeup framing, INK vs TRUE default,
  and whether SEALED/OPEN's dashed-vs-solid border reads.
- At integration: the shipped `playLedgerPrint()` replaces the WebAudio
  sketch; the crop offsets become per-customer data beside CARD_PORTRAITS
  (the `deviceMacroFor` pattern); the `strain-risk-band-constant`
  suggestion is cheapest to take in the same pass.
