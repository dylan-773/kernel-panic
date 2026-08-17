---
title: Neural Strain
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[day-close-and-banking]]", "[[route-cost-and-par]]", "[[the-night-shop]]"]
---

# Neural Strain

> [!info] Source
> `run-reducer.ts:START_STRAIN`, `PATCH_HEAL`, `DAY_REST_REGEN`; `duel-actions.ts:finishDuel`.

The day's health bar, and the reason a day can be lost.

```
START_STRAIN    = 100
DAY_REST_REGEN  = 10     free, at day close
PATCH_HEAL      = 12     per night patch bought
cap             = 100
```

Strain is shared across every job the player takes in a day and never rises during a dive. Since the player chooses how many jobs to take, strain is what prices that choice: it is the only number that says how much day is left.

## It is a bill, not attrition

Strain is charged **only on a win**, and every term is avoidable in principle:

```
chip = 2  * rotations past par
     + 4  * traps sprung (minus 1 with FIRST FAULT)
     + 1  * redirects taken
     + 2  * pressure rounds
     + 10 if the win came at the round cap
chip = min(45, chip)
```

A perfect dive bills exactly zero. Full derivation in [[route-cost-and-par]].

> [!warning] A loss bills nothing
> `finishDuel` sets `strainChip = 0` for a loss. Losing the job is already the price.

## The fiction

NF-3 neurofilament degradation. Strain is not injury, it is accumulated scarring from diving, and at zero the connection severs rather than the diver dying:

> NEURAL STRAIN: ZERO. CONNECTION SEVERED.

What that costs is the day: everything held but not yet banked, and the evening. Nothing permanent is lost. See [[day-close-and-banking]].

Dad's death is the same mechanic on a longer timescale. That the player's health bar and the father's cause of death are the same number is the game's central rhyme. See [[dad]] and [[ground-truth]].

## Restoring it

- **+10** free at day close, and only if the day actually closes. A day that ends at zero forfeits it.
- **+12** per night patch, bought in the evening. See [[the-night-shop]].

> [!warning] Both sources are day-indexed and the day index is unbounded
> `45 + 5 * day` was priced against a nine-day arc. On an open calendar it grows without limit and eventually prices patches out of the game entirely. The formula needs replacing with something indexed on the shop rather than the calendar.

Night patches are strain suppressants. The bible is explicit that they treat the symptom.

## Teaching

The `strain-chip` coachmark (order 60) fires on first sight of the [[repair-log]] result surface. A `strain` tip is a persistent hover explainer, because the number is reference the player wants repeatedly. See [[teaching-system]].

## See also

- [[day-close-and-banking]] · [[economy]]
