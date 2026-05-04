/**
 * Roteador de mensagens.
 *
 * Recebe um objeto Message do Meta (msg) e decide:
 *   - texto começando com / → comando
 *   - texto sem / → conversa livre (saudação, dúvida)
 *   - imagem → adiciona ao buffer de fotos da sessão
 *   - vídeo → processa direto como estudo
 *
 * Quando recebe foto, espera DEBOUNCE_MS depois da última (default 8s)
 * antes de processar — assim o usuário pode mandar 5 fotos em sequência
 * e tudo entra como UM estudo só.
 */
import {
  getUser, upsertUser,
  addPhotoToSession, getSession, clearSession, setSessionTimerFlag,
  recordStudy, saveLastResult, getLastResult,
} from './state.js';
import {
  sendText, sendTextChunks, sendAudio, downloadMedia, saveTempFile, markAsRead,
} from './whatsapp.js';
import { callVision, callText } from './vision.js';
import { extractFrames, resizeImage } from './video.js';
import { promptEstudo, promptExplicaDiferente, promptMaisPerguntas } from './prompts.js';
import { isTTSEnabled, synthesize } from './tts.js';
import { quotaInfo } from './quota.js';
import { logger, isAdmin, sleep } from './utils.js';

const DEBOUNCE_MS = parseInt(process.env.PHOTO_DEBOUNCE_MS || '8000', 10);
const DEFAULT_QTD = parseInt(process.env.DEFAULT_QTD || '8', 10);

const debounceTimers = new Map(); // phone → setTimeout id

// ─── Entry point ─────────────────────────────────────────────────────
export async function handleIncoming(msg, contacts = []) {
  const from = msg.from;
  const contact = contacts.find(c => c.wa_id === from);
  const name = contact?.profile?.name || null;

  await markAsRead(msg.id);

  // Cria/atualiza usuário (registra nome de WhatsApp se nunca vimos)
  let user = getUser(from);
  if (!user) {
    user = upsertUser(from, { name, onboarded: 0 });
    await onboardingWelcome(from);
  } else if (name && user.name !== name) {
    upsertUser(from, { name });
  }

  switch (msg.type) {
    case 'text':       return handleText(from, msg.text.body, user);
    case 'image':      return handleImage(from, msg.image, user);
    case 'video':      return handleVideo(from, msg.video, user);
    case 'audio':      return sendText(from, '🎤 Áudio recebido, mas ainda não processo dúvidas faladas. Manda em texto ou foto da página.');
    case 'document':   return sendText(from, '📎 Document recebido — por ora só processo *fotos* ou *vídeo*. Tira foto da página, por favor!');
    default:           return sendText(from, 'Recebi mas não sei o que fazer com isso. Manda foto da página do livro!');
  }
}

// ─── Onboarding ─────────────────────────────────────────────────────
async function onboardingWelcome(from) {
  await sendTextChunks(from, [
`👋 Oi! Eu sou o *Estudo com Foto*, seu tutor IA pra estudar com seu filho.

Funciona assim:
📷 Você tira foto (ou grava vídeo) da página do livro
📖 Eu faço um *resumo* fácil de entender
📝 E gero *exercícios com gabarito explicado*

Você tem *${process.env.FREE_QUOTA || '3'} estudos grátis* pra testar.`,
`Antes de começar, qual o ano escolar do seu filho?

Manda só um número de 1 a 9 (ex: \`4\` pra 4º ano do fundamental) ou \`1m\` / \`2m\` / \`3m\` pra ensino médio.`,
  ]);
}

