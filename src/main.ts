import { Renderer } from './engine/render.ts';
import { RIG_DEFS } from './rig/hero.ts';
import { KIT_DEFS } from './scenes/kit.ts';
import { SCENES } from './scenes/index.ts';
import { FPS, TOTAL_FRAMES } from './timeline.ts';

declare global {
  interface Window { renderFrame: (frameNumber: number) => void }
}

export const GLOBAL_DEFS = `${RIG_DEFS}${KIT_DEFS}
  <filter id="whip0" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation="0 0"/></filter>
  <filter id="whip1" x="-20%" y="0" width="140%" height="100%"><feGaussianBlur stdDeviation="0 0"/></filter>
  <filter id="rig-scorch"><feColorMatrix type="matrix" values=".66 .12 0 0 .02  .05 .42 0 0 0  0 0 .36 0 0  0 0 0 1 0"/></filter>`;

function fitStage(stage: HTMLElement) {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  stage.style.transform = `translate(${(window.innerWidth - 1920 * scale) / 2}px, ${(window.innerHeight - 1080 * scale) / 2}px) scale(${scale})`;
}

function init() {
  const stage = document.getElementById('stage');
  if (!stage) return;
  document.querySelector('#defs defs')!.innerHTML = GLOBAL_DEFS;
  const renderer = new Renderer(
    stage,
    SCENES,
    [document.getElementById('slot0') as HTMLDivElement, document.getElementById('slot1') as HTMLDivElement],
    document.getElementById('fx') as HTMLCanvasElement,
    document.getElementById('tx') as HTMLCanvasElement,
  );
  let manual = false;
  window.renderFrame = (frame: number) => { manual = true; renderer.render(frame); };
  window.addEventListener('resize', () => fitStage(stage));
  fitStage(stage);

  const requested = new URLSearchParams(location.search).get('frame');
  if (requested !== null && Number.isFinite(Number(requested))) {
    renderer.render(Number(requested));
    return;
  }
  const started = performance.now();
  const tick = (now: number) => {
    if (manual) return;
    const frame = Math.min(TOTAL_FRAMES - 1, Math.floor(((now - started) / 1000) * FPS));
    renderer.render(frame);
    if (frame < TOTAL_FRAMES - 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

init();
