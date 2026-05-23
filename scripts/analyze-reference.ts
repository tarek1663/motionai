import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import ffmpegPath from "ffmpeg-static";

const ffmpeg = ffmpegPath as string;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function extractFrame(videoPath: string, outputPath: string, timePercent: number) {
  try {
    const probeResult = execSync(
      `"${ffmpeg}" -i "${videoPath}" -vframes 1 -ss 1 -q:v 2 "${outputPath}" -y`,
      { stdio: "pipe" }
    );
    return true;
  } catch (e) {
    // ffmpeg retourne exit code 1 même en succès parfois
    return fs.existsSync(outputPath);
  }
}

async function analyzeReferenceVideos() {
  const referenceDir = path.join(process.cwd(), "reference");
  const outputPath = path.join(referenceDir, "style-guide.json");
  const framesDir = path.join(referenceDir, "frames");

  fs.mkdirSync(framesDir, { recursive: true });

  const videoFiles = ["reference1.mp4", "reference2.mp4", "reference3.mp4"]
    .filter(f => fs.existsSync(path.join(referenceDir, f)));

  if (videoFiles.length === 0) {
    console.error("Aucune vidéo trouvée dans reference/");
    process.exit(1);
  }

  console.log(`Analyse de ${videoFiles.length} vidéo(s)...`);

  const allFrames: { data: string; videoFile: string; position: string }[] = [];

  for (const videoFile of videoFiles) {
    console.log(`Extraction des frames de ${videoFile}...`);
    const videoPath = path.join(referenceDir, videoFile);

    for (const [pos, pct] of [["debut", 0.1], ["milieu", 0.5], ["fin", 0.85]] as [string, number][]) {
      const framePath = path.join(framesDir, `${videoFile}-${pos}.jpg`);
      const ok = extractFrame(videoPath, framePath, pct);
      if (ok && fs.existsSync(framePath)) {
        const data = fs.readFileSync(framePath).toString("base64");
        allFrames.push({ data, videoFile, position: pos });
        console.log(`  ✓ Frame ${pos} extraite`);
      }
    }
  }

  if (allFrames.length === 0) {
    console.error("Aucune frame extraite. Vérifie que ffmpeg est installé.");
    process.exit(1);
  }

  console.log(`\nEnvoi de ${allFrames.length} frames à Claude pour analyse...`);

  const imageContent = allFrames.map(f => ({
    type: "image" as const,
    source: {
      type: "base64" as const,
      media_type: "image/jpeg" as const,
      data: f.data,
    }
  }));

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: [
        ...imageContent,
        {
          type: "text",
          text: `Ces images sont des frames extraites de ${videoFiles.length} vidéo(s) de motion design de référence.

Analyse le STYLE VISUEL ET LE DESIGN UNIQUEMENT.
NE mentionne JAMAIS les marques, logos, produits ou personnes.
Concentre-toi sur la structure, le rythme, la typographie, les couleurs et les effets.

Retourne UNIQUEMENT un JSON valide:
{
  "description": "description du style en 2-3 phrases",
  "rhythm": {
    "energy": "slow"|"medium"|"fast"|"ultra-fast",
    "cutStyle": "soft"|"hard"|"dynamic"
  },
  "typography": {
    "dominantSize": "small"|"medium"|"large"|"massive",
    "weight": "light"|"regular"|"bold"|"black",
    "position": "center"|"left"|"right"|"dynamic"|"mixed",
    "casing": "uppercase"|"mixed"|"lowercase",
    "animationStyle": "wordPop"|"slideUp"|"clipReveal"|"scaleIn"|"fadeIn"
  },
  "colors": {
    "backgrounds": ["#hex"],
    "textColors": ["#hex"],
    "accentColors": ["#hex"],
    "mood": "dark"|"light"|"colorful"|"monochrome"
  },
  "transitions": {
    "type": "wipe"|"flip"|"fade"|"slide",
    "speed": "fast"|"medium",
    "style": "brutal"|"smooth"|"cinematic"
  },
  "composition": {
    "layout": "fullscreen"|"split"|"centered"|"asymmetric",
    "useImages": true|false,
    "useStats": true|false,
    "usePhone": true|false
  },
  "effects": {
    "motionBlur": true|false,
    "glitch": true|false,
    "particles": true|false,
    "lightLeaks": true|false,
    "zoom": true|false
  },
  "sceneTypes": ["statement","split","iphone","badge","stat","cta"],
  "overallStyle": "description courte du style global"
}`
        }
      ]
    }]
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  const clean = text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
  const styleGuide = JSON.parse(clean);

  fs.writeFileSync(outputPath, JSON.stringify(styleGuide, null, 2));

  console.log("\n✅ Style guide généré:", outputPath);
  console.log("\nStyle détecté:", styleGuide.overallStyle);
  console.log("Description:", styleGuide.description);
  console.log("\nContenu complet:");
  console.log(JSON.stringify(styleGuide, null, 2));
}

analyzeReferenceVideos().catch(console.error);
