---
title: Arc Composer
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[difficulty-ramp]]", "[[difficulty-dials]]", "[[validation]]"]
---

# Arc Composer

The difficulty curve. Sonnet, `maxTurns` 15.

## Owns

`pipeline/proposals/arc-composer.json`. Proposes difficulty config deltas against win-rate targets.

Never touches `kernel-panic-site/`.

## The table it moves

`DAY_CONFIGS` in `content/arc.ts`.

> [!warning] This seat's entire owned artifact is being redefined
> A ten-row table indexed by day cannot exist on an open calendar. What replaces it is a config per **job tier**, modified by how deep into the day a job arrives, with the available tier band opening as the shop grows. Until that table exists this seat has nothing to move. See [[difficulty-ramp]] and [[difficulty-dials]].

## The rule

Deltas against targets, with before and after sim numbers from the latest [[validation]] report. Iron rule 4.

## The smallest seat by call count

12 calls in the [[token-budget]], against 240 for Validation. The seat that can most easily break the game touches it least, and only with measurements in hand.

## What it learned about its own dials

`greed` is finished as a difficulty dial because it **compounds with duel length**. `focus` replaced it precisely because it does not. That distinction is this seat's most useful piece of institutional knowledge. See [[difficulty-dials]].

## See also

- [[difficulty-ramp]] · [[simulation-harnesses]]
