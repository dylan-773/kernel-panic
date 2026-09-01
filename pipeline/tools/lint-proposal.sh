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
is_proposal = bool(re.search(r"/pipeline/proposals/[^/]+\.json$", path))
is_copy_order = bool(re.search(r"/pipeline/copy/orders/[^/]+\.json$", path))
if not (is_proposal or is_copy_order):
    sys.exit(0)

def fail(msg):
    print(f"Proposal lint [{os.path.basename(path)}]: {msg}", file=sys.stderr)
    sys.exit(2)

try:
    with open(path) as f:
        doc = json.load(f)
except Exception as e:
    fail(f"not valid JSON ({e}). Rewrite the entire file as valid JSON.")

# Teaching copy orders: the concision law is enforced here rather than at
# integration, so the writing agent sees it while it still has the context.
MAX_TEACH_LINE = 160
MAX_TEACH_LINES = 2
if is_copy_order:
    errs = []
    for key in ("id", "from", "moment", "intent"):
        if not isinstance(doc.get(key), str) or not doc.get(key):
            errs.append(f'missing non-empty "{key}" string')
    if doc.get("status") not in ("open", "done"):
        errs.append('"status" must be "open" or "done"')
    title = doc.get("title")
    lines = doc.get("lines")
    if doc.get("status") == "done":
        if not isinstance(title, str) or not title:
            errs.append('a done order needs a "title" string')
        if not isinstance(lines, list) or not lines:
            errs.append('a done order needs a non-empty "lines" array')
    if isinstance(lines, list):
        if len(lines) > MAX_TEACH_LINES:
            errs.append(f"{len(lines)} lines; teaching copy caps at {MAX_TEACH_LINES}")
        for i, ln in enumerate(lines):
            if not isinstance(ln, str):
                errs.append(f"lines[{i}] is not a string")
                continue
            if len(ln) > MAX_TEACH_LINE:
                errs.append(f"lines[{i}] is {len(ln)} chars; the cap is {MAX_TEACH_LINE}")
            if "—" in ln or "–" in ln:
                errs.append(f'lines[{i}] contains an em/en dash; game copy must not')
    if isinstance(title, str) and ("—" in title or "–" in title):
        errs.append("title contains an em/en dash; game copy must not")
    if errs:
        fail("; ".join(errs[:6]) + ("" if len(errs) <= 6 else f" (+{len(errs)-6} more)"))
    sys.exit(0)

errs = []
if not isinstance(doc.get("agent"), str) or not doc.get("agent"):
    errs.append('missing top-level "agent" string')
if not isinstance(doc.get("brief"), str) or not doc.get("brief"):
    errs.append('missing top-level "brief" string (the cycle id from pipeline/BRIEF.md, or the id from your spawn prompt when no cycle is live)')
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
