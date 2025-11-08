import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runPython } from '@/lib/judge0';

function norm(s?: string){ return (s ?? '').trim().replace(/\r\n/g, '\n'); }

export async function POST(req: NextRequest, { params }: { params: { id: string }}){
  const { code, studentName } = await req.json();
  const assignment = await prisma.assignment.findUnique({ where: { id: Number(params.id) } });
  if(!assignment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const tests = JSON.parse(assignment.testsJson) as Array<{
    name: string; points: number; public: boolean; input: string; expected: string; timeoutSec?: number;
  }>;

  let total = 0, max = 0, durationMs = 0;
  const results: any[] = [];

  for (const t of tests) {
    max += t.points;
    const r = await runPython(code, t.input);
    const out = norm(r.stdout);
    const exp = norm(t.expected);
    const passed = out === exp && r.status?.id === 3; // 3 = Accepted
    const rt = Math.round(Number(r.time || 0) * 1000);
    total += passed ? t.points : 0;
    durationMs += rt;
    results.push({ name: t.name, points: t.points, passed, runtime_ms: rt, stdout: (out||'').slice(0,500), stderr: (r.stderr || r.compile_output || '').slice(0,200) });
  }

  const saved = await prisma.submission.create({
    data: { assignmentId: assignment.id, studentName, language: 'python', code, score: total, maxScore: max, durationMs, detailsJson: JSON.stringify(results) }
  });

  return NextResponse.json({ submissionId: saved.id, score: total, maxScore: max, results });
}

