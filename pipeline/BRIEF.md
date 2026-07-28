# Brief: deep-balance-2026-07-28

The deferred balance pass, plus the two systems it was waiting on. This is
a production cycle with engine work: the Orchestrator lands three systems
(kitted sim profile, shaped patch pieces, boost bays) and the crew supplies
the content, copy, teaching, and curve numbers that make them ship-ready.

Context: the playtest note "late game is too easy, patches trivialize
entire levels" has been unmeasurable because `sim.ts` runs a kit-less,
rotation-only proxy. The validation report (playtest-repair-2026-07-27)
names the kitted profile as this pass's first task. Design decisions are
locked by the user and recorded in the Orchestrator's plan:

- Patch cells become shaped pieces (straight, elbow, tee, cross) with a
  fixed orientation rolled at acquisition, never rotatable in hand.
  Crafting combines two pieces into the geometric union of their arms,
  legal only when the union is strictly bigger than both inputs. The
  deterministic 35cr buy dies; acquisition is a dark-web random purchase,
  post-dive drops, and a reworked CLEAN RUN. Roll weights mirror board
  generation: I 40 / L 45 / T 12 / X 3.
- Boosts are capped at 3 bays, purchasable to 5 (150cr then 300cr).
  Configs stay outside the cap. Full bays draft as pick-to-swap.
- Catalog surgery from the user's tier list: surge, bulwark, carryCache,
  slagWard are cut and replaced; A/B tier gets buff analysis; above-S
  (hotBoot, echoTap) gets tone-down candidates. S is the target ceiling.
- Gridlock wins take a flat +6 strain chip at full pay.
- Economy is retuned sink-side only: nightPatchCost(day) = 45 + 5*day,
  bay costs above, darkPatchCost(day) = 25 + 5*(day - 1) as the opening
  values. Income is untouched.

## Scope

- **ability-agent**: the surgery. Confirm the four cuts. Author ~4
  replacement boosts as full proposals (synergy, counter, engineNote,
  desc >= 20 chars) from the directions in the plan: patch refund, pouch
  extension, clean-pay bender, first-trap forgiveness, overtime clause
  (tone flag), dark-web discount. New schema fields are available:
  `requires` ({kind:"augment"|"pouch"}) and `weight`. Buff/nerf proposals
  for the named A/B and above-S augments, each with the exact player-side
  call site: never touch SIPHON_STEAL, LOCK_ROUNDS, or WARD_ROUNDS, which
  are shared with the opponent.

- **arc-composer**: waits for Checkpoint A (the BEFORE kitted curve in the
  validation report). Then DayConfig deltas against the kitted targets
  (D1-3 86/84/82, D4-6 70/72/70, D7-9 64/58/55, finale 48) using the new
  levers: per-day `slag` density, `patchDrop` rates, late-day and finale
  grid growth (the "grid size almost never" default is waived by the user
  for this pass), and a finale package with an explicit parFlat. Hard
  gate: zero round-1 finale closes for the kitted profile.

- **ux-agent**: ui-specs for patch-pouch-strip, patch-ghost-preview,
  patch-craft-flow, darknet-window (the reveal beat is THE sfx/animation
  moment), result-drop-reveal, boost-bay card, and the pick-to-swap flow.
  Sfx orders: darknet reveal sting, craft success. Dock overflow on small
  screens is an acceptance criterion.

- **tutorial-agent**: mechanic inventory deltas (patchShapes, patchCraft,
  darkWebBuy replacing patchCellBuy, boostSlots, boostSwap, slotBuy,
  patchDrop as a waiver candidate), the new `swapOffered` and `craftReady`
  triggers (pre-authorized engine changes), retirement of the
  augmentPoolDry waiver, and the CARRY CACHE clause in the ram tip. Gate
  every artifact of this pass for teaching coverage.

- **narrative-director**: copy orders for the rewritten night-shop and
  patch-cell-use coachmarks, the new patch-craft coachmark, darknet window
  flavor (vendor and offline states), the gridlock endReason (it currently
  reads as a favor; it now costs strain), drop-row and capped variants,
  cleanRun desc rewrite, MANUAL sections (PATCH PIECES, boost bays).

- **loremaster**: gates the DARKNET framing (new outward-facing fiction),
  the overtime-clause tone flag, and all new copy.

- **validation**: runs the gate at every checkpoint; Checkpoint A records
  the first kitted curve as the BEFORE table; Checkpoint D adopts the
  final kitted bands and re-publishes the kit-less baseline (grid/slag
  changes are the one sanctioned re-baselining).

- **encounter-generator**: NOT in scope.

## Constraints

- Iron rules hold: agents propose, the Orchestrator integrates; ability
  and curve numbers enter only through the balance loop with before/after
  sim numbers.
- Augments bend the economy; they do not add verbs. Programs stay 1 RAM.
  SCAN never gains modes.
- Only engine-passive boosts enter the sim's BOOST_SCHEDULE.
- No em or en dashes in game copy. ALL CAPS titles. Coachmark caps hold.
- Art budget: darknet icons plus approved orders only. SVG-first for
  piece glyphs.

## Gate

`bun run typecheck`, `sim.ts` (tutorial 0/200; kit-less rows byte-identical
until Checkpoint D; kitted block with finale round-1 closes = 0),
`run-sim.ts` (new invariants: pouch cap, piece conservation, craft union,
severed under shaped rescue, bays <= slots, buySlot debit, gridlock chip),
`teach-sim.ts`. Never loosen a harness to make it pass.
