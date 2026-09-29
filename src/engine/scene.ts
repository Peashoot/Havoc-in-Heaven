import type { SceneTime } from '../timeline.ts';
import type { Costume, Pose } from '../rig/hero.ts';
import { apply, mul, R, S, T, type M } from '../rig/mat.ts';

/**
 * Multiplane camera. Scenes are authored in 1920x1080 frame coordinates; the camera at
 * {x: 960, y: 540, zoom: 1} shows exactly that frame. Each plane has a depth factor z:
 * z = 0 never moves (sky), z = 1 is the subject plane, z > 1 is foreground and moves
 * faster than the subject (parallax), and zoom affects planes as zoom^z (dolly feel).
 */
export interface Cam { x: number; y: number; zoom: number; rot?: number }

export const REST_CAM: Cam = { x: 960, y: 540, zoom: 1, rot: 0 };

export function planeMatrix(cam: Cam, z: number): M {
  const k = Math.pow(cam.zoom, z);
  const cx = 960 + (cam.x - 960) * z, cy = 540 + (cam.y - 540) * z;
  return mul(mul(mul(T(960, 540), R(cam.rot ?? 0)), S(k)), T(-cx, -cy));
}

export class View {
  cam: Cam;
  constructor(cam: Cam) { this.cam = cam; }
  matrix(z = 1) { return planeMatrix(this.cam, z); }
  /** Set a canvas context so drawing coordinates are plane-z scene coordinates. */
  apply(ctx: CanvasRenderingContext2D, z = 1) { const m = this.matrix(z); ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]); }
  toScreen(x: number, y: number, z = 1) { return apply(this.matrix(z), x, y); }
  /** Screen-space scale of plane z (for line widths etc). */
  scale(z = 1) { return Math.pow(this.cam.zoom, z); }
}

export interface HeroSpec { name: string; pose: Pose; costume: Costume; op?: number }

export interface SceneDef {
  id: number;
  /** CSS background painted behind the scene SVG (usually the sky). */
  bg: string;
  /**
   * SVG inner markup. Put content in planes: <g class="plane" data-z="0.3">…</g>.
   * Any id/gradient/filter defined here must be prefixed `s<id>-` (two scenes can be mounted at once).
   */
  markup(): string;
  camera(t: SceneTime): Cam;
  heroes?(t: SceneTime): HeroSpec[];
  /** Animate scene elements for time t. Must be a pure function of t (deterministic scrubbing). */
  update?(d: Dom, t: SceneTime): void;
  /** Canvas effects drawn above the scene. ctx starts in screen space; use view.apply(ctx, z). */
  fx?(ctx: CanvasRenderingContext2D, t: SceneTime, view: View): void;
  /** Screen-space camera shake in px for time t. */
  shake?(t: SceneTime): [number, number];
}

/** Cached element access inside one mounted scene. */
export class Dom {
  private cache = new Map<string, Element[]>();
  root: Element;
  constructor(root: Element) { this.root = root; }
  all<E extends Element = SVGElement>(sel: string): E[] {
    let v = this.cache.get(sel);
    if (!v) { v = Array.from(this.root.querySelectorAll(sel)); this.cache.set(sel, v); }
    return v as E[];
  }
  el<E extends Element = SVGElement>(sel: string): E | undefined { return this.all<E>(sel)[0]; }
  /** Set transform attribute on every match. */
  tf(sel: string, transform: string) { for (const e of this.all(sel)) e.setAttribute('transform', transform); }
  /** Set opacity (0..1, clamped) on every match. */
  op(sel: string, v: number) { const s = String(Math.max(0, Math.min(1, +v.toFixed(3)))); for (const e of this.all(sel)) (e as SVGElement).style.opacity = s; }
  attr(sel: string, name: string, v: string | number) { for (const e of this.all(sel)) e.setAttribute(name, String(v)); }
  /** Per-element callback, e.g. to stagger a crowd. */
  each(sel: string, fn: (e: SVGElement, i: number) => void) { this.all(sel).forEach((e, i) => fn(e as SVGElement, i)); }
}

/** Helper for plane groups. */
export const plane = (z: number, body: string, cls = '') => `<g class="plane ${cls}" data-z="${z}">${body}</g>`;
