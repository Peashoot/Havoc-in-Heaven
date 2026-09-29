import { rand } from '../engine/ease.ts';

/**
 * Shared drawing kit. Every function returns an SVG fragment in 1920x1080 scene
 * coordinates. Style: flat cel shapes with a dark ink outline on characters/props,
 * painterly gradients and atmospheric perspective (lighter, bluer, less contrast with
 * distance) on landscapes, soft blurred glows for light.
 */

export const INK = '#2b1810';
const r2 = (n: number) => +n.toFixed(1);

/** Mix two #rrggbb colours. */
export function mix(a: string, b: string, t: number): string {
  const k = Math.max(0, Math.min(1, t));
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('');
}

/** Colour keyframes: [[t, '#hex'], ...] sampled at t. */
export function colorAt(keys: [number, string][], t: number): string {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const k = (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]);
      return mix(keys[i - 1][1], keys[i][1], k * k * (3 - 2 * k));
    }
  }
  return keys[keys.length - 1][1];
}

/** Global gradients/filters shared by all scenes (ids start with k-). */
export const KIT_DEFS = `
  <filter id="k-blur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="k-blur6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="k-blur16" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
  <filter id="k-blur40" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="40"/></filter>
  <linearGradient id="k-cloud-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#eef1ee"/><stop offset="1" stop-color="#b9c6cc"/></linearGradient>
  <linearGradient id="k-cloud-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6de"/><stop offset=".5" stop-color="#f7dcb0"/><stop offset="1" stop-color="#c79a82"/></linearGradient>
  <linearGradient id="k-cloud-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2c2"/><stop offset=".5" stop-color="#e6a891"/><stop offset="1" stop-color="#7d6a86"/></linearGradient>
  <linearGradient id="k-cloud-storm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6574"/><stop offset=".6" stop-color="#313a47"/><stop offset="1" stop-color="#151b24"/></linearGradient>
  <linearGradient id="k-cloud-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fa3c2"/><stop offset=".6" stop-color="#4b5a78"/><stop offset="1" stop-color="#232b40"/></linearGradient>
  <linearGradient id="k-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b0"/><stop offset=".45" stop-color="#f0bf3c"/><stop offset="1" stop-color="#9a6a12"/></linearGradient>
  <linearGradient id="k-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe089"/><stop offset=".5" stop-color="#e2a52e"/><stop offset="1" stop-color="#8e5a12"/></linearGradient>
  <linearGradient id="k-lacquer" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c1414"/><stop offset=".35" stop-color="#d23a2a"/><stop offset=".6" stop-color="#b52620"/><stop offset="1" stop-color="#5e0e10"/></linearGradient>
  <linearGradient id="k-jade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9d6d4"/></linearGradient>
  <radialGradient id="k-glow-warm"><stop offset="0" stop-color="#fff6d6" stop-opacity="1"/><stop offset=".3" stop-color="#ffd98a" stop-opacity=".7"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient>
  <radialGradient id="k-glow-white"><stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset=".4" stop-color="#ffffff" stop-opacity=".45"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
  <radialGradient id="k-glow-red"><stop offset="0" stop-color="#ffe1a0" stop-opacity="1"/><stop offset=".3" stop-color="#ff6a2a" stop-opacity=".75"/><stop offset="1" stop-color="#8a1206" stop-opacity="0"/></radialGradient>`;

