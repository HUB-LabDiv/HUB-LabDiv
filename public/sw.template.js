/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

const BUILD_ID = 'self.__BUILD_ID__';
/**
 * Hub de Comunicação Científica - V6.0
 * Estratégia de Cache Otimizada: Network-First para Páginas & RSC, Cache-First para Assets
 */

const CACHE_NAME = `labdiv-hub-${BUILD_ID}`;

const ASSET_EXTENSIONS = ['.js', '.css', '.woff', '.woff2', '.ttf', '.otf'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];

const BYPASS_ROUTES = [
    '/admin',
    '/api/admin',
    '/auth',
    '/login'
];

const OFFLINE_URL = '/offline';

try {
    self.addEventListener('install', (event) => {
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll([OFFLINE_URL, '/labdiv-logo.png']);
            })
        );
        self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
        event.waitUntil(
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
                );
            })
        );
        self.clients.claim();
    });

    self.addEventListener('fetch', (event) => {
        const { request } = event;
        if (request.method !== 'GET') return;

        const url = new URL(request.url);

        // Ignora qualquer interceptação em localhost/dev para nunca interferir no ambiente de desenvolvimento
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
            return;
        }

        // 1. NETWORK-ONLY: Admin, Auth & Rotas de Bypass
        if (BYPASS_ROUTES.some(route => url.pathname.startsWith(route))) {
            if (request.mode === 'navigate') {
                event.respondWith(
                    fetch(request).catch(() => caches.match(OFFLINE_URL))
                );
            }
            return;
        }

        // 2. NETWORK-FIRST: Navegações HTML e Dados Dinâmicos do Next.js (RSC)
        // Garante que novos deploys e novidades apareçam imediatamente aos usuários online
        const isNavigate = request.mode === 'navigate';
        const isRscData = url.searchParams.has('_rsc') || url.pathname.startsWith('/_next/data/');

        if (isNavigate || isRscData) {
            event.respondWith(
                fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.ok) {
                            const cacheCopy = networkResponse.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(request, cacheCopy));
                        }
                        return networkResponse;
                    })
                    .catch(async () => {
                        const cached = await caches.match(request);
                        if (cached) return cached;
                        if (isNavigate) {
                            const offlinePage = await caches.match(OFFLINE_URL);
                            if (offlinePage) return offlinePage;
                        }
                        throw new Error('Falha de rede e sem cache disponível.');
                    })
            );
            return;
        }

        // 3. CACHE-FIRST: Assets Estáticos Imutáveis (_next/static, fontes, scripts com hash)
        const isStaticAsset = url.pathname.startsWith('/_next/static/') || 
                              ASSET_EXTENSIONS.some(ext => url.pathname.endsWith(ext));

        if (isStaticAsset) {
            event.respondWith(
                caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    return fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.ok) {
                            const cacheCopy = networkResponse.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(request, cacheCopy));
                        }
                        return networkResponse;
                    });
                })
            );
            return;
        }

        // 4. STALE-WHILE-REVALIDATE: Imagens, Logos e Mídias Gerais
        const isImage = IMAGE_EXTENSIONS.some(ext => url.pathname.endsWith(ext));
        if (isImage) {
            event.respondWith(
                caches.open(CACHE_NAME).then(async (cache) => {
                    const cachedResponse = await cache.match(request);
                    const networkFetch = fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.ok) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => null);

                    return cachedResponse || networkFetch;
                }).catch(() => fetch(request))
            );
            return;
        }
    });

} catch (error) {
    console.error('🔴 [SW] Erro na inicialização do Service Worker:', error);
}
