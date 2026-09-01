# MANUAL.TXT v3 (instrument panel)

Cycle `ux-2026-08-31-manual-v3`, spec item `manual-v3-instrument-panel`
(`pipeline/proposals/ux-agent.json`). Replaces the look of the shipped
`windows/manual.tsx`, one of the last two pre-v3 windows (RULINGS.md law 11
queue). Pure UI cycle: an existing-window redesign, no gates.

## What it is

The shop's reference file as a v3 instrument panel: five sections (DIVE /
KIT / PATCHES / AUGMENTS / BAYS) behind a tab strip, one fixed-height
content frame with the section's HERO LETTERHEAD as the focal element, and
a measure-then-pack SET pager for any section too tall for the frame.
Every player-facing string is transcribed verbatim from the CURRENT
working-tree `manual.tsx` / `kit.ts` / `patch-cells.ts` (post the
2026-08-31 split-board copy corrections). Nothing reworded, nothing
truncated.

## Glance order

1. The section hero (DIVE / KIT / ...), Silkscreen at `clamp(46px, 8cqi,
   84px)`: the one thing that says which page of the manual is open.
   Measured 4.8x to 5.6x the next-largest text across the three viewports.
2. The section content itself.
3. The tab strip; the active tab carries `--r-ok` inverse fill plus a
   corner-tick reticle, the surface's only NOMINAL state.
4. Ambient: the footer PAGE n/5 chip + PREV/NEXT, the letterhead SET pager,
   the REQ footnotes.

`--r-warn` and `--r-aux` are UNOWNED by decision (no alarm state, no
imagery); neither token is referenced by any rule on this surface.

## What it decides

- **PAGE vs SET.** The footer PAGE n/5 counts sections; the letterhead SET
  n/N counts a paged section's own card sets. Two nouns, never merged.
- **The 18-card AUGMENTS catalog packs, it does not scroll or shrink.**
  DAD.LOG's measure-then-pack paginator generalized from prose blocks to
  whole rows (a row is never split; repacks on resize and tier change).
  Measured: CARD GRID packs to 4 sets at 16:9, 21:9, and laptop; COMPACT
  LIST also 4 sets at all three. (The spec's pre-build arithmetic guessed
  2 sets from a ~460px budget; the real rail is ~350px once the hero,
  subhead, and paddings are paid. Recorded here per the spec's own
  honesty rule.)
- **KIT pages too.** Built first as a 3-column trinity mirroring
  LOADOUT.CFG; measured 486 to 606px of content against a ~375px budget at
  every supported width, so it transposed to stacked program rows (modes
  as columns inside each row, the closing "Upgrades..." line riding the
  header) and runs through the same packer: 2 sets, SCAN+ATTACK then
  DEFEND. The packer is section-agnostic on purpose: any future content
  growth repaginates instead of clipping.
- **The PATCHES bench diagram is cut, not re-cropped** (the only true law 8
  cut on this surface). It was a live law 5 violation in the shipped
  component (304x304 dither forced to 180x128) and a third reuse of the
  bench asset LOADOUT.CFG and DAD.LOG already show. MANUAL.TXT stays all
  type; the flagged shipped bug persists until integration (see the
  `law5-downscale-audit` suggestion).
- **Equal footprint across tabs**, generalized from law 4: the frame is one
  fixed-height box, so every tab renders the identical window height.
  Short tabs keep visible dead space below their prose; instrument-panel
  spacing, accepted.

## Measured (CDP, reduced-motion, CRT off)

- Window height: 693px (16:9), 692px (21:9), 692px (laptop), identical
  across all five tabs and every SET page. Target 700, ceiling 820.
- No element overflows its box on any tab, set, layout, or viewport.
- All 18 augment entries render in full across the sets in both layouts.
- Both schemes resolve the six owned roles to distinct values; no
  `data-scheme` collapses to the single v2 accent.
- No border-radius outside the tube, no em/en dash, no img on PATCHES.
- All three viewports render the same WIDE arrangement (one-row tab strip,
  3-column grid); the sub-700px tier exists as a tiling fallback only.

## What it still owes

- The review verdict on CARD GRID vs COMPACT LIST as the shipped default
  (both pack to 4 sets; the grid gives each entry a plate, the list reads
  as a spec sheet), and STEP vs DOTS for the pager.
- At integration: the shipped `pageFlip` preset replaces the demo's
  WebAudio approximation, and the `manual-deep-link-anchors` suggestion
  (stable per-card anchors + an `openManual(section, anchor)` hook) is
  cheapest to take while this DOM is fresh.
- Dead space on sparse SET pages (most visible on AUGMENTS set 1, which
  carries the three tall config cards alone) is the honest cost of
  never-split rows; a display-order repack that interleaves tall and short
  rows is allowed by the spec if the review wants fuller pages.
