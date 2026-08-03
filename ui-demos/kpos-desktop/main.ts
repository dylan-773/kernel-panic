import { el, ticks, nodes, datarows, chip, pxIcon, PX_ICONS, kpMark } from "../_shared/ui";
import { run, meta, on, emit, FINAL_DAY, openJobs } from "./data";
import { play, unlock } from "../_shared/sound";
import { makeWindow, Win } from "./wm";
import { makeEmbed, embedDocs, EMBED_PAD } from "./w-embed";
import { buildShopfront, Flow } from "./w-shopfront";
import { buildManual } from "./w-manual";
import { buildLedger } from "./w-ledger";
import { buildDadlog } from "./w-dadlog";
import { buildDarknet } from "./w-darknet";

/**
 * KP/OS shell redesign demo (ux-2026-07-28-kpos-redesign): boot -> login ->
 * desktop, taskbar chips, start-menu dossier, CSS/SVG wallpaper with the
 * ticker strip. The older kp-fw windows (MANUAL.TXT, DAD.LOG, LEDGER.LOG,
 * DARKNET.LNK) and the legacy JOBS.QUE flow window keep the v2 chrome.
 *
 * This page is also the REVIEW HARNESS: every study in ui-demos/manifest.json
 * that carries `.term-bar` chrome can be mounted here as a real window,
 * embedded VERBATIM via w-embed.ts. The manifest decides which ones the
 * desktop opens with; `?mount=<id>,<id>` adds any other submission, which is
 * how the review site previews a demo in context. The review deck drives all
 * of it through `window.kpDesktop`.
 */

const root = document.getElementById("root")!;

/* ================= submissions ================= */

/** A declarative option-forcing step, the same shape the review deck applies. */
interface Hook {
  click?: string[];
  attr?: { sel: string; name: string; value: string };
  call?: string;
  args?: unknown[];
  /** onOpen only: run on the first open and never again */
  once?: boolean;
}

interface MountDef {
  id: string;
  title: string;
  src: string;
  icon?: string;
  /** the study window's own width; the halo padding is added on mount */
  frameW: number;
  x: number;
  y: number;
  /** native window this study supersedes, so the desk shows one of each */
  replaces?: string | null;
  onReady?: Hook[];
  onOpen?: Hook[];
  default: boolean;
}

/** What the shipped desktop mounts when the manifest cannot be read. */
const FALLBACK: MountDef[] = [
  { id: "inbox", title: "INBOX", src: "../inbox/index.html", icon: "inbox", frameW: 1210, x: 140, y: 30, default: true },
  {
    id: "loadout", title: "LOADOUT.CFG", src: "../loadout/index.html", icon: "loadout",
    frameW: 1040, x: 100, y: -30, default: true,
    onReady: [{ click: ["#ditherrow button:nth-of-type(2)"] }],
    onOpen: [{ click: ["#replay"] }],
  },
  {
    id: "solder", title: "SOLDER.BAY", src: "../solder/index.html", icon: "solder",
    frameW: 1060, x: 180, y: 24, default: true,
    onOpen: [{ click: ["#pouchrow button:nth-of-type(1)"], once: true }],
  },
  {
    id: "repair-log", title: "REPAIR.LOG", src: "../repair-log/index.html", icon: "report",
    frameW: 1150, x: 100, y: 10, default: true,
    onOpen: [{ click: ["#scenrow .rig-on", "#scenrow button"] }],
  },
];

let SUBMISSIONS: MountDef[] = FALLBACK;

async function loadSubmissions(): Promise<void> {
  try {
    const res = await fetch("../manifest.json");
    if (!res.ok) return;
    const m = (await res.json()) as { demos: Array<Record<string, never>> };
    const next = (m.demos as unknown as Array<{
      id: string; title: string; dir: string; entry: string;
      desktop: (MountDef & { mountable: boolean }) | null;
    }>)
      .filter((d) => d.desktop && d.desktop.mountable)
      .map((d) => ({
        id: d.id,
        title: d.title,
        src: `../${d.dir}/${d.entry}`,
        icon: d.desktop!.icon,
        frameW: d.desktop!.frameW,
        x: d.desktop!.x,
        y: d.desktop!.y,
        replaces: d.desktop!.replaces ?? null,
        onReady: d.desktop!.onReady,
        onOpen: d.desktop!.onOpen,
        default: d.desktop!.default === true,
      }));
    if (next.length) SUBMISSIONS = next;
  } catch {
    /* opened straight off disk: fetch has no origin, keep the shipped four */
  }
}

