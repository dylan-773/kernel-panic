# Validation report - teaching-2026-07-26

Date: 2026-07-26. Teaching pass integrated. Validation harnesses (typecheck, sim, run-sim, teach-sim).

Engine state: One code edit only - extracted the literal `3` in `duel-setup.ts`'s board fairness filter into an exported `MAX_OPENING_CLAIM` constant of the same value. No other game logic touched. RNG stream bit-identical to previous cycle.

Teaching additions: Survivor walk that force-wins every dive purely to record late-run surface reachability (makes `finalePre` and `finaleWin` reachable for mechanic-coverage accounting). Assertion that opening dive teaches rotate lesson for all opening claim counts 0 through `MAX_OPENING_CLAIM` (caught and fixed earlier bug where beat was `owned <= 2` but generation hands out up to 3, affecting ~23.9% of openings).

## Verdict: PASS

1. `bun run typecheck` - PASS
2. `bun run src/game/dev/sim.ts` - tutorial 0/200 PASS
3. `bun run src/game/dev/run-sim.ts` - PASS (40 full runs, 1247 dispatches)
4. `bun run src/game/dev/teach-sim.ts` - PASS (32 mechanics, 21 taught, 11 waived, teaching coverage complete)

## Curve (200 seeds, kit-less proxy)

| day | target | measured | delta | status |
|-----|--------|----------|-------|--------|
| tutorial | 0 | 0 | - | OK |
| 1 | 82 | 82.5 | +0.5 | OK |
| 2 | 77 | 80.5 | +3.5 | OK |
| 3 | 74 | 76.5 | +2.5 | OK |
| 4 | 56 | 58.0 | +2.0 | OK |
| 5 | 58 | 62.0 | +4.0 | OK |
| 6 | 56 | 60.0 | +4.0 | OK |
| 7 | 49 | 53.5 | +4.5 | OK |
| 8 | 42 | 44.0 | +2.0 | OK |
| 9 | 39 | 42.0 | +3.0 | OK |
| finale | 25 | 27.0 | +2.0 | OK |

## Notes

- Curve drift within tolerance. All days sit +0.5 to +4.5 above reference; largest deltas on days 5, 6, 7 (all +4.0 to +4.5), finale at +2.0. No day exceeds the ~6-point drift tolerance; no inversion between adjacent days. The RNG stream remains bit-identical to the pre-integration baseline (only the `MAX_OPENING_CLAIM` constant extraction touched game logic). Gate holds.

- Survivor walk now reaches finale surfaces. The force-win walk correctly materializes `finalePre` and `finaleWin` in the reachable surfaces list, confirming the new mechanic-coverage-completeness check is working as designed. These surfaces were previously unreachable in simulated runs.

- Opening dive rotation assertion passing. The new assertion verifying that the opening dive teaches the rotate lesson for all opening claim counts (0 through `MAX_OPENING_CLAIM`) passes silently, confirming the earlier bug (beat bound at `owned <= 2` vs generation max of 3, affecting ~23.9% of openings) is fixed.

## Balance loop history

- Round 0 (baseline, pre-engine): matched reference exactly.
- Round 1 (post halt fix): FAIL. D7 +8.5, D5/D6 at +6 boundary; par margins inverted (D1 24.8% over-par vs D7-D9 ~3%).
- Round 1 deltas (arc): D4-D8 greed/oppRam bumps + parFlat taper. Overshot: oppRam +1 measured ~10 points at D6-D8 (est. ~4), leaving D6 -7.0, D7 -6.5, D8 -5.5 and a D8/D9 inversion.
- Round 2 deltas (arc): D6/D7 oppRam back to 7 with greed .98/.99, D8 oppRam 8 with greed .97. Landed as predicted. PASS WITH DRIFT.
- Teaching pass (no balance changes): Curve held steady relative to round 2. All days within 6-point tolerance. Gate holds.

---

# Validation report - playtest-repair-2026-07-27

Date: 2026-07-27. Playtest repair pass (phases 1 to 5 of the 7/25 playtest notes). Gate run by the
Orchestrator directly, not the validation agent, at the user's instruction for this pass.

