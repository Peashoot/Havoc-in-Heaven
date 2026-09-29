import { clamp, noise, outExpo, rand, shake, smooth, span, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, solve, type Pose } from '../rig/hero.ts';
import { cloudSea, haze, heavenGate, INK } from './kit.ts';
import { motes, sparks, whiteFrame } from './fxkit.ts';
import { ANCHOR, chain, chainPath, floor, HERO, heroAt as kneelAt, post } from './s14.ts';

/**
 * 15 雷、刀、火 — the same flagstones before 南天门. Three punishments, the camera creeping
 * closer after each: a thunderbolt out of the black sky; a giant executioner's blade that
 * shatters on his neck; a ring of fire. Nothing breaks him. As the flames sink to embers he
 * lifts his head, and his eyes hold a faint golden ember.
 */

const THUNDER = 16, BLADE = 60, FIRE = 92;
const PIVOT = { x: 160, y: 250 };
const NECK = { x: HERO.x + 30, y: HERO.y - 215 };
const HIT_A = (Math.atan2(NECK.y - PIVOT.y, NECK.x - PIVOT.x) * 180) / Math.PI;
const BLADE_L = Math.hypot(NECK.x - PIVOT.x, NECK.y - PIVOT.y) + 120;

const heroAt = (lf: number): Pose => {
  const p = kneelAt(lf);
  const jolt = Math.max(0, 1 - Math.abs(lf - THUNDER - 2) / 8), cut = Math.max(0, 1 - Math.abs(lf - BLADE - 1) / 6);
  const lift = smooth(span(lf, 112, 132));
  return {
    ...p,
    head: p.head - jolt * 30 + cut * 10 - lift * 34,
    torso: p.torso - jolt * 10 + cut * 6 - lift * 8,
    lid: clamp(0.7 - lift * 0.75 + jolt * 0.3),
    brow: 0.5 + lift * 0.5,
    mouth: -0.5 - lift * 0.3,
    glow: lift * 0.75,
  };
};

// the executioner's blade (鬼头刀) drawn along +x from the pivot; edge on the +y side
const blade = () => {
  const L = BLADE_L;
  return `<g class="s15-blade"><g class="s15-bladebody">
    <path d="M-40 -16H150V16H-40Z" fill="#3a2a1a" stroke="${INK}" stroke-width="4"/>
    <path d="M-40 16c-30 30 -20 70 -50 90M-40 16c-10 36 10 70 -10 100" fill="none" stroke="#c0392b" stroke-width="12" stroke-linecap="round"/>
    <path d="M150 -40H180V40H150Z" fill="#b8a060" stroke="${INK}" stroke-width="4"/>
    <path d="M180 -34L${L - 180} -44C${L - 60} -48 ${L} -20 ${L + 10} 40C${L - 80} 70 ${L - 300} 80 180 40Z" fill="url(#s15-steel)" stroke="${INK}" stroke-width="5"/>
    <path d="M180 34C${L - 300} 70 ${L - 80} 62 ${L + 4} 36" fill="none" stroke="#f4f8fc" stroke-width="6"/>
    ${[0.3, 0.45, 0.6].map((k) => `<circle cx="${180 + (L - 360) * k}" cy="-20" r="10" fill="none" stroke="#6a7480" stroke-width="4"/>`).join('')}
  </g>
  ${Array.from({ length: 9 }, (_, i) => {
    const x0 = L * (0.5 + i * 0.055), x1 = x0 + L * 0.06;
    return `<path class="s15-shard s15-shard-${i}" d="M${x0} ${-40 + (i % 2) * 10}L${x1} -42L${x1 + 10} ${30 + (i % 3) * 6}L${x0 - 6} 34Z" fill="url(#s15-steel)" stroke="${INK}" stroke-width="3" opacity="0"/>`;
  }).join('')}
  <defs><clipPath id="s15-stub"><rect x="-200" y="-200" width="${L * 0.5}" height="400"/></clipPath><linearGradient id="s15-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a96a4"/><stop offset=".6" stop-color="#d8e0e8"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs></g>`;
};

const FLAMES = Array.from({ length: 16 }, (_, i) => ({ x: HERO.x - 330 + i * 44 + (rand(i) - 0.5) * 20, h: 180 + rand(i + 3) * 200, w: 34 + rand(i + 5) * 26, front: i % 2 === 0 }));
const flamePath = (x: number, base: number, w: number, h: number, sway: number) =>
  `M${(x - w).toFixed(1)} ${base}C${(x - w).toFixed(1)} ${(base - h * 0.4).toFixed(1)} ${(x + sway - w * 0.4).toFixed(1)} ${(base - h * 0.7).toFixed(1)} ${(x + sway).toFixed(1)} ${(base - h).toFixed(1)}C${(x + sway + w * 0.3).toFixed(1)} ${(base - h * 0.66).toFixed(1)} ${(x + w).toFixed(1)} ${(base - h * 0.4).toFixed(1)} ${(x + w).toFixed(1)} ${base}Z`;