/** Run one hook against an embedded study's own document. */
function applyIn(doc: Document, a: Hook): boolean {
  if (a.click) {
    /* ordered fallback, so "the selected scenario, else the first" is one hook */
    for (const sel of a.click) {
      const n = doc.querySelector<HTMLElement>(sel);
      if (n) {
        n.click();
        return true;
      }
    }
    return false;
  }
  if (a.attr) {
    const t = a.attr.sel === "html" ? doc.documentElement : doc.querySelector(a.attr.sel);
    if (!t) return false;
    t.setAttribute(a.attr.name, a.attr.value);
    return true;
  }
  if (a.call) {
    const parts = a.call.split(".");
    let obj = doc.defaultView as unknown as Record<string, unknown>;
    for (let i = 0; i < parts.length - 1; i++) obj = obj?.[parts[i]] as Record<string, unknown>;
    const fn = obj?.[parts[parts.length - 1]];
    if (typeof fn !== "function") return false;
    (fn as (...a: unknown[]) => void).apply(obj, a.args ?? []);
    return true;
  }
  return false;
}

function runHooks(doc: Document, hooks: Hook[] | undefined, first: boolean): void {
  for (const h of hooks ?? []) {
    if (h.once && !first) continue;
    applyIn(doc, h);
  }
}

/* the logo lockup: slipped-scanline KP monogram + two-line wordmark */
function kpLockup(cell: number, wordPx: number): HTMLElement {
  const wrap = el("div", "kp-lockup");
  wrap.appendChild(kpMark(cell));
  const word = el("pre", "kp-lockup-word", "KERNEL\nPANIC");
  word.style.fontSize = `${wordPx}px`;
  wrap.appendChild(word);
  return wrap;
}

/* ================= BOOT ================= */

function showBoot(): void {
  root.textContent = "";
  const boot = el("div", "kp-boot");
  boot.appendChild(el("i", "kp-boot-dither"));
  const inner = el("div", "kp-boot-inner");
  ticks(inner);
  inner.appendChild(kpLockup(4, 26));
  const lines = [
    // demo note: the shipped first line spells the family name; lore ledger
    // ruling 8 forbids that, so the demo boots name-free (integration fix
    // owed in boot.tsx per pipeline/gates/loremaster-review.md).
    "REPAIR BENCH BIOS v9.2",
    "KERNEL PANIC vDEMO kpos-shell",
    "640K NEURAL BUFFER ... OK",
    "SIGNAL BUS ........... OK",
    "BACK ROOM LOCK ....... ENGAGED",
    "MOUNTING SHOPFRONT ...",
  ];
  lines.forEach((l, i) => {
    const p = el("p", "kp-boot-line", l);
    p.style.animationDelay = `${0.15 + i * 0.22}s`;
    inner.appendChild(p);
  });
  inner.appendChild(el("p", "kp-boot-cursor", "_"));
  boot.appendChild(inner);
  root.appendChild(boot);

  const done = () => {
    clearTimeout(t);
    showLogin();
  };
  const t = setTimeout(done, 1700);
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
  login.appendChild(el("p", "kp-build-stamp", "BUILD kpos-shell demo"));

  const slots = el("div", "kp-login-slots");

  const occupied = (slotN: number, sub: string, rows: { label: string; value: string }[], dim: string) => {
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
    void sub;
    return wrap;
  };

  slots.appendChild(occupied(1, "", [
    { label: "ATTEMPT", value: String(meta.runCount) },
    { label: "DAY", value: `${run.day}` },
    { label: "STRAIN", value: `${run.strain}` },
  ], "back room sealed"));
  slots.appendChild(occupied(2, "", [
    { label: "ATTEMPT", value: "2" },
    { label: "DAY", value: "1" },
    { label: "STRAIN", value: "88" },
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
    let typedUser = 0;
    let typedPass = 0;
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
        setTimeout(() => showDesktop(slotN), 900);
      }
    };
    step();
  };
}

