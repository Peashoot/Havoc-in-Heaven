import { noise, rand, smooth, span, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { P } from '../rig/poses.ts';
import { cloud, heavenGate, rays, soldier } from './kit.ts';
import { motes, sparks, streaks } from './fxkit.ts';

/**
 * 13 杀向天宫 — a vertical tracking shot: Wukong rockets straight up through layer after
 * layer of storm cloud, the staff knocking each ring of soldiers off their cloud platforms,
 * spears raining down past him. The clouds thin, the light turns gold, and 南天门 drops into
 * view above him in the last seconds.
 */

const camY = (lf: number) => track([[-18, 1000], [20, 300, 'inCubic'], [128, -3500, 'linear'], [166, -4100, 'outCubic']], lf);
const heroPos = (lf: number) => ({ x: 960 + Math.sin(lf * 0.07) * 150, y: camY(lf) + 240 });

// soldier platforms along the climb: [level y, x offsets]
const LEVELS = Array.from({ length: 8 }, (_, i) => ({ y: 200 - i * 480, xs: [-520, -300, 300, 540].map((o, k) => o + (rand(i * 4 + k) - 0.5) * 80) }));
const passAt = (y: number) => { let lf = -18; while (lf < 170 && heroPos(lf).y - 200 > y) lf += 0.25; return lf; };
const PASS = LEVELS.map((l) => passAt(l.y));
const SWINGS = PASS.map((p) => p - 3);

const heroAt = (lf: number): Pose => {
  const h = heroPos(lf);
  const near = SWINGS.map((s) => lf - s).filter((d) => d > -4 && d < 10)[0];
  const swing = near === undefined ? 0 : near < 0 ? -(near + 4) / 4 : Math.max(0, 1 - near / 10);
  return {
    ...P.fly, lean: 20, torso: 10, head: -30, staffA: -12 + swing * 140 - (near !== undefined && near < 0 ? 40 : 0),
    uaF: -150 + swing * 80, thF: -10 + Math.sin(lf * 0.5) * 8, thB: 24 - Math.sin(lf * 0.5) * 8,
    x: h.x, y: h.y, s: 0.9, face: 1, brow: 1, mouth: -0.5, wind: 1, staffGlow: 0.5,
  };
};

const scatter = (z: number, n: number, seed: number, fill: string, rim: string) => {
  const y0 = 540 + (camY(-18) - 540) * z + 900, y1 = 540 + (camY(166) - 540) * z - 900;
  return Array.from({ length: n }, (_, i) => {
    const y = y0 + (y1 - y0) * (i / n) + (rand(seed + i) - 0.5) * 200;
    const x = -300 + rand(seed + i * 3) * 2500;
    return cloud(x, y, 500 + rand(seed + i * 5) * 700, 160 + rand(seed + i * 7) * 120, seed + i, fill, '', rim);
  }).join('');
};

const GATE = { x: 960, y: 540 + (camY(140) - 540) * 0.35 + 420, w: 820 };

const scene: SceneDef = {
  id: 13,
  bg: '#1a2030',
  markup: () => [
    plane(0, `<rect x="-100" y="-100" width="2120" height="1280" fill="#1c2638"/>
      <rect class="s13-gold" x="-100" y="-100" width="2120" height="1280" fill="url(#s13-goldsky)" opacity="0"/>
      <defs><linearGradient id="s13-goldsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c4"/><stop offset=".5" stop-color="#f0c060"/><stop offset="1" stop-color="#8a6a8a"/></linearGradient></defs>`),
    plane(0.2, `<g class="s13-storm">${scatter(0.2, 10, 3, 'url(#k-cloud-storm)', 'rgba(150,160,190,.3)')}</g>`),
    plane(0.35, `<g class="s13-gate">${rays(GATE.x, GATE.y - 500, 1400, 22, '#fff2c4', 0.35, 4)}${heavenGate(GATE.x, GATE.y, GATE.w, { plaque: true })}
      ${cloud(GATE.x - 1200, GATE.y - 40, 2400, 260, 91, 'url(#k-cloud-gold)', '', '#fff6d0')}</g>`),
    plane(0.55, `<g class="s13-storm">${scatter(0.55, 14, 17, 'url(#k-cloud-storm)', 'rgba(200,200,220,.35)')}</g>`),
    plane(1, `${LEVELS.map((l, i) => `${cloud(960 - 900, l.y + 10, 600, 120, 40 + i, 'url(#k-cloud-storm)', '', 'rgba(220,220,240,.4)')}${cloud(960 + 300, l.y + 10, 600, 120, 60 + i, 'url(#k-cloud-storm)', '', 'rgba(220,220,240,.4)')}
      ${l.xs.map((o, k) => `<g class="s13-sol s13-sol-${i}-${k}">${soldier(960 + o, l.y, 0.8, i * 4 + k, o > 0, 1)}</g>`).join('')}`).join('')}
      <g class="s13-spin">${heroMarkup('wukong', 'sage')}</g>`),
    plane(1.8, `<g class="s13-storm">${scatter(1.8, 16, 29, 'url(#k-cloud-storm)', 'rgba(230,230,250,.4)')}</g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const h = heroPos(lf);
    return { x: 960 + (h.x - 960) * 0.6 + noise(lf * 0.1, 3) * 10, y: camY(lf) + noise(lf * 0.1, 7) * 10, zoom: track([[-18, 1.1], [120, 1.0], [166, 0.9, 'inOut']], lf), rot: Math.sin(lf * 0.07) * 2 };
  },
  shake: (t) => { const d = PASS.map((p) => t.lf - p).filter((k) => k >= 0 && k < 6)[0]; return d === undefined ? [0, 0] : [Math.sin(d * 3) * 10 * (1 - d / 6), Math.cos(d * 4) * 8 * (1 - d / 6)]; },
  heroes: (t) => [{ name: 'wukong', costume: 'sage', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const h = heroPos(lf);
    d.tf('.s13-spin', `rotate(-62 ${h.x.toFixed(1)} ${(h.y - 180).toFixed(1)})`);
    LEVELS.forEach((l, i) => l.xs.forEach((o, k) => {
      const tt = Math.max(0, lf - PASS[i] - Math.abs(o) / 400);
      const dir = o > 0 ? 1 : -1;
      d.tf(`.s13-sol-${i}-${k}`, `translate(${(dir * tt * (22 + k * 3)).toFixed(1)} ${(-tt * 14 + 0.9 * tt * tt).toFixed(1)}) rotate(${(dir * tt * 18).toFixed(1)} ${960 + o} ${l.y - 80})`);
    }));
    d.op('.s13-gold', smooth(span(lf, 90, 150)));
    d.all('.s13-storm').forEach((g) => g.setAttribute('opacity', (1 - smooth(span(lf, 100, 140)) * 0.85).toFixed(3)));
    d.tf('.s13-gate', `translate(0 ${(-1400 * (1 - smooth(span(lf, 96, 140)))).toFixed(1)})`);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    streaks(ctx, 0.7, lf, -Math.PI / 2, '220,230,255');
    motes(ctx, view, lf, 50, 'rgba(230,236,255,A)', 71, 1.2, [0, 18], 3);
    PASS.forEach((p, i) => sparks(ctx, view, heroPos(p).x + 40, LEVELS[i].y - 120, lf - p, 30, 22, 90 + i));
    // spears raining down past him
    view.apply(ctx, 1.2);
    ctx.save();
    ctx.lineCap = 'round';
    for (let i = 0; i < 26; i++) {
      const t0 = -18 + i * 6.5, age = lf - t0;
      if (age < 0 || age > 26) continue;
      const cy = camY(t0) - 900 + age * 90;
      const x = 960 + (rand(i) - 0.5) * 1600;
      const tilt = (rand(i + 7) - 0.5) * 0.5;
      ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x - tilt * 300, cy - 300); ctx.stroke();
      ctx.fillStyle = '#d8e0e8'; ctx.beginPath(); ctx.moveTo(x - 10, cy - 4); ctx.lineTo(x + 10, cy - 4); ctx.lineTo(x + tilt * 20, cy + 40); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, cy - 300); ctx.lineTo(x + tilt * 200, cy - 700); ctx.stroke();
    }
    ctx.restore();
  },
};

export default scene;
