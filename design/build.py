# Builds 10 UI concept boards (start -> pick -> ask -> result) as HTML; shoot.mjs renders them to PNG.
import random, html, pathlib
OUT = pathlib.Path(__file__).parent / 'concepts'

SPARK = '<svg viewBox="0 0 20 20"><path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z"/></svg>'

def stars(seed, n, color, area=(0, 100), big=0.25):
    r = random.Random(seed); out = []
    for _ in range(n):
        s = r.choice([6, 8, 10, 14, 18]) if r.random() < big else r.choice([3, 4, 5])
        x, y = r.uniform(2, 96), r.uniform(*area)
        if s > 5:
            out.append(f'<i class="sp" style="left:{x:.1f}%;top:{y:.1f}%;width:{s}px;height:{s}px;color:{color};animation-delay:{r.random()*3:.1f}s">{SPARK}</i>')
        else:
            out.append(f'<i class="dot" style="left:{x:.1f}%;top:{y:.1f}%;width:{s/2}px;height:{s/2}px;background:{color}"></i>')
    return ''.join(out)

def dots(color, size=22, r=17, base='transparent'):
    return (f'radial-gradient({color} {r}%,transparent {r+1}%) 0 0/{size}px {size}px,'
            f'radial-gradient({color} {r}%,transparent {r+1}%) {size//2}px {size//2}px/{size}px {size}px,{base}')

