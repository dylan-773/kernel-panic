---
title: Revision history
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[design-change-log]]", "[[home]]"]
---

# Revision history

> [!info] Source
> `git log` in both repos, plus `app/src/game/version.ts`. The build stamp is `APP_VERSION` / `BUILD_DATE`, shown on the title screen so a playtest screenshot can be matched to a build.

## Document lineage

| Version | Date | Form | Note |
|---|---|---|---|
| Final draft | 2026-07-23 | PDF | Pre-prototype. A different game: Unity, real-time then turn-based node placement, eight ability verbs, Neural Capacity, six agents. |
| v2 | 2026-07-25 | PDF + HTML | Rewritten after the prototype shipped. Every section describes what was built and measured. Nine `REVISED IN PROTOTYPE` boxes record what changed and why. |
| Vault | 2026-08-05 | Obsidian | This. Atomized to one idea per note, expanded to full GDD coverage, and corrected to the split-board duel. |
| Vault | 2026-08-16 | Obsidian | Rewritten around the day-as-run redesign. Notes the new design does not use were deleted rather than archived. |

The v2 PDF is a stale render of the v2 HTML: its token table is missing the Tutorial Agent row and totals about 1,218,600 instead of 1,330,600. Renders are archived outside the repo; markdown here is authoritative.

## Build history

Current build **0.7.0**, dated 2026-07-29. `APP_VERSION` bumps when mechanics change, `BUILD_DATE` on every deploy.

| Date | Build | What landed |
|---|---|---|
| 2026-07-18 | - | Dive-system prototype: four signal-routing puzzles, hub, brand assets. |
| 2026-07-24 | - | Rebuilt as the final-GDD game: turn-based race-to-core duel, ten-day run, KP/OS desktop. |
| 2026-07-24 | - | v2 duel: flood-claim board, Dijkstra AI, floating windows. |
| 2026-07-24 | - | v3: telegraphed attacks, DAD.LOG, login with three save slots. |
| 2026-07-24 | - | v4: sfxr synthesis engine, layered mix, generated music beds. See [[music-and-sound]]. |
| 2026-07-24 | - | v5 kit rework: SCAN / ATTACK / DEFEND, augment drafts, cascade RAM, reach 2. The three-program kit dates from here. |
| 2026-07-24 | - | Scripted tutorial with staged program unlocks. |
| 2026-07-26 | - | Par and strain rotation budget, patch cell economy, four new augments. |
| 2026-07-26 | - | Teaching pass: silent coverage gaps fixed, redundant coachmarks retired. |
| 2026-07-28 | 0.6.0 | Deep balance: shaped welded patch pieces, boost bays, darknet, the kitted sim. |
| 2026-07-29 | 0.7.0 | KP/OS v2 single-phosphor shell. |
| 2026-08-01 | 0.7.0 | Ten approved KP/OS v3 instrument panels integrated, then four regressions fixed, then the v2 hues restored to the theme picker. |
| 2026-08-04 | 0.7.0 | `split-boards`: the duel engine rewritten. See [[split-boards]]. |
| 2026-08-16 | 0.7.0 | Nothing shipped. The design around the duel was rewritten in the vault: the day became the run, the game became two environments, the sister and the padlock were cut. See [[design-change-log]] entries 11 to 14. |

## Where the current work sits

Two gaps between the deployed game and the documented one, and they are different in kind.

**The duel** is written and not deployed. It lives on branch `split-boards`; `main` still ships territory and claiming.

**Everything around the duel** is not written at all. The 2026-08-16 redesign exists only here: no code implements the day as the run, the open calendar, permanent banked progression, the neural deck, the shop floor, or the removal of the sister. Those notes carry `status: draft` and say so individually.

This vault documents the design going forward, not the build. That was already the rule for the duel and it now covers most of the game. [[design-change-log]] records what each change replaced.

## See also

- [[design-change-log]] - every replaced design with the evidence behind it
- [[verification-gate]] - what must pass before any of this deploys
