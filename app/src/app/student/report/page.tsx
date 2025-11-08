"use client";
import { useEffect, useState } from "react";

type Row = {
  assignmentId: number;
  title: string;
  attempts: number;
  bestScore: number;
  maxScore: number;
  avgRuntimeMs: number;
  lastSubmitAt: string | null;
  lastScore: number;
  pct: number;
};

type Report = {
  studentName: string;
  rows: Row[];
  overall: { totalScore: number; totalMax: number; pct: number; attempts: number; avgRuntimeMs: number; };
};

export default function StudentReportPage() {
  const [name, setName] = useState("Student One");
  const [data, setData] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/students/${encodeURIComponent(name)}/report`);
    setData(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🎓 Student Report Card</h1>
      <div className="flex gap-2 items-center mb-6">
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="border p-2 rounded w-64" />
        <button onClick={load} className="bg-blue-600 text-white px-3 py-2 rounded">Refresh</button>
      </div>

      {loading ? <div>Loading…</div> : data ? (
        <>
          <div className="mb-4 p-4 border rounded">
            <div><b>Student:</b> {data.studentName}</div>
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
      ) : <div>No data.</div>}
    </div>
  );
}
