---
title: The shop floor
status: canon
source: code
owner: user
updated: 2026-08-19
related: ["[[the-shop]]", "[[the-bench-transition]]", "[[repairs-and-unlocks]]", "[[technology-stack]]"]
---

# The shop floor

A room the player walks, in 2.5D. Downstairs is the shop. Upstairs is [[the-bedroom]]. For what is canonically in the room and what each prop carries, see [[the-shop]]; this note is about how it is presented and operated.

> [!info] As built 2026-08-19
> Shipped as a Phaser scene over painted isometric rooms. Source: `src/game/overworld/` (`world.ts` holds the geometry, `scene.ts` the engine layer, `bridge.ts` the React seam); rooms and sprites are PixelLab work, see [[art-direction]].

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
| The stairs | up to [[the-bedroom]]; going up while the shop is open is how the day closes |

## What the room is not

**Not a hub menu with a body.** If walking to the bench is only a slower click, the room is a tax. It earns its place by being where the shop's condition is legible, where customers are people rather than cards, and where scenes happen.

**Not a second interface.** Anything that is a decision about a machine belongs in KP/OS. See [[kp-os]] for the division.

## How it is presented (the 2026-08-16 open questions, answered as built)

The room is a **scene layer**, and the KP/OS laws do not govern it; what carries across is the declared look order, equal footprint for broken and fixed states, and diegetic-or-not-at-all.

- **Camera.** Fixed per room at **integer zoom only** (`max(2, floor(fit))` in `scene.ts`); the camera centers when the room fits the viewport and follows the player with bounds when it does not. Law 5's integer scaling survives the camera because the zoom is never fractional.
- **Movement.** Both: direct control (WASD/arrows) and click-to-move over a BFS pathfinder on a fine nav grid. Interaction is one prompt key (E/Enter/Space), and walking to a station via click ends in its interaction. See [[game-controls]].
- **Two rects per station** (2026-08-19 collision pass): a small stand `zone` whose center sits on the walkable pad (prompts resolve by nearest zone center, so a zone centered on furniture loses everywhere), and a `hotspot` covering the prop's visible pixels so clicking furniture art walks to its pad and interacts. A walkable click never resolves through hotspots; an unwalkable click takes the smallest containing rect, which keeps a gadget clickable on top of a bigger prop (the register on the counter). Occluder rects hug their prop's silhouette with `base` at its floor-contact line; oversized occluders redraw floor over the player, which is the culling bug class this pass removed.
- **Rooms are paintings, not tilemaps.** One hero image per room, obstacles and walk polygons authored as data in `world.ts` over it. Occluding props are texture frames depth-sorted against the actors' feet.
- **Progress is baked into the room.** Each repaired state is a patch image composited onto the room texture at load (`room-<id>-live` canvas texture), so a fixed power feed or stocked shelves are simply part of the room, at equal footprint with their broken states.
- **The CRT glass does not cover the room.** The glass is the terminal and arrives with the sit. See [[the-bench-transition]].
- **There is a HUD**, four facts only: strain (with the alarm), the day and weekday, credits, and the held haul; plus a counter chip when someone is waiting. See [[hud-and-ui-design]].
- **The layout does not change.** Rearranging the shop stayed out; repairs change the state of fixed furniture, never its footprint.

## See also

- [[the-bedroom]] · [[the-counter]] · [[design-pillars]]
