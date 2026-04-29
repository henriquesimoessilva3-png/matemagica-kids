// TOMBSTONE — endpoint v1 desativado.
// O Hotmart agora deve enviar webhooks para /api/webhook-hotmart-v2.
// Endpoint mantido em 410 Gone pra invalidar o HOTTOK que vazou em screenshot
// (não é mais possível regenerar via Hotmart UI; troca de URL é a mitigação oficial).

export default async (req) => {
  return new Response(
    JSON.stringify({
      error: "Gone",
      message: "Este endpoint foi desativado. Webhooks devem ir para /api/webhook-hotmart-v2."
    }),
    {
      status: 410,
      headers: { "Content-Type": "application/json" }
    }
  );
};

export const config = { path: "/api/webhook-hotmart" };