// ─── Texto / comandos ──────────────────────────────────────────────
async function handleText(from, raw, user) {
  const t = (raw || '').trim();
  const tl = t.toLowerCase();

  // Comandos com /
  if (tl.startsWith('/ajuda') || tl === 'ajuda' || tl === 'help' || tl === '?') {
    return sendText(from, helpText());
  }
  if (tl.startsWith('/ano')) {
    return setAno(from, tl.replace(/^\/ano\s*/, ''));
  }
  if (tl.startsWith('/materia') || tl.startsWith('/matéria')) {
    const v = t.replace(/^\/mat[eé]ria\s*/i, '').trim();
    upsertUser(from, { materia: v || null });
    return sendText(from, v ? `📚 Matéria definida: *${v}*` : '📚 Matéria removida (vou detectar pelo conteúdo).');
  }
  if (tl === '/diferente' || tl === 'diferente') {
    return cmdDiferente(from, user);
  }
  if (tl.startsWith('/mais') || tl === 'mais') {
    return cmdMaisPerguntas(from, user);
  }
  if (tl === '/gabarito' || tl === 'gabarito') {
    return cmdGabarito(from, user);
  }
  if (tl === '/cota' || tl === 'cota') {
    const q = quotaInfo(from);
    return sendText(from, q.blocked
      ? `🔒 Você usou seus ${q.limit} estudos grátis. Pra continuar, assine: ${planLink()}`
      : `📊 Você já fez *${q.used}* estudos. Restam *${q.remaining}* grátis.`);
  }
  if (tl === '/start' || tl === 'oi' || tl === 'olá' || tl === 'ola') {
    if (!user.onboarded) return onboardingWelcome(from);
    return sendText(from, `Oi de novo! 👋 Manda a foto da página pra começar.\n\nDica: \`/ajuda\` lista todos os comandos.`);
  }

  // Setar ano só com número (durante onboarding)
  if (!user.ano) {
    const matched = matchAno(tl);
    if (matched) return setAno(from, tl);
  }

  // Texto livre — pequena conversa
  if (/(obrigad|valeu|legal|ótimo|otimo|top|bom)/i.test(tl)) {
    return sendText(from, '😊 Que bom! Manda outra foto quando quiser estudar mais.');
  }

  return sendText(from, 'Não entendi 🤔. Manda *foto da página* do livro pra eu fazer o resumo.\n\nOu digita `/ajuda` pra ver os comandos.');
}

function matchAno(s) {
  const m = s.match(/^([1-9])\s*$|^([1-9])\s*(o|º|ano)?$|^([1-3])\s*m$/i);
  if (!m) return null;
  const n = m[1] || m[2];
  if (n) return `${n}º ano (Fundamental)`;
  if (m[4]) return `${m[4]}ª série (Médio)`;
  return null;
}

async function setAno(from, raw) {
  const ano = matchAno(raw.trim());
  if (!ano) {
    return sendText(from, 'Não consegui entender o ano 🤔. Manda só o número, tipo `4` pro 4º ano fundamental ou `2m` pro 2º médio.');
  }
  upsertUser(from, { ano, onboarded: 1 });
  await sendTextChunks(from, [
    `✅ Ano definido: *${ano}*`,
    `Pronto pra começar! Manda agora a *foto da página* do livro do seu filho.\n\nPode mandar várias fotos em sequência (eu junto tudo). Quando parar de mandar por uns 8 segundos, começo a processar.`,
  ]);
}

function helpText() {
  return `🎓 *Comandos disponíveis*

📷 *Foto da página* → eu gero resumo + exercícios
🎥 *Vídeo passando pelas páginas* → mesma coisa, em massa

\`/ano N\` — define ano escolar (1 a 9, ou 1m/2m/3m)
\`/materia X\` — força matéria (ex: \`/materia história\`)
\`/diferente\` — refaz o resumo com outra abordagem
\`/mais\` — gera mais 5 exercícios sobre o último estudo
\`/gabarito\` — revela respostas do último estudo
\`/cota\` — vê quantos estudos grátis você ainda tem
\`/ajuda\` — esta mensagem`;
}

