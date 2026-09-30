import { clamp, lerp } from '../engine/ease.ts';
import { apply, I, mul, R, S, svg, T, type M } from './mat.ts';

/**
 * Sun Wukong as a jointed cut-out puppet (1961 Shanghai studio design language):
 * hierarchical SVG groups driven by forward kinematics, 2-bone IK for the rear arm
 * (two-handed staff grips), automatic foot planting, and follow-through for cape,
 * scarf and pheasant plumes derived from the pose a few frames earlier.
 */

export type Costume = 'pilgrim' | 'king' | 'bima' | 'sage' | 'furnace';

export interface Pose {
  x: number; y: number; s: number; face: number;
  lean: number; torso: number; head: number;
  uaF: number; faF: number; uaB: number; faB: number;
  thF: number; shF: number; fF: number; thB: number; shB: number; fB: number;
  /** Direction of the staff head in character space: 0 = forward, 90 = down, -90 = up. */
  staffA: number;
  /** Where the lead hand holds the staff, 0 = tail end, 1 = head end. */
  grip: number;
  /** 0..1 blend of rear arm IK onto the staff. */
  twoHand: number;
  /** Rear hand distance along the staff from the lead hand (towards the tail). */
  gap: number;
  staff: number; staffLen: number; staffGlow: number;
  /** 0..1 how strongly the lowest foot is snapped to the ground line. */
  plant: number; dy: number;
  mouth: number; brow: number; lid: number; glow: number; look: number;
  wind: number;
}

export const REST: Pose = {
  x: 0, y: 0, s: 1, face: 1,
  lean: 0, torso: 0, head: 0,
  uaF: -12, faF: -20, uaB: 14, faB: -16,
  thF: -6, shF: 4, fF: 0, thB: 8, shB: 4, fB: 0,
  staffA: -80, grip: 0.5, twoHand: 0, gap: 90,
  staff: 0, staffLen: 1, staffGlow: 0,
  plant: 1, dy: 0,
  mouth: 0.4, brow: 0.2, lid: 0, glow: 0, look: 0,
  wind: 0,
} as Pose;

export const blend = (a: Pose, b: Pose, t: number): Pose => {
  const o = {} as Record<string, number>;
  for (const k of Object.keys(a)) o[k] = lerp((a as any)[k], (b as any)[k] ?? (a as any)[k], t);
  return o as unknown as Pose;
};

/* ---------------- skeleton ---------------- */
const HIP_H = 206;
const TH = 98, SH = 92, UA = 64, FA = 60, HAND = 11, STAFF_L = 560;
const HIP_B: [number, number] = [-11, 6], HIP_F: [number, number] = [13, 6];
const SHO_B: [number, number] = [-15, -100], SHO_F: [number, number] = [21, -102];
const NECK: [number, number] = [6, -106];

const dirAngle = (vx: number, vy: number) => Math.atan2(-vx, vy) * 180 / Math.PI;

interface Solved {
  hipY: number; uaB: number; faB: number; staffLocal: number;
  hands: { F: [number, number]; B: [number, number] };
  staffEnds: [[number, number], [number, number]];
  root: M;
}

