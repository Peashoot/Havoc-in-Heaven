import { clamp, lerp, rand, smooth, span } from './ease.ts';
import { Dom, View, planeMatrix, type SceneDef } from './scene.ts';
import { heroEls, poseHero, type HeroEls } from '../rig/hero.ts';
import { compose, sceneTime, type Composition, type SceneTime } from '../timeline.ts';
import { svg as matSvg } from '../rig/mat.ts';

interface Slot {
  index: number;
  el: HTMLDivElement;
  sceneId: number;
  dom: Dom | null;
  planes: { el: SVGGElement; z: number }[];
  heroes: Map<string, HeroEls>;
  fx: HTMLCanvasElement;
  fxCtx: CanvasRenderingContext2D | null;
}

export interface SlotLook { op: number; zoomMul: number; dx: number; blur: number }

/** How each transition treats the outgoing (a) and incoming (b) scene at raw progress r. */
export function transitionLooks(c: Composition): { a: SlotLook; b: SlotLook } {
  const r = c.raw, m = c.mix;
  const base = (): SlotLook => ({ op: 1, zoomMul: 1, dx: 0, blur: 0 });
  const a = base(), b = base();
  switch (c.transition) {
    case 'dissolve': b.op = m; break;
    case 'push':
      a.zoomMul = 1 + smooth(r) * 1.2; a.blur = Math.sin(Math.PI * r) * 6;
      b.op = smooth(span(r, 0.35, 0.72)); b.zoomMul = lerp(0.82, 1, smooth(r)); break;
    case 'whip': {
      const s = Math.sin(Math.PI * r);
      a.dx = -m * 1500; b.dx = (1 - m) * 1500; a.blur = b.blur = s * 46;
      b.op = smooth(span(r, 0.2, 0.55)); break;
    }
    case 'flash': b.op = span(r, 0.42, 0.58); a.zoomMul = 1 + smooth(r) * 0.08; break;
    case 'cloud': b.op = span(r, 0.4, 0.6); a.zoomMul = 1 + smooth(r) * 0.35; b.zoomMul = lerp(1.18, 1, smooth(r)); break;
    case 'ink': b.op = span(r, 0.42, 0.58); break;
    case 'black': b.op = r > 0.5 ? 1 : 0; break;
    default: break;
  }
  return { a, b };
}

export class Renderer {
  private slots: Slot[];
  private fxCtx: CanvasRenderingContext2D | null;
  private txCtx: CanvasRenderingContext2D | null;
  private stage: HTMLElement;
  private scenes: Record<number, SceneDef>;
  constructor(stage: HTMLElement, scenes: Record<number, SceneDef>, slotEls: HTMLDivElement[], fx: HTMLCanvasElement | null, tx: HTMLCanvasElement | null) {
    this.stage = stage;
    this.scenes = scenes;
    const doc = stage.ownerDocument;
    this.slots = slotEls.map((el, index) => {
      const c = doc.createElement('canvas');
      c.width = 1920; c.height = 1080;
      return { index, el, sceneId: 0, dom: null, planes: [], heroes: new Map(), fx: c, fxCtx: c.getContext('2d') };
    });
    this.fxCtx = fx?.getContext('2d') ?? null;
    this.txCtx = tx?.getContext('2d') ?? null;
  }

  private mount(slot: Slot, id: number) {
    if (slot.sceneId === id) return;
    const def = this.scenes[id];
    slot.el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" data-scene="${id}">${def.markup()}</svg>`;
    slot.el.style.background = def.bg;
    const svgEl = slot.el.firstElementChild!;
    slot.dom = new Dom(svgEl);
    slot.planes = Array.from(svgEl.querySelectorAll<SVGGElement>('g.plane')).map((el) => ({ el, z: Number(el.dataset.z ?? 1) }));
    slot.heroes = new Map();
    svgEl.querySelectorAll<SVGGElement>('g.hero').forEach((g) => slot.heroes.set(g.dataset.name ?? 'wukong', heroEls(g)));
    slot.sceneId = id;
  }

