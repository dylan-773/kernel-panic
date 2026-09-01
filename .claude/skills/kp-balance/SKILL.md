---
name: kp-balance
description: Run a Kernel Panic balance pass - validate, propose ability/arc changes, integrate, re-validate until curve targets hit or 3 rounds.
disable-model-invocation: true
---

# Balance Pass (Orchestrator play)

Scope: the difficulty curve and the ability catalog only. No story, no art, no UX.

1. If the user gave targets or symptoms ("day 6 feels flat"), note them at the top of `pipeline/BRIEF.md` as a `balance-<date>` brief with any curve-target overrides.
2. Spawn `validation` for a fresh `pipeline/validation/report.md`. (Or run `/kp-balance-loop`, which does this step and step 3 as one deterministic workflow.)
3. Spawn `ability-agent` and `arc-composer` in parallel with the report. Each proposes to its namesake file; both must cite the report's numbers.
4. Gate: only items with player-facing copy (new/renamed augments, desc changes) need `loremaster`; pure number deltas skip the gate. Anything that adds a new verb, resource, or readable number needs `tutorial-agent` as well; a retuned value the player never reads does not.
5. Integrate approved items by hand (you are the sole code owner): `content/arc.ts` deltas, `content/kit.ts` augments plus any reducer hooks their `engineNote` demands, and any `teaching-moment` or `mechanic` rows into `content/teaching.ts`.
6. Re-validate. Repeat from step 3 at most 3 times. If targets still miss, git-revert the pass and report what resisted - the user decides next.
7. Close the cycle: archive `pipeline/BRIEF.md` to `pipeline/briefs/<id>.md`, mark proposal items with outcomes, append a dated line to `vault/00-index/revision-history.md`. If curve TARGETS moved this pass, update them in their one home, `vault/50-tech/verification-gate.md`, and nowhere else.
8. Report the before/after curve table, plus every CHALLENGE and every `suggestion` item verbatim. STOP; deploy only on explicit user OK.
