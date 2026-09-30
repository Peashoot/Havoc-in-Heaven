import { clamp, noise, outBack, outExpo, rand, shake, smooth, span, track, type Key } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { headPoint, heroMarkup, type Pose } from '../rig/hero.ts';
import { at, P, poseTrack } from '../rig/poses.ts';
import { cloudSea } from './kit.ts';
import { staffSmear, whiteFrame } from './fxkit.ts';

/**
 * 22 大闹天宫 — the last swing. Wukong, huge against a heaven streaked with every colour he
 * has struck into it, winds up and swings; all the colours burst out of the staff at once
 * and then collapse inward to one golden point. Black. The title 大闹天宫 rises out of the
 * point in brushed gold, a red seal is stamped beside it, and a last spark drifts up and dies.
 */

const SWING = 30, COLLAPSE = 58, POINT = 84, TITLE = 100, SEAL = 132;
const COLORS = ['#ff3a2a', '#ffc21a', '#2ae0e0', '#3a7aff', '#b04aff', '#3ae07a'];
const CORE = { x: 1180, y: 430 };

const KEYS: Key<Pose>[] = [
  [-12, at({ ...P.heroic, staffA: -90, head: -8, mouth: -0.5, brow: 1 }, 820, 1000, 1.25)],
  [8, at({ ...P.heroic, staffA: -92, head: -10, mouth: -0.5, brow: 1 }, 820, 1000, 1.25), 'inOut'],
  [SWING - 6, at({ ...P.windup, lean: -10 }, 790, 1000, 1.25), 'inBack'],
  [SWING, at({ ...P.strike, staffA: -40, uaF: -130 }, 860, 990, 1.25), 'outExpo'],
  [SWING + 12, at({ ...P.follow, staffA: -20, uaF: -120 }, 880, 1000, 1.25), 'outBack'],
  [200, at({ ...P.follow, staffA: -22, uaF: -118 }, 880, 1000, 1.25), 'inOut'],
];
const heroAt = (lf: number): Pose => ({ ...poseTrack(KEYS, lf), staffGlow: 1, glow: 1, wind: 1 });
const eye = headPoint(heroAt(0));

