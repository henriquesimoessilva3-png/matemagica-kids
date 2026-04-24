# HANDOFF — Cadastro de produto + Divulgação (Matemágica + EXPLORA)

> Este documento consolida tudo que o próximo chat (foco em **cadastro do produto** e **divulgação**) precisa saber sobre o Matemágica + EXPLORA. O chat atual (foco em dev/HTML) continua em paralelo.
>
> **Última atualização:** 24/04/2026 noite — integração EXPLORA como bônus incluso.

## 🎁 Novidade estratégica (decidida hoje)

**O EXPLORA (app de História + Geografia BNCC 1º-5º ano) agora vai de BÔNUS dentro do Matemágica.** Uma compra de R$17 libera os dois apps. Isso muda o pitch:

- **Antes:** "R$17 vitalício, app de matemática"
- **Agora:** "R$17 vitalício. Leva 2 apps: Matemágica (matemática) + EXPLORA (história e geografia). Um checkout só."

Valor percebido triplica sem custo de marketing extra. Diferenciação radical vs Matific, ANTON, Pandagógico — **ninguém no BR oferece mat + história + geografia com 1 compra vitalícia**.

### Novo ângulo de ad (inserir na rotação)
> "Seu filho precisa de mat, história E geografia no Fundamental 1. Em vez de 3 apps, 3 assinaturas, 3 logins — um só. R$17 vitalício. Da tabuada aos pontos cardeais."

---

## 1. O que é o Matemágica

App web (PWA) de matemática pra crianças do **1º ao 5º ano (BNCC)**, voltado pro **mercado BR**. Dor central: **vergonha/ansiedade matemática**, validada por pesquisa de mercado + fundamentação acadêmica (Jo Boaler — Mentalidades Matemáticas, Stanford).

**Slogan principal (LP, home, descrição):** *"A criança joga. A matemática fica."*
**Headline anti-Matific pra ads:** *"Mais jogo. Menos lição."*
**Descrição institucional (Hotmart / B2B):** *"BNCC virou jogo. 1º ao 5º ano."*

**Racional (baseado em reviews reais):** "brincando" está saturado entre concorrentes, "game" é anglicismo que afasta mãe 35-45 BR, "exercício" foi rejeitado em reviews ("temido exercício", "fica dando lição de casa"). **Jogo** é a palavra limpa em PT-BR. "A criança joga. A matemática fica." inverte a reclamação central sem prometer milagre.

**Público:** Mães e pais 30-45 com filhos 6-10 anos. Subpersona importante: professoras da rede pública/particular que querem material extra.

---

## 2. Status técnico

### Deploy
- **Produção:** https://matemagica-kids.netlify.app
- **Domínio custom:** https://matemagica.app.br (DNS em transição no registro.br hoje ~13h, ativo em 2-24h)
- **Repo GitHub:** https://github.com/henriquesimoessilva3-png/matemagica-kids (público)
- **CI automático:** push em `main` → deploy Netlify
- **Build image:** Ubuntu Noble 24.04

### Features já no ar
- **2 apps em 1 compra:** Matemágica (matemática) + EXPLORA (história e geografia), paywall unificado
- Tela inicial com mascote trupe (4 mascotes com falas reativas)
- Card destacado "🌍 EXPLORA — Bônus" no topo do Matemágica
- Jogos de matemática 1º a 5º ano (catálogo BNCC)
- Tabuada Mágica (Pokédex 1-10, modo Estudar + Treinar, macetes brasileiros do 9-nos-dedos etc)
- Dashboard dos Pais
- Editor de Provas + SOS Prova (detecta fraquezas e monta prova)
- Loja de itens premium com moedas (avatares, temas, bichinhos)
- PDFs imprimíveis (certificado, tabela 1-100, flashcards, pokédex A3)
- Modo Calma (respiração guiada 3×, **opcional** — nunca abre sozinho)
- Paywall R$17 vitalício (frontend completo, backend Netlify Functions v2)
- Sistema de licença: `/api/ativar` + `/api/webhook-hotmart` + email Resend

### Features pedagógicas novas (24/04)
- Frases de acerto reescritas (esforço, não inteligência) — baseadas em Boaler
- Metacognição do mascote (pensa em voz alta na 1ª vez de cada tipo de jogo)
- Dicas progressivas acolhedoras ao errar
- Reforço histórico ("você já acertou esse jogo X vezes")
- Banco de macetes brasileiros na tabuada

---

## 3. Preço e plataforma

### Escolha
**R$ 17,00 vitalício (pagamento único)** via **Hotmart**.

