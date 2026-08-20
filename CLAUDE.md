# Kernel Panic dev crew charter

This repo is the home of Kernel Panic: the game (nested repo `kernel-panic-site/`, app under `app/`, live at kernel-panic.higgsfield.app), the DESIGN VAULT (`vault/`), the teaching ledger (`tutorial/`), and the AI dev crew that produces content for it.

THE DESIGN DOCUMENT IS `vault/`, an Obsidian vault. **Open `vault/` in Obsidian; start at `vault/00-index/home.md`.** 214 notes, one idea each, wikilinked. It is the source of truth for design, mechanics, story, canon, teaching, presentation, tech and crew. Every note declares `status` in frontmatter: `canon` (matches shipped code or settled canon), `derived` (read out of code, never previously written down), `draft` (a proposal, needs review), `unwritten` (no decision exists; the note holds the open questions). Conventions in `vault/00-index/vault-conventions.md`; full index in `vault/00-index/table-of-contents.md`. The old `gdd/` HTML and PDFs are archived OUTSIDE the repo at `~/Documents/Kernel Panic/GDD renders/` and are frozen. `lore/bible.md` and `lore/ledger.md` are now pointer stubs: canon lives at `vault/60-story/`, with the numbered rulings under `vault/60-story/rulings/` (cited by number; append, never renumber).

