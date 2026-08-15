---
name: ground-truth-over-proposal-text
description: Always read the actual shipped React components before gating, never trust a ux-agent/narrative-director proposal's own account of what is or isn't integrated yet
metadata:
  type: feedback
aliases: [ground-truth-over-proposal-text]

---

Before writing any gate verdict, read the real current components under
`kernel-panic-site/app/src/components/` (and their imports in
`shop-os.tsx`), not just the proposal JSON's prose describing what it
expects to still be pending. A proposal's own notes can be stale relative
to what the Orchestrator has already landed, in either direction: a surface
can be further along than the proposal assumes, or a waiver's citation can
have silently died when its surface was redesigned, while the proposal text
keeps repeating the old claim.

**Why**: in the `ui-integration-2026-07-29` cycle, `pipeline/proposals/
ux-agent.json`'s own notes described INBOX, REPAIR.LOG, SOLDER.BAY,
NIGHT.SYS, and DARKNET.LNK as pending integration work. Direct reads of
`components/os/shop-os.tsx` and `components/os/windows/*.tsx` showed all
five were already real, live, wired components. Grounding the review in the
actual files (not the proposal's self-description) surfaced two things a
prose-only review would have missed entirely: (1) a waiver (`jobBoard`)
whose entire backing sentence was confirmed absent from the shipped
`InboxContent`, something `teach-sim` cannot detect since it only checks
that a waiver string exists in code, never that the English sentence it
quotes still renders anywhere on screen; (2) an entire cohort of mechanics
marked `PLANNED` in the ledger (`patchShapes`, `darkWebBuy`, `slotBuy`,
`boostSlots`, `boostSwap`, `patchDrop`, `gridlockChip`) that had already
graduated to fully-shipped `TAUGHT`/`WAIVED` status, in one case
(`patchDrop`'s capped-case glyph) exceeding what was originally speced,
sitting stale in the ledger for a full cycle because nobody went back to
check.

**How to apply**: for every ux-agent `ui-spec` item claiming a surface "will
render X" or "keeps Y unchanged," find and read the actual component file
first. When a mechanic's ledger row says `PLANNED`, that is a standing flag
to re-check against shipped code every cycle until it graduates or is
proven still pending, not a status to leave untouched. See also
[new-input-modality-not-automatic-teaching-gap](new_input_modality_not_automatic_teaching_gap.md)
and [waiver-citations-die-silently-on-redesign](waiver_citations_die_silently_on_redesign.md).

**Addendum (`ux-2026-07-31-loadout-eva`): a correct CONCLUSION can still cite
the wrong EVIDENCE.** A `cuts` entry claimed `duel.tsx:785,937` taught both
the placement cost and the sourcing facts of a paragraph being cut. The
conclusion (safe to cut) was right, but the citation was half wrong: those
two lines never mention sourcing at all, and only weakly cover "one per
turn" via a non-touch-safe native `title`. The actual strongest evidence was
one file away and uncited: `solder.tsx:30-33,490` renders the IDENTICAL
sentence being cut, unconditionally, on every visit. Read every cited line
number yourself and confirm it says what the proposal claims it says, even
when you already agree with where the proposal is heading; a right answer
built on a wrong citation is a gate that got lucky, not one that checked.
