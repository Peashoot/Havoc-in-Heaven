import { heroEls, heroMarkup, poseHero, RIG_DEFS, type Costume, type Pose } from '../rig/hero.ts';
import { P } from '../rig/poses.ts';

const stage = document.getElementById('stage')!;
const costumes: Costume[] = ['pilgrim', 'king', 'bima', 'sage', 'furnace'];
const poseNames = Object.keys(P) as (keyof typeof P)[];

function page(n: number) {
  let cells: { pose: Pose; costume: Costume; label: string }[] = [];
  if (n >= 10) {
    // close-up face sheet: 10 = neutral king, 11 = angry sage, 12 = eyes glowing furnace
    const variants: [Costume, Partial<Pose>][] = [['king', { mouth: 0.9 }], ['sage', { brow: 1, mouth: -0.8 }], ['furnace', { glow: 1, brow: 0.6, mouth: -0.2 }]];
    const [c, o] = variants[n - 10];
    stage.innerHTML = `<svg viewBox="0 0 1920 1080" width="1920" height="1080"><defs>${RIG_DEFS}
      <filter id="rig-scorch"><feColorMatrix type="matrix" values=".62 .1 0 0 0  .05 .45 0 0 0  0 0 .4 0 0  0 0 0 1 0"/></filter></defs>${heroMarkup('h', c)}</svg>`;
    poseHero(heroEls(stage.querySelector('.hero') as SVGGElement), { ...P.stand, ...o, x: 900, y: 2600, s: 5.4 }, c);
    stage.dataset.frame = String(n);
    return;
  }
  if (n === 0) cells = costumes.map((c) => ({ pose: P.heroic, costume: c, label: c }));
  else {
    const names = poseNames.slice((n - 1) * 7, n * 7);
    cells = names.map((k) => ({ pose: P[k], costume: n % 2 ? 'sage' : 'king', label: k }));
  }
  const w = 1920 / cells.length;
  stage.innerHTML = `<svg viewBox="0 0 1920 1080" width="1920" height="1080"><defs>${RIG_DEFS}
    <filter id="rig-scorch"><feColorMatrix type="matrix" values=".62 .1 0 0 0  .05 .45 0 0 0  0 0 .4 0 0  0 0 0 1 0"/></filter></defs>
    <line x1="0" y1="900" x2="1920" y2="900" stroke="#7b8a78" stroke-width="3"/>
    ${cells.map((c, i) => `<g>${heroMarkup('h' + i, c.costume)}<text x="${w * i + w / 2}" y="1000" text-anchor="middle" font-size="34" font-family="sans-serif" fill="#1d2630">${c.label}</text></g>`).join('')}
  </svg>`;
  cells.forEach((c, i) => {
    const el = stage.querySelector(`.hero[data-name="h${i}"]`) as SVGGElement;
    const scale = cells.length > 5 ? 0.95 : 1.25;
    poseHero(heroEls(el), { ...c.pose, x: w * i + w / 2 - 20, y: 900, s: scale }, c.costume);
  });
  stage.dataset.frame = String(n);
}

(window as any).renderFrame = page;
page(Number(new URLSearchParams(location.search).get('frame') ?? 0));
