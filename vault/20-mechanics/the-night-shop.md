---
title: The night shop
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[economy]]", "[[program-tiers]]", "[[night-sys]]"]
---

# The night shop

> [!info] Source
> `run-reducer.ts:chooseUpgrade`, `closeNight`, `buyPatch`, `buySlot`, `buyDarkPatch`, `craftPatch`; `NIGHT_PICKS`.

The evening. The day is closed, the haul is banked, and the player spends before sleeping.

> [!warning] Forfeited by a failed day
> Reaching 0 [[neural-strain]] costs the evening as well as the haul: no spending, no repairs, no configuring. The player rests. That is half of what a blown day costs, and it is the half players will feel. See [[day-close-and-banking]].

## What the evening is for

| Spend | Currency | Gets |
|---|---|---|
| [[repairs-and-unlocks|A repair]] | credits | a system, a window, and a piece of [[dad]] |
| A deck upgrade | salvage | RAM, a [[program-tiers|tier]], a mode, a slot. See [[the-neural-deck]] |
| Night patch | credits | +12 [[neural-strain]] |
| [[the-darknet|Dark pull]] | credits | one blind [[patch-pieces|piece]] |
| Weld | free | two pieces become their union |

Also free: +10 strain for having closed at all.

> [!warning] The free night pick is gone
> `NIGHT_PICKS` handed out one RAM or tier every single night, which only made sense against a fixed nine-night arc. On an open calendar a free pick per day is unbounded growth. Progression now costs something: credits for the shop, salvage for the deck.

## The evening is reversible until you sleep

The old night was two-step by construction: `chooseUpgrade` set the pick without ending the night, and `closeNight` committed. That property is worth keeping for a bigger surface, not smaller: with repairs, deck upgrades and patches all competing for the same two currencies, nothing should commit until the player goes upstairs.

Sleeping is the commit. See [[the-bedroom]].

## Fiction

Night Patch is a strain suppressant, and the bible is clear it treats the symptom. Buying your way through on patches instead of fixing anything is exactly what [[dad]] did. See [[ground-truth]].

## Teaching

`day-upgrade` (order 70) and `night-shop` (71) both fired on first sight of a single upgrade screen. The evening is now a phase across two places, so both need re-siting, and the repair path needs teaching that the old shop never had. See [[coachmarks]].

## Open questions

- [ ] Where does the evening physically happen: at the bench, walking the shop, upstairs, or all three?
- [ ] Do night patches survive at all, now that credits could be going into permanent repairs instead? They are the only thing left competing with progression, which is an argument for keeping them.

## See also

- [[night-sys]] - the window that hosted this
- [[the-shop-floor]] · [[economy]]
