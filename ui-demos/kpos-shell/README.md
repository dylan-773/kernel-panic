# kpos-shell (v2: single-phosphor poster)

The full KP/OS desktop environment rebuilt for `ux-2026-07-28-kpos-redesign`,
round 2. Round 1 kept the shipped navy/grey base and decorated it; the user
rejected it. v2 rebuilds the visual system from the reference DNA directly:

- ONE unified scheme across the whole OS: near-black void plus a single ink
  accent that does everything (text, borders, fills, meters, imagery), a
  support tone, one hot highlight. No greys anywhere; danger is inverse
  video (ink block, void text), never a second hue.
- Hue set switchable in the demo rig: LAVENDER (default, sampled from
  ref-4's dossier: hot #d8e3f6 / glyph #8684c0 under scanlines / support
  #3a3966, CRT-compensated to ink #b3b0f2 on void #0a0913), MAGENTA/violet
  (ref-1), PHOSPHOR green (ref-2). One `data-hue` attribute swaps the
  entire OS.
- Title bars are solid ink strips with void pixel text and pixel window
  glyphs (ref-1's FORCE OF WILL bar). Windows carry hard offset + glow
  drop-shadows.
- All imagery (portraits, stills, darknet icon) is monochrome-tinted to the
  ink via grayscale + multiply blend + 2px dither overlay: everything reads
  as a 1-bit phosphor print (ref-4's eye).
- Data rows are boxed `// LABEL _` strips everywhere (ref-2), type is
  VT323 19-21px body / Silkscreen labels, dither fields at 2/4/8px scales,
  outline KERNEL PANIC watermark + wireframe globe + ticker on the desktop.
- Press states flood inverse video (Kinetic Brutalism pattern from the
  ui-ux-pro-max database; grounded also in its Terminal CLI and Cyberpunk
  entries).

Structure/interaction is unchanged from round 1: kpos-window-sizing
footprints, the no-scrollbar law, paging (MANUAL.TXT tabs, DAD.LOG entries),
the gate-cleared SOLDER.BAY drag-to-craft machine, the leader-line teach
callout. Mock run state; catalog content and craft correctness import from
`kernel-panic-site/app/src/game/`.

## Integrated desktop (2026-07-29)

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

- INBOX (`inbox.html`) fronts the day loop and auto-opens at login; the
  JOBS.QUE icon and badge moved to it. The old flow window survives
  rig-only for DIAG / NIGHT / STORY (and its stale board/result screens).
- LOADOUT.CFG (`loadout.html`) replaces w-loadout; the FINE dither
  variant and the open replay are forced through the page's own rig
  hooks (`#ditherrow`, `#replay`). User ruling: FINE is the integration
  default for this window's art.
- SOLDER.BAY (`solder.html`) replaces w-solder; first open re-runs the
  DAY 4 rack reveal via `#pouchrow`, later opens keep bench state.
- REPAIR.LOG (`dive-report.html`) is new on the desktop; every open
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

## SOLDER.BAY poster study (solder.html)

Standalone page (the shell is untouched by it), per the magenta game-frame
reference (ref-1) anatomy: solid-ink title strip, left column of viewport
over dialogue box, big interactive panel right, boxed counter + inverse
item box at the panel's foot, full-width caption strip. The machine is
the shipped craft system inlined verbatim (patch-cells.ts legality, shape
nouns, foot and no-join lines; PATCH_POUCH_MAX 5): tap a piece then a
partner or drag one onto another, JOIN hero while holding, join preview
with CRAFT / CANCEL, spark + weld dot + shake on fuse, staggered slot
reveal, ESC cancels, reduced-motion instant. Pieces that cannot join
the held one go DEAD: disabled, piece faded, and a full-strength
diagonal slash across the slot (the slash rides the slot overlay, not
the dimmed children, so it survives the fade); with a pair locked the
rest of the rack goes inert until CRAFT or CANCEL; mid-drag the same
slash marks dead drop targets. Deck foot: boxed POUCH n/5
counter and the LAST WELD inverse-video item box.

The left viewport is a SCHEMATIC magnifier, not a picture: the held piece
drawn large on a blueprint grid; during a join candidate the arms the
partner contributes blink in hot ink, and a WORKPIECE datarow reads the
union ("TEE / 3 ARMS"). Ruling from this study: imagery inside a tool
window only when diegetic - a framed illustration of soldering has no
business inside the soldering tool. The bench illustration generated for
round 1 (Higgsfield nano_banana, 2 credits, anime-esque per the art
direction; raw kept as `art/raw-solder-bench.png`, 1-bit variants
`art/solder-bench-{fine,heavy,bayer}.png` at the 304px cell recipe) was
pulled from the page and banked for a surface where a picture makes
in-world sense (MANUAL.TXT diagram pages, DAD.LOG, marketing). On this
busy mid-tone scene FINE read best; HEAVY's 60..200 compress turned it
to checker mush - scene density matters when picking the default variant.

Demo rig scenarios: DAY 4 (the shipped data.ts mock pouch) and SCRAP
HAUL (demo-mock full pouch rich in legal joins). Demo-mock copy needing
gates at integration: the dialogue-box status lines ("PICK A PIECE.",
"PICK A PARTNER. THE WELD MUST OUTGROW BOTH.", "READY. HIT CRAFT TO
WELD.", "WELD DONE. ONE {SHAPE} IN THE POUCH.") and the SCHEMATIC /
WORKPIECE / LAST WELD labels. The gain-arm blink is a tier-0 teach of
the outgrow rule; flag it to the tutorial agent as partial coverage of
the owed solder-bay-intro moment.

## INBOX terminal study (inbox.html)

Standalone page (the shell is untouched by it), per the green PERSONAL
TERMINAL reference. Collapsed: a small INBOX window holding only three
boxed subject lines and the footer hint. Opening a ticket steps the
window wider (width transition 180ms steps(4)), draws a connector line
from the selected box, and shows a subject strip plus the FULL
CUSTOMER.REC card (card.html design, unmodified) with every text field
typing in concurrently: subject, row values, intake quote, then the hex
table, staggered starts, blinking carets, instant under
prefers-reduced-motion. Clicking the open ticket again files it away and
the window steps back down; UP/DOWN also select. Demo-mock copy: the
three subject lines (riffs on shipped quotes; real ones are a
narrative-director copy order). Card art reuses the Dex Marlowe dithers
for all three customers until an art-lead batch covers the roster.

## LOADOUT.CFG dashboard study (loadout.html)

Standalone page (the shell is untouched by it), per the purple "upgrade
dashboard" layout reference in the dossier skin: left column is the
operator's rig as 1-bit dithered photo cells (scan-line revealed), right
column is the three programs as boxed stat rows with tick-textured tier
meters, mode chips (flood inversion, locked modes dashed with "?"),
boost bays, and the read-only patch pouch; bottom is a NEURAL STRAIN
counter strip (number climbs, segment bar fills, "SEVERS AT ZERO.") and
a footer line. On open everything loads concurrently: status types
"DIVE KIT IS LOADING..." then snaps to "DIVE KIT READY.", meters sweep,
values count up, bays slot in. Mode-switch typewriters are scoped per
program so a click never cancels the rest of the sweep. Kit numbers,
modes, augments, and every description are the shipped catalog
(kit.ts / patch-cells.ts) at the mock day 4 run state from data.ts.
Demo-mock copy: "DIVE KIT", the load/ready status lines, photo tags
"USER 01" / "THE BENCH", and "SEVERS AT ZERO."; all would need the
loremaster gate at integration. The imagery is DIEGETIC, each cell has
an in-fiction reason to be in a config window (the "why would the OS
show this" rule):
- `FIG. 01 // BENCH RIG` (tall cell): the rig's service-manual plate,
  the way old OS hardware dialogs ship a stock line drawing of the
  device. Drawn as a clean manual illustration (leader lines, no
  lettering) and INVERTED after dithering so it renders as luminous
  schematic lines on void, ref-4's circuit panel exactly; a terminal
  renders a manual page in its own dark idiom, not as white paper.
- `BENCH FEED` (wide cell): the shop camera, live: ceiling-corner CCTV
  angle down at the diver mid-config (canon anchor: Rhea "watches the
  feed", lore/bible.md). Chrome sells it: inverse REC chip with
  blinking pip, a ticking `DAY 04 HH:MM:SS` clock (plain setInterval,
  survives load-sweep resets), and a slow rolling scan band
  (steps(30), hidden under reduced motion). The player sees themselves
  at the bench, right now.
Art is Higgsfield nano_banana in 90s OVA anime ink style (flat cel
shading dithers far cleaner than photo grain; the first photographic
attempt is archived as `art/raw-loadout-*-photo.png`, the pre-diegetic
anime scenes as `art/raw-loadout-diver.png` / `-rig.png`, current raws
as `art/raw-loadout-feed.png` / `-plate.png`). PIL post-pass:
autocontrast, gamma 0.85 shadow lift, resize to 304px, the cells'
EXACT inner CSS width so one dither dot maps to one CSS pixel, then
1-bit; plate variants invert after the tone map. Three variants per
subject, switchable in the demo rig's Dither row (all preload at page
open so the swap never depends on the file server): HEAVY (default;
highlights compressed to 185 with blacks KEPT at 0, so Floyd-Steinberg
screentones the flats while linework stays solid), FINE (plain
Floyd-Steinberg, cleanest print), BAYER (gamma 0.7, ordered 8x8
matrix, the patterned print look). Hard-won bounds: do not re-dither
at high res (browser downscale mushes the dots into grey noise), do
not go coarser than the 1:1 grid (152px dissolves these scenes into
checker noise), and never compress line art's blacks upward: the
photo-era HEAVY (60..200 both ends) floods anime linework into
unreadable grey mush, and a too-timid HEAVY (38..218) reads identical
to FINE under the tint so the switch feels broken. Ink-tinted live via
the multiply pass, so the hue switch recolors everything.

## REPAIR.LOG dive report study (dive-report.html)

Standalone page (the shell is untouched by it), per the green STATUS
poster reference. The shipped result screen (screens.tsx ResultScreen)
rebuilt as a dense status dossier: hero verdict with the customer's win
line typing in, ECG strain trace beside the chip receipt, payout counter
with the itemized rate rows, the augment draft as a dashed AUGMENT CACHE
box (pick one: INSTALLED stamp, siblings dim, footer label flips), a
patch-piece poster card, the pouch strip with NEW and left-on-the-bench
states, a tiny dive-log rail under the diver figure, and four telemetry
sparklines. Three rig scenarios cover every lastResult branch: ROUGH WIN
(chip breakdown plus a banked drop), CLEAN SWEEP (Clean Run bank,
inverse-video CLEAN chip), CAP AND DRY (halved rate plus salvage, dry
cache, capped drop). The footer button walks the day's tickets in order.
Win lines, augment copy, drop flavor lines, and payout math (jobPay,
SALVAGE_PAY 25, PATCH_POUCH_MAX 5) are verbatim shipped content; dive
log lines are demo-mock flavor in the duel vocabulary. The bays-full
swap flow is out of scope here (mock kit runs 2 of 3 bays). Figure art
is NEW: three Higgsfield nano_banana generations in 1990s anime OVA
ink style (16 credits across retakes: a photographic first pass mushed
into grey noise at 162px, then two manga retakes to purge baked-in
Japanese lettering; final raws kept as `art/raw-report-client-*.png`),
one happy client per scenario with their fixed device (Sable hugging
the courier drone, Juno holding up the handheld, Aldous beaming at the
ledger terminal; no appearance canon exists for any of them, so the
likenesses are demo-mock and owe the loremaster gate at integration).
Flat cel shading survives 1-bit far better than photography, which is
the same reason the Dex Marlowe cells read: big flat tonal masses.
Post-pass is the FINE recipe (autocontrast, gamma 0.85, plain
Floyd-Steinberg 1-bit; no tonal compression, lineart wants its solid
blacks) at 162x234, the figure cell's exact inner CSS size, so one
dither dot maps to one CSS pixel; swapped per scenario with a
win-line-derived tag (`RECORDS RECLAIMED` / `ON THE GOOD LIST` /
`BOOKS BALANCED`). Prompt rule learned twice: monochrome manga style
WILL generate speech bubbles and panel frames unless the prompt bans
text, borders, and bubbles explicitly.

## DIVE.EXE duel study (dive.html + dive.ts)

Standalone page (the shell is untouched by it), and the first study that is
PLAYABLE end to end: the whole flood-claim duel - board generation, reducer,
opponent AI, legality, traps, par, patch pieces, end conditions - imports
verbatim from `kernel-panic-site/app/src/game/` via `dive.ts` (built to
`dist/dive.js`); the file is presentation only. Sound is the shipped duel
palette: `sound.ts` grew a game bus plus the duel presets and composite
voices (cascade run, win/loss stinger, presence drone) copied 1:1 from
audio.ts.

Layout is the ship-diagnostic reference's anatomy mapped to the duel: solid
ink title strip (DIVE.EXE left, device + tier right), breadcrumb strip with
the 25-segment round meter (last five segments ticked, current blinking),
program keys as a left rail of boxed toggles (Silkscreen name, tier pips,
mode + cost line, RDY / USED / PICK n state chip per the fire-control
checklist reference), RAM as a corner-ticked counter box with square pips,
a BUS.LOG terminal filling the rest of the left rail (see below),
telemetry right rail (YOU | INTRUSION turn toggle pair, qualitative route
rows that go inverse on danger, INTRUSION table with live RAM / banked /
armed nodes, the dominant tell, PAR and STRAIN), and a full-width bottom
CONSOLE strip that typewrites engine notices, targeting prompts, and state
hints, and hosts CAST NOW / CANCEL. The board is drawn as a white-line
CIRCUIT SCHEMATIC per the black-schematic reference: arms are crisp
traces, hubs are pixel squares, ports are component boxes, the core is a
hatched component block with corner brackets that flare when a flood
touches it, slag is checker-dithered debris, and powered arms carry
marching-dash current. The WHOLE central component is a dressed
instrument surface, not just the SVG sheet (user round 2: the first
edge-masked texture pass was invisible): a full-bleed pixel dot matrix
over the wrap, faint graph-paper rules plus corner plus-marks under the
circuit, a two-scale dither haze pooling at the frame edges (a real
element, not ::before - the frame ticks own those pseudo slots), and
margin furniture drawn UNDER the board sheet at z 0: a DIVE.EXE outline
watermark bottom-left, a seeded hex address block top-right, and ruler
tick strips along the bottom and right edges. All of it is color-mixed
off --ch/--ch2 so the hue switch recolors the surface whole. Claim
cascades pop per-wave; impact labels stack top-center
(max 2); the machine's telegraph is blinking brackets; center-screen
virus-speak rides an inverse card with a support-tone echo.

BUS.LOG (user request): a realtime terminal tap of every move on the
board, bottom-anchored in the left rail, ring-buffered at 40 lines with
the newest line hot plus a blinking caret, older lines dim, no scrollbar
ever (old lines fall off the clipped top). Player actions log from the
dispatch site where targets are known, as hex bus addresses (`twist 0x2A`,
`arm: siphon 0x1F` - the attack-graph reference's address labels);
machine and world events log from the fx queue (`INT> charging redirect`,
`INT> cascade x3`, `SYS> trap sprung`); denied actions never log. Round
boundaries land as dim `== round NN ==` dividers. Prefixes are
actor-colored: YOU> hot ink, INT> support tone, SYS> dim.

Rulings from this study:

- The intrusion is the SUPPORT TONE (--ch2) plus monochrome glitch motion
  (a steps(1) positional jitter on its territory, port, and virus card),
  never a second hue. Chromatic-aberration color fringing from the
  attack-graph reference was rejected: tint echoes of in-scheme tones only.
  Danger chrome (threat banners, warn rows) stays inverse video.
- Engine imports beat re-implementation even for a "visual" study: the day
  configs, opponent cadence (420ms steps), telegraph beat, par math, and
  every notice line came along for free and cannot drift.
- SVG cell groups take the click on the GROUP, not a hit rect - arms and
  overlay children otherwise swallow the tap.
- A weld on unclaimed ground needs its own mark (hot dot on the hollow
  hub); void-on-void disappears.
- NEVER `transform-box: fill-box` on the arm groups. CSS transforms on SVG
  elements already pivot on the local origin (the hub, after the parent
  translate) - the shipped board depends on this. fill-box pivots on the
  arm set's own bounding box, which for I / L / T junctions is off-hub, so
  every pre-scrambled cell drifts and the grid reads as disconnected
  stubs. (Shipped styles.css uses fill-box only on the core ring, whose
  bbox is centered.)
- The powered dash march is DIRECTED: a per-render BFS from each port
  across aligned arm pairs assigns every lit arm in/out flow, so current
  visibly runs port-to-frontier along a claimed line; a powered dead stub
  holds steady light. Undirected marching reads wrong the moment two arms
  join.
- Square 1-bit macros show FULL FRAME (aspect-ratio 1, 4:3 at short
  viewport heights); a wide band crop beheads the composition.
- NO COUNTDOWN NUMBERS (user ruling): the panel never prints either
  side's rotation distance to the core. Route rows are qualitative
  (OPEN / SEVERED / CLOSING / CUT / AT THE CORE) and the threat banner
  says "THE INTRUSION IS CLOSING ON THE CORE" without a count; the
  shipped duel.tsx banner text ("INTRUSION n ROTATIONS FROM THE CORE")
  does not carry over. Distance still drives the heartbeat tiers and the
  warn inversions, so the tension survives the numbers' removal.
- The machine is named INTRUSION on every surface (user ruling): board
  port tag, turn pair, telemetry heading, console lines. The shipped
  SIG-0 port tag (duel-board.tsx) does not carry over; integration must
  rename it there too or take this to the loremaster.

Demo rig scenarios, all shipped content at fixed seeds (RESEED rerolls):
DAY 2 JUNO (base kit, empty pouch, strain 84), DAY 4 SABLE (the shared
data.ts mock run state: T2/T1/T2, hotBoot + cleanRun, four pouch pieces),
DAY 7 INES (T3/T2/T2, ARM: SIPHON + LOCK configs, cheapShot + tapLine +
echoTap, tier-4 halt-heavy machine). Keys: 1/2/3 cast, E ends turn, ESC
cancels.

Demo-mock copy owing gates at integration: the console default hints
("Your move. Twist a junction in reach...", "The intrusion is moving.
Watch the line.", "No RAM left. E ends the turn.", "LINK CLOSED."), the
datarow labels and route states (YOUR ROUTE / ITS ROUTE, OPEN / SEVERED /
CLOSING / CUT / AT THE CORE), the countless threat banner line, the
INTRUSION rename, the whole BUS.LOG vocabulary (tap spliced / bus live /
twist / charging / round dividers), the result bill framing, NEW DIVE,
and the device cell tag ("ON THE BENCH // {device}"). Everything else (virus lines, notices, tells, mode labels,
threat banners, result reasons) is shipped duel copy. The device cell
reuses the Dex Marlowe cram-deck dither for every customer - placeholder
until an art-lead batch covers per-device stills; the diegetic claim (the
OS shows what the bench is tapped into) needs the loremaster gate either
way.

## CUSTOMER.REC card study (card.html)

`card.html` is a standalone dossier-card study modeled cell-for-cell on
ref-4 (SUBJECT A-34), for canon customer Dex Marlowe (customers.ts:95-109,
lore/bible.md:157). Data rows are his shipped profile (device, dominant
routine REDIRECT, tiers 2-3 at jobPay 90/115 cr, intake quote verbatim).
Art is NEW: two Higgsfield nano_banana generations (4 credits) run through
a deterministic PIL post-pass (autocontrast, 880px, Floyd-Steinberg to
strict 1-bit) in `art/` - a portrait and the Nocta cram deck macro - kept
as high-res dithered monochrome PNGs and ink-tinted live via the same
multiply pass as the shell, so the hue switch recolors them. Raw model
outputs kept beside them (`art/raw-*.png`) for re-dithering.

## Building / viewing

```
cd ui-demos/kpos-shell
bun build main.ts --outfile dist/main.js --format iife --target browser
bun build dive.ts --outfile dist/dive.js --format iife --target browser
open index.html    # the shell; open dive.html for the duel study
```

Demo rig (top right): Hue switch + flow-screen jumps (NIGHT opens the
darknet market).

## Pipeline notes for the integration pass

- The v2 look SUPERSEDES the proposal's per-window channel assignments
  (magenta darknet / phosphor ledger / indigo dadlog are dead; the user
  ruled one unified scheme). If this direction wins, ux-agent.json needs a
  round-2 revision: one hue-set token block, inverse-video danger, the
  ink-tint imagery treatment, solid-ink title bars.
- DARKNET.LNK stays "the odd one out" via its stepped-notch title bar,
  chevron mark, and heavier dither, not via color.
- Round-1 build findings that still stand: per-surface hero clamps
  (ledger 44px, darknet 40px, dadlog 52px, manual-dense 34px), column-flow
  packing for the 18-card AUGMENTS page, reserved height for SOLDER.BAY's
  conditional JOIN hero, two-across bays + CONFIGS under programs in
  LOADOUT.CFG, ticker steps(140) not steps(40).
- Boot line 1 ships name-free ("REPAIR BENCH BIOS v9.2") per the loremaster
  gate's REVISE on the shipped boot.tsx OVERBY line (lore ledger ruling 8).
- Teaching debts unchanged (tutorial gate): solder-bay-intro coachmark and
  the copy-patch-craft revision are owed at integration.
