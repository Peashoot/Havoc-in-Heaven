import { clamp, noise, outBack, rand, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { at, P, pose, poseTrack, walk } from '../rig/poses.ts';
import { cloud, haze, INK, karst, orb, pine, ridge, sky, stairs } from './kit.ts';
import { motes, streaks } from './fxkit.ts';

/**
 * 03 三星洞求道 — the camera cranes up the mountain steps with Wukong to the 斜月三星洞 gate,
 * where 菩提祖师 sits beneath a pine. He kowtows, meditates while the Way is revealed
 * (a glowing scroll, falling leaves frozen mid-air), forms a hand seal, summons a golden
 * somersault cloud and shoots off to the right.
 */

const TOP = 660; // platform level
const climb = (lf: number): Pose => {
  const k = span(lf, -16, 42);
  const x = 880 + k * 150, y = 1330 - k * (1330 - TOP);
  return { ...walk(lf / 16, pose({ torso: 10, head: -6, mouth: 0.4 })), x, y, s: 0.72, face: 1 };
};

const kneelL = { ...P.kneel, face: -1, mouth: 0.1, lid: 0.3 };
const seal = pose({ uaF: -58, faF: -104, uaB: -44, faB: -110, torso: 2, head: -4, brow: 0.7, mouth: 0, lid: 0.2, face: -1 });
const surf = pose({ lean: 12, torso: 16, head: -14, thF: -40, shF: 50, fF: -10, thB: 36, shB: 26, fB: -20, uaF: -100, faF: -10, uaB: 60, faB: -30, mouth: 0.9, brow: 0.4, plant: 0 });

const KEYS: [number, Pose, string?][] = [
  [44, at(kneelL, 1030, TOP, 0.72, -1)],
  [52, at(kneelL, 1030, TOP, 0.72, -1), 'outBack'],
  [60, at({ ...kneelL, torso: 46, head: 34, lid: 1, uaF: -30, faF: -60, uaB: -20, faB: -70 }, 1030, TOP, 0.72, -1), 'inOut'],
  [70, at({ ...kneelL, torso: 46, head: 34, lid: 1, uaF: -30, faF: -60, uaB: -20, faB: -70 }, 1030, TOP, 0.72, -1)],
  [80, at({ ...P.meditate, face: -1 }, 1030, TOP, 0.72, -1), 'inOut'],
  [100, at({ ...P.meditate, face: -1, lid: 1 }, 1030, TOP, 0.72, -1)],
  [108, at(seal, 1030, TOP, 0.72, -1), 'outBack'],
  [114, at({ ...seal, lid: 0, brow: 1 }, 1030, TOP, 0.72, -1)],
  [120, at({ ...P.crouch, staff: 0, twoHand: 0, uaF: 30, faF: -40, uaB: 40, faB: -30 }, 1040, TOP, 0.72, 1), 'inBack'],
  [128, at({ ...P.jump, staff: 0 }, 1120, 520, 0.72, 1), 'outExpo'],
  [134, at(surf, 1170, 470, 0.74, 1), 'outBack'],
  [160, at(surf, 2300, 360, 0.74, 1), 'inCubic'],
];
const heroAt = (lf: number): Pose => (lf < 44 ? (lf < 40 ? climb(lf) : { ...climb(40), ...{ face: 1 - 2 * smooth(span(lf, 40, 44)) } }) : poseTrack(KEYS as Key<Pose>[], lf));
const cloudPos = (lf: number) => { const h = heroAt(lf); return { x: h.x - 20, y: h.y + 14, s: outBack(span(lf, 114, 126)) }; };

const master = () => `<g class="s3-master" transform="translate(760 ${TOP})">
  <ellipse cx="0" cy="4" rx="150" ry="22" fill="#000" opacity=".2"/>
  <path d="M-150 0h300l-20 -34h-260Z" fill="#6b4a2c" stroke="${INK}" stroke-width="3"/>
  <path d="M-120 -34C-140 -60 -150 -90 -120 -110C-60 -130 60 -130 120 -110C150 -90 140 -60 120 -34Z" fill="#e9e3d2" stroke="${INK}" stroke-width="3"/>
  <path d="M-60 -34C-40 -80 40 -80 60 -34" fill="none" stroke="#c9bfa6" stroke-width="4"/>
  <path d="M-60 -108C-70 -170 -40 -220 0 -224C40 -220 70 -170 60 -108Z" fill="#f2ede0" stroke="${INK}" stroke-width="3"/>
  <path d="M-20 -214L0 -150L20 -214" fill="none" stroke="#b3261e" stroke-width="5"/>
  <g class="s3-master-head">
    <path d="M-30 -250C-32 -290 32 -290 30 -250C28 -226 -28 -226 -30 -250Z" fill="#f4dcc0" stroke="${INK}" stroke-width="3"/>
    <path d="M-10 -292C-10 -306 10 -306 10 -292" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <path d="M-26 -246C-30 -200 -10 -160 0 -150C10 -160 30 -200 26 -246C16 -236 -16 -236 -26 -246Z" fill="#fbfbf6" stroke="${INK}" stroke-width="2.5"/>
    <path d="M-26 -262C-18 -266 -10 -266 -4 -262M4 -262C10 -266 18 -266 26 -262" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M-18 -256h8M10 -256h8" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M-32 -268C-48 -262 -52 -246 -44 -236M32 -268C48 -262 52 -246 44 -236" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  </g>
  <g class="s3-whisk"><path d="M40 -150L90 -230" stroke="#6b4a2c" stroke-width="6"/>
    <path d="M90 -230C120 -250 150 -240 170 -220C140 -228 120 -222 100 -206C130 -210 150 -196 160 -180C130 -196 110 -196 92 -222Z" fill="#fbfbf6" stroke="${INK}" stroke-width="2"/></g>
  <path d="M-58 -150C-80 -130 -70 -110 -40 -110M58 -150C80 -130 70 -110 40 -110" fill="#f2ede0" stroke="${INK}" stroke-width="3"/>
</g>`;

const gateAndCliff = () => `
  <path d="M300 ${TOP}C280 400 360 180 560 120C760 60 1180 70 1380 150C1560 230 1640 420 1620 ${TOP}Z" fill="#5f7466" stroke="#3b4a40" stroke-width="4"/>
  <path d="M1380 150C1560 230 1640 420 1620 ${TOP}H1400C1440 480 1420 300 1380 150Z" fill="#46594c"/>
  <path d="M560 120C700 80 900 70 1060 84C900 110 760 150 640 230C560 290 470 330 400 420C380 300 440 170 560 120Z" fill="#8aa08e" opacity=".55"/>
  <path d="M420 300C520 280 600 330 700 300M380 440C500 410 620 470 760 430M460 560C560 540 640 580 780 560M1440 330C1520 360 1560 420 1600 470M1300 250C1380 270 1440 320 1470 380M860 180C960 160 1080 170 1180 200" fill="none" stroke="#3b4a40" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  <path d="M700 300C690 340 700 380 720 400M1000 176C990 230 1000 280 1030 300M1250 230C1250 280 1270 320 1300 340" fill="none" stroke="#3b4a40" stroke-width="4" opacity=".5"/>
  ${Array.from({ length: 14 }, (_, i) => { const x = 420 + i * 86, y = 140 + Math.abs(Math.sin(i * 1.3)) * 120 + (i % 3) * 30; return `<ellipse cx="${x}" cy="${y}" rx="${30 + (i % 4) * 12}" ry="12" fill="#6f8f5c" opacity=".8"/>`; }).join('')}
  ${Array.from({ length: 9 }, (_, i) => { const x = 460 + i * 130; return `<path d="M${x} ${150 + (i % 3) * 40}q${6 - i % 2 * 12} 60 ${-4} ${120 + (i % 4) * 30}" fill="none" stroke="#4d7a44" stroke-width="4"/>`; }).join('')}
  <path d="M1080 ${TOP}C1080 520 1140 460 1210 460C1280 460 1340 520 1340 ${TOP}Z" fill="#1a211c"/>
  <g transform="translate(1210 ${TOP})">
    <rect x="-150" y="-300" width="30" height="300" fill="#8d8a7a" stroke="${INK}" stroke-width="3"/>
    <rect x="120" y="-300" width="30" height="300" fill="#8d8a7a" stroke="${INK}" stroke-width="3"/>
    <rect x="-176" y="-316" width="352" height="26" fill="#9c9888" stroke="${INK}" stroke-width="3"/>
    <path d="M-210 -310Q-190 -330 -160 -350H160Q190 -330 210 -310L200 -300H-200Z" fill="#3e5a4a" stroke="${INK}" stroke-width="3"/>
    <path d="M-160 -350Q0 -372 160 -350" fill="none" stroke="${INK}" stroke-width="3"/>
    <rect x="-118" y="-286" width="236" height="56" rx="4" fill="#233a30" stroke="#c9a85a" stroke-width="4"/>
    <text class="brush" x="0" y="-246" text-anchor="middle" font-size="38" fill="#e8cf86" letter-spacing="4">斜月三星洞</text>
  </g>`;

const bamboo = (x: number, h: number, seed: number, dark = '#2c5a3a', light = '#5c9a64') => {
  const lean = (rand(seed) - 0.5) * 60;
  let leaves = '';
  for (let i = 0; i < 7; i++) {
    const yy = -h * (0.35 + i * 0.09), side = i % 2 ? 1 : -1, xx = lean * (yy / -h);
    leaves += `<path d="M${xx} ${yy}q${side * 40} -10 ${side * 90} 6q${-side * 50} 4 ${-side * 90} -6Z" fill="${i % 3 ? dark : light}"/>`;
  }
  return `<g transform="translate(${x} 0)"><path d="M0 0L${lean} ${-h}" stroke="${dark}" stroke-width="14"/>
    ${Array.from({ length: 6 }, (_, i) => `<path d="M${lean * (i / 6) - 8} ${-h * (i / 6)}h16" stroke="${light}" stroke-width="3"/>`).join('')}${leaves}</g>`;
};

const scene: SceneDef = {
  id: 3,
  bg: '#cfe0d6',
  markup: () => [
    plane(0, `${sky('s3-sky', [[0, '#8fb7b0'], [0.5, '#d6e6dc'], [1, '#f4efdc']])}${orb(1500, 250, 70, '#fffbe8', 'url(#k-glow-white)')}`),
    plane(0.2, `${ridge(-300, 2300, 620, 360, 13, '#a9c4bb')}${karst(200, 640, 260, 520, '#9ebab0', '#86a69a', 3)}${karst(1700, 640, 300, 560, '#9ebab0', '#86a69a', 4)}${haze('#e4eee6', 0.35)}`),
    plane(0.45, `${ridge(-400, 2400, 760, 300, 23, '#7fa294')}${pine(180, 620, 0.9, '#2f5a48')}${pine(1720, 600, 1, '#2f5a48', '#3b2a1d', true)}
      <g class="s3-mist1">${cloud(-200, 760, 900, 120, 5, 'url(#k-cloud-day)', '', 'rgba(255,255,255,.6)')}${cloud(1100, 780, 1100, 120, 7, 'url(#k-cloud-day)', '', 'rgba(255,255,255,.6)')}</g>${haze('#e4eee6', 0.2)}`),
    plane(0.8, `<g>${bamboo(120, 700, 3)}${bamboo(220, 620, 5)}${bamboo(1780, 680, 7)}${bamboo(1860, 600, 9)}</g>`),
    plane(1, `${gateAndCliff()}
      <path d="M180 ${TOP}H1700V${TOP + 40}H180Z" fill="#b8b6a4" stroke="#7d7a6a" stroke-width="3"/>
      <path d="${Array.from({ length: 16 }, (_, i) => `M${260 + i * 90} ${TOP}v40`).join('')}" stroke="#8f8c7c" stroke-width="2"/>
      ${stairs(760, 1100, 1500, 880, 1000, TOP + 40, 22, '#c9c7b5', '#8f8c7c')}
      ${pine(560, TOP, 1.5, '#23503e')}
      ${master()}
      <g class="s3-scroll" opacity="0" transform="translate(900 380)">
        <rect x="-150" y="-70" width="300" height="140" rx="6" fill="#efe2bc" stroke="${INK}" stroke-width="3"/>
        ${Array.from({ length: 9 }, (_, i) => `<path d="M${-130 + i * 32} -60v120" stroke="#cbb88a" stroke-width="2"/>`).join('')}
        <rect x="-166" y="-78" width="16" height="156" rx="6" fill="#7a5a34"/><rect x="150" y="-78" width="16" height="156" rx="6" fill="#7a5a34"/>
        <text class="brush" x="0" y="34" text-anchor="middle" font-size="96" fill="#8a2a1c">道</text>
      </g>
      <g class="s3-cloud" opacity="0">${cloud(-120, 30, 260, 70, 42, 'url(#k-cloud-gold)', '', '#fff6d0')}<ellipse cx="10" cy="20" rx="160" ry="40" fill="url(#k-glow-warm)" opacity=".7"/></g>
      ${heroMarkup('wukong', 'pilgrim')}`),
    plane(1.6, `<g class="s3-fg">${bamboo(-60, 1300, 11, '#1b3a26', '#355e3e')}${bamboo(40, 1200, 13, '#1b3a26', '#355e3e')}${bamboo(2000, 1250, 15, '#1b3a26', '#355e3e')}</g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const x = track([[-20, 930], [40, 960], [60, 930], [100, 900, 'inOut'], [118, 960], [134, 1200, 'inCubic'], [160, 1900, 'linear']], lf);
    const y = track([[-20, 1200], [44, 560, 'inOut'], [100, 540], [118, 560], [140, 470]], lf);
    const zoom = track([[-20, 1.15], [44, 1.0, 'inOut'], [96, 1.32, 'inOut'], [118, 1.18, 'inOut'], [134, 1.26, 'outExpo'], [160, 1.2]], lf);
    return { x: x + noise(lf * 0.03, 5) * 8, y: y + noise(lf * 0.03, 9) * 5, zoom };
  },
  heroes: (t) => [{ name: 'wukong', costume: 'pilgrim', pose: { ...heroAt(t.lf), glow: 0 } }],
  update: (d, t) => {
    const lf = t.lf;
    d.tf('.s3-mist1', `translate(${Math.sin(lf * 0.02) * 60} 0)`);
    d.tf('.s3-master-head', `rotate(${(Math.sin(lf * 0.05) * 2 + smooth(span(lf, 54, 62)) * 6 - smooth(span(lf, 66, 74)) * 6).toFixed(2)} 0 -230)`);
    d.tf('.s3-whisk', `rotate(${(Math.sin(lf * 0.12) * 4 - smooth(span(lf, 72, 84)) * 30 + smooth(span(lf, 98, 108)) * 30).toFixed(2)} 40 -150)`);
    const sc = smooth(span(lf, 74, 84)) * (1 - smooth(span(lf, 100, 108)));
    d.op('.s3-scroll', sc);
    d.tf('.s3-scroll', `translate(900 ${(400 - sc * 30).toFixed(1)}) scale(${(0.6 + sc * 0.4).toFixed(3)} ${(0.3 + sc * 0.7).toFixed(3)})`);
    const c = cloudPos(lf);
    d.op('.s3-cloud', clamp(c.s * 1.2));
    d.tf('.s3-cloud', `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) scale(${Math.max(0.01, c.s).toFixed(3)})`);
    d.tf('.s3-fg', `translate(${Math.sin(lf * 0.03) * 12} 0)`);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    // falling bamboo leaves that freeze in mid-air while he meditates (静叶)
    view.apply(ctx, 1);
    const freeze = smooth(span(lf, 84, 90)) * (1 - smooth(span(lf, 100, 104)));
    const eff = lf < 84 ? lf : lf < 104 ? 84 + (lf - 84) * (1 - freeze) : lf - 20 * 0.9;
    for (let i = 0; i < 34; i++) {
      const x0 = 600 + rand(i) * 900, fall = (rand(i + 7) * 700 + eff * (2 + rand(i + 3) * 2)) % 700;
      const x = x0 + Math.sin(eff * 0.06 + i) * 40, y = 240 + fall;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(eff * 0.05 + i);
      ctx.fillStyle = freeze > 0.5 ? `rgba(255,226,140,${(0.6 + freeze * 0.4).toFixed(2)})` : 'rgba(92,154,100,.85)';
      if (freeze > 0.2) { ctx.shadowColor = '#ffd66b'; ctx.shadowBlur = 14 * freeze; }
      ctx.beginPath(); ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    const glow = smooth(span(lf, 74, 86)) * (1 - smooth(span(lf, 108, 116)));
    if (glow > 0.01) {
      const [sx, sy] = view.toScreen(1030, TOP - 120);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const g = ctx.createRadialGradient(sx, sy, 10, sx, sy, 420);
      g.addColorStop(0, `rgba(255,236,170,${(0.55 * glow).toFixed(2)})`);
      g.addColorStop(1, 'rgba(255,236,170,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    }
    motes(ctx, view, lf, 30, 'rgba(255,245,210,A)', 3, 0.9, [0.3, -0.2], 2.2);
    streaks(ctx, smooth(span(lf, 130, 142)) * 0.9, lf, 0, '255,244,210');
  },
};

export default scene;
