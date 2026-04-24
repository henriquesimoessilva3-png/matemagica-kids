// =========================================================
// SHARED.JS — Infra comum: storage, XP, moedas, badges, sons, UI
// Cada página define: STORAGE_KEY, CAPS, TUTORIAIS, DICAS, JOGOS
// Depois chama initJogos()
// =========================================================

let STORAGE_KEY = 'jogosMat_default';
const USER_STORAGE_KEY = 'matemagica_user_v1';
const ANOS_STORAGE_KEYS = ['jogosMat1ano_v1','jogosMat2ano_v1','jogosMat3ano_v1','jogosMat4ano_v1','jogosMat5ano_v1'];

// ============== BADGES ==============
const BADGES = {
  primeira: { emoji:'🌟', nome:'Primeira estrela', desc:'Você ganhou sua primeira estrela!' },
  dez_estrelas: { emoji:'⭐', nome:'10 estrelas', desc:'Acumulou 10 estrelas' },
  cinquenta_estrelas: { emoji:'🏅', nome:'50 estrelas', desc:'Meio cem!' },
  cem_estrelas: { emoji:'🏆', nome:'100 estrelas', desc:'Lenda!' },
  duzentas_estrelas: { emoji:'👑', nome:'200 estrelas', desc:'Mestre das estrelas!' },
  streak_5: { emoji:'🔥', nome:'Combo x5', desc:'5 acertos seguidos' },
  streak_10: { emoji:'💥', nome:'Combo x10', desc:'10 acertos seguidos' },
  streak_20: { emoji:'⚡', nome:'Combo x20', desc:'20 acertos seguidos!' },
  dias_3: { emoji:'📅', nome:'3 dias seguidos', desc:'Hábito nascendo' },
  dias_7: { emoji:'🗓️', nome:'1 semana', desc:'Uma semana jogando!' },
  dias_30: { emoji:'💎', nome:'1 mês', desc:'Persistente de verdade!' },
  capitulo_1: { emoji:'📘', nome:'Cap. 1 dominado', desc:'10 estrelas em cada jogo do cap. 1' },
  nivel_5: { emoji:'🎖️', nome:'Nível 5', desc:'Chegou ao nível 5' },
  nivel_10: { emoji:'🎗️', nome:'Nível 10', desc:'Chegou ao nível 10' }
};

// ============== AVATAR OPÇÕES (gratuitas) ==============
const AVATAR_OPCOES = {
  cabeca: ['😀','😎','🧒','👧','👦','🤓','😊'],
  chapeu: ['','🎩','🎓','⛑️','🧢'],
  cor: ['#ffd36b','#ff7b6b','#4ab3a5','#5ba8e8','#b968e8','#ff9a44','#c7f0a8']
};

