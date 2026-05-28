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

        try {
          if (session.customer_details?.email || session.customer_email) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "Motionr <hello@motionr.app>",
                to: session.customer_details?.email || session.customer_email,
                subject: "Bienvenue sur Motionr ! 🎬",
                html: `
                  <h1>Bienvenue sur Motionr !</h1>
                  <p>Ton abonnement est actif. Tu peux maintenant générer des vidéos motion design professionnelles.</p>
                  <a href="https://motionai-two.vercel.app/dashboard">Créer ma première vidéo →</a>
                `,
              }),
            });
          }
        } catch (emailErr) {
          console.error("Email error:", emailErr);
        }

        console.log("Plan activé:", planId, "pour", userId);
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.cancel_at_period_end) {
          await supabase
            .from("subscriptions")
            .update({
              cancel_at_period_end: true,
              period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);
        }

        if (subscription.status === "canceled") {
          const { data: subRecord } = await supabase
            .from("subscriptions")
            .select("user_id, stripe_customer_id")
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

          try {
            let customerEmail = "";
            if (subscription.customer && typeof subscription.customer === "string") {
              const customer = await getStripe().customers.retrieve(subscription.customer);
              if (!("deleted" in customer)) {
                customerEmail = customer.email || "";
              }
            }

            if (customerEmail && process.env.RESEND_API_KEY) {
              await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: "Motionr <hello@motionr.app>",
                  to: customerEmail,
                  subject: "Ton abonnement Motionr a ete annule",
                  html: `
                    <h2>Abonnement annule</h2>
                    <p>Ton abonnement Motionr est maintenant termine. Tu es repasse sur le plan gratuit (3 videos/mois).</p>
                    <p>Tu peux te reabonner a tout moment sur <a href="https://motionai-two.vercel.app/pricing">motionr.app/pricing</a></p>
                  `,
                }),
              });
            }
          } catch {
            // ignore email failure
          }

          console.log("Subscription annulee pour", subRecord?.user_id || "unknown");
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
