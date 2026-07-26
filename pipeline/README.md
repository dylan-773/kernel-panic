# Kernel Panic crew pipeline

Artifact flow between the dev crew's agents. Agents write here; only the
Orchestrator (the main Claude Code session) writes into `kernel-panic-site/`.

```
BRIEF.md                 Orchestrator writes the cycle's assignment
proposals/<agent>.json   one namesake proposal file per content agent
                         (lint-checked on write by a PostToolUse hook)
gates/loremaster-review.md   APPROVE/REVISE per item, canon citations required
gates/tutorial-review.md     COVERED/NEEDS-TEACHING per item, ledger citations
validation/report.md     harness numbers vs targets, PASS/FAIL verdict
art/orders/<id>.json     work orders filed by ux-agent / narrative-director
art/done/<id>.png        finished assets from art-lead, pending install
copy/orders/<id>.json    teaching copy orders filed by tutorial-agent;
                         narrative-director fills title + lines in place
tools/                   lint-proposal.sh (hook), pxpost.py (pixel post-pass)
```

Flow of a production cycle (`/kp-produce`):
brief -> parallel proposals -> loremaster + tutorial gates (parallel) ->
copy orders fulfilled -> Orchestrator integrates -> validation gate ->
(balance loop if curve off) -> art pass if ordered -> report.

Two gates, asked of the same artifacts. The Loremaster asks "is it true?"
and cites `../lore/`. The Tutorial Agent asks "does the player know?" and
cites `../tutorial/ledger.md`. Either can hold an item back.

Everything in `proposals/`, `gates/`, and `validation/` is per-cycle working
state: safe to clear after a cycle ships. `art/done/` and closed `copy/orders/`
are cleared once integrated. Canon lives in `../lore/` and the teaching ledger
in `../tutorial/`; neither is ever cleared.
