# Contexto do Projeto — Transcrição de Registros de Imóveis 1890-1976

**Última atualização:** 2026-05-12
**Branch:** `claude/document-transcription-analysis-aMGt6`
**Repo:** `henriquesimoessilva3-png/matemagica-kids` (será migrado pra repo próprio do cartório)

> Cole este arquivo como primeira mensagem ao abrir um novo chat para continuar o trabalho sem perda de contexto.

---

## 1. Visão geral

**Cliente:** Cartório de Registro de Imóveis (Comarca de Ferros, MG).

**Objetivo:** transcrever **80-100 mil imagens** referentes a **~23 mil registros** manuscritos cursivos cobrindo de **1890 a 1976** (~90 anos), em português antigo com múltiplas reformas ortográficas e múltiplos escrivães. Cada registro pode ocupar 1-4 imagens (faces de Aquisições, Transmissões e continuações).

**Estado:** proof-of-concept funcional com 14 PDFs (5 registros) transcritos manualmente em profundidade, mais uma interface web local de revisão pronta para escalar via Claude API (vision).

**Arquitetura escolhida:** Local primeiro (testes/calibração) → migração para web hospedada (cartório).

---

## 2. Decisões já tomadas

### Princípios de transcrição
- **Espelhar o livro:** preservar TODA a grafia original (commum, districto, municipio, corego, transcricoes). Não modernizar. Se o escrivão errou, manter o erro.
- **Não inventar letras:** usar `[?]` para letras ausentes; `[ilegivel]` para palavras totalmente ilegíveis; `[a/b]` para duas hipóteses; `<span class="incerto" title="motivo">palavra</span>` para leitura provável mas duvidosa.
- **Calibrar por documento:** caligrafia muda entre escrivães e décadas; não assumir consistência entre livros.
- **Validar contexto histórico:** topônimos, empresas e termos são validados contra o glossário e a época.

### Workflow human-in-the-loop
1. Imagem entra na fila.
2. API do Claude (vision) faz **double-pass** (2 transcrições independentes).
3. Divergências entre passes + incertezas marcadas pelo modelo viram **dúvidas**.
4. Revisor humano resolve cada dúvida ponto-a-ponto (escolhe leitura A, B, ou digita).
5. Só após **100% das dúvidas resolvidas** o documento fica "aprovado".
6. Documento aprovado vai para o output final (HTML + JSON + imagem) com registro de auditoria (quem aprovou, quando).

### Arquitetura técnica
- **Fase 1 (agora, local):** arquivo único `revisao.html` rodando em `file://` no navegador. Estado em IndexedDB. API key em localStorage.
- **Fase 2 (produção web, depois):**
  - Frontend estático (Cloudflare Pages / Vercel — free)
  - Backend serverless (Cloudflare Workers / Vercel Functions) que esconde a API key
  - Imagens em **Cloudflare R2 ou AWS S3** (~US$ 15/mês para 10GB+)
  - Estado em **Postgres** (Neon ou Supabase, free tier)
  - Login simples para funcionário do cartório
  - Audit log completo
- **Custo estimado:** ~US$ 2.000-5.000 (uma vez) para processar os 100k imagens com double-pass usando Sonnet. Infra mensal ~US$ 20-50.

### O que NÃO usar
- Git para armazenamento de imagens em produção (não escala para 10GB+, fica lento; ok pra código e metadados pequenos)
- HTML estático com tudo embutido em produção (API key vazaria)

---

## 3. Estrutura do projeto

Tudo dentro de `documentos_cartorio/` no repositório.

```
documentos_cartorio/
├── CONTEXTO_PROJETO.md           ← este arquivo
├── INSTRUCOES_TRANSCRICAO.md     ← pipeline base (do prompt original do usuário)
├── glossario.md                  ← REFERÊNCIA CENTRAL: toponímia, pessoas, ortografia, termos
│
├── pdfs/                         ← entrada: 14 PDFs do POC (registros 9007, 8539, 8552, 8555, 8571)
├── imagens/                      ← cache: extrações + grids + zooms por documento
├── html/                         ← saídas legíveis (1 HTML por página + index.html consolidado + _style.css)
├── notas/                        ← saídas estruturadas (JSON por documento e por registro consolidado)
│
├── automacao/                    ← pipeline em escala via API (CLI Python)
│   ├── batch_transcribe.py       ← orquestrador com checkpoint, resume, double-pass opcional
│   └── README.md                 ← uso e custos
│
├── revisao/                      ← INTERFACE DE REVISÃO (PROTÓTIPO LOCAL)
│   ├── revisao.html              ← UI completa em 1 arquivo (~42KB, 1067 linhas)
│   └── README.md                 ← como rodar + roadmap pra produção web
│
└── _pipeline*.py, _zooms*.py, _overviews.py, _template.py    ← scripts auxiliares usados na fase manual
```

