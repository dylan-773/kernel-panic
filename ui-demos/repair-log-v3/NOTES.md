# REPAIR.LOG instrument-panel study

Demo: `ui-demos/repair-log-v3/index.html` (cycle `ux-2026-07-31-repair-log-v3`)
Spec: `ui-demos/repair-log-v3/SPEC.json`, item `repair-log-v3-instrument-panel`
(merged into `pipeline/proposals/ux-agent.json`)
Brief: `ui-demos/repair-log-v3/BRIEF.md`
System laws: [`../RULINGS.md`](../RULINGS.md)
Reference implementation: [`../loadout-eva/`](../loadout-eva/NOTES.md)
Supersedes (as a candidate, not yet): [`../repair-log/`](../repair-log/NOTES.md)

REPAIR.LOG, the dive result, rebuilt to the KP/OS v3 instrument-panel system.
The user's instruction was "redesign repair.log to match the new design spec",
so this is a straight port of an existing window onto the v3 laws rather than
a new surface: per `RULINGS.md`'s Process section it is PURE UI, and no
loremaster or tutorial gate was run. Gate-shaped concerns are flagged at the
bottom.

## What it decides

**1. The verdict is NOT the focal element, and the panel queue is wrong about
that.** `RULINGS.md` law 11 says "the verdict is the obvious focal element"
for this window. The game code says otherwise: `run-reducer.ts`
`duelFinished` routes a loss to `screen: "runEnd"` with `lastResult: null`,
and the finale to `"finaleWin"`. REPAIR.LOG only ever renders on a WIN. The
string REPAIR LOGGED is therefore INVARIANT on this surface, and a constant
carries no information, so it cannot be what the eye should hit first.

What varies ticket to ticket is the transaction. So the focal zone is THE
BILL, three bracketed cells reading as one row:

| cell | what it says | how |
|---|---|---|
| `// CREDITED` | what the ticket paid | hero numeral, `--r-data` |
| `// BILLED` | what it cost in strain | hero numeral, and the only `--r-warn` owner |
| `// RECOVERED` | what came off the wreck | the patch glyph, doing the numeral's job |

Stated glance order, which the type scale enforces:

1. **THE BILL**, the three cells (hero numerals measured at 67.9px against
   21px body: 3.2x, and 3.1x over the 21.8px verdict slab)
2. **THE AUGMENT CACHE**, because it is the only thing on the surface that
   needs a hand. It is second by CONTRAST, not by size: hazard-striped
   divider, a `--r-ok` PICK ONE state, and the whole width of the window
3. **the masthead**, verdict slab plus the client's win line
4. **the trace and the dive log**
5. ambient: the CLIENT CAM, the telemetry ticks, the pouch strip

**2. RISK owns exactly one thing: the strain the run has LEFT.** Not the size
of this ticket's bill. An expensive ticket you can afford is not an
emergency; strain severs the run at zero, so the alarm is the distance to
zero. It arms at or below 35, which is the same band LOADOUT.CFG uses, so one
number means one thing across the desktop.

Four channels, because law 1 forbids colour being the only one and the
reference build learned the harder half of that lesson (with hazard red
already on the window edge, brackets, stripe and REC light, static
distinction cannot beat habituation):

- `--r-warn` colour
- inverse video, the shipped danger idiom: red field, void digits
- MOTION, the one channel the ambient chrome structurally does not have, on
  the shipped 1.2s `steps(2)` cadence. The chrome stays dead still forever;
  if it ever animates, this fix is void
- the meter's own segment count, which is position rather than hue

The flip is COMPOSITED, not painted: a `mix-blend-mode: difference` plate on
a promoted layer cross-fading opacity, which is the reference's measured
9.3ms route rather than the 50ms one. Both phases were captured and checked:
a red block with void digits alternating with a void block with red digits
and a red outline. Under `prefers-reduced-motion` it settles to the static
inverse flood.

