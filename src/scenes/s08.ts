import { inCubic, noise, outBack, rand, smooth, span, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, solve, type Pose } from '../rig/hero.ts';
import { P } from '../rig/poses.ts';
import { cup, gourd, INK, peach, wineJar } from './kit.ts';
import { motes, streaks } from './fxkit.ts';

/**
 * 08 笑容消失 — a close-up in the dark warm spill of the banquet: Wukong's grin fades as he
 * understands. The camera whips across the laden table (giant peaches, wine jar, golden
 * cups, elixir gourd) and whips back to a face gone hard. A peach drops into his hand;
 * he bites it, glaring.
 */

const FACE = { x: 900, y: 2230, s: 4.4 };
const TABLE = { x0: 2200, x1: 3900, y: 860 };
const PAN = { out0: 34, out1: 52, back0: 74, back1: 84 };

const faceAt = (lf: number): Pose => {
  const fade = smooth(span(lf, 26, 40));
  const anger = smooth(span(lf, 70, 90));
  const lift = outBack(span(lf, 82, 94));
  const toMouth = smooth(span(lf, 98, 104));
  const chew = lf > 104 ? Math.sin((lf - 104) * 0.9) * 0.12 * (1 - span(lf, 104, 120)) : 0;
  return {
    ...P.stand, staff: 0,
    head: -2 + anger * -6 + toMouth * 6 + chew * 20,
    torso: 2,
    mouth: 0.9 - fade * 0.8 - anger * 0.9 + chew,
    brow: 0.1 + fade * 0.3 + anger * 0.6,
    lid: fade * 0.25 - anger * 0.1,
    look: 0.8 - fade * 0.4 - anger * 0.4,
    uaF: 10 - lift * 50 - toMouth * 16, faF: -10 - lift * 120 - toMouth * 2,
    uaB: 12, faB: -8,
    x: FACE.x, y: FACE.y + noise(lf * 0.05, 7) * 6, s: FACE.s, face: 1,
  };
};

const bokeh = (n: number, seed: number, y0: number, y1: number, rMin: number, rMax: number, colors: string[]) =>
  Array.from({ length: n }, (_, i) => {
    const x = -600 + rand(seed + i) * 5200, y = y0 + rand(seed + i * 3) * (y1 - y0), r = rMin + rand(seed + i * 5) * (rMax - rMin);
    return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${colors[i % colors.length]}" opacity="${(0.25 + rand(seed + i * 11) * 0.45).toFixed(2)}"/>`;
  }).join('');

const pyramid = (x: number, y: number, s: number) => {
  let out = `<ellipse cx="${x}" cy="${y + 8}" rx="${190 * s}" ry="${30 * s}" fill="#e8c860" stroke="${INK}" stroke-width="4"/>`;
  const tiers = [[-2, -1, 0, 1, 2], [-1.5, -0.5, 0.5, 1.5], [-1, 0, 1], [-0.5, 0.5], [0]];
  tiers.forEach((row, r) => row.forEach((c) => { out += peach(x + c * 70 * s, y - 40 * s - r * 72 * s, 0.78 * s); }));
  return out;
};

const table = () => `
  <path d="M${TABLE.x0 - 200} ${TABLE.y}H${TABLE.x1 + 200}V1400H${TABLE.x0 - 200}Z" fill="#7a1c14"/>
  <path d="M${TABLE.x0 - 200} ${TABLE.y}H${TABLE.x1 + 200}V${TABLE.y + 40}H${TABLE.x0 - 200}Z" fill="#b8862e" stroke="${INK}" stroke-width="4"/>
  ${Array.from({ length: 18 }, (_, i) => `<path d="M${TABLE.x0 - 180 + i * 120} ${TABLE.y + 40}l40 70l40 -70" fill="#f2c23a" stroke="${INK}" stroke-width="3"/>`).join('')}
  ${wineJar(2360, TABLE.y + 10, 1.9)}
  ${pyramid(2860, TABLE.y, 1.25)}
  ${cup(3250, TABLE.y + 6, 1.5)}${cup(3400, TABLE.y + 6, 1.3, '', -8)}
  ${gourd(3640, TABLE.y + 8, 1.8, '', 6)}
  ${peach(3480, TABLE.y - 40, 0.9)}${peach(2560, TABLE.y - 40, 0.9)}`;

