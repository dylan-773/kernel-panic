import { el, hero, ticks, patchGlyph } from "./ui";
import { run, on, emit, PATCH_POUCH_MAX, armUnionCraft, shapeClassOf, SHAPE_NOUN, NO_JOIN_LINE, FOOT_LINE } from "./data";
import { play } from "./sound";
import type { Win } from "./wm";

/**
 * SOLDER.BAY: the gate-cleared solder-bay-window machine (states, timeline,
 * sfx unchanged from ui-demos/craft-station), reskinned per kpos-solder-
 * reskin: frame-tick deck, hero JOIN label while a piece is held, cursor
 * grab/grabbing, shared pouch state (run.patchPouch) so every window tracks.
 */

const GLYPH = 44;

interface Drag {
  index: number;
  chip: HTMLElement;
  offsetX: number;
  offsetY: number;
  hoverIndex: number | null;
}

export function buildSolder(win: Win): void {
  let sel: number | null = null;
  let pair: number | null = null;
  let drag: Drag | null = null;
  let fusing = false;

  let rack = el("div");
  let joinRow = el("div");
  let actions = el("div");
  let heroSlot = el("div");
  let deck = el("div");

  const pouch = () => run.patchPouch;

  const legalPartners = (a: number): Set<number> => {
    const out = new Set<number>();
    for (let i = 0; i < pouch().length; i++) {
      if (i !== a && armUnionCraft(pouch()[a], pouch()[i]) !== null) out.add(i);
    }
    return out;
  };

  const targetEls = (): HTMLElement[] =>
    Array.from(rack.querySelectorAll("[data-slot-index]")) as HTMLElement[];

  const slotAt = (i: number): HTMLElement | undefined =>
    targetEls().find((s) => Number(s.dataset.slotIndex) === i);

  const makeSlot = (i: number, reveal: boolean): HTMLElement => {
    if (i < pouch().length) {
      const slot = el("button", "kp-solder-slot");
      slot.type = "button";
      slot.dataset.slotIndex = String(i);
      slot.appendChild(patchGlyph(pouch()[i], GLYPH));
      slot.appendChild(el("span", "", SHAPE_NOUN[shapeClassOf(pouch()[i])]));
      wireSlot(slot as HTMLButtonElement, i);
      if (reveal) {
        slot.classList.add("kp-slot-anim");
        slot.style.animationDelay = `${i * 40}ms`;
      }
      return slot;
    }
    const hole = el("span", "kp-solder-slot kp-solder-empty");
    hole.dataset.slotIndex = String(i);
    hole.appendChild(el("span", "kp-piece-hole"));
    if (reveal) {
      hole.classList.add("kp-slot-anim");
      hole.style.animationDelay = `${i * 40}ms`;
    }
    return hole;
  };

  const render = (reveal = false): void => {
    win.body.textContent = "";
    const box = el("div", "kp-solder");

    const head = el("div", "kp-solder-head");
    head.append(el("strong", "", "PATCH POUCH"), el("em", "", `${pouch().length} / ${PATCH_POUCH_MAX}`));
    box.appendChild(head);

    heroSlot = el("div", "kp-solder-hero");
    box.appendChild(heroSlot);

    deck = el("div", "kp-solder-deck");
    ticks(deck);
    rack = el("div", "kp-solder-rack");
    for (let i = 0; i < PATCH_POUCH_MAX; i++) rack.appendChild(makeSlot(i, reveal));
    joinRow = el("div", "kp-solder-join");
    actions = el("div", "kp-piece-actions");
    deck.append(rack, joinRow, actions);
    box.appendChild(deck);

    box.appendChild(el("p", "kp-solder-foot", FOOT_LINE));
    win.body.appendChild(box);

    paintTapState();
    paintJoinRow();
  };

  const heldIndex = (): number | null => (drag ? drag.index : sel);

  const paintHero = (): void => {
    heroSlot.textContent = "";
    if (heldIndex() !== null && !fusing) {
      heroSlot.appendChild(hero("JOIN"));
    }
  };

  const joinCandidate = (): { a: number; b: number } | null => {
    if (drag) {
      const h = drag.hoverIndex;
      if (h !== null && h < pouch().length && armUnionCraft(pouch()[drag.index], pouch()[h]) !== null) {
        return { a: drag.index, b: h };
      }
      return null;
    }
    if (sel !== null && pair !== null) return { a: sel, b: pair };
    return null;
  };

  const paintJoinRow = (): void => {
    joinRow.textContent = "";
    actions.textContent = "";
    paintHero();
    const held = heldIndex();
    if (held === null || fusing) return;
    const cand = joinCandidate();
    if (cand) {
      const union = armUnionCraft(pouch()[cand.a], pouch()[cand.b])!;
      joinRow.append(
        "JOIN: ", patchGlyph(pouch()[cand.a], 16), " + ", patchGlyph(pouch()[cand.b], 16),
        " -> ", patchGlyph(union, 20), ` ${SHAPE_NOUN[shapeClassOf(union)]}`,
      );
      if (!drag) {
        const craft = el("button", "", "CRAFT");
        craft.type = "button";
        craft.addEventListener("click", () => { void fuseAt(sel!, pair!, null); });
        const cancel = el("button", "", "CANCEL");
        cancel.type = "button";
        cancel.addEventListener("click", () => rejectCancel(null));
        actions.append(craft, cancel);
      }
      return;
    }
    const partners = legalPartners(held);
    const hoveringIllegal = drag !== null && drag.hoverIndex !== null;
    if (partners.size === 0 || hoveringIllegal) {
      joinRow.textContent = NO_JOIN_LINE;
    }
  };

  const paintTapState = (): void => {
    const partners = sel !== null ? legalPartners(sel) : new Set<number>();
    for (const s of targetEls()) {
      const i = Number(s.dataset.slotIndex);
      s.classList.remove("kp-solder-carry", "kp-piece-dim", "kp-solder-legal", "kp-solder-illegal");
      if (drag) {
        if (i === drag.index) {
          s.textContent = "";
          s.appendChild(el("span", "kp-piece-hole"));
        }
        continue;
      }
      if (i === sel || i === pair) s.classList.add("kp-solder-carry");
      else if (sel !== null && pair === null && i < pouch().length && !partners.has(i)) s.classList.add("kp-piece-dim");
    }
  };

  const clearHeld = (): void => {
    sel = null;
    pair = null;
    if (drag) {
      document.body.classList.remove("kp-dragging-piece");
      drag.chip.remove();
      drag = null;
    }
    paintTapState();
    paintJoinRow();
  };

  function wireSlot(slot: HTMLButtonElement, index: number): void {
    let start: { x: number; y: number; id: number } | null = null;
    let dragged = false;

    slot.addEventListener("pointerdown", (e) => {
      if (fusing) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      dragged = false;
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
      if (drag && dragged) endDrag(e);
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

  const tapActivate = (i: number): void => {
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
  };

  const beginDrag = (slot: HTMLElement, index: number, e: PointerEvent): void => {
    sel = null;
    pair = null;
    const rect = slot.getBoundingClientRect();
    const chip = el("div", "kp-solder-slot kp-solder-carry kp-solder-ghostchip");
    chip.appendChild(patchGlyph(pouch()[index], GLYPH));
    chip.appendChild(el("span", "", SHAPE_NOUN[shapeClassOf(pouch()[index])]));
    chip.style.left = `${rect.left}px`;
    chip.style.top = `${rect.top}px`;
    document.body.appendChild(chip);
    drag = { index, chip, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top, hoverIndex: null };
    play("solderPickup");
    document.body.classList.add("kp-dragging-piece");
    paintTapState();
    paintJoinRow();
  };

  const moveDrag = (e: PointerEvent): void => {
    if (!drag) return;
    drag.chip.style.left = `${e.clientX - drag.offsetX}px`;
    drag.chip.style.top = `${e.clientY - drag.offsetY}px`;

    const under = document.elementFromPoint(e.clientX, e.clientY);
    const slotEl = under?.closest?.("[data-slot-index]") as HTMLElement | null;
    const idx = slotEl && rack.contains(slotEl) ? Number(slotEl.dataset.slotIndex) : null;
    if (idx === drag.hoverIndex) return;

    for (const s of targetEls()) s.classList.remove("kp-solder-legal", "kp-solder-illegal");
    drag.hoverIndex = idx;
    if (idx !== null) {
      const target = slotAt(idx);
      const legal = idx !== drag.index && idx < pouch().length &&
        armUnionCraft(pouch()[drag.index], pouch()[idx]) !== null;
      if (target && legal) {
        target.classList.add("kp-solder-legal");
        play("solderHoverLegal");
      } else if (target) {
        target.classList.add("kp-solder-illegal");
        play("solderHoverIllegal");
      }
    }
    paintJoinRow();
  };

  const endDrag = (e: PointerEvent): void => {
    if (!drag) return;
    const { index, hoverIndex } = drag;
    const legal = hoverIndex !== null && hoverIndex !== index && hoverIndex < pouch().length &&
      armUnionCraft(pouch()[index], pouch()[hoverIndex]) !== null;
    if (legal) {
      document.body.classList.remove("kp-dragging-piece");
      void fuseAt(index, hoverIndex!, drag);
      drag = null;
    } else {
      rejectCancel(hoverIndex !== null && hoverIndex < pouch().length ? hoverIndex : null);
    }
  };

  const rejectCancel = (flashIndex: number | null): void => {
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
      render();
      const back = slotAt(originIndex);
      const recoil = back?.querySelector("svg") ?? back;
      if (recoil) {
        recoil.classList.add("kp-shake-1");
        setTimeout(() => recoil.classList.remove("kp-shake-1"), 220);
      }
    } else {
      sel = null;
      pair = null;
      paintTapState();
      paintJoinRow();
    }
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (drag || sel !== null) && !fusing && win.isOpen()) rejectCancel(null);
  });

  const slotCenter = (i: number): { x: number; y: number } => {
    const s = slotAt(i)!;
    const r = s.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const sparkOverlay = (x: number, y: number): HTMLElement => {
    const SVGNS = "http://www.w3.org/2000/svg";
    const wrap = el("div", "kp-solder-spark");
    const svg = document.createElementNS(SVGNS, "svg");
    const px = 48;
    svg.setAttribute("width", String(px));
    svg.setAttribute("height", String(px));
    svg.setAttribute("viewBox", "-12 -12 24 24");
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 * i) / 4 + Math.PI / 4;
      const line = document.createElementNS(SVGNS, "line");
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
  };

  async function fuseAt(a: number, b: number, liveDrag: Drag | null): Promise<void> {
    fusing = true;
    const union = armUnionCraft(pouch()[a], pouch()[b])!;
    const target = slotCenter(b);

    /* t=0: contact */
    play("solderArc");
    const spark = sparkOverlay(target.x, target.y);
    setTimeout(() => spark.remove(), 200);

    let chip: HTMLElement;
    if (liveDrag) {
      chip = liveDrag.chip;
    } else {
      const s = slotAt(a)!;
      const rect = s.getBoundingClientRect();
      chip = el("div", "kp-solder-slot kp-solder-carry kp-solder-ghostchip");
      chip.appendChild(patchGlyph(pouch()[a], GLYPH));
      chip.style.left = `${rect.left}px`;
      chip.style.top = `${rect.top}px`;
      document.body.appendChild(chip);
    }
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
      play("pieceFuse");
      deck.classList.add("kp-shake-1");
      chip.style.animation = "kp-solder-weld-in 180ms steps(4) both reverse";
      const weld = el("div", "kp-solder-weldwrap kp-solder-weld-fade");
      const SVGNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("width", "16");
      svg.setAttribute("height", "16");
      svg.setAttribute("viewBox", "-8 -8 16 16");
      const dot = document.createElementNS(SVGNS, "circle");
      dot.setAttribute("r", "3.5");
      dot.setAttribute("class", "kp-dweld");
      svg.appendChild(dot);
      weld.appendChild(svg);
      weld.style.left = `${target.x - 8}px`;
      weld.style.top = `${target.y - 8}px`;
      document.body.appendChild(weld);
      setTimeout(() => weld.remove(), 1200);
    }, 80);

    /* t=260: commit + reveal */
    setTimeout(() => {
      deck.classList.remove("kp-shake-1");
      chip.remove();
      run.patchPouch = run.patchPouch.filter((_, i) => i !== a && i !== b);
      run.patchPouch.push(union);
      sel = null;
      pair = null;
      fusing = false;
      render(true);
      selfEmit = true;
      emit("pouch");
      selfEmit = false;
    }, 260);
  }

  let selfEmit = false;
  render();
  on("pouch", () => {
    if (!selfEmit && !fusing && !drag) render();
  });
}
