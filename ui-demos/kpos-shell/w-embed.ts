import { el } from "./ui";
import { play } from "./sound";
import { Win, WinDef, registerWin, raiseWin, dropWin, notifyLayout } from "./wm";

/**
 * Iframe host for the completed standalone study windows (inbox.html,
 * loadout.html, solder.html, dive-report.html). The studies are embedded
 * VERBATIM - the files are never edited; every desktop adaptation is done
 * from out here, reaching into the same-origin document:
 *
 * - scaffold neutralized by an injected stylesheet (page background and
 *   padding, demo rig, per-page CRT overlay, decorative _ [] # glyphs)
 * - a working pixel-X close button injected into the study's title strip
 *   (the only window button that works, per the desktop chrome rule)
 * - the title strip drags the wrapper; any pointerdown focuses/raises
 * - the iframe keeps a FIXED width (so the studies' innerWidth-based
 *   sizing math stays stable) and follows the window's height live; a
 *   clip-path synced to the window rect frees the unused halo so clicks
 *   there fall through to the desktop
 * - per-study option forcing and open choreography run through each
 *   page's own demo-rig hooks (e.g. LOADOUT.CFG FINE dither, REPLAY)
 */

export interface EmbedDef {
  id: string;
  title: string;
  src: string;
  /** iframe width: study window max width + 2 * PAD */
  frameW: number;
  /** wrapper position on the desk (window sits PAD further in) */
  x: number;
  y: number;
  /** runs once when the document is ready (option forcing) */
  onReady?: (doc: Document) => void;
  /** runs on every open, after the wrapper is visible */
  onOpen?: (doc: Document, firstOpen: boolean) => void;
}

/** halo around the study window kept for its drop-shadow + glow */
export const EMBED_PAD = 34;

const TITLE_MIN_VISIBLE = 40;

const embedFrames: HTMLIFrameElement[] = [];

/** live study documents, for the demo rig's hue switch */
export function embedDocs(): Document[] {
  const out: Document[] = [];
  for (const f of embedFrames) {
    if (f.contentDocument) out.push(f.contentDocument);
  }
  return out;
}

const INJECT_CSS = `
/* color-scheme must MATCH the host iframe element's, or the browser
 * backs the canvas with an opaque fill and the halo stops being
 * see-through */
html { color-scheme: dark; }
html, body { background: transparent !important; overflow: hidden !important; }
body {
  display: block !important;
  margin: 0 !important;
  padding: ${EMBED_PAD}px !important;
  height: auto !important;
  min-height: 0 !important;
}
.rig, .kp-crt { display: none !important; }
.term-bar .term-glyphs { display: none !important; }
.term-bar { cursor: grab; user-select: none; touch-action: none; }
`;

