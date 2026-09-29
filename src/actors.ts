import type { FilmState } from './timeline';

/**
 * 1961 Shanghai Animation Film Studio authentic celestial soldier.
 * Armed with silver-white Mingguang armor, phoenix-crest helmet, and 12-foot red-tasseled spear.
 */
function soldierSvg(index: number): string {
  const isAlt = index % 2 === 1;
  const spearAngle = isAlt ? -24 : -16;
  return `<g class="soldier" data-index="${index}">
    <!-- Celestial Soldier Shadow -->
    <ellipse cx="0" cy="0" rx="38" ry="12" fill="#000000" opacity=".4"/>

    <!-- Armored Legs in Combat Stance -->
    <!-- Left Leg (Forward) -->
    <path d="M-26 -85 C-32 -55 -28 -25 -24 0 L-6 0 C-10 -30 -14 -60 -12 -85 Z" fill="#1e272e" stroke="#0a0f14" stroke-width="2.5"/>
    <path d="M-28 0 L-4 0" stroke="#f1c40f" stroke-width="3" stroke-linecap="round"/>
    <!-- Right Leg (Braced Back) -->
    <path d="M12 -85 C14 -55 20 -25 28 0 L44 0 C34 -30 26 -60 22 -85 Z" fill="#1e272e" stroke="#0a0f14" stroke-width="2.5"/>
    <path d="M26 0 L46 0" stroke="#f1c40f" stroke-width="3" stroke-linecap="round"/>

    <!-- Tassets & Silk Skirt (战裙与腰甲) -->
    <path d="M-34 -95 Q0 -85 34 -95 L30 -45 Q0 -35 -30 -45 Z" fill="#2d3436" stroke="#4b6584" stroke-width="2.5"/>
    <path d="M-26 -92 Q0 -82 26 -92 L22 -52 Q0 -44 -22 -52 Z" fill="#0984e3" stroke="#74b9ff" stroke-width="2"/>

    <!-- Heavy Mingguang Torso Armor (银白玄铁明光铠) -->
    <path d="M-35 -145 C-42 -110 -32 -90 -28 -88 Q0 -80 28 -88 C32 -90 42 -110 35 -145 Q0 -155 -35 -145 Z" fill="url(#silverArmor)" stroke="#2c3e50" stroke-width="3.5"/>
    <!-- Dual Twin Heart Mirrors (前后双明光镜) -->
    <ellipse cx="-12" cy="-115" rx="10" ry="14" fill="#ffffff" stroke="#f1c40f" stroke-width="2.5"/>
    <ellipse cx="-13" cy="-117" rx="7" ry="10" fill="#74b9ff" opacity=".85"/>
    <circle cx="-15" cy="-120" r="2.5" fill="#ffffff"/>

    <ellipse cx="12" cy="-115" rx="10" ry="14" fill="#ffffff" stroke="#f1c40f" stroke-width="2.5"/>
    <ellipse cx="11" cy="-117" rx="7" ry="10" fill="#74b9ff" opacity=".85"/>
    <circle cx="9" cy="-120" r="2.5" fill="#ffffff"/>

    <!-- Golden Beast Belt (金兽蛮带) -->
    <path d="M-30 -90 Q0 -82 30 -90" stroke="#f1c40f" stroke-width="6" fill="none"/>
    <circle cx="0" cy="-86" r="8" fill="#d35400" stroke="#f39c12" stroke-width="2"/>

    <!-- Heavy Dragon Pauldrons (龙首护肩) -->
    <path d="M-32 -145 C-58 -138 -54 -105 -32 -100 C-22 -115 -20 -130 -32 -145 Z" fill="url(#silverArmor)" stroke="#2c3e50" stroke-width="3"/>
    <path d="M32 -145 C58 -138 54 -105 32 -100 C22 -115 20 -130 32 -145 Z" fill="url(#silverArmor)" stroke="#2c3e50" stroke-width="3"/>

    <!-- Sharp Armored Helmet & Visor (凤翅盔与护颊) -->
    <path d="M-18 -170 C-24 -145 -15 -135 0 -132 C15 -135 24 -145 18 -170 Z" fill="#fed330" stroke="#b7791f" stroke-width="2"/>
    <!-- Glowing Visor Slit -->
    <path d="M-12 -152 L12 -152" stroke="#e74c3c" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M-24 -165 C-32 -212 0 -225 0 -225 C0 -225 32 -212 24 -165 Z" fill="url(#silverArmor)" stroke="#2c3e50" stroke-width="3.5"/>
    <path d="M-26 -165 Q0 -178 26 -165 L22 -176 Q0 -188 -22 -176 Z" fill="#f1c40f" stroke="#b7791f" stroke-width="2"/>
    <!-- Phoenix Crest Wings on Helmet -->
    <path d="M-24 -185 C-52 -205 -44 -230 -22 -200 Z" fill="#dfe6e9" stroke="#2c3e50" stroke-width="2.5"/>
    <path d="M24 -185 C52 -205 44 -230 22 -200 Z" fill="#dfe6e9" stroke="#2c3e50" stroke-width="2.5"/>
    <!-- Crimson Plume -->
    <path d="M0 -225 Q-6 -255 4 -250 Q10 -235 0 -225 Z" fill="#e74c3c"/>

    <!-- Gripping Gauntlets on Spear -->
    <circle cx="28" cy="-115" r="8" fill="#f1c40f" stroke="#b7791f" stroke-width="2"/>
    <circle cx="34" cy="-85" r="8" fill="#f1c40f" stroke="#b7791f" stroke-width="2"/>

    <!-- 12-Foot Red-Tasseled Spear (丈二红缨枪) -->
    <g transform="rotate(${spearAngle} 30 -105)">
      <line x1="30" y1="-320" x2="30" y2="45" stroke="#2c3e50" stroke-width="6.5" stroke-linecap="round"/>
      <line x1="31" y1="-318" x2="31" y2="42" stroke="#74b9ff" stroke-width="2" opacity=".6"/>
      <!-- Scarlet Tassel -->
      <path d="M22 -270 C6 -245 16 -215 30 -230 C44 -215 54 -245 38 -270 Z" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>
      <path d="M30 -270 C38 -250 35 -225 30 -230" stroke="#ff7675" stroke-width="3"/>
      <!-- Gleaming Diamond Spearhead -->
      <path d="M30 -335 L20 -285 L30 -270 L40 -285 Z" fill="#ffffff" stroke="#74b9ff" stroke-width="2.5"/>
      <line x1="30" y1="-330" x2="30" y2="-272" stroke="#0984e3" stroke-width="2.5"/>
    </g>
  </g>`;
}