const scene: SceneDef = {
  id: 8,
  bg: '#1a0c0a',
  markup: () => [
    plane(0.15, `<rect x="-3000" y="-3000" width="9000" height="8000" fill="#240e0c"/>
      <ellipse cx="1500" cy="420" rx="1500" ry="600" fill="#6a2a14" opacity=".8" filter="url(#k-blur40)"/>
      <g filter="url(#k-blur16)">${bokeh(40, 11, 60, 700, 20, 60, ['#ffb040', '#ff6a3a', '#ffd88a'])}</g>`),
    plane(0.45, `<g filter="url(#k-blur6)" opacity=".7">${Array.from({ length: 14 }, (_, i) => `<g transform="translate(${-400 + i * 360} ${130 + (i % 3) * 40})"><path d="M0 -60v30" stroke="#5a2a1a" stroke-width="3"/><ellipse cx="0" cy="0" rx="36" ry="46" fill="#e8402a"/><ellipse cx="0" cy="0" rx="18" ry="30" fill="#ffc060" opacity=".7"/></g>`).join('')}</g>`),
    plane(1, `<g class="s8-table">${table()}</g>
      <ellipse cx="${FACE.x + 80}" cy="560" rx="560" ry="620" fill="#ff9a40" opacity=".22" filter="url(#k-blur40)"/>
      ${heroMarkup('wukong', 'bima')}
      <g class="s8-peach">${peach(0, 0, 1.3)}</g><g class="s8-bitten" opacity="0">${peach(0, 0, 1.3, '', true)}</g>
      <rect class="s8-grade" x="-3000" y="-3000" width="9000" height="8000" fill="#300808" opacity="0"/>`),
    plane(1.9, `<g filter="url(#k-blur16)">${bokeh(10, 71, 0, 1100, 60, 140, ['#ffb040', '#ff7a3a'])}</g>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const x = track([[-12, 940], [PAN.out0, 960], [PAN.out1, 2600, 'inOut'], [PAN.back0, 3420, 'linear'], [PAN.back1, 1000, 'outExpo'], [130, 980]], lf);
    const y = track([[-12, 560], [PAN.out0, 540], [PAN.out1, 640, 'inOut'], [PAN.back0, 660], [PAN.back1, 540, 'outExpo'], [130, 520]], lf);
    const zoom = track([[-12, 1.0], [PAN.out0, 1.1], [PAN.out1, 1.0, 'inOut'], [PAN.back0, 1.06], [PAN.back1, 1.2, 'outExpo'], [130, 1.34, 'inOut']], lf);
    return { x: x + noise(lf * 0.04, 1) * 8, y: y + noise(lf * 0.04, 2) * 6, zoom };
  },
  heroes: (t) => [{ name: 'wukong', costume: 'bima', pose: faceAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const hand = solve(faceAt(lf)).hands.F;
    const fall = inCubic(span(lf, 80, 92));
    const near = smooth(span(lf, 96, 103)) - smooth(span(lf, 106, 114)) * 0.6;
    const px = hand[0] + 18 - near * 46, py = hand[1] - 60 - near * 26 - (1 - fall) * 1100 + (lf > 92 ? Math.sin((lf - 92) * 0.8) * 10 * (1 - span(lf, 92, 100)) : 0);
    const bitten = lf >= 104;
    d.tf('.s8-peach', `translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${((1 - fall) * 160).toFixed(1)})`);
    d.tf('.s8-bitten', `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(-1 1)`);
    d.op('.s8-peach', lf < 78 || bitten ? 0 : 1);
    d.op('.s8-bitten', bitten ? 1 : 0);
    d.op('.s8-grade', smooth(span(lf, 76, 110)) * 0.3);
  },
  fx: (ctx, t, view) => {
    const lf = t.lf;
    const whip = Math.max(span(lf, PAN.out0 + 4, PAN.out0 + 10) * (1 - span(lf, PAN.out1 - 6, PAN.out1)), span(lf, PAN.back0, PAN.back0 + 2) * (1 - span(lf, PAN.back1 - 5, PAN.back1)));
    if (whip > 0.02) streaks(ctx, whip, lf, 0, '255,200,140');
    motes(ctx, view, lf, 40, 'rgba(255,190,110,A)', 21, 0.7, [0.2, -0.6], 3);
  },
};

export default scene;
