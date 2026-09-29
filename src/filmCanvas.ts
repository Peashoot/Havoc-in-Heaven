import type { FilmState } from './timeline';

const W = 1920;
const H = 1080;
const rand = (n: number) => {
  const v = Math.sin(n * 73.817 + 11.13) * 43758.5453;
  return v - Math.floor(v);
};

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

function particles(ctx: CanvasRenderingContext2D, state: FilmState, colors: string[], count: number, speed: number, alpha = 0.7) {
  for (let i = 0; i < count; i++) {
    const x = (rand(i + 212) * W + state.frame * speed * (i % 2 ? 1 : -0.6) + W * 6) % W;
    const y = (rand(i + 533) * H - state.frame * speed * 0.34 + H * 6) % H;
    const size = 1.5 + rand(i + 837) * 4;
    ctx.globalAlpha = alpha * (0.4 + rand(i + 99) * 0.6);
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function fire(ctx: CanvasRenderingContext2D, state: FilmState) {
  const colors = state.colorRelease > 0.45
    ? ['#b83734', '#ef8b3d', '#ffcf64', '#61c4bd', '#668be0', '#af6bc6']
    : ['#612024', '#ab3b2e', '#d76c36', '#efb457'];
  for (let i = 0; i < 35; i++) {
    const x = 390 + i * 34 + Math.sin(state.frame * 0.06 + i * 1.9) * 28;
    const reach = (120 + rand(i + 17) * 340) * state.fire;
    const y = 1000 - reach * (0.55 + Math.sin(state.frame * 0.09 + i) * 0.15);
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = state.fire * (0.13 + rand(i + 28) * 0.27);
    ctx.beginPath();
    ctx.moveTo(x - 49, 1080);
    ctx.quadraticCurveTo(x - 73, y + 170, x, y);
    ctx.quadraticCurveTo(x + 78, y + 180, x + 50, 1080);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  particles(ctx, state, colors, 95, 0.7, state.fire * 0.67);
}

function horseRush(ctx: CanvasRenderingContext2D, state: FilmState) {
  ctx.save();
  for (let i = 0; i < 220; i++) {
    const x = ((i * 103 + state.frame * (7 + i % 4)) % 2250) - 150;
    const y = 690 + (i % 7) * 39 + Math.sin(state.frame * 0.23 + i) * 9;
    const scale = 0.25 + (i % 7) * 0.045;
    ctx.save();ctx.translate(x, y);ctx.scale(scale, scale);
    ctx.globalAlpha = 0.13 + (i % 7) * 0.045;
    ctx.fillStyle = i % 3 ? '#c0b9a9' : '#5c6468';
    ctx.beginPath();ctx.ellipse(0, -46, 70, 31, -0.08, 0, Math.PI * 2);ctx.fill();
    ctx.beginPath();ctx.moveTo(34, -66);ctx.lineTo(63, -118);ctx.lineTo(95, -120);
    ctx.lineTo(103, -76);ctx.lineTo(70, -51);ctx.closePath();ctx.fill();
    ctx.strokeStyle = ctx.fillStyle;ctx.lineWidth = 10;
    for (const leg of [-43, -12, 26, 55]) {
      ctx.beginPath();ctx.moveTo(leg, -20);ctx.lineTo(leg + Math.sin(state.frame * 0.42 + i + leg) * 26, 38);ctx.stroke();
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
    ctx.save();ctx.translate(960, 540);ctx.scale(0.6 + open * 0.6, 1);
    ctx.fillStyle = '#c8bb95';ctx.strokeStyle = '#856e47';ctx.lineWidth = 9;
    ctx.fillRect(-330, -225, 660, 450);ctx.strokeRect(-330, -225, 660, 450);
    for (let i = 0; i < 11; i++) {
      ctx.strokeStyle = i % 2 ? '#aa996f' : '#947f57';ctx.lineWidth = 3;
      ctx.beginPath();ctx.moveTo(-285 + i * 56, -195);ctx.lineTo(-285 + i * 56, 195);ctx.stroke();
    }
    ctx.fillStyle = '#294d47';ctx.font = 'bold 155px KaiTi, serif';ctx.textAlign = 'center';
    ctx.fillText('道', 0, 58);
    ctx.restore();
  } else if (p < 0.75) {
    ctx.fillStyle = 'rgba(11,31,33,.55)';ctx.fillRect(0, 58, W, 964);
    for (let i = 0; i < 30; i++) {
      const x = 210 + rand(i + 79) * 1510;
      const y = 160 + rand(i + 99) * 690;
      ctx.save();ctx.translate(x, y);ctx.rotate(i * 2.21);
      ctx.fillStyle = '#c6dca3';ctx.globalAlpha = 0.4 + rand(i + 132) * 0.5;
      ctx.beginPath();ctx.ellipse(0, 0, 19, 5, 0, 0, Math.PI * 2);ctx.fill();ctx.restore();
    }
  } else {
    const t = (p - 0.75) / 0.25;
    ctx.save();ctx.strokeStyle = '#f8d58b';ctx.lineWidth = 17 * (1 - t) + 2;
    ctx.shadowColor = '#ffdc85';ctx.shadowBlur = 36;ctx.globalAlpha = 1 - t * 0.5;
    ctx.beginPath();ctx.moveTo(580, 811);ctx.quadraticCurveTo(900, 180, 1710, 125);ctx.stroke();ctx.restore();
  }
}

function banquetInserts(ctx: CanvasRenderingContext2D, state: FilmState) {
  const p = state.progress;
  if (p < 0.45 || p > 0.91) return;
  if (p > 0.83) {
    ctx.save();ctx.translate(807, 467);ctx.rotate(-0.3);
    ctx.fillStyle = '#ac5554';ctx.strokeStyle = '#e6ae81';ctx.lineWidth = 8;
    ctx.beginPath();ctx.arc(0, 0, 74, 0.15, Math.PI * 1.84);ctx.lineTo(19, -13);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle = '#eed4aa';ctx.beginPath();ctx.moveTo(16, -13);ctx.lineTo(68, -43);ctx.lineTo(65, 39);ctx.closePath();ctx.fill();
    ctx.restore();
    return;
  }
  const section = Math.min(3, Math.floor((p - 0.45) / 0.105));
  const tint = ['#a85b58', '#a98755', '#d9b873', '#e2a958'][section];
  ctx.fillStyle = 'rgba(10,15,23,.77)';ctx.fillRect(0, 58, W, 964);
  const x = 960, y = 535;
  ctx.save();ctx.translate(x, y);ctx.rotate(Math.sin(p * 30) * 0.08);
  ctx.shadowColor = tint;ctx.shadowBlur = 65;
  if (section === 0) {
    ctx.fillStyle = '#ad534f';ctx.strokeStyle = '#e3ad7c';ctx.lineWidth = 8;
    ctx.beginPath();ctx.moveTo(0, -170);ctx.bezierCurveTo(-175, -255, -265, -47, -165, 137);
    ctx.quadraticCurveTo(0, 250, 165, 137);ctx.bezierCurveTo(265, -47, 175, -255, 0, -170);ctx.fill();ctx.stroke();
    ctx.fillStyle = '#66926f';ctx.beginPath();ctx.ellipse(67, -201, 96, 37, -0.42, 0, Math.PI * 2);ctx.fill();
  } else if (section === 1) {
    ctx.fillStyle = '#4b3e3c';ctx.strokeStyle = '#d1a765';ctx.lineWidth = 13;
    ctx.beginPath();ctx.moveTo(-72, -226);ctx.lineTo(72, -226);ctx.lineTo(72, -58);
    ctx.bezierCurveTo(160, 18, 159, 189, 0, 198);ctx.bezierCurveTo(-159, 189, -160, 18, -72, -58);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle = '#b78a59';ctx.fillRect(-91, -253, 182, 44);
  } else if (section === 2) {
    ctx.fillStyle = '#d2a766';ctx.strokeStyle = '#ffdf9d';ctx.lineWidth = 10;
    ctx.beginPath();ctx.moveTo(-160, -155);ctx.lineTo(160, -155);ctx.lineTo(100, 91);
    ctx.quadraticCurveTo(0, 182, -100, 91);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillRect(-24, 112, 48, 98);ctx.fillRect(-128, 200, 256, 24);
  } else {
    ctx.fillStyle = '#f3c773';ctx.strokeStyle = '#ffe5a5';ctx.lineWidth = 9;
    ctx.beginPath();ctx.arc(0, 0, 150, 0, Math.PI * 2);ctx.fill();ctx.stroke();
    ctx.fillStyle = '#a86d3e';ctx.font = 'bold 128px KaiTi, serif';ctx.textAlign = 'center';ctx.fillText('丹', 0, 52);
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
      ctx.fillStyle = '#111823';ctx.strokeStyle = '#9b8890';ctx.lineWidth = 1 + row * 0.06;
      ctx.globalAlpha = 0.22 + row * 0.025;
      ctx.beginPath();ctx.arc(x, y, size, 0, Math.PI * 2);ctx.fill();
      ctx.beginPath();ctx.moveTo(x, y + size);ctx.lineTo(x, y + size * 3.4);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x + size * 2, y + size * 3);
      ctx.lineTo(x + size * 2.8, y - size * 3);ctx.stroke();
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
        ctx.save();ctx.translate(x, y);ctx.rotate(i * 2.4);
        ctx.beginPath();ctx.ellipse(0, 0, 14, 4, 0, 0, Math.PI * 2);ctx.fill();ctx.restore();
      }
      ctx.globalAlpha = 1;
      learningMontage(ctx, state);
    }
    if (state.scene === 4 || state.scene === 10) particles(ctx, state, ['#fae8a7', '#a8dcae', '#d8efc5'], 46, 0.45, 0.51);
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
      if (state.fire > 0) fire(ctx, state);
    }
  } else if (state.scene >= 16 && state.scene <= 19) {
    if (state.fire > 0) fire(ctx, state);
    if (state.scene === 16) {
      ctx.fillStyle = '#b5362c';ctx.globalAlpha = state.fire;
      ctx.beginPath();ctx.arc(960, 575, 9 + state.fire * 48, 0, Math.PI * 2);ctx.fill();ctx.globalAlpha = 1;
    }
  } else if (state.scene >= 20) {
    particles(ctx, state, ['#f7ca72', '#e96a58', '#56bcb5', '#6b9ee8', '#ae77d5'],
      state.scene === 21 ? 55 : 145, state.scene === 21 ? 0.1 : 1.2,
      state.scene === 22 ? state.colorRelease * 0.85 : 0.74);
    if (state.scene === 21) hallArmy(ctx, state);
  }
}
