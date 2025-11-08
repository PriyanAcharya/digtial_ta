import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.submission.groupBy({
    by: ["studentName"],
    _count: { _all: true },
    orderBy: { studentName: "asc" },
  });
  return NextResponse.json(rows.map(r => ({ name: r.studentName, attempts: r._count._all })));
}
