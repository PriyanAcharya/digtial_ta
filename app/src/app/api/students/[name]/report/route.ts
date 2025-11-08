import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const studentName = decodeURIComponent(params.name);

  const subs = await prisma.submission.findMany({
    where: { studentName },
    include: { Assignment: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  // assignmentId -> aggregate
  const byAssign = new Map<number, any>();
  for (const s of subs) {
    const k = s.assignmentId;
    const cur = byAssign.get(k) ?? {
      assignmentId: k,
      title: s.Assignment?.title ?? `Assignment ${k}`,
      attempts: 0,
      bestScore: 0,
      maxScore: s.maxScore,
      avgRuntimeMs: 0,
      lastSubmitAt: null as Date | null,
      lastScore: 0,
    };
    cur.attempts += 1;
    cur.bestScore = Math.max(cur.bestScore, s.score);
    cur.lastSubmitAt = cur.lastSubmitAt ? cur.lastSubmitAt : s.createdAt;
    cur.lastScore = cur.lastScore || s.score;
    cur.avgRuntimeMs += s.durationMs;
    byAssign.set(k, cur);
  }
  const rows = Array.from(byAssign.values()).map(r => ({
    ...r,
    avgRuntimeMs: r.attempts ? Math.round(r.avgRuntimeMs / r.attempts) : 0,
    pct: r.maxScore ? r.bestScore / r.maxScore : 0,
  }));

  const totals = rows.reduce(
    (acc, r) => {
      acc.totalScore += r.bestScore;
      acc.totalMax += r.maxScore;
      acc.totalAttempts += r.attempts;
      acc.avgRuntimeMsSum += r.avgRuntimeMs;
      return acc;
    },
    { totalScore: 0, totalMax: 0, totalAttempts: 0, avgRuntimeMsSum: 0 }
  );
  const overall = {
    totalScore: totals.totalScore,
    totalMax: totals.totalMax,
    pct: totals.totalMax ? totals.totalScore / totals.totalMax : 0,
    attempts: totals.totalAttempts,
    avgRuntimeMs: rows.length ? Math.round(totals.avgRuntimeMsSum / rows.length) : 0,
  };

  return NextResponse.json({ studentName, rows, overall });
}
