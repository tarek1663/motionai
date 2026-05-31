import { registerRoot, Composition } from "remotion";
import { MotionVideo, MotionVideoProps } from "./MotionVideo";

const fps = 60;

const defaultProps = {
  scenes: [
    {
      type: "wordsup",
      text: "Just Do It.",
      bg: "#000000",
      accentColor: "#ffffff",
      geo: "dots",
      durationFrames: 90,
    },
    {
      type: "wordsdown",
      text: "La musique change tout.",
      bg: "#ffffff",
      accentColor: "#000000",
      geo: "grid",
      durationFrames: 100,
    },
    {
      type: "lettersup",
      text: "Nike.",
      bg: "#000000",
      accentColor: "#ffffff",
      geo: "circles",
      durationFrames: 90,
    },
    {
      type: "lettersdown",
      text: "Spotify.",
      bg: "#ffffff",
      accentColor: "#1DB954",
      geo: "diagonal",
      durationFrames: 90,
    },
    {
      type: "wordsupblur",
      text: "Partout dans le monde.",
      bg: "#000000",
      accentColor: "#ffffff",
      geo: "cross",
      durationFrames: 110,
    },
    {
      type: "wordsinleft",
      text: "750 millions.",
      bg: "#1DB954",
      accentColor: "#ffffff",
      geo: "lines",
      durationFrames: 90,
    },
    {
      type: "wordsright",
      text: "Commence.",
      bg: "#000000",
      accentColor: "#ffffff",
      geo: "radial",
      durationFrames: 90,
    },
  ],
  sceneDurations: Array.from({ length: 7 }, (_, i) => ({
    startFrame: i * 95,
    durationFrames: 95,
  })),
  totalFrames: 665,
  audioSrc: null,
  musicSrc: null,
  musicVolume: 0.12,
} as MotionVideoProps;

const RemotionRoot = () => (
  <Composition
    id="MotionVideo"
    component={MotionVideo}
    durationInFrames={defaultProps.totalFrames || 1800}
    fps={fps}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={async ({ props }) => {
      const p = props as MotionVideoProps;
      const sceneDurationsAdjusted = (p.sceneDurations || []).map((d) => {
        if (typeof d === "number") return Math.max(40, d);
        return {
          ...d,
          durationFrames: Math.max(40, d.durationFrames || 40),
        };
      });

      const total =
        Number.isFinite(p.totalFrames) && p.totalFrames > 0
          ? p.totalFrames
          : 665;

      const fmt = (p as { format?: string }).format || "9:16";
      const w = fmt === "16:9" ? 1920 : 1080;
      const h = fmt === "16:9" ? 1080 : fmt === "1:1" ? 1080 : 1920;

      return {
        durationInFrames: total,
        fps,
        width: w,
        height: h,
        props: {
          ...p,
          sceneDurations: sceneDurationsAdjusted,
          totalFrames: total,
        },
      };
    }}
  />
);

registerRoot(RemotionRoot);
