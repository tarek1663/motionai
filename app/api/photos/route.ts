import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { url, filename } = await req.json();
    if (!url) return NextResponse.json({ error: "URL requise" }, { status: 400 });

    const res = await fetch(url);
    if (!res.ok) return NextResponse.json({ error: "Téléchargement échoué" }, { status: 400 });

    const buffer = Buffer.from(await res.arrayBuffer());
    const ext    = url.includes(".png") ? "png" : "jpg";
    const name   = filename || `${uuidv4()}.${ext}`;
    const dir    = path.join(process.cwd(), "public", "photos");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), buffer);

    return NextResponse.json({ photoUrl: `/photos/${name}` });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
