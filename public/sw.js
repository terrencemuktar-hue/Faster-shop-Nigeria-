self.addEventListener('push', function(event) {
  let data = {};
  try { data = event.data.json(); } catch(e) {}
  const title = data.title || 'FasterShop Nigeria';
  const options = {
    body: data.body || 'You get new update!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});