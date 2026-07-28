---
name: balance-deep-balance-2026-07-28
description: deep-balance-2026-07-28 cycle catalog surgery (4 cuts, 4 new boosts, buffs/holds/candidates for the rest), tied to Checkpoint A's kitted BEFORE curve. Read before any future catalog batch so cut rationale and un-selected directions are not re-litigated.
metadata:
  type: project
---

Brief `deep-balance-2026-07-28` (2026-07-28): first cycle to measure a KITTED
duel profile (`dev/kitted-profile.ts`, landed by the Orchestrator this same
cycle) instead of the kit-less proxy `sim.ts` always ran before. Checkpoint A
(BEFORE) numbers: kitted D2-D9 measured 93.5-98.5 percent against 70-84
percent provisional targets; finale 85.0 percent measured against a 48
percent target, with 120 of 170 finale wins (70.6 percent) closing on round
1. The kitted profile already schedules hotBoot and longArms in
BOOST_SCHEDULE and jamAnchor/siphonPlus/tripwire in MODE_PAIRS, so any buff
to those five is measured automatically at the next checkpoint; echoTap is
NOT in either schedule, so its user-rated S tier is currently unmeasurable by
this harness at all.

Proposed in `pipeline/proposals/ability-agent.json`. Also confirmed:
`kernel-panic-site/app/src/game/patch-cells.ts` (shape rolls, darkPatchCost,
armUnionCraft, PATCH_POUCH_MAX=5) exists as pure math, but `RunState`,
`DuelKit`, and the reducers still use `patchCells: number` (a plain count),
not an array of PatchMask. Boost bays, `swapOffered`/`craftReady`, and the
darknet-buy dispatch do not exist on disk yet. Engine notes referencing these
should say so honestly rather than assume they landed.

**Cuts confirmed (user tier list C/D/F/F), all safe, none referenced by
BOOST_SCHEDULE/MODE_PAIRS or a `requires` field:**
- `surge` (SURGE CACHE, C): single call site in settleFloods, no orphans.
- `bulwark` (BULWARK, D): single rider at the bottom of applyCast, no
  orphans.
- `carryCache` (CARRY CACHE, F): ORPHANS content/teaching.ts's RAM teach-tip,
  which names "4 with CARRY CACHE" by name. Flagged for tutorial-agent to
  drop that clause; the reducer side (duel-setup.ts carryCap) is a safe
  no-op once removed.
- `slagWard` (SLAG WARD, F): single rider in applyPlace
  (`c.wardThroughRound`/`c.wardBy`). The vacated hook is reused by the new
  `patchRefund` boost this same batch (same call site, different effect), so
  treat this cut and that add as one paired edit, not two independent ones.

**Four new boosts (all `requires`/`weight` per the new AugmentDef schema
fields landing this cycle):**
- `overtimeClause` (OVERTIME CLAUSE): cap wins pay 75 percent instead of 50
  (run-reducer.ts jobPayFor). Carries a loremaster tone flag per the brief's
  own scope list, filed to give that gate a mechanical anchor. NOT
  engine-passive from the kitted sim's perspective: it only affects credits,
  which sim.ts does not track, so it is orthogonal to BOOST_SCHEDULE.
- `darkDiscount` (DARKNET RATE): darknet pulls cost 15 percent less. Hooks
  into `darkPatchCost(day)` (patch-cells.ts, already exists) but the actual
  buy dispatch does not exist on disk yet, flagged as such. Also orthogonal
  to BOOST_SCHEDULE (night-shop economy only, no duel effect).
- `patchRefund` (SPLICE REFUND, requires pouch): placing a patch piece
  refunds its 1 RAM (duel-actions.ts applyPlace, reuses slagWard's vacated
  rider slot). ENGINE-PASSIVE, qualifies for BOOST_SCHEDULE: the kitted bot
  already places cells autonomously per Checkpoint A's own per-day note.
- `firstFault` (FIRST FAULT): first sprung trap each dive bills 0 strain
  (duel-actions.ts finishDuel, one line off the existing trapsFired count).
  ENGINE-PASSIVE, qualifies for BOOST_SCHEDULE: pure state math, no bot
  decision needed.

