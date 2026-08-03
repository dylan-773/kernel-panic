# MORNING.LOG day-start study

Demo: `ui-demos/morning-log/index.html` (cycle `ux-2026-07-31-morning-log`)
Spec: `pipeline/proposals/ux-agent.json`, item `morning-log-day-start-panel`
System laws: [`../RULINGS.md`](../RULINGS.md)
Reference implementation: [`../loadout-eva/`](../loadout-eva/NOTES.md)

The DAY START surface: Rhea's morning scene, rebuilt to the v3
instrument-panel system. This replaces `StoryScene`
(`components/game/screens.tsx`), which is the last surface in the game that
never had a v2 or a v3 pass. The shipped version is a stacked flexbox of a
96px portrait, a name span, `<p>` lines at 21px and a ghost NEXT button: no
glance order, no focal element, no role tokens, no container query, and
full-colour pixel art where the system calls for 1-bit dither.

`StoryScene` is shared by six callers, so whatever shape it takes here is the
shape every narrative beat in the game gets. This study designs the
`dayOpenScene` case and proves the `runOpenerScene` case; the other four are
documented in the spec, not built.

## What it decides

**1. On a surface made of prose, the focal element is the thing that is not
prose.** Law 2 wants one element at extreme scale and warns that 1.3x is not
hierarchy. A dialogue box is by nature a field of even body type, which is
exactly the trap. The DAY numeral takes the focal role, at 76 to 91px against
a body cap of 21px:

| viewport | window | numeral | body | ratio |
|---|---|---|---|---|
| 16:9 1366x768 | 860px | 82.6px | 21px | 3.93x |
| 21:9 2560x1080 | 940px | 90.6px | 21px | 4.31x |
| laptop 1280x800 | 760px | 76.0px | 21px | 3.62x |

The body copy holds its VT323 floor at every viewport and is never asked to
compete. The numeral takes the surface's one heavy-bracket treatment (law 4
scopes brackets to the focal panel only) and never changes within a scene,
so it reads as the anchor while the camera and the log update around it.

Stated glance order: **1st** the DAY numeral, **2nd** the beat being read
now, **3rd** the camera cell, **ambient** the eyebrow, register chip, beat
dots, shift ticks and past log entries.

**2. Beat-to-beat reflow is fixed by making the imagery a FIXTURE, not a
property of the beat.** This is the defect that actually motivated the
cycle: the shipped surface jumps on every click, because a `still` beat is
384px taller than a bare terminal beat. Here there is one 288x216 cell that
is always present at exactly the same size, and a beat selects what it
shows. That is diegetic rather than a layout trick: the shop has two mounted
cameras, and the OS is showing one of them.

- `portrait` on the beat -> **CAM 1 // COUNTER** (Rhea), REC light lit
- `still` on the beat -> **CAM 2 // BACK ROOM** (the curtain and the padlock)
- neither -> **STANDBY**, a real no-signal field

The mapping keys on the BEAT DATA, not on the speaker, which is why DAY 10
beat 2 shows the back room while Rhea is talking: the camera cuts to what she
is talking about. Measured across all four scenarios x every beat x all three
viewports: the body row is **360px in all 13 beat states**, so clicking
through a scene never moves the window.

**3. The window is called MORNING.LOG, so it behaves like one.** Beats
already read stay on screen above the current one, demoted to `--r-struct`.
This was not in the spec and was added at build time, because the first build
made the defect obvious: with one beat on screen the text panel was about 55%
empty. Two things fall out of it. The panel fills as the scene plays, and the
player can re-read what Rhea just said, which the shipped one-beat-at-a-time
player made impossible. The log is bottom-anchored so the line currently
typing never moves, and when a scene outgrows the box whole entries drop off
the top the way a terminal scrolls. **No internal scrollbar, ever.**

**4. Risk is armed on exactly one day.** Law 1: a surface with no alarm state
has no `--r-warn` at all. Three of the four built scenarios have none, which
is the point of building them. DAY 10 is the one day-start that genuinely
changes state: it has no `DAY_CONFIGS` entry at all, no tickets are taken,
and the back room settles up. The register chip flips to `REGISTER: CLOSED`
and takes all three channels the law demands: the `--r-warn` hue, an
inverse-video flood, and motion. Verified legible at BOTH blink phases
(void-on-red alternating with red-on-void), which is the check that matters,
since a blink that is unreadable half the time is worse than no blink.

The motion is a composited difference-blend plate on a promoted layer, copied
from `loadout-eva`'s `.lo-riskflash`, not an animated background: that
measured 50ms p95 against 9.3ms there, and this panel sits inside the same
filtered CRT subtree.

## Role assignments, all eight named once

