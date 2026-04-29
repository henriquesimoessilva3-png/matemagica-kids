// =========================================================
// MASCOTES.JS — Trupe compartilhada (SVGs + falas reativas)
// Usado no index.html (seletor) e nos jogos (coach no canto)
// =========================================================

const SIMBOLOS_BG = `
  <g>
    <text class="sim sim-1" x="14"  y="38"  font-size="22">+</text>
    <text class="sim sim-2" x="192" y="34"  font-size="20">×</text>
    <text class="sim sim-3" x="8"   y="210" font-size="18">÷</text>
    <text class="sim sim-4" x="198" y="210" font-size="22">=</text>
    <text class="sim sim-5" x="24"  y="128" font-size="24">π</text>
    <text class="sim sim-6" x="192" y="128" font-size="22">√</text>
  </g>`;

const MASCOTES = {
  matemago: {
    nome: 'Matemago',
    cor: '#6b54d3',
    falas: {
      intro: [
        'Oi! Sou o Matemago ✨',
        'Bora fazer magia com números?',
        'Escolhe um ano aí embaixo! 👇',
        'Cada acerto vira moeda 🪙',
        'Tem loja, temas e bichinhos!',
        'Abracadabra matemática! 🎩'
      ],
      boasvindas: [
        'Vamos lá, essa é fácil!',
        'Abracadabra… e acertou?',
        'Prepara a varinha!',
        'Magia pura, foca aí!'
      ],
      acerto: [
        'Pura mágica!',
        'Abracadabra! Acertou!',
        'Varinha aprovou ✨',
        'Mágica das boas!',
        'Poderosa essa!',
        'Feitiço certeiro!',
        'Olha o Matemago orgulhoso!',
        'Persistiu forte!',
        'Não desistiu nessa!'
      ],
      erro: [
        'Calma, feitiço falhou. Tenta outro!',
        'Mago também erra. Respira.',
        'Quase! A magia está chegando.',
        'Ninguém nasce mago. Bora de novo.',
        'Errar faz parte do truque.'
      ],
      combo: [
        'Sequência mágica!',
        'Tá voando na vassoura!',
        'Isso é feitiçaria boa!'
      ]
    },
    svg: `<svg class="mascote" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" aria-label="Matemago">
      ${SIMBOLOS_BG}
      <ellipse cx="110" cy="246" rx="54" ry="6" fill="#6b54d3" opacity="0.18"/>
      <path d="M66 210 Q62 250 110 250 Q158 250 154 210 L150 182 Q110 172 70 182 Z" fill="#6b54d3"/>
      <path d="M70 184 Q110 174 150 184 L146 198 Q110 188 74 198 Z" fill="#ffd36b"/>
      <path d="M100 190 L110 250 L120 190 Z" fill="#ffd36b" opacity="0.6"/>
      <circle cx="110" cy="220" r="4" fill="#ffd36b"/>
      <circle cx="110" cy="232" r="3" fill="#ffd36b"/>
      <path d="M72 195 Q54 180 48 165" stroke="#6b54d3" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="48" cy="165" r="9" fill="#fcd9b6"/>
      <path d="M148 195 Q168 180 178 160" stroke="#6b54d3" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="178" cy="160" r="9" fill="#fcd9b6"/>
      <line x1="178" y1="160" x2="205" y2="108" stroke="#6a3919" stroke-width="4" stroke-linecap="round"/>
      <line x1="180" y1="158" x2="207" y2="106" stroke="#a87648" stroke-width="1.5" stroke-linecap="round"/>
      <g class="estrela-varinha">
        <polygon points="205,92 210,104 222,104 212,112 216,124 205,116 194,124 198,112 188,104 200,104" fill="#ffd36b" stroke="#ffaa2b" stroke-width="1.5" stroke-linejoin="round"/>
        <circle cx="205" cy="108" r="2.5" fill="#fff"/>
      </g>
      <circle cx="188" cy="88"  r="1.8" fill="#fff"/>
      <circle cx="222" cy="118" r="1.4" fill="#fff"/>
      <circle cx="195" cy="130" r="1.6" fill="#fff"/>
      <circle cx="110" cy="130" r="38" fill="#fcd9b6"/>
      <ellipse cx="72"  cy="132" rx="5" ry="8" fill="#fcd9b6"/>
      <ellipse cx="148" cy="132" rx="5" ry="8" fill="#fcd9b6"/>
      <circle cx="85"  cy="142" r="6" fill="#ff9fb8" opacity="0.55"/>
      <circle cx="135" cy="142" r="6" fill="#ff9fb8" opacity="0.55"/>
      <g class="olho-brilho">
        <ellipse cx="98"  cy="128" rx="6.5" ry="7.5" fill="#fff"/>
        <ellipse cx="122" cy="128" rx="6.5" ry="7.5" fill="#fff"/>
        <circle cx="99"  cy="130" r="4" fill="#2a4080"/>
        <circle cx="123" cy="130" r="4" fill="#2a4080"/>
        <circle cx="100" cy="128" r="1.4" fill="#fff"/>
        <circle cx="124" cy="128" r="1.4" fill="#fff"/>
      </g>
      <path d="M91 117 Q98 113 106 117" stroke="#4a3b8a" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M114 117 Q122 113 129 117" stroke="#4a3b8a" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M96 150 Q110 160 124 150" stroke="#6a2424" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <rect x="107" y="152" width="4" height="4" fill="#fff" stroke="#6a2424" stroke-width="0.8"/>
      <ellipse cx="110" cy="108" rx="52" ry="9" fill="#3a2c6b"/>
      <ellipse cx="110" cy="106" rx="50" ry="6" fill="#4a3b8a"/>
      <path d="M68 106 Q100 95 152 106 L128 40 Q120 25 110 30 Q100 35 96 48 Z" fill="#4a3b8a"/>
      <path d="M72 106 Q100 98 148 106 L140 88 Q110 92 80 88 Z" fill="#6b54d3"/>
      <path d="M72 106 Q100 98 148 106 L146 100 Q100 92 74 100 Z" fill="#ffd36b"/>
      <path d="M128 40 Q120 25 110 30 Q116 38 120 44 Z" fill="#6b54d3"/>
      <circle cx="116" cy="32" r="4.5" fill="#ffd36b"/>
      <text x="95"  y="82" fill="#ffd36b" font-size="13" font-weight="800">★</text>
      <text x="112" y="66" fill="#ffd36b" font-size="10" font-weight="800">★</text>
      <text x="86"  y="98" fill="#ffd36b" font-size="9"  font-weight="800">★</text>
    </svg>`
  },

  coruja: {
    nome: 'Coruja Sábia',
    cor: '#8b6448',
    falas: {
      intro: [
        'Olá! Sou a Coruja Sábia 🦉',
        'Vamos estudar matemática?',
        'Saber é poder! Escolhe um ano 👇',
        'Cada acerto conta muito 🪙',
        'Pratique todo dia um pouquinho!',
        'Hoot hoot! Bora? 📚'
      ],
      boasvindas: [
        'Leia com calma, uma vez só.',
        'Raciocínio é hábito.',
        'Foca: você consegue.',
        'Pensa primeiro, responde depois.'
      ],
      acerto: [
        'Resposta sábia!',
        'Raciocínio afiado!',
        'Hoot! Perfeito!',
        'Isso é estudo rendendo!',
        'Você leu com atenção!',
        'Prestou atenção mesmo!',
        'Foco total funcionou!',
        'Pensou com calma!',
        'Coruja aprova 🦉'
      ],
      erro: [
        'Sem pressa. Lê de novo.',
        'Errar é estudar.',
        'Respira. Vamos por partes.',
        'Que bom que tentou!',
        'Pensa mais um pouquinho.'
      ],
      combo: [
        'Sequência de sábio!',
        'Concentração total!',
        'Virou estudante top!'
      ]
    },
    svg: `<svg class="mascote" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" aria-label="Coruja Sábia">
      ${SIMBOLOS_BG}
      <ellipse cx="110" cy="246" rx="52" ry="6" fill="#6b54d3" opacity="0.18"/>
      <path d="M38 236 L182 236 Q188 240 182 244 L38 244 Q32 240 38 236 Z" fill="#8b5a2b"/>
      <path d="M38 236 L182 236 Q188 238 182 240 L38 240 Q32 238 38 236 Z" fill="#a07040"/>
      <circle cx="60" cy="240" r="1.5" fill="#6a4020"/>
      <circle cx="155" cy="240" r="1.5" fill="#6a4020"/>
      <ellipse cx="110" cy="175" rx="58" ry="65" fill="#a57c5f"/>
      <ellipse cx="110" cy="185" rx="38" ry="50" fill="#f5e6d0"/>
      <path d="M92 170 Q98 176 92 182" stroke="#d4b896" stroke-width="1.5" fill="none"/>
      <path d="M110 168 Q116 174 110 180" stroke="#d4b896" stroke-width="1.5" fill="none"/>
      <path d="M128 170 Q134 176 128 182" stroke="#d4b896" stroke-width="1.5" fill="none"/>
      <path d="M100 192 Q106 198 100 204" stroke="#d4b896" stroke-width="1.5" fill="none"/>
      <path d="M120 192 Q126 198 120 204" stroke="#d4b896" stroke-width="1.5" fill="none"/>
      <path d="M56 155 Q40 180 52 220 Q70 215 72 165 Z" fill="#8b6448"/>
      <path d="M60 170 Q55 192 62 210" stroke="#7a5a3a" stroke-width="1.5" fill="none"/>
      <path d="M164 155 Q180 180 168 220 Q150 215 148 165 Z" fill="#8b6448"/>
      <path d="M160 170 Q165 192 158 210" stroke="#7a5a3a" stroke-width="1.5" fill="none"/>
      <rect x="88" y="232" width="16" height="8" fill="#ffb347" stroke="#cc8820" stroke-width="1" rx="2"/>
      <rect x="116" y="232" width="16" height="8" fill="#ffb347" stroke="#cc8820" stroke-width="1" rx="2"/>
      <line x1="92" y1="240" x2="90" y2="246" stroke="#cc8820" stroke-width="1.5"/>
      <line x1="96" y1="240" x2="96" y2="246" stroke="#cc8820" stroke-width="1.5"/>
      <line x1="100" y1="240" x2="102" y2="246" stroke="#cc8820" stroke-width="1.5"/>
      <line x1="120" y1="240" x2="118" y2="246" stroke="#cc8820" stroke-width="1.5"/>
      <line x1="124" y1="240" x2="124" y2="246" stroke="#cc8820" stroke-width="1.5"/>
      <line x1="128" y1="240" x2="130" y2="246" stroke="#cc8820" stroke-width="1.5"/>
      <path d="M74 118 L80 92 L92 112 Z" fill="#8b6448"/>
      <path d="M146 118 L140 92 L128 112 Z" fill="#8b6448"/>
      <circle cx="88" cy="145" r="20" fill="#f5e6d0"/>
      <circle cx="132" cy="145" r="20" fill="#f5e6d0"/>
      <circle cx="88" cy="145" r="18" fill="#fff" stroke="#4a3b8a" stroke-width="2.5"/>
      <circle cx="132" cy="145" r="18" fill="#fff" stroke="#4a3b8a" stroke-width="2.5"/>
      <path d="M106 145 L114 145" stroke="#4a3b8a" stroke-width="3"/>
      <path d="M70 145 L62 143" stroke="#4a3b8a" stroke-width="2"/>
      <path d="M150 145 L158 143" stroke="#4a3b8a" stroke-width="2"/>
      <g class="olho-brilho">
        <circle cx="88" cy="148" r="8" fill="#2a4080"/>
        <circle cx="132" cy="148" r="8" fill="#2a4080"/>
        <circle cx="91" cy="144" r="3" fill="#fff"/>
        <circle cx="135" cy="144" r="3" fill="#fff"/>
      </g>
      <path d="M103 168 L110 182 L117 168 Z" fill="#ffb347" stroke="#cc8820" stroke-width="1.2"/>
      <line x1="110" y1="168" x2="110" y2="180" stroke="#cc8820" stroke-width="0.6"/>
      <rect x="62" y="98" width="96" height="8" fill="#2a1d5e" rx="1"/>
      <polygon points="55,100 165,100 110,82" fill="#3a2d6e"/>
      <polygon points="60,100 160,100 110,84" fill="#4a3b8a"/>
      <circle cx="110" cy="82" r="3" fill="#ffd36b"/>
      <path d="M110 82 Q150 98 155 108" stroke="#ffd36b" stroke-width="2" fill="none"/>
      <ellipse cx="156" cy="113" rx="5" ry="7" fill="#ffd36b"/>
      <line x1="153" y1="108" x2="158" y2="118" stroke="#cc9020" stroke-width="0.8"/>
      <line x1="158" y1="107" x2="155" y2="119" stroke="#cc9020" stroke-width="0.8"/>
      <rect x="85" y="195" width="50" height="34" fill="#6b54d3" rx="2"/>
      <rect x="87" y="197" width="22" height="30" fill="#fff" rx="1"/>
      <rect x="111" y="197" width="22" height="30" fill="#fff" rx="1"/>
      <line x1="110" y1="197" x2="110" y2="227" stroke="#4a3b8a" stroke-width="0.8"/>
      <text x="90" y="212" font-size="8" fill="#6b54d3" font-weight="800">1+1</text>
      <text x="92" y="222" font-size="7" fill="#4ab3a5" font-weight="800">=2</text>
      <text x="114" y="212" font-size="8" fill="#6b54d3" font-weight="800">2×3</text>
      <text x="116" y="222" font-size="7" fill="#4ab3a5" font-weight="800">=6</text>
    </svg>`
  },

  dragao: {
    nome: 'Dragãozinho',
    cor: '#b968e8',
    falas: {
      intro: [
        'Oi! Sou o Dragãozinho 🐲',
        'Vamos fazer matemágica?',
        'Escolhe um ano aí embaixo 👇',
        'Cada acerto me deixa mais forte!',
        'Tem loja e tema escuro! 🌙',
        'Rawrr! Matemática é fogo! 🔥'
      ],
      boasvindas: [
        'Rawrr! Dá-lhe fogo!',
        'Solta o dragão!',
        'Cuspindo fogo nessa!',
        'Prepara a fornalha!'
      ],
      acerto: [
        'RAWRR! Lutou por essa!',
        'Pegou fogo!',
        'Cuspindo acertos!',
        'Dragão feliz!',
        'Tá soltando labareda!',
        'Fogo total!',
        'Enfrentou e venceu!',
        'BÁUM!',
        'Voando alto!'
      ],
      erro: [
        'Errar é cair pra voar mais alto.',
        'Rawr… guarda o fogo, tenta de novo.',
        'Tá perto! Respira e voa!',
        'Dragão teimoso. Bora!',
        'Toca o fogo na próxima!'
      ],
      combo: [
        'Sequência imbatível!',
        'Dragão no modo turbo!',
        'Fogo em série!'
      ]
    },
    svg: `<svg class="mascote" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" aria-label="Dragãozinho">
      ${SIMBOLOS_BG}
      <ellipse cx="110" cy="246" rx="56" ry="7" fill="#6b54d3" opacity="0.18"/>
      <path d="M155 220 Q200 220 195 180 Q215 200 195 240 Q170 248 145 235 Z" fill="#9848c8"/>
      <path d="M195 180 L208 168 L200 184 Z" fill="#ffd36b" stroke="#cc9020" stroke-width="1"/>
      <path d="M55 180 Q32 175 42 220 Q62 215 68 185 Z" fill="#7a38a8"/>
      <path d="M55 188 Q55 205 55 215" stroke="#5a1888" stroke-width="1" fill="none"/>
      <path d="M62 190 Q60 205 58 215" stroke="#5a1888" stroke-width="1" fill="none"/>
      <path d="M165 180 Q188 175 178 220 Q158 215 152 185 Z" fill="#7a38a8"/>
      <path d="M165 188 Q165 205 165 215" stroke="#5a1888" stroke-width="1" fill="none"/>
      <path d="M158 190 Q160 205 162 215" stroke="#5a1888" stroke-width="1" fill="none"/>
      <ellipse cx="110" cy="200" rx="55" ry="45" fill="#b968e8"/>
      <ellipse cx="110" cy="205" rx="32" ry="30" fill="#e8c8f5"/>
      <path d="M80 188 Q85 193 80 198" stroke="#9848c8" stroke-width="1.2" fill="none"/>
      <path d="M140 188 Q135 193 140 198" stroke="#9848c8" stroke-width="1.2" fill="none"/>
      <path d="M82 214 Q87 219 82 224" stroke="#9848c8" stroke-width="1.2" fill="none"/>
      <path d="M138 214 Q133 219 138 224" stroke="#9848c8" stroke-width="1.2" fill="none"/>
      <path d="M80 162 L78 150 L86 162 Z" fill="#ffd36b" stroke="#cc9020" stroke-width="0.8"/>
      <path d="M95 157 L93 143 L103 157 Z" fill="#ffd36b" stroke="#cc9020" stroke-width="0.8"/>
      <path d="M115 157 L113 143 L123 157 Z" fill="#ffd36b" stroke="#cc9020" stroke-width="0.8"/>
      <path d="M135 162 L133 150 L142 162 Z" fill="#ffd36b" stroke="#cc9020" stroke-width="0.8"/>
      <circle cx="110" cy="128" r="42" fill="#b968e8"/>
      <ellipse cx="110" cy="148" rx="20" ry="15" fill="#e8c8f5"/>
      <path d="M84 95 L78 80 L92 92 Z" fill="#ffd36b" stroke="#cc9020" stroke-width="1"/>
      <path d="M136 95 L142 80 L128 92 Z" fill="#ffd36b" stroke="#cc9020" stroke-width="1"/>
      <circle cx="102" cy="147" r="1.6" fill="#6a2424"/>
      <circle cx="118" cy="147" r="1.6" fill="#6a2424"/>
      <circle cx="102" cy="140" r="1.2" fill="#fff" opacity="0.8"/>
      <circle cx="100" cy="134" r="1.5" fill="#fff" opacity="0.6"/>
      <circle cx="97"  cy="127" r="1.3" fill="#fff" opacity="0.4"/>
      <circle cx="78" cy="138" r="7" fill="#ff9fb8" opacity="0.55"/>
      <circle cx="142" cy="138" r="7" fill="#ff9fb8" opacity="0.55"/>
      <g class="olho-brilho">
        <ellipse cx="96" cy="118" rx="9" ry="10" fill="#fff"/>
        <ellipse cx="124" cy="118" rx="9" ry="10" fill="#fff"/>
        <circle cx="98" cy="121" r="5" fill="#2a4080"/>
        <circle cx="126" cy="121" r="5" fill="#2a4080"/>
        <circle cx="100" cy="118" r="2" fill="#fff"/>
        <circle cx="128" cy="118" r="2" fill="#fff"/>
      </g>
      <path d="M95 158 Q110 168 125 158" stroke="#6a2424" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M103 161 L104 167 L106 163 Z" fill="#fff" stroke="#6a2424" stroke-width="0.5"/>
      <path d="M116 161 L117 167 L118 163 Z" fill="#fff" stroke="#6a2424" stroke-width="0.5"/>
      <ellipse cx="75" cy="225" rx="11" ry="13" fill="#9848c8"/>
      <ellipse cx="145" cy="225" rx="11" ry="13" fill="#9848c8"/>
      <line x1="68" y1="233" x2="66" y2="240" stroke="#ffd36b" stroke-width="1.5"/>
      <line x1="73" y1="235" x2="72" y2="242" stroke="#ffd36b" stroke-width="1.5"/>
      <line x1="78" y1="234" x2="79" y2="241" stroke="#ffd36b" stroke-width="1.5"/>
      <line x1="142" y1="233" x2="140" y2="240" stroke="#ffd36b" stroke-width="1.5"/>
      <line x1="147" y1="235" x2="146" y2="242" stroke="#ffd36b" stroke-width="1.5"/>
      <line x1="152" y1="234" x2="153" y2="241" stroke="#ffd36b" stroke-width="1.5"/>
      <rect x="68" y="205" width="84" height="40" fill="#2a1d5e" rx="4"/>
      <rect x="71" y="208" width="78" height="34" fill="#1a3d2e" rx="2"/>
      <text x="86" y="232" fill="#fff" font-family="'Comic Sans MS', cursive" font-size="17" font-weight="800">2+2=4</text>
    </svg>`
  },

  robo: {
    nome: 'Robô Mati',
    cor: '#4a5a75',
    falas: {
      intro: [
        'BIP BOP! Sou o Robô Mati 🤖',
        'Cálculos em 3, 2, 1…',
        'Escolhe um ano e vamos! 👇',
        'Cada acerto: +1 crédito 🪙',
        'Processando diversão…',
        'Matemática é lógica pura!'
      ],
      boasvindas: [
        'Processando desafio…',
        'Modo cálculo: ativado.',
        'Bip bop! Concentra!',
        'Iniciando rotina!'
      ],
      acerto: [
        'BIP BOP! Correto!',
        'Cálculo: perfeito!',
        'Operação bem-sucedida!',
        'Sistema: descoberta +1!',
        'Dados confirmados!',
        'Tentativa: validada!',
        'Robô feliz: 100%',
        'Esforço calculado = vitória!',
        'Sincronizado!'
      ],
      erro: [
        'Erro processado. Reprocessando…',
        'Bip… tenta a próxima!',
        'Recalcular rota.',
        'Até eu erro, humano.',
        'Bug no sistema? Não, faz parte!'
      ],
      combo: [
        'Combo turbo!',
        'Turbo modo!',
        'Máquina perfeita!'
      ]
    },
    svg: `<svg class="mascote" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" aria-label="Robô Mati">
      ${SIMBOLOS_BG}
      <ellipse cx="110" cy="246" rx="54" ry="6" fill="#6b54d3" opacity="0.18"/>
      <rect x="78" y="225" width="22" height="20" fill="#6b7a95" rx="4" stroke="#4a5a75" stroke-width="1.5"/>
      <rect x="120" y="225" width="22" height="20" fill="#6b7a95" rx="4" stroke="#4a5a75" stroke-width="1.5"/>
      <circle cx="89" cy="225" r="5" fill="#8a9aaf" stroke="#4a5a75" stroke-width="1.2"/>
      <circle cx="131" cy="225" r="5" fill="#8a9aaf" stroke="#4a5a75" stroke-width="1.2"/>
      <rect x="58" y="148" width="104" height="82" fill="#c5d5e5" rx="12" stroke="#4a5a75" stroke-width="2.5"/>
      <rect x="64" y="154" width="30" height="8" fill="#e0e8f0" rx="3"/>
      <rect x="70" y="172" width="80" height="40" fill="#0a2a1a" rx="4"/>
      <rect x="73" y="175" width="74" height="34" fill="#1a5a3a" rx="2"/>
      <text x="82" y="200" font-family="'Courier New', monospace" font-size="18" fill="#4aff8a" font-weight="800">1+1=2</text>
      <circle cx="80" cy="220" r="3" fill="#ff4a4a" stroke="#cc2020" stroke-width="0.6"/>
      <circle cx="95" cy="220" r="3" fill="#ffd36b" stroke="#cc9020" stroke-width="0.6"/>
      <circle cx="110" cy="220" r="3" fill="#4aff8a" stroke="#20cc50" stroke-width="0.6"/>
      <circle cx="125" cy="220" r="3" fill="#4aacff" stroke="#2080cc" stroke-width="0.6"/>
      <circle cx="140" cy="220" r="3" fill="#c864ff" stroke="#8a28cc" stroke-width="0.6"/>
      <rect x="38" y="160" width="14" height="45" fill="#c5d5e5" stroke="#4a5a75" stroke-width="2" rx="5"/>
      <rect x="168" y="160" width="14" height="45" fill="#c5d5e5" stroke="#4a5a75" stroke-width="2" rx="5"/>
      <circle cx="45" cy="182" r="4" fill="#8a9aaf" stroke="#4a5a75" stroke-width="1"/>
      <circle cx="175" cy="182" r="4" fill="#8a9aaf" stroke="#4a5a75" stroke-width="1"/>
      <circle cx="45" cy="212" r="10" fill="#6b7a95" stroke="#4a5a75" stroke-width="1.5"/>
      <circle cx="175" cy="212" r="10" fill="#6b7a95" stroke="#4a5a75" stroke-width="1.5"/>
      <circle cx="38" cy="205" r="4" fill="#6b7a95" stroke="#4a5a75" stroke-width="1"/>
      <circle cx="182" cy="205" r="4" fill="#6b7a95" stroke="#4a5a75" stroke-width="1"/>
      <rect x="68" y="68" width="84" height="72" fill="#c5d5e5" rx="10" stroke="#4a5a75" stroke-width="2.5"/>
      <rect x="74" y="74" width="22" height="6" fill="#e0e8f0" rx="2"/>
      <circle cx="65" cy="100" r="5" fill="#8a9aaf" stroke="#4a5a75" stroke-width="1.5"/>
      <circle cx="155" cy="100" r="5" fill="#8a9aaf" stroke="#4a5a75" stroke-width="1.5"/>
      <line x1="61" y1="100" x2="69" y2="100" stroke="#4a5a75" stroke-width="1.2"/>
      <line x1="65" y1="96" x2="65" y2="104" stroke="#4a5a75" stroke-width="1.2"/>
      <line x1="151" y1="100" x2="159" y2="100" stroke="#4a5a75" stroke-width="1.2"/>
      <line x1="155" y1="96" x2="155" y2="104" stroke="#4a5a75" stroke-width="1.2"/>
      <line x1="110" y1="68" x2="110" y2="46" stroke="#4a5a75" stroke-width="3.5"/>
      <g class="estrela-varinha">
        <circle cx="110" cy="44" r="6" fill="#ffd36b" stroke="#cc9020" stroke-width="1.5"/>
        <circle cx="110" cy="44" r="2.5" fill="#fff"/>
      </g>
      <path d="M100 38 Q95 33 100 28" stroke="#ffd36b" stroke-width="1.5" fill="none" opacity="0.7"/>
      <path d="M120 38 Q125 33 120 28" stroke="#ffd36b" stroke-width="1.5" fill="none" opacity="0.7"/>
      <path d="M96 42 Q88 32 92 22" stroke="#ffd36b" stroke-width="1.2" fill="none" opacity="0.4"/>
      <path d="M124 42 Q132 32 128 22" stroke="#ffd36b" stroke-width="1.2" fill="none" opacity="0.4"/>
      <rect x="76" y="84" width="68" height="28" fill="#0a2a1a" rx="5"/>
      <g class="olho-brilho">
        <circle cx="95" cy="98" r="8" fill="#4aff8a"/>
        <circle cx="125" cy="98" r="8" fill="#4aff8a"/>
        <circle cx="96" cy="96" r="3" fill="#e8ffe8"/>
        <circle cx="126" cy="96" r="3" fill="#e8ffe8"/>
      </g>
      <rect x="92" y="120" width="36" height="10" fill="#4a5a75" rx="2" stroke="#2a3a55" stroke-width="1"/>
      <line x1="100" y1="120" x2="100" y2="130" stroke="#2a3a55" stroke-width="0.8"/>
      <line x1="108" y1="120" x2="108" y2="130" stroke="#2a3a55" stroke-width="0.8"/>
      <line x1="116" y1="120" x2="116" y2="130" stroke="#2a3a55" stroke-width="0.8"/>
      <line x1="124" y1="120" x2="124" y2="130" stroke="#2a3a55" stroke-width="0.8"/>
    </svg>`
  }
};

// ============== ESTADO GLOBAL DO MASCOTE ATIVO ==============
let _mascoteAtivoId = 'matemago';
try {
  const salvo = localStorage.getItem('matemagica_mascote_ativo');
  if (salvo && MASCOTES[salvo]) _mascoteAtivoId = salvo;
} catch(e) {}

function getMascoteAtivo() { return MASCOTES[_mascoteAtivoId] || MASCOTES.matemago; }
function getMascoteAtivoId() { return _mascoteAtivoId; }
function setMascoteAtivo(id) {
  if (!MASCOTES[id]) return;
  _mascoteAtivoId = id;
  try { localStorage.setItem('matemagica_mascote_ativo', id); } catch(e) {}
}

function falaAleatoria(tipo) {
  const m = getMascoteAtivo();
  const arr = (m.falas && m.falas[tipo]) || m.falas.intro || ['...'];
  return arr[Math.floor(Math.random() * arr.length)];
}
