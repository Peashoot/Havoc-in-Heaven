import { clamp, noise, outExpo, rand, smooth, span, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, type Pose } from '../rig/hero.ts';
import { P } from '../rig/poses.ts';
import { INK } from './kit.ts';
import { sparks, streaks, whiteFrame } from './fxkit.ts';
import { DOOR, furnace } from './s16.ts';

/**
 * 18 火眼金睛 — extreme close-up of the face in the violet firelight, eyes shut. They open:
 * the pupils have turned to molten gold and light pours out of them. Golden cracks race
 * outward across the frame. Whip pan outside: the furnace in the dark hall, light leaking
 * from spreading cracks, and on the flagstones the staff trembles and begins to glow.
 */

const FACE = { x: 756, y: 3790, s: 9 };
const OUT = 6000; // the "outside" set is offset along x in the same planes
const OPEN = 34, WHIP = 84;

const heroAt = (lf: number): Pose => {
  const open = smooth(span(lf, OPEN, OPEN + 8));
  return {
    ...P.stand, uaF: -26, faF: -64, uaB: -18, faB: -70, head: 0, torso: 0, lean: 0,
    lid: 1 - open, glow: clamp(span(lf, OPEN + 2, OPEN + 12)), brow: 0.4 + open * 0.6, mouth: -0.2 - open * 0.5,
    x: FACE.x, y: FACE.y + noise(lf * 0.1, 2) * 8, s: FACE.s, face: 1, wind: 0.4,
  };
};

