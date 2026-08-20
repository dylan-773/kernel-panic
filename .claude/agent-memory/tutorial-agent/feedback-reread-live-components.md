---
name: feedback-reread-live-components
description: Always re-read the actual live component a waiver or coachmark cites before trusting the ledger's own account of it; teach-sim cannot verify English.
metadata:
  type: feedback
---

Rule: never accept a waiver or a coachmark's claim as still true because the
ledger says so, or because `teach-sim` is green. Always re-open the exact
file and line the citation names and confirm the text is still there, still
says what it claims, and still fires on the case it claims to cover.

**Why:** `teach-sim` only checks that a waiver string exists in code and is
long enough. It cannot read English and confirm the sentence it quotes still
renders anywhere on the actual screen. This has broken silently at least
three times now, always on a green harness: `jobBoard` (2026-07-29, a header
sentence vanished when JobBoard was absorbed into INBOX), `backroomOppOpens`
(2026-08-19, a citation drifted when the opponent was renamed INTRUSION,
substance intact but the exact quoted line was stale), and `diveLoss`
(2026-08-19, the worst case yet: the waiver's claim is actively FALSE on the
shipped surface, DIVE.EXE's result overlay says "THE RUN IS OVER" on every
ordinary ticket loss, leftover copy from the old per-run architecture that
never got updated for the day-is-the-run redesign). The `diveLoss` case in
particular shows this can hide inside an already-covered mechanic for a full
cycle: the row was WAIVED and looked fine on paper the whole time.

**How to apply:** every full-sweep audit, budget time to open the actual
component file for every waiver's citation, not just the mechanic entries
that look new. A denser, more polished redesign is the highest-risk case,
not the lowest: it upgrades everything else on a screen and is exactly the
kind of change that quietly drops one old sentence nobody thought to
re-check because the rest of the screen is visibly better. See
[[project-day-is-the-run]] for the cycle this was found in.
