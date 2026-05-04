/**
 * ESTUDO-FOTO BOT — Entry point
 *
 * Express server com 2 endpoints do Meta Cloud API:
 *  - GET  /webhook   → handshake de verificação (uma vez, no setup)
 *  - POST /webhook   → recebe mensagens de WhatsApp
 *
 * Tudo o que chega cai em handleIncoming() em commands.js, que decide
 * se é comando de texto, foto, vídeo, etc.
 */
import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { logger } from './utils.js';
import { handleIncoming } from './commands.js';
import { initDB } from './state.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Captura corpo cru pra validar HMAC do Meta
app.use(express.json({
  limit: '2mb',
  verify: (req, _res, buf) => { req.rawBody = buf; },
}));

initDB();

// ─── Healthcheck ───────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// ─── Webhook: handshake (Meta GET /webhook?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...) ─
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    logger.info('Webhook verificado com sucesso pelo Meta');
    return res.status(200).send(challenge);
  }
  logger.warn({ mode, token }, 'Tentativa de verificação de webhook falhou');
  return res.sendStatus(403);
});

// ─── Webhook: mensagens recebidas ─────────────────────────────────
app.post('/webhook', async (req, res) => {
  // Sempre responde 200 rápido pra Meta não retentar (processa em background)
  res.sendStatus(200);

  // Validação opcional de assinatura HMAC
  if (process.env.WHATSAPP_APP_SECRET) {
    if (!verifySignature(req)) {
      logger.warn('Assinatura HMAC inválida — descartando');
      return;
    }
  }

  const body = req.body;
  if (body.object !== 'whatsapp_business_account') return;

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== 'messages') continue;
      const value = change.value || {};
      const messages = value.messages || [];
      for (const msg of messages) {
        try {
          await handleIncoming(msg, value.contacts || []);
        } catch (err) {
          logger.error({ err, msgId: msg.id }, 'Falha processando mensagem');
        }
      }
    }
  }
});

// Valida que o webhook veio mesmo do Meta (não de um curioso)
function verifySignature(req) {
  const sig = req.get('x-hub-signature-256') || '';
  if (!sig.startsWith('sha256=')) return false;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
    .update(req.rawBody)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ─── 404 e error handler ──────────────────────────────────────────
app.use((_req, res) => res.sendStatus(404));
app.use((err, _req, res, _next) => {
  logger.error({ err }, 'Erro não tratado');
  res.sendStatus(500);
});

app.listen(PORT, () => {
  logger.info(`Bot ouvindo na porta ${PORT}`);
});
