import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/lib/judge0';

export async function POST(req: NextRequest){
  const { code, stdin } = await req.json();
  const res = await runPython(code, stdin ?? '');
  return NextResponse.json(res);
}

