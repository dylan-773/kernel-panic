# Tutorial gate: ux-2026-07-31-loadout-eva

Reviewed: `pipeline/proposals/ux-agent.json`, item `loadout-eva-instrument-panel`
(the maximalist LOADOUT.CFG instrument-panel study, `ui-demos/loadout-eva/`).
Scope per `pipeline/BRIEF.md` `ux-2026-07-31-loadout-eva`: standalone study
only, nothing integrates this cycle. This cycle **replaces** the prior
`ux-2026-07-29-darknet-cli` review wholesale (house style: this file is not
append-only, `tutorial/ledger.md` carries the durable record). Per the
dadlog cycle's own precedent (`tutorial/ledger.md` loop history, 2026-07-29),
a pre-integration study review records its full findings here and in the
ledger, not as `pipeline/proposals/tutorial-agent.json` items that would
imply readiness to integrate today. No proposal file changes this cycle; see
ledger loop history for the explicit note.

Grounded directly against shipped code, not the proposal's own citations:
`kernel-panic-site/app/src/components/game/duel.tsx` (lines 776-949),
`.../components/os/windows/solder.tsx` (lines 1-40, 396-490),
`.../components/os/windows/loadout.tsx` (lines 140-430),
`.../components/os/windows/report.tsx`, `.../components/os/windows/darknet.tsx`,
`.../game/content/kit.ts` (lines 79-109), `.../game/patch-cells.ts` (lines 20,
26), `.../src/styles.css` (mode/bay pill classes), and `tutorial/ledger.md`'s
Coverage table and waiver log.

**Five items reviewed. 3 COVERED outright, 2 NEEDS-TEACHING (both tier 0).**

## 1. The pouch paragraph cut

**COVERED**, with a correction to the proposal's own citation.

The proposal's `cuts` entry claims duel.tsx:785,937 (teaching moment
`patch-cell-use`) plus SOLDER.BAY (solder.tsx:32-33) already teach "the
placement cost and sourcing facts." Verified directly, fact by fact, against
the shipped surfaces and `tutorial/ledger.md`:

- **2 RAM placement cost.** TAUGHT. Stated three times independent of the cut
  paragraph: the coachmark `patch-cell-use` ("fuse it in for 2 RAM",
  `content/teaching.ts` lines 374-386, ledger row `patchCellUse`/`patchShapes`,
  ledger lines 82-83), the live console line at `duel.tsx:785`
  (`` `PATCH PIECE: pick a slag block within reach. ${PLACE_COST} RAM.` ``,
  shown every time a piece is armed), and the button `title` at `duel.tsx:937`.
  The redesign's own `PLACE COST / 2 RAM` chip is a fourth, redundant
  restatement. Safe to cut the prose.
- **Single use.** TAUGHT. The `patch-cell-use` coachmark's own second clause,
  "One use, then it is gone." Unaffected by anything in this proposal.
