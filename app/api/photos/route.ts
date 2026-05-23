import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { url, filename } = await req.json();
    if (!url) return NextResponse.json({ error: "URL requise" }, { status: 400 });

    const res = await fetch(url);
    if (!res.ok) return NextResponse.json({ error: "Téléchargement échoué" }, { status: 400 });

    const buffer = Buffer.from(await res.arrayBuffer());
    const ext = url.includes(".png") ? "png" : "jpg";
    const name = filename || `${uuidv4()}.${ext}`;
    const contentType = ext === "png" ? "image/png" : "image/jpeg";

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(name, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("photos")
      .getPublicUrl(name);

    return NextResponse.json({ photoUrl: publicUrl });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
