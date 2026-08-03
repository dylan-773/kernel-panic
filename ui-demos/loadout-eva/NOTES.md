# LOADOUT.CFG instrument-panel study

Demo: `ui-demos/loadout-eva/index.html` (cycle `ux-2026-07-31-loadout-eva`)
Spec: `pipeline/proposals/ux-agent.json`, item `loadout-eva-instrument-panel`
System laws: [`../RULINGS.md`](../RULINGS.md)
Supersedes (as a candidate, not yet): [`../loadout/`](../loadout/NOTES.md)

A maximalist retro-futurist rebuild of LOADOUT.CFG, Evangelion
instrumentation in both structure and colour. It exists to answer three
complaints about the shipped window, in the user's words: it feels
cluttered, its size makes window management rough, and it does not scale to
other aspect ratios or resolutions.

**Round 5 (2026-07-31)** answers the fourth review note. CURVED is gone: it
made the bottom bar wonky and, in the user's words, "the panel looks the same
as flat", so it was paying a real cost for a difference they could not see.
Schemes cut to the two that landed, NERV and TOKYO NIGHT. And the bench feed
gained a treatment switch so the camera can be seen ink-tinted, as true
1-bit, or in full colour.

**Round 4 (2026-07-31)** answered the third review note. The curved tube was
cropping the UI, worst at 21:9 where it "just looks wrong"; NERV wanted blue
highlights without disturbing the hierarchy; and the extra schemes wanted to
be more distinctly retro. All three done, plus this cycle went PURE UI at
the user's direction: no loremaster, no tutorial gate, no detours into game
code, because this is a redesign of an existing window rather than a new
surface.

**Round 3 (2026-07-31)** answered the second review note. Red became
STRUCTURAL rather than a rare alarm state (round 2 held it back for the risk
band alone, so a healthy run had almost no red in it and stopped reading as
Evangelion); three more retro-futurist palettes joined it; the BENCH FEED
grew from 112x84 to 200x150 and was reframed off dead centre onto the bench
itself; and the CRT was rebuilt from a scanline overlay into an actual
picture tube. See "The tube" and "Colour" below.

**Round 2 (2026-07-31)** answered the first review note. Five changes:
colour broken out of the single-ink law into state roles (the headline, see
below); the BENCH FEED bezel no longer underlapping SCAN.EXE (the gutter
column was 132px for 136px of content, so it bled right); the ATTACK.EXE
10px stagger removed, since it read as a misalignment bug rather than as an
asymmetry device; 4:3 dropped; and the wide breakpoint lowered to 700px so
16:9, 21:9 and the 1280x800 laptop all render the SAME arrangement. A third
run state, DAY 8 STRAINED, was added so the new risk colour is reviewable
rather than described.

## What it decides

**1. Clutter is a hierarchy problem, not a density problem.** The shipped
window puts eleven blocks on one plane at one weight. This one keeps almost
all the same information but states a glance order and builds the type scale
to enforce it:

1. the trinity's three hero numerals (83px against 19px body, the biggest
   glyphs on the page by 2.2x over the next largest thing)
2. the masthead verdict slab and DIVE
3. the support band: bays, pouch, strain
4. the operator gutter, deliberately ambient, never competing for first read

The Eva DNA is the delivery mechanism for that hierarchy, not decoration:
extreme scale contrast, a three-panel trinity for SCAN/ATTACK/DEFEND, thin
hairline panels carried by heavy 24px corner brackets, a rotated spine label
in the gutter, a hazard-stripe divider, corner-tick reticles on the live
mode. No NERV branding, no Japanese chrome, no religious iconography: every
label reads as bench diagnostics (both gates checked this explicitly).

**1b. Colour is state, not decoration.** USER RULING 2026-07-31, recorded as
`lore/ledger.md` ruling 14: *"I'm wanting to see if we can break away from
the single color design. I even said use Evangelion colors."* This overrides
the KP/OS v2 law (one ink accent, danger is inverse video, never a second
hue) for this window.

It is implemented as ROLES rather than as a repaint, so the law is not
simply thrown away. By default every role resolves to the single accent and
the page is identical to the v2 scheme; a `data-scheme` attribute is the
only thing that pulls them apart, and the SCHEME switch flips between them.

