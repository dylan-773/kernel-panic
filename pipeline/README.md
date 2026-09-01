# Kernel Panic crew pipeline

Artifact flow between the dev crew's agents. Agents write here; only the
Orchestrator (the main Claude Code session) writes into `kernel-panic-site/`.

```
BRIEF.md                 the OPEN cycle's assignment. Live only while a cycle
                         is running; archived to briefs/<id>.md at cycle close.
                         No BRIEF.md = no open cycle: agents take direction
                         from their spawn prompt.
briefs/<id>.md           closed cycles' briefs, kept as history
proposals/<agent>.json   one namesake proposal file per content agent
                         (lint-checked on write by a PostToolUse hook).
                         Any agent may include `suggestion` items: additive
                         ideas, missing things noticed, doc disputes. They
                         are exempt from lanes and gates and are surfaced
                         verbatim in the cycle report.
gates/loremaster-review.md   APPROVE / REVISE (canon citation required) /
                             CHALLENGE (the doc looks wrong; user rules) /
                             NOTE (advisory) per item
gates/tutorial-review.md     COVERED / NEEDS-TEACHING (ledger citation) /
                             CHALLENGE per item
validation/report.md     harness numbers vs targets, PASS/FAIL verdict.
                         Targets live in vault/50-tech/verification-gate.md.
art/orders/<id>.json     work orders filed by ux-agent / narrative-director
art/done/<id>.png        finished assets from art-lead, pending install
copy/orders/<id>.json    teaching copy orders filed by tutorial-agent;
                         narrative-director fills title + lines in place
tools/                   lint-proposal.sh (hook), pxpost.py (pixel post-pass),
                         dither.py (1-bit window imagery), colourise.py
```

Flow of a production cycle (`/kp-produce`):
brief -> parallel proposals -> loremaster + tutorial gates (parallel) ->
challenges to the user -> copy orders fulfilled -> Orchestrator integrates ->
validation gate -> (balance loop if curve off) -> art pass if ordered ->
cycle close (archive brief, mark item outcomes, revision-history line) ->
report with CHALLENGES and SUGGESTIONS sections.

Two gates, asked of the same artifacts. The Loremaster asks "is it true?"
and cites `../vault/60-story/` by quoted line. The Tutorial Agent asks
"does the player know?" and cites `../tutorial/ledger.md`. Either can hold
an item back; either can CHALLENGE the doc itself instead, and the user
rules. The doc is presumed current, not presumed correct.

Everything in `proposals/`, `gates/`, and `validation/` is per-cycle working
state: safe to clear after a cycle ships. `art/done/` and closed `copy/orders/`
are cleared once integrated. Canon lives in `../vault/60-story/` and the
teaching ledger in `../tutorial/`; neither is ever cleared, and neither is
`ui-demos/manifest.json`.
