---
name: user-ruling-can-override-v2-design-law
description: how to record a user directive that overrides the KP/OS v2 single-ink-accent law for one named surface (loadout-eva multi-hue), rather than treating it as a canon-gap ruling
metadata:
  type: feedback
aliases: [user-ruling-can-override-v2-design-law]

---

`ux-2026-07-31-loadout-eva` round 2: the user directed a five-channel
Evangelion-style state-coded palette for LOADOUT.CFG (amber chrome,
green nominal, red risk, cyan camera-only, ivory hot), explicitly
overriding `ui-demos/RULINGS.md`'s "ONE unified scheme... single ink
accent... danger is inverse video, never a second hue" law. The user
was explicit that this was a directive, not a request to re-litigate, so
the job was recording, not gating for canon-fit in the usual "cite a
line to REVISE" sense.

**Why this needed a different shape of response than a normal gate:**
a REVISE needs a bible/ledger line to cite; a design LAW the user is
directly overriding cannot be cited back at them as a reason to hold the
work. What was actually owed: (1) write the directive into
`lore/ledger.md` as a numbered Resolved ruling, quoting the user's own
words, the way ruling 12 (DAD.LOG reframe) was recorded; (2) name the
exact lines in `CLAUDE.md` and `ui-demos/RULINGS.md` that go stale if
the direction ships, so the Orchestrator's integration pass does not
silently leave the charter contradicting the game; (3) still actually
gate the FICTION the new palette implies (does color-as-state fit a
bench terminal, does any hue collide with an established entity's
signature) - that part stays a real canon check with real APPROVE/
REVISE stakes, it just isn't the "should this be allowed at all"
question, which the user already answered.

**Scope discipline:** default to the NARROWEST reading of what the user
actually said (this window only) and write the WIDER question (does
this replace the single-ink law everywhere) into the ledger explicitly
as OPEN, rather than either assuming the wide reading or silently
deciding it myself. Also distinguished this from a superficially similar
already-killed idea: the earlier `ux-2026-07-28-kpos-redesign` round-2
ruling rejected per-window channel LIVERY (one flat hue per whole
window: magenta darknet, phosphor ledger, indigo dadlog). This new
directive is a different shape of multi-hue (one window internally
coding several hues by MEANING: nominal/risk/chrome/camera), not a
revival of the killed idea - worth stating explicitly so nobody reads
this ruling as quietly reopening a settled question it doesn't touch.

**How to apply:** when a user directive collides with a standing v2
design law (not a bible/ledger story fact), (a) record it as a dated,
quoted ledger ruling with an explicit scope statement and an explicit
open question if one exists, (b) name every doc line that becomes false
if it ships, without editing those files yourself if they belong to the
Orchestrator, and (c) still gate the resulting content's actual fiction
fit and any cross-entity signal collisions (see
[[visual_identity_echo_check]] for the collision-check method) as a real
canon question with its own verdict. See ledger Resolved ruling 14 for
the ruling as written, and `pipeline/gates/loremaster-review.md`'s round
2 section for this cycle for the full gate.
