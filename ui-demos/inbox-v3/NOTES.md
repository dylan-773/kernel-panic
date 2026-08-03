# INBOX + CUSTOMER.REC instrument-panel study

Demo: `ui-demos/inbox-v3/index.html` (cycle `ux-2026-07-31-inbox-v3`)
Spec: `pipeline/proposals/ux-agent-inbox-v3.json`, item `inbox-v3-customer-rec`
Brief: `pipeline/briefs/ux-2026-07-31-inbox-v3.md`
System laws: [`../RULINGS.md`](../RULINGS.md)
Reference implementation: [`../loadout-eva/`](../loadout-eva/NOTES.md)
Supersedes (as a candidate, not yet): [`../inbox/`](../inbox/NOTES.md) and
[`../customer-rec/`](../customer-rec/NOTES.md), which the shipped
`windows/inbox.tsx` merged into one window.

INBOX is the second panel built to the v3 system and the first to carry TWO
states in one window. Per RULINGS.md's Process section this cycle ran PURE
UI: no loremaster gate, no tutorial gate, no game-code changes.

**Round 2 (2026-08-01)** answers the first review note, verbatim: *"The
animation on initial open, and switching between items, seems to play twice
very awkwardly. Also, I'm not a fan of the image layout, the device image
gets very cut off. Maybe they are placed side by side at the bottom of the
entry? Just make sure there's enough vertical room for the images to not get
cropped."* Both done, and the window got 10px SHORTER doing it. See "The
doubled animation" and "Imagery" below.

## What it decides

**1. The two focal candidates are resolved by STATE, not by compromise.**
RULINGS.md section 11 flagged this as the hard part of this panel: the DAY
numeral is a hero today and so is the dossier, and a surface gets one focal
element. The answer here is that they are never both live:

- **LIST** (no ticket open): the DAY numeral is the hero at ~74px against
  21px body. Nothing else on that screen earns extreme scale, and the day is
  what frames the three tickets under it.
- **CARD** (a ticket open): the day numeral demotes to a bordered chip at
  14px and DOMINANT ROUTINE takes the focal slot at 44 to 72px, paired with
  the THREAT TIER pip row directly under it.

The handoff is the argument. This window is a DECISION surface, and the
decision is "what am I walking into, and is my kit configured for it". That
points at the machine's dominant routine and the threat tier, not at the day
number and not at the customer's name, which is why NAME drops to an
ordinary field beside the portrait.

Glance order, stated so the type scale can be checked against it:

| | LIST | CARD |
|---|---|---|
| 1st | DAY numeral | DOMINANT ROUTINE + THREAT TIER |
| 2nd | the three subject lines | the READOUT tell, then DIVE and TICKET RATE |
| 3rd | tier pips and pay per row | portrait, NAME/DEVICE/GRID/RAM fields, WARNING |
| ambient | the footline chips, the hint | the ticket list, the footline chips |

Measured: the focal element is the largest text on the page in both states,
by 2.4x to 3.5x over the 19 to 21px body floor depending on the mode label's
length. `ARM: SIPHON` is eleven characters and would overflow its panel on
the ramp alone, so the hero also carries a fit rule
(`min(ramp, (100cqi - 30px) / (len * 0.82))`, `--len` written by JS) and
lands at 58px where `WARD` lands at 72px. Both clear law 2's 2.2x minimum at
every supported viewport.

**2. The window does not resize itself out of its tile.** The shipped
open/close choreography survives, re-timed: the width steps 560 to 940 over
200ms `steps(4)`, then the record pane genies out of the clicked row's
midpoint over 210ms `steps(6)`. What changed is that BOTH end states now fit
the desk, so the growth never costs a neighbour its space. The idle window is
a compact 560px list; only an open ticket earns the full width.

**3. RISK is one thing, and it moves only when it arrives.** `--r-warn`
appears on exactly one element, the head-start WARNING row, which floods
inverse video permanently (colour is never the only channel) and blinks a
three-cycle burst on reveal. THREAT TIER is live data on `--r-line`, and it
never borrows the alarm's colour even on DAY 7 where both are live at once.

## Footprint

