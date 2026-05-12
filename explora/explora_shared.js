// =========================================================
// EXPLORA_SHARED.JS — Infra comum para todos os anos
// Gamificação: moedas, estrelas, streak, progresso por jogo
// Usado em todas as páginas ano_N.html
// =========================================================

// Cada página define: STORAGE_KEY antes de chamar initExplora()
let STORAGE_KEY = 'explora_default';

// ============== TUTORIAL ATALHO NA TELA (PWA) ==============
// Espelha a função do Matemágica jogos_shared.js. Detecta plataforma e
// mostra como criar atalho na tela inicial.
function detectarPlataforma() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
  const isChrome = /Chrome|CriOS/.test(ua) && !/Edg/.test(ua);
  const isEdge = /Edg/.test(ua);
  const isFirefox = /Firefox|FxiOS/.test(ua);
  const isMobile = isIOS || isAndroid;
  const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  if (isStandalone) return 'instalado';
  if (isIOS && isSafari) return 'ios-safari';
  if (isIOS) return 'ios-outro';
  if (isAndroid && isChrome) return 'android-chrome';
  if (isAndroid) return 'android-outro';
  if (!isMobile && isChrome) return 'desktop-chrome';
  if (!isMobile && isEdge) return 'desktop-edge';
  if (!isMobile && isSafari) return 'desktop-safari';
  if (!isMobile && isFirefox) return 'desktop-firefox';
  return 'desconhecido';
}

const INSTRUCOES_INSTALAR = {
  'instalado': { titulo: '✅ Já tá na tela', corpo: '<p>Já tá tudo certo. Abra pelo ícone direto.</p>' },
  'ios-safari': { titulo: '📱 iPhone (Safari)', corpo: `<ol><li>Toca no botão <b>Compartilhar</b> ⎘ (em baixo da tela)</li><li>Rola e toca em <b>Adicionar à Tela de Início</b></li><li>Toca em <b>Adicionar</b> no canto superior direito</li></ol><p style="font-size:11px;color:#888;margin-top:6px">Não funciona no Chrome do iPhone — precisa ser no Safari.</p>` },
  'ios-outro': { titulo: '📱 iPhone (precisa do Safari)', corpo: `<ol><li>Copia o link da página</li><li>Abre o <b>Safari</b> e cola</li><li>Toca em ⎘ <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b></li></ol><p style="font-size:11px;color:#888;margin-top:6px">Só o Safari instala app no iPhone. Chrome iPhone não consegue.</p>` },
  'android-chrome': { titulo: '📱 Android (Chrome)', corpo: `<ol><li>Toca em <b>⋮</b> (3 pontinhos) no canto superior direito</li><li>Procura uma destas opções (o nome muda por celular):<br>• <b>Instalar app</b><br>• <b>Adicionar à tela inicial</b><br>• <b>Adicionar atalho à tela de início</b></li><li>Toca em <b>Instalar</b> ou <b>Adicionar</b></li></ol>` },
  'android-outro': { titulo: '📱 Android', corpo: `<ol><li>Abra essa página no <b>Chrome</b> do Android</li><li>Toca em <b>⋮</b> no canto superior direito</li><li><b>Instalar app</b> ou <b>Adicionar à tela inicial</b></li></ol>` },
  'desktop-chrome': { titulo: '💻 Chrome (PC/Mac)', corpo: `<ol><li>Ícone <b>⊞</b> à direita da URL</li><li><b>Instalar</b></li></ol><p style="font-size:11px;color:#888;margin-top:6px">Não vê? <b>⋮ → Instalar Matemágica</b>.</p>` },
  'desktop-edge': { titulo: '💻 Edge', corpo: `<p>Ícone <b>⊞</b> na barra de endereço → <b>Instalar</b>.</p>` },
  'desktop-safari': { titulo: '💻 Mac (Safari)', corpo: `<p>Menu <b>Arquivo → Adicionar ao Dock…</b> (macOS 14+)</p>` },
  'desktop-firefox': { titulo: '💻 Firefox', corpo: `<p>Use <b>Chrome</b> ou <b>Edge</b>. Ou Ctrl+D pra favoritar.</p>` },
  'desconhecido': { titulo: '📱 Como criar atalho', corpo: `<ul><li><b>iPhone:</b> Safari → ⎘ → Adicionar à Tela</li><li><b>Android:</b> Chrome → ⋮ → Instalar</li><li><b>PC:</b> Chrome/Edge → ⊞ na URL</li></ul>` }
};