Nothing else on the surface reaches for red. The capped-bill receipt row and
LEFT ON THE BENCH take `--r-hazard`; the trap markers on the trace take
`--r-hazard`; receipt values take `--r-line`. Verified by the harness: every
`--r-warn` node on the page is inside the alarm cell.

**3. The window fits the desk, which is a harder bar than the ceiling.** A
1366x768 screen offers about 702px after the taskbar. Measured, all twelve
viewport x scenario combinations, tube off:

| viewport | window w | desk | tallest | margin |
|---|---|---|---|---|
| 16:9 1366x768 | 900 | 702 | 697 | 5px |
| 21:9 2560x1080 | 980 | 1014 | 697 | 317px |
| laptop 1280x800 | 790 | 734 | 693 | 41px |

Branch spread is 6 to 9px across the four scenarios at every viewport, so the
window does not jump between one ticket and the next.

**Checking against the 820px ceiling alone was not enough and nearly shipped
a clipped window.** An early pass measured 758 to 773px, passed a
ceiling-only check, and visibly cut the footer off in the screenshot. The
harness now computes the actual desk (stage height minus taskbar minus top
padding) per viewport and asserts the window fits it. That check is worth
copying into other panels.

## What it cuts, and why

In law 8's order:

1. **The four telemetry sparklines are cut outright.** They were four boxes of
   one idea, and none of them survived being shrunk to fit. Their VALUES
   survive as unboxed ticks in the gutter (RAM FLOW, OVER PAR, TRAPS SPRUNG,
   LINK NOISE), which is the honest weight for them.
2. **The KP/OS REPAIR BENCH v9.2 brand plate and its battery pips are cut.**
   Decoration, and the footer row it sat in cost 48px plus a gap. The DAY /
   TICKET / CREDITS chips and the primary button moved up into the masthead,
   which is exactly what LOADOUT.CFG already does with its run chips and its
   DIVE button, so this is the house pattern rather than a one-off.
3. **The patch-piece poster collapses into the bill's third cell.** It was a
   card with a title, a flavour paragraph and a status band; it is a line
   item on a receipt, so it is one now.
4. **The dive log goes from 14 lines in a narrow rail to 4 lines in two
   columns** under the trace it annotates.
5. **The client cam is a 162x150 crop** of the 162x234 print at 1:1. The
   bottom 84 rows were legs and floor.
6. **The lost-piece marker is cut from the pouch strip.** It duplicates the
   RECOVERED cell exactly, and it was the last thing on the page that could
   still change the window's height: a sixth and seventh mark wrapped the
   strip to a second row in the laptop's narrower gutter.
7. **Draft descriptions clamp to three rendered lines** with a reserved MORE
   row on every card.

Accepted costs, not oversights: a dry cache renders as a large mostly empty
dashed box, because it has to occupy exactly the room a live draft does; and
the gutter carries about 50px of slack at the wide tier, because the bill and
trace column is what binds.

## Equal-footprint states, which is where the work actually went

Law 4 asks that a sparse state occupy the room a full one does. This surface
has more empty branches than any other in the queue, and every one of them
was moving the window until it was pinned:

- the receipt reserves three rows whether the branch bills nothing, two rows,
  or a capped three
- receipt rows never wrap. One wrapped row cost 43px on exactly the ticket
  with the most to say
- the cell labels never wrap. A two-line label on one branch and a one-line
  label on another moved the focal row by 17px, which is why the third cell's
  label is the constant `// RECOVERED` rather than the branch's own title
- the heroline reserves the hero numeral's line box, so CLEAN (a word, at a
  smaller size) leaves the row as tall as a numeral does
- the flavour line reserves and clamps to the same five lines
- the dry cache box is reserved from the same parts a draft card is built from
- the masthead quote reserves two lines whatever the win line's length

