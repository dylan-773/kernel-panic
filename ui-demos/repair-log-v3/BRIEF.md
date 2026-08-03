# Brief: ux-2026-07-31-repair-log-v3

NOTE ON LOCATION: this brief was written to `pipeline/BRIEF.md` at the start
of the cycle and was overwritten there mid-cycle by a DARKNET.LNK brief. It
lives here instead so the cycle has a durable source. `pipeline/BRIEF.md` is
NOT the brief for this demo; this file is.

Goal: rebuild REPAIR.LOG as a STANDALONE STUDY at
`ui-demos/repair-log-v3/index.html`, to the KP/OS v3 instrument-panel system.
`ui-demos/RULINGS.md` IS the spec; `ui-demos/loadout-eva/` is the reference
implementation. The main game code (`kernel-panic-site/`) is OUT OF SCOPE
this cycle. The user reviews the study first; integration is a later
`/kp-ui integrate` invocation.

USER DIRECTIVE (verbatim): "redesign repair.log to match the new design
spec."

PROCESS: this is a redesign of an EXISTING window, so per `RULINGS.md`
"Process" it is PURE UI. No loremaster gate, no tutorial gate, no detours
into game code. Gate-shaped concerns get noted in the demo's `NOTES.md` and
mentioned once in the report.

## What is being replaced

`ui-demos/repair-log/` (cycle `ux-2026-07-28-kpos-redesign`, integrated as
`windows/report.tsx`, `frameW: 1150`). Read the shipped component for
STRUCTURE and state flow only; its look is the thing being replaced.

Current anatomy, three rails plus a footer, all of which must survive in
some form (or be cut on the record per law 8):

- **left rail**: the client figure cell (1-bit portrait, `REPAIR LOGGED`
  tag), and the DIVE LOG rail typing the finished dive's bus log
- **centre rail**: hero verdict `REPAIR LOGGED` with the customer's win line
  typing in and CLIENT / DEVICE / TICKET RATE chips; the strain band (ECG
  strain trace over a grid, beside NEURAL STRAIN's big chip number, `n
  STRAIN LEFT`, and the itemized chip receipt); the AUGMENT CACHE draft
  (2-up cards, PICK ONE / INSTALLED / DRY, plus the bays-full EJECT swap
  flow); and four telemetry sparklines (RAM FLOW, ROTATIONS, TRAP FEED,
  LINK NOISE)
- **right rail**: the PAYOUT counter with its itemized rate receipt; the
  patch-piece poster (glyph, noun, flavour line, BANKED / LEFT ON THE BENCH
  status); the PATCH POUCH strip with fresh and lost slots
- **footer**: KP/OS REPAIR BENCH v9.2 brand with the battery pips, DAY /
  TICKET / CREDITS chips, and the primary button (NEXT TICKET / CLOSE THE
  DAY / SKIP THE DRAFT)

Interaction that must stay live: the draft is a real choice (pick one,
siblings dim, INSTALLED stamp, footer label flips), and the bays-full path
opens the EJECT panel. Everything else is readout.

## The v3 laws this surface has to answer

Every law in `RULINGS.md` applies. The five that bite hardest here:

1. **GLANCE ORDER (law 2).** The panel queue's own note says the verdict is
   the obvious focal element. Say so or overrule it, then build the type
   scale to enforce it: ONE focal element at extreme scale, 2x+ the next
   largest thing. The competitors are real and must be demoted explicitly:
   PAYOUT and NEURAL STRAIN are both currently big numerals, and the draft
   is the only thing on the surface the player must ACT on.
2. **HEIGHT CEILING (law 3).** ~700px target, 820px absolute, measured with
   the CDP harness in law 10. The shipped window is the densest in the
   queue: three rails, eleven blocks, five SVG readouts. Cut in law 8's
   order and record every cut and its reason.
3. **RISK HAS AN OBVIOUS OWNER HERE (law 1).** The strain chip is this
   surface's alarm and the only thing that may take `--r-warn`. Give it the
   second and third channels the law demands: inverse video AND motion, on
   the composited difference-blend pattern the reference measured at frame
   parity. Ambient chrome stays dead still. The sparklines, the ECG trace,
   the receipt minus rows and the LEFT ON THE BENCH status must NOT take
   `--r-warn`.
4. **THE ECG TRACE IS THE SURFACE'S SIGNATURE READOUT.** It is the one
   element here that no other window has. Decide whether it earns focal
   scale beside the verdict or stays a support readout, and whether the four
   sparklines survive at all.
5. **EQUAL-FOOTPRINT EMPTY STATES (law 4).** This surface has more empty
   branches than any other: a dry cache, no piece this ticket, a full pouch,
   a zero chip, an empty payout receipt. A CLEAN SWEEP result must occupy
   the same footprint as a ROUGH WIN.

`--r-aux` owns the client figure cell, which is this surface's camera-class
imagery, and it takes the three FEED treatments per law 5. `--r-ok` owns
CLEAN and the BANKED status. `--r-data` owns the focal numeral only.

## Variations

- **SCHEME**: NERV (default) / TOKYO NIGHT.
- **CRT**: FLAT (default) / OFF. Do not rebuild CURVED.
- **VIEWPORT**: 16:9 1366x768 / 21:9 2560x1080 / laptop 1280x800, all three
  rendering the SAME arrangement.
- **FEED**: INK TINT / TRUE 1-BIT / FULL COLOUR on the client figure cell.
- **SCENARIO**: ROUGH WIN, CLEAN SWEEP, CAP AND DRY, and a STRAINED / BAYS
  FULL case so the `--r-warn` alarm and the EJECT swap flow are both
  reviewable rather than described.
- **REPLAY LOAD** for the load choreography.

## Art budget: NONE

The three client figures already exist at
`ui-demos/repair-log/art/report-client-{sable,juno,aldous}.png` (162x234,
FINE dither, 1:1). Reuse them; crop, never downscale. A FULL COLOUR
treatment is a re-dither of an existing raw
(`_shared/art/raw/raw-report-client-*.png`), not a new generation.

## Copy

Every player-facing line on this surface is already shipped copy and carries
over verbatim. No em or en dashes.
