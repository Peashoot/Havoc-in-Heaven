# 《大闹天宫》视觉重构与 Three.js 3D 运镜系统设计规范 (Design Spec)

**文档编号**：2026-09-29-havoc-in-heaven-visual-redesign-design  
**状态**：已批准 (Approved)  
**作者**：Claude Code & User  
**日期**：2026-09-29  

---

## 1. 项目背景与重构目标

现有页面中的图形由简陋的多边形几何块构成，缺乏传统中国神话美学与戏曲神韵，孙悟空角色造型扁平生硬，各镜头缺乏景深与机位透视变化。

本次重构旨在：
1. **致敬经典上美影国风神韵**：以 1961 年万籁鸣先生经典动画《大闹天宫》为视觉基准，深度还原红白心形猴脸谱、金睛火眼、双雉翎羽紫金冠、鹅黄衣、虎皮裙与京剧武生身段。
2. **剧情分段角色换装演变**：打破全片单一装束，实现“求道布衣 → 花果山美猴王常服 → 弼马温官服/御酒散发 → 齐天大圣披甲战袍 → 八卦炉受炼涅槃”的五阶段服装道具动态演化。
3. **引入 Three.js 3D 电影级运镜**：利用 WebGL 构建三维天宫云海、南天门盘龙柱、八卦炉及崩塌空间，实现真实 3D 相机俯冲、环绕跟拍、穿云过门与爆炸破屏视角切换。
4. **全片 22 幕（105 秒 / 3150 帧）确定性渲染**：保持以唯一 `frameNumber`（0–3149）为绝对输入的确定性渲染管线，无缝兼容 `window.renderFrame()`、Playwright 离线无损截图与 FFmpeg MP4 导出。

---

## 2. 总体架构与渲染分层

舞台依旧维持固定 1920 × 1080 内部物理分辨率，通过 `#stage` 等比缩放适应屏幕。内部按 z-index 分层渲染：

```
#stage (1920 × 1080, overflow: hidden)
├── #backdrop         (Canvas 2D, z=0): 远景天空色阶渐变与天象底色
├── #webgl-stage      (Three.js WebGLRenderer, z=1): 3D 空间、3D南天门、3D云海起伏、3D八卦炉、3D天宫殿柱与3D空间飞星粒子
├── #world            (SVG, z=2): 2D 工笔重彩场景雕栏、门楼装饰、水墨山峦剪影
├── #atmosphere       (Canvas 2D, z=3): 2D 流动雾气、海浪水纹、暴雨水气
├── #darkness         (DOM div, z=4): 电影级景深遮光暗幕与黑场过渡
├── #actors           (SVG, z=5): 孙悟空高精细工笔立绘（脸谱、身段姿态、换装部件）、如意金箍棒、天兵天将阵列
├── #effects          (Canvas 2D, z=6): 金箍棒半月光刃残影、打击电光火石、泼墨气浪、碎屑冲击波
├── #final-title      (SVG, z=7): 终幕“大闹天宫”金色书法片名
├── #flash            (DOM div, z=8): 瞬间白光/金光闪屏 (White Flash Frames)
└── #vignette/letterbox (CSS, z=9): 胶片暗角与上下宽荧幕遮幅
```

---

## 3. 孙悟空角色造型与五阶段换装系统 (`src/actors.ts`)

### 3.1 经典面部神韵（全阶段统一）
- **心形脸谱**：朱红外缘、纯白内底的心形猴面，搭配灵动眼眶弧度；
- **金睛火眼**：明亮金黄色高光眼瞳（`#ffd700`），外圈深墨色轮廓，Scene 18 之后带外发光金焰光束；
- **戏曲墨眉与双颊**：两道斜指额角的倒八字扬眉，神采飞扬；
- **猴王发毛与双耳**：金棕与茶褐色相间、富有弹性的鬃毛与灵耳轮廓。

### 3.2 五阶段剧情换装规划
1. **Stage 1: 求道行者（Scene 2–3）**
   - 服饰：素青/玄灰右衽粗布道袍，腰束素麻布带；
   - 姿势：木筏执长篙破风浪，三星洞阶前拱手求仙、轻盈纵身跃云。
2. **Stage 2: 花果山美猴王（Scene 4, 10）**
   - 服饰：明黄/鹅黄小对襟短衫、斑斓斜披虎皮围裙、翠绿轻薄飘逸领巾、大红灯笼中裤与皂色黑靴；
   - 姿势：手搭凉棚探望天地、踞坐仙石自在饮宴、率众猴嬉戏腾跃。
3. **Stage 3: 弼马温与蟠桃客（Scene 6–9）**
   - 弼马温：浅绯色官袍、长翅乌纱小梁冠、手提马鞭，漫游云端天马之间；
   - 蟠桃会：得知未受邀后扯碎乌纱散开金发，斜倚蟠桃长桌狂饮琼浆，踢翻金樽玉露。
4. **Stage 4: 齐天大圣神甲（Scene 11–13, 20–22）**
   - 服饰：**凤翅紫金冠**（两根自额顶拔起的高挑双翎雉鸡翎，带随动物理摆动）、**锁子黄金甲**（胸背兽面吞云、肩披明光甲片、腰围束甲红锦）、**大红战袍长披风**；
   - 兵刃：**如意金箍棒**，两端九曲蟠龙回纹赤金箍，中间墨色精铁，挥舞时呼啸生辉。
