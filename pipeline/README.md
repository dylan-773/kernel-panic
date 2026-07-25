# Kernel Panic crew pipeline

Artifact flow between the dev crew's agents. Agents write here; only the
Orchestrator (the main Claude Code session) writes into `kernel-panic-site/`.

```
BRIEF.md                 Orchestrator writes the cycle's assignment
proposals/<agent>.json   one namesake proposal file per content agent
                         (lint-checked on write by a PostToolUse hook)
gates/loremaster-review.md   APPROVE/REVISE per item, canon citations required
validation/report.md     harness numbers vs targets, PASS/FAIL verdict
art/orders/<id>.json     work orders filed by ux-agent / narrative-director
art/done/<id>.png        finished assets from art-lead, pending install
tools/                   lint-proposal.sh (hook), pxpost.py (pixel post-pass)
```

Flow of a production cycle (`/kp-produce`):
brief -> parallel proposals -> loremaster gate -> Orchestrator integrates ->
validation gate -> (balance loop if curve off) -> art pass if ordered -> report.

Everything in `proposals/`, `gates/`, and `validation/` is per-cycle working
state: safe to clear after a cycle ships. `art/done/` is cleared once assets
are installed. Canon lives in `../lore/` and is never cleared.
