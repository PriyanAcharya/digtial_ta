import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string }}){
  const a = await prisma.assignment.findUnique({ where: { id: Number(params.id) } });
  if(!a) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(a);
}

