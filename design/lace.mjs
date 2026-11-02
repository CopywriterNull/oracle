// Turns the generated white-on-black lace (design/lace-src) into transparent, tinted, seamless WebP assets in public/lace.
import { chromium } from '/Users/lennyhuynh/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const src = new URL('./lace-src/', import.meta.url).pathname, out = new URL('../public/lace/', import.meta.url).pathname;
const b = await chromium.launch(); const p = await b.newPage();
const jobs = [
  // name, source, mode, tint, opts
  ['trim-down', 'trim.png', 'lace', [255, 251, 242], { crop: 'rows', height: 96, mirrorX: true, black: 150, gamma: 1 }],
  ['trim-up', 'trim.png', 'lace', [255, 251, 242], { crop: 'rows', height: 96, mirrorX: true, flipY: true, black: 150, gamma: 1 }],
  ['corner', 'corner.png', 'lace', [196, 168, 112], { crop: 'box', width: 256 }],
  ['corner-white', 'corner.png', 'lace', [255, 251, 242], { crop: 'box', width: 256 }],
  ['doily', 'doily.png', 'lace', [255, 251, 242], { crop: 'box', width: 480 }],
  ['bow', 'bow.png', 'solid', null, { crop: 'box', width: 240 }],
  ['fabric', 'fabric.png', 'lace', [255, 255, 255], { width: 240, mirrorX: true, mirrorY: true }],
];
for (const [name, file, mode, tint, o] of jobs) {
  const data = 'data:image/png;base64,' + readFileSync(src + file).toString('base64');
  const webp = await p.evaluate(async ({ data, mode, tint, o }) => {
    const img = new Image(); img.src = data; await img.decode();
    let c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    let x = c.getContext('2d'); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height), px = d.data, W = c.width, H = c.height;
    for (let i = 0; i < px.length; i += 4) {
      const lum = (px[i] + px[i + 1] + px[i + 2]) / 3;
      if (mode === 'lace') { // thread brightness becomes opacity; colour is the tint
        const a = Math.pow(Math.min(1, Math.max(0, (lum - (o.black ?? 34)) / (200 - (o.black ?? 34)))), o.gamma ?? 0.85);
        px[i] = tint[0]; px[i + 1] = tint[1]; px[i + 2] = tint[2]; px[i + 3] = a * 255;
      } else { px[i + 3] = Math.min(1, Math.max(0, (lum - 10) / 30)) * 255; } // solid object: keep its shading
    }
    x.putImageData(d, 0, 0);
    // crop to the lace
    let [x0, y0, x1, y1] = [0, 0, W, H];
    const rowA = (y) => { let s = 0; for (let i = 0; i < W; i += 4) s += px[(y * W + i) * 4 + 3]; return s / (W / 4) / 255; };
    const colA = (cx) => { let s = 0; for (let y = 0; y < H; y += 4) s += px[(y * W + cx) * 4 + 3]; return s / (H / 4) / 255; };
    if (o.crop) {
      y0 = 0; while (y0 < H && rowA(y0) < .03) y0++; y1 = H; while (y1 > y0 && rowA(y1 - 1) < .03) y1--;
      if (o.crop === 'box') { x0 = 0; while (x0 < W && colA(x0) < .01) x0++; x1 = W; while (x1 > x0 && colA(x1 - 1) < .01) x1--; }
      else { x0 = Math.round(W * .02); x1 = Math.round(W * .98); }
    }
    const cw = x1 - x0, ch = y1 - y0;
    const tw = o.height ? Math.round(cw * o.height / ch) : o.width, th = o.height || Math.round(ch * o.width / cw);
    const nx = o.mirrorX ? 2 : 1, ny = o.mirrorY ? 2 : 1;
    const oc = document.createElement('canvas'); oc.width = tw * nx; oc.height = th * ny;
    const ox = oc.getContext('2d'); ox.imageSmoothingQuality = 'high';
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { // mirrored copies make the tile seamless
      ox.save(); ox.translate(i ? 2 * tw : 0, j ? 2 * th : 0); ox.scale(i ? -1 : 1, j ? -1 : 1);
      if (o.flipY) { ox.translate(0, th); ox.scale(1, -1); }
      ox.drawImage(c, x0, y0, cw, ch, 0, 0, tw, th); ox.restore();
    }
    return oc.toDataURL('image/webp', 0.86);
  }, { data, mode, tint, o });
  writeFileSync(out + name + '.webp', Buffer.from(webp.split(',')[1], 'base64'));
}
await b.close();
