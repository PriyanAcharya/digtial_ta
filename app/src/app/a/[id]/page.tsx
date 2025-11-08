import Client from './student-client';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function StudentPage({ params }: { params: { id: string }}){
  const id = Number(params.id);
  const a = await prisma.assignment.findUnique({ where: { id } });
  if(!a) return notFound();
  const tests = JSON.parse(a.testsJson) as Array<{ name:string; points:number; public:boolean; input:string; expected:string }>
  const publicCount = tests.filter(t=>t.public).length;
  return <Client id={id} title={a.title} publicCount={publicCount} />
}