/** Forward kinematics in character space (feet on y = 0, facing +x), then to world space. */
export function solve(p: Pose): Solved {
  const soleY = (hipY: number, th: number, sh: number, lean: number, hip: [number, number]) => {
    let m = mul(mul(T(0, hipY), R(lean)), mul(T(hip[0], hip[1]), R(th)));
    m = mul(m, mul(T(0, TH), R(sh)));
    const ankle = apply(m, 0, SH);
    return ankle[1] + 10;
  };
  const lowest = Math.max(soleY(0, p.thF, p.shF, p.lean, HIP_F), soleY(0, p.thB, p.shB, p.lean, HIP_B));
  const hipY = lerp(-HIP_H, -lowest, clamp(p.plant)) + p.dy;

  const torsoM = mul(mul(T(0, hipY), R(p.lean)), R(p.torso));
  const armF = mul(mul(torsoM, T(SHO_F[0], SHO_F[1])), R(p.uaF));
  const wristF = mul(mul(armF, T(0, UA)), R(p.faF));
  const handF = apply(wristF, 0, FA + HAND);
  const accF = p.lean + p.torso + p.uaF + p.faF;
  const staffLocal = p.staffA - accF; // staff drawn along +x; rotate so its head points at staffA
  const rad = p.staffA * Math.PI / 180;
  const dir: [number, number] = [Math.cos(rad), Math.sin(rad)];
  const L = STAFF_L * p.staffLen;
  const tail: [number, number] = [handF[0] - dir[0] * L * p.grip, handF[1] - dir[1] * L * p.grip];
  const head: [number, number] = [handF[0] + dir[0] * L * (1 - p.grip), handF[1] + dir[1] * L * (1 - p.grip)];

  // Rear arm: blend manual angles with 2-bone IK reaching a point on the staff.
  let uaB = p.uaB, faB = p.faB;
  if (p.twoHand > 0.001) {
    const sho = apply(torsoM, SHO_B[0], SHO_B[1]);
    const tgt: [number, number] = [handF[0] - dir[0] * p.gap, handF[1] - dir[1] * p.gap];
    const a = UA, b = FA + HAND;
    let dx = tgt[0] - sho[0], dy = tgt[1] - sho[1];
    let d = Math.hypot(dx, dy);
    if (d > a + b - 1) { dx *= (a + b - 1) / d; dy *= (a + b - 1) / d; d = a + b - 1; }
    const base = dirAngle(dx, dy);
    const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
    const bend = Math.acos(cosA) * 180 / Math.PI; // elbow bends backwards (away from facing)
    const upperW = base - bend;
    const e = [sho[0] + -Math.sin(upperW * Math.PI / 180) * a, sho[1] + Math.cos(upperW * Math.PI / 180) * a];
    const foreW = dirAngle(tgt[0] - e[0], tgt[1] - e[1]);
    const ikUa = upperW - p.lean - p.torso, ikFa = foreW - upperW;
    uaB = lerp(p.uaB, ikUa, p.twoHand);
    faB = lerp(p.faB, ikFa, p.twoHand);
  }
  const armB = mul(mul(torsoM, T(SHO_B[0], SHO_B[1])), R(uaB));
  const handB = apply(mul(mul(armB, T(0, UA)), R(faB)), 0, FA + HAND);

  const root = mul(T(p.x, p.y), S(p.s * p.face, p.s));
  const w = (q: [number, number]) => apply(root, q[0], q[1]);
  return { hipY, uaB, faB, staffLocal, hands: { F: w(handF), B: w(handB) }, staffEnds: [w(tail), w(head)], root };
}

/** A point on the animated head, in scene coordinates (for precisely attached effects). */
export function headPoint(p: Pose, x = 20, y = -66): [number, number] {
  const solved = solve(p);
  const torso = mul(mul(T(0, solved.hipY), R(p.lean)), R(p.torso));
  const neck = mul(T(NECK[0], NECK[1]), R(p.head));
  return apply(mul(solved.root, mul(torso, neck)), x, y);
}

/* ---------------- drawing ---------------- */
const INK = '#2b1810';
const sw = 'stroke="#2b1810" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"';

/** Tapered capsule from (0,0) down to (0,L). */
function limb(L: number, w0: number, w1: number, bulge = 2) {
  const k = 1.15;
  return `M${-w0} 0C${-w0} ${-w0 * k} ${w0} ${-w0 * k} ${w0} 0Q${w0 + bulge} ${L * 0.45} ${w1} ${L}` +
    `C${w1} ${L + w1 * k} ${-w1} ${L + w1 * k} ${-w1} ${L}Q${-w0 - bulge} ${L * 0.45} ${-w0} 0Z`;
}
/** Shadow band along the back (+x after mirroring is the rear) edge of a limb. */
function limbShade(L: number, w0: number, w1: number) {
  return `M${w0 * 0.25} ${-w0 * 0.9}C${w0} ${-w0} ${w0 + 1} ${-w0 * 0.4} ${w0} 0Q${w0 + 2} ${L * 0.45} ${w1} ${L}` +
    `C${w1} ${L + w1} ${w1 * 0.3} ${L + w1} ${w1 * 0.2} ${L}Z`;
}
const part = (cls: string, body: string) => `<g class="c ${cls}">${body}</g>`;
const P = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}" ${sw} ${extra}/>`;
const Sh = (d: string, fill: string) => `<path d="${d}" fill="${fill}" opacity=".55"/>`;

const COL = {
  fur: '#d9962b', furS: '#a4631a', furH: '#f4c766', skin: '#f6dcc0', skinS: '#e2b48f',
  red: '#cf3326', redS: '#951d16', gold: '#f2c23a', goldS: '#b8841c', goldH: '#fff1b0',
  yellow: '#f5c93a', yellowS: '#d09b1c', green: '#3faa58', greenS: '#26773b',
  tiger: '#ec9a2c', robeG: '#6d8792', robeGS: '#4d6470', boot: '#23272d', bima: '#b9443a', bimaS: '#86271f',
};

