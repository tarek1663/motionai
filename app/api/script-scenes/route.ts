import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { script, format, accentColor } = await req.json();
    const prompt = `Tu es un expert en motion design et copywriting. 

L'utilisateur a écrit ce texte librement :
"${script}"

FORMAT: ${format} | COULEUR ACCENT: ${accentColor}

TON TRAVAIL EN 2 ÉTAPES :

ÉTAPE 1 — RESTRUCTURE le texte en phrases courtes et percutantes pour le motion design :
- Découpe en 4 à 10 phrases maximum
- Chaque phrase = 3 à 8 mots idéalement
- Phrases dynamiques, impactantes, rythmées
- Garde le sens original du texte
- Commence fort, termine par un appel à l'action si possible

ÉTAPE 2 — Pour chaque phrase restructurée, choisis la scène Remotion parfaite parmi :
word, split, sentence, reveal, mirror, glitch, kinetic, zoompunch, particles, burst, text3d, counter, chart, floatstats, numbers, progressbars, timeline, card, quote, highlight, icon, waveform, photo, cta, breathe, countdown, typewriter, scramble, neonglow, stamp, wavetext, outlinefill, odometer, progressring, gauge, bubblechart, notification, successcheck, likeexplosion, followercounter, starfield, aurora, matrix, countdownring, xpbar, flightboard, stockchart, hologram, moneyrain, titlecard, magnetic, gradientslide, cascade, blurfocus, particlerain, fire, snow, sunray, funnel, comparisonbars, roi, achievement, circuit, glitchscreen, pollresults, commentthread, endcredits, wipe, dollyzoom, steps, compare, quotereveal, benefits, moodboard, minimalist, gradientbg, pricereveal, logoreveal, brandintro, colorpalette, scoreboard, playerstat, menuitem, heartbeat, geometric, liquid, morphshape, dna, swipe, click, loading, waveform, vinyl, magazinecover, pullquote, infographic

RÈGLES SCÈNES :
- Varie absolument les types, ne répète jamais le même
- Alterne fonds sombres (#0a0a0a, #050510, #000800) et clairs (#ffffff, #f5f5f0)
- Utilise accentColor: "${accentColor}" partout
- Pour les chiffres/stats → counter, odometer, progressring, roi
- Pour les citations/témoignages → quotereveal, pullquote
- Pour l'appel à l'action → cta, stamp, zoompunch, click
- Pour l'ambiance/intro → starfield, aurora, gradientbg, logoreveal
- Pour les bénéfices → benefits, steps, compare
- Crée une progression visuelle cohérente du début à la fin

Réponds UNIQUEMENT en JSON valide sans markdown :
{
  "restructuredScript": "Le script restructuré complet séparé par des sauts de ligne",
  "scenes": [
    {
      "type": "typewriter",
      "text": "phrase restructurée",
      "text2": "sous-titre optionnel si pertinent",
      "bg": "#0a0a0a",
      "accentColor": "${accentColor}"
    }
  ],
  "musicUrl": null
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0].type === "text" ? response.content[0].text : "";
    const clean = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const data = JSON.parse(clean);

    return NextResponse.json({
      scenes: data.scenes,
      restructuredScript: data.restructuredScript,
      musicUrl: data.musicUrl || null,
    });
  } catch (err: any) {
    console.error("Script scenes error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
