import { clamp, noise, outBack, rand, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { at, P, pose, poseTrack, walk } from '../rig/poses.ts';
import { cloud, cloudSea, haze, heavenGate, INK, orb, rays, sky, stairs, wisps } from './kit.ts';
import { motes } from './fxkit.ts';

/**
 * 05 天庭诏安 — out of the flash, 太白金星 descends on a cloud and unrolls a golden imperial
 * decree over Wukong; the old immortal drifts away and the towering 南天门 is revealed;
 * Wukong, in his new official robe, climbs the white jade stairs, tiny against the gate.
 */

const taibai = () => `<g class="s5-taibai">
  <g class="s5-tb-cloud">${cloud(-190, 40, 380, 90, 17, 'url(#k-cloud-gold)', '', '#fff6d0')}</g>
  <path d="M-60 20C-70 -60 -60 -150 -30 -200H30C60 -150 70 -60 60 20Z" fill="#eef2f8" stroke="${INK}" stroke-width="3"/><path d="M14 -196C40 -150 50 -60 60 20H24C26 -60 22 -150 14 -196Z" fill="#c9d4e6"/><path d="M-58 -80C-20 -70 20 -70 58 -80" fill="none" stroke="#c0392b" stroke-width="9"/>
  <path d="M-62 20C-40 0 40 0 62 20" fill="none" stroke="#c9bfa6" stroke-width="4"/>
  <path d="M-30 -200L0 -120L30 -200" fill="none" stroke="#b3261e" stroke-width="6"/>
  <path d="M-34 -196C-70 -180 -96 -140 -90 -100L-54 -110C-56 -140 -46 -170 -30 -180Z" fill="#6f8fc8" stroke="${INK}" stroke-width="3"/><path d="M34 -196C66 -170 76 -140 70 -110L40 -116C44 -140 40 -166 26 -180Z" fill="#6f8fc8" stroke="${INK}" stroke-width="3"/>
  <path d="M-32 -250C-34 -290 34 -290 32 -250C30 -226 -30 -226 -32 -250Z" fill="#f4dcc0" stroke="${INK}" stroke-width="3"/>
  <path d="M-28 -246C-34 -196 -12 -150 0 -140C12 -150 34 -196 28 -246C16 -236 -16 -236 -28 -246Z" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
  <path d="M-20 -258h9M11 -258h9" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  <path d="M-30 -270C-20 -276 -8 -276 0 -270C8 -276 20 -276 30 -270" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  <path d="M-18 -286C-16 -312 16 -312 18 -286Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
  <path d="M66 -120L120 -200" stroke="#6b4a2c" stroke-width="6"/>
  <path d="M120 -200C150 -220 180 -210 200 -190C170 -198 150 -192 130 -176C160 -180 180 -166 190 -150C160 -166 140 -166 122 -192Z" fill="#fff" stroke="${INK}" stroke-width="2"/>
</g>`;

const W = 760; // unrolled decree width
const decree = () => `<g class="s5-decree">
  <defs><clipPath id="s5-clip"><rect class="s5-cliprect" x="${-W / 2}" y="-160" width="0" height="320"/></clipPath>
    <linearGradient id="s5-silk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b8"/><stop offset=".5" stop-color="#f3cf62"/><stop offset="1" stop-color="#d8a434"/></linearGradient></defs>
  <ellipse cx="0" cy="0" rx="560" ry="260" fill="url(#k-glow-warm)" class="s5-decree-glow" opacity="0"/>
  <g clip-path="url(#s5-clip)">
    <rect x="${-W / 2}" y="-130" width="${W}" height="260" fill="url(#s5-silk)" stroke="${INK}" stroke-width="3"/>
    <rect x="${-W / 2 + 20}" y="-112" width="${W - 40}" height="224" fill="none" stroke="#b3261e" stroke-width="5"/>
    <path d="${Array.from({ length: 16 }, (_, i) => `M${W / 2 - 70 - i * 40} -90v${120 + (i % 3) * 30}`).join('')}" stroke="#4a2a14" stroke-width="7" stroke-dasharray="14 8" stroke-linecap="round"/>
    <text class="brush" x="${W / 2 - 60}" y="-50" font-size="46" fill="#8a1a10" writing-mode="tb" letter-spacing="6">奉天承运</text>
    <rect x="${-W / 2 + 60}" y="30" width="70" height="70" fill="none" stroke="#c0281e" stroke-width="6"/>
    <rect x="${-W / 2 + 72}" y="42" width="46" height="46" fill="#c0281e"/>
  </g>
  <g class="s5-rollL"><rect x="${-W / 2 - 26}" y="-150" width="26" height="300" rx="10" fill="#7a3a1a" stroke="${INK}" stroke-width="3"/><circle cx="${-W / 2 - 13}" cy="-156" r="12" fill="url(#k-gold)"/><circle cx="${-W / 2 - 13}" cy="156" r="12" fill="url(#k-gold)"/></g>
  <g class="s5-rollR"><rect x="${-W / 2}" y="-150" width="26" height="300" rx="10" fill="#7a3a1a" stroke="${INK}" stroke-width="3"/><circle cx="${-W / 2 + 13}" cy="-156" r="12" fill="url(#k-gold)"/><circle cx="${-W / 2 + 13}" cy="156" r="12" fill="url(#k-gold)"/></g>
</g>`;

const TB = (lf: number) => ({
  x: track([[-12, 200], [30, 520, 'outBack'], [80, 520], [106, 60, 'inCubic']], lf),
  y: track([[-12, -160], [30, 600, 'outBack'], [80, 590], [106, 80, 'inCubic']], lf),
  op: 1 - smooth(span(lf, 92, 108)),
});
const unroll = (lf: number) => outBack(span(lf, 36, 60));

const STAIR_TOP = 700, STAIR_BOT = 1060;
const stairPos = (k: number) => ({ x: 960, y: STAIR_BOT - (STAIR_BOT - STAIR_TOP) * k, s: 0.8 - k * 0.42 });
const hero = (lf: number): Pose => {
  if (lf < 84) {
    const look = pose({ ...P.handShade, head: -26, mouth: 0.8 });
    const p = poseTrack([[0, look], [40, look], [48, { ...P.bow, torso: 22, head: 8, lid: 0.3 }, 'outBack'], [68, { ...P.bow, torso: 22, head: 8, lid: 0.3 }], [80, { ...P.stand, head: -14, mouth: 0.8 }]] as Key<Pose>[], lf);
    return { ...p, x: 1320, y: 960, s: 0.74, face: -1 };
  }
  if (lf < 108) {
    const k = smooth(span(lf, 84, 108));
    return { ...walk((lf - 84) / 16, pose({ torso: 6, head: -8, mouth: 0.6 })), x: 1320 - k * 360, y: 960 + k * 100, s: 0.74 + k * 0.06, face: -1 };
  }
  const k = span(lf, 108, 175);
  const sp = stairPos(k);
  return { ...walk((lf - 108) / 18, pose({ torso: 8, head: -12, mouth: 0.5 })), x: sp.x, y: sp.y, s: sp.s, face: -1 };
};

const scene: SceneDef = {
  id: 5,
  bg: '#a9bfdc',
  markup: () => [
    plane(0, `${sky('s5-sky', [[0, '#3f66a8'], [0.5, '#a3bfe4'], [1, '#f8e2b0']])}
      ${rays(960, 260, 1400, 22, '#fff4d0', 0.14, 9, 's5-rays')}${orb(960, 240, 60, '#fffbe8', 'url(#k-glow-white)')}`),
    plane(0.25, `${cloudSea(-400, 2320, 640, 70, 5, 'url(#k-cloud-day)', '', 'rgba(255,255,255,.7)')}${wisps(-100, 300, 800, 3, 5, '#ffffff', 0.4)}${wisps(1200, 260, 700, 3, 8, '#ffffff', 0.35)}${haze('#dfe7f2', 0.08)}`),
    plane(0.55, `<g class="s5-gate">
      <ellipse cx="960" cy="560" rx="700" ry="380" fill="url(#k-glow-warm)" opacity=".4" class="s5-gate-glow"/>
      ${heavenGate(960, STAIR_TOP - 10, 640, { cold: true })}
      ${cloud(300, STAIR_TOP + 10, 500, 90, 21, 'url(#k-cloud-day)')}${cloud(1200, STAIR_TOP + 20, 540, 90, 23, 'url(#k-cloud-day)')}
      ${haze('#e8eef6', 0.12)}</g>`),
    plane(1, `${stairs(560, 1360, STAIR_BOT + 200, 840, 1080, STAIR_TOP, 20, 'url(#k-jade)', '#a9b8c0')}
      ${cloudSea(-600, 2520, STAIR_BOT - 60, 120, 31, 'url(#k-cloud-day)', '', 'rgba(255,255,255,.9)')}
      ${heroMarkup('wukong', 'bima')}`),
    plane(1.15, `<g class="s5-tbwrap">${taibai()}</g><g class="s5-decwrap">${decree()}</g>`),
    plane(1.7, `<g class="s5-fg">${cloud(-500, 1180, 1100, 300, 41, 'url(#k-cloud-day)')}${cloud(1450, 1160, 1000, 280, 43, 'url(#k-cloud-day)')}</g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const x = track([[-12, 900], [30, 960], [60, 980], [100, 960, 'inOut'], [160, 960]], lf);
    const y = track([[-12, 420], [30, 560], [60, 480], [100, 600, 'inOut'], [160, 560]], lf);
    const zoom = track([[-12, 1.05], [30, 1.0], [58, 1.16, 'inOut'], [100, 0.92, 'inOut'], [160, 1.12]], lf);
    return { x: x + noise(lf * 0.03, 3) * 6, y: y + noise(lf * 0.03, 5) * 4, zoom };
  },
  heroes: (t) => [{ name: 'wukong', costume: 'bima', pose: hero(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const tb = TB(lf);
    const bob = Math.sin(lf * 0.1) * 8;
    d.tf('.s5-tbwrap', `translate(${tb.x.toFixed(1)} ${(tb.y + bob).toFixed(1)})`);
    d.op('.s5-tbwrap', tb.op);
    const u = unroll(lf);
    const dx = tb.x + 470, dy = tb.y - 230 + bob;
    d.tf('.s5-decwrap', `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${(0.9 + u * 0.1).toFixed(3)})`);
    d.op('.s5-decwrap', clamp(smooth(span(lf, 26, 36)) * tb.op * 1.2));
    d.attr('.s5-cliprect', 'width', (Math.max(0, u) * W).toFixed(1));
    d.tf('.s5-rollR', `translate(${(Math.max(0, u) * W).toFixed(1)} 0)`);
    d.op('.s5-decree-glow', smooth(span(lf, 50, 64)) * 0.9);
    const reveal = smooth(span(lf, 80, 110));
    d.op('.s5-gate', 0.25 + reveal * 0.75);
    d.op('.s5-gate-glow', 0.2 + reveal * 0.5);
    d.tf('.s5-rays', `rotate(${(lf * 0.04).toFixed(2)} 960 260)`);
    d.tf('.s5-fg', `translate(${(-lf * 1.5).toFixed(1)} 0)`);
  },
  fx: (ctx, t, view) => {
    motes(ctx, view, t.lf, 50, 'rgba(255,236,170,A)', 11, 0.9, [0.4, -0.5], 2.5);
    // light flare when the decree fully opens
    const f = smooth(span(t.lf, 54, 60)) * (1 - smooth(span(t.lf, 60, 80)));
    if (f > 0.01) {
      const tb = TB(t.lf);
      const [sx, sy] = view.toScreen(tb.x + 470, tb.y - 230, 1.15);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const g = ctx.createRadialGradient(sx, sy, 10, sx, sy, 900);
      g.addColorStop(0, `rgba(255,246,210,${(0.85 * f).toFixed(2)})`);
      g.addColorStop(1, 'rgba(255,246,210,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    }
    void rand;
  },
};

export default scene;
