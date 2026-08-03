# DAD.LOG instrument-panel study

Demo: `ui-demos/dadlog-v3/index.html` (cycle `ux-2026-07-31-dadlog-v3`)
Brief: `pipeline/BRIEF.md`
System laws: [`../RULINGS.md`](../RULINGS.md)
Reference implementation: [`../loadout-eva/`](../loadout-eva/NOTES.md)
Supersedes (as a candidate, not yet): [`../dadlog/`](../dadlog/NOTES.md)

**Round 2 (2026-08-01)** answers the first review note. Three fixes, two of
them real bugs the round 1 harness was not looking for:

1. **The rail rows had no vertical room**, exactly as reported: every
   line-height in the row was inheriting a default, so two lines needed 53px
   inside a fixed 44px row and the doctype tag climbed on top of the
   filename. Line-heights are explicit now and the row is 48px, which costs
   40px of window height. See "the scroll question" below.
2. **The blinking box at the end of DAMAGED** was the alarm plate. It is an
   `<i>`, so it matched the doctype-chip rules, so it was given a GRID AREA,
   and an absolutely positioned grid item is bounded by its area rather than
   by the row. The whole-row inverse flip had been rendering as a 9x21px
   blinking rectangle over the end of the tag since round 1. Every chip rule
   is now `> i:not(.dl-flash)`.
3. **The flip was never a flip.** `steps(2)` applies PER KEYFRAME INTERVAL,
   so `0% / 50% / 100%` produced 0, 0.5, 1, 0.5: half the cycle sat at a
   50% difference blend. On the 9x21 box that read as a flicker; at full row
   size it is an unreadable muddy block. `steps(1, end)` gives the square
   wave the inverse-video idiom actually wants, and the harness now asserts
   the computed opacity only ever takes the values 0 and 1. **Worth
   flagging beyond this panel:** `loadout-eva` uses the same keyframe form
   for its risk blink, so it has the same partial-blend behaviour on a small
   element.

DAD.LOG rebuilt on the KP/OS v3 instrument-panel system. The fiction is
untouched: this is still DAD'S OWN VOLUME mounted read-only through a
forensic recovery tool, and every player-facing string is carried over
verbatim from `journal.ts`. Per `RULINGS.md` "Process" the cycle ran PURE
UI, so no loremaster or tutorial gate: a visual rebuild of an existing
window introduces neither new fiction nor anything new the player must
understand.

## Glance order

Stated first, then the type scale built to enforce it:

1. **the recovered document's TITLE**, 54px against 21px body, the largest
   glyphs on the surface by 2.59x over the next largest thing
2. **the artifact body**, and the SCAN beside it: the two things that are
   actually the file
3. **the file index rail**: what is recovered, what is damaged, what is
   still missing
4. **the volume line, the recovery instrument, the source plate and the
   bank hex**, deliberately ambient and never competing for first read

A reading surface looks like it has no focal element, which is the trap: the
integrated window put a 52px hero, three boxed metadata rows, a 304px
attachment and a full-width bank block on one plane and let the reader sort
it out. The title is the answer, because it is the one thing on the page
that says WHICH ARTIFACT THIS IS.

## What it decides

