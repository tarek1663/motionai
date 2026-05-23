import fs from "fs";
import path from "path";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const FPS = 60;
/** Pause entre mots (s) au-delà de laquelle on coupe une phrase */
const PHRASE_PAUSE_GAP = 0.35;

export type WordTimestamp = {
  word: string;
  start: number;
  end: number;
};

export type PhraseTimestamp = {
  phrase: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
};

function toPhraseTimestamp(
  phrase: string,
  start: number,
  end: number,
): PhraseTimestamp {
  const startFrame = Math.round(start * FPS);
  const endFrame = Math.round(end * FPS);
  return {
    phrase,
    start,
    end,
    startFrame,
    endFrame,
    durationFrames: Math.max(80, endFrame - startFrame),
  };
}

/** Phrases détectées depuis les timings ElevenLabs (pauses + ponctuation) */
function buildPhrasesFromWords(words: WordTimestamp[]): PhraseTimestamp[] {
  if (words.length === 0) return [];

  const phrases: PhraseTimestamp[] = [];
  let chunkStart = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const next = words[i + 1];
    const endsWithPunct = /[.!?…]$/.test(w.word);
    const longPause = next ? next.start - w.end >= PHRASE_PAUSE_GAP : false;
    const isLast = i === words.length - 1;

    if (endsWithPunct || longPause || isLast) {
      const slice = words.slice(chunkStart, i + 1);
      const phrase = slice.map((x) => x.word).join(" ").trim();
      if (phrase.length > 0) {
        phrases.push(
          toPhraseTimestamp(phrase, slice[0].start, slice[slice.length - 1].end),
        );
      }
      chunkStart = i + 1;
    }
  }

  return phrases;
}

/** Fallback : lignes du script si pas assez de mots alignés */
function buildPhrasesFromScriptLines(
  text: string,
  words: WordTimestamp[],
): PhraseTimestamp[] {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0 || words.length === 0) return [];

  const phrases: PhraseTimestamp[] = [];
  let wordIndex = 0;

  for (const line of lines) {
    const lineWords = line.split(/\s+/).filter((w) => w.length > 0);
    if (lineWords.length === 0) continue;

    const phraseStart = words[wordIndex]?.start ?? 0;
    wordIndex += lineWords.length;
    const phraseEnd =
      words[Math.min(wordIndex - 1, words.length - 1)]?.end ?? phraseStart + 1;

    phrases.push(toPhraseTimestamp(line, phraseStart, phraseEnd));
  }

  return phrases;
}

export async function generateVoice(
  text: string,
  outputPath?: string,
  voiceId: string = "21m00Tcm4TlvDq8ikWAM",
): Promise<{
  duration: number;
  wordTimestamps: WordTimestamp[];
  phraseTimestamps: PhraseTimestamp[];
  audioBuffer: Buffer;
}> {
  console.log("🎙️ Génération avec voiceId:", voiceId);
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs error ${response.status}: ${err}`);
  }

  const data = await response.json();

  const audioBuffer = Buffer.from(data.audio_base64, "base64");
  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, audioBuffer);
  }

  const alignment = data.alignment || data.normalized_alignment;
  if (!alignment) {
    const duration = audioBuffer.length / 24000;
    return { duration, wordTimestamps: [], phraseTimestamps: [], audioBuffer };
  }

  const chars: string[] = alignment.characters || alignment.chars || [];
  const starts: number[] =
    alignment.character_start_times_seconds || alignment.start_times || [];
  const ends: number[] =
    alignment.character_end_times_seconds || alignment.end_times || [];

  const wordTimestamps: WordTimestamp[] = [];
  let currentWord = "";
  let wordStart = 0;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (char === " " || char === "\n" || i === chars.length - 1) {
      if (char !== " " && char !== "\n") currentWord += char;
      if (currentWord.trim().length > 0) {
        wordTimestamps.push({
          word: currentWord.trim(),
          start: wordStart,
          end: ends[i] || starts[i],
        });
      }
      currentWord = "";
      wordStart = starts[i + 1] || 0;
    } else {
      if (currentWord === "") wordStart = starts[i];
      currentWord += char;
    }
  }

  // Priorité : découpage ElevenLabs (pauses réelles), sinon lignes du script
  let phraseTimestamps = buildPhrasesFromWords(wordTimestamps);
  if (phraseTimestamps.length === 0) {
    phraseTimestamps = buildPhrasesFromScriptLines(text, wordTimestamps);
  }

  const duration =
    wordTimestamps[wordTimestamps.length - 1]?.end ||
    audioBuffer.length / 24000;

  console.log(
    "🎙️ Phrases ElevenLabs:",
    phraseTimestamps.length,
    phraseTimestamps.slice(0, 3).map((p) => p.phrase),
  );

  return { duration, wordTimestamps, phraseTimestamps, audioBuffer };
}