| role | takes |
|---|---|
| `--r-struct` | panel hairlines, the camera frame, inactive beat dots, the name-chip box, past log entries |
| `--r-note` | the eyebrow, the DAY/RUN unit label, chip labels, tick labels, camera tags |
| `--r-line` | the beat's body copy, tick values, the filled beat dot |
| `--r-data` | the focal numeral only |
| `--r-ok` | REGISTER OPEN / BACK ROOM SEALED, and NEXT once the beat is revealed |
| `--r-warn` | the DAY 10 alarm and nothing else, anywhere |
| `--r-aux` | the camera cell's FRAME and CAM tag, marking it as a different signal class from bench data |
| `--r-hazard` | the window edge, the numeral's brackets, the REC light |

Verified by computed paint under both schemes, not by reading the rule text.
Worth knowing for the next panel: **Chrome's CSSOM resolves `var()` inside
the `background` shorthand at parse time**, so a token used only there is
invisible in `cssText` and a rule-text audit reports it as unused. The first
harness pass produced exactly that false negative on `--r-aux`.

## Motion, and where this panel is stricter than the reference

The typewriter is the primary interaction here, not load choreography: text
types at 24ms/char with a 90ms gap between lines, the player clicks, the next
beat types. A click mid-type **snaps the current beat fully revealed without
advancing**; a second click advances. That is new (the shipped surface
advances on any click, so a fast reader either waits or loses a line).

Everything else is dead still. `loadout-eva` blinks its REC light and rolls a
band across its feed; **this panel does neither**, because law 7 reserves
motion and this surface has an alarm that needs to own it. On a calm scene
(DAY 1) the harness confirms zero infinite animations anywhere in the window,
and on DAY 10 exactly one: the alarm. That asymmetry is the whole mechanism.

Reduced motion collapses to the settled state in one frame: beats render
fully revealed, the camera cut is instant, the alarm becomes a static inverse
flood, and the footprint is unchanged at 360px. Sound is unaffected.

## Footprint

| viewport | window width | height |
|---|---|---|
| 16:9 1366x768 | 860px | ~545px |
| 21:9 2560x1080 | 940px | 550px |
| laptop 1280x800 | 760px | ~545px |

Worst case **550px against a 700px target and an 820px ceiling**, measured
with the tube OFF per law 10. All three viewports render the same two-column
arrangement.

## Cuts, honestly

