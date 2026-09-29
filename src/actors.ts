import type { FilmState } from './timeline';

/**
 * 1961 Shanghai Animation Film Studio authentic celestial soldier.
 * Armed with silver-white Mingguang armor, phoenix-crest helmet, and 12-foot red-tasseled spear.
 */
function soldierSvg(index: number): string {
  const isAlt = index % 2 === 1;
  const spearAngle = isAlt ? -18 : -12;
  return `<g class="soldier" data-index="${index}">
    <!-- Celestial Soldier Shadow -->
    <ellipse cx="0" cy="0" rx="36" ry="10" fill="#000000" opacity=".35"/>

    <!-- Greaves and Boots -->
    <path d="M-22-2 M-22-38 L-30 0 L-6 0 L-10-38 Z" fill="#1e272e" stroke="#0a0f14" stroke-width="2.5"/>
    <path d="M12-38 L6 0 L30 0 L22-38 Z" fill="#1e272e" stroke="#0a0f14" stroke-width="2.5"/>
    <path d="M-28-2 L-8-2 M8-2 L28-2" stroke="#dfe6e9" stroke-width="3"/>

    <!-- Trousers and Thigh Armor (裙甲) -->
    <path d="M-30-78 L-32-36 L-6-36 L-8-78 Z M8-78 L6-36 L32-36 L30-78 Z" fill="#2d3436" stroke="#636e72" stroke-width="3"/>
    <path d="M-28-76 Q0-68 28-76 L25-42 Q0-38 -25-42 Z" fill="#3867d6" stroke="#2c3e50" stroke-width="2.5"/>

    <!-- Breastplate (银白玄铁明光甲) -->
    <path d="M-32-132 Q-36-95 -28-78 Q0-70 28-78 Q36-95 32-132 Q0-140 -32-132 Z" fill="url(#silverArmor)" stroke="#4b6584" stroke-width="3.5"/>
    <!-- Center Heart Mirror (护心镜) -->
    <circle cx="0" cy="-105" r="14" fill="#f5f6fa" stroke="#f1c40f" stroke-width="3"/>
    <circle cx="0" cy="-105" r="10" fill="#74b9ff" opacity=".85"/>
    <circle cx="-3" cy="-108" r="3" fill="#ffffff" opacity=".8"/>
    <!-- Armor Straps & Belt with Lion Buckle -->
    <path d="M-28-82 Q0-76 28-82" stroke="#f1c40f" stroke-width="5" fill="none"/>
    <circle cx="0" cy="-79" r="6" fill="#e67e22" stroke="#b7791f" stroke-width="1.5"/>

    <!-- Pauldrons (披膊) -->
    <path d="M-30-130 Q-52-124 -46-96 Q-32-90 -24-110 Z" fill="#b2bec3" stroke="#4b6584" stroke-width="3"/>
    <path d="M30-130 Q52-124 46-96 Q32-90 24-110 Z" fill="#b2bec3" stroke="#4b6584" stroke-width="3"/>

    <!-- Celestial Soldier Face & Beard -->
    <path d="M-14-162 Q-18-138 0-134 Q18-138 14-162 Z" fill="#fed330" stroke="#b7791f" stroke-width="2"/>
    <path d="M-10-142 Q0-138 10-142" stroke="#1e272e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="-5" cy="-148" r="2" fill="#1e272e"/>
    <circle cx="5" cy="-148" r="2" fill="#1e272e"/>

    <!-- Phoenix-Wing Helmet (凤翅战盔) -->
    <path d="M-22-156 Q-28-196 0-205 Q28-196 22-156 Z" fill="url(#silverArmor)" stroke="#4b6584" stroke-width="3.5"/>
    <!-- Golden Brow & Visor -->
    <path d="M-24-156 Q0-166 24-156 L20-164 Q0-174 -20-164 Z" fill="#f1c40f" stroke="#b7791f" stroke-width="2"/>
    <!-- Helmet Phoenix Wings -->
    <path d="M-22-172 Q-44-186 -38-208 Q-26-196 -18-185 Z" fill="#dfe6e9" stroke="#4b6584" stroke-width="2.5"/>
    <path d="M22-172 Q44-186 38-208 Q26-196 18-185 Z" fill="#dfe6e9" stroke="#4b6584" stroke-width="2.5"/>
    <path d="M0-205 L-3-224 L0-228 L3-224 Z" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>

    <!-- 12-Foot Red-Tasseled Spear (丈二红缨枪) -->
    <g transform="rotate(${spearAngle} 32 -100)">
      <!-- Long Ash Shaft -->
      <line x1="32" y1="-270" x2="32" y2="40" stroke="#4b6584" stroke-width="6" stroke-linecap="round"/>
      <line x1="33" y1="-268" x2="33" y2="38" stroke="#dfe6e9" stroke-width="1.5" opacity=".5"/>
      <!-- Scarlet Spear Tassel (红缨) -->
      <path d="M26-260 Q12-242 18-218 Q32-230 38-260 Z" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>
      <path d="M38-260 Q48-245 42-225 Q32-232 26-260 Z" fill="#ff4757" opacity=".85"/>
      <!-- Keen Steel Spearhead -->
      <path d="M32-302 L24-266 L32-260 L40-266 Z" fill="#f5f6fa" stroke="#74b9ff" stroke-width="2.5"/>
      <line x1="32" y1="-300" x2="32" y2="-260" stroke="#ffffff" stroke-width="2"/>
    </g>

    <!-- Hands gripping spear -->
    <circle cx="30" cy="-105" r="7" fill="#fed330" stroke="#b7791f" stroke-width="2"/>
    <circle cx="34" cy="-75" r="7" fill="#fed330" stroke="#b7791f" stroke-width="2"/>
  </g>`;
}