const scene: SceneDef = {
  id: 22,
  bg: '#000000',
  markup: () => [
    plane(0, `<g class="s22-world"><rect x="-100" y="-100" width="2120" height="1280" fill="#1a1030"/>
      ${COLORS.map((c, k) => `<rect x="-100" y="${-120 + k * 180}" width="2120" height="360" fill="${c}" opacity=".55" filter="url(#k-blur40)"/>`).join('')}</g>`),
    plane(0.5, `<g class="s22-world">${cloudSea(-1000, 3000, 900, 160, 9, 'url(#k-cloud-gold)', '', '#fff6d0')}</g>`),
    plane(1, `<g class="s22-world">${heroMarkup('wukong', 'sage')}</g>`),
    plane(0, `<g class="s22-title" opacity="0">
      <defs><linearGradient id="s22-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".45" stop-color="#f2c23a"/><stop offset=".55" stop-color="#d89a1a"/><stop offset="1" stop-color="#8a5a10"/></linearGradient>
        <clipPath id="s22-wipe"><rect class="s22-wiperect" x="360" y="200" width="0" height="600"/></clipPath></defs>
      <text class="brush" x="960" y="610" text-anchor="middle" font-size="260" fill="#3a2008" opacity=".6" transform="translate(6 8)" letter-spacing="30">大闹天宫</text>
      <g clip-path="url(#s22-wipe)"><text class="brush" x="960" y="610" text-anchor="middle" font-size="260" fill="url(#s22-gold)" stroke="#5a3a08" stroke-width="3" letter-spacing="30">大闹天宫</text></g>
      <g class="s22-seal" opacity="0"><g transform="translate(1560 700) rotate(-4) scale(1.3)"><rect x="-64" y="-64" width="128" height="128" rx="10" fill="#c0281c"/>
        <rect x="-54" y="-54" width="108" height="108" rx="6" fill="none" stroke="#f6e6c8" stroke-width="5"/>
        <text class="brush" x="-22" y="-8" text-anchor="middle" font-size="48" fill="#f6e6c8">齐</text><text class="brush" x="24" y="-8" text-anchor="middle" font-size="48" fill="#f6e6c8">天</text>
        <text class="brush" x="-22" y="44" text-anchor="middle" font-size="48" fill="#f6e6c8">大</text><text class="brush" x="24" y="44" text-anchor="middle" font-size="48" fill="#f6e6c8">圣</text></g></g>
      <path class="s22-rule" d="M620 700H1300" stroke="url(#s22-gold)" stroke-width="4" opacity="0"/>
    </g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    // Continue the preceding eye close-up, then pull back for the final wind-up.
    const zoom = track([[-16, 5.4], [0, 5.4], [SWING - 6, 1.02, 'inOut'], [SWING, 0.9, 'outExpo'], [COLLAPSE, 1.1, 'inOut']], lf);
    const x = track([[-16, eye[0]], [0, eye[0]], [SWING - 6, 960, 'inOut']], lf);
    const y = track([[-16, eye[1]], [0, eye[1]], [SWING - 6, 560, 'inOut']], lf);
    return { x: x + noise(lf * 0.05, 1) * 4, y: y + noise(lf * 0.05, 2) * 4, zoom };
  },
  shake: (t) => shake(t.lf, SWING, 36, 12),
  heroes: (t) => [{ name: 'wukong', costume: 'sage', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    d.all('.s22-world').forEach((g) => g.setAttribute('opacity', (1 - smooth(span(lf, COLLAPSE, POINT - 6))).toFixed(3)));
    d.op('.s22-title', smooth(span(lf, TITLE - 6, TITLE + 10)));
    d.attr('.s22-wiperect', 'width', (1200 * smooth(span(lf, TITLE, TITLE + 30))).toFixed(1));
    const stamp = outBack(span(lf, SEAL, SEAL + 8));
    d.op('.s22-seal', clamp(span(lf, SEAL, SEAL + 3)));
    d.tf('.s22-seal', `translate(1560 700) scale(${(1.6 - stamp * 0.6).toFixed(3)}) translate(-1560 -700)`);
    d.op('.s22-rule', smooth(span(lf, TITLE + 24, TITLE + 44)) * 0.8);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf, since = lf - SWING;
    staffSmear(ctx, view, heroAt, lf, 5);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const core = view.toScreen(CORE.x, CORE.y);
    // burst: every colour flung out, then collapsing to one golden point
    if (since >= 0 && lf < POINT + 10) {
      const out = outExpo(span(since, 0, 14));
      const inn = smooth(span(lf, COLLAPSE - 8, POINT));
      const R = 2600 * out * (1 - inn) + 6;
      const cx = core[0] + (960 - core[0]) * inn, cy = core[1] + (540 - core[1]) * inn;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const hot = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160 + R * 0.08);
      hot.addColorStop(0, 'rgba(255,250,230,.9)'); hot.addColorStop(1, 'rgba(255,220,140,0)');
      ctx.fillStyle = hot; ctx.fillRect(0, 0, 1920, 1080);
      ctx.globalCompositeOperation = 'source-over';
      COLORS.forEach((c, k) => {
        const r = R * (0.25 + k * 0.13);
        ctx.strokeStyle = c + 'aa'; ctx.lineWidth = 40 + R * 0.03;
        ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.8, 0, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2 + since * 0.01, L = R * (0.7 + rand(i) * 0.5);
        ctx.strokeStyle = COLORS[i % COLORS.length] + '66'; ctx.lineWidth = 4 + rand(i + 3) * 10;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * L, cy + Math.sin(a) * L); ctx.stroke();
      }
      ctx.restore();
    }
    if (since === 0 || since === 1) whiteFrame(ctx, 1);
    // the golden point in the black
    const pt = smooth(span(lf, COLLAPSE, POINT)) * (1 - smooth(span(lf, TITLE, TITLE + 20)) * 0.7);
    if (pt > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const r = 40 + Math.sin(lf * 0.3) * 6;
      const g = ctx.createRadialGradient(960, 540, 0, 960, 540, r * 3);
      g.addColorStop(0, `rgba(255,250,220,${pt.toFixed(3)})`); g.addColorStop(0.2, `rgba(255,210,90,${(pt * 0.8).toFixed(3)})`); g.addColorStop(1, 'rgba(255,160,40,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
      ctx.strokeStyle = `rgba(255,230,160,${(pt * 0.6).toFixed(3)})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(960 - r * 5, 540); ctx.lineTo(960 + r * 5, 540); ctx.moveTo(960, 540 - r * 2); ctx.lineTo(960, 540 + r * 2); ctx.stroke();
      ctx.restore();
    }
    // title glint sweeping across the gold
    const sweep = span(lf, TITLE + 34, TITLE + 58);
    if (sweep > 0 && sweep < 1) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const x = 360 + sweep * 1200;
      const g = ctx.createLinearGradient(x - 120, 0, x + 120, 0);
      g.addColorStop(0, 'rgba(255,255,230,0)'); g.addColorStop(0.5, 'rgba(255,255,230,.35)'); g.addColorStop(1, 'rgba(255,255,230,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 120, 360, 240, 300);
      ctx.restore();
    }
    // the last spark: rises from the seal and dies
    const sp = span(lf, SEAL + 20, 205);
    if (sp > 0 && sp < 1) {
      const x = 1560 + Math.sin(sp * 9) * 30 + noise(lf * 0.1, 3) * 10, y = 620 - sp * 360;
      const a = Math.sin(sp * Math.PI) * (1 - sp * 0.5);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(x, y, 0, x, y, 26);
      g.addColorStop(0, `rgba(255,236,170,${a.toFixed(3)})`); g.addColorStop(1, 'rgba(255,160,40,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 30, y - 30, 60, 60);
      ctx.restore();
    }
  },
};

export default scene;