// ============== LOJA (itens premium com moedas) ==============
// Cabeças são desenhos SVG estilo cartoon — jogadores de futebol e bonecas.
// Inspirados em estilos reconhecíveis, mas sem usar nomes ou likeness reais.
const LOJA = {
  cabeca: [
    // === JOGADORES DE FUTEBOL ===
    {id:'craque10', nome:'Craque 10', preco:100, svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="28" ry="32" fill="#cf955c"/><path d="M38 28 L50 8 L62 28 L60 42 L40 42 Z" fill="#1a0a00"/><rect x="26" y="40" width="48" height="5" fill="#ffd36b"/><rect x="26" y="44" width="48" height="3" fill="#4ab3a5"/><circle cx="42" cy="56" r="2.5" fill="#1a0a00"/><circle cx="58" cy="56" r="2.5" fill="#1a0a00"/><path d="M42 72 Q50 78 58 72" stroke="#6a2424" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`},
    {id:'mestre', nome:'Mestre', preco:100, svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="28" ry="32" fill="#e8c39e"/><path d="M28 40 Q28 18 50 16 Q72 18 72 40 L70 48 Q50 40 30 48 Z" fill="#6a3919"/><path d="M30 68 Q50 84 70 68 Q68 78 50 80 Q32 78 30 68 Z" fill="#6a3919"/><circle cx="42" cy="55" r="2.5" fill="#1a0a00"/><circle cx="58" cy="55" r="2.5" fill="#1a0a00"/><path d="M44 70 Q50 72 56 70" stroke="#6a2424" stroke-width="1.5" fill="none"/></svg>`},
    {id:'veloz', nome:'Veloz', preco:80, svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="28" ry="34" fill="#d4a17a"/><ellipse cx="50" cy="28" rx="26" ry="12" fill="#d4a17a"/><circle cx="42" cy="56" r="2.5" fill="#1a0a00"/><circle cx="58" cy="56" r="2.5" fill="#1a0a00"/><path d="M42 72 Q50 78 58 72" stroke="#6a2424" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`},
    {id:'artilheira', nome:'Artilheira', preco:100, svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="28" ry="32" fill="#f5d0b0"/><path d="M26 38 Q26 16 50 14 Q74 16 74 40 L70 42 Q50 32 30 42 Z" fill="#4a2a12"/><ellipse cx="76" cy="55" rx="9" ry="20" fill="#4a2a12" transform="rotate(25 76 55)"/><circle cx="42" cy="56" r="2.5" fill="#1a0a00"/><circle cx="58" cy="56" r="2.5" fill="#1a0a00"/><path d="M42 72 Q50 76 58 72" stroke="#b04060" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`},
    {id:'goleiro', nome:'Goleiro', preco:90, svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="28" ry="32" fill="#e0b894"/><path d="M28 40 Q28 18 50 16 Q72 18 72 40 L70 46 Q50 38 30 46 Z" fill="#2a2a2a"/><rect x="26" y="82" width="48" height="10" rx="4" fill="#ffd36b"/><rect x="26" y="86" width="48" height="6" fill="#4a8f5a"/><circle cx="42" cy="56" r="2.5" fill="#1a0a00"/><circle cx="58" cy="56" r="2.5" fill="#1a0a00"/><path d="M44 72 Q50 76 56 72" stroke="#6a2424" stroke-width="2" fill="none"/></svg>`},
    {id:'cacheado', nome:'Cacheado', preco:100, svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="28" ry="32" fill="#d4a17a"/><circle cx="30" cy="32" r="8" fill="#d4a84a"/><circle cx="42" cy="24" r="9" fill="#d4a84a"/><circle cx="55" cy="22" r="9" fill="#d4a84a"/><circle cx="68" cy="28" r="9" fill="#d4a84a"/><circle cx="76" cy="38" r="7" fill="#d4a84a"/><circle cx="24" cy="42" r="7" fill="#d4a84a"/><circle cx="42" cy="58" r="2.5" fill="#1a0a00"/><circle cx="58" cy="58" r="2.5" fill="#1a0a00"/><path d="M42 74 Q50 80 58 74" stroke="#6a2424" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`},
    // === BONECAS ===
    {id:'princesa', nome:'Princesa', preco:120, svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="28" ry="32" fill="#fcd9b6"/><path d="M25 45 Q25 18 50 16 Q75 18 75 45 L70 50 Q50 38 30 50 Z" fill="#ffd36b"/><ellipse cx="22" cy="70" rx="6" ry="18" fill="#ffd36b"/><ellipse cx="78" cy="70" rx="6" ry="18" fill="#ffd36b"/><path d="M28 26 L36 18 L42 26 L50 14 L58 26 L64 18 L72 26 L68 34 L32 34 Z" fill="#ffcc00" stroke="#b08800" stroke-width="1"/><circle cx="50" cy="28" r="2.5" fill="#ff4d9f"/><circle cx="36" cy="29" r="1.5" fill="#4facfe"/><circle cx="64" cy="29" r="1.5" fill="#4facfe"/><path d="M18 55 Q12 62 18 70 Q26 66 24 58 Z" fill="#ff7bb0"/><circle cx="22" cy="63" r="1.5" fill="#ff4d9f"/><circle cx="42" cy="56" r="2.5" fill="#4facfe"/><circle cx="58" cy="56" r="2.5" fill="#4facfe"/><path d="M42 72 Q50 78 58 72" stroke="#e8397b" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`},
    {id:'rockeira', nome:'Rockeira', preco:100, svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="28" ry="32" fill="#f5d0b0"/><path d="M22 38 Q20 8 50 10 Q80 8 78 40 L74 42 L68 32 L62 42 L56 28 L50 42 L44 28 L38 42 L32 32 L26 42 Z" fill="#4a90e2"/><path d="M50 42 L46 28 L52 28 Z" fill="#9b59b6"/><path d="M68 35 L64 45 L70 45 Z" fill="#9b59b6"/><circle cx="42" cy="58" r="2.5" fill="#1a0a00"/><circle cx="58" cy="58" r="2.5" fill="#1a0a00"/><path d="M38 74 Q50 80 62 74" stroke="#1a0a00" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M36 74 L36 68 L39 68" stroke="#1a0a00" stroke-width="2" fill="none"/></svg>`},
    {id:'fada', nome:'Fada', preco:120, svg:`<svg viewBox="0 0 100 100"><path d="M14 45 Q5 55 12 70 Q25 68 22 55 Z" fill="#c0ffdf" opacity="0.8" stroke="#4a9e6f" stroke-width="1"/><path d="M86 45 Q95 55 88 70 Q75 68 78 55 Z" fill="#c0ffdf" opacity="0.8" stroke="#4a9e6f" stroke-width="1"/><ellipse cx="50" cy="58" rx="28" ry="32" fill="#fcd9b6"/><path d="M24 40 Q24 14 50 12 Q76 14 76 42 L72 44 Q50 36 28 44 Z" fill="#2ebd7c"/><circle cx="30" cy="20" r="2.5" fill="#ffd36b"/><circle cx="70" cy="20" r="2.5" fill="#ffd36b"/><circle cx="42" cy="56" r="2.5" fill="#4a8f5a"/><circle cx="58" cy="56" r="2.5" fill="#4a8f5a"/><path d="M44 72 Q50 76 56 72" stroke="#b04060" stroke-width="2" fill="none"/></svg>`},
    {id:'aventureira', nome:'Aventureira', preco:100, svg:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="28" ry="32" fill="#ffcc9e"/><path d="M22 42 Q22 8 50 10 Q78 8 78 42 L74 48 Q60 30 50 30 Q40 30 26 48 Z" fill="#d84a1a"/><ellipse cx="28" cy="62" rx="5" ry="22" fill="#d84a1a"/><ellipse cx="72" cy="62" rx="5" ry="22" fill="#d84a1a"/><circle cx="40" cy="66" r="0.9" fill="#a04020"/><circle cx="44" cy="69" r="0.9" fill="#a04020"/><circle cx="56" cy="67" r="0.9" fill="#a04020"/><circle cx="60" cy="69" r="0.9" fill="#a04020"/><circle cx="42" cy="56" r="2.5" fill="#2a5a3a"/><circle cx="58" cy="56" r="2.5" fill="#2a5a3a"/><path d="M42 72 Q50 78 58 72" stroke="#b04040" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`}
  ],
  chapeu: [
    {id:'coroa',    emoji:'👑', nome:'Coroa',      preco:40},
    {id:'abobora',  emoji:'🎃', nome:'Abóbora',    preco:30},
    {id:'papai',    emoji:'🎅', nome:'Papai Noel', preco:30},
    {id:'laco',     emoji:'🎀', nome:'Laço',       preco:25},
    {id:'festa',    emoji:'🥳', nome:'Festa',      preco:30},
    {id:'flor',     emoji:'🌸', nome:'Flor',       preco:25},
    {id:'explosao', emoji:'💥', nome:'Explosão',   preco:50}
  ],
  cor: [
    {id:'rainbow', nome:'Arco-íris', cor:'linear-gradient(135deg,#ff7b6b,#ffd36b,#4ab3a5,#5ba8e8,#b968e8)', preco:50},
    {id:'neon',    nome:'Neon',      cor:'linear-gradient(135deg,#00f5a0,#00d9f5)', preco:40},
    {id:'espaco',  nome:'Espaço',    cor:'linear-gradient(135deg,#0b1d48,#6b54d3)', preco:40},
    {id:'fogo',    nome:'Fogo',      cor:'linear-gradient(135deg,#ff4d4d,#ff9a44)', preco:40},
    {id:'gelo',    nome:'Gelo',      cor:'linear-gradient(135deg,#a0e9ff,#e0f2ff)', preco:40}
  ],
  temas: [
    {id:'padrao',   emoji:'🎨', nome:'Padrão (grátis)', preco:0,
      bg:'linear-gradient(135deg, #667eea, #764ba2)'},
    {id:'escuro',   emoji:'🌙', nome:'Modo Escuro', preco:200,
      bg:'linear-gradient(135deg, #1a1b3a, #3a1d5e)'},
    {id:'pastel',   emoji:'🌸', nome:'Pastel', preco:150,
      bg:'linear-gradient(135deg, #ffd4f0, #d4e4ff)'},
    {id:'natureza', emoji:'🌿', nome:'Natureza', preco:150,
      bg:'linear-gradient(135deg, #7ecfa8, #4a9e6f)'},
    {id:'oceano',   emoji:'🌊', nome:'Oceano', preco:150,
      bg:'linear-gradient(135deg, #4facfe, #00c9ff)'},
    {id:'doce',     emoji:'🍭', nome:'Doce', preco:180,
      bg:'linear-gradient(135deg, #ff9a9e, #fad0c4)'}
  ],
  bichinhos: [
    {id:'gato',     emoji:'🐱', nome:'Gato',     preco:80},
    {id:'cachorro', emoji:'🐶', nome:'Cachorro', preco:80},
    {id:'coelho',   emoji:'🐰', nome:'Coelho',   preco:80},
    {id:'panda',    emoji:'🐼', nome:'Panda',    preco:100},
    {id:'raposa',   emoji:'🦊', nome:'Raposa',   preco:100},
    {id:'polvo',    emoji:'🐙', nome:'Polvo',    preco:90},
    {id:'leao',     emoji:'🦁', nome:'Leão',     preco:120},
    {id:'dragao',   emoji:'🐲', nome:'Dragão',   preco:150},
    {id:'macaco',   emoji:'🐵', nome:'Macaco',   preco:90},
    {id:'pinguim',  emoji:'🐧', nome:'Pinguim',  preco:100}
  ]
};

// ============== ESTADO + PERSISTÊNCIA ==============
const STATE = {
  estrelas: 0, streak: 0, recorde: 0, porJogo: {},
  xp: 0, moedas: 0, badges: [],
  streakDiario: 0, ultimoDia: '', diasJogados: [],
  avatar: { cabeca: '😀', chapeu: '', cor: '#ffd36b' },
  comprados: { cabeca: [], chapeu: [], cor: [], temas: [], bichinhos: [], pdfs: [] },
  temaAtivo: 'padrao',
  bichinhoAtivo: null,

  load() {
    this._loadGlobal();
    this._loadPerYear();
  },

  // Campos globais: moedas, comprados, avatar, temaAtivo, bichinhoAtivo
  // Ficam em USER_STORAGE_KEY e são compartilhados entre os 5 anos.
  _loadGlobal() {
    let u = null;
    try { u = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null'); } catch(e) {}
    if (!u) u = this._migrarGlobalDoPerYear();
    this.moedas = u.moedas || 0;
    this.comprados = u.comprados || { cabeca: [], chapeu: [], cor: [], temas: [], bichinhos: [], pdfs: [] };
    ['cabeca','chapeu','cor','temas','bichinhos','pdfs'].forEach(k => {
      if (!this.comprados[k]) this.comprados[k] = [];
    });
    this.avatar = u.avatar || { cabeca: '😀', chapeu: '', cor: '#ffd36b' };
    this.temaAtivo = u.temaAtivo || 'padrao';
    this.bichinhoAtivo = u.bichinhoAtivo || null;
  },

  // Campos por ano: estrelas, streak, recorde, porJogo, xp, badges, streakDiario, ultimoDia, diasJogados
  // STORAGE_KEY muda em cada página de ano. No index/provas/imprimir fica em 'jogosMat_default'.
  _loadPerYear() {
    if (STORAGE_KEY === 'jogosMat_default') {
      // Páginas sem ano ativo: não há per-year pra carregar
      this.estrelas = 0; this.streak = 0; this.recorde = 0; this.porJogo = {};
      this.xp = 0; this.badges = [];
      this.streakDiario = 0; this.ultimoDia = ''; this.diasJogados = [];
      return;
    }
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      this.estrelas = s.estrelas || 0;
      this.streak = s.streak || 0;
      this.recorde = s.recorde || 0;
      this.porJogo = s.porJogo || {};
      this.xp = s.xp || 0;
      this.badges = s.badges || [];
      this.streakDiario = s.streakDiario || 0;
      this.ultimoDia = s.ultimoDia || '';
      this.diasJogados = s.diasJogados || [];
    } catch(e) {}
  },

  // Migração ONE-TIME: lê dados globais que estavam em cada storage per-year, consolida e salva.
  // Depois remove os campos globais das chaves per-year pra evitar divergência futura.
  _migrarGlobalDoPerYear() {
    let totalMoedas = 0;
    const comprados = { cabeca: [], chapeu: [], cor: [], temas: [], bichinhos: [], pdfs: [] };
    let avatarEscolhido = null;
    let diaMaisRecente = '';
    let tema = 'padrao';
    let bichinho = null;

    ANOS_STORAGE_KEYS.concat(['jogosMat_default']).forEach(k => {
      try {
        const d = JSON.parse(localStorage.getItem(k) || 'null');
        if (!d) return;
        if (typeof d.moedas === 'number') totalMoedas += d.moedas;
        if (d.comprados) {
          Object.keys(comprados).forEach(cat => {
            if (Array.isArray(d.comprados[cat])) {
              d.comprados[cat].forEach(id => {
                if (!comprados[cat].includes(id)) comprados[cat].push(id);
              });
            }
          });
        }
        const dia = d.ultimoDia || '';
        if (d.avatar && dia >= diaMaisRecente) {
          avatarEscolhido = d.avatar;
          diaMaisRecente = dia;
        }
        if (d.temaAtivo && d.temaAtivo !== 'padrao') tema = d.temaAtivo;
        if (d.bichinhoAtivo) bichinho = d.bichinhoAtivo;
      } catch(e) {}
    });

    const u = {
      moedas: totalMoedas,
      comprados,
      avatar: avatarEscolhido || { cabeca: '😀', chapeu: '', cor: '#ffd36b' },
      temaAtivo: tema,
      bichinhoAtivo: bichinho
    };
    try { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u)); } catch(e) {}

    // Limpa campos globais dos per-year storages
    ANOS_STORAGE_KEYS.forEach(k => {
      try {
        const d = JSON.parse(localStorage.getItem(k) || 'null');
        if (!d) return;
        delete d.moedas; delete d.comprados; delete d.avatar;
        delete d.temaAtivo; delete d.bichinhoAtivo;
        localStorage.setItem(k, JSON.stringify(d));
      } catch(e) {}
    });
    return u;
  },

  save() {
    this._saveGlobal();
    this._savePerYear();
  },

  _saveGlobal() {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
        moedas: this.moedas,
        comprados: this.comprados,
        avatar: this.avatar,
        temaAtivo: this.temaAtivo,
        bichinhoAtivo: this.bichinhoAtivo
      }));
    } catch(e) {}
  },

  _savePerYear() {
    if (STORAGE_KEY === 'jogosMat_default') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        estrelas: this.estrelas, streak: this.streak, recorde: this.recorde,
        porJogo: this.porJogo, xp: this.xp,
        badges: this.badges, streakDiario: this.streakDiario,
        ultimoDia: this.ultimoDia, diasJogados: this.diasJogados
      }));
    } catch(e) {}
  },

  acertou(id) {
    const nivelAntes = this.nivel();
    this.estrelas++;
    this.streak++;
    if (this.streak > this.recorde) this.recorde = this.streak;
    this.xp += 10;
    this.moedas += 1;
    if (this.streak > 0 && this.streak % 5 === 0) {
      this.xp += 40;
      this.moedas += 5;
    }
    const j = this.porJogo[id] = this.porJogo[id] || {acertos:0, tentativas:0, streak:0};
    j.acertos++; j.tentativas++; j.streak++;

    this._updateStreakDiario();
    this._checkBadges();

    const nivelDepois = this.nivel();
    if (nivelDepois > nivelAntes) {
      this.moedas += 10 * nivelDepois;
      setTimeout(() => mostrarSubidaDeNivel(nivelDepois), 300);
    }
    this.save();
  },

  errou(id) {
    this.streak = 0;
    const j = this.porJogo[id] = this.porJogo[id] || {acertos:0, tentativas:0, streak:0};
    j.tentativas++; j.streak = 0;
    this.save();
  },

  // Zera SÓ o progresso per-year (estrelas, XP, porJogo). Moedas e compras (globais) preservadas.
  zerar() {
    this.estrelas = 0; this.streak = 0; this.recorde = 0; this.porJogo = {};
    this.xp = 0; this.badges = [];
    this.streakDiario = 0; this.ultimoDia = ''; this.diasJogados = [];
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  },

  estrelasJogo(id) { return (this.porJogo[id] && this.porJogo[id].acertos) || 0; },

  nivel() {
    return Math.floor(Math.sqrt(this.xp / 50)) + 1;
  },

  xpNivel(n) { return (n - 1) * (n - 1) * 50; },

  progressoNivel() {
    const n = this.nivel();
    const xpAt = this.xpNivel(n);
    const xpProx = this.xpNivel(n + 1);
    if (xpProx === xpAt) return 1;
    return Math.max(0, Math.min(1, (this.xp - xpAt) / (xpProx - xpAt)));
  },

  xpParaProxNivel() {
    const n = this.nivel();
    return this.xpNivel(n + 1) - this.xp;
  },

  _checkBadges() {
    const checar = [
      [this.estrelas >= 1, 'primeira'],
      [this.estrelas >= 10, 'dez_estrelas'],
      [this.estrelas >= 50, 'cinquenta_estrelas'],
      [this.estrelas >= 100, 'cem_estrelas'],
      [this.estrelas >= 200, 'duzentas_estrelas'],
      [this.recorde >= 5, 'streak_5'],
      [this.recorde >= 10, 'streak_10'],
      [this.recorde >= 20, 'streak_20'],
      [this.streakDiario >= 3, 'dias_3'],
      [this.streakDiario >= 7, 'dias_7'],
      [this.streakDiario >= 30, 'dias_30'],
      [this.nivel() >= 5, 'nivel_5'],
      [this.nivel() >= 10, 'nivel_10']
    ];
    for (const [cond, key] of checar) {
      if (cond && !this.badges.includes(key)) {
        this.badges.push(key);
        setTimeout(() => mostrarNovaBadge(key), 500);
      }
    }
  },

  _updateStreakDiario() {
    const hoje = new Date().toISOString().slice(0,10);
    if (this.ultimoDia === hoje) return;
    if (!this.diasJogados.includes(hoje)) this.diasJogados.push(hoje);
    if (this.ultimoDia === '') {
      this.streakDiario = 1;
    } else {
      const ontem = new Date(); ontem.setDate(ontem.getDate() - 1);
      const ontemStr = ontem.toISOString().slice(0,10);
      this.streakDiario = (this.ultimoDia === ontemStr) ? this.streakDiario + 1 : 1;
    }
    this.ultimoDia = hoje;
  }
};

// ============== RENDER AVATAR (emoji OU SVG) ==============
function renderCabecaHTML(cabeca, tamanho) {
  const t = tamanho || 38;
  if (cabeca && cabeca.startsWith('svg:')) {
    const id = cabeca.slice(4);
    const item = LOJA.cabeca.find(x => x.id === id);
    if (item && item.svg) {
      return `<span class="hp-cabeca" style="display:inline-block;width:${t*1.15}px;height:${t*1.15}px;line-height:0">${item.svg}</span>`;
    }
  }
  return `<span class="hp-cabeca" style="font-size:${t}px;line-height:1">${cabeca}</span>`;
}

function renderCorFundo(cor) {
  // Se for ID da loja
  const premium = LOJA.cor.find(c => c.id === cor);
  if (premium) return `background:${premium.cor}`;
  return `background:${cor}`;
}

// ============== UI HEADER PLAYER ==============
function renderHeaderPlayer() {
  // Atualiza contador de moedas na home (se a página tiver)
  const moedasHome = document.getElementById('moedas-home');
  if (moedasHome) moedasHome.textContent = STATE.moedas;
  const el = document.getElementById('header-player');
  if (!el) return;
  const av = STATE.avatar;
  const nivel = STATE.nivel();
  const prog = STATE.progressoNivel() * 100;
  const proxXP = STATE.xpParaProxNivel();
  const bichinho = STATE.bichinhoAtivo ? LOJA.bichinhos.find(b => b.id === STATE.bichinhoAtivo) : null;
  el.innerHTML = `
    <div class="hp-avatar" onclick="abrirModalAvatar()" style="${renderCorFundo(av.cor)}">
      ${av.chapeu ? `<span class="hp-chapeu">${av.chapeu}</span>` : ''}
      ${renderCabecaHTML(av.cabeca, 38)}
      <span class="hp-nivel-bolha">${nivel}</span>
      ${bichinho ? `<span class="hp-bichinho" title="${bichinho.nome}">${bichinho.emoji}</span>` : ''}
    </div>
    <div class="hp-main">
      <div class="hp-topo">
        <span class="hp-xp-texto">Nível ${nivel} · ${STATE.xp} XP</span>
        <span class="hp-moedas" onclick="abrirLoja()">🪙 ${STATE.moedas}</span>
      </div>
      <div class="hp-xp-bar">
        <div class="hp-xp-fill" style="width:${prog}%"></div>
      </div>
      <div class="hp-rodape">
        <span>⭐ ${STATE.estrelas}</span>
        <span>🔥 ${STATE.streakDiario}d</span>
        <span onclick="abrirModalBadges()" style="cursor:pointer">🏆 ${STATE.badges.length}</span>
        <span onclick="abrirLoja()" style="cursor:pointer;color:#a87800;font-weight:700">🛒 Loja</span>
      </div>
    </div>
  `;
  aplicarTemaAtivo();
}

function atualizarPlacarGeral() {
  const vE = document.getElementById('v-estrelas');
  const vS = document.getElementById('v-streak');
  const vR = document.getElementById('v-recorde');
  if (vE) vE.textContent = STATE.estrelas;
  if (vS) vS.textContent = STATE.streak;
  if (vR) vR.textContent = STATE.recorde;
  renderHeaderPlayer();
}

function zerarProgresso() {
  if (!confirm('Zerar estrelas, XP, badges e recordes deste ano? (suas moedas e compras da loja ficam intactas — elas são de todos os anos)')) return;
  STATE.zerar();
  atualizarPlacarGeral();
  alert('Progresso deste ano zerado! Começa de novo.');
}

// ============== MODAIS ==============
function abrirModalAvatar() {
  const m = document.getElementById('modal-overlay');
  document.getElementById('m-emoji').textContent = '😀';
  document.getElementById('m-titulo').textContent = 'Personalize seu avatar';

  // monta opções: emoji gratuito + SVGs comprados
  const cabecasDispo = [
    ...AVATAR_OPCOES.cabeca.map(e => ({tipo:'emoji', valor:e, display:e})),
    ...LOJA.cabeca.filter(c => STATE.comprados.cabeca.includes(c.id))
      .map(c => ({tipo:'svg', valor:'svg:'+c.id, display:c.svg, nome:c.nome}))
  ];
  const chapeusDispo = AVATAR_OPCOES.chapeu.map(e => ({valor:e, display:e||'—'})).concat(
    LOJA.chapeu.filter(c => STATE.comprados.chapeu.includes(c.id))
      .map(c => ({valor:c.emoji, display:c.emoji, nome:c.nome}))
  );
  const coresDispo = AVATAR_OPCOES.cor.map(c => ({valor:c, cssBg:c})).concat(
    LOJA.cor.filter(c => STATE.comprados.cor.includes(c.id))
      .map(c => ({valor:c.id, cssBg:c.cor, nome:c.nome}))
  );

  const previewSvg = STATE.avatar.cabeca.startsWith('svg:')
    ? `<span style="display:inline-block;width:72px;height:72px;line-height:0">${(LOJA.cabeca.find(x=>x.id===STATE.avatar.cabeca.slice(4))||{}).svg||''}</span>`
    : `<span style="font-size:54px">${STATE.avatar.cabeca}</span>`;

  document.getElementById('m-conteudo').innerHTML = `
    <p style="text-align:center;margin-bottom:14px;font-size:13px">Escolha sua cara e seu chapéu!<br>
    <span style="color:#888;font-size:12px">Mais opções na 🛒 Loja</span></p>
    <div style="${renderCorFundo(STATE.avatar.cor)};border-radius:50%;width:90px;height:90px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;position:relative;box-shadow:0 3px 8px rgba(0,0,0,0.15)">
      ${STATE.avatar.chapeu ? `<span style="position:absolute;top:-12px;font-size:30px">${STATE.avatar.chapeu}</span>` : ''}
      ${previewSvg}
    </div>
    <div style="font-size:12px;color:#888;margin-bottom:4px">CABEÇA</div>
    <div class="av-grid">
      ${cabecasDispo.map(c => `<button class="av-opt ${c.valor===STATE.avatar.cabeca?'ativo':''}" onclick="STATE.avatar.cabeca='${c.valor}'; STATE.save(); abrirModalAvatar(); renderHeaderPlayer();" title="${c.nome||''}" ${c.tipo==='svg'?'style="padding:2px"':''}>${c.tipo==='svg'?`<span style="display:inline-block;width:36px;height:36px">${c.display}</span>`:c.display}</button>`).join('')}
    </div>
    <div style="font-size:12px;color:#888;margin-top:10px;margin-bottom:4px">CHAPÉU</div>
    <div class="av-grid">
      ${chapeusDispo.map(c => `<button class="av-opt ${c.valor===STATE.avatar.chapeu?'ativo':''}" onclick="STATE.avatar.chapeu='${c.valor}'; STATE.save(); abrirModalAvatar(); renderHeaderPlayer();" title="${c.nome||''}">${c.display}</button>`).join('')}
    </div>
    <div style="font-size:12px;color:#888;margin-top:10px;margin-bottom:4px">COR DE FUNDO</div>
    <div class="av-grid">
      ${coresDispo.map(c => `<button class="av-opt ${c.valor===STATE.avatar.cor?'ativo':''}" onclick="STATE.avatar.cor='${c.valor}'; STATE.save(); abrirModalAvatar(); renderHeaderPlayer();" style="background:${c.cssBg};color:transparent" title="${c.nome||''}">-</button>`).join('')}
    </div>
    <div style="text-align:center;margin-top:14px">
      <button class="acao" onclick="abrirLoja('cabeca')" style="font-size:13px;padding:8px 16px">🛒 Ver loja</button>
    </div>
  `;
  document.getElementById('modal-btn').onclick = () => fecharModal();
  document.getElementById('modal-btn').textContent = 'Fechar';
  m.classList.remove('hidden');
}

// ============== LOJA (modal com abas) ==============
let LOJA_ABA = 'cabeca';

function abrirLoja(abaInicial) {
  if (abaInicial) LOJA_ABA = abaInicial;
  const m = document.getElementById('modal-overlay');
  document.getElementById('m-emoji').textContent = '🛒';
  document.getElementById('m-titulo').textContent = `Loja · 🪙 ${STATE.moedas}`;
  document.getElementById('m-conteudo').innerHTML = renderLojaConteudo();
  document.getElementById('modal-btn').onclick = () => fecharModal();
  document.getElementById('modal-btn').textContent = 'Fechar';
  m.classList.remove('hidden');
}

function renderLojaConteudo() {
  const abas = [
    {id:'cabeca', nome:'👤 Cabeça'},
    {id:'chapeu', nome:'🎩 Chapéu'},
    {id:'cor', nome:'🎨 Cor'},
    {id:'temas', nome:'🌈 Temas'},
    {id:'bichinhos', nome:'🐾 Bichinhos'}
  ];
  const abasHtml = `<div class="loja-abas">${abas.map(a =>
    `<button class="loja-aba ${a.id===LOJA_ABA?'ativo':''}" onclick="mudarLojaAba('${a.id}')">${a.nome}</button>`
  ).join('')}</div>`;

  let itens = [];
  if (LOJA_ABA === 'temas') itens = LOJA.temas.filter(t => t.id !== 'padrao');
  else itens = LOJA[LOJA_ABA] || [];

  const itensHtml = itens.map(item => {
    const comprado = (STATE.comprados[LOJA_ABA] || []).includes(item.id);
    const temGrana = STATE.moedas >= item.preco;
    const ativo = (LOJA_ABA === 'temas' && STATE.temaAtivo === item.id)
               || (LOJA_ABA === 'bichinhos' && STATE.bichinhoAtivo === item.id);

    let preview = '';
    if (LOJA_ABA === 'cabeca') {
      preview = `<div style="width:64px;height:64px;margin:0 auto">${item.svg}</div>`;
    } else if (LOJA_ABA === 'chapeu') {
      preview = `<div style="font-size:40px;margin:8px 0">${item.emoji}</div>`;
    } else if (LOJA_ABA === 'cor') {
      preview = `<div style="width:54px;height:54px;border-radius:50%;margin:6px auto;background:${item.cor};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.2)"></div>`;
    } else if (LOJA_ABA === 'temas') {
      preview = `<div style="width:64px;height:40px;border-radius:8px;margin:6px auto;background:${item.bg};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;font-size:20px">${item.emoji}</div>`;
    } else if (LOJA_ABA === 'bichinhos') {
      preview = `<div style="font-size:40px;margin:6px 0">${item.emoji}</div>`;
    }

    let botao;
    if (ativo) {
      botao = `<div class="loja-btn ativo">✓ Em uso</div>`;
    } else if (comprado) {
      const acao = LOJA_ABA === 'temas' ? `ativarTema('${item.id}')`
                : LOJA_ABA === 'bichinhos' ? `ativarBichinho('${item.id}')`
                : '';
      botao = acao
        ? `<button class="loja-btn usar" onclick="${acao}">Usar</button>`
        : `<div class="loja-btn comprado">✓ Comprado</div>`;
    } else {
      botao = `<button class="loja-btn comprar ${temGrana?'':'sem-grana'}" onclick="comprar('${LOJA_ABA}','${item.id}')" ${temGrana?'':'disabled'}>🪙 ${item.preco}</button>`;
    }

    return `<div class="loja-item">
      ${preview}
      <div class="loja-nome">${item.nome}</div>
      ${botao}
    </div>`;
  }).join('');

  return abasHtml + `<div class="loja-grid">${itensHtml || '<div class="vazio">Sem itens nesta categoria</div>'}</div>`;
}

function mudarLojaAba(aba) {
  LOJA_ABA = aba;
  document.getElementById('m-conteudo').innerHTML = renderLojaConteudo();
}

function comprar(categoria, id) {
  const tbl = LOJA[categoria];
  if (!tbl) return;
  const item = tbl.find(x => x.id === id);
  if (!item) return;
  if (STATE.moedas < item.preco) {
    alert('Moedas insuficientes! Joga mais pra ganhar.');
    return;
  }
  if ((STATE.comprados[categoria] || []).includes(id)) return;
  STATE.comprados[categoria] = STATE.comprados[categoria] || [];
  STATE.comprados[categoria].push(id);
  STATE.moedas -= item.preco;
  STATE.save();
  somMoeda();
  soltarConfete(30);
  document.getElementById('m-titulo').textContent = `Loja · 🪙 ${STATE.moedas}`;
  document.getElementById('m-conteudo').innerHTML = renderLojaConteudo();
  renderHeaderPlayer();
}

function ativarTema(id) {
  STATE.temaAtivo = id;
  STATE.save();
  aplicarTemaAtivo();
  document.getElementById('m-conteudo').innerHTML = renderLojaConteudo();
}

function ativarBichinho(id) {
  STATE.bichinhoAtivo = STATE.bichinhoAtivo === id ? null : id;
  STATE.save();
  renderHeaderPlayer();
  document.getElementById('m-conteudo').innerHTML = renderLojaConteudo();
}

function aplicarTemaAtivo() {
  const tema = LOJA.temas.find(t => t.id === (STATE.temaAtivo || 'padrao'));
  if (tema) document.body.style.background = tema.bg;
}

function abrirModalBadges() {
  const m = document.getElementById('modal-overlay');
  document.getElementById('m-emoji').textContent = '🏆';
  document.getElementById('m-titulo').textContent = `Suas conquistas (${STATE.badges.length}/${Object.keys(BADGES).length})`;
  const html = Object.entries(BADGES).map(([key, b]) => {
    const ganha = STATE.badges.includes(key);
    return `<div class="badge-item ${ganha?'ganha':'locked'}">
      <div class="badge-emoji">${ganha ? b.emoji : '🔒'}</div>
      <div class="badge-txt">
        <div class="badge-nome">${b.nome}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('m-conteudo').innerHTML = `<div class="badges-lista">${html}</div>`;
  document.getElementById('modal-btn').onclick = () => fecharModal();
  document.getElementById('modal-btn').textContent = 'Fechar';
  m.classList.remove('hidden');
}

function fecharModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function mostrarNovaBadge(key) {
  const b = BADGES[key]; if (!b) return;
  const t = document.getElementById('toast-celebra');
  t.innerHTML = `<div style="font-size:14px;font-weight:600;opacity:0.85;margin-bottom:4px">NOVA CONQUISTA</div>
    <div style="font-size:42px">${b.emoji}</div>
    <div style="font-size:18px;margin-top:4px">${b.nome}</div>`;
  t.classList.remove('mostrar'); void t.offsetWidth;
  t.classList.add('mostrar');
  somBadge();
  soltarConfete(80);
}

function mostrarSubidaDeNivel(novoNivel) {
  const t = document.getElementById('toast-celebra');
  t.innerHTML = `<div style="font-size:14px;font-weight:600;opacity:0.85;margin-bottom:4px">SUBIU DE NÍVEL!</div>
    <div style="font-size:50px">🎖️</div>
    <div style="font-size:24px;margin-top:4px">Nível ${novoNivel}</div>
    <div style="font-size:13px;margin-top:6px;opacity:0.9">+${10 * novoNivel} 🪙 moedas</div>`;
  t.classList.remove('mostrar'); void t.offsetWidth;
  t.classList.add('mostrar');
  somLevelUp();
  soltarConfete(100);
}

// ============== DICA INLINE ==============
let TUTORIAIS = {};

function renderDicaInline(id) {
  const t = TUTORIAIS[id];
  const box = document.getElementById('dica-inline');
  if (!box) return;
  if (!t) { box.innerHTML = ''; return; }
  box.innerHTML = `
    <div class="dica-header">
      <span class="dica-emoji">${t.emoji}</span>
      <span class="dica-titulo">${t.titulo}</span>
      <button class="dica-toggle" onclick="toggleDicaDetalhe()">❓ Dica</button>
    </div>
    <div class="dica-detalhe hidden" id="dica-detalhe">${t.corpo}</div>
  `;
}

function toggleDicaDetalhe() {
  const d = document.getElementById('dica-detalhe');
  if (d) d.classList.toggle('hidden');
}

// ============== SONS MELHORADOS ==============
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  return audioCtx;
}

function nota(freq, start, dur, tipo = 'sine', vol = 0.2) {
  const ctx = getAudioCtx(); if (!ctx) return;
  try {
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = tipo; osc.frequency.value = freq;
    const t0 = ctx.currentTime + start;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + dur);
  } catch(e) {}
}

