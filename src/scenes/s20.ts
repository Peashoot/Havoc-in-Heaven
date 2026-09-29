import { clamp, noise, outExpo, rand, shake, smooth, span } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { P, pose, walk } from '../rig/poses.ts';
import { hall, INK, soldier } from './kit.ts';
import { motes, shockRing, sparks, speedLines, staffSmear, whiteFrame } from './fxkit.ts';

/**
 * 20 一路打入凌霄殿 — the rampage. Wukong charges along the white-jade terrace toward the
 * throne hall; red columns whip past in the foreground. Five strikes, five hard cuts, and
 * each blow throws a squad into the air and adds a colour to the sky — red, gold, cyan,
 * blue, violet — until the heavens behind him are a banner of all of them.
 */

const GROUND = 900;
const SPEED = 46;
const STRIKES = [22, 56, 90, 124, 156];
const COLORS = ['#ff3a2a', '#ffc21a', '#2ae0e0', '#3a7aff', '#b04aff'];
const hx = (lf: number) => 300 + lf * SPEED - STRIKES.reduce((a, s) => a + Math.min(Math.max(lf - s, 0), 6) * SPEED * 0.8, 0);

const strikeAt = (lf: number) => {
  for (let k = 0; k < STRIKES.length; k++) { const d = lf - STRIKES[k]; if (d > -8 && d < 12) return { k, d }; }
  return null;
};
const heroAt = (lf: number): Pose => {
  const x = hx(lf), y = GROUND;
  const s = strikeAt(lf);
  const run = { ...walk(lf / 7, pose({ torso: 20, head: -6, staff: 1, staffA: 160, grip: 0.5, uaF: 30, faF: -60, brow: 1, mouth: -0.4 }), 1), x, y, s: 0.82, face: 1, wind: 1, staffGlow: 0.6 };
  if (!s) return run;
  const high = s.k % 2 === 0;
  const wind = { ...(high ? P.windup : P.crouch), staffA: high ? -150 : 196 };
  const hit = { ...P.strike, staffA: high ? 30 : -30 };
  const foll = { ...P.follow, staffA: high ? 80 : -80, uaF: high ? -30 : -150 };
  const a = s.d < 0 ? span(s.d, -8, 0) : span(s.d, 0, 12);
  const from = s.d < 0 ? run : hit, to = s.d < 0 ? wind : foll;
  const e = s.d < 0 ? a * a : outExpo(a);
  const out: Record<string, number> = {};
  for (const key of Object.keys(to) as (keyof Pose)[]) { const f = from[key] as number, t = to[key] as number; out[key] = typeof f === 'number' && typeof t === 'number' ? f + (t - f) * e : t; }
  if (s.d >= 0 && s.d < 1) Object.assign(out, hit);
  const back = s.d > 6 ? span(s.d, 6, 12) : 0;
  const res = { ...out, x, y, s: 0.82, face: 1, wind: 1, staffGlow: 1, brow: 1, mouth: -0.6 } as Pose;
  if (back > 0) for (const key of Object.keys(run) as (keyof Pose)[]) { const f = res[key] as number, t = run[key] as number; if (typeof f === 'number' && typeof t === 'number') (res as unknown as Record<string, number>)[key] = f + (t - f) * back; }
  return res;
};

// each strike sends a squad flying; squad stands ahead of the hero at strike time
const SQUADS = STRIKES.map((s, k) => Array.from({ length: 6 }, (_, i) => ({ x: hx(s) + 220 + i * 70 + (rand(k * 9 + i) - 0.5) * 30, y: GROUND - (i % 2) * 14, k, i })));
const flyOf = (k: number, i: number) => ({ vx: 26 + rand(k * 13 + i) * 20, vy: (k % 2 ? -34 : -18) - rand(k * 17 + i) * 18, spin: 18 + rand(k * 19 + i) * 20 });

// five shots with distinct framings (hard cuts between them)
const SHOTS = [
  { off: 260, y: 640, zoom: 1.0, rot: 0 },
  { off: 120, y: 760, zoom: 1.5, rot: -4 },
  { off: 340, y: 560, zoom: 0.8, rot: 3 },
  { off: 200, y: 720, zoom: 1.3, rot: 6 },
  { off: 240, y: 620, zoom: 1.1, rot: -2 },
];
const CUTS = [-99, 40, 74, 108, 141];
const shotOf = (lf: number) => { let k = 0; for (let i = 0; i < CUTS.length; i++) if (lf >= CUTS[i]) k = i; return k; };

const LEN = 9600;
const terrace = () => `
  <rect x="-1000" y="${GROUND}" width="${LEN}" height="800" fill="#e8ecee"/>
  ${Array.from({ length: 70 }, (_, i) => `<path d="M${-1000 + i * 150} ${GROUND}l-60 400" stroke="#c4ccd2" stroke-width="3"/>`).join('')}
  <path d="M-1000 ${GROUND + 40}H${LEN}M-1000 ${GROUND + 120}H${LEN}" stroke="#c4ccd2" stroke-width="3"/>
  <path d="M-1000 ${GROUND - 70}H${LEN}" stroke="#f6f8f8" stroke-width="16"/>
  ${Array.from({ length: 90 }, (_, i) => `<rect x="${-1000 + i * 110}" y="${GROUND - 80}" width="18" height="80" fill="#f6f8f8" stroke="#a8b4bc" stroke-width="2"/><circle cx="${-991 + i * 110}" cy="${GROUND - 86}" r="11" fill="#f6f8f8" stroke="#a8b4bc" stroke-width="2"/>`).join('')}`;
