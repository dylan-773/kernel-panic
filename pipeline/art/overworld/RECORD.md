# Overworld generation record

The reproducibility ledger law 12 makes mandatory (`vault/40-presentation/rulings/law-12-scene-art.md`). One entry per shipped scene asset: tool, job id, seed, prompt, style anchor, post-pass. The 2026-08-19 muted set shipped without such a record; that never happens again. An unrecorded generation is treated as unreproducible and regenerated.

All 2026-08-20 prompts pin the KP-NEON/16 palette verbatim from law 12 and end with the text ban "no people, no readable words, no lettering, no signage text."

## 2026-08-20 v2: the industrial materials pass (ruling 22 sharpened)

The v1 neon set below was REJECTED by the user the same night: it kept
rustic materials (wooden planks, wainscot, wooden crates) and added neon
lighting over them. Law 12 gained its Materials section from that failure.
The v2 set replaces materials wholesale: concrete and metal panel walls,
scuffed concrete floor with embedded grates, steel counter with holographic
register, industrial metal racking, plastic equipment crates, metal
lockers, server towers, an industrial metal staircase with a steel railing
descending all the way to the open floor.

### shop.png v2 (632x456 shipped)

- Tool: `create_image_pro`, 632x400, seed 501, `no_background: false`.
- Job id: `af3a0be0-8712-41d2-b719-05497f7b7233`. THE STYLE ANCHOR for v2.
- References: layout = `shop/shop-masked-v2.png` (usage "layout only"), materials/mood = the user's BYTEFIX reference image (usage "materials and mood only, never copy its text, signs or layout").
- Prompt: the law 12 v2 room-plate template, industrial materials register (see the law; full text recoverable from the job id). Rejected same-prompt variants: seed 502 job `63633ac8` (city breach painted into the void), seed 503 job `c33efa8d` (glyph-heavy signage).
- Touch-ups: two `inpaint_image` material swaps replacing residual wooden crates and beige computers, west stock (seed 511, job `e710690a`, crop 10,220-200,375 mask 10,10 170x135) and east stock (seed 512, job `d1f3ec22`, crop 390,220-580,370 mask 10,10 170x130); crops pasted back whole (outside-mask pixels identical by construction).
- Post-pass: void keyed, pasted at y=28 into 632x456 (same recipe as v1).
- Geometry map (original padded coords): x' = 0.93x + 22, y' = 0.95(y - 28) + 38. The stair returns to the original topology (foot on the open floor), so the original SE geometry transforms directly; occluder rects re-trimmed to the painted props.

### bedroom.png v2 (440x300 shipped, unpadded)

- `create_image_pro`, 440x300, seed 521, job `d52cf58a-8ecb-4a6b-9b2c-1f59932eff59`, layout ref bedroom-masked, style anchor `af3a0be0`. Industrial materials variant of the bedroom prompt.

### backroom.png v2 (400x300 shipped, unpadded)

- `create_image_pro`, 400x300, seed 531, job `11b3d4fd-f2b7-4348-b955-8d9bffb904b2`, layout ref backroom-masked, NO style anchor, prompt hardened to "ALMOST EMPTY" with an explicit no-furniture list. Rejected: seed 522 job `ae7fd11e` (the af3a0be0 style anchor dragged it into a cluttered workshop and destroyed the shrine).
- Void keyed by corner-color flood (the void generated dark, not white): connected pixels within distance 40 of the corner color.

### states/*.png v2

Same workflow as v1 over the v2 padded plate, mask = the v2 `world.ts` rects, results cropped to exact rect dims, red mask-line pixels healed by neighbor fill, 3px alpha feather.

| patch | rect (padded) | seed | job id |
|---|---|---|---|
| solder-fixed | 85,188 115x84 | 541 | `47452b70-7420-4521-82ef-6544f5109a10` |
| power-fixed | 61,171 32x36 | 542 | `6f17c5b0-6489-47ba-b11b-2b499a29f2ae` |
| router-fixed | 351,139 69x38 | 543 | `6af84cdd-ad11-48bd-87fb-70023d489716` |
| shelves-fixed | 186,90 100x99 | 544 | `ac80392c-b25c-4f16-a716-b034350157fc` |
| drive-fixed | 466,292 78x58 | 545 | `4dfdad61-2569-496b-9b97-3f7b0ff742ab` |

