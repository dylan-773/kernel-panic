---
name: project-kp-pipeline-cadence
description: How Kernel Panic dev-crew cycles are named, structured, and where each cycle's artifacts live; useful for orienting quickly at the start of a new turn.
metadata:
  type: project
---

Cycles are named in `pipeline/BRIEF.md` (e.g. `teaching-2026-07-26`,
`playtest-repair-2026-07-27`, `story-retune-1`, `deep-balance-2026-07-28`)
and that name is the `brief` field every proposal, gate, and validation
report stamps itself with. `pipeline/proposals/<agent>.json`,
`pipeline/copy/orders/*.json`, and `pipeline/gates/*.md` are each a SINGLE
file per agent/order id that gets overwritten cycle to cycle, not archived;
prior-cycle content lives in git history, not in a dated filename. When a
proposal file's content has already shipped, the agent says so plainly in
its `notes` field ("this replaces this agent's prior proposal file...
already integrated per the repo's git history") rather than leaving stale
content that reads as still-pending.

Every new coachmark gets a copy order filed at
`pipeline/copy/orders/<id>.json` regardless of whether the task's explicit
list of copy orders mentions it by name; this is a base-charter rule
("File a copy order... for every new coachmark"), not a suggestion, and
should be followed even when the launching task's deliverable list is
narrower. See [[feedback-tips-self-written]] for the matching rule on the
tip side (opposite direction: skip the copy order even if one is named).

Copy orders are fulfilled by the narrative-director in a FOLLOW-UP round,
not the same cycle they are filed in; narrative-director's own proposal
notes will confirm this explicitly ("no open orders from the tutorial-agent
... checked, none found ... will be fulfilled in the follow-up round once
filed"). Do not expect `lines`/`title` to be filled same-cycle.

`tutorial/ledger.md` and `pipeline/gates/tutorial-review.md` are the two
files this seat owns start to finish; `pipeline/proposals/tutorial-agent.json`
is the third. All three should tell a consistent story of the same cycle's
work, cross-referencing each other's item ids (ledger cites the moment id,
gate cites the ledger line, proposal item ids match what the gate verdicts
reference).