Justificativa:
- R$17 é ticket impulsivo (decisão em 30s, bom pra ads)
- Vitalício elimina churn e atrito mental de mensalidade
- Escolhi Hotmart (sobre Kiwify e Cakto) **pela marca** — público cauteloso reconhece "HOTMART*MATEMAGICA" na fatura, reduz chargeback
- Taxa: 9,9% + R$1 = R$14,32 líquido por venda

### Fluxo técnico implementado
1. Cliente clica banner "R$17" no app → checkout Hotmart
2. Paga (Pix/cartão/boleto)
3. Hotmart dispara `PURCHASE_APPROVED` → webhook `/api/webhook-hotmart`
4. Webhook gera chave `MM-XXXX-XXXX-XXXX-XXXX`, salva em Netlify Blobs, dispara Resend
5. Email chega com link `matemagica.app.br?ativar=MM-...`
6. Cliente clica → `/api/ativar` valida → localStorage → libera tudo
7. Bônus ativação: +500 moedas + badge "✨ Matemágico"

### O que falta você fazer (detalhado em `HOTMART_SETUP.md` do projeto)

**Passo 1 — Criar conta Hotmart**
- https://app.hotmart.com/signup
- CPF + dados bancários
- Perfil fiscal (NF emitida automático pela Hotmart)

**Passo 2 — Criar produto**
- Nome: "Matemágica Completo"
- Formato: Aplicativo
- Preço: R$ 17,00
- Acesso: Vitalício
- Garantia: 7 dias (mínimo por lei CDC)
- Categoria: Educação → Ensino Fundamental
- Descrição curta: "App de matemática BNCC pra 2º a 5º ano — desbloqueie tudo pra sempre"

**Passo 3 — Anotar e substituir URL do checkout**
Hotmart gera URL tipo `https://pay.hotmart.com/F12345678K`. Substituir em **3 lugares**:
- `jogos_shared.js` (linha ~14): `const CHECKOUT_URL = 'https://pay.hotmart.com/PREENCHER-AQUI';`
- `provas.html` (dentro do script do paywall standalone)
- `explora/explora_shared.js` (`CHECKOUT_URL_EXPLORA`)

**Passo 4 — Webhook**
No painel Hotmart → Ferramentas → Webhooks → Criar:
- URL: `https://matemagica.app.br/api/webhook-hotmart`
- Versão: 2.0.0
- Eventos: ✅ PURCHASE_APPROVED · ✅ PURCHASE_COMPLETE
- Token (HOTTOK): clicar "gerar" e copiar

**Passo 5 — Conta Resend (email automático)**
- https://resend.com (grátis 100 emails/dia, 3.000/mês)
- Adicionar domínio `matemagica.app.br` e seguir os 3 records DNS que eles dão
- Adicionar os records no Netlify DNS do domínio
- Criar API key, copiar

**Passo 6 — Env vars no Netlify**
Site → Environment variables → Add:
- `HOTMART_HOTTOK` = token do passo 4
- `RESEND_API_KEY` = key do passo 5
- `EMAIL_FROM` = `Matemágica <ola@matemagica.app.br>` (ou `onboarding@resend.dev` enquanto DNS não verifica)
- `BASE_URL` = `https://matemagica.app.br`

**Passo 7 — Push `main` pra publicar**
Netlify detecta e deploya automático.

---

## 4. Pesquisa de público (dores, desejos, objeções)

### Citações literais de reviews (validadas)

**DOR:**
- "minha turma entrou em depressão depois de uma rodada na arena" — Matific
- "não gosto de matemática mas minha escola me obriga" — Matific
- "esse app maravilhoso fica dando lição de casa" — Matific
- "personagens muito feios e orelhudos" — Matific
- "cobrança indevida de R$253" — Reclame Aqui Matific
- "o temido exercício de matemática" — copy Pandagógico

**DESEJO:**
- "meus filhos aprendem demais" — Khan Kids
- "muito bom para pessoas que têm dificuldade" — Matific
- "a narração do app é muito boa" — Khan Kids
- "acesso vitalício" — Pandagógico
- "R$9,90 uma vez só" — Rei da Matemática (**pagamento único vence assinatura**)

**OBJEÇÕES antecipadas:**
- "vai ser igual ao da escola" → responder "a criança abre sozinha, sem arena"
- "vão cobrar de novo" → responder "R$17 uma vez. Sem mensalidade"
- "é em inglês?" → responder "100% PT-BR BNCC"
- "escola já tem Matific" → responder "Matific é da escola, Matemágica é de casa"

