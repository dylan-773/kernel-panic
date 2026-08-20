---
title: Art direction
status: canon
source: rulings
owner: orchestrator
updated: 2026-08-20
related: ["[[law-5-imagery]]", "[[law-12-scene-art]]", "[[art-lead]]", "[[kp-os]]"]
---

# Art direction

## The rule

**1-bit dithered imagery, at 1:1 pixel mapping, never downscaled.** This is a KP/OS rule and cannot survive a camera unchanged. See the scope box on [[law-5-imagery]].

Browser downscaling mushes the dots into grey noise. To show less, **crop**; to show more, crop wider. Integer upscaling is acceptable; downscaling never is.

Frame the crop on the **subject**. A centre crop of a busy illustration is usually the middle of the clutter and reads as texture rather than as an image.

## Imagery must be diegetic

There must be an in-fiction reason for it to be shown. A portrait exists because the ticket carries a client photo; a device macro exists because the intake scanned it. Decoration with no diegetic warrant does not ship.

## Three treatments

| Treatment | What it is |
|---|---|
| **INK TINT** (default) | 1-bit multiplied to `--r-aux`, so it recolours with the scheme |
| **TRUE 1-BIT** | untinted. The source art is monochrome ink, so this is its actual colour |
| **FULL COLOUR** | a **colourisation, not a reveal**: gradient-map the raw greyscale through a lit-interior palette, then Floyd-Steinberg dither to a 16-colour adaptive palette so it still reads as a dithered frame |

See [[law-5-imagery]].

## The pipeline

| Tool | Job |
|---|---|
| **PixelLab** (paid subscription since 2026-08-19) | rooms, character sprites, walk animations, inpainting: everything the camera moves through |
| Higgsfield `nano_banana_pro` | window imagery stills, 2 credits per image |
| `pipeline/tools/dither.py` | 1-bit dither treatments for window imagery |
| `pipeline/tools/pxpost.py` | the deterministic pixel post-pass for pixel assets |
| `pipeline/tools/colourise.py` | the FULL COLOUR gradient map |
| `pipeline/tools/customer-sheets.py` | composes walk sheets from PixelLab character zips (the twelve character ids are recorded inside it) |

Palette hexes are pinned in every prompt, which is what keeps a generative pipeline on-model. KP/OS pixel prompts pin the `--kp-*` hexes (see [[art-lead]]); scene prompts pin KP-NEON/16 (see [[law-12-scene-art]]).

## The scene layer

The overworld's visual language is not this document's to state: mood, palette, lighting, and the three prompt templates live in [[law-12-scene-art]], ruled by [[ruling-22-the-shop-goes-neon]]. What belongs here is the pipeline fact: every scene generation records its prompt, job id, seed, and post-pass in `pipeline/art/overworld/RECORD.md`, and an unrecorded generation is treated as unreproducible and regenerated. The 2026-08-19 set shipped without such a record, which is why the record is now mandatory.

## The finished set

The KP/OS set: 19 images in `pipeline/art/done/`, symlinked into this vault at `_attachments/art`. Customer portraits, device macros, client figures, story stills, and window furniture.

The overworld set (2026-08-19, in `app/public/assets/overworld/`): three painted isometric rooms (shop, bedroom, back room), five repaired-state patch overlays, the son's walk and idle sheets, and walk sheets for all twelve customers.

All three plates were generated full-bleed and shipped with their silhouettes clipped at the canvas; the 2026-08-19 completion pass padded each canvas and finished the edges (wall apexes converge, floors end in diamond edges with a dark thickness face, the shop staircase lands on the floor). Workflow that worked: PixelLab `inpaint_image` over funnel-served crops or ring masks for the generative parts, deterministic PIL for straight cuts, texture fills and artifact cleanup, and a rendered geometry-overlay debug image to keep collision rects honest against the art.

> [!info] The 2026-08-16 "no pipeline for the shop" warning is resolved
> The answer was PixelLab, and the approach was **painted rooms, not tile assembly**: one hero image per room (`create_image_pro`), walkability authored as data over it, repaired states as inpainted patches baked onto the room texture at load, and low top-down character sprites (`create_character` + walk animations) composited on top. See [[the-shop-floor]] and [[technology-stack]].

Examples in [[juno-vex]], [[aldous-wick]], [[sable-okonkwo]], [[wren-tallis]], [[bram-hollander]].

## The open palette question

Whether role-token colour is the general law or a single-window exception is **unresolved**. See [[palette-generalization-conflict]].

## See also

- [[law-5-imagery]] · [[art-lead]] · [[music-and-sound]]
