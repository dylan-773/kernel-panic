---
name: kp-tutorial
description: Audit and repair Kernel Panic's teaching coverage - sweep every shipped mechanic against the teaching ledger, author the missing moments, and re-validate.
disable-model-invocation: true
---

# Teaching Pass (Orchestrator play)

Scope: what the player understands. Use this when the tutorial feels stale,
after a stretch of feature work, or before a deploy that adds mechanics.
Unlike `/kp-produce`, the audit sweeps the WHOLE shipped surface, not just
this cycle's proposals.

You are the Orchestrator: the sole code owner. Run these in order.

1. **Brief.** Write `pipeline/BRIEF.md` with a `teaching-<date>` id. If the
   user named a symptom ("nobody knows what par is", "the day-end screen is
   confusing"), that is the brief. Otherwise the brief is a full sweep.

2. **Audit.** Spawn `tutorial-agent` with an explicit full-sweep instruction:
   walk `content/teaching.ts`'s inventory against what the game actually
   ships, find mechanics that exist in code but not in the inventory,
   re-check every waiver against its named surface, and flag moments that
   fire at the wrong time. It writes `pipeline/gates/tutorial-review.md`,
   `pipeline/proposals/tutorial-agent.json`, and updates `tutorial/ledger.md`.

3. **Split the verdicts.** Read the gate file yourself.
   - **Tier 0** items: re-spawn `ux-agent` with the specific label or
     affordance change. A clearer readout beats a coachmark every time.
   - **Tiers 1 and 2**: already in the tutorial agent's proposal as
     `teaching-moment` items. Nothing to route.
   - **Tier 3**: hand to `narrative-director` as a scene request, not a
     coachmark.

4. **Copy.** Spawn `narrative-director` to fulfill every open order under
   `pipeline/copy/orders/`. It fills `title` and `lines` in place and mirrors
   them as `teach-copy` items. The tutorial agent specified the moment; the
   narrative director owns the words.

5. **Canon gate.** Spawn `loremaster` on the new copy. Teaching copy is
   player-facing, so it passes the same gate as everything else. REVISE goes
   back to `narrative-director` with the citation.

6. **Integrate (you, by hand).** Moments and mechanic rows into
   `content/teaching.ts`; every new moment also needs its `<Teach id="...">`
   placed inline at the surface it names, with the signal its `when` requires.
   Waivers become inventory entries with a `waiver` string. Tier 0 changes go
   to the component or style they name.

7. **Validate.** Spawn `validation` for the full four-command gate. A
   `teach-sim` failure means a mechanic is still uncovered: author the moment
   or write the waiver. Never loosen the harness to make it pass.

8. **Report and stop.** Summarize: mechanics newly covered, waivers retired
   or renewed, tier 0 fixes made instead of coachmarks, and the harness line.
   Then STOP. Deploy only on explicit user OK.
