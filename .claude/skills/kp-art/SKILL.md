---
name: kp-art
description: Run a Kernel Panic art pass - fulfill open art orders via the Art Lead, review, install into the app, build check.
disable-model-invocation: true
---

# Art Pass (Orchestrator play)

Scope: fulfilling `pipeline/art/orders/*.json`. Orders are filed by the UX Agent or Narrative Director during other plays (or by the user directly).

1. List open orders. If none, say so and stop. Confirm the credit budget with the user if the batch exceeds ~10 images (Higgsfield nano_banana_pro is ~2 credits each). PixelLab is reserved: never approve a PixelLab spend yourself.
2. Spawn `art-lead` with the open order ids. It generates (palette-pinned prompts), post-processes via `pipeline/tools/pxpost.py`, writes PNGs to `pipeline/art/done/`, and updates order statuses.
3. Review every `done` PNG yourself (Read the image): palette adherence, readability at game size, brief match. Reject bad ones by reopening the order with a note (max one redo round).
4. Install accepted assets into `kernel-panic-site/app/public/assets/px/<category>/` at the order's `target` path, and wire any new paths into the content modules that reference them (you are the sole code owner).
5. Verify: `cd /Users/lyd0n/Development/kernel-panic/kernel-panic-site/app && bun run build`, then spot-check the dist output loads the new assets.
6. Report: orders fulfilled/blocked, credits spent, files installed. STOP; deploy only on explicit user OK.
