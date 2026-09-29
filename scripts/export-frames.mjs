import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const FRAME_COUNT = 3150;
const SIZE = { width: 1920, height: 1080 };

function readRange(args) {
  let start = 0;
  let end = FRAME_COUNT - 1;
  for (let i = 0; i < args.length; i++) {
    const match = /^(--start|--end)(?:=(.*))?$/.exec(args[i]);
    if (!match) throw new Error(`未知参数：${args[i]}。用法：npm run export:frames -- [--start 0] [--end 3149]`);
    const raw = match[2] ?? args[++i];
    if (!raw || !/^\d+$/.test(raw)) throw new Error(`${match[1]} 需要非负整数`);
    const value = Number(raw);
    if (match[1] === '--start') start = value;
    else end = value;
  }
  if (start > end || end >= FRAME_COUNT) throw new Error(`帧范围须满足 0 ≤ start ≤ end < ${FRAME_COUNT}`);
  return { start, end };
}

async function availablePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await new Promise((accept, reject) => {
    server.once('listening', accept);
    server.once('error', reject);
  });
  const port = server.address().port;
  await new Promise((accept) => server.close(accept));
  return port;
}

function runVite(args, capture = false) {
  const child = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), ...args], {
    cwd: process.cwd(),
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });
  return child;
}

async function build() {
  const child = runVite(['build']);
  const code = await new Promise((accept, reject) => {
    child.once('exit', accept);
    child.once('error', reject);
  });
  if (code !== 0) throw new Error(`Vite 构建失败，退出码 ${code}`);
}

async function waitForServer(url, child) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`预览服务器提前退出，退出码 ${child.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* Vite 仍在启动 */ }
    await delay(100);
  }
  throw new Error('等待预览服务器超时');
}

async function launchBrowser() {
  const args = ['--disable-gpu', '--disable-gpu-compositing'];
  try {
    return await chromium.launch({ channel: 'chrome', headless: true, args });
  } catch {
    try {
      return await chromium.launch({ headless: true, args });
    } catch (error) {
      throw new Error(`无法启动 Chrome 或 Playwright Chromium。请运行 npx playwright install chromium。\n${error.message}`);
    }
  }
}

async function main() {
  const { start, end } = readRange(process.argv.slice(2));
  await build();
  const port = await availablePort();
  const url = `http://127.0.0.1:${port}/`;
  const server = runVite(['preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], true);
  let browser;
  try {
    await waitForServer(url, server);
    browser = await launchBrowser();
    const page = await browser.newPage({ viewport: SIZE, deviceScaleFactor: 1 });
    page.on('pageerror', (error) => console.error(`页面错误：${error.message}`));
    await page.goto(`${url}?frame=${start}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const outDir = resolve('frames');
    await mkdir(outDir, { recursive: true });

    for (let frame = start; frame <= end; frame++) {
      await page.evaluate(async (frameNumber) => {
        if (typeof window.renderFrame !== 'function') throw new Error('window.renderFrame 尚未就绪');
        window.renderFrame(frameNumber);
        await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
        if (document.querySelector('#stage')?.dataset.frame !== String(frameNumber)) {
          throw new Error(`渲染帧不匹配：${frameNumber}`);
        }
      }, frame);
      const name = `frame-${String(frame).padStart(5, '0')}.png`;
      await page.locator('#stage').screenshot({ path: resolve(outDir, name), timeout: 30000 });
      if (frame === start || frame === end || (frame + 1) % 30 === 0) {
        console.log(`已导出 ${frame - start + 1}/${end - start + 1} 帧：${name}`);
      }
    }
  } finally {
    await browser?.close();
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
