import { actorsSvg, updateActors } from './actors.ts';
import { drawAtmosphere, drawBackdrop } from './clouds.ts';
import { drawEffects } from './effects.ts';
import { drawFilmAtmosphere } from './filmCanvas.ts';
import { initFilm3D, type Film3D } from './film3d.ts';
import { sceneArtwork } from './sceneArtwork.ts';
import { filmState, sceneOneState, FPS, TOTAL_FRAMES, type FilmState } from './timeline.ts';

declare global {
  interface Window {
    renderFrame: (frameNumber: number) => void;
  }
}

export let film3d: Film3D | null = null;
let currentDoc: any = null;
let currentWin: any = null;
let stage: HTMLElement | null = null;
let world: HTMLElement | null = null;
let actors: HTMLElement | null = null;
let darkness: HTMLElement | null = null;
let title: HTMLElement | null = null;
let flash: HTMLElement | null = null;
let backCtx: CanvasRenderingContext2D | null = null;
let frontCtx: CanvasRenderingContext2D | null = null;
let fxCtx: CanvasRenderingContext2D | null = null;
let webglCanvas: HTMLCanvasElement | null = null;

let displayedScene = 0;
let manualFrame = false;

export function fitStage(winOverride?: any) {
  if (!stage) return;
  const win = winOverride ?? currentWin ?? (typeof window !== 'undefined' ? window : null);
  if (!win) return;
  const scale = Math.min(win.innerWidth / 1920, win.innerHeight / 1080);
  stage.style.transform = `translate(${(win.innerWidth - 1920 * scale) / 2}px, ${(win.innerHeight - 1080 * scale) / 2}px) scale(${scale})`;
}

const reveal = (value: number) => Math.min(1, Math.max(0, value));

function setOpacity(selector: string, value: number) {
  const target = world?.querySelector<SVGElement>(selector);
  if (target) target.style.opacity = String(reveal(value));
}

function setTransform(selector: string, transform: string) {
  const target = world?.querySelector<SVGElement>(selector);
  if (target) target.setAttribute('transform', transform);
}

export function updateArtwork(state: FilmState) {
  const p = state.progress;
  if (state.scene === 2) {
    setTransform('.long-scroll-landscape', `translate(${-p * 7680} 0)`);
    setTransform('.raft', `translate(${610 + state.raftX * 250} 802)`);
    setOpacity('.voyage-gate', state.gateReveal);
    setOpacity('.raft', 1 - state.gateReveal);
    setOpacity('.sea-foreground', 1 - state.gateReveal);
  } else if (state.scene === 3) {
    setOpacity('.mountain-gate', state.gateReveal);
    setTransform('.ink-mist', `translate(${Math.sin(p * Math.PI) * -95} 0)`);
  } else if (state.scene === 5) {
    setOpacity('.heavenly-decree', 1 - reveal((p - 0.48) / 0.19));
    setTransform('.heavenly-decree', `translate(960 ${260 + p * 160}) scale(${0.72 + p * 0.53})`);
    setOpacity('.mountain-gate', state.gateReveal);
    setOpacity('.stone-stairs', state.gateReveal);
  } else if (state.scene === 6) {
    setTransform('.celestial-horses', `translate(${Math.sin(p * Math.PI * 8) * 42} 0)`);
    setOpacity('.high-court-officials', reveal((p - 0.4) / 0.28));
  } else if (state.scene === 7) {
    setOpacity('.banquet-door', 0.55 + state.gateReveal * 0.45);
    setTransform('.door-left', `translate(${-state.gateReveal * 155} 0)`);
    setTransform('.door-right', `translate(${state.gateReveal * 155} 0)`);
  } else if (state.scene === 8) {
    setOpacity('.feast-inserts', reveal((p - 0.34) / 0.14));
  } else if (state.scene === 9) {
    setTransform('.flying-crockery', `translate(${p * 85} ${-Math.sin(p * Math.PI) * 105}) rotate(${p * 20} 960 480)`);
  } else if (state.scene === 11) {
    setOpacity('.army-ranks', state.soldierReveal);
    setTransform('.army-ranks', `translate(0 ${-95 * (1 - state.soldierReveal)})`);
  } else if (state.scene === 12) {
    setTransform('.descending-spears', `translate(0 ${p * 420})`);
  } else if (state.scene === 16) {
    setOpacity('.closing-door', reveal((p - 0.45) / 0.23));
  } else if (state.scene === 17) {
    world?.querySelectorAll<SVGElement>('.furnace-flames path').forEach((path, index) => {
      path.style.opacity = String(reveal((p - index * 0.12) / 0.18));
    });
    setTransform('.furnace-flames', `translate(${Math.sin(p * Math.PI * 4) * 28} 0)`);
  } else if (state.scene === 18) {
    setOpacity('.eye-rays', state.eyeGlow);
    setOpacity('.furnace-cracks', reveal((p - 0.43) / 0.34));
  } else if (state.scene === 19) {
    setOpacity('.furnace-shards', state.debris);
    setOpacity('.released-color-trails', state.colorRelease);
  } else if (state.scene === 20) {
    world?.querySelectorAll<SVGElement>('.released-color-trails path').forEach((path, index) => {
      path.style.opacity = String(reveal((p - index * 0.17) / 0.18));
    });
  } else if (state.scene === 22) {
    setOpacity('.released-color-trails', state.colorRelease);
    setOpacity('.final-release', state.colorRelease);
  }
}

