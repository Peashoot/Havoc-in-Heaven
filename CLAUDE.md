# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Havoc in Heaven" (大闹天宫) is a deterministic frame-by-frame 2D animated film rendered with SVG + Canvas in the browser.
- Fixed 1920 × 1080 stage, 30 fps, 3150 frames (0–3149), 22 scenes. Storyboard/spec: `docs/scene-brief.md`.
- Vite + TypeScript (no framework), Node's native test runner, Playwright + FFmpeg for export.
- Production build (`dist/`) is served directly by nginx at movie.hlearn.online — `npm run build` updates the live site.

## Commands

- `npm run dev` — dev server; `/?frame=N` or `window.renderFrame(N)` shows one frame.
- `npm test` — `node --experimental-strip-types --test 'src/**/*.test.ts'`. Single test: add `--test-name-pattern="<pattern>"`.
- `npm run build` — `tsc --noEmit && vite build`.
- `node scripts/snap.mjs 200 480 1600 --out frames/x --sheet x --cols 3` — render specific frames (dev server + headless Chromium) and tile them into `frames/x/x.jpg`. Ranges: `0-3149:105`. `--page rig.html` renders the rig/pose sheet instead. **This is the verification loop: render, look at the sheet, fix.**
- `npm run export:frames` / `node scripts/export-frames.mjs --start A --end B` — PNG export from the production build; `npm run render:mp4` streams straight to FFmpeg.
- `python3 scripts/subset-font.py` — re-subset the title font (`public/fonts/film-serif.woff2`) after adding any CJK text to `src/`.

## Architecture

### Time
- `src/timeline.ts`: `SCENE_BOUNDS`, `TRANSITIONS` (type + length, centred on each boundary) and `compose(frame)` → the one or two scenes live at that frame plus the transition mix. `sceneTime(scene, frame)` gives `{lf, p, dur}` — `lf` is the scene-local frame and is also evaluated **outside** `[0, dur)` while a transition overlaps, so scenes must look right at lf < 0 and lf > dur.
- Everything is a pure function of the frame. Never use `Math.random`/`Date`; use `rand(n)` / `noise(x, seed)` from `src/engine/ease.ts`.
- `ease.ts` also has `track(keys, t)` keyframe tracks with named eases (`inBack` = anticipation, `outBack`/`outSpring` = overshoot, `outExpo` = snap) and `shake()`.

### Rendering (`src/engine/`)
- `scene.ts`: `SceneDef { id, bg, markup(), camera(t), heroes?(t), update?(d, t), fx?(ctx, t, view), shake?(t) }`. `plane(z, body)` makes a multiplane layer: z=0 is fixed sky, z=1 is the subject plane, z>1 is foreground; `planeMatrix(cam, z)` gives parallax + per-depth zoom (`zoom^z`).
- `render.ts`: two scene slots (`#slot0`/`#slot1`, scene % 2) so transitions can overlap two live scenes; each slot contains its SVG and FX canvas, so both fade/blur/shake together and the incoming scene occludes outgoing effects. Transition overlays (cloud wall, ink, flash, black) use `#tx`; whip pans move the camera without exposing empty stage edges.
- `src/captions.ts`: global-frame narration cues with deterministic fades, rendered by `main.ts` above the scene and transitions. Keep captions short enough to read; regenerate the font subset after changing text.
- Scene rules: every class/id in a scene is prefixed `sN-`; wrap kit elements that already have a `transform` in a `<g>` before animating them.

### Characters and kit
- `src/rig/hero.ts`: jointed Wukong puppet (FK, 2-bone IK for the rear arm, foot planting, follow-through on cape/scarf/plumes driven by the pose 3 frames earlier). `solve(pose)` returns hand/staff positions for props. Costumes are CSS-switched via `data-c`: pilgrim, king, bima, sage, furnace. `staffA`: 0 forward, 90 down, −90 up.
- `src/rig/poses.ts`: pose library `P`, `walk()`, `poseTrack()`. `rig.html` renders pose/costume sheets.
- `src/scenes/kit.ts`: shared SVG drawing (sky, clouds, karst, halls, 南天门 `heavenGate`, soldiers, immortals, monkeys, peaches, props, fairies) and gradient/filter defs. `fxkit.ts`: canvas FX (staff smear sampled from the pose function, speed lines, shock rings, sparks, motes).
- `src/scenes/sNN.ts`: one file per scene; some share sets (s15 imports s14's courtyard, s18/s19 import s16's furnace).

### Visual rules
- Colour follows Wukong's freedom: saturated Huaguo → grey-gold bureaucracy → blue-grey punishment → furnace fire → rainbow release.
- Costume arc: pilgrim (s2–3) → king (s4, s10) → bima (s5–6) → sage armour (s7–9, s11–13, s19–22) → furnace (s14–18). The second invitation follows his self-proclamation as 齐天大圣.
