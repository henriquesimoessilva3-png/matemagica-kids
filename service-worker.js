// Service Worker v25 — HTML sempre fresh, cache só pra estáticos.
// Antes (v24) cacheava HTML e isso travava o navegador em layout antigo.
const CACHE = 'matemagica-v25';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // HTML e raiz: NÃO intercepta. Browser usa rede + Cache-Control do Netlify.
  const ehHTML = /\.html$/.test(url.pathname) || url.pathname === '/' || !/\.[a-z0-9]+$/i.test(url.pathname);
  if (ehHTML) return;

  // JS/CSS/JSON: network-first com fallback offline
  if (/\.(js|css|json)$/i.test(url.pathname)) {
    e.respondWith(
      fetch(req).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return resp;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Imagens/fontes/svg: cache-first
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(resp => {
      if (resp.ok) {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
      }
      return resp;
    }))
  );
});
