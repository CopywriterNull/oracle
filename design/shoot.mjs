import { chromium } from '/Users/lennyhuynh/node_modules/playwright/index.mjs';
import { readdirSync } from 'node:fs';
const dir = new URL('./concepts/', import.meta.url).pathname;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1632, height: 900 }, deviceScaleFactor: 2 });
for (const f of readdirSync(dir).filter((f) => f.endsWith('.html'))) {
  await p.goto('file://' + dir + f, { waitUntil: 'networkidle' });
  await p.screenshot({ path: dir + f.replace('.html', '.png'), fullPage: true });
}
await b.close();
