export const FPS = 30;
export const SCENE_ONE_FRAMES = 150;
export const TOTAL_FRAMES = 3150;

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pulse = (p: number, c: number, r: number) => clamp(1 - Math.abs(p - c) / r);

export interface SceneOneState {
  frame: number; seconds: number; cameraScale: number; cameraY: number;
  reveal: number; light: number; cloudDrift: number;
}

export function sceneOneState(frameNumber: number): SceneOneState {
  const frame = clamp(Math.round(Number.isFinite(frameNumber) ? frameNumber : 0), 0, SCENE_ONE_FRAMES);
  const p = frame / SCENE_ONE_FRAMES;
  return { frame, seconds: frame / FPS, cameraScale: 0.92 + 0.19 * smooth(p),
    cameraY: 26 - 39 * smooth(p), reveal: smooth((p - 0.08) / 0.72),
    light: smooth((p - 0.18) / 0.68), cloudDrift: p };
}

/** Each scene owns [start, end); the last output frame is 3149. */
export const SCENE_BOUNDS = [0, 150, 270, 420, 540, 690, 840, 990, 1110, 1260,
  1380, 1530, 1680, 1830, 1950, 2100, 2220, 2400, 2520, 2640, 2820, 2940, 3150] as const;
export const SCENE_NAMES = [
  '云海天宫', '漂洋过海', '三星洞求道', '花果山·自由', '天庭诏安', '弼马温',
  '门外', '笑容消失', '闹蟠桃会', '归山', '天兵压境', '第一棒',
  '从花果山杀向天宫', '锁', '雷、刀、火', '入炉', '炉火', '火眼金睛',
  '破炉', '一路打入凌霄殿', '凌霄宝殿', '大闹天宫',
] as const;
export type SceneNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
  12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22;
export type Palette = 'jade' | 'free' | 'heaven' | 'faded' | 'banquet' |
  'storm' | 'punishment' | 'ember' | 'fire' | 'rainbow' | 'black';
export type CostumeStage = 'pilgrim' | 'monkeyKing' | 'bima' | 'greatSage' | 'furnaceGold';

export interface FilmState {
  frame: number; seconds: number; scene: SceneNumber; sceneName: string; progress: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cameraFov: number;
  cameraRoll: number;
  costumeStage: CostumeStage;
  featherAngle: number;
  cameraScale: number; cameraX: number; cameraY: number; palaceOpacity: number;
  heroX: number; heroY: number; heroScale: number; heroRotation: number;
  capeAngle: number; staffAngle: number; staffGlow: number; eyeGlow: number;
  soldierReveal: number; soldierScatter: number; shockwave: number; shake: number;
  debris: number; darkness: number; titleOpacity: number; flash: number;
  palette: Palette; intensity: number; fog: number; rain: number; cloudSpeed: number;
  mountainScroll: number; raftX: number; gateReveal: number; fire: number;
  colorRelease: number; staffVisible: number;
}

