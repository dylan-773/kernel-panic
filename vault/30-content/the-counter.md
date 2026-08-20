---
title: The counter
status: canon
source: code
owner: user
updated: 2026-08-19
related: ["[[customers]]", "[[inbox]]", "[[the-shop-floor]]"]
---

# The counter

Where the work comes from. A customer walks in, describes what is wrong in the words a person uses, and hands over a device. The player takes the job or does not.

> [!info] As built 2026-08-19
> Source: arrivals and intake in `game-shell.tsx` and `day-reducer.ts` (`genCustomer`, `acceptJob`, `declineJob`); the intake dialog in `room-ui.tsx`; the walk-in choreography in `src/game/overworld/scene.ts`.

## Intake is a scene, not a list

The old design put three tickets on a board and asked which order to take them in. Intake is now one person at a time, in the room, and the question is no longer order but **whether to take this one at all**. That is the day's real decision and it happens face to face. See [[day-close-and-banking]].

The twelve profiles survive unchanged and get better here: the One Wow line each customer carries was always written to be spoken. See [[customers]].

## What the counter knows and what the terminal knows

| At the counter | At the terminal |
|---|---|
| who they are, what they say is wrong, what they will pay | the threat tier, the dominant mode, the honest tell |
| the decision to accept | the decision of how to fight |

The complaint is a person's account and can be vague, wrong or embarrassed. The readout is a machine's account and is honest. Keeping them separate is what makes the diagnostic bench worth repairing: a better bench lights more of the intake's dead rows, each of which names the repair that would light it. See [[scan]] and [[repairs-and-unlocks]].

## Accepted work goes to the queue

[[inbox]] keeps its job. It stops being where work appears and becomes the record of the one ticket the player holds, plus the readout and the DIVE button.

## The 2026-08-16 open questions, answered as built

- **Customers are figures in the room.** Each walks in through the door as a sprite, crosses to the counter, and waits there; the intake dialog carries the portrait and the spoken line.
- **They wait.** A waiting customer never leaves on their own; the pressure is that arrivals keep coming only while the shop is open, so an ignored counter is forgone income, not a penalty event.
- **Declining is free** and the customer walks out. The wager stays in accepting, never in a social tax.
- **One at a time, one ticket at a time.** A new arrival waits until the counter is clear; the player carries at most one accepted job, and it must resolve today. Held jobs never cross a sleep.
- **Arrival is a timer** while the shop is open (first arrival fast, then spaced), plus the day's arrival count folds into the shop's visit tally at close, so repeat business is counted without mutating the shop mid-day.
- **Twelve regulars, repeating.** `genCustomer` deals from the twelve profiles deterministically, varying the tier and the spoken quote per visit.

## See also

- [[the-shop-floor]] · [[job-pay-and-billing]] · [[world-overview]]
