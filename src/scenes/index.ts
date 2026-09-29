import type { SceneDef } from '../engine/scene.ts';
import s01 from './s01.ts';
import s02 from './s02.ts';
import s03 from './s03.ts';
import s04 from './s04.ts';
import s05 from './s05.ts';
import s06 from './s06.ts';
import s07 from './s07.ts';
import s08 from './s08.ts';
import s09 from './s09.ts';
import s10 from './s10.ts';
import s11 from './s11.ts';
import s12 from './s12.ts';
import s13 from './s13.ts';
import s14 from './s14.ts';
import s15 from './s15.ts';
import s16 from './s16.ts';
import s17 from './s17.ts';
import s18 from './s18.ts';
import s19 from './s19.ts';
import s20 from './s20.ts';
import s21 from './s21.ts';
import s22 from './s22.ts';

const ALL: SceneDef[] = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22];

export const SCENES: Record<number, SceneDef> = {};
for (const s of ALL) SCENES[s.id] = s;
