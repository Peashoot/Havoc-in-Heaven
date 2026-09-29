import type { SceneDef } from '../engine/scene.ts';
import { placeholder } from './placeholder.ts';
import s01 from './s01.ts';
import s12 from './s12.ts';

const done: SceneDef[] = [s01, s12];

export const SCENES: Record<number, SceneDef> = {};
for (let id = 1; id <= 22; id++) SCENES[id] = done.find((s) => s.id === id) ?? placeholder(id);
