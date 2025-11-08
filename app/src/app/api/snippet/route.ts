import { NextRequest, NextResponse } from "next/server";
import { runPython } from "@/lib/judge0";

/**
 * POST /api/snippet
 * { code: string, stdin?: string }
 * -> { stdout, stderr, time_ms, memory_kb, status }
 */
export async function POST(req: NextRequest) {
  const { code, stdin = "" } = await req.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

  const r = await runPython(code, stdin);
  return NextResponse.json({
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
    time_ms: Math.round(Number(r.time || 0) * 1000),
    memory_kb: r.memory ?? 0,
    status: r.status?.description ?? "Unknown",
  });
}
