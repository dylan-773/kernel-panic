# Kernel Panic

Assignment 10: Complete AI Dev Pipeline. Capstone submission for Dylan Overby.

## Student and game overview

- **Student:** Dylan Overby
- **Capstone game title:** Kernel Panic
- **Game concept:** A turn-based cyberpunk roguelike about inheriting your father's computer repair business and the machine in the back room he never let you touch. The whole game is a simulated retro OS desktop (KP/OS) in the browser: you take repair jobs from an inbox, dive into split-board routing duels against the machine, and unlock the story across a fixed ten-day arc. Nearly all content in the shipped build (ability catalog, difficulty curve, customers, story copy, teaching moments, sound presets, pixel art) was produced by a nine-agent AI crew and integrated through typed contracts and deterministic sim gates.

## Deliverable 1: playable link

**https://kernel-panic.higgsfield.app**

Loads directly into the game, no account, no instructions needed. The opening dive teaches the three programs in about two minutes. Current build: 0.8.0 (2026-09-08), the final cut.

## Deliverable 2: pipeline source code and engine integration

- **Pipeline repository:** https://github.com/dylan-773/kernel-panic (this repo: pipeline, agent definitions, design vault, gates)
- **Game app:** https://github.com/dylan-773/kernel-panic-site (nested repo, `kernel-panic-site/`)
- **Pipeline run video:** [VIDEO LINK]

### Integration breakdown

- **Target game engine:** custom TypeScript/React web engine (browser build via Vite SSR on the Higgsfield app template); the deploy target is the browser runtime.
- **Automated flow:** nine specialist agents (`.claude/agents/`) write typed JSON proposals into `pipeline/proposals/` under a shared schema contract (`.claude/skills/kp-contracts/`) that every agent preloads. A PostToolUse lint hook (`pipeline/tools/lint-proposal.sh`, registered in `.claude/settings.json`) validates every proposal at write time: JSON validity, required fields, per-type shapes, and the game's copy rules (dash ban, teaching-copy length caps), and feeds violations straight back to the writing agent. Two judgment gates run before integration: the Loremaster ("is it true?", citing story canon in `vault/60-story/` by quoted line) and the Tutorial agent ("does the player know?", citing `tutorial/ledger.md`). Proposal values then land verbatim in the game's typed content modules (`kit.ts`, `arc.ts`, `teaching.ts`, `audio.ts`, customer profiles): the JSON field values are the TypeScript literal values, no reformatting. `bun run typecheck` plus three deterministic sim harnesses (balance sim with win-rate targets per day, run-layer invariants, teaching-coverage sim that fails the build if any mechanic is untaught) enforce that integrated content actually works before anything deploys. Art follows the same pattern: work orders in JSON, generation with palette-pinned prompts or a style reference, a deterministic pixel post-pass, installed under `public/assets/` and referenced from typed asset maps.

### Tracing pipeline output into the shipped game

Every chain below is checkable by diffing the proposal against the shipped module:

| Content | Proposal / order | Ships in |
|---|---|---|
| Ability catalog (18 augments, 4 cuts) | `pipeline/proposals/ability-agent.json` | `kernel-panic-site/app/src/game/content/kit.ts` (ids match 1:1; cut ids absent) |
| Day difficulty configs | `pipeline/proposals/arc-composer.json` | `kernel-panic-site/app/src/game/content/arc.ts` (numeric deltas verbatim) |
| Inbox subjects, UI copy | `pipeline/proposals/narrative-director.json` | `kernel-panic-site/app/src/components/os/windows/inbox.tsx` (byte-identical) |
| Teaching copy | `pipeline/copy/orders/*.json` (14 orders) | `kernel-panic-site/app/src/game/content/teaching.ts` (verbatim) |
| Sound design (21 sfx presets) | `pipeline/proposals/ux-agent*.json` | `kernel-panic-site/app/src/game/audio.ts` |
| Pixel art (24 work orders, generator and cost logged per order) | `pipeline/art/orders/*.json` to `pipeline/art/done/` | `kernel-panic-site/app/public/assets/px/` via `roster-art.ts` and `customers.ts` |
| UI window redesigns | `pipeline/proposals/ux-agent*.json` to `ui-demos/<id>/` | `kernel-panic-site/app/src/components/os/windows/` (`ui-demos/manifest.json` is the durable approval record) |
| Balance verdicts | `pipeline/validation/report.md` | the curve targets in `vault/50-tech/verification-gate.md`, gated on every deploy |

## Deliverable 3: pipeline audit and cost analysis

### 1. Pipeline production and functionality

**What the pipeline produced.** Present in the playable build: the full 18-augment ability catalog (the shipped ids match the ability agent's proposal one for one, including four proposed cuts that are absent from the game); all nine day difficulty configs plus the finale tuning (the arc composer's numeric deltas appear verbatim in `arc.ts`, most recently the day 3 and day 5 greed deltas integrated for the final cut); inbox subject lines and UI copy byte-identical to the narrative director's proposals; fourteen teaching-copy orders filled and shipped verbatim; twenty-one procedural sfx presets; twenty-four pixel art work orders (customer portraits, device art, story attachment stills, window furniture); and twenty UI window redesigns that entered through a demo-review lane with a durable approval manifest.

