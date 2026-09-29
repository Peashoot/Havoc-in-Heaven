import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  initFilmApp,
  renderFrame,
  fitStage,
  updateArtwork,
  resetCoordinator,
  getDisplayedScene,
  film3d,
} from './main.ts';
import { filmState } from './timeline.ts';
import { actorsSvg } from './actors.ts';

// -------------------------------------------------------------
// Lightweight Mock DOM for Testing Coordinator in Node.js
// -------------------------------------------------------------
class MockStyle {
  [key: string]: any;
  opacity = '1';
  transform = '';
  background = '';
  display = '';
  filter = '';
}

class MockElement {
  tagName: string;
  id = '';
  className = '';
  style = new MockStyle();
  dataset: Record<string, string> = {};
  attributes: Record<string, string> = {};
  children: MockElement[] = [];
  _innerHTML = '';

  constructor(tagName = 'div') {
    this.tagName = tagName;
  }

  get innerHTML(): string {
    return this._innerHTML;
  }

  set innerHTML(html: string) {
    this._innerHTML = html;
    this.children = [];
    const tagRegex = /<([a-zA-Z0-9]+)([^>]*)>/g;
    let match;
    while ((match = tagRegex.exec(html)) !== null) {
      const tagName = match[1];
      const attrs = match[2];
      if (attrs.includes('id=') || attrs.includes('class=')) {
        const el = new MockElement(tagName);
        const idMatch = /id=["']([^"']+)["']/.exec(attrs);
        if (idMatch) el.id = idMatch[1];
        const classMatch = /class=["']([^"']+)["']/.exec(attrs);
        if (classMatch) el.className = classMatch[1];
        this.children.push(el);
      }
    }
  }

  setAttribute(k: string, v: string) {
    this.attributes[k] = v;
  }

  getAttribute(k: string): string | null {
    return this.attributes[k] ?? null;
  }

  querySelector(sel: string): MockElement | null {
    if (sel.startsWith('#')) {
      const id = sel.slice(1);
      if (this.id === id) return this;
      for (const c of this.children) {
        const found = c.querySelector(sel);
        if (found) return found;
      }
    } else if (sel.startsWith('.')) {
      const cls = sel.slice(1);
      if (this.className.split(/\s+/).includes(cls)) return this;
      for (const c of this.children) {
        const found = c.querySelector(sel);
        if (found) return found;
      }
    }
    return null;
  }

  querySelectorAll(sel: string): MockElement[] {
    const res: MockElement[] = [];
    if (sel.startsWith('.')) {
      const cls = sel.slice(1).split(' ')[0];
      if (this.className.split(/\s+/).includes(cls)) res.push(this);
    }
    for (const c of this.children) {
      res.push(...c.querySelectorAll(sel));
    }
    return res;
  }
}

class Mock2DContext {
  fillStyle: any = '#000';
  strokeStyle: any = '#000';
  lineWidth = 1;
  lineCap = 'butt';
  lineJoin = 'miter';
  globalAlpha = 1;
  globalCompositeOperation = 'source-over';
  shadowColor = 'transparent';
  shadowBlur = 0;
  shadowOffsetX = 0;
  shadowOffsetY = 0;
  font = '10px sans-serif';
  textAlign = 'start';
  textBaseline = 'alphabetic';
  calls: { method: string; args: any[] }[] = [];

  private gradientMock = {
    addColorStop: (offset: number, color: string) => {
      this.calls.push({ method: 'addColorStop', args: [offset, color] });
    },
  };

  clearRect(x: number, y: number, w: number, h: number) { this.calls.push({ method: 'clearRect', args: [x, y, w, h] }); }
  fillRect(x: number, y: number, w: number, h: number) { this.calls.push({ method: 'fillRect', args: [x, y, w, h] }); }
  strokeRect(x: number, y: number, w: number, h: number) { this.calls.push({ method: 'strokeRect', args: [x, y, w, h] }); }
  save() { this.calls.push({ method: 'save', args: [] }); }
  restore() { this.calls.push({ method: 'restore', args: [] }); }
  beginPath() { this.calls.push({ method: 'beginPath', args: [] }); }
  closePath() { this.calls.push({ method: 'closePath', args: [] }); }
  moveTo(x: number, y: number) { this.calls.push({ method: 'moveTo', args: [x, y] }); }
  lineTo(x: number, y: number) { this.calls.push({ method: 'lineTo', args: [x, y] }); }
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
    this.calls.push({ method: 'bezierCurveTo', args: [cp1x, cp1y, cp2x, cp2y, x, y] });
  }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this.calls.push({ method: 'quadraticCurveTo', args: [cpx, cpy, x, y] });
  }
  arc(x: number, y: number, r: number, sa = 0, ea = Math.PI * 2, cc = false) {
    this.calls.push({ method: 'arc', args: [x, y, r, sa, ea, cc] });
  }
  ellipse(x: number, y: number, rx: number, ry: number, rot = 0, sa = 0, ea = Math.PI * 2, cc = false) {
    this.calls.push({ method: 'ellipse', args: [x, y, rx, ry, rot, sa, ea, cc] });
  }
  rect(x: number, y: number, w: number, h: number) { this.calls.push({ method: 'rect', args: [x, y, w, h] }); }
  fill() { this.calls.push({ method: 'fill', args: [] }); }
  stroke() { this.calls.push({ method: 'stroke', args: [] }); }
  setLineDash() {}
  getLineDash() { return []; }
  translate(x: number, y: number) { this.calls.push({ method: 'translate', args: [x, y] }); }
  rotate(a: number) { this.calls.push({ method: 'rotate', args: [a] }); }
  scale(sx: number, sy: number) { this.calls.push({ method: 'scale', args: [sx, sy] }); }
  setTransform() {}
  resetTransform() {}
  createLinearGradient() { return this.gradientMock; }
  createRadialGradient() { return this.gradientMock; }
  drawImage() {}
}

