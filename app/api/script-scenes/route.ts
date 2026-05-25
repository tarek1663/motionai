import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { script, format, accentColor } = await req.json();
    const prompt = `Tu es un expert en motion design. 

L'utilisateur a écrit ce texte qu'il veut transformer en vidéo :
"${script}"

FORMAT: ${format} | COULEUR ACCENT: ${accentColor}

TON TRAVAIL :

ÉTAPE 1 — DÉCOUPE le texte en phrases courtes pour le motion design :
- Garde ABSOLUMENT tout le contenu — ne résume pas, ne supprime rien
- Découpe uniquement là où c'est naturel (virgules, points, "et", "mais", "qui"...)
- Chaque phrase = 3 à 8 mots idéalement
- Ne change pas les mots — garde le texte original de l'utilisateur
- Respecte le sens et le ton du texte

ÉTAPE 2 — Pour chaque phrase, choisis la scène Remotion parfaite parmi :
word, split, sentence, reveal, mirror, glitch, kinetic, zoompunch, particles, burst, text3d, counter, chart, floatstats, numbers, progressbars, timeline, card, quote, highlight, icon, waveform, photo, cta, breathe, countdown, typewriter, scramble, neonglow, stamp, wavetext, outlinefill, odometer, progressring, gauge, bubblechart, notification, successcheck, likeexplosion, followercounter, starfield, aurora, matrix, countdownring, xpbar, flightboard, stockchart, hologram, moneyrain, titlecard, magnetic, gradientslide, cascade, blurfocus, particlerain, fire, snow, sunray, funnel, comparisonbars, roi, achievement, circuit, glitchscreen, pollresults, commentthread, endcredits, wipe, dollyzoom, steps, compare, quotereveal, benefits, moodboard, minimalist, gradientbg, pricereveal, logoreveal, brandintro, colorpalette, scoreboard, playerstat, menuitem, heartbeat, geometric, liquid, morphshape, dna, swipe, click, loading, waveform, vinyl, magazinecover, pullquote, infographic

RÈGLES SCÈNES :
- Varie absolument les types — ne répète jamais le même
- Alterne fonds sombres (#0a0a0a, #050510, #000800) et clairs (#ffffff, #f5f5f0)
- Utilise accentColor: "${accentColor}" partout
- Pour les chiffres/stats → counter, odometer, progressring, roi
- Pour les citations → quotereveal, pullquote
- Pour l'appel à l'action → cta, stamp, zoompunch
- Pour l'intro → starfield, aurora, logoreveal
- Crée une progression visuelle cohérente

Réponds UNIQUEMENT en JSON valide sans markdown :
{
  "restructuredScript": "phrase 1\nphrase 2\nphrase 3",
  "scenes": [
    {
      "type": "typewriter",
      "text": "phrase exacte du texte original",
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
