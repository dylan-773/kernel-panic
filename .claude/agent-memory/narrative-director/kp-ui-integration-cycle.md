---
name: kp-ui-integration-cycle
description: Context and open threads from the ui-integration-2026-07-29 cycle (kpos-shell v2 becomes the real game UI); INTRUSION rename ruling is the live thread to check on next.
metadata:
  type: project
---

Cycle `ui-integration-2026-07-29` ports the approved `ui-demos/kpos-shell/` v2
desktop (INBOX, LOADOUT.CFG, SOLDER.BAY, REPAIR.LOG, DIVE.EXE) into the real
game as native React surfaces. My scope in this cycle was pure copy: INBOX
subject lines (one per customer, Rhea's voice), gating every demo-mock string
the README's study sections named (LOADOUT.CFG status/labels, SOLDER.BAY
dialogue lines, DIVE.EXE console/routes/threat/BUS.LOG/result-bill/device-tag,
REPAIR.LOG connect-line flavor, INBOX footer hint), and flagging the
INTRUSION rename (SIG-0 to INTRUSION on every duel surface) for the
Loremaster. Full deliverable lives in `pipeline/proposals/narrative-director.json`.

**Open thread to check next session**: the INTRUSION rename ruling. I argued
in favor (it reads as the world's existing generic "intrusion" classification
promoted to a UI identity tag, not a new named/personified character, and
does not touch Patch or grant a pronoun), but flagged one nuance for the
Loremaster to weigh directly: back-room/tutorial dives (runs 1-12,
pre-finale) also route through DIVE.EXE, so the sealed-room opponent
(eventually revealed as Patch) would read INTRUSION on screen the whole
erosion arc. I read that as consistent with the honest-erosion mandate in
`lore/ledger.md` (Rhea's virus guess "was always a reasonable in-world
inference"), not a claim the story later contradicts, but this is the
Loremaster's call, not mine. If a future cycle touches DIVE.EXE, duel-board.tsx,
or the finale's "dressed variant" of the duel screen, check whether this
ruling landed and what it decided before writing anything that assumes
either outcome. See [[demo-copy-integration-practice]] for how I approached
reading the demo studies themselves for exact strings.

**Inbox subject design choice** (a judgment call, not dictated): one
`inbox-subject` item per `customerId`, tier field omitted, even though the
schema allows a tier-specific variant. Customers.ts does not vary quotes,
winLine, or lossLine by tier either, so a single Rhea-voiced subject already
covers every difficulty tier a customer appears at; tier escalation (e.g. for
recurring-across-tiers customers like Aldous Wick T1-3 or Ines Calloway T3-4)
would be a deliberate future enrichment, not a gap. Also baked the brief's
illustrative "RE: <device>" format directly into the subject text rather than
treating it as UI chrome, on the reasoning that stripping a baked-in prefix
at integration is trivial and getting it added later is not.
