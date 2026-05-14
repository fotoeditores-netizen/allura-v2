const { chromium } = require('playwright');
const path = require('path');
const fs   = require('fs');

const DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);

const SITES = {
  original: 'https://www.allurahealthcare.com/',
  nuevo:    'https://allura-healthcare.vercel.app/',
};

const DESKTOP = { width: 1440, height: 900 };
const MOBILE  = { width: 390,  height: 844 };

// Take a clipped screenshot at a given Y offset by scrolling the page there first.
// Using fullPage:false after scrolling captures the current viewport.
async function clipAt(page, filePath, scrollY, vw, vh) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(400);
  await page.screenshot({ path: filePath, fullPage: false });
}

async function capture() {
  const browser = await chromium.launch();

  for (const [name, url] of Object.entries(SITES)) {
    try {
      // ── Desktop ──────────────────────────────────────────────
      const ctx  = await browser.newContext({ viewport: DESKTOP });
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      } catch (e) {
        console.warn(`⚠ ${name} desktop goto: ${e.message}`);
      }
      await page.waitForTimeout(3000);

      const bodyH = await page.evaluate(() => document.body.scrollHeight);

      // Full-page screenshot (Playwright renders full scroll height)
      await page.screenshot({ path: path.join(DIR, `${name}-desktop.png`), fullPage: true });

      // Hero — top of page
      await clipAt(page, path.join(DIR, `${name}-hero.png`), 0, DESKTOP.width, DESKTOP.height);

      // Servicios — ~900px down
      await clipAt(page, path.join(DIR, `${name}-servicios.png`), Math.min(900, Math.max(0, bodyH - DESKTOP.height)), DESKTOP.width, DESKTOP.height);

      // Equipo — ~1800px down
      await clipAt(page, path.join(DIR, `${name}-equipo.png`), Math.min(1800, Math.max(0, bodyH - DESKTOP.height)), DESKTOP.width, DESKTOP.height);

      // CTA — bottom of page
      await clipAt(page, path.join(DIR, `${name}-cta.png`), Math.max(0, bodyH - DESKTOP.height), DESKTOP.width, DESKTOP.height);

      await ctx.close();

      // ── Mobile ───────────────────────────────────────────────
      const ctx2  = await browser.newContext({ viewport: MOBILE });
      const page2 = await ctx2.newPage();
      try {
        await page2.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      } catch (e) {
        console.warn(`⚠ ${name} mobile goto: ${e.message}`);
      }
      await page2.waitForTimeout(3000);
      await page2.screenshot({ path: path.join(DIR, `${name}-mobile.png`), fullPage: true });
      await ctx2.close();

      console.log(`✓ ${name} — captured`);
    } catch (err) {
      console.warn(`⚠ ${name} failed: ${err.message} — skipping`);
    }
  }

  await browser.close();
  console.log('All screenshots saved to /screenshots/');
}

capture().catch(err => { console.error(err.message); process.exit(1); });
