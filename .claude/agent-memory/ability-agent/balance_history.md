---
name: balance-history
description: Catalog retunes proposed per balance cycle, the report numbers they answered, and the reasoning, so future cycles do not re-propose a known-tried lever from scratch.
metadata:
  type: project
---

## Cycle 2026-09-01 (spawn-prompt validation drift, brief id spawn-prompt-2026-09-01-validation-drift)

Answered a validation summary given directly in the spawn prompt (PASS WITH DRIFT):
Day 3 measured 61.5% vs target 67% (-5.5%, too hard), Day 5 measured 61.5% vs target 56%
(+5.5%, too easy), Finale measured 39.5% vs target 35% (+4.5%, too easy). See
[[report-file-gap-pattern]]: these numbers were NOT found anywhere in
`pipeline/validation/report.md` when read in full; proceeded on the session's word per
CLAUDE.md ground-truth ordering, flagged the gap as a suggestion item.

Proposed 4 retunes, all to EXISTING augment ids (pool held at 18, no additions):

- `longArms`: reach bonus BASE_REACH+2 (4) cut to BASE_REACH+1 (3). Targets Day 5 overshoot;
  comes online day 4 in the kitted harness schedule (`dev/kitted-profile.ts` BOOST_SCHEDULE),
  so it is live exactly for the Day 5 measurement and everything after.
- `jamAnchor`: freeze duration trimmed from "through the reply and the caster's own next turn"
  (`lockedThroughRound = round + 1`) to "through the reply only" (`= round`). Targets Finale
  overshoot; comes online day 6 (mode-pair slot). Confirmed via code read that SURGE (6+ lit,
  `surgeTierOf`) already shatters this freeze generically (duel-actions.ts:196-202 checks
  `lockedThroughRound`/`lockedBy`, not mode-specific), so the stated counter is real, not
  invented.
- `tripwire`: added RAM drain on a boosted halt trap cut from 3 to 2. Same day-6 slot as
  jamAnchor, also targets Finale overshoot; split the cut across both boosts rather than
  gutting one archetype.
- `cfgArmSiphon`: the PLAYER-ONLY baseline drain bonus (duel-actions.ts, separate from the
  shared `SIPHON_STEAL` table that opponents also read) raised from +1 to +2. Targets the
  Day 3 shortfall. Hypothesis, not sim-confirmed: at day 3 the kitted harness first
  randomizes the mode-pair archetype (redirect+purge / armSiphon+purge / armHalt+lock,
  `mixSeed % 3` in `kitAtDay`), and armSiphon reads as the weakest of the three pre-boost
  (armHalt costs a whole turn at base, redirect is free-form, armSiphon only drains
  2-4 RAM until siphonPlus, which the harness does not grant until day 6). Deliberately did
  NOT touch the shared `SIPHON_STEAL` table itself since that would also buff opponent-side
  siphon casts. Asked validation to break out Day 3 win rate by archetype next pass to
  confirm before trusting this lever alone.

Also filed (not a catalog fix, cross-lane observation): `dev/kitted-profile.ts`'s
`NIGHT_SCHEDULE` doesn't grant a DEFEND upgrade until day 7, so DEFEND_WIDTH stays 1 through
days 3-6 for every archetype. Flagged as a suggestion for arc-composer/validation, not mine
to fix.

**If a later cycle reads this and Day 3/5/Finale are still off**: check whether these four
retunes actually landed and got re-measured before proposing a second round on the same
levers; if they landed and the numbers didn't move as expected, that is itself informative
(would falsify the armSiphon-archetype-parity hypothesis specifically).
