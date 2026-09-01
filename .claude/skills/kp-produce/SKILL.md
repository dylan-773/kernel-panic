---
name: kp-produce
description: Run a full Kernel Panic production cycle - brief, parallel proposals, loremaster gate, integration, validation, balance loop, report.
disable-model-invocation: true
---

# Production Cycle (Orchestrator play)

You are the Orchestrator (main session): the sole code owner. Crew agents propose; you integrate; harnesses judge. Run these steps in order. If the user's invocation named a scope (e.g. "4 customers and 2 augments"), that becomes the brief.

1. **Brief.** Write `pipeline/BRIEF.md`: a short id (e.g. `expansion-2`), the goal, the item budget per agent, any curve-target overrides, and the art budget for this cycle. Without a stated art budget, agents must reuse existing assets.

2. **Proposals (parallel).** Spawn only the agents the brief needs, in one parallel batch: `encounter-generator`, `ability-agent`, `arc-composer`, `narrative-director`, `ux-agent`. Each reads the brief and writes its namesake file under `pipeline/proposals/`. If `ability-agent` or `arc-composer` is in scope and no fresh `pipeline/validation/report.md` exists, run the `validation` agent FIRST - those two design from numbers.

3. **Gates (parallel).** Spawn `loremaster` and `tutorial-agent` in one batch: they review the same proposals for different questions. The Loremaster asks "is it true?" and writes `pipeline/gates/loremaster-review.md`. The Tutorial Agent asks "does the player know?" and writes `pipeline/gates/tutorial-review.md` plus its own proposal of teaching moments. Both can hold an item.
   - For each REVISE: re-spawn only the affected agent with the loremaster's citation and ask for a revision of just those items. Maximum 2 revise rounds; still-contested items are dropped from the cycle and listed in the final report for the user to arbitrate.
   - For each CHALLENGE (a gate believes the DOC is wrong or stale): do not revise the item and do not update the doc yourself. Carry the challenge to the user (mid-cycle if it blocks integration, in the report otherwise) with the quoted doc line, the artifact's position, and the gate's recommendation. The user rules; the winning side gets written (vault edit or item revision) before the item integrates.
   - For each NEEDS-TEACHING: the fix is whatever the verdict names. Tier 0 goes to `ux-agent` as a ui-spec (re-spawn it), tiers 1 and 2 arrive as `teaching-moment` items you integrate. An item that ships a mechanic with no moment and no waiver does not ship: hold it to the next cycle rather than integrating a mechanic the player cannot learn.

3b. **Copy orders.** If `tutorial-agent` filed orders under `pipeline/copy/orders/` with `status: "open"`, re-spawn `narrative-director` to fulfill them. It fills `title` and `lines` in place and mirrors them as `teach-copy` items. Teaching moments integrate with placeholder lines only if the user has said to ship ahead of the copy pass.

4. **Integrate (you, by hand).** Translate APPROVED items into the game's content modules: customers to `content/customers.ts`, augments to `content/kit.ts` (+ reducer hooks per `engineNote`), day deltas to `content/arc.ts`, journal/scenes/day lines to `content/journal.ts` / `content/story.ts`, teaching moments and mechanic rows to `content/teaching.ts`, sfx presets to `audio.ts`, ui-specs to the components/styles they name. A new `teaching-moment` also needs its `<Teach id="...">` placed inline at the surface it names, and a new `when` trigger needs a signal at that call site. Match surrounding code style. Typecheck is the schema enforcer - run it as you go.

5. **Validate.** Spawn `validation`. PASS: continue. FAIL or PASS WITH DRIFT on a curve the brief cares about: run the balance loop - spawn `ability-agent` + `arc-composer` in parallel with the fresh report, gate any new player-facing copy, integrate, re-validate. Maximum 3 loop iterations; if still failing, revert the offending integration (git makes this cheap) and report. A `teach-sim` failure is never fixed by loosening the harness: it means a mechanic shipped untaught, so either author the moment or write the waiver.

6. **Art (if ordered).** Any open art orders: spawn `art-lead`, then review each `pipeline/art/done/` PNG yourself before installing into `app/public/assets/px/` and wiring paths.

7. **Close the cycle.** Archive `pipeline/BRIEF.md` to `pipeline/briefs/<id>.md` (the root file must not outlive the cycle), mark every proposal item with its outcome (`integrated` / `dropped` / `held`), and append a dated line to `vault/00-index/revision-history.md`.

8. **Report and stop.** Summarize: items shipped per agent, items dropped and why, NEEDS-TEACHING items and how each was closed, final verdict + curve, credits spent. Then TWO sections the user reads first: **CHALLENGES** (every gate challenge and unresolved doc dispute, with the quoted lines) and **SUGGESTIONS** (every `suggestion` item from every agent, verbatim ideas, none dropped silently). Then STOP. Deploy only on explicit user OK, via the charter's Pi flow.
