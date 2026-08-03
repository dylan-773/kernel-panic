# DARKNET.LNK instrument-panel study

Demo: `ui-demos/darknet-v3/index.html` (cycle `ux-2026-07-31-darknet-v3`)
Spec: `pipeline/proposals/ux-agent.json`, item `darknet-v3-instrument-panel`
System laws: [`../RULINGS.md`](../RULINGS.md)
Reference implementation: [`../loadout-eva/`](../loadout-eva/NOTES.md)
Supersedes (as a candidate, not yet): [`../darknet/`](../darknet/NOTES.md)

A rebuild of DARKNET.LNK to the KP/OS v3 instrument-panel system. Nothing in
`kernel-panic-site/` is touched; the shipped `windows/darknet.tsx` was read
for structure, state flow and exact copy only.

## The problem this panel poses

Every other window in the queue has furniture to rearrange. This one is a
text stream. The shipped study puts the dial-in, the vendor, the price, the
drop and the denies at ONE weight in ONE 20px column, which is the same
"eleven blocks on one plane" failure LOADOUT.CFG was built to answer,
reached from the opposite direction. A CLI has no natural focal element.

## What it decides

**1. One FOCAL CELL whose CONTENT moves, rather than a fixed focal
element.** The cell sits top-left and holds four states:

| state | eyebrow | hero | rows |
|---|---|---|---|
| PENDING | ROUTE | a blinking `--` in `--r-struct` | ITEM / SHAPE / STOCK, all `----` |
| OFFER | RATE | tonight's price, 104px, `--r-data` | the shipped LIST card's own three rows |
| REVEAL | SIGNAL DROP | the piece that landed, 128px, `--r-aux` | SHAPE / ARMS / GUARANTEE |
| DEAD | ROUTE | MARKET OFFLINE or NO CARRIER, the alarm | the shipped epilogue line |

All four share ONE footprint, measured identical at 196px across every
state, so the window never reflows as the channel's state moves. That is
law 4's equal-footprint rule for empty SLOTS, generalised to empty STATES.

OFFER's rows are the LIST card's rows verbatim precisely so REVEAL's rows
land in an identical block. That is not a coincidence to be tidied away
later: it is what makes the state change read as the same instrument
resolving rather than as two different panels swapping.

**The focal numeral is tonight's price, and that is the whole argument.**
It is the only decision this window asks for, and the shipped window keeps
it in a 13px chip. Measured, it now renders at 104px against a 21px body:
4.95x, against law 2's 2x floor. The `?` mystery cell that used to carry the
LIST card at 108px is demoted to a 40px inline cell, because once the focal
cell holds the surface's one big visual statement, nothing else needs
card-sized scale.

**2. The reveal moves out of the log.** This is the single biggest
structural change and the single biggest height saving. The SIGNAL DROP card
(a 108px glyph cell plus three datarows, printed into the stream) is gone;
the scramble and the landing now happen at hero scale in the one place the
eye is already trained on. The log still prints the closer and the pouch
strip, so the trade still reads as a transaction with an aftermath.

**3. `--r-aux` owns the far end of the wire.** The law calls it "a different
signal class" and LOADOUT.CFG spends it on camera imagery. This window has
no camera, but it has something no other window has: a peer. Everything that
arrives over the wire takes `--r-aux`, the vendor's `??>` lines, the banner,
and the drop glyph while it is landing; everything your own machine says
takes `--r-line`. The shipped page already had this split as a `--ch2` tint
echo. Promoting it to a role makes it a rule instead of a one-off.

A deliberate consequence: a piece is drawn in `--r-aux` the instant it
lands in the focal cell, then settles to `--r-line` in the pouch strip below
once it is filed. Arriving, then held.

**4. The alarm has exactly one owner, and the denies are not it.**
`--r-warn` is the dead channel and nothing else: MARKET OFFLINE, the
`dead air` hop verdict, `carrier lost.`, NO CARRIER. It gets all three
channels the law demands, colour plus inverse video plus motion, with the
motion built as a composited difference-blend plate on a promoted layer.

SHORT takes `--r-hazard` instead: the same ambient structural red already on
the window border, the two hazard stripes and the UNREGISTERED CHANNEL line,
flooded inverse but STATIC. Verified: during a SHORT deny no `--r-warn`
colour appears anywhere on the page. POUCH FULL keeps the shipped
asymmetry, a vendor line with no boxed marker at all.

The telegraph is deliberate and is a stylistic echo of the duel's own
aim-then-strike beat, not a claim to be that mechanic: the `dead air` hop
verdict takes the alarm's COLOUR only, one beat before the full three
channel strike lands.

