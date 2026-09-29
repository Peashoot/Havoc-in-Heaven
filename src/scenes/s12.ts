import { clamp, noise, outExpo, rand, shake, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { at, blend, P, poseTrack } from '../rig/poses.ts';
import { cloud, cloudSea, haze, rows, sky, soldier } from './kit.ts';
import { motes, shockRing, sparks, speedLines, staffSmear, whiteFrame } from './fxkit.ts';

/**
 * 12 第一棒 — silence, a long anticipation crouch, an explosive leap, two white frames
 * (global 1612–1613), a golden shockwave that blows the heavenly ranks out of the sky
 * and splits the cloud bank, decaying shake, overshoot settle.
 */

const HIT = 82; // local frame of impact (1530 + 82 = 1612)
const IMPACT = { x: 1330, y: 600 };
const guard: Pose = { ...blend(P.heroic, P.crouch, 0.25), staffA: -40, grip: 0.4, twoHand: 0.6, brow: 0.8, mouth: -0.2 };

const KEYS: Key<Pose>[] = [
  [0, at(guard, 560, 820, 1.0)],
  [30, at({ ...guard, head: -10, lid: 0.15 }, 560, 820, 1.0)],
  [52, at(P.crouch, 530, 820, 1.0), 'inOut'],
  [68, at({ ...P.windup, lean: -8 }, 500, 818, 1.0), 'inBack'],
  [77, at({ ...P.strike, plant: 0 }, 900, 700, 1.06), 'outExpo'],
  [HIT, at(P.follow, 1000, 830, 1.06), 'outExpo'],
  [100, at({ ...P.follow, torso: 32, head: 0 }, 985, 862, 1.05), 'outBack'],
  [150, at({ ...P.follow, torso: 28, head: -6, mouth: 0.3, brow: 0.6 }, 980, 862, 1.05), 'inOut'],
];
const heroAt = (lf: number) => poseTrack(KEYS, lf);

// ranks of heavenly soldiers on the cloud bank (mid plane)
const RANKS = rows(27, 9, 1020, 520, 104, 70, 30, 12);
const flyOf = (i: number, x: number, y: number) => {
  const dx = x - IMPACT.x, dy = y - IMPACT.y;
  const d = Math.max(80, Math.hypot(dx, dy));
  const pow = 900 / Math.sqrt(d);
  return { vx: (dx / d) * pow * (0.8 + rand(i) * 0.6) + 18, vy: -Math.abs(dy / d) * pow * 0.6 - 26 - rand(i + 4) * 16, spin: (rand(i + 9) - 0.3) * 26 };
};

const scene: SceneDef = {
  id: 12,
  bg: '#0e1420',
  markup: () => {
    const farArmy = rows(80, 20, -40, 330, 102, 26, 20, 3).map(([x, y], i) => soldier(x, y, 0.2, i, true, 0, 's12-far')).join('');
    const mid = RANKS.map(([x, y, r], i) => `<g class="s12-sol-${i}">${soldier(x, y + 40, 0.42 + r * 0.06, i, true, 1, 's12-sol')}</g>`).join('');
    return [
      plane(0, `${sky('s12-sky', [[0, '#0a0f1a'], [0.45, '#1c2638'], [0.7, '#4a3a38'], [1, '#6b4a30']])}
        <ellipse cx="1300" cy="520" rx="700" ry="220" fill="url(#k-glow-warm)" opacity=".25" class="s12-sky-glow"/>`),
      plane(0.15, `${cloudSea(-400, 2320, 400, 70, 4, 'url(#k-cloud-storm)', '', 'rgba(150,160,180,.35)')}${farArmy}${haze('#1c2638', 0.35)}`),
      plane(0.45, `<g class="s12-split-top">${cloudSea(-400, 2320, 520, 90, 9, 'url(#k-cloud-storm)', '', 'rgba(200,180,140,.35)')}</g>
        <rect class="s12-gap" x="-400" y="505" width="2720" height="30" fill="#ffe3a0" opacity="0" filter="url(#k-blur16)"/>`),
      plane(0.75, `<g class="s12-bank">${cloudSea(-400, 2400, 640, 120, 17, 'url(#k-cloud-storm)', '', 'rgba(210,190,150,.45)')}</g>${mid}`),
      plane(1, `<path d="M-200 1200L-200 836C80 806 400 812 640 826C780 836 900 850 1040 880L1120 1200Z" fill="#1d1a1c"/>
        <path d="M-200 836C80 806 400 812 640 826C780 836 900 850 1040 880" fill="none" stroke="#8a6a44" stroke-width="5"/>
        <path d="M200 900l60 -18l40 30M520 880l40 -10l30 24" fill="none" stroke="#3a3030" stroke-width="6"/>
        ${heroMarkup('wukong', 'sage')}`),
      plane(1.7, `<g class="s12-fg"><path d="M-300 1200C-200 1000 60 930 260 980C380 1010 420 1100 440 1200Z" fill="#0b0a0d"/>
        <path d="M1600 1200C1700 1050 1900 1000 2200 1040V1200Z" fill="#0b0a0d"/>
        ${cloud(1500, 1150, 900, 240, 77, 'url(#k-cloud-storm)', 's12-fg-cloud', 'rgba(120,120,140,.4)')}</g>`),
    ].join('');
  },
  camera: (t) => {
    const lf = t.lf;
    const x = track([[0, 880], [60, 850], [HIT, 1080, 'outExpo'], [150, 1110]], lf);
    const y = track([[0, 600], [60, 620], [HIT, 590, 'outExpo'], [150, 580]], lf);
    const zoom = track([[0, 1.0], [40, 1.08], [70, 1.02, 'inOut'], [HIT, 1.34, 'outExpo'], [104, 1.16, 'outBack'], [150, 1.12]], lf);
    return { x: x + noise(lf * 0.05, 3) * 6, y: y + noise(lf * 0.05, 7) * 4, zoom, rot: lf > HIT ? shake(lf, HIT, 1.6, 12)[0] : 0 };
  },
  shake: (t) => shake(t.lf, HIT, 38, 11),
  heroes: (t) => [{ name: 'wukong', costume: 'sage', pose: { ...heroAt(t.lf), staffGlow: smooth(span(t.lf, 40, 76)), wind: 0.4 } }],
  update: (d, t) => {
    const lf = t.lf, since = lf - HIT;
    RANKS.forEach(([x, y], i) => {
      const k = Math.max(0, since);
      const { vx, vy, spin } = flyOf(i, x, y);
      const delay = Math.hypot(x - IMPACT.x, y - IMPACT.y) / 60;
      const tt = Math.max(0, k - delay);
      const brace = lf < HIT ? smooth(span(lf, 40, 70)) * 6 : 0; // ranks lean back as he winds up
      d.tf(`.s12-sol-${i}`, `translate(${(vx * tt).toFixed(1)} ${(vy * tt + 1.1 * tt * tt).toFixed(1)}) rotate(${(spin * tt - brace).toFixed(1)} ${x} ${y})`);
      d.op(`.s12-sol-${i}`, 1 - smooth(span(tt, 14, 40)));
    });
    const split = outExpo(span(since, 0, 30));
    d.tf('.s12-split-top', `translate(0 ${(-split * 90).toFixed(1)})`);
    d.tf('.s12-bank', `translate(0 ${(split * 120).toFixed(1)})`);
    d.op('.s12-gap', split * (0.9 - span(since, 30, 68) * 0.5));
    d.attr('.s12-gap', 'height', 14 + split * 40);
    d.attr('.s12-gap', 'y', 520 - split * 30);
    d.op('.s12-sky-glow', 0.2 + 0.5 * smooth(span(since, 0, 20)) - 0.2 * smooth(span(since, 30, 68)));
    d.tf('.s12-fg-cloud', `translate(${(-lf * 2 - Math.max(0, since) * 12).toFixed(1)} 0)`);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf, since = lf - HIT;
    motes(ctx, view, lf, 40, 'rgba(255,210,150,A)', 5, 0.8, [1.4, -0.4], 2.5);
    staffSmear(ctx, view, heroAt, lf, 5);
    const imp = view.toScreen(IMPACT.x, IMPACT.y);
    speedLines(ctx, imp[0], imp[1], clamp(1 - Math.abs(lf - HIT + 3) / 14) * 0.9, lf);
    shockRing(ctx, view, IMPACT.x, IMPACT.y, span(since, 0, 34), 1300, [255, 214, 110], 0.75, 0.4);
    shockRing(ctx, view, IMPACT.x, IMPACT.y, span(since, 6, 44), 1700, [255, 240, 200], 0.75, 0.35);
    sparks(ctx, view, IMPACT.x, IMPACT.y, since, 120, 34, 21, 0.75);
    if (lf === HIT || lf === HIT + 1) whiteFrame(ctx, 1);
    else if (since > 1) whiteFrame(ctx, clamp(1 - (since - 2) / 8) * 0.5, '#fff3cf');
    // anticipation: a darkening held breath before the strike
    if (lf < HIT) whiteFrame(ctx, smooth(span(lf, 30, 70)) * 0.25 * (1 - smooth(span(lf, 72, HIT))), '#05070c');
  },
};

export default scene;
