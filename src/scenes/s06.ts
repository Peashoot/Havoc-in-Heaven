import { noise, rand, smooth, span, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, solve, type Pose } from '../rig/hero.ts';
import { P, pose, poseTrack, walk } from '../rig/poses.ts';
import { cloud, cloudSea, hall, haze, immortal, INK, orb, pagoda, sky } from './kit.ts';
import { motes } from './fxkit.ts';

/**
 * 06 弼马温 — Wukong, proud in his little official's robe, runs with the galloping celestial
 * horses across the cloud stables, cracking his whip. The camera pulls far back: towering
 * palace terraces rise above, officials look down on him, their shadow falls over the
 * stables and the colour drains toward grey-gold.
 */

const GROUND = 900;
const HORSES = [
  { x: 380, y: GROUND + 10, s: 0.9, ph: 0.0 }, { x: 760, y: GROUND - 30, s: 0.72, ph: 0.35 }, { x: 1380, y: GROUND + 20, s: 1.0, ph: 0.6 },
  { x: 1720, y: GROUND - 20, s: 0.78, ph: 0.15 }, { x: 60, y: GROUND - 40, s: 0.68, ph: 0.8 }, { x: 1060, y: GROUND - 50, s: 0.62, ph: 0.5 },
];
const RUN = 7.5; // px per frame the herd advances

const horse = (i: number) => {
  const leg = (cls: string, x: number, y: number) => `<g class="${cls}" transform="translate(${x} ${y})"><path d="M-9 0L-7 60L7 60L9 0Z" fill="#eef0ec" stroke="${INK}" stroke-width="3"/>
    <g class="kn" transform="translate(0 58)"><path d="M-7 0L-5 54L5 54L7 0Z" fill="#eef0ec" stroke="${INK}" stroke-width="3"/><path d="M-9 50h18v12h-18z" fill="#f2c23a" stroke="${INK}" stroke-width="2.5"/></g></g>`;
  return `<g class="s6-h s6-h-${i}"><g class="s6-hb">
    ${leg('lb2', -70, -10)}${leg('lf2', 64, -10)}
    <path d="M-110 -70C-130 -90 -170 -80 -186 -40C-170 -60 -150 -56 -130 -46" fill="#f5d67e" stroke="${INK}" stroke-width="3"/>
    <path d="M-120 -40C-124 -90 -70 -110 0 -106C70 -110 110 -90 118 -50C120 -10 90 10 0 12C-90 10 -118 -4 -120 -40Z" fill="#f6f6f2" stroke="${INK}" stroke-width="3.5"/>
    <path d="M-100 -10C-40 6 40 6 100 -6" fill="none" stroke="#c9d3da" stroke-width="10" opacity=".8"/>
    <path d="M90 -90C110 -140 130 -170 160 -178C190 -182 210 -160 206 -140C200 -126 180 -126 168 -130C150 -110 130 -80 116 -56Z" fill="#f6f6f2" stroke="${INK}" stroke-width="3.5"/>
    <path d="M160 -178L152 -200L172 -184Z" fill="#f6f6f2" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="178" cy="-160" r="4" fill="${INK}"/>
    <path class="s6-mane" d="M96 -96C80 -120 96 -150 120 -168C110 -150 110 -130 124 -114C108 -118 104 -104 112 -86Z" fill="#f5d67e" stroke="${INK}" stroke-width="2.5"/>
    ${leg('lb', -80, -6)}${leg('lf', 74, -6)}
    <ellipse cx="0" cy="${80}" rx="120" ry="16" fill="#fff" opacity=".7" filter="url(#k-blur6)"/>
  </g></g>`;
};

