---
title: Technology stack
status: canon
source: code
owner: orchestrator
updated: 2026-08-19
related: ["[[technical-requirements]]", "[[performance-budget]]", "[[kp-os]]", "[[the-shop-floor]]"]
---

# Technology stack

> [!info] Source
> `kernel-panic-site/app/package.json`, `vite.config.ts`, `src/`.

A browser app. One game engine, scoped to one job: **Phaser drives the walkable shop, React drives everything else.**

| Layer | Choice |
|---|---|
| Runtime | **bun** |
| Bundler | **Vite** |
| Framework | **React** on a TanStack Start template |
| Overworld engine | **Phaser** (`phaser` in `package.json`), rendering the walkable rooms only. See [[the-shop-floor]] |
| Language | **TypeScript**, `tsc --noEmit` as the schema enforcer |
| UI primitives | Radix, plus the project's own `kp-ui.tsx` |
| Audio | custom **sfxr** synthesis, no audio library. See [[music-and-sound]] |
| Art | painted isometric rooms + character sprites (**PixelLab**), 1-bit dithered PNG for window imagery. See [[art-direction]] |
| Persistence | `localStorage`. See [[save-and-load]] |
| Hosting | Higgsfield, website id `ce0a9c8c-bae7-418c-909a-84648abdcf17` |

> [!info] As built 2026-08-19
> The 2026-08-05 "no engine at all" ruling is amended, not overturned. Phaser owns exactly one canvas: the shop, bedroom and back room as walkable space (`src/game/overworld/scene.ts`). Everything with rules in it stays engine-free.

## Where the engine boundary sits

- **Phaser owns**: room rendering, walking, pathfinding, depth sorting, the camera, the bench zoom. It holds no game state; it reads a snapshot and emits events (`src/game/overworld/bridge.ts`).
- **React owns**: every interface pixel above the canvas (HUD, prompts, intake, panels, KP/OS, the duel).
- **Reducers own the rules**: the duel and the day are still plain reducers (`duel-reducer.ts`, `day-reducer.ts`) that import neither React nor Phaser.

That last line is what keeps [[simulation-harnesses|the sims]] honest: they drive the real reducers headlessly at 200 seeds, which a renderer-coupled duel could never do.

## SSR safety

Phaser is client-only. The scene component loads it with a dynamic `import("phaser")` inside an effect, so the SSR pass (`ssr.noExternal: true` bundles everything into the Worker) never evaluates it. Verify after any change to the scene layer: `bun run build`, then fetch against `dist/server/server.js` and confirm phaser lands in a client chunk only.

## Commands

```
bun run typecheck     # tsc --noEmit
bun run build         # tsc --noEmit & vite build, in parallel
bun run lint
```

## Two traps

> [!warning] `bun run dev` SSR is broken in this template
> Verify builds with `bun run build` plus a fetch against `dist/server/server.js`.

> [!warning] `bun run preview` serves a snapshot
> Every rebuild changes asset hashes, so the preview server must be killed and restarted after `bun run build` or the page 404s its own stylesheet and renders unstyled. `bun dist/server/server.js` serves SSR only, not static assets. localStorage saves are **per port**.

## See also

- [[verification-gate]] · [[technical-requirements]]
