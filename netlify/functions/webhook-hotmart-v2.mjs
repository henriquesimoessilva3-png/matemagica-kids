import { getStore } from "@netlify/blobs";

// Hotmart envia webhooks em POST com header x-hotmart-hottok
// Configure HOTMART_HOTTOK na env do Netlify com o mesmo valor
// Configure RESEND_API_KEY pra envio automático de email

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Valida HOTTOK (token fornecido pela Hotmart no painel de webhooks)
  const hottok = req.headers.get("x-hotmart-hottok") || req.headers.get("hottok");
  const expected = Netlify.env.get("HOTMART_HOTTOK");
  if (!expected) {
    return new Response(JSON.stringify({ error: "HOTMART_HOTTOK não configurado" }),
      { status: 500, headers: { "Content-Type": "application/json" } });
  }
  if (hottok !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "JSON inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Eventos relevantes: PURCHASE_APPROVED (compra aprovada), PURCHASE_COMPLETE (pagamento confirmado)
  const event = payload.event || payload.eventType;
  const okEvents = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE"];
  if (!okEvents.includes(event)) {
    return new Response(JSON.stringify({ ignored: event || "sem evento" }),
      { status: 200, headers: { "Content-Type": "application/json" } });
  }

  // Extrai dados do comprador — Hotmart estrutura em payload.data.buyer
  const data = payload.data || {};
  const buyer = data.buyer || {};
  const purchase = data.purchase || {};
  const email = (buyer.email || "").toLowerCase().trim();
  const nome = buyer.name || "";
  const transaction = purchase.transaction || purchase.order_ref || "";

  if (!email) {
    return new Response(JSON.stringify({ error: "Email ausente no payload" }),
      { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const store = getStore({ name: "licencas", consistency: "strong" });

  // Dedup por transaction_id: Hotmart pode reentregar webhook em caso de retry,
  // e replays maliciosos com a mesma transaction não devem gerar nova licença.
  if (transaction) {
    try {
      const existing = await store.get(`tx_${transaction}`, { type: "json" });
      console.log(`[dedup-check] tx_${transaction} existing=${JSON.stringify(existing)}`);
      if (existing && existing.key) {
        console.log(`[dedup-hit] transaction=${transaction} key=${existing.key}`);
        return new Response(JSON.stringify({ ok: true, key: existing.key, dedup: true }),
          { status: 200, headers: { "Content-Type": "application/json" } });
      }
    } catch (e) {
      console.error(`[dedup-check-error] ${e.message}`);
    }
  }

  // Gera chave única no formato MM-XXXX-XXXX-XXXX-XXXX
  const key = gerarChave();

  // Salva no Blob
  await store.setJSON(key, {
    email,
    nome,
    transaction,
    event,
    boughtAt: new Date().toISOString(),
    ativadaEm: null
  });

  // Indexa por transaction pra dedup em re-entregas/replays
  if (transaction) {
    try {
      await store.setJSON(`tx_${transaction}`, { key, processedAt: new Date().toISOString() });
      console.log(`[dedup-write] tx_${transaction} -> ${key}`);
    } catch (e) {
      console.error(`[dedup-write-error] ${e.message}`);
    }
  }

  // Envia email com link de ativação (se Resend configurado)
  try {
    await enviarEmail(email, nome, key);
  } catch (e) {
    // Log mas não falha o webhook — a licença foi gerada, user pode pedir reenvio
    console.error("Erro ao enviar email:", e.message);
  }

  // Hotmart eco o `xcod` que enviamos no checkout — usamos como external_id
  // pra recuperar fbp/fbc/ip/UA capturados client-side em /api/track-checkout
  const externalId = data.purchase?.xcod || data.checkout?.xcod || data.subscription?.xcod || purchase.xcod || "";
  let tracking = null;
  if (externalId) {
    try {
      const trackStore = getStore({ name: "tracking", consistency: "strong" });
      tracking = await trackStore.get(externalId, { type: "json" });
    } catch (e) {
      console.warn("Erro lendo tracking blob:", e.message);
    }
  }

  // Dispara Conversions API pra Meta (atribuição confiável, blinda iOS/AdBlock)
  // Nota: NÃO usamos req IP/UA do webhook — vem do servidor Hotmart, não do comprador.
  // IP/UA reais do comprador vêm do tracking blob (capturados quando ele clicou no CTA).
  try {
    await disparaCAPI({
      email,
      nome,
      phone: buyer.checkout_phone || buyer.phone || "",
      transactionId: transaction,
      value: parseFloat(purchase.price?.value || 27),
      currency: purchase.price?.currency_value || "BRL",
      externalId,
      fbp: tracking?.fbp || "",
      fbc: tracking?.fbc || "",
      ip: tracking?.ip || "",
      userAgent: tracking?.userAgent || ""
    });
  } catch (e) {
    console.error("Erro CAPI:", e.message);
  }

  return new Response(JSON.stringify({ ok: true, key, emailed: email }),
    { status: 200, headers: { "Content-Type": "application/json" } });
};

// SHA-256 hex pra hash de PII (Meta exige user_data hasheado)
async function sha256Hex(str) {
  const buf = new TextEncoder().encode(str.toLowerCase().trim());
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0")).join("");
}

// Normaliza pra E.164 sem '+' (Meta exige). BR national de 10-11 dígitos ganha código 55.
function normalizaTelefone(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) return digits;
  if (digits.length === 10 || digits.length === 11) return "55" + digits;
  return digits;
}

async function disparaCAPI({ email, nome, phone, transactionId, value, currency, externalId, fbp, fbc, ip, userAgent }) {
  const PIXEL_ID = Netlify.env.get("META_PIXEL_ID");
  const ACCESS_TOKEN = Netlify.env.get("META_CAPI_TOKEN");
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn("CAPI: META_PIXEL_ID ou META_CAPI_TOKEN ausente, pulando");
    return;
  }

  const [first, ...rest] = (nome || "").trim().split(" ");
  const last = rest.join(" ");
  const phoneNorm = normalizaTelefone(phone);
  // fbp/fbc são tokens opacos do Pixel — Meta exige NÃO hashear; external_id sim.
  const userData = {
    em: [await sha256Hex(email)],
    ...(first ? { fn: [await sha256Hex(first)] } : {}),
    ...(last ? { ln: [await sha256Hex(last)] } : {}),
    ...(phoneNorm ? { ph: [await sha256Hex(phoneNorm)] } : {}),
    ...(externalId ? { external_id: [await sha256Hex(externalId)] } : {}),
    ...(fbp ? { fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...(ip ? { client_ip_address: ip } : {}),
    ...(userAgent ? { client_user_agent: userAgent } : {})
  };

  const event = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: "https://matemagica.app.br/obrigada.html",
    event_id: transactionId || `tx_${Date.now()}`, // dedup com pixel client-side se houver
    user_data: userData,
    custom_data: {
      currency,
      value,
      content_name: "Matemagica_Completo",
      content_type: "product"
    }
  };

  const url = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [event] })
  });
  const txt = await r.text();
  console.log(`CAPI response status=${r.status} body=${txt.slice(0, 800)}`);
  if (!r.ok) {
    throw new Error(`CAPI ${r.status}: ${txt}`);
  }
}

