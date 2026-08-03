# NIGHT.SYS instrument-panel study

Demo: `ui-demos/night-v3/index.html` (cycle `ux-2026-07-31-night-v3`)
Spec: `pipeline/proposals/ux-agent-night-v3.json`, item `night-v3-instrument-panel`
Brief: `pipeline/briefs/ux-2026-07-31-night-v3.md`
System laws: [`../RULINGS.md`](../RULINGS.md)
Replaces: `kernel-panic-site/app/src/components/os/windows/night.tsx` (no prior
`ui-demos/` study existed; NIGHT.SYS was never rebuilt in the v2 cycle, so it
is still wearing pre-v2 generic chrome)

The day-close window rebuilt to the KP/OS v3 instrument-panel system. This is
the panel `RULINGS.md` law 11 nominates as the system's **low-density proof**:
LOADOUT.CFG showed that eight role tokens and a stated glance order can
organise eleven blocks, and this surface has six. The question it answers is
whether the same grammar survives when there is not much to say.

## What it decides

**1. The failure mode here is padding, not overflow, and the answer is
arrangement.** The shipped surface is seven stacked blocks in one column:
header, regen band, a four-tile upgrade grid, three full-width shop rows, and
a footer. This is FOUR grid rows, every one of them shared:

| row | zones |
|---|---|
| Z1 TOP STRIP | the demoted day marker + the strain readout |
| Z2 PICK ROW | the focal hero card + the compact option strip |
| Z3 SHOP ROW | all three purchases, three-up |
| Z4 FOOTER | the pointer line + CLOSE THE NIGHT |

Law 8's closing lesson runs in reverse on a panel that starts under budget: a
row you do not share is a row you pay for in full, so three short controls
that each took a full-width row now sit beside each other and their height is
free. Nothing was invented to fill the space that bought.

**2. The glance order, and the two candidates that lost.** The brief called
this contest genuinely open, so it is recorded as a decision rather than an
accident:

1. **THE PICK**, focal, at 60px against a 21px body. It is the only thing on
   the surface the player must ACT on, it is permanent for the rest of the
   run, and it is the thing blocking the exit.
2. **STRAIN**, at 26px. The run's life, and the number the night's purchases
   exist to defend. It keeps the full three-channel alarm but never goes
   focal: it is a readout the player nudges indirectly, and a second loud
   element beside `--r-warn` would erode the rarity that makes the alarm work.
3. the shop row.
4. ambient: the day marker, the footer pointer line, all chrome.

**The DAY numeral is deliberately demoted**, which is the sharpest break from
the shipped window, where it is the hero. It is pure state with no decision
attached, a chapter marker read once per night. It sits at 20px in plain
ambient ink and takes **no role token at all**, not even `--r-data`, which is
reserved on this surface for the hero glyph alone. It signals its demotion by
treatment as well as by size.

Measured ratio, hero to the next largest element, CRT off:

| viewport | hero | strain | ratio |
|---|---|---|---|
| 16:9 1366x768 | 60.1px | 26.4px | **2.27x** |
| 21:9 2560x1080 | 66.4px | 29.0px | **2.29x** |
| laptop 1280x800 | 52.7px | 23.2px | **2.27x** |

Law 2 asks for 2x or better. The hero glyph is also the largest text element
on the surface by measurement, not by assertion.

**3. The pick is a state machine, not a button row.** The shipped surface says
"nothing is locked in until you do" in a prose sentence and enforces it by
grey-ing out a button. Here all three guarantees are structural:

- **exactly one selected** is enforced by the DOM, not by styling: there is
  one hero slot, and the strip is derived as "every option that is not in
  it", so the layout cannot represent two selections even if a rule breaks.
- **reversible until CLOSE THE NIGHT** is demonstrated rather than described:
  clicking a second option swaps the first back into the strip, with no
  confirmation and no cost, exactly as the shipped `chooseUpgrade` case does.
  Promoting an option is also how you read its description, which is sound
  only because the pick is free.
- **CLOSE THE NIGHT is locked until a pick exists**, and when it arms it
  takes `--r-ok` and the footer sentence rewrites in lockstep.

