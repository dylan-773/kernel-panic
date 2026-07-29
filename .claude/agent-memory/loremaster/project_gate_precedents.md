---
name: project-gate-precedents
description: Durable judgment calls from past gates worth re-applying, not tied to any one closed cycle's status (see project-canon-status for current status instead).
metadata:
  type: project
---

Accumulated rulings-about-rulings, distinct from the actual canon (which
lives only in `lore/bible.md` and `lore/ledger.md`):

- **Brief vs. existing ruling:** when a brief instruction collides with an
  existing Resolved ruling (e.g. `story-retune-1`'s brief asked enders 9+
  to keep advancing toward sector 9, which ledger Resolved ruling 3
  forbids), the ruling wins and the brief is wrong, not the other way
  around. An agent that deviates from the brief on its own initiative to
  hold a ruling, and flags the deviation loudly instead of either silently
  complying or silently doing what it thinks is right, is doing exactly
  the right thing; say so explicitly in the gate rather than just
  approving quietly.
- **Post-renunciation "virus":** after Rhea's run-8 renunciation, bible
  voice law allows her to reference the word only ironically ("Some
  virus."). A line only clears that bar if the irony is legible on its
  own (a wry, self-aware quotation of a belief she no longer holds), not
  just implied by adjacent context. Treat "virus" appearing without a
  clear ironic frame as a REVISE candidate even in an otherwise-safe
  plateau line; the reliable fix has been dropping the word entirely, not
  rescuing it with tone.
- **Hard excision means no residue:** when the user excises material
  (e.g. the mother, ruling 1), a replacement line can still fail for
  reusing the excised material's imagery in the same narrative slot
  ("quiet," reused where "she took the car and the quiet with her." used
  to sit) even with no explicit restatement. Check for vocabulary echo,
  not just literal contradiction. See [[feedback-canon-closure-style]].
- **Self-check ledger table edits:** when a ruling session requires
  editing the run-by-run knowledge table under time pressure, re-read the
  other rows for the same fact before moving on. Caught my own edit once
  already, stating a fact 5 runs ahead of the table's own scheduled
  reveal.
- **Confirm-by-reading before amending lore files:** re-read the actual
  shipped `story.ts`/`journal.ts`/component source during a gate rather
  than trusting an agent's notes, or even the ledger's own prior status
  note about what's already integrated - that status note went stale
  once and was only caught by re-reading source directly. See
  [[feedback-verify-unchanged-claims]].
- **A diegetic claim only needs an inference chain, not a direct quote:**
  approved BENCH FEED (a live shop camera) from "Rhea... watches the
  feed" alone, and the DIVE.EXE device cell ("OS shows what the bench is
  tapped into") from "the bench (the player's)" plus "repair techs dive
  customer machines for pay" - neither needed a bible line that spells
  the exact claim out. If a chain of 1-2 existing lines makes a claim the
  obvious/mundane reading, that is enough to APPROVE; save REVISE for
  claims that need a line the bible doesn't have or actually contradicts.

How to apply: keep this list short and durable; add to it only when a
future gate produces a genuinely reusable judgment call, not a
cycle-specific status update (that belongs in [[project-canon-status]]).
