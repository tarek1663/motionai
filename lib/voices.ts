export type VoiceOption = {
  id: string;
  name: string;
  gender: "homme" | "femme";
  style: string;
  previewText: string;
};

export const VOICES: VoiceOption[] = [
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    gender: "femme",
    style: "Douce & Professionnelle",
    previewText: "Bonjour, je suis Rachel. Ma voix est douce et professionnelle.",
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    gender: "femme",
    style: "Énergique & Dynamique",
    previewText: "Bonjour, je suis Domi. Ma voix est énergique et dynamique.",
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    gender: "femme",
    style: "Chaleureuse & Narrative",
    previewText: "Bonjour, je suis Bella. Ma voix est chaleureuse et narrative.",
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    gender: "homme",
    style: "Posé & Premium",
    previewText: "Bonjour, je suis Antoni. Ma voix est posée et premium.",
  },
  {
    id: "VR6AewLTigWG4xSOukaG",
    name: "Arnold",
    gender: "homme",
    style: "Grave & Impactant",
    previewText: "Bonjour, je suis Arnold. Ma voix est grave et impactante.",
  },
  {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    gender: "homme",
    style: "Clair & Narratif",
    previewText: "Bonjour, je suis Adam. Ma voix est claire et narrative.",
  },
  {
    id: "yoZ06aMxZJJ28mfd3POQ",
    name: "Sam",
    gender: "homme",
    style: "Jeune & Dynamique",
    previewText: "Bonjour, je suis Sam. Ma voix est jeune et dynamique.",
  },
  {
    id: "ThT5KcBeYPX3keUQqHPh",
    name: "Dorothy",
    gender: "femme",
    style: "Élégante & Luxe",
    previewText: "Bonjour, je suis Dorothy. Ma voix est élégante et raffinée.",
  },
];

export const DEFAULT_VOICE_ID = VOICES[0].id;
