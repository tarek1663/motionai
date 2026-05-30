import { registerRoot, Composition } from "remotion";
import { MotionVideo, MotionVideoProps } from "./MotionVideo";

const fps = 60;

const defaultProps = {
  scenes: [
    {
      type: "karaoke",
      text: "Nike révolutionne le sport mondial depuis 1964",
      bg: "#000000",
      accentColor: "#ffffff",
      geo: "dots",
      durationFrames: 180,
    },
    {
      type: "wordgroups",
      text: "Just Do It chaque jour sans exception",
      bg: "#ffffff",
      accentColor: "#000000",
      geo: "grid",
      durationFrames: 180,
    },
    {
      type: "karaoke",
      text: "Les meilleurs athlètes portent Nike partout dans le monde",
      bg: "#000000",
      accentColor: "#10B981",
      geo: "circles",
      durationFrames: 240,
    },
    {
      type: "wordgroups",
      text: "Performance style confort innovation",
      bg: "#10B981",
      accentColor: "#ffffff",
      geo: "diagonal",
      durationFrames: 160,
    },
  ],
  sceneDurations: [
    { startFrame: 0, durationFrames: 180 },
    { startFrame: 180, durationFrames: 180 },
    { startFrame: 360, durationFrames: 240 },
    { startFrame: 600, durationFrames: 160 },
  ],
  totalFrames: 760,
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
          : 760;

      const fmt = (p as { format?: string }).format || "9:16";
      const w = fmt === "16:9" ? 1920 : 1080;
      const h = fmt === "16:9" ? 1080 : fmt === "1:1" ? 1080 : 1920;

      return {
        durationInFrames: total,
        fps: 60,
        width: w,
        height: h,
        props: {
          ...p,
          sceneDurations: sceneDurationsAdjusted.length
            ? sceneDurationsAdjusted
            : p.sceneDurations,
        },
      };
    }}
  />
);

registerRoot(RemotionRoot);
