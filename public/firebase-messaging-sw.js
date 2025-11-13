// 자동으로 이 파일을 sw로 인식하도록 설정
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (evt) => evt.waitUntil(self.clients.claim()));

// 푸시 알림 테스트용
self.addEventListener("push", (event) => {
  console.log("📩 Push event:", event);

  if (!event.data) {
    console.log("❌ No data in push event");
    return;
  }

  const payload = event.data.json();
  console.log("raw push data:", payload);

  const data = payload.data || {};
  const title = data.title || "알림";
  const body = data.body || "";

  const options = {
    body,
    icon: "/favicons/web-app-manifest-192x192.png",
    badge: "/favicons/favicon-96x96.png",
    data: data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
