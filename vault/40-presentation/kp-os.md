---
title: KP/OS
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[ui-rulings]]", "[[design-pillars]]", "[[title-and-start-screen]]"]
---

# KP/OS

> [!info] Source
> `components/os/shop-os.tsx` (provider and desktop), `wm.tsx`, `desk.tsx`, `boot.tsx`, `login.tsx`, `icons.tsx`, `kp-ui.tsx`.

The shop terminal's retro pixel desktop. **The interface is the core of the game.** Not a frame around it, and not the whole of it either.

## Why this is a design pillar and not a skin

There is no menu layer. Every system the player operates, they operate through a window on this terminal: the job queue, the kit, the archive, the books, the dive itself. The player is a technician at a bench, looking at a terminal, which is exactly what the fiction says they would be doing.

What is new is that the bench is in a room. The shop is a place the player walks, and KP/OS is the machine they sit down at. See [[the-shop-floor]] and [[the-bench-transition]]. The division is clean and worth stating once:

| Layer | Owns |
|---|---|
| The shop floor | greeting customers, intake, physical repairs, reading what a repair turned up, sleeping, the back room door |
| KP/OS | diagnosis, the loadout, the dive, the books, the archive, crafting, the darknet |

Anything that is a **decision about a machine** happens at the terminal. Anything that is a **thing in the world** happens in the room. When a system has both halves, it exists twice at two fidelities: the solder bay is a bench you repair and a window you work in. That doubling is the point, not a duplication to be resolved.

## The shell

- **BIOS boot** into **login**, three deletable save slots, one save per slot.
- **Desktop** with icons, draggable windows, taskbar clock showing the in-game day and, since [[sunday]] is different from the rest, the day of the week.
- **The dive** is the only full-screen KP/OS surface. See [[dive-exe]]. The shop floor is not a window at all.
- **Refresh is a safe abort**, never a loss. See [[save-and-load]].

## The window manager

`WIN_DEFS` in `shop-os.tsx` declares the window set. `wm.tsx` handles dragging, focus and z-order.

Not every window exists from the start. [[repairs-and-unlocks]] gates several of them on a physical repair: no onion router, no [[darknet-lnk]]. A window the player has not unlocked is better shown dead than hidden, for the same reason the solder bay shows its illegal partners as dead cells.

Windows are genuinely tiled and genuinely movable, which is why the 700px height ceiling exists: a window that fills the desk cannot be tiled, and untileable windows are what made window management feel rough. See [[law-3-fluid-and-the-height-ceiling]].

## Themes

`THEMES` offers three hues (LAVENDER, MAGENTA, PHOSPHOR) and two schemes (NERV, TOKYO NIGHT). Hues are the v2 single-phosphor system; schemes are the v3 role-token remap. Both ship. See [[player-options]] and [[law-1-colour-is-roles]].

## The glass

`Glass()` renders six CRT layers over the stage: `g-scan`, `g-mask`, `g-bloom`, `g-spec`, `g-vig`, `g-bezel`. Flat, never curved. See [[law-6-the-tube]].

## The strain alarm

`STRAIN_ALARM_AT = 35`. Below that the desktop itself arms an alarm state. The operating system reacts to the player's body, which is the clearest single expression of the whole conceit.

It now has a second venue. The alarm is also the moment the day's haul is at risk, so the shop floor has to carry it too when the player stands up. See [[day-close-and-banking]].

## kp-ui.tsx

The shared instrument-panel primitives, not a window: `Ticks`, `Nodes`, `Stripe`, `Ruler`, `Hero`, `DataRows`, `PipRow`, `DiamondRow`, `Chip`, `SegMeter`, `HatchBar`, `Btn`, `PhotoCell`, `PX_ICONS`, `PxIcon`, `KpMark`, `KpLockup`.

## See also

- [[hud-and-ui-design]] · [[ui-rulings]]