/**
 * Shanghai Animation Film Studio 1961 Sun Wukong head with Peking Opera heart-shaped face paint.
 */
function wukongHeadSvg(): string {
  return `<!-- Anime Wukong Spiky Golden Mane (风掣金鬃飞扬发簇) -->
    <g id="wukong-hair">
      <!-- Back hair spikes -->
      <path d="M-65 -285 C-95 -295 -90 -255 -72 -235 C-90 -230 -85 -200 -62 -190 C-35 -165 0 -170 0 -170 C0 -170 35 -165 62 -190 C85 -200 90 -230 72 -235 C90 -255 95 -295 65 -285 C80 -325 50 -355 25 -340 C10 -355 -10 -355 -25 -340 C-50 -355 -80 -325 -65 -285 Z" fill="#b7791f" stroke="#683b0d" stroke-width="3"/>
      <!-- Front layered spikes with anime shading -->
      <path d="M-55 -295 C-80 -275 -70 -245 -48 -230 C-38 -215 -18 -205 0 -205 C18 -205 38 -215 48 -230 C70 -245 80 -275 55 -295 C68 -330 35 -345 0 -335 C-35 -345 -68 -330 -55 -295 Z" fill="#d68910" stroke="#935817" stroke-width="3"/>
      <!-- Highlights on spiky hair locks -->
      <path d="M-40 -310 Q-60 -285 -45 -255 M40 -310 Q60 -285 45 -255 M0 -330 Q-15 -300 -5 -270 M0 -330 Q15 -300 5 -270" stroke="#f1c40f" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    </g>

    <!-- Ears (猴王尖耳与茸毛) -->
    <path d="M-46 -265 C-65 -270 -68 -240 -48 -235 Z" fill="#d68910" stroke="#784212" stroke-width="2.5"/>
    <path d="M-48 -260 C-56 -262 -58 -246 -48 -243" stroke="#fab1a0" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M46 -265 C65 -270 68 -240 48 -235 Z" fill="#d68910" stroke="#784212" stroke-width="2.5"/>
    <path d="M48 -260 C56 -262 58 -246 48 -243" stroke="#fab1a0" stroke-width="3" fill="none" stroke-linecap="round"/>

    <!-- Sharp Anime Facial Mask & Heart-shaped Face Paint (美猴王美目心形脸谱) -->
    <!-- Carmine Face Mask Contour -->
    <path d="M0 -285 C-22 -308 -52 -300 -50 -262 C-48 -232 -22 -212 0 -195 C22 -212 48 -232 50 -262 C52 -300 22 -308 0 -285 Z" fill="#c0292b" stroke="#781113" stroke-width="3.5"/>

    <!-- Inner Warm Porcelain/Jade-White Face Base (内层羊脂玉面底) -->
    <path d="M0 -280 C-18 -298 -42 -292 -40 -262 C-38 -236 -18 -218 0 -202 C18 -218 38 -236 40 -262 C42 -292 18 -298 0 -280 Z" fill="#fffdf5" stroke="#ffdca3" stroke-width="1.5"/>

    <!-- Theatrical Eyeliner & Mask Flourishes (京剧凤眼勾线) -->
    <path d="M-38 -262 C-26 -278 -12 -282 0 -282 C12 -282 26 -278 38 -262" fill="none" stroke="#c0292b" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M-44 -266 Q-32 -282 -18 -285 M44 -266 Q32 -282 18 -285" fill="none" stroke="#921214" stroke-width="3" stroke-linecap="round"/>

    <!-- Sharp Determined Snout & Monkey Grin (英武猴嘴与神采) -->
    <path d="M-18 -218 C-12 -206 0 -204 0 -204 C0 -204 12 -206 18 -218" fill="#e67e22" opacity=".25"/>
    <path d="M-16 -224 Q0 -214 16 -224" stroke="#781113" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M-6 -219 Q0 -215 6 -219" stroke="#c0292b" stroke-width="2.5" fill="none"/>
    <path d="M-5 -236 Q0 -240 5 -236 Q0 -232 -5 -236 Z" fill="#781113"/>

    <!-- Piercing Anime Eyebrows (倒八字轩昂剑眉) -->
    <path d="M-3 -272 Q-16 -282 -42 -295 Q-20 -286 -3 -272 Z" fill="#14171a"/>
    <path d="M3 -272 Q16 -282 42 -295 Q20 -286 3 -272 Z" fill="#14171a"/>

    <!-- Piercing Fiery Golden Eyes (金睛火眼) -->
    <g id="eyes">
      <!-- Left Eye -->
      <path d="M-34 -258 C-32 -270 -14 -272 -8 -260 C-14 -250 -32 -250 -34 -258 Z" fill="#ffd700" stroke="#14171a" stroke-width="2.5"/>
      <circle cx="-20" cy="-260" r="4.2" fill="#111827"/>
      <circle cx="-20" cy="-260" r="2.2" fill="#d35400"/>
      <circle cx="-22" cy="-262" r="1.8" fill="#ffffff"/>
      <!-- Right Eye -->
      <path d="M8 -260 C14 -272 32 -270 34 -258 C32 -250 14 -250 8 -260 Z" fill="#ffd700" stroke="#14171a" stroke-width="2.5"/>
      <circle cx="20" cy="-260" r="4.2" fill="#111827"/>
      <circle cx="20" cy="-260" r="2.2" fill="#d35400"/>
      <circle cx="18" cy="-262" r="1.8" fill="#ffffff"/>
    </g>

    <!-- Fiery Eye Rays (金睛极光束) -->
    <g id="eye-rays" style="display:none;opacity:0;">
      <polygon points="-20,-260 -780,-380 -780,-140" fill="url(#eyeRayGradient)" opacity=".9"/>
      <polygon points="20,-260 780,-380 780,-140" fill="url(#eyeRayGradient)" transform="scale(-1 1)" opacity=".9"/>
      <line x1="-20" y1="-260" x2="-750" y2="-260" stroke="#ffffff" stroke-width="6" filter="url(#eyeGlow)"/>
      <line x1="20" y1="-260" x2="750" y2="-260" stroke="#ffffff" stroke-width="6" filter="url(#eyeGlow)"/>
    </g>`;
}