**What manual steps remain.** One structural step: agents are fenced out of the game repo by design, so the orchestrator session places proposal values into the typed content modules by hand (values verbatim, placement manual). Two smaller ones: UI demos are approved by a human at a local review site before integration (a taste gate, kept deliberately), and finished art is copied from the pipeline's done folder into the app's asset directory. One thing sat outside the pipeline entirely: the final pixel-desktop shell (bitmap font, resizable windows, CRT overlay) was a direct coding session, reviewed afterwards by a headless browser walk rather than by the demo lane.

**What it would take to eliminate them.** Let agents write the content modules directly on a branch, gated by the existing typecheck plus the three sim harnesses in CI, with the orchestrator reviewing a diff instead of transcribing values. The sims already make content regressions machine-detectable, so the fence is now caution rather than necessity. Art install is a one-line script away. Only the UI taste gate should stay human.

### 2. Architectural reflection

**Decision to change:** trusting engine-level sims as the whole verification story. The gate runs three deterministic harnesses, and they all passed while the shipped tutorial was actually unplayable: a refactor routed every cast through one shared command gate, which silently applied the player's tutorial lesson-gating to the scripted opponent too, so the trap the first lesson waits on never got planted. The tutorial sim asserts "player wins 0 of 200," and a soft-locked tutorial also loses 200 of 200, so the invariant could not tell a scripted loss from a broken one.

**Specific alternative:** add a headless golden-path walk to the verification gate: a browser run that boots the real build, plays the opening dive by clicking what a player clicks, and asserts each lesson beat becomes available (scan unlocks, purge unlocks, attack unlocks, dive ends). Engine sims prove the rules; only a DOM-level walk proves the game. The final-cut review already ran this walk by hand over CDP and caught two layout bugs the sims cannot see; wiring it into the gate is the next step.

### 3. Cost analysis

**Total actual run cost.** Measured, not estimated: every Claude Code session transcript for the project (23 sessions, Aug 3 to Sep 1) records per-request token usage. Totals: 55.4M billable tokens (input plus cache writes plus output) plus 2.48B cache-read tokens. Priced at Anthropic API list rates that is approximately **$3,300** (range $3,200 to $3,500 depending on cache TTL), of which the abandoned overworld experiment accounts for about $1,600. Actual out-of-pocket was a flat Claude subscription plus a Higgsfield Plus plan and a PixelLab subscription. Art generation for shipped assets consumed 34 to 38 Higgsfield credits across 18 recorded work orders (about 2 credits per image) plus 120 PixelLab generations across the six final-cut portraits (20 per image, on the subscription allowance), all logged per order in `pipeline/art/orders/`.

**Most expensive pipeline step.** The orchestrator seat on the frontier model during long production cycles. Context re-reads alone were 1.83B cache-read tokens, about $1,830 of the total; the single costliest episode was the two-day overworld direction that was later rolled back entirely.

**Solo or small-team sustainability.** Yes, with two qualifications. On subscription pricing the cost is fixed and predictable, and a 97.6% prompt-cache hit rate (2.48B of 2.54B input tokens were cache reads) is what keeps the underlying number survivable. At raw API rates this usage intensity would run roughly $550 per week, which a solo developer sustains only with the caching discipline above, the cost-reduction change below, and a willingness to kill expensive directions fast.

### 4. Mid-project cost-reduction change

**Strategy.** Before: every content change, however small, was routed through the full crew. Production sessions in early August spawned 7 to 12 specialist subagents each, every one preloading contracts and context, with gates run on everything. After the charter rework on Aug 31: direct work is the default, specialists spawn only for genuine content fan-out, gates judge only crew proposals, and every numeric target is single-sourced to one file so no agent re-derives or re-states curve numbers.

**Token cost.** Before: average 5.06M billable tokens per production session (measured across the Aug 3 to 6 cycles, 7 to 12 subagent spawns each). After: 0.9M to 3.1M billable tokens per session (0 to 2 spawns), roughly a 60% per-session reduction at the same output cadence.

## Running it yourself

From `kernel-panic-site/app/` (requires [bun](https://bun.sh)):

```
bun install
bun run typecheck                  # schema enforcement
bun run src/game/dev/sim.ts        # balance harness; tutorial must print 0/200
bun run src/game/dev/run-sim.ts    # run-layer invariants
bun run src/game/dev/teach-sim.ts  # every mechanic taught or waived
bun test tests/                    # window geometry tests
bun run build                      # production build
```

## Repository map

- `vault/` - the design vault (Obsidian, one idea per note; start at `vault/00-index/home.md`)
- `pipeline/` - per-cycle artifact exchange: proposals, gates, copy and art orders, validation reports
- `tutorial/` - the teaching ledger: what the player has been taught, by which moment
- `ui-demos/` - reviewed-before-integration UI lane with its approval manifest and the KP/OS design rulings
- `.claude/` - the crew: agent definitions, skills (plays), contracts, hooks
- `CLAUDE.md` - the dev charter: ground truth order, iron rules, verification gate
- `kernel-panic-site/` - the game (nested repo)