## Verdict: PASS

1. `bun run typecheck` - PASS
2. `bun run src/game/dev/sim.ts` - tutorial 0/200 PASS
3. `bun run src/game/dev/run-sim.ts` - PASS (40 full runs, 1376 dispatches, up from 1247: the
   night close is now two dispatches instead of one)
4. `bun run src/game/dev/teach-sim.ts` - PASS (32 mechanics, 21 taught, 11 waived)
5. `bun run build` - PASS, SSR server boots and serves the document shell

## Curve (200 seeds, kit-less proxy)

Win rates are bit-identical to the teaching-2026-07-26 baseline on every day. No arc or ability
number was touched in this pass.

| day | target | measured | delta | status |
|-----|--------|----------|-------|--------|
| tutorial | 0 | 0 | - | OK |
| 1 | 82 | 82.5 | +0.5 | OK |
| 2 | 77 | 80.5 | +3.5 | OK |
| 3 | 74 | 76.5 | +2.5 | OK |
| 4 | 56 | 58.0 | +2.0 | OK |
| 5 | 58 | 62.0 | +4.0 | OK |
| 6 | 56 | 60.0 | +4.0 | OK |
| 7 | 49 | 53.5 | +4.5 | OK |
| 8 | 42 | 44.0 | +2.0 | OK |
| 9 | 39 | 42.0 | +3.0 | OK |
| finale | 25 | 27.0 | +2.0 | OK |

## The brutal bug, measured

The playtest note "AI can win with no heartbeat warning or actually connecting to the final node,
nearly unwinnable or completely unwinnable" was the SEVERED rule in `endOppTurn` ending a dive the
instant `routeCost(player)` returned Infinity. Instrumented over 2000 dives (days 1 to 9 plus
finale, proxy player holding 3 patch cells):

| rule | fires | rate |
|---|---|---|
| old (any Infinity route at a round end) | 134 | 6.70% |
| of those, a held patch cell reopened a route | 111 | 5.55% |
| new (rescue check plus two-round streak) | 1 | 0.05% |

Three separate causes, all fixed:
- `routePlan` returned `null` from its self-crossing reroute bailout at `depth >= 4`, which
  `routeCost` reported as Infinity. It now returns the plan flagged `approx`; a route that exists
  is never reported as no route.
- The rule's premise ("a severed route never heals") predates patch cells, which convert slag into
  a live cross junction. `playerHasRoute` now re-tests with unspent cells virtually placed.
- The verdict now has to repeat on the next round before it counts, so a one-round planner
  blindspot cannot end a winnable dive.

## End-kind distribution (3800 dives, kit-less and 3-cell passes)

`won:core` 2275, `lost:core` 1496, `lost:severed` 14, `won:gridlock` 8, `won:cap` 7. Every
terminal duel carries a non-null `endReason`; run-sim now asserts this, asserts that a severed
verdict implies no route exists with cells counted, and asserts gridlock resolves to the player.

## Notes

- Total gridlock was previously reported as `winKind: "cap"`. That halved the payout via
  `jobPayFor` and added the +10 turn-cap strain chip to a board that deadlocked rather than
  timing out. It now reports `"gridlock"` and does neither. This affects roughly 0.2% of dives and
  is the only payout behavior change in the pass; average chip per win drops 0.1 to 0.2 on most
  days as a result. Flagging it for the balance pass in case gridlock should carry its own,
  smaller penalty.
- Genuine turn-cap wins do occur (7 of 3800), so the cap branch is not dead code.
- `sim.ts` remains kit-less (`BASE_KIT`, no program casts, no patch cells). The playtest note
  "late game is too easy, patches trivialize entire levels" is still unmeasurable by this harness.
  Adding a kitted-player profile is the first task of the deferred balance pass.

---

# deep-balance-2026-07-28 / Checkpoint A (BEFORE)

**VERDICT: PASS** (checkpoint criterion: kit-less curve unchanged, all harnesses green;
the kitted numbers below are the problem statement, not a failure)

