---
name: brief-story-retune-1-scope
description: What story-retune-1 covers, why, and the new DuelState/RunState fields the ux-agent proposal assumes the Orchestrator will add.
metadata:
  type: project
---

Brief `story-retune-1` (`pipeline/BRIEF.md`, filed as of 2026-07-25) is a combined narrative + gameplay retune. Narrative-director owns explicit openers/enders for runs 1-12, new day-open cutscenes for days 1-10, and tutorial-intro/outro framing. The gameplay side (ux-agent's concern): a halt-trap tempo fix (cascade completes before the turn ends), a PAR system (rotation budget vs strain cost on win), a +10 strain auto-regen at day close, and PATCH CELLS (a 35cr consumable, hold max 3, converts a slag block into an open cross junction, 1 RAM, once per turn). Ability-agent and arc-composer are retuning numbers/curve in the same cycle because playtesting found only LOCK and HALT viable.

Zero art budget this cycle -- the ux-agent proposal (`pipeline/proposals/ux-agent.json`) filed no art orders and no music-brief item (brief explicitly said no new track).

**Why this matters for future sessions:** the ui-specs in that proposal assume new state surface that did not exist in the game repo as of this writing: `DuelState.par`, `DuelState.rotationsUsed` (incremented only on player rotate, not on casts or patch placements), a patch-cell held-count + per-turn `usedPatchCell` flag, and `RunState.lastRegen` (0-10, the actual day-close regen amount, for the animate-from value). If a later session finds these fields already named differently in the shipped code, treat the shipped names as authoritative and update the spec references, not the other way around.

**How to apply:** when a later brief touches PAR, patch cells, or day-open cutscenes, check `pipeline/proposals/ux-agent.json` history and the game repo's current field names before re-speccing from scratch.
