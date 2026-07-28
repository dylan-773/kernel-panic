# Loremaster gate - deep-balance-2026-07-28 - narrative-director, batch 1

Reviewed: `pipeline/BRIEF.md` (deep-balance-2026-07-28), `pipeline/proposals/narrative-director.json`
against `lore/bible.md` and `lore/ledger.md`. No art orders were open at gate time
(`pipeline/art/orders/` empty).

## narrative-director.json

- darknet-window: APPROVE
- gridlock-endreason: APPROVE
- result-screen-rows: APPROVE
- clean-run-desc: APPROVE
- manual-sections: APPROVE
- severed-endreason: APPROVE
- duel-toast-patch-piece: APPROVE

No canon or voice violations found. No em or en dashes in any copy string
(checked every item). ALL CAPS held for window titles, row headers, system
voice lines, and MANUAL.TXT headings (`DARKNET.LNK`, `SELLER: SIGNAL
SCRAMBLED. NO ID ON FILE.`, `PATCH PIECE RECOVERED`, `POUCH FULL (5/5)`,
`MARKET OFFLINE.`, `PATCH PIECES`, `BOOST BAYS`); sentence-case value lines
and the dealer's own quoted line follow the same pattern the bible already
allows for customer and system copy. None of the seven items touch the
Rhea/Dad/Patch reveal schedule, so the run-by-run knowledge table does not
apply to this batch; these are mechanical/system strings (a new trade
window, an endReason, result-screen rows, an augment desc, two manual
sections, a duel toast), not journal, scene, or dayline content.

