const fs = require("fs");
const p = "remotion/templates/scenes.tsx";
let c = fs.readFileSync(p, "utf8");
const re1 =
  /  const fadeOut = interpolate\(\s*frame,\s*\[durationInFrames - 22, durationInFrames\],\s*\[1, 0\],\s*\{[^}]+\},\s*\);/gs;
const re2 =
  /  const fadeOut = interpolate\(frame, \[durationInFrames - 22, durationInFrames\], \[1, 0\],\s*\{[^}]+\}\s*\);/gs;
let n = 0;
c = c.replace(re1, () => {
  n++;
  return "  const { opacity: fadeOut } = useAppleTiming();";
});
c = c.replace(re2, () => {
  n++;
  return "  const { opacity: fadeOut } = useAppleTiming();";
});
fs.writeFileSync(p, c);
console.log("replaced", n);
