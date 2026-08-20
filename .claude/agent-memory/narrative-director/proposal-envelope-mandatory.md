---
name: proposal-envelope-mandatory
description: pipeline/tools/lint-proposal.sh always requires agent/brief/items on pipeline/proposals/narrative-director.json, even when a task literally asks for a different flat JSON shape
metadata:
  type: feedback
---

When an orchestrating message asks for `pipeline/proposals/narrative-director.json` to be
"an object with exactly N items" naming specific top-level keys directly (e.g.
`diagBench2FirstRead`, `strainCarryoverTeach`), do not write that literal flat shape.
The `PostToolUse` lint hook (`pipeline/tools/lint-proposal.sh`) enforces the standard
kp-contracts envelope on every write to `pipeline/proposals/*.json` regardless of what
the requesting message's prose says: top-level `agent` (string), `brief` (string), and a
non-empty `items` array where every item has `id` and `type`. A flat custom object fails
with "missing top-level agent/brief/items array" and bounces back.

**Why:** confirmed by direct failure in this session (2026-08-19): wrote the literal
three-key object the task described, the hook rejected it, rewrote it as a proper
envelope with three `items` (custom `type: "firstRead"` for two, `type: "teach-copy"`
for the copy-order fulfillment) and it passed clean.

**How to apply:** always wrap deliverables in the envelope. If the item content doesn't
match an existing kp-contracts item type (see `.claude/skills/kp-contracts/`), invent a
descriptive `type` string and carry the real payload in extra fields plus a `notes` field
explaining the shape to the Orchestrator, who integrates by hand anyway. If the task's
`brief` doesn't match what's currently sitting in `pipeline/BRIEF.md` (e.g. the task is
answering a gate report or a copy order, not the live UI brief), use the actual driving
artifact's id as `brief` and explain the mismatch in `notes` rather than lying about which
brief you're answering.