/* ================= DESKTOP ================= */

function showDesktop(slotN: number): void {
  root.textContent = "";
  const os = el("div", "kp-os");

  /* wallpaper: gradients + dither + the studies' data-sheet furniture
   * (dossier poster block, telemetry cluster) instead of the old outline
   * wordmark + wireframe globe */
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

  /* desk area that windows live in */
  const desk = el("main");
  desk.style.position = "absolute";
  desk.style.inset = "0 0 44px 0";
  os.appendChild(desk);

  /* ticker strip above the taskbar */
  const ticker = el("div", "kp-ticker");
  const tickerText = el("span");
  const stats = [
    ["ATTEMPTS", meta.runCount],
    ["MACHINE BEATEN", meta.stats.runsWon],
    ["JOBS CLEARED", meta.stats.divesCleared],
    ["DIVES LOST", meta.stats.divesLost],
    ["SCANS RUN", meta.stats.scans],
  ] as const;
  tickerText.textContent = stats.map(([l, v]) => `${l} ${v}`).join(" // ");
  ticker.appendChild(tickerText);
  os.appendChild(ticker);

  /* kp-fw windows at the kpos-window-sizing footprints; JOBS.QUE is the
   * legacy flow window (board/diag/night/story), reachable from the rig */
  const wFlow = makeWindow(desk, { id: "flow", title: "JOBS.QUE", x: 170, y: 34, w: 940 });
  const wManual = makeWindow(desk, { id: "manual", title: "MANUAL.TXT", x: 90, y: 60, w: 760 });
  const wJournal = makeWindow(desk, { id: "journal", title: "DAD.LOG", x: 150, y: 40, w: 760 });
  const wLedger = makeWindow(desk, { id: "ledger", title: "LEDGER.LOG", x: 660, y: 100, w: 480 });
  const wDarknet = makeWindow(desk, { id: "darknet", title: "DARKNET.LNK", x: 560, y: 150, w: 480, notched: true });

  /* Mounted submissions. Nothing is embedded until it is mounted, so
   * previewing one awaiting demo does not load every other study's page.
   * `built` caches the Win across unmount/remount: makeEmbed registers with
   * the window manager by id, so building a second one for the same study
   * would leave two iframes fighting over the same window. */
  const mounted = new Map<string, { win: Win; icon: HTMLElement; def: MountDef }>();
  const built = new Map<string, Win>();
  const winOf = (id: string) => mounted.get(id)?.win;

  const flow: Flow = buildShopfront(wFlow, () => winOf("loadout")?.open());
  buildManual(wManual);
  buildLedger(wLedger);
  buildDadlog(wJournal);
  buildDarknet(wDarknet);

  /* icon grid: boxed dithered cells with solid-ink tag labels */
  const grid = el("div", "kp-dicon-grid");
  const icon = (label: string, key: string, ch: string | null, badge: number | undefined, onOpen: () => void) => {
    const b = el("button", "kp-dicon");
    b.type = "button";
    if (ch) b.style.setProperty("--icon-ch", ch);
    const glyph = el("span", "kp-dicon-glyph");
    glyph.appendChild(pxIcon(PX_ICONS[key], 3));
    if (badge && badge > 0) glyph.appendChild(el("span", "kp-dicon-badge", String(badge)));
    b.appendChild(glyph);
    b.appendChild(el("span", "kp-dicon-label", label));
    b.addEventListener("click", () => {
      play("press");
      onOpen();
    });
    b.classList.add("kp-slot-anim");
    b.style.animationDelay = `${grid.children.length * 50}ms`;
    grid.appendChild(b);
    return b;
  };

  /* native icons, keyed so a mounted study can hide the round-1 window it
   * supersedes: DAD.LOG and DARKNET.LNK exist in both forms */
  const nativeIcons = new Map<string, HTMLElement>([
    ["journal", icon("DAD.LOG", "journal", null, undefined, () => wJournal.open())],
    ["manual", icon("MANUAL.TXT", "manual", null, undefined, () => wManual.open())],
    ["ledger", icon("LEDGER.LOG", "ledger", null, undefined, () => wLedger.open())],
    ["darknet", icon("DARKNET.LNK", "darknet", null, undefined, () => wDarknet.open())],
  ]);
  desk.appendChild(grid);

  function repaintJobsBadge(): void {
    const ic = mounted.get("inbox")?.icon;
    if (!ic) return;
    const glyph = ic.querySelector(".kp-dicon-glyph")!;
    glyph.querySelector(".kp-dicon-badge")?.remove();
    const n = openJobs();
    if (n > 0) glyph.appendChild(el("span", "kp-dicon-badge", String(n)));
  }
  on("screen", repaintJobsBadge);
  on("day", repaintJobsBadge);

  /* ---------------- mount / unmount ---------------- */

  const mountSub = (id: string): boolean => {
    if (mounted.has(id)) return true;
    const def = SUBMISSIONS.find((s) => s.id === id);
    if (!def) return false;

    let win = built.get(id);
    if (!win) {
      win = makeEmbed(desk, {
        id: def.id,
        title: def.title,
        src: def.src,
        frameW: def.frameW + EMBED_PAD * 2,
        x: def.x,
        y: def.y,
        onReady: (d) => runHooks(d, def.onReady, true),
        onOpen: (d, first) => runHooks(d, def.onOpen, first),
      });
      built.set(id, win);
    }
    const w = win;

    const ic = icon(def.title, def.icon ?? "manual", null, undefined, () => w.open());
    /* mounted studies sort ahead of the native windows */
    grid.insertBefore(ic, grid.firstChild);
    mounted.set(id, { win: w, icon: ic, def });
    if (def.replaces) nativeIcons.get(def.replaces)?.style.setProperty("display", "none");
    repaintJobsBadge();
    return true;
  };

  const unmountSub = (id: string): boolean => {
    const m = mounted.get(id);
    if (!m) return false;
    m.win.close();
    m.icon.remove();
    mounted.delete(id);
    if (m.def.replaces) nativeIcons.get(m.def.replaces)?.style.removeProperty("display");
    return true;
  };

  /* what the desktop opens with: the shipped set the manifest marks default,
   * plus anything named in ?mount= (how the review site previews a demo) */
  const asked = new URLSearchParams(location.search).get("mount");
  const extra = asked ? asked.split(",").map((s) => s.trim()).filter(Boolean) : [];
  for (const s of SUBMISSIONS) if (s.default) mountSub(s.id);
  for (const id of extra) mountSub(id);

  /* taskbar */
  const bar = el("footer", "kp-taskbar");
  const mark = el("button", "kp-task-mark");
  mark.type = "button";
  mark.appendChild(kpMark(2, true));
  mark.appendChild(document.createTextNode("KP/OS"));
  bar.appendChild(mark);

  const chips = el("div", "kp-task-chips");
  const paintChips = () => {
    chips.textContent = "";
    chips.appendChild(chip("USER", `0${slotN}`));
    const pct = Math.round((Math.min(run.day, FINAL_DAY) / FINAL_DAY) * 100);
    chips.appendChild(chip("DAY", `${Math.min(run.day, FINAL_DAY)}/10 ${pct}%`));
    chips.appendChild(chip("STRAIN", String(run.strain), run.strain > 70));
    chips.appendChild(chip("CR", String(run.credits)));
  };
  paintChips();
  on("credits", paintChips);
  on("day", paintChips);
  bar.appendChild(chips);

  bar.appendChild(el("span", "kp-task-spacer"));
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

  /* start menu: framed dossier panel */
  let menu: HTMLElement | null = null;
  mark.addEventListener("click", () => {
    play("press");
    if (menu) {
      menu.remove();
      menu = null;
      mark.classList.remove("kp-task-mark-open");
      return;
    }
    mark.classList.add("kp-task-mark-open");
    menu = el("div", "kp-startmenu");
    nodes(menu);
    menu.appendChild(el("span", "kp-startmenu-user", `USER 0${slotN}`));
    const item = (label: string, fn: () => void) => {
      const b = el("button", "", label);
      b.type = "button";
      b.addEventListener("click", () => {
        play("press");
        fn();
      });
      menu!.appendChild(b);
    };
    item("MUSIC OFF", () => {});
    item("TEST SOUND", () => play("claimTick"));
    item("LOG OUT", () => showLogin());
    item("CLOSE", () => {
      menu?.remove();
      menu = null;
      mark.classList.remove("kp-task-mark-open");
    });
    os.appendChild(menu);
  });

  /* abandon modal (in-OS dialog, shipped copy) */
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

  /* the ticker always runs; the old near-a-window pause froze it
   * permanently once the full-height study windows landed */

  root.appendChild(os);

  /* the day loop fronts INBOX when it is mounted; a ?mount= preview opens
   * the submission the reviewer asked for on top of it */
  winOf("inbox")?.open();
  for (const id of extra) winOf(id)?.open();

  /* one hue for the shell AND every embedded study: an iframe keeps its own
   * documentElement, so the attribute has to be set in each realm */
  const setHue = (h: string): void => {
    document.documentElement.dataset.hue = h;
    for (const d of embedDocs()) d.documentElement.dataset.hue = h;
  };

  /* ---------------- demo rig ---------------- */
  /* Hidden while the review deck is present (the deck re-declares these as
   * manifest variations); still the only switch when the page is opened
   * straight off disk. */
  const rig = el("div", "rig");
  rig.appendChild(el("strong", "", "DEMO RIG"));
  rig.appendChild(el("span", "", "Hue (one scheme, pick the family)"));
  const hueRow = el("div", "rig-row");
  for (const h of ["lavender", "magenta", "phosphor"]) {
    const b = el("button", h === "lavender" ? "rig-on" : "", h.toUpperCase());
    b.addEventListener("click", () => {
      hueRow.querySelectorAll("button").forEach((x) => x.classList.remove("rig-on"));
      b.classList.add("rig-on");
      setHue(h);
    });
    hueRow.appendChild(b);
  }
  rig.appendChild(hueRow);
  rig.appendChild(el("span", "", "Screens. BOARD and RESULT open the study windows; OLD marks legacy flow screens that have no redesigned counterpart yet."));
  const row = el("div", "rig-row");
  const rigBtns: Array<[string, () => void, () => boolean]> = [
    ["BOARD", () => winOf("inbox")?.open(), () => winOf("inbox")?.isOpen() === true],
    ["DIAG (OLD)", () => { wFlow.open(); flow.set("diag"); }, () => wFlow.isOpen() && flow.screen() === "diag"],
    ["RESULT", () => winOf("repair-log")?.open(), () => winOf("repair-log")?.isOpen() === true],
    ["NIGHT (OLD)", () => { wFlow.open(); flow.set("night"); }, () => wFlow.isOpen() && flow.screen() === "night"],
    ["STORY (OLD)", () => { wFlow.open(); flow.set("story"); }, () => wFlow.isOpen() && flow.screen() === "story"],
  ];
  const rigBtnEls: HTMLButtonElement[] = [];
  const paintRig = () => {
    rigBtnEls.forEach((b, i) => b.classList.toggle("rig-on", rigBtns[i][2]()));
  };
  for (const [label, act] of rigBtns) {
    const b = el("button", "", label) as HTMLButtonElement;
    b.addEventListener("click", () => {
      act();
      paintRig();
    });
    rigBtnEls.push(b);
    row.appendChild(b);
  }
  rig.appendChild(row);
  on("screen", paintRig);
  paintRig();
  rig.appendChild(el("span", "", "Review harness: mounted studies are embedded verbatim. The review deck's SUBMISSIONS picker mounts any other one; ?mount=<id> does the same from a link. NIGHT opens the darknet market via the legacy flow window."));
  os.appendChild(rig);

  /* The review deck drives the desktop through this: the submissions picker
   * mounts and opens, the manifest's variation rows switch hue and jump the
   * legacy flow screens. Same document as the deck, so no postMessage. */
  (window as unknown as { kpDesktop: unknown }).kpDesktop = {
    list: () => [...mounted.keys()],
    mount: mountSub,
    unmount: unmountSub,
    open: (id: string) => void winOf(id)?.open(),
    setHue,
    flow: (screen: string) => {
      wFlow.open();
      flow.set(screen as Parameters<Flow["set"]>[0]);
      paintRig();
    },
  };
}