function mostrarTutorialInstalar() {
  const plat = detectarPlataforma();
  const instr = INSTRUCOES_INSTALAR[plat] || INSTRUCOES_INSTALAR['desconhecido'];
  // EXPLORA tem modal-overlay próprio nas páginas que precisam, ou usa alert simples
  const m = document.getElementById('modal-overlay');
  if (!m) {
    // Página sem modal — usa alert básico
    const txt = `${instr.titulo}\n\n${instr.corpo.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`;
    alert(txt);
    return;
  }
  const emoji = document.getElementById('m-emoji');
  const titulo = document.getElementById('m-titulo');
  const conteudo = document.getElementById('m-conteudo');
  const btn = document.getElementById('modal-btn');
  if (emoji) emoji.textContent = plat === 'instalado' ? '✅' : '📱';
  if (titulo) titulo.textContent = instr.titulo;
  if (conteudo) {
    const outras = Object.keys(INSTRUCOES_INSTALAR).filter(k => k !== plat && k !== 'desconhecido' && k !== 'instalado');
    conteudo.innerHTML = `
      <style>
        .ti-mini { font-size: 12.5px; color: #4a3b8a; line-height: 1.5; text-align: left; }
        .ti-mini ol, .ti-mini ul { padding-left: 18px; margin: 4px 0; }
        .ti-mini li { margin: 2px 0; }
        .ti-mini p { margin: 4px 0; }
        .ti-mini b { color: #8b5a2b; }
      </style>
      <div class="ti-mini">
        <div style="background:#fff4dc;border-radius:6px;padding:6px 10px;margin-bottom:8px;font-size:11px;color:#8b5a2b">
          Ícone na tela · tela cheia · funciona offline.
        </div>
        <div id="instr-atual">${instr.corpo}</div>
        <details style="margin-top:10px;font-size:11px;color:#888">
          <summary style="cursor:pointer;color:#8b5a2b;font-weight:700">Outro dispositivo?</summary>
          <div style="margin-top:6px;display:grid;gap:4px">
            ${outras.map(k => `<button onclick="_mudarInstrInstalar('${k}')" style="text-align:left;background:#fff4dc;border:1px solid #c9a86b;padding:4px 8px;border-radius:6px;font-size:11px;color:#8b5a2b;cursor:pointer;font-family:inherit">${INSTRUCOES_INSTALAR[k].titulo}</button>`).join('')}
          </div>
        </details>
      </div>`;
  }
  if (titulo) { titulo.style.fontSize = '17px'; titulo.style.margin = '4px 0 8px'; }
  if (emoji) { emoji.style.fontSize = '32px'; }
  if (btn) { btn.textContent = 'OK 👍'; btn.onclick = () => fecharModal(); }
  m.classList.remove('hidden');
}

function _mudarInstrInstalar(plat) {
  const instr = INSTRUCOES_INSTALAR[plat];
  const titulo = document.getElementById('m-titulo');
  const cont = document.getElementById('instr-atual');
  if (titulo) titulo.textContent = instr.titulo;
  if (cont) cont.innerHTML = instr.corpo;
}

function fecharModal() {
  const m = document.getElementById('modal-overlay');
  if (m) m.classList.add('hidden');
}

// ============== LICENÇA COMPARTILHADA COM MATEMÁGICA ==============
// EXPLORA é entregue como BÔNUS de quem compra Matemágica.
// Usa a mesma chave de licença — localStorage é compartilhado dentro do domínio.
const LICENCA_STORAGE_KEY_EXPLORA = 'matemagica_licenca_v1';
const CHECKOUT_URL_EXPLORA = 'https://pay.hotmart.com/A105538417J';
const PRECO_EXPLORA = 'R$ 27';
// Site liberado: nenhuma página é mais gated por licença.
const PAGINAS_PREMIUM_EXPLORA = [];

function ehPremiumExplora() {
  // MODELO ATUAL: app 100% liberado. Retorna true pra todos.
  return true;
}

function abrirPaywallExplora() { /* no-op: app gratuito */ }

function abrirReativarExplora() {
  const k = prompt('Cole a chave de ativação do Matemágica (recebida por email — ex: MM-XXXX-XXXX-XXXX-XXXX):');
  if (!k) return;
  const key = k.trim().toUpperCase();
  fetch(`/api/ativar?key=${encodeURIComponent(key)}`)
    .then(r => r.json())
    .then(data => {
      if (data.valid) {
        localStorage.setItem(LICENCA_STORAGE_KEY_EXPLORA, JSON.stringify({
          key, email: data.email || null, ativadaEm: new Date().toISOString()
        }));
        alert('✨ Liberado! Matemágica + EXPLORA completos.');
        location.reload();
      } else {
        alert('❌ Chave inválida');
      }
    })
    .catch(() => alert('Erro de rede. Tenta de novo.'));
}

// Auto-captura ?ativar=KEY (caso o link de ativação do email venha pra uma página do EXPLORA)
(function autoAtivarExplora() {
  try {
    const p = new URLSearchParams(location.search);
    const k = p.get('ativar');
    if (!k) return;
    const key = k.trim().toUpperCase();
    fetch(`/api/ativar?key=${encodeURIComponent(key)}`)
      .then(r => r.json()).then(data => {
        if (data.valid) {
          localStorage.setItem(LICENCA_STORAGE_KEY_EXPLORA, JSON.stringify({
            key, email: data.email || null, ativadaEm: new Date().toISOString()
          }));
          const url = new URL(location.href);
          url.searchParams.delete('ativar');
          history.replaceState({}, '', url.pathname + (url.search || ''));
          alert('✨ Matemágica Completo + EXPLORA liberados!');
          location.reload();
        }
      }).catch(()=>{});
  } catch(e) {}
})();

// MODELO ATUAL: EXPLORA 100% liberado. Guarda desativada.
function guardaAnoPremiumExplora() { /* no-op */ }

function _readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { moedas: 0, estrelas: 0, streak: 0, streakMax: 0, jogos: {}, diasJogados: [] };
}

function _saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch(e) {}
}

let STATE = _readState();

