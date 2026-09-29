import { clamp, noise, outCubic, outExpo, rand, shake, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, solve, type Pose } from '../rig/hero.ts';
import { at, P, pose, poseTrack } from '../rig/poses.ts';
import { INK } from './kit.ts';
import { shockRing, sparks, whiteFrame } from './fxkit.ts';
import { DOOR, FURNACE, furnace } from './s16.ts';
import { cracks, drawCracks } from './s18.ts';

/**
 * 19 破炉 — a held breath in the dark hall: the furnace ticks and glows along its cracks.
 * Then it bursts. Bronze plates and rainbow light blow out toward the lens, the hall is lit
 * in every colour at once; out of the blast Wukong rises, reaches out, and the staff comes
 * spinning off the flagstones into his hand. Colour is back.
 */

const BOOM = 34, CATCH = 76;
const RAINBOW = ['#ff3a3a', '#ff9a1a', '#ffe23a', '#3ae07a', '#3ab8ff', '#8a5aff'];

const reach = pose({ uaF: -120, faF: -20, uaB: 30, faB: -40, head: -10, torso: -6, thF: -30, shF: 40, thB: 20, shB: 30, plant: 0, brow: 1, mouth: -0.4, look: 1 });
const KEYS: Key<Pose>[] = [
  [BOOM, at(pose({ ...P.crouch, staff: 0, uaF: 30, faF: -100, uaB: 30, faB: -100, plant: 0 }), DOOR.x, DOOR.y + 160, 0.5)],
  [BOOM + 14, at({ ...P.jump, staff: 0, uaF: -170, uaB: -120 }, DOOR.x, 560, 0.86), 'outExpo'],
  [BOOM + 30, at(reach, DOOR.x - 20, 540, 0.9), 'outBack'],
  [CATCH, at({ ...reach, uaF: -110 }, DOOR.x - 20, 560, 0.9)],
  [CATCH + 6, at({ ...P.heroic, staffA: -60, plant: 0, mouth: 0.2, brow: 1 }, DOOR.x - 10, 580, 0.92), 'outExpo'],
  [CATCH + 20, at({ ...P.heroic, staffA: -90, mouth: 0.4, brow: 1 }, DOOR.x, 600, 0.92), 'outBack'],
  [140, at({ ...P.heroic, staffA: -92, mouth: 0.5, brow: 0.9 }, DOOR.x, 600, 0.92), 'inOut'],
];
const heroAt = (lf: number): Pose => {
  const p = poseTrack(KEYS, lf);
  return { ...p, staff: lf >= CATCH ? 1 : 0, glow: clamp(span(lf, BOOM, BOOM + 10)), staffGlow: lf >= CATCH ? 1 - span(lf, CATCH + 10, 120) * 0.5 : 0, wind: 0.9, y: p.y + (lf > CATCH + 20 ? Math.sin(lf * 0.1) * 6 : 0) };
};

// bronze shards: start on the furnace body, blow outward and toward the lens
const SHARDS = Array.from({ length: 34 }, (_, i) => {
  const a = rand(i) * Math.PI * 2, r = 80 + rand(i + 2) * 280;
  return { x: FURNACE.x + Math.cos(a) * r * 1.1, y: FURNACE.y - 220 + Math.sin(a) * r * 0.9, a, v: 18 + rand(i + 4) * 30, spin: (rand(i + 6) - 0.5) * 40, s: 0.6 + rand(i + 8) * 1.2, grow: rand(i + 10) < 0.35 };
});
const shard = (i: number) => {
  const k = 30 + rand(i + 12) * 60;
  return `<g class="s19-sh s19-sh-${i}"><path d="M${-k} ${-k * 0.4}L${k * 0.3} ${-k * 0.8}L${k} ${k * 0.2}L${-k * 0.2} ${k * 0.7}Z" fill="url(#s16-f-bronze)" stroke="${INK}" stroke-width="4"/>
    <path d="M${-k * 0.6} ${-k * 0.2}L${k * 0.6} ${k * 0.1}" stroke="#e8c070" stroke-width="4" opacity=".6"/></g>`;
};
const shardAt = (i: number, lf: number) => {
  const s = SHARDS[i], t = Math.max(0, lf - BOOM);
  const d = s.v * t * (1 - Math.min(0.5, t / 200));
  const z = s.grow ? 1 + t * 0.12 : 1 + t * 0.02;
  return { x: s.x + Math.cos(s.a) * d * (s.grow ? 1.6 : 1), y: s.y + Math.sin(s.a) * d + 0.25 * t * t * (s.grow ? 0 : 1), r: s.spin * t, sc: s.s * z };
};

