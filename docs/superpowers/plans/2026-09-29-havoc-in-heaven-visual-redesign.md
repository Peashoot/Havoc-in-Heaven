# 《大闹天宫》视觉重构与 Three.js 3D 运镜系统实施计划 (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 1961 年万籁鸣先生经典《大闹天宫》国风美学，全面重构 22 幕动画的孙悟空五阶段换装造型、神话建筑与粒子动效，并引入 Three.js 构建 3D 运镜与天宫/八卦炉空间。

**Architecture:** 维持 1920 × 1080 固定物理分辨率分层舞台。由 `timeline.ts` 确定性输出包含 3D 相机矩阵、换装阶段与动作参数的 `FilmState`；新增 `film3d.ts`（Three.js WebGL）渲染 3D 云海、南天门与八卦炉；重构 `actors.ts`（SVG）实现高精度上美影心形脸谱与五套战服；升级 `filmCanvas.ts`/`effects.ts` 强化弧光与冲击波；在 `main.ts` 中完成 3D 与 2D 的统一调度。

**Tech Stack:** TypeScript, Vite, Three.js (`three` + `@types/three`), SVG, HTML5 Canvas 2D, Node.js Native Test Runner, Playwright.

## Global Constraints

- 严格保持 1920 × 1080 内部舞台物理分辨率（16:9 比例）；
- 严格遵循 30 fps、全片 105 秒、共 3150 帧（0–3149）；
- 核心渲染必须 100% 确定性（Deterministic），以唯一 `frameNumber` 为输入，禁止内部不受控累积时钟；
- 必须保持 `window.renderFrame(frameNumber)` 全局接口及 DOM `#stage[data-frame]` 属性更新，确保 Playwright 离线导出脚本与 FFmpeg 渲染兼容；
- 代码必须通过 `tsc --noEmit`、`vite build` 及 `npm test`。

---

### Task 1: 引入 Three.js 依赖与基础舞台容器改造

**Files:**
- Modify: `package.json`
- Modify: `index.html:11-20`
- Modify: `src/style.css:5-18`

**Interfaces:**
- Consumes: npm package registry
- Produces: `#webgl-stage` DOM 节点及相关 CSS 层级样式，供后续 3D 渲染器绑定

- [ ] **Step 1: 安装 three 及 @types/three 依赖**

Run:
```bash
npm install three @types/three
```

- [ ] **Step 2: 修改 index.html 增加 #webgl-stage 画布**

在 `index.html` 中的 `#stage` 内，`#backdrop` 下方插入 `<canvas id="webgl-stage" width="1920" height="1080"></canvas>`：
```html
<main id="stage" aria-label="大闹天宫动画短片">
  <canvas id="backdrop" width="1920" height="1080"></canvas>
  <canvas id="webgl-stage" width="1920" height="1080"></canvas>
  <div id="world"></div>
  <canvas id="atmosphere" width="1920" height="1080"></canvas>
  <div id="darkness"></div>
  <div id="actors"></div>
  <canvas id="effects" width="1920" height="1080"></canvas>
  <div id="final-title" aria-hidden="true">...</div>
  <div id="flash"></div>
  <div id="vignette"></div>
  <div id="letterbox-top"></div>
  <div id="letterbox-bottom"></div>
</main>
```

- [ ] **Step 3: 修改 src/style.css 完善 z-index 层级**

在 `src/style.css` 中为 `#webgl-stage` 配置绝对定位与 z-index：
```css
#stage canvas, #world, #actors, #darkness, #final-title, #flash, #vignette {
  position: absolute;
  inset: 0;
  width: 1920px;
  height: 1080px;
}
#backdrop { z-index: 0; }
#webgl-stage { z-index: 1; pointer-events: none; }
#world { z-index: 2; transform-origin: 960px 620px; }
#atmosphere { z-index: 3; pointer-events: none; }
#darkness { z-index: 4; pointer-events: none; background: #070b12; opacity: 0; }
#actors { z-index: 5; pointer-events: none; }
#effects { z-index: 6; pointer-events: none; }
#final-title { z-index: 7; pointer-events: none; opacity: 0; transform-origin: 960px 390px; filter: drop-shadow(0 8px 17px rgba(0, 0, 0, .9)); }
#flash { z-index: 8; pointer-events: none; background: #fff1c8; opacity: 0; mix-blend-mode: screen; }
#vignette { z-index: 9; pointer-events: none; background: radial-gradient(ellipse 73% 72% at 52% 52%, transparent 29%, rgba(5, 6, 11, .12) 65%, rgba(2, 3, 7, .75) 100%); }
#letterbox-top, #letterbox-bottom { position: absolute; left: 0; width: 100%; height: 58px; z-index: 10; background: #06070a; }
```

