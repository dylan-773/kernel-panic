---
name: project-canon-status
description: Current open/closed canon rulings and housekeeping status, updated as gates close items. Check this before assuming something is still open, but verify against the actual lore files before relying on it - this is a snapshot, not the source of truth.
metadata:
  type: project
---

**Resolved and stable in `lore/ledger.md`, no need to re-litigate:**
All 14 numbered Resolved rulings (mother excised; cover story
self-invented by Rhea; sectors 8/9 never numbered pre-finale; finale is
reconstruction, not pure tape or pure synthesis; intrusions are mundane/
unexplained epidemic with Patch sharing substrate but "not a virus" as
hard law regardless; Meridian dual identity, optional; no-dust timeline;
total family anonymity, given name and surname, forever; DARKNET
gray-market ruling; overtime billing ruling; DIVE.EXE's INTRUSION
identity tag, added `ui-integration-2026-07-29`; DAD.LOG REFRAME (12) and
DAD.VOL PROVENANCE (13), both added `ux-2026-07-29-dadlog`; LOADOUT.CFG
MULTI-HUE PALETTE (14), added `ux-2026-07-31-loadout-eva` round 2, full
text in the ledger).

**DAD.LOG reframe** (rulings 12/13, `ux-2026-07-29-dadlog`): DAD.LOG is now
DAD.VOL, Dad's own read-only recovered volume read file by file, not "the
player's journal" - a USER DIRECTIVE, not a gap ruling. Bible's Brands,
The player, and Patch sections all updated to match (grepped for every
"DAD.LOG"/"journal" mention first). Entry ids/unlockAtRun/knowledge
ceilings are explicitly UNCHANGED by this reframe; only presentation
voice moved (artifact body vs. player benchNote). Ruling 12 also states
the reusable rule: an artifact's body may only say what its own diegetic
source could plausibly know or print (see [[project-gate-precedents]]).
Ruling 13 separately legitimizes "tower telemetry"/player-generated
system queries living on DAD.VOL alongside Dad's own historical files
(same drive, different authors); "READ ONLY" describes the reader's
access mode, not the underlying volume never changing.
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

**Resolved: `ux-2026-07-29-v2-sound`** (2026-07-29, same day it was
blocked). The Orchestrator restored the cycle's integrated substance as
`pipeline/proposals/ux-agent-v2-sound-integrated.json` (18 items: 13 sfx
adds, 1 retire, 1 flag, 3 ui-specs) from its own pre-overwrite read, since
the working proposal file had been clobbered by the parallel
`ux-2026-07-29-dadlog` cycle before my gate ran (see
[[feedback_gate_named_cycle_must_be_in_file]] for that pattern, confirmed
useful: the BLOCKED verdict plus "what unblocks this" note gave the
Orchestrator exactly the shape of fix needed). Re-gated and APPROVED all 18
items, 0 revised, after cross-checking every param and call site directly
against `audio.ts`, `duel.tsx`, `darknet.tsx`, `teach.tsx`, `night.tsx`,
`ledger.tsx`, and `wm.tsx` rather than trusting the record's "as shipped"
framing (all of it checked out exactly, including specific numbers like
the 160/340/520ms boot stagger and the 64 dotmatrix cells at 4.5ms). Full
reasoning, especially the darknetLinkUp/canon-ruling-9 tie and the dayClose
vocabulary-echo check, is in `pipeline/gates/loremaster-review.md`'s
second dated section for this cycle. Still genuinely outstanding, not a
gate failure: the cycle's 3 music-brief items
(desk/dive/finale-bed-v2-direction) were never captured anywhere readable
and remain un-gated; re-request them from ux-agent if wanted.

**Gate file gets wholesale-replaced mid-cycle by OTHER cycles, not just
your own:** confirmed `2026-07-29` when `pipeline/gates/loremaster-review.md`
was found holding a full `ux-2026-07-29-darknet-cli` review, having
replaced my own `ux-2026-07-29-dadlog` round-1/round-2 content between
sessions, per the standing "each gate cycle replaces the file" convention
applied by a DIFFERENT cycle than the one I was mid-way through addenda
for. When asked to "append a round N addendum" and the file no longer
holds round N-1's content, restate the needed recap inline in the new
addendum rather than assuming context survives; don't try to restore the
missing content, that cycle's review is legitimately gone and is safe in
git history. See the dadlog round-3 addendum in the current
`loremaster-review.md` for the pattern.

**Bible line budget:** `lore/bible.md` sat at 196 lines before the
`ux-2026-07-29-dadlog` edits and is now ~203, over the charter's "~200
lines" soft cap. Not urgent, but the next canonize pass should look for
lines to tighten rather than adding more without trimming.

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

**Resolved: `ux-2026-07-31-loadout-eva` round 1** (2026-07-31). Gated the
standalone LOADOUT.CFG Evangelion-maximalism study
(`loadout-eva-instrument-panel` + its `instrumentLock` sfx companion).
Both APPROVE, 2/2, 0 revised. No canon gap, no new ruling. One advisory
NOTE only (non-blocking): the coined "// SUPPORT SYSTEMS" band label sits
close to a cockpit-life-support reading, which brushes the brief's own
"must read as bench-terminal diagnostics" boundary, but no bible/ledger
line forbids it outright so it could not be a REVISE; flagged with two
suggested bench-flavored alternatives instead. Confirmed clean: the
FIG.01//BENCH RIG plate cut costs canon nothing (no line requires it);
the cropped BENCH FEED keeps its "Rhea watches the feed" anchor
regardless of size; the cut pouch paragraph's darknet-sourcing sentence
survives verbatim at SOLDER.BAY (`solder.tsx` FOOT_LINE, checked directly
against source); the new `amber` hue is cosmetic OS theming, not
narrative, so it clears without needing a citation; the design direction
stayed inside the brief's own no-NERV/no-Japanese-chrome/no-angel-
iconography boundary on a full sweep. See [[project-gate-precedents]] for
the two reusable lessons this produced (OPERATOR already shipped
vocabulary; hue is cosmetic by default) and
[[patch_piece_crafting_fiction]] for the darknet-sourcing-survives-
elsewhere precedent.

**Resolved: `ux-2026-07-31-loadout-eva` round 2** (2026-07-31). The user
sent the study back wanting a real multi-hue Evangelion palette (amber
chrome, green nominal, red risk, cyan camera-only, ivory hot),
explicitly overriding the KP/OS v2 single-ink-accent law for this
surface - a directive, not a gap. Recorded as ledger Resolved ruling 14,
scoped narrow (LOADOUT.CFG only) by default with the wide "replace the
law everywhere" question left explicitly OPEN for the user. Named the
exact `CLAUDE.md` DESIGN STANDARD line and the two `ui-demos/RULINGS.md`
law lines that go stale at integration without a carve-out (did not edit
either file myself). Then gated the resulting fiction for real: APPROVE
on color-as-diagnostic-state fitting a bench terminal, APPROVE on the
cyan BENCH FEED tint (no collision with any established entity's color/
sound signature, checked against DARKNET.LNK's own "not via color" line
and the intrusion's sonic-only signature), APPROVE on all five hexes as
ordinary bench/warning-light semiotics rather than Eva-specific branding.
3/3 fiction items approved, 0 revised. See
[[user_ruling_can_override_v2_design_law]] for the reusable shape of this
kind of response (record + name integration obligations + still gate the
fiction for real).

How to apply: read this file first when starting a new gate or canonize
session, before re-deriving status from the full ledger/bible text.
