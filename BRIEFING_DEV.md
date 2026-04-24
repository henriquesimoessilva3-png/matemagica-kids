# BRIEFING_DEV — Matemágica + EXPLORA (dev/HTML)

> Este documento orienta chats de **desenvolvimento do app**. Foco: código, features pedagógicas, UX, bugs. Para vendas/marketing → `HANDOFF_VENDAS.md`. Para estratégia longo prazo → `BRIEFING_APENDICE_24abr.md`.
>
> **Última atualização:** 24/04/2026 — integração EXPLORA como bônus inclusa.

## ⚠️ DECISÃO ARQUITETURAL — EXPLORA como bônus unificado

O app **EXPLORA** (História + Geografia BNCC, 5 anos, mesma trupe de mascotes) agora mora em `matemagica/explora/`. Marcas **separadas** (Matemágica e EXPLORA coexistem visualmente), mas:

- **Paywall unificado:** ambos leem `localStorage.matemagica_licenca_v1`. Uma compra libera os dois.
- **Deploy único:** Netlify serve `matemagica.app.br` + `matemagica.app.br/explora/`
- **Modelo grátis/premium espelhado:** 1º ano grátis (aquisição), 2º-5º premium (bônus incluso pra quem pagou R$17)
- **Gatilho de compra:** no EXPLORA, paywall aponta pro mesmo checkout do Matemágica
- **Descoberta:** card "🎁 EXPLORA — BÔNUS" destacado no index do Matemágica

Pasta `/Historiando/` (porta 8222) vira **dev sandbox isolado** — arquivos canônicos são os de `matemagica/explora/`. Sincronizar mudanças manualmente ou deprecar o sandbox.

---

## 0. Como retomar o dev

1. `preview_list` — o server "joguinho" (port 8111, serverId pode mudar) roda em `/Users/henriquesimoessilva/Meu Drive/arquivos pessoais/Novos Negocios/Matemágica/`
2. Se o service worker cachear versão antiga: unregister + `caches.delete()` + reload com `?nc=${Date.now()}`
3. Ao editar `jogos_shared.js` ou `mascotes.js`: bumpar `?v=N` em todos os HTMLs que carregam (índice abaixo)
4. Arquivos core Matemágica: `index.html`, `jogos_matematica_{1..5}ano.html`, `tabuada.html`, `provas.html`, `imprimir.html`, `dashboard.html`, `jogos_shared.js`, `mascotes.js`, `jogos_matematica_shared.css`
5. Arquivos core EXPLORA (em `explora/`): `index.html`, `ano_{1..5}.html`, `provas.html`, `explora_shared.js`, `mascotes.js` (próprios do EXPLORA, 4 mascotes Mami/Pix/Rosa/Sol), `historia_shared.css`

---

## 1. Arquitetura atual (referência rápida)

### JS
- `jogos_shared.js` (~1750 linhas) — STATE global, gamificação, loja, sons, mascote coach, dicas progressivas, modo calma, paywall, metacognição, macetes, reforço histórico, init.
- `mascotes.js` — 4 mascotes (Matemago, Coruja, Dragão, Robô) com falas `intro/boasvindas/acerto/erro/combo`.
- Páginas de ano têm seu próprio `<script>` com `STORAGE_KEY = 'jogosMatNano_v1'`, catálogo `CAPS`, `JOGOS`, `TUTORIAIS`, `DICAS` → chamam `initJogos()`.

### Storage
- `matemagica_user_v1` — moedas, comprados, avatar, tema, bichinho (global, cross-ano)
- `jogosMat{N}ano_v1` — estrelas, streak, recorde, porJogo, xp, badges (por ano)
- `jogosMat_provas_v1` — provas criadas
- `matemagica_tabuada_v1` — progresso Pokédex
- `matemagica_mascote_ativo` — mascote escolhido
- `matemagica_licenca_v1` — `{key, email, ativadaEm}` se pago

