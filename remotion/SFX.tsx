import { Audio } from "remotion";
import React from "react";
import { generateTone, type SfxType } from "./sfx";

export const SFX: React.FC<{
  type: SfxType;
  volume?: number;
}> = ({ type, volume = 0.12 }) => (
  <Audio src={generateTone(type)} volume={volume} startFrom={0} />
);
