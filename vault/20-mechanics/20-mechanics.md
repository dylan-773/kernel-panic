---
title: Mechanics
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[home]]", "[[the-duel]]", "[[economy]]"]
---

# Mechanics

Everything the player does, read out of the engine rather than out of the old design doc.

> [!warning] Two rewrites, and the second one is not in the code
> The duel was rebuilt on branch `split-boards` on 2026-08-04. Anything you remember about territory, claiming, SEVERED or gridlock is [[design-change-log]] entry 10 now.
>
> Everything **around** the duel was redesigned on 2026-08-16 and no code implements it yet: the day is the run, the calendar is open ended, and progression is permanent and physical. Those notes carry `status: draft`. The duel itself is untouched by that change, which is why most of this area is still `canon`.

## The duel

The combat system. One dive is one duel.

| Note | What it covers |
|---|---|
| [[the-duel]] | The overview. Read this first. |
| [[split-boards]] | Two grids, one per side. The central structural fact. |
| [[built-and-power]] | Permanent construction versus cuttable throughput. |
| [[the-board]] | Cells, junctions, piece distribution, generation and fairness. |
| [[rotation]] | The only movement verb, and why it only turns one way. |
| [[reach-and-placement]] | What you are allowed to touch. |
| [[route-cost-and-par]] | The Dijkstra metric that prices everything. |
| [[cascades-and-surge]] | The signature payoff, and the three surge tiers. |
| [[traps-and-telegraphs]] | Halt, siphon, and the one-beat tell. |
| [[win-conditions]] | Goal, cap, seal. |
| [[the-round-cap]] | The 25-round tiebreak. |
| [[turn-structure]] | Turn order, the command gate, the one undo. |
| [[opponent-ai]] | Stances, cut scoring, replanning. |
| [[difficulty-dials]] | `horizon`, `focus`, `greed`, and which are load-bearing. |
| [[difficulty-ramp]] | What sets those dials, now that there is no day table. |

## The kit

Three programs, always present, 1 RAM each, once per turn each. Depth lives in modes and tiers, not in count.

[[the-kit]] · [[scan]] · [[attack]] · [[defend]] · [[program-tiers]]

Modes: [[redirect]] · [[arm-halt]] · [[arm-siphon]] · [[purge]] · [[lock]] · [[ward]]

## Augments and the deck

Eighteen augments. Four configs unlock modes, fourteen boosts modify rules. Owning them is permanent; carrying them is limited.

[[augments]] · [[augment-drafts]] · [[the-neural-deck]]

## The player

[[player-character]] · [[player-skills]] · [[player-metrics]] · [[player-inventory]]

Resources: [[ram]] · [[neural-strain]] · [[credits]] · [[patch-pieces]] · [[the-pouch]]

## The day

The unit that can be lost, and the week it sits in.

[[day-close-and-banking]] · [[sunday]] · [[the-night-shop]] · [[meta-progression]]

## The shop as a system

Progression is repairs, and repairs are what unlock the rest.

[[repairs-and-unlocks]] · [[the-darknet]]

## Economy

[[economy]] · [[job-pay-and-billing]] · [[credits]] · [[scoring-and-lifetime-stats]]

## Known drift

Three places where shipped copy disagrees with shipped rules. Recorded, not patched, because this vault does not edit the game.

| Where | Says | Actually |
|---|---|---|
| `teaching.ts` coachmark `patch-cell-use` | placing a piece costs 2 RAM | `PLACE_COST = 4` (`patch-cells.ts`) |
| `teaching.ts` coachmark `cascade-bank` | pays from four nodes | `cascadeRam` pays from three (`kit.ts`) |
| `run-reducer.ts`, `save.ts` | `gridlockWin` is carried and persisted | `DuelEndKind` has no gridlock case; both sims hardcode `false` |
| `kit.ts:142` (`scanDesc`), `kit.ts:221` ([[long-arms]]) | "within N of **your territory**" | there is no territory. It means built ground. Also in the comments at `kit.ts:16` and `kit.ts:51` |

That last one is **player-facing copy in two places**: the SCAN description and the LONG ARMS augment card, both rendered in [[manual-txt]] and [[loadout-cfg]]. It is the deleted model's vocabulary still on screen. The accurate word is "built ground" or "your line". See [[built-and-power]].