/** Full-frame sky with vertical gradient. `id` must be scene-prefixed. */
export function sky(id: string, stops: [number, string][], extra = 0): string {
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs>
  <rect x="${-400 - extra}" y="-400" width="${2720 + extra * 2}" height="1880" fill="url(#${id})"/>`;
}

/** Sun/moon disc with bloom. */
export function orb(x: number, y: number, r: number, core = '#fff4d0', glow = 'url(#k-glow-warm)', cls = ''): string {
  return `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${r * 5}" fill="${glow}" opacity=".75"/>
    <circle cx="${x}" cy="${y}" r="${r * 1.6}" fill="${glow}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${core}"/></g>`;
}

/** Radiating god rays from (x, y). */
export function rays(x: number, y: number, len: number, count: number, color = '#fff2c4', opacity = 0.18, seed = 1, cls = ''): string {
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand(seed + i) * 0.2;
    const w = 0.03 + rand(seed + i * 3) * 0.05;
    const l = len * (0.6 + rand(seed + i * 7) * 0.4);
    d += `M${x} ${y}L${r2(x + Math.cos(a - w) * l)} ${r2(y + Math.sin(a - w) * l)}L${r2(x + Math.cos(a + w) * l)} ${r2(y + Math.sin(a + w) * l)}Z`;
  }
  return `<path class="${cls}" d="${d}" fill="${color}" opacity="${opacity}" filter="url(#k-blur16)"/>`;
}

/** Full-frame colour veil for atmospheric perspective (put it on top of a far plane). */
export const haze = (color: string, opacity: number, cls = '') =>
  `<rect class="${cls}" x="-600" y="-600" width="3120" height="2280" fill="${color}" opacity="${opacity}"/>`;

/** Cumulus: flat base at y, domed top of overlapping arcs. */
export function puffPath(x: number, y: number, w: number, h: number, seed: number, bumps = 7): string {
  const pts: [number, number][] = [];
  for (let i = 0; i <= bumps; i++) {
    const t = i / bumps;
    const env = Math.sin(Math.PI * (0.08 + t * 0.84));
    pts.push([x + w * t, y - h * env * (0.72 + rand(seed + i) * 0.28)]);
  }
  let d = `M${r2(x)} ${r2(y)}L${r2(pts[0][0])} ${r2(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1], [qx, qy] = pts[i];
    const chord = Math.hypot(qx - px, qy - py);
    const rr = Math.max(chord * 0.55, h * (0.18 + rand(seed + i * 5) * 0.2));
    d += `A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(qx)} ${r2(qy)}`;
  }
  d += `L${r2(x + w)} ${r2(y)}Q${r2(x + w / 2)} ${r2(y + h * 0.1)} ${r2(x)} ${r2(y)}Z`;
  return d;
}

export function cloud(x: number, y: number, w: number, h: number, seed: number, fill = 'url(#k-cloud-day)', cls = '', rim = 'rgba(255,255,255,.85)'): string {
  const d = puffPath(x, y, w, h, seed, Math.max(4, Math.round(w / (h * 0.55))));
  return `<path class="${cls}" d="${d}" fill="${fill}" stroke="${rim}" stroke-width="2.5"/>`;
}

/** A band of rolling cloud tops spanning [x0, x1] (cloud sea). */
export function cloudSea(x0: number, x1: number, y: number, h: number, seed: number, fill = 'url(#k-cloud-day)', cls = '', rim = 'rgba(255,255,255,.7)'): string {
  let out = '';
  let x = x0 - h;
  let i = 0;
  while (x < x1) {
    const w = h * (1.6 + rand(seed + i) * 1.8);
    out += cloud(x, y + rand(seed + i * 9) * h * 0.25, w, h * (0.7 + rand(seed + i * 4) * 0.5), seed * 31 + i, fill, '', rim);
    x += w * 0.62;
    i++;
  }
  return `<g class="${cls}">${out}<rect x="${x0 - h}" y="${y}" width="${x1 - x0 + h * 2}" height="${h * 3}" fill="${fill}"/></g>`;
}

/** Thin horizontal wisps (auspicious cloud streaks). */
export function wisps(x: number, y: number, w: number, n: number, seed: number, color = '#ffffff', opacity = 0.5, cls = ''): string {
  let d = '';
  for (let i = 0; i < n; i++) {
    const yy = y + i * 26 + rand(seed + i) * 10;
    const xx = x + rand(seed + i * 3) * w * 0.3;
    const ww = w * (0.4 + rand(seed + i * 7) * 0.6);
    d += `M${r2(xx)} ${r2(yy)}q${r2(ww * 0.25)} -10 ${r2(ww * 0.5)} 0t${r2(ww * 0.5)} 0`;
  }
  return `<path class="${cls}" d="${d}" fill="none" stroke="${color}" stroke-width="16" stroke-linecap="round" opacity="${opacity}" filter="url(#k-blur6)"/>`;
}

