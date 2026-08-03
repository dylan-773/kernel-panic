import { el, nodes, datarows, chip, pxIcon, PX_ICONS, kpMark, ticks } from "../_shared/ui";
import { play, unlock } from "../_shared/sound";

/**
 * KP/OS desktop shell, v3 instrument-panel study
 * (cycle ux-2026-07-31-desktop-dive; spec pipeline/proposals/ux-agent.json
 * item kpos-desktop-v3).
 *
 * The v2 shell's content survives: boot, login, wallpaper furniture, the
 * eight app icons, ticker, start menu, drag-only window chrome. What
 * changes is the system underneath: colour is the eight role tokens (the
 * SCHEME switch replaces HUE), the CRT is six glass layers over the stage,
 * decorative motion is cut, the strain chip becomes the desktop's one alarm,
 * and the stage is a real-resolution desk scaled to fit so all three
 * supported viewports are reviewable.
 *
 * Review round 3 retires the Windows aesthetic: the left icon column and
 * the bottom taskbar are gone. The icons live in a centered bottom DOCK
 * (launcher + running-window indicator; clicking a running app's icon
 * surfaces its window), system status rides a slim top strip with the
 * ticker crawling its middle, and a plain window open lands CENTERED on
 * the desk. Only the tiling proof pins explicit coordinates.
 *
 * Window BODIES are out of scope this cycle (each panel's own study owns its
 * content); windows here are chrome + a ghost body stating its footprint.
 * The old kpos-desktop demo remains the review-site embed host; porting this
 * skin onto that host is integration work, recorded in NOTES.md.
 */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const root = document.getElementById("root")!;
const stage = document.getElementById("stage")!;

/* ================= run state (transcribed from the shared mock, data.ts) ================= */

const FINAL_DAY = 10;

const meta = {
  runCount: 7,
  stats: { runsWon: 0, divesCleared: 23, divesLost: 6, scans: 41 },
};

interface RunView {
  active: boolean;
  runNumber: number;
  day: number;
  strain: number;
  credits: number;
}

/* the shared day-4 mock run state, and the no-run idle state */
const MIDRUN: RunView = { active: true, runNumber: 7, day: 4, strain: 62, credits: 210 };
const IDLE: RunView = { active: false, runNumber: 7, day: 1, strain: 100, credits: 0 };

/* the alarm band: strain DEPLETES to zero (run-reducer.ts), so risk is the
 * LOW band, <= 35 per loadout-eva. The shipped taskbar's > 70 check is an
 * inversion, flagged in the spec's notes for a source fix at integration. */
const STRAIN_ALARM_AT = 35;
const STRAINED_VALUE = 28;

let run: RunView = MIDRUN;
let strained = false;

function strainNow(): number {
  return strained ? STRAINED_VALUE : run.strain;
}

/* ================= scale-aware window manager (wm.ts, adapted) ================= */

interface WinDef {
  id: string;
  title: string;
  /** explicit spawn point (the tiling proof pins these); omitted = a
   * plain open, which lands centered on the desk */
  x?: number;
  y?: number;
  w: number;
  /** explicit total frame height (the tiling proof pins these) */
  h?: number;
  notched?: boolean;
}

