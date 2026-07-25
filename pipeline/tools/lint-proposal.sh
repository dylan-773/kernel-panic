#!/bin/bash
# PostToolUse hook: lints crew proposal JSON the moment an agent writes it.
# Non-proposal writes pass through silently. Exit 2 feeds the message back
# to the writing agent so it self-corrects.
# stdin must be captured before the heredoc below claims it for python.
HOOK_INPUT="$(cat)"
export HOOK_INPUT
python3 - <<'PY'
import json, sys, os, re

try:
    payload = json.loads(os.environ.get("HOOK_INPUT") or "{}")
except Exception:
    sys.exit(0)

path = (payload.get("tool_input") or {}).get("file_path", "") or ""
if not re.search(r"/pipeline/proposals/[^/]+\.json$", path):
    sys.exit(0)

def fail(msg):
    print(f"Proposal lint [{os.path.basename(path)}]: {msg}", file=sys.stderr)
    sys.exit(2)

try:
    with open(path) as f:
        doc = json.load(f)
except Exception as e:
    fail(f"not valid JSON ({e}). Rewrite the entire file as valid JSON.")

errs = []
if not isinstance(doc.get("agent"), str) or not doc.get("agent"):
    errs.append('missing top-level "agent" string')
if not isinstance(doc.get("brief"), str) or not doc.get("brief"):
    errs.append('missing top-level "brief" string (the id from pipeline/BRIEF.md)')
items = doc.get("items")
if not isinstance(items, list) or not items:
    errs.append('missing non-empty "items" array')
else:
    COPY_FIELDS = {"name", "desc", "title", "body", "lines", "quotes",
                   "winLine", "lossLine", "text", "device"}
    def dashes(v):
        if isinstance(v, str):
            return "—" in v or "–" in v
        if isinstance(v, list):
            return any(dashes(x) for x in v)
        return False
    for i, it in enumerate(items):
        if not isinstance(it, dict):
            errs.append(f'items[{i}] is not an object')
            continue
        if not it.get("id") or not it.get("type"):
            errs.append(f'items[{i}] needs non-empty "id" and "type"')
        for k, v in it.items():
            if k in COPY_FIELDS and dashes(v):
                errs.append(f'items[{i}].{k} contains an em/en dash; game copy must not (use period, comma, or "...")')
        beats = it.get("beats")
        if isinstance(beats, list):
            for j, b in enumerate(beats):
                if isinstance(b, dict) and dashes(b.get("lines")):
                    errs.append(f'items[{i}].beats[{j}].lines contains an em/en dash; game copy must not')

if errs:
    fail("; ".join(errs[:6]) + ("" if len(errs) <= 6 else f" (+{len(errs)-6} more)"))
sys.exit(0)
PY