function legMarkup(side: 'F' | 'B') {
  const shade = side === 'B' ? ' filter="url(#rig-back)"' : '';
  const thigh = [
    part('c-pilgrim', P(limb(TH, 17, 14), '#5f7079') + Sh(limbShade(TH, 17, 14), '#3e4c53')),
    part('c-king c-sage c-furnace', P(limb(TH, 19, 15, 5), COL.red) + Sh(limbShade(TH, 19, 15), COL.redS)),
    part('c-bima', P(limb(TH, 16, 13), '#3a3f47')),
  ].join('');
  const shin = [
    part('c-pilgrim', P(limb(SH, 13, 10), '#5f7079') + P(`M-12 ${SH - 38}h24v26h-24z`, '#e8dcc0')),
    part('c-king c-sage c-furnace', P(limb(SH, 15, 12, 3), COL.red) + P(`M-15 ${SH - 44}C-16 ${SH - 20} -14 ${SH} -13 ${SH + 4}h26C14 ${SH} 16 ${SH - 20} 15 ${SH - 44}Z`, COL.boot) +
      `<path d="M-15 ${SH - 44}h30" stroke="#f3e9d2" stroke-width="5"/>`),
    part('c-bima', P(limb(SH, 13, 11), '#3a3f47')),
  ].join('');
  const foot = [
    part('c-pilgrim', P(`M-12 -4C-8 -12 20 -12 34 -2C40 3 38 10 30 10H-12C-16 10 -16 0 -12 -4Z`, '#c9b58a')),
    part('c-king c-bima c-sage c-furnace', P(`M-14 -6C-8 -16 24 -14 38 -4C46 2 42 10 34 10H-14C-18 10 -18 -2 -14 -6Z`, COL.boot) +
      `<path d="M-15 8H38" stroke="#f3e9d2" stroke-width="4.5"/>`),
  ].join('');
  return `<g class="leg${side}"${shade}><g class="th">${thigh}<g class="kn">${shin}<g class="an">${foot}</g></g></g></g>`;
}

function armMarkup(side: 'F' | 'B') {
  const shade = side === 'B' ? ' filter="url(#rig-back)"' : '';
  const upper = [
    part('c-pilgrim', P(limb(UA, 15, 13), COL.robeG) + Sh(limbShade(UA, 15, 13), COL.robeGS)),
    part('c-king', P(limb(UA, 15, 12), COL.yellow) + Sh(limbShade(UA, 15, 12), COL.yellowS)),
    part('c-bima', P(limb(UA, 17, 18), COL.bima) + Sh(limbShade(UA, 17, 18), COL.bimaS)),
    part('c-sage c-furnace', P(limb(UA, 14, 12), COL.red) +
      P('M-20 -14C-22 -30 16 -34 24 -18C28 -6 24 14 18 22C4 16 -12 14 -22 8Z', COL.gold, 'class="pauldron"') +
      `<path d="M-14 -4C-4 -10 10 -10 20 -2M-14 6C-4 0 10 0 18 8" fill="none" stroke="${COL.goldS}" stroke-width="3"/>`),
  ].join('');
  const fore = [
    part('c-pilgrim', P(limb(FA, 13, 11), COL.robeG)),
    part('c-king', P(limb(FA, 11, 9), COL.fur) + Sh(limbShade(FA, 11, 9), COL.furS)),
    part('c-bima', P(`M-16 0C-18 -10 18 -10 18 0L26 ${FA - 6}C18 ${FA + 8} -22 ${FA + 8} -26 ${FA - 6}Z`, COL.bima) + Sh(`M4 -6C12 -6 18 -2 18 0L26 ${FA - 6}C24 ${FA} 16 ${FA + 4} 8 ${FA + 4}Z`, COL.bimaS)),
    part('c-sage c-furnace', P(limb(FA, 11, 10), COL.fur) + P(`M-13 ${FA - 30}h26v24h-26z`, COL.gold) + `<path d="M-13 ${FA - 18}h26" stroke="${COL.goldS}" stroke-width="3"/>`),
  ].join('');
  const hand = `<g class="hand">${P(`M-11 ${FA - 2}C-15 ${FA + 8} -13 ${FA + 22} -2 ${FA + 24}C10 ${FA + 25} 15 ${FA + 12} 12 ${FA}C8 ${FA - 6} -6 ${FA - 6} -11 ${FA - 2}Z`, '#e3b173')}` +
    `<path d="M-7 ${FA + 8}C-2 ${FA + 5} 5 ${FA + 5} 9 ${FA + 8}M-6 ${FA + 15}C-1 ${FA + 12} 5 ${FA + 12} 8 ${FA + 15}" fill="none" stroke="#9c6a36" stroke-width="2.2"/></g>`;
  const staff = side === 'F' ? `<g class="staff-mount" transform="translate(0 ${FA + HAND})"><g class="staff">${staffMarkup()}</g></g>` : '';
  return `<g class="arm${side}"${shade}><g class="ua">${upper}<g class="el">${fore}${hand}${staff}</g></g></g>`;
}

