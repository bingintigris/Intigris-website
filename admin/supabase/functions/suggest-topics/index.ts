// Supabase Edge Function: suggest-topics
// Generates on-brand blog article ideas with an LLM, avoiding duplicates of
// existing posts. The LLM API key stays server-side (a Supabase secret) so it
// is never exposed in the browser.
//
// Env / secrets to set (Dashboard -> Edge Functions -> Manage secrets):
//   LLM_PROVIDER      = "anthropic" (default) | "openai"
//   ANTHROPIC_API_KEY = sk-ant-...          (if provider = anthropic)
//   ANTHROPIC_MODEL   = claude-3-5-haiku-20241022  (optional)
//   OPENAI_API_KEY    = sk-...              (if provider = openai)
//   OPENAI_MODEL      = gpt-4o-mini         (optional)
// SUPABASE_URL and SUPABASE_ANON_KEY are provided automatically.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

const PROMPT = (titles: string[]) => `You are an editorial strategist for Intigris, a Netherlands-based Salesforce implementation partner (since 2010). Their blog covers the Salesforce ecosystem: Agentforce, Data Cloud, Service/Sales Cloud, Field Service, integrations, AI, and company/people stories.

Suggest 5 timely, high-interest blog article ideas that fit this brand and would attract their audience (operations leaders, IT, and Salesforce buyers in NL/EU).

Avoid duplicating or closely overlapping these existing titles:
${titles.length ? titles.map((t) => `- ${t}`).join('\n') : '(none yet)'}

Return ONLY a JSON array (no prose, no code fences) of exactly 5 objects with these fields:
- "title": a compelling, specific headline
- "target_keyword": the primary search phrase it should rank for
- "angle": one sentence on the take/approach
- "why_now": one sentence on why it's timely right now
- "category": one of "Insights", "Guides", "Company"`;

async function callAnthropic(titles: string[]) {
  const key = Deno.env.get('ANTHROPIC_API_KEY');
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set');
  const model = Deno.env.get('ANTHROPIC_MODEL') || 'claude-3-5-haiku-20241022';
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: 1200, messages: [{ role: 'user', content: PROMPT(titles) }] }),
  });
  if (!r.ok) throw new Error(`Anthropic error ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data?.content?.[0]?.text ?? '';
}

async function callOpenAI(titles: string[]) {
  const key = Deno.env.get('OPENAI_API_KEY');
  if (!key) throw new Error('OPENAI_API_KEY is not set');
  const model = Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini';
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: PROMPT(titles) }], temperature: 0.7 }),
  });
  if (!r.ok) throw new Error(`OpenAI error ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

function extractJson(text: string) {
  let t = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const start = t.indexOf('[');
  const end = t.lastIndexOf(']');
  if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  // Require a logged-in Supabase user (keeps the endpoint internal).
  const authHeader = req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'Not authenticated' }, 401);
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: 'Not authenticated' }, 401);
  } catch {
    return json({ error: 'Auth check failed' }, 401);
  }

  let titles: string[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.existingTitles)) titles = body.existingTitles.slice(0, 60).map(String);
  } catch { /* empty body is fine */ }

  const provider = (Deno.env.get('LLM_PROVIDER') || 'anthropic').toLowerCase();
  try {
    const raw = provider === 'openai' ? await callOpenAI(titles) : await callAnthropic(titles);
    const suggestions = extractJson(raw);
    if (!Array.isArray(suggestions)) throw new Error('Model did not return a list');
    return json({ suggestions });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