**5. Identity gets stronger, not softer.** Law 11's standing note is that
darknet is the odd one out "via stepped-notch chrome, not colour". Under v3
every window now shares eight roles and two schemes, so the notch, the
chevron mark, the weak-signal meter and the two-layer dither are the only
things left carrying this window's otherness. All four are verified
unchanged and all four stay on the base `--ch` / `--px-void` rather than
taking a role, because they are flavour and not state.

## Glance order

1. **The focal cell.** Extreme scale, the only decision the window asks for.
2. **The status strip.** Four chips, ROUTE / PEER / BAL / POUCH, stacked in
   one column SHARING the focal cell's row. RATE is gone, folded into the
   focal eyebrow, so no number is stated twice at two scales.
3. **The log.** The bulk of the surface's content, but not the first hit.

Deliberately ambient, never competing: the title bar's identity chrome, the
prompt, the trade chips, the footline.

Law 8's structural lesson is spent exactly where loadout-eva spent it: the
status chips share the focal row rather than taking one of their own. Their
own row would have cost roughly 70px for four short chips.

## Measured

Driven over CDP against the live page, CRT OFF (a filtered subtree is where
geometry lies to you), all four scenarios x all three viewports:

| viewport | window w | content box | tier | height |
|---|---|---|---|---|
| 16:9 1366x768 | 820 | 786 | WIDE | 696 |
| 21:9 2560x1080 | 900 | 866 | WIDE | 696 |
| laptop 1280x800 | 760 | 726 | WIDE | 696 |

**696px in all twelve combinations**, against the 700px target and the 820px
ceiling. The focal cell measures 196px in all four of its states with a
spread of 0, which is the point of the fixed footprint: the window is the
same shape whether the market is offering, dropping, or dead.

Getting the last case there took one measurement worth recording. At the
760px laptop the status strip was a 2x2 chip block, which sizes itself on
the widest chip in each column: 318px, leaving the focal cell 398px, enough
that PATCH PIECE and A CRATE FULL each wrapped to two lines and pushed the
focal 5px past its own floor. A SINGLE column of four chips measures 178px,
hands 140px back, and is still only 138px tall against the focal's 196, so
it stays free. It also reads better: an instrument sidebar rather than a
block of chips.

## Cuts, in law 8's order

1. **The log's SIGNAL DROP card is CUT** and relocated to the focal cell.
   Showing the same reveal at flat weight inside the stream was the old
   window's biggest missed opportunity and its biggest block of height.
2. **The LIST card's 108px mystery cell is DEMOTED** to a 40px inline cell.
   Not cut: it still has to signal "unknown shape" for that command.
3. **The RATE chip is FOLDED** into the focal eyebrow. See the gate-shaped
   note below.
4. **The log's alarm hero is DEMOTED** from a 40px clamp to
   `clamp(20px, 4cqi + 12px, 28px)`, now that the focal cell carries the
   primary alarm-scale statement. It still prints verbatim and still takes
   the full colour plus inverse flood.
5. **The log viewport is REDUCED** from 430px to 280px. The ring-trim
   plumbing is unchanged, so nothing is lost except how many beats print
   before old lines push off the clipped top. Roughly 10 lines visible
   against the shipped 16.

## Where it departs from the spec, and why

Three departures, all measured rather than preferred:

- **The spec's tight WIDE sub-range (700 to 800px) is CUT.** Measured, the
  laptop's 726px content box AND 16:9's 786px both fall inside it, so 16:9
  got the short log and 21:9 alone got the tall one, which is the exact
  opposite of "all three viewports render the same arrangement". One log
  height for the whole WIDE tier lands all three within 7px of each other.
- **The REVEAL glyph clamps to 128px, not 148**, and the focal cell's
  min-height is 196px, not 216. 216 was set against a glyph ceiling that
  measured 2px taller than the floor it was supposed to fit inside; 128 and
  196 make the four states measure identical and hand 20px back to the desk.
- **The alarm's keyframes HOLD each half instead of stepping through it.**
  This one is worth reading twice, because it is a defect in the reference
  implementation and not just here. `steps(2)` applies to each keyframe
  INTERVAL, so the reference's `0%,100% {opacity:0} 50% {opacity:1}`
  actually samples 0, 0.5, 1, 0.5: half the cycle sits at HALF opacity. On
  loadout-eva's 38px strain numeral that passes as a blink. On a 375px alarm
  slab it is a pink wash that eats the text outright, which is how it was
  caught. `0%,49.99% {opacity:0} 50%,100% {opacity:1}` gives the square wave
  the idiom was always supposed to be, and both phases were then verified
  legible: red slab with void text, then void slab with red text.
  `loadout-eva`'s `lo-risk-blink` has the same construction and would
  benefit from the same one-line fix.

