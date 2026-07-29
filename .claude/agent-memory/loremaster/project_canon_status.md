---
name: project-canon-status
description: Current open/closed canon rulings and housekeeping status, updated as gates close items. Check this before assuming something is still open, but verify against the actual lore files before relying on it - this is a snapshot, not the source of truth.
metadata:
  type: project
---

**Resolved and stable in `lore/ledger.md`, no need to re-litigate:**
All 11 numbered Resolved rulings (mother excised; cover story
self-invented by Rhea; sectors 8/9 never numbered pre-finale; finale is
reconstruction, not pure tape or pure synthesis; intrusions are mundane/
unexplained epidemic with Patch sharing substrate but "not a virus" as
hard law regardless; Meridian dual identity, optional; no-dust timeline;
total family anonymity, given name and surname, forever; DARKNET
gray-market ruling; overtime billing ruling; DIVE.EXE's INTRUSION
identity tag, added `ui-integration-2026-07-29`, full text in the ledger).
The 4 shipped-copy realignment targets from 2026-07-25 (run-1 opener,
run-6 opener, run-end-3 sector-2 line, journal bills entry): confirmed
integrated as of the `story-retune-1` gate.

**The `boot.tsx` OVERBY violation** (found gating `ux-2026-07-28-kpos-redesign`):
confirmed fixed, and reconfirmed clean again on `ui-integration-2026-07-29`
across `boot.tsx`, `report.tsx`, `desk.tsx`, and the whole `components/os`
tree. See [[feedback-verify-unchanged-claims]] for why this gets
re-checked every time rather than trusted as permanently closed.

**Customer appearance canon in `lore/bible.md`** ("The customers"
section), established only where art has actually needed it:
- Have appearance canon: Juno Vex, Sable Okonkwo, Aldous Wick, Wren
  Tallis, Bram Hollander (ruled `ui-integration-2026-07-29`); Dex Marlowe
  (already-shipped card art, ratified into the bible the same session as
  the single written source of truth).
- Still no appearance canon, correctly - decide only when art is actually
  ordered for them: June Aksoy, Ines Calloway, Emeric Snow, Vera Stanek,
  Casimir Bell, Noor Behzadi. Do not invent one preemptively; the bible's
  own intro line to that section says so.

**DIVE.EXE opponent identity tag** (ledger Resolved ruling 11): reads
INTRUSION everywhere (board tag, turn pair, telemetry heading), including
pre-finale tutorial/Day-10 dives against the sealed room later revealed as
Patch - diagnostic classification, not a name, and no bigger a claim than
the already-shipped "THE MACHINE" job title on those same dives. Genuinely
still open, deliberately: what the tag should read AFTER the finale
reveal. Decide that if/when a future proposal actually asks.

**Housekeeping, not canon:** my memory directory was scattered across
(at least) four locations as of `ui-integration-2026-07-29`, almost
certainly from past sessions' cwd drift: the correct one
(`kernel-panic-site/app/.claude/agent-memory/loremaster/`, this file's
home), plus stale copies at `lore/.claude/agent-memory/loremaster/`,
repo-root `.claude/agent-memory/loremaster/`, and, worst, one nested
INSIDE the game repo at
`kernel-panic-site/app/src/game/.claude/agent-memory/loremaster/` (out of
bounds under the "only the Orchestrator touches `kernel-panic-site/`"
iron rule). I have no delete tool, so I consolidated forward into this
correct location rather than removing the stray copies, and flagged it to
the user in that session's summary. If this file set ever looks thinner
than expected, check those other three paths before assuming information
was lost - and if you have delete access in a future session, this is a
standing cleanup task.

How to apply: read this file first when starting a new gate or canonize
session, before re-deriving status from the full ledger/bible text.