- **One per turn.** TAUGHT, but NOT by the citation given. The
  `patch-cell-use` coachmark never says "per turn," only cost and single-use.
  The real carriers are `duel.tsx:937`'s button `title`
  (`econ.placedThisTurn ? "One piece per turn" : ...`, a native hover title,
  not TapTip-wrapped, so it is not confirmed touch-safe, and it only appears
  once a player has already placed one piece and tries for a second) and,
  unconditionally, SOLDER.BAY's own footline: `solder.tsx:30-33` defines
  `FOOT_LINE` as the IDENTICAL sentence being cut from LOADOUT.CFG ("...2
  RAM, one per turn, single use. Pieces come off the darknet, drop from
  cleared jobs, or bank on clean wins; the pouch holds
  ${PATCH_POUCH_MAX}."), rendered unconditionally at `solder.tsx:490`
  (`<p className="kp-solder-caption">{FOOT_LINE}</p>`) every visit to
  SOLDER.BAY, not gated behind hover. This is a stronger, more complete
  restatement than the proposal cited. Cutting the LOADOUT.CFG copy is safe
  because SOLDER.BAY (which the pouch panel's own click-through button opens,
  `loadout.tsx:409`) carries the full sentence, not because duel.tsx does.
- **Sourcing (darknet, job drop, clean-run bank).** TAUGHT/WAIVED, and NOT by
  duel.tsx:785/937 as claimed; those two sites never mention sourcing at all.
  The real coverage: the darknet route is TAUGHT by the `night-shop` coachmark
  (ledger row `darkWebBuy`, ledger line 99); the job-drop and clean-run-bank
  routes are WAIVED via the `patchDrop` row (ledger line 103, "The drop row
  names the recovered shape in text with its glyph inline, on the only screen
  a piece can arrive," confirmed live on REPAIR.LOG). All three routes are
  also restated verbatim in SOLDER.BAY's `FOOT_LINE`.
- **Pouch cap of 5.** WAIVED, self-evident, no prose ever required. Confirmed
  live on four independent surfaces beyond the cut paragraph: the five-slot
  `patchGlyph` rack with visible holes (kept unchanged by this proposal's own
  Z4 spec, and confirmed present in both RUN STATE snapshots, including "0/5
  pouch glyphs (5 holes)" for DAY 1 EARLY); SOLDER.BAY's numeric
  `{pouch.length}/{PATCH_POUCH_MAX}` counter and its own five-slot rack
  (`solder.tsx:398-403`); REPAIR.LOG's drop row, which prints the literal
  status label `POUCH FULL` when a drop cannot bank because the pouch is
  already at cap (`report.tsx:337`, feeding the `patchDrop` waiver); and
  DARKNET.LNK's own `POUCH {n}/{PATCH_POUCH_MAX}` chip plus its
  `patchPouch.length >= PATCH_POUCH_MAX` purchase gate (`darknet.tsx:338,
  347, 731`).

**Condition, not a blocker:** the five-slot glyph rack (filled + dashed
holes) must ship in the study exactly as specced in Z4, since it is now
doing real teaching work (the cap-of-5 affordance) that the redesign does not
otherwise restate in words. The proposal's own acceptance checks already
require this ("0/5 pouch glyphs (5 holes)" for DAY 1 EARLY), so no change
needed, just flagging why that particular check is load-bearing.

**Non-blocking, out of scope this cycle:** `duel.tsx:937`'s "One piece per
turn" title is a raw HTML `title`, not wrapped in `TapTip` the way every
other tip in this game now is (`touch-safe-tooltips`, ledger Closed
2026-07-26/re-confirmed 2026-07-29). This is a pre-existing crack in
DIVE.EXE, unrelated to the LOADOUT.CFG redesign under review (DIVE.EXE is
explicitly out of scope this cycle and this proposal does not touch it).
Logged to the ledger's Open Work for whenever DIVE.EXE's own reskin cycle
comes up; not a finding against this item.

## 2. The boost-bay descriptions (always-visible paragraph to hover/focus/tap popup)

**NEEDS-TEACHING** (tier 0), narrowly: the popup mechanism itself is fine,
one specific gap needs a fix before this ships.

The proposal's precedent claim is accurate: `loadout.tsx:182,353,370`
confirms mode chips already reveal their owned description only via
`TapTip` (`modes.tipFor` returns `attackModeDesc`/`defendModeDesc` for owned
modes), not as always-visible text, for every mode except the currently
active one (which also gets a `TypedDesc` paragraph below). So hover/tap-only
disclosure of a game-mechanic description is an established, working pattern
in this exact window, not a new risk class.

The `augmentEffects` blanket waiver (`content/teaching.ts` lines 236-242,
ledger line 110, ledger waiver log lines 179-182) covers this: "Every
augment carries its own desc on the draft card, in the loadout, and in
MANUAL.TXT," premise `augmentDescs`, checked against the DATA (every
`AUGMENT` has a `desc` field), not the rendering, so it is explicitly
reskin-proof per the ledger's own note. A tap-to-reveal popup still
satisfies "in the loadout." `manualRef` (ledger line 87, TEACH_TIPS
`manualRef`) remains an independent, always-available fallback regardless of
what LOADOUT.CFG does. So the CONTENT survives; nothing here is untaught.

**The gap:** unlike a mode chip, which needs no visible "holds more" cue
because the active mode's description is ALSO always shown in full below it,
an augment pill has no such fallback: all owned augments are simultaneously
in effect (not mutually exclusive like modes), so a compact pill reading
only a bare name (e.g. "OVERTIME CLAUSE") gives zero visual signal that
hovering or tapping reveals anything at all. This is the exact case the
ledger's own standing Open Work note already flagged as unresolved: "nothing
on screen says a control holds more... a ui-spec for ux-agent whenever chrome
changes are back in budget" (`tutorial/ledger.md`, Open Work, "Touch tips'
discoverability affordance," 2026-07-29). This cycle is that budget window:
a full LOADOUT.CFG chrome rebuild, and the first case in the game where
hover/tap is the ONLY path to an augment's effect text rather than a bonus on
top of always-visible text.

**Fix (tier 0, ui-spec, addressed to ux-agent):** give `.lo-bay-pill` a
small, persistent visual marker that it holds more: a dot or dotted underline
under the augment name, consistent with (and closing) the ledger's existing
open ask, scoped for now to this control since it is the one where the
absence is load-bearing. Locked/future pills (which hold no augment, hence
no popup) should not carry the marker. This is a small addition to the
existing `.lo-bay-pill` spec, not a new zone.

**Hard condition for integration, already promised by the proposal itself,
restated here so it is not lost in a later pass:** the study's own vanilla
hover/click-toggle implementation is explicitly a placeholder; at
integration this MUST become the shipped `TapTip` component verbatim, not a
bespoke reimplementation, per the proposal's own note. Flagging as a
condition, not a new ask.

## 3. Narrow-tier paging and truncation

Two separate questions, two different verdicts.

### 3a. Truncating a program description to ~60 characters plus tap-to-expand

**NEEDS-TEACHING** (tier 0 fix to the truncation rule itself).

Checked the actual six mode descriptions in `kit.ts:79-109` against a hard
60-character cut, not the idea of truncation in general. Two of six put
their entire mechanical payoff PAST character 60, so a player who never taps
"..." sees an incomplete sentence with no verb telling them what the mode
actually does:

- `armHalt` (`kit.ts:85-86`): `"Plant a halt trap on an open junction. When
  their signal claims it, they lose a full turn."` At 60 characters this
  reads `"Plant a halt trap on an open junction. When their signal cla"`,
  cut immediately before "claims it, they lose a full turn." The entire
  effect (lose a turn) is invisible without expanding.
- `armSiphon` (`kit.ts:87-88`): `"Plant a siphon trap on an open junction.
  When it fires, {n} RAM drains from their next turn into yours."` At 60
  characters this reads `"Plant a siphon trap on an open junction. When it
  fires, {n"`, cut before "RAM drains from their next turn into yours." The
  entire effect (how much RAM, and that it steals from them into you) is
  invisible without expanding.

This is exactly the `modeEffects` blanket waiver's premise
(`content/teaching.ts` lines 243-249, ledger line 111, ledger waiver log
lines 183-184: "each carries its own desc... in the kit card") being
undercut on one specific viewport tier: the waiver is checked against the
DATA having a desc, not against a rendering that cuts the desc before its
own payoff clause. `redirect`, `purge`, `lock`, `ward`, and `scanDesc` all
happen to state their core effect before or within roughly the first
sentence, so 60 characters is a survivable (if tight) cut for those five;
`armHalt` and `armSiphon` are the two where it is not.

**Fix (tier 0, ui-spec, addressed to ux-agent):** do not truncate at a fixed
character count. Truncate at a sentence boundary only, and never cut before
the sentence that states the ability's numeric or mechanical effect (for
`armHalt`/`armSiphon` this means keeping BOTH sentences, since the effect is
in the second one). Concretely: measure the longest full description across
every tier of `attackModeDesc`/`defendModeDesc`/`scanDesc` (my own spot
check puts the longest around 125-130 characters, `redirect` at higher
tiers) and set the pre-expand budget at or above that measured max, so no
description shipped today ever needs the "..." affordance to state its own
effect; reserve the expand affordance for future content that actually
exceeds it. This is a one-line change to the truncation length plus a
sentence-boundary clamp, not a new zone or a coachmark.

### 3b. Paging half the window behind PROGRAMS / RIG & STATUS tabs

**COVERED.**

Checked what specifically sits behind the RIG & STATUS tab in narrow tier:
Z2 (gutter: operator stats, monitor bezel, all non-mechanic flavor, no
`MECHANIC_INVENTORY` entry) and Z4 (boost bays, patch pouch, neural strain).
None of these mechanics' FIRST CONTACT is LOADOUT.CFG:

- `boostSlots` firstContact is `result` (ledger line 146), already TAUGHT
  there via the `boostSwap` coachmark and the `boostSlots` tip before a
  player would ever need to check it again in LOADOUT.CFG.
- `patchCellUse`/`patchShapes` firstContact is `duel` (ledger lines 82-83),
  already TAUGHT there.
- `strainChip` firstContact is `result` (ledger line 85), already TAUGHT
  there via coachmark plus tip.

LOADOUT.CFG has only ever been a REFERENCE surface for these three (a place
to re-check a number already explained elsewhere), never the first-contact
surface, so paging it behind one extra tap does not create a first-contact
gap for any mechanic in the inventory. The masthead (verdict slab, sentence
line, DIVE button) stays persistently visible above both tabs per the spec,
so the one thing a returning player actually needs immediately (am I ready,
can I dive) is never behind the tab. This matches the BRIEF's own sanctioned
mechanism ("reflow, page, or tab, never scroll").

Non-blocking observation, not a teaching finding: the spec does not state
which tab is the default-active one in narrow tier. Since Z3 (programs) is
glanceOrder 1 (the most decision-relevant content), defaulting to PROGRAMS
rather than RIG & STATUS would match that stated priority; this is a UX
sequencing call for the ux-agent, not something with teaching consequences,
since no mechanic's first contact depends on it either way.

## 4. New visual codes to decode

**COVERED**, item by item.

- **Hero numeral + small unit caption (RANGE/WIDTH).** COVERED. The numeral
  is never bare; the spec pairs it with a `RANGE`/`WIDTH` caption, which is
  the exact same label already used and already WAIVED at normal scale
  (`programTiers`, ledger line 91: "LOADOUT.CFG's program rows show each
  program's live RANGE or WIDTH number directly beside its TIER meter").
  Scaling that pairing up to hero size does not change what is being said,
  only how loud. Watch item for the ux-agent, not a teaching gap: at a
  64-116px numeral against a 9px caption, verify in the actual build that
  the caption stays legibly attached rather than reading as a stray label
  under a giant number, especially under the heavier CRT bloom/vignette
  layers this study adds.
- **Corner-tick "reticle" on the active mode chip.** COVERED, and redundant
  by design, which is the right call. `styles.css:2980` confirms
  `.kp-mode2.mode-on` already floods inverse video (ink fill, void text),
  the same "shared press-state/selected" language used system-wide for
  "this is the active one." The reticle adds a second visual channel
  reinforcing a fact an established, already-self-evident convention already
  states unambiguously. It teaches nothing new; it is not required to.
- **Equal-footprint empty vs. locked-future boost bay pills.** COVERED. This
  is the exact shipped distinction carried into a new shape, not a new
  code: `styles.css:3015-3017` already differentiates `.kp-bay-empty`
  (dashed) from `.kp-bay-future` (dashed, fainter border, lower opacity) in
  card form today. The RULE behind the distinction (3 active, buyable to 5)
  is independently TAUGHT by the `boostSlots` tip (ledger line 94), which
  the spec keeps mounted on the same `BOOST BAYS` section head in Z4. The
  pill-level visual difference is reinforcement, not the sole teacher of the
  rule.
- **One-word READY/LOADING verdict slab.** COVERED, and already correctly
  self-scoped by the proposal's own `owedCopyNote`: the full verbatim
  sentence ("DIVE KIT READY."/"DIVE KIT IS LOADING...") ships directly
  beside the one-word slab, so the slab restates a fact stated in full on
  the same screen at the same moment. No new information, no gap.

## 5. Anything else needing a teaching path

**COVERED.** No other new mechanic, stat, resource, or purchase was found in
this item. The container-query fluid-type strategy, the CRT layer
construction, the amber hue token block, and the demo rig's own switches
(CRT/HUE/VIEWPORT/RUN STATE) are presentation and review tooling, not
player-facing rules. The gutter's demotion of DIVES CLEARED/LOST/RAM PER
TURN from boxed rows to unboxed ticks is a glance-order change to
non-mechanic historical flavor (no `MECHANIC_INVENTORY` entry exists or is
warranted for it), consistent with the proposal's own `cuts` rationale.

## Summary for the build

Two fixes needed before this study is ready for user review, both tier 0,
both scoped to the ux-agent's own spec, neither requiring a coachmark or a
copy order:

1. Add a small persistent "holds more" marker (dot or dotted underline) to
   `.lo-bay-pill`'s augment name, on filled pills only. Item 2 above.
2. Replace the fixed ~60-character truncation on narrow-tier program
   descriptions with a sentence-boundary clamp sized to the longest actual
   description in `kit.ts` (all tiers), so `armHalt` and `armSiphon` never
   ship with their effect clause hidden behind an unexpanded "...". Item 3a
   above.

Everything else in `loadout-eva-instrument-panel` is COVERED as specced.

`tutorial/ledger.md` updated this cycle: a loop history entry records this
full review; no Coverage-table rows change (no mechanic gains or loses
status, this is a presentation-layer review of an unshipped study); no
waiver's underlying claim is affected since none of the surfaces this
proposal touches have integrated. No `pipeline/proposals/tutorial-agent.json`
items filed, matching the pre-integration-study precedent set by the
`ux-2026-07-29-dadlog` cycle: findings live here and in the ledger until the
study is approved and headed for integration.

---

# Tutorial gate: ux-2026-07-31-loadout-eva (round 2)

Reviewed: the round-2 revision to `loadout-eva-instrument-panel` requested by
the user after seeing round 1 (`ui-demos/manifest.json`, `loadout-eva`
history, 2026-07-31: "I'm wanting to see if we can break away from the single
color design... use Evangelion colors... the deck feed is underlapping with
scan.exe, and attack.exe is not vertically in line... The layout on 16:9,
21:9, and 1280x800 should be the same. I see no reason to need to support 4:3
right now."). Round 1's content above is unchanged and still stands; this is
an addition, not a replacement, per this round's own instruction.

Grounded directly against the LIVE demo file, which already implements this
round rather than merely planning it: `ui-demos/loadout-eva/index.html`
(role-token block lines 58-102, `.lo-mode.mode-on` lines 563-572, strain
threshold CSS lines 698-732, threshold JS lines 1492-1496, the new `day8` run
state lines 1085-1109 and its `label`, the `@container` breakpoint change to
700px lines 754/809/826 with the 4:3-dropped comment at 1578-1579, and the
sentence-clamp `DESC_BUDGET` at 1053-1064 confirming round 1's tier-0 fix
already landed) rather than the proposal text, per this seat's own standing
practice. Also read: `kernel-panic-site/app/src/components/os/shop-os.tsx:588`,
`.../components/os/windows/inbox.tsx:586`, `.../game/run-reducer.ts` lines
83, 252, 357, 406, 481, 537 (strain semantics), `.../styles.css:773-775,
814-815,2969-2981` (the shared inverse-video idiom), and `tutorial/ledger.md`
Coverage rows `strainChip` (line 85), `kitConfig` (line 90), `programTiers`
(line 91), `boostSlots` (line 94), `modeEffects` (line 111).

**Five items reviewed. 4 COVERED. 1 NEEDS-TEACHING (tier 0), and the fix
belongs to two already-shipped call sites, not to this study.**

## 1. Color now carries semantics: does hue-as-state need teaching?

**COVERED.**

The load-bearing fact: every state this scheme recolors was ALREADY carrying
its meaning through a non-hue channel before this round, and that channel is
untouched. `.lo-mode.mode-on` (index.html:563-572) still floods full
inverse-video fill (`background: var(--r-ok)`) AND keeps its round-1 corner
reticle marks, now also recolored but still present as their own shape cue;
the shipped equivalent this stands in for, `.kp-mode2.mode-on`
(`styles.css:2980`), does the identical fill-flip today with a single ink.
Hue is a SECOND, additive channel layered on top of a fill/shape distinction
that already fully carries "this is the active one," confirmed against
`kitConfig` (ledger line 90) and `modeEffects` (ledger line 111): a colorblind
player loses only the bonus reinforcement, not the fact itself.

On the specific question asked: does GREEN-for-active plus RED-for-risk
resolve or worsen the standing ambiguity that inverse video means both
"danger" and "selected" system-wide (`kp-datarow-warn`, `kp-chip-crimson`,
`kp-mode2.mode-on` all share one CSS treatment, `styles.css:773-775,814-815,
2980`, unchanged by this study)? It resolves it, for a sighted player,
without weakening it for anyone else. Under the single-ink scheme that
ambiguity is only ever disambiguated by WHERE the fill appears (a mode chip
vs. a strain number) and by context, never by the fill itself. Giving
"selected/nominal" its own hue (green) and "danger/risk" its own hue (red)
means the two meanings of inverse-video now also differ in hue wherever both
hues are visible, on top of the position-based disambiguation that already
worked and still works unchanged. No case exists on this window where an
active-mode chip and a risk-band strain reading could be confused for each
other; they are different controls in different zones. No coachmark needed:
this is reinforcement of an already-self-evident, already-taught state, not
new information.

The cyan BENCH FEED tint (aux channel, camera-only) and the amber
structural/neutral base carry no rule either: cyan marks "this is a video
feed, not managed UI" by simple visual convention (a different texture
class, matching the FIG.01 imagery precedent round 1 already cleared), and
amber is simply the renamed default single-ink role. Neither needs a moment.

## 2. Neural Strain gains a threshold color

**NEEDS-TEACHING (tier 0), but not on this study.** The study's own threshold
logic is COVERED; this review surfaced a live, independent, and more severe
problem on two already-shipped screens that this study's correctness now
throws into contrast.

**The study, checked on its own merits: COVERED.** `run.strain` counts DOWN
from `START_STRAIN = 100` (`run-reducer.ts:83`) toward 0, where the run ends
("severs", `run-reducer.ts:406`); high strain is safe, low strain is
dangerous, matching REPAIR.LOG's own "`{run.strain}` STRAIN LEFT" phrasing
(`report.tsx:442`). The study's threshold (`index.html:1492-1496`: NOMINAL
`> 70`, RISK `<= 35`, silent WATCH band between) has the direction right.
More importantly, the RISK band is NOT color-only: `.lo-strain-low
.lo-strainnum` (`index.html:720-724`) floods full inverse video (`background:
var(--r-warn); color: var(--px-void)`), the identical shipped danger idiom
(`kp-chip-crimson`, `styles.css:814-815`), so a colorblind reader loses
nothing at the one threshold that actually calls for action. The NOMINAL
band (`.lo-strain-ok`, `index.html:717-718`) is color-only (green text vs.
the default ivory), but this is low-stakes: NOMINAL and the silent WATCH
band both mean "keep going," so a colorblind player who cannot tell them
apart loses a reassurance, not a warning. No coachmark needed: the specific
cut points (70, 35) correspond to no mechanical rule (searched for any
gameplay effect gated at 35 or 70 strain and found none beyond these color
thresholds themselves), so there is no fact to teach beyond what `strainChip`
already teaches (ledger line 85: "Strain is shared... will not recover
between them. Zero ends the run," `strain-chip` coachmark,
`content/teaching.ts:307-320`, plus the `strain` tip, lines 427-431); the
color is illustrative urgency on an already-explained number, not a new rule.

**The real finding, tier 0, urgent, and outside this study's files.**
`shop-os.tsx:588` and `windows/inbox.tsx:586` both apply the shared danger
treatment (`kp-chip-crimson`) to the STRAIN chip on the condition
`run.strain > 70`. Given the semantics just confirmed (`run.strain` is
remaining health, high is safe), this is backwards: it floods the danger
idiom onto the SAFEST band of the stat and leaves the actual risk band
(approaching 0) in plain, unflagged text. Because every run starts at
`strain: 100` (`run-reducer.ts:252`), this fires from the very first frame of
every player's very first ticket, before a single point of strain has been
spent, showing "danger" chrome on a fully healthy stat. This is not
hypothetical or edge-case: it is the default state of the game. It also now
sits in direct, checkable contradiction with the correct direction this
study just built for the same stat on the same class of screen: if
`loadout-eva-instrument-panel` ever integrates unfixed, a player would see
STRAIN read green-safe-at-100 in LOADOUT.CFG and simultaneously read
red-danger-at-100 on the taskbar and in INBOX's footer, for the identical
number, on the identical screen, at the identical moment.

**Fix (tier 0, not a coachmark, and not this study's job):** invert the
condition at both call sites to trigger on LOW strain, e.g. `run.strain <=
35` (matching the threshold this study just established, so the two
surfaces agree once both are correct) instead of `run.strain > 70`, in
`kernel-panic-site/app/src/components/os/shop-os.tsx:588` and
`.../components/os/windows/inbox.tsx:586`. This is independent of whether
`loadout-eva-instrument-panel` integrates at all; it is wrong today, on the
currently shipped desktop, and should not wait on this cycle's UI decision.
Filed to `tutorial/ledger.md` Open Work, urgent, this round; no
`pipeline/proposals/tutorial-agent.json` item filed for it this round since
the standing scope for this cycle is gate-plus-ledger only (see round 1's own
note), but it is precise enough to build directly from this entry.

## 3. A third run state (DAY 8 STRAINED)

**COVERED.** Demo-only rig chrome, not player-facing copy, the same class of
artifact as the existing "DAY 4" / "DAY 1 EARLY" scenario labels round 1
already treated as non-gated. Confirmed it actually exercises the claim it
exists for: `strain: 21` (`index.html`, the `day8` state object) sits at 21,
comfortably inside the `<= 35` RISK band, so the red/inverse-video state is
genuinely reviewable rather than merely described. No mechanic-inventory or
accuracy obligation attaches to a reviewer-facing scenario switch.

## 4. Narrow-tier paging removed from the supported viewports

**COVERED,** and the removal makes the case stronger than round 1's, not
weaker. Confirmed directly in the live CSS: the WIDE-tier `@container`
breakpoint moved to `min-width: 700px` (`index.html:754`), and all three
surviving VIEWPORT options (16:9 at 860px, 21:9 at 940px, laptop at 760px)
sit above that line, so all three now render the identical WIDE arrangement
with no tab strip, matching the user's ask verbatim. The 4:3 option (480px)
is confirmed dropped from the rig's own `VIEWPORTS` list, with a code comment
recording why (`index.html:1578-1579`). Round 1's verdict already established
that none of the three mechanics behind the old hidden tab (`boostSlots`
ledger line 94, `patchCellUse`/`patchShapes` ledger lines 82-83, `strainChip`
ledger line 85) have their first contact at LOADOUT.CFG; with the tab gone
entirely at every supported width, that question is now moot rather than
merely answered, since there is no gated content left to have a first-contact
gap. The narrow path (`@container lo (max-width: 699.98px)`, `index.html:826`)
still exists in the CSS as the stated defensive fallback for extreme tiling,
so round 1's tier-0 fix for that path (the sentence-boundary description
clamp) still matters if it is ever reached; confirmed it already landed
(`DESC_BUDGET = 150`, clamped at `". "` boundaries, `index.html:1053-1064`,
matching the `NOTES.md` "Gate fixes built in" section), so nothing further is
owed there either.

## 5. The ATTACK.EXE 10px stagger is removed

**COVERED**, trivially. Round 1's own spec explicitly stated the stagger was
"purely a placement device," never a hierarchy signal, so its removal
subtracts no information a player relied on. Confirmed absent from the live
CSS: no `translateY` offset remains on `.lo-panel` or the trinity row (the
only `translateY` uses left in the file are the monitor scan-wipe, the feed
roll, and the CRT roll keyframes, all unrelated). Cosmetic in, cosmetic out.

## Summary for the build

No new mechanic, tip, or coachmark is needed anywhere in this round. One real
fix is owed, and it is not a change to `ui-demos/loadout-eva/`: invert the
`run.strain > 70` crimson condition to a low-strain check (e.g. `<= 35`) at
`shop-os.tsx:588` and `windows/inbox.tsx:586`, so the shipped desktop stops
flagging a full-health stat as danger from turn one, and so it no longer
contradicts the correct threshold direction this study just established for
the same number. `tutorial/ledger.md` updated this round: a round-2 addendum
on the existing 2026-07-31 loop-history entry, and a new urgent Open Work
bullet for the strain-chip inversion. No Coverage-table status changes (no
mechanic graduates this round; this is still a pre-integration study plus one
finding on already-shipped, unrelated screens) and no
`pipeline/proposals/tutorial-agent.json` or copy-order files, matching this
cycle's own round-1 scope note.

---

# Tutorial gate: ux-2026-07-31-loadout-eva (round 3)

Reviewed against the LIVE file, `ui-demos/loadout-eva/index.html`: the role
token block (lines 58 to 161, all five schemes), the window border (line
361), the REC light (lines 552 to 567, markup line 1047), the trinity
bracket CSS (lines 616 to 632) and its unconditional per-panel construction
(`buildPanel`, lines 1496 to 1501), the hazard stripe divider (line 724),
the strain readout (lines 824 to 858), the BENCH FEED crop (lines 496 to
521, 944 to 962) against its source art, and the CURVED CRT disable rules
and clock logic (lines 259 to 287, 1836 to 1852). Also read
`kernel-panic-site/app/src/styles.css` lines 846 to 851 and 1323 to 1330
(the shipped `kp-danger-blink` idiom) and `shop-os.tsx` lines 122, 546 to
550 (the live HUE picker). The color direction is settled (lore ledger
ruling 14) and is not re-litigated below.

**Five verdicts: 1 NEEDS-TEACHING (tier 0), 4 COVERED.**

## Question 1: does the RISK band still read as an alarm?

**NEEDS-TEACHING (tier 0).** Cites `tutorial/ledger.md` line 85
(`strainChip`) and the round 2 addendum's own premise (ledger lines 594 to
599: the RISK band "floods inverse video exactly like the shipped danger
idiom, so it survives a colorblind reader"), a premise round 3's ambient red
now pressures.

`--r-hazard` is confirmed to paint four permanent, unconditional things:
the window border (line 361), all three trinity brackets alike (`buildPanel`
applies `.lo-bracket` with no state check at all, lines 1496 to 1501), the
REC chip fill (line 560), and the hazard divider (line 724). RISK keeps
three real signals: a hotter, more saturated `--r-warn` against the duller
`--r-hazard` (confirmed distinct in every scheme, e.g. nerv `#ff2a17` vs
`#d1381a`), the inverse-video flood (confirmed structurally different from
the REC chip: strain-low sets void TEXT on a colored fill, the same
construction as `.lo-mode.mode-on`'s "active" idiom; REC sets light text on
a colored fill, a plain label, never the inverse idiom at all), and
position, the only place `--r-warn` renders in the file. That is a real,
three-part, colorblind-safe case, and it still loses to habituation: none of
the three signals involve motion, and a page with four to five static
red-family shapes on every healthy visit trains the eye to stop sampling
hue and fill for the one time it needs to matter. Static chrome cannot be
outrun by more static distinction; it can be outrun by motion, which the
ambient chrome structurally does not have.

**Fix:** give `.lo-strain-low`'s numeral and active bar segments a
`kp-danger-blink`-style motion channel (`styles.css:846-851`, "danger:
inverse-blink, not a hue," a 1.2s `steps(2)` alternation between full fill
and a hollow ink-outlined state), built on the `--r-warn` role token so it
still collapses under SINGLE INK. Leave the window border, brackets, REC,
and divider fully static, forever; that asymmetry is what makes motion mean
something. Add the new animation to the existing `prefers-reduced-motion`
block (lines 990 to 993), falling back to the current static full flood,
mirroring `kp-danger-blink`'s own suppression (`styles.css:1323-1330`).
Verify under CRT ON, curved, that the blink still reads through the bloom
and mask layers rather than smearing into them.

## Question 2: does permanent red bracket chrome teach a false alarm?

**COVERED.** Cites `tutorial/ledger.md` lines 90 to 91 (`kitConfig`,
`programTiers`). The bracket is unconditional on all three panels
(`buildPanel`, lines 1496 to 1501, no branch on tier, lock, or active mode),
so it carries no claim about a state that could vary and cannot misstate
one; it reads closer to a title bar's ink fill than a status readout. The
facts that actually vary per program, lock state and tier, are carried on
untouched channels: a locked mode chip is dashed `--ch-faint`, not hazard
colored, and a program's live tier sits in `--r-line` beside its meter,
exactly the fact `programTiers` is already waived on. Permanent hazard
striping on a housing that never changes with operating state also matches
the correct real-world register (a fuse box lid is taped whether or not it
is faulted): this is dangerous equipment, not this equipment is broken. The
real risk here, static red training players to stop reading red as urgent,
is Question 1's finding, not a false claim made by this uniform chrome
itself, and Question 1's fix (motion reserved to the one state that needs
it) is what keeps this chrome from ever being mistaken for a status report.