// ─── Foto recebida ──────────────────────────────────────────────────
async function handleImage(from, image, user) {
  if (!user.ano) {
    return sendText(from, 'Antes de eu fazer o estudo, me diz o ano escolar do seu filho 😊\n\nManda só um número de 1 a 9 (ou 1m/2m/3m).');
  }
  if (!user.onboarded) upsertUser(from, { onboarded: 1 });

  const q = quotaInfo(from);
  if (q.blocked) {
    return sendText(from, `🔒 Você já usou seus ${q.limit} estudos grátis. Pra continuar, assine: ${planLink()}`);
  }

  // Adiciona ao buffer e arma o debounce
  addPhotoToSession(from, { mediaId: image.id, mimeType: image.mime_type });

  // Cancela timer anterior se houver
  if (debounceTimers.has(from)) clearTimeout(debounceTimers.get(from));

  const total = (getSession(from)?.photos || []).length;
  // Mensagem rápida só pra confirmar recebimento (sem spammar a cada foto)
  if (total === 1) {
    await sendText(from, `📷 Foto 1 recebida! Pode mandar mais ou eu começo em ${Math.round(DEBOUNCE_MS/1000)} segundos.`);
  }

  const timer = setTimeout(() => processBufferedPhotos(from).catch(err => {
    logger.error({ err, from }, 'Falha em processBufferedPhotos');
    sendText(from, '😢 Deu um problema pra processar suas fotos. Tenta de novo, por favor.');
  }), DEBOUNCE_MS);
  debounceTimers.set(from, timer);
}

async function processBufferedPhotos(from) {
  debounceTimers.delete(from);
  const session = getSession(from);
  if (!session || session.photos.length === 0) return;
  const photos = session.photos;
  clearSession(from);

  const user = getUser(from);
  await sendText(from, `📚 Recebi ${photos.length} foto(s). Agora estou lendo e preparando seu estudo… (~30 a 60 segundos)`);

  // Baixa cada foto, redimensiona
  const buffers = [];
  for (const p of photos) {
    try {
      const dl = await downloadMedia(p.mediaId);
      const resized = await resizeImage(dl.buffer, dl.mimeType);
      buffers.push(resized);
    } catch (err) {
      logger.error({ err, mediaId: p.mediaId }, 'Falha baixando foto');
    }
  }
  if (buffers.length === 0) {
    return sendText(from, '😢 Não consegui baixar nenhuma das fotos. Tenta enviar de novo.');
  }

  await runStudy(from, user, buffers, 'photos');
}

// ─── Vídeo recebido ─────────────────────────────────────────────────
async function handleVideo(from, video, user) {
  if (!user.ano) {
    return sendText(from, 'Antes de processar o vídeo, me diz o ano escolar do seu filho 😊\n\nManda só um número de 1 a 9 (ou 1m/2m/3m).');
  }
  if (!user.onboarded) upsertUser(from, { onboarded: 1 });

  const q = quotaInfo(from);
  if (q.blocked) {
    return sendText(from, `🔒 Você já usou seus ${q.limit} estudos grátis. Pra continuar, assine: ${planLink()}`);
  }

  await sendText(from, '🎥 Recebi seu vídeo! Estou extraindo as páginas e lendo… (~60 a 90 segundos)');

  try {
    const dl = await downloadMedia(video.id);
    const videoFile = saveTempFile(dl.buffer, 'mp4');
    const frames = await extractFrames(videoFile);
    if (frames.length === 0) {
      return sendText(from, 'Não consegui extrair frames do vídeo 😢. Tenta gravar de novo, parando 1-2 segundos em cada página.');
    }
    await sendText(from, `🖼️ Extraí ${frames.length} páginas do vídeo. Agora chamando a IA…`);
    await runStudy(from, user, frames, 'video');
  } catch (err) {
    logger.error({ err, from }, 'Falha processando vídeo');
    await sendText(from, '😢 Deu erro ao processar o vídeo. Tenta gravar mais curto ou mandar fotos individuais.');
  }
}