Measured with the tube OFF, all 18 combinations of 3 viewports x 3 run
states x 2 window states:

| viewport | window (CARD) | tallest CARD | window (LIST) | tallest LIST |
|---|---|---|---|---|
| 16:9 1366x768 | 940 | 688 | 560 | 604 |
| 21:9 2560x1080 | 1000 | 666 | 560 | 604 |
| laptop 1280x800 | 860 | 688 | 560 | 604 |

Worst case 688px against the 700px target and the 820px ceiling, on DAY 7
LATE (the WARNING, a CLEARED ticket, the fullest kit). The shipped window
opens at `frameW: 1210` and runs past a laptop desk. All three viewports
render the same WIDE arrangement; the narrow tier is never reached.

Getting there took four measured passes, and the numbers are worth keeping
because the first three were wrong in instructive ways:

- **800 to 936px.** The first build put the portrait and device cells side by
  side at 160 each, which left the field column 216px wide. The intake quote
  wrapped to seven lines, the WARNING to three, and the field column alone
  cost 254px. Stacking the two cells in one 160px column and letting the
  fields have the rest paid for itself twice over.
- **-42px:** the run chips moved from the masthead to the footline. In the
  masthead they wrapped onto their own row at the laptop width.
- **-28px:** the footline is ONE row at every supported viewport, which took
  slimmer chip padding and a 9px hint. Five chips plus the hint came to 923px
  against 906px of content box, and lost 28px of desk to a 17px overflow.
- **-22px:** the INTAKE quote moved out of the field column into the ticket
  column, under the list. It is the customer's voice about the ticket you
  just picked, so it belongs there, and the ticket column was already ~120px
  shorter than the pane beside it. This is law 8's lesson in reverse: a row
  you DO share costs nothing.
- **-10px, in round 2, while the images got BIGGER.** Moving both prints to
  a full-width bottom row should have cost 50px. It cost nothing, because
  the action stack (DIVE / CONFIGURE KIT / BACK / TICKET RATE) gave up a row
  of its own and moved into the space beside the prints. Same lesson, third
  time: a row you do not share is a row you pay for in full. The fields also
  went from a two-column block beside the images to a single four-up row
  across the full pane, which cost a row and saved two lines of wrapping.

### The doubled animation

The review's first note was right and there were two independent causes,
both invisible in a still:

1. **The record was built twice per open.** `openTicket` called
   `buildRecord` immediately and again at the genie 210ms later, so the
   READOUT tell and the INTAKE quote each started typing, then reset and
   started again mid-flight. It is built ONCE now, at the moment the pane
   becomes visible, and the pane is held at `opacity: 0` until then so the
   outgoing record never shows through the incoming one.
2. **Every open rebuilt the whole ticket list**, purely to move the
   selection highlight, which replayed all three rows' staggered
   `kp-slot-in` behind the card's own genie. The rows animate ONLY on a load
   sweep now; a selection change moves a class and nothing else.

Switching between two open tickets also had no transition of its own, so the
new record simply appeared. It now shrinks the old record away and grows the
new one out of the row that was clicked: one movement, 190ms plus 210ms.
Instrumented over CDP, both the tell and the quote now restart exactly once
per open, where they restarted twice before.

Re-picking the run state that is already live used to replay the entire load
sweep as well; it is a no-op now.

### The cuts (law 8, in order)

1. **Decorative imagery cut outright:** the 81-cell PrintMark dither block,
   the eye-crop (a second cropped detail of the same portrait, and a CSS
   `background-size: 300%` upscale besides, which law 5 forbids), the
   CardScope oscilloscope trace, and the 12-row HexRows table. All four were
   seeded noise with no decision-relevant content, and none survives being
   shrunk into the new footprint.
2. **Demoted, not cut:** the boxed CUSTOMER.REC panel header and its 4-bar
   battery glyph become a `// CUSTOMER.REC // TICKET n OF 3` eyebrow above
   the hero. The identity is kept, the second header band is not.
3. **Not taken.** The spec put the INTAKE quote behind a tap-tip on NAME.
   Cut 1 freed enough desk that it did not have to be, and it is the only
   fiction on the surface, so it stays visible; it moved columns instead.
