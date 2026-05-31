const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../remotion/templates/scenes.tsx");
let lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

const findIndex = (pattern) =>
  lines.findIndex((l) => (typeof pattern === "string" ? l.includes(pattern) : pattern.test(l)));

const deleteRange = (startLine1, endLine1Inclusive) => {
  const start = startLine1 - 1;
  const count = endLine1Inclusive - startLine1 + 1;
  lines.splice(start, count);
};

const APPLE_SCENES = `
const EASE_OUT = E_OUT;
const EASE_IN = E_IN;

// ─── 1. WORDS UP ──────────────────────────────────────
export const WordsUpScene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bg = scene.bg || "#000000";
  const words = (scene.text || "").split(" ");
  const fontSize = autoFontSize(scene.text || "", 140, 48);
  const fadeOut = interpolate(frame, [Math.max(0, durationInFrames - 24), Math.max(1, durationInFrames)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN });

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <GeoBackground bg={bg} geo={scene.geo || "dots"} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", opacity: fadeOut }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25em" }}>
          {words.map((word, i) => {
            const delay = i * 6;
            const progress = interpolate(Math.max(0, frame - delay), [0, 28], [0, 1], { extrapolateRight: "clamp", easing: EASE_OUT });
            return (
              <span key={i} style={{
                fontSize, fontWeight: 600, fontFamily: FONT,
                letterSpacing: "-0.03em", lineHeight: 1.2,
                color: textColor(bg),
                display: "inline-block",
                opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
                transform: \`translateY(\${interpolate(progress, [0, 1], [28, 0])}px)\`,
              }}>{word}</span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 2. WORDS DOWN ────────────────────────────────────
export const WordsDownScene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bg = scene.bg || "#000000";
  const words = (scene.text || "").split(" ");
  const fontSize = autoFontSize(scene.text || "", 140, 48);
  const fadeOut = interpolate(frame, [Math.max(0, durationInFrames - 24), Math.max(1, durationInFrames)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN });

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <GeoBackground bg={bg} geo={scene.geo || "grid"} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", opacity: fadeOut }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25em" }}>
          {words.map((word, i) => {
            const delay = i * 6;
            const progress = interpolate(Math.max(0, frame - delay), [0, 28], [0, 1], { extrapolateRight: "clamp", easing: EASE_OUT });
            return (
              <span key={i} style={{
                fontSize, fontWeight: 600, fontFamily: FONT,
                letterSpacing: "-0.03em", lineHeight: 1.2,
                color: textColor(bg),
                display: "inline-block",
                opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
                transform: \`translateY(\${interpolate(progress, [0, 1], [-28, 0])}px)\`,
              }}>{word}</span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 3. LETTERS UP ────────────────────────────────────
export const LettersUpScene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bg = scene.bg || "#000000";
  const letters = (scene.text || "").split("");
  const fontSize = autoFontSize(scene.text || "", 140, 48);
  const fadeOut = interpolate(frame, [Math.max(0, durationInFrames - 24), Math.max(1, durationInFrames)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN });

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <GeoBackground bg={bg} geo={scene.geo || "circles"} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", opacity: fadeOut }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {letters.map((letter, i) => {
            const delay = i * 3;
            const progress = interpolate(Math.max(0, frame - delay), [0, 22], [0, 1], { extrapolateRight: "clamp", easing: EASE_OUT });
            return (
              <span key={i} style={{
                fontSize, fontWeight: 600, fontFamily: FONT,
                letterSpacing: "-0.02em", lineHeight: 1.2,
                color: textColor(bg),
                display: "inline-block",
                opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
                transform: \`translateY(\${interpolate(progress, [0, 1], [24, 0])}px)\`,
              }}>{letter === " " ? "\u00A0" : letter}</span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 4. LETTERS DOWN ──────────────────────────────────
export const LettersDownScene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bg = scene.bg || "#000000";
  const letters = (scene.text || "").split("");
  const fontSize = autoFontSize(scene.text || "", 140, 48);
  const fadeOut = interpolate(frame, [Math.max(0, durationInFrames - 24), Math.max(1, durationInFrames)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN });

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <GeoBackground bg={bg} geo={scene.geo || "diagonal"} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", opacity: fadeOut }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {letters.map((letter, i) => {
            const delay = i * 3;
            const progress = interpolate(Math.max(0, frame - delay), [0, 22], [0, 1], { extrapolateRight: "clamp", easing: EASE_OUT });
            return (
              <span key={i} style={{
                fontSize, fontWeight: 600, fontFamily: FONT,
                letterSpacing: "-0.02em", lineHeight: 1.2,
                color: textColor(bg),
                display: "inline-block",
                opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
                transform: \`translateY(\${interpolate(progress, [0, 1], [-24, 0])}px)\`,
              }}>{letter === " " ? "\u00A0" : letter}</span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 5. WORDS UP BLUR ─────────────────────────────────
export const WordsUpBlurScene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bg = scene.bg || "#000000";
  const words = (scene.text || "").split(" ");
  const fontSize = autoFontSize(scene.text || "", 140, 48);
  const fadeOut = interpolate(frame, [Math.max(0, durationInFrames - 24), Math.max(1, durationInFrames)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN });

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <GeoBackground bg={bg} geo={scene.geo || "cross"} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", opacity: fadeOut }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25em" }}>
          {words.map((word, i) => {
            const delay = i * 6;
            const progress = interpolate(Math.max(0, frame - delay), [0, 32], [0, 1], { extrapolateRight: "clamp", easing: EASE_OUT });
            return (
              <span key={i} style={{
                fontSize, fontWeight: 600, fontFamily: FONT,
                letterSpacing: "-0.03em", lineHeight: 1.2,
                color: textColor(bg),
                display: "inline-block",
                opacity: interpolate(progress, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }),
                transform: \`translateY(\${interpolate(progress, [0, 1], [28, 0])}px)\`,
                filter: \`blur(\${interpolate(progress, [0, 0.6, 1], [14, 3, 0])}px)\`,
              }}>{word}</span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 6. WORDS IN LEFT ─────────────────────────────────
export const WordsInLeftScene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bg = scene.bg || "#000000";
  const words = (scene.text || "").split(" ");
  const fontSize = autoFontSize(scene.text || "", 140, 48);
  const fadeOut = interpolate(frame, [Math.max(0, durationInFrames - 24), Math.max(1, durationInFrames)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN });

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <GeoBackground bg={bg} geo={scene.geo || "lines"} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", opacity: fadeOut }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25em" }}>
          {words.map((word, i) => {
            const delay = i * 6;
            const progress = interpolate(Math.max(0, frame - delay), [0, 28], [0, 1], { extrapolateRight: "clamp", easing: EASE_OUT });
            return (
              <span key={i} style={{
                fontSize, fontWeight: 600, fontFamily: FONT,
                letterSpacing: "-0.03em", lineHeight: 1.2,
                color: textColor(bg),
                display: "inline-block",
                opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
                transform: \`translateX(\${interpolate(progress, [0, 1], [-36, 0])}px)\`,
              }}>{word}</span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── 7. WORDS RIGHT ───────────────────────────────────
export const WordsRightScene: React.FC<{ scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bg = scene.bg || "#000000";
  const words = (scene.text || "").split(" ");
  const fontSize = autoFontSize(scene.text || "", 140, 48);

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <GeoBackground bg={bg} geo={scene.geo || "radial"} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.25em" }}>
          {words.map((word, i) => {
            const delay = i * 6;
            const enterProgress = interpolate(Math.max(0, frame - delay), [0, 28], [0, 1], { extrapolateRight: "clamp", easing: EASE_OUT });
            const exitDelay = (words.length - 1 - i) * 4;
            const wordExit = interpolate(Math.max(0, frame - Math.max(0, durationInFrames - 24) - exitDelay), [0, 20], [0, 1], { extrapolateRight: "clamp", easing: EASE_IN });

            return (
              <span key={i} style={{
                fontSize, fontWeight: 600, fontFamily: FONT,
                letterSpacing: "-0.03em", lineHeight: 1.2,
                color: textColor(bg),
                display: "inline-block",
                opacity: Math.max(0, interpolate(enterProgress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }) - wordExit),
                transform: \`translateX(\${interpolate(enterProgress, [0, 1], [-36, 0])}px) translateX(\${interpolate(wordExit, [0, 1], [0, 40])}px)\`,
              }}>{word}</span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
`;