THEMES = [
 dict(n='Midnight Lace', d='Navy starry sky behind cream lace cards. Gold sparkles, quiet and dreamy.',
      bg='linear-gradient(#1d2347,#2d2f5e 60%,#4a3f6b)', card='#fbf6ec', ink='#2b2740', muted='#8a83a3', page_ink='#f4ecdc', page_muted='#b9b3d6',
      accent='#c9a85a', btn='#f2d8a7', btn_ink='#2b2740', line='#d8c9a8', back=dots('#f2d8a7', 14, 16, '#2d2f5e'),
      title="'Cormorant Garamond'", hero='fan', star='#f2d8a7', nstars=46),
 dict(n='Strawberry Milk', d='Pink polka dots, white doily cards, cherry red details. The cutest one.',
      bg=dots('#ffffff', 26, 15, '#f7cfd6'), card='#fffafa', ink='#5a2a33', muted='#b07a84', page_ink='#7a2d3b', page_muted='#a65d6b',
      accent='#d9485f', btn='#e9566c', btn_ink='#fff', line='#f0b9c2', back=dots('#fff', 12, 18, '#e9566c'),
      title="'Fraunces'", hero='doily', star='#ffffff', nstars=0),
 dict(n='Dusk Sky', d='Lilac to peach sunset with first stars. Dotted buttons, soft and warm.',
      bg='linear-gradient(170deg,#5b5aa6 0%,#a989c9 40%,#f2b8b0 78%,#fbd9b8 100%)', card='#fff8f3', ink='#3d3356', muted='#9b8db3', page_ink='#fff8f3', page_muted='#f6e2ef',
      accent='#7d6bc4', btn=dots('rgba(255,255,255,.55)', 10, 18, '#ffd9c7'), btn_ink='#3d3356', line='#e6d3e8', back='linear-gradient(160deg,#5b5aa6,#f2b8b0)',
      title="'Instrument Serif'", hero='moon', star='#fff6d8', nstars=30, star_area=(0, 45)),
 dict(n='Constellation Lace', d='Cream paper, lace scallops, and gold constellations drawn across the cards.',
      bg='radial-gradient(circle at 15% 0,#f4e6da 0,transparent 45%),#f8f3ec', card='#fffdf9', ink='#3a332e', muted='#8a7f76', page_ink='#3a332e', page_muted='#8a7f76',
      accent='#b88a3e', btn='#e9c9c3', btn_ink='#3a332e', line='#d9cbbd', back='#2f3354', back_extra='const',
      title="'Cormorant Garamond'", hero='const', star='#c9a85a', nstars=14),
 dict(n='Moon Doily', d='A big round doily as the moon. Mint polka dots and white lace everywhere.',
      bg=dots('#bfe3d4', 24, 14, '#eaf6f0'), card='#ffffff', ink='#2f4a44', muted='#7a9a91', page_ink='#2f4a44', page_muted='#6f9087',
      accent='#5fa58d', btn='#9fd6c1', btn_ink='#1f3a33', line='#cde8de', back=dots('#ffffff', 12, 18, '#7cc2a8'),
      title="'Young Serif'", hero='doily', star='#5fa58d', nstars=0),
 dict(n='Blueberry Night', d='Powder blue dots fading into a starry navy sky. Silver stars, white lace.',
      bg='linear-gradient(#cfe0f5 0%,#cfe0f5 30%,#27355f 72%)', card='#ffffff', ink='#22305a', muted='#7d8bb0', page_ink='#22305a', page_muted='#6a79a3',
      accent='#5b7bd5', btn='#22305a', btn_ink='#eef3ff', line='#c9d6ee', back='radial-gradient(circle at 50% 40%,#5b7bd5,#22305a)',
      title="'Fraunces'", hero='fan', star='#ffffff', nstars=34, star_area=(55, 98), dots_top='#ffffff'),
 dict(n='Velvet Plum', d='Deep plum velvet, gold polka sprinkles and gold lace outlines. A little luxe.',
      bg=dots('rgba(214,178,98,.35)', 30, 7, 'radial-gradient(circle at 50% 0,#5a2a52,#2e1430)'), card='#2a1129', ink='#f5e6cf', muted='#c7a6b9', page_ink='#f5e6cf', page_muted='#c7a6b9',
      accent='#d6b262', btn='#d6b262', btn_ink='#2e1430', line='#8a6a3c', back=dots('#d6b262', 12, 14, '#4a1d45'),
      title="'Italiana'", hero='const', star='#e9cd8c', nstars=26),
 dict(n='Butter Cottage', d='Butter yellow with tiny dots, lace ribbons and star stickers. Cozy tarot cafe.',
      bg=dots('#efd98a', 16, 12, '#fff4c9'), card='#fffdf3', ink='#4a3b1f', muted='#9c8a5e', page_ink='#4a3b1f', page_muted='#8a7a50',
      accent='#e38b5c', btn='#f5a77d', btn_ink='#4a3b1f', line='#ead9a3', back=dots('#fff4c9', 12, 16, '#e38b5c'),
      title="'Fraunces'", hero='fan', star='#e38b5c', nstars=10),
 dict(n='Sticker Book', d='Starry stickers, dotted borders and washi tape on cream. Playful and handmade.',
      bg='#fbf5ee', card='#ffffff', ink='#3b3340', muted='#958a9c', page_ink='#3b3340', page_muted='#958a9c',
      accent='#7a6ad8', btn='#bfb4f7', btn_ink='#2a2340', line='#3b3340', back=dots('#ffe27a', 12, 16, '#7a6ad8'),
      title="'Young Serif'", hero='moon', star='#ffcf3f', nstars=12, sticker=True),
 dict(n='Lace Window', d='An arched window with a lace curtain and the night sky inside. Sage and cream.',
      bg='#eef2e8', card='#fffdf8', ink='#34402f', muted='#86937e', page_ink='#34402f', page_muted='#7a876f',
      accent='#6f8a68', btn='#cfdfc9', btn_ink='#34402f', line='#cdd8c4', back='radial-gradient(circle at 50% 30%,#3b4a6b,#1f2740)',
      title="'Cormorant Garamond'", hero='window', star='#fff3c8', nstars=8),
]

MOON = '<svg viewBox="0 0 40 40" class="moon"><path d="M26 4a16 16 0 1 0 10 26A14 14 0 0 1 26 4z"/></svg>'

