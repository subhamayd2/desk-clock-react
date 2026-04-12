const CACHE_NAME = "desk-clock-v2";
const APP_SHELL = ["/", "/index.html"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(APP_SHELL))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => {
				const hadPreviousCache = keys.some(
					(key) => key.startsWith("desk-clock-") && key !== CACHE_NAME,
				);

				return Promise.all(
					keys
						.filter((key) => key !== CACHE_NAME)
						.map((key) => caches.delete(key)),
				).then(() => hadPreviousCache);
			})
			.then((hadPreviousCache) =>
				self.clients.claim().then(() => hadPreviousCache),
			)
			.then((hadPreviousCache) => {
				if (!hadPreviousCache) return;

				return self.clients
					.matchAll({ type: "window" })
					.then((clients) =>
						Promise.all(clients.map((client) => client.navigate(client.url))),
					);
			}),
	);
});

self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") return;

	const url = new URL(event.request.url);
	if (url.hostname.includes("open-meteo.com")) return;
	if (url.origin !== self.location.origin) return;
	if (url.pathname === "/version.json") return;

	if (event.request.mode === "navigate") {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					if (response.ok) {
						const copy = response.clone();
						caches
							.open(CACHE_NAME)
							.then((cache) => cache.put("/index.html", copy));
					}

					return response;
				})
				.catch(() => caches.match("/index.html")),
		);
		return;
	}

	event.respondWith(
		caches.match(event.request).then((cached) => {
			const networkFetch = fetch(event.request)
				.then((response) => {
					if (response.ok) {
						const copy = response.clone();
						caches
							.open(CACHE_NAME)
							.then((cache) => cache.put(event.request, copy));
					}
					return response;
				})
				.catch(() => cached || caches.match("/index.html"));

			return cached || networkFetch;
		}),
	);
});
