/* Dev-only: screenshots the served build for visual review.
   Usage: node scripts/screenshot.js [outDir] */
const { chromium } = require('playwright');
const path = require('path');

const BASE = 'http://localhost:5050';
const OUT = process.argv[2] || path.join(__dirname, '..', '.shots');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const shot = (name) => path.join(OUT, `${name}.png`);

  // Home — hero viewport
  await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: shot('01-home-hero') });

  // Home — system section
  await page.evaluate(() => document.getElementById('system')?.scrollIntoView());
  await page.waitForTimeout(1800);
  await page.screenshot({ path: shot('02-home-system') });

  // Home — comparator
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.18));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: shot('03-home-comparator') });

  // Home — bottom (manifest / first contact)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1200));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: shot('04-home-bottom') });

  const routes = [
    ['05-products', '/#/products'],
    ['06-product-arms', '/#/products/robotic-arms'],
    ['07-team', '/#/team'],
    ['08-contact', '/#/contact'],
    ['09-news', '/#/news'],
  ];
  for (const [name, route] of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: shot(name), fullPage: name !== '06-product-arms' });
  }

  await browser.close();
  console.log('done:', OUT);
})();
