import { chromium } from '/Users/lennyhuynh/node_modules/playwright/index.mjs';
import { readdirSync } from 'node:fs';
const dir = new URL('./concepts/', import.meta.url).pathname;
const imgs = readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1640, height: 2400 } });
import { writeFileSync } from "node:fs"; writeFileSync(dir + "../sheet.html", `<body style="margin:0;display:grid;grid-template-columns:1fr 1fr">${imgs.map((f) => `<img src="concepts/${f}" style="width:820px">`).join('')}</body>`); await p.goto("file://" + dir + "../sheet.html");
await p.waitForTimeout(800);
await p.screenshot({ path: process.argv[2], fullPage: true }); await b.close();