interface Win {
  def: WinDef;
  root: HTMLElement;
  body: HTMLElement;
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

const TITLE_MIN_VISIBLE = 40;
const BASE_Z = 100;
let scaleK = 1;
/* mirrors the stage's chrome tokens (review round 3): the top status
 * strip (--ds-top-h) and the dock zone (--ds-dock-zone). Under the glass
 * both grow so their content sits clear of the bezel falloff. */
let crtOn = true;

function topStripH(): number {
  return crtOn ? 52 : 40;
}

function dockZoneH(): number {
  /* mirrors --ds-dock-glyph: clamp(36px, 6cqb, 60px) and
   * --ds-dock-zone: calc(glyph + 46px + --ds-edge-b + 10px) */
  const glyph = Math.max(36, Math.min(60, VP.h * 0.06));
  return glyph + 46 + (crtOn ? 18 : 6) + 10;
}

function usableDeskH(): number {
  return VP.h - topStripH() - dockZoneH();
}

/* review round 3: a plain open lands CENTERED on the desk. Only windows
 * carrying explicit coordinates (the tiling proof) place at them; both
 * kinds still clamp inside the desk between strip and dock. */
function sizeToDesk(w: Win): { width: number; curH: number; usable: number } {
  const usable = usableDeskH();
  const width = Math.min(w.def.w, VP.w - 16);
  w.root.style.width = `${width}px`;
  let h = w.def.h;
  if (h) {
    h = Math.min(h, usable - 12);
    w.root.style.height = `${h}px`;
  }
  const curH = h ?? Math.min(w.root.offsetHeight || 200, usable - 12);
  return { width, curH, usable };
}

function placeWindow(w: Win): void {
  const { width, curH, usable } = sizeToDesk(w);
  if (w.def.x != null && w.def.y != null) {
    const x = Math.max(0, Math.min(w.def.x, VP.w - width - 8));
    const y = Math.max(4, Math.min(w.def.y, Math.max(4, usable - curH - 6)));
    w.root.style.left = `${x}px`;
    w.root.style.top = `${y}px`;
  } else {
    w.root.style.left = `${Math.round((VP.w - width) / 2)}px`;
    w.root.style.top = `${Math.max(4, Math.round((usable - curH) / 2))}px`;
  }
}

/* re-clamp keeps whatever position a window holds (dragged or centered)
 * inside the desk when the chrome bands change size (CRT switch) */
function clampToDesk(w: Win): void {
  const { width, curH, usable } = sizeToDesk(w);
  const x = Math.max(0, Math.min(w.root.offsetLeft, VP.w - width - 8));
  const y = Math.max(4, Math.min(w.root.offsetTop, Math.max(4, usable - curH - 6)));
  w.root.style.left = `${x}px`;
  w.root.style.top = `${y}px`;
}

function reclampAll(): void {
  for (const w of wins) if (w.isOpen()) clampToDesk(w);
}

let wins: Win[] = [];
let zOrder: string[] = [];
let onDeskChange: (() => void) | null = null;

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

function makeWindow(desk: HTMLElement, def: WinDef): Win {
  const winRoot = el("div", "kp-fw");
  winRoot.style.display = "none";
  winRoot.style.width = `${def.w}px`;
  if (def.h) winRoot.style.height = `${def.h}px`;
  winRoot.setAttribute("role", "dialog");
  winRoot.setAttribute("aria-label", def.title);

  const bar = el("div", `kp-fw-bar ${def.notched ? "kp-frame-notched-bar" : ""}`.trim());
  bar.appendChild(el("span", "kp-fw-title", def.title));
  if (def.notched) {
    const chev = el("span", "kp-bar-chevron");
    chev.append(el("i"), el("i"), el("i"));
    bar.appendChild(chev);
  }
  const closeBtn = el("button", "kp-fw-close");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", `Close ${def.title}`);
  closeBtn.appendChild(el("i"));
  bar.appendChild(closeBtn);

  const body = el("div", "kp-fw-body");
  winRoot.append(bar, body);
  desk.appendChild(winRoot);

  let openFlag = false;

  const focus = () => {
    if (!openFlag) return;
    const wasTop = topId() === def.id;
    zOrder = [...zOrder.filter((x) => x !== def.id), def.id];
    applyZ();
    if (!wasTop) {
      winRoot.classList.remove("kp-fw-refocus");
      void winRoot.offsetWidth;
      winRoot.classList.add("kp-fw-refocus");
      setTimeout(() => winRoot.classList.remove("kp-fw-refocus"), 240);
      play("winFocus");
    }
  };

  const open = () => {
    if (openFlag) {
      /* the dock's surface-on-click contract: an already open window
       * raises to the top of the z-order instead of re-opening */
      focus();
      return;
    }
    openFlag = true;
    winRoot.style.display = "flex";
    winRoot.style.animation = "none";
    void winRoot.offsetWidth;
    winRoot.style.animation = "";
    placeWindow(win);
    zOrder = [...zOrder.filter((x) => x !== def.id), def.id];
    applyZ();
    play("winOpen");
    onDeskChange?.();
  };

  const close = () => {
    if (!openFlag) return;
    openFlag = false;
    winRoot.style.display = "none";
    zOrder = zOrder.filter((x) => x !== def.id);
    applyZ();
    play("winClose");
    onDeskChange?.();
  };

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    close();
  });
  winRoot.addEventListener("pointerdown", () => {
    if (topId() !== def.id) focus();
  });

  /* title-bar drag, divided by the stage scale so the window tracks the
   * pointer inside the transform-scaled desk */
  let drag: { pointerId: number; dx: number; dy: number } | null = null;
  bar.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).closest(".kp-fw-close")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    bar.setPointerCapture(e.pointerId);
    drag = {
      pointerId: e.pointerId,
      dx: e.clientX / scaleK - winRoot.offsetLeft,
      dy: e.clientY / scaleK - winRoot.offsetTop,
    };
    winRoot.classList.add("kp-fw-dragging");
  });
  bar.addEventListener("pointermove", (e) => {
    if (!drag || drag.pointerId !== e.pointerId) return;
    const parentW = desk.clientWidth;
    const parentH = desk.clientHeight;
    const barH = bar.offsetHeight;
    const w = winRoot.offsetWidth;
    const x = Math.min(Math.max(e.clientX / scaleK - drag.dx, TITLE_MIN_VISIBLE - w), parentW - TITLE_MIN_VISIBLE);
    const y = Math.min(Math.max(e.clientY / scaleK - drag.dy, 0), parentH - Math.min(barH, TITLE_MIN_VISIBLE));
    winRoot.style.left = `${x}px`;
    winRoot.style.top = `${y}px`;
  });
  const endDrag = (e: PointerEvent) => {
    if (!drag || drag.pointerId !== e.pointerId) return;
    drag = null;
    winRoot.classList.remove("kp-fw-dragging");
  };
  bar.addEventListener("pointerup", endDrag);
  bar.addEventListener("pointercancel", endDrag);

  const win: Win = { def, root: winRoot, body, open, close, isOpen: () => openFlag };
  wins.push(win);
  return win;
}

