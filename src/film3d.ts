import * as THREE from 'three';
import type { FilmState } from './timeline';

export interface Film3D {
  render: (state: FilmState) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
  readonly scene?: THREE.Scene;
  readonly camera?: THREE.PerspectiveCamera;
  readonly renderer?: THREE.WebGLRenderer;
}

export interface Film3DOptions {
  renderer?: THREE.WebGLRenderer;
}

// Deterministic pseudo-random number generator (LCG)
function createLCG(seed = 19610725) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Fallback stub renderer for headless testing environments without WebGL
function createStubRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  return {
    domElement: canvas,
    setSize: () => {},
    setPixelRatio: () => {},
    render: () => {},
    dispose: () => {},
    toneMapping: THREE.ACESFilmicToneMapping,
  } as unknown as THREE.WebGLRenderer;
}

export function initFilm3D(canvas: HTMLCanvasElement, options?: Film3DOptions): Film3D {
  let renderer: THREE.WebGLRenderer;
  if (options?.renderer) {
    renderer = options.renderer;
  } else {
    try {
      if (typeof canvas?.getContext === 'function') {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(1920, 1080);
        renderer.setPixelRatio(1);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
      } else {
        renderer = createStubRenderer(canvas);
      }
    } catch {
      renderer = createStubRenderer(canvas);
    }
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1920 / 1080, 1, 10000);
  camera.position.set(0, 80, 600);
  camera.lookAt(0, 80, 0);

  const rng = createLCG(1961);

  // -------------------------------------------------------------
  // Lighting System (Celestial Sun, Ambient Ink & Furnace Light)
  // -------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.7);
  scene.add(ambientLight);

  const celestialSun = new THREE.DirectionalLight(0xffeedd, 1.4);
  celestialSun.position.set(300, 700, 450);
  scene.add(celestialSun);

  const celestialFill = new THREE.DirectionalLight(0x7fb3d5, 0.45);
  celestialFill.position.set(-400, 200, -300);
  scene.add(celestialFill);

  const furnaceLight = new THREE.PointLight(0xff6600, 0, 1200, 1.5);
  furnaceLight.position.set(0, 75, 0);
  scene.add(furnaceLight);

  // -------------------------------------------------------------
  // 1. 万顷云海 (3D Cloud Sea)
  // -------------------------------------------------------------
  const cloudSeaWidth = 3600;
  const cloudSeaDepth = 2600;
  const cloudSegX = 64;
  const cloudSegZ = 48;
  const cloudSeaGeo = new THREE.PlaneGeometry(cloudSeaWidth, cloudSeaDepth, cloudSegX, cloudSegZ);
  cloudSeaGeo.rotateX(-Math.PI / 2);

  const cloudPosAttr = cloudSeaGeo.attributes.position as THREE.BufferAttribute;
  const cloudVertexCount = cloudPosAttr.count;
  const cloudBasePositions = new Float32Array(cloudVertexCount * 3);
  for (let i = 0; i < cloudVertexCount * 3; i++) {
    cloudBasePositions[i] = cloudPosAttr.array[i];
  }

  const cloudSeaMat = new THREE.MeshStandardMaterial({
    color: 0xdff0f8,
    roughness: 0.8,
    metalness: 0.1,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const cloudSeaMesh = new THREE.Mesh(cloudSeaGeo, cloudSeaMat);
  cloudSeaMesh.name = 'cloud-sea';
  cloudSeaMesh.position.set(0, -35, 0);
  scene.add(cloudSeaMesh);

  // Additional mid-depth cloud banks / rolling layers
  const cloudBanksGroup = new THREE.Group();
  cloudBanksGroup.name = 'cloud-banks';
  const cloudBankMat = new THREE.MeshStandardMaterial({
    color: 0xc9e4f2,
    roughness: 0.9,
    metalness: 0.05,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });

  for (let b = 0; b < 12; b++) {
    const rx = (rng() - 0.5) * 2200;
    const rz = -200 - rng() * 1200;
    const ry = -10 + rng() * 40;
    const scaleX = 180 + rng() * 220;
    const scaleY = 30 + rng() * 30;
    const scaleZ = 120 + rng() * 140;

    const bankGeo = new THREE.SphereGeometry(1, 16, 12);
    const bankMesh = new THREE.Mesh(bankGeo, cloudBankMat);
    bankMesh.position.set(rx, ry, rz);
    bankMesh.scale.set(scaleX, scaleY, scaleZ);
    cloudBanksGroup.add(bankMesh);
  }
  scene.add(cloudBanksGroup);

  // -------------------------------------------------------------
  // 2. 3D 南天门与天宫殿柱 (Nantianmen & Dragon Columns)
  // -------------------------------------------------------------
  const nantianmenGroup = new THREE.Group();
  nantianmenGroup.name = 'nantianmen';

  // White Jade Material
  const jadeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.25,
    metalness: 0.12,
  });

  // Imperial Gold Material
  const imperialGoldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.88,
  });

  // Celestial Vermilion Pillar Material
  const cinnabarMat = new THREE.MeshStandardMaterial({
    color: 0x8b1d19,
    roughness: 0.35,
    metalness: 0.2,
  });

  // Glazed Golden Tile Roof Material
  const glazedRoofMat = new THREE.MeshStandardMaterial({
    color: 0xf5c518,
    roughness: 0.2,
    metalness: 0.72,
  });

  // Celestial Steps & Marble Terrace Base (高耸汉白玉天阶台基)
  const stepsGroup = new THREE.Group();
  stepsGroup.name = 'celestial-steps';

  const baseTerrace = new THREE.Mesh(new THREE.BoxGeometry(520, 24, 260), jadeWhiteMat);
  baseTerrace.position.set(0, 12, 0);
  stepsGroup.add(baseTerrace);

  const subTerrace = new THREE.Mesh(new THREE.BoxGeometry(580, 16, 320), jadeWhiteMat);
  subTerrace.position.set(0, -8, 20);
  stepsGroup.add(subTerrace);

  // 5 cascading steps descending toward front
  for (let s = 0; s < 5; s++) {
    const stepMesh = new THREE.Mesh(
      new THREE.BoxGeometry(320 - s * 15, 6, 26),
      jadeWhiteMat
    );
    stepMesh.position.set(0, 10 - s * 5, 140 + s * 24);
    stepsGroup.add(stepMesh);
  }

  // Marble Balustrade posts
  for (let p = -220; p <= 220; p += 55) {
    const postLeft = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 20, 8), jadeWhiteMat);
    postLeft.position.set(p, 30, 125);
    stepsGroup.add(postLeft);

    const postBack = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.5, 20, 8), jadeWhiteMat);
    postBack.position.set(p, 30, -125);
    stepsGroup.add(postBack);
  }
  nantianmenGroup.add(stepsGroup);

  // Left & Right Dragon Pillars (左右两根盘绕金龙浮雕的巍峨巨柱)
  const pillarX = 180;
  const pillarHeight = 280;
  const pillarRadius = 16;

  function createDragonPillar(isRight: boolean): THREE.Group {
    const columnGroup = new THREE.Group();
    columnGroup.name = isRight ? 'column-right' : 'column-left';
    columnGroup.position.set(isRight ? pillarX : -pillarX, 150, 0);

    // Cinnabar Pillar Shaft
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(pillarRadius, pillarRadius + 2, pillarHeight, 32),
      cinnabarMat
    );
    columnGroup.add(shaft);

    // Sumeru Octagonal Pedestal Base (须弥座)
    const baseSumeru = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 34, 28, 8),
      imperialGoldMat
    );
    baseSumeru.position.set(0, -pillarHeight / 2 + 10, 0);
    columnGroup.add(baseSumeru);

    // Lotus Capital at Top
    const capital = new THREE.Mesh(
      new THREE.CylinderGeometry(30, 22, 22, 16),
      imperialGoldMat
    );
    capital.position.set(0, pillarHeight / 2 - 10, 0);
    columnGroup.add(capital);

    // Coiled 3D Golden Dragon Relief (盘旋金龙)
    const dragonGroup = new THREE.Group();
    dragonGroup.name = isRight ? 'dragon-right' : 'dragon-left';

    const curvePoints: THREE.Vector3[] = [];
    const turns = 3.5;
    const steps = 70;
    const direction = isRight ? -1 : 1;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * Math.PI * 2 * turns * direction;
      const r = pillarRadius + 4 + Math.sin(t * Math.PI * 6) * 1.5;
      const y = -pillarHeight / 2 + 35 + t * (pillarHeight - 65);
      curvePoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }

    const dragonCurve = new THREE.CatmullRomCurve3(curvePoints);
    const dragonBodyGeo = new THREE.TubeGeometry(dragonCurve, 64, 4.2, 8, false);
    const dragonBody = new THREE.Mesh(dragonBodyGeo, imperialGoldMat);
    dragonGroup.add(dragonBody);

    // Dragon Head at top looking inward toward gate opening
    const headX = (pillarRadius + 8) * Math.cos(turns * Math.PI * 2 * direction);
    const headZ = (pillarRadius + 8) * Math.sin(turns * Math.PI * 2 * direction);
    const headY = pillarHeight / 2 - 25;

    const headGeo = new THREE.BoxGeometry(16, 12, 22);
    const dragonHead = new THREE.Mesh(headGeo, imperialGoldMat);
    dragonHead.position.set(headX, headY, headZ);
    dragonHead.lookAt(isRight ? -50 : 50, headY, 0);

    // Horns
    const hornGeo = new THREE.ConeGeometry(2.5, 18, 6);
    const horn1 = new THREE.Mesh(hornGeo, imperialGoldMat);
    horn1.position.set(3, 10, -4);
    horn1.rotation.x = -0.4;
    dragonHead.add(horn1);

    const horn2 = new THREE.Mesh(hornGeo, imperialGoldMat);
    horn2.position.set(-3, 10, -4);
    horn2.rotation.x = -0.4;
    dragonHead.add(horn2);

    dragonGroup.add(dragonHead);

    // Dragon Claws clutching pillar
    for (let c = 0; c < 4; c++) {
      const clawIdx = Math.floor((c + 1) * (steps / 5));
      const pt = curvePoints[clawIdx];
      const clawGeo = new THREE.BoxGeometry(6, 4, 10);
      const claw = new THREE.Mesh(clawGeo, imperialGoldMat);
      claw.position.copy(pt);
      claw.lookAt(0, pt.y, 0);
      dragonGroup.add(claw);
    }

    columnGroup.add(dragonGroup);
    return columnGroup;
  }

  nantianmenGroup.add(createDragonPillar(false));
  nantianmenGroup.add(createDragonPillar(true));

  // Architrave and Transverse Beam
  const beam = new THREE.Mesh(new THREE.BoxGeometry(410, 24, 30), cinnabarMat);
  beam.position.set(0, 282, 0);
  nantianmenGroup.add(beam);

  const subBeam = new THREE.Mesh(new THREE.BoxGeometry(440, 10, 36), imperialGoldMat);
  subBeam.position.set(0, 298, 0);
  nantianmenGroup.add(subBeam);

  // Golden Roof with Double-Eave Hip-and-Gable and Flying Eaves (顶部重檐庑殿金顶与琉璃飞檐)
  const roofGroup = new THREE.Group();
  roofGroup.name = 'golden-roof';

  // Lower Eave (下层檐)
  const lowerEave = new THREE.Mesh(new THREE.BoxGeometry(470, 20, 180), glazedRoofMat);
  lowerEave.position.set(0, 312, 0);
  roofGroup.add(lowerEave);

  // Lower flying eave corners (4 upturned corners)
  const cornerCoords = [
    [-240, 320, 95],
    [240, 320, 95],
    [-240, 320, -95],
    [240, 320, -95],
  ];
  for (const [cx, cy, cz] of cornerCoords) {
    const tip = new THREE.Mesh(new THREE.ConeGeometry(8, 22, 4), glazedRoofMat);
    tip.position.set(cx, cy, cz);
    tip.rotation.z = cx < 0 ? -0.7 : 0.7;
    roofGroup.add(tip);
  }

  // Middle Pavilion Story
  const midStory = new THREE.Mesh(new THREE.BoxGeometry(260, 26, 120), cinnabarMat);
  midStory.position.set(0, 332, 0);
  roofGroup.add(midStory);

  // Upper Main Golden Roof (上层金顶)
  const upperEave = new THREE.Mesh(new THREE.ConeGeometry(240, 50, 4), glazedRoofMat);
  upperEave.position.set(0, 368, 0);
  upperEave.rotation.y = Math.PI / 4;
  upperEave.scale.set(1.5, 1, 0.9);
  roofGroup.add(upperEave);

  // Chiwen Roof Ridge Beasts (鸱吻)
  const chiwenLeft = new THREE.Mesh(new THREE.DodecahedronGeometry(12), imperialGoldMat);
  chiwenLeft.position.set(-160, 375, 0);
  roofGroup.add(chiwenLeft);

  const chiwenRight = new THREE.Mesh(new THREE.DodecahedronGeometry(12), imperialGoldMat);
  chiwenRight.position.set(160, 375, 0);
  roofGroup.add(chiwenRight);

  // Gilded Inscription Plaque (南天门 匾额)
  const plaqueMat = new THREE.MeshStandardMaterial({
    color: 0x6e1b18,
    roughness: 0.3,
    metalness: 0.4,
  });
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(88, 38, 6), plaqueMat);
  plaque.position.set(0, 332, 62);

  const plaqueBorder = new THREE.Mesh(new THREE.BoxGeometry(94, 44, 4), imperialGoldMat);
  plaqueBorder.position.set(0, 332, 60);
  roofGroup.add(plaqueBorder);
  roofGroup.add(plaque);

  // Gold characters representation
  for (let ch = -1; ch <= 1; ch++) {
    const charMesh = new THREE.Mesh(new THREE.BoxGeometry(14, 18, 2), imperialGoldMat);
    charMesh.position.set(ch * 24, 332, 66);
    roofGroup.add(charMesh);
  }

  nantianmenGroup.add(roofGroup);
  scene.add(nantianmenGroup);

  // -------------------------------------------------------------
  // 3. 3D 八卦炉 (Eight Trigrams Furnace)
  // -------------------------------------------------------------
  const furnaceGroup = new THREE.Group();
  furnaceGroup.name = 'eight-trigrams-furnace';
  furnaceGroup.position.set(0, 75, 0);

  // Ancient Patinated Bronze Material
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x2e443f,
    roughness: 0.48,
    metalness: 0.78,
  });

  // Furnace Body: Three-legged, Two-eared Bronze Spherical Cauldron (三足两耳青铜浑圆巨炉)
  const cauldronBody = new THREE.Mesh(
    new THREE.SphereGeometry(50, 32, 24),
    bronzeMat
  );
  cauldronBody.scale.set(1, 0.92, 1);
  furnaceGroup.add(cauldronBody);

  // Cloud Meander Relief Waistband
  const waistband = new THREE.Mesh(
    new THREE.TorusGeometry(51, 3.2, 16, 48),
    imperialGoldMat
  );
  waistband.rotation.x = Math.PI / 2;
  furnaceGroup.add(waistband);

  // Inner molten fire core
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xff4500,
  });
  const furnaceCore = new THREE.Mesh(new THREE.SphereGeometry(32, 24, 16), coreMat);
  furnaceGroup.add(furnaceCore);

  // Tripod Legs (三足)
  const legsGroup = new THREE.Group();
  legsGroup.name = 'tripod-legs';

  for (let l = 0; l < 3; l++) {
    const legAngle = l * ((Math.PI * 2) / 3);
    const legPoints: THREE.Vector3[] = [
      new THREE.Vector3(Math.cos(legAngle) * 36, -20, Math.sin(legAngle) * 36),
      new THREE.Vector3(Math.cos(legAngle) * 48, -48, Math.sin(legAngle) * 48),
      new THREE.Vector3(Math.cos(legAngle) * 52, -75, Math.sin(legAngle) * 52),
    ];
    const legCurve = new THREE.CatmullRomCurve3(legPoints);
    const legMesh = new THREE.Mesh(
      new THREE.TubeGeometry(legCurve, 16, 6, 8, false),
      bronzeMat
    );
    legsGroup.add(legMesh);

    // Beast paw base
    const paw = new THREE.Mesh(new THREE.DodecahedronGeometry(8), imperialGoldMat);
    paw.position.copy(legPoints[2]);
    legsGroup.add(paw);
  }
  furnaceGroup.add(legsGroup);

  // Two Ritual Loop Ears (两耳)
  const earsGroup = new THREE.Group();
  earsGroup.name = 'furnace-ears';

  const earLeft = new THREE.Mesh(new THREE.TorusGeometry(14, 3.5, 12, 24), bronzeMat);
  earLeft.position.set(-54, 20, 0);
  earLeft.rotation.y = Math.PI / 2;
  earsGroup.add(earLeft);

  const earRight = new THREE.Mesh(new THREE.TorusGeometry(14, 3.5, 12, 24), bronzeMat);
  earRight.position.set(54, 20, 0);
  earRight.rotation.y = Math.PI / 2;
  earsGroup.add(earRight);

  furnaceGroup.add(earsGroup);

  // Domed Lid with stepped Pagoda Finial (炉盖与宝顶)
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(20, 48, 16, 32), bronzeMat);
  lid.position.set(0, 48, 0);
  furnaceGroup.add(lid);

  const finial = new THREE.Mesh(new THREE.OctahedronGeometry(9), imperialGoldMat);
  finial.position.set(0, 64, 0);
  furnaceGroup.add(finial);

  // Encirciling Eight Trigrams Rings / Halos (环绕炉身的八卦卦象光环)
  const trigramRingsGroup = new THREE.Group();
  trigramRingsGroup.name = 'trigram-rings';

  const trigramGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffa500,
    emissive: 0xff4500,
    emissiveIntensity: 1.2,
    roughness: 0.2,
    metalness: 0.8,
  });

  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(76, 2.2, 16, 64),
    trigramGlowMat
  );
  outerRing.rotation.x = Math.PI / 2;
  trigramRingsGroup.add(outerRing);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(66, 1.8, 16, 64),
    trigramGlowMat
  );
  innerRing.rotation.x = Math.PI / 2;
  trigramRingsGroup.add(innerRing);

  // Eight Trigrams (乾 ☰, 兑 ☱, 离 ☲, 震 ☳, 巽 ☴, 坎 ☵, 艮 ☶, 坤 ☷)
  // 1: Yang (solid 10), 0: Yin (broken: two 4.5 bars with 1.5 gap)
  const trigramConfigs = [
    [1, 1, 1], // 乾 Qian
    [0, 1, 1], // 兑 Dui
    [1, 0, 1], // 离 Li
    [0, 0, 1], // 震 Zhen
    [1, 1, 0], // 巽 Xun
    [0, 1, 0], // 坎 Kan
    [1, 0, 0], // 艮 Gen
    [0, 0, 0], // 坤 Kun
  ];

  for (let tri = 0; tri < 8; tri++) {
    const angle = tri * (Math.PI / 4);
    const triRadius = 71;
    const trigramBlock = new THREE.Group();
    trigramBlock.position.set(Math.cos(angle) * triRadius, 0, Math.sin(angle) * triRadius);
    trigramBlock.rotation.y = -angle + Math.PI / 2;

    const bars = trigramConfigs[tri];
    for (let level = 0; level < 3; level++) {
      const isYang = bars[level] === 1;
      const yOffset = (level - 1) * 3.5;
      if (isYang) {
        const barMesh = new THREE.Mesh(new THREE.BoxGeometry(9, 1.2, 1.5), trigramGlowMat);
        barMesh.position.set(0, yOffset, 0);
        trigramBlock.add(barMesh);
      } else {
        const half1 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.2, 1.5), trigramGlowMat);
        half1.position.set(-2.6, yOffset, 0);
        const half2 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.2, 1.5), trigramGlowMat);
        half2.position.set(2.6, yOffset, 0);
        trigramBlock.add(half1);
        trigramBlock.add(half2);
      }
    }
    trigramRingsGroup.add(trigramBlock);
  }
  furnaceGroup.add(trigramRingsGroup);
  scene.add(furnaceGroup);

  // -------------------------------------------------------------
  // Debris Group (爆炸碎片组 - 48 Polyhedral Bronze Shards)
  // -------------------------------------------------------------
  const debrisGroup = new THREE.Group();
  debrisGroup.name = 'debris-group';
  debrisGroup.position.set(0, 75, 0);
  debrisGroup.visible = false;

  interface DebrisShardData {
    mesh: THREE.Mesh;
    baseX: number;
    baseY: number;
    baseZ: number;
    baseRx: number;
    baseRy: number;
    baseRz: number;
    vx: number;
    vy: number;
    vz: number;
    vrx: number;
    vry: number;
    vrz: number;
  }
  const shards: DebrisShardData[] = [];

  const shardGeos = [
    new THREE.DodecahedronGeometry(1),
    new THREE.TetrahedronGeometry(1),
    new THREE.OctahedronGeometry(1),
    new THREE.IcosahedronGeometry(1),
  ];

  const shardBronzeMat = new THREE.MeshStandardMaterial({
    color: 0x3d5a52,
    emissive: 0x8b3a00,
    emissiveIntensity: 0.6,
    metalness: 0.8,
    roughness: 0.4,
  });

  for (let s = 0; s < 48; s++) {
    const geo = shardGeos[s % shardGeos.length];
    const shardMesh = new THREE.Mesh(geo, shardBronzeMat);

    // Initial spherical surface positions around cauldron
    const theta = rng() * Math.PI * 2;
    const phi = (rng() - 0.5) * Math.PI;
    const r = 48 + rng() * 10;
    const baseX = Math.cos(phi) * Math.cos(theta) * r;
    const baseY = Math.sin(phi) * r;
    const baseZ = Math.cos(phi) * Math.sin(theta) * r;

    const baseRx = rng() * Math.PI * 2;
    const baseRy = rng() * Math.PI * 2;
    const baseRz = rng() * Math.PI * 2;

    // Velocity vector: strong expansion outwards with forward push towards camera (+Z)
    const speed = 0.8 + rng() * 1.2;
    const norm = Math.hypot(baseX, baseY, baseZ) || 1;
    const vx = (baseX / norm) * speed + (rng() - 0.5) * 0.4;
    const vy = (baseY / norm) * speed * 0.8 + 0.3 * rng();
    const vz = (baseZ / norm) * speed + 0.8 + rng() * 0.7; // forward surge

    const vrx = (rng() - 0.5) * 8;
    const vry = (rng() - 0.5) * 8;
    const vrz = (rng() - 0.5) * 8;

    const scale = 5 + rng() * 14;
    shardMesh.scale.set(scale, scale, scale);
    shardMesh.position.set(baseX, baseY, baseZ);
    shardMesh.rotation.set(baseRx, baseRy, baseRz);

    debrisGroup.add(shardMesh);
    shards.push({
      mesh: shardMesh,
      baseX,
      baseY,
      baseZ,
      baseRx,
      baseRy,
      baseRz,
      vx,
      vy,
      vz,
      vrx,
      vry,
      vrz,
    });
  }
  scene.add(debrisGroup);

  // -------------------------------------------------------------
  // 4. 3D 空间飞星与金屑粒子 (Particle System)
  // -------------------------------------------------------------
  const particlesGroup = new THREE.Group();
  particlesGroup.name = 'particles-group';

  // A. Gold Powder (金箔粉末 - 600 particles)
  const goldCount = 600;
  const goldGeo = new THREE.BufferGeometry();
  const goldPos = new Float32Array(goldCount * 3);
  const goldColors = new Float32Array(goldCount * 3);
  const goldBaseX = new Float32Array(goldCount);
  const goldBaseY = new Float32Array(goldCount);
  const goldBaseZ = new Float32Array(goldCount);
  const goldSpeedY = new Float32Array(goldCount);
  const goldFreqX = new Float32Array(goldCount);
  const goldAmpX = new Float32Array(goldCount);

  for (let i = 0; i < goldCount; i++) {
    goldBaseX[i] = (rng() - 0.5) * 1600;
    goldBaseY[i] = rng() * 500 - 30;
    goldBaseZ[i] = (rng() - 0.5) * 1400;
    goldSpeedY[i] = 0.2 + rng() * 0.5;
    goldFreqX[i] = 0.01 + rng() * 0.02;
    goldAmpX[i] = 15 + rng() * 35;

    goldPos[i * 3] = goldBaseX[i];
    goldPos[i * 3 + 1] = goldBaseY[i];
    goldPos[i * 3 + 2] = goldBaseZ[i];

    // Shimmering imperial gold color
    goldColors[i * 3] = 0.95 + rng() * 0.05;
    goldColors[i * 3 + 1] = 0.8 + rng() * 0.15;
    goldColors[i * 3 + 2] = 0.2 + rng() * 0.2;
  }
  goldGeo.setAttribute('position', new THREE.BufferAttribute(goldPos, 3));
  goldGeo.setAttribute('color', new THREE.BufferAttribute(goldColors, 3));

  const goldMat = new THREE.PointsMaterial({
    size: 4.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const goldPoints = new THREE.Points(goldGeo, goldMat);
  goldPoints.name = 'gold-powder';
  particlesGroup.add(goldPoints);

  // B. Samadhi Fire Sparks (三昧真火飞星火苗 - 500 particles)
  const fireCount = 500;
  const fireGeo = new THREE.BufferGeometry();
  const firePos = new Float32Array(fireCount * 3);
  const fireColors = new Float32Array(fireCount * 3);
  const fireBaseX = new Float32Array(fireCount);
  const fireBaseY = new Float32Array(fireCount);
  const fireBaseZ = new Float32Array(fireCount);
  const fireSpeed = new Float32Array(fireCount);
  const fireTurbulence = new Float32Array(fireCount);

  for (let i = 0; i < fireCount; i++) {
    fireBaseX[i] = (rng() - 0.5) * 160;
    fireBaseY[i] = rng() * 180 + 30;
    fireBaseZ[i] = (rng() - 0.5) * 160;
    fireSpeed[i] = 1.0 + rng() * 2.5;
    fireTurbulence[i] = 0.02 + rng() * 0.03;

    firePos[i * 3] = fireBaseX[i];
    firePos[i * 3 + 1] = fireBaseY[i];
    firePos[i * 3 + 2] = fireBaseZ[i];

    // Fire gradient: red-orange to white-hot
    const heat = rng();
    fireColors[i * 3] = 1.0;
    fireColors[i * 3 + 1] = 0.2 + heat * 0.7;
    fireColors[i * 3 + 2] = heat > 0.8 ? 0.6 : 0.05;
  }
  fireGeo.setAttribute('position', new THREE.BufferAttribute(firePos, 3));
  fireGeo.setAttribute('color', new THREE.BufferAttribute(fireColors, 3));

  const fireMat = new THREE.PointsMaterial({
    size: 6.0,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const firePoints = new THREE.Points(fireGeo, fireMat);
  firePoints.name = 'fire-sparks';
  particlesGroup.add(firePoints);

  // C. Celestial Mist Particles (云雾微粒 - 400 particles)
  const mistCount = 400;
  const mistGeo = new THREE.BufferGeometry();
  const mistPos = new Float32Array(mistCount * 3);
  const mistColors = new Float32Array(mistCount * 3);
  const mistBaseX = new Float32Array(mistCount);
  const mistBaseY = new Float32Array(mistCount);
  const mistBaseZ = new Float32Array(mistCount);
  const mistPhase = new Float32Array(mistCount);

  for (let i = 0; i < mistCount; i++) {
    mistBaseX[i] = (rng() - 0.5) * 2400;
    mistBaseY[i] = -40 + rng() * 100;
    mistBaseZ[i] = -800 + rng() * 1600;
    mistPhase[i] = rng() * Math.PI * 2;

    mistPos[i * 3] = mistBaseX[i];
    mistPos[i * 3 + 1] = mistBaseY[i];
    mistPos[i * 3 + 2] = mistBaseZ[i];

    mistColors[i * 3] = 0.88;
    mistColors[i * 3 + 1] = 0.95;
    mistColors[i * 3 + 2] = 1.0;
  }
  mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
  mistGeo.setAttribute('color', new THREE.BufferAttribute(mistColors, 3));

  const mistMat = new THREE.PointsMaterial({
    size: 16.0,
    vertexColors: true,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const mistPoints = new THREE.Points(mistGeo, mistMat);
  mistPoints.name = 'mist-particles';
  particlesGroup.add(mistPoints);

  scene.add(particlesGroup);

  // -------------------------------------------------------------
  // Render Function (100% Deterministic)
  // -------------------------------------------------------------
  function render(state: FilmState) {
    // 1. Camera Projection & Transform
    camera.position.set(...state.cameraPosition);
    camera.lookAt(new THREE.Vector3(...state.cameraTarget));
    camera.fov = state.cameraFov;
    camera.rotation.z = state.cameraRoll;
    camera.updateProjectionMatrix();

    // 2. Lighting Updates
    ambientLight.intensity = 0.4 + state.intensity * 0.6;
    celestialSun.intensity = 1.0 + state.intensity * 0.8 + state.flash * 1.5;

    const fireActive = state.fire > 0.01;
    furnaceLight.intensity = state.fire * 4.0 + state.flash * 2.5;
    if (state.colorRelease > 0.1) {
      const hue = (state.frame * 3) % 360;
      furnaceLight.color.setHSL(hue / 360, 0.9, 0.6);
    } else {
      furnaceLight.color.setRGB(1.0, 0.4 + state.fire * 0.4, 0.05);
    }

    // 3. Cloud Sea Undulation
    const cloudSpeed = state.cloudSpeed > 0 ? state.cloudSpeed : 0.2;
    const wavePhase = state.frame * 0.025 * cloudSpeed;
    const cloudPos = cloudPosAttr.array as Float32Array;

    for (let i = 0; i < cloudVertexCount; i++) {
      const idx = i * 3;
      const bx = cloudBasePositions[idx];
      const bz = cloudBasePositions[idx + 2];
      const wave =
        Math.sin(bx * 0.0035 + wavePhase) * 22 +
        Math.cos(bz * 0.005 + wavePhase * 0.75) * 16 +
        Math.sin((bx + bz) * 0.002 + wavePhase * 1.2) * 10;
      cloudPos[idx + 1] = wave;
    }
    cloudPosAttr.needsUpdate = true;
    cloudSeaMat.opacity = Math.max(0.2, 0.85 - state.fog * 0.3);

    // Mid-cloud banks parallax drift
    cloudBanksGroup.position.x = -((state.frame * 0.6 * cloudSpeed) % 400);

    // 4. Nantianmen Visibility & Opacity
    const isHeavenScene =
      state.scene === 1 ||
      state.scene === 5 ||
      state.scene === 6 ||
      state.scene === 7 ||
      state.scene === 13 ||
      state.scene === 14 ||
      state.scene === 20 ||
      state.scene === 21 ||
      state.scene === 22 ||
      state.gateReveal > 0.02 ||
      state.palaceOpacity > 0.02;

    nantianmenGroup.visible = isHeavenScene;
    if (nantianmenGroup.visible) {
      const revealFactor = Math.max(state.gateReveal, state.palaceOpacity, state.scene === 1 ? 1 : 0);
      stepsGroup.position.y = (1 - Math.min(1, revealFactor)) * -80;
    }

    // 5. Eight Trigrams Furnace & Rings Rotation
    const isFurnaceScene =
      (state.scene >= 14 && state.scene <= 19) ||
      state.fire > 0.05 ||
      state.debris > 0.05;

    furnaceGroup.visible = isFurnaceScene;
    // Rotate trigram rings continuously and deterministically
    trigramRingsGroup.rotation.y = state.frame * 0.02;
    outerRing.rotation.z = state.frame * 0.01;
    innerRing.rotation.z = -state.frame * 0.015;

    // Color/Glow shift
    if (state.colorRelease > 0.05) {
      const ringHue = (state.frame * 2) % 360;
      trigramGlowMat.emissive.setHSL(ringHue / 360, 1.0, 0.55);
      trigramGlowMat.color.setHSL(ringHue / 360, 0.9, 0.6);
      trigramGlowMat.emissiveIntensity = 1.5 + state.colorRelease * 1.5;
    } else if (fireActive) {
      trigramGlowMat.emissive.setRGB(1.0, 0.3 + state.fire * 0.5, 0.05);
      trigramGlowMat.emissiveIntensity = 1.0 + state.fire * 2.0;
    } else {
      trigramGlowMat.emissive.setRGB(0.8, 0.3, 0.02);
      trigramGlowMat.emissiveIntensity = 0.5;
    }

    if (isFurnaceScene) {
      // If furnace is shattered in scene 19 "破炉", cauldron body shrinks or cracks
      if (state.debris > 0.4) {
        const shrink = Math.max(0.01, 1 - (state.debris - 0.4) * 1.8);
        cauldronBody.scale.set(shrink, shrink * 0.92, shrink);
        furnaceCore.scale.set(1.5 + state.debris * 2.0, 1.5 + state.debris * 2.0, 1.5 + state.debris * 2.0);
      } else {
        cauldronBody.scale.set(1, 0.92, 1);
        furnaceCore.scale.set(1, 1, 1);
      }
    }

    // 6. Debris Explosion Group
    if (state.debris > 0.01) {
      debrisGroup.visible = true;
      const d = state.debris;
      for (let s = 0; s < shards.length; s++) {
        const item = shards[s];
        item.mesh.position.set(
          item.baseX + item.vx * d * 1500,
          item.baseY + item.vy * d * 900,
          item.baseZ + item.vz * d * 2100
        );
        item.mesh.rotation.set(
          item.baseRx + item.vrx * d * 18,
          item.baseRy + item.vry * d * 18,
          item.baseRz + item.vrz * d * 18
        );
      }
    } else {
      debrisGroup.visible = false;
    }

    // 7. Particle Motion (100% Deterministic)
    // Gold powder
    const goldPositions = goldGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < goldCount; i++) {
      const idx = i * 3;
      const curY = ((goldBaseY[i] + state.frame * goldSpeedY[i]) % 540) - 40;
      const curX = goldBaseX[i] + Math.sin(state.frame * goldFreqX[i]) * goldAmpX[i];
      const curZ = goldBaseZ[i] + Math.cos(state.frame * goldFreqX[i] * 0.7) * (goldAmpX[i] * 0.6);
      goldPositions[idx] = curX;
      goldPositions[idx + 1] = curY;
      goldPositions[idx + 2] = curZ;
    }
    goldGeo.attributes.position.needsUpdate = true;

    // Fire sparks
    const firePositions = fireGeo.attributes.position.array as Float32Array;
    const fireMult = 1.0 + state.fire * 2.5;
    for (let i = 0; i < fireCount; i++) {
      const idx = i * 3;
      const curY = ((fireBaseY[i] + state.frame * fireSpeed[i] * fireMult) % 360) + 20;
      const curX = fireBaseX[i] + Math.sin(state.frame * fireTurbulence[i] + i) * (20 + state.fire * 40);
      const curZ = fireBaseZ[i] + Math.cos(state.frame * fireTurbulence[i] + i) * (20 + state.fire * 40);
      firePositions[idx] = curX;
      firePositions[idx + 1] = curY;
      firePositions[idx + 2] = curZ;
    }
    fireGeo.attributes.position.needsUpdate = true;
    fireMat.opacity = Math.min(1.0, 0.4 + state.fire * 0.6);

    // Mist particles
    const mistPositions = mistGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < mistCount; i++) {
      const idx = i * 3;
      const curX = mistBaseX[i] + Math.sin(state.frame * 0.01 + mistPhase[i]) * 40;
      const curZ = mistBaseZ[i] - ((state.frame * 0.5 * cloudSpeed) % 600);
      mistPositions[idx] = curX;
      mistPositions[idx + 2] = curZ;
    }
    mistGeo.attributes.position.needsUpdate = true;

    // 8. Final Three.js Render
    renderer.render(scene, camera);
  }

  // -------------------------------------------------------------
  // Resize Handler
  // -------------------------------------------------------------
  function resize(width: number, height: number) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // -------------------------------------------------------------
  // Dispose Handler
  // -------------------------------------------------------------
  function dispose() {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).geometry) {
        (obj as THREE.Mesh).geometry.dispose();
      }
      if ((obj as THREE.Mesh).material) {
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else {
          mat.dispose();
        }
      }
    });
    renderer.dispose();
  }

  return {
    render,
    resize,
    dispose,
    scene,
    camera,
    renderer,
  };
}
