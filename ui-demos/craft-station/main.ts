import { PATCH_POUCH_MAX, armUnionCraft, shapeClassOf } from "../../kernel-panic-site/app/src/game/patch-cells";
import { patchGlyph } from "./glyph";
import { play, unlock } from "./sound";

/**
 * SOLDER.BAY interactive demo, built to ui-spec solder-bay-window
 * (pipeline/proposals/ux-agent.json, brief ux-2026-07-28-craft-station).
 * Pouch state is local mock data; craft correctness comes from the real
 * armUnionCraft. Three VISUAL layouts share one gate-cleared interaction
 * machine (drag piece onto piece, tap fallback, identical fuse timeline);
 * the rig panel (layouts, scenarios, juice) is demo chrome, not game UI.
 * Integration swaps commitCraft for dispatch craftPatch.
 */

const SHAPE_NOUN: Record<"I" | "L" | "T" | "X", string> = {
  I: "Straight",
  L: "Elbow",
  T: "Tee",
  X: "Cross",
};

const NO_JOIN_LINE = "No legal join for that piece. The result must be strictly bigger than both.";
const FOOT_LINE =
  "A piece fills one slag block with exactly the arms it shows, welded where it lands. " +
  "2 RAM, one per turn, single use. Pieces come off the darknet, drop from cleared jobs, " +
  `or bank on clean wins; the pouch holds ${PATCH_POUCH_MAX}.`;

type Juice = "A" | "B" | "C";
type LayoutId = "spec" | "bench" | "schematic";

const SCENARIOS: Record<string, number[]> = {
  BENCH: [0b0101, 0b0011, 0b1111, 0b0111, 0b1001],
  LONE: [0b0011],
  EMPTY: [],
};

let pouch: number[] = [...SCENARIOS.BENCH];
let juice: Juice = "A";
let layout: LayoutId = "spec";

/* glyph pixel size and hole size per layout */
const GLYPH_SIZE: Record<LayoutId, number> = { spec: 44, bench: 56, schematic: 64 };

/* tap path (PouchCard port) */
let sel: number | null = null;
let pair: number | null = null;

/* drag path */
interface Drag {
  index: number;
  chip: HTMLElement;
  offsetX: number;
  offsetY: number;
  hoverIndex: number | null;
}
let drag: Drag | null = null;
let fusing = false;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

function legalPartners(a: number): Set<number> {
  const out = new Set<number>();
  for (let i = 0; i < pouch.length; i++) {
    if (i !== a && armUnionCraft(pouch[a], pouch[i]) !== null) out.add(i);
  }
  return out;
}

/* ---------------- desktop, icon, window shell ---------------- */

const desk = document.getElementById("desk")!;
desk.style.position = "fixed";
desk.style.inset = "0";

function solderIcon(): SVGSVGElement {
  const SVG = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("width", "32");
  svg.setAttribute("height", "32");
  svg.setAttribute("viewBox", "0 0 32 32");
  const rects: Array<[number, number, number, number, string]> = [
    [4, 22, 14, 6, "currentColor"],
    [16, 18, 6, 4, "currentColor"],
    [20, 14, 4, 4, "currentColor"],
    [22, 10, 3, 4, "currentColor"],
    [23, 7, 3, 3, "var(--kp-gold)"],
    [27, 5, 2, 2, "var(--kp-signal)"],
    [25, 3, 2, 2, "var(--kp-rose)"],
    [29, 9, 2, 2, "var(--kp-gold)"],
  ];
  for (const [x, y, w, h, fill] of rects) {
    const r = document.createElementNS(SVG, "rect");
    r.setAttribute("x", String(x));
    r.setAttribute("y", String(y));
    r.setAttribute("width", String(w));
    r.setAttribute("height", String(h));
    r.setAttribute("fill", fill);
    svg.appendChild(r);
  }
  return svg;
}

const iconGrid = el("div", "kp-dicon-grid");
const icon = el("button", "kp-dicon");
const iconGlyph = el("span", "kp-dicon-glyph");
iconGlyph.appendChild(solderIcon());
icon.append(iconGlyph, el("span", "kp-dicon-label", "SOLDER.BAY"));
iconGrid.appendChild(icon);
desk.appendChild(iconGrid);