/* a ghost body: chrome is this cycle's scope, the content belongs to each
 * panel's own study */
function ghostBody(win: Win, note: string): void {
  const g = el("div", "ds-ghost");
  g.appendChild(el("strong", "", `${win.def.title} BODY`));
  g.appendChild(el("p", "", note));
  const foot = win.def.h
    ? `FOOTPRINT ${win.def.w} x ${win.def.h}`
    : `FOOTPRINT ${win.def.w} WIDE`;
  g.appendChild(el("strong", "", foot));
  win.body.appendChild(g);
}

/* ================= helpers ================= */

function seeded(id: string): () => number {
  let s = 0;
  for (let i = 0; i < id.length; i++) s = (s * 31 + id.charCodeAt(i)) >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s;
  };
}

function kpLockup(cell: number, wordPx: number): HTMLElement {
  const wrap = el("div", "kp-lockup");
  wrap.appendChild(kpMark(cell));
  const word = el("pre", "kp-lockup-word", "KERNEL\nPANIC");
  word.style.fontSize = `${wordPx}px`;
  wrap.appendChild(word);
  return wrap;
}

/* ================= BOOT ================= */

function showBoot(auto = true): void {
  root.textContent = "";
  const boot = el("div", "kp-boot");
  boot.appendChild(el("i", "kp-boot-dither"));
  const inner = el("div", "kp-boot-inner");
  ticks(inner);
  inner.appendChild(kpLockup(4, 26));
  /* shipped boot lines, name-free per lore ledger ruling 8 */
  const lines: Array<[string, "ok" | "hazard" | null]> = [
    ["REPAIR BENCH BIOS v9.2", null],
    ["KERNEL PANIC vDEMO desktop-v3", null],
    ["640K NEURAL BUFFER ... OK", "ok"],
    ["SIGNAL BUS ........... OK", "ok"],
    ["BACK ROOM LOCK ....... ENGAGED", "hazard"],
    ["MOUNTING SHOPFRONT ...", null],
  ];
  lines.forEach(([l, role], i) => {
    const p = el("p", "kp-boot-line");
    if (role) {
      const cut = l.lastIndexOf(" ");
      p.appendChild(document.createTextNode(l.slice(0, cut + 1)));
      p.appendChild(el("span", role === "ok" ? "ds-ok" : "ds-hazard", l.slice(cut + 1)));
    } else {
      p.textContent = l;
    }
    p.style.animationDelay = REDUCED ? "0s" : `${0.15 + i * 0.22}s`;
    inner.appendChild(p);
  });
  inner.appendChild(el("p", "kp-boot-cursor", "_"));
  boot.appendChild(inner);
  root.appendChild(boot);

  const done = () => {
    clearTimeout(t);
    showLogin();
    syncScreenRow("login");
  };
  const t = setTimeout(done, auto ? 1700 : 999999);
  boot.addEventListener("click", done, { once: true });
}

/* ================= LOGIN ================= */

