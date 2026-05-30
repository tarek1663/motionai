import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PLANS, type PlanId } from "@/lib/plans";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    let { data: sub } = await supabase
      .from("subscriptions")
      .select(
        "plan, videos_used, videos_limit, period_end, videos_today, last_video_date, reset_date, monthly_reset_date, stripe_customer_id"
      )
      .eq("user_id", userId)
      .single();

    if (!sub) {
      const resetDate = new Date();
      resetDate.setMonth(resetDate.getMonth() + 1);
      const { data: newSub } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan: "free",
          videos_used: 0,
          videos_limit: PLANS.free.monthlyVideos,
          videos_today: 0,
          reset_date: resetDate.toISOString(),
          monthly_reset_date: resetDate.toISOString().split("T")[0],
        })
        .select(
          "plan, videos_used, videos_limit, period_end, videos_today, last_video_date, reset_date, monthly_reset_date, stripe_customer_id"
        )
        .single();
      sub = newSub;
    }

    const monthlyReset = sub?.reset_date || sub?.monthly_reset_date;
    if (monthlyReset && new Date(monthlyReset) < new Date()) {
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1);
      await supabase
        .from("subscriptions")
        .update({
          videos_used: 0,
          reset_date: nextReset.toISOString(),
          monthly_reset_date: nextReset.toISOString().split("T")[0],
        })
        .eq("user_id", userId);
      if (sub) sub.videos_used = 0;
    }

    const plan = (sub?.plan || "free") as PlanId;
    const planConfig = PLANS[plan] ?? PLANS.free;

    const today = new Date().toISOString().split("T")[0];
    const lastVideoDate = sub?.last_video_date?.split("T")[0];
    const videosToday = lastVideoDate === today ? sub?.videos_today || 0 : 0;
    const videosThisMonth = sub?.videos_used || 0;
    const monthlyLimit = planConfig.monthlyVideos;
    const dailyLimit = planConfig.dailyVideos;
    const videosLimit = sub?.videos_limit || monthlyLimit;
    const remainingToday = Math.max(0, dailyLimit - videosToday);
    const remainingThisMonth = Math.max(0, monthlyLimit - videosThisMonth);
    const canGenerate =
      videosToday < dailyLimit && videosThisMonth < monthlyLimit;

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
    const isTrial = trialDaysLeft !== null && trialDaysLeft <= 4 && plan !== "free";
    const hasActiveSubscription = plan !== "free";

    return NextResponse.json({
      plan,
      planName: planNames[plan] || planConfig.name,
      planConfig,
      planOrder: ["free", "starter", "pro", "business"].indexOf(plan),
      tokensBalance: 0,
      videosUsed: videosThisMonth,
      videosLimit,
      videosToday,
      videosThisMonth,
      monthlyLimit,
      dailyLimit,
      canGenerate,
      remainingToday,
      remainingThisMonth,
      videos_used: videosThisMonth,
      videos_limit: videosLimit,
      videos_remaining: remainingThisMonth,
      reset_date: sub?.reset_date || sub?.monthly_reset_date,
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