/** Karst pinnacle (Huaguo mountain style): tall rounded rock with shaded flank. */
export function karst(x: number, base: number, w: number, h: number, fill: string, shade: string, seed = 1, cls = '', rim = 'none'): string {
  const lean = (rand(seed) - 0.5) * w * 0.4;
  const top = base - h;
  const d = `M${r2(x - w / 2)} ${base}C${r2(x - w * 0.55)} ${r2(base - h * 0.5)} ${r2(x - w * 0.42 + lean)} ${r2(top + h * 0.12)} ${r2(x - w * 0.16 + lean)} ${r2(top + h * 0.03)}` +
    `C${r2(x + lean)} ${r2(top - h * 0.03)} ${r2(x + w * 0.22 + lean)} ${r2(top)} ${r2(x + w * 0.3 + lean)} ${r2(top + h * 0.12)}` +
    `C${r2(x + w * 0.5)} ${r2(base - h * 0.55)} ${r2(x + w * 0.56)} ${r2(base - h * 0.2)} ${r2(x + w / 2)} ${base}Z`;
  const s = `M${r2(x + w * 0.05 + lean)} ${r2(top + h * 0.05)}C${r2(x + w * 0.22 + lean)} ${r2(top)} ${r2(x + w * 0.32 + lean)} ${r2(top + h * 0.14)} ${r2(x + w * 0.34 + lean)} ${r2(top + h * 0.2)}` +
    `C${r2(x + w * 0.5)} ${r2(base - h * 0.55)} ${r2(x + w * 0.56)} ${r2(base - h * 0.2)} ${r2(x + w / 2)} ${base}L${r2(x + w * 0.12)} ${base}C${r2(x + w * 0.2)} ${r2(base - h * 0.4)} ${r2(x + w * 0.12 + lean)} ${r2(top + h * 0.3)} ${r2(x + w * 0.05 + lean)} ${r2(top + h * 0.05)}Z`;
  const cracks = Array.from({ length: 4 }, (_, i) => {
    const yy = top + h * (0.25 + i * 0.17);
    return `M${r2(x - w * 0.3 + rand(seed + i) * w * 0.3)} ${r2(yy)}q${r2(w * 0.12)} ${r2(h * 0.04)} ${r2(w * 0.22)} ${r2(h * 0.1)}`;
  }).join('');
  return `<g class="${cls}"><path d="${d}" fill="${fill}" stroke="${rim}" stroke-width="3"/><path d="${s}" fill="${shade}" opacity=".7"/>
    <path d="${cracks}" fill="none" stroke="${shade}" stroke-width="3" opacity=".6"/></g>`;
}

/** Soft ridge line of mountains (far range). */
export function ridge(x0: number, x1: number, base: number, h: number, seed: number, fill: string, cls = '', peaks = 6): string {
  const w = (x1 - x0) / peaks;
  let d = `M${x0} ${base + 400}L${x0} ${base}`;
  for (let i = 0; i < peaks; i++) {
    const px = x0 + w * (i + 0.5) + (rand(seed + i) - 0.5) * w * 0.4;
    const ph = h * (0.45 + rand(seed + i * 3) * 0.55);
    d += `Q${r2(px - w * 0.3)} ${r2(base - ph * 0.6)} ${r2(px)} ${r2(base - ph)}Q${r2(px + w * 0.3)} ${r2(base - ph * 0.6)} ${r2(x0 + w * (i + 1))} ${r2(base - h * 0.12 * rand(seed + i * 5))}`;
  }
  d += `L${x1} ${base + 400}Z`;
  return `<path class="${cls}" d="${d}" fill="${fill}"/>`;
}

export function pine(x: number, y: number, s: number, fill = '#1e4a3a', trunk = '#3b2a1d', flip = false): string {
  const f = flip ? -1 : 1;
  return `<g transform="translate(${x} ${y}) scale(${s * f} ${s})">
    <path d="M0 0C-4 -40 6 -80 -2 -130C10 -150 30 -160 50 -168M-2 -90C-24 -100 -44 -108 -64 -104" fill="none" stroke="${trunk}" stroke-width="10" stroke-linecap="round"/>
    <path d="M20 -150C40 -186 92 -190 112 -168C92 -150 50 -140 20 -150ZM-70 -100C-80 -130 -40 -140 -20 -118C-34 -104 -54 -96 -70 -100ZM-30 -140C-30 -176 18 -186 36 -160C18 -144 -10 -136 -30 -140Z" fill="${fill}"/>
    <path d="M24 -154C44 -168 76 -172 100 -164M-62 -108C-52 -120 -36 -124 -24 -118M-24 -146C-10 -160 10 -166 28 -160" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="4" stroke-linecap="round"/></g>`;
}

/** Chinese sea waves (海水纹): layered swell band with curling crests. y = crest line. */
export function sea(x0: number, x1: number, y: number, amp: number, seed: number, fill: string, foam = '#e8f4f0', cls = '', crest = 140): string {
  let d = `M${x0} ${y + 900}L${x0} ${y}`;
  let curls = '';
  const n = Math.ceil((x1 - x0) / crest);
  for (let i = 0; i < n; i++) {
    const sx = x0 + i * crest, a = amp * (0.7 + rand(seed + i) * 0.6);
    d += `c${crest * 0.3} ${-a} ${crest * 0.6} ${-a} ${crest * 0.75} ${-a * 0.4}q${crest * 0.1} ${a * 0.3} ${crest * 0.25} ${a * 0.4}`;
    curls += `M${r2(sx + crest * 0.42)} ${r2(y - a * 0.72)}c${r2(crest * 0.12)} ${r2(-a * 0.2)} ${r2(crest * 0.26)} ${r2(-a * 0.1)} ${r2(crest * 0.3)} ${r2(a * 0.2)}c${r2(-crest * 0.05)} ${r2(-a * 0.12)} ${r2(-crest * 0.14)} ${r2(-a * 0.1)} ${r2(-crest * 0.18)} ${r2(a * 0.02)}`;
  }
  d += `L${x1} ${y + 900}Z`;
  return `<g class="${cls}"><path d="${d}" fill="${fill}"/><path d="${curls}" fill="none" stroke="${foam}" stroke-width="5" stroke-linecap="round" opacity=".85"/></g>`;
}

