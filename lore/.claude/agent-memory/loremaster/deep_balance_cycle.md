---
name: deep-balance-cycle
description: deep-balance-2026-07-28 production cycle scope, for gating later batches from the same brief
metadata:
  type: project
---

The `deep-balance-2026-07-28` brief (`pipeline/BRIEF.md`) is a multi-batch
production cycle, not a single gate pass. It lands three engine systems the
Orchestrator builds directly (kitted sim profile, shaped patch pieces with
craft-by-union rules, boost bays capped at 3/purchasable to 5) plus content
from six agents: ability-agent (catalog surgery: surge, bulwark, carryCache,
slagWard cut; ~4 replacement boosts; buff/nerf passes), arc-composer
(DayConfig deltas against kitted targets D1-3 86/84/82, D4-6 70/72/70, D7-9
64/58/55, finale 48), ux-agent (ui-specs and sfx for the new patch/boost
UI), tutorial-agent (mechanic inventory deltas for patchShapes, patchCraft,
darkWebBuy, boostSlots, boostSwap, slotBuy), and narrative-director (copy
for the darknet window, endReasons, result rows, manual sections; teaching
coachmark copy deliberately deferred to a follow-up round pending copy
orders from tutorial-agent).

The first narrative-director batch (darknet-window, gridlock-endreason,
result-screen-rows, clean-run-desc, manual-sections, severed-endreason,
duel-toast-patch-piece) gated clean; see [[canon-gap-gate-pattern]] for how
the DARKNET fiction gap was resolved (now ledger Resolved ruling 9).

**Why this matters for later batches:** the ability-agent's replacement
boosts, arc-composer's deltas, and the narrative-director's deferred
coachmark-copy round from this same brief will all cite this cycle's
numbers (pouch cap of 5, bay costs 150/300cr, darkPatchCost(day) =
25 + 5*(day-1), nightPatchCost(day) = 45 + 5*day). None of those are canon
facts I own, they're balance/economy levers from the brief and the
Orchestrator's plan - do not gate on them as if they were lore; only gate
their flavor text and any new world claims they carry.

**How to apply:** when a later gate request in this same cycle arrives,
check `pipeline/gates/` for prior batches from this brief before re-reading
the whole BRIEF.md context from scratch, and check ledger Resolved
ruling 9 before re-litigating the DARKNET's anonymity or salvage sourcing.
