import { clamp, noise, rand, smooth, span, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { heroMarkup, solve, type Pose } from '../rig/hero.ts';
import { P } from '../rig/poses.ts';
import { cloud, colorAt, haze, INK, karst, orb, pine, ridge, sea, stairs } from './kit.ts';
import { whiteFrame } from './fxkit.ts';

/**
 * 02 漂洋过海 — one long tracking shot. Wukong poles a bamboo raft from the Huaguo shore,
 * across open sea, through a storm (rain, lightning, raft pitching on big waves), a calm
 * night, and into a misty dawn where stone steps climb a mountain ahead.
 */

const X0 = 820, X1 = 4420; // camera travel in subject-plane coords
const camX = (lf: number) => track([[-20, X0 - 120], [0, X0], [120, X1, 'inOut'], [150, X1 + 260, 'linear']], lf);
const storm = (p: number) => smooth(span(p, 0.3, 0.42)) * (1 - smooth(span(p, 0.6, 0.72)));
const night = (p: number) => smooth(span(p, 0.62, 0.72)) * (1 - smooth(span(p, 0.84, 0.95)));

const raftAt = (lf: number, p: number) => {
  const sw = 8 + storm(p) * 34;
  const x = camX(lf) - 180;
  return { x, y: 830 + Math.sin(lf * 0.21) * sw * 0.6, rot: Math.sin(lf * 0.21 + 0.9) * (2 + storm(p) * 9) };
};

const heroAt = (lf: number, p: number): Pose => {
  const r = raftAt(lf, p);
  const push = (Math.sin(lf * 0.14) + 1) / 2; // punting cycle
  const hunch = storm(p);
  return {
    ...P.pole,
    x: r.x + 20, y: r.y - 16, s: 0.82,
    staff: 0, staffLen: 1.05, grip: 0.3,
    staffA: 104 + push * 22, torso: 18 + push * 12 + hunch * 8, lean: 4 + r.rot * 0.8,
    uaF: -46 + push * 18, faF: -36 - push * 10,
    thF: -32 - hunch * 14, shF: 34 + hunch * 20, thB: 24, shB: 18 + hunch * 14,
    head: -8 - hunch * 6, brow: 0.3 + hunch * 0.7, mouth: 0.4 - hunch * 1.2, wind: hunch,
  };
};

const panorama = () => [
  ridge(-400, 1300, 700, 260, 3, '#6f9a8e'),
  ...[[-120, 700, 190, 420], [120, 700, 150, 300], [360, 700, 210, 470], [620, 700, 140, 260]].map(([x, b, w, h], i) => karst(x, b, w, h, '#5e8f7c', '#3f6a5c', 10 + i)),
  ridge(2200, 3400, 720, 300, 7, '#8a9fa8'),
  ...[[2500, 720, 220, 520], [2760, 720, 170, 380], [3000, 720, 240, 600]].map(([x, b, w, h], i) => karst(x, b, w, h, '#7d93a0', '#5c7282', 20 + i)),
].join('');

const raftMarkup = () => `<g class="s2-raft">
  <path d="M-190 0Q-200 16 -176 26H176Q200 16 190 0Z" fill="#6b4a2c" stroke="${INK}" stroke-width="3.5"/>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${-186 + i * 47}" y="-10" width="44" height="22" rx="10" fill="${i % 2 ? '#a3794a' : '#b98b56'}" stroke="${INK}" stroke-width="3"/>`).join('')}
  <path d="M-120 -8v24M0 -8v24M120 -8v24" stroke="#e1c793" stroke-width="5"/>
  <path d="M-150 -10V-190" stroke="#5a4028" stroke-width="7"/>
  <path d="M-146 -186C-90 -170 -70 -110 -80 -40L-146 -30Z" fill="#e8dcc0" stroke="${INK}" stroke-width="3"/>
  <path d="M-140 -150C-110 -140 -96 -110 -98 -80" fill="none" stroke="#b9a883" stroke-width="3"/>
