import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PLANS, type PlanId } from "@/lib/plans";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const userSelect =
      "plan, videos_this_month, videos_today, last_video_date, monthly_reset_date, tokens_balance";

    let { data: user } = await supabase
      .from("User")
      .select(userSelect)
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      const resetDate = new Date();
      resetDate.setMonth(resetDate.getMonth() + 1);
      const { data: newUser } = await supabase
        .from("User")
        .insert({
          clerk_id: userId,
          plan: "free",
          videos_this_month: 0,
          videos_today: 0,
          monthly_reset_date: resetDate.toISOString().split("T")[0],
        })
        .select(userSelect)
        .single();
      user = newUser;
    }

    if (user?.monthly_reset_date && new Date(user.monthly_reset_date) < new Date()) {
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1);
      await supabase
        .from("User")
        .update({
          videos_this_month: 0,
          monthly_reset_date: nextReset.toISOString().split("T")[0],
        })
        .eq("clerk_id", userId);
      if (user) user.videos_this_month = 0;
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("period_end, stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    const plan = (user?.plan || "free") as PlanId;
    const planConfig = PLANS[plan] ?? PLANS.free;

    const today = new Date().toISOString().split("T")[0];
    const lastVideoDate = user?.last_video_date?.split("T")[0];
    const videosToday = lastVideoDate === today ? user?.videos_today || 0 : 0;
    const videosThisMonth = user?.videos_this_month || 0;

    const monthlyLimit = planConfig.monthlyVideos;
    const dailyLimit = planConfig.dailyVideos;
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
      tokensBalance: user?.tokens_balance ?? 0,
      videosThisMonth,
      videosToday,
      monthlyLimit,
      dailyLimit,
      canGenerate,
      remainingToday,
      remainingThisMonth,
      videos_used: videosThisMonth,
      videos_limit: monthlyLimit,
      videos_remaining: remainingThisMonth,
      reset_date: user?.monthly_reset_date,
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