function showLogin(): void {
  root.textContent = "";
  const login = el("div", "kp-login");
  const head = el("div", "kp-login-head");
  head.appendChild(kpLockup(7, 38));
  head.appendChild(el("p", "kp-login-sub", "KP/OS v9.2 - SELECT USER"));
  login.appendChild(head);
  login.appendChild(el("p", "kp-build-stamp", "BUILD desktop-v3 demo"));

  const slots = el("div", "kp-login-slots");

  const occupied = (slotN: number, rows: { label: string; value: string }[], dim: string) => {
    const wrap = el("div", "kp-slotwrap");
    wrap.style.animationDelay = `${(slotN - 1) * 120}ms`;
    const card = el("button", "kp-slot");
    card.type = "button";
    nodes(card);
    card.appendChild(el("span", "kp-slot-avatar", ">_"));
    card.appendChild(el("strong", "", `USER 0${slotN}`));
    card.appendChild(datarows(rows));
    card.appendChild(el("span", "kp-slot-line kp-slot-dim", dim));
    card.addEventListener("click", () => beginLogin(slotN));
    wrap.appendChild(card);
    return wrap;
  };

  slots.appendChild(occupied(1, [
    { label: "ATTEMPT", value: String(meta.runCount) },
    { label: "DAY", value: String(MIDRUN.day) },
    { label: "STRAIN", value: String(MIDRUN.strain) },
  ], "back room sealed"));
  slots.appendChild(occupied(2, [
    { label: "ATTEMPTS", value: String(meta.runCount) },
  ], "back room sealed"));

  const emptyWrap = el("div", "kp-slotwrap");
  emptyWrap.style.animationDelay = "240ms";
  const empty = el("button", "kp-slot kp-slot-empty");
  empty.type = "button";
  empty.appendChild(el("span", "kp-slot-plus", "+"));
  empty.appendChild(el("strong", "", "NEW USER"));
  empty.appendChild(el("span", "kp-slot-line", "empty slot"));
  empty.addEventListener("click", () => beginLogin(3));
  emptyWrap.appendChild(empty);
  slots.appendChild(emptyWrap);

  login.appendChild(slots);

  const term = el("div", "kp-login-term");
  login.appendChild(term);
  root.appendChild(login);

  const PASSWORD = "**********";
  const beginLogin = (slotN: number) => {
    play("press");
    slots.style.display = "none";
    const user = `user_0${slotN}`;
    let typedUser = REDUCED ? user.length : 0;
    let typedPass = REDUCED ? PASSWORD.length : 0;
    const step = () => {
      term.textContent = "";
      const line1 = el("p");
      line1.appendChild(el("span", "kp-login-label", "USERNAME: "));
      line1.appendChild(document.createTextNode(user.slice(0, typedUser)));
      if (typedUser < user.length) line1.appendChild(el("span", "kp-boot-cursor", "_"));
      term.appendChild(line1);
      if (typedUser >= user.length) {
        const line2 = el("p");
        line2.appendChild(el("span", "kp-login-label", "PASSWORD: "));
        line2.appendChild(document.createTextNode(PASSWORD.slice(0, typedPass)));
        if (typedPass < PASSWORD.length) line2.appendChild(el("span", "kp-boot-cursor", "_"));
        term.appendChild(line2);
      }
      if (typedUser < user.length) {
        typedUser++;
        play("tick");
        setTimeout(step, 70);
      } else if (typedPass < PASSWORD.length) {
        typedPass++;
        play("tick");
        setTimeout(step, 45);
      } else {
        play("claimTick");
        term.appendChild(el("p", "kp-login-granted", "ACCESS GRANTED. WELCOME BACK."));
        setTimeout(() => {
          run = slotN === 1 ? MIDRUN : IDLE;
          showDesktop(slotN, slotN === 1 ? "midrun" : "idle");
          syncScreenRow(slotN === 1 ? "midrun" : "idle");
        }, 900);
      }
    };
    step();
  };
}

/* ================= DESKTOP ================= */

type DeskMode = "idle" | "midrun" | "tiled";

let paintChips: (() => void) | null = null;
let currentSlot = 1;

