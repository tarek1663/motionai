const fs = require("fs");
const path = require("path");

const scenesPath = path.join(__dirname, "..", "remotion", "templates", "scenes.tsx");
let content = fs.readFileSync(scenesPath, "utf8");

if (!content.includes("const useContinuousMotion")) {
  const hook = `
const useContinuousMotion = (intensity = 1) => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame * 0.05) * 0.004 * intensity;
  const floatY = Math.sin(frame * 0.04) * 1.5 * intensity;
  const microRotate = Math.sin(frame * 0.03) * 0.15 * intensity;
  return { breathe, floatY, microRotate };
};
`;
  content = content.replace("const MotionBlurWrapper:", `${hook}\nconst MotionBlurWrapper:`);
}

content = content.replace(
  /(export const \w+Scene: React\.FC<\{ scene: SceneData \}> = \(\{ scene \}\) => \{[\s\S]*?const \{ fps, durationInFrames \} = useVideoConfig\(\);)(\r?\n)(?!  const motion = useContinuousMotion)/g,
  "$1$2  const motion = useContinuousMotion();$2"
);

content = content.replace(
  /(export const \w+Scene: React\.FC<\{ scene: SceneData \}> = \(\{ scene \}\) => \{[\s\S]*?const \{ durationInFrames \} = useVideoConfig\(\);)(\r?\n)(?!  const motion = useContinuousMotion)/g,
  "$1$2  const motion = useContinuousMotion();$2"
);

const replacements = [
  [
    /translateY\(\$\{y\}px\) scale\(\$\{scale\}\)/g,
    "translateY(${y + motion.floatY}px) scale(${scale * motion.breathe})",
  ],
  [
    /translateY\(\$\{y\}px\) rotate\(\$\{rotate\}deg\)/g,
    "translateY(${y + motion.floatY}px) rotate(${rotate + motion.microRotate}deg) scale(${motion.breathe})",
  ],
  [
    /translateY\(\$\{textY\}px\)/g,
    "translateY(${textY + motion.floatY}px) scale(${motion.breathe})",
  ],
  [
    /translateY\(\$\{y \+ yOut\}px\)/g,
    "translateY(${y + yOut + motion.floatY}px) scale(${motion.breathe})",
  ],
  [
    /transform: `scale\(\$\{scale\}\)`,/g,
    "transform: `scale(${scale * motion.breathe}) translateY(${motion.floatY}px)`,",
  ],
  [
    /translateY\(\$\{interpolate\(enter, \[0, 1\], \[40, 0\]\)\}px\)/g,
    "translateY(${interpolate(enter, [0, 1], [40, 0]) + motion.floatY}px) scale(${motion.breathe})",
  ],
  [
    /translateY\(\$\{interpolate\(enter, \[0, 1\], \[50, 0\]\)\}px\) rotate\(\$\{interpolate\(enter, \[0, 1\], \[4, 0\]\)\}deg\)/g,
    "translateY(${interpolate(enter, [0, 1], [50, 0]) + motion.floatY}px) rotate(${interpolate(enter, [0, 1], [4, 0]) + motion.microRotate}deg) scale(${motion.breathe})",
  ],
  [
    /translateY\(\$\{interpolate\(enter, \[0, 1\], \[30, 0\]\)\}px\)/g,
    "translateY(${interpolate(enter, [0, 1], [30, 0]) + motion.floatY}px) scale(${motion.breathe})",
  ],
  [
    /translateY\(\$\{interpolate\(textEnter, \[0, 1\], \[20, 0\]\)\}px\)/g,
    "translateY(${interpolate(textEnter, [0, 1], [20, 0]) + motion.floatY}px) scale(${motion.breathe})",
  ],
  [
    /scale\(\$\{interpolate\(textEnter, \[0, 1\], \[0\.92, 1\]\)\}\)/g,
    "scale(${interpolate(textEnter, [0, 1], [0.92, 1]) * motion.breathe}) translateY(${motion.floatY}px)",
  ],
  [
    /translateY\(\$\{interpolate\(enter, \[0, 1\], \[30, 0\]\)\}px\) scale\(\$\{interpolate\(enter, \[0, 1\], \[0\.88, 1\]\)\}\)/g,
    "translateY(${interpolate(enter, [0, 1], [30, 0]) + motion.floatY}px) scale(${interpolate(enter, [0, 1], [0.88, 1]) * motion.breathe})",
  ],
  [
    /translateY\(\$\{interpolate\(enter, \[0, 1\], \[40, 0\]\)\}px\) scale\(\$\{interpolate\(enter, \[0, 1\], \[0\.94, 1\]\)\}\)/g,
    "translateY(${interpolate(enter, [0, 1], [40, 0]) + motion.floatY}px) scale(${interpolate(enter, [0, 1], [0.94, 1]) * motion.breathe})",
  ],
];

for (const [pattern, replacement] of replacements) {
  content = content.replace(pattern, replacement);
}

fs.writeFileSync(scenesPath, content);
const motionCount = (content.match(/const motion = useContinuousMotion\(\)/g) || []).length;
console.log(`Patched scenes.tsx — ${motionCount} scenes with continuous motion`);
