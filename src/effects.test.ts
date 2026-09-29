import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { drawEffects, goldenCrescentTrails, expandingShockwave } from './effects.ts';
import { drawFilmAtmosphere, samadhiFire, fiveColorFluidRibbons, FIVE_COLORS } from './filmCanvas.ts';
import { filmState, TOTAL_FRAMES, SCENE_BOUNDS } from './timeline.ts';

function createMockContext2D() {
  const calls: { method: string; args: any[] }[] = [];
  const state = {
    fillStyle: '#000000' as any,
    strokeStyle: '#000000' as any,
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    shadowColor: 'transparent',
    shadowBlur: 0,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
  };

  const gradientMock = {
    addColorStop: (offset: number, color: string) => {
      calls.push({ method: 'addColorStop', args: [offset, color] });
    },
  };

  const ctx = {
    ...state,
    calls,
    save: () => { calls.push({ method: 'save', args: [] }); },
    restore: () => { calls.push({ method: 'restore', args: [] }); },
    clearRect: (x: number, y: number, w: number, h: number) => {
      calls.push({ method: 'clearRect', args: [x, y, w, h] });
    },
    fillRect: (x: number, y: number, w: number, h: number) => {
      calls.push({ method: 'fillRect', args: [x, y, w, h, ctx.fillStyle] });
    },
    strokeRect: (x: number, y: number, w: number, h: number) => {
      calls.push({ method: 'strokeRect', args: [x, y, w, h] });
    },
    beginPath: () => { calls.push({ method: 'beginPath', args: [] }); },
    closePath: () => { calls.push({ method: 'closePath', args: [] }); },
    moveTo: (x: number, y: number) => { calls.push({ method: 'moveTo', args: [x, y] }); },
    lineTo: (x: number, y: number) => { calls.push({ method: 'lineTo', args: [x, y] }); },
    arc: (x: number, y: number, r: number, sa: number, ea: number, cc?: boolean) => {
      calls.push({ method: 'arc', args: [x, y, r, sa, ea, cc] });
    },
    ellipse: (x: number, y: number, rx: number, ry: number, rot: number, sa: number, ea: number, cc?: boolean) => {
      calls.push({ method: 'ellipse', args: [x, y, rx, ry, rot, sa, ea, cc] });
    },
    quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => {
      calls.push({ method: 'quadraticCurveTo', args: [cpx, cpy, x, y] });
    },
    bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => {
      calls.push({ method: 'bezierCurveTo', args: [cp1x, cp1y, cp2x, cp2y, x, y] });
    },
    fill: () => { calls.push({ method: 'fill', args: [] }); },
    stroke: () => { calls.push({ method: 'stroke', args: [] }); },
    translate: (x: number, y: number) => { calls.push({ method: 'translate', args: [x, y] }); },
    rotate: (angle: number) => { calls.push({ method: 'rotate', args: [angle] }); },
    scale: (sx: number, sy: number) => { calls.push({ method: 'scale', args: [sx, sy] }); },
    fillText: (text: string, x: number, y: number) => { calls.push({ method: 'fillText', args: [text, x, y] }); },
    strokeText: (text: string, x: number, y: number) => { calls.push({ method: 'strokeText', args: [text, x, y] }); },
    createLinearGradient: (x0: number, y0: number, x1: number, y1: number) => {
      calls.push({ method: 'createLinearGradient', args: [x0, y0, x1, y1] });
      return gradientMock;
    },
    createRadialGradient: (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) => {
      calls.push({ method: 'createRadialGradient', args: [x0, y0, r0, x1, y1, r1] });
      return gradientMock;
    },
  } as unknown as CanvasRenderingContext2D & { calls: { method: string; args: any[] }[] };

  return ctx;
}

