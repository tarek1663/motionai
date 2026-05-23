export async function fetchMusicUrl(
  prompt: string,
  formatId: string
): Promise<string | null> {
  try {
    const res = await fetch("/api/music", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, formatId }),
    });
    const data = await res.json();
    return data.musicUrl || null;
  } catch {
    return null;
  }
}