class MockCanvasElement extends MockElement {
  width = 1920;
  height = 1080;
  context2d = new Mock2DContext();

  constructor(tagName = 'canvas') {
    super(tagName);
  }

  getContext(type: string) {
    if (type === '2d') return this.context2d;
    return null;
  }

  addEventListener() {}
  removeEventListener() {}
}

interface TestDOM {
  doc: {
    querySelector: (sel: string) => MockElement | null;
  };
  win: {
    innerWidth: number;
    innerHeight: number;
    location: { search: string };
    addEventListener: (event: string, fn: any) => void;
    removeEventListener: (event: string, fn: any) => void;
    renderFrame?: (f: number) => void;
    requestAnimationFrame?: (fn: any) => number;
    performance: { now: () => number };
  };
  elements: {
    stage: MockElement;
    world: MockElement;
    actors: MockElement;
    darkness: MockElement;
    title: MockElement;
    flash: MockElement;
    backdrop: MockCanvasElement;
    atmosphere: MockCanvasElement;
    effects: MockCanvasElement;
    webglStage: MockCanvasElement;
  };
}

function createTestDOM(search = ''): TestDOM {
  const stage = new MockElement('main');
  stage.id = 'stage';

  const world = new MockElement('div');
  world.id = 'world';

  const actors = new MockElement('div');
  actors.id = 'actors';

  const darkness = new MockElement('div');
  darkness.id = 'darkness';

  const title = new MockElement('div');
  title.id = 'final-title';

  const flash = new MockElement('div');
  flash.id = 'flash';

  const backdrop = new MockCanvasElement('canvas');
  backdrop.id = 'backdrop';

  const atmosphere = new MockCanvasElement('canvas');
  atmosphere.id = 'atmosphere';

  const effects = new MockCanvasElement('canvas');
  effects.id = 'effects';

  const webglStage = new MockCanvasElement('canvas');
  webglStage.id = 'webgl-stage';

  const registry: Record<string, MockElement> = {
    '#stage': stage,
    '#world': world,
    '#actors': actors,
    '#darkness': darkness,
    '#final-title': title,
    '#flash': flash,
    '#backdrop': backdrop,
    '#atmosphere': atmosphere,
    '#effects': effects,
    '#webgl-stage': webglStage,
  };

  const doc = {
    querySelector: (sel: string) => registry[sel] ?? null,
  };

  const listeners: Record<string, Function[]> = {};
  const win = {
    innerWidth: 1920,
    innerHeight: 1080,
    location: { search },
    addEventListener: (event: string, fn: Function) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(fn);
    },
    removeEventListener: (event: string, fn: Function) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((f) => f !== fn);
      }
    },
    performance: { now: () => 0 },
  };

  return {
    doc,
    win,
    elements: {
      stage,
      world,
      actors,
      darkness,
      title,
      flash,
      backdrop,
      atmosphere,
      effects,
      webglStage,
    },
  };
}

