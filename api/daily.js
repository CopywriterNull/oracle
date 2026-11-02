import { hexagramFromLines } from '../lib/oracle.js';
import { DECK } from '../lib/tarot.js';

// Free "sign of the day": same for everyone on a given date, no AI call. Even days a hexagram, odd days a tarot card.
export function dailySign(day) {
  const num = Math.round(Date.parse(day + 'T00:00:00Z') / 864e5);
  const h = Math.imul(num ^ 0x5bd1e995, 2654435761) >>> 0;
  if (num % 2 === 0) {
    const x = hexagramFromLines([0, 1, 2, 3, 4, 5].map((b) => (h >> b) & 1));
    return { kind: 'hex', day, n: x.n, name: x.name, zh: x.zh, lines: x.lines, keywords: x.keywords, advice: x.advice };
  }
  const c = DECK[h % 22]; // major arcana only: the iconic cards make a better shared daily sign
  return { kind: 'card', day, name: c.name, zh: c.zh, glyph: c.glyph, kw: c.kw, up: c.up };
}

export function GET(request) {
  const d = new URL(request.url).searchParams.get('d') || '';
  const day = /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d)) ? d : new Date().toISOString().slice(0, 10);
  return Response.json(dailySign(day), { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
