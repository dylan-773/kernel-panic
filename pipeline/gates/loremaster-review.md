# Loremaster gate review

Brief: `teaching-2026-07-26` (pipeline/BRIEF.md)
Gated against: `lore/bible.md` and `lore/ledger.md`, both current, no changes
needed this pass. Subject: the eight teaching coachmarks in the `TEACHING`
array of `kernel-panic-site/app/src/game/content/teaching.ts`, as integrated
(shipped copy, not the copy orders, is the read-from source per this pass's
instructions). Cross-checked each against its source copy order under
`pipeline/copy/orders/*.json` for intent, and against the reducers
(`run-reducer.ts`, `duel-actions.ts`, `kit.ts`) and screens
(`components/game/screens.tsx`, `components/game/duel.tsx`) for terminology
grounding. `copy-day-board` and `copy-kit-config` were cancelled this cycle
(each restated a permanent on-screen header verbatim); nothing to gate there,
confirmed no items exist for them.

No canon gap surfaced this pass. All eight items are pure mechanic-teaching
copy with zero story content (no Rhea, Dad, Patch, virus, sector, or reveal
material of any kind), so the run-by-run knowledge table in `lore/ledger.md`
is not implicated by any of them. No ruling was needed and none was made.

## narrative-director.json (8 items, copy-order fulfillments in `content/teaching.ts`)

- analyze-readout: APPROVE. "It never bluffs" is the terminal-voice
  restatement of bible: "Opponents inside devices are scripted intrusions
  with one dominant mode each. The Analyze diagnostic's tell is always
  honest." It lands as bench voice, not narrator voice; consistent with the
  already-shipped tutorial beats' habit of personifying the machine's
  behavior ("It is holding back," "It has stopped holding back."). "Dominant
  routine" is not terminology drift: the diagnostic's own shipped tell copy
  already calls these things routines (`kit.ts` MODE_TELL: "Diagnostic flags
  self-cleaning routines," "Diagnostic flags clamp routines"), and "threat
  tier" matches the on-screen label verbatim (`screens.tsx`: "THREAT TIER").
- par-budget: APPROVE. No canon claim beyond the mechanic itself; "Neural
  Strain" capitalized consistent with the bible's own proper-noun usage
  elsewhere in this file (title "NEURAL STRAIN," bible's own system-voice
  quote "NEURAL STRAIN: ZERO. CONNECTION SEVERED."). Voice is clipped and
  terminal, no drift.
- cascade-bank: APPROVE. "Nodes" is not drift against the bible's "junction":
  it is the established player-facing synonym already shipped elsewhere
  ("ARMED NODES" HUD label in `duel.tsx`; "Intrusion already {n} nodes deep"
  and "One more node per cast" in `screens.tsx`), so junction and node
  coexist by design, not by accident. "That is what just happened" is the
  second flagged character-forward line; it reads in the same clipped,
  present-tense bench register as the already-shipped tutorial beats ("It
  has stopped holding back.") and does not slip into manual-writer register.
  It lands.
- strain-chip: APPROVE. Verified the corrected claim directly against
  `run-reducer.ts`: `DAY_REST_REGEN` (line 50) restores strain only at
  `closeDay` (line 296), never between tickets within a day. The shipped
  line, "will not recover between them," is scoped exactly to that gap and
  does not claim strain never recovers at all, so it does not contradict the
  day-rest mechanic and does not regress to the prior draft's overclaim.
  "Zero ends the run" stays consistent with bible: "Strain zero severs the
  connection: a blackout, not a death" by not asserting death itself.
  Terminology and capitalization match the rest of the file.
- augment-draft: APPROVE. "BOOST bends the economy" is close to a direct
  quote of bible design law: "Augments bend the economy; they never add
  verbs." "CONFIG unlocks a mode" matches the schema (config augments carry
  `attackMode`/`defendMode`) and the shipped draft card tag, confirmed
  verbatim in `screens.tsx` ("CONFIG" / "BOOST" `kp-draft-kind` tag). Cadence
  ("three tickets a day, so a clean day banks three picks") matches ledger's
  shop rhythm: "Nine working days of three tickets each."
- day-upgrade: APPROVE on canon grounds; no bible or ledger line
  contradicted. NOTE (advisory, does not block): the first line, "One
  upgrade tonight. Whatever you take holds for the rest of the run.," is very
  close to the permanent on-screen header at `screens.tsx:471`, "One upgrade
  holds for the rest of the run. Pick." That header already carries the
  framing the copy order asked this moment to add; the coachmark's real new
  content is confined to its second line ("There is no second pick later.
  Choose the one that fixes what tonight's dive actually needed."). Whether
  that's enough to justify keeping this as a coachmark rather than retiring
  it the way `copy-day-board` and `copy-kit-config` were retired this same
  cycle is a tutorial-agent tier call, not a canon one; flagging for their
  judgment, not revising.
- night-shop: APPROVE. Lowercase "a night patch" / "a patch cell" as common
  nouns in body copy (versus the shipped ALL-CAPS button labels NIGHT PATCH /
  PATCH CELL) sits inside the bible's own allowance: "Night Patch: the
  60-credit strain restore (lowercase 'patch' coincidence is allowed to sit
  there unremarked before the finale)." No reveal-schedule exposure; this
  moment carries no story content of any kind.
- patch-cell-use: APPROVE. "Slag block," "cell," and "junction" all match
  established engine and player-facing usage, confirmed against
  `duel-actions.ts`'s own shipped system line: "PATCH CELL. The slag melts
  into a live cross junction." No lore conflict, no dashes, terminal voice
  throughout.

## Tally

Items seen: 8. Approved: 8. Revised: 0. One advisory NOTE issued
(day-upgrade), not a block.
