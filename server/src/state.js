/**
 * Estado por usuário (número de WhatsApp), em SQLite.
 *
 * Tabelas:
 *   users    — perfil (ano escolar, matéria, idioma)
 *   sessions — buffer de fotos sendo coletadas (debounce de 8s antes de processar)
 *   studies  — histórico de estudos gerados (pra cota e analytics)
 *   results  — último resultado por usuário (pra /diferente, /mais)
 */
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { logger } from './utils.js';

let db;

export function initDB() {
  const dbPath = process.env.DB_PATH || './data/bot.db';
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      phone        TEXT PRIMARY KEY,
      name         TEXT,
      ano          TEXT,
      materia      TEXT,
      onboarded    INTEGER DEFAULT 0,
      created_at   INTEGER NOT NULL,
      updated_at   INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      phone        TEXT PRIMARY KEY,
      photos_json  TEXT NOT NULL,         -- JSON array de {mediaId, mimeType, addedAt}
      last_added   INTEGER NOT NULL,
      timer_set    INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS studies (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      phone        TEXT NOT NULL,
      ts           INTEGER NOT NULL,
      input_kind   TEXT NOT NULL,          -- 'photos' | 'video'
      input_count  INTEGER,
      tokens_in    INTEGER,
      tokens_out   INTEGER,
      titulo       TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_studies_phone ON studies(phone);

    CREATE TABLE IF NOT EXISTS results (
      phone        TEXT PRIMARY KEY,
      result_json  TEXT NOT NULL,
      ts           INTEGER NOT NULL
    );
  `);

  logger.info({ dbPath }, 'SQLite inicializado');
}

// ─── Users ──────────────────────────────────────────────────────────
export function getUser(phone) {
  return db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
}

export function upsertUser(phone, patch = {}) {
  const now = Date.now();
  const existing = getUser(phone);
  if (existing) {
    const fields = [];
    const values = [];
    for (const [k, v] of Object.entries(patch)) {
      fields.push(`${k} = ?`);
      values.push(v);
    }
    if (fields.length === 0) return existing;
    fields.push('updated_at = ?');
    values.push(now, phone);
    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE phone = ?`).run(...values);
    return getUser(phone);
  }
  db.prepare(`
    INSERT INTO users (phone, name, ano, materia, onboarded, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    phone,
    patch.name || null,
    patch.ano || null,
    patch.materia || null,
    patch.onboarded ? 1 : 0,
    now, now,
  );
  return getUser(phone);
}

// ─── Sessions (buffer de fotos com debounce) ──────────────────────
export function getSession(phone) {
  const row = db.prepare('SELECT * FROM sessions WHERE phone = ?').get(phone);
  if (!row) return null;
  return { ...row, photos: JSON.parse(row.photos_json) };
}

export function addPhotoToSession(phone, photoMeta) {
  const now = Date.now();
  const existing = getSession(phone);
  const photos = existing ? existing.photos : [];
  photos.push({ ...photoMeta, addedAt: now });

  if (existing) {
    db.prepare('UPDATE sessions SET photos_json = ?, last_added = ? WHERE phone = ?')
      .run(JSON.stringify(photos), now, phone);
  } else {
    db.prepare('INSERT INTO sessions (phone, photos_json, last_added, timer_set) VALUES (?, ?, ?, 0)')
      .run(phone, JSON.stringify(photos), now);
  }
  return photos;
}

export function clearSession(phone) {
  db.prepare('DELETE FROM sessions WHERE phone = ?').run(phone);
}

export function setSessionTimerFlag(phone, val) {
  db.prepare('UPDATE sessions SET timer_set = ? WHERE phone = ?').run(val ? 1 : 0, phone);
}

// ─── Studies (analytics + cota) ───────────────────────────────────
export function recordStudy(phone, data) {
  db.prepare(`
    INSERT INTO studies (phone, ts, input_kind, input_count, tokens_in, tokens_out, titulo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    phone, Date.now(),
    data.inputKind,
    data.inputCount || 0,
    data.tokensIn || 0,
    data.tokensOut || 0,
    data.titulo || null,
  );
}

export function countStudies(phone) {
  return db.prepare('SELECT COUNT(*) AS n FROM studies WHERE phone = ?').get(phone).n;
}

// ─── Last result (pra /diferente, /mais, /gabarito) ───────────────
export function saveLastResult(phone, result) {
  const json = JSON.stringify(result);
  const now = Date.now();
  const exists = db.prepare('SELECT 1 FROM results WHERE phone = ?').get(phone);
  if (exists) {
    db.prepare('UPDATE results SET result_json = ?, ts = ? WHERE phone = ?').run(json, now, phone);
  } else {
    db.prepare('INSERT INTO results (phone, result_json, ts) VALUES (?, ?, ?)').run(phone, json, now);
  }
}

export function getLastResult(phone) {
  const row = db.prepare('SELECT * FROM results WHERE phone = ?').get(phone);
  if (!row) return null;
  try { return JSON.parse(row.result_json); } catch { return null; }
}

export function getDB() { return db; }
