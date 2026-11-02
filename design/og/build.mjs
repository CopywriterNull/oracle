// Renders public/og.png (1200x630 link preview) from the live page's own styles and lace assets.
// node design/og/build.mjs   (masks/backgrounds need http, so public/ is served on :4996)
import { chromium } from '/Users/lennyhuynh/node_modules/playwright/index.mjs';
import { createServer } from 'node:http'; import { readFileSync } from 'node:fs';
const root = new URL('../../public/', import.meta.url).pathname;
const types = { html: 'text/html', webp: 'image/webp', svg: 'image/svg+xml', png: 'image/png' };
const srv = createServer((q, r) => { const f = q.url.split('?')[0] === '/' ? 'index.html' : q.url.split('?')[0].slice(1); try { const d = readFileSync(root + f); r.writeHead(200, { 'Content-Type': types[f.split('.').pop()] || 'text/plain' }); r.end(d); } catch { r.writeHead(404); r.end('{}'); } }).listen(4996);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.route('**/api/**', (r) => r.fulfill({ json: {} }));
await p.goto('http://localhost:4996/', { waitUntil: 'networkidle' });
await p.evaluate(() => {
  document.querySelector('main').innerHTML = `
  <div class="og">
    <div class="og-altar"><div class="doily"></div><div class="daycard cardback"></div>
      <i class="coin heads c1"></i><i class="coin c2"></i><i class="coin heads c3"></i></div>
    <div class="og-text">
      <p class="kicker">Oracle</p>
      <h1>Find your answer</h1>
      <p class="og-sub">Soft readings from I Ching and Tarot</p>
      <p class="og-zh">六爻 · 塔罗</p>
    </div>
  </div>`;
  document.querySelector('.tools')?.remove();
  const s = document.createElement('style');
  s.textContent = `
  html,body{width:1200px;height:630px;overflow:hidden;min-height:0}
  body::after{content:"";position:fixed;left:0;right:0;bottom:0;height:30px;background:url(/lace/trim-up.webp) 0 0/auto 30px repeat-x;opacity:.95}
  main{max-width:none;padding:0;min-height:0}
  .og{display:flex;align-items:center;gap:40px;height:630px;padding:0 90px 0 70px}
  .og-altar{position:relative;width:440px;height:440px;flex:none}
  .og-altar .doily{width:440px;height:440px;animation:none}
  .og-altar .daycard{position:absolute;inset:0;margin:auto;width:132px;height:200px;animation:none}
  .og-altar .coin{position:absolute;font-size:13px;animation:none}
  .og-altar .c1{left:40px;bottom:58px;rotate:-14deg}.og-altar .c2{left:186px;bottom:16px}.og-altar .c3{right:40px;bottom:58px;rotate:12deg}
  .og-text,.og-text *{text-align:left!important}
  .og-text .kicker{text-align:left;font:500 20px var(--sans);letter-spacing:.42em;text-transform:uppercase;color:var(--gold);margin:0 0 14px}
  .og-text h1{font:400 108px/0.95 var(--serif);color:var(--page-ink);margin:0 0 22px;letter-spacing:-.01em}
  .og-sub{font:italic 36px/1.2 var(--serif);color:var(--page-muted);margin:0 0 18px}
  .og-zh{font:400 30px var(--zh);color:var(--gold);letter-spacing:.2em;margin:0}`;
  document.head.append(s);
});
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
await p.screenshot({ path: root + 'og.jpg', type: 'jpeg', quality: 88 });
await b.close(); srv.close();
