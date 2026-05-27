import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";

    // S'assurer que l'URL a bien https://
    if (!RENDER_URL.startsWith("http://") && !RENDER_URL.startsWith("https://")) {
      RENDER_URL = `https://${RENDER_URL}`;
    }

    console.log("🎙️ Voice URL:", `${RENDER_URL}/voice`);

    const res = await fetch(`${RENDER_URL}/voice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Voice route error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
