"use client";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const DEFAULT_CODE = `# Python 3
# Reads two integers and prints their sum
a, b = map(int, input().split())
print(a + b)
`;

export default function ScratchRunner() {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [stdin, setStdin] = useState<string>("2 3\n");
  const [out, setOut] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [meta, setMeta] = useState<{time_ms:number;memory_kb:number;status:string}|null>(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setOut(""); setErr(""); setMeta(null);
    const res = await fetch("/api/snippet", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ code, stdin })
    });
    const json = await res.json();
    setOut(json.stdout || "");
    setErr(json.stderr || "");
    setMeta({ time_ms: json.time_ms, memory_kb: json.memory_kb, status: json.status });
    setRunning(false);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🧪 Run Code (Python)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border rounded-lg overflow-hidden">
          <Editor
            height="360px"
            defaultLanguage="python"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
          />
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Standard Input (stdin)</label>
            <textarea
              className="w-full h-32 border rounded p-2"
              value={stdin}
              onChange={(e)=>setStdin(e.target.value)}
            />
          </div>

          <button
            onClick={run}
            disabled={running}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {running ? "Running…" : "Run"}
          </button>

          {meta && (
            <div className="text-sm text-gray-600">
              <b>Status:</b> {meta.status} • <b>Time:</b> {meta.time_ms} ms • <b>Memory:</b> {meta.memory_kb} KB
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Stdout</label>
            <pre className="w-full h-32 border rounded p-2 overflow-auto bg-gray-50">{out || "—"}</pre>
          </div>

          <div>
            <label className="block text-sm mb-1">Stderr</label>
            <pre className="w-full h-24 border rounded p-2 overflow-auto bg-gray-50 text-red-700">
              {err || "—"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
