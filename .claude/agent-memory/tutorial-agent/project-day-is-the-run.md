---
name: project-day-is-the-run
description: The 2026-08-19 architecture rebuild that removed the run layer; the day is now the run. Context for any future teaching audit.
metadata:
  type: project
---

As of 2026-08-19 the run layer is gone from Kernel Panic. THE DAY IS THE RUN.
The game now ships two environments: a walkable 2.5D shop (Phaser scene layer,
`components/scene/`, driven by `overworld/scene.ts` and `overworld/bridge.ts`)
and KP/OS on the bench terminal (the React desktop, mounted only while seated).
Sitting at the bench enters KP/OS; standing up leaves it. The dive (DIVE.EXE)
still owns the whole screen when active.

Key new mechanics from this rebuild, all now in `MECHANIC_INVENTORY`:
face-to-face intake at the counter (accept/decline, one customer at a time),
diagnostic depth gating the intake readout (dead rows name the repair that
would light them, `diagDepth`/`nextRepairAt` in `content/repairs.ts`),
held-vs-banked pay (credits/salvage ride as `day.held` until closing banks
them; strain zero forfeits the held column and the evening), closing by the
stairs banks the day, sleeping upstairs advances the day and only PARTIALLY
restores strain (see [[feedback-verify-persistence-claims]]), physical repairs
bought at room objects in the evening (each repair pays a mechanic, a window,
AND an artifact, per `content/repairs.ts`'s own header comment), salvage as
the deck-building currency (separate from credits), deck slotting in
LOADOUT.CFG (owned boosts can exceed bays), and Sunday as the one-attempt-only
back room day (no customers; `phase !== "open"` on Sunday by construction).

The opening dive now happens AT THE TOWER on first boot (`tutorialIntroScene`/
`tutorialOutroScene` in `content/story.ts`), not at a generic "day 1" screen.

Story reveals are now REPAIR-KEYED, not run-keyed (ruling 16 in
`vault/60-story/rulings/`): DAD.LOG/DAD.VOL's journal entries unlock on
`shop.repairs`, not `meta.runCount`. This fully resolved the old
`journalRunGate` finding from the run era; it's folded into `repairsUnlock`
now, no longer its own row.

Whenever auditing this game going forward: the OLD run-era ledger content
(JobBoard, per-run strain reset, run-keyed journal gates) is compressed into
`tutorial/ledger.md`'s "Archived: run era" section. Do not cite anything from
there as current without re-reading the live surface first; almost none of it
still applies in that shape.
