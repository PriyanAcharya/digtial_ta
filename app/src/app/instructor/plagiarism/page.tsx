"use client";
import { useEffect, useState } from "react";

type Pair = {
  aId: number; bId: number;
  aStudent: string; bStudent: string;
  score: number; overlap: number; aLen: number; bLen: number;
};

export default function PlagiarismPage() {
  const [assignmentId, setAssignmentId] = useState<number>(1);
  const [threshold, setThreshold] = useState<number>(0.7);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/assignments/${assignmentId}/plagiarism?threshold=${threshold}`);
    const data = await res.json();
    setPairs(data);
    setLoading(false);
  };

  useEffect(() => { load(); /* auto-load on first render */ }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>🧭 Plagiarism / Similarity</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <label>Assignment ID</label>
        <input type="number" value={assignmentId}
          onChange={(e)=>setAssignmentId(Number(e.target.value||1))}
          style={{ border: "1px solid #ccc", padding: 6, width: 90, borderRadius: 6 }}
        />
        <label>Threshold</label>
        <input type="number" step="0.05" min="0" max="1" value={threshold}
          onChange={(e)=>setThreshold(Number(e.target.value||0.8))}
          style={{ border: "1px solid #ccc", padding: 6, width: 90, borderRadius: 6 }}
        />
        <button onClick={load} style={{ background: "#2563eb", color: "white", padding: "8px 12px", borderRadius: 8 }}>
          Refresh
        </button>
      </div>

      {loading ? <div>Loading…</div> : pairs.length === 0 ? (
        <div style={{ color: "#666" }}>No flagged pairs ≥ {threshold}.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead style={{ background: "#f7f7f7" }}>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Score</th>
              <th style={{ textAlign: "left", padding: 8 }}>A (id / name)</th>
              <th style={{ textAlign: "left", padding: 8 }}>B (id / name)</th>
              <th style={{ textAlign: "left", padding: 8 }}>Overlap</th>
              <th style={{ textAlign: "left", padding: 8 }}>Shingles (A/B)</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((p, i) => (
              <tr key={i} style={{ background: i % 2 ? "#fafafa" : "white" }}>
                <td style={{ padding: 8, fontWeight: 600 }}>{p.score.toFixed(2)}</td>
                <td style={{ padding: 8 }}>{p.aId} — {p.aStudent}</td>
                <td style={{ padding: 8 }}>{p.bId} — {p.bStudent}</td>
                <td style={{ padding: 8 }}>{p.overlap}</td>
                <td style={{ padding: 8 }}>{p.aLen} / {p.bLen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
