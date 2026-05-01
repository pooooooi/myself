const CACHE_NAME = "self-map-v29";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./guide.html",
  "./guide-en.html",
  "./guide-zh.html",
  "./examples.html",
  "./examples-en.html",
  "./examples-zh.html",
  "./small-action.html",
  "./small-action-en.html",
  "./small-action-zh.html",
  "./articles.html",
  "./articles-en.html",
  "./articles-zh.html",
  "./about.html",
  "./about-en.html",
  "./about-zh.html",
  "./development-notes.html",
  "./development-notes-en.html",
  "./development-notes-zh.html",
  "./article-first-sentence.html",
  "./article-small-action-list.html",
  "./article-assumption-value.html",
  "./article-reflection.html",
  "./article-private-note.html",
  "./article-why-small-actions-work.html",
  "./article-design-struggles.html",
  "./article-overthinking-to-action.html",
  "./article-mobile-writing.html",
  "./article-ai-coding-notes.html",
  "./article-why-small-actions-work-en.html",
  "./article-design-struggles-en.html",
  "./article-overthinking-to-action-en.html",
  "./article-mobile-writing-en.html",
  "./article-ai-coding-notes-en.html",
  "./article-why-small-actions-work-zh.html",
  "./article-design-struggles-zh.html",
  "./article-overthinking-to-action-zh.html",
  "./article-mobile-writing-zh.html",
  "./article-ai-coding-notes-zh.html",
  "./privacy.html",
  "./privacy-en.html",
  "./privacy-zh.html",
  "./icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
