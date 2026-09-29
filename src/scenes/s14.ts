import { noise, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, solve, type Pose } from '../rig/hero.ts';
import { P } from '../rig/poses.ts';
import { cloudSea, haze, heavenGate, INK, soldier } from './kit.ts';
import { motes } from './fxkit.ts';

/**
 * 14 锁 — out of black: iron chain links fill the frame, then the camera draws back and back
 * to show Wukong, scorched and grey, kneeling in chains on the flagstones before the colossal
 * 南天门. Guards stand in cold ranks; his staff lies far away on the stones, out of reach.
 * Grey-blue monochrome; ash drifts down.
 */

export const HERO = { x: 960, y: 900, s: 0.62 };
export const ANCHOR = { L: [250, 900] as [number, number], R: [1670, 900] as [number, number] };

export const heroAt = (lf: number): Pose => {
  const breathe = Math.sin(lf * 0.12);
  return {
    ...P.kneel, uaF: -40 + breathe * 2, faF: -10, uaB: 40, faB: 10,
    head: 26 + breathe * 2, torso: 14 + breathe * 1.5, lid: 0.7, brow: 0.5, mouth: -0.5,
    x: HERO.x, y: HERO.y, s: HERO.s, face: 1, wind: 0.1,
  };
};

// chain as a sagging quadratic between two points, drawn with dashed strokes (link rims + edge-on links)
export const chainPath = (a: [number, number], b: [number, number], sag: number) => {
  const mx = (a[0] + b[0]) / 2, my = Math.max(a[1], b[1]) + sag;
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
};
export const chain = (cls: string, w = 1) => `<g class="${cls}">
  <path d="" fill="none" stroke="#14181e" stroke-width="${18 * w}" stroke-dasharray="${30 * w} ${6 * w}" stroke-linecap="round"/>
  <path d="" fill="none" stroke="#6a7480" stroke-width="${9 * w}" stroke-dasharray="${24 * w} ${12 * w}" stroke-dashoffset="${-3 * w}" stroke-linecap="round"/>
  <path d="" fill="none" stroke="#2a3038" stroke-width="${5 * w}" stroke-dasharray="${14 * w} ${22 * w}" stroke-dashoffset="${-11 * w}"/></g>`;

export const post = (x: number, y: number) => `<g><path d="M${x - 60} ${y + 30}L${x - 44} ${y - 170}H${x + 44}L${x + 60} ${y + 30}Z" fill="#4a525c" stroke="${INK}" stroke-width="4"/>
  <path d="M${x - 70} ${y - 170}H${x + 70}V${y - 200}H${x - 70}Z" fill="#5a646e" stroke="${INK}" stroke-width="4"/>
  <circle cx="${x}" cy="${y - 110}" r="30" fill="none" stroke="#1e2228" stroke-width="12"/><circle cx="${x}" cy="${y - 110}" r="30" fill="none" stroke="#7a8490" stroke-width="4"/></g>`;

