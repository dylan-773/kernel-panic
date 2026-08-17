---
title: Augments
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[augment-drafts]]", "[[the-neural-deck]]", "[[the-kit]]"]
---

# Augments

> [!info] Source
> `content/kit.ts:AUGMENTS`, `AugmentDef`, `AUGMENT_BY_ID`. Eighteen entries.

Two kinds. Configs unlock a mode on a program; boosts change a rule.

```ts
interface AugmentDef {
  id; name; kind: "config" | "boost"; desc;
  attackMode?; defendMode?;      // configs only
  requires?: { kind: "augment"; id } | { kind: "pouch" };
  weight?;                        // default: config 3, boost 1
}
```

## Configs (4)

Each unlocks one mode. Whether configs are exempt from the [[the-neural-deck|deck slot]] cap is now open: they were exempt from the bay cap, and making modes slotted would turn the counter triangle into a loadout decision.

| Augment | Unlocks |
|---|---|
| [[halt-driver]] | [[arm-halt]] on ATTACK |
| [[siphon-driver]] | [[arm-siphon]] on ATTACK |
| [[clamp-driver]] | [[lock]] on DEFEND |
| [[ward-driver]] | [[ward]] on DEFEND |

> [!warning] A config unlocks a mode, it does not switch to it
> Deliberate. Drafting HALT DRIVER makes ARM: HALT selectable in [[loadout-cfg]]; it does not change what your ATTACK is currently set to. The player chooses when to run it.

## Boosts (14)

| Augment | Effect | Gate |
|---|---|---|
| [[long-arms]] | Reach 2 becomes 4 | |
| [[deep-siphon]] | Siphon traps steal +1 RAM | needs [[siphon-driver]] |
| [[tripwire]] | Halt traps also burn 3 RAM | needs [[halt-driver]] |
| [[cheap-shot]] | First ATTACK each dive is free | |
| [[hot-boot]] | +1 RAM on your first turn | |
| [[tap-line]] | SCAN traces the enemy route for 2 rounds | |
| [[echo-tap]] | +2 RAM whenever your trap fires | |
| [[jam-anchor]] | REDIRECT also freezes what it twists | |
| [[sweep-credit]] | PURGE refunds 1 RAM per trap, max 3 | |
| [[clean-run]] | Zero-strain win banks a patch piece | |
| [[splice-refund]] | Patch placement refunds its RAM | needs a piece in pouch |
| [[first-fault]] | First trap each dive bills 0 strain | |
| [[overtime-clause]] | Cap wins pay 75% not 50% | |
| [[darknet-rate]] | Dark pulls cost 15% less | |

## The requires system

`AugmentRequire` is declarative so the UI, [[manual-txt]] and the sims can all render and verify it:

- `{ kind: "augment", id }` - another augment must already be owned.
- `{ kind: "pouch" }` - the [[the-pouch|pouch]] must hold at least one piece at roll time.

Three augments are gated. This is what stops the draft offering DEEP SIPHON to a player who cannot plant siphons.

## Drift from the v2 GDD

The GDD's augment table lists **BULWARK**, **TAP LINE**, **CARRY CACHE**, **SURGE CACHE** and **SLAG WARD**. Of those only TAP LINE is in the shipped catalog. The shipped set instead includes SPLICE REFUND, FIRST FAULT, OVERTIME CLAUSE and DARKNET RATE, which arrived with the 2026-07-28 deep balance pass.

## The known cadence problem, and what changed about it

The pool exhausts. Eighteen augments against one draft per cleared job means a player sees the whole catalog and then keeps taking salvage forever. Under the old ten-day run this happened around day 6 and killed progression for the hardest third of the arc. Under permanent unlocks it happens sooner and never reverses.

That is only survivable because **acquisition is no longer the interesting decision**. A full catalog against a small number of [[the-neural-deck|deck slots]] means the choice moves from what you get to what you carry, and it stays live forever. The pool running dry stops being the end of progression and becomes the start of the real game.

What it does still need: something for a cleared job to pay once the catalog is complete, and eighteen is probably too few for a game with no last day. Strongest open item for the [[ability-agent]].

## See also

- [[augment-drafts]] - how they are offered
- [[the-neural-deck]] - how many you can carry at once
