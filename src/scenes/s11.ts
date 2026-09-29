import { clamp, inCubic, noise, outBack, rand, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, solve, type Pose } from '../rig/hero.ts';
import { at, blend, P, pose, poseTrack } from '../rig/poses.ts';
import { cloud, cloudSea, haze, INK, sky, soldier } from './kit.ts';
import { motes, shockRing, sparks, whiteFrame } from './fxkit.ts';

/**
 * 11 天兵压境 — storm clouds swallow the sun. Row after row of heavenly soldiers rise out of
 * the cloud banks with banners, each rank on its own depth plane. Wukong, small on the peak,
 * clenches his fists; golden armour flares onto him (king → sage), he raises a hand and the
 * staff comes spinning out of the sky into it. Ends on the guard pose that opens scene 12.
 */

const HERO = { x: 560, y: 820 };
const ARMOUR = 72;
const CATCH = 126;
const guard: Pose = { ...blend(P.heroic, P.crouch, 0.25), staffA: -40, grip: 0.4, twoHand: 0.6, brow: 0.8, mouth: -0.2 };
const call = pose({ uaF: -150, faF: -16, uaB: 24, faB: -30, head: -16, torso: -4, thF: -14, shF: 10, thB: 16, shB: 6, brow: 1, mouth: -0.4, look: 1 });

const KEYS: Key<Pose>[] = [
  [-14, at(pose({ head: -18, mouth: 0.3, brow: 0.3, look: 1 }), HERO.x, HERO.y, 1)],
  [30, at(pose({ head: -20, mouth: -0.1, brow: 0.6, look: 1 }), HERO.x, HERO.y, 1)],
  [52, at({ ...P.angry, head: -14 }, HERO.x, HERO.y, 1), 'inOut'],
  [66, at({ ...P.crouch, staff: 0, uaF: 30, faF: -90, uaB: 30, faB: -80, brow: 1, mouth: -0.6 }, HERO.x, HERO.y, 1), 'inBack'],
  [ARMOUR + 2, at(pose({ uaF: -60, faF: -10, uaB: -40, faB: -10, head: -10, torso: -8, thF: -20, shF: 12, thB: 20, shB: 8, brow: 1, mouth: -0.8 }), HERO.x, HERO.y, 1), 'outExpo'],
  [96, at(pose({ uaF: 20, faF: -60, uaB: 20, faB: -60, head: -12, brow: 1, mouth: -0.4 }), HERO.x, HERO.y, 1), 'inOut'],
  [110, at(call, HERO.x, HERO.y, 1), 'outBack'],
  [CATCH, at({ ...call, uaF: -144 }, HERO.x, HERO.y, 1)],
  [CATCH + 6, at({ ...guard, staff: 1 }, HERO.x, HERO.y, 1), 'outBack'],
  [160, at({ ...guard, staff: 1 }, HERO.x, HERO.y, 1)],
];
const heroAt = (lf: number): Pose => {
  const p = poseTrack(KEYS, lf);
  return { ...p, staff: lf >= CATCH ? 1 : 0, staffA: lf >= CATCH ? p.staffA : -40, wind: 0.5 + smooth(span(lf, ARMOUR, ARMOUR + 10)) * 0.3 };
};

// ranks of the army: [plane z, ground y, soldier scale, spacing, rise frame, x0, x1]
const RANKS: [number, number, number, number, number, number, number][] = [
  [0.1, 360, 0.42, 60, 12, -300, 2300],
  [0.22, 460, 0.56, 78, 26, -300, 2400],
  [0.38, 570, 0.74, 100, 40, 200, 2600],
  [0.58, 690, 0.96, 130, 54, 900, 2800],
];