// Delete bottom-up (1-based line numbers from original file)
deleteRange(6073, 6480);
deleteRange(3963, 4740);
deleteRange(1948, 2081);
deleteRange(743, 1417);

// Re-find insert point after deletions
const insertAt = findIndex("// ─── GEO BG TEST");
if (insertAt === -1) throw new Error("GEO BG TEST marker not found");

lines.splice(insertAt, 0, ...APPLE_SCENES.trim().split("\n"), "");

lines = lines.join("\n").split(/\r?\n/);

let content = lines.join("\n");
lines = content.split(/\r?\n/);

const removedTypes = [
  "singleword", "maskreveal", "slideword", "zoomword", "fadeupl", "blurin",
  "scalein", "slideup", "cliptop", "staggerwords", "fadepure", "tracking",
  "rotatein", "accentword", "underline", "colorletters", "gradienttext",
  "eraseletters", "splitlines", "twolines", "weightreveal", "hierarchytext",
  "spotlight", "karaoke", "wordgroups", "strobe", "explode", "parallax", "repeatcut",
];

for (const t of removedTypes) {
  content = content.replace(new RegExp(`\\s*\\| "${t}"\\n`, "g"), "\n");
}

const appleTypes = `    | "wordsup"
    | "wordsdown"
    | "lettersup"
    | "lettersdown"
    | "wordsupblur"
    | "wordsinleft"
    | "wordsright"
`;

if (!content.includes('| "wordsup"')) {
  content = content.replace(
    /(export type SceneData = \{\s*type:\s*\n)/,
    `$1${appleTypes}`,
  );
}

fs.writeFileSync(file, content);
console.log("Done. Lines:", lines.length);