### Arquivos críticos (ler primeiro num novo chat)
1. `documentos_cartorio/glossario.md` — convenções, toponímia confirmada, pessoas, ortografia pré-reforma
2. `documentos_cartorio/INSTRUCOES_TRANSCRICAO.md` — pipeline original do prompt do cliente
3. `documentos_cartorio/revisao/revisao.html` — UI de revisão pronta
4. `documentos_cartorio/revisao/README.md` — como usar a UI + roadmap web
5. `documentos_cartorio/automacao/batch_transcribe.py` — automação CLI (caso prefira sem UI)
6. `documentos_cartorio/html/index.html` — visualização dos 14 docs já transcritos (proof of quality)

---

## 4. Os 14 PDFs já transcritos (ground truth)

5 registros do Livro de Registro de Imóveis da Comarca de Ferros, 1949-1950.

| Registro | Páginas | Data | Lugar | Adquirente | Valor | Área |
|---|---|---|---|---|---|---|
| **9007** | 2 | 17/01/1950 | Corego do Entre Folhas (Mesquita) | Cia. Siderúrgica Belgo-Mineira | Cr$ 27.270 | 54,99 ha |
| **8539** | 4 | 17/01/1949 | Cidade "Passagem" | José Pedro Celestino (fazendeiro) | Cr$ 95.000 | 151,25 ha |
| **8552** | 4 | 25/02/1949 | Cidade "Tabôas" | Maria Augusta + João de Pita Lage | Cr$ 5.884,79 | 17,65 ha (fração de 48,11) |
| **8555** | 2 | 04/03/1949 | Cidade "Tabôas" | Jacy de Carvalho Lage | Cr$ 25.000 | 17,65 ha |
| **8571** | 2 | 23/03/1949 | "Fernandes" (S. José de Cubas) | Odila Fernandes Madeira (herdeira) | Cr$ 4.084,77 | ~11 ha (91 litros) |

**Achados-chave:**
- Família **Lage** domina a região (adquirentes, transmitentes, confrontantes E o escrivão "Eemar Lage Santos")
- Belgo-Mineira só aparece em 1 dos 5 registros — predominam fazendeiros locais
- Topônimo **"Ganafas"** confirmado (NÃO "Garrafas") via correlato em 9007_2
- Estrutura de registro: face **Aquisições** + face **Transmissões** + possíveis continuações

Use esses 14 como benchmark contra qualquer transcrição automática nova.

---

## 5. Estado atual da `revisao.html`

**Status:** funcional, testado em sintaxe, **não testado end-to-end com API real**.

**Recursos implementados:**
- Drag-and-drop de imagens ou PDFs (PDFs com múltiplas páginas separados via pdf.js)
- Campo de API key + nome de revisor (persistidos em localStorage)
- Seletor de modelo (Sonnet 4.6 / Opus 4.7 / Haiku 4.5)
- Auto-processamento da fila (toggle)
- Double-pass automático com comparação de campos estruturados e lista de confrontantes
- Renderização do HTML com dúvidas em destaque amarelo, clicáveis
- Painel lateral de dúvidas com botões "aceitar leitura A / B / digitar outra"
- Estado persistido em IndexedDB (sobrevive a fechar navegador)
- Glossário editável na UI (enviado como contexto em cada chamada)
- Export ZIP de aprovados com HTML + JSON + imagem + index
- Auditoria: cada aprovação registra reviewer_name + timestamp

**Pontos de atenção para o teste real:**
- CORS de `file://` para Anthropic API: deve funcionar com o header `anthropic-dangerous-direct-browser-access: true` (já incluído). Se der erro, abrir via servidor local: `python -m http.server` na pasta `revisao/`.
- API key visível no navegador: OK para teste local, **MIGRAR pra backend antes de produção**.
- IndexedDB local: bom até ~5GB; para 100k docs em uma sessão única **não escala** — usar em lotes.

---

## 6. Próximos passos sugeridos

### Curto prazo (imediato)
1. **Testar `revisao.html` end-to-end com a API real** usando os mesmos 14 PDFs já transcritos. Comparar saída automática vs manual.
2. **Calibrar prompt** com base nas falhas detectadas (ajustar `SYSTEM_PROMPT` em `revisao.html` linhas ~310-340).
3. **Enriquecer `glossario.md`** com qualquer termo novo identificado durante testes.

### Médio prazo (próximas semanas)
4. **Validar com lote piloto** — 50-100 documentos reais de épocas diferentes (anos 1900, 1920, 1950, 1970) para entender taxa de dúvidas por época.
5. **Decidir QA strategy** (deferido na conversa anterior): score threshold? double-pass sempre ou só para suspeitos? amostragem manual?
6. **Definir hospedagem web** — sugestão: Cloudflare Pages (frontend) + Workers (backend) + R2 (storage) + Neon Postgres.

### Longo prazo (produção)
7. **Migrar storage para R2/S3**, banco para Postgres, autenticação para login real
8. **Sistema de filas** com prioridade (épocas críticas primeiro)
9. **Dashboard de progresso** (% concluído, dúvidas pendentes, produtividade por revisor)
10. **Backup automático** das aprovações (compliance cartorário)

