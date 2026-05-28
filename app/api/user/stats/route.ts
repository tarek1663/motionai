import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { data: videos } = await supabase
      .from("videos")
      .select("format, duration, created_at")
      .eq("user_id", userId);

    const total = videos?.length || 0;
    const totalDuration = videos?.reduce((acc, v) => acc + (v.duration || 0), 0) || 0;

    const formatCounts: Record<string, number> = {};
    videos?.forEach((v) => {
      if (v.format) formatCounts[v.format] = (formatCounts[v.format] || 0) + 1;
    });
    const topFormat =
      Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "9:16";

    const thisMonth =
      videos?.filter((v) => {
        const d = new Date(v.created_at);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length || 0;

    return NextResponse.json({ total, totalDuration, topFormat, thisMonth });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
