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

    const permanentUrl = data.url || data.videoUrl;

    if (data.status === "done" && permanentUrl) {
      try {
        const { userId } = await auth();
        if (userId) {
          const metaRes = await fetch(`${RENDER_URL}/meta/${jobId}`, { cache: "no-store" });
          const meta = metaRes.ok ? await metaRes.json() : {};

          const updatePayload = {
            prompt: meta.prompt || "Video generee",
            format: meta.format || "9:16",
            duration: meta.duration || 30,
            video_url: permanentUrl,
            accent_color: meta.accentColor || null,
            format_name: meta.formatName || null,
            status: "done",
          };

          const { data: updatedByJob } = await supabase
            .from("videos")
            .update(updatePayload)
            .eq("job_id", jobId)
            .eq("user_id", userId)
            .select("id");

          if (!updatedByJob?.length) {
            const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
            const { data: renderingVideo } = await supabase
              .from("videos")
              .select("id")
              .eq("user_id", userId)
              .eq("status", "rendering")
              .gte("created_at", since)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            if (renderingVideo?.id) {
              await supabase
                .from("videos")
                .update({ ...updatePayload, job_id: jobId })
                .eq("id", renderingVideo.id);
            } else {
              await supabase.from("videos").insert({
                user_id: userId,
                job_id: jobId,
                ...updatePayload,
              });
            }
          }

          // videos_used est incrémenté au lancement du rendu (POST /api/render)
        }
      } catch (saveErr: unknown) {
        const message = saveErr instanceof Error ? saveErr.message : String(saveErr);
        console.error("Save error:", message);
      }
    }

    if (data.status === "error") {
      const { userId } = await auth();
      if (userId) {
        const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        await supabase
          .from("videos")
          .update({ status: "error" })
          .eq("user_id", userId)
          .eq("status", "rendering")
          .gte("created_at", since);
      }
    }

    return NextResponse.json({
      status: data.status,
      progress: data.progress ?? 0,
      videoUrl: permanentUrl ?? data.videoUrl ?? null,
      url: permanentUrl ?? data.url ?? data.videoUrl ?? null,
      supabaseUrl: data.supabaseUrl ?? null,
      error: data.error ?? null,
    });
  } catch (err: any) {
    console.error("Polling error:", err.message);
    return NextResponse.json({ status: "error", error: err.message });
  }
}