The selected state carries three channels: the SELECTED stamp, an inner
8px/2px `--r-ok` corner-tick reticle, and position (it is the thing in the
focal slot). The reticle sits inset from the focal panel's own 24px/4px
`--r-hazard` brackets so the two corner treatments never collide.

**4. The window got smaller by arrangement, and it is meant to come out
short.** Measured with the tube OFF across all twelve viewport x run-state
combinations:

| viewport | window w | height, every run state |
|---|---|---|
| 16:9 1366x768 | 860 | 674px |
| 21:9 2560x1080 | 940 | 653px |
| laptop 1280x800 | 760 | 656px |

Worst case 674px against a 700px target and an 820px ceiling. Height is
**constant across all four run states at every viewport**, which is the
equal-footprint law holding rather than an average.

## Role assignment (law 1)

| role | owner on this surface |
|---|---|
| `--r-struct` | card hairlines, meter track, unfilled pips, every disabled outline |
| `--r-note` | names only: eyebrow, STRAIN, hero pname, pouch shape nouns, the `cr` suffix |
| `--r-line` | live values: strain in the neutral band, filled bay pips, cost numerals |
| `--r-data` | **the focal numeral only.** One use on the whole surface: the hero glyph |
| `--r-ok` | SELECTED, the reticle, strain in the nominal band, the `+N STRAIN` pop, CLOSE armed |
| `--r-warn` | **RISK only.** One use: the strain readout at or below 35 |
| `--r-aux` | **UNOWNED**, explicitly. See imagery below |
| `--r-hazard` | structural red: window edge, the hero card's corner brackets, the shop divider |

MAXED options, unaffordable purchases and the bay ceiling all take
`--r-struct`, never `--r-warn`, so nobody reaches for red twice. Verified: no
rule on this surface consumes `--r-aux`.

## The alarm, and a defect it exposed in the reference pattern

Strain counts DOWN as the run wears, so **risk is the LOW end of the meter**,
the inverse of the usual "fuller is worse" read. Bands are the reference
build's, unchanged: nominal above 70, neutral 36 to 70, risk at or below 35.
The band re-evaluates against the currently displayed value, so a fill that
crosses a threshold flips the alarm as it crosses.

Three channels, per law 1: colour (a hotter, purer red than the ambient
`--r-hazard` chrome), inverse video (a solid flood with void digits, the
constant state under the alarm), and motion. Ambient chrome never animates,
and that asymmetry is the whole mechanism.

**The motion channel exposed a real bug in the pattern this study copied.**
The reference build animates its difference-blend plate with
`animation: 1.2s steps(2)` over keyframes `0%,100% { opacity: 0 } 50% {
opacity: 1 }`. That does **not** produce a square wave: `steps(2)` subdivides
each keyframe interval, so the plate spends half its cycle at **opacity 0.5**.
And 0.5 is precisely the value at which a difference plate destroys the
readout it is meant to emphasise, because

```
0.5 * |plate - backdrop| + 0.5 * backdrop
```

maps BOTH the red flood (255,42,23) and the void digits (10,6,3) to the same
(127,21,11). The alarm renders as a featureless red slab with its number gone,
half of every cycle. It was caught by screenshot, not by any geometry check,
and only because the number vanished on a red field where the eye expects it.

Fixed here as `steps(1)` across three stops (`0% {0} 50% {1} 100% {0}`), which
holds 0 for 600ms then 1 for 600ms: a true two-state flip, which is what
"inverse-blink, not a hue" has always meant. Sampled over a full cycle, the
plate now takes only the values 0 and 1.

**This is worth carrying back to `loadout-eva`**, which has the identical
construction in `.lo-riskflash` / `@keyframes lo-risk-blink`. Not changed here
because that demo is `awaiting` the user's approval and this cycle must not
edit a panel out from under a pending review. Flagged for integration.

Two smaller legibility fixes on the same readout, both caught by screenshot:
the `<b>` wrapper was pulling **Silkscreen Bold**, which mushes into the
phosphor scanlines at 26px, and a `line-height: 0.9` crush (inherited from the
reference, where the readout is 38px and survives it) left the 29px glyph box
overflowing a 24px line box, so the inverse-video flood painted a slab with
the digits hanging outside it, dark on dark.