Directions from the brief NOT selected, so a future cycle does not
re-propose them cold: POUCH EXTENSION (too similar in shape to patchRefund,
both onboard the same pouch system) and CLEAN PAY BENDER (dropped in favor
of buffing CLEAN RUN's own capped-fire case instead of a second near-duplicate
par-win payout augment).

**Buffs (exact call sites, never touching SIPHON_STEAL/LOCK_ROUNDS/
WARD_ROUNDS, the shared tables):**
- `jamAnchor`: freeze duration `s.round` -> `s.round + 1` (it was expiring
  the instant the round incremented, i.e. same-round-only, weaker than its
  own copy implied).
- `longArms`: reach `BASE_REACH + 1` -> `BASE_REACH + 2` (reachOf,
  duel-power.ts); canPlace rides the same function so patch placement reach
  buffs too, no separate hook.
- `cfgArmSiphon`: new player-only `+1` baseline ahead of siphonPlus in the
  drain calc (duel-actions.ts), NOT a change to the shared SIPHON_STEAL
  table. `siphonPlus` gets a `requires: cfgArmSiphon` add, no numeric change.
- `tripwire`: burn `2` -> `3`, plus `requires: cfgArmHalt`. Flagged that its
  real payoff is smaller than the copy implies (the burn lands the round
  AFTER the halt trap's own lost-turn effect resolves), and that the whole
  halt package (cfgArmHalt HOLD + jamAnchor + tripwire) needs simming
  together, not as independent deltas.
- `tapLine`: trace persistence `s.round` -> `s.round + 1` stored value (was
  expiring same-round, now survives one extra round).
- `sweepCredit`: flat refund -> `Math.min(n, 3) * PROGRAM_COST` (per trap
  defused, capped at DEFEND_WIDTH's own tier-3 ceiling).
- `cleanRun`: added a second payout branch, +15cr on a capWin with zero
  traps fired (previously impossible to reward at all, since `kind==="cap"`
  always adds +10 to chip in finishDuel, so the existing chip-zero condition
  can never fire on a cap win).
- `cfgWard`: dropped the player-side `WARD_ROUNDS - 1` asymmetry so ward
  duration is symmetric between player and opponent; WARD_ROUNDS itself
  untouched.
- `hotBoot` and `echoTap`: filed as CANDIDATES only (not applied), both
  above-S per the user's tier list. hotBoot is BOOST_SCHEDULE's day-2 slot
  so any change moves the whole kitted curve; land only after a re-measure
  with the full batch. echoTap cannot be measured by the current kitted
  profile at all (not in BOOST_SCHEDULE or MODE_PAIRS) -- recommended adding
  it as a fourth MODE_PAIRS slot before trusting any number on it.
- `cheapShot`, `cfgArmHalt`, `cfgLock`: explicit HOLD, S ceiling per the
  user's tier list. Rationale for cfgLock repeats the story-retune-1 diagnosis
  (unconditional freeze, no fire condition, PAR's rotation budget already
  makes forcing reroutes valuable without touching LOCK). cfgArmHalt HOLD
  specifically to avoid double-buffing on top of tripwire's own bump.

Pool size after batch: 18 total (4 config + 14 boost), unchanged net (cut 4,
added 4), still under the ~20-boost dilution line.

**Open items for next cycle:** re-measure at Checkpoint B with the full
batch (boost bays, shaped pouch, arc-composer's new levers) before touching
hotBoot/echoTap further; get echoTap into a measurable schedule slot; watch
whether cfgArmHalt/cfgLock pick rate actually drops now that tripwire,
jamAnchor, sweepCredit, and the siphon baseline all target their competitors
instead of nerfing them directly.

See [[balance-story-retune-1]] for the prior cycle's per-mode diagnosis this
batch builds on, and [[missing-validation-report]] for the process precedent
on proceeding without a report (not needed this cycle: Checkpoint A existed
and was read before writing).
