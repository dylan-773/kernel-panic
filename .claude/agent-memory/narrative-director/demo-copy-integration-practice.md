---
name: demo-copy-integration-practice
description: How to gate a ui-demos/ study's copy for integration - read the source not the README summary, mind whose voice a placeholder line is in, and follow a cycle's bespoke item types over the general contract when a brief names them.
metadata:
  type: feedback
---

Learned while fulfilling a "port this UI demo's copy into the real game"
brief (`ui-integration-2026-07-29`, see [[kp-ui-integration-cycle]]).

**Read the demo source, not just its README.** `ui-demos/kpos-shell/README.md`
narrates each study in prose and names representative examples ("the whole
BUS.LOG vocabulary (tap spliced / bus live / twist / charging / round
dividers)" names 5 things out of 26 actual lines in `dive.ts`). The README is
for orientation; the exact player-facing strings, character-for-character,
live in the study's `.html`/`.ts` source. Quote from there.

**Why**: gating on a paraphrase risks missing lines (the README's LOADOUT.CFG
paragraph never mentions the footer line ">> TUNE IT WHENEVER...", which only
shows up by reading `loadout.html` directly) and risks mis-transcribing exact
punctuation/case that the Loremaster or Orchestrator will cite verbatim.

**How to apply**: for any "gate the demo-mock copy" task, treat the README's
inventory sentence as a checklist of clusters to look for, then open every
named `.html`/`.ts` file and extract the literal strings from the DOM-building
code or template literals, not from a comment describing them.

**Mind whose voice a placeholder line is written in.** A demo study's
placeholder copy can be well-written and still be the wrong SPEAKER for
production. The INBOX study's demo subject lines ("there is a second player
in my handheld") paraphrase the CUSTOMER's complaint in the customer's own
first-person register; the brief needed lines from RHEA, routing the order
to the bench, a completely different speaker and job even though both are
"a one-line subject about the ticket." Do not adopt-verbatim just because a
demo line reads fine in isolation; check who it's supposed to be FROM.

**Bespoke item types in a cycle's own brief override the general contract.**
The kp-contracts skill's item-type list (customer/augment/journal/scene/etc.)
is a baseline. A specific production brief can and does define its own ad hoc
item types for a cycle's deliverables when none of the standard ones fit
(this cycle's brief explicitly specified `inbox-subject` and `ui-copy` with
exact field shapes). Follow the current brief's explicit type/field
instructions over the general schema when they conflict; the general schema
is what applies when a brief is silent.

**Check every copy-order file's `status` field, not just that files exist.**
`pipeline/copy/orders/` had 13 files this cycle; all were already
`filled`/`done`/`cancelled` from a prior cycle (teaching-2026-07-26). Seeing
files present is not the same as seeing open work; grep or read every file's
`status` before assuming any need fulfillment.
