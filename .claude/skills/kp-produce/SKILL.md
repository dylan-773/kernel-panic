---
name: kp-produce
description: Run a full Kernel Panic production cycle - brief, parallel proposals, loremaster gate, integration, validation, balance loop, report.
disable-model-invocation: true
---

# Production Cycle (Orchestrator play)

You are the Orchestrator (main session): the sole code owner. Crew agents propose; you integrate; harnesses judge. Run these steps in order. If the user's invocation named a scope (e.g. "4 customers and 2 augments"), that becomes the brief.

1. **Brief.** Write `pipeline/BRIEF.md`: a short id (e.g. `expansion-2`), the goal, the item budget per agent, any curve-target overrides, and the art budget for this cycle. Without a stated art budget, agents must reuse existing assets.

2. **Proposals (parallel).** Spawn only the agents the brief needs, in one parallel batch: `encounter-generator`, `ability-agent`, `arc-composer`, `narrative-director`, `ux-agent`. Each reads the brief and writes its namesake file under `pipeline/proposals/`. If `ability-agent` or `arc-composer` is in scope and no fresh `pipeline/validation/report.md` exists, run the `validation` agent FIRST - those two design from numbers.

3. **Gate.** Spawn `loremaster` to review all proposal files and art orders. It writes `pipeline/gates/loremaster-review.md`. For each REVISE: re-spawn only the affected agent with the loremaster's citation and ask for a revision of just those items. Maximum 2 revise rounds; still-contested items are dropped from the cycle and listed in the final report for the user to arbitrate.

4. **Integrate (you, by hand).** Translate APPROVED items into the game's content modules: customers to `content/customers.ts`, augments to `content/kit.ts` (+ reducer hooks per `engineNote`), day deltas to `content/arc.ts`, journal/scenes/day lines to `content/journal.ts` / `content/story.ts`, sfx presets to `audio.ts`, ui-specs to the components/styles they name. Match surrounding code style. Typecheck is the schema enforcer - run it as you go.

5. **Validate.** Spawn `validation`. PASS: continue. FAIL or PASS WITH DRIFT on a curve the brief cares about: run the balance loop - spawn `ability-agent` + `arc-composer` in parallel with the fresh report, gate any new player-facing copy, integrate, re-validate. Maximum 3 loop iterations; if still failing, revert the offending integration (git makes this cheap) and report.

6. **Art (if ordered).** Any open art orders: spawn `art-lead`, then review each `pipeline/art/done/` PNG yourself before installing into `app/public/assets/px/` and wiring paths.

7. **Report and stop.** Summarize: items shipped per agent, items dropped and why, final verdict + curve, credits spent. Then STOP. Deploy only on explicit user OK, via the standing flow (commit, push, deploy_website, live marker check).
