# Kernel Panic dev charter

This repo is Kernel Panic: the game (nested repo `kernel-panic-site/`, app under `app/`), the design vault (`vault/`), the teaching ledger (`tutorial/`), and an AI dev crew for content production (`.claude/agents/`, invoked through the `/kp-*` plays).

RULING 2026-08-31: the game is the KP/OS desktop webapp on `main`, whole and entire. The Unity port, the 2.5D overworld, and the day-is-the-run redesign are dead directions preserved on branches (`day-is-the-run` in both repos). Never build toward them unless the user reopens them.

## Ground truth, in order of authority

1. The user's word in the current session.
2. The code on `main` (`kernel-panic-site/app/src/`). Split boards is MERGED on main.
3. The design vault: `vault/`, an Obsidian vault of one-idea wikilinked notes. Start at `vault/00-index/home.md`; conventions (kebab-case, wikilinks only, never retype a number when you can cite the symbol, no em or en dashes) in `vault/00-index/vault-conventions.md`. Every note declares `status`: `canon`, `derived`, `draft`, or `unwritten`. Story canon lives at `vault/60-story/`, rulings under `vault/60-story/rulings/` (cited by number; append, never renumber). `lore/bible.md` and `lore/ledger.md` are pointer stubs.
4. The UI spec: **`ui-demos/RULINGS.md` IS the KP/OS v3 "instrument panel" system; read it before building any surface.** Reference implementation: `ui-demos/loadout-eva/` (LOADOUT.CFG), approved and integrated. Window components live in `src/components/os/windows/`, primitives in `kp-ui.tsx`; `ui-demos/manifest.json` is the durable review record and the one accurate status ledger for demos.

A doc that disagrees with shipped code or with the user is a doc bug: fix the doc or flag it. Never silently obey a stale document, and never silently ignore it either.

## Default mode: direct work

Most sessions are freeform. Work as the Orchestrator directly: edit the site, the vault, the demos, run the gate yourself. The crew exists for content fan-out cycles (the `/kp-*` plays), where parallel specialists and gates earn their overhead. Do not route small fixes, infra, or docs work through specialist agents, and do not spawn gates for work the user asked for directly; gates judge crew proposals.

## Iron rules

1. Only the Orchestrator (main session) writes `kernel-panic-site/`. Agents write `pipeline/`, `vault/60-story/`, and `tutorial/` only; `bun run typecheck` is the schema enforcer.
1b. UI is REVIEWED BEFORE IT INTEGRATES. A `/kp-ui` cycle ends at a demo under `ui-demos/<id>/`, registered in `ui-demos/manifest.json` at `status: awaiting`; the user approves at `http://localhost:4180/kernel-panic-ui` (`bun ui-demos/_review/serve.ts`). Only `status: approved` demos integrate, and integration flips them to `complete`. Redesigning an EXISTING window is pure UI: no gates, no game-code detours (per RULINGS.md "Process").
2. Crew-proposed outward-facing artifacts pass the Loremaster gate ("is it true?", citing `vault/60-story/` by quoted line; verdicts APPROVE / REVISE / CHALLENGE / NOTE) and, when they add something the player must understand, the Tutorial gate ("does the player know?", citing `tutorial/ledger.md`; verdicts COVERED / NEEDS-TEACHING / CHALLENGE). REVISE and NEEDS-TEACHING must quote the doc line they rest on; NOTE is advisory and never blocks. CHALLENGE means the doc itself looks wrong or stale: quote it, propose the doc change, recommend which side bends; the user rules. A reviewer that cannot cite a line cannot block.
3. Agents are expected to be ADDITIVE, not just compliant. Every proposal should carry at least one `suggestion` item: an adjacent improvement, a missing feature or asset, or a doc contradiction noticed en route. Suggestions are exempt from lane fences and gates, and the Orchestrator surfaces every one in the cycle report. An agent that noticed something and filed nothing did the wrong thing.
4. Ability and curve changes enter only through the balance loop, with before/after sim numbers.
5. Nothing deploys unless the verification gate is green. Deploy only on explicit user OK.
6. Game copy never contains em or en dashes.
7. Every play that opened a cycle brief ends with cycle close: archive `pipeline/BRIEF.md` to `pipeline/briefs/<id>.md`, mark proposal items integrated/dropped, update `ui-demos/manifest.json` and the RULINGS.md queue if UI shipped, and append a dated line to `vault/00-index/revision-history.md`. Exceptions: a `/kp-ui` PROPOSE ending at `awaiting` leaves its brief live until integrate or an explicit close; briefless plays (`/kp-art`, `/kp-canonize`, `/kp-audit`) just append the revision-history line when they changed durable state. A live `BRIEF.md` means an open cycle; when none exists, agents take direction from their spawn prompt.