- [ ] **Step 4: 校验编译通过**

Run: `npm run build`  
Expected: `✓ built in ...` 成功生成生产产物。

---

### Task 2: 扩展时间轴状态机与 3D 运镜参数 (`src/timeline.ts` & `src/timeline.test.ts`)

**Files:**
- Modify: `src/timeline.ts`
- Modify: `src/timeline.test.ts`

**Interfaces:**
- Consumes: 帧编号 `frameNumber: number`
- Produces: 扩展后的 `FilmState`，包含：
  - `costumeStage: 'pilgrim' | 'monkeyKing' | 'bima' | 'greatSage' | 'furnaceGold'`
  - `featherAngle: number` (双翎晃动角)
  - `cameraPosition: [number, number, number]` (3D 相机位置 [x, y, z])
  - `cameraTarget: [number, number, number]` (3D 目标视点 [x, y, z])
  - `cameraFov: number` (透视视场角)
  - `cameraRoll: number` (镜头翻滚角)

- [ ] **Step 1: 编写新增测试用例 (Red)**

在 `src/timeline.test.ts` 中新增针对 3D 相机与换装阶段的测试：
```typescript
test('costumeStage accurately reflects the narrative journey across 22 scenes', () => {
  assert.equal(filmState(160).costumeStage, 'pilgrim');     // Scene 2: 漂洋过海
  assert.equal(filmState(300).costumeStage, 'pilgrim');     // Scene 3: 三星洞求道
  assert.equal(filmState(450).costumeStage, 'monkeyKing');  // Scene 4: 花果山自由
  assert.equal(filmState(720).costumeStage, 'bima');        // Scene 6: 弼马温
  assert.equal(filmState(1000).costumeStage, 'bima');       // Scene 8: 蟠桃会
  assert.equal(filmState(1120).costumeStage, 'monkeyKing'); // Scene 10: 归山
  assert.equal(filmState(1550).costumeStage, 'greatSage');  // Scene 12: 第一棒
  assert.equal(filmState(2300).costumeStage, 'furnaceGold');// Scene 17: 炉火
  assert.equal(filmState(2700).costumeStage, 'greatSage');  // Scene 20: 打入凌霄殿
});

test('3d camera coordinates, target, fov, roll, and featherAngle are finite and valid in all frames', () => {
  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const s = filmState(frame);
    assert.equal(s.cameraPosition.length, 3);
    assert.equal(s.cameraTarget.length, 3);
    assert.ok(s.cameraPosition.every(Number.isFinite), `frame ${frame} cameraPosition`);
    assert.ok(s.cameraTarget.every(Number.isFinite), `frame ${frame} cameraTarget`);
    assert.ok(Number.isFinite(s.cameraFov), `frame ${frame} cameraFov`);
    assert.ok(Number.isFinite(s.cameraRoll), `frame ${frame} cameraRoll`);
    assert.ok(Number.isFinite(s.featherAngle), `frame ${frame} featherAngle`);
  }
});
```

- [ ] **Step 2: 运行测试验证失败**

Run: `npm test`  
Expected: FAIL 提示 `costumeStage is undefined` 或 `cameraPosition is undefined`。

- [ ] **Step 3: 在 src/timeline.ts 中实现扩展属性与 22 幕 3D 运镜算法**

在 `src/timeline.ts` 中：
1. 导出 `CostumeStage` 类型；
2. 在 `FilmState` 中添加 `costumeStage`、`featherAngle`、`cameraPosition`、`cameraTarget`、`cameraFov`、`cameraRoll`；
3. 根据各幕场景计算三维运镜轨迹：
   - Scene 1 & 5：从 `[0, 300, 1500]` 俯冲推近至 `[0, 50, 450]`，目标 `[0, 80, 0]`；
   - Scene 2：横向长卷跟踪机位 `[lerp(-500, 500, p), 80, 600]`；
   - Scene 4 & 13：以大圣为中心做 180° 动态环绕：`[Math.sin(p * Math.PI) * 500, 120, Math.cos(p * Math.PI) * 500]`；
   - Scene 11：低机位大广角仰拍 `[0, 15, 300]`，目标 `[0, 200, -100]`，FOV 65°；
   - Scene 17–19：炉膛特写推至八卦炉外爆炸震屏拉远；
   - Scene 20–22：跟随金箍棒旋转做高速摇臂变焦。