## Imagery: NONE, decided rather than defaulted

`--r-aux` is the camera role and goes unowned here. There is no FEED variation.

The reasoning, which the brief asked to be argued either way: this surface is
a decision plus a status readout plus a small shop, and none of that has a
diegetic camera moment the way LOADOUT.CFG does, where the whole point is
watching the bench while configuring the kit. The one candidate asset
(`_shared/art/raw/raw-solder-bench.png`) is the SAME bench camera LOADOUT.CFG
already owns; putting it on a second window in the same desktop is decorative
duplication, and law 5 wants an in-fiction reason, not an available file. Law
8 step 1 says imagery that cannot survive its size is cut outright rather than
shrunk, so it is cut before it is added. Art budget was NONE and stayed NONE.

## Cuts taken (law 8)

1. The header's three-sentence paragraph is cut to its first sentence,
   verbatim: "One upgrade holds for the rest of the run." The other two
   sentences described sequencing and reversibility, and the pick state
   machine plus the footer pointer line now demonstrate both. Law 8 step 2,
   where "elsewhere" is this surface's own new structure.
2. The MAXED detail sentences never surface. A maxed option cannot occupy the
   hero slot by construction, so promote-to-reveal cannot reach them, and the
   MAXED label plus dashed chrome already state the fact. This quietly avoids
   a shipped-copy quirk in which scan/attack/defend's detail text still reads
   like upgrade advice after that tree is capped, without rewording anything.
3. Imagery, cut outright (above).
4. The four co-equal tiles become one hero plus a three-item strip, and three
   full-width shop rows become one three-up row. No content is lost: every
   tile's content still exists, promoted or compact, and every shop control
   keeps its exact shipped label and status sentence.

## Deliberately UN-added

Unusual to record, and the point of this panel. Each of these was available,
cheap, and refused:

1. No masthead CREDITS chip. Credits already appear in all three shop status
   sentences and in two cost labels.
