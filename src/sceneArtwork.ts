export { palaceSvg } from './palace.ts';

export type Palette = {
  sky: string;
  low: string;
  ridge: string;
  near: string;
  ink: string;
  gold: string;
  glow: string;
  jade: string;
  cinnabar: string;
};

const palettes: Record<string, Palette> = {
  jade: {
    sky: '#0f2730', low: '#528373', ridge: '#244e4a', near: '#163833',
    ink: '#0b1d22', gold: '#e5c158', glow: '#fff3c4', jade: '#388a6f', cinnabar: '#a33737',
  },
  dawn: {
    sky: '#1e3345', low: '#b69766', ridge: '#3d615c', near: '#1c3e3e',
    ink: '#10222a', gold: '#f5d58c', glow: '#ffeed0', jade: '#2d7a64', cinnabar: '#b03d33',
  },
  free: {
    sky: '#184f5d', low: '#9bb887', ridge: '#2f6e56', near: '#17493a',
    ink: '#0c2826', gold: '#ffcf52', glow: '#fff5b8', jade: '#40a078', cinnabar: '#bf3b30',
  },
  court: {
    sky: '#354859', low: '#b8b49e', ridge: '#657883', near: '#3f535f',
    ink: '#1c2834', gold: '#d4ba7d', glow: '#faecc0', jade: '#4a8270', cinnabar: '#98302b',
  },
  faded: {
    sky: '#243038', low: '#7e7d77', ridge: '#434c51', near: '#293339',
    ink: '#131b20', gold: '#9e8965', glow: '#d6bd88', jade: '#335e53', cinnabar: '#6b2b2b',
  },
  feast: {
    sky: '#18212b', low: '#4d4f58', ridge: '#2c333d', near: '#1a222c',
    ink: '#0d141d', gold: '#caa066', glow: '#f0ca86', jade: '#326c59', cinnabar: '#8c2d28',
  },
  siege: {
    sky: '#080e17', low: '#283440', ridge: '#1c2731', near: '#111b24',
    ink: '#060a10', gold: '#a68b55', glow: '#e8be66', jade: '#244e43', cinnabar: '#6d2624',
  },
  chained: {
    sky: '#060b12', low: '#2c353d', ridge: '#1a222c', near: '#0d131d',
    ink: '#04070c', gold: '#746b5e', glow: '#8e846f', jade: '#1b3b33', cinnabar: '#551f1f',
  },
  fire: {
    sky: '#120912', low: '#3c1822', ridge: '#35141e', near: '#1e0c14',
    ink: '#0a0408', gold: '#f38938', glow: '#ffd56b', jade: '#215c4d', cinnabar: '#d13824',
  },
  released: {
    sky: '#11122a', low: '#6d3659', ridge: '#1f4862', near: '#192b45',
    ink: '#0a0d1d', gold: '#ffe685', glow: '#fff8be', jade: '#42b896', cinnabar: '#d94132',
  },
};

function theme(scene: number): Palette {
  if (scene === 2) return palettes.dawn;
  if (scene <= 3) return palettes.jade;
  if (scene === 4 || scene === 10) return palettes.free;
  if (scene === 5) return palettes.court;
  if (scene === 6) return palettes.faded;
  if (scene <= 9) return palettes.feast;
  if (scene <= 13) return palettes.siege;
  if (scene <= 15) return palettes.chained;
  if (scene <= 18) return palettes.fire;
  return palettes.released;
}

