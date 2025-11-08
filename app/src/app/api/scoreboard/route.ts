import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/scoreboard?assignmentId=1
 * Aggregates submissions by studentName.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const assignmentId = url.searchParams.get("assignmentId");
  const where = assignmentId ? { assignmentId: Number(assignmentId) } : {};

  const rows = await prisma.submission.groupBy({
    by: ["studentName"],
    where,
    _sum: { score: true, maxScore: true, durationMs: true },
    _count: { _all: true },
    _max: { createdAt: true },
  });

  // massage + sort
  const out = rows
    .map(r => ({
      studentName: r.studentName,
      totalScore: r._sum.score ?? 0,
      totalMax: r._sum.maxScore ?? 0,
      attempts: r._count._all,
      avgRuntimeMs: r._count._all ? Math.round((r._sum.durationMs ?? 0) / r._count._all) : 0,
      lastSubmitAt: r._max.createdAt,
      pct: (r._sum.maxScore ?? 0) ? (r._sum.score ?? 0) / (r._sum.maxScore ?? 1) : 0,
    }))
    .sort((a,b) => (b.totalScore - a.totalScore) || (a.avgRuntimeMs - b.avgRuntimeMs))
    .slice(0, 100);

  return NextResponse.json(out);
}