// ============== HELPERS DE GAMIFICAÇÃO ==============
function addAcerto(jogoId) {
  STATE.moedas += 1;
  STATE.estrelas += 1;
  STATE.streak += 1;
  if (STATE.streak > STATE.streakMax) STATE.streakMax = STATE.streak;
  if (!STATE.jogos[jogoId]) STATE.jogos[jogoId] = { acertos: 0, erros: 0, melhorStreak: 0 };
  STATE.jogos[jogoId].acertos += 1;
  if (STATE.streak > STATE.jogos[jogoId].melhorStreak) STATE.jogos[jogoId].melhorStreak = STATE.streak;
  _marcarDia();
  _saveState(STATE);
  _renderHeader();
  tocarSom('acerto');
}

function addErro(jogoId) {
  STATE.streak = 0;
  if (!STATE.jogos[jogoId]) STATE.jogos[jogoId] = { acertos: 0, erros: 0, melhorStreak: 0 };
  STATE.jogos[jogoId].erros += 1;
  _marcarDia();
  _saveState(STATE);
  _renderHeader();
  tocarSom('erro');
}

function _marcarDia() {
  const hoje = new Date().toISOString().slice(0, 10);
  if (!STATE.diasJogados.includes(hoje)) STATE.diasJogados.push(hoje);
}

// ============== HEADER ==============
function _renderHeader() {
  const el = document.getElementById('explora-header');
  if (!el) return;
  const m = getMascoteAtivo();
  const nivel = Math.floor(STATE.estrelas / 10) + 1;
  const faltaProxNivel = (nivel * 10) - STATE.estrelas;
  const percentXp = ((STATE.estrelas % 10) / 10) * 100;
  el.innerHTML = `
    <div class="hp-avatar" title="${m.nome}">${_svgMiniMascote(m.svg)}</div>
    <div class="hp-main">
      <div class="hp-topo">
        <span>Nível ${nivel} · <span style="color:#8b5a2b">${faltaProxNivel}⭐ pro próximo</span></span>
        <span class="hp-moedas">🪙 ${STATE.moedas}</span>
      </div>
      <div class="hp-xp-bar"><div class="hp-xp-fill" style="width:${percentXp}%"></div></div>
      <div class="hp-rodape">
        <span>⭐ ${STATE.estrelas}</span>
        <span>🔥 ${STATE.streak}</span>
        <span>🏆 ${STATE.streakMax}</span>
        <span>📅 ${STATE.diasJogados.length}d</span>
      </div>
    </div>
  `;
}

function _svgMiniMascote(svgHtml) {
  return `<div style="width:40px;height:44px;overflow:hidden;display:flex;align-items:center;justify-content:center">
    ${svgHtml.replace('class="mascote"', 'style="width:100%;height:100%;pointer-events:none"').replace(/animation:[^;"']+/g, '')}
  </div>`;
}

// ============== MASCOTE COACH (in-game) ==============
let _coachTimeout = null;
function renderCoach() {
  let el = document.getElementById('mascote-coach');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mascote-coach';
    el.className = 'mascote-coach';
    document.body.appendChild(el);
  }
  const m = getMascoteAtivo();
  el.innerHTML = m.svg;
}

function coachFala(tipo) {
  renderCoach();
  const el = document.getElementById('mascote-coach');
  if (!el) return;
  const texto = falaAleatoria(tipo);
  const classe = tipo === 'acerto' ? 'verde' : (tipo === 'erro' ? 'vermelho' : '');
  const balao = document.createElement('div');
  balao.className = 'balao ' + classe;
  balao.textContent = texto;
  [...el.querySelectorAll('.balao')].forEach(b => b.remove());
  el.appendChild(balao);
  el.classList.remove('pulando', 'tristonho');
  if (tipo === 'acerto' || tipo === 'combo') el.classList.add('pulando');
  if (tipo === 'erro') el.classList.add('tristonho');
  clearTimeout(_coachTimeout);
  _coachTimeout = setTimeout(() => {
    balao.remove();
    el.classList.remove('pulando', 'tristonho');
  }, 2400);
}

// ============== SONS (Web Audio simples) ==============
let _audioCtx = null;
function _ensureAudio() {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  return _audioCtx;
}
function _beep(freq, duracao = 0.12, tipo = 'sine', vol = 0.12) {
  const ctx = _ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = tipo;
  osc.frequency.value = freq;
  gain.gain.value = vol;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracao);
  osc.stop(ctx.currentTime + duracao);
}
function tocarSom(tipo) {
  if (tipo === 'acerto') {
    _beep(660, 0.08, 'triangle');
    setTimeout(() => _beep(880, 0.12, 'triangle'), 70);
  } else if (tipo === 'erro') {
    _beep(220, 0.18, 'sawtooth', 0.08);
  } else if (tipo === 'fim') {
    _beep(523, 0.1, 'triangle');
    setTimeout(() => _beep(659, 0.1, 'triangle'), 90);
    setTimeout(() => _beep(784, 0.18, 'triangle'), 200);
  }
}

// ============== MOTOR DE JOGOS GENÉRICO ==============
// Cada jogo é: { id, emoji, titulo, desc, tipo: 'quiz'|'ordenar'|'classif'|'mapa',
//                perguntas:[...] } (varia por tipo)

let _jogoAtual = null;
let _perguntaIdx = 0;
let _acertosNoJogo = 0;
let _errosNoJogo = 0;
let _perguntasEmbaralhadas = [];
let _filtroNivel = 'todos'; // 'todos' | 'facil' | 'medio' | 'dificil'