const heroAt = (lf: number): Pose => {
  const anger = smooth(span(lf, 76, 96));
  const run = walk(Math.min(lf, 94) / 11, pose({ torso: 14, head: -6, mouth: 1, brow: 0.1, uaF: -70, faF: -30 }), 1);
  const running = { ...run, uaF: -80 + Math.sin(Math.min(lf, 94) * 0.4) * 30, faF: -40, x: 700 + Math.min(lf, 94) * RUN * 0.95, y: GROUND, s: 0.72, face: 1, mouth: 1 - anger * 1.7, brow: 0.1 + anger * 0.9 };
  if (lf < 94) return running;
  const stopX = 700 + 94 * RUN * 0.95;
  const base = { x: stopX, y: GROUND, s: 0.72, staff: 0, mouth: -0.7, brow: 1 };
  return poseTrack([
    [94, running],
    [104, { ...P.angry, ...base }, 'inOut'],
    [116, { ...P.crouch, ...base, face: -1, twoHand: 0 }, 'inBack'],
    [126, { ...P.jump, ...base, x: stopX - 200, y: GROUND - 120, face: -1 }, 'outCubic'],
    [164, { ...P.fly, ...base, x: stopX - 2150, y: GROUND - 400, face: -1, wind: 0.8 }, 'inCubic'],
  ], lf);
};

const terraces = () => `
  <path d="M-1400 250H3300V-1400H-1400Z" fill="#b8a98a"/>
  <path d="M-1400 250H3300V120H-1400Z" fill="#d9ccae"/>
  ${Array.from({ length: 18 }, (_, i) => `<path d="M${-1300 + i * 270} 250V-700" stroke="#a39374" stroke-width="10"/>`).join('')}
  <path d="M-1400 250H3300" stroke="#8a7a5c" stroke-width="12"/>
  <path d="M-1400 120H3300" stroke="#f2e6c6" stroke-width="10"/>
  ${Array.from({ length: 50 }, (_, i) => `<rect x="${-1380 + i * 96}" y="80" width="18" height="40" fill="#f2e6c6" stroke="#8a7a5c" stroke-width="2"/>`).join('')}
  <path d="M-1400 80H3300" stroke="#f2e6c6" stroke-width="10"/>
  ${hall(-300, -60, 900, { glow: true })}${hall(960, -120, 1300, { glow: true })}${hall(2200, -60, 900, { glow: true })}
  ${pagoda(-1000, 80, 420, 4)}${pagoda(2900, 80, 420, 4)}`;

const OFFICIALS = Array.from({ length: 10 }, (_, i) => ({ x: -520 + i * 330 + (i % 2) * 40, s: 2.1 + (i % 3) * 0.12 }));