## Question 3: do four schemes create a teaching problem?

**COVERED, resting on a stated assumption.** Cites `tutorial/ledger.md`
lines 579 to 591 (round 2: hue is additive reinforcement, not the sole
signal). Assumption: SCHEME is a review-time switch, matching every other
row on this demo's rig (CRT, HUE, VIEWPORT, RUN STATE, none of which have
ever shipped as a player control) and this cycle's own BRIEF scoping the
main game code out of scope. One scheme ships; a player never sees the
others.

Checked the harder case too, since the game already ships a live HUE picker
(`shop-os.tsx:122,546-550`, LAVENDER/MAGENTA/PHOSPHOR, pressable mid-run,
never treated as a teaching problem because it swaps one neutral accent
uniformly while the fill-flip danger mechanism stays hue-independent). The
four EVA schemes hold the same invariant: `--r-ok` is green-family in all
four and `--r-warn` is red-family in all four, so "green means nominal, red
means risk" is scheme-invariant even though the exact shade shifts. Only
`--r-hazard` shifts hue-family (orange-rust vs vector's magenta), and
Question 2 already established that role carries no state, so a hue-family
shift on a role that says nothing teaches nothing either way. Verdict holds
under both readings, on the condition that any scheme added later keeps the
same green-ok/red-warn/fill-flip invariant; flagging that condition, not the
scheme count, as the load-bearing fact.

## Question 4: the BENCH FEED resize and reframe

**COVERED.** Cites `tutorial/ledger.md` lines 7 to 9 (decoration needs
neither a moment nor a waiver) and the `journalRunGate` precedent (lines 319
to 339) for when imagery DOES need a finding, only when paired with a
caption making a checkable claim. The crop (200x150, x 100 to 300 / y 58 to
208 of the native 304x227 image, stepping to 150x113 at the laptop
breakpoint) shows more of the same already-accepted dithered photo, still
1:1, still tinted `--r-aux` under the same "this is a camera, not managed
UI" convention round 2 cleared. No caption sits on this cell asserting
anything the crop could contradict, unlike `journalRunGate`'s actual
problem. A bigger, better-composed crop of already-accepted decorative art
needs no `MECHANIC_INVENTORY` row now for the same reason it needed none at
112x84.

## Question 5: does losing the REC blink and terminal cursor under CURVED cost signal?

**COVERED**, one non-blocking build note. Cites `tutorial/ledger.md` lines
690 to 692 (dadlog precedent: a blinking caret's reduced-motion removal
"fully covers the comprehension risk" when the underlying state is
otherwise clear). The feed's rolling band is pure ambient texture with no
state binding. REC's markup (line 1047) renders unconditionally regardless
of feed state, so its dot is reinforcement of a fact the static "REC" text
already states in full, not the sole carrier of it; REC is also, by
construction, not the inverse-video idiom (light text on a fill, not void
text), so it has no bearing on Question 1 either. The terminal cursor
(`kp-boot-cursor`) is a non-issue for a different reason: the class is
defined as a shared primitive but is not applied to any element anywhere in
this file's markup, so the disable rule at line 287 is currently inert;
nothing is lost because nothing currently renders. Non-blocking: this reads
like a defensively carried-over line from another demo's CURVED disable
list; flag for a future revision to either wire it to a real element or
drop the dead selector. The clock's dropped seconds cost nothing either, no
mechanic in `run-reducer.ts` ties to wall-clock granularity.

## Summary for the build

One fix owed, tier 0, scoped to `ui-demos/loadout-eva/index.html`: a
`kp-danger-blink`-style motion channel on `.lo-strain-low`'s numeral and bar
segments, reduced-motion-safe, with every hazard-colored structural element
left fully static. Everything else this round is COVERED as built. No
`pipeline/proposals/tutorial-agent.json` items or copy orders filed,
matching this cycle's round 1 and round 2 scope: findings recorded here and
in `tutorial/ledger.md`, precise enough to build directly from this entry.
