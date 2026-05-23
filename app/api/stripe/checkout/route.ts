import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe, PLANS, PlanId, getStripePriceId } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { planId, billing } = await req.json();
    const plan = PLANS[planId as PlanId];
    if (!plan || planId === "free") {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    let customerId = sub?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { userId },
      });
      customerId = customer.id;
      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: customerId,
          plan: "free",
          videos_limit: 3,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    const priceId = getStripePriceId(
      planId as Exclude<PlanId, "free">,
      billing === "yearly" ? "yearly" : "monthly"
    );

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/cancel`,
      metadata: { userId, planId, billing },
      subscription_data: {
        metadata: { userId, planId },
      },
      allow_promotion_codes: true,
      locale: "fr",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Erreur checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
