export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Normalised position of n inside [a, b], clamped to 0..1. */
export const span = (n: number, a: number, b: number) => clamp((n - a) / (b - a));

export type Ease = (t: number) => number;

export const linear: Ease = (t) => clamp(t);
export const smooth: Ease = (t) => { const k = clamp(t); return k * k * (3 - 2 * k); };
export const inOut: Ease = (t) => { const k = clamp(t); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
export const inCubic: Ease = (t) => clamp(t) ** 3;
export const outCubic: Ease = (t) => 1 - (1 - clamp(t)) ** 3;
export const outExpo: Ease = (t) => { const k = clamp(t); return k === 1 ? 1 : 1 - 2 ** (-10 * k); };
export const inExpo: Ease = (t) => { const k = clamp(t); return k === 0 ? 0 : 2 ** (10 * k - 10); };
/** Pulls back first (anticipation). */
export const inBack: Ease = (t) => { const k = clamp(t), c = 1.9; return (c + 1) * k * k * k - c * k * k; };
/** Shoots past the target and settles (overshoot). */
export const outBack: Ease = (t) => { const k = clamp(t) - 1, c = 1.9; return 1 + (c + 1) * k * k * k + c * k * k; };
/** Damped spring settle: overshoots then rings down. */
export const outSpring: Ease = (t) => { const k = clamp(t); return k === 1 ? 1 : 1 - Math.exp(-6 * k) * Math.cos(k * 11); };

export const EASES = { linear, smooth, inOut, inCubic, outCubic, outExpo, inExpo, inBack, outBack, outSpring };
export type EaseName = keyof typeof EASES;

/**
 * Keyframe track: [[time, value, easeIntoThisKey?], ...] sorted by time.
 * Values may be numbers or equal-length number records; the ease named on a key
 * shapes the segment arriving at that key.
 */
export type Key<T> = [number, T, EaseName?];

export function track(keys: Key<number>[], t: number): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i];
    if (t <= t1) {
      const [t0, v0] = keys[i - 1];
      return lerp(v0, v1, EASES[e ?? 'inOut']((t - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
}

export function trackRec<T extends Record<string, number>>(keys: Key<T>[], t: number): T {
  if (t <= keys[0][0]) return { ...keys[0][1] };
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i];
    if (t <= t1) {
      const [t0, v0] = keys[i - 1];
      const k = EASES[e ?? 'inOut']((t - t0) / (t1 - t0));
      const out = {} as Record<string, number>;
      for (const name of Object.keys(v1)) out[name] = lerp(v0[name] ?? v1[name], v1[name], k);
      return out as T;
    }
  }
  return { ...keys[keys.length - 1][1] };
}

/** Deterministic hash noise in 0..1. */
export const rand = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
/** Smooth 1D value noise in -1..1 for camera drift / hand-held feel. */
export function noise(x: number, seed = 0): number {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(rand(i + seed * 57.3), rand(i + 1 + seed * 57.3), u) * 2 - 1;
}
/** Exponentially decaying camera shake around frame `at`. */
export function shake(frame: number, at: number, strength: number, decay = 10): [number, number] {
  const d = frame - at;
  if (d < 0) return [0, 0];
  const a = strength * Math.exp(-d / decay);
  return [Math.sin(d * 2.7 + 1.3) * a, Math.cos(d * 3.4) * a * 0.8];
}
