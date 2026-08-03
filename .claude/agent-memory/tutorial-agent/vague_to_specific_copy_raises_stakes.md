---
name: vague-to-specific-copy-raises-stakes
description: A fiction reframe that replaces a vague placeholder line with specific diegetic voice creates a NEW accuracy obligation that did not exist before, even when nobody touched the underlying mechanic
metadata:
  type: feedback
---

Found in `ux-2026-07-29-dadlog`: DAD.LOG's old locked-teaser text ("keep
diving", "There is more in the drawer. It can wait until you cannot sleep
again.") was vague but never false, so it had sat for cycles with no ledger
row and no gap ever flagged. The reframe that replaced it with archive-reader
voice ("EVERY DIVE ATTEMPT WRITES A NEW RECOVERY PASS TO THIS DRIVE, WIN OR
LOSE...") made a specific, checkable claim about cadence, and the claim was
wrong: the real gate is `meta.runCount`, incremented once per `startRun`, not
per individual ticket/dive. A run holds up to ~27 individual dives, all of
which pass with zero visible change.

**Why:** immersive, in-fiction copy reads as more confident and more
specific than dev-speak placeholder text, which is exactly why the user
wants it (per the standing `describe-what-it-is` / voice-quality bar for
this project) and exactly why it is more dangerous. A vague line cannot fail
an accuracy check. The more diegetic and specific a line becomes, the more
directly it makes a testable claim about game mechanics, and testable claims
need to actually be tested against the reducer before they ship, not
proofread for tone alone.

**How to apply:** whenever a proposal (narrative reframe, copy tightening,
voice pass) makes previously-vague copy more specific or more "in-world,"
treat that specificity itself as a new trigger to re-verify the underlying
mechanic, even if the mechanic itself was not touched and even if a nearby
ledger row already exists. Watch especially for two nouns that both read as
natural English for "an attempt" but are NOT interchangeable at the engine
level in this game: a DIVE is one ticket/duel (`components/game/duel.tsx`),
a RUN is the full multi-day attempt gated by `meta.runCount`
(`run-reducer.ts`'s `startRun`). Any copy making a claim about unlock
cadence, recovery, or progression has to name which one it means and check
that against the reducer, not against how the sentence scans. See
[[waiver_vs_new_input_paradigm]] for the sibling lesson (visual language
reuse only covers what it actually demonstrated, never more).
