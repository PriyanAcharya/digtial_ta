import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "src/app/lib/firebaseAdmin"; // relative, no alias

export async function POST(req: NextRequest) {
  const { idToken, role, instructorSecret } = await req.json();

  if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 400 });

  const decoded = await adminAuth.verifyIdToken(idToken);

  // (optional) set/overwrite role claim
  if (role) {
    if (role === "instructor") {
      const need = process.env.INSTRUCTOR_SECRET || "supersecret";
      if (instructorSecret !== need) {
        return NextResponse.json({ error: "invalid instructor secret" }, { status: 401 });
      }
    }
    await adminAuth.setCustomUserClaims(decoded.uid, { role });
  }

  const expiresIn = 1000 * 60 * 60 * 24 * 7; // 7 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("fb_session", sessionCookie, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: expiresIn / 1000,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("fb_session", "", { path: "/", maxAge: 0 });
  return res;
}