## 2026-08-20 v1: the wooden-neon restyle (SUPERSEDED same night)

Approach: restyle-in-place. Fresh from-scratch generations would not hold the furniture layout (five candidates, seeds 101-105, all failed the geometry overlay gate), so every room was regenerated with `create_image_pro` passing the OLD plate as a `reference_images` entry, usage "the exact room layout, camera angle, wall positions, furniture placement and scale, and open floor area to preserve". Geometry in `world.ts` was then remapped by a fitted per-room affine (edge-map correlation) plus a hand-derived rework of the shop's south east quadrant. Reference images were served over the Tailscale funnel on 8443.

### shop.png (632x456 shipped)

- Tool: `create_image_pro`, 632x400, seed 201, `no_background: false`.
- Job id: `daa98931-8c1c-4d55-b816-b904ad9dfde8`. THE STYLE ANCHOR for the room set.
- Layout reference: `pipeline/art/overworld/shop/shop-masked-v2.png` (the muted pre-pad plate).
- Prompt: "Neon cyberpunk restyle of the referenced repair shop room, preserving the reference's exact camera, room shape, wall positions, furniture placement, furniture scale, doorway, shopfront window, and open floor area. Same small family computer repair shop at night, top-down 3/4 RPG perspective. Repaint the materials and light only: dark purple-black plaster walls over cable trunking, worn dark wooden plank floor catching magenta and cyan neon reflections, dense neon signage in magenta, cyan and violet along the walls, small holographic UI panels glowing softly, shelf interiors backlit with cyan and violet glow, the CRT terminal on the right wall workbench glowing phosphor green, magenta and purple neon city light bleeding through the shopfront window, small warm pools of desk lamp light on the work surfaces, cluttered, lived-in family workshop. The wooden staircase in the top-right corner is redrawn as one continuous run at a single consistent stair pitch from the floor to the top edge. Limited palette anchored to these hexes: #101218 #14171e #1a1e27 #2b313d #1c1430 #2d2150 #4a3b78 #ff2d95 #ff6d88 #b44cff #00e5ff #9df3ff #33ff66 #ffe9c4 #d9a53f #e8ebf2. Detailed high quality pixel art, clean readable furniture shapes, no people, no readable words, no lettering, no signage text."
- Post-pass: void keyed to alpha 0 by border flood fill (near-white: min channel > 170, chroma < 32); pasted at y=28 into a 632x456 transparent canvas (the historical pad frame; the new silhouette is complete inside the gen canvas, so no edge completion was needed). Raw in `neon/shop-neon-raw.png`.
- Geometry map (old padded coords to new): x' = 0.92x + 26, y' = 0.93(y - 28) + 42. South east quadrant re-derived by hand (stair foot pocket at 455..530 x 228..264; chair obstacle deleted as pushable furniture; east stock re-rected to the painted masses).
- Stairs gate: opaque-only seam sweep over the stair region (x 455-632, y 60-280): row median 4.7 max 14.0, col median 3.9 max 20.8 (a painted stringer edge). The old plate's paste seam measured 94.2 at y=290. No inpaint was needed.
- Rejected same-prompt variants: seed 202 job `ee2bf70a-56d0-4710-b304-56e47c6afadf` (copied "BYTEFIX"/"OPEN" lettering from a style reference), seed 203 job `367e1bcb-a835-4f6c-9a67-e85ff64d0458` (garbled signs, city backdrop painted into the void).
- Rejected from-scratch candidates (no reference, original prompt template): seeds 101-105, jobs `bdac2fd4`, `cc03ac83`, `73d90eed`, `9685a7e3`, `247f9606`; all failed the layout gate.

