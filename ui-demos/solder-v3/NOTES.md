# SOLDER.BAY instrument-panel study

Demo: `ui-demos/solder-v3/index.html` (cycle `ux-2026-07-31-solder-v3`)
Spec: `pipeline/proposals/ux-agent.json`, item `solder-v3-instrument-panel`
System laws: [`../RULINGS.md`](../RULINGS.md)
Reference implementation: [`../loadout-eva/`](../loadout-eva/NOTES.md)
Supersedes (as a candidate, not yet): [`../solder/`](../solder/NOTES.md)

SOLDER.BAY rebuilt to the KP/OS v3 instrument-panel system. The panel queue in
`RULINGS.md` flags this one as the case where the motion budget matters most,
because it is the only window in the set whose surface changes under the
player's hands: drag ghost, hover legal and illegal, deny flash, spark, weld
dot, shake, staggered reveal, typed status. That turned out to be the most
productive constraint on the build, and the measured result is below.

The MACHINE is unchanged. `patch-cells.ts` legality (`armUnionCraft`: the
union must be strictly bigger than BOTH inputs), `shapeClassOf` nouns,
`PATCH_POUCH_MAX` 5, and every status line and the `FOOT_LINE` from
`windows/solder.tsx`, transcribed verbatim. No new state fields, no reducer
change, no new sfx preset. What is being replaced is the LOOK and the
FOOTPRINT.

## Glance order

1. **Z1 THE READ.** The hero glyph, 100px against 21px body, the largest text
   on the page by **4.8x** in every interaction state.
2. **Z3 THE RACK.** Where the hands go. Mid-weight on purpose (see below).
3. **Z2 STATUS.** The typed line telling you what to do next.
4. **Z4 POUCH / LAST WELD.** Ambient bookkeeping, never a first read.
5. **Z5 the placement caption.** Lowest box weight, full text.

## What it decides

**1. A tool window's focal element is the READOUT, not the control.** The
round-1 bench has no first read because it puts a mid-weight schematic, a
mid-weight rack, and a hero-weight floating `JOIN` wordmark on one plane, and
the JOIN wordmark exists in only **one of four** interaction states. So the
surface never had a stable focal element at all: it had a sometimes-two.

This cuts the floating JOIN outright and promotes the shipped minor
`WORKPIECE` datarow into the one focal element at extreme scale. The rack
deliberately does NOT get the treatment, even though it is where the hands
go: it is five co-equal tap targets, and extreme-scaling one of them breaks
law 2 the instant a second slot wants the same weight. This is LOADOUT.CFG's
own resolution (hero numerals = readout = focal; mode chips = the actual
controls = mid-weight) applied to a tool instead of a status window.

What makes it stay focal rather than merely big is that it answers the SAME
question in all four states, "what shape is the reading in front of you":

| state | eyebrow | hero | schematic |
|---|---|---|---|
| IDLE | `// WORKPIECE _` | `----` at full hero footprint | the dashed hole |
| HOLDING | `// WORKPIECE _` | the held piece's noun + arm count | its base arms |
| CANDIDATE | `// JOIN RESULT _` | the UNION's noun + arm count | base + blinking gain arms |
| POST-WELD | `// JOIN RESULT _` | still the union, through the whole 260ms timeline | unchanged |

At commit the shipped `sel`/`pair` reset fires and the hero falls back to IDLE
in the same frame the rack reveals its new slot, so the LAST WELD chip (not
the hero) is what remembers the outcome. The hero always answers "what now",
the chip always answers "what just happened", and the two never compete.

Every value here is a direct presentation of the `schem`/`candidate`/`held`
values `solder.tsx` already computes on every render. Zero new state.

**2. RISK gets exactly one owner, and it is not the DEAD slot.** There is no
strain meter on this surface, so law 1's question is live: what, if anything,
is the alarm? The obvious candidate is the illegal-join state, and the obvious
answer is wrong. A held piece can leave **four of five slots DEAD at once**,
on every single pickup. Painting that red would put four red shapes on screen
during normal healthy use, which is exactly the habituation failure
loadout-eva's round-3 gate had to fix from the other direction.

