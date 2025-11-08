"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { auth } from "../firebase"; // ← from your simple client file
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [role, setRole] = useState<"student"|"instructor">("student");
  const [secret, setSecret] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function finish(roleOpt: "student"|"instructor") {
    const user = auth.currentUser;
    if (!user) return setErr("Not signed in");
    const idToken = await user.getIdToken(true);

    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken,
        role: roleOpt,
        instructorSecret: roleOpt === "instructor" ? secret : undefined,
      }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Session failed");
      return;
    }
    router.push(next !== "/login" ? next : roleOpt === "instructor" ? "/instructor" : "/student");
  }

  async function google() {
    setErr("");
    try { await signInWithPopup(auth, provider); await finish(role); }
    catch (e:any) { setErr(e.message || "Google sign-in failed"); }
  }

  async function emailPass(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try { await signInWithEmailAndPassword(auth, email, password); await finish(role); }
    catch (e:any) { setErr(e.message || "Email sign-in failed"); }
  }

  return (
    <div className="p-8 max-w-md mx-auto space-y-3">
      <h1 className="text-2xl font-bold">Sign in</h1>

      <div>
        <label className="block text-sm mb-1">Role</label>
        <select value={role} onChange={(e)=>setRole(e.target.value as any)} className="w-full border rounded p-2">
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
      </div>

      {role === "instructor" && (
        <div>
          <label className="block text-sm mb-1">Instructor Secret</label>
          <input className="w-full border rounded p-2" value={secret} onChange={(e)=>setSecret(e.target.value)} placeholder="supersecret" />
        </div>
      )}

      <button onClick={google} className="bg-red-600 text-white px-4 py-2 rounded w-full">
        Continue with Google
      </button>

      <div className="text-center text-sm text-gray-500">or</div>

      <form onSubmit={emailPass} className="space-y-2">
        <input className="w-full border rounded p-2" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">Continue with Email</button>
      </form>

      {err && <div className="text-red-600 text-sm">{err}</div>}
    </div>
  );
}