**SATISFAÇÃO (buscar espelhar em UGC):**
- "ELE É MARAVILHOSO"
- "ama e pede pra fazer"
- "colorido na medida certa"

---

## 5. Mapa competitivo (BR, abril/2026)

### Concorrentes e preços

| Marca | Preço | Público | Risco | Nota |
|---|---|---|---|---|
| **Matific** | R$51-59,90/mês ou R$244,90/ano | Escolas+pais | ALTO | 4.6⭐ mas reviews citam ansiedade — **vítima perfeita do pitch anti-trauma** |
| **ANTON** | Plus R$28-54,90; Family R$72-182,90 | Multidisciplinar | ALTO | Não é grátis como parecia. 4.9⭐ |
| **Khan Academy Kids** | Grátis | 2-6 anos | Baixo | Deixa vácuo 7-10 anos |
| **Rei da Matemática** | R$9,90 único | Fund. II/adultos | Baixo | Pagamento único é referência |
| **Smile and Learn** | R$26,90/mês | 3-12 anos, 7 idiomas | Baixo | Fraco no BR (7 reviews) |
| **Kumon Connect** | R$200-400/mês | Premium | Baixo | Exige matrícula |
| **Papumba** | R$25,90/mês | 2-7 anos | Baixo | Idade menor |
| **PlayKids** | R$29,90/mês | Entretenimento | Baixo | Não é ensino |
| **Pandagógico** | R$8,90-10,90 por PDF | PDFs avulsos | Médio | Usa "temido exercício de mat" — copy validou nossa dor |

### 5 Meta Ads Brasil (busca "matematica")
| Marca | Formato | Preço | Foco |
|---|---|---|---|
| Turminha Alfa Kids | Kit PDF | R$1,99 | Alfab+contar |
| Clube do Professor | Kit PDF | R$20-40 | Religioso |
| ANTON | App | Grátis (teto baixo) | Multidisc |
| Atividades c/ Amor | PDF | R$9 | Tabela 100 (R$9!) |
| Pandagógico | PDFs | R$9,90 | Mat pura |

### Gaps estratégicos
1. **Matemática pura pra 7-10 anos em app BR**: vazio → Matemágica preenche
2. **Matific vulnerável**: reviews citam ansiedade literal, cobrança indevida Reclame Aqui
3. **Pagamento único vitalício** ganha do mental de assinatura (confirmado em Rei da Mat R$9,90)

---

## 6. Copy bank (validado)

### 6 Headlines pra testar em ad

1. **Anti-Matific:** "Seu filho usa Matific na escola — e odeia? A gente fez o contrário."
2. **Slogan oficial:** "A criança joga. A matemática fica."
3. **Anti-assinatura:** "R$17 uma vez só. Sem mensalidade, sem surpresa no cartão."
4. **Anti-escola:** "Na escola é obrigação. Em casa é Matemágica."
5. **Anti-infantilização:** "Da tabuada ao 5º ano — sem narração de robô."
6. **Combo-bônus:** "Em vez de 3 apps, 3 logins, 3 assinaturas — 1 compra vitalícia. Matemática, história e geografia. R$17."

### Vocabulário validado pra LP/ads/emails
- "Baseado em Mentalidades Matemáticas (Stanford)"
- "Mentalidade de crescimento"
- "Sem pressão, sem trauma"
- "Esforço > inteligência"
- "O app que entende que errar é estudar"
- "Pagamento único. Acesso vitalício."
- "100% PT-BR · BNCC"

### Copy dominante nos concorrentes (fórmula BR)
"Transforme X em Y" + "+N atividades BNCC" + prazo curto

---

## 6.1 Headline-bomba validada (usar como H1 da LP)

> "**Antes que a escola destrua a matemática pro seu filho.**"

Essa frase foi escrita literalmente por uma mãe no Reddit sobre filho de 5 anos. **Copy-gold sem modificação** — transferir direto pra LP e ad hero. Não tentar melhorar.

Suporte com a pergunta-gancho: "Como ensinar matemática antes do 1º ano sem criar trauma?"

---

## 6.2 Copy novo (pesquisa de threads, além do copy bank básico)

**Dores extras:**
- "eu ia para o banheiro chorar porque odiava tanto" (pessoa no 11º ano)
- "fui punido por descobrir sozinho. Ainda estou chateado 2 décadas depois"
- "se não memoriza tabuada, o resto vira bruxaria arbitrária"
- "meu filho está em lágrimas frequentemente com matemática"

