import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendCancellationEmail, sendWelcomeEmail } from "@/lib/emails";
import { getStripe, PLANS, PlanId } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const planDisplayNames: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  business: "Business",
};

async function getStripeCustomerEmail(
  customerId: string | Stripe.Customer | Stripe.DeletedCustomer | null
): Promise<string> {
  if (!customerId || typeof customerId !== "string") return "";
  const customer = await getStripe().customers.retrieve(customerId);
  if ("deleted" in customer) return "";
  return customer.email || "";
}

function formatPeriodEnd(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

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

        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
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

        await supabase
          .from("User")
          .update({
            plan: planId,
            videos_this_month: 0,
            videos_today: 0,
            monthly_reset_date: periodEnd.toISOString().split("T")[0],
          })
          .eq("clerk_id", userId);

        try {
          const email = session.customer_details?.email || session.customer_email;
          if (email && process.env.RESEND_API_KEY) {
            const firstName =
              session.customer_details?.name?.split(" ")[0] ||
              session.customer_details?.name ||
              "there";
            await sendWelcomeEmail(email, firstName);
          }
        } catch (emailErr) {
          console.error("Welcome email error:", emailErr);
        }

        console.log("Plan activé:", planId, "pour", userId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: subRecord } = await supabase
          .from("subscriptions")
          .select("user_id, plan")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();

        await supabase
          .from("subscriptions")
          .update({
            plan: "free",
            videos_limit: 3,
            stripe_subscription_id: null,
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (subRecord?.user_id) {
          await supabase
            .from("User")
            .update({ plan: "free" })
            .eq("clerk_id", subRecord.user_id);
        }

        console.log("Subscription supprimée pour", subRecord?.user_id || "unknown");
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: subRecord } = await supabase
          .from("subscriptions")
          .select("user_id, plan, stripe_customer_id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();

        if (subscription.cancel_at_period_end) {
          await supabase
            .from("subscriptions")
            .update({
              cancel_at_period_end: true,
              period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          try {
            const customerEmail = await getStripeCustomerEmail(subscription.customer);
            if (customerEmail && process.env.RESEND_API_KEY) {
              const planName =
                planDisplayNames[subRecord?.plan || "starter"] || "Starter";
              await sendCancellationEmail(
                customerEmail,
                "there",
                planName,
                formatPeriodEnd(subscription.current_period_end)
              );
            }
          } catch (emailErr) {
            console.error("Cancellation email error:", emailErr);
          }
        }

        if (subscription.status === "canceled") {
          await supabase
            .from("subscriptions")
            .update({
              plan: "free",
              videos_limit: 3,
              stripe_subscription_id: null,
              cancel_at_period_end: false,
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);

          if (subRecord?.user_id) {
            await supabase
              .from("User")
              .update({ plan: "free" })
              .eq("clerk_id", subRecord.user_id);
          }

          console.log("Subscription annulée pour", subRecord?.user_id || "unknown");
        }
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
