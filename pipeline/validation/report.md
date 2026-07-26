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
