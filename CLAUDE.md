# Kernel Panic dev crew charter

This repo is the home of Kernel Panic: the game (nested repo `kernel-panic-site/`, app under `app/`, live at kernel-panic.higgsfield.app), the design docs (`Kernel_Panic_GDD_v2.pdf`, source `gdd/`), the canon (`lore/`), and the AI dev crew that produces content for it.

## The crew

The MAIN SESSION is the ORCHESTRATOR: the only agent that ever edits `kernel-panic-site/` (code, content modules, assets). Eight specialists live in `.claude/agents/` and write only to `pipeline/` and `lore/`:

| agent | owns | writes |
|---|---|---|
| loremaster | canon: setting bible + story ledger; approve/revise gate | `lore/*`, `pipeline/gates/` |
| narrative-director | reveal pacing, journal/scenes/day lines, story art briefs | `pipeline/proposals/narrative-director.json`, art orders |
| encounter-generator | customer profiles ("One Wow" per job) | `pipeline/proposals/encounter-generator.json` |
| ability-agent | augment/mode catalog, synergy + counter pairs | `pipeline/proposals/ability-agent.json` |
| arc-composer | the day-by-day difficulty table | `pipeline/proposals/arc-composer.json` |
| validation | runs the harnesses, reports numbers vs targets | `pipeline/validation/report.md` |
| ux-agent | KP/OS layout, feel, animation, SOUND | `pipeline/proposals/ux-agent.json`, art orders |
| art-lead | fulfills art orders (Higgsfield primary, palette-pinned + pxpost) | `pipeline/art/done/`, order statuses |

Plays (user-invoked): `/kp-produce` (full cycle), `/kp-balance` (curve+catalog), `/kp-story`, `/kp-art`, `/kp-canonize`. Workflow: `/kp-balance-loop` (validate then propose, no integration). Contracts every agent is preloaded with: `.claude/skills/kp-contracts/`.

## Iron rules

1. Only the Orchestrator touches `kernel-panic-site/`. Agents propose structured JSON; the Orchestrator integrates by hand; `bun run typecheck` is the schema enforcer.
2. The Loremaster gates every outward-facing artifact before integration. REVISE verdicts must cite a bible/ledger line.
3. Ability and curve changes enter only through the balance loop, with before/after sim numbers.
4. Nothing deploys unless the verification gate is green, including tutorial 0 wins in 200 seeds. Deploy only on explicit user OK.
5. Game copy never contains em or en dashes.

## Verification gate (run all three before any deploy)

Always `cd /Users/lyd0n/Development/kernel-panic/kernel-panic-site/app` first (cwd drift resolves a broken global toolchain):

```
bun run typecheck
bun run src/game/dev/sim.ts        # tutorial MUST print 0/200; curve ~82/77/74/56/58/56/49/42/39, finale ~25
bun run src/game/dev/run-sim.ts    # run-layer invariants
```

`bun run dev` SSR is broken in this template; verify builds with `bun run build` + a fetch against `dist/server/server.js`.

## Traps

- Two tier vocabularies: program tiers 1-3 vs job/customer/day difficulty tiers 1-5 (`oppKitFor` maps between them).
- sfxr envelope values are plain seconds, never normalized knobs.
- Live-site checks need `curl --compressed` and ~20s CDN settle; grep all JS chunks for marker strings.
- PixelLab is a nearly empty trial; Higgsfield nano_banana_pro (2 credits/image) is the working art generator.

## Deploy (Orchestrator only, on user OK)

Commit in `kernel-panic-site/`, push to main (auth token comes from the Higgsfield `website_repo_access` tool; never print it), then `deploy_website` with website_id `ce0a9c8c-bae7-418c-909a-84648abdcf17`, then verify live markers.
