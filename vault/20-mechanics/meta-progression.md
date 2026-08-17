---
title: What carries
status: draft
source: none
owner: user
updated: 2026-08-16
related: ["[[day-close-and-banking]]", "[[the-neural-deck]]", "[[repairs-and-unlocks]]"]
---

# What carries

> [!warning] status: draft
> This note used to be `status: unwritten` and asked what should carry between runs. The 2026-08-16 redesign answered it by changing what a run is.

**Almost everything carries.** The question the old design could not answer was what should survive a run; the new design makes the day the run, so the answer is: everything the player closes the day with.

## The three lifetimes

| Lifetime | Holds | Ends |
|---|---|---|
| **The dive** | RAM this turn, banked cascade, board state | when you unplug |
| **The day** | pay, salvage, pieces and augments earned today, strain | at close, into permanent, or at strain 0, into nothing |
| **Permanent** | shop repairs, deck upgrades, the unlocked augment pool, credits, story, taught flags, lifetime stats | never |

That middle row is the whole design. See [[day-close-and-banking]].

## Why this is not a roguelike with extra steps

A roguelike resets the file and keeps a trickle. This keeps the file and risks a session. The player is never rebuilding, they are always building, and the only thing that can be taken from them is the work they have not put away yet.

It also fixes what the old model got backwards. Under runs, nothing the player earned was worth defending, because it was all leaving anyway. Now defending the haul is the game.

## What this does to the build

Permanent unlocks change what a build **is**. Under runs, a build was the set of augments you happened to draft. Now the catalog fills up and stays full, so the build is the subset you slot before a dive. Acquisition retires as a decision and configuration replaces it. See [[the-neural-deck]].

## Story is not a currency any more

The old design paid the story out for losing, which meant it also carried between runs, which made it the de facto meta progression. That is gone. Story is paid out for **repairing the shop**, which the player does with banked money, which they only have if they closed their days. See [[repairs-and-unlocks]].

## Open questions

- [ ] Does anything at all survive a failed day besides what was already banked? Currently no.
- [ ] Is there a New Game Plus, and if so what carries into it? After [[the-machine]] opens, play continues, so the game may never need one.
- [ ] Does the save schema need a third object, or is the old `MetaState` simply promoted to hold nearly everything? See [[save-and-load]].

## See also

- [[economy]] · [[scoring-and-lifetime-stats]] · [[design-change-log]]
