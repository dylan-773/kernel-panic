---
name: kp-audit
description: Hunt gaps in Kernel Panic - missing features and assets, copy that lies, authored-but-unrendered content, doc-vs-code drift, dangling pipeline work. Ends at a verified, ranked worklist plus filed orders. Run it periodically or before a content push.
disable-model-invocation: true
---

# Gap Audit (Orchestrator play)

The complement of the gates: gates ask "is this new thing right?", this play asks "what is MISSING or ROTTEN in what already shipped?" It never edits the game; it produces evidence and a worklist.

Method: fan out parallel auditors (the Workflow tool with an adversarial verify stage is the right shape when available; parallel Agent spawns otherwise). Every finding needs quoted evidence with a file path; adversarially verify factual claims before reporting. Rank by "would a player notice?"

## The sweeps (each is one auditor)

1. **Content x asset matrix.** Cross every content row against every art surface that renders it: customers x (CUSTOMER.REC art, REPAIR.LOG figures, DIVE.EXE device macros, portraits), augments/modes x icons, windows x diegetic imagery, story beats x stills. `src/components/os/roster-art.ts` maps coverage; a fallback plate rendering constantly is a gap. Also the reverse: finished assets (in `pipeline/art/done/` or `public/assets/`) that nothing references anymore.
2. **Copy vs constants.** Grep player-facing strings (teaching.ts, kit.ts descs, story.ts, window components) for numeric or mechanical claims; check each against the symbol that holds the real value. A coachmark that teaches a wrong number is severity-high. Also hunt vocabulary from deleted mechanics (e.g. territory/claiming) surviving in shipped copy.
3. **Authored but unrendered.** Content that exists in the modules but no component displays: exported tables nothing imports, fields consumers ignore (a `still` read as a boolean), scenes or lines behind unreachable conditions.
4. **Doc vs code drift.** Sample vault `canon`/`derived` notes against `main`; check `ui-demos/RULINGS.md` statuses and its queue against `ui-demos/manifest.json` and the shipped components; check the charter's factual claims. Every drift line names both sides. Suspects first: anything stamped older than the last integration cycle.
5. **Dangling pipeline.** Open art/copy orders, briefs describing closed cycles, proposal items with no outcome, a validation report older than the current build, dead-direction debris in directories agents read.
6. **Gate + watch metrics.** Run the four-command verification gate; report the kitted curve vs `vault/50-tech/verification-gate.md` targets, pd deltas, median rounds, and the fast-loss (<=2 rounds) share per day.

## Output

1. `pipeline/audits/audit-<date>.md`: verified findings ranked (high = a player notices; medium = will bite soon; low = hygiene), each with evidence, plus a KEEP list of what checked out clean. `audits/` is kept as history like `briefs/`, never cleared; lift durable findings into vault notes.
2. File the mechanical follow-ups directly: art orders under `pipeline/art/orders/` for confirmed asset gaps (respect the credit budget: confirm with the user past ~10 images), copy orders for wrong-copy fixes that need voice.
3. Report to the user: the ranked worklist, what was filed, and a SUGGESTIONS section for improvements the audit surfaced that are ideas rather than defects. STOP; the user picks what proceeds.
