---
title: Scoring and lifetime stats
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[ledger-log]]", "[[meta-progression]]", "[[save-and-load]]"]
---

# Scoring and lifetime stats

> [!info] Source
> `save.ts:MetaState.stats` (`LifetimeStats`). Window: [[ledger-log]].

There is no score. Nothing ranks the player and nothing is optimized for points.

What exists instead is an **accounting record**: `LifetimeStats` on `MetaState`, persisted per save slot.

## Presentation

[[ledger-log]] renders it as an accounting terminal:

- **TODAY** against **LIFETIME**, with today's column still at risk until the day closes.
- **CREDITS** as the hero number.
- **MOST LETHAL** customer dossier, the client whose device has cost the player the most days.
- Print furniture: the window is styled as a ledger printout.

## Why stats and not score

The fiction does the work. A repair shop keeps books; it does not keep a high score. Framing the record as accounting makes the number diegetic, which is the same move as [[repair-log]] reading a dive result as a transaction.

MOST LETHAL is the one stat that behaves like a boss meter, and it is emergent rather than authored: whichever [[customers|customer]] the player keeps failing becomes their nemesis without the game ever designating one. It used to count runs ended, which was a rare and dramatic event. Counting days cost is a smaller unit and a better one, because it fires often enough to build a grudge.

## See also

- [[ledger-log]] · [[day-close-and-banking]]