## Variations

- **SCHEME** NERV (default) / TOKYO NIGHT. Both verified resolving all eight
  roles to distinct hues.
- **CRT** FLAT (default) / OFF. Six glass layers, copied verbatim, added and
  removed rather than faded. CURVED is not rebuilt (law 6).
- **VIEWPORT** 16:9 / 21:9 / laptop 1280x800, all rendering the same
  arrangement.
- **SCENARIO** NIGHT 4/5 (the shipped mock run; one pull fills the pouch,
  the next is the full deny), FRESH NIGHT (empty pouch, five pulls to full
  and broke; the seeded stream lands the CROSS jackpot on the fourth),
  BROKE (day 6 price 50 against 35 cr, so SHORT is reachable), and MARKET
  OFFLINE (hop 2 hits dead air; the canonical scenario for the alarm).
- **REPLAY DIAL-IN** replays the choreography against whichever scenario is
  selected.

## Build notes

- Game numbers are shipped constants transcribed verbatim:
  `darkPatchCost(day) = 25 + 5 * (day - 1)`, `PATCH_POUCH_MAX` 5, roll
  weights I 40 / L 45 / T 12 / X 3 with uniform rotation, and
  `darkPullPrice`'s 0.85 `darkDiscount` multiplier (wired, unused by any
  scenario). Pulls come off a seeded LCG (seed 25 rolls L, T, L, X, I),
  never `Math.random`. The shipped game rolls in the reducer instead; that
  difference is demo-only and stays demo-only.
- Zero new sfx presets. Every beat reuses one of the four already wired to
  this surface (`darknetLinkUp`, `darknetLinkDown`, `darknetReveal`,
  `tick`), fired at the same logical instants, now also marking the focal
  cell's state transitions. Sound is minimal inline WebAudio, the dadlog and
  loadout-eva precedent, not a `sound.ts` build.
- Zero new player-facing copy. Every sentence on the page is verbatim
  shipped copy. The eyebrow's RATE / SIGNAL DROP / ROUTE are existing bare
  UI labels in new positions, not new lines. No copy order was filed.
- `?instant` in the URL forces the reduced-motion path, which is also
  exactly what `prefers-reduced-motion` players get.
- One departure from loadout-eva's literal practice, stated on the record:
  `--r-struct` is applied broadly and literally here to every plain chrome
  border, where loadout-eva mostly left them on `--ch-dim` and reserved the
  role for a single bezel. RULINGS' own table defines struct as "panel
  frames, dividers, disabled outlines", which is this usage.

## Gate-shaped notes (this cycle was PURE UI: no loremaster, no tutorial)

Per RULINGS "Process" this is a redesign of an existing window, so neither
gate ran. Two things a gate would want at integration time:

1. **Folding RATE into the focal cell removes the standalone chip the
   shipped integration's own tutorial gate added** (`ux-2026-07-29-darknet-cli`
   addendum: "tonight's price stays readable at a glance, no command
   required"). The focal cell's OFFER state satisfies that fact more
   directly, a 104px numeral against a 13px chip, so this reads as
   strengthening the fix rather than undoing it. Named here so it is not a
   surprise at gate time.
2. **No copy changed**, so the loremaster has nothing new to rule on. The
   `--r-aux` vendor voice is the same tint echo that was already ruled a
   legal echo in the darknet-cli gate, now expressed as a role.

## What it still owes

- **Nothing here is wired to real state.** BUY does not dispatch the
  reducer's `buyDarkPatch`, so the reveal lands on a client roll rather than
  the reducer's deterministic one. Integration must restore that: the
  shipped window's reveal scrambles onto `run.lastDarkBuy` and must keep
  doing so.
- **The mid-session LINK DROP and RELINK paths are specified but not
  built.** They exist in the shipped component (the market closing under an
  open channel, and reopening under a dead dial) and both would drive the
  focal cell's DEAD and OFFER transitions. The study has no day clock to
  drive them from, so they are reachable in the game and not here. The CSS
  and the state machine already support both.
- **EXIT does not close a window**, because there is no window manager here.
  It plays the full NO CARRIER teardown and stops.
- The `FREE DESK` ghost is inherited from loadout-eva and is drawn faintly
  enough at scaled-down review sizes to be easy to miss. Cosmetic.
