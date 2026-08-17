---
title: Design change log
status: canon
source: lore
owner: orchestrator
updated: 2026-08-16
related: ["[[revision-history]]", "[[split-boards]]"]
---

# Design change log

Every entry is a design that was replaced, with the evidence that forced it. The v2 GDD carried the first nine as `REVISED IN PROTOTYPE` boxes; 10 is the split-board rewrite, and 11 to 14 are the 2026-08-16 redesign.

This is the most reusable page in the vault. Each entry is a mistake already paid for. It is also, since retired notes are deleted rather than archived, the only surviving record of the models below. See [[vault-conventions]].

## 1. Mandatory build stop, cut

> [!danger] REVISED IN PROTOTYPE
> The draft made kit configuration a required screen between the job board and the dive. It became a speed bump: players clicked through it unchanged. It is now an optional floating window ([[loadout-cfg]]) with its own dive button, so configuring is a choice and diving is never gated on it.

Random augment unlock also became a curated draft of three. See [[augment-drafts]].

## 2. Draw-bag placement, replaced by rotation

> [!danger] REVISED IN PROTOTYPE
> The draft dealt pieces from a bag and had the player place them. Placement made every board a fresh puzzle with no read-ahead. The shipped duel pre-deals a scrambled grid and gives the player exactly one verb on it: rotate. See [[rotation]].

## 3. Neural Capacity, cut

> [!danger] REVISED IN PROTOTYPE
> Two resources competing for the same decision. Neural Capacity was removed entirely and [[patch-pieces]] took the slot, because a consumable that changes the board reads more clearly than a second abstract meter. Surviving resources: [[neural-strain]], [[ram]], [[credits]], [[patch-pieces]].

## 4. Eight verbs and about twenty-four variants, replaced by three programs

> [!danger] REVISED IN PROTOTYPE
> The largest single change. The draft's ability catalog was unreadable at speed. The shipped kit is exactly three programs, always present, always 1 RAM, once per turn each: [[scan]], [[attack]], [[defend]]. Depth moved into modes and tiers rather than count. See [[the-kit]].

## 5. Immediate cascade RAM, replaced by banking

> [!danger] REVISED IN PROTOTYPE
> Paying cascade RAM inside the turn that earned it collapsed duels to about 1.5 rounds across a 200-seed sweep: one good chain ended the game. Cascade RAM now banks into the following turn. See [[cascades-and-surge]].

## 6. Tier-0 tutorial config, lost its first playtest

> [!danger] REVISED IN PROTOTYPE
> Teaching by a weakened opponent did not read as teaching, it read as a bad fight. The shipped tutorial boots programs OFFLINE and unlocks them by lesson beat, and makes unwinnability structural rather than statistical: touching the core slams every port. See [[the-tutorial]].

## 7. Unity, cut

> [!danger] REVISED IN PROTOTYPE
> Along with the purchased asset packs. The game ships as a browser app. See [[technology-stack]].

## 8. The agent pipeline stopped being a proposal

> [!danger] REVISED IN PROTOTYPE
> Every loop in the crew architecture was executed by hand at least once during the build before it was written down as a system. See [[the-dev-crew]].

## 9. Determinism became load-bearing

> [!danger] REVISED IN PROTOTYPE
> Seeded generation was originally a convenience. It became the thing that makes balance claims checkable at all: 200 seeds a day, paired kitted and kit-less passes, and a tutorial that must post zero wins. See [[determinism-and-seeds]].

## 10. Territory and claiming, cut (2026-08-04)

> [!danger] REVISED IN PROTOTYPE
> The shared board made defence mean holding ground, and holding ground is not interesting to play. Each side now owns a grid. Progress splits into two layers: `built` is permanent, `power` is cuttable. Defence now means anti-trap and anti-redirect rather than occupation.
>
> Two win conditions died with it: `SEVERED` and gridlock. Removing them also killed a bug class where an `Infinity` blindspot in the planner lost dives that were still winnable. Under SEVERED, a planner reporting `Infinity` for a route that existed did not merely mislead the AI, it ended a still-winnable dive in an instant loss.