const win = el("div", "kp-fw kp-fw-focused");
win.style.display = "none";

const bar = el("div", "kp-fw-bar");
bar.append(el("span", "kp-fw-title", "SOLDER.BAY"));
const closeBtn = el("button", "kp-fw-close", "X");
bar.appendChild(closeBtn);
const body = el("div", "kp-fw-body");
win.append(bar, body);
desk.appendChild(win);

function sizeWindow(): void {
  win.classList.remove("lay-spec", "lay-bench", "lay-schematic");
  win.classList.add(`lay-${layout}`);
  const vw = window.innerWidth;
  if (layout === "spec") {
    win.style.width = `${Math.min(640, vw - 32)}px`;
    win.style.left = `${Math.max(16, Math.round(vw * 0.24))}px`;
    win.style.top = "96px";
  } else if (layout === "bench") {
    win.style.width = `${Math.min(1040, vw - 48)}px`;
    win.style.left = `${Math.max(16, Math.round((vw - Math.min(1040, vw - 48)) / 2))}px`;
    win.style.top = "72px";
  } else {
    win.style.width = `${vw - 48}px`;
    win.style.left = "24px";
    win.style.top = "56px";
  }
}

let winOpen = false;
function toggleWin(): void {
  winOpen = !winOpen;
  win.style.display = winOpen ? "flex" : "none";
  play(winOpen ? "winOpen" : "winClose");
  if (winOpen) {
    win.style.animation = "none";
    void win.offsetWidth;
    win.style.animation = "";
    sizeWindow();
    render();
  } else {
    clearHeld();
  }
}
icon.addEventListener("click", toggleWin);
closeBtn.addEventListener("click", toggleWin);

let winDrag: { dx: number; dy: number } | null = null;
bar.addEventListener("pointerdown", (e) => {
  if (e.target === closeBtn) return;
  winDrag = { dx: e.clientX - win.offsetLeft, dy: e.clientY - win.offsetTop };
  bar.setPointerCapture(e.pointerId);
  win.classList.add("kp-fw-dragging");
});
bar.addEventListener("pointermove", (e) => {
  if (!winDrag) return;
  win.style.left = `${e.clientX - winDrag.dx}px`;
  win.style.top = `${Math.max(0, e.clientY - winDrag.dy)}px`;
});
bar.addEventListener("pointerup", () => {
  winDrag = null;
  win.classList.remove("kp-fw-dragging");
});

/* ---------------- layout state refs, rebuilt each render ---------------- */

let targetsRoot: HTMLElement = body;
let joinRow: HTMLElement = el("div");
let actions: HTMLElement = el("div");
let shakeTarget: HTMLElement = body;
let traceLayer: SVGSVGElement | null = null;

function targetEls(): HTMLElement[] {
  return Array.from(targetsRoot.querySelectorAll("[data-slot-index]")) as HTMLElement[];
}

function slotAt(i: number): HTMLElement | undefined {
  return targetEls().find((s) => Number(s.dataset.slotIndex) === i);
}

function makeHead(): HTMLElement {
  const head = el("div", "kp-solder-head");
  head.append(el("strong", "", "PATCH POUCH"), el("em", "", `${pouch.length} / ${PATCH_POUCH_MAX}`));
  return head;
}

function makeSlot(i: number, reveal: boolean): HTMLElement {
  const size = GLYPH_SIZE[layout];
  if (i < pouch.length) {
    const slot = el("button", "kp-solder-slot");
    slot.type = "button";
    slot.dataset.slotIndex = String(i);
    slot.appendChild(patchGlyph(pouch[i], size));
    slot.appendChild(el("span", "", SHAPE_NOUN[shapeClassOf(pouch[i])]));
    wireSlot(slot, i);
    if (reveal && juice !== "C") {
      slot.classList.add("kp-slot-anim");
      slot.style.animationDelay = `${i * (juice === "B" ? 60 : 40)}ms`;
    }
    return slot;
  }
  const hole = el("span", "kp-solder-slot kp-solder-empty");
  hole.dataset.slotIndex = String(i);
  hole.appendChild(el("span", "kp-piece-hole"));
  if (reveal && juice !== "C") {
    hole.classList.add("kp-slot-anim");
    hole.style.animationDelay = `${i * (juice === "B" ? 60 : 40)}ms`;
  }
  return hole;
}