### Backend (Netlify Functions v2)
- `/api/ativar` (`netlify/functions/ativar.mjs`) — valida chave contra Blob store `licencas`
- `/api/webhook-hotmart` (`netlify/functions/webhook-hotmart.mjs`) — recebe Hotmart, gera UUID, salva Blob, triggera Resend

---

## 2. Features feitas 24/04 (já no código)

| Feature | Onde | Status |
|---|---|---|
| Trupe 4 mascotes + coach in-game | `mascotes.js`, `jogos_shared.js:1378+` | ✅ |
| Tabuada Pokédex + Estudar/Treinar | `tabuada.html` | ✅ |
| SOS Prova | `provas.html` | ✅ (premium) |
| Loja moedas, temas, bichinhos | `jogos_shared.js:501+` | ✅ |
| PDFs imprimíveis (4) | `imprimir.html` + 4 `pdf_*.html` | ✅ |
| Paywall R$17 | `jogos_shared.js:~140, ~440-500` + paywall standalone em `provas.html` | ✅ frontend, ⚠ falta `CHECKOUT_URL` real |
| Netlify Functions | `netlify/functions/*.mjs` | ✅ código pronto, ⚠ falta env vars |
| Frases de acerto Boaler (esforço) | `jogos_shared.js:FRASES_ACERTO`, `mascotes.js` acerto dos 4 | ✅ |
| Modo Calma opcional (respiração 3×) | `jogos_shared.js:~1570` (pré-existente) + botão no placar | ✅ |
| Dicas progressivas com fallback | `jogos_shared.js:DICAS_FALLBACK_SUAVES + feedbackErro` | ✅ |
| Pulso sutil botão respirar após 3 erros | `jogos_shared.js:sinalizarBotaoRespirar` | ✅ (não abre sozinho) |
| Metacognição do mascote na 1ª vez | `jogos_shared.js:METACOG_POR_TIPO, mostrarMetacognicao` | ✅ (11 tipos mapeados) |
| Banco de macetes brasileiros | `tabuada.html:MACETES_TABUADA` (10 macetes, 9 com truque dos dedos) | ✅ |
| Reforço histórico "você já acertou X" | `jogos_shared.js:mostrarReforcoHistorico` | ✅ |
| **EXPLORA integrado como bônus** | `explora/`, card no index.html, paywall unificado via `matemagica_licenca_v1` | ✅ |
| Paywall EXPLORA espelhado | `explora/explora_shared.js:abrirPaywallExplora, guardaAnoPremiumExplora` | ✅ anos 2-5 bloqueados, 1º grátis |

---

## 3. Fila de dev priorizada

### 🔴 Alta prioridade (ainda pendentes)

**1. Problemas contextualizados** — 1-2 dias
- Hoje perguntas são secas ("3 × 4 = ?"). Precisamos envolver em historinha.
- Abordagem recomendada: **novo jogo-protótipo** "📖 Problemas do dia a dia" por ano (não mexer nos existentes).
- Banco de histórias parametrizáveis: "{NOME} tem {A} caixas com {B} {OBJETO} em cada. Quantos {OBJETO} ao todo?"
- Nomes BR aleatórios, objetos BR (lápis, bolacha, figurinha, brigadeiro), contextos BR (mercado, escola, festa de aniversário).

**2. Cápsulas "Matemática no mundo real"** — 2 dias
- Banner/toast de 10-15s entre exercícios (após N acertos).
- Tópicos BR: futebol (Neymar corre 10km/jogo = volta 20× na escola), cozinha (receita pra 4 pra 10 = multiplica 2,5×), videogame (XP), compras (troco), animais (polvo = 8 braços = 2×4), família.
- Layout: toast inferior com emoji grande + 2 linhas de texto. Dispensável com X.
- Array de ~30 cápsulas, rotação aleatória.

**3. Jogo dos Números** (lungflook/Reddit) — 1 dia
- Criança escolhe um número (ex: 5). Turnos inventam formas: 4+1, 7-2, 5×1, √25.
- Minigame de lógica pura. Não precisa de BNCC direto — feature "livre" pra curiosidade.

