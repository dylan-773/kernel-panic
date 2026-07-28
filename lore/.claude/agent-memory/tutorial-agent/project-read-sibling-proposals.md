---
name: project-read-sibling-proposals
description: Before finalizing mechanic specs or copy-order intents, read every file under pipeline/proposals/ whose brief matches the current cycle; other agents (especially narrative-director) often run first and already hold exact numbers, terminology, and copy this seat should cite rather than re-derive.
metadata:
  type: project
---

Agents in the Kernel Panic crew do not run in a fixed order within a cycle.
In `deep-balance-2026-07-28`, `narrative-director` had already filed its
proposal (brief matching the current cycle) by the time this seat ran, while
`ability-agent`, `arc-composer`, and `ux-agent`'s files on disk were still
carrying the PRIOR cycle's content (check the `brief` field of each
`pipeline/proposals/*.json` to tell current from stale).

**Why:** narrative-director's proposal already contained the exact
vocabulary shift (patch "cell" to patch "piece"), the exact pouch/bay cap
numbers (pouch 5, bays 3 buyable to 5 at 150/300cr), the exact drop-row copy
naming each shape, the gridlock end-reason rewrite, and two new MANUAL.TXT
sections, all of which this seat's mechanic specs and copy-order intents
needed to be consistent with rather than independently invent or guess at.
Citing that proposal's item ids directly (e.g. `result-screen-rows`,
`gridlock-endreason`, `manual-sections`) in this seat's own items is also
what the base charter asks for: "reference each other's item ids so the
Orchestrator integrates them together."

**How to apply:** At the start of any cycle, read `pipeline/BRIEF.md` first,
then glob `pipeline/proposals/*.json` and check each file's `brief` field
against the current cycle id before treating its contents as ground truth
for this cycle. A stale file (prior cycle's brief) means that agent has not
run yet this cycle; do not treat its contents as current, but do not ignore
it either, since a mechanic it already shipped is genuinely done. A
current-cycle file from a sibling agent is often the single best source for
numbers this seat would otherwise have to hedge around (see also the base
charter's rule to verify progression numbers against the reducer, not the
last draft; a same-cycle sibling proposal is a legitimate source when the
reducer itself does not exist yet).
