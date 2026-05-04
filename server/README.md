# Estudo-Foto Bot — backend WhatsApp

Bot que recebe foto/vídeo de página de livro pelo WhatsApp e devolve resumo + exercícios com gabarito explicado. Pensado pra rodar em Railway, Fly.io ou qualquer plataforma que aceite Docker.

## Arquitetura

```
WhatsApp (mãe) → Meta Cloud API → seu webhook (/webhook)
                                       ↓
                              [download mídia]
                                       ↓
                  vídeo? → ffmpeg extrai frames
                  foto?  → usa direto + redimensiona
                                       ↓
                          Anthropic Claude (vision)
                                       ↓
                       formata mensagens + envia via Meta
```

Estado por usuário (ano escolar, cota, último resultado) fica em SQLite local. Em Railway/Fly.io vai num volume persistente.

## Pré-requisitos

1. **Conta Anthropic** — https://console.anthropic.com/settings/keys
   - Gera uma API key e carrega US$ 5 de crédito (~500 estudos com Haiku)
2. **CNPJ ativo** (MEI serve) — pra Meta verificar a conta business
3. **Conta Meta Business** — https://business.facebook.com/
4. **Número de telefone que NUNCA teve WhatsApp** (eSIM novo, ou chip novo)
5. **Conta no Railway, Fly.io ou similar** com suporte a Docker

## Setup do WhatsApp Business (Meta Cloud API)

### Passo 1: criar app
1. Vai em https://developers.facebook.com/apps/ → "Criar App"
2. Tipo: **Business** → cria
3. No painel do app, em "Adicionar Produto", escolhe **WhatsApp** → Configurar
4. Aceita os termos. Aparece a tela "API Setup"

### Passo 2: associar número
1. Em "API Setup", clica em **Adicionar número de telefone**
2. Cadastra seu número (o que NUNCA teve WhatsApp comum)
3. Confirma o código por SMS/voz
4. Anota o **Phone Number ID** (aparece logo abaixo do número)

### Passo 3: pegar token permanente
O token padrão dura 24h, inútil pra produção. Crie um permanente:

1. Vai em https://business.facebook.com/settings/system-users
2. **Adicionar System User** → nome "estudo-foto-bot", role "Administrador"
3. Em "Adicionar ativos" → seleciona o app que você criou → permissões totais
4. Clica no system user → **Gerar Token** → seleciona o app, escopos `whatsapp_business_messaging` e `whatsapp_business_management`, expiração **Nunca**
5. Copia o token (começa com `EAAG...`) — **só aparece UMA vez**, salva no `.env`

### Passo 4: webhook
Você só consegue configurar o webhook DEPOIS que o servidor estiver no ar (com URL pública HTTPS). Continua no passo "Deploy" abaixo, depois volta aqui:

1. No painel do app → WhatsApp → Configuration → Webhook
2. **Callback URL**: `https://SEU-APP.up.railway.app/webhook` (ou Fly.io)
3. **Verify Token**: a string que você inventou em `WHATSAPP_VERIFY_TOKEN` no `.env`
4. Clica **Verify and Save** (Meta vai bater no GET /webhook na hora)
5. Em **Webhook Fields**, marca apenas: `messages`

## Deploy no Railway

### Setup inicial

1. Vai em https://railway.app/, login com GitHub
2. **New Project** → **Deploy from GitHub repo** → seleciona este repo
3. Em **Settings** → **Service** → **Root Directory**: `server`
4. **Networking** → **Generate Domain** (cria URL pública HTTPS)

### Variáveis de ambiente

Em **Variables**, adiciona TODAS do `.env.example`:

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
ANTHROPIC_MODEL=claude-haiku-4-5-20251001
WHATSAPP_TOKEN=EAAGxxxxxx
WHATSAPP_PHONE_NUMBER_ID=12345
WHATSAPP_VERIFY_TOKEN=invente-uma-string-secreta
WHATSAPP_APP_SECRET=xxx (em Settings → Basic → App Secret no Meta)
PORT=3000
NODE_ENV=production
DB_PATH=/data/bot.db
FREE_QUOTA=3
ADMIN_PHONE=5511999999999
```

### Volume persistente (importante!)

Sem isso, toda vez que reiniciar o servidor o SQLite zera (perde cota dos usuários):

1. **Settings** → **Volumes** → **+ New Volume**
2. **Mount path**: `/data`
3. **Size**: 1 GB

### Deploy

Railway detecta o `Dockerfile` automaticamente e faz build. Em ~3 min você tem URL tipo `https://estudo-foto-bot-production.up.railway.app`.

