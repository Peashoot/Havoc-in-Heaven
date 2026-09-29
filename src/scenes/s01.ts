import { inOut, rand, smooth, span, track } from '../engine/ease.ts';
import { plane, type SceneDef } from '../engine/scene.ts';
import { cloud, cloudSea, haze, orb, palaceComplex, rays, sky, wisps } from './kit.ts';

/** 01 云海天宫 — dawn over an endless cloud sea; the camera glides through parting clouds toward the Heavenly Palace. */

const island = (x: number, y: number, w: number) => {
  // floating rock with hanging roots of mist
  const h = w * 0.55;
  return `<path d="M${x - w / 2} ${y}C${x - w * 0.44} ${y + h * 0.3} ${x - w * 0.18} ${y + h * 0.7} ${x} ${y + h}C${x + w * 0.2} ${y + h * 0.66} ${x + w * 0.46} ${y + h * 0.34} ${x + w / 2} ${y}Z" fill="#5d6f7a"/>
    <path d="M${x} ${y + h}C${x + w * 0.2} ${y + h * 0.66} ${x + w * 0.46} ${y + h * 0.34} ${x + w / 2} ${y}H${x + w * 0.1}C${x + w * 0.2} ${y + h * 0.4} ${x + w * 0.1} ${y + h * 0.7} ${x} ${y + h}Z" fill="#3e4c58"/>
    <path d="M${x - w / 2 - 10} ${y}h${w + 20}" stroke="#e8e2cc" stroke-width="10" stroke-linecap="round"/>`;
};

const scene: SceneDef = {
  id: 1,
  bg: '#1b2a44',
  markup: () => [
    plane(0, `${sky('s1-sky', [[0, '#16233f'], [0.38, '#3f4f78'], [0.62, '#d59a7c'], [0.78, '#f7d2a0'], [1, '#fbe6c4']])}
      ${rays(1010, 430, 1300, 26, '#fff0c8', 0.16, 3, 's1-rays')}
      ${orb(1010, 440, 64, '#fff8e0', 'url(#k-glow-warm)', 's1-sun')}`),
    plane(0.12, `${cloudSea(-300, 2220, 600, 70, 11, 'url(#k-cloud-dusk)', '', 'rgba(255,230,200,.5)')}
      ${wisps(120, 330, 700, 3, 5, '#ffe7c8', 0.35)}${wisps(1250, 300, 620, 3, 9, '#ffe7c8', 0.3)}`),
    plane(0.3, `<g class="s1-palace">
      ${island(1010, 560, 1060)}
      <ellipse cx="1010" cy="440" rx="460" ry="190" fill="url(#k-glow-warm)" opacity=".35" class="s1-palace-glow"/>
      ${palaceComplex(1010, 562, 0.62)}
      ${haze('#e9b99a', 0.22)}
      ${cloud(430, 610, 420, 90, 4, 'url(#k-cloud-gold)')}${cloud(1180, 620, 460, 80, 8, 'url(#k-cloud-gold)')}
    </g>`),
    plane(0.55, cloudSea(-400, 2320, 760, 110, 21, 'url(#k-cloud-gold)', '', 'rgba(255,245,220,.8)')),
    plane(0.9, cloudSea(-600, 2520, 900, 150, 31, 'url(#k-cloud-day)', '', 'rgba(255,255,255,.9)')),
    plane(1.5, `<g class="s1-fg-l">${cloud(-500, 1080, 1250, 560, 41)}${cloud(-300, 700, 700, 300, 42)}</g>
      <g class="s1-fg-r">${cloud(1180, 1080, 1300, 600, 51)}${cloud(1500, 640, 640, 280, 52)}</g>`),
    plane(2.4, `<g class="s1-streak">${wisps(-200, 180, 900, 4, 61, '#ffffff', 0.55)}${wisps(1300, 860, 900, 4, 71, '#ffffff', 0.5)}</g>`),
  ].join(''),
  camera: (t) => {
    const e = inOut(t.p);
    return { x: 1000, y: track([[0, 600], [1, 470]], e), zoom: track([[0, 0.92], [0.7, 1.25], [1.15, 1.6]], t.p) };
  },
  update: (d, t) => {
    const open = smooth(span(t.p, 0.05, 0.75));
    d.tf('.s1-fg-l', `translate(${-open * 900} ${open * 120})`);
    d.tf('.s1-fg-r', `translate(${open * 950} ${open * 140})`);
    d.tf('.s1-streak', `translate(${-t.lf * 6} 0)`);
    d.op('.s1-palace-glow', 0.25 + 0.2 * Math.sin(t.lf * 0.08));
    d.tf('.s1-rays', `rotate(${t.lf * 0.03} 1010 430)`);
  },
  fx: (ctx, t, view) => {
    // drifting gold motes catching the dawn light
    view.apply(ctx, 0.6);
    for (let i = 0; i < 70; i++) {
      const x = (rand(i) * 2400 - 240 + t.lf * (0.6 + rand(i + 3))) % 2400 - 200;
      const y = 200 + rand(i + 9) * 700 - Math.sin(t.lf * 0.03 + i) * 12;
      const a = 0.3 + 0.5 * Math.abs(Math.sin(t.lf * 0.05 + i * 1.7));
      ctx.fillStyle = `rgba(255,226,160,${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + rand(i + 5) * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};
export default scene;
