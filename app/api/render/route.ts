import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkGenerationLimits, incrementVideoCount } from "@/lib/check-limits";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = await auth();
    let plan = "free";

    if (!userId) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { data: activeRenders } = await supabase
      .from("videos")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "rendering")
      .gte("created_at", new Date(Date.now() - 30 * 60 * 1000).toISOString());

    if (activeRenders && activeRenders.length > 0) {
      return NextResponse.json(
        {
          error: "Une video est deja en cours de generation. Attends qu'elle soit terminee.",
          rendering: true,
        },
        { status: 429 }
      );
    }

    const limits = await checkGenerationLimits(userId);
    if (!limits.allowed) {
      return NextResponse.json(
        {
          error: limits.reason,
          remainingToday: limits.remainingToday,
          remainingThisMonth: limits.remainingThisMonth,
          upgrade: true,
        },
        { status: 429 }
      );
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", userId)
      .single();
    plan = sub?.plan || "free";

    const showWatermark = plan === "free";
    console.log("💧 Watermark:", showWatermark, "— Plan:", plan);

    await supabase.from("videos").insert({
      user_id: userId,
      status: "rendering",
      prompt: body.prompt || "En cours...",
      created_at: new Date().toISOString(),
    });

    let RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";
    if (!RENDER_URL.startsWith("http://") && !RENDER_URL.startsWith("https://")) {
      RENDER_URL = `https://${RENDER_URL}`;
    }

    const res = await fetch(`${RENDER_URL}/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, plan, showWatermark }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    await incrementVideoCount(userId);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Render error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