4. 根据分镜阶段计算 `costumeStage`：
   - Scene 2, 3: `'pilgrim'`
   - Scene 4, 10: `'monkeyKing'`
   - Scene 5, 6, 7, 8, 9: `'bima'`
   - Scene 11, 12, 13, 20, 21, 22: `'greatSage'`
   - Scene 14, 15, 16, 17, 18, 19: `'furnaceGold'`
5. 计算 `featherAngle`: `Math.sin(p * Math.PI * 6 + s.heroRotation * 0.1) * 18 * (s.costumeStage === 'greatSage' ? 1 : 0)`。

- [ ] **Step 4: 运行测试验证全部通过 (Green)**

Run: `npm test`  
Expected: PASS，全套 10 个测试用例全部通过。

---

### Task 3: 重构上美影风格核心角色与五阶段换装系统 (`src/actors.ts`)

**Files:**
- Modify: `src/actors.ts`

**Interfaces:**
- Consumes: `FilmState`（包含 `costumeStage`, `heroX`, `heroY`, `heroScale`, `heroRotation`, `featherAngle`, `staffAngle`, `staffGlow`, `eyeGlow` 等）
- Produces: `actorsSvg(): string` 及 `updateActors(state: FilmState, root: HTMLElement): void`

- [ ] **Step 1: 构建上美影经典心形面容与头饰组件**

在 `src/actors.ts` 中构建高精度工笔矢量部件：
1. **美猴王面部 (`wukongHead`)**：
   - 心形外红轮廓：优雅的京剧红脸彩绘轮廓；
   - 内层白底：细腻的肉白/暖玉色面底；
   - 灵动金睛：金色虹膜 (`#ffd54f`) + 墨色瞳孔 + 高光反光点，外挂 `#eyeGlow` 滤镜；
   - 戏曲倒八字飞扬眉峰、猴王灵耳与侧鬓金棕色细密鬃毛。
2. **双翎凤翅紫金冠 (`phoenixCrown`)**：
   - 紫金嵌宝冠托；
   - 两根优雅上翘向后弯曲的**细长雉鸡双翎**，使用贝塞尔曲线绘制，随 `state.featherAngle` 柔韧摆动。

- [ ] **Step 2: 构建五套剧情换装组件**

1. **求学布衣 (`costumePilgrim`)**：粗布青灰斜襟长袍、麻绳系带、布扎发髻；
2. **美猴王常服 (`costumeMonkeyKing`)**：上美影最经典的鹅黄色上衣、虎皮斜围裙（带黑色斑纹与红绒缘边）、翠绿色轻盈飘逸领巾、大红灯笼中裤与皂色黑靴；
3. **弼马温官袍 (`costumeBima`)**：浅绯色补服、带展翅的乌纱小官帽，腰挂马鞭；
4. **齐天大圣神甲 (`costumeGreatSage`)**：金色山字甲与兽面吞头胸甲、明光护膊、大红织锦战袍与大红色飘扬披风；
5. **八卦炉受炼与涅槃态 (`costumeFurnaceGold`)**：焦墨战袍破损轮廓，双眼带耀眼金色金光束（`eyeRays`），周身环绕金焰。

- [ ] **Step 3: 重构如意金箍棒与天兵天将群像**

1. **如意金箍棒**：两端带有精美云龙回纹金箍，中间段为深墨玄铁（挥击时高亮为炽金色光柱），带有半月弧形光晕；
2. **天兵天将群像 (`soldierSvg`)**：重绘为身披银白玄铁明光甲、戴凤翅战盔、手执丈二红缨枪的神将形象，列阵与被击飞姿态生动自然。

- [ ] **Step 4: 编写 updateActors 状态绑定逻辑**

根据 `state.costumeStage` 动态切换 `#costume-pilgrim`、`#costume-monkey`、`#costume-bima`、`#costume-greatsage`、`#costume-furnace` 的显示与透明度；联动披风、翎羽与金箍棒的姿态变换。

- [ ] **Step 5: 验证编译通过**

Run: `npm run build && npm test`  
Expected: 类型检查与测试全部通过。

---

### Task 4: 构建 Three.js 3D 神话空间与运镜渲染器 (`src/film3d.ts`)

