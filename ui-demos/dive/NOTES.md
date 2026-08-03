# DIVE.EXE duel study

Demo: `ui-demos/dive/index.html` (cycle `ux-2026-07-28-kpos-redesign`)
System laws: [`../RULINGS.md`](../RULINGS.md)

Standalone page (the shell is untouched by it), and the first study that is
PLAYABLE end to end: the whole flood-claim duel - board generation, reducer,
opponent AI, legality, traps, par, patch pieces, end conditions - imports
verbatim from `kernel-panic-site/app/src/game/` via `dive/dive.ts` (built to
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