describe('Task 7: Unified Rendering Coordinator (src/main.ts)', () => {
  beforeEach(() => {
    resetCoordinator();
  });

  describe('Step 1: Pipeline Initialization and Component Wiring', () => {
    test('initializes coordinator, sets up actors SVG and creates 3D WebGL renderer', () => {
      const dom = createTestDOM();
      const coordinator = initFilmApp(dom.doc, dom.win, { autoPlay: false });

      assert.ok(coordinator, 'coordinator instance returned');
      assert.ok(dom.elements.actors.innerHTML.includes('svg'), 'actors populated with SVG');
      assert.ok(coordinator.film3d, '3D WebGL renderer initialized on #webgl-stage');
      assert.equal(typeof dom.win.renderFrame, 'function', 'window.renderFrame registered');
    });

    test('renders a frame through full pipeline in strict execution sequence', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      // Render Scene 2 frame (漂洋过海)
      const state = renderFrame(200);

      assert.equal(state.frame, 200);
      assert.equal(state.scene, 2);
      assert.equal(getDisplayedScene(), 2);

      // Verify #stage data attributes
      assert.equal(dom.elements.stage.dataset.frame, '200');
      assert.equal(dom.elements.stage.dataset.scene, '2');

      // Verify world innerHTML contains scene SVG
      assert.ok(dom.elements.world.innerHTML.includes('svg'), 'world populated with sceneArtwork');

      // Verify camera transform on world container
      assert.ok(dom.elements.world.style.transform.includes('translate3d'));
      assert.ok(dom.elements.world.style.transform.includes('scale'));

      // Verify 2D effects context drew content
      assert.ok(dom.elements.effects.context2d.calls.length > 0, 'effects canvas called');
    });
  });

  describe('Step 2: Single-Frame Seeking across 9 Critical Milestones', () => {
    test('Frame 75 (Scene 1: 云海天宫) - sceneOne atmosphere and palace opacity', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      const state = renderFrame(75);
      assert.equal(state.scene, 1);
      assert.equal(dom.elements.stage.dataset.frame, '75');
      assert.equal(dom.elements.stage.dataset.scene, '1');
      assert.equal(dom.elements.world.style.opacity, String(state.palaceOpacity));
      // In scene 1, backdrop draws cloud layers
      assert.ok(dom.elements.backdrop.context2d.calls.length > 0);
    });

    test('Frame 200 (Scene 2: 木筏求学布衣) - pilgrim costume and long landscape scroll', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      const state = renderFrame(200);
      assert.equal(state.scene, 2);
      assert.equal(state.costumeStage, 'pilgrim');
      assert.equal(dom.elements.stage.dataset.frame, '200');
      assert.equal(dom.elements.stage.dataset.scene, '2');

      const landscape = dom.elements.world.querySelector('.long-scroll-landscape');
      assert.ok(landscape, 'landscape element present');
      assert.ok(landscape.getAttribute('transform')?.includes('translate'), 'landscape scrolled');

      const raft = dom.elements.world.querySelector('.raft');
      assert.ok(raft, 'raft present');
      assert.ok(raft.getAttribute('transform')?.includes('translate'), 'raft translated');
    });

    test('Frame 480 (Scene 4: 花果山美猴王常服) - monkey king costume', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      const state = renderFrame(480);
      assert.equal(state.scene, 4);
      assert.equal(state.costumeStage, 'monkeyKing');
      assert.equal(dom.elements.stage.dataset.frame, '480');
      assert.equal(dom.elements.stage.dataset.scene, '4');
    });

    test('Frame 750 (Scene 6: 弼马温官袍) - bima costume and celestial horses drift', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      const state = renderFrame(750);
      assert.equal(state.scene, 6);
      assert.equal(state.costumeStage, 'bima');
      assert.equal(dom.elements.stage.dataset.frame, '750');
      assert.equal(dom.elements.stage.dataset.scene, '6');

      const horses = dom.elements.world.querySelector('.celestial-horses');
      assert.ok(horses, 'celestial horses present in scene 6 artwork');
      assert.ok(horses.getAttribute('transform')?.includes('translate'));
    });

    test('Frame 1050 (Scene 8: 蟠桃会大醉) - banquet inserts reveal', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      const state = renderFrame(1050);
      assert.equal(state.scene, 8);
      assert.equal(state.costumeStage, 'bima');
      assert.equal(dom.elements.stage.dataset.frame, '1050');
      assert.equal(dom.elements.stage.dataset.scene, '8');

      const feast = dom.elements.world.querySelector('.feast-inserts');
      assert.ok(feast, 'feast inserts present in scene 8 artwork');
      assert.notEqual(feast.style.opacity, '');
    });

    test('Frame 1600 (Scene 12: 齐天大圣战甲第一棒) - greatSage armor and descending spears', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      const state = renderFrame(1600);
      assert.equal(state.scene, 12);
      assert.equal(state.costumeStage, 'greatSage');
      assert.equal(dom.elements.stage.dataset.frame, '1600');
      assert.equal(dom.elements.stage.dataset.scene, '12');

      const spears = dom.elements.world.querySelector('.descending-spears');
      assert.ok(spears, 'descending spears present in scene 12 artwork');
      assert.ok(spears.getAttribute('transform')?.includes('translate'));
    });

    test('Frame 2300 (Scene 17: 八卦炉烈火金睛) - furnace gold costume and flames', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      const state = renderFrame(2300);
      assert.equal(state.scene, 17);
      assert.equal(state.costumeStage, 'furnaceGold');
      assert.ok(state.fire > 0, 'fire intensity active');
      assert.equal(dom.elements.stage.dataset.frame, '2300');
      assert.equal(dom.elements.stage.dataset.scene, '17');

      const flames = dom.elements.world.querySelector('.furnace-flames');
      assert.ok(flames, 'furnace flames present');
      assert.ok(flames.getAttribute('transform')?.includes('translate'));
    });

    test('Frame 2550 (Scene 19: 破炉五彩爆发) - furnace shards and color release', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      const state = renderFrame(2550);
      assert.equal(state.scene, 19);
      assert.equal(state.costumeStage, 'furnaceGold');
      assert.ok(state.colorRelease > 0, 'color release active');
      assert.equal(dom.elements.stage.dataset.frame, '2550');
      assert.equal(dom.elements.stage.dataset.scene, '19');

      const trails = dom.elements.world.querySelector('.released-color-trails');
      assert.ok(trails, 'color trails present in scene 19 artwork');
      assert.equal(trails.style.opacity, String(state.colorRelease));

      // Also verify full furnace shatter and debris explosion slightly later in Scene 19 (frame 2580)
      const state2580 = renderFrame(2580);
      assert.ok(state2580.debris > 0, 'debris explosion active at peak burst');
      const shards = dom.elements.world.querySelector('.furnace-shards');
      assert.ok(shards, 'furnace shards present in scene 19 artwork');
      assert.equal(shards.style.opacity, String(state2580.debris));
    });

    test('Frame 3100 (Scene 22: 片尾书法标题) - final title full opacity', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      const state = renderFrame(3100);
      assert.equal(state.scene, 22);
      assert.equal(state.costumeStage, 'greatSage');
      assert.equal(state.titleOpacity, 1);
      assert.equal(dom.elements.stage.dataset.frame, '3100');
      assert.equal(dom.elements.stage.dataset.scene, '22');

      assert.equal(dom.elements.title.style.opacity, '1');
      assert.ok(dom.elements.title.style.transform.includes('scale'));
    });
  });

  describe('Step 3: Sizing, URL Query Seeking, and Scrubbing Determinism', () => {
    test('fitStage scales and translates stage container proportionally to window size', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      // Window matches exact 1920x1080 resolution
      dom.win.innerWidth = 1920;
      dom.win.innerHeight = 1080;
      fitStage();
      assert.equal(dom.elements.stage.style.transform, 'translate(0px, 0px) scale(1)');

      // Window half size 960x540
      dom.win.innerWidth = 960;
      dom.win.innerHeight = 540;
      fitStage();
      assert.equal(dom.elements.stage.style.transform, 'translate(0px, 0px) scale(0.5)');

      // Letterbox width 1920x540 (constrained by height)
      dom.win.innerWidth = 1920;
      dom.win.innerHeight = 540;
      fitStage();
      assert.equal(dom.elements.stage.style.transform, 'translate(480px, 0px) scale(0.5)');
    });

    test('seeking directly via URL query parameter ?frame=1600 on init', () => {
      const dom = createTestDOM('?frame=1600');
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      assert.equal(dom.elements.stage.dataset.frame, '1600');
      assert.equal(dom.elements.stage.dataset.scene, '12');
    });

    test('scrubbing determinism: back-and-forth seeks produce identical rendering outcomes', () => {
      const dom = createTestDOM();
      initFilmApp(dom.doc, dom.win, { autoPlay: false });

      // 1. Render frame 75 first time
      const stateA1 = renderFrame(75);
      const stageFrame1 = dom.elements.stage.dataset.frame;
      const stageScene1 = dom.elements.stage.dataset.scene;
      const opacity1 = dom.elements.world.style.opacity;
      const transform1 = dom.elements.world.style.transform;

      // 2. Jump to frame 2550 (scene 19 explosion)
      renderFrame(2550);
      assert.equal(dom.elements.stage.dataset.frame, '2550');
      assert.equal(dom.elements.stage.dataset.scene, '19');

      // 3. Jump back to frame 75
      const stateA2 = renderFrame(75);
      const stageFrame2 = dom.elements.stage.dataset.frame;
      const stageScene2 = dom.elements.stage.dataset.scene;
      const opacity2 = dom.elements.world.style.opacity;
      const transform2 = dom.elements.world.style.transform;

      assert.deepEqual(stateA1, stateA2, 'FilmState is 100% deterministic');
      assert.equal(stageFrame1, stageFrame2);
      assert.equal(stageScene1, stageScene2);
      assert.equal(opacity1, opacity2);
      assert.equal(transform1, transform2);
    });
  });
});
