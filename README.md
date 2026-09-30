# 大闹天宫 · 逐帧动画短片

根据新版 22 镜头剧本制作的 1920 × 1080、30 fps 动画。全片 1 分 45 秒，共 3150 帧（编号 0–3149）。故事从云海天宫、漂洋过海与三星洞求道开始，经过招安、蟠桃会、天兵压境、受刑与八卦炉，最后以五彩大闹天宫和片名结束。色彩随悟空的自由受限而褪去，再在破炉后释放。

## 本地预览

当前版本增加了简短叙事字幕，交代两次招安、蟠桃会未邀、金刚琢擒拿与八卦炉炼化的因果。弼马温段加入愤而离天的动作，南天门段加入金刚琢击中、金箍棒脱手的连续动作。字幕按帧号绘制，浏览器和导出视频保持一致。

```bash
npm install
npm run dev
```

打开终端显示的地址即可播放。画面按窗口等比缩放，内部始终按 1920 × 1080 绘制。通过 `/?frame=90` 查看指定帧，或在浏览器控制台调用 `window.renderFrame(90)`；帧号范围为 0–3149。浏览器中的精确单帧入口也是离线导出的依据。

可先查看 [22 幕画面总览](docs/scene-contact-sheet.jpg) 和 [片尾预览](docs/final-title-preview.jpg)。

```bash
npm test
npm run build
```

## 导出 PNG 帧与 MP4

先安装依赖，并确保电脑装有 Chrome；若没有 Chrome，安装 Playwright Chromium：

```bash
npm install
npx playwright install chromium
```

导出脚本会先构建项目，再自动启动本地 Vite 预览。它按编号调用 `window.renderFrame(frame)`，等待浏览器完成绘制后保存画面，不依赖实时播放速度。默认生成 `frames/frame-00000.png` 至 `frames/frame-03149.png`：

```bash
npm run export:frames
```

可只导出一个含首尾端点的小范围做检查，例如第 900–929 帧。Windows 上直接调用 Node，可避免 npm 把 `--start` 和 `--end` 当作自己的配置参数：

```bash
node scripts/export-frames.mjs --start 900 --end 929
```

全部 PNG 导出后，安装 FFmpeg 并运行：

```bash
npm run export:mp4
```

输出为 `havoc-in-heaven.mp4`，H.264 / yuv420p / 30 fps / 1920 × 1080。这个命令要求 `frames/` 中已有全部连续的 3150 帧。当前导出为无声画面；剧本中的声音设计尚需另行配乐和混音。

如果只需要 MP4，先运行 `npm run build`，再运行 `npm run render:mp4`。这个脚本逐帧将画面送入 FFmpeg，省去保存完整 PNG 序列；同样需要系统安装 FFmpeg。可用 `--output` 指定视频文件、用 `--dist` 指定构建目录，或用 `--width 1280` 导出 720p 预览（默认仍为 1920 × 1080），例如 `node scripts/render-mp4.mjs --dist /tmp/movie-story-review --output havoc-in-heaven-revised.mp4`。

## 项目结构

- `src/timeline.ts`：22 幕的帧区间、转场类型与长度，以及每帧由哪一两幕合成。
- `src/captions.ts`：字幕内容、全局帧区间和淡入淡出；独立于摄像机与转场绘制。
- `src/engine/`：缓动与关键帧、多层景深摄像机（前景/中景/远景视差）、双场景槽转场渲染器。
- `src/rig/`：可动关节的悟空角色（五套服装、姿势库、IK、披风飘带的惯性跟随）。
- `src/scenes/`：每幕一个文件 `s01.ts`–`s22.ts`，公共美术在 `kit.ts`，Canvas 特效在 `fxkit.ts`。
- `scripts/snap.mjs`：渲染指定帧并拼成总览图，用于逐镜检查，例如 `node scripts/snap.mjs 0-3149:75 --sheet all --cols 7`。
- `scripts/export-frames.mjs`、`scripts/render-mp4.mjs`：逐帧 PNG / MP4 导出。
- `scripts/subset-font.py`：修改片中汉字后重新生成标题字体子集。
- `docs/scene-brief.md`：分镜与每幕内容说明。
