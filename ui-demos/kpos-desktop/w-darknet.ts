import { el, hero, btn, hatchBar, photoCell, patchGlyph } from "../_shared/ui";
import { run, on, emit, PATCH_POUCH_MAX, darkPullPrice, SHAPE_NOUN, shapeClassOf } from "./data";
import { play } from "../_shared/sound";
import type { Win } from "./wm";

/**
 * DARKNET.LNK: kpos-darknet. Magenta CRT vendor terminal. Offline outside
 * the night phase (mirrors run.screen === 'upgrade' gating via nightOpen).
 */

let nightOpen = false;
export function setNightOpen(v: boolean): void {
  nightOpen = v;
  emit("credits");
}

/* deterministic mock pulls, cycled (never Math.random in a demo beat) */
const PULLS = [0b1010, 0b0110, 0b1101, 0b0011];
let pullIdx = 0;
let lastPull: number | null = null;
let buys = 0;

export function buildDarknet(win: Win): void {
  const paint = () => {
    win.body.textContent = "";
    const box = el("div", "kp-darknet");
    const dither = el("i", "kp-darknet-dither");
    box.appendChild(dither);

    box.appendChild(el("p", "kp-darknet-tag", "SELLER: SIGNAL SCRAMBLED. NO ID ON FILE."));

    if (!nightOpen) {
      const h = hero("MARKET OFFLINE.", "kp-darknet-offline-hero");
      box.appendChild(h);
      box.appendChild(el("p", "", "Signal only holds after the shop shuts. Trades resume at day close."));
      win.body.appendChild(box);
      return;
    }

    box.appendChild(el("p", "", "Salvage off a hundred dead machines, sorted by nobody."));
    box.appendChild(el("p", "", "Pay first. Shape is the surprise. That is the whole business model here."));

    const cost = darkPullPrice();
    const full = run.patchPouch.length >= PATCH_POUCH_MAX;
    const broke = run.credits < cost;

    const row = el("div", "kp-darknet-row");
    const buy = btn(`BUY BLIND (${cost} cr)`, "primary", () => {
      play("pieceFuse");
      run.credits -= cost;
      lastPull = PULLS[pullIdx % PULLS.length];
      pullIdx++;
      buys++;
      run.patchPouch.push(lastPull);
      emit("pouch");
      emit("credits");
    });
    buy.disabled = full || broke;
    if (full) buy.title = `POUCH FULL (${PATCH_POUCH_MAX}/${PATCH_POUCH_MAX})`;
    else if (broke) buy.title = `NEED ${cost} CR`;
    row.appendChild(buy);
    row.appendChild(hatchBar(Math.min(100, (cost / Math.max(1, run.credits)) * 100)));
    row.appendChild(el("span", "kp-darknet-balance", `${run.credits} cr`));
    box.appendChild(row);

    if (full) {
      box.appendChild(el("p", "kp-rail-dim", "Dealer is not a storage locker. Pouch is full. Come back with room."));
    }

    if (lastPull !== null && buys > 0) {
      const reveal = el("div", "kp-darknet-reveal");
      const cell = el("span", "kp-photo-cell-full");
      const g = patchGlyph(lastPull, 44);
      g.classList.add("kp-reveal-pop");
      cell.appendChild(g);
      cell.appendChild(el("i", "kp-scan-sweep"));
      reveal.appendChild(cell);
      const txt = el("div");
      txt.appendChild(el("p", "", "PIECE ACQUIRED. SHAPE CONFIRMED ON ARRIVAL."));
      txt.appendChild(el("p", "kp-rail-dim", "Told you. Never know what you're gonna get."));
      reveal.appendChild(txt);
      box.appendChild(reveal);
    }

    const pouch = el("div", "kp-darknet-pouch");
    pouch.appendChild(el("span", "kp-rail-dim", `POUCH ${run.patchPouch.length}/${PATCH_POUCH_MAX}`));
    for (const m of run.patchPouch) pouch.appendChild(patchGlyph(m, 20));
    box.appendChild(pouch);

    box.appendChild(el("p", "kp-rail-dim", "No refunds. No complaints line. Close the window if you want a guarantee."));
    win.body.appendChild(box);
  };

  paint();
  // repaint unconditionally: the market open/close state changes while this
  // window is closed (night phase), and a stale offline paint must never
  // greet a player opening it mid-night
  on("pouch", paint);
  on("credits", paint);
  on("screen", paint);
}
