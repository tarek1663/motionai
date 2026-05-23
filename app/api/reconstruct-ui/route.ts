import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const formData  = await req.formData();
    const file      = formData.get("file") as File;
    const intent    = (formData.get("intent") as string) || "";
    const duration  = (formData.get("duration") as string) || "30";

    if (!file) return NextResponse.json({ error: "Image requise" }, { status: 400 });

    const buffer   = Buffer.from(await file.arrayBuffer());
    const ext      = file.type.includes("png") ? "png" : "jpg";
    const filename = `ui_${uuidv4().slice(0, 8)}.${ext}`;
    const dir      = path.join(process.cwd(), "public", "photos");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer);

    const base64    = buffer.toString("base64");
    const mediaType = (file.type || `image/${ext}`) as "image/jpeg" | "image/png" | "image/webp";
    const wordsCount = Math.round(parseInt(duration, 10) * 2.2);

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 6000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: `Tu es un expert React/CSS. Analyse cette interface et recrée-la FIDÈLEMENT en React TSX.
${intent ? `Intention utilisateur: "${intent}"` : ""}

SCRIPT VOIX OFF — écris exactement ${wordsCount} mots au total:
RÈGLES STRICTES pour voiceoverText (compatible ElevenLabs):
- 1 phrase par ligne, UNIQUEMENT séparées par \\n (pas de point en fin de ligne sauf dernière)
- 4-6 mots MAX par phrase
- Phrases simples, courtes, style Apple — pas de virgules ni parenthèses
- 1ère ligne = nom du produit seul
- Dernière ligne = appel à l'action court (3-5 mots)
- EN FRANÇAIS
${intent ? `Objectif: ${intent}` : "Vidéo de présentation premium"}

RETOURNE UNIQUEMENT CE JSON (pas de markdown, pas de backticks):
{
  "productName": "nom exact du produit visible",
  "accentColor": "#hex couleur principale exacte de la marque",
  "mockupType": "browser|phone|macbook",
  "voiceoverText": "Écris exactement ${wordsCount} mots — 1 phrase par ligne (\\n), 4-6 mots max par phrase, style Apple, sans ponctuation complexe, exemple:\\nNomProduit\\nPhrase courte\\nAutre phrase\\nEssayer maintenant",
  "componentCode": "LE CODE TSX ICI"
}

Pour componentCode, génère un composant React qui:
1. Reproduit FIDÈLEMENT ce que tu vois - mêmes couleurs exactes, même layout, mêmes textes visibles
2. Est un composant React PUR - pas d'imports, juste le JSX retourné
3. Utilise UNIQUEMENT des styles inline (pas de className, pas de CSS externe)
4. Dimensions: width 100%, height 100%
5. Inclut des animations subtiles:
   - Les chiffres/stats s'incrémentent avec interpolate(frame, [0,60], [0, valeur_finale])
   - Les éléments apparaissent avec opacity interpolate(frame - delay, [0,20], [0,1])
   - Un scroll lent: translateY(-interpolate(frame, [0,120], [0, 150]))
   - Les barres/graphiques se remplissent progressivement
6. Utilise les variables disponibles: frame (number), useCurrentFrame, interpolate, spring depuis "remotion"
7. COPIE EXACTEMENT les couleurs, textes, logos, icônes visibles dans le screenshot
8. Si tu vois un graphique → recrée-le avec des div ou SVG
9. Si tu vois des stats → anime les compteurs
10. Si tu vois une sidebar → recrée-la avec les vrais items

EXEMPLE de componentCode minimal:
(() => {
  const frame = useCurrentFrame();
  const scrollY = interpolate(frame, [0, 120], [0, 100], {extrapolateRight: 'clamp'});
  return (
    <div style={{width:'100%',height:'100%',background:'#ffffff',fontFamily:'Geist,sans-serif',overflow:'hidden'}}>
      <div style={{transform:\`translateY(-\${scrollY}px)\`}}>
        <div style={{padding:'20px',borderBottom:'1px solid #f0f0f0',display:'flex',alignItems:'center',gap:'12px'}}>
          <span style={{fontSize:'18px',fontWeight:800,color:'#635bff'}}>Stripe</span>
        </div>
      </div>
    </div>
  );
})`,
          },
        ],
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    let clean  = text.trim();

    if (clean.startsWith("```")) {
      clean = clean.replace(/^```json?\n?/m, "").replace(/\n?```$/m, "").trim();
    }
    const s = clean.indexOf("{");
    const e = clean.lastIndexOf("}");
    if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);

    clean = clean.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "");

    let result: Record<string, unknown> = {};
    try {
      result = JSON.parse(clean) as Record<string, unknown>;
    } catch (parseErr) {
      console.error("Parse error:", parseErr);
      result = {
        productName: "Produit",
        accentColor: "#7C3AED",
        mockupType: "browser",
        voiceoverText: "MotionAI\nInterface moderne\nSimple et efficace\nPour tous vos besoins\nEssayer maintenant",
        componentCode: `(() => {
  const frame = useCurrentFrame();
  return (
    <div style={{width:'100%',height:'100%',background:'#ffffff',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <img src={staticFile('photos/${filename}')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} />
    </div>
  );
})`,
      };
    }

    return NextResponse.json({
      ...result,
      photoUrl: `/photos/${filename}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Reconstruct error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
