import { clamp, inOut } from './engine/ease.ts';

export const FPS = 30;
export const TOTAL_FRAMES = 3150;

/** Each scene owns [start, end); the last output frame is 3149. */
export const SCENE_BOUNDS = [0, 150, 270, 420, 540, 690, 840, 990, 1110, 1260,
  1380, 1530, 1680, 1830, 1950, 2100, 2220, 2400, 2520, 2640, 2820, 2940, 3150] as const;
export const SCENE_NAMES = [
  '云海天宫', '漂洋过海', '三星洞求道', '花果山·自由', '天庭诏安', '弼马温',
  '门外', '笑容消失', '闹蟠桃会', '归山', '天兵压境', '第一棒',
  '从花果山杀向天宫', '锁', '雷、刀、火', '入炉', '炉火', '火眼金睛',
  '破炉', '一路打入凌霄殿', '凌霄宝殿', '大闹天宫',
] as const;

export type TransitionType = 'dissolve' | 'cloud' | 'ink' | 'flash' | 'push' | 'whip' | 'black';
export interface Transition { type: TransitionType; len: number }

/** TRANSITIONS[i] joins scene i+1 to scene i+2 (centred on SCENE_BOUNDS[i+1]). */
export const TRANSITIONS: Transition[] = [
  { type: 'cloud', len: 30 },    // 1 -> 2  dive through the cloud sea to the ocean
  { type: 'dissolve', len: 26 }, // 2 -> 3  sea spray becomes mountain mist
  { type: 'whip', len: 18 },     // 3 -> 4  somersault cloud streaks away
  { type: 'flash', len: 20 },    // 4 -> 5  staff glint becomes the decree's light
  { type: 'dissolve', len: 22 }, // 5 -> 6
  { type: 'dissolve', len: 24 }, // 6 -> 7
  { type: 'push', len: 20 },     // 7 -> 8  push through the banquet door
  { type: 'whip', len: 14 },     // 8 -> 9
  { type: 'flash', len: 18 },    // 9 -> 10 spinning pill becomes the sun
  { type: 'ink', len: 26 },      // 10 -> 11 black clouds swallow the sun
  { type: 'dissolve', len: 16 }, // 11 -> 12
  { type: 'whip', len: 16 },     // 12 -> 13
  { type: 'black', len: 24 },    // 13 -> 14 capture
  { type: 'dissolve', len: 20 }, // 14 -> 15
  { type: 'black', len: 22 },    // 15 -> 16
  { type: 'dissolve', len: 22 }, // 16 -> 17 ember becomes fire
  { type: 'push', len: 18 },     // 17 -> 18 into the eyes
  { type: 'flash', len: 16 },    // 18 -> 19
  { type: 'whip', len: 16 },     // 19 -> 20
  { type: 'dissolve', len: 18 }, // 20 -> 21
  { type: 'flash', len: 18 },    // 21 -> 22
];

export function sceneAt(frame: number): number {
  for (let i = 1; i < SCENE_BOUNDS.length; i++) if (frame < SCENE_BOUNDS[i]) return i;
  return 22;
}

export function clampFrame(frameNumber: number): number {
  return clamp(Math.round(Number.isFinite(frameNumber) ? frameNumber : 0), 0, TOTAL_FRAMES - 1);
}

export interface SceneTime {
  scene: number;
  /** Progress through the scene's own bounds; may run slightly outside 0..1 during transitions. */
  p: number;
  /** Frames since the scene's start (may be negative while it transitions in). */
  lf: number;
  /** Scene length in frames. */
  dur: number;
  f: number;
}

export function sceneTime(scene: number, frame: number): SceneTime {
  const start = SCENE_BOUNDS[scene - 1], end = SCENE_BOUNDS[scene];
  const dur = end - start;
  return { scene, p: (frame - start) / dur, lf: frame - start, dur, f: frame };
}

export interface Composition {
  frame: number;
  /** Outgoing (or only) scene. */
  a: SceneTime;
  /** Incoming scene while a transition is running. */
  b: SceneTime | null;
  transition: TransitionType | null;
  /** 0 = fully scene a, 1 = fully scene b (eased). */
  mix: number;
  /** Raw linear transition progress 0..1. */
  raw: number;
}

/** Which scenes are on screen at `frame`, and how far the transition between them has run. */
export function compose(frameNumber: number): Composition {
  const frame = clampFrame(frameNumber);
  const s = sceneAt(frame);
  const frameA = { frame, a: sceneTime(s, frame), b: null, transition: null, mix: 0, raw: 0 };
  // transition into this scene (centred on its start)
  if (s > 1) {
    const tr = TRANSITIONS[s - 2];
    const b = SCENE_BOUNDS[s - 1];
    if (frame < b + tr.len / 2) {
      const raw = (frame - (b - tr.len / 2)) / tr.len;
      return { frame, a: sceneTime(s - 1, frame), b: sceneTime(s, frame), transition: tr.type, mix: inOut(raw), raw };
    }
  }
  // transition out of this scene
  if (s < 22) {
    const tr = TRANSITIONS[s - 1];
    const b = SCENE_BOUNDS[s];
    if (frame >= b - tr.len / 2) {
      const raw = (frame - (b - tr.len / 2)) / tr.len;
      return { frame, a: sceneTime(s, frame), b: sceneTime(s + 1, frame), transition: tr.type, mix: inOut(raw), raw };
    }
  }
  return frameA;
}