/** Double-eave palace hall. (x, y) = centre of the platform top; w = hall width. */
export function hall(x: number, y: number, w: number, opts: { roof?: string; wall?: string; glow?: boolean; tiers?: number } = {}): string {
  const roof = opts.roof ?? 'url(#k-roof)', wall = opts.wall ?? '#8e1d1a';
  const h = w * 0.34, cols = 6;
  const colStep = w * 0.8 / (cols - 1);
  const eave = (yy: number, ww: number, hh: number) => {
    const l = x - ww / 2, r = x + ww / 2;
    return `<path d="M${r2(l - ww * 0.08)} ${r2(yy + hh * 0.18)}Q${r2(l + ww * 0.06)} ${r2(yy + hh * 0.3)} ${r2(l + ww * 0.14)} ${r2(yy)}L${r2(r - ww * 0.14)} ${r2(yy)}Q${r2(r - ww * 0.06)} ${r2(yy + hh * 0.3)} ${r2(r + ww * 0.08)} ${r2(yy + hh * 0.18)}` +
      `Q${r2(r - ww * 0.02)} ${r2(yy + hh * 0.42)} ${r2(r - ww * 0.1)} ${r2(yy + hh * 0.45)}L${r2(l + ww * 0.1)} ${r2(yy + hh * 0.45)}Q${r2(l + ww * 0.02)} ${r2(yy + hh * 0.42)} ${r2(l - ww * 0.08)} ${r2(yy + hh * 0.18)}Z" fill="${roof}" stroke="${INK}" stroke-width="${r2(w * 0.006 + 1)}"/>` +
      `<path d="M${r2(l + ww * 0.14)} ${r2(yy)}Q${x} ${r2(yy - hh * 0.28)} ${r2(r - ww * 0.14)} ${r2(yy)}" fill="${roof}" stroke="${INK}" stroke-width="${r2(w * 0.005 + 1)}"/>`;
  };
  const colsSvg = Array.from({ length: cols }, (_, i) => `<rect x="${r2(x - w * 0.4 + i * colStep - w * 0.018)}" y="${r2(y - h * 0.62)}" width="${r2(w * 0.036)}" height="${r2(h * 0.62)}" fill="url(#k-lacquer)"/>`).join('');
  const glow = opts.glow ? `<rect x="${r2(x - w * 0.38)}" y="${r2(y - h * 0.58)}" width="${r2(w * 0.76)}" height="${r2(h * 0.58)}" fill="#ffd98a" opacity=".55" filter="url(#k-blur16)"/>` : '';
  return `<g>
    <path d="M${r2(x - w * 0.62)} ${y}h${r2(w * 1.24)}l${r2(w * 0.05)} ${r2(h * 0.18)}h${r2(-w * 1.34)}Z" fill="url(#k-jade)" stroke="#8a9a98" stroke-width="2"/>
    <rect x="${r2(x - w * 0.44)}" y="${r2(y - h * 0.62)}" width="${r2(w * 0.88)}" height="${r2(h * 0.62)}" fill="${wall}"/>
    ${glow}${colsSvg}
    ${eave(y - h * 0.72, w * 1.08, h * 0.5)}
    <rect x="${r2(x - w * 0.34)}" y="${r2(y - h * 1.12)}" width="${r2(w * 0.68)}" height="${r2(h * 0.3)}" fill="${wall}"/>
    ${eave(y - h * 1.3, w * 0.86, h * 0.44)}
    <path d="M${r2(x - w * 0.3)} ${r2(y - h * 1.36)}h${r2(w * 0.6)}" stroke="${INK}" stroke-width="${r2(w * 0.01 + 1)}"/>
    <path d="M${r2(x - w * 0.31)} ${r2(y - h * 1.36)}q-6 -14 -18 -16M${r2(x + w * 0.31)} ${r2(y - h * 1.36)}q6 -14 18 -16" fill="none" stroke="${INK}" stroke-width="${r2(w * 0.008 + 1)}"/>
  </g>`;
}