const crack = (x: number, k: number) => `<path class="s20-crk s20-crk-${k}" d="M${x} ${GROUND + 6}${Array.from({ length: 6 }, (_, i) => `l${(rand(k * 7 + i) - 0.5) * 120} ${14 + rand(k * 3 + i) * 30}`).join('')}M${x} ${GROUND + 6}l90 40l40 70M${x} ${GROUND + 6}l-80 30l-60 80" fill="none" stroke="#6a7480" stroke-width="5" opacity="0"/>`;

const scene: SceneDef = {
  id: 20,
  bg: '#1a2230',
  markup: () => [
    plane(0, `<rect x="-100" y="-100" width="2120" height="1280" fill="#22304a"/>
      ${COLORS.map((c, k) => `<rect class="s20-band s20-band-${k}" x="-100" y="${-100 + k * 170}" width="2120" height="${360}" fill="${c}" opacity="0" filter="url(#k-blur40)"/>`).join('')}`),
    plane(0.35, `${Array.from({ length: 7 }, (_, i) => hall(400 + i * 1500, 700, 1100, { glow: true })).join('')}
      <rect x="-3000" y="690" width="16000" height="600" fill="#cfd6dc"/>`),
    plane(1, `${terrace()}${STRIKES.map((s, k) => crack(hx(s) + 160, k)).join('')}
      ${SQUADS.flat().map((q) => `<g class="s20-q s20-q-${q.k}-${q.i}">${soldier(q.x, q.y, 0.8, q.k * 6 + q.i, true, 1)}</g>`).join('')}
      ${heroMarkup('wukong', 'sage')}`),
    plane(1.7, `<g>${Array.from({ length: 20 }, (_, i) => `<g transform="translate(${i * 940 + 500} 0)"><rect x="-70" y="-600" width="140" height="2400" fill="#b0281c" stroke="${INK}" stroke-width="6"/>
      <rect x="-40" y="-600" width="30" height="2400" fill="#d8503a" opacity=".6"/><rect x="-86" y="${GROUND + 180}" width="172" height="60" fill="#d8b050" stroke="${INK}" stroke-width="5"/></g>`).join('')}</g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const k = shotOf(lf), sh = SHOTS[k];
    const s = strikeAt(lf);
    const punch = s && s.d >= 0 ? (1 - outExpo(span(s.d, 0, 10))) * 0.12 : 0;
    const drift = lf - Math.max(CUTS[k], -14);
    return { x: hx(lf) + sh.off + drift * 1.5 + noise(lf * 0.1, 1) * 10, y: sh.y + noise(lf * 0.1, 2) * 8, zoom: sh.zoom * (1 + punch) + drift * 0.002, rot: sh.rot + (s && s.d >= 0 ? shake(lf, STRIKES[s.k], 1.5, 6)[0] : 0) };
  },
  shake: (t) => { const s = strikeAt(t.lf); return s ? shake(t.lf, STRIKES[s.k], 26, 7) : [0, 0]; },
  heroes: (t) => [{ name: 'wukong', costume: 'sage', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    COLORS.forEach((_, k) => d.op(`.s20-band-${k}`, smooth(span(lf, STRIKES[k], STRIKES[k] + 12)) * 0.7));
    SQUADS.flat().forEach((q) => {
      const tt = Math.max(0, lf - STRIKES[q.k] - q.i * 0.6);
      const { vx, vy, spin } = flyOf(q.k, q.i);
      d.tf(`.s20-q-${q.k}-${q.i}`, `translate(${(vx * tt).toFixed(1)} ${(vy * tt + 1.4 * tt * tt).toFixed(1)}) rotate(${(spin * tt).toFixed(1)} ${q.x} ${q.y - 80})`);
      d.op(`.s20-q-${q.k}-${q.i}`, 1 - smooth(span(tt, 16, 30)));
    });
    STRIKES.forEach((s, k) => d.op(`.s20-crk-${k}`, lf >= s ? 1 : 0));
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    motes(ctx, view, lf, 40, 'rgba(255,240,210,A)', 7, 1.2, [-8, 0], 2.5);
    staffSmear(ctx, view, heroAt, lf, 4);
    STRIKES.forEach((s, k) => {
      const since = lf - s, c = COLORS[k];
      const rgb = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
      const at = [hx(s) + 200, GROUND - 160] as const;
      shockRing(ctx, view, at[0], at[1], span(since, 0, 18), 700, rgb, 1, 0.5);
      sparks(ctx, view, at[0], at[1], since, 50, 28, 40 + k, 1, rgb.join(','));
      if (since === 0) whiteFrame(ctx, 0.28, c);
      const sc = view.toScreen(at[0], at[1]);
      speedLines(ctx, sc[0], sc[1], clamp(1 - Math.abs(since + 1) / 6) * 0.7, lf, rgb.join(','));
    });
  },
};

export default scene;
