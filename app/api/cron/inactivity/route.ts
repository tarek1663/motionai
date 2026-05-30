import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { sendInactivityEmail } from "@/lib/emails";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const INACTIVITY_DAYS = 7;
const MAX_EMAILS_PER_RUN = 50;

export async function GET(req: NextRequest) {
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const secret = req.headers.get("x-cron-secret") || bearer;
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - INACTIVITY_DAYS);

    const { data: recentVideos, error: recentError } = await supabase
      .from("videos")
      .select("user_id")
      .gte("created_at", cutoff.toISOString());

    if (recentError) throw recentError;

    const activeUserIds = new Set((recentVideos || []).map((v) => v.user_id));

    const { data: subscriptions, error: subsError } = await supabase
      .from("subscriptions")
      .select("user_id, plan");

    if (subsError) throw subsError;

    const inactiveUserIds = (subscriptions || [])
      .map((s) => s.user_id)
      .filter((userId): userId is string => Boolean(userId) && !activeUserIds.has(userId));

    console.log("📧 Inactivity cron — candidates:", inactiveUserIds.length);

    let sent = 0;
    const clerk = await clerkClient();

    for (const userId of inactiveUserIds.slice(0, MAX_EMAILS_PER_RUN)) {
      try {
        const user = await clerk.users.getUser(userId);
        const email = user.emailAddresses.find(
          (e) => e.id === user.primaryEmailAddressId
        )?.emailAddress;

        if (!email) continue;

        const lastSent = user.privateMetadata?.lastInactivityEmailAt as string | undefined;
        if (lastSent) {
          const lastSentDate = new Date(lastSent);
          if (lastSentDate > cutoff) continue;
        }

        const firstName = user.firstName || "there";
        await sendInactivityEmail(email, firstName);

        await clerk.users.updateUserMetadata(userId, {
          privateMetadata: {
            ...user.privateMetadata,
            lastInactivityEmailAt: new Date().toISOString(),
          },
        });

        sent += 1;
      } catch (err) {
        console.error("Inactivity email error for", userId, err);
      }
    }

    return NextResponse.json({
      sent,
      candidates: inactiveUserIds.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Cron failed";
    console.error("Inactivity cron error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
