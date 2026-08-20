---
title: Sunday
status: canon
source: code
owner: user
updated: 2026-08-19
related: ["[[the-machine]]", "[[cutscenes-and-scenes]]", "[[day-close-and-banking]]"]
---

# Sunday

Six working days, then the shop is closed. The week is the only fixed structure left in a calendar that otherwise runs forever.

> [!info] As built 2026-08-19
> Source: `weekdayOf`/`isSunday` in `save.ts`; the sunday phase and `attemptedBackroom` in `day-reducer.ts`; scene scheduling via `ShopState.sundayScenes` in `game-shell.tsx`.

## What Sunday is for

- **The back room.** The only day the machine can be attempted. See [[the-machine]].
- **Story.** The major beats play here as scenes, because Sunday is the only time the player is not mid-transaction. See [[cutscenes-and-scenes]].
- **The evening systems without the day.** Repairs, the darknet and the deck are all reachable on a Sunday, so a Sunday not spent on the machine is a maintenance day, not an empty one.

No customers arrive. Nothing is earned. Sunday costs a day of income by existing, which is what makes spending it on the machine a real decision rather than a free retry.

## Why the machine is Sunday-only

Three jobs at once:

1. **It prices an attempt.** An attempt costs the day, not a fee. That is legible without a number.
2. **It paces the story without gating it.** The player cannot rush the back room, because they cannot reach it more than once a week.
3. **It gives the week a shape.** Six days of work pointing at one day that is about the thing the game is actually about.

## The machine always fights

There is no readiness check and no refusal. The player may attempt it on the first Sunday and lose badly, and that is a legitimate way to play. Difficulty is the only gate.

This matters for the story: because attempts are never blocked, the reveals can never assume the player has not won yet. See [[reveal-schedule]].

## After it opens

The game continues. Monday arrives, customers arrive, the shop still needs work. Beating the machine is the game's largest reward and not its ending. See [[the-finale-encounter]].

## The 2026-08-16 open questions, answered as built

- **A Sunday off the machine** is spent on the shop: every evening system is open all day, and the scheduled scene (if one is due) plays. The day is never a bare click-through.
- **The week starts on Monday** (`WEEKDAYS` in `save.ts`), and the weekday sits on the room HUD next to the day number, not only in the terminal.
- **A failed attempt resolves like any lost dive**: no strain bill, and `attemptedBackroom` marks the week's attempt spent. The cost was the Sunday.
- **Scenes are scheduled by Sundays elapsed** (`sundayScenes` against `floor(day/7)`), so story cadence is steady regardless of repair order; artifacts stay repair-keyed separately. See [[ruling-16-reveals-are-upgrade-keyed]].

## See also

- [[day-close-and-banking]] · [[repairs-and-unlocks]] · [[backroom-lck]]
