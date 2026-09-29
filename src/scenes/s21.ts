import { noise, outBack, outExpo, rand, shake, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { at, P, pose, poseTrack } from '../rig/poses.ts';
import { INK, soldier } from './kit.ts';
import { motes, sparks, whiteFrame } from './fxkit.ts';

/**
 * 21 凌霄宝殿 — the great doors blow in and Wukong lands in the middle of the vast throne
 * hall. Ranks upon ranks of soldiers line both sides, spears levelled at him; far away, up a
 * long stair, the Jade Emperor on his golden throne. Everything stops. In the silence the
 * camera pushes slowly in until his golden eyes fill the frame.
 */

const HERO = { x: 960, y: 960, s: 0.9 };
const EYES = { x: HERO.x + 21, y: HERO.y - 338 };
const LAND = 10, STILL = 40;

const KEYS: Key<Pose>[] = [
  [-10, at({ ...P.fly, staffA: 20 }, 960, 1400, 1.4)],
  [LAND, at({ ...P.crouch, staffA: 190 }, HERO.x, HERO.y, HERO.s), 'outExpo'],
  [LAND + 16, at({ ...P.heroic, staffA: -70, mouth: -0.3, brow: 1 }, HERO.x, HERO.y, HERO.s), 'outBack'],
  [STILL, at({ ...P.heroic, staffA: -86, mouth: -0.4, brow: 1, head: -6 }, HERO.x, HERO.y, HERO.s), 'inOut'],
  [130, at({ ...P.heroic, staffA: -88, mouth: -0.5, brow: 1, head: -8 }, HERO.x, HERO.y, HERO.s), 'inOut'],
];
const heroAt = (lf: number): Pose => ({ ...poseTrack(KEYS, lf), glow: 0.35 + smooth(span(lf, 70, 118)) * 0.65, wind: lf < STILL ? 0.8 : 0.15, staffGlow: 0.4 });

// ranks: [plane z, x from centre, floor y, scale, count, dx]
const RANKS: [number, number, number, number, number, number][] = [
  [0.3, 250, 716, 0.4, 16, 44], [0.42, 300, 750, 0.52, 14, 56], [0.56, 360, 800, 0.66, 12, 72],
  [0.72, 440, 860, 0.82, 10, 92], [0.9, 540, 930, 1.0, 9, 116], [1.3, 760, 1150, 1.5, 6, 190],
];

const throne = () => `<g transform="translate(960 330) scale(1.25) translate(-960 -470)">
  <path d="M760 520H1160L1320 700H600Z" fill="#f2efe4" stroke="${INK}" stroke-width="3"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${760 - i * 18} ${540 + i * 18}H${1160 + i * 18}" stroke="#c9c2a8" stroke-width="3"/>`).join('')}
  <path d="M840 380H1080V520H840Z" fill="url(#k-gold)" stroke="${INK}" stroke-width="4"/>
  <path d="M820 380C820 330 860 300 960 300C1060 300 1100 330 1100 380Z" fill="url(#k-gold)" stroke="${INK}" stroke-width="4"/>
  <circle cx="960" cy="330" r="200" fill="url(#k-glow-warm)" opacity=".4"/>
  <g transform="translate(960 500) scale(.7)">
    <path d="M-60 0C-56 -70 -40 -170 -24 -210H24C40 -170 56 -70 60 0Z" fill="#e0b030" stroke="${INK}" stroke-width="4"/>
    <circle cx="0" cy="-236" r="30" fill="#f0d0a8" stroke="${INK}" stroke-width="4"/>
    <path d="M-16 -222C-14 -190 -4 -176 0 -170C4 -176 14 -190 16 -222Z" fill="#1d1410"/>
    <path d="M-40 -266H40V-280H-40Z" fill="#1d1410"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${-36 + i * 12} -266v26" stroke="#f2c23a" stroke-width="3"/>`).join('')}
  </g></g>`;

const hallBack = () => `
  <rect x="-3000" y="-3000" width="9000" height="8000" fill="#3a0e0c"/>
  <path d="M-1000 700H2920V1600H-1000Z" fill="#6a5a3a"/>
  ${Array.from({ length: 22 }, (_, i) => `<path d="M${960 + (i - 11) * 40} 700L${960 + (i - 11) * 420} 1600" stroke="#8a7a52" stroke-width="3"/>`).join('')}
  ${Array.from({ length: 8 }, (_, i) => `<path d="M-1000 ${720 + i * i * 14}H2920" stroke="#8a7a52" stroke-width="3"/>`).join('')}
  <path d="M700 720L1220 720L1700 1600H220Z" fill="#9a2a1a" opacity=".85"/>
  <path d="M700 720L1220 720" stroke="#f2c23a" stroke-width="4"/>
  ${[-1, 1].map((side) => Array.from({ length: 6 }, (_, i) => { const x = 960 + side * (300 + i * i * 34 + i * 60), w = 20 + i * 12; return `<rect x="${x - w / 2}" y="${-200 - i * 60}" width="${w}" height="${920 + i * 90}" fill="#a0281c" stroke="${INK}" stroke-width="3"/><path d="M${x - w / 2} ${200 - i * 40}h${w}" stroke="#f2c23a" stroke-width="${3 + i}"/>`; }).join('')).join('')}
  <path d="M-1000 -200H2920V120C1600 60 320 60 -1000 120Z" fill="#5a1a14"/>
  ${Array.from({ length: 30 }, (_, i) => `<circle cx="${-800 + i * 130}" cy="${80 - Math.abs(i - 14) * 2}" r="14" fill="#f2c23a" opacity=".7"/>`).join('')}`;

const scene: SceneDef = {
  id: 21,
  bg: '#2a0a08',
  markup: () => [
    plane(0.2, `${hallBack()}${throne()}`),
    ...RANKS.map(([z, cx, y, s, n, dx], k) => plane(z, `<g class="s21-rank s21-rank-${k}">${[-1, 1].map((side) => Array.from({ length: n }, (_, i) => soldier(960 + side * (cx + i * dx) + (rand(k * 30 + i) - 0.5) * 10, y + (i % 2) * 6, s, k * 20 + i, side > 0, k > 1 ? 1 : 0)).join('')).join('')}</g>`)),
    plane(1, `<ellipse cx="${HERO.x}" cy="${HERO.y + 6}" rx="200" ry="24" fill="#1a0806" opacity=".5"/>
      <circle class="s21-aura" cx="${HERO.x}" cy="${HERO.y - 200}" r="300" fill="url(#k-glow-warm)" opacity=".2"/>
      ${heroMarkup('wukong', 'sage')}`),
    plane(1.5, `<g class="s21-doorL"><rect x="-200" y="-300" width="1160" height="1700" fill="#8a1f1b" stroke="${INK}" stroke-width="10"/>${Array.from({ length: 30 }, (_, i) => `<circle cx="${-80 + (i % 6) * 180}" cy="${-150 + Math.floor(i / 6) * 300}" r="22" fill="#f2c23a"/>`).join('')}</g>
      <g class="s21-doorR"><rect x="960" y="-300" width="1160" height="1700" fill="#9a2420" stroke="${INK}" stroke-width="10"/>${Array.from({ length: 30 }, (_, i) => `<circle cx="${1080 + (i % 6) * 180}" cy="${-150 + Math.floor(i / 6) * 300}" r="22" fill="#f2c23a"/>`).join('')}</g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const push = smooth(span(lf, STILL + 6, 124));
    const zoom = track([[-12, 1.2], [LAND, 0.94, 'outExpo'], [STILL, 1.0, 'inOut']], lf) * Math.pow(7.5, push * push);
    const x = track([[-12, 960], [STILL, 960]], lf) + (EYES.x - 960) * push;
    const y = track([[-12, 700], [LAND, 600, 'outExpo'], [STILL, 620, 'inOut']], lf) + (EYES.y - 620) * Math.min(1, push * 1.6);
    const still = lf < STILL ? 1 : 0.2;
    return { x: x + noise(lf * 0.05, 1) * 6 * still, y: y + noise(lf * 0.05, 2) * 5 * still, zoom };
  },
  shake: (t) => shake(t.lf, LAND, 30, 9),
  heroes: (t) => [{ name: 'wukong', costume: 'sage', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    // doors blow inward past the lens
    const blow = outExpo(span(lf, -10, 6));
    d.tf('.s21-doorL', `translate(${(-blow * 1400).toFixed(1)} ${(blow * 200).toFixed(1)}) rotate(${(-blow * 30).toFixed(1)} 0 500)`);
    d.tf('.s21-doorR', `translate(${(blow * 1400).toFixed(1)} ${(blow * 200).toFixed(1)}) rotate(${(blow * 30).toFixed(1)} 1920 500)`);
    d.op('.s21-doorL', 1 - span(lf, 4, 8)); d.op('.s21-doorR', 1 - span(lf, 4, 8));
    // soldiers flinch back on the landing, then lower spears toward him and freeze
    RANKS.forEach((_, k) => {
      const flinch = outBack(span(lf, LAND, LAND + 14)) * (1 - span(lf, LAND + 14, STILL)) * 10;
      d.tf(`.s21-rank-${k}`, `translate(0 ${(-flinch + (lf < STILL ? Math.sin(lf * 0.3 + k) * 3 : 0)).toFixed(1)})`);
    });
    d.op('.s21-aura', 0.2 + smooth(span(lf, 70, 118)) * 0.5);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    if (lf < STILL) motes(ctx, view, lf, 50, 'rgba(255,230,180,A)', 29, 0.8, [0.4, -0.6], 3);
    else motes(ctx, view, STILL, 50, 'rgba(255,230,180,A)', 29, 0.8, [0.4, -0.6], 3); // frozen in the stillness
    sparks(ctx, view, HERO.x, HERO.y, lf - LAND, 60, 22, 5);
    if (lf < 2) whiteFrame(ctx, 0.9 * (1 - span(lf, -10, 2)), '#fff4d8');
    // silence: the world dims around him as we push in
    whiteFrame(ctx, smooth(span(lf, STILL + 10, 118)) * 0.35, '#000000');
  },
};

export default scene;
