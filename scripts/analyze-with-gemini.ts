import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function analyzeWithGemini() {
  const referenceDir = path.join(process.cwd(), "reference");
  const outputPath = path.join(referenceDir, "style-guide.json");

  const videoFiles = ["reference1.mp4", "reference2.mp4", "reference3.mp4"]
    .filter(f => fs.existsSync(path.join(referenceDir, f)));

  if (videoFiles.length === 0) {
    console.error("Aucune vidéo trouvée dans reference/");
    process.exit(1);
  }

  console.log(`Analyse de ${videoFiles.length} vidéo(s) avec Gemini 2.0 Flash...`);

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const analyses = [];

  for (const videoFile of videoFiles) {
    console.log(`\nAnalyse de ${videoFile}...`);
    const videoPath = path.join(referenceDir, videoFile);
    const videoData = fs.readFileSync(videoPath);
    const base64Video = videoData.toString("base64");
    const mimeType = "video/mp4";

    const prompt = `Analyse cette vidéo de motion design et extrais UNIQUEMENT le style visuel.

NE mentionne JAMAIS les marques, logos, produits ou personnes spécifiques.
Concentre-toi UNIQUEMENT sur la structure et le design.

Analyse précisément:
1. Le RYTHME: durée moyenne des scènes, vitesse des coupes, énergie générale
2. La TYPOGRAPHIE: taille, poids, position, casse, comment les mots apparaissent
3. Les COULEURS: fonds, textes, accents, ambiance générale
4. Les TRANSITIONS: type (cut, wipe, fade, slide), vitesse, style
5. La COMPOSITION: centré, split, plein écran, asymétrique
6. Les EFFETS: zoom, blur, glitch, particles, light leaks, motion blur
7. Les ANIMATIONS de texte: mot par mot, révélation, zoom blast, slide
8. L'AMBIANCE: dynamique, posée, brutale, élégante, fun, sérieuse

Retourne UNIQUEMENT un JSON valide:
{
  "description": "description précise du style en 3-4 phrases",
  "rhythm": {
    "avgSceneDuration": number,
    "energy": "slow"|"medium"|"fast"|"ultra-fast",
    "cutStyle": "soft"|"hard"|"dynamic"
  },
  "typography": {
    "dominantSize": "small"|"medium"|"large"|"massive",
    "weight": "light"|"regular"|"bold"|"black",
    "position": "center"|"left"|"right"|"dynamic"|"mixed",
    "casing": "uppercase"|"mixed"|"lowercase",
    "animationStyle": "wordPop"|"slideUp"|"clipReveal"|"scaleIn"|"fadeIn"|"typewriter"
  },
  "colors": {
    "backgrounds": ["#hex1", "#hex2"],
    "textColors": ["#hex1"],
    "accentColors": ["#hex1", "#hex2"],
    "mood": "dark"|"light"|"colorful"|"monochrome"
  },
  "transitions": {
    "type": "wipe"|"flip"|"fade"|"slide"|"cut",
    "speed": "instant"|"fast"|"medium",
    "style": "brutal"|"smooth"|"cinematic"
  },
  "composition": {
    "layout": "fullscreen"|"split"|"centered"|"asymmetric",
    "useImages": boolean,
    "useStats": boolean,
    "usePhone": boolean
  },
  "effects": {
    "motionBlur": boolean,
    "glitch": boolean,
    "particles": boolean,
    "lightLeaks": boolean,
    "zoom": boolean,
    "vignette": boolean
  },
  "sceneTypes": ["statement","split","iphone","badge","stat","cta"],
  "textAnimations": ["wordPop","slideUp","clipReveal"],
  "overallStyle": "description courte du style global en 1 phrase"
}`;

    try {
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType,
            data: base64Video,
          }
        },
        prompt
      ]);

      const text = result.response.text();
      const clean = text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
      const analysis = JSON.parse(clean);
      analyses.push({ file: videoFile, analysis });
      console.log(`✓ ${videoFile}: ${analysis.overallStyle}`);
    } catch (e: any) {
      console.error(`Erreur pour ${videoFile}:`, e.message);
    }
  }

  if (analyses.length === 0) {
    console.error("Aucune analyse réussie.");
    process.exit(1);
  }

  // Fusionner les analyses
  console.log("\nFusion des analyses...");

  let styleGuide;

  if (analyses.length === 1) {
    styleGuide = analyses[0].analysis;
  } else {
    const mergePrompt = `Voici les analyses de ${analyses.length} vidéos de motion design:

${JSON.stringify(analyses, null, 2)}

Fusionne ces analyses en un style guide unifié qui capture l'essence commune.
Retourne UNIQUEMENT un JSON valide avec la même structure, représentant le style fusionné.
Ajoute un champ "description" détaillé en 3-4 phrases.`;

    const mergeResult = await model.generateContent(mergePrompt);
    const mergeText = mergeResult.response.text();
    const mergeClean = mergeText.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
    styleGuide = JSON.parse(mergeClean);
  }

  fs.writeFileSync(outputPath, JSON.stringify(styleGuide, null, 2));

  console.log("\n✅ Style guide généré:", outputPath);
  console.log("\nStyle détecté:", styleGuide.overallStyle);
  console.log("Description:", styleGuide.description);
  console.log("\nContenu complet:");
  console.log(JSON.stringify(styleGuide, null, 2));
}

analyzeWithGemini().catch(console.error);
