import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";

    const res = await fetch(`${RENDER_URL}/music`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur music";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
