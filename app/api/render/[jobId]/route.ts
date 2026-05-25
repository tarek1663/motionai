import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    const bucketName = req.nextUrl.searchParams.get("bucketName") || "";

    const { getRenderProgress } = await import("@remotion/lambda-client");

    const progress = await getRenderProgress({
      renderId: jobId,
      bucketName,
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
      region: "eu-west-3",
    });

    if (progress.fatalErrorEncountered) {
      return NextResponse.json({
        status: "error",
        error: progress.errors?.[0]?.message || "Erreur Lambda",
      });
    }

    if (progress.done) {
      const videoUrl = progress.outputFile;

      try {
        const { userId } = await auth();
        if (userId && videoUrl) {
          const RENDER_URL = process.env.RENDER_SERVER_URL || "";
          const metaRes = await fetch(`${RENDER_URL}/meta/${jobId}`).catch(() => null);
          const meta = metaRes?.ok ? await metaRes.json() : {};

          await supabase.from("videos").insert({
            user_id: userId,
            prompt: meta.prompt || "Vidéo générée",
            format: meta.format || "9:16",
            duration: meta.duration || 30,
            video_url: videoUrl,
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
            await supabase
              .from("subscriptions")
              .update({ videos_used: (currentSub.videos_used || 0) + 1 })
              .eq("user_id", userId);
          }
        }
      } catch (saveErr: any) {
        console.error("Save error:", saveErr.message);
      }

      return NextResponse.json({ status: "done", videoUrl });
    }

    return NextResponse.json({
      status: "rendering",
      progress: Math.round((progress.overallProgress || 0) * 100),
    });
  } catch (err: any) {
    console.error("Progress error:", err.message);
    return NextResponse.json({ status: "error", error: err.message });
  }
}