  private draw(slot: Slot, t: SceneTime, look: SlotLook) {
    const def = this.scenes[t.scene];
    const cam = def.camera(t);
    const camZ = { ...cam, zoom: cam.zoom * look.zoomMul };
    for (const p of slot.planes) p.el.setAttribute('transform', matSvg(planeMatrix(camZ, p.z)));
    if (def.heroes) {
      const now = def.heroes(t);
      const prev = def.heroes(sceneTime(t.scene, t.f - 3));
      for (const h of now) {
        const els = slot.heroes.get(h.name);
        if (!els) continue;
        const before = prev.find((q) => q.name === h.name)?.pose;
        poseHero(els, h.pose, h.costume, before);
        (els.root as unknown as SVGElement).style.opacity = String(clamp(h.op ?? 1));
      }
    }
    def.update?.(slot.dom!, t);
    const [sx, sy] = def.shake?.(t) ?? [0, 0];
    slot.el.style.transform = `translate(${(look.dx + sx).toFixed(1)}px, ${sy.toFixed(1)}px)`;
    slot.el.style.opacity = String(+look.op.toFixed(3));
    slot.el.style.visibility = look.op > 0.001 ? 'visible' : 'hidden';
    const blur = look.blur > 0.5 ? look.blur : 0;
    const filter = this.stage.ownerDocument.getElementById(`whip${slot.index}`)?.firstElementChild;
    filter?.setAttribute('stdDeviation', `${blur.toFixed(1)} 0`);
    slot.el.style.filter = blur ? `url(#whip${slot.index})` : 'none';

    // effects: draw into the slot's offscreen canvas, then composite with the slot's look
    const ctx = slot.fxCtx;
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, 1920, 1080);
      if (def.fx) { ctx.save(); def.fx(ctx, t, new View(camZ)); ctx.restore(); }
    }
    return { sx, sy };
  }

  render(frameNumber: number): Composition {
    const c = compose(frameNumber);
    const looks = transitionLooks(c);
    const slotA = this.slots[c.a.scene % 2];
    const slotB = c.b ? this.slots[c.b.scene % 2] : null;
    this.mount(slotA, c.a.scene);
    if (slotB && c.b) this.mount(slotB, c.b.scene);
    for (const s of this.slots) if (s !== slotA && s !== slotB) { s.el.style.visibility = 'hidden'; s.el.style.opacity = '0'; }
    slotA.el.style.zIndex = '1';
    if (slotB) slotB.el.style.zIndex = '2';

    const shA = this.draw(slotA, c.a, looks.a);
    const shB = slotB && c.b ? this.draw(slotB, c.b, looks.b) : null;

    const fx = this.fxCtx;
    if (fx) {
      fx.setTransform(1, 0, 0, 1, 0, 0);
      fx.clearRect(0, 0, 1920, 1080);
      const comp = (slot: Slot, look: SlotLook, sh: { sx: number; sy: number }) => {
        if (look.op <= 0.001) return;
        fx.globalAlpha = look.op;
        fx.drawImage(slot.fx, look.dx + sh.sx, sh.sy);
      };
      comp(slotA, looks.a, shA);
      if (slotB && shB) comp(slotB, looks.b, shB);
      fx.globalAlpha = 1;
    }
    this.drawTransition(c);
    this.stage.dataset.frame = String(c.frame);
    this.stage.dataset.scene = String(c.b && c.mix > 0.5 ? c.b.scene : c.a.scene);
    return c;
  }

  private drawTransition(c: Composition) {
    const ctx = this.txCtx;
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 1920, 1080);
    if (!c.transition) return;
    const r = c.raw;
    if (c.transition === 'flash') {
      ctx.fillStyle = '#fff6dc';
      ctx.globalAlpha = Math.pow(Math.sin(Math.PI * r), 1.4);
      ctx.fillRect(0, 0, 1920, 1080);
    } else if (c.transition === 'push') {
      ctx.fillStyle = '#fff3d6';
      ctx.globalAlpha = Math.pow(Math.sin(Math.PI * r), 3) * 0.55;
      ctx.fillRect(0, 0, 1920, 1080);
    } else if (c.transition === 'black') {
      ctx.fillStyle = '#030305';
      ctx.globalAlpha = smooth(span(r, 0, 0.38)) * (1 - smooth(span(r, 0.62, 1)));
      ctx.fillRect(0, 0, 1920, 1080);
    } else if (c.transition === 'cloud') {
      drawCloudWall(ctx, r);
    } else if (c.transition === 'ink') {
      drawInk(ctx, r);
    }
    ctx.globalAlpha = 1;
  }
}

/** Billowing ink-wash cloud bank sweeping right-to-left; fully opaque around r = 0.5. */
function drawCloudWall(ctx: CanvasRenderingContext2D, r: number) {
  const cover = Math.sin(Math.PI * r);
  const cx = lerp(2600, -700, r);
  ctx.save();
  ctx.globalAlpha = 1;
  const g = ctx.createLinearGradient(cx - 1500, 0, cx + 1500, 0);
  g.addColorStop(0, 'rgba(236,238,232,0)');
  g.addColorStop(0.22, 'rgba(236,238,232,1)');
  g.addColorStop(0.78, 'rgba(236,238,232,1)');
  g.addColorStop(1, 'rgba(236,238,232,0)');
  ctx.fillStyle = g;
  ctx.globalAlpha = smooth(span(cover, 0.1, 0.8));
  ctx.fillRect(0, 0, 1920, 1080);
  for (let i = 0; i < 70; i++) {
    const px = cx + (rand(i) - 0.5) * 3000;
    const py = rand(i + 50) * 1300 - 100;
    const rad = 150 + rand(i + 99) * 260;
    const grad = ctx.createRadialGradient(px - rad * 0.2, py - rad * 0.3, rad * 0.1, px, py, rad);
    const shade = i % 3 === 0 ? '205,212,214' : '247,247,242';
    grad.addColorStop(0, `rgba(${shade},0.95)`);
    grad.addColorStop(0.65, `rgba(${shade},0.6)`);
    grad.addColorStop(1, `rgba(${shade},0)`);
    ctx.globalAlpha = clamp(cover * 1.6);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Ink blots bleed in from the edges, meet in the middle, then retreat. */
function drawInk(ctx: CanvasRenderingContext2D, r: number) {
  const cover = Math.sin(Math.PI * r);
  ctx.save();
  ctx.fillStyle = '#07090c';
  ctx.globalAlpha = smooth(span(cover, 0.75, 1));
  ctx.fillRect(0, 0, 1920, 1080);
  ctx.globalAlpha = 1;
  for (let i = 0; i < 26; i++) {
    const edge = i % 4;
    const along = rand(i + 7);
    const x = edge === 0 ? -80 : edge === 1 ? 2000 : along * 1920;
    const y = edge === 2 ? -80 : edge === 3 ? 1160 : along * 1080;
    const rad = cover * (500 + rand(i + 3) * 700);
    if (rad < 2) continue;
    const g = ctx.createRadialGradient(x, y, rad * 0.2, x, y, rad);
    g.addColorStop(0, 'rgba(7,9,12,1)');
    g.addColorStop(0.75, 'rgba(7,9,12,0.92)');
    g.addColorStop(1, 'rgba(7,9,12,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
