---
title: Save and load
status: canon
source: code
owner: orchestrator
updated: 2026-08-19
related: ["[[day-close-and-banking]]", "[[title-and-start-screen]]", "[[meta-progression]]"]
---

# Save and load

> [!info] Source
> `game/save.ts`. `SLOT_COUNT = 3`.

## Three slots

Each slot is a separate player. Progress is per slot, so a second slot is genuinely fresh and will be taught everything again.

Slots are **deletable from the login screen**. See [[title-and-start-screen]].

## Three objects, three lifetimes

> [!info] As built 2026-08-19
> The 2026-08-16 "second option is safer" ruling shipped: the day is a discardable envelope, so a failed day is a **delete**, never a diff.

Keys per slot: `kernel-panic-s<N>-meta-v2`, `-shop-v1`, `-day-v1`.

| Object | Holds | Lifetime |
|---|---|---|
| `MetaState` | `machineOpened`, `sound`, `music`, `taught`, `stats` | forever |
| `ShopState` | credits, salvage, repairs, deck (owned boosts + slots), day number, visit counts, `sundayScenes` | forever; written only by `closeShop`, `sleep`, and evening purchases |
| `DayState` | phase, held pay and salvage, pouch, strain, ticket, arrivals, `attemptedBackroom` | until close (folds upward) or strain 0 (deleted) |

`duelKitOf(shop, day)` assembles the dive kit from the slotted deck plus the day's pouch, so nothing duel-facing lives in two places. `migrateLegacySave` deletes the retired `-run-v3` key; the run schema does not migrate, it dies.

## There are no checkpoints

No save-scumming a day, no restore point, no continue. A day either closes or it does not. There is exactly one commit point for the haul: closing the shop at the stairs. See [[day-close-and-banking]].

## Refresh is a safe abort, and it now costs correctly

> [!info] Transient screens are never resumed into
> Reloading mid-dive puts the player back on the shop floor, not into a half-serialized duel. The dive's job is lost; the day and its held haul survive, because `DayState` is written at phase boundaries, not mid-duel.
>
> The 2026-08-16 worry (refresh as a free escape from a losing dive) resolves the day-is-the-run way: escaping a dive keeps the held haul but the strain already spent stays spent, the ticket is gone, and the day's arrivals keep counting. Refresh is a worse deal than standing up.

## The migration ladder

Real, and load-bearing, because saves survive across builds:

- Legacy `-run-v3` saves are deleted on first load; meta survives.
- Unknown augment ids are **dropped**, so removing a boost from the catalog does not brick an old save.
- Transient screens are never resumed into.

`run-sim.ts` exercises long careers, including busted days, and asserts the bust property: a failed day leaves `ShopState` bit-identical. See [[verification-gate]].

## Two things worth knowing

**localStorage is per port.** A save made against `bun run preview` is not the save made against `dist/server/server.js`. This has confused more than one playtest.

**There is no cloud save and no account.** Clearing site data destroys everything.

## See also

- [[technical-requirements]] · [[scoring-and-lifetime-stats]]
