"use client";
import { useEffect, useState } from "react";

type Row = {
  assignmentId: number; title: string; attempts: number; bestScore: number; maxScore: number;
  avgRuntimeMs: number; lastSubmitAt: string | null; lastScore: number; pct: number;
};
type Report = {
  studentName: string;
  rows: Row[];
  overall: { totalScore: number; totalMax: number; pct: number; attempts: number; avgRuntimeMs: number; };
};

export default function InstructorStudentReport({ params }: { params: { name: string } }) {
  const [data, setData] = useState<Report | null>(null);
  const student = decodeURIComponent(params.name);

  useEffect(() => {
    fetch(`/api/students/${encodeURIComponent(student)}/report`).then(async r => setData(await r.json()));
  }, [student]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧑‍🏫 Report — {student}</h1>

      {!data ? <div>Loading…</div> : (
        <>
          <div className="mb-4 p-4 border rounded">
            <div><b>Total:</b> {data.overall.totalScore} / {data.overall.totalMax} ({(data.overall.pct*100).toFixed(1)}%)</div>
            <div><b>Total Attempts:</b> {data.overall.attempts}</div>
            <div><b>Avg Runtime:</b> {data.overall.avgRuntimeMs} ms</div>
          </div>
          <table className="w-full border border-gray-300 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left">Assignment</th>
                <th className="px-3 py-2 text-left">Best</th>
                <th className="px-3 py-2 text-left">Out of</th>
                <th className="px-3 py-2 text-left">% </th>
                <th className="px-3 py-2 text-left">Attempts</th>
                <th className="px-3 py-2 text-left">Avg Runtime (ms)</th>
                <th className="px-3 py-2 text-left">Last Submit</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r, i) => (
                <tr key={r.assignmentId} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2">{r.bestScore}</td>
                  <td className="px-3 py-2">{r.maxScore}</td>
                  <td className="px-3 py-2">{(r.pct*100).toFixed(1)}%</td>
                  <td className="px-3 py-2">{r.attempts}</td>
                  <td className="px-3 py-2">{r.avgRuntimeMs}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{r.lastSubmitAt ? new Date(r.lastSubmitAt).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