function somAcerto() {
  // acorde maior feliz C-E-G com leve staccato + 5a oitava
  nota(523, 0, 0.18, 'triangle', 0.22);
  nota(659, 0.03, 0.2, 'triangle', 0.2);
  nota(784, 0.06, 0.25, 'triangle', 0.22);
}

function somErro() {
  // mais suave, não punitivo
  nota(440, 0, 0.14, 'sine', 0.13);
  nota(349, 0.1, 0.2, 'sine', 0.11);
}

function somCelebracao() {
  // arpeggio ascendente C-E-G-C-E
  [523, 659, 784, 1047, 1319].forEach((f, i) =>
    nota(f, i * 0.08, 0.2, 'triangle', 0.2));
}

function somMoeda() {
  nota(1760, 0, 0.08, 'sine', 0.25);
  nota(2093, 0.05, 0.12, 'sine', 0.18);
}

function somLevelUp() {
  // fanfarra ascendente C-D-E-F-G-A-C
  const freq = [523, 587, 659, 698, 784, 880, 1047];
  freq.forEach((f, i) => nota(f, i * 0.09, 0.25, 'triangle', 0.22));
}

function somBadge() {
  // dois acordes pomposos
  nota(392, 0, 0.3, 'triangle', 0.2);
  nota(494, 0, 0.3, 'triangle', 0.18);
  nota(587, 0.15, 0.4, 'triangle', 0.2);
  nota(784, 0.3, 0.5, 'triangle', 0.22);
}

