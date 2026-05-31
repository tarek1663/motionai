import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { normalizeDashboardVideos } from "@/lib/dashboard/videos";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  void req;
  try {
    const { userId } = await auth();
    console.log("📹 Videos API called — userId:", userId);

    if (!userId) return NextResponse.json({ videos: [] });

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    console.log("📹 Videos found:", data?.length, "— Error:", error?.message);

    if (error) {
      console.error("📹 Supabase error:", error);
      return NextResponse.json({ videos: [] });
    }

    return NextResponse.json({ videos: normalizeDashboardVideos(data || []) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("📹 Videos route error:", message);
    return NextResponse.json({ videos: [] });
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