/** Multi-tier pagoda / watch tower. (x, y) = base centre, w = base width. */
export function pagoda(x: number, y: number, w: number, tiers = 3, wall = '#a0231d'): string {
  let out = `<rect x="${r2(x - w * 0.42)}" y="${r2(y - w * 0.12)}" width="${r2(w * 0.84)}" height="${r2(w * 0.12)}" fill="url(#k-jade)" stroke="#8a9a98" stroke-width="2"/>`;
  let yy = y - w * 0.12, ww = w;
  for (let i = 0; i < tiers; i++) {
    const bh = ww * 0.3;
    out += `<rect x="${r2(x - ww * 0.3)}" y="${r2(yy - bh)}" width="${r2(ww * 0.6)}" height="${r2(bh)}" fill="${wall}"/>`;
    out += `<rect x="${r2(x - ww * 0.22)}" y="${r2(yy - bh * 0.8)}" width="${r2(ww * 0.44)}" height="${r2(bh * 0.5)}" fill="#ffd98a" opacity=".55"/>`;
    const ey = yy - bh - ww * 0.06, l = x - ww * 0.52, r = x + ww * 0.52;
    out += `<path d="M${r2(l - ww * 0.06)} ${r2(ey)}Q${r2(l + ww * 0.1)} ${r2(ey + ww * 0.1)} ${r2(x - ww * 0.3)} ${r2(ey - ww * 0.06)}H${r2(x + ww * 0.3)}Q${r2(r - ww * 0.1)} ${r2(ey + ww * 0.1)} ${r2(r + ww * 0.06)} ${r2(ey)}L${r2(r - ww * 0.06)} ${r2(ey + ww * 0.12)}H${r2(l + ww * 0.06)}Z" fill="url(#k-roof)" stroke="${INK}" stroke-width="${r2(w * 0.012 + 1)}"/>`;
    yy = ey - ww * 0.06;
    ww *= 0.74;
  }
  out += `<path d="M${x} ${r2(yy)}v${r2(-w * 0.28)}" stroke="url(#k-gold)" stroke-width="${r2(w * 0.04)}"/><circle cx="${x}" cy="${r2(yy - w * 0.3)}" r="${r2(w * 0.04)}" fill="#f2c23a"/>`;
  return `<g>${out}</g>`;
}

/** The Heavenly Palace: terraces, stairs, main hall, flanking pagodas and a gate. (x, y) = front ground centre. */
export function palaceComplex(x: number, y: number, s: number, glow = true): string {
  const t = (dx: number, dy: number, body: string) => `<g transform="translate(${r2(x + dx * s)} ${r2(y + dy * s)}) scale(${s})">${body}</g>`;
  const terrace = (w: number, h: number) => `<path d="M${-w / 2} 0h${w}l${-h * 0.4} ${-h}h${-w + h * 0.8}Z" fill="url(#k-jade)" stroke="#8a9a98" stroke-width="2"/>` +
    `<path d="M${-w / 2 + h * 0.4} ${-h}h${w - h * 0.8}" stroke="#e9d59a" stroke-width="4"/>` +
    Array.from({ length: Math.floor(w / 36) }, (_, i) => `<path d="M${-w / 2 + h * 0.4 + 18 + i * 36} ${-h}v-12" stroke="#d6dedd" stroke-width="5"/>`).join('');
  return `<g>
    ${t(0, 0, terrace(900, 40))}
    ${t(0, -40, terrace(640, 60))}
    ${t(0, -100, terrace(420, 50))}
    ${t(0, 0, stairs(-90, 90, 0, -60, 60, -150, 16))}
    ${t(-330, -40, pagoda(0, 0, 150, 4))}${t(330, -40, pagoda(0, 0, 150, 4))}
    ${t(-190, -100, hall(0, 0, 150))}${t(190, -100, hall(0, 0, 150))}
    ${t(0, -150, hall(0, 0, 330, { glow }))}
    ${t(-470, 0, pagoda(0, 0, 110, 3))}${t(470, 0, pagoda(0, 0, 110, 3))}
  </g>`;
}

