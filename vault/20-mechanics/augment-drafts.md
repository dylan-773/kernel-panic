---
title: Augment drafts
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[augments]]", "[[the-neural-deck]]", "[[credits]]"]
---

# Augment drafts

> [!info] Source
> `run-reducer.ts:rollDraft`, `pickAugment`; `SALVAGE_PAY = 25`.

One draft per **cleared job**. How many a day yields is up to the player, and a draft only becomes theirs when the day closes. See [[day-close-and-banking]].

## The roll

`rollDraft(run)` offers **three** cards, deterministic per seed, day and job index.

- Weighted: config 3, boost 1 (`AugmentDef.weight` defaults).
- `requires` gates honoured.
- Never offers something already owned.
- **Slot 0 is always a config while any config is unowned.**

That last rule is the progression guarantee. Modes are the interesting axis, so the game makes sure you are reliably offered one until you have all four drivers.

> [!danger] REVISED IN PROTOTYPE
> The draft replaced a random unlock. A random grant cannot be planned around; a curated three can. The mandatory build stop was cut at the same time, so configuring became optional and diving never waits on it.

## Picking

- A **config** is added, unlocking a mode without switching to it.
- A **boost** is added to the owned pool. It is not installed by picking it: installing is a separate act in [[loadout-cfg]], against a limited number of [[the-neural-deck|deck slots]].

> [!warning] Picking no longer ejects anything
> Under the old model a pick at full bays was a swap, and the ejected augment was gone for good. Augments are now permanent once banked, so a pick is only ever an addition. Swapping is what the loadout screen is for, and it is reversible.

## When the pool runs dry

Salvage instead of a card.

With eighteen augments and permanent unlocks, the pool empties for good rather than per run, and it empties sooner than it used to. That is survivable only because acquisition is no longer where the interest lives. See the cadence problem in [[augments]].

## Teaching

`augment-draft` (order 61) teaches the draft and the cadence on the [[repair-log]] surface. `boost-swap` (62) taught ejection and now has to teach something else: that owning is not installing. See [[coachmarks]].

## See also

- [[repair-log]] - where drafts are presented
