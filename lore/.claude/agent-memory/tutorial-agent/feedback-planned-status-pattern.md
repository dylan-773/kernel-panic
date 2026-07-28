---
name: feedback-planned-status-pattern
description: How to record ledger coverage for mechanics whose teaching is fully specced this cycle but whose supporting engine/UI code has not shipped yet (lands later in the same multi-agent cycle).
metadata:
  type: feedback
---

`tutorial/ledger.md`'s Coverage table originally only used `TAUGHT` and
`WAIVED`, both meaning `teach-sim` can verify the claim against real code.
That assumption breaks in a cycle where the Orchestrator's engine work
lands AFTER this seat's teaching plan is filed (e.g. `deep-balance-2026-07-28`:
shaped patch pieces, crafting, boost bays, all speced before any of that
code exists).

**Why:** the alternative was either (a) mark these rows `TAUGHT`/`WAIVED`
prematurely, which is a lie the harness cannot yet catch, or (b) leave them
out of the ledger entirely until the code ships, which loses the record of
what was decided and why. Neither serves the ledger's job as durable ground
truth.

**How to apply:** Introduced a third status, `PLANNED`, defined in the
Coverage section's legend paragraph: means the moment/tip/waiver is
specified and gated this cycle but `teach-sim` cannot confirm it yet. A
`PLANNED` row graduates to `TAUGHT`/`WAIVED` the cycle its surface actually
ships, and until then is a standing flag referenced from the loop history.
Pair this with the gate file (`pipeline/gates/tutorial-review.md`) stating
explicitly that the verdicts are a judgment on the PLAN, not an audit of a
live surface, and that a real audit is owed the cycle the code lands. Also
see [[feedback-provisional-waivers]] for the matching pattern on the waiver
side specifically.