// crack network: branching polylines from a centre, grown by length over time
type Crack = { pts: [number, number][] };
export const cracks = (cx: number, cy: number, n: number, len: number, seed: number): Crack[] => Array.from({ length: n }, (_, i) => {
  let a = (i / n) * Math.PI * 2 + rand(seed + i) * 0.4, x = cx, y = cy;
  const pts: [number, number][] = [[x, y]];
  for (let k = 0; k < 12; k++) { a += (rand(seed + i * 20 + k) - 0.5) * 0.9; const step = len / 12 * (0.6 + rand(seed + i * 30 + k) * 0.8); x += Math.cos(a) * step; y += Math.sin(a) * step; pts.push([x, y]); }
  return { pts };
});
export const drawCracks = (ctx: CanvasRenderingContext2D, list: Crack[], grow: number, width: number, glow: string) => {
  if (grow <= 0) return;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [w, c, blur] of [[width * 3, glow, 30], [width, '#fff8d8', 8]] as const) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.shadowColor = glow; ctx.shadowBlur = blur;
    for (const cr of list) {
      const m = cr.pts.length - 1, upto = grow * m;
      ctx.beginPath(); ctx.moveTo(cr.pts[0][0], cr.pts[0][1]);
      for (let k = 1; k <= Math.ceil(upto); k++) {
        const f = Math.min(1, upto - (k - 1)); const [ax, ay] = cr.pts[k - 1], [bx, by] = cr.pts[k];
        ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
};
const FACE_CRACKS = cracks(968, 420, 9, 1300, 5);
export const FURNACE_CRACKS = cracks(DOOR.x + 60, DOOR.y - 180, 7, 420, 17);
const WALL_CRACKS = FURNACE_CRACKS.map((cr) => ({ pts: cr.pts.map(([x, y]): [number, number] => [x + OUT, y]) }));

const outside = () => `<g transform="translate(${OUT} 0)">
  <rect x="-1400" y="-800" width="4800" height="2400" fill="#0c0806"/>
  <rect x="-1400" y="880" width="4800" height="900" fill="#1a120c"/>
  ${Array.from({ length: 8 }, (_, i) => `<path d="M-1400 ${900 + i * i * 10 + i * 20}H3400" stroke="#2a1c12" stroke-width="3"/>`).join('')}
  ${furnace('s18-f')}
</g>`;

const staff = () => `<g class="s18-staff"><g transform="translate(${OUT + 1500} 990) rotate(-4)">
  <rect class="s18-halo" x="-300" y="-30" width="600" height="60" rx="30" fill="#ffd24a" opacity="0" filter="url(#k-blur16)"/>
  <rect x="-280" y="-11" width="560" height="22" rx="8" fill="#b0281c" stroke="${INK}" stroke-width="4"/>
  <rect x="-280" y="-14" width="64" height="28" rx="6" fill="url(#k-gold)" stroke="${INK}" stroke-width="3"/>
  <rect x="216" y="-14" width="64" height="28" rx="6" fill="url(#k-gold)" stroke="${INK}" stroke-width="3"/>
  <rect class="s18-core" x="-280" y="-5" width="560" height="10" rx="5" fill="#fff4c0" opacity="0"/></g></g>`;

const scene: SceneDef = {
  id: 18,
  bg: '#12060e',
  markup: () => [
    plane(0.4, `<rect x="-3000" y="-3000" width="16000" height="8000" fill="#12060e"/>
      <ellipse class="s18-fire" cx="960" cy="900" rx="1400" ry="500" fill="#a060ff" opacity=".45" filter="url(#k-blur40)"/>`),
    plane(1, `${outside()}${heroMarkup('wukong', 'furnace')}${staff()}
      <rect class="s18-violet" x="-2000" y="-2000" width="5000" height="5000" fill="#6a2a9a" opacity=".22" style="mix-blend-mode:multiply"/>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const x = track([[-16, 960], [WHIP, 960], [WHIP + 8, OUT + 960, 'outExpo'], [106, OUT + 980]], lf);
    const zoom = track([[-16, 1.12], [OPEN, 1.0, 'inOut'], [OPEN + 6, 1.08, 'outExpo'], [WHIP, 1.16, 'inOut'], [WHIP + 8, 0.9, 'outExpo'], [106, 1.02, 'inOut']], lf);
    const y = track([[-16, 520], [WHIP, 520], [WHIP + 8, 640, 'outExpo'], [106, 700, 'inOut']], lf);
    return { x: x + noise(lf * 0.06, 1) * 6, y: y + noise(lf * 0.06, 3) * 5, zoom };
  },
  shake: (t) => { const k = t.lf - OPEN - 4, j = t.lf - WHIP - 20; return [k >= 0 && k < 10 ? Math.sin(k * 3) * 10 * (1 - k / 10) : j > 0 ? noise(t.lf, 3) * Math.min(6, j * 0.3) * (1 - smooth(span(t.lf, 106, 114))) : 0, k >= 0 && k < 10 ? Math.cos(k * 4) * 8 * (1 - k / 10) : 0]; },
  heroes: (t) => [{ name: 'wukong', costume: 'furnace', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    d.op('.s18-fire', 0.35 + noise(lf * 0.25, 4) * 0.15);
    d.op('.s18-violet', 0.22 * (1 - smooth(span(lf, OPEN, OPEN + 10))));
    // outside: the door seam burns, the staff trembles and ignites
    d.op('.s18-f-seam', 0.5 + noise(lf * 0.3, 8) * 0.3);
    d.op('.s18-f-under', 0.2);
    const wake = smooth(span(lf, WHIP + 10, 118));
    d.op('.s18-halo', wake * (0.6 + Math.sin(lf * 0.6) * 0.2));
    d.op('.s18-core', wake * 0.9);
    d.tf('.s18-staff', `translate(${(noise(lf * 1.3, 1) * 8 * wake).toFixed(1)} ${(-Math.abs(noise(lf * 1.1, 2)) * 14 * wake).toFixed(1)})`);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    // golden light pouring from the eyes
    const burst = smooth(span(lf, OPEN + 2, OPEN + 10));
    if (burst > 0 && lf < WHIP + 4) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const [ex, ey, er] of [[815, 420, 0.8], [1120, 418, 1]] as const) {
        const [sx, sy] = view.toScreen(ex, ey);
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 520 * er);
        g.addColorStop(0, `rgba(255,236,150,${(0.9 * burst).toFixed(3)})`); g.addColorStop(0.25, `rgba(255,190,60,${(0.4 * burst).toFixed(3)})`); g.addColorStop(1, 'rgba(255,120,20,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2 + lf * 0.01, L = (500 + rand(i) * 700) * burst;
          ctx.strokeStyle = `rgba(255,220,120,${(0.25 * burst).toFixed(3)})`; ctx.lineWidth = 6 + rand(i + 4) * 14;
          ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a) * L, sy + Math.sin(a) * L); ctx.stroke();
        }
      }
      ctx.restore();
    }
    if (lf === OPEN + 6) whiteFrame(ctx, 0.5, '#fff0c0');
    // cracks racing across the frame in front of the face
    view.apply(ctx, 1);
    if (lf < WHIP + 4) drawCracks(ctx, FACE_CRACKS, outExpo(span(lf, OPEN + 14, WHIP - 4)), 6, '#ffb030');
    // outside: cracks spreading on the furnace wall
    drawCracks(ctx, WALL_CRACKS, smooth(span(lf, WHIP + 4, 120)), 5, '#ffa030');
    sparks(ctx, view, OUT + 960, 1000, lf - 104, 40, 10, 27, 1, '255,220,120');
    const whip = Math.max(0, 1 - Math.abs(lf - WHIP - 3) / 6);
    if (whip > 0) streaks(ctx, whip, lf, 0, '255,200,120');
  },
};

export default scene;
