---
name: resource-counter-visual-language
description: New resource/holding counters reuse the existing pip + kp-banked-pop primitives, recolored per resource, instead of inventing new widgets.
metadata:
  type: project
---

kernel-panic-site/app/src/styles.css already has two reusable primitives for "you have N of a thing": the pip row (`.kp-pip`/`.kp-pip-on`, used for RAM) and the `kp-banked-pop` 300ms steps(3) scale-in (used for the "+N NEXT" banked-RAM tag, `.kp-dock-banked`). Palette-per-resource is already established: RAM/signal (cream), strain/rose, program tier/gold.

When story-retune-1 added patch cells (a held-count consumable, 0-3, bought at day close) the spec (`patchcell-dayclose-row`, `patchcell-duel-affordance` in `pipeline/proposals/ux-agent.json`) reused both primitives verbatim: a 3-slot pip row (new modifier `.kp-cell-pip-on`, colored gold like banked RAM rather than RAM's signal color, so the two resources never look interchangeable) and `kp-banked-pop` for the "just bought a cell" / "just regenerated strain" moments.

**Why:** keeps new UI feeling like it shipped with the rest instead of a bolted-on widget; per the craft rules, new motion should look like it shipped with the idiom.

**How to apply:** before inventing a new counter widget or pop-in animation, check whether the pip row or `kp-banked-pop` already covers the interaction; only diverge (e.g. the gold legal-ring for patch-cell targeting, see [[targeting_ring_gold_convention]]) when the interaction is genuinely different, like a targeting affordance rather than a holding count.
