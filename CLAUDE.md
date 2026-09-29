# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Havoc in Heaven" (大闹天宫) is a deterministic frame-by-frame 2D animated film rendered using HTML, CSS, SVG, and HTML5 Canvas.
- Resolution: Fixed 1920 × 1080 canvas (16:9), auto-scaled to viewport via CSS transform.
- Frame rate & Duration: 30 fps, 105 seconds, exactly 3150 frames (numbered 0 to 3149) across 22 scenes defined in `docs/storyboard.md`.
- Tech Stack: Vite, TypeScript (no frontend framework), native Node.js test runner, Playwright & FFmpeg for rendering.

## Commands

### Development
- `npm run dev` — Start Vite dev server on `0.0.0.0:5173`.
  - Preview specific frame in browser: `http://localhost:5173/?frame=<number>` (0–3149).
  - Jump to a frame in browser console: `window.renderFrame(<number>)`.

### Build & Test
- `npm test` — Run timeline and scene boundary tests using Node.js native test runner (`node --experimental-strip-types --test src/timeline.test.ts`).
- Run a single test by pattern: `node --experimental-strip-types --test src/timeline.test.ts --test-name-pattern="<pattern>"`
- `npm run build` — Typecheck (`tsc --noEmit`) and bundle production assets with Vite (`vite build`).

### Frame & Video Export
- `npx playwright install chromium` — Install Playwright Chromium (required if system Chrome is absent).
- `npm run export:frames` — Build and launch headless browser to export all 3150 PNG frames to `frames/frame-%05d.png`.
- Export a frame subset: `node scripts/export-frames.mjs --start <start> --end <end>` (e.g., `node scripts/export-frames.mjs --start 900 --end 929`).
- `npm run export:mp4` — Stitch existing PNG sequence in `frames/` into `havoc-in-heaven.mp4` using FFmpeg.
- `npm run render:mp4` — Build and stream frames directly from headless browser to FFmpeg stdin to produce `havoc-in-heaven.mp4` without saving intermediate PNG files.
  - Custom range/output: `node scripts/render-mp4.mjs --start <start> --end <end> --output <filename.mp4>`

## Architecture & Rendering Pipeline

### Deterministic Timeline (`src/timeline.ts`)
- The single source of truth for the entire film is `filmState(frameNumber): FilmState`.
- Every frame from 0 to 3149 maps deterministically to one of 22 scenes in `SCENE_BOUNDS`.
- `filmState()` calculates progress (0–1), camera position (`cameraX`, `cameraY`, `cameraScale`, `shake`), actor positions, rotations, color palettes, fog, rain, fire, staff glow, eye glow, shockwaves, debris, and title opacity.
- Animation avoids real-time timer drift; rendering any frame index always yields identical output.

### Stage Layering (`index.html` & `src/style.css`)
Inside `#stage` (1920 × 1080), rendering is stacked across distinct DOM layers by z-index:
1. `#backdrop` (`<canvas>`, z=0): Sky gradient and cloud volumes (`src/clouds.ts`, Scene 1).
2. `#world` (`<div>` with SVG, z=1): Scenery, architectural elements, doors, and landscapes (`src/sceneArtwork.ts`, `src/palace.ts`).
3. `#atmosphere` (`<canvas>`, z=2): Dynamic atmospheric effects like drifting fog, sea waves, rain, furnace fire, and chromatic particle clouds (`src/filmCanvas.ts`).
4. `#darkness` (`<div>`, z=3): Scene dimming and blackout transitions controlled by `state.darkness`.
5. `#actors` (`<div>` with SVG, z=4): Wukong, Ruyi Jingu Bang (staff), celestial army, and court officials (`src/actors.ts`).
6. `#effects` (`<canvas>`, z=5): Action FX such as shockwaves, staff trails, lightning flashes, flying debris, and sparks (`src/effects.ts`).
7. `#final-title` (`<div>` with SVG, z=6): Calligraphic title "大闹天宫" fading in at scene 22 (`state.titleOpacity`).
8. `#flash` (`<div>`, z=7): White/gold impact flash overlay (`state.flash`).
9. Overlays (z=8–9): `#vignette` radial gradient and top/bottom `#letterbox` bars.

### Orchestration (`src/main.ts`)
- Exposes `window.renderFrame(frameNumber)`.
- Updates `#world` inner SVG when the scene transitions (`sceneArtwork(scene)`).
- Manipulates dynamic SVG transforms and opacities in `updateArtwork(state)`.
- Synchronizes actor SVG states via `updateActors(state, actors)`.
- Redraws Canvas contexts (`backdrop`, `atmosphere`, `effects`) for the current frame.
- Sets `data-frame` and `data-scene` attributes on `#stage` for Playwright screenshot verification.

### Narrative Visual Rules
- **Color symbolism**: Represents Wukong's freedom. Vibrant jades/golds at Mount Huaguo (`free`) -> desaturated grays/cold blues under heavenly bureaucracy and torture (`faded`, `punishment`) -> dark black in the furnace (`ember`) -> explosive 5-color release upon shattering the furnace (`rainbow`).
- **Staff dynamics**: Hidden during study, emerges at Huaguo, disappears during horse-tending, dims under punishment, and reignites with high glow (`staffGlow`) during the revolt.