/** Nantianmen (南天门): tall gate tower with plaque. (x, y) = ground centre, w = width. */
export function heavenGate(x: number, y: number, w: number, opts: { cold?: boolean; plaque?: boolean } = {}): string {
  const h = w * 1.05;
  const stone = opts.cold ? '#c8d2d8' : '#f2efe4';
  const trim = opts.cold ? '#7d8b96' : '#b98f3a';
  const pillar = (px: number) => `<rect x="${r2(px - w * 0.07)}" y="${r2(y - h * 0.62)}" width="${r2(w * 0.14)}" height="${r2(h * 0.62)}" fill="url(#k-lacquer)" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M${r2(px - w * 0.07)} ${r2(y - h * 0.5)}q${r2(w * 0.14)} ${r2(h * 0.06)} ${r2(w * 0.14)} ${r2(h * 0.14)}q${r2(-w * 0.14)} ${r2(h * 0.06)} ${r2(-w * 0.14)} ${r2(h * 0.14)}" fill="none" stroke="url(#k-gold)" stroke-width="${r2(w * 0.022)}"/>`;
  const plaque = opts.plaque === false ? '' : `<g><rect x="${r2(x - w * 0.14)}" y="${r2(y - h * 0.8)}" width="${r2(w * 0.28)}" height="${r2(h * 0.12)}" rx="4" fill="#1d3a5c" stroke="url(#k-gold)" stroke-width="${r2(w * 0.012)}"/>` +
    `<text class="brush" x="${x}" y="${r2(y - h * 0.715)}" text-anchor="middle" font-size="${r2(h * 0.08)}" fill="#f5d27a" letter-spacing="${r2(w * 0.012)}">南天门</text></g>`;
  const shade = opts.cold ? '#9fadb8' : '#d8d0b8';
  const courses = Array.from({ length: 9 }, (_, i) => {
    const yy = y - h * 0.66 + (i + 1) * h * 0.066;
    const off = (i % 2) * w * 0.04;
    const joints = Array.from({ length: 12 }, (_, j) => `M${r2(x - w * 0.48 + off + j * w * 0.08)} ${r2(yy - h * 0.066)}v${r2(h * 0.066)}`).join('');
    return `M${r2(x - w * 0.48)} ${r2(yy)}h${r2(w * 0.96)}${joints}`;
  }).join('');
  const arch = `M${r2(x - w * 0.22)} ${y}V${r2(y - h * 0.36)}Q${x} ${r2(y - h * 0.6)} ${r2(x + w * 0.22)} ${r2(y - h * 0.36)}V${y}Z`;
  const studs = (dx: number) => Array.from({ length: 20 }, (_, i) => `<circle cx="${r2(x + dx + ((i % 4) - 1.5) * w * 0.04)}" cy="${r2(y - h * 0.08 - Math.floor(i / 4) * h * 0.06)}" r="${r2(w * 0.007)}" fill="#f2c23a"/>`).join('');
  const crenel = Array.from({ length: 12 }, (_, i) => `<rect x="${r2(x - w * 0.5 + i * w * 0.0875)}" y="${r2(y - h * 0.7)}" width="${r2(w * 0.05)}" height="${r2(h * 0.04)}" fill="${stone}" stroke="${trim}" stroke-width="2"/>`).join('');
  return `<g>
    <path d="M${r2(x - w * 0.62)} ${y}h${r2(w * 1.24)}l${r2(w * 0.06)} ${r2(h * 0.05)}h${r2(-w * 1.36)}Z" fill="${stone}" stroke="${trim}" stroke-width="3"/>
    <rect x="${r2(x - w * 0.48)}" y="${r2(y - h * 0.66)}" width="${r2(w * 0.96)}" height="${r2(h * 0.66)}" fill="${stone}" stroke="${trim}" stroke-width="3"/>
    <rect x="${r2(x + w * 0.2)}" y="${r2(y - h * 0.66)}" width="${r2(w * 0.28)}" height="${r2(h * 0.66)}" fill="${shade}" opacity=".6"/>
    <path d="${courses}" stroke="${shade}" stroke-width="2" opacity=".9"/>
    ${crenel}
    <path d="${arch}" fill="#fff4c8"/>
    <path d="${arch}" fill="url(#k-glow-warm)" opacity=".9"/>
    <path d="M${r2(x - w * 0.22)} ${y}V${r2(y - h * 0.36)}Q${r2(x - w * 0.12)} ${r2(y - h * 0.5)} ${r2(x - w * 0.06)} ${r2(y - h * 0.52)}V${y}Z" fill="#9a1f1a" stroke="${INK}" stroke-width="3"/>
    <path d="M${r2(x + w * 0.22)} ${y}V${r2(y - h * 0.36)}Q${r2(x + w * 0.12)} ${r2(y - h * 0.5)} ${r2(x + w * 0.06)} ${r2(y - h * 0.52)}V${y}Z" fill="#861914" stroke="${INK}" stroke-width="3"/>
    ${studs(-w * 0.14)}${studs(w * 0.14)}
    <path d="M${r2(x - w * 0.22)} ${y}V${r2(y - h * 0.36)}Q${x} ${r2(y - h * 0.6)} ${r2(x + w * 0.22)} ${r2(y - h * 0.36)}V${y}" fill="none" stroke="url(#k-gold)" stroke-width="${r2(w * 0.012)}"/>
    ${pillar(x - w * 0.36)}${pillar(x + w * 0.36)}
    ${hall(x, y - h * 0.7, w * 0.9, { wall: '#a0231d' })}
    ${plaque}
  </g>`;
}