/* fractional node positions for the schematic board, tuned for 5 slots */
const NODE_POS: Array<[number, number]> = [
  [0.16, 0.3],
  [0.46, 0.18],
  [0.78, 0.3],
  [0.3, 0.7],
  [0.64, 0.72],
];

function render(reveal = false): void {
  body.textContent = "";
  body.className = `kp-fw-body kp-body-${layout}`;
  traceLayer = null;

  if (layout === "spec") {
    const deck = el("div", "kp-solder-deck");
    const rack = el("div", "kp-solder-rack");
    for (let i = 0; i < PATCH_POUCH_MAX; i++) rack.appendChild(makeSlot(i, reveal));
    joinRow = el("div", "kp-solder-join");
    actions = el("div", "kp-piece-actions");
    deck.append(rack, joinRow, actions);
    body.append(makeHead(), deck, el("p", "kp-solder-foot", FOOT_LINE));
    targetsRoot = rack;
    shakeTarget = deck;
  } else if (layout === "bench") {
    const surface = el("div", "kp-bench-surface");
    for (let i = 0; i < PATCH_POUCH_MAX; i++) {
      const slot = makeSlot(i, reveal);
      slot.classList.add("kp-bench-pad");
      surface.appendChild(slot);
    }
    const console_ = el("div", "kp-bench-console");
    joinRow = el("div", "kp-solder-join");
    actions = el("div", "kp-piece-actions");
    const readout = el("div", "kp-bench-readout");
    readout.append(joinRow, actions);
    console_.append(readout, el("p", "kp-solder-foot", FOOT_LINE));
    body.append(makeHead(), surface, console_);
    targetsRoot = surface;
    shakeTarget = surface;
  } else {
    const board = el("div", "kp-schem-board");
    const SVG = "http://www.w3.org/2000/svg";
    traceLayer = document.createElementNS(SVG, "svg");
    traceLayer.setAttribute("class", "kp-schem-traces");
    board.appendChild(traceLayer);
    for (let i = 0; i < PATCH_POUCH_MAX; i++) {
      const slot = makeSlot(i, reveal);
      slot.classList.add("kp-schem-node");
      const anchor = el("div", "kp-schem-anchor");
      const [fx, fy] = NODE_POS[i];
      anchor.style.left = `${fx * 100}%`;
      anchor.style.top = `${fy * 100}%`;
      if (slot.classList.contains("kp-slot-anim")) {
        anchor.classList.add("kp-slot-anim");
        anchor.style.animationDelay = slot.style.animationDelay;
        slot.classList.remove("kp-slot-anim");
        slot.style.animationDelay = "";
      }
      anchor.appendChild(slot);
      board.appendChild(anchor);
    }
    const console_ = el("div", "kp-bench-console");
    joinRow = el("div", "kp-solder-join");
    actions = el("div", "kp-piece-actions");
    const readout = el("div", "kp-bench-readout");
    readout.append(joinRow, actions);
    console_.append(readout, el("p", "kp-solder-foot", FOOT_LINE));
    body.append(makeHead(), board, console_);
    targetsRoot = board;
    shakeTarget = board;
  }

  paintTapState();
  paintJoinRow();
}

/* ---------------- traces (schematic only) ---------------- */

function surfacePoint(x: number, y: number): { x: number; y: number } {
  const r = targetsRoot.getBoundingClientRect();
  return { x: x - r.left, y: y - r.top };
}

