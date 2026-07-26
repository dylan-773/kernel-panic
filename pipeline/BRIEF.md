# Brief: teaching-2026-07-26

A teaching pass, not a production cycle. Scope is what the player
understands, swept across the WHOLE shipped surface, not just one cycle's
proposals. No new mechanics are being added by this brief.

Context: the teaching layer itself is one cycle old. It was stood up during
`story-retune-1` alongside PAR, patch cells, strain regen, the halt trap fix,
four new augments, and the mode retune. That means every inventory entry,
every waiver, and every coachmark in `content/teaching.ts` was authored in a
single sitting against a surface that was still moving. This pass is the
first chance to check that work against the game as it actually shipped.

## Scope

- **tutorial-agent**: full-sweep audit. Three questions, in this order.
  1. **Inventory completeness.** Walk the shipped surface against
     `MECHANIC_INVENTORY`. What exists in code that no inventory entry
     names? Read the reducers (`run-reducer.ts`, `duel-reducer.ts`,
     `duel-actions.ts`, `duel-power.ts`), the content modules, and every
     screen. A mechanic the player must understand that is absent from the
     inventory is invisible to `teach-sim`, which is the exact failure the
     ledger exists to prevent.
  2. **Waiver re-check.** Nine waivers, eight of them written the same day
     as the interfaces they describe. Open each named surface and confirm
     the claim is still literally true. A waiver whose surface has been
     restyled, shortened, or moved is dead. Say so and specify the moment
     that replaces it.
  3. **Firing correctness.** Every moment's `when`, `order`, `surface`, and
     `notBeforeDay` against where its `<Teach>` is actually mounted and
     what signals that call site supplies. Two known traps: only one callout
     renders at a time (lowest `order` across everything mounted wins), and
     `notBeforeDay` gates day 0. A moment that can never win its tie, or
     whose signal is never passed, is dead code that reads as coverage.

  Also close the ledger's own open item: file copy orders at
  `pipeline/copy/orders/<id>.json` for all ten existing coachmarks. Every
  line currently in `teaching.ts` is an Orchestrator draft standing the
  surface up; the words belong to the narrative-director. Include the tips
  if their wording needs the same treatment.

  Write `pipeline/gates/tutorial-review.md`,
  `pipeline/proposals/tutorial-agent.json`, and update `tutorial/ledger.md`.

- **ux-agent**: tier 0 items only, on re-spawn after the audit. A clearer
  readout beats a coachmark every time, so anything the audit can push up to
  tier 0 should go there instead of into `TEACHING`.

- **narrative-director**: fulfills every open copy order. Fills `title` and
  `lines` in place. Owns the words, not the moment. Also takes any tier 3
  item the audit raises, as a scene request rather than a coachmark.

- **loremaster**: gates the new copy. Teaching copy is player-facing and
  passes the same canon gate as everything else.

- **ability-agent, arc-composer, encounter-generator**: NOT in scope.

## Constraints

- No new mechanics. This pass explains what exists.
- Placement bias holds: reach for the highest tier that works. A proposal
  that skips a tier says why.
- The opening dive takes no coachmarks by construction (`notBeforeDay`
  gates day 0). Teaching goes at first contact, never crammed into day one.
- No em or en dashes in game copy.
- No art budget.

## Gate

Unchanged and non-negotiable: `bun run typecheck`, `sim.ts` (tutorial 0/200,
curve ~82/77/74/56/58/56/49/42/39, finale ~25), `run-sim.ts`, `teach-sim.ts`.
A `teach-sim` failure means a mechanic is uncovered: author the moment or
write the waiver. Never loosen the harness to make it pass.