4. **Box treatment cut, data kept:** GRID and INTRUSION RAM lose their boxed
   `kp-datarow` and become unboxed ticks, matching their priority. NAME and
   DEVICE join them as ticks rather than boxed rows.
5. **Paging:** reserved for the narrow tier, which no supported viewport
   reaches.

## Variations

- **SCHEME** NERV (default) / TOKYO NIGHT. Both resolve all eight roles to
  distinct values; the token block is copied from `loadout-eva`, not retyped.
- **CRT** FLAT (default) / OFF. Six glass layers, copied. CURVED is not
  rebuilt, per law 6.
- **IMAGE** INK TINT (default) / TRUE 1-BIT / FULL COLOUR, the law 5 row.
- **VIEWPORT** 16:9 / 21:9 / laptop 1280x800, all one arrangement.
- **RUN STATE** DAY 4 FULL SLATE (default), DAY 1 OPENER (sparse: no pouch,
  tier 1 across the board, no head start, 0 credits), DAY 7 LATE (the
  WARNING live, one ticket already CLEARED, and an open record for a customer
  with no print on file, so the alarm, the equal-footprint cleared row and
  the art fallback are all reviewable rather than described).
- **WINDOW STATE** CARD (default) / LIST, so both states are one click away.

## Imagery

Every print renders at 1:1 with no CSS scaling on the `<img>` at all. Rather
than CSS-offsetting the shipped 304x304 roster prints inside a smaller
window, the cells' art is RE-DITHERED from the shipped raws
(`pipeline/art/done/raw-cust-card-*.png`, `_shared/art/raw/raw-portrait.png`,
`raw-cramdeck.png`) at exactly the cell size by `pipeline/tools/dither.py`,
anchored on the subject with `--focus-y`. That is the tool's documented job
and it beats a CSS crop on two counts: the dot grid is generated for the
size it is displayed at, and the framing is chosen rather than inherited.
FULL COLOUR uses `pipeline/tools/colourise.py` on the same crops.

Art budget was NONE and stayed NONE: no generation, no credits, only the
deterministic post-pass over existing raws.

- **Round 2: both prints are 160x160 squares, side by side on the pane's
  bottom row.** Round 1 stacked them in a 160px column with the device
  cropped to a 160x64 band, which is what the review called "very cut off".
  The band is gone and the device now gets the same square the portrait
  does. Round 1's tight-tier rule that narrowed the cells to 128px at the
  laptop width is also gone, for the same reason: the ask was for the images
  NOT to be cropped, so they are the same size at every supported viewport.
- The cell is 164px for a 160px print, because `box-sizing: border-box` was
  giving a 160px cell a 156px content box and quietly clipping 4px off every
  print. The frame is now outside the image rather than eating into it.
- Juno's handheld is dithered `heavy` where every other print is `fine`. Its
  source is a lit screen that `fine` blows out to a white blob; `heavy`
  screentones the flat and the device's actual form survives.
- **Roster gaps render a plate at the identical footprint** (`NO SUBJECT ON
  FILE` / `NO DEVICE ON FILE`, dashed border, checker field), so the column
  never reflows on art coverage. Diegetically the file has no photo on
  record yet. DAY 7's June Aksoy exercises it live.

## Where it departs from the spec, and why

The spec is `pipeline/proposals/ux-agent-inbox-v3.json`. Seven deliberate
departures, all made at the build against measurements:

1. **The INTAKE quote stays visible** (see cut 3 above).
2. **The alarm blinks a three-cycle burst on reveal, not continuously.**
   `DAY_CONFIGS` gives `headStart >= 1` on seven of the ten days, so a
   permanent strobe on that row is ambient motion, which is precisely the
   habituation the reference cycle's gate warned about. The burst marks the
   arrival; the inverse-video flood is the standing second channel.
3. **The cells are two 160x160 prints side by side on the bottom row**, not
   two 128x128 in the support band, and they are re-dithered rather than
   CSS-cropped (see Imagery). Round 1 tried 160 plus a 160x64 device band
   and the review sent it back.
