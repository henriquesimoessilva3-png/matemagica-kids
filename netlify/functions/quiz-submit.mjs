import { getStore } from "@netlify/blobs";

// Recebe lead do quiz v2: email + respostas + UTM.
// Salva em "leads" pra futura sequência de email (Mailerlite/Brevo) e análise de perfil que converte.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESPOSTAS_KEYS = ["p1", "p2", "p3", "p4", "p5"];

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "JSON inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const email = String(payload?.email || "").toLowerCase().trim();
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return new Response(JSON.stringify({ error: "email inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const respostas = {};
  const src = payload?.respostas || {};
  for (const k of RESPOSTAS_KEYS) {
    const v = src[k];
    if (typeof v === "string" && v.length <= 40) respostas[k] = v;
  }

  const utm = {};
  const utmSrc = payload?.utm || {};
  for (const k of ["source", "medium", "campaign", "content", "term"]) {
    const v = utmSrc[k];
    if (typeof v === "string" && v.length <= 80) utm[k] = v;
  }

  const perfil = typeof payload?.perfil === "string" && payload.perfil.length <= 4
    ? payload.perfil
    : "";

  const store = getStore({ name: "leads", consistency: "strong" });
  const ts = Date.now();
  await store.setJSON(email, {
    email,
    respostas,
    perfil,
    utm,
    ts,
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
    userAgent: req.headers.get("user-agent")?.slice(0, 500) || ""
  });

  return new Response(JSON.stringify({ ok: true }),
    { status: 200, headers: { "Content-Type": "application/json" } });
};

export const config = { path: "/api/quiz-submit" };
