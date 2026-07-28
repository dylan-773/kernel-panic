---
name: cycle-deep-balance-2026-07-28
description: State of the deep-balance-2026-07-28 pipeline cycle (shaped patch pieces, boost bays, DARKNET.LNK) and this agent's two-round split within it
metadata:
  type: project
---

The deep-balance-2026-07-28 brief (`pipeline/BRIEF.md`) lands three new engine
systems in one cycle: a kitted sim profile, shaped patch pieces (straight,
elbow, tee, cross, union-crafted, pouch cap 5, sourced from a new DARKNET.LNK
gray-market window / job drops / a reworked CLEAN RUN), and boost bays (3
slots, purchasable to 5 at 150cr/300cr, configs exempt from the cap, full
bays draft as pick-to-swap). None of this existed in the game repo yet when
this agent's turn ran (verified: no "DARKNET", "darknet", "bay" hits under
`kernel-panic-site/app/src`); the whole system is being designed across
agents in parallel this cycle.

Narrative-director's work is explicitly split into two rounds by the task
brief:
- Round 1 (done, see `pipeline/proposals/narrative-director.json`): all
  NON-coachmark copy. DARKNET.LNK window flavor (title, vendor tag, pitch,
  buy button, reveal beat, pouch-full and offline states, icon hover),
  gridlock endReason rewrite (now costs strain instead of reading as a
  favor), result-screen row copy (drop-reveal label + 4 shape variants +
  capped variant, CLEAN RUN row rewrite, new gridlock strain-chip row
  label), the CLEAN RUN augment desc rewrite, two new MANUAL.TXT sections
  (PATCH PIECES, BOOST BAYS), and two noun swaps ("patch cell" -> "patch
  piece") in existing duel strings (severed endReason, the placement toast).
- Round 2 (done): coachmark copy. tutorial-agent filed five orders at
  `pipeline/copy/orders/`: copy-patch-cell-use, copy-night-shop,
  copy-patch-craft, copy-augment-draft-line2, copy-boost-swap. All five
  filled in place (status "done") and mirrored as `teach-copy` items
  appended to the same `pipeline/proposals/narrative-director.json` (one
  file for the Orchestrator, per the standard flow), with a notes addendum
  explaining the voice choice per item. No ledger conflicts: none of the
  five touch Rhea/Dad/Patch, pure mechanic teaching, so the reveal-schedule
  table did not apply and nothing needed flagging to the Loremaster.

Why this split matters: do not treat the round-1 proposal as covering
teaching copy; it explicitly did not. Both rounds now live in the same
proposal file, round 1 as `ui-copy` items, round 2 appended as `teach-copy`
items after them, in that order in the file.

See also [[item-type-ui-copy]] for the schema workaround used in round 1,
and [[teach-copy-voice-register]] for how round 2 approached wording.
