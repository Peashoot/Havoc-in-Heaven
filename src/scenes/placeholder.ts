import { plane, type SceneDef } from '../engine/scene.ts';
import { SCENE_NAMES } from '../timeline.ts';

/** Stand-in card used until a scene is implemented. */
export function placeholder(id: number): SceneDef {
  return {
    id,
    bg: '#1c2230',
    markup: () => plane(1, `<rect width="1920" height="1080" fill="#1c2230"/>
      <text class="brush" x="960" y="560" text-anchor="middle" font-size="120" fill="#6b7890">${String(id).padStart(2, '0')} ${SCENE_NAMES[id - 1]}</text>`),
    camera: (t) => ({ x: 960, y: 540, zoom: 1 + t.p * 0.05 }),
  };
}
