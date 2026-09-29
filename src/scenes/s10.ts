import { inCubic, noise, outBack, outCubic, rand, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { at, P, pose, poseTrack } from '../rig/poses.ts';
import { cloud, INK, karst, monkey, sky } from './kit.ts';
import { motes, sparks } from './fxkit.ts';

/**
 * 10 归山 — the pill's gold becomes a huge setting sun over Huaguo (the flash cut lands on
 * the same spot). Wukong comes tumbling out of the sky in somersaults, lands on the summit;
 * the monkeys swarm up the rocks to greet him and he laughs with the staff raised — the last
 * warm happiness. At the very end the first storm cloud slides over the top of frame.
 */

const SUMMIT = { x: 1000, y: 720 };
const S = 0.78;
const LAND = 44;
const tuck = pose({ ...P.crouch, plant: 0, staff: 1, staffA: 110, grip: 0.5, twoHand: 0, uaF: -20, faF: -110, uaB: -10, faB: -100, mouth: 0.9, brow: 0.2 });

const KEYS: Key<Pose>[] = [
  [-12, at(tuck, 300, -520, S)],
  [LAND - 2, at(tuck, SUMMIT.x - 10, SUMMIT.y - 40, S)],
  [LAND + 4, at({ ...P.crouch, staffA: 100, mouth: 0.7, brow: 0.2 }, SUMMIT.x, SUMMIT.y, S), 'outExpo'],
  [LAND + 20, at({ ...P.heroic, mouth: 1, brow: 0.1 }, SUMMIT.x, SUMMIT.y, S), 'outBack'],
  [LAND + 40, at({ ...P.heroic, staffA: -100, uaF: -160, faF: -10, head: -14, mouth: 1, brow: 0, lid: 0.2 }, SUMMIT.x, SUMMIT.y, S), 'inOut'],
  [140, at({ ...P.heroic, staffA: -96, uaF: -156, faF: -12, head: -10, mouth: 1, brow: 0, lid: 0.1 }, SUMMIT.x, SUMMIT.y, S), 'inOut'],
];
// the fall: a ballistic arc with two and a half somersaults, unrolling just before touchdown
const fallAt = (lf: number) => {
  const k = span(lf, -12, LAND - 2);
  return { x: 300 + (SUMMIT.x - 10 - 300) * outCubic(k), y: -520 + (SUMMIT.y - 40 + 520) * inCubic(k) };
};
const spinAt = (lf: number) => (lf < LAND - 2 ? -900 * outCubic(span(lf, -12, LAND - 2)) : 0);

const heroAt = (lf: number): Pose => {
  const p = poseTrack(KEYS, lf);
  if (lf < LAND - 2) { const f = fallAt(lf); return { ...p, x: f.x, y: f.y, wind: 0.6 }; }
  return { ...p, wind: 0.3 };
};

const MONKEYS = Array.from({ length: 12 }, (_, i) => {
  const side = i % 2 ? 1 : -1, ring = Math.floor(i / 2);
  return { from: SUMMIT.x + side * (900 + ring * 120), to: SUMMIT.x + side * (150 + ring * 60 + rand(i) * 30), y: SUMMIT.y + 30 + ring * 36, s: 0.9 + rand(i + 4) * 0.3, t0: LAND + 4 + ring * 4, flip: side > 0 };
});

const summit = () => `
  <path d="M560 1400C580 1060 700 820 830 752C920 712 1080 710 1170 748C1300 820 1400 1060 1430 1400Z" fill="#3a2440" stroke="${INK}" stroke-width="4"/>
  <path d="M830 752C920 712 1080 710 1170 748C1110 776 900 782 830 752Z" fill="#c8684a"/>
  <path d="M600 1100C640 900 740 790 830 752" fill="none" stroke="#ff9a50" stroke-width="7" opacity=".8"/>
  <path d="M1170 748C1300 820 1400 1060 1430 1400H1260C1260 1060 1220 850 1170 748Z" fill="#241632"/>
  <path d="M260 1400C300 1060 420 920 540 900C640 890 700 960 720 1040L760 1400Z" fill="#2c1c38"/>
  <path d="M1300 1400C1340 1060 1460 940 1580 930C1680 930 1720 1030 1740 1400Z" fill="#2c1c38"/>
  <path d="M300 1120C360 980 440 930 520 920" fill="none" stroke="#ff9a50" stroke-width="5" opacity=".6"/>`;

const tree = (x: number, y: number, s: number, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
  <path d="M0 0C-6 -60 10 -120 -10 -180M-4 -120C30 -150 60 -170 100 -170M-8 -150C-40 -180 -80 -190 -110 -186" fill="none" stroke="#1e1224" stroke-width="16" stroke-linecap="round"/>
  <ellipse cx="0" cy="-220" rx="190" ry="100" fill="#2a1a34"/><ellipse cx="-60" cy="-250" rx="110" ry="64" fill="#34203e"/>
  ${Array.from({ length: 14 }, (_, i) => `<circle cx="${(-150 + rand(i + x) * 300).toFixed(0)}" cy="${(-290 + rand(i * 3 + x) * 140).toFixed(0)}" r="${(6 + rand(i) * 6).toFixed(1)}" fill="#ff8fa0" opacity=".85"/>`).join('')}</g>`;

const birds = () => Array.from({ length: 7 }, (_, i) => `<path class="s10-bird s10-bird-${i}" d="M-18 0Q-8 -10 0 0Q8 -10 18 0" fill="none" stroke="#2a1830" stroke-width="3.5" stroke-linecap="round"/>`).join('');

const scene: SceneDef = {
  id: 10,
  bg: '#40203a',
  markup: () => [
    plane(0, `${sky('s10-sky', [[0, '#2a1a44'], [0.35, '#7a3a5a'], [0.62, '#e8704a'], [0.8, '#ffb85a'], [1, '#ffd890']])}
      <g class="s10-sun"><circle r="620" fill="url(#k-glow-warm)" opacity=".75"/><circle r="200" fill="#fff0b8"/><circle r="200" fill="url(#s10-sungrad)"/></g>
      <defs><radialGradient id="s10-sungrad" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fffbe0"/><stop offset=".6" stop-color="#ffd060"/><stop offset="1" stop-color="#ff9a3a"/></radialGradient></defs>
      <g class="s10-birds">${birds()}</g>`),
    plane(0.12, `<g class="s10-storm" opacity="0">${cloud(-600, -60, 1500, 420, 3, 'url(#k-cloud-storm)', '', 'rgba(120,90,110,.4)')}${cloud(700, -120, 1700, 460, 5, 'url(#k-cloud-storm)', '', 'rgba(120,90,110,.4)')}${cloud(2000, -40, 1400, 400, 7, 'url(#k-cloud-storm)', '', 'rgba(120,90,110,.4)')}</g>`),
    plane(0.2, `${[[80, 780, 220, 420], [330, 780, 170, 300], [1560, 780, 240, 460], [1820, 780, 190, 330], [640, 780, 140, 240], [1320, 780, 150, 260]].map(([x, b, w, h], i) => karst(x, b, w, h, '#8a4a6a', '#6a3656', 60 + i)).join('')}
      <rect x="-2000" y="776" width="6000" height="800" fill="#6a2c4a"/>
      <g class="s10-glint">${Array.from({ length: 16 }, (_, i) => `<rect x="${(930 - 60 + rand(i) * 120 - (i % 4) * 20).toFixed(0)}" y="${790 + i * 18}" width="${(60 + rand(i + 3) * 160 - i * 4).toFixed(0)}" height="5" rx="2" fill="#ffd890" opacity="${(0.9 - i * 0.04).toFixed(2)}"/>`).join('')}</g>`),
    plane(0.5, `${[[120, 980, 300, 520], [400, 980, 220, 400], [1660, 980, 320, 560], [1920, 980, 240, 420]].map(([x, b, w, h], i) => karst(x, b, w, h, '#4a2a4a', '#3a1e3c', 70 + i, '', '#ff9a5a')).join('')}
      ${tree(360, 980, 1.1)}${tree(1700, 990, 1.2, true)}`),
    plane(1, `${summit()}
      ${MONKEYS.map((m, i) => `<g class="s10-mk s10-mk-${i}">${monkey(0, 0, m.s, i, !m.flip)}</g>`).join('')}
      <ellipse class="s10-dust" cx="${SUMMIT.x}" cy="${SUMMIT.y + 6}" rx="220" ry="40" fill="#ffd0a0" opacity="0" filter="url(#k-blur16)"/>
      <g class="s10-spin">${heroMarkup('wukong', 'king')}</g>`),
    plane(1.7, `<g class="s10-fg"><path d="M-400 1300C-300 1040 -60 960 200 1000C300 1020 340 1120 360 1300Z" fill="#140a18"/>
      <path d="M1640 1300C1700 1080 1900 1000 2300 1020V1300Z" fill="#140a18"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M${-200 + i * 40} ${1010 - (i % 3) * 20}q${10 + (i % 4) * 6} -80 ${-10 + (i % 3) * 12} -150" fill="none" stroke="#140a18" stroke-width="6" stroke-linecap="round"/>`).join('')}</g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const x = track([[-12, 700], [LAND, SUMMIT.x - 20, 'inOut'], [140, SUMMIT.x + 10]], lf);
    const y = track([[-12, 140], [10, 220], [LAND, 560, 'inOut'], [140, 540]], lf);
    const zoom = track([[-12, 1.0], [LAND, 1.02], [LAND + 5, 1.12, 'outExpo'], [LAND + 20, 1.06, 'outBack'], [140, 1.24, 'inOut']], lf);
    return { x: x + noise(lf * 0.04, 3) * 6, y: y + noise(lf * 0.04, 8) * 4, zoom };
  },
  shake: (t) => { const k = t.lf - LAND; return k >= 0 && k < 10 ? [Math.sin(k * 3) * 8 * (1 - k / 10), Math.cos(k * 4) * 10 * (1 - k / 10)] : [0, 0]; },
  heroes: (t) => [{ name: 'wukong', costume: 'king', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    // the sun: fills the frame on the cut, recedes and sinks toward the sea
    const r = track([[-12, 2.3], [0, 2.1], [30, 1.0, 'outCubic'], [140, 0.9]], lf);
    const sy = track([[-12, 540], [30, 600, 'outCubic'], [140, 700]], lf);
    d.tf('.s10-sun', `translate(960 ${sy.toFixed(1)}) scale(${r.toFixed(3)})`);
    d.op('.s10-glint', smooth(span(lf, 10, 40)));
    for (let i = 0; i < 7; i++) {
      const bx = -100 + ((lf * (3 + (i % 3)) + i * 290) % 2200), by = 300 + (i % 4) * 50 + Math.sin(lf * 0.1 + i) * 10;
      const flap = Math.sin(lf * 0.5 + i * 2);
      d.tf(`.s10-bird-${i}`, `translate(${bx.toFixed(1)} ${by.toFixed(1)}) scale(${(0.8 + (i % 3) * 0.2).toFixed(2)} ${(0.8 + flap * 0.5).toFixed(2)})`);
    }
    const h = heroAt(lf);
    const cx = h.x, cy = h.y - 206 * h.s;
    d.tf('.s10-spin', `rotate(${spinAt(lf).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`);
    d.op('.s10-dust', Math.max(0, 1 - Math.abs(lf - LAND - 4) / 14) * 0.8);
    MONKEYS.forEach((m, i) => {
      const k = outBack(span(lf, m.t0, m.t0 + 18));
      const x = m.from + (m.to - m.from) * k;
      const arrived = span(lf, m.t0 + 18, m.t0 + 24);
      const hop = Math.abs(Math.sin((lf + i * 7) * (arrived > 0 ? 0.3 : 0.6))) * (arrived > 0 ? 30 + (i % 3) * 12 : 14);
      d.tf(`.s10-mk-${i}`, `translate(${x.toFixed(1)} ${(m.y - hop).toFixed(1)}) rotate(${(Math.sin(lf * 0.25 + i) * 8 * arrived).toFixed(1)})`);
    });
    const storm = smooth(span(lf, 92, 130));
    d.op('.s10-storm', storm);
    d.tf('.s10-storm', `translate(${(-storm * 80).toFixed(1)} ${(-420 + storm * 400).toFixed(1)})`);
    d.tf('.s10-fg', `translate(${(Math.sin(lf * 0.03) * 10).toFixed(1)} 0)`);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    motes(ctx, view, lf, 50, 'rgba(255,200,140,A)', 44, 0.9, [0.8, -0.5], 3);
    sparks(ctx, view, SUMMIT.x, SUMMIT.y - 10, lf - LAND, 40, 16, 12, 1, '255,210,150');
    // the somersault trail: a golden ribbon behind the tumbling body
    if (lf < LAND) {
      view.apply(ctx, 1);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      const n = 24;
      const pts = Array.from({ length: n + 1 }, (_, k) => fallAt(lf - k * 0.6));
      const head = pts[0], tail = pts[n];
      const g = ctx.createLinearGradient(head.x, head.y - 160, tail.x, tail.y - 160);
      g.addColorStop(0, 'rgba(255,214,130,.55)'); g.addColorStop(1, 'rgba(255,180,100,0)');
      ctx.strokeStyle = g; ctx.lineJoin = 'round';
      for (const [w, a] of [[80, 0.35], [30, 1]] as const) {
        ctx.globalAlpha = a; ctx.lineWidth = w;
        ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y - 160) : ctx.moveTo(p.x, p.y - 160))); ctx.stroke();
      }
      ctx.restore();
    }
  },
};

export default scene;