So `--r-warn` is reserved for an **active rejection event**, meaning the
moment you actually try something illegal:

- the live hover-illegal border, which exists only while a pointer is
  physically over that slot mid-drag
- the one-shot deny flash on an illegal drop, which also MOVES, so the alarm
  carries law 1's second channel at the one moment risk is real
- the status line, but only while `NO_JOIN_LINE` is showing BECAUSE of an
  active rejection

The passive case is explicitly carved out: a held piece with no legal partner
anywhere shows the identical `NO_JOIN_LINE` string in `--r-line`, not
`--r-warn`, because that is a resting condition rather than something you just
did. Both branches are reachable in the SPARSE pouch state. The DEAD slot
itself takes a colour-absent tone derived off `--r-struct`, and keeps its
full-strength diagonal slash.

**3. `--r-aux` goes to the SCHEMATIC.** LOADOUT.CFG spends it on camera
imagery; there is no camera here. But the schematic plate is a genuinely
different signal class from the rack: it is the machine's own diagram of the
geometry, not an interactive control. `--r-aux` takes the grid, the idle hole
and the BASE arms, which is "the steady read". The GAIN arms are carved out
into `--r-data` instead, because they are what the partner ADDS, and `--r-data`
means "what is hot or about to change" everywhere else on this surface. So the
two roles stay consistent across the schematic and the hero both.

**4. The window got much smaller.** Measured, all three viewports x all four
pouch states, tube OFF:

| viewport | window w | tier | height, all 4 pouch states |
|---|---|---|---|
| 16:9 1366x768 | 860 | WIDE | 618 |
| 21:9 2560x1080 | 940 | WIDE | 601.6 |
| laptop 1280x800 | 760 | WIDE | 603 |

Worst case **618px** against a 700px target and an 820px ceiling, from a
shipped window at `frameW: 1060`. All three render the SAME arrangement, and
the narrow tier is not reachable from any supported viewport (the 760px window
still gives a 726px content box, clear of the 700px breakpoint).

The height came in ~80px under target, which was spent rather than banked:
the rack slots are 104px tall (up from 86 in the first build pass), because on
a drag-to-craft surface the most useful thing to do with spare room is make
the tap targets bigger.

These numbers are the review-round-2 figures. Round 1 read 611 / 594 / 603;
the SCHEMATIC tag band added 7px at 16:9 (where the plate is now what drives
the read band) and the arm-count reservation added 7.5px at 21:9. The laptop
tier did not move at either fix, because the hero drives that band at 760px.

## Motion, and the measurement

Law 7 requires compositor properties and reserves motion for events. Two
things on this surface were animating the wrong properties in round 1:

- **the drag ghost** followed the pointer via `transition: left/top`, a LAYOUT
  property animating at pointer rate, inside the CRT glass
- **the hover-legal pulse and the deny flash** both animated `background`, a
  PAINT property, the same mistake loadout-eva measured at 50ms p95

Both are converted: the ghost and the fuse-timeline chip travel reposition via
`transform: translate()` off a `position: fixed; left: 0; top: 0` base, at the
identical 40ms `steps(2)` cadence and the identical t=40/80ms waypoints; the
pulse and flash became `opacity` animations on a promoted `.sv-fx` plate, the
flash using `mix-blend-mode: difference` to get the inverse flip, which is the
pattern loadout-eva measured back to parity.

**The absolute frame-time target could not be measured on this harness.**
Headless Chrome pins `requestAnimationFrame` at 33.3ms here regardless of
`--disable-gpu-vsync` and `--disable-frame-rate-limit`, so p95 frame time
cannot separate a cheap build from an expensive one; every mode reports
33.33ms mean. What it CAN measure is the work, via `Performance.getMetrics`,
and the honest test is an A/B against the page this replaces. Identical
300-move pointer sweep across all five slots, ~10s wall, CRT on, same harness:

