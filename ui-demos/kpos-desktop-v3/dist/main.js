(() => {
  // ../_shared/ui.ts
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls)
      n.className = cls;
    if (text)
      n.textContent = text;
    return n;
  }
  function ticks(host) {
    host.classList.add("kp-frame-ticks");
    host.appendChild(el("i", "kp-tick2"));
    return host;
  }
  function nodes(host, on = false) {
    host.classList.add("kp-frame-nodes");
    if (on)
      host.classList.add("kp-nodes-on");
    const wrap = el("i", "kp-nodes");
    for (let i = 0;i < 6; i++)
      wrap.appendChild(el("i"));
    host.appendChild(wrap);
    return host;
  }
  function datarows(rows, slash = false) {
    const list = el("div", "kp-datarow-list");
    for (const r of rows) {
      const row = el("div", `kp-datarow ${slash ? "kp-datarow-slash" : "kp-datarow-plain"} ${r.warn ? "kp-datarow-warn" : ""}`.trim());
      row.appendChild(el("span", "", r.label));
      const em = el("em");
      if (typeof r.value === "string")
        em.textContent = r.value;
      else
        em.appendChild(r.value);
      row.appendChild(em);
      list.appendChild(row);
    }
    return list;
  }
  function chip(label, value, crimson = false) {
    const c = el("span", `kp-chip-pct ${crimson ? "kp-chip-crimson" : ""}`.trim());
    c.append(el("span", "", label), el("em", "", value));
    return c;
  }
  var SVGNS = "http://www.w3.org/2000/svg";
  var KP_MARK_ROWS = [
    "##...##..#######.",
    "##..##...##....##",
    "##.##....##....##",
    "####.....##....##",
    "###......#######.",
    "####.....##......",
    "##.##....##......",
    "##..##...##......",
    "##...##..##......",
    "##...##..##......"
  ];
  var KP_SLICE_ROWS = [4, 5];
  var KP_SLIP_CELLS = 2;
  function kpMark(cell, sliceMono = false) {
    const svg = document.createElementNS(SVGNS, "svg");
    const cols = KP_MARK_ROWS[0].length + KP_SLIP_CELLS;
    const W = cols * cell;
    const H = KP_MARK_ROWS.length * cell;
    svg.setAttribute("class", "kp-mark");
    svg.setAttribute("width", String(W));
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("aria-hidden", "true");
    svg.style.setProperty("--slip", `${KP_SLIP_CELLS * cell}px`);
    const slice = document.createElementNS(SVGNS, "g");
    slice.setAttribute("class", "kp-mark-slice");
    KP_MARK_ROWS.forEach((row, y) => {
      const inSlice = KP_SLICE_ROWS.includes(y);
      let run = -1;
      for (let x = 0;x <= row.length; x++) {
        const on = x < row.length && row[x] === "#";
        if (on && run < 0)
          run = x;
        if (!on && run >= 0) {
          const r = document.createElementNS(SVGNS, "rect");
          r.setAttribute("x", String((run + (inSlice ? KP_SLIP_CELLS : 0)) * cell));
          r.setAttribute("y", String(y * cell));
          r.setAttribute("width", String((x - run) * cell));
          r.setAttribute("height", String(cell));
          r.setAttribute("fill", inSlice && !sliceMono ? "var(--ch-hot)" : "currentColor");
          (inSlice ? slice : svg).appendChild(r);
          run = -1;
        }
      }
    });
    svg.appendChild(slice);
    return svg;
  }
  var PX_ICONS = {
    inbox: [
      "########################",
      "##********************##",
      "####oooooooooooooooo####",
      "##-##oooooooooooooo##-##",
      "##--##oooooooooooo##--##",
      "##---##oooooooooo##---##",
      "##----##oooooooo##----##",
      "##-----##oooooo##-----##",
      "##------##oooo##------##",
      "##-------##oo##-------##",
      "##--------####--------##",
      "##--------++++--------##",
      "##--------------------##",
      "##++++++++++++++++++++##",
      "########################",
      "########################"
    ],
    loadout: [
      "......##...##...##......",
      "......##...##...##......",
      "..####################..",
      "..##oooooooooooooooo##..",
      "..##o--------------+##..",
      "..##o--------------+##..",
      "####o--------------+####",
      "####o--------------+####",
      "..##o---########---+##..",
      "..##o---#******#---+##..",
      "..##o---#******#---+##..",
      "####o---#******#---+####",
      "####o---#******#---+####",
      "..##o---#******#---+##..",
      "..##o---#******#---+##..",
      "..##o---########---+##..",
      "####o--------------+####",
      "####o--------------+####",
      "..##o--------------+##..",
      "..##++++++++++++++++##..",
      "..####################..",
      "..####################..",
      "......##...##...##......",
      "......##...##...##......"
    ],
    solder: [
      ".....................*..",
      "...................*...*",
      "....................*...",
      "..................*.....",
      ".................##.....",
      "................o##+....",
      "...............o###+....",
      "..............o####+....",
      ".............o####+.....",
      "............o####+......",
      "...........o####+.......",
      "..........o####+........",
      ".........o####+.........",
      "........o####+..........",
      ".......o####+...........",
      "......o####+............",
      ".....o#####+............",
      "....o######+............",
      "...o#######+............",
      "..o++++++++.............",
      ".o#########+............",
      ".o++++++++++............",
      "o##########+............",
      "o##########+............"
    ],
    report: [
      "........########........",
      "........##****##........",
      "..####################..",
      "..####################..",
      "..##oooooooooooooooo##..",
      "..##o--------------+##..",
      "..##o-++++++++-----+##..",
      "..##o--------------+##..",
      "..##o-++++++++++---+##..",
      "..##o--------------+##..",
      "..##o-++++++++++---+##..",
      "..##o--------------+##..",
      "..##o-++++++-------+##..",
      "..##o--------------+##..",
      "..##o--------------+##..",
      "..##o--------****--+##..",
      "..##o-------******-+##..",
      "..##o-------******-+##..",
      "..##o--------****--+##..",
      "..##o--------------+##..",
      "..##++++++++++++++++##..",
      "..####################..",
      "..####################..",
      "........................"
    ],
    journal: [
      "..####################..",
      "..####################..",
      "..##ooo----------**-##..",
      "..##ooo----------**-##..",
      "..##ooo----------**-##..",
      "..##ooo----------**-##..",
      "..##ooo----------*--##..",
      "..##ooo-------------##..",
      "..##ooo-------------##..",
      "..##ooo-------------##..",
      "..##ooo-------------##..",
      "..##ooo-------------##..",
      "..##++++++++++++++++##..",
      "..##++++++++++++++++##..",
      "..##ooo-------------##..",
      "..##ooo-------------##..",
      "..##ooo-------------##..",
      "..##ooo-------------##..",
      "..####################..",
      "..####################..",
      "...oooooooooooooooooo...",
      "...------------------...",
      "........................",
      "........................"
    ],
    manual: [
      "...##############.......",
      "...##-----------o#......",
      "...##-----------oo#.....",
      "...##-----------ooo#....",
      "...##-----------oooo#...",
      "...##--------------##...",
      "...##-++++++++-----##...",
      "...##--------------##...",
      "...##-++++++++++---##...",
      "...##--------------##...",
      "...##-++++++++++---##...",
      "...##--------------##...",
      "...##-++++++++++---##...",
      "...##--------------##...",
      "...##-++++++-------##...",
      "...##--------------##...",
      "...##-++++++++-----##...",
      "...##--------------##...",
      "...##--------------##...",
      "...##++++++++++++++##...",
      "...##################...",
      "...##################...",
      "........................",
      "........................"
    ],
    ledger: [
      "........................",
      "........................",
      "...oooooooooooooooooo...",
      "...##****############...",
      "...##################...",
      "...##################...",
      "...++++++++++++++++++...",
      "........................",
      ".....oooooooooooooooooo.",
      ".....##################.",
      ".....##################.",
      ".....##################.",
      ".....++++++++++++++++++.",
      "........................",
      "..oooooooooooooooooo....",
      "..##################....",
      "..##################....",
      "..##################....",
      "..++++++++++++++++++....",
      "........................",
      "........................",
      "........................",
      "........................",
      "........................"
    ],
    darknet: [
      "..........####..........",
      "........########........",
      ".......oo######++.......",
      "......oo########++......",
      ".....oo###....###++.....",
      "....oo##........##++....",
      "....o##..........##+....",
      "....o##..**..**..##+....",
      "....o##..........##+....",
      "....o###........###+....",
      ".....o###......###+.....",
      ".....o############+.....",
      "....oo############++....",
      "...oo##############++...",
      "..oo################++..",
      ".oo##################++.",
      ".o####################+.",
      ".######################.",
      ".++++++++++++++++++++++.",
      "........................",
      "........................",
      "........................",
      "........................",
      "........................"
    ]
  };
  function pxIcon(rows, cell) {
    const svg = document.createElementNS(SVGNS, "svg");
    const W = rows[0].length * cell;
    const H = rows.length * cell;
    svg.setAttribute("width", String(W));
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("aria-hidden", "true");
    const FILL = {
      "#": "currentColor",
      "*": "var(--ch-hot)",
      o: "color-mix(in srgb, var(--ch) 74%, var(--px-void))",
      "+": "var(--ch-dim)",
      "-": "var(--ch-faint)"
    };
    rows.forEach((row, y) => {
      let run = -1;
      let tone = "";
      for (let x = 0;x <= row.length; x++) {
        const c = x < row.length ? row[x] : ".";
        if (run >= 0 && c !== tone) {
          const r = document.createElementNS(SVGNS, "rect");
          r.setAttribute("x", String(run * cell));
          r.setAttribute("y", String(y * cell));
          r.setAttribute("width", String((x - run) * cell));
          r.setAttribute("height", String(cell));
          r.setAttribute("fill", FILL[tone]);
          svg.appendChild(r);
          run = -1;
        }
        if (c !== "." && run < 0) {
          run = x;
          tone = c;
        }
      }
    });
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

  // ../_shared/sound.ts
  var ctx = null;
  var uiBus = null;
  var gameBus = null;
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
      gameBus = ctx.createGain();
      gameBus.gain.value = 1;
      gameBus.connect(master);
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
    pieceFuse: preset({ wave: 2, baseFreq: 0.26, freqSlide: 0.3, arpMod: 0.5, arpSpeed: 0.6, sustain: 0.1, decay: 0.3, punch: 0.55, lpfCutoff: 0.55, volume: 0.52 }),
    rotate: preset({ wave: 0, baseFreq: 0.26, duty: 0.42, sustain: 0.008, decay: 0.055, freqSlide: -0.1, hpfCutoff: 0.1, volume: 0.44 }),
    cascadeEnd: preset({ wave: 0, baseFreq: 0.6, duty: 0.15, arpMod: 0.5, arpSpeed: 0.65, punch: 0.5, sustain: 0.06, decay: 0.3, volume: 0.5 }),
    endTurn: preset({ wave: 0, baseFreq: 0.22, duty: 0.3, freqSlide: 0.1, sustain: 0.03, decay: 0.12, volume: 0.4 }),
    aim: preset({ wave: 0, baseFreq: 0.4, duty: 0.45, sustain: 0.008, decay: 0.05, volume: 0.32 }),
    heartbeat: preset({ wave: 2, baseFreq: 0.12, punch: 0.5, sustain: 0.03, decay: 0.16, lpfCutoff: 0.35, volume: 0.6 }),
    unlock: preset({ wave: 0, duty: 0.1, baseFreq: 0.5, arpMod: 0.55, arpSpeed: 0.62, punch: 0.5, sustain: 0.1, decay: 0.4, volume: 0.5 }),
    trapSet: preset({ wave: 0, baseFreq: 0.12, duty: 0.1, sustain: 0.02, decay: 0.12, freqSlide: 0.06, lpfCutoff: 0.4, volume: 0.46 }),
    trapFire: preset({ wave: 3, baseFreq: 0.13, punch: 0.7, sustain: 0.08, decay: 0.42, freqSlide: -0.28, phaserOffset: 0.25, phaserSweep: -0.25, volume: 0.85 }),
    turnLost: preset({ wave: 3, baseFreq: 0.09, punch: 0.6, sustain: 0.1, decay: 0.55, freqSlide: -0.2, lpfCutoff: 0.55, volume: 0.8 }),
    redirect: preset({ wave: 1, baseFreq: 0.62, freqSlide: -0.42, sustain: 0.04, decay: 0.16, phaserOffset: 0.15, phaserSweep: -0.15, volume: 0.5 }),
    shieldCast: preset({ wave: 0, baseFreq: 0.2, duty: 0.05, freqSlide: 0.07, sustain: 0.06, decay: 0.16, hpfCutoff: 0.2, punch: 0.3, volume: 0.5 }),
    scanCast: preset({ wave: 2, baseFreq: 0.68, freqSlide: -0.14, vibDepth: 0.18, vibSpeed: 0.55, sustain: 0.15, decay: 0.4, volume: 0.44 }),
    overloadCast: preset({ wave: 3, baseFreq: 0.5, freqSlide: -0.3, sustain: 0.08, decay: 0.25, hpfCutoff: 0.35, phaserOffset: 0.4, phaserSweep: -0.3, volume: 0.55 }),
    overclockCast: preset({ wave: 0, duty: 0.25, baseFreq: 0.3, freqSlide: 0.32, sustain: 0.15, decay: 0.25, vibDepth: 0.1, vibSpeed: 0.6, volume: 0.5 }),
    firewallCast: preset({ wave: 3, baseFreq: 0.1, punch: 0.8, sustain: 0.06, decay: 0.35, lpfCutoff: 0.35, freqSlide: -0.12, volume: 0.8 }),
    backdoorCast: preset({ wave: 0, baseFreq: 0.5, duty: 0.15, arpMod: -0.35, arpSpeed: 0.5, sustain: 0.05, decay: 0.22, volume: 0.46 }),
    virusSting: preset({ wave: 1, baseFreq: 0.3, freqSlide: -0.18, vibDepth: 0.4, vibSpeed: 0.75, sustain: 0.18, decay: 0.35, hpfCutoff: 0.1, volume: 0.55 }),
    patchPlace: preset({ wave: 0, baseFreq: 0.34, duty: 0.2, freqSlide: 0.22, arpMod: 0.4, arpSpeed: 0.5, sustain: 0.06, decay: 0.22, punch: 0.45, lpfCutoff: 0.6, volume: 0.5 }),
    overParTick: preset({ wave: 3, baseFreq: 0.55, sustain: 0.008, decay: 0.05, punch: 0.25, hpfCutoff: 0.3, volume: 0.34 })
  };
  var BENCH = {
    solderPickup: preset({ wave: 0, baseFreq: 0.42, duty: 0.25, sustain: 0.012, decay: 0.07, punch: 0.25, volume: 0.4 }),
    solderHoverLegal: preset({ wave: 2, baseFreq: 0.58, freqSlide: 0.12, sustain: 0.01, decay: 0.06, arpMod: 0.3, arpSpeed: 0.7, volume: 0.32 }),
    solderHoverIllegal: preset({ wave: 1, baseFreq: 0.2, sustain: 0.012, decay: 0.05, freqSlide: -0.05, lpfCutoff: 0.3, volume: 0.24 }),
    solderArc: preset({ wave: 3, baseFreq: 0.7, sustain: 0.006, decay: 0.05, punch: 0.5, hpfCutoff: 0.35, volume: 0.42 }),
    solderReject: preset({ wave: 1, baseFreq: 0.18, sustain: 0.03, decay: 0.1, freqSlide: -0.12, hpfCutoff: 0.15, punch: 0.2, volume: 0.4 }),
    pageFlip: preset({ wave: 3, baseFreq: 0.5, sustain: 0.02, decay: 0.07, punch: 0.25, hpfCutoff: 0.4, volume: 0.28 }),
    winFocus: preset({ wave: 0, baseFreq: 0.22, duty: 0.5, sustain: 0.015, decay: 0.05, punch: 0.15, volume: 0.22 })
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
    if (!c || !buf || !uiBus || !gameBus)
      return;
    const src = c.createBufferSource();
    src.buffer = buf;
    const jitter = opts.jitter ? 1 + (Math.random() * 2 - 1) * opts.jitter : 1;
    src.playbackRate.value = (opts.rate ?? 1) * jitter;
    const gain = c.createGain();
    gain.gain.value = opts.vol ?? 1;
    src.connect(gain);
    gain.connect(opts.bus === "game" ? gameBus : uiBus);
    src.start(c.currentTime + (opts.at ?? 0));
  }

  // main.ts
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.getElementById("root");
  var stage = document.getElementById("stage");
  var FINAL_DAY = 10;
  var meta = {
    runCount: 7,
    stats: { runsWon: 0, divesCleared: 23, divesLost: 6, scans: 41 }
  };
  var MIDRUN = { active: true, runNumber: 7, day: 4, strain: 62, credits: 210 };
  var IDLE = { active: false, runNumber: 7, day: 1, strain: 100, credits: 0 };
  var STRAIN_ALARM_AT = 35;
  var STRAINED_VALUE = 28;
  var run = MIDRUN;
  var strained = false;
  function strainNow() {
    return strained ? STRAINED_VALUE : run.strain;
  }
  var TITLE_MIN_VISIBLE = 40;
  var BASE_Z = 100;
  var scaleK = 1;
  var crtOn = true;
  function topStripH() {
    return crtOn ? 52 : 40;
  }
  function dockZoneH() {
    const glyph = Math.max(36, Math.min(60, VP.h * 0.06));
    return glyph + 46 + (crtOn ? 18 : 6) + 10;
  }
  function usableDeskH() {
    return VP.h - topStripH() - dockZoneH();
  }
  function sizeToDesk(w) {
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
  function placeWindow(w) {
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
  function clampToDesk(w) {
    const { width, curH, usable } = sizeToDesk(w);
    const x = Math.max(0, Math.min(w.root.offsetLeft, VP.w - width - 8));
    const y = Math.max(4, Math.min(w.root.offsetTop, Math.max(4, usable - curH - 6)));
    w.root.style.left = `${x}px`;
    w.root.style.top = `${y}px`;
  }
  function reclampAll() {
    for (const w of wins)
      if (w.isOpen())
        clampToDesk(w);
  }
  var wins = [];
  var zOrder = [];
  var onDeskChange = null;
  function topId() {
    return zOrder.length ? zOrder[zOrder.length - 1] : null;
  }
  function applyZ() {
    for (const w of wins) {
      const idx = zOrder.indexOf(w.def.id);
      w.root.style.zIndex = String(idx === -1 ? BASE_Z : BASE_Z + idx + 1);
      w.root.classList.toggle("kp-fw-focused", w.def.id === topId() && w.isOpen());
    }
  }
  function makeWindow(desk, def) {
    const winRoot = el("div", "kp-fw");
    winRoot.style.display = "none";
    winRoot.style.width = `${def.w}px`;
    if (def.h)
      winRoot.style.height = `${def.h}px`;
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
      if (!openFlag)
        return;
      const wasTop = topId() === def.id;
      zOrder = [...zOrder.filter((x) => x !== def.id), def.id];
      applyZ();
      if (!wasTop) {
        winRoot.classList.remove("kp-fw-refocus");
        winRoot.offsetWidth;
        winRoot.classList.add("kp-fw-refocus");
        setTimeout(() => winRoot.classList.remove("kp-fw-refocus"), 240);
        play("winFocus");
      }
    };
    const open = () => {
      if (openFlag) {
        focus();
        return;
      }
      openFlag = true;
      winRoot.style.display = "flex";
      winRoot.style.animation = "none";
      winRoot.offsetWidth;
      winRoot.style.animation = "";
      placeWindow(win);
      zOrder = [...zOrder.filter((x) => x !== def.id), def.id];
      applyZ();
      play("winOpen");
      onDeskChange?.();
    };
    const close = () => {
      if (!openFlag)
        return;
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
      if (topId() !== def.id)
        focus();
    });
    let drag = null;
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".kp-fw-close"))
        return;
      if (e.pointerType === "mouse" && e.button !== 0)
        return;
      e.preventDefault();
      bar.setPointerCapture(e.pointerId);
      drag = {
        pointerId: e.pointerId,
        dx: e.clientX / scaleK - winRoot.offsetLeft,
        dy: e.clientY / scaleK - winRoot.offsetTop
      };
      winRoot.classList.add("kp-fw-dragging");
    });
    bar.addEventListener("pointermove", (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;
      const parentW = desk.clientWidth;
      const parentH = desk.clientHeight;
      const barH = bar.offsetHeight;
      const w = winRoot.offsetWidth;
      const x = Math.min(Math.max(e.clientX / scaleK - drag.dx, TITLE_MIN_VISIBLE - w), parentW - TITLE_MIN_VISIBLE);
      const y = Math.min(Math.max(e.clientY / scaleK - drag.dy, 0), parentH - Math.min(barH, TITLE_MIN_VISIBLE));
      winRoot.style.left = `${x}px`;
      winRoot.style.top = `${y}px`;
    });
    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;
      drag = null;
      winRoot.classList.remove("kp-fw-dragging");
    };
    bar.addEventListener("pointerup", endDrag);
    bar.addEventListener("pointercancel", endDrag);
    const win = { def, root: winRoot, body, open, close, isOpen: () => openFlag };
    wins.push(win);
    return win;
  }
  function ghostBody(win, note) {
    const g = el("div", "ds-ghost");
    g.appendChild(el("strong", "", `${win.def.title} BODY`));
    g.appendChild(el("p", "", note));
    const foot = win.def.h ? `FOOTPRINT ${win.def.w} x ${win.def.h}` : `FOOTPRINT ${win.def.w} WIDE`;
    g.appendChild(el("strong", "", foot));
    win.body.appendChild(g);
  }
  function seeded(id) {
    let s = 0;
    for (let i = 0;i < id.length; i++)
      s = s * 31 + id.charCodeAt(i) >>> 0;
    return () => {
      s = Math.imul(s, 1664525) + 1013904223 >>> 0;
      return s;
    };
  }
  function kpLockup(cell, wordPx) {
    const wrap = el("div", "kp-lockup");
    wrap.appendChild(kpMark(cell));
    const word = el("pre", "kp-lockup-word", `KERNEL
PANIC`);
    word.style.fontSize = `${wordPx}px`;
    wrap.appendChild(word);
    return wrap;
  }
  function showBoot(auto = true) {
    root.textContent = "";
    const boot = el("div", "kp-boot");
    boot.appendChild(el("i", "kp-boot-dither"));
    const inner = el("div", "kp-boot-inner");
    ticks(inner);
    inner.appendChild(kpLockup(4, 26));
    const lines = [
      ["REPAIR BENCH BIOS v9.2", null],
      ["KERNEL PANIC vDEMO desktop-v3", null],
      ["640K NEURAL BUFFER ... OK", "ok"],
      ["SIGNAL BUS ........... OK", "ok"],
      ["BACK ROOM LOCK ....... ENGAGED", "hazard"],
      ["MOUNTING SHOPFRONT ...", null]
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
  function showLogin() {
    root.textContent = "";
    const login = el("div", "kp-login");
    const head = el("div", "kp-login-head");
    head.appendChild(kpLockup(7, 38));
    head.appendChild(el("p", "kp-login-sub", "KP/OS v9.2 - SELECT USER"));
    login.appendChild(head);
    login.appendChild(el("p", "kp-build-stamp", "BUILD desktop-v3 demo"));
    const slots = el("div", "kp-login-slots");
    const occupied = (slotN, rows, dim) => {
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
      { label: "STRAIN", value: String(MIDRUN.strain) }
    ], "back room sealed"));
    slots.appendChild(occupied(2, [
      { label: "ATTEMPTS", value: String(meta.runCount) }
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
    const beginLogin = (slotN) => {
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
        if (typedUser < user.length)
          line1.appendChild(el("span", "kp-boot-cursor", "_"));
        term.appendChild(line1);
        if (typedUser >= user.length) {
          const line2 = el("p");
          line2.appendChild(el("span", "kp-login-label", "PASSWORD: "));
          line2.appendChild(document.createTextNode(PASSWORD.slice(0, typedPass)));
          if (typedPass < PASSWORD.length)
            line2.appendChild(el("span", "kp-boot-cursor", "_"));
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
  var paintChips = null;
  var currentSlot = 1;
  function showDesktop(slotN, mode) {
    currentSlot = slotN;
    root.textContent = "";
    wins = [];
    zOrder = [];
    const os = el("div", "kp-os");
    const wall = el("div", "kp-wallpaper");
    wall.appendChild(el("i", "kp-dither"));
    const reg = el("div", "kp-wallreg");
    for (let c = 0;c < 4; c++)
      reg.appendChild(el("i"));
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
      const pct = Math.round(day / FINAL_DAY * 100);
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
    const ticker = el("div", "kp-ticker");
    const tickerText = el("span");
    const stats = [
      ["ATTEMPTS", meta.runCount],
      ["MACHINE BEATEN", meta.stats.runsWon],
      ["JOBS CLEARED", meta.stats.divesCleared],
      ["DIVES LOST", meta.stats.divesLost],
      ["SCANS RUN", meta.stats.scans]
    ];
    stats.forEach(([l, v], i) => {
      if (i > 0)
        tickerText.appendChild(document.createTextNode(" // "));
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
    const dock = el("nav", "ds-dock");
    dock.setAttribute("aria-label", "Application dock");
    const iconDefs = [
      ["INBOX", "inbox", mode === "midrun" ? 2 : undefined, { id: "inbox", title: "INBOX", w: 1210 }],
      ["LOADOUT.CFG", "loadout", undefined, { id: "loadout", title: "LOADOUT.CFG", w: 860, h: 654 }],
      ["SOLDER.BAY", "solder", undefined, { id: "solder", title: "SOLDER.BAY", w: 1060 }],
      ["REPAIR.LOG", "report", undefined, { id: "report", title: "REPAIR.LOG", w: 1150 }],
      ["DAD.LOG", "journal", undefined, { id: "journal", title: "DAD.LOG", w: 1150 }],
      ["MANUAL.TXT", "manual", undefined, { id: "manual", title: "MANUAL.TXT", w: 760 }],
      ["LEDGER.LOG", "ledger", undefined, { id: "ledger", title: "LEDGER.LOG", w: 760 }],
      ["DARKNET.LNK", "darknet", undefined, { id: "darknet", title: "DARKNET.LNK", w: 680, notched: true }]
    ];
    const builtWins = new Map;
    const dockButtons = new Map;
    iconDefs.forEach(([label, key, badge, def], i) => {
      const b = el("button", "ds-dock-icon");
      b.type = "button";
      const glyph = el("span", "ds-dock-glyph");
      glyph.appendChild(pxIcon(PX_ICONS[key], 3));
      if (badge && badge > 0)
        glyph.appendChild(el("span", "kp-dicon-badge", String(badge)));
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
    onDeskChange = () => {
      const anyOpen = wins.some((w) => w.isOpen());
      poster.classList.toggle("ds-idle-hero", !anyOpen);
      dockButtons.forEach((btn, id) => {
        const running = builtWins.get(id)?.isOpen() ?? false;
        btn.classList.toggle("ds-running", running);
        btn.setAttribute("aria-pressed", running ? "true" : "false");
      });
    };
    root.appendChild(os);
    const usable = usableDeskH();
    const tiledAW = Math.min(860, VP.w - 460 - 34);
    const tiledAH = Math.min(654, usable - 22);
    const tiledBX = 10 + tiledAW + 14;
    const tiledBW = Math.min(460, VP.w - tiledBX - 10);
    const tiledBH = Math.min(560, usable - 22);
    const defs = {
      idle: [],
      midrun: [
        {
          def: { id: "inbox", title: "INBOX", w: 1210 },
          note: "The day loop's front window, sitting where a plain open lands: centered. Content lands with its own panel study."
        },
        {
          def: { id: "loadout", title: "LOADOUT.CFG", w: 860, h: 654 },
          note: "Chrome ghost at the loadout-eva study's measured 16:9 footprint, clamped to the desk between strip and dock. The real body is the LOADOUT.CFG (INSTRUMENT PANEL) study."
        }
      ],
      tiled: [
        {
          def: { id: "loadout", title: "LOADOUT.CFG", x: 10, y: 14, w: tiledAW, h: tiledAH },
          note: "Tiling proof, window A: loadout-eva's measured footprint, clamped to this desk."
        },
        {
          def: { id: "ledger", title: "LEDGER.LOG", x: tiledBX, y: 14, w: tiledBW, h: tiledBH },
          note: "Tiling proof, window B: LEDGER.LOG placeholder chrome at low density."
        }
      ]
    };
    for (const d of defs[mode]) {
      const w = makeWindow(desk, d.def);
      builtWins.set(d.def.id, w);
      ghostBody(w, d.note);
      w.open();
    }
    let menu = null;
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
      const item = (label, fn) => {
        const b = el("button", "", label);
        b.type = "button";
        b.addEventListener("click", () => fn(b));
        menu.appendChild(b);
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
    abandonBtn.addEventListener("click", () => {
      play("press");
      const modal = el("div", "kp-modal");
      modal.setAttribute("role", "dialog");
      const box = el("div", "kp-modal-box");
      box.appendChild(el("h3", "", "ABANDON THIS RUN?"));
      box.appendChild(el("p", "", `This ends attempt ${run.runNumber} exactly like a loss. Kit tiers, augments, credits ` + "and patch pieces all reset for the next attempt. The journal and the ledger keep what " + "they already hold."));
      const actions = el("div", "kp-modal-actions");
      const keep = el("button", "kp-btn2 kp-btn2-ghost", "KEEP DIVING");
      keep.type = "button";
      keep.addEventListener("click", () => {
        play("press");
        modal.remove();
      });
      const yes = el("button", "kp-btn2 kp-btn2-primary kp-btn2-danger", "ABANDON");
      yes.type = "button";
      yes.addEventListener("click", () => {
        play("deny");
        modal.remove();
      });
      actions.append(keep, yes);
      box.appendChild(actions);
      modal.appendChild(box);
      os.appendChild(modal);
    });
    onDeskChange();
  }
  function makeWallPoster() {
    const poster = el("div", "kp-wallposter");
    poster.appendChild(el("span", "kp-wallposter-tag", "KP/OS v9.2 // REPAIR BENCH"));
    const emblem = el("div", "kp-wallposter-emblem");
    emblem.appendChild(kpMark(13));
    poster.appendChild(emblem);
    const hero = el("div", "ds-heropair");
    const cellA = el("span");
    cellA.appendChild(el("span", "", "ATTEMPT"));
    const pairWrap = (label, val) => {
      const cell = el("span");
      cell.appendChild(el("span", "", label));
      const b = el("b", "", val);
      cell.appendChild(b);
      return cell;
    };
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
  function makeWallScope() {
    const SVGNS2 = "http://www.w3.org/2000/svg";
    const wrap = el("div", "kp-wallscope");
    const box = el("div", "kp-wallscope-box");
    const tag = el("div", "kp-wallscope-tag");
    tag.appendChild(el("span", "", "// SIGNAL BUS _"));
    const ok = el("span", "ds-ok", "OK");
    ok.appendChild(el("i", "kp-wallscope-pip"));
    tag.appendChild(ok);
    box.appendChild(tag);
    const svg = document.createElementNS(SVGNS2, "svg");
    const W = 352;
    const H = 84;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("height", String(H));
    const grid = (x1, y1, x2, y2) => {
      const l = document.createElementNS(SVGNS2, "line");
      l.setAttribute("x1", String(x1));
      l.setAttribute("y1", String(y1));
      l.setAttribute("x2", String(x2));
      l.setAttribute("y2", String(y2));
      l.setAttribute("class", "grid");
      svg.appendChild(l);
    };
    for (let x = 0;x <= W; x += 22)
      grid(x, 0, x, H);
    for (let y = 0;y <= H; y += 21)
      grid(0, y, W, y);
    const next = seeded("kp-desk-scope");
    const jitter = [];
    for (let i = 0;i <= W / 8; i++)
      jitter.push((next() % 100 / 100 - 0.5) * 8);
    const pts = [];
    for (let x = 0;x <= W; x += 8) {
      const base = 42 + Math.sin(x / W * Math.PI * 6) * 18;
      pts.push(`${x},${Math.round(base + jitter[x / 8])}`);
    }
    const poly = document.createElementNS(SVGNS2, "polyline");
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
      const m = String(Math.floor(tsec % 3600 / 60)).padStart(2, "0");
      const s = String(tsec % 60).padStart(2, "0");
      const text = `DAY 0${Math.min(run.day, FINAL_DAY)} ${h}:${m}:${s}`;
      if (clockVal.textContent !== text)
        clockVal.textContent = text;
    };
    paintClock();
    setInterval(() => {
      tsec = (tsec + 1) % 86400;
      paintClock();
    }, 1000);
    const hex = el("div", "kp-wallhex");
    const hnext = seeded("kp-desk-hex");
    for (let r = 0;r < 6; r++) {
      const groups = [];
      for (let g = 0;g < 3; g++)
        groups.push((hnext() % 65535).toString(16).toUpperCase().padStart(4, "0"));
      hex.appendChild(el("span", "", groups.join(" ")));
    }
    wrap.appendChild(hex);
    return wrap;
  }
  function radioRow(rowId, opts, initial, onPick) {
    const row = document.getElementById(rowId);
    row.textContent = "";
    for (const o of opts) {
      const b = el("button", o.id === initial ? "rig-on" : "", o.label);
      b.addEventListener("click", () => {
        row.querySelectorAll("button").forEach((x) => x.className = "");
        b.className = "rig-on";
        onPick(o);
      });
      row.appendChild(b);
    }
  }
  var SCHEMES = ["default", "nerv", "tokyo"];
  var scheme = "nerv";
  function setScheme(s) {
    scheme = s;
    if (s === "default")
      delete document.documentElement.dataset.scheme;
    else
      document.documentElement.dataset.scheme = s;
    const row = document.getElementById("schemerow");
    row.querySelectorAll("button").forEach((b, i) => {
      b.className = SCHEMES[i] === s ? "rig-on" : "";
    });
  }
  function schemeLabel() {
    return scheme === "default" ? "DEFAULT" : scheme === "nerv" ? "NERV" : "TOKYO NIGHT";
  }
  function cycleScheme() {
    play("pageFlip");
    setScheme(SCHEMES[(SCHEMES.indexOf(scheme) + 1) % SCHEMES.length]);
  }
  var glass = document.getElementById("glass");
  var glassLayers = Array.prototype.slice.call(glass.children);
  function setCrt(mode) {
    stage.classList.toggle("crt-on", mode !== "off");
    glass.textContent = "";
    if (mode !== "off")
      glassLayers.forEach((l) => glass.appendChild(l));
    crtOn = mode !== "off";
    reclampAll();
    measure();
  }
  var VIEWPORTS = [
    { id: "169", label: "16:9 1366x768", w: 1366, h: 768 },
    { id: "219", label: "21:9 2560x1080", w: 2560, h: 1080 },
    { id: "laptop", label: "LAPTOP 1280x800", w: 1280, h: 800 }
  ];
  var VP = VIEWPORTS[0];
  function fit() {
    const availW = Math.max(320, window.innerWidth - 332);
    const availH = Math.max(320, window.innerHeight - 90);
    scaleK = Math.min(1, availW / VP.w, availH / VP.h);
    const fitEl = document.getElementById("fit");
    const wrapEl = document.getElementById("fitwrap");
    fitEl.style.transform = `scale(${scaleK})`;
    wrapEl.style.width = `${Math.round(VP.w * scaleK)}px`;
    wrapEl.style.height = `${Math.round(VP.h * scaleK)}px`;
  }
  function measure() {
    fit();
    const meas = document.getElementById("meas");
    meas.innerHTML = "";
    meas.appendChild(document.createTextNode(`DESK ${VP.w}x${VP.h} / usable ${Math.round(usableDeskH())}px between strip and dock`));
  }
  function applyViewport(v) {
    VP = v;
    stage.style.width = `${v.w}px`;
    stage.style.height = `${v.h}px`;
    fit();
    measure();
    if (screenId === "idle" || screenId === "midrun" || screenId === "tiled") {
      setScreen(screenId);
    }
  }
  var screenId = "midrun";
  function setScreen(s) {
    screenId = s;
    if (s === "boot")
      showBoot();
    else if (s === "login")
      showLogin();
    else {
      run = s === "idle" ? IDLE : MIDRUN;
      showDesktop(s === "idle" ? 2 : 1, s);
    }
  }
  function syncScreenRow(s) {
    screenId = s;
    const row = document.getElementById("screenrow");
    const ids = ["boot", "login", "idle", "midrun", "tiled"];
    row.querySelectorAll("button").forEach((b, i) => {
      b.className = ids[i] === s ? "rig-on" : "";
    });
  }
  document.addEventListener("pointerdown", () => unlock(), { once: true });
  radioRow("schemerow", [
    { id: "default", label: "DEFAULT" },
    { id: "nerv", label: "NERV" },
    { id: "tokyo", label: "TOKYO NIGHT" }
  ], "nerv", (o) => setScheme(o.id));
  radioRow("crtrow", [
    { id: "flat", label: "FLAT" },
    { id: "off", label: "OFF" }
  ], "flat", (o) => setCrt(o.id));
  radioRow("vprow", VIEWPORTS.map((v) => ({ id: v.id, label: v.label })), "169", (o) => {
    applyViewport(VIEWPORTS.find((v) => v.id === o.id));
  });
  radioRow("screenrow", [
    { id: "boot", label: "BOOT" },
    { id: "login", label: "LOGIN" },
    { id: "idle", label: "DESK IDLE" },
    { id: "midrun", label: "DESK MID-RUN" },
    { id: "tiled", label: "DESK TILED" }
  ], "midrun", (o) => setScreen(o.id));
  radioRow("strainrow", [
    { id: "nominal", label: "NOMINAL" },
    { id: "strained", label: "STRAINED" }
  ], "nominal", (o) => {
    const wasArmed = strainNow() <= STRAIN_ALARM_AT;
    strained = o.id === "strained";
    const armed = strainNow() <= STRAIN_ALARM_AT;
    if (armed && !wasArmed)
      play("turnLost");
    paintChips?.();
  });
  document.getElementById("replayboot").addEventListener("click", () => {
    play("press");
    setScheme(scheme);
    showBoot();
    syncScreenRow("boot");
  });
  setScheme("nerv");
  setCrt("flat");
  applyViewport(VP);
  setScreen("midrun");
  window.addEventListener("resize", () => {
    fit();
    measure();
  });
})();
