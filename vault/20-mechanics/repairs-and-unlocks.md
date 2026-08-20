---
title: Repairs and unlocks
status: canon
source: code
owner: user
updated: 2026-08-19
related: ["[[the-shop-floor]]", "[[dad-log-archive]]", "[[reveal-schedule]]"]
---

# Repairs and unlocks

**Nothing is bought that could be repaired instead.** Every system the player unlocks was already in the shop, broken, left by [[dad]]. The player fixes it, the window comes alive, and the thing they had to move to reach it is an artifact of him.

That is why the pitch says upgrading the shop is how you learn who your father was. One act does three jobs at once.

> [!info] As built 2026-08-19
> Source of truth for the table: `REPAIRS` in `content/repairs.ts` (ten repairs; ids, credit costs, stations, artifacts and recovered sectors all live there, never retyped here). Purchases happen in the evening, at the object, and each repaired station is visibly repaired in the room. See [[the-shop-floor]].

## Every repair carries three payloads

| Payload | Example |
|---|---|
| **A mechanic** | the solder bay lets you weld [[patch-pieces|pieces]] (`unlocks` in `RepairDef`) |
| **A window** | [[solder-bay]] stops being dead |
| **An artifact** | the lesson he taught you at that bench (`artifactId`), or a recovered sector playback (`sector`) |

A repair missing the third payload is an upgrade, not a repair. The one deliberate exception class: staged repairs of one station (`stageAfter`) may put the artifact on one stage and the sector on another. See [[ruling-21-artifact-payload-channels]] for the third channel (a station's own firstRead vignette) and for the one shipped repair the exception does not reach: `diagBench3` carries neither an `artifactId`, nor a `sector`, nor a firstRead vignette of its own (it inherits `diagBench`'s station-level copy, written for `diagBench1`'s sealed envelope). That stage is an upgrade under this rule as shipped.

## The ten, by station

`REPAIRS` covers eight physical stations: the solder bay, the onion router, the diagnostic bench (three stages, `diagBench1..3`, each deepening the intake read per `diagDepth`), the power box, the shelves (`pouchCapFor` adds a pouch slot), the bottom drawer, the ledger terminal, and the drive recovery rig.

## Order does not matter

The player chooses what to fix. Prices are flat and never day-indexed; the only ordering is `stageAfter` within a single station's stages, which restores no cross-station order. No artifact assumes another has been read, and the only hard ceiling is that nothing before a win on [[the-machine]] states what is inside it. See [[reveal-schedule]].

## Where a repair is read

At the object. The first read happens in the room, standing over the thing that was hiding it: the artifact opens as a first-read panel, and a recovered sector plays back there too. [[dad-log-archive|DAD.LOG]] keeps every artifact for re-reading.

## The 2026-08-16 open questions, answered as built

- **Ten repairs**, credits only, one evening purchase each. No materials, no day cost.
- **Flat and expensive won**: no prerequisite chains except stages of one station.
- **One repair is nearly cosmetic by design**: the power box fixes the shop's own lights and nothing else, which is the point its artifact makes.
- **The back room has no repairs of its own.** Its gate is [[sunday]], not money.

## See also

- [[the-neural-deck]] · [[the-night-shop]] · [[the-shop]]
