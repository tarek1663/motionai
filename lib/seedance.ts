import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

export async function generateSceneClip(
  visualPrompt: string,
  format: string
): Promise<string> {
  type FalVideoResult = {
    data?: { video?: { url?: string } };
    video?: { url?: string };
  };

  const result = (await fal.subscribe(
    "fal-ai/bytedance/seedance/v1/standard/text-to-video",
    {
      input: {
        prompt: visualPrompt,
        aspect_ratio: format,
        duration: 5,
        resolution: "720p",
      },
      pollInterval: 3000,
      timeout: 120000,
    }
  )) as FalVideoResult;

  const videoUrl = result?.data?.video?.url || result?.video?.url;
  if (!videoUrl) throw new Error("Seedance: no video URL returned");

  return videoUrl;
}

export async function generateAllClips(
  scenes: { visualPrompt: string }[],
  format: string,
  onProgress?: (done: number, total: number) => void
): Promise<string[]> {
  const CONCURRENCY = 2;
  const results: string[] = new Array(scenes.length);

  for (let i = 0; i < scenes.length; i += CONCURRENCY) {
    const batch = scenes.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((scene) => generateSceneClip(scene.visualPrompt, format))
    );
    batchResults.forEach((url, j) => {
      results[i + j] = url;
    });
    onProgress?.(Math.min(i + CONCURRENCY, scenes.length), scenes.length);
  }

  return results;
}