</g>`;

const scene: SceneDef = {
  id: 2,
  bg: '#3d5a80',
  markup: () => [
    plane(0, `<defs><linearGradient id="s2-sky" x1="0" y1="0" x2="0" y2="1">
        <stop class="s2-st0" offset="0" stop-color="#3d5a80"/><stop class="s2-st1" offset=".55" stop-color="#9fc4d0"/><stop class="s2-st2" offset="1" stop-color="#f2d6a8"/></linearGradient></defs>
      <rect x="-200" y="-200" width="2320" height="1480" fill="url(#s2-sky)"/>
      <g class="s2-sun">${orb(1480, 300, 58, '#fff3cf')}</g>
      <g class="s2-moon" opacity="0">${orb(1500, 250, 46, '#eef2ff', 'url(#k-glow-white)')}
        ${Array.from({ length: 40 }, (_, i) => `<circle cx="${(rand(i) * 1920).toFixed(0)}" cy="${(rand(i + 40) * 520).toFixed(0)}" r="${(1 + rand(i + 80) * 2).toFixed(1)}" fill="#fff"/>`).join('')}</g>
      <g class="s2-dawn" opacity="0">${orb(700, 560, 90, '#fff0c8')}</g>
      <g class="s2-stormsky" opacity="0"><rect x="-200" y="-200" width="2320" height="1480" fill="#141b26" opacity=".85"/>
        ${cloud(-200, 380, 900, 300, 5, 'url(#k-cloud-storm)', '', 'rgba(120,130,150,.4)')}${cloud(600, 330, 1000, 280, 9, 'url(#k-cloud-storm)', '', 'rgba(120,130,150,.4)')}${cloud(1400, 400, 800, 300, 13, 'url(#k-cloud-storm)', '', 'rgba(120,130,150,.4)')}</g>`),
    plane(0.25, `<g class="s2-far">${panorama()}</g>${haze('#a8c4cc', 0.25, 's2-farhaze')}`),
    plane(0.55, `<g class="s2-midclouds">${cloud(700, 640, 520, 110, 31, 'url(#k-cloud-day)')}${cloud(1900, 620, 600, 130, 33, 'url(#k-cloud-day)')}</g>
      <g class="s2-sea-far">${sea(-300, 4200, 740, 12, 41, '#3f7f96', '#cfe8ea', '', 120)}</g>`),
    plane(0.8, `<g class="s2-mount">
      ${karst(3900, 760, 520, 820, '#6d8a7c', '#4d6a5d', 51)}${karst(4350, 760, 380, 600, '#7a9687', '#5a7667', 52)}
      ${stairs(3860, 3980, 760, 3900, 3930, 330, 18, '#d8dccf', '#9aa498')}
      ${pine(3780, 470, 0.9)}${pine(4080, 420, 0.8, '#2a5a48', '#3b2a1d', true)}
      <rect x="3500" y="300" width="1300" height="520" fill="#e9e4d4" opacity=".35" filter="url(#k-blur40)"/>
      </g>
      <g class="s2-sea-mid">${sea(-300, 5200, 790, 22, 61, '#2f6f86', '#d9eef0', '', 160)}</g>`),
    plane(1, `<g class="s2-sea-near">${sea(-300, 6200, 860, 30, 71, '#285f76', '#e6f5f4', '', 190)}</g>
      <g class="s2-bigwave" opacity="0"><path d="M2600 900C2800 700 3000 620 3150 700C3080 690 3020 740 3060 790C3200 760 3300 820 3400 900Z" fill="#1d4a5c" stroke="#e6f5f4" stroke-width="6"/></g>
      <g class="s2-raftwrap">${raftMarkup()}</g>
      <path class="s2-pole" d="" stroke="#8a9a4a" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path class="s2-pole-n" d="" stroke="#5f6e2e" stroke-width="10" stroke-dasharray="3 60" fill="none"/>
      ${heroMarkup('wukong', 'pilgrim')}`),
    plane(1.5, `<g class="s2-fg">${sea(-600, 8000, 1010, 46, 81, '#16404f', '#f2fbfa', '', 260)}</g>
      <rect class="s2-grade" x="-3000" y="-2000" width="14000" height="5000" fill="#0a1430" opacity="0"/>`),
  ].join(''),
  camera: (t) => ({ x: camX(t.lf), y: 560 + noise(t.lf * 0.04, 2) * 10 + storm(t.p) * Math.sin(t.lf * 0.21) * 18, zoom: 1.02 + storm(t.p) * 0.06, rot: storm(t.p) * Math.sin(t.lf * 0.21 + 0.9) * 1.6 }),
  heroes: (t) => [{ name: 'wukong', costume: 'pilgrim', pose: heroAt(t.lf, t.p) }],
  update: (d, t) => {
    const p = t.p, lf = t.lf, st = storm(p), nt = night(p);
    const dawn = smooth(span(p, 0.84, 1));
    d.attr('.s2-st0', 'stop-color', colorAt([[0, '#3d5a80'], [0.25, '#3f86b8'], [0.62, '#1b2432'], [0.75, '#0b1428'], [0.9, '#34476a'], [1.1, '#4b5f86']], p));
    d.attr('.s2-st1', 'stop-color', colorAt([[0, '#9fc4d0'], [0.25, '#9fd4e4'], [0.62, '#34404e'], [0.75, '#1a2744'], [0.9, '#c98f7d'], [1.1, '#e8b89a']], p));
    d.attr('.s2-st2', 'stop-color', colorAt([[0, '#f2d6a8'], [0.25, '#dff0ea'], [0.62, '#4a5462'], [0.75, '#2b3a5a'], [0.9, '#f4c392'], [1.1, '#fbe0b8']], p));
    d.op('.s2-sun', 1 - smooth(span(p, 0.28, 0.4)));
    d.op('.s2-moon', nt);
    d.op('.s2-dawn', dawn);
    d.op('.s2-stormsky', st);
    d.op('.s2-farhaze', 0.2 + st * 0.45 + nt * 0.35);
    d.attr('.s2-farhaze', 'fill', colorAt([[0, '#a8c4cc'], [0.35, '#5a6674'], [0.7, '#0e1830'], [0.95, '#e8c0a0']], p));
    d.op('.s2-midclouds', 1 - Math.max(st, nt) * 0.85);
    d.op('.s2-bigwave', st);
    d.op('.s2-grade', st * 0.28 + nt * 0.42);
    d.tf('.s2-sea-far', `translate(${Math.sin(lf * 0.05) * 20} 0)`);
    d.tf('.s2-sea-mid', `translate(${-lf * 1.2 + Math.sin(lf * 0.08) * 30} ${Math.sin(lf * 0.12) * 6 * (1 + st * 3)})`);
    d.tf('.s2-sea-near', `translate(${-lf * 2 + Math.sin(lf * 0.1) * 40} ${Math.sin(lf * 0.21) * 10 * (1 + st * 3)})`);
    d.tf('.s2-fg', `translate(${-lf * 3} ${Math.sin(lf * 0.18 + 1) * 16 * (1 + st * 2)})`);
    const r = raftAt(lf, p);
    d.tf('.s2-raftwrap', `translate(${r.x.toFixed(1)} ${r.y.toFixed(1)}) rotate(${r.rot.toFixed(2)})`);
    // bamboo pole in the hands (the staff itself stays hidden until Huaguo)
    const [[tx, ty], [hx, hy]] = solve(heroAt(lf, p)).staffEnds;
    const pole = `M${tx.toFixed(1)} ${ty.toFixed(1)}L${hx.toFixed(1)} ${hy.toFixed(1)}`;
    d.attr('.s2-pole', 'd', pole);
    d.attr('.s2-pole-n', 'd', pole);
  },
  fx: (ctx, t, view) => {
    const st = storm(t.p), lf = t.lf;
    if (st > 0.01) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.strokeStyle = `rgba(210,225,235,${(0.5 * st).toFixed(2)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 220; i++) {
        const x = ((rand(i) * 2200 - lf * 26) % 2200 + 2200) % 2200 - 140;
        const y = ((rand(i + 300) * 1200 + lf * 60) % 1200) - 60;
        ctx.moveTo(x, y); ctx.lineTo(x - 18, y + 60);
      }
      ctx.stroke();
      for (const at of [50, 63]) {
        const k = lf - at;
        if (k >= 0 && k < 5 && st > 0.5) {
          whiteFrame(ctx, (1 - k / 5) * 0.45, '#dfe8ff');
          ctx.strokeStyle = `rgba(255,255,240,${(1 - k / 5).toFixed(2)})`;
          ctx.lineWidth = 5;
          ctx.beginPath();
          let x = 1200 + at * 3, y = 60;
          ctx.moveTo(x, y);
          for (let j = 0; j < 7; j++) { x += (rand(at + j) - 0.5) * 120; y += 70; ctx.lineTo(x, y); }
          ctx.stroke();
        }
      }
    }
    // spray off the raft bow
    view.apply(ctx, 1);
    const r = raftAt(lf, t.p);
    ctx.fillStyle = 'rgba(240,250,250,.8)';
    for (let i = 0; i < 26; i++) {
      const life = (lf * 1.3 + i * 7) % 26;
      const px = r.x + 180 + life * (3 + rand(i) * 4), py = r.y + 10 - life * (4 - life * 0.18) * (0.6 + st);
      ctx.globalAlpha = clamp(1 - life / 26);
      ctx.beginPath(); ctx.arc(px, py, 3 + rand(i + 5) * 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  },
};

export default scene;
