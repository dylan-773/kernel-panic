---
name: teach-copy-voice-register
description: How to write teach-copy items fulfilling tutorial-agent copy orders - a different register from journal/scene/dayline story copy, matched to shipped content/teaching.ts
metadata:
  type: feedback
---

Copy orders (`pipeline/copy/orders/*.json`, kind "teaching-moment") want a
different voice than journal entries or scenes, and the shipped
`content/teaching.ts` TEACHING array is the reference, not the story-scene
voice from `content/story.ts`. Confirmed working (round 2 of
deep-balance-2026-07-28, all five orders passed the write-time lint hook on
first attempt, no bounce):

- Read the shipped `TEACHING` array in `content/teaching.ts` before drafting
  anything. Its lines are short declaratives, one line for the action/cost,
  one for the rule that changes what the player does next. Some are explicit
  second person ("You are carrying a cell..."), some are impersonal
  imperative ("Configure your kit against the named tell..."). Both read as
  in-voice; do not force "you" into every sentence if the shipped precedent
  for that exact moment id did not use it (e.g. augment-draft's line 2 never
  used "you" and the fix should not introduce a register shift the player
  would notice mid-run).
- When an order asks to preserve one line "verbatim or near-verbatim" (e.g.
  copy-augment-draft-line2 wanted line 1 untouched), pull the exact string
  from the shipped `TEACHING` array in `content/teaching.ts`, not a
  paraphrase. It is the ground truth for what shipped.
- When an order says "if the cap forces a cut, prioritize X then Y then Z",
  try to fit all of them first (160 chars is generous for 2-3 short clauses
  joined with periods/commas) before cutting the lowest-priority one. Only
  drop content if it genuinely does not fit; note in the proposal's `notes`
  if a cut was needed and why.
- Count characters by hand before writing (word-length sum + word-count-minus-1
  for spaces) rather than trusting a guess; several drafts in this round were
  visibly close to 160 and needed a real count to confirm margin.
- These items carry zero lore-gate risk when they are pure mechanic teaching
  (RAM, patch pieces, boost bays, draft cadence): none of it touches
  Rhea/Dad/Patch/the reveal schedule, so `lore/ledger.md`'s run-by-run table
  does not apply and there is nothing to flag to the Loremaster. Still worth
  a one-line confirmation in the proposal notes so the gate reviewer does not
  have to re-derive that.

See also [[copy-revision-workflow]] for the sibling pattern on revising
exact shipped story lines (different task shape, same crew).
