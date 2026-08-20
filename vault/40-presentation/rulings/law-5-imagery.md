---
title: Law 5 - Imagery
status: canon
source: rulings
owner: ux-agent
updated: 2026-08-20
related: ["[[ui-rulings]]", "[[art-direction]]", "[[art-lead]]", "[[law-12-scene-art]]"]
---

# Law 5 - Imagery

> [!note] Scope: resolved 2026-08-20
> **KP/OS only, as written.** The conflict this box used to carry is settled both ways at once: the shop camera locks to integer scales (`layoutCamera` in `scene.ts`), and the scene has its own art law, [[law-12-scene-art]]. This law stays a window rule.
>
> The half that transfers untouched is **diegetic or not at all**, which the room satisfies by construction.

## 1:1, never downscaled

1-bit dithered art at **exact pixel mapping**. Browser downscaling mushes the dots into grey noise.

- To show **less**: crop.
- To show **more**: crop wider.
- **Integer upscaling** is acceptable. Downscaling never is.

## Crop on the subject

A centre crop of a busy illustration is usually the middle of the clutter, and reads as texture rather than as an image.

## Diegetic or not at all

Imagery must have an **in-fiction reason for the OS to show it**. This is the rule that keeps a pixel-art game from accumulating decorative pixel art.

## Three treatments

Offered as a `FEED`-style variation wherever a surface carries a camera or a scan:

| Treatment | What it is |
|---|---|
| **INK TINT** (default) | 1-bit multiplied to `--r-aux`, so it recolours with the scheme |
| **TRUE 1-BIT** | untinted. The source art is monochrome ink, so this **is** its actual colour |
| **FULL COLOUR** | a **colourisation, not a reveal** |

FULL COLOUR is generated, not authored: gradient-map the raw greyscale through a lit-interior palette, then Floyd-Steinberg dither to a 16-colour adaptive palette, so it still reads as a dithered frame rather than as a photograph that snuck in.

## See also

- [[art-direction]] - the production pipeline
