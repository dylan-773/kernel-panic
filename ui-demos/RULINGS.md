# KP/OS v3 rulings (instrument panel)

> **This file stays operational.** It is served over HTTP by the demo review
> site (`ui-demos/_review/serve.ts`) and is cited BY LAW NUMBER from the agent
> memories and proposals.
>
> The same eleven laws are expanded one-per-note in the Obsidian vault at
> `vault/40-presentation/rulings/`, cross-linked to the windows they govern.
> Law numbers match. Read the vault for context; this file remains the spec the
> `/kp-ui` cycle builds against.

The design laws every Kernel Panic surface obeys. **v3 supersedes v2 where
they conflict**; everything v2 said that is not contradicted below still
stands. Established by the `ux-2026-07-31-loadout-eva` cycle
(`ui-demos/loadout-eva/`, five review rounds). Per-demo design history lives
in each demo folder's `NOTES.md`; `loadout-eva/NOTES.md` is the worked
example and is worth reading before building anything to this spec.

**Status:** LOADOUT.CFG is the reference implementation, approved and
integrated 2026-08-01 (manifest: `complete`). The SYSTEM below is settled
and is what other panels build to. If the reference demo changes, this
file changes with it.

---

## 1. Colour is ROLES, not hues

The v2 law was one ink accent doing everything, danger as inverse video,
never a second hue. **That is superseded** (user ruling; canon ruling 14,
`vault/60-story/rulings/`). Colour now carries state.

Do NOT hand-pick colours per surface. Every surface reads the same eight
role tokens, and a scheme is a remap of those tokens and nothing else. If
you find yourself writing a hex value inside a component rule, you are doing
it wrong.

| role | means | takes |
|---|---|---|
| `--r-struct` | chrome and borders | panel frames, dividers, disabled outlines |
| `--r-note` | annotation: labels that NAME, never STATE | `// LABEL` prefixes, units, tick labels, spine labels, eyebrows |
| `--r-line` | live data | meters, filled slots, tier segments, values |
| `--r-data` | hot values | hero numerals, the biggest numbers on the surface |
| `--r-ok` | NOMINAL | ready verdicts, the active/selected option |
| `--r-warn` | RISK | the alarm state only, nothing else, ever |
| `--r-aux` | a different signal class | camera/video imagery |
| `--r-hazard` | structural red | hazard stripes, focal-panel brackets, window edge, record lights |

`:root` defaults every role onto the single accent, so a surface with no
`data-scheme` renders exactly as v2 did. Only `data-scheme` pulls them
apart. Keep that property: it is what makes the system reversible.

### The two schemes

```css
:root[data-scheme="nerv"] {
  --px-void:#0a0603; --ch:#ff9a1f; --ch2:#c2431a; --ch-hot:#ffe9c4;
  --r-struct:#a86a22; --r-line:#ff9a1f; --r-data:#ffe9c4;
  --r-ok:#8dff3a;     --r-warn:#ff2a17; --r-aux:#23d3ff;
  --r-hazard:#d1381a; --r-note:#6ea8ff;
}
:root[data-scheme="tokyo"] {
  --px-void:#16161e; --ch:#7aa2f7; --ch2:#414868; --ch-hot:#c0caf5;
  --r-struct:#414868; --r-line:#7aa2f7; --r-data:#c0caf5;
  --r-ok:#9ece6a;     --r-warn:#f7768e; --r-aux:#7dcfff;
  --r-hazard:#ff9e64; --r-note:#bb9af7;
}
```

Plus `--r-ok-glow` and `--r-warn-glow`, each a `color-mix` of their role at
45 to 60 percent. Copy the block from `loadout-eva/index.html`; do not
retype the hexes.

### Two rules that are not negotiable

- **RISK never shares its colour.** `--r-warn` appears on exactly one thing
  per surface: the alarm. `--r-hazard` is the ambient red, and it is a
  duller, separate tone. If a surface has no alarm state, it has no
  `--r-warn`.
- **Colour is never the only channel.** An alarm must also flood inverse
  video (the shipped danger idiom) AND move. Ambient chrome must NEVER
  move. That asymmetry is the entire mechanism: five static red shapes
  train the eye to stop sampling red, and motion is the one channel the
  chrome does not have. See law 7 for how to animate it cheaply.

---

## 2. Hierarchy: state the glance order, then build the type scale to enforce it

