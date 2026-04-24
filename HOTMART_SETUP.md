# Setup Hotmart — Matemágica Completo R$17

Passo a passo pra configurar a integração.

## 1. Criar conta na Hotmart

- Acesse https://app.hotmart.com/signup
- Cadastre com CPF, dados bancários (pra receber os saques)
- Valide o email
- Complete perfil fiscal (Nota Fiscal é emitida automaticamente pela Hotmart)

## 2. Criar o produto

No painel Hotmart → **Produtos** → **Criar novo produto**:

| Campo | Valor |
|---|---|
| Nome do produto | `Matemágica Completo` |
| Formato | `Aplicativo` (ou "E-book / PDF" se precisar) |
| Tipo | Produto digital, acesso vitalício |
| Preço | `R$ 17,00` |
| Categoria | Educação → Ensino Fundamental |
| Descrição curta | "App de matemática BNCC pra 2º a 5º ano — desbloqueie tudo pra sempre" |
| Garantia | 7 dias (mínimo exigido por lei) |

Após criar:
1. Página de vendas → pode usar a da Hotmart ou uma LP externa (recomendado criar LP externa depois)
2. Anote a **URL de checkout** — algo tipo `https://pay.hotmart.com/F12345678K`
3. Anote o **Product ID** (aparece no painel, começa com número)

## 3. Substituir URL de checkout no código

Em `jogos_shared.js`, linha ~14:
```js
const CHECKOUT_URL = 'https://pay.hotmart.com/PREENCHER-AQUI';
```
Troca pelo seu link real.

Em `provas.html`, buscar `pay.hotmart.com/PREENCHER-AQUI` e trocar igualmente.

## 4. Configurar webhook

No painel Hotmart → **Ferramentas** → **Webhooks** → **Criar webhook**:

| Campo | Valor |
|---|---|
| URL | `https://matemagica.app.br/api/webhook-hotmart` |
| Versão | `2.0.0` (mais recente) |
| Eventos | ✅ Compra Aprovada (`PURCHASE_APPROVED`) · ✅ Compra Completa (`PURCHASE_COMPLETE`) |
| Token (HOTTOK) | clique em "gerar" e **copia o valor** |

## 5. Configurar variáveis de ambiente no Netlify

No painel Netlify do projeto → **Site configuration** → **Environment variables**:

| Nome | Valor |
|---|---|
| `HOTMART_HOTTOK` | o valor copiado do passo 4 |
| `RESEND_API_KEY` | API key do Resend (passo 6) |
| `EMAIL_FROM` | `Matemágica <ola@matemagica.app.br>` |
| `BASE_URL` | `https://matemagica.app.br` |

## 6. Configurar Resend (email de ativação)

1. Crie conta em https://resend.com (grátis até 100 emails/dia, 3.000/mês)
2. **Domains** → Add Domain → `matemagica.app.br`
3. Resend vai pedir pra adicionar 3 registros DNS (SPF, DKIM, etc). Adicione na Netlify DNS:
   - Netlify → Domain management → matemagica.app.br → DNS records → Add
4. Depois que Resend marcar o domínio como **verified** (pode levar 1-24h):
5. API Keys → Create API Key → copia e cola no `RESEND_API_KEY` do Netlify

**Alternativa temporária (enquanto DNS do Resend não resolve):** pode usar o remetente padrão `onboarding@resend.dev` — botar `EMAIL_FROM=onboarding@resend.dev` no Netlify. Emails vão cair (mas alguns podem ir pra spam) até o domínio próprio ficar pronto.

## 7. Testar o fluxo end-to-end

### Teste do webhook (simular compra)
No painel Hotmart → Webhooks → seu webhook → **Enviar evento de teste**.
Deve retornar HTTP 200 com `{ok: true, key: "MM-XXXX-..."}`.

### Teste real
1. Faça uma compra de teste no checkout (Hotmart tem modo teste ou use cartão real e peça reembolso)
2. Você deve receber o email no seu Gmail/email cadastrado
3. Clica no link do email → deve abrir `matemagica.app.br?ativar=MM-...` → app libera tudo

### Teste manual (pular Hotmart)
Pra testar só o endpoint de ativação:
```bash
# Cria licença manualmente via console do Netlify Blobs (não há UI direta — use uma função temporária)
# Ou envie um POST de teste pro webhook simulando Hotmart
curl -X POST https://matemagica.app.br/api/webhook-hotmart \
  -H "x-hotmart-hottok: SEU_HOTTOK" \
  -H "Content-Type: application/json" \
  -d '{"event":"PURCHASE_APPROVED","data":{"buyer":{"email":"seu@email.com","name":"Teste"},"purchase":{"transaction":"TEST001"}}}'
```

## 8. Fluxo final resumido

1. Cliente clica no banner "R$17" no app → vai pro checkout Hotmart
2. Paga (Pix confirma em segundos, cartão em minutos)
3. Hotmart dispara `PURCHASE_APPROVED` → seu webhook recebe
4. Webhook gera `MM-XXXX-XXXX-XXXX-XXXX`, salva em Netlify Blobs com o email
5. Webhook chama Resend → email é entregue com link `matemagica.app.br?ativar=MM-...`
6. Cliente abre o link → `/api/ativar` valida → `localStorage.matemagica_licenca_v1` salvo
7. App recarrega, mostra tudo liberado + badge "✨ Matemágico" + 500 moedas bônus

## 9. Se o cliente perder o email

- Cliente pode clicar em "Já comprei → Inserir chave de ativação" no paywall
- A chave fica no email original da Hotmart
- Se perdeu tudo: Hotmart tem histórico de compras (cliente pode entrar em https://consumer.hotmart.com)
- Como fallback: você cria endpoint `/api/reenviar-email?email=X` que busca no Blobs pelo email e reenviar

## Custos estimados

| Serviço | Free tier | Custo pós-free |
|---|---|---|
| Hotmart | Sem fee de assinatura | 9,9% + R$1 por venda |
| Netlify Functions | 125k req/mês | $25/mês (900k req) |
| Netlify Blobs | 100GB grátis | $0.25/GB |
| Resend | 100 emails/dia, 3k/mês | $20/mês (50k emails) |

Pra 100 vendas/mês: **tudo grátis**, você paga só os 9,9% + R$1 pra Hotmart = ~R$268/mês de fee.

## Migração futura (se quiser)

Se mudar de plataforma (Kiwify, Cakto) depois:
- Criar `/api/webhook-kiwify` ou `/api/webhook-cakto` com mesma lógica
- Rodar os dois em paralelo por 1-2 meses
- Manter as licenças antigas válidas (a chave não muda)
