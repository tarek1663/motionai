import { supabase } from "@/lib/supabase";
import { PLANS, type PlanId } from "@/lib/plans";

type UserRow = {
  plan: string | null;
  videos_this_month: number | null;
  videos_today: number | null;
  last_video_date: string | null;
  monthly_reset_date: string | null;
};

function todayDateString() {
  return new Date().toISOString().split("T")[0];
}

function getVideosToday(row: UserRow) {
  const today = todayDateString();
  const lastDate = row.last_video_date?.split("T")[0];
  return lastDate === today ? row.videos_today || 0 : 0;
}

function getVideosThisMonth(row: UserRow) {
  if (row.monthly_reset_date && new Date(row.monthly_reset_date) < new Date()) {
    return 0;
  }
  return row.videos_this_month || 0;
}

async function getOrCreateUser(userId: string): Promise<UserRow | null> {
  let { data: user } = await supabase
    .from("User")
    .select("plan, videos_this_month, videos_today, last_video_date, monthly_reset_date")
    .eq("clerk_id", userId)
    .maybeSingle();

  if (!user) {
    const resetDate = new Date();
    resetDate.setMonth(resetDate.getMonth() + 1);
    const { data: created } = await supabase
      .from("User")
      .insert({
        clerk_id: userId,
        plan: "free",
        videos_this_month: 0,
        videos_today: 0,
        monthly_reset_date: resetDate.toISOString().split("T")[0],
      })
      .select("plan, videos_this_month, videos_today, last_video_date, monthly_reset_date")
      .single();
    user = created;
  }

  return user;
}

export async function checkGenerationLimits(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  remainingToday?: number;
  remainingThisMonth?: number;
}> {
  const user = await getOrCreateUser(userId);
  if (!user) {
    return { allowed: false, reason: "Compte introuvable." };
  }

  const plan = (user.plan || "free") as PlanId;
  const config = PLANS[plan] ?? PLANS.free;

  if (user.monthly_reset_date && new Date(user.monthly_reset_date) < new Date()) {
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    await supabase
      .from("User")
      .update({
        videos_this_month: 0,
        monthly_reset_date: nextReset.toISOString().split("T")[0],
      })
      .eq("clerk_id", userId);
    user.videos_this_month = 0;
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
  const user = await getOrCreateUser(userId);
  if (!user) return;

  const todayDate = todayDateString();
  const lastDate = user.last_video_date?.split("T")[0];
  const videosToday = lastDate === todayDate ? (user.videos_today || 0) + 1 : 1;

  let videosThisMonth = (user.videos_this_month || 0) + 1;
  let monthlyResetDate = user.monthly_reset_date;

  if (monthlyResetDate && new Date(monthlyResetDate) < new Date()) {
    videosThisMonth = 1;
    const nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    monthlyResetDate = nextReset.toISOString().split("T")[0];
  }

  await supabase
    .from("User")
    .update({
      videos_today: videosToday,
      videos_this_month: videosThisMonth,
      last_video_date: today,
      monthly_reset_date: monthlyResetDate,
    })
    .eq("clerk_id", userId);
}
