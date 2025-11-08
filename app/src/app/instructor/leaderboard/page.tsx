"use client";
import { useEffect, useState } from "react";

type Row = {
  id: number;
  studentName: string;
  score: number;
  maxScore: number;
  durationMs: number;
  createdAt: string;
};

export default function LeaderboardPage() {
  const [assignmentId, setAssignmentId] = useState<number>(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/assignments/${assignmentId}/submissions`)
      .then(r => r.json())
      .then(setRows)
      .finally(() => setLoading(false));
  }, [assignmentId]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm">Assignment ID:</label>
        <input
          type="number"
          value={assignmentId}
          onChange={(e) => setAssignmentId(Number(e.target.value || 1))}
          className="border p-2 w-24 rounded"
        />
      </div>

      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-600">No submissions yet.</div>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Student</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Max</th>
              <th className="px-4 py-2 text-left">Runtime (ms)</th>
              <th className="px-4 py-2 text-left">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s, i) => (
              <tr key={s.id} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2 font-medium">{s.studentName}</td>
                <td className="px-4 py-2 text-green-700">{s.score}</td>
                <td className="px-4 py-2">{s.maxScore}</td>
                <td className="px-4 py-2">{s.durationMs}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
