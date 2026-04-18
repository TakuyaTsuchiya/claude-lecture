const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/screenshot-slides.js <path/to/index.html>');
    process.exit(1);
  }

  const absPath = path.resolve(file);
  const outDir = `/tmp/slide-check/${path.dirname(file)}`;
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto(`file://${absPath}`);
  const count = await page.evaluate(() =>
    document.querySelectorAll('.slide').length
  );

  for (let i = 1; i <= count; i++) {
    await page.evaluate((idx) => {
      const slides = document.querySelectorAll('.slide');
      slides.forEach((s, j) => s.classList.toggle('active', j === idx - 1));
      const cur = document.getElementById('cur');
      if (cur) cur.textContent = idx;
    }, i);
    await page.waitForTimeout(100);
    const out = `${outDir}/p${i}.png`;
    await page.screenshot({ path: out });
    console.log(`P${i}: ${out}`);
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
