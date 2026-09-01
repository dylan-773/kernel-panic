---
name: kp-canonize
description: Rebuild or refresh Kernel Panic story canon (vault/60-story/) from shipped game content.
disable-model-invocation: true
---

# Canonization (Orchestrator play)

Run when: setting up the crew, after any story content ships, or whenever the Loremaster's gate cites lines that no longer match the game.

1. Spawn `loremaster` with the canonize instruction. It reads the shipped content (`kernel-panic-site/app/src/game/content/journal.ts`, `story.ts`, `customers.ts`) and the design vault (`vault/`, start at `vault/00-index/home.md`), and updates the `vault/60-story/` notes. Shipped copy outranks the vault where they disagree. One idea per note; frontmatter per `vault/00-index/vault-conventions.md`.
2. Sanity-check the updated notes yourself: `vault/60-story/reveal-schedule.md` must contain the run-by-run knowledge table (runs 1-12), `vault/60-story/voice-and-copy-laws.md` must state the voice rules (including the no em/en dash law), and the character notes must hold the truths (Rhea, Patch, Dad).
3. If the game has story content the ledger cannot account for, that is a canon bug: surface it to the user rather than papering over it.
4. Report what changed in canon since the last pass.
