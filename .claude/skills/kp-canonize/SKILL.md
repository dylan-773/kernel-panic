---
name: kp-canonize
description: Rebuild or refresh the Kernel Panic lore bible and story ledger from shipped game content and the GDD.
disable-model-invocation: true
---

# Canonization (Orchestrator play)

Run when: setting up the crew, after any story content ships, or whenever the Loremaster's gate cites lines that no longer match the game.

1. Spawn `loremaster` with the canonize instruction. It reads the shipped content (`kernel-panic-site/app/src/game/content/journal.ts`, `story.ts`, `customers.ts`), the design docs (`gdd/Kernel_Panic_GDD_v2.html`, `gdd-review-kit/gdd.txt`), and writes `lore/bible.md` + `lore/ledger.md`. Shipped copy outranks the GDD where they disagree.
2. Read both files yourself and sanity-check: the ledger must contain the run-by-run knowledge table (runs 1-12), and the bible must state the voice rules (including the no em/en dash law) and the character truths (Rhea, Patch, Dad).
3. If the game has story content the ledger cannot account for, that is a canon bug: surface it to the user rather than papering over it.
4. Report what changed in canon since the last pass.
