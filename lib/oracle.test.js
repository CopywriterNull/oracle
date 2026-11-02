import assert from 'node:assert/strict';
import { castHexagram, hexagramFromLines, lunarMoment, xiaoLiuyao, parseReading } from './oracle.js';

// King Wen table covers all 64 exactly once
const seen = new Set();
for (let i = 0; i < 64; i++) seen.add(hexagramFromLines([...Array(6)].map((_, b) => (i >> b) & 1)).n);
assert.equal(seen.size, 64);

assert.equal(hexagramFromLines([1, 1, 1, 1, 1, 1]).name, 'The Creative');
assert.equal(hexagramFromLines([0, 0, 0, 0, 0, 0]).name, 'The Receptive');
assert.equal(hexagramFromLines([1, 1, 1, 0, 0, 0]).n, 11); // earth over heaven = Peace
assert.equal(hexagramFromLines([1, 0, 1, 0, 1, 0]).n, 63); // water over fire = After Completion
assert.equal(castHexagram(() => 1).n, 1); // all heads = 9s = all yang

// 2026-02-17 is Lunar New Year (month 1, day 1); 00:30 is 子时
const m = lunarMoment(new Date('2026-02-17T00:30:00-05:00'), 'America/New_York');
assert.deepEqual([m.month, m.day, m.hourBranch, m.hourName], [1, 1, 1, '子时']);
assert.equal(xiaoLiuyao(m).zh, '大安');
assert.equal(xiaoLiuyao({ month: 1, day: 1, hourBranch: 6 }).zh, '空亡');

assert.deepEqual(parseReading('Yes, gently\n\nIt is time.\n\nSmall step: Text them.'), {
  title: 'Yes, gently', body: 'It is time.', step: 'Text them.',
});
// tarot: full unique deck, spreads draw unique cards, verdict counts upright cards
const { DECK, draw, tarotVerdict } = await import('./tarot.js');
assert.equal(DECK.length, 78);
assert.equal(new Set(DECK.map((c) => c.name)).size, 78);
assert.ok(DECK.every((c) => c.up && c.rev && c.glyph && c.zh && c.kw));
assert.equal(DECK[22].zh, '权杖一');
assert.equal(DECK[77].zh, '钱币国王');
const g = draw('tarot-guidance');
assert.deepEqual(g.map((c) => c.position), ['The core', 'The obstacle', 'What to do', 'Your strength']);
assert.equal(new Set(g.map((c) => c.name)).size, 4);
assert.equal(draw('tarot-yesno', () => 0)[0].name, 'The Fool');
const up = (n) => [0, 1, 2].map((i) => ({ reversed: i >= n }));
assert.deepEqual([0, 1, 2, 3].map((n) => tarotVerdict(up(n))), ['No', 'Probably no', 'Probably yes', 'Yes']);
console.log('ok');
