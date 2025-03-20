import { fetchWithCache, getCachedResponse } from ".";

export const CACHE_NAME = "recipes-cache";
export const API_URL_PREFIX = "https://dummyjson.com/recipes";
export const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

const urlsToCache = [
  "/",
  "/styles/main.css",
  "/scripts/main.js",
  `${API_URL_PREFIX}/search`,
  `${API_URL_PREFIX}/recipes`,
  `${API_URL_PREFIX}/recipes/1`,
  `${API_URL_PREFIX}/recipes/2`,
  `${API_URL_PREFIX}/recipes/3`,
];

(self as unknown as ServiceWorkerGlobalScope).addEventListener(
  "install",
  (event: ExtendableEvent) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log("cache open");
        return cache.addAll(urlsToCache);
      })
    );
  }
);

(self as unknown as ServiceWorkerGlobalScope).addEventListener(
  "activate",
  (event: ExtendableEvent) => {
    // Clean up old caches
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
    );

    // Ensure service worker takes control of all clients immediately
    event.waitUntil(
      (self as unknown as ServiceWorkerGlobalScope).clients.claim()
    );
  }
);

(self as unknown as ServiceWorkerGlobalScope).addEventListener(
  "message",
  async (event: ExtendableMessageEvent) => {
    const { type, recipeId } = event.data;

    try {
      if (type === "FETCH_RECIPES_LIST") {
        const cachedList = await getCachedResponse(
          `${API_URL_PREFIX}?select=name`
        );
        if (cachedList) {
          event.source?.postMessage({ type: "RECIPES_LIST", data: cachedList });
        } else {
          fetchWithCache(
            `${API_URL_PREFIX}?select=name`,
            event,
            "RECIPES_LIST"
          );
        }
      }

      if (type === "FETCH_RECIPE_DETAILS" && recipeId) {
        const cachedRecipe = await getCachedResponse(
          `${API_URL_PREFIX}/${recipeId}`
        );
        if (cachedRecipe) {
          event.source?.postMessage({
            type: "RECIPE_DETAILS",
            data: cachedRecipe,
          });
        } else {
          fetchWithCache(
            `${API_URL_PREFIX}/${recipeId}`,
            event,
            "RECIPE_DETAILS"
          );
        }
      }
    } catch (error) {
      console.error("Error in service worker:", error);
      event.source?.postMessage({ error: "Failed to fetch data." });
    }
  }
);
