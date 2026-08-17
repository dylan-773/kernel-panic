---
title: Player inventory
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[the-pouch]]", "[[the-neural-deck]]", "[[loadout-cfg]]"]
---

# Player inventory

Three containers, all capped. What is in them survives every day the player closes, and only what was earned today is at risk. See [[day-close-and-banking]].

## The pouch

Up to 5 [[patch-pieces]], held as shaped 4-bit masks. Shape matters as much as count, because a piece cannot be rotated to fit. See [[the-pouch]].

Managed in [[solder-bay]], where two pieces can be welded into their union.

## Deck slots

A limited number of slots on [[the-neural-deck]], holding boost [[augments]]. Owning an augment and carrying it are different things: the owned pool is permanent and grows without limit, the slots do not. Reconfiguring is free and reversible.

## The kit

Not really an inventory: three programs that are always present, each with a tier and a selected mode. Configured in [[loadout-cfg]]. See [[player-skills]].

## What there is not

No consumables beyond patch pieces, no equipment slots, no weapons, and no stash. Salvage is a currency rather than an inventory: it is a number, not a bag of parts. See [[meta-progression]].

## Why so small

Everything the player owns has to be readable **during a turn**, on one screen, under a hard 700px height ceiling. See [[law-3-fluid-and-the-height-ceiling]]. An inventory that needs scrolling would break the interface law before it broke the design.

## See also

- [[solder-bay]] · [[loadout-cfg]]