**4. Problema do dia + notificação push** — 2 dias
- 1 problema por dia enviado via push notification.
- Requer VAPID + worker push. Marcar como "fase 2" se for complicar.
- MVP: banner na tela inicial "📅 Problema de hoje" sem notificação.

**5. Badge "tentei 3 vezes"** — 0,5 dia
- Já existe sistema de badges. Adicionar uma: após 3 tentativas na MESMA pergunta, ganha moedas e mensagem "Não desistiu! Isso é matemágico."
- Combate padrão "filho-gênio-decepciona" (celebra esforço, não inteligência).

### 🟡 Média prioridade (conteúdo novo — módulos inteiros)

**6. Módulo "Matemática da Cozinha"** — 3-4 dias
- Recalcular receitas (4 → 10 pessoas, 4 → 6, etc)
- Frações (½ xícara → ¾)
- Proporção, medidas, conversões mL/L, g/kg
- Receitas BR: brigadeiro, bolo de cenoura, pão de queijo, feijão
- UX: escolhe receita → muda nº pessoas → recalcula ingredientes

**7. Módulo "Beleza da Matemática"** — 3-4 dias
- Cápsulas visuais: Fibonacci nas flores/caracol, simetria em borboletas, fractais no brócolis romanesco
- Pura contemplação, sem pergunta
- 8-10 cápsulas de 30-60s
- Contra a percepção "matemática é dever"

**8. Jogo Cuisenaire** (barras coloridas) — 2 dias
- Herança Numberblocks/NCETM. Barras coloridas representando 1-10.
- Criança monta operações visualmente (3+4=7 → barra 3 + barra 4 = barra 7)
- Importante pra progressão tátil-visual-simbólica (threads validaram)

**9. Subitizing cards** — 1 dia
- Flash de pontos (1-10), criança reconhece sem contar
- Modo "rápido" — 2 segundos de exibição
- Importante pro senso numérico (Boaler)

**10. Metacognição "Me explica de novo" (ELI5)** — 2 dias
- Botão discreto em qualquer pergunta: "Me explica de novo?"
- Abre card com: metáfora concreta + visual + áudio curto
- Zero penalidade de tempo (fora de cronômetro)
- Derivado de 3 recomendações convergentes em threads (ChatGPT ELI5, Jason Gibson, Math Antics)

### 🟢 Baixa prioridade (mas importante — ML/inteligência)

**11. Dificuldade adaptativa (Vygotsky ZDP)** — 4-5 dias
- Motor que detecta "zona de desenvolvimento proximal"
- Sweet spot: 70-80% de acerto. Se acerta >80% N vezes, sobe dificuldade. Se <50% N vezes, volta e reforça.
- Aplica a cada jogo separadamente
- Armazena nível atual em `STATE.porJogo[id].nivel`

**12. Separar Conceito vs Treino em cada capítulo** — 3-4 dias (atravessado por todos os anos)
- Hoje só a **Tabuada Pokédex** tem modo Estudar/Treinar
- Aplicar pra: Frações, Divisão, Subtração com reserva, Dinheiro, Horas, Medidas, Área/Perímetro
- Padrão: cada jogo ganha um botão "📖 Entender antes" que abre visualização conceitual

**13. Pokédex também pra Soma/Subtração até 20** — 2 dias
- Espelho da Pokédex Tabuada, mas pras operações básicas até 20
- Visa primeira fase (1º-2º ano)

### 🪲 Bugs / polimento conhecido

- **Service worker agressivo** — cache gruda em dev. Tem documentação no memória. Em prod os headers `netlify.toml` resolvem.
- **Emoji 🔢** em Tabuada Mágica renderiza como retângulo roxo em alguns devices. Trocar ou adicionar fonte emoji.
- **Mascote coach em mobile <320px** pode sobrepor botões.
- **Tabuada cards 1 e 10** são triviais — considerar começar em ×2 como padrão.
- **CAKTO vs Hotmart fatura** — decidido Hotmart pra nome reconhecido. Código já usa Hotmart.

