(() => {
  // ../../kernel-panic-site/app/src/game/duel-types.ts
  var PIECE_I = 5;

  // ../../kernel-panic-site/app/src/game/types.ts
  function rotateArms(mask, rot) {
    const r = (rot % 4 + 4) % 4;
    return (mask << r | mask >> 4 - r) & 15;
  }

  // ../../kernel-panic-site/app/src/game/patch-cells.ts
  var PATCH_POUCH_MAX = 5;
  function armCount(mask) {
    let n = 0;
    for (let d = 0;d < 4; d++)
      if (mask & 1 << d)
        n++;
    return n;
  }
  function shapeClassOf(mask) {
    const n = armCount(mask);
    if (n >= 4)
      return "X";
    if (n === 3)
      return "T";
    return mask === PIECE_I || mask === rotateArms(PIECE_I, 1) ? "I" : "L";
  }
  function armUnionCraft(a, b) {
    const union = (a | b) & 15;
    if (armCount(union) <= Math.max(armCount(a), armCount(b)))
      return null;
    return union;
  }

  // glyph.ts
  var SVG = "http://www.w3.org/2000/svg";
  function patchGlyph(mask, size = 22, tone = "signal") {
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", "-12 -12 24 24");
    svg.setAttribute("class", `kp-patch-glyph kp-glyph-${tone}`);
    svg.setAttribute("aria-hidden", "true");
    const ends = [[0, -10], [10, 0], [0, 10], [-10, 0]];
    for (let d = 0;d < 4; d++) {
      if ((mask & 1 << d) === 0)
        continue;
      const line = document.createElementNS(SVG, "line");
      line.setAttribute("x1", "0");
      line.setAttribute("y1", "0");
      line.setAttribute("x2", String(ends[d][0]));
      line.setAttribute("y2", String(ends[d][1]));
      line.setAttribute("class", "kp-pp-arm");
      line.setAttribute("stroke-width", "3.5");
      svg.appendChild(line);
    }
    const hub = document.createElementNS(SVG, "circle");
    hub.setAttribute("cx", "0");
    hub.setAttribute("cy", "0");
    hub.setAttribute("r", "3");
    hub.setAttribute("class", "kp-pp-node");
    svg.appendChild(hub);
    return svg;
  }

  // ../../kernel-panic-site/app/src/game/sfxr.ts
  function preset(p) {
    return {
      wave: 0,
      baseFreq: 0.3,
      freqLimit: 0,
      freqSlide: 0,
      freqDeltaSlide: 0,
      duty: 0,
      dutySweep: 0,
      vibDepth: 0,
      vibSpeed: 0,
      attack: 0,
      sustain: 0.1,
      punch: 0,
      decay: 0.15,
      arpMod: 0,
      arpSpeed: 0,
      repeatSpeed: 0,
      phaserOffset: 0,
      phaserSweep: 0,
      lpfCutoff: 1,
      lpfSweep: 0,
      lpfResonance: 0,
      hpfCutoff: 0,
      hpfSweep: 0,
      volume: 0.5,
      ...p
    };
  }
  var SAMPLE_RATE = 44100;
  function renderSfxr(ps) {
    let fperiod = 0;
    let fmaxperiod = 0;
    let fslide = 0;
    let fdslide = 0;
    let squareDuty = 0;
    let squareSlide = 0;
    let arpMod = 0;
    let arpTime = 0;
    let arpLimit = 0;
    const reset = () => {
      fperiod = 100 / (ps.baseFreq * ps.baseFreq + 0.001);
      fmaxperiod = 100 / (ps.freqLimit * ps.freqLimit + 0.001);
      fslide = 1 - Math.pow(ps.freqSlide, 3) * 0.01;
      fdslide = -Math.pow(ps.freqDeltaSlide, 3) * 0.000001;
      squareDuty = 0.5 - ps.duty * 0.5;
      squareSlide = -ps.dutySweep * 0.00005;
      arpMod = ps.arpMod >= 0 ? 1 - Math.pow(ps.arpMod, 2) * 0.9 : 1 + Math.pow(ps.arpMod, 2) * 10;
      arpTime = 0;
      arpLimit = Math.floor(Math.pow(1 - ps.arpSpeed, 2) * 20000 + 32);
      if (ps.arpSpeed === 1)
        arpLimit = 0;
    };
    reset();
    let period = Math.max(8, fperiod);
    let phase = 0;
    const noiseBuffer = new Float32Array(32);
    const reseedNoise = () => {
      for (let i = 0;i < 32; i++)
        noiseBuffer[i] = Math.random() * 2 - 1;
    };
    reseedNoise();
    const envLength = [
      Math.floor(ps.attack * SAMPLE_RATE),
      Math.floor(ps.sustain * SAMPLE_RATE),
      Math.floor(ps.decay * SAMPLE_RATE)
    ];
    const totalLength = Math.max(envLength[0] + envLength[1] + envLength[2], SAMPLE_RATE * 0.02);
    let fltp = 0;
    let fltdp = 0;
    let fltw = Math.pow(ps.lpfCutoff, 3) * 0.1;
    const fltwD = 1 + ps.lpfSweep * 0.0001;
    let fltdmp = 5 / (1 + Math.pow(ps.lpfResonance, 2) * 20) * (0.01 + fltw);
    if (fltdmp > 0.8)
      fltdmp = 0.8;
    let fltphp = 0;
    let flthp = Math.pow(ps.hpfCutoff, 2) * 0.1;
    const flthpD = 1 + ps.hpfSweep * 0.0003;
    let vibPhase = 0;
    const vibSpeed = Math.pow(ps.vibSpeed, 2) * 0.01;
    const vibAmp = ps.vibDepth * 0.5;
    let fphase = Math.pow(ps.phaserOffset, 2) * 1020;
    if (ps.phaserOffset < 0)
      fphase = -fphase;
    let fdphase = Math.pow(ps.phaserSweep, 2);
    if (ps.phaserSweep < 0)
      fdphase = -fdphase;
    let iphase = Math.abs(Math.floor(fphase));
    let ipp = 0;
    const phaserBuffer = new Float32Array(1024);
    let repTime = 0;
    const repLimit = Math.floor(Math.pow(1 - ps.repeatSpeed, 2) * 20000 + 32);
    const useRep = ps.repeatSpeed > 0;
    let envStage = 0;
    let envTime = 0;
    let envVol = 0;
    const out = new Float32Array(totalLength);
    let written = 0;
    for (let t = 0;t < totalLength; t++) {
      if (useRep && ++repTime >= repLimit) {
        repTime = 0;
        reset();
      }
      if (arpLimit !== 0 && ++arpTime >= arpLimit) {
        arpLimit = 0;
        fperiod *= arpMod;
      }
      fslide += fdslide;
      fperiod *= fslide;
      if (fperiod > fmaxperiod) {
        fperiod = fmaxperiod;
        if (ps.freqLimit > 0)
          break;
      }
      let rfperiod = fperiod;
      if (vibAmp > 0) {
        vibPhase += vibSpeed;
        rfperiod = fperiod * (1 + Math.sin(vibPhase) * vibAmp);
      }
      period = Math.max(8, Math.floor(rfperiod));
      squareDuty = Math.min(0.5, Math.max(0, squareDuty + squareSlide));
      if (++envTime > envLength[envStage]) {
        envTime = 0;
        envStage++;
        if (envStage === 3)
          break;
      }
      if (envStage === 0) {
        envVol = envLength[0] === 0 ? 1 : envTime / envLength[0];
      } else if (envStage === 1) {
        envVol = 1 + Math.pow(1 - (envLength[1] === 0 ? 1 : envTime / envLength[1]), 1) * 2 * ps.punch;
      } else {
        envVol = 1 - (envLength[2] === 0 ? 1 : envTime / envLength[2]);
      }
      fphase += fdphase;
      iphase = Math.min(1023, Math.abs(Math.floor(fphase)));
      if (flthpD !== 1) {
        flthp = Math.min(0.1, Math.max(0.00001, flthp * flthpD));
      }
      let ssample = 0;
      for (let si = 0;si < 8; si++) {
        let sample = 0;
        phase++;
        if (phase >= period) {
          phase %= period;
          if (ps.wave === 3)
            reseedNoise();
        }
        const fp = phase / period;
        if (ps.wave === 0) {
          sample = fp < squareDuty ? 0.5 : -0.5;
        } else if (ps.wave === 1) {
          sample = 1 - fp * 2;
        } else if (ps.wave === 2) {
          sample = Math.sin(fp * 2 * Math.PI);
        } else {
          sample = noiseBuffer[Math.floor(fp * 32) & 31];
        }
        const pp = fltp;
        fltw = Math.min(0.1, Math.max(0, fltw * fltwD));
        if (ps.lpfCutoff !== 1) {
          fltdp += (sample - fltp) * fltw;
          fltdp -= fltdp * fltdmp;
        } else {
          fltp = sample;
          fltdp = 0;
        }
        if (ps.lpfCutoff !== 1)
          fltp += fltdp;
        fltphp += fltp - pp;
        fltphp -= fltphp * flthp;
        sample = fltphp;
        phaserBuffer[ipp & 1023] = sample;
        sample += phaserBuffer[ipp - iphase + 1024 & 1023];
        ipp = ipp + 1 & 1023;
        ssample += sample * envVol;
      }
      ssample = ssample / 8 * 0.5 * ps.volume * 2;
      out[t] = Math.max(-1, Math.min(1, ssample));
      written = t + 1;
    }
    return out.slice(0, written);
  }
  var SFXR_SAMPLE_RATE = SAMPLE_RATE;

  // sound.ts
  var ctx = null;
  var uiBus = null;
  function ensureCtx() {
    if (!ctx) {
      if (!window.AudioContext)
        return null;
      ctx = new AudioContext;
      const master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(ctx.destination);
      uiBus = ctx.createGain();
      uiBus.gain.value = 0.7;
      uiBus.connect(master);
    }
    if (ctx.state === "suspended")
      ctx.resume();
    return ctx;
  }
  function unlock() {
    ensureCtx();
  }
  var GAME = {
    tick: preset({ wave: 2, baseFreq: 0.62, sustain: 0.01, decay: 0.045, volume: 0.3 }),
    press: preset({ wave: 0, baseFreq: 0.32, duty: 0.35, sustain: 0.02, decay: 0.1, freqSlide: -0.15, volume: 0.42 }),
    deny: preset({ wave: 1, baseFreq: 0.16, sustain: 0.06, decay: 0.14, freqSlide: -0.05, volume: 0.42 }),
    winOpen: preset({ wave: 0, baseFreq: 0.3, duty: 0.2, freqSlide: 0.24, sustain: 0.05, decay: 0.13, volume: 0.4 }),
    winClose: preset({ wave: 0, baseFreq: 0.42, duty: 0.2, freqSlide: -0.24, sustain: 0.05, decay: 0.13, volume: 0.4 }),
    claimTick: preset({ wave: 0, baseFreq: 0.55, duty: 0.2, punch: 0.35, sustain: 0.02, decay: 0.13, volume: 0.42 }),
    pieceFuse: preset({ wave: 2, baseFreq: 0.26, freqSlide: 0.3, arpMod: 0.5, arpSpeed: 0.6, sustain: 0.1, decay: 0.3, punch: 0.55, lpfCutoff: 0.55, volume: 0.52 })
  };
  var BENCH = {
    solderPickup: preset({ wave: 0, baseFreq: 0.42, duty: 0.25, sustain: 0.012, decay: 0.07, punch: 0.25, volume: 0.4 }),
    solderHoverLegal: preset({ wave: 2, baseFreq: 0.58, freqSlide: 0.12, sustain: 0.01, decay: 0.06, arpMod: 0.3, arpSpeed: 0.7, volume: 0.32 }),
    solderHoverIllegal: preset({ wave: 1, baseFreq: 0.2, sustain: 0.012, decay: 0.05, freqSlide: -0.05, lpfCutoff: 0.3, volume: 0.24 }),
    solderArc: preset({ wave: 3, baseFreq: 0.7, sustain: 0.006, decay: 0.05, punch: 0.5, hpfCutoff: 0.35, volume: 0.42 }),
    solderReject: preset({ wave: 1, baseFreq: 0.18, sustain: 0.03, decay: 0.1, freqSlide: -0.12, hpfCutoff: 0.15, punch: 0.2, volume: 0.4 })
  };
  var cache = new Map;
  function bufferFor(name) {
    const c = ensureCtx();
    if (!c)
      return null;
    const params = BENCH[name] ?? GAME[name];
    if (!params)
      return null;
    let buf = cache.get(name) ?? null;
    if (!buf) {
      const data = renderSfxr(params);
      buf = c.createBuffer(1, data.length, SFXR_SAMPLE_RATE);
      buf.getChannelData(0).set(data);
      cache.set(name, buf);
    }
    return buf;
  }
  function play(name, opts = {}) {
    const c = ensureCtx();
    const buf = bufferFor(name);
    if (!c || !buf || !uiBus)
      return;
    const src = c.createBufferSource();
    src.buffer = buf;
    const jitter = opts.jitter ? 1 + (Math.random() * 2 - 1) * opts.jitter : 1;
    src.playbackRate.value = (opts.rate ?? 1) * jitter;
    const gain = c.createGain();
    gain.gain.value = opts.vol ?? 1;
    src.connect(gain);
    gain.connect(uiBus);
    src.start(c.currentTime + (opts.at ?? 0));
  }

  // main.ts
  var SHAPE_NOUN = {
    I: "Straight",
    L: "Elbow",
    T: "Tee",
    X: "Cross"
  };
  var NO_JOIN_LINE = "No legal join for that piece. The result must be strictly bigger than both.";
  var FOOT_LINE = "A piece fills one slag block with exactly the arms it shows, welded where it lands. " + "2 RAM, one per turn, single use. Pieces come off the darknet, drop from cleared jobs, " + `or bank on clean wins; the pouch holds ${PATCH_POUCH_MAX}.`;
  var SCENARIOS = {
    BENCH: [5, 3, 15, 7, 9],
    LONE: [3],
    EMPTY: []
  };
  var pouch = [...SCENARIOS.BENCH];
  var juice = "A";
  var layout = "spec";
  var GLYPH_SIZE = { spec: 44, bench: 56, schematic: 64 };
  var sel = null;
  var pair = null;
  var drag = null;
  var fusing = false;
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
      n.className = cls;
    if (text)
      n.textContent = text;
    return n;
  }
  function legalPartners(a) {
    const out = new Set;
    for (let i = 0;i < pouch.length; i++) {
      if (i !== a && armUnionCraft(pouch[a], pouch[i]) !== null)
        out.add(i);
    }
    return out;
  }
  var desk = document.getElementById("desk");
  desk.style.position = "fixed";
  desk.style.inset = "0";
  function solderIcon() {
    const SVG2 = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(SVG2, "svg");
    svg.setAttribute("width", "32");
    svg.setAttribute("height", "32");
    svg.setAttribute("viewBox", "0 0 32 32");
    const rects = [
      [4, 22, 14, 6, "currentColor"],
      [16, 18, 6, 4, "currentColor"],
      [20, 14, 4, 4, "currentColor"],
      [22, 10, 3, 4, "currentColor"],
      [23, 7, 3, 3, "var(--kp-gold)"],
      [27, 5, 2, 2, "var(--kp-signal)"],
      [25, 3, 2, 2, "var(--kp-rose)"],
      [29, 9, 2, 2, "var(--kp-gold)"]
    ];
    for (const [x, y, w, h, fill] of rects) {
      const r = document.createElementNS(SVG2, "rect");
      r.setAttribute("x", String(x));
      r.setAttribute("y", String(y));
      r.setAttribute("width", String(w));
      r.setAttribute("height", String(h));
      r.setAttribute("fill", fill);
      svg.appendChild(r);
    }
    return svg;
  }
  var iconGrid = el("div", "kp-dicon-grid");
  var icon = el("button", "kp-dicon");
  var iconGlyph = el("span", "kp-dicon-glyph");
  iconGlyph.appendChild(solderIcon());
  icon.append(iconGlyph, el("span", "kp-dicon-label", "SOLDER.BAY"));
  iconGrid.appendChild(icon);
  desk.appendChild(iconGrid);
  var win = el("div", "kp-fw kp-fw-focused");
  win.style.display = "none";
  var bar = el("div", "kp-fw-bar");
  bar.append(el("span", "kp-fw-title", "SOLDER.BAY"));
  var closeBtn = el("button", "kp-fw-close", "X");
  bar.appendChild(closeBtn);
  var body = el("div", "kp-fw-body");
  win.append(bar, body);
  desk.appendChild(win);
  function sizeWindow() {
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
  var winOpen = false;
  function toggleWin() {
    winOpen = !winOpen;
    win.style.display = winOpen ? "flex" : "none";
    play(winOpen ? "winOpen" : "winClose");
    if (winOpen) {
      win.style.animation = "none";
      win.offsetWidth;
      win.style.animation = "";
      sizeWindow();
      render();
    } else {
      clearHeld();
    }
  }
  icon.addEventListener("click", toggleWin);
  closeBtn.addEventListener("click", toggleWin);
  var winDrag = null;
  bar.addEventListener("pointerdown", (e) => {
    if (e.target === closeBtn)
      return;
    winDrag = { dx: e.clientX - win.offsetLeft, dy: e.clientY - win.offsetTop };
    bar.setPointerCapture(e.pointerId);
    win.classList.add("kp-fw-dragging");
  });
  bar.addEventListener("pointermove", (e) => {
    if (!winDrag)
      return;
    win.style.left = `${e.clientX - winDrag.dx}px`;
    win.style.top = `${Math.max(0, e.clientY - winDrag.dy)}px`;
  });
  bar.addEventListener("pointerup", () => {
    winDrag = null;
    win.classList.remove("kp-fw-dragging");
  });
  var targetsRoot = body;
  var joinRow = el("div");
  var actions = el("div");
  var shakeTarget = body;
  var traceLayer = null;
  function targetEls() {
    return Array.from(targetsRoot.querySelectorAll("[data-slot-index]"));
  }
  function slotAt(i) {
    return targetEls().find((s) => Number(s.dataset.slotIndex) === i);
  }
  function makeHead() {
    const head = el("div", "kp-solder-head");
    head.append(el("strong", "", "PATCH POUCH"), el("em", "", `${pouch.length} / ${PATCH_POUCH_MAX}`));
    return head;
  }
  function makeSlot(i, reveal) {
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
  var NODE_POS = [
    [0.16, 0.3],
    [0.46, 0.18],
    [0.78, 0.3],
    [0.3, 0.7],
    [0.64, 0.72]
  ];
  function render(reveal = false) {
    body.textContent = "";
    body.className = `kp-fw-body kp-body-${layout}`;
    traceLayer = null;
    if (layout === "spec") {
      const deck = el("div", "kp-solder-deck");
      const rack = el("div", "kp-solder-rack");
      for (let i = 0;i < PATCH_POUCH_MAX; i++)
        rack.appendChild(makeSlot(i, reveal));
      joinRow = el("div", "kp-solder-join");
      actions = el("div", "kp-piece-actions");
      deck.append(rack, joinRow, actions);
      body.append(makeHead(), deck, el("p", "kp-solder-foot", FOOT_LINE));
      targetsRoot = rack;
      shakeTarget = deck;
    } else if (layout === "bench") {
      const surface = el("div", "kp-bench-surface");
      for (let i = 0;i < PATCH_POUCH_MAX; i++) {
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
      const SVG2 = "http://www.w3.org/2000/svg";
      traceLayer = document.createElementNS(SVG2, "svg");
      traceLayer.setAttribute("class", "kp-schem-traces");
      board.appendChild(traceLayer);
      for (let i = 0;i < PATCH_POUCH_MAX; i++) {
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
  function surfacePoint(x, y) {
    const r = targetsRoot.getBoundingClientRect();
    return { x: x - r.left, y: y - r.top };
  }
  function drawTraces(fromX, fromY, held) {
    if (!traceLayer)
      return;
    traceLayer.textContent = "";
    const SVG2 = "http://www.w3.org/2000/svg";
    const from = surfacePoint(fromX, fromY);
    for (const i of legalPartners(held)) {
      const target = slotAt(i);
      if (!target)
        continue;
      const tr = target.getBoundingClientRect();
      const to = surfacePoint(tr.left + tr.width / 2, tr.top + tr.height / 2);
      const line = document.createElementNS(SVG2, "line");
      line.setAttribute("x1", String(from.x));
      line.setAttribute("y1", String(from.y));
      line.setAttribute("x2", String(to.x));
      line.setAttribute("y2", String(to.y));
      line.setAttribute("class", "kp-schem-trace");
      traceLayer.appendChild(line);
    }
  }
  function clearTraces() {
    if (traceLayer)
      traceLayer.textContent = "";
  }
  function joinCandidate() {
    if (drag) {
      const h = drag.hoverIndex;
      if (h !== null && h < pouch.length && armUnionCraft(pouch[drag.index], pouch[h]) !== null) {
        return { a: drag.index, b: h };
      }
      return null;
    }
    if (sel !== null && pair !== null)
      return { a: sel, b: pair };
    return null;
  }
  function paintJoinRow() {
    joinRow.textContent = "";
    actions.textContent = "";
    const heldIndex = drag ? drag.index : sel;
    if (heldIndex === null || fusing)
      return;
    const cand = joinCandidate();
    if (cand) {
      const union = armUnionCraft(pouch[cand.a], pouch[cand.b]);
      joinRow.append("JOIN: ", patchGlyph(pouch[cand.a], 16), " + ", patchGlyph(pouch[cand.b], 16), " -> ", patchGlyph(union, 20), ` ${SHAPE_NOUN[shapeClassOf(union)]}`);
      if (!drag) {
        const craft = el("button", "", "CRAFT");
        craft.addEventListener("click", () => {
          fuseAt(sel, pair, null);
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
  function paintTapState() {
    const partners = sel !== null ? legalPartners(sel) : new Set;
    for (const s of targetEls()) {
      const i = Number(s.dataset.slotIndex);
      s.classList.remove("kp-solder-carry", "kp-piece-dim", "kp-solder-legal", "kp-solder-illegal");
      if (drag) {
        if (i === drag.index)
          markDragOrigin(s);
        continue;
      }
      if (i === sel || i === pair)
        s.classList.add("kp-solder-carry");
      else if (sel !== null && pair === null && i < pouch.length && !partners.has(i))
        s.classList.add("kp-piece-dim");
    }
    if (!drag && traceLayer) {
      if (sel !== null) {
        const s = slotAt(sel);
        if (s) {
          const r = s.getBoundingClientRect();
          drawTraces(r.left + r.width / 2, r.top + r.height / 2, sel);
        }
      } else
        clearTraces();
    }
  }
  function markDragOrigin(slot) {
    slot.textContent = "";
    slot.appendChild(el("span", "kp-piece-hole"));
  }
  function clearHeld() {
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
  function wireSlot(slot, index) {
    let start = null;
    let dragged = false;
    slot.addEventListener("pointerdown", (e) => {
      if (fusing)
        return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      dragged = false;
      slot.setPointerCapture(e.pointerId);
    });
    slot.addEventListener("pointermove", (e) => {
      if (fusing || !start) {
        if (drag && dragged)
          moveDrag(e);
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
      if (fusing)
        return;
      if (dragged) {
        dragged = false;
        return;
      }
      tapActivate(index);
    });
  }
  function tapActivate(i) {
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
  function beginDrag(slot, index, e) {
    sel = null;
    pair = null;
    const rect = slot.getBoundingClientRect();
    const chip = el("div", "kp-solder-slot kp-solder-carry kp-solder-ghostchip");
    if (layout === "bench")
      chip.classList.add("kp-bench-pad", "kp-pad-loose");
    if (layout === "schematic")
      chip.classList.add("kp-schem-node", "kp-node-loose");
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
      hoverIndex: null
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
  function moveDrag(e) {
    if (!drag)
      return;
    drag.chip.style.left = `${e.clientX - drag.offsetX}px`;
    drag.chip.style.top = `${e.clientY - drag.offsetY}px`;
    if (traceLayer) {
      const c = drag.chip.getBoundingClientRect();
      drawTraces(c.left + c.width / 2, c.top + c.height / 2, drag.index);
    }
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const slotEl = under?.closest?.("[data-slot-index]");
    const idx = slotEl && targetsRoot.contains(slotEl) ? Number(slotEl.dataset.slotIndex) : null;
    if (idx === drag.hoverIndex)
      return;
    for (const s of targetEls())
      s.classList.remove("kp-solder-legal", "kp-solder-illegal");
    drag.hoverIndex = idx;
    if (idx !== null) {
      const target = slotAt(idx);
      const legal = idx !== drag.index && idx < pouch.length && armUnionCraft(pouch[drag.index], pouch[idx]) !== null;
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
  function endDrag(e) {
    if (!drag)
      return;
    const { index, hoverIndex } = drag;
    const legal = hoverIndex !== null && hoverIndex !== index && hoverIndex < pouch.length && armUnionCraft(pouch[index], pouch[hoverIndex]) !== null;
    if (legal) {
      document.body.classList.remove("kp-dragging-piece");
      clearTraces();
      fuseAt(index, hoverIndex, drag);
      drag = null;
    } else {
      rejectCancel(hoverIndex !== null && hoverIndex < pouch.length ? hoverIndex : null);
    }
  }
  function rejectCancel(flashIndex) {
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
    if (e.key === "Escape" && (drag || sel !== null) && !fusing)
      rejectCancel(null);
  });
  function slotCenter(i) {
    const s = slotAt(i);
    const r = s.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function sparkOverlay(x, y, rays) {
    const SVG2 = "http://www.w3.org/2000/svg";
    const wrap = el("div", "kp-solder-spark");
    const svg = document.createElementNS(SVG2, "svg");
    const px = layout === "spec" ? 48 : 72;
    svg.setAttribute("width", String(px));
    svg.setAttribute("height", String(px));
    svg.setAttribute("viewBox", "-12 -12 24 24");
    for (let i = 0;i < rays; i++) {
      const a = Math.PI * 2 * i / rays + Math.PI / rays;
      const line = document.createElementNS(SVG2, "line");
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
  async function fuseAt(a, b, liveDrag) {
    fusing = true;
    const union = armUnionCraft(pouch[a], pouch[b]);
    const target = slotCenter(b);
    const heavy = juice === "B";
    play("solderArc", heavy ? { vol: 1.15 } : {});
    const spark = sparkOverlay(target.x, target.y, heavy ? 8 : 4);
    setTimeout(() => spark.remove(), 200);
    let chip;
    if (liveDrag) {
      chip = liveDrag.chip;
    } else {
      const s = slotAt(a);
      const rect = s.getBoundingClientRect();
      chip = el("div", "kp-solder-slot kp-solder-carry kp-solder-ghostchip");
      chip.appendChild(patchGlyph(pouch[a], GLYPH_SIZE[layout]));
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
    setTimeout(() => {
      play("pieceFuse", heavy ? { rate: 0.94, vol: 1.15 } : {});
      shakeTarget.classList.add(heavy ? "kp-shake-2" : "kp-shake-1");
      chip.style.animation = "kp-solder-weld-in 180ms steps(4) both reverse";
      const weld = el("div", "kp-solder-weldwrap kp-solder-weld-fade");
      const SVG2 = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(SVG2, "svg");
      svg.setAttribute("width", "16");
      svg.setAttribute("height", "16");
      svg.setAttribute("viewBox", "-8 -8 16 16");
      const dot = document.createElementNS(SVG2, "circle");
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
  var rig = el("div", "rig");
  rig.appendChild(el("strong", "", "DEMO RIG"));
  rig.appendChild(el("span", "", "Layout"));
  var layRow = el("div", "rig-row");
  var LAY_LABEL = { spec: "SPEC+", bench: "BENCH", schematic: "SCHEMATIC" };
  for (const l of ["spec", "bench", "schematic"]) {
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
  var scenRow = el("div", "rig-row");
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
  var juiceRow = el("div", "rig-row");
  var juiceLabel = { A: "A SPEC", B: "B HEAVY", C: "C QUIET" };
  for (const j of ["A", "B", "C"]) {
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
})();