function showDesktop(slotN: number, mode: DeskMode): void {
  currentSlot = slotN;
  root.textContent = "";
  wins = [];
  zOrder = [];
  const os = el("div", "kp-os");

  /* wallpaper + furniture */
  const wall = el("div", "kp-wallpaper");
  wall.appendChild(el("i", "kp-dither"));
  const reg = el("div", "kp-wallreg");
  for (let c = 0; c < 4; c++) reg.appendChild(el("i"));
  wall.appendChild(reg);
  const poster = makeWallPoster();
  poster.classList.add("kp-slot-anim");
  poster.style.animationDelay = "260ms";
  wall.appendChild(poster);
  const scope = makeWallScope();
  scope.classList.add("kp-slot-anim");
  scope.style.animationDelay = "340ms";
  wall.appendChild(scope);
  os.appendChild(wall);

  const desk = el("main");
  desk.style.position = "absolute";
  desk.style.inset = "var(--ds-top-h, 40px) 0 var(--ds-dock-zone, 110px) 0";
  os.appendChild(desk);

  /* top status strip (review round 3): the old taskbar's system status,
   * rehomed to the top edge. Mark + chips left, ticker crawling the
   * middle, ABANDON and SND right. The strain chip stays on the desk at
   * all times. */
  const bar = el("header", "kp-taskbar ds-topbar");
  const mark = el("button", "kp-task-mark");
  mark.type = "button";
  mark.appendChild(kpMark(2, true));
  mark.appendChild(document.createTextNode("KP/OS"));
  bar.appendChild(mark);

  const chips = el("div", "kp-task-chips");
  paintChips = () => {
    chips.textContent = "";
    chips.appendChild(chip("USER", `0${slotN}`));
    const day = Math.min(run.day, FINAL_DAY);
    const pct = Math.round((day / FINAL_DAY) * 100);
    chips.appendChild(chip("DAY", `${day}/10 ${pct}%`));
    const strainChip = chip("STRAIN", String(strainNow()));
    strainChip.classList.add("ds-strain");
    if (strainNow() <= STRAIN_ALARM_AT) {
      strainChip.classList.add("ds-strain-alarm");
      strainChip.appendChild(el("i", "ds-riskflash"));
    }
    chips.appendChild(strainChip);
    chips.appendChild(chip("CR", String(run.credits)));
  };
  paintChips();
  bar.appendChild(chips);

  /* ticker: labels name (r-note), values read (r-line dimmed); rides the
   * strip's middle as its own crawl container */
  const ticker = el("div", "kp-ticker");
  const tickerText = el("span");
  const stats: Array<[string, number]> = [
    ["ATTEMPTS", meta.runCount],
    ["MACHINE BEATEN", meta.stats.runsWon],
    ["JOBS CLEARED", meta.stats.divesCleared],
    ["DIVES LOST", meta.stats.divesLost],
    ["SCANS RUN", meta.stats.scans],
  ];
  stats.forEach(([l, v], i) => {
    if (i > 0) tickerText.appendChild(document.createTextNode(" // "));
    tickerText.appendChild(document.createTextNode(`${l} `));
    tickerText.appendChild(el("em", "ds-tickval", String(v)));
  });
  ticker.appendChild(tickerText);
  bar.appendChild(ticker);

  const abandonBtn = el("button", "kp-task-btn kp-task-danger", "ABANDON");
  abandonBtn.type = "button";
  bar.appendChild(abandonBtn);
  const sndBtn = el("button", "kp-task-btn", "SND ON");
  sndBtn.type = "button";
  sndBtn.addEventListener("click", () => {
    play("press");
    sndBtn.textContent = sndBtn.textContent === "SND ON" ? "SND OFF" : "SND ON";
  });
  bar.appendChild(sndBtn);
  os.appendChild(bar);

  /* the dock (review round 3): the eight app icons, centered on the
   * bottom edge. Launcher AND running-window indicator: a running app's
   * icon carries the underline plate, and clicking it surfaces the open
   * window instead of re-opening it. */
  const dock = el("nav", "ds-dock");
  dock.setAttribute("aria-label", "Application dock");
  const iconDefs: Array<[string, string, number | undefined, WinDef]> = [
    ["INBOX", "inbox", mode === "midrun" ? 2 : undefined, { id: "inbox", title: "INBOX", w: 1210 }],
    ["LOADOUT.CFG", "loadout", undefined, { id: "loadout", title: "LOADOUT.CFG", w: 860, h: 654 }],
    ["SOLDER.BAY", "solder", undefined, { id: "solder", title: "SOLDER.BAY", w: 1060 }],
    ["REPAIR.LOG", "report", undefined, { id: "report", title: "REPAIR.LOG", w: 1150 }],
    ["DAD.LOG", "journal", undefined, { id: "journal", title: "DAD.LOG", w: 1150 }],
    ["MANUAL.TXT", "manual", undefined, { id: "manual", title: "MANUAL.TXT", w: 760 }],
    ["LEDGER.LOG", "ledger", undefined, { id: "ledger", title: "LEDGER.LOG", w: 760 }],
    ["DARKNET.LNK", "darknet", undefined, { id: "darknet", title: "DARKNET.LNK", w: 680, notched: true }],
  ];
  const builtWins = new Map<string, Win>();
  const dockButtons = new Map<string, HTMLButtonElement>();
  iconDefs.forEach(([label, key, badge, def], i) => {
    const b = el("button", "ds-dock-icon") as HTMLButtonElement;
    b.type = "button";
    const glyph = el("span", "ds-dock-glyph");
    glyph.appendChild(pxIcon(PX_ICONS[key], 3));
    if (badge && badge > 0) glyph.appendChild(el("span", "kp-dicon-badge", String(badge)));
    b.appendChild(glyph);
    b.appendChild(el("span", "ds-dock-label", label));
    b.appendChild(el("i", "ds-dock-run"));
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      play("press");
      let w = builtWins.get(def.id);
      if (!w) {
        w = makeWindow(desk, def);
        ghostBody(w, "Chrome ghost. This window's body lands with its own panel study.");
        builtWins.set(def.id, w);
      }
      w.open();
    });
    b.classList.add("kp-slot-anim");
    b.style.animationDelay = `${i * 50}ms`;
    dock.appendChild(b);
    dockButtons.set(def.id, b);
  });
  os.appendChild(dock);

  /* the idle-desk hero (spec: THE IDLE DESK GETS A REAL FOCAL ELEMENT)
   * plus the dock's running markers, both refreshed on any desk change */
  onDeskChange = () => {
    const anyOpen = wins.some((w) => w.isOpen());
    poster.classList.toggle("ds-idle-hero", !anyOpen);
    dockButtons.forEach((btn, id) => {
      const running = builtWins.get(id)?.isOpen() ?? false;
      btn.classList.toggle("ds-running", running);
      btn.setAttribute("aria-pressed", running ? "true" : "false");
    });
  };

  /* the desk mounts BEFORE any window opens: centering an auto-height
   * window needs live layout to measure it */
  root.appendChild(os);

  /* windows: chrome + ghost bodies. Plain opens (no x/y) land centered;
   * only the tiled pair pins coordinates, computed from the LIVE desk
   * (review round 2) so the proof holds on all three viewports. */
  const usable = usableDeskH();
  const tiledAW = Math.min(860, VP.w - 460 - 34);
  const tiledAH = Math.min(654, usable - 22);
  const tiledBX = 10 + tiledAW + 14;
  const tiledBW = Math.min(460, VP.w - tiledBX - 10);
  const tiledBH = Math.min(560, usable - 22);
  const defs: Record<DeskMode, Array<{ def: WinDef; note: string }>> = {
    idle: [],
    midrun: [
      {
        def: { id: "inbox", title: "INBOX", w: 1210 },
        note: "The day loop's front window, sitting where a plain open lands: centered. Content lands with its own panel study.",
      },
      {
        def: { id: "loadout", title: "LOADOUT.CFG", w: 860, h: 654 },
        note: "Chrome ghost at the loadout-eva study's measured 16:9 footprint, clamped to the desk between strip and dock. The real body is the LOADOUT.CFG (INSTRUMENT PANEL) study.",
      },
    ],
    tiled: [
      {
        def: { id: "loadout", title: "LOADOUT.CFG", x: 10, y: 14, w: tiledAW, h: tiledAH },
        note: "Tiling proof, window A: loadout-eva's measured footprint, clamped to this desk.",
      },
      {
        def: { id: "ledger", title: "LEDGER.LOG", x: tiledBX, y: 14, w: tiledBW, h: tiledBH },
        note: "Tiling proof, window B: LEDGER.LOG placeholder chrome at low density.",
      },
    ],
  };

  for (const d of defs[mode]) {
    const w = makeWindow(desk, d.def);
    builtWins.set(d.def.id, w);
    ghostBody(w, d.note);
    w.open();
  }

  /* start menu: HUE became SCHEME (the headline decision) */
  let menu: HTMLElement | null = null;
  const closeMenu = () => {
    menu?.remove();
    menu = null;
    mark.classList.remove("kp-task-mark-open");
  };
  mark.addEventListener("click", () => {
    play("press");
    if (menu) {
      closeMenu();
      return;
    }
    mark.classList.add("kp-task-mark-open");
    menu = el("div", "kp-startmenu");
    nodes(menu);
    menu.appendChild(el("span", "kp-startmenu-user", `USER 0${slotN}`));
    const item = (label: string, fn: (b: HTMLButtonElement) => void) => {
      const b = el("button", "", label) as HTMLButtonElement;
      b.type = "button";
      b.addEventListener("click", () => fn(b));
      menu!.appendChild(b);
    };
    item("MUSIC OFF", () => play("press"));
    item("TEST SOUND", () => play("claimTick"));
    item(`SCHEME: ${schemeLabel()}`, (b) => {
      cycleScheme();
      b.textContent = `SCHEME: ${schemeLabel()}`;
    });
    item("LOG OUT", () => {
      play("press");
      closeMenu();
      showLogin();
      syncScreenRow("login");
    });
    item("CLOSE", () => {
      play("press");
      closeMenu();
    });
    os.appendChild(menu);
  });

  /* abandon modal, shipped copy verbatim */
  abandonBtn.addEventListener("click", () => {
    play("press");
    const modal = el("div", "kp-modal");
    modal.setAttribute("role", "dialog");
    const box = el("div", "kp-modal-box");
    box.appendChild(el("h3", "", "ABANDON THIS RUN?"));
    box.appendChild(el("p", "",
      `This ends attempt ${run.runNumber} exactly like a loss. Kit tiers, augments, credits ` +
      "and patch pieces all reset for the next attempt. The journal and the ledger keep what " +
      "they already hold."));
    const actions = el("div", "kp-modal-actions");
    const keep = el("button", "kp-btn2 kp-btn2-ghost", "KEEP DIVING");
    keep.type = "button";
    keep.addEventListener("click", () => { play("press"); modal.remove(); });
    const yes = el("button", "kp-btn2 kp-btn2-primary kp-btn2-danger", "ABANDON");
    yes.type = "button";
    yes.addEventListener("click", () => { play("deny"); modal.remove(); });
    actions.append(keep, yes);
    box.appendChild(actions);
    modal.appendChild(box);
    os.appendChild(modal);
  });

  onDeskChange();
}

