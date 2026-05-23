import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  console.log("🔄 Polling jobId:", params.jobId);
  try {
    const { jobId } = params;
    const outDir    = path.join(process.cwd(), "public", "renders");
    const outPath   = path.join(outDir, `${jobId}.mp4`);
    const errPath   = path.join(outDir, `${jobId}.error`);
    const metaPath  = path.join(outDir, `${jobId}.meta.json`);
    const savedPath = path.join(outDir, `${jobId}.saved`);

    if (fs.existsSync(errPath)) {
      const errMsg = fs.readFileSync(errPath, "utf-8");
      return NextResponse.json({ status: "error", error: errMsg });
    }

    if (fs.existsSync(outPath)) {
      const videoUrl = `/renders/${jobId}.mp4`;

      // Sauvegarder dans Supabase UNE SEULE FOIS
      if (!fs.existsSync(savedPath)) {
        try {
          let userId: string | null = null;
          try {
            const authResult = await auth();
            userId = authResult.userId;
          } catch (authErr: unknown) {
            const msg = authErr instanceof Error ? authErr.message : String(authErr);
            console.error("❌ Auth error:", msg);
          }
          console.log("💾 Sauvegarde Supabase pour userId:", userId);

          if (userId) {
            const jobData = fs.existsSync(metaPath)
              ? JSON.parse(fs.readFileSync(metaPath, "utf-8"))
              : {};

            console.log("💾 jobData:", JSON.stringify(jobData).slice(0, 200));

            const { error: sbError } = await supabase
              .from("videos")
              .insert({
                user_id:     userId,
                prompt:      jobData.prompt      || "Vidéo générée",
                format:      jobData.format      || "9:16",
                duration:    jobData.duration    || 30,
                video_url:   videoUrl,
                audio_url:   jobData.audioUrl    || null,
                accent_color: jobData.accentColor || null,
                format_name: jobData.formatName  || null,
                status:      "done",
              });

            if (sbError) {
              console.error("❌ Supabase error:", sbError);
            } else {
              console.log("✅ Sauvegardé dans Supabase");
              fs.writeFileSync(savedPath, "1");
            }
          } else {
            console.log("⚠️ Pas de userId — non connecté ?");
          }
        } catch (saveErr: unknown) {
          const message = saveErr instanceof Error ? saveErr.message : String(saveErr);
          console.error("❌ Save error:", message);
        }
      }

      return NextResponse.json({ status: "done", videoUrl });
    }

    return NextResponse.json({ status: "rendering" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ JobId route error:", err);
    return NextResponse.json({ status: "error", error: message });
  }
}