// ============== CONFETE ==============
function soltarConfete(n = 40) {
  const layer = document.getElementById('confete-layer');
  if (!layer) return;
  const cores = ['#ffd36b','#ff9a44','#ff7b6b','#4ab3a5','#5ba8e8','#b968e8','#6b54d3'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confete';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = cores[Math.floor(Math.random() * cores.length)];
    c.style.animationDuration = (1.2 + Math.random() * 1.2) + 's';
    c.style.animationDelay = Math.random() * 0.3 + 's';
    c.style.width = (6 + Math.random() * 8) + 'px';
    c.style.height = (10 + Math.random() * 10) + 'px';
    layer.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

function mostrarToast(texto) {
  const t = document.getElementById('toast-celebra');
  if (!t) return;
  t.innerHTML = texto;
  t.classList.remove('mostrar'); void t.offsetWidth;
  t.classList.add('mostrar');
}

// ============== CAPÍTULOS + JOGOS ==============
let DICAS = {};
let CAPS = {};
let JOGOS = {};
let jogoAtivo = null;
let jogoState = {};
let capAtual = 0;

function abrirCapitulo(n) {
  capAtual = n;
  document.getElementById('menu-principal').classList.add('hidden');
  document.getElementById('area-jogo').classList.add('hidden');
  document.getElementById('menu-capitulo').classList.remove('hidden');
  document.getElementById('titulo-cap').textContent = CAPS[n].nome;
  const lista = document.getElementById('lista-jogos');
  lista.innerHTML = '';
  CAPS[n].jogos.forEach(j => {
    const estrelas = STATE.estrelasJogo(j.id);
    const btn = document.createElement('button');
    btn.className = 'jogo-card';
    btn.innerHTML = `
      <div class="info">${j.nome}<span class="desc">${j.desc}</span></div>
      <div class="estrelinhas">⭐ ${estrelas}</div>`;
    btn.onclick = () => abrirJogo(j.id, j.nome);
    lista.appendChild(btn);
  });
}

function voltarMenu() {
  document.getElementById('menu-capitulo').classList.add('hidden');
  document.getElementById('area-jogo').classList.add('hidden');
  document.getElementById('menu-principal').classList.remove('hidden');
}

function voltarCapitulo() {
  document.getElementById('area-jogo').classList.add('hidden');
  document.getElementById('menu-capitulo').classList.remove('hidden');
  abrirCapitulo(capAtual);
}

function abrirJogo(id, nome) {
  jogoAtivo = id;
  jogoState = {};
  document.getElementById('menu-capitulo').classList.add('hidden');
  document.getElementById('area-jogo').classList.remove('hidden');
  document.getElementById('titulo-jogo').textContent = nome;
  renderDicaInline(id);
  atualizarPlacarJogo();
  mostrarReforcoHistorico(id);
  adicionarBotaoRespirarManual();
  JOGOS[id].iniciar();
}

function atualizarPlacarJogo() {
  const j = STATE.porJogo[jogoAtivo] || {acertos:0, tentativas:0, streak:0};
  const a = document.getElementById('j-acertos');
  const t = document.getElementById('j-tentativas');
  const s = document.getElementById('j-streak');
  if (a) a.textContent = j.acertos;
  if (t) t.textContent = j.tentativas;
  if (s) s.textContent = j.streak;
  atualizarBadgeNivel();
  atualizarPlacarGeral();
}

// ============== NÍVEL DE DIFICULDADE (Fácil / Médio / Difícil) ==============
// A dificuldade escala com acertos acumulados E streak atual no jogo ativo.
// A ideia: primeiros acertos saem fáceis (confiança), depois sobe.
// Errar seguido abaixa; sequência positiva puxa pra cima.
const NIVEIS = [
  { id: 0, nome: 'Fácil',   emoji: '🟢', cor: '#1b7a3a' },
  { id: 1, nome: 'Médio',   emoji: '🟡', cor: '#c48a00' },
  { id: 2, nome: 'Difícil', emoji: '🔴', cor: '#a83232' }
];

function getNivelJogo(id) {
  const alvo = id || jogoAtivo;
  if (!alvo) return 0;
  const j = (STATE && STATE.porJogo && STATE.porJogo[alvo]) || {acertos: 0, streak: 0};
  const acertos = j.acertos || 0;
  const streak  = j.streak  || 0;
  // base por acertos totais
  let nivel = 0;
  if (acertos >= 15) nivel = 2;
  else if (acertos >= 5) nivel = 1;
  // streak alta empurra pra cima, baixa segura
  if (streak >= 5 && nivel < 2) nivel++;
  // errar seguido (errosSeguidos desta sessão) desce um nível
  const errosSeg = (typeof jogoState === 'object' && jogoState) ? (jogoState.errosSeguidos || 0) : 0;
  if (errosSeg >= 2 && nivel > 0) nivel--;
  return nivel;
}

// Helper pra ranges numéricos: [faixaFacil, faixaMedio, faixaDificil]
// Cada faixa é [min, max] inclusive. Retorna um número aleatório dentro da faixa do nível atual.
function randNivel(faixas, id) {
  const n = getNivelJogo(id);
  const faixa = faixas[n] || faixas[faixas.length - 1];
  const [min, max] = faixa;
  return rand(max, min);
}

// Helper pra escolher opções (array) por nível
function pickNivel(opcoesPorNivel, id) {
  const n = getNivelJogo(id);
  return opcoesPorNivel[n] || opcoesPorNivel[opcoesPorNivel.length - 1];
}

function atualizarBadgeNivel() {
  const placar = document.querySelector('.placar-jogo');
  if (!placar || !jogoAtivo) return;
  let badge = placar.querySelector('.badge-nivel');
  const n = getNivelJogo();
  const info = NIVEIS[n];
  if (!badge) {
    badge = document.createElement('div');
    badge.className = 'badge-nivel';
    // insere antes do botão respirar manual (se existir) para ficar à direita do placar
    const btnResp = placar.querySelector('.btn-respirar-manual');
    if (btnResp) placar.insertBefore(badge, btnResp);
    else placar.appendChild(badge);
  }
  badge.dataset.nivel = n;
  badge.style.color = info.cor;
  badge.title = `Dificuldade: ${info.nome}. Acerte mais pra subir de nível.`;
  badge.innerHTML = `<span class="badge-nivel-emoji">${info.emoji}</span><span class="badge-nivel-txt">${info.nome}</span>`;
}

// ============== FRASES MOTIVACIONAIS (variadas, sem repetir o mesmo "correto!") ==============
const FRASES_ACERTO = [
  'Muito bem!', 'Boa!', 'Acertou em cheio!', 'Perfeito!',
  'Você tá craque!', 'Mandou ver!', 'Matadora essa!', 'Isso aí!',
  'Uhul!', 'Você pensou certo!', 'Vai com tudo!', 'Show!',
  'Olha essa cabeça!', 'Tá dominando!', 'Orgulho da gente!', 'Acertou sozinho!',
  'Arrasou!', 'Tá voando!'
];
const FRASES_PRIMEIRA_VEZ = [
  'Primeira estrela deste jogo!', 'Começou bem!', 'Primeira de muitas!',
  'Sua primeira aqui, parabéns!'
];
const FRASES_ERRO = [
  'Quase! Tenta de novo.',
  'Errar faz parte, bora tentar mais uma.',
  'Respira. Você consegue.',
  'Não foi dessa vez. Segue!',
  'Calma, cada erro ensina.',
  'Tá perto! Mais uma tentativa.',
  'Sem desanimar! É assim que aprende.'
];

function fraseSorteada(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ============== FEEDBACK ==============
function feedbackAcerto(msg) {
  const eraPrimeira = !STATE.porJogo[jogoAtivo] || STATE.porJogo[jogoAtivo].acertos === 0;
  STATE.acertou(jogoAtivo);
  atualizarPlacarJogo();
  somAcerto();
  jogoState.errosSeguidos = 0;
  jogoState.errosNaPerguntaAtual = 0;
  const fb = document.getElementById('feedback');
  if (fb) {
    const texto = msg || (eraPrimeira ? fraseSorteada(FRASES_PRIMEIRA_VEZ) : fraseSorteada(FRASES_ACERTO));
    fb.innerHTML = '⭐ ' + texto + ' <span style="opacity:0.7;font-size:12px">(+10 XP · +1 🪙)</span>';
    fb.className = 'feedback acerto';
  }
  const j = STATE.porJogo[jogoAtivo];
  if (j && j.streak > 0 && j.streak % 5 === 0) {
    mostrarToast(`<div style="font-size:22px">🏆</div><div style="font-size:28px;margin-top:4px">${j.streak} seguidas!</div><div style="font-size:13px;opacity:0.9;margin-top:4px">+40 XP · +5 🪙</div>`);
    soltarConfete(60);
    somCelebracao();
    somMoeda();
    reagirMascoteCoach('combo');
  } else if (j && j.acertos === 1) {
    soltarConfete(25);
    reagirMascoteCoach('acerto');
  } else {
    reagirMascoteCoach('acerto');
  }
  setTimeout(() => { if (jogoAtivo) JOGOS[jogoAtivo].iniciar(); }, 1400);
}

function feedbackErro(msg, dica) {
  STATE.errou(jogoAtivo);
  atualizarPlacarJogo();
  somErro();

  // Dicas progressivas: se o jogo definiu jogoState.dicasAtuais, usa tier conforme erro na mesma pergunta
  let dicaFinal = dica;
  let isResolucao = false;
  if (jogoState.dicasAtuais && jogoState.dicasAtuais.length) {
    jogoState.errosNaPerguntaAtual = (jogoState.errosNaPerguntaAtual || 0) + 1;
    const idx = Math.min(jogoState.errosNaPerguntaAtual - 1, jogoState.dicasAtuais.length - 1);
    dicaFinal = jogoState.dicasAtuais[idx];
    isResolucao = (idx === jogoState.dicasAtuais.length - 1);
  }

  const fb = document.getElementById('feedback');
  if (fb) {
    const texto = msg || fraseSorteada(FRASES_ERRO);
    const prefixo = isResolucao ? '📖 Vamos resolver juntos: ' : '💡 ';
    const classeDica = isResolucao ? 'dica resolucao' : 'dica';
    fb.innerHTML = texto + (dicaFinal ? `<span class="${classeDica}">${prefixo}${dicaFinal}</span>` : '');
    fb.className = 'feedback erro';
  }
  reagirMascoteCoach('erro');
  jogoState.errosSeguidos = (jogoState.errosSeguidos || 0) + 1;
}

// Jogos que queiram dicas progressivas chamam antes de renderizar cada pergunta:
//   setDicasPergunta(['dica leve', 'dica forte', 'resolução passo a passo'])
function setDicasPergunta(dicas) {
  jogoState.dicasAtuais = Array.isArray(dicas) ? dicas : null;
  jogoState.errosNaPerguntaAtual = 0;
}

function rand(max, min = 0) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function escolher(arr) { return arr[rand(arr.length - 1)]; }

// ============== MODO PROVA ==============
let MODO_PROVA = null;
let tempoInicioProva = null;

function detectarModoProva() {
  const params = new URLSearchParams(location.search);
  const id = params.get('prova');
  if (!id) return false;
  let p = null;
  // 1ª tentativa: sessionStorage (se veio direto)
  try {
    const s = JSON.parse(sessionStorage.getItem('modoProva') || 'null');
    if (s && s.id === id) p = s;
  } catch(e) {}
  // 2ª tentativa: busca direto na lista de provas (funciona mesmo em aba nova / reload)
  if (!p) {
    try {
      const all = JSON.parse(localStorage.getItem('jogosMat_provas_v1') || '[]');
      p = all.find(x => x.id === id);
    } catch(e) {}
  }
  if (!p || !p.roteiro) return false;
  MODO_PROVA = {
    id: p.id, nome: p.nome, ano: p.ano,
    roteiro: p.roteiro,
    indice: 0,
    atualVez: 0,
    resultados: p.roteiro.map(r => ({ acertos: 0, total: 0, jogoNome: r.jogoNome }))
  };
  tempoInicioProva = Date.now();
  return true;
}

function iniciarModoProva() {
  // esconde menu, começa primeiro jogo
  document.getElementById('menu-principal').classList.add('hidden');
  document.getElementById('menu-capitulo').classList.add('hidden');
  document.getElementById('area-jogo').classList.remove('hidden');

  // customiza topo do area-jogo
  const header = document.createElement('div');
  header.id = 'prova-header';
  header.style.cssText = 'background:linear-gradient(135deg,#4ab3a5,#1b7a3a);color:#fff;padding:14px 16px;border-radius:14px;margin-bottom:14px;box-shadow:0 4px 12px rgba(26,122,58,0.25)';
  header.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;justify-content:space-between">
      <span style="background:#fff;color:#1b7a3a;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:800;letter-spacing:1px">📝 MODO PROVA</span>
      <button onclick="sairDaProva()" style="background:rgba(255,255,255,0.9);color:#1b7a3a;border:none;padding:4px 12px;border-radius:16px;font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px">✕ Sair</button>
    </div>
    <div style="font-weight:800;font-size:20px;line-height:1.2;margin-bottom:8px" id="prova-nome">${MODO_PROVA.nome}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;font-size:12px;opacity:0.95">
      <div id="prova-progresso">Jogo 1 de ${MODO_PROVA.roteiro.length}</div>
      <div id="prova-rodada" style="font-weight:700;font-size:14px">Rodada 1/${MODO_PROVA.roteiro[0].vezes}</div>
    </div>`;
  const area = document.getElementById('area-jogo');
  area.insertBefore(header, area.firstChild);

  // remove voltar padrão
  const voltar = area.querySelector('.voltar');
  if (voltar) voltar.style.display = 'none';

  iniciarJogoProva();
}

function iniciarJogoProva() {
  const r = MODO_PROVA.roteiro[MODO_PROVA.indice];
  jogoAtivo = r.jogoId;
  jogoState = {};
  document.getElementById('titulo-jogo').textContent = r.jogoNome;
  atualizarHeaderProva();
  renderDicaInline(r.jogoId);
  // placar do jogo atual
  const placar = document.querySelector('.placar-jogo');
  if (placar) {
    placar.innerHTML = `
      <div>Acertos<strong id="j-acertos">0</strong></div>
      <div>Tentativas<strong id="j-tentativas">0</strong></div>
      <div>Rodada<strong id="j-streak">${MODO_PROVA.atualVez + 1}/${r.vezes}</strong></div>`;
  }
  if (JOGOS[r.jogoId]) JOGOS[r.jogoId].iniciar();
  else document.getElementById('jogo-conteudo').innerHTML = `<div class="vazio-msg">Jogo "${r.jogoId}" não disponível neste ano.</div>`;
}

function atualizarHeaderProva() {
  const r = MODO_PROVA.roteiro[MODO_PROVA.indice];
  const prog = document.getElementById('prova-progresso');
  const rod = document.getElementById('prova-rodada');
  if (prog) prog.textContent = `Jogo ${MODO_PROVA.indice + 1} de ${MODO_PROVA.roteiro.length}`;
  if (rod) rod.textContent = `Rodada ${MODO_PROVA.atualVez + 1}/${r.vezes}`;
  // placar do jogo atual
  const acs = document.getElementById('j-acertos');
  const tents = document.getElementById('j-tentativas');
  const streak = document.getElementById('j-streak');
  const res = MODO_PROVA.resultados[MODO_PROVA.indice];
  if (acs) acs.textContent = res.acertos;
  if (tents) tents.textContent = res.total;
  if (streak) streak.textContent = `${MODO_PROVA.atualVez + 1}/${r.vezes}`;
}

function feedbackAcertoProva(msg) {
  const r = MODO_PROVA.roteiro[MODO_PROVA.indice];
  MODO_PROVA.resultados[MODO_PROVA.indice].acertos++;
  MODO_PROVA.resultados[MODO_PROVA.indice].total++;
  MODO_PROVA.atualVez++;
  // ainda conta pro STATE geral (XP, moedas)
  STATE.acertou(jogoAtivo);
  somAcerto();
  jogoState.errosSeguidos = 0;
  const fb = document.getElementById('feedback');
  if (fb) { fb.innerHTML = '⭐ ' + (msg || 'Muito bem!'); fb.className = 'feedback acerto'; }
  if (MODO_PROVA.atualVez >= r.vezes) {
    setTimeout(avancarProva, 1400);
  } else {
    atualizarHeaderProva();
    setTimeout(() => JOGOS[jogoAtivo].iniciar(), 1200);
  }
}

function feedbackErroProva(msg, dica) {
  const r = MODO_PROVA.roteiro[MODO_PROVA.indice];
  MODO_PROVA.resultados[MODO_PROVA.indice].total++;
  MODO_PROVA.atualVez++;
  STATE.errou(jogoAtivo);
  somErro();
  const fb = document.getElementById('feedback');
  if (fb) {
    fb.innerHTML = msg + (dica ? `<span class="dica">💡 ${dica}</span>` : '');
    fb.className = 'feedback erro';
  }
  jogoState.errosSeguidos = (jogoState.errosSeguidos || 0) + 1;
  if (MODO_PROVA.atualVez >= r.vezes) {
    setTimeout(avancarProva, 2200);
  } else {
    atualizarHeaderProva();
    setTimeout(() => JOGOS[jogoAtivo].iniciar(), 1800);
  }
}

function avancarProva() {
  MODO_PROVA.indice++;
  MODO_PROVA.atualVez = 0;
  if (MODO_PROVA.indice >= MODO_PROVA.roteiro.length) {
    mostrarResultadoProva();
  } else {
    iniciarJogoProva();
  }
}

function mostrarResultadoProva() {
  const totAcertos = MODO_PROVA.resultados.reduce((s, r) => s + r.acertos, 0);
  const totTotal = MODO_PROVA.resultados.reduce((s, r) => s + r.total, 0);
  const pct = totTotal > 0 ? Math.round(totAcertos / totTotal * 100) : 0;
  const tempo = Math.round((Date.now() - tempoInicioProva) / 1000);
  const tempoTxt = tempo >= 60 ? `${Math.floor(tempo/60)}min ${tempo%60}s` : `${tempo}s`;

  // salva no histórico da prova
  try {
    const provas = JSON.parse(localStorage.getItem('jogosMat_provas_v1') || '[]');
    const p = provas.find(x => x.id === MODO_PROVA.id);
    if (p) {
      p.historico = p.historico || [];
      p.historico.push({
        data: new Date().toISOString(),
        acertos: totAcertos, total: totTotal,
        tempo, pct,
        detalhe: MODO_PROVA.resultados.map(r => ({ nome: r.jogoNome, acertos: r.acertos, total: r.total }))
      });
      localStorage.setItem('jogosMat_provas_v1', JSON.stringify(provas));
    }
  } catch(e) {}

  let emoji = '🏆', msg = 'Excelente!';
  if (pct < 60) { emoji = '💪'; msg = 'Dá pra melhorar! Bora refazer?'; }
  else if (pct < 80) { emoji = '👍'; msg = 'Bom trabalho!'; }
  else if (pct < 100) { emoji = '🌟'; msg = 'Muito bem!'; }

  const detalheHtml = MODO_PROVA.resultados.map(r => {
    const p = r.total > 0 ? Math.round(r.acertos / r.total * 100) : 0;
    const corBarra = p >= 80 ? '#4ab3a5' : p >= 60 ? '#ffd36b' : '#ff7b6b';
    return `
      <div style="background:#f7f5ff;border-radius:10px;padding:10px 12px;margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-weight:600;color:#4a3b8a;font-size:13px">${r.jogoNome}</span>
          <span style="font-weight:700;color:#4a3b8a;font-size:13px">${r.acertos}/${r.total}</span>
        </div>
        <div style="background:#e0dbf5;height:6px;border-radius:3px;overflow:hidden">
          <div style="background:${corBarra};height:100%;width:${p}%"></div>
        </div>
      </div>`;
  }).join('');

  document.getElementById('area-jogo').innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:64px;margin-bottom:8px">${emoji}</div>
      <h2 style="color:#4a3b8a;margin-bottom:4px;font-size:24px">${msg}</h2>
      <div style="color:#888;font-size:14px;margin-bottom:16px">${MODO_PROVA.nome}</div>

      <div style="background:linear-gradient(135deg,#4ab3a5,#1b7a3a);color:#fff;border-radius:14px;padding:18px;margin-bottom:14px">
        <div style="font-size:44px;font-weight:800;line-height:1">${totAcertos}/${totTotal}</div>
        <div style="font-size:14px;opacity:0.9">${pct}% de acerto · ${tempoTxt}</div>
      </div>

      <div style="text-align:left;margin:14px 0">
        <div style="font-weight:700;color:#4a3b8a;margin-bottom:8px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">Por exercício</div>
        ${detalheHtml}
      </div>

      <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;justify-content:center">
        <button class="acao" onclick="reiniciarProva()">🔄 Refazer</button>
        <button class="acao sec" onclick="location.href='provas.html'">← Voltar às provas</button>
      </div>
    </div>`;
  // remove header de prova no topo do area-jogo
  const header = document.getElementById('prova-header');
  if (header) header.remove();
  soltarConfete(pct >= 80 ? 100 : 40);
  if (pct >= 80) somCelebracao();
}

function reiniciarProva() {
  sessionStorage.setItem('modoProva', JSON.stringify({
    id: MODO_PROVA.id, nome: MODO_PROVA.nome, ano: MODO_PROVA.ano, roteiro: MODO_PROVA.roteiro
  }));
  location.reload();
}

function sairDaProva() {
  if (!confirm('Sair da prova agora? O progresso desta execução não será salvo no histórico.')) return;
  try { sessionStorage.removeItem('modoProva'); } catch(e) {}
  location.href = 'provas.html';
}

// Override dos feedbacks originais pra distinguir modo prova
const _feedbackAcerto_original = feedbackAcerto;
const _feedbackErro_original = feedbackErro;
feedbackAcerto = function(msg) {
  if (MODO_PROVA) feedbackAcertoProva(msg);
  else _feedbackAcerto_original(msg);
};
feedbackErro = function(msg, dica) {
  if (MODO_PROVA) feedbackErroProva(msg, dica);
  else _feedbackErro_original(msg, dica);
};

// ============== MASCOTE COACH (canto inferior direito) ==============
let _coachBalaoTimer = null;
let _coachClassTimer = null;

function renderMascoteCoach() {
  if (typeof MASCOTES === 'undefined') return;
  let el = document.getElementById('mascote-coach');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mascote-coach';
    el.className = 'mascote-coach';
    document.body.appendChild(el);
  }
  const m = getMascoteAtivo();
  el.innerHTML = `
    <div class="coach-balao" id="coach-balao"></div>
    ${m.svg}
  `;
  const svg = el.querySelector('svg');
  if (svg) svg.addEventListener('click', () => reagirMascoteCoach('toque'));
}

function mostrarBalaoCoach(texto, tipo, duracao) {
  const el = document.getElementById('mascote-coach');
  if (!el) return;
  const b = el.querySelector('.coach-balao');
  if (!b) return;
  b.className = 'coach-balao' + (tipo ? ' ' + tipo : '');
  b.textContent = texto;
  el.classList.add('com-balao');
  clearTimeout(_coachBalaoTimer);
  _coachBalaoTimer = setTimeout(() => {
    el.classList.remove('com-balao');
  }, duracao || 1800);
}

function reagirMascoteCoach(tipo) {
  const el = document.getElementById('mascote-coach');
  if (!el || typeof falaAleatoria !== 'function') return;
  clearTimeout(_coachClassTimer);
  el.classList.remove('reagindo', 'tristonho');
  void el.offsetWidth;

  if (tipo === 'acerto' || tipo === 'combo') {
    el.classList.add('reagindo');
    mostrarBalaoCoach(falaAleatoria(tipo === 'combo' ? 'combo' : 'acerto'), 'acerto', 1600);
  } else if (tipo === 'erro') {
    el.classList.add('tristonho');
    mostrarBalaoCoach(falaAleatoria('erro'), 'erro', 2200);
  } else if (tipo === 'boasvindas') {
    mostrarBalaoCoach(falaAleatoria('boasvindas'), null, 2400);
  } else if (tipo === 'toque') {
    el.classList.add('reagindo');
    mostrarBalaoCoach(falaAleatoria('boasvindas'), null, 1800);
  }
  _coachClassTimer = setTimeout(() => {
    el.classList.remove('reagindo', 'tristonho');
  }, 1100);
}

// Mostra balão só quando entra no jogo (não na seleção de capítulo)
const _abrirJogo_original = abrirJogo;
abrirJogo = function(id, nome) {
  _abrirJogo_original(id, nome);
  setTimeout(() => reagirMascoteCoach('boasvindas'), 400);
};

// ============== MODO CALMA (respiração guiada pós-erro) ==============
let _modoCalmaAtivo = false;

function garantirModoCalmaOverlay() {
  if (document.getElementById('modo-calma-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'modo-calma-overlay';
  overlay.className = 'modo-calma-overlay';
  overlay.innerHTML = `
    <div class="modo-calma-box">
      <h2>Vamos respirar juntos 🌿</h2>
      <div class="calma-subtitulo">Errar faz parte. Respira que já volta.</div>
      <div class="respirar-circulo" id="respirar-circulo"></div>
      <div class="respirar-texto" id="respirar-texto">Prepara…</div>
      <div class="respirar-contador" id="respirar-contador">—</div>
      <button class="btn-sair-calma" id="btn-sair-calma" onclick="fecharModoCalma()">Voltar ao jogo 💪</button>
    </div>`;
  document.body.appendChild(overlay);
}

async function abrirModoCalma() {
  if (_modoCalmaAtivo) return;
  _modoCalmaAtivo = true;
  garantirModoCalmaOverlay();
  const overlay = document.getElementById('modo-calma-overlay');
  const circ    = document.getElementById('respirar-circulo');
  const txt     = document.getElementById('respirar-texto');
  const cnt     = document.getElementById('respirar-contador');
  const btn     = document.getElementById('btn-sair-calma');
  btn.classList.remove('visivel');
  circ.className = 'respirar-circulo';
  txt.textContent = 'Prepara…';
  cnt.textContent = '—';
  overlay.classList.add('visivel');

  await _dormir(900);

  for (let i = 1; i <= 3; i++) {
    if (!_modoCalmaAtivo) return; // usuário fechou no meio
    cnt.textContent = `Respiração ${i} de 3`;
    txt.textContent = 'Inspira…';
    circ.className = 'respirar-circulo inspira';
    _somRespira(true);
    await _dormir(3500);
    if (!_modoCalmaAtivo) return;
    txt.textContent = 'Segura…';
    circ.className = 'respirar-circulo segura';
    await _dormir(1200);
    if (!_modoCalmaAtivo) return;
    txt.textContent = 'Solta…';
    circ.className = 'respirar-circulo solta';
    _somRespira(false);
    await _dormir(3500);
  }
  if (!_modoCalmaAtivo) return;
  txt.textContent = 'Muito bem! 🌟';
  cnt.textContent = 'Pronto pra voltar';
  btn.classList.add('visivel');
}

function fecharModoCalma() {
  const overlay = document.getElementById('modo-calma-overlay');
  if (overlay) overlay.classList.remove('visivel');
  _modoCalmaAtivo = false;
  if (jogoState) jogoState.errosSeguidos = 0;
}

function _dormir(ms) { return new Promise(r => setTimeout(r, ms)); }

// Respiração suave com AudioCtx (sinusoidal, nada agressivo)
function _somRespira(subindo) {
  const ctx = getAudioCtx(); if (!ctx) return;
  try {
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = 'sine';
    const t0 = ctx.currentTime;
    if (subindo) {
      osc.frequency.setValueAtTime(220, t0);
      osc.frequency.linearRampToValueAtTime(330, t0 + 3.0);
    } else {
      osc.frequency.setValueAtTime(330, t0);
      osc.frequency.linearRampToValueAtTime(180, t0 + 3.0);
    }
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.07, t0 + 0.3);
    gain.gain.linearRampToValueAtTime(0.05, t0 + 2.5);
    gain.gain.linearRampToValueAtTime(0.001, t0 + 3.3);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + 3.5);
  } catch(e) {}
}

// Botão "🧘 Respirar" manual dentro do placar — sempre acessível
function adicionarBotaoRespirarManual() {
  const placar = document.querySelector('.placar-jogo');
  if (!placar || placar.querySelector('.btn-respirar-manual')) return;
  const btn = document.createElement('button');
  btn.className = 'btn-respirar-manual';
  btn.innerHTML = '🧘 Respirar';
  btn.title = 'Pausa pra respirar';
  btn.onclick = abrirModoCalma;
  placar.appendChild(btn);
}

// ============== REFORÇO POSITIVO HISTÓRICO ==============
// Banner "você já é fera aqui" quando abre jogo com acertos >= 5
function mostrarReforcoHistorico(id) {
  const j = STATE.porJogo[id];
  if (!j || j.acertos < 5) return;
  const anterior = document.querySelector('.reforco-banner');
  if (anterior) anterior.remove();
  const cont = document.getElementById('jogo-conteudo');
  if (!cont || !cont.parentNode) return;
  const banner = document.createElement('div');
  banner.className = 'reforco-banner';
  let frase;
  if (j.acertos >= 50)      frase = `Lenda aqui! Você acertou ${j.acertos} vezes nesse jogo 🏆`;
  else if (j.acertos >= 20) frase = `Você manda nesse jogo — ${j.acertos} acertos no currículo 💪`;
  else if (j.acertos >= 10) frase = `Você já é fera aqui — acertou ${j.acertos} vezes!`;
  else                       frase = `Você já acertou esse jogo ${j.acertos} vezes. Manda bem!`;
  banner.innerHTML = `<span class="estrela-grande">⭐</span>${frase}`;
  cont.parentNode.insertBefore(banner, cont);
  setTimeout(() => { banner.style.opacity = '0'; }, 5500);
  setTimeout(() => banner.remove(), 6200);
}

// ============== INIT ==============
function initJogos() {
  STATE.load();
  atualizarPlacarGeral();
  renderHeaderPlayer();
  renderMascoteCoach();
  if (detectarModoProva()) {
    iniciarModoProva();
  }
}
