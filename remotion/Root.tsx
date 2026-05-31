import { registerRoot, Composition } from "remotion";
import { MotionVideo, MotionVideoProps } from "./MotionVideo";

const fps = 60;

const defaultProps = {
  scenes: [
    {
      type: "morphblur",
      wordA: "Lent.",
      wordB: "Rapide.",
      bg: "#000000",
      accentColor: "#ffffff",
      geo: "dots",
      durationFrames: 150,
    },
    {
      type: "morphscale",
      wordA: "Cher.",
      wordB: "Gratuit.",
      bg: "#ffffff",
      accentColor: "#000000",
      geo: "circles",
      durationFrames: 150,
    },
    {
      type: "morphblur",
      wordA: "Avant.",
      wordB: "Après.",
      bg: "#000000",
      accentColor: "#10B981",
      geo: "grid",
      durationFrames: 150,
    },
    {
      type: "morphscale",
      wordA: "Complexe.",
      wordB: "Simple.",
      bg: "#ffffff",
      accentColor: "#000000",
      geo: "diagonal",
      durationFrames: 150,
    },
  ],
  sceneDurations: Array.from({ length: 4 }, (_, i) => ({
    startFrame: i * 150,
    durationFrames: 150,
  })),
  totalFrames: 600,
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
          : 600;

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
