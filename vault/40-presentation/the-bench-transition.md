---
title: The bench transition
status: canon
source: code
owner: user
updated: 2026-08-19
related: ["[[kp-os]]", "[[the-shop-floor]]", "[[law-6-the-tube]]"]
---

# The bench transition

Sitting down at the bench is how the player enters KP/OS, and standing up is how they leave. It is the seam between the game's two domains, and it is crossed more often than any other interaction in the game.

## Why it is load-bearing

Every dive, every diagnosis, every purchase at the terminal, every look at the archive costs one transition each way. A transition that is one second too long is the thing players will remember about the game.

So: **fast, skippable, and the same every time.** It is not a cutscene.

> [!info] As built 2026-08-19
> The camera zooms into the bench monitor (a sub-half-second tween in `scene.ts`), the KP/OS desktop fades up over the stage, and the glass arrives with it. Standing up is the same move reversed, triggered by the desktop's STAND UP control. Source: the bench-seat path in `src/game/overworld/scene.ts` plus the seated state in `game-shell.tsx`.

## The glass is the transition

The CRT glass is not a filter over the game, it is the physical surface of this terminal. It does not exist in the room, and it arrives as the player sits. That gives three things for free:

1. **A diegetic answer to a law-scoping problem.** [[law-6-the-tube]] governs KP/OS and stops at the doorway, rather than the whole game being seen through a tube for no in-fiction reason.
2. **A meaningful CRT OFF.** The accessibility option removes the glass from the terminal without flattening the shop.
3. **A read on where you are.** Glass means you are at the machine. No glass means you are in the room.

## The 2026-08-16 open questions, answered as built

- **The dive stays in the chair.** DIVE.EXE is full screen inside the terminal; the player is deeper in, not elsewhere. Standing up is only ever a shop-floor return.
- **The player is never yanked out.** A customer arriving while seated raises the COUNTER chip on the desktop's HUD; the terminal is always exited deliberately.
- **Standing up costs the windows nothing.** Window state lives in React above the scene; the desktop resumes where it was left.
- **What the room offers without the chair**: the strain number, the clock, the counter state and the held haul, on the room HUD. Nothing that is a decision about a machine.

## See also

- [[kp-os]] · [[the-shop-floor]] · [[game-controls]]