export function renderFrame(frameNumber: number, isManual = true): FilmState {
  if (isManual) {
    manualFrame = true;
  }
  // 1. Calculate deterministic film state
  const state = filmState(frameNumber);

  // 2. Scene switching & 2D SVG scene artwork update
  if (displayedScene !== state.scene) {
    if (world) {
      world.innerHTML = sceneArtwork(state.scene);
    }
    displayedScene = state.scene;
  }
  updateArtwork(state);

  const shakeX = Math.sin(state.frame * 2.41) * 22 * state.shake;
  const shakeY = Math.cos(state.frame * 3.17) * 17 * state.shake;
  if (world) {
    world.style.transform = `translate3d(${state.cameraX + shakeX}px, ${state.cameraY + shakeY}px, 0) scale(${state.cameraScale})`;
    world.style.opacity = String(state.scene === 1 ? state.palaceOpacity : 1);
  }

  // 3. 3D WebGL render
  if (film3d) {
    film3d.render(state);
  }

  // 4. 2D actor styling & 5-stage costume updates
  if (actors) {
    updateActors(state, actors);
  }

  // 5. 2D atmosphere & dynamic FX canvas drawing
  if (state.scene === 1) {
    const one = sceneOneState(state.frame);
    if (backCtx) drawBackdrop(backCtx, one);
    if (frontCtx) drawAtmosphere(frontCtx, one);
  } else {
    if (backCtx) backCtx.clearRect(0, 0, 1920, 1080);
    if (frontCtx) drawFilmAtmosphere(frontCtx, state);
  }
  if (fxCtx) {
    drawEffects(fxCtx, state);
  }

  // 6. Darkness, flash, final calligraphic title & #stage dataset attributes
  if (darkness) {
    darkness.style.opacity = String(state.darkness);
  }
  if (flash) {
    flash.style.opacity = String(state.flash);
    flash.style.background = state.scene === 5 ? '#fff1c8' : '#fff';
  }
  if (title) {
    title.style.opacity = String(state.titleOpacity);
    title.style.transform = `scale(${0.91 + state.titleOpacity * 0.09})`;
  }
  if (stage) {
    stage.dataset.frame = String(state.frame);
    stage.dataset.scene = String(state.scene);
  }

  return state;
}

export interface InitFilmOptions {
  film3d?: Film3D;
  autoPlay?: boolean;
}

export function initFilmApp(
  rootDoc?: any,
  rootWin?: any,
  options?: InitFilmOptions
) {
  const doc = rootDoc ?? (typeof document !== 'undefined' ? document : null);
  const win = rootWin ?? (typeof window !== 'undefined' ? window : null);

  if (!doc) return null;

  currentDoc = doc;
  currentWin = win;

  stage = doc.querySelector('#stage');
  world = doc.querySelector('#world');
  actors = doc.querySelector('#actors');
  darkness = doc.querySelector('#darkness');
  title = doc.querySelector('#final-title');
  flash = doc.querySelector('#flash');

  const backEl = doc.querySelector('#backdrop');
  backCtx = backEl?.getContext?.('2d') ?? null;
  const frontEl = doc.querySelector('#atmosphere');
  frontCtx = frontEl?.getContext?.('2d') ?? null;
  const fxEl = doc.querySelector('#effects');
  fxCtx = fxEl?.getContext?.('2d') ?? null;
  webglCanvas = doc.querySelector('#webgl-stage');

  if (actors) {
    actors.innerHTML = actorsSvg();
  }

  if (webglCanvas) {
    film3d = options?.film3d ?? initFilm3D(webglCanvas);
  }

  if (win) {
    win.renderFrame = (frame: number) => renderFrame(frame, true);
    win.addEventListener?.('resize', fitStage);
    fitStage();

    let requestedFrame: string | null = null;
    try {
      if (win.location?.search) {
        requestedFrame = new URLSearchParams(win.location.search).get('frame');
      }
    } catch {
      // ignore
    }

    if (requestedFrame !== null && Number.isFinite(Number(requestedFrame))) {
      renderFrame(Number(requestedFrame), true);
    } else if (options?.autoPlay !== false && typeof win.requestAnimationFrame === 'function') {
      const started = (win.performance ?? performance).now();
      const tick = (now: number) => {
        if (manualFrame) return;
        const frame = Math.min(TOTAL_FRAMES - 1, Math.floor(((now - started) / 1000) * FPS));
        renderFrame(frame, false);
        if (frame < TOTAL_FRAMES - 1) win.requestAnimationFrame(tick);
      };
      win.requestAnimationFrame(tick);
    }
  }

  return {
    renderFrame,
    fitStage,
    get film3d() { return film3d; },
    getDisplayedScene: () => displayedScene,
    resetCoordinator,
  };
}

export function resetCoordinator() {
  displayedScene = 0;
  manualFrame = false;
  if (film3d) {
    film3d.dispose();
    film3d = null;
  }
  stage = null;
  world = null;
  actors = null;
  darkness = null;
  title = null;
  flash = null;
  backCtx = null;
  frontCtx = null;
  fxCtx = null;
  webglCanvas = null;
  currentDoc = null;
  currentWin = null;
}

export function getDisplayedScene() {
  return displayedScene;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  initFilmApp(document, window);
}
