# Brief: ux-2026-07-31-desktop-dive

NOTE ON THE PATH: `pipeline/BRIEF.md` is owned by a concurrent cycle
(darknet-v3) running in another session, so this cycle's brief lives here.
Same contract, different slot. Anything else this cycle writes into shared
pipeline files (`proposals/ux-agent.json`, `ui-demos/manifest.json`) must
APPEND or surgically edit, never rewrite wholesale.

Goal: rebuild the BASE KP/OS DESKTOP SHELL and DIVE.EXE as STANDALONE
STUDIES at `ui-demos/kpos-desktop-v3/index.html` and
`ui-demos/dive-v3/index.html`, to the KP/OS v3 instrument-panel system.
`ui-demos/RULINGS.md` IS the spec; `ui-demos/loadout-eva/` is the reference
implementation. The main game code (`kernel-panic-site/`) is OUT OF SCOPE
this cycle. The user reviews the studies first; integration is a later
`/kp-ui integrate` invocation.

USER DIRECTIVE (verbatim): "redesign the base kp/os desktop and dive.exe to
match the new design spec."

PROCESS: both are redesigns of EXISTING surfaces, so per `RULINGS.md`
"Process" this cycle is PURE UI. No loremaster gate, no tutorial gate, no
detours into game code. Gate-shaped concerns get noted in each demo's
`NOTES.md` and mentioned once in the report.

SEQUENCING NOTE: the panel queue in `RULINGS.md` listed DIVE.EXE last. The
user has called for it now; the queue note that survives is the CONSTRAINT,
not the ordering: DIVE.EXE is full-screen and real-time, the machine's
two-beat telegraph must stay readable, and it does not follow the WINDOW
rules (chrome, height ceiling). Every other law applies.

THE SCOPE OF RULING 14 GETS ANSWERED HERE. `loadout-eva/NOTES.md` flagged
that colour-as-roles was scoped to LOADOUT.CFG only and that "a desktop
running both would read as two products." Redesigning the shell to the v3
system IS the extension of the role system desktop-wide: the shell carries
`data-scheme`, windows inherit it, and the `:root` default still collapses
every role onto the single v2 accent. The demo exists so the user can see
that decision before anyone integrates it. Record the outcome in NOTES.md as
a question ANSWERED BY APPROVAL, not assumed in advance.

---

## Surface 1: the base desktop shell (`kpos-desktop-v3`)

What is being replaced: the shipped shell in
`kernel-panic-site/app/src/components/os/` (`shop-os.tsx`, `desk.tsx`,
`wm.tsx`, `wm.css`, `boot.tsx`, `login.tsx`) plus the old
`ui-demos/kpos-desktop/` study. Read them for STRUCTURE and state flow only;
the look is the thing being replaced.

Current anatomy, all of which must survive in some form or be cut on the
record per law 8:

- **boot**: 1700ms six-line BIOS card, click to skip
- **login**: 3 save-slot cards (avatar, USER 0n, ATTEMPT/DAY/STRAIN rows,
  door-state line), DEL per slot, TEST SOUND panel, fake type-in on pick
- **wallpaper furniture**: dither-field wallpaper, 4 registration crosses,
  the WallPoster (KP/OS v9.2 tag, mark, wordmark, ATTEMPT/DAY/door chips),
  the WallScope (SIGNAL BUS scope, BENCH CLOCK ticking 1/s, seeded hex table)
- **icon grid**: eight pixel icons in a left column with ink tag labels and
  slot-in stagger; INBOX carries the open-job badge
- **ticker**: the stats marquee at `steps(140)`, 26px above the taskbar
- **taskbar (44px)**: KP/OS start button, USER / DAY / STRAIN / CR chips,
  spacer, ABANDON (danger, modal), SND toggle. No clock (clock lives on the
  wallpaper scope)
- **start menu**: MUSIC / TEST SOUND / HUE cycle / LOG OUT / CLOSE
- **window chrome (`wm.tsx`/`wm.css`)**: 3px border, solid-ink title bar,
  one pixel-X button, drag-only WM with clamping, focus pulse, DARKNET's
  stepped-notch variant, `overflow:visible` no-scrollbar body
- **CRT**: the old `.kp-crt` fixed overlay (scanlines + vignette,
  multiply-blended over everything)

The v3 laws that bite hardest:

1. **THE SHELL IS THE STAGE (law 6).** The `.kp-crt` overlay is replaced by
   the six-layer glass from `loadout-eva` (phosphor scanlines, aperture
   grille, bloom, specular, elliptical falloff, bezel lip), ONE tube over
   the whole desk, never per window. FLAT default / OFF. Do not rebuild
   CURVED.
