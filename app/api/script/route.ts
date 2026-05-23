import { NextRequest, NextResponse } from "next/server";
import { generateVideoScript } from "@/lib/claude";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { prompt, format, duration } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    const script = await generateVideoScript({ prompt, format, duration });
    return NextResponse.json({ script });
  } catch (err: unknown) {
    console.error("Script error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
