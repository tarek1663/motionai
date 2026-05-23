import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

function nextResetDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!data) {
      await supabase.from("subscriptions").insert({
        user_id: userId,
        plan: "free",
        videos_limit: 3,
        videos_used: 0,
      });
      return NextResponse.json({
        plan: "free",
        videos_used: 0,
        videos_limit: 3,
        videos_remaining: 3,
      });
    }

    if (data.reset_date && new Date(data.reset_date) < new Date()) {
      await supabase
        .from("subscriptions")
        .update({ videos_used: 0, reset_date: nextResetDate() })
        .eq("user_id", userId);
      data.videos_used = 0;
    }

    const limit = data.videos_limit || 3;
    const used = data.videos_used || 0;

    return NextResponse.json({
      plan: data.plan,
      videos_used: used,
      videos_limit: limit,
      videos_remaining: Math.max(0, limit - used),
      period_end: data.period_end,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur crédits";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data } = await supabase
      .from("subscriptions")
      .select("videos_used, videos_limit, plan")
      .eq("user_id", userId)
      .single();

    if (!data) {
      return NextResponse.json({ error: "Subscription introuvable" }, { status: 404 });
    }

    const used = data.videos_used || 0;
    const limit = data.videos_limit || 3;

    if (used >= limit && data.plan !== "business") {
      return NextResponse.json({ error: "Limite atteinte", upgrade: true }, { status: 403 });
    }

    await supabase
      .from("subscriptions")
      .update({ videos_used: used + 1 })
      .eq("user_id", userId);

    return NextResponse.json({ success: true, remaining: limit - used - 1 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur crédits";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
