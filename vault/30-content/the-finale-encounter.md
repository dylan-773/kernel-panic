---
title: The finale encounter
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[the-machine]]", "[[patch]]", "[[sunday]]"]
---

# The finale encounter

The game's only boss, and it is deliberately not a boss. Attemptable on any [[sunday]], as often as the player is willing to spend a day off on it.

## What makes it different

| | |
|---|---|
| New mechanic | **none** |
| Phases | **none** |
| Health bar | **none** |
| Special rules | **one**: `oppOpens` |

It is an ordinary duel at maximum difficulty: 15x11, horizon 3, focus 1.00, greed 1.00, the full six-mode vocabulary at width 3, and the machine moving first.

> [!info] Mechanically it is an ordinary duel. That is the point.
> The final exam is the thing the player has been practising at every day since the shop opened. A phase-change boss would say all that work was a tutorial for something else. This says it was the thing itself.

Its configuration is the top of the tier band and then some: the largest board, every dial at its extreme, and the machine moving first. See [[difficulty-ramp]].

**Why 15x11 and not larger.** Legibility. 17x13 was tested and read worst at 42px per cell, so the board stops where a player can still see the whole of it.

## `oppOpens`

The only dive where the machine takes the first turn. The fiction is exact: **it was already inside**.

It is also why the kit-less proxy posts a 0% finale win rate by construction. A player with no configs, no wards, no locks and no purges cannot answer an opponent that opens with the full vocabulary.

## The identity tag

The opponent reads **INTRUSION** throughout, including on the winning dive. The name [[patch]] is revealed in the scene that follows, never in the dive's own UI. See [[ruling-11-opponent-identity-tag]].

So the player beats a thing labelled INTRUSION, and only afterwards learns they were playing against what their father built for them, which had never once let them win.

## The seal

Opens only on **"A FAIR WIN, NO ASSISTS"**. It is software and nothing else, and it does not open so much as let go. See [[ruling-15-the-seal-is-software]].

## On a win

`machineOpened` is set permanently. The win scene plays, [[entry-patch|PATCH.SYS]] becomes readable, and the full truth lands however much or little the player has found beforehand. See [[reveal-schedule]].

**Then it is Monday.** The game does not end, the shop opens, and [[patch]] is in the back room from now on. That is the largest unwritten consequence of the redesign: the reward for the hardest thing in the game is that the game keeps going, and it has to be worth playing afterwards.

## On a loss

Nothing at all, except the Sunday. No strain penalty beyond the dive, no story consequence, and nothing released for having tried. Losing used to pay a fragment; it does not any more, because story comes out of the shop instead. See [[repairs-and-unlocks]].

## See also

- [[the-machine]] · [[backroom-lck]] · [[cutscenes-and-scenes]]
