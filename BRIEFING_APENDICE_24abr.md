# BRIEFING APÊNDICE 24/04/2026 — Ideias parqueadas / NÃO é foco agora

> **LEITURA IMPORTANTE:** Este documento guarda **o que explicitamente NÃO é prioridade no momento**. Tudo aqui é estratégia 3-12 meses ou refúgio de ideias que surgiram na pesquisa mas desviariam foco se executadas agora.
>
> **Foco atual (abr-mai/2026):** vender pacote Matemágica + EXPLORA (matemática, história, geografia) 1º-5º ano BNCC no BR, via Hotmart R$17 vitalício, checkout único libera ambos os apps, canal Meta Ads + LP própria. Tudo que não for isso fica aqui.
>
> **Quando consultar este doc:** mensalmente, ou quando alguma ideia no doc principal amadurecer pra virar ação. Se uma seção daqui virar prioridade, migra pro `HANDOFF_VENDAS.md` ou `BRIEFING_DEV.md`.

---

## 1. Spin-off "Matemágica Recomeço" (persona adulta) — 🅿️ PARQUEADO

> **NÃO é foco em 2026.** Persona adulta (ENEM tardio, concurseiro, pai recomeçando) apareceu na pesquisa como sinal real, mas atacar agora fragmentaria energia. Mantido aqui apenas pra não esquecer que esse vertical existe. **Reavaliar só depois de Matemágica infantil atingir 500 vendas/mês + NPS >8.**
>
> Única ação aceitável AGORA: se algum comprador do Matemágica infantil perguntar "tem pra mim também?", **capturar o email em uma lista simples** pra pré-venda futura. Nada além disso.

### O sinal
Thread Reddit PT-BR com mãe comentando **filho que corrigia álgebra aos 4 anos, hoje 25 anos com emprego ruim**, porque "nunca aprendeu a estudar". Citação literal de outra pessoa:

> "Extremamente perseverante, disposta a me esforçar, preciso do básico básico à prova de idiota."

Estudante ENEM tardio, vestibulinho, exatas na meia-idade, concurso público. Audiência real, mal atendida.

### Concorrência da vertical adulta
- **Rei da Matemática** (R$9,90 único) — fora do escopo infantil
- **Khan Academy** (grátis) — domina por falta de concorrente BR
- **MathTutorDVD / Jason Gibson** (EN) — referência ausente em BR
- **MathAcademy.com** (pago, adaptativo, EN)

### Tese do spin-off
Produto separado: **Matemágica Recomeço**, mesmo motor pedagógico (Boaler, acolhimento do erro, esforço), escopo 6º ano → ENEM / vestibulinho / concurso. Preço: R$27-37 vitalício ou R$9,90/mês.

### Por que é potente
- **Transferência de conceito**: "Se o Matemágica cura o trauma matemático do seu filho, o Recomeço cura o seu também"
- **Upsell natural**: mãe compra pro filho, descobre que ela mesma quer
- **Mesmo motor**, mesmo branding, audiência 100% diferente (evita canibalização)

### Decisão
**Não construir agora.** Validar Matemágica infantil primeiro (3-6 meses). Se atingir 500 vendas/mês + NPS >8, considerar spin-off.

**Mas:** desde já, capturar emails de "pais que compram pro filho mas perguntam se tem pra eles" → base inicial de pré-venda do Recomeço.

---

## 2. Pesquisa pedagógica profunda (Jo Boaler / youcubed.org)

Estanford tem **youcubed.org** como hub da Boaler — tarefas abertas, pesquisas, vídeos de 1-5min pra professores/pais.

### O que virou briefing acionável (dev)
- Elogiar esforço, não inteligência ✅ implementado
- Dicas progressivas acolhedoras ✅ implementado
- Metacognição do mascote ✅ implementado
- Dashboard — dica semanal Boaler 🟡 pendente

### O que ainda não virou (oportunidades)
- **Tarefas "low floor, high ceiling"** — problema que criança de 6 anos começa e de 12 continua descobrindo. Ex: "quantos retângulos cabem em um quadrado 10×10?"
- **Visual math** — Boaler é radical sobre visualização antes de símbolo. Matemágica ainda pula direto pro símbolo em vários jogos.
- **Número do dia** — ritual Boaler: todo dia, um número central, turma inventa fatos sobre ele.
- **Número Talks** — conversação matemática curta, sem papel, em grupo. Adaptar pra formato pai-filho em casa.
- **"You cubed summer camp"** — material aberto, PDF livre. Matéria-prima pro e-book lead magnet.

### Ação recomendada
Criar **`PESQUISA_BOALER.md`** no projeto consolidando **10 princípios acionáveis** do Youcubed pra features futuras. Quando? Quando priorizar o módulo "Beleza da Matemática" ou a dificuldade adaptativa. Não agora.

---

## 3. Ferramentas pedagógicas internacionais de referência

