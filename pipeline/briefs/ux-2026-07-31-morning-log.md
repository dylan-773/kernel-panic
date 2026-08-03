# Brief: ux-2026-07-31-morning-log

Goal: design the DAY START surface (Rhea's morning dialogue) as a STANDALONE
STUDY at `ui-demos/morning-log/index.html`, to the KP/OS v3 instrument-panel
system. `ui-demos/RULINGS.md` IS the spec; `ui-demos/loadout-eva/` is the
reference implementation. The main game code (`kernel-panic-site/`) is OUT OF
SCOPE this cycle. The user reviews the study first; integration is a later
`/kp-ui integrate` invocation.

USER DIRECTIVE (verbatim): "design new Rhea dialogue day start windows to
match the new design spec."

PROCESS: this redesigns an EXISTING surface, so per `RULINGS.md` "Process"
it is PURE UI. No loremaster gate, no tutorial gate, no detours into game
code. Gate-shaped concerns get noted in the demo's `NOTES.md` and mentioned
once in the report.

CONCURRENCY NOTE: several `/kp-ui` cycles are in flight at once (inbox-v3,
repair-log-v3, dadlog-v3, darknet-v3). Do NOT write `pipeline/BRIEF.md` and
do NOT rewrite `pipeline/proposals/ux-agent.json` wholesale. Write your
proposal to `pipeline/proposals/ux-agent.morning-log.json` as a standalone
fragment with the same shape (`agent`, `brief`, `notes`, `items`); the
Orchestrator merges it into the shared file. Same for art orders: one file
per order under `pipeline/art/orders/`, never touching another cycle's file.

## What is being replaced

The story scene player, `components/game/screens.tsx` `StoryScene`, rendered
inside the flow window `SHOPFRONT.EXE` (`shop-os.tsx`, `w: 940`) and styled
by the `.kp-story-*` block in `styles.css` (lines ~1495-1533, ~3635). It is
the only surface in the game that has never had a v2 or v3 pass: it is still
a stacked flexbox of a 96px portrait, a name span, `<p>` lines at 21px, and
a ghost NEXT button. It has no glance order, no focal element, no role
tokens, no container query, and its imagery is full-colour pixel art rather
than 1-bit dither.

Current anatomy, all of which must survive in some form or be cut on the
record per law 8:

- a persistent corner `tag` chip (e.g. `DAY 4`) via `kp-story-daytag`
- per beat: an optional 1:1 `still` (576x384 `PhotoCell`), an optional 96px
  `portrait` cell, the speaker name, one to three lines of body copy, and a
  three-bar "next" glyph
- a NEXT button that becomes CONTINUE on the last beat
- the whole surface is click-to-advance, and `sfx("story")` fires per advance

`StoryScene` is shared by six callers (`runOpenerScene`, `dayOpenScene`,
`tutorialIntroScene`, `tutorialOutroScene`, `runEndScene`, `finaleWinScene`),
so whatever is designed here is the shape every narrative beat in the game
gets. Design for the day-start case, but state in the spec how the other
callers land in it.

## The v3 laws this surface has to answer

Every law in `RULINGS.md` applies. The ones that bite hardest here:

1. **GLANCE ORDER (law 2) is the hard problem, because this surface is
   mostly PROSE.** Law 2 demands one focal element at extreme scale, 2x+ the
   next largest thing, and a dialogue box is by nature a field of even
   21px type. Decide the focal element and defend it. The obvious candidate
   is the DAY numeral (this is the day-start surface; the day is the number
   the player is orienting on and it is already the corner tag). The
   competing candidate is the speaker line itself. Whichever wins, the body
   copy must remain at its VT323 19-21px floor (law 3) and must not become
   the focal element by default just because there is a lot of it.
2. **BEAT TYPES ARE THE EQUAL-FOOTPRINT PROBLEM (law 4).** This surface has
   four beat shapes: system terminal (no portrait, no still), Rhea with
   portrait, system with a full-width still, Rhea with a still. The shipped
   layout reflows hard between them, so the window jumps on every click.
   Every beat type must occupy exactly the same footprint. Build all four
   and check.
3. **HEIGHT CEILING (law 3).** ~700px target, 820px absolute, measured with
   the CDP harness in law 10. The shipped surface sets `min-height: 380px`
   and grows with a 384px-tall still, which is roughly the whole budget for
   one image. Cut in law 8's order and record every cut and its reason.
4. **IMAGERY (law 5).** The current portrait and stills are full-colour
   pixel art at 256x256 and 316x212, and the still is DOWNSCALED into a
   576x384 cell. Both are v3 violations. Rhea's portrait is this surface's
   camera-class imagery and takes `--r-aux` plus the three FEED treatments
   (ink tint / true 1-bit / full colour). It must be 1:1 and framed on the
   SUBJECT, which for a talking-head surface means face and shoulders, not a
   full figure shrunk to fit. Give it an in-fiction reason to be on screen
   (the shop's own counter camera / the intercom) rather than treating it as
   a visual-novel portrait box.
5. **RISK (law 1).** A calm morning has no alarm, and law 1 says a surface
   with no alarm state has no `--r-warn` at all. Do NOT invent one for
   decoration. If any day-start state genuinely arms an alarm (day 10, when
   the back room settles up and there are no tickets), name that state, arm
   `--r-warn` only there, and give it the inverse-video AND motion channels
   the law demands. Otherwise state in the spec that this surface
   deliberately runs without `--r-warn`.
6. **MOTION (law 7).** This is the one surface where the typewriter is the
   PRIMARY interaction, not load choreography: text types, the player
   clicks, the next beat types. Spec the type rate, what a click mid-type
   does (skip to the full line is the shipped convention elsewhere in KP),
   and how reduced motion collapses it. Everything else on the panel stays
   dead still.

Role assignments worth stating: `--r-aux` owns the Rhea feed cell.
`--r-data` owns the focal numeral only. `--r-note` owns the speaker name and
every `// LABEL`. Decide what `--r-ok` means here, if anything (a candidate:
the register / shop OPEN status), and say so; do not leave a token
unassigned and do not assign one twice. Make every one of the eight
explicit.

## Variations the study must offer (name them in the ui-spec)

- **SCHEME**: NERV (default) / TOKYO NIGHT. Copy the token block from
  `loadout-eva/index.html`; do not retype hexes.
- **CRT**: FLAT (default) / OFF. Six glass layers, copied verbatim. Do not
  rebuild CURVED.
- **VIEWPORT**: 16:9 1366x768 / 21:9 2560x1080 / laptop 1280x800, all three
  rendering the SAME arrangement.
- **FEED**: INK TINT / TRUE 1-BIT / FULL COLOUR on the Rhea cell.
- **SCENARIO**, covering every beat shape and the range of the writing:
  - DAY 1 (system open, Rhea portrait, system closer: three beats, the first
    morning)
  - DAY 5 (Rhea portrait plus a system STILL beat, the mid-run shape)
  - DAY 10 (no tickets, the back room settles up, four beats including a
    Rhea-over-still beat: the heaviest scene in the set)
  - RUN 2 OPENER (the counter scene shape, to prove the other caller lands)
- **REPLAY** for the beat choreography.

## Scope: ux-agent

One `ui-spec` item in `pipeline/proposals/ux-agent.morning-log.json`, plus
any `sfx` items new motion needs. The spec must be precise enough to BUILD:
named zones with their glyph budget, the stated glance order, the fluid
rules (which clamp, which container query), the beat choreography with
timings, the role assignment for all eight tokens, the cuts taken against
the 700px ceiling, and observable `acceptance` checks including the height
ceiling and the equal-footprint beat types.

Shipped sfx already in `audio.ts`: `story` fires on every advance. Propose
new presets only if the new motion needs a sound the set does not have;
envelope values are PLAIN SECONDS.

Copy comes from the game source verbatim. Transcribe, never invent:
`game/content/story.ts` (`dayOpenScene` days 1-10, `runOpenerScene` 1-4,
`DAY_LINES`), and `screens.tsx`'s `SPEAKER_NAME` map (`sister` renders as
`RHEA`). Any NEW label beyond a bare noun becomes an order under
`pipeline/copy/orders/`. No em or en dashes.

## Art budget: TWO ORDERS, and file them FIRST

This is the one surface whose subject IS an image, and neither existing
asset survives law 5: `portraits/sister.png` is 256x256 full-colour pixel
art whose face is only about 60px across, so dithering it yields mush, and
`stills/still-counter.png` is 316x212 shown in a 576x384 cell, which is a
downscale-then-upscale.

Two orders, filed under `pipeline/art/orders/` as your FIRST action so
`art-lead` can start while the spec is still being written:

1. `morning-rhea-feed`: Rhea framed on FACE AND SHOULDERS for a 1:1 crop,
   1990s anime OVA ink style matching the existing roster art, generated at
   high resolution and post-processed with `pipeline/tools/dither.py`.
   She is the player's older sister, keeps the shop counter, practical,
   tired, dark hair up, work apron over a hoodie. No text, no lettering, no
   panel borders anywhere in frame.
2. `morning-counter-still`: the shop counter at open, the wide establishing
   plate the STILL beats use, same treatment, framed so a crop at the
   panel's actual cell size lands on the counter and the curtain rather than
   the middle of the clutter.

Match the prompt construction and the `dither.py` invocation recorded in the
existing orders (`cust-card-*.json`, `dadlog-attach-*.json`) and in
`loadout-eva/NOTES.md`. Do not order anything else; if the layout wants more
imagery, design the panel to hold without it.
