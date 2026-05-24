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

    let { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!sub) {
      const { data: newSub } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan: "free",
          videos_used: 0,
          videos_limit: 3,
          reset_date: nextResetDate(),
        })
        .select()
        .single();
      sub = newSub;
    }

    if (sub?.reset_date && new Date(sub.reset_date) < new Date()) {
      await supabase
        .from("subscriptions")
        .update({
          videos_used: 0,
          reset_date: nextResetDate(),
        })
        .eq("user_id", userId);
      if (sub) sub.videos_used = 0;
    }

    const planNames: Record<string, string> = {
      free: "Gratuit",
      starter: "Starter",
      pro: "Pro",
      business: "Business",
    };

    return NextResponse.json({
      plan: sub?.plan || "free",
      planName: planNames[sub?.plan || "free"],
      videos_used: sub?.videos_used || 0,
      videos_limit: sub?.videos_limit || 3,
      videos_remaining: Math.max(0, (sub?.videos_limit || 3) - (sub?.videos_used || 0)),
      reset_date: sub?.reset_date,
      period_end: sub?.period_end,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur crédits";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