function staffMarkup() {
  // Drawn along +x from 0 (tail) to STAFF_L; translated by -grip*L per frame.
  const L = STAFF_L;
  const band = (x: number) => `<rect x="${x}" y="-9" width="40" height="18" rx="4" fill="url(#rig-gold)" ${sw}/>` +
    `<path d="M${x + 10} -9V9M${x + 20} -9V9M${x + 30} -9V9" stroke="#8a5a14" stroke-width="2"/>`;
  return `<g class="staff-body">
    <rect class="staff-glow" x="-10" y="-18" width="${L + 20}" height="36" rx="18" fill="#ffd66b" opacity="0" filter="url(#rig-glow)"/>
    <rect x="0" y="-7" width="${L}" height="14" rx="6" fill="#b3261e" ${sw}/>
    <rect x="0" y="-5" width="${L}" height="4" rx="2" fill="#e25a44" opacity=".8"/>
    ${band(0)}${band(L - 40)}
    <rect class="staff-core" x="40" y="-3" width="${L - 80}" height="6" rx="3" fill="#fff4c4" opacity="0"/>
  </g>`;
}

function torsoMarkup() {
  const skirt = (cls: string, fill: string, stripe: string) => part(cls,
    P('M-30 -8C-40 20 -44 44 -40 58C-20 66 22 66 40 56C44 40 40 18 32 -8Z', fill) +
    `<path d="M-30 14l12 10M-24 38l14 8M4 30l10 12M16 10l14 8M-6 50l6 10" fill="none" stroke="${stripe}" stroke-width="5" stroke-linecap="round"/>`);
  return `
  <g class="skirt">
    ${skirt('c-king c-sage c-furnace', COL.tiger, INK)}
    ${part('c-bima', P('M-34 -10C-50 40 -56 110 -58 150C-20 164 30 164 60 150C58 110 50 40 34 -10Z', COL.bima) + Sh('M10 -8C30 30 44 100 60 150C44 158 30 160 20 160Z', COL.bimaS))}
    ${part('c-pilgrim', P('M-30 -10C-44 30 -50 70 -52 104C-20 116 26 116 52 104C50 70 44 30 30 -10Z', COL.robeG) + Sh('M8 -10C26 20 40 70 52 104C40 110 26 114 16 114Z', COL.robeGS))}
  </g>
  <g class="chest">
    ${part('c-pilgrim', P('M-30 4C-36 -40 -34 -96 -18 -112C0 -120 22 -118 30 -108C40 -80 40 -30 32 4Z', COL.robeG) + Sh('M10 -116C26 -112 36 -90 38 -60C40 -30 36 -8 32 4H12Z', COL.robeGS) +
      '<path d="M-14 -112L10 -60L26 -110" fill="none" stroke="#e7dcc3" stroke-width="6"/>' +
      '<path d="M-32 -6C-10 2 14 2 34 -6" fill="none" stroke="#d8c49a" stroke-width="7"/>')}
    ${part('c-king', P('M-28 4C-34 -40 -32 -96 -16 -112C0 -120 22 -118 30 -108C40 -80 40 -30 32 4Z', COL.yellow) + Sh('M10 -116C26 -112 36 -90 38 -60C40 -30 36 -8 32 4H12Z', COL.yellowS) +
      '<path d="M4 -114V2" stroke="#8a5a14" stroke-width="3"/><path d="M-4 -92h16M-4 -70h16M-4 -48h16" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M-30 -4C-10 4 14 4 34 -4" fill="none" stroke="#2b1810" stroke-width="7"/>')}
    ${part('c-bima', P('M-34 6C-40 -40 -36 -98 -18 -114C0 -122 24 -120 32 -110C44 -80 44 -30 36 6Z', COL.bima) + Sh('M12 -118C28 -112 40 -90 42 -60C44 -30 40 -8 36 6H14Z', COL.bimaS) +
      '<rect x="-16" y="-84" width="36" height="34" rx="3" fill="#2f5aa8" stroke="#f2c23a" stroke-width="3"/><path d="M-8 -66C0 -78 10 -78 14 -66C8 -60 -2 -60 -8 -66Z" fill="#fff"/>' +
      '<path d="M-36 -8C-10 0 16 0 38 -8" fill="none" stroke="#c9a05a" stroke-width="7"/>')}
    ${part('c-sage c-furnace', P('M-30 6C-36 -40 -34 -98 -16 -114C0 -122 24 -120 32 -110C44 -80 42 -30 34 6Z', COL.gold) +
      Sh('M12 -118C28 -112 40 -90 42 -60C44 -30 40 -8 34 6H14Z', COL.goldS) +
      '<path d="M-24 -84C-8 -78 16 -78 34 -86M-26 -58C-8 -52 18 -52 36 -60M-24 -32C-6 -26 16 -26 34 -34" fill="none" stroke="#9a6b15" stroke-width="3"/>' +
      P('M-10 -100C-18 -84 -12 -66 4 -62C20 -66 26 -84 18 -100C10 -94 -2 -94 -10 -100Z', '#d8532a') +
      '<circle cx="-2" cy="-84" r="3.5" fill="#fff1b0"/><circle cx="12" cy="-84" r="3.5" fill="#fff1b0"/>' +
      '<path d="M-32 -6C-10 2 14 2 36 -6" fill="none" stroke="#c0392b" stroke-width="8"/>')}
    ${part('c-furnace', '<path class="scorch" d="M-20 -100L-4 -70L-18 -40L4 -18M20 -104L10 -74L26 -52" fill="none" stroke="#ff8a2a" stroke-width="3.5" opacity=".9"/>')}
  </g>`;
}

