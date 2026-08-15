---
name: canon-gap-gate-pattern
description: How to handle a proposal that exposes a canon question the bible/ledger never decided, during gate duty.
metadata:
  type: project
aliases: [canon-gap-gate-pattern]

---

When a gated proposal rests on a world fact the bible/ledger never ruled
on (not a contradiction, an absence), the fix is not APPROVE-by-default or
a REVISE with no citation. Decide the gap, write ONE new ruling into
`lore/ledger.md`'s Resolved rulings list (append, do not renumber past
rulings) or into `lore/bible.md` directly if it is a world/character fact
rather than a story event, then gate the item against that new ruling in
the same pass. Say in the gate file that this is what happened, and why
it's a ruling rather than a REVISE (no prior line existed to contradict).

**Why:** the standing gate rule is "every REVISE must cite a bible/ledger
line; if you can't cite one, it's a NOTE not a REVISE" - but that leaves
genuine gaps nowhere to land. Deciding the gap, then citing the new line,
is how a gate stays honest without becoming a blanket NOTE dump.

**Precedents, in order:**
1. `deep-balance-2026-07-28`: the DARKNET gray-market fiction had no
   anchor either way. Ruled and recorded as ledger Resolved ruling 9.
2. `deep-balance-2026-07-28` (second gate in the cycle): the OVERTIME
   CLAUSE billing-tone question. Ruled and recorded as ledger Resolved
   ruling 10.
3. `ui-integration-2026-07-29`: two gaps in one pass. (a) No customer had
   appearance canon; ruled directly into `lore/bible.md`'s customer list
   for the five customers this cycle's art needed, adopting the
   ux-agent's own well-grounded proposed descriptions rather than
   inventing competing ones - reusing a good-faith proposal's reasoning is
   fine when it already argues from the customer's own shipped
   `quotes`/`winLine`. (b) DIVE.EXE's opponent identity tag (SIG-0 vs
   INTRUSION) had no ruling; recorded as ledger Resolved ruling 11. See
   [[project-canon-status]] for what these actually say.
4. `ux-2026-07-29-dadlog`: one gap, distinct from that cycle's OTHER
   canon event (a direct USER DIRECTIVE reframing DAD.LOG, recorded as
   ruling 12 - not a gap, a straight ruling of what the user said). The
   actual gap was whether "tower telemetry" and the player's own live
   session logs/queries could coherently live on a volume labeled Dad's
   own, read-only ("DAD.VOL // READ ONLY"), given the backroom entry's own
   "NO ENTRY IN THIS SYSTEM, EVER." Ruled coherent (the tower's own local
   drive vs. the shop's separate ticketing system are different systems)
   and recorded as ledger Resolved ruling 13. Worth remembering as a
   pattern in itself: a single brief can produce both a user-ruling item
   (record verbatim, do not re-litigate) and a genuine gap-ruling item
   (decide it yourself) in the same pass; do not conflate the two or cite
   the wrong justification for either in the gate file.

**How to apply:** any future gate where a proposal's fiction has no
bible/ledger anchor either way - decide it, canonize minimally, cite the
new line in the verdict. When the proposing agent already sketched a
reasonable answer and explicitly asked for a ruling rather than assuming
one, that is them doing it right; adopting their grounded reasoning into
the canon text (rather than reflexively writing a different version) is a
legitimate and often the most consistent choice.
