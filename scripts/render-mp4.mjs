import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const TOTAL_FRAMES = 3150;
const FPS = 30;

function options(args) {
  const result = { start: 0, end: TOTAL_FRAMES - 1, output: 'havoc-in-heaven.mp4', dist: 'dist', width: 1920 };
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (!['--start', '--end', '--output', '--dist', '--width'].includes(key)) throw new Error(`未知参数：${key}`);
    const value = args[++i];
    if (value === undefined) throw new Error(`${key} 缺少值`);
    if (key === '--output' || key === '--dist') result[key.slice(2)] = value;
    else if (/^\d+$/.test(value)) result[key.slice(2)] = Number(value);
    else throw new Error(`${key} 需要非负整数`);
  }
  if (result.start > result.end || result.end >= TOTAL_FRAMES) throw new Error('帧范围无效');
  if (result.width < 640 || result.width > 1920 || result.width % 32 !== 0) throw new Error('宽度须为 640–1920 之间的 32 的倍数');
  return result;
}

async function availablePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise((done) => server.close(done));
  return port;
}

async function waitForServer(url, server) {
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error('预览服务提前退出');
    try { if ((await fetch(url)).ok) return; } catch { /* 正在启动 */ }
    await delay(100);
  }
  throw new Error('预览服务启动超时');
}

async function launchBrowser() {
  const args = ['--enable-webgl', '--use-gl=swiftshader', '--no-sandbox'];
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
  const { start, end, output, dist, width } = options(process.argv.slice(2));
  const height = width * 9 / 16;
  const port = await availablePort();
  const server = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), 'preview',
    '--host', '127.0.0.1', '--port', String(port), '--strictPort', '--outDir', resolve(dist)],
  { stdio: ['ignore', 'pipe', 'pipe'] });
  let browser;
  let encoder;
  try {
    await waitForServer(`http://127.0.0.1:${port}/`, server);
    browser = await launchBrowser();
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const capture = await page.context().newCDPSession(page);
    await page.goto(`http://127.0.0.1:${port}/?frame=${start}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      // Frame zero contains no Chinese text: load the font before the first caption.
      await document.fonts.load('900 38px FilmSerif', '大闹天宫');
      await document.fonts.ready;
    });
    let encoderError = '';
    encoder = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg',
      '-i', 'pipe:0', '-frames:v', String(end - start + 1), '-c:v', 'libx264', '-preset', 'medium',
      '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', resolve(output)],
    { stdio: ['pipe', 'ignore', 'pipe'] });
    encoder.stderr.on('data', (chunk) => { encoderError = (encoderError + chunk.toString()).slice(-5000); });

    for (let frame = start; frame <= end; frame++) {
      await page.evaluate((frameNumber) => {
        window.renderFrame(frameNumber);
        if (document.querySelector('#stage')?.dataset.frame !== String(frameNumber)) {
          throw new Error(`渲染帧不匹配：${frameNumber}`);
        }
      }, frame);
      // The stage fills this fixed viewport. Capture the painted frame directly;
      // captureScreenshot flushes layout and painting after the synchronous frame render.
      const shot = await capture.send('Page.captureScreenshot', {
        format: 'jpeg', quality: 90, captureBeyondViewport: false,
        clip: { x: 0, y: 0, width, height, scale: 1 },
      });
      const jpeg = Buffer.from(shot.data, 'base64');
      if (!encoder.stdin.write(jpeg)) await once(encoder.stdin, 'drain');
      if (frame === start || frame === end || (frame + 1) % 150 === 0) {
        console.log(`编码画面 ${frame - start + 1}/${end - start + 1}：第 ${frame} 帧`);
      }
    }
    encoder.stdin.end();
    const [code] = await once(encoder, 'exit');
    if (code !== 0) throw new Error(`FFmpeg 退出码 ${code}\n${encoderError}`);
    console.log(`MP4 已写入 ${resolve(output)}`);
  } finally {
    if (encoder?.exitCode === null) { encoder.stdin.destroy(); encoder.kill(); }
    await browser?.close();
    server.kill();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
