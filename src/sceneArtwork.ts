import { palaceSvg } from './palace';

type Palette = { sky: string; low: string; ridge: string; near: string; ink: string; gold: string; glow: string };

const palettes: Record<string, Palette> = {
  jade: { sky: '#142e38', low: '#779c8b', ridge: '#355b59', near: '#183c3c', ink: '#10272d', gold: '#dec491', glow: '#fff0bc' },
  dawn: { sky: '#283d50', low: '#c9ad80', ridge: '#55716d', near: '#284c4c', ink: '#162c35', gold: '#f0cf91', glow: '#ffeab5' },
  free: { sky: '#306b78', low: '#c8d6a1', ridge: '#48896e', near: '#236955', ink: '#123d3e', gold: '#ffc65e', glow: '#fff2ab' },
  court: { sky: '#526879', low: '#d7d4be', ridge: '#8799a1', near: '#5c7380', ink: '#293747', gold: '#cab27e', glow: '#f8e6aa' },
  faded: { sky: '#34414a', low: '#9a9991', ridge: '#5a6367', near: '#3a474f', ink: '#1e2830', gold: '#9e8b6b', glow: '#d9bd83' },
  feast: { sky: '#202a35', low: '#61636a', ridge: '#383e48', near: '#232c37', ink: '#121a23', gold: '#bd905e', glow: '#e8bc77' },
  siege: { sky: '#0c1520', low: '#374756', ridge: '#283844', near: '#1a2734', ink: '#0b111a', gold: '#a38a58', glow: '#e7bb62' },
  chained: { sky: '#0a1018', low: '#3c4851', ridge: '#252f3c', near: '#121b27', ink: '#090e17', gold: '#756e63', glow: '#948b76' },
  fire: { sky: '#100c13', low: '#38202a', ridge: '#341923', near: '#1d121c', ink: '#0b090f', gold: '#df8446', glow: '#ffcc74' },
  released: { sky: '#191b38', low: '#7e4b69', ridge: '#2c5671', near: '#263550', ink: '#11152a', gold: '#ffe083', glow: '#fff0aa' },
};