**Objeções extras (antecipar):**
- "mat é talento genético" → "não existe criança ruim em mat, existe criança que ninguém ensinou do jeito dela"
- "já tem Khan grátis" → "Khan vai até 6 anos; Matemágica pega 1º-5º, onde nasce a vergonha"

**Gatilhos pra audiências Meta identificados:**
- Pais forçando criança de 4 anos aos prantos
- Pais de TDAH
- Pais vendo filho travar no 6º ano
- Pais frustrados com a escola (Matific especialmente)

---

## 6.3 Métodos e referências brasileiras a absorver

Pesquisa levantou 3 marcas/educadoras BR que dominam nichos específicos. Matemágica **não compete diretamente** — mas usa como prova social, referência de linguagem e potencial co-marketing.

### Gis com Giz
- **Quem:** professora BR, canal YouTube grande
- **Conteúdo validado:** tabuada comutativa explicada com analogia brasileira + divisão da chave
- **O que absorver:**
  - Vocabulário e analogias dos vídeos mais vistos (linguagem de mãe/professora de escola pública)
  - Método da "chave" na divisão (já mencionei no BRIEFING_DEV — virar feature)
  - Tom "sem enrolação"
- **Potencial co-marketing:** "O método que a Gis ensina — agora no seu bolso, 100 exercícios por dia."

### LumeOito
- **Quem:** referência PT-BR em **Tabela Pitagórica visual** (método italiano do 1800)
- **Conteúdo:** grade 10×10 colorida com padrões visuais (quadrados perfeitos na diagonal, simetria)
- **O que absorver:**
  - Tabela Pitagórica como artefato central do módulo Tabuada
  - Padrões visuais como insight ("olha que lindo: a diagonal são os quadrados!")
  - Já existe parcialmente no PDF Pokédex Tabuada — expandir pra formato interativo

### Clube do Pititico
- **Quem:** canal educativo BR, **1,8M views** em vídeo de tabuada + LIBRAS + música
- **Diferencial:** ensina tabuada cantando, com LIBRAS pra inclusão
- **O que absorver:**
  - Possibilidade de ter **versão com LIBRAS** (acessibilidade — diferencial enorme em pitch escolar B2B depois)
  - Música/jingle pra memorização involuntária
  - Incluir em roadmap: "canto mágico" pra cada tabuada (áudio opcional)

### Por que importam pro pitch
- **Autoridade:** citar "inspirado em métodos validados no Brasil — Tabela Pitagórica (LumeOito), analogias da Gis com Giz, inclusão do Pititico"
- **Linguagem:** testar ads com copy no tom dessas educadoras (mais caloroso que Matific robótico)
- **Parcerias futuras:** chat de divulgação pode avaliar DM pra elas pedindo review, afiliação ou indicação cruzada

---

## 6.4 Modelo de negócio "empreendedora mãe-nova"

Sinal de mercado: **Professora Duda, Atividades com Amor e similares** faturam bem vendendo PDFs educacionais BR em Meta Ads. Não são empresa — são uma pessoa + público fiel + LP simples.

### Estrutura típica delas (digna de imitar)

1. **Uma cara/pessoa na frente** — mãe-professora, Instagram pessoal, stories humanizados
2. **Ad casual gravado no celular** — "Oi mãe! Sou a Duda, professora há 15 anos, e hoje vou mostrar o material que minhas alunas não querem mais sair da mesa…"
3. **LP simples** — 1 página, 1 CTA, depoimentos de mães, screenshots da WhatsApp
4. **Ticket baixo de entrada** (R$9-29 PDF) → **upsell depois** (R$97-297 curso/mentoria)
5. **Stories diários** com bastidor
6. **Grupo Telegram/WhatsApp** pra comunidade

### O que Matemágica pode absorver

- **Persona frontal feminina** (ou o seu próprio rosto/nome) — mesmo sendo app, tem "dono que cuida". Oposto de Matific anônimo.
- **Ads estilo "oi mãe"** ao invés de estilo tech. Tom importa mais que produção.
- **Tripwire PDF R$9,90** (já planejado com Pokédex Tabuada Premium) — porta de entrada antes dos R$17 do app
- **Stories de bastidor:** "pesquisei 200 reviews de apps pra criar o Matemágica", "achei essa dor literal numa thread"
- **Grupo WhatsApp de early adopters:** primeiros 100 compradores ganham acesso a grupo com dicas extras + chance de sugerir features

### Ressalva

A Professora Duda já vende bem há 5 anos. Não tentar imitar tudo. Usar como **referência de tom e funil**, não como plano copiado.