Threads mencionaram 3 ferramentas físicas/pedagógicas que **Matemágica não tem e não menciona**. Valem como inspiração de features e como vocabulário de autoridade.

### Numicon
- **O que é:** sistema britânico de placas coloridas com furos, 1-10, cada número visualmente distinto
- **Valor:** senso numérico + padrões. Criança vê 7 como "6 + 1 = um a menos que 8"
- **Adaptação digital:** minigame de encaixar placas Numicon virtuais pra completar alvos. Meta: reconhecer número por padrão, não por contagem.

### Rekenrek (Ábaco holandês)
- **O que é:** 2 fileiras de 10 contas deslizáveis, vermelho+branco em cada
- **Valor:** facilita cálculo até 20 visualmente. "7 + 8 = 15" → mostra 7 vermelhas + 8 brancas em posições estratégicas
- **Adaptação digital:** manipulável arrastável, criança resolve contas movendo contas. Módulo dedicado "Ábaco Mágico".

### Singapore Math (Modelo de barras)
- **O que é:** abordagem Singapura de representar problemas com barras proporcionais
- **Valor:** bridge entre concreto e algébrico. Funciona até em equações do 6º ano.
- **Adaptação digital:** renderizar barras automaticamente quando criança erra problema verbal ("Ana tem 3× mais que Beto..."). Requer NLP leve.

### Cuisenaire (já está no radar via Numberblocks)
- **O que é:** barras de madeira coloridas 1-10, cada comprimento = número
- **Valor:** base pedagógica britânica/francesa. NCETM endossa.
- **Adaptação digital:** já rascunhado em `BRIEFING_DEV.md` como jogo futuro.

### Posicionamento
"Matemágica combina o melhor do Cuisenaire (base britânica), Numicon (padrões visuais), Singapore Math (modelo de barras) e macetes da rua brasileira."

---

## 4. Parcerias e influencers (roadmap 6 meses)

### Tier 1 — Educadoras BR já mapeadas
| Nome | Canal | Audiência | Abordagem |
|---|---|---|---|
| Gis com Giz | YouTube + Insta | Grande | DM amigável pedindo review honesto. Oferecer acesso premium grátis pra usar em aula. |
| LumeOito | Instagram | Médio | Proposta de co-criação de conteúdo sobre Tabela Pitagórica. |
| Clube do Pititico | YouTube | 1,8M views em vídeo de tabuada | Acessibilidade LIBRAS: propor integração ou vídeo co-branded. |
| Professora Duda | Insta + LP | Grande em kits PDF | Afiliação com comissão 30% (Hotmart permite). |

### Tier 2 — Influencers mãe-digital
- Influenciadoras maternas com 50-500k seguidores, público-alvo 30-45 com filhos 6-10. Mapear via Meta Ad Library por quem já anuncia produto infantil.
- Modelo: seed de acesso grátis + review honesto, sem script. Se gostar, afiliação.

### Tier 3 — Escolas e professoras
- Depois de validar B2C, abrir piloto B2B: **licença escolar por turma** (R$990/ano por turma de 30).
- Quem vende: professor dentro da escola, não a escola inteira. Produto: ferramenta de casa que a professora pode indicar.

### Tier 4 — Co-marketing cruzado
- Numberblocks Brasil (YouTube 4,28M) — propor "e depois do Numberblocks? Matemágica" como sugestão de comentário fixo em vídeos deles (não pede nada, só sugere)
- Apps complementares (Khan Kids grátis 2-6 anos) — co-mencionar mutuamente sem briga direta

### Ação imediata
**Nenhuma agora.** Tipar lista, deixar cozinhar. Abordagem só depois de 30 vendas orgânicas validando produto.

---

## 5. Persona adulta expandida (🅿️ PARQUEADO — quando for hora)

> Mesma parqueação da seção 1. Detalhamento abaixo é **preparação pra futuro**, não pra agora.

### Perfil
- **Quem:** 22-45 anos, concurseiros, estudantes ENEM tardios, pais que querem acompanhar filho (mas sofrem antes), pessoas em requalificação profissional que descobrem que precisam de mat (ex: migrar pra programação)
- **Dor:** "eu era bom em tudo, menos em matemática. Agora preciso e não sei por onde começar."
- **Barreira:** vergonha de "começar do zero aos 30". Fundamental o tom acolhedor.

### Diferenciação de produto
- Mesmo motor Matemágica, com estética mais neutra (sem mascote infantil — ou com mascote opcionalmente "adulto")
- Trilha começa com "matemática básica básica" (operações, frações, decimais) antes de álgebra, geometria, funções
- BNCC fundamental II + médio
- Integração ENEM (banco de questões de ENEM resolvidas com metodologia Boaler)

### Preço
- R$37 vitalício ou R$9,90/mês (mais caro que infantil porque adulto paga por si)
- Desconto 50% pra quem já comprou o infantil (upsell cruzado)