### Verifica

```bash
curl https://SEU-APP.up.railway.app/health
# {"ok":true,"ts":1730000000000}
```

Volta no Meta e configura o webhook (passo 4 acima).

## Deploy no Fly.io (alternativa)

```bash
brew install flyctl
cd server
fly launch                      # cria app, lê o Dockerfile
fly volumes create bot_data --size 1
fly secrets set ANTHROPIC_API_KEY=sk-ant-xxx WHATSAPP_TOKEN=EAAG... \
   WHATSAPP_PHONE_NUMBER_ID=12345 WHATSAPP_VERIFY_TOKEN=secreta \
   WHATSAPP_APP_SECRET=xxx ADMIN_PHONE=5511999999999 \
   FREE_QUOTA=3 DB_PATH=/data/bot.db ANTHROPIC_MODEL=claude-haiku-4-5-20251001
fly deploy
```

No `fly.toml`, monta o volume:

```toml
[mounts]
  source = "bot_data"
  destination = "/data"
```

## Rodar local pra testar

```bash
cd server
cp .env.example .env
# preenche o .env (pelo menos ANTHROPIC_API_KEY pra testar a IA)
npm install
npm run dev
```

Pra testar webhook do Meta com servidor local, usa **ngrok**:

```bash
ngrok http 3000
# pega a URL https://xxx.ngrok-free.app e cola no Meta como Callback URL
```

## Comandos do bot (testando no zap)

| Mensagem | O que faz |
|---|---|
| `oi` ou primeira msg | Onboarding: pede ano escolar |
| `4` | Define ano (ex: 4º ano fundamental) |
| `2m` | Define ano (ex: 2ª série médio) |
| `/materia história` | Define matéria (opcional) |
| (foto) | Adiciona ao buffer; processa após 8s sem novas fotos |
| (vídeo) | Extrai frames e processa direto |
| `/diferente` | Refaz o resumo com outra abordagem |
| `/mais` | Gera mais 5 exercícios |
| `/gabarito` | Mostra respostas comentadas |
| `/cota` | Vê quantos estudos grátis restam |
| `/ajuda` | Lista comandos |

## Custos de operação

| Item | Custo |
|---|---|
| Railway (servidor pequeno + volume) | ~R$ 25/mês |
| Meta Cloud API | Grátis (apenas conversas iniciadas pelo usuário, dentro de 24h) |
| Anthropic Haiku 4.5 por estudo | ~R$ 0,05 |
| TTS Google Cloud (opcional) | ~R$ 0,02 por resumo |
| **Fixo** | **R$ 25/mês** |
| **Variável por estudo** | **~R$ 0,05-0,30** |

Com 50 mães pagando R$ 19,90 (ticket conservador):
- Receita: R$ 995/mês
- Custos (R$ 25 + 50 × 20 estudos × R$ 0,07): R$ 95
- **Margem: 90%**

## Próximos passos sugeridos

- [ ] Implementar TTS de verdade em `tts.js` (Google Cloud)
- [ ] Adicionar webhook do Hotmart pra liberar cota após pagamento
- [ ] Modo "/jogar" — quiz interativo no chat com botões (Meta suporta)
- [ ] Repetição espaçada (revisar perguntas erradas em 1d, 3d, 7d)
- [ ] Relatório semanal automático ("essa semana João estudou 3x...")
- [ ] Multi-filho (perfis dentro do mesmo número da mãe)
- [ ] Detecção de matéria via IA (em vez de exigir `/materia`)

## Troubleshooting

**Webhook não verifica no Meta**
- Confere se `WHATSAPP_VERIFY_TOKEN` no `.env` é IGUAL ao que você colou no Meta
- Confere se a URL termina exatamente em `/webhook`
- Testa o handshake manualmente:
  ```bash
  curl "https://SEU-APP/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=teste"
  # tem que retornar: teste
  ```

**"Meta API 401: Invalid OAuth access token"**
- Token expirou ou tá errado. Crie um novo system user token (passo 3).

**Vídeo não processa, ffmpeg não encontrado**
- O `ffmpeg-static` deveria resolver. Se rodando em ambiente exótico, instala ffmpeg pelo apt: `apt install ffmpeg` e remove `ffmpeg-static` do package.json.

**SQLite "database is locked"**
- WAL mode tá ligado, mas se acontecer em alta escala, migre pra Postgres (~20 linhas em `state.js`).

**Bot não responde**
- Olha os logs do Railway/Fly. Geralmente é token expirado ou Anthropic sem crédito.
