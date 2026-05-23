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

    const res = await fetch(`${RENDER_URL}/render/${jobId}`);
    const data = await res.json();

    // Sauvegarder dans Supabase quand done
    if (data.status === "done") {
      try {
        const { userId } = await auth();
        if (userId) {
          const metaRes = await fetch(`${RENDER_URL}/meta/${jobId}`);
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

          // Incrémenter crédits
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/credits`, {
            method: "POST",
          });
        }
      } catch (saveErr) {
        console.error("Save error:", saveErr);
      }
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ status: "error", error: message });
  }
}
