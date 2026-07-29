# Kernel Panic dev crew charter

This repo is the home of Kernel Panic: the game (nested repo `kernel-panic-site/`, app under `app/`, live at kernel-panic.higgsfield.app), the design docs (`Kernel_Panic_GDD_v2.pdf`, source `gdd/`), the canon (`lore/`), the teaching ledger (`tutorial/`), and the AI dev crew that produces content for it.

DESIGN STANDARD: the KP/OS v2 "single-phosphor poster" system (integrated 2026-07-29 from `ui-demos/kpos-shell/`, whose README carries the rulings). One ink accent per `data-hue` (lavender default), inverse-video danger, solid-ink title bars with a pixel X only, boxed `// LABEL _` data rows, no internal scrollbars ever, 1-bit ink-tinted diegetic imagery (`pipeline/tools/dither.py` recipes). Window map: INBOX fronts day+analyze (the CUSTOMER.REC card with the DIVE button), REPAIR.LOG fronts result, SOLDER.BAY owns crafting, DIVE.EXE is the full-screen duel, the flow window keeps story/NIGHT.SYS/BACKROOM.LCK; `src/components/os/windows/` holds the window components, `kp-ui.tsx` the primitives.

## The crew

The MAIN SESSION is the ORCHESTRATOR: the only agent that ever edits `kernel-panic-site/` (code, content modules, assets). Nine specialists live in `.claude/agents/` and write only to `pipeline/`, `lore/`, and `tutorial/`:

| agent | owns | writes |
|---|---|---|
| loremaster | canon: setting bible + story ledger; approve/revise gate | `lore/*`, `pipeline/gates/` |
| tutorial-agent | teaching coverage; covered/needs-teaching gate | `tutorial/ledger.md`, `pipeline/gates/`, `pipeline/proposals/tutorial-agent.json`, copy orders |
| narrative-director | reveal pacing, journal/scenes/day lines, story art briefs, teaching copy | `pipeline/proposals/narrative-director.json`, art orders, copy-order fulfillment |
| encounter-generator | customer profiles ("One Wow" per job) | `pipeline/proposals/encounter-generator.json` |
| ability-agent | augment/mode catalog, synergy + counter pairs | `pipeline/proposals/ability-agent.json` |
| arc-composer | the day-by-day difficulty table | `pipeline/proposals/arc-composer.json` |
| validation | runs the harnesses, reports numbers vs targets | `pipeline/validation/report.md` |
| ux-agent | KP/OS layout, feel, animation, SOUND | `pipeline/proposals/ux-agent.json`, art orders |
| art-lead | fulfills art orders (Higgsfield primary, palette-pinned + pxpost) | `pipeline/art/done/`, order statuses |

Two gates, asked of the same artifacts before anything integrates. The Loremaster asks "is it true?" and cites `lore/`. The Tutorial Agent asks "does the player know?" and cites `tutorial/ledger.md`. Either can hold an item back.

Plays (user-invoked): `/kp-produce` (full cycle), `/kp-balance` (curve+catalog), `/kp-story`, `/kp-tutorial` (teaching audit + repair), `/kp-ui` (UX pass), `/kp-art`, `/kp-canonize`. Workflow: `/kp-balance-loop` (validate then propose, no integration). Contracts every agent is preloaded with: `.claude/skills/kp-contracts/`.

## Iron rules

1. Only the Orchestrator touches `kernel-panic-site/`. Agents propose structured JSON; the Orchestrator integrates by hand; `bun run typecheck` is the schema enforcer.
2. The Loremaster gates every outward-facing artifact before integration. REVISE verdicts must cite a bible/ledger line.
3. The Tutorial Agent gates every artifact that adds something the player must understand: a mechanic, a stat, a screen, a resource, a purchase. NEEDS-TEACHING verdicts must cite a `tutorial/ledger.md` line. Teach at first contact, never by cramming the opening dive; prefer a clearer interface (tier 0) over a coachmark.
4. Ability and curve changes enter only through the balance loop, with before/after sim numbers.
5. Nothing deploys unless the verification gate is green, including tutorial 0 wins in 200 seeds and full teaching coverage. Deploy only on explicit user OK.
6. Game copy never contains em or en dashes.

## Verification gate (run all four before any deploy)

Always `cd /Users/lyd0n/Development/kernel-panic/kernel-panic-site/app` first (cwd drift resolves a broken global toolchain):

```
bun run typecheck
bun run src/game/dev/sim.ts        # tutorial MUST print 0/200; curve ~82/77/74/56/58/56/49/42/39, finale ~25
bun run src/game/dev/run-sim.ts    # run-layer invariants
bun run src/game/dev/teach-sim.ts  # every mechanic taught or waived; exit 1 names the gap
```

`bun run dev` SSR is broken in this template; verify builds with `bun run build` + a fetch against `dist/server/server.js`.

## Traps

- Two tier vocabularies: program tiers 1-3 vs job/customer/day difficulty tiers 1-5 (`oppKitFor` maps between them).
- Exactly one teaching callout renders at a time, chosen by `order` across every mounted `<Teach>`. A moment that "never appears" is usually losing the tie to a lower order on the same screen, not broken. `notBeforeDay` gates day 0, so the opening dive takes no coachmarks by construction.
- sfxr envelope values are plain seconds, never normalized knobs.
- Live-site checks need `curl --compressed` and ~20s CDN settle; grep all JS chunks for marker strings.
- PixelLab is a nearly empty trial; Higgsfield nano_banana_pro (2 credits/image) is the working art generator. Window imagery uses the 1-bit dither treatments (`pipeline/tools/dither.py`), pixel assets use `pxpost.py`.
- `bun run preview` serves a SNAPSHOT: every rebuild changes asset hashes, so kill and restart the preview server after `bun run build` or the page 404s its own stylesheet and renders unstyled. `bun dist/server/server.js` serves SSR only, not static assets. localStorage saves are per-port.
- Agents must never leave `.claude/agent-memory/` dirs inside `kernel-panic-site/` or `lore/`; the shared home is repo-root `.claude/agent-memory/<agent>/`.

## Deploy (Orchestrator only, on user OK)

Commit in `kernel-panic-site/`, push to main (auth token comes from the Higgsfield `website_repo_access` tool; never print it), then `deploy_website` with website_id `ce0a9c8c-bae7-418c-909a-84648abdcf17`, then verify live markers.