describe('Task 6: Canvas dynamic FX and staff motion trails', () => {
  describe('Step 1: Golden Crescent Motion Arc Trails (金箍棒半月弧光斩痕)', () => {
    test('renders golden crescent curves and gradients when staff is visible and glowing', () => {
      const ctx = createMockContext2D();
      // Scene 12 (frame 1600): The great sage swings the staff
      const state = filmState(1600);
      assert.ok(state.staffVisible > 0);
      assert.ok(state.staffGlow > 0);

      goldenCrescentTrails(ctx, state, ['#f4cc76', '#d8964a', '#fff0b5']);

      const hasLinearGrad = ctx.calls.some((c) => c.method === 'createLinearGradient');
      const hasCurves = ctx.calls.some((c) => c.method === 'quadraticCurveTo');
      const hasSparks = ctx.calls.some((c) => c.method === 'lineTo' || c.method === 'arc');

      assert.ok(hasLinearGrad, 'should generate linear gradients for flowing crescent luster');
      assert.ok(hasCurves, 'should use curve interpolation for heavy crescent blade shape');
      assert.ok(hasSparks, 'should emit cutting sparks and flakes along the arc');
    });

    test('skips crescent trails when staff is hidden (staffVisible = 0)', () => {
      const ctx = createMockContext2D();
      // Scene 6 (Bi Ma Wen, no weapon)
      const state = filmState(750);
      assert.equal(state.staffVisible, 0);

      goldenCrescentTrails(ctx, state, ['#f4cc76']);
      assert.equal(ctx.calls.length, 0);
    });

    test('supports staff swinging across key combat scenes (Scene 4, 9, 12, 13, 19, 20, 22)', () => {
      const testFrames = [480, 1200, 1605, 1750, 2550, 2700, 3050];
      for (const frame of testFrames) {
        const ctx = createMockContext2D();
        const state = filmState(frame);
        assert.doesNotThrow(() => drawEffects(ctx, state));
        assert.ok(ctx.calls.length > 0);
      }
    });
  });

  describe('Step 2: Shockwaves and pure white freeze frame impact', () => {
    test('draws expanding golden ink-wave shockwave and sparks when shockwave > 0', () => {
      const ctx = createMockContext2D();
      // Scene 12 strike after impact (frame 1625)
      const state = filmState(1625);
      assert.ok(state.shockwave > 0);

      expandingShockwave(ctx, state, ['#ffd700', '#ff8c00', '#ffffff']);

      const hasRadialGrad = ctx.calls.some((c) => c.method === 'createRadialGradient');
      const hasInkRings = ctx.calls.some((c) => c.method === 'lineTo' || c.method === 'ellipse');
      const hasSparkDots = ctx.calls.some((c) => c.method === 'arc');

      assert.ok(hasRadialGrad, 'should draw radial ground-zero blast disc');
      assert.ok(hasInkRings, 'should draw undulating concentric ink rings');
      assert.ok(hasSparkDots, 'should launch flying golden sparks');
    });

    test('triggers pure white freeze frame at frames 1612 and 1613', () => {
      for (const frame of [1612, 1613]) {
        const ctx = createMockContext2D();
        const state = filmState(frame);
        drawEffects(ctx, state);

        const fillRectCall = ctx.calls.find((c) => c.method === 'fillRect');
        assert.ok(fillRectCall, `Frame ${frame} should call fillRect`);
        assert.deepEqual(fillRectCall?.args.slice(0, 4), [0, 0, 1920, 1080]);
        assert.equal(fillRectCall?.args[4], '#ffffff', `Frame ${frame} must fill pure white #ffffff`);
      }

      // Adjacent frames should not freeze in pure white
      const ctxBefore = createMockContext2D();
      drawEffects(ctxBefore, filmState(1611));
      const fillBefore = ctxBefore.calls.find((c) => c.method === 'fillRect' && c.args[4] === '#ffffff');
      assert.equal(fillBefore, undefined, 'Frame 1611 should not freeze in pure white');

      const ctxAfter = createMockContext2D();
      drawEffects(ctxAfter, filmState(1614));
      const fillAfter = ctxAfter.calls.find((c) => c.method === 'fillRect' && c.args[4] === '#ffffff');
      assert.equal(fillAfter, undefined, 'Frame 1614 should not freeze in pure white');
    });
  });

  describe('Step 3: Multi-tiered Samadhi Fire and Five-color Fluid Ribbons (src/filmCanvas.ts)', () => {
    test('samadhiFire renders multi-tiered flame tongues with bezier curves and vortex embers', () => {
      const ctx = createMockContext2D();
      // Scene 17 (Bagua furnace fire, frame 2300)
      const state = filmState(2300);
      assert.ok(state.fire > 0);

      samadhiFire(ctx, state);

      const hasRadialHearth = ctx.calls.some((c) => c.method === 'createRadialGradient');
      const hasBezierFlames = ctx.calls.some((c) => c.method === 'bezierCurveTo');
      const hasVortexEmbers = ctx.calls.some((c) => c.method === 'arc');

      assert.ok(hasRadialHearth, 'should render alchemical hearth glow');
      assert.ok(hasBezierFlames, 'should use cubic bezier curves for curling fire tongues');
      assert.ok(hasVortexEmbers, 'should render swirling convective vortex embers');
    });

    test('fiveColorFluidRibbons uses the 5 sacred colors and bursts like surging rivers', () => {
      assert.equal(FIVE_COLORS.length, 5);
      const colorNames = FIVE_COLORS.map((c) => c.name);
      assert.deepEqual(colorNames, ['暗红', '赤橙', '金黄', '青绿', '紫蓝']);

      // Scene 19 (Breaking furnace explosion, frame 2550)
      const ctx19 = createMockContext2D();
      const s19 = filmState(2550);
      assert.ok(s19.colorRelease > 0);
      fiveColorFluidRibbons(ctx19, s19);

      const bezierCalls19 = ctx19.calls.filter((c) => c.method === 'bezierCurveTo');
      assert.ok(bezierCalls19.length >= 15, 'Scene 19 should erupt with sweeping radial bezier arms');

      // Scene 22 (Havoc in Heaven celestial fluid ribbons, frame 3000)
      const ctx22 = createMockContext2D();
      const s22 = filmState(3000);
      assert.ok(s22.colorRelease > 0);
      fiveColorFluidRibbons(ctx22, s22);

      const bezierCalls22 = ctx22.calls.filter((c) => c.method === 'bezierCurveTo');
      assert.ok(bezierCalls22.length >= 8, 'Scene 22 should render undulating fluid ribbons traversing heaven');
    });

    test('drawFilmAtmosphere seamlessly drives atmosphere across all 22 scene bounds', () => {
      for (let s = 1; s <= 22; s++) {
        const frame = SCENE_BOUNDS[s - 1];
        const ctx = createMockContext2D();
        const state = filmState(frame);
        assert.doesNotThrow(() => drawFilmAtmosphere(ctx, state), `Scene ${s} (frame ${frame}) threw error`);
        assert.ok(ctx.calls.length > 0, `Scene ${s} should have generated draw commands`);
      }
    });
  });

  describe('Robustness and Determinism across all film frames', () => {
    test('renders cleanly on sample frames across the entire 3150 frame timeline', () => {
      const step = 75;
      for (let f = 0; f < TOTAL_FRAMES; f += step) {
        const state = filmState(f);
        const fxCtx = createMockContext2D();
        const atmoCtx = createMockContext2D();

        assert.doesNotThrow(() => drawEffects(fxCtx, state), `drawEffects threw on frame ${f}`);
        assert.doesNotThrow(() => drawFilmAtmosphere(atmoCtx, state), `drawFilmAtmosphere threw on frame ${f}`);
      }
    });
  });
});