5. **Stage 5: 炉火涅槃金身（Scene 14–19）**
   - 受刑：绑于斩妖台金柱，战袍破损焦暗，金箍棒斜插尘埃，眼神孤傲倔强；
   - 炼炉：暗黑炉膛中烈焰升腾，身躯静坐蓄势，由暗红逐级转为璀璨五彩神焰；
   - 破炉：双目金光贯顶，破炉裂甲冲天，金箍棒呼啸破空旋转归手！

---

## 4. Three.js 3D 空间架构与运镜系统 (`src/film3d.ts`)

### 4.1 核心 3D 场景元素
1. **3D 万顷云海 (Volumetric Cloud Sea)**：多层带有水墨噪波与非真实感材质的 3D 云浪几何体，具有纵向深远厚度；
2. **3D 南天门与天宫重檐 (Nantianmen & Palace)**：汉唐歇山重檐、斗拱榫卯、盘龙玉柱、汉白玉天阶与高耸金阙；
3. **3D 八卦炉 (Eight Trigrams Furnace)**：青铜三足巨炉、环绕八卦卦象圆环（乾坎艮震巽离坤兑）、裂痕动态发光材质与受击粉碎几何碎片；
4. **3D 空间粒子流**：飞金碎屑（Gold Dust）、三昧真火流火（Embers）、崩落天宫巨石。

### 4.2 3D 相机与电影机位切换控制
在 `FilmState` 中统一注入：
* `cameraPosition: [number, number, number]`
* `cameraTarget: [number, number, number]`
* `cameraFov: number`
* `cameraRoll: number`

典型 3D 镜头调度设计：
* **Scene 1 & 5**：高空俯冲穿云镜头，FOV 50° 迅速推近至南天门脚下；
* **Scene 4 & 13**：围绕大圣的 180° 动态环绕跟拍（Orbital Tracking），产生强烈背景视差；
* **Scene 11**：贴近地面 75° 超低仰视角度，将天兵阵列的万重枪林收纳于苍穹；
* **Scene 17–19**：八卦炉内第一视角/近景金色光束，炸裂时拉升 3D 镜头并令碎片穿透屏幕（Whip Zoom Out）；
* **Scene 20–22**：跟随金箍棒旋转弧面的电影摇臂运镜（Crane Shot）。

---

## 5. 时间轴与状态机契约 (`src/timeline.ts`)

`filmState(frameNumber: number): FilmState` 保持单向纯函数：
- 输入：`frameNumber`（严格 clamp 在 `0` 至 `TOTAL_FRAMES - 1`，即 `0..3149`）；
- 输出：完整的 3D 运镜参数、当前场景编号（1–22）、进度 `progress`（0–1）、角色服装阶段枚举（`costumeStage`）、金箍棒变换、眼部金光度、震屏、白闪及色彩体系。

```typescript
export type CostumeStage = 'pilgrim' | 'monkeyKing' | 'bima' | 'greatSage' | 'furnaceGold';

export interface FilmState {
  // 基础与时间
  frame: number;
  seconds: number;
  scene: SceneNumber;
  sceneName: string;
  progress: number;

  // 3D 镜头参数
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cameraFov: number;
  cameraRoll: number;

  // 2D 辅助机位与震屏
  cameraScale: number;
  cameraX: number;
  cameraY: number;
  shake: number;

  // 角色系统
  heroX: number;
  heroY: number;
  heroScale: number;
  heroRotation: number;
  costumeStage: CostumeStage;
  capeAngle: number;
  featherAngle: number; // 凤翅双翎摆动
  staffAngle: number;
  staffGlow: number;
  staffVisible: number;
  eyeGlow: number;

  // 阵列与动态
  soldierReveal: number;
  soldierScatter: number;
  shockwave: number;
  debris: number;
  darkness: number;
  flash: number;
  titleOpacity: number;

  // 色彩与特效
  palette: Palette;
  intensity: number;
  fog: number;
  rain: number;
  fire: number;
  colorRelease: number;
}
```

---

## 6. 验证与质量保证 (Testing & Verification)

1. **确定性测试 (`npm test`)**：
   - 验证 3150 帧中所有数值（包括新增的 3D 坐标、FOV、角色姿态）均为有限数值（Finite）；
   - 验证无缝覆盖 22 个分镜时间段，场景跳转平滑连续；
   - 验证特定关键帧（如第 1612、1613 帧白闪、第 18 幕睁眼、第 22 幕标题浮现）严格吻合。
2. **构建类型检查 (`npm run build`)**：
   - 保持 TypeScript 严格类型检查无报错，Vite 正常打包。
3. **视觉截帧抽查 (`node scripts/export-frames.mjs --start 900 --end 929`)**：
   - 验证 Playwright 在无头 Chromium 环境下加载 Three.js WebGL 与 SVG 图层并正确截取 1920 × 1080 图像。
4. **视频渲染检查 (`npm run render:mp4`)**：
   - 验证流式管道送入 FFmpeg 压制 MP4 的无卡顿与色彩还原。