2. **ROLES DESKTOP-WIDE (law 1).** The start menu's HUE cycle becomes the
   SCHEME switch (NERV / TOKYO NIGHT), writing `data-scheme` on the root the
   way `data-hue` is written today. With no scheme set the shell must render
   exactly as the v2 single-accent desktop: that reversibility is the law's
   own escape hatch and must stay demonstrable. Assign all eight roles for
   the shell explicitly: chrome and window borders `--r-struct`, everything
   that NAMES (// labels, icon tags, poster eyebrow) `--r-note`, live
   readouts (clock, scope trace, ticker values) `--r-line`, day/credits
   values `--r-data`, door-open / OK pips `--r-ok`, hazard stripes and the
   ABANDON furniture `--r-hazard`.
3. **THE SHELL'S ALARM IS STRAIN (law 1).** The taskbar STRAIN chip is
   today's `kp-chip-crimson` at >70; it becomes the one `--r-warn` owner on
   the desktop, with all three channels: colour, inverse video, and motion
   on the composited difference-blend pattern. Nothing else on the shell may
   take `--r-warn`. ABANDON is hazard, not warn: it is furniture, not an
   alarm.
4. **AMBIENT CHROME NEVER MOVES (law 7)** - with two recorded carve-outs
   that are already canon: the ticker at `steps(140)` (RULINGS explicitly
   preserves it) and the BENCH CLOCK seconds. The scope's 9s roll loop must
   justify itself or go still; decide and record it. Icon stagger and
   window-entry steps() are events, not ambience, and stay.
5. **GLANCE ORDER OF A SHELL (law 2).** The desk's focal element is THE
   FOCUSED WINDOW; every piece of shell furniture is deliberately ambient
   and must be demoted to survive next to a v3 window's hero numerals.
   State the order for the idle desk (no window open) separately.
6. **TILING IS THE POINT (law 3).** The v3 height ceiling exists so windows
   tile; the shell study must PROVE it: a scenario with two ~700px-budget
   windows side by side on the 1366x768 desk, neither clipped, taskbar and
   ticker clear. Window chrome sizes on `cqi` within each window frame;
   shell furniture (taskbar, ticker, icons) sizes against the viewport but
   renders the SAME arrangement on all three supported viewports.

## Surface 2: DIVE.EXE (`dive-v3`)

What is being replaced: `components/game/duel.tsx` + `duel-board.tsx` +
`.dv-*` in `styles.css`, and the old `ui-demos/dive/` study. The old study
runs the SHIPPED ENGINE (`dive.ts` bundling `src/game/` via bun); the new
study must do the same so behaviour and numbers cannot drift. Playable end
to end.

Current anatomy: title strip, breadcrumb (ROUND n/25 segment meter, DAY
chip, SND), 3-column stage (left rail 236px: RAM box, SCAN/ATTACK/DEFEND
program keys, patch pouch, BUS.LOG, END TURN; centre: the SVG board with
sweep, virus card, impact pulses, threat banners; right rail 264px: turn
pair, route rows, INTRUSION panel with tell and INTENT, PAR + STRAIN meters,
device photo), console strip with typewriter and contextual buttons, info
card, end-of-dive overlay (headline, bill, VIEW BOARD / CONTINUE).

The v3 laws that bite hardest:

1. **GLANCE ORDER (law 2).** The board is the game; say whether it is the
   focal element or whether the focal element is the thing the player must
   READ each beat (the telegraph / the turn pair), then build the scale to
   enforce it. The current surface has three big numerals (RAM, round,
   strain) all at similar weight; demote explicitly.
2. **THE TELEGRAPH IS SACRED.** The machine's two-beat aim (dashed
   brackets + INTENT line + virus card) must stay readable through any
   scheme and any CRT mode. Under law 7 the telegraph is exactly what
   motion is FOR; it keeps its blink, and that blink must survive
   `prefers-reduced-motion` as a static but still-distinct state.
3. **RISK NEEDS ONE OWNER (law 1).** Candidates: the strain meter in its
   low band, or the ITS ROUTE IS OPEN / CLOSING ON THE CORE threat state.
   Pick ONE `--r-warn` owner, give it inverse + motion, and assign the
   rest of the red-adjacent furniture (`dv-seg-late`, threat banners,
   heartbeat states) to `--r-hazard` / `--r-line` explicitly so nobody
   reaches for warn twice. The INTRUSION side stops being bare `--ch2`:
   decide its role (likely `--r-hazard` as the machine's structural
   identity) and keep it distinct from the alarm.