// ─── Núcleo: chama IA, formata, manda ───────────────────────────────
async function runStudy(from, user, imageBuffers, kind) {
  const prompt = promptEstudo({
    ano: user.ano,
    materia: user.materia,
    qtd: DEFAULT_QTD,
  });

  let result, usage;
  try {
    const r = await callVision(imageBuffers, prompt);
    result = r.json;
    usage = r.usage;
  } catch (err) {
    logger.error({ err, from }, 'Falha na IA');
    return sendText(from, '😢 A IA deu erro. Tenta de novo em alguns segundos, ou tira fotos com mais luz.');
  }

  // Persiste
  result.ano = user.ano;
  result.materia = user.materia;
  saveLastResult(from, result);
  recordStudy(from, {
    inputKind: kind,
    inputCount: imageBuffers.length,
    tokensIn: usage?.input_tokens || 0,
    tokensOut: usage?.output_tokens || 0,
    titulo: result.titulo,
  });

  await sendStudyResult(from, result);

  // Cota restante
  const q = quotaInfo(from);
  if (!isAdmin(from) && q.remaining > 0 && q.remaining <= 2) {
    await sleep(500);
    await sendText(from, `📊 Você ainda tem *${q.remaining}* estudo(s) grátis. Quando acabar, link de assinatura: ${planLink()}`);
  } else if (q.blocked) {
    await sleep(500);
    await sendText(from, `🔒 Esse foi seu último estudo grátis! Pra continuar usando, assine: ${planLink()}`);
  }
}

async function sendStudyResult(from, result) {
  // 1) Resumo
  const resumoTxt = `📖 *${result.titulo || 'Resumo'}*\n\n${(result.resumo || []).join('\n\n')}`;
  await sendText(from, resumoTxt);

  // 2) Áudio do resumo (se TTS configurado)
  if (isTTSEnabled()) {
    try {
      const audio = await synthesize((result.resumo || []).join(' '));
      if (audio) await sendAudio(from, audio);
    } catch (err) {
      logger.warn({ err }, 'Falha gerando áudio (não crítico)');
    }
  }

  // 3) Conceitos
  if (result.conceitos?.length) {
    const conceitosTxt = `🔑 *Conceitos-chave*\n\n` +
      result.conceitos.map(c => `• *${c.termo}* — ${c.definicao}`).join('\n');
    await sleep(400);
    await sendText(from, conceitosTxt);
  }

  // 4) Perguntas (sem gabarito)
  if (result.perguntas?.length) {
    const perguntasTxt = `📝 *Exercícios* (${result.perguntas.length})\n\n` +
      result.perguntas.map((p, i) => formatPergunta(p, i+1)).join('\n\n');
    await sleep(400);
    await sendText(from, perguntasTxt);
    await sleep(400);
    await sendText(from, `💡 Quando seu filho terminar, manda *\`/gabarito\`* pra eu mostrar as respostas com explicação.\n\nQuer mais 5 exercícios? Manda \`/mais\`.\nNão entendeu o resumo? \`/diferente\`.`);
  }
}

function formatPergunta(p, n) {
  const head = `*${n}.* ${p.enunciado}`;
  if (p.tipo === 'multipla' && Array.isArray(p.opcoes)) {
    const opts = p.opcoes.map((o, i) => `   ${String.fromCharCode(65+i)}) ${o}`).join('\n');
    return `${head}\n${opts}`;
  }
  if (p.tipo === 'vf') {
    return `${head}\n   (V) Verdadeiro   (F) Falso`;
  }
  return head; // curta
}

