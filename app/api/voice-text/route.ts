import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkGenerationLimits } from "@/lib/check-limits";
import { generateVoiceText } from "@/lib/claude";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  console.log("🔑 Key exists:", !!process.env.ANTHROPIC_API_KEY);
  console.log("🔑 Key prefix:", process.env.ANTHROPIC_API_KEY?.slice(0, 15));
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const limits = await checkGenerationLimits(userId);
    if (!limits.allowed) {
      return NextResponse.json(
        {
          error: limits.reason,
          remainingToday: limits.remainingToday,
          remainingThisMonth: limits.remainingThisMonth,
        },
        { status: 429 }
      );
    }

    const { prompt, duration, mode, customScript } = await req.json();

    if (mode === "script" && customScript?.trim()) {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Tu es un expert en motion design et copywriting.

L'utilisateur a écrit ce texte :
"""
${customScript}
"""

Ta mission : optimise ce texte pour une vidéo motion design de qualité Apple/Nike.

RÈGLES :
- Garde FIDÈLEMENT l'idée et le message original
- Reformule en phrases COURTES et IMPACTANTES (1-5 mots par ligne)
- Style Apple — sobre, fort, percutant
- Chaque ligne = une scène = une idée
- Maximum 6 mots par ligne
- Minimum 8 lignes, maximum 20 lignes selon la longueur du texte original
- Garde les faits, chiffres et informations importantes
- Rends le texte dynamique et rythmé

Réponds UNIQUEMENT avec le texte optimisé, une ligne par scène, sans numérotation ni tirets.`,
          },
        ],
      });

      const optimizedScript =
        (response.content[0]?.type === "text"
          ? response.content[0].text
          : customScript
        )?.trim() || customScript.trim();
      const lines = optimizedScript.split("\n").filter((l: string) => l.trim());

      return NextResponse.json({
        script: optimizedScript,
        voiceoverText: optimizedScript,
        lines,
        originalScript: customScript,
      });
    }

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    const durationSec = String(duration || "30");
    const sec = parseInt(durationSec, 10) || 30;
    console.log("🎙️ voice-text duration:", durationSec, "s — mode continu");

    const [scriptResponse, meta] = await Promise.all([
      client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Tu es un expert en copywriting pour publicités vidéo premium.

Génère un script voix-off pour une vidéo de ${sec} secondes sur : "${prompt}"

RÈGLES ABSOLUES :
- Texte fluide et naturel — comme un vrai présentateur
- PAS de listes, PAS de tirets, PAS de numéros
- Un seul paragraphe continu qui se lit naturellement
- Rythme varié — phrases courtes ET longues mélangées
- Ton : confiant, premium, inspirant
- Durée : exactement ${sec} secondes à voix normale
- JAMAIS de pauses artificielles
- Style Apple/Nike — sobre, fort, émotionnel

Réponds UNIQUEMENT avec le texte du script, rien d'autre.`,
          },
        ],
      }),
      generateVoiceText({ prompt, duration: durationSec }),
    ]);

    const script =
      (scriptResponse.content[0]?.type === "text"
        ? scriptResponse.content[0].text
        : ""
      )?.trim() || meta.voiceoverText;

    return NextResponse.json({
      script,
      voiceoverText: script,
      lines: [script],
      accentColor: meta.accentColor,
      bgAccent: meta.bgAccent,
      bgLight: meta.bgLight,
      formatId: meta.formatId,
      formatName: meta.formatName,
    });
  } catch (err: unknown) {
    console.error("Voice text error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
