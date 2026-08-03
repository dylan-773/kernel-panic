---
name: pre-integration-study-ledger-scope
description: A study review with no explicit "gate file only" instruction still gets a ledger loop-history entry and Open Work bullets, just no proposal/copy-order JSON
metadata:
  type: feedback
---

Distinct from [[gate_scope_demo_passes]] (which covers the rarer case where
the task text explicitly says the gate file is the SOLE deliverable). Most
pre-integration study reviews (a ux-agent `ui-spec` demo under `ui-demos/`,
not yet `approved`, nothing integrating into `kernel-panic-site/` this cycle)
carry no such explicit restriction, but the right scope is still narrower
than a normal integration-bound gate: write the full gate verdict in
`pipeline/gates/tutorial-review.md`, AND update `tutorial/ledger.md` with a
loop-history entry plus any Open Work bullets the findings warrant, but do
NOT file `pipeline/proposals/tutorial-agent.json` items or
`pipeline/copy/orders/*.json` files, since nothing is headed for integration
yet and those artifacts would misrepresent readiness.

**Why:** confirmed as the actual, repeated pattern across every pre-
integration study cycle in this ledger's own history: `ux-2026-07-29-dadlog`
(rounds 1-3), `ux-2026-07-29-darknet-cli`, and `ux-2026-07-31-loadout-eva`
(rounds 1-2) all follow this exact split. Filing real proposal items or copy
orders for a study the user has not yet approved would imply the Orchestrator
should integrate it now, which is premature, and would risk clobbering
whatever unrelated proposal content already sits in
`pipeline/proposals/tutorial-agent.json` from a different, still-open cycle.
But leaving the ledger untouched would let a cycle's findings (a mechanic-
inventory candidate, a discovered bug, a standing lesson) evaporate the
moment the conversation ends, since the ledger is this seat's only durable
artifact across cycles.

**How to apply:** for any `ui-demos/` study review (status `awaiting` or
freshly `approved` but not yet integrated), always: (1) write or append the
full gate verdict with exact tier reasoning, mechanic ids, and fixes named
precisely enough to build from later; (2) add a loop-history entry to
`tutorial/ledger.md` summarizing the review; (3) add any Open Work bullets a
real, actionable finding warrants (especially anything discovered on
ALREADY-SHIPPED surfaces incidentally, which needs tracking regardless of
the study's own fate); (4) skip `pipeline/proposals/tutorial-agent.json` and
copy orders entirely. Only write those once the study's `status` flips to
`approved` and an actual integration pass is underway.
