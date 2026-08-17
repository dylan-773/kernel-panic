---
title: Day close and banking
status: draft
source: none
owner: user
updated: 2026-08-16
related: ["[[neural-strain]]", "[[meta-progression]]", "[[the-night-shop]]"]
---

# Day close and banking

> [!warning] status: draft
> This note replaces `death-and-run-end`. It states the position settled with the user on 2026-08-16; no code implements it yet.

**The day is the run.** Not the ten days, not the save file. One working day, opened at the counter and closed by choice, is the unit that can be lost.

## The decision

Customers arrive until the player closes the shop. Nothing forces the day to end and nothing forces it to continue, so every customer after the first is a wager: this job's pay against everything already earned today.

The wager is legible because [[neural-strain]] is visible and the intake read is honest. A player at 22 strain looking at a tier 4 device knows exactly what they are being offered.

## Banked, held, lost

| State | What is in it |
|---|---|
| **Banked** | everything the player owns at the start of the day: shop repairs, deck upgrades, unlocked augments, credits, salvage, pieces |
| **Held** | everything earned since the day opened: the day's pay, salvage, [[patch-pieces|pieces]], augments drafted today |
| **Lost** | the held column, if strain reaches 0 |

Closing the day moves held into banked. That is the whole ritual, and it is the only way progress becomes permanent. See [[meta-progression]].

## What strain zero costs

Exactly two things:

1. **The held column.** The day's work, gone.
2. **The evening.** No upgrade phase, no spending, no repairs. The player rests. See [[the-night-shop]].

And one thing the fiction charges that the ledger does not: the customer whose machine you failed goes home with it still broken.

> NEURAL STRAIN: ZERO. CONNECTION SEVERED.

The line survives unchanged from the old model. What changed is the consequence: the player wakes at the bench, the shop is still theirs, everything they had banked is still installed, and tomorrow opens normally. **There is no run to lose and no reset of any kind.**

## Why the day and not the file

A roguelike wipes the file. This wipes a session's worth of work, which is enough to make the sixth customer frightening and small enough that failure never costs an evening of play. The old model asked the player to accept losing nine days of progress; almost nothing in the game was worth defending because almost nothing survived. Now everything survives except today.

## Losing a single dive

Unchanged in principle: a loss bills no strain, because a loss already costs the ticket. What is new is that a loss does not end anything. The player can take the next customer with the strain they have left.

## Open questions

- [ ] Does a failed day cost anything that reaches tomorrow: the customer leaving for good, a reputation tick, a lower strain ceiling? The user chose "unbanked plus the evening" and nothing further, so the default answer is no.
- [ ] Is there a partial bank, a way to secure part of the haul mid-day at a cost? Deliberately not proposed: it dulls the wager.
- [ ] Does strain restore to full each morning, or does the evening upgrade phase remain the only source of restoration? If mornings are free, night patches lose their reason to exist.
- [ ] What does the interface show for held versus banked, and where? [[ledger-log]] is the obvious owner.

## See also

- [[sunday]] · [[core-loop]] · [[scoring-and-lifetime-stats]]
