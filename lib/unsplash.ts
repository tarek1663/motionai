import { createApi } from "unsplash-js";
import nodeFetch from "node-fetch";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
  fetch: nodeFetch as unknown as typeof fetch,
});

export async function searchImage(query: string, orientation: "portrait" | "landscape" | "squarish" = "portrait"): Promise<string | null> {
  try {
    const res = await unsplash.search.getPhotos({
      query,
      perPage: 5,
      orientation,
    });
    const photos = res.response?.results;
    if (!photos || photos.length === 0) return null;
    const photo = photos[Math.floor(Math.random() * Math.min(3, photos.length))];
    return `${photo.urls.regular}&w=600&q=80`;
  } catch (e) {
    console.error("Unsplash error:", e);
    return null;
  }
}

export async function searchMultipleImages(queries: string[]): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  for (const query of queries) {
    const url = await searchImage(query);
    if (url) results[query] = url;
  }
  return results;
}
