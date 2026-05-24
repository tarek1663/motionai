import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    const RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";

    console.log("🔍 Polling jobId:", jobId);
    console.log("🔍 Render URL:", RENDER_URL);

    const res = await fetch(`${RENDER_URL}/render/${jobId}`, {
      cache: "no-store",
    });

    console.log("🔍 Railway response status:", res.status);

    const data = await res.json();
    console.log("🔍 Railway response:", JSON.stringify(data));

    if (data.status === "done" && data.videoUrl) {
      try {
        const { userId } = await auth();
        if (userId) {
          const { data: existing } = await supabase
            .from("videos")
            .select("id")
            .eq("user_id", userId)
            .eq("video_url", data.videoUrl)
            .maybeSingle();

          if (!existing) {
            const metaRes = await fetch(`${RENDER_URL}/meta/${jobId}`, {
              cache: "no-store",
            });
            const meta = metaRes.ok ? await metaRes.json() : {};

            const { error } = await supabase.from("videos").insert({
              user_id: userId,
              prompt: meta.prompt || "Vidéo générée",
              format: meta.format || "9:16",
              duration: meta.duration || 30,
              video_url: data.videoUrl,
              accent_color: meta.accentColor || null,
              format_name: meta.formatName || null,
              status: "done",
            });

            if (error) console.error("❌ Supabase error:", error);
            else console.log("✅ Saved to Supabase");

            const { data: currentSub } = await supabase
              .from("subscriptions")
              .select("videos_used")
              .eq("user_id", userId)
              .single();

            if (currentSub) {
              await supabase
                .from("subscriptions")
                .update({ videos_used: (currentSub.videos_used || 0) + 1 })
                .eq("user_id", userId);
            }
          }
        }
      } catch (saveErr: unknown) {
        const message = saveErr instanceof Error ? saveErr.message : "Erreur";
        console.error("❌ Save error:", message);
      }
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur";
    console.error("❌ Polling error:", message);
    return NextResponse.json({ status: "error", error: message });
  }
}
