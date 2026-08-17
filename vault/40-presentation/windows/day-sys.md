---
title: DAY.SYS
status: draft
source: none
owner: ux-agent
updated: 2026-08-16
related: ["[[cutscenes-and-scenes]]", "[[night-sys]]", "[[the-shop-floor]]"]
---

# DAY.SYS

`flow` · inline in `shop-os.tsx` plus `windows/night.tsx`

**The flow window.** The only window whose title changes with its contents, via `windowTitle()`.

> [!warning] Renamed from SHOPFRONT.EXE
> The shopfront is a place now, and a window cannot keep that name while the player can walk into the real one. What this window actually is, and always was, is the terminal's account of where you are in the day.

## What it fronts

| Screen | Title |
|---|---|
| the opening and the win | DAY.SYS |
| the tutorial framing | the tutorial framing |
| each morning | MORNING.LOG |
| the evening | NIGHT.SYS - see [[night-sys]] |
| a back room attempt | BACKROOM.LCK - see [[backroom-lck]] |

## Why one window and not five

Because they are the same object at different times of day. A separate window per state would put five icons on the desktop for one thing that is never open twice at once.

Retitling is also characterful. An operating system whose windows rename themselves as the day progresses is doing the fiction's work.

## What plays here, and what does not

Day lines, short system beats, and the framing around a dive: yes. **The story scenes: no, not any more.** Those play in the shop, because the game now has a room to play them in and a body to play them to. See [[the-shop-floor]] and [[sunday]].

The old rule that there was no cutscene mode and no full-screen takeover was a virtue made out of a limitation. The limitation is gone. What survives of the rule is the instinct behind it: nothing in KP/OS should take the screen away from the player.

Speakers render with portraits (`father.png`, `companion.png`). `sister.png` is deleted with the sister.

## On a fresh save

Auto-opens. It is the only window that opens itself, because at the start it is the only one with anything to say.

## See also

- [[kp-os]] · [[cutscenes-and-scenes]] · [[reveal-schedule]]
