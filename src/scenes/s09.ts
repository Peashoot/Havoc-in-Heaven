import { clamp, noise, outBack, outCubic, rand, shake, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { at, P, pose, poseTrack, walk } from '../rig/poses.ts';
import { cup, fairy, gourd, immortal, INK, peach, rays, wineJar } from './kit.ts';
import { motes, shockRing, sparks, speedLines, staffSmear, whiteFrame } from './fxkit.ts';

/**
 * 09 闹蟠桃会 — Wukong vaults onto the banquet table, rips off the stable-keeper's hat and
 * flings it away, runs the length of the table kicking the golden cups, summons the staff
 * and sweeps the feast into the air: peaches, dishes, a wine jar pouring an arc of wine;
 * immortals and fairies scatter. The elixir gourd tumbles up and bursts — the camera rides
 * into a spinning golden pill until it fills the frame (flash → the setting sun of 10).
 */

const TOP = 800; // table top (plane 1)
const S = 0.8;
const SWEEP = 71;
const IMPACT = { x: 1360, y: 690 };
const PILL = { x: 1500, y: 430 };
const RUN = { t0: 30, t1: 52, x0: 720, x1: 1150 };

const A: Key<Pose>[] = [
  [-14, at(pose({ ...P.crouch, staff: 0 }), 250, 1010, S)],
  [3, at(pose({ ...P.crouch, staff: 0, lean: 16, torso: 30 }), 270, 1010, S), 'inBack'],
  [11, at(pose({ ...P.jump, staff: 0, uaF: -150 }), 500, 620, S), 'outExpo'],
  [17, at(pose({ ...P.crouch, staff: 0, uaF: 20, faF: -40 }), 700, TOP, S), 'inCubic'],
  [23, at(pose({ uaF: -168, faF: -44, head: -12, torso: -4, brow: 1, mouth: -0.5 }), 710, TOP, S), 'outBack'],
  [29, at(pose({ uaF: 80, faF: -14, torso: 16, lean: 8, head: 4, brow: 0.9, mouth: 0.9 }), RUN.x0, TOP, S), 'outExpo'],
];
const B: Key<Pose>[] = [
  [RUN.t1, at({ ...P.heroic, staffLen: 0.05, mouth: 0.9 }, RUN.x1, TOP, S)],
  [58, at({ ...P.heroic, staffLen: 1, mouth: 0.9 }, RUN.x1, TOP, S), 'outBack'],
  [65, at({ ...P.windup, staffA: 186, uaF: 30, faF: -70, torso: -14, lean: -8 }, RUN.x1 - 30, TOP, S), 'inBack'],
  [SWEEP, at({ ...P.strike, staffA: -6, uaF: -70, faF: -10, plant: 1 }, RUN.x1 + 60, TOP, S), 'outExpo'],
  [80, at({ ...P.follow, staffA: -64, uaF: -140, faF: -20, torso: 18, head: -8, mouth: 0.9, brow: 0.8 }, RUN.x1 + 80, TOP, S), 'outBack'],
  [150, at({ ...P.follow, staffA: -74, uaF: -146, faF: -20, torso: 12, head: -12, mouth: 1, brow: 0.7 }, RUN.x1 + 80, TOP, S), 'inOut'],
];

const heroAt = (lf: number): Pose => {
  if (lf <= RUN.t0) return poseTrack(A, lf);
  if (lf < RUN.t1) {
    const k = span(lf, RUN.t0, RUN.t1);
    const run = walk(lf / 8, pose({ torso: 16, head: 2, mouth: 0.9, brow: 0.6, uaB: -30, faB: -50 }), 1);
    const ease = Math.min(1, span(lf, RUN.t0, RUN.t0 + 3));
    return { ...run, uaF: run.uaF * ease + 80 * (1 - ease), x: RUN.x0 + (RUN.x1 - RUN.x0) * k, y: TOP, s: S, face: 1 };
  }
  return poseTrack(B, lf);
};

// things on the table: [kind, x, t0 (launch frame), vx, vy, spin]
type Prop = { kind: 'cup' | 'peach' | 'dish' | 'jar'; x: number; t0: number; vx: number; vy: number; spin: number; s: number };
const runT = (x: number) => RUN.t0 + ((x - RUN.x0) / (RUN.x1 - RUN.x0)) * (RUN.t1 - RUN.t0);
const PROPS: Prop[] = [
  ...[820, 930, 1050].map((x, i) => ({ kind: 'cup' as const, x, t0: runT(x) - 1, vx: 10 + i * 3, vy: -22 - i * 4, spin: 22 + i * 6, s: 0.9 })),
  ...[1250, 1320, 1440, 1600, 1680, 1880, 1960, 2100].map((x, i) => {
    const d = Math.abs(x - IMPACT.x);
    return { kind: (i % 3 === 1 ? 'dish' : 'peach') as Prop['kind'], x, t0: SWEEP + d / 160, vx: 10 + rand(i + 3) * 16, vy: -20 - rand(i + 5) * 22, spin: (rand(i + 8) - 0.4) * 30, s: 0.7 + rand(i) * 0.2 };
  }),
];
const JAR = { x: 1520, t0: SWEEP + 2, vx: 9, vy: -30, spin: 11 };
const GOURD = { x: 1780, t0: SWEEP + 5 };
const G = 1.3;

const propAt = (p: { x: number; t0: number; vx: number; vy: number; spin: number }, lf: number, y0 = TOP) => {
  const t = Math.max(0, lf - p.t0);
  return { x: p.x + p.vx * t, y: y0 + p.vy * t + 0.5 * G * t * t, r: p.spin * t };
};
const jarMouth = (lf: number): [number, number] => {
  const j = propAt(JAR, lf, TOP + 6);
  const a = ((j.r - 180) * Math.PI) / 180; // mouth is 180 units above base; spin rotates it
  return [j.x + Math.sin(-a) * -180 * 0.9, j.y + Math.cos(a) * -180 * 0.9];
};
const gourdAt = (lf: number) => {
  const k = outCubic(span(lf, GOURD.t0, GOURD.t0 + 22));
  const fall = Math.max(0, lf - GOURD.t0 - 24);
  return { x: GOURD.x + (PILL.x + 60 - GOURD.x) * k + fall * 6, y: TOP + (PILL.y + 90 - TOP) * k + 0.5 * G * fall * fall, r: k * 400 + fall * 16 };
};
const POP = GOURD.t0 + 24;

const IMMORTALS = [[180, 0], [420, 1], [640, 2], [1640, 3], [1880, 0], [2120, 1]] as const;
const FAIRIES = [[900, 0], [1180, 1], [1420, 2]] as const;

const hall = () => `
  <rect x="-3000" y="-3000" width="9000" height="8000" fill="#3a0e0a"/>
  <rect x="-1000" y="40" width="4200" height="780" fill="#6a1a12"/>
  ${Array.from({ length: 12 }, (_, i) => `<g><rect x="${-900 + i * 360}" y="120" width="260" height="560" fill="#8a2a18" stroke="#c9a24e" stroke-width="6"/>
    <path d="${Array.from({ length: 6 }, (_, k) => `M${-900 + i * 360} ${200 + k * 80}h260M${-900 + i * 360 + 52 + (k % 5) * 44} 120v560`).join('')}" stroke="#c9a24e" stroke-width="3" opacity=".6"/></g>`).join('')}
  ${Array.from({ length: 12 }, (_, i) => `<rect x="${-940 + i * 360}" y="20" width="40" height="820" fill="#b0301e" stroke="${INK}" stroke-width="3"/>`).join('')}
  <rect x="-1000" y="0" width="4200" height="60" fill="#c9a24e" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="1100" cy="420" rx="1300" ry="420" fill="#ffb050" opacity=".25" filter="url(#k-blur40)"/>`;

const lanterns = (y: number, n: number, x0: number, dx: number, s: number) => Array.from({ length: n }, (_, i) => `<g transform="translate(${x0 + i * dx} ${y + (i % 2) * 30}) scale(${s})">
  <path d="M0 -200V-40" stroke="#4a1a10" stroke-width="3"/><ellipse cx="0" cy="0" rx="46" ry="56" fill="#e8402a" stroke="${INK}" stroke-width="3"/>
  <ellipse cx="0" cy="0" rx="20" ry="52" fill="none" stroke="#b02a1a" stroke-width="3"/><ellipse cx="0" cy="0" rx="26" ry="36" fill="#ffc060" opacity=".5"/>
  <rect x="-18" y="-62" width="36" height="10" fill="#f2c23a"/><rect x="-18" y="52" width="36" height="10" fill="#f2c23a"/><path d="M-8 62v40M0 62v48M8 62v40" stroke="#f2c23a" stroke-width="3"/></g>`).join('');

const table = () => `
  <path d="M-800 ${TOP}H2700V${TOP + 26}H-800Z" fill="#c9a24e" stroke="${INK}" stroke-width="4"/>
  <path d="M-800 ${TOP + 26}H2700V${TOP + 150}H-800Z" fill="#8e2a1c" stroke="${INK}" stroke-width="4"/>
  ${Array.from({ length: 30 }, (_, i) => `<path d="M${-780 + i * 120} ${TOP + 26}l40 60l40 -60" fill="#f2c23a" stroke="${INK}" stroke-width="2.5"/>`).join('')}
  <path d="M-800 ${TOP + 150}H2700V1400H-800Z" fill="#2a0c08"/>`;

const hatPath = `<path d="M-36 -94C-34 -128 44 -132 50 -96C30 -90 -16 -88 -36 -94Z" fill="#1f2328" stroke="${INK}" stroke-width="3"/>
  <path d="M-34 -100C-70 -104 -96 -98 -104 -90C-90 -86 -60 -90 -34 -92Z" fill="#1f2328"/><path d="M48 -104C82 -110 106 -104 114 -96C100 -90 72 -94 48 -96Z" fill="#1f2328"/>`;

const scene: SceneDef = {
  id: 9,
  bg: '#2a0c08',
  markup: () => [
    plane(0.25, hall()),
    plane(0.5, lanterns(170, 12, -700, 360, 1)),
    plane(0.8, `${IMMORTALS.map(([x, i], k) => `<g class="s9-im s9-im-${k}">${immortal(x, 790, 1.15, i, x > 1200)}</g>`).join('')}
      ${FAIRIES.map(([x, i]) => fairy(x, 800, 1.1, i, 's9-fy')).join('')}`),
    plane(1, `${table()}
      ${PROPS.map((p, i) => `<g class="s9-p s9-p-${i}">${p.kind === 'cup' ? cup(0, 0, p.s) : p.kind === 'peach' ? peach(0, -40 * p.s, p.s) : `<ellipse cx="0" cy="-6" rx="${70 * p.s}" ry="${16 * p.s}" fill="#e8c860" stroke="${INK}" stroke-width="3"/>${peach(-24 * p.s, -40 * p.s, 0.6 * p.s)}${peach(28 * p.s, -40 * p.s, 0.6 * p.s)}`}</g>`).join('')}
      <g class="s9-jar">${wineJar(0, 0, 1)}</g>
      <g class="s9-gourd">${gourd(0, 70, 0.9)}</g>
      ${heroMarkup('wukong', 'bima')}
      <g class="s9-hat"><g transform="scale(${S})">${hatPath}</g></g>
      <g class="s9-pill" opacity="0">
        <circle r="170" fill="url(#k-glow-warm)" opacity=".9"/>
        <g class="s9-pillrays">${rays(0, 0, 420, 18, '#fff2c4', 0.35, 9)}</g>
        <circle r="70" fill="url(#s9-pillgrad)" stroke="#8a5a10" stroke-width="3"/>
        <ellipse class="s9-mer s9-mer-0" rx="70" ry="70" fill="none" stroke="#b07a10" stroke-width="3" opacity=".7"/>
        <ellipse class="s9-mer s9-mer-1" rx="70" ry="70" fill="none" stroke="#b07a10" stroke-width="3" opacity=".7"/>
        <ellipse class="s9-mer s9-mer-2" rx="70" ry="70" fill="none" stroke="#b07a10" stroke-width="3" opacity=".7"/>
        <ellipse rx="70" ry="18" fill="none" stroke="#b07a10" stroke-width="3" opacity=".6"/>
        <ellipse cx="-24" cy="-28" rx="22" ry="14" fill="#fffbe0" opacity=".8" transform="rotate(-30 -24 -28)"/>
      </g>
      <defs><radialGradient id="s9-pillgrad" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#fffbe0"/><stop offset=".4" stop-color="#ffd24a"/><stop offset="1" stop-color="#c07a10"/></radialGradient></defs>`),
    plane(1.7, `<g class="s9-fg">${lanterns(-60, 6, -200, 700, 1.6)}
      <rect x="-420" y="-400" width="160" height="2000" fill="#6a140c" stroke="${INK}" stroke-width="4"/></g>
      <g class="s9-fgpeach">${peach(0, 0, 2.6)}</g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const hx = heroAt(Math.min(lf, 90)).x;
    const x = track([[-14, 640], [12, 640], [30, hx + 60, 'inOut'], [52, RUN.x1 + 60], [80, 1300, 'inOut'], [88, 1320], [104, PILL.x, 'inOut'], [150, PILL.x]], lf);
    const y = track([[-14, 700], [11, 620], [17, 640], [30, 620, 'inOut'], [80, 620], [88, 590], [104, PILL.y, 'inOut'], [150, PILL.y]], lf);
    const zoom = track([[-14, 1.22], [17, 1.4, 'outBack'], [52, 1.3], [65, 1.4, 'inOut'], [SWEEP, 1.08, 'outExpo'], [88, 1.0], [104, 1.5, 'inOut'], [150, 3.3, 'inCubic']], lf);
    return { x: x + noise(lf * 0.05, 5) * 8, y: y + noise(lf * 0.05, 9) * 5, zoom, rot: lf > SWEEP ? shake(lf, SWEEP, 1.2, 10)[0] : 0 };
  },
  shake: (t) => shake(t.lf, SWEEP, 26, 10),
  heroes: (t) => [{ name: 'wukong', costume: 'bima', pose: { ...heroAt(t.lf), staffGlow: smooth(span(t.lf, 52, 60)) * 0.7 } }],
  update: (d, t) => {
    const lf = t.lf;
    d.all('.hero').forEach((h) => h.classList.toggle('nohat', lf >= 24));
    // hat: ripped off at 24, flung up-left spinning
    const ht = Math.max(0, lf - 24), hp = heroAt(Math.min(lf, 24));
    d.tf('.s9-hat', `translate(${(hp.x + 20 - ht * 16).toFixed(1)} ${(hp.y - 300 - ht * 26 + 0.5 * G * ht * ht).toFixed(1)}) rotate(${(-ht * 24).toFixed(1)})`);
    d.op('.s9-hat', lf >= 24 && ht < 40 ? 1 : 0);
    PROPS.forEach((p, i) => {
      const q = propAt(p, lf);
      d.tf(`.s9-p-${i}`, `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${q.r.toFixed(1)})`);
    });
    const j = propAt(JAR, lf, TOP + 6);
    d.tf('.s9-jar', `translate(${j.x.toFixed(1)} ${j.y.toFixed(1)}) rotate(${j.r.toFixed(1)} 0 -80)`);
    const g = gourdAt(lf);
    d.tf('.s9-gourd', `translate(${g.x.toFixed(1)} ${g.y.toFixed(1)}) rotate(${g.r.toFixed(1)})`);
    d.op('.s9-gourd', lf > POP + 20 ? 0 : 1);
    // immortals and fairies scatter from the sweep
    IMMORTALS.forEach(([x], k) => {
      const tt = Math.max(0, lf - SWEEP - Math.abs(x - IMPACT.x) / 200);
      const dir = x < IMPACT.x ? -1 : 1;
      const hop = Math.abs(Math.sin(tt * 0.35)) * 30 * Math.min(1, tt / 4);
      d.tf(`.s9-im-${k}`, `translate(${(dir * tt * 14).toFixed(1)} ${(-hop).toFixed(1)}) rotate(${(dir * Math.min(tt, 6) * 3).toFixed(1)} ${x} 790)`);
    });
    FAIRIES.forEach(([x], k) => {
      const tt = Math.max(0, lf - SWEEP - 2 - k * 2);
      const dir = x < IMPACT.x ? -1 : 1;
      d.tf(`.s9-fy-${k}`, `translate(${(dir * tt * 9 + Math.sin(lf * 0.15 + k) * 8).toFixed(1)} ${(-tt * 7 - Math.abs(Math.sin(lf * 0.1 + k)) * 10).toFixed(1)})`);
    });
    // the pill: pops from the gourd, then spins and grows to fill the frame
    const pop = outBack(span(lf, POP, POP + 10));
    const grow = 1 + smooth(span(lf, POP + 10, 150)) * 1.3;
    d.op('.s9-pill', lf >= POP ? 1 : 0);
    d.tf('.s9-pill', `translate(${PILL.x} ${PILL.y}) scale(${(pop * grow).toFixed(3)})`);
    for (let k = 0; k < 3; k++) d.attr(`.s9-mer-${k}`, 'rx', (70 * Math.abs(Math.cos(lf * 0.12 + (k * Math.PI) / 3))).toFixed(1));
    d.tf('.s9-pillrays', `rotate(${(lf * 1.5).toFixed(1)})`);
    d.tf('.s9-fg', `translate(${(-lf * 2).toFixed(1)} 0)`);
    const fp = Math.max(0, lf - SWEEP - 3);
    d.tf('.s9-fgpeach', `translate(${(1500 + fp * 60).toFixed(1)} ${(560 - fp * 24 + 0.5 * G * fp * fp).toFixed(1)}) rotate(${(fp * 14).toFixed(1)})`);
    d.op('.s9-fgpeach', lf > SWEEP + 3 && fp < 22 ? 1 : 0);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf, since = lf - SWEEP;
    motes(ctx, view, lf, 40, 'rgba(255,200,120,A)', 31, 0.8, [0.6, -0.4], 3);
    if (lf > 60 && lf < 92) staffSmear(ctx, view, heroAt, lf, 5);
    const imp = view.toScreen(IMPACT.x, IMPACT.y);
    speedLines(ctx, imp[0], imp[1], clamp(1 - Math.abs(lf - SWEEP + 2) / 10) * 0.8, lf, '255,230,170');
    shockRing(ctx, view, IMPACT.x, IMPACT.y, span(since, 0, 26), 900, [255, 214, 110], 1, 0.5);
    sparks(ctx, view, IMPACT.x, IMPACT.y, since, 70, 26, 9);
    if (since >= 0 && since < 2) whiteFrame(ctx, 0.42, '#fff3cf');
    // wine arc: the jar mouth's recent path, poured out as a ribbon
    if (lf > JAR.t0 + 2) {
      view.apply(ctx, 1);
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const n = 16;
      for (let k = 0; k < n; k++) {
        const a = jarMouth(lf - k * 0.8), b = jarMouth(lf - (k + 1) * 0.8);
        const drop = (k * 0.8) ** 2 * 0.5 * G;
        ctx.strokeStyle = `rgba(150,24,56,${(0.9 * (1 - k / n)).toFixed(3)})`;
        ctx.lineWidth = 22 * (1 - k / n) + 4;
        ctx.beginPath(); ctx.moveTo(a[0], a[1] + drop); ctx.lineTo(b[0], b[1] + (((k + 1) * 0.8) ** 2) * 0.5 * G); ctx.stroke();
      }
      for (let k = 0; k < 14; k++) {
        const m = jarMouth(lf - 2 - k);
        const tt = 2 + k;
        ctx.fillStyle = 'rgba(180,40,70,.8)';
        ctx.beginPath(); ctx.arc(m[0] + (rand(k) - 0.5) * 30 * tt * 0.3, m[1] + 0.5 * G * tt * tt, 7 - k * 0.3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    // the pill bursts out of the gourd
    sparks(ctx, view, PILL.x, PILL.y, lf - POP, 60, 18, 41, 1, '255,236,160');
    shockRing(ctx, view, PILL.x, PILL.y, span(lf, POP, POP + 18), 500, [255, 230, 150], 1, 0.4);
    if (lf > 130) whiteFrame(ctx, smooth(span(lf, 130, 150)) * 0.35, '#fff1c0');
  },
};

export default scene;
