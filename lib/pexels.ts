import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;

export async function fetchPexelsPhoto(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );
    const data = await res.json();
    return data.photos?.[0]?.src?.large2x || data.photos?.[0]?.src?.large || null;
  } catch {
    return null;
  }
}

export async function fetchClearbitLogo(domain: string): Promise<string> {
  return `https://logo.clearbit.com/${domain}`;
}

export async function downloadPhotoToPublic(url: string, filename?: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    const ext = url.includes(".png") ? "png" : "jpg";
    const name = filename || `${uuidv4()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "photos");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), buffer);

    return `/photos/${name}`;
  } catch {
    return null;
  }
}

export async function resolvePhotoFromQuery(query: string): Promise<string | null> {
  const remoteUrl = await fetchPexelsPhoto(query);
  if (!remoteUrl) return null;
  return downloadPhotoToPublic(remoteUrl);
}
