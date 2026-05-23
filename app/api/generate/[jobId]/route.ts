import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const job = await prisma.job.findUnique({
    where: { id: params.jobId },
    select: {
      id: true,
      userId: true,
      status: true,
      progress: true,
      videoUrl: true,
      errorMessage: true,
      creditsUsed: true,
      createdAt: true,
    },
  });

  if (!job) return NextResponse.json({ error: "Job introuvable" }, { status: 404 });

  return NextResponse.json(job);
}
