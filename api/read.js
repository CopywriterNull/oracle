import { castHexagram, lunarMoment, quickLiuyao, SYSTEM_PROMPT, userPrompt, parseReading } from '../lib/oracle.js';
import { draw, tarotVerdict } from '../lib/tarot.js';
import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-5-5';
const client = new Anthropic(); // reads ANTHROPIC_API_KEY
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
const ERR = {
  en: { rest: 'The oracle needs a rest. Come back in a little while.', ask: 'Ask a question first.', quiet: 'The oracle is quiet right now. Try again in a moment.' },
  zh: { rest: '神谕需要休息一下，请稍后再来。', ask: '请先写下你的问题。', quiet: '神谕此刻沉默了，请稍后再试。' },
};

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request' }, 400);
  }
  const question = String(body.question || '').trim().slice(0, 300);
  // Chinese site, or a question typed in Chinese, gets the reading in Chinese
  const lang = body.lang === 'zh' || /[\u4e00-\u9fff]/.test(question) ? 'zh' : 'en';
  const ip = (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (limited(ip)) return json({ error: ERR[lang].rest }, 429);
  const mode = ['yesno', 'guidance', 'tarot-yesno', 'tarot-guidance'].includes(body.mode) ? body.mode : 'guidance';
  if (!question) return json({ error: ERR[lang].ask }, 400);

  let timeZone = 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: body.timeZone });
    if (body.timeZone) timeZone = body.timeZone;
  } catch {}

  // Quick Liu Yao casts from the second the user tapped the dial; trust their clock only if it is within 2 minutes of ours.
  const at = Number(body.at);
  const when = Math.abs(at - Date.now()) < 120e3 ? new Date(at) : new Date();
  const moment = lunarMoment(when, timeZone);
  let cast;
  if (mode === 'yesno') cast = { ...quickLiuyao(moment), clock: moment.clock, time: `${moment.yearName} ${moment.month}月${moment.day}日 ${moment.hourName} ${moment.clock}` };
  else if (mode === 'guidance') cast = castHexagram();
  else {
    const cards = draw(mode);
    cast = { cards, verdict: mode === 'tarot-yesno' ? tarotVerdict(cards) : undefined };
  }

  const askedAt = new Date().toLocaleString('en-US', { timeZone, weekday: 'long', hour: 'numeric', minute: '2-digit' });
  let text;
  try {
    const res = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      output_config: { effort: 'low' },
      // on a safety decline, the API retries on a fallback model inside the same call
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt(mode, cast, question, askedAt, lang) }],
    });
    if (res.stop_reason !== 'refusal') text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    if (!text) console.error('anthropic', res.stop_reason, JSON.stringify(res.stop_details));
  } catch (err) {
    console.error('anthropic', err.status, err.message);
  }
  if (!text) return json({ error: ERR[lang].quiet }, 502);
  return json({ mode, cast, reading: parseReading(text) });
}
