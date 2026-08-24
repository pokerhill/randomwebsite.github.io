#!/usr/bin/env node
// Figma fidelity harness.
//
// Turns "does this section match the design?" into a number instead of an
// opinion. For each section tagged with `data-figma="<nodeId>"` in the DOM it:
//
//   1. screenshots that element at the design's 1440px canvas width,
//   2. loads the matching Figma reference PNG from refs/<nodeId>.png,
//   3. scales both to a common width and compares them with pixelmatch,
//   4. writes a side-by-side plus a red diff heatmap to out/,
//   5. prints a mismatch percentage per section.
//
// Reference PNGs are exported by the Figma MCP server (get_screenshot on the
// node) and dropped into refs/ named after the node id with ':' as '-'.
//
// Usage:
//   node scripts/figma-diff.mjs [--url <page>] [--filter <substring>]
//
// Notes on reading the numbers: a perfect score is not achievable here. The
// design uses Test Söhne (unlicensed, so Geist stands in), and every reference
// is a fixed 1440px canvas while the implementation is fluid. Treat the score as
// a regression signal and a ranking of what to fix next, not a pass/fail gate.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REFS = path.join(ROOT, 'figma-refs');
const OUT = path.join(ROOT, 'figma-diff-out');

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};

const URL_ = argOf('--url', 'http://localhost:3000/randomwebsite.github.io/');
const FILTER = argOf('--filter', '');
const CANVAS_W = Number(argOf('--width', '1440'));

fs.mkdirSync(OUT, { recursive: true });
if (!fs.existsSync(REFS)) {
  console.error(`No reference directory at ${REFS}.`);
  console.error('Export Figma nodes with the MCP server and save as figma-refs/<node-id>.png');
  process.exit(1);
}

// --- image helpers -----------------------------------------------------------

const readPng = (p) => PNG.sync.read(fs.readFileSync(p));

// Nearest-neighbour resize. Good enough: we are measuring layout and colour
// agreement, and interpolation would blur the very edges we want to compare.
const resize = (src, w, h) => {
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    const sy = Math.min(src.height - 1, Math.floor((y * src.height) / h));
    for (let x = 0; x < w; x++) {
      const sx = Math.min(src.width - 1, Math.floor((x * src.width) / w));
      const si = (sy * src.width + sx) << 2;
      const di = (y * w + x) << 2;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = 255;
    }
  }
  return out;
};

// Flatten onto the page background so transparent regions don't read as diffs.
const flatten = (png, bg = [22, 22, 22]) => {
  for (let i = 0; i < png.data.length; i += 4) {
    const a = png.data[i + 3] / 255;
    if (a === 1) continue;
    png.data[i] = Math.round(png.data[i] * a + bg[0] * (1 - a));
    png.data[i + 1] = Math.round(png.data[i + 1] * a + bg[1] * (1 - a));
    png.data[i + 2] = Math.round(png.data[i + 2] * a + bg[2] * (1 - a));
    png.data[i + 3] = 255;
  }
  return png;
};

const sideBySide = (a, b, diff) => {
  const gap = 12;
  const w = a.width * 3 + gap * 2;
  const h = Math.max(a.height, b.height, diff.height);
  const out = new PNG({ width: w, height: h });
  out.data.fill(0);
  const blit = (src, ox) => {
    for (let y = 0; y < src.height; y++) {
      for (let x = 0; x < src.width; x++) {
        const si = (y * src.width + x) << 2;
        const di = (y * w + (x + ox)) << 2;
        out.data[di] = src.data[si];
        out.data[di + 1] = src.data[si + 1];
        out.data[di + 2] = src.data[si + 2];
        out.data[di + 3] = 255;
      }
    }
  };
  blit(a, 0);
  blit(b, a.width + gap);
  blit(diff, a.width * 2 + gap * 2);
  return out;
};