**Files:**
- Create: `src/film3d.ts`

**Interfaces:**
- Consumes: `FilmState`
- Produces: `initFilm3D(canvas: HTMLCanvasElement): { render: (state: FilmState) => void; dispose: () => void }`

- [ ] **Step 1: 编写 src/film3d.ts 骨架与材质系统**

引入 Three.js 核心对象，创建 WebGLRenderer（带抗锯齿与 alpha 透明度），配置非真实感国风材质（ToonMaterial / MeshStandardMaterial 与金石色谱）：
```typescript
import * as THREE from 'three';
import type { FilmState } from './timeline';

export interface Film3D {
  render: (state: FilmState) => void;
  resize: (width: number, height: number) => void;
}
```

- [ ] **Step 2: 搭建 3D 神话空间资产**

1. **万顷云海 (3D Cloud Sea)**：
   - 使用多层起伏波浪几何体与半透明水墨贴图网格，随 `state.frame` 和 `cloudSpeed` 产生深邃的云层视差波动；
2. **3D 南天门与天宫殿柱 (Nantianmen & Dragon Columns)**：
   - 建立高耸汉白玉天阶台基；
   - 左右两根盘绕金龙浮雕的巍峨巨柱；
   - 顶部重檐庑殿金顶与琉璃飞檐，金光流转；
3. **3D 八卦炉 (Eight Trigrams Furnace)**：
   - 三足两耳青铜浑圆巨炉；
   - 环绕炉身的八卦卦象光环，带发光发热材质；
   - 爆炸碎片组（Debris Group）：炉身碎裂后的几十块三维多面体青铜残片，随 `state.debris` 轨迹向镜头外高速散落穿透；
4. **3D 空间飞星与金屑粒子 (Particle System)**：
   - 漂浮的金箔粉末、三昧真火飞星火苗、云雾微粒。

- [ ] **Step 3: 实现根据 FilmState 确定性驱动相机的 render 函数**

```typescript
export function initFilm3D(canvas: HTMLCanvasElement): Film3D {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(1920, 1080);
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1920 / 1080, 1, 10000);

  // 构建场景资产...
  return {
    render(state: FilmState) {
      camera.position.set(...state.cameraPosition);
      camera.lookAt(new THREE.Vector3(...state.cameraTarget));
      camera.fov = state.cameraFov;
      camera.rotation.z = state.cameraRoll;
      camera.updateProjectionMatrix();

      // 更新 3D 物体姿态、粒子透明度、碎屑扩散...
      renderer.render(scene, camera);
    },
    resize(w, h) { renderer.setSize(w, h); }
  };
}
```

- [ ] **Step 4: 验证编译通过**

Run: `npm run build`  
Expected: `✓ built in ...` 成功编译无错误。

---

### Task 5: 重绘 22 幕 2D 场景建筑与工笔艺术 (`src/sceneArtwork.ts`)

**Files:**
- Modify: `src/sceneArtwork.ts`

**Interfaces:**
- Consumes: `scene: number`
- Produces: `sceneArtwork(scene: number): string`（返回对应场景的高精度 SVG 字符串）

- [ ] **Step 1: 升级花果山仙境与求学长卷 (Scene 1–4)**

1. 重绘青绿金碧水墨山峦、灵芝仙草与苍劲古松；
2. 还原破浪木排与竹篙缆绳细节；
3. 三星洞青石山门与竹影婆娑石阶。

- [ ] **Step 2: 升级天宫金阙、御马厩与蟠桃盛宴 (Scene 5–10)**

1. 天宫南天门雕栏玉砌与冷金御阶；
2. 弼马温御马监天马腾空群影；
3. 蟠桃大会盛宴：雕花红木长案、九千年大蟠桃、金樽玉盏、散落九转金丹葫芦。

- [ ] **Step 3: 升级天兵压境、斩妖台与八卦炉空间 (Scene 11–19)**

1. 遮天蔽日的万重黑云与金光裂缝；
2. 斩妖台玄铁雷火锁链与暗金刑柱；
3. 八卦炉内部三昧真火符文阵与外壁金光破损裂纹。

- [ ] **Step 4: 升级凌霄宝殿与终极五彩释放 (Scene 20–22)**

1. 凌霄宝殿盘龙金柱倾倒断裂的震撼场景；
2. 五彩神光迸发轨迹与彩霞绸带；
3. 验证 22 幕全部涵盖，无任何缺失。

