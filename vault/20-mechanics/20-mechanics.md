---
title: Mechanics
status: canon
source: code
owner: orchestrator
updated: 2026-08-31
related: ["[[home]]", "[[the-duel]]", "[[economy]]"]
---

# Mechanics

Everything the player does, read out of the engine rather than out of the old design doc.

> [!warning] This area was rewritten on 2026-08-05
> The duel was rebuilt on branch `split-boards`. Notes here describe that engine. Anything you remember about territory, claiming, SEVERED or gridlock is [[territory-and-claiming]] now.

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

## The kit

Three programs, always present, 1 RAM each, once per turn each. Depth lives in modes and tiers, not in count.

[[the-kit]] · [[scan]] · [[attack]] · [[defend]] · [[program-tiers]]

Modes: [[redirect]] · [[arm-halt]] · [[arm-siphon]] · [[purge]] · [[lock]] · [[ward]]

## Augments

Eighteen. Four configs unlock modes, fourteen boosts modify rules.

[[augments]] · [[augment-drafts]] · [[boost-bays]]

## The player

[[player-character]] · [[player-skills]] · [[player-metrics]] · [[player-inventory]] · [[death-and-run-end]]

Resources: [[ram]] · [[neural-strain]] · [[credits]] · [[patch-pieces]] · [[the-pouch]]

## Economy

[[economy]] · [[job-pay-and-billing]] · [[the-night-shop]] · [[the-darknet]] · [[scoring-and-lifetime-stats]] · [[meta-progression]]

## Known drift

Shipped copy vs shipped rules. The Orchestrator swept this on 2026-08-31: the 2-RAM patch coachmark now says 4, the SCAN/LONG ARMS "territory" vocabulary reads "built ground", MANUAL.TXT's HOW A DIVE WORKS page was rewritten to the split-board rules (including four-or-more corrected to three), and the last claim/territory strings in `kit.ts` descriptions and `teaching.ts` labels were replaced (the cascade-bank coachmark had been fixed earlier). One row remains:

| Where | Says | Actually |
|---|---|---|
| `run-reducer.ts`, `save.ts` | `gridlockWin` is carried and persisted | `DuelEndKind` has no gridlock case; both sims hardcode `false`. Removing it is a save-schema change; deferred deliberately. |

When a row here gets fixed in the game, delete the row in the same change. A drift ledger nobody consumes is how the 2-RAM lie shipped for 26 days; the [[verification-gate]] audit play (`/kp-audit`) now sweeps copy vs constants so this table cannot silently grow.