Every surface declares, in its `NOTES.md`, what the eye hits 1st, 2nd, 3rd,
and what is deliberately ambient. Then:

- **One focal element per surface, at extreme scale.** LOADOUT.CFG uses
  three hero numerals at ~83px against 19px body: 2.2x larger than the next
  biggest thing. A surface whose largest element is 1.3x the second largest
  has no hierarchy.
- Annotation clusters at 9 to 11px fill the negative space around it.
- Nothing that is "ambient" may compete: demote it (unboxed, `--r-note`,
  smaller) rather than merely moving it.

Maximalism is NOT permission to add. It is extreme contrast between what
matters and what does not.

---

## 3. Fluid: container units, one breakpoint, a hard height ceiling

- **`cqi`, never `vw`.** Every `clamp()` resolves against the window's own
  `container-type: inline-size`, so a tiled window scales to ITS tile. A
  `vw` ramp gives two differently sized windows the same type scale and is
  always wrong here.
- Wrap the content in a container element and style a CHILD; an element
  cannot answer its own container query.
- **`cqi` in a custom property resolves at the USE SITE.** A body-size token
  lands smaller inside a nested container than outside it. This is desirable
  (narrow columns get the smaller step) but know it is happening.
- **One binary breakpoint at 700px** of content inline-size. Above it, the
  full arrangement. Below, a genuinely different compact arrangement, not
  the same layout shrunk.
- Type floors hold regardless: VT323 body 19 to 21px, Silkscreen labels 9 to
  11px. Never clamp below them to win space.

### The height ceiling

**A window must fit the shortest desk it claims to support**, which is a
1366x768 screen: roughly **700px** of usable height after the taskbar. 820px
is the absolute ceiling, 700 is the real target. LOADOUT.CFG lands 638 to
727 across every viewport and run state, down from ~1316 for the shipped
window.

This is the whole point of the cycle: a window that fills the desk cannot be
tiled, and untileable windows are what made window management feel rough.

### Supported viewports

16:9 1366x768, 21:9 2560x1080, and 1280x800 laptop. **All three render the
SAME arrangement.** 4:3 is not supported. A narrow tier below 700px may
exist as a tiling fallback but no supported viewport reaches it.

---

## 4. Chrome vocabulary

Carried over from v2 unless noted:

- Solid-ink title bar, void pixel text, a pixel X as the only button.
- Boxed `// LABEL _` data rows.
- VT323 body, Silkscreen labels. No border-radius on UI chrome, ever.
- **Hairline + heavy corner brackets** (1px `--r-struct` border, 24px/4px
  `--r-hazard` brackets) are scoped to the FOCAL panels of a surface only.
  Applying them everywhere destroys the emphasis they exist to create.
- **Hazard-stripe dividers** (`--r-hazard`, 45deg) label a zone boundary.
- **Corner-tick reticles** mark the active option, as a second channel on
  top of the inverse-video fill.
- **Equal-footprint empty states.** An empty slot occupies exactly the room
  a filled one does, so a sparse early-run surface and a full late-run
  surface have the same footprint. Sparse states are where maximalist grids
  fall apart; build both and check.

---

## 5. Imagery

- 1-bit dithered, at **1:1 pixel mapping, never downscaled**. Browser
  downscaling mushes the dots into grey noise. To show less, CROP; to show
  more, crop wider. Integer upscaling is acceptable, downscaling never is.
- Frame the crop on the SUBJECT. A centre crop of a busy illustration is
  usually the middle of the clutter and reads as texture, not an image.
- Imagery must be DIEGETIC: an in-fiction reason for the OS to show it.
- Three treatments, offered as a `FEED`-style variation where a surface
  carries a camera or a scan:
  - **INK TINT** (default): 1-bit multiplied to `--r-aux`, so it recolours
    with the scheme.
  - **TRUE 1-BIT**: untinted. Note the source art is monochrome ink, so this
    is its actual colour.
  - **FULL COLOUR**: a COLOURISATION, not a reveal. Gradient-map the raw
    greyscale through a lit-interior palette, then Floyd-Steinberg dither to
    a 16-colour adaptive palette so it still reads as a dithered frame. The
    generator is recorded in `loadout-eva/NOTES.md`; reuse it.

---

## 6. The tube

