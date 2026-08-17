---
title: RAM
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[turn-structure]]", "[[cascades-and-surge]]", "[[player-metrics]]"]
---

# RAM

> [!info] Source
> `run-reducer.ts:BASE_RAM`, `MAX_RAM`; `duel-types.ts:SideEcon`.

The per-turn action budget. RAM is what makes the duel a game of choices rather than a puzzle with one answer.

```
BASE_RAM = 5      the deck as inherited
MAX_RAM  = 9      cap, bought with salvage
carryCap = 2      both sides, flat
```

## What it buys

| Action | Cost |
|---|---|
| [[rotation]] | 1 |
| any program cast | 1 (`PROGRAM_COST`) |
| [[patch-pieces|patch placement]] | 4 (`PLACE_COST`), once per turn |

## Turn arithmetic

```
ram = ramPerTurn + carry - drainNext
drainNext = 0
```

`drainNext` is settled first and then zeroed, so a turn burned by a halt trap does not also owe the drain on the next one. Negative `drainNext` is a **gain**.

## Where gains come from

- [[cascades-and-surge]] - banked into the next turn, 1 to 4.
- [[arm-siphon]] - stolen from the victim, 2 to 4, plus [[deep-siphon]].
- [[echo-tap]] - 2 whenever your trap fires.
- [[hot-boot]] - 1 on the first turn of every dive.
- [[cheap-shot]] - the first ATTACK is free.
- [[sweep-credit]] - 1 per trap purged, max 3.
- [[splice-refund]] - the full 4 back on a placement.

## Where losses come from

- [[arm-halt]] with [[tripwire]] - 3 off the next active turn, on top of the forfeit.
- [[arm-siphon]] - the mirror of the gain above.

## Growth

`ramPerTurn` starts at 5 and rises by 1 per [[the-neural-deck|deck]] upgrade, capped at 9. It is permanent once banked, so unlike everything else about a day it only ever goes up.

The opponent's `oppRam` runs from 6 at the bottom of the tier band to 11 at the top, so the machine is nearly always ahead on raw budget. The player's edge is [[cascades-and-surge|cascades]] and the [[rotation|repair-cost]] exchange rate, not throughput.

> [!warning] `NIGHT_SCHEDULE` has no meaning now
> The sim's canonical build took RAM on nights 1, 3, 5 and 8. There are no scheduled nights and no free picks, so the harnesses need a new model of how a player's budget grows. See [[simulation-harnesses]].

## See also

- [[turn-structure]] · [[the-night-shop]]
