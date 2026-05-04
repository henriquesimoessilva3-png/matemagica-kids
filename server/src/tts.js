/**
 * Text-to-Speech (opcional).
 *
 * MVP: stub. Quando você quiser ativar áudio:
 *   1. Cria projeto no Google Cloud, ativa Text-to-Speech API
 *   2. Cria service account, baixa o JSON
 *   3. Define GOOGLE_APPLICATION_CREDENTIALS=/caminho/do/json
 *   4. Adiciona "@google-cloud/text-to-speech" ao package.json
 *   5. Implementa synthesize() abaixo
 *
 * Custo: ~R$ 0,02 por resumo de 800 chars com voz Wavenet pt-BR.
 */
import { logger } from './utils.js';

export function isTTSEnabled() {
  return !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
}

/**
 * Gera áudio a partir de texto.
 * @param {string} text
 * @returns {Promise<Buffer|null>} buffer OGG/Opus ou null se desativado
 */
export async function synthesize(text) {
  if (!isTTSEnabled()) {
    logger.debug('TTS desativado (GOOGLE_APPLICATION_CREDENTIALS não setado)');
    return null;
  }

  // TODO: implementar com @google-cloud/text-to-speech
  // const client = new textToSpeech.TextToSpeechClient();
  // const [response] = await client.synthesizeSpeech({
  //   input: { text },
  //   voice: { languageCode: 'pt-BR', name: 'pt-BR-Wavenet-A' },
  //   audioConfig: { audioEncoding: 'OGG_OPUS', speakingRate: 0.95 },
  // });
  // return Buffer.from(response.audioContent);

  logger.warn('TTS habilitado mas não implementado ainda');
  return null;
}
