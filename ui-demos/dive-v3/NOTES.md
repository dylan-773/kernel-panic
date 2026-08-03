# DIVE.EXE, instrument-panel study

Demo: `ui-demos/dive-v3/index.html` (cycle `ux-2026-07-31-desktop-dive`)
Spec: `pipeline/proposals/ux-agent.json`, item `dive-v3`
System laws: [`../RULINGS.md`](../RULINGS.md)
Supersedes (as a candidate): [`../dive/`](../dive/NOTES.md)

**Round 3 (2026-08-01)** answers the second review note ("Device image is
getting cropped. in the bottom right. Get rid of the you and intrusion at
the top, it looks like false buttons"), both asks:

1. **The device macro really was clipping, because round 2's fix was dead
   CSS.** The per-resolution `@container` tier blocks sat at the TOP of the
   stylesheet, above the base `.dv-mon` / `.dv-oppbox` / `.dv-device` rules
   they were written to override; at equal specificity the later base rules
   won the cascade, so the short-stage tier never fired and 768/800-high
   desks still served the 200x150 bezel into a rail that could not hold it
   (measured 21.6 to 85.3px of the cell clipped by the rail's own overflow
   at 16:9 and LAPTOP, across every FEED and BEAT). The blocks now live at
   the end of the right-rail section, where source order lets them win, with
   a comment explaining why they must stay there. Two rail-growth bugs that
   the audit surfaced while proving the worst case are also closed, so the
   right rail is now a STATIC height per scenario and viewport:
   - the INTENT line used to appear only mid-telegraph, growing the oppbox
     by up to two lines; it now reserves its two-line worst case always
     (`min-height: 2lh`, the equal-footprint law), so the telegraph arming
     can never reflow the rail;
   - the BANKED datarow used to toggle with the machine's banking, growing
     the rail by a full row mid-run; banked RAM now rides the INTRUSION
     header bar as an inverse stamp (a row you do not share is a row you
     pay for in full; the bar's height nothing can change).
   The short tier's crop steps to a 150x100 window on the same subject
   (img offsets -365/-355 keep it centred on the cramdeck board seam; the
   base tier keeps 200x150 at -340/-330; both are CSS windows onto the
   same native 880x880 1:1 file, so no re-cut art). Short-tier air also
   tightens (rail gap 7, datarow padding 6, list gap 4, oppbox gap 5), all
   padding, no data, no type below its floor. Verified over CDP with the
   worst case FORCED (longest engine intent injected, banked stamp on,
   every scenario, every beat, every feed, CRT OFF, transforms divided
   out): zero clipped pixels at all three viewports, with 7px of air at
   the tightest combo (16:9, d7-ines) and 23 to 255px elsewhere.
2. **The YOU / INTRUSION chips are gone.** The two bordered turn cells that
   headed the right rail read as false buttons; the `dv-turnpair` block is
   deleted outright, DOM and CSS. The status row absorbs the turn duty as
   an unboxed `// TURN` annotation beside ROUND (same furniture, no box, no
   border, not clickable): the value reads YOU in `--r-ok` on your move,
   INTRUSION in the machine's tone while it is actually moving (the one
   event-tied blink the old chip had, opacity only), and side identity
   never depended on the chips anyway: the board's port tags (YOU /
   INTRUSION / CORE, unboxed schematic annotation) and the INTRUSION box
   header carry it in both schemes and under SCHEME=DEFAULT. The freed rail
   space reflows into the air above the bottom-anchored device macro, which
   is exactly where the height budget needed it; no hole is left because
   the rail's remaining boxes close up from the top.

---

**Round 2 (2026-08-01)** answers the first review note, all three asks:

1. **The board is a BLUEPRINT.** A new schematic channel (`--dv-sch`)
   carries the board's unclaimed fabric: grid, arms, hubs, rulers, hex
   block, slag and port/core tags read in the `--r-note` annotation blue
   under NERV (purple under TOKYO NIGHT), while the DIVE.EXE watermark,
   the frame ticks, the core and every live claim keep the accent, the
   intrusion keeps hazard red, and legal ground keeps nominal green. The
   channel collapses onto the accent under SCHEME=DEFAULT, so the
   reversibility law survives the recolour.
2. **Per-resolution scaling instead of cropping.** The audit found the
   right rail's device block clipping off the stage bottom at 768/800-high
   desks. A short-stage tier (height query, size containment) steps the
   monitor to a 150x113 window on the same 1:1 crop, drops the tell to the
   VT323 floor, and tightens the rail's gaps; nothing is cut. Measured
   clean at all three viewports, and the narrow-stage tier does the same
   for width.
3. **CONTINUE.** The end overlay's second action reads CONTINUE (the
   shipped duel's own label), not NEW DIVE.

---

The flood-claim duel rebuilt to the v3 system, playable end to end. The
ENTIRE duel is the shipped engine (`kernel-panic-site/app/src/game/`)
bundled verbatim by `dive.ts`: board generation, reducer, opponent AI,
legality, traps, par, patch pieces. This page is presentation only, so its
numbers cannot drift from the game.

DIVE.EXE is full-screen and real-time: no window chrome, no 700px tiling
ceiling. Every other law applies, including no-scrollbars absolutely.

## What it decides