## Verification gate (run all four before any deploy)

Always `cd /Users/lyd0n/Development/kernel-panic/kernel-panic-site/app` first (cwd drift resolves a broken global toolchain):

```
bun run typecheck
bun run src/game/dev/sim.ts        # tutorial MUST print 0/200
bun run src/game/dev/run-sim.ts    # run-layer invariants
bun run src/game/dev/teach-sim.ts  # every mechanic taught or waived; exit 1 names the gap
```

Curve targets live in ONE place: `vault/50-tech/verification-gate.md`. Gate the KITTED curve; the kit-less proxy is a floor only (it never locks, wards, or purges; finale 0 by construction under `oppOpens`). The latest measured numbers live in `pipeline/validation/report.md`. Do not retype curve numbers anywhere else.

`bun run dev` SSR is broken in this template; verify builds with `bun run build` + a fetch against `dist/server/server.js`.

## The crew (plays only)

Nine specialists in `.claude/agents/`: loremaster (canon + gate), tutorial-agent (teaching + gate), narrative-director (story/copy), encounter-generator (customers), ability-agent (catalog), arc-composer (curve), validation (harnesses), ux-agent (KP/OS specs + sound), art-lead (asset fabrication). Contracts every agent preloads: `.claude/skills/kp-contracts/`. Plays: `/kp-produce`, `/kp-balance` (+ `kp-balance-loop` workflow), `/kp-story`, `/kp-tutorial`, `/kp-ui`, `/kp-art`, `/kp-canonize`, `/kp-audit` (gap hunt: missing features, assets, drift).

## Traps

- SPLIT BOARDS (merged on main): each side owns a grid, `DuelState.boards[side]`. No territory, no claiming. Two layers: `built` (ever lit, permanent, what reach walks from) and `power` (live now, cuttable). Which grid a verb touches is fixed by the verb: rotate/place -> your own, ATTACK -> theirs, DEFEND -> your own.
- Rotation is unidirectional (`(rot + 1) % 4`, `rotCostFor` searches forward only), so one enemy REDIRECT costs 3 RAM to undo on an elbow or T and 1 on a straight. That exchange rate is what makes reaching across worth the RAM; do not "fix" it into a shortest-way-round.
- Difficulty scales through `horizon` (0-3) and `focus` (per-turn); `greed` is per-rotation movement texture only.
- Two tier vocabularies: program tiers 1-3 vs job/customer/day difficulty tiers 1-5 (`oppKitFor` maps between them).
- Exactly one teaching callout renders at a time, chosen by `order` across every mounted `<Teach>`. A moment that "never appears" is usually losing the tie to a lower order, not broken. `notBeforeDay` gates day 0, so the opening dive takes no coachmarks by construction.
- sfxr envelope values are plain seconds, never normalized knobs.
- PixelLab is a nearly empty trial; Higgsfield nano_banana_pro (2 credits/image) is the working art generator. Window imagery uses the 1-bit dither treatments (`pipeline/tools/dither.py`), pixel assets use `pxpost.py`.
- `bun run preview` serves a SNAPSHOT: rebuilds change asset hashes, so kill and restart the preview server after `bun run build` or the page 404s its own stylesheet. `bun dist/server/server.js` serves SSR only, not static assets. localStorage saves are per-port.
- Agents must never leave `.claude/agent-memory/` dirs inside `kernel-panic-site/` or `lore/`; the shared home is repo-root `.claude/agent-memory/<agent>/`.
- `pipeline/` is per-cycle scratch and is NOT in the vault; lift durable findings into notes. `ui-demos/manifest.json` is durable and never cleared.

## Deploy (Orchestrator only, on explicit user OK)

Two deploys, both Orchestrator-only:

- **Public: Higgsfield.** `https://kernel-panic.higgsfield.app`. The repo host moved to `apps-repos.higgs.ai` on 2026-09-01 (the old `higgsfield.ai` endpoint 404s, which briefly read as dead); mint fresh credentials with `website_repo_access` each time rather than trusting the stored `origin` URL, push `main`, then `deploy_website`.
- **Tailnet: the Pi.** Serves over Tailscale on :8445 (systemd user unit `kernel-panic.service`, serve wrapper outside the repo at `~/Development/kp-deploy/serve.ts`; host details in private notes, not in this repo). Ship: commit in `kernel-panic-site/`, push to GitHub (the dylan-773 personal remote ONLY; project content never touches the work GitHub), then on the Pi: `git pull`, `bun install`, `bun run build`, `systemctl --user restart kernel-panic`.
