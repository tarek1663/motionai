export const RENDER_STORAGE_KEY = "motionr_render";

/** Durée max d'un rendu en cours (30 min) */
export const MAX_RENDERING_AGE_MS = 30 * 60 * 1000;

/** Durée d'affichage de la notif « Vidéo générée » */
export const DONE_VISIBLE_MS = 90 * 1000;

export type RenderStorageStatus = "queued" | "rendering" | "done" | "error";

export type RenderStorageData = {
  jobId: string;
  prompt?: string;
  progress?: number;
  status?: RenderStorageStatus;
  videoUrl?: string;
  timestamp: number;
  doneAt?: number;
  userId?: string;
};

export function readRenderStorage(): RenderStorageData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(RENDER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RenderStorageData;
  } catch {
    localStorage.removeItem(RENDER_STORAGE_KEY);
    return null;
  }
}

export function writeRenderStorage(data: RenderStorageData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RENDER_STORAGE_KEY, JSON.stringify(data));
}

export function clearRenderStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RENDER_STORAGE_KEY);
}

export function patchRenderStorage(patch: Partial<RenderStorageData>) {
  const current = readRenderStorage();
  if (!current) return;
  writeRenderStorage({ ...current, ...patch });
}

export function saveRenderJob(jobId: string, prompt: string, userId?: string | null) {
  writeRenderStorage({
    jobId,
    prompt,
    progress: 0,
    status: "rendering",
    timestamp: Date.now(),
    userId: userId ?? undefined,
  });
}

/** Retourne null si la donnée doit être ignorée / purgée */
export function normalizeRenderStorage(
  data: RenderStorageData,
  currentUserId?: string | null
): RenderStorageData | null {
  const age = Date.now() - data.timestamp;

  if (currentUserId && data.userId && data.userId !== currentUserId) {
    return null;
  }

  if (data.status === "done" || data.status === "error") {
    const doneAt = data.doneAt ?? Date.now();
    const normalized = { ...data, doneAt };
    if (!data.doneAt) {
      writeRenderStorage(normalized);
    }
    if (Date.now() - doneAt > DONE_VISIBLE_MS) {
      return null;
    }
    return normalized;
  }

  if (age > MAX_RENDERING_AGE_MS) {
    return null;
  }

  return data;
}
