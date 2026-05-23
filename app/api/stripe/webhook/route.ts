import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, PLANS, PlanId } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signature invalide";
    console.error("Webhook signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId as PlanId | undefined;
        if (!userId || !planId) break;

        const plan = PLANS[planId];
        if (!plan) break;

        const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;

        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan: planId,
            stripe_customer_id: customerId ?? null,
            stripe_subscription_id: subId ?? null,
            videos_limit: plan.videos_limit,
            videos_used: 0,
            period_end: periodEnd.toISOString(),
            reset_date: periodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        console.log("Plan activé:", planId, "pour", userId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            plan: "free",
            stripe_subscription_id: null,
            videos_limit: 3,
            videos_used: 0,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        console.log("Subscription annulée pour", userId);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const rawSub = (invoice as { subscription?: string | { id: string } | null })
          .subscription;
        const subId = typeof rawSub === "string" ? rawSub : rawSub?.id;
        if (!subId) break;

        const stripeSub = await getStripe().subscriptions.retrieve(subId);
        const userId = stripeSub.metadata?.userId;
        if (!userId) break;

        const resetDate = new Date();
        resetDate.setMonth(resetDate.getMonth() + 1);

        await supabase
          .from("subscriptions")
          .update({
            videos_used: 0,
            reset_date: resetDate.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        console.log("Crédits resetés pour", userId);
        break;
      }
    }
  } catch (err: unknown) {
    console.error("Webhook handler error:", err);
  }

  return NextResponse.json({ received: true });
}
