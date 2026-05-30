import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

    {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan, videos_used, videos_limit")
        .eq("user_id", userId)
        .single();

      if (sub && sub.plan !== "business" && sub.videos_used >= sub.videos_limit) {
        return NextResponse.json({
          error: "Limite atteinte",
          upgrade: true,
          plan: sub.plan,
          limit: sub.videos_limit,
        }, { status: 403 });
      }
      plan = sub?.plan || "free";
    }

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
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Render error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
