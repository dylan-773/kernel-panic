# KP/OS desktop shell, instrument-panel study

Demo: `ui-demos/kpos-desktop-v3/index.html` (cycle `ux-2026-07-31-desktop-dive`)
Spec: `pipeline/proposals/ux-agent.json`, item `kpos-desktop-v3`
System laws: [`../RULINGS.md`](../RULINGS.md)
Supersedes (as a candidate): [`../kpos-desktop/`](../kpos-desktop/NOTES.md)

**Round 3 (2026-08-01)** retires the Windows aesthetic, per the second
review note:

1. **The dock.** The left icon column and the bottom taskbar are gone.
   The eight app icons live in a DOCK centered on the bottom edge, built
   in the KP/OS idiom: hairline `--r-struct` border on solid void,
   solid-ink Silkscreen tag labels, no rounding, no translucency, glyphs
   budgeted against the desk height (`cqb`, round 2's dynamic sizing
   carried over: 46px on 768, 60 on 1080, 48 on 800). The dock is the
   launcher AND the running-window indicator: a running app's icon
   carries an `--r-line` underline plate. Measured centered within 0.01px
   of the desk axis on all three viewports, always clear of the poster
   and scope clusters.
2. **Surface on click.** Clicking a running app's dock icon raises its
   window to the top of the z-order (with the focus pulse) instead of
   re-opening it; clicking an app with no window opens one. Measured:
   z-order flips on click at every viewport, window count stays put.
3. **Plain opens land CENTERED.** `placeWindow()` centers any window
   whose def carries no explicit spawn point; only the tiling proof pins
   coordinates, still computed from the live desk. Measured: fresh opens
   (auto-height and pinned-height) center within 1px on every viewport.
   The mid-run desk now fronts INBOX + LOADOUT.CFG, both centered and
   both dock apps; the tiled proof's window B is a LEDGER.LOG ghost at
   NIGHT.SYS's old 460x560 footprint, so every open window has a dock
   icon to indicate it (NIGHT.SYS is flow-owned, not a launcher app).
4. **Status rehomed, not deleted.** A slim top strip (40px, 52 under the
   glass) keeps the whole old taskbar: KP/OS mark + start menu (now
   dropping DOWN), the USER / DAY / STRAIN / CR chips, ABANDON and SND,
   with the stats ticker crawling the strip's middle as its own
   inline-size container (so the `100cqi` lead-in tracks the crawl box).
   The strain chip stays visible on the desk at all times and keeps its
   alarm: colour + inverse + composited difference-blend pulse. The dock
   rides `--ds-edge-b` (6px, 18 under glass) so the bezel falloff eats
   neither band; the round-2 fix's spirit survives the taskbar it fixed.
5. **The cost, recorded.** The dock zone is taller than the taskbar was:
   usable desk height between strip and dock is 618/916/648 (glass off)
   and 596/894/626 (FLAT) across 16:9 / 21:9 / laptop. LOADOUT.CFG's
   654px footprint clamps to ~598 on the 16:9 desk; the tiling proof
   recomputes as A 860x598 + B 460x560 on 1366x768 (A 786x628 on
   1280x800), measured side by side with no overlap, inside the desk.
   Windows never overlap the dock; a future window built to the 700px
   ceiling will clamp here, which integration should weigh.
6. Wallpaper furniture rides above the dock zone (the poster's round-2
   rightward step is gone with the icon column); the demo page pads
   right of the stage so the fixed rig no longer covers the strip's
   right-edge controls in review.

Round 3 verification, CDP against the served page (law 10 patterns:
2.5s settle, geometry via layout offsets so the fit scale divides out,
CRT OFF for measurement): dock centered and inside the desk at all three
viewports; surface-on-click z-flips; centered opens within 1px; no
window/dock/furniture overlap; strip content clear of the bezel under
FLAT; schemes still resolve (DEFAULT collapse intact); strain alarm arms
and disarms in its new home; boot, login and the login typewriter flow
land on the desk; no internal scrollbars anywhere on the stage.

---

**Round 2 (2026-08-01)** answers the first review note, all four asks:

1. **The blue clash.** The icon tag labels had taken `--r-note` blue, the
   same channel as the WallPoster eyebrow. They return to `--r-struct`
   (which is also what the spec's icon zone said; round 1 deviated), and
   the WallPoster itself steps RIGHT of the icon column, because the
   audit showed its blue tag sliding UNDER the icons and reading as icon
   furniture. The two never share an x-band on any desk now.
2. **Icons resize to their desk.** The fixed ~74px glyph column overflowed
   a 768px desk and crowded 1080. The grid now budgets itself against the
   desk HEIGHT (`cqb`, size containment on the stage): every glyph gets an
   equal share of the column after the bar, ticker and offsets, clamped
   38 to 74px. Measured: one column of eight on all three viewports
   (glyphs 44 / 74 / 48), always clear of the ticker.
3. **Windows clamp to their desk.** `clampToDesk()` shrinks width to the
   desk, pins heights to the usable height, and pulls spawn points inside
   the edge; the tiled pair is COMPUTED from the live desk, so the tiling
   proof holds on 1280x800 (measured: A ends 797, B spans 811 to 1271,
   both above the 716px usable line) instead of clipping off the right
   edge. Viewport and CRT switches re-clamp.
4. **The taskbar buys room under the tube.** `--ds-bar-h` is 44px with the
   glass off and 58px under it, so the bar's content sits clear of the
   bezel falloff; the ticker, wallpaper inset, desk inset and start menu
   all ride the same token.

---

The whole KP/OS shell (boot, login, wallpaper furniture, icon grid, ticker,
taskbar, start menu, window chrome) rebuilt to the v3 system. The v2
STRUCTURE survives whole; what changes is the machinery underneath: colour
is the eight role tokens, the CRT is glass over the stage, decorative motion
is cut, and the desk is a real-resolution stage so every supported viewport
is reviewable.

## What it decides

**1. Ruling 14 goes desktop-wide, pending this approval.** The shell itself
now carries `data-scheme`; the start menu's HUE cycle is replaced by a
SCHEME cycle (DEFAULT / NERV / TOKYO NIGHT). Approving this demo is the
decision that the role system covers all of KP/OS, closing the open question
`loadout-eva/NOTES.md` flagged ("a desktop running both would read as two
products"). DEFAULT is on the switch precisely so the cost of saying no
stays visible: with no scheme set, every role collapses onto the v2 single
accent and the shell renders as the shipped desktop. Role re-pointing is
GATED on `html[data-scheme]` wherever v2 painted an element with the raw
accent, so the DEFAULT collapse is not approximate.

**2. The shell's glance order.** With any window open: 1st the focused
window, 2nd other windows, 3rd taskbar chips; wallpaper, ticker, icons and
scope are ambient. On the IDLE desk (no window open) the WallPoster
promotes a real focal element: the ATTEMPT/DAY pair at `--ds-fs-hero`
(72 to 132px, measured 6.5x the label floor), `--r-data`, with the wordmark
demoted to identity dressing. The promotion is live: close every window and
the poster steps up, open one and it steps back down.

**3. The strain alarm, wired to the CORRECT band.** The taskbar STRAIN chip
is the desktop's one `--r-warn` owner: colour, inverse video, and a
composited difference-blend pulse (loadout-eva's riskflash technique). It
arms at strain <= 35. The shipped `shop-os.tsx` chip reads `run.strain > 70`
for its danger class, but strain DEPLETES toward zero (`run-reducer.ts`:
START_STRAIN 100, the run ends at 0), so the shipped check lights the alarm
at full health. **Integration owes a one-line source fix regardless of this
demo's fate.** ABANDON is `--r-hazard` furniture, never the alarm.

**4. Two cuts, one keep (law 7).** The WallScope's 9s trace roll and the KP
monogram's 7s glitch slip both GO STILL: seeded decorative texture with no
payload is exactly what "ambient chrome never moves" exists to starve. The
ticker keeps its `steps(140)` marquee (RULINGS' own carve-out), the bench
clock keeps its seconds, and the scope's OK pip keeps blinking as a real
alive signal.

**5. The tiling proof.** SCREEN=DESK TILED puts LOADOUT.CFG at
loadout-eva's measured 16:9 footprint (860x654, at 10,14) beside a NIGHT.SYS
placeholder (460x560, at 884,14) on the 1366x768 desk: both clear the
698px usable height with the ticker and taskbar unobstructed. Measured over
CDP, not asserted. This also surfaced a real v2 bug: the shipped window
ceiling is `min(100vh - 120px, 760px)`, a BROWSER unit that clamped a
654px window to 349px inside the stage. The v3 stage removes the vh clamp;
windows carry their own measured heights.

**6. The desk is the container.** All shell furniture sizes on `cqi`
against one `.ds-stage` container (never vw), including the ticker's start
offset (was `100vw`). The 700px narrow tier exists as a declared fallback
no supported viewport reaches. All three viewports render the identical
arrangement.

## Ghost windows

Window BODIES are out of scope this cycle: every window is real v3 chrome
(border, ink bar, pixel X, drag, focus pulse) over a dashed ghost stating
its footprint. Each panel's own study owns its content; the ghost keeps
this demo honest about what it is not deciding.

## What it still owes

- **The embed host.** The old `kpos-desktop` demo doubles as the review
  site's mount harness (iframe embeds, `?mount=`, `window.kpDesktop`).
  This study deliberately does not duplicate that machinery; integration
  ports this skin onto the shipped shell (and the harness keeps working
  against the same class names).
- **The strain threshold source fix** in `shop-os.tsx` (see decision 3).
- Sound uses the shared demo approximations (`pageFlip` for the scheme
  swap, `claimTick` for ACCESS GRANTED); integration maps back to the
  shipped `audio.ts` names (`hueSwap`, `granted`, `stamp`) which the demo
  table does not carry.
- DARKNET.LNK keeps its stepped-notch chrome unmapped to any role
  (identity, per the queue); its own study owns anything further.

## Verification

Driven over CDP against the served page (`scratchpad` harness, RULINGS law
10): tiling-proof geometry exact and inside the desk; idle hero promotes
and measures 6.5x the label floor; the strain alarm shows colour + inverse
+ `ds-risk-blink` with exactly one owner and disarms clean; NERV and TOKYO
NIGHT each resolve all eight roles distinctly while DEFAULT collapses onto
the single accent with the attribute absent; CRT OFF removes all six glass
layers and FLAT restores them; all three viewports render the same
furniture; the scope roll is gone and the mark slip animation is `none`
while the OK pip still blinks; no internal scrollbars, no border-radius on
chrome, no em or en dashes.