/**
 * Shanghai Animation Film Studio 1961 Sun Wukong head with Peking Opera heart-shaped face paint.
 */
function wukongHeadSvg(): string {
  return `<!-- Sun Wukong Base Mane (金棕色浓密美猴王鬃毛) -->
    <path d="M-48-285 C-62-265 -58-235 -40-218 C-30-208 -15-202 0-202 C15-202 30-208 40-218 C58-235 62-265 48-285 C42-302 25-320 0-320 C-25-320 -42-302 -48-285 Z" fill="#935817" stroke="#683b0d" stroke-width="3"/>
    <path d="M-45-275 C-56-260 -52-240 -38-228 M45-275 C56-260 52-240 38-228" fill="none" stroke="#b7791f" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M-30-295 C-42-280 -40-260 -30-245 M30-295 C42-280 40-260 30-245" fill="none" stroke="#d68910" stroke-width="3" stroke-linecap="round"/>

    <!-- Ears (猴王灵耳) -->
    <path d="M-42-272 C-56-274 -58-248 -42-244 Z" fill="#b7791f" stroke="#784212" stroke-width="2.5"/>
    <path d="M-44-266 C-50-267 -51-255 -43-252" stroke="#fab1a0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M42-272 C56-274 58-248 42-244 Z" fill="#b7791f" stroke="#784212" stroke-width="2.5"/>
    <path d="M44-266 C50-267 51-255 43-252" stroke="#fab1a0" stroke-width="2.5" fill="none" stroke-linecap="round"/>

    <!-- Peking Opera Heart-shaped Face Paint (外红轮廓) -->
    <path d="M0-288 C-16-306 -44-300 -43-268 C-41-244 -18-230 0-220 C18-230 41-244 43-268 C44-300 16-306 0-288 Z" fill="#c0292b" stroke="#8a1515" stroke-width="3"/>

    <!-- Inner Jade-White Delicate Face Base (内层细腻玉白面底) -->
    <path d="M0-283 C-13-298 -35-293 -35-268 C-33-248 -14-236 0-226 C14-236 33-248 35-268 C35-293 13-298 0-283 Z" fill="#fff9e6" stroke="#eed99f" stroke-width="1.2"/>

    <!-- Ape Snout & Playful Smile (戏曲神采猴嘴与鼻吻) -->
    <path d="M-18-228 C-12-216 0-214 0-214 C0-214 12-216 18-228" fill="#fed330" opacity=".3"/>
    <path d="M-15-234 Q0-226 15-234" stroke="#921214" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M-6-229 Q0-225 6-229" stroke="#c0292b" stroke-width="2" fill="none"/>
    <path d="M-4-246 Q0-250 4-246 Q0-243 -4-246 Z" fill="#c0292b"/>

    <!-- Theatrical Flying Eyebrows (戏曲倒八字飞扬眉峰) -->
    <path d="M-2-277 Q-12-281 -33-291 Q-16-285 -2-277 Z" fill="#14171a"/>
    <path d="M2-277 Q12-281 33-291 Q16-285 2-277 Z" fill="#14171a"/>

    <!-- Golden Fiery Eyes (金睛火眼) -->
    <g id="eyes">
      <!-- Left Eye -->
      <path d="M-28-268 C-26-275 -12-276 -8-269 C-12-262 -26-262 -28-268 Z" fill="#ffd54f" stroke="#14171a" stroke-width="2"/>
      <circle cx="-18" cy="-268" r="3.6" fill="#111827"/>
      <circle cx="-19" cy="-269" r="1.4" fill="#ffffff"/>
      <!-- Right Eye -->
      <path d="M8-269 C12-276 26-275 28-268 C26-262 12-262 8-269 Z" fill="#ffd54f" stroke="#14171a" stroke-width="2"/>
      <circle cx="18" cy="-268" r="3.6" fill="#111827"/>
      <circle cx="17" cy="-269" r="1.4" fill="#ffffff"/>
    </g>

    <!-- Fiery Eye Rays (金睛极光束 - 八卦炉受炼涅槃态) -->
    <g id="eye-rays" style="display:none;opacity:0;">
      <polygon points="-18,-268 -720,-380 -720,-156" fill="url(#eyeRayGradient)" opacity=".85"/>
      <polygon points="18,-268 720,-380 720,-156" fill="url(#eyeRayGradient)" transform="scale(-1 1)" opacity=".85"/>
      <line x1="-18" y1="-268" x2="-700" y2="-268" stroke="#ffffff" stroke-width="4.5" filter="url(#eyeGlow)"/>
      <line x1="18" y1="-268" x2="700" y2="-268" stroke="#ffffff" stroke-width="4.5" filter="url(#eyeGlow)"/>
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
        <!-- Soap-Leather Black Boots with White Soles (皂色黑靴) -->
        <path d="M-64-18 L-62 0 L-14 0 L-18-20 Z" fill="#1e272e" stroke="#0a0f14" stroke-width="3"/>
        <path d="M-66 0 L-12 0" stroke="#f5f6fa" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M16-20 L12 0 L64 0 L60-18 Z" fill="#1e272e" stroke="#0a0f14" stroke-width="3"/>
        <path d="M10 0 L66 0" stroke="#f5f6fa" stroke-width="4.5" stroke-linecap="round"/>

        <!-- Scarlet Lantern Balloon Trousers (大红灯笼中裤) -->
        <path d="M-38-115 C-68-75 -65-25 -42-18 C-24-20 -20-70 -16-115 Z" fill="#d63031" stroke="#921214" stroke-width="4"/>
        <path d="M16-115 C20-70 24-20 42-18 C65-25 68-75 38-115 Z" fill="#d63031" stroke="#921214" stroke-width="4"/>

        <!-- Tiger-Skin Wrap Apron (斑斓虎皮斜围裙) -->
        <path d="M-48-162 L48-154 L44-90 L-42-110 Z" fill="#e67e22" stroke="#c0392b" stroke-width="4"/>
        <!-- Tiger Stripes -->
        <path d="M-36-150 Q-26-144 -30-130 M-18-155 Q-10-140 -14-124 M12-148 Q22-136 18-120 M32-142 Q40-130 36-112" stroke="#1e272e" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <!-- Crimson Velvet Trim -->
        <path d="M-48-162 L-42-110 L44-90 L48-154" stroke="#c0392b" stroke-width="4.5" fill="none"/>
        <path d="M-50-160 Q0-154 50-160" stroke="#d63031" stroke-width="6" fill="none"/>

        <!-- Iconic Goose-Yellow Mandarin Jacket (鹅黄对襟小衫) -->
        <path d="M-46-215 Q-64-180 -48-156 L46-156 Q62-180 44-215 Z" fill="#f5c518" stroke="#d4ac0d" stroke-width="4.5"/>
        <path d="M0-215 L0-156" stroke="#1e272e" stroke-width="3"/>
        <!-- Frog Buttons (传统盘扣) -->
        <line x1="-8" y1="-200" x2="8" y2="-200" stroke="#1e272e" stroke-width="3" stroke-linecap="round"/>
        <line x1="-8" y1="-180" x2="8" y2="-180" stroke="#1e272e" stroke-width="3" stroke-linecap="round"/>
        <circle cx="0" cy="-200" r="2.5" fill="#c0392b"/>
        <circle cx="0" cy="-180" r="2.5" fill="#c0392b"/>

        <!-- Fluttering Emerald Green Scarf (翠绿色轻盈飘逸领巾) -->
        <path d="M-14-226 C-32-234 -58-228 -74-242 C-62-220 -38-216 -12-218 Z" fill="#2ecc71" stroke="#27ae60" stroke-width="2.5"/>
        <path d="M8-224 C-4-210 -28-200 -52-206 C-40-194 -16-196 10-214 Z" fill="#27ae60" stroke="#1abc9c" stroke-width="2"/>
        <circle cx="0" cy="-222" r="5" fill="#2ecc71" stroke="#27ae60" stroke-width="2"/>
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
        <!-- Combat Boots & Greaves -->
        <path d="M-64-18 L-62 0 L-14 0 L-18-20 Z" fill="#1e272e" stroke="#ffd700" stroke-width="2.5"/>
        <path d="M16-20 L12 0 L64 0 L60-18 Z" fill="#1e272e" stroke="#ffd700" stroke-width="2.5"/>
        <path d="M-38-116 L-62-18 L-16 0 L-18-116 M18-116 L16 0 L62-18 L38-116" fill="#c0392b" stroke="#ffd700" stroke-width="2.5"/>

        <!-- Golden Mountain-Pattern Armor (锁子黄金甲 / 山字甲) -->
        <path d="M-50-215 Q-70-178 -54-130 L54-130 Q70-178 50-215 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="4.5"/>
        <path d="M-30-192 Q0-184 30-192 M-34-166 Q0-156 34-166 M-24-138 Q0-132 24-138" stroke="#b7791f" stroke-width="3.5" fill="none"/>

        <!-- Beast-Head Swallowed Breastplate (兽面吞头胸甲) -->
        <path d="M-28-176 C-34-150 -22-132 0-130 C22-132 34-150 28-176 Z" fill="#d35400" stroke="#b7791f" stroke-width="3"/>
        <circle cx="-10" cy="-156" r="3" fill="#ffd700"/>
        <circle cx="10" cy="-156" r="3" fill="#ffd700"/>
        <path d="M-6-140 Q0-146 6-140" stroke="#ffd700" stroke-width="2.5" fill="none"/>

        <!-- Dragon Pauldrons & Bracers (明光护膊与金丝龙首) -->
        <path d="M-48-208 Q-78-190 -66-140 Q-48-145 -38-175 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="3"/>
        <path d="M48-208 Q78-190 66-140 Q48-145 38-175 Z" fill="url(#goldArmor)" stroke="#b7791f" stroke-width="3"/>
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

        <!-- Long Curved Pheasant Feathers (细长柔韧雉鸡双翎 - 随 featherAngle 摆动) -->
        <g id="feather-left">
          <!-- Feather Plume Left -->
          <path d="M-10-325 C-35-390 -95-455 -145-475 C-180-492 -210-465 -198-438 C-190-420 -162-418 -145-428 C-112-448 -65-402 -25-342 Z" fill="url(#featherBands)" stroke="#b7791f" stroke-width="2"/>
          <path d="M-10-325 C-40-395 -100-455 -170-462" stroke="#ffffff" stroke-width="1.5" fill="none" opacity=".6"/>
        </g>
        <g id="feather-right">
          <!-- Feather Plume Right -->
          <path d="M10-325 C35-390 95-455 145-475 C180-492 210-465 198-438 C190-420 162-418 145-428 C112-448 65-402 25-342 Z" fill="url(#featherBands)" stroke="#b7791f" stroke-width="2"/>
          <path d="M10-325 C40-395 100-455 170-462" stroke="#ffffff" stroke-width="1.5" fill="none" opacity=".6"/>
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
        <path id="staff-arc" d="M-60-480 C-140-300 -160-50 -80 160 C-40 60 -50-200 -30-430 Z" fill="url(#staffGold)" opacity="0" filter="url(#strikeGlow)"/>

        <!-- Deep Meteoric Black Iron Shaft (深墨玄铁棒身) -->
        <rect id="staff-shaft" x="-12" y="-450" width="24" height="600" rx="4" fill="url(#staffShaft)" stroke="#0a0c0e" stroke-width="2.5"/>
        <!-- Inner Incandescent Molten Radiant Golden Core -->
        <rect id="staff-core" x="-7" y="-450" width="14" height="600" rx="3" fill="url(#staffGlowGradient)" opacity="0"/>

        <!-- Top Dragon Meander Gold Cuff (两端精美云龙回纹金箍) -->
        <rect x="-16" y="-495" width="32" height="48" rx="5" fill="url(#staffGold)" stroke="#805b00" stroke-width="2.5"/>
        <path d="M-12-482 h24 M-12-468 h24 M-6-475 h12" stroke="#5c3800" stroke-width="2.5"/>

        <!-- Bottom Dragon Meander Gold Cuff -->
        <rect x="-16" y="147" width="32" height="48" rx="5" fill="url(#staffGold)" stroke="#805b00" stroke-width="2.5"/>
        <path d="M-12-160 h24 M-12-174 h24 M-6-167 h12" stroke="#5c3800" stroke-width="2.5" transform="translate(0 334)"/>
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
    staffArc.style.opacity = String(Math.max(0, (state.staffGlow - 0.25) * 1.33));
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

  // Hero Positioning and Scene Camera Transforms
  const centered = [14, 15, 16, 17, 18, 19, 21, 22].includes(state.scene);
  const heroX = state.scene === 2 ? 610 + state.raftX * 250 : centered ? 960 : state.heroX;
  const heroY = state.scene === 2 ? 793 : state.scene === 18 ? 1040 : state.heroY;
  const heroScale = state.scene === 18 ? state.heroScale * 1.48 : state.heroScale;
  const hideForInsert = state.scene === 8 && state.progress > 0.45 && state.progress < 0.83;
  const vanish = state.scene === 3 && state.progress > 0.77 && state.progress < 0.81;
  hero.style.opacity = state.scene === 1 || state.scene === 14 || hideForInsert || vanish ? '0' : String(Math.min(1, Math.max(0, heroScale)));

  if (kneeling) {
    kneeling.style.opacity = state.scene === 14 ? '1' : '0';
  }

  const heightScale = state.scene === 14 ? heroScale * 0.62 : heroScale;
  hero.setAttribute('transform', `translate(${heroX} ${heroY}) rotate(${state.heroRotation}) scale(${heroScale} ${heightScale})`);

  // Celestial Soldier Army Ranks and Physics Choreography
  const soldiers = root.querySelectorAll<SVGGElement>('.soldier');
  soldiers.forEach((element, index) => {
    const side = index < 15 ? -1 : 1;
    const local = index % 15;
    const row = Math.floor(local / 5);
    const col = local % 5;
    const targetX = side < 0 ? 70 + col * 102 + row * 24 : 1840 - col * 103 - row * 23;
    const targetY = 744 + row * 75 + (col % 2) * 15;
    const scale = 0.56 + row * 0.17;
    const stagger = Math.min(1, Math.max(0, (state.soldierReveal * 1.35 - row * 0.12 - col * 0.055)));
    const enterX = side * 370 * (1 - stagger);
    const scatter = state.soldierScatter;
    const flyX = side * (150 + (4 - col) * 60 + row * 40) * scatter;
    const flyY = (210 + (index * 73) % 200) * Math.sin(scatter * Math.PI * 0.9);
    const rotate = side * (50 + (index * 19) % 85) * scatter;
    element.style.opacity = String(Math.max(0, Math.min(1, stagger * (1 - scatter * 0.42))));
    element.setAttribute('transform', `translate(${targetX + enterX + flyX} ${targetY - flyY}) rotate(${rotate}) scale(${scale})`);
  });
}
