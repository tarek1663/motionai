import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, period_end")
      .eq("user_id", userId)
      .single();

    if (!sub?.stripe_subscription_id) {
      return NextResponse.json({ error: "Aucun abonnement actif" }, { status: 400 });
    }

    await getStripe().subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: true })
      .eq("user_id", userId);

    return NextResponse.json({
      success: true,
      periodEnd: sub.period_end,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
