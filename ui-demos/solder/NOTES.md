# SOLDER.BAY poster study

Demo: `ui-demos/solder/index.html` (cycle `ux-2026-07-28-kpos-redesign`)
System laws: [`../RULINGS.md`](../RULINGS.md)

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
