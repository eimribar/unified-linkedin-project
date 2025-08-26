// Service Worker for AgentSS Mobile App
const CACHE_NAME = 'agentss-mobile-v2';
const urlsToCache = [
  '/',
  '/auth',
  '/mobile-review',
  '/client-approve',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
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