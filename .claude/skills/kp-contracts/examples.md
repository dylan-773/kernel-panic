# Gold examples, one per artifact type

These are shaped exactly like accepted output. Copy the structure, not the content.

## Customer (encounter-generator)

```json
{
  "type": "customer", "id": "marisol-quill",
  "name": "Marisol Quill", "device": "a courier drone that keeps delivering to the wrong century",
  "portrait": "/assets/px/portraits/cust-03.png",
  "quotes": [
    "It flew into the shop on its own. I just followed it.",
    "The manifest says the package is for my grandmother. She died before drones."
  ],
  "winLine": "It landed soft as anything. First time in weeks.",
  "lossLine": "It is circling the block again. I will wait.",
  "tiers": [2, 3],
  "dominant": "lock"
}
```

## Augment (ability-agent)

```json
{
  "type": "augment", "id": "grapnel",
  "name": "GRAPNEL", "kind": "boost",
  "desc": "Once per dive, your first REDIRECT also claims the junction it twists if that completes your chain.",
  "synergy": "redirect config, cascade banking, LONG ARMS setups",
  "counter": "lock (a locked junction cannot be redirected), ward does not help",
  "engineNote": "needs a small hook in applyCast redirect branch plus a per-dive used flag on SideEcon"
}
```

## Day config delta (arc-composer)

```json
{
  "type": "dayconfig-delta", "id": "day-5", "day": 5,
  "set": { "greed": 0.9 },
  "targetWinPct": 56,
  "rationale": "validation 2026-07-25 run shows D5 at 61 percent, above the 58 target band and above D4; nudging greed narrows the dip-then-rise wobble"
}
```

## Journal entry (narrative-director)

```json
{
  "type": "journal", "id": "spareparts",
  "unlockAtRun": 6, "requiresOpened": false,
  "kind": "memo",
  "title": "PARTS DRAWER, THIRD FROM THE TOP",
  "date": "SPRING, YEAR BEFORE LAST",
  "body": [
    "If you are reading this you went looking for a heat gun and found my handwriting instead. Good. The drawer sticks. Lift, then pull.",
    "Everything in here fixes something in the shop. Nothing in here fixes the thing in the back room. Stop checking."
  ]
}
```

## Scene (narrative-director)

```json
{
  "type": "scene", "id": "run-open-7",
  "slot": "opener", "runNumber": 7,
  "beats": [
    { "speaker": "sister", "portrait": "SISTER", "still": "none",
      "lines": ["Seven. I stopped keeping the tally out loud, you know. It felt cruel.", "Coffee is on the counter. It was warm an hour ago."] },
    { "speaker": "system", "portrait": "none", "still": "none",
      "lines": ["KP/OS BOOT. STRAIN RESTORED. THE BACK ROOM DOOR IS STILL LOCKED."] }
  ]
}
```

## Day line (narrative-director)

```json
{ "type": "dayline", "id": "day-6", "day": 6, "text": "DAY 6. The queue is long and every ticket hums the same wrong note." }
```

## SFX preset (ux-agent) - envelopes in SECONDS

```json
{
  "type": "sfx", "id": "wardCast", "action": "tune",
  "params": { "wave": 2, "baseFreq": 320, "sustain": 0.03, "decay": 0.22, "vibDepth": 0.04, "vibSpeed": 9, "volume": 0.7 },
  "bus": "game",
  "when": "the moment a WARD field lands on its target junctions"
}
```

## UI spec (ux-agent)

```json
{
  "type": "ui-spec", "id": "banked-ram-chip",
  "area": "duel",
  "spec": "When cascade RAM banks, the dock chip pops in with a 2-frame steps() scale and holds a gold outline until the banked RAM is spent next turn. Pair with the existing kp-dock-banked class; add a soft gold glow token, no border-radius.",
  "acceptance": ["chip visible the turn after any 4+ cascade", "glow gone the moment the banked RAM is consumed"]
}
```

## Teaching moment (tutorial-agent)

```json
{
  "type": "teaching-moment", "id": "patch-cell-use",
  "teaches": ["patchCellUse"],
  "surface": "duel",
  "when": "holdingCells",
  "anchor": "screen",
  "order": 80,
  "notBeforeDay": 1,
  "title": "PATCH CELL",
  "intent": "The player is carrying a bought cell and does not know it is spent by clicking a slag block mid dive, or that it is single use.",
  "lines": null,
  "copyOrder": "copy-patch-cell-use",
  "tier": "1. Not tier 0: the pouch counter can show that a cell exists but cannot show that a slag block is the target. Not tier 2: nothing is blocked if they never spend it."
}
```

## Teach tip (tutorial-agent)

```json
{
  "type": "teach-tip", "id": "par",
  "teaches": ["par"],
  "control": "the PAR readout in the dive status bar",
  "text": "Rotation budget for a clean route. Every rotation past par costs Neural Strain when you win.",
  "tier": "1. Not tier 0: the readout can show the ratio but cannot show the strain consequence. A tip because the player re-checks the budget every dive, so it has to stay re-readable."
}
```

## Mechanic waiver (tutorial-agent)

```json
{
  "type": "mechanic-waiver", "id": "reach2",
  "waiver": "Every junction the player may legally rotate is drawn with the glowing legal ring, so the two-step reach is visible on the board at all times.",
  "expiresIf": "the legal ring is restyled, dimmed, or applied to anything other than legal rotations"
}
```

A blanket waiver over a whole content type carries a machine-checked premise:

```json
{
  "type": "mechanic-waiver", "id": "augmentEffects",
  "waiver": "Every augment carries its own desc on the draft card, in the loadout, and in MANUAL.TXT.",
  "expiresIf": "an augment ships without a name or a usable desc",
  "waiverPremise": "augmentDescs"
}
```

## Copy order (tutorial-agent files, narrative-director fulfills)

```json
{
  "id": "copy-patch-cell-use", "from": "tutorial-agent",
  "kind": "teaching-moment",
  "moment": "patch-cell-use",
  "surface": "mid dive, the first turn the player is carrying a patch cell",
  "intent": "Clicking a slag block burns the cell into a live cross junction. One use, then it is gone.",
  "constraints": "2 lines max, 160 chars each, no dashes, terminal voice, second person",
  "status": "open",
  "title": null,
  "lines": null
}
```

## Teach copy (narrative-director)

```json
{
  "type": "teach-copy", "id": "copy-patch-cell-use",
  "title": "PATCH CELL",
  "lines": [
    "You are carrying a cell. Click any slag block to burn it into a live cross junction.",
    "One use and it is gone. Save it for the wall you cannot route around."
  ]
}
```

## Art order (narrative-director or ux-agent)

```json
{
  "id": "still-junkdrawer", "from": "narrative-director",
  "kind": "still",
  "target": "/assets/px/stills/still-junkdrawer.png",
  "size": [192, 128],
  "brief": "An open workbench drawer seen from above, hand tools and labeled spare parts, one folded handwritten note catching warm signal-colored light from a desk lamp, everything else in shop shadow tones.",
  "status": "open",
  "result": null
}
```
