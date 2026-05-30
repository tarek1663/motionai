import { supabase } from "@/lib/supabase";
import { PLANS, type PlanId } from "@/lib/plans";

type SubscriptionRow = {
  plan: string | null;
  videos_used: number | null;
  videos_today: number | null;
  last_video_date: string | null;
  reset_date: string | null;
};

function todayDateString() {
  return new Date().toISOString().split("T")[0];
}

function getVideosToday(row: SubscriptionRow) {
  const today = todayDateString();
  const lastDate = row.last_video_date?.split("T")[0];
  return lastDate === today ? row.videos_today || 0 : 0;
}

function getVideosThisMonth(row: SubscriptionRow) {
  if (row.reset_date && new Date(row.reset_date) < new Date()) {
    return 0;
  }
  return row.videos_used || 0;
}

async function getOrCreateSubscription(userId: string): Promise<SubscriptionRow | null> {
  let { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, videos_used, videos_today, last_video_date, reset_date")
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
      })
      .select("plan, videos_used, videos_today, last_video_date, reset_date")
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
  const user = await getOrCreateSubscription(userId);
  if (!user) {
    return { allowed: false, reason: "Compte introuvable." };
  }

  const plan = (user.plan || "free") as PlanId;
  const config = PLANS[plan] ?? PLANS.free;

  if (user.reset_date && new Date(user.reset_date) < new Date()) {
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    await supabase
      .from("subscriptions")
      .update({
        videos_used: 0,
        reset_date: nextReset.toISOString(),
      })
      .eq("user_id", userId);
    user.videos_used = 0;
  }

  const videosToday = getVideosToday(user);
  const videosThisMonth = getVideosThisMonth(user);

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
  const user = await getOrCreateSubscription(userId);
  if (!user) return;

  const todayDate = todayDateString();
  const lastDate = user.last_video_date?.split("T")[0];
  const videosToday = lastDate === todayDate ? (user.videos_today || 0) + 1 : 1;

  let videosThisMonth = (user.videos_used || 0) + 1;
  let resetDate = user.reset_date;

  if (resetDate && new Date(resetDate) < new Date()) {
    videosThisMonth = 1;
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    resetDate = nextReset.toISOString();
  }

  const plan = (user.plan || "free") as PlanId;
  const monthlyLimit = PLANS[plan]?.monthlyVideos ?? PLANS.free.monthlyVideos;

  await supabase
    .from("subscriptions")
    .update({
      videos_today: videosToday,
      videos_used: videosThisMonth,
      videos_limit: monthlyLimit,
      last_video_date: today,
      reset_date: resetDate,
      updated_at: today,
    })
    .eq("user_id", userId);
}
