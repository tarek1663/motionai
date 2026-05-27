import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

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
          reset_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
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
          reset_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
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

    const now = new Date();
    const periodEnd = sub?.period_end ? new Date(sub.period_end) : null;
    const trialDaysLeft = periodEnd
      ? Math.max(0, Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : null;
    const plan = sub?.plan || "free";
    const isTrial = trialDaysLeft !== null && trialDaysLeft <= 4 && plan !== "free";
    const planOrder = ["free", "starter", "pro", "business"];
    const hasActiveSubscription = plan !== "free";

    return NextResponse.json({
      plan: plan,
      planName: planNames[plan],
      planOrder: planOrder.indexOf(plan),
      videos_used: sub?.videos_used || 0,
      videos_limit: sub?.videos_limit || 3,
      videos_remaining: Math.max(0, (sub?.videos_limit || 3) - (sub?.videos_used || 0)),
      reset_date: sub?.reset_date,
      period_end: sub?.period_end,
      trialDaysLeft,
      isTrial,
      stripe_customer_id: sub?.stripe_customer_id,
      hasActiveSubscription,
      has_active_subscription: hasActiveSubscription,
      eligible_for_trial_offer: plan === "free" && !hasActiveSubscription,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur crédits";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
