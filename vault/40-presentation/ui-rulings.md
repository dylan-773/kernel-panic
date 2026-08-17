---
title: UI rulings
status: canon
source: rulings
owner: ux-agent
updated: 2026-08-16
related: ["[[kp-os]]", "[[law-1-colour-is-roles]]", "[[ux-agent]]"]
---

# UI rulings

The KP/OS **v3 instrument panel** laws. Every KP/OS surface obeys them.

> [!info] Status
> Established by the `ux-2026-07-31-loadout-eva` cycle over five review rounds. [[loadout-cfg]] is the reference implementation and is **still `awaiting` final approval**; the system itself is settled and is what other panels build to.
>
> Cited elsewhere **by law number**, so the numbering is a stable public key.

## Scope: two domains

> [!warning] Read this before applying any law to the shop
> Every law below says "every surface", and until 2026-08-16 that silently meant "every window". The game now has a second visual domain and the laws do not automatically reach it.

| Domain | What it is | Governed by |
|---|---|---|
| **KP/OS surfaces** | the desktop, every window, and [[dive-exe]] | all eleven laws, unchanged |
| **The scene layer** | the walkable 2.5D shop and bedroom | laws 1, 2, 4 and 6 in principle; laws 3, 5, 7, 8, 9 and 10 **do not apply as written** |

Where a law does not reach, the underlying principle usually still does, and each law note now says which half survives. The two hardest cases:

- **Law 5** requires 1:1 pixel mapping and forbids downscaling. A sprite at depth under a moving camera **is** a downscale, so either the scene locks to integer scales with no free zoom, or law 5 is KP/OS-only and the scene needs its own art law.
- **Law 7** reserves motion for alarms and forbids ambient animation. In a room that inverts: a shop with no fan turning and no sign flickering reads dead, and the alarm-legibility mechanism the law protects only works inside KP/OS.

Numbering is a stable public key, so **a scene-layer law is law 12 or later**. Never insert, never renumber. If the annotations below prove insufficient, [[law-12-the-scene-layer]] is where it goes.

## The eleven laws

| # | Law | In one line |
|---|---|---|
| 1 | [[law-1-colour-is-roles]] | Eight role tokens carry state; a scheme is a remap |
| 2 | [[law-2-hierarchy]] | Declare the glance order, then build the type scale to enforce it |
| 3 | [[law-3-fluid-and-the-height-ceiling]] | `cqi` never `vw`, one breakpoint, ~700px ceiling |
| 4 | [[law-4-chrome-vocabulary]] | The shared parts bin |
| 5 | [[law-5-imagery]] | 1-bit at 1:1, cropped never downscaled, diegetic |
| 6 | [[law-6-the-tube]] | Six glass layers over the stage. Flat or off. Never curved |
| 7 | [[law-7-motion]] | `steps()` only, motion is reserved, animate compositor properties |
| 8 | [[law-8-the-cuts-discipline]] | The fixed cut order. No internal scrollbars, ever |
| 9 | [[law-9-build-recipe]] | How to build a panel |
| 10 | [[law-10-verification]] | Headless Chrome over CDP, and the acceptance checklist |
| 11 | [[law-11-panel-queue]] | What is left |

## v2 to v3

v2 was the **single-phosphor poster**: one ink accent doing text, borders, fills, meters and imagery; hue switched across lavender, magenta and phosphor; danger as inverse video, never a second hue.

v3 keeps all of that structurally and changes three things:

1. **Colour became roles.** The single-accent law survives as the `:root` default, not as the only option.
2. **Layout became container-relative with a hard height ceiling.** v2 had per-surface footprints; v3 has one budget every surface meets.
3. **The CRT became glass over the stage** rather than an overlay on the page.

Unchanged from v2: the no-scrollbar law, paging over scrolling, [[darknet-lnk]]'s stepped-notch identity, the ticker at `steps(140)`, and boot line 1 shipping name-free.

## Process

> [!info] A `/kp-ui` cycle that relays an existing KP/OS window, with its content unchanged, is **pure UI**
> No loremaster gate, no tutorial gate, no detours into game code. Those gates are for surfaces introducing new fiction or new things a player must understand. A gate-shaped concern that appears anyway goes in the panel's `NOTES.md` and is mentioned once.
>
> **The exemption does not reach the scene layer.** An object in the shop carries fiction and a mechanic at the same time, so scene work is gated on both questions by default. See [[the-gates]].

## See also

- [[palette-generalization-conflict]] - law 1 and canon ruling 14 disagree
- [[ux-agent]]