// ─── /diferente ─────────────────────────────────────────────────────
async function cmdDiferente(from, user) {
  const prev = getLastResult(from);
  if (!prev) return sendText(from, 'Você ainda não fez nenhum estudo 🤔. Manda foto de uma página primeiro.');

  await sendText(from, '🔄 Reescrevendo o resumo de outra forma…');
  try {
    const { json } = await callText(promptExplicaDiferente({ prev, ano: user.ano, materia: user.materia }));
    prev.resumo = json.resumo || prev.resumo;
    prev.conceitos = json.conceitos || prev.conceitos;
    if (json.titulo) prev.titulo = json.titulo;
    saveLastResult(from, prev);

    const txt = `📖 *${prev.titulo || 'Resumo'}* (outra explicação)\n\n${prev.resumo.join('\n\n')}`;
    await sendText(from, txt);

    if (prev.conceitos?.length) {
      await sleep(400);
      await sendText(from, `🔑 *Conceitos-chave*\n\n` +
        prev.conceitos.map(c => `• *${c.termo}* — ${c.definicao}`).join('\n'));
    }
  } catch (err) {
    logger.error({ err, from }, 'Falha em /diferente');
    await sendText(from, '😢 Deu erro. Tenta de novo daqui a pouco.');
  }
}

// ─── /mais ──────────────────────────────────────────────────────────
async function cmdMaisPerguntas(from, user) {
  const prev = getLastResult(from);
  if (!prev) return sendText(from, 'Você ainda não fez nenhum estudo 🤔. Manda foto de uma página primeiro.');

  await sendText(from, '✍️ Gerando mais 5 exercícios sobre o mesmo conteúdo…');
  try {
    const { json } = await callText(promptMaisPerguntas({ prev, ano: user.ano, materia: user.materia, qtd: 5 }));
    if (!json.perguntas?.length) {
      return sendText(from, 'Não consegui gerar mais exercícios 😢. Tenta de novo.');
    }
    // Acumula no resultado pra próximo /gabarito incluir
    prev.perguntas = [...(prev.perguntas || []), ...json.perguntas];
    saveLastResult(from, prev);

    const start = (prev.perguntas.length - json.perguntas.length) + 1;
    const txt = `📝 *Mais ${json.perguntas.length} exercícios*\n\n` +
      json.perguntas.map((p, i) => formatPergunta(p, start + i)).join('\n\n');
    await sendText(from, txt);
    await sleep(300);
    await sendText(from, '💡 Manda `/gabarito` pra ver respostas de todos os exercícios.');
  } catch (err) {
    logger.error({ err, from }, 'Falha em /mais');
    await sendText(from, '😢 Deu erro. Tenta de novo daqui a pouco.');
  }
}

// ─── /gabarito ──────────────────────────────────────────────────────
async function cmdGabarito(from, _user) {
  const prev = getLastResult(from);
  if (!prev?.perguntas?.length) {
    return sendText(from, 'Você ainda não tem exercícios 🤔. Manda foto de uma página primeiro.');
  }
  const lines = prev.perguntas.map((p, i) => {
    let resp = '';
    if (p.tipo === 'multipla' && Array.isArray(p.opcoes)) {
      const idx = Number(p.correta);
      resp = `${String.fromCharCode(65 + idx)}) ${p.opcoes[idx] || ''}`;
    } else if (p.tipo === 'vf') {
      resp = p.correta ? 'Verdadeiro' : 'Falso';
    } else {
      resp = p.resposta || '';
    }
    return `*${i+1}.* ${resp}\n   _${p.explicacao || ''}_`;
  });

  // Quebra em chunks pra não estourar 4096 chars do WhatsApp
  const chunks = [];
  let curr = '✅ *Gabarito comentado*\n\n';
  for (const line of lines) {
    if (curr.length + line.length + 4 > 3800) {
      chunks.push(curr);
      curr = '';
    }
    curr += line + '\n\n';
  }
  if (curr.trim()) chunks.push(curr);
  await sendTextChunks(from, chunks);
}

// ─── Helpers ───────────────────────────────────────────────────────
function planLink() {
  return process.env.PLAN_LINK || 'https://matemagica.app.br/assine (em breve)';
}