---

## 7. Ângulos de posicionamento (escolher 1 por campanha)

1. **Especialista SÓ matemática** — contra ANTON multidisciplinar
2. **B2C direto pro pai** — contra Matific B2B escolar
3. **"A criança joga. A matemática fica."** (baseado em Boaler, com vocabulário PT-BR testado) — contra todos, diferenciador mais forte
4. **UX lúdica brasileira** — Pokédex, mascotes regionais, contra estrangeiros

**Recomendação pro lançamento:** angle #3 (Sem Vergonha) + proof #4 (mascotes BR) + oferta #2 (R$17 único).

---

## 8. Funil sugerido

### Mínimo viável (3 dias pra rodar)
1. **Ad Meta** (Instagram/FB) → headline anti-Matific ou anti-medo
2. **LP curta** (pode ser dentro do próprio matemagica.app.br ou página separada)
3. **Checkout Hotmart** (R$17)
4. **Email Resend automático** com link de ativação
5. **App libera tudo**

### Próximo nível (semana 2+)
- **Tripwire externo:** PDF Pokédex Tabuada por R$9,90 (grátis 1ª compra, reforça LP)
- **Upsell no pós-compra:** kit PDFs físicos extra
- **Email drip:** dicas Boaler semanais pros pais (retenção + evangelismo)
- **Programa de indicação:** R$5 de desconto pra cada amiga

---

## 9. Arquivos-chave do projeto

Local dir: `/Users/henriquesimoessilva/Meu Drive/arquivos pessoais/Novos Negocios/Matemágica/`

- `HOTMART_SETUP.md` — passo-a-passo técnico do webhook + Resend
- `netlify/functions/webhook-hotmart.mjs` — backend pagamento
- `netlify/functions/ativar.mjs` — validação de licença
- `jogos_shared.js` (topo, linha ~14): `CHECKOUT_URL` — PREENCHER com URL real da Hotmart
- `provas.html` (dentro de script): segundo lugar que tem `PREENCHER-AQUI`

---

## 10. Memória (já indexada)

No diretório `.claude/projects/.../memory/` há memórias consolidadas. Relevantes pro chat de vendas:
- `project_matemagica_paywall_hotmart.md` — arquitetura completa do paywall
- `project_matemagica_pesquisa_boaler_quora.md` — pedagogia + priorização
- `project_matemagica_competitivo_24abr.md` — mapa competitivo detalhado
- `project_matemagica_copy_bank_24abr.md` — citações literais, headlines
- `project_matemagica_threads_reddit_24abr.md` — Numberblocks, padrões gênio-decepciona
- `project_matemagica_threads2_24abr.md` — mãe real valida "antes que a escola destrua", spin-off ENEM

---

## 11. Primeira decisão do chat de vendas

**O que fazer primeiro?**

Minha recomendação (priorizada):
1. **Criar conta Hotmart + produto** (1h) — destrava tudo
2. **Substituir `CHECKOUT_URL` no código e fazer push** (5min)
3. **Conta Resend + DNS** (30min + espera 24h propagação)
4. **Webhook Hotmart apontando pra `/api/webhook-hotmart`** (5min)
5. **Env vars Netlify** (5min)
6. **Fazer 1 compra teste de R$17 com cartão próprio** — validar fluxo ponta-a-ponta
7. **Pedir reembolso na Hotmart pra zerar** (direito do consumidor nos 7 dias)

**Depois que tá funcionando:**
8. **Instalar Meta Pixel** no site (pra rastrear conversão)
9. **Escrever LP curta** (ou usar a home atual com mais peso de CTA)
10. **Criar 1ª campanha Meta Ads** com headline #2 (anti-medo) + R$30/dia
11. **Monitorar 7 dias** e iterar headline

**Budget recomendado pra validação:** R$300-500 em ads (10-15 vendas pagam).

---

## 12. Perguntas abertas pro chat de vendas

- Qual **email** usar como remetente? (precisa do domínio verificado no Resend)
- Usar **página de vendas da Hotmart** ou LP externa? (externa converte mais mas exige criar)
- **Afiliados** — ativar desde o dia 1 ou só depois de validar conversão orgânica? (recomendo depois)
- **Descontos de lançamento** — oferecer R$12 nos primeiros 48h pra criar urgência?
- **Programa early-bird** — 100 primeiros compradores ganham PDF extra?
- Usar **nome fantasia "Matemágica"** ou razão social pessoal na Hotmart? (Hotmart permite CPF mas NF melhor com CNPJ se tiver)