// --- main --------------------------------------------------------------------

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--force-prefers-reduced-motion', '--hide-scrollbars', '--disable-gpu'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: CANVAS_W, height: 1200, deviceScaleFactor: 1 });
  await page.goto(URL_, { waitUntil: 'networkidle2', timeout: 60000 });
  // Let webfonts settle so text metrics are stable before we shoot.
  await page.evaluateHandle('document.fonts.ready');

  const tagged = await page.$$eval('[data-figma]', (els) =>
    els.map((el) => ({
      node: el.getAttribute('data-figma'),
      name: el.getAttribute('data-figma-name') || '',
    }))
  );

  if (!tagged.length) {
    console.error('No [data-figma] elements found. Tag sections with data-figma="<nodeId>".');
    process.exit(2);
  }

  const results = [];

  for (const { node, name } of tagged) {
    if (FILTER && !node.includes(FILTER) && !name.includes(FILTER)) continue;

    const refPath = path.join(REFS, `${node.replace(':', '-')}.png`);
    if (!fs.existsSync(refPath)) {
      results.push({ node, name, status: 'no-ref' });
      continue;
    }

    const handle = await page.$(`[data-figma="${node}"]`);
    const shotPath = path.join(OUT, `${node.replace(':', '-')}.local.png`);
    await handle.screenshot({ path: shotPath });

    const ref = flatten(readPng(refPath));
    const local = flatten(readPng(shotPath));

    // Compare at the reference width, preserving each image's aspect ratio, then
    // crop to the shorter height so a length mismatch is reported rather than
    // silently stretching one to fit the other.
    const W = ref.width;
    const refS = resize(ref, W, ref.height);
    const locS = resize(local, W, Math.round((local.height * W) / local.width));
    const H = Math.min(refS.height, locS.height);
    const refC = resize(refS, W, H);
    const locC = resize(locS, W, H);

    const diff = new PNG({ width: W, height: H });
    const mismatched = pixelmatch(refC.data, locC.data, diff.data, W, H, {
      threshold: 0.12,
      diffColor: [255, 0, 64],
      alpha: 0.06,
    });

    const pct = (mismatched / (W * H)) * 100;
    const heightDelta = refS.height - locS.height;

    fs.writeFileSync(path.join(OUT, `${node.replace(':', '-')}.diff.png`), PNG.sync.write(diff));
    fs.writeFileSync(
      path.join(OUT, `${node.replace(':', '-')}.compare.png`),
      PNG.sync.write(sideBySide(refC, locC, diff))
    );

    results.push({ node, name, status: 'ok', pct, refH: refS.height, locH: locS.height, heightDelta });
  }

  results.sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));

  console.log('');
  console.log('  mismatch  height(ref→local)   node        section');
  console.log('  --------  -----------------   ----------  -------');
  for (const r of results) {
    if (r.status === 'no-ref') {
      console.log(`     —      (no reference)      ${r.node.padEnd(10)}  ${r.name}`);
      continue;
    }
    const delta = r.heightDelta === 0 ? '' : ` (${r.heightDelta > 0 ? '-' : '+'}${Math.abs(r.heightDelta)}px)`;
    console.log(
      `   ${r.pct.toFixed(1).padStart(5)}%   ${String(r.refH).padStart(5)}→${String(r.locH).padEnd(5)}${delta.padEnd(10)} ${r.node.padEnd(10)}  ${r.name}`
    );
  }

  const scored = results.filter((r) => r.status === 'ok');
  if (scored.length) {
    const avg = scored.reduce((s, r) => s + r.pct, 0) / scored.length;
    console.log('');
    console.log(`  ${scored.length} section(s) scored · mean mismatch ${avg.toFixed(1)}%`);
  }
  const missing = results.filter((r) => r.status === 'no-ref');
  if (missing.length) {
    console.log(`  ${missing.length} section(s) have no Figma reference yet — export them to figma-refs/`);
  }
  console.log(`  artifacts: ${path.relative(ROOT, OUT)}/<node>.compare.png (ref | local | diff)`);
  console.log('');
} finally {
  await browser.close();
}