---

## 4. Mudanças arquiteturais em discussão

### Nada urgente. Só anote:

- **Pokédex genérica** — se repetir UX em Soma/Subtração/Divisão, vale abstrair o padrão em um componente `<PokedexGrid data={...}>`. Hoje tá tudo inline em `tabuada.html`.
- **Dicas/tutoriais centralizados** — hoje `TUTORIAIS` é definido em cada página. Se ficar complexo, mover pra `dicas.js` único.
- **Sistema de módulos plug-in** — se Matemática da Cozinha + Beleza + outros crescerem, padronizar interface de "módulo" (id, nome, ícone, iniciar, cleanup).

---

## 5. Features "nice to have" (não prioritárias)

- Narração/voz (TTS pra não-leitores)
- Manipuláveis visuais arrastáveis (blocos, moedas)
- Timer opcional
- Modo Passa-ou-Repassa (2 jogadores)
- Radar de fraquezas in-game (hoje só SOS Prova tem)
- Música de fundo opcional
- Tema sazonal (Natal, São João, Carnaval)
- Dashboard dos Pais — dica semanal rotativa Boaler (8-12 semanas de conselhos)

---

## 6. Regras de UX pedagógica (regras duras)

1. **Nunca punir visualmente o erro.** Ferramentas de regulação emocional (respirar, dica, resolução) ficam sempre opcionais, nunca aparecem automaticamente como reação a erro. Sinais sutis (pulso, brilho) podem sugerir que existem. [Ver `feedback_matemagica_nao_punir_erro.md`]

2. **Elogiar esforço, não inteligência.** Nada de "tá craque", "brilhante", "cabeça". Use "persistiu", "não desistiu", "tentou e conseguiu". [Boaler — Stanford Mentalidades Matemáticas]

3. **Errar tem valor explícito.** Frases de erro devem normalizar: "cada erro ensina", "é assim que aprende", "sem pressa — errar é como o cérebro treina."

4. **Contexto concreto antes de símbolo abstrato.** Seguir progressão tátil-visual-simbólica:
   - Objeto concreto animado (fruta, moeda)
   - Representação visual (quadriculado, barra Cuisenaire)
   - Símbolo abstrato (3+4=7)
   - Verificar que features novas não pulam direto pro passo 3.

5. **Criança abre sozinha.** Não exigir login, não ter "arena" competitiva estressante, não fazer sistema Matific-like.

---

## 7. Pendências de rollout (paywall)

1. Env vars no Netlify: `HOTMART_HOTTOK`, `RESEND_API_KEY`, `EMAIL_FROM`, `BASE_URL`
2. Substituir `CHECKOUT_URL` em **3 lugares** (grep `PREENCHER-AQUI`):
   - `jogos_shared.js:~14` (Matemágica)
   - `provas.html` (paywall standalone)
   - `explora/explora_shared.js` (paywall do EXPLORA)
3. Testar: fazer 1 compra R$17 com cartão próprio → validar que localStorage libera MATEMÁGICA **e** EXPLORA → reembolsar

Detalhes completos em `HOTMART_SETUP.md`.

---

## 8. Onde buscar mais contexto

- **Vendas/copy/posicionamento:** `HANDOFF_VENDAS.md`
- **Estratégia médio/longo prazo:** `BRIEFING_APENDICE_24abr.md`
- **Memórias Claude (system-wide):** `.claude/projects/.../memory/`
  - `project_matemagica_pesquisa_boaler_quora.md` — Boaler + Quora
  - `project_matemagica_threads_reddit_24abr.md` — Numberblocks, landmine tabuada, filho-gênio-decepciona
  - `project_matemagica_threads2_24abr.md` — "antes que a escola destrua", ELI5
  - `project_matemagica_numberblocks_24abr.md` — aliado narrativo
  - `feedback_matemagica_nao_punir_erro.md` — regra dura sobre erros