Two of these were real bugs rather than tuning. `grid-template-columns` used
bare `Nfr`, which is `minmax(auto, Nfr)`, so the BILLED cell's nowrap rows set
a min-content floor and squeezed the other two cells to about 120px. And the
receipt `<ul>` kept the browser's 40px list indent, because `kp.css` resets
margin but not padding.

## Variations

- **SCHEME** NERV (default) / TOKYO NIGHT. Both resolve all eight roles
  distinctly; `:root` still collapses them onto the single v2 accent.
- **CRT** FLAT (default) / OFF, six glass layers copied verbatim. CURVED is
  not rebuilt, per law 6.
- **FEED** INK TINT / TRUE 1-BIT / FULL COLOUR on the client cam.
- **VIEWPORT** 16:9 / 21:9 / laptop 1280x800, all rendering the same
  arrangement (verified: same grid areas, same 3-cell bill, same 2-column
  log, no tab strip at any of them).
- **SCENARIO** four, covering every `lastResult` branch:
  - ROUGH WIN, a chip breakdown and a banked drop
  - CLEAN SWEEP, zero chip reading CLEAN in the nominal role, Clean Run bank
  - CAP AND DRY, halved rate plus salvage, dry cache, capped drop
  - DAY 6 STRAINED, new this cycle: the alarm armed, the bill at its 40 cap,
    the bays-full EJECT flow, and the NO PIECE THIS TICKET branch
- **REPLAY LOAD** for the choreography.

## Numbers, and three corrections to the round 1 study

Everything is transcribed from the game modules. Checking each ticket against
`DAY_CONFIGS[day].jobTiers` and the customer's own `tiers` turned up three
inherited errors, all of which are impossible states rather than debatable
ones:

- day 4 rolls `jobTiers: [2, 2, 3]`, so ticket 1 cannot be tier 1. Juno's
  tiers are `[1, 2]`, so it is tier 2 and pays `jobPay(2)` = 90, not 65.
- ticket 3 cannot be tier 4 either. Aldous's tiers are `[1, 2, 3]`, so it is
  tier 3: 115 base, halved by the cap win to 57, plus `SALVAGE_PAY` 25 = 82.
- the new strained scenario was written for day 8, which rolls `[4, 4, 4]`
  while Bram Hollander's tiers are `[2, 3]`. It is day 6, which rolls
  `[3, 3, 3]` and takes him. Day 6's `patchDrop` of 0.16 is also why the NO
  PIECE branch lives on that ticket.

The ux-agent found the third of these in its audit; the first two are the
same class of error and were found by checking the rest.

## Art

Budget was NONE and stayed NONE: no generation was run. The four client cells
are re-dithers of raws that already existed, cropped on the SUBJECT rather
than dead centre, at the destination's exact pixel size so one dot maps to
one CSS pixel:

```
python3 pipeline/tools/dither.py <crop>.png art/client-<n>-fine.png \
  --width 162 --height 234 --variant fine --gamma <g>
python3 pipeline/tools/colourise.py <crop>.png art/client-<n>-color.png \
  --width 162 --height 234 --lamp-x <x> --lamp-y <y>
```

Source crops, in the raw's own pixels, and the gamma each needed:

| client | raw | crop box | gamma |
|---|---|---|---|
| juno | `_shared/art/raw/raw-report-client-juno.png` | 60,120 to 800,1189 | 1.25 |
| sable | `_shared/art/raw/raw-report-client-sable.png` | 40,40 to 810,1152 | 1.25 |
| aldous | `_shared/art/raw/raw-report-client-aldous.png` | 240,140 to 848,1018 | 1.45 |
| bram | `pipeline/art/done/raw-repairlog-figure-bram.png` | 10,70 to 730,1110 | 0.85 |

`dither.py` gained `--focus-x/--focus-y` and `--gamma` for this: law 5 says to
frame the crop on the subject, and the tool could only centre-crop. Gamma
matters because a crop zoomed onto a subject keeps a larger share of light
backdrop, which autocontrast then maps near white; `fine` at gamma 1.25
restores the dot density without the `heavy` mush that line art cannot
survive (tested: `heavy` floods these to noise, exactly as the tool's own
docstring warns).

