---
name: gate-scope-demo-passes
description: When a task explicitly scopes a cycle to "the review file is the deliverable," write only pipeline/gates/tutorial-review.md, not a proposal or copy orders
metadata:
  type: feedback
---

For demo/pre-clearance passes (a ux-agent spec being reviewed before the user
picks a winning variation, nothing integrating into kernel-panic-site/ yet),
the task instructions sometimes explicitly narrow this seat's normal 7-step
workflow down to one file: `pipeline/gates/tutorial-review.md`. Watch for
phrasing like "Do NOT edit ledger.md itself this pass... the review file is
the deliverable."

**Why:** the standard workflow (gate + tutorial-agent.json + copy orders +
ledger update) assumes the reviewed item is about to integrate. A demo pass
is a pre-clearance exercise: the user has not chosen a winning UI variation
yet, so filing real proposal items and copy orders would be premature and
would also clobber whatever proposal content is already sitting in
`pipeline/proposals/tutorial-agent.json` from a still-open, unrelated
prior-cycle plan (e.g. a "gate ahead of the engine" cycle whose rows are
still `PLANNED`, not yet graduated by a real `teach-sim` audit).

**How to apply:** when a task explicitly says the gate file is the sole
deliverable, still do the FULL tier reasoning and name exact mechanic ids,
moment specs, orders, triggers, and ui-spec asks inline in the gate doc's
prose (a "What a follow-up pass owes" checklist section works well), so a
later integration pass can lift it directly without re-deriving the
judgment call. Do not write `pipeline/proposals/tutorial-agent.json` or
`pipeline/copy/orders/*.json` in that pass. `pipeline/gates/tutorial-review.md`
itself is NOT append-only across cycles: it gets overwritten each cycle with
a new `# Tutorial gate: <brief-id>` header: the persistent record is the
ledger's loop history, not this file.