| | round 1 (`solder/`) | v3 (`solder-v3/`) |
|---|---|---|
| LayoutDuration | 34.6ms | **1.8ms** |
| layouts forced | 353 | **0** |
| RecalcStyleDuration | 62.1ms | **3.2ms** |
| style recalcs | 549 | **49** |
| ScriptDuration | 53.0ms | **0.5ms** |
| total TaskDuration | 270.1ms | **11.8ms** |

**23x less main-thread work for the same interaction.** The 49 style recalcs
in v3 are exactly the ~50 slot crossings the sweep performs, so the two runs
did the same amount of user-visible work; round 1 spent about eleven times as
much per crossing, and forced a layout on essentially every pointer move.

Ambient chrome never animates: the window border, the Z1 brackets and the
hazard divider are static forever, which is what leaves motion available as a
signal.

**A bug came along with the port.** Round 1's `rejectCancel` added the deny
flash class to the slot element and THEN called `render()`, which rebuilds the
rack and threw the flashed node away in the same frame, so the drag-reject
deny animation never actually played. The flash now lands on the freshly built
element. Worth knowing at integration: `windows/solder.tsx` has the same
ordering, though React's reconciliation may spare it.

Also worth knowing: the TAP path into `rejectCancel` is unreachable by design.
A slot that cannot join the held piece is `disabled`, not a tappable mistake,
so it fires no click. The deny flash is a drag-drop affordance, and the tap
branch is the defensive guard it already is in the shipped component.

## Where it departs from the spec

**Z1 is a full-width band, not a left column.** The spec put THE READ in a
`minmax(240px, 32cqi)` column. The longest noun, `STRAIGHT`, is 8 glyphs of
Silkscreen; measured, it needs 5.46px of width per px of font size, so a 300px
column caps the hero at about 45px. That is 2.3x body, barely clearing the
system's own hierarchy bar, and it would have made the focal element
nominally rather than actually focal.

So Z1 spans the full width, and Z2's status box moves down beside the deck.
The hero roughly doubles (100px at 16:9, 4.8x body) and the window loses no
height, because the row Z2 vacated is a row it was sharing anyway. Law 8's
structural lesson runs in this direction too: a short zone placed beside a
tall one is free.

**Z4 moved to the base of the status column, not the deck's foot.** As
specced, the status box alone left a 240px column reading as dead space beside
a 250px deck. Bringing the bookkeeping chips down anchors it, and shortens the
deck by a row. The split is also honest: the left column is what the bench IS,
the right column is what your hands are doing.

**The interaction-state row is `IDLE / HOLDING / CANDIDATE / POST-WELD`** as
specced, and drives the real `sel`/`pair`/`fuseAt` machinery rather than a
painted mock, so the bench stays fully driveable by tap and drag from wherever
a jump lands it. Options a pouch cannot support are disabled: CANDIDATE and
POST-WELD under SPARSE and EMPTY, and HOLDING under EMPTY.

## Cuts taken (law 8 order)

1. **Decorative imagery**: nothing to cut. Round 1's ruling is preserved, and
   is worth restating because it is the reason this window has no art order:
   imagery inside a tool window only when diegetic, and a framed illustration
   of soldering has no business inside the soldering tool. The SCHEMATIC is
   live SVG, not a dithered raster, so law 5's crop-never-downscale rule does
   not govern it; it resizes in its own viewBox space exactly as the patch
   glyphs already do at 18/22/30/48px.
2. **Prose taught elsewhere**: does NOT apply to `FOOT_LINE`, and this is the
   inverse of loadout-eva's cut. LOADOUT.CFG was allowed to drop its copy of
   the placement explanation precisely because SOLDER.BAY and DIVE.EXE keep it
   at first contact. Cutting it here would leave it nowhere. It renders
   verbatim and uncut, 211 characters, in every state.