4. **FLUID RAILS (law 3).** 236px/264px fixed rails become `clamp()` on
   `cqi` against the stage container; all three supported viewports render
   the SAME arrangement with the board scaling in the centre. Full-screen
   means no window chrome and no 700px ceiling, but NO SCROLLBARS holds
   absolutely, including the BUS.LOG (cap the visible lines; the log is
   not a scroll region).
5. **MOTION BUDGET (law 7).** The dive is the most animated surface in the
   game: sweep, pulses, virus card, heartbeat, drone. Every animation
   compositor-only, steps() timing, and each one must mean something is
   HAPPENING; ambient dot-grid and watermark never move. The device photo
   is this surface's camera-class imagery: `--r-aux`, three FEED
   treatments per law 5 if it stays; if it cannot survive its size, cut it
   outright per law 8 and record it.

## Variations the studies must offer (name them in the ui-specs)

Both demos:
- **SCHEME**: NERV (default) / TOKYO NIGHT. Copy the token block from
  `loadout-eva/index.html`; do not retype hexes.
- **CRT**: FLAT (default) / OFF. Six glass layers copied verbatim.
- **VIEWPORT**: 16:9 1366x768 / 21:9 2560x1080 / laptop 1280x800, same
  arrangement on all three (the loadout-eva scaled-stage rig is the
  precedent; reuse it).

`kpos-desktop-v3` additionally:
- **SCREEN**: BOOT / LOGIN / DESK IDLE (no run) / DESK MID-RUN (day 4,
  windows open) / DESK TILED (two windows side by side, the tiling proof)
- **STRAIN**: NOMINAL / STRAINED (>70, the taskbar alarm armed)
- **REPLAY** for boot choreography.

`dive-v3` additionally:
- **SCENARIO**: DAY 2 JUNO / DAY 4 SABLE / DAY 7 INES (the shipped
  configs the old study carries), plus RESEED
- **BEAT**: a forced TELEGRAPH state (machine aim armed) so the two-beat
  read is reviewable rather than waited for, and an END overlay state.

## Scope: ux-agent

Two `ui-spec` items in `pipeline/proposals/ux-agent.json`
(`kpos-desktop-v3`, `dive-v3`), plus any `sfx` items new motion needs.
APPEND to the existing items array; a concurrent cycle also writes to this
file, so re-read it immediately before writing and never drop items you did
not author. Each spec must be precise enough to BUILD: named zones with
their glyph budget, the stated glance order, the fluid rules (which clamp,
which container), the load choreography with timings, the role assignment
for all eight tokens, the cuts taken and their law-8 step, and observable
`acceptance` checks including: the tiling proof on the 768 desk, the strain
alarm's three channels, telegraph readability in both schemes and under
reduced motion, no internal scrollbars anywhere including BUS.LOG, and both
schemes resolving all eight roles distinctly on both surfaces.

Shipped sfx reused verbatim (`audio.ts` names): shell `winOpen`,
`winClose`, `winFocus`, `granted`, `stamp`, `tick`, `press`, `hueSwap`,
`turnLost`; dive `aim`, `heartbeat`, `rotate`, `deny`, `endTurn`,
`claimTick`, `scanCast`, `overParTick`, `busLogArrival`, plus the
drone/cascade/boom/stinger helpers. `hueSwap` presumably becomes the
scheme-switch sound; rename only if a new preset is genuinely needed.
Envelope values are PLAIN SECONDS.

Numbers and copy come from the game source. Transcribe, never invent:
`save.ts` (SLOT_COUNT 3, SlotSummary fields, RunScreen union),
`run-reducer.ts` (BASE_RAM 5, START_STRAIN 100, MAX_RAM 9), `duel-types.ts`
(ROUND_CAP 25, BASE_KIT), `content/kit.ts` (mode labels, widths, tells),
`content/arc.ts` (`dayDuelConfig`, FINAL_DAY), `opponent.ts` (intent
lines), and the shipped copy in `shop-os.tsx` / `duel.tsx` (boot lines,
ticker line, threat banners, VIRUS_LINES, end headlines). Strings carry
over verbatim; any NEW player-facing line beyond a bare noun becomes an
order under `pipeline/copy/orders/`. No em or en dashes.

## Art budget: NONE

Reuse what exists: `_shared/art/` (dex portrait/cramdeck + raws), the
loadout-eva bench feed, and the device art already reachable through the
engine bundle. The wallpaper is CSS, the icons are `PX_ICONS` bitmaps, the
boot card is type. Do not file art orders; if a layout wants more imagery,
design it to hold without it.
