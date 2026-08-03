---
name: diegetic-cadence-claims-need-checking
description: A more specific diegetic teaching line than the vague copy it replaces can be specifically WRONG about game mechanics (per-dive vs per-run cadence); check the actual reducer/unlock logic before writing a cadence claim, don't just make the vaguer line more concrete.
metadata:
  type: feedback
---

Caught at the tutorial gate (NEEDS-TEACHING) on
`pipeline/copy/orders/copy-dadlog-files.json`'s damaged-file teaser, cycle
`ux-2026-07-29-dadlog`. See [[dadlog-archive-reframe-cycle]].

**The mistake**: replacing the old vague "keep diving... it can wait until
you cannot sleep again" teaser with a more diegetic, more SPECIFIC claim:
"EVERY DIVE ATTEMPT WRITES A NEW RECOVERY PASS TO THIS DRIVE, WIN OR LOSE."
This sounds better and reads as a real improvement (concrete, diegetic,
teaches the actual "more diving recovers more" intent from the brief). It is
also flatly false: `journal.ts`'s `visibleJournal` gates entries on
`meta.runCount >= unlockAtRun`, and `runCount` increments exactly once per
RUN (`run-reducer.ts`'s `startRun`), never per dive/ticket. A run holds up to
27 individual dive attempts (3 tickets times up to 9 days) with the count
completely unchanged. Because DAD.LOG is a standing desktop icon reachable
mid-run, a player can lose a dive, reopen DAD.LOG, and watch nothing move,
directly contradicting the line, inside their very first run.

**Why the vague original never got caught**: it never claimed a cadence
("keep diving" and "it can wait" are true under any cadence), so there was
nothing to falsify. The moment a line gets specific enough to be useful
teaching, it also becomes specific enough to be a testable claim against the
engine, and testable claims need to actually be tested against the reducer,
not just against how good they sound as prose.

**How to apply**: whenever a rewrite makes a vague, always-safe line more
concrete or diegetic (especially a "keep going and X happens" progression
claim tied to a game mechanic), grep the actual trigger before shipping the
sentence: what state variable does the unlock check, and what specific
player action increments it? If the entry point instrument I have (e.g. the
copy order's own field names) already carries the right vocabulary, prefer
it, don't invent a new cadence word: this cycle's own `failed1` filename
(`SESSION_001.LOG`) and `grading`'s provenance ("eight sessions logged")
already keyed "session"/"run" to run count, which should have been the tell
that "dive" was the wrong unit before the gate caught it.
