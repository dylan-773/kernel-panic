---
title: Law 12 - Scene art
status: canon
source: rulings
owner: orchestrator
updated: 2026-08-20
related: ["[[law-5-imagery]]", "[[law-1-colour-is-roles]]", "[[art-direction]]", "[[art-lead]]", "[[the-shop-floor]]", "[[ruling-22-the-shop-goes-neon]]"]
---

# Law 12 - Scene art

The scene layer's own art law, the one [[law-5-imagery]] anticipated when it said the shop camera either locks to integer scales or "the scene gets its own art law and this one stays a window rule." The camera locks to integer scales (see Camera below), the scene gets this law, and law 5 stays a window rule.

## Scope

The overworld scene layer only: painted room plates, repaired-state patches, and walk sprites. KP/OS v3 windows, the eight role tokens, and everything in `ui-demos/RULINGS.md` are out of scope and unchanged. The room's scene-layer interface (`room-ui.tsx`) keeps its own conventions.

## Mood

Neon cyberpunk repair shop. Ruled by the user on 2026-08-20 ([[ruling-22-the-shop-goes-neon]]): dense neon signage in magenta, cyan and violet; small holographic panels; shelf interiors backlit with glow; a dark purple-black base; CRT phosphor green on the bench terminals; retro-futuristic, and still a cluttered, lived-in family workshop at night. The failure this law replaces read as the 1990s with the future left out. The register words for scene prompts are neon, holographic, backlit, glowing, retro-futuristic. The banned register words are muted, 1990s, cozy, moody: each one is a documented cause of the muted plate that shipped on 2026-08-19.

## The palette: KP-NEON/16

The scene prompt pin is these sixteen hexes and no others. This table is the single source of truth; [[art-lead]] and the kp-contracts skill quote it from here.

| Hex | Name | Role |
|---|---|---|
| `#101218` | void | deepest shadow, room corners (kept, = kp bg0) |
| `#14171e` | ink | shadow mass (kept, = kp bg1) |
| `#1a1e27` | panel dark | dark props, monitor casings (kept) |
| `#2b313d` | line gray | seams, cable runs (kept) |
| `#1c1430` | violet ink | new base: wall and floor shadow, the purple-black ground |
| `#2d2150` | dusk violet | new base: lit wall planes, floor midtone |
| `#4a3b78` | haze violet | neon bounce light, dim holo panels |
| `#ff2d95` | neon magenta | signage tubes (sibling of kp rose `#e94f6d`) |
| `#ff6d88` | rose-hot | magenta glow falloff (kept, bridges to KP/OS) |
| `#b44cff` | electric violet | signage, holo edges |
| `#00e5ff` | neon cyan | holo panels, screen glow |
| `#9df3ff` | ice cyan | cyan glow falloff, highlights |
| `#33ff66` | CRT green | terminal text glow on bench monitors |
| `#ffe9c4` | signal bone | warm desk-lamp pools on work surfaces (kept) |
| `#d9a53f` | amber | brass, tape, cardboard, sparse warm props (kept) |
| `#e8ebf2` | bone white | hot centers of lights, specular ticks (kept) |

Usage ratios, per plate: dark bases roughly 65 percent of plate area, neons at most 20 percent, warm pools roughly 10 percent, whites 5 percent. Neon is wall-borne and shelf-borne ambient light. Work surfaces (bench, counter, solder station) keep their bone and amber lamp pools, which is what keeps state patches and 48 px sprites readable against the room.

## Lighting

Neon is ambient and architectural: signage on walls, glow inside shelves, city bleed through the shopfront window. Warm light survives only as pools at every work surface. Screens glow green or cyan, never warm. The room stays dark; the neon is what makes the dark legible.

## Prompt templates

Every scene asset is generated from one of these three shapes, palette pin included verbatim. The full per-asset prompts, job ids, and post-pass commands are recorded in `pipeline/art/overworld/RECORD.md`, which is the reproducibility ledger this law makes mandatory.

**Room plate** (`create_image_pro`, gen size recorded per room, shipped dims are `ROOMS[id].width/height` in `world.ts`): the room's fiction and furniture layout sentence stay structurally identical between regenerations so the geometry data survives; only material and light vocabulary changes. Required clauses: the layout sentence naming every station and its wall; for any room with stairs, "drawn as one continuous run at a single consistent stair pitch from the floor to the top edge"; the palette pin "Limited palette anchored to these hexes:" plus the sixteen; and the text ban "no people, no readable words, no lettering, no signage text" (neon signage prompts generate garbled type otherwise; the dither treatment learned the same lesson twice). Prompt length stays between 40 and 220 words.

**State patch** (`inpaint_image` over a funnel-served crop): "In the masked region only: " plus the repaired object in one sentence, plus "Match the surrounding neon cyberpunk pixel art exactly: same palette, same lighting direction, same pixel density; keep the warm lamp pool. No people, no readable words." Shipped patch dims must equal the `stateOverlays` rect in `world.ts` exactly; the bake is a raw blit.

**Character** (`create_character`, v3, size 48, low top-down, selective outline): the wardrobe sentence, then "dark desaturated streetwear with one saturated neon accent color (magenta, cyan, violet, or green), faint neon rim light, otherwise muted so the accent reads at 48 pixels." Never the bare phrase "muted colors", which is what flattened the first sprite generation.

## Sprites

Sprites are muted silhouettes with at most one neon accent. The 2026-08-19 sprite set (zero accents) is the compliant zero-accent case and stays shipped until a sprite pass regenerates it under the character template above; deferring it was a style decision, not an omission.

## Camera

The scene camera renders at integer zoom only (`layoutCamera` in `scene.ts`), so exact pixel mapping survives and [[law-5-imagery]] keeps its 1:1 law as a window rule without conflict.

## Scheme tint

[[law-1-colour-is-roles]] asks that the shop be lit in the active scheme's hue. Under this law the plate is multi-hue baked; the runtime scheme contribution is only the low-alpha full-screen tint (`tintRect` in `scene.ts`), never a repaint. The baked neon and the scheme tint must coexist: if the tint muds the neons it is the tint constant that yields.

## See also

- [[ruling-22-the-shop-goes-neon]] - the ruling this law implements
- [[art-direction]] - the production pipeline
- [[the-shop-floor]] - the scene the law governs