The CRT is a set of glass layers over the stage, not a filter on the UI.
Six layers: phosphor scanlines (a bright line and a dark gap, not a faint
tint), a vertical aperture grille, ink-tinted bloom, a specular reflection,
an elliptical falloff, and a bezel lip. Modes: **FLAT** (default) and
**OFF**. OFF removes every layer outright rather than fading them, and the
surface must still read as a finished flat-ink print, because none of its
richness may live in the CRT layer.

**Do not rebuild CURVED.** Real barrel distortion via `feDisplacementMap`
was built, measured and cut: it read the same as flat, bowed the taskbar,
and cost the feed roll, the REC blink, the terminal cursor and the clock's
seconds, because every repaint inside a displaced subtree re-runs the warp
over the whole stage. The maps and wiring are in git if anyone revisits it.

---

## 7. Motion, and the performance law that governs it

- `steps()` timing only. No eased curves.
- Reduced-motion collapses to the final state in one frame, with sound
  unaffected.
- Load choreography: stagger meters, count up hero numerals, type
  descriptions, slot in chips. Scope typewriters per element so interacting
  with one does not restart the others.
- **Motion is reserved.** Ambient chrome never animates. Animation means
  something is happening or something is wrong.

**Animate compositor properties, not paint properties.** Measured on the
reference build: animating `background`/`box-shadow` inside a filtered
subtree took p95 frame time from 9ms to 50ms; the identical effect via an
`opacity` cross-fade on a promoted layer (`will-change`, plus a
`mix-blend-mode: difference` plate to get an inverse flip) measured 9.3ms.
Prefer `opacity` and `transform`. **Measure; do not assume.** The frame
harness is in the verification section.

---

## 8. The cuts discipline

When a surface exceeds its height budget, cut in this order, and record what
was cut and why in its `NOTES.md`:

1. **Decorative imagery that cannot survive its size.** Cut it outright
   rather than shrinking it into noise.
2. **Prose that is taught elsewhere.** Reduce a paragraph to a chip plus its
   pointer sentence when another surface owns the explanation.
3. **Always-visible descriptions** to hover/focus/tap popups, but only if
   the control carries a persistent marker that it holds more (a dotted
   underline). A bare name with a hidden popup is a dead end.
4. **Box treatment** on the lowest-priority data, keeping the data.
5. **Paging or tabs** in the narrow tier only.

Never shrink type below its floor, and never add a scrollbar. **No internal
scrollbars, ever**: reflow, page, or tab.

One structural lesson worth stating outright: **a row you do not share is a
row you pay for in full.** Placing a short zone beside a tall one costs
nothing; giving it its own row cost the reference build 112px.

---

## 9. Build recipe for a panel

Panels can be built in parallel; each is independent. For one panel:

1. Read `loadout-eva/index.html` and `loadout-eva/NOTES.md`. Copy the role
   token block, the glass layers, the rig, and the load-choreography helpers
   verbatim. Do not re-derive them.
2. Read the shipped component in `kernel-panic-site/app/src/components/os/windows/`
   for STRUCTURE and state flow only. Its look is the thing being replaced.
3. Import real numbers and copy from `kernel-panic-site/app/src/game/`.
   Transcribe constants rather than inventing them, so the study cannot
   drift from the game.
4. Write the glance order FIRST, then build the type scale to enforce it.
5. Build at least two run states, one full and one sparse.
6. Build to the 700px height target and measure it.
7. Standalone page at `ui-demos/<id>/index.html`, linking
   `../_shared/kp.css` and `../_shared/system.css`, art under `<id>/art/`,
   everything else inlined. Vanilla JS, no framework.
8. Register in `ui-demos/manifest.json` at `"status": "awaiting"` with the
   variation rows (SCHEME, CRT, VIEWPORT, RUN STATE, plus whatever the
   surface needs), and write `<id>/NOTES.md`: what it is, what it decides,
   what it cuts, what it still owes.

Game copy carries no em or en dashes. Never write to `kernel-panic-site/`.

---

## 10. Verification

The Chrome extension is often unavailable; drive headless Chrome over CDP
instead. It is the better harness anyway, because it clicks the demo's own
rig and measures real geometry:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --remote-debugging-port=9222 \
  --user-data-dir=<scratch> about:blank
