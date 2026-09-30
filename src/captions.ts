import { clampFrame } from './timeline.ts';
import { smooth, span } from './engine/ease.ts';

export interface CaptionCue { start: number; end: number; text: string }

/** Global frames: narration stays steady while cameras and scenes move underneath. */
export const CAPTIONS: readonly CaptionCue[] = [
  { start: 24, end: 139, text: '天宫之下，一只石猴不愿困于山中。' },
  { start: 159, end: 258, text: '他漂洋过海，只为求得长生与自由。' },
  { start: 280, end: 408, text: '菩提祖师赐名孙悟空，传他神通。' },
  { start: 430, end: 527, text: '学成归山，金箍棒随心而动。' },
  { start: 552, end: 678, text: '太白金星奉旨招安，请他上天做官。' },
  { start: 700, end: 825, text: '弼马温只是小官，他愤而归山称大圣。' },
  { start: 851, end: 920, text: '天庭再招安，命他看守蟠桃园。' },
  { start: 928, end: 1030, text: '蟠桃会请遍众仙，却没有他的名字。' },
  { start: 1038, end: 1098, text: '既不请俺，俺便自己来！' },
  { start: 1120, end: 1245, text: '悟空闹宴饮酒，又夺了老君的金丹。' },
  { start: 1272, end: 1368, text: '他重回花果山，天庭震怒。' },
  { start: 1390, end: 1518, text: '十万天兵压境，要拿齐天大圣问罪。' },
  { start: 1540, end: 1667, text: '悟空一棒迎敌，天兵阵势尽散。' },
  { start: 1692, end: 1780, text: '他冲破重围，一路杀向南天门。' },
  { start: 1788, end: 1937, text: '老君掷下金刚琢，悟空失手被擒。' },
  { start: 1962, end: 2086, text: '刀砍雷击火烧，都伤不得他的金刚身。' },
  { start: 2112, end: 2207, text: '老君将他投入八卦炉，欲炼回金丹。' },
  { start: 2232, end: 2386, text: '七七四十九日，炉火未能炼化悟空。' },
  { start: 2410, end: 2507, text: '烈火之中，他炼成火眼金睛。' },
  { start: 2530, end: 2627, text: '悟空破炉而出，再握金箍棒！' },
  { start: 2652, end: 2807, text: '众神拦不住他，一路打进凌霄殿。' },
  { start: 2830, end: 2927, text: '玉帝在上，齐天大圣昂然不跪。' },
  { start: 2950, end: 3020, text: '这一棒，要让天宫记住他的名字。' },
];

export function captionAt(frameNumber: number): { text: string; opacity: number } {
  const frame = clampFrame(frameNumber);
  const cue = CAPTIONS.find((c) => frame >= c.start && frame < c.end);
  if (!cue) return { text: '', opacity: 0 };
  return {
    text: cue.text,
    opacity: smooth(span(frame, cue.start, cue.start + 7)) * (1 - smooth(span(frame, cue.end - 7, cue.end))),
  };
}
