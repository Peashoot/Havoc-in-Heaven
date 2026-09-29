import { noise, outBack, rand, smooth, span, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { P, pose, walk } from '../rig/poses.ts';
import { fairy, immortal, INK } from './kit.ts';
import { motes } from './fxkit.ts';

/**
 * 07 门外 — a long cold corridor of columns in one-point perspective (each column pair is its
 * own depth plane, so the dolly makes them rush past). Wukong walks alone toward huge red
 * doors with a line of warm light in the gap; the doors swing open on the glittering
 * 蟠桃会 banquet — every seat taken, none for him.
 */

const VP = { x: 960, y: 520 };
const DOOR = { x: 960, top: 290, bot: 780, w: 380 };
// [z, xOffset, top, bottom, width]
const ROWS: [number, number, number, number, number][] = [
  [0.32, 190, 330, 770, 26], [0.45, 290, 270, 820, 36], [0.6, 410, 190, 880, 50],
  [0.8, 560, 90, 960, 70], [1.05, 760, -40, 1060, 100], [1.5, 1060, -260, 1320, 150],
];

const column = (x: number, top: number, bot: number, w: number) => `<g>
  <rect x="${x - w / 2}" y="${top}" width="${w}" height="${bot - top}" fill="#7a2a28" stroke="${INK}" stroke-width="${Math.max(2, w / 30)}"/>
  <rect x="${x + w * 0.1}" y="${top}" width="${w * 0.4}" height="${bot - top}" fill="#4a1c1e" opacity=".6"/>
  <rect x="${x - w * 0.36}" y="${top}" width="${w * 0.12}" height="${bot - top}" fill="#a4524a" opacity=".5"/>
  <rect x="${x - w * 0.62}" y="${bot - w * 0.35}" width="${w * 1.24}" height="${w * 0.35}" fill="#8d97a0" stroke="${INK}" stroke-width="2"/>
  <rect x="${x - w * 0.6}" y="${top - w * 0.2}" width="${w * 1.2}" height="${w * 0.25}" fill="#b89048" stroke="${INK}" stroke-width="2"/></g>`;

const bay = (z: number, dx: number, top: number, bot: number, w: number) => {
  const beamH = w * 0.7;
  return `${column(VP.x - dx, top, bot, w)}${column(VP.x + dx, top, bot, w)}
    <rect x="${VP.x - dx - w * 0.7}" y="${top - w * 0.2 - beamH}" width="${dx * 2 + w * 1.4}" height="${beamH}" fill="#5a2224" stroke="${INK}" stroke-width="3"/>
    <rect x="${VP.x - dx - w * 0.7}" y="${top - w * 0.2 - beamH * 0.55}" width="${dx * 2 + w * 1.4}" height="${beamH * 0.18}" fill="#c9a24e"/>
    <path d="M${VP.x - dx} ${top}Q${VP.x} ${top + w * 0.9} ${VP.x + dx} ${top}" fill="none" stroke="#3d1618" stroke-width="${w * 0.25}" opacity=".7"/>
    <g opacity="${Math.max(0, 0.62 - z * 0.45).toFixed(2)}">
      <rect x="${VP.x - dx - w * 0.7}" y="${top - w * 0.9}" width="${w * 1.4}" height="${bot - top + w * 0.9}" fill="#5a78a8"/>
      <rect x="${VP.x + dx - w * 0.7}" y="${top - w * 0.9}" width="${w * 1.4}" height="${bot - top + w * 0.9}" fill="#5a78a8"/>
      <rect x="${VP.x - dx - w * 0.7}" y="${top - w * 0.9}" width="${dx * 2 + w * 1.4}" height="${w * 0.75}" fill="#5a78a8"/></g>`;
};

const banquet = () => `<g clip-path="url(#s7-doorclip)">
  <rect x="${DOOR.x - DOOR.w}" y="${DOOR.top - 20}" width="${DOOR.w * 2}" height="${DOOR.bot - DOOR.top + 40}" fill="#8a2a1c"/>
  <ellipse cx="${DOOR.x}" cy="${DOOR.top + 200}" rx="${DOOR.w * 0.7}" ry="260" fill="#ffc860" opacity=".75" filter="url(#k-blur40)"/>
  ${[800, 880, 1040, 1120].map((x) => `<rect x="${x - 12}" y="${DOOR.top}" width="24" height="360" fill="#c23a24" stroke="${INK}" stroke-width="2"/><rect x="${x - 16}" y="${DOOR.top + 30}" width="32" height="10" fill="#f2c23a"/>`).join('')}
  <path d="M870 ${DOOR.top + 30}H1050V${DOOR.top + 130}H870Z" fill="#f2c23a" stroke="${INK}" stroke-width="3"/>
  <circle cx="960" cy="${DOOR.top + 80}" r="36" fill="#ff9b6a" stroke="${INK}" stroke-width="3"/><circle cx="960" cy="${DOOR.top + 80}" r="20" fill="#ffe8a0"/>
  ${Array.from({ length: 5 }, (_, i) => `<g><path d="M${780 + i * 90} ${DOOR.top}v40" stroke="#8a3a1a" stroke-width="2"/><ellipse cx="${780 + i * 90}" cy="${DOOR.top + 64}" rx="20" ry="26" fill="#e8402a" stroke="${INK}" stroke-width="2"/><rect x="${772 + i * 90}" y="${DOOR.top + 88}" width="16" height="6" fill="#f2c23a"/></g>`).join('')}
  ${Array.from({ length: 7 }, (_, i) => immortal(800 + i * 54, 640, 0.32, i, i > 3)).join('')}
  <path d="M760 640H1160L1180 670H740Z" fill="#8e2a1c" stroke="${INK}" stroke-width="3"/>
  ${Array.from({ length: 12 }, (_, i) => `<circle cx="${786 + i * 32}" cy="630" r="11" fill="${i % 3 ? '#ff9b8a' : '#f2c23a'}" stroke="${INK}" stroke-width="2"/>`).join('')}
  <path d="M740 670H1180V${DOOR.bot + 20}H740Z" fill="#c9a86a"/>
  ${fairy(860, 760, 0.62, 0, 's7-fairy')}${fairy(960, 770, 0.66, 1, 's7-fairy')}${fairy(1060, 760, 0.62, 2, 's7-fairy')}
</g>`;

const heroAt = (lf: number): Pose => {
  const k = span(lf, -12, 96);
  const x = 560 + k * 330, y = 1000 - k * 190, s = 0.86 - k * 0.42;
  if (lf < 96) return { ...walk(lf / 15, pose({ torso: 8, head: -4, mouth: 0.4 })), x, y, s, face: 1 };
  const shock = smooth(span(lf, 100, 112));
  return { ...P.stand, head: -10 + shock * 14, mouth: 0.4 - shock * 1.1, brow: shock * 0.6, uaF: -6, faF: -10, uaB: 10, faB: -10, x: 890, y: 810, s: 0.44, face: 1 };
};

const scene: SceneDef = {
  id: 7,
  bg: '#1c2638',
  markup: () => [
    plane(0.25, `<defs><clipPath id="s7-doorclip"><rect x="${DOOR.x - DOOR.w / 2}" y="${DOOR.top}" width="${DOOR.w}" height="${DOOR.bot - DOOR.top}"/></clipPath>
        <linearGradient id="s7-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a64"/><stop offset="1" stop-color="#121a28"/></linearGradient></defs>
      <rect x="-3000" y="-3000" width="8000" height="8000" fill="#26324a"/>
      <rect x="${DOOR.x - DOOR.w / 2 - 60}" y="${DOOR.top - 70}" width="${DOOR.w + 120}" height="${DOOR.bot - DOOR.top + 70}" fill="#4a1e1e" stroke="${INK}" stroke-width="4"/>
      <rect x="${DOOR.x - DOOR.w / 2 - 60}" y="${DOOR.top - 70}" width="${DOOR.w + 120}" height="40" fill="#b89048"/>
      ${banquet()}
      <g class="s7-doorL"><rect x="${DOOR.x - DOOR.w / 2}" y="${DOOR.top}" width="${DOOR.w / 2}" height="${DOOR.bot - DOOR.top}" fill="#9a2420" stroke="${INK}" stroke-width="4"/>
        ${Array.from({ length: 25 }, (_, i) => `<circle cx="${DOOR.x - DOOR.w / 2 + 30 + (i % 5) * 34}" cy="${DOOR.top + 50 + Math.floor(i / 5) * 90}" r="7" fill="#f2c23a"/>`).join('')}
        <circle cx="${DOOR.x - 30}" cy="${(DOOR.top + DOOR.bot) / 2}" r="18" fill="none" stroke="#f2c23a" stroke-width="5"/></g>
      <g class="s7-doorR"><rect x="${DOOR.x}" y="${DOOR.top}" width="${DOOR.w / 2}" height="${DOOR.bot - DOOR.top}" fill="#8a1f1b" stroke="${INK}" stroke-width="4"/>
        ${Array.from({ length: 25 }, (_, i) => `<circle cx="${DOOR.x + 30 + (i % 5) * 34}" cy="${DOOR.top + 50 + Math.floor(i / 5) * 90}" r="7" fill="#f2c23a"/>`).join('')}
        <circle cx="${DOOR.x + 30}" cy="${(DOOR.top + DOOR.bot) / 2}" r="18" fill="none" stroke="#f2c23a" stroke-width="5"/></g>
      <rect class="s7-gap" x="${DOOR.x - 4}" y="${DOOR.top}" width="8" height="${DOOR.bot - DOOR.top}" fill="#fff2c0"/>
      <rect class="s7-gapglow" x="${DOOR.x - 60}" y="${DOOR.top - 20}" width="120" height="${DOOR.bot - DOOR.top + 40}" fill="#ffd98a" filter="url(#k-blur16)"/>
      <rect class="s7-gapglow" x="${DOOR.x - 12}" y="${DOOR.top}" width="24" height="${DOOR.bot - DOOR.top}" fill="#fff4cc" filter="url(#k-blur6)"/>
      <path d="M${DOOR.x - 620} ${DOOR.bot}H${DOOR.x + 620}L2600 1400H-700Z" fill="url(#s7-floor)"/>
      <path class="s7-spill" d="M${DOOR.x - 10} ${DOOR.bot}H${DOOR.x + 10}L${DOOR.x + 260} 1400H${DOOR.x - 260}Z" fill="#ffd98a" opacity=".25" filter="url(#k-blur16)"/>
      <path d="${Array.from({ length: 13 }, (_, i) => `M${DOOR.x - 600 + i * 100} ${DOOR.bot}L${VP.x + (DOOR.x - 600 + i * 100 - VP.x) * 4} 1400`).join('')}" stroke="#4d6080" stroke-width="3" opacity=".6"/>`),
    ...ROWS.slice(0, 4).map(([z, dx, top, bot, w]) => plane(z, bay(z, dx, top, bot, w))),
    plane(1, heroMarkup('wukong', 'bima')),
    ...ROWS.slice(4).map(([z, dx, top, bot, w]) => plane(z, bay(z, dx, top, bot, w))),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const zoom = track([[-14, 0.92], [96, 1.18, 'inOut'], [118, 1.3], [150, 1.75, 'inOut'], [165, 1.8]], lf);
    return { x: VP.x + noise(lf * 0.03, 2) * 14 + track([[-14, -40], [120, 20]], lf), y: track([[-14, 600], [120, 560], [150, 560]], lf) + noise(lf * 0.03, 4) * 6, zoom };
  },
  heroes: (t) => [{ name: 'wukong', costume: 'bima', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const open = outBack(span(lf, 64, 100));
    const k = Math.max(0.08, 1 - open * 0.9);
    d.tf('.s7-doorL', `translate(${DOOR.x - DOOR.w / 2} 0) scale(${k.toFixed(3)} 1) translate(${-(DOOR.x - DOOR.w / 2)} 0)`);
    d.tf('.s7-doorR', `translate(${DOOR.x + DOOR.w / 2} 0) scale(${k.toFixed(3)} 1) translate(${-(DOOR.x + DOOR.w / 2)} 0)`);
    d.op('.s7-gap', 1 - smooth(span(lf, 64, 72)));
    d.op('.s7-gapglow', (0.5 + Math.sin(lf * 0.2) * 0.1) * (1 - open * 0.75));
    d.op('.s7-spill', 0.2 + open * 0.5);
    for (let i = 0; i < 3; i++) d.tf(`.s7-fairy-${i}`, `translate(${(Math.sin(lf * 0.12 + i * 2) * 14).toFixed(1)} ${(-Math.abs(Math.sin(lf * 0.12 + i)) * 8).toFixed(1)})`);
    void rand;
  },
  fx: (ctx, t, view) => {
    motes(ctx, view, t.lf, 36, 'rgba(180,200,240,A)', 17, 0.6, [0.2, -0.1], 2);
  },
};

export default scene;
