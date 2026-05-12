# Interface de Revisão — Cartório

Página única `revisao.html` que processa imagens/PDFs de registros manuscritos e leva o revisor humano por uma fila de aprovação ponto-a-ponto.

## Como usar (modo local)

1. **Abra o arquivo no navegador**: clique duas vezes em `revisao.html` (funciona via `file://` em Chrome/Edge/Firefox)
2. **Cole sua chave da Anthropic** no campo do topo e clique "Salvar chave". Ela fica salva no `localStorage` do seu navegador — não vai pra lugar nenhum.
3. **Arraste arquivos** (PDFs ou JPG/PNG) na zona de drop à esquerda. PDFs com várias páginas são separados automaticamente.
4. **Cada arquivo passa por duas transcrições independentes** (double-pass). Divergências viram "dúvidas" que aparecem destacadas em amarelo no texto.
5. **Resolva as dúvidas**: clique numa dúvida na coluna direita e escolha a leitura correta (A, B, ou digite outra).
6. **Aprove o documento**: quando todas as dúvidas estiverem resolvidas, o botão "Aprovar documento" é liberado.
7. **Baixe o ZIP**: clique "Baixar aprovados (ZIP)" no topo para receber todos os documentos aprovados (HTML + JSON + imagens + index).

## O que está armazenado e onde

| Dado | Onde |
|---|---|
| Chave da API | `localStorage` do navegador |
| Glossário (editável na UI) | `localStorage` |
| Fila de documentos + transcrições + aprovações | IndexedDB do navegador |
| Documentos aprovados (saída) | Baixados como ZIP pelo usuário |

**Nada sai do seu computador exceto chamadas para a API da Anthropic.**

## Fluxo de status

```
[arquivo arrastado]
   ↓
queued → processing → needs-review → approved
                   ↓                ↓
                 error          (download)
```

- **queued**: na fila, aguardando processamento
- **processing**: chamando API (double-pass em paralelo)
- **needs-review**: há dúvidas a resolver
- **approved**: 100% aprovado, pronto para exportar
- **error**: falhou; clique "Tentar novamente"

## Identificar quem aprovou

Antes de aprovar, defina seu nome de revisor no console do navegador (F12 → Console):

```javascript
localStorage.setItem('reviewer_name', 'Maria Silva')
```

Esse nome será gravado em cada documento aprovado para auditoria.

## Modelos disponíveis

- **claude-sonnet-4-6** (padrão): equilibrado custo/qualidade
- **claude-opus-4-7**: mais preciso, mais caro (~3x)
- **claude-haiku-4-5**: mais barato e rápido (~3x mais barato), pior em caligrafia complexa

Recomendado: começar com Sonnet. Se vir muitos erros em documentos antigos (pré-1920), tentar Opus.

## Limites do modo local

- IndexedDB do navegador comporta ~50-200 MB tranquilamente; em volume grande (>5000 docs simultâneos) recomenda-se processar em lotes, exportar e limpar.
- Não há sincronização entre navegadores/computadores. Cada PC tem sua fila própria.
- Auditoria fica no campo `approved_by` (uso do `localStorage.reviewer_name`) — sem login formal.

## Roadmap pra produção web (cartório)

Quando for migrar para hospedagem online com múltiplos revisores, manter o `revisao.html` como frontend e plugar:

1. **Backend serverless** (Cloudflare Workers ou Vercel Functions):
   - Recebe a chamada `transcribe(image, glossario)` em vez do JS chamar a Anthropic direto
   - Esconde a API key do servidor (não vai mais para browser)
   - Roda double-pass server-side
2. **Storage de objetos** (Cloudflare R2 ou AWS S3):
   - Substitui o `image_data_url` em IndexedDB por URLs em R2
   - Custo: ~US$ 0,015/GB/mês (10GB = US$ 0,15/mês)
3. **Banco de estado** (Postgres em Neon ou Supabase):
   - Tabela `documents` (status, transcricao, score)
   - Tabela `approvals` (doubt_id, value, reviewer, timestamp)
   - Audit log completo
4. **Login** (NextAuth, Clerk ou similar):
   - Cada funcionário do cartório tem sua conta
   - `reviewer_name` vem do login, não do localStorage
5. **Compartilhamento da fila**:
   - Vários revisores veem a mesma fila
   - Lock otimista: ao abrir um documento, ele fica "atribuído" ao revisor por X minutos

A camada de UI (HTML+CSS+JS de `revisao.html`) muda pouco. As funções `dbPut`/`dbGet`/`callAnthropic` são os pontos de troca.

## Custos estimados

**Modo local (você operando):**
- Custo da Anthropic API: ~US$ 0,02-0,05 por documento com double-pass (Sonnet)
- Para 100k imagens: ~US$ 2.000-5.000 (única vez)
- Possível reduzir 50% com prompt caching no glossário (em desenvolvimento na fase web)

**Modo produção (hospedado):**
- Frontend estático: free (Cloudflare Pages / Vercel)
- Backend serverless: ~US$ 5-20/mês até 100k requisições/mês
- R2 storage: US$ 0,15-1/mês para 10-100 GB
- Postgres free tier: 1-2 milhões de linhas grátis
- **Total infra: ~US$ 20-50/mês** + custos da API conforme processamento
