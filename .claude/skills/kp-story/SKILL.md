---
name: kp-story
description: Run a Kernel Panic story pass - ledger check, narrative proposals, loremaster gate, integrate, verify run-sim invariants.
disable-model-invocation: true
---

# Story Pass (Orchestrator play)

Scope: journal entries, opener/ender scenes, day lines, reveal scheduling, story art orders. No mechanics, no balance.

1. Write/refresh `pipeline/BRIEF.md` (`story-<date>`): which runs or beats the user wants covered, art budget (default: none).
2. If `lore/ledger.md` is stale relative to shipped content (new entries since last canonization), spawn `loremaster` to refresh it first - the Narrative Director paces against the ledger's knowledge table.
3. Spawn `narrative-director`. It writes `pipeline/proposals/narrative-director.json` and files any art orders.
4. Spawn `loremaster` to gate. REVISE items go back to the Narrative Director with citations; max 2 rounds, contested items drop to the report.
5. Integrate approved items by hand into `content/journal.ts` and `content/story.ts` (map portrait/still tokens to the file's constants; keep the switch-statement idiom and the cycling fallbacks intact).
6. Verify: `cd /Users/lyd0n/Development/kernel-panic/kernel-panic-site/app && bun run typecheck && bun run src/game/dev/run-sim.ts` (run-sim asserts DAY_LINES, scene coverage 1-12, finale beats). Full sim.ts is not needed for copy-only changes.
7. If art orders were filed and budgeted, run the `/kp-art` play next. Report and STOP; deploy only on explicit user OK.
