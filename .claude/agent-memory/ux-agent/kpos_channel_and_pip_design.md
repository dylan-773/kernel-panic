---
name: kpos-channel-and-pip-design
description: KP/OS accent-channel assignment per surface, glow discipline, and pip glyph vocabulary decided in the ux-2026-07-28-kpos-redesign pass
metadata:
  type: project
aliases: [kpos-channel-and-pip-design]

---

Decided during the full KP/OS visual redesign (`pipeline/proposals/ux-agent.json`,
brief `ux-2026-07-28-kpos-redesign`, item `kpos-design-language`), grounded
against four reference sheets at
`pipeline/art/reference/ux-2026-07-28-kpos/ref-*.png`.

**Channel assignment.** Only three windows get a non-default accent channel,
one each, chosen because the window's own fiction already matches the
reference sheet's subject:
- DARKNET.LNK -> magenta/violet (`--kp-magenta` #ff3fae primary, `--kp-violet`
  #8d5bff secondary-only, never a border/button color) -- the bootleg CRT
  vendor terminal, matches ref-1.
- LEDGER.LOG -> phosphor green (`--kp-phosphor` #33e37a) -- it IS a data
  sheet, matches ref-2.
- DAD.LOG -> indigo (`--kp-indigo` #7080ff) -- a personal dossier, matches
  ref-4.

Every other surface (SHOPFRONT.EXE's job board/diagnostic/result/night/story,
LOADOUT.CFG, MANUAL.TXT, SOLDER.BAY, and all shell chrome: desktop, taskbar,
start menu, boot, login) stays on the existing default rose/signal/gold shop
palette. **Why:** channel-per-surface is the point (ref sheets each commit to
one accent), but giving every window its own color turns the desktop into a
rainbow and destroys the "one house, three specialist rooms" read. Only rooms
that are fictionally a DIFFERENT kind of system (a gray-market vendor, a bank
ledger, a father's private file) earn a different accent.

**Teach callout is a deliberate fourth exception.** The `kp-teach` coachmark
(see `[[kpos-window-sizing-law]]` sibling memory for the window law it lives
inside) always renders in `--kp-signal` regardless of which surface hosts it,
never recoloring to the host's magenta/phosphor/indigo. **Why:** the
teaching layer's whole job is to read as "the interface is teaching you
something" consistently, independent of which room the player is standing
in; recoloring it per-surface would make it look like part of the room
instead of a layer above every room. **How to apply:** if a future teaching
UI item is speced, keep the signal-only rule; don't let a window's channel
leak into it.

**Glow discipline.** Glow (text-shadow bloom / soft box-shadow) is reserved
for exactly three situations: (1) a surface's own channel on its own ONE
hero-size wordmark moment per surface (strong, 16-20px, matching the
existing kp-idle h2 20px rose bloom and boot-mark 18px bloom precedents),
(2) any focused/active chrome gets a small 6-8px bloom in whatever channel is
already live there, (3) danger/threat is ALWAYS `--kp-crimson` glow
regardless of the host surface's own channel, since threat is a system-wide
alarm color, never room-local (matches existing kp-par-over precedent).
Glow never appears on body text, disabled/dim elements, empty meter
segments, or stacked on more than one element in a component. **Why:**
without this rule a full redesign pass tends to glow everything "for wow,"
which reads as noisy rather than premium once the CRT overlay and a shaking
board are added on top. **How to apply:** any new hero-type moment or focus
state should cite this three-situation list rather than adding a new glow
rule ad hoc.

**Pip glyph vocabulary.** Rejected the reference sheets' literal heart pips
(ref-1, ref-2 both use hearts for a life-meter). **Why:** KP/OS's fiction is
a technical/software terminal, not an RPG life bar; hearts would import a
genre signal the game doesn't want. Settled on two glyphs instead, both
hand-built `<rect>`-only SVG matching the icons.tsx idiom (no raster art):
- **Square pip** (`.kp-pip-sq`, formalizes the already-shipped `kp-pip`):
  capacity/slot meters — boost bays, patch pouch, config slots. Filled =
  solid host-channel square, empty = outline only.
- **Diamond pip** (`.kp-pip-diamond`, new): threat/danger ratings — job
  tier, diagnostic threat tier. ALWAYS `--kp-crimson`/`var(--kp-line)`
  regardless of host surface channel (same "danger is universal" rule as the
  glow discipline above), replacing the old `■`/`□` text-glyph threat
  readout. **How to apply:** any new bounded 0-N rating that is about
  danger/threat gets a diamond; any new bounded 0-N rating that is about
  capacity/slots gets a square. Don't invent a third pip shape without a
  clear reason two doesn't cover.

See also `[[kpos-window-sizing-law]]` and `[[kpos-redesign-scope]]` for the
rest of this pass's standing decisions.
