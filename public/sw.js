// Service Worker for AgentSS Mobile App
const CACHE_VERSION = 'v4-2025-08-26';
const CACHE_NAME = `agentss-mobile-${CACHE_VERSION}`;

// Only cache core app shell, not versioned assets
const urlsToCache = [
  '/',
  '/auth',
  '/mobile-review',
  '/client-approve',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.png'
];

// Install event - cache resources and skip waiting
self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - network first for HTML and assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // For HTML pages, always try network first
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Fall back to cache if offline
          return caches.match(request);
        })
    );
    return;
  }
  
  // For assets (JS, CSS), skip cache for /assets/ folder to avoid version conflicts
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // For other resources, try cache first, then network
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(request);
      })
  );
});

// Activate event - clean up ALL old caches and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Delete all old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients immediately
      clients.claim()
    ])
  );
});

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'You have new content to review',
      icon: '/apple-touch-icon.png',
      badge: '/favicon.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Review Now',
          icon: '/favicon.svg'
        },
        {
          action: 'close',
          title: 'Later',
          icon: '/favicon.svg'
        }
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title || 'New Content Available', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open mobile review page
    event.waitUntil(
      clients.openWindow('/mobile-review')
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync offline actions when back online
  return new Promise((resolve) => {
    // This would handle queued approve/decline/edit actions
    console.log('Background sync triggered');
    resolve();
  });
}

// Message event to force update
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});