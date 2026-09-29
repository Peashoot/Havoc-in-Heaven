# 《大闹天宫》影视级 Motion Graphics 重构实施计划 (Implementation Plan)

**Goal:** 彻底消除网页/PPT 感，依据西游记原著与动漫视听语言，重构 22 幕动画的景深层次（前/中/远景 + Parallax）、角色动作身段（前摇/爆发/回弹）与影视级动效。

**Architecture:** 
1. `src/timeline.ts`: 引入非线性动力学缓动函数族（`anticipate`, `overshoot`, `expoOut`），重构各幕时间轴插值；
2. `src/actors.ts`: 重塑具有真实武生身段、张力肢体、握棒手势与起伏战袍的孙悟空及重装天兵天将；
3. `src/sceneArtwork.ts`: 彻底重构场景艺术，加入镜头前景遮挡画框（巨大龙柱、松柏悬藤、崩塌金砖）与层次分明的工笔青绿远景，消除简单几何形状；
4. `src/effects.ts` & `src/filmCanvas.ts`: 增加动漫冲击速度线、金箍棒弯月弧光残影与飞溅碎石；
5. `src/main.ts`: 协同驱动三层视差位移（Foreground 1.4x, Midground 1.0x, Background 0.2x）与镜头推拉震颤。

**Tech Stack:** TypeScript, Vite, Three.js, SVG, Canvas 2D, Node.js Test Runner, Playwright.

---

### Task 1: 动力学缓动系统与时间轴重构 (`src/timeline.ts`)
- [ ] 导出 `anticipate(t)`, `overshoot(t)`, `expoOut(t)` 等非线性动力学函数；
- [ ] 重构 22 幕中的进度推进，使动作具备蓄力后撤、瞬间闪击与击中回弹；
- [ ] 强化摄像机动态推拉幅度（`cameraScale`, `cameraX`, `cameraY`, `shake`）；
- [ ] 更新 `src/timeline.test.ts`，保证所有数值有限且测试 100% 通过。

### Task 2: 角色人体身段与动作姿态重塑 (`src/actors.ts`)
- [ ] 重绘孙悟空：马步蓄力弓步劈杀身段、透视缩短的腿部与脚靴、清晰有力的手指握棒细节；
- [ ] 重构飘扬战袍斗篷与双翎雉鸡羽，增加风向波浪起伏与惯性摆动；
- [ ] 重构天兵天将：摆脱机械图标排列，打造前后交错的重装神将战阵与被击飞抛物线翻滚姿态；
- [ ] 更新 `src/actors.test.ts` 并通过测试。

### Task 3: 三层景深空间与场景艺术重绘 (`src/sceneArtwork.ts`)
- [ ] 重建 Scene 1–4：剔除折线锯齿山，绘制雄浑工笔青绿峰峦、水汽磅礴水帘洞飞瀑、近景松柏画框与起伏颠簸木排；
- [ ] 重建 Scene 5–10：近景巍峨盘龙柱遮挡、华丽蟠桃盛宴（倾翻红木案、飞洒琼浆、碎裂玉盘与仙桃）；
- [ ] 重建 Scene 11–19：十万天兵雷云阵列、斩妖台玄铁雷火锁链、八卦炉饕餮金纹与破炉裂壁；
- [ ] 重建 Scene 20–22：凌霄宝殿断裂金柱砸向镜头的前景穿透感与漫天五彩神光；
- [ ] 保持 `main.ts` 中 `updateArtwork` 的所有 class 选择器对接；
- [ ] 更新 `src/sceneArtwork.test.ts` 并通过测试。

### Task 4: 动漫速度线与高动态打击特效 (`src/effects.ts` & `src/filmCanvas.ts`)
- [ ] 增加动漫爆发速度线（Radial & Linear Anime Speedlines）；
- [ ] 升级金箍棒半月弧光斩痕，带流光残影与动态模糊感；
- [ ] 增加镜头前沿快速掠过的飞石碎屑与云雾水汽；
- [ ] 更新 `src/effects.test.ts` 验证运行无报错。

### Task 5: 调度中枢集成与三层 Parallax 贯通 (`src/main.ts`)
- [ ] 为 `.scene-foreground`、`#world`、`#backdrop` 注入动态视差平移；
- [ ] 镜头打击时的瞬间 Scale-in 推进与带衰减物理震动；
- [ ] 更新 `src/main.test.ts`，确保 3150 帧确定性无懈可击。

### Task 6: 生产打包、关键帧导出抽检与线上更新
- [ ] 运行 `npm test` 保证全量测试通过；
- [ ] 运行 `npm run build` 生成最新生产产物；
- [ ] 使用 `scripts/export-frames.mjs` 导出第 200、480、1050、1600 关键帧进行视觉比对；
- [ ] 确保 `movie.hlearn.online` 线上环境同步更新。
