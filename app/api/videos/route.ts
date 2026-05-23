import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    console.log("📹 GET videos — userId:", userId);

    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    console.log("📹 Supabase result:", data?.length, "videos, error:", error);

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    return NextResponse.json({ videos: data || [] });
  } catch (err: any) {
    console.error("❌ Videos route error:", err.message, err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Delete error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
