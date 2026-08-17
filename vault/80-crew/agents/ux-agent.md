---
title: UX Agent
status: canon
source: code
owner: orchestrator
updated: 2026-08-16
related: ["[[ui-rulings]]", "[[music-and-sound]]", "[[art-lead]]"]
---

# UX Agent

KP/OS layout, feel, animation and **sound**. Sonnet, `maxTurns` 25, `memory: project`. Loads `kp-contracts` and `frontend-design`.

> [!warning] Who owns the scene layer is undecided
> A walkable 2.5D shop is layout, feel and animation, which is this seat, and it is also environment art, a camera and a character, which is not. It also has no output format: `/kp-ui` ends at a standalone vanilla-JS page under `ui-demos/`, and that cannot express a scene study. See [[law-9-build-recipe]] and [[the-shop-floor]].

## Owns

`pipeline/proposals/ux-agent.json` and art orders. Reads `ui-demos/` but never writes to `kernel-panic-site/`.

## Why sound lives here

Sound is feel, and feel is one job. The agent deciding that a press state floods inverse video is the one who should decide what it sounds like. There is no separate audio seat. See [[music-and-sound]].

## What it produced

The [[ui-rulings|eleven v3 laws]], and [[loadout-cfg]] as the reference implementation over five review rounds.

## Its output is a demo, not a patch

> [!info] A `/kp-ui` cycle ends at something the user can look at
> A standalone page under `ui-demos/<id>/`, vanilla JS, registered at `status: awaiting`. Only approved demos are eligible for integration. See [[the-plays]] and [[law-9-build-recipe]].

That is the strongest structural idea in the crew: this seat's work is **reviewed before it lands**, because UI is the one thing whose quality cannot be asserted in a JSON schema.

## Measurement over opinion

Every acceptance check is measured, not eyeballed. "The focal element is measurably the largest text" is a `getBoundingClientRect` assertion. See [[law-10-verification]].

## See also

- [[ui-rulings]] · [[art-direction]]