function gerarChave() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  return `MM-${hex.slice(0,4)}-${hex.slice(4,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}`.toUpperCase();
}

async function enviarEmail(email, nome, key) {
  const RESEND_KEY = Netlify.env.get("RESEND_API_KEY");
  if (!RESEND_KEY) return;

  const EMAIL_FROM = Netlify.env.get("EMAIL_FROM") || "Matemágica <ola@matemagica.app.br>";
  const BASE_URL = Netlify.env.get("BASE_URL") || "https://matemagica.app.br";
  const link = `${BASE_URL}/?ativar=${key}`;
  const primeiroNome = (nome || "").split(" ")[0] || "oi";

  const html = `
  <!DOCTYPE html>
  <html><head><meta charset="utf-8"></head>
  <body style="margin:0;padding:20px;background:#f7f5ff;font-family:-apple-system,Segoe UI,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;box-shadow:0 4px 20px rgba(107,84,211,0.1)">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:42px">✨</div>
        <h1 style="margin:8px 0 4px;font-size:26px;background:linear-gradient(135deg,#6b54d3,#b968e8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:transparent;font-weight:900">MATEMÁGICA</h1>
        <p style="margin:0;color:#888;font-size:13px">Compra confirmada · acesso vitalício</p>
      </div>

      <p style="font-size:15px;color:#333;line-height:1.55">
        Oi ${primeiroNome}! 👋<br><br>
        Obrigado por liberar o <b>Matemágica Completo</b>. Seu acesso é <b>vitalício</b> — paga uma vez, usa pra sempre.
      </p>

      <div style="text-align:center;margin:24px 0">
        <a href="${link}" style="display:inline-block;background:linear-gradient(135deg,#2ebd7c,#4ab3a5);color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:800;font-size:15px;box-shadow:0 4px 10px rgba(46,189,124,0.3)">🚀 Liberar meu acesso agora</a>
        <p style="font-size:11px;color:#888;margin:8px 0 0">Funciona no celular, tablet ou computador — basta abrir o link</p>
      </div>

      <div style="background:#f7f5ff;border-radius:10px;padding:14px;margin:20px 0;font-size:13px;color:#4a3b8a">
        <b>Sua chave de ativação (caso o botão não funcione):</b>
        <div style="font-family:monospace;background:#fff;padding:8px 12px;border-radius:6px;margin-top:6px;font-size:13px;color:#6b54d3;letter-spacing:1px;text-align:center;font-weight:700">${key}</div>
        <p style="font-size:11px;color:#888;margin:8px 0 0">Abra <a href="${BASE_URL}" style="color:#6b54d3">matemagica.app.br</a>, clique em "Inserir chave de ativação" e cole essa chave.</p>
      </div>

      <p style="font-size:14px;color:#333;line-height:1.55">
        <b>Agora você tem:</b>
      </p>
      <ul style="color:#4a3b8a;font-size:13px;line-height:1.7;padding-left:20px">
        <li>Todos os jogos do 2º ao 5º ano</li>
        <li>SOS Prova — detecta fraquezas e monta prova em 30 segundos</li>
        <li>PDFs premium (Pokédex Tabuada, Flashcards) sem gastar moedas</li>
        <li>Temas de fundo (modo escuro, pastel, oceano…)</li>
        <li>+500 moedas de bônus</li>
        <li>Badge exclusiva ✨ Matemágico</li>
      </ul>

      <div style="border-top:1px solid #eee;margin-top:24px;padding-top:16px;font-size:12px;color:#888;text-align:center">
        <p>Dúvidas? Responde esse email que a gente ajuda.</p>
        <p>Matemágica · Jogos de matemática BNCC</p>
      </div>
    </div>
  </body></html>
  `;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [email],
      subject: "✨ Seu Matemágica Completo tá liberado!",
      html
    })
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Resend ${r.status}: ${txt}`);
  }
}

export const config = { path: "/api/webhook-hotmart-v2" };
