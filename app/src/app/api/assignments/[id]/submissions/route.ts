import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string }}) {
  const assignmentId = Number(params.id);
  const subs = await prisma.submission.findMany({
    where: { assignmentId },
    orderBy: [{ score: "desc" }, { durationMs: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      studentName: true,
      score: true,
      maxScore: true,
      durationMs: true,
      createdAt: true,
    },
    take: 100
  });
  return NextResponse.json(subs);
}