export function filmState(frameNumber: number): FilmState {
  const frame = clamp(Math.round(Number.isFinite(frameNumber) ? frameNumber : 0), 0, TOTAL_FRAMES - 1);
  const index = SCENE_BOUNDS.findIndex((end, i) => i > 0 && frame < end) - 1;
  const scene = (index + 1) as SceneNumber;
  const p = (frame - SCENE_BOUNDS[index]) / (SCENE_BOUNDS[index + 1] - SCENE_BOUNDS[index]);
  const e = smooth(p);

  let costumeStage: CostumeStage = 'pilgrim';
  if (scene === 4 || scene === 10) {
    costumeStage = 'monkeyKing';
  } else if (scene >= 5 && scene <= 9) {
    costumeStage = 'bima';
  } else if ((scene >= 11 && scene <= 13) || (scene >= 20 && scene <= 22)) {
    costumeStage = 'greatSage';
  } else if (scene >= 14 && scene <= 19) {
    costumeStage = 'furnaceGold';
  }

  const s: FilmState = {
    frame, seconds: frame / FPS, scene, sceneName: SCENE_NAMES[index], progress: p,
    cameraPosition: [0, 80, 600],
    cameraTarget: [0, 80, 0],
    cameraFov: 50,
    cameraRoll: 0,
    costumeStage,
    featherAngle: 0,
    cameraScale: 1.1, cameraX: 0, cameraY: 0, palaceOpacity: 0,
    heroX: 650, heroY: 825, heroScale: 1, heroRotation: 0,
    capeAngle: -8, staffAngle: -30, staffGlow: 0, eyeGlow: 0,
    soldierReveal: 0, soldierScatter: 0, shockwave: 0, shake: 0,
    debris: 0, darkness: 0, titleOpacity: 0, flash: 0,
    palette: 'jade', intensity: 0.15, fog: 0.2, rain: 0, cloudSpeed: 0.1,
    mountainScroll: 0, raftX: 0, gateReveal: 0, fire: 0, colorRelease: 0,
    staffVisible: 0,
  };

  switch (scene) {
    case 1: {
      const o = sceneOneState(frame);
      s.cameraScale = o.cameraScale; s.cameraY = o.cameraY;
      s.palaceOpacity = 0.48 + o.reveal * 0.52; s.heroScale = 0;
      s.fog = 1 - o.reveal * 0.55;
      s.cameraPosition = [0, lerp(300, 50, e), lerp(1500, 450, e)];
      s.cameraTarget = [0, 80, 0];
      s.cameraFov = 50;
      break;
    }
    case 2: // Tracking raft and scrolling landscape, storm, dawn, mountain fog.
      s.cameraX = -130 * e; s.cameraScale = 1.06 + 0.04 * e;
      s.heroX = 380 + 460 * e; s.heroY = 790 + Math.sin(p * Math.PI * 8) * 8;
      s.heroScale = 0.76; s.raftX = e; s.mountainScroll = p;
      s.rain = pulse(p, 0.49, 0.18); s.darkness = 0.46 * pulse(p, 0.66, 0.24);
      s.fog = 0.2 + 0.8 * smooth((p - 0.82) / 0.18);
      s.gateReveal = smooth((p - 0.83) / 0.17); s.cloudSpeed = 0.3;
      s.cameraPosition = [lerp(-500, 500, p), 80, 600];
      s.cameraTarget = [lerp(-500, 500, p), 80, 0];
      s.cameraFov = 50;
      break;
    case 3: // Steps and learning montage, ending in a cloud leap.
      s.cameraScale = lerp(0.96, 1.42, e); s.cameraY = lerp(30, -90, e);
      s.heroX = p < 0.75 ? 590 + 100 * e : 690 + 420 * smooth((p - 0.75) / 0.25);
      s.heroY = lerp(890, 560, e); s.heroScale = 0.57 + 0.42 * e;
      s.gateReveal = smooth(p * 3); s.fog = 0.85 * (1 - smooth((p - 0.05) / 0.66));
      s.intensity = 0.17 + 0.37 * smooth((p - 0.68) / 0.3);
      s.cloudSpeed = 0.15 + 0.8 * smooth((p - 0.75) / 0.25);
      s.flash = pulse(p, 0.78, 0.024) * 0.35;
      s.cameraPosition = [lerp(-100, 0, e), lerp(50, 160, e), lerp(700, 480, e)];
      s.cameraTarget = [0, lerp(60, 120, e), 0];
      s.cameraFov = 50;
      break;
    case 4: // First staff reveal and the brightest pre-heaven colors.
      s.palette = 'free'; s.cameraX = -160 * e; s.cameraScale = 1.08 + 0.28 * e;
      s.heroX = lerp(350, 850, e); s.heroY = 640 - 140 * Math.sin(p * Math.PI);
      s.heroScale = 1.03 + 0.25 * e; s.capeAngle = -24 - 20 * Math.sin(p * Math.PI * 2);
      s.staffVisible = smooth((p - 0.12) / 0.2);
      s.staffAngle = -70 + 410 * smooth((p - 0.44) / 0.22);
      s.staffGlow = 0.3 + 0.7 * smooth((p - 0.44) / 0.24);
      s.shockwave = smooth((p - 0.62) / 0.3); s.cloudSpeed = 0.9;
      s.intensity = 0.5 + 0.3 * e;
      s.cameraPosition = [Math.sin(p * Math.PI) * 500, 120, Math.cos(p * Math.PI) * 500];
      s.cameraTarget = [0, 80, 0];
      s.cameraFov = 50;
      break;
    case 5: // Decree flare becomes South Gate's cold gold.
      s.palette = 'heaven'; s.cameraScale = 0.94 + 0.37 * smooth((p - 0.55) / 0.45);
      s.cameraY = 65 - 105 * e; s.heroY = 875; s.heroScale = 0.8;
      s.palaceOpacity = smooth((p - 0.53) / 0.34);
      s.gateReveal = s.palaceOpacity; s.flash = pulse(p, 0.55, 0.11);
      s.fog = 0.55;
      s.cameraPosition = [0, lerp(300, 50, e), lerp(1500, 450, e)];
      s.cameraTarget = [0, 80, 0];
      s.cameraFov = 50;
      break;
    case 6: // Pulling out makes Wukong small below the officials.
      s.palette = 'faded'; s.cameraScale = lerp(1.3, 0.72, e);
      s.cameraY = lerp(-45, 90, e); s.heroScale = lerp(1.05, 0.5, e);
      s.palaceOpacity = 0.75; s.darkness = 0.15 + 0.55 * e; s.intensity = 0.16;
      s.cameraPosition = [lerp(-120, 80, e), lerp(60, 140, e), lerp(450, 850, e)];
      s.cameraTarget = [0, 70, 0];
      s.cameraFov = 50;
      break;
    case 7: // Cold corridor, warm feast beyond a widening door.
      s.palette = 'banquet'; s.cameraX = -130 * e; s.heroX = 450 + 220 * e;
      s.heroScale = 0.9; s.gateReveal = smooth((p - 0.52) / 0.36);
      s.darkness = 0.36 - 0.1 * s.gateReveal; s.intensity = 0.1;
      s.cameraPosition = [lerp(-90, 0, e), 75, lerp(680, 460, e)];
      s.cameraTarget = [0, 75, 0];
      s.cameraFov = 48;
      break;
    case 8: // Expression close-up and fruit / pill inserts.
      s.palette = 'banquet'; s.cameraScale = 1.42 + 0.42 * e;
      s.heroX = 690; s.heroY = 850; s.heroScale = 1.65;
      s.darkness = 0.24 + 0.28 * e;
      s.intensity = 0.08 + 0.45 * smooth((p - 0.78) / 0.2);
      s.flash = pulse(p, 0.86, 0.03) * 0.15;
      s.cameraPosition = [lerp(40, -20, e), 85, lerp(440, 290, e)];
      s.cameraTarget = [0, 85, 0];
      s.cameraFov = 45;
      break;
    case 9: // Wind-up, blow, airborne debris, pill transition.
      s.palette = 'banquet'; s.cameraScale = 1.3 + 0.24 * e;
      s.heroX = 640 + 160 * e; s.heroY = 750 - 65 * Math.sin(p * Math.PI);
      s.heroScale = 1.35; s.capeAngle = -25; s.staffVisible = 1;
      s.staffAngle = -80 + 620 * smooth((p - 0.24) / 0.3); s.staffGlow = 0.42;
      s.shockwave = smooth((p - 0.42) / 0.42);
      s.debris = smooth((p - 0.36) / 0.18) * (1 - 0.3 * e);
      s.shake = pulse(p, 0.5, 0.14) * 0.3;
      s.flash = pulse(p, 0.99, 0.07); s.intensity = 0.78;
      s.cameraPosition = [Math.sin(p * Math.PI * 4) * 50, lerp(80, 110, e), lerp(420, 310, e)];
      s.cameraTarget = [0, 80, 0];
      s.cameraFov = lerp(48, 56, e);
      s.cameraRoll = Math.sin(p * Math.PI * 2) * 0.05;
      break;
    case 10: // Last warm reunion.
      s.palette = 'free'; s.cameraScale = lerp(0.8, 1.3, e);
      s.cameraY = lerp(85, -25, e); s.heroY = lerp(510, 840, e);
      s.heroScale = lerp(0.7, 1.16, e); s.staffVisible = 1;
      s.staffGlow = 0.55; s.flash = pulse(p, 0.01, 0.08) * 0.7;
      s.intensity = 0.35;
      s.cameraPosition = [0, lerp(160, 80, e), lerp(750, 480, e)];
      s.cameraTarget = [0, 80, 0];
      s.cameraFov = 50;
      break;
    case 11: // Light dies as the ranks fill the sky.
      s.palette = 'storm'; s.cameraScale = 1.18; s.cameraY = -45;
      s.heroY = 875; s.heroScale = 1.25;
      s.darkness = smooth((p - 0.1) / 0.75) * 0.75;
      s.soldierReveal = smooth((p - 0.34) / 0.58);
      s.staffVisible = smooth((p - 0.74) / 0.18);
      s.staffGlow = s.staffVisible * 0.9; s.intensity = 0.2 + 0.4 * e;
      s.cameraPosition = [0, 15, 300];
      s.cameraTarget = [0, 200, -100];
      s.cameraFov = 65;
      break;
    case 12: // Held breath, white frames, first great blow.
      s.palette = 'storm'; s.cameraScale = 1.22 + 0.22 * smooth((p - 0.55) / 0.25);
      s.heroScale = 1.35; s.heroY = 860 - 40 * smooth((p - 0.52) / 0.15);
      s.capeAngle = -30; s.staffVisible = 1;
      s.staffAngle = -80 + 680 * smooth((p - 0.48) / 0.13);
      s.staffGlow = 1; s.soldierReveal = 1;
      s.soldierScatter = smooth((p - 0.58) / 0.32);
      s.shockwave = smooth((p - 0.54) / 0.4);
      s.shake = pulse(p, 0.61, 0.23); s.debris = s.soldierScatter;
      s.flash = frame === 1612 || frame === 1613 ? 1 : 0;
      s.darkness = 0.78; s.intensity = 0.9;
      s.cameraPosition = [0, lerp(40, 70, e), lerp(450, 320, e)];
      s.cameraTarget = [0, 90, 0];
      s.cameraFov = lerp(55, 60, e);
      s.cameraRoll = s.shake * 0.08;
      break;
    case 13: // Pursuit through cloud layers toward South Gate.
      s.palette = 'storm'; s.cameraX = -290 * e; s.cameraY = -100 * e;
      s.cameraScale = 1.26 + 0.3 * e; s.heroX = lerp(320, 1080, e);
      s.heroY = 780 - 240 * e; s.heroScale = 1.28;
      s.heroRotation = 12 * Math.sin(p * Math.PI * 5); s.capeAngle = -32;
      s.staffVisible = 1; s.staffAngle = -30 + 420 * p; s.staffGlow = 0.9;
      s.soldierReveal = 1; s.soldierScatter = pulse(p, 0.56, 0.42);
      s.shockwave = pulse(p, 0.55, 0.3); s.cloudSpeed = 1;
      s.palaceOpacity = smooth((p - 0.68) / 0.3);
      s.darkness = 0.6; s.intensity = 0.92;
      s.cameraPosition = [Math.sin(p * Math.PI) * 500, 120, Math.cos(p * Math.PI) * 500];
      s.cameraTarget = [0, 80, 0];
      s.cameraFov = 52;
      s.cameraRoll = Math.sin(p * Math.PI * 2) * 0.06;
      break;
    case 14: // Chains under the enormous South Gate.
      s.palette = 'punishment'; s.cameraScale = 0.73;
      s.heroScale = 0.58; s.heroY = 900; s.palaceOpacity = 0.8;
      s.soldierReveal = 1; s.darkness = 0.8;
      s.flash = pulse(p, 0.02, 0.04) * 0.3; s.intensity = 0.08;
      s.cameraPosition = [0, 240, 650];
      s.cameraTarget = [0, 60, 0];
      s.cameraFov = 48;
      break;
    case 15: // Three attacks; the eyes hold a weak ember.
      s.palette = 'punishment'; s.cameraScale = 0.85 + 0.55 * e;
      s.heroScale = 0.72 + 0.7 * e; s.heroY = 865;
      s.soldierReveal = 1; s.eyeGlow = 0.07 + 0.16 * smooth((p - 0.64) / 0.33);
      s.flash = Math.max(pulse(p, 0.13, 0.025), pulse(p, 0.43, 0.02) * 0.5,
        pulse(p, 0.72, 0.04) * 0.28);
      s.fire = smooth((p - 0.63) / 0.18) * 0.45;
      s.darkness = 0.83; s.intensity = 0.25;
      s.cameraPosition = [Math.sin(p * Math.PI * 6) * 20, lerp(100, 60, e), lerp(500, 380, e)];
      s.cameraTarget = [0, 70, 0];
      s.cameraFov = 50;
      s.cameraRoll = Math.sin(p * Math.PI * 8) * 0.04 * s.flash;
      break;
    case 16: // Furnace closes on black; one ember remains.
      s.palette = p < 0.78 ? 'black' : 'ember';
      s.heroY = 815; s.heroScale = 0.86 * (1 - e);
      s.darkness = 0.86 + 0.14 * smooth((p - 0.56) / 0.29);
      s.fire = 0.12 * smooth((p - 0.83) / 0.17); s.intensity = 0.04;
      s.cameraPosition = [0, lerp(120, 60, e), lerp(520, 240, e)];
      s.cameraTarget = [0, 60, 0];
      s.cameraFov = lerp(48, 42, e);
      break;
    case 17: // Fire traverses red, orange, gold, cyan, violet.
      s.palette = 'fire'; s.cameraX = Math.sin(p * Math.PI * 2) * 44;
      s.cameraScale = 1.12 + 0.12 * e; s.heroY = 830; s.heroScale = 1.08;
      s.fire = 0.24 + 0.76 * e; s.colorRelease = 0.18 + 0.48 * e;
      s.eyeGlow = 0.1; s.darkness = 0.85 - 0.32 * e;
      s.intensity = 0.28 + 0.43 * e;
      s.cameraPosition = [Math.sin(p * Math.PI * 2) * 30, 60 + Math.sin(p * Math.PI * 4) * 15, lerp(260, 180, e)];
      s.cameraTarget = [0, 60, 0];
      s.cameraFov = lerp(42, 38, e);
      s.cameraRoll = Math.sin(p * Math.PI * 2) * 0.03;
      break;
    case 18: // Stillness, golden eyes, cracks, returning staff.
      s.palette = 'fire';
      s.cameraScale = lerp(1.7, 1.05, smooth((p - 0.3) / 0.5));
      s.heroScale = 1.58; s.eyeGlow = smooth((p - 0.28) / 0.05);
      s.flash = pulse(p, 0.3, 0.035) * 0.85;
      s.fire = 0.62; s.colorRelease = 0.55 + 0.28 * e;
      s.staffVisible = smooth((p - 0.72) / 0.2);
      s.staffGlow = s.staffVisible;
      s.shake = 0.3 * smooth((p - 0.45) / 0.38);
      s.darkness = 0.48; s.intensity = 0.8;
      s.cameraPosition = [0, 60, lerp(180, 140, smooth((p - 0.3) / 0.5))];
      s.cameraTarget = [0, 60, 0];
      s.cameraFov = lerp(38, 35, e);
      s.cameraRoll = s.shake * 0.05;
      break;
    case 19: // Furnace shards and the staff's return.
      s.palette = 'rainbow'; s.cameraScale = 0.78 + 0.8 * smooth((p - 0.42) / 0.4);
      s.heroScale = 1.35; s.heroX = lerp(620, 720, e);
      s.eyeGlow = 1; s.fire = 1;
      s.colorRelease = smooth((p - 0.18) / 0.32);
      s.staffVisible = smooth((p - 0.57) / 0.28); s.staffGlow = s.staffVisible;
      s.debris = smooth((p - 0.39) / 0.18);
      s.shockwave = smooth((p - 0.42) / 0.5);
      s.shake = pulse(p, 0.5, 0.33); s.flash = pulse(p, 0.44, 0.055);
      s.intensity = 1;
      s.cameraPosition = [0, lerp(60, 220, e), lerp(140, 950, e)];
      s.cameraTarget = [0, 80, 0];
      s.cameraFov = lerp(35, 65, e);
      s.cameraRoll = Math.sin(p * Math.PI * 4) * 0.08 * s.shake;
      break;
    case 20: // Each strike adds a color on the way to the throne hall.
      s.palette = 'rainbow'; s.cameraX = -300 * e;
      s.cameraScale = 1.22 + 0.36 * e; s.heroX = 300 + 700 * e;
      s.heroY = 760 - 140 * Math.sin(p * Math.PI * 3); s.heroScale = 1.3;
      s.heroRotation = 9 * Math.sin(p * Math.PI * 6); s.capeAngle = -30;
      s.staffVisible = 1; s.staffAngle = -45 + 880 * p; s.staffGlow = 1;
      s.eyeGlow = 1; s.soldierReveal = 1; s.soldierScatter = 0.6;
      s.shockwave = 0.5 + 0.5 * pulse(p, 0.7, 0.32);
      s.debris = 0.7; s.shake = 0.23 + 0.2 * Math.abs(Math.sin(p * Math.PI * 6));
      s.colorRelease = 1; s.intensity = 1;
      s.cameraPosition = [Math.cos(p * Math.PI * 3) * 350, lerp(80, 250, Math.sin(p * Math.PI)), lerp(650, 420, e)];
      s.cameraTarget = [lerp(-100, 100, e), 80, 0];
      s.cameraFov = 55 + 15 * Math.sin(p * Math.PI);
      s.cameraRoll = Math.sin(p * Math.PI * 3) * 0.12;
      break;
    case 21: // Sudden stillness before the final swing.
      s.palette = 'rainbow'; s.cameraScale = 0.95 + 0.65 * e;
      s.heroY = 845; s.heroScale = 1.1 + 0.56 * e;
      s.staffVisible = 1; s.staffGlow = 1;
      s.eyeGlow = smooth((p - 0.65) / 0.3);
      s.soldierReveal = 1; s.colorRelease = 0.75; s.intensity = 0.25;
      s.cameraPosition = [lerp(-180, 0, e), lerp(40, 160, e), lerp(550, 380, e)];
      s.cameraTarget = [0, 90, 0];
      s.cameraFov = lerp(55, 62, e);
      s.cameraRoll = lerp(-0.06, 0.02, e);
      break;
    case 22: { // Burst, contraction, black, title, dying spark.
      const burst = smooth((p - 0.08) / 0.17) * (1 - smooth((p - 0.42) / 0.17));
      s.palette = p > 0.62 ? 'black' : 'rainbow';
      s.cameraScale = 1.3 + 0.2 * burst;
      s.heroScale = 1.5 * (1 - smooth((p - 0.5) / 0.13));
      s.staffVisible = 1 - smooth((p - 0.5) / 0.13);
      s.staffAngle = -60 + 690 * smooth((p - 0.09) / 0.16);
      s.staffGlow = s.staffVisible; s.eyeGlow = s.staffVisible;
      s.shockwave = burst; s.colorRelease = burst;
      s.flash = pulse(p, 0.25, 0.07); s.shake = burst * 0.6;
      s.darkness = smooth((p - 0.5) / 0.13);
      s.titleOpacity = smooth((p - 0.61) / 0.07);
      s.intensity = burst;
      s.cameraPosition = [0, lerp(100, 70, e), lerp(380, 750, smooth((p - 0.1) / 0.5))];
      s.cameraTarget = [0, 80, 0];
      s.cameraFov = lerp(60, 48, e);
      s.cameraRoll = s.shake * 0.1;
      break;
    }
  }

  s.featherAngle = Math.sin(p * Math.PI * 6 + s.heroRotation * 0.1) * 18 * (s.costumeStage === 'greatSage' ? 1 : 0);
  return s;
}
