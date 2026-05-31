import { staticFile } from "remotion";

export type SfxType = "whoosh" | "click" | "ding" | "swoosh";

const SOUND_FILES: Record<SfxType, string> = {
  whoosh: "whoosh.mp3",
  click: "click.mp3",
  ding: "ding.mp3",
  swoosh: "swoosh.mp3",
};

/** Chemins vers les SFX générés (public/sfx/) — style Apple discret */
export const generateTone = (type: SfxType, _duration = 0.15): string =>
  staticFile(`sfx/${SOUND_FILES[type]}`);
