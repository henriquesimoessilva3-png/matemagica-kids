/**
 * Utilitários compartilhados.
 */
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } }
    : undefined,
});

// Normaliza número: remove tudo que não é dígito. Ex: "+55 (11) 9999-1234" → "5511999991234"
export function normalizePhone(s) {
  return String(s || '').replace(/\D/g, '');
}

export function isAdmin(phone) {
  const admin = normalizePhone(process.env.ADMIN_PHONE || '');
  return admin && normalizePhone(phone) === admin;
}

// Pausa async — útil pra evitar rate limit ao mandar várias msgs em sequência
export const sleep = ms => new Promise(r => setTimeout(r, ms));

// Trim seguro pra strings que podem ser undefined
export const safeTrim = s => String(s || '').trim();
