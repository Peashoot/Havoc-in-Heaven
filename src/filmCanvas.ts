import type { FilmState } from './timeline';

const W = 1920;
const H = 1080;

const rand = (n: number) => {
  const v = Math.sin(n * 73.817 + 11.13) * 43758.5453;
  return v - Math.floor(v);
};

// Five sacred traditional colors: 暗红, 赤橙, 金黄, 青绿, 紫蓝
export const FIVE_COLORS = [
  { name: '暗红', main: '#c92a2a', glow: '#ff6b6b', rgba: '201, 42, 42' },
  { name: '赤橙', main: '#f76707', glow: '#ffa94d', rgba: '247, 103, 7' },
  { name: '金黄', main: '#fab005', glow: '#ffe066', rgba: '250, 176, 5' },
  { name: '青绿', main: '#12b886', glow: '#63e6be', rgba: '18, 184, 134' },
  { name: '紫蓝', main: '#4263eb', glow: '#91a7ff', rgba: '66, 99, 235' },
] as const;

function fogLayer(ctx: CanvasRenderingContext2D, y: number, drift: number, opacity: number, tint = '220,230,218') {
  ctx.save();
  ctx.globalAlpha = opacity;
  for (let i = 0; i < 15; i++) {
    const x = -150 + i * 153 + Math.sin(i * 8.7 + drift) * 62;
    const cy = y + Math.sin(i * 1.7 + drift * 0.7) * 36;
    const rx = 170 + rand(i + 8) * 130;
    const grad = ctx.createRadialGradient(x, cy - 16, 5, x, cy, rx);
    grad.addColorStop(0, `rgba(${tint},.65)`);
    grad.addColorStop(0.55, `rgba(${tint},.28)`);
    grad.addColorStop(1, `rgba(${tint},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, cy, rx, 62 + rand(i + 41) * 36, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function waves(ctx: CanvasRenderingContext2D, state: FilmState) {
  ctx.save();
  ctx.globalAlpha = 1 - state.gateReveal;
  const phase = state.frame * 0.034;
  for (let band = 0; band < 7; band++) {
    const y = 737 + band * 48;
    ctx.strokeStyle = band % 2 ? 'rgba(221,235,220,.37)' : 'rgba(173,217,206,.43)';
    ctx.lineWidth = 3 + band * 0.8;
    ctx.beginPath();
    for (let x = -20; x <= W + 20; x += 16) {
      const yy = y + Math.sin(x * 0.012 + phase + band * 1.7) * (10 + band * 2.2);
      if (x === -20) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  for (let i = 0; i < 25; i++) {
    const x = (i * 151 + state.frame * (i % 2 ? 1.2 : -0.8)) % 2050 - 70;
    const y = 758 + (i % 5) * 57;
    ctx.strokeStyle = 'rgba(239,246,230,.48)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 12 + i % 4 * 7, Math.PI * 1.03, Math.PI * 1.8);
    ctx.stroke();
  }
  ctx.restore();
}

function rain(ctx: CanvasRenderingContext2D, state: FilmState) {
  if (state.rain <= 0) return;
  ctx.save();
  ctx.globalAlpha = state.rain * 0.73;
  ctx.strokeStyle = '#d7e6e2';
  ctx.lineWidth = 2;
  for (let i = 0; i < 170; i++) {
    const x = (rand(i + 7) * W + state.frame * 11) % W;
    const y = (rand(i + 31) * H + state.frame * 29) % H;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 15, y + 55);
    ctx.stroke();
  }
  ctx.restore();
}

function particles(ctx: CanvasRenderingContext2D, state: FilmState, palette: readonly string[] | string[], count: number, speed: number, alpha = 0.7) {
  for (let i = 0; i < count; i++) {
    const x = (rand(i + 212) * W + state.frame * speed * (i % 2 ? 1 : -0.6) + W * 6) % W;
    const y = (rand(i + 533) * H - state.frame * speed * 0.34 + H * 6) % H;
    const size = 1.5 + rand(i + 837) * 4;
    ctx.globalAlpha = alpha * (0.4 + rand(i + 99) * 0.6);
    ctx.fillStyle = palette[i % palette.length];
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/**
 * Step 3: 升级三昧真火与炉火粒子 (Multi-tiered Samadhi Fire & Swirling Vortex Embers)
 * True Taoist Samadhi Fire with three tiers: Ruler Fire (君火), Minister Fire (臣火), Emissary Fire (使火).
 */
export function samadhiFire(ctx: CanvasRenderingContext2D, state: FilmState) {
  if (state.fire <= 0) return;

  const hearthX = 960;
  const hearthY = 960;
  const fireIntensity = state.fire;

  // 1. Alchemical Hearth Glow (八卦炉膛心火底晕)
  ctx.save();
  const hearthGrad = ctx.createRadialGradient(
    hearthX, hearthY, 20,
    hearthX, hearthY, 520 * fireIntensity
  );
  hearthGrad.addColorStop(0, `rgba(255, 245, 205, ${0.72 * fireIntensity})`);
  hearthGrad.addColorStop(0.4, `rgba(247, 103, 7, ${0.48 * fireIntensity})`);
  hearthGrad.addColorStop(0.78, `rgba(180, 20, 20, ${0.22 * fireIntensity})`);
  hearthGrad.addColorStop(1, 'rgba(100, 10, 10, 0)');

  ctx.fillStyle = hearthGrad;
  ctx.beginPath();
  ctx.ellipse(hearthX, hearthY, 680 * fireIntensity, 340 * fireIntensity, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Tier 1: Outer Billowing Dark Red Emissary Fire (暗红使火)
  const darkColors = ['#4a0d11', '#6b141a', '#941b23', '#781216'];
  const darkTongueCount = 20;
  for (let i = 0; i < darkTongueCount; i++) {
    const bx = 320 + i * 68 + Math.sin(state.frame * 0.05 + i * 1.5) * 32;
    const reach = (240 + rand(i + 19) * 440) * fireIntensity;
    const tipY = 1080 - reach * (0.65 + Math.sin(state.frame * 0.08 + i * 1.3) * 0.18);
    const curl = Math.sin(state.frame * 0.07 + i * 1.6) * 55;
    const w = 48 + rand(i + 47) * 36;

    ctx.save();
    ctx.fillStyle = darkColors[i % darkColors.length];
    ctx.globalAlpha = fireIntensity * (0.24 + rand(i + 63) * 0.28);
    ctx.beginPath();
    ctx.moveTo(bx - w, 1080);
    ctx.bezierCurveTo(bx - w * 1.3, tipY + 220, bx + curl - 20, tipY + 80, bx + curl, tipY);
    ctx.bezierCurveTo(bx + curl + 20, tipY + 90, bx + w * 1.3, tipY + 220, bx + w, 1080);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 3. Tier 2: Mid-layer Licking Cinnabar & Solar Orange Minister Fire (赤橙臣火)
  const solarColors = ['#c92a2a', '#e03131', '#f76707', '#fd7e14', '#ffa94d'];
  const midTongueCount = 26;
  for (let i = 0; i < midTongueCount; i++) {
    const bx = 420 + i * 44 + Math.sin(state.frame * 0.08 + i * 1.8) * 26;
    const reach = (180 + rand(i + 52) * 520) * fireIntensity;
    const tipY = 1080 - reach * (0.72 + Math.sin(state.frame * 0.11 + i * 1.1) * 0.2);
    const curl = Math.sin(state.frame * 0.09 + i * 2.1) * 42;
    const w = 32 + rand(i + 81) * 24;

    ctx.save();
    ctx.fillStyle = solarColors[i % solarColors.length];
    ctx.globalAlpha = fireIntensity * (0.35 + rand(i + 94) * 0.35);
    ctx.shadowColor = '#f76707';
    ctx.shadowBlur = 16 * fireIntensity;

    ctx.beginPath();
    ctx.moveTo(bx - w, 1080);
    ctx.bezierCurveTo(bx - w * 1.2, tipY + 160, bx + curl - 15, tipY + 60, bx + curl, tipY);
    ctx.bezierCurveTo(bx + curl + 15, tipY + 70, bx + w * 1.2, tipY + 160, bx + w, 1080);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 4. Tier 3: Core White-Gold Sovereign Fire (金黄君火)
  const coreColors = ['#fab005', '#ffd43b', '#fff3bf', '#ffffff'];
  const coreTongueCount = 14;
  for (let i = 0; i < coreTongueCount; i++) {
    const bx = 740 + i * 32 + Math.sin(state.frame * 0.12 + i * 2.4) * 22;
    const reach = (260 + rand(i + 113) * 580) * fireIntensity;
    const tipY = 1080 - reach * (0.8 + Math.sin(state.frame * 0.14 + i * 1.5) * 0.15);
    const curl = Math.sin(state.frame * 0.12 + i * 2.7) * 30;
    const w = 22 + rand(i + 137) * 16;

    ctx.save();
    ctx.fillStyle = coreColors[i % coreColors.length];
    ctx.globalAlpha = fireIntensity * (0.55 + rand(i + 162) * 0.4);
    ctx.shadowColor = '#ffd43b';
    ctx.shadowBlur = 32 * fireIntensity;

    ctx.beginPath();
    ctx.moveTo(bx - w, 1080);
    ctx.bezierCurveTo(bx - w * 1.1, tipY + 120, bx + curl - 10, tipY + 40, bx + curl, tipY);
    ctx.bezierCurveTo(bx + curl + 10, tipY + 50, bx + w * 1.1, tipY + 120, bx + w, 1080);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 5. Upgraded Swirling Vortex Embers (升腾旋流炉火粒子)
  const emberCount = 85;
  for (let i = 0; i < emberCount; i++) {
    const progressY = ((state.frame * 4.2 + rand(i + 201) * 1000) % 1000) / 1000;
    const py = 1080 - progressY * 960 * fireIntensity;

    // Helical swirling convection column
    const swirlAngle = state.frame * 0.05 + rand(i + 317) * Math.PI * 2;
    const swirlRadius = (35 + rand(i + 421) * 360) * (0.32 + progressY * 0.88);
    const px = hearthX + Math.cos(swirlAngle) * swirlRadius + Math.sin(state.frame * 0.03 + i) * 30;

    if (px < -40 || px > W + 40 || py < -40 || py > H + 40) continue;

    const emberSize = (1.5 + rand(i + 509) * 3.5) * (1 - progressY * 0.45);
    const emberAlpha = fireIntensity * (1 - progressY * 0.75) * (0.45 + rand(i + 613) * 0.55);

    // Color gradient cooling with height: white-gold -> orange -> crimson
    const emberColor = progressY < 0.35
      ? (i % 2 === 0 ? '#fff5c0' : '#ffd43b')
      : progressY < 0.72
        ? '#f76707'
        : '#c92a2a';

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, emberAlpha));
    ctx.fillStyle = emberColor;
    ctx.shadowColor = '#f76707';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(0.8, emberSize), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Step 3: 升级五彩霞光流体 (Five-Color Rainbow Fluid Ribbons)
 * Surging rivers of divine light in 5 authentic sacred colors (暗红, 赤橙, 金黄, 青绿, 紫蓝).
 */
export function fiveColorFluidRibbons(ctx: CanvasRenderingContext2D, state: FilmState) {
  if (state.colorRelease <= 0) return;

  const cr = state.colorRelease;

  // Mode A: Scene 19 (八卦炉破炉爆发 - 如江河奔涌般向外倾泻)
  if (state.scene === 19) {
    const originX = 960;
    const originY = 560;
    const armCount = 18;

    for (let i = 0; i < armCount; i++) {
      const col = FIVE_COLORS[i % FIVE_COLORS.length];
      const baseAngle = (i / armCount) * Math.PI * 2 + state.frame * 0.015;
      const swirlDir = i % 2 === 0 ? 1 : -1;

      const r1 = 180 * cr;
      const r2 = 650 * cr;
      const r3 = 1350 * cr;

      const cp1X = originX + Math.cos(baseAngle + swirlDir * 0.42) * r1;
      const cp1Y = originY + Math.sin(baseAngle + swirlDir * 0.42) * r1 * 0.75;
      const cp2X = originX + Math.cos(baseAngle + swirlDir * 0.95) * r2;
      const cp2Y = originY + Math.sin(baseAngle + swirlDir * 0.95) * r2 * 0.82;
      const endX = originX + Math.cos(baseAngle + swirlDir * 1.55) * r3;
      const endY = originY + Math.sin(baseAngle + swirlDir * 1.55) * r3 * 0.85;

      ctx.save();
      ctx.globalAlpha = Math.min(1, cr * (0.42 + rand(i + 31) * 0.45));
      ctx.strokeStyle = col.main;
      ctx.shadowColor = col.glow;
      ctx.shadowBlur = 32 * cr;
      ctx.lineWidth = (16 + rand(i + 77) * 22) * cr;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.stroke();

      // Inner brilliant thread
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5 * cr;
      ctx.stroke();
      ctx.restore();
    }
  }

  // Mode B: Scenes 17, 18, 20, 21, 22 (五彩霞光流体 - 漫天飞舞与江河奔涌)
  const ribbonCount = state.scene >= 20 ? 12 : 8;
  for (let j = 0; j < ribbonCount; j++) {
    const col = FIVE_COLORS[j % FIVE_COLORS.length];
    const wavePhase = state.frame * 0.038 + j * 0.85;
    const startY = 160 + j * 82 + Math.sin(wavePhase) * 55;
    const endY = startY + Math.cos(wavePhase * 0.7) * 110;

    const cp1X = 520 + Math.sin(wavePhase * 1.2) * 90;
    const cp1Y = startY + Math.sin(wavePhase + 1.2) * 130;
    const cp2X = 1380 + Math.cos(wavePhase * 1.1) * 90;
    const cp2Y = endY - Math.sin(wavePhase + 2.1) * 130;

    ctx.save();
    ctx.globalAlpha = Math.min(1, cr * (0.35 + (j % 3) * 0.15));
    ctx.strokeStyle = col.main;
    ctx.shadowColor = col.glow;
    ctx.shadowBlur = 24 * cr;
    ctx.lineWidth = (14 + Math.sin(state.frame * 0.05 + j) * 6) * cr;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(-100, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, W + 100, endY);
    ctx.stroke();

    // Radiant core filament
    ctx.strokeStyle = col.glow;
    ctx.lineWidth = 3.5 * cr;
    ctx.stroke();
    ctx.restore();
  }

  // Shimmering celestial fluid light droplets (五彩灵光粒子)
  const sparkTotal = 50;
  for (let s = 0; s < sparkTotal; s++) {
    const col = FIVE_COLORS[s % FIVE_COLORS.length];
    const sx = (rand(s + 381) * (W + 200) + state.frame * (3 + (s % 3)) + W * 3) % (W + 200) - 100;
    const sy = (rand(s + 492) * H + Math.sin(state.frame * 0.04 + s) * 70 + H * 3) % H;
    const size = 2 + rand(s + 603) * 4;

    ctx.save();
    ctx.globalAlpha = cr * (0.3 + rand(s + 714) * 0.6);
    ctx.fillStyle = col.glow;
    ctx.shadowColor = col.main;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function horseRush(ctx: CanvasRenderingContext2D, state: FilmState) {
  ctx.save();
  for (let i = 0; i < 220; i++) {
    const x = ((i * 103 + state.frame * (7 + i % 4)) % 2250) - 150;
    const y = 690 + (i % 7) * 39 + Math.sin(state.frame * 0.23 + i) * 9;
    const scale = 0.25 + (i % 7) * 0.045;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = 0.13 + (i % 7) * 0.045;
    ctx.fillStyle = i % 3 ? '#c0b9a9' : '#5c6468';
    ctx.beginPath();
    ctx.ellipse(0, -46, 70, 31, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(34, -66);
    ctx.lineTo(63, -118);
    ctx.lineTo(95, -120);
    ctx.lineTo(103, -76);
    ctx.lineTo(70, -51);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 10;
    for (const leg of [-43, -12, 26, 55]) {
      ctx.beginPath();
      ctx.moveTo(leg, -20);
      ctx.lineTo(leg + Math.sin(state.frame * 0.42 + i + leg) * 26, 38);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

function learningMontage(ctx: CanvasRenderingContext2D, state: FilmState) {
  const p = state.progress;
  if (p < 0.38) return;
  const focus = Math.min(1, Math.max(0, (p - 0.38) * 13));
  if (p < 0.61) {
    ctx.fillStyle = `rgba(9,29,31,${focus * 0.59})`;
    ctx.fillRect(0, 58, W, 964);
    const open = Math.min(1, (p - 0.38) / 0.1);
    ctx.save();
    ctx.translate(960, 540);
    ctx.scale(0.6 + open * 0.6, 1);
    ctx.fillStyle = '#c8bb95';
    ctx.strokeStyle = '#856e47';
    ctx.lineWidth = 9;
    ctx.fillRect(-330, -225, 660, 450);
    ctx.strokeRect(-330, -225, 660, 450);
    for (let i = 0; i < 11; i++) {
      ctx.strokeStyle = i % 2 ? '#aa996f' : '#947f57';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-285 + i * 56, -195);
      ctx.lineTo(-285 + i * 56, 195);
      ctx.stroke();
    }
    ctx.fillStyle = '#294d47';
    ctx.font = 'bold 155px KaiTi, serif';
    ctx.textAlign = 'center';
    ctx.fillText('道', 0, 58);
    ctx.restore();
  } else if (p < 0.75) {
    ctx.fillStyle = 'rgba(11,31,33,.55)';
    ctx.fillRect(0, 58, W, 964);
    for (let i = 0; i < 30; i++) {
      const x = 210 + rand(i + 79) * 1510;
      const y = 160 + rand(i + 99) * 690;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(i * 2.21);
      ctx.fillStyle = '#c6dca3';
      ctx.globalAlpha = 0.4 + rand(i + 132) * 0.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 19, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else {
    const t = (p - 0.75) / 0.25;
    ctx.save();
    ctx.strokeStyle = '#f8d58b';
    ctx.lineWidth = 17 * (1 - t) + 2;
    ctx.shadowColor = '#ffdc85';
    ctx.shadowBlur = 36;
    ctx.globalAlpha = 1 - t * 0.5;
    ctx.beginPath();
    ctx.moveTo(580, 811);
    ctx.quadraticCurveTo(900, 180, 1710, 125);
    ctx.stroke();
    ctx.restore();
  }
}

function banquetInserts(ctx: CanvasRenderingContext2D, state: FilmState) {
  const p = state.progress;
  if (p < 0.45 || p > 0.91) return;
  if (p > 0.83) {
    ctx.save();
    ctx.translate(807, 467);
    ctx.rotate(-0.3);
    ctx.fillStyle = '#ac5554';
    ctx.strokeStyle = '#e6ae81';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 74, 0.15, Math.PI * 1.84);
    ctx.lineTo(19, -13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#eed4aa';
    ctx.beginPath();
    ctx.moveTo(16, -13);
    ctx.lineTo(68, -43);
    ctx.lineTo(65, 39);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }
  const section = Math.min(3, Math.floor((p - 0.45) / 0.105));
  const tint = ['#a85b58', '#a98755', '#d9b873', '#e2a958'][section];
  ctx.fillStyle = 'rgba(10,15,23,.77)';
  ctx.fillRect(0, 58, W, 964);
  const x = 960;
  const y = 535;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(p * 30) * 0.08);
  ctx.shadowColor = tint;
  ctx.shadowBlur = 65;
  if (section === 0) {
    ctx.fillStyle = '#ad534f';
    ctx.strokeStyle = '#e3ad7c';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, -170);
    ctx.bezierCurveTo(-175, -255, -265, -47, -165, 137);
    ctx.quadraticCurveTo(0, 250, 165, 137);
    ctx.bezierCurveTo(265, -47, 175, -255, 0, -170);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#66926f';
    ctx.beginPath();
    ctx.ellipse(67, -201, 96, 37, -0.42, 0, Math.PI * 2);
    ctx.fill();
  } else if (section === 1) {
    ctx.fillStyle = '#4b3e3c';
    ctx.strokeStyle = '#d1a765';
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(-72, -226);
    ctx.lineTo(72, -226);
    ctx.lineTo(72, -58);
    ctx.bezierCurveTo(160, 18, 159, 189, 0, 198);
    ctx.bezierCurveTo(-159, 189, -160, 18, -72, -58);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#b78a59';
    ctx.fillRect(-91, -253, 182, 44);
  } else if (section === 2) {
    ctx.fillStyle = '#d2a766';
    ctx.strokeStyle = '#ffdf9d';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-160, -155);
    ctx.lineTo(160, -155);
    ctx.lineTo(100, 91);
    ctx.quadraticCurveTo(0, 182, -100, 91);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-24, 112, 48, 98);
    ctx.fillRect(-128, 200, 256, 24);
  } else {
    ctx.fillStyle = '#f3c773';
    ctx.strokeStyle = '#ffe5a5';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#a86d3e';
    ctx.font = 'bold 128px KaiTi, serif';
    ctx.textAlign = 'center';
    ctx.fillText('丹', 0, 52);
  }
  ctx.restore();
}

function hallArmy(ctx: CanvasRenderingContext2D, state: FilmState) {
  ctx.save();
  for (let row = 0; row < 20; row++) {
    const y = 260 + row * 34;
    const size = 2 + row * 0.53;
    for (let col = 0; col < 100; col++) {
      const x = col < 50 ? 15 + col * (15 + row * 0.32) : 1905 - (col - 50) * (15 + row * 0.32);
      if (x > 760 && x < 1160) continue;
      ctx.fillStyle = '#111823';
      ctx.strokeStyle = '#9b8890';
      ctx.lineWidth = 1 + row * 0.06;
      ctx.globalAlpha = 0.22 + row * 0.025;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y + size);
      ctx.lineTo(x, y + size * 3.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + size * 2, y + size * 3);
      ctx.lineTo(x + size * 2.8, y - size * 3);
      ctx.stroke();
    }
  }
  ctx.restore();
  particles(ctx, state, ['#d3b977', '#78c9ca', '#a777cc'], 30, 0.08, 0.28);
}

export function drawFilmAtmosphere(ctx: CanvasRenderingContext2D, state: FilmState) {
  ctx.clearRect(0, 0, W, H);
  if (state.scene === 2) {
    waves(ctx, state);
    rain(ctx, state);
    fogLayer(ctx, 785, state.frame * 0.015, 0.12 + state.fog * 0.6);
    fogLayer(ctx, 970, state.frame * 0.011, 0.28 + state.fog * 0.32);
  } else if ([3, 4, 5, 10, 13].includes(state.scene)) {
    fogLayer(ctx, state.scene === 3 ? 890 : 925, state.frame * 0.01, 0.2 + state.fog * 0.38);
    if (state.scene === 3) {
      for (let i = 0; i < 18; i++) {
        const x = 180 + rand(i + 94) * 1580;
        const y = 160 + rand(i + 45) * 560;
        ctx.fillStyle = '#d5e5a7';
        ctx.globalAlpha = 0.14 + (state.progress > 0.65 ? 0.54 : 0.14);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(i * 2.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      learningMontage(ctx, state);
    }
    if (state.scene === 4 || state.scene === 10) {
      particles(ctx, state, ['#fae8a7', '#a8dcae', '#d8efc5'], 46, 0.45, 0.51);
    }
  } else if ([6, 7, 8, 9].includes(state.scene)) {
    fogLayer(ctx, 985, state.frame * 0.004, 0.12, '167,165,154');
    particles(ctx, state, ['#d6ad72', '#9b7f64'], 26, 0.14, 0.28);
    if (state.scene === 6) horseRush(ctx, state);
    if (state.scene === 8) banquetInserts(ctx, state);
  } else if ([11, 12, 14, 15].includes(state.scene)) {
    fogLayer(ctx, 794, state.frame * 0.012, 0.28, '94,111,122');
    fogLayer(ctx, 995, state.frame * 0.009, 0.37, '115,127,129');
    if (state.scene === 15) {
      rain(ctx, { ...state, rain: 0.4 });
      if (state.fire > 0) samadhiFire(ctx, state);
    }
  } else if (state.scene >= 16 && state.scene <= 19) {
    if (state.fire > 0) samadhiFire(ctx, state);
    if (state.colorRelease > 0) fiveColorFluidRibbons(ctx, state);
    if (state.scene === 16) {
      ctx.fillStyle = '#b5362c';
      ctx.globalAlpha = state.fire;
      ctx.beginPath();
      ctx.arc(960, 575, 9 + state.fire * 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  } else if (state.scene >= 20) {
    if (state.colorRelease > 0) fiveColorFluidRibbons(ctx, state);
    particles(
      ctx,
      state,
      ['#f7ca72', '#e96a58', '#56bcb5', '#6b9ee8', '#ae77d5'],
      state.scene === 21 ? 55 : 145,
      state.scene === 21 ? 0.1 : 1.2,
      state.scene === 22 ? state.colorRelease * 0.85 : 0.74
    );
    if (state.scene === 21) hallArmy(ctx, state);
  }
}