def hero(t, i):
    k = t['hero']
    if k == 'fan':
        return f'''<div class="fan"><div class="tc b" style="transform:rotate(-14deg) translate(-38px,8px)"></div><div class="tc b" style="transform:rotate(14deg) translate(38px,8px)"></div><div class="tc b mid">{SPARK}</div></div>'''
    if k == 'doily':
        return f'<div class="doily"><div class="doily-in">{MOON}<b>神諭</b></div></div>'
    if k == 'moon':
        return f'<div class="bigmoon">{MOON}{stars(i*7, 9, t["accent"], big=1)}</div>'
    if k == 'const':
        return '''<div class="lacecard heroc"><svg viewBox="0 0 120 150" class="cst"><polyline points="20,30 45,52 38,88 70,104 98,78 88,40 60,26"/><g>''' + ''.join(f'<circle cx="{x}" cy="{y}" r="3"/>' for x, y in [(20,30),(45,52),(38,88),(70,104),(98,78),(88,40),(60,26)]) + '</g></svg></div>'
    if k == 'window':
        return f'<div class="window"><div class="sky">{stars(i*3, 22, "#fff3c8", big=.3)}{MOON}</div><div class="curtain l"></div><div class="curtain r"></div></div>'

CARDS = [('Card','Ace of Cups','圣杯一','♥',False),('','The Star','星星','XVII',False),('','Eight of Wands','权杖八','♣',True),('','The Sun','太阳','XIX',False)]
POS = ['The core','The obstacle','What to do','Your strength']

def phone(t, i, which):
    page = f'<div class="bg"></div><div class="stars">{stars(i*11+which, t["nstars"], t["star"], t.get("star_area",(0,100)))}</div>'
    tape = '<i class="tape"></i>' if t.get('sticker') else ''
    if which == 0:
        body = f'''<div class="scr center">
<p class="eyebrow">Find your answer</p><h1>Oracle</h1><p class="sub">Find your quiet sign</p><p class="intro">Discover soft, AI‑powered guidance from Liu‑Yao — ancient Chinese I‑Ching divination — and Tarot. When you feel unsure amid choices, get a small nudge to move forward.</p>
<div class="herowrap">{hero(t, i)}</div>
<button class="btn">Begin</button><p class="fine">For reflection and fun</p></div>'''
    elif which == 1:
        def mode(zh, en, d, mini):
            return f'<div class="mode lacecard">{tape}<div class="mini">{mini}</div><div><b>{en}</b><small>{d}</small></div><span class="zh">{zh}</span></div>'
        hexm = '<span class="hx">' + ''.join('<i></i>' if b else '<i class="y"></i>' for b in [1,0,1,1,0,0]) + '</span>'
        body = f'''<div class="scr"><p class="back">‹ Back</p><h2>Choose a reading</h2>
<p class="group">I Ching</p>{mode('小六爻','Yes / No','A quick, clear answer',MOON)}{mode('六爻','Guidance','Advice from your hexagram',hexm)}
<p class="group">Tarot</p>{mode('三张','Yes / No','Three cards, counted','<span class="mc"><i></i><i></i><i></i></span>')}{mode('直指核心','Guidance','Four cards, straight to the core','<span class="mc"><i></i><i></i><i></i><i></i></span>')}</div>'''
    elif which == 2:
        body = f'''<div class="scr"><p class="back">‹ Back</p><h2>What's on your mind?</h2>
<div class="lacecard ask">{tape}<p class="q">Should I take the new job in Brooklyn?</p><p class="count">38 / 300</p></div>
<p class="hint">Hold the question in your mind for a breath, then send it.</p>
<div class="deck">{''.join(f'<div class="tc b" style="transform:translateX({k*5}px) rotate({k*2-3}deg)"></div>' for k in range(4))}</div>
<button class="btn">Draw my cards</button></div>'''
    else:
        cards = ''.join(f'<div class="rc"><small>{p}</small><div class="tc f{" rev" if rv else ""}"><b>{g}</b><span>{n}<br><em>{zh}</em></span></div><u>{"Reversed" if rv else ""}</u></div>' for p,(_,n,zh,g,rv) in zip(POS,CARDS))
        body = f'''<div class="scr"><p class="back">‹ Back</p><div class="lacecard result">{tape}
<p class="qq">“Should I take the new job in Brooklyn?”</p><div class="row">{cards}</div>
<h3>Say yes, but pace yourself</h3><p class="body">Fresh feelings and real hope surround this offer. Things may move faster than you are ready for, so set your own rhythm before you start.</p>
<div class="step"><small>Small step</small>Write down the one thing you need from this job, and ask about it.</div></div>
<button class="btn">Ask again</button></div>'''
    return f'<div class="ph">{page}{body}</div>'

