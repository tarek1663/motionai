import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { isAdminUserId } from "@/lib/admin";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!isAdminUserId(userId)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { count: totalVideos } = await supabase
      .from("videos")
      .select("*", { count: "exact", head: true });

    const { count: totalUsers } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true });

    const { data: subs } = await supabase.from("subscriptions").select("plan");

    const planCounts = { free: 0, starter: 0, pro: 0, business: 0 };
    subs?.forEach((s: { plan: string }) => {
      if (s.plan in planCounts) {
        planCounts[s.plan as keyof typeof planCounts]++;
      }
    });

    const payingUsers =
      (planCounts.starter || 0) + (planCounts.pro || 0) + (planCounts.business || 0);

    const mrr =
      planCounts.starter * 23 + planCounts.pro * 45 + planCounts.business * 120;

    const { data: recentVideos } = await supabase
      .from("videos")
      .select("prompt, format_name, accent_color, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      totalVideos: totalVideos || 0,
      totalUsers: totalUsers || 0,
      payingUsers,
      mrr,
      planCounts,
      recentVideos: recentVideos || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur admin";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