This surface did not need much cutting. The shipped version was already lean;
its defect was the ABSENCE of a fixed footprint, not an excess of content, so
the work here is mostly additive structure. Walking law 8's order for the
record: the still is reduced from a 576x384 box to a 288x216 cell by CROP
rather than by shrinking (law 5's mechanism), and the beat dots and shift
ticks were designed unboxed from the start rather than un-boxed later. Prose
cuts, popup demotion and paging were all not applicable.

## Variations

- **SCHEME** NERV (default) / TOKYO NIGHT. Both resolve all eight roles
  distinctly.
- **SCENARIO** DAY 1 / DAY 5 / DAY 10 (the alarm) / RUN 2 OPENER. Between
  them they cover all four beat shapes and prove a second `StoryScene`
  caller lands in the same panel.
- **FEED** FULL COLOUR (default, per the 2026-08-01 ruling) / INK TINT /
  TRUE 1-BIT on the camera cell.
- **CRT** FLAT / OFF. Six glass layers, copied verbatim. CURVED is not
  rebuilt (law 6).
- **VIEWPORT** all three supported desks.
- **REPLAY FROM BEAT 1** for the beat choreography.

## Art

Two orders, both fulfilled this cycle: `morning-rhea-feed` (CAM 1) and
`morning-backroom-still` (CAM 2), both at 288x216, both read at 1:1 and never
resized. Neither existing asset survived law 5: `portraits/sister.png` is
256x256 full-colour pixel art whose face is only about 60px across, so
dithering it yields mush, and the stills are 316x212 shown in a 576x384 cell,
which is a downscale then an upscale.

**One correction worth recording.** The first backroom plate came back
unreadable: `dither.py --width 288 --height 216` on a 1200x896 source whose
aspect already matches is a pure 4.17x DOWNSCALE of the whole scene, not a
crop, so the padlock (the subject, and the thing the entire story is about)
landed at roughly 25px and dissolved into the dither. The raw was fine. The
fix was law 5's own instruction, applied one step earlier in the pipeline:
crop the raw to a 576x432 window on the padlock BEFORE the dither pass, so
the subject occupies a real fraction of the cell. `--focus-x/--focus-y` do
nothing when source and target aspects already agree, which is the trap.

FULL COLOUR is a colourisation, not a reveal: the source art is monochrome
ink, so `colourise.py --ramp paper` gradient-maps it and re-dithers to 16
colours. Same generator `loadout-eva` used.

### USER RULING 2026-08-01: FULL COLOUR is the default treatment here

Review verdict: *"Love. Go with full color images for this one."* FULL COLOUR
is now the boot state and the manifest default; INK TINT and TRUE 1-BIT stay
as options. This is the same shape of ruling as `loadout`'s ("FINE is the
integration default for this window's art"), scoped to this window.

Two consequences worth stating, because they are not obvious:

1. **`--r-aux` moved off the tint and onto the camera's chrome.** The ink
   tint was what painted `--r-aux`, so defaulting to full colour would have
   left the role unpainted in the default state. The frame and the CAM tag
   carry it now, which is the more honest assignment anyway: `--r-aux` means
   "a different signal class", and that is true of the camera whatever
   treatment its picture is in. STANDBY deliberately does NOT take the aux
   frame, because a dead channel is not a channel. Re-verified: all eight
   roles still paint under both schemes.
2. **A full-colour plate does not recolour with the scheme.** Under NERV the
   warm sepia sits naturally with the amber panel. Under TOKYO NIGHT it is a
   warm plate in a cool room. Reviewed both: it reads as the camera being a
   separate channel rather than as a clash, and the `--r-aux` frame reinforces
   that. But it IS a real consequence of the ruling and the one thing to look
   at again if TOKYO NIGHT ever becomes the primary scheme. INK TINT remains
   the treatment that tracks the scheme.

The FULL COLOUR plates are also simply more legible than the 1-bit ones at
this size, which is the practical argument: the padlock in CAM 2 is
unmistakable in colour and takes a moment to find in 1-bit.

## What it still owes

- **`storySkip`, `camSwitch` and `registerAlarm` need to land in `audio.ts`**
  as real sfxr presets (params are in the proposal item; envelope values are
  PLAIN SECONDS). The demo approximates their character in inline WebAudio.
- **The masthead needs a value per caller.** Only `dayOpenScene` passes a
  `tag` today; the other five callers pass none, so integration needs a prop
  or the focal slot renders empty. The spec proposes a unit/numeral pair for
  each (RUN n, CORE OPEN, SYS BOOT/SEAL) but only DAY and RUN are built.
- **`runEndScene`'s first beat is literally a strain-zero alarm**
  ("NEURAL STRAIN: ZERO. CONNECTION SEVERED."), which is a second legitimate
  claimant on the `--r-warn` treatment built here for DAY 10. Flagged for a
  decision at integration, not assumed.
- The log currently retains the previous beat plus the current one at 360px.
  If a future scene wants deeper recall, the row can grow to about 500px
  before the window approaches its 700px target.
- Nothing here is wired to real state or navigation; CONTINUE is inert.

## Process

Pure UI per `RULINGS.md`'s Process section: this redesigns an existing
surface, introduces no new fiction and no new mechanic, so no loremaster gate
and no tutorial gate were run. Every player-facing line is transcribed
verbatim from `game/content/story.ts`. The only authored copy is chrome
labels (`MORNING.LOG // DAY START`, `SPIKE`, `ON THE BOOK`, `CAM 1 //
COUNTER`, `STANDBY`), all bare nouns or window names.

One gate-shaped observation, noted rather than acted on: the click-to-skip
behaviour is a new interaction the player is never told about. The `CLICK TO
SKIP` / `CLICK ANYWHERE` hint in the panel's footer is the affordance, and it
changes with the state, but whether that is sufficient teaching is a
tutorial-agent question if this ever stops being a pure-UI change.

## Verification

Driven over CDP against the live review server (headless Chrome,
`Runtime.evaluate` plus `Page.captureScreenshot`), clicking the demo's own
rig and measuring real geometry.

**43 acceptance checks, all passing**, plus 10 reduced-motion checks and a
40-state log-fit sweep (every viewport x scenario x beat) confirming zero
clipped entries. Covered: the focal ratio at all three viewports, the 19-21px
body floor, equal footprint across 13 beat states, the height ceiling, no
scrollbars, no border-radius, 1:1 imagery, eight distinct roles painting under
both schemes, the alarm's three channels and its absence from the other three
scenarios, the FEED treatments, skip-versus-advance click semantics, masthead
persistence, one arrangement across three viewports, and no em or en dashes.

Two harness lessons for the next panel, both of which produced false
passes or false failures before being caught:

1. **`justify-content: flex-end` overflows in the block-START direction,
   which `scrollHeight` cannot see.** The log's "does it fit" test passed
   while entries were being silently clipped off the top. Bottom-anchoring
   via `margin-top: auto` on the first child spills overflow downward where
   `scrollHeight` reports it honestly.
2. **`min-height` is not a footprint guarantee.** The row was `min-height:
   300px` and grew to 523px once the log accumulated, reintroducing the exact
   reflow this panel exists to remove. It is a flat `height` now.