function frame(scene: number, content: string): string {
  const p = theme(scene);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" aria-hidden="true" data-scene="${scene}">
    <defs>
      <linearGradient id="scene-sky" x2="0" y2="1"><stop offset="0%" stop-color="${p.sky}"/><stop offset="100%" stop-color="${p.low}"/></linearGradient>
      <linearGradient id="scene-light" x2="0" y2="1"><stop offset="0%" stop-color="${p.glow}" stop-opacity=".75"/><stop offset="100%" stop-color="${p.glow}" stop-opacity="0"/></linearGradient>
      <radialGradient id="scene-halo"><stop offset="0%" stop-color="${p.glow}" stop-opacity=".65"/><stop offset="50%" stop-color="${p.gold}" stop-opacity=".25"/><stop offset="100%" stop-color="${p.gold}" stop-opacity="0"/></radialGradient>
      <linearGradient id="scene-gold" x2="0" y2="1"><stop offset="0%" stop-color="${p.glow}"/><stop offset="42%" stop-color="${p.gold}"/><stop offset="100%" stop-color="#5a4124"/></linearGradient>
      <linearGradient id="scene-jade" x2="0" y2="1"><stop offset="0%" stop-color="#7fe0b8"/><stop offset="48%" stop-color="${p.jade}"/><stop offset="100%" stop-color="#12372c"/></linearGradient>
      <linearGradient id="scene-cinnabar" x2="0" y2="1"><stop offset="0%" stop-color="#f06b5b"/><stop offset="52%" stop-color="${p.cinnabar}"/><stop offset="100%" stop-color="#3d0e0e"/></linearGradient>
      <linearGradient id="scene-water" x2="0" y2="1"><stop offset="0%" stop-color="${p.low}"/><stop offset="45%" stop-color="#1c4856"/><stop offset="100%" stop-color="${p.ink}"/></linearGradient>
      <linearGradient id="scene-bronze" x2="1" y2="0"><stop offset="0%" stop-color="#192824"/><stop offset="35%" stop-color="#46685f"/><stop offset="70%" stop-color="#2d443e"/><stop offset="100%" stop-color="#14201d"/></linearGradient>
      <filter id="scene-blur"><feGaussianBlur stdDeviation="16"/></filter>
      <filter id="scene-glow"><feGaussianBlur stdDeviation="24" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect class="sky" width="1920" height="1080" fill="url(#scene-sky)"/>
    ${content}
  </svg>`;
}

/* =========================================================================
   TRADITIONAL CHINESE ART MODULES (GONGBI, BLUE-GREEN SHANSHUI, HAN-TANG)
   ========================================================================= */

/** Blue-Green Gongbi Mountain Peaks with Organic Curved Contours & Shaded Ridges (青绿金碧名山) */
function blueGreenMountains(p: Palette, y = 680): string {
  return `<g class="far-mountains">
    <!-- Distant Layered Azurite Mountain Peaks with Organic Curves -->
    <path d="M0 ${y - 30} C160 ${y - 120} 240 ${y - 60} 380 ${y - 190} C480 ${y - 280} 580 ${y - 140} 720 ${y - 220} C860 ${y - 300} 980 ${y - 120} 1120 ${y - 250} C1260 ${y - 320} 1390 ${y - 160} 1540 ${y - 240} C1680 ${y - 300} 1800 ${y - 120} 1920 ${y - 180} v520 H0 Z" fill="${p.ridge}"/>
    <path d="M0 ${y - 30} C160 ${y - 120} 240 ${y - 60} 380 ${y - 190} C480 ${y - 280} 580 ${y - 140} 720 ${y - 220} C860 ${y - 300} 980 ${y - 120} 1120 ${y - 250} C1260 ${y - 320} 1390 ${y - 160} 1540 ${y - 240} C1680 ${y - 300} 1800 ${y - 120} 1920 ${y - 180}" fill="none" stroke="${p.gold}" stroke-width="2.5" opacity=".7"/>

    <!-- Mid Mineral Malachite Mountain Layers (斧劈皴与阴阳向背) -->
    <path d="M0 ${y + 80} C180 ${y - 20} 280 ${y + 40} 460 ${y - 90} C590 ${y - 180} 690 ${y - 30} 860 ${y - 120} C1000 ${y - 200} 1120 ${y - 40} 1290 ${y - 140} C1420 ${y - 210} 1560 ${y - 50} 1720 ${y - 110} C1820 ${y - 150} 1880 ${y - 40} 1920 ${y - 70} v420 H0 Z" fill="${p.near}"/>
    <path d="M0 ${y + 80} C180 ${y - 20} 280 ${y + 40} 460 ${y - 90} C590 ${y - 180} 690 ${y - 30} 860 ${y - 120} C1000 ${y - 200} 1120 ${y - 40} 1290 ${y - 140} C1420 ${y - 210} 1560 ${y - 50} 1720 ${y - 110} C1820 ${y - 150} 1880 ${y - 40} 1920 ${y - 70}" fill="none" stroke="${p.gold}" stroke-width="3" opacity=".82"/>

    <!-- Shaded Ravine Grooves & Axe-Cut Clefts (山壑阴影与皴法) -->
    <path d="M460 ${y - 90} Q410 ${y + 40} 480 ${y + 110} M860 ${y - 120} Q820 ${y} 890 ${y + 90} M1290 ${y - 140} Q1240 ${y - 20} 1320 ${y + 80} M1720 ${y - 110} Q1680 ${y} 1750 ${y + 90}" fill="none" stroke="${p.ink}" stroke-width="6" opacity=".55"/>
    <path d="M460 ${y - 90} Q500 ${y} 440 ${y + 70} M860 ${y - 120} Q910 ${y - 30} 840 ${y + 60} M1290 ${y - 140} Q1340 ${y - 40} 1270 ${y + 70}" fill="none" stroke="${p.glow}" stroke-width="2" opacity=".4"/>

    <!-- Near Deep Mineral Ink Peaks and Foothills -->
    <path d="M0 ${y + 160} Q260 ${y + 90} 500 ${y + 180} T1000 ${y + 150} T1500 ${y + 170} T1920 ${y + 140} v360 H0 Z" fill="${p.ink}"/>
    <path d="M0 ${y + 160} Q260 ${y + 90} 500 ${y + 180} T1000 ${y + 150} T1500 ${y + 170} T1920 ${y + 140}" fill="none" stroke="${p.gold}" stroke-width="2.5" opacity=".6"/>
  </g>`;
}

/** Swirling Ink Mist Banks (水墨云岚) */
function mist(y = 735, opacity = .52): string {
  return `<g class="ink-mist" opacity="${opacity}" fill="#eaf2ec">
    <path d="M-80 ${y}q170-65 353 5t381-8q150-70 348 6t381-6q178-68 343 0t294-14v95H-80Z"/>
    <path d="M-80 ${y + 85}q253-95 487-16t461-10q250-75 465 5t667-28v145H-80Z" opacity=".48"/>
  </g>`;
}

/** Auspicious Sun / Moon with Imperial Halo */
function celestialOrb(x: number, y: number, r = 74, moon = false): string {
  return `<g class="sun">
    <circle cx="${x}" cy="${y}" r="${r * 2.9}" fill="url(#scene-halo)"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${moon ? '#eef5f2' : '#ffe49e'}" opacity=".92"/>
    ${moon ? `<circle cx="${x + r * 0.35}" cy="${y - r * 0.2}" r="${r * 0.85}" fill="${palettes.siege.sky}" opacity=".2"/>` : ''}
  </g>`;
}

/** Flowing Auspicious Cloud Ribbons (祥云锦带) */
function auspiciousClouds(): string {
  return `<g class="cloud-ribbons" fill="none" stroke="#e8f5ec" opacity=".48" stroke-linecap="round">
    <path d="M-90 260q153-65 262-16t208 12q97-48 191-6" stroke-width="26"/>
    <path d="M1180 220q109-50 222-12t217 6q114-48 278 8" stroke-width="38"/>
    <path d="M-90 490q233-95 432-15t387-20" stroke-width="18"/>
    <path d="M1310 535q164-42 311 20t360-22" stroke-width="24"/>
  </g>`;
}

/** Ancient Gnarled Pine with Layered Needles and Moss (苍劲古松) */
function gnarledPine(x: number, y: number, scale = 1, flip = false): string {
  const dir = flip ? -1 : 1;
  return `<g class="pine-tree" transform="translate(${x} ${y}) scale(${scale * dir} ${scale})">
    <!-- Twisted Trunk with Bark Scales (龙鳞皴) -->
    <path d="M0 0q-18-120 8-220t-15-110" fill="none" stroke="#162220" stroke-width="28" stroke-linecap="round"/>
    <path d="M-5-180q-45-40-95-50m85-20q70-45 110-35" fill="none" stroke="#162220" stroke-width="18" stroke-linecap="round"/>
    <!-- Hanging Moss Creepers (悬萝蔓藤) -->
    <path d="M-70-190v45m20-35v30m95-25v50m25-40v35" stroke="#487862" stroke-width="3" opacity=".7"/>
    <!-- Layered Pine Needle Pads (品字形松针云簇) -->
    <g fill="#144a39" stroke="#68aa88" stroke-width="3">
      <!-- Lower left cluster -->
      <path d="M-115-225q-65-35-90-85 68 25 95 55 42-35 88-42-38 48-93 72Z"/>
      <ellipse cx="-135" cy="-260" rx="42" ry="18" fill="#1b5a46"/>
      <!-- Lower right cluster -->
      <path d="M75-235q-35-45-45-95 62 28 85 62 48-28 92-32-35 45-88 68-24 5-44-3Z"/>
      <ellipse cx="115" cy="-265" rx="46" ry="20" fill="#1b5a46"/>
      <!-- Top canopy cluster -->
      <path d="M-5-315q-52-32-68-78 48 22 72 48 35-32 72-42-24 50-76 72Z" fill="#1b5c49"/>
      <ellipse cx="0" cy="-345" rx="55" ry="22" fill="#22705a"/>
    </g>
  </g>`;
}

/** Ganoderma Lucidum / Auspicious Lingzhi Immortal Herbs (灵芝仙草) */
function lingzhiHerbs(x: number, y: number, scale = 1): string {
  return `<g class="lingzhi-herbs" transform="translate(${x} ${y}) scale(${scale})">
    <path d="M0 0q12-35 5-65m20 15q15-25 10-50" fill="none" stroke="#523226" stroke-width="6" stroke-linecap="round"/>
    <!-- Large Lingzhi Cloud Cap -->
    <path d="M5-65q-28-12-32 10 0 25 35 24 35-2 32-22-4-15-25-12m-10-8q-15-8-18 6 0 15 20 15 20-1 18-14-3-9-15-7Z" fill="url(#scene-cinnabar)" stroke="${palettes.jade.gold}" stroke-width="2.5"/>
    <!-- Small Lingzhi Cap -->
    <path d="M28-95q-18-8-20 7 0 16 22 15 22-2 20-14-2-10-16-8Z" fill="#c73c32" stroke="${palettes.jade.gold}" stroke-width="2"/>
  </g>`;
}

/** Swaying Bamboo Grove Silhouettes (竹影婆娑) */
function bambooGrove(x: number, y: number, scale = 1): string {
  return `<g class="bamboo-shadows" transform="translate(${x} ${y}) scale(${scale})" opacity=".75">
    <!-- Bamboo Culms -->
    <g stroke="#1a3f33" stroke-width="7" stroke-linecap="round">
      <path d="M0 0v-75m0-12v-85m0-12v-95"/>
      <path d="M45 10v-65m0-12v-75m0-12v-85"/>
      <path d="M-38 20v-85m0-12v-95m0-12v-105"/>
    </g>
    <!-- Bamboo Leaf Clusters (个字、分字叶) -->
    <g fill="#1f4e3f" stroke="#337862" stroke-width="1.5">
      <!-- Leaf group 1 -->
      <path d="M0-180q-25 5-45 22 25-10 45-12 18-12 38-18-20 4-38 8Z"/>
      <path d="M0-180q-5 25-18 45 10-25 15-45 15-5 32-8-15 5-29 8Z"/>
      <!-- Leaf group 2 -->
      <path d="M45-160q-22 8-38 25 22-12 38-15 15-8 32-12-18 4-32 8Z"/>
      <!-- Leaf group 3 -->
      <path d="M-38-200q-28 6-48 24 28-12 48-15 20-10 42-15-24 4-42 6Z"/>
    </g>
  </g>`;
}

/** Classical Stone Stairs with Balustrades (青石台阶与雕栏) */
function stoneStairs(top = 635, bottom = 1080): string {
  const lines = Array.from({ length: 12 }, (_, i) => {
    const t = (i + 1) / 13;
    const y = top + (bottom - top) * t * t;
    const half = 95 + 740 * t;
    return `<path d="M${960 - half} ${y}h${half * 2}" stroke="#dcd5be" stroke-width="${3 + t * 9}" opacity="${.42 + t * .38}"/>
      <!-- Balustrade Post Finial -->
      <circle cx="${960 - half}" cy="${y - 4}" r="${3 + t * 4}" fill="url(#scene-gold)"/>
      <circle cx="${960 + half}" cy="${y - 4}" r="${3 + t * 4}" fill="url(#scene-gold)"/>`;
  }).join('');
  return `<g class="stone-stairs">
    <path d="M865 ${top}h190l815 ${bottom - top}H50Z" fill="#3d494a" stroke="#d4cbaa" stroke-width="6"/>
    <path d="M865 ${top} 50 ${bottom}M1055 ${top}l815 ${bottom - top}" stroke="#e8dcbe" stroke-width="10" opacity=".7"/>
    ${lines}
  </g>`;
}

/** Han-Tang Architrave, Cantilever Dougong Brackets, and Flying Eaves (斗栱与飞檐) */
function hanTangEaves(cx: number, y: number, w: number, h: number, depth: number): string {
  const left = cx - w / 2;
  const right = cx + w / 2;
  return `<g class="han-tang-roof">
    <!-- Main Sweeping Roof (飞檐翼角) -->
    <path d="M${left - 48} ${y + h + 15} Q${left - 10} ${y + h + 14} ${left + 6} ${y + h - 8} Q${cx} ${y - depth} ${right - 6} ${y + h - 8} Q${right + 10} ${y + h + 14} ${right + 48} ${y + h + 15} Q${right + 20} ${y + h + 32} ${right - 10} ${y + h + 18} L${left + 10} ${y + h + 18} Q${left - 20} ${y + h + 32} ${left - 48} ${y + h + 15}Z" fill="#1e2a36" stroke="#d4af37" stroke-width="5"/>
    <path d="M${left - 40} ${y + h + 12} Q${cx} ${y - depth + 14} ${right + 40} ${y + h + 12}" fill="none" stroke="#f0cf7d" stroke-width="3.5" opacity=".85"/>
    <!-- Ridge Beasts (鸱吻) -->
    <path d="M${left - 54} ${y + h + 14}q-18-4-26-22 14 6 22 14m${w + 108} 8q18-4 26-22-14 6-22 14" fill="none" stroke="#e8c263" stroke-width="6" stroke-linecap="round"/>
    <!-- Dougong Bracket Cluster Layer (斗栱层) -->
    ${Array.from({ length: 9 }, (_, i) => {
      const bx = left + 30 + (i * (w - 60)) / 8;
      const by = y + h + 20;
      return `<path d="M${bx - 14} ${by}h28v12h-28Zm-8 12h44v10h-44Z" fill="#8f2d26" stroke="#dfb66d" stroke-width="2"/>`;
    }).join('')}
  </g>`;
}

/** Coiled Dragon Imperial Column (盘龙金柱) */
function dragonColumn(x: number, y: number, height: number, width = 28, tilted = 0): string {
  const transform = tilted ? `transform="rotate(${tilted} ${x} ${y + height})"` : '';
  return `<g class="dragon-column" ${transform}>
    <!-- Column Shaft (朱红漆柱) -->
    <rect x="${x - width / 2}" y="${y}" width="${width}" height="${height}" fill="url(#scene-cinnabar)" stroke="#e5be6b" stroke-width="4"/>
    <!-- Sumeru Pedestal (须弥座) -->
    <path d="M${x - width * 0.9} ${y + height - 18}h${width * 1.8}v18h-${width * 1.8}Z" fill="#3a424a" stroke="#d5b472" stroke-width="3"/>
    <!-- Coiled Golden Dragon Relief (蟠龙金纹) -->
    <path d="M${x - width / 2} ${y + 20} Q${x + width * 0.8} ${y + height * 0.25} ${x - width / 2} ${y + height * 0.45} T${x - width / 2} ${y + height * 0.85}" fill="none" stroke="url(#scene-gold)" stroke-width="${width * 0.42}" stroke-linecap="round"/>
    <!-- Dragon Head and Claws -->
    <circle cx="${x}" cy="${y + 35}" r="${width * 0.38}" fill="url(#scene-gold)"/>
    <path d="M${x - 8} ${y + 25}l-12-15m24 0l12-15" stroke="#ffe399" stroke-width="3"/>
  </g>`;
}

/** Sanxing Cave Mountain Gate (斜月三星洞青石山门) */
function sanxingGate(x = 960, y = 570, scale = 1): string {
  return `<g class="mountain-gate" transform="translate(${x} ${y}) scale(${scale})">
    <!-- Basalt Arch and Columns -->
    <path d="M-430 0h860v44h-860Z" fill="#152123" stroke="#9bb1a8" stroke-width="8"/>
    <path d="M-380-380h760v52h-760Z" fill="#1b292c" stroke="#9bb1a8" stroke-width="8"/>
    <!-- Eave Gable Roof with Moss and Green Glaze -->
    <path d="M-440-405q110 20 150-80h580q40 100 150 80-95 58-215 42h-450q-115 16-215-42Z" fill="#142c2b" stroke="#7ab89f" stroke-width="10"/>
    <!-- Granite Portal Posts -->
    <path d="M-350-328h82V0h-82Zm618 0h82V0h-82Z" fill="#354948" stroke="#162325" stroke-width="10"/>
    <path d="M-295-322h590" stroke="#b2c6bd" stroke-width="16"/>
    <!-- Dark Cave Opening Behind Portal -->
    <path d="M-235-280h470v280h-470Z" fill="#091316" stroke="#48655e" stroke-width="9"/>
    <!-- Inscribed Seal Plaque: 斜月三星洞 -->
    <g class="sanxing-tablet" transform="translate(0 -340)">
      <rect x="-140" y="-28" width="280" height="56" rx="6" fill="#1e2f2e" stroke="${palettes.jade.gold}" stroke-width="5"/>
      <text x="0" y="9" font-family="'Noto Serif SC', serif" font-weight="bold" font-size="28" fill="${palettes.jade.gold}" text-anchor="middle" letter-spacing="8">斜月三星洞</text>
    </g>
    <!-- Flanking Stone Guardian Medallions -->
    <circle cx="-180" cy="-160" r="22" fill="url(#scene-gold)" stroke="#223936" stroke-width="4"/>
    <circle cx="180" cy="-160" r="22" fill="url(#scene-gold)" stroke="#223936" stroke-width="4"/>
  </g>`;
}

/** Nantianmen Gate (南天门冷金玉阙) */
function nantianmenGate(x = 960, y = 560, scale = 1.4, cold = false): string {
  const goldStroke = cold ? '#a8b6c4' : '#e8c772';
  const stoneFill = cold ? '#25313d' : '#2c2538';
  return `<g class="mountain-gate" transform="translate(${x} ${y}) scale(${scale})">
    <!-- Lower Base Terrace -->
    <path d="M-450 0h900v45h-900Z" fill="${stoneFill}" stroke="${goldStroke}" stroke-width="9"/>
    <!-- Lower Dougong Bracketed Architrave -->
    <path d="M-400-380h800v55h-800Z" fill="#1d2630" stroke="${goldStroke}" stroke-width="8"/>
    <!-- Lower Double Curved Eaves -->
    <path d="M-460-405q120 22 160-85h600q40 107 160 85-100 62-225 45h-470q-125 17-225-45Z" fill="#18222b" stroke="${goldStroke}" stroke-width="11"/>
    <!-- Upper High Pavilion Eaves -->
    <path d="M-360-520q90 18 120-65h480q30 83 120 65-80 48-180 35h-360q-100 13-180-35Z" fill="#131c24" stroke="${goldStroke}" stroke-width="9"/>
    <!-- Main Giant Gate Columns -->
    <path d="M-370-325h88V0h-88Zm652 0h88V0h-88Z" fill="#852b2b" stroke="${goldStroke}" stroke-width="11"/>
    <!-- Coiled Dragon relief on columns -->
    <path d="M-326-310q55 150-10 300M370-310q-55 150 10 300" fill="none" stroke="${goldStroke}" stroke-width="12" stroke-linecap="round"/>
    <!-- Inner Portal Beam -->
    <path d="M-300-320h600" stroke="${goldStroke}" stroke-width="18"/>
    <!-- Inner Celestial Gate Opening -->
    <path d="M-245-280h490v280h-490Z" fill="#0d141b" stroke="${goldStroke}" stroke-width="9"/>
    <!-- Inscribed Plaque: 南天门 -->
    <g class="nantianmen-tablet" transform="translate(0 -340)">
      <rect x="-135" y="-30" width="270" height="60" rx="8" fill="#1b2530" stroke="${goldStroke}" stroke-width="6"/>
      <text x="0" y="11" font-family="'Noto Serif SC', serif" font-weight="900" font-size="34" fill="${goldStroke}" text-anchor="middle" letter-spacing="14">南天门</text>
    </g>
    <!-- White Jade Lotus Finials -->
    <circle cx="-190" cy="-160" r="22" fill="url(#scene-gold)"/>
    <circle cx="190" cy="-160" r="22" fill="url(#scene-gold)"/>
  </g>`;
}

/** Detailed Raft with Lashed Logs, Bamboo Pole, and Sail Rigging (破浪木排与竹篙缆绳) */
function oceanRaft(): string {
  return `<g class="raft" transform="translate(610 802)">
    <!-- 7 Lashed Timber Tree Trunks with Hemp Ropes -->
    <g class="raft-timbers">
      <path d="M-180 30q170 42 375-8l-52 45q-160 30-280-4Z" fill="#3a281c" stroke="#d5aa69" stroke-width="8"/>
      <!-- Individual Logs -->
      <path d="M-155 16h305M-162 28h310M-140 46h260M-120 62h215" stroke="#875f3a" stroke-width="12" stroke-linecap="round"/>
      <!-- Hemp Lashings / Mooring Ropes (捆扎缆绳) -->
      ${[-110, -50, 20, 90].map(rx => `<path d="M${rx} 10v56m8-56v56" stroke="#e0c897" stroke-width="4"/>`).join('')}
    </g>
    <!-- Stout Bamboo Punting Pole with Nodes (长竹篙) -->
    <g class="bamboo-pole">
      <path d="M-175 75L180-80" stroke="#a3965a" stroke-width="8" stroke-linecap="round"/>
      <!-- Bamboo Nodes -->
      ${[-110, -50, 10, 70, 130].map(px => `<circle cx="${px}" cy="${75 - (px + 175) * 155 / 355}" r="6" fill="#5c532e"/>`).join('')}
    </g>
    <!-- Mast, Yardarm, and Cord Rigging (桅杆与索具) -->
    <g class="raft-mast">
      <path d="M45-195v210" stroke="#3d2a1c" stroke-width="12" stroke-linecap="round"/>
      <!-- Diagonal Yardarm -->
      <path d="M15-185L120-140" stroke="#4a3625" stroke-width="8"/>
      <!-- Rigging Stay Ropes -->
      <path d="M45-195L-130 35M45-195L150 30" stroke="#cfbe97" stroke-width="3" opacity=".85"/>
      <!-- Billowing Patchwork Canvas Sail -->
      <path d="M48-188q68 58 58 160-48-18-62-28Z" fill="#dfd7bb" stroke="#887f6c" stroke-width="6"/>
      <path d="M50-145q45 28 50 85M50-105q35 20 40 55" fill="none" stroke="#b3aa8e" stroke-width="3"/>
    </g>
    <!-- Bow Wave Splash -->
    <path d="M-175 48q-45 15-70-10 25 35 75 18Z" fill="#eaf6f4" opacity=".85"/>
  </g>`;
}

/** 5-Panel Horizontal Long Scroll Landscape (漂洋过海无缝水墨长卷) */
function longScrollLandscape(p: Palette): string {
  const panels = [
    // Global continuous sky across all panels to ensure zero vertical seams
    `<defs>
      <linearGradient id="scroll-sky-grad" x1="0" y1="0" x2="9600" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#142e38"/>
        <stop offset="18%" stop-color="#283d50"/>
        <stop offset="35%" stop-color="#4a3e35"/>
        <stop offset="48%" stop-color="#162232"/>
        <stop offset="65%" stop-color="#0c1828"/>
        <stop offset="82%" stop-color="#2a1d2e"/>
        <stop offset="100%" stop-color="#55382c"/>
      </linearGradient>
    </defs>
    <rect x="-400" y="0" width="10400" height="1080" fill="url(#scroll-sky-grad)"/>`,

    // Panel 1: Huaguo Mountain Shore (0-1920)
    `<g class="scroll-flower-mountain" transform="translate(0 0)">
      ${blueGreenMountains(p, 648)}
      ${gnarledPine(120, 860, .75)}
      ${gnarledPine(1800, 870, .9, true)}
      ${lingzhiHerbs(220, 890, 1.2)}
    </g>`,
    // Panel 2: Vast Open Ocean with Auspicious Sun (1920-3840)
    `<g class="scroll-ocean" transform="translate(1920 0)">
      ${celestialOrb(850, 360, 68)}
      ${auspiciousClouds()}
      <path d="M-400 680 Q400 630 1000 680 T2320 670 v420 H-400 Z" fill="url(#scene-water)"/>
      <path d="M-400 710 Q300 660 800 710 T2120 700 v390 H-400 Z" fill="#184150" opacity=".6"/>
    </g>`,
    // Panel 3: Tempest and Stormy Ocean (3840-5760)
    `<g class="scroll-storm" transform="translate(3840 0)">
      <!-- Rolling storm clouds only in the upper atmosphere, smoothly blending -->
      <path d="M-1200 -50 C-600 0 -200 240 400 210 C1000 180 1600 300 2320 260 v400 C1600 620 1000 500 400 550 C-200 600 -700 480 -1200 -50 Z" fill="#0f1924" opacity=".85"/>
      <!-- Lightning Strike with soft aura -->
      <path d="M840 80 L790 240 L850 250 L770 480" fill="none" stroke="#ffeb85" stroke-width="8" filter="url(#scene-blur)"/>
      <path d="M840 80 L790 240 L850 250 L770 480" fill="none" stroke="#fffce6" stroke-width="3"/>
      <!-- Roaring storm waves -->
      <path d="M-400 660 Q300 580 800 670 T1920 650 T2320 670 v430 H-400 Z" fill="#132a35"/>
    </g>`,
    // Panel 4: Peaceful Starlit Night Sea (5760-7680)
    `<g class="scroll-night" transform="translate(5760 0)">
      ${celestialOrb(1560, 220, 65, true)}
      ${Array.from({ length: 32 }, (_, i) => `<circle cx="${(i * 389) % 1920}" cy="${(i * 197) % 550}" r="${1 + (i % 3)}" fill="#dbeeff" opacity=".7"/>`).join('')}
      <path d="M-400 680 Q400 640 1000 680 T2320 670 v400 H-400 Z" fill="#0f2233"/>
    </g>`,
    // Panel 5: Dawn Approaching Sanxing Cave Mountain (7680-9600)
    `<g class="scroll-dawn" transform="translate(7680 0)">
      ${celestialOrb(1080, 560, 95)}
      ${blueGreenMountains(p, 720)}
    </g>`,
  ];
  return `<g class="long-scroll-landscape">${panels.join('')}</g>`;
}

/** Grand Peach Banquet Long Table with 9000-Year Peaches and Elixir Gourds (盛宴长案与九千年蟠桃) */
function peachBanquetTable(disorder = false): string {
  // Giant 9000-year peach with carmine blush, jade leaf, golden stem
  const bigPeach = (x: number, y: number, rot = 0) => `<g class="nine-thousand-peach" transform="translate(${x} ${y}) rotate(${rot})">
    <!-- Golden Lotus Saucer Base -->
    <path d="M-36 12q36 18 72 0l-12 16h-48Z" fill="url(#scene-gold)" stroke="#aa7e35" stroke-width="2"/>
    <!-- Peach Fruit Flesh with Blushing Tip & Glossy Highlight -->
    <path d="M0-36 C-24-48 -42-20 -38 12 C-35 38 0 52 0 52 C0 52 35 38 38 12 C42-20 24-48 0-36 Z" fill="url(#scene-cinnabar)" stroke="#ffd1a8" stroke-width="3"/>
    <path d="M-5-28 C-20-38 -32-15 -28 10 C-25 30 0 42 0 42 C0 42 25 30 28 10 C32-15 20-38 5-28 Z" fill="#ff7675" opacity=".65"/>
    <path d="M-12-22 C-26-20 -30-5 -26 12" stroke="#ffffff" stroke-width="2.5" fill="none" opacity=".8" stroke-linecap="round"/>
    <!-- Jade Leaf (碧玉叶) -->
    <path d="M0-32 C12-52 38-48 32-26 C20-28 10-26 0-32 Z" fill="#2ecc71" stroke="#27ae60" stroke-width="2"/>
    <!-- Golden Stem -->
    <path d="M0-32 v-10" stroke="#d5aa55" stroke-width="3.5" stroke-linecap="round"/>
  </g>`;

  // Nine-turn Golden Elixir Gourd (九转金丹葫芦)
  const elixirGourd = (x: number, y: number, rot = 0) => `<g class="elixir-gourd" transform="translate(${x} ${y}) rotate(${rot})">
    <!-- Upper Gourd Lobe -->
    <circle cx="0" cy="-28" r="18" fill="url(#scene-gold)" stroke="#fff0aa" stroke-width="3"/>
    <!-- Lower Gourd Lobe -->
    <circle cx="0" cy="8" r="26" fill="url(#scene-gold)" stroke="#ffd76b" stroke-width="3"/>
    <!-- Red Silk Ribbon Tie (朱红丝带) -->
    <path d="M-15-10h30l-5 12h-20Z" fill="url(#scene-cinnabar)"/>
    <path d="M-8 2l-12 28m28-28l12 28" stroke="#d93b3b" stroke-width="3.5" stroke-linecap="round"/>
    <!-- Auspicious Halo -->
    <circle cx="0" cy="-8" r="38" fill="url(#scene-halo)" opacity=".45"/>
  </g>`;

  return `<g class="banquet-table ${disorder ? 'banquet-disorder' : ''}">
    <!-- Carved Rosewood Long Table (雕花红木长案) -->
    <path d="M90 670h1740l95 82H-5Z" fill="#4d231e" stroke="${palettes.feast.gold}" stroke-width="10"/>
    <path d="M110 752h1700v105H110Z" fill="#26120f" stroke="#874a32" stroke-width="7"/>
    <!-- Carved Apron Panels (透雕卷草云纹) -->
    ${Array.from({ length: 9 }, (_, i) => `<rect x="${140 + i * 190}" y="762" width="165" height="85" fill="#381915" stroke="${palettes.feast.gold}" stroke-width="3"/>`).join('')}
    <!-- Golden Chalices and Jade Cups (金樽玉盏) -->
    ${Array.from({ length: 9 }, (_, i) => {
      const gx = 150 + i * 205;
      const gy = disorder ? 640 - (i % 3) * 45 : 655;
      const rot = disorder ? (i % 2 ? 28 : -32) : 0;
      return `<g transform="translate(${gx} ${gy}) rotate(${rot})">
        <!-- Golden Chalice (金樽) -->
        <path d="M-22-65h44l-8 42q-14 18-28 0Z" fill="url(#scene-gold)" stroke="#fff0aa" stroke-width="3"/>
        <path d="M0-23v28m-36 0h72" stroke="${palettes.feast.gold}" stroke-width="8" stroke-linecap="round"/>
      </g>`;
    }).join('')}
    <!-- Giant 9000-year Peaches (九千年大蟠桃，中央主位已被大圣取走) -->
    ${Array.from({ length: 9 }, (_, i) => (!disorder && i === 4 ? '' : bigPeach(255 + i * 180, disorder ? 540 - (i % 3) * 45 : 630, disorder ? i * 28 : 0))).join('')}
    <!-- Scattered Nine-turn Elixir Gourds (散落九转金丹葫芦) -->
    ${[360, 720, 1140, 1530].map((gx, idx) => elixirGourd(gx, disorder ? 510 - idx * 25 : 625, disorder ? idx * 45 : 12)).join('')}
  </g>`;
}

/** Soaring Celestial Winged Horses in Bi Ma Wen Stables (御马监天马腾空) */
function celestialHorses(): string {
  return `<g class="celestial-horses" fill="#f0efe8" stroke="#3d4952" stroke-width="5">
    ${Array.from({ length: 10 }, (_, i) => {
      const x = 160 + i * 180;
      const y = 645 + (i % 3) * 36;
      const s = 0.76 + (i % 4) * 0.09;
      return `<g transform="translate(${x} ${y}) scale(${s})">
        <!-- Horse Muscular Torso -->
        <path d="M-60-68q38-42 110-15l20 28-36 42-68-3-26-26Z" fill="#ffffff"/>
        <!-- Neck and Sculpted Head -->
        <path d="M40-76 62-152l34-32 20 44-28 42-3 48Z" fill="#f7f7f4"/>
        <!-- Flowing Wind-whipped Mane (鬃毛飞扬) -->
        <path d="M42-120q-35-18-50-6m60-20q-40-15-55-4m65-15q-35-10-45-2" fill="none" stroke="#e0ded0" stroke-width="7" stroke-linecap="round"/>
        <!-- Galloping Prancing Legs -->
        <path d="M-48-18-60 85m38-95-10 102M35-15l-2 105m32-102L76 80" fill="none" stroke="#e6e4dc" stroke-width="18" stroke-linecap="round"/>
        <!-- Pegasus Wing Appendage (天马仙翼) -->
        <path d="M-10-85q-45-75 15-115 15 48 45 65-15 28-60 50Z" fill="url(#scene-halo)" stroke="#e2d8b5" stroke-width="4"/>
        <!-- Flowing Tail -->
        <path d="M-58-72q-38-22-60 15" fill="none" stroke="#f0efe8" stroke-width="14" stroke-linecap="round"/>
        <!-- Cloud Hooves (云雾四蹄) -->
        <circle cx="-60" cy="85" r="10" fill="url(#scene-halo)"/>
        <circle cx="76" cy="80" r="10" fill="url(#scene-halo)"/>
      </g>`;
    }).join('')}
  </g>`;
}

/** Disciplined Armored Celestial Soldier Phalanxes (十万天兵天将阵列) */
function cloudArmy(): string {
  return `<g class="army-ranks" fill="#0d1622" stroke="#688094" stroke-width="2.5">
    ${Array.from({ length: 9 }, (_, row) => Array.from({ length: 29 }, (_, col) => {
      const x = 20 + col * 68 + (row % 2) * 32;
      const y = 180 + row * 48;
      const scale = 0.44 + row * 0.026;
      return `<g transform="translate(${x} ${y}) scale(${scale})">
        <!-- Helmet and Visor -->
        <circle cy="-55" r="20" fill="#152433" stroke="${palettes.siege.gold}" stroke-width="3"/>
        <path d="M-5-75l5-12 5 12Z" fill="${palettes.siege.cinnabar}"/>
        <!-- Cuirass Armor (玄甲) -->
        <path d="M-22 30q-15-58 22-70 36 12 22 70Z" fill="#101c29"/>
        <!-- Halberd and Spear (戈戟矛槊) -->
        <path d="M-34-10h68M30-14 62-92m-5 12h14" fill="none" stroke="#8fa4b3" stroke-width="6" stroke-linecap="round"/>
        <!-- Battle Pennant (军旗) -->
        ${(col + row) % 7 === 0 ? `<path d="M62-92l38 18-38 18Z" fill="url(#scene-cinnabar)"/>` : ''}
      </g>`;
    }).join('')).join('')}
  </g>`;
}

/** Eight Trigrams Cauldron with Taiji Relies, Beast Legs, and Loop Ears (太极八卦炼丹炉) */
function furnace(cracked = false): string {
  const trigrams = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
  return `<g class="eight-trigrams-furnace" transform="translate(960 600)">
    <!-- Base Shadow -->
    <ellipse cy="380" rx="540" ry="90" fill="#05070a"/>
    <!-- Cauldron Tripod Beast-Claw Legs (兽爪三足) -->
    <g class="tripod-legs" fill="#182320" stroke="#a07348" stroke-width="12">
      <path d="M-320 200q-60 120-20 190h65q-30-70 10-180Z"/>
      <path d="M320 200q60 120 20 190h-65q30-70-10-180Z"/>
      <path d="M-40 260v135h80V260Z"/>
    </g>
    <!-- Cauldron Bronze Belly (浑圆炉体) -->
    <path d="M-365-315q365-100 730 0l68 165-84 460q-348 120-698 0l-84-460Z" fill="url(#scene-bronze)" stroke="url(#scene-gold)" stroke-width="26"/>
    <!-- Waistbands and Meander Borders -->
    <path d="M-400-160q400 145 800 0M-345 290q345 125 690 0" fill="none" stroke="#ab7748" stroke-width="14"/>
    <!-- Top Rim and Cover (炉顶) -->
    <ellipse cy="-320" rx="385" ry="80" fill="#1b2522" stroke="#d5a363" stroke-width="19"/>
    <path d="M-345-350q52-160 195-176h300q143 16 195 176" fill="#172220" stroke="#c08f58" stroke-width="20"/>
    <!-- Twin Dragon Loop Ears (炉耳) -->
    <path d="M-418-170h-85v-110h80M418-170h85v-110h-80" fill="none" stroke="#ab7748" stroke-width="28" stroke-linecap="round"/>
    <!-- Central Furnace Door Frame -->
    <path d="M-225-5h450v242h-450Z" fill="#07090d" stroke="#8d5f44" stroke-width="14"/>
    <!-- Eight Trigrams Rune Halos (八卦阵纹) -->
    ${trigrams.map((glyph, i) => {
      const angle = (i * 45 - 90) * Math.PI / 180;
      const tx = Math.cos(angle) * 260;
      const ty = Math.sin(angle) * 190 - 70;
      return `<g class="bagua-rune" transform="translate(${tx} ${ty})">
        <circle r="26" fill="#121b18" stroke="url(#scene-gold)" stroke-width="3"/>
        <text y="9" font-family="monospace" font-size="28" font-weight="bold" fill="#ffcf66" text-anchor="middle">${glyph}</text>
      </g>`;
    }).join('')}
    <!-- Glowing Cracks Seeping Molten Gold and Fire (破损金光裂纹) -->
    ${cracked ? `<g class="furnace-cracks" fill="none" stroke="#ffbe52" stroke-width="10" filter="url(#scene-glow)">
      <path d="M-180-390-145-290-218-165-128-75-185 65-110 220M140-410 75-280 152-185 80-25 180 65 90 240M-395-95l205 35 105 160M390-110 180-60 95 85"/>
      <path d="M-50-250l35 80-60 110 90 120" stroke="#ff5533" stroke-width="8"/>
    </g><g fill="none" stroke="#fffce0" stroke-width="4.5">
      <path d="M-180-390-145-290-218-165-128-75-185 65-110 220M140-410 75-280 152-185 80-25 180 65 90 240M-395-95l205 35 105 160M390-110 180-60 95 85"/>
    </g>` : ''}
  </g>`;
}

/** Five-Color Divine Ribbon Streamers (五彩神光绸带) */
function fiveColorTrails(): string {
  const colors = ['#f8d878', '#dc5546', '#4ec9b1', '#558fe6', '#bd72d5'];
  return `<g class="released-color-trails" fill="none" stroke-linecap="round">
    ${colors.map((color, i) => `<path d="M${-160 + i * 35} ${670 + i * 45}Q${540 + i * 85} ${-125 + i * 130} ${1120 + i * 95} ${250 + i * 40}T2080 ${300 + i * 120}" stroke="${color}" stroke-width="${26 + i * 4}" opacity=".78"/>`).join('')}
  </g>`;
}

/* =========================================================================
   SCENE BUILDERS (1 TO 22)
   ========================================================================= */

function artwork(scene: number): string {
  const p = theme(scene);
  switch (scene) {
    case 1:
      // Scene 1: 云海天宫 (Cloud Sea & Heavenly Palace)
      return `${celestialOrb(960, 360, 110)}
        ${auspiciousClouds()}
        ${blueGreenMountains(p, 720)}
        <!-- Grand Celestial Palace Complex (天宫金阙) -->
        <g class="palace-complex" transform="translate(960 540)">
          <!-- Main Palace Platform -->
          <path d="M-650 250h1300l110 120H-760Z" fill="#222b35" stroke="url(#scene-gold)" stroke-width="7"/>
          <!-- Colonnade and Halls -->
          ${Array.from({ length: 9 }, (_, i) => `<rect x="${-520 + i * 130}" y="120" width="22" height="130" fill="url(#scene-cinnabar)" stroke="url(#scene-gold)" stroke-width="3"/>`).join('')}
          ${hanTangEaves(0, -60, 1150, 180, 80)}
          <!-- Upper Tier Pavilion -->
          ${Array.from({ length: 5 }, (_, i) => `<rect x="${-240 + i * 120}" y="-130" width="18" height="80" fill="url(#scene-cinnabar)" stroke="url(#scene-gold)" stroke-width="3"/>`).join('')}
          ${hanTangEaves(0, -220, 680, 120, 55)}
        </g>
        ${stoneStairs(780, 1080)}
        ${mist(820, .6)}`;

    case 2:
      // Scene 2: 漂洋过海 (Crossing the Ocean on a Raft)
      return `${longScrollLandscape(p)}
        <g class="sea-foreground">
          <path d="M0 740q180-50 385 0t390 5q200-52 395 0t385-8q165-38 380 10v335H0Z" fill="url(#scene-water)"/>
          <path d="M0 780q142-34 285 5t318-8q135-40 290 5t324-5q162-46 302-6t420 8" fill="none" stroke="#e0ece0" stroke-width="9" opacity=".72"/>
        </g>
        ${oceanRaft()}
        <g class="voyage-gate">
          ${sanxingGate(1620, 640, .38)}
          ${stoneStairs(810, 1080)}
        </g>
        ${mist(880, .45)}`;

    case 3:
      // Scene 3: 三星洞求道 (Seeking Tao at Sanxing Cave)
      return `${celestialOrb(960, 250, 75)}
        ${blueGreenMountains(p, 560)}
        ${bambooGrove(220, 680, 1.2)}
        ${bambooGrove(1700, 690, 1.2)}
        ${sanxingGate(960, 530, .88)}
        ${stoneStairs(630, 1080)}
        ${mist(570, .42)}
        ${mist(910, .36)}
        ${gnarledPine(190, 1020, 1.45)}
        ${gnarledPine(1780, 1010, 1.35, true)}
        ${lingzhiHerbs(380, 1040, 1.5)}`;

    case 4:
      // Scene 4: 花果山·自由 (Huaguo Mountain Freedom)
      return `${celestialOrb(1440, 200, 105)}
        ${auspiciousClouds()}
        ${blueGreenMountains(p, 600)}
        <!-- Water Curtain Cave Cascading Waterfall (水帘洞层叠飞瀑) -->
        <g class="waterfall-complex">
          <path d="M1040 520 C1090 560 1070 720 1050 850 C1040 920 1060 1010 1030 1080 h100 C1100 990 1080 850 1110 720 C1130 600 1090 540 1040 520 Z" fill="#1b453a" stroke="${p.gold}" stroke-width="2"/>
          <path d="M1340 510 C1280 550 1300 710 1320 840 C1330 910 1310 1000 1340 1080 h-100 C1250 990 1270 850 1240 720 C1220 600 1260 540 1340 510 Z" fill="#1b453a" stroke="${p.gold}" stroke-width="2"/>
          <path class="waterfall" d="M1080 530 C1100 640 1070 780 1085 920 C1095 1000 1075 1060 1080 1080 h190 C1265 1050 1250 990 1260 910 C1275 770 1240 630 1270 530 Z" fill="#e8fbf6" opacity=".92"/>
          <path d="M1120 540 C1135 660 1110 820 1125 1080 M1175 535 C1185 680 1170 850 1180 1080 M1230 540 C1220 670 1240 840 1230 1080" stroke="#ffffff" stroke-width="4.5" fill="none" opacity=".85"/>
          <ellipse cx="1175" cy="1060" rx="160" ry="36" fill="#ffffff" opacity=".7" filter="url(#scene-blur)"/>
          <ellipse cx="1175" cy="1060" rx="140" ry="24" fill="#d0f4ea" opacity=".8"/>
          <path d="M1040 1050 Q1175 1085 1310 1050 M1070 1065 Q1175 1095 1280 1065" stroke="#ffffff" stroke-width="3" fill="none" opacity=".8"/>
        </g>
        ${gnarledPine(200, 1020, 1.3)}
        ${gnarledPine(1810, 1070, 1.45, true)}
        ${lingzhiHerbs(360, 1030, 1.4)}
        <path d="M0 920 C260 860 480 940 780 900 C1080 860 1360 940 1620 900 C1780 880 1860 920 1920 905 v175 H0 Z" fill="#16433e"/>
        <!-- Foreground Framing: Ancient Pine Boughs Overhanging from Top Corners -->
        <g class="scene-foreground-frame" opacity=".95">
          <path d="M-40-30 Q140 90 320 60 Q420 50 500-20" fill="none" stroke="#162220" stroke-width="36" stroke-linecap="round"/>
          <path d="M1960-40 Q1780 100 1600 70 Q1480 50 1380-20" fill="none" stroke="#162220" stroke-width="32" stroke-linecap="round"/>
          <ellipse cx="300" cy="80" rx="75" ry="32" fill="#144a39" stroke="#529977" stroke-width="2.5"/>
          <ellipse cx="460" cy="30" rx="65" ry="28" fill="#1b5c49" stroke="#68aa88" stroke-width="2.5"/>
          <ellipse cx="1640" cy="90" rx="80" ry="34" fill="#144a39" stroke="#529977" stroke-width="2.5"/>
          <ellipse cx="1460" cy="40" rx="68" ry="30" fill="#1b5c49" stroke="#68aa88" stroke-width="2.5"/>
        </g>`;

    case 5:
      // Scene 5: 天庭诏安 (Heaven's Decree at Nantianmen)
      return `${auspiciousClouds()}
        <ellipse cx="960" cy="435" rx="540" ry="330" fill="url(#scene-halo)"/>
        ${blueGreenMountains(p, 850)}
        ${nantianmenGate(960, 560, 1.52, true)}
        ${stoneStairs(680, 1080)}
        <!-- Imperial Gold Silk Decree (天庭诏书) -->
        <g class="heavenly-decree" transform="translate(960 260)">
          <!-- Gilded Silk Scroll Body -->
          <path d="M-305-30h610v205h-610Z" fill="url(#scene-gold)" stroke="#fff0be" stroke-width="12"/>
          <!-- Dragon Seals and Cinnabar Border -->
          <path d="M-285-15h570v175h-570Z" fill="#f5e7c1" stroke="url(#scene-cinnabar)" stroke-width="6"/>
          <!-- Side Scroll Rods with Silk Cords -->
          <path d="M-330-40h36v225h-36Zm624 0h36v225h-36Z" fill="#8f2d26" stroke="url(#scene-gold)" stroke-width="8"/>
          <!-- Calligraphy lines -->
          <path d="M-200 25h400M-190 68h380M-175 110h350" stroke="#75231e" stroke-width="9" stroke-linecap="round" opacity=".65"/>
        </g>
        ${mist(815, .35)}`;

    case 6:
      // Scene 6: 弼马温 (Bi Ma Wen / Celestial Stables)
      return `<!-- Stable Shadow and Architecture -->
        <rect class="stable-shadow" x="0" y="465" width="1920" height="615" fill="#1b232c" opacity=".85"/>
        <g class="stable-beams" stroke="#87352d" stroke-width="30">
          <path d="M0 450h1920M195 440v600M535 440v600M880 440v600M1225 440v600M1560 440v600M1900 440v600"/>
        </g>
        ${celestialHorses()}
        <path d="M0 860h1920v220H0Z" fill="#182025"/>
        <!-- High Court Officials Watching from Upper Gallery -->
        <g class="high-court-officials" fill="#0b1118">
          ${[420, 560, 1340, 1480].map(x => `<g transform="translate(${x} 320)">
            <ellipse cx="0" cy="-60" rx="24" ry="32"/>
            <!-- Court Hat (梁冠) -->
            <path d="M-30-70h60v-25h-60Z M-40-70h80" stroke="${palettes.court.gold}" stroke-width="4"/>
            <!-- Robe and Tablet (笏板) -->
            <path d="M-32 30q-26-80 32-100 58 20 32 100l38 135h-125Z"/>
            <path d="M0-10v50" stroke="#ffffff" stroke-width="8"/>
          </g>`).join('')}
        </g>`;

    case 7:
      // Scene 7: 门外 (Outside the Banquet Doors)
      return `<rect class="corridor-floor" y="690" width="1920" height="390" fill="#28323d"/>
        <path d="M-100 1080 745 355h430l845 725" fill="#1b242e" stroke="${palettes.feast.gold}" stroke-width="10"/>
        <!-- Han-Tang Architrave Beams -->
        <path d="M0 90h1920v160H0Z" fill="#212a34" stroke="${palettes.feast.gold}" stroke-width="14"/>
        ${Array.from({ length: 5 }, (_, i) => `<path d="M${85 + i * 235} 230v650" stroke="#3d4952" stroke-width="${50 - i * 5}"/><path d="M${1835 - i * 235} 230v650" stroke="#3d4952" stroke-width="${50 - i * 5}"/>`).join('')}
        <!-- Banquet Red Lacquered Double Doors with Lion Knockers -->
        <g class="banquet-door">
          <path d="M745 315h430v445H745Z" fill="#a8744f" stroke="#d5ab6f" stroke-width="12"/>
          <path d="M775 348h370v385H775Z" fill="#ffeed0"/>
          <!-- Feast Hall Scene Through Opened Doors -->
          <g class="banquet-through-door">
            <path d="M785 635h350v52H785Z" fill="#752a23" stroke="#f0cf9d" stroke-width="7"/>
            ${[830, 895, 960, 1025, 1090].map(x => `<path d="M${x - 15} 624q15-34 30 0l-10 20h-10Z" fill="#e86b7b" stroke="#f0c283" stroke-width="3.5"/>`).join('')}
            <circle cx="860" cy="480" r="26" fill="url(#scene-halo)"/>
            <circle cx="1060" cy="480" r="26" fill="url(#scene-halo)"/>
          </g>
          <!-- Left and Right Doors with Beast Head Knockers -->
          <path class="door-left" d="M748 318 960 328V752L748 760Z" fill="#7b2824" stroke="#d0a266" stroke-width="9"/>
          <path class="door-right" d="M1172 318 960 328V752l212 8Z" fill="#7b2824" stroke="#d0a266" stroke-width="9"/>
        </g>
        <path d="M0 850h1920" stroke="#7e7a6d" stroke-width="10"/>`;

    case 8:
      // Scene 8: 笑容消失 (Smile Vanishes / Peach Banquet Hall)
      return `<rect class="banquet-hall-bg" width="1920" height="1080" fill="#17202b"/>
        <ellipse cx="990" cy="470" rx="730" ry="490" fill="url(#scene-halo)" opacity=".36"/>
        <!-- Grand Celestial Colonnade -->
        ${[150, 480, 1440, 1770].map(x => dragonColumn(x, 100, 780, 65)).join('')}
        ${peachBanquetTable(false)}
        <!-- Detailed Banquet Close-up Insert with Bitten 9000-Year Celestial Peach (右侧特写画框) -->
        <g class="feast-inserts" transform="translate(1360 450) scale(0.85)">
          <!-- Circular Anime Focus Spotlight Frame -->
          <circle cx="0" cy="0" r="320" fill="url(#scene-halo)" opacity=".45"/>
          <circle cx="0" cy="0" r="280" fill="#17202b" stroke="url(#scene-gold)" stroke-width="7"/>

          <!-- 1. Grand 9000-Year Celestial Peach -->
          <g transform="translate(0 -20) scale(2.0)">
            <!-- Golden Leaf -->
            <path d="M0-40 C20-75 65-80 60-45 C35-48 15-42 0-40 Z" fill="#2ecc71" stroke="#27ae60" stroke-width="3"/>
            <path d="M0-40 v-18" stroke="#d5aa55" stroke-width="5" stroke-linecap="round"/>
            <!-- Ripe Carmine Peach Body -->
            <path d="M0-48 C-42-80 -85-30 -75 25 C-65 75 0 100 0 100 C0 100 65 75 75 25 C85-30 42-80 0-48 Z" fill="url(#scene-cinnabar)" stroke="#ffd1a8" stroke-width="4"/>
            <!-- Specular Highlight Curve -->
            <path d="M-30 -35 C-55 -25 -65 5 -55 35" stroke="#ffffff" stroke-width="5" fill="none" opacity=".85" stroke-linecap="round"/>
            <path d="M-22 -40 C-40 -35 -48 -15 -42 10" stroke="#ffffff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>
            <!-- Crescent Bite Mark (仙桃咬痕: 鲜美白玉果肉与果核) -->
            <path d="M38-5 C22-2 15 15 25 32 C35 48 58 45 68 35 C52 32 45 15 55 0 Z" fill="#fff9e6" stroke="#c0392b" stroke-width="3.5"/>
            <ellipse cx="45" cy="18" rx="8" ry="12" fill="#8c532b" stroke="#5c3800" stroke-width="2"/>
            <path d="M42 10 Q47 18 43 26" stroke="#4a2c14" stroke-width="2" fill="none"/>
          </g>

          <!-- 2. Furry Monkey Arm and Fingers Clasping over the Peach -->
          <g id="peach-gripping-hand" transform="translate(0 30)">
            <!-- Golden furry arm extending from bottom-left -->
            <path d="M-130 220 C-110 140 -80 70 -50 35 C-30 50 -45 120 -60 220 Z" fill="#b7791f" stroke="#683b0d" stroke-width="3.5"/>
            <path d="M-75 160 L-55 75 L-35 40" stroke="#f1c40f" stroke-width="9" fill="none" stroke-linecap="round"/>
            <!-- Palm and Fingers wrapping in front of the peach base -->
            <ellipse cx="-20" cy="50" rx="35" ry="25" fill="#d68910" stroke="#935817" stroke-width="3"/>
            <!-- 4 Fingers wrapped across the peach front -->
            <path d="M-45 35 C-25 15 15 20 40 45" stroke="#f5cd79" stroke-width="14" stroke-linecap="round" fill="none"/>
            <path d="M-38 12 C-15 -8 28 -5 55 18" stroke="#f5cd79" stroke-width="14" stroke-linecap="round" fill="none"/>
            <path d="M-28 -12 C-5 -30 38 -25 65 -2" stroke="#f5cd79" stroke-width="13" stroke-linecap="round" fill="none"/>
            <path d="M-50 60 C-30 40 0 45 25 70" stroke="#f5cd79" stroke-width="13" stroke-linecap="round" fill="none"/>
            <!-- Black Claws at finger tips -->
            <circle cx="42" cy="45" r="5" fill="#2c1a0e"/>
            <circle cx="57" cy="18" r="5" fill="#2c1a0e"/>
            <circle cx="67" cy="-2" r="5" fill="#2c1a0e"/>
            <circle cx="27" cy="70" r="5" fill="#2c1a0e"/>
          </g>

          <!-- Golden Wine Ewer and Spilled Pearls on table -->
          <g transform="translate(-160 120)">
            <path d="M-18 20 L-10 -25 L10 -25 L18 20 Z" fill="url(#scene-gold)" stroke="#aa7e35" stroke-width="2.5"/>
            <path d="M10 -20 Q28 -10 18 10" stroke="url(#scene-gold)" stroke-width="5" fill="none"/>
            <circle cx="-14" cy="-28" r="4" fill="#ffffff" opacity=".8"/>
          </g>
          <circle cx="150" cy="140" r="8" fill="url(#scene-gold)"/>
          <circle cx="175" cy="150" r="6" fill="url(#scene-gold)"/>
        </g>
        ${mist(850, .4)}`;

    case 9:
      // Scene 9: 闹蟠桃会 (Havoc at the Peach Banquet)
      return `<rect y="80" width="1920" height="730" fill="#242e3d"/>
        <!-- Giant Hall Columns -->
        <g class="feast-pillars" stroke="#782d27" stroke-width="80">
          <path d="M150 95v790M1770 95v790"/>
        </g>
        <!-- Fleeing Immortals Silhouettes -->
        <g class="immortal-silhouettes" fill="#141c26" stroke="#a07a56" stroke-width="4">
          ${Array.from({ length: 9 }, (_, i) => {
            const x = 180 + i * 195;
            return `<g transform="translate(${x} 585)">
              <path d="M-40 38q-18-85 42-88 52 5 42 88l-26 58h-34Z"/>
              <ellipse cx="0" cy="-72" rx="30" ry="40"/>
            </g>`;
          }).join('')}
        </g>
        <!-- Disordered, Overturned Tables -->
        ${peachBanquetTable(true)}
        <!-- Flying Crockery and Gourds Hurled into Air -->
        <g class="flying-crockery" fill="url(#scene-gold)">
          <ellipse cx="320" cy="325" rx="58" ry="22" transform="rotate(-32 320 325)"/>
          <ellipse cx="1640" cy="300" rx="56" ry="22" transform="rotate(28 1640 300)"/>
          <path d="M965 295q32-75 84 0l-26 46h-40Z"/>
          <!-- Flying Elixir Flask -->
          <circle cx="680" cy="280" r="28" fill="#ffd152"/>
        </g>
        <!-- Spilled Celestial Wine and Ambrosia Wave -->
        <path class="wine-splash" d="M280 245q460-315 745 165t685-75" fill="none" stroke="#f0cf85" stroke-width="24" stroke-linecap="round" opacity=".75"/>`;

    case 10:
      // Scene 10: 归山 (Returning to Huaguo Mountain)
      return `${celestialOrb(970, 660, 110)}
        ${auspiciousClouds()}
        ${blueGreenMountains(p, 650)}
        ${gnarledPine(150, 1010, 1.35)}
        ${gnarledPine(1810, 1010, 1.48, true)}
        <path d="M0 930q310-168 615 32t635-45q258-128 685 50v115H0Z" fill="#1b634c"/>
        <!-- Joyous Returning Monkeys Celebrating -->
        <g class="returning-monkeys" fill="#2d2320">
          ${[310, 430, 525, 1385, 1495, 1605].map((x, i) => `<g transform="translate(${x} ${860 + (i % 3) * 32}) scale(${0.62 + (i % 2) * 0.22})">
            <circle cy="-48" r="22"/>
            <path d="M-22-28q-34 50-24 88h88q12-42-24-88Z"/>
            <path d="M-34 28q-44-14-42-52" fill="none" stroke="#2d2320" stroke-width="13" stroke-linecap="round"/>
            <!-- Peach Basket -->
            <path d="M25 15h30v25H25Z" fill="#875128"/>
            <circle cx="40" cy="12" r="14" fill="#e86b7b"/>
          </g>`).join('')}
        </g>`;

    case 11:
      // Scene 11: 天兵压境 (Vast Celestial Army Besieging Mountain)
      return `${blueGreenMountains(p, 750)}
        <!-- Heavy Storm Clouds Blotting Sky with Golden Cracks -->
        <g class="siege-cloud-group">
          <path class="siege-cloud" d="M0 0h1920v630q-180-48-330-8t-350-16q-205-65-365-4t-415-28Q240 505 0 595Z" fill="#080e18"/>
          <!-- Lightning Veins Tearing Clouds -->
          <path d="M380 0l-55 180 45 40-70 180M1480 0l65 210-40 50 65 190" fill="none" stroke="${palettes.siege.gold}" stroke-width="5" opacity=".7"/>
        </g>
        ${cloudArmy()}
        <path d="M0 910q275-118 548 0t498 8q272-115 485-22t405 22v165H0Z" fill="#0d1822"/>
        ${gnarledPine(160, 1040, 1.25)}
        ${gnarledPine(1780, 1020, 1.28, true)}`;

    case 12:
      // Scene 12: 第一棒 (The First Golden Cudgel Strike)
      return `${blueGreenMountains(p, 720)}
        <!-- Dramatic Boiling Storm Clouds with Lightning Veins -->
        <g class="storm-clouds">
          <path d="M0 0 C400 0 600 220 960 180 C1300 140 1600 280 1920 220 v380 C1600 680 1200 580 960 620 C650 660 300 560 0 640 Z" fill="#152230" opacity=".85"/>
          <!-- Branching Golden Lightning Strikes -->
          <path d="M420 0 L360 180 L430 195 L340 380 L390 390 L310 540" fill="none" stroke="#ffeaa7" stroke-width="6" filter="url(#scene-blur)"/>
          <path d="M420 0 L360 180 L430 195 L340 380 L390 390 L310 540" fill="none" stroke="#ffffff" stroke-width="2.5"/>
          <path d="M1520 0 L1580 160 L1530 180 L1610 360" fill="none" stroke="#ffeaa7" stroke-width="5" filter="url(#scene-blur)"/>
          <path d="M1520 0 L1580 160 L1530 180 L1610 360" fill="none" stroke="#ffffff" stroke-width="2"/>
        </g>
        ${cloudArmy()}
        <!-- Descending Torrent of Spears and Halberds -->
        <g class="descending-spears" stroke="#b8cbd8" stroke-width="4.5" opacity=".8">
          ${Array.from({ length: 42 }, (_, i) => `<path d="M${i * 48} ${140 + (i % 4) * 65}l-85 410"/>`).join('')}
        </g>
        <!-- Cratered Impact Ground with Shockwave Ripples -->
        <g class="impact-ground-group">
          <path class="impact-ground" d="M0 840 C450 780 750 860 960 830 C1200 800 1500 870 1920 835 v245 H0 Z" fill="#152430"/>
          <ellipse cx="960" cy="920" rx="420" ry="50" fill="none" stroke="url(#scene-gold)" stroke-width="14" opacity=".8"/>
        </g>
        <!-- Foreground Battle Framing: Flying broken celestial spears & cloud swirls -->
        <g class="scene-foreground-battle" opacity=".95">
          <!-- Spear slicing across lower-left foreground -->
          <path d="M-50 1040 L260 760" stroke="#f5f6fa" stroke-width="14" stroke-linecap="round"/>
          <path d="M260 760 L310 720 L290 780 Z" fill="#f5f6fa" stroke="#ffd700" stroke-width="3"/>
          <path d="M245 770 Q280 820 230 860" stroke="#e74c3c" stroke-width="10" fill="none"/>
          <!-- Celestial Halberd slicing across lower-right foreground -->
          <path d="M1980 1060 L1640 760" stroke="#f5f6fa" stroke-width="14" stroke-linecap="round"/>
          <path d="M1640 760 L1590 720 L1610 780 Z" fill="#f5f6fa" stroke="#ffd700" stroke-width="3"/>
        </g>`;

    case 13:
      // Scene 13: 从花果山杀向天宫 (Charging from Mountain to Heavens)
      return `<g class="battle-scroll">
          ${blueGreenMountains(p, 910)}
          ${cloudArmy()}
          ${auspiciousClouds()}
          <path d="M0 740q325-175 610-14t605-82q355-130 715 52v385H0Z" fill="#142230" opacity=".8"/>
        </g>
        <g class="voyage-gate">${nantianmenGate(1640, 580, .48, true)}</g>
        <!-- Powerful Golden Cudgel Energy Trail -->
        <path class="staff-trail" d="M-90 985Q390 590 875 400t1165-62q440-175 830-78" fill="none" stroke="url(#scene-gold)" stroke-width="22" stroke-linecap="round" opacity=".8" filter="url(#scene-glow)"/>`;

    case 14:
      // Scene 14: 锁 (Chained on Execution Platform)
      return `<!-- Execution Platform Sumeru Base -->
        <rect width="1920" height="1080" fill="#070c14"/>
        <path d="M300 780h1320l120 140H180Z" fill="#1b232c" stroke="#5a5245" stroke-width="8"/>
        <!-- Dark Gold Execution Pillars -->
        ${[260, 520, 1400, 1660].map(x => dragonColumn(x, 180, 680, 55)).join('')}
        <!-- Heavy Black Iron Restraint Chains with Runes -->
        <g class="chains" fill="none" stroke="#72808c" stroke-width="26" stroke-linecap="round">
          <path d="M-50 325Q335 840 950 740T1970 290"/>
          <path d="M-50 680Q405 480 950 735t1020-115"/>
        </g>
        <!-- Fallen Cudgel on Flagstones -->
        <path class="fallen-staff" d="M1230 910 1720 1025" stroke="#7a6f58" stroke-width="26" stroke-linecap="round"/>`;

    case 15:
      // Scene 15: 雷、刀、火 (Thunder, Blade, Fire on Platform)
      return `<rect width="1920" height="1080" fill="#060e18"/>
        <path d="M300 760h1320l120 140H180Z" fill="#171f28" stroke="#686052" stroke-width="8"/>
        <g class="punishment-tools">
          <!-- Celestial Lightning Bolts -->
          <path class="thunder" d="M1060 0 890 375h170L885 815" fill="none" stroke="#d5eaf2" stroke-width="24" stroke-linejoin="bevel" filter="url(#scene-glow)"/>
          <!-- Heavy Celestial Guillotine Execution Blade -->
          <path class="blade" d="M1400-100 1100 730l-75-45 290-830Z" fill="#758896" stroke="#dbe7eb" stroke-width="12"/>
          <!-- Raging Celestial Scorch Fireline -->
          <path class="fireline" d="M0 965q135-180 265 0t275 0q130-215 280 0t260 0q160-200 295 0t290 0q125-200 260 0v115H0Z" fill="url(#scene-cinnabar)" opacity=".68"/>
        </g>`;

    case 16:
      // Scene 16: 入炉 (Entering the Eight Trigrams Furnace)
      return `<rect width="1920" height="1080" fill="#08090e"/>
        ${furnace(false)}
        <!-- Heavy Closing Door with Taiji Yin-Yang Relief -->
        <g class="closing-door">
          <path d="M740 600h440v255H740Z" fill="#090a10" stroke="#a5724a" stroke-width="16"/>
          <!-- Taiji Disk -->
          <circle cx="960" cy="728" r="55" fill="#1b2522" stroke="url(#scene-gold)" stroke-width="5"/>
          <path d="M960 673a55 55 0 0 1 0 110 27.5 27.5 0 0 1 0-55 27.5 27.5 0 0 0 0-55z" fill="#e0c279"/>
          <circle cx="960" cy="700" r="8" fill="#1b2522"/>
          <circle cx="960" cy="755" r="8" fill="#e0c279"/>
        </g>
        <circle cx="960" cy="650" r="120" fill="url(#scene-halo)" opacity=".25"/>`;

    case 17:
      // Scene 17: 炉火 (Blazing Samadhi Fire Runes)
      return `<rect width="1920" height="1080" fill="#09080e"/>
        <ellipse cx="960" cy="705" rx="610" ry="310" fill="url(#scene-halo)" opacity=".52"/>
        <!-- Multi-colored Samadhi Flame Tongues (三昧真火) -->
        <g class="furnace-flames">
          ${[
            '#8b2829', // Crimson
            '#ce4d33', // Vermilion
            '#ea8b3f', // Flame Orange
            '#f2bf5d', // Solar Gold
            '#5fb3ab', // Celestial Cyan
            '#5278bd', // Indigo Blue
            '#8f5eb0', // Ethereal Violet
            '#fff2a8', // White-hot Core
          ].map((flameColor, i) => `<path d="M${415 + i * 160} 1080q-88-225 12-450t40-415q175 210 120 460t-24 405Z" fill="${flameColor}" opacity=".68"/>`).join('')}
        </g>
        <ellipse cx="960" cy="850" rx="390" ry="76" fill="#140f17"/>`;

    case 18:
      // Scene 18: 火眼金睛 (Fiery Eyes and Golden Pupils)
      return `<rect width="1920" height="1080" fill="#090a12"/>
        ${furnace(true)}
        <!-- Blinding Golden Eye Ray Beams -->
        <g class="eye-rays" fill="none" stroke="#ffe599" stroke-width="26" stroke-linecap="round" filter="url(#scene-blur)">
          <path d="M900 540 0 160M1020 540l900-380"/>
        </g>
        <g fill="none" stroke="#fffce0" stroke-width="6" stroke-linecap="round">
          <path d="M900 540 0 160M1020 540l900-380"/>
        </g>`;

    case 19:
      // Scene 19: 破炉 (Exploding from Furnace)
      return `<rect width="1920" height="1080" fill="#10132b"/>
        ${fiveColorTrails()}
        ${furnace(true)}
        <!-- Exploding Bronze Cauldron Shards -->
        <g class="furnace-shards" fill="#a0684a" stroke="#f5c27e" stroke-width="6">
          ${Array.from({ length: 16 }, (_, i) => {
            const angle = (i * 22.5) * Math.PI / 180;
            const x = 960 + Math.cos(angle) * 590;
            const y = 590 + Math.sin(angle) * 470;
            return `<path d="M${x} ${y}l${40 + (i % 4) * 20} -${65 + (i % 3) * 32} 52 120Z"/>`;
          }).join('')}
        </g>`;

    case 20:
      // Scene 20: 一路打入凌霄殿 (Collapsing Pillars in Lingxiao)
      return `<rect width="1920" height="1080" fill="#16182c"/>
        ${fiveColorTrails()}
        <!-- Massive Collapsing Coiled Dragon Pillars -->
        <g class="rushing-pillars">
          ${dragonColumn(120, -50, 1150, 85, -12)}
          ${dragonColumn(420, -50, 1150, 85, 10)}
          ${dragonColumn(1500, -50, 1150, 85, -9)}
          ${dragonColumn(1800, -50, 1150, 85, 14)}
        </g>
        <path d="M0 940q440-130 960 30t960-30v140H0Z" fill="#1c2b45" opacity=".82"/>
        <!-- Foreground Toppling Dragon Pillars (坍塌盘龙柱穿透镜头) -->
        <g class="scene-foreground-pillars" opacity=".85">
          <path d="M-60 1120 L280 400 L380 430 L40 1150 Z" fill="#2c2225" stroke="url(#scene-gold)" stroke-width="12"/>
          <path d="M1980 1120 L1640 400 L1540 430 L1880 1150 Z" fill="#2c2225" stroke="url(#scene-gold)" stroke-width="12"/>
        </g>`;

    case 21:
      // Scene 21: 凌霄宝殿 (The Lingxiao Grand Hall)
      return `<rect width="1920" height="1080" fill="#111827"/>
        <!-- Han-Tang Imperial Ceiling Coffering with Dragon Screen -->
        <path d="M0 0h1920v260H0Z" fill="#652837" stroke="${palettes.released.gold}" stroke-width="15"/>
        <g class="great-hall-columns">
          ${dragonColumn(180, 0, 1080, 95)}
          ${dragonColumn(460, 0, 1080, 95)}
          ${dragonColumn(1460, 0, 1080, 95)}
          ${dragonColumn(1740, 0, 1080, 95)}
        </g>
        <!-- Jade Emperor Imperial Throne Dais -->
        <path d="M0 1080 710 460h500l710 620" fill="#283245" stroke="#d5b47d" stroke-width="14"/>
        <path d="M780 480h360l145 600H635Z" fill="#1e2434" stroke="#cfa874" stroke-width="10"/>
        ${nantianmenGate(960, 400, .78, false)}
        <!-- Constellation Dome Star Particles -->
        <g class="hall-star-particles" fill="#dfbe7e">
          ${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 719) % 1920}" cy="${(i * 311) % 800}" r="${2.5 + (i % 4)}" opacity=".75"/>`).join('')}
        </g>`;

    case 22:
      // Scene 22: 大闹天宫 (Grand Havoc in Heaven - Ultimate Five-Color Release)
      return `<rect width="1920" height="1080" fill="#070910"/>
        ${fiveColorTrails()}
        <circle cx="960" cy="535" r="450" fill="url(#scene-halo)"/>
        <!-- Expanding Concentric Rainbow Wave Halos of Victory -->
        <g class="final-release" fill="none" stroke-linecap="round">
          ${['#fbd272', '#ee5e4d', '#4cc5b3', '#669ce8', '#bd6de1', '#f6f5e9'].map((color, i) => `<circle cx="960" cy="535" r="${145 + i * 118}" stroke="${color}" stroke-width="${20 + i * 4}" opacity="${0.85 - i * 0.07}"/>`).join('')}
        </g>`;

    default:
      return `${celestialOrb(1320, 320, 70)}
        ${auspiciousClouds()}
        ${blueGreenMountains(p)}`;
  }
}

/** Static SVG scenery for one film scene. Animation can target semantic classes within the result. */
export function sceneArtwork(scene: number): string {
  return frame(scene, artwork(scene));
}