### Timing
Construir depois de Matemágica infantil atingir 1.000 vendas/mês. Provavelmente **Q4 2026 ou Q1 2027**.

---

## 6. Roadmap consolidado 6 meses (abril 2026 → outubro 2026)

### Abril–Maio (validação — mês 1-2)
- ✅ App pronto, deploy no ar
- ✅ Paywall codado
- 🔴 **Ativar Hotmart + Resend + ads Meta R$500/mês**
- 🔴 **LP variante "antes que a escola destrua"**
- 🔴 **E-book lead magnet** ("Como não destruir a matemática do seu filho")
- Meta: 30 vendas orgânicas + 20 via ad

### Junho (refinar — mês 3)
- Corrigir falhas identificadas nas primeiras 50 vendas
- Implementar features da fila alta (problemas contextualizados, cápsulas mundo real)
- Adicionar módulo Matemática da Cozinha (diferenciador forte)
- Abrir DM com 2-3 educadoras tier 1
- Meta: 100 vendas/mês

### Julho–Agosto (escalar — meses 4-5)
- Parceria afiliada com 1-2 educadoras BR
- Expandir ad spend pra R$1.500/mês
- Testar pacote B2B piloto (1 escola amiga, R$990/ano/turma)
- Criar grupo WhatsApp early adopters
- Implementar dificuldade adaptativa (Vygotsky ZDP)
- Meta: 250 vendas/mês

### Setembro–Outubro (posicionar — meses 6-7)
- Lançar módulo "Beleza da Matemática" (marketing viral potencial — conteúdo compartilhável)
- Iniciar co-marketing Numberblocks ("e depois…")
- Começar roadmap do spin-off Recomeço (pesquisa, validação com early adopters)
- Meta: 500 vendas/mês + 3 escolas B2B

### Métricas-chave a acompanhar
- CAC (Custo de Aquisição via ads) — meta <R$7 por venda
- LTV (apenas 1 compra → R$14,32 líquido, sem upsell ainda)
- NPS mensal
- Taxa de ativação pós-compra (% que clica no link do email)
- Dias médios de uso na primeira semana

---

## 7. Riscos estratégicos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Hotmart bloquear conta por algum motivo | Baixa | Alto | Backup: Kiwify criado em paralelo após primeiros 50 pedidos |
| Matific processar por uso de reviews na copy | Baixa | Médio | Usar paráfrase sempre, nunca print literal (já decidido) |
| ANTON baixar preço pra grátis total BR | Média | Alto | Diferencial Boaler + vitalício > grátis ameaçado (apps grátis decepcionam) |
| Chargeback alto no Hotmart | Média | Alto | Garantia 7 dias + email pós-compra com clareza total sobre "Hotmart*Matemagica" |
| Saturação Meta Ads no nicho | Média | Médio | Diversificar canais: TikTok orgânico + YouTube shorts + LinkedIn (pros pais executivos) |
| Dependência de 1 pessoa (eu) pra suporte | Alta | Alto | SOP documentado + bot de FAQ no WhatsApp a partir de 100 vendas/mês |

---

## 8. Perguntas abertas que valem reflexão (não urgentes)

1. **Branding:** Matemágica deveria ter rosto/dono público ou manter marca anônima-produto?
2. **B2B timing:** abordar escolas antes ou depois de validar B2C por 3 meses?
3. **Conteúdo religioso:** ter variante com problemas bíblicos (como Clube do Professor) pra captura no nicho evangélico BR? Separado ou opcional?
4. **App nativo:** PWA serve por agora, mas app na Play Store tem ranking orgânico. Timing pra investir?
5. **Expansão LATAM:** PT-BR primeiro, mas Argentina/Chile têm PT parecido e menos concorrência — ano 2?
6. **Modelo freemium vs tripwire:** oferecer plano "eterno grátis com limite de 10 exercícios/dia" ou manter 1º ano grátis + paywall 2º-5º?
7. **IA generativa:** usar OpenAI/Claude API pra gerar problemas contextualizados infinitos por perfil? Custo de R$0,01 por problema = viável.

---

## 9. Links e referências externas

- **youcubed.org** — Boaler, Stanford (pesquisa e tarefas abertas)
- **Numberblocks** — YouTube BR 4,28M
- **nrich.maths.org** — Cambridge, tarefas investigativas
- **nctm.org** — NCTM USA (diretrizes curriculares)
- **ncetm.org.uk** — NCETM UK (mastery approach)
- **reclameaqui.com.br** — monitorar reviews Matific e similares (inspira copy)

---

## 10. Como este documento evolui

- **Adicionar** livremente ao fim de seções
- **Mover pra briefing operacional** quando uma idéia amadurece
- **Arquivar** (marcar como "descartada") quando explicitamente descartada — mas manter histórico
- **Nunca apagar** sem marcar razão e data