function headMarkup() {
  const hair = `M-34 -30C-52 -34 -58 -52 -50 -64C-60 -76 -52 -96 -36 -100C-34 -118 -12 -126 4 -118C16 -130 40 -124 44 -106C60 -100 64 -80 56 -66C64 -52 58 -32 42 -26C30 -8 -20 -8 -34 -30Z`;
  return `
  <g class="head-in">
    ${P(hair, COL.fur)}
    <path d="M-40 -96C-30 -90 -24 -80 -22 -70M34 -118C30 -106 28 -98 30 -90M-54 -60C-46 -58 -40 -54 -36 -48" fill="none" stroke="${COL.furS}" stroke-width="3"/>
    <path d="M-30 -104C-20 -112 -2 -116 10 -112" fill="none" stroke="${COL.furH}" stroke-width="4" stroke-linecap="round"/>
    ${P('M-44 -66C-58 -70 -62 -52 -52 -46C-46 -42 -40 -46 -38 -52Z', COL.fur)}
    <path d="M-48 -62C-52 -60 -52 -52 -47 -50" fill="none" stroke="#e79a86" stroke-width="3"/>
    <!-- peach-heart face (桃心脸) -->
    ${P('M14 -12C-12 -24 -28 -44 -24 -66C-20 -84 -2 -90 12 -78C24 -92 50 -88 54 -66C58 -44 40 -22 14 -12Z', COL.skin)}
    <!-- red heart around the eyes -->
    <path d="M12 -42C-4 -48 -18 -58 -16 -70C-14 -82 0 -85 11 -75C22 -87 44 -83 46 -69C48 -57 30 -46 12 -42Z" fill="#e0402f" opacity=".95"/>
    <g class="eyes">
      <path class="lidB" d="M-11 -66C-8 -74 8 -75 11 -66C8 -59 -8 -59 -11 -66Z" fill="#fffbe8"/>
      <path class="lidF" d="M15 -66C18 -76 40 -77 43 -66C40 -58 18 -58 15 -66Z" fill="#fffbe8"/>
      <g class="pupils"><circle cx="1" cy="-66" r="5.2" fill="#f2b21c"/><circle cx="1.6" cy="-66" r="2.8" fill="${INK}"/>
        <circle cx="30" cy="-66.5" r="6.6" fill="#f2b21c"/><circle cx="30.6" cy="-66.5" r="3.5" fill="${INK}"/>
        <circle cx="28.2" cy="-69" r="1.8" fill="#fff"/><circle cx="-0.6" cy="-68.4" r="1.4" fill="#fff"/></g>
      <path class="lids" d="M-12 -66C-8 -75 8 -76 12 -66M14 -66C18 -78 40 -78 44 -66" fill="none" stroke="${INK}" stroke-width="4.2" stroke-linecap="round"/>
      <path d="M-10 -65C-6 -60 6 -60 10 -65M16 -65C20 -59 38 -59 42 -65" fill="none" stroke="${INK}" stroke-width="1.8" opacity=".7"/>
      <g class="eye-glow" opacity="0"><circle cx="1" cy="-66" r="10" fill="#ffe27a" filter="url(#rig-glow)"/><circle cx="30" cy="-66" r="13" fill="#ffe27a" filter="url(#rig-glow)"/></g>
    </g>
    <path class="brows" d="M-12 -78C-6 -84 4 -84 8 -80M18 -80C24 -88 38 -88 44 -82" fill="none" stroke="#1f5e38" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M21 -50C23 -46 27 -46 29 -49" fill="none" stroke="${INK}" stroke-width="2.6"/>
    <circle cx="22" cy="-52" r="1.4" fill="${INK}"/><circle cx="28" cy="-52" r="1.4" fill="${INK}"/>
    <!-- cheek fur tufts -->
    <path d="M-22 -40C-32 -36 -38 -28 -36 -20C-30 -26 -24 -28 -18 -30M50 -40C58 -36 62 -26 60 -18C56 -24 50 -28 44 -30" fill="${COL.fur}" ${sw}/>
    <path class="mouth" d="M14 -36C20 -30 30 -30 36 -36" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>
    <!-- headwear -->
    ${part('c-pilgrim', P('M-6 -122C-4 -134 12 -136 16 -124C12 -118 0 -118 -6 -122Z', '#6d8792') + '<path d="M-36 -98C-10 -110 24 -112 48 -100" fill="none" stroke="#d7c49a" stroke-width="5"/>')}
    ${part('c-king', '<path d="M-40 -96C-14 -112 26 -114 52 -98" fill="none" stroke="#f2c23a" stroke-width="7" stroke-linecap="round"/><circle cx="8" cy="-110" r="6" fill="#d8342a" stroke="#2b1810" stroke-width="2.5"/>')}
    ${part('c-bima hat', P('M-36 -94C-34 -128 44 -132 50 -96C30 -90 -16 -88 -36 -94Z', '#1f2328') +
      P('M-34 -100C-70 -104 -96 -98 -104 -90C-90 -86 -60 -90 -34 -92Z', '#1f2328') + P('M48 -104C82 -110 106 -104 114 -96C100 -90 72 -94 48 -96Z', '#1f2328'))}
    ${part('c-sage c-furnace',
      P('M-36 -96C-30 -120 40 -126 52 -98C30 -92 -16 -90 -36 -96Z', 'url(#rig-gold)') +
      P('M-10 -118L-4 -142L6 -122L14 -146L20 -120Z', COL.gold) +
      '<circle cx="8" cy="-106" r="6" fill="#d8342a" stroke="#2b1810" stroke-width="2.5"/>' +
      '<path class="plumeB" d="" fill="none" stroke="url(#rig-plume)" stroke-width="7" stroke-linecap="round"/>' +
      '<path class="plumeF" d="" fill="none" stroke="url(#rig-plume)" stroke-width="8" stroke-linecap="round"/>')}
  </g>`;
}