3. **Always-visible descriptions to popups**: nothing on this surface has one.
4. **Box treatment**: the boxed `WORKPIECE` datarow becomes an unboxed
   eyebrow (a box directly above a 100px glyph competes with it and adds
   nothing), and the caption drops from round 1's loud 3px-bordered bright-ink
   `.caption` to a quiet 2px `--r-note` foot, matching its new lowest rank.
5. **Paging or tabs**: not needed anywhere, including the unreviewed narrow
   fallback.

Also cut: the floating `JOIN` wordmark (a hierarchy fix, not a height cut, see
above), the join preview's trailing result noun (Z1 already states it at five
times the size), and 200px of window width.

## Variations

- **SCHEME** NERV (default) / TOKYO NIGHT. Token block copied from
  `loadout-eva/index.html`; both resolve all eight roles distinctly.
- **CRT** FLAT (default) / OFF. Six glass layers, verbatim. OFF removes them
  outright rather than fading them, and the page still reads as a finished
  flat-ink print because none of its richness lives in the glass. CURVED is
  not rebuilt.
- **VIEWPORT** 16:9 / 21:9 / laptop 1280x800, all the same arrangement.
- **POUCH STATE** SCRAP HAUL (5/5, rich in legal joins) / DAY 4 (the shipped
  `data.ts` mock, default) / SPARSE (one elbow) / EMPTY. The last two are
  where the equal-footprint law is checked, and SPARSE is the one state that
  reaches both the passive and the active `NO_JOIN_LINE` treatments.
- **INTERACTION STATE** and **REPLAY LOAD** as above.

## Sound

No new preset is proposed. The six shipped SOLDER.BAY voices (`solderPickup`,
`solderHoverLegal`, `solderHoverIllegal`, `solderReject`, `solderArc`,
`pieceFuse`, `audio.ts:136,139-143`) already cover the interaction lifecycle
1:1 with every visual event the redesign adds or converts, so a new one would
be a duplicate voice rather than a gap. They are inline WebAudio stand-ins
here, as in the dadlog and loadout-eva studies; the characters match, the
envelopes are not the shipped sfxr params. `CANCEL` and `ESC` with no flash
target stay silent, matching shipped behaviour: withdrawing from a decision is
not an error.

## Gate-shaped concerns (this cycle ran PURE UI, per RULINGS "Process")

No loremaster or tutorial gate ran, because this is a redesign of an existing
window. Two things a gate would probably have raised, recorded rather than
assumed away:

- **`LINE_IDLE` reads oddly at 0/5.** "PICK A PIECE." with literally no pieces
  present is a reachable early-run state, not a synthetic one. Fixing the copy
  is the Narrative Director's lane; this ships the shipped string.
- **`JOIN RESULT` and `// PLACEMENT`** are coined here as bare labels, on the
  precedent set by `OPERATOR RIG`, `PLACE COST` and `// BENCH SUPPORT`. Every
  sentence-shaped string on the page is verbatim shipped copy.

## What it still owes

- Integration must port the `.sv-fx` plate and the transform-based ghost into
  `windows/solder.tsx` deliberately. Half-porting this (keeping `left`/`top`
  on the drag ghost) throws away the entire measured gain above.
- The reserved join-preview and action rows leave visible empty space in the
  deck while holding without a candidate. That is a deliberate accepted cost:
  it is what keeps the rack from jumping when a candidate locks, which matters
  more on a surface the player is dragging across. Same call loadout-eva made
  about its trinity's dead space.
- Nothing is wired to real run state; the pouch is demo data, as a study.
- The frame-timing acceptance check in the spec is stated in absolute ms and
  cannot be evaluated on this harness. The A/B above is the substitute, and it
  is arguably the better test, but the absolute number is unverified.

## Review round 1: changes requested

> "Nearly perfect, but, the 'schematic' text when having a vertical straight
> piece selected overlaps with the top of the piece, can you give it just a
> touch more vertical room?"