export function actorsSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" aria-hidden="true">
    <defs>
      <!-- Grand Battlefield Cape Gradient -->
      <linearGradient id="cape" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e74c3c"/>
        <stop offset="35%" stop-color="#c0392b"/>
        <stop offset="70%" stop-color="#781113"/>
        <stop offset="100%" stop-color="#3d0a0b"/>
      </linearGradient>

      <!-- Golden Armor Gradient (齐天大圣黄金山字甲) -->
      <linearGradient id="goldArmor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffeaa7"/>
        <stop offset="25%" stop-color="#f1c40f"/>
        <stop offset="70%" stop-color="#d4ac0d"/>
        <stop offset="100%" stop-color="#996515"/>
      </linearGradient>

      <!-- Ruyi Jingu Bang Dragon Cuffs Gradient -->
      <linearGradient id="staffGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff6cc"/>
        <stop offset="25%" stop-color="#f5cd79"/>
        <stop offset="50%" stop-color="#e1b12c"/>
        <stop offset="85%" stop-color="#c69500"/>
        <stop offset="100%" stop-color="#805b00"/>
      </linearGradient>

      <!-- Ruyi Jingu Bang Meteoric Iron Shaft -->
      <linearGradient id="staffShaft" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#181a1d"/>
        <stop offset="45%" stop-color="#353b48"/>
        <stop offset="60%" stop-color="#2c3437"/>
        <stop offset="100%" stop-color="#111315"/>
      </linearGradient>

      <!-- Ruyi Jingu Bang Molten Golden Radiant Core -->
      <linearGradient id="staffGlowGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ff9f43"/>
        <stop offset="50%" stop-color="#fff275"/>
        <stop offset="100%" stop-color="#ff9f43"/>
      </linearGradient>

      <!-- Celestial Silver Armor Gradient -->
      <linearGradient id="silverArmor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="30%" stop-color="#dfe6e9"/>
        <stop offset="70%" stop-color="#b2bec3"/>
        <stop offset="100%" stop-color="#636e72"/>
      </linearGradient>

      <!-- Fiery Eye Ray Laser Gradient -->
      <linearGradient id="eyeRayGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="20%" stop-color="#ffd54f" stop-opacity=".95"/>
        <stop offset="65%" stop-color="#ff9f43" stop-opacity=".7"/>
        <stop offset="100%" stop-color="#ee5253" stop-opacity="0"/>
      </linearGradient>

      <!-- Pheasant Feather Banding Pattern -->
      <linearGradient id="featherBands" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffd700"/>
        <stop offset="20%" stop-color="#c0392b"/>
        <stop offset="40%" stop-color="#1e272e"/>
        <stop offset="60%" stop-color="#ffd700"/>
        <stop offset="80%" stop-color="#c0392b"/>
        <stop offset="100%" stop-color="#1e272e"/>
      </linearGradient>

      <!-- Filters -->
      <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <filter id="strikeGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Celestial Army Ranks (30 Mythic Celestial Soldiers) -->
    <g id="soldier-ranks">${Array.from({ length: 30 }, (_, i) => soldierSvg(i)).join('')}</g>

    <!-- Sun Wukong Dynamic Actor Container -->
    <g id="hero">
      <!-- Grand Billowing Red Cape (齐天大圣大红战袍长披风) -->
      <g id="cape-shape">
        <path d="M-27-210 Q-105-255 -215-185 Q-170-130 -235-80 Q-130-95 -110-45 Q-75-105 -32-120 Z" fill="url(#cape)" stroke="#9b3930" stroke-width="5"/>
        <path d="M-36-198 Q-115-200 -190-155 M-40-180 Q-110-120 -192-100" fill="none" stroke="#f1c40f" stroke-width="3" opacity=".6"/>
        <path d="M-215-185 Q-225-130 -235-80" stroke="#ffd700" stroke-width="4" fill="none"/>
        <path d="M-30-205 C-90-220 -150-160 -195-100 C-160-80 -100-60 -40-110 Z" fill="#921214" opacity=".4"/>
        <path d="M-195-100 Q-230-60 -260-20 Q-200-30 -160-70 Z" fill="url(#cape)" stroke="#c0392b" stroke-width="3"/>
      </g>

      <!-- Dynamic Articulated Arms and Hands Gripping Staff -->
      <g id="hero-arms">
        <!-- Rear Arm (左手握棍) -->
        <path d="M-32-185 C-58-165 -65-135 -48-105 C-36-115 -30-140 -22-170 Z" fill="#935817" stroke="#683b0d" stroke-width="2.5"/>
        <path d="M-48-105 Q-60-85 -42-70" stroke="#f1c40f" stroke-width="9" fill="none" stroke-linecap="round"/>
        <circle cx="-42" cy="-68" r="9" fill="#f5cd79" stroke="#b7791f" stroke-width="2.5"/>
        <path d="M-48-72 Q-42-64 -36-72 M-46-66 Q-42-60 -38-66" stroke="#935817" stroke-width="2" fill="none"/>

        <!-- Lead Forearm (右手引棍) -->
        <path d="M28-185 C55-160 52-130 42-100 C30-110 24-135 18-170 Z" fill="#935817" stroke="#683b0d" stroke-width="2.5"/>
        <path d="M42-100 Q55-80 68-55" stroke="#f1c40f" stroke-width="9" fill="none" stroke-linecap="round"/>
        <circle cx="68" cy="-52" r="9.5" fill="#f5cd79" stroke="#b7791f" stroke-width="2.5"/>
        <path d="M62-56 Q68-48 74-56 M64-50 Q68-44 72-50" stroke="#935817" stroke-width="2" fill="none"/>
      </g>

      <!-- ================= 5 NARRATIVE COSTUMES ================= -->

      <!-- 1. 求学布衣 (costumePilgrim, Scenes 1-3) -->
      <g id="costume-pilgrim">
        <!-- Coarse Cloth Robe and Trousers (青灰粗布道袍) -->
        <path d="M-36-120 L-62-18 L-15 0 L-2 0 L-18-120 M14-120 L3 0 L18 0 L58-18 L34-120" fill="#4d5d67" stroke="#34495e" stroke-width="4"/>
        <path d="M-46-215 Q-65-175 -52-128 L24-128 Q50-175 42-215 Z" fill="#5a6b74" stroke="#3d4e56" stroke-width="4.5"/>
        <!-- Cross-collar (粗布斜襟) -->
        <path d="M-22-215 L16-160 L14-130 M-4-190 L-20-130" stroke="#e0d8c8" stroke-width="4" fill="none"/>
        <!-- Coarse Hemp Rope Belt (麻绳素带) -->
        <path d="M-48-132 Q0-128 46-132" stroke="#c2b280" stroke-width="6" fill="none"/>
        <path d="M-6-130 Q-10-95 -14-65 M4-130 Q8-100 6-68" stroke="#c2b280" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Straw/Cloth Pilgrim Shoes -->
        <path d="M-64-16 L-62 0 L-14 0 M2 0 L60 0 L58-16" stroke="#c2b280" stroke-width="4" fill="none"/>
      </g>

      <!-- 2. 美猴王常服 (costumeMonkeyKing, Scenes 4, 10) -->
      <g id="costume-monkey">
        <!-- Wide Martial Horse Stance Legs (扎实沉稳马步) -->
        <!-- Left Leg -->
        <path d="M-30 -115 C-65 -80 -85 -45 -80 0 L-40 0 C-42 -35 -35 -70 -15 -115 Z" fill="#d63031" stroke="#921214" stroke-width="3.5"/>
        <!-- Black Soap-Leather Boot with White Sole -->
        <path d="M-80 -25 L-82 0 L-38 0 L-40 -25 Z" fill="#1e272e" stroke="#0a0f14" stroke-width="3"/>
        <path d="M-84 0 L-36 0" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>

        <!-- Right Leg -->
        <path d="M15 -115 C35 -70 42 -35 40 0 L80 0 C85 -45 65 -80 30 -115 Z" fill="#d63031" stroke="#921214" stroke-width="3.5"/>
        <path d="M38 -25 L36 0 L82 0 L80 -25 Z" fill="#1e272e" stroke="#0a0f14" stroke-width="3"/>
        <path d="M34 0 L84 0" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>

        <!-- Tiger-Skin Wrap Apron with Natural Fur Edge (斑斓虎皮斜围裙) -->
        <path d="M-52 -162 C-30 -155 30 -155 52 -152 L48 -80 C20 -72 -20 -75 -46 -98 Z" fill="#e67e22" stroke="#c0392b" stroke-width="3.5"/>
        <!-- Dynamic Organic Tiger Stripes -->
        <path d="M-40 -150 Q-28 -140 -35 -125 M-22 -155 Q-12 -135 -18 -118 M15 -148 Q26 -132 18 -112 M35 -140 Q44 -124 38 -105" stroke="#1e272e" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <path d="M-52 -162 Q0 -152 52 -152" stroke="#d63031" stroke-width="7" fill="none"/>

        <!-- Iconic Goose-Yellow Mandarin Jacket (鹅黄对襟小衫) -->
        <path d="M-52 -215 C-75 -175 -60 -150 -44 -145 L44 -145 C60 -150 75 -175 52 -215 Q0 -225 -52 -215 Z" fill="#f5c518" stroke="#d4ac0d" stroke-width="4.5"/>
        <path d="M0 -215 L0 -145" stroke="#1e272e" stroke-width="3.5"/>
        <!-- Traditional Frog Buttons (盘扣) -->
        <line x1="-10" y1="-195" x2="10" y2="-195" stroke="#1e272e" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="-10" y1="-175" x2="10" y2="-175" stroke="#1e272e" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="0" cy="-195" r="3" fill="#c0392b"/>
        <circle cx="0" cy="-175" r="3" fill="#c0392b"/>

        <!-- Dynamic Fluttering Emerald Green Scarf (翠绿色飞扬领巾) -->
        <path d="M-15 -228 C-35 -245 -75 -240 -95 -260 C-78 -228 -45 -220 -12 -218 Z" fill="#2ecc71" stroke="#27ae60" stroke-width="3"/>
        <path d="M10 -226 C-4 -210 -35 -195 -68 -202 C-50 -185 -18 -190 12 -212 Z" fill="#27ae60" stroke="#1abc9c" stroke-width="2.5"/>
        <circle cx="0" cy="-224" r="6" fill="#2ecc71" stroke="#27ae60" stroke-width="2.5"/>
      </g>

      <!-- 3. 弼马温官袍 (costumeBima, Scenes 5-9) -->
      <g id="costume-bima">
        <!-- Light Scarlet 9th-rank Official Robe (从九品浅绯色官袍) -->
        <path d="M-40-116 L-66-15 L-16 0 L-2 0 M16 0 L66-15 L40-116" stroke="#8a1f1d" stroke-width="4" fill="#1e272e"/>
        <path d="M-52-215 Q-85-175 -66-135 L66-135 Q85-175 52-215 Z" fill="#d96459" stroke="#b74a41" stroke-width="4.5"/>
        <path d="M-36-135 L-48-28 L48-28 L36-135 Z" fill="#d96459" stroke="#b74a41" stroke-width="4"/>

        <!-- Rank Badge (胸前仙鹤云锦补子) -->
        <rect x="-18" y="-195" width="36" height="32" rx="3" fill="#3867d6" stroke="#f1c40f" stroke-width="2.5"/>
        <path d="M-10-180 Q0-190 10-180 Q0-170 -10-180 Z" fill="#ffffff"/>
        <circle cx="0" cy="-180" r="3" fill="#e74c3c"/>

        <!-- Jade Girdle (金边角带嵌青玉) -->
        <path d="M-42-148 Q0-142 42-148" stroke="#8c7853" stroke-width="6" fill="none"/>
        <rect x="-12" y="-152" width="8" height="8" rx="1" fill="#55efc4" stroke="#8c7853" stroke-width="1.5"/>
        <rect x="4" y="-152" width="8" height="8" rx="1" fill="#55efc4" stroke="#8c7853" stroke-width="1.5"/>
      </g>

      <!-- 4. 齐天大圣神甲 (costumeGreatSage, Scenes 11-13, 20-22) -->
      <g id="costume-greatsage">
        <!-- Deep Martial Stance Legs & Greaves (英武弓步与战靴) -->
        <!-- Rear Leg (Left) braced firmly with tension -->
        <path d="M-35 -110 C-70 -70 -95 -30 -90 0 L-45 0 C-48 -35 -40 -70 -20 -110 Z" fill="#c0392b" stroke="#781113" stroke-width="3"/>
        <path d="M-85 -35 C-92 -15 -90 0 -55 0 L-50 -25 Z" fill="#1e272e" stroke="#ffd700" stroke-width="3"/>
        <path d="M-92 0 L-45 0" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>

        <!-- Lead Leg (Right) deeply bent into front lunge -->
        <path d="M15 -110 C35 -70 55 -40 75 -20 L70 0 L25 0 C30 -25 20 -65 5 -110 Z" fill="#c0392b" stroke="#781113" stroke-width="3"/>
        <path d="M50 -35 L75 -20 L70 0 L25 0 Z" fill="#1e272e" stroke="#ffd700" stroke-width="3"/>
        <path d="M25 0 L72 0" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>

        <!-- Tassets / Thigh Guards (明光甲裙与红锦蔽膝) -->
        <path d="M-45 -125 C-65 -90 -60 -45 -35 -35 C-15 -40 -15 -85 -20 -125 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="3.5"/>
        <path d="M45 -125 C65 -90 60 -45 35 -35 C15 -40 15 -85 20 -125 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="3.5"/>
        <!-- Central Red Silk Front Apron (前遮红锦) -->
        <path d="M-22 -120 L22 -120 L16 -40 L-16 -40 Z" fill="#c0392b" stroke="#ffd700" stroke-width="2.5"/>

        <!-- Golden Mountain-Pattern Cuirass (锁子黄金甲 / 山字甲) -->
        <path d="M-55 -215 C-80 -170 -65 -125 -45 -120 Q0 -110 45 -120 C65 -125 80 -170 55 -215 Q0 -225 -55 -215 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="4.5"/>
        <!-- Armor scales pattern -->
        <path d="M-36 -195 Q0 -185 36 -195 M-40 -168 Q0 -156 40 -168 M-30 -140 Q0 -130 30 -140" stroke="#b7791f" stroke-width="3.5" fill="none"/>

        <!-- Beast-Head Swallowed Breastplate (威严吞头兽首) -->
        <path d="M-30 -180 C-40 -150 -25 -125 0 -122 C25 -125 40 -150 30 -180 Z" fill="#d35400" stroke="#b7791f" stroke-width="3"/>
        <circle cx="-12" cy="-158" r="4" fill="#ffd700" stroke="#1e272e" stroke-width="1.5"/>
        <circle cx="12" cy="-158" r="4" fill="#ffd700" stroke="#1e272e" stroke-width="1.5"/>
        <path d="M-8 -138 Q0 -146 8 -138" stroke="#ffd700" stroke-width="3" fill="none"/>

        <!-- Fierce Dragon Pauldrons & Armored Bracers (霸气龙首护肩与明光臂甲) -->
        <path d="M-50 -212 C-88 -195 -82 -145 -55 -135 C-42 -145 -38 -180 -50 -212 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="3.5"/>
        <path d="M50 -212 C88 -195 82 -145 55 -135 C42 -145 38 -180 50 -212 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="3.5"/>
        <!-- Golden Wristguards -->
        <path d="M-55 -135 L-42 -95 L-25 -100 L-38 -140 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="2.5"/>
        <path d="M55 -135 L42 -95 L25 -100 L38 -140 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="2.5"/>
      </g>

      <!-- 5. 八卦炉受炼与涅槃态 (costumeFurnaceGold, Scenes 14-19) -->
      <g id="costume-furnace">
        <!-- Charred Molten Cracked Armor (焦墨破甲轮廓) -->
        <path d="M-50-215 L-66-178 L-54-130 L-22-125 L0-136 L24-124 L56-130 L64-180 L48-215 Z" fill="#181d22" stroke="#ff4757" stroke-width="3"/>
        <!-- Glowing Incandescent Molten Cracks -->
        <path d="M-36-195 L-18-180 L-28-160 L-6-145 L0-155 L16-140 L28-165 L18-190 L34-205" stroke="#ffa502" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M-18-180 L0-175 L18-190" stroke="#ffffff" stroke-width="2" fill="none"/>

        <!-- Dynamic 5-Colored Gold Samadhi Flames (周身五彩金焰) -->
        <g id="furnace-flames-actor">
          <path d="M-60-220 Q-80-245 -65-265 Q-55-245 -48-235 Z" fill="#ffd700" opacity=".85"/>
          <path d="M60-220 Q80-245 65-265 Q55-245 48-235 Z" fill="#ffd700" opacity=".85"/>
          <path d="M-40-150 Q-68-160 -52-180 Q-40-165 -35-155 Z" fill="#ff4757" opacity=".75"/>
          <path d="M40-150 Q68-160 52-180 Q40-165 35-155 Z" fill="#ff4757" opacity=".75"/>
          <path d="M-20-110 Q-35-130 -15-140 Z" fill="#70a1ff" opacity=".65"/>
          <path d="M20-110 Q35-130 15-140 Z" fill="#70a1ff" opacity=".65"/>
        </g>
      </g>

      <!-- Authentic Shanghai Animation 1961 Wukong Head -->
      ${wukongHeadSvg()}

      <!-- ================= HEADWEARS & CROWNS ================= -->

      <!-- Headwear 1: Pilgrim Cloth Bun (求学布包发髻) -->
      <g id="head-pilgrim">
        <ellipse cx="0" cy="-324" rx="15" ry="12" fill="#47565e" stroke="#2c3a47" stroke-width="2.5"/>
        <path d="M-8-318 Q-16-324 -24-312 M8-318 Q16-324 24-312" stroke="#7f8c8d" stroke-width="2.5" fill="none"/>
      </g>

      <!-- Headwear 2: Monkey King Golden Fillet (美猴王金发箍) -->
      <g id="head-monkey">
        <path d="M-38-292 C-20-305 20-305 38-292" fill="none" stroke="#f1c40f" stroke-width="5" stroke-linecap="round"/>
        <path d="M-6-299 Q0-307 6-299" fill="none" stroke="#f39c12" stroke-width="4.5"/>
        <circle cx="0" cy="-300" r="3.5" fill="#e74c3c"/>
      </g>

      <!-- Headwear 3: Bima Winged Court Hat (展翅乌纱帽) -->
      <g id="head-bima">
        <path d="M-28-300 C-26-335 26-335 28-300 Z" fill="#1e272e" stroke="#0a0e12" stroke-width="3"/>
        <rect x="-18" y="-330" width="36" height="12" rx="4" fill="#2d3436"/>
        <!-- Extended Wing Gauze (展翅双翅) -->
        <path d="M-28-312 C-70-320 -115-312 -125-300 C-115-294 -70-298 -28-304 Z" fill="#1e272e" stroke="#3867d6" stroke-width="2"/>
        <path d="M28-312 C70-320 115-312 125-300 C115-294 70-298 28-304 Z" fill="#1e272e" stroke="#3867d6" stroke-width="2"/>
        <circle cx="0" cy="-318" r="4" fill="#f1c40f"/>
      </g>

      <!-- Headwear 4: Phoenix Crown with Swaying Pheasant Feathers (双翎凤翅紫金冠) -->
      <g id="head-crown">
        <!-- Purple-Gold Filigree Base (紫金冠托) -->
        <g id="phoenix-crown">
          <path d="M-36-296 C-18-312 18-312 36-296 L32-315 C16-324 -16-324 -32-315 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="2.5"/>
          <path d="M-24-315 L-30-338 L-14-325 L0-345 L14-325 L30-338 L24-315 Z" fill="#ffd700" stroke="#b7791f" stroke-width="2.5"/>
          <circle cx="-16" cy="-306" r="3.5" fill="#e74c3c"/>
          <circle cx="0" cy="-310" r="4.5" fill="#2ecc71"/>
          <circle cx="16" cy="-306" r="3.5" fill="#e74c3c"/>
        </g>

        <!-- Long Curved Pheasant Feathers (修长飘逸大雉鸡翎 - 随 featherAngle 摆动) -->
        <g id="feather-left">
          <path d="M-12 -330 C-60 -420 -150 -500 -260 -520 C-180 -480 -90 -410 -10 -325 Z" fill="url(#featherBands)" stroke="#996515" stroke-width="2.5"/>
          <path d="M-12 -330 C-60 -420 -150 -500 -260 -520" stroke="#ffffff" stroke-width="2" fill="none" opacity=".7"/>
        </g>
        <g id="feather-right">
          <path d="M12 -330 C60 -420 150 -500 260 -520 C180 -480 90 -410 10 -325 Z" fill="url(#featherBands)" stroke="#996515" stroke-width="2.5"/>
          <path d="M12 -330 C60 -420 150 -500 260 -520" stroke="#ffffff" stroke-width="2" fill="none" opacity=".7"/>
        </g>
      </g>

      <!-- Headwear 5: Charred Crown with Flaming Hair (八卦炉涅槃焦裂发冠) -->
      <g id="head-furnace">
        <path d="M-32-300 C-16-318 16-318 32-300 L26-318 C12-326 -12-326 -26-318 Z" fill="#1e272e" stroke="#ff4757" stroke-width="2.5"/>
        <path d="M-12-322 Q-5-348 2-330 Q10-355 18-325" fill="none" stroke="#ffa502" stroke-width="3"/>
      </g>

      <!-- ================= WEAPONS & PROPS ================= -->

      <!-- Ruyi Jingu Bang (如意金箍棒: 两端云龙回纹金箍，中段玄铁，挥击半月弧光) -->
      <g id="hero-staff">
        <!-- Strike Crescent Halo (半月弧形挥击光弧) -->
        <path id="staff-arc" d="M-80 -520 C-180 -320 -200 -30 -90 200 C-40 80 -60 -220 -40 -460 Z" fill="url(#staffGold)" opacity="0" filter="url(#strikeGlow)"/>

        <!-- Deep Meteoric Black Iron Shaft (深墨玄铁棒身) -->
        <rect id="staff-shaft" x="-14" y="-480" width="28" height="660" rx="6" fill="url(#staffShaft)" stroke="#0a0c0e" stroke-width="2.5"/>
        <!-- Inner Incandescent Molten Radiant Golden Core -->
        <rect id="staff-core" x="-8" y="-480" width="16" height="660" rx="4" fill="url(#staffGlowGradient)" opacity="0"/>

        <!-- Top Dragon Meander Gold Cuff (两端精美云龙回纹金箍) -->
        <rect x="-18" y="-525" width="36" height="52" rx="6" fill="url(#staffGold)" stroke="#805b00" stroke-width="3"/>
        <path d="M-14 -510 h28 M-14 -495 h28 M-8 -502 h16" stroke="#5c3800" stroke-width="3"/>

        <!-- Bottom Dragon Meander Gold Cuff -->
        <rect x="-18" y="145" width="36" height="52" rx="6" fill="url(#staffGold)" stroke="#805b00" stroke-width="3"/>
        <path d="M-14 160 h28 M-14 175 h28 M-8 168 h16" stroke="#5c3800" stroke-width="3"/>
      </g>

      <!-- Celestial Riding Whip (弼马温马鞭) -->
      <g id="hero-whip">
        <path d="M69-116 Q160-210 236-147 T184-8" fill="none" stroke="#dfe6e9" stroke-width="6" stroke-linecap="round"/>
        <path d="M62-129 L77-96" stroke="#8c7853" stroke-width="14" stroke-linecap="round"/>
        <circle cx="70" cy="-112" r="5" fill="#e74c3c"/>
      </g>
    </g>

    <!-- Kneeling Hero Bound in Heavenly Chains (Scene 14: 锁) -->
    <g id="kneeling-hero" transform="translate(960 887) scale(.8)" style="opacity:0;">
      <path d="M-29-123 Q-102 18 -163 115 Q-79 78 -26 103 Z" fill="url(#cape)" stroke="#8a3b38" stroke-width="5"/>
      <path d="M-36-98 Q-26 36 -18 71 L-86 22 L8 22 L56-18 L97 22 L187 22 L88-8 L87-71 Z" fill="#090d12" stroke="#a08358" stroke-width="7"/>
      <path d="M-36-141 Q-30 21 -18 68 L13 99 L68 99 L99 50 L82-4 Z" fill="#090d12" stroke="#947b58" stroke-width="6"/>
      <path d="M-42-172 Q-8-51 44-64 Q90-53 87-2 L64 37 L20 37 Z" fill="#080b10" stroke="#ad9162" stroke-width="6"/>
      <!-- Heart-shaped face paint -->
      <path d="M22-132 C12-148 -10-144 -10-120 C-8-100 8-90 22-82 C36-90 52-100 54-120 C54-144 32-148 22-132 Z" fill="#c0292b" stroke="#8a1515" stroke-width="2.5"/>
      <path d="M22-128 C14-140 -2-136 -2-120 C0-104 12-96 22-90 C32-96 44-104 46-120 C46-136 30-140 22-128 Z" fill="#fff9e6"/>
      <circle cx="12" cy="-120" r="2.5" fill="#ffd54f"/>
      <circle cx="32" cy="-120" r="2.5" fill="#ffd54f"/>
      <!-- Heavy Celestial Shackles and Chains -->
      <path d="M-55-87 Q-48 7 -83-12 M44-89 Q43 5 96-6" stroke="#87929b" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M-90-50 Q0 20 90-50" stroke="#87929b" stroke-width="14" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`;
}