const CAPE_ANCHOR: [number, number] = [-12, -108];

/** Markup for one hero instance. `name` is used for data lookup inside a scene slot. */
export function heroMarkup(name = 'wukong', costume: Costume = 'king'): string {
  return `<g class="hero" data-name="${name}" data-c="${costume}">
  <g class="hip">
    <g class="c c-sage c-furnace"><path class="cape" d="" fill="url(#rig-cape)" ${sw}/></g>
    <g class="c c-king"><path class="scarf" d="" fill="${COL.green}" ${sw}/></g>
    ${legMarkup('B')}
    <g class="torso">
      ${armMarkup('B')}
      ${torsoMarkup()}
    </g>
    ${legMarkup('F')}
    <g class="torso2">
      <g class="neck">${headMarkup()}</g>
      ${armMarkup('F')}
    </g>
  </g>
</g>`;
}

/** Shared <defs> used by every hero; injected once per document. */
export const RIG_DEFS = `
  <linearGradient id="rig-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b0"/><stop offset=".45" stop-color="#f2c23a"/><stop offset="1" stop-color="#a8740f"/></linearGradient>
  <linearGradient id="rig-cape" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2362e"/><stop offset=".6" stop-color="#a51a1a"/><stop offset="1" stop-color="#5e0c10"/></linearGradient>
  <linearGradient id="rig-plume" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#8a3a12"/><stop offset=".35" stop-color="#e0a030"/><stop offset=".7" stop-color="#6b2a10"/><stop offset="1" stop-color="#f4d06a"/></linearGradient>
  <filter id="rig-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="rig-back"><feColorMatrix type="matrix" values=".78 0 0 0 0  0 .78 0 0 0  0 0 .82 0 0  0 0 0 1 0"/></filter>`;

export interface HeroEls {
  root: SVGGElement; hip: SVGGElement; torso: SVGGElement; torso2: SVGGElement; neck: SVGGElement;
  legF: [SVGGElement, SVGGElement, SVGGElement]; legB: [SVGGElement, SVGGElement, SVGGElement];
  armF: [SVGGElement, SVGGElement]; armB: [SVGGElement, SVGGElement];
  staffMount: SVGGElement; staff: SVGGElement; staffGlow: SVGElement; staffCore: SVGElement;
  cape: SVGPathElement; scarf: SVGPathElement; plumeF: SVGPathElement; plumeB: SVGPathElement;
  mouth: SVGPathElement; brows: SVGPathElement; lids: SVGPathElement; pupils: SVGGElement; eyeGlow: SVGGElement;
  eyeWhites: SVGPathElement[];
}

