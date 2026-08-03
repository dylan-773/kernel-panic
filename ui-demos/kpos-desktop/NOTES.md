# Integrated desktop

Demo: `ui-demos/kpos-desktop/index.html` (cycle `ux-2026-07-29-integration`)
System laws: [`../RULINGS.md`](../RULINGS.md)

The four completed studies are now desktop windows. They are embedded
VERBATIM - the study html files are byte-identical to their standalone
form - via `w-embed.ts`: each window is a same-origin iframe whose page
scaffold (body padding, demo rig, per-page CRT) is neutralized by an
injected stylesheet, never by editing the file. The iframe keeps a fixed
width so each study's `innerWidth`-based sizing math stays stable, its
height follows the window live (ResizeObserver inside the iframe realm),
and a clip-path synced to the window rect makes the unused halo
click-through to the desktop. The title strip drags the wrapper; any
pointerdown raises it in the shared wm.ts z-order. GOTCHA that cost a
round: the injected style must declare `html { color-scheme: dark; }` to
match the host iframe element, or the browser backs the iframe canvas
with an opaque fill and the transparent halo turns into a visible veil.

- INBOX (`inbox/index.html`) fronts the day loop and auto-opens at login; the
  JOBS.QUE icon and badge moved to it. The old flow window survives
  rig-only for DIAG / NIGHT / STORY (and its stale board/result screens).
- LOADOUT.CFG (`loadout/index.html`) replaces w-loadout; the FINE dither
  variant and the open replay are forced through the page's own rig
  hooks (`#ditherrow`, `#replay`). User ruling: FINE is the integration
  default for this window's art.
- SOLDER.BAY (`solder/index.html`) replaces w-solder; first open re-runs the
  DAY 4 rack reveal via `#pouchrow`, later opens keep bench state.
- REPAIR.LOG (`repair-log/index.html`) is new on the desktop; every open
  replays the current ticket via `#scenrow`.

Desktop furniture round 2 (user: "I wanted the logos redesigned, not
resized"): the logo is now a designed mark, not typeset text - a pixel
KP monogram whose middle scanline has slipped two cells and renders hot
(`kpMark()` in ui.ts; the mark "heals" for a blink every 7s, stays
broken under reduced motion, which IS the logo). It appears as the
boot/login lockup (monogram + two-line wordmark), the wallpaper emblem
over a scanline-masked KERNEL PANIC wordmark, and a tiny void-on-ink
monogram in the taskbar KP/OS button. The SIGNAL BUS scope is a live
widget (periodic trace twice the box width rolling one period on
steps(44), blinking pip) above a real ticking BENCH CLOCK row (same
shop clock as the BENCH FEED) and the hex table. The stats ticker runs
unconditionally now - the old pause-when-a-window-is-near froze it
permanently once full-height study windows landed. Icons and the
poster/scope slot in staggered at login; print-sheet registration
crosses sit in the desk corners.

Window chrome ruling (user): title bars carry ONLY a pixel-art X (the
one button that works). The kp-fw min/max glyph decorations are gone,
the kp-fw close is the same box-shadow-drawn pixel X, and the embed host
hides each study's decorative `_ [] #` cluster and injects
`.kp-embed-close` beside it. Studies viewed standalone still show their
original glyph cluster - only the desktop applies the X-only rule.
Hue: lavender default everywhere; the shell rig's hue switch now writes
`data-hue` into every embedded document too. kp-fw shadows updated to
the studies' 9px offset + 26px glow spec.
