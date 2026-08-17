---
title: Determinism and seeds
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[simulation-harnesses]]", "[[the-board]]", "[[verification-gate]]"]
---

# Determinism and seeds

> [!info] Source
> `game/rng.ts:RngState`; `duel-setup.ts:mixSeed`; `run-reducer.ts:rollDraft`.

**Everything is a pure function of a seed.**

- Board generation. See [[the-board]].
- The opponent's choices. `RngState` lives on `DuelState`.
- [[augment-drafts|Draft]] rolls: deterministic per `(saveSeed, day, jobIndex)`. The day index is now unbounded, so the tuple has to tolerate arbitrarily large values rather than nine.
- [[patch-pieces|Patch]] drops and dark pulls.

`mixSeed(...parts)` derives a sub-seed from a tuple, so the same save seed produces the same board for the same day and job index every time, on every machine.

## Why it became load-bearing

> [!danger] REVISED IN PROTOTYPE
> Seeded generation was originally a convenience for reproducing bugs. It became **the thing that makes balance claims checkable at all**.
>
> Without it there is no such thing as "a tier 3 job wins 56%": there is only an impression. With it, a proposed change to `focus` produces a before number and an after number over the same 200 boards, and the difference is attributable.

This is [[design-pillars|pillar 4]]: claims are measured, not asserted.

## What it buys

1. **Paired comparisons.** `sim.ts` runs a kit-less pass and a kitted pass over the **same seeds**, so the delta is the kit and nothing else.
2. **A tutorial guarantee.** 0 wins in 200 seeds is a provable statement, not a hope.
3. **Regression detection.** A balance change that quietly breaks one tier shows up as a number.
4. **Bug reproduction.** A seed reproduces a board exactly.

## What it costs

The duel must terminate, which is why [[the-round-cap]] exists. It also rules out any true randomness at runtime, including anything drawn from wall-clock time.

## The honesty check

`checkPlanHonesty(20)` snaps every non-`approx` route plan to its target rotations and requires the goal to light for **exactly** the quoted cost, exiting 1 on any liar.

That is determinism turned back on the metric itself: the planner is not merely reproducible, it is verified to be telling the truth. See [[route-cost-and-par]].

## See also

- [[simulation-harnesses]] · [[verification-gate]]
