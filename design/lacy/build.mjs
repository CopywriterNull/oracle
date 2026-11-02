// 10 "more lace, more polka dots, cuter" flow concepts, 5 phone screens each (start, ask, how, cast, result).
// node design/lacy/build.mjs  ->  design/lacy/NN-name.html + .png + sheet.png
import { chromium } from '/Users/lennyhuynh/node_modules/playwright/index.mjs';
import { writeFileSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
// served over http, because Chrome blocks CSS mask images loaded from file://
const ROOT = new URL('../../', import.meta.url).pathname;
const TYPES = { html: 'text/html', webp: 'image/webp', png: 'image/png' };
const srv = createServer((q, r) => { try { const f = decodeURIComponent(q.url.split('?')[0]); r.writeHead(200, { 'Content-Type': TYPES[f.split('.').pop()] || 'text/plain' }); r.end(readFileSync(ROOT + f)); } catch { r.writeHead(404); r.end(); } }).listen(4997);
const URL0 = 'http://localhost:4997/design/lacy/';
const DIR = new URL('./', import.meta.url).pathname, L = '../../public/lace/';
const dots = (c, s = 14, r = 16, base = 'transparent') => `radial-gradient(${c} ${r}%,transparent ${r + 2}%) 0 0/${s}px ${s}px,radial-gradient(${c} ${r}%,transparent ${r + 2}%) ${s / 2}px ${s / 2}px/${s}px ${s}px,${base}`;
const T = [
  { n: 'Midnight Lace Deluxe', d: 'What is live, turned up: lace valance and curtains, a rose-lace sky, doily altar, lace-edged buttons.',
    bg: 'linear-gradient(#1d2347,#2d2f5e 60%,#4a3f6b)', over: 'fabric', overO: .1, pi: '#f6efe0', pm: '#d3cee8', lc: '#fffaf2', curtains: 1,
    card: '#fbf6ec', ink: '#2b2740', mu: '#6f6888', dot: 'rgba(168,130,47,.15)', ac: '#a8822f', c2: '#c4a870', btn: 'lacepill', bf: '#fbf6ec', bi: '#2b2740',
    back: dots('#f2d8a7', 10, 16, '#2d2f5e'), hero: 'doily', star: '#f2d8a7' },
  { n: 'Noir Lace', d: 'Black and cream like her lace-frame refs. White lace on black, cream paper with black dots, sewn ticket buttons.',
    bg: 'radial-gradient(circle at 50% 20%,#2a2a2e,#0d0d0f 70%)', over: 'fabric', overO: .16, pi: '#f4efe6', pm: '#bdb7ad', lc: '#f4efe6', curtains: 1,
    card: '#f4efe6', ink: '#161616', mu: '#6a645c', dot: 'rgba(20,20,20,.16)', ac: '#161616', c2: '#bfb3a0', btn: 'ticket', bf: '#f4efe6', bi: '#161616',
    back: dots('#f4efe6', 10, 16, '#161616'), hero: 'frame', star: '#f4efe6' },
  { n: 'Cream Polka', halo: '#f3ece0', d: 'Cream paper covered in black polka dots with black lace trim and a black doily. Bold and cute.',
    bg: dots('#1b1b1b', 22, 9, '#f3ece0'), pi: '#1b1b1b', pm: '#5a524a', lc: '#1b1b1b', ink: '#1b1b1b', card: '#fffaf3', mu: '#7a7066', dot: 'rgba(27,27,27,.08)', ac: '#1b1b1b', c2: '#1b1b1b',
    btn: 'polka', bf: '#1b1b1b', bi: '#fffaf3', back: dots('#1b1b1b', 10, 16, '#fffaf3'), hero: 'doily', star: '#1b1b1b', paperBorder: '#1b1b1b' },
  { n: 'Mocha Scrapbook', halo: '#3b2a22', d: 'Brown and cream collage from her scrapbook refs: lace frames, washi tape, a lace lily, ribbon buttons.',
    bg: dots('rgba(243,231,211,.55)', 20, 9, '#3b2a22'), pi: '#f3e7d3', pm: '#cdb9a0', lc: '#f3e7d3', card: '#f5ecdc', ink: '#3b2a22', mu: '#8a6f5a', dot: 'rgba(139,94,60,.14)', ac: '#8b5e3c', c2: '#b89a78',
    btn: 'ribbon', bf: '#f5ecdc', bi: '#3b2a22', back: dots('#f3e7d3', 10, 16, '#5a3f31'), hero: 'scrap', star: '#f3e7d3', tape: 1 },
  { n: 'Pink Chantilly', d: 'Blush pink lace fabric everywhere, white lace, heart doily and pink lace buttons. The softest one.',
    bg: 'linear-gradient(#f8dfe6,#f2cdd8)', over: 'fabric', overO: .55, pi: '#5b2e46', pm: '#8d5a72', lc: '#ffffff', curtains: 1, card: '#fffafb', ink: '#5b2e46', mu: '#9a6a80', dot: 'rgba(201,112,142,.16)', ac: '#c9708e', c2: '#e8b3c4',
    btn: 'pink', bf: '#f6d6de', bi: '#5b2e46', back: dots('#ffffff', 10, 16, '#e7a3b8'), hero: 'heart', star: '#ffffff' },
  { n: 'Starry Swirl', halo: '#1c1e2e', d: 'Her painted swirl-galaxy fabric as the sky, silver stars, white lace and frosted glass buttons.',
    bg: `url(${L}swirl.webp) 0 0/300px`, pi: '#f1ede6', pm: '#c9c6d6', lc: '#f1ede6', card: '#f6f2ea', ink: '#2a2d3f', mu: '#6d7396', dot: 'rgba(109,115,150,.14)', ac: '#5d6386', c2: '#b3b6c9',
    btn: 'glass', bf: '', bi: '#f1ede6', back: `url(${L}swirl.webp) 0 0/80px`, hero: 'doily', star: '#ffffff' },
  { n: 'Lace Window', d: 'A frosted window with a lace lily curtain. Silver, white and pearl buttons, quiet like morning light.',
    bg: 'linear-gradient(#d7dde4,#a9b3c0)', over: 'fabric', overO: .35, pi: '#2f3542', pm: '#4f5869', lc: '#ffffff', curtains: 1, card: '#ffffff', ink: '#2f3542', mu: '#6b7489', dot: 'rgba(107,122,153,.14)', ac: '#6b7a99', c2: '#c3cad6',
    btn: 'pearl', bf: '#fbfbfb', bi: '#2f3542', back: dots('#ffffff', 10, 16, '#8e9ab0'), hero: 'lily', star: '#ffffff' },
  { n: 'Mint Angel', halo: '#c4efe2', d: 'Mint and cocoa polka dots with stars, like her mint ref. White lace hearts and bow buttons. Playful Y2K.',
    bg: dots('#7a5a46', 26, 11, '#c4efe2'), pi: '#4a3428', pm: '#6d5345', lc: '#ffffff', card: '#fffdf8', ink: '#4a3428', mu: '#8a7062', dot: 'rgba(122,90,70,.12)', ac: '#7a5a46', c2: '#a7dccb',
    btn: 'bowpill', bf: '#fffdf8', bi: '#4a3428', back: dots('#c4efe2', 10, 16, '#7a5a46'), hero: 'heart', star: '#7a5a46', bandTop: '#5b4033' },
  { n: 'Grey Tulle', halo: '#6a6a70', d: 'Grey felt with white polka dots, tulle and lace swatches, silver stars. Like her grey collage refs.',
    bg: dots('rgba(255,255,255,.85)', 18, 10, '#76767c'), over: 'fabric', overO: .12, pi: '#ffffff', pm: '#e4e4e8', lc: '#ffffff', card: '#f2f0ec', ink: '#2c2c30', mu: '#6c6c72', dot: 'rgba(44,44,48,.1)', ac: '#2c2c30', c2: '#c7c7cc',
    btn: 'ticket', bf: '#f2f0ec', bi: '#2c2c30', back: dots('#ffffff', 10, 16, '#58585e'), hero: 'doily', star: '#ffffff' },
  { n: 'Lily Altar', d: 'Ivory and beige lace with a lace lily bouquet behind the card and blush glow. Gentle and bridal.',
    bg: 'radial-gradient(circle at 50% 30%,#fbe9e9,#f4efe6 60%)', over: 'fabric', overO: .0, pi: '#3a3330', pm: '#7d716a', lc: '#d9c9b0', card: '#fffdf9', ink: '#3a3330', mu: '#8a7d73', dot: 'rgba(180,138,90,.13)', ac: '#b48a5a', c2: '#e2d3bc',
    btn: 'bowpill', bf: '#fffdf9', bi: '#3a3330', back: dots('#d9c9b0', 10, 16, '#fffdf9'), hero: 'lily', star: '#d4b48a' },
];
const SP = '<svg viewBox="0 0 20 20"><path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z"/></svg>';
let seed = 3; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const sky = (n) => Array.from({ length: n }, () => { const s = rnd() < .3 ? 6 + rnd() * 9 : 0; const pos = `left:${(rnd() * 96).toFixed(1)}%;top:${(rnd() * 96).toFixed(1)}%`; return s ? `<i class="sp" style="${pos};width:${s}px;height:${s}px">${SP}</i>` : `<i class="dt" style="${pos}"></i>`; }).join('');
const btn = (t, label, sec) => `<button class="b b-${t.btn}${sec ? ' sec' : ''}">${t.btn === 'polka' ? `<span>${label}</span>` : label}</button>`;
const hex = (lines, mv) => `<div class="hex">${lines.map((l, i) => `<div class="ln${l ? '' : ' yin'}${i === mv ? ' mv' : ''}"><i></i><i></i></div>`).join('')}</div>`;
const paper = (inner, cls = '', bow = true) => `<div class="paper ${cls}"><i class="edge top"></i><i class="edge bot"></i><i class="cn tl"></i><i class="cn tr"></i><i class="cn bl"></i><i class="cn br"></i>${bow ? '<i class="bow"></i>' : ''}<div class="pin">${inner}</div></div>`;
const coins = '<span class="coins"><i class="coin h"></i><i class="coin"></i><i class="coin h"></i></span>';
const hero = (t) => {
  const card = `<div class="day">${hex([1, 0, 1, 1, 1, 1])}<b>同人</b></div>`;
  const back = { doily: `<i class="mk doily"></i>`, heart: `<i class="mk heartd"></i>`, frame: `<i class="mk framed"></i>`, lily: `<i class="mk lilyd"></i>`,
    scrap: `<i class="mk framed small"></i><i class="mk lilyd side"></i><i class="tape t1"></i><i class="tape t2"></i>` }[t.hero];
  return `<div class="altar">${back}${card}<span class="acoins">${coins}</span></div>`;
};
const chrome = (t, body) => `<div class="ph"><div class="bgl"></div>${t.over ? '<div class="ov"></div>' : ''}<div class="sky">${sky(22)}</div>
  <i class="val"></i>${t.curtains ? '<i class="cur l"></i><i class="cur r"></i>' : ''}<div class="scr">${body}</div></div>`;
const screens = (t) => [
  ['Start', chrome(t, `<p class="kick">Oracle</p><h1>Find your answer</h1><p class="sub">Find your quiet sign</p>${hero(t)}
    <p class="lbl">Today&rsquo;s sign</p><p class="nm">13 · Fellowship <span>同人</span></p><div class="stars">${`<i class="on">${SP}</i>`.repeat(4)}${`<i>${SP}</i>`.repeat(3)}</div>
    <div class="foot">${btn(t, 'Ask the oracle')}</div>`)],
  ['Ask', chrome(t, `<p class="back">&larr; Home</p><h2>What&rsquo;s on your mind?</h2>${paper(`<p class="q">Should I reach out to them this week?</p><p class="cnt">36/300</p>`, 'qp', true)}
    <div class="chip"><span>Today&rsquo;s prompt</span>Where should my energy go this week?</div><div class="foot">${btn(t, 'Continue')}</div>`)],
  ['How', chrome(t, `<p class="back">&larr; Back</p><h2>How should we read it?</h2><p class="echo">&ldquo;Should I reach out to them this week?&rdquo;</p>
    <div class="doors">${paper(`${coins}<em>六爻</em><b>I Ching</b><small>Toss three coins</small>`, 'door', false)}${paper(`<span class="minis"><i></i><i></i><i></i></span><em>塔罗</em><b>Tarot</b><small>Pick from the deck</small>`, 'door', false)}</div>
    <div class="tog"><i class="on"><b></b></i>Just a yes or no?</div>`)],
  ['Cast', chrome(t, `<p class="back">&larr; Back</p><h2>Pick three cards</h2><p class="echo">&ldquo;Should I reach out to them this week?&rdquo;</p>
    <div class="slots"><div class="fc face"><b>XVII</b><span>The Star</span><span class="zh">星星</span></div><div class="fc bk"></div><div class="fc empty"></div></div>
    <div class="fan">${Array.from({ length: 11 }, (_, i) => `<i class="bk" style="--i:${i - 5}"></i>`).join('')}</div><p class="ins">1 more</p>`)],
  ['Result', chrome(t, `<p class="back">&larr; Home</p>${paper(`<p class="date">November 2, 2026</p><p class="yq">&ldquo;Should I reach out to them this week?&rdquo;</p>
    <div class="sign"><span class="wm">同人</span>${hex([1, 0, 1, 1, 1, 1], 3)}</div><p class="sn">13 · Fellowship 同人</p><h3>Leaning yes, reach out gently</h3>
    <p class="body">Fellowship favors honest connection. A short, warm message tends to be welcomed this week.</p><div class="step"><span>Small step</span>Send one kind line tonight.</div>`, 'keep')}
    <div class="acts">${btn(t, 'Save image', true)}${btn(t, 'Ask another')}</div>`)],
];
const css = (t) => `
*{box-sizing:border-box;margin:0}body{background:#ece7e1;font-family:Jost,sans-serif;padding:34px 40px}
.head h1{font:400 44px 'Instrument Serif',serif;color:#2b2740}.head p{color:#6f6888;font-size:16px;margin:4px 0 26px;max-width:900px}
.row{display:flex;gap:26px}.col{display:flex;flex-direction:column;align-items:center;gap:10px}.col>span{font:500 13px Jost;letter-spacing:.2em;text-transform:uppercase;color:#8a8399}
.ph{width:300px;height:650px;border-radius:38px;position:relative;overflow:hidden;box-shadow:0 0 0 8px #1a1a1f,0 30px 50px -20px #0008;color:${t.pi};font-size:12.5px}
.bgl{position:absolute;inset:0;background:${t.bg}}
.ov{position:absolute;inset:0;background:url(${L}fabric.webp) 0 0/220px;opacity:${t.overO ?? .1};${t.pi === '#2f3542' || t.pi === '#5b2e46' ? 'mix-blend-mode:screen;' : ''}}
.sky{position:absolute;inset:0;pointer-events:none}.sky .sp{position:absolute;color:${t.star};opacity:.85}.sky .sp svg{width:100%;height:100%;fill:currentColor;display:block}
.sky .dt{position:absolute;width:2.5px;height:2.5px;border-radius:50%;background:${t.star};opacity:.6}
.m,.val,.cur,.edge,.cn,.mk{display:block}
.val{position:absolute;top:0;left:0;right:0;height:26px;background:${t.lc};-webkit-mask:url(${L}trim-down.webp) 0 0/auto 26px repeat-x;z-index:3}
${t.bandTop ? `.val{top:14px}.ph::after{content:"";position:absolute;top:0;left:0;right:0;height:16px;background:${t.bandTop};z-index:3}` : ''}
.cur{position:absolute;top:0;width:650px;height:20px;background:${t.lc};-webkit-mask:url(${L}trim-up.webp) 0 0/auto 20px repeat-x;transform-origin:0 0;z-index:2;opacity:.95}
.cur.l{left:0;transform:rotate(90deg) translateY(-20px)}.cur.r{left:280px;transform:rotate(90deg) scaleY(-1)}
.scr{position:absolute;inset:34px 26px 20px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:4}
.kick{font-size:9px;letter-spacing:.32em;text-transform:uppercase;font-weight:500;color:${t.pm}}
h1{font:400 38px/1 'Instrument Serif',serif;margin-top:6px}h2{font:400 26px/1.1 'Instrument Serif',serif;margin:4px 0 12px}
.sub{font:italic 16px 'Instrument Serif',serif;color:${t.pm};margin-top:4px}.back{align-self:flex-start;color:${t.pm};font-size:12px;margin:2px 0 6px}
.altar{position:relative;width:220px;height:200px;margin:8px 0 4px;display:grid;place-items:center}
.mk{position:absolute;background:${t.lc};-webkit-mask-size:contain;-webkit-mask-repeat:no-repeat;-webkit-mask-position:center}
.doily{inset:0;-webkit-mask-image:url(${L}doily.webp)}.heartd{inset:-6px;-webkit-mask-image:url(${L}heart.webp)}.framed{inset:-4px 20px;-webkit-mask-image:url(${L}frame.webp)}
.framed.small{inset:6px 40px 10px 10px;transform:rotate(-6deg)}.lilyd{inset:-14px -10px;-webkit-mask-image:url(${L}lily.webp);opacity:.95}.lilyd.side{inset:10px -40px 0 110px;transform:rotate(14deg)}
.tape{position:absolute;width:62px;height:16px;background:repeating-linear-gradient(90deg,#e9d3b5aa 0 6px,#f3e7d3aa 6px 12px);z-index:3}.t1{top:18px;left:40px;transform:rotate(-24deg)}.t2{bottom:22px;right:46px;transform:rotate(-18deg)}
.day{position:relative;z-index:2;width:82px;height:128px;border-radius:8px;transform:rotate(-5deg);background:${dots(t.dot, 9, 14, t.card)};border:1px solid ${t.c2};box-shadow:0 12px 22px -10px #0009;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:${t.ac}}
.day::before{content:"";position:absolute;top:-17px;left:50%;width:42px;height:36px;translate:-50% 0;background:url(${L}bow.webp) center/contain no-repeat}
.day b{font:500 15px 'Noto Serif SC',serif;color:${t.ink}}.day .hex{width:42px;gap:4px}.day .ln{height:4px}
.acoins{position:absolute;right:6px;bottom:18px;z-index:3}.acoins .coin{font-size:6px}
.lbl{font-size:8.5px;letter-spacing:.24em;text-transform:uppercase;font-weight:500;color:${t.pm};margin-top:4px}.nm{font:400 17px 'Instrument Serif',serif}.nm span{font:13px 'Noto Serif SC';opacity:.75}
.stars{display:flex;gap:6px;margin-top:10px}.stars i{width:12px;height:12px;color:${t.star};opacity:.3}.stars i.on{opacity:1;filter:drop-shadow(0 0 4px ${t.star})}.stars svg{width:100%;height:100%;fill:currentColor}
.foot{margin-top:auto;width:100%}
.coin{font-size:8px;width:4.4em;height:4.4em;border-radius:50%;position:relative;display:inline-grid;place-items:center;background:radial-gradient(circle at 35% 30%,#fff1c9,#e0bb68 50%,#a8822f);box-shadow:inset 0 0 0 .3em rgba(120,80,20,.3),0 .5em 1em -.5em #000;margin:0 -2px}
.coin::before{content:"";width:1.15em;height:1.15em;background:#1d2347}.coin.h::after{content:"通\\A\\A寶";white-space:pre;position:absolute;inset:0;display:grid;place-items:center;font:500 1.05em/1.15 'Noto Serif SC';color:#6b4d16}
/* paper with lace edges, dots, corners, bow */
.paper{position:relative;width:100%;--e:22px;padding:var(--e) 0;color:${t.ink};filter:drop-shadow(0 12px 16px rgba(0,0,0,.28))}
.pin{position:relative;background:${dots(t.dot, 12, 13, t.card)};${t.paperBorder ? `outline:1.5px solid ${t.paperBorder};outline-offset:-6px;` : ''}padding:18px 16px;display:flex;flex-direction:column;align-items:center;gap:8px}
.pin::before{content:"";position:absolute;inset:6px;border:1px solid ${t.c2};border-radius:6px;pointer-events:none}
.edge{position:absolute;left:0;right:0;height:var(--e);background:${t.lc === t.card ? t.c2 : t.lc}}
.edge.top{top:0;-webkit-mask:url(${L}trim-up.webp) 0 0/auto var(--e) repeat-x}.edge.bot{bottom:0;-webkit-mask:url(${L}trim-down.webp) 0 0/auto var(--e) repeat-x}
.cn{position:absolute;width:40px;height:40px;background:${t.c2};-webkit-mask:url(${L}corner-white.webp) 0 0/contain no-repeat;z-index:2;opacity:.9}
.cn.tl{top:calc(var(--e) + 3px);left:3px}.cn.tr{top:calc(var(--e) + 3px);right:3px;transform:scaleX(-1)}.cn.bl{bottom:calc(var(--e) + 3px);left:3px;transform:scaleY(-1)}.cn.br{bottom:calc(var(--e) + 3px);right:3px;transform:scale(-1)}
.bow{position:absolute;top:-6px;left:50%;width:62px;height:54px;translate:-50% 0;background:url(${L}bow.webp) center/contain no-repeat;z-index:3;filter:drop-shadow(0 4px 4px #0004)}
.qp .pin{min-height:150px;justify-content:center}.q{font:400 22px/1.25 'Instrument Serif',serif}.cnt{font-size:10px;color:${t.mu};align-self:flex-end}
.chip{margin-top:12px;width:100%;text-align:left;border:1px dashed ${t.pm};border-radius:12px;padding:9px 11px;font-size:12px;background:rgba(255,255,255,.07)}.chip span{display:block;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:${t.pm};font-weight:500}
.echo{font:italic 14px/1.3 'Instrument Serif',serif;color:${t.pm};margin:-6px 0 10px}
.doors{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}.door .pin{padding:18px 6px 14px;gap:5px}.door em{font:normal 15px 'Noto Serif SC';color:${t.ac}}.door b{font:400 21px 'Instrument Serif',serif}.door small{font-size:10px;color:${t.mu}}
.door .coins .coin{font-size:5.5px}.minis{display:flex}.minis i{width:20px;height:32px;border-radius:3px;border:2px solid #fff;background:${t.back};margin:0 -3px;transform:rotate(-8deg)}.minis i:nth-child(2){transform:rotate(6deg) translateY(-3px)}
.tog{display:flex;align-items:center;gap:9px;margin-top:18px;font-size:13px}.tog i{width:36px;height:21px;border-radius:99px;background:${t.ac};position:relative}.tog b{position:absolute;right:2px;top:2px;width:17px;height:17px;border-radius:50%;background:#fff}
.slots{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;width:100%;margin-top:10px}.fc{aspect-ratio:2/3.2;border-radius:7px}
.fc.face{background:#fff;border:1px solid ${t.c2};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:${t.ink}}.fc.face b{font:400 20px 'Instrument Serif';color:${t.ac}}.fc.face span{font:12px 'Instrument Serif'}.fc.face .zh{font:10px 'Noto Serif SC';opacity:.7}
.bk{background:${t.back};border:2.5px solid #fff}.fc.empty{border:1.5px dashed ${t.pm}}
.fan{position:relative;width:100%;height:150px;margin-top:auto}.fan i{position:absolute;left:50%;bottom:6px;width:52px;height:80px;margin-left:-26px;border-radius:6px;transform-origin:50% 230%;rotate:calc(var(--i) * 6deg);box-shadow:0 6px 12px -6px #000}
.ins{margin:6px 0 10px;color:${t.pm}}
.keep .pin{padding:30px 16px 18px;gap:7px}.date{font-size:8px;letter-spacing:.24em;text-transform:uppercase;color:${t.mu};font-weight:500}.yq{font:italic 13px/1.3 'Instrument Serif';color:${t.mu}}
.sign{position:relative;display:grid;place-items:center;padding:6px 0}.wm{position:absolute;font:500 70px/1 'Noto Serif SC';color:${t.ac};opacity:.1}
.hex{display:flex;flex-direction:column-reverse;gap:7px;width:96px}.ln{height:8px;display:flex;color:${t.ac}}.ln i{flex:1;background:currentColor;border-radius:2px}.ln.yin{gap:16%}.ln:not(.yin) i+i{display:none}.ln.mv{color:${t.ink}}
.sn{font:13px 'Instrument Serif';letter-spacing:.12em;text-transform:uppercase;color:${t.mu}}h3{font:italic 400 21px/1.1 'Instrument Serif',serif}.body{font-size:11.5px;line-height:1.5;text-align:left}
.step{width:100%;text-align:left;font-size:11px;border:1px dashed ${t.ac};border-radius:10px;padding:7px 10px;background:rgba(0,0,0,.03)}.step span{display:block;font-size:7.5px;letter-spacing:.16em;text-transform:uppercase;color:${t.ac};font-weight:500}
${t.halo ? `.scr>h1,.scr>h2,.scr>p,.tog,.nm,.lbl{text-shadow:0 0 6px ${t.halo},0 0 12px ${t.halo},0 0 18px ${t.halo}}.chip{background:${t.halo}cc}` : ''}
.acts{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;margin-top:8px}
/* buttons */
.b{font:500 13.5px Jost;letter-spacing:.05em;border:0;width:100%;padding:12px;position:relative;color:${t.bi};background:${t.bf}}
.b-lacepill{border-radius:99px;margin:10px 0}.b-lacepill::before,.b-lacepill::after{content:"";position:absolute;left:20px;right:20px;height:10px;background:${t.lc};pointer-events:none}
.b-lacepill::before{top:-9px;-webkit-mask:url(${L}trim-up.webp) 0 0/auto 22px repeat-x}.b-lacepill::after{bottom:-9px;-webkit-mask:url(${L}trim-down.webp) 0 100%/auto 22px repeat-x}
.b-ticket{border-radius:3px;box-shadow:inset 0 0 0 5px ${t.bf},inset 0 0 0 6.5px ${t.bi}}.b-ticket::after{content:"";position:absolute;inset:5px 10px;border:1px dashed ${t.bi};opacity:.5}
.b-polka{border-radius:99px;background:${dots(t.bi, 10, 16, t.bf)};border:2px solid ${t.bf}}.b-polka span{white-space:nowrap;background:${t.bf};color:${t.bi};padding:3px 8px;border-radius:99px}
.b-ribbon{clip-path:polygon(0 0,100% 0,94% 50%,100% 100%,0 100%,6% 50%);background:linear-gradient(#fbf4e8,#ead9bf)}.b-ribbon::after{content:"";position:absolute;inset:4px 8%;border-top:1px dashed ${t.ac};border-bottom:1px dashed ${t.ac}}
.b-pink{border-radius:99px;background:url(${L}fabric.webp) 0 0/110px,linear-gradient(#f9dbe3,#efc0cd);background-blend-mode:soft-light;box-shadow:inset 0 0 0 2px #fff9,0 8px 16px -8px #0006}
.b-glass{border-radius:99px;background:linear-gradient(135deg,rgba(255,255,255,.22),rgba(255,255,255,.06));backdrop-filter:blur(6px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.45),0 0 18px rgba(255,255,255,.18)}
.b-pearl{border-radius:99px;background:linear-gradient(#fff,#eef0f4);box-shadow:0 8px 16px -8px #0005}.b-pearl::after{content:"";position:absolute;inset:-5px;border-radius:99px;padding:5px;background:radial-gradient(circle at 40% 35%,#fff 0 1.2px,#eceff3 2px,#b9c0cc 3.8px,transparent 4.2px) 0 0/10px 10px;-webkit-mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
.b-bowpill{border-radius:99px;box-shadow:0 8px 16px -8px #0006}.b-bowpill::before{content:"";position:absolute;left:6px;top:50%;width:34px;height:30px;translate:0 -54%;background:url(${L}bow.webp) center/contain no-repeat}
.b.sec{background:transparent;color:${t.pi};box-shadow:inset 0 0 0 1.3px ${t.pm};clip-path:none;border-radius:99px;margin:0}.b.sec::before,.b.sec::after{display:none}
.b-polka.sec{border:0;background:transparent}.b-polka.sec span{background:none;color:${t.pi}}
`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1720, height: 900 }, deviceScaleFactor: 1.5 });
const files = [];
for (const [i, t] of T.entries()) {
  const name = `${String(i + 1).padStart(2, '0')}-${t.n.toLowerCase().replace(/\s+/g, '-')}`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${t.n}</title><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Jost:wght@400;500&family=Noto+Serif+SC:wght@400;500&display=swap" rel="stylesheet"><style>${css(t)}</style></head>
<body><div class="head"><h1>${i + 1}. ${t.n}</h1><p>${t.d}</p></div><div class="row">${screens(t).map(([k, s]) => `<div class="col">${s}<span>${k}</span></div>`).join('')}</div></body></html>`;
  writeFileSync(DIR + name + '.html', html);
  await p.goto(URL0 + name + '.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  await p.screenshot({ path: DIR + name + '.png', fullPage: true }); files.push(name + '.png');
}
writeFileSync(DIR + 'sheet.html', `<body style="margin:0;background:#ece7e1;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:10px">${files.map((f) => `<img src="${f}" style="width:100%">`).join('')}</body>`);
await p.setViewportSize({ width: 2400, height: 900 }); await p.goto(URL0 + 'sheet.html'); await p.waitForTimeout(800);
await p.screenshot({ path: DIR + 'sheet.png', fullPage: true });
await b.close(); srv.close();
console.log(files.join('\n'));