/* bottom-left dossier poster; carries the idle-desk hero pair */
function makeWallPoster(): HTMLElement {
  const poster = el("div", "kp-wallposter");
  poster.appendChild(el("span", "kp-wallposter-tag", "KP/OS v9.2 // REPAIR BENCH"));
  const emblem = el("div", "kp-wallposter-emblem");
  emblem.appendChild(kpMark(13));
  poster.appendChild(emblem);

  /* hero readout: only paints on the idle desk (.ds-idle-hero) */
  const hero = el("div", "ds-heropair");
  const cellA = el("span");
  cellA.appendChild(el("span", "", "ATTEMPT") as HTMLElement);
  const pairWrap = (label: string, val: string) => {
    const cell = el("span");
    cell.appendChild(el("span", "", label));
    const b = el("b", "", val);
    cell.appendChild(b);
    return cell;
  };
  void cellA;
  hero.appendChild(pairWrap("ATTEMPT", `0${meta.runCount}`));
  hero.appendChild(pairWrap("DAY", `0${Math.min(run.day, FINAL_DAY)}`));
  poster.appendChild(hero);

  poster.appendChild(el("div", "kp-wallposter-word", "KERNEL PANIC"));
  const rowEl = el("div", "kp-wallposter-row");
  rowEl.appendChild(el("span", "", `ATTEMPT 0${meta.runCount}`));
  rowEl.appendChild(el("span", "", `DAY 0${Math.min(run.day, FINAL_DAY)}`));
  rowEl.appendChild(el("span", "", "BACK ROOM SEALED"));
  poster.appendChild(rowEl);
  return poster;
}

