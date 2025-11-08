
"use client";
import { useEffect, useState } from "react";
import { auth } from "../firebase";   // ← simple relative path

export default function TestFirebasePage() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h1>🔥 Firebase Auth Test</h1>
      {user ? <p>✅ Logged in as {user.email || user.uid}</p> : <p>❌ No user logged in</p>}
    </div>
  );
}
