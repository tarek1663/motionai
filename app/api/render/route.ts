import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    // Vérifier les crédits
    if (userId) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
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
    }

    let RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";
    if (!RENDER_URL.startsWith("http://") && !RENDER_URL.startsWith("https://")) {
      RENDER_URL = `https://${RENDER_URL}`;
    }

    const res = await fetch(`${RENDER_URL}/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Render error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