function drawTraces(fromX: number, fromY: number, held: number): void {
  if (!traceLayer) return;
  traceLayer.textContent = "";
  const SVG = "http://www.w3.org/2000/svg";
  const from = surfacePoint(fromX, fromY);
  for (const i of legalPartners(held)) {
    const target = slotAt(i);
    if (!target) continue;
    const tr = target.getBoundingClientRect();
    const to = surfacePoint(tr.left + tr.width / 2, tr.top + tr.height / 2);
    const line = document.createElementNS(SVG, "line");
    line.setAttribute("x1", String(from.x));
    line.setAttribute("y1", String(from.y));
    line.setAttribute("x2", String(to.x));
    line.setAttribute("y2", String(to.y));
    line.setAttribute("class", "kp-schem-trace");
    traceLayer.appendChild(line);
  }
}

function clearTraces(): void {
  if (traceLayer) traceLayer.textContent = "";
}

/* ---------------- join row + tap actions ---------------- */

function joinCandidate(): { a: number; b: number } | null {
  if (drag) {
    const h = drag.hoverIndex;
    if (h !== null && h < pouch.length && armUnionCraft(pouch[drag.index], pouch[h]) !== null) {
      return { a: drag.index, b: h };
    }
    return null;
  }
  if (sel !== null && pair !== null) return { a: sel, b: pair };
  return null;
}

function paintJoinRow(): void {
  joinRow.textContent = "";
  actions.textContent = "";
  const heldIndex = drag ? drag.index : sel;
  if (heldIndex === null || fusing) return;
  const cand = joinCandidate();
  if (cand) {
    const union = armUnionCraft(pouch[cand.a], pouch[cand.b])!;
    joinRow.append(
      "JOIN: ", patchGlyph(pouch[cand.a], 16), " + ", patchGlyph(pouch[cand.b], 16),
      " -> ", patchGlyph(union, 20), ` ${SHAPE_NOUN[shapeClassOf(union)]}`,
    );
    if (!drag) {
      const craft = el("button", "", "CRAFT");
      craft.addEventListener("click", () => {
        void fuseAt(sel!, pair!, null);
      });
      const cancel = el("button", "", "CANCEL");
      cancel.addEventListener("click", () => rejectCancel(null));
      actions.append(craft, cancel);
    }
    return;
  }
  const partners = legalPartners(heldIndex);
  const hoveringIllegal = drag !== null && drag.hoverIndex !== null;
  if (partners.size === 0 || hoveringIllegal) {
    joinRow.textContent = NO_JOIN_LINE;
  }
}

function paintTapState(): void {
  const partners = sel !== null ? legalPartners(sel) : new Set<number>();
  for (const s of targetEls()) {
    const i = Number(s.dataset.slotIndex);
    s.classList.remove("kp-solder-carry", "kp-piece-dim", "kp-solder-legal", "kp-solder-illegal");
    if (drag) {
      if (i === drag.index) markDragOrigin(s);
      continue;
    }
    if (i === sel || i === pair) s.classList.add("kp-solder-carry");
    else if (sel !== null && pair === null && i < pouch.length && !partners.has(i)) s.classList.add("kp-piece-dim");
  }
  if (!drag && traceLayer) {
    if (sel !== null) {
      const s = slotAt(sel);
      if (s) {
        const r = s.getBoundingClientRect();
        drawTraces(r.left + r.width / 2, r.top + r.height / 2, sel);
      }
    } else clearTraces();
  }
}

function markDragOrigin(slot: HTMLElement): void {
  slot.textContent = "";
  slot.appendChild(el("span", "kp-piece-hole"));
}

function clearHeld(): void {
  sel = null;
  pair = null;
  if (drag) {
    document.body.classList.remove("kp-dragging-piece");
    drag.chip.remove();
    drag = null;
  }
  clearTraces();
  paintTapState();
  paintJoinRow();
}

/* ---------------- slot wiring: tap + drag ---------------- */

