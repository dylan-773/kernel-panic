# DAD.LOG archive-reader study

Demo: `ui-demos/dadlog/index.html` (cycle `ux-2026-07-29-dadlog`)
System laws: [`../RULINGS.md`](../RULINGS.md)

INTEGRATED into the app 2026-07-29 (user OK): journal.ts carries the
artifact fields and gated copy plus DADLOG_CHROME, dadlog.tsx is the
native React port, audio.ts gained segmentMount/segmentDamaged, the five
attachments live in public/assets/px/window/. This page remains the
design-history reference.

Standalone page (the shell is untouched by it), cycle ux-2026-07-29-dadlog,
per the user's BIOS-poster reference and fiction-reframe directive: DAD.LOG
is DAD'S OWN VOLUME read by a forensic recovery tool, not the player's
diary (lore ledger Resolved ruling 12; the bible's journal references are
re-lined to match). Anatomy: solid-ink DAD.LOG bar, a VT323 volume header
strip (`DAD.VOL // READ ONLY // RECOVERY {n}/{d}`, denominator 9 -> 10 once
machineOpened), a REAL doctype tab strip (ALL/NOTE/BILL/MEMO/LOCKED filter
the rail; a legally-empty filter renders the `NONE OF THIS KIND RECOVERED
YET` caption, tutorial gate 2b), a 260px file-index rail (badge, mono
filename, ink doctype tag, RECOVERED state caption; the damaged teaser row
is ????/DAMAGED under a checker-dither corruption overlay), a document
viewer (FILENAME/DOCTYPE/PROVENANCE datarows, 52px-clamped hero, VT323
artifact body, the player's voice quarantined in a dashed BENCH NOTE box,
per-file seeded wave/hex strip), the persistent SOURCE MEDIA plate, BANK
1/2 hex furniture seeded from a fixed string, and the PREV/NEXT/FILE foot
scoped to the active filter. Every sentence-shaped string is verbatim from
the FILLED copy order `pipeline/copy/orders/copy-dadlog-files.json` (two
gate rounds: loremaster 17 APPROVE/2 REVISE round 1, all clear round 2
after the bills notice dropped a checkable credits total for collections
status language and PATCH.SYS's register break moved to its benchNote;
tutorial gate rewrote the damaged teaser to key recovery passes to RUNS,
not dives, since journal unlocks ride meta.runCount).

The RECOVERY BEAT on every rail click: READING SEGMENT... (220ms) then
RECOVERY COMPLETE. FILE MOUNTED. (160ms, segmentMount) then the status
folds and metadata/hero/body type in concurrently (inbox/index.html's typeIn
idiom, per-paragraph); the bench note and wave reveal ONLY when every
typewriter actually finishes (a completion counter, not a wall-clock
guess: background-tab throttling desyncs timers from intervals, learned
here). The damaged row plays segmentDamaged at click, never the mount
line; its fixed content fades in as one block with the teach sentence at
full ink under a dimmed title. Reduced motion: final state in one frame,
sounds still fire.

PER-ENTRY ATTACHMENTS (round 3, user-approved batch, superseding the
round-1 persistent SOURCE MEDIA plate; the loremaster ruled the
supersession on the record, both correct for their budgets): the 304px
cell now renders WHAT THE OPEN ARTIFACT EARNS. Four commissioned scans
(will: folded handwritten letter with tape marks; bills: boxed clinical
notice with seal and signature scrawl; receipts: stub fan spilling from
a shoebox; diagnosis: typed sheet beside the slit envelope), tag
`FIG. 01 // SCAN`; solder reuses the banked solder-bench dither as
`FIG. 01 // FRAGMENT` (the ONLY cell the rig's Dither row still
affects); patch gets the inverted back-room tower `FIG. 01 // DEVICE
PLATE`. The four LOG/QUERY files and the damaged page get the
`.kp-attach-empty` NO VISUAL PAYLOAD cell, caption TEXT ARTIFACT for
real text files but RECOVERY INCOMPLETE on the damaged page (tutorial
gate round 3: nextLocked can resolve to a SCAN later, so TEXT ARTIFACT
is unknowable there). Art: Higgsfield nano_banana_pro, 5/5 first
attempt, 10 of 20 budgeted credits, FINE 1-bit at 304x304 exact, zero
readable text anywhere (ruling 8 safe by construction); orders and raws
under pipeline/art/. Loremaster APPROVE on all diegetic claims, plus
new ledger ruling 13 canonizing DAD.VOL provenance (bench-terminal
telemetry and queries filed into Dad's volume). SEGMENT, never SECTOR,
is the damaged-file noun, keeping clear of the canon Sector 1-9 story
cargo.

GOTCHA that cost a round (the kp-settle rule): browsers freeze CSS
animation clocks when no frames render (occluded window, battery
saver), while JS timers keep running, so any reveal that parks its
final state in animation-fill-mode can stick at its hidden first frame
forever. Every animated reveal on this page (page-flip, scan reveal,
block fades, late fades) gets a JS-timed `.kp-settle` backstop shortly
after its beat that pins the final state with animation:none. Invisible
in normal use; frozen-proof otherwise. The typewriters never needed it,
being JS-driven end to end.

Demo rig: Hue + Dither rows, scenarios FIRST OPEN (runCount 0: 2 files +
damaged), MID RUN (default, runCount 7: 8 + damaged), OPENED (machineOpened:
all 10, PATCH.SYS last, zero damaged), all through the shipped
visibleJournal filter reimplemented over the order's entries verbatim.
Sound in the study is a minimal inline WebAudio approximation of the two
new proposal presets (segmentMount, segmentDamaged) plus pageFlip/tick;
the real presets land in audio.ts at integration per ux-agent.json.
Integration debts (tutorial gate): re-audit ledger row journalRunGate once
this lands in the app, and the copy order's four round-2 lines are the
shipping text.
