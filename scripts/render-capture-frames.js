/* Offline frame renderer for the capture stage.

   One command regenerates the shipped capture animation from the live ORA CAD
   without ever shipping the CAD:
     1. swaps src/components/home/MissionCaptureLive.js from its prod stub to a
        re-export of MissionCapture3D (the real three.js scene),
     2. builds with REACT_APP_RENDER3D=1 and serves build/ locally,
     3. drives the live scene headlessly, screenshotting the #mission canvas
        (HUD overlays hidden) at N steps across the capture scroll range → JPEGs
        in src/assets/capture/,
     4. restores the stub and runs a normal build so the working tree + build/
        ship frames only (no three.js, no ora-t0.bin).

   Run after the arm CAD changes (i.e. after re-running build-ora-model.js):
     npm i --no-save playwright   # if not already present
     node scripts/render-capture-frames.js

   Env knobs: FRAMES (default 80), QUALITY (default 78). */
const fs = require('fs');
const http = require('http');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const LIVE_FILE = path.join(ROOT, 'src', 'components', 'home', 'MissionCaptureLive.js');
const OUT = path.join(ROOT, 'src', 'assets', 'capture');
const BUILD = path.join(ROOT, 'build');
const PORT = 5051;
const BASE = `http://localhost:${PORT}/randomwebsite.github.io`;
const N = Number(process.env.FRAMES || 80);
const DSF = 2.0;
const QUALITY = Number(process.env.QUALITY || 95);
const P0 = 0.5; // capture view spans mission progress 0.50 → 0.93
const P1 = 0.93;

const REEXPORT = "export { default } from './MissionCapture3D';\n";

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.bin': 'application/octet-stream', '.mp4': 'video/mp4', '.gif': 'image/gif', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

// Minimal static server for build/ under the /randomwebsite.github.io subpath.
const serve = () =>
  http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]).replace('/randomwebsite.github.io', '');
    let file = path.join(BUILD, rel);
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(BUILD, 'index.html');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });

(async () => {
  const stub = fs.readFileSync(LIVE_FILE, 'utf8');
  let server;
  try {
    console.log('› swapping in live 3D scene + building render bundle…');
    fs.writeFileSync(LIVE_FILE, REEXPORT);
    execSync('npm run build', { cwd: ROOT, stdio: 'inherit', env: { ...process.env, REACT_APP_RENDER3D: '1', CI: 'false' } });

    server = serve().listen(PORT);
    const { chromium } = require('playwright');
    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(OUT, { recursive: true });
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: DSF });
    await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const m = await page.evaluate(() => {
      const el = document.getElementById('mission');
      return { top: el.offsetTop, height: el.offsetHeight, vh: window.innerHeight };
    });
    const span = m.height - m.vh;

    await page.evaluate(([top, y]) => window.scrollTo(0, top + y), [m.top, span * (P0 + 0.02)]);
    await page.waitForSelector('#mission canvas', { timeout: 15000 });
    await page.waitForTimeout(2500);
    const canvas = page.locator('#mission canvas').first();

    // Hide DOM overlays on top of the canvas so frames capture ONLY the 3D scene
    // (the HUD is drawn live at runtime and must not be baked in).
    const hideHud = () =>
      page.evaluate(() => {
        const cv = document.querySelector('#mission canvas');
        const view = cv.closest('.overflow-hidden');
        [...view.children].forEach((child) => {
          if (!child.contains(cv)) child.style.visibility = 'hidden';
        });
      });

    console.log(`› rendering ${N} frames…`);
    for (let i = 0; i < N; i++) {
      const progress = P0 + (i / (N - 1)) * (P1 - P0);
      await page.evaluate(([top, y]) => window.scrollTo(0, top + y), [m.top, span * progress]);
      await hideHud();
      await page.waitForTimeout(180);
      await canvas.screenshot({ path: path.join(OUT, `f${String(i).padStart(3, '0')}.jpg`), type: 'jpeg', quality: QUALITY });
    }
    await browser.close();
    const bytes = fs.readdirSync(OUT).reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
    console.log(`› wrote ${N} frames (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
  } finally {
    if (server) server.close();
    fs.writeFileSync(LIVE_FILE, stub); // always restore the prod stub
  }

  console.log('› restoring prod stub + rebuilding (frames only)…');
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit', env: { ...process.env, CI: 'false' } });
  console.log('✓ done — build/ ships frames only (no three.js, no CAD).');
})();