export function heroEls(root: SVGGElement): HeroEls {
  const q = <E extends Element>(s: string) => root.querySelector(s) as unknown as E;
  const leg = (s: string) => [q<SVGGElement>(`.leg${s} .th`), q<SVGGElement>(`.leg${s} .kn`), q<SVGGElement>(`.leg${s} .an`)] as [SVGGElement, SVGGElement, SVGGElement];
  const arm = (s: string) => [q<SVGGElement>(`.arm${s} .ua`), q<SVGGElement>(`.arm${s} .el`)] as [SVGGElement, SVGGElement];
  return {
    root, hip: q('.hip'), torso: q('.torso'), torso2: q('.torso2'), neck: q('.neck'),
    legF: leg('F'), legB: leg('B'), armF: arm('F'), armB: arm('B'),
    staffMount: q('.staff-mount'), staff: q('.staff'), staffGlow: q('.staff-glow'), staffCore: q('.staff-core'),
    cape: q('.cape'), scarf: q('.scarf'), plumeF: q('.plumeF'), plumeB: q('.plumeB'),
    mouth: q('.mouth'), brows: q('.brows'), lids: q('.lids'), pupils: q('.pupils'), eyeGlow: q('.eye-glow'),
    eyeWhites: [q('.lidB'), q('.lidF')],
  };
}

const f1 = (n: number) => +n.toFixed(2);

/**
 * Apply a pose. `prev` is the same character a few frames earlier; its difference
 * drives follow-through on cape, scarf and plumes so they trail real motion.
 */
