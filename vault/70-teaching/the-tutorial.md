---
title: The tutorial
status: canon
source: code
owner: tutorial-agent
updated: 2026-08-16
related: ["[[tutorial-beats]]", "[[difficulty-ramp]]", "[[verification-gate]]"]
---

# The tutorial

The opening dive. **Unwinnable by construction**, and it must prove it 200 times before any deploy.

## The config

`tutorialConfig()`: 13x7, `oppRam` 12, `pdTarget` 14, `headStart` 0, `horizon` 0, `focus` 0.5, `abilityFreq` **0**, `oppAttackModes: ["armHalt"]`, no defend modes, `oppTier` 1, slag 0.12, `tutorial: true`.

## How it works

**Programs boot OFFLINE and unlock by lesson beat.** The machine is RAM-throttled and holds back until all three programs have been demonstrated, then stops pretending.

The player reaching the goal does **not** win: it triggers an `opp` win with kind `seal`. The dive also seals at `round >= 7`, or one round after the lesson completes.

`tutFlags: { scanned, purged, attacked }` tracks the script; `tutorialLessonRound` records completion.

## Unwinnability is structural

> [!danger] REVISED IN PROTOTYPE
> The draft taught by weakening the opponent, a tier-0 config. It lost its first playtest: a weakened opponent does not read as teaching, it reads as a bad fight, and a player who nearly wins an unwinnable fight feels cheated rather than instructed.
>
> The shipped version makes the outcome **structural**: touching the core slams every port. You are not losing a close fight, you are being shown a door closing.

That distinction matters for the story too. The machine is not beating you. It is grading you and shutting the door. See [[entry-first-session]].

## The gate

```
bun run src/game/dev/sim.ts     # "tutorial player wins: 0 of 200 (must be 0)"
```

**Zero wins in 200 seeds, or the build does not ship.** See [[verification-gate]].

## What it teaches

The four `CORE_VERBS` and nothing else: **rotate, scan, defend, attack**. `teach-sim.ts` fails the build if any of the four is not taught in the opening dive.

`notBeforeDay: 1` on every coachmark means the tutorial takes **no coachmarks at all**, by construction. All teaching here is [[tutorial-beats|beats]].

## Run 1 only

`opener` to `tutIntro` to `tutorial` to `tutOutro` to `dayOpen`, once, at the start of a save. There is no later branch to write: with no runs, the tutorial simply is the opening of the game. See [[game-flowchart]].

## See also

- [[tutorial-beats]] · [[the-machine]]