// Etiqueta de nível (badge visual usado no quiz)
function _badgeNivel(nivel) {
  if (!nivel) return '';
  const mapa = {
    facil:   { cor: '#4a8f5a', bg: '#e0f7dc', txt: '🟢 Fácil' },
    medio:   { cor: '#a87800', bg: '#fff3d6', txt: '🟡 Médio' },
    dificil: { cor: '#a53a4a', bg: '#ffe0e0', txt: '🔴 Difícil' }
  };
  const m = mapa[nivel];
  if (!m) return '';
  return `<span style="display:inline-block;padding:2px 10px;border-radius:10px;background:${m.bg};color:${m.cor};font-size:11px;font-weight:700;letter-spacing:0.5px;margin-left:8px;vertical-align:middle">${m.txt}</span>`;
}

function abrirJogo(jogo) {
  _jogoAtual = jogo;
  _perguntaIdx = 0;
  _acertosNoJogo = 0;
  _errosNoJogo = 0;
  let perguntas = [...(jogo.perguntas || [])];
  if (_filtroNivel !== 'todos') {
    const filtradas = perguntas.filter(p => p.nivel === _filtroNivel);
    if (filtradas.length > 0) perguntas = filtradas;
  }
  _perguntasEmbaralhadas = _embaralhar(perguntas);
  const grid = document.getElementById('tela-grid');
  if (grid) grid.style.display = 'none';
  const capView = document.getElementById('tela-jogos-cap');
  if (capView) capView.style.display = 'none';
  const area = document.getElementById('tela-jogo');
  area.style.display = 'block';
  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderCoach();
  if (jogo.tipo === 'ordenar')      renderOrdenar();
  else if (jogo.tipo === 'classif') renderClassif();
  else if (jogo.tipo === 'vf')      renderVF();
  else if (jogo.tipo === 'cloze')   renderCloze();
  else if (jogo.tipo === 'memoria') renderMemoria();
  else                              renderQuiz();
}

function voltarGrid() {
  document.getElementById('tela-jogo').style.display = 'none';
  document.getElementById('tela-grid').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (typeof atualizarGridProgresso === 'function') atualizarGridProgresso();
}

// ============== QUIZ (múltipla escolha) ==============
function renderQuiz() {
  const area = document.getElementById('tela-jogo');
  const total = _perguntasEmbaralhadas.length;
  if (_perguntaIdx >= total) return fimDoJogo();
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  const opcoesEmbaralhadas = _embaralhar(q.opcoes.map((o, i) => ({ o, correto: i === (q.correta ?? 0) })));
  area.innerHTML = `
    <div class="jogo-header">
      <button class="btn-voltar" onclick="voltarGrid()">← Voltar</button>
      <div class="jogo-titulo-atual">${_jogoAtual.emoji} ${_jogoAtual.titulo}</div>
      <div class="jogo-contador">${_perguntaIdx + 1}/${total}</div>
    </div>
    <div class="pergunta">
      ${q.pergunta}${_badgeNivel(q.nivel)}
      ${q.hint ? `<span class="hint">${q.hint}</span>` : ''}
    </div>
    <div class="opcoes ${q.opcoes.length === 2 ? 'grid2' : ''}" id="q-opcoes">
      ${opcoesEmbaralhadas.map((x, idx) => `
        <button class="opcao" data-correto="${x.correto}" onclick="responderQuiz(this, ${idx})">
          ${x.o}
        </button>
      `).join('')}
    </div>
    <div id="q-fb"></div>
  `;
}