Real, and worse than reported: it collides at ALL THREE viewports, not only
the tight one. It survived round-1 verification because the collision test
compared bounding rects, and `getBoundingClientRect()` on an SVG `<line>`
reports **zero** stroke width. The painted arm is 13 viewBox units of stroke
plus a `stroke-linecap: square` cap on the end, none of which is in the rect.
Inflating each arm rect by half its computed stroke on all four sides before
testing reproduces it: ~2px of overlap at 16:9, ~16px at the laptop tier.

The tag now owns a band of its own at the top of the plate, as `padding-top`
rather than a shorter SVG. That distinction matters: the plate is deliberately
304:228 in both its sizes, so the grid cells are square, and shrinking the SVG
inside a fixed box would have made them oblong. Measured clearance from the
tag's bottom edge to the nearest arm paint is now 12.8px at the wide tier and
10.7px at the tight one, in every state that draws arms (a selected piece and
a candidate pair, which also draws the blinking gain arms).

**Also fixed, not reported.** Attributing the new heights turned up a second
under-reservation of the same kind: `.sv-armcount` reserved `min-height: 1.1em`
while its filled line box is Silkscreen's `normal`, about 1.52em. The row
therefore grew ~8px the instant a piece was picked up, walking the whole
window down 8px at 21:9 on every selection. `line-height` is now pinned so the
empty and filled boxes are the same by construction. The window no longer
changes height on select at any viewport. It costs 7.5px of idle height at
21:9, which is the honest price of reserving what the filled state needs, and
it is the same law-4 argument the empty rack already makes.

Both are pure CSS in `ui-demos/solder-v3/index.html`. Neither touches the
machine, the copy, the roles, the motion inventory or the cuts, so nothing
above this section changes except the height table.

## Verification

Driven against the live page over CDP (headless Chrome plus `Runtime.evaluate`
and `Input.dispatchMouseEvent`, so the harness clicks the demo's own rig and
drags real pointers). **44 checks, all passing.**

Tag/arm collision, 12 combinations after review round 1 (3 viewports x 2
arm-drawing states x 2 pouches): no overlap between the SCHEMATIC tag and any
painted arm, with every arm rect inflated by half its computed stroke first;
the drawing area still 304:228 to within 0.5% at both plate sizes; and the
window the same height with a piece selected as without, at every viewport.

Geometry, 12 combinations: height ceiling worst case 618px; all three
viewports resolving to the same WIDE two-column arrangement with no tab strip;
the rack and the hero box byte-identical across all four pouch states at every
viewport (the equal-footprint law, checked at the hero as well as the rack).

System laws: no border-radius anywhere inside the window; no em or en dash; no
internal scrollbar and no page-level horizontal scroll; `FOOT_LINE` verbatim
at 211 characters; every live animation and transition on `steps()` timing;
six glass layers under FLAT and zero under OFF; heavy corner brackets present
on exactly one zone.

Roles: both schemes resolving all eight tokens distinctly; `--r-warn` absent
from the page at rest and absent from every DEAD slot while a piece is held;
`--r-aux` reaching the schematic's base arms and nothing outside the plate;
gain arms rendering `--r-data` on the shipped 0.9s `steps(2)` blink;
`--r-hazard` confined to the window edge, the brackets and the divider.

Interaction, driven with real pointer events: the hero largest in all four
states at 4.8x; no floating JOIN wordmark in any state; the drag ghost
positioning by `transform` with `left`/`top` pinned at 0; hover-legal pulsing
via the opacity keyframe; hover-illegal static and `--r-warn`; the deny flash
playing after the re-render on a difference-blend plate; an illegal drop
changing nothing; a legal drop welding, banking to LAST WELD and falling back
to idle; ESC cancelling; the interaction row disabling what each pouch cannot
support and the bench still driveable by drag afterwards; REPLAY LOAD
re-running the stagger without disturbing the interaction state.

Reduced motion, 4 checks with the media feature emulated: the status line
complete with no typewriter and no caret, the rack settled with no stagger,
a weld committing in one frame with no spark, ghost, weld dot or shake, and
nothing on the settled surface animating.

Frame cost: the A/B in "Motion" above.
