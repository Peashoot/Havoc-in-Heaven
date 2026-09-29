import type { FilmState } from './timeline';

const W = 1920;
const H = 1080;
const colors = ['#ffdf81', '#ea6555', '#55cabb', '#609ded', '#b779df', '#f7f2d9'];

const rand = (n: number) => {
  const v = Math.sin(n * 91.71 + 17.29) * 43758.5453;
  return v - Math.floor(v);
};

/**
 * Step 1: 升级金箍棒半月弧光斩痕 (Golden Crescent Motion Arc Trails)
 * Uses Bezier curves to render heavy, radiant golden crescent motion trails with dynamic luminous gradients.
 */
export function goldenCrescentTrails(ctx: CanvasRenderingContext2D, state: FilmState, palette: string[]) {
  if (state.staffVisible <= 0 || state.staffGlow <= 0) return;

  const centers: Record<number, [number, number, number]> = {
    4: [state.heroX + 52, state.heroY - 176, 235],
    9: [state.heroX + 70, state.heroY - 210, 285],
    12: [state.heroX + 80, state.heroY - 220, 360],
    13: [state.heroX + 60, state.heroY - 200, 320],
    19: [state.heroX + 80, state.heroY - 250, 340],
    20: [state.heroX + 60, state.heroY - 230, 330],
    22: [960, 540, 480],
  };

  const [cx, cy, baseRadius] = centers[state.scene] || [state.heroX + 70, state.heroY - 200, 310];
  const phase = (state.staffAngle * Math.PI) / 180;
  const glow = state.staffGlow;

  // Arc span: head leads the motion strike, tail sweeps behind
  const headAngle = phase + 0.38;
  const tailAngle = phase - 1.85;

  // Pass 1: Broad heavy golden-ink motion wake (厚重墨金流光月牙弧)
  {
    ctx.save();
    ctx.globalAlpha = Math.min(1, glow * 0.72);
    const rOuter = baseRadius + 45;
    const rInner = baseRadius - 26;

    const xHead = cx + Math.cos(headAngle) * baseRadius;
    const yHead = cy + Math.sin(headAngle) * baseRadius;
    const xTail = cx + Math.cos(tailAngle) * (baseRadius - 12);
    const yTail = cy + Math.sin(tailAngle) * (baseRadius - 12);

    const midAngle = (headAngle + tailAngle) * 0.5;
    const cpOuterX = cx + Math.cos(midAngle) * (rOuter * 1.34);
    const cpOuterY = cy + Math.sin(midAngle) * (rOuter * 1.34);
    const cpInnerX = cx + Math.cos(midAngle) * (rInner * 0.76);
    const cpInnerY = cy + Math.sin(midAngle) * (rInner * 0.76);

    const grad = ctx.createLinearGradient(xTail, yTail, xHead, yHead);
    grad.addColorStop(0, 'rgba(215, 60, 20, 0)');
    grad.addColorStop(0.35, 'rgba(245, 140, 30, 0.42)');
    grad.addColorStop(0.75, 'rgba(255, 215, 65, 0.78)');
    grad.addColorStop(1, 'rgba(255, 250, 220, 0.95)');

    ctx.fillStyle = grad;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 36 * glow;

    ctx.beginPath();
    ctx.moveTo(xHead, yHead);
    ctx.quadraticCurveTo(cpOuterX, cpOuterY, xTail, yTail);
    ctx.quadraticCurveTo(cpInnerX, cpInnerY, xHead, yHead);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Pass 2: Razor-gold crescent blade core (半月弧光斩痕金刃主体)
  {
    ctx.save();
    ctx.globalAlpha = Math.min(1, glow * 0.95);
    const rBladeOut = baseRadius + 18;
    const rBladeIn = baseRadius - 14;

    const headLead = phase + 0.44;
    const tailShort = phase - 1.45;

    const xH = cx + Math.cos(headLead) * baseRadius;
    const yH = cy + Math.sin(headLead) * baseRadius;
    const xT = cx + Math.cos(tailShort) * baseRadius;
    const yT = cy + Math.sin(tailShort) * baseRadius;

    const midAngle2 = (headLead + tailShort) * 0.5;
    const cpBOutX = cx + Math.cos(midAngle2) * (rBladeOut * 1.22);
    const cpBOutY = cy + Math.sin(midAngle2) * (rBladeOut * 1.22);
    const cpBInX = cx + Math.cos(midAngle2) * (rBladeIn * 0.86);
    const cpBInY = cy + Math.sin(midAngle2) * (rBladeIn * 0.86);

    const bladeGrad = ctx.createLinearGradient(xT, yT, xH, yH);
    bladeGrad.addColorStop(0, 'rgba(255, 180, 50, 0)');
    bladeGrad.addColorStop(0.4, 'rgba(255, 225, 90, 0.8)');
    bladeGrad.addColorStop(1, 'rgba(255, 255, 255, 1)');

    ctx.fillStyle = bladeGrad;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 48 * glow;

    ctx.beginPath();
    ctx.moveTo(xH, yH);
    ctx.quadraticCurveTo(cpBOutX, cpBOutY, xT, yT);
    ctx.quadraticCurveTo(cpBInX, cpBInY, xH, yH);
    ctx.closePath();
    ctx.fill();

    // Central radiant spine stroke
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4.5 * glow;
    ctx.beginPath();
    ctx.moveTo(xT, yT);
    ctx.quadraticCurveTo(
      cx + Math.cos(midAngle2) * (baseRadius * 1.05),
      cy + Math.sin(midAngle2) * (baseRadius * 1.05),
      xH,
      yH
    );
    ctx.stroke();
    ctx.restore();
  }

  // Pass 3: Multi-layered staggered motion echoes (极具打击感的层叠斩影)
  for (let i = 0; i < 4; i++) {
    const lag = (i + 1) * 0.22;
    const layerAlpha = glow * (0.42 - i * 0.08);
    if (layerAlpha <= 0) continue;

    ctx.save();
    ctx.globalAlpha = layerAlpha;
    ctx.strokeStyle = palette[i % palette.length];
    ctx.shadowColor = palette[i % palette.length];
    ctx.shadowBlur = 20 + i * 8;
    ctx.lineWidth = 14 - i * 3;

    const startA = headAngle - lag * 0.5;
    const endA = tailAngle - lag;

    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius + i * 16, endA, startA);
    ctx.stroke();
    ctx.restore();
  }

  // Pass 4: Tangential golden sparks & light flakes along the cutting arc (挥击飞溅金屑流光)
  const sparkCount = 14;
  for (let i = 0; i < sparkCount; i++) {
    const frac = rand(i + 17);
    const sparkAngle = tailAngle + frac * (headAngle - tailAngle);
    const rSpark = baseRadius + (rand(i + 43) - 0.45) * 55;
    const sx = cx + Math.cos(sparkAngle) * rSpark;
    const sy = cy + Math.sin(sparkAngle) * rSpark;

    // Tangential direction of the staff swing
    const tangAngle = sparkAngle + Math.PI * 0.5;
    const sparkLen = 12 + rand(i + 89) * 32 * glow;

    ctx.save();
    ctx.globalAlpha = (0.35 + rand(i + 61) * 0.65) * glow;
    ctx.strokeStyle = i % 3 === 0 ? '#ffffff' : '#ffd043';
    ctx.lineWidth = 2 + rand(i + 95) * 2.5;
    ctx.shadowColor = '#ffb300';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(tangAngle) * sparkLen, sy + Math.sin(tangAngle) * sparkLen);
    ctx.stroke();

    // Hot golden ember
    ctx.fillStyle = '#fffdf0';
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5 + rand(i + 12) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Step 2: 升级第一棒与大闹天宫冲击波 (Shockwaves)
 * Expanding golden ink-wave shockwaves with flying sparks and flash impact.
 */
export function expandingShockwave(ctx: CanvasRenderingContext2D, state: FilmState, palette: string[]) {
  if (state.shockwave <= 0) return;

  const originX = state.scene === 22
    ? 960
    : state.scene === 19
      ? 960
      : state.scene === 12
        ? state.heroX + 170
        : state.heroX + 95;
  const originY = state.scene === 22
    ? 540
    : state.scene === 19
      ? 560
      : state.scene === 12
        ? state.heroY - 60
        : state.heroY - 135;

  const maxRadius = state.scene === 22 ? 1420 : state.scene === 12 ? 1220 : 1000;
  const currentRadius = maxRadius * state.shockwave;
  const sw = state.shockwave;

  // Layer 1: Radiant expanding ground-zero blast disc (墨晕冲击波盘)
  ctx.save();
  const discAlpha = (1 - sw) * 0.45;
  const blastGrad = ctx.createRadialGradient(
    originX, originY, Math.max(1, currentRadius * 0.05),
    originX, originY, Math.max(2, currentRadius * 0.75)
  );
  blastGrad.addColorStop(0, `rgba(255, 250, 220, ${discAlpha * 0.8})`);
  blastGrad.addColorStop(0.4, `rgba(255, 185, 45, ${discAlpha * 0.5})`);
  blastGrad.addColorStop(0.85, `rgba(220, 75, 25, ${discAlpha * 0.2})`);
  blastGrad.addColorStop(1, 'rgba(180, 40, 10, 0)');

  ctx.fillStyle = blastGrad;
  ctx.beginPath();
  ctx.ellipse(originX, originY, currentRadius * 0.75, currentRadius * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Layer 2: Expanding concentric golden ink-wave shockwave rings (金色环状墨浪)
  const ringCount = 4;
  for (let i = 0; i < ringCount; i++) {
    ctx.save();
    const ringRadius = currentRadius + i * 36;
    const ringAlpha = (1 - sw * 0.78) * (0.88 - i * 0.18);
    if (ringAlpha <= 0) {
      ctx.restore();
      continue;
    }

    ctx.globalAlpha = Math.max(0, ringAlpha);
    ctx.strokeStyle = palette[i % palette.length];
    ctx.shadowColor = palette[i % palette.length];
    ctx.shadowBlur = 28 + i * 8;
    ctx.lineWidth = (12 - i * 2) * (1 - sw * 0.4);

    // Dynamic undulating ink-contour (环状墨韵波纹)
    ctx.beginPath();
    const segments = 36;
    for (let s = 0; s <= segments; s++) {
      const angle = (s / segments) * Math.PI * 2;
      const ripple = 1 + 0.032 * Math.sin(angle * 8 + i * 1.6 + state.frame * 0.15);
      const rx = ringRadius * ripple;
      const ry = rx * 0.62;
      const px = originX + Math.cos(angle) * rx;
      const py = originY + Math.sin(angle) * ry;
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    // Inner bright razor crest
    if (i === 0) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5 * (1 - sw * 0.5);
      ctx.shadowColor = '#fff5b0';
      ctx.shadowBlur = 18;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Layer 3: Flying golden sparks and fragments (飞溅的金屑火花)
  const sparkTotal = state.scene === 12 || state.scene === 22 ? 55 : 35;
  for (let i = 0; i < sparkTotal; i++) {
    const angle = rand(i + 131) * Math.PI * 2;
    const speedFrac = 0.35 + rand(i + 67) * 0.85;
    const travel = currentRadius * speedFrac;
    const px = originX + Math.cos(angle) * travel;
    const py = originY + Math.sin(angle) * travel * 0.62;

    if (px < -60 || px > W + 60 || py < -60 || py > H + 60) continue;

    const sparkLife = Math.max(0, 1 - sw * 0.9);
    const sparkSize = (2 + rand(i + 88) * 4) * sparkLife;
    const sparkLen = (14 + rand(i + 42) * 28) * sparkLife;

    ctx.save();
    ctx.globalAlpha = (0.4 + rand(i + 204) * 0.6) * sparkLife;
    ctx.strokeStyle = i % 2 === 0 ? '#fff3a8' : '#ff9800';
    ctx.fillStyle = i % 3 === 0 ? '#ffffff' : '#ffd043';
    ctx.shadowColor = '#ff9800';
    ctx.shadowBlur = 14;

    // Spark streak pointing outward from epicenter
    ctx.lineWidth = 1.5 + rand(i + 5) * 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px - Math.cos(angle) * sparkLen, py - Math.sin(angle) * sparkLen * 0.62);
    ctx.stroke();

    // Spark head
    ctx.beginPath();
    ctx.arc(px, py, Math.max(0.5, sparkSize), 0, Math.PI * 2);
    ctx.fill();
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
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + state.debris * 4);
    ctx.globalAlpha = (0.22 + rand(i + 71) * 0.65) * state.debris;
    ctx.fillStyle = i % 3 === 0 ? palette[i % palette.length] : '#9d8c77';
    ctx.beginPath();
    ctx.moveTo(-size, -size);
    ctx.lineTo(size * 1.5, -size * 0.5);
    ctx.lineTo(size * 0.7, size);
    ctx.lineTo(-size, size * 0.6);
    ctx.closePath();
    ctx.fill();
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
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * (35 + state.colorRelease * 95), y + Math.sin(angle) * (35 + state.colorRelease * 95));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/**
 * Anime Speedlines / Focus Impact Lines (动漫高能冲击速度线与焦点线)
 */
export function drawAnimeSpeedlines(ctx: CanvasRenderingContext2D, state: FilmState) {
  if (!state.speedlines || state.speedlines <= 0.02) return;
  const intensity = Math.min(1, state.speedlines);
  const cx = state.heroX + 40;
  const cy = state.heroY - 180;
  const numLines = 54;

  ctx.save();
  ctx.globalAlpha = intensity * 0.72;
  ctx.strokeStyle = '#fff8db';
  ctx.shadowColor = '#f39c12';
  ctx.shadowBlur = 10 * intensity;

  for (let i = 0; i < numLines; i++) {
    const baseAngle = (i / numLines) * Math.PI * 2;
    const angle = baseAngle + (rand(i * 17 + state.frame) - 0.5) * 0.06;
    const innerRadius = 240 + rand(i * 31 + state.frame) * 220;
    const outerRadius = 1450;

    const x1 = cx + Math.cos(angle) * innerRadius;
    const y1 = cy + Math.sin(angle) * innerRadius;
    const x2 = cx + Math.cos(angle) * outerRadius;
    const y2 = cy + Math.sin(angle) * outerRadius;

    ctx.lineWidth = 1 + rand(i * 43) * 4 * intensity;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Cinematic Foreground Flying Debris (擦着镜头边缘掠过的大型碎石残片)
 */
function foregroundDebris(ctx: CanvasRenderingContext2D, state: FilmState) {
  if (state.debris <= 0 && state.shockwave <= 0) return;
  const factor = Math.max(state.debris, state.shockwave);
  if (factor <= 0.05) return;

  const count = state.scene === 12 || state.scene === 19 || state.scene === 20 ? 8 : 4;
  for (let i = 0; i < count; i++) {
    const seed = i * 47 + state.scene * 13;
    const speed = 1.6 + rand(seed) * 1.8;
    const prog = (state.progress * speed + rand(seed + 1)) % 1;
    const angle = rand(seed + 2) * Math.PI * 2;
    const dist = 280 + prog * 980;

    const x = state.heroX + Math.cos(angle) * dist;
    const y = state.heroY + Math.sin(angle) * dist * 0.58;
    const size = 26 + rand(seed + 3) * 42;

    ctx.save();
    ctx.globalAlpha = Math.min(0.85, (1 - prog) * 1.2);
    ctx.fillStyle = i % 2 === 0 ? '#1b2326' : '#2d1e1c';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 16;

    ctx.translate(x, y);
    ctx.rotate(prog * Math.PI * 4);
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, -size * 0.4);
    ctx.lineTo(size * 0.8, -size * 0.5);
    ctx.lineTo(size * 0.6, size * 0.7);
    ctx.lineTo(-size * 0.5, size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

export function drawEffects(ctx: CanvasRenderingContext2D, state: FilmState) {
  ctx.clearRect(0, 0, W, H);

  // Step 2 requirement: 在第 1612、1613 帧触发纯白定格 (Pure white freeze frame)
  if (state.frame === 1612 || state.frame === 1613) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    return;
  }

  const palette = state.scene === 20
    ? [colors[Math.min(4, Math.floor(state.progress * 5))]]
    : state.scene >= 19
      ? colors
      : state.scene === 4
        ? ['#ffdf81', '#94cf9f', '#f7c363']
        : ['#f4cc76', '#d8964a', '#fff0b5'];

  drawAnimeSpeedlines(ctx, state);
  goldenCrescentTrails(ctx, state, palette);
  expandingShockwave(ctx, state, palette);
  shards(ctx, state, palette);
  foregroundDebris(ctx, state);
  if (state.scene >= 17) colorBurst(ctx, state);

  if (state.scene === 22 && state.progress > 0.5 && state.progress < 0.62) {
    const collapse = (state.progress - 0.5) / 0.12;
    const radius = 48 * (1 - collapse) + 2;
    ctx.fillStyle = '#ffe1a0';
    ctx.shadowColor = '#ffe19c';
    ctx.shadowBlur = 50 * (1 - collapse);
    ctx.beginPath();
    ctx.arc(960, 535, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  if (state.scene === 22 && state.progress > 0.92) {
    const lift = (state.progress - 0.92) / 0.08;
    ctx.globalAlpha = 1 - lift;
    ctx.fillStyle = '#ffd787';
    ctx.shadowColor = '#ffc45e';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(1380 + lift * 70, 766 - lift * 250, 4 - lift * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
  if (state.scene === 22 && state.progress > 0.64) {
    const fade = Math.max(0, 1 - (state.progress - 0.64) / 0.34);
    for (let i = 0; i < 42; i++) {
      const x = 460 + rand(i + 324) * 1000;
      const y = 247 + rand(i + 623) * 250 - (state.progress - 0.64) * (70 + rand(i + 92) * 160);
      ctx.globalAlpha = fade * (0.18 + rand(i + 442) * 0.5);
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, 1 + rand(i + 523) * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