### bedroom.png (440x300 shipped, UNPADDED)

- Tool: `create_image_pro`, 440x300, seed 301, style anchor `daa98931` via `style_image_url`.
- Job id: `c6db652f-d37d-483a-8592-aa3515d10e3e`.
- Layout reference: `pipeline/art/overworld/shop/bedroom-masked.png`.
- Prompt: bedroom variant of the template: quiet and personal, neon city light through the blinds in bright stripes, the neon stays outside the glass, one warm lamp pool, staircase opening kept in place. Full text recoverable from the job id.
- Post-pass: void keyed (same flood fill); ships at native 440x300 because the new walls run full bleed to the canvas (the old 30px completion ring no longer applies). `world.ts` dims changed accordingly.
- Geometry map (old padded coords): x' = 0.92(x - 30) + 12, y' = 0.94(y - 30).
- Raw in `neon/bedroom-neon-raw.png`.

### backroom.png (400x300 shipped, UNPADDED)

- Tool: `create_image_pro`, 400x300, seed 303, style anchor `daa98931` via `style_image_url`.
- Job id: `ee28db6a-abd7-48cd-adf7-af5c989e4e4b`.
- Layout reference: `pipeline/art/overworld/shop/backroom-masked.png`.
- Prompt: backroom variant: nearly dark, reverent, still, like a shrine; the amber status light is the brightest thing; thin cyan cable glow along the skirting; "absolutely no neon signs, no wall signs, no posters, no glowing rectangles on the walls". Full text recoverable from the job id.
- Rejected: seed 302 job `5e5ca337-db26-4fac-a57c-cfb954e3b24b` (generated a readable "OPEN" neon sign).
- Post-pass: void keyed with a looser threshold (min channel > 150, chroma < 40) which also removed grey smudge artifacts in the void; ships at native 400x300.
- Geometry map (old padded coords): x' = 0.85(x - 30) + 32, y' = 0.85(y - 30) + 24.
- Raw in `neon/backroom-neon-raw.png`.

### states/*.png (five repaired-state patches)

All: `inpaint_image` over crops of the new padded shop plate (rect + 24px context margin, flattened onto #101218, served over the funnel), mask = the `world.ts` stateOverlays rect within the crop, result cropped back to EXACTLY the rect dims, then a 3px alpha feather ramp (0.45 / 0.75 / 0.92) on the borders so the bake never shows a straight paste edge. Prompt shape per law 12: "In the masked region only: [repaired object]. Match the surrounding neon cyberpunk pixel art exactly: same palette, same lighting direction, same pixel density. No people, no readable words."

| patch | rect (padded) | seed | job id |
|---|---|---|---|
| solder-fixed | 89,189 114x82 | 401 | `78006835-445f-4c58-8e72-dd9c5896fd93` |
| power-fixed | 65,172 31x35 | 402 | `e0c84478-5d0b-49d5-b815-aea86ac07b26` |
| router-fixed | 352,141 68x37 | 403 | `1b1c56c6-91f8-474f-a8e6-b9b13e44d555` |
| shelves-fixed | 188,93 99x97 | 404 | `413ff4ad-d735-4c28-8a11-c7e50b95fa4f` |
| drive-fixed | 474,246 72x62 | 405 | `34e784b3-e6a1-41f4-aa8b-9c0edebb014f` |

### Not regenerated tonight

Character sprites (son + twelve customers) stay the 2026-08-19 muted set, compliant as law 12's zero-accent case. The sprite pass, when it runs, uses the law 12 character template and updates the ids in `pipeline/tools/customer-sheets.py`.

## 2026-08-19: the muted set (superseded)

Generated without a record; prompts recovered later from the session transcript. Shop `create_image_pro` job `8fdca97f-aed5-4cd5-bb7f-74b0947173e3` (the old style anchor), bedroom `3e5b56b3`, backroom `85b592fd`, plus five inpaint state patches and two rect-paste stair repairs (job `4473d724`, the seam ruling 22 cites). Kept in `shop/` as layout references.