export function makeEmbed(desk: HTMLElement, def: EmbedDef): Win {
  const root = el("div", "kp-embed");
  root.style.display = "none";
  root.style.left = `${def.x}px`;
  root.style.top = `${def.y}px`;

  const frame = document.createElement("iframe");
  frame.src = def.src;
  frame.style.width = `${def.frameW}px`;
  frame.style.height = "600px";
  frame.setAttribute("title", def.title);
  root.appendChild(frame);
  desk.appendChild(root);
  embedFrames.push(frame);

  let openFlag = false;
  let loaded = false;
  let everOpened = false;
  let pendingOpenFx = false;

  const doc = () => frame.contentDocument;
  const termOf = (d: Document) => d.querySelector<HTMLElement>(".term");

  /* follow the study window: iframe height hugs its bottom edge, the
   * clip-path hugs its rect (plus the shadow halo) so the rest of the
   * fixed-width iframe is invisible AND click-through */
  const sync = () => {
    const d = doc();
    if (!d) return;
    const term = termOf(d);
    if (!term) return;
    const r = term.getBoundingClientRect();
    if (r.width === 0) return;
    frame.style.height = `${Math.ceil(r.bottom + EMBED_PAD)}px`;
    const clipLeft = Math.max(0, Math.floor(r.left - EMBED_PAD));
    const clipRight = Math.max(0, Math.floor(def.frameW - r.right - EMBED_PAD));
    frame.style.clipPath = `inset(0px ${clipRight}px 0px ${clipLeft}px)`;
    notifyLayout();
  };

  const focus = () => {
    if (!openFlag) return;
    const wasTop = raiseWin(def.id);
    if (!wasTop) play("winFocus");
    notifyLayout();
  };

  const fireOpenFx = () => {
    const d = doc();
    if (!d) return;
    const first = !everOpened;
    everOpened = true;
    def.onOpen?.(d, first);
    sync();
  };

  const open = () => {
    if (openFlag) {
      focus();
      return;
    }
    openFlag = true;
    root.style.display = "block";
    root.style.animation = "none";
    void root.offsetWidth;
    root.style.animation = "";
    raiseWin(def.id);
    play("winOpen");
    if (loaded) {
      sync();
      fireOpenFx();
    } else {
      pendingOpenFx = true;
    }
    notifyLayout();
  };

  const close = () => {
    if (!openFlag) return;
    openFlag = false;
    root.style.display = "none";
    dropWin(def.id);
    play("winClose");
    notifyLayout();
  };

  frame.addEventListener("load", () => {
    const d = doc();
    if (!d) return;
    loaded = true;

    /* desktop-mode scaffold overrides, injected - the study file itself
     * stays byte-identical */
    const style = d.createElement("style");
    style.textContent = INJECT_CSS;
    d.head.appendChild(style);

    const term = termOf(d);
    const bar = d.querySelector<HTMLElement>(".term-bar");

    /* the pixel X: the only working window button */
    if (bar) {
      const closeBtn = d.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "kp-embed-close";
      closeBtn.setAttribute("aria-label", `Close ${def.title}`);
      closeBtn.appendChild(d.createElement("i"));
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        close();
      });
      bar.appendChild(closeBtn);

      /* title-strip drag moves the wrapper; screen-coordinate deltas so
       * the moving frame under the pointer cannot feed back */
      let drag: { pointerId: number; sx: number; sy: number; left: number; top: number } | null = null;
      bar.addEventListener("pointerdown", (e) => {
        if ((e.target as HTMLElement).closest(".kp-embed-close")) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        bar.setPointerCapture(e.pointerId);
        drag = { pointerId: e.pointerId, sx: e.screenX, sy: e.screenY, left: root.offsetLeft, top: root.offsetTop };
      });
      bar.addEventListener("pointermove", (e) => {
        if (!drag || drag.pointerId !== e.pointerId) return;
        const t = term ? term.getBoundingClientRect() : { left: EMBED_PAD, top: EMBED_PAD, width: 400 };
        const parentW = desk.clientWidth;
        const parentH = desk.clientHeight;
        const nl = drag.left + (e.screenX - drag.sx);
        const nt = drag.top + (e.screenY - drag.sy);
        const minL = TITLE_MIN_VISIBLE - (t.left + t.width);
        const maxL = parentW - TITLE_MIN_VISIBLE - t.left;
        const minT = -t.top;
        const maxT = parentH - TITLE_MIN_VISIBLE - t.top;
        root.style.left = `${Math.min(Math.max(nl, minL), maxL)}px`;
        root.style.top = `${Math.min(Math.max(nt, minT), maxT)}px`;
        notifyLayout();
      });
      const endDrag = (e: PointerEvent) => {
        if (!drag || drag.pointerId !== e.pointerId) return;
        drag = null;
      };
      bar.addEventListener("pointerup", endDrag);
      bar.addEventListener("pointercancel", endDrag);
    }

    /* any pointerdown inside the study raises the window */
    d.addEventListener("pointerdown", () => focus(), true);

    /* per-frame size/clip sync from inside the iframe realm, so the
     * INBOX staged open/close is followed frame by frame */
    if (term && frame.contentWindow) {
      const RO = (frame.contentWindow as Window & typeof globalThis).ResizeObserver;
      if (RO) new RO(sync).observe(term);
    }

    def.onReady?.(d);
    sync();
    if (pendingOpenFx) {
      pendingOpenFx = false;
      fireOpenFx();
    }
  });

  const winDef: WinDef = { id: def.id, title: def.title, x: def.x, y: def.y, w: def.frameW };
  const win: Win = {
    def: winDef,
    root,
    bar: root,
    body: root,
    titleEl: root,
    open,
    close,
    focus,
    isOpen: () => openFlag,
  };
  registerWin(win);
  return win;
}
