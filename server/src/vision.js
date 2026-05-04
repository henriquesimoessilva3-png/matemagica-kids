/**
 * Wrapper da Anthropic SDK pra chamadas de visão.
 * Recebe array de Buffers de imagem + prompt, devolve JSON parseado.
 */
import Anthropic from '@anthropic-ai/sdk';
import { logger } from './utils.js';

let client = null;
function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY não configurada');
    }
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * @param {Buffer[]} imageBuffers — buffers JPEG/PNG já redimensionados
 * @param {string} prompt
 * @returns {Promise<{json: any, usage: {input_tokens: number, output_tokens: number}}>}
 */
export async function callVision(imageBuffers, prompt) {
  const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

  const content = [
    ...imageBuffers.map(buf => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/jpeg',
        data: buf.toString('base64'),
      },
    })),
    { type: 'text', text: prompt },
  ];

  logger.info({ model, images: imageBuffers.length }, 'Chamando Anthropic vision');
  const t0 = Date.now();

  const resp = await getClient().messages.create({
    model,
    max_tokens: 4096,
    messages: [{ role: 'user', content }],
  });

  const text = (resp.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n')
    .trim();

  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  let json;
  try {
    json = JSON.parse(cleaned);
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Resposta da IA não é JSON válido');
    json = JSON.parse(m[0]);
  }

  logger.info({
    ms: Date.now() - t0,
    in: resp.usage?.input_tokens,
    out: resp.usage?.output_tokens,
  }, 'Resposta Anthropic recebida');

  return { json, usage: resp.usage };
}

/**
 * Variante só-texto (pra /diferente, /mais — sem novas imagens).
 */
export async function callText(prompt) {
  const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

  const resp = await getClient().messages.create({
    model,
    max_tokens: 3072,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = (resp.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n')
    .trim();

  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  let json;
  try {
    json = JSON.parse(cleaned);
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Resposta da IA não é JSON válido');
    json = JSON.parse(m[0]);
  }
  return { json, usage: resp.usage };
}