function wireSlot(slot: HTMLButtonElement, index: number): void {
  let start: { x: number; y: number; id: number } | null = null;
  let dragged = false;

  slot.addEventListener("pointerdown", (e) => {
    if (fusing) return;
    start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    dragged = false;
    /* capture immediately (wm.tsx title-bar pattern): a fast flick must not
     * outrun the slot's own pointermove before the threshold check runs */
    slot.setPointerCapture(e.pointerId);
  });

  slot.addEventListener("pointermove", (e) => {
    if (fusing || !start) {
      if (drag && dragged) moveDrag(e);
      return;
    }
    if (drag && dragged) {
      moveDrag(e);
      return;
    }
    const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    if (!drag && (e.pointerType === "mouse" || e.pointerType === "pen") && dist > 6) {
      dragged = true;
      beginDrag(slot, index, e);
      moveDrag(e);
    }
  });

  slot.addEventListener("pointerup", (e) => {
    start = null;
    if (drag && dragged) {
      endDrag(e);
    }
  });

  slot.addEventListener("click", () => {
    if (fusing) return;
    if (dragged) {
      dragged = false;
      return;
    }
    tapActivate(index);
  });
}

function tapActivate(i: number): void {
  if (sel === null) {
    sel = i;
    play("solderPickup");
  } else if (i === sel) {
    sel = null;
    pair = null;
  } else if (pair === null) {
    if (legalPartners(sel).has(i)) {
      pair = i;
    } else {
      rejectCancel(i);
      return;
    }
  } else if (i === pair) {
    pair = null;
  }
  paintTapState();
  paintJoinRow();
}

/* ---------------- live drag ---------------- */

function beginDrag(slot: HTMLElement, index: number, e: PointerEvent): void {
  sel = null;
  pair = null;
  const rect = slot.getBoundingClientRect();
  const chip = el("div", "kp-solder-slot kp-solder-carry kp-solder-ghostchip");
  if (layout === "bench") chip.classList.add("kp-bench-pad", "kp-pad-loose");
  if (layout === "schematic") chip.classList.add("kp-schem-node", "kp-node-loose");
  chip.appendChild(patchGlyph(pouch[index], GLYPH_SIZE[layout]));
  chip.appendChild(el("span", "", SHAPE_NOUN[shapeClassOf(pouch[index])]));
  chip.style.left = `${rect.left}px`;
  chip.style.top = `${rect.top}px`;
  document.body.appendChild(chip);
  drag = {
    index,
    chip,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
    hoverIndex: null,
  };
  play("solderPickup");
  document.body.classList.add("kp-dragging-piece");
  paintTapState();
  paintJoinRow();
  if (traceLayer) {
    const c = chip.getBoundingClientRect();
    drawTraces(c.left + c.width / 2, c.top + c.height / 2, index);
  }
}

function moveDrag(e: PointerEvent): void {
  if (!drag) return;
  drag.chip.style.left = `${e.clientX - drag.offsetX}px`;
  drag.chip.style.top = `${e.clientY - drag.offsetY}px`;

  if (traceLayer) {
    const c = drag.chip.getBoundingClientRect();
    drawTraces(c.left + c.width / 2, c.top + c.height / 2, drag.index);
  }

  const under = document.elementFromPoint(e.clientX, e.clientY);
  const slotEl = under?.closest?.("[data-slot-index]") as HTMLElement | null;
  const idx = slotEl && targetsRoot.contains(slotEl) ? Number(slotEl.dataset.slotIndex) : null;
  if (idx === drag.hoverIndex) return;

  for (const s of targetEls()) s.classList.remove("kp-solder-legal", "kp-solder-illegal");
  drag.hoverIndex = idx;
  if (idx !== null) {
    const target = slotAt(idx);
    const legal = idx !== drag.index && idx < pouch.length &&
      armUnionCraft(pouch[drag.index], pouch[idx]) !== null;
    if (target && legal) {
      target.classList.add("kp-solder-legal");
      play("solderHoverLegal");
    } else if (target) {
      target.classList.add("kp-solder-illegal");
      play("solderHoverIllegal");
    }
  }
  paintJoinRow();
}

