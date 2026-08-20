---
title: The neural deck
status: canon
source: code
owner: user
updated: 2026-08-19
related: ["[[augments]]", "[[ram]]", "[[repairs-and-unlocks]]"]
---

# The neural deck

The rig the player dives with. Everything the player **is** in a duel comes from here: [[ram]] per turn, [[program-tiers|program tiers]], which modes they can cast, and how many boost slots they carry.

It was dad's. The first upgrades are repairs.

> [!info] As built 2026-08-19
> Source: `DeckState` in `save.ts`, the deck shop in NIGHT.SYS (`windows/night.tsx`, costs at `DECK_RAM_COSTS` / `DECK_TIER_COSTS` / `DECK_SLOT_COSTS` in `day-reducer.ts`), slotting in LOADOUT.CFG (`windows/loadout.tsx`), and `duelKitOf(shop, day)` in `save.ts` assembling the dive kit from the slotted deck plus the day's pouch.

## Its currency is salvage

Deck upgrades are not bought with [[credits]]. They are built from parts pulled out of customer machines (`salvageFor` in `content/tiers.ts` scales with the job's tier), which puts the combat layer and the build layer on the same loop: diving is how you get better at diving, and credits stay for the shop.

Salvage earned in a day is **held**, not banked, until the day closes. A deck upgrade is a reason to stop while ahead. See [[day-close-and-banking]].

## Unlocks are permanent, slots are not

The redesign's central swap:

| | Old | New |
|---|---|---|
| Acquiring a boost | the choice, made once per ticket, lost at run end | permanent the moment the day banks |
| Carrying a boost | automatic, up to the bay count | **the choice**, made in [[loadout-cfg]] before a dive |

A boost the player has drafted is theirs forever. The deck has a limited number of slots, so a full catalog does not mean a full loadout: it means a large menu and a small plate. Sleep prunes the slotted list down to what is still owned and fits.

## Why this makes diagnosis matter

Slots are only a decision if the player knows what they are configuring against. That is what ties the deck to the shop: diagnosis depth grows with the bench (`diagDepth` in `content/repairs.ts`), so a better-equipped shop reads more of the intrusion before the dive, and a better read makes the loadout screen a puzzle instead of a preference. See [[scan]] and [[the-counter]].

A player with no diagnosis and eight slots is guessing. A player with a full readout and four slots is playing.

## The 2026-08-16 open questions, answered as built

- **Slots and their curve** live in `DECK_SLOT_COSTS`; the count stays low enough that a mid-game catalog never fits, which is the point.
- **RAM and tiers are outside the slot economy**: flat capacity ladders with their own salvage prices (`DECK_RAM_COSTS`, `DECK_TIER_COSTS`), so slots stay purely about boosts.
- **Modes are not slotted.** The counter triangle is always fully castable; misconfiguration can weaken a dive but never delete a verb.
- **The loadout changes freely between customers.** Committing at intake was considered and rejected: the deck is configured at the bench, any time the player is seated, because re-reading the ticket and re-slotting IS the diagnosis payoff.
- **Salvage has one denomination.** Device types flavor the fiction, not the currency.

## See also

- [[loadout-cfg]] · [[augment-drafts]] · [[meta-progression]] · [[player-skills]]
