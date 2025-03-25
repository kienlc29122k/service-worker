/// <reference lib="webworker" />
import { CACHE_EXPIRATION_MS, CACHE_NAME } from "../service-worker";

/*
 * Makes the API call
 * Stores response in cache
 * Calls function to clean up cache
 */
export async function fetchWithCache(
  url: string,
  event: ExtendableMessageEvent,
  type: string
) {
  try {
    const response = await fetch(url, {
      headers: {
        "Cache-Control": "max-age=3600, stale-while-revalidate=86400",
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    // Send the data back to component
    event.source?.postMessage({
      type,
      data,
    });

    // Store the data in cache
    const cache = await caches.open(CACHE_NAME);
    await cache.put(url, new Response(JSON.stringify(data)));

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    event.source?.postMessage({ error: "Failed to fetch data." });
  }
}

/*
 * Cleans up stale cache entries based on expiration
 */
export const cleanCache = async (cache: Cache) => {
  const keys = await cache.keys();
  for (const request of keys) {
    const cachedResponse = await cache.match(request);
    const dateHeader = cachedResponse?.headers.get("Date");

    if (
      dateHeader &&
      new Date(dateHeader).getTime() + CACHE_EXPIRATION_MS < Date.now()
    ) {
      await cache.delete(request);
      console.log("Deleted cached response for", request.url);
    }
  }
};

/*
 * Returns cache response if url matches
 * Checks if the cache entry is expired, returns null if expired or no match
 */
export const getCachedResponse = async (url: string) => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(url);

  if (cachedResponse) {
    const dateHeader = cachedResponse.headers.get("Date");

    if (
      dateHeader &&
      new Date(dateHeader).getTime() + CACHE_EXPIRATION_MS < Date.now()
    ) {
      console.log(`Cache expired for ${url}`);
      await cache.delete(url);
      return null;
    }

    return cachedResponse.json();
  }

  return cachedResponse;
};
