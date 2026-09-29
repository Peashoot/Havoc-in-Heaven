import type { SceneOneState } from './timeline';

const W = 1920;
const H = 1080;

function random(seed: number): number {
  const x = Math.sin(seed * 127.1 + 8.317) * 43758.5453;
  return x - Math.floor(x);
}

function mistBank(
  ctx: CanvasRenderingContext2D,
  state: SceneOneState,
  options: { y: number; amplitude: number; depth: number; speed: number; color: string; opacity: number; seed: number; puffs: number },
) {
  const { y, amplitude, depth, speed, color, opacity, seed, puffs } = options;
  const drift = state.cloudDrift * speed;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-150, H + 100);
  ctx.lineTo(-150, y);
  for (let x = -150; x <= W + 180; x += 12) {
    const wave = Math.sin((x + drift) * 0.0055 + seed) * amplitude;
    const ripple = Math.sin((x - drift * 0.6) * 0.013 + seed * 3.7) * amplitude * 0.32;
    ctx.lineTo(x, y + wave + ripple);
  }
  ctx.lineTo(W + 180, H + 100);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < puffs; i++) {
    const x = -110 + (i / (puffs - 1)) * (W + 220) + (random(seed * 101 + i) - 0.5) * 160 + drift * (i % 2 ? 0.35 : -0.22);
    const py = y + Math.sin((x + drift) * 0.0055 + seed) * amplitude + (random(seed * 151 + i) - 0.5) * depth;
    const rx = 105 + random(seed * 211 + i) * 150;
    const ry = 42 + random(seed * 311 + i) * 77;
    const gradient = ctx.createRadialGradient(x - rx * 0.2, py - ry * 0.25, 0, x, py, rx);
    gradient.addColorStop(0, 'rgba(189,175,149,.27)');
    gradient.addColorStop(0.45, 'rgba(93,105,104,.14)');
    gradient.addColorStop(1, 'rgba(14,25,32,0)');
    ctx.save();
    ctx.translate(x, py);
    ctx.scale(1, ry / rx);
    ctx.translate(-x, -py);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, py, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function cloudVolumes(
  ctx: CanvasRenderingContext2D,
  state: SceneOneState,
  y: number,
  seed: number,
  opacity: number,
  driftSpeed: number,
  centralOpening: number,
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  for (let i = 0; i < 22; i++) {
    const x = -130 + i * 105 + (random(seed * 13 + i) - 0.5) * 95 + state.cloudDrift * driftSpeed;
    const gap = Math.exp(-Math.pow((x - 960) / 475, 2)) * centralOpening * state.reveal;
    const cy = y + gap + (random(seed * 25 + i) - 0.5) * 74;
    const rx = 145 + random(seed * 39 + i) * 132;
    const ry = 54 + random(seed * 47 + i) * 68;
    const shade = ctx.createRadialGradient(x - rx * 0.12, cy - ry * 0.56, 4, x, cy + ry * 0.1, rx * 1.05);
    shade.addColorStop(0, 'rgba(205,193,168,.82)');
    shade.addColorStop(0.3, 'rgba(141,151,143,.56)');
    shade.addColorStop(0.65, 'rgba(65,82,87,.36)');
    shade.addColorStop(1, 'rgba(15,30,40,0)');
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.ellipse(x, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawBackdrop(ctx: CanvasRenderingContext2D, state: SceneOneState) {
  ctx.clearRect(0, 0, W, H);
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#0a111c');
  sky.addColorStop(0.34, '#26313a');
  sky.addColorStop(0.57, '#786b58');
  sky.addColorStop(0.74, '#343c41');
  sky.addColorStop(1, '#0a131b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(1015, 380, 25, 1015, 380, 685);
  glow.addColorStop(0, `rgba(223,178,105,${0.29 + state.light * 0.17})`);
  glow.addColorStop(0.45, 'rgba(188,130,69,.09)');
  glow.addColorStop(1, 'rgba(188,130,69,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(1015, 377);
  for (let i = 0; i < 15; i++) {
    const angle = ((i - 7) / 14) * Math.PI * 0.82;
    ctx.rotate(angle);
    const ray = ctx.createLinearGradient(0, 0, 0, 650);
    ray.addColorStop(0, 'rgba(243,192,112,.09)');
    ray.addColorStop(1, 'rgba(243,192,112,0)');
    ctx.fillStyle = ray;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-45 - i * 2, 650);
    ctx.lineTo(45 + i * 2, 650);
    ctx.closePath();
    ctx.fill();
    ctx.rotate(-angle);
  }
  ctx.restore();

  mistBank(ctx, state, { y: 655, amplitude: 27, depth: 34, speed: 90, color: '#465157', opacity: 0.34, seed: 1.2, puffs: 16 });
  cloudVolumes(ctx, state, 690, 1.4, 0.29, 38, 50);
  mistBank(ctx, state, { y: 793, amplitude: 37, depth: 53, speed: -105, color: '#29363d', opacity: 0.43, seed: 2.9, puffs: 17 });
}

export function drawAtmosphere(ctx: CanvasRenderingContext2D, state: SceneOneState) {
  ctx.clearRect(0, 0, W, H);
  const fogOpacity = 0.33 * (1 - state.reveal);
  const fog = ctx.createRadialGradient(960, 660, 90, 960, 660, 660);
  fog.addColorStop(0, `rgba(186,174,151,${fogOpacity})`);
  fog.addColorStop(1, 'rgba(186,174,151,0)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, 100, W, 850);

  const opening = state.reveal * 120;
  mistBank(ctx, state, { y: 766 + opening * 0.36, amplitude: 42, depth: 70, speed: 160, color: '#3b474a', opacity: 0.46, seed: 3.4, puffs: 19 });
  cloudVolumes(ctx, state, 791, 3.4, 0.45, 92, 85);
  mistBank(ctx, state, { y: 856 + opening * 0.65, amplitude: 53, depth: 76, speed: -195, color: '#5b6260', opacity: 0.55, seed: 5.6, puffs: 20 });
  cloudVolumes(ctx, state, 884, 5.6, 0.63, -130, 100);
  mistBank(ctx, state, { y: 968 + opening * 0.5, amplitude: 55, depth: 100, speed: 255, color: '#17272f', opacity: 0.79, seed: 8.1, puffs: 20 });
  cloudVolumes(ctx, state, 983, 8.1, 0.38, 160, 30);

  const lowerShade = ctx.createLinearGradient(0, 855, 0, 1080);
  lowerShade.addColorStop(0, 'rgba(11,19,26,0)');
  lowerShade.addColorStop(1, 'rgba(5,11,17,.83)');
  ctx.fillStyle = lowerShade;
  ctx.fillRect(0, 855, W, 225);

  for (let i = 0; i < 75; i++) {
    const x = random(i + 42) * W;
    const y = 135 + random(i + 94) * 710;
    const phase = state.cloudDrift * (14 + random(i + 62) * 34);
    ctx.globalAlpha = (0.08 + random(i + 81) * 0.26) * state.light;
    ctx.fillStyle = '#e6bc7c';
    ctx.beginPath();
    ctx.arc(x + phase, y - phase * 0.18, 0.5 + random(i + 19) * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
