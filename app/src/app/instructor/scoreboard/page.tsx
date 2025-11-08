"use client";
import { useEffect, useState } from "react";

type Row = {
  studentName: string;
  totalScore: number;
  totalMax: number;
  attempts: number;
  avgRuntimeMs: number;
  lastSubmitAt: string;
  pct: number;
};

export default function ScoreboardPage() {
  const [assignmentId, setAssignmentId] = useState<string>("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const q = assignmentId ? `?assignmentId=${assignmentId}` : "";
    const res = await fetch(`/api/scoreboard${q}`);
    setRows(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // initial

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📊 Scoreboard</h1>

      <div className="mb-4 flex items-center gap-2">
        <label>Assignment ID (optional)</label>
        <input
          value={assignmentId}
          onChange={(e)=>setAssignmentId(e.target.value)}
          className="border p-2 w-28 rounded"
          placeholder="e.g. 1"
        />
        <button onClick={load} className="bg-blue-600 text-white px-3 py-2 rounded">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-600">No data yet.</div>
      ) : (
        <table className="w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">Rank</th>
              <th className="px-3 py-2 text-left">Student</th>
              <th className="px-3 py-2 text-left">Total</th>
              <th className="px-3 py-2 text-left">Out of</th>
              <th className="px-3 py-2 text-left">% Score</th>
              <th className="px-3 py-2 text-left">Attempts</th>
              <th className="px-3 py-2 text-left">Avg Runtime (ms)</th>
              <th className="px-3 py-2 text-left">Last Submit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.studentName} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2 font-medium">{r.studentName}</td>
                <td className="px-3 py-2">{r.totalScore}</td>
                <td className="px-3 py-2">{r.totalMax}</td>
                <td className="px-3 py-2">{(r.pct * 100).toFixed(1)}%</td>
                <td className="px-3 py-2">{r.attempts}</td>
                <td className="px-3 py-2">{r.avgRuntimeMs}</td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {r.lastSubmitAt ? new Date(r.lastSubmitAt).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
