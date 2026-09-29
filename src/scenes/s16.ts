import { clamp, noise, outBack, outCubic, rand, shake, smooth, span, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { P, pose } from '../rig/poses.ts';
import { gourd, INK, soldier } from './kit.ts';
import { motes, sparks } from './fxkit.ts';

/**
 * 16 入炉 — 太上老君's alchemy hall, dim and smoky. The great bronze Eight-Trigrams furnace
 * squats on its three legs, fire breathing underneath. Laojun lifts his whisk, the round door
 * swings open on a roaring core; two guards heave Wukong through the air, tumbling, into it.
 * The door slams. The hall fades to black until only one red ember at the door seam remains.
 */

export const FURNACE = { x: 960, y: 830 };
export const DOOR = { x: 960, y: 610, r: 118 };
const OPEN = 24, THROW = 42, IN = 62, SHUT = 70;

// the eight trigrams (☰☱☲☳☴☵☶☷): 1 = solid bar, 0 = broken
const TRIGRAMS = [[1, 1, 1], [0, 1, 1], [1, 0, 1], [0, 0, 1], [1, 1, 0], [0, 1, 0], [1, 0, 0], [0, 0, 0]];
const trigram = (x: number, y: number, s: number, k: number, fill = '#f2c23a') => TRIGRAMS[k].map((b, i) => b
  ? `<rect x="${x - 40 * s}" y="${y + (i - 1) * 22 * s - 5 * s}" width="${80 * s}" height="${10 * s}" fill="${fill}" stroke="${INK}" stroke-width="2"/>`
  : `<rect x="${x - 40 * s}" y="${y + (i - 1) * 22 * s - 5 * s}" width="${34 * s}" height="${10 * s}" fill="${fill}" stroke="${INK}" stroke-width="2"/><rect x="${x + 6 * s}" y="${y + (i - 1) * 22 * s - 5 * s}" width="${34 * s}" height="${10 * s}" fill="${fill}" stroke="${INK}" stroke-width="2"/>`).join('');

/** The 八卦炉. Door is a separate group (`${cls}-door`) hinged on its left edge; `${cls}-core` is the fire behind it. */
export const furnace = (cls: string) => {
  const { x, y } = FURNACE;
  return `<g class="${cls}">
    <defs><linearGradient id="${cls}-bronze" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a2e16"/><stop offset=".35" stop-color="#b8803e"/><stop offset=".55" stop-color="#d8a860"/><stop offset="1" stop-color="#3a2210"/></linearGradient>
      <radialGradient id="${cls}-fire"><stop offset="0" stop-color="#fffbe0"/><stop offset=".35" stop-color="#ffd24a"/><stop offset=".7" stop-color="#ff6a1a"/><stop offset="1" stop-color="#8a1a0a"/></radialGradient></defs>
    <ellipse class="${cls}-under" cx="${x}" cy="${y + 90}" rx="300" ry="70" fill="#ff7a2a" opacity=".8" filter="url(#k-blur16)"/>
    ${[-260, 0, 260].map((dx) => `<path d="M${x + dx - 40} ${y - 20}C${x + dx - 60} ${y + 60} ${x + dx - 30} ${y + 110} ${x + dx - 50} ${y + 140}H${x + dx + 50}C${x + dx + 30} ${y + 110} ${x + dx + 60} ${y + 60} ${x + dx + 40} ${y - 20}Z" fill="#5a3a1c" stroke="${INK}" stroke-width="4"/>`).join('')}
    <path d="M${x - 340} ${y}C${x - 420} ${y - 120} ${x - 400} ${y - 330} ${x - 250} ${y - 400}H${x + 250}C${x + 400} ${y - 330} ${x + 420} ${y - 120} ${x + 340} ${y}Z" fill="url(#${cls}-bronze)" stroke="${INK}" stroke-width="5"/>
    <path d="M${x - 380} ${y - 90}H${x + 380}M${x - 395} ${y - 300}H${x + 395}" stroke="#3a2210" stroke-width="14" opacity=".7"/>
    <path d="M${x - 380} ${y - 100}H${x + 380}M${x - 395} ${y - 310}H${x + 395}" stroke="#e8c070" stroke-width="4" opacity=".6"/>
    ${[[x - 250, y - 200, 0], [x + 250, y - 200, 2], [x - 290, y - 40, 4], [x + 290, y - 40, 6]].map(([tx, ty, k]) => trigram(tx, ty, 0.9, k)).join('')}
    <path d="M${x - 300} ${y - 400}L${x - 200} ${y - 480}H${x + 200}L${x + 300} ${y - 400}Z" fill="#8a5a2a" stroke="${INK}" stroke-width="5"/>
    <path d="M${x - 180} ${y - 480}L${x - 110} ${y - 540}H${x + 110}L${x + 180} ${y - 480}Z" fill="#a06a30" stroke="${INK}" stroke-width="5"/>
    <circle cx="${x}" cy="${y - 570}" r="34" fill="#c8904a" stroke="${INK}" stroke-width="5"/>
    <path d="M${x} ${y - 640}C${x - 20} ${y - 610} ${x - 14} ${y - 600} ${x} ${y - 604}C${x + 14} ${y - 600} ${x + 20} ${y - 610} ${x} ${y - 640}Z" fill="#ff9a3a"/>
    <circle cx="${DOOR.x}" cy="${DOOR.y}" r="${DOOR.r + 24}" fill="#3a2210" stroke="${INK}" stroke-width="5"/>
    <circle class="${cls}-core" cx="${DOOR.x}" cy="${DOOR.y}" r="${DOOR.r}" fill="url(#${cls}-fire)"/>
    <g class="${cls}-door"><circle cx="${DOOR.x}" cy="${DOOR.y}" r="${DOOR.r}" fill="#9a6a34" stroke="${INK}" stroke-width="5"/>
      <circle cx="${DOOR.x}" cy="${DOOR.y}" r="${DOOR.r - 22}" fill="none" stroke="#e8c070" stroke-width="4"/>
      <circle cx="${DOOR.x}" cy="${DOOR.y}" r="30" fill="#c8904a" stroke="${INK}" stroke-width="4"/>
      <path d="M${DOOR.x} ${DOOR.y - 30}A30 30 0 0 1 ${DOOR.x} ${DOOR.y + 30}A15 15 0 0 1 ${DOOR.x} ${DOOR.y}A15 15 0 0 0 ${DOOR.x} ${DOOR.y - 30}Z" fill="#2a1a0c"/>
      ${Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2; return `<g transform="rotate(${(k * 45 + 90).toFixed(0)} ${(DOOR.x + Math.cos(a) * 70).toFixed(1)} ${(DOOR.y + Math.sin(a) * 70).toFixed(1)})">${trigram(DOOR.x + Math.cos(a) * 70, DOOR.y + Math.sin(a) * 70, 0.3, k, '#f2d27a')}</g>`; }).join('')}</g>
    <path class="${cls}-seam" d="M${DOOR.x - DOOR.r} ${DOOR.y}A${DOOR.r} ${DOOR.r} 0 1 0 ${DOOR.x + DOOR.r} ${DOOR.y}A${DOOR.r} ${DOOR.r} 0 1 0 ${DOOR.x - DOOR.r} ${DOOR.y}" fill="none" stroke="#ff5a1a" stroke-width="6" opacity="0" filter="url(#k-blur6)"/>
  </g>`;
};

const laojun = (x: number, y: number, s: number) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-70 0C-66 -80 -50 -200 -30 -250H40C60 -200 76 -80 80 0Z" fill="#6a7a8e" stroke="${INK}" stroke-width="4"/>
  <path d="M-70 0C-40 -10 40 -10 80 0" fill="none" stroke="#e8e0c8" stroke-width="10"/>
  <path d="M0 -250L10 -120" stroke="#e8e0c8" stroke-width="8"/>
  <circle cx="4" cy="-290" r="40" fill="#f0d0b0" stroke="${INK}" stroke-width="4"/>
  <path d="M-20 -280C-30 -200 -10 -140 10 -110C24 -150 40 -200 30 -280C16 -266 -6 -266 -20 -280Z" fill="#f8f8f4" stroke="${INK}" stroke-width="3"/>
  <path d="M-26 -300C-16 -306 -6 -306 0 -300M12 -300C20 -306 30 -306 36 -300" fill="none" stroke="#f8f8f4" stroke-width="6" stroke-linecap="round"/>
  <circle cx="4" cy="-338" r="16" fill="#e8e0d0" stroke="${INK}" stroke-width="3"/><path d="M-10 -338H18" stroke="#b8a060" stroke-width="5"/>
  <g class="s16-whisk"><path d="M40 -200L110 -300" stroke="#8a5a2a" stroke-width="8" stroke-linecap="round"/>
    <path d="M110 -300C130 -330 170 -330 200 -300C170 -310 150 -300 130 -290C160 -300 190 -290 210 -270C170 -284 140 -280 110 -300Z" fill="#f8f8f4" stroke="${INK}" stroke-width="2"/></g>
  <path d="M-50 -200C-20 -190 20 -190 50 -200L60 -150C20 -140 -20 -140 -60 -150Z" fill="#8a9aae" stroke="${INK}" stroke-width="3"/>
</g>`;

const bound = pose({ ...P.crouch, staff: 0, uaF: 30, faF: -120, uaB: 40, faB: -110, head: 10, brow: 1, mouth: -0.7, plant: 0 });
const flight = (lf: number) => {
  const k = span(lf, THROW, IN);
  const x = 1560 + (DOOR.x - 1560) * outCubic(k), y = 780 + (DOOR.y + 60 - 780) * k - Math.sin(k * Math.PI) * 120;
  return { x, y, s: 0.72 - k * 0.42, rot: -k * 540 };
};
const heroAt = (lf: number): Pose => { const f = flight(Math.max(lf, THROW)); return { ...bound, x: f.x, y: f.y, s: f.s, face: -1, wind: 0.6 }; };

const scene: SceneDef = {
  id: 16,
  bg: '#140c08',
  markup: () => [
    plane(0.3, `<rect x="-3000" y="-3000" width="9000" height="8000" fill="#2a1a12"/>
      <rect x="-800" y="80" width="3600" height="800" fill="#3a2418"/>
      <g transform="translate(960 300)"><circle r="220" fill="#1c120c" stroke="#8a6a3a" stroke-width="6"/>
        ${Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2; return `<g transform="rotate(${k * 45 + 90} ${(Math.cos(a) * 170).toFixed(1)} ${(Math.sin(a) * 170).toFixed(1)})">${trigram(Math.cos(a) * 170, Math.sin(a) * 170, 0.5, k, '#8a6a3a')}</g>`; }).join('')}
        <circle r="90" fill="#e8dcc0"/><path d="M0 -90A90 90 0 0 1 0 90A45 45 0 0 1 0 0A45 45 0 0 0 0 -90Z" fill="#1c120c"/><circle cy="-45" r="14" fill="#e8dcc0"/><circle cy="45" r="14" fill="#1c120c"/></g>
      ${[-500, -200, 2120, 2420].map((x) => `<g><rect x="${x}" y="300" width="240" height="560" fill="#2a1a10" stroke="#5a3a1c" stroke-width="4"/>${[0, 1, 2].map((r) => `<path d="M${x} ${420 + r * 150}h240" stroke="#5a3a1c" stroke-width="6"/>${[0, 1, 2].map((c) => gourd(x + 50 + c * 70, 410 + r * 150, 0.4)).join('')}`).join('')}</g>`).join('')}`),
    plane(0.6, `${[-300, 260, 1660, 2220].map((x) => `<rect x="${x}" y="-400" width="110" height="1500" fill="#4a1a12" stroke="${INK}" stroke-width="4"/>`).join('')}
      <rect x="-2000" y="880" width="6000" height="800" fill="#241610"/>`),
    plane(1, `<rect x="-2000" y="900" width="6000" height="800" fill="#1c120c"/>
      ${furnace('s16-f')}
      <g class="s16-lj">${laojun(420, 960, 1.15)}</g>
      <g class="s16-g1">${soldier(1640, 960, 1.05, 1, true, 1)}</g><g class="s16-g2">${soldier(1800, 950, 1.0, 2, true, 1)}</g>
      <g class="s16-spin">${heroMarkup('wukong', 'furnace')}</g>
      ${Array.from({ length: 8 }, (_, i) => `<circle class="s16-smoke s16-smoke-${i}" r="${60 + (i % 3) * 30}" fill="#6a5a50" opacity="0" filter="url(#k-blur16)"/>`).join('')}`),
    plane(1.6, `<g class="s16-fg"><rect x="-500" y="-400" width="200" height="2000" fill="#120a06"/><rect x="2160" y="-400" width="220" height="2000" fill="#120a06"/></g>`),
    plane(1.6, `<rect class="s16-black" x="-6000" y="-4000" width="16000" height="10000" fill="#000" opacity="0"/>
      <g class="s16-ember" opacity="0"><circle r="60" fill="#ff3a1a" opacity=".5" filter="url(#k-blur16)"/><circle r="9" fill="#ff8a4a"/></g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const zoom = track([[-12, 0.9], [OPEN, 1.0, 'inOut'], [THROW, 0.96], [SHUT, 1.2, 'outExpo'], [100, 1.5, 'inOut'], [134, 1.6]], lf);
    const x = track([[-12, 960], [THROW, 1080, 'inOut'], [SHUT, DOOR.x, 'inOut']], lf);
    const y = track([[-12, 560], [SHUT, 600, 'inOut'], [100, DOOR.y, 'inOut']], lf);
    return { x: x + noise(lf * 0.04, 2) * 5, y: y + noise(lf * 0.04, 4) * 4, zoom };
  },
  shake: (t) => shake(t.lf, SHUT, 30, 10),
  heroes: (t) => [{ name: 'wukong', costume: 'furnace', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const open = lf < SHUT - 4 ? outBack(span(lf, OPEN, OPEN + 14)) : 1 - outCubic(span(lf, SHUT - 4, SHUT));
    const kx = Math.max(0.06, 1 - open * 0.94);
    const hinge = DOOR.x - DOOR.r;
    d.tf('.s16-f-door', `translate(${hinge} 0) scale(${kx.toFixed(3)} 1) translate(${-hinge} 0)`);
    d.attr('.s16-f-core', 'r', (DOOR.r * (0.96 + noise(lf * 0.3, 5) * 0.04)).toFixed(1));
    d.op('.s16-f-under', 0.6 + noise(lf * 0.2, 9) * 0.3 + Math.max(0, 1 - Math.abs(lf - SHUT - 2) / 10) * 0.4);
    d.op('.s16-f-seam', lf > SHUT ? 0.4 + noise(lf * 0.2, 3) * 0.3 : 0);
    d.tf('.s16-whisk', `rotate(${(-smooth(span(lf, 8, OPEN)) * 30 + smooth(span(lf, OPEN + 10, OPEN + 24)) * 20).toFixed(1)} 40 -200)`);
    const heave = Math.max(0, 1 - Math.abs(lf - THROW) / 8);
    d.tf('.s16-g1', `rotate(${(-heave * 12).toFixed(1)} 1640 960)`);
    d.tf('.s16-g2', `rotate(${(-heave * 10).toFixed(1)} 1800 950)`);
    const f = flight(Math.max(lf, THROW));
    d.tf('.s16-spin', lf < THROW ? '' : `rotate(${f.rot.toFixed(1)} ${f.x.toFixed(1)} ${(f.y - 150 * f.s).toFixed(1)})`);
    d.op('.s16-spin', lf < IN ? 1 : 0);
    for (let i = 0; i < 8; i++) {
      const age = ((lf + i * 17) % 136) / 136;
      d.attr(`.s16-smoke-${i}`, 'cx', (FURNACE.x - 200 + rand(i) * 400 + Math.sin(age * 6 + i) * 60).toFixed(1));
      d.attr(`.s16-smoke-${i}`, 'cy', (FURNACE.y - 560 - age * 700).toFixed(1));
      d.op(`.s16-smoke-${i}`, Math.sin(age * Math.PI) * 0.35);
    }
    d.op('.s16-black', smooth(span(lf, 80, 104)));
    const ember = smooth(span(lf, 96, 108));
    d.op('.s16-ember', ember * (0.7 + Math.sin(lf * 0.3) * 0.3));
    d.tf('.s16-ember', `translate(${DOOR.x + DOOR.r * 0.72} ${DOOR.y - DOOR.r * 0.5})`);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    motes(ctx, view, lf, 40, 'rgba(255,160,80,A)', 101, 0.9, [0.2, -1.2], 2.5);
    sparks(ctx, view, DOOR.x, DOOR.y, lf - SHUT, 80, 22, 13, 1, '255,170,80');
    // light spilling from the open door
    const open = clamp(span(lf, OPEN, OPEN + 10)) * (1 - clamp(span(lf, SHUT - 4, SHUT)));
    if (open > 0.02) {
      const [sx, sy] = view.toScreen(DOOR.x, DOOR.y);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 700);
      g.addColorStop(0, `rgba(255,190,90,${(0.45 * open).toFixed(3)})`); g.addColorStop(1, 'rgba(255,120,40,0)');
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); ctx.restore();
    }
  },
};

export default scene;
