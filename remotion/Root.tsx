import { registerRoot, Composition } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { MotionVideo, MotionVideoProps } from "./MotionVideo";

loadFont("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const fps = 60;

const defaultProps = {
  scenes: [
    {
      type: "lettersup",
      text: "Motionr.",
      bg: "#000000",
      accentColor: "#10B981",
      geo: "dots",
      durationFrames: 80,
    },
    {
      type: "wordsupblur",
      text: "Crée sans limite.",
      bg: "#ffffff",
      accentColor: "#000000",
      geo: "grid",
      durationFrames: 100,
    },
    {
      type: "counter",
      text: "vidéos générées",
      bg: "#000000",
      accentColor: "#10B981",
      geo: "circles",
      counterTo: 12400,
      durationFrames: 150,
    },
    {
      type: "lettersdown",
      text: "Commence.",
      bg: "#ffffff",
      accentColor: "#000000",
      geo: "diagonal",
      durationFrames: 80,
    },
  ],
  sceneDurations: (() => {
    const durations = [80, 100, 150, 80];
    let current = 0;
    return durations.map((d) => {
      const result = { startFrame: current, durationFrames: d };
      current += d;
      return result;
    });
  })(),
  totalFrames: 410,
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
          : 410;

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