function theme(scene: number): Palette {
  if (scene <= 3) return scene === 2 ? palettes.dawn : palettes.jade;
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
      <linearGradient id="scene-sky" x2="0" y2="1"><stop stop-color="${p.sky}"/><stop offset="1" stop-color="${p.low}"/></linearGradient>
      <linearGradient id="scene-light" x2="0" y2="1"><stop stop-color="${p.glow}" stop-opacity=".7"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></linearGradient>
      <radialGradient id="scene-halo"><stop stop-color="${p.glow}" stop-opacity=".6"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></radialGradient>
      <linearGradient id="scene-gold" x2="0" y2="1"><stop stop-color="${p.glow}"/><stop offset=".42" stop-color="${p.gold}"/><stop offset="1" stop-color="#665137"/></linearGradient>
      <linearGradient id="scene-water" x2="0" y2="1"><stop stop-color="${p.low}"/><stop offset="1" stop-color="${p.ink}"/></linearGradient>
      <filter id="scene-blur"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <rect class="sky" width="1920" height="1080" fill="url(#scene-sky)"/>
    ${content}
  </svg>`;
}

function mountains(p: Palette, y = 680): string {
  return `<g class="far-mountains" fill="${p.ridge}"><path d="M0 ${y} 90 ${y - 55} 170 ${y - 32} 321 ${y - 190} 425 ${y - 77} 536 ${y - 130} 681 ${y - 28} 816 ${y - 156} 934 ${y - 52} 1077 ${y - 201} 1212 ${y - 46} 1370 ${y - 115} 1532 ${y - 23} 1677 ${y - 188} 1800 ${y - 77} 1920 ${y - 127}v480H0Z"/>
    <path d="M0 ${y + 135} 170 ${y + 40} 255 ${y + 76} 448 ${y - 62} 575 ${y + 72} 745 ${y - 20} 922 ${y + 112} 1140 ${y - 31} 1283 ${y + 82} 1464 ${y - 44} 1660 ${y + 60} 1785 ${y - 1} 1920 ${y + 105}v400H0Z" fill="${p.near}"/>
    <path d="M0 ${y + 205}q260-68 498 30t475-32q228-70 465 25t482-18v300H0Z" fill="${p.ink}"/></g>`;
}

function mist(y = 735, opacity = .5): string {
  return `<g class="ink-mist" opacity="${opacity}" fill="#e8ead9"><path d="M-80 ${y}q170-62 353 5t381-6q150-68 348 5t381-5q178-66 343 0t294-12v91H-80Z"/><path d="M-80 ${y + 100}q253-92 487-14t461-8q250-73 465 3t667-25v139H-80Z" opacity=".45"/></g>`;
}

function sun(x: number, y: number, r = 74): string {
  return `<g class="sun"><circle cx="${x}" cy="${y}" r="${r * 2.8}" fill="url(#scene-halo)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffe3a0" opacity=".8"/></g>`;
}

function clouds(): string {
  return `<g class="cloud-ribbons" fill="none" stroke="#dfebdf" opacity=".42" stroke-linecap="round"><path d="M-90 280q153-63 262-15t208 11q97-46 191-5" stroke-width="24"/><path d="M1200 234q109-48 222-10t217 4q114-46 278 6" stroke-width="37"/><path d="M-90 510q233-91 432-13t387-18" stroke-width="15"/><path d="M1335 555q164-40 311 18t360-20" stroke-width="21"/></g>`;
}

function stairs(top = 635, bottom = 1080): string {
  const lines = Array.from({ length: 10 }, (_, i) => {
    const t = (i + 1) / 11;
    const y = top + (bottom - top) * t * t;
    const half = 90 + 730 * t;
    return `<path d="M${960 - half} ${y}h${half * 2}" stroke="#d0c7a8" stroke-width="${2 + t * 8}" opacity="${.35 + t * .32}"/>`;
  }).join('');
  return `<g class="stone-stairs"><path d="M867 ${top}h186l802 ${bottom - top}H65Z" fill="#555f60" stroke="#d4cbaa" stroke-width="5"/><path d="M865 ${top} 65 ${bottom}M1055 ${top}l800 ${bottom - top}" stroke="#e3d7b5" stroke-width="9" opacity=".65"/>${lines}</g>`;
}

function gate(x = 960, y = 590, scale = 1, cold = false): string {
  const ivory = cold ? '#77818b' : '#c8c7af';
  return `<g class="mountain-gate" transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-410 0h820v38h-820Z" fill="#171e27" stroke="${ivory}" stroke-width="8"/>
    <path d="M-370-370h740v48h-740Z" fill="#17222b" stroke="${ivory}" stroke-width="7"/>
    <path d="M-420-390q100 18 140-74h560q60 86 140 74-88 53-201 39h-438q-105 15-201-39Z" fill="#17202b" stroke="${cold ? '#8993a2' : '#b39966'}" stroke-width="9"/>
    <path d="M-340-322h74V0h-74Zm606 0h74V0h-74Z" fill="${ivory}" stroke="#26313b" stroke-width="10"/>
    <path d="M-287-317h574" stroke="${ivory}" stroke-width="15"/>
    <path d="M-227-274h454v224h-454Z" fill="#121923" stroke="${ivory}" stroke-width="8"/>
    <path d="M0-274V-50" stroke="${ivory}" stroke-width="7"/>
    <path d="M-110-334h220v45h-220Z" fill="#29323b" stroke="${ivory}" stroke-width="5"/>
    <circle cx="-170" cy="-157" r="17" fill="url(#scene-gold)"/><circle cx="170" cy="-157" r="17" fill="url(#scene-gold)"/>
  </g>`;
}

function palace(y = 520): string {
  return `<g class="palace-front" transform="translate(0 ${y - 520})">
    <path d="M225 760h1470v107H225Z" fill="#3a414a" stroke="#a28d66" stroke-width="7"/>
    <path d="M341 379h1238v387H341Z" fill="#28313b" stroke="#b39c72" stroke-width="8"/>
    ${Array.from({ length: 11 }, (_, i) => `<path d="M${390 + i * 114} 396v349" stroke="#b19c74" stroke-width="26"/>`).join('')}
    <path d="M232 386q154-11 203-129h1050q50 118 203 129-115 58-255 8H485q-139 49-253-8Z" fill="#14212d" stroke="#c5a463" stroke-width="12"/>
    <path d="M474 256q122-20 170-117h630q50 98 171 117-74 56-188 22H666q-113 36-192-22Z" fill="#172430" stroke="#c8a46b" stroke-width="10"/>
    <path d="M765 140q80-17 114-88h161q30 67 115 88-56 40-123 25H836q-66 13-71-25Z" fill="#18232e" stroke="#d0ad70" stroke-width="8"/>
    <path d="M783 556h354v209H783Z" fill="#101821" stroke="#c6a976" stroke-width="9"/>
  </g>`;
}

function tree(x: number, y: number, scale = 1): string {
  return `<g class="pine-tree" transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0q-12-129 3-310" fill="none" stroke="#172d31" stroke-width="21"/><path d="M-10-183q-112-59-143-134 110 41 154 89 62-59 134-72-55 76-138 116Z" fill="#153d3b" stroke="#609073" stroke-width="4"/><path d="M-6-260q-73-48-87-107 62 32 93 65 46-43 92-61-29 67-92 108Z" fill="#1a5045" stroke="#72a280" stroke-width="4"/></g>`;
}