function endDrag(e: PointerEvent): void {
  if (!drag) return;
  const { index, hoverIndex } = drag;
  const legal = hoverIndex !== null && hoverIndex !== index && hoverIndex < pouch.length &&
    armUnionCraft(pouch[index], pouch[hoverIndex]) !== null;
  if (legal) {
    document.body.classList.remove("kp-dragging-piece");
    clearTraces();
    void fuseAt(index, hoverIndex!, drag);
    drag = null;
  } else {
    rejectCancel(hoverIndex !== null && hoverIndex < pouch.length ? hoverIndex : null);
  }
}

/* ---------------- reject / cancel ---------------- */

function rejectCancel(flashIndex: number | null): void {
  play("solderReject");
  if (flashIndex !== null && flashIndex !== (drag ? drag.index : sel)) {
    const target = slotAt(flashIndex);
    if (target) {
      target.classList.add("kp-solder-deny");
      setTimeout(() => target.classList.remove("kp-solder-deny"), 180);
    }
  }
  if (drag) {
    document.body.classList.remove("kp-dragging-piece");
    const originIndex = drag.index;
    drag.chip.remove();
    drag = null;
    clearTraces();
    render();
    const back = slotAt(originIndex);
    const recoil = back?.querySelector("svg") ?? back;
    if (recoil && juice !== "C") {
      recoil.classList.add("kp-shake-1");
      setTimeout(() => recoil.classList.remove("kp-shake-1"), 220);
    }
  } else {
    sel = null;
    pair = null;
    clearTraces();
    paintTapState();
    paintJoinRow();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && (drag || sel !== null) && !fusing) rejectCancel(null);
});

/* ---------------- the fuse timeline ---------------- */

function slotCenter(i: number): { x: number; y: number } {
  const s = slotAt(i)!;
  const r = s.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function sparkOverlay(x: number, y: number, rays: number): HTMLElement {
  const SVG = "http://www.w3.org/2000/svg";
  const wrap = el("div", "kp-solder-spark");
  const svg = document.createElementNS(SVG, "svg");
  const px = layout === "spec" ? 48 : 72;
  svg.setAttribute("width", String(px));
  svg.setAttribute("height", String(px));
  svg.setAttribute("viewBox", "-12 -12 24 24");
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI * 2 * i) / rays + Math.PI / rays;
    const line = document.createElementNS(SVG, "line");
    line.setAttribute("x1", String(Math.cos(a) * 3));
    line.setAttribute("y1", String(Math.sin(a) * 3));
    line.setAttribute("x2", String(Math.cos(a) * 10));
    line.setAttribute("y2", String(Math.sin(a) * 10));
    line.setAttribute("stroke", "var(--kp-gold)");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  }
  wrap.appendChild(svg);
  wrap.style.left = `${x - px / 2}px`;
  wrap.style.top = `${y - px / 2}px`;
  document.body.appendChild(wrap);
  return wrap;
}

