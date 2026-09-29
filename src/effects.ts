import type { FilmState } from './timeline';

const W = 1920;
const H = 1080;
const colors = ['#ffdf81', '#ea6555', '#55cabb', '#609ded', '#b779df', '#f7f2d9'];
const rand = (n: number) => {
  const v = Math.sin(n * 91.71 + 17.29) * 43758.5453;
  return v - Math.floor(v);
};

function arcTrail(ctx: CanvasRenderingContext2D, state: FilmState, palette: string[]) {
  const centers: Record<number, [number, number, number]> = {
    4: [state.heroX + 52, state.heroY - 176, 235],
    9: [state.heroX + 70, state.heroY - 210, 285],
    12: [state.heroX + 80, state.heroY - 220, 355],
    13: [state.heroX + 60, state.heroY - 200, 300],
    19: [state.heroX + 80, state.heroY - 250, 320],
    20: [state.heroX + 60, state.heroY - 230, 315],
    22: [960, 540, 480],
  };
  const config = centers[state.scene];
  if (!config || state.staffVisible <= 0) return;
  const [x, y, radius] = config;
  const phase = state.staffAngle * Math.PI / 180;
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.globalAlpha = state.staffGlow * (0.45 - i * 0.068);
    ctx.lineWidth = 15 - i * 2;
    ctx.strokeStyle = palette[i % palette.length];
    ctx.shadowColor = palette[i % palette.length];
    ctx.shadowBlur = 24 + i * 5;
    ctx.beginPath();
    ctx.arc(x, y, radius + i * 18, phase - 1.2 - i * 0.13, phase + 0.38 - i * 0.06);
    ctx.stroke();
    ctx.restore();
  }
}

function shockwave(ctx: CanvasRenderingContext2D, state: FilmState, palette: string[]) {
  if (state.shockwave <= 0) return;
  const x = state.scene === 22 ? 960 : state.heroX + 95;
  const y = state.scene === 22 ? 535 : state.heroY - 135;
  const radius = (state.scene === 22 ? 1370 : 980) * state.shockwave;
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.globalAlpha = (1 - state.shockwave * 0.73) * (0.72 - i * 0.18);
    ctx.strokeStyle = palette[i % palette.length];
    ctx.lineWidth = 7 + i * 20;
    ctx.shadowColor = palette[i % palette.length];
    ctx.shadowBlur = 26;
    ctx.beginPath();
    ctx.ellipse(x, y, radius + i * 28, (radius + i * 28) * 0.63, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function shards(ctx: CanvasRenderingContext2D, state: FilmState, palette: string[]) {
  if (state.debris <= 0) return;
  const amount = state.scene === 19 || state.scene === 20 ? 180 : 100;
  const x0 = state.scene === 19 ? 960 : state.heroX + 70;
  const y0 = state.scene === 19 ? 560 : state.heroY - 150;
  for (let i = 0; i < amount; i++) {
    const angle = rand(i + 82) * Math.PI * 2;
    const travel = (70 + rand(i + 21) * 760) * state.debris;
    const x = x0 + Math.cos(angle) * travel;
    const y = y0 + Math.sin(angle) * travel * 0.7 + state.debris * 85;
    if (x < -50 || x > W + 50 || y < -50 || y > H + 50) continue;
    const size = 2 + rand(i + 46) * (state.scene === 19 ? 18 : 9);
    ctx.save();ctx.translate(x, y);ctx.rotate(angle + state.debris * 4);
    ctx.globalAlpha = (0.22 + rand(i + 71) * 0.65) * state.debris;
    ctx.fillStyle = i % 3 === 0 ? palette[i % palette.length] : '#9d8c77';
    ctx.beginPath();ctx.moveTo(-size, -size);ctx.lineTo(size * 1.5, -size * 0.5);
    ctx.lineTo(size * 0.7, size);ctx.lineTo(-size, size * 0.6);ctx.closePath();ctx.fill();
    ctx.restore();
  }
}

function colorBurst(ctx: CanvasRenderingContext2D, state: FilmState) {
  if (state.colorRelease <= 0) return;
  const active = state.scene === 20 ? [colors[Math.min(4, Math.floor(state.progress * 5))]] : colors;
  const originX = state.scene === 22 ? 960 : 925;
  const originY = state.scene === 22 ? 535 : 550;
  for (let i = 0; i < 70; i++) {
    const angle = i * 2.39996 + state.frame * 0.004;
    const r = (65 + i * 13.6) * state.colorRelease;
    const x = originX + Math.cos(angle) * r;
    const y = originY + Math.sin(angle) * r * 0.67;
    ctx.strokeStyle = active[i % active.length];
    ctx.globalAlpha = state.colorRelease * (0.28 + rand(i + 29) * 0.37);
    ctx.lineWidth = 3 + rand(i + 5) * 10;
    ctx.beginPath();ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * (35 + state.colorRelease * 95), y + Math.sin(angle) * (35 + state.colorRelease * 95));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function drawEffects(ctx: CanvasRenderingContext2D, state: FilmState) {
  ctx.clearRect(0, 0, W, H);
  const palette = state.scene === 20 ? [colors[Math.min(4, Math.floor(state.progress * 5))]]
    : state.scene >= 19 ? colors : state.scene === 4 ? ['#ffdf81', '#94cf9f', '#f7c363'] : ['#f4cc76', '#d8964a', '#fff0b5'];
  arcTrail(ctx, state, palette);
  shockwave(ctx, state, palette);
  shards(ctx, state, palette);
  if (state.scene >= 17) colorBurst(ctx, state);

  if (state.scene === 22 && state.progress > 0.5 && state.progress < 0.62) {
    const collapse = (state.progress - 0.5) / 0.12;
    const radius = 48 * (1 - collapse) + 2;
    ctx.fillStyle = '#ffe1a0';ctx.shadowColor = '#ffe19c';ctx.shadowBlur = 50 * (1 - collapse);
    ctx.beginPath();ctx.arc(960, 535, radius, 0, Math.PI * 2);ctx.fill();ctx.shadowBlur = 0;
  }
  if (state.scene === 22 && state.progress > 0.92) {
    const lift = (state.progress - 0.92) / 0.08;
    ctx.globalAlpha = 1 - lift;ctx.fillStyle = '#ffd787';ctx.shadowColor = '#ffc45e';ctx.shadowBlur = 20;
    ctx.beginPath();ctx.arc(1380 + lift * 70, 766 - lift * 250, 4 - lift * 2, 0, Math.PI * 2);ctx.fill();
    ctx.globalAlpha = 1;ctx.shadowBlur = 0;
  }
  if (state.scene === 22 && state.progress > 0.64) {
    const fade = Math.max(0, 1 - (state.progress - 0.64) / 0.34);
    for (let i = 0; i < 42; i++) {
      const x = 460 + rand(i + 324) * 1000;
      const y = 247 + rand(i + 623) * 250 - (state.progress - 0.64) * (70 + rand(i + 92) * 160);
      ctx.globalAlpha = fade * (0.18 + rand(i + 442) * 0.5);
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();ctx.arc(x, y, 1 + rand(i + 523) * 2.5, 0, Math.PI * 2);ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
