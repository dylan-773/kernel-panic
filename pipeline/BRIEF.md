# Brief: ux-2026-08-31-manual-v3

Goal: rebuild MANUAL.TXT as a STANDALONE STUDY at
`ui-demos/manual-v3/index.html`, to the KP/OS v3 instrument-panel system.
`ui-demos/RULINGS.md` IS the spec; `ui-demos/loadout-eva/` is the reference
implementation. The main game code (`kernel-panic-site/`) is OUT OF SCOPE
this cycle. The user reviews the study first; integration is a later
`/kp-ui integrate` invocation.

USER DIRECTIVE (2026-08-31, from the fix-selection answer): "MANUAL + LEDGER
v3: finish the law-11 queue: two /kp-ui demo cycles ending at reviewable
demos, as rule 1b prescribes." This brief is the MANUAL.TXT half; LEDGER
gets its own cycle.

PROCESS: this is a redesign of an EXISTING window, so per `RULINGS.md`
"Process" it is PURE UI. No loremaster gate, no tutorial gate, no detours
into game code. Gate-shaped concerns get noted in the demo's `NOTES.md` and
mentioned once in the report.

## What is being replaced

`windows/manual.tsx`: the v2 single-phosphor tabbed reference, one of the
LAST TWO pre-v3 windows on the shipped desktop (RULINGS.md law 11 queue).
Read the shipped component for STRUCTURE and CONTENT only; its look is the
thing being replaced. Per law 11's own note, the hard case is the 18-card
AUGMENTS page: eighteen entries that must be readable without internal
scrollbars under the ~700px height ceiling.

IMPORTANT CONTENT NOTE: the shipped HOW A DIVE WORKS copy was rewritten
2026-08-31 to the split-board rules (two boards, built ground, cascades of
three or more). Build from the CURRENT working-tree copy of `manual.tsx`,
not from any remembered version; there is no claiming and no territory.

## Constraints

- Art budget: none. MANUAL.TXT is a reference document; window imagery is
  diegetic-only and this surface has no in-fiction reason to show pictures.
  If the spec disagrees, argue it in a `suggestion` item rather than filing
  an art order.
- Name the VARIATIONS worth reviewing (scheme, density, page-nav treatment)
  so the review deck renders them as switches.
- Height ceiling ~700px, no internal scrollbars, paging discipline (law 8)
  for the augment cards.