function responderQuiz(btn, idx) {
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  const correto = btn.dataset.correto === 'true';
  [...document.querySelectorAll('#q-opcoes .opcao')].forEach(b => {
    b.disabled = true;
    if (b === btn) b.classList.add(correto ? 'acerto' : 'erro');
    else if (b.dataset.correto === 'true') b.classList.add('acerto');
  });
  const fb = document.getElementById('q-fb');
  if (correto) {
    _acertosNoJogo++;
    addAcerto(_jogoAtual.id);
    coachFala(STATE.streak >= 5 ? 'combo' : 'acerto');
    fb.innerHTML = `<div class="feedback ok">✓ ${falaAleatoria('acerto')}${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
  } else {
    _errosNoJogo++;
    addErro(_jogoAtual.id);
    coachFala('erro');
    fb.innerHTML = `<div class="feedback erro">✗ Quase! ${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
  }
  setTimeout(() => { _perguntaIdx++; renderQuiz(); }, correto ? 1400 : 2400);
}

// ============== ORDENAR (linha do tempo) ==============
let _ordenacaoAtual = [];
function renderOrdenar() {
  const area = document.getElementById('tela-jogo');
  const total = _perguntasEmbaralhadas.length;
  if (_perguntaIdx >= total) return fimDoJogo();
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  _ordenacaoAtual = _embaralhar([...q.itens]);
  area.innerHTML = `
    <div class="jogo-header">
      <button class="btn-voltar" onclick="voltarGrid()">← Voltar</button>
      <div class="jogo-titulo-atual">${_jogoAtual.emoji} ${_jogoAtual.titulo}</div>
      <div class="jogo-contador">${_perguntaIdx + 1}/${total}</div>
    </div>
    <div class="pergunta">${q.pergunta}${q.hint ? `<span class="hint">${q.hint}</span>` : ''}</div>
    <div class="setas-tempo">← mais antigo · · · mais recente →</div>
    <div class="linha-tempo" id="lt-container">${_renderOrdenarItens()}</div>
    <div style="text-align:center">
      <button class="btn" onclick="verificarOrdenacao()">Conferir ordem</button>
    </div>
    <div id="q-fb"></div>
  `;
  _montarDragOrdenar();
}

function _renderOrdenarItens() {
  return _ordenacaoAtual.map((it, idx) => `
    <div class="item" draggable="true" data-idx="${idx}">
      ${it.emoji ? `<span class="emoji">${it.emoji}</span>` : ''}
      <span>${it.label}</span>
    </div>
  `).join('');
}

function _montarDragOrdenar() {
  const cont = document.getElementById('lt-container');
  if (!cont) return;
  let dragIdx = null;
  cont.querySelectorAll('.item').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragIdx = Number(el.dataset.idx);
      el.classList.add('arrastando');
    });
    el.addEventListener('dragend', () => el.classList.remove('arrastando'));
    el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('alvo'); });
    el.addEventListener('dragleave', () => el.classList.remove('alvo'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('alvo');
      const dropIdx = Number(el.dataset.idx);
      if (dragIdx === null || dragIdx === dropIdx) return;
      const movido = _ordenacaoAtual.splice(dragIdx, 1)[0];
      _ordenacaoAtual.splice(dropIdx, 0, movido);
      cont.innerHTML = _renderOrdenarItens();
      _montarDragOrdenar();
    });
    // Touch — swap vizinhos com tap
    el.addEventListener('click', () => {
      if (dragIdx === null) { dragIdx = Number(el.dataset.idx); el.classList.add('alvo'); }
      else {
        const dropIdx = Number(el.dataset.idx);
        if (dragIdx !== dropIdx) {
          const m = _ordenacaoAtual.splice(dragIdx, 1)[0];
          _ordenacaoAtual.splice(dropIdx, 0, m);
        }
        dragIdx = null;
        cont.innerHTML = _renderOrdenarItens();
        _montarDragOrdenar();
      }
    });
  });
}

