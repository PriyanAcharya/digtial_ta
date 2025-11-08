import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-instructor-secret");
  if (secret !== process.env.INSTRUCTOR_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, deadline, testsJson } = body ?? {};

  // basic validation
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }
  try {
    JSON.parse(testsJson);
  } catch {
    return NextResponse.json({ error: "testsJson must be valid JSON" }, { status: 400 });
  }

  const a = await prisma.assignment.create({
    data: {
      title,
      deadline: deadline ? new Date(deadline) : null,
      languages: "python",
      testsJson,
    },
  });

  return NextResponse.json(a);
}

export async function GET() {
  const list = await prisma.assignment.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  return NextResponse.json(list);
}