const banner = (x: number, y: number, s: number, i: number) => {
  const c = ['#c0392b', '#e0a820', '#2d5f9a'][i % 3];
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V-560" stroke="#3a2a1a" stroke-width="8"/><path d="M-6 -560l6 -30l6 30Z" fill="#e8c860"/>
    <path class="s11-flag" d="M4 -540C60 -548 120 -530 170 -540L150 -480L170 -420C120 -410 60 -428 4 -420Z" fill="${c}" stroke="${INK}" stroke-width="4"/>
    <path d="M40 -500h80M40 -470h80" stroke="#f2e6c6" stroke-width="6" opacity=".7"/></g>`;
};

const rank = (k: number) => {
  const [, y, s, dx, , x0, x1] = RANKS[k];
  let men = '', flags = '';
  let i = 0;
  for (const line of [0, 1]) {
    for (let x = x0 + line * dx * 0.5; x < x1; x += dx, i++) {
      men += soldier(x + (rand(k * 50 + i) - 0.5) * dx * 0.3, y - (1 - line) * 34 * s, s * (0.92 + line * 0.08), i + k * 7, true, k > 0 ? 1 : 0, 's11-sol');
      if (line === 0 && i % 5 === 2) flags += banner(x + dx * 0.4, y - 30 * s, s * 0.8, i + k);
    }
  }
  const h = 60 + k * 26;
  return `${cloudSea(x0 - 600, x1 + 600, y + h * 0.55, h, 20 + k, 'url(#k-cloud-storm)', '', 'rgba(170,170,190,.35)')}<g class="s11-rank s11-rank-${k}">${flags}${men}</g>`;
};

const staffProp = `<g class="s11-staff"><rect x="-280" y="-10" width="560" height="20" rx="8" fill="#b0281c" stroke="${INK}" stroke-width="4"/>
  <rect x="-280" y="-13" width="64" height="26" rx="6" fill="url(#k-gold)" stroke="${INK}" stroke-width="3"/><rect x="216" y="-13" width="64" height="26" rx="6" fill="url(#k-gold)" stroke="${INK}" stroke-width="3"/></g>`;

const scene: SceneDef = {
  id: 11,
  bg: '#1a1420',
  markup: () => [
    plane(0, `${sky('s11-warm', [[0, '#3a2440'], [0.6, '#9a4a4a'], [1, '#e89a5a']])}
      <g class="s11-sun"><circle cx="1320" cy="420" r="360" fill="url(#k-glow-warm)" opacity=".7"/><circle cx="1320" cy="420" r="110" fill="#ffe0a0"/></g>
      <g class="s11-dark" opacity="0">${sky('s11-sky', [[0, '#0a0f1a'], [0.45, '#1c2638'], [0.7, '#4a3a38'], [1, '#6b4a30']])}</g>`),
    plane(0.06, `<g class="s11-swallow">${cloud(400, 150, 1400, 420, 11, 'url(#k-cloud-storm)', 's11-sw-a', 'rgba(90,90,110,.4)')}${cloud(1600, 260, 1500, 460, 13, 'url(#k-cloud-storm)', 's11-sw-b', 'rgba(90,90,110,.4)')}</g>`),
    ...RANKS.map(([z], k) => plane(z, `${rank(k)}${k === 1 ? haze('#1c2638', 0.25) : ''}`)),
    plane(1, `<path d="M-200 1200L-200 836C80 806 400 812 640 826C780 836 900 850 1040 880L1120 1200Z" fill="#1d1a1c"/>
      <path d="M-200 836C80 806 400 812 640 826C780 836 900 850 1040 880" fill="none" stroke="#8a6a44" stroke-width="5"/>
      <path d="M200 900l60 -18l40 30M520 880l40 -10l30 24" fill="none" stroke="#3a3030" stroke-width="6"/>
      <circle class="s11-aura" cx="${HERO.x}" cy="${HERO.y - 200}" r="260" fill="url(#k-glow-warm)" opacity="0"/>
      ${heroMarkup('wukong', 'king')}
      ${staffProp}`),
    plane(1.7, `<g class="s11-fg"><path d="M-300 1200C-200 1000 60 930 260 980C380 1010 420 1100 440 1200Z" fill="#0b0a0d"/>
      <path d="M1600 1200C1700 1050 1900 1000 2200 1040V1200Z" fill="#0b0a0d"/></g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const x = track([[-14, 640], [40, 700], [ARMOUR, 640, 'inOut'], [ARMOUR + 6, 620, 'outExpo'], [110, 760, 'inOut'], [CATCH, 820], [150, 880, 'inOut']], lf);
    const y = track([[-14, 700], [40, 560, 'inOut'], [ARMOUR, 620, 'inOut'], [110, 560, 'inOut'], [150, 600, 'inOut']], lf);
    const zoom = track([[-14, 1.5], [40, 1.2, 'inOut'], [66, 1.34, 'inOut'], [ARMOUR + 4, 1.5, 'outExpo'], [100, 1.12, 'inOut'], [CATCH, 1.04], [CATCH + 4, 1.1, 'outExpo'], [150, 1.0, 'inOut']], lf);
    return { x: x + noise(lf * 0.04, 2) * 7, y: y + noise(lf * 0.04, 5) * 5, zoom };
  },
  shake: (t) => { const k = t.lf - ARMOUR, c = t.lf - CATCH; const a = k >= 0 && k < 12 ? 12 * (1 - k / 12) : 0, b = c >= 0 && c < 8 ? 9 * (1 - c / 8) : 0; return [Math.sin(t.lf * 3) * (a + b), Math.cos(t.lf * 4) * (a + b)]; },
  heroes: (t) => [{ name: 'wukong', costume: t.lf >= ARMOUR ? 'sage' : 'king', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const dark = smooth(span(lf, -6, 44));
    d.op('.s11-dark', dark);
    d.op('.s11-sun', 1 - smooth(span(lf, 0, 40)));
    d.tf('.s11-sw-a', `translate(${(260 - dark * 260).toFixed(1)} ${(-160 + dark * 160).toFixed(1)})`);
    d.tf('.s11-sw-b', `translate(${(-200 + dark * 200).toFixed(1)} ${(-100 + dark * 100).toFixed(1)})`);
    RANKS.forEach(([, , , , t0], k) => {
      const rise = outBack(span(lf, t0, t0 + 20));
      d.tf(`.s11-rank-${k}`, `translate(0 ${((1 - rise) * (160 + k * 60)).toFixed(1)})`);
      d.op(`.s11-rank-${k}`, clamp(span(lf, t0 - 2, t0 + 10)));
    });
    d.all('.s11-flag').forEach((f, i) => f.setAttribute('transform', `skewY(${(Math.sin(lf * 0.2 + i) * 4).toFixed(2)})`));
    d.op('.s11-aura', Math.max(0, 1 - Math.abs(lf - ARMOUR - 2) / 16) * 0.9);
    // the staff: spins down out of the storm into the raised hand
    const hand = solve(heroAt(CATCH)).hands.F;
    const k = inCubic(span(lf, 100, CATCH));
    const sx = 1900 + (hand[0] - 1900) * k, sy = -300 + (hand[1] - -300) * k - Math.sin(k * Math.PI) * 120;
    d.tf('.s11-staff', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) rotate(${(k * 1080 + 50).toFixed(1)}) scale(${(0.9 + k * 0.1).toFixed(3)})`);
    d.op('.s11-staff', lf > 100 && lf < CATCH ? 1 : 0);
    d.tf('.s11-fg', `translate(${(Math.sin(lf * 0.03) * 8).toFixed(1)} 0)`);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    motes(ctx, view, lf, 50, 'rgba(200,210,230,A)', 61, 0.7, [1.6, 0.6], 2);
    // lightning in the storm
    for (const at of [10, 34, 58, 92]) {
      const k = lf - at;
      if (k < 0 || k > 5) continue;
      const a = (1 - k / 5);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.save();
      ctx.strokeStyle = `rgba(230,236,255,${a.toFixed(3)})`; ctx.lineWidth = 5; ctx.shadowColor = '#b8c8ff'; ctx.shadowBlur = 30;
      let x = 1000 + rand(at) * 800, y = 0;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let i = 1; i < 9; i++) { x += (rand(at + i) - 0.5) * 140; y += 40 + rand(at * 3 + i) * 20; ctx.lineTo(x, y); }
      ctx.stroke(); ctx.restore();
      whiteFrame(ctx, a * 0.18, '#c8d4ff');
    }
    // armour flare
    const hx = HERO.x, hy = HERO.y - 200;
    shockRing(ctx, view, hx, hy + 180, span(lf, ARMOUR, ARMOUR + 22), 900, [255, 214, 110], 1, 0.35);
    sparks(ctx, view, hx, hy, lf - ARMOUR, 80, 24, 7);
    if (lf >= ARMOUR && lf < ARMOUR + 2) whiteFrame(ctx, 0.5, '#fff0c0');
    // the catch
    const hand = solve(heroAt(CATCH)).hands.F;
    sparks(ctx, view, hand[0], hand[1], lf - CATCH, 40, 20, 19);
  },
};

export default scene;
