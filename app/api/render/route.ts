import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    if (userId) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (sub && sub.plan !== "business" && sub.videos_used >= sub.videos_limit) {
        return NextResponse.json(
          {
            error: "Limite atteinte",
            upgrade: true,
            plan: sub.plan,
            limit: sub.videos_limit,
          },
          { status: 403 }
        );
      }
    }

    const { renderMediaOnLambda } = await import("@remotion/lambda-client");

    const result = await renderMediaOnLambda({
      region: "eu-west-3",
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
      serveUrl: process.env.REMOTION_SERVE_URL!,
      composition: "MotionVideo",
      inputProps: {
        ...body,
        audioSrc: body.audioUrl || null,
        musicSrc: body.musicUrl || null,
        musicVolume: body.musicVolume || 0.07,
      },
      codec: "h264",
      imageFormat: "jpeg",
      maxRetries: 1,
      framesPerLambda: 20,
      concurrencyPerLambda: 1,
      crf: 18,
      privacy: "public",
    });

    return NextResponse.json({ jobId: result.renderId, bucketName: result.bucketName });
  } catch (err: any) {
    console.error("Lambda render error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