**Note on `colourise.py`.** It was written during this cycle and then
overwritten by a parallel cycle running in the same repo, which retuned it for
paper scans and dropped the focus arguments. The art here was generated with
the earlier version, so the commands above reproduce it only if the crop is
applied first, which is what the crop table is for. Bram is the only client
whose 1-bit print reads noisier than the others: his source is a dark shop
interior rather than a figure on a light backdrop, and gamma 0.85 is as clean
as it gets without losing him into the black.

## Verification

Driven over CDP against the live page (`ui-demos/_review/serve.ts` on 4180),
34 checks, all passing. Note that other `/kp-ui` cycles were running in this
repo at the same time and one of them drives headless Chrome on port 9222;
sharing a port means sharing a TAB, and the two harnesses navigate it out from
under each other. This harness opens its own browser on 9333 and its own tab.

Checks: desk fit and the 820px ceiling per viewport x scenario; equal-footprint
spread across the four branches; the focal element measurably largest and past
2.2x body; the VT323 and Silkscreen floors; no internal scrollbar (auto/scroll
only, since the line clamps are `overflow: hidden` by design); no
border-radius on chrome; no em or en dashes; both schemes resolving eight
distinct roles; `--r-warn` appearing nowhere outside the alarm cell; the
alarm's four channels including that its motion is composited; ambient chrome
never animating; no alarm on a healthy ticket; CLEAN reading nominal; the
draft pick installing one and dimming its siblings; the footer label flipping;
the bays-full cards saying so and opening the EJECT panel; all three viewports
resolving the same arrangement; and reduced motion settling in one frame.

A separate pass checks that no label anywhere truncates, at every viewport and
every scenario. That is what caught the `minmax` and `<ul>` padding bugs.

## What it still owes

- **Three shipped copy strings were shortened** to fit one line in the bill's
  cells: `reduced rate, you hit the turn cap` to `reduced rate, cap`,
  `salvage, augment cache dry` to `salvage, cache dry`, and `strain billed,
  capped` to `strain bill capped`. The alarm note reads `SEVERS AT 0` rather
  than `SEVERS AT ZERO`. Wrapping them instead was measured and costs 39px,
  which puts the window back over its desk. These are `report.tsx` strings, so
  they owe a loremaster look at integration. This is the one gate-shaped
  concern in the cycle.
- The dive log lines are demo-mock flavour in the duel vocabulary, as they
  were in the round 1 study. The real component types `r.log`.
- `instrumentLock` still needs to land in `audio.ts` as a real sfxr preset;
  it is the loadout-eva cycle's pending item, reused here rather than
  duplicated. Envelope values are PLAIN SECONDS.
- Sound is minimal inline WebAudio, not a `sound.ts` build.
- Nothing is wired to real state: the scenarios are fixtures and the footer
  button walks them in a loop.
- The narrow tier below 700px exists as a tiling fallback with a THE TICKET /
  THE DIVE tab strip. No supported viewport reaches it, so it is built but
  not reviewed.

## Revision 2026-08-01: review feedback, four items

The reviewer's notes, verbatim: outline the buttons in green or blue so we
know they are clickable; the client cam should be an image, not a live feed,
at the same size as the CREDITED / BILLED / RECOVERED boxes, with the stats
under it scaled to match; the placement of SKIP THE DRAFT is confusing; ECHO
TAP is not vertically aligned with other items.

**1. Clickable means outlined.** Every interactive control on the surface
carries a 1px `--r-ok` outline (`outline`, not `border`, so nothing
reflows); no static plate takes one. The ring is a new channel on top of the
existing idioms, not a replacement: hover states and the inverse-video press
floods stay, and the corner-tick reticle stays reserved for the ACTIVE
option per law 4. A disabled control drops its ring, so a disarmed group
also reads disarmed. Under `:root` with no scheme the ring collapses onto
the single v2 accent with every other role, per law 1.

