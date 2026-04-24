# Handoff dev — continuação no próximo chat

Estado: 24/04/2026 fim do dia. Contexto deste chat ficou grande, abrindo novo.

## Último commit em produção
`618bc2c` — CSS compacto desktop ≥760px (todas as telas internas em 1 tela)

## Estado do app

**App 100% liberado** (sem paywall — `STATE.isPremium()` retorna true sempre, `guardaPaginaPremium` no-op). Todos os jogos, anos 2-5, SOS Prova, PDFs premium, EXPLORA — tudo grátis pra qualquer visitante.

**Páginas no ar (matemagica.app.br):**
- Home com slogan "A criança joga. A matemática fica."
- Tabuada, Flash, Problemas, Inventa, Soma, Cozinha, Frações, Senso Numérico, Cuisenaire (Barras), Beleza
- Imprimir (4 PDFs), Provas + SOS, Dashboard Pais
- jogos_matematica_{1..5}ano (catálogo BNCC por ano)
- /explora/ — História + Geografia BNCC 1-5 ano (app-irmão)
- Onboarding 5 slides primeiro acesso (filosofia Boaler + nome + atalho na tela)
- Botão verde flutuante "📱 Atalho na tela" (top-right, pulse) com tutorial PWA por plataforma

**Backend:** Netlify Functions `/api/ativar` + `/api/webhook-hotmart` permanecem mas paywall foi removido. Webhook Hotmart inclui agora envio pra Meta CAPI (commit do user — está em `netlify/functions/webhook-hotmart.mjs`).

## O que ficou pendente neste chat

User reportou: **"todas as telas internas estou tendo que fazer scroll para usar"**.

Apliquei compactação global no `jogos_matematica_shared.css` (commit `618bc2c`) que afeta TODAS as páginas que carregam ele. Cobre:
- `.container` (max 980px, padding 14×22)
- Headings (h1=22px, h2=17px, h3=15px)
- `.sub-*` (subtítulos = 12px)
- `.header-player` (avatar 44px)
- Placar jogo, abas, modais

**MAS** páginas standalone que NÃO usam o shared.css (ou tem CSS inline forte) podem precisar de ajuste manual. Páginas específicas pra checar/ajustar no próximo chat:

1. `tabuada.html` — tem CSS inline grande
2. `provas.html` — layout próprio
3. `dashboard.html` — gráficos podem ficar comprimidos
4. `senso.html`, `cuisenaire.html`, `beleza.html`, `fracoes.html`, `cozinha.html`, `soma.html`, `flash.html`, `problemas.html`, `inventa.html` — todas têm `<style>` próprio com tamanhos fixos
5. `explora/ano_{1..5}.html` — verificar
6. `explora/provas.html` — verificar

## Como continuar no próximo chat

Abrir chat novo e colar:

> Continuando dev do Matemágica. Última coisa: aplicar compactação desktop em telas internas que ainda não estão. Estado em `HANDOFF_DEV_CONTINUACAO.md` da pasta. Pode começar testando cada página interna em desktop (≥760px) e ajustando padding/font/header onde ainda força scroll.

## Memórias relevantes (já indexadas)

- `project_matemagica_paywall_hotmart.md`
- `project_matemagica_explora_integracao.md`
- `project_matemagica_slogan_oficial.md`
- `project_matemagica_sprint_4features_24abr.md`
- `project_matemagica_pesquisa_boaler_quora.md`
- `feedback_matemagica_nao_punir_erro.md`

## Briefings na raiz do projeto

- `BRIEFING_DEV.md` — features, arquitetura, regras pedagógicas
- `HANDOFF_VENDAS.md` — pra outro chat focado em marketing
- `BRIEFING_APENDICE_24abr.md` — médio/longo prazo (parqueado)
- `HOTMART_SETUP.md` — passo-a-passo Hotmart (não usado mais, mas documentação preservada caso volte modelo pago)

## Cache version atual
`?v=22` em CSS e JS de todas as páginas.

## Últimos 5 commits
```
618bc2c  Telas internas compactas no desktop (global shared.css)
b7fb4e9  Tutorial atalho: texto e fonte muito menores
0fa8b38  Botão "Atalho na tela" no canto superior direito
46102bc  Pais no EXPLORA + EXPLORA desktop compacto + tutorial PWA + botão Ajuda
5411a03  App 100% liberado: remove todos os bloqueios de paywall
```