```

then a bun script over the `webSocketDebuggerUrl` from `/json/list`, using
`Runtime.evaluate` and `Page.captureScreenshot`. The patterns that matter:

- **Let the load choreography settle (~2.5s) before reading text.** Count-ups
  and typewriters read as `0`/empty mid-flight and look like failures.
- **Divide out ancestor transforms.** Anything under a `transform: scale()`
  returns inflated `getBoundingClientRect()` values. Measure with the tube
  OFF; layout is identical in every CRT mode.
- **Frame timing**: sample `requestAnimationFrame` deltas over 400+ frames
  and report mean/p50/p95/worst per mode.
- **Keep TypeScript annotations out of strings you evaluate in the page.**
  They are not valid JS there and the evaluate throws.

Standing acceptance checks for every panel: the focal element is measurably
the largest text; no internal scrollbar; no `border-radius` on UI chrome; no
em or en dash; both schemes resolve all eight roles distinctly; every
viewport renders the same arrangement and fits its desk; the sparse run
state occupies the same footprint as the full one; reduced motion renders
the settled state in one frame.

---

## 11. Panel queue

LOADOUT.CFG (`loadout-eva`) is the reference. Status as of 2026-08-31
(reconciled against `ui-demos/manifest.json`, the durable record; seven of
nine converted in the 2026-08-01 v3 burst):

| panel | shipped component | status | notes |
|---|---|---|---|
| INBOX | `windows/inbox.tsx` | CONVERTED (`inbox-v3`, complete 2026-08-01) | fronts the day loop; owns the CUSTOMER.REC card and the DIVE button. |
| REPAIR.LOG | `windows/report.tsx` | CONVERTED (`repair-log-v3`, complete 2026-08-01) | dive result; the verdict is the focal element. |
| SOLDER.BAY | `windows/solder.tsx` | CONVERTED (`solder-v3`, complete 2026-08-01) | drag-to-craft; motion budget was the constraint. |
| DAD.LOG | `windows/dadlog.tsx` | CONVERTED (`dadlog-v3`, complete 2026-08-01) | archive reader; paging discipline (law 8). |
| DARKNET.LNK | `windows/darknet.tsx` | CONVERTED (`darknet-v3`, complete 2026-08-01) | the odd one out via stepped-notch chrome, not colour. Keep that. |
| MANUAL.TXT | `windows/manual.tsx` | **REMAINING** | tabbed reference; the 18-card AUGMENTS page is the hard case. |
| NIGHT.SYS | `windows/night.tsx` | CONVERTED (`night-v3`, complete 2026-08-01) | proved the system at low density. |
| LEDGER | `windows/ledger.tsx` | **REMAINING** | small, table-shaped. |
| DIVE.EXE | full-screen duel | CONVERTED (`dive-v3`, complete 2026-08-01) | full-screen; the machine's two-beat telegraph stayed readable. |

MANUAL.TXT and LEDGER are the last two pre-v3 windows on the shipped
desktop. When one converts, update its row here IN THE SAME CHANGE.

---

## Process

A `/kp-ui` cycle that redesigns an EXISTING window is **pure UI**: no
loremaster gate, no tutorial gate, no detours into game code. Those gates
are for surfaces that introduce new fiction or new things a player must
understand. If a gate-shaped concern appears anyway, note it in the panel's
`NOTES.md` and mention it once.

---

## What v2 said, and what changed

v2 (`ux-2026-07-28-kpos-redesign`, integrated 2026-07-29) was the
"single-phosphor poster": one unified scheme, a single ink accent doing
text, borders, fills, meters and imagery, a support tone, one hot highlight,
hue switched by `data-hue` across lavender/magenta/phosphor; danger as
inverse video, never a second hue; solid-ink title bars; boxed data rows;
2/4/8px dither fields; press states flooding inverse video.

v3 keeps all of that structurally and changes three things:

1. **Colour became roles** (law 1). The single-accent law survives as the
   `:root` default, not as the only option.
2. **Layout became container-relative with a hard height ceiling** (law 3).
   v2 had per-surface footprints; v3 has one budget every surface meets.
3. **The CRT became glass over the stage** rather than an overlay on the
   page (law 6).

Still true from v2 and unchanged: the no-scrollbar law, paging over
scrolling, kpos-window-sizing footprints as a starting point, DARKNET's
stepped-notch identity, the ticker at `steps(140)`, and boot line 1 shipping
name-free per the loremaster gate.

`CLAUDE.md`'s DESIGN STANDARD paragraph is updated to match this file.