2. No hover/tap popup layer for the strip. Clicking a row is free, instant and
   reversible, so preview and select collapse into one action; a popup would
   solve a problem this surface does not have (unlike LOADOUT's paid bays).
3. No imagery cell.
4. No per-token colour splitting inside the shop status sentences. That row is
   ambient by design, and building hierarchy inside it fights the surface's
   extreme-contrast goal.
5. No fourth strain band below the risk threshold.
6. No confirmation on CLOSE THE NIGHT. The surface's own message is "nothing
   is locked in until you press it"; a confirmation step would contradict it.
7. Only one hazard-stripe divider. A second would compete with the hero card's
   brackets without marking a boundary the reader needs.
8. No LOADING to READY slab transition on the day marker. There is no shipped
   "not yet resolved" state for it to transition out of.

## Load choreography

The regen fill is this surface's signature beat and the one element no other
window has: the meter visibly fills as the window opens, because the shop
closing IS the rest.

- **t=0** static chrome, no motion ever. The meter renders at the PRE-rest
  value (`strain - lastRegen`), matching the shipped `strainShown` logic.
- **t=150ms** (the exact shipped `setTimeout`) `dayCloseRegen` fires and the
  meter runs 300ms across `steps(8)`, the shipped `SegMeter` parameters, with
  the number stepping in sync. Measured: 54, 57, 59, 60, 63, 64.
- **t=450ms** the `+10 STRAIN` pop lands on the shared `kp-slot-in` keyframe.
- **the silent branch** (`lastRegen` 0, which DAY 2 EARLY and DAY 9 CAPPED
  both exercise): no sound, no motion, no pop. The pop's 71px slot is reserved
  either way, so a night that rests nothing occupies the identical footprint.
  Law 4 applied to a beat that sometimes does not happen.
- t=220ms hero, t=300/390/480/570ms the strip, ~t=860ms the pouch glyphs.
- Total settle ~1.2s, deliberately shorter than LOADOUT's ~2.1s: proportionate
  to this surface's density rather than a copy of its timeline.

Under `prefers-reduced-motion` every element renders settled within one frame,
with no animation running anywhere on the surface, and the alarm falls back to
the static inverse flood. Verified.

## Sound

No new preset proposed. All four voices this surface uses are already shipped:
`dayCloseRegen` (the mount-time rest), `tick` (a pick change), `granted` (a
purchase lands), `dayClose` (CLOSE THE NIGHT). BUY BLIND has no sfx in the
shipped source and gets none here. As in the dadlog and loadout studies these
are minimal inline WebAudio approximations, characters transcribed from
`audio.ts`, not a `sound.ts` build.

## Variations

- **SCHEME** NERV (default) / TOKYO NIGHT, token block copied from the
  reference, not retyped.
- **CRT** FLAT (default) / OFF. Six glass layers verbatim. CURVED not rebuilt,
  per law 6.
- **VIEWPORT** 16:9 / 21:9 / laptop 1280x800. All three render the same
  arrangement, verified: same `grid-template-areas`, same two-column grid,
  same three-column shop row.
- **RUN STATE** DAY 2 EARLY / DAY 5 MID (default) / DAY 8 STRAINED / DAY 9
  CAPPED. The last two are the ones to look at: DAY 8 is the only place the
  alarm is reviewable rather than described, and DAY 9 fires every capped
  branch this surface has at once (three MAXED tiles, a full pouch, bays at
  the ceiling with no price, the patch dead on the strain cap) so it can be
  checked against DAY 2 zone for zone.
- **REPLAY LOAD** re-runs the full choreography, including the regen fill.

Run-state numbers are cross-checked against the game's own pick economy: each
state's applied upgrade count matches its day, and DAY 9 keeps exactly one
live tile because ten upgrade steps exist across a run against nine night
closes, so the ninth night can never soft-lock.

## What it still owes

- **Two teaching anchors need retargeting at integration.** `day-upgrade`
  (order 70, anchor `grid`) and `night-shop` (order 71, anchor `patch`)
  position via fixed pixel offsets tuned to the shipped layout
  (`kp-teach-grid` top 150px/left 30px, `kp-teach-patch` top 56px/right 24px).
  Both landing zones survive: the pick row is the successor to
  `.kp-upgrade-grid` and the first shop cell to the first `.kp-patchrow`. But
  this layout is fluid, so the offsets should become relative rather than
  re-guessed in pixels. Nothing about WHAT is taught changes, which is why
  this is noted here rather than escalated (see below).
- **`NO PICK` is the one minted string on the surface.** Everything else is
  shipped copy verbatim. It is a status word in the existing
  SELECTED / MAXED family, and it is flagged rather than hidden: if the
  reviewer wants a different word it is a one-line copy order.
- The `steps(2)` alarm defect should be carried back to `loadout-eva` (above).
- BUY BLIND is inert, since DARKNET.LNK does not exist in a standalone study.
  The shipped control fires no sfx either, so this is a scope boundary rather
  than a placeholder. NIGHT PATCH and INSTALL BOOST BAY are fully live and
  really spend credits.
- The hero card carries visible space between the glyph and its detail line,
  because the card reserves a constant height so NO PICK and a picked option
  occupy the same room. It reads as instrument-panel spacing; it is an
  accepted cost, not an oversight.

## Gate-shaped note

This cycle is PURE UI per `RULINGS.md` "Process": a redesign of an existing
window, so no loremaster gate and no tutorial gate ran. The one gate-shaped
residue is the teaching-anchor retargeting above, which is a positioning
question rather than a teaching-coverage question. Flagged once, not escalated.

## Verification

Driven against the live page over CDP in headless Chrome (law 10), measured
with the tube OFF because a filtered subtree lies about geometry.

- height across all 12 viewport x run-state combinations, max 674px
- the hero:strain ratio at all three viewports, and the hero glyph confirmed
  the largest text element on the surface
- the alarm's three channels, plus ambient chrome confirmed static
  (`animation-name: none` on the window edge, brackets and divider)
- the three band colours resolving distinctly
- the pick state machine's three guarantees, walked by clicking
- equal footprint zone by zone between DAY 2 EARLY and DAY 9 CAPPED: top,
  hero, strip, shop, foot and the window itself all identical
- no internal scrollbar on any scrollable box, no `border-radius` on chrome,
  no em or en dash in rendered text
- both schemes resolving seven load-bearing roles distinctly, and `--r-aux`
  confirmed unreferenced
- all three viewports resolving the same `grid-template-areas`
- the regen fill sampled through its steps, the silent branch confirmed
  motionless, and reduced motion confirmed settling in one frame

Frame timing over 419 frames with the alarm live and the tube on: mean
33.33ms, p50 33.3ms, p95 34.7ms, worst 35.3ms. Headless Chrome caps this
harness at roughly 30fps, so the mean is the cap rather than a cost; the
figure that matters is the 2ms spread between p50 and worst, meaning the
composited alarm drops nothing. It is not comparable to the reference build's
8.3ms numbers, which were taken on a different harness.

## Revision 2026-08-01: the balance and the button affordance

Review feedback, verbatim: "I like this quite a bit. However, I would prefer
if your CR balance was made very apparent toward the area where you can spend
it. Also, I'm not sure that the buttons to select a tier upgrade are easily
discerned as buttons." Two changes, both to `index.html` only.

**1. The CREDITS balance rides the shop divider.** Credits existed on this
surface only inside the three shop status sentences, so reading the balance
meant hunting a dim prose row. Now a boxed readout anchors the right end of
the `// NIGHT SHOP` divider: a Silkscreen numeral in `--r-data` at the DAY
slab's size step, with `CREDITS` / `cr` flanking it in `--r-note`. The
divider is the spend zone's own header, so the balance and the three costs it
gates share a single glance, and it sits directly below the pick row at every
viewport and tier. It re-renders from the same `S.credits` every
affordability guard reads and pulses on the shared `kp-slot-in` keyframe when
a purchase drains it (skipped under reduced motion). The status sentences
keep their shipped copy verbatim; the divider instance is the prominent one.

This overturns two earlier decisions, deliberately: un-added item 1 ("no
masthead CREDITS chip") falls to review, and `--r-data` gains a second owner.
The hero glyph is still the largest text on the surface by measurement (the
balance lands at 18 to 21.7px, below even the strain readout), so the focal
hierarchy is untouched. `CREDITS` joins `NO PICK` as the surface's second
minted string; it names the resource the shipped sentences already count.

**2. Live controls carry a 1px `--r-ok` outline.** The reviewer gave the
same discernibility note on another panel and asked for green or blue
outlines, so this is the shared cross-panel treatment: every clickable
control (the tier-option strip, the live shop buttons, CLOSE THE NIGHT once
armed) takes a visible 1px `--r-ok` outline offset 2px outside its chrome,
plus `cursor: pointer`. The strip's hover, previously a border brighten, is
upgraded to the house inverse-video flood with the translate press state,
matching the shop buttons. Disabled controls (MAXED, unaffordable, capped)
keep their dashed `--r-struct` family chrome and take NO outline, so live vs
dead reads at a glance and affordability is stated directly against the
balance above without touching `--r-warn`. Outlines do not participate in
layout, so the equal-footprint law is unaffected. `--r-ok`'s ownership row
grows by one entry ("the live-control outline"); RISK still has exactly one
owner.

**Re-measured after the change**, CRT off, all twelve viewport x run-state
combinations: heights 688px (16:9), 669px (21:9), 669px (laptop), constant
across all four run states per viewport, worst case 688px against the 700px
target (the divider row grew ~14px to carry the balance). Hero:strain ratio
unchanged at 2.27x / 2.29x / 2.27x, hero confirmed largest text everywhere.
The balance sits inside the shop zone's box in every combo including DAY 9
CAPPED, whose placement does not break: it reads CREDITS 35 cr over a shop
with every branch dead. Both schemes resolve the outline distinctly (NERV
#8dff3a, TOKYO #9ece6a) against their `--r-struct` disabled chrome. No
internal scrollbars, no border-radius on the new chrome, no em or en dash in
rendered text. The pick state machine walk (promote, swap, arm) and a real
patch purchase (180 to 110, balance re-rendering, bay dropping its outline
when unaffordable) verified over CDP.