/* deterministic pseudo-random stream, the studies' seeded() pattern */
function seeded(id: string): () => number {
  let s = 0;
  for (let i = 0; i < id.length; i++) s = (s * 31 + id.charCodeAt(i)) >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s;
  };
}

/* bottom-left dossier poster: ink tag, the slipped-scanline KP emblem
 * with a scanline-masked wordmark, live `// LABEL _` rows */
function makeWallPoster(): HTMLElement {
  const poster = el("div", "kp-wallposter");
  poster.appendChild(el("span", "kp-wallposter-tag", "KP/OS v9.2 // REPAIR BENCH"));
  const emblem = el("div", "kp-wallposter-emblem");
  emblem.appendChild(kpMark(13));
  poster.appendChild(emblem);
  poster.appendChild(el("div", "kp-wallposter-word", "KERNEL PANIC"));
  const rowEl = el("div", "kp-wallposter-row");
  rowEl.appendChild(el("span", "", `ATTEMPT 0${meta.runCount}`));
  rowEl.appendChild(el("span", "", `DAY 0${Math.min(run.day, FINAL_DAY)}`));
  rowEl.appendChild(el("span", "", "BACK ROOM SEALED"));
  poster.appendChild(rowEl);
  return poster;
}

/* bottom-right telemetry cluster: a LIVE scope widget (rolling periodic
 * trace + blinking pip), a ticking bench clock, and the hex table */
