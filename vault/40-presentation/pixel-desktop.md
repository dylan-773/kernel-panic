---
title: Pixel desktop
status: canon
source: code
owner: orchestrator
updated: 2026-09-08
related: ["[[kp-os]]", "[[ui-rulings]]", "[[art-direction]]", "[[player-options]]"]
---

# Pixel desktop

> [!info] Source
> `components/os/pixel-ui.css`, `desktop.tsx` (`PixelDesktop`, `DESKTOP_APPS`), `crt.tsx` (`CrtOverlay`), `window-geometry.ts` (`fitWindow`, `resizeWindow`), `confirm-dialog.tsx`, `public/assets/fonts/kp-terminal.ttf` built by `scripts/build-pixel-font.py`.

The shipped look of KP/OS since 2026-09-04: a true pixel-art operating system rebuilt over the v3 instrument-panel windows. The user commissioned it in a Codex session ("completely redesign the UI from the ground up to be a true pixel art UI, improving legibility, fixing the CRT shader, making windows resizable, changing the color scheme") and it shipped in the assignment 10 final cut.

## What it is

- **KP Terminal**, an original 5x7 bitmap font with an 8-unit em (CC0, `KP-Terminal-README.md`). UI sizes are 16, 24 and 32 CSS pixels so every glyph pixel is exactly 2, 3 or 4 screen pixels. Font smoothing is off. The Google Fonts links are gone.
- **A real framebuffer desktop**: `PixelDesktop` draws the wallpaper on a canvas at half resolution and scales it 2x with smoothing disabled, so a resize adds pixels instead of stretching art.
- **Resizable, draggable windows** with minimize, maximize, a START menu, desktop shortcuts and a running-window taskbar. Geometry snaps to a 2px grid and is clamped to the desk (`window-geometry.ts`, covered by `tests/window-geometry.test.ts`).
- **CRT as an overlay only**: `CrtOverlay` has three modes (soft, arcade, off) and a strength knob under `kp-os-display-v4`; it never rasterizes or blurs the interactive layer. The dive crumb bar carries a CRT cycle button next to sound.
- **Larger touch targets**: 16px body text and 40 to 44px controls.
- **Full-color customer faces** everywhere the OS shows a client: `roster-art.ts` now returns `CustomerProfile.portrait` for the card, the record, the figure and the client print. The 1-bit and colourised dither treatments remain for device macros, scans and stills. See [[art-direction]].

## How it layers over v3

`styles.css` wraps the whole KP design system in `@layer legacy` and `pixel-ui.css` loads unlayered, so pixel rules win every contested property. The v3 windows keep their markup and their internal layout; the pixel sheet owns typography, chrome, color and window furniture.

> [!warning] Container queries in the legacy layer still fire
> A legacy `@container` block that sets a property the pixel sheet does not set at that width will apply. DARKNET.LNK shipped two-column above 700px for exactly this reason until `pixel-ui.css` gained a matching container block on 2026-09-08. When a window looks wrong at one width only, look for a legacy container query first.

## Why it is this way

The v3 instrument panels were reviewed one window at a time and never cohered into an operating system; the user's own verdict on the first pass of this rebuild was "it doesn't look like an operating system anymore," which is what the START menu, taskbar and resizable windows answer. A bitmap font at integer scales is what makes it read as pixel art rather than a colour scheme.

## See also

- [[kp-os]] · [[ui-rulings]] · [[art-direction]]
