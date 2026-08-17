---
title: NIGHT.SYS
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[the-night-shop]]", "[[day-sys]]", "[[darknet-lnk]]"]
---

# NIGHT.SYS

The `upgrade` screen of [[day-sys]] · `windows/night.tsx`

The evening, at the terminal. The deck, and what money can still buy tonight.

## What it carries

- The [[the-neural-deck|deck]]: RAM, tiers, modes and slots, bought with salvage.
- The counter-side spending: night patch, [[the-darknet|dark pull]], weld.
- What the shop still needs, and what it costs. The repairs themselves happen in the room. See [[repairs-and-unlocks]].
- The automatic **+10 [[neural-strain|strain]]** for closing the day.

Full economics in [[the-night-shop]].

## Two-step and reversible

`chooseUpgrade` sets the pick **without ending the night**; `closeNight` commits and refuses without a pick.

> [!info] Why the interface has to work this way
> Everything in the evening trades against everything else, and now across two currencies. Nothing commits until the player goes to bed. See [[the-bedroom]].
>
> The free nightly pick is gone: on an open calendar a free upgrade every night is unbounded growth. See [[the-night-shop]].
>
> `run-sim.ts` asserts both halves: `closeNight` refused without a pick, and choosing does not end the night.

## Teaching

Two coachmarks fire here on first sight:

| Order | id | Teaches |
|---|---|---|
| 70 | `day-upgrade` | the free pick |
| 71 | `night-shop` | `nightPatch`, `darkWebBuy`, `slotBuy` together |

Three purchases under one callout is unusual. It is allowed because they are one decision: what to do with tonight's credits. See [[coachmarks]].

## Panel note

Small surface, and a candidate for **proving the system at low density**. Most of the v3 laws are about managing too much; this panel tests whether they survive having little. See [[law-11-panel-queue]].

## See also

- [[the-night-shop]] · [[economy]]