4. **The LIST window is 560px, not 460.** At 460 every subject line wrapped
   to three lines and the chip row to three rows: the window was narrower and
   183px TALLER. 560 lands every subject on two lines.
5. **The run chips are on the footline, not in the masthead** (worth 42px).
6. **The record pane is one grid area, not three.** The spec's
   `focal`/`verdict`/`support` rows are built as a flex column inside a
   single `pane` area so it can carry its own `container-type` for the hero's
   ramp and be the single element the genie transform scales.
7. **Run-state casting changed** so the default view is not a fallback
   plate: DAY 4 opens on Dex Marlowe (tier 3, `redirect`) rather than Wren
   Tallis, because his cram deck is the clearest device print in the roster
   and the default view should show the imagery at its best, and the no-print case moved to DAY 7's June Aksoy
   (tier 4, `ward`). June also replaces the spec's Ines Calloway there,
   because Ines and Aldous are both `armHalt` and the day read repetitively.
   Every customer/tier pair is still checked against `customers.ts` `tiers`
   and `arc.ts` `jobTiers`.

## A gate-shaped finding, noted not fixed

`windows/inbox.tsx:586` renders the footer strain chip as
`crimson={run.strain > 70}`. Strain counts DOWN from `START_STRAIN = 100`
and the run ends at zero (`run-reducer.ts:83`, `:406`), so the shipped chip
flags danger when the operator is HEALTHIEST and goes quiet as they approach
a sever. The ux-agent found this independently. This cycle is pure UI and
does not touch game code, so it is recorded here and the study simply renders
STRAIN as plain data; integration should fix the predicate, and whoever does
should decide whether the correct band is `<= 35` (the reference window's
risk band) rather than inverting the number.

## Verification

Driven against the live page over CDP (headless Chrome plus
`Runtime.evaluate`, which clicks the demo's own rig and measures real
geometry). Every measurement taken with the tube OFF, and divided by the
stage's `transform: scale()` so an ancestor transform cannot inflate it.

Passing:

- height in all 18 viewport x run-state x window-state combinations, max
  698px (target 700, ceiling 820)
- the focal element is measurably the largest text in both states
- no real scrollbar anywhere, and nothing clipped by an `overflow: hidden`
- no `border-radius` on UI chrome (the tube's bezel excluded, which is
  hardware not a control)
- no em or en dashes
- `--r-warn` resolves on exactly one element and its own flash plate; the
  THREAT TIER pips read `--r-line` even on DAY 7 where a WARNING is live
- both schemes resolve all eight roles to distinct values
- images render at their native pixel size in every state (`naturalWidth`
  equals rendered width); the no-print plate matches a filled cell exactly
- all three ticket rows are the identical height, including the CLEARED one
- all three viewports render the WIDE two-column grid; the narrow tier is
  never reached
- reduced motion renders the settled state in one frame (day numeral, chips,
  tell and quote all complete at 400ms; the risk flash animation is `none`)
- the open sequence steps the width 560 -> 750 -> 845 -> 940 and then runs
  the genie, one axis at a time, no tear
- FLAT and OFF are at frame-time parity (p50 33.3 vs 33.4ms, p95 34.4 vs
  34.9ms in headless, which caps at ~30fps; the useful reading is that the
  six glass layers cost nothing measurable, not the absolute numbers)

Two bugs found and fixed by the harness, both invisible to the eye:

- switching run state mid-transition left the open/close latch stuck,
  because `sweep()` clears the timer that would have released it. `sweep()`
  now owns resetting it.
- the rig's own HEIGHT readout ran while the 200ms width step was still in
  flight, so it read the OLD width's text wrapping and under-reported the
  LIST window by 133px. It now re-measures once the transition lands. Worth
  flagging as a pattern: a rig that reports the claim you are being asked to
  approve has to be measured as carefully as the thing it measures.

## Round 3 (2026-08-01)

Answers two review notes at once, because the earlier of them had not been
landed: *"Inbox items need to dynamically scale so that stuff doesn't
overflow. Also, let's not make the images the only thing that can be bright
blue. Try outlining them in bright blue or something."* and *"Ghosting on
the edges when window scales. Vertical scale on inbox buttons breaks after a
few clicks. They need to dynamically resize. Also, WHY IS THE TOP BUTTON
MORE NARROW THAN THE OTHERS???"*