**2. The client cam is a STILL, at exactly a transaction cell's footprint.**
The REC light, the scan roll and the boot wipe are cut: the log files a
capture from the counter camera, it does not stream. The cam left the gutter
and is its own grid cell in the BILL's row, and the rail track is solved so
the box equals the RECOVERED cell by construction rather than tuning:
rail = (100cqi - 27px) / 4.6, from rail = (content - rail - 27px) / 3.6fr.
Measured equality is within 0.02px at every viewport and scenario. The
still slots in with the house `kp-slot-in` like any other print, carries a
`// CLIENT CAM` annotation tag and keeps the caption bar and all three FEED
treatments. The stats below sit in the same rail track, so the column reads
as one aligned stack; their rhythm tightened (gap 6 to 4, tick line-height
1.15 to 1.05) because the stack now stands beside the trace and must not
out-tall it, per law 8's shared-row rule.

**3. SKIP THE DRAFT is the decline slot of the draft group.** It was the
masthead primary wearing a different label: a zone decision in the window's
clothes, which is what confused. The masthead button now always reads NEXT
TICKET or CLOSE THE DAY. The cache is a grid on the window's own two
tracks: the divider spans, the rail column holds a dashed SKIP THE DRAFT
slot (dashed is the house vocabulary for "nothing here", which is what
skipping banks), and the draft grid sits on the bill's column. Skipping
flips the state chip to SKIPPED, takes the picked idiom (nominal role plus
reticle, since it IS the taken option) and disarms the cards. In the eject
flow CANCEL THE SWAP takes the same rail slot, so one column means backing
out whatever the decision to its right is; the swap panel got shorter by
that move, and its kit row floor dropped to minmax(135px) so four cards hold
one row in the laptop's narrower content column. A dry cache collapses the
rail: nothing to decline.

**4. ECHO TAP: the slip is the column system, and one real state bug.** The
card row was measured in every state ECHO TAP renders (draft, picked,
dimmed, eject kit, all viewports, all scenarios): kind, name, desc and box
tops are identical to the pixel, so there was no baseline slip to fix. What
IS misaligned is what the restructure above fixes: the draft cards were the
one zone sitting on no column line the rest of the surface uses, so the
middle card (ECHO TAP on the default ticket) read as floating. The cards
now share the bill's left edge and the rail seam runs unbroken through cam,
stats and skip slot. Checking the row system also surfaced a real bug:
`kp-slot-in` runs with fill `both`, and its final keyframe pins opacity at
1, which silently cancelled `.dimmed` (0.4) on every card that had slotted
in, so a decided group never actually dimmed. Decided rebuilds now render
settled in one frame and only the load sweep animates; this also stops the
options vanishing and re-entering after a pick.

**Copy note (tutorial-shaped).** The bays-full kind line shortened from
`BOOST. BAYS FULL, PICK TO SWAP` to `BOOST, BAYS FULL`: the old string
wraps at the new card width, and a wrapped kind line moves every name in
the row (the slip the reviewer would have seen next). The affordance it
taught now has two carriers: the ring says the card is clickable, and the
eject panel says what the click means. Both strings are demo-authored, not
shipped copy.

**Heights, re-measured, tube off.** Worst case 697px, unchanged from the
pre-revision study: 16:9 tallest 697 (strained) against a 702px desk, 21:9
tallest 697 against 1014, laptop tallest 695 (clean sweep) against 734.
Branch spread still single digits, the eject state now fits with room to
spare, and all 230 harness checks pass (port 9227, its own browser, per the
parallel-cycle port lesson above).

