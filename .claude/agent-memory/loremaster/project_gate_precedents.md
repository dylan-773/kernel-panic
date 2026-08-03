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

- **Artifact voice must match its diegetic source:** when a window's
  fiction reframes player-facing text as an in-world artifact (a bill, a
  log, a scan) rather than diary/UI prose, gate each artifact's BODY
  against what its stated source could plausibly know or print. A true
  fact that is allowed at that point in the knowledge table can still fail
  the gate if it is voiced wrong: a clinic billing notice cannot print a
  comparison to an unrelated shop's income (that is the reader's own
  inference), and a device-profile file cannot drop into lowercase
  first-person narration mid-readout (that is the reader's own reaction).
  The fix is not to cut the knowledge, it is to relocate it to the
  player's own annotation/note, where that reframe already gives it a
  home. See [[project-canon-status]]'s DAD.LOG reframe entry
  (`ux-2026-07-29-dadlog`, ledger Resolved ruling 12) for the rule as
  written into canon.

- **A fixed number is a checkable claim, not flavor:** when copy proposes
  a specific credits/hours/date figure, check it against the shipped
  economy before approving, not just against vibes. `ux-2026-07-29-dadlog`
  round 2: a bill's "AMOUNT DUE: 14,230 CREDITS" looked like harmless
  flavor but, run against `jobPay(tier) = 40 + 25 * tier`
  (`content/arc.ts`) and the bible's own "three tickets each" working-day
  rhythm, implies an annual shop income an order of magnitude too low,
  directly contradicting "the Meridian balance alone is more than the
  shop clears in a year" (bible). REVISE, and prefer telling the author to
  drop the checkable number entirely (a status field, not a total) over
  either approving an uncomputed figure or doing the arithmetic for them
  to find a number that fits - the latter invents a new economic fact
  that isn't actually needed for the scene to land.

- **Sonic identity can be a canon-adjacent signal, not just production
  polish, the audio analog of [[icon_fiction_native_vs_darknet]].** The
  ux-agent's own established sound-palette rule (phaser plus a downward
  freqSlide is the intrusion's exclusive glitch fingerprint; vibrato alone
  reads as merely "uncertain," not hostile) means a new preset's actual
  params, not just its rationale prose, are checkable against canon: a
  player-caused or shop-chrome cue that borrowed the intrusion's fingerprint
  would imply a causal tie the ledger forbids (ruling 9's "no causal link to
  Patch, Dad, or the shop's back room"), the same way the wrong icon style
  would misattribute a window's ownership. Approved `darknetLinkUp` on
  `ux-2026-07-29-v2-sound` partly on this basis: its params (upward
  freqSlide, no phaser) are the "uncertain, not hostile" case by the
  ux-agent's own rule, which is also the canon-correct choice, not merely a
  safe one. Read the actual param object before trusting a "does not read
  as X" claim in a preset's rationale; the params are the falsifiable part.
- **A word can be loaded in the bible without being reserved from reuse.**
  Checked `dayClose`'s "reading as a mechanism sealing shut" against the
  back room's specific "Sealed the back room himself" / "The seal opens
  only on 'A FAIR WIN, NO ASSISTS'" imagery (the vocabulary-echo instinct
  from [[feedback-canon-closure-style]]) and cleared it: no bible/ledger
  line reserves the word "seal" itself, the claim lives only in a private
  sound-design `character` field never shown to the player, and it
  describes an already-named, mundane, routinely-firing feature
  (`night.tsx`'s own header comment already calls its screen "the
  day-close screen"). Vocabulary echo is a real check, but it needs either
  a citable reservation or the same narrative slot as the excised
  material to bite; a merely thematically-adjacent word in an unrelated,
  frequent, mundane context is not automatically a REVISE.

- **A design supersession is not a reversal:** when a later round changes
  a constraint (e.g. a new art budget) and the author swaps an earlier
  APPROVEd design for a different one that serves the same canon rule
  better, say so explicitly rather than either silently re-gating as if
  the old approval never happened or treating the new design as
  contradicting the old verdict. `ux-2026-07-29-dadlog` round 3: round 1
  approved a single persistent SOURCE MEDIA plate (the only honest
  framing under a zero-art-budget constraint); round 3's user-approved
  per-entry attachment budget let it become per-document illustrative
  images instead, which satisfies the same ledger rule (ruling 12, "every
  entry renders AS the artifact itself") more directly. Both were correct
  for the budget they were made under; record the supersession on the
  record rather than debating which round was "right."

- **A UX label that looks coined may already be shipped in-fiction
  vocabulary; grep journal.ts/story.ts before assuming a bible/ledger gap.**
  `ux-2026-07-31-loadout-eva` proposed "OPERATOR RIG" as a bare-noun spine
  label, filed with no copy order on the theory it's just a noun. It
  turned out to already be established: journal.ts's IT IS GRADING ME
  entry (run 8) repeatedly calls the diver "OPERATOR" (the tower's own
  diagnostic word for whoever is diving it), and the shipped `loadout.tsx`
  header comment already calls this exact zone "the operator's rig."
  APPROVE was not just "no objection," it was actively grounded once
  checked. The lesson: a UX-agent claim that a label is "a bare noun,
  nothing to gate" is worth a quick grep of shipped journal/story content
  before taking it at face value either way, since the answer can make an
  otherwise-thin APPROVE much stronger, or turn a bare-noun claim into a
  real coinage worth a closer look.
- **Hue/theme selection is cosmetic OS chrome, not narrative content, and
  clears on canon grounds by default.** `ux-2026-07-31-loadout-eva`
  proposed a fourth `data-hue="amber"` scheme. No bible/ledger line
  reserves KP/OS's accent color to the existing three, and color-as-
  phosphor-choice carries no story fact the way a name, a reveal, or a
  causal link would. APPROVE without needing a citation for the accent
  itself; the only thing worth flagging forward is that a FUTURE proposal
  attaching real narrative weight to a specific hue (gating one behind the
  finale, tying one to Patch or Dad) would need its own ruling at that
  point, since that would stop being cosmetic.

How to apply: keep this list short and durable; add to it only when a
future gate produces a genuinely reusable judgment call, not a
cycle-specific status update (that belongs in [[project-canon-status]]).
