---
name: visual-identity-echo-check
description: how to judge whether a new surface reusing an established sonic/visual "identity" token (e.g. --ch2 as "the intrusion's tone") implies a forbidden causal tie
metadata:
  type: feedback
---

When a ux-agent/art proposal gives some new entity (a vendor, a screen, an
effect) a color, sound, or prefix convention that echoes one already
established as *another specific entity's signature* (example that
triggered this: `ui-demos/kpos-shell` rules "The intrusion is the SUPPORT
TONE (--ch2)... never a second hue," and the DARKNET.LNK vendor's voice
also renders in `--ch2` with a bracket-prefix convention echoing BUS.LOG's
`INT>`), do not reflexively REVISE on "this implies a causal link." Two
checks first:

1. **Is the token actually exclusive, or just the only slot available?**
   Grep other surfaces for the same token used as a "voice" color (not
   just a background dither fill, which is usually the shared support
   tone used everywhere). If customer/NPC voice elsewhere uses the *main*
   ink tone instead (it did: `card.html`'s `.intake` uses `--ch`, not
   `--ch2`), the echo is more deliberate than "there's only one other
   color in a 4-token palette," and is worth a closer look - but still
   isn't automatically a violation.
2. **What does the forbidding rule actually scope its causal-tie
   prohibition to?** Ledger ruling 9 forbids a tie to "Patch, Dad, or the
   shop's back room" specifically, not to "the intrusion" as a general
   phenomenon. Ruling 5 already made intrusions themselves mundane,
   unexplained, and unprotected lore. An echo of "the intrusion's" tone
   for something that plausibly sits downstream of the same mundane
   epidemic (a salvage dealer trading in parts off "dead machines") is
   thematically apt, not a leak, because the epidemic itself carries no
   protected causal weight to leak.

**Why:** a prior gate (`ux-2026-07-29-v2-sound`) ruled that
`darknetLinkUp`'s sound cue correctly avoided reusing the intrusion's
*exclusive* two-parameter fingerprint (phaser + downward slide together,
per ux-agent's own memory), and that ruling's reasoning ("borrowing the
signature would imply the causal tie ruling 9 forbids") is easy to
over-apply to every subsequent echo without checking whether the token in
question is actually exclusive the same way, or scoped the same way.

**How to apply:** before flagging a color/sound/prefix echo as a canon
problem, (a) grep for the token's other uses to confirm exclusivity, and
(b) check exactly what entity the forbidding rule protects before
assuming "sounds/looks like X" implies "is causally tied to X." See
[[gate-darknet-cli-2026-07-29]] for the case this came from.