NOTE (advisory, does not block): `clean-run-desc` describes the CLEAN RUN
trigger as "zero strain billed", which matches the engine's actual
`action.chip === 0` condition (`app/src/game/run-reducer.ts:293`). But
`result-screen-rows`' `cleanRunBanked`/`cleanRunCapped` lines still say "At
or under par, no traps sprung", carrying over the old (and only
approximate) shipped phrasing from `kit.ts`'s current `cleanRun.desc`. The
two items describe the same trigger two different ways within the same
proposal. This is not a canon contradiction (bible/ledger take no position
on the augment's trigger wording) so it is not a REVISE, but the
Orchestrator should pick one phrasing before integration so the loadout
description and the result-screen receipt do not read as two different
rules.

## Flag 1 - DARKNET dealer: anonymous handle vs. named presence

RULING: stay anonymous. Accepted as proposed.

No bible or ledger line requires every NPC to be named; the hard anonymity
law (ledger, Resolved ruling 8) is scoped to the family line only ("Forbids
any bill, document, gravestone, or line ever spelling out a first or last
name for the son, Dad, or a surname for Rhea"), not to every character in
the world - the twelve regulars all carry full names. So canon permits
either choice; this was a genuine open call, not a constraint. Anonymous
reads truer to the gray-market voice ("SIGNAL SCRAMBLED. NO ID ON FILE.")
and keeps a second parentless-secrecy figure from crowding Dad's specific
arc before it needs to. The proposed future hook (dealer anonymity as a
possible echo of Dad's own cash-only secrecy) is accepted as a live
option, not a commitment - no scene, journal entry, or line may use it
without a future explicit ruling.

Per the brief's instruction to decide gaps the proposal exposes: this was
an undecided canon question (the darknet did not exist in the bible or
ledger before this review), so it is now recorded as Resolved ruling 9 in
`lore/ledger.md`, appended after the 2026-07-25 rulings block.

## Flag 2 - does "salvage off a hundred dead machines" fit established canon?

RULING: yes, no contradiction found.

The bible never assigns patch cells/pieces a fictional origin before this
pass; in-dive they are only ever described as an effect ("the slag melts
into a live junction"). Nothing in `lore/bible.md`'s World, Technology
rules, or Shop sections claims a different source for spare parts, and the
world already supports a scrap/gray economy on its own terms: "Districts,
courier drones, lifter exosuits, clinics, pawn shops, night pharmacies,"
plus "Small businesses run close to the bone; medical debt is ordinary and
crushing." A darknet trade in salvage from scrapped machines is a
consistent extension of that economy, not an addition to it. Folded into
Resolved ruling 9 above, on the model of Resolved ruling 5's "mundane,
unexplained... no causal link to Patch, Dad, or the shop": the darknet's
salvage stock has no causal tie to Patch, Dad, or the back-room tower
either.

## Tally

Items seen: 7. Approved: 7. Revised: 0. Advisory notes: 1 (non-blocking).
Flags ruled: 2 (both resolved; one new ledger ruling added, Resolved
ruling 9, DARKNET).

# Gate 2 - deep-balance-2026-07-28 - copy orders + ability-agent, batch 2

Reviewed: the five filled coachmark copy orders in `pipeline/copy/orders/`
(copy-patch-cell-use, copy-night-shop, copy-patch-craft,
copy-augment-draft-line2, copy-boost-swap) and the relevant items in
`pipeline/proposals/ability-agent.json` (the four new boosts SPLICE REFUND,
FIRST FAULT, OVERTIME CLAUSE, DARKNET RATE; the eight revised descs CLEAN
RUN, LONG ARMS, SIPHON DRIVER, TRIPWIRE, TAP LINE, SWEEP CREDIT, WARD
DRIVER, JAM ANCHOR) against `lore/bible.md`, `lore/ledger.md`, the no
em/en-dash law, and the brief's own stated mechanics. Checked every string
in every item, including the internal `synergy`/`counter`/`engineNote`
fields, for stray em or en dashes (`grep '[—–]'` over both the proposal
file and the copy orders directory: no matches).

## pipeline/copy/orders/ (five filled orders)

- copy-patch-cell-use: APPROVE. "Arms land exactly as held, never rotating
  once placed" matches the brief's design decision ("fixed orientation
  rolled at acquisition, never rotatable in hand"). No dashes. Terminal
  voice, ALL CAPS title only.
- copy-night-shop: APPROVE. "You can no longer choose a shape... price
  climbing by the day" matches the brief's darkPatchCost(day) = 25 + 5*(day
  - 1) direction and correctly omits exact prices per its own constraint.
  No dashes.
- copy-patch-craft: APPROVE. States the union-and-legality rule
  ("strictly bigger... equal or smaller spends both pieces for nothing")
  consistent with the brief's crafting rule and with narrative-director's
  already-filed MANUAL.TXT PATCH PIECES paragraph. No dashes.
- copy-augment-draft-line2: APPROVE. Line 1 reproduced verbatim from
  shipped `teaching.ts`. Line 2's claim that a full bay "swaps instead of
  blocking" and never implies a dry pool is factually supported by the
  ability-agent notes' own pool math (18 total, 4 config + up to 5 bays =
  9 held max against 14 boosts in the pool). No dashes.
- copy-boost-swap: APPROVE. Correctly states CONFIGS sit outside the bay
  cap, matching bible: "Augments bend the economy; they never add verbs"
  and the brief's "Configs stay outside the cap." No dashes.

## pipeline/proposals/ability-agent.json - four new augments

- patchRefund (SPLICE REFUND): APPROVE. Pure mechanic, no lore claim, no
  dashes.
- firstFault (FIRST FAULT): APPROVE. "Neural Strain" as the billed
  resource matches bible: "Neural strain is the body's cost of diving."
  No dashes.
- overtimeClause (OVERTIME CLAUSE): APPROVE. Tone flag ruled explicitly
  below; new Resolved ruling 10 added to `lore/ledger.md` to close the gap
  the brief named.
- darkDiscount (DARKNET RATE): APPROVE. "The vendor still only takes
  credits and the roll stays blind" is consistent with Resolved ruling 9
  (DARKNET): anonymous, cash-only dealer, no causal tie to Patch, Dad, or
  the shop. No dashes.

## pipeline/proposals/ability-agent.json - eight revised descs

- cleanRun (CLEAN RUN): APPROVE. Mechanically sound and consistent with
  the brief's "reworked CLEAN RUN" direction. NOTE (advisory, does not
  block, continuing Gate 1's already-filed non-blocking note on this same
  augment): this item's own desc field ("at or under par with no traps
  sprung") still does not match narrative-director's already-approved
  `clean-run-desc` copy ("zero strain billed") or the currently shipped
  `kit.ts` line, which already reads as a third, merged phrasing. Bible
  and ledger take no position on the trigger's exact wording, so this
  stays a NOTE, not a REVISE; the Orchestrator should let the shipped
  `kit.ts` phrasing win and drop this item's desc field rather than
  overwrite it, since narrative-director's copy items own player-facing
  `desc` text under this cycle's own division of labor ("copy only, leave
  kind/synergy/counter/engineNote to ability-agent").
- longArms (LONG ARMS): APPROVE. No lore claim, no dashes.
- cfgArmSiphon (SIPHON DRIVER): APPROVE. "The core" matches bible: "Both
  signals race to the core." No dashes.
- tripwire (TRIPWIRE): APPROVE. Pure mechanic, no dashes.
- tapLine (TAP LINE): APPROVE. "The intrusion's planned route to the
  core" consistent with bible technology rules. No dashes.
- sweepCredit (SWEEP CREDIT): APPROVE. Pure mechanic, no dashes.
- cfgWard (WARD DRIVER): APPROVE. Pure mechanic, no dashes.
- jamAnchor (JAM ANCHOR): APPROVE. Pure mechanic, no dashes.

## OVERTIME CLAUSE tone ruling

RULING: fits the world's client/debt fiction. APPROVED as proposed.

Weighed both readings before ruling. Against: the augment's own `synergy`
field admits it rewards "a build content to grind to ROUND_CAP on
purpose," i.e. deliberately slow play, which could read as the son padding
a bill, in tension with his established patience and craft ("Learned
patience at Dad's bench as a child... 'it only sticks where you have
cleaned'") and with the family's own history as victims of predatory
institutional billing (eleven Meridian FINAL NOTICEs, crushing medical
debt). For: no bible or ledger line establishes the shop as bound to bill
its paying customers charitably; Dad's generosity is specific to Patch (an
unpaid, secret, personal project, "no client, no ticket, no pay"), not a
stated shop-wide billing ethic toward the twelve regulars. The lever only
ever touches `jobPayFor`, a back-office number; it does not rewrite a
single customer-facing win line, loss line, or flavor line, so "Customers
are fond of their machines; the intrusion is a betrayal, not an
inconvenience" stands completely untouched by it. And the shop's own
precarity ("Debt: the Meridian balance alone is more than the shop clears
in a year"; "Small businesses run close to the bone; medical debt is
ordinary and crushing") gives real in-fiction motive to bill every credit
the trade allows. This was a genuine canon gap, not a contradiction (the
bible never decided the shop's billing ethic toward its own clients), so
it is now recorded as Resolved ruling 10 in `lore/ledger.md`, appended
after Resolved ruling 9 (DARKNET). The ruling explicitly forbids any
future scene showing a customer resent or dispute the shop over this,
without a further explicit call.

## Tally

Items seen: 17 (5 copy orders, 4 new augments, 8 revised descs). Approved:
17. Revised: 0. Advisory notes: 1 (non-blocking, cleanRun desc-field
duplication). Tone flags ruled: 1 (OVERTIME CLAUSE, resolved as Resolved
ruling 10, DARKNET; approved).