export function updateActors(state: FilmState, root: HTMLElement) {
  const hero = root.querySelector<SVGGElement>('#hero');
  if (!hero) return;

  const cape = root.querySelector<SVGGElement>('#cape-shape');
  const staff = root.querySelector<SVGGElement>('#hero-staff');
  const heroArms = root.querySelector<SVGGElement>('#hero-arms');
  const whip = root.querySelector<SVGGElement>('#hero-whip');
  const eyes = root.querySelector<SVGGElement>('#eyes');
  const eyeRays = root.querySelector<SVGGElement>('#eye-rays');
  const kneeling = root.querySelector<SVGGElement>('#kneeling-hero');
  const featherLeft = root.querySelector<SVGGElement>('#feather-left');
  const featherRight = root.querySelector<SVGGElement>('#feather-right');
  const staffArc = root.querySelector<SVGGElement>('#staff-arc');
  const staffCore = root.querySelector<SVGGElement>('#staff-core');

  // 5 Costumes
  const costumePilgrim = root.querySelector<SVGGElement>('#costume-pilgrim');
  const costumeMonkey = root.querySelector<SVGGElement>('#costume-monkey');
  const costumeBima = root.querySelector<SVGGElement>('#costume-bima');
  const costumeGreatSage = root.querySelector<SVGGElement>('#costume-greatsage');
  const costumeFurnace = root.querySelector<SVGGElement>('#costume-furnace');

  // Headwears
  const headPilgrim = root.querySelector<SVGGElement>('#head-pilgrim');
  const headMonkey = root.querySelector<SVGGElement>('#head-monkey');
  const headBima = root.querySelector<SVGGElement>('#head-bima');
  const headCrown = root.querySelector<SVGGElement>('#head-crown');
  const headFurnace = root.querySelector<SVGGElement>('#head-furnace');

  // Palette Filter
  root.style.filter = state.palette === 'punishment' || state.palette === 'black'
    ? 'grayscale(.82) brightness(.68)'
    : state.palette === 'faded' ? 'grayscale(.62) brightness(.75)' : 'none';

  // Toggle 5 Costume Stages
  const stage = state.costumeStage;
  if (costumePilgrim) costumePilgrim.style.display = stage === 'pilgrim' ? 'inline' : 'none';
  if (costumeMonkey) costumeMonkey.style.display = stage === 'monkeyKing' ? 'inline' : 'none';
  if (costumeBima) costumeBima.style.display = stage === 'bima' ? 'inline' : 'none';
  if (costumeGreatSage) costumeGreatSage.style.display = stage === 'greatSage' ? 'inline' : 'none';
  if (costumeFurnace) costumeFurnace.style.display = stage === 'furnaceGold' ? 'inline' : 'none';

  // Toggle Corresponding Headwears
  if (headPilgrim) headPilgrim.style.display = stage === 'pilgrim' ? 'inline' : 'none';
  if (headMonkey) headMonkey.style.display = stage === 'monkeyKing' ? 'inline' : 'none';
  if (headBima) headBima.style.display = stage === 'bima' ? 'inline' : 'none';
  if (headCrown) headCrown.style.display = stage === 'greatSage' ? 'inline' : 'none';
  if (headFurnace) headFurnace.style.display = stage === 'furnaceGold' ? 'inline' : 'none';

  // Sway Pheasant Feathers Dynamically with featherAngle
  if (featherLeft) featherLeft.setAttribute('transform', `rotate(${state.featherAngle} -10 -325)`);
  if (featherRight) featherRight.setAttribute('transform', `rotate(${-state.featherAngle * 0.85} 10 -325)`);

  // Billowing Cape (Only in Great Sage or Scene 14)
  if (cape) {
    cape.style.display = (stage === 'greatSage' || state.scene === 14) ? 'inline' : 'none';
    cape.style.opacity = String(state.palette === 'storm' ? 0.27 : state.palette === 'banquet' ? 0.55 : 1);
    cape.setAttribute('transform', `rotate(${state.capeAngle} -25 -190)`);
  }

  // Ruyi Jingu Bang Strike and Glow
  if (staff) {
    staff.setAttribute('transform', `translate(70 -155) rotate(${state.staffAngle})`);
    staff.style.opacity = String(state.staffVisible);
    staff.style.filter = `drop-shadow(0 0 ${4 + state.staffGlow * 24}px rgba(255,215,0,${0.35 + state.staffGlow * 0.65}))`;
  }
  if (staffCore) {
    staffCore.style.opacity = String(state.staffGlow * 0.95);
  }
  if (staffArc) {
    staffArc.style.display = 'none';
  }

  // Horse Whip (Only in Scene 6)
  if (whip) {
    whip.style.opacity = state.scene === 6 ? '1' : '0';
    whip.style.display = state.scene === 6 ? 'inline' : 'none';
  }

  // Fiery Eyes and Eye Rays
  if (eyes) {
    eyes.style.opacity = String(Math.max(state.eyeGlow, stage === 'furnaceGold' ? 0.95 : 0.45));
    eyes.style.filter = `drop-shadow(0 0 ${4 + state.eyeGlow * 22}px #ffd54f)`;
  }
  if (eyeRays) {
    const rayOpacity = stage === 'furnaceGold' ? Math.max(0.35, state.eyeGlow) : state.eyeGlow;
    eyeRays.style.opacity = String(rayOpacity);
    eyeRays.style.display = rayOpacity > 0.01 ? 'inline' : 'none';
  }

  // Dynamic Martial Stance on Arms & Hands
  const stance = state.heroStance || 'stand';
  if (heroArms) {
    if (state.staffVisible <= 0.05) {
      heroArms.style.opacity = '0.3';
    } else {
      heroArms.style.opacity = '1';
    }
    if (stance === 'strike') {
      heroArms.setAttribute('transform', 'translate(12 -28) rotate(-16)');
    } else if (stance === 'crouch') {
      heroArms.setAttribute('transform', 'translate(-8 14) rotate(12)');
    } else if (stance === 'jump') {
      heroArms.setAttribute('transform', 'translate(0 -32) rotate(-22)');
    } else {
      heroArms.setAttribute('transform', 'translate(0 0) rotate(0)');
    }
  }

  // Hero Positioning, Squash & Stretch, and Scene Camera Transforms
  const centered = [14, 15, 16, 17, 18, 19, 21, 22].includes(state.scene);
  const heroX = state.scene === 2 ? 610 + state.raftX * 250 : centered ? 960 : state.heroX;
  const heroY = state.scene === 2 ? 793 : state.scene === 18 ? 1040 : state.heroY;
  const heroScale = state.scene === 18 ? state.heroScale * 1.48 : state.heroScale;
  const vanish = state.scene === 3 && state.progress > 0.77 && state.progress < 0.81;
  hero.style.opacity = state.scene === 1 || state.scene === 14 || vanish ? '0' : String(Math.min(1, Math.max(0, heroScale)));

  if (kneeling) {
    kneeling.style.opacity = state.scene === 14 ? '1' : '0';
  }

  const heightScale = state.scene === 14 ? heroScale * 0.62 : heroScale;
  const squashX = Number.isFinite(state.heroSquashX) ? state.heroSquashX : 1;
  const squashY = Number.isFinite(state.heroSquashY) ? state.heroSquashY : 1;
  const finalScaleX = heroScale * squashX;
  const finalScaleY = heightScale * squashY;

  let stanceOffsetY = 0;
  let stanceRot = state.heroRotation;
  if (stance === 'crouch') {
    stanceOffsetY = 24; // lower center of gravity in martial horse stance
    stanceRot += 6;
  } else if (stance === 'strike') {
    stanceOffsetY = -18; // spring up on explosive strike
    stanceRot += -12;
  } else if (stance === 'jump') {
    stanceOffsetY = -42; // airborne leap
    stanceRot += 14;
  }
  hero.setAttribute('transform', `translate(${heroX} ${heroY + stanceOffsetY}) rotate(${stanceRot}) scale(${finalScaleX} ${finalScaleY})`);

  // Celestial Soldier Army Ranks: Wide Cinematic Battlefield Arc
  const soldiers = root.querySelectorAll<SVGGElement>('.soldier');
  soldiers.forEach((element, index) => {
    const side = index < 15 ? -1 : 1;
    const local = index % 15;
    const row = Math.floor(local / 5); // 0, 1, 2 (3 depth tiers)
    const col = local % 5;             // 0..4 (5 columns per wing)

    // Spread smoothly across left wing (x: 160-800) and right wing (x: 1120-1760)
    const normCol = col / 4;
    const baseX = side < 0
      ? 160 + normCol * 640 + row * 28
      : 1760 - normCol * 640 - row * 28;
    const baseY = 720 + row * 65 + (col % 2) * 16 - Math.abs(normCol - 0.5) * 36;
    const scale = 0.58 + row * 0.16;

    const stagger = Math.min(1, Math.max(0, (state.soldierReveal * 1.4 - row * 0.14 - col * 0.04)));
    const enterX = side * 420 * (1 - stagger);
    const scatter = state.soldierScatter;

    // Radial blast explosion velocity away from hero center (heroX, 800)
    const angleFromHero = Math.atan2(baseY - 780, baseX - 960);
    const scatterDist = (260 + (index * 83) % 250) * scatter;
    const flyX = Math.cos(angleFromHero) * scatterDist;
    const flyY = Math.sin(angleFromHero) * scatterDist - (190 + (index * 47) % 160) * Math.sin(scatter * Math.PI);
    const rotate = side * (45 + (index * 29) % 95) * scatter + (side < 0 ? 8 : -8);

    element.style.opacity = String(Math.max(0, Math.min(1, stagger * (1 - scatter * 0.38))));
    element.setAttribute('transform', `translate(${baseX + enterX + flyX} ${baseY + flyY}) rotate(${rotate}) scale(${scale})`);
  });
}
