/* 마법과학 AR — 아주 단순한 서비스워커 (앱 껍데기 캐시)
   영상은 캐시하지 않음(용량 큼). 기본 화면만 빠르게 뜨도록. */
const CACHE = "magicscience-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./config.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = e.request.url;
  // 영상/외부 스트리밍/카메라 관련은 캐시 통과(네트워크 우선)
  if (url.includes("youtube") || url.endsWith(".mp4") || url.includes("googlevideo")) {
    return; // 브라우저 기본 처리
  }
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
