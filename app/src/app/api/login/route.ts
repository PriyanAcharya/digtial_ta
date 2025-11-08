import { NextRequest, NextResponse } from "next/server";
import { signJWT } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, role, instructorSecret } = await req.json();

  if (!name || !role) {
    return NextResponse.json({ error: "name and role are required" }, { status: 400 });
  }

  // Simple gate for instructor
  if (role === "instructor") {
    const need = process.env.INSTRUCTOR_SECRET || "supersecret";
    if (instructorSecret !== need) {
      return NextResponse.json({ error: "invalid instructor secret" }, { status: 401 });
    }
  }

  const token = signJWT({ name, role }, process.env.APP_SECRET || "dev");

  const res = NextResponse.json({ ok: true, role, name });
  res.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
