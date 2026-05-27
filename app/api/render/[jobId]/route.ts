import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    let RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";
    if (!RENDER_URL.startsWith("http://") && !RENDER_URL.startsWith("https://")) {
      RENDER_URL = `https://${RENDER_URL}`;
    }

    console.log("🔍 Polling:", `${RENDER_URL}/render/${jobId}`);

    const res = await fetch(`${RENDER_URL}/render/${jobId}`, { cache: "no-store" });
    const data = await res.json();

    if (data.status === "done" && data.videoUrl) {
      try {
        const { userId } = await auth();
        if (userId) {
          const metaRes = await fetch(`${RENDER_URL}/meta/${jobId}`, { cache: "no-store" });
          const meta = metaRes.ok ? await metaRes.json() : {};

          await supabase.from("videos").insert({
            user_id: userId,
            prompt: meta.prompt || "Vidéo générée",
            format: meta.format || "9:16",
            duration: meta.duration || 30,
            video_url: data.videoUrl,
            accent_color: meta.accentColor || null,
            format_name: meta.formatName || null,
            status: "done",
          });

          const { data: currentSub } = await supabase
            .from("subscriptions")
            .select("videos_used")
            .eq("user_id", userId)
            .single();

          if (currentSub) {
            await supabase.from("subscriptions")
              .update({ videos_used: (currentSub.videos_used || 0) + 1 })
              .eq("user_id", userId);
          }
        }
      } catch (saveErr: any) {
        console.error("Save error:", saveErr.message);
      }
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Polling error:", err.message);
    return NextResponse.json({ status: "error", error: err.message });
  }
}
