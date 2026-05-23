export type MusicGenre = {
  keyword: string;
  mood: string;
};

export function detectMusicGenre(prompt: string, formatId: string): MusicGenre {
  const p = prompt.toLowerCase();

  if (p.match(/motivat|sport|fitness|énergie|running|gym|champion/))
    return { keyword: "motivation", mood: "energetic" };
  if (p.match(/luxe|mode|fashion|élégance|premium|chanel|dior/))
    return { keyword: "piano", mood: "elegant" };
  if (p.match(/tech|ia|intelligence|robot|futur|digital|startup/))
    return { keyword: "electronic", mood: "tech" };
  if (p.match(/documentaire|histoire|civilisation|guerre|empire/))
    return { keyword: "cinematic", mood: "cinematic" };
  if (p.match(/food|cuisine|recette|restaurant/))
    return { keyword: "acoustic", mood: "warm" };
  if (p.match(/voyage|travel|aventure/))
    return { keyword: "adventure", mood: "adventure" };
  if (p.match(/finance|crypto|bourse|business/))
    return { keyword: "corporate", mood: "corporate" };
  if (p.match(/science|espace|cosmos|nature/))
    return { keyword: "ambient", mood: "ambient" };
  if (p.match(/storytelling|histoire|biographie/))
    return { keyword: "emotional", mood: "emotional" };
  if (p.match(/psychologie|méditation|bien-être|sommeil/))
    return { keyword: "relaxing", mood: "calm" };
  if (p.match(/musique|concert|artiste|rap|pop|spotify/))
    return { keyword: "upbeat", mood: "music" };
  if (p.match(/gaming|jeu|esport/))
    return { keyword: "epic", mood: "epic" };

  if (formatId === "motivation")   return { keyword: "motivation", mood: "energetic" };
  if (formatId === "documentaire") return { keyword: "cinematic", mood: "cinematic" };
  if (formatId === "storytelling") return { keyword: "emotional", mood: "emotional" };
  if (formatId === "news")         return { keyword: "corporate", mood: "corporate" };
  if (formatId === "sport")        return { keyword: "sport", mood: "energetic" };

  return { keyword: "background", mood: "corporate" };
}

// Map mood → fichier local préchargé
const MUSIC_FILES: Record<string, string> = {
  energetic:  "/music/energetic.mp3",
  elegant:    "/music/elegant.mp3",
  tech:       "/music/tech.mp3",
  cinematic:  "/music/cinematic.mp3",
  warm:       "/music/corporate.mp3",
  adventure:  "/music/adventure.mp3",
  corporate:  "/music/corporate.mp3",
  ambient:    "/music/ambient.mp3",
  emotional:  "/music/emotional.mp3",
  calm:       "/music/ambient.mp3",
  music:      "/music/energetic.mp3",
  epic:       "/music/cinematic.mp3",
  playful:    "/music/corporate.mp3",
};

export function getMusicForMood(mood: string): string {
  return MUSIC_FILES[mood] || MUSIC_FILES["corporate"];
}
