---
name: reference-status-field-convention
description: how to mark a filed item (ui-spec, sfx, etc.) as integrated in an agent's own proposals JSON
metadata:
  type: reference
aliases: [reference-status-field-convention]

---

The kp-contracts schema block does not show a `status` field on `ui-spec`
items, but the live convention (confirmed in
`pipeline/proposals/ux-agent-v2-sound-integrated.json`) is to add
`"status": "integrated"` right after `"id"`/`"type"` once the Orchestrator
lands the item. Also seen: `"status": "acknowledged"` for a flagged-but-not-
actioned item (e.g. `strainCrack`).

When the Orchestrator reports something from `tutorial-agent.json` has
landed (see
[post-integration-verification-pattern](feedback_post_integration_verification_pattern.md)),
add `"status": "integrated"` to that item rather than leaving the proposal
file silent about its own history. Grep other agents' proposal files for
`"status"` if unsure of the exact convention in a future cycle, since this
isn't spelled out in the kp-contracts skill text itself.
