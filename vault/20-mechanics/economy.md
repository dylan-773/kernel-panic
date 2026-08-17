---
title: Economy
status: draft
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[credits]]", "[[the-night-shop]]", "[[neural-strain]]"]
---

# Economy

> [!info] Source
> `run-reducer.ts`, `content/arc.ts:jobPay`, `patch-cells.ts`.

Three currencies, on three different clocks.

| Currency | Scope | Refills | Spends on |
|---|---|---|---|
| [[ram]] | one turn | every turn | rotations, casts, placements |
| [[credits]] | permanent, once banked | per cleared job | repairs, patches, dark pulls |
| **salvage** | permanent, once banked | per cleared job | [[the-neural-deck|deck upgrades]] |
| [[neural-strain]] | one day | +10 at close, +12 per patch | nothing; it is spent **on you** |

Everything except strain crosses from day to day, but only if the day closes. See [[day-close-and-banking]].

## The daily cycle

1. A customer arrives at [[the-counter]]. The job pays `40 + 25 * tier`.
2. Each cleared job rolls an [[augment-drafts|augment draft]], or salvage if the pool is dry.
3. Each cleared job may drop a [[patch-pieces|piece]] and yields parts for the deck.
4. Each win bills [[neural-strain]] for how untidily it was won.
5. Repeat until the player closes, or until strain reaches 0 and the day pays nothing.
6. At close: +10 strain free, and the evening.

## The core tension

Credits buy things on different time horizons, and the split is now sharper than it was:

- **Night patches** - survival now, this day only. Bought with money that could have been a repair.
- **[[repairs-and-unlocks|Repairs]]** - permanent, and the only source of new systems and new story.
- **[[the-darknet|Dark pulls]]** - board material, blind.

Spending on tonight is spending against the shop, and the shop is the only thing that compounds. There is no correct answer, which is the point.

**Salvage is a separate track and does not compete with any of this.** It comes out of dives and goes into the deck, so combat funds combat and the counter funds the building. See [[the-neural-deck]].

> [!warning] Every price in the old economy is indexed on the day number
> `45 + 5 * day` and `25 + 5 * (day - 1)` were written against a nine-day arc and grow without limit on an open calendar. All day-indexed pricing needs re-deriving against something bounded, most likely shop progression.

## Pressures that escalate together

Slag rises while patch drops fall and the par margin tightens, so board material gets scarcer exactly as it gets more necessary. What indexes that escalation is no longer the day. See [[difficulty-ramp]].

## See also

- [[job-pay-and-billing]] · [[scoring-and-lifetime-stats]]
