import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (userId !== process.env.ADMIN_USER_ID) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { data: recentSubs } = await supabase
      .from("subscriptions")
      .select("user_id, plan, period_end, created_at")
      .neq("plan", "free")
      .order("created_at", { ascending: false })
      .limit(20);

    const { data: recentVideos } = await supabase
      .from("videos")
      .select("user_id, prompt, status, created_at, format")
      .order("created_at", { ascending: false })
      .limit(20);

    const { data: failedVideos } = await supabase
      .from("videos")
      .select("user_id, prompt, created_at")
      .eq("status", "error")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({ recentSubs, recentVideos, failedVideos });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
