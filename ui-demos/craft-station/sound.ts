import { SFXR_SAMPLE_RATE, SfxrParams, preset, renderSfxr } from "../../kernel-panic-site/app/src/game/sfxr";

/**
 * Demo-local player over the game's real sfxr renderer. Mirrors audio.ts's
 * bus gains (master 0.8, ui 0.7) so demo mix levels transfer 1:1 into the
 * game. Existing-preset params are copied from audio.ts's private P record;
 * bench presets are new and land in audio.ts only when a variation wins.
 */

let ctx: AudioContext | null = null;
let uiBus: GainNode | null = null;

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
};

/** Bench presets from the ux-agent's sfx items (ux-2026-07-28-craft-station). */
export const BENCH: Record<string, SfxrParams> = {
  solderPickup: preset({ wave: 0, baseFreq: 0.42, duty: 0.25, sustain: 0.012, decay: 0.07, punch: 0.25, volume: 0.4 }),
  solderHoverLegal: preset({ wave: 2, baseFreq: 0.58, freqSlide: 0.12, sustain: 0.01, decay: 0.06, arpMod: 0.3, arpSpeed: 0.7, volume: 0.32 }),
  solderHoverIllegal: preset({ wave: 1, baseFreq: 0.2, sustain: 0.012, decay: 0.05, freqSlide: -0.05, lpfCutoff: 0.3, volume: 0.24 }),
  solderArc: preset({ wave: 3, baseFreq: 0.7, sustain: 0.006, decay: 0.05, punch: 0.5, hpfCutoff: 0.35, volume: 0.42 }),
  solderReject: preset({ wave: 1, baseFreq: 0.18, sustain: 0.03, decay: 0.1, freqSlide: -0.12, hpfCutoff: 0.15, punch: 0.2, volume: 0.4 }),
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
}

export function play(name: string, opts: PlayOpts = {}): void {
  const c = ensureCtx();
  const buf = bufferFor(name);
  if (!c || !buf || !uiBus) return;
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
