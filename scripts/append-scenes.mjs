import fs from "fs";

const scenesPath = "C:/Users/tarek/motionai/remotion/templates/scenes.tsx";
const extractedPath = "C:/Users/tarek/motionai/scripts/_extracted-scenes.txt";

let scenes = fs.readFileSync(scenesPath, "utf8");
let newScenes = fs.readFileSync(extractedPath, "utf8");

newScenes = newScenes.replace(
  "// WORLD MAP SCENE",
  "// ─────────────────────────────────────────────────────────\n// WORLD MAP SCENE"
);

newScenes = newScenes.replace(/textColor\(bg\)/g, "getMainColor(bg)");

const oldUnion =
  '    | "particles" | "timeline" | "highlight" | "numbers" | "icon";';
const newUnion =
  '    | "particles" | "timeline" | "highlight" | "numbers" | "icon"\n' +
  '    | "worldmap" | "waveform" | "progressbars" | "quote" | "countdown"\n' +
  '    | "mirror" | "datascroll" | "burst" | "morphshapes" | "text3d" | "splitscreen";';

if (!scenes.includes(oldUnion)) {
  throw new Error("SceneData union not found");
}
scenes = scenes.replace(oldUnion, newUnion);
scenes = scenes.trimEnd() + "\n\n" + newScenes.trim() + "\n";

fs.writeFileSync(scenesPath, scenes);
console.log("scenes.tsx updated");
