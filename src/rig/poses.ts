import { trackRec, type Key } from '../engine/ease.ts';
import { blend, REST, type Pose } from './hero.ts';

/** Pose authoring helper: REST + overrides. Angles in degrees, character facing +x. */
export const pose = (o: Partial<Pose>): Pose => ({ ...REST, ...o });

export const P = {
  stand: pose({}),
  heroic: pose({ uaF: -34, faF: -52, uaB: 22, faB: -40, thF: -10, shF: 6, thB: 14, shB: 4, staff: 1, staffA: -90, grip: 0.36, head: -4, mouth: 0.7 }),
  handShade: pose({ uaF: -132, faF: -72, uaB: 20, faB: -30, head: -8, torso: -2, thF: -12, shF: 8, thB: 10, shB: 2, mouth: 0.9, look: 1 }),
  crouch: pose({ lean: 8, torso: 24, head: -18, thF: -74, shF: 104, fF: -18, thB: 26, shB: 78, fB: -30,
    uaF: 40, faF: -70, staff: 1, staffA: 196, grip: 0.62, twoHand: 1, gap: 110, brow: 1, mouth: -0.3 }),
  windup: pose({ lean: -4, torso: -18, head: -6, thF: -40, shF: 50, fF: -8, thB: 34, shB: 30, fB: -20,
    uaF: -170, faF: -30, staff: 1, staffA: -150, grip: 0.3, twoHand: 1, gap: 120, brow: 1, mouth: -0.4 }),
  strike: pose({ lean: 6, torso: 28, head: -2, thF: -58, shF: 58, fF: -8, thB: 48, shB: 12, fB: -30,
    uaF: -92, faF: -6, staff: 1, staffA: 12, grip: 0.22, twoHand: 1, gap: 110, brow: 1, mouth: -0.6 }),
  follow: pose({ lean: 10, torso: 38, head: 6, thF: -62, shF: 70, fF: -14, thB: 56, shB: 20, fB: -36,
    uaF: -30, faF: -20, staff: 1, staffA: 70, grip: 0.25, twoHand: 1, gap: 110, brow: 0.9, mouth: -0.2 }),
  jump: pose({ lean: -6, torso: 10, head: -10, thF: -96, shF: 110, fF: -20, thB: -24, shB: 120, fB: -30,
    uaF: -140, faF: -20, uaB: -60, faB: -40, plant: 0, staff: 1, staffA: -120, grip: 0.4, brow: 0.8, mouth: 0.6 }),
  fly: pose({ lean: 62, torso: 12, head: -52, thF: -10, shF: 30, fF: 20, thB: 24, shB: 40, fB: 30,
    uaF: -150, faF: -10, uaB: 40, faB: -20, plant: 0, staff: 1, staffA: -12, grip: 0.4, mouth: 0.7 }),
  kneel: pose({ lean: 4, torso: 8, head: 16, thF: -84, shF: 88, fF: 0, thB: 12, shB: 104, fB: 60,
    uaF: 20, faF: -20, uaB: 30, faB: -20, brow: 0.9, mouth: -0.5, lid: 0.35 }),
  bow: pose({ lean: 6, torso: 34, head: 14, thF: -8, shF: 6, thB: 8, shB: 4,
    uaF: -58, faF: -76, uaB: -46, faB: -86, mouth: 0.2, lid: 0.5 }),
  meditate: pose({ lean: 0, torso: 2, head: 6, thF: -86, shF: 144, fF: -40, thB: -80, shB: 150, fB: -50,
    uaF: -26, faF: -64, uaB: -18, faB: -70, lid: 1, mouth: 0 }),
  pole: pose({ lean: 4, torso: 22, head: -10, thF: -30, shF: 30, thB: 26, shB: 18, fB: -14,
    uaF: -40, faF: -40, staff: 1, staffA: 112, grip: 0.24, twoHand: 1, gap: 120, mouth: 0.3 }),
  angry: pose({ torso: -4, head: -8, uaF: 20, faF: -80, uaB: 26, faB: -60, thF: -10, shF: 8, thB: 14, shB: 6, brow: 1, mouth: -0.8 }),
};

/** Walk / run cycles: phase in cycles (1 = one full stride). */
export function walk(phase: number, base: Pose = P.stand, run = 0): Pose {
  const s = Math.sin(phase * Math.PI * 2), c = Math.cos(phase * Math.PI * 2);
  const amp = 26 + run * 26;
  return {
    ...base,
    thF: base.thF - s * amp, thB: base.thB + s * amp,
    shF: base.shF + Math.max(0, c) * (30 + run * 60), shB: base.shB + Math.max(0, -c) * (30 + run * 60),
    uaF: base.uaF + s * (18 + run * 30), uaB: base.uaB - s * (18 + run * 30),
    lean: base.lean + run * 12, dy: base.dy - Math.abs(c) * (4 + run * 10),
  };
}

export { blend };

/**
 * Keyframed pose animation: [[localFrame, pose, easeIntoThisKey?], ...].
 * Every numeric pose channel is interpolated with the named ease (default inOut),
 * so use inBack for anticipation, outExpo for explosive moves, outBack/outSpring to settle.
 */
export function poseTrack(keys: Key<Pose>[], lf: number): Pose {
  return trackRec(keys as unknown as Key<Record<string, number>>[], lf) as unknown as Pose;
}

/** Offset a pose's position/scale. */
export const at = (p: Pose, x: number, y: number, s = p.s, face = p.face): Pose => ({ ...p, x, y, s, face });