Content authored by the validation agent this cycle; landed by the Orchestrator after the
agent's own Write did not reach this file. Numbers verified against a direct harness run.

What changed since playtest-repair-2026-07-27: dev-only measurement infrastructure. A kitted
player profile (`dev/kitted-profile.ts`), a threshold policy bot with casts and patch
placement (`dev/kitted-bot.ts`), a paired-seed kitted pass printed under the untouched
kit-less block in `sim.ts`, the shared `duelKitOf` adapter in `save.ts`, `DayConfig.slag`
set to the old constant 0.18 everywhere, and a side-generic `prepareCastFor` split with zero
rng movement. No game rule changed.

## Harness results

1. `bun run typecheck` PASS
2. `bun run src/game/dev/sim.ts` tutorial 0/200; kit-less block byte-identical to the
   previous baseline; kitted block measured
3. `bun run src/game/dev/run-sim.ts` PASS (40 full runs, 1376 dispatches)
4. `bun run src/game/dev/teach-sim.ts` PASS (32 mechanics, 21 taught, 11 waived)

## Kit-less curve: unchanged

Byte-identical to playtest-repair-2026-07-27 (82.5 / 80.5 / 76.5 / 58.0 / 62.0 / 60.0 /
53.5 / 44.0 / 42.0, finale 27.0; all within drift tolerance of targets).

## Kitted curve, FIRST MEASUREMENT (200 paired seeds per day, current engine)

Profile: day-progressive canonical build. Night picks r/a/r/s/r/d/a/r/d (finale ram 9,
tiers S2/A3/D3); mode pairs RP/SP/HL cycled per seed from day 3; boosts hotBoot@2,
longArms@4, mode-matched third @6; patch cells 0/0/1/1/2/2/3/3/3. Cells are the CURRENT
cross-shaped cells; no crafting, no shapes, no boost slots exist yet. Same seeds and
configs as the kit-less rows, so every delta is a paired comparison on identical boards.

| day | provisional target | measured | delta |
|---|---|---|---|
| 1 | 86 | 82.5 | -3.5 |
| 2 | 84 | 97.0 | +13.0 |
| 3 | 82 | 97.0 | +15.0 |
| 4 | 70 | 98.5 | +28.5 |
| 5 | 72 | 93.5 | +21.5 |
| 6 | 70 | 97.0 | +27.0 |
| 7 | 64 | 94.5 | +30.5 |
| 8 | 58 | 94.0 | +36.0 |
| 9 | 55 | 94.0 | +39.0 |
| finale | 48 | 85.0 | +37.0 |

Per-day detail (rounds, chip/win, casts s/a/d, cells/win): d1 3.7/3.5/s0.6 a3.3 d0.3/0.00;
d2 2.3/1.1/s0.6 a1.7 d0.1/0.00; d3 1.5/0.7/s0.7 a0.6 d0.1/0.68; d4 1.2/0.5/s1.0 a0.3
d0.1/0.80; d5 1.3/0.5/s1.0 a0.5 d0.1/0.91; d6 1.2/0.6/s1.0 a0.3 d0.1/0.86; d7 1.2/0.6/s1.0
a0.3 d0.1/0.86; d8 1.3/0.4/s1.0 a0.4 d0.1/0.86; d9 1.2/0.2/s1.0 a0.3 d0.1/0.83; finale
1.3/0.7/s1.0 a0.4 d0.1/0.91.

## Finale close-round histogram (kitted, 200 seeds)

r1 120, r2 42, r3 6, r4 2, r5+ 0. Round-1 closes: 120 of 170 finale wins (70.6%).

## Kitted end-kind tally (2000 dives)

won core 1866, won cap 0, won gridlock 0; lost core 119, lost severed 15, lost cap 0.

## Analysis

The three playtest claims are now all measured on this harness:

- "Late game is too easy": D7-9 run +30.5 to +39.0 points above the provisional kitted
  targets while the kit-less proxy sits within tolerance. The game's difficulty curve only
  exists for a player who ignores their kit.
