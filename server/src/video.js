/**
 * Extração de frames de vídeo via ffmpeg + redimensionamento de imagens.
 *
 * Estratégia MVP: extrai 1 frame a cada N segundos (default 2s),
 * limitado a MAX_FRAMES (default 12). Sem deduplicação ainda — a IA
 * lida bem com frames duplicados, e ffmpeg dedup adicionaria latência.
 *
 * Quando virar problema: adicionar PHASH + comparar frames consecutivos.
 */
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { logger } from './utils.js';

if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic);

const TMP = '/tmp/estudo-foto-video';
const FRAME_INTERVAL_SEC = parseInt(process.env.FRAME_INTERVAL_SEC || '2', 10);
const MAX_FRAMES = parseInt(process.env.MAX_FRAMES || '12', 10);
const MAX_DIM = 1280;
const JPEG_QUALITY = 4; // ffmpeg qscale 1=best, 31=worst. 4 ≈ ~85%

/**
 * @param {string} videoPath — arquivo do vídeo já salvo em disco
 * @returns {Promise<Buffer[]>} buffers JPEG dos frames
 */
export async function extractFrames(videoPath) {
  if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });
  const session = path.join(TMP, `s-${Date.now()}-${Math.random().toString(36).slice(2,7)}`);
  fs.mkdirSync(session);

  const pattern = path.join(session, 'frame-%03d.jpg');
  const t0 = Date.now();

  await new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions([
        `-vf`, `fps=1/${FRAME_INTERVAL_SEC},scale='min(${MAX_DIM},iw)':-2`,
        `-qscale:v`, String(JPEG_QUALITY),
        `-frames:v`, String(MAX_FRAMES),
      ])
      .output(pattern)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  const files = fs.readdirSync(session).filter(f => f.endsWith('.jpg')).sort();
  const buffers = files.map(f => fs.readFileSync(path.join(session, f)));

  // Limpa
  for (const f of files) fs.unlinkSync(path.join(session, f));
  fs.rmdirSync(session);

  logger.info({ ms: Date.now() - t0, frames: buffers.length, videoBytes: fs.statSync(videoPath).size },
    'Frames extraídos');
  return buffers;
}

/**
 * Redimensiona uma imagem JPEG/PNG mantendo proporção, max MAX_DIM no maior lado.
 * Usa ffmpeg pra evitar dependência de sharp/jimp.
 */
export async function resizeImage(buffer, mimeType) {
  if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  const ext = mimeType.includes('png') ? 'png' : 'jpg';
  const inFile = path.join(TMP, `${id}-in.${ext}`);
  const outFile = path.join(TMP, `${id}-out.jpg`);

  fs.writeFileSync(inFile, buffer);

  await new Promise((resolve, reject) => {
    ffmpeg(inFile)
      .outputOptions([
        `-vf`, `scale='min(${MAX_DIM},iw)':-2`,
        `-qscale:v`, String(JPEG_QUALITY),
      ])
      .output(outFile)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  const out = fs.readFileSync(outFile);
  fs.unlinkSync(inFile);
  fs.unlinkSync(outFile);
  return out;
}
