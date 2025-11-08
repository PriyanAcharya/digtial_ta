"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";

  const [name, setName] = useState("");
  const [role, setRole] = useState<"student"|"instructor">("student");
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        role,
        instructorSecret: role === "instructor" ? secret : undefined,
      }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Login failed");
      return;
    }
    // send users to appropriate area (or ?next=…)
    if (next && next !== "/login") router.push(next);
    else router.push(role === "instructor" ? "/instructor" : "/student");
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            value={name} onChange={(e)=>setName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g., Student One"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Role</label>
          <select value={role} onChange={(e)=>setRole(e.target.value as any)}
            className="w-full border rounded p-2"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>

        {role === "instructor" && (
          <div>
            <label className="block text-sm mb-1">Instructor Secret</label>
            <input
              value={secret} onChange={(e)=>setSecret(e.target.value)}
              className="w-full border rounded p-2" placeholder="supersecret" required
            />
          </div>
        )}

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
