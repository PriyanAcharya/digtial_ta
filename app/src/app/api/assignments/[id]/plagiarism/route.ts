import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { similarityScore, type SimilarityPair } from "@/lib/similarity";

/**
 * GET /api/assignments/:id/plagiarism?threshold=0.8&limit=50
 * Returns pairs of submissions with similarity >= threshold (default 0.8).
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const url = new URL(req.url);
  const threshold = Math.max(0, Math.min(1, Number(url.searchParams.get("threshold") ?? 0.8)));
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit") ?? 50)));

  const subs = await prisma.submission.findMany({
    where: { assignmentId: id },
    select: { id: true, studentName: true, code: true, createdAt: true },
    orderBy: { createdAt: "asc" },
    take: 500, // safety cap
  });

  const pairs: SimilarityPair[] = [];
  for (let i = 0; i < subs.length; i++) {
    for (let j = i + 1; j < subs.length; j++) {
      const A = subs[i];
      const B = subs[j];
      const s = similarityScore(A.code, B.code);
      if (s.score >= threshold) {
        pairs.push({
          aId: A.id,
          bId: B.id,
          aStudent: A.studentName,
          bStudent: B.studentName,
          score: Number(s.score.toFixed(3)),
          overlap: s.overlap,
          aLen: s.aLen,
          bLen: s.bLen,
        });
      }
    }
  }

  // sort: highest similarity first, then larger overlap
  pairs.sort((x, y) => (y.score - x.score) || (y.overlap - x.overlap));
  return NextResponse.json(pairs.slice(0, limit));
}
