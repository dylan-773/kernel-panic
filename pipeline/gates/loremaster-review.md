# LOREMASTER GATE - cycle `ux-2026-07-31-loadout-eva`

Scope: this file is OVERWRITTEN per the request; the prior dadlog-cycle
content is superseded and safe in git history. Gated artifact:
`pipeline/proposals/ux-agent.json`, items `loadout-eva-instrument-panel`
and `instrumentLock`. Nothing integrates this cycle; the user reviews the
study first. Read in full: `pipeline/BRIEF.md` (this cycle), both items,
`lore/bible.md`, `lore/ledger.md`, `ui-demos/loadout/NOTES.md`, and,
directly, the shipped `loadout.tsx`, `solder.tsx`, `patch-cells.ts`,
`journal.ts` sources named below rather than trusting the proposal's own
"verbatim"/"already established" claims on their word.

## 1. Newly coined labels

- **OPERATOR RIG** (rotated gutter spine label): APPROVE. "Operator" is
  already the tower's own diagnostic word for the diver, not a coinage:
  journal.ts's IT IS GRADING ME entry (unlockAtRun 8) reads "OPERATOR
  HOURS LOGGED AGAINST THIS UNIT: NINE THOUSAND PLUS," "HOURS ATTRIBUTE TO
  OPERATOR ONLY," "OPPONENT DIFFICULTY TRACKS OPERATOR PERFORMANCE" -
  shipped content, which the bible names as canon's source of truth
  ("Source of truth: shipped content in
  kernel-panic-site/app/src/game/content/ ... journal.ts"). The shipped
  `loadout.tsx` header comment already calls this exact zone "the
  operator's rig." The spec's label is a direct restatement of
  established in-fiction vocabulary, not an invented word.
- **// SUPPORT SYSTEMS** (band divider label): NOTE, not REVISE (advisory,
  does not block - I cannot cite a bible/ledger line that reserves or
  forbids this phrase, and the gate rule requires a citation to REVISE on
  canon grounds). "Support systems" grouping a health meter (NEURAL
  STRAIN) with gear mods (BOOST BAYS, PATCH POUCH) sits close to a
  cockpit-life-support reading, which is the one register the brief's own
  boundary asks to avoid ("no ... iconography... every glyph must read as
  bench-terminal diagnostics"). It is not clearly a violation either:
  "support" is ordinary bench/IT vocabulary too (peripheral support,
  backup power). Optional tightening if the reviewer wants zero risk:
  "// AUX SYSTEMS" or "// BENCH SUPPORT" reads unambiguously as shop
  diagnostics with no loss of meaning. Not blocking.
- **PROGRAMS** (narrow-tier tab name): APPROVE. This is the bible's own
  term, verbatim: "Every diver carries the same three programs, 1 RAM
  each, always: SCAN, ATTACK (modes: redirect, armHalt, armSiphon), DEFEND
  (modes: purge, lock, ward)" (bible, Technology rules).
- **RIG & STATUS** (narrow-tier tab name): APPROVE. A plain compound of
  RIG (see OPERATOR RIG above) and STATUS (a bare description of the boost/
  pouch/strain state it holds). No bible/ledger conflict.
- **PLACE COST** (pouch chip label): APPROVE. Restates the shipped
  `PLACE_COST` constant and the already-shown cost strings in `duel.tsx`
  ("Place this piece (2 RAM)", "Placing a piece takes 2 RAM."). No new
  fact, just a shorter label for an existing one.
- **LOADING / READY verdict slab**: APPROVE. A one-word distillation of
  the two sentences already on the same screen verbatim ("DIVE KIT IS
  LOADING...", "DIVE KIT READY.", confirmed at `loadout.tsx:271-273`), so
  it introduces no new information. A bare caps state word fits "System
  voice: short caps declaratives" (bible, Voice).

## 2. Cut of diegetic imagery

- **FIG. 01 // BENCH RIG plate, cut entirely**: APPROVE. No bible/ledger
  line requires this specific image; its "why would the OS show this"
  justification lives only in `ui-demos/loadout/NOTES.md` (design history,
  not lore), and it carries no canon fact the plate alone bears - it is a
  stock service-manual drawing, decoration with an in-fiction excuse, not
  a fact-bearing artifact like DAD.VOL's attachments. The window loses
  nothing canon owes it.
- **BENCH FEED, kept but cropped to a LIVE MONITOR bezel**: APPROVE. Its
  canon anchor is unaffected by size: bible, Rhea - "Investigates anyway,
  by shopkeeper means: watches the feed" - and ledger's run-3 knowledge-
  table row, "watches the feed (it waited)." Both describe a live camera
  on the bench existing to be watched, not a display-size claim. A
  cropped, native-pixel (dither-safe, unscaled) window onto the same live
  feed is still "the shop camera, live" (NOTES.md's own framing); the crop
  changes presentation, not what the image diegetically is.

## 3. Prose cut (pouch paragraph)

APPROVE. Verified directly against the shipped source rather than the
proposal's own claim: `loadout.tsx:427-430`'s full paragraph reads "A
piece fills one slag block with exactly the arms it shows, welded where
it lands. 2 RAM, one per turn, single use. Pieces come off the darknet,
drop from cleared jobs, or bank on clean wins; the pouch holds
{PATCH_POUCH_MAX}. CRAFT AT THE BENCH: SOLDER.BAY." - and `solder.tsx`'s
`FOOT_LINE` (lines 30-33) carries the identical sentence, including
"Pieces come off the darknet, drop from cleared jobs, or bank on clean
wins" (the sourcing fact underlying ledger Resolved ruling 9's darknet
market), verbatim. The proposal's cut keeps only the pointer sentence
"CRAFT AT THE BENCH: SOLDER.BAY." No canon fact is lost from the game:
the darknet-sourcing fiction survives verbatim at the window this exact
chip points the player toward.

## 4. New hue: `data-hue="amber"`

APPROVE. Hue is OS cosmetic theming (a phosphor-color choice for the
terminal), not narrative content; no bible/ledger line reserves or
restricts KP/OS's accent color to lavender/magenta/phosphor specifically.
If anything, an amber phosphor scheme is MORE in period with "Presentation
frame: the player experiences everything through KP/OS, the shop
terminal's retro pixel desktop" (bible, The world) than a departure from
it - amber monitors are a real historical CRT phosphor alongside green and
white. Recorded here as a cleared UX/cosmetic call, not elevated to a
ledger ruling, because it decides no narrative fact. Flag for later, not
blocking now: if a future proposal ever ties STORY meaning to a specific
hue (gates amber behind the finale, or attaches it to Patch or Dad), that
would need its own explicit ruling; this proposal offers amber as a
general-purpose fourth scheme and does not do that.

## 5. Design direction (Evangelion-inspired maximalism)

APPROVE, stays inside the brief's own stated boundary. Swept every zone
and panel description in the spec: no NERV/Evangelion branding string, no
Japanese-language chrome, no religious or angel iconography appears
anywhere. Two elements are the closest calls, and both clear on
inspection:
- The active mode chip's corner-tick "targeting reticle": this reads as
  native to the shop's OWN fiction, not an import, since ATTACK is already
  a combat verb in the bible ("Every diver carries... ATTACK (modes:
  redirect, armHalt, armSiphon)") inside a duel already described as a
  fight ("Both signals race to the core," Technology rules). A lock-on
  indicator on a combat program's active mode is this game's own
  vocabulary, not borrowed mecha dressing.
- "Instrument bay" / "instrument panel" framing: generic bench/technical
  vocabulary (multimeters, oscilloscopes, test rigs), not exclusive to
  Evangelion or any single source.
The CRT layer (scanlines/mask/bloom/roll/vignette) and the hazard-stripe/
rotated-spine grammar are wordless visual furniture; they raise no canon
question beyond the labels already covered in section 1.

## Em/en dash and contradiction sweep

Checked every string the proposal calls "verbatim shipped copy" directly
against source: `loadout.tsx` confirms "DIVE KIT READY." / "DIVE KIT IS
LOADING..." / "FIG. 01 // BENCH RIG" / "BENCH FEED" / "SEVERS AT ZERO." /
">> TUNE IT WHENEVER. IT HOLDS UNTIL YOU CHANGE IT." all render exactly as
quoted (lines 271-273, 295, 307, 448, 451). Grepped `kit.ts` and
`loadout.tsx` for em/en dash characters directly: zero matches in either
file. No quoted line contradicts `lore/bible.md` or `lore/ledger.md`.

## ux-agent.json

- loadout-eva-instrument-panel: APPROVE (carries one advisory NOTE, non-
  blocking, on "// SUPPORT SYSTEMS" - see section 1)
- instrumentLock: APPROVE (settle-chime sfx, no fiction content; params
  carry no phaser plus downward-freqSlide, so it does not borrow the
  intrusion's exclusive sonic fingerprint)

No canon gap was exposed this cycle; no new bible/ledger ruling was
needed. The hue question (section 4) is recorded above as a cleared
cosmetic call, not a ruling, since it settles no narrative fact.

Tally: 2 items seen, 2 approved, 0 revised.

---

## ROUND 2 — 2026-07-31, cycle `ux-2026-07-31-loadout-eva`

Scope: the user reviewed `ui-demos/loadout-eva/` and sent it back with
layout notes (ux-agent's lane, not gated here) plus a directive to break
from the KP/OS v2 single-ink-accent law for this surface, using an
Evangelion-style state-coded palette. This addendum records that
directive as canon, states its integration obligations, and gates the
resulting fiction. Nothing new integrates from this addendum; round 1's
per-item verdicts above stand unchanged.

### 1. The ruling

User's own words, said twice and not up for re-litigation here: "I'm
wanting to see if we can break away from the single color design. I even
said use Evangelion colors." Palette named in the request: amber
`#ffab3d` (structural chrome, neutral readouts), green `#7bff5a`
(nominal: READY verdict, active mode), red `#ff3b30` (risk: NEURAL
STRAIN when low), cyan `#35d6ff` (BENCH FEED camera tint only), ivory
`#fff2d9` (hot highlight, hero numerals).

Written into `lore/ledger.md` as Resolved ruling 14 (full text there).
Scope, as the ledger states it: the NARROW reading governs by default -
LOADOUT.CFG's own surface only (this study and, at integration, the
shipped window it replaces). It does not reopen any other KP/OS window
to multi-hue on its own, and it is a different design from the earlier-
rejected per-window channel-livery scheme (magenta darknet / phosphor
ledger / indigo dadlog, killed by the `ux-2026-07-28-kpos-redesign`
round-2 ruling in `RULINGS.md`'s "Pipeline notes" section - that was one
flat hue per whole window, not one window internally coding several
hues by meaning). The WIDE question - should color-as-diagnostic-state
replace the single-ink law everywhere - is left OPEN for the user to
settle; this gate does not pre-empt it.

Verdict: RECORDED.

### 2. What this obligates at integration time

Two documents currently assert the single-ink law as unqualified fact.
If this direction is approved for integration, both go stale unless
they carry a carve-out (or, if the user later takes the wide reading, a
full rewrite). Naming the exact lines for the Orchestrator's integration
pass:

- `CLAUDE.md`, DESIGN STANDARD paragraph: "One ink accent per
  `data-hue` (lavender default), inverse-video danger, solid-ink title
  bars with a pixel X only, boxed `// LABEL _` data rows, no internal
  scrollbars ever, 1-bit ink-tinted diegetic imagery." Goes stale the
  moment LOADOUT.CFG ships red-as-hue for risk instead of inverse
  video, and green/cyan/ivory alongside amber instead of one accent.
  Needs at minimum a trailing clause scoping the single-ink clause to
  "except LOADOUT.CFG's state-coded palette (ledger ruling 14)."
- `ui-demos/RULINGS.md`, the two lines stating the law itself: "ONE
  unified scheme across the whole OS: near-black void plus a single ink
  accent that does everything (text, borders, fills, meters, imagery),
  a support tone, one hot highlight. No greys anywhere; danger is
  inverse video (ink block, void text), never a second hue." and "Hue
  set switchable in the demo rig: LAVENDER (default...), MAGENTA/violet
  (ref-1), PHOSPHOR green (ref-2). One `data-hue` attribute swaps the
  entire OS." Both need an explicit LOADOUT.CFG exception noted
  alongside them - `RULINGS.md`'s own line "Per-demo design history
  lives in each demo folder's `NOTES.md`" already names the right home
  for the exception's detail (`ui-demos/loadout-eva/NOTES.md`), with
  `RULINGS.md` itself carrying a one-line pointer to it.
- I do not edit either file; both belong to the Orchestrator
  (`RULINGS.md` and `CLAUDE.md`) per the standing "only the Orchestrator
  touches..." rule and this session's own instruction not to touch them.

Verdict: RECORDED.

### 3. Fiction gate on the palette

**a. Does color-as-state-code fit KP/OS?** APPROVE. The bible's own
frame is "the player experiences everything through KP/OS, the shop
terminal's retro pixel desktop" (bible, The world, Presentation frame) -
a repair-bench terminal, and green-nominal/red-fault/amber-neutral is
ordinary diagnostic-equipment convention (POST checkers, multimeters,
rack gear), not an import from any one fiction. It reads as bench-native
in exactly the place the single-phosphor scheme was thinnest: a real
bench instrument that reports both routine chrome and "this reading is
bad" typically does use a second hue for the fault state, which is
exactly what this palette does for NEURAL STRAIN.

**b. Cyan BENCH FEED tint, collision check.** APPROVE, no collision.
Grepped `lore/bible.md`, `lore/ledger.md`, and `ui-demos/RULINGS.md` for
an existing color claim on any established entity: none exists.
DARKNET.LNK, the one surface `RULINGS.md` singles out as "the odd one
out," is explicit that it earns that status "via its stepped-notch title
bar, chevron mark, and heavier dither, not via color" (`RULINGS.md`,
Pipeline notes) - so no other surface's identity is color-coded in any
way cyan could collide with. The intrusion's own established signature
is sonic, not chromatic (phaser plus downward freqSlide, ux-agent's own
sound-palette rule, see agent memory `visual_identity_echo_check`). A
cool cyan tint scoped ONLY to the one bezel that is diegetically a
different device (a live camera feed, not the terminal's own rendered
chrome; bible, Rhea - "watches the feed") is good fiction on its own
terms: it makes the feed read as a genuinely separate signal path from
the instrument panel around it, the same logic that justified BENCH
FEED's existence at round 1.

**c. Imported-fiction sweep, per color.** APPROVE, none of the five
reads as imported branding rather than bench hardware. Amber-as-chrome
and ivory-as-hot-highlight are unchanged from the already-approved
round-1 amber block (`--ch: #ffab3d`, `--ch-hot: #fff2d9`), already
cleared. Green-for-nominal and red-for-risk are the universal two-color
safe/fault convention (traffic lights, breaker panels, server rack
LEDs), not exclusive to any one show. None of the five names, labels, or
reserves a NERV/Eva-specific term (no "MAGI," no plugsuit color code, no
named sync-ratio readout) - the brief's own boundary ("NO NERV/
Evangelion branding, no Japanese-language chrome, no religious or angel
iconography," `pipeline/BRIEF.md`) is about branding and iconography,
and a bare hex value used for an ordinary diagnostic purpose does not
brand anything. Nothing here needs a ruling to forbid; flagged forward
only as a watch item, not a REVISE: if a future round adds a label that
names the association out loud (e.g. a control captioned "EVA COLORS" or
a stat called "SYNC RATE"), that crosses from structural-grammar
borrowing into branding and would need its own look.

### Layout complaints (not gated here)

The deck feed underlapping SCAN.EXE and ATTACK.EXE's vertical
misalignment are UX/build defects, not canon questions; no bible/ledger
line is at stake either way. Noted here only so the record shows they
were read, not overlooked: they are ux-agent's fix to make in the next
round, not mine.

### Tally

Round 2: 1 ruling recorded, 1 integration-obligations note recorded, 3
fiction items seen, 3 approved, 0 revised. Cumulative for cycle
`ux-2026-07-31-loadout-eva`: round 1, 2 items seen / 2 approved / 0
revised; round 2 as above.