Every settled state measured clean, so all three new complaints lived in the
open/close choreography's mid-flight frames, which steps() holds on screen
for ~50ms each:

- **The vertical scale break.** `data-state` flipped instantly while the
  frame width transitioned 200ms behind it, so the container queries spent
  four held frames reading widths that belong to NEITHER state. Measured
  over CDP: on close the rows leapt to 906x70 and the window collapsed to
  940x471; on open the invisible pane stacked into the transient narrow
  tier and blew the window out to an empty 734px shell. Fix: the `.ib-eva`
  content container takes its FINAL width the moment the state flips
  (`setWin`), and the frame's stepped width animation just clips over
  already-settled content (`overflow: hidden` on `.term`). Rows now derive
  their size from the final layout at every instant: a 10-click
  open/switch/close cycle asserts row geometry identical to first render at
  every settle, and mid-flight samples only ever show the two settled
  geometries (340x114 CARD, 526x92 LIST on DAY 4).
- **The ghosting.** Three sources. `.term` carried its shadows as `filter:
  drop-shadow`, which rasterizes the whole window subtree and re-blurs it
  on every width step; for an opaque rect `box-shadow` renders identically,
  so it is one now. The stage's fit scale was an arbitrary float, leaving
  the raster's edges straddling device pixels; `fit()` now snaps the scale
  so the stage width lands on whole device pixels, and `.lo-fit` carries
  `will-change: transform` so animations sample a stable composited texture
  instead of re-rasterizing tiles. And the incoherent mid-flight frames
  above read as ghost copies of the window; they no longer exist.
- **The narrow top button.** The open row's corner reticles sat at -4px,
  OUTSIDE its border, so the selected ticket rendered 4px wider per side
  than its siblings, and both default casts open the BOTTOM ticket, which
  left the top row reading narrower. The reticles now sit flush with the
  border's outer edge. Same discipline for DAY 7's cleared ticket, the top
  row there: its dashed faint border read as a visibly narrower box, so it
  is solid faint now, with done-ness still carried by the ink, the
  strike-through and the CLEARED tag.
- **The blue outline** (the unlanded earlier note): the print cells' frames
  moved from `--r-struct` to `--r-aux`, so the imagery's signal class is no
  longer confined to the imagery itself. The no-print plate keeps its
  dashed `--ch-faint` gap identity.

Three smaller things the harness surfaced while proving the above: the
genie's `transform-origin` was computed from `getBoundingClientRect`, which
is scaled by the stage's fit transform, so at any browser size but 1:1 the
record grew from the wrong point (it even went negative); it uses offset
math now. The STRAIN and CR chips re-counted from zero on every open and
close because `countUp` animates regardless of the sweep's animate flag;
ambient chrome holds still now, per law 7. And `sweep()` scrubs the pane's
`grow`/`shrink` classes and opacity hold, so a run-state change mid-close
can no longer strand the pane at `scaleY(0.2)` via the `forwards` fill.

Re-measured after all of it: worst case 698.3px (DAY 7 CARD, unchanged),
all 18 combinations; reduced motion settles in one frame; zero em or en
dashes; prints still 1:1 at 160x160.

## What it still owes

- **Integration must swap the ticket-list keyboard handling for the shipped
  `dispatch` contract** and the CUSTOMER.REC fields for the real `RunState`.
  Nothing here is wired to state: DIVE and CONFIGURE KIT are inert.
- `ibWarnReveal` needs to land in `audio.ts` as a real sfxr preset (params in
  the proposal item; envelope values are PLAIN SECONDS). The page uses a
  minimal inline WebAudio approximation, the dadlog study's precedent.
- The shipped `Teach id="analyze-readout"` moment is not represented here.
  It sits on the READOUT tell, which survives at full size, so there is a
  home for it, but the teaching surface itself was out of scope this cycle.
- The strain predicate above.
- The intake quote's height varies with the quote (94 to 117px), so the
  ticket column is not perfectly equal-footprint across customers. It never
  drives the window height, so it costs nothing today, but a much longer
  quote would.