function verificarOrdenacao() {
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  const certa = q.itens.map(x => x.id);
  const atual = _ordenacaoAtual.map(x => x.id);
  const correto = certa.every((id, i) => id === atual[i]);
  const fb = document.getElementById('q-fb');
  if (correto) {
    _acertosNoJogo++;
    addAcerto(_jogoAtual.id);
    coachFala('acerto');
    fb.innerHTML = `<div class="feedback ok">✓ Ordem perfeita!${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
    setTimeout(() => { _perguntaIdx++; renderOrdenar(); }, 1500);
  } else {
    _errosNoJogo++;
    addErro(_jogoAtual.id);
    coachFala('erro');
    const nomes = q.itens.map(x => x.label).join(' → ');
    fb.innerHTML = `<div class="feedback erro">✗ Não é essa ordem. A correta é: <b>${nomes}</b>${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
    setTimeout(() => { _perguntaIdx++; renderOrdenar(); }, 3200);
  }
}

// ============== CLASSIFICAR (drag para 2 baldes) ==============
let _classifPool = [];
let _classifBuckets = { a: [], b: [] };

function renderClassif() {
  const area = document.getElementById('tela-jogo');
  const total = _perguntasEmbaralhadas.length;
  if (_perguntaIdx >= total) return fimDoJogo();
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  _classifPool = _embaralhar([...q.itens]);
  _classifBuckets = { a: [], b: [] };
  area.innerHTML = `
    <div class="jogo-header">
      <button class="btn-voltar" onclick="voltarGrid()">← Voltar</button>
      <div class="jogo-titulo-atual">${_jogoAtual.emoji} ${_jogoAtual.titulo}</div>
      <div class="jogo-contador">${_perguntaIdx + 1}/${total}</div>
    </div>
    <div class="pergunta">${q.pergunta}${q.hint ? `<span class="hint">${q.hint}</span>` : ''}</div>
    <div class="classif-pool" id="cl-pool"></div>
    <div class="classif-wrap">
      <div class="classif-bucket" data-b="a">
        <h3>${q.bucketA.emoji || ''} ${q.bucketA.label}</h3>
        <div class="itens" id="cl-a"></div>
      </div>
      <div class="classif-bucket" data-b="b">
        <h3>${q.bucketB.emoji || ''} ${q.bucketB.label}</h3>
        <div class="itens" id="cl-b"></div>
      </div>
    </div>
    <div style="text-align:center">
      <button class="btn" onclick="verificarClassif()">Conferir</button>
    </div>
    <div id="q-fb"></div>
  `;
  _pintarClassif();
  _montarDragClassif();
}

function _pintarClassif() {
  document.getElementById('cl-pool').innerHTML = _classifPool.map(i =>
    `<div class="classif-chip" draggable="true" data-id="${i.id}">${i.label}</div>`
  ).join('');
  document.getElementById('cl-a').innerHTML = _classifBuckets.a.map(i =>
    `<div class="classif-chip" draggable="true" data-id="${i.id}">${i.label}</div>`
  ).join('');
  document.getElementById('cl-b').innerHTML = _classifBuckets.b.map(i =>
    `<div class="classif-chip" draggable="true" data-id="${i.id}">${i.label}</div>`
  ).join('');
}

function _montarDragClassif() {
  let draggedId = null;
  let draggedFrom = null;

  function moverItem(id, deOnde, paraOnde) {
    let item;
    if (deOnde === 'pool') item = _classifPool.find(x => x.id === id);
    else item = _classifBuckets[deOnde].find(x => x.id === id);
    if (!item) return;
    if (deOnde === 'pool') _classifPool = _classifPool.filter(x => x.id !== id);
    else _classifBuckets[deOnde] = _classifBuckets[deOnde].filter(x => x.id !== id);
    if (paraOnde === 'pool') _classifPool.push(item);
    else _classifBuckets[paraOnde].push(item);
    _pintarClassif();
    _montarDragClassif();
  }

  document.querySelectorAll('.classif-chip').forEach(chip => {
    chip.addEventListener('dragstart', e => {
      draggedId = chip.dataset.id;
      const parent = chip.parentElement;
      draggedFrom = parent.id === 'cl-a' ? 'a' : parent.id === 'cl-b' ? 'b' : 'pool';
      chip.classList.add('arrastando');
    });
    chip.addEventListener('dragend', () => chip.classList.remove('arrastando'));
    // Click to cycle: pool → a → b → pool
    chip.addEventListener('click', () => {
      const id = chip.dataset.id;
      const parent = chip.parentElement;
      const de = parent.id === 'cl-a' ? 'a' : parent.id === 'cl-b' ? 'b' : 'pool';
      const para = de === 'pool' ? 'a' : de === 'a' ? 'b' : 'pool';
      moverItem(id, de, para);
    });
  });

  ['cl-pool', 'cl-a', 'cl-b'].forEach(contId => {
    const cont = document.getElementById(contId);
    if (!cont) return;
    const alvo = contId === 'cl-a' ? 'a' : contId === 'cl-b' ? 'b' : 'pool';
    cont.addEventListener('dragover', e => { e.preventDefault(); cont.classList.add('drop-ativo'); });
    cont.addEventListener('dragleave', () => cont.classList.remove('drop-ativo'));
    cont.addEventListener('drop', e => {
      e.preventDefault();
      cont.classList.remove('drop-ativo');
      if (!draggedId || draggedFrom === null) return;
      if (draggedFrom === alvo) return;
      moverItem(draggedId, draggedFrom, alvo);
      draggedId = null; draggedFrom = null;
    });
  });
}

function verificarClassif() {
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  if (_classifPool.length > 0) {
    const fb = document.getElementById('q-fb');
    fb.innerHTML = `<div class="feedback erro">Falta classificar: <b>${_classifPool.map(i => i.label).join(', ')}</b>. Arraste (ou toque) até um dos grupos.</div>`;
    return;
  }
  let certos = 0;
  let total = q.itens.length;
  _classifBuckets.a.forEach(i => { if (q.gabarito[i.id] === 'a') certos++; });
  _classifBuckets.b.forEach(i => { if (q.gabarito[i.id] === 'b') certos++; });
  const fb = document.getElementById('q-fb');
  if (certos === total) {
    _acertosNoJogo++;
    addAcerto(_jogoAtual.id);
    coachFala('acerto');
    fb.innerHTML = `<div class="feedback ok">✓ Acertou todos! ${certos}/${total}${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
    setTimeout(() => { _perguntaIdx++; renderClassif(); }, 1500);
  } else {
    _errosNoJogo++;
    addErro(_jogoAtual.id);
    coachFala('erro');
    // Marcar chips errados
    document.querySelectorAll('#cl-a .classif-chip').forEach(c => {
      c.classList.add(q.gabarito[c.dataset.id] === 'a' ? 'ok' : 'err');
    });
    document.querySelectorAll('#cl-b .classif-chip').forEach(c => {
      c.classList.add(q.gabarito[c.dataset.id] === 'b' ? 'ok' : 'err');
    });
    fb.innerHTML = `<div class="feedback erro">✗ ${certos}/${total} corretos. Veja as cores.${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
    setTimeout(() => { _perguntaIdx++; renderClassif(); }, 3200);
  }
}

// ============== VERDADEIRO OU FALSO ==============
function renderVF() {
  const area = document.getElementById('tela-jogo');
  const total = _perguntasEmbaralhadas.length;
  if (_perguntaIdx >= total) return fimDoJogo();
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  area.innerHTML = `
    <div class="jogo-header">
      <button class="btn-voltar" onclick="voltarGrid()">← Voltar</button>
      <div class="jogo-titulo-atual">${_jogoAtual.emoji} ${_jogoAtual.titulo}</div>
      <div class="jogo-contador">${_perguntaIdx + 1}/${total}</div>
    </div>
    <div class="pergunta">
      ${q.afirmacao}${_badgeNivel(q.nivel)}
      ${q.hint ? `<span class="hint">${q.hint}</span>` : ''}
    </div>
    <div class="opcoes grid2">
      <button class="opcao vf-btn vf-v" data-resp="true" onclick="responderVF(this, true)">
        <span style="font-size:24px;display:block;margin-bottom:4px">✓</span>
        <b>Verdadeiro</b>
      </button>
      <button class="opcao vf-btn vf-f" data-resp="false" onclick="responderVF(this, false)">
        <span style="font-size:24px;display:block;margin-bottom:4px">✗</span>
        <b>Falso</b>
      </button>
    </div>
    <div id="q-fb"></div>
  `;
}

function responderVF(btn, escolha) {
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  const correto = escolha === q.vf;
  [...document.querySelectorAll('.opcoes .opcao')].forEach(b => {
    b.disabled = true;
    const bResp = b.dataset.resp === 'true';
    if (bResp === q.vf) b.classList.add('acerto');
    else if (b === btn) b.classList.add('erro');
  });
  const fb = document.getElementById('q-fb');
  if (correto) {
    _acertosNoJogo++;
    addAcerto(_jogoAtual.id);
    coachFala(STATE.streak >= 5 ? 'combo' : 'acerto');
    fb.innerHTML = `<div class="feedback ok">✓ ${falaAleatoria('acerto')}${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
  } else {
    _errosNoJogo++;
    addErro(_jogoAtual.id);
    coachFala('erro');
    const certaStr = q.vf ? 'Verdadeiro' : 'Falso';
    fb.innerHTML = `<div class="feedback erro">✗ A resposta certa era <b>${certaStr}</b>.${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
  }
  setTimeout(() => { _perguntaIdx++; renderVF(); }, correto ? 1400 : 2600);
}

// ============== COMPLETAR A LACUNA ==============
function renderCloze() {
  const area = document.getElementById('tela-jogo');
  const total = _perguntasEmbaralhadas.length;
  if (_perguntaIdx >= total) return fimDoJogo();
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  const opcoesEmbaralhadas = _embaralhar(q.opcoes.map((o, i) => ({ o, correto: i === (q.correta ?? 0) })));
  // Substitui ___ por um "buraco" visual
  const fraseHTML = (q.frase || '').replace(/_+/g, '<span class="cloze-gap">______</span>');
  area.innerHTML = `
    <div class="jogo-header">
      <button class="btn-voltar" onclick="voltarGrid()">← Voltar</button>
      <div class="jogo-titulo-atual">${_jogoAtual.emoji} ${_jogoAtual.titulo}</div>
      <div class="jogo-contador">${_perguntaIdx + 1}/${total}</div>
    </div>
    <div class="pergunta">
      <div style="font-size:15px;color:#6b3a15;margin-bottom:8px">Complete a frase:</div>
      <div style="font-size:17px;line-height:1.5">${fraseHTML}</div>
      ${_badgeNivel(q.nivel)}
      ${q.hint ? `<span class="hint">${q.hint}</span>` : ''}
    </div>
    <div class="opcoes" id="q-opcoes">
      ${opcoesEmbaralhadas.map(x => `
        <button class="opcao cloze-opt" data-correto="${x.correto}" onclick="responderCloze(this)">
          ${x.o}
        </button>
      `).join('')}
    </div>
    <div id="q-fb"></div>
  `;
}

function responderCloze(btn) {
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  const correto = btn.dataset.correto === 'true';
  [...document.querySelectorAll('#q-opcoes .opcao')].forEach(b => {
    b.disabled = true;
    if (b === btn) b.classList.add(correto ? 'acerto' : 'erro');
    else if (b.dataset.correto === 'true') b.classList.add('acerto');
  });
  const fb = document.getElementById('q-fb');
  if (correto) {
    _acertosNoJogo++;
    addAcerto(_jogoAtual.id);
    coachFala(STATE.streak >= 5 ? 'combo' : 'acerto');
    fb.innerHTML = `<div class="feedback ok">✓ ${falaAleatoria('acerto')}${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
  } else {
    _errosNoJogo++;
    addErro(_jogoAtual.id);
    coachFala('erro');
    fb.innerHTML = `<div class="feedback erro">✗ Veja a resposta certa em verde.${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
  }
  setTimeout(() => { _perguntaIdx++; renderCloze(); }, correto ? 1400 : 2400);
}

// ============== MEMÓRIA (pares) ==============
let _memEstado = { cartas: [], viradas: [], paresEncontrados: 0, totalPares: 0, bloqueado: false };

function renderMemoria() {
  const area = document.getElementById('tela-jogo');
  const total = _perguntasEmbaralhadas.length;
  if (_perguntaIdx >= total) return fimDoJogo();
  const q = _perguntasEmbaralhadas[_perguntaIdx];
  const pares = q.pares || [];
  const cartas = [];
  pares.forEach((par, i) => {
    cartas.push({ id: 'a' + i, texto: par.a, parId: 'p' + i });
    cartas.push({ id: 'b' + i, texto: par.b, parId: 'p' + i });
  });
  // Embaralhar
  for (let i = cartas.length - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1));
    [cartas[i], cartas[k]] = [cartas[k], cartas[i]];
  }
  _memEstado = { cartas, viradas: [], paresEncontrados: 0, totalPares: pares.length, bloqueado: false };
  area.innerHTML = `
    <div class="jogo-header">
      <button class="btn-voltar" onclick="voltarGrid()">← Voltar</button>
      <div class="jogo-titulo-atual">${_jogoAtual.emoji} ${_jogoAtual.titulo}</div>
      <div class="jogo-contador">${_perguntaIdx + 1}/${total}</div>
    </div>
    <div class="pergunta">
      ${q.pergunta || 'Encontre os pares: clique em duas cartas que combinem!'}${_badgeNivel(q.nivel)}
      ${q.hint ? `<span class="hint">${q.hint}</span>` : ''}
    </div>
    <div class="memoria-grid" id="mem-grid"></div>
    <div id="q-fb"></div>
  `;
  pintarMemoria();
}

function pintarMemoria() {
  const grid = document.getElementById('mem-grid');
  if (!grid) return;
  grid.innerHTML = _memEstado.cartas.map((c, i) => {
    const virada = _memEstado.viradas.includes(i);
    const acertada = c.acertada;
    let cls = 'mem-carta';
    if (virada) cls += ' virada';
    if (acertada) cls += ' acertada';
    return `
      <div class="${cls}" onclick="virarCarta(${i})">
        <div class="mem-back">?</div>
        <div class="mem-front">${c.texto}</div>
      </div>
    `;
  }).join('');
}

function virarCarta(i) {
  if (_memEstado.bloqueado) return;
  const carta = _memEstado.cartas[i];
  if (carta.acertada) return;
  if (_memEstado.viradas.includes(i)) return;
  _memEstado.viradas.push(i);
  pintarMemoria();
  if (_memEstado.viradas.length === 2) {
    _memEstado.bloqueado = true;
    const [a, b] = _memEstado.viradas;
    const cartaA = _memEstado.cartas[a];
    const cartaB = _memEstado.cartas[b];
    if (cartaA.parId === cartaB.parId) {
      // Par encontrado
      setTimeout(() => {
        cartaA.acertada = true;
        cartaB.acertada = true;
        _memEstado.viradas = [];
        _memEstado.paresEncontrados++;
        _memEstado.bloqueado = false;
        _acertosNoJogo++;
        addAcerto(_jogoAtual.id);
        coachFala(STATE.streak >= 5 ? 'combo' : 'acerto');
        tocarSom('acerto');
        pintarMemoria();
        if (_memEstado.paresEncontrados === _memEstado.totalPares) {
          // Rodada completa
          const q = _perguntasEmbaralhadas[_perguntaIdx];
          const fb = document.getElementById('q-fb');
          fb.innerHTML = `<div class="feedback ok">🏆 Todos os pares!${q.explica ? `<span class="explica">${q.explica}</span>` : ''}</div>`;
          setTimeout(() => { _perguntaIdx++; renderMemoria(); }, 2000);
        }
      }, 500);
    } else {
      // Erro
      _errosNoJogo++;
      addErro(_jogoAtual.id);
      coachFala('erro');
      tocarSom('erro');
      setTimeout(() => {
        _memEstado.viradas = [];
        _memEstado.bloqueado = false;
        pintarMemoria();
      }, 1100);
    }
  }
}

// ============== FIM DO JOGO ==============
function fimDoJogo() {
  const area = document.getElementById('tela-jogo');
  const total = _acertosNoJogo + _errosNoJogo;
  const pct = total === 0 ? 0 : Math.round((_acertosNoJogo / total) * 100);
  let emoji, titulo;
  if (pct === 100)    { emoji = '🏆'; titulo = 'Perfeito!'; }
  else if (pct >= 80) { emoji = '🌟'; titulo = 'Muito bem!'; }
  else if (pct >= 60) { emoji = '👍'; titulo = 'Mandou bem!'; }
  else                { emoji = '💪'; titulo = 'Vamos treinar mais!'; }
  tocarSom('fim');
  area.innerHTML = `
    <div class="fim">
      <div class="emoji">${emoji}</div>
      <h2>${titulo}</h2>
      <div class="stats">
        <div class="stat"><div class="stat-n">${_acertosNoJogo}</div><div class="stat-l">Acertos</div></div>
        <div class="stat"><div class="stat-n">${_errosNoJogo}</div><div class="stat-l">Erros</div></div>
        <div class="stat"><div class="stat-n">${pct}%</div><div class="stat-l">Acerto</div></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="btn" onclick="abrirJogo(_jogoAtual)">Jogar de novo</button>
        <button class="btn secundario" onclick="voltarGrid()">Escolher outro jogo</button>
      </div>
    </div>
  `;
}

// ============== UTIL ==============
function _embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============== SELETOR DE MASCOTES ==============
function montarSeletorMascote(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = Object.entries(MASCOTES).map(([id, m]) => `
    <div class="mini-mascote ${id === getMascoteAtivoId() ? 'ativo' : ''}" data-id="${id}">
      ${m.svg}
      <div class="mini-nome">${m.nome}</div>
    </div>
  `).join('');
  container.querySelectorAll('.mini-mascote').forEach(el => {
    el.addEventListener('click', () => {
      setMascoteAtivo(el.dataset.id);
      container.querySelectorAll('.mini-mascote').forEach(x => x.classList.remove('ativo'));
      el.classList.add('ativo');
      const balao = document.getElementById('mascote-balao');
      if (balao) balao.textContent = falaAleatoria('intro');
      const holder = document.getElementById('mascote-holder');
      if (holder) holder.innerHTML = getMascoteAtivo().svg;
      _renderHeader();
      renderCoach();
    });
  });
}

function rotacionarFala() {
  const balao = document.getElementById('mascote-balao');
  if (balao) balao.textContent = falaAleatoria('intro');
}

// ============== INIT ==============
function initExplora(opts = {}) {
  if (opts.storageKey) STORAGE_KEY = opts.storageKey;
  STATE = _readState();
  _renderHeader();
  const holder = document.getElementById('mascote-holder');
  if (holder) holder.innerHTML = getMascoteAtivo().svg;
  const balao = document.getElementById('mascote-balao');
  if (balao) balao.textContent = opts.falaInicial || falaAleatoria('intro');
  montarSeletorMascote('mascote-seletor');
  if (opts.coachAoIniciar) renderCoach();
  guardaAnoPremiumExplora();
}
