import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";

    // totalFrames avec 30fps
    if (!body.totalFrames) {
      const durationSec =
        body.durationSeconds ??
        (typeof body.duration === "number" ? body.duration : parseInt(body.duration, 10)) ??
        30;
      body.totalFrames = Math.round(durationSec * 30);
    }

    const res = await fetch(`${RENDER_URL}/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur render";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
