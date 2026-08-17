---
title: Game flowchart
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[core-loop]]", "[[save-and-load]]", "[[title-and-start-screen]]"]
---

# Game flowchart

> [!warning] status: draft
> The shipped state machine is `save.ts:RunScreen` and the `run-reducer.ts` transitions, which still describe the ten-day run. What follows is the machine the redesign needs.

## Boot to the first day

```mermaid
flowchart TB
  BIOS[BIOS boot] --> LOGIN[Login: 3 save slots]
  LOGIN --> SHOP[The shop floor]
  SHOP -->|new save only| TI[tutIntro]
  TI --> TUT[the tower: tutorial dive]
  TUT --> TO[tutOutro: it shuts the door]
  TO --> DO[dayOpen]
  SHOP -->|existing save| DO
```

## The working day

```mermaid
flowchart TB
  DO[dayOpen] --> FLOOR[shop floor]
  FLOOR -->|greet| CTR[counter: take the job?]
  CTR -->|decline| FLOOR
  CTR -->|accept| FLOOR
  FLOOR -->|sit at bench| OS[KP/OS]
  OS -->|analyze, configure| DU[duel]
  DU -->|duelFinished| CHK{strain > 0?}
  CHK -->|no| BUST[day lost: haul and evening forfeit]
  CHK -->|yes| RES[result: pay, strain, salvage, draft]
  RES --> FLOOR
  FLOOR -->|go upstairs| CLOSE[close: bank the haul, +10 strain]
  CLOSE --> EVE[evening: repairs, deck, shop]
  EVE -->|sleep| NEXT{day of week}
  BUST -->|sleep| NEXT
  NEXT -->|working day| DO
  NEXT -->|Sunday| SUN[Sunday]
```

## Sunday

```mermaid
flowchart TB
  SUN[Sunday] --> SCENE[any scheduled scene]
  SCENE --> CH{attempt the back room?}
  CH -->|no| SLEEP[sleep]
  CH -->|yes| FD[back room dive]
  FD -->|win| FW[the machine opens]
  FD -->|lose| SLEEP
  FW --> SLEEP
  SLEEP --> DO[dayOpen, Monday]
```

## What changed in the machine

- **`runEnd` is deleted.** Strain 0 no longer terminates anything; it routes to a lost day and then to sleep like any other night.
- **`finalePre` becomes a Sunday branch** rather than a day 10 replacement for the job board, and a win returns to Monday instead of ending the game.
- **The day has no fixed length.** There is no "3 tickets done?" test, only the player choosing the stairs.
- **The shop floor is a state**, and it is the state the player returns to after everything.
- `build` was already vestigial: the cut mandatory build stop. See [[design-change-log]].

## Two things the diagram does not show

**Refresh is a safe abort**, and that is now a problem worth solving rather than a feature: reloading out of a dive the player is losing would protect the day's haul. See [[save-and-load]].

**The evening does not commit until you sleep.** Everything in it trades against everything else, so nothing is final while the player is still standing up. See [[the-night-shop]].

## See also

- [[core-loop]] · [[kp-os]]