CSS = '''
*{box-sizing:border-box;margin:0;padding:0}
body{background:#ece8e3;font-family:'Jost',sans-serif;width:1632px;padding:40px 48px 48px}
header{display:flex;align-items:baseline;gap:18px;margin-bottom:26px;color:#2d2a28}
header .num{font:500 44px 'Cormorant Garamond'}header h4{font:500 34px 'Cormorant Garamond'}header p{font-size:16px;color:#6d6560;flex:1}
.sw{display:flex;gap:6px}.sw i{width:26px;height:26px;border-radius:50%;border:1px solid rgba(0,0,0,.12)}
.labels{display:flex;gap:32px;margin-bottom:10px}.labels span{width:360px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#8a817a}
.row4{display:flex;gap:32px}
.ph{width:360px;height:760px;border-radius:40px;position:relative;overflow:hidden;box-shadow:0 30px 60px -30px rgba(40,30,30,.45),0 0 0 8px #1c1a1a;color:var(--pink)}
.bg{position:absolute;inset:0;background:var(--bg)}
.stars{position:absolute;inset:0;pointer-events:none}
.sp,.dot{position:absolute;display:block}.sp svg{width:100%;height:100%;fill:currentColor;display:block}.dot{border-radius:50%}
.scr{position:relative;height:100%;padding:54px 24px 30px;display:flex;flex-direction:column;color:var(--pink)}
.center{align-items:center;text-align:center}
.eyebrow{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--pmuted);margin-top:40px}
h1{font-family:var(--title);font-weight:500;font-size:68px;line-height:1;margin-top:10px}
h2{font-family:var(--title);font-weight:500;font-size:30px;line-height:1.1;text-align:center;margin:6px 0 18px}
.sub{font-family:var(--title);font-style:italic;font-size:21px;color:var(--pmuted);margin-top:6px}
.herowrap{flex:1;display:grid;place-items:center;width:100%}
.intro{font-size:12.5px;line-height:1.5;color:var(--pmuted);margin-top:12px;max-width:290px}
.fine{font-size:11px;color:var(--pmuted);margin-top:12px}
.back{font-size:14px;color:var(--pmuted);height:24px}
.btn{width:100%;border:0;border-radius:999px;padding:16px;font:400 16px 'Jost';letter-spacing:.08em;background:var(--btn);color:var(--btnink);box-shadow:0 10px 22px -14px rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.25);margin-top:auto}
/* lace card: scalloped top + bottom, inner dotted line */
.lacecard{position:relative;background:var(--card);color:var(--ink);border-radius:14px;box-shadow:0 14px 30px -20px rgba(0,0,0,.5)}
.lacecard::before,.lacecard::after{content:"";position:absolute;left:10px;right:10px;height:12px;pointer-events:none;
 background:radial-gradient(circle at 6px 6px,var(--card) 4.5px,var(--line) 5px,var(--card) 5.6px,transparent 6px) 0 0/12px 12px repeat-x}
.lacecard::before{top:-6px}.lacecard::after{bottom:-6px}
.mode{display:flex;align-items:center;gap:14px;padding:14px 14px;margin-bottom:12px;outline:1px dashed var(--line);outline-offset:-6px}
.mode b{display:block;font-family:var(--title);font-size:20px;font-weight:500}.mode small{font-size:12px;color:var(--muted)}
.mode .zh{margin-left:auto;font-family:'Noto Serif SC';font-size:13px;color:var(--accent)}
.mini{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--soft);flex:none}
.mini .moon{width:22px;height:22px;fill:var(--accent)}
.hx{display:flex;flex-direction:column;gap:3px;width:22px}.hx i{height:3px;background:var(--accent);border-radius:1px}
.hx i.y{background:linear-gradient(90deg,var(--accent) 40%,transparent 40% 60%,var(--accent) 60%)}
.mc{display:flex;gap:2px}.mc i{width:8px;height:13px;border-radius:2px;background:var(--back);background-size:6px 6px}
.group{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--pmuted);margin:4px 0 10px}
.ask{padding:22px 20px 14px;min-height:150px;outline:1px dashed var(--line);outline-offset:-7px}
.q{font-family:var(--title);font-size:22px;line-height:1.3}.count{text-align:right;font-size:11px;color:var(--muted);margin-top:28px}
.hint{text-align:center;font-family:var(--title);font-style:italic;font-size:17px;color:var(--pmuted);margin:18px 10px}
.deck{position:relative;height:150px;display:grid;place-items:center}.deck .tc{position:absolute}
.tc{width:86px;height:130px;border-radius:9px;border:3px solid var(--card);box-shadow:0 8px 18px -10px rgba(0,0,0,.6)}
.tc.b{background:var(--back);display:grid;place-items:center}.tc.b svg{width:26px;fill:var(--card);opacity:.9}
.fan{position:relative;width:200px;height:220px;display:grid;place-items:center}.fan .tc{position:absolute;width:118px;height:178px}.fan .mid{z-index:2}
.result{padding:22px 16px 18px;margin-bottom:18px}
.qq{text-align:center;font-family:var(--title);font-style:italic;font-size:16px;color:var(--muted);margin-bottom:12px}
.row{display:flex;gap:6px;justify-content:center}.rc{width:72px;text-align:center}
.rc small{display:block;font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);height:22px}
.tc.f{width:72px;height:104px;background:var(--card);border:1px solid var(--line);outline:1px solid var(--line);outline-offset:-5px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:4px}
.tc.f b{font-family:var(--title);font-size:18px;color:var(--accent);font-weight:500}.tc.f span{font-family:var(--title);font-size:11px;line-height:1.15}.tc.f em{font-family:'Noto Serif SC';font-style:normal;font-size:10px;color:var(--muted)}
.tc.f.rev{background:var(--soft);border-color:var(--accent)}
.rc u{text-decoration:none;font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);display:block;height:14px;margin-top:4px}
h3{font-family:var(--title);font-weight:500;font-size:24px;text-align:center;margin:12px 0 8px;line-height:1.15}
.body{font-size:13px;line-height:1.55;color:var(--ink)}
.step{background:var(--soft);border-radius:10px;padding:10px 12px;margin-top:12px;font-size:12.5px;line-height:1.45}.step small{display:block;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:3px}
/* hero: doily */
.doily{width:250px;height:250px;border-radius:50%;display:grid;place-items:center;
 background:repeating-conic-gradient(var(--card) 0 6deg,transparent 6deg 12deg);-webkit-mask:radial-gradient(circle,#000 62%,transparent 63%,transparent 66%,#000 66.5% 70%,transparent 70.5%);filter:drop-shadow(0 10px 20px rgba(0,0,0,.2))}
.doily{-webkit-mask:none;background:radial-gradient(circle,var(--card) 0 58%,transparent 58.5%),radial-gradient(circle,transparent 0 60%,var(--card) 60.5% 64%,transparent 64.5%),repeating-conic-gradient(var(--card) 0 4deg,transparent 4deg 9deg);
 -webkit-mask:radial-gradient(circle,#000 0 70%,transparent 70.5%);mask:radial-gradient(circle,#000 0 70%,transparent 70.5%)}
.doily-in{width:150px;height:150px;border-radius:50%;border:1.5px dotted var(--accent);display:grid;place-items:center;align-content:center;gap:4px}
.doily-in .moon{width:58px;height:58px;fill:var(--accent)}.doily-in b{font-family:'Noto Serif SC';font-weight:500;font-size:14px;letter-spacing:.3em;color:var(--accent)}
.bigmoon{position:relative;width:230px;height:230px;display:grid;place-items:center}.bigmoon>.moon{width:150px;height:150px;fill:var(--card);filter:drop-shadow(0 0 30px rgba(255,240,210,.8))}
.heroc{width:190px;height:250px;display:grid;place-items:center;outline:1px dashed var(--line);outline-offset:-9px}
.cst{width:130px}.cst polyline{fill:none;stroke:var(--accent);stroke-width:1.2;stroke-dasharray:3 3}.cst circle{fill:var(--accent)}
.window{position:relative;width:220px;height:280px;border-radius:110px 110px 12px 12px;border:8px solid var(--card);overflow:hidden;box-shadow:0 18px 40px -20px rgba(0,0,0,.5)}
.window .sky{position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,#3b4a6b,#1f2740)}.window .sky .moon{position:absolute;width:56px;left:82px;top:64px;fill:#fff3c8}
.curtain{position:absolute;top:0;bottom:0;width:62px;background:radial-gradient(circle at 8px 8px,rgba(255,255,255,.9) 3px,transparent 3.6px) 0 0/16px 16px,radial-gradient(circle,rgba(255,255,255,.55) 1.5px,transparent 2px) 8px 8px/16px 16px;opacity:.95}
.curtain.l{left:0;border-right:2px dotted #fff;border-bottom-right-radius:60px 100%}.curtain.r{right:0;border-left:2px dotted #fff;border-bottom-left-radius:60px 100%}
.tape{position:absolute;top:-9px;left:50%;width:70px;height:18px;transform:translateX(-50%) rotate(-3deg);background:repeating-linear-gradient(45deg,rgba(191,180,247,.85) 0 6px,rgba(255,226,122,.85) 6px 12px);z-index:3}
'''

