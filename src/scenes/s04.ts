import { clamp, noise, outBack, rand, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { at, P, pose, poseTrack } from '../rig/poses.ts';
import { cloud, haze, INK, karst, monkey, orb, sky, wisps } from './kit.ts';
import { motes, sparks, staffSmear } from './fxkit.ts';

/**
 * 04 花果山·自由 — the brightest moment of the film. Wukong (Monkey King) rides his cloud down
 * onto the summit, the 如意金箍棒 grows from a needle to full size in a burst of light, he
 * twirls it overhead and slams it down into the heroic pose while the monkeys cheer; the
 * 水帘洞 waterfall pours below and peach trees are in blossom.
 */

const SUMMIT = { x: 1000, y: 700 };
const surf = pose({ lean: 10, torso: 14, head: -10, thF: -36, shF: 46, fF: -10, thB: 32, shB: 26, fB: -18, uaF: -110, faF: -10, uaB: 60, faB: -30, mouth: 0.9, plant: 0 });
const raise = pose({ uaF: -160, faF: -14, uaB: 20, faB: -30, head: -18, torso: -4, thF: -10, shF: 6, thB: 12, shB: 4, mouth: 0.9, brow: 0.3, look: 1 });
const twirl = pose({ uaF: -168, faF: -6, uaB: -150, faB: -20, head: -14, torso: -2, lean: 0, thF: -24, shF: 26, thB: 26, shB: 12, mouth: 0.95, brow: 0.5, staff: 1, grip: 0.5 });

const KEYS: Key<Pose>[] = [
  [-12, at(surf, 520, 240, 0.78)],
  [10, at(surf, 960, 610, 0.8), 'inOut'],
  [15, at({ ...P.crouch, staff: 0, twoHand: 0, uaF: 20, faF: -40, uaB: 30, faB: -40, brow: 0.2, mouth: 0.6 }, SUMMIT.x, SUMMIT.y, 0.82), 'outExpo'],
  [24, at(raise, SUMMIT.x, SUMMIT.y, 0.82), 'outBack'],
  [44, at({ ...raise, staff: 1 }, SUMMIT.x, SUMMIT.y, 0.82)],
  [50, at(twirl, SUMMIT.x, SUMMIT.y, 0.82), 'outBack'],
  [80, at(twirl, SUMMIT.x, SUMMIT.y, 0.82)],
  [86, at({ ...P.crouch, staffA: 90, grip: 0.35, twoHand: 0.4, mouth: 0.2 }, SUMMIT.x, SUMMIT.y, 0.82), 'inBack'],
  [96, at({ ...P.heroic, mouth: 1, brow: 0.3 }, SUMMIT.x, SUMMIT.y, 0.82), 'outBack'],
  [140, at({ ...P.heroic, mouth: 1, brow: 0.3, head: -8 }, SUMMIT.x, SUMMIT.y, 0.82)],
];

const heroAt = (lf: number): Pose => {
  const p = poseTrack(KEYS, lf);
  const grow = outBack(span(lf, 26, 44));
  const spin = lf < 50 ? -90 : lf < 80 ? -90 - 1080 * smooth(span(lf, 50, 80)) : lf < 86 ? -90 + 180 * smooth(span(lf, 80, 86)) : -90;
  return {
    ...p,
    staff: lf < 24 ? 0 : 1,
    staffLen: lf < 26 ? 0.04 : Math.max(0.04, grow),
    staffA: lf < 86 ? spin : p.staffA,
    grip: lf < 86 ? 0.5 : p.grip,
    staffGlow: clamp(1 - span(lf, 60, 110) * 0.6),
    wind: 0.3,
  };
};
const cloudAt = (lf: number) => { const h = heroAt(lf); return { x: h.x - 20, y: h.y + 14, op: 1 - smooth(span(lf, 12, 24)) }; };

const peachTree = (x: number, y: number, s: number, flip = false) => {
  const f = flip ? -1 : 1;
  const blossoms = Array.from({ length: 26 }, (_, i) => {
    const a = rand(i + x) * Math.PI * 2, r = 40 + rand(i * 3 + x) * 120;
    const cx = Math.cos(a) * r * 1.3, cy = -220 + Math.sin(a) * r * 0.7;
    return i % 4 === 0
      ? `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="11" fill="#f08a78" stroke="${INK}" stroke-width="2"/><path d="M${cx.toFixed(0)} ${(cy - 10).toFixed(0)}q8 -8 14 -2" fill="#4c9a54"/>`
      : `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(6 + rand(i) * 5).toFixed(1)}" fill="${i % 3 ? '#ffc0cf' : '#ff9fb6'}"/>`;
  }).join('');
  return `<g transform="translate(${x} ${y}) scale(${s * f} ${s})">
    <path d="M0 0C-6 -60 10 -120 -10 -180M-4 -120C30 -150 60 -170 100 -170M-8 -150C-40 -180 -80 -190 -110 -186" fill="none" stroke="#5a3a22" stroke-width="16" stroke-linecap="round"/>
    <ellipse cx="0" cy="-220" rx="190" ry="110" fill="#6fb05c"/><ellipse cx="-60" cy="-250" rx="110" ry="70" fill="#86c46a"/><ellipse cx="70" cy="-200" rx="120" ry="70" fill="#5a9a4a"/>
    ${blossoms}</g>`;
};

const waterfall = () => `<g class="s4-fall">
  <!-- cliffs framing the cleft -->
  <path d="M1180 900C1170 700 1190 480 1250 330C1280 260 1320 250 1330 300C1310 420 1300 620 1310 900Z" fill="#3c6f58" stroke="#284a3a" stroke-width="4"/>
  <path d="M1560 900C1570 700 1550 480 1490 330C1460 260 1420 250 1410 300C1430 420 1440 620 1430 900Z" fill="#35644f" stroke="#284a3a" stroke-width="4"/>
  <path d="M1250 330C1280 260 1320 250 1330 300C1320 360 1310 420 1306 480C1290 420 1280 360 1250 330Z" fill="#5e9a78"/>
  <!-- the falling water: narrow lip at the top, flaring as it drops -->
  <path d="M1336 300C1350 294 1394 294 1404 300C1420 460 1440 640 1470 860H1270C1300 640 1320 460 1336 300Z" fill="#cdeef4" opacity=".92"/>
  ${Array.from({ length: 11 }, (_, i) => { const t = i / 10; return `<path class="s4-stream" d="M${(1340 + t * 60).toFixed(0)} 300C${(1336 + t * 70).toFixed(0)} 500 ${(1300 + t * 150).toFixed(0)} 700 ${(1276 + t * 190).toFixed(0)} 860" fill="none" stroke="#ffffff" stroke-width="${3 + (i % 3) * 2.5}" stroke-dasharray="${50 + (i % 4) * 20} ${30 + (i % 3) * 15}" stroke-linecap="round" opacity=".9"/>`; }).join('')}
  <ellipse cx="1370" cy="860" rx="230" ry="60" fill="#fff" opacity=".9" filter="url(#k-blur16)"/>
  <ellipse cx="1370" cy="850" rx="150" ry="26" fill="#fff"/>
  <!-- plaque carved into the left cliff -->
  <g transform="translate(1238 520) rotate(-4)"><rect x="-26" y="-70" width="52" height="140" rx="4" fill="#2c3a36" stroke="#c9a85a" stroke-width="3"/>
    <text class="brush" x="0" y="-30" text-anchor="middle" font-size="34" fill="#e8cf86">水</text><text class="brush" x="0" y="10" text-anchor="middle" font-size="34" fill="#e8cf86">帘</text><text class="brush" x="0" y="50" text-anchor="middle" font-size="34" fill="#e8cf86">洞</text></g>
</g>`;

const MONKEYS: [number, number, number, boolean][] = [
  [760, 720, 0.9, false], [690, 760, 0.8, false], [1230, 740, 0.9, true], [1320, 780, 0.8, true],
  [560, 820, 1.1, false], [1460, 830, 1.1, true], [860, 790, 0.7, false], [1150, 800, 0.75, true],
];

const scene: SceneDef = {
  id: 4,
  bg: '#6fc4e6',
  markup: () => [
    plane(0, `${sky('s4-sky', [[0, '#3d9fd6'], [0.55, '#9fdcef'], [1, '#fff1c8']])}${orb(1540, 220, 70, '#fff8dc')}
      ${cloud(80, 330, 520, 120, 3, 'url(#k-cloud-day)')}${cloud(1080, 280, 420, 100, 5, 'url(#k-cloud-day)')}`),
    plane(0.2, `${[[120, 760, 220, 560], [360, 760, 180, 420], [1500, 760, 240, 600], [1760, 760, 200, 470], [620, 760, 150, 330]].map(([x, b, w, h], i) => karst(x, b, w, h, '#87b8b4', '#6f9f9d', 30 + i)).join('')}${haze('#dff2f4', 0.3)}`),
    plane(0.45, `${[[200, 900, 300, 620], [470, 900, 220, 480], [1600, 900, 320, 640], [1860, 900, 240, 500]].map(([x, b, w, h], i) => karst(x, b, w, h, '#4f9a6a', '#357a52', 40 + i)).join('')}
      ${waterfall()}${wisps(-100, 600, 900, 3, 7, '#ffffff', 0.5)}`),
    plane(0.75, `${peachTree(420, 900, 1.1)}${peachTree(1600, 920, 1.2, true)}`),
    plane(1, `<path d="M640 1300C660 1000 760 780 860 730C930 700 1080 700 1150 730C1260 790 1340 1000 1360 1300Z" fill="#3f7a58" stroke="${INK}" stroke-width="4"/>
      <path d="M860 730C930 700 1080 700 1150 730C1100 760 920 770 860 730Z" fill="#6aa877"/>
      <path d="M1150 730C1260 790 1340 1000 1360 1300H1200C1230 1000 1190 820 1150 730Z" fill="#2c5a42"/>
      <path d="M760 900C800 860 850 850 900 870M1100 880C1150 860 1200 880 1230 920" fill="none" stroke="#2a4a36" stroke-width="5"/>
      <path d="M400 1300C420 1000 500 860 600 830C680 810 720 850 740 900L780 1300Z" fill="#356a4c"/>
      <path d="M1260 1300C1300 980 1400 860 1500 850C1600 850 1640 950 1660 1300Z" fill="#356a4c"/>
      ${MONKEYS.map(([x, y, s, f], i) => `<g class="s4-mk s4-mk-${i}">${monkey(x, y, s, i, f)}</g>`).join('')}
      <g class="s4-cloud">${cloud(-140, 30, 280, 70, 42, 'url(#k-cloud-gold)', '', '#fff6d0')}</g>
      ${heroMarkup('wukong', 'king')}`),
    plane(1.6, `<g class="s4-fg">
      <path d="M-200 -100C100 -40 300 20 520 40C420 60 300 80 180 150" fill="none" stroke="#4a2e1a" stroke-width="26" stroke-linecap="round"/>
      ${Array.from({ length: 18 }, (_, i) => `<circle cx="${(-100 + i * 36 + rand(i) * 30).toFixed(0)}" cy="${(-20 + rand(i + 5) * 100 + i * 2).toFixed(0)}" r="${(12 + rand(i + 9) * 12).toFixed(0)}" fill="${i % 3 ? '#ffb3c6' : '#ff8fab'}"/>`).join('')}
      <path d="M1700 1200C1760 1040 1860 980 2100 990V1200Z" fill="#1f3d2c"/>
      <path d="M-200 1200C-100 1060 40 1020 180 1060C240 1080 260 1140 260 1200Z" fill="#1f3d2c"/></g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const x = track([[-12, 760], [16, 990, 'outExpo'], [50, 1000], [80, 1030], [96, 1000, 'outBack'], [140, 990]], lf);
    const y = track([[-12, 380], [16, 520, 'outExpo'], [50, 470], [96, 440], [140, 420]], lf);
    const zoom = track([[-12, 0.95], [16, 1.02, 'outExpo'], [44, 1.22, 'inOut'], [80, 1.26], [86, 1.18, 'inBack'], [96, 1.6, 'outBack'], [140, 1.72]], lf);
    return { x: x + noise(lf * 0.04, 1) * 6, y: y + noise(lf * 0.04, 2) * 4, zoom };
  },
  shake: (t) => { const k = t.lf - 94; return k >= 0 && k < 14 ? [Math.sin(k * 3) * 10 * (1 - k / 14), Math.cos(k * 4) * 7 * (1 - k / 14)] : [0, 0]; },
  heroes: (t) => [{ name: 'wukong', costume: 'king', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    d.attr('.s4-stream', 'stroke-dashoffset', (-lf * 14).toFixed(0));
    const c = cloudAt(lf);
    d.tf('.s4-cloud', `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)})`);
    d.op('.s4-cloud', c.op);
    MONKEYS.forEach(([x, y], i) => {
      const cheer = smooth(span(lf, 30 + i * 2, 40 + i * 2));
      const hop = Math.abs(Math.sin((lf + i * 5) * 0.28)) * (18 + (i % 3) * 10) * cheer;
      d.tf(`.s4-mk-${i}`, `translate(0 ${(-hop).toFixed(1)}) rotate(${(Math.sin(lf * 0.2 + i) * 6 * cheer).toFixed(1)} ${x} ${y})`);
    });
    d.tf('.s4-fg', `translate(${Math.sin(lf * 0.03) * 10} ${Math.sin(lf * 0.05) * 6})`);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    motes(ctx, view, lf, 40, 'rgba(255,190,210,A)', 4, 1.2, [1.4, 0.8], 5);
    staffSmear(ctx, view, heroAt, lf, 4, [255, 220, 120]);
    // light burst as the staff reaches full size
    const hand = heroAt(lf);
    const [hx, hy] = view.toScreen(hand.x + 40, hand.y - 330);
    const burst = smooth(span(lf, 30, 44)) * (1 - smooth(span(lf, 44, 60)));
    if (burst > 0.01) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const g = ctx.createRadialGradient(hx, hy, 5, hx, hy, 600);
      g.addColorStop(0, `rgba(255,248,210,${burst.toFixed(2)})`);
      g.addColorStop(0.3, `rgba(255,214,110,${(burst * 0.5).toFixed(2)})`);
      g.addColorStop(1, 'rgba(255,214,110,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    }
    sparks(ctx, view, hand.x + 40, hand.y - 330, lf - 40, 70, 20, 7, 1);
    // glint travelling up the planted staff and a star at its tip (hands to the flash transition)
    const glint = smooth(span(lf, 100, 118));
    if (glint > 0.01) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const [gx, gy] = view.toScreen(SUMMIT.x + 30, SUMMIT.y - 250 - glint * 330);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(255,250,220,${(0.9 * glint).toFixed(2)})`;
      const r = 30 + glint * 160;
      ctx.beginPath();
      ctx.moveTo(gx, gy - r); ctx.lineTo(gx + r * 0.08, gy - r * 0.08); ctx.lineTo(gx + r, gy); ctx.lineTo(gx + r * 0.08, gy + r * 0.08);
      ctx.lineTo(gx, gy + r); ctx.lineTo(gx - r * 0.08, gy + r * 0.08); ctx.lineTo(gx - r, gy); ctx.lineTo(gx - r * 0.08, gy - r * 0.08);
      ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  },
};

export default scene;
