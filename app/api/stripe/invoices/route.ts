import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ invoices: [] });

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (!sub?.stripe_customer_id) return NextResponse.json({ invoices: [] });

    const invoices = await getStripe().invoices.list({
      customer: sub.stripe_customer_id,
      limit: 10,
    });

    return NextResponse.json({
      invoices: invoices.data.map((inv) => ({
        id: inv.id,
        date: inv.created,
        amount: inv.amount_paid / 100,
        currency: inv.currency,
        status: inv.status,
        pdf: inv.invoice_pdf,
        number: inv.number,
      })),
    });
  } catch {
    return NextResponse.json({ invoices: [] });
  }
}