/** Red lacquer column with coiling golden dragon; (x, top) to bottom. */
export function column(x: number, top: number, bottom: number, w: number): string {
  const h = bottom - top;
  let coil = `M${r2(x - w / 2)} ${r2(top + h * 0.1)}`;
  for (let i = 0; i < 4; i++) {
    const yy = top + h * (0.1 + i * 0.2);
    coil += `Q${r2(x + w * 0.9)} ${r2(yy + h * 0.05)} ${r2(x + w / 2)} ${r2(yy + h * 0.1)}Q${r2(x - w * 0.9)} ${r2(yy + h * 0.15)} ${r2(x - w / 2)} ${r2(yy + h * 0.2)}`;
  }
  return `<g><rect x="${r2(x - w / 2)}" y="${top}" width="${w}" height="${h}" fill="url(#k-lacquer)" stroke="${INK}" stroke-width="3"/>
    <path d="${coil}" fill="none" stroke="url(#k-gold)" stroke-width="${r2(w * 0.22)}" stroke-linecap="round"/>
    <rect x="${r2(x - w * 0.62)}" y="${r2(bottom - w * 0.3)}" width="${r2(w * 1.24)}" height="${r2(w * 0.3)}" fill="url(#k-jade)" stroke="#8a9a98" stroke-width="2"/>
    <rect x="${r2(x - w * 0.6)}" y="${r2(top - w * 0.2)}" width="${r2(w * 1.2)}" height="${r2(w * 0.25)}" fill="url(#k-gold)" stroke="${INK}" stroke-width="2"/></g>`;
}

/** Perspective stairway: bottom edge [xb0, xb1] at yb up to top edge [xt0, xt1] at yt. */
export function stairs(xb0: number, xb1: number, yb: number, xt0: number, xt1: number, yt: number, n = 14, fill = 'url(#k-jade)', line = '#9fb0ae'): string {
  let steps = '';
  for (let i = 1; i < n; i++) {
    const t = Math.pow(i / n, 1.6);
    const yy = yt + (yb - yt) * t;
    const l = xt0 + (xb0 - xt0) * t, r = xt1 + (xb1 - xt1) * t;
    steps += `M${r2(l)} ${r2(yy)}H${r2(r)}`;
  }
  return `<g><path d="M${xb0} ${yb}L${xt0} ${yt}H${xt1}L${xb1} ${yb}Z" fill="${fill}"/>
    <path d="${steps}" stroke="${line}" stroke-width="3"/>
    <path d="M${xb0} ${yb}L${xt0} ${yt}M${xb1} ${yb}L${xt1} ${yt}" stroke="#e9d59a" stroke-width="6"/></g>`;
}

/** Heavenly soldier (天兵). Facing +x (or -x when flip). detail = 0 silhouette, 1 full. */
export function soldier(x: number, y: number, s: number, seed = 0, flip = false, detail = 1, cls = 'soldier'): string {
  const f = flip ? -1 : 1;
  const tone = ['#c4ccd6', '#b7c0ca', '#d0d6dc'][seed % 3];
  const plume = ['#c0392b', '#d35400', '#8e44ad'][seed % 3];
  if (!detail) {
    return `<g class="${cls}" transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s * f)} ${r2(s)})"><path d="M-14 0l4 -52h20l4 52zM-18 -52c0 -26 36 -26 36 0zM-10 -80a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M14 -130v130" fill="#1d2432" stroke="#1d2432" stroke-width="4"/><path d="M14 -130l-6 16h12z" fill="#cfd8e0"/></g>`;
  }
  return `<g class="${cls}" transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s * f)} ${r2(s)})">
    <path d="M30 -236V10" stroke="#5b4630" stroke-width="5"/><path d="M30 -250l-7 22h14z" fill="#e8eef2" stroke="${INK}" stroke-width="2"/>
    <path d="M24 -226q-12 12 -8 26q10 -8 14 -20z" fill="#c0392b"/>
    <path d="M-16 -4l4 -64h24l6 64z" fill="#2c3440" stroke="${INK}" stroke-width="3"/>
    <path d="M-20 -4h16M8 -4h18" stroke="${INK}" stroke-width="6"/>
    <path d="M-24 -70c-4 -30 0 -60 24 -66c24 6 30 36 26 66z" fill="${tone}" stroke="${INK}" stroke-width="3"/>
    <path d="M-20 -100h44M-22 -86h46" stroke="#7d8894" stroke-width="3"/>
    <circle cx="2" cy="-104" r="7" fill="#f2c23a" stroke="${INK}" stroke-width="2"/>
    <path d="M-26 -130c-14 6 -16 24 -10 36l12 -4zM26 -132c14 4 18 20 14 34l-12 -2z" fill="${tone}" stroke="${INK}" stroke-width="3"/>
    <path d="M22 -118q8 10 8 30" stroke="#e3b173" stroke-width="9" stroke-linecap="round"/>
    <path d="M-12 -154c-2 -12 6 -20 14 -20s16 8 14 20l-2 14h-24z" fill="#f0d0a8" stroke="${INK}" stroke-width="3"/>
    <path d="M-6 -154h6M8 -154h6" stroke="${INK}" stroke-width="3"/>
    <path d="M-16 -160c-2 -24 34 -24 34 0l-4 -18c-4 -10 -22 -10 -26 0z" fill="${tone}" stroke="${INK}" stroke-width="3"/>
    <path d="M-18 -162c-4 -12 2 -28 20 -30c18 2 24 18 20 30z" fill="${tone}" stroke="${INK}" stroke-width="3"/>
    <path d="M2 -192c-4 -14 4 -26 12 -30c-2 10 -4 20 -6 30z" fill="${plume}" stroke="${INK}" stroke-width="2"/>
    <path d="M-20 -164l-12 -8M22 -164l12 -8" stroke="#f2c23a" stroke-width="4" stroke-linecap="round"/>
  </g>`;
}

