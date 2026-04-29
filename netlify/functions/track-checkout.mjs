import { getStore } from "@netlify/blobs";

// Recebe tracking client-side (fbp, fbc) + external_id no momento do clique no CTA.
// Indexamos por external_id pra que o webhook-hotmart depois leia esses dados via xcod
// (parâmetro custom da URL de checkout que Hotmart eco no payload).

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

  const { external_id, fbp, fbc, ts } = payload || {};
  if (!external_id || typeof external_id !== "string" || external_id.length > 80) {
    return new Response(JSON.stringify({ error: "external_id ausente ou inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const store = getStore("tracking");
  await store.setJSON(external_id, {
    fbp: typeof fbp === "string" ? fbp.slice(0, 200) : "",
    fbc: typeof fbc === "string" ? fbc.slice(0, 200) : "",
    ts: typeof ts === "number" ? ts : Date.now(),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
    userAgent: req.headers.get("user-agent")?.slice(0, 500) || ""
  });

  return new Response(JSON.stringify({ ok: true }),
    { status: 200, headers: { "Content-Type": "application/json" } });
};

export const config = { path: "/api/track-checkout" };