- [ ] **Step 5: 验证编译与测试**

Run: `npm run build && npm test`  
Expected: 全部测试通过，构建成功。

---

### Task 6: 升级 Canvas 动态特效与金箍棒光刃 (`src/filmCanvas.ts` & `src/effects.ts`)

**Files:**
- Modify: `src/filmCanvas.ts`
- Modify: `src/effects.ts`

**Interfaces:**
- Consumes: `FilmState`
- Produces: `drawFilmAtmosphere(ctx, state)`, `drawEffects(ctx, state)`

- [ ] **Step 1: 升级金箍棒半月弧光斩痕 (Motion Arc Trails)**

在 `src/effects.ts` 中根据 `state.staffAngle` 和 `state.staffGlow`，使用贝塞尔曲线绘制厚重且带流光渐变的金色弧月残影（Golden Crescent Trails），挥棒时极具打击力量感。

- [ ] **Step 2: 升级第一棒与大闹天宫冲击波 (Shockwaves)**

绘制自金箍棒落点向外扩散的金色环状墨浪冲击波，夹带飞溅的金屑火花；在第 1612、1613 帧触发纯白定格。

- [ ] **Step 3: 升级三昧真火与五彩霞光流体**

在 `src/filmCanvas.ts` 中升级炉火粒子与五彩灵光，使暗红、赤橙、金黄、青绿、紫蓝的流体光带在八卦炉爆发时如江河奔涌般释放。

- [ ] **Step 4: 验证编译与测试**

Run: `npm run build && npm test`  
Expected: 构建成功且测试通过。

---

### Task 7: 统一调度中枢集成与全管线贯通 (`src/main.ts`)

**Files:**
- Modify: `src/main.ts`

**Interfaces:**
- Consumes: `filmState`, `initFilm3D`, `updateActors`, `sceneArtwork`, `drawFilmAtmosphere`, `drawEffects`
- Produces: 贯通的 `window.renderFrame(frameNumber)` 全局调用及播放循环

- [ ] **Step 1: 初始化 3D 渲染器并在 renderFrame 中协同调用**

在 `src/main.ts` 中初始化 `film3d = initFilm3D(document.querySelector('#webgl-stage')!)`，在 `renderFrame(frameNumber)` 中依次执行：
1. `const state = filmState(frameNumber);`
2. 场景切换与 2D SVG 艺术品更新 `updateArtwork(state)`；
3. 3D WebGL 渲染 `film3d.render(state)`；
4. 2D 角色造型与五阶段换装更新 `updateActors(state, actors)`；
5. 2D 氛围与特效 Canvas 绘制；
6. 黑暗遮罩、白闪、终幕书法标题及 `#stage[data-frame]` 属性更新。

- [ ] **Step 2: 验证单帧精确定位功能**

启动开发服务器并在不同阶段抽样检查关键帧：
- Frame 75 (Scene 1: 云海天宫)
- Frame 200 (Scene 2: 木筏求学布衣)
- Frame 480 (Scene 4: 花果山美猴王常服)
- Frame 750 (Scene 6: 弼马温官袍)
- Frame 1050 (Scene 8: 蟠桃会大醉)
- Frame 1600 (Scene 12: 齐天大圣战甲第一棒)
- Frame 2300 (Scene 17: 八卦炉烈火金睛)
- Frame 2550 (Scene 19: 破炉五彩爆发)
- Frame 3100 (Scene 22: 片尾书法标题)

- [ ] **Step 3: 验证全套自动化测试通过**

Run: `npm test`  
Expected: 100% 测试通过。

---

### Task 8: 离线视频导出脚本验证与最终验收

**Files:**
- Test: `scripts/export-frames.mjs`
- Test: `scripts/render-mp4.mjs`

- [ ] **Step 1: 运行类型检查与生产构建**

Run: `npm run build`  
Expected: 退出码 0，无任何 TypeScript 报错。

- [ ] **Step 2: 抽样导出指定区段 PNG 帧并检查画质**

Run:
```bash
node scripts/export-frames.mjs --start 1600 --end 1620
```
Expected: 成功在 `frames/` 中导出高清 PNG，包含第一棒金箍棒弧光、两帧白闪与天兵震散画面。

- [ ] **Step 3: 检查生成的帧画面完整性与 3D 景深层次**

检查导出的图片无空白、无残缺，3D 云海与人物层次鲜明。
