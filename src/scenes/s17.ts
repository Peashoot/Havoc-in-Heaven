import { noise, rand, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { at, P, pose, poseTrack } from '../rig/poses.ts';
import { colorAt, mix } from './kit.ts';

/**
 * 17 炉火 — inside the furnace. A curved bronze chamber, trigram-etched, walls of fire
 * licking up from every side; the fire cycles red → orange → gold → cyan → violet as the days
 * pass. Wukong first thrashes against it, then stops, folds into meditation, and the sparks
 * of the flames begin to spiral in toward him and settle on his body.
 */

const C = { x: 960, y: 860 };
const SIT = 70;
const FIRE: [number, string][] = [[-12, '#e0301a'], [40, '#ff7a1a'], [80, '#ffc02a'], [120, '#3ad8e8'], [160, '#a060ff'], [196, '#ff4a8a']];
const hot = (lf: number) => colorAt(FIRE, lf);

const KEYS: Key<Pose>[] = [
  [-12, at(pose({ ...P.crouch, staff: 0, uaF: -150, faF: -40, uaB: -120, faB: -40, brow: 1, mouth: -0.9, head: -20 }), C.x, C.y, 0.92)],
  [8, at(pose({ ...P.angry, uaF: -170, faF: -20, uaB: -150, faB: -30, head: -26, mouth: -1 }), C.x - 40, C.y, 0.92), 'outBack'],
  [22, at(pose({ ...P.crouch, staff: 0, uaF: 40, faF: -110, uaB: 50, faB: -120, head: 20, brow: 1, mouth: -0.8 }), C.x + 30, C.y, 0.92), 'outExpo'],
  [36, at(pose({ ...P.angry, uaF: -120, faF: -60, uaB: -90, faB: -70, head: -30, mouth: -1, lid: 0.3 }), C.x - 20, C.y, 0.92), 'outBack'],
  [52, at(pose({ ...P.kneel, uaF: 10, faF: -30, head: 22, lid: 0.8, mouth: -0.4 }), C.x, C.y, 0.92), 'inOut'],
  [SIT, at(P.meditate, C.x, C.y, 0.92), 'inOut'],
  [200, at({ ...P.meditate, head: 2 }, C.x, C.y, 0.92), 'inOut'],
];
const heroAt = (lf: number): Pose => ({ ...poseTrack(KEYS, lf), dy: lf > SIT ? -Math.sin(lf * 0.08) * 6 - smooth(span(lf, SIT, 180)) * 30 : 0, wind: 0.3 + (lf < SIT ? 0.5 : 0) });

// rows of rising flames: [plane z, base y, count, x0, x1, height, width]
const ROWS: [number, number, number, number, number, number, number][] = [
  [0.45, 820, 22, -500, 2420, 420, 90],
  [0.7, 900, 18, -300, 2220, 360, 80],
  [1.5, 1180, 12, -500, 2420, 420, 130],
];
const flamePath = (x: number, base: number, w: number, h: number, sway: number) =>
  `M${(x - w).toFixed(1)} ${base}C${(x - w * 1.1).toFixed(1)} ${(base - h * 0.35).toFixed(1)} ${(x - w * 0.2 + sway * 0.5).toFixed(1)} ${(base - h * 0.55).toFixed(1)} ${(x - w * 0.3 + sway * 0.8).toFixed(1)} ${(base - h * 0.78).toFixed(1)}` +
  `C${(x - w * 0.1 + sway).toFixed(1)} ${(base - h * 0.9).toFixed(1)} ${(x + sway).toFixed(1)} ${(base - h * 0.95).toFixed(1)} ${(x + sway * 1.1).toFixed(1)} ${(base - h).toFixed(1)}` +
  `C${(x + w * 0.5 + sway * 0.6).toFixed(1)} ${(base - h * 0.7).toFixed(1)} ${(x + w * 0.2 + sway * 0.3).toFixed(1)} ${(base - h * 0.5).toFixed(1)} ${(x + w * 0.7).toFixed(1)} ${(base - h * 0.3).toFixed(1)}` +
  `C${(x + w * 1.1).toFixed(1)} ${(base - h * 0.15).toFixed(1)} ${(x + w).toFixed(1)} ${(base - h * 0.05).toFixed(1)} ${(x + w).toFixed(1)} ${base}Z`;
const row = (k: number) => {
  const [, base, n, x0, x1] = ROWS[k];
  return Array.from({ length: n }, (_, i) => `<g class="s17-f s17-f-${k}-${i}"><path class="o"/><path class="m"/><path class="c" fill="#fff6d0"/></g>`).join('') +
    `<rect x="${x0 - 400}" y="${base}" width="${x1 - x0 + 800}" height="600" class="s17-bed" fill="#ff5a1a"/>`;
};

const scene: SceneDef = {
  id: 17,
  bg: '#1a0804',
  markup: () => [
    plane(0.3, `<rect x="-3000" y="-3000" width="9000" height="8000" class="s17-back" fill="#1a0804"/>
      <ellipse cx="960" cy="560" rx="1300" ry="820" fill="#2a120a" stroke="#6a4a2a" stroke-width="10"/>
      ${Array.from({ length: 16 }, (_, i) => `<path d="M${(960 + Math.cos((i / 16) * Math.PI * 2) * 1300).toFixed(0)} ${(560 + Math.sin((i / 16) * Math.PI * 2) * 820).toFixed(0)}L960 560" stroke="#7a4a20" stroke-width="6" opacity=".5"/>`).join('')}
      ${[400, 620, 820].map((r) => `<ellipse cx="960" cy="560" rx="${r * 1.58}" ry="${r}" fill="none" stroke="#7a4a20" stroke-width="5" opacity=".5"/>`).join('')}
      <ellipse class="s17-wash" cx="960" cy="560" rx="1400" ry="900" fill="#ff5a1a" opacity=".35" filter="url(#k-blur40)"/>`),
    plane(ROWS[0][0], row(0)),
    plane(ROWS[1][0], row(1)),
    plane(1, `<ellipse class="s17-pool" cx="${C.x}" cy="${C.y + 10}" rx="520" ry="70" fill="#ffd060" opacity=".5" filter="url(#k-blur16)"/>
      <circle class="s17-halo" cx="${C.x}" cy="${C.y - 180}" r="260" fill="url(#k-glow-warm)" opacity="0"/>
      ${heroMarkup('wukong', 'furnace')}`),
    plane(ROWS[2][0], row(2)),
    plane(1.5, `<rect class="s17-tint" x="-6000" y="-4000" width="16000" height="10000" fill="#ff5a1a" opacity=".12" style="mix-blend-mode:overlay"/>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const zoom = track([[-12, 1.3], [SIT, 1.1, 'inOut'], [196, 1.45, 'inOut']], lf);
    return { x: C.x + noise(lf * 0.05, 1) * 16, y: track([[-12, 640], [SIT, 620], [196, 600]], lf) + noise(lf * 0.05, 3) * 10, zoom, rot: Math.sin(lf * 0.03) * 1.5 };
  },
  shake: (t) => (t.lf < SIT - 10 ? [noise(t.lf * 0.8, 1) * 8, noise(t.lf * 0.8, 2) * 8] : [0, 0]),
  heroes: (t) => [{ name: 'wukong', costume: 'furnace', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const c = hot(lf);
    const calm = smooth(span(lf, SIT - 10, SIT + 30));
    const deep = mix(c, '#3a0a04', 0.35), light = mix(c, '#fff2c0', 0.55);
    ROWS.forEach(([, base, n, x0, x1, H, W], k) => {
      for (let i = 0; i < n; i++) {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / n + (rand(k * 40 + i) - 0.5) * 60;
        const flick = 0.65 + noise(lf * 0.3, k * 40 + i) * 0.45;
        const h = H * (0.6 + rand(k * 40 + i + 7) * 0.6) * flick * (1 - calm * 0.2) * (k === 2 && Math.abs(x - C.x) < 400 ? 0.45 : 1);
        const w = W * (0.8 + rand(k * 40 + i + 3) * 0.5);
        const sway = noise(lf * 0.2, k * 40 + i + 11) * w * 0.9;
        const ps = d.all(`.s17-f-${k}-${i} path`);
        ps[0]?.setAttribute('d', flamePath(x, base, w, h, sway)); ps[0]?.setAttribute('fill', deep);
        ps[1]?.setAttribute('d', flamePath(x, base, w * 0.7, h * 0.72, sway * 0.8)); ps[1]?.setAttribute('fill', c);
        ps[2]?.setAttribute('d', flamePath(x, base, w * 0.38, h * 0.42, sway * 0.6)); ps[2]?.setAttribute('fill', light);
      }
    });
    d.all('.s17-bed').forEach((b) => b.setAttribute('fill', deep));
    d.attr('.s17-pool', 'fill', light);
    d.attr('.s17-wash', 'fill', c);
    d.attr('.s17-tint', 'fill', c);
    d.op('.s17-wash', 0.16 + noise(lf * 0.2, 4) * 0.06);
    d.op('.s17-halo', calm * (0.55 + Math.sin(lf * 0.1) * 0.1));
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    const c = hot(lf);
    const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16);
    // sparks: wild upward drift before he sits, then spiralling in to him
    view.apply(ctx, 1.1);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const pull = smooth(span(lf, SIT, SIT + 40));
    for (let i = 0; i < 160; i++) {
      const life = 60, age = ((lf + rand(i) * life) % life) / life;
      const a0 = rand(i + 3) * Math.PI * 2, r0 = 700 + rand(i + 5) * 400;
      const wildX = C.x + Math.cos(a0) * r0 * 0.6 + noise(lf * 0.05, i) * 80, wildY = C.y - age * 900 + 100;
      const ang = a0 + age * 5, rr = r0 * (1 - age) * 0.9 + 30;
      const inX = C.x + Math.cos(ang) * rr, inY = C.y - 220 + Math.sin(ang) * rr * 0.5;
      const x = wildX + (inX - wildX) * pull, y = wildY + (inY - wildY) * pull;
      const a = Math.sin(age * Math.PI) * 0.9;
      ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, 3 + rand(i + 9) * 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,250,230,${(a * 0.7).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    // heat shimmer lines
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.save();
    ctx.strokeStyle = `rgba(${r},${g},${b},.12)`; ctx.lineWidth = 3;
    for (let k = 0; k < 10; k++) {
      ctx.beginPath();
      for (let x = 0; x <= 1920; x += 40) { const y = 120 + k * 100 + Math.sin(x * 0.01 + lf * 0.2 + k) * 14; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
    }
    ctx.restore();
  },
};

export default scene;