- "Patches trivialize entire levels": from day 3 on, the bot spends 0.68-0.91 cells per win
  and mean win length collapses to 1.2-1.5 rounds. A held cross converts "cannot close this
  turn" into "closes right now" almost whenever slag sits near the route.
- "A fully upgraded kit closes the finale on turn one": 60% of all kitted finale attempts
  (70.6% of wins) end on round 1. The hard gate for later checkpoints is zero round-1
  kitted closes.

These deltas are the BEFORE table for the pass. The shaped-patch rework (WS1), boost slots
and catalog surgery (WS2), economy retune (WS3), and the arc-composer's new levers (per-day
slag, patchDrop, late grid growth, explicit finale parFlat) are the instruments; Checkpoint
D adopts final kitted bands and re-publishes the kit-less baseline after the grid/slag
changes land (the one sanctioned re-baselining).

Note for the loop history: the kitted bot places a cell when it is a rescue, a shortcut of
2+ rotation RAM, or the placement that makes this turn the closing turn. The last rule is
what playtesters actually do and dominates the cells/win figure.

---

# deep-balance-2026-07-28 / Checkpoint D (AFTER)

**VERDICT: PASS WITH DRIFT AND OPEN ITEMS**

Content authored by the validation agent; landed by the Orchestrator (the agent's
Write again did not reach this file; numbers verified against direct runs).

## Harness results

1. `bun run typecheck` PASS
2. `bun run src/game/dev/sim.ts` tutorial 0/200 PASS
3. `bun run src/game/dev/run-sim.ts` PASS (40 full runs, 1286 dispatches)
4. `bun run src/game/dev/teach-sim.ts` PASS (39 mechanics, 26 taught, 13 waived)
5. `bun run build` PASS

## Kitted curve vs provisional bands (200 paired seeds)

| day | band | measured | delta |
|---|---|---|---|
| 1 | 86 | 82.5 | -3.5 OK |
| 2 | 84 | 95.0 | +11.0 DRIFT |
| 3 | 82 | 84.5 | +2.5 OK |
| 4 | 70 | 81.0 | +11.0 DRIFT |
| 5 | 72 | 78.0 | +6.0 OK |
| 6 | 70 | 89.5 | +19.5 DRIFT (worst) |
| 7 | 64 | 80.5 | +16.5 DRIFT |
| 8 | 58 | 79.5 | +21.5 DRIFT |
| 9 | 55 | 65.5 | +10.5 DRIFT |
| finale | 48 | 41.5 | -6.5 OK |

Finale close player-turns: t1 1, t2 27, t3 32, t4 14, t5+ 9. The hard gate says
zero t1 closes; ONE straggler remains of the 120 measured at Checkpoint A (a
99.2 percent reduction). Cells/win: 0.46-0.60 early, 0.63-0.77 late, finale 1.05,
with pieces now shaped, welded, and 2 RAM to place.

## RE-BASELINED kit-less curve (the new published reference)

tutorial 0; D1-9: 82.5 / 76.0 / 75.5 / 54.0 / 57.0 / 52.0 / 50.5 / 50.5 / 32.5;
finale 0.0. Two structural notes: (a) chip/win now includes the +6 gridlock chip;
(b) the kit-less finale is zero BY DESIGN: the finale machine takes the opening
turn (oppOpens), and a rotation-only proxy with no kit cannot beat it. Day-10
players always carry a kit; the kitted 41.5 is the finale's real reference.

## Loop history (7 integration rounds, for the lever ledger)

- R1 (arc-composer proposal): greed nudges D2-D5/D8-9; slag ladder 0.18 to 0.25
  (finale 0.27); patchDrop cuts 0.35 to 0.11; D9 grid 13x11 + oppRam 10 +
  minCost 24; finale 15x13 / oppRam 11 / minCost 30 / headStart 2 / parFlat 0 /
  abilityFreq 0.85; hotBoot +2 to +1 adopted on its recommendation. Finale r1
  closes 120 to 54. NOTE: patchDrop does NOT drive the sim profile's pouch (a
  standardized 0/0/1/1/2/2/3/3/3 input), so its cuts retune the real economy
  while the harness stays a conservative worst-case test.
