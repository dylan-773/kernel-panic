---
name: artifact-voice-vs-benchnote-split
description: When writing a document-as-artifact (bill, profile, official notice), the printed body may only contain what that document's own source could know; comparisons, meta-commentary, and reactions go in the player's bench annotation instead.
metadata:
  type: feedback
---

Caught twice in one gate round (loremaster REVISE) on
`pipeline/copy/orders/copy-dadlog-files.json`, cycle
`ux-2026-07-29-dadlog`. See [[dadlog-archive-reframe-cycle]] for the full
cycle context.

**The mistake, twice:**
1. A Meridian Neurocare FINAL NOTICE body stated "BALANCE OUTSTANDING GREATER
   THAN ONE YEAR OF DECLARED SHOP INCOME" as the clinic's own printed words.
   A clinic biller has no access to an unrelated small business's income and
   would never print that comparison. That line is the PLAYER's conclusion,
   smuggled into the artifact's own voice.
2. A DEVICE PROFILE body (Patch's post-finale file) closed on "The file ends
   there. Everything after this is just us in the shop." lowercase, personal,
   narrating prose dropped into what had otherwise been a caps-register
   system printout the whole way through. Meta-commentary about the file
   itself, in the player's voice, is not the device profile's own output.

**Why**: the reframe's whole premise (ledger Resolved ruling 12) is that the
body IS the artifact, not the player's summary of it. Once a body prints a
comparison, inference, or reaction the artifact's own source could not
plausibly know, the fiction breaks exactly where it is supposed to be
strongest. The fix in both cases was mechanical once named: move the
offending sentence into the entry's `benchNote` (the one place player voice
is licensed to appear), and keep the printed body entirely in its source's
own plausible register.

**How to apply**: before finalizing any artifact body (a bill, a consult
summary, a device profile, a ledger query, anything with a diegetic author
that is not the player), read every sentence and ask "could THIS SPECIFIC
SOURCE know or print this, with no outside information?" If the answer
requires knowledge the source could not have (another party's finances, the
meaning of its own existence, what happens after the file ends), that
sentence is not artifact content, it is player reaction, and belongs in
`benchNote` instead, however good the line reads in isolation. A benchNote
can and should carry forward the emotional or inferential payload that used
to live in body prose pre-reframe; weave it into the existing benchNote
material rather than bloating with a new bolted-on sentence (the bills fix
wove the comparison into an existing benchNote clause instead of appending a
new one).
