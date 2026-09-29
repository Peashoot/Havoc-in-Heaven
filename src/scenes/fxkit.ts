import { clamp, rand } from '../engine/ease.ts';
import type { View } from '../engine/scene.ts';
import { solve, type Pose } from '../rig/hero.ts';

/**
 * Anime smear frame for the staff: fills the area the staff swept between
 * `lf - span` and `lf`, sampled from the pose function itself (true motion blur).
 */
export function staffSmear(ctx: CanvasRenderingContext2D, view: View, poseAt: (lf: number) => Pose, lf: number, spanFrames = 4, color = [255, 214, 110], z = 1) {
  const n = 18;
  const pts = Array.from({ length: n + 1 }, (_, i) => solve(poseAt(lf - spanFrames * (i / n))).staffEnds);
  const move = Math.hypot(pts[0][1][0] - pts[n][1][0], pts[0][1][1] - pts[n][1][1]);
  if (move < 160) return;
  view.apply(ctx, z);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const k = clamp((move - 160) / 300);
  const mid = (t: [number, number], h: [number, number], f: number): [number, number] => [t[0] + (h[0] - t[0]) * f, t[1] + (h[1] - t[1]) * f];
  // hot band hugging the head end
  for (let i = 0; i < n; i++) {
    const [t0, h0] = pts[i], [t1, h1] = pts[i + 1];
    ctx.fillStyle = `rgba(255,236,170,${((1 - i / n) * 0.55 * k).toFixed(3)})`;
    const m0 = mid(t0, h0, 0.82), m1 = mid(t1, h1, 0.82);
    ctx.beginPath();
    ctx.moveTo(m0[0], m0[1]); ctx.lineTo(h0[0], h0[1]); ctx.lineTo(h1[0], h1[1]); ctx.lineTo(m1[0], m1[1]);
    ctx.closePath();
    ctx.fill();
  }
  // arc streaks traced by points along the outer staff, fading into the past
  ctx.lineCap = 'round';
  for (let s = 0; s < 9; s++) {
    const f = 0.42 + s * 0.072;
    for (let i = 0; i < n; i++) {
      const a = mid(pts[i][0], pts[i][1], f), b = mid(pts[i + 1][0], pts[i + 1][1], f);
      ctx.strokeStyle = `rgba(${s > 6 ? '255,250,230' : color},${((1 - i / n) * (0.25 + f * 0.6) * k).toFixed(3)})`;
      ctx.lineWidth = 3 + f * 9 * (1 - i / n);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
  }
  ctx.restore();
}

/** Radial focus speed lines around a screen point; strength 0..1. */
export function speedLines(ctx: CanvasRenderingContext2D, cx: number, cy: number, strength: number, frame: number, color = '255,255,255', inner = 260) {
  if (strength <= 0.01) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const n = 90;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand(i + frame * 13) * 0.05;
    const r0 = inner + rand(i * 3 + frame) * 260;
    const w = 0.004 + rand(i + 7) * 0.01;
    ctx.fillStyle = `rgba(${color},${(strength * (0.35 + rand(i * 5 + frame) * 0.5)).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a - w) * 2400, cy + Math.sin(a - w) * 2400);
    ctx.lineTo(cx + Math.cos(a + w) * 2400, cy + Math.sin(a + w) * 2400);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** Parallel motion lines (horizontal streaks) for pans / dashes. */
export function streaks(ctx: CanvasRenderingContext2D, strength: number, frame: number, angle = 0, color = '255,255,255') {
  if (strength <= 0.01) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(960, 540); ctx.rotate(angle); ctx.translate(-960, -540);
  for (let i = 0; i < 60; i++) {
    const y = rand(i + 3) * 1300 - 110;
    const len = 300 + rand(i + 9) * 900;
    const x = ((rand(i) * 3000 - frame * (60 + rand(i + 1) * 80)) % 3000 + 3000) % 3000 - 540;
    ctx.fillStyle = `rgba(${color},${(strength * (0.15 + rand(i * 5) * 0.35)).toFixed(3)})`;
    ctx.fillRect(x, y, len, 2 + rand(i + 5) * 5);
  }
  ctx.restore();
}

/** Expanding elliptical shockwave ring in plane coordinates. t in 0..1 over its life. */
export function shockRing(ctx: CanvasRenderingContext2D, view: View, x: number, y: number, t: number, maxR = 900, color = [255, 214, 110], z = 1, squash = 0.45) {
  if (t <= 0 || t >= 1) return;
  view.apply(ctx, z);
  const r = maxR * (1 - Math.pow(1 - t, 3));
  const a = (1 - t) * 0.95;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.translate(x, y); ctx.scale(1, squash);
  for (const [w, k] of [[70, 0.25], [30, 0.5], [10, 1]] as const) {
    ctx.strokeStyle = `rgba(${color},${(a * k).toFixed(3)})`;
    ctx.lineWidth = w * (1 - t * 0.7);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

/** Burst of sparks from (x, y) in plane coordinates; t = frames since the burst. */
export function sparks(ctx: CanvasRenderingContext2D, view: View, x: number, y: number, t: number, count = 60, speed = 26, seed = 1, z = 1, color = '255,220,130') {
  if (t < 0) return;
  view.apply(ctx, z);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const a = rand(seed + i) * Math.PI * 2;
    const v = speed * (0.3 + rand(seed + i * 3) * 0.9);
    const life = 18 + rand(seed + i * 7) * 30;
    if (t > life) continue;
    const k = t / life;
    const px = x + Math.cos(a) * v * t, py = y + Math.sin(a) * v * t + 0.35 * t * t;
    const tx = px - Math.cos(a) * v * 2.2, ty = py - (Math.sin(a) * v + 0.7 * t) * 2.2;
    ctx.strokeStyle = `rgba(${color},${(1 - k).toFixed(3)})`;
    ctx.lineWidth = 4 * (1 - k) + 1;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tx, ty); ctx.stroke();
  }
  ctx.restore();
}

/** Floating motes (dust / embers / gold flecks) drifting across a plane. */
export function motes(ctx: CanvasRenderingContext2D, view: View, lf: number, n: number, color: string, seed = 1, z = 0.8, drift = [0.6, -0.3], size = 3) {
  view.apply(ctx, z);
  for (let i = 0; i < n; i++) {
    const x = (((rand(seed + i) * 2600 + lf * drift[0] * (0.5 + rand(seed + i + 3))) % 2600) + 2600) % 2600 - 340;
    const y = (((rand(seed + i + 9) * 1500 + lf * drift[1] * (0.5 + rand(seed + i + 4))) % 1500) + 1500) % 1500 - 210 + Math.sin(lf * 0.04 + i) * 10;
    const a = 0.25 + 0.6 * Math.abs(Math.sin(lf * 0.05 + i * 1.7));
    ctx.fillStyle = color.replace('A', a.toFixed(2));
    ctx.beginPath();
    ctx.arc(x, y, size * (0.4 + rand(seed + i + 5)), 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Full-screen white (or tinted) frame. */
export function whiteFrame(ctx: CanvasRenderingContext2D, alpha = 1, color = '#ffffff') {
  if (alpha <= 0) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = clamp(alpha);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.restore();
}