const STAFF0 = { x: 1500, y: 990 };
const BODY_CRACKS = [...cracks(DOOR.x + 40, DOOR.y - 150, 6, 380, 17), ...cracks(DOOR.x - 60, DOOR.y + 90, 5, 300, 29)];

const scene: SceneDef = {
  id: 19,
  bg: '#0c0806',
  markup: () => [
    plane(0.3, `<rect x="-3000" y="-3000" width="9000" height="8000" fill="#0c0806"/>
      <g class="s19-lit" opacity="0"><rect x="-3000" y="-3000" width="9000" height="8000" fill="url(#s19-rain)"/>
      <defs><radialGradient id="s19-rain" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fff6d0"/>${RAINBOW.map((c, i) => `<stop offset="${(0.15 + i * 0.14).toFixed(2)}" stop-color="${c}"/>`).join('')}<stop offset="1" stop-color="#1a0c20"/></radialGradient></defs></g>
      ${[-300, 260, 1660, 2220].map((x) => `<rect x="${x}" y="-400" width="110" height="1500" fill="#3a1410" stroke="${INK}" stroke-width="4"/>`).join('')}`),
    plane(0.6, `<rect x="-2000" y="880" width="6000" height="800" fill="#1a120c"/>`),
    plane(1, `<rect x="-2000" y="900" width="6000" height="800" fill="#140c08"/>
      <g class="s19-furnace">${furnace('s16-f')}</g>
      <g class="s19-crater" opacity="0"><ellipse cx="${FURNACE.x}" cy="${FURNACE.y + 120}" rx="420" ry="70" fill="#2a1408"/>
        ${[-260, 0, 260].map((dx, i) => `<path d="M${FURNACE.x + dx - 44} ${FURNACE.y + 140}L${FURNACE.x + dx - 30} ${FURNACE.y + 40 - i * 20}L${FURNACE.x + dx + 10} ${FURNACE.y + 70}L${FURNACE.x + dx + 44} ${FURNACE.y + 140}Z" fill="#5a3a1c" stroke="${INK}" stroke-width="4"/>`).join('')}
        <ellipse cx="${FURNACE.x}" cy="${FURNACE.y + 100}" rx="300" ry="50" fill="#ff9a3a" opacity=".6" filter="url(#k-blur16)"/></g>
      <g class="s19-staff"><rect x="-280" y="-11" width="560" height="22" rx="8" fill="#b0281c" stroke="${INK}" stroke-width="4"/>
        <rect x="-280" y="-14" width="64" height="28" rx="6" fill="url(#k-gold)" stroke="${INK}" stroke-width="3"/><rect x="216" y="-14" width="64" height="28" rx="6" fill="url(#k-gold)" stroke="${INK}" stroke-width="3"/>
        <rect x="-300" y="-30" width="600" height="60" rx="30" fill="#ffd24a" opacity=".5" filter="url(#k-blur16)"/></g>
      ${SHARDS.map((s, i) => (s.grow ? '' : shard(i))).join('')}
      ${heroMarkup('wukong', 'sage')}`),
    plane(1.4, SHARDS.map((s, i) => (s.grow ? shard(i) : '')).join('')),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const zoom = track([[-12, 1.3], [BOOM - 2, 1.42, 'inOut'], [BOOM + 6, 0.92, 'outExpo'], [CATCH, 1.0, 'inOut'], [CATCH + 8, 1.12, 'outExpo'], [130, 1.2, 'inOut']], lf);
    const y = track([[-12, 600], [BOOM - 2, 620], [BOOM + 6, 520, 'outExpo'], [BOOM + 20, 400, 'inOut'], [CATCH, 380, 'inOut'], [130, 400]], lf);
    const x = track([[-12, 960], [CATCH, 1040, 'inOut'], [130, 980, 'inOut']], lf);
    return { x: x + noise(lf * 0.05, 1) * 6, y: y + noise(lf * 0.05, 2) * 5, zoom, rot: lf > BOOM ? shake(lf, BOOM, 2, 16)[0] : 0 };
  },
  shake: (t) => {
    const pre = t.lf < BOOM ? [noise(t.lf * 1.5, 1) * span(t.lf, 10, BOOM) * 6, noise(t.lf * 1.5, 2) * span(t.lf, 10, BOOM) * 6] : [0, 0];
    const a = shake(t.lf, BOOM, 48, 16), b = shake(t.lf, CATCH, 16, 8);
    return [pre[0] + a[0] + b[0], pre[1] + a[1] + b[1]];
  },
  heroes: (t) => [{ name: 'wukong', costume: 'sage', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    d.op('.s19-furnace', lf < BOOM ? 1 : 0);
    d.op('.s19-crater', lf < BOOM ? 0 : 1);
    d.op('.s16-f-seam', 0.3 + span(lf, 0, BOOM) * 0.7 * (0.7 + noise(lf * 0.5, 2) * 0.3));
    d.op('.s16-f-under', 0.3 + span(lf, 0, BOOM) * 0.5);
    d.op('.s19-lit', lf < BOOM ? 0 : 0.9 - smooth(span(lf, BOOM + 6, BOOM + 60)) * 0.55);
    d.op('.hero', lf < BOOM + 1 ? 0 : 1);
    SHARDS.forEach((_, i) => {
      const s = shardAt(i, lf);
      d.tf(`.s19-sh-${i}`, `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.r.toFixed(1)}) scale(${s.sc.toFixed(3)})`);
      d.op(`.s19-sh-${i}`, lf < BOOM ? 0 : 1 - smooth(span(lf, BOOM + (SHARDS[i].grow ? 8 : 30), BOOM + (SHARDS[i].grow ? 22 : 60))));
    });
    // staff: lies glowing, lifts and spins into the reaching hand
    const hand = solve(heroAt(CATCH)).hands.F;
    const k = outCubic(span(lf, BOOM + 22, CATCH));
    const sx = STAFF0.x + (hand[0] - STAFF0.x) * k, sy = STAFF0.y + (hand[1] - STAFF0.y) * k - Math.sin(k * Math.PI) * 160;
    d.tf('.s19-staff', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) rotate(${(-4 + k * 900 + (lf < BOOM + 22 ? noise(lf, 3) * 4 * span(lf, 0, BOOM) : 0)).toFixed(1)})`);
    d.op('.s19-staff', lf < CATCH ? 1 : 0);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf, since = lf - BOOM;
    const c = view.toScreen(DOOR.x, DOOR.y);
    // rainbow light rays exploding from the core
    if (since >= 0) {
      const k = outExpo(span(since, 0, 16)), fade = 1 - smooth(span(since, 6, 40)) * 0.9;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2 + since * 0.004 * (i % 2 ? 1 : -1), w = 0.05 + rand(i) * 0.06;
        const L = 2400 * k;
        ctx.fillStyle = RAINBOW[i % RAINBOW.length] + Math.round(0x3a * fade).toString(16).padStart(2, '0');
        ctx.beginPath(); ctx.moveTo(c[0], c[1]);
        ctx.lineTo(c[0] + Math.cos(a - w) * L, c[1] + Math.sin(a - w) * L); ctx.lineTo(c[0] + Math.cos(a + w) * L, c[1] + Math.sin(a + w) * L);
        ctx.fill();
      }
      const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 700);
      g.addColorStop(0, `rgba(255,250,230,${(0.9 * fade * (1 - smooth(span(since, 4, 20)))).toFixed(3)})`); g.addColorStop(1, 'rgba(255,200,120,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
      ctx.restore();
    }
    RAINBOW.forEach((col, i) => shockRing(ctx, view, DOOR.x, DOOR.y + 100, span(since, i * 2, 30 + i * 3), 1400 + i * 120, [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)], 1, 0.5));
    sparks(ctx, view, DOOR.x, DOOR.y, since, 140, 40, 3);
    if (since === 0 || since === 1) whiteFrame(ctx, 1);
    else if (since > 1) whiteFrame(ctx, clamp(1 - (since - 2) / 10) * 0.6, '#fff3cf');
    // pre-blast: cracks racing over the bronze, light leaking through, silence
    if (lf < BOOM) { view.apply(ctx, 1); drawCracks(ctx, BODY_CRACKS, 0.35 + smooth(span(lf, -12, BOOM)) * 0.65, 4 + span(lf, 0, BOOM) * 3, '#ffa030'); }
    if (lf < BOOM) whiteFrame(ctx, smooth(span(lf, 0, BOOM - 4)) * 0.3, '#000000');
    const hand = solve(heroAt(CATCH)).hands.F;
    sparks(ctx, view, hand[0], hand[1], lf - CATCH, 50, 22, 17);
  },
};

export default scene;
