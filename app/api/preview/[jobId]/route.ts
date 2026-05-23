import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const TMP = process.env.TMP_DIR || "/tmp/motionai";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const job = await prisma.job.findUnique({
    where: { id: params.jobId },
    select: { userId: true, status: true },
  });

  if (!job) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  const videoPath = path.join(TMP, params.jobId, "final.mp4");
  if (!fs.existsSync(videoPath)) {
    return NextResponse.json({ error: "Video non trouvee" }, { status: 404 });
  }

  const stat = fs.statSync(videoPath);
  const range = req.headers.get("range");

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunkSize = end - start + 1;
    const stream = fs.createReadStream(videoPath, { start, end });

    return new NextResponse(stream as unknown as BodyInit, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "video/mp4",
      },
    });
  }

  const stream = fs.createReadStream(videoPath);
  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": stat.size.toString(),
      "Content-Disposition": `attachment; filename="motionai-${params.jobId}.mp4"`,
    },
  });
}
