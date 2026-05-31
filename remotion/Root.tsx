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
    // INTRO — Impact immédiat
    {
      type: "lettersup",
      text: "Google.",
      bg: "#ffffff",
      accentColor: "#4285F4",
      geo: "dots",
      durationFrames: 90,
    },
    {
      type: "emojiburst",
      text: "L'internet mondial.",
      bg: "#000000",
      accentColor: "#4285F4",
      geo: "grid",
      emojis: ["🔍", "🌍", "💡", "⚡", "🚀"],
      durationFrames: 130,
    },

    // CONTEXTE — Histoire
    {
      type: "morphscale",
      wordA: "1998.",
      wordB: "Aujourd'hui.",
      bg: "#ffffff",
      accentColor: "#4285F4",
      geo: "circles",
      durationFrames: 160,
    },
    {
      type: "photoreveal",
      text: "Les origines.",
      bg: "#000000",
      accentColor: "#4285F4",
      geo: "diagonal",
      photoUrl:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1280",
      durationFrames: 180,
    },
    {
      type: "counter",
      text: "recherches par jour",
      bg: "#ffffff",
      accentColor: "#4285F4",
      geo: "cross",
      counterTo: 8500000000,
      durationFrames: 160,
    },

    // TRANSITION
    {
      type: "iris",
      text: "",
      bg: "#000000",
      accentColor: "#4285F4",
      geo: "dots",
      durationFrames: 45,
    },

    // IMPACT — Chiffres forts
    {
      type: "wordsupblur",
      text: "2 milliards d'utilisateurs.",
      bg: "#000000",
      accentColor: "#ffffff",
      geo: "grid",
      durationFrames: 110,
    },
    {
      type: "multistats",
      bg: "#ffffff",
      accentColor: "#4285F4",
      geo: "circles",
      stats: [
        { value: 92, label: "marché mondial", suffix: "%" },
        { value: 270, label: "produits", suffix: "" },
        { value: 1000, label: "valorisation", suffix: "B$" },
      ],
      durationFrames: 180,
    },
    {
      type: "particles",
      text: "Une décennie d'innovation.",
      bg: "#000000",
      accentColor: "#4285F4",
      geo: "diagonal",
      durationFrames: 130,
    },

    // PRODUITS — Visuels
    {
      type: "photoreveal",
      text: "Maps. Gmail. Chrome.",
      bg: "#ffffff",
      accentColor: "#4285F4",
      geo: "cross",
      photoUrl:
        "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1280",
      durationFrames: 180,
    },
    {
      type: "morphblur",
      wordA: "Chercher.",
      wordB: "Trouver.",
      bg: "#000000",
      accentColor: "#4285F4",
      geo: "lines",
      durationFrames: 160,
    },
    {
      type: "browser",
      text: "google.com",
      bg: "#ffffff",
      accentColor: "#4285F4",
      geo: "radial",
      url: "google.com",
      durationFrames: 180,
    },

    // TRANSITION
    {
      type: "diagonalwipe",
      text: "",
      bg: "#000000",
      accentColor: "#4285F4",
      geo: "dots",
      durationFrames: 45,
    },

    // CONCLUSION — Mémorable
    {
      type: "repeatcut",
      text: "Google.",
      bg: "#ffffff",
      accentColor: "#4285F4",
      geo: "grid",
      durationFrames: 90,
    },
    {
      type: "progressbar",
      text: "Domination mondiale",
      bg: "#000000",
      accentColor: "#4285F4",
      geo: "circles",
      counterTo: 92,
      durationFrames: 160,
    },
    {
      type: "lettersdown",
      text: "Don't be evil.",
      bg: "#ffffff",
      accentColor: "#4285F4",
      geo: "diagonal",
      durationFrames: 100,
    },
  ],
  sceneDurations: (() => {
    const durations = [90, 130, 160, 180, 160, 45, 110, 180, 130, 180, 160, 180, 45, 90, 160, 100];
    let current = 0;
    return durations.map((d) => {
      const result = { startFrame: current, durationFrames: d };
      current += d;
      return result;
    });
  })(),
  totalFrames: 2100,
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
          : 2100;

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
