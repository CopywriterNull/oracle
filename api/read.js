import { castHexagram, lunarMoment, xiaoLiuyao, SYSTEM_PROMPT, userPrompt, parseReading } from '../lib/oracle.js';
import { draw, tarotVerdict } from '../lib/tarot.js';

const MODEL = 'anthropic/claude-sonnet-5.5';
const LIMIT = 20; // readings per IP per hour

// shortcut: in-memory, per function instance, so it resets on cold start. Move to Upstash/KV if the link goes wide.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600e3);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const json = (body, status = 200) => Response.json(body, { status });

export async function POST(request) {
  const ip = (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (limited(ip)) return json({ error: 'The oracle needs a rest. Come back in a little while.' }, 429);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }
  const question = String(body.question || '').trim().slice(0, 300);
  const mode = ['yesno', 'guidance', 'tarot-yesno', 'tarot-guidance'].includes(body.mode) ? body.mode : 'guidance';
  if (!question) return json({ error: 'Ask a question first.' }, 400);

  let timeZone = 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: body.timeZone });
    if (body.timeZone) timeZone = body.timeZone;
  } catch {}

  const moment = lunarMoment(new Date(), timeZone);
  let cast;
  if (mode === 'yesno') cast = { ...xiaoLiuyao(moment), hourName: moment.hourName };
  else if (mode === 'guidance') cast = castHexagram();
  else {
    const cards = draw(mode);
    cast = { cards, verdict: mode === 'tarot-yesno' ? tarotVerdict(cards) : undefined };
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt(mode, cast, question, new Date().toLocaleString('en-US', { timeZone, weekday: 'long', hour: 'numeric', minute: '2-digit' })) },
      ],
    }),
  });
  const data = await res.json().catch(() => ({}));
  const text = data.choices?.[0]?.message?.content;
  if (!res.ok || !text) {
    console.error('openrouter', res.status, JSON.stringify(data).slice(0, 500));
    return json({ error: 'The oracle is quiet right now. Try again in a moment.' }, 502);
  }
  return json({ mode, cast, reading: parseReading(text) });
}
