---
title: Save and load
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[day-close-and-banking]]", "[[title-and-start-screen]]", "[[meta-progression]]"]
---

# Save and load

> [!info] Source
> `game/save.ts`. `SLOT_COUNT = 3`.

## Three slots

Keys `kernel-panic-s<N>-meta-v2` and `kernel-panic-s<N>-run-v3`.

Each slot is a separate player. Progress is per slot, so a second slot is genuinely fresh and will be taught everything again.

Slots are **deletable from the login screen**. See [[title-and-start-screen]].

## The persistence contract is what the redesign changes most

> [!warning] status: this section is draft, the rest of the note is canon
> The shipped schema is two objects on two lifetimes. The design now has three lifetimes, and the middle one is the game.

| Object | Holds | Lifetime |
|---|---|---|
| `MetaState` | `machineOpened`, `sound`, `music`, `taught`, `stats` | forever |
| Permanent progress | credits, owned augments, tiers, RAM, deck slots, repairs completed, day number | forever |
| The day | held pay and salvage, pieces and augments earned today, strain, jobs taken, screen | until close, then it merges upward, or until strain 0, then it is discarded |

Two ways to build it: promote nearly everything out of `RunState` into a grown `MetaState`, or add a third object so the day stays a discardable envelope. **The second is safer**, because discarding a failed day becomes a delete rather than a diff, and the thing most likely to go wrong here is a failed day quietly keeping something.

`runCount` no longer exists. Nothing keys off it, and the schema version bumps when it goes. See [[meta-progression]].

## There are no checkpoints

No save-scumming a day, no restore point, no continue. A day either closes or it does not. See [[day-close-and-banking]].

The day being the persistence envelope makes this cheap to enforce: there is exactly one commit point, and it is going to bed.

## Refresh is a safe abort

> [!info] Transient screens are never resumed into
> Reloading mid-dive puts the player back at the shop, not into a half-serialized duel. So closing the tab during a losing dive costs the job, never the day's haul, and never corrupts the save.
>
> That affordance is worth re-examining now. When the day is the run, refreshing out of a dive the player is about to lose protects the whole day's haul, which is exactly the wager the design is built on. Either the abort has to cost the day, or the day has to be committed at the moment a dive starts.
>
> This is also the only "abandon" affordance in the game, and the ABANDON dialog copy exists to make it explicit rather than a discovered trick.

## The migration ladder

Real, and load-bearing, because saves survive across builds:

- Legacy `patchCells` integer becomes N cross masks.
- `ramPerTurn` NaN is repaired.
- Unknown augment ids are **dropped**, so removing an augment from the catalog does not brick an old save.
- Transient screens are never resumed into.

`run-sim.ts` exercises meta hydration across 40 full runs. What it should exercise instead is a long sequence of days, including failed ones, checking that a failed day leaves the permanent object bit-identical. See [[simulation-harnesses]].

## Two things worth knowing

**localStorage is per port.** A save made against `bun run preview` is not the save made against `dist/server/server.js`. This has confused more than one playtest.

**There is no cloud save and no account.** Clearing site data destroys everything.

## See also

- [[technical-requirements]] · [[scoring-and-lifetime-stats]]
