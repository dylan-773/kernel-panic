import { SFXR_SAMPLE_RATE, SfxrParams, preset, renderSfxr } from "../../kernel-panic-site/app/src/game/sfxr";

/**
 * Demo-local player over the game's real sfxr renderer. Mirrors audio.ts's
 * bus gains (master 0.8, ui 0.7) so demo mix levels transfer 1:1 into the
 * game. Existing-preset params are copied from audio.ts's private P record;
 * bench presets are new and land in audio.ts only when a variation wins.
 */

let ctx: AudioContext | null = null;
let uiBus: GainNode | null = null;
let gameBus: GainNode | null = null;

function ensureCtx(): AudioContext | null {
  if (!ctx) {
    if (!window.AudioContext) return null;
    ctx = new AudioContext();
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
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function unlock(): void {
  ensureCtx();
}

/** Copied from audio.ts P (game palette) - do not tune these here. */
const GAME: Record<string, SfxrParams> = {
  tick: preset({ wave: 2, baseFreq: 0.62, sustain: 0.01, decay: 0.045, volume: 0.3 }),
  press: preset({ wave: 0, baseFreq: 0.32, duty: 0.35, sustain: 0.02, decay: 0.1, freqSlide: -0.15, volume: 0.42 }),
  deny: preset({ wave: 1, baseFreq: 0.16, sustain: 0.06, decay: 0.14, freqSlide: -0.05, volume: 0.42 }),
  winOpen: preset({ wave: 0, baseFreq: 0.3, duty: 0.2, freqSlide: 0.24, sustain: 0.05, decay: 0.13, volume: 0.4 }),
  winClose: preset({ wave: 0, baseFreq: 0.42, duty: 0.2, freqSlide: -0.24, sustain: 0.05, decay: 0.13, volume: 0.4 }),
  claimTick: preset({ wave: 0, baseFreq: 0.55, duty: 0.2, punch: 0.35, sustain: 0.02, decay: 0.13, volume: 0.42 }),
  pieceFuse: preset({ wave: 2, baseFreq: 0.26, freqSlide: 0.3, arpMod: 0.5, arpSpeed: 0.6, sustain: 0.1, decay: 0.3, punch: 0.55, lpfCutoff: 0.55, volume: 0.52 }),
  /* duel palette (dive.html study) - copied verbatim from audio.ts P */
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
  overParTick: preset({ wave: 3, baseFreq: 0.55, sustain: 0.008, decay: 0.05, punch: 0.25, hpfCutoff: 0.3, volume: 0.34 }),
};

/** Bench presets from the ux-agent's sfx items (ux-2026-07-28-craft-station). */
export const BENCH: Record<string, SfxrParams> = {
  solderPickup: preset({ wave: 0, baseFreq: 0.42, duty: 0.25, sustain: 0.012, decay: 0.07, punch: 0.25, volume: 0.4 }),
  solderHoverLegal: preset({ wave: 2, baseFreq: 0.58, freqSlide: 0.12, sustain: 0.01, decay: 0.06, arpMod: 0.3, arpSpeed: 0.7, volume: 0.32 }),
  solderHoverIllegal: preset({ wave: 1, baseFreq: 0.2, sustain: 0.012, decay: 0.05, freqSlide: -0.05, lpfCutoff: 0.3, volume: 0.24 }),
  solderArc: preset({ wave: 3, baseFreq: 0.7, sustain: 0.006, decay: 0.05, punch: 0.5, hpfCutoff: 0.35, volume: 0.42 }),
  solderReject: preset({ wave: 1, baseFreq: 0.18, sustain: 0.03, decay: 0.1, freqSlide: -0.12, hpfCutoff: 0.15, punch: 0.2, volume: 0.4 }),
  /* ux-2026-07-28-kpos-redesign: the two new shell cues */
  pageFlip: preset({ wave: 3, baseFreq: 0.5, sustain: 0.02, decay: 0.07, punch: 0.25, hpfCutoff: 0.4, volume: 0.28 }),
  winFocus: preset({ wave: 0, baseFreq: 0.22, duty: 0.5, sustain: 0.015, decay: 0.05, punch: 0.15, volume: 0.22 }),
};

const cache = new Map<string, AudioBuffer>();

function bufferFor(name: string): AudioBuffer | null {
  const c = ensureCtx();
  if (!c) return null;
  const params = BENCH[name] ?? GAME[name];
  if (!params) return null;
  let buf = cache.get(name) ?? null;
  if (!buf) {
    const data = renderSfxr(params);
    buf = c.createBuffer(1, data.length, SFXR_SAMPLE_RATE);
    buf.getChannelData(0).set(data);
    cache.set(name, buf);
  }
  return buf;
}

export interface PlayOpts {
  rate?: number;
  jitter?: number;
  vol?: number;
  at?: number;
  /** Mirrors audio.ts's buses: ui (quiet chrome) vs game (present). */
  bus?: "ui" | "game";
}

export function play(name: string, opts: PlayOpts = {}): void {
  const c = ensureCtx();
  const buf = bufferFor(name);
  if (!c || !buf || !uiBus || !gameBus) return;
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

/* ------------------------------------------------------------------ */
/* Duel composite voices - ported 1:1 from audio.ts so the dive study  */
/* sounds exactly like the shipped duel (stinger notes, drone tuning). */
/* ------------------------------------------------------------------ */

function tone(
  freq: number,
  dur: number,
  opts: { type?: OscillatorType; at?: number; vol?: number; slide?: number } = {},
): void {
  const c = ensureCtx();
  if (!c || !gameBus) return;
  const t0 = c.currentTime + (opts.at ?? 0);
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opts.type ?? "square";
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.slide) osc.frequency.exponentialRampToValueAtTime(opts.slide, t0 + dur);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(opts.vol ?? 0.5, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(gameBus);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Rising claim run: one tick per node, whole-tone steps, capped. */
export function playCascade(n: number): void {
  const steps = Math.min(n, 9);
  for (let i = 0; i < steps; i++) {
    play("claimTick", { rate: Math.pow(2, (i * 2) / 12), at: i * 0.048, vol: 0.9, bus: "game" });
  }
  if (n >= 4) play("cascadeEnd", { at: steps * 0.048, bus: "game" });
}

export function playStinger(won: boolean): void {
  if (won) {
    tone(392, 0.12, { vol: 0.5 });
    tone(523, 0.12, { at: 0.1, vol: 0.5 });
    tone(659, 0.14, { at: 0.2, vol: 0.55 });
    tone(784, 0.34, { at: 0.32, type: "triangle", vol: 0.6 });
    tone(1046, 0.4, { at: 0.42, type: "triangle", vol: 0.4 });
    play("unlock", { at: 0.45, vol: 0.7, bus: "game" });
  } else {
    tone(220, 0.18, { vol: 0.55 });
    tone(174, 0.2, { at: 0.16, vol: 0.55 });
    tone(116, 0.5, { at: 0.34, type: "sawtooth", vol: 0.6, slide: 60 });
    play("turnLost", { at: 0.3, vol: 0.8, bus: "game" });
  }
}

/** The machine's low presence while it takes its turn. */
let drone: { osc: OscillatorNode; lfo: OscillatorNode; gain: GainNode } | null = null;

export function startDrone(): void {
  if (drone) return;
  const c = ensureCtx();
  if (!c || !gameBus) return;
  const osc = c.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = 46;
  const lfo = c.createOscillator();
  lfo.frequency.value = 1.7;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 3.5;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.detune);
  const gain = c.createGain();
  gain.gain.value = 0;
  gain.gain.setTargetAtTime(0.16, c.currentTime, 0.25);
  osc.connect(gain);
  gain.connect(gameBus);
  osc.start();
  lfo.start();
  drone = { osc, lfo, gain };
}

export function stopDrone(): void {
  if (!drone || !ctx) return;
  const d = drone;
  drone = null;
  d.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
  const stopAt = ctx.currentTime + 0.6;
  d.osc.stop(stopAt);
  d.lfo.stop(stopAt);
}
