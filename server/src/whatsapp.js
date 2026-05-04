/**
 * Cliente da Meta Cloud API (Graph API v21.0).
 *
 * Funções:
 *   sendText(to, text)         → manda mensagem de texto
 *   sendAudio(to, oggBuffer)   → manda áudio como voice note
 *   downloadMedia(mediaId)     → baixa foto/vídeo recebido
 *   markAsRead(messageId)      → marca como lida (UI dos 2 ✓ azuis)
 *
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/reference
 */
import fs from 'fs';
import path from 'path';
import { logger, sleep } from './utils.js';

const GRAPH = 'https://graph.facebook.com/v21.0';

function token() { return process.env.WHATSAPP_TOKEN; }
function phoneId() { return process.env.WHATSAPP_PHONE_NUMBER_ID; }

async function fetchMeta(url, opts = {}) {
  const resp = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token()}`,
      ...(opts.headers || {}),
    },
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Meta API ${resp.status}: ${txt}`);
  }
  return resp;
}

export async function sendText(to, text) {
  const resp = await fetchMeta(`${GRAPH}/${phoneId()}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: text.slice(0, 4096) },
    }),
  });
  return resp.json();
}

// Manda várias mensagens em sequência com pequena pausa pra evitar rate limit
export async function sendTextChunks(to, chunks) {
  for (let i = 0; i < chunks.length; i++) {
    await sendText(to, chunks[i]);
    if (i < chunks.length - 1) await sleep(400);
  }
}

export async function markAsRead(messageId) {
  try {
    await fetchMeta(`${GRAPH}/${phoneId()}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    });
  } catch (err) {
    logger.warn({ err, messageId }, 'falha em markAsRead (não crítico)');
  }
}

// Indicador "digitando…" — Meta ainda não tem oficial no Cloud API,
// mas dá pra mandar um typing wait. Por ora, no-op.
export async function sendTyping(_to) { /* TODO: typing indicator quando Meta liberar */ }

// Baixa media (foto/vídeo/áudio) recebido por mediaId.
// Retorna { buffer, mimeType, sizeBytes }
export async function downloadMedia(mediaId) {
  // 1) Pega a URL temporária do arquivo
  const meta = await fetchMeta(`${GRAPH}/${mediaId}`);
  const { url, mime_type, file_size } = await meta.json();

  // 2) Baixa o arquivo (essa URL precisa do mesmo Bearer token)
  const file = await fetchMeta(url);
  const arrayBuf = await file.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuf),
    mimeType: mime_type,
    sizeBytes: file_size,
  };
}

// Salva buffer num arquivo temporário e retorna o path (útil pra ffmpeg)
export function saveTempFile(buffer, ext) {
  const dir = '/tmp/estudo-foto';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
  fs.writeFileSync(file, buffer);
  return file;
}

// Manda áudio como voice note (ogg/opus). Requer upload prévio em /media
export async function sendAudio(to, audioBuffer, mimeType = 'audio/ogg; codecs=opus') {
  // 1) Upload do áudio
  const form = new FormData();
  form.append('messaging_product', 'whatsapp');
  form.append('type', mimeType.split(';')[0]);
  form.append('file', new Blob([audioBuffer], { type: mimeType }), 'audio.ogg');

  const upload = await fetchMeta(`${GRAPH}/${phoneId()}/media`, {
    method: 'POST',
    body: form,
  });
  const { id: mediaId } = await upload.json();

  // 2) Envia mensagem apontando pro mediaId (voice=true vira "ouça este áudio")
  await fetchMeta(`${GRAPH}/${phoneId()}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'audio',
      audio: { id: mediaId, voice: true },
    }),
  });
}