| role | NERV | means |
|---|---|---|
| struct | `#a86a22` | chrome and borders |
| note | `#6ea8ff` | annotation: labels that name, never state |
| line | `#ff9a1f` | live data, meters, filled bays |
| data | `#ffe9c4` | hero numerals, hot values |
| ok | `#8dff3a` | NOMINAL: READY, the active mode |
| warn | `#ff2a17` | RISK: strain in the low band |
| aux | `#23d3ff` | the camera feed, a different signal class |
| hazard | `#d1381a` | structural red: stripes, brackets, window edge, REC |

**Round 3 added the `hazard` role**, because round 2 got the semantics right
and the look wrong. Reserving red for the risk band alone meant a healthy
run had no red anywhere, and the user's verdict was blunt: *"the lack of red
feels off in terms of an Evangelion color scheme."* Red is now ambient
chrome, and RISK stays legible above it by three channels at once: a hotter,
purer red than the hazard tone, the inverse-video flood, and position. The
tutorial gate was re-run specifically on whether the alarm survives its own
furniture.

**Round 4 added the `note` role: the annotation channel.** The ask was
*"some more blue highlights without disrupting the clear visual hierarchy"*,
and the way to add a colour without disturbing an order is to give it only
things that NAME rather than STATE. `--r-note` paints the `// LABEL` chip
prefixes, TIER, the RANGE/WIDTH unit captions, the operator tick labels, the
pouch shape nouns, the gutter spine and the masthead eyebrow. Nothing
carrying a value, a state or a verdict takes it, so the glance order is
untouched and the page just gains a cool second temperature under the amber.

**Two palettes, one role map.** NERV and TOKYO NIGHT, the two that landed;
CLASSIC (a light 1-bit desktop) and DRACULA were built, shown, and cut in
round 5. Both survivors remap the same eight roles, so the grammar is
identical and only the voltage changes; nothing is hand-painted per scheme.

SINGLE INK went with them, and with it the HUE row, which only ever drove it.
That costs the demo its side-by-side proof that the roles still collapse back
onto the v2 single-accent law. The collapse itself is intact in the CSS (the
`:root` defaults), so it is one scheme entry away if the baseline comparison
is ever wanted at integration time.

Neural strain is the one readout whose colour carries state: nominal above
70, neutral between, risk at or below 35. **Colour is never the only
channel** in the risk band, the number also floods inverse video, which is
the shipped danger idiom and survives a colourblind reader and the CRT
layer alike. Switch RUN STATE to DAY 8 STRAINED to see it.

Integration debt this creates: `CLAUDE.md`'s DESIGN STANDARD and both law
lines in `ui-demos/RULINGS.md` assert the single-ink rule as current and
would become wrong. The loremaster named the exact lines needing a carve-out
and scoped ruling 14 narrowly to this window; whether it goes KP/OS-wide is
recorded as an open question for the user, not assumed.

**2. The window got smaller by cutting, not shrinking.** Measured, all eight
viewport x run-state combinations:

| viewport | window w | tier | tallest state |
|---|---|---|---|
| 16:9 1366x768 | 860 | WIDE | 654 |
| 21:9 2560x1080 | 940 | WIDE | 650 |
| laptop 1280x800 | 760 | WIDE | 727 |

Worst case 727px against the brief's 820px ceiling, and against roughly 1316
for the shipped window: a 45% cut. All three render the same arrangement per
the user's review; 4:3 is dropped.

**Measure with the tube OFF**, a habit worth keeping. While CURVED still
used an overscan (rounds 3 and 4), that `transform: scale()` on an ancestor
made every `getBoundingClientRect()` inside it come back 8.5% large, which
silently inflated a whole round of measurements and sent me chasing 54px of
overage that did not exist. The overscan is gone now, but the harness still
measures with CRT off, because a filtered, transformed subtree is exactly
where geometry lies to you. Layout is identical in all three CRT modes. Every case clears the desk it sits on
with room left over, which is the actual fix for "window management feels
rough" (the faint dashed FREE DESK ghost on the stage makes the leftover
room literal). What paid for it:

- the `FIG. 01 // BENCH RIG` schematic plate is CUT outright. Cropping it
  small enough for a supporting role would have dissolved it into checker
  noise (loadout/NOTES.md's own hard-won bound), so it goes rather than
  degrades.
- the pouch's four-line paragraph is CUT to a `// PLACE COST _ 2 RAM` chip
  plus its verbatim pointer sentence. The tutorial gate verified fact by
  fact that placement cost, single use, one-per-turn, the pouch cap and the
  sourcing list all survive at first contact in DIVE.EXE and SOLDER.BAY.
- the five always-open bay descriptions become hover/focus/tap popups.
- the three boxed operator datarows become unboxed ticks in the gutter,
  matching their new lowest priority.
- boost bays are two-up rather than five stacked (70px of desk for no extra
  information).

**3. Scaling is fixed at the unit, not at the breakpoint.** Every size is a
`clamp()` on CONTAINER query units (`cqi`), never `vw`, and the tier is a
`@container` query on the window's own inline-size. A window tiled into a
third of an ultrawide scales to ITS tile, not to the browser; two
differently sized windows at the same browser width get different type
scales, which a `vw` ramp cannot do. No scrollbars, ever.

The wide breakpoint is 700px so all three supported viewports clear it. At
the tight end of wide (the 760px laptop) the gutter stops paying 28px for a
rotated spine beside the bezel and stacks it above instead, handing that
width to the trinity so descriptions wrap one line shorter. Same
arrangement, tighter packing.

A narrow tier still exists below 700px, where the trinity becomes a compact
list and the gutter and support band page behind a PROGRAMS / RIG & STATUS
tab strip with the masthead and DIVE persistent above both. It is a tiling
fallback now, not a viewport anyone reviews, and no supported viewport
reaches it.

## Variations

- **CRT CURVED / FLAT / OFF.** See "The tube" below. OFF removes every glass
  layer outright rather than fading it, and the page still reads as a
  finished flat-ink print because none of its richness lives in the CRT
  layer.
- **SCHEME** NERV (default) / OXIDE / ATOMIC / VECTOR / SINGLE INK, so the
  user ruling and the law it overrides sit on one switch.
- **HUE** lavender / magenta / phosphor plus **amber**
  (`#100a04 / #ffab3d / #c2431a / #fff2d9`). Drives the SINGLE INK scheme
  only, and the row dims itself under EVA MULTI to say so.
- **VIEWPORT** 16:9 / 21:9 / laptop 1280x800, all rendering the same
  arrangement.
- **RUN STATE** day 4, day 1 early, and day 8 strained. Sparse states are
  where maximalist grids fall apart, and the strained state is where the
  risk colour earns its place. Bays, pouch holes and mode locks are all
  equal-footprint empty states, so day 1 occupies the same room as day 4.

## The tube

**Round 5 removed CURVED.** It was never only the filter that cost: because
every repaint inside a displaced subtree re-ran the barrel warp over the
whole stage, curved mode also had to switch off the feed's rolling band, the
REC blink and the terminal cursor, and drop the clock to minute resolution.
Dropping the curve hands all four back unconditionally, which is a straight
quality gain on a look the user judged indistinguishable from flat. The
per-aspect displacement maps and the `feDisplacementMap` wiring are in git if
the curve is ever wanted again; what follows is the record of how it worked.

Round 2's CRT was scanlines, dimming, and a drifting band. The user's verdict
was that it was "more than just an animated scan line (which is laggy) and
some blur/dimming" that was wanted: *"try to get that bulbous round glass
effect of an old monitor or TV, with the distinct CRT lines throughout."*

So round 3 builds the object rather than the texture:

- **Real barrel distortion.** `art/crt-barrel-*.png` are generated
  displacement maps whose R and G channels encode per-pixel x/y offset; an
  SVG `feDisplacementMap` bends the whole picture by them. Not a rounded
  border pretending to bulge, an actual warp.
- **One map per aspect, and edges that taper to zero** (round 4). The first
  pass stretched a single square map across every stage, which on a 21:9
  desk warps far more horizontally than vertically and stops reading as a
  tube at all; each aspect now gets its own map with the radius measured in
  physical proportions. And the first pass fed the warp by drawing the
  picture 8.5% oversized, which cost the title bar and the taskbar outright
  at 21:9. The displacement now eases to exactly zero at the frame, so the
  warp never samples outside the picture, so **no overscan is needed and
  nothing is cropped**. Magnitude was also dialled back to roughly what the
  first curved pass shipped at (~26px peak, not ~54px); the taper makes a
  strong warp read as distortion rather than as curvature.
- **Distinct phosphor lines**, a bright line and a dark gap rather than a
  faint tint, plus a vertical aperture grille.
- **Glass, not a filter**: a rounded bezel with a moulded lip, a specular
  reflection where the bulge is steepest, ink-tinted bloom, and an
  elliptical falloff so the corners sit furthest from the gun.
  `border-radius` stays banned on UI chrome and is used only on the tube,
  which is hardware rather than a control.

**The lag was real, and it was measured, not guessed.** A displacement
filter re-runs over the entire stage whenever anything inside it repaints.
With the feed's rolling band, the REC blink and a per-second clock all
running inside the glass, p95 frame time was **50ms** (worst 58ms), which is
exactly the complaint round 2 earned. Under CURVED those sub-second
animations are switched off (the tube's own scanlines already supply that
texture) and the clock drops to minute resolution, so the only thing left is
one refilter a minute. Re-measured over 420 frames per mode:

| mode | mean | p50 | p95 | worst |
|---|---|---|---|---|
| CURVED | 8.32ms | 8.3 | 9.0 | 16.8 |
| FLAT | 8.35ms | 8.3 | 9.0 | 17.6 |
| OFF | 8.33ms | 8.3 | 9.2 | 9.4 |

CURVED is now indistinguishable from OFF. FLAT exists for anyone who wants
every animation back and the texture without the warp.

## Build notes, and where it departs from the spec

- **The stage is laid out at true resolution and transform-scaled to fit.**
  The spec called for four pre-built stages; one resizable stage is used
  instead so there is a single live DOM (one clock, one set of timers). The
  scale is a `transform`, which does not change layout size, so container
  queries inside still resolve against the real window width: what you see
  at 47% is what a 2560x1080 desk renders. This also avoids the spec's
  accepted horizontal page scroll at 21:9.
- **Default viewport is 16:9**, which is also what the user reviews on.
- **The demo rig moved to bottom-left** so the review deck (top-right) stops
  covering it. It carries a live WINDOW / HEIGHT readout against the 820px
  ceiling, so the footprint claim is checkable on the page rather than taken
  on faith.
- **`cqi` inside a custom property resolves at the USE SITE.** `--lo-fs-body`
  therefore lands at 19px inside a trinity panel (its own container) and
  21px in the masthead and pouch. Both sit inside the system's stated VT323
  floor and the narrower column getting the smaller step is the behaviour
  you want, so this is kept rather than fought. Worth knowing before anyone
  "fixes" it.
- Sound is minimal inline WebAudio (the dadlog study's precedent), not a
  `sound.ts` build: the shipped tick / claimTick / pageFlip / loadoutReady
  characters plus the proposal's new `instrumentLock`, which fires three
  times per load as each hero numeral lands.
**The feed treatment switch (round 5).** The ask was to see the dithered
image in full colour. Worth knowing before judging it: the source art
(`_shared/art/raw/raw-loadout-feed.png`) is MONOCHROME ink illustration,
mean saturation 0.86 out of 255, so there is no colour under the tint to
uncover. FULL COLOUR is therefore a colourisation, not a reveal: the frame
is gradient-mapped through a lit-interior palette (blue shadow, neutral mid,
warm lamp highlight, plus a warm radial lift where the bench lamp is) and
Floyd-Steinberg dithered to a 16-colour adaptive palette, so it still reads
as a dithered camera frame rather than a photograph. Three options:
INK TINT (the house rule, 1-bit multiplied to `--r-aux` so the camera
recolours with the scheme), TRUE 1-BIT (the same dither untinted, which is
the image's actual colour), and FULL COLOUR. All three render the source at
its native 304x227, never resampled.

- Art budget was NONE and stayed NONE for game art. The BENCH FEED is a
  200x150 `LIVE MONITOR` bezel built by CROPPING the native 304x227 dither
  at 1:1, never resampling it. Round 2's 112x84 cell was both too small to
  read and framed on dead centre, which on this shot is the middle of the
  clutter; the window now sits over the bench, the monitor and the
  operator's shoulder. At the 760px laptop it steps down to a 150x113
  window on the same region, still 1:1. The one new file,
  `art/crt-barrel.png`, is a generated displacement map, a shader input
  rather than artwork.
- **The gutter stays BESIDE the trinity.** Moving it to its own row was
  tried when the feed grew, and cost 112px: a row you do not share is a row
  you pay for in full. The gutter is shorter than the instrument bays, so
  beside them its height is free.

## Gate fixes built in (rounds 1 to 3 only)

Rounds 1 to 3 gated this page before the user saw it. From round 4 the user
ruled the cycle PURE UI ("stop running tutorial agent on this since it's not
a new UI window", same for loremaster), so later rounds ship straight to the
review site. What follows is the record of what the gates did change. Loremaster: APPROVE on both items, no canon gaps. Tutorial: 3
COVERED, 2 tier-0 fixes, both built here:

1. filled boost-bay pills carry a persistent dotted underline saying "this
   holds more", closing the ledger's standing open ask about touch-tip
   discoverability. Empty and future pills hold nothing, so they carry no
   marker.
2. program descriptions never truncate at a fixed character count. The
   budget is 150 chars clamped to a sentence boundary, above the longest
   shipped description (`redirect` at tier 3, 122 chars), so `armHalt` and
   `armSiphon` can never ship with their effect clause hidden behind a
   "...". The affordance is reserved for future content that exceeds it.

One loremaster advisory taken: the band divider reads `// BENCH SUPPORT`,
not `// SUPPORT SYSTEMS`, which read closer to cockpit life support than to
a repair bench.

**Round 3 gate: 4 COVERED, 1 tier-0 fix, built.** Making red structural put
five red-family shapes on the page on every healthy visit, and the gate's
finding was that static distinction cannot beat habituation: the eye stops
sampling hue and fill for the one time it matters. The alarm therefore takes
the one channel the ambient chrome does not have, MOTION, on the shipped
`kp-danger-blink` cadence (1.2s steps(2)), and the window border, brackets,
REC light and divider stay static forever. That asymmetry is the whole
point; if the chrome ever animates, the fix is void.

Building it naively cost 50ms p95 under CURVED, because animating
background and box-shadow repaints inside the glass and re-runs the barrel
filter over the whole stage. So the inverse flip is COMPOSITED instead of
painted: a difference-blend plate over the readout fading in and out on a
promoted layer. Measured 9.4ms p95 against a 9.1ms do-nothing baseline, and
it reads identically, a solid block with void digits alternating with a void
block with red digits and a red outline. Verified legible through the bloom
and mask layers under CURVED, which the gate specifically asked for. Under
`prefers-reduced-motion` it falls back to the static inverse flood.

## What it still owes

- **Integration must swap the bay popup for the shipped `TapTip`
  component verbatim.** The vanilla hover/click-toggle here is explicitly a
  placeholder; this is the tutorial gate's hard condition, not a suggestion.
- `instrumentLock` needs to land in `audio.ts` as a real sfxr preset
  (params are in the proposal item; envelope values are PLAIN SECONDS).
- The trinity's SCAN and DEFEND panels carry visible dead space at the
  bottom in WIDE, since panel height is set by ATTACK's longer description.
  It reads as instrument-panel spacing rather than as a mistake, but it is a
  deliberate accepted cost, not an oversight.
- **The colour ruling's scope is unsettled.** Ruling 14 covers LOADOUT.CFG
  only. If EVA MULTI is approved, someone has to decide whether the rest of
  KP/OS follows it or stays single-ink, because a desktop running both would
  read as two products. Flagged, not assumed.
- Integration must also re-line `CLAUDE.md`'s DESIGN STANDARD and
  `ui-demos/RULINGS.md`, which currently assert the law this supersedes.
- Nothing here is wired to real state or navigation: DIVE and the pouch
  panel are inert, as a study.

## Verification

Driven against the live page over CDP (the Chrome extension was not
connected; headless Chrome plus `Runtime.evaluate` turned out to be the
better harness anyway, since it clicks the rig's own switches and measures
real geometry).

Round 1, 26 checks: glance order, the cuts, no scrollbar, tier switching,
reticles, bay markers, truncation, CRT layer counts on and off, exact amber
tokens, sparse state, no border-radius, no em or en dashes, plus the
reduced-motion path rendering its settled state in one frame and the
per-panel typewriter scoping (a mode click restarts only its own panel's
description).

Round 3, 23 further checks plus a frame-timing pass: the three CRT modes
wiring the barrel filter, overscan and glass layers correctly; CURVED
silencing the churn that made it lag; five schemes each mapping seven
distinct roles and all four multi-schemes being genuinely different
palettes; hazard red reaching the stripes, window edge and REC light while
risk red stays a separate hotter tone; the feed at 200x150 on a native 304px
image reframed off centre; and the round-1 and round-2 invariants still
holding (no scrollbar, no border-radius on chrome, one trinity baseline, no
tab strip at any supported viewport, no dashes).

Round 2, 19 checks: 4:3 gone; all three viewports resolving to the
same arrangement (no tab strip, 2-column grid, 3-column trinity); all three
panels on one baseline (the stagger is gone); the BENCH FEED bezel clearing
SCAN.EXE by 8px; five distinct role hues under EVA and all roles collapsing
to one accent under SINGLE INK; the strain band resolving correctly across
all three run states and flooding inverse video in the risk band; active
mode and READY reading nominal green; locked modes still dashed; the feed
tinting cyan. All passing, and every window height re-measured against the
desk it sits on.