function makeWallScope(): HTMLElement {
  const SVGNS = "http://www.w3.org/2000/svg";
  const wrap = el("div", "kp-wallscope");
  const box = el("div", "kp-wallscope-box");
  const tag = el("div", "kp-wallscope-tag");
  tag.appendChild(el("span", "", "// SIGNAL BUS _"));
  const ok = el("span", "", "OK");
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
  /* trace over two box-widths, periodic in W, so the roll loops clean */
  const next = seeded("kp-desk-scope");
  const jitter: number[] = [];
  for (let i = 0; i <= W / 8; i++) jitter.push(((next() % 100) / 100 - 0.5) * 8);
  const pts: string[] = [];
  for (let x = 0; x <= 2 * W; x += 8) {
    const base = 42 + Math.sin(((x % W) / W) * Math.PI * 6) * 18;
    pts.push(`${x},${Math.round(base + jitter[(x / 8) % (W / 8)])}`);
  }
  const roll = document.createElementNS(SVGNS, "g");
  roll.setAttribute("class", "kp-wallscope-roll");
  const poly = document.createElementNS(SVGNS, "polyline");
  poly.setAttribute("points", pts.join(" "));
  poly.setAttribute("shape-rendering", "crispEdges");
  roll.appendChild(poly);
  svg.appendChild(roll);
  box.appendChild(svg);
  wrap.appendChild(box);

  /* bench clock, ticking for real (same shop clock as the BENCH FEED) */
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
    clockVal.textContent = `DAY 0${Math.min(run.day, FINAL_DAY)} ${h}:${m}:${s}`;
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

/* ================= start ================= */

document.addEventListener("pointerdown", () => unlock(), { once: true });
/* the manifest decides what the desk can mount, so it has to land before the
 * desktop builds; boot only starts once it has (or has failed over) */
loadSubmissions().then(showBoot);