**1. The alarm is the DAMAGED SEGMENT, and it is the only red that moves.**
`--r-warn` has exactly one owner on this surface: the damaged file, in the
rail and on its page. Verified mechanically: no element outside
`.dl-row.dmg` / `.dl-doc.dmg` resolves the warn token anywhere in the
window. It is never colour alone. The row also floods inverse video (the
shipped danger idiom) and it BLINKS, on the shipped 1.2s `steps(2)` cadence,
while `--r-hazard` (the window edge, the document panel's corner brackets,
the stripe divider, the volume line's left rule) never moves at all. That
asymmetry is the whole mechanism from the reference build's round 3: static
distinction cannot beat habituation, and motion is the one channel the
ambient chrome does not have.

The flip is COMPOSITED, not painted, per law 7: a `mix-blend-mode:
difference` plate on a promoted layer cross-fading its opacity. Measured
over 420 frames per mode, the alarm running the whole time:

| mode | mean | p50 | p95 | worst |
|---|---|---|---|---|
| FLAT | 8.34ms | 8.3 | 9.3 | 9.4 |
| OFF | 8.33ms | 8.3 | 9.3 | 9.5 |

Frame parity with the tube off, which is the bar, and it held after round 2
grew the plate from one grid cell to the whole row.

**2. The window stopped growing.** Fixed at **731px on every viewport and
every run state**, against 889 to 976px for the integrated window measured
across the same three states. That is a 25% cut at the worst case, and,
more importantly, the variance went to zero: the shipped window is 87px
taller with a full volume than an empty one, so a desk you tiled on day 1
stops working by day 8.

| viewport | window w | tier | height |
|---|---|---|---|
| 16:9 1366x768 | 1040 | WIDE | 731 |
| 21:9 2560x1080 | 1120 | WIDE | 731 |
| laptop 1280x800 | 960 | WIDE | 731 |

### The scroll question

Round 1 landed 691px. The review asked for more room in the rail and
suggested making it scrollable to get it. Law 8 says no internal
scrollbars, ever, so the room was found instead: with the line-heights
fixed, ten 48px rows and their gaps need 516px of rail, and buying that
costs 40px of window. 731px is over the ~700px target and inside both the
820px ceiling and the approved reference build's own 727px worst case, so
the whole volume is visible at a comfortable row height with nothing to
scroll. If the rail should have more air still than that, a scrollbar is
the next lever and it is a one-line change; it was not taken unasked
because it overrides a settled system law.

The mechanism is that the main row is a FIXED height and the document
paginates into it. Nothing reflows the window; the document reflows itself.

**3. Paging is structural, not a fallback.** Law 8 forbids internal
scrollbars, and a document reader is where that law is hardest, because the
content length is content, not layout. So the body region is a fixed box
with `overflow: hidden`, and the paginator lays every block out at full
text, measures it, and packs blocks greedily into pages before anything
types in. Measuring at full text FIRST is what makes the typewriter safe:
page assignment can never shift while a line is still arriving.

At round 1's 691px, three of ten artifacts paged at 16:9 and four at the
laptop. The 40px the rail bought in round 2 goes to the document as well,
and at 731px **every shipped artifact now lands on one page at every
supported viewport**. The paginator stays, because it is the thing that
makes the no-scrollbar law true for content it has never seen: squeeze the
window to 760px and PATCH.SYS becomes three pages with nothing clipped.

Since the step buttons would otherwise be permanently dead chrome, they
hide themselves at one page while the `PAGE 1/1` readout stays, and the
document foot carries a `min-height` so hiding them cannot change the page
box, repaginate, and change whether they are hidden. Layout feeding a
paginator that feeds layout is a real oscillation risk.

When it does break, the break lands where you would put it by hand: the
artifact first, the player's BENCH NOTE annotation last, never mixed in.

**4. Unrecovered segments are held, not hidden.** The volume always shows
all of its segments: recovered files, then the one damaged teaser, then
dashed `LOCKED / NOT YET RECOVERED` slots to the denominator. This is law
4's equal-footprint rule applied to the thing that actually varies here, and
it is what makes the RECOVERY instrument mean something, because you can see
the empty half of the meter as rows. It discloses nothing new: the shipped
volume header already states the denominator (`RECOVERY {n}/{d}`, 9 before
the finale and 10 after), and the ghost slots carry no filenames.

**5. Roles, applied.**

| role | on this surface |
|---|---|
| struct | panel hairlines, rail row borders, doctype tags |
| note | `// LABEL` prefixes, provenance, state captions, FIG caption, plate labels, bank labels, page label |
| line | the recovery meter's filled segments, the waveform trace |
| data | the document title, filenames in the rail, the recovery numeral |
| ok | NOMINAL: the open file, the live doctype filter (both with corner-tick reticles, so the signal is never colour alone) |
| warn | the damaged segment. Nothing else, ever |
| aux | the scan: a scanned artifact is a different signal class from bench data, and its FIG tag rides the same token |
| hazard | window edge, document brackets, stripe divider, volume line rule. Static forever |

`:root` still collapses all eight onto the single v2 accent, so the page
renders exactly as v2 did with no `data-scheme`.

## Cuts taken against the ceiling

In law 8's order, with what each bought:

1. **The 304x304 square attachment is re-cut, not shrunk**, to a 240x320
   portrait crop generated AT the cell size, so it is still 1:1 dot to
   pixel. Portrait is also the honest shape for a scanned page, and the old
   square crop cut the top and bottom off every document.
2. **The three boxed metadata datarows become two compact chips plus one
   unboxed line.** PROVENANCE is the lowest-priority of the three and loses
   its box (law 8 step 4, keep the data, drop the treatment); it now runs as
   an unboxed `--r-note` line under the title, where it reads as a caption
   on the artifact rather than as a third equal field.
3. **The BANK 1/2 hex block loses its own row** and moves into the footline
   beside PREV/NEXT/FILE, trimmed from four hex quads per bank to three. A
   row you do not share is a row you pay for in full; this one cost ~50px
   for pure furniture.
4. **The SOURCE MEDIA plate has no row either.** It fills the media column
   under the scan, which is dead space the 320px cell leaves behind, so it
   is free.
5. **The rail row goes from three lines to two at a fixed 44px.** The
   filename owns the top line outright; the doctype tag and the state
   caption share the line under it.

Nothing was cut that carries copy. Every gated string still renders,
including `damaged, partial recovery`, which an earlier pass of the rail row
was ellipsising until the damaged row got its own two-line arrangement.

## Variations

- **SCHEME** NERV (default) / TOKYO NIGHT. Token block copied verbatim from
  `loadout-eva/index.html`; no hex is retyped and nothing is hand-picked per
  surface.
- **SCAN** INK TINT (default) / TRUE 1-BIT / FULL COLOUR. See below.
- **CRT** FLAT (default) / OFF. Six glass layers, copied verbatim. OFF
  removes them outright rather than fading them, and the page still reads as
  a finished flat-ink print. CURVED is not rebuilt (law 6).
- **VIEWPORT** 16:9 / 21:9 / laptop 1280x800, all three rendering the same
  arrangement.
- **RUN STATE** MID RUN (runCount 5: seven recovered, one damaged, one
  locked), FIRST OPEN (runCount 0: two recovered, one damaged, six locked),
  OPENED (machineOpened: all ten, PATCH.SYS last, nothing damaged). All
  three run through the shipped `visibleJournal` filter, transcribed.
- **REPLAY RECOVERY** replays the open beat on the current file.

## The scans

Six cells, all re-cut from art that was already commissioned, so the art
budget was 12 credits and 0 were spent. `pipeline/tools/dither.py` at
`--width 240 --height 320 --variant fine` for the 1-bit print (plus
`--invert` for the back-room tower, which is a device plate rather than a
scan), and a new `pipeline/tools/colourise.py` for the full-colour
treatment.

FULL COLOUR is a COLOURISATION, not a reveal, and it is worth knowing that
before judging it: the source art is monochrome ink illustration, so there
is no colour under the tint to uncover. The generator gradient-maps the
greyscale through a lit-desk ramp (cool ink shadow, aged paper mid, warm
lamp highlight), adds a warm radial lift where a bench lamp would sit, then
Floyd-Steinberg dithers to a 16-colour adaptive palette at the final size,
so it still reads as a dithered frame rather than a photograph. The device
plate takes a second ramp that runs from a cold void up through instrument
amber, since inverting a paper ramp gives you nothing.

`colourise.py` is banked in `pipeline/tools/` this cycle. The reference
build described this generator in prose but never saved it, so the next
panel that wants the treatment had to re-derive it.

## Build notes

- **The stage is laid out at true resolution and transform-scaled to fit**,
  the reference build's rig, so container queries inside still resolve
  against the real window width. Measure with the tube OFF; layout is
  identical in both CRT modes.
- **`nowrap` on the masthead is load bearing.** An earlier pass let it wrap,
  and at 1006px and 926px of content the tab strip dropped to a second line
  while 1086px did not. Three viewports, two arrangements, +33px of height,
  and it is invisible unless you measure all three. Everything in that row
  is now budgeted against the NARROWEST supported window.
- **`box-sizing: border-box` is repo-wide** (`_shared/kp.css`), so a 240x320
  cell with a 2px bezel silently crops the print by 4px. The scan cell is
  244x324 outer for exactly that reason. This is the accidental resample law
  5 forbids, and it does not announce itself.
- **The rail filename has its own type step**, one below the chip mono,
  budgeted against the longest shipped filename (`CONSULT_SUMMARY.SCN`, 19
  characters). On an index of ten files, ellipsising half of them makes the
  index useless.
- **Fixed-height rows need explicit line-heights, and a harness assertion.**
  Round 1 set `height: 44px` from arithmetic on font sizes and never
  measured what the row actually wanted, which was 53px. The check now
  clones each row at `height: auto` and asserts the natural height fits, so
  the same class of bug cannot come back through a font or padding change.
- **A `<i>` used as a positioning layer will match your `<i>` chip rules.**
  Cheap tag reuse cost this panel a visible bug for a whole round. Anything
  that is structure rather than content is excluded by class now.
- **Sound is a minimal inline WebAudio approximation** (the dadlog study's
  precedent), not a `sound.ts` build. No new presets: `tick`, `pageFlip`,
  `segmentMount` and `segmentDamaged` all already exist in `audio.ts` from
  the 2026-07-29 integration.
- The recovery beat is the shipped choreography, unchanged: `READING
  SEGMENT...` at 220ms, then `RECOVERY COMPLETE. FILE MOUNTED.` at 160ms,
  then the fold, then metadata, title, provenance and body typing in
  concurrently. The damaged page plays `segmentDamaged` and arrives as one
  block with no typewriter, because nothing on it was recovered cleanly
  enough to type out.

## What it still owes

- **Integration has to port the paginator**, which is genuinely new logic:
  a measure-then-pack effect that runs on open and on resize, before the
  typewriters start. The shipped React component lets the viewer grow
  instead. This is the one part of the port that is not a restyle.
- **The alarm must stay composited at integration.** A `background` or
  `box-shadow` blink on the row would read identically and cost real frame
  time inside the glass; the reference build measured that at 50ms p95.
- Nothing here is wired to real save state: the run states are fixtures over
  the transcribed `visibleJournal`.
- **One gate-shaped note, flagged rather than acted on** (per `RULINGS.md`
  "Process"): the locked ghost slots are new furniture. They state no new
  fact, since the shipped volume header already publishes the denominator,
  but if anyone wants that checked against `tutorial/ledger.md` before this
  integrates, this is the item to point at.
- The provenance line wraps to two lines on the longer entries, which
  changes how much room the body region gets file to file. The paginator
  absorbs it correctly, but the body's top edge does move between files.
  Accepted, not overlooked.
- **The step buttons are hidden in every state a reviewer can reach**, since
  everything fits one page now. The paginator is proven by the harness at a
  squeezed 760px window rather than by the demo's own rig. If it should be
  visible to review, the rig wants a NARROW viewport option.

## Verification

Driven against the live page over CDP (headless Chrome plus
`Runtime.evaluate`, per law 10, clicking the demo's own rig and measuring
real geometry) on its OWN port with its OWN tab, since parallel `/kp-ui`
sessions contend for 9222 and sharing a port means sharing a tab. 37
checks, all passing:

geometry across all nine viewport x run-state combinations (height ceiling,
height target, same three-column arrangement everywhere, masthead and
footline on one line at every width, zero clipped content, zero internal
scrollbars, identical footprint across run states, ghost slots filling to
the denominator); typography (the title is measurably the largest text on
the surface, at 2.59x body, and body holds the 19 to 21px VT323 floor); the
system invariants (no `border-radius` on chrome, no em or en dashes, both
schemes resolving all eight roles to eight distinct values); the alarm
(warn distinct from hazard, warn reaching nothing outside the damaged
segment, the alarm animating, the alarm's opacity only ever taking 0 or 1,
the ambient chrome not animating anywhere, the alarm plate covering the
whole damaged row); the rail (every row type holding its natural content
height, and no two lines intersecting); pagination (every shipped artifact
fitting one page at every supported viewport, the dead step buttons hiding
themselves, a squeezed 760px window paging rather than clipping, and the
bench note landing on the last page); the scans (ink tint tints, true
1-bit does not, full colour swaps the re-dither, and the print renders at
its native 240x320 with no resample); and the tube (OFF removes all six
glass layers outright, FLAT restores them).

Plus, outside the pass/fail set: the frame-timing table above, and a
reduced-motion pass confirming the settled state in one frame (recovery
beat skipped, title and body at full text, the scan shade collapsed, the
alarm animation off and falling back to its static inverse flood).
