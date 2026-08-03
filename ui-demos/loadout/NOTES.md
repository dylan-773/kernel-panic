# LOADOUT.CFG dashboard study

Demo: `ui-demos/loadout/index.html` (cycle `ux-2026-07-28-kpos-redesign`)
System laws: [`../RULINGS.md`](../RULINGS.md)

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
