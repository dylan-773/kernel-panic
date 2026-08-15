---
name: kpos-redesign-scope
description: Scope and process notes for the ux-2026-07-28-kpos-redesign full visual pass -- demo-only, duel out of scope, carry-forward pattern, zero art orders
metadata:
  type: project
aliases: [kpos-redesign-scope]

---

**The brief.** `ux-2026-07-28-kpos-redesign` (`pipeline/BRIEF.md`) is a full
visual redesign of the KP/OS shell and every window, triggered by the user's
verdict on the shipped UI: right direction (pixel, retro-futuristic) but
"prototype grade" -- named angers were placeholder-looking components, small
windows (`WIN_DEFS` w: 380-780), and internal scrollbars
(`max-height: 62vh; overflow: auto`). **Why this matters going forward:**
future UX passes on this game should keep checking against this same
complaint shape (does a component look hand-rolled/default-Tailwind rather
than pixel-native; is a window cramped; does anything scroll) since it is the
user's stated bar for "done," not just a one-time note.

**This pass is spec-only, demo target.** Deliverable is a proposal
(`pipeline/proposals/ux-agent.json`) the Orchestrator turns into an
interactive demo at `ui-demos/kpos-shell/`; nothing integrates into
`kernel-panic-site/` this cycle. This mirrors the immediately prior
`ux-2026-07-28-craft-station` brief's own demo-first pattern
(`ui-demos/craft-station/`), which the user validated by keeping the same
structure for this larger pass. **How to apply:** when a brief says "the user
reviews the demo first," ground specs against the REAL shipped file
paths/line numbers anyway (styles.css, wm.tsx, shop-os.tsx, screens.tsx),
even though the immediate output is a standalone demo -- the goal stated
explicitly in both briefs is that a winning demo integrates later with the
spec text UNCHANGED.

**Carry-forward pattern for gate-cleared items across brief boundaries.**
When a new brief supersedes a prior one but some of the prior pass's items
already cleared both gates (tutorial + loremaster), carry them into the new
proposal file VERBATIM (same id, same text, same acceptance checks) rather
than re-deriving or paraphrasing them -- gate approvals are keyed to exact
text, and the file must stay self-contained as the single source of truth
for its brief. If the new pass needs to change something about a
carried-forward item (a footprint, a piece of chrome, an addendum a gate
already called for), add a SEPARATE new item that layers on top and states
explicitly which fields of the old item it supersedes, rather than editing
the carried-forward text in place. Done this way for
`ux-2026-07-28-craft-station`'s `solder-bay-window` + five sfx items inside
the `ux-2026-07-28-kpos-redesign` proposal: the verbatim item's WinDef
numbers are superseded by the new sizing law's footprint table, and a
tutorial-gate-mandated cursor addendum (idle `grab`/held `grabbing` on rack
slots) landed in a new `kpos-solder-reskin` item instead of being spliced
into the old one.

**Duel/dive chrome is out of scope unless a brief explicitly names it.** The
telegraph stack (`.kp-daim`, `.kp-virus`, `.kp-sweep`), `kp-dive2`/`kp-rail`/
`kp-dock`/`kp-ability`/`kp-endturn`, and `.kp-dboard`'s own overflow rules
were all deliberately left untouched in this pass because the brief's item
list only named shell/window surfaces, not the duel itself. **Why:**
telegraph legibility is a standing craft rule ("the two-beat aim-then-strike
must always be readable"); touching duel chrome as a side effect of a
shell-wide token/button-system pass would risk that without being asked to.
**How to apply:** don't retrofit a new design-language system (button
variants, meter kit, etc.) onto duel/dive components just because "the
tokens exist now" -- wait for a brief that names the duel surface directly.

**Art budget none means zero art orders, not "minimal" art orders.** When a
brief states art budget none, that overrides the general standing
instruction to file art orders for new icons/chrome/cursors -- file nothing,
and if a texture reads as needing "real art" (a wireframe globe, a waveform
strip, dither/halftone fields), it has to be built as CSS/repeating-gradient
or hand-authored inline SVG (`<rect>`/`<line>`/`<circle>` only, matching
`icons.tsx`'s own construction idiom) instead. Also worth remembering: an
existing raster asset a redesign pass could remove a dependency on (this
pass dropped `.kp-wallpaper`'s reliance on `/assets/px/ui/wallpaper.png` in
favor of a CSS/SVG composition) is a net simplification, not something that
needs an order either.

See also `[[kpos-channel-and-pip-design]]` and `[[kpos-window-sizing-law]]`.