/** Robed heavenly official (天官) with tablet. */
export function immortal(x: number, y: number, s: number, seed = 0, flip = false, cls = 'immortal'): string {
  const f = flip ? -1 : 1;
  const robe = ['#3d5a8a', '#7b3b6e', '#2f6b5a', '#8a5a2b'][seed % 4];
  return `<g class="${cls}" transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s * f)} ${r2(s)})">
    <path d="M-40 0c0 -60 6 -130 20 -150h40c14 20 20 90 20 150z" fill="${robe}" stroke="${INK}" stroke-width="3"/>
    <path d="M-10 -150l10 40l10 -40" fill="none" stroke="#f0e6d0" stroke-width="5"/>
    <path d="M-44 -2c10 -40 10 -80 0 -120M44 -2c-10 -40 -10 -80 0 -120" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="6"/>
    <rect x="8" y="-150" width="10" height="46" rx="2" fill="#f2efe4" stroke="${INK}" stroke-width="2" transform="rotate(12 12 -128)"/>
    <path d="M-12 -176c0 -22 26 -22 26 0v10h-26z" fill="#f0d0a8" stroke="${INK}" stroke-width="3"/>
    <path d="M-10 -168c4 16 10 30 12 34c2 -4 8 -18 10 -34" fill="#f5f5f5" stroke="${INK}" stroke-width="2"/>
    <path d="M-16 -180h34v-16h-34z" fill="#1d2126" stroke="${INK}" stroke-width="2"/>
    <path d="M-16 -190h-26M18 -190h26" stroke="#1d2126" stroke-width="5"/>
  </g>`;
}

/** Small monkey (花果山群猴). */
export function monkey(x: number, y: number, s: number, seed = 0, flip = false, cls = 'monkey'): string {
  const f = flip ? -1 : 1;
  const fur = ['#b5782a', '#c98a33', '#a86a22'][seed % 3];
  const arm = seed % 2 ? 'M8 -40q22 -18 30 -40' : 'M8 -40q24 4 30 -8';
  return `<g class="${cls}" transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s * f)} ${r2(s)})">
    <path d="M-18 -10q-26 -8 -28 -34" fill="none" stroke="${fur}" stroke-width="5" stroke-linecap="round"/>
    <path d="M-16 0c-6 -20 -4 -44 14 -52c16 4 22 26 18 52z" fill="${fur}" stroke="${INK}" stroke-width="2.5"/>
    <path d="${arm}" fill="none" stroke="${fur}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="4" cy="-66" r="16" fill="${fur}" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="-10" cy="-70" r="6" fill="${fur}" stroke="${INK}" stroke-width="2"/>
    <path d="M4 -58c-2 -12 6 -18 14 -14c6 6 2 16 -6 18z" fill="#f6d9b8" stroke="${INK}" stroke-width="2"/>
    <circle cx="10" cy="-66" r="2" fill="${INK}"/>
  </g>`;
}

/** Deterministic scatter helper for crowds: returns positions in rows. */
export function rows(n: number, cols: number, x0: number, y0: number, dx: number, dy: number, jitter = 0, seed = 1): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    out.push([x0 + c * dx + (r % 2) * dx * 0.5 + (rand(seed + i) - 0.5) * jitter, y0 + r * dy + (rand(seed + i * 7) - 0.5) * jitter * 0.4, r]);
  }
  return out;
}