/* bottom-right telemetry: the trace renders ONCE and holds still (the roll
 * is cut per law 7); the OK pip and the clock stay live */
function makeWallScope(): HTMLElement {
  const SVGNS = "http://www.w3.org/2000/svg";
  const wrap = el("div", "kp-wallscope");
  const box = el("div", "kp-wallscope-box");
  const tag = el("div", "kp-wallscope-tag");
  tag.appendChild(el("span", "", "// SIGNAL BUS _"));
  const ok = el("span", "ds-ok", "OK");
  ok.appendChild(el("i", "kp-wallscope-pip"));
  tag.appendChild(ok);
  box.appendChild(tag);
  const svg = document.createElementNS(SVGNS, "svg");
  const W = 352;
  const H = 84;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("height", String(H));
  const grid = (x1: number, y1: number, x2: number, y2: number) => {
    const l = document.createElementNS(SVGNS, "line");
    l.setAttribute("x1", String(x1));
    l.setAttribute("y1", String(y1));
    l.setAttribute("x2", String(x2));
    l.setAttribute("y2", String(y2));
    l.setAttribute("class", "grid");
    svg.appendChild(l);
  };
  for (let x = 0; x <= W; x += 22) grid(x, 0, x, H);
  for (let y = 0; y <= H; y += 21) grid(0, y, W, y);
  const next = seeded("kp-desk-scope");
  const jitter: number[] = [];
  for (let i = 0; i <= W / 8; i++) jitter.push(((next() % 100) / 100 - 0.5) * 8);
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 8) {
    const base = 42 + Math.sin((x / W) * Math.PI * 6) * 18;
    pts.push(`${x},${Math.round(base + jitter[x / 8])}`);
  }
  const poly = document.createElementNS(SVGNS, "polyline");
  poly.setAttribute("points", pts.join(" "));
  poly.setAttribute("shape-rendering", "crispEdges");
  svg.appendChild(poly);
  box.appendChild(svg);
  wrap.appendChild(box);

  const clockRow = el("div", "kp-wallclock");
  clockRow.appendChild(el("span", "", "BENCH CLOCK"));
  const clockVal = el("em", "", "");
  clockRow.appendChild(clockVal);
  wrap.appendChild(clockRow);
  let tsec = 22 * 3600 + 41 * 60 + 7;
  const paintClock = () => {
    const h = String(Math.floor(tsec / 3600)).padStart(2, "0");
    const m = String(Math.floor((tsec % 3600) / 60)).padStart(2, "0");
    const s = String(tsec % 60).padStart(2, "0");
    const text = `DAY 0${Math.min(run.day, FINAL_DAY)} ${h}:${m}:${s}`;
    if (clockVal.textContent !== text) clockVal.textContent = text;
  };
  paintClock();
  setInterval(() => {
    tsec = (tsec + 1) % 86400;
    paintClock();
  }, 1000);

  const hex = el("div", "kp-wallhex");
  const hnext = seeded("kp-desk-hex");
  for (let r = 0; r < 6; r++) {
    const groups: string[] = [];
    for (let g = 0; g < 3; g++) groups.push((hnext() % 0xffff).toString(16).toUpperCase().padStart(4, "0"));
    hex.appendChild(el("span", "", groups.join(" ")));
  }
  wrap.appendChild(hex);
  return wrap;
}

/* ================= demo rig ================= */

function radioRow(rowId: string, opts: Array<{ id: string; label: string }>, initial: string, onPick: (o: { id: string; label: string }) => void): void {
  const row = document.getElementById(rowId)!;
  row.textContent = "";
  for (const o of opts) {
    const b = el("button", o.id === initial ? "rig-on" : "", o.label);
    b.addEventListener("click", () => {
      row.querySelectorAll("button").forEach((x) => (x.className = ""));
      b.className = "rig-on";
      onPick(o);
    });
    row.appendChild(b);
  }
}

/* SCHEME: DEFAULT is the attribute-unset collapse back onto the v2 accent */
const SCHEMES = ["default", "nerv", "tokyo"] as const;
type Scheme = (typeof SCHEMES)[number];
let scheme: Scheme = "nerv";

function setScheme(s: Scheme): void {
  scheme = s;
  if (s === "default") delete document.documentElement.dataset.scheme;
  else document.documentElement.dataset.scheme = s;
  const row = document.getElementById("schemerow")!;
  row.querySelectorAll("button").forEach((b, i) => {
    b.className = SCHEMES[i] === s ? "rig-on" : "";
  });
}

function schemeLabel(): string {
  return scheme === "default" ? "DEFAULT" : scheme === "nerv" ? "NERV" : "TOKYO NIGHT";
}