---

## 7. Decisões pendentes (perguntar ao usuário antes de implementar)

- **QA strategy** definitiva (score / double-pass / amostragem) — deferida
- **Hospedagem específica** (Vercel vs Cloudflare vs outro)
- **Sistema de autenticação** (PIN, e-mail/senha, OAuth)
- **Repositório próprio** — hoje está em `matemagica-kids` que é repo de outro projeto. Migrar pra `cartorio-transcricoes` ou similar.
- **Nome final da pasta no PC do cliente** — discutimos "Projeto Cartório / Transcrição de Registros 1890 a 1976"
- **Política de retenção das imagens originais** (LGPD + compliance cartorário)

---

## 8. Convenções e padrões

### Marcações de incerteza (consistentes em todo o output)
- `<span class="incerto" data-doubt-id="d1" title="motivo">palavra</span>` — palavra de leitura duvidosa
- `<span class="ilegivel">[ilegivel]</span>` — totalmente ilegível
- `[palavra1/palavra2]` — duas hipóteses plausíveis
- `[?]` — letras ausentes (nunca inventar)

### Schema JSON de saída (do prompt)
Ver `SYSTEM_PROMPT` em `revisao.html` ou `automacao/batch_transcribe.py`. Resumo:

```json
{
  "numero_registro": "9007",
  "face": "aquisicoes|transmissoes|continuacao",
  "campos_estruturados": {
    "numero", "data", "data_extenso", "lugar", "distrito",
    "municipio", "comarca", "adquirente", "area_descricao"
  },
  "html_corpo": "<p class='transcricao'>...</p>",
  "confrontantes": [{"nome", "posicao"}],
  "incertezas": [{"id", "trecho", "leitura_principal",
    "leituras_alternativas", "confianca", "justificativa"}],
  "selos_fiscais": {"descricao"},
  "assinaturas": [],
  "score_confianca": 0.0,
  "glossario_adicoes_sugeridas": [{"categoria", "termo", "contexto"}]
}
```

### Convenções de nome de arquivo
- PDFs: `<numero>_<pagina>.pdf` (ex: `9007_1.pdf`, `9007_2.pdf`)
- HTML: mesmo stem (`9007_1.html`)
- JSON por página: `<numero>_<pagina>.json`
- JSON consolidado por registro: `<numero>.json` (junta todas as páginas)

---

## 9. Histórico da conversa (resumo dos turnos)

1. **Recebi pipeline base do usuário** (`INSTRUCOES_TRANSCRICAO.md`) + 1 PDF de exemplo. Decidi usar o pipeline (era sólido).
2. **Transcrevi 9007_1** em profundidade com zooms iterativos.
3. **Usuário enviou +13 PDFs** (4 registros adicionais). Configurei lote.
4. **Usuário revelou escala**: 80-100k imagens, 23 mil registros, 1890-1976. Mudou estratégia para "human-in-the-loop com API".
5. **Usuário disse caligrafias diferem entre documentos** — confirmei calibração por doc; descobri que "Ganafas" estava certo (não Garrafas).
6. **Decidimos**: terminar os 14 com profundidade + construir scaffold de automação.
7. **Terminei os 14**: HTML+JSON+index consolidado, glossário expandido, descobertas cross-document integradas.
8. **Construí `automacao/batch_transcribe.py`** (CLI Python) como primeiro scaffold.
9. **Usuário propôs workflow human-in-the-loop com aprovação ponto-a-ponto** — concordei, construí `revisao/revisao.html`.
10. **Discutimos hospedagem** (R2 + Postgres + Workers/Pages), volume, custos.
11. **Usuário pediu pasta local** — não consigo escrever no PC do usuário direto; foi sugerido `git clone` ou ZIP. Usuário pediu este contexto pra abrir novo chat.

---

## 10. Para o próximo chat — como continuar

**Se for via Claude Code no terminal local:**
1. `git clone <url> "Projeto Cartório/Transcrição de Registros 1890 a 1976"` (ajustar para repo final)
2. `cd "Projeto Cartório/Transcrição de Registros 1890 a 1976"`
3. `git checkout claude/document-transcription-analysis-aMGt6`
4. Abrir o repo no Claude Code e colar este arquivo como primeiro prompt

**Se for via Claude.ai web:**
1. Anexar este arquivo como contexto
2. Anexar a versão atual de `revisao.html` se for trabalhar nela
3. Anexar `glossario.md`

**Primeira pergunta sugerida pro próximo Claude:**
> "Leia o CONTEXTO_PROJETO.md. Estou no passo de testar a revisao.html localmente com a API real. Quero validar a qualidade nos 14 PDFs já transcritos manualmente. Como devo proceder?"

---

**Fim do contexto.** Quaisquer dúvidas, perguntar antes de implementar.
