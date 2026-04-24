// Service Worker — cache offline do Matemágica (network-first pra código, cache pra offline)
const CACHE = 'matemagica-v5';
const ARQUIVOS = [
  '/',
  '/index.html',
  '/jogos_matematica_1ano.html',
  '/jogos_matematica_2ano.html',
  '/jogos_matematica_3ano.html',
  '/jogos_matematica_4ano.html',
  '/jogos_matematica_5ano.html',
  '/jogos_matematica_shared.css',
  '/jogos_shared.js',
  '/mascotes.js',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/dashboard.html',
  '/provas.html',
  '/imprimir.html',
  '/tabuada.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARQUIVOS).catch(() => null))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first pra HTML/JS/CSS (garante atualização), cache-first pra estáticos
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const ehCodigo = /\.(html|js|css)$/.test(url.pathname) || url.pathname === '/';

  if (ehCodigo) {
    // network-first
    e.respondWith(
      fetch(req).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          // cacheia pela PATHNAME (ignora query string), assim ?prova=ID não polui cache
          const chave = new Request(url.origin + url.pathname);
          caches.open(CACHE).then(c => c.put(chave, clone));
        }
        return resp;
      }).catch(() => {
        // offline: serve cached pelo pathname
        const chave = new Request(url.origin + url.pathname);
        return caches.match(chave).then(r => r || caches.match('/index.html'));
      })
    );
  } else {
    // cache-first pra imagens/estáticos
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return resp;
      }))
    );
  }
});
