---
title: Law 4 - Chrome vocabulary
status: canon
source: rulings
owner: ux-agent
updated: 2026-08-16
related: ["[[ui-rulings]]", "[[hud-and-ui-design]]"]
---

# Law 4 - Chrome vocabulary

> [!info] Scope
> **KP/OS for the parts bin, both domains for the empty-state rule.** A broken station and a repaired one should occupy the same physical footprint, or the room reflows every time the player upgrades. That is this law's equal-footprint rule in three dimensions and it is the most useful thing here to export.

The shared parts bin. Carried over from v2 unless noted.

- **Solid-ink title bar**, void pixel text, **a pixel X as the only button**.
- Boxed `// LABEL _` data rows.
- **VT323** body, **Silkscreen** labels.
- **No border-radius on UI chrome, ever.**
- **Hairline plus heavy corner brackets** (1px `--r-struct` border, 24px/4px `--r-hazard` brackets) are scoped to the **focal panels only**. Applying them everywhere destroys the emphasis they exist to create.
- **Hazard-stripe dividers** (`--r-hazard`, 45 degrees) label a zone boundary.
- **Corner-tick reticles** mark the active option, as a second channel on top of the inverse-video fill.
- **Equal-footprint empty states.** An empty slot occupies exactly the room a filled one does.

## The empty-state rule is the subtle one

> [!info] Build both and check
> A sparse early-run surface and a full late-run surface must have the same footprint. Sparse states are where maximalist grids fall apart: a layout tuned on a full rack looks broken on an empty one with nothing in it, and a layout tuned on empty reflows the moment it fills.

This also protects the [[law-3-fluid-and-the-height-ceiling|height ceiling]]: a surface that grows as the run progresses would blow its budget exactly when the player has most to read.

## The second-channel principle

Reticles exist because the active option is already marked by an inverse-video fill, and one channel is not enough. It is the same rule as [[law-1-colour-is-roles]]'s "colour is never the only channel", applied to selection rather than to alarm.

## See also

- [[law-1-colour-is-roles]] · [[law-2-hierarchy]]