- R2: oppRam +1 across D4-D8 measured only ~3-5 kitted points (vs ~10 kit-less):
  kitted wins end before opponent RAM matters. Mostly retracted.
- R3: PLACE_COST 1 to 2 RAM (patch-cells.ts; the user's "costlier" lever);
  minPd generator floors introduced (DuelConfig.minPd, opening route cost floor);
  D7 grid 11x11, D8 grid 13x11; mid oppRam givebacks.
- R4: finale 17x13, minPd 17 then 18, minCost 34.
- R5 (decisive): (a) finale oppOpens, teaching covered by the finaleOppOpens
  waiver (the IT IS MOVING light, at the only dive that opens this way);
  (b) the generator's SHORTCUT floor: reject boards where one cross placed from
  opening reach collapses routeCost to minPd-6 or below. This killed the
  measured "piece bridges a slag wall, pd 19 becomes 5" pattern. Floored
  configs get a 12-retry budget; a seed that cannot meet the floor falls back
  to the pre-floor generator, rare by construction.

## Open items for the next cycle

1. Finale t1 = 1 of 200 (hard gate says 0). Measure the seed before levering.
2. D6 +19.5 (worst residual; greed maxed, highest mid cells/win band).
3. D2 +11.0 (driven by the profile's ram-6-vs-5 day-2 pick; candidate band
   correction rather than a lever) and D4 +11.0.
4. D8 +21.5 kitted / +8.5 kit-less; D9 kit-less -6.5 (bands predate slag 0.25).
5. echoTap 2 to 1 tone-down candidate remains un-simmed (not in any profile build).
6. Provisional kitted bands themselves need re-setting against these measured
   values plus real playtesting; treat this table as the new BEFORE.
7. tutorial-agent to ratify the orchestrator-authored finaleOppOpens waiver and
   flip its PLANNED ledger rows to TAUGHT on its next audit.


---

# Cycle ui-integration-2026-07-29 (UI integration, zero balance levers)

## VERDICT: PASS

Full v2 UI integration (kpos-shell desktop, all nine windows, DIVE.EXE
instrument panel) with ZERO balance changes. Engine deltas limited to:
optional telemetry fields on duelFinished/lastResult (rounds, trapRounds,
parRounds, log), TeachSurface gaining "solder", WINDOW_SURFACES gaining
"solder", and the patch-craft coachmark retiring into a patchCraft waiver
(tutorial gate ruling, 2026-07-29).

Harnesses: typecheck PASS; sim.ts tutorial 0/200 PASS; run-sim PASS (40
full runs, 1286 dispatches, machineOpened=false, finaleWins=0, story
scenes cover runs 1-12); teach-sim PASS (39 mechanics, 25 taught, 14
waived, 9 coachmarks, 7 tips, 10 tutorial beats; the +1 waiver and -1
coachmark are the ratified patchCraft retirement).

Curve (200 seeds, kit-less proxy) vs the deep-balance-2026-07-28
re-baselined reference: BIT-IDENTICAL on all 11 rows.

| day | ref | measured | delta |
|---|---|---|---|
| tutorial | 0 | 0 | 0.0 |
| 1 | 82.5 | 82.5 | 0.0 |
| 2 | 76.0 | 76.0 | 0.0 |
| 3 | 75.5 | 75.5 | 0.0 |
| 4 | 54.0 | 54.0 | 0.0 |
| 5 | 57.0 | 57.0 | 0.0 |
| 6 | 52.0 | 52.0 | 0.0 |
| 7 | 50.5 | 50.5 | 0.0 |
| 8 | 50.5 | 50.5 | 0.0 |
| 9 | 32.5 | 32.5 | 0.0 |
| finale | 0.0 | 0.0 | 0.0 |

No anomalies. The deep-balance open items above carry forward unchanged
into the next balance cycle; nothing in this cycle touched them.
