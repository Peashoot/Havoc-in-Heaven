// Quick visual check: renders chosen frames through the Vite dev server (no build step).
// Usage:
//   node scripts/snap.mjs 200 480 1600            -> frames/snap/f-00200.png ...
//   node scripts/snap.mjs 0-3149:105 --sheet all  -> also frames/snap/all.jpg contact sheet
//   node scripts/snap.mjs 1590-1630:5 --out frames/s12 --sheet s12 --cols 3
import { spawnSync } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const args = process.argv.slice(2);
let out = 'frames/snap';
let sheet = null;
let cols = 5;
let pagePath = '';
const frames = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--out') out = args[++i];
  else if (a === '--sheet') sheet = args[++i];
  else if (a === '--cols') cols = Number(args[++i]);
  else if (a === '--page') pagePath = args[++i];
  else {
    const m = /^(\d+)-(\d+)(?::(\d+))?$/.exec(a);
    if (m) {
      for (let f = Number(m[1]); f <= Number(m[2]); f += Number(m[3] ?? 1)) frames.push(f);
    } else frames.push(Number(a));
  }
}
if (!frames.length) throw new Error('给出帧号，例如 node scripts/snap.mjs 200 480');

const outDir = resolve(out);
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const server = await createServer({ logLevel: 'error', server: { host: '127.0.0.1', port: 0 } });
await server.listen();
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--use-gl=swiftshader', '--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('页面错误:', e.message));
  await page.goto(`${url}${pagePath}?frame=${frames[0]}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    await page.evaluate(async (n) => {
      window.renderFrame(n);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }, f);
    await page.locator('#stage').screenshot({ path: `${outDir}/f-${String(i).padStart(3, '0')}-${String(f).padStart(5, '0')}.png` });
  }
} finally {
  await browser.close();
  await server.close();
}

if (sheet) {
  const rows = Math.ceil(frames.length / cols);
  // Chromium can alternate RGB/RGBA PNGs. Reinitialising tile discards earlier frames.
  const result = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-reinit_filter', '0', '-pattern_type', 'glob', '-i', `${outDir}/f-*.png`,
    '-vf', `format=rgb24,scale=480:270,tile=${cols}x${rows}:padding=4:color=black`, '-frames:v', '1', '-q:v', '3',
    `${outDir}/${sheet}.jpg`], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('画面总览生成失败');
}
console.log(`已渲染 ${frames.length} 帧 -> ${outDir}`);
