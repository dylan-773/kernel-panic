---
title: The shop floor
status: draft
source: none
owner: user
updated: 2026-08-16
related: ["[[the-shop]]", "[[the-bench-transition]]", "[[repairs-and-unlocks]]"]
---

# The shop floor

> [!warning] status: draft
> The largest new surface in the game and the one with the least decided. Settled with the user on 2026-08-16: it is walkable, it is 2.5D, the shop is downstairs and the bedroom upstairs, and installed upgrades are physically present in it.

A room the player walks, in 2.5D. Downstairs is the shop. Upstairs is [[the-bedroom]]. For what is canonically in the room and what each prop carries, see [[the-shop]]; this note is about how it is presented and operated.

## What it is for

Three things, and it should not acquire a fourth:

1. **Being somewhere.** The old design's economy argument was that a desktop needs no environment. The cost of that economy was that the player was nowhere, and grief needs a room to sit in.
2. **Making progress physical.** A repaired bench is visibly repaired. The player sees what they have built without opening a screen, and an unrepaired thing teaches its own unlock by standing there broken. This is tier 0 teaching at its strongest. See [[placement-bias-order]].
3. **Holding the story.** Artifacts are read where they were found. See [[repairs-and-unlocks]].

## The stations

| Station | What happens there |
|---|---|
| The counter | customers arrive, jobs are taken. See [[the-counter]] |
| The bench | sit down into KP/OS. See [[the-bench-transition]] |
| The back room | [[the-machine]], on [[sunday]] |
| The repairables | each is an interactable that shows its state, its price, and once fixed, what it turned up |
| The stairs | up to [[the-bedroom]] |

## What the room is not

**Not a hub menu with a body.** If walking to the bench is only a slower click, the room is a tax. It earns its place by being where the shop's condition is legible, where customers are people rather than cards, and where scenes happen.

**Not a second interface.** Anything that is a decision about a machine belongs in KP/OS. See [[kp-os]] for the division.

## Presentation, provisionally

The room is a **scene layer**, and the KP/OS laws do not automatically govern it. Two of them break outright if applied here: law 5's 1:1 never-downscaled pixel mapping cannot survive a camera, and law 7's ban on ambient motion would produce a dead room. See the scope section of [[ui-rulings]].

What should carry across:

- **Declared look order.** Law 2's principle without its type ratio: state what the eye finds first, second, third on entering, and compose for it.
- **Equal footprint.** Law 4's empty-state rule in three dimensions. A broken station and a repaired one occupy the same space, or the room reflows every time the player upgrades.
- **Diegetic or not at all.** Law 5's best half, which the room satisfies by construction.

## Open questions

- [ ] **Camera.** Fixed per room, following, or rails? This decides whether law 5's integer scaling can be kept at all.
- [ ] **Movement.** Direct control, click to move, or station to station? Direct control forces a keyboard scheme the game has never had. See [[game-controls]].
- [ ] **Does the CRT glass cover the room?** See [[law-6-the-tube]] and [[the-bench-transition]]. The strong answer is no: the glass is the terminal, and it arriving as you sit is the transition.
- [ ] **How is it produced?** The art pipeline dithers 1-bit stills. It has no path for backgrounds, props, a character or animation frames. See [[art-direction]].
- [ ] **Does the layout itself change?** The user raised rearranging the shop as a possible system. Attractive, and a large amount of art.
- [ ] **Is there a HUD here**, and does the strain alarm reach it? See [[hud-and-ui-design]].

## See also

- [[the-bedroom]] · [[the-counter]] · [[design-pillars]]
