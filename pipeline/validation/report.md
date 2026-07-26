# Validation report - story-retune-1 FINAL (post integration, balance loop round 2)

Date: 2026-07-25. Orchestrator-run harnesses. Supersedes the mid-cycle
FAIL report (kept below as history).

Engine state: halt/siphon flood-stop removed, PAR live (per-day parFlat
taper 6/5/5/4/4/3/2/2/1), +10 day-close strain regen at upgrade-screen
entry, patch cells (35 cr, hold 3), ability retune batch (tier-scaled
siphon 2/3/4, ward blocks redirect, jamAnchor / sweepCredit / cleanRun /
slagWard augments), full story pass (openers/enders 1-12 explicit,
day-open scenes 1-10, tutorial framing), arc round-2 deltas
(D6 greed .98 oppRam 7, D7 greed .99 oppRam 7, D8 greed .97 oppRam 8).

## Verdict: PASS WITH DRIFT (all days inside the 6-point band)

1. `bun run typecheck` - PASS
2. `bun run src/game/dev/sim.ts` - tutorial 0/200 PASS
3. `bun run src/game/dev/run-sim.ts` - PASS (40 runs, 1247 dispatches;
   new cutscene flow, patch cell economy, clean-run bank, and regen
   invariants all asserted)

## Final curve (200 seeds, kit-less proxy)

| day | win % | ref | drift | chip/win | par | rot | over-par % |
|-----|-------|-----|-------|----------|-----|-----|------------|
| tutorial | 0/200 | 0 | - | - | - | - | - |
| 1 | 82.5 | 82 | +0.5 | 1.1 | 18 | 11.8 | 3.6 |
| 2 | 80.5 | 77 | +3.5 | 1.6 | 17 | 11.7 | 3.1 |
| 3 | 76.5 | 74 | +2.5 | 1.5 | 17 | 11.1 | 2.6 |
| 4 | 58.0 | 56 | +2.0 | 2.6 | 16 | 10.7 | 1.7 |
| 5 | 62.0 | 58 | +4.0 | 2.0 | 18 | 12.2 | 0.8 |
| 6 | 60.0 | 56 | +4.0 | 2.4 | 17 | 12.3 | 3.3 |
| 7 | 53.5 | 49 | +4.5 | 2.2 | 16 | 12.1 | 2.8 |
| 8 | 44.0 | 42 | +2.0 | 2.9 | 17 | 12.7 | 3.4 |
| 9 | 42.0 | 39 | +3.0 | 1.9 | 15 | 12.0 | 4.8 |
| finale | 27.0 | ~25 | +2.0 | 2.7 | 19 | 15.5 | 9.3 |

## Notes

- The whole curve sits uniformly +2 to +4.5 above reference: the halt
  fix made trap days fairer everywhere. Shape is preserved (monotone
  through the back half, D8 > D9 restored) and every day is inside the
  brief's ~6-point band, so this is accepted as the new normal rather
  than chased with a third loop iteration. If the reference curve is
  meant to be exact, a follow-up cycle can shave D2/D5/D6/D7 with
  greed-only nudges.
- Par shape: early-day punishment is gone (D1 over-par 24.8% -> 3.6%).
  Late-day over-par (1.4-4.8%) is below the 10-20% target band for the
  proxy; the proxy under-bounds real players, so watch real playtests
  before tightening parFlat further.
- Cap wins are near zero everywhere; chip/win runs 1.1-2.9 vs the old
  4.9-7.4, with strain now priced by par overage plus trap penalties.
  Combined with +10/day regen, run attrition is softer; Night Patch and
  patch cells compete for credits as intended.

## Balance loop history

- Round 0 (baseline, pre-engine): matched reference exactly.
- Round 1 (post halt fix): FAIL. D7 +8.5, D5/D6 at +6 boundary; par
  margins inverted (D1 24.8% over-par vs D7-D9 ~3%).
- Round 1 deltas (arc): D4-D8 greed/oppRam bumps + parFlat taper.
  Overshot: oppRam +1 measured ~10 points at D6-D8 (est. ~4), leaving
  D6 -7.0, D7 -6.5, D8 -5.5 and a D8/D9 inversion.
- Round 2 deltas (arc): D6/D7 oppRam back to 7 with greed .98/.99,
  D8 oppRam 8 with greed .97. Landed as predicted. PASS WITH DRIFT.
