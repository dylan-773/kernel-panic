---
title: Day close and banking
status: canon
source: code
owner: user
updated: 2026-08-19
related: ["[[neural-strain]]", "[[meta-progression]]", "[[the-night-shop]]"]
---

# Day close and banking

**The day is the run.** Not the ten days, not the save file. One working day, opened at the counter and closed by choice, is the unit that can be lost.

> [!info] As built 2026-08-19
> Source: `closeShop` and the bust branch in `day-reducer.ts`; the held/banked split is the `ShopState` / `DayState` boundary in `save.ts`. The bust property (a busted day leaves the shop layer untouched) is gated by `run-sim.ts`, see [[verification-gate]].

## The decision

Customers arrive until the player closes the shop. Nothing forces the day to end and nothing forces it to continue, so every customer after the first is a wager: this job's pay against everything already earned today.

The wager is legible because [[neural-strain]] is visible and the intake read is honest. A player at 22 strain looking at a tier 4 device knows exactly what they are being offered.

## Banked, held, lost

| State | What is in it |
|---|---|
| **Banked** | everything the player owns at the start of the day: shop repairs, deck upgrades, unlocked boosts, credits, salvage |
| **Held** | everything earned since the day opened: the day's pay, salvage, [[patch-pieces|pieces]] pulled today |
| **Lost** | the held column, if strain reaches 0 |

Closing the day moves held into banked, and closing happens **at the stairs**: going up while the shop is open is the commit. The stairs' prompt states the trade on every visit and the confirm itemizes the haul. That is the whole ritual, and it is the only way progress becomes permanent. See [[meta-progression]].

## What strain zero costs

Exactly two things:

1. **The held column.** The day's work, gone. (`DayState` is deleted, never merged.)
2. **The evening.** No upgrade phase, no spending, no repairs. The player rests. See [[the-night-shop]].

And one thing the fiction charges that the ledger does not: the customer whose machine you failed goes home with it still broken.

> NEURAL STRAIN: ZERO. CONNECTION SEVERED.

The line survives unchanged from the old model. What changed is the consequence: the player wakes, the shop is still theirs, everything they had banked is still installed, and tomorrow opens normally. **There is no run to lose and no reset of any kind.**

## Why the day and not the file

A roguelike wipes the file. This wipes a session's worth of work, which is enough to make the sixth customer frightening and small enough that failure never costs an evening of play. The old model asked the player to accept losing nine days of progress; almost nothing in the game was worth defending because almost nothing survived. Now everything survives except today.

## Losing a single dive

Unchanged in principle: a loss bills no strain, because a loss already costs the ticket. What is new is that a loss does not end anything. The player can take the next customer with the strain they have left.

## The 2026-08-16 open questions, answered as built

- **A failed day reaches tomorrow with nothing.** No reputation tick, no leaving customer, no lowered ceiling. "Unbanked plus the evening" shipped exactly.
- **No partial bank.** Securing half the haul mid-day would dull the wager; the only mid-day hedge is closing early, which is the wager working.
- **Mornings restore nothing.** Sleep adds `SLEEP_REGEN = 10` strain (`day-reducer.ts`) and night patches buy more in the evening, so restoration stays a priced decision rather than a free reset.
- **Held versus banked lives on the room HUD** (the HELD chip beside CR) and on the repair receipt in REPAIR.LOG, which marks the day's pay as held until close.

## See also

- [[sunday]] · [[core-loop]] · [[scoring-and-lifetime-stats]]