def page(t, i):
    soft = t.get('soft', 'color-mix(in srgb,var(--accent) 12%,var(--card))')
    vars_ = f"--bg:{t['bg']};--card:{t['card']};--ink:{t['ink']};--muted:{t['muted']};--pink:{t['page_ink']};--pmuted:{t['page_muted']};--accent:{t['accent']};--btn:{t['btn']};--btnink:{t['btn_ink']};--line:{t['line']};--back:{t['back']};--title:{t['title']},serif;--soft:{soft}"
    extra = ''
    if t.get('sticker'):
        extra = '.lacecard{border:2px solid var(--ink);box-shadow:4px 4px 0 var(--ink)}.lacecard::before,.lacecard::after{display:none}.btn{border:2px solid var(--ink);box-shadow:4px 4px 0 var(--ink)}.tc{border-color:var(--ink)}.mode{outline:none}'
    if t['n'] == 'Velvet Plum':
        extra = '.lacecard{border:1px solid var(--accent)}.tc.f.rev{background:#3c1838}'
    sw = ''.join(f'<i style="background:{c}"></i>' for c in [t['card'], t['accent'], t['line'], t['ink']])
    labels = ''.join(f'<span>{s}</span>' for s in ['1  Start', '2  Pick a reading', '3  Ask', '4  Result'])
    return f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Instrument+Serif:ital@0;1&family=Italiana&family=Young+Serif&family=Jost:wght@300;400;500&family=Noto+Serif+SC:wght@400;500&display=swap" rel="stylesheet">
<style>{CSS}:root{{{vars_}}}{extra}</style></head><body>
<header><span class="num">{i+1:02d}</span><h4>{html.escape(t['n'])}</h4><p>{html.escape(t['d'])}</p><div class="sw">{sw}</div></header>
<div class="labels">{labels}</div>
<div class="row4">{''.join(phone(t, i, w) for w in range(4))}</div></body></html>'''

for i, t in enumerate(THEMES):
    (OUT / f'{i+1:02d}-{t["n"].lower().replace(" ", "-")}.html').write_text(page(t, i))
print('ok', len(THEMES))
