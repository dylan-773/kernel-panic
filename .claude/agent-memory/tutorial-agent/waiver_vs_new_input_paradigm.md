---
name: waiver-vs-new-input-paradigm
description: How to tell an established-affordance-reuse waiver apart from a genuinely new input modality that still needs a coachmark, even when both use the same "always-on ambient hover language" argument
metadata:
  type: feedback
aliases: [waiver-vs-new-input-paradigm]

---

A proposing agent (ux-agent, in the solder-bay-window / ux-2026-07-28-craft-
station cycle) argued a whole new drag interaction could waive on the same
precedent as `kp-dblock-patchable` (the pulsing-gold legal-target highlight
that backs the `reach2` waiver in `tutorial/ledger.md`). The precedent only
covers HALF of what it was asked to cover, and the split is worth keeping as
a general test.

**Why:** `kp-dblock-patchable`/`kp-legal-pulse`/`reach2` all sit on top of an
interaction the player already owns (click), and only communicate WHICH
already-clickable target is legal right now. That is a state readout on a
known verb, safely self-teaching by reuse. A brand-new INPUT MODALITY
(press-and-drag, when literally everything else in the game up to that point
is click/tap only) is a different kind of fact: the player has no reason to
even attempt the gesture, let alone read its legal/illegal feedback, unless
something first tells them the gesture exists at all. Visual vocabulary reuse
answers "is this move legal," never "is this move possible."

**How to apply:** when a proposal reuses an existing affordance's visual
language to argue for a waiver, split the claim into (a) the STATE the
affordance reports (usually genuinely reusable and waivable if the visual
grammar matches an established precedent like `kp-legal-pulse`'s cadence) and
(b) the EXISTENCE of the interaction itself that produces that state. (a) can
often waive. (b), when it is a first-of-its-kind verb or input method for the
game (not just a new instance of an old one), almost always wants at least a
tier-0 affordance (e.g. `cursor: grab`) plus a `firstSight` coachmark on
whatever surface introduces it, per the ledger's own carve-out: "`firstSight`
is for surfaces whose mere existence is the lesson." Tap/click fallback
existing in parallel makes this non-blocking (nobody gets stuck) but does not
retire the teaching need, since the fallback being fully sufficient is
exactly why a player might never stumble onto the better path without being
told it exists.