function raft(): string {
  return `<g class="raft" transform="translate(610 802)"><path d="M-166 22q155 39 345-6l-47 40q-148 28-260-3Z" fill="#4d3929" stroke="#d1ad73" stroke-width="7"/><path d="M-137 14h274M-143 25h278M-117 42h226" stroke="#b8945d" stroke-width="10" stroke-linecap="round"/><path d="M43-176v187" stroke="#49392c" stroke-width="10"/><path d="M50-171q59 54 51 146-42-15-54-24Z" fill="#ded6b7" stroke="#7a796b" stroke-width="5"/></g>`;
}

function scrollSea(p: Palette): string {
  const ranges = [
    `<g class="scroll-flower-mountain" transform="translate(0 0)">${mountains(p, 648)}${tree(95, 864, .65)}${tree(1810, 872, .8)}</g>`,
    `<g class="scroll-ocean" transform="translate(1920 0)">${sun(1510, 440, 56)}<path d="M0 700h1920v380H0Z" fill="#3c6674"/></g>`,
    `<g class="scroll-storm" transform="translate(3840 0)"><path d="M0 400q500-310 1000-70t920-34v784H0Z" fill="#29384c"/><path d="M0 700h1920v380H0Z" fill="#254452"/></g>`,
    `<g class="scroll-night" transform="translate(5760 0)"><path d="M0 0h1920v1080H0Z" fill="#102138"/><circle cx="1550" cy="213" r="67" fill="#e8e1bd"/></g>`,
    `<g class="scroll-dawn" transform="translate(7680 0)">${sun(1070, 573, 100)}${mountains(p, 721)}</g>`,
  ];
  return `<g class="long-scroll-landscape">${ranges.join('')}</g>`;
}