THE GAME AS BUILT (2026-08-19, the day-is-the-run build): two environments. A walkable 2.5D shop rendered by PHASER (painted isometric rooms + PixelLab sprites; `app/src/game/overworld/` holds `world.ts` geometry, `scene.ts` engine, `bridge.ts` React seam; Phaser is client-only via dynamic import, never SSR'd) and KP/OS on the bench terminal (sit to enter, STAND UP to leave). The day is the run: pay is HELD until the shop is closed at the stairs, strain 0 deletes the day's envelope and never touches the shop layer. Three save objects per slot: meta / shop / day (`save.ts`). Difficulty is tier-indexed (`content/tiers.ts`), repairs are physical objects bought in the evening (`content/repairs.ts`), Sunday is the machine's only day. `game-shell.tsx` conducts; the duel and day reducers stay engine-free, which is what the sims drive.

DESIGN STANDARD: the KP/OS v3 "instrument panel" system. **`ui-demos/RULINGS.md` is the spec; read it before building any surface.** Reference implementation: `ui-demos/loadout-eva/` (LOADOUT.CFG), still awaiting final approval, but the system is settled. In short: colour is EIGHT ROLE TOKENS carrying state (`--r-struct` `--r-note` `--r-line` `--r-data` `--r-ok` `--r-warn` `--r-aux` `--r-hazard`), remapped by `data-scheme` (NERV, TOKYO NIGHT) and collapsing back onto the single v2 accent by default; risk never shares its colour and is never signalled by colour alone; one focal element per surface at extreme scale with a stated glance order; every size a `clamp()` on CONTAINER units (`cqi`, never `vw`) with one breakpoint at 700px; a hard height ceiling of ~700px so windows tile; no internal scrollbars ever; 1-bit diegetic imagery at 1:1, cropped never downscaled, in ink-tint/true/full-colour treatments; flat CRT glass over the stage (no curved); `steps()` motion reserved for alarms, animated on compositor properties only. v2's single-phosphor law survives as the default, not as the only option. Window map (day-is-the-run build): the shop floor scene owns intake and story scenes (the flow window is GONE); INBOX fronts the one held ticket with the readout and DIVE button, REPAIR.LOG fronts result (pay marked HELD), SOLDER.BAY owns crafting, DIVE.EXE is the full-screen duel, NIGHT.SYS is a real window (the salvage deck shop), DARKNET.LNK, LEDGER.LOG and DAD.LOG unlock by repair; `src/components/os/windows/` holds the window components, `win-defs.ts` the registry, `kp-ui.tsx` the primitives. The room's own interface (HUD, prompts, intake, station panels) is `src/components/scene/room-ui.tsx` and is a scene layer, not governed by the window laws.

## The crew

The MAIN SESSION is the ORCHESTRATOR: the only agent that ever edits `kernel-panic-site/` (code, content modules, assets). Nine specialists live in `.claude/agents/` and write only to `pipeline/`, `vault/60-story/`, and `tutorial/`:

| agent | owns | writes |
|---|---|---|
| loremaster | canon: setting bible + story ledger; approve/revise gate | `vault/60-story/*`, `pipeline/gates/` |
| tutorial-agent | teaching coverage; covered/needs-teaching gate | `tutorial/ledger.md`, `pipeline/gates/`, `pipeline/proposals/tutorial-agent.json`, copy orders |
| narrative-director | reveal pacing, journal/scenes/day lines, story art briefs, teaching copy | `pipeline/proposals/narrative-director.json`, art orders, copy-order fulfillment |
| encounter-generator | customer profiles ("One Wow" per job) | `pipeline/proposals/encounter-generator.json` |
| ability-agent | augment/mode catalog, synergy + counter pairs | `pipeline/proposals/ability-agent.json` |
| arc-composer | the per-tier difficulty table (`content/tiers.ts`) | `pipeline/proposals/arc-composer.json` |
| validation | runs the harnesses, reports numbers vs targets | `pipeline/validation/report.md` |
| ux-agent | KP/OS layout, feel, animation, SOUND | `pipeline/proposals/ux-agent.json`, art orders |
| art-lead | fulfills art orders (Higgsfield primary, palette-pinned + pxpost) | `pipeline/art/done/`, order statuses |

Two gates, asked of the same artifacts before anything integrates. The Loremaster asks "is it true?" and cites `vault/60-story/` (by QUOTED LINE, never by line number, which is why the vault migration invalidated no verdicts). The Tutorial Agent asks "does the player know?" and cites `tutorial/ledger.md`. Either can hold an item back.

Plays (user-invoked): `/kp-produce` (full cycle), `/kp-balance` (curve+catalog), `/kp-story`, `/kp-tutorial` (teaching audit + repair), `/kp-ui` (UX pass, ends at a reviewable demo; `/kp-ui integrate the approved UI demos` lands them), `/kp-art`, `/kp-canonize`. Workflow: `/kp-balance-loop` (validate then propose, no integration). Contracts every agent is preloaded with: `.claude/skills/kp-contracts/`.

## Iron rules

1. Only the Orchestrator touches `kernel-panic-site/`. Agents propose structured JSON; the Orchestrator integrates by hand; `bun run typecheck` is the schema enforcer.
1b. UI is REVIEWED BEFORE IT INTEGRATES. A `/kp-ui` cycle ends at a demo under `ui-demos/<id>/`, registered in `ui-demos/manifest.json` at `status: awaiting`; the user approves or sends it back at `http://localhost:4180/kernel-panic-ui` (`bun ui-demos/_review/serve.ts`). Only `status: approved` demos are eligible for `/kp-ui integrate`, and integration flips them to `complete`. The manifest is durable: unlike `pipeline/`, it is never cleared between cycles.
2. The Loremaster gates every outward-facing artifact before integration. REVISE verdicts must cite a bible/ledger line.
3. The Tutorial Agent gates every artifact that adds something the player must understand: a mechanic, a stat, a screen, a resource, a purchase. NEEDS-TEACHING verdicts must cite a `tutorial/ledger.md` line. Teach at first contact, never by cramming the opening dive; prefer a clearer interface (tier 0) over a coachmark.
4. Ability and curve changes enter only through the balance loop, with before/after sim numbers.
5. Nothing deploys unless the verification gate is green, including tutorial 0 wins in 200 seeds and full teaching coverage. Deploy only on explicit user OK.
6. Game copy never contains em or en dashes.

## Verification gate (run all four before any deploy)

Always `cd /Users/lyd0n/Development/kernel-panic/kernel-panic-site/app` first (cwd drift resolves a broken global toolchain):

```
bun run typecheck
bun run src/game/dev/sim.ts        # tutorial MUST print 0/200; self-gates the tier bands
bun run src/game/dev/run-sim.ts    # day-machine invariants incl. the bust property
bun run src/game/dev/teach-sim.ts  # every mechanic taught or waived; exit 1 names the gap
```

The curve is TIER-INDEXED (the run layer is gone): `sim.ts` self-gates the kitted
win rate per tier against `WIN_BANDS` (t1 65-95, t2 65-95, t3 45-75, t4 35-70,
t5 25-70; backroom 15-60; measured 2026-08-19: 81.5/85.5/60/52.5/48.5, backroom
39.5). The kit-less proxy is a floor and nothing more. Also self-gated: measured
`pd` within 2.0 of `pdTarget` per tier, and the backroom's tier-1-equivalent
close count at exactly 0. `run-sim.ts` gates the BUST PROPERTY: a busted day
leaves the shop layer bit-identical.

`bun run dev` SSR is broken in this template; verify builds with `bun run build` + a fetch against `dist/server/server.js`.

## The design vault

`vault/` is the whole design document, and it is where documentation work goes.

- **Start at** `vault/00-index/home.md`. Full list: `vault/00-index/table-of-contents.md`.
- **Areas**: `10-design` (pitch, pillars, loop, flowchart) · `20-mechanics` (duel, kit, 18 augments, economy) · `30-content` (tiers, twelve customers, DAD.LOG) · `40-presentation` (KP/OS, the shop floor, the UI laws) · `50-tech` (stack, saves, harnesses) · `60-story` (ground truth, characters, the numbered rulings) · `70-teaching` · `80-crew` (ten agents) · `90-business`.
- **Rules** (`vault/00-index/vault-conventions.md`): one idea per note; kebab-case filenames; wikilinks only; **never retype a number, cite the symbol that holds it** (`PLACE_COST = 4`, `patch-cells.ts`); no em or en dashes anywhere.
- `vault/80-crew/memory` symlinks `.claude/agent-memory/`, and `vault/_attachments/art` symlinks `pipeline/art/done/`. Do not copy binaries into the vault.
- **`pipeline/` is deliberately NOT in the vault**: it is per-cycle scratch that gets cleared. Lift durable findings into notes; leave the dated verdicts.
- Open questions carry `status: unwritten`. Currently: `monetization`, `meta-progression`, `palette-generalization-conflict`.

## Traps

- SPLIT BOARDS (branch `split-boards`): each side owns a grid, `DuelState.boards[side]`. There is no territory and no claiming. Two layers instead: `built` (ever lit, permanent, what reach walks from) and `power` (live now, cuttable). Which grid a verb touches is fixed by the verb, never by the payload: rotate/place -> your own, ATTACK -> theirs, DEFEND -> your own.
- Rotation is unidirectional (`(rot + 1) % 4`, `rotCostFor` searches forward only), so one enemy REDIRECT costs 3 RAM to undo on an elbow or T and 1 on a straight. That exchange rate is what makes reaching across worth the RAM; do not "fix" it into a shortest-way-round.
- Difficulty scales through `horizon` (0-3, what the machine understands) and `focus` (per-turn, does not compound with duel length). `greed` is per-rotation movement texture only.
- Two tier vocabularies: program tiers 1-3 vs job/customer/day difficulty tiers 1-5 (`oppKitFor` maps between them).
- Exactly one teaching callout renders at a time, chosen by `order` across every mounted `<Teach>`. A moment that "never appears" is usually losing the tie to a lower order on the same screen, not broken. `notBeforeDay` gates day 0, so the opening dive takes no coachmarks by construction.
- sfxr envelope values are plain seconds, never normalized knobs.
- Live-site checks need `curl --compressed` and ~20s CDN settle; grep all JS chunks for marker strings.
- PixelLab (paid subscription since 2026-08-19) is the overworld generator: painted rooms via `create_image_pro`, sprites via `create_character` + walk animations (10-job concurrency cap; `inpaint_image` needs `image_url`, inline base64 truncates in transit — serve crops over the Tailscale funnel on 8443). Higgsfield nano_banana_pro (2 credits/image) stays the window-imagery generator. Window imagery uses the 1-bit dither treatments (`pipeline/tools/dither.py`), pixel assets use `pxpost.py`, customer walk sheets compose via `pipeline/tools/customer-sheets.py`.
- Phaser is CLIENT-ONLY: loaded by dynamic `import("phaser")` in an effect. Never import it statically anywhere SSR reaches, or the Worker build breaks (`ssr.noExternal: true` bundles everything). After scene-layer changes, confirm phaser lands in a client chunk only.
- Overworld geometry (walk polygons, obstacles, interactable zones, spawns) is data in `app/src/game/overworld/world.ts` over painted rooms; `interactableAt` picks by nearest ZONE CENTER because anchors sit on walls. Repaired-state art is baked onto the room texture at load (`room-<id>-live`); state patches live in `public/assets/overworld/states/`.
- `bun run preview` serves a SNAPSHOT: every rebuild changes asset hashes, so kill and restart the preview server after `bun run build` or the page 404s its own stylesheet and renders unstyled. `bun dist/server/server.js` serves SSR only, not static assets. localStorage saves are per-port.
- Agents must never leave `.claude/agent-memory/` dirs inside `kernel-panic-site/` or `lore/`; the shared home is repo-root `.claude/agent-memory/<agent>/`.

## Deploy (Orchestrator only, on user OK)

Commit in `kernel-panic-site/`, push to main (auth token comes from the Higgsfield `website_repo_access` tool; never print it), then `deploy_website` with website_id `ce0a9c8c-bae7-418c-909a-84648abdcf17`, then verify live markers.
