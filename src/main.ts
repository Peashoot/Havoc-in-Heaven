import './style.css';
import { actorsSvg, updateActors } from './actors';
import { drawAtmosphere, drawBackdrop } from './clouds';
import { drawEffects } from './effects';
import { drawFilmAtmosphere } from './filmCanvas';
import { sceneArtwork } from './sceneArtwork';
import { filmState, sceneOneState, FPS, TOTAL_FRAMES, type FilmState } from './timeline';

declare global {
  interface Window { renderFrame: (frameNumber: number) => void; }
}

const stage = document.querySelector<HTMLElement>('#stage')!;
const world = document.querySelector<HTMLElement>('#world')!;
const actors = document.querySelector<HTMLElement>('#actors')!;
const darkness = document.querySelector<HTMLElement>('#darkness')!;
const title = document.querySelector<HTMLElement>('#final-title')!;
const flash = document.querySelector<HTMLElement>('#flash')!;
const backCtx = document.querySelector<HTMLCanvasElement>('#backdrop')!.getContext('2d')!;
const frontCtx = document.querySelector<HTMLCanvasElement>('#atmosphere')!.getContext('2d')!;
const fxCtx = document.querySelector<HTMLCanvasElement>('#effects')!.getContext('2d')!;
actors.innerHTML = actorsSvg();

function fitStage() {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  stage.style.transform = `translate(${(window.innerWidth - 1920 * scale) / 2}px, ${(window.innerHeight - 1080 * scale) / 2}px) scale(${scale})`;
}

const reveal = (value: number) => Math.min(1, Math.max(0, value));
function setOpacity(selector: string, value: number) {
  const target = world.querySelector<SVGElement>(selector);
  if (target) target.style.opacity = String(reveal(value));
}
function setTransform(selector: string, transform: string) {
  const target = world.querySelector<SVGElement>(selector);
  if (target) target.setAttribute('transform', transform);
}

function updateArtwork(state: FilmState) {
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
    world.querySelectorAll<SVGElement>('.furnace-flames path').forEach((path, index) => {
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
    world.querySelectorAll<SVGElement>('.released-color-trails path').forEach((path, index) => {
      path.style.opacity = String(reveal((p - index * 0.17) / 0.18));
    });
  } else if (state.scene === 22) {
    setOpacity('.released-color-trails', state.colorRelease);
    setOpacity('.final-release', state.colorRelease);
  }
}

let displayedScene = 0;
let manualFrame = false;
export function renderFrame(frameNumber: number) {
  manualFrame = true;
  const state = filmState(frameNumber);
  if (displayedScene !== state.scene) {
    world.innerHTML = sceneArtwork(state.scene);
    displayedScene = state.scene;
  }
  updateArtwork(state);

  const shakeX = Math.sin(state.frame * 2.41) * 22 * state.shake;
  const shakeY = Math.cos(state.frame * 3.17) * 17 * state.shake;
  world.style.transform = `translate3d(${state.cameraX + shakeX}px, ${state.cameraY + shakeY}px, 0) scale(${state.cameraScale})`;
  world.style.opacity = String(state.scene === 1 ? state.palaceOpacity : 1);
  updateActors(state, actors);

  if (state.scene === 1) {
    const one = sceneOneState(state.frame);
    drawBackdrop(backCtx, one);
    drawAtmosphere(frontCtx, one);
  } else {
    backCtx.clearRect(0, 0, 1920, 1080);
    drawFilmAtmosphere(frontCtx, state);
  }
  drawEffects(fxCtx, state);
  darkness.style.opacity = String(state.darkness);
  flash.style.opacity = String(state.flash);
  flash.style.background = state.scene === 5 ? '#fff1c8' : '#fff';
  title.style.opacity = String(state.titleOpacity);
  title.style.transform = `scale(${0.91 + state.titleOpacity * 0.09})`;
  stage.dataset.frame = String(state.frame);
  stage.dataset.scene = String(state.scene);
}

window.renderFrame = renderFrame;
window.addEventListener('resize', fitStage);
fitStage();

const requestedFrame = new URLSearchParams(window.location.search).get('frame');
if (requestedFrame !== null && Number.isFinite(Number(requestedFrame))) {
  renderFrame(Number(requestedFrame));
} else {
  const started = performance.now();
  const tick = (now: number) => {
    if (manualFrame) return;
    const frame = Math.min(TOTAL_FRAMES - 1, Math.floor(((now - started) / 1000) * FPS));
    renderFrame(frame);
    manualFrame = false;
    if (frame < TOTAL_FRAMES - 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
