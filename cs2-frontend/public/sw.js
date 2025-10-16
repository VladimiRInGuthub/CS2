const CACHE_NAME = 'skincase-v1';
const STATIC_CACHE_NAME = 'skincase-static-v1';
const DYNAMIC_CACHE_NAME = 'skincase-dynamic-v1';

// Assets à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// APIs à mettre en cache
const API_CACHE_PATTERNS = [
  /^\/api\/cases$/,
  /^\/api\/skins$/,
  /^\/api\/stats\/global$/,
  /^\/api\/battlepass\/active$/,
  /^\/api\/premium\/plans$/
];

// Installer le service worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Mise en cache des assets statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Forcer l'activation immédiate
        return self.skipWaiting();
      })
  );
});

// Activer le service worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activation');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les anciens caches
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('🗑️ Service Worker: Suppression ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prendre le contrôle de toutes les pages
      return self.clients.claim();
    })
  );
});

// Intercepter les requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Stratégie pour les assets statiques
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stratégie pour les APIs
  if (url.pathname.startsWith('/api/')) {
    const shouldCache = API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
    
    if (shouldCache) {
      event.respondWith(networkFirst(request));
    } else {
      event.respondWith(networkOnly(request));
    }
    return;
  }

  // Stratégie pour les pages HTML
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Stratégie par défaut
  event.respondWith(networkFirst(request));
});

// Stratégie Cache First (pour les assets statiques)
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    // Mettre en cache la réponse
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Erreur cache first:', error);
    
    // Retourner une réponse de fallback si disponible
    const fallbackResponse = await caches.match('/offline.html');
    return fallbackResponse || new Response('Contenu non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stratégie Network First (pour les données dynamiques)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Mettre en cache les réponses réussies
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Réseau indisponible, utilisation du cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Retourner une réponse d'erreur
    return new Response('Contenu non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}

// Stratégie Network Only (pour les requêtes sensibles)
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Erreur network only:', error);
    return new Response('Service indisponible', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Gérer les messages du client
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ size });
      });
      break;
      
    default:
      console.log('Message non reconnu:', type);
  }
});

// Nettoyer les caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🧹 Service Worker: Tous les caches ont été nettoyés');
  } catch (error) {
    console.error('Erreur nettoyage caches:', error);
  }
}

// Obtenir la taille du cache
async function getCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Erreur calcul taille cache:', error);
    return 0;
  }
}

// Nettoyer automatiquement les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les caches de plus de 7 jours
          if (cacheName.includes('skincase-') && !cacheName.includes(STATIC_CACHE_NAME) && !cacheName.includes(DYNAMIC_CACHE_NAME)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

console.log('🚀 Service Worker: Chargé et prêt');
