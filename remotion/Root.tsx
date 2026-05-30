import { registerRoot, Composition } from "remotion";
import { MotionVideo, MotionVideoProps } from "./MotionVideo";

const fps = 60;

const defaultProps = {
  scenes: [
    {
      type: "emoji",
      text: "Performance.",
      bg: "#000000",
      accentColor: "#ffffff",
      geo: "dots",
      emoji: "👟",
      durationFrames: 120,
    },
    {
      type: "emojiburst",
      text: "Just Do It.",
      bg: "#ffffff",
      accentColor: "#000000",
      geo: "grid",
      emojis: ["👟", "🏃", "💪", "🏆", "⚡"],
      durationFrames: 150,
    },
    {
      type: "particles",
      text: "Premium.",
      bg: "#000000",
      accentColor: "#10B981",
      geo: "circles",
      durationFrames: 120,
    },
    {
      type: "emoji",
      text: "Mondial.",
      bg: "#ffffff",
      accentColor: "#000000",
      geo: "diagonal",
      emoji: "🌍",
      durationFrames: 120,
    },
  ],
  sceneDurations: Array.from({ length: 4 }, (_, i) => ({
    startFrame: i * 130,
    durationFrames: 130,
  })),
  totalFrames: 520,
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
          : 520;

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