**Art.** All eight client cells re-cut at 201x204, the largest box the wide
tier renders (21:9 width by the laptop clean-sweep row height), anchored
top centre by `object-fit: none`, so every smaller box crops and none
downscales (law 5). Framing is done by a pre-crop in the raw's own pixels;
`dither.py` and the current centre-fit `colourise.py` then run at the final
size (the focus arguments are no longer needed because the pre-crop is the
focus). Aldous and Bram needed reframing for the near-square cell: Aldous
composes face upper left with the ledger terminal entering lower right, and
Bram recentres off the register. Gammas carried over.

| client | raw | crop box | gamma |
|---|---|---|---|
| juno | `_shared/art/raw/raw-report-client-juno.png` | 60,120 to 800,871 | 1.25 |
| sable | `_shared/art/raw/raw-report-client-sable.png` | 40,40 to 810,821 | 1.25 |
| aldous | `_shared/art/raw/raw-report-client-aldous.png` | 150,105 to 848,813 | 1.45 |
| bram | `pipeline/art/done/raw-repairlog-figure-bram.png` | 128,70 to 848,801 | 0.85 |

## Revision 2026-08-01, round 3

Reviewer: "Echo tap is still not vertically aligned. Remove the next ticket
button. There should be no buttons in the top right."

Two changes:

1. **The masthead carries no buttons.** NEXT TICKET / CLOSE THE DAY left the
   top right and rides the right end of the // AUGMENT CACHE divider at chip
   scale (`padding: 1px 9px 2px`), where the eye ends the cache row. At the
   PICK ONE chip's height it costs the ceiling nothing: worst case 697.3px
   (DAY 6 STRAINED, 16:9), same as round 2. The green affordance ring moved
   with it (`.rl-div .kp-btn2`).
2. **The draft cards ride the bill's own tracks.** Round 2 put the cache on
   the rail+content column system but left the three cards at equal thirds,
   while the cells above sit at 1.3fr/1.3fr/1fr; the middle card (ECHO TAP on
   the default ticket) started 18px off BILLED's left line and read as
   misaligned. `.rl-draft` now uses the bill's exact ratios and 8px gap, so
   every vertical line the cards draw is one the cells above already drew.
   Verified equal to the pixel at all three viewports (613/859.2/1105.5 at
   16:9 for both rows).

Measured over CDP with the tube off: card left edges equal cell left edges in
every scenario x viewport combo that renders a draft; zero masthead buttons
everywhere; the divider button still flips to CLOSE THE DAY on the last
ticket and stays live after a pick or skip.

### Correction, same day (round 4)

The round 3 reading was wrong on both counts and the reviewer said so.

1. **NEXT TICKET is deleted, not relocated.** The ruling was DELETE; round 3
   moved it to the cache divider. It is gone now, along with footLabel(),
   its call sites and the click handler: this window carries no window-level
   buttons at all. The report is a receipt; how the day advances after it is
   the OS shell's decision, owed at integration. Inside the demo the rig's
   SCENARIO row stands in.
2. **The misalignment was the slot-in stagger, and it was real.** The
   settled DOM always measured aligned, which is why two rounds of settled
   measurement missed it: kp-slot-in animates translateY(16px) at steps(5)
   with per-card delays of 820/930/1040ms, so on every open and every
   scenario switch the row spent over a second in visibly held frames with
   each card at a different height. The reviewer's screenshot caught exactly
   that window. The draft row now renders settled in one frame, always;
   card y-boxes measure identical at every sampled instant, including
   t=0.15s and t=0.5s mid-choreography. The bill-track column alignment
   from round 3 stands.

### Round 5: the advance button returns

Reviewer: "put next ticket button back so close the day has somewhere to go."

NEXT TICKET / CLOSE THE DAY is restored exactly where round 3 put it: the
right end of the // AUGMENT CACHE divider at chip scale, with the green
affordance ring. The masthead stays button-free per the standing ruling.
Verified over CDP: label flips to CLOSE THE DAY on the day's last ticket,
the click walks the ticket order, zero masthead buttons, the draft row still
renders settled in one frame (no stagger), worst case 697.3px, no JS errors.