What it was: one shared grid, both sides flooding from opposite entries, lighting a chain **claimed** it, and claimed territory was impassable to the enemy. Claims were permanent, so defence meant occupation. Once you had a defensible shape the correct play was to keep it, and keeping it is not a move. The intended feel was a sprint with sabotage; what it produced was a slow squeeze.

| Old | New |
|---|---|
| one shared grid | two grids, `DuelState.boards[side]` |
| claiming, permanent and exclusive | `built`, permanent but non-exclusive |
| impassability as defence | anti-trap and anti-redirect |
| SEVERED, gridlock | removed; only `goal`, `cap`, `seal` remain |
| `MAX_OPENING_CLAIM` | `MAX_OPENING_BUILT` |

See [[split-boards]] for the current model and [[built-and-power]] for the two-layer model that carries the load claiming used to. Still asserting the dead model outside this vault: `lore/bible.md`, `tutorial/ledger.md`, the `gridlockWin` vestige in `run-reducer.ts` and `save.ts`, and the `gridlockChip` waiver in `teaching.ts`.

## 11. The game was only an operating system (2026-08-16)

> [!danger] REVISED IN PROTOTYPE
> The whole game was KP/OS, and the pillar said so: no world, no camera, no character. It bought real economy and cost the player a place to stand. The game is now two environments, a walkable 2.5D shop plus the terminal on the bench in it, and the pillar reads "the interface is the **core** of the game".
>
> The change pays for itself three ways: progress becomes physically visible, story is read where it was found, and the shop's condition is legible without opening a screen. It costs environment art, a camera and a character rig, none of which the art pipeline can currently produce.

See [[the-shop-floor]] and [[the-bench-transition]].

## 12. The ten-day run, replaced by the day (2026-08-16)

> [!danger] REVISED IN PROTOTYPE
> A run was ten days of three tickets, and strain zero ended all of it. Almost nothing was worth defending because almost nothing survived, and the arc's last third had no build progression left at all: 18 augments against up to 27 cleared tickets meant salvage instead of a card from roughly day 6.
>
> The day is now the run. The calendar is open ended, the player closes the shop when they choose, and strain zero costs the day's unbanked haul and the evening. Everything banked is permanent, so acquisition stops being the interesting choice and loadout configuration becomes it.

See [[day-close-and-banking]], [[meta-progression]] and [[the-neural-deck]]. The ten-row `DAY_CONFIGS` table went with it; [[difficulty-ramp]] is what replaces it.

## 13. Losing as the delivery mechanism, cut (2026-08-16)

> [!danger] REVISED IN PROTOTYPE
> Every reveal was keyed to `runCount`: each failed run released another fragment of the father. With no runs to fail, the key does not exist. Reveals are now hand-authored per shop repair, so the thing you fix is the thing that turns him up.
>
> Upgrade order is the player's, so the knowledge ladder is gone with it. Every artifact now stands alone under a single ceiling: nothing before a win states what is inside the machine.

See [[ruling-16-reveals-are-upgrade-keyed]] and [[repairs-and-unlocks]].

## 14. The sister and the padlock, cut (2026-08-16)

> [!danger] REVISED IN PROTOTYPE
> Rhea held the counter, the virus theory and the doubt arc that measured the player's progress toward the truth. She is cut. The player works both jobs, holds the assumption himself, and has to argue himself out of it, which is harder to write and lands harder. Her three load-bearing beats were re-homed rather than lost: the power-bill arithmetic became a findable artifact, the renunciation became a [[sunday]] scene, and the game's closing line was re-authored for someone alone.
>
> The padlock went at the same time and for a different reason: the barrier was always software. The room is simply open.

See [[ruling-17-the-players-own-assumption]] and [[ruling-15-the-seal-is-software]].

## Still open

- [[palette-generalization-conflict]] - canon ruling 14 scoped multi-hue to one window and reserved generalization for the user; the UI spec generalized it anyway, and a second visual domain widens the question.
- [[monetization]] - nothing decided, and the demo slice can no longer be described as the first three days.
