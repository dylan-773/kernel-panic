import { el } from "./ui";
import { play } from "./sound";

/**
 * kpos-shell window manager: the wm.tsx/wm.css chrome rebuilt under the
 * kpos-window-sizing law (no body scroll, --kp-win-h-ceiling on the frame,
 * min(target, 96vw) widths) plus the new FOCUS-PULSE + winFocus behavior
 * from kpos-design-language. Footprints are the kpos-window-sizing table.
 */

export interface WinDef {
  id: string;
  title: string;
  x: number;
  y: number;
  w: number;
  /** accent channel class, e.g. "kp-ch-magenta" */
  channel?: string;
  /** DARKNET.LNK only: stepped-notch title bar + violet chevron */
  notched?: boolean;
}

export interface Win {
  def: WinDef;
  root: HTMLElement;
  bar: HTMLElement;
  body: HTMLElement;
  titleEl: HTMLElement;
  open: () => void;
  close: () => void;
  focus: () => void;
  isOpen: () => boolean;
}

const TITLE_MIN_VISIBLE = 40;
const BASE_Z = 100;

const wins: Win[] = [];
let zOrder: string[] = [];
let onLayoutChange: (() => void) | null = null;

export function setLayoutListener(fn: () => void): void {
  onLayoutChange = fn;
}

export function openWindows(): Win[] {
  return wins.filter((w) => w.isOpen());
}

/* shared z-order registry, so iframe-embedded study windows (w-embed.ts)
 * stack with the kp-fw windows instead of living in a parallel world */
export function registerWin(win: Win): void {
  wins.push(win);
}

/** raise a window; returns true when it already was on top */
export function raiseWin(id: string): boolean {
  const wasTop = topId() === id;
  zOrder = [...zOrder.filter((x) => x !== id), id];
  applyZ();
  return wasTop;
}

export function dropWin(id: string): void {
  zOrder = zOrder.filter((x) => x !== id);
  applyZ();
}

export function notifyLayout(): void {
  onLayoutChange?.();
}

function topId(): string | null {
  return zOrder.length ? zOrder[zOrder.length - 1] : null;
}

function applyZ(): void {
  for (const w of wins) {
    const idx = zOrder.indexOf(w.def.id);
    w.root.style.zIndex = String(idx === -1 ? BASE_Z : BASE_Z + idx + 1);
    w.root.classList.toggle("kp-fw-focused", w.def.id === topId() && w.isOpen());
  }
}

export function makeWindow(desk: HTMLElement, def: WinDef): Win {
  const root = el("div", `kp-fw ${def.channel ?? ""}`.trim());
  root.style.display = "none";
  root.style.left = `${def.x}px`;
  root.style.top = `${def.y}px`;
  root.style.width = `min(${def.w}px, 96vw)`;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", def.title);

  const bar = el("div", `kp-fw-bar ${def.notched ? "kp-frame-notched-bar" : ""}`.trim());
  const titleEl = el("span", "kp-fw-title", def.title);
  bar.appendChild(titleEl);
  if (def.notched) {
    const chev = el("span", "kp-bar-chevron");
    chev.append(el("i"), el("i"), el("i"));
    bar.appendChild(chev);
  }
  /* only the close control lives in the bar: a pixel-drawn X, the one
   * button that actually works (min/max glyph decorations removed) */
  const closeBtn = el("button", "kp-fw-close");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", `Close ${def.title}`);
  closeBtn.appendChild(el("i"));
  bar.appendChild(closeBtn);

  const body = el("div", "kp-fw-body");
  root.append(bar, body);
  desk.appendChild(root);

  let openFlag = false;

  const focus = () => {
    if (!openFlag) return;
    const wasTop = topId() === def.id;
    zOrder = [...zOrder.filter((x) => x !== def.id), def.id];
    applyZ();
    if (!wasTop) {
      root.classList.remove("kp-fw-refocus");
      void root.offsetWidth;
      root.classList.add("kp-fw-refocus");
      setTimeout(() => root.classList.remove("kp-fw-refocus"), 240);
      play("winFocus");
    }
    onLayoutChange?.();
  };

  const open = () => {
    if (openFlag) {
      focus();
      return;
    }
    openFlag = true;
    root.style.display = "flex";
    root.style.animation = "none";
    void root.offsetWidth;
    root.style.animation = "";
    zOrder = [...zOrder.filter((x) => x !== def.id), def.id];
    applyZ();
    play("winOpen");
    onLayoutChange?.();
  };

  const close = () => {
    if (!openFlag) return;
    openFlag = false;
    root.style.display = "none";
    zOrder = zOrder.filter((x) => x !== def.id);
    applyZ();
    play("winClose");
    onLayoutChange?.();
  };

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    close();
  });

  // focus on any pointerdown inside (refocus pulse only when not already top)
  root.addEventListener("pointerdown", () => {
    if (topId() !== def.id) focus();
  });

  // title-bar drag with the shipped clamp behavior
  let drag: { pointerId: number; dx: number; dy: number } | null = null;
  bar.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).closest(".kp-fw-close")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    bar.setPointerCapture(e.pointerId);
    drag = { pointerId: e.pointerId, dx: e.clientX - root.offsetLeft, dy: e.clientY - root.offsetTop };
    root.classList.add("kp-fw-dragging");
  });
  bar.addEventListener("pointermove", (e) => {
    if (!drag || drag.pointerId !== e.pointerId) return;
    const parentW = desk.clientWidth;
    const parentH = desk.clientHeight;
    const barH = bar.offsetHeight;
    const w = root.offsetWidth;
    const x = Math.min(Math.max(e.clientX - drag.dx, TITLE_MIN_VISIBLE - w), parentW - TITLE_MIN_VISIBLE);
    const y = Math.min(Math.max(e.clientY - drag.dy, 0), parentH - Math.min(barH, TITLE_MIN_VISIBLE));
    root.style.left = `${x}px`;
    root.style.top = `${y}px`;
    onLayoutChange?.();
  });
  const endDrag = (e: PointerEvent) => {
    if (!drag || drag.pointerId !== e.pointerId) return;
    drag = null;
    root.classList.remove("kp-fw-dragging");
  };
  bar.addEventListener("pointerup", endDrag);
  bar.addEventListener("pointercancel", endDrag);

  const win: Win = { def, root, bar, body, titleEl, open, close, focus, isOpen: () => openFlag };
  wins.push(win);
  return win;
}