function lotusTable(disorder = false): string {
  const peach = (x: number, y: number, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0-26q-17-14-24 3-16 35 24 48 40-13 24-48-7-17-24-3Z" fill="#b75f57" stroke="#e6ae80" stroke-width="4"/><path d="M0-20q5-17 24-21-4 17-24 21Z" fill="#64816c"/></g>`;
  return `<g class="banquet-table ${disorder ? 'banquet-disorder' : ''}">
    <path d="M110 678h1700l85 73H25Z" fill="#7b4d42" stroke="#c4a36b" stroke-width="9"/>
    <path d="M130 751h1660v100H130Z" fill="#342a31" stroke="#ab8357" stroke-width="6"/>
    ${Array.from({ length: 9 }, (_, i) => `<g transform="translate(${160 + i * 205} ${disorder ? 652 - (i % 3) * 40 : 663}) rotate(${disorder ? (i % 2 ? 21 : -26) : 0})"><path d="M-20-59h40l-7 37q-13 17-26 0Z" fill="url(#scene-gold)"/><path d="M0-20v27m-34 0h68" stroke="#d6af71" stroke-width="7"/></g>`).join('')}
    ${Array.from({ length: 9 }, (_, i) => peach(267 + i * 178, disorder ? 548 - i % 3 * 42 : 638, disorder ? i * 25 : 0)).join('')}
  </g>`;
}

function immortalSilhouettes(): string {
  return `<g class="immortal-silhouettes" fill="#171e2a" stroke="#9b7b5d" stroke-width="4">${Array.from({ length: 9 }, (_, i) => {
    const x = 180 + i * 195;
    return `<g transform="translate(${x} 590)"><path d="M-38 38q-16-82 39-86 50 5 40 86l-25 55h-33Z"/><ellipse cx="0" cy="-70" rx="28" ry="38"/><path d="M-45 69h90"/></g>`;
  }).join('')}</g>`;
}

function horses(): string {
  return `<g class="celestial-horses" fill="#b4b2a7" stroke="#4d5359" stroke-width="5">${Array.from({ length: 10 }, (_, i) => {
    const x = 175 + i * 175;
    const y = 655 + (i % 3) * 35;
    return `<g transform="translate(${x} ${y}) scale(${.73 + i % 4 * .08})"><path d="M-57-66q36-39 106-13l18 26-34 39-64-3-26-24Z"/><path d="M38-74 59-147l31-32 19 42-27 39-3 45Z"/><path d="M-46-18-57 81m36-92-9 99M33-15l-2 100m30-99L73 77" fill="none" stroke="#b4b2a7" stroke-width="18"/><path d="M-54-70q-27-20-43-4" fill="none" stroke="#b4b2a7" stroke-width="12"/></g>`;
  }).join('')}</g>`;
}

function cloudArmy(): string {
  return `<g class="army-ranks" fill="#101925" stroke="#80909b" stroke-width="2">${Array.from({ length: 9 }, (_, row) => Array.from({ length: 29 }, (_, col) => {
    const x = 20 + col * 68 + (row % 2) * 32;
    const y = 185 + row * 48;
    const scale = .43 + row * .025;
    return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-19 28q-13-55 19-67 32 12 19 67Z"/><circle cy="-53" r="19"/><path d="M-32-10h64M28-13 59-87" fill="none" stroke="#9ca7ad" stroke-width="5"/></g>`;
  }).join('')).join('')}</g>`;
}

function furnace(cracked = false): string {
  return `<g class="eight-trigrams-furnace" transform="translate(960 606)">
    <ellipse cy="374" rx="520" ry="85" fill="#07080d"/>
    <path d="M-358-314q358-96 716 0l64 160-80 454q-340 115-684 0l-80-454Z" fill="#1c1c26" stroke="url(#scene-gold)" stroke-width="25"/>
    <path d="M-394-160q394 142 788 0M-340 287q340 124 680 0" fill="none" stroke="#a36a41" stroke-width="13"/>
    <ellipse cy="-320" rx="378" ry="78" fill="#1b1a21" stroke="#d49d5d" stroke-width="18"/>
    <path d="M-341-350q50-155 191-172h300q141 17 191 172" fill="#1b1a22" stroke="#bd8954" stroke-width="19"/>
    <path d="M-410-167h-79v-104h75M410-167h79v-104h-75" fill="none" stroke="#ab7948" stroke-width="27"/>
    <path d="M-222-4h444v237h-444Z" fill="#080910" stroke="#8b5c42" stroke-width="12"/>
    ${Array.from({ length: 8 }, (_, i) => `<g transform="rotate(${i * 45}) translate(0 -254)"><path d="M-29-20h58M-29-7h58M-29 6h58" stroke="#b98552" stroke-width="7"/></g>`).join('')}
    ${cracked ? `<g class="furnace-cracks" fill="none" stroke="#f5c876" stroke-width="9" filter="url(#scene-blur)"><path d="M-177-386-141-290-213-168-125-78-180 61-109 212M134-405 71-277 148-184 77-29 176 59 85 236M-389-95l201 33 100 154M384-109 176-61 90 84"/></g><g fill="none" stroke="#fff0a5" stroke-width="4"><path d="M-177-386-141-290-213-168-125-78-180 61-109 212M134-405 71-277 148-184 77-29 176 59 85 236M-389-95l201 33 100 154M384-109 176-61 90 84"/></g>` : ''}
  </g>`;
}

function coloredStrokes(): string {
  const colors = ['#f8d878', '#dc5546', '#4ec9b1', '#558fe6', '#bd72d5'];
  return `<g class="released-color-trails" fill="none" stroke-linecap="round">${colors.map((color, i) => `<path d="M${-160 + i * 30} ${670 + i * 45}Q${550 + i * 80} ${-115 + i * 130} ${1110 + i * 92} ${260 + i * 40}T2060 ${310 + i * 120}" stroke="${color}" stroke-width="${24 + i * 4}" opacity=".72"/>`).join('')}</g>`;
}

function artwork(scene: number): string {
  const p = theme(scene);
  switch (scene) {
    case 2:
      return `${scrollSea(p)}<g class="sea-foreground"><path d="M0 743q177-48 381 0t386 4q198-51 392 0t383-7q164-36 378 9v331H0Z" fill="url(#scene-water)"/><path d="M0 783q140-32 281 5t315-7q132-39 287 4t321-4q159-45 299-5t417 7" fill="none" stroke="#dae5d6" stroke-width="9" opacity=".69"/></g>${raft()}<g class="voyage-gate">${gate(1590, 639, .35)}${stairs(805)}</g>${mist(879, .42)}`;
    case 3:
      return `${sun(960, 258, 72)}${mountains(p, 568)}${mist(570, .42)}${gate(960, 533, .86)}${stairs(628)}${mist(909, .34)}${tree(180, 1020, 1.4)}${tree(1780, 1012, 1.3)}`;
    case 4:
      return `${sun(1432, 206, 100)}${clouds()}${mountains(p, 609)}<path class="waterfall" d="M1178 592q-81 207-24 488h91q-43-313 32-488Z" fill="#d2f0db" opacity=".72"/>${tree(198, 1020, 1.24)}${tree(1820, 1080, 1.4)}<path d="M0 920q260-110 471 0t431-12q250-92 460 23t558-24v173H0Z" fill="#153e3f"/>`;
    case 5:
      return `${clouds()}<ellipse cx="960" cy="437" rx="525" ry="322" fill="url(#scene-halo)"/>${mountains(p, 856)}${gate(960, 562, 1.52)}${stairs(682)}<g class="heavenly-decree" transform="translate(960 260)"><path d="M-296-25h592v196h-592Z" fill="#c4a874" stroke="#f2dfaf" stroke-width="12"/><path d="M-320-34h35v214h-35Zm605 0h35v214h-35Z" fill="#877049" stroke="#f1d69e" stroke-width="8"/><path d="M-194 30h388M-184 72h368M-168 114h336" stroke="#876a47" stroke-width="8" opacity=".5"/></g>${mist(815, .32)}`;
    case 6:
      return `${palace(130)}<rect class="stable-shadow" x="0" y="470" width="1920" height="610" fill="#1b232b" opacity=".83"/><g class="stable-beams" stroke="#7b7060" stroke-width="28"><path d="M0 455h1920M195 450v590M535 450v590M880 450v590M1225 450v590M1560 450v590M1900 450v590"/></g>${horses()}<path d="M0 862h1920v218H0Z" fill="#1d252a"/><g class="high-court-officials" fill="#0c121a">${[423, 558, 1344, 1480].map(x => `<path d="M${x - 25} 336q-28-82 25-108 54 26 25 108l36 132h-122Z"/>`).join('')}</g>`;
    case 7:
      return `<rect class="corridor-floor" y="690" width="1920" height="390" fill="#29343e"/><path d="M-100 1080 745 358h430l845 722" fill="#1c2630" stroke="#8e7a62" stroke-width="9"/><path d="M0 95h1920v155H0Z" fill="#222d37" stroke="#a38a65" stroke-width="13"/>${Array.from({ length: 5 }, (_, i) => `<path d="M${85 + i * 235} 236v643" stroke="#46535a" stroke-width="${49 - i * 5}"/><path d="M${1835 - i * 235} 236v643" stroke="#46535a" stroke-width="${49 - i * 5}"/>`).join('')}<g class="banquet-door"><path d="M748 317h424v443H748Z" fill="#a97751" stroke="#d0a76e" stroke-width="12"/><path d="M780 350h360v380H780Z" fill="#d2a36d"/><g class="banquet-through-door"><path d="M790 639h340v49H790Z" fill="#834d45" stroke="#efd09d" stroke-width="6"/><path d="M805 688h310v43H805Z" fill="#50343a"/>${[832, 895, 960, 1025, 1088].map(x => `<path d="M${x - 14} 626q14-32 28 0l-9 19h-10Z" fill="#b7524b" stroke="#e8b87b" stroke-width="3"/>`).join('')}<path d="M815 376h290M842 418h238" stroke="#f7d792" stroke-width="9" opacity=".7"/><circle cx="858" cy="481" r="24" fill="#ffe1a0" opacity=".55"/><circle cx="1062" cy="481" r="24" fill="#ffe1a0" opacity=".55"/></g><path class="door-left" d="M750 319 960 329V751L750 759Z" fill="#30313a" stroke="#b78b61" stroke-width="8"/><path class="door-right" d="M1170 319 960 329V751l210 8Z" fill="#30313a" stroke="#b78b61" stroke-width="8"/></g><path d="M0 850h1920" stroke="#8c887b" stroke-width="9"/>`;
    case 8:
      return `<rect width="1920" height="1080" fill="#18212c"/><ellipse cx="992" cy="476" rx="723" ry="484" fill="url(#scene-halo)" opacity=".34"/><g class="feast-inserts">${lotusTable()}<g class="elixir-flask" transform="translate(1430 433)"><path d="M-35-110h70v113q73 38 60 130-45 89-190 0-13-92 60-130Z" fill="#343139" stroke="#d2ae73" stroke-width="10"/><circle cy="102" r="44" fill="#e0aa61"/><path d="M-43-113h86" stroke="#edcf8f" stroke-width="16"/></g></g><path d="M0 0h1920v1080H0Z" fill="#121b29" opacity=".26"/>`;
    case 9:
      return `<rect y="80" width="1920" height="725" fill="#253040"/><g class="feast-pillars" stroke="#7c4141" stroke-width="78"><path d="M150 100v780M1770 100v780"/></g>${immortalSilhouettes()}${lotusTable(true)}<g class="flying-crockery" fill="url(#scene-gold)"><ellipse cx="318" cy="330" rx="55" ry="21" transform="rotate(-28 318 330)"/><ellipse cx="1641" cy="304" rx="54" ry="21" transform="rotate(24 1641 304)"/><path d="M965 300q31-72 80 0l-25 44h-38Z"/></g><path class="wine-splash" d="M280 250q458-309 738 161t679-73" fill="none" stroke="#dcbd83" stroke-width="22" opacity=".7"/>`;
    case 10:
      return `${sun(970, 667, 108)}${clouds()}${mountains(p, 661)}${tree(155, 1008, 1.31)}${tree(1809, 1005, 1.47)}<path d="M0 934q306-164 610 30t630-43q254-126 680 48v111H0Z" fill="#1d614b"/><g class="returning-monkeys" fill="#322927">${[310, 429, 522, 1388, 1497, 1603].map((x, i) => `<g transform="translate(${x} ${865 + i % 3 * 31}) scale(${.6 + i % 2 * .2})"><circle cy="-46" r="20"/><path d="M-21-26q-32 49-22 86h86q11-40-22-86Z"/><path d="M-33 28q-42-12-40-49" fill="none" stroke="#322927" stroke-width="12"/></g>`).join('')}</g>`;
    case 11:
      return `${mountains(p, 752)}<path class="siege-cloud" d="M0 0h1920v625q-176-45-327-6t-345-15q-203-64-359-3t-410-26Q241 506 0 593Z" fill="#090f19"/>${cloudArmy()}<path d="M0 911q274-116 544 0t496 8q269-113 480-21t400 21v161H0Z" fill="#0f1b25"/>${tree(158, 1040, 1.2)}${tree(1780, 1020, 1.25)}`;
    case 12:
      return `${mountains(p, 761)}<path d="M0 0h1920v568H0Z" fill="#0a111b" opacity=".78"/>${cloudArmy()}<g class="descending-spears" stroke="#b1c2cf" stroke-width="4" opacity=".72">${Array.from({ length: 39 }, (_, i) => `<path d="M${i * 53} ${165 + i % 4 * 67}l-82 401"/>`).join('')}</g><path class="impact-ground" d="M0 866q470-111 960 35t960-35v214H0Z" fill="#172633"/>`;
    case 13:
      return `<g class="battle-scroll">${mountains(p, 913)}${cloudArmy()}${clouds()}<path d="M0 740q324-174 607-13t602-80q353-128 711 50v383H0Z" fill="#152432" opacity=".78"/></g>${gate(1635, 580, .47, true)}<path class="staff-trail" d="M-90 987Q389 591 873 401t1160-61q440-173 827-77" fill="none" stroke="#e8ad61" stroke-width="17" opacity=".6"/>`;
    case 14:
      return `${palace(482)}<path d="M0 0h1920v1080H0Z" fill="#09111b" opacity=".57"/><g class="chains" fill="none" stroke="#84909a" stroke-width="24"><path d="M-50 326Q336 839 948 742T1970 294"/><path d="M-50 681Q406 481 950 736t1020-114"/></g><path class="fallen-staff" d="M1231 913 1720 1025" stroke="#7c715a" stroke-width="24"/>`;
    case 15:
      return `${palace(420)}<path d="M0 0h1920v1080H0Z" fill="#08111b" opacity=".72"/><g class="punishment-tools"><path class="thunder" d="M1060 0 891 376h168L884 814" fill="none" stroke="#d2e1e7" stroke-width="22"/><path class="blade" d="M1395-100 1098 731l-73-43 288-829Z" fill="#8294a0" stroke="#d4dde0" stroke-width="10"/><path class="fireline" d="M0 969q135-179 265 0t273 0q130-211 280 0t258 0q160-198 293 0t291 0q124-198 260 0v111H0Z" fill="#61433d" opacity=".5"/></g>`;
    case 16:
      return `<rect width="1920" height="1080" fill="#08090e"/>${furnace()}<path class="closing-door" d="M741 602h438v253H741Z" fill="#0a0a10" stroke="#a06e48" stroke-width="15"/><circle cx="960" cy="654" r="114" fill="url(#scene-halo)" opacity=".22"/>`;
    case 17:
      return `<rect width="1920" height="1080" fill="#09080d"/><ellipse cx="960" cy="708" rx="600" ry="304" fill="url(#scene-halo)" opacity=".5"/><g class="furnace-flames">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${436 + i * 175} 1080q-85-222 11-446t39-408q173 206 118 453t-23 401Z" fill="${['#852a2b', '#c84b32', '#e5883e', '#f0be5c', '#63b1a9', '#557bba', '#8c61aa'][i]}" opacity=".64"/>`).join('')}</g><ellipse cx="960" cy="850" rx="386" ry="74" fill="#141017"/>`;
    case 18:
      return `<rect width="1920" height="1080" fill="#0a0b12"/>${furnace(true)}<g class="eye-rays" fill="none" stroke="#ffe395" stroke-width="22" filter="url(#scene-blur)"><path d="M901 542 0 162M1025 542l895-383"/></g><g fill="none" stroke="#fff2ae" stroke-width="5"><path d="M901 542 0 162M1025 542l895-383"/></g>`;
    case 19:
      return `<rect width="1920" height="1080" fill="#11142a"/>${coloredStrokes()}${furnace(true)}<g class="furnace-shards" fill="#a97054" stroke="#efb875" stroke-width="5">${Array.from({ length: 14 }, (_, i) => {
        const angle = i * 25.7 * Math.PI / 180;
        const x = 960 + Math.cos(angle) * 580;
        const y = 590 + Math.sin(angle) * 460;
        return `<path d="M${x} ${y}l${38 + i % 4 * 19} -${62 + i % 3 * 30} 49 116Z"/>`;
      }).join('')}</g>`;
    case 20:
      return `${palace(395)}${coloredStrokes()}<g class="rushing-pillars" stroke="#842f37" stroke-width="91"><path d="M68 0v1080M347 0v1080M1573 0v1080M1852 0v1080"/></g><path d="M0 938q439-127 960 30t960-29v141H0Z" fill="#1e2e4a" opacity=".8"/>`;
    case 21:
      return `<rect width="1920" height="1080" fill="#121928"/><path d="M0 0h1920v255H0Z" fill="#602c3b" stroke="#d3a06f" stroke-width="14"/><g class="great-hall-columns" stroke="#8d4350" stroke-width="110"><path d="M168 0v1080M444 0v1080M1476 0v1080M1752 0v1080"/></g><path d="M0 1080 711 465h498l711 615" fill="#2a3347" stroke="#d3b079" stroke-width="12"/><path d="M782 482h356l144 598H638Z" fill="#222638" stroke="#c9a372" stroke-width="9"/>${gate(960, 405, .75)}<g class="hall-star-particles" fill="#d9b778">${Array.from({ length: 25 }, (_, i) => `<circle cx="${(i * 719) % 1920}" cy="${(i * 311) % 800}" r="${2 + i % 4}" opacity=".7"/>`).join('')}</g>`;
    case 22:
      return `<rect width="1920" height="1080" fill="#080a11"/>${coloredStrokes()}<circle cx="960" cy="535" r="440" fill="url(#scene-halo)"/><g class="final-release" fill="none" stroke-linecap="round">${['#fbd272', '#ee5e4d', '#4cc5b3', '#669ce8', '#bd6de1', '#f6f5e9'].map((color, i) => `<circle cx="960" cy="535" r="${145 + i * 115}" stroke="${color}" stroke-width="${19 + i * 4}" opacity="${.82 - i * .07}"/>`).join('')}</g>`;
    default:
      return `${sun(1320, 320, 70)}${clouds()}${mountains(p)}`;
  }
}

/** Static SVG scenery for one film scene. Animation can target semantic classes within the result. */
export function sceneArtwork(scene: number): string {
  if (scene === 1) return palaceSvg();
  return frame(scene, artwork(scene));
}
