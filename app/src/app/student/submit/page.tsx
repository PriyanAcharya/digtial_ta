"use client";

import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";

type Assignment = {
  id: number;
  title: string;
  testsJson: string; // JSON string: [{ name, points, public, ...}]
  createdAt: string;
};

type SubmitResp = {
  submissionId: number;
  score: number;
  maxScore: number;
  results: {
    name: string;
    points: number;
    passed: boolean;
    runtime_ms: number;
    stdout: string;
    stderr: string;
  }[];
};

// 👉 point to your external server (set in .env.local)
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

// helper to safely parse testsJson
function safeParseTests(jsonStr?: string): any[] {
  if (!jsonStr) return [];
  try {
    const v = JSON.parse(jsonStr);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default function SubmitPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignId, setAssignId] = useState<number | null>(null);
  const [studentName, setStudentName] = useState("Student One");
  const [code, setCode] = useState<string>(
    `# Reads two ints, prints sum
import sys
a,b = map(int, sys.stdin.read().split())
print(a+b)`
  );
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<SubmitResp | null>(null);

  // fetch assignments from external API
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/assignments`, {
          signal: ac.signal,
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Assignments fetch failed (${res.status})`);
        }
        const list: Assignment[] = await res.json();
        setAssignments(list);
        if (list.length && assignId === null) setAssignId(list[0].id);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e.message || "Failed to load assignments");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []); // initial load

  const selected = useMemo(
    () => assignments.find((a) => a.id === assignId) || null,
    [assignments, assignId]
  );

  async function onSubmit() {
    setError("");
    setSubmitting(true);
    setResult(null);
    try {
      if (!assignId) throw new Error("Choose an assignment");
      if (!code.trim()) throw new Error("Paste your code first");
      const res = await fetch(`${API_BASE}/assignments/${assignId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, studentName, language: "python" }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Submit failed (${res.status})`);
      }
      const j: SubmitResp = await res.json();
      setResult(j);
    } catch (e: any) {
      setError(e.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  const tests = safeParseTests(selected?.testsJson);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Submit &amp; Grade</h1>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Assignment</label>
          <select
            className="w-full border rounded p-2"
            value={assignId ?? ""}
            onChange={(e) => setAssignId(Number(e.target.value))}
            disabled={loading || !assignments.length}
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id}. {a.title}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mt-3">Your name</label>
          <input
            className="w-full border rounded p-2"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Student name"
          />

          <button
            onClick={onSubmit}
            disabled={submitting || !assignId}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit for Grading"}
          </button>

          {loading && <div className="mt-3 text-sm">Loading assignments…</div>}
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

          {selected && (
            <div className="mt-6 text-sm bg-gray-50 border rounded p-3">
              <div className="font-semibold mb-1">Public test(s)</div>
              <ul className="list-disc ml-5 space-y-1">
                {tests
                  .filter((t: any) => t?.public)
                  .map((t: any, i: number) => (
                    <li key={i}>
                      {t.name} — {t.points} pts
                    </li>
                  ))}
                {!tests.length && <li>No public tests</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="md:col-span-2 min-h-[420px] border rounded overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{ fontSize: 14, minimap: { enabled: false } }}
          />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="text-lg font-semibold">
            Score: {result.score} / {result.maxScore}
          </div>
          <table className="w-full text-sm border rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border">Test</th>
                <th className="text-left p-2 border">Passed</th>
                <th className="text-left p-2 border">Points</th>
                <th className="text-left p-2 border">Time (ms)</th>
                <th className="text-left p-2 border">Stdout</th>
              </tr>
            </thead>
            <tbody>
              {result.results.map((r, i) => (
                <tr key={i}>
                  <td className="p-2 border">{r.name}</td>
                  <td className={`p-2 border ${r.passed ? "text-green-700" : "text-red-700"}`}>
                    {r.passed ? "✓" : "✗"}
                  </td>
                  <td className="p-2 border">{r.points}</td>
                  <td className="p-2 border">{r.runtime_ms}</td>
                  <td className="p-2 border whitespace-pre">{r.stdout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