const flames = (front: boolean) => FLAMES.map((f, i) => f.front === front ? `<g class="s15-fl s15-fl-${i}"><path fill="#c0281a"/><path fill="#ff7a1a"/><path fill="#ffd24a"/></g>` : '').join('');
const fireAt = (lf: number) => smooth(span(lf, FIRE - 4, FIRE + 6)) * (1 - smooth(span(lf, 116, 136)));

const scene: SceneDef = {
  id: 15,
  bg: '#141a22',
  markup: () => [
    plane(0, `<rect x="-100" y="-100" width="2120" height="1280" fill="url(#s15-sky)"/>
      <rect class="s15-skyflash" x="-100" y="-100" width="2120" height="1280" fill="#c8d8ff" opacity="0"/>
      <defs><linearGradient id="s15-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e121a"/><stop offset=".6" stop-color="#2e3846"/><stop offset="1" stop-color="#5a6676"/></linearGradient></defs>`),
    plane(0.25, cloudSea(-1200, 3200, 720, 120, 5, 'url(#k-cloud-storm)', '', 'rgba(180,190,210,.3)')),
    plane(0.4, `${heavenGate(960, 790, 860, { cold: true })}${haze('#3a4656', 0.45)}`),
    plane(1, `${floor()}${post(ANCHOR.L[0], ANCHOR.L[1])}${post(ANCHOR.R[0], ANCHOR.R[1])}
      <ellipse class="s15-glow" cx="${HERO.x}" cy="${HERO.y - 60}" rx="520" ry="300" fill="#ff7a2a" opacity="0" filter="url(#k-blur40)"/>
      <ellipse class="s15-scorch" cx="${HERO.x}" cy="${HERO.y + 6}" rx="360" ry="50" fill="#120c0a" opacity="0"/>
      ${chain('s14-chainB', 0.8)}
      ${flames(false)}
      ${heroMarkup('wukong', 'furnace')}
      ${chain('s14-chainF', 0.8)}
      ${flames(true)}
      ${blade()}`),
    plane(1.7, `<rect class="s15-grade" x="-6000" y="-4000" width="16000" height="10000" fill="#2a3a58" opacity=".28"/>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    // creeps in after each blow; ends close on the face
    const zoom = track([[-12, 0.95], [THUNDER, 1.05], [BLADE - 12, 1.45, 'inOut'], [BLADE + 4, 1.5], [FIRE, 1.9, 'inOut'], [112, 2.1], [140, 3.4, 'inOut']], lf);
    const x = track([[-12, 960], [BLADE - 12, 900, 'inOut'], [FIRE, 960, 'inOut'], [150, HERO.x + 30, 'inOut']], lf);
    const y = track([[-12, 470], [BLADE - 12, 640, 'inOut'], [FIRE, 700, 'inOut'], [150, HERO.y - 150, 'inOut']], lf);
    return { x: x + noise(lf * 0.04, 2) * 6, y: y + noise(lf * 0.04, 6) * 5, zoom };
  },
  shake: (t) => {
    const a = shake(t.lf, THUNDER, 26, 8), b = shake(t.lf, BLADE, 34, 10);
    return [a[0] + b[0], a[1] + b[1]];
  },
  heroes: (t) => [{ name: 'wukong', costume: 'furnace', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const hands = solve(heroAt(lf)).hands;
    const set = (cls: string, dd: string) => d.all(`.${cls} path`).forEach((p) => p.setAttribute('d', dd));
    set('s14-chainF', chainPath(hands.F, [ANCHOR.R[0], ANCHOR.R[1] - 110], 60 + Math.sin(lf * 0.12) * 4));
    set('s14-chainB', chainPath(hands.B, [ANCHOR.L[0], ANCHOR.L[1] - 110], 70 + Math.sin(lf * 0.12 + 1) * 4));
    d.op('.s15-skyflash', Math.max(0, 1 - Math.abs(lf - THUNDER) / 5) * 0.8 + (lf > 4 && lf < 7 ? 0.3 : 0));
    // blade: raised (anticipation), falls, shatters, stub recoils away
    const raise = smooth(span(lf, BLADE - 30, BLADE - 8));
    const fall = lf < BLADE - 8 ? 0 : lf < BLADE ? outExpo(span(lf, BLADE - 8, BLADE)) : 1;
    const recoil = smooth(span(lf, BLADE + 2, BLADE + 22));
    const up = HIT_A - 85;
    const a = lf < BLADE - 8 ? HIT_A - 55 - 30 * raise : lf < BLADE ? up + (HIT_A - up) * fall : HIT_A - recoil * 50;
    d.tf('.s15-blade', `translate(${PIVOT.x - recoil * 200} ${PIVOT.y - recoil * 260}) rotate(${a.toFixed(2)})`);
    d.op('.s15-blade', lf > BLADE - 32 && lf < BLADE + 22 ? Math.min(1, span(lf, BLADE - 32, BLADE - 24)) * (1 - recoil * 0.6) : 0);
    d.op('.s15-bladebody', 1);
    for (let i = 0; i < 9; i++) {
      const tt = lf - BLADE;
      d.op(`.s15-shard-${i}`, tt >= 0 && tt < 30 ? 1 - tt / 30 : 0);
      d.tf(`.s15-shard-${i}`, tt < 0 ? '' : `translate(${(tt * (8 + i * 3)).toFixed(1)} ${(-tt * (14 - i) + 0.8 * tt * tt).toFixed(1)}) rotate(${(tt * (i % 2 ? 22 : -18)).toFixed(1)} ${BLADE_L * (0.5 + i * 0.055)} 0)`);
    }
    // the blade loses its outer half on impact
    d.attr('.s15-bladebody', 'clip-path', lf >= BLADE ? 'url(#s15-stub)' : '');
    // fire ring
    const fire = fireAt(lf);
    FLAMES.forEach((f, i) => {
      const flick = 0.75 + noise(lf * 0.25, i * 7) * 0.4;
      const h = f.h * fire * flick * (f.front ? 0.42 : 1.15);
      const sway = noise(lf * 0.15, i * 3 + 1) * 40;
      const base = HERO.y + (f.front ? 20 : -10);
      const ps = d.all(`.s15-fl-${i} path`);
      ps[0]?.setAttribute('d', flamePath(f.x, base, f.w, h, sway));
      ps[1]?.setAttribute('d', flamePath(f.x, base, f.w * 0.7, h * 0.75, sway * 0.8));
      ps[2]?.setAttribute('d', flamePath(f.x, base, f.w * 0.4, h * 0.45, sway * 0.6));
    });
    d.op('.s15-glow', fire * 0.7 + smooth(span(lf, 120, 150)) * 0.15);
    d.op('.s15-scorch', smooth(span(lf, FIRE, FIRE + 20)) * 0.6);
    d.attr('.s15-grade', 'fill', fire > 0.05 ? '#5a2a18' : '#2a3a58');
    d.op('.s15-grade', 0.28 - fire * 0.1);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    motes(ctx, view, lf, 50, lf > FIRE ? 'rgba(255,170,90,A)' : 'rgba(210,216,226,A)', 91, 1, lf > FIRE ? [0.3, -1.6] : [0.4, 1.4], 2.5);
    // thunderbolt
    const k = lf - THUNDER;
    if (k >= -1 && k < 6) {
      const top = view.toScreen(NECK.x - 60, -800), hit = view.toScreen(NECK.x, NECK.y);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.save();
      const a = k < 0 ? 0.5 : 1 - k / 6;
      for (const [w, c] of [[26, 'rgba(140,170,255,'], [8, 'rgba(255,255,255,']] as const) {
        ctx.strokeStyle = c + a.toFixed(3) + ')'; ctx.lineWidth = w; ctx.shadowColor = '#9ab8ff'; ctx.shadowBlur = 40; ctx.lineJoin = 'miter';
        ctx.beginPath(); ctx.moveTo(top[0], top[1]);
        for (let i = 1; i < 10; i++) { const f = i / 10; ctx.lineTo(top[0] + (hit[0] - top[0]) * f + (rand(i + 3) - 0.5) * 160, top[1] + (hit[1] - top[1]) * f); }
        ctx.lineTo(hit[0], hit[1]); ctx.stroke();
      }
      ctx.restore();
      if (k === 0 || k === 1) whiteFrame(ctx, 0.8, '#dfe8ff');
    }
    sparks(ctx, view, NECK.x, NECK.y + 60, lf - THUNDER, 60, 20, 11, 1, '170,200,255');
    // blade impact
    sparks(ctx, view, NECK.x, NECK.y, lf - BLADE, 90, 30, 23, 1, '255,240,210');
    if (lf === BLADE) whiteFrame(ctx, 0.9, '#ffffff');
    else if (lf === BLADE + 1) whiteFrame(ctx, 0.35, '#ffffff');
    // embers rising as the fire dies
    if (lf > 110) sparks(ctx, view, HERO.x, HERO.y - 40, (lf - 110) * 0.6, 50, 6, 31, 1, '255,160,80');
  },
};

export default scene;
