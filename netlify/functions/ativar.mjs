import { getStore } from "@netlify/blobs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(req.url);
  const key = (url.searchParams.get("key") || "").trim().toUpperCase();

  if (!key) {
    return new Response(JSON.stringify({ valid: false, error: "Chave não fornecida" }),
      { status: 400, headers: CORS });
  }

  const store = getStore("licencas");
  let lic = null;
  try {
    lic = await store.get(key, { type: "json" });
  } catch (e) {
    return new Response(JSON.stringify({ valid: false, error: "Erro ao validar" }),
      { status: 500, headers: CORS });
  }

  if (!lic) {
    return new Response(JSON.stringify({ valid: false, error: "Chave não encontrada" }),
      { status: 404, headers: CORS });
  }

  const jaAtivada = !!lic.ativadaEm;
  if (!jaAtivada) {
    lic.ativadaEm = new Date().toISOString();
    try { await store.setJSON(key, lic); } catch (e) {}
  }

  return new Response(JSON.stringify({
    valid: true,
    email: lic.email || null,
    jaAtivada
  }), { status: 200, headers: CORS });
};

export const config = { path: "/api/ativar" };
