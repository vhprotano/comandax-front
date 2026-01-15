// ComandaX Service Worker for caching and performance optimization
const CACHE_NAME = "comandax-v1.0.0";
const STATIC_CACHE = "comandax-static-v1.0.0";
const DYNAMIC_CACHE = "comandax-dynamic-v1.0.0";

// Resources to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/main.js",
  "/polyfills.js",
  "/runtime.js",
  "/styles.css",
  "/assets/logo/branco.png",
  "/assets/logo/branco.png",
  "/favicon.ico",
  "/manifest.json",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[Service Worker] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error("[Service Worker] Error caching static assets:", error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("[Service Worker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip Chrome extension requests
  if (url.protocol === "chrome-extension:") return;

  // Handle API requests differently
  if (url.pathname.startsWith("/api/") || url.hostname.includes("supabase")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses for short time
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.some((asset) => url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }

  // Handle HTML pages - Network first, then cache
  if (request.headers.get("accept").includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Default: Cache first, then network
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        // Don't cache if not successful
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      });
    })
  );
});

// Background sync for offline orders
self.addEventListener("sync", (event) => {
  console.log("[Service Worker] Background sync triggered:", event.tag);

  if (event.tag === "background-sync-orders") {
    event.waitUntil(syncPendingOrders());
  }
});

async function syncPendingOrders() {
  try {
    // Get pending orders from IndexedDB or similar
    const pendingOrders = await getPendingOrders();

    if (pendingOrders.length > 0) {
      console.log(
        "[Service Worker] Syncing",
        pendingOrders.length,
        "pending orders"
      );

      // Send orders to server
      for (const order of pendingOrders) {
        await sendOrderToServer(order);
      }

      // Clear pending orders
      await clearPendingOrders();
    }
  } catch (error) {
    console.error("[Service Worker] Error syncing orders:", error);
  }
}

// Placeholder functions - implement based on your data storage strategy
async function getPendingOrders() {
  // Implement IndexedDB or similar storage retrieval
  return [];
}

async function sendOrderToServer(order) {
  // Implement API call to send order
  return fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
}

async function clearPendingOrders() {
  // Implement clearing of pending orders
}

// Push notifications for order updates
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push received");

  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "/assets/logo/branco.png",
      badge: "/assets/logo/branco.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey,
      },
      actions: [
        {
          action: "view",
          title: "Ver Pedido",
          icon: "/assets/icons/view.png",
        },
        {
          action: "close",
          title: "Fechar",
          icon: "/assets/icons/close.png",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification click received");

  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/customer-tabs"));
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});