export function poseHero(h: HeroEls, p: Pose, costume: Costume, prev?: Pose) {
  if (h.root.getAttribute('data-c') !== costume) h.root.setAttribute('data-c', costume);
  const sol = solve(p);
  h.root.setAttribute('transform', svg(sol.root));
  h.hip.setAttribute('transform', `translate(0 ${f1(sol.hipY)}) rotate(${f1(p.lean)})`);
  const tor = `rotate(${f1(p.torso)})`;
  h.torso.setAttribute('transform', tor);
  h.torso2.setAttribute('transform', tor);
  h.neck.setAttribute('transform', `translate(${NECK[0]} ${NECK[1]}) rotate(${f1(p.head)})`);
  const leg = (els: HeroEls['legF'], at: [number, number], th: number, sh: number, ft: number) => {
    els[0].setAttribute('transform', `translate(${at[0]} ${at[1]}) rotate(${f1(th)})`);
    els[1].setAttribute('transform', `translate(0 ${TH}) rotate(${f1(sh)})`);
    els[2].setAttribute('transform', `translate(0 ${SH}) rotate(${f1(ft)})`);
  };
  leg(h.legF, HIP_F, p.thF, p.shF, p.fF);
  leg(h.legB, HIP_B, p.thB, p.shB, p.fB);
  h.armF[0].setAttribute('transform', `translate(${SHO_F[0]} ${SHO_F[1]}) rotate(${f1(p.uaF)})`);
  h.armF[1].setAttribute('transform', `translate(0 ${UA}) rotate(${f1(p.faF)})`);
  h.armB[0].setAttribute('transform', `translate(${SHO_B[0]} ${SHO_B[1]}) rotate(${f1(sol.uaB)})`);
  h.armB[1].setAttribute('transform', `translate(0 ${UA}) rotate(${f1(sol.faB)})`);

  // staff
  const L = STAFF_L * p.staffLen;
  h.staff.setAttribute('transform', `rotate(${f1(sol.staffLocal)}) translate(${f1(-L * p.grip)} 0) scale(${f1(p.staffLen)} 1)`);
  (h.staff as unknown as SVGElement).style.opacity = String(clamp(p.staff));
  h.staffGlow.setAttribute('opacity', String(f1(clamp(p.staffGlow) * 0.85)));
  h.staffCore.setAttribute('opacity', String(f1(clamp(p.staffGlow))));

  // face
  const m = clamp(p.mouth, -1, 1);
  h.mouth.setAttribute('d', `M14 -36C20 ${f1(-36 + m * 7)} 30 ${f1(-36 + m * 7)} 36 -36`);
  const b = clamp(p.brow);
  h.brows.setAttribute('d', `M-12 ${f1(-80 + b * 2)}C-6 ${f1(-84 + b * 6)} 4 ${f1(-84 + b * 8)} 8 ${f1(-80 + b * 9)}M18 ${f1(-80 + b * 8)}C24 ${f1(-88 + b * 6)} 38 ${f1(-88 + b * 2)} 44 ${f1(-82 - b * 3)}`);
  const lid = clamp(p.lid);
  const open = 1 - lid;
  for (const w of h.eyeWhites) w.setAttribute('transform', `translate(0 ${f1(-66 * (1 - open))}) scale(1 ${f1(Math.max(open, 0.04))})`);
  (h.pupils as unknown as SVGElement).style.opacity = open < 0.3 ? '0' : '1';
  h.pupils.setAttribute('transform', `translate(${f1(p.look * 2.5)} 0)`);
  h.lids.setAttribute('d', `M-9 -66C-6 ${f1(-66 - 7 * open)} 7 ${f1(-66 - 8 * open)} 9 -66M17 -66C20 ${f1(-66 - 9 * open)} 37 ${f1(-66 - 9 * open)} 39 -66`);
  h.eyeGlow.setAttribute('opacity', String(f1(clamp(p.glow))));

  // follow-through
  const q = prev ?? p;
  const vx = (p.x - q.x) * p.face / Math.max(0.2, p.s), vy = (p.y - q.y) / Math.max(0.2, p.s);
  const spin = (p.lean + p.torso) - (q.lean + q.torso);
  const drag = clamp(-vx * 0.9 + p.wind * 40, -80, 80);
  const lift = clamp(-vy * 0.8, -60, 60);
  const t = (p.x + p.y) * 0.02;

  const [ax, ay] = CAPE_ANCHOR;
  const len = 250;
  const sway = Math.sin(t * 3 + p.lean * 0.05) * 10;
  const fly = Math.max(0, drag) + Math.abs(spin) * 0.8;
  const tipX = ax - 46 - fly * 2.2;
  const tipY = ay + len - fly * 1.6 - lift + sway;
  const hemX = tipX + 96 - fly * 0.4, hemY = tipY + 18 - sway * 0.5;
  h.cape.setAttribute('d', `M${ax - 8} ${ay - 4}C${ax - 50} ${ay + 20} ${f1(tipX + 6)} ${f1(ay + len * 0.35 + sway)} ${f1(tipX - 14)} ${f1(tipY)}` +
    `C${f1(tipX + 14)} ${f1(tipY + 18 - sway)} ${f1(tipX + 34)} ${f1(tipY - 4)} ${f1(tipX + 52)} ${f1(tipY + 14)}` +
    `C${f1(tipX + 66)} ${f1(tipY + 22)} ${f1(hemX - 16)} ${f1(hemY - 6)} ${f1(hemX)} ${f1(hemY)}` +
    `C${f1(ax + 10 - fly * 0.4)} ${f1(ay + 120 - fly)} ${ax + 26} ${ay + 40} ${ax + 30} ${ay - 2}Z`);
  // Cape is attached at the shoulders, i.e. in torso space.
  (h.cape.parentNode as SVGGElement).setAttribute('transform', `rotate(${f1(p.torso)})`);
  // green silk scarf: knot at the throat, two ribbon tails streaming back
  const sf = Math.max(0, drag), wv = Math.sin(t * 4) * 8;
  const tailX = -58 - sf * 1.4, tailY = -60 + wv - lift * 0.5 - sf * 0.5;
  h.scarf.setAttribute('d', `M-18 -116C-8 -124 20 -124 30 -114C24 -104 -10 -102 -18 -110` +
    `C${f1(-30 - sf * 0.3)} -104 ${f1(tailX + 14)} ${f1(tailY - 26)} ${f1(tailX)} ${f1(tailY - 18)}` +
    `C${f1(tailX + 6)} ${f1(tailY - 4)} ${f1(tailX - 4)} ${f1(tailY + 10)} ${f1(tailX + 6)} ${f1(tailY + 16)}` +
    `C${f1(tailX + 26)} ${f1(tailY - 6)} ${f1(-26 - sf * 0.2)} -92 -10 -104Z`);
  (h.scarf.parentNode as SVGGElement).setAttribute('transform', `rotate(${f1(p.torso)})`);

  // 翎子: two long pheasant plumes rising from the crown and sweeping back in a lazy S.
  const bend = clamp(drag * 0.8 + spin * 1.5 - p.head * 0.6 + Math.sin(t * 2.3) * 6, -80, 80);
  const plume = (x0: number, reach: number, back: number) => {
    const tx = x0 - back - bend * 1.6, ty = -118 - reach + Math.abs(bend) * 0.8;
    return `M${x0} -118C${f1(x0 + 6)} ${f1(-118 - reach * 0.45)} ${f1(x0 - back * 0.25 - bend * 0.4)} ${f1(ty - 10)} ${f1((x0 + tx) / 2 - 10)} ${f1(ty - 4)}` +
      `S${f1(tx + 12)} ${f1(ty + 28)} ${f1(tx)} ${f1(ty + 44)}`;
  };
  h.plumeB.setAttribute('d', plume(-4, 190, 150));
  h.plumeF.setAttribute('d', plume(16, 230, 110));
  return sol;
}