function cycleScheme(): void {
  play("pageFlip");
  setScheme(SCHEMES[(SCHEMES.indexOf(scheme) + 1) % SCHEMES.length]);
}

/* CRT: layers are added and REMOVED, never faded */
const glass = document.getElementById("glass")!;
const glassLayers = Array.prototype.slice.call(glass.children) as HTMLElement[];
function setCrt(mode: "flat" | "off"): void {
  stage.classList.toggle("crt-on", mode !== "off");
  glass.textContent = "";
  if (mode !== "off") glassLayers.forEach((l) => glass.appendChild(l));
  crtOn = mode !== "off";
  reclampAll();
  measure();
}

/* VIEWPORT: true-resolution stage scaled to fit the reviewer's browser */
const VIEWPORTS = [
  { id: "169", label: "16:9 1366x768", w: 1366, h: 768 },
  { id: "219", label: "21:9 2560x1080", w: 2560, h: 1080 },
  { id: "laptop", label: "LAPTOP 1280x800", w: 1280, h: 800 },
];
let VP = VIEWPORTS[0];

function fit(): void {
  /* mirrors the body padding: 16 left + 316 right keeps the stage clear
   * of the fixed demo rig */
  const availW = Math.max(320, window.innerWidth - 332);
  const availH = Math.max(320, window.innerHeight - 90);
  scaleK = Math.min(1, availW / VP.w, availH / VP.h);
  const fitEl = document.getElementById("fit")!;
  const wrapEl = document.getElementById("fitwrap")!;
  fitEl.style.transform = `scale(${scaleK})`;
  wrapEl.style.width = `${Math.round(VP.w * scaleK)}px`;
  wrapEl.style.height = `${Math.round(VP.h * scaleK)}px`;
}

function measure(): void {
  fit();
  const meas = document.getElementById("meas")!;
  meas.innerHTML = "";
  meas.appendChild(document.createTextNode(`DESK ${VP.w}x${VP.h} / usable ${Math.round(usableDeskH())}px between strip and dock`));
}

function applyViewport(v: typeof VIEWPORTS[number]): void {
  VP = v;
  stage.style.width = `${v.w}px`;
  stage.style.height = `${v.h}px`;
  fit();
  measure();
  if (screenId === "idle" || screenId === "midrun" || screenId === "tiled") {
    setScreen(screenId);
  }
}

/* SCREEN */
type ScreenId = "boot" | "login" | "idle" | "midrun" | "tiled";
let screenId: ScreenId = "midrun";

function setScreen(s: ScreenId): void {
  screenId = s;
  if (s === "boot") showBoot();
  else if (s === "login") showLogin();
  else {
    run = s === "idle" ? IDLE : MIDRUN;
    showDesktop(s === "idle" ? 2 : 1, s);
  }
}

function syncScreenRow(s: ScreenId): void {
  screenId = s;
  const row = document.getElementById("screenrow")!;
  const ids: ScreenId[] = ["boot", "login", "idle", "midrun", "tiled"];
  row.querySelectorAll("button").forEach((b, i) => {
    b.className = ids[i] === s ? "rig-on" : "";
  });
}

/* ================= wire the rig, go ================= */

document.addEventListener("pointerdown", () => unlock(), { once: true });

radioRow("schemerow", [
  { id: "default", label: "DEFAULT" },
  { id: "nerv", label: "NERV" },
  { id: "tokyo", label: "TOKYO NIGHT" },
], "nerv", (o) => setScheme(o.id as Scheme));

radioRow("crtrow", [
  { id: "flat", label: "FLAT" },
  { id: "off", label: "OFF" },
], "flat", (o) => setCrt(o.id as "flat" | "off"));

radioRow("vprow", VIEWPORTS.map((v) => ({ id: v.id, label: v.label })), "169", (o) => {
  applyViewport(VIEWPORTS.find((v) => v.id === o.id)!);
});

radioRow("screenrow", [
  { id: "boot", label: "BOOT" },
  { id: "login", label: "LOGIN" },
  { id: "idle", label: "DESK IDLE" },
  { id: "midrun", label: "DESK MID-RUN" },
  { id: "tiled", label: "DESK TILED" },
], "midrun", (o) => setScreen(o.id as ScreenId));

radioRow("strainrow", [
  { id: "nominal", label: "NOMINAL" },
  { id: "strained", label: "STRAINED" },
], "nominal", (o) => {
  const wasArmed = strainNow() <= STRAIN_ALARM_AT;
  strained = o.id === "strained";
  const armed = strainNow() <= STRAIN_ALARM_AT;
  if (armed && !wasArmed) play("turnLost");
  paintChips?.();
});

document.getElementById("replayboot")!.addEventListener("click", () => {
  play("press");
  setScheme(scheme);
  showBoot();
  syncScreenRow("boot");
});

setScheme("nerv");
setCrt("flat");
applyViewport(VP);
setScreen("midrun");
window.addEventListener("resize", () => { fit(); measure(); });
