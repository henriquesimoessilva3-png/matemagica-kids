// =========================================================
// MASCOTES.JS — Trupe do Explora (4 mascotes originais)
// Mami (mamute), Pix (pincel), Rosa (rosa-dos-ventos), Sol
// Zero sobreposição com personagens/ilustrações do livro didático.
// =========================================================

const SIMBOLOS_BG = `
  <g>
    <text class="sim sim-1" x="14"  y="38"  font-size="18">⏳</text>
    <text class="sim sim-2" x="188" y="32"  font-size="18">🧭</text>
    <text class="sim sim-3" x="8"   y="212" font-size="16">🏺</text>
    <text class="sim sim-4" x="198" y="212" font-size="16">🗺️</text>
  </g>`;

const MASCOTES = {
  mami: {
    nome: 'Mami',
    cor: '#8b5a2b',
    falas: {
      intro: [
        'Oi! Eu sou a Mami 🐘',
        'Sou uma mamute pequenininha!',
        'Vivi na era do gelo há muito, muito tempo.',
        'Bora aprender sobre minha época?',
        'Apertadinho com meu bando pelo frio!'
      ],
      boasvindas: [
        'Vamos lá, explorador!',
        'Pisada firme, bora!',
        'Foca com a trombinha!',
        'Passo de mamute: não erra!'
      ],
      acerto: [
        'Mami gosta disso!',
        'Trombada de acerto!',
        'Presas em festa!',
        'Bando todo aprovou!',
        'Você é pelo-duro de caçador!',
        'Olha a trombeta!',
        'Era do Gelo curtiu!',
        'Passo certeiro!'
      ],
      erro: [
        'Escorreguei no gelo, tudo bem.',
        'Tromba falhou. Tenta outra!',
        'Até mamute esbarra na pedra.',
        'Próxima, acertamos juntos.',
        'Calma, cola com a Mami.'
      ],
      combo: [
        'Manada em movimento!',
        'Mami está voando!',
        'Sequência de gigante!'
      ]
    },
    svg: `<svg class="mascote" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" aria-label="Mami mamute">
      ${SIMBOLOS_BG}
      <ellipse cx="110" cy="248" rx="60" ry="7" fill="#3a2010" opacity="0.25"/>
      <!-- Pernas -->
      <rect x="72" y="200" width="20" height="44" rx="5" fill="#6a3a18"/>
      <rect x="128" y="200" width="20" height="44" rx="5" fill="#6a3a18"/>
      <rect x="52" y="205" width="18" height="38" rx="4" fill="#7a4a20"/>
      <rect x="150" y="205" width="18" height="38" rx="4" fill="#7a4a20"/>
      <!-- Unhas -->
      <rect x="74" y="240" width="5" height="5" fill="#3a2010"/>
      <rect x="85" y="240" width="5" height="5" fill="#3a2010"/>
      <rect x="130" y="240" width="5" height="5" fill="#3a2010"/>
      <rect x="141" y="240" width="5" height="5" fill="#3a2010"/>
      <!-- Corpo boludo -->
      <ellipse cx="110" cy="170" rx="68" ry="50" fill="#8b5a2b"/>
      <!-- Pelagem por cima -->
      <path d="M42 172 Q46 140 60 145 Q72 128 90 136 Q105 124 120 132 Q140 120 160 134 Q175 128 180 148 Q176 166 172 176 Q165 150 145 158 Q130 144 110 156 Q92 148 72 160 Q55 150 42 172 Z" fill="#6a3a18"/>
      <!-- Pelinhos -->
      <path d="M62 198 L60 208 M72 200 L70 212 M78 198 L78 208 M140 200 L140 210 M150 198 L152 210 M158 200 L156 208"
            stroke="#6a3a18" stroke-width="2" stroke-linecap="round"/>
      <!-- Rabinho -->
      <path d="M175 180 Q185 184 182 196" stroke="#6a3a18" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="184" cy="196" r="4" fill="#3a2010"/>
      <!-- Cabeca -->
      <circle cx="88" cy="130" r="46" fill="#8b5a2b"/>
      <!-- Topinho peludo -->
      <path d="M58 104 Q60 82 75 82 Q80 72 90 76 Q100 70 108 80 Q120 82 122 104 Q116 92 108 96 Q100 86 92 92 Q82 84 76 94 Q68 90 62 100 Z" fill="#6a3a18"/>
      <!-- Orelha -->
      <path d="M126 118 Q146 116 150 138 Q146 152 130 146 Z" fill="#6a3a18"/>
      <path d="M128 124 Q142 124 144 138 Q140 146 132 142 Z" fill="#a8704a" opacity="0.6"/>
      <!-- Olho -->
      <g class="olho-brilho">
        <circle cx="96" cy="126" r="7" fill="#fff"/>
        <circle cx="97" cy="128" r="4" fill="#3a2010"/>
        <circle cx="98" cy="126" r="1.5" fill="#fff"/>
      </g>
      <!-- Cilio -->
      <path d="M92 118 L94 114 M98 117 L100 113 M102 118 L104 114" stroke="#3a2010" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Sobrancelha -->
      <path d="M88 114 Q96 110 104 114" stroke="#3a2010" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Presas -->
      <path d="M64 152 Q48 156 44 174 Q50 176 56 172 Q62 166 66 156 Z" fill="#fff8e0" stroke="#c9a86b" stroke-width="1.5"/>
      <path d="M60 158 Q56 166 54 170" stroke="#c9a86b" stroke-width="0.8" fill="none"/>
      <!-- Trombinha -->
      <path d="M68 150 Q50 170 42 196 Q44 210 56 208 Q64 200 62 188 Q66 170 76 158 Z" fill="#8b5a2b"/>
      <path d="M54 178 Q46 184 44 196" stroke="#6a3a18" stroke-width="1.5" fill="none"/>
      <path d="M58 172 Q52 178 50 188" stroke="#6a3a18" stroke-width="1.2" fill="none"/>
      <!-- Pontinha da trombinha -->
      <ellipse cx="50" cy="204" rx="7" ry="5" fill="#6a3a18"/>
      <ellipse cx="50" cy="203" rx="3" ry="2" fill="#3a2010"/>
      <!-- Bochecha -->
      <circle cx="80" cy="148" r="5" fill="#ff9090" opacity="0.4"/>
    </svg>`
  },

  pix: {
    nome: 'Pix',
    cor: '#c0392b',
    falas: {
      intro: [
        'Oi! Sou o Pix 🎨',
        'Sou um pincel que pinta em cavernas!',
        'Arte rupestre é minha praia!',
        'Cada pintura conta uma história.',
        'Vem pintar histórias comigo!'
      ],
      boasvindas: [
        'Prepara a tinta!',
        'Pincelada certeira!',
        'Foca no quadro!',
        'Arte é atenção!'
      ],
      acerto: [
        'Pincelada dos deuses!',
        'Obra-prima!',
        'Traço certeiro!',
        'Caverna aplaudiu!',
        'Que olho de artista!',
        'Tinta aprovou!',
        'Virou arte rupestre!',
        'Museu curtiu!'
      ],
      erro: [
        'Borrei um pouquinho. Tenta de novo.',
        'A tinta secou. Bora!',
        'Errar faz parte do rascunho.',
        'Pincel distraído. Foca!',
        'Pintor também erra cor.'
      ],
      combo: [
        'Obra em série!',
        'Caverna toda pintada!',
        'Quadro atrás de quadro!'
      ]
    },
    svg: `<svg class="mascote" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" aria-label="Pix pincel">
      ${SIMBOLOS_BG}
      <ellipse cx="110" cy="250" rx="40" ry="6" fill="#3a2010" opacity="0.22"/>
      <!-- Pingo de tinta no chão -->
      <ellipse cx="150" cy="244" rx="10" ry="4" fill="#c0392b" opacity="0.55"/>
      <ellipse cx="70" cy="244" rx="8" ry="3" fill="#4a5a95" opacity="0.55"/>
      <!-- Cabo de madeira (bem longo, vertical) -->
      <rect x="96" y="40" width="28" height="142" rx="7" fill="#b88247"/>
      <rect x="98" y="40" width="6" height="142" fill="#d4a574" opacity="0.6"/>
      <!-- Anel metalico -->
      <rect x="90" y="178" width="40" height="14" rx="3" fill="#a0a0a0" stroke="#606060" stroke-width="1.5"/>
      <rect x="90" y="180" width="40" height="4" fill="#d0d0d0"/>
      <rect x="90" y="188" width="40" height="2" fill="#606060"/>
      <!-- Cerdas (corpo principal) -->
      <path d="M84 192 Q80 232 110 248 Q140 232 136 192 Z" fill="#6a3a18"/>
      <path d="M86 192 Q84 228 110 242 Q136 228 134 192 Q128 230 110 236 Q92 230 86 192 Z" fill="#8b5a2b"/>
      <!-- Cerdinhas individuais -->
      <path d="M94 240 L92 250 M104 242 L104 252 M110 244 L110 254 M116 242 L118 252 M126 240 L128 250"
            stroke="#4a2a10" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Tinta no fim (cor primária = vermelho ocre, como arte rupestre) -->
      <path d="M88 232 Q110 252 132 232 Q128 238 122 242 Q110 248 98 242 Q92 238 88 232 Z" fill="#c0392b"/>
      <!-- Rosto no cabo (meio do cabo) -->
      <g>
        <!-- Olhos -->
        <g class="olho-brilho">
          <ellipse cx="105" cy="100" rx="5" ry="6" fill="#fff"/>
          <ellipse cx="118" cy="100" rx="5" ry="6" fill="#fff"/>
          <circle cx="106" cy="102" r="3" fill="#3a2010"/>
          <circle cx="119" cy="102" r="3" fill="#3a2010"/>
          <circle cx="107" cy="100" r="1" fill="#fff"/>
          <circle cx="120" cy="100" r="1" fill="#fff"/>
        </g>
        <!-- Sobrancelha -->
        <path d="M100 92 Q106 88 110 92" stroke="#3a2010" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M113 92 Q118 88 123 92" stroke="#3a2010" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <!-- Boca -->
        <path d="M103 118 Q110 124 117 118" stroke="#6a2424" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- Bochecha -->
        <circle cx="96" cy="114" r="3" fill="#ff9090" opacity="0.5"/>
        <circle cx="124" cy="114" r="3" fill="#ff9090" opacity="0.5"/>
      </g>
      <!-- Pingos de tinta saindo do pincel -->
      <circle cx="150" cy="220" r="4" fill="#ffd36b"/>
      <circle cx="64" cy="216" r="3" fill="#4a5a95"/>
      <circle cx="158" cy="234" r="3" fill="#c0392b"/>
    </svg>`
  },

  rosa: {
    nome: 'Rosa',
    cor: '#2e80d9',
    falas: {
      intro: [
        'Oi! Sou a Rosa 🧭',
        'Sou uma rosa-dos-ventos!',
        'Te ajudo a nunca se perder!',
        'Norte, Sul, Leste e Oeste comigo!',
        'Bora orientar o caminho?'
      ],
      boasvindas: [
        'Aponta o Norte, campeão!',
        'Olha a direção certinha!',
        'Bússola ligada, bora!',
        'Foca nos cardeais!'
      ],
      acerto: [
        'Rumo certo!',
        'Direção perfeita!',
        'Norte aponta pra você!',
        'Bússola alinhada!',
        'Virou navegador!',
        'Geografia aprovou!',
        'Orientador nato!',
        'Mapa feliz!'
      ],
      erro: [
        'Virou o mapa. Tenta de novo.',
        'Bússola balançou. Calma.',
        'Leste e oeste confundiram. Respira.',
        'A gente se acha na próxima.',
        'Erra agora pra acertar depois.'
      ],
      combo: [
        'Rota perfeita!',
        'Navegação sem erro!',
        'Rosa girando feliz!'
      ]
    },
    svg: `<svg class="mascote" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" aria-label="Rosa dos ventos">
      ${SIMBOLOS_BG}
      <ellipse cx="110" cy="248" rx="58" ry="7" fill="#2a3055" opacity="0.22"/>
      <!-- Circulo externo (base de ouro) -->
      <circle cx="110" cy="134" r="92" fill="#ffd36b" stroke="#b88247" stroke-width="3"/>
      <circle cx="110" cy="134" r="82" fill="#fff4dc"/>
      <circle cx="110" cy="134" r="78" fill="none" stroke="#b88247" stroke-width="1.5" stroke-dasharray="3,3"/>
      <!-- Letras cardeais -->
      <text x="103" y="62"  fill="#6b3a15" font-size="18" font-weight="800">N</text>
      <text x="104" y="218" fill="#6b3a15" font-size="18" font-weight="800">S</text>
      <text x="180" y="140" fill="#6b3a15" font-size="18" font-weight="800">L</text>
      <text x="32"  y="140" fill="#6b3a15" font-size="18" font-weight="800">O</text>
      <!-- Pontos diagonais -->
      <text x="148" y="82"  fill="#8b5a2b" font-size="11" font-weight="700">NE</text>
      <text x="148" y="198" fill="#8b5a2b" font-size="11" font-weight="700">SE</text>
      <text x="50"  y="82"  fill="#8b5a2b" font-size="11" font-weight="700">NO</text>
      <text x="52"  y="198" fill="#8b5a2b" font-size="11" font-weight="700">SO</text>
      <!-- Estrela rosa-dos-ventos (8 pontas) -->
      <g transform="translate(110,134)">
        <!-- Ponta Norte -->
        <polygon points="0,-70 8,-10 -8,-10" fill="#c0392b"/>
        <polygon points="0,-70 8,-10 0,-14" fill="#8b1a10"/>
        <!-- Ponta Sul -->
        <polygon points="0,70 -8,10 8,10" fill="#2e80d9"/>
        <polygon points="0,70 8,10 0,14" fill="#0a4a8a"/>
        <!-- Ponta Leste -->
        <polygon points="70,0 10,-8 10,8" fill="#4a8f5a"/>
        <polygon points="70,0 10,8 14,0" fill="#1e5a2a"/>
        <!-- Ponta Oeste -->
        <polygon points="-70,0 -10,-8 -10,8" fill="#ffaa2b"/>
        <polygon points="-70,0 -10,8 -14,0" fill="#b07010"/>
        <!-- Pontas menores (NE, SE, NO, SO) -->
        <polygon points="45,-45 8,-8 12,-12" fill="#e8c39e"/>
        <polygon points="45,45 12,12 8,8" fill="#e8c39e"/>
        <polygon points="-45,-45 -8,-8 -12,-12" fill="#e8c39e"/>
        <polygon points="-45,45 -12,12 -8,8" fill="#e8c39e"/>
      </g>
      <!-- Centro (circulo com carinha) -->
      <circle cx="110" cy="134" r="22" fill="#fff4dc" stroke="#b88247" stroke-width="2"/>
      <g class="olho-brilho">
        <ellipse cx="102" cy="130" rx="3.5" ry="4.5" fill="#fff"/>
        <ellipse cx="118" cy="130" rx="3.5" ry="4.5" fill="#fff"/>
        <circle cx="103" cy="131" r="2.5" fill="#2a4080"/>
        <circle cx="119" cy="131" r="2.5" fill="#2a4080"/>
        <circle cx="104" cy="130" r="0.9" fill="#fff"/>
        <circle cx="120" cy="130" r="0.9" fill="#fff"/>
      </g>
      <!-- Sobrancelha -->
      <path d="M97 124 Q102 120 107 124" stroke="#3a2010" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M114 124 Q119 120 124 124" stroke="#3a2010" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- Boca -->
      <path d="M104 142 Q110 147 117 142" stroke="#6a2424" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Bochecha -->
      <circle cx="95" cy="138" r="2.5" fill="#ff9090" opacity="0.5"/>
      <circle cx="125" cy="138" r="2.5" fill="#ff9090" opacity="0.5"/>
    </svg>`
  },

  sol: {
    nome: 'Sol',
    cor: '#ffa726',
    falas: {
      intro: [
        'Oi! Eu sou o Sol ☀️',
        'Nasço no leste, me ponho no oeste!',
        'Dou luz pra todo mundo.',
        'Rotação da Terra é minha especialidade.',
        'Vamos brilhar na aprendizagem?'
      ],
      boasvindas: [
        'Bora brilhar!',
        'Luz acesa, aí!',
        'Raio de acerto vindo!',
        'Sol ligado, foca!'
      ],
      acerto: [
        'Brilhou!',
        'Raio certeiro!',
        'Iluminou a resposta!',
        'Sol aprovou!',
        'Dia inteiro de acerto!',
        'Clarão de sabedoria!',
        'Super-solar!',
        'Radiante!'
      ],
      erro: [
        'Nublou um pouco. Tenta outra.',
        'Sol atrás da nuvem. Bora!',
        'Raio desviou. Próxima!',
        'Escureceu rápido, clareia.',
        'Sol também descansa.'
      ],
      combo: [
        'Manhã, tarde e noite de acerto!',
        'Sol a pino!',
        'Radiação de gênio!'
      ]
    },
    svg: `<svg class="mascote" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" aria-label="Sol cartoon">
      ${SIMBOLOS_BG}
      <ellipse cx="110" cy="248" rx="52" ry="6" fill="#b07010" opacity="0.3"/>
      <!-- Raios (triangulos ao redor) -->
      <g transform="translate(110,134)">
        <!-- 8 raios -->
        <polygon points="0,-98 10,-70 -10,-70" fill="#ffd36b" stroke="#b07010" stroke-width="1"/>
        <polygon points="0,98 10,70 -10,70" fill="#ffd36b" stroke="#b07010" stroke-width="1"/>
        <polygon points="98,0 70,10 70,-10" fill="#ffd36b" stroke="#b07010" stroke-width="1"/>
        <polygon points="-98,0 -70,10 -70,-10" fill="#ffd36b" stroke="#b07010" stroke-width="1"/>
        <polygon points="70,-70 50,-52 52,-50" fill="#ffc24d" stroke="#b07010" stroke-width="1"/>
        <polygon points="-70,-70 -50,-52 -52,-50" fill="#ffc24d" stroke="#b07010" stroke-width="1"/>
        <polygon points="70,70 50,52 52,50" fill="#ffc24d" stroke="#b07010" stroke-width="1"/>
        <polygon points="-70,70 -50,52 -52,50" fill="#ffc24d" stroke="#b07010" stroke-width="1"/>
      </g>
      <!-- Corpo do sol -->
      <circle cx="110" cy="134" r="62" fill="#ffd36b" stroke="#b07010" stroke-width="2.5"/>
      <circle cx="110" cy="134" r="58" fill="none" stroke="#ffa726" stroke-width="1" opacity="0.5"/>
      <!-- Brilho interno -->
      <ellipse cx="88" cy="110" rx="18" ry="10" fill="#fff4dc" opacity="0.5"/>
      <!-- Oculos escuros -->
      <g>
        <rect x="74" y="116" width="34" height="24" rx="6" fill="#1a1a1a"/>
        <rect x="112" y="116" width="34" height="24" rx="6" fill="#1a1a1a"/>
        <rect x="108" y="123" width="4" height="5" fill="#1a1a1a"/>
        <!-- Reflexos -->
        <rect x="78" y="120" width="14" height="6" rx="2" fill="#4a8fdc" opacity="0.7"/>
        <rect x="116" y="120" width="14" height="6" rx="2" fill="#4a8fdc" opacity="0.7"/>
        <rect x="80" y="122" width="4" height="2" fill="#fff" opacity="0.9"/>
        <rect x="118" y="122" width="4" height="2" fill="#fff" opacity="0.9"/>
        <!-- Hastes -->
        <line x1="74" y1="128" x2="64" y2="124" stroke="#1a1a1a" stroke-width="3"/>
        <line x1="146" y1="128" x2="156" y2="124" stroke="#1a1a1a" stroke-width="3"/>
      </g>
      <!-- Bochecha -->
      <circle cx="80" cy="150" r="7" fill="#ff9090" opacity="0.55"/>
      <circle cx="140" cy="150" r="7" fill="#ff9090" opacity="0.55"/>
      <!-- Boca sorrindo -->
      <path d="M90 158 Q110 176 130 158" stroke="#6a2424" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M92 160 Q110 172 128 160 L128 163 Q110 174 92 163 Z" fill="#8b3030"/>
      <!-- Dente -->
      <rect x="105" y="162" width="5" height="6" fill="#fff" stroke="#6a2424" stroke-width="0.8"/>
    </svg>`
  }
};

// ============== ESTADO GLOBAL DO MASCOTE ATIVO ==============
let _mascoteAtivoId = 'mami';
try {
  const salvo = localStorage.getItem('explora_mascote_ativo');
  if (salvo && MASCOTES[salvo]) _mascoteAtivoId = salvo;
} catch(e) {}

function getMascoteAtivo() { return MASCOTES[_mascoteAtivoId] || MASCOTES.mami; }
function getMascoteAtivoId() { return _mascoteAtivoId; }
function setMascoteAtivo(id) {
  if (!MASCOTES[id]) return;
  _mascoteAtivoId = id;
  try { localStorage.setItem('explora_mascote_ativo', id); } catch(e) {}
}

function falaAleatoria(tipo) {
  const m = getMascoteAtivo();
  const arr = (m.falas && m.falas[tipo]) || m.falas.intro || ['...'];
  return arr[Math.floor(Math.random() * arr.length)];
}