export const floor = () => `
  <path d="M-1400 760H3300V1500H-1400Z" fill="#5a6470"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M-1400 ${772 + i * i * 9 + i * 18}H3300" stroke="#48505a" stroke-width="${2 + i * 0.6}"/>`).join('')}
  ${Array.from({ length: 31 }, (_, i) => `<path d="M${960 + (i - 15) * 70} 760L${960 + (i - 15) * 330} 1500" stroke="#48505a" stroke-width="3"/>`).join('')}
  <ellipse cx="960" cy="930" rx="900" ry="120" fill="#8a96a4" opacity=".25" filter="url(#k-blur40)"/>`;

export const staffOnFloor = `<g transform="translate(1440 975) rotate(-3) scale(.85)"><rect x="-230" y="-8" width="460" height="16" rx="6" fill="#6a3a34" stroke="${INK}" stroke-width="3"/>
  <rect x="-230" y="-10" width="50" height="20" rx="5" fill="#8a7a5a" stroke="${INK}" stroke-width="2.5"/><rect x="180" y="-10" width="50" height="20" rx="5" fill="#8a7a5a" stroke="${INK}" stroke-width="2.5"/>
  <ellipse cx="0" cy="16" rx="240" ry="8" fill="#2a3038" opacity=".5"/></g>`;

const scene: SceneDef = {
  id: 14,
  bg: '#1a2028',
  markup: () => [
    plane(0, `<rect x="-100" y="-100" width="2120" height="1280" fill="url(#s14-sky)"/>
      <defs><linearGradient id="s14-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2230"/><stop offset=".6" stop-color="#4a5666"/><stop offset="1" stop-color="#7a8694"/></linearGradient></defs>`),
    plane(0.25, `${cloudSea(-1200, 3200, 720, 120, 5, 'url(#k-cloud-storm)', '', 'rgba(180,190,210,.3)')}`),
    plane(0.4, `${heavenGate(960, 790, 860, { cold: true })}${haze('#5a6878', 0.35)}`),
    plane(0.62, `${Array.from({ length: 16 }, (_, i) => soldier(i < 8 ? -140 + i * 70 : 1500 + (i - 8) * 70, 790 + (i % 2) * 8, 0.62, i, i < 8, 0)).join('')}
      ${haze('#5a6878', 0.2)}`),
    plane(1, `${floor()}${post(ANCHOR.L[0], ANCHOR.L[1])}${post(ANCHOR.R[0], ANCHOR.R[1])}${staffOnFloor}
      <ellipse cx="${HERO.x}" cy="${HERO.y + 4}" rx="150" ry="18" fill="#1e242c" opacity=".6"/>
      ${chain('s14-chainB', 0.8)}
      ${heroMarkup('wukong', 'furnace')}
      ${chain('s14-chainF', 0.8)}`),
    plane(1.7, `<g class="s14-fg">${chain('s14-chainFG', 3)}
      <path d="M-400 1300L-300 980H240L360 1300Z" fill="#20262e"/><path d="M1760 1300L1880 1020H2400V1300Z" fill="#20262e"/></g>`),
    plane(1.7, `<rect class="s14-grade" x="-6000" y="-4000" width="16000" height="10000" fill="#3a4a60" opacity=".22"/>`),
  ].join(''),
  camera: (t) => {
    const lf = t.lf;
    const zoom = track([[-14, 3.0], [8, 2.8], [96, 0.92, 'inOut'], [134, 0.88]], lf);
    const x = track([[-14, 1040], [8, 1030], [96, 960, 'inOut']], lf);
    const y = track([[-14, 820], [8, 810], [96, 470, 'inOut'], [134, 460]], lf);
    return { x: x + noise(lf * 0.03, 4) * 5, y: y + noise(lf * 0.03, 9) * 4, zoom };
  },
  heroes: (t) => [{ name: 'wukong', costume: 'furnace', pose: heroAt(t.lf) }],
  update: (d, t) => {
    const lf = t.lf;
    const hands = solve(heroAt(lf)).hands;
    const setChain = (cls: string, dd: string) => d.all(`.${cls} path`).forEach((p) => p.setAttribute('d', dd));
    setChain('s14-chainF', chainPath(hands.F, [ANCHOR.R[0], ANCHOR.R[1] - 110], 60 + Math.sin(lf * 0.12) * 4));
    setChain('s14-chainB', chainPath(hands.B, [ANCHOR.L[0], ANCHOR.L[1] - 110], 70 + Math.sin(lf * 0.12 + 1) * 4));
    setChain('s14-chainFG', chainPath([-400, -300], [620, -260], 200 + Math.sin(lf * 0.05) * 20));
    d.tf('.s14-fg', `translate(${(Math.sin(lf * 0.02) * 8).toFixed(1)} 0)`);
  },
  fx: (ctx, t, view) => {
    motes(ctx, view, t.lf, 70, 'rgba(210,216,226,A)', 81, 1, [0.4, 1.4], 2.5);
  },
};

export default scene;