async function fuseAt(a: number, b: number, liveDrag: Drag | null): Promise<void> {
  fusing = true;
  const union = armUnionCraft(pouch[a], pouch[b])!;
  const target = slotCenter(b);
  const heavy = juice === "B";

  /* t=0: contact */
  play("solderArc", heavy ? { vol: 1.15 } : {});
  const spark = sparkOverlay(target.x, target.y, heavy ? 8 : 4);
  setTimeout(() => spark.remove(), 200);

  let chip: HTMLElement;
  if (liveDrag) {
    chip = liveDrag.chip;
  } else {
    const s = slotAt(a)!;
    const rect = s.getBoundingClientRect();
    chip = el("div", "kp-solder-slot kp-solder-carry kp-solder-ghostchip");
    chip.appendChild(patchGlyph(pouch[a], GLYPH_SIZE[layout]));
    chip.style.left = `${rect.left}px`;
    chip.style.top = `${rect.top}px`;
    document.body.appendChild(chip);
  }
  /* CONTACT 0-80ms: steps(2) move onto the target slot */
  const cur = chip.getBoundingClientRect();
  const dest = { x: target.x - cur.width / 2, y: target.y - cur.height / 2 };
  setTimeout(() => {
    chip.style.left = `${(cur.left + dest.x) / 2}px`;
    chip.style.top = `${(cur.top + dest.y) / 2}px`;
  }, 40);
  setTimeout(() => {
    chip.style.left = `${dest.x}px`;
    chip.style.top = `${dest.y}px`;
  }, 80);

  /* t=80: weld */
  setTimeout(() => {
    play("pieceFuse", heavy ? { rate: 0.94, vol: 1.15 } : {});
    shakeTarget.classList.add(heavy ? "kp-shake-2" : "kp-shake-1");
    chip.style.animation = "kp-solder-weld-in 180ms steps(4) both reverse";
    const weld = el("div", "kp-solder-weldwrap kp-solder-weld-fade");
    const SVG = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "-8 -8 16 16");
    const dot = document.createElementNS(SVG, "circle");
    dot.setAttribute("r", "3.5");
    dot.setAttribute("class", "kp-dweld");
    svg.appendChild(dot);
    weld.appendChild(svg);
    weld.style.left = `${target.x - 8}px`;
    weld.style.top = `${target.y - 8}px`;
    document.body.appendChild(weld);
    setTimeout(() => weld.remove(), 1200);
    if (heavy) {
      const flash = el("div", "kp-solder-flash");
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 160);
    }
  }, 80);

  /* t=260: commit + reveal */
  setTimeout(() => {
    shakeTarget.classList.remove("kp-shake-1", "kp-shake-2");
    chip.remove();
    pouch = pouch.filter((_, i) => i !== a && i !== b);
    pouch.push(union);
    sel = null;
    pair = null;
    fusing = false;
    render(true);
  }, 260);
}

/* ---------------- demo rig ---------------- */

const rig = el("div", "rig");
rig.appendChild(el("strong", "", "DEMO RIG"));

rig.appendChild(el("span", "", "Layout"));
const layRow = el("div", "rig-row");
const LAY_LABEL: Record<LayoutId, string> = { spec: "SPEC+", bench: "BENCH", schematic: "SCHEMATIC" };
for (const l of ["spec", "bench", "schematic"] as LayoutId[]) {
  const b = el("button", l === layout ? "rig-on" : "", LAY_LABEL[l]);
  b.addEventListener("click", () => {
    layRow.querySelectorAll("button").forEach((x) => x.classList.remove("rig-on"));
    b.classList.add("rig-on");
    layout = l;
    clearHeld();
    fusing = false;
    sizeWindow();
    render();
  });
  layRow.appendChild(b);
}
rig.appendChild(layRow);

rig.appendChild(el("span", "", "Scenario"));
const scenRow = el("div", "rig-row");
for (const name of Object.keys(SCENARIOS)) {
  const b = el("button", name === "BENCH" ? "rig-on" : "", name);
  b.addEventListener("click", () => {
    scenRow.querySelectorAll("button").forEach((x) => x.classList.remove("rig-on"));
    b.classList.add("rig-on");
    pouch = [...SCENARIOS[name]];
    clearHeld();
    fusing = false;
    render();
  });
  scenRow.appendChild(b);
}
rig.appendChild(scenRow);

rig.appendChild(el("span", "", "Juice"));
const juiceRow = el("div", "rig-row");
const juiceLabel: Record<Juice, string> = { A: "A SPEC", B: "B HEAVY", C: "C QUIET" };
for (const j of ["A", "B", "C"] as Juice[]) {
  const b = el("button", j === "A" ? "rig-on" : "", juiceLabel[j]);
  b.addEventListener("click", () => {
    juiceRow.querySelectorAll("button").forEach((x) => x.classList.remove("rig-on"));
    b.classList.add("rig-on");
    juice = j;
  });
  juiceRow.appendChild(b);
}
rig.appendChild(juiceRow);
rig.appendChild(el("span", "", "Drag pieces together to craft. Layouts are visual variants over one interaction spec; juice scales the payoff."));
desk.appendChild(rig);

document.addEventListener("pointerdown", () => unlock(), { once: true });
window.addEventListener("resize", () => {
  if (winOpen) {
    sizeWindow();
    render();
  }
});

sizeWindow();
render();
toggleWin();
