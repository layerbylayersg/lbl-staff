// LBL Staff service worker: shows job-request alerts and opens the app when one is tapped.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  e.waitUntil(self.registration.showNotification("New MDR job request", {
    body: "Tap to see it and take the job.",
    icon: "icon-192.png", badge: "icon-192.png", tag: "job-request", renotify: true,
    data: { url: "./?requests=1" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data || {}).url || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for(const c of list){ if(c.url.startsWith(self.registration.scope)){ c.postMessage({ type: "job-request" }); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
