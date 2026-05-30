import { supabase } from "@/lib/supabase";
import { PLANS, type PlanId } from "@/lib/plans";

type SubscriptionRow = {
  plan: string | null;
  videos_used: number | null;
  videos_today: number | null;
  last_video_date: string | null;
  reset_date: string | null;
  monthly_reset_date: string | null;
};

function todayDateString() {
  return new Date().toISOString().split("T")[0];
}

function getVideosToday(row: SubscriptionRow) {
  const today = todayDateString();
  const lastDate = row.last_video_date?.split("T")[0];
  return lastDate === today ? row.videos_today || 0 : 0;
}

function getMonthlyResetDate(row: SubscriptionRow) {
  return row.reset_date || row.monthly_reset_date;
}

function getVideosThisMonth(row: SubscriptionRow) {
  const resetDate = getMonthlyResetDate(row);
  if (resetDate && new Date(resetDate) < new Date()) {
    return 0;
  }
  return row.videos_used || 0;
}

async function getOrCreateSubscription(userId: string): Promise<SubscriptionRow | null> {
  let { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, videos_used, videos_today, last_video_date, reset_date, monthly_reset_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (!sub) {
    const resetDate = new Date();
    resetDate.setMonth(resetDate.getMonth() + 1);
    const { data: created } = await supabase
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
      .select("plan, videos_used, videos_today, last_video_date, reset_date, monthly_reset_date")
      .single();
    sub = created;
  }

  return sub;
}

export async function checkGenerationLimits(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  remainingToday?: number;
  remainingThisMonth?: number;
}> {
  const sub = await getOrCreateSubscription(userId);
  if (!sub) {
    return { allowed: false, reason: "Compte introuvable." };
  }

  const plan = (sub.plan || "free") as PlanId;
  const config = PLANS[plan] ?? PLANS.free;

  const resetDate = getMonthlyResetDate(sub);
  if (resetDate && new Date(resetDate) < new Date()) {
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
    sub.videos_used = 0;
  }

  const videosToday = getVideosToday(sub);
  const videosThisMonth = getVideosThisMonth(sub);

  if (videosToday >= config.dailyVideos) {
    return {
      allowed: false,
      reason: `Limite journaliere atteinte — ${config.dailyVideos} videos par jour sur le plan ${config.name}.`,
      remainingToday: 0,
      remainingThisMonth: Math.max(0, config.monthlyVideos - videosThisMonth),
    };
  }

  if (videosThisMonth >= config.monthlyVideos) {
    return {
      allowed: false,
      reason: `Limite mensuelle atteinte — ${config.monthlyVideos} videos par mois sur le plan ${config.name}.`,
      remainingToday: Math.max(0, config.dailyVideos - videosToday),
      remainingThisMonth: 0,
    };
  }

  return {
    allowed: true,
    remainingToday: Math.max(0, config.dailyVideos - videosToday),
    remainingThisMonth: Math.max(0, config.monthlyVideos - videosThisMonth),
  };
}

export async function incrementVideoCount(userId: string) {
  const today = new Date().toISOString();
  const sub = await getOrCreateSubscription(userId);
  if (!sub) return;

  const todayDate = todayDateString();
  const lastDate = sub.last_video_date?.split("T")[0];
  const videosToday = lastDate === todayDate ? (sub.videos_today || 0) + 1 : 1;

  let videosThisMonth = (sub.videos_used || 0) + 1;
  let resetDate = sub.reset_date;
  let monthlyResetDate = sub.monthly_reset_date;

  const monthlyReset = getMonthlyResetDate(sub);
  if (monthlyReset && new Date(monthlyReset) < new Date()) {
    videosThisMonth = 1;
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    resetDate = nextReset.toISOString();
    monthlyResetDate = nextReset.toISOString().split("T")[0];
  }

  const plan = (sub.plan || "free") as PlanId;
  const monthlyLimit = PLANS[plan]?.monthlyVideos ?? PLANS.free.monthlyVideos;

  await supabase
    .from("subscriptions")
    .update({
      videos_today: videosToday,
      videos_used: videosThisMonth,
      videos_limit: monthlyLimit,
      last_video_date: today,
      reset_date: resetDate,
      monthly_reset_date: monthlyResetDate,
      updated_at: today,
    })
    .eq("user_id", userId);
}
