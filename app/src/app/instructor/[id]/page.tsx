import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function InstructorView({ params }: { params: { id: string }}){
  const id = Number(params.id);
  const assignment = await prisma.assignment.findUnique({ where: { id } });
  if(!assignment) return notFound();

  const submissions = await prisma.submission.findMany({
    where: { assignmentId: id }, orderBy: [{ score: 'desc' }, { durationMs: 'asc' }], take: 50
  });

  const avg = await prisma.submission.aggregate({ where: { assignmentId: id }, _avg: { score: true, maxScore: true }});
  const avgPct = avg._avg.score && avg._avg.maxScore ? Math.round((avg._avg.score*100) / avg._avg.maxScore) : 0;

  return (
    <div>
      <h2>Instructor Dashboard — {assignment.title}</h2>
      <p>Avg score: <b>{avgPct}%</b> · Submissions shown: <b>{submissions.length}</b></p>
      <h3>Leaderboard</h3>
      <table border={1} cellPadding={6}>
        <thead><tr><th>#</th><th>Name</th><th>Score</th><th>Max</th><th>Time (ms)</th></tr></thead>
        <tbody>
          {submissions.map((s, i)=> (
            <tr key={s.id}><td>{i+1}</td><td>{s.studentName}</td><td>{s.score}</td><td>{s.maxScore}</td><td>{s.durationMs}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

