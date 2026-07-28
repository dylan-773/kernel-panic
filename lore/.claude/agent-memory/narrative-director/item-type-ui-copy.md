---
name: item-type-ui-copy
description: Custom "ui-copy" item type used for bespoke UI/system-voice string rewrites that do not fit any named schema in kp-contracts
metadata:
  type: project
---

The kp-contracts skill's proposal envelope requires every item to have `id`
and `type`, but only defines named schemas for specific content kinds
(journal, scene, dayline, sfx, ui-spec, mechanic, mechanic-waiver, teach-tip,
teaching-moment, teach-copy, customer, augment, dayconfig-delta). None of
these fit a request like "rewrite this exact endReason string in
duel-actions.ts" or "here is new flavor copy for a window that doesn't exist
yet." For the deep-balance-2026-07-28 round-1 proposal (see
[[cycle-deep-balance-2026-07-28]]), this agent used a custom `"ui-copy"`
type for these items, each carrying:
- `surface`: where the player encounters it
- `target`: the exact file/call-site the Orchestrator should edit
- `copy`: the actual strings, structured however the surface needs
- `notes`: integration caveats

This has not yet been validated at a gate (Loremaster/Orchestrator have not
reviewed this specific proposal as of this writing). If a future gate
rejects or reshapes this pattern, replace this memory with the corrected
approach. If it is accepted without pushback, upgrade this from a project
note to a confirmed feedback memory next session.
