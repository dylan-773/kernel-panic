---
title: Home
status: canon
source: none
owner: orchestrator
updated: 2026-08-16
related: ["[[table-of-contents]]", "[[vault-conventions]]", "[[revision-history]]"]
---

# KERNEL PANIC

A turn-based cyberpunk roguelite about inheriting your father's computer repair business and the machine in the back room he never let you touch.

Playable prototype: [kernel-panic.higgsfield.app](https://kernel-panic.higgsfield.app)
Build `0.7.0`, dated 2026-07-29 (`app/src/game/version.ts`).

> [!warning] The game changed shape, and the build has not caught up
> Three things are true here that are not true of the deployed prototype. **The day is the run**: the calendar is open ended, you take as many customers as you dare, and strain zero costs the day's unbanked haul and the evening, not a ten day run. **The game is two environments**: a walkable 2.5D shop plus KP/OS on the bench computer. **The sister is cut**, and the back room was never padlocked; the barrier is software.
>
> Start at [[elevator-pitch]], then [[core-loop]]. Notes marked `draft` describe the design going forward; notes marked `canon` still match the build. See [[design-change-log]] for what was cut and why.

## Start here

| If you want | Read |
|---|---|
| The 60-second version | [[elevator-pitch]] |
| What the game is trying to be | [[design-pillars]] |
| How a day actually goes | [[core-loop]] then [[game-flowchart]] |
| The shop, and how you get to the computer | [[the-shop-floor]] then [[the-bench-transition]] |
| The combat system | [[the-duel]] |
| The story, spoilers included | [[ground-truth]] |
| What the player is taught, and when | [[teaching-system]] |
| How the interface works | [[kp-os]] |
| Who builds this | [[the-dev-crew]] |

## The ten areas

- **[[10-design]]** - pitch, goals, pillars, loop, flowchart, progression.
- **[[20-mechanics]]** - the duel, the kit, augments, the neural deck, the day, economy, difficulty.
- **[[30-content]]** - twelve customers, the shop, journal entries, cutscenes, world.
- **[[40-presentation]]** - the shop floor, KP/OS, the windows, controls, options, art, audio, the UI rulings.
- **[[50-tech]]** - stack, requirements, save and load, determinism, the harnesses.
- **[[60-story]]** - ground truth, characters, the reveal schedule, canon rulings, voice.
- **[[70-teaching]]** - the teaching system, the tutorial, coverage, waivers.
- **[[80-crew]]** - the nine agents, the pipeline, the gates, the plays.
- **[[90-business]]** - marketing, monetization.

## How to read a note

Every note declares what it is in frontmatter. The field that matters most is `status`:

| status | meaning |
|---|---|
| `canon` | Matches shipped code or settled canon. Trust it. |
| `derived` | Read out of the code but never written down before. Trust it, but it was inferred. |
| `draft` | A proposal. Needs your review before it counts. |
| `unwritten` | No decision exists. The note holds the open questions, not the answer. |

Full rules in [[vault-conventions]].

## Open questions

Notes carrying `status: unwritten` are the live edges of the design. Currently:

- [[monetization]] - nothing decided.
- [[palette-generalization-conflict]] - canon ruling 14 reserved this for you; the UI spec answered it anyway, and a second visual domain makes the question larger.

Everything the 2026-08-16 redesign touched is `status: draft` rather than `unwritten`: a position is written down, and it is waiting on your review rather than on a decision. The largest of those are [[the-shop-floor]], [[the-neural-deck]] and [[repairs-and-unlocks]].

## What this vault is not

It does not contain the code. `kernel-panic-site/` is a separate nested repo and is deliberately outside this vault. It also does not contain `pipeline/`, which is per-cycle scratch that gets cleared between production runs. Durable findings from the pipeline are lifted into notes here; the dated verdicts stay where they are.