**1. Glance order: the board is the focal element; the telegraph is its
sanctioned interrupt.** The board is the largest object on the surface at
every viewport (measured: ~527k px² against ~267k px² for both rails
combined at 16:9). The machine's two-beat telegraph (dashed aim brackets,
INTENT line, virus card) is the one thing allowed to claim the eye over
it, on its own event-tied blink. 2nd the left rail's program keys (the
verbs), 3rd the right rail's route rows (the turn pair that used to share
this slot is gone in round 3; the status row's TURN annotation carries the
duty), 4th the rail
numerals, demoted from the shipped three-way tie (the RAM numeral drops
from 30px-with-glow to the val ramp). Ambient: BUS.LOG, the device macro,
margin dressing.

The type ramp's hierarchy chain is verified numerically, after one
spec-revision round with the ux-agent whose first draft contradicted its
own acceptance: key names clamp(13, 0.6cqi+11, 16), rail numerals
clamp(16, 0.8cqi+13, 20), threat banners clamp(22, 1.6cqi+16, 32), so a
live numeral never drops below a static label and the alarm's voice always
outranks both.

**2. Risk owner: the ROUTE-THREAT system.** `--r-warn` paints exactly the
YOUR ROUTE / ITS ROUTE datarows and the centre threat banners: colour,
inverse video, and a composited difference-blend pulse; ITS ROUTE = AT THE
CORE steps the same alarm to a faster cadence (0.6s vs 1.2s), never a
second colour. Chosen over strain because strain is a pre-dive snapshot
while route-threat is the live, reactable-now signal. Everything that
shared the shipped warn treatment is explicitly DEMOTED to `--r-hazard`
(static colour + inverse, no motion): strain's low band, ARMED NODES with
hidden traps, PAR over budget, and the end-overlay bill rows (the dive has
ended; there is nothing left to react to).

**3. The INTRUSION is structural hazard.** The machine's whole visual
identity (territory fill, port, turn cell, aim brackets, virus card, INT>
log lines) rides one `--dv-o` token: the support ink by default, remapped
to `--r-hazard` the moment a scheme is set. Under NERV the machine reads
as the red thing in an amber world, visibly distinct from the alarm's
hotter, purer red. The telegraph keeps its own blink as a separate motion
channel from the alarm's pulse.

**4. Fluid rails (law 3).** The fixed 236/264px rails become
`clamp(200px, 15cqi, 264px)` / `clamp(220px, 17cqi, 300px)` against the
stage's own container; all three supported viewports render the identical
3-column arrangement with the board scaling in the centre. The declared
700px breakpoint is a law-compliance fallback no supported viewport
reaches. Type rides the cqi ramp with VT323 floors held (the shipped 16px
log lines and 17px key sublines step UP to the 19px floor).

**5. The device macro survives as a 1:1 crop (law 5).** The shipped cell
served the 880x880 dither at rail width, a browser downscale that mushes
the dots to grey: a law-5 violation, flagged for integration. Here it is
loadout-eva's LIVE MONITOR mechanism: the native image cropped in a fixed
200x150 bezel, `--r-aux`, with three FEED treatments: INK TINT (default),
TRUE 1-BIT, FULL COLOUR (`art/cramdeck-color.png`, generated from
`_shared/art/raw/raw-cramdeck.png` by `pipeline/tools/colourise.py`, the
recorded generator; a re-dither of an existing raw, not a new generation).

**6. BUS.LOG never scrolls.** The bottom-anchored clipped ring survives
unchanged: 40 lines in memory, the visible region `overflow: hidden`, old
lines fall off the top. No scroll affordance anywhere on the surface.

**7. BEAT: review states on demand.** The machine's telegraph and the end
overlays should not require waiting or losing on purpose. TELEGRAPH ARMED
plays REAL engine turns (end turn, pump `oppStep`) until a CAST aim arms,
then freezes the machine's cadence and holds the virus card past its
burnout so brackets + INTENT + card review together. END (WIN/LOSS) stamps
the phase over the live state: presentation forcing only; every number on
the bill is the real board's. LIVE reboots the scenario clean.

## Scheme reversibility

Role re-pointing is gated on `html[data-scheme]`: with SCHEME=DEFAULT the
page renders the poster study's single-accent look exactly (the `--dv-o`
alias collapses back onto `--ch2`, warn/hazard rows collapse onto the v2
inverse-video idiom).

## What it still owes

- **The shipped downscale fix**: integration should port the macro-bezel
  crop into `duel.tsx` (`dv-device`), not keep `width:100%` on an 880px
  image.
- Sound uses the shared demo preset table; `busLogArrival` and the tension
  drone helpers map back to the shipped `audio.ts` names at integration.
- The tutorial-facing coach line layer (`kp-coach` / `<Teach>`) is not
  reproduced here; it lives with the shipped component and is untouched by
  this restyle.

## Verification

Driven over CDP (RULINGS law 10 harness): board area exceeds both rails
combined at every viewport; rails resolve to their clamps at 1366 / 2560 /
1280 with the same 3-column arrangement; BUS.LOG shows `overflow: hidden`
and no scrollable element exists on the stage; the monitor is a complete
1:1 window over the native 880x880 image in all three FEED treatments,
200x150 at 21:9 and 150x100 on the short-stage tier, with zero pixels
clipped by the rail or stage at every viewport x beat x feed x scenario
including the forced worst case (round 3); the right rail's height is
static, so no game state can push the device macro into a clip edge;
TELEGRAPH ARMED
shows aim brackets + INTENT (+ held virus card after the cast-aim fix);
END (WIN) prints CORE SEIZED with the live bill, END (LOSS) prints CORE
LOST; both schemes resolve all eight roles distinctly and DEFAULT removes
the attribute; CRT OFF removes all six glass layers; no border-radius on
chrome, no em or en dashes; playable end to end on the shipped engine
(scenario switches change kit/pouch/device per the scenarios table, RESEED
reboards).
