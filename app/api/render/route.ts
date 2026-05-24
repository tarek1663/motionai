import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

function nextResetDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";

    const durationSec =
      body.durationSeconds ??
      (typeof body.duration === "number" ? body.duration : parseInt(String(body.duration), 10)) ??
      30;
    const duration = Number.isFinite(durationSec) ? durationSec : 30;

    const { userId } = await auth();
    if (userId) {
      let { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (sub) {
        if (sub.reset_date && new Date(sub.reset_date) < new Date()) {
          await supabase
            .from("subscriptions")
            .update({ videos_used: 0, reset_date: nextResetDate() })
            .eq("user_id", userId);
          sub.videos_used = 0;
        }

        if (sub.plan !== "business" && sub.videos_used >= sub.videos_limit) {
          return NextResponse.json(
            {
              error: "Limite atteinte",
              upgrade: true,
              plan: sub.plan,
              limit: sub.videos_limit,
            },
            { status: 403 }
          );
        }

        const durationLimits: Record<string, number> = {
          free: 30,
          starter: 120,
          pro: 120,
          business: 120,
        };
        const maxDuration = durationLimits[sub.plan] || 30;
        if (duration > maxDuration) {
          return NextResponse.json(
            {
              error: `Durée maximale ${maxDuration}s pour le plan ${sub.plan}`,
              upgrade: true,
            },
            { status: 403 }
          );
        }
      }
    }

    if (!body.totalFrames) {
      body.totalFrames = Math.round(duration * 60);
    }

    const totalFrames = body.totalFrames;
    console.log("📐 totalFrames:", totalFrames, "duration:", duration, "fps: 60");

    const res = await fetch(`${RENDER_URL}/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur render";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
