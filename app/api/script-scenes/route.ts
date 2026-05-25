import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { script, format, duration, accentColor } = await req.json();

    const lines = script.split("\n").filter((line: string) => line.trim());

    const prompt = `Tu es un expert en motion design. Analyse ce script ligne par ligne et génère des scènes Remotion parfaites.

SCRIPT (${lines.length} lignes):
${lines.map((line: string, index: number) => `${index + 1}. ${line}`).join("\n")}

FORMAT: ${format} | DUREE: ${duration} | COULEUR ACCENT: ${accentColor}

Pour chaque ligne, choisis le type de scène le plus adapté parmi:
word, split, sentence, reveal, mirror, glitch, kinetic, zoompunch, particles, burst, text3d, counter, chart, floatstats, numbers, progressbars, timeline, card, quote, highlight, icon, worldmap, waveform, photo, cta, breathe, countdown, typewriter, scramble, neonglow, stamp, wavetext, outlinefill, odometer, progressring, gauge, bubblechart, notification, successcheck, likeexplosion, followercounter, starfield, aurora, matrix, countdownring, xpbar, flightboard, stockchart, hologram, moneyrain, titlecard, magnetic, gradientslide, cascade, blurfocus, particlerain, fire, snow, sunray, funnel, comparisonbars, roi, achievement, circuit, glitchscreen, pollresults, commentthread, endcredits, wipe, dollyzoom, steps, compare, quotereveal, benefits, moodboard, minimalist, gradientbg, pricereveal, logoreveal, brandintro, colorpalette, scoreboard, playerstat, menuitem, heartbeat, geometric, liquid, morphshape, dna, swipe, click, loading, waveform, vinyl, magazinecover, pullquote, infographic

REGLES:
- Varie les types de scènes, ne répète pas le même type deux fois de suite
- Adapte le fond (bg) à l'ambiance, alterne sombre et clair
- Utilise accentColor: "${accentColor}"
- Pour les chiffres, préfère counter, odometer, progressring
- Pour les citations, préfère quotereveal, pullquote
- Pour l'action, préfère cta, stamp, zoompunch
- Pour l'ambiance, préfère starfield, aurora, gradientbg
- Crée une progression visuelle cohérente

Réponds UNIQUEMENT en JSON valide:
{
  "scenes": [
    {
      "type": "typewriter",
      "text": "texte exact de la ligne",
      "text2": "sous-titre optionnel",
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

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Script scenes error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
