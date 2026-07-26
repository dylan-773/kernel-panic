---
name: balance-story-retune-1
description: story-retune-1 cycle mode-viability diagnosis and the retune/augment batch proposed to fix it, so future cycles don't re-diagnose from scratch or re-propose retired ideas.
metadata:
  type: project
---

Brief `story-retune-1` (2026-07-25): playtest verdict was only LOCK and HALT get
picked, REDIRECT/SIPHON/PURGE/WARD feel weak, against a freshly landed engine
(halt trap fix: cascade completes then turn forfeits, pure tempo not a wall;
PAR: rotation budget with strain chip on overage; PATCH CELLS: 1 RAM
once-per-turn slag-to-cross conversion, credits sink at day close). Proposed
in `pipeline/proposals/ability-agent.json`.

**Per-mode diagnosis (grounded in the reducers, not sim numbers, see below):**
- REDIRECT: a wash. 1 RAM to twist an enemy/open node, ~1 RAM for the victim
  to twist it back, claimed territory persists regardless (duel-types.ts
  docstring), so it has no lasting effect outside blocking one core-approach
  turn (which is literally the only case opponent.ts's own decideProgram
  uses it for). Its one real edge, redirectTargetLegal has no reach limit
  unlike plain rotation, is never stated in its own copy.
- ARM SIPHON: strictly dominated by ARM HALT at the same setup cost and
  legality. SIPHON_STEAL was a flat 2 RAM that never scaled with ATTACK
  tier (unlike ATTACK_WIDTH), while HALT's payoff is a full forfeited turn.
- WARD: too narrow. wardThroughRound is only ever checked in
  armTargetLegal, so it blocks trap-planting and nothing else, not even
  REDIRECT. The very halt-fix that shrank trap value also shrank the size
  of the threat WARD exists to block.
- PURGE: got strictly worse from the halt fix. purgeTargetLegal requires
  the player's target be `trap.revealed`, so SCAN+PURGE was already a 2 RAM
  combo; now that a sprung trap no longer denies the cascade (only the
  turn/RAM), PURGE only ever saves the smaller tempo hit, never the claims.
- LOCK: left alone this batch. Unconditional 2-round freeze, no fire
  condition, already blocks REDIRECT via the existing lockedBy check, and
  PAR's new rotation budget makes forcing opponent reroutes (opponent.ts
  buildQueue detours around locked nodes) strictly more valuable than
  before without LOCK itself changing. Do not nerf without sim confirmation
  that the buffs below didn't already close the gap.

**What was proposed (2 retunes of existing config augments, 4 new boosts,
1 copy-only item):**
- `cfgArmSiphon` retune: SIPHON_STEAL flat 2 -> tier record {1:2,2:3,3:4}.
- `cfgWard` retune: ward now also blocks REDIRECT in its radius/duration
  (symmetric check to the existing lock check in redirectTargetLegal).
- `jamAnchor` (new boost): REDIRECT also freezes its target 1 round, using
  the same lockedThroughRound/lockedBy fields bulwark already writes.
- `sweepCredit` (new boost): PURGE refunds its own RAM cost on a
  successful defuse, making SCAN->PURGE net near-free.
- `cleanRun` (new boost): a chip-0 win (par-clean, per finishDuel) banks
  +1 patch cell, tying PAR's own "clean win" definition to the credits
  sink so tight play pays out in inventory too.
- `slagWard` (new boost): placing a patch cell also wards it for 1 round,
  giving PATCH CELLS their first augment interaction.
- `redirectCopy`: copy-only clarification that REDIRECT ignores the reach
  limit, no mechanical change, filed so jamAnchor's payoff reads as
  legible rather than niche.

Pool size after batch: 18 total (4 config + 14 boost), still under the
~20-boost dilution line. Nothing retired.

**Open item for next cycle:** no validation report existed for this brief
(pipeline/validation/ had only .gitkeep). See [[missing-validation-report]].
Once Validation runs against this batch, check whether LOCK/HALT pick rate
actually dropped and whether SIPHON/WARD/PURGE/REDIRECT pick rates rose
before proposing a second pass; if HALT+LOCK still dominate after
sweepCredit and the cfgWard retune land, the next lever is a LOCK_ROUNDS or
HALT tripwire nerf, not another REDIRECT/SIPHON/WARD buff.