const scene: SceneDef = {
  id: 6,
  bg: '#9fb6cf',
  markup: () => [
    plane(0, `${sky('s6-sky', [[0, '#8fa8c8'], [0.6, '#d8dde0'], [1, '#efe4c8']])}${orb(1500, 300, 50, '#fffbe8', 'url(#k-glow-white)')}`),
    plane(0.3, `${cloudSea(-2000, 4000, 700, 90, 5, 'url(#k-cloud-day)')}${haze('#e2e6ea', 0.2)}`),
    plane(0.8, `<g class="s6-terrace">${terraces()}
      ${OFFICIALS.map((o, i) => `<g class="s6-off s6-off-${i}">${immortal(o.x, 84, o.s, i, i < 6)}</g>`).join('')}</g>`),
    plane(0.95, `<rect class="s6-shadow" x="-3000" y="-600" width="9000" height="2400" fill="url(#s6-shadowgrad)" opacity="0"/>
      <defs><linearGradient id="s6-shadowgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2230" stop-opacity=".9"/><stop offset=".5" stop-color="#1c2230" stop-opacity=".6"/><stop offset="1" stop-color="#1c2230" stop-opacity="0"/></linearGradient></defs>`),
    plane(1, `${cloudSea(-2000, 6000, GROUND + 20, 110, 11, 'url(#k-cloud-gold)', '', 'rgba(255,248,220,.8)')}
      <g class="s6-fence">${Array.from({ length: 30 }, (_, i) => `<rect x="${-800 + i * 180}" y="${GROUND - 170}" width="16" height="190" fill="#9a2a1f" stroke="${INK}" stroke-width="3"/>`).join('')}
        <path d="M-820 ${GROUND - 150}H4600M-820 ${GROUND - 90}H4600" stroke="#b5342a" stroke-width="12"/></g>
      <g class="s6-herd">${HORSES.map((_, i) => horse(i)).join('')}</g>
      <path class="s6-whip" d="" fill="none" stroke="#e8e0c8" stroke-width="5" stroke-linecap="round"/>
      <g class="s6-exitcloud" opacity="0">${cloud(-180, 16, 380, 80, 29, 'url(#k-cloud-gold)')}</g>
      ${heroMarkup('wukong', 'bima')}`),
    plane(1.6, `<g class="s6-fg">${cloud(-800, 1200, 1200, 300, 21, 'url(#k-cloud-gold)')}${cloud(700, 1260, 1200, 260, 23, 'url(#k-cloud-gold)')}${cloud(2100, 1200, 1300, 300, 25, 'url(#k-cloud-gold)')}</g>`),
    plane(1.6, `<rect class="s6-grade" x="-6000" y="-4000" width="16000" height="10000" fill="#6e6a5e" opacity="0"/>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const follow = 700 + Math.min(lf, 70) * RUN * 0.95 + 120;
    const x = track([[-12, follow], [60, follow], [120, 1100, 'inOut'], [165, 1060]], lf);
    const y = track([[-12, 760], [60, 760], [120, 260, 'inOut'], [165, 240]], lf);
    const zoom = track([[-12, 1.3], [60, 1.25], [120, 0.52, 'inOut'], [165, 0.5]], lf);
    return { x: x + noise(lf * 0.05, 3) * 8, y: y + noise(lf * 0.05, 6) * 5, zoom };
  },
  heroes: (t) => [{ name: 'wukong', costume: 'bima', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const h = heroAt(lf);
    d.tf('.s6-exitcloud', `translate(${h.x.toFixed(1)} ${h.y.toFixed(1)})`);
    d.op('.s6-exitcloud', smooth(span(lf, 108, 118)));
    d.op('.s6-whip', 1 - smooth(span(lf, 94, 108)));
    HORSES.forEach((h, i) => {
      const ph = lf / 9 + h.ph * 6;
      const x = h.x + lf * RUN, y = h.y - Math.abs(Math.sin(ph * Math.PI)) * 18;
      d.tf(`.s6-h-${i}`, `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${h.s})`);
      const a = Math.sin(ph * Math.PI * 2), b = Math.cos(ph * Math.PI * 2);
      d.all(`.s6-h-${i} .lf, .s6-h-${i} .lf2`).forEach((g, k) => { const s = k ? -1 : 1; g.setAttribute('transform', `translate(${k ? 64 : 74} ${k ? -10 : -6}) rotate(${(-40 * a * s).toFixed(1)})`); g.querySelector('.kn')?.setAttribute('transform', `translate(0 58) rotate(${(Math.max(0, b * s) * 70).toFixed(1)})`); });
      d.all(`.s6-h-${i} .lb, .s6-h-${i} .lb2`).forEach((g, k) => { const s = k ? -1 : 1; g.setAttribute('transform', `translate(${k ? -70 : -80} ${k ? -10 : -6}) rotate(${(36 * a * s).toFixed(1)})`); g.querySelector('.kn')?.setAttribute('transform', `translate(0 58) rotate(${(-Math.max(0, -b * s) * 60).toFixed(1)})`); });
    });
    // whip cracking from the front hand
    const hp = heroAt(lf), hand = solve(hp).hands.F;
    const sw = Math.sin(lf * 0.4);
    d.attr('.s6-whip', 'd', `M${hand[0].toFixed(1)} ${hand[1].toFixed(1)}c${(40 + sw * 30).toFixed(1)} ${(-80 - sw * 30).toFixed(1)} ${(120 + sw * 60).toFixed(1)} ${(-60).toFixed(1)} ${(170 + sw * 40).toFixed(1)} ${(10 + sw * 50).toFixed(1)}`);
    OFFICIALS.forEach((_, i) => d.tf(`.s6-off-${i}`, `translate(0 ${(Math.sin(lf * 0.03 + i) * 3).toFixed(1)})`));
    const out = smooth(span(lf, 70, 130));
    d.op('.s6-shadow', out * 0.9);
    d.tf('.s6-shadow', `translate(0 ${(-400 + out * 700).toFixed(1)})`);
    d.op('.s6-grade', smooth(span(lf, 60, 150)) * 0.35);
    d.tf('.s6-fg', `translate(${(-lf * 3).toFixed(1)} 0)`);
    void rand;
  },
  fx: (ctx, t, view) => {
    motes(ctx, view, t.lf, 30, 'rgba(255,240,200,A)', 13, 0.9, [-1.2, -0.2], 2.5);
  },
};

export default scene;
